"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { reducedMotion } from "@/lib/motion";
import { readSignal } from "@/lib/r3f/scroll-signal";
import { NEBULA_VERT, NEBULA_FRAG } from "./nebulaShader";
import type { Quality } from "@/lib/r3f/useQuality";

/**
 * StageBackground – the volumetric nebula, now rendered by R3F on its OWN
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

/**
 * Drives the render loop at a capped FPS instead of an unconditional 60fps
 * rAF. The nebula is a slow ambient fluid, so ~45fps is visually identical but
 * meaningfully cheaper (fewer full-viewport fragment passes) — a big chunk of
 * the desktop main-thread/compositing cost. frameloop="demand" means R3F only
 * renders when we invalidate(); reduced-motion mounts no loop -> one static frame.
 */
function ThrottledLoop({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const interval = 1000 / fps;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (last < 0 || t - last >= interval) {
        last = t;
        invalidate();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, fps]);
  return null;
}

export function StageBackground({ quality }: { quality: Quality }) {
  const reduced = reducedMotion();
  // The scroll-reactive 2D nebula (kept: the owner preferred it over the
  // volumetric atmosphere). DPR capped: a soft nebula has no sharp detail, so
  // 1.4 is visually identical to 1.75 on hi-DPI but ~36% fewer fragments.
  const dpr: [number, number] = quality === "lite" ? [1, 1.25] : [1, 1.4];
  return (
    <Canvas
      className="!fixed !inset-0"
      style={{ zIndex: 0, pointerEvents: "none" }}
      dpr={dpr}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      frameloop="demand"
      aria-hidden
    >
      <FieldMesh reduced={reduced} vert={NEBULA_VERT} frag={NEBULA_FRAG} />
      {!reduced && <ThrottledLoop fps={45} />}
    </Canvas>
  );
}
