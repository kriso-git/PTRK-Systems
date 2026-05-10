import localFont from "next/font/local";
import {
  Archivo_Black,
  Bricolage_Grotesque,
  Anton,
  Geist_Mono,
  JetBrains_Mono,
  Space_Grotesk,
  IBM_Plex_Mono,
  Space_Mono,
  DM_Mono,
  Sora,
  Archivo,
  Bungee,
  Honk,
  Sixtyfour,
  Bowlby_One,
  Orbitron,
  Audiowide,
  Saira,
  Big_Shoulders,
  Chakra_Petch,
  Major_Mono_Display,
  Share_Tech_Mono,
  Black_Ops_One,
  Roboto_Flex,
  Anybody,
  Saira_Stencil_One,
  Goldman,
} from "next/font/google";

// ── ARCHIVE — original (now-removed) fonts kept loaded ONLY on this
//    /font-preview route so the "Current" comparison cards still render
//    visually faithful samples. Files remain in /public/fonts but are
//    not referenced from the live site fonts.ts. ──────────────────────
const archiveGoliath = localFont({
  src: "../../../public/fonts/Goliath.otf",
  variable: "--font-pv-archive-goliath",
  display: "swap",
  weight: "900",
});

const archiveKhInterference = localFont({
  src: [
    {
      path: "../../../public/fonts/KHInterference-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/KHInterference-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-pv-archive-khinterference",
  display: "swap",
});

const archiveMonoSpec = localFont({
  src: "../../../public/fonts/MonoSpec-Regular.otf",
  variable: "--font-pv-archive-monospec",
  display: "swap",
  weight: "400",
});

const archiveFraktion = localFont({
  src: "../../../public/fonts/PPFraktionMono-Regular.ttf",
  variable: "--font-pv-archive-fraktion",
  display: "swap",
  weight: "400",
});

const archiveSequel = localFont({
  src: "../../../public/fonts/Sequel100Wide-65.ttf",
  variable: "--font-pv-archive-sequel",
  display: "swap",
  weight: "700",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-pv-archivo-black",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-pv-bricolage",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-pv-anton",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-pv-geist-mono",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-pv-jetbrains",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-pv-space-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-pv-plex-mono",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-pv-space-mono",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-pv-dm-mono",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-pv-sora",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-pv-archivo",
  display: "swap",
});

// ── Decorative-impact / symbol-like display fonts (for Goliath slot) ──
const bungee = Bungee({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-pv-bungee",
  display: "swap",
});

const honk = Honk({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-pv-honk",
  display: "swap",
});

const sixtyfour = Sixtyfour({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pv-sixtyfour",
  display: "swap",
});

const bowlbyOne = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pv-bowlby",
  display: "swap",
});

// ── Angular / blocky terminal-display (for KH Interference slot) ──
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-pv-orbitron",
  display: "swap",
});

const audiowide = Audiowide({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-pv-audiowide",
  display: "swap",
});

// ── Wide bold modern display (for Sequel 100 Wide slot) ──
const saira = Saira({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-pv-saira",
  display: "swap",
});

const bigShoulders = Big_Shoulders({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-pv-big-shoulders",
  display: "swap",
});

// ── Extra angular / blocky candidates for KH Interference ──
const chakraPetch = Chakra_Petch({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-pv-chakra-petch",
  display: "swap",
});

const majorMono = Major_Mono_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pv-major-mono",
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pv-share-tech-mono",
  display: "swap",
});

const blackOps = Black_Ops_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pv-black-ops",
  display: "swap",
});

// ── Extra wide-bold-modern candidates for Sequel 100 Wide ──
const robotoFlex = Roboto_Flex({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-pv-roboto-flex",
  display: "swap",
});

// Anybody — variable wdth 75-150 + wght 100-900. Free analog of
// Sequel 100 Wide's two-axis flexibility (width + weight).
const anybody = Anybody({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-pv-anybody",
  display: "swap",
});

const sairaStencil = Saira_Stencil_One({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-pv-saira-stencil",
  display: "swap",
});

const goldman = Goldman({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-pv-goldman",
  display: "swap",
});

const previewVars = [
  archiveGoliath.variable,
  archiveKhInterference.variable,
  archiveMonoSpec.variable,
  archiveFraktion.variable,
  archiveSequel.variable,
  archivoBlack.variable,
  bricolage.variable,
  anton.variable,
  geistMono.variable,
  jetbrains.variable,
  spaceGrotesk.variable,
  plexMono.variable,
  spaceMono.variable,
  dmMono.variable,
  sora.variable,
  archivo.variable,
  bungee.variable,
  honk.variable,
  sixtyfour.variable,
  bowlbyOne.variable,
  orbitron.variable,
  audiowide.variable,
  saira.variable,
  bigShoulders.variable,
  chakraPetch.variable,
  majorMono.variable,
  shareTechMono.variable,
  blackOps.variable,
  robotoFlex.variable,
  anybody.variable,
  sairaStencil.variable,
  goldman.variable,
].join(" ");

export const metadata = {
  title: "Font Preview · PTRK Systems",
  robots: { index: false, follow: false },
};

export default function FontPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wrapper sits at z-50 with an opaque void bg so the root layout's marathon
  // background, scatter, typers and scanlines are fully covered — sample
  // typography is judged on a clean stage, not over decoration.
  return (
    <div
      className={`${previewVars} relative z-50 min-h-screen bg-void text-primary`}
    >
      {children}
    </div>
  );
}
