"use client";

import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { reducedMotion } from "@/lib/motion";
import { readSignal } from "@/lib/r3f/scroll-signal";
import { NEBULA_VERT, NEBULA_FRAG } from "./nebulaShader";
import type { Quality } from "@/lib/r3f/useQuality";

/**
 * StageBackground — the volumetric nebula, now rendered by R3F on its OWN
 * dedicated background canvas (fixed, backmost). Kept on a separate canvas from
 * the future per-card <View> stack on purpose: a fullscreen mesh sharing a
 * canvas with drei <View>s flickers (scissor fight, proven in the validation
 * prototype). One context here animates cleanly on mobile too.
 *
 * Reactive to the cursor (the "torch") via the scroll-signal; motion-gated
 * (one static frame on reduce); DPR capped lower on `lite` (touch / small / RM).
 */
function NebulaMesh({ reduced }: { reduced: boolean }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)
    );
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  const target = useMemo(() => new THREE.Vector2(0.5, 0.5), []);

  useFrame((state) => {
    uniforms.uTime.value = reduced ? 4.2 : state.clock.elapsedTime;
    uniforms.uRes.value.set(state.size.width, state.size.height);
    const s = readSignal();
    target.set(s.mx, s.my);
    uniforms.uMouse.value.lerp(target, 0.14);
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={NEBULA_VERT}
        fragmentShader={NEBULA_FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function StageBackground({ quality }: { quality: Quality }) {
  const reduced = reducedMotion();
  const dpr: [number, number] = quality === "lite" ? [1, 1.25] : [1, 1.75];
  return (
    <Canvas
      className="!fixed !inset-0"
      style={{ zIndex: 0, pointerEvents: "none" }}
      dpr={dpr}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      aria-hidden
    >
      <NebulaMesh reduced={reduced} />
    </Canvas>
  );
}
