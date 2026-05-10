/**
 * Font alternatíva mockup — `/font-preview` route.
 *
 * Internal preview page: not linked from navigation, only reachable via URL.
 * Shows side-by-side how the 5 problematic fonts (Goliath, KH Interference,
 * MonoSpec, Sequel, Fraktion) compare to free Google Fonts alternatives at
 * the exact sizes / weights they're used at on the live site, so the user
 * can pick replacements based on real visual impression rather than names.
 */

type Risk = "marathon" | "commercial" | "ofl" | "deferred";

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
  /** Marks this option as the chosen replacement — gets a lime border + chip */
  chosen?: boolean;
  /** Marks this card as a "future plan" placeholder, no actual font */
  placeholder?: boolean;
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
  deferred: {
    label: "TBD",
    bg: "rgba(1,255,255,0.12)",
    fg: "#01ffff",
  },
};

const HU_PANGRAM = "árvíztűrő tükörfúrógép";

const SECTIONS: Section[] = [
  {
    slot: "GOLIATH",
    usage:
      "5× — dekoratív watermark · TBD: nem font, generált szimbólumokra cserélve",
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
        name: "Chakra Petch (Bold 700)",
        source: "Google Fonts · OFL · 300 · 400 · 500 · 600 · 700 + italics",
        risk: "ofl",
        fontFamily: "var(--font-pv-chakra-petch)",
        style: { fontWeight: 700 },
        note: "Szögletes-techno display sans, cyberpunk/Marathon karakter. Teljes súly-skála (Light → Bold), italic változatokkal — ugyanaz a hierarchia mint a KH Interference Light + Regular kettősénél, plusz extra súlyok.",
      },
      {
        name: "Major Mono Display",
        source: "Google Fonts · OFL · 1 weight",
        risk: "ofl",
        fontFamily: "var(--font-pv-major-mono)",
        style: { fontWeight: 400 },
        note: "Angular geometric monospace display, élesen rajzolt karakterek — display heading-nek illik a Marathon-érzéshez.",
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
        note: "Military stencil display, vágott élek — agresszívebb, sci-fi/military hangulat.",
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
      "150× — terminal UI labels, timestamps · ✓ DÖNTÉS: Geist Mono",
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
        name: "Geist Mono",
        source: "Google Fonts (Vercel) · variable",
        risk: "ofl",
        fontFamily: "var(--font-pv-geist-mono)",
        style: { fontWeight: 400 },
        chosen: true,
        note: "Modern terminal mono. Cseréje 1:1 a MonoSpec helyén — koherens „minden terminal mono ugyanaz” élmény az egész oldalon.",
      },
      {
        name: "IBM Plex Mono",
        source: "Google Fonts (IBM) · 100-700",
        risk: "ofl",
        fontFamily: "var(--font-pv-plex-mono)",
        style: { fontWeight: 400 },
        note: "Backup option — humanistább, ha a Geist túl száraznak hatna.",
      },
      {
        name: "JetBrains Mono",
        source: "Google Fonts · 100-800",
        risk: "ofl",
        fontFamily: "var(--font-pv-jetbrains)",
        style: { fontWeight: 400 },
        note: "Backup — agresszívebb terminál-feel, jobb hinting.",
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
        name: "Anybody (wdth 150 · 900)",
        source: "Google Fonts · OFL · variable wdth 75-150 + wght 100-900",
        risk: "ofl",
        fontFamily: "var(--font-pv-anybody)",
        style: {
          fontWeight: 900,
          fontStretch: "150%",
        },
        note: "Sequel valódi free analogja — azonos két-tengelyes flexibilitás (width + weight), éles geometriai konstrukció, sport-/magazin-impact.",
      },
      {
        name: "Saira Stencil One",
        source: "Google Fonts · OFL · 1 weight",
        risk: "ofl",
        fontFamily: "var(--font-pv-saira-stencil)",
        style: { fontWeight: 400 },
        note: "Wide stencil, vágott éles karakterek — Sequel-szerű élesség, military/sport hangulattal.",
      },
      {
        name: "Goldman 700",
        source: "Google Fonts · OFL · 400 + 700",
        risk: "ofl",
        fontFamily: "var(--font-pv-goldman)",
        style: { fontWeight: 700 },
        note: "Wide blokk-display, sharp edges, „sport cap” feel — direct Sequel-rokon.",
      },
      {
        name: "Roboto Flex (wide+heavy)",
        source: "Google Fonts · OFL · variable wdth 25-151",
        risk: "ofl",
        fontFamily: "var(--font-pv-roboto-flex)",
        style: {
          fontWeight: 900,
          fontStretch: "151%",
        },
        note: "Variable wdth axis 151-ig — igazi „ultra-wide” karakterek, modern Roboto-bázis, kevésbé éles mint a többi opció.",
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
    usage: "1× — projektkártya watermark · ✓ DÖNTÉS: DM Mono",
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
        name: "DM Mono",
        source: "Google Fonts · OFL · 300-500",
        risk: "ofl",
        fontFamily: "var(--font-pv-dm-mono)",
        style: { fontWeight: 400 },
        chosen: true,
        note: "Nyugodt, kicsit szélesebb karakterek, jól olvasható minden méretben — tökéletes ehhez az 1× watermark szerephez.",
      },
      {
        name: "Space Mono",
        source: "Google Fonts · 400, 700",
        risk: "ofl",
        fontFamily: "var(--font-pv-space-mono)",
        style: { fontWeight: 400 },
        note: "Backup — Pangram-szerű karaktertörés, retro-tech.",
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

      {/* Secondary + tertiary samples — skipped on placeholder cards
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
