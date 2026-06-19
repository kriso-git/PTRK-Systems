import type { ReactNode } from "react";
import { PixelIcon } from "@/components/PixelIcon";

/**
 * LiveCare (§02) - the full offer in one section: a premium build, then the real
 * product, the monthly Élő Gondozás (two tiers, Alap + Max). The Max tier ships a
 * monthly Visibility Report; the preview below faithfully mirrors the real
 * ptrk-report-generator output (template.js + sample-client.json: a fictional
 * Minta Autószerviz, 2026. május) with its dummy data, marked PÉLDA. No prices.
 */

const STATS = [
  { n: "98", l: "Lighthouse pont", icon: "interface-essential-wifi-signal", tx: "text-cyan", bg: "bg-cyan" },
  { n: "0", l: "Rejtett tétel", icon: "business-product-price-tag", tx: "text-magenta", bg: "bg-magenta" },
  { n: "<24h", l: "Közvetlen válasz", icon: "interface-essential-clock", tx: "text-orange", bg: "bg-orange" },
  { n: "Egyedi", l: "A te igényedre", icon: "interface-essential-cog-double", tx: "text-lime", bg: "bg-lime" },
];

const ALAP = [
  { icon: "interface-essential-cog-double", t: "Karbantartás és figyelés", d: "domain, hosting, SSL, biztonsági frissítés, uptime, mentés" },
  { icon: "coding-apps-websites-shield-lock", t: "Modern, biztonságos, Google-safe", d: "mindig friss megoldások, hogy a versenytársaid felett maradj" },
  { icon: "interface-essential-cursor-click-point", t: "Havi 1 ingyenes módosítás", d: "igény szerint, amikor kéred" },
  { icon: "interface-essential-satellite", t: "Közvetlen kapcsolat", d: "minket érsz el gyorsan, nem egy ügyfélszolgálatot" },
  { icon: "interface-essential-wifi-signal", t: "Forgalom-mérés a háttérben", d: "részletes havi jelentésért lásd a Max csomagot" },
];

const MAX_EXTRA = [
  { icon: "interface-essential-cursor-click-point", t: "Havi 2-3 módosítás + prioritás", d: "amikor sürgős, te vagy elöl a sorban" },
  { icon: "content-files-archive-books-1", t: "Havi Láthatósági Jelentés", d: "automatikus PDF a hó végén, igény szerint elküldve" },
];

function CornerTicks({ accent }: { accent: string }) {
  return (
    <>
      <span aria-hidden className={`absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 ${accent} opacity-40`} style={{ borderColor: "currentColor" }} />
      <span aria-hidden className={`absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 ${accent} opacity-40`} style={{ borderColor: "currentColor" }} />
    </>
  );
}

/* Report preview - mirrors ptrk-report-generator (dummy data) */

function Chip({ kind, children }: { kind: "good" | "bad" | "flat"; children: ReactNode }) {
  const cls =
    kind === "good" ? "bg-lime/15 text-lime" : kind === "bad" ? "bg-[#ff5470]/15 text-[#ff5470]" : "bg-white/10 text-secondary";
  return <span className={`ml-1.5 inline-block rounded-full px-1.5 py-px align-middle font-monospec text-[9px] ${cls}`}>{children}</span>;
}

function Metric({ label, value, unit, chip }: { label: string; value: string; unit?: string; chip?: ReactNode }) {
  return (
    <div className="min-w-[118px] flex-1 border border-white/10 bg-black/35 px-3 py-2.5">
      <div className="font-monospec text-[8px] uppercase tracking-[0.1em] text-secondary">{label}</div>
      <div className="mt-1 font-sequel text-xl leading-none text-primary">
        {value}
        {unit && <span className="font-monospec text-[10px] font-normal text-secondary">{unit}</span>}
        {chip}
      </div>
    </div>
  );
}

function RCard({ tag, title, sub, children }: { tag: string; title: string; sub: string; children: ReactNode }) {
  return (
    <section className="border border-white/10 bg-void/70 p-4">
      <div className="mb-2.5">
        <span className="font-monospec text-[9px] tracking-[0.15em] text-lime">{tag}</span>
        <h4 className="font-sequel text-[15px] leading-tight tracking-[-0.01em] text-primary">{title}</h4>
        <p className="font-monospec text-[9px] text-secondary">{sub}</p>
      </div>
      {children}
    </section>
  );
}

function BaRow({ label, pct, val, color }: { label: string; pct: number; val: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 font-shorai text-[11px]">
      <span className="w-24 shrink-0 text-secondary">{label}</span>
      <span className="h-2 flex-1 overflow-hidden border border-white/10 bg-black/40">
        <span className="block h-full" style={{ width: `${Math.max(4, pct)}%`, background: color }} />
      </span>
      <span className="w-12 shrink-0 text-right font-medium text-primary">{val}</span>
    </div>
  );
}

function SrcRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-2.5 font-shorai text-[11px]">
      <span className="w-32 shrink-0 text-[#c4cfdb]">{label}</span>
      <span className="h-1.5 flex-1 overflow-hidden border border-white/10 bg-black/40">
        <span className="block h-full bg-cyan/70" style={{ width: `${Math.max(3, pct)}%` }} />
      </span>
      <span className="w-9 shrink-0 text-right font-medium text-primary">{pct}%</span>
    </div>
  );
}

function Tbl({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <table className="mt-3 w-full border-collapse font-monospec text-[10px]">
      <thead>
        <tr>
          <th className="border-b border-white/10 py-1.5 pr-2 text-left font-normal uppercase tracking-[0.05em] text-secondary">{head[0]}</th>
          <th className="border-b border-white/10 py-1.5 pl-2 text-right font-normal uppercase tracking-[0.05em] text-secondary">{head[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]}>
            <td className="border-b border-white/[0.06] py-1.5 pr-2 text-[#c4cfdb]">{r[0]}</td>
            <td className="border-b border-white/[0.06] py-1.5 pl-2 text-right text-[#c4cfdb]">{r[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReportPreview() {
  return (
    <div className="relative overflow-hidden border border-white/12 bg-[#06070b]">
      {/* faint lime grid, like the PDF page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 45px, rgba(194,254,12,.035) 45px 46px), repeating-linear-gradient(90deg, transparent 0 45px, rgba(194,254,12,.035) 45px 46px)",
        }}
      />
      <span aria-hidden className="absolute left-3.5 top-3 z-10 h-4 w-4 border-l-2 border-t-2 border-lime" />
      <span aria-hidden className="absolute right-3.5 top-3 z-10 h-4 w-4 border-r-2 border-t-2 border-cyan opacity-70" />

      {/* header */}
      <header className="relative border-b border-white/10 px-5 py-4 md:px-7">
        <span aria-hidden className="absolute bottom-[-1px] left-0 h-0.5 w-[38%] bg-lime" />
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center bg-lime font-sequel text-lg font-bold leading-none text-black"
            style={{ clipPath: "polygon(0 0, 74% 0, 100% 26%, 100% 100%, 0 100%)" }}
          >
            P
          </span>
          <span className="font-sequel text-lg tracking-[0.02em] text-primary">
            <span className="text-lime">PTRK</span>-SYSTEMS
          </span>
          <span className="ml-auto flex items-center gap-2.5 font-monospec text-[9px] uppercase tracking-[0.2em] text-secondary">
            <span className="hidden sm:inline">// Havi Láthatósági Jelentés</span>
            <span className="border border-cyan/40 px-1.5 py-0.5 text-[8px] text-cyan">PÉLDA</span>
          </span>
        </div>
        <div className="mt-3.5 font-sequel text-2xl tracking-[0.01em] text-primary md:text-[26px]">Havi Láthatósági Jelentés</div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 font-monospec text-[10px] text-secondary">
          <b className="font-medium text-cyan">Minta Autószerviz</b>
          <span className="text-white/15">/</span>
          <span>2026. május</span>
          <span className="text-white/15">/</span>
          <span>Élő Gondozás Max</span>
          <span className="text-white/15">/</span>
          <span>mintaauto.hu</span>
        </div>
      </header>

      {/* honesty banner */}
      <div className="relative mx-5 mt-4 border border-lime/25 border-l-[3px] bg-lime/[0.05] px-3.5 py-2.5 font-shorai text-[11px] leading-relaxed text-[#d7e6b0] md:mx-7">
        Mérek és megmutatom. <b className="font-semibold text-lime">Nem ígérek garantált számokat</b>: ezek a tényleges mért
        értékek az elmúlt hónapból. A munkám, hogy az oldal gyors, megtalálható és friss legyen.
      </div>

      {/* 5 sections */}
      <div className="relative grid grid-cols-1 gap-3 px-5 py-4 md:px-7 lg:grid-cols-2">
        {/* §01 Sebesség és egészség */}
        <RCard tag="§01" title="Sebesség és egészség" sub="Mennyire gyors és stabil az oldal">
          <div className="flex flex-wrap gap-2">
            <Metric label="PageSpeed (mobil)" value="94" unit="/100" chip={<Chip kind="good">▲ 5</Chip>} />
            <Metric label="PageSpeed (asztali)" value="100" unit="/100" chip={<Chip kind="good">▲ 2</Chip>} />
            <Metric label="Töltési idő (LCP)" value="1,3" unit=" mp" chip={<Chip kind="good">▼ 0,3</Chip>} />
            <Metric label="Rendelkezésre állás" value="100" unit="%" />
          </div>
          <p className="mt-2.5 font-shorai text-[11px] text-[#c4cfdb]">
            <b className="font-medium text-primary">Biztonság (SSL):</b> rendben (érvényes, automatikusan megújul)
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            <BaRow label="Régi oldal (mobil)" pct={41} val="41/100" color="#ff5470" />
            <BaRow label="Új oldal (mobil)" pct={94} val="94/100" color="#c2fe0c" />
          </div>
        </RCard>

        {/* §02 Megtalálhatóság (SEO) */}
        <RCard tag="§02" title="Megtalálhatóság (SEO)" sub="Hogyan jelensz meg a Google keresésében">
          <div className="flex flex-wrap gap-2">
            <Metric label="Megjelenés a találatokban" value="1 480" chip={<Chip kind="good">▲ 460</Chip>} />
            <Metric label="Kattintás a keresőből" value="102" chip={<Chip kind="good">▲ 31</Chip>} />
            <Metric label="Indexált oldalak" value="8" chip={<Chip kind="flat">=</Chip>} />
          </div>
          <p className="mt-2.5 font-shorai text-[11px] text-[#c4cfdb]">
            <b className="font-medium text-primary">NAP-konzisztencia:</b> rendben (Név/Cím/Telefon mindenhol egyezik)
          </p>
          <Tbl
            head={["Kulcsszó", "Átlagos pozíció"]}
            rows={[
              ["autószerviz Dabas", "3."],
              ["olajcsere Dabas", "5."],
              ["klímatöltés Dabas", "8."],
            ]}
          />
        </RCard>

        {/* §03 Forgalom */}
        <RCard tag="§03" title="Forgalom" sub="Kik és honnan jártak az oldalon">
          <div className="flex flex-wrap gap-2">
            <Metric label="Látogatók" value="486" chip={<Chip kind="good">▲ 128</Chip>} />
          </div>
          <div className="mt-3 flex flex-col gap-1.5">
            <SrcRow label="Google keresés" pct={64} />
            <SrcRow label="Közvetlen" pct={22} />
            <SrcRow label="Közösségi (Facebook)" pct={14} />
          </div>
          <Tbl
            head={["Legnézettebb oldalak", "Megtekintés"]}
            rows={[
              ["/", "298"],
              ["/szolgaltatasok", "112"],
              ["/idopontfoglalas", "64"],
            ]}
          />
        </RCard>

        {/* §04 Google jelenlét */}
        <RCard tag="§04" title="Google jelenlét" sub="A Google Cégprofil aktivitása">
          <div className="flex flex-wrap gap-2">
            <Metric label="Cégprofil megtekintés" value="812" chip={<Chip kind="good">▲ 209</Chip>} />
            <Metric label="Hívások a profilból" value="17" chip={<Chip kind="good">▲ 6</Chip>} />
            <Metric label="Útvonal-kérések" value="26" chip={<Chip kind="good">▲ 7</Chip>} />
            <Metric label="Weboldal-kattintások" value="44" chip={<Chip kind="good">▲ 14</Chip>} />
          </div>
        </RCard>

        {/* §05 Amit ebben a hónapban csináltam */}
        <RCard tag="§05" title="Amit ebben a hónapban csináltam" sub="A gondozás láthatóvá téve">
          <ul className="flex flex-col gap-2">
            {[
              "Új nyári klímatöltés akció blokk a főoldalon.",
              "Három friss Google-vélemény kiemelve a nyitóképernyőn.",
              "Időpontfoglaló űrlap gyorsított betöltése (mobilon is).",
              "Biztonsági frissítések + napi mentés (folyamatos).",
            ].map((w) => (
              <li key={w} className="flex items-start gap-2.5 font-shorai text-[12px] leading-snug text-[#c4cfdb]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-lime" />
                {w}
              </li>
            ))}
          </ul>
        </RCard>

        {/* note */}
        <div className="border border-white/10 bg-void/70 px-4 py-3 lg:col-span-2">
          <span className="font-monospec text-[9px] tracking-[0.1em] text-cyan">// MEGJEGYZÉS</span>{" "}
          <span className="font-shorai text-[11px] leading-relaxed text-[#c4cfdb]">
            Mobilon a legtöbb foglalás az „Időpontfoglalás” gombról jön: ha szeretnéd, jövő hónapban még jobban
            kiemelhetjük a hero-ban.
          </span>
        </div>
      </div>

      {/* footer */}
      <footer className="relative flex items-center justify-between border-t border-white/10 px-5 py-3 font-monospec text-[9px] uppercase tracking-[0.08em] text-secondary md:px-7">
        <span>
          <span className="text-lime">PTRK</span>-SYSTEMS // weboldal-stúdió
        </span>
        <span>A jelentés a Max csomag része</span>
      </footer>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

export function LiveCare() {
  return (
    <section data-section="§ 02" data-label="Élő Gondozás" className="relative z-10 border-t border-white/10 px-6 py-32 md:px-10 md:py-48">
      <div className="mx-auto max-w-[1500px]">
        {/* header - the full offer: premium build + the ongoing care */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="mb-5 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.35em] text-lime">
              <PixelIcon name="interface-essential-cog-double" width={15} height={15} aria-hidden />
              <span>§ 02 · Élő Gondozás</span>
            </div>
            <h2 className="font-khinterference uppercase leading-[0.85] tracking-[-0.005em] text-primary text-[clamp(44px,8vw,128px)]">
              A weboldal
              <br />
              <span className="text-lime">és a gondozás.</span>
            </h2>
            <p className="mt-5 max-w-sm font-shorai text-base text-primary/90 leading-relaxed">
              Élő Gondozás: havi karbantartás, mérés és módosítások. Nem hagyunk magadra.
            </p>
          </div>
          <p className="max-w-md font-shorai text-base leading-relaxed text-secondary md:text-lg">
            Egy prémium, modern weboldal, gyorsan és jó áron, a te igényedre szabva. De az
            elkészülte csak a kezdet: a valódi érték a havi Élő Gondozás, amitől az oldalad
            gyors, megtalálható és friss marad. <span className="text-primary">Mérünk és megmutatunk, de nem ígérgetünk.</span>
          </p>
        </div>

        {/* build quick-stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 border-y border-white/12 py-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="flex flex-col gap-2">
              <div className={`flex items-center gap-2 ${s.tx}`}>
                <PixelIcon name={s.icon} width={15} height={15} aria-hidden />
                <span className={`inline-block h-px w-5 ${s.bg} opacity-50`} />
              </div>
              <span className={`font-sequel text-3xl md:text-4xl leading-none tracking-[-0.04em] ${s.tx}`}>{s.n}</span>
              <span className="font-shorai text-sm tracking-tight text-secondary">{s.l}</span>
            </div>
          ))}
        </div>

        {/* two tiers */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Alap */}
          <article data-reveal className="group relative flex flex-col border border-white/12 bg-void/40 p-7 backdrop-blur-[2px] md:p-9">
            <CornerTicks accent="text-lime" />
            <div className="mb-7 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center border border-white/12 text-lime">
                <PixelIcon name="interface-essential-cog-double" width={22} height={22} aria-hidden />
              </span>
              <div>
                <div className="font-monospec text-[10px] uppercase tracking-[0.35em] text-secondary">Csomag I</div>
                <h3 className="font-sequel text-2xl leading-none tracking-[-0.02em] text-primary md:text-3xl">Élő Gondozás</h3>
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
          </article>
        </div>

        {/* full-width example report - the real generator output, dummy data */}
        <div className="mt-5">
          <div className="mb-3 flex items-center gap-3 font-monospec text-[10px] uppercase tracking-[0.3em] text-cyan">
            <span className="inline-block h-px w-8 bg-cyan/50" />
            Így néz ki a havi jelentés
          </div>
          <ReportPreview />
        </div>
      </div>
    </section>
  );
}
