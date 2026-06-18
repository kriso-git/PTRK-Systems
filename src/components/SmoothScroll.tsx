"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { getQuality } from "@/lib/r3f/useQuality";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Gate on the central quality tier (which folds in the OWNER motion opt-out,
    // NOT the OS prefers-reduced-motion signal). On mobile ("lite") native scroll
    // is faster + smoother than a JS rAF smooth-scroll, and Lenis's per-frame lerp
    // was the single biggest mobile TBT cost. Desktop ("full") is unchanged.
    if (getQuality() === "lite") return;

    // lerp mode (not duration): each frame eases a fixed fraction toward the
    // target, so even single mouse-wheel notches glide smoothly instead of
    // snapping. Lower lerp = more glide; 0.1 is the balanced sweet spot.
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
