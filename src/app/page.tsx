"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GameSearchResult } from "@/lib/fitgirl";
import { GameCard } from "@/components/GameCard";
import { AdBanner } from "@/components/AdBanner";
import {
  Gamepad2,
  Sparkles,
  Flame,
  Search,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Layers,
  Zap,
} from "lucide-react";

const GENRES = [
  "All",
  "Action",
  "RPG",
  "Open World",
  "Shooter",
  "Horror",
  "Adventure",
  "Racing",
  "Strategy",
  "Simulation",
];

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [games, setGames] = useState<GameSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(pageParam > 0 ? pageParam : 1);
  const [totalPages, setTotalPages] = useState(50);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const loadGames = useCallback(async (page: number, query: string) => {
    setLoading(true);
    try {
      let endpoint = `/api/games?page=${page}`;
      if (query.trim()) {
        endpoint = `/api/search?q=${encodeURIComponent(query.trim())}`;
      }
      const res = await fetch(endpoint);
      const data = await res.json();
      if (query.trim()) {
        setGames(data.results || []);
        setTotalPages(1);
      } else {
        setGames(data.games || []);
        setTotalPages(data.totalPages || 50);
      }
    } catch (e) {
      console.error("Failed to load games:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(pageParam > 0 ? pageParam : 1);
    setLocalSearch(searchQuery);
    loadGames(pageParam > 0 ? pageParam : 1, searchQuery);
  }, [pageParam, searchQuery, loadGames]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    router.push(`/?page=${newPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    if (genre === "All") {
      router.push("/");
    } else {
      router.push(`/?search=${encodeURIComponent(genre)}`);
    }
  };

  const filteredGames = games.filter((g) => {
    if (selectedGenre === "All" || searchQuery) return true;
    return g.genres.toLowerCase().includes(selectedGenre.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      {!searchQuery && (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-surface-card via-[#121620] to-surface p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3.5 py-1 text-xs font-bold text-accent-purple">
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              <span>ULTRA-COMPRESSED PC REPACKS • 500MB DIRECT PARTS</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Get Any PC Game Delivered to Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-accent-cyan">
                WhatsApp Directly
              </span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
              Browse over 7,000+ lossless FitGirl repacks split into ultra-stable 500MB RAR parts.
              Request your favorite game and our High-Speed Bot will deliver all parts directly to your WhatsApp!
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-300">
              <div className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-white/5">
                <HardDrive className="h-4 w-4 text-emerald-400" />
                <span>Lossless Compression</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-white/5">
                <Layers className="h-4 w-4 text-accent-purple" />
                <span>500MB FuckingFast Parts</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 border border-white/5">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span>Direct WhatsApp Delivery</span>
              </div>
            </div>
          </div>

          {/* Background Decorative Glow */}
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-accent-purple/15 blur-3xl pointer-events-none" />
          <div className="absolute right-40 bottom-0 -mb-20 h-60 w-60 rounded-full bg-accent-pink/15 blur-3xl pointer-events-none" />
        </div>
      )}

      {/* Ad Banner Top */}
      <AdBanner label="Featured Gaming Sponsor" />

      {/* Category Pills & Filters */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                selectedGenre === genre && !searchQuery
                  ? "bg-accent-purple text-white shadow-lg shadow-accent-purple/20"
                  : "border border-white/10 bg-surface-card text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2 text-xs text-gray-400 whitespace-nowrap">
            <span>Results for: <b className="text-white">"{searchQuery}"</b></span>
            <button
              onClick={() => router.push("/")}
              className="text-accent-pink underline hover:text-white"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] w-full rounded-2xl border border-white/5 bg-surface-card animate-pulse"
            />
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Gamepad2 className="h-16 w-16 text-gray-600 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-white">No games found</h3>
          <p className="mt-1 text-xs text-gray-500">Try searching with a different game name or keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!searchQuery && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-surface-card px-4 py-2 text-xs font-bold text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono text-gray-400 px-3">
            Page <b className="text-white">{currentPage}</b> of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-surface-card px-4 py-2 text-xs font-bold text-white hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bottom Ad */}
      <AdBanner label="High Speed Cloud Downloads" />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-accent-purple/20 border-t-accent-purple animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
