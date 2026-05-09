import type { Metadata } from "next";
import Link from "next/link";
import { PROCESS_STEPS, TECH_STACK } from "@/data/projects";

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
      <section className="relative z-10 px-6 md:px-10 pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-[1700px] mx-auto grid grid-cols-12 gap-y-10 md:gap-x-10">
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
              <span
                aria-hidden
                className="font-goliath text-cyan/[0.04] absolute -top-8 -left-2 text-[clamp(120px,22vw,400px)] leading-none pointer-events-none select-none uppercase"
              >
                METHOD
              </span>
              <span className="relative">Stratégiától</span>
              <br />
              <span className="text-cyan relative">a deployig.</span>
            </h1>
            <p className="mt-10 font-shorai text-xl md:text-2xl text-secondary leading-[1.4] max-w-[58ch] tracking-[-0.005em]">
              Hat fázis, négy szállítható, egy vertikális csapat. A folyamat nem
              szilóban dolgozó egységeket próbál összevarrni, hanem{" "}
              <span className="text-primary">eleve közös kontextusban</span> tartja a teljes láncot.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  PROCESS LADDER  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10">
        <div className="max-w-[1700px] mx-auto">
          {PROCESS_STEPS.map((step, i) => (
            <article
              key={step.number}
              className={`grid grid-cols-12 gap-y-6 md:gap-x-10 px-6 md:px-10 py-14 md:py-20 ${
                i !== PROCESS_STEPS.length - 1 ? "border-b border-white/10" : ""
              } group hover:bg-surface/20 transition-colors`}
            >
              <aside className="col-span-12 md:col-span-3 lg:col-span-2">
                <div className="font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary mb-4">
                  Phase {step.number}
                </div>
                <div className="font-sequel text-7xl md:text-8xl lg:text-9xl text-lime leading-none tracking-[-0.05em] transition-transform duration-500 group-hover:translate-x-2">
                  {step.number}
                </div>
              </aside>

              <div className="col-span-12 md:col-span-9 lg:col-span-7">
                <h2 className="font-khinterference uppercase tracking-[0.005em] text-[clamp(36px,5vw,80px)] leading-[0.95] text-primary mb-6">
                  {step.title}
                </h2>
                <p className="font-shorai text-lg md:text-xl text-secondary leading-[1.55] max-w-[58ch]">
                  {step.desc}
                </p>
              </div>

              <aside className="hidden lg:flex col-span-3 lg:pl-8 lg:border-l lg:border-white/10 flex-col font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary leading-relaxed">
                <div className="text-cyan mb-3">Output</div>
                <div className="text-primary/80">{PHASE_OUTPUTS[i]}</div>
              </aside>
            </article>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────  DELIVERABLES  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-28 md:py-40">
        <div className="max-w-[1700px] mx-auto grid grid-cols-12 gap-y-14 md:gap-x-10">
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
                className={`py-12 md:py-14 ${
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
      <section className="relative z-10 border-t border-white/10 bg-surface/20 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1700px] mx-auto">
          <div className="grid grid-cols-12 gap-y-10 md:gap-x-10 items-end mb-14">
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
                className="grid grid-cols-12 gap-4 border-b border-white/15 py-6 md:py-8 items-baseline"
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
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1700px] mx-auto grid grid-cols-12 gap-y-8 md:gap-x-10 items-end">
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
