/**
 * Font alternatíva mockup — `/font-preview` route.
 *
 * Internal preview page: not linked from navigation, only reachable via URL.
 * Shows side-by-side how the 5 problematic fonts (Goliath, KH Interference,
 * MonoSpec, Sequel, Fraktion) compare to free Google Fonts alternatives at
 * the exact sizes / weights they're used at on the live site, so the user
 * can pick replacements based on real visual impression rather than names.
 */

type Risk = "marathon" | "commercial" | "ofl";

type Sample = {
  /** Display name of the font */
  name: string;
  /** Shown as a tiny chip under the name */
  source: string;
  /** Risk category */
  risk: Risk;
  /** font-family CSS value — uses the existing site var for "current", or a
   *  preview var loaded in this route's layout */
  fontFamily: string;
  /** Optional inline style overrides (weight, letter-spacing, etc) */
  style?: React.CSSProperties;
  /** Note shown in small print under the sample */
  note?: string;
};

type Section = {
  /** Slot identifier (current font name in code) */
  slot: string;
  /** Where it's used on the live site, with usage count */
  usage: string;
  /** Big sample text — the kind the slot is actually used for in production */
  display: string;
  /** Smaller secondary sample (used for clarity, e.g. Hungarian pangram or sub-title) */
  secondary: string;
  /** Tertiary line — e.g. timestamps for mono fonts, very small text */
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
};

const HU_PANGRAM = "árvíztűrő tükörfúrógép";

const SECTIONS: Section[] = [
  {
    slot: "GOLIATH",
    usage:
      "5× — dekoratív watermark (csak szimbolikus glyph, alacsony opacity 4-6%)",
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
        source: "Bungie / Marathon (fan-extracted)",
        risk: "marathon",
        fontFamily: "var(--font-goliath)",
      },
      {
        name: "Bungee",
        source: "Google Fonts · OFL · David Jonathan Ross",
        risk: "ofl",
        fontFamily: "var(--font-pv-bungee)",
        style: { fontWeight: 400 },
        note: "Urban-blokk display, geometrikus, szimbolikus karakter — Marathon-szerű impact watermarknak.",
      },
      {
        name: "Honk",
        source: "Google Fonts · OFL · variable color font",
        risk: "ofl",
        fontFamily: "var(--font-pv-honk)",
        style: { fontWeight: 400 },
        note: "Chunky, eltúlzott dekoratív — szimbolikus mint a Goliath, abszolút „nem szöveg”.",
      },
      {
        name: "Sixtyfour",
        source: "Google Fonts · OFL · pixel/retro display",
        risk: "ofl",
        fontFamily: "var(--font-pv-sixtyfour)",
        style: { fontWeight: 400 },
        note: "Retro pixel-glyph esztétika, 64-bit-feel — szándékosan szimbolikus.",
      },
      {
        name: "Bowlby One",
        source: "Google Fonts · OFL · 1 weight",
        risk: "ofl",
        fontFamily: "var(--font-pv-bowlby)",
        style: { fontWeight: 400 },
        note: "Ultra-tömbös fekete display, sci-fi plakát impact.",
      },
    ],
  },
  {
    slot: "KH INTERFERENCE",
    usage:
      "44× — fő heading font, page címek, navigáció (CORE VISUAL IDENTITY)",
    display: "§ 04 · WORK ARCHIVE",
    secondary: "Operátor egysége — Budapesten",
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
        source: "Marathon community (fan-extracted)",
        risk: "marathon",
        fontFamily: "var(--font-khinterference)",
      },
      {
        name: "Orbitron",
        source: "Google Fonts · OFL · 400-900",
        risk: "ofl",
        fontFamily: "var(--font-pv-orbitron)",
        style: { fontWeight: 500 },
        note: "Szögletes, futurisztikus, sci-fi heading-feel — Marathon-szerű terminal display karakter.",
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
    usage: "150× — terminal UI labels, timestamps (LEGDOMINÁNSABB FONT)",
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
        source: "Studio Triple · ~€90 commercial",
        risk: "commercial",
        fontFamily: "var(--font-monospec)",
      },
      {
        name: "IBM Plex Mono",
        source: "Google Fonts (IBM) · 100-700",
        risk: "ofl",
        fontFamily: "var(--font-pv-plex-mono)",
        style: { fontWeight: 400 },
        note: "Profi humanista terminal mono. Legjobb match.",
      },
      {
        name: "JetBrains Mono",
        source: "Google Fonts · 100-800",
        risk: "ofl",
        fontFamily: "var(--font-pv-jetbrains)",
        style: { fontWeight: 400 },
        note: "Agresszívebb terminál-feel, jobb hinting.",
      },
      {
        name: "Geist Mono",
        source: "Google Fonts (Vercel) · variable",
        risk: "ofl",
        fontFamily: "var(--font-pv-geist-mono)",
        style: { fontWeight: 400 },
        note: "Ha a heading-eknél is Geist → 1 fonttal kevesebb a bundle-ben.",
      },
    ],
  },
  {
    slot: "SEQUEL 100 WIDE",
    usage: "25× — projekt címek, statisztika accent",
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
        source: "Fontfabric · $50-250 commercial",
        risk: "commercial",
        fontFamily: "var(--font-sequel)",
      },
      {
        name: "Saira Black",
        source: "Google Fonts · OFL · variable wdth + wght",
        risk: "ofl",
        fontFamily: "var(--font-pv-saira)",
        style: { fontWeight: 900 },
        note: "Modern variable, igazi szélesség- és súly-axis. Sequel-szerű impact, élesebb karakterek.",
      },
      {
        name: "Big Shoulders Display 800",
        source: "Google Fonts · OFL · variable",
        risk: "ofl",
        fontFamily: "var(--font-pv-big-shoulders)",
        style: { fontWeight: 800 },
        note: "Kondenzált-bold modern display, magazin/sport-cím feel.",
      },
      {
        name: "Bricolage Grotesque 700",
        source: "Google Fonts · OFL · variable",
        risk: "ofl",
        fontFamily: "var(--font-pv-bricolage)",
        style: { fontWeight: 700 },
        note: "Ha goliath-hoz is Bricolage → 1 font 2 helyen.",
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
        note: "Igazi width-axis, Condensed→Wide állítható.",
      },
    ],
  },
  {
    slot: "PP FRAKTION MONO",
    usage: "1× — projektkártya watermark (10px, 30% opacity)",
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
        source: "Pangram Pangram · ~$200/site commercial",
        risk: "commercial",
        fontFamily: "var(--font-fraktion)",
      },
      {
        name: "Space Mono",
        source: "Google Fonts · 400, 700",
        risk: "ofl",
        fontFamily: "var(--font-pv-space-mono)",
        style: { fontWeight: 400 },
        note: "Pangram-szerű karaktertörés, retro-tech.",
      },
      {
        name: "DM Mono",
        source: "Google Fonts · 300-500",
        risk: "ofl",
        fontFamily: "var(--font-pv-dm-mono)",
        style: { fontWeight: 400 },
        note: "Nyugodtabb mint Space Mono.",
      },
      {
        name: "Use MonoSpec replacement",
        source: "merge — 1 hellyel kevesebb font",
        risk: "ofl",
        fontFamily: "var(--font-pv-plex-mono)",
        style: { fontWeight: 500 },
        note: "Egyszerűen elhagyható, IBM Plex Mono-t használjuk itt is. -1 network request.",
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

  return (
    <div
      className={`flex flex-col gap-4 border bg-surface/40 p-5 ${
        isCurrent ? "border-magenta/40" : "border-lime/20"
      }`}
    >
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

      {/* Display sample (the real-life headline use case) */}
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

      {/* Secondary sample */}
      <div
        className={`${section.secondarySizeClass} text-secondary`}
        style={{ ...fontStyle, fontWeight: 400 }}
      >
        {section.secondary}
      </div>

      {/* Tertiary (Hungarian pangram or smallest detail) */}
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

export default function FontPreviewPage() {
  return (
    <main className="max-w-[1700px] mx-auto px-6 md:px-10 py-12 md:py-20">
      {/* Header */}
      <header className="mb-16 md:mb-24 max-w-3xl">
        <div
          className="text-[10px] uppercase tracking-[0.4em] text-lime mb-4"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          § INTERNAL · NOT INDEXED
        </div>
        <h1
          className="text-[44px] md:text-[64px] leading-[0.95] mb-6 uppercase"
          style={{
            fontFamily: "var(--font-pv-archivo-black)",
            letterSpacing: "-0.02em",
          }}
        >
          Font Preview · PTRK Systems
        </h1>
        <p
          className="text-base md:text-lg text-secondary leading-relaxed"
          style={{ fontFamily: "var(--font-pv-bricolage)" }}
        >
          Az 5 jogilag problémás font slot összehasonlítása ingyenes Google
          Fonts alternatívákkal. Minden minta a valós oldalon használt
          méreten és súlyon renderelődik. A bal-szélső oszlop a jelenlegi
          (problémás) font, a többi 3 a jelölt csere. Magyar ékezet-teszt:
          „árvíztűrő tükörfúrógép".
        </p>
        <div
          className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]"
          style={{ fontFamily: "var(--font-pv-geist-mono)" }}
        >
          <RiskChip risk="marathon" />
          <RiskChip risk="commercial" />
          <RiskChip risk="ofl" />
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
          Mockup only — nem lesz indexálva, nem szerepel a navigációban.
        </p>
      </footer>
    </main>
  );
}
