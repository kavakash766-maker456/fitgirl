import { NextRequest, NextResponse } from "next/server";
import { fetchLatestGames } from "@/lib/fitgirl";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);

  const { games, totalPages } = await fetchLatestGames(page);

  return NextResponse.json({
    games,
    page,
    totalPages,
  });
}
