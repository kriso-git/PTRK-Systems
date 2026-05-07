import { Crosshair } from "./Crosshair";
import { DataStream } from "./DataStream";
import { Glyph } from "./Glyph";
import { PROCESS_STEPS, TECH_STACK } from "@/data/projects";

const DELIVERABLES = [
  { code: "D.01", title: "Production kódbázis", desc: "Next.js 16 / Vite 5 + TypeScript strict, CI/CD-vel, Vercel / Cloudflare deploy ready." },
  { code: "D.02", title: "Design rendszer", desc: "Figma forrásfájlok, design token export, komponens dokumentáció." },
  { code: "D.03", title: "Adatréteg", desc: "Supabase PostgreSQL séma, Drizzle migrációk, RLS policy-k minden táblán." },
  { code: "D.04", title: "Knowledge transfer", desc: "Architektúra dokumentum, runbook, 30 napos hyper-care, tech onboarding." },
];

export function ProcessTab() {
  return (
    <section className="min-h-screen px-6 md:px-10 py-24 md:py-32 bg-void relative tab-enter overflow-hidden">
      <DataStream />

      <div className="max-w-[1600px] mx-auto relative z-10">
        <header className="mb-16 md:mb-20 relative">
          <div className="absolute -left-2 md:-left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan via-lime to-orange" />
          <div className="pl-6 md:pl-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="font-monospec text-[11px] text-cyan bg-cyan/10 border border-cyan/30 px-3 py-1.5 tracking-[0.25em]">
                METHODOLOGY █▓
              </span>
              <span className="font-monospec text-[10px] text-lime/60 tracking-[0.3em]">
                03 → PROCESS
              </span>
            </div>
            <h2 className="font-khinterference text-[clamp(40px,7vw,108px)] leading-[1] mb-6 tracking-[0.02em] uppercase break-words">
              <span className="block text-primary">Hogyan</span>
              <span className="block text-lime">Dolgozunk.</span>
            </h2>
            <p className="font-shorai text-lg md:text-xl text-secondary max-w-3xl leading-relaxed">
              6 lépéses folyamat, amely biztosítja, hogy minden projekt stratégiai, felhasználó-centrikus és technikailag kifogástalan legyen — discovery-től post-launch supportig.
            </p>
          </div>
        </header>

        {/* PROCESS STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20 md:mb-24">
          {PROCESS_STEPS.map((step, idx) => (
            <article
              key={step.number}
              className="bg-surface border border-lime/10 p-7 md:p-10 hover:border-lime/40 hover:scale-[1.01] hover:shadow-2xl hover:shadow-lime/10 transition-all duration-300 group relative"
            >
              <Crosshair position="tl" color="lime" />
              <Crosshair position="br" color="cyan" />

              <div className="flex items-start gap-5 md:gap-6">
                <div className="font-sequel text-5xl md:text-7xl text-lime/30 group-hover:text-lime/70 transition-colors leading-none tracking-[-0.04em]">
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-sequel text-xl md:text-2xl text-primary mb-3 group-hover:text-lime transition-colors tracking-[-0.01em] leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-shorai text-base md:text-lg text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="text-cyan/30 group-hover:text-cyan/60 transition-colors hidden md:block">
                  <Glyph
                    name={(["cross-petal", "hex-triangle", "diamond-arrow", "lime-hex", "scan-block", "bracket-x"] as const)[idx % 6]}
                    size={40}
                  />
                </div>
              </div>

              <span className="absolute bottom-3 right-4 font-monospec text-[10px] text-cyan/30 tracking-[0.3em]">
                STEP_{step.number}
              </span>
            </article>
          ))}
        </div>

        {/* DELIVERABLES — what you get */}
        <section className="mb-20 md:mb-24 relative">
          <div className="mb-10">
            <div className="font-monospec text-[11px] text-magenta bg-magenta/10 border border-magenta/30 px-3 py-1.5 tracking-[0.25em] inline-block mb-4">
              DELIVERABLES █▓
            </div>
            <h3 className="font-khinterference text-[clamp(36px,6vw,72px)] text-primary leading-[0.95] tracking-[0.02em] uppercase">
              Mit <span className="text-magenta">Kapsz.</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DELIVERABLES.map((d) => (
              <div key={d.code} className="bg-surface border border-magenta/15 p-7 md:p-9 hover:border-magenta/50 hover:scale-[1.01] transition-all relative group">
                <Crosshair position="tl" color="magenta" />
                <div className="font-monospec text-[11px] text-magenta tracking-[0.3em] mb-4">{d.code}</div>
                <h4 className="font-sequel text-xl md:text-2xl text-primary mb-3 tracking-[-0.01em] leading-tight">{d.title}</h4>
                <p className="font-shorai text-base text-secondary leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TECH STACK */}
        <section className="mb-20 md:mb-24 bg-surface border-t-4 border-lime p-6 md:p-10 relative overflow-hidden">
          <Crosshair position="tr" color="lime" />
          <Crosshair position="bl" color="cyan" />

          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
            <div>
              <div className="font-monospec text-[11px] text-secondary uppercase tracking-[0.3em] mb-2">
                PRIMARY TECH STACK · LIVE
              </div>
              <h3 className="font-khinterference text-3xl md:text-5xl text-primary tracking-[0.02em] uppercase">
                Amit <span className="text-lime">Használunk.</span>
              </h3>
            </div>
            <div className="font-monospec text-[10px] text-cyan/60 tracking-[0.3em]">
              v.2026.05 · 12 modul
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TECH_STACK.map((tech, i) => (
              <div
                key={i}
                className="bg-black/40 border border-lime/10 p-5 hover:border-lime hover:bg-lime/5 transition-all relative group min-w-0"
              >
                <div className="font-monospec text-[9px] text-secondary tracking-[0.3em] mb-2 group-hover:text-cyan transition-colors truncate">
                  {tech.category.toUpperCase()}
                </div>
                <div className="font-sequel text-base md:text-lg text-primary group-hover:text-lime transition-colors tracking-[-0.01em] leading-tight truncate">
                  {tech.name}
                </div>
                <span className="absolute bottom-1.5 right-2 font-monospec text-[9px] text-cyan/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </section>
  );
}
