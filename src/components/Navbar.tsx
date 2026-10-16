"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Gamepad2, Sparkles, MessageSquare, Flame } from "lucide-react";

export const Navbar: React.FC = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08090c]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-accent-purple to-accent-pink shadow-lg shadow-accent-purple/30 group-hover:scale-105 transition-transform">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-white text-lg flex items-center gap-2">
              FILMFEED <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-pink">GAMES</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
              FitGirl Repacks • Direct Parts ⚡
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 7,000+ PC Games (e.g. GTA V, Elden Ring, God of War)..."
              className="w-full rounded-full border border-white/10 bg-surface/80 px-4 py-2 pl-10 text-xs text-white placeholder-gray-500 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 rounded-full bg-accent-purple/20 px-3 py-1 text-[10px] font-bold text-accent-purple hover:bg-accent-purple hover:text-white transition-all"
            >
              Search
            </button>
          </div>
        </form>

        {/* WhatsApp & Community Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://chat.whatsapp.com/G55q3N6d65gK8O7H2z"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden md:inline">WhatsApp Group</span>
          </a>

          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-purple to-accent-pink px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-accent-purple/20 hover:opacity-90 transition-opacity"
          >
            <Flame className="h-3.5 w-3.5 text-yellow-300" />
            <span>Latest Repacks</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
