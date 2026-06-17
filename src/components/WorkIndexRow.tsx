"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PixelIcon } from "@/components/PixelIcon";
import { projectAccent } from "@/lib/project-accent";
import type { Project } from "@/data/projects";

// ssr:false (View + three are browser-only) — a Server Component can't load it
// directly, so the row itself is a client island that owns the hover state.
const ProjectSignature = dynamic(
  () => import("@/components/r3f/ProjectSignature").then((m) => m.ProjectSignature),
  { ssr: false }
);

/**
 * WorkIndexRow — a single home §04 index row, rebuilt as a HUD readout: a growing
 * accent rail + corner ticks light up on hover, a per-project pixel icon flags the
 * node, and the metric sits in a bordered HUD chip. Hovering still reveals the
 * project's signature object behind its number (desktop only, gated by reveal).
 */
export function WorkIndexRow({ project: p, index: i }: { project: Project; index: number }) {
  const [hover, setHover] = useState(false);
  const a = projectAccent(p.color);

  return (
    <li
      data-reveal
      style={{ transitionDelay: `${i * 70}ms` }}
      className="group relative border-b border-white/12"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* growing accent rail */}
      <span
        aria-hidden
        className={`absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100 ${a.bg}`}
      />
      {/* HUD corner ticks (hover) */}
      <span aria-hidden className={`pointer-events-none absolute left-1 top-2 h-3 w-3 border-l-2 border-t-2 opacity-0 transition-opacity group-hover:opacity-60 ${a.text}`} style={{ borderColor: "currentColor" }} />
      <span aria-hidden className={`pointer-events-none absolute bottom-2 right-1 h-3 w-3 border-b-2 border-r-2 opacity-0 transition-opacity group-hover:opacity-60 ${a.text}`} style={{ borderColor: "currentColor" }} />

      <Link href="/work" className="block">
        <div className="relative grid grid-cols-12 items-baseline gap-4 py-8 pl-4 transition-colors duration-300 group-hover:bg-surface/30 md:py-12 md:pl-7">
          {/* signature: composited in the far z-2 canvas, behind the row text */}
          <ProjectSignature
            projectId={p.id}
            color={p.color}
            active={hover}
            reveal={hover}
            showFallback={false}
            className="pointer-events-none absolute left-0 top-1/2 hidden h-[140px] w-[140px] -translate-y-1/2 md:block"
          />

          {/* index */}
          <div className="col-span-2 flex items-center gap-2 font-monospec text-xs tracking-[0.2em] md:col-span-1 md:text-sm">
            <span className={a.text}>{String(i + 1).padStart(2, "0")}</span>
            <span className="text-secondary/40">//</span>
          </div>

          {/* name + client/role */}
          <div className="col-span-10 md:col-span-5">
            <div className="flex items-center gap-3">
              <PixelIcon name={a.icon} width={20} height={20} className={`${a.text} shrink-0 opacity-70 transition-opacity group-hover:opacity-100`} aria-hidden />
              <span className={`font-khinterference text-5xl uppercase leading-none tracking-[0.01em] transition-transform duration-500 group-hover:translate-x-1.5 md:text-7xl ${a.text}`}>
                {p.name}
              </span>
              <span className={`translate-x-[-6px] font-sequel text-2xl opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:text-3xl ${a.text}`} aria-hidden>
                →
              </span>
            </div>
            <div className="mt-3 font-shorai text-base text-secondary md:text-lg">
              {p.client} · {p.role}
            </div>
          </div>

          {/* desc */}
          <div className="col-span-7 max-w-[44ch] font-shorai text-sm leading-snug text-secondary/90 md:col-span-4 md:text-base">
            {p.desc}
          </div>

          {/* metric HUD chip */}
          <div className="col-span-5 text-right md:col-span-2">
            <div className={`inline-flex flex-col items-end border px-3 py-2 transition-colors ${a.border} group-hover:bg-void/40`}>
              <span className={`font-sequel text-2xl leading-none tracking-[-0.02em] md:text-3xl ${a.text}`}>
                {p.metric}
              </span>
              <span className="mt-1 font-monospec text-[9px] uppercase tracking-[0.25em] text-secondary">
                {p.metricLabel}
              </span>
            </div>
            <div className="mt-2 font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary/50">
              {p.year}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
