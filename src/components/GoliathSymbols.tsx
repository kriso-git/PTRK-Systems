/**
 * Goliath replacement — decorative SVG symbol set.
 *
 * The original `font-goliath` wasn't being used to render readable text on
 * the live site at all — every occurrence is a low-opacity (4-6%) corner
 * watermark like "·26·", "HELLO", "2026", "SYS·", "METHOD". The user
 * confirmed those were always purely ornamental, so this module replaces
 * the font entirely with a small library of chunky block-style SVG glyphs
 * that match the Marathon-display aesthetic (heavy fills, sharp 90°/45°
 * geometry, geometric primitives).
 *
 * Drop-in usage on the live site (replaces `<span className="font-goliath">·26·</span>`):
 *
 *   <GoliathOrnament seed="ptrk-26" count={4} className="..." />
 *
 * Or hand-pick specific symbols:
 *
 *   <GoliathSymbol name="frame" /> <GoliathSymbol name="hex" />
 *
 * Inherit color via `currentColor` — set on the parent the same way
 * Tailwind classes like `text-lime/[0.04]` worked for the font watermark.
 */

import * as React from "react";

export type GoliathSymbolName =
  // Cores
  | "dot"
  | "block"
  | "frame"
  | "bar"
  | "post"
  | "plus"
  | "diamond"
  | "hex"
  | "slash"
  | "double"
  | "notch"
  | "bracket"
  | "ring"
  | "step"
  // Directional / arrows
  | "arrow"
  | "arrow-l"
  | "arrow-u"
  | "arrow-d"
  | "chevron"
  | "chevron-d"
  // Marathon-rune-style block letterforms
  | "rune-s"
  | "rune-t"
  | "rune-x"
  | "rune-y"
  // Extra ornaments
  | "target"
  | "gateway"
  | "stairs"
  | "shield"
  | "eye"
  | "octa";

const SHAPES: Record<GoliathSymbolName, React.ReactNode> = {
  // ── Cores ─────────────────────────────────────────────────────────────
  // Solid filled disc — the "·" watermark equivalent.
  dot: <circle cx="50" cy="50" r="26" />,
  // Solid heavy square — base ornament.
  block: <rect x="14" y="14" width="72" height="72" />,
  // Hollow square frame (path with even-odd fill so the inner cut shows).
  frame: (
    <path
      d="M14 14 H86 V86 H14 Z M30 30 V70 H70 V30 Z"
      fillRule="evenodd"
    />
  ),
  // Heavy horizontal bar.
  bar: <rect x="6" y="40" width="88" height="20" />,
  // Heavy vertical post.
  post: <rect x="40" y="6" width="20" height="88" />,
  // Chunky plus / cross — fits a 100×100 grid cleanly.
  plus: <path d="M40 10 H60 V40 H90 V60 H60 V90 H40 V60 H10 V40 H40 Z" />,
  // Solid diamond / lozenge.
  diamond: <polygon points="50,8 92,50 50,92 8,50" />,
  // Solid hexagon.
  hex: <polygon points="50,8 88,28 88,72 50,92 12,72 12,28" />,
  // Heavy diagonal slash.
  slash: <polygon points="14,82 70,12 86,18 30,88" />,
  // Two stacked heavy bars (≡ feel).
  double: (
    <>
      <rect x="6" y="28" width="88" height="14" />
      <rect x="6" y="58" width="88" height="14" />
    </>
  ),
  // Block with a triangular notch cut out of the top — half-step cut.
  notch: (
    <path
      d="M14 14 H86 V86 H14 Z M50 14 L70 38 L30 38 Z"
      fillRule="evenodd"
    />
  ),
  // Heavy square bracket (corner-piece).
  bracket: <path d="M14 14 H58 V30 H30 V70 H58 V86 H14 Z" />,
  // Hollow ring — circle with a circular cut.
  ring: (
    <path
      d="M50 14 A36 36 0 1 0 50 86 A36 36 0 1 0 50 14 Z M50 30 A20 20 0 1 1 50 70 A20 20 0 1 1 50 30 Z"
      fillRule="evenodd"
    />
  ),
  // Step / staircase block.
  step: <path d="M14 86 H86 V62 H58 V38 H30 V62 H14 Z" />,

  // ── Arrows / chevrons ─────────────────────────────────────────────────
  arrow: (
    <polygon points="8,38 56,38 56,18 92,50 56,82 56,62 8,62" />
  ),
  "arrow-l": (
    <polygon points="92,38 44,38 44,18 8,50 44,82 44,62 92,62" />
  ),
  "arrow-u": (
    <polygon points="38,92 38,44 18,44 50,8 82,44 62,44 62,92" />
  ),
  "arrow-d": (
    <polygon points="38,8 38,56 18,56 50,92 82,56 62,56 62,8" />
  ),
  // Heavy upward chevron (open V shape).
  chevron: <polygon points="50,8 92,72 70,72 50,40 30,72 8,72" />,
  // Heavy downward chevron.
  "chevron-d": <polygon points="50,92 92,28 70,28 50,60 30,28 8,28" />,

  // ── Marathon-rune-style block letterforms ────────────────────────────
  // Stylized S — zigzag block, reads as alien-rune at low opacity.
  "rune-s": (
    <path d="M14 14 H86 V34 H40 V44 H86 V86 H14 V66 H60 V56 H14 Z" />
  ),
  // Block T — the bar across the top with a heavy stem.
  "rune-t": <path d="M10 14 H90 V32 H62 V86 H38 V32 H10 Z" />,
  // Block X — diagonal cuts through the centre.
  "rune-x": (
    <path d="M14 14 H34 L50 36 L66 14 H86 L62 50 L86 86 H66 L50 64 L34 86 H14 L38 50 Z" />
  ),
  // Block Y — wide top fork tapering to a stem.
  "rune-y": (
    <path d="M10 14 H32 L50 42 L68 14 H90 L60 56 V86 H40 V56 Z" />
  ),

  // ── Extra ornaments ──────────────────────────────────────────────────
  // Concentric squares — target / scope feel.
  target: (
    <path
      d="M10 10 H90 V90 H10 Z M26 26 V74 H74 V26 Z M40 40 V60 H60 V40 Z"
      fillRule="evenodd"
    />
  ),
  // U-shape gateway / portal.
  gateway: (
    <path d="M14 14 H38 V62 H62 V14 H86 V86 H14 Z" />
  ),
  // Three-step descending staircase.
  stairs: (
    <path d="M14 86 V62 H38 V44 H62 V26 H86 V86 Z" />
  ),
  // Block shield / pentagon.
  shield: (
    <polygon points="14,14 86,14 86,58 50,92 14,58" />
  ),
  // Eye / lozenge with inner pupil — abstract scrutiny mark.
  eye: (
    <path
      d="M8 50 Q50 14 92 50 Q50 86 8 50 Z M40 50 A10 10 0 1 1 60 50 A10 10 0 1 1 40 50 Z"
      fillRule="evenodd"
    />
  ),
  // Solid octagon — chunky stop-sign feel.
  octa: <polygon points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32" />,
};

export const GOLIATH_SYMBOL_NAMES: GoliathSymbolName[] = [
  // Cores
  "dot",
  "block",
  "frame",
  "bar",
  "post",
  "plus",
  "diamond",
  "hex",
  "slash",
  "double",
  "notch",
  "bracket",
  "ring",
  "step",
  // Arrows + chevrons
  "arrow",
  "arrow-l",
  "arrow-u",
  "arrow-d",
  "chevron",
  "chevron-d",
  // Runes
  "rune-s",
  "rune-t",
  "rune-x",
  "rune-y",
  // Extras
  "target",
  "gateway",
  "stairs",
  "shield",
  "eye",
  "octa",
];

/**
 * Marathon palette tones — mirrors the design tokens
 * (lime / cyan / magenta / orange) so callers can pick a colour without
 * having to know the hex code. `currentColor` (no `tone` prop) stays the
 * default so the same call site can also be coloured via parent text-X.
 */
export type GoliathTone = "lime" | "cyan" | "magenta" | "orange";

const TONE_HEX: Record<GoliathTone, string> = {
  lime: "#c2fe0c",
  cyan: "#01ffff",
  magenta: "#ea027e",
  orange: "#ff8c42",
};

/**
 * Render a single Goliath ornament glyph.
 *
 * Defaults to `currentColor` so the parent's text colour + opacity classes
 * (e.g. `text-lime/[0.04]`) drive the look exactly like the old
 * `font-goliath` watermarks. Pass an explicit `tone` to lock the glyph to
 * one of the Marathon palette colours (lime / cyan / magenta / orange).
 */
export function GoliathSymbol({
  name,
  size = 96,
  tone,
  className,
  style,
}: {
  name: GoliathSymbolName;
  size?: number | string;
  tone?: GoliathTone;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={tone ? TONE_HEX[tone] : "currentColor"}
      className={className}
      style={{ display: "inline-block", ...style }}
      aria-hidden
      focusable="false"
    >
      {SHAPES[name]}
    </svg>
  );
}

/**
 * Pseudo-deterministic hash so a given seed string always picks the same
 * glyph sequence — keeps the SSR + CSR markup in sync, and means the
 * "·26·" corner of the landing page renders the same shapes on every load.
 */
function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Composed ornament — a row of N Goliath glyphs picked deterministically
 * from `seed`. Drop-in replacement for the old `font-goliath` watermarks.
 *
 * Match the original watermark scale by setting `size` to the same px the
 * old `text-[clamp(...)]` resolved to, OR pass a CSS length string like
 * `"clamp(40px, 5vw, 96px)"` to drive responsive sizing the same way.
 *
 * `tone` (optional): pin every glyph in the ornament to one of the
 * Marathon palette colours. If omitted, the ornament inherits parent
 * `text-X` class — keep the same opacity/colour pattern the old
 * watermarks used.
 *
 * `multitone` (optional): when set, pick a different palette colour for
 * each glyph in the row, giving the ornament a multi-channel HUD feel.
 * Useful for the live-site watermarks where some variety reads better.
 */
export function GoliathOrnament({
  seed = "ptrk",
  count = 4,
  size = 96,
  gap,
  tone,
  multitone,
  className,
  style,
}: {
  seed?: string;
  count?: number;
  size?: number | string;
  gap?: number | string;
  tone?: GoliathTone;
  multitone?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const h = hashSeed(seed);
  const picks: GoliathSymbolName[] = [];
  for (let i = 0; i < count; i++) {
    // Mix the index in with a large prime so consecutive picks differ.
    const idx = (h + i * 2654435761) % GOLIATH_SYMBOL_NAMES.length;
    picks.push(GOLIATH_SYMBOL_NAMES[idx]);
  }
  const palette: GoliathTone[] = ["lime", "cyan", "magenta", "orange"];
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: gap ?? "0.18em",
        lineHeight: 0,
        ...style,
      }}
    >
      {picks.map((name, i) => {
        const glyphTone = multitone
          ? palette[(h + i * 1597) % palette.length]
          : tone;
        return (
          <GoliathSymbol key={i} name={name} size={size} tone={glyphTone} />
        );
      })}
    </span>
  );
}

/**
 * Background-decoration scatter — replaces the role the Goliath font had
 * in the live site. Renders absolutely-positioned ornaments at the four
 * corners + centre of its parent (which must be `position: relative`),
 * each in a different Marathon tone at the same low 3-7% opacity range
 * the old watermarks used.
 *
 * Drop in just inside any `<section className="relative …">` to give it
 * the same atmospheric glyph-watermark feel:
 *
 *   <GoliathScatter seed="connect" />
 *
 * `density` controls how many of the 5 placement slots are filled
 * (default: all 5). `seed` keeps the layout stable across SSR/CSR and
 * across navigations.
 */
export type GoliathScatterPlacement =
  | "tl"
  | "tr"
  | "bl"
  | "br"
  | "center";

const PLACEMENT_STYLES: Record<GoliathScatterPlacement, React.CSSProperties> = {
  tl: { top: "-2vw", left: "-1vw" },
  tr: { top: "-2vw", right: "-1vw" },
  bl: { bottom: "-2vw", left: "-1vw" },
  br: { bottom: "-2vw", right: "-1vw" },
  center: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

export function GoliathScatter({
  seed = "ptrk",
  density = 5,
  className,
}: {
  seed?: string;
  density?: number;
  className?: string;
}) {
  const slots: {
    placement: GoliathScatterPlacement;
    tone: GoliathTone;
    count: number;
    size: string;
    opacity: number;
  }[] = [
    { placement: "tr", tone: "lime", count: 3, size: "clamp(80px, 14vw, 240px)", opacity: 0.05 },
    { placement: "bl", tone: "cyan", count: 4, size: "clamp(60px, 11vw, 200px)", opacity: 0.05 },
    { placement: "tl", tone: "magenta", count: 2, size: "clamp(70px, 13vw, 220px)", opacity: 0.04 },
    { placement: "br", tone: "orange", count: 3, size: "clamp(70px, 13vw, 220px)", opacity: 0.04 },
    { placement: "center", tone: "lime", count: 4, size: "clamp(120px, 22vw, 380px)", opacity: 0.03 },
  ];
  const h = hashSeed(seed);
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className ?? ""}`}
    >
      {slots.slice(0, Math.max(0, Math.min(density, slots.length))).map((s, i) => (
        <GoliathOrnament
          key={`${s.placement}-${i}`}
          seed={`${seed}-${s.placement}-${h}`}
          count={s.count}
          size={s.size}
          tone={s.tone}
          style={{
            position: "absolute",
            opacity: s.opacity,
            ...PLACEMENT_STYLES[s.placement],
          }}
        />
      ))}
    </div>
  );
}
