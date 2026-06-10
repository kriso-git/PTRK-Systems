"use client";

import { useEffect, useState } from "react";

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  return <span className={className}>{display}</span>;
}
