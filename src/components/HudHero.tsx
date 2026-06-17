"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DecodeText } from "@/components/DecodeText";
import { ScrollCue } from "@/components/ScrollCue";
import { PixelIcon } from "@/components/PixelIcon";

/** Smoothed cursor parallax, -0.5..0.5 on each axis. */
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

function Live() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 bg-lime cursor-blink" />
      <span className="text-lime">LIVE</span>
    </span>
  );
}

function StatusRow({ icon, label, value, color = "text-lime" }: { icon: string; label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <PixelIcon name={icon} width={15} height={15} className="text-secondary/80" aria-hidden />
      <span className="text-secondary/80">{label}</span>
      <span className="flex-1 border-b border-dotted border-white/15" />
      <span className={color}>{value}</span>
    </div>
  );
}

/**
 * HudHero — the immersive Marathon HUD-world hero. The big PTRK.SYSTEMS wordmark
 * is the focal point; floating HUD panels (pixel-icon readouts) parallax with the
 * cursor over the reactive nebula field. All the original §00 copy is preserved.
 */
export function HudHero() {
  const p = useParallax();
  const t = (depth: number) => ({ transform: `translate3d(${p.x * depth}px, ${p.y * depth}px, 0)` });

  return (
    <section
      data-section="§ 00"
      data-label="Introduction"
      className="relative z-10 min-h-[100svh] overflow-hidden px-6 md:px-10 pt-28 md:pt-36 pb-20"
    >
      {/* HUD frame chrome */}
      <div aria-hidden className="pointer-events-none absolute inset-4 md:inset-6 z-[1]">
        <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-lime/30" />
        <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-lime/30" />
        <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-lime/30" />
        <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-lime/30" />
      </div>

      {/* diagonal HUD scan line (kept from the original) */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[200%] w-px origin-top-right translate-x-[-24vw] rotate-[18deg] bg-gradient-to-b from-transparent via-lime/30 to-transparent"
      />

      <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-center">
        {/* top strip */}
        <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
          <span className="text-lime">Design Engineering Unit</span>
          <span className="text-secondary/50">est. 2026 · Budapest</span>
          <span className="hidden md:inline text-secondary/50">/</span>
          <span className="hidden md:inline"><Live /></span>
        </div>

        <div className="grid grid-cols-12 items-center gap-y-12 md:gap-x-10">
          {/* main column */}
          <div className="col-span-12 lg:col-span-8">
            <h1 className="font-khinterference uppercase leading-[0.82] tracking-[-0.015em] text-primary">
              <span className="block text-[clamp(64px,15vw,260px)]">
                <DecodeText text="PTRK" />
                <span className="text-lime">.</span>
              </span>
              <span className="-mt-[0.05em] block text-[clamp(64px,15vw,260px)] text-lime">
                <DecodeText text="Systems" delayMs={150} />
                <span className="text-cyan">·</span>
              </span>
            </h1>

            <div className="mt-6 flex items-center gap-3" aria-hidden>
              <span className="block h-3 w-3 bg-lime" />
              <span className="block h-px w-32 bg-lime/40 md:w-48" />
              <span className="font-monospec text-[10px] uppercase tracking-[0.4em] text-secondary">
                Budapest · v4·07·26
              </span>
            </div>

            <p className="mt-9 max-w-[56ch] font-shorai text-xl leading-[1.4] tracking-[-0.005em] text-secondary md:text-2xl lg:text-[28px]">
              Egy fókuszált, vertikális stúdió termék-felületekre, design rendszerekre és
              frontend architektúrára. Stratégiától live deployig{" "}
              <span className="text-primary">összehangolt kontextusban</span> — mert a felület{" "}
              <span className="italic text-lime">a termék</span>.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-4">
              <Link
                href="/work"
                className="group inline-flex items-center gap-3 border-b-2 border-lime pb-1 font-khinterference text-3xl uppercase tracking-[0.04em] text-primary transition-colors hover:text-lime md:text-4xl"
              >
                <PixelIcon name="interface-essential-cursor-click-point" width={22} height={22} className="text-lime" aria-hidden />
                View projects
              </Link>
              <Link href="/method" className="font-khinterference text-2xl uppercase tracking-[0.04em] text-secondary transition-colors hover:text-cyan md:text-3xl">
                Methodology
              </Link>
              <Link href="/connect" className="font-khinterference text-2xl uppercase tracking-[0.04em] text-secondary transition-colors hover:text-magenta md:text-3xl">
                Connect
              </Link>
            </div>
          </div>

          {/* floating HUD panels (parallax) — desktop */}
          <div className="col-span-12 hidden lg:col-span-4 lg:block">
            <div className="relative h-full">
              {/* SYSTEM panel */}
              <div
                style={t(-18)}
                className="ml-auto w-[280px] border border-lime/25 bg-void/55 p-4 backdrop-blur-md"
              >
                <div className="mb-3 flex items-center justify-between font-monospec text-[10px] uppercase tracking-[0.3em] text-lime">
                  <span className="flex items-center gap-2">
                    <PixelIcon name="computers-devices-electronics-chipset" width={14} height={14} aria-hidden />
                    System
                  </span>
                  <Live />
                </div>
                <div className="space-y-2 font-monospec text-[11px] tracking-[0.1em]">
                  <StatusRow icon="computers-devices-electronics-monitor" label="RENDER" value="ONLINE" />
                  <StatusRow icon="internet-network-wifi-monitor" label="NODES" value="LINKED" color="text-cyan" />
                  <StatusRow icon="coding-apps-websites-shield-lock" label="RLS / AUTH" value="OK" />
                  <StatusRow icon="computers-devices-electronics-harddisk" label="DEPLOY" value="EDGE" color="text-magenta" />
                </div>
              </div>

              {/* coordinates chip */}
              <div
                style={t(-34)}
                className="mt-5 ml-auto w-[230px] border border-cyan/25 bg-void/55 p-3.5 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 font-monospec text-[10px] uppercase tracking-[0.3em] text-cyan">
                  <PixelIcon name="map-navigation-pin-location-1" width={14} height={14} aria-hidden />
                  Coordinates
                </div>
                <div className="mt-2 font-sequel text-2xl tracking-[-0.02em] text-primary">47.4979°N</div>
                <div className="font-monospec text-[10px] tracking-[0.2em] text-secondary/70">19.0402°E · CET</div>
              </div>

              {/* vol / issue marker */}
              <div style={t(-10)} className="mt-5 ml-auto w-[230px] font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary">
                <div className="flex items-center gap-2 text-lime/80">
                  <PixelIcon name="content-files-archive-books-1" width={14} height={14} aria-hidden />
                  Vol. IV · Issue 07
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScrollCue label="Tovább a metrikákhoz" />
      </div>
    </section>
  );
}
