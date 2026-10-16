"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Timer, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import AdBanner from "@/components/AdBanner";
import type { FitGirlGameDetails } from "@/lib/fitgirl";

function Step2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("id");

  const [game, setGame] = useState<FitGirlGameDetails | null>(null);
  const [countdown, setCountdown] = useState(8);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
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

  const handleProceed = () => {
    if (!isReady || !gameId) return;
    router.push(`/verify/step-3?id=${gameId}&token2=${Date.now()}`);
  };

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6 pb-12">
      {/* Step Header */}
      <div className="rounded-3xl border border-white/10 bg-surface-card p-6 sm:p-8 text-center shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-accent-cyan border border-cyan-500/20 mb-3">
          <Zap className="h-4 w-4" />
          <span>Verification Step 2 of 3</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white">
          Allocating WhatsApp Bot Bandwidth
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Preparing 500MB RAR multipart downloader stream buffers. Final token will be unlocked next.
        </p>

        {/* Progress bar */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-2 w-16 rounded-full bg-accent-purple" />
          <div className="h-2 w-16 rounded-full bg-accent-cyan" />
          <div className="h-2 w-16 rounded-full bg-white/10" />
        </div>

        {game && (
          <div className="mt-4 text-xs font-semibold text-gray-300">
            Target Game: <span className="text-accent-cyan font-bold">{game.title}</span>
          </div>
        )}
      </div>

      {/* Ad Banner Top */}
      <AdBanner label="High Speed Cloud Mirror" />

      {/* Timer / Action Box */}
      <div className="rounded-3xl border border-white/10 bg-surface-card p-8 text-center shadow-xl flex flex-col items-center">
        {!isReady ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-4 border-accent-cyan/20 border-t-accent-cyan animate-spin">
              <Timer className="h-8 w-8 text-accent-cyan animate-pulse" />
            </div>
            <div className="text-sm font-bold text-gray-300">
              Finalizing encryption tunnel in{" "}
              <span className="font-mono text-accent-cyan font-black text-lg">{countdown}s</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Please do not refresh or close this tab while the session connects.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="h-14 w-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-accent-cyan">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-white">Step 2 Verified!</h2>
            <p className="text-xs text-gray-400 max-w-sm">
              Tunnel allocated. Click below to proceed to the final step to generate your WhatsApp command.
            </p>
            <button
              onClick={handleProceed}
              className="mt-2 w-full max-w-md flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-cyan to-blue-600 px-6 py-4 text-sm font-black text-black shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Continue to Final Step</span>
              <ArrowRight className="h-5 w-5 text-black" />
            </button>
          </div>
        )}
      </div>

      {/* Ad Banner Bottom */}
      <AdBanner label="Sponsor Cloud Network" />
    </div>
  );
}

export default function Step2Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
        </div>
      }
    >
      <Step2Content />
    </Suspense>
  );
}
