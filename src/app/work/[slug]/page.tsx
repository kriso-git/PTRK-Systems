import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { BrowserPreview } from "@/components/BrowserPreview";
import { Crosshair } from "@/components/Crosshair";
import { DecodeText } from "@/components/DecodeText";

const ACCENT_TEXT: Record<string, string> = {
  lime: "text-lime",
  cyan: "text-cyan",
  magenta: "text-magenta",
  orange: "text-orange",
};

const ACCENT_BG: Record<string, string> = {
  lime: "bg-lime",
  cyan: "bg-cyan",
  magenta: "bg-magenta",
  orange: "bg-orange",
};

const ACCENT_BORDER: Record<string, string> = {
  lime: "border-lime/30",
  cyan: "border-cyan/30",
  magenta: "border-magenta/30",
  orange: "border-orange/30",
};

/* Static literals — Tailwind JIT never sees runtime-built class names */
const ACCENT_LINK: Record<string, string> = {
  lime: "border-lime hover:text-lime",
  cyan: "border-cyan hover:text-cyan",
  magenta: "border-magenta hover:text-magenta",
  orange: "border-orange hover:text-orange",
};

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.id === slug);
  if (!p) return {};
  return {
    title: `${p.name} — Mission Debrief`,
    description: p.caseStudy.lead,
    alternates: { canonical: `/work/${p.id}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.id === slug);
  if (!p) notFound();

  const tx = ACCENT_TEXT[p.color];
  const bg = ACCENT_BG[p.color];
  const border = ACCENT_BORDER[p.color];
  const cs = p.caseStudy;

  return (
    <>
      {/* ─────────────────────────────  DEBRIEF HERO  ───────────────────────────── */}
      <section className="relative z-10 px-6 md:px-10 pt-24 md:pt-40 pb-20 md:pb-28 overflow-hidden">
        <div className="max-w-[1500px]">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span
              className={`font-monospec text-[11px] ${tx} border ${border} px-3 py-1.5 tracking-[0.25em] uppercase`}
            >
              ▓ Mission Debrief
            </span>
            <Link
              href="/work"
              className="font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary hover:text-primary transition-colors"
            >
              ← § 02 · Archívum
            </Link>
          </div>

          <h1
            className={`font-khinterference uppercase leading-[0.85] tracking-[-0.005em] text-[clamp(56px,12vw,200px)] ${tx}`}
          >
            <DecodeText text={p.name} />
          </h1>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/15 pt-8 font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary">
            <div>
              <div className="text-secondary/50 mb-2">Client</div>
              <div className={tx}>{p.client}</div>
            </div>
            <div>
              <div className="text-secondary/50 mb-2">Year</div>
              <div className="text-primary">{p.year}</div>
            </div>
            <div>
              <div className="text-secondary/50 mb-2">Role</div>
              <div className="text-primary">{p.role}</div>
            </div>
            <div>
              <div className="text-secondary/50 mb-2">Stack</div>
              <div className="text-primary leading-relaxed">
                {p.stack.join(" · ")}
              </div>
            </div>
          </div>

          <p className="mt-12 font-shorai text-xl md:text-2xl text-secondary leading-[1.4] max-w-[58ch] tracking-[-0.005em]">
            {cs.lead}
          </p>
        </div>
      </section>

      {/* ─────────────────────────────  D.01 BRIEFING  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10">
          <aside className="col-span-12 md:col-span-3">
            <div
              className={`font-monospec text-[10px] uppercase tracking-[0.4em] ${tx} flex items-center gap-3`}
            >
              <span className={`inline-block w-8 h-px ${bg}`} />
              <span>D.01 · Briefing</span>
            </div>
          </aside>
          <div className="col-span-12 md:col-span-9 flex flex-col gap-8">
            {cs.briefing.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="font-shorai text-lg md:text-xl text-secondary leading-[1.55] max-w-[64ch]"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  D.02 EXECUTION  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10">
          <aside className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-32">
              <div
                className={`font-monospec text-[10px] uppercase tracking-[0.4em] ${tx} flex items-center gap-3 mb-6`}
              >
                <span className={`inline-block w-8 h-px ${bg}`} />
                <span>D.02 · Execution</span>
              </div>
              <h2 className="font-khinterference uppercase tracking-[0.02em] text-4xl md:text-5xl leading-[0.92] text-primary">
                Mit
                <br />
                <span className={tx}>építettünk.</span>
              </h2>
            </div>
          </aside>
          <div className="col-span-12 md:col-span-9">
            {cs.execution.map((ex, i) => (
              <article
                key={ex.title}
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
                className={`py-10 md:py-14 ${
                  i !== cs.execution.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
              >
                <div className="font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary/60 mb-4">
                  EX.{String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-sequel text-2xl md:text-4xl tracking-[-0.02em] text-primary leading-[1.05] mb-4">
                  {ex.title}
                </h3>
                <p className="font-shorai text-lg text-secondary leading-[1.55] max-w-[62ch]">
                  {ex.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  D.03 DEBRIEF  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10">
          <aside className="col-span-12 md:col-span-3">
            <div
              className={`font-monospec text-[10px] uppercase tracking-[0.4em] ${tx} flex items-center gap-3`}
            >
              <span className={`inline-block w-8 h-px ${bg}`} />
              <span>D.03 · Debrief</span>
            </div>
          </aside>
          <ul className="col-span-12 md:col-span-9 flex flex-col gap-6">
            {cs.debrief.map((fact) => (
              <li key={fact.slice(0, 24)} className="flex items-baseline gap-4">
                <span className={`shrink-0 inline-block w-2 h-2 ${bg}`} />
                <span className="font-shorai text-lg md:text-xl text-primary leading-[1.5] max-w-[62ch]">
                  {fact}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────────────────────  D.04 ARTIFACTS  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-36">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-12 md:gap-x-10">
          <div className="col-span-12 md:col-span-5">
            <div
              className={`font-monospec text-[10px] uppercase tracking-[0.4em] ${tx} flex items-center gap-3 mb-8`}
            >
              <span className={`inline-block w-8 h-px ${bg}`} />
              <span>D.04 · Artifacts</span>
            </div>
            <ul className="flex flex-col">
              {cs.artifacts.map((a, i) => (
                <li
                  key={a}
                  className="flex items-baseline gap-4 border-b border-white/10 py-4"
                >
                  <span className="font-monospec text-[10px] tracking-[0.3em] text-secondary/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-khinterference uppercase tracking-[0.01em] text-lg md:text-xl text-primary">
                    {a}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-7 relative">
            <Crosshair position="tr" color={p.color} />
            <BrowserPreview project={p} />
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 inline-flex items-baseline gap-3 font-khinterference uppercase tracking-[0.02em] text-2xl md:text-3xl text-primary border-b-2 ${ACCENT_LINK[p.color]} pb-1 transition-colors`}
              >
                <span className={tx}>↗</span>
                {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  CTA  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-28 md:py-40">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10 items-end">
          <h2 className="col-span-12 md:col-span-8 font-khinterference uppercase tracking-[-0.005em] text-[clamp(44px,8vw,120px)] leading-[0.88] text-primary">
            Hasonló
            <br />
            <span className={tx}>rendszert</span> akarsz?
          </h2>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-5 md:items-end">
            <Link
              href="/connect"
              className="group inline-flex items-center gap-4 font-khinterference uppercase tracking-[0.02em] text-3xl md:text-4xl text-primary border-b-2 border-lime pb-1 hover:text-lime transition-colors"
            >
              <span className="text-lime">→</span>
              Connect
            </Link>
            <Link
              href="/work"
              className="font-monospec text-xs uppercase tracking-[0.3em] text-secondary hover:text-cyan transition-colors"
            >
              ← Vissza az archívumba
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
