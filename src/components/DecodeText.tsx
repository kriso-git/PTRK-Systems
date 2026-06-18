"use client";

import { useEffect, useState } from "react";
import { reducedMotion } from "@/lib/motion";

const GLYPHS = "01<>/_\\|#▓░23456789ABCDEF";

/**
 * Hex-scramble decode animation for display headlines.
 * SSR / no-JS / reduced-motion render the final text untouched; after
 * mount the unsettled tail cycles through HUD glyphs and settles left
 * to right over ~durationMs, then the rAF loop stops for good.
 */
export function DecodeText({
  text,
  delayMs = 0,
  durationMs = 700,
  className,
}: {
  text: string;
  delayMs?: number;
  durationMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reducedMotion()) {
      return;
    }
    let raf = 0;
    let start: number | null = null;

    const scramble = (settledCount: number) => {
      let out = text.slice(0, settledCount);
      for (let i = settledCount; i < text.length; i += 1) {
        out +=
          text[i] === " "
            ? " "
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      return out;
    };

    const tick = (now: number) => {
      if (start === null) start = now + delayMs;
      const t = (now - start) / durationMs;
      if (t >= 1) {
        setDisplay(text);
        return;
      }
      setDisplay(scramble(t <= 0 ? 0 : Math.floor(t * text.length)));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delayMs, durationMs]);

  // CLS guard: the variable-width scramble glyphs would reflow the headline on
  // every frame (desktop CLS spiked to ~0.88). The final text sits in normal
  // flow and LOCKS the box (and is the accessible text); while scrambling it is
  // hidden and an absolutely-positioned overlay (out of flow) carries the
  // animation, so the surrounding layout never shifts. The visible scramble is
  // unchanged.
  const animating = display !== text;
  return (
    <span
      className={className}
      style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}
    >
      <span style={animating ? { visibility: "hidden" } : undefined}>{text}</span>
      {animating && (
        <>
          <span aria-hidden style={{ position: "absolute", left: 0, top: 0 }}>
            {display}
          </span>
          <span className="sr-only">{text}</span>
        </>
      )}
    </span>
  );
}
