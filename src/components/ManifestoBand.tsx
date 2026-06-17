import Link from "next/link";
import { NodeTrigger } from "@/components/NodeTrigger";

/**
 * Full-bleed lime manifesto band – the site's boldest color surface.
 * Black-on-lime inverts the HUD palette; the Sprint 1 shield exemption
 * (.bg-lime *) keeps the dark text halo-free.
 */
export function ManifestoBand() {
  return (
    <section
      data-section="§ 03"
      data-label="Kiáltvány"
      className="relative z-10 bg-lime text-black overflow-hidden"
    >
      {/* Inverse corner markers – black on lime */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-black/80 pointer-events-none" />
      <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-black/80 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-black/80 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-black/80 pointer-events-none" />

      {/* Edge texture – thin black data-ticks along the top edge */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[6px] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.85) 0 2px, transparent 2px 14px)",
        }}
      />

      <div className="max-w-[1500px] px-6 md:px-10 py-10 md:py-14">
        <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-black/70 mb-6 flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-black/70" />
          <span>SYS·Manifesto·01 · Élő gondozás</span>
        </div>

        <h2 className="font-khinterference uppercase leading-[0.9] tracking-[-0.01em] text-[clamp(34px,5vw,76px)]">
          Te birtokolod, mi gondozzuk.
        </h2>
        <p className="mt-3 font-khinterference uppercase tracking-[0.01em] text-[clamp(20px,2.6vw,38px)] text-black/75">
          A weboldalad sosem marad magára, és sosem avul el.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <Link
            href="/connect"
            className="group inline-flex items-center gap-4 border-2 border-black px-8 md:px-12 py-4 md:py-5 font-monospec font-bold text-xs md:text-sm tracking-[0.25em] uppercase hover:bg-black hover:text-lime transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <span aria-hidden>→</span>
            Connect
          </Link>
          <span className="font-monospec text-[10px] tracking-[0.3em] uppercase text-black/60">
            <NodeTrigger id="nod-code" className="hover:text-black transition-colors">
              NOD·0A20070A
            </NodeTrigger>{" "}
            · Budapest · CET
          </span>
        </div>
      </div>
    </section>
  );
}
