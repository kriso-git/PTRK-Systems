"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { VEIL_VERT, VEIL_FRAG } from "./routeVeilShader";
import { veilProgress, veilIntensity } from "@/lib/r3f/route-signal";

/** Fullscreen one-shot route-transition wash. Same fullscreen-triangle trick as
 *  the nebula background; reads the route-signal in useFrame (no React state). At
 *  rest uVeil is 0 so the shader returns a transparent pixel and the canvas is
 *  invisible/cheap. Lives in its own dedicated high-z canvas (StageVeil), which
 *  only mounts on full quality (desktop), so reduced-motion / mobile visitors get
 *  instant, wash-free route changes by construction. */
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

  useFrame((state) => {
    uniforms.uVeil.value = veilProgress(performance.now());
    uniforms.uAmp.value = veilIntensity();
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uRes.value.set(state.size.width, state.size.height);
  });

  return (
    <mesh geometry={geometry} frustumCulled={false} renderOrder={10}>
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
