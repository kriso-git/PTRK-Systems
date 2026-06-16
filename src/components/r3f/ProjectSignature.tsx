"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { View } from "@react-three/drei";
import { reducedMotion } from "@/lib/motion";
import { getQuality } from "@/lib/r3f/useQuality";
import { signatureKind, accentHex } from "@/lib/r3f/signature-kind";
import { Signature } from "./signatureObjects";

interface Props {
  /** real project id (src/data/projects.ts) — picks the signature kind */
  projectId: string;
  /** brand accent color name from the project (lime | cyan | magenta | orange) */
  color: string;
  /** external "energised" signal (e.g. row / card hover) — drives the object's
   *  spin + scale. Falls back to the box's own hover when omitted. */
  active?: boolean;
  /** when defined, the View only renders while true (home index reveals on hover);
   *  when omitted, the View renders whenever it is near the viewport (/work). */
  reveal?: boolean;
  /** render the static CSS accent-glow on lite / pre-mount. Default true. The home
   *  index passes false so the mobile index stays pure text. */
  showFallback?: boolean;
  /** sizing / positioning of the tracked box */
  className?: string;
}

/**
 * ProjectSignature — a DOM-placed drei <View> hosting the project's signature
 * object, composited by StageViews' <View.Port/> (the z-2 canvas, full-quality
 * only). The View mounts only when (a) the device is `full`, (b) the box is near
 * the viewport (IntersectionObserver), and (c) `reveal` is not gating it off — so
 * offscreen / idle rows cost nothing. On `lite` (mobile / reduced) the StageViews
 * canvas does not exist, so a View would never composite; we render a static CSS
 * accent-glow instead (when showFallback), never an empty box. Quality + motion
 * are read AFTER mount (the mounted-gate) so SSR and the first client paint match.
 */
export function ProjectSignature({
  projectId,
  color,
  active,
  reveal,
  showFallback = true,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null!);
  const [mounted, setMounted] = useState(false);
  const [near, setNear] = useState(false);
  const [selfHover, setSelfHover] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setNear(es[0].isIntersecting), {
      rootMargin: "300px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hex = accentHex(color);
  const kind = signatureKind(projectId);
  const reduced = mounted ? reducedMotion() : false;
  const full = mounted && getQuality() === "full";
  const isActive = (active ?? false) || selfHover;
  const shouldReveal = reveal === undefined ? true : reveal;
  const showView = full && near && shouldReveal;
  const showGlow = !full && showFallback;

  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      onMouseEnter={() => setSelfHover(true)}
      onMouseLeave={() => setSelfHover(false)}
      style={
        showGlow
          ? { background: `radial-gradient(circle at 50% 45%, ${hex}22, transparent 70%)` }
          : undefined
      }
    >
      {showView && (
        <View track={ref as RefObject<HTMLElement>} className="h-full w-full">
          <Signature kind={kind} accent={hex} active={isActive} reduced={reduced} />
        </View>
      )}
    </div>
  );
}
