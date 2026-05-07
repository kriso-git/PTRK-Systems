"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crosshair } from "./Crosshair";

const TABS = [
  { href: "/", label: "HOME" },
  { href: "/work", label: "WORK" },
  { href: "/method", label: "METHOD" },
  { href: "/connect", label: "CONNECT" },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-xl border-b border-lime/20">
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-lime/0 via-lime/5 to-lime/0 pointer-events-none" />
      <Crosshair position="tl" color="lime" />
      <Crosshair position="tr" color="cyan" />

      <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between gap-6 relative z-10">
        <Link href="/" className="flex items-center gap-4 text-left group">
          <span className="font-khinterference text-xl md:text-2xl text-primary tracking-[0.05em] uppercase">
            PTRK<span className="text-lime"> Systems</span>
          </span>
          <span className="hidden md:inline font-monospec text-[10px] text-cyan tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">
            ESCAPE WILL MAKE ME █████
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {TABS.map((tab) => {
            const isActive =
              tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 md:px-5 py-2.5 font-monospec font-bold text-xs md:text-[13px] uppercase tracking-[0.25em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-void ${
                  isActive
                    ? "bg-lime text-black"
                    : "text-secondary hover:text-primary hover:bg-surface-light"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
