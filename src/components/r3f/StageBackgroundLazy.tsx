"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type CSSProperties } from "react";
import { useQuality } from "@/lib/r3f/useQuality";

// R3F + three – lazy + client-only, off the critical bundle.
const StageBackground = dynamic(
  () => import("./StageBackground").then((m) => m.StageBackground),
  { ssr: false }
);

/** Feature-detect WebGL. If a visitor has no GPU acceleration / WebGL disabled,
 *  we must NOT mount a canvas (it would fail or freeze) – they get the CSS bg. */
function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Static brand-tinted gradient. Rendered (a) before the WebGL check resolves, so
// arrival is never a black flash, and (b) permanently when WebGL is unavailable,
// so the site is fully usable with zero dependency on the 3D layer.
const fallbackStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",
  background:
    "radial-gradient(115% 95% at 28% 18%, rgba(14,22,10,0.9), #050508 58%), radial-gradient(85% 85% at 82% 92%, rgba(7,18,22,0.85), transparent 70%)",
};

export function StageBackgroundLazy() {
  const quality = useQuality();
  const [gl, setGl] = useState<boolean | null>(null);

  useEffect(() => setGl(webglAvailable()), []);

  // null = pre-mount (SSR + first client render) -> show the gradient.
  // false = no WebGL -> keep the gradient forever (never crashes).
  // "lite" (touch / small viewport / reduced-motion) -> ALSO keep the CSS
  // gradient and never mount the WebGL canvas, so the heavy three.js chunk
  // (~847KB) is never downloaded on mobile. This is the #1 mobile-perf win;
  // StageViews/StageVeil are already full-only, so on lite no three.js loads
  // at all. Desktop (full + WebGL) is completely unchanged.
  if (quality === "lite" || gl !== true) return <div aria-hidden style={fallbackStyle} />;
  return <StageBackground quality={quality} />;
}
