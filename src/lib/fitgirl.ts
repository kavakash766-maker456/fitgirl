import * as cheerio from "cheerio";

const BASE_API = "https://fitgirl-repacks.site/wp-json/wp/v2";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export interface GameSearchResult {
  id: number;
  slug: string;
  title: string;
  url: string;
  date: string;
  poster: string;
  genres: string;
  originalSize: string;
  repackSize: string;
  partsCount: number;
}

export interface GameDownloadMirror {
  coreRar: string[];
  optional: string[];
  count: number;
}

export interface GameDetail {
  id: number;
  slug: string;
  title: string;
  url: string;
  link?: string;
  date: string;
  poster: string;
  genres: string;
  companies: string;
  languages: string;
  originalSize: string;
  repackSize: string;
  description?: string;
  downloads: {
    fuckingfast: GameDownloadMirror;
    datanodes: GameDownloadMirror;
    filekeeper: GameDownloadMirror;
    magnets: string[];
  };
}

export type FitGirlGameDetails = GameDetail;

const SKIP_KEYWORDS = ["upcoming repacks", "all my repacks", "donation", "support fitgirl"];

function cleanHtml(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<[^>]+>/g, "")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .trim();
}

function parsePostToGame(post: any): GameSearchResult | null {
  const title = cleanHtml(post.title?.rendered || "");
  if (!title || SKIP_KEYWORDS.some((kw) => title.toLowerCase().includes(kw))) {
    return null;
  }

  const content = post.content?.rendered || "";
  const $ = cheerio.load(content);

  // Poster: look for alignleft or first content image
  let poster =
    $("img.alignleft").attr("src") ||
    $("p img").first().attr("src") ||
    $("img").first().attr("src") ||
    post.jetpack_featured_media_url ||
    "";

  // Genres
  let genres = "";
  const genresMatch = content.match(/Genres\/Tags:.*?(?=<br|<\/p)/i);
  if (genresMatch) {
    genres = cleanHtml(genresMatch[0]).replace(/Genres\/Tags:/i, "").trim().replace(/^,|,$/g, "");
  }

  // Original & Repack Size
  let originalSize = "";
  const origMatch = content.match(/Original Size[:\s]*(<strong>.*?<\/strong>|.*?)(?:<br|<\/p)/i);
  if (origMatch) {
    originalSize = cleanHtml(origMatch[1]);
  }

  let repackSize = "";
  const repackMatch = content.match(/Repack Size:.*?<strong>(.*?)<\/strong>/i);
  if (repackMatch) {
    repackSize = cleanHtml(repackMatch[1]);
  }

  // Parts Count (FuckingFast or DataNodes)
  const ffMatches = content.match(/href="(https:\/\/fuckingfast\.co\/[^"]+)"/g) || [];
  const dnMatches = content.match(/href="(https:\/\/datanodes\.to\/[^"]+)"/g) || [];
  const partsCount = Math.max(ffMatches.length, dnMatches.length, 1);

  return {
    id: post.id,
    slug: post.slug,
    title,
    url: post.link,
    date: (post.date || "").slice(0, 10),
    poster,
    genres: genres || "PC Game • Repack",
    originalSize: originalSize || "N/A",
    repackSize: repackSize || "500MB Parts",
    partsCount,
  };
}

export async function fetchLatestGames(page: number = 1): Promise<{ games: GameSearchResult[]; totalPages: number }> {
  try {
    const res = await fetch(`${BASE_API}/posts?per_page=20&page=${page}&orderby=date&order=desc`, {
      headers: { "User-Agent": UA },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return { games: [], totalPages: 1 };

    const totalPages = parseInt(res.headers.get("x-wp-totalpages") || "100", 10);
    const data = await res.json();
    const games: GameSearchResult[] = [];

    for (const post of data) {
      const g = parsePostToGame(post);
      if (g) games.push(g);
    }

    return { games, totalPages };
  } catch (err) {
    console.error("Error fetching latest games:", err);
    return { games: [], totalPages: 1 };
  }
}

export async function searchGames(query: string): Promise<GameSearchResult[]> {
  try {
    if (!query || query.trim() === "") return [];
    const res = await fetch(`${BASE_API}/posts?per_page=20&search=${encodeURIComponent(query)}&orderby=relevance`, {
      headers: { "User-Agent": UA },
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const games: GameSearchResult[] = [];

    for (const post of data) {
      const g = parsePostToGame(post);
      if (g) games.push(g);
    }

    return games;
  } catch (err) {
    console.error("Error searching games:", err);
    return [];
  }
}

export async function getGameDetails(idOrSlug: string): Promise<GameDetail | null> {
  try {
    let post: any = null;
    const isNum = /^\d+$/.test(idOrSlug);

    if (isNum) {
      const res = await fetch(`${BASE_API}/posts/${idOrSlug}`, {
        headers: { "User-Agent": UA },
        next: { revalidate: 3600 },
      });
      if (res.ok) post = await res.json();
    } else {
      const res = await fetch(`${BASE_API}/posts?slug=${encodeURIComponent(idOrSlug)}`, {
        headers: { "User-Agent": UA },
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const arr = await res.json();
        if (arr && arr.length > 0) post = arr[0];
      }
    }

    if (!post) return null;

    const title = cleanHtml(post.title?.rendered || "");
    const content = post.content?.rendered || "";
    const $ = cheerio.load(content);

    let poster =
      $("img.alignleft").attr("src") ||
      $("p img").first().attr("src") ||
      $("img").first().attr("src") ||
      post.jetpack_featured_media_url ||
      "";

    // Fields
    const findField = (label: string): string => {
      const m = content.match(new RegExp(`${label}[:\\s]*(<strong>.*?<\\/strong>|.*?)(?:<br|<\\/p|<p>)`, "i"));
      return m ? cleanHtml(m[1]).replace(/^,|,$/g, "").trim() : "";
    };

    let genres = "";
    const gm = content.match(/Genres\/Tags:.*?(?=<br|<\/p)/i);
    if (gm) {
      genres = cleanHtml(gm[0]).replace(/Genres\/Tags:/i, "").trim().replace(/^,|,$/g, "");
    }

    const companies = findField("Companies");
    const languages = findField("Languages");
    const originalSize = findField("Original Size");

    let repackSize = "";
    const rs = content.match(/Repack Size:.*?<strong>(.*?)<\/strong>/i);
    if (rs) repackSize = cleanHtml(rs[1]);

    // Download links
    const ffAll = Array.from(content.matchAll(/href="(https:\/\/fuckingfast\.co\/[^"]+)"/g)).map((m: any) => m[1] as string);
    const dnAll = Array.from(content.matchAll(/href="(https:\/\/datanodes\.to\/[^"]+)"/g)).map((m: any) => m[1] as string);
    const fkAll = Array.from(content.matchAll(/href="(https:\/\/filekeeper\.net\/[^"]+)"/g)).map((m: any) => m[1] as string);
    const magnets = Array.from(content.matchAll(/(magnet:\?xt=urn:btih:[^\s"'<>]+)/g)).map((m: any) => m[1] as string);

    const splitLinks = (links: string[]): { coreRar: string[]; optional: string[]; count: number } => {
      const coreRar = links.filter((l) => l.toLowerCase().includes(".part") && l.toLowerCase().includes(".rar"));
      const optional = links.filter((l) => l.toLowerCase().includes("optional") || l.toLowerCase().endsWith(".bin"));
      const fallbackCore = coreRar.length > 0 ? coreRar : links.filter((l) => !optional.includes(l));
      return { coreRar: fallbackCore, optional, count: links.length };
    };

    return {
      id: post.id,
      slug: post.slug,
      title,
      url: post.link,
      link: post.link,
      date: (post.date || "").slice(0, 10),
      poster,
      genres: genres || "PC Game • Repack",
      companies: companies || "FitGirl Repacks",
      languages: languages || "English",
      originalSize: originalSize || "N/A",
      repackSize: repackSize || "500MB Parts",
      description: cleanHtml($("p").slice(1, 4).text() || ""),
      downloads: {
        fuckingfast: splitLinks(ffAll),
        datanodes: splitLinks(dnAll),
        filekeeper: splitLinks(fkAll),
        magnets,
      },
    };
  } catch (err) {
    console.error("Error getting game details:", err);
    return null;
  }
}
