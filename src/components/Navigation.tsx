"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const COORD = "47.4979°N · 19.0402°E";

const NAV = [
  { href: "/", label: "Intro", section: "§ 00" },
  { href: "/work", label: "Work", section: "§ 02" },
  { href: "/method", label: "Method", section: "§ 03" },
  { href: "/connect", label: "Connect", section: "§ 06" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-void/85 backdrop-blur-md supports-[backdrop-filter]:bg-void/70">
      {/* ─── Top row: brand + (desktop) nav + coords ─── */}
      <div className="max-w-[1700px] mx-auto px-5 md:px-10 py-3.5 md:py-9 flex items-center justify-between font-monospec text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-secondary gap-4 md:gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/"
            className="text-primary hover:text-lime transition-colors"
          >
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

        {/* Desktop nav — hidden below md */}
        <nav
          className="hidden md:flex items-center gap-2 md:gap-3"
          aria-label="Primary"
        >
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
                <span
                  className={`text-[9px] ${
                    isActive
                      ? "opacity-70"
                      : "opacity-50 group-hover:opacity-80"
                  } transition-opacity`}
                >
                  {n.section}
                </span>
                <span>{n.label === "Intro" ? "Introduction" : n.label}</span>
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

        {/* Coords — desktop only */}
        <span className="hidden md:inline shrink-0 text-secondary/60 font-monospec text-[10px] md:text-[11px] tracking-[0.3em]">
          {COORD}
        </span>

        {/* Mobile mini status (replaces coord block) — kept on the same row
            as the brand so the nav row below has the full width for buttons. */}
        <span
          aria-hidden
          className="md:hidden inline-flex items-center gap-2 text-[9px] tracking-[0.3em] text-secondary/70 shrink-0"
        >
          <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
          <span className="text-lime">LIVE</span>
        </span>
      </div>

      {/* ─── Mobile nav row — fixed under the brand row, 4 equal-width
          buttons, no scroll, no toggle. Always visible. ─── */}
      <nav
        aria-label="Primary mobile"
        className="md:hidden border-t border-white/10 bg-void/70 grid grid-cols-4 font-monospec uppercase text-secondary"
      >
        {NAV.map((n) => {
          const isActive =
            n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center gap-1 py-3 border-r last:border-r-0 border-white/10 transition-colors ${
                isActive
                  ? "text-lime bg-lime/[0.06]"
                  : "hover:text-primary hover:bg-white/[0.02]"
              }`}
            >
              <span
                className={`text-[9px] tracking-[0.3em] ${
                  isActive ? "opacity-90" : "opacity-50"
                }`}
              >
                {n.section}
              </span>
              <span className="text-[11px] tracking-[0.25em]">
                {n.label}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-lime"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
