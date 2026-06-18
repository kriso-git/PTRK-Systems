"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";
import { drawResearch, drawArchitecture, drawDesign, drawDevelopment, drawTesting, drawLaunch } from "./phase-draws";

// index-aligned with PROCESS_STEPS (phase 01..06)
const DRAWS = [drawResearch, drawArchitecture, drawDesign, drawDevelopment, drawTesting, drawLaunch] as const;

/**
 * PhaseVisual – the right-side hero canvas for ProcessJourney. Each phase gets a
 * completely distinct animated visual (radar / node-tree / composition / circuit
 * / oscilloscope / launch-burst). The host owns the rAF + sizing and calls the
 * active phase's stateless draw(ctx,W,H,t,p,accent); `p` (enter progress) lets
 * each visual build itself in as its phase arrives. Pure 2D canvas, motion-gated.
 */
export function PhaseVisual({
  activeRef,
  accentRef,
  enterRef,
  scrubRef,
}: {
  activeRef: { current: number };
  accentRef: { current: string };
  enterRef: { current: number };
  scrubRef: { current: number };
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = reducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => {
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.max(1, W * dpr);
      cv.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let raf = 0;
    let tEased = scrubRef.current;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      // Smooth scroll-scrub: ease "t" toward the scroll target each frame so the
      // visuals GLIDE with the scroll instead of snapping on every tiny delta,
      // and settle when the user stops. Reduced-motion gets a fixed settled frame.
      tEased += (scrubRef.current - tEased) * 0.07;
      const t = reduced ? 6 : tEased;
      const a = Math.max(0, Math.min(DRAWS.length - 1, activeRef.current | 0));
      const p = reduced ? 1 : Math.max(0, Math.min(1, enterRef.current));
      const accent = accentRef.current || "#c2fe0c";
      ctx.clearRect(0, 0, W, H);
      const draw = DRAWS[a] as ((ctx: CanvasRenderingContext2D, W: number, H: number, t: number, p: number, accent: string) => void) | undefined;
      if (draw) {
        try {
          draw(ctx, W, H, t, p, accent);
        } catch {
          /* a single bad frame must never kill the loop */
        }
      }
    };
    raf = requestAnimationFrame(frame);
    const onR = () => resize();
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onR); };
  }, [activeRef, accentRef, enterRef, scrubRef]);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}
