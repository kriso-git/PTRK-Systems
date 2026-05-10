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
  | "dot"
  | "block"
  | "frame"
  | "bar"
  | "post"
  | "plus"
  | "chevron"
  | "arrow"
  | "diamond"
  | "hex"
  | "slash"
  | "double"
  | "notch"
  | "bracket"
  | "ring"
  | "step";

const SHAPES: Record<GoliathSymbolName, React.ReactNode> = {
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
  // Heavy upward chevron (open V shape).
  chevron: (
    <polygon points="50,8 92,72 70,72 50,40 30,72 8,72" />
  ),
  // Chunky right-pointing arrow.
  arrow: (
    <polygon points="8,38 56,38 56,18 92,50 56,82 56,62 8,62" />
  ),
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
  step: (
    <path d="M14 86 H86 V62 H58 V38 H30 V62 H14 Z" />
  ),
};

export const GOLIATH_SYMBOL_NAMES: GoliathSymbolName[] = [
  "dot",
  "block",
  "frame",
  "bar",
  "post",
  "plus",
  "chevron",
  "arrow",
  "diamond",
  "hex",
  "slash",
  "double",
  "notch",
  "bracket",
  "ring",
  "step",
];

/**
 * Render a single Goliath ornament glyph. `currentColor` driven, so the
 * caller controls colour + opacity via standard CSS classes (mirrors how
 * `font-goliath text-lime/[0.04]` worked for the original font usage).
 */
export function GoliathSymbol({
  name,
  size = 96,
  className,
  style,
}: {
  name: GoliathSymbolName;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
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
 */
export function GoliathOrnament({
  seed = "ptrk",
  count = 4,
  size = 96,
  gap,
  className,
  style,
}: {
  seed?: string;
  count?: number;
  size?: number | string;
  gap?: number | string;
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
      {picks.map((name, i) => (
        <GoliathSymbol key={i} name={name} size={size} />
      ))}
    </span>
  );
}
