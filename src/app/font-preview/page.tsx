/**
 * Font alternatíva mockup – `/font-preview` route.
 *
 * Internal preview page: not linked from navigation, only reachable via URL.
 * Shows side-by-side how the 5 problematic fonts (Goliath, KH Interference,
 * MonoSpec, Sequel, Fraktion) compare to free Google Fonts alternatives at
 * the exact sizes / weights they're used at on the live site, so the user
 * can pick replacements based on real visual impression rather than names.
 *
 * The Goliath section additionally renders the full GoliathSymbols set –
 * the SVG-based decorative replacement that will take over for the Goliath
 * font watermarks on the live site.
 */

import { AcquireOnMount } from "@/components/AcquireOnMount";
import {
  GOLIATH_SYMBOL_NAMES,
  type GoliathTone,
} from "@/components/goliath-symbols-data";
import {
  GoliathOrnament,
  GoliathScatter,
  GoliathSymbol,
} from "@/components/GoliathSymbols";

type Risk = "marathon" | "commercial" | "ofl" | "deferred";

type Sample = {
  /** Display name of the font */
  name: string;
  /** Shown as a tiny chip under the name */
  source: string;
  /** Risk category */
  risk: Risk;
  /** font-family CSS value – uses the existing site var for "current", or a
   *  preview var loaded in this route's layout */
  fontFamily: string;
  /** Optional inline style overrides (weight, letter-spacing, etc) */
  style?: React.CSSProperties;
  /** Note shown in small print under the sample */
  note?: string;
  /** Marks this option as the chosen replacement – gets a lime border + chip */
  chosen?: boolean;
  /** Marks this card as a "future plan" placeholder, no actual font */
  placeholder?: boolean;
};

type Section = {
  /** Slot identifier (current font name in code) */
  slot: string;
  /** Where it's used on the live site, with usage count */
  usage: string;
  /** Big sample text – the kind the slot is actually used for in production */
  display: string;
  /** Smaller secondary sample (used for clarity, e.g. Hungarian pangram or sub-title) */
  secondary: string;
  /** Tertiary line – e.g. timestamps for mono fonts, very small text */
  tertiary?: string;
  /** Display size class for the primary sample */
  displaySizeClass: string;
  /** Letter-spacing for the primary */
  displayTracking?: string;
  /** Secondary size class */
  secondarySizeClass: string;
  /** Tertiary size class */
  tertiarySizeClass?: string;
  /** Font weight for the display */
  displayWeight: number;
  /** Default uppercase for primary? */
  uppercase?: boolean;
  /** 4 candidates: index 0 is the current font, 1-3 are alternatives */
  samples: Sample[];
};

const RISK_LABEL: Record<Risk, { label: string; bg: string; fg: string }> = {
  marathon: {
    label: "Marathon IP",
    bg: "rgba(234,2,126,0.15)",
    fg: "#ea027e",
  },
  commercial: {
    label: "Commercial",
    bg: "rgba(255,140,66,0.15)",
    fg: "#ff8c42",
  },
  ofl: {
    label: "Google · OFL",
    bg: "rgba(194,254,12,0.15)",
    fg: "#c2fe0c",
  },
  deferred: {
    label: "TBD",
    bg: "rgba(1,255,255,0.12)",
    fg: "#01ffff",
  },
};

const HU_PANGRAM = "árvíztűrő tükörfúrógép";

const GOLIATH_SHOWCASE_ORNAMENTS = [
  { seed: "·26·", count: 4, label: "Landing · ·26·", size: 56 },
  { seed: "HELLO", count: 5, label: "Connect · HELLO", size: 72 },
  { seed: "2026", count: 4, label: "Landing · 2026", size: 96 },
  { seed: "SYS·", count: 4, label: "Footer · SYS·", size: 72 },
  { seed: "METHOD", count: 6, label: "Method · METHOD", size: 56 },
];

const GOLIATH_SHOWCASE_TONES = [
  { tone: "lime" as const, label: "Lime", hex: "#c2fe0c" },
  { tone: "cyan" as const, label: "Cyan", hex: "#01ffff" },
  { tone: "magenta" as const, label: "Magenta", hex: "#ea027e" },
  { tone: "orange" as const, label: "Orange", hex: "#ff8c42" },
];

const SECTIONS: Section[] = [
  {
    slot: "GOLIATH",
    usage:
      "5× – dekoratív watermark · TBD: nem font, generált szimbólumokra cserélve",
    display: "·26·",
    secondary: "DESIGN ENGINEERING UNIT",
    tertiary: HU_PANGRAM,
    displaySizeClass: "text-[88px] leading-none",
    secondarySizeClass: "text-[28px] leading-tight",
    tertiarySizeClass: "text-base leading-snug",
    displayWeight: 900,
    uppercase: true,
    samples: [
      {
        name: "Goliath",
        source: "Bungie / Marathon (fan-extracted) · archived",
        risk: "marathon",
        fontFamily: "var(--font-pv-archive-goliath)",
      },
      {
        name: "Generált szimbólumok (TBD)",
        source: "Egyedi SVG / glyph-set, NEM font",
        risk: "deferred",
        fontFamily: "var(--font-pv-geist-mono)",
        style: { fontWeight: 400 },
        note: "Ezt a slot-ot nem fontra cseréljük. Mivel a Goliath itt ténylegesen csak ornamentum (nem szöveg), később egyedi generált glyph-szerű szimbólumokat (SVG vagy Unicode-mintázat) teszünk a helyébe. A choice itt: nincs font.",
        placeholder: true,
      },
    ],
  },
  {
    slot: "KH INTERFERENCE",
    usage:
      "44× – fő heading font, page címek, navigáció · ✓ DÖNTÉS: Chakra Petch (SemiBold 600)",
    display: "§ 04 · WORK ARCHIVE",
    secondary: "Operátor egysége – Budapesten",
    tertiary: HU_PANGRAM,
    displaySizeClass: "text-[44px] leading-none",
    displayTracking: "tracking-[0.04em]",
    secondarySizeClass: "text-[20px] leading-snug",
    tertiarySizeClass: "text-base leading-snug",
    displayWeight: 400,
    uppercase: true,
    samples: [
      {
        name: "KH Interference",
        source: "Marathon community (fan-extracted) · archived",
        risk: "marathon",
        fontFamily: "var(--font-pv-archive-khinterference)",
      },
      {
        name: "Chakra Petch (SemiBold 600)",
        source: "Google Fonts · OFL · 300 · 400 · 500 · 600 · 700 + italics",
        risk: "ofl",
        fontFamily: "var(--font-pv-chakra-petch)",
        style: { fontWeight: 600 },
        chosen: true,
        note: "Szögletes-techno display sans, cyberpunk/Marathon karakter. SemiBold súly – köztes a Regular és Bold között, ideális display-balansz a heading-ekhez. Teljes skála: 300/400/500/600/700 + italicok az élő site-on használható lesz.",
      },
      {
        name: "Major Mono Display",
        source: "Google Fonts · OFL · 1 weight",
        risk: "ofl",
        fontFamily: "var(--font-pv-major-mono)",
        style: { fontWeight: 400 },
        note: "Angular geometric monospace display, élesen rajzolt karakterek – display heading-nek illik a Marathon-érzéshez.",
      },
      {
        name: "Share Tech Mono",
        source: "Google Fonts · OFL · 1 weight",
        risk: "ofl",
        fontFamily: "var(--font-pv-share-tech-mono)",
        style: { fontWeight: 400 },
        note: "Klasszikus terminal monospace, kicsit kompaktabb mint a Geist Mono.",
      },
      {
        name: "Black Ops One",
        source: "Google Fonts · OFL · 1 weight",
        risk: "ofl",
        fontFamily: "var(--font-pv-black-ops)",
        style: { fontWeight: 400 },
        note: "Military stencil display, vágott élek – agresszívebb, sci-fi/military hangulat.",
      },
      {
        name: "Orbitron",
        source: "Google Fonts · OFL · 400-900",
        risk: "ofl",
        fontFamily: "var(--font-pv-orbitron)",
        style: { fontWeight: 500 },
        note: "Szögletes, futurisztikus, sci-fi heading-feel.",
      },
      {
        name: "Audiowide",
        source: "Google Fonts · OFL · 1 weight",
        risk: "ofl",
        fontFamily: "var(--font-pv-audiowide)",
        style: { fontWeight: 400 },
        note: "Kerekített-szögletes hibrid, retro sci-fi UI.",
      },
      {
        name: "Geist Mono",
        source: "Google Fonts (Vercel) · variable",
        risk: "ofl",
        fontFamily: "var(--font-pv-geist-mono)",
        style: { fontWeight: 400 },
        note: "Modern terminal mono, Vercel saját font-ja.",
      },
      {
        name: "JetBrains Mono",
        source: "Google Fonts · OFL · 100-800",
        risk: "ofl",
        fontFamily: "var(--font-pv-jetbrains)",
        style: { fontWeight: 400 },
        note: "Kódolóknak tervezve, jó hinting, kicsit szélesebb karakterek.",
      },
    ],
  },
  {
    slot: "MONOSPEC",
    usage:
      "150× – terminal UI labels, timestamps · ✓ DÖNTÉS: Geist Mono",
    display: "12:05:14 [OK] BUILD COMPLETE · 1.04s",
    secondary: "$ pnpm dev --turbopack",
    tertiary: `// ${HU_PANGRAM}`,
    displaySizeClass: "text-[14px] leading-snug",
    displayTracking: "tracking-[0.04em]",
    secondarySizeClass: "text-[12px] leading-snug",
    tertiarySizeClass: "text-[11px] leading-snug",
    displayWeight: 400,
    samples: [
      {
        name: "MonoSpec",
        source: "Studio Triple · ~€90 commercial · archived",
        risk: "commercial",
        fontFamily: "var(--font-pv-archive-monospec)",
      },
      {
        name: "Geist Mono",
        source: "Google Fonts (Vercel) · variable",
        risk: "ofl",
        fontFamily: "var(--font-pv-geist-mono)",
        style: { fontWeight: 400 },
        chosen: true,
        note: "Modern terminal mono. Cseréje 1:1 a MonoSpec helyén – koherens „minden terminal mono ugyanaz” élmény az egész oldalon.",
      },
      {
        name: "IBM Plex Mono",
        source: "Google Fonts (IBM) · 100-700",
        risk: "ofl",
        fontFamily: "var(--font-pv-plex-mono)",
        style: { fontWeight: 400 },
        note: "Backup option – humanistább, ha a Geist túl száraznak hatna.",
      },
      {
        name: "JetBrains Mono",
        source: "Google Fonts · 100-800",
        risk: "ofl",
        fontFamily: "var(--font-pv-jetbrains)",
        style: { fontWeight: 400 },
        note: "Backup – agresszívebb terminál-feel, jobb hinting.",
      },
    ],
  },
  {
    slot: "SEQUEL 100 WIDE",
    usage:
      "25× – projekt címek, statisztika accent · ✓ DÖNTÉS: Roboto Flex (wide+heavy)",
    display: "PROJECT 042",
    secondary: "Méretezett szélességgel",
    tertiary: HU_PANGRAM,
    displaySizeClass: "text-[40px] leading-none",
    displayTracking: "tracking-[0.02em]",
    secondarySizeClass: "text-[18px] leading-snug",
    tertiarySizeClass: "text-base leading-snug",
    displayWeight: 700,
    uppercase: true,
    samples: [
      {
        name: "Sequel 100 Wide",
        source: "Fontfabric · $50-250 commercial · archived",
        risk: "commercial",
        fontFamily: "var(--font-pv-archive-sequel)",
      },
      {
        name: "Roboto Flex (wide+heavy)",
        source: "Google Fonts · OFL · variable wdth 25-151 + wght 100-1000",
        risk: "ofl",
        fontFamily: "var(--font-pv-roboto-flex)",
        style: {
          fontWeight: 900,
          fontStretch: "151%",
        },
        chosen: true,
        note: "Variable font két tengellyel (width + weight), 151%-ig ultra-wide. Modern Roboto-bázis, jó hinting, kifogástalan latin-ext support. Sequel 1:1 cseréje a fő site-on.",
      },
      {
        name: "Anybody (wdth 150 · 900)",
        source: "Google Fonts · OFL · variable wdth 75-150 + wght 100-900",
        risk: "ofl",
        fontFamily: "var(--font-pv-anybody)",
        style: {
          fontWeight: 900,
          fontStretch: "150%",
        },
        note: "Backup – élesebb geometriai konstrukció, sport-/magazin-impact.",
      },
      {
        name: "Saira Stencil One",
        source: "Google Fonts · OFL · 1 weight",
        risk: "ofl",
        fontFamily: "var(--font-pv-saira-stencil)",
        style: { fontWeight: 400 },
        note: "Backup – Wide stencil, vágott éles karakterek, military/sport hangulattal.",
      },
      {
        name: "Goldman 700",
        source: "Google Fonts · OFL · 400 + 700",
        risk: "ofl",
        fontFamily: "var(--font-pv-goldman)",
        style: { fontWeight: 700 },
        note: "Backup – Wide blokk-display, sharp edges, „sport cap” feel.",
      },
      {
        name: "Saira Black",
        source: "Google Fonts · OFL · variable wdth + wght",
        risk: "ofl",
        fontFamily: "var(--font-pv-saira)",
        style: { fontWeight: 900 },
        note: "Modern variable, igazi szélesség- és súly-axis. Élesebb karakterek mint a Roboto.",
      },
      {
        name: "Archivo Wide (wdth 125)",
        source: "Google Fonts · OFL · variable wdth",
        risk: "ofl",
        fontFamily: "var(--font-pv-archivo)",
        style: {
          fontWeight: 700,
          fontStretch: "125%",
        },
        note: "Igazi width-axis, Condensed→Wide állítható, semleges karakter.",
      },
    ],
  },
  {
    slot: "PP FRAKTION MONO",
    usage: "1× – projektkártya watermark · ✓ DÖNTÉS: DM Mono",
    display: "[42·META]",
    secondary: "PROJECT METADATA",
    tertiary: HU_PANGRAM,
    displaySizeClass: "text-[18px] leading-snug",
    displayTracking: "tracking-[0.04em]",
    secondarySizeClass: "text-[12px] leading-snug",
    tertiarySizeClass: "text-[11px] leading-snug",
    displayWeight: 400,
    uppercase: true,
    samples: [
      {
        name: "PP Fraktion Mono",
        source: "Pangram Pangram · ~$200/site commercial · archived",
        risk: "commercial",
        fontFamily: "var(--font-pv-archive-fraktion)",
      },
      {
        name: "DM Mono",
        source: "Google Fonts · OFL · 300-500",
        risk: "ofl",
        fontFamily: "var(--font-pv-dm-mono)",
        style: { fontWeight: 400 },
        chosen: true,
        note: "Nyugodt, kicsit szélesebb karakterek, jól olvasható minden méretben – tökéletes ehhez az 1× watermark szerephez.",
      },
      {
        name: "Space Mono",
        source: "Google Fonts · 400, 700",
        risk: "ofl",
        fontFamily: "var(--font-pv-space-mono)",
        style: { fontWeight: 400 },
        note: "Backup – Pangram-szerű karaktertörés, retro-tech.",
      },
    ],
  },
];

function RiskChip({ risk }: { risk: Risk }) {
  const r = RISK_LABEL[risk];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]"
      style={{ background: r.bg, color: r.fg }}
    >
      {r.label}
    </span>
  );
}

function SampleCard({
  sample,
  section,
  isCurrent,
}: {
  sample: Sample;
  section: Section;
  isCurrent: boolean;
}) {
  const fontStyle: React.CSSProperties = {
    fontFamily: sample.fontFamily,
    ...sample.style,
  };

  const borderClass = sample.chosen
    ? "border-lime border-2 shadow-[0_0_24px_rgba(194,254,12,0.18)]"
    : sample.placeholder
    ? "border-cyan/40 border-dashed"
    : isCurrent
    ? "border-magenta/40"
    : "border-lime/20";

  return (
    <div className={`relative flex flex-col gap-4 border bg-surface/40 p-5 ${borderClass}`}>
      {sample.chosen && (
        <span
          className="absolute -top-2.5 right-4 inline-flex items-center gap-1 px-2 py-0.5 bg-lime text-void text-[10px] uppercase tracking-[0.2em] font-medium"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          ✓ Chosen
        </span>
      )}
      {sample.placeholder && (
        <span
          className="absolute -top-2.5 right-4 inline-flex items-center gap-1 px-2 py-0.5 bg-cyan text-void text-[10px] uppercase tracking-[0.2em] font-medium"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          → Generált szimbólumok
        </span>
      )}

      {/* Header: name + risk chip */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className="text-[15px] font-medium tracking-wide"
            style={{ fontFamily: "var(--font-pv-geist-mono)" }}
          >
            {isCurrent && (
              <span className="text-magenta mr-2 text-[11px]">CURRENT →</span>
            )}
            {sample.name}
          </h3>
          <RiskChip risk={sample.risk} />
        </div>
        <p
          className="text-[10px] uppercase tracking-[0.18em] text-secondary/60"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          {sample.source}
        </p>
      </div>

      {/* Display sample (the real-life headline use case). Placeholder
          cards skip rendering the sample and show an explanatory block. */}
      {sample.placeholder ? (
        <div className="border-t border-cyan/20 pt-4 flex-1 flex items-center justify-center text-center">
          <div className="space-y-3 max-w-[34ch]">
            <div className="text-[36px] leading-none text-cyan">◇ ◆ ◈</div>
            <p
              className="text-[11px] uppercase tracking-[0.25em] text-cyan/70"
              style={{ fontFamily: "var(--font-pv-geist-mono)" }}
            >
              No font · custom glyph-set
            </p>
          </div>
        </div>
      ) : (
        <div className="border-t border-lime/10 pt-4">
          <div
            className={`${section.displaySizeClass} ${
              section.displayTracking ?? ""
            } ${section.uppercase ? "uppercase" : ""} text-primary`}
            style={{
              ...fontStyle,
              fontWeight:
                sample.style?.fontWeight ?? section.displayWeight,
            }}
          >
            {section.display}
          </div>
        </div>
      )}

      {/* Secondary + tertiary samples – skipped on placeholder cards
          since there's no font to demonstrate. */}
      {!sample.placeholder && (
        <>
          <div
            className={`${section.secondarySizeClass} text-secondary`}
            style={{ ...fontStyle, fontWeight: 400 }}
          >
            {section.secondary}
          </div>
          {section.tertiary && (
            <div
              className={`${
                section.tertiarySizeClass ?? "text-sm"
              } text-secondary/70 italic`}
              style={{ ...fontStyle, fontWeight: 400 }}
            >
              {section.tertiary}
            </div>
          )}
        </>
      )}

      {/* Note */}
      {sample.note && (
        <p
          className="text-[11px] leading-relaxed text-secondary/70 mt-auto pt-3 border-t border-lime/10"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          {sample.note}
        </p>
      )}
    </div>
  );
}

/**
 * Bemutatja a `<GoliathSymbols />` SVG szimbólum-szettet:
 *  - 5 ornament-kompozíciót a jelenlegi watermark-szövegekhez
 *  - a 4 Marathon-szín variánsait (lime/cyan/magenta/orange)
 *  - a multitone üzemmódot (vegyes-szín ornament)
 *  - egy „background-scatter" példát a `<GoliathScatter />`-rel
 *  - a teljes ${GOLIATH_SYMBOL_NAMES.length}-elemű szimbólum-katalógust
 */
function GoliathShowcase() {

  return (
    <div className="mt-10 border border-cyan/30 bg-surface/30 p-6 md:p-8 space-y-12">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3">
        <h3
          className="text-[20px] md:text-[24px] uppercase tracking-tight"
          style={{ fontFamily: "var(--font-pv-archivo-black)" }}
        >
          GOLIATH REPLACEMENT – SVG Symbol Set
        </h3>
        <p
          className="text-[10px] uppercase tracking-[0.25em] text-cyan/80"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          {GOLIATH_SYMBOL_NAMES.length} szimbólum · 4 szín · NEM font
        </p>
      </div>

      <p
        className="text-sm md:text-base text-secondary leading-relaxed max-w-[72ch]"
        style={{ fontFamily: "var(--font-pv-bricolage)" }}
      >
        SVG szimbólum-könyvtár, kifejezetten a Goliath font 5 watermark
        helyének helyettesítésére az élő site-on. Három drop-in API:{" "}
        <code
          className="text-cyan"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          GoliathSymbol
        </code>{" "}
        egy glyph-hez,{" "}
        <code
          className="text-cyan"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          GoliathOrnament
        </code>{" "}
        seed-alapú sorozathoz, és{" "}
        <code
          className="text-cyan"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          GoliathScatter
        </code>{" "}
        teljes background-decoráció mintára. Mind a 4 Marathon-tónus
        elérhető, vagy `currentColor` (Tailwind text-X-en keresztül).
      </p>

      {/* Tone variants */}
      <div>
        <div
          className="text-[10px] uppercase tracking-[0.3em] text-secondary/70 mb-4"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          § Marathon palette tónusok
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {GOLIATH_SHOWCASE_TONES.map((t) => (
            <div
              key={t.tone}
              className="border border-white/10 bg-void/40 p-5 flex flex-col gap-3"
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="text-[11px] uppercase tracking-[0.3em]"
                  style={{
                    fontFamily: "var(--font-pv-geist-mono)",
                    color: t.hex,
                  }}
                >
                  {t.label}
                </span>
                <span
                  className="text-[9px] uppercase tracking-[0.2em] text-secondary/50"
                  style={{ fontFamily: "var(--font-pv-geist-mono)" }}
                >
                  {t.hex}
                </span>
              </div>
              <div className="min-h-[64px] flex items-center">
                <GoliathOrnament seed="palette" count={4} size={48} tone={t.tone} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multitone variant */}
      <div>
        <div
          className="text-[10px] uppercase tracking-[0.3em] text-secondary/70 mb-4"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          § Multitone – vegyes-szín ornament (HUD-feel)
        </div>
        <div className="border border-white/10 bg-void/40 p-6 flex items-center justify-center">
          <GoliathOrnament seed="ptrk-multi" count={6} size={64} multitone />
        </div>
      </div>

      {/* Ornament compositions – live-site watermark replacements */}
      <div>
        <div
          className="text-[10px] uppercase tracking-[0.3em] text-secondary/70 mb-4"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          § Ornament kompozíciók – élő site-on használandó cserék
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOLIATH_SHOWCASE_ORNAMENTS.map((o, i) => {
            const tone = GOLIATH_SHOWCASE_TONES[i % GOLIATH_SHOWCASE_TONES.length].tone;
            return (
              <div
                key={o.seed}
                className="border border-cyan/20 bg-void/40 p-5 flex flex-col gap-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] text-cyan/80"
                    style={{ fontFamily: "var(--font-pv-geist-mono)" }}
                  >
                    {o.label}
                  </span>
                  <span
                    className="text-[9px] uppercase tracking-[0.2em] text-secondary/50"
                    style={{ fontFamily: "var(--font-pv-geist-mono)" }}
                  >
                    seed=&quot;{o.seed}&quot; · n={o.count} · {tone}
                  </span>
                </div>
                <div className="min-h-[80px] flex items-center">
                  <GoliathOrnament
                    seed={o.seed}
                    count={o.count}
                    size={o.size}
                    tone={tone}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Background-scatter – section-decoration mockup */}
      <div>
        <div
          className="text-[10px] uppercase tracking-[0.3em] text-secondary/70 mb-4"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          § GoliathScatter – full-section background decoration
        </div>
        <div className="relative border border-white/10 bg-void/60 px-6 py-12 md:py-16 overflow-hidden min-h-[260px] flex items-center justify-center">
          <GoliathScatter seed="connect-mock" />
          <div
            className="relative z-10 text-center max-w-md text-secondary text-sm md:text-base leading-relaxed"
            style={{ fontFamily: "var(--font-pv-bricolage)" }}
          >
            <span
              className="block text-[10px] uppercase tracking-[0.3em] text-lime mb-3"
              style={{ fontFamily: "var(--font-pv-geist-mono)" }}
            >
              § DEMO · CONNECT SECTION
            </span>
            Tartalom-szöveg ide kerül. A háttérbe szétszórt szimbólumok 4
            sarokra + középre kerülnek, mind a 4 Marathon-szín képviselve,
            3-5% opacityvel – pont mint a Goliath-watermarkok eddig.
          </div>
        </div>
      </div>

      {/* Full catalogue */}
      <div>
        <div
          className="text-[10px] uppercase tracking-[0.3em] text-secondary/70 mb-4"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          § Teljes szimbólum-katalógus ({GOLIATH_SYMBOL_NAMES.length})
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {GOLIATH_SYMBOL_NAMES.map((name, i) => {
            const tone = GOLIATH_SHOWCASE_TONES[i % GOLIATH_SHOWCASE_TONES.length].tone;
            return (
              <div
                key={name}
                className="border border-white/10 bg-void/30 p-4 flex flex-col items-center gap-2"
              >
                <GoliathSymbol name={name} size={48} tone={tone} />
                <span
                  className="text-[9px] uppercase tracking-[0.2em] text-secondary/70"
                  style={{ fontFamily: "var(--font-pv-geist-mono)" }}
                >
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function FontPreviewPage() {
  return (
    <main className="max-w-[1700px] mx-auto px-6 md:px-10 py-12 md:py-20">
      <AcquireOnMount id="font-preview" />
      {/* Header */}
      <header className="mb-16 md:mb-24 max-w-3xl">
        <div
          className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.4em] mb-4"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          <span
            className="inline-flex items-center gap-2 px-2 py-0.5 bg-magenta text-void"
          >
            <span className="w-1.5 h-1.5 bg-void" />
            ARCHIVED
          </span>
          <span className="text-lime">§ INTERNAL · NOT INDEXED</span>
        </div>
        <h1
          className="text-[44px] md:text-[64px] leading-[0.95] mb-6 uppercase"
          style={{
            fontFamily: "var(--font-pv-archivo-black)",
            letterSpacing: "-0.02em",
          }}
        >
          Font Preview · Archive
        </h1>
        <p
          className="text-base md:text-lg text-secondary leading-relaxed"
          style={{ fontFamily: "var(--font-pv-bricolage)" }}
        >
          <strong className="text-magenta">Archív snapshot.</strong> A
          döntések megtörténtek, a fő site már a választott Google Fonts +
          SVG szimbólum-szettre épül. Ez az oldal megőrzi a teljes
          összehasonlítási folyamatot későbbi referenciaként – a „Current"
          oszlopok a régi (jogilag problémás) fontokat csak itt töltik
          be, kizárólag a /font-preview route-on. A fő site fontstack-je
          tisztán OFL.
        </p>
        <div
          className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          <RiskChip risk="marathon" />
          <RiskChip risk="commercial" />
          <RiskChip risk="ofl" />
          <RiskChip risk="deferred" />
        </div>
      </header>

      {/* Comparison sections */}
      <div className="space-y-20 md:space-y-28">
        {SECTIONS.map((section) => (
          <section key={section.slot}>
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 border-b border-lime/30 pb-4">
              <h2
                className="text-[28px] md:text-[36px] uppercase leading-none"
                style={{
                  fontFamily: "var(--font-pv-archivo-black)",
                  letterSpacing: "-0.01em",
                }}
              >
                {section.slot}
              </h2>
              <p
                className="text-[11px] uppercase tracking-[0.2em] text-secondary/70"
                style={{ fontFamily: "var(--font-pv-geist-mono)" }}
              >
                {section.usage}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
              {section.samples.map((sample, i) => (
                <SampleCard
                  key={`${section.slot}-${i}`}
                  sample={sample}
                  section={section}
                  isCurrent={i === 0}
                />
              ))}
            </div>

            {/* Goliath replacement showcase – rendered immediately under
                the Goliath comparison so the user can see what the
                custom SVG symbol set looks like at the same scales the
                font watermarks used on the live site. */}
            {section.slot === "GOLIATH" && <GoliathShowcase />}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-24 md:mt-32 pt-10 border-t border-lime/30">
        <p
          className="text-sm text-secondary leading-relaxed mb-4"
          style={{ fontFamily: "var(--font-pv-bricolage)" }}
        >
          Mind a 11 javasolt alternatíva ingyenesen használható kereskedelmi
          projektben (OFL · SIL Open Font License). Magyar ékezet-támogatás:{" "}
          <code style={{ fontFamily: "var(--font-pv-geist-mono)" }}>
            subsets: [&quot;latin&quot;, &quot;latin-ext&quot;]
          </code>
          . Elérhetőség:{" "}
          <a
            href="https://fonts.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lime underline underline-offset-4"
          >
            fonts.google.com
          </a>
          .
        </p>
        <p
          className="text-[11px] uppercase tracking-[0.2em] text-secondary/50"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          Mockup only – nem lesz indexálva, nem szerepel a navigációban.
        </p>
      </footer>
    </main>
  );
}
