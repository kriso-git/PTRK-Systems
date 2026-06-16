"use client";

import { Canvas } from "@react-three/fiber";
import { RouteVeil } from "./RouteVeil";

/**
 * StageVeil — a dedicated, transparent, top-of-stack canvas whose only job is the
 * one-shot route-transition wash. It sits at z-39: ABOVE the page content (z-10),
 * the terminal asides (z-12) and the progress chips (z-30), but BELOW the nav
 * (z-40) so the header stays clean and usable through the wash. pointer-events
 * none + a shader that returns a fully transparent pixel at rest means it never
 * blocks interaction and costs ~nothing when idle. Full-quality (desktop) only,
 * via StageVeilLazy, so reduced-motion / mobile never spins up this 3rd context.
 */
export function StageVeil() {
  return (
    <Canvas
      className="!fixed !inset-0"
      style={{ zIndex: 39, pointerEvents: "none" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      frameloop="always"
      aria-hidden
    >
      <RouteVeil />
    </Canvas>
  );
}
