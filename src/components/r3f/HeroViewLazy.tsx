"use client";

import dynamic from "next/dynamic";

// Client-only (drei <View> + useQuality read window) – avoids SSR/hydration mismatch.
const HeroView = dynamic(() => import("./HeroView").then((m) => m.HeroView), { ssr: false });

export function HeroViewLazy() {
  return <HeroView />;
}
