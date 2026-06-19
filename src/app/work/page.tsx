import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS, ENGAGEMENT } from "@/data/projects";
import { BrowserPreview } from "@/components/BrowserPreview";
import { DecodeText } from "@/components/DecodeText";
import { WorkCaseSignature } from "@/components/WorkCaseSignature";
import { PixelIcon } from "@/components/PixelIcon";
import { projectAccent } from "@/lib/project-accent";

export const metadata: Metadata = {
  title: "Munkák · élő weboldal referenciák",
  description:
    "Válogatott munkák: F3XYKEE Terminal és MolekulaX. Élesben futó, prémium weboldalak, teljes mission debrief aloldalakkal.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      {/* ─────────────────────────────  HERO  ───────────────────────────── */}
      <section className="relative z-10 px-6 md:px-10 pt-24 md:pt-40 pb-24 md:pb-32 overflow-hidden">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 md:pt-4">
            <div className="font-monospec text-[10px] tracking-[0.4em] uppercase text-magenta mb-6 flex items-center gap-3">
              <PixelIcon name="content-files-archive-books-1" width={15} height={15} aria-hidden />
              <span>Work · Archive</span>
            </div>
            <div className="font-monospec text-[10px] tracking-[0.3em] uppercase text-secondary leading-relaxed">
              Selected
              <br />
              live · 2026
              <span className="block mt-3 text-cyan/70">– {PROJECTS.length} entries</span>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary mb-4">
              <span className="text-magenta">Selected work</span> · production deploys
            </div>
            <h1 className="font-khinterference uppercase leading-[0.86] tracking-[-0.005em] text-primary text-[clamp(60px,12vw,200px)]">
              Az
              <br />
              <span className="text-magenta">
                <DecodeText text="archívum." />
              </span>
            </h1>
            <p className="mt-10 font-shorai text-xl md:text-2xl text-secondary leading-[1.4] max-w-[58ch] tracking-[-0.005em]">
              Minden tétel a teljes design → engineering láncot mutatja: kutatás,
              információs architektúra, vizuális rendszer, frontend, deploy.{" "}
              <span className="text-primary">Vertikális stúdió</span>, end-to-end.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  PROJECT CASES  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10">
        <div className="max-w-[1500px]">
          {PROJECTS.map((p, i) => {
            const a = projectAccent(p.color);
            const tx = a.text;
            const bg = a.bg;
            const isLast = i === PROJECTS.length - 1;

            const articleContent = (
              <article
                data-reveal
                className={`relative px-6 md:px-10 py-28 md:py-40 ${
                  !isLast ? "border-b border-white/10" : ""
                } transition-colors group-hover:bg-surface/20`}
              >
                {/* HUD corner ticks (hover) */}
                <span aria-hidden className={`pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 opacity-0 transition-opacity duration-300 group-hover:opacity-50 ${tx}`} style={{ borderColor: "currentColor" }} />
                <span aria-hidden className={`pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 opacity-0 transition-opacity duration-300 group-hover:opacity-50 ${tx}`} style={{ borderColor: "currentColor" }} />
                <div className="grid grid-cols-12 gap-y-8 md:gap-x-10 mb-12 md:mb-14">
                  <aside className="col-span-12 md:col-span-3 lg:col-span-2 flex md:flex-col items-baseline md:items-start gap-6 md:gap-3">
                    <div className={`hidden md:grid h-11 w-11 place-items-center border border-white/12 ${tx} transition-colors group-hover:border-current`}>
                      <PixelIcon name={a.icon} width={20} height={20} aria-hidden />
                    </div>
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
                      Stilizált landing snapshot – kattints a debriefhez.
                    </div>
                    <WorkCaseSignature project={p} />
                  </div>
                  <div className="col-span-12 md:col-span-9 lg:col-span-10">
                    {/* asLink=false: the whole card is a Link to the
                        debrief page – no nested anchors */}
                    <BrowserPreview project={p} asLink={false} />
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
                    <div className="mt-10 inline-flex items-baseline gap-3 font-khinterference uppercase tracking-[0.02em] text-2xl md:text-3xl text-primary border-b-2 border-lime pb-1 group-hover:text-lime transition-colors">
                      <span className="text-lime">→</span>
                      Mission Debrief
                    </div>
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
            );

            return (
              <Link key={p.id} href={`/work/${p.id}`} className="block group">
                {articleContent}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────  SLOT OPEN  ───────────────────────────── */}
      <section className="relative z-10 border-t border-white/10 px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-8 md:gap-x-10 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-lime mb-6 flex items-center gap-3">
              <PixelIcon name="social-rewards-flag" width={15} height={15} aria-hidden />
              <span>Slot · Open</span>
            </div>
            <h2 className="font-khinterference uppercase tracking-[-0.005em] text-[clamp(48px,9vw,144px)] leading-[0.86] text-primary">
              A következő
              <br />
              <span className="text-lime">a tiéd</span> lehet.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-5 md:items-end">
            <p className="font-shorai text-base md:text-lg text-secondary leading-relaxed max-w-sm md:text-right">
              {ENGAGEMENT.nextSlot} nyit a következő szabad kapacitás. Egy 30 perces hívás, kötelezettség nélkül.
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
