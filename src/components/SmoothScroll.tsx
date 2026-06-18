"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { reducedMotion } from "@/lib/motion";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // OWNER POLICY: gate on the central motion gate (explicit opt-out only),
    // NOT the OS prefers-reduced-motion signal — see src/lib/motion.ts.
    if (reducedMotion()) return;

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
