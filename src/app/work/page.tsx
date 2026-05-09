import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import { BrowserPreview } from "@/components/BrowserPreview";

export const metadata: Metadata = {
  title: "Work — Selected Projects",
  description:
    "Válogatott design engineering projektek 2024–2026 között: F3XYKEE Terminal, MolekulaX, Donna Pizza. Stack, role, metrika, élő linkek.",
  alternates: { canonical: "/work" },
};

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

export default function WorkPage() {
  return (
    <>
      {/* ─────────────────────────────  HERO  ───────────────────────────── */}
      <section className="relative z-10 px-6 md:px-10 pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-[1700px] mx-auto grid grid-cols-12 gap-y-10 md:gap-x-10">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 md:pt-4">
            <div className="font-monospec text-[10px] tracking-[0.4em] uppercase text-magenta mb-6 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-magenta" />
              <span>§ 02 · Index</span>
            </div>
            <div className="font-monospec text-[10px] tracking-[0.3em] uppercase text-secondary leading-relaxed">
              Selected
              <br />
              live · 2026
              <span className="block mt-3 text-cyan/70">— {PROJECTS.length} entries</span>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary mb-4">
              <span className="text-lime">Selected work</span> · production deploys
            </div>
            <h1 className="font-khinterference uppercase leading-[0.86] tracking-[-0.005em] text-primary text-[clamp(60px,12vw,200px)]">
              Az
              <br />
              <span className="text-lime">archívum.</span>
            </h1>
            <p className="mt-10 font-shorai text-xl md:text-2xl text-secondary leading-[1.4] max-w-[58ch] tracking-[-0.005em]">
              Minden tétel a teljes design → engineering láncot mutatja: kutatás,
              információs architektúra, vizuális rendszer, frontend, deploy.{" "}
              <span className="text-primary">Vertikális csapat</span>, end-to-end.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  PROJECT CASES  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10">
        <div className="max-w-[1700px] mx-auto">
          {PROJECTS.map((p, i) => {
            const tx = ACCENT_TEXT[p.color];
            const bg = ACCENT_BG[p.color];
            const isLast = i === PROJECTS.length - 1;

            const Wrapper = ({ children }: { children: React.ReactNode }) =>
              p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block group"
                >
                  {children}
                </a>
              ) : (
                <div className="block group">{children}</div>
              );

            return (
              <Wrapper key={p.id}>
                <article
                  className={`px-6 md:px-10 py-20 md:py-28 ${
                    !isLast ? "border-b border-white/10" : ""
                  } transition-colors group-hover:bg-surface/20`}
                >
                  <div className="grid grid-cols-12 gap-y-8 md:gap-x-10 mb-12 md:mb-14">
                    <aside className="col-span-12 md:col-span-3 lg:col-span-2 flex md:flex-col items-baseline md:items-start gap-6 md:gap-3">
                      <div className="font-sequel text-5xl md:text-7xl leading-none tracking-[-0.04em]">
                        <span className={tx}>{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-secondary/40">/{String(PROJECTS.length).padStart(2, "0")}</span>
                      </div>
                      <div className="md:mt-4 leading-relaxed font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
                        <div className="text-secondary/80">{p.year}</div>
                        <div className={tx}>{p.client}</div>
                      </div>
                    </aside>

                    <h2
                      className={`col-span-12 md:col-span-9 lg:col-span-10 font-khinterference uppercase tracking-[0.005em] text-[clamp(56px,11vw,168px)] leading-[0.85] ${tx} transition-transform duration-500 group-hover:translate-x-3`}
                    >
                      {p.name}
                    </h2>
                  </div>

                  <div className="grid grid-cols-12 gap-y-8 md:gap-x-10 mb-12 md:mb-14">
                    <div className="hidden md:block md:col-span-3 lg:col-span-2 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block w-6 h-px ${bg}`} />
                        <span>Preview</span>
                      </div>
                      <div className="mt-3 text-secondary/60 leading-relaxed max-w-[18ch]">
                        Stilizált landing snapshot — kattints a látogatáshoz.
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-9 lg:col-span-10">
                      <BrowserPreview project={p} />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-y-10 md:gap-x-10">
                    <div className="hidden md:block md:col-span-3 lg:col-span-2 font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block w-6 h-px ${bg}`} />
                        <span>{p.role.split(" · ")[0]}</span>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6 lg:col-span-7">
                      <div className="font-monospec text-[11px] uppercase tracking-[0.3em] text-secondary mb-5">
                        {p.role}
                      </div>
                      <p className="font-shorai text-lg md:text-xl text-secondary leading-[1.55] max-w-[58ch]">
                        {p.desc}
                      </p>
                      <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-monospec text-[11px] uppercase tracking-[0.25em]">
                        {p.stack.map((s) => (
                          <li key={s} className="text-primary/80 flex items-center gap-2">
                            <span className={`inline-block w-1 h-1 ${bg}`} />
                            {s}
                          </li>
                        ))}
                      </ul>
                      {p.url && (
                        <div className="mt-10 inline-flex items-baseline gap-3 font-khinterference uppercase tracking-[0.02em] text-2xl md:text-3xl text-primary border-b-2 border-lime pb-1 group-hover:text-lime transition-colors">
                          <span className="text-lime">→</span>
                          {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </div>
                      )}
                    </div>

                    <aside className="col-span-12 md:col-span-3 lg:col-span-3 md:pl-8 md:border-l md:border-white/10 min-w-0">
                      <div className="font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary mb-4">
                        Metric
                      </div>
                      <div
                        className={`font-sequel ${tx} leading-none whitespace-nowrap ${
                          p.metric.length > 4
                            ? "text-[clamp(36px,4vw,68px)] tracking-[-0.05em]"
                            : "text-7xl md:text-8xl tracking-[-0.04em]"
                        }`}
                      >
                        {p.metric}
                      </div>
                      <div className="mt-3 font-shorai text-base text-secondary leading-snug max-w-[20ch]">
                        {p.metricLabel}
                      </div>
                    </aside>
                  </div>
                </article>
              </Wrapper>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────  SLOT OPEN  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1700px] mx-auto grid grid-cols-12 gap-y-8 md:gap-x-10 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-lime mb-6 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-lime" />
              <span>Slot · 04 · Open</span>
            </div>
            <h2 className="font-khinterference uppercase tracking-[-0.005em] text-[clamp(48px,9vw,144px)] leading-[0.86] text-primary">
              A következő
              <br />
              <span className="text-lime">a tiéd</span> lehet.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-5 md:items-end">
            <p className="font-shorai text-base md:text-lg text-secondary leading-relaxed max-w-sm md:text-right">
              Q3 · 2026 nyit a következő retainer slot. Discovery call 30 perc.
            </p>
            <Link
              href="/connect"
              className="group inline-flex items-center gap-4 font-khinterference uppercase tracking-[0.02em] text-3xl md:text-4xl text-primary border-b-2 border-lime pb-1 hover:text-lime transition-colors"
            >
              <span className="text-lime">→</span>
              Connect
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
