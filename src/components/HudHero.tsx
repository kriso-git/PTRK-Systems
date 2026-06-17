"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DecodeText } from "@/components/DecodeText";
import { ScrollCue } from "@/components/ScrollCue";
import { PixelIcon } from "@/components/PixelIcon";
import { onBootReady } from "@/lib/boot-ready";
import { PROJECTS, ENGAGEMENT } from "@/data/projects";

/* ---------- fires true once the boot loader has revealed the page ---------- */
function useBootReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => onBootReady(() => setReady(true)), []);
  return ready;
}

/* ---------- smoothed cursor parallax (-0.5..0.5) ---------- */
function useParallax() {
  const [p, setP] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
    };
    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      setP((cur) => ({ x: cur.x + (target.current.x - cur.x) * 0.06, y: cur.y + (target.current.y - cur.y) * 0.06 }));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);
  return p;
}

/* ---------- count-up number (animates AFTER the boot loader reveals) ---------- */
function CountUp({ to, pad = 0, className }: { to: number; pad?: number; className?: string }) {
  const [v, setV] = useState(0);
  const ready = useBootReady();
  useEffect(() => {
    if (!ready) return; // wait so it counts up WHEN THE USER SEES IT, not behind the boot
    let raf = 0; const t0 = performance.now(); const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(e * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ready]);
  return <span className={className}>{String(v).padStart(pad, "0")}</span>;
}

/* ---------- live CET clock (client-only -> no hydration mismatch) ---------- */
function LiveClock() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Budapest", hour12: false }).format(new Date());
    setT(fmt());
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t ?? "--:--:--"}</span>;
}

/* ---------- live oscilloscope waveform (canvas) ---------- */
function Waveform() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; };
    resize();
    let raf = 0; const t0 = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const w = cv.width, h = cv.height, t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      // grid baseline
      ctx.strokeStyle = "rgba(194,254,12,0.12)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
      // waveform
      ctx.strokeStyle = "#c2fe0c"; ctx.lineWidth = 1.6 * dpr;
      ctx.shadowColor = "rgba(194,254,12,0.6)"; ctx.shadowBlur = 6 * dpr;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2 * dpr) {
        const u = x / w;
        const y = h / 2 +
          Math.sin(u * 22 + t * 3) * h * 0.16 * (0.5 + 0.5 * Math.sin(u * 7 - t * 1.3)) +
          Math.sin(u * 60 - t * 6) * h * 0.05;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="h-14 w-full" />;
}

/* ---------- cycling "now shipping" project ticker ---------- */
const ACCENT: Record<string, string> = { lime: "text-lime", cyan: "text-cyan", magenta: "text-magenta", orange: "text-orange" };
function ProjectTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % PROJECTS.length), 2600);
    return () => clearInterval(id);
  }, []);
  const p = PROJECTS[i];
  return (
    <div className="flex items-center gap-2.5 font-monospec text-[11px] uppercase tracking-[0.25em]">
      <PixelIcon name="video-movies-play" width={14} height={14} className={ACCENT[p.color]} aria-hidden />
      <span className="text-secondary/70">Now shipping</span>
      <span key={p.id} className={ACCENT[p.color]}>{p.name}</span>
    </div>
  );
}

type Metric = { label: string; icon: string; num?: number; pad?: number; static?: string };
const METRICS: Metric[] = [
  { num: 3, pad: 2, label: "Systems live", icon: "computers-devices-electronics-monitor" },
  { num: 98, pad: 0, label: "Lighthouse avg", icon: "interface-essential-wifi-signal" },
  { static: "<24h", label: "Response", icon: "interface-essential-clock" },
  { static: ENGAGEMENT.nextSlotCompact, label: "Next slot", icon: "social-rewards-flag" },
];

/**
 * HudHero — the immersive Marathon HUD-world hero. Big PTRK.SYSTEMS wordmark as the
 * focal point; a LIVE TELEMETRY console (real metrics that count up, a running
 * oscilloscope, a cycling project ticker, a CET clock) parallaxes with the cursor
 * over the reactive field. All the original §00 copy is preserved.
 */
export function HudHero() {
  const p = useParallax();
  const t = (depth: number) => ({ transform: `translate3d(${p.x * depth}px, ${p.y * depth}px, 0)` });

  return (
    <section
      data-section="§ 00"
      data-label="Introduction"
      className="relative z-10 min-h-[100svh] overflow-hidden px-6 md:px-10 pt-28 md:pt-32 pb-16"
    >
      {/* HUD frame chrome */}
      <div aria-hidden className="pointer-events-none absolute inset-4 z-[1] md:inset-6">
        <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-lime/30" />
        <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-lime/30" />
        <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-lime/30" />
        <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-lime/30" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[200%] w-px origin-top-right translate-x-[-24vw] rotate-[18deg] bg-gradient-to-b from-transparent via-lime/25 to-transparent"
      />

      <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-center">
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
          <span className="text-lime">Design Engineering Unit</span>
          <span className="text-secondary/50">est. 2026 · Budapest</span>
        </div>

        <div className="grid grid-cols-12 items-center gap-y-14 md:gap-x-10">
          {/* main column */}
          <div className="col-span-12 lg:col-span-7">
            <h1 className="font-khinterference uppercase leading-[0.82] tracking-[-0.015em] text-primary">
              <span className="block text-[clamp(58px,13vw,224px)]">
                <DecodeText text="PTRK" />
                <span className="text-lime">.</span>
              </span>
              <span className="-mt-[0.05em] block text-[clamp(58px,13vw,224px)] text-lime">
                <DecodeText text="Systems" delayMs={150} />
                <span className="text-cyan">·</span>
              </span>
            </h1>

            <div className="mt-6 flex items-center gap-3" aria-hidden>
              <span className="block h-3 w-3 bg-lime" />
              <span className="block h-px w-32 bg-lime/40 md:w-48" />
              <span className="font-monospec text-[10px] uppercase tracking-[0.4em] text-secondary">Budapest · v4·07·26</span>
            </div>

            <p className="mt-8 max-w-[54ch] font-shorai text-lg leading-[1.4] tracking-[-0.005em] text-secondary md:text-2xl">
              Egy fókuszált, vertikális stúdió termék-felületekre, design rendszerekre és
              frontend architektúrára. Stratégiától live deployig{" "}
              <span className="text-primary">összehangolt kontextusban</span> — mert a felület{" "}
              <span className="italic text-lime">a termék</span>.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/work"
                className="group inline-flex items-center gap-3 border-b-2 border-lime pb-1 font-khinterference text-2xl uppercase tracking-[0.04em] text-primary transition-colors hover:text-lime md:text-4xl"
              >
                <PixelIcon name="interface-essential-cursor-click-point" width={20} height={20} className="text-lime" aria-hidden />
                View projects
              </Link>
              <Link href="/method" className="font-khinterference text-xl uppercase tracking-[0.04em] text-secondary transition-colors hover:text-cyan md:text-3xl">Methodology</Link>
              <Link href="/connect" className="font-khinterference text-xl uppercase tracking-[0.04em] text-secondary transition-colors hover:text-magenta md:text-3xl">Connect</Link>
            </div>
          </div>

          {/* LIVE TELEMETRY console (parallax) — desktop */}
          <div className="col-span-12 hidden lg:col-span-5 lg:block">
            <div style={t(-16)} className="ml-auto w-[360px] max-w-full">
              {/* header */}
              <div className="flex items-center justify-between font-monospec text-[10px] uppercase tracking-[0.3em]">
                <span className="flex items-center gap-2 text-lime">
                  <span className="h-1.5 w-1.5 bg-lime cursor-blink" />
                  Live telemetry
                </span>
                <span className="text-secondary/70"><LiveClock /></span>
              </div>

              {/* oscilloscope */}
              <div className="mt-3 border-y border-lime/15 py-2">
                <Waveform />
              </div>

              {/* metric grid */}
              <div className="mt-4 grid grid-cols-2 gap-px bg-white/5">
                {METRICS.map((m) => (
                  <div key={m.label} className="bg-void/70 p-3.5 backdrop-blur-sm">
                    <div className="mb-1.5 flex items-center gap-2 font-monospec text-[9px] uppercase tracking-[0.25em] text-secondary/70">
                      <PixelIcon name={m.icon} width={13} height={13} aria-hidden />
                      {m.label}
                    </div>
                    <div className="font-sequel text-4xl leading-none tracking-[-0.03em] text-primary">
                      {m.static ? (
                        <span>{m.static}</span>
                      ) : (
                        <CountUp to={m.num!} pad={m.pad} />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ticker */}
              <div className="mt-4 border-t border-lime/15 pt-3">
                <ProjectTicker />
              </div>
            </div>
          </div>
        </div>

        <ScrollCue label="Tovább a metrikákhoz" />
      </div>
    </section>
  );
}
