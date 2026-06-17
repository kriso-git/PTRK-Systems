"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DecodeText } from "@/components/DecodeText";
import { ScrollCue } from "@/components/ScrollCue";
import { PixelIcon } from "@/components/PixelIcon";
import { HeroTelemetry } from "@/components/HeroTelemetry";

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

/**
 * HudHero — the immersive Marathon HUD-world hero. Big PTRK.SYSTEMS wordmark as the
 * focal point on the left; a WOW live-telemetry console (sonar radar of the live
 * systems, a Lighthouse gauge, real metrics, a ticking status feed) parallaxes
 * with the cursor on the right. All the original §00 copy is preserved.
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

          {/* WOW live-telemetry console (parallax) — desktop */}
          <div className="col-span-12 hidden lg:col-span-5 lg:block">
            <div style={t(-16)} className="ml-auto w-[380px] max-w-full">
              <HeroTelemetry />
            </div>
          </div>
        </div>

        <ScrollCue label="Tovább a metrikákhoz" />
      </div>
    </section>
  );
}
