import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AdScripts } from "@/components/AdScripts";

export const metadata: Metadata = {
  title: "FilmFeed Games 4K • FitGirl Repacks Direct Parts Hub",
  description: "Download 7,000+ compressed PC Game repacks in 500MB parts with direct FuckingFast, DataNodes, and WhatsApp Bot delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090c] text-gray-100 min-h-screen flex flex-col selection:bg-accent-purple selection:text-white">
        <AdScripts />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-white/10 bg-[#06070a] py-8 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wider">FILMFEED GAMES 4K</span>
              <span>•</span>
              <span>Powered by FitGirl Repacks & FuckingFast CDN</span>
            </div>
            <p className="text-gray-400">
              Files are distributed in 500MB multi-part RAR archives for maximum download stability.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
