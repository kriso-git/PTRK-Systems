import Image from "next/image";
import { OPERATOR } from "@/data/operator";
import { Crosshair } from "@/components/Crosshair";
import { GoliathOrnament } from "@/components/GoliathSymbols";

/**
 * THE OPERATOR – personal brand section. Hidden until real data exists
 * in src/data/operator.ts (name is the render gate). No fake placeholder
 * content ever ships.
 */
export function Operator() {
  if (!OPERATOR.name) return null;

  return (
    <section
      data-section="§ 05"
      data-label="Operátor"
      className="relative z-10 border-t border-white/10 px-6 md:px-10 py-32 md:py-48"
    >
      <div className="max-w-[1500px] grid grid-cols-12 gap-y-12 md:gap-x-10">
        <div className="col-span-12 md:col-span-4">
          <div className="relative border border-lime/25 bg-surface/40 aspect-[4/5] overflow-hidden">
            <Crosshair position="tl" color="lime" />
            <Crosshair position="br" color="cyan" />
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between border-b border-lime/20 bg-black/50 px-4 py-2.5 z-10">
              <span className="font-monospec text-[10px] text-lime tracking-[0.3em]">
                OPERATOR·ID
              </span>
              <span className="w-1.5 h-1.5 bg-lime cursor-blink" />
            </div>
            {OPERATOR.photo ? (
              <Image
                src={OPERATOR.photo}
                alt={OPERATOR.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-lime/20">
                <GoliathOrnament seed={OPERATOR.name} count={3} size="96px" />
              </div>
            )}
            {/* Scanline overlay */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0 3px, rgba(5,5,8,0.6) 3px 4px)",
              }}
            />
          </div>
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="font-monospec text-[10px] uppercase tracking-[0.4em] text-lime mb-6 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-lime" />
            <span>The Operator</span>
          </div>
          <h2 className="font-khinterference uppercase tracking-[0.01em] text-5xl md:text-7xl leading-[0.92] text-primary mb-3">
            {OPERATOR.name}
          </h2>
          {OPERATOR.role && (
            <div className="font-monospec text-[11px] uppercase tracking-[0.3em] text-secondary mb-10">
              {OPERATOR.role}
            </div>
          )}
          <div className="flex flex-col gap-6 max-w-[62ch]">
            {OPERATOR.bio.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="font-shorai text-lg md:text-xl text-secondary leading-[1.55]"
              >
                {para}
              </p>
            ))}
          </div>
          {OPERATOR.now && (
            <div className="mt-10 inline-flex items-center gap-3 border border-cyan/30 bg-cyan/[0.05] px-4 py-2.5 font-monospec text-[10px] uppercase tracking-[0.3em] text-cyan">
              <span className="w-1.5 h-1.5 bg-cyan cursor-blink" />
              NOW · {OPERATOR.now}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
