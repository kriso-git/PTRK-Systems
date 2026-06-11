import { PROJECTS } from "@/data/projects";
import { Crosshair } from "@/components/Crosshair";

const ACCENT_TEXT: Record<string, string> = {
  lime: "text-lime",
  cyan: "text-cyan",
  magenta: "text-magenta",
  orange: "text-orange",
};

const ACCENT_BORDER: Record<string, string> = {
  lime: "border-lime",
  cyan: "border-cyan",
  magenta: "border-magenta",
  orange: "border-orange",
};

/**
 * Social-proof section — renders NOTHING until at least one project
 * carries a real `testimonial` in src/data/projects.ts. Never ship
 * fabricated quotes; add real ones as:
 *   testimonial: { quote: "…", name: "…", role: "…" }
 */
export function TransmissionLog() {
  const items = PROJECTS.filter((p) => p.testimonial);
  if (!items.length) return null;

  return (
    <section
      data-section="§ 04"
      data-label="Visszajelzés"
      className="relative z-10 border-t border-white/10 px-6 md:px-10 py-32 md:py-44"
    >
      <div className="max-w-[1500px]">
        <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-cyan mb-14 flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-cyan cursor-blink" />
          <span>▓ Incoming transmission</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {items.map((p) => (
            <blockquote
              key={p.id}
              className={`relative border-l-4 ${ACCENT_BORDER[p.color]} bg-surface/50 p-8 md:p-10`}
            >
              <Crosshair position="tr" color={p.color} />
              <div
                className={`font-monospec text-[10px] uppercase tracking-[0.3em] mb-6 ${ACCENT_TEXT[p.color]}`}
              >
                TX · {p.client}
              </div>
              <p className="font-shorai text-lg md:text-xl text-primary leading-[1.5]">
                „{p.testimonial!.quote}”
              </p>
              <footer className="mt-6 font-monospec text-[10px] uppercase tracking-[0.3em] text-secondary">
                {p.testimonial!.name} · {p.testimonial!.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
