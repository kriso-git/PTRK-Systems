"use client";

import { useRef, type RefObject } from "react";
import { View } from "@react-three/drei";
import { reducedMotion } from "@/lib/motion";
import { useQuality } from "@/lib/r3f/useQuality";
import { HeroField } from "./HeroField";

// The exact left-dim wash carried over from the retired HeroBackdrop, so the
// hero copy keeps its high-contrast left edge over the constellation.
const WASH =
  "absolute inset-0 bg-[linear-gradient(100deg,rgba(5,5,8,0.82)_0%,rgba(5,5,8,0.45)_44%,rgba(5,5,8,0.12)_74%,transparent_100%)]";

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
