import { NextRequest, NextResponse } from "next/server";
import { getGameDetails } from "@/lib/fitgirl";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  const query = id || slug;
  if (!query) {
    return NextResponse.json({ error: "Missing game id or slug" }, { status: 400 });
  }

  const game = await getGameDetails(query);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json({ game });
}
