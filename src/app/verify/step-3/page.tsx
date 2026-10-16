"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Timer,
  MessageSquare,
  CheckCircle2,
  Gamepad2,
  Layers,
  HardDrive,
  Copy,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import AdBanner from "@/components/AdBanner";
import type { FitGirlGameDetails } from "@/lib/fitgirl";

function Step3Content() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("id");

  const [game, setGame] = useState<FitGirlGameDetails | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate unique random verification token
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    setToken(`GF-${randomHex}`);

    if (!gameId) return;
    fetch(`/api/game?id=${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.game) setGame(data.game);
      })
      .catch((err) => console.error("Failed to fetch game:", err));
  }, [gameId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown]);

  const parts =
    game?.downloads?.fuckingfast?.coreRar?.length
      ? game.downloads.fuckingfast.coreRar
      : game?.downloads?.datanodes?.coreRar?.length
      ? game.downloads.datanodes.coreRar
      : [];
  const partsCount = parts.length || 1;

  // Bot WhatsApp number
  const botNumber = "94760372547";
  const gameUrl = game?.link || `https://fitgirl-repacks.site/?p=${gameId}`;
  const requestMessage = `!req_game ${gameUrl} | ${partsCount} parts | TOKEN: #${token}`;
  const waUrl = `https://wa.me/${botNumber}?text=${encodeURIComponent(requestMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(requestMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-surface-card p-6 sm:p-8 text-center shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-3">
          <Sparkles className="h-4 w-4" />
          <span>Final Step: Verified & Ready</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white">
          WhatsApp Bot Download Token Ready
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          All 3 verification steps completed. Your game archive parts are ready for WhatsApp delivery!
        </p>

        {/* Progress bar complete */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-2 w-16 rounded-full bg-accent-purple" />
          <div className="h-2 w-16 rounded-full bg-accent-cyan" />
          <div className="h-2 w-16 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Ad Banner Top */}
      <AdBanner label="VIP Cloud Sponsor" />

      {/* Timer or Final Action Card */}
      <div className="rounded-3xl border border-white/10 bg-surface-card p-6 sm:p-8 shadow-xl flex flex-col items-center">
        {!isReady ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin">
              <Timer className="h-8 w-8 text-emerald-400 animate-pulse" />
            </div>
            <div className="text-sm font-bold text-gray-300">
              Generating verified token in{" "}
              <span className="font-mono text-emerald-400 font-black text-lg">{countdown}s</span>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Game Badge */}
            {game && (
              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-surface p-4 border border-white/5">
                <div className="h-12 w-12 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <div className="flex-1 text-center sm:text-left overflow-hidden">
                  <h3 className="font-bold text-white text-base truncate">{game.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1 font-mono text-accent-cyan">
                      <Layers className="h-3.5 w-3.5" /> {partsCount} RAR Parts (~500MB each)
                    </span>
                    <span className="flex items-center gap-1 font-mono text-emerald-400">
                      <HardDrive className="h-3.5 w-3.5" /> {game.repackSize || "Full Repack"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Token Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                Verified Security Token
              </span>
              <div className="mt-1 font-mono text-2xl font-black tracking-wider text-white">
                #{token}
              </div>
            </div>

            {/* Big WhatsApp CTA Button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-6 py-4 text-base font-black text-black shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageSquare className="h-6 w-6 fill-black" />
              <span>REQUEST ALL {partsCount} PARTS VIA WHATSAPP BOT 🚀</span>
            </a>

            {/* Copy Command Fallback */}
            <div className="flex flex-col gap-2 rounded-xl bg-surface p-3 border border-white/5">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Or copy command manually:</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 font-bold text-accent-cyan hover:underline text-xs"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <code className="rounded-lg bg-black/60 p-2 text-xs font-mono text-gray-300 break-all border border-white/5">
                {requestMessage}
              </code>
            </div>

            {/* Bot Delivery Guarantee Notice */}
            <div className="rounded-xl border border-white/5 bg-surface/50 p-4 text-xs text-gray-400 leading-relaxed">
              <span className="font-bold text-white flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Automatic Multi-Part Sequential Delivery:
              </span>
              Our FilmFeed Auto-Bot processes each game request by downloading all ~500MB RAR parts in order (Part 1, Part 2, ... Part {partsCount}) and delivering each one as a bailey document file directly to your WhatsApp.
            </div>

            {/* Back link */}
            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
              >
                ← Back to Game Catalogue
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Ad Banner Bottom */}
      <AdBanner label="High Speed Cloud Mirror" />
    </div>
  );
}

export default function Step3Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
        </div>
      }
    >
      <Step3Content />
    </Suspense>
  );
}
