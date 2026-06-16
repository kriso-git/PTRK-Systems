"use client";

import dynamic from "next/dynamic";
import { useQuality } from "@/lib/r3f/useQuality";

const StageViews = dynamic(() => import("./StageViews").then((m) => m.StageViews), { ssr: false });

/** Mounts the View canvas on `full` (desktop) only. On `lite` (touch / small /
 *  reduced-motion) it renders nothing, so no second WebGL context exists on
 *  mobile and the bg nebula never gets throttled. */
export function StageViewsLazy() {
  const quality = useQuality();
  if (quality === "lite") return null;
  return <StageViews />;
}
