"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getQuality } from "@/lib/r3f/useQuality";

const StageVeil = dynamic(() => import("./StageVeil").then((m) => m.StageVeil), { ssr: false });

/** Mounts the route-veil canvas on `full` (desktop) only. The quality check is
 *  deferred to AFTER mount (SSR + first client render both return null -> no
 *  hydration mismatch), mirroring StageViewsLazy. On `lite` it stays null, so
 *  mobile / reduced-motion gets instant route changes with no extra WebGL context. */
export function StageVeilLazy() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(getQuality() === "full");
  }, []);
  if (!show) return null;
  return <StageVeil />;
}
