/**
 * Pure data exports for GoliathSymbols – split out so that
 * GoliathSymbols.tsx can satisfy the only-export-components HMR rule.
 */

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
 * Marathon palette tones – mirrors the design tokens
 * (lime / cyan / magenta / orange) so callers can pick a colour without
 * having to know the hex code. `currentColor` (no `tone` prop) stays the
 * default so the same call site can also be coloured via parent text-X.
 */
export type GoliathTone = "lime" | "cyan" | "magenta" | "orange";
