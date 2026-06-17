"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS_STEPS } from "@/data/projects";
import { PixelIcon } from "@/components/PixelIcon";
import { PHASE_ICONS } from "@/lib/process-icons";
import { reducedMotion } from "@/lib/motion";
import { PhaseVisual } from "@/components/PhaseVisual";

/**
 * ProcessJourney — the home §05 process as a pinned scroll-through. Each scroll
 * beat advances one phase: the left rail fills, the active phase animates in with
 * its pixel-icon, and the right side carries an animated HUD form (a morphing
 * polygon whose sides grow with the phase, reticle rings, orbiting nodes) framing
 * a ghost phase number. Transparent stage — the site nebula shows through.
 */

const ACCENTS = ["#c2fe0c", "#01ffff", "#ea027e", "#ff8c42", "#c2fe0c", "#01ffff"] as const;
const PHASE_COUNT = 6;

/* scroll progress 0..1 across a tall section */
function useSectionProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
      setProgress(p);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return { ref, progress };
}


export function ProcessJourney() {
  const { ref, progress } = useSectionProgress<HTMLDivElement>();

  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    let raf = 0;
    const loop = (t: number) => { setPulse((Math.sin(t / 1400) + 1) / 2); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scaled = Math.min(0.999999, Math.max(0, progress)) * PHASE_COUNT;
  const active = Math.min(PHASE_COUNT - 1, Math.floor(scaled));
  const localT = scaled - active;

  const steps = PROCESS_STEPS ?? [];
  const step = steps[active] ?? { number: "00", title: "", desc: "" };
  const accent = ACCENTS[active % ACCENTS.length];
  const phaseNum = step.number ?? String(active + 1).padStart(2, "0");

  // live refs for the canvas
  const activeRef = useRef(0);
  const accentRef = useRef<string>(ACCENTS[0]);
  const enterRef = useRef(0);

  const railFill = ((active + localT) / PHASE_COUNT) * 100;
  const enter = Math.min(1, localT * 3);
  useEffect(() => { activeRef.current = active; accentRef.current = accent; enterRef.current = enter; }, [active, accent, enter]);
  const contentOpacity = 0.15 + enter * 0.85;
  const contentY = (1 - enter) * 34;
  const ghostScale = 0.92 + enter * 0.08;
  const ghostOpacity = (0.06 + pulse * 0.05) * (0.4 + enter * 0.6);

  return (
    <section ref={ref} data-section="§ 05" data-label="Folyamat" style={{ height: "360vh" }} className="relative z-10 w-full">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* soft scrim for legibility over the nebula (kept light so the bg shows) */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(125% 100% at 50% 50%, rgba(5,5,8,0.35), rgba(5,5,8,0.7) 100%)" }} />
        {/* faint grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 30%, transparent 85%)",
          }}
        />

        {/* HUD corner ticks */}
        {(["tl", "tr", "bl", "br"] as const).map((c) => (
          <span
            key={c}
            aria-hidden
            className="pointer-events-none absolute h-6 w-6"
            style={{
              top: c[0] === "t" ? 24 : undefined,
              bottom: c[0] === "b" ? 24 : undefined,
              left: c[1] === "l" ? 24 : undefined,
              right: c[1] === "r" ? 24 : undefined,
              borderTop: c[0] === "t" ? `1px solid ${accent}` : undefined,
              borderBottom: c[0] === "b" ? `1px solid ${accent}` : undefined,
              borderLeft: c[1] === "l" ? `1px solid ${accent}` : undefined,
              borderRight: c[1] === "r" ? `1px solid ${accent}` : undefined,
              opacity: 0.5 + pulse * 0.4,
              transition: "border-color 600ms ease",
            }}
          />
        ))}

        {/* top label */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-6 md:px-10">
          <span className="font-monospec text-[10px] uppercase tracking-[0.4em] text-secondary">§ 05 · Folyamat · 06 fázis</span>
          <span className="font-monospec text-[10px] uppercase tracking-[0.4em]" style={{ color: accent, transition: "color 600ms ease" }}>// studio process</span>
        </div>

        {/* stage */}
        <div className="mx-auto flex h-full max-w-[1500px] items-center gap-8 px-6 md:gap-16 md:px-10">
          {/* LEFT: rail */}
          <div className="relative flex h-[58vh] shrink-0 items-stretch">
            <div className="relative w-px self-stretch bg-white/12">
              <div className="absolute left-0 top-0 w-px" style={{ height: `${railFill}%`, background: `linear-gradient(to bottom, ${accent}, ${accent}55)`, boxShadow: `0 0 12px ${accent}`, transition: "background 600ms ease" }} />
              {steps.map((s, i) => {
                const lit = i <= active;
                const isActive = i === active;
                const top = (i / (PHASE_COUNT - 1)) * 100;
                return (
                  <div key={s.number ?? i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: 0, top: `${top}%` }}>
                    <span className="block rounded-full" style={{ width: isActive ? 14 : 8, height: isActive ? 14 : 8, background: lit ? accent : "transparent", border: `1px solid ${lit ? accent : "rgba(255,255,255,0.25)"}`, boxShadow: isActive ? `0 0 16px ${accent}` : "none", transition: "width 300ms ease, height 300ms ease, background 400ms ease, box-shadow 400ms ease, border-color 400ms ease" }} />
                    <span className="absolute left-5 top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap font-monospec text-[10px] tracking-[0.25em]" style={{ color: lit ? accent : "rgba(255,255,255,0.3)", opacity: lit ? 1 : 0.6, transition: "color 400ms ease, opacity 400ms ease" }}>
                      <PixelIcon name={PHASE_ICONS[i]} width={13} height={13} aria-hidden />
                      {`P.${s.number ?? String(i + 1).padStart(2, "0")}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER/RIGHT */}
          <div className="relative flex h-[58vh] flex-1 items-center">
            {/* right-side animated HUD forms + ghost number */}
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60 lg:inset-auto lg:right-0 lg:top-1/2 lg:h-[78vh] lg:w-[58%] lg:-translate-y-1/2 lg:opacity-100">
              <div className="absolute inset-0 z-0"><PhaseVisual activeRef={activeRef} accentRef={accentRef} enterRef={enterRef} /></div>
              <span
                key={`ghost-${active}`}
                className="absolute right-2 top-1/2 z-[1] select-none font-sequel leading-none"
                style={{ color: accent, opacity: ghostOpacity, fontSize: "clamp(180px, 30vw, 460px)", transform: `translateY(-50%) scale(${ghostScale})`, transition: "color 600ms ease", textShadow: `0 0 80px ${accent}33` }}
              >
                {phaseNum}
              </span>
            </div>

            {/* foreground content */}
            <div key={`content-${active}`} className="relative z-10 max-w-2xl" style={{ opacity: contentOpacity, transform: `translateY(${contentY}px)` }}>
              <div className="mb-6 grid h-16 w-16 place-items-center border" style={{ borderColor: `${accent}66`, color: accent, boxShadow: `0 0 26px -8px ${accent}`, transition: "border-color 600ms ease" }}>
                <PixelIcon name={PHASE_ICONS[active]} width={30} height={30} aria-hidden />
              </div>

              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10" style={{ background: accent, transition: "background 600ms ease" }} />
                <span className="font-monospec text-xs uppercase tracking-[0.5em]" style={{ color: accent, transition: "color 600ms ease" }}>{`Fázis ${phaseNum}`}</span>
              </div>

              <h2 className="font-khinterference uppercase leading-[0.95] tracking-tight text-primary" style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>{step.title}</h2>

              <p className="mt-6 max-w-xl font-shorai text-base leading-relaxed text-secondary md:text-lg">{step.desc}</p>

              <div className="mt-8 h-px w-full max-w-md bg-white/10">
                <div className="h-px" style={{ width: `${enter * 100}%`, background: accent, boxShadow: `0 0 8px ${accent}`, transition: "background 600ms ease" }} />
              </div>
            </div>
          </div>
        </div>

        {/* bottom readout */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-6 md:px-10">
          <div className="flex items-baseline gap-2 font-sequel">
            <span className="text-2xl tabular-nums" style={{ color: accent, transition: "color 600ms ease" }}>{String(active + 1).padStart(2, "0")}</span>
            <span className="text-sm tabular-nums text-secondary/40">/ 06</span>
          </div>
          <span className="font-monospec text-[10px] uppercase tracking-[0.4em] text-secondary/45">Görgess tovább ▾</span>
        </div>
      </div>
    </section>
  );
}
