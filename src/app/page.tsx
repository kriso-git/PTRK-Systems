import Link from "next/link";
import { PROJECTS, FAQ, ENGAGEMENT } from "@/data/projects";
import { GoliathOrnament } from "@/components/GoliathSymbols";
import { ManifestoBand } from "@/components/ManifestoBand";
import { TransmissionLog } from "@/components/TransmissionLog";
import { Operator } from "@/components/Operator";
import { WorkIndexRow } from "@/components/WorkIndexRow";
import { HudHero } from "@/components/HudHero";
import { Cornerstones } from "@/components/Cornerstones";
import { LiveCare } from "@/components/LiveCare";
import { StatsBar } from "@/components/StatsBar";
import { ProcessJourney } from "@/components/ProcessJourney";
import { PixelIcon } from "@/components/PixelIcon";

// Root page is NOT subject to the layout title.template, so set the full string.
export const metadata = {
  title: { absolute: "Weboldal készítés vállalkozásoknak · PTRK-Systems" },
  alternates: { canonical: "/" },
};


export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://ptrksystems.hu/#faq",
    inLanguage: "hu",
    isPartOf: { "@id": "https://ptrksystems.hu/#website" },
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      {/* ─────────────────────────────  HERO (immersive HUD-world)  ───────────────────────────── */}
      <HudHero />

      {/* ─────────────────────────────  LIVE METRICS (§01)  ───────────────────────────── */}
      <StatsBar />


      {/* ─────────────────────────────  ÉLŐ GONDOZÁS (§02 · the full offer: build + care)  ───────────────────────────── */}
      <LiveCare />

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

      {/* ─────────────────────────────  PROCESS JOURNEY (§05 · pinned scrollytelling)  ───────────────────────────── */}
      <ProcessJourney />

      {/* ─────────────────────────────  A MOTOR (§ 06 · benefits, no tool names)  ───────────────────────────── */}
      <section
        data-section="§ 06"
        data-label="A motor"
        className="relative z-10 border-t border-white/10 px-6 md:px-10 py-32 md:py-48 bg-void/30"
      >
        <div className="max-w-[1500px] grid grid-cols-12 gap-y-10 md:gap-x-10 items-end">
          <div className="col-span-12 md:col-span-5">
            <div className="mb-4 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-cyan">
              <PixelIcon name="computers-devices-electronics-chipset" width={15} height={15} aria-hidden />
              <span>§ 06 · Core</span>
            </div>
            <h2 className="font-khinterference uppercase tracking-[-0.005em] text-[clamp(56px,10vw,168px)] leading-[0.85] text-primary">
              A <span className="text-cyan">motor.</span>
            </h2>
            <p className="mt-6 max-w-md font-shorai text-base md:text-lg text-secondary leading-relaxed">
              Nem látod, de ez hajtja az oldaladat. A lényeg, amit te is érzel belőle:
            </p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { t: "Villámgyors", d: "másodperc alatt tölt, mobilon is", icon: "interface-essential-wifi-signal" },
                { t: "Biztonságos és friss", d: "folyamatos frissítés, mentés, SSL", icon: "coding-apps-websites-shield-lock" },
                { t: "Egyedi, nem sablon", d: "a te igényedre épül, nem kész téma", icon: "interface-essential-cog-double" },
                { t: "Google-ready", d: "technikai SEO az első naptól", icon: "interface-essential-search-check" },
              ].map((b) => (
                <li
                  key={b.t}
                  className="group flex items-start gap-3 border border-white/10 bg-void/20 px-4 py-4 transition-colors hover:border-cyan/40 hover:bg-void/40"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center border border-cyan/30 text-cyan">
                    <PixelIcon name={b.icon} width={15} height={15} aria-hidden />
                  </span>
                  <span>
                    <span className="block font-sequel text-lg text-primary tracking-[-0.01em]">{b.t}</span>
                    <span className="block font-shorai text-sm text-secondary leading-snug">{b.d}</span>
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
          <div className="mb-6 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-lime">
            <PixelIcon name="social-rewards-flag" width={15} height={15} aria-hidden />
            <span>§ 08 · Engage</span>
          </div>

          <div className="relative">
            <GoliathOrnament
              seed="SYS·"
              count={4}
              size="clamp(72px, 13vw, 252px)"
              className="absolute -top-10 left-0 text-lime/[0.05] pointer-events-none"
            />
            <h2 className="font-khinterference uppercase tracking-[-0.005em] leading-[0.82] text-[clamp(72px,16vw,288px)] text-primary relative">
              Beszéljünk
              <br />
              <span className="text-lime">a tiédről.</span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-y-8 md:gap-x-10 items-end">
            <p className="col-span-12 md:col-span-7 font-shorai text-xl md:text-2xl text-secondary leading-[1.4] max-w-[60ch] tracking-[-0.005em]">
              {ENGAGEMENT.nextSlot} nyit a következő szabad kapacitás. Egy 30 perces
              hívásban megnézzük, mire van szükséged, és akár egy kész mintát is mutatunk
              a te cégedről. Kötelezettség nélkül.
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
                href="mailto:hello@ptrksystems.hu"
                className="font-monospec text-xs tracking-[0.25em] uppercase text-secondary hover:text-cyan transition-colors"
              >
                hello@ptrksystems.hu
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
