"use client";

import { useMemo, useRef } from "react";
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
function FieldMesh({ reduced, vert, frag }: { reduced: boolean; vert: string; frag: string }) {
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
      uScroll: { value: 0 },
      uEnergy: { value: 0 },
    }),
    []
  );

  const target = useMemo(() => new THREE.Vector2(0.5, 0.5), []);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const scrollEased = useRef(0);

  useFrame((state, dt) => {
    // Write through the material's OWN uniforms object (via the ref), not a
    // separately-held object: passing `uniforms={obj}` and mutating `obj` did
    // NOT propagate uScroll/uEnergy to the GLSL (verified), so go through the ref.
    const u = matRef.current?.uniforms;
    if (!u) return;
    const d = Math.min(dt, 0.05); // clamp dt so a stutter cannot jump the easing
    u.uTime.value = reduced ? 4.2 : state.clock.elapsedTime;
    u.uRes.value.set(state.size.width, state.size.height);
    const s = readSignal();
    target.set(s.mx, s.my);
    u.uMouse.value.lerp(target, 0.1);

    if (!reduced) {
      // Heavily-damped follow of scroll progress so the colour journey + flow
      // GLIDE smoothly; no velocity term (that was what jittered on scroll).
      scrollEased.current = THREE.MathUtils.damp(scrollEased.current, s.progress, 1.4, d);
      // gentle constant breathing instead of a scroll-velocity surge -> alive but
      // never jittery on scroll.
      u.uScroll.value = scrollEased.current;
      u.uEnergy.value = 0.12 + 0.08 * Math.sin(state.clock.elapsedTime * 0.4);
    }
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function StageBackground({ quality }: { quality: Quality }) {
  const reduced = reducedMotion();
  // The scroll-reactive 2D nebula (kept: the owner preferred it over the
  // volumetric atmosphere). DPR capped lower on lite.
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
      <FieldMesh reduced={reduced} vert={NEBULA_VERT} frag={NEBULA_FRAG} />
    </Canvas>
  );
}
