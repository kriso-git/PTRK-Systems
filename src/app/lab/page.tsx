import type { Metadata } from "next";
import Link from "next/link";
import { Crosshair } from "@/components/Crosshair";
import { GoliathOrnament } from "@/components/GoliathSymbols";
import { DecodeReplay, BootReplay } from "@/components/LabDemos";
import { LabEffectLazy } from "@/components/LabEffectLazy";

export const metadata: Metadata = {
  title: "Lab — Experiments Archive",
  description:
    "A PTRK Systems site-on élő craft-komponensek kiállítva: decode-animáció, Goliath szimbólum-készlet, boot-szekvencia, ambient HUD-réteg. Zéró extra runtime dependency, CSS + canvas + rAF.",
  alternates: { canonical: "/lab" },
};

type Experiment = {
  code: string;
  title: string;
  tech: string;
  desc: string;
  color: "lime" | "cyan" | "magenta" | "orange";
  demo: "decode" | "goliath" | "boot" | "ambient" | "reveal";
};

const EXPERIMENTS: Experiment[] = [
  {
    code: "EXP_001",
    title: "Decode",
    tech: "1 rAF · settle után leáll",
    desc: "Hex-scramble címsor-animáció: a karakterek HUD-glifákból pörögnek a végleges szövegig, balról jobbra settle-ölve. SSR és reduced-motion mindig a kész szöveget kapja.",
    color: "lime",
    demo: "decode",
  },
  {
    code: "EXP_002",
    title: "Goliath set",
    tech: "Pure SVG · 0 JS",
    desc: "Saját geometrikus szimbólum-készlet — a site dekoratív marginália-rétege. Seed-alapú determinisztikus szórás, prose-overlap védelemmel.",
    color: "cyan",
    demo: "goliath",
  },
  {
    code: "EXP_003",
    title: "Boot_Seq",
    tech: "Session-gated · skip bármire",
    desc: "BIOS-stílusú nyitány: 5 gépelt log-sor + scanline-wipe. Session-önként egyszer fut, bármely input skippeli, reduced-motion sosem látja.",
    color: "magenta",
    demo: "boot",
  },
  {
    code: "EXP_004",
    title: "Ambient HUD",
    tech: "3 canvas réteg · CSS-var lencse",
    desc: "A háttér-rendszer: kurzor-követett warp-mesh rács, kód-eső és élő terminál-aside — most is fut e mögött az oldal mögött. Touch-eszközön Lissajous auto-pan tartja életben.",
    color: "orange",
    demo: "ambient",
  },
  {
    code: "EXP_005",
    title: "Reveal wipe",
    tech: "1 megosztott IntersectionObserver",
    desc: "Clip-path alapú scroll-reveal: a tartalmi klaszterek balról jobbra húzódnak be. No-JS és reduced-motion látogatónál a tartalom mindig azonnal látható.",
    color: "lime",
    demo: "reveal",
  },
];

const WEBGL_EXPERIMENTS = [
  { code: "GL_001", title: "Raymarch", fx: "raymarch", color: "lime", tech: "1 fullscreen háromszög · gyroid SDF", desc: "Volumetrikus glow-raymarch egy animált gyroid-héjon, neon lime/cyan, scanline + vignette. Nulla geometria, tiszta fragment-matek." },
  { code: "GL_002", title: "Hologram", fx: "hologram", color: "cyan", tech: "Fresnel + scanline shader", desc: "Forgó knot fresnel-peremmel és scanline-villódzással, additív glow. HUD-hologram hangulat." },
  { code: "GL_003", title: "Voronoi", fx: "voronoi", color: "magenta", tech: "Cellular F1/F2 · domain-warp", desc: "Animált Voronoi-cellák izzó élekkel, fbm domain-warppal és kurzor-torzítással. Tiszta fragment-shader." },
  { code: "GL_004", title: "HUD-rács", fx: "grid", color: "orange", tech: "InstancedMesh · per-instance vertex", desc: "Instanced dot-matrix hullám-felszín: a kockák fbm-zajra hullámzanak, az egér hullámot küld a rácson." },
  { code: "GL_005", title: "Galaxis", fx: "galaxy", color: "lime", tech: "16k additív pont", desc: "Spirál-galaxis pont-felhő, lime-mag a cyan/magenta karokig, lassú forgás, kurzor-parallax." },
  { code: "GL_006", title: "Mátrix-eső", fx: "matrixrain", color: "cyan", tech: "Glyph-atlasz · InstancedMesh", desc: "Eső-glifák 3D mélységben, runtime canvas-atlaszból; a fej fehéren izzik, a csóva lime→cyan." },
  { code: "GL_007", title: "HUD-alagút", fx: "tunnel", color: "magenta", tech: "TubeGeometry · kamera-repülés", desc: "Repülés egy önmagát nem metsző wireframe HUD-alagútban, mélység-foggal. Tron/Marathon DNS." },
  { code: "GL_008", title: "Warp-mező", fx: "starfield", color: "orange", tech: "Streak-pontok · pointer-sebesség", desc: "Warp-sebességű csillagmező csíkokká nyújtott pontokkal; a sebesség a kurzor-távolságra reagál." },
] as const;

const ACCENT_TEXT: Record<string, string> = {
  lime: "text-lime",
  cyan: "text-cyan",
  magenta: "text-magenta",
  orange: "text-orange",
};

const ACCENT_BORDER: Record<string, string> = {
  lime: "border-lime/25",
  cyan: "border-cyan/25",
  magenta: "border-magenta/25",
  orange: "border-orange/25",
};

function Demo({ kind }: { kind: Experiment["demo"] }) {
  switch (kind) {
    case "decode":
      return <DecodeReplay />;
    case "goliath":
      return (
        <div className="flex flex-wrap items-center gap-6 text-cyan/70">
          <GoliathOrnament seed="LAB" count={6} size="48px" />
          <GoliathOrnament seed="EXP" count={6} size="32px" />
        </div>
      );
    case "boot":
      return <BootReplay />;
    case "ambient":
      return (
        <p className="font-monospec text-[11px] tracking-[0.2em] text-orange/70 uppercase leading-relaxed">
          ● Élőben fut — mozgasd a kurzort,
          <br />a háttér-rács követi.
        </p>
      );
    case "reveal":
      return (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              data-reveal
              style={{ transitionDelay: `${i * 120}ms` }}
              className="h-3 bg-lime/40"
            />
          ))}
        </div>
      );
  }
}

export default function LabPage() {
  return (
    <>
      {/* ─────────────────────────────  HERO  ───────────────────────────── */}
      <section className="relative z-10 px-6 md:px-10 pt-24 md:pt-40 pb-20 md:pb-28 overflow-hidden">
        <div className="max-w-[1500px]">
          <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-lime mb-6 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-lime" />
            <span>§ 05 · Lab</span>
          </div>
          <h1 className="font-khinterference uppercase leading-[0.86] tracking-[-0.005em] text-primary text-[clamp(56px,11vw,184px)]">
            Experiments
            <br />
            <span className="text-lime">archive.</span>
          </h1>
          <p className="mt-10 font-shorai text-xl md:text-2xl text-secondary leading-[1.4] max-w-[58ch] tracking-[-0.005em]">
            A site maga is portfólió-darab: az itt élő craft-komponensek kiállítva,
            működés közben. <span className="text-primary">Zéró extra runtime dependency</span> —
            CSS, canvas és requestAnimationFrame.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────  EXPERIMENTS  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1500px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {EXPERIMENTS.map((exp, i) => (
            <article
              key={exp.code}
              data-reveal
              style={{ transitionDelay: `${(i % 2) * 80}ms` }}
              className={`relative border ${ACCENT_BORDER[exp.color]} bg-surface/40 backdrop-blur-sm p-8 md:p-10 flex flex-col gap-6`}
            >
              <Crosshair position="tr" color={exp.color} />
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className={`font-monospec text-[10px] tracking-[0.35em] uppercase ${ACCENT_TEXT[exp.color]}`}
                >
                  {exp.code}
                </span>
                <span className="font-monospec text-[9px] tracking-[0.25em] uppercase text-secondary/60">
                  {exp.tech}
                </span>
              </div>
              <h2 className="font-sequel text-3xl md:text-4xl tracking-[-0.02em] text-primary leading-none">
                {exp.title}
              </h2>
              <p className="font-shorai text-base text-secondary leading-relaxed max-w-[52ch]">
                {exp.desc}
              </p>
              <div className="mt-auto pt-6 border-t border-white/10">
                <Demo kind={exp.demo} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────  WEBGL / THREE.JS  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1500px]">
          <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-cyan mb-6 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-cyan" />
            <span>§ 05 · WebGL · Three.js</span>
          </div>
          <h2 className="font-khinterference uppercase tracking-[-0.005em] text-primary text-[clamp(40px,7vw,128px)] leading-[0.88]">
            Real-time
            <br />
            <span className="text-cyan">render.</span>
          </h2>
          <p className="mt-8 font-shorai text-lg md:text-xl text-secondary leading-[1.45] max-w-[56ch]">
            Élő WebGL-réteg, izolált modulokként (init / frame / resize / dispose). Minden kártya
            csak akkor renderel, ha látszik, és <span className="text-primary">lazy töltődik</span> —
            a kritikus bundle érintetlen marad.
          </p>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {WEBGL_EXPERIMENTS.map((exp, i) => (
              <article
                key={exp.code}
                data-reveal
                style={{ transitionDelay: `${(i % 3) * 70}ms` }}
                className={`relative border ${ACCENT_BORDER[exp.color]} bg-surface/40 backdrop-blur-sm flex flex-col`}
              >
                <Crosshair position="tr" color={exp.color} />
                <div className="relative h-44 md:h-52 border-b border-white/10 overflow-hidden bg-void/50">
                  <LabEffectLazy fx={exp.fx} />
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={`font-monospec text-[10px] tracking-[0.35em] uppercase ${ACCENT_TEXT[exp.color]}`}>
                      {exp.code}
                    </span>
                    <span className="font-monospec text-[9px] tracking-[0.25em] uppercase text-secondary/60 text-right">
                      {exp.tech}
                    </span>
                  </div>
                  <h3 className="font-sequel text-2xl tracking-[-0.02em] text-primary leading-none">
                    {exp.title}
                  </h3>
                  <p className="font-shorai text-sm text-secondary leading-relaxed">{exp.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  CTA  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1500px] flex flex-wrap items-baseline justify-between gap-8">
          <p className="font-shorai text-lg md:text-xl text-secondary max-w-[48ch] leading-relaxed">
            Ugyanez a kraft megy az ügyfél-projektekbe is — nézd meg az archívumot.
          </p>
          <Link
            href="/work"
            className="group inline-flex items-center gap-4 font-khinterference uppercase tracking-[0.02em] text-2xl md:text-3xl text-primary border-b-2 border-lime pb-1 hover:text-lime transition-colors"
          >
            <span className="text-lime">→</span>
            Selected work
          </Link>
        </div>
      </section>
    </>
  );
}
