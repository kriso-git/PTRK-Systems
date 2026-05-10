"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const COORD = "47.4979°N · 19.0402°E";

const NAV = [
  { href: "/", label: "Introduction", section: "§ 00" },
  { href: "/work", label: "Work", section: "§ 02" },
  { href: "/method", label: "Method", section: "§ 03" },
  { href: "/connect", label: "Connect", section: "§ 06" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-void/85 backdrop-blur-md supports-[backdrop-filter]:bg-void/70">
      <div className="max-w-[1700px] mx-auto px-6 md:px-10 py-7 md:py-9 flex items-center justify-between font-monospec text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-secondary gap-6">
        {/* ─── Brand + status ─── */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="text-primary hover:text-lime transition-colors">
            PTRK <span className="text-lime">Systems</span>
          </Link>
          <span
            aria-hidden
            className="hidden lg:inline-flex items-center gap-2 px-2.5 py-1 border border-lime/25 bg-lime/[0.04]"
          >
            <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
            <span className="text-lime tracking-[0.3em]">TX·LIVE</span>
            <span className="text-secondary/40">/</span>
            <span className="text-secondary/70 tracking-[0.3em]">CET</span>
          </span>
        </div>

        {/* ─── Nav buttons ─── */}
        <nav className="flex items-center gap-2 md:gap-3 overflow-x-auto" aria-label="Primary">
          {NAV.map((n) => {
            const isActive =
              n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-baseline gap-2 px-3 md:px-4 py-2 md:py-2.5 border transition-all whitespace-nowrap focus:outline-none focus-visible:border-lime focus-visible:bg-lime/10 ${
                  isActive
                    ? "border-lime bg-lime/10 text-lime"
                    : "border-white/15 text-secondary hover:border-lime/50 hover:bg-lime/5 hover:text-primary"
                }`}
              >
                <span className={`text-[9px] ${isActive ? "opacity-70" : "opacity-50 group-hover:opacity-80"} transition-opacity`}>
                  {n.section}
                </span>
                <span>{n.label}</span>
                {isActive ? (
                  <span className="text-lime text-[10px]">●</span>
                ) : (
                  <span className="text-[10px] opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all">
                    →
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ─── Coords ─── */}
        <span className="hidden md:inline shrink-0 text-secondary/60 font-monospec text-[10px] md:text-[11px] tracking-[0.3em]">
          {COORD}
        </span>
      </div>
    </header>
  );
}
