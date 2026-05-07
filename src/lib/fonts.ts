import localFont from "next/font/local";
import { Onest, Manrope } from "next/font/google";

export const goliath = localFont({
  src: "../../public/fonts/Goliath.otf",
  variable: "--font-goliath",
  display: "swap",
  weight: "900",
});

export const khInterference = localFont({
  src: [
    { path: "../../public/fonts/KHInterference-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/KHInterference-Regular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-khinterference",
  display: "swap",
});

export const khGrotesk = localFont({
  src: [
    { path: "../../public/fonts/KHGroteskAlpha-CompressedLight.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/KHGroteskAlpha-CompressedRegular.ttf", weight: "400", style: "normal" },
  ],
  variable: "--font-khgrotesk",
  display: "swap",
});

// Manrope — Latin Extended subset includes Hungarian (ő, ű, é, á, ó, í, ú).
// Replaces MS PGothic which lacks Hungarian diacritics.
export const msPGothic = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-msgothic",
  display: "swap",
});

export const monoSpec = localFont({
  src: "../../public/fonts/MonoSpec-Regular.otf",
  variable: "--font-monospec",
  display: "swap",
  weight: "400",
});

export const fraktion = localFont({
  src: "../../public/fonts/PPFraktionMono-Regular.ttf",
  variable: "--font-fraktion",
  display: "swap",
  weight: "400",
});

export const sequel = localFont({
  src: "../../public/fonts/Sequel100Wide-65.ttf",
  variable: "--font-sequel",
  display: "swap",
  weight: "700",
});

// Onest — Latin Extended subset includes Hungarian. Replaces Shorai Sans
// which lacks Hungarian diacritics (ő, ű).
export const shorai = Onest({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-shorai",
  display: "swap",
});

export const fontVariables = [
  goliath.variable,
  khInterference.variable,
  khGrotesk.variable,
  msPGothic.variable,
  monoSpec.variable,
  fraktion.variable,
  sequel.variable,
  shorai.variable,
].join(" ");
