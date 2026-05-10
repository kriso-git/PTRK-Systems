"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const COORD = "47.4979°N · 19.0402°E";

const NAV = [
  { href: "/", label: "Introduction", section: "§ 00" },
  { href: "/work", label: "Work", section: "§ 02" },
  { href: "/method", label: "Method", section: "§ 03" },
  { href: "/connect", label: "Connect", section: "§ 06" },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Auto-close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-void/85 backdrop-blur-md supports-[backdrop-filter]:bg-void/70">
      <div className="max-w-[1700px] mx-auto px-5 md:px-10 py-5 md:py-9 flex items-center justify-between font-monospec text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-secondary gap-4 md:gap-6">
        {/* ─── Brand + status ─── */}
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

        {/* ─── Desktop nav ─── */}
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

        {/* ─── Mobile toggle — single tap reveals all nav items ─── */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
          className={`md:hidden inline-flex items-center gap-2 px-3 py-2 border transition-colors ${
            open
              ? "border-lime bg-lime/10 text-lime"
              : "border-lime/40 text-lime hover:bg-lime/5"
          }`}
        >
          <span className="text-[10px] tracking-[0.3em]">
            {open ? "Close" : "Menu"}
          </span>
          {/* Two-line / X glyph — doesn't depend on a font glyph. */}
          <span
            aria-hidden
            className="relative inline-block w-3.5 h-3.5"
          >
            <span
              className={`absolute left-0 right-0 h-px bg-current transition-transform duration-200 ${
                open ? "top-1/2 rotate-45" : "top-[4px]"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-px bg-current transition-transform duration-200 ${
                open ? "top-1/2 -rotate-45" : "top-[10px]"
              }`}
            />
          </span>
        </button>

        {/* ─── Coords (desktop only) ─── */}
        <span className="hidden md:inline shrink-0 text-secondary/60 font-monospec text-[10px] md:text-[11px] tracking-[0.3em]">
          {COORD}
        </span>
      </div>

      {/* ─── Mobile drawer ─── */}
      <nav
        id="mobile-nav"
        aria-label="Primary mobile"
        aria-hidden={!open}
        className={`md:hidden absolute left-0 right-0 top-full border-t border-lime/25 bg-void/95 backdrop-blur-md transition-[max-height,opacity] duration-300 overflow-hidden ${
          open
            ? "max-h-[80vh] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="px-5 py-3 flex flex-col">
          {NAV.map((n) => {
            const isActive =
              n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-baseline gap-3 py-4 border-b border-white/10 last:border-b-0 transition-colors ${
                    isActive
                      ? "text-lime"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  <span className="text-[10px] tracking-[0.3em] opacity-60 w-12 shrink-0">
                    {n.section}
                  </span>
                  <span className="text-base tracking-[0.25em]">
                    {n.label}
                  </span>
                  {isActive ? (
                    <span className="ml-auto text-lime text-[10px]">●</span>
                  ) : (
                    <span className="ml-auto text-[12px] opacity-50">→</span>
                  )}
                </Link>
              </li>
            );
          })}
          <li className="pt-4 pb-2 text-[10px] tracking-[0.3em] text-secondary/40 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
            {COORD}
          </li>
        </ul>
      </nav>
    </header>
  );
}
