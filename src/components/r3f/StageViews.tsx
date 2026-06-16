"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

/**
 * StageViews — the transparent canvas that hosts every DOM-placed <View> (the
 * hero now; per-project signature cards in Phase C) via <View.Port/>, plus one
 * shared subtle Bloom. It sits BEHIND the DOM content (z-2) and ABOVE the nebula
 * bg canvas (z-0), so a <View> tracking a transparent slot shows the 3D behind
 * the page text. Desktop/full ONLY — mobile-lite never mounts this (a second
 * WebGL context throttles the bg context on mobile Safari, per the validation).
 *
 * Two-canvas split (bg here is a separate canvas) is deliberate: a fullscreen bg
 * mesh sharing a canvas with drei <View>s flickers (scissor fight, proven).
 */
export function StageViews() {
  return (
    <Canvas
      className="!fixed !inset-0"
      style={{ zIndex: 2, pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      aria-hidden
    >
      <View.Port />
      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.35} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
