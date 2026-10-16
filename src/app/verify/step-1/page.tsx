"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Timer, ArrowRight, Gamepad2, AlertCircle } from "lucide-react";
import AdBanner from "@/components/AdBanner";
import type { FitGirlGameDetails } from "@/lib/fitgirl";

function Step1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("id");

  const [game, setGame] = useState<FitGirlGameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(8);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!gameId) return;
    fetch(`/api/game?id=${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.game) setGame(data.game);
      })
      .catch((err) => console.error("Failed to fetch game:", err))
      .finally(() => setLoading(false));
  }, [gameId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown]);

  const partsParam = searchParams.get("parts") || "";
  const batchParam = searchParams.get("batch") || "";

  const handleProceed = () => {
    if (!isReady || !gameId) return;
    router.push(`/verify/step-2?id=${gameId}&batch=${batchParam}&parts=${partsParam}&token1=${Date.now()}`);
  };

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6 pb-12">
      {/* Step Header */}
      <div className="rounded-3xl border border-white/10 bg-surface-card p-6 sm:p-8 text-center shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-3">
          <ShieldCheck className="h-4 w-4" />
          <span>Verification Step 1 of 3</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white">
          Securing High-Speed Game Archives
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Please wait for security verification to generate direct WhatsApp bot multi-part download tokens.
        </p>

        {/* Progress bar */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-2 w-16 rounded-full bg-accent-purple" />
          <div className="h-2 w-16 rounded-full bg-white/10" />
          <div className="h-2 w-16 rounded-full bg-white/10" />
        </div>

        {/* Game summary preview */}
        {game && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-surface px-4 py-2 border border-white/5 text-left">
            <Gamepad2 className="h-5 w-5 text-accent-purple shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate max-w-xs">{game.title}</p>
              <p className="text-[10px] text-gray-400 font-mono">
                {game.originalSize || "Repack Archive"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ad Banner Top */}
      <AdBanner label="Sponsor Cloud Network" />

      {/* Timer / Action Box */}
      <div className="rounded-3xl border border-white/10 bg-surface-card p-8 text-center shadow-xl flex flex-col items-center">
        {!isReady ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-4 border-accent-purple/20 border-t-accent-purple animate-spin">
              <Timer className="h-8 w-8 text-accent-purple animate-pulse" />
            </div>
            <div className="text-sm font-bold text-gray-300">
              Generating secure gateway in{" "}
              <span className="font-mono text-accent-purple font-black text-lg">{countdown}s</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Verification helps maintain unlimited high-speed bandwidth for all users.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-white">Step 1 Complete!</h2>
            <p className="text-xs text-gray-400 max-w-sm">
              Your session has been validated. Click below to continue to Step 2.
            </p>
            <button
              onClick={handleProceed}
              className="mt-2 w-full max-w-md flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-purple to-pink-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Continue to Step 2</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Ad Banner Bottom */}
      <AdBanner label="High Speed Cloud Mirror" />
    </div>
  );
}

export default function Step1Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" />
        </div>
      }
    >
      <Step1Content />
    </Suspense>
  );
}
