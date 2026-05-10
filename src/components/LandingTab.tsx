import Link from "next/link";
import { Crosshair } from "./Crosshair";
import { DataStream } from "./DataStream";
import { FloatingIcon } from "./FloatingIcon";
import { Glyph } from "./Glyph";
import { SysLog } from "./SysLog";

const STATS = [
  { label: "ÉLES PROJEKTEK", value: "03", sub: "Production deployok", color: "lime" as const },
  { label: "LIGHTHOUSE", value: "98", sub: "Átlag teljesítmény", color: "cyan" as const },
  { label: "VÁLASZIDŐ", value: "<24h", sub: "Min minden levélre", color: "magenta" as const },
  { label: "STACK", value: "NEXT", sub: "TS · Supabase · Vercel", color: "orange" as const },
];

const STAT_CLASSES: Record<"lime" | "cyan" | "magenta" | "orange", { border: string; borderHover: string; text: string; glow: string }> = {
  lime: { border: "border-lime/20", borderHover: "hover:border-lime/60", text: "text-lime", glow: "hover:shadow-lime/20" },
  cyan: { border: "border-cyan/20", borderHover: "hover:border-cyan/60", text: "text-cyan", glow: "hover:shadow-cyan/20" },
  magenta: { border: "border-magenta/20", borderHover: "hover:border-magenta/60", text: "text-magenta", glow: "hover:shadow-magenta/20" },
  orange: { border: "border-orange/20", borderHover: "hover:border-orange/60", text: "text-orange", glow: "hover:shadow-orange/20" },
};

const SERVICES = [
  {
    code: "S.01",
    title: "Termék-felületek",
    desc: "Komplex SaaS dashboardok, B2B felületek, belső eszközök. Felhasználói kutatástól prototípusig.",
    color: "lime" as const,
    glyph: "cross-petal" as const,
  },
  {
    code: "S.02",
    title: "Design rendszerek",
    desc: "Komponens-könyvtárak, token architektúra, Figma → kód pipeline. Skálázható brand-aligned UI.",
    color: "cyan" as const,
    glyph: "hex-triangle" as const,
  },
  {
    code: "S.03",
    title: "Frontend architektúra",
    desc: "Next.js + TypeScript + Tailwind alapok, performance, akadálymentesség, SEO. Production-ready kód.",
    color: "magenta" as const,
    glyph: "diamond-arrow" as const,
  },
  {
    code: "S.04",
    title: "Auth + Adatréteg",
    desc: "Supabase + PostgreSQL + RLS. Edge functions, valós idejű előfizetések, biztonságos session-kezelés.",
    color: "orange" as const,
    glyph: "lime-hex" as const,
  },
];

export function LandingTab() {
  return (
    <>
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-10 py-32 md:py-40 bg-void relative overflow-hidden tab-enter">
        <DataStream />

        {/* Corner markers */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-lime/20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-cyan/20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-magenta/20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-orange/20 pointer-events-none" />

        {/* Floating decorative glyphs (no stars, kept far from text panels) */}
        <FloatingIcon className="absolute top-[14%] left-[3%] hidden xl:block opacity-30 text-white">
          <Glyph name="cross-petal" size={64} />
        </FloatingIcon>
        <FloatingIcon className="absolute bottom-[10%] right-[4%] hidden xl:block opacity-25 text-cyan">
          <Glyph name="hex-triangle" size={56} />
        </FloatingIcon>
        <FloatingIcon className="absolute top-[58%] left-[2%] hidden xl:block opacity-25 text-magenta">
          <Glyph name="diamond-arrow" size={48} />
        </FloatingIcon>

        <div className="max-w-[1600px] w-full relative z-10">
          {/* Big PTRK SYSTEMS brand badge */}
          <div className="mb-20 flex flex-wrap items-end gap-4 md:gap-6 border-b border-lime/15 pb-10">
            <div className="flex items-center gap-4">
              <Glyph name="lime-hex" size={44} color="#c2fe0c" />
              <div className="font-khinterference text-5xl md:text-7xl text-primary tracking-[0.04em] leading-none uppercase">
                PTRK<span className="text-lime"> Systems</span>
              </div>
            </div>
            <div className="font-monospec text-[11px] text-cyan/60 tracking-[0.35em] mb-2">
              ◢ DESIGN.ENGINEERING.UNIT ◣
            </div>
            <div className="ml-auto flex items-center gap-3 text-secondary font-monospec text-[10px] tracking-[0.3em]">
              <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
              SYS_ONLINE · BUDAPEST · CET
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            {/* Left: Text */}
            <div className="lg:col-span-7 relative">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="font-monospec text-[11px] text-lime bg-lime/10 border border-lime/30 px-3 py-1.5 tracking-[0.25em]">
                  █▓ ESCAPE WILL MAKE ME ████
                </span>
                <span className="font-monospec text-[10px] text-cyan tracking-[0.3em]">
                  → V4.07.26
                </span>
              </div>

              <h1 className="font-khinterference leading-[0.95] mb-14 tracking-[0.02em] uppercase break-words">
                <span className="block text-[clamp(48px,8vw,124px)] text-primary">Building</span>
                <span className="block text-[clamp(48px,8vw,124px)] text-primary">Digital</span>
                <span className="block text-[clamp(48px,8vw,124px)] text-lime">Systems.</span>
              </h1>

              <div className="bg-surface/80 backdrop-blur-xl border-l-4 border-lime p-8 md:p-12 mb-14 relative max-w-[680px]">
                <Crosshair position="tr" color="lime" />
                <p className="font-sequel text-xl md:text-2xl text-primary leading-[1.15] mb-4 tracking-[-0.01em]">
                  Design engineering csapat Budapesten.
                </p>
                <p className="font-shorai text-base md:text-lg text-secondary leading-relaxed">
                  Termék-felületek, design rendszerek és frontend architektúra —{" "}
                  <span className="text-lime font-shorai">egy fókuszált, vertikális egységtől</span>.
                  Stratégiától live deployig egy kézben.
                </p>
                <span className="absolute bottom-3 right-4 font-monospec text-[10px] text-cyan/40 tracking-widest">
                  v4.07.26 / NOD·0A20070A
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <Link
                  href="/work"
                  className="group relative px-8 md:px-12 py-4 md:py-5 bg-lime text-black font-monospec font-bold text-xs md:text-sm tracking-[0.25em] overflow-hidden hover:shadow-2xl hover:shadow-lime/50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-void"
                >
                  <span className="relative z-10">VIEW PROJECTS →</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Link>
                <Link
                  href="/method"
                  className="px-8 md:px-12 py-4 md:py-5 border-2 border-cyan/40 text-cyan font-monospec font-bold text-xs md:text-sm tracking-[0.25em] hover:bg-cyan hover:text-black transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                >
                  METHODOLOGY →
                </Link>
                <Link
                  href="/connect"
                  className="px-8 md:px-12 py-4 md:py-5 border-2 border-magenta/40 text-magenta font-monospec font-bold text-xs md:text-sm tracking-[0.25em] hover:bg-magenta hover:text-black transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
                >
                  CONNECT →
                </Link>
              </div>
            </div>

            {/* Right: Bento stats + Marathon mockup */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-5">
                {STATS.map((stat, i) => {
                  const c = STAT_CLASSES[stat.color];
                  return (
                    <div
                      key={i}
                      className={`bg-surface border ${c.border} ${c.borderHover} p-6 md:p-8 pt-10 md:pt-12 hover:scale-[1.02] hover:shadow-2xl ${c.glow} transition-all duration-300 group relative overflow-hidden`}
                    >
                      <span className={`absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 ${c.border.replace("/20", "/60")}`} />
                      <div className="font-monospec text-[9px] md:text-[10px] text-secondary mb-4 uppercase tracking-[0.25em] truncate">
                        {stat.label}
                      </div>
                      <div className={`font-sequel text-5xl md:text-6xl lg:text-7xl ${c.text} leading-[0.95] mb-3 tracking-[-0.04em]`}>
                        {stat.value}
                      </div>
                      <div className="font-shorai text-[11px] md:text-sm text-secondary tracking-wide leading-snug">{stat.sub}</div>
                      <span className="absolute bottom-3 right-3 font-monospec text-[9px] text-cyan/40">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                    </div>
                  );
                })}
              </div>

              <SysLog />
            </div>
          </div>

          {/* Marquee ticker */}
          <div className="mt-24 border-y border-lime/20 overflow-hidden bg-void/60">
            <div className="flex whitespace-nowrap py-3" style={{ animation: "ticker 32s linear infinite" }}>
              {Array.from({ length: 2 }).flatMap((_, dup) =>
                [
                  "DESIGN ENGINEERING",
                  "FRONTEND ARCHITECTURE",
                  "DESIGN SYSTEMS",
                  "PRODUCT INTERFACES",
                  "SUPABASE + RLS",
                  "BUDAPEST · CET",
                  "AVAILABLE Q3 2026",
                  "NOD·0A20070A",
                  "LNK·EC1153EC",
                  "ESCAPE WILL MAKE ME",
                ].map((t, i) => (
                  <span key={`${dup}-${i}`} className="font-monospec text-xs text-secondary mx-8 tracking-[0.3em]">
                    {t} <span className="text-lime mx-3">+</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES BLOCK */}
      <section className="px-6 md:px-10 py-32 md:py-44 bg-void relative overflow-hidden">
        <DataStream />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <header className="mb-20 md:mb-24 relative">
            <div className="absolute -left-2 md:-left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-lime via-cyan to-magenta" />
            <div className="pl-6 md:pl-8">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="font-monospec text-[11px] text-lime bg-lime/10 border border-lime/30 px-3 py-1.5 tracking-[0.25em]">
                  CAPABILITIES █▓
                </span>
                <span className="font-monospec text-[10px] text-cyan/60 tracking-[0.3em]">
                  SVC.01 → SVC.04
                </span>
              </div>
              <h2 className="font-khinterference text-[clamp(40px,7vw,96px)] leading-[1] mb-5 tracking-[0.02em] uppercase break-words">
                <span className="block text-primary">Mit</span>
                <span className="block text-lime">Csinálunk.</span>
              </h2>
              <p className="font-shorai text-lg md:text-xl text-secondary max-w-3xl leading-relaxed">
                Négy fő modulban dolgozunk — mindegyik önállóan is rendelhető, de a legjobb értéket akkor adja, amikor a teljes láncot egy csapat építi.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {SERVICES.map((s) => {
              const c = STAT_CLASSES[s.color];
              return (
                <article
                  key={s.code}
                  className={`bg-surface border ${c.border} ${c.borderHover} p-7 md:p-10 hover:scale-[1.01] hover:shadow-2xl ${c.glow} transition-all duration-300 group relative`}
                >
                  <Crosshair position="tl" color={s.color} />
                  <Crosshair position="br" color={s.color} />

                  <div className="flex items-start justify-between mb-6 gap-4">
                    <span className={`${c.text} opacity-90`}>
                      <Glyph name={s.glyph} size={56} />
                    </span>
                    <span className="font-monospec text-[10px] text-cyan/60 tracking-[0.3em] mt-2">
                      {s.code}
                    </span>
                  </div>

                  <h3 className={`font-sequel text-2xl md:text-3xl ${c.text} mb-4 tracking-[-0.02em] leading-tight`}>
                    {s.title}
                  </h3>
                  <p className="font-shorai text-base md:text-lg text-secondary leading-relaxed">
                    {s.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

    </>
  );
}
