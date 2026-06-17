import Link from "next/link";
import { PROJECTS, FAQ, TECH_STACK, ENGAGEMENT } from "@/data/projects";
import { GoliathOrnament } from "@/components/GoliathSymbols";
import { ManifestoBand } from "@/components/ManifestoBand";
import { TransmissionLog } from "@/components/TransmissionLog";
import { Operator } from "@/components/Operator";
import { ScrollJourneyLazy } from "@/components/ScrollJourneyLazy";
import { WorkIndexRow } from "@/components/WorkIndexRow";
import { HudHero } from "@/components/HudHero";
import { Cornerstones } from "@/components/Cornerstones";
import { StatsBar } from "@/components/StatsBar";
import { ProcessLadder } from "@/components/ProcessLadder";
import { PixelIcon } from "@/components/PixelIcon";

// Root page is NOT subject to the layout title.template, so set the full string.
export const metadata = { title: "PTRK-Systems - Introduction" };

const COORD = "47.4979°N · 19.0402°E";



export default function Home() {
  return (
    <>
      {/* ─────────────────────────────  HERO (immersive HUD-world)  ───────────────────────────── */}
      <HudHero />

      {/* ─────────────────────  SCROLL JOURNEY (pinned camera)  ───────────────────── */}
      {/* Cinematic fly-through: ENTER → STRATEGY → BUILD → SHIP. Lazy three.js,
          motion-gated, self-pinning via a fixed canvas over a 300vh wrap. */}
      <ScrollJourneyLazy />

      {/* ─────────────────────────────  LIVE METRICS (§01)  ───────────────────────────── */}
      <StatsBar />

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

        <div className="max-w-[1500px] grid grid-cols-12 gap-y-14 md:gap-x-10 relative">
          <aside className="col-span-12 md:col-span-3">
            <div className="font-monospec text-[10px] tracking-[0.4em] uppercase text-orange mb-6 flex items-center gap-3">
              <PixelIcon name="business-product-price-tag" width={15} height={15} aria-hidden />
              <span>§ 02 · Access · Price</span>
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

            {/* Inline meter row — HUD chips */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/15 pt-10">
              {[
                { n: ENGAGEMENT.launchRange, label: "Átlag launch", icon: "interface-essential-clock", text: "text-lime", bg: "bg-lime", border: "hover:border-lime/40" },
                { n: "1×", label: "Fix ár, nem óradíj", icon: "business-product-price-tag", text: "text-cyan", bg: "bg-cyan", border: "hover:border-cyan/40" },
                { n: "0", label: "Rejtett tétel", icon: "interface-essential-lock-shield", text: "text-magenta", bg: "bg-magenta", border: "hover:border-magenta/40" },
                { n: "30d", label: "Hyper-care launch után", icon: "single-user-shield", text: "text-orange", bg: "bg-orange", border: "hover:border-orange/40" },
              ].map((m, i) => (
                <div
                  key={i}
                  data-reveal
                  style={{ transitionDelay: `${i * 70}ms` }}
                  className={`group flex flex-col gap-2 border border-white/12 bg-void/30 p-4 backdrop-blur-[1px] transition-colors ${m.border}`}
                >
                  <div className={`flex items-center gap-2 ${m.text}`}>
                    <PixelIcon name={m.icon} width={15} height={15} aria-hidden />
                    <span className={`inline-block h-px w-5 ${m.bg} opacity-50`} />
                  </div>
                  <span className={`font-sequel text-4xl md:text-5xl leading-none tracking-[-0.04em] ${m.text}`}>
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

      {/* ─────────────────────────────  CORNERSTONES (why better)  ───────────────────────────── */}
      <Cornerstones />

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
              <div className="mb-4 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-magenta">
                <PixelIcon name="content-files-archive-books-1" width={15} height={15} aria-hidden />
                <span>§ 04 · Index</span>
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
            {PROJECTS.map((p, i) => (
              <WorkIndexRow key={p.id} project={p} index={i} />
            ))}
          </ol>
        </div>
      </section>

      <Operator />
      <TransmissionLog />

      {/* ─────────────────────────────  PROCESS LADDER (§05)  ───────────────────────────── */}
      <ProcessLadder />

      {/* ─────────────────────────────  STACK MARGINALIA  ───────────────────────────── */}
      <section
        data-section="§ 06"
        data-label="Stack"
        className="relative z-10 border-t border-white/10 px-6 md:px-10 py-32 md:py-48 bg-void/30"
      >
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10 items-end">
          <div className="col-span-12 md:col-span-5">
            <div className="mb-4 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-cyan">
              <PixelIcon name="computers-devices-electronics-chipset" width={15} height={15} aria-hidden />
              <span>§ 06 · Stack</span>
            </div>
            <h2 className="font-khinterference uppercase tracking-[-0.005em] text-[clamp(56px,10vw,168px)] leading-[0.85] text-primary">
              Eszköz<span className="text-cyan">·</span>
              <br />tár.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7">
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2.5 font-monospec text-sm tracking-[0.05em]">
              {TECH_STACK.filter(
                (t) => t.category !== "Hosting" && t.category !== "Design"
              ).map((t) => (
                <li
                  key={t.name}
                  className="group flex items-center gap-2.5 border border-white/10 bg-void/20 px-3 py-2.5 transition-colors hover:border-cyan/40 hover:bg-void/40"
                >
                  <span className="h-1.5 w-1.5 shrink-0 bg-cyan/50 transition-colors group-hover:bg-cyan" />
                  <span className="truncate uppercase text-primary">{t.name}</span>
                  <span className="ml-auto shrink-0 text-[9px] uppercase tracking-[0.2em] text-secondary/70">
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
            <div className="mb-6 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-magenta">
              <PixelIcon name="interface-essential-cog-search" width={15} height={15} aria-hidden />
              <span>§ 07 · Dialogue</span>
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
