"use client";

import { Canvas } from "@react-three/fiber";
import { RouteVeil } from "./RouteVeil";

/**
 * StageVeil — a dedicated, transparent, top-of-stack canvas whose only job is the
 * one-shot route-transition wash. It sits at z-39: ABOVE the page content (z-10),
 * the terminal asides (z-12) and the progress chips (z-30), but BELOW the nav
 * (z-40) so the header stays clean and usable through the wash. pointer-events
 * none + a shader that returns a fully transparent pixel at rest means it never
 * blocks interaction. frameloop="demand" keeps the context at 0 fps between
 * navigations; RouteVeil kicks an on-demand render burst (via onPulse) only for
 * the ~700ms wash, so idle truly costs ~nothing. Full-quality (desktop) only, via
 * StageVeilLazy, so reduced-motion / mobile never spins up this 3rd context.
 */
export function StageVeil() {
  return (
    <Canvas
      className="!fixed !inset-0"
      style={{ zIndex: 39, pointerEvents: "none" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      frameloop="demand"
      aria-hidden
    >
      <RouteVeil />
    </Canvas>
  );
}
