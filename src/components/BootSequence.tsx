"use client";

import { useEffect, useState } from "react";

const LINES = [
  "PTRK SYSTEMS BIOS v4.07.26",
  "MEM CHECK ............ OK",
  "LINK NOD·0A20070A ..... OK",
  "FONTS / HUD .......... LOADED",
  "RENDER → ONLINE ▓▓▓░",
];

const LINE_INTERVAL_MS = 260;
const HOLD_MS = 350;
const WIPE_MS = 320;

/**
 * Session-gated BIOS boot overlay. SSR renders nothing (mounted gate →
 * no hydration mismatch, page paints first so LCP is unaffected); the
 * overlay then types 5 log lines (~1.3s), holds briefly and wipes up.
 * Any pointer/key input skips straight to the wipe. Reduced-motion or
 * an already-booted session never shows it.
 */
export function BootSequence() {
  const [phase, setPhase] = useState<"hidden" | "typing" | "wipe">("hidden");
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (
      sessionStorage.getItem("ptrk-booted") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      sessionStorage.setItem("ptrk-booted", "1");
      return;
    }
    sessionStorage.setItem("ptrk-booted", "1");
    setPhase("typing");
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;

    let line = 0;
    const lineTimer = setInterval(() => {
      line += 1;
      setLineCount(line);
      if (line >= LINES.length) {
        clearInterval(lineTimer);
        holdTimer = setTimeout(() => setPhase("wipe"), HOLD_MS);
      }
    }, LINE_INTERVAL_MS);
    let holdTimer: ReturnType<typeof setTimeout> | undefined;

    const skip = () => setPhase("wipe");
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);

    return () => {
      clearInterval(lineTimer);
      if (holdTimer) clearTimeout(holdTimer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "wipe") return;
    const t = setTimeout(() => setPhase("hidden"), WIPE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] bg-void flex items-center justify-center"
      style={
        phase === "wipe"
          ? {
              transform: "translateY(-100%)",
              transition: `transform ${WIPE_MS}ms cubic-bezier(0.7, 0, 0.84, 0)`,
            }
          : undefined
      }
    >
      {/* Lime trailing edge so the wipe reads as a scanline */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-lime shadow-[0_0_18px_rgba(194,254,12,0.8)]" />

      <div className="font-monospec text-[12px] md:text-sm text-lime tracking-[0.18em] leading-loose px-6">
        {LINES.slice(0, Math.max(lineCount, 1)).map((l) => (
          <div key={l}>{l}</div>
        ))}
        {lineCount < LINES.length && (
          <span className="inline-block w-2 h-4 bg-lime align-middle cursor-blink" />
        )}
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center font-monospec text-[9px] tracking-[0.35em] uppercase text-secondary/50">
        Press any key to skip
      </div>
    </div>
  );
}
