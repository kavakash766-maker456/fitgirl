"use client";

import React from "react";
import Link from "next/link";
import { GameSearchResult } from "@/lib/fitgirl";
import { HardDrive, Layers, ArrowRight, Sparkles } from "lucide-react";

interface GameCardProps {
  game: GameSearchResult;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link
      href={`/game?id=${game.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-card transition-all duration-300 hover:-translate-y-1 hover:border-accent-purple/50 hover:shadow-xl hover:shadow-accent-purple/10"
    >
      {/* Poster Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
        {game.poster ? (
          <img
            src={game.poster}
            alt={game.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-surface-card text-gray-600 font-mono text-xs">
            NO POSTER
          </div>
        )}

        {/* Repack Size Badge */}
        <div className="absolute top-2.5 left-2.5 rounded-lg bg-black/80 px-2.5 py-1 backdrop-blur-md border border-white/10 text-[10px] font-bold text-emerald-400 flex items-center gap-1 shadow-md">
          <HardDrive className="h-3 w-3" />
          <span>{game.repackSize}</span>
        </div>

        {/* Parts Count Pill */}
        <div className="absolute top-2.5 right-2.5 rounded-lg bg-accent-purple/90 px-2.5 py-1 text-[10px] font-extrabold text-white flex items-center gap-1 shadow-md">
          <Layers className="h-3 w-3" />
          <span>{game.partsCount} Parts (500MB)</span>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151a23] via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 text-sm font-bold text-white group-hover:text-accent-pink transition-colors">
            {game.title}
          </h3>
          <p className="mt-1 text-[11px] text-gray-400 line-clamp-1">
            {game.genres}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-mono">Original Size</span>
            <span className="text-[11px] font-medium text-gray-300 line-through decoration-rose-500/70">{game.originalSize}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-accent-purple/10 px-3 py-1.5 text-xs font-bold text-accent-purple group-hover:bg-accent-purple group-hover:text-white transition-all">
            <span>Get Parts</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
