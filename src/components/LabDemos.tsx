"use client";

import { useState } from "react";
import { DecodeText } from "@/components/DecodeText";

/** Click-to-replay DecodeText demo — key remount restarts the scramble. */
export function DecodeReplay() {
  const [run, setRun] = useState(0);
  return (
    <button
      type="button"
      onClick={() => setRun((n) => n + 1)}
      className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
      aria-label="Decode animáció újraindítása"
    >
      <span className="block font-khinterference uppercase text-4xl md:text-6xl text-lime leading-none tracking-[0.01em]">
        <DecodeText key={run} text="DECODE" durationMs={900} />
      </span>
      <span className="mt-3 block font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary group-hover:text-lime transition-colors">
        ▶ Kattints az újraindításhoz
      </span>
    </button>
  );
}

/** Clears the session boot flag and reloads — honest full replay. */
export function BootReplay() {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          sessionStorage.removeItem("ptrk-booted");
        } catch {
          /* storage blocked — reload happens anyway, boot stays gated off */
        }
        window.location.reload();
      }}
      className="inline-flex items-center gap-3 border-2 border-cyan/40 text-cyan px-6 py-3 font-monospec text-xs tracking-[0.25em] uppercase hover:bg-cyan hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
    >
      <span aria-hidden>↻</span>
      Boot újrajátszása
    </button>
  );
}
