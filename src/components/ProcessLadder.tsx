import { PixelIcon } from "@/components/PixelIcon";
import { PROCESS_STEPS } from "@/data/projects";
import { PHASE_ICONS } from "@/lib/process-icons";

/**
 * ProcessLadder — the home §05 process, rebuilt as a ladder of HUD nodes. Each
 * phase is a bordered node with its pixel icon, a big ghost number that lights up
 * on hover, a "PHASE NN" rail, and a 6-segment progress strip that fills up to the
 * current phase so the climb from discovery to launch reads at a glance.
 */
export function ProcessLadder() {
  const total = PROCESS_STEPS.length;
  return (
    <section
      data-section="§ 05"
      data-label="Folyamat"
      className="relative z-10 overflow-hidden border-t border-white/10 px-6 py-36 md:px-10 md:py-56"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-6 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-orange">
          <PixelIcon name="interface-essential-cog-double" width={15} height={15} aria-hidden />
          <span>§ 05 · Process · 0{total} phases</span>
        </div>
        <h2 className="mb-20 font-khinterference text-[clamp(48px,8vw,140px)] uppercase leading-[0.9] tracking-[0.02em]">
          <span className="block text-primary">Hat</span>
          <span className="block text-lime">fázis.</span>
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((step, i) => (
            <article
              key={step.number}
              data-reveal
              style={{ transitionDelay: `${(i % 3) * 70}ms` }}
              className="group relative flex flex-col border border-white/12 bg-void/30 p-6 backdrop-blur-[2px] transition-all hover:border-lime/40 hover:bg-void/50 hover:shadow-[0_0_45px_-22px_rgba(194,254,12,0.8)] md:p-7"
            >
              {/* HUD corner ticks */}
              <span aria-hidden className="absolute right-0 top-0 h-3.5 w-3.5 border-r-2 border-t-2 border-lime/25" />
              <span aria-hidden className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b-2 border-l-2 border-lime/25" />

              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center border border-white/12 text-lime transition-colors group-hover:border-lime/50">
                  <PixelIcon name={PHASE_ICONS[i]} width={22} height={22} aria-hidden />
                </div>
                <span className="font-sequel text-6xl leading-none tracking-[-0.04em] text-lime/20 transition-colors group-hover:text-lime md:text-7xl">
                  {step.number}
                </span>
              </div>

              <div className="mb-3 mt-7 flex items-center gap-2 font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary">
                <span className="inline-block h-px w-6 bg-lime/50" />
                Phase {step.number}
              </div>

              <h3 className="mb-3 font-sequel text-2xl leading-tight tracking-[-0.02em] text-primary md:text-3xl">
                {step.title}
              </h3>
              <p className="max-w-[36ch] font-shorai text-base leading-relaxed text-secondary">
                {step.desc}
              </p>

              {/* progress strip — fills up to this phase */}
              <div className="mt-7 flex gap-1" aria-hidden>
                {Array.from({ length: total }).map((_, k) => (
                  <span key={k} className={`h-1 flex-1 ${k <= i ? "bg-lime" : "bg-white/10"}`} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
