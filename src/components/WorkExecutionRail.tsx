"use client";

import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/lib/motion";

const FILL: Record<string, string> = {
  lime: "bg-lime",
  cyan: "bg-cyan",
  magenta: "bg-magenta",
  orange: "bg-orange",
};
const TEXT: Record<string, string> = {
  lime: "text-lime",
  cyan: "text-cyan",
  magenta: "text-magenta",
  orange: "text-orange",
};

/**
 * Scroll-driven telemetry rail for the "Mit építettünk" (Execution) section.
 * Sits in the sticky aside; a vertical bar + tick fills as the visitor scrolls
 * through the section, with a live EX index / total + percent readout.
 * Motion-gated (static fill on reduced motion), desktop-only, rAF-throttled.
 */
export function WorkExecutionRail({ total, color }: { total: number; color: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const section = wrap.current?.closest("section");
    if (!section) return;
    if (reducedMotion()) {
      setP(1);
      return;
    }
    let raf = 0;
    const compute = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the section top reaches mid-viewport, 1 when its bottom passes it
      const prog = (vh * 0.5 - r.top) / r.height;
      setP(Math.max(0, Math.min(1, prog)));
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const idx = Math.max(1, Math.min(total, Math.ceil(p * total) || 1));
  const fill = FILL[color] ?? FILL.lime;
  const text = TEXT[color] ?? TEXT.lime;

  return (
    <div ref={wrap} className="mt-10 hidden md:flex items-stretch gap-4" aria-hidden>
      <div className="relative h-48 w-px bg-white/12">
        <div
          className={`absolute left-0 top-0 w-px ${fill}`}
          style={{ height: `${p * 100}%` }}
        />
        <div
          className={`absolute -left-[3.5px] h-2 w-2 ${fill}`}
          style={{ top: `calc(${p * 100}% - 4px)` }}
        />
      </div>
      <div className="flex flex-col justify-between font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary/60">
        <span>Scan</span>
        <span className={text}>
          {String(idx).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span>{Math.round(p * 100)}%</span>
      </div>
    </div>
  );
}
