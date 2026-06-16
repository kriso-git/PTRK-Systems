"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { View } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { reducedMotion } from "@/lib/motion";
import { getQuality } from "@/lib/r3f/useQuality";
import { readSignal } from "@/lib/r3f/scroll-signal";

const CYAN = "#01ffff";
const LIME = "#c2fe0c";

/** Six wireframe rings receding in Z — the "06 phases" as a HUD schematic. Slow
 *  auto-rotate + cursor/scroll tilt via readSignal(); a static pose on reduce.
 *  Emissive standard material (NO transmission — renders black headless). */
function Ladder({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  useFrame((s) => {
    const g = group.current;
    if (!g) return;
    if (reduced) {
      g.rotation.set(0.32, 0.6, 0);
      return;
    }
    const sig = readSignal();
    g.rotation.y = s.clock.elapsedTime * 0.16 + sig.mx * 0.4;
    g.rotation.x = 0.25 + sig.my * 0.18;
  });

  return (
    <group ref={group}>
      {rings.map((i) => (
        <mesh key={i} position={[0, 0, -i * 0.9]}>
          <torusGeometry args={[1.45 - i * 0.05, 0.018, 8, 90]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? CYAN : LIME}
            emissive={i % 2 === 0 ? CYAN : LIME}
            emissiveIntensity={1.15}
            wireframe
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * MethodSignature — a light decorative 3D mark behind the Method hero headline,
 * composited through StageViews' <View.Port/> (z-2, behind the copy). Same proven
 * DOM-placed <View> pattern as Phase C: mounted-gate (SSR-safe), lazy-mount via
 * IntersectionObserver, full-quality only, a static cyan glow on lite (no second
 * context on mobile). Motion-gated to a static pose. Content/copy untouched.
 */
export function MethodSignature() {
  const ref = useRef<HTMLDivElement>(null!);
  // Quality + motion FROZEN once at mount (like StageViewsLazy's gate), not
  // re-read per render, so this host and the StageViews canvas gate can never
  // disagree if the viewport later crosses the 820px tier boundary.
  const [gate, setGate] = useState<{ full: boolean; reduced: boolean } | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    setGate({ full: getQuality() === "full", reduced: reducedMotion() });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setNear(es[0].isIntersecting), {
      rootMargin: "300px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reduced = gate?.reduced ?? false;
  const full = gate?.full ?? false;
  const showView = full && near;
  const showGlow = !full;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={
        showGlow
          ? { background: "radial-gradient(circle at 62% 40%, rgba(1,255,255,0.06), transparent 62%)" }
          : undefined
      }
    >
      {showView && (
        <View track={ref as RefObject<HTMLElement>} className="h-full w-full">
          <Ladder reduced={reduced} />
          <ambientLight intensity={0.6} />
          <pointLight position={[3, 2, 4]} intensity={2} color={CYAN} />
          <pointLight position={[-3, -2, 1]} intensity={1.2} color={LIME} />
        </View>
      )}
    </div>
  );
}
