"use client";

import { useRef, type RefObject } from "react";
import { View } from "@react-three/drei";
import { reducedMotion } from "@/lib/motion";
import { useQuality } from "@/lib/r3f/useQuality";
import { HeroField } from "./HeroField";

// Left-dim wash so the hero copy keeps a high-contrast left edge, but lighter
// than the original HeroBackdrop so the live nebula + constellation actually read
// in the hero (the "black on arrival" was this wash sitting too heavy).
const WASH =
  "absolute inset-0 bg-[linear-gradient(100deg,rgba(5,5,8,0.66)_0%,rgba(5,5,8,0.32)_46%,rgba(5,5,8,0.06)_76%,transparent_100%)]";

/**
 * HeroView — the §00 hero backdrop. On `full`: a DOM-placed <View track={heroRef}>
 * hosting the <HeroField/> constellation (composited by StageViews' <View.Port/>,
 * behind the hero copy) + the wash. On `lite`: just the wash, letting the Phase-A
 * nebula bg show through (no View, no second WebGL context). Replaces HeroBackdrop.
 */
export function HeroView() {
  const quality = useQuality();
  const reduced = reducedMotion();
  const heroRef = useRef<HTMLDivElement>(null!);

  if (quality === "lite") {
    return <div aria-hidden className={WASH} />;
  }

  return (
    <>
      <div ref={heroRef} className="absolute inset-0">
        <View track={heroRef as RefObject<HTMLElement>} className="h-full w-full">
          <HeroField reduced={reduced} />
        </View>
      </div>
      <div aria-hidden className={WASH} />
    </>
  );
}
