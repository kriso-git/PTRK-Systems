"use client";

import { useRef } from "react";
import { PixelIcon } from "@/components/PixelIcon";
import { reducedMotion } from "@/lib/motion";

// The "why we are better" cornerstones – copy preserved verbatim from the old
// §03 PRINCIPLES, rebuilt as striking HUD nodes with pixel icons. On hover each
// card tilts toward the cursor in 3D, lifts/scales up, and a soft cursor-tracking
// glare sweeps across it. Disabled under prefers-reduced-motion.
const ITEMS = [
  {
    n: "I",
    icon: "interface-essential-wifi-signal",
    accent: "lime" as const,
    head: "Mérünk, nem ígérgetünk.",
    body: "Minden hónapban megmérjük és átláthatóan megmutatjuk, mi történik az oldaladdal: gyors-e, megtalálható-e, friss-e. Valós számokkal. Garantált csodaszámokat nem ígérünk, aki ilyet ígér egy új oldalnál, az tippel.",
  },
  {
    n: "II",
    icon: "interface-essential-cog-double",
    accent: "cyan" as const,
    head: "Élő gondozás, nem magára hagyott oldal.",
    body: "A weboldalad nem egyszeri munka, amit átadunk és elfelejtünk. Havonta karbantartjuk, figyeljük, mérjük a forgalmát, igény szerint fejlesztjük, és mindig a versenytársaid felett tartjuk. A felső szinten havi láthatósági jelentést is kapsz.",
  },
  {
    n: "III",
    icon: "interface-essential-satellite",
    accent: "magenta" as const,
    head: "Közvetlenül a döntéshozóval.",
    body: "Nem egy ügynökségi gépezetbe kerülsz, és nincs ügyfélszolgálati lánc. Közvetlenül velünk dolgozol, gyorsan: azzal, aki építi és gondozza az oldaladat.",
  },
];

const A = {
  lime: { text: "text-lime", bg: "bg-lime", border: "hover:border-lime/50", glow: "group-hover:shadow-[0_0_50px_-20px_rgba(194,254,12,0.8)]" },
  cyan: { text: "text-cyan", bg: "bg-cyan", border: "hover:border-cyan/50", glow: "group-hover:shadow-[0_0_50px_-20px_rgba(1,255,255,0.8)]" },
  magenta: { text: "text-magenta", bg: "bg-magenta", border: "hover:border-magenta/50", glow: "group-hover:shadow-[0_0_50px_-20px_rgba(234,2,126,0.8)]" },
};

const MAX_TILT = 8; // degrees
const HOVER_TRANSITION = "transform 160ms ease-out, box-shadow 350ms ease, border-color 350ms ease";
const REST_TRANSITION = "transform 620ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 500ms ease, border-color 500ms ease";

function CornerstoneCard({ it, i }: { it: (typeof ITEMS)[number]; i: number }) {
  const a = A[it.accent];
  const ref = useRef<HTMLElement>(null);

  function arm() {
    const el = ref.current;
    if (!el) return;
    // reveal stagger delay must not bleed into the hover transform
    el.style.transitionDelay = "0ms";
    el.style.transition = HOVER_TRANSITION;
  }

  function onMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    const ry = (px - 0.5) * 2 * MAX_TILT;
    const rx = (py - 0.5) * 2 * -MAX_TILT;
    el.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.05)`;
    el.style.zIndex = "20";
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = REST_TRANSITION;
    el.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.zIndex = "";
  }

  return (
    <article
      ref={ref}
      data-reveal
      onPointerEnter={arm}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ transitionDelay: `${i * 90}ms`, willChange: "transform" }}
      className={`group relative flex flex-col border border-white/12 bg-void/40 p-6 backdrop-blur-[2px] md:p-8 ${a.border} ${a.glow}`}
    >
      {/* HUD corner ticks */}
      <span aria-hidden className={`absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 ${a.text} opacity-40`} style={{ borderColor: "currentColor" }} />
      <span aria-hidden className={`absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 ${a.text} opacity-40`} style={{ borderColor: "currentColor" }} />

      {/* cursor-tracking glare */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.08), transparent 46%)" }}
      />

      <div className="mb-8 flex items-start justify-between">
        <div className={`grid h-14 w-14 place-items-center border border-white/12 ${a.text}`}>
          <PixelIcon name={it.icon} width={26} height={26} aria-hidden />
        </div>
        <span className={`font-sequel text-6xl leading-none tracking-[-0.04em] ${a.text} opacity-25 transition-opacity group-hover:opacity-100`}>
          {it.n}
        </span>
      </div>

      <div className="mb-5 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
        <span className={`inline-block h-px w-8 ${a.bg}`} />
        Alapkő {it.n}
      </div>

      <h3 className="mb-5 max-w-[20ch] font-sequel text-2xl leading-[1.1] tracking-[-0.02em] text-primary md:text-3xl">
        {it.head}
      </h3>
      <p className="font-shorai text-base leading-[1.55] text-secondary">
        {it.body}
      </p>
    </article>
  );
}

export function Cornerstones() {
  return (
    <section
      data-section="§ 03"
      data-label="Alapkövek"
      className="relative z-10 border-t border-white/10 px-6 py-32 md:px-10 md:py-48"
    >
      <div className="mx-auto max-w-[1500px]">
        {/* header */}
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="mb-5 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-cyan">
              <PixelIcon name="interface-essential-cog-double" width={15} height={15} aria-hidden />
              <span>§ 03 · Cornerstones</span>
            </div>
            <h2 className="font-khinterference uppercase leading-[0.85] tracking-[-0.005em] text-primary text-[clamp(48px,9vw,150px)]">
              Három
              <br />
              <span className="text-lime">alapkő.</span>
            </h2>
          </div>
          <p className="max-w-sm font-shorai text-base leading-relaxed text-secondary md:text-lg">
            Nem ügynökség vagyunk. Három dolog, amit a legtöbben nem adnak meg, ezért
            velünk biztonságosabb és jobb, mint egy ügynökséggel vagy egy sablonmegoldással.
          </p>
        </div>

        {/* cornerstone HUD nodes */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3" style={{ perspective: "1100px" }}>
          {ITEMS.map((it, i) => (
            <CornerstoneCard key={it.n} it={it} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
