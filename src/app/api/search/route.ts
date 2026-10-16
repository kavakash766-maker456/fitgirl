import { NextRequest, NextResponse } from "next/server";
import { searchGames } from "@/lib/fitgirl";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim() === "") {
    return NextResponse.json({ results: [] });
  }

  const results = await searchGames(q);
  return NextResponse.json({ results });
}
