"use client";

import { useEffect, useRef, useState } from "react";
import { PixelIcon } from "@/components/PixelIcon";
import { ENGAGEMENT } from "@/data/projects";

type Stat = { icon: string; num?: number; pad?: number; static?: string; label: string; accent: "lime" | "cyan" | "magenta" | "orange" };

const STATS: Stat[] = [
  { icon: "computers-devices-electronics-monitor", num: 3, pad: 2, label: "Élesben futó rendszer", accent: "lime" },
  { icon: "interface-essential-wifi-signal", num: 98, label: "Lighthouse átlag", accent: "cyan" },
  { icon: "interface-essential-clock", static: "<24h", label: "Maximum válaszidő", accent: "magenta" },
  { icon: "social-rewards-flag", static: ENGAGEMENT.launchRange, label: "Discovery → élesben", accent: "orange" },
];

const TX = { lime: "text-lime", cyan: "text-cyan", magenta: "text-magenta", orange: "text-orange" };
const BG = { lime: "bg-lime", cyan: "bg-cyan", magenta: "bg-magenta", orange: "bg-orange" };

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => { if (es[0].isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

function StatNum({ to, pad = 0, run }: { to: number; pad?: number; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0; const t0 = performance.now(); const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{String(v).padStart(pad, "0")}</>;
}

export function StatsBar() {
  const { ref, seen } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      data-section="§ 01"
      data-label="Metrika"
      className="relative z-10 border-y border-white/10 bg-void/40 backdrop-blur-[1px]"
    >
      <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-6 pt-6 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary md:px-10">
        <span className="h-1.5 w-1.5 bg-lime cursor-blink" />
        <span className="text-lime">§ 01 · Live metrics</span>
        <span className="ml-auto text-secondary/50">PTRK·OPS</span>
      </div>

      <div className="mx-auto grid max-w-[1500px] grid-cols-2 divide-x divide-y divide-white/10 px-6 pb-8 pt-4 md:grid-cols-4 md:divide-y-0 md:px-10">
        {STATS.map((s) => (
          <div key={s.label} className="group flex flex-col gap-3 px-2 py-6 md:px-8">
            <div className="flex items-center gap-2.5 font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary/70">
              <PixelIcon name={s.icon} width={15} height={15} className={TX[s.accent]} aria-hidden />
              <span className={`inline-block h-px w-6 ${BG[s.accent]} opacity-50`} />
            </div>
            <div className={`font-sequel text-[clamp(46px,7vw,104px)] leading-[0.85] tracking-[-0.04em] ${TX[s.accent]} whitespace-nowrap`}>
              {s.static ? s.static : <StatNum to={s.num!} pad={s.pad} run={seen} />}
            </div>
            <div className="max-w-[20ch] font-shorai text-sm tracking-tight text-secondary md:text-base">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
