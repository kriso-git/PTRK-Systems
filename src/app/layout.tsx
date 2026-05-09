import type { Metadata, Viewport } from "next";
import {
  goliath,
  khInterference,
  khGrotesk,
  msPGothic,
  monoSpec,
  fraktion,
  sequel,
  shorai,
} from "@/lib/fonts";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PTRK Systems — Design Engineering Unit",
    template: "%s · PTRK Systems",
  },
  description:
    "Design engineering unit Budapesten. Termék-felületek, design rendszerek és frontend architektúra — egyetlen fókuszált operátortól.",
  metadataBase: new URL("https://ptrksystems.com"),
  openGraph: {
    title: "PTRK Systems — Design Engineering",
    description:
      "Termék-felületek, design rendszerek és frontend architektúra Budapestről.",
    locale: "hu_HU",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

const fontVars = [
  goliath.variable,
  khInterference.variable,
  khGrotesk.variable,
  msPGothic.variable,
  monoSpec.variable,
  fraktion.variable,
  sequel.variable,
  shorai.variable,
].join(" ");

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hu" className={fontVars}>
      <body>
        <SmoothScroll />
        {/* Subtle grain + scanline overlays */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.4) 2px 3px)",
          }}
        />
        <div className="min-h-screen bg-void text-primary flex flex-col relative">
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
