/**
 * Live-site font stack – fully Google Fonts (OFL), no commercial /
 * fan-extracted fonts. Replacements were chosen via the /font-preview
 * archive after side-by-side review:
 *
 *   - khInterference  → Chakra Petch (SemiBold 600 default)
 *   - monoSpec        → Geist Mono (Vercel)
 *   - fraktion        → DM Mono
 *   - sequel          → Roboto Flex (variable wdth + wght)
 *   - msPGothic       → Manrope (already migrated)
 *   - shorai          → Onest (already migrated)
 *
 * Removed entirely:
 *   - goliath   → replaced by <GoliathOrnament> SVG symbols
 *   - khGrotesk → was loaded but never referenced in the codebase
 *
 * The CSS variable names are unchanged so every existing
 * `font-khinterference`, `font-monospec`, `font-fraktion`, `font-sequel`
 * Tailwind class on the live site keeps working without edits.
 */
import {
  Onest,
  Manrope,
  Chakra_Petch,
  Geist_Mono,
  DM_Mono,
  Roboto_Flex,
} from "next/font/google";

// Chakra Petch – angular techno display sans, Marathon-feel match for
// KH Interference. SemiBold 600 is the live default (set via CSS in
// globals.css), full weight range loaded for explicit hierarchy.
export const khInterference = Chakra_Petch({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-khinterference",
  display: "swap",
});

// Manrope – Latin Extended subset includes Hungarian (ő, ű, é, á, ó, í, ú).
export const msPGothic = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-msgothic",
  display: "swap",
  preload: false, // secondary UI font (not the LCP); keep preload bandwidth for the hero + LCP body fonts on mobile
});

// Geist Mono – modern terminal monospace, replaces MonoSpec for all
// terminal-style UI labels and timestamps.
export const monoSpec = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-monospec",
  display: "swap",
  preload: false, // HUD label monospace (not the LCP); off the preload critical path so the hero + body fonts win bandwidth on mobile
});

// DM Mono – calm display monospace, replaces PP Fraktion Mono in the
// single project-card watermark spot.
export const fraktion = DM_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-fraktion",
  display: "swap",
  preload: false, // single below-the-fold watermark spot; keep it off the LCP path
});

// Roboto Flex – variable wdth (25-151) + wght (100-1000). Replaces
// Sequel 100 Wide. Default rendering is set to wght 900 + wdth 151 via
// a CSS override on `.font-sequel` in globals.css so existing class
// usages keep their wide-heavy look without per-call edits.
export const sequel = Roboto_Flex({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-sequel",
  display: "swap",
  preload: false, // heavy variable font used only for decorative big numbers (not the LCP wordmark); keep it off the preload critical path so the hero font wins the bandwidth on mobile
});

// Onest – Latin Extended subset includes Hungarian.
export const shorai = Onest({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-shorai",
  display: "swap",
});

export const fontVariables = [
  khInterference.variable,
  msPGothic.variable,
  monoSpec.variable,
  fraktion.variable,
  sequel.variable,
  shorai.variable,
].join(" ");
