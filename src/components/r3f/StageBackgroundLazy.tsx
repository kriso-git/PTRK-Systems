"use client";

import dynamic from "next/dynamic";
import { useQuality } from "@/lib/r3f/useQuality";

// R3F + three — lazy + client-only, off the critical bundle.
const StageBackground = dynamic(
  () => import("./StageBackground").then((m) => m.StageBackground),
  { ssr: false }
);

export function StageBackgroundLazy() {
  const quality = useQuality();
  return <StageBackground quality={quality} />;
}
