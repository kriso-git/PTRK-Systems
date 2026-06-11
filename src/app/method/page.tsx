import type { Metadata } from "next";
import Link from "next/link";
import { PROCESS_STEPS, TECH_STACK } from "@/data/projects";
import { Crosshair } from "@/components/Crosshair";
import { GoliathOrnament } from "@/components/GoliathSymbols";
import { DecodeText } from "@/components/DecodeText";

export const metadata: Metadata = {
  title: "Method — Hogyan dolgozom",
  description:
    "6 lépéses design engineering folyamat — kutatás, IA, design, frontend, tesztelés, launch. Stratégiai, felhasználó-centrikus, technikailag kifogástalan.",
  alternates: { canonical: "/method" },
};

const DELIVERABLES = [
  {
    code: "D.01",
    title: "Production kódbázis",
    desc: "Next.js 16 / Vite 5 + TypeScript strict, CI/CD-vel, Vercel / Cloudflare deploy ready.",
  },
  {
    code: "D.02",
    title: "Design rendszer",
    desc: "Design token export, komponens-leírás és teljes weboldal-dokumentáció.",
  },
  {
    code: "D.03",
    title: "Adatréteg",
    desc: "Supabase PostgreSQL séma, Drizzle migrációk, RLS policy-k minden táblán.",
  },
  {
    code: "D.04",
    title: "Knowledge transfer",
    desc: "Architektúra dokumentum, runbook, 30 napos hyper-care, tech onboarding.",
  },
];

const STACK_BY_CATEGORY = TECH_STACK.filter(
  (t) => t.category !== "Hosting" && t.category !== "Design",
).reduce<Record<string, string[]>>((acc, t) => {
  (acc[t.category] ||= []).push(t.name);
  return acc;
}, {});

const PHASE_OUTPUTS = [
  "Discovery brief, success metrics",
  "Wireframes, user flows",
  "Hi-fi design + token system",
  "Production code, CI/CD",
  "Test reports, A/B variants",
  "Runbook, hyper-care",
];

export default function MethodPage() {
  return (
    <>
      {/* ─────────────────────────────  HERO  ───────────────────────────── */}
      <section className="relative z-10 px-6 md:px-10 pt-32 md:pt-48 pb-32 md:pb-44 overflow-hidden">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 md:pt-4">
            <div className="font-monospec text-[10px] tracking-[0.4em] uppercase text-cyan mb-6 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-cyan" />
              <span>§ 03 · Method</span>
            </div>
            <div className="font-monospec text-[10px] tracking-[0.3em] uppercase text-secondary leading-relaxed">
              Process
              <br />
              06 phases
              <span className="block mt-3 text-cyan/70">discovery → ship</span>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary mb-4">
              <span className="text-cyan">Methodology</span> · how we operate
            </div>
            <h1 className="font-khinterference uppercase leading-[0.86] tracking-[-0.005em] text-primary text-[clamp(60px,12vw,200px)] relative">
              <GoliathOrnament
                seed="METHOD"
                count={6}
                size="clamp(72px, 13vw, 240px)"
                className="absolute -top-8 -left-2 text-cyan/[0.04] pointer-events-none"
              />
              <span className="relative">
                <DecodeText text="Stratégiától" />
              </span>
              <br />
              <span className="text-cyan relative">
                <DecodeText text="a deployig." delayMs={150} />
              </span>
            </h1>
            <p className="mt-10 font-shorai text-xl md:text-2xl text-secondary leading-[1.4] max-w-[58ch] tracking-[-0.005em]">
              Hat fázis, négy szállítható, egy vertikális csapat. A folyamat nem
              szilóban dolgozó egységeket próbál összevarrni, hanem{" "}
              <span className="text-primary">eleve közös kontextusban</span> tartja a teljes láncot.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  PROCESS LADDER (single Marathon tile)  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1500px]">
          {/* Section label */}
          <div className="mb-10 flex items-baseline gap-4">
            <span className="font-monospec text-[10px] tracking-[0.4em] uppercase text-cyan">
              § 03 / PROCESS
            </span>
            <span className="h-px flex-1 bg-lime/20" />
            <span className="font-monospec text-[10px] tracking-[0.3em] uppercase text-secondary">
              06 phases
            </span>
          </div>

          {/* THE TILE */}
          <div className="relative border border-lime/30 bg-surface/40 backdrop-blur-sm">
            <Crosshair position="tl" color="lime" />
            <Crosshair position="tr" color="cyan" />
            <Crosshair position="bl" color="magenta" />
            <Crosshair position="br" color="orange" />

            {/* Tile header bar */}
            <div className="flex items-center justify-between border-b border-lime/20 bg-black/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
                <span className="font-monospec text-[10px] text-lime tracking-[0.3em]">
                  METHOD.LADDER · 06
                </span>
              </div>
              <span className="font-monospec text-[10px] text-cyan/60 tracking-[0.25em]">
                DISCOVERY → SHIP
              </span>
            </div>

            {/* 6 phase rows */}
            <ul className="divide-y divide-lime/15">
              {PROCESS_STEPS.map((step, i) => (
                <li
                  key={step.number}
                  data-reveal
                  style={{ transitionDelay: `${i * 60}ms` }}
                  className="group grid grid-cols-12 items-center gap-x-4 md:gap-x-6 px-4 md:px-6 py-5 md:py-7 hover:bg-lime/[0.03] transition-colors"
                >
                  {/* Phase number with frame */}
                  <div className="col-span-3 md:col-span-2 flex items-center gap-2 md:gap-3">
                    <div className="hidden md:block font-monospec text-[9px] tracking-[0.3em] text-secondary">
                      P.{step.number}
                    </div>
                    <div className="border border-lime/30 bg-black/50 px-2.5 py-1 group-hover:border-lime/70 group-hover:bg-lime/5 transition-colors">
                      <div className="font-sequel text-2xl md:text-3xl text-lime leading-none tracking-[-0.04em]">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="col-span-9 md:col-span-5 font-khinterference uppercase text-base md:text-2xl text-primary tracking-[0.005em] leading-tight">
                    {step.title}
                  </h3>

                  {/* Desc */}
                  <p className="col-span-12 md:col-span-3 font-shorai text-sm text-secondary leading-relaxed hidden md:block">
                    {step.desc}
                  </p>

                  {/* Output */}
                  <div className="col-span-12 md:col-span-2 hidden md:flex flex-col items-end font-monospec text-[9px] uppercase tracking-[0.25em] leading-relaxed">
                    <span className="text-cyan/70 mb-0.5">OUT</span>
                    <span className="text-primary/70 text-right">{PHASE_OUTPUTS[i]}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Tile footer bar */}
            <div className="flex items-center justify-between border-t border-lime/20 bg-black/40 px-5 py-3">
              <span className="font-monospec text-[10px] text-secondary tracking-[0.3em]">
                ▓▓▓ END.LADDER
              </span>
              <span className="font-monospec text-[10px] text-lime/60 tracking-widest">
                06 / 06
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  DELIVERABLES  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-40 md:py-64">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-20 md:gap-x-10">
          <aside className="col-span-12 md:col-span-4">
            <div className="md:sticky md:top-32">
              <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-magenta mb-6 flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-magenta" />
                <span>§ 04 · Deliverables</span>
              </div>
              <h2 className="font-khinterference uppercase tracking-[0.005em] text-5xl md:text-7xl leading-[0.92] text-primary mb-6">
                Mit
                <br />
                <span className="text-magenta">kapsz.</span>
              </h2>
              <p className="font-shorai text-base text-secondary leading-relaxed max-w-xs">
                Négy konkrét artefaktum az engagement végén — minden tovább viszi a
                terméket utánunk is.
              </p>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-8">
            {DELIVERABLES.map((d, i) => (
              <article
                key={d.code}
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
                className={`py-16 md:py-20 ${
                  i !== DELIVERABLES.length - 1 ? "border-b border-white/15" : ""
                }`}
              >
                <div className="font-monospec text-[10px] uppercase tracking-[0.35em] text-magenta mb-4 flex items-center gap-3">
                  <span className="inline-block w-6 h-px bg-magenta" />
                  <span>{d.code}</span>
                </div>
                <h3 className="font-sequel text-3xl md:text-5xl tracking-[-0.02em] text-primary leading-[1.05] mb-5 max-w-[24ch]">
                  {d.title}
                </h3>
                <p className="font-shorai text-lg md:text-xl text-secondary leading-[1.55] max-w-[58ch]">
                  {d.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  STACK TABLE  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 bg-void/30 px-6 md:px-10 py-40 md:py-56">
        <div className="max-w-[1500px]">
          <div className="grid grid-cols-12 gap-y-12 md:gap-x-10 items-end mb-20">
            <div className="col-span-12 md:col-span-7">
              <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-orange mb-4 flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-orange" />
                <span>§ 05 · Stack</span>
              </div>
              <h2 className="font-khinterference uppercase tracking-[-0.005em] text-[clamp(48px,8vw,128px)] leading-[0.88] text-primary">
                Eszköz<span className="text-orange">·</span>
                <br />
                tár.
              </h2>
            </div>
            <p className="col-span-12 md:col-span-5 font-shorai text-lg text-secondary leading-relaxed max-w-md">
              Egységes stack minden projektben — production-grade, jól ismert, gyorsan
              skálázható. Nincs cserélgetés, nincs kísérletezés éles ügyféllel.
            </p>
          </div>

          <ul className="border-t border-white/15">
            {Object.entries(STACK_BY_CATEGORY).map(([category, names]) => (
              <li
                key={category}
                className="grid grid-cols-12 gap-4 border-b border-white/15 py-10 md:py-12 items-baseline"
              >
                <div className="col-span-12 md:col-span-3 font-monospec text-[11px] uppercase tracking-[0.3em] text-orange">
                  {category}
                </div>
                <div className="col-span-12 md:col-span-9 flex flex-wrap gap-x-8 gap-y-3 font-khinterference uppercase tracking-[0.01em] text-2xl md:text-3xl text-primary">
                  {names.map((n) => (
                    <span key={n} className="hover:text-lime transition-colors">
                      {n}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────────────────────  CTA  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-40 md:py-56">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-12 md:gap-x-10 items-end">
          <h2 className="col-span-12 md:col-span-8 font-khinterference uppercase tracking-[-0.005em] text-[clamp(48px,9vw,144px)] leading-[0.86] text-primary">
            Készen állsz egy
            <br />
            <span className="text-lime">discovery call</span>-ra?
          </h2>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-5 md:items-end">
            <Link
              href="/connect"
              className="group inline-flex items-center gap-4 font-khinterference uppercase tracking-[0.02em] text-3xl md:text-4xl text-primary border-b-2 border-lime pb-1 hover:text-lime transition-colors"
            >
              <span className="text-lime">→</span>
              Beszéljünk
            </Link>
            <a
              href="mailto:hello@ptrksystems.com"
              className="font-monospec text-xs uppercase tracking-[0.3em] text-secondary hover:text-cyan transition-colors"
            >
              hello@ptrksystems.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
