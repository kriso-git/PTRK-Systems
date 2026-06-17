import { PixelIcon } from "@/components/PixelIcon";

/**
 * LiveCare (§03) — the Élő Gondozás offer: the two monthly tiers (Alap + Max),
 * what each includes, and an EXAMPLE preview of the Max-tier monthly Visibility
 * Report. No prices (those are set on the call). Honest "mérek, de nem ígérek".
 */

const ALAP = [
  { icon: "interface-essential-cog-double", t: "Karbantartás és figyelés", d: "domain, hosting, SSL, biztonsági frissítés, uptime, mentés" },
  { icon: "coding-apps-websites-shield-lock", t: "Modern, biztonságos, Google-safe", d: "mindig friss megoldások, hogy a versenytársaid felett maradj" },
  { icon: "interface-essential-cursor-click-point", t: "Havi 1 módosítás", d: "igény szerint, amikor kéred" },
  { icon: "interface-essential-satellite", t: "Közvetlen kapcsolat", d: "minket érsz el gyorsan, nem egy ügyfélszolgálatot" },
  { icon: "interface-essential-wifi-signal", t: "Forgalom-mérés a háttérben", d: "részletes havi jelentésért lásd a Max csomagot" },
];

const MAX_EXTRA = [
  { icon: "interface-essential-cursor-click-point", t: "Havi 2-3 módosítás + prioritás", d: "amikor sürgős, te vagy elöl a sorban" },
  { icon: "content-files-archive-books-1", t: "Havi Láthatósági Jelentés", d: "automatikus PDF a hó végén, igény szerint elküldve" },
];

const REPORT = [
  { icon: "interface-essential-wifi-signal", k: "Sebesség és egészség", v: "98 / 100", n: "PageSpeed · Core Web Vitals · uptime" },
  { icon: "map-navigation-pin-location-1", k: "Megtalálhatóság (SEO)", v: "+142", n: "megjelenés a Google keresőben" },
  { icon: "computers-devices-electronics-monitor", k: "Forgalom", v: "340", n: "látogató · források · top oldalak" },
  { icon: "social-rewards-flag", k: "Google jelenlét", v: "8 hívás", n: "megtekintés · hívás · útvonal-kérés" },
  { icon: "interface-essential-cog-double", k: "Amit ebben a hónapban csináltam", v: "", n: "menü frissítve, 2 új kép, sebesség-tuning" },
];

function CornerTicks({ accent }: { accent: string }) {
  return (
    <>
      <span aria-hidden className={`absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 ${accent} opacity-40`} style={{ borderColor: "currentColor" }} />
      <span aria-hidden className={`absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 ${accent} opacity-40`} style={{ borderColor: "currentColor" }} />
    </>
  );
}

export function LiveCare() {
  return (
    <section data-section="§ 03" data-label="Élő Gondozás" className="relative z-10 border-t border-white/10 px-6 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1500px]">
        {/* header */}
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="mb-5 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-lime">
              <PixelIcon name="interface-essential-cog-double" width={15} height={15} aria-hidden />
              <span>§ 03 · Élő Gondozás</span>
            </div>
            <h2 className="font-khinterference uppercase leading-[0.85] tracking-[-0.005em] text-primary text-[clamp(44px,8vw,128px)]">
              A havi
              <br />
              <span className="text-lime">gondozás.</span>
            </h2>
          </div>
          <p className="max-w-md font-shorai text-base leading-relaxed text-secondary md:text-lg">
            A weboldal elkészülte csak a kezdet. A valódi érték a folyamatos gondozás: havonta
            karbantartjuk, figyeljük és frissen tartjuk az oldalad, hogy mindig elöl légy.
            Becsületesen: <span className="text-primary">mérünk és megmutatunk, de nem ígérgetünk.</span>
          </p>
        </div>

        {/* two tiers */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Alap */}
          <article data-reveal className="group relative flex flex-col border border-white/12 bg-void/40 p-7 backdrop-blur-[2px] md:p-9">
            <CornerTicks accent="text-lime" />
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center border border-white/12 text-lime">
                  <PixelIcon name="interface-essential-cog-double" width={22} height={22} aria-hidden />
                </span>
                <div>
                  <div className="font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">Csomag I</div>
                  <h3 className="font-sequel text-2xl leading-none tracking-[-0.02em] text-primary md:text-3xl">Élő Gondozás</h3>
                </div>
              </div>
            </div>
            <ul className="flex flex-col gap-4">
              {ALAP.map((it) => (
                <li key={it.t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border border-lime/30 text-lime">
                    <PixelIcon name={it.icon} width={14} height={14} aria-hidden />
                  </span>
                  <div>
                    <div className="font-shorai text-base text-primary md:text-lg">{it.t}</div>
                    <div className="font-shorai text-sm text-secondary">{it.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* Max */}
          <article data-reveal style={{ transitionDelay: "90ms" }} className="group relative flex flex-col border border-cyan/40 bg-void/50 p-7 backdrop-blur-[2px] shadow-[0_0_60px_-30px_rgba(1,255,255,0.7)] md:p-9">
            <CornerTicks accent="text-cyan" />
            <span className="absolute right-5 top-5 font-monospec text-[9px] uppercase tracking-[0.3em] text-cyan">Ajánlott</span>
            <div className="mb-7 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center border border-cyan/40 text-cyan">
                <PixelIcon name="interface-essential-wifi-signal" width={22} height={22} aria-hidden />
              </span>
              <div>
                <div className="font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">Csomag II</div>
                <h3 className="font-sequel text-2xl leading-none tracking-[-0.02em] text-primary md:text-3xl">Élő Gondozás Max</h3>
              </div>
            </div>
            <div className="mb-5 flex items-center gap-2 font-monospec text-[10px] uppercase tracking-[0.3em] text-cyan">
              <span className="inline-block h-px w-6 bg-cyan" />
              Minden az Alapból, plusz
            </div>
            <ul className="flex flex-col gap-4">
              {MAX_EXTRA.map((it) => (
                <li key={it.t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border border-cyan/40 text-cyan">
                    <PixelIcon name={it.icon} width={14} height={14} aria-hidden />
                  </span>
                  <div>
                    <div className="font-shorai text-base text-primary md:text-lg">{it.t}</div>
                    <div className="font-shorai text-sm text-secondary">{it.d}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* report preview */}
            <div className="mt-8 border border-cyan/20 bg-black/40">
              <div className="flex items-center justify-between border-b border-cyan/15 px-4 py-2.5 font-monospec text-[10px] uppercase tracking-[0.25em]">
                <span className="flex items-center gap-2 text-cyan">
                  <span className="h-1.5 w-1.5 bg-cyan cursor-blink" />
                  Havi Láthatósági Jelentés
                </span>
                <span className="border border-cyan/40 px-1.5 py-0.5 text-[8px] text-cyan">PÉLDA</span>
              </div>
              <ul className="divide-y divide-white/8">
                {REPORT.map((r, i) => (
                  <li key={r.k} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="font-monospec text-[9px] text-secondary/50">{String(i + 1).padStart(2, "0")}</span>
                    <PixelIcon name={r.icon} width={14} height={14} className="shrink-0 text-cyan/80" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-monospec text-[11px] uppercase tracking-[0.1em] text-primary">{r.k}</div>
                      <div className="truncate font-shorai text-[11px] text-secondary">{r.n}</div>
                    </div>
                    {r.v && <span className="shrink-0 font-sequel text-xl leading-none tracking-[-0.02em] text-cyan">{r.v}</span>}
                  </li>
                ))}
              </ul>
              <div className="border-t border-cyan/15 px-4 py-2 font-monospec text-[9px] uppercase tracking-[0.2em] text-secondary/50">
                Mérünk, nem ígérgetünk · valós adatok a te oldaladról
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
