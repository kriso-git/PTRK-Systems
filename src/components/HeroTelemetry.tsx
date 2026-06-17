"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PixelIcon } from "@/components/PixelIcon";
import { reducedMotion } from "@/lib/motion";
import { onBootReady } from "@/lib/boot-ready";
import { PROJECTS } from "@/data/projects";

const HEX: Record<string, string> = { lime: "#c2fe0c", cyan: "#01ffff", magenta: "#ea027e", orange: "#ff8c42" };
const hex = (c: string) => HEX[c] ?? HEX.orange;

/* fires true once the boot loader has revealed the page */
function useBootReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => onBootReady(() => setReady(true)), []);
  return ready;
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

/* ---------- sonar radar: each live system is a blip that flares when swept ---------- */
function RadarSweep({ onActive }: { onActive: (i: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced = reducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => { const s = cv.clientWidth || 320; cv.width = s * dpr; cv.height = s * dpr; };
    size();

    const n = PROJECTS.length;
    const rads = [0.52, 0.78, 0.62, 0.42];
    const blips = PROJECTS.map((p, i) => ({
      ang: -Math.PI / 2 + (i * 2 * Math.PI) / n + 0.4,
      rad: rads[i % rads.length],
      color: hex(p.color),
      ping: -10,
      i,
    }));
    let sweep = -Math.PI / 2;
    let last = performance.now();
    let activeI = -1;
    let raf = 0;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.46;
      ctx.clearRect(0, 0, w, h);

      // rings + crosshair
      ctx.strokeStyle = "rgba(194,254,12,0.13)";
      ctx.lineWidth = 1 * dpr;
      for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.arc(cx, cy, (R * k) / 3, 0, Math.PI * 2); ctx.stroke(); }
      ctx.beginPath();
      ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
      ctx.stroke();

      if (!reduced) sweep += dt * 1.05;

      // trailing afterglow wedge (manual fading segments -> cross-browser)
      const segs = 28;
      for (let s = 0; s < segs; s++) {
        const a = sweep - s * 0.04;
        ctx.strokeStyle = `rgba(194,254,12,${(1 - s / segs) * 0.2})`;
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
      }
      // bright sweep line
      ctx.strokeStyle = "rgba(194,254,12,0.85)";
      ctx.lineWidth = 1.6 * dpr;
      ctx.shadowColor = "rgba(194,254,12,0.6)";
      ctx.shadowBlur = 8 * dpr;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R); ctx.stroke();
      ctx.shadowBlur = 0;

      // blips
      const sNorm = ((sweep % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      for (const b of blips) {
        const bNorm = ((b.ang % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        let d = sNorm - bNorm; d = ((d % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        if (d < dt * 1.3 && !reduced) {
          b.ping = now;
          if (activeI !== b.i) { activeI = b.i; onActive(b.i); }
        }
        const since = (now - b.ping) / 1000;
        const bright = reduced ? 1 : Math.max(0.28, 1 - since * 0.65);
        const bx = cx + Math.cos(b.ang) * R * b.rad;
        const by = cy + Math.sin(b.ang) * R * b.rad;
        ctx.globalAlpha = bright;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = bright * 10 * dpr;
        ctx.beginPath(); ctx.arc(bx, by, (2 + bright * 3) * dpr, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        if (since < 0.7 && !reduced) {
          ctx.strokeStyle = b.color;
          ctx.globalAlpha = (0.7 - since) / 0.7;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath(); ctx.arc(bx, by, (3 + since * 18) * dpr, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      // core
      ctx.fillStyle = "rgba(194,254,12,0.9)";
      ctx.beginPath(); ctx.arc(cx, cy, 2 * dpr, 0, Math.PI * 2); ctx.fill();

      if (reduced) cancelAnimationFrame(raf); // static single frame
    };
    raf = requestAnimationFrame(draw);
    const onResize = () => size();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [onActive]);
  return <canvas ref={ref} className="aspect-square w-full" />;
}

/* ---------- radial gauge that fills + counts up on reveal ---------- */
function RadialGauge({ value, max = 100, label, color = "#c2fe0c", run }: { value: number; max?: number; label: string; color?: string; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0; const t0 = performance.now(); const dur = 1300;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setV((1 - Math.pow(1 - p, 3)) * value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  const R = 30, C = 2 * Math.PI * R, frac = Math.min(1, v / max);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-[74px] w-[74px]">
        <svg viewBox="0 0 74 74" className="h-full w-full -rotate-90">
          <circle cx="37" cy="37" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle
            cx="37" cy="37" r={R} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - frac)}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center font-sequel text-2xl leading-none tracking-[-0.03em]" style={{ color }}>
          {Math.round(v)}
        </div>
      </div>
      <span className="font-monospec text-[9px] uppercase tracking-[0.25em] text-secondary">{label}</span>
    </div>
  );
}

/* ---------- compact metric line ---------- */
const ACCENT_TX: Record<string, string> = { lime: "text-lime", cyan: "text-cyan", magenta: "text-magenta", orange: "text-orange" };
function MetricLine({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 font-monospec text-[9px] uppercase tracking-[0.2em] text-secondary/70">
        <PixelIcon name={icon} width={12} height={12} className={ACCENT_TX[accent]} aria-hidden />
        {label}
      </span>
      <span className={`font-sequel text-lg leading-none tracking-[-0.02em] ${ACCENT_TX[accent]}`}>{value}</span>
    </div>
  );
}

/* ---------- live telemetry feed: lines tick in like a real status stream ---------- */
const FEED = [
  "EDGE · 11ms · OK",
  "DEPLOY · vercel · OK",
  "RLS · POLICY ENFORCED",
  "CDN · HIT 99.2%",
  "LH · 98 · GREEN",
  "TLS · 1.3 · OK",
  "BUILD · PASS",
  "UPTIME · 99.9%",
];
function StatusStream() {
  const [lines, setLines] = useState<{ id: number; text: string }[]>(() =>
    [0, 1, 2].map((i) => ({ id: i, text: FEED[i] }))
  );
  useEffect(() => {
    if (reducedMotion()) return;
    let i = 3, id = 3;
    const t = setInterval(() => {
      setLines((prev) => [...prev.slice(1), { id: id++, text: FEED[i % FEED.length] }]);
      i += 1;
    }, 1900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col gap-1 font-monospec text-[10px] tracking-[0.08em]">
      {lines.map((l, idx) => (
        <div key={l.id} className={`flex items-center gap-2 ${idx === lines.length - 1 ? "text-lime" : "text-secondary/45"}`}>
          <span className={idx === lines.length - 1 ? "text-lime" : "text-secondary/30"}>▸</span>
          <span className="truncate">{l.text}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * HeroTelemetry — the WOW right-hand console. A sonar radar (each live system a
 * blip that flares when swept, the swept one named below), a Lighthouse radial
 * gauge that fills on reveal, real metric lines, and a live status feed that
 * ticks. Pure DOM/CSS/canvas, motion-gated, count-ups deferred to boot-ready.
 */
export function HeroTelemetry() {
  const ready = useBootReady();
  const [active, setActive] = useState(0);
  const onActive = useCallback((i: number) => setActive(i), []);
  const ap = PROJECTS[active] ?? PROJECTS[0];

  return (
    <div className="text-primary">
      {/* header */}
      <div className="flex items-center justify-between border-b border-lime/15 pb-2 font-monospec text-[10px] uppercase tracking-[0.3em]">
        <span className="flex items-center gap-2 text-lime">
          <span className="h-1.5 w-1.5 bg-lime cursor-blink" />
          Live telemetry
        </span>
        <span className="text-secondary/70"><LiveClock /></span>
      </div>

      {/* radar */}
      <div className="relative mt-3 border border-lime/15 bg-void/40 p-3 backdrop-blur-sm">
        <span aria-hidden className="pointer-events-none absolute left-1.5 top-1.5 h-3 w-3 border-l-2 border-t-2 border-lime/40" />
        <span aria-hidden className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 border-r-2 border-t-2 border-lime/40" />
        <span aria-hidden className="pointer-events-none absolute bottom-1.5 left-1.5 h-3 w-3 border-b-2 border-l-2 border-lime/40" />
        <span aria-hidden className="pointer-events-none absolute bottom-1.5 right-1.5 h-3 w-3 border-b-2 border-r-2 border-lime/40" />
        <div className="pointer-events-none absolute left-4 top-4 z-10 font-monospec text-[9px] uppercase tracking-[0.3em] text-lime/70">
          ◉ Systems · scan
        </div>
        <RadarSweep onActive={onActive} />
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-center justify-between font-monospec text-[9px] uppercase tracking-[0.25em]">
          <span className="text-secondary/60">Track</span>
          <span className="truncate pl-2" style={{ color: hex(ap.color) }}>{ap.name}</span>
        </div>
      </div>

      {/* gauge + metrics */}
      <div className="mt-3 flex items-stretch gap-3 border border-lime/15 bg-void/40 p-3 backdrop-blur-sm">
        <RadialGauge value={98} label="Lighthouse" run={ready} />
        <div className="flex flex-1 flex-col justify-center gap-2.5 border-l border-white/10 pl-3">
          <MetricLine icon="computers-devices-electronics-monitor" label="Systems" value={`0${PROJECTS.length}/0${PROJECTS.length}`} accent="lime" />
          <MetricLine icon="interface-essential-clock" label="Response" value="<24h" accent="magenta" />
          <MetricLine icon="interface-essential-calendar-appointment" label="Next slot" value="Q3.26" accent="cyan" />
        </div>
      </div>

      {/* live feed */}
      <div className="mt-3 border border-lime/15 bg-void/40 px-3 py-2.5 backdrop-blur-sm">
        <StatusStream />
      </div>
    </div>
  );
}
