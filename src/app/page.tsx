import Link from "next/link";
import { PROJECTS, PROCESS_STEPS, FAQ, TECH_STACK, ENGAGEMENT } from "@/data/projects";
import { ScrollCue } from "@/components/ScrollCue";
import { GoliathOrnament } from "@/components/GoliathSymbols";
import { ManifestoBand } from "@/components/ManifestoBand";
import { DecodeText } from "@/components/DecodeText";
import { TransmissionLog } from "@/components/TransmissionLog";
import { Operator } from "@/components/Operator";
import { AsciiField } from "@/components/AsciiField";

const COORD = "47.4979°N · 19.0402°E";

const STATS = [
  { n: "03", label: "Élesben futó rendszer", color: "lime" },
  { n: "98", label: "Lighthouse átlag", color: "cyan" },
  { n: "24h", label: "Maximum válaszidő", color: "magenta" },
  { n: ENGAGEMENT.launchRange, label: "Discovery → élesben", color: "orange" },
] as const;

const PRINCIPLES = [
  {
    n: "I.",
    head: "Vertikális stúdió, közös kontextus.",
    body: "Stratégia, design, frontend és deploy egy kézben. Nincs handoff-veszteség, nincs szilo, nincs lefordított szándék — a kontextus a discovery-től a launchig velem marad.",
  },
  {
    n: "II.",
    head: "Visszaszólunk, ha kell.",
    body: "Nem végrehajtók vagyunk. Ha egy brief logikai hibát rejt, egy design rosszul skálázódik, vagy egy stack-választás később megfojtja a terméket — szólunk. Stratégiai partnerek, nem yes-man-ek.",
  },
  {
    n: "III.",
    head: "Production-grade vagy semmi.",
    body: "98+ Lighthouse, RLS-szigorú adatréteg, edge runtime, akadálymentesség. A demo és az éles kód ugyanaz a kód.",
  },
];

export default function Home() {
  return (
    <>
      {/* ─────────────────────────────  HERO MANIFESTO  ───────────────────────────── */}
      <section
        data-section="§ 00"
        data-label="Introduction"
        className="relative z-10 px-6 md:px-10 pt-24 md:pt-40 pb-32 md:pb-56 overflow-hidden"
      >
        {/* Cursor-reactive ASCII field — behind static content (-z-10,
            see the ghost paint-order lesson) */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <AsciiField />
        </div>

        <div
          aria-hidden
          className="absolute top-0 right-0 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-lime/40 to-transparent rotate-[18deg] origin-top-right translate-x-[-25vw]"
        />

        <div className="max-w-[1500px] grid grid-cols-12 gap-y-12 md:gap-x-10">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 md:pt-4">
            <div className="font-monospec text-[10px] tracking-[0.35em] uppercase text-lime mb-6">
              Vol. IV
              <br />
              Issue 07
            </div>
            <div className="font-monospec text-[10px] tracking-[0.3em] uppercase text-secondary leading-relaxed">
              Design
              <br />
              Engineering
              <br />
              Unit
              <span className="block mt-3 text-cyan/70">— Budapest</span>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-4 font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary">
              <span className="text-lime">Design Engineering Unit</span>
              <span className="text-secondary/60">est. 2026 · Budapest</span>
            </div>

            <h1 className="font-khinterference uppercase leading-[0.82] tracking-[-0.015em] text-primary relative">
              {/* Decorative ornament marginalia (replaces font-goliath ·26· watermark) */}
              <GoliathOrnament
                seed="·26·"
                count={4}
                size="clamp(28px, 3.5vw, 64px)"
                className="text-lime/[0.06] absolute top-3 right-0 pointer-events-none hidden md:inline-flex"
              />

              <span className="block text-[clamp(72px,17vw,296px)] relative">
                <DecodeText text="PTRK" />
                <span className="text-lime">.</span>
              </span>
              <span className="block text-[clamp(72px,17vw,296px)] text-lime -mt-[0.05em]">
                <DecodeText text="Systems" delayMs={150} />
                <span className="text-cyan">·</span>
              </span>
            </h1>

            {/* Brand mark sub-rule */}
            <div className="mt-6 flex items-center gap-3" aria-hidden>
              <span className="block w-3 h-3 bg-lime" />
              <span className="block w-32 md:w-48 h-px bg-lime/40" />
              <span className="font-monospec text-[10px] uppercase tracking-[0.4em] text-secondary">
                Budapest · v4·07·26
              </span>
            </div>

            <p className="mt-10 font-shorai text-xl md:text-2xl lg:text-3xl text-secondary leading-[1.35] max-w-[58ch] tracking-[-0.005em]">
              Egy fókuszált, vertikális stúdió termék-felületekre, design rendszerekre és
              frontend architektúrára. Stratégiától live deployig{" "}
              <span className="text-primary">összehangolt kontextusban</span> — mert a felület{" "}
              <span className="italic text-lime">a termék</span>.
            </p>

            <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5">
              <Link
                href="/work"
                className="group font-khinterference uppercase tracking-[0.04em] text-3xl md:text-4xl text-primary border-b-2 border-lime pb-1 hover:text-lime transition-colors"
              >
                <span className="text-lime mr-3">→</span>View projects
              </Link>
              <Link
                href="/method"
                className="font-khinterference uppercase tracking-[0.04em] text-2xl md:text-3xl text-secondary hover:text-cyan transition-colors"
              >
                Methodology
              </Link>
              <Link
                href="/connect"
                className="font-khinterference uppercase tracking-[0.04em] text-2xl md:text-3xl text-secondary hover:text-magenta transition-colors"
              >
                Connect
              </Link>
            </div>

            <ScrollCue label="Tovább a metrikákhoz" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  RUNNING METER  ───────────────────────────── */}
      <section
        data-section="§ 01"
        data-label="Metrika"
        className="relative z-10 border-y border-white/10 bg-void/30 backdrop-blur-[1px]"
      >
        <div className="max-w-[1500px] px-6 md:px-10 py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {STATS.map((s, i) => {
            const isLong = s.n.length > 3;
            const sizeClass = isLong
              ? "text-[clamp(38px,5vw,84px)] tracking-[-0.05em]"
              : "text-[clamp(60px,8vw,128px)] tracking-[-0.04em]";
            return (
              <div
                key={s.label}
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
                className="px-2 md:px-8 py-6 md:py-2 flex flex-col items-start gap-3 min-w-0"
              >
                <span className="font-monospec text-[10px] tracking-[0.35em] uppercase text-secondary/60">
                  {String(i + 1).padStart(2, "0")} ·
                </span>
                {/* Fixed-height container so all numbers share the same baseline,
                    regardless of font-size differences */}
                <div className="flex items-end h-[clamp(60px,8vw,128px)]">
                  <span
                    className={`font-sequel ${sizeClass} leading-[0.85] whitespace-nowrap ${
                      s.color === "lime"
                        ? "text-lime"
                        : s.color === "cyan"
                        ? "text-cyan"
                        : s.color === "magenta"
                        ? "text-magenta"
                        : "text-orange"
                    }`}
                  >
                    {s.n}
                  </span>
                </div>
                <span className="font-shorai text-sm md:text-base text-secondary tracking-tight max-w-[20ch]">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────  ACCESS / PRICING NOTE  ───────────────────────────── */}
      <section
        data-section="§ 02"
        data-label="Hozzáférés"
        className="relative z-20 border-b border-white/10 px-6 md:px-10 py-32 md:py-48 overflow-hidden md:-mr-[260px]"
      >
        <GoliathOrnament
          seed="2026"
          count={4}
          size="clamp(110px, 17vw, 320px)"
          className="absolute -bottom-24 -right-12 text-lime/[0.04] pointer-events-none"
        />
        {/* 3D-extruded ghost word — the §02 section sits at z-20 so the
            whole slab (including this) paints ABOVE the right terminal
            aside (z-12); inline textShadow overrides .text-ghost's none */}
        <span
          aria-hidden
          className="text-ghost font-khinterference uppercase absolute right-2 top-10 -z-10 text-lime/35 text-[clamp(90px,15vw,240px)] leading-none pointer-events-none hidden lg:block"
          style={{
            textShadow:
              "3px 3px 0 rgba(194,254,12,0.14), 6px 6px 0 rgba(194,254,12,0.09), 9px 9px 0 rgba(194,254,12,0.05), 12px 12px 0 rgba(194,254,12,0.03)",
          }}
        >
          ACCESS
        </span>

        <div className="max-w-[1500px] grid grid-cols-12 gap-y-14 md:gap-x-10 relative">
          <aside className="col-span-12 md:col-span-3">
            <div className="font-monospec text-[10px] tracking-[0.4em] uppercase text-orange mb-6 flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-orange" />
              <span>▓ Access · Price</span>
            </div>
            <div className="font-monospec text-[10px] tracking-[0.3em] uppercase text-secondary leading-relaxed">
              Tiszta scope
              <br />
              <span className="text-orange">Fix árazás</span>
              <br />
              <span className="block mt-3 text-cyan/70">Gyors launch</span>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9">
            <h2 className="font-khinterference uppercase tracking-[-0.005em] text-[clamp(48px,9vw,144px)] leading-[0.88] text-primary">
              Mai áron,
              <br />
              <span className="text-lime">mai sebességgel.</span>
            </h2>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 max-w-[78ch]">
              <p className="font-shorai text-lg md:text-xl text-secondary leading-[1.55]">
                Nálunk nincs <span className="text-primary">felesleges óradíj-padding</span>,
                kéthónapos discovery-pose, hat oldalas változáskezelő és túlszámlázott
                ügynökségi marzs. Tiszta scope, fix árazás, kiszámítható launch — egy
                minőségi weboldal nem feltétlenül drága.
              </p>
              <p className="font-shorai text-lg md:text-xl text-secondary leading-[1.55]">
                <span className="text-lime">2026-ban a weboldal nem luxus, hanem alaprendszer.</span>{" "}
                Ha új embereket akarsz elérni és komolyan venni a céged jelenlétét,
                ez az első hely, ahol az érdeklődő találkozik veled. Megéri jól csinálni —
                és ehhez nem kell a kétszeresét fizetned.
              </p>
            </div>

            {/* Inline meter row */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 border-t border-white/15 pt-10">
              {[
                { n: ENGAGEMENT.launchRange, label: "Átlag launch", color: "lime" },
                { n: "1×", label: "Fix ár, nem óradíj", color: "cyan" },
                { n: "0", label: "Rejtett tétel", color: "magenta" },
                { n: "30d", label: "Hyper-care launch után", color: "orange" },
              ].map((m, i) => (
                <div
                  key={i}
                  data-reveal
                  style={{ transitionDelay: `${i * 70}ms` }}
                  className="flex flex-col gap-2"
                >
                  <span className="font-monospec text-[10px] tracking-[0.35em] uppercase text-secondary/60">
                    {String(i + 1).padStart(2, "0")} ·
                  </span>
                  <span
                    className={`font-sequel text-4xl md:text-5xl leading-none tracking-[-0.04em] ${
                      m.color === "lime"
                        ? "text-lime"
                        : m.color === "cyan"
                        ? "text-cyan"
                        : m.color === "magenta"
                        ? "text-magenta"
                        : "text-orange"
                    }`}
                  >
                    {m.n}
                  </span>
                  <span className="font-shorai text-sm text-secondary tracking-tight">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  PRINCIPLES  ───────────────────────────── */}
      <section
        data-section="§ 03"
        data-label="Alapkövek"
        className="relative z-10 px-6 md:px-10 py-36 md:py-56 border-t border-white/10"
      >
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-14 md:gap-x-10">
          <aside className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-32">
              <div className="font-monospec text-[10px] tracking-[0.35em] uppercase text-cyan mb-6">
                § 01 · Cornerstones
              </div>
              <h2 className="font-khinterference uppercase tracking-[0.02em] text-5xl md:text-6xl leading-[0.92] text-primary">
                Három
                <br />
                <span className="text-lime">alapkő.</span>
              </h2>
              <p className="mt-8 font-shorai text-base text-secondary max-w-xs leading-relaxed">
                A működésünket nem ügynökségi katalógus, hanem három non-negotiable
                alapkő tartja össze.
              </p>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9 flex flex-col">
            {PRINCIPLES.map((p, i) => (
              <article
                key={p.n}
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
                className={`py-14 md:py-20 ${
                  i !== PRINCIPLES.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-lime mb-6 flex items-center gap-3">
                  <span className="inline-block w-8 h-px bg-lime" />
                  <span>Alapkő {p.n}</span>
                </div>
                <h3 className="font-sequel text-3xl md:text-5xl tracking-[-0.02em] text-primary leading-[1.05] mb-6 max-w-[24ch]">
                  {p.head}
                </h3>
                <p className="font-shorai text-lg md:text-xl text-secondary leading-[1.55] max-w-[62ch]">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ManifestoBand />

      {/* ─────────────────────────────  PROJECT INDEX (preview)  ───────────────────────────── */}
      <section
        data-section="§ 04"
        data-label="Munkák"
        className="relative z-10 border-t border-white/10 bg-transparent"
      >
        <div className="max-w-[1500px] px-6 md:px-10 py-32 md:py-48">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
            <div>
              <div className="font-monospec text-[10px] tracking-[0.35em] uppercase text-magenta mb-4">
                § 02 · Index
              </div>
              <h2 className="font-khinterference uppercase tracking-[-0.005em] text-[clamp(56px,10vw,168px)] leading-[0.85] text-primary">
                Selected
                <br />
                <span className="text-lime">work.</span>
              </h2>
            </div>
            <Link
              href="/work"
              className="font-monospec text-[11px] uppercase tracking-[0.3em] text-cyan hover:text-lime transition-colors"
            >
              Full archive →
            </Link>
          </div>

          <ol className="border-t border-white/15">
            {PROJECTS.map((p, i) => {
              const colorClass =
                p.color === "lime"
                  ? "text-lime"
                  : p.color === "cyan"
                  ? "text-cyan"
                  : p.color === "magenta"
                  ? "text-magenta"
                  : "text-orange";
              return (
                <li
                  key={p.id}
                  data-reveal
                  style={{ transitionDelay: `${i * 70}ms` }}
                  className="border-b border-white/15"
                >
                  <Link href="/work" className="block group">
                    <div className="grid grid-cols-12 gap-4 py-8 md:py-12 items-baseline transition-colors group-hover:bg-surface/40">
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
            })}
          </ol>
        </div>
      </section>

      <Operator />
      <TransmissionLog />

      {/* ─────────────────────────────  PROCESS LADDER  ───────────────────────────── */}
      <section
        data-section="§ 05"
        data-label="Folyamat"
        className="relative z-10 border-t border-white/10 px-6 md:px-10 py-36 md:py-56 overflow-hidden"
      >
        <span
          aria-hidden
          className="text-ghost font-khinterference uppercase absolute -left-6 bottom-4 -z-10 text-orange/15 text-[clamp(90px,15vw,240px)] leading-none pointer-events-none hidden lg:block"
        >
          PROCESS
        </span>
        <div className="max-w-[1500px]">
          <div className="font-monospec text-[10px] tracking-[0.35em] uppercase text-orange mb-6">
            § 03 · Process · 06 phases
          </div>
          <h2 className="font-khinterference uppercase tracking-[0.02em] text-[clamp(48px,8vw,140px)] leading-[0.9] mb-20">
            <span className="block text-primary">Hat</span>
            <span className="block text-lime">fázis.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.number}
                data-reveal
                style={{ transitionDelay: `${(i % 3) * 70}ms` }}
                className="border-t border-white/15 pt-6 group"
              >
                <div className="flex items-baseline justify-between mb-4">
                  <span className="font-sequel text-7xl md:text-8xl text-lime leading-none tracking-[-0.04em]">
                    {step.number}
                  </span>
                  <span className="font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    Phase
                  </span>
                </div>
                <h3 className="font-sequel text-2xl md:text-3xl tracking-[-0.02em] text-primary mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="font-shorai text-base text-secondary leading-relaxed max-w-[36ch]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  STACK MARGINALIA  ───────────────────────────── */}
      <section
        data-section="§ 06"
        data-label="Stack"
        className="relative z-10 border-t border-white/10 px-6 md:px-10 py-32 md:py-48 bg-void/30"
      >
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10 items-end">
          <div className="col-span-12 md:col-span-5">
            <div className="font-monospec text-[10px] tracking-[0.35em] uppercase text-cyan mb-4">
              § 04 · Stack
            </div>
            <h2 className="font-khinterference uppercase tracking-[-0.005em] text-[clamp(56px,10vw,168px)] leading-[0.85] text-primary">
              Eszköz<span className="text-cyan">·</span>
              <br />tár.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7">
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 font-monospec text-sm tracking-[0.05em]">
              {TECH_STACK.filter(
                (t) => t.category !== "Hosting" && t.category !== "Design"
              ).map((t) => (
                <li
                  key={t.name}
                  className="flex items-baseline justify-between border-b border-white/10 pb-2 hover:border-lime/60 transition-colors"
                >
                  <span className="text-primary uppercase">{t.name}</span>
                  <span className="text-secondary text-[10px] tracking-[0.25em] uppercase">
                    {t.category}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  FAQ DIALOGUE  ───────────────────────────── */}
      <section
        data-section="§ 07"
        data-label="Kérdések"
        className="relative z-10 border-t border-white/10 px-6 md:px-10 py-36 md:py-56"
      >
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-14 md:gap-x-10">
          <aside className="col-span-12 md:col-span-4">
            <div className="font-monospec text-[10px] tracking-[0.35em] uppercase text-magenta mb-6">
              § 05 · Dialogue
            </div>
            <h2 className="font-khinterference uppercase tracking-[0.02em] text-5xl md:text-7xl leading-[0.92] text-primary mb-6">
              Gyakori
              <br />
              <span className="text-magenta">kérdések.</span>
            </h2>
            <p className="font-shorai text-secondary text-base leading-relaxed max-w-xs">
              Amit a leggyakrabban kérdeznek discovery-call előtt.
            </p>
          </aside>

          <div className="col-span-12 md:col-span-8">
            {FAQ.map((f, i) => (
              <details
                key={i}
                className="group border-b border-white/15 py-7 md:py-9"
                open={i === 0}
              >
                <summary className="cursor-pointer list-none flex items-baseline gap-6">
                  <span className="font-sequel text-3xl md:text-5xl text-lime/80 leading-none tracking-[-0.04em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-sequel text-2xl md:text-3xl text-primary tracking-[-0.015em] leading-tight group-hover:text-lime transition-colors">
                    {f.q}
                  </span>
                  <span className="font-monospec text-cyan text-2xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-5 ml-0 md:ml-[5.25rem] font-shorai text-lg text-secondary leading-relaxed max-w-[62ch]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────  COLOPHON / CTA  ───────────────────────────── */}
      <section
        data-section="§ 08"
        data-label="Engage"
        className="relative z-10 border-t border-white/10 px-6 md:px-10 py-36 md:py-56 overflow-hidden"
      >
        <div className="max-w-[1500px] relative">
          <div className="font-monospec text-[10px] tracking-[0.35em] uppercase text-lime mb-6">
            § 06 · Engage
          </div>

          <div className="relative">
            <GoliathOrnament
              seed="SYS·"
              count={4}
              size="clamp(72px, 13vw, 252px)"
              className="absolute -top-10 left-0 text-lime/[0.05] pointer-events-none"
            />
            <h2 className="font-khinterference uppercase tracking-[-0.005em] leading-[0.82] text-[clamp(72px,16vw,288px)] text-primary relative">
              Még<span className="text-lime">·</span>egy
              <br />
              <span className="text-lime">rendszer.</span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-y-8 md:gap-x-10 items-end">
            <p className="col-span-12 md:col-span-7 font-shorai text-xl md:text-2xl text-secondary leading-[1.4] max-w-[60ch] tracking-[-0.005em]">
              {ENGAGEMENT.nextSlot} nyit a következő retainer slot. Discovery call 30
              perc — utána vagy passzol, vagy elindul.
            </p>
            <div className="col-span-12 md:col-span-5 flex flex-col items-start md:items-end gap-5">
              <Link
                href="/connect"
                className="group inline-flex items-center gap-5 font-khinterference uppercase tracking-[0.02em] text-4xl md:text-5xl text-primary border-b-4 border-lime pb-2 hover:text-lime transition-colors"
              >
                Connect
                <span className="text-lime text-3xl group-hover:translate-x-2 transition-transform">
                  ⤤
                </span>
              </Link>
              <a
                href="mailto:hello@ptrksystems.com"
                className="font-monospec text-xs tracking-[0.25em] uppercase text-secondary hover:text-cyan transition-colors"
              >
                hello@ptrksystems.com
              </a>
              <Link
                href="/lab"
                className="font-monospec text-xs tracking-[0.25em] uppercase text-secondary hover:text-lime transition-colors"
              >
                § 05 · Experiments lab →
              </Link>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary/80">
            <div>
              <div className="text-cyan mb-2">Display</div>
              KH Interference · Sequel
            </div>
            <div>
              <div className="text-cyan mb-2">Body</div>
              Shorai · Fraktion
            </div>
            <div>
              <div className="text-cyan mb-2">Mono</div>
              Monospec · MS PGothic
            </div>
            <div>
              <div className="text-cyan mb-2">Coords</div>
              {COORD}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
