"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GameDetail } from "@/lib/fitgirl";
import { AdBanner } from "@/components/AdBanner";
import {
  Gamepad2,
  HardDrive,
  Layers,
  Sparkles,
  ArrowLeft,
  Calendar,
  Building,
  Globe2,
  FileArchive,
  DownloadCloud,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

function GameDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"fuckingfast" | "datanodes" | "filekeeper">("fuckingfast");

  useEffect(() => {
    if (!id) {
      setError("No game specified");
      setLoading(false);
      return;
    }

    const fetchGame = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/game?id=${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("Failed to load game details");
        const data = await res.json();
        setGame(data.game);
      } catch (err: any) {
        setError(err.message || "Failed to load game");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const [selectedBatch, setSelectedBatch] = useState<number>(1);

  const parts = game?.downloads[activeTab]?.coreRar || [];
  const partsCount = parts.length || 1;
  const BATCH_SIZE = 10;
  const totalBatches = Math.ceil(partsCount / BATCH_SIZE);
  const batches = Array.from({ length: totalBatches }, (_, i) => {
    const start = i * BATCH_SIZE + 1;
    const end = Math.min((i + 1) * BATCH_SIZE, partsCount);
    return { batchNum: i + 1, start, end, label: `Parts ${start}–${end}` };
  });

  const handleStartRequest = (batchNum?: number) => {
    if (!game) return;
    const chosenNum = batchNum || selectedBatch;
    const b = batches.find((x) => x.batchNum === chosenNum) || batches[0];
    // Store in sessionStorage for multi-step verification
    if (typeof window !== "undefined") {
      sessionStorage.setItem("filmfeed_game_request", JSON.stringify(game));
      sessionStorage.setItem("filmfeed_game_batch", JSON.stringify(b));
    }
    router.push(`/verify/step-1?id=${game.id}&batch=${b.batchNum}&parts=${b.start}-${b.end}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-accent-purple/20 border-t-accent-purple animate-spin" />
        <span className="text-xs uppercase tracking-widest text-gray-500 font-mono">
          Loading Game Specs & RAR Parts...
        </span>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Gamepad2 className="h-16 w-16 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-white">Could not find game</h2>
        <p className="mt-2 text-xs text-gray-400">{error || "Game details unavailable."}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface-card border border-white/10 px-4 py-2 text-xs font-bold text-white hover:border-white/20 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Games Hub</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to All Games</span>
      </Link>

      {/* Hero Overview Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface-card p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="relative aspect-[3/4] w-full max-w-[280px] shrink-0 mx-auto md:mx-0 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl">
            {game.poster ? (
              <img
                src={game.poster}
                alt={game.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface font-mono text-xs text-gray-600">
                NO POSTER
              </div>
            )}
            <div className="absolute top-3 left-3 rounded-lg bg-black/80 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-white/10 backdrop-blur-md">
              {game.repackSize}
            </div>
          </div>

          {/* Details & Specs */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-[11px] font-bold text-accent-purple">
                <Sparkles className="h-3 w-3 text-yellow-400" />
                <span>FitGirl Repack • Lossless PC Game</span>
              </div>

              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {game.title}
              </h1>

              <p className="mt-2 text-xs text-gray-400 font-medium">{game.genres}</p>

              {/* Specs Grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/5 bg-surface/80 p-3">
                  <span className="text-[10px] uppercase font-mono text-gray-500">Repack Size</span>
                  <p className="mt-1 text-sm font-bold text-emerald-400">{game.repackSize}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-surface/80 p-3">
                  <span className="text-[10px] uppercase font-mono text-gray-500">Original Size</span>
                  <p className="mt-1 text-sm font-bold text-gray-300 line-through decoration-rose-500/70">{game.originalSize}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-surface/80 p-3">
                  <span className="text-[10px] uppercase font-mono text-gray-500">Total Parts</span>
                  <p className="mt-1 text-sm font-bold text-accent-purple">{partsCount} Parts (500MB)</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-surface/80 p-3">
                  <span className="text-[10px] uppercase font-mono text-gray-500">Companies</span>
                  <p className="mt-1 text-xs font-semibold text-gray-200 line-clamp-1">{game.companies}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-surface/80 p-3">
                  <span className="text-[10px] uppercase font-mono text-gray-500">Languages</span>
                  <p className="mt-1 text-xs font-semibold text-gray-200 line-clamp-1">{game.languages}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-surface/80 p-3">
                  <span className="text-[10px] uppercase font-mono text-gray-500">Release Date</span>
                  <p className="mt-1 text-xs font-semibold text-gray-200">{game.date}</p>
                </div>
              </div>
            </div>

            {/* Batch Selector if more than 10 parts */}
            {totalBatches > 1 && (
              <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-surface/90 border border-white/10 p-4">
                <span className="text-xs font-bold text-gray-200 font-mono flex items-center gap-2">
                  <Layers className="h-4 w-4 text-accent-cyan" />
                  <span>SELECT DOWNLOAD BATCH (10 PARTS PER REQUEST):</span>
                </span>
                <p className="text-[11px] text-gray-400">
                  Select which 10-part batch to deliver to WhatsApp. You can request each batch sequentially!
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {batches.map((b) => (
                    <button
                      key={b.batchNum}
                      onClick={() => setSelectedBatch(b.batchNum)}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                        selectedBatch === b.batchNum
                          ? "bg-accent-purple text-white border-accent-purple shadow-lg shadow-accent-purple/30 scale-105"
                          : "bg-surface-card border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      Batch {b.batchNum} ({b.label})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Big Action CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-white/10 pt-6">
              <button
                onClick={() => handleStartRequest(selectedBatch)}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-accent-cyan px-8 py-4 text-sm font-black text-black shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                <MessageSquare className="h-5 w-5 fill-black" />
                <span>
                  {totalBatches > 1
                    ? `REQUEST BATCH ${selectedBatch} (${batches[selectedBatch - 1]?.label}) VIA WHATSAPP 🚀`
                    : `REQUEST ALL ${partsCount} PARTS VIA WHATSAPP 🚀`}
                </span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>3-Step Ad Verification Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Banner Mid */}
      <AdBanner label="High Speed Cloud Mirror" />

      {/* Direct Parts Section */}
      <div className="rounded-3xl border border-white/10 bg-surface-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileArchive className="h-5 w-5 text-accent-purple" />
              <span>Multi-Part Archive Mirrors ({partsCount} Parts)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Each part is exactly ~500MB. Download all parts or request them via WhatsApp to assemble the complete installer.
            </p>
          </div>

          {/* Mirror Tabs */}
          <div className="flex items-center gap-2 rounded-xl bg-surface p-1 border border-white/5">
            <button
              onClick={() => setActiveTab("fuckingfast")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "fuckingfast"
                  ? "bg-accent-purple text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              FuckingFast (Fastest)
            </button>
            <button
              onClick={() => setActiveTab("datanodes")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "datanodes"
                  ? "bg-accent-purple text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              DataNodes
            </button>
            <button
              onClick={() => setActiveTab("filekeeper")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "filekeeper"
                  ? "bg-accent-purple text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              FileKeeper
            </button>
          </div>
        </div>

        {/* Parts Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
          {parts.map((link, idx) => {
            const partNum = idx + 1;
            return (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-surface/70 p-3 hover:border-accent-purple/40 hover:bg-surface transition-all"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple font-mono font-bold text-xs group-hover:bg-accent-purple group-hover:text-white transition-all">
                    P{partNum}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-xs font-bold text-white group-hover:text-accent-pink transition-colors">
                      Part {partNum} (500 MB)
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono truncate">{activeTab.toUpperCase()}</span>
                  </div>
                </div>

                <DownloadCloud className="h-4 w-4 text-gray-400 group-hover:text-emerald-400 transition-colors shrink-0" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function GameDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-accent-purple/20 border-t-accent-purple animate-spin" />
        </div>
      }
    >
      <GameDetailContent />
    </Suspense>
  );
}
