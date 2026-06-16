"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

/**
 * StageViews — the transparent canvas that hosts every DOM-placed <View> (the
 * hero; the per-project signatures) via <View.Port/>. It sits BEHIND the DOM
 * content (z-2) and ABOVE the nebula bg canvas (z-0), so a <View> tracking a
 * transparent slot shows the 3D behind the page text. Desktop/full ONLY (mobile
 * never mounts a second WebGL context, per the validation).
 *
 * NO EffectComposer here: a shared Bloom pass renders the View scissor regions
 * OPAQUE BLACK (the composer does not preserve the transparent clear), which is
 * invisible on a black page but PUNCHES A BLACK RECTANGLE over the lit nebula in
 * production (the hero View was a full-width black box). Raw <View> compositing
 * with alpha:true clears transparent, so the nebula shows through. If bloom is
 * ever wanted back, it must be an alpha-preserving / selective setup.
 *
 * Two-canvas split (bg is a separate canvas) is deliberate: a fullscreen bg mesh
 * sharing a canvas with drei <View>s flickers (scissor fight, proven).
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
    </Canvas>
  );
}
