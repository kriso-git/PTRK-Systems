"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Project } from "@/data/projects";

// ssr:false (View + three are browser-only) — a Server Component can't load it
// directly, so the row itself is a client island that owns the hover state.
const ProjectSignature = dynamic(
  () => import("@/components/r3f/ProjectSignature").then((m) => m.ProjectSignature),
  { ssr: false }
);

const ACCENT_TEXT: Record<string, string> = {
  lime: "text-lime",
  cyan: "text-cyan",
  magenta: "text-magenta",
  orange: "text-orange",
};

/**
 * WorkIndexRow — a single home §04 index row. The index stays a clean text list;
 * hovering a row reveals that project's signature object behind its number (only
 * on full / desktop, gated by `reveal={hover}`). On lite the index stays pure text
 * (showFallback={false}), so mobile sees no decorative glow.
 */
export function WorkIndexRow({ project: p, index: i }: { project: Project; index: number }) {
  const [hover, setHover] = useState(false);
  const colorClass = ACCENT_TEXT[p.color] ?? "text-orange";

  return (
    <li
      data-reveal
      style={{ transitionDelay: `${i * 70}ms` }}
      className="border-b border-white/15"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href="/work" className="block group">
        <div className="relative grid grid-cols-12 gap-4 py-8 md:py-12 items-baseline transition-colors group-hover:bg-surface/40">
          {/* signature: composited in the far z-2 canvas, so it sits behind the
              row text and reveals on hover, anchored over the index number */}
          <ProjectSignature
            projectId={p.id}
            color={p.color}
            active={hover}
            reveal={hover}
            showFallback={false}
            className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 md:block h-[140px] w-[140px]"
          />
          <div className="col-span-2 md:col-span-1 font-monospec text-xs md:text-sm text-secondary tracking-[0.2em]">
            {String(i + 1).padStart(2, "0")} /
          </div>
          <div className="col-span-10 md:col-span-5">
            <div
              className={`font-khinterference uppercase tracking-[0.01em] text-5xl md:text-7xl leading-none ${colorClass} transition-transform duration-500 group-hover:translate-x-2`}
            >
              {p.name}
            </div>
            <div className="font-shorai text-secondary mt-3 text-base md:text-lg">
              {p.client} · {p.role}
            </div>
          </div>
          <div className="col-span-7 md:col-span-4 font-shorai text-secondary/90 text-sm md:text-base leading-snug max-w-[44ch]">
            {p.desc}
          </div>
          <div className="col-span-5 md:col-span-2 text-right font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary">
            <div className={`${colorClass} font-sequel text-2xl md:text-3xl tracking-[-0.02em] leading-none mb-2`}>
              {p.metric}
            </div>
            <div>{p.metricLabel}</div>
            <div className="mt-2 opacity-60">{p.year}</div>
          </div>
        </div>
      </Link>
    </li>
  );
}
