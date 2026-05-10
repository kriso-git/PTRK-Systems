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
} from "next/font/google";

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

const previewVars = [
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
