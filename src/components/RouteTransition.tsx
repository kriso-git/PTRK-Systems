"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const SWEEP_MS = 380;

/**
 * HUD "channel switch" on route change: a lime scanline sweeps top to
 * bottom over the incoming page (compositor-only transform animation)
 * plus a faint lime tint flash. Skipped on first mount and for
 * reduced-motion users.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const firstMount = useRef(true);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    setActive(true);
    const t = setTimeout(() => setActive(false), SWEEP_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!active) return null;

  return (
    <div aria-hidden className="fixed inset-0 z-[90] pointer-events-none">
      {/* Faint full-screen tint flash */}
      <div className="absolute inset-0 bg-lime opacity-[0.04]" />
      {/* Scanline sweep */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px] bg-lime shadow-[0_0_18px_rgba(194,254,12,0.8)]"
        style={{ animation: `routeSweep ${SWEEP_MS}ms linear both` }}
      />
    </div>
  );
}
