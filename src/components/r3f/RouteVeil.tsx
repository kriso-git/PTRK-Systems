"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { VEIL_VERT, VEIL_FRAG } from "./routeVeilShader";
import { veilProgress, veilIntensity, onPulse, isWashing } from "@/lib/r3f/route-signal";

/** Fullscreen one-shot route-transition wash. Same fullscreen-triangle trick as
 *  the nebula background; reads the route-signal in useFrame (no React state). At
 *  rest uVeil is 0 so the shader returns a transparent pixel. Its canvas (StageVeil)
 *  runs frameloop="demand", so to play the wash this subscribes to onPulse() and
 *  kicks a self-cancelling rAF burst that re-renders only across the ~700ms window,
 *  then settles back to 0 fps. Full-quality (desktop) only, via StageVeilLazy. */
export function RouteVeil() {
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
      uVeil: { value: 0 },
      uTime: { value: 0 },
      uAmp: { value: 1 },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  const invalidate = useThree((s) => s.invalidate);

  useFrame((state) => {
    uniforms.uVeil.value = veilProgress(performance.now());
    uniforms.uAmp.value = veilIntensity();
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uRes.value.set(state.size.width, state.size.height);
  });

  // Demand-driver: the canvas idles at 0 fps between navigations; a route pulse
  // kicks an rAF burst that re-renders across the wash and then stops, ending on
  // one final frame that draws uVeil=0 (clears the band).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      invalidate();
      if (isWashing(performance.now())) {
        raf = requestAnimationFrame(tick);
      } else {
        invalidate();
        raf = 0;
      }
    };
    const unsub = onPulse(() => {
      if (raf === 0) raf = requestAnimationFrame(tick);
    });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      unsub();
    };
  }, [invalidate]);

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={VEIL_VERT}
        fragmentShader={VEIL_FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
