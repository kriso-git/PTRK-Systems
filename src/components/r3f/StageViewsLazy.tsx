"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getQuality } from "@/lib/r3f/useQuality";

const StageViews = dynamic(() => import("./StageViews").then((m) => m.StageViews), { ssr: false });

/** Mounts the View canvas on `full` (desktop) only. The quality check is deferred
 *  to AFTER mount: SSR and the first client render both return null (so there is
 *  no server/client divergence -> no hydration mismatch), then we switch the
 *  canvas in once the device tier is known. On `lite` it stays null, so no second
 *  WebGL context exists on mobile and the bg nebula never gets throttled. */
export function StageViewsLazy() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(getQuality() === "full");
  }, []);
  if (!show) return null;
  return <StageViews />;
}
