import type { Metadata, Viewport } from "next";
import {
  khInterference,
  msPGothic,
  monoSpec,
  fraktion,
  sequel,
  shorai,
} from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/JsonLd";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { StageBackgroundLazy } from "@/components/r3f/StageBackgroundLazy";
import { StageViewsLazy } from "@/components/r3f/StageViewsLazy";
import { StageVeilLazy } from "@/components/r3f/StageVeilLazy";
import { ScrollSignalBridge } from "@/components/r3f/ScrollSignalBridge";
import { RouteSignalBridge } from "@/components/r3f/RouteSignalBridge";
import { MarathonBackground } from "@/components/MarathonBackground";
import { MarathonScatter } from "@/components/MarathonScatter";
import { LiveTerminalTypers } from "@/components/LiveTerminalTypers";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CustomCursor } from "@/components/CustomCursor";
import { RevealObserver } from "@/components/RevealObserver";
import { NodeToast } from "@/components/NodeToast";
import { HudSystem } from "@/components/HudSystem";
import { MobileTerminalDock } from "@/components/MobileTerminalDock";
import { BootSequence } from "@/components/BootSequence";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PTRK-Systems",
    template: "PTRK-Systems - %s",
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
  twitter: {
    card: "summary_large_image",
    title: "PTRK Systems — Design Engineering",
    description:
      "Termék-felületek, design rendszerek és frontend architektúra Budapestről.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
};

const fontVars = [
  khInterference.variable,
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
        <JsonLd />
        <SmoothScroll />
        <ScrollSignalBridge />
        <RouteSignalBridge />
        <RevealObserver />
        <StageBackgroundLazy />
        <StageViewsLazy />
        <StageVeilLazy />
        <MarathonBackground />
        <ScrollProgress />
        <CustomCursor />
        {/* Subtle film grain (kept on top of Marathon bg) */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        <div className="min-h-screen text-primary flex flex-col relative pb-[calc(2.25rem_+_env(safe-area-inset-bottom))] md:pb-0">
          {/* Scatter + live typers are both sized to the full document
              height (not the viewport) — they stay anchored to page
              content and scroll naturally with it instead of trailing
              the viewport. */}
          <MarathonScatter />
          <LiveTerminalTypers />
          <Navigation />
          {/* Reserve space for the fixed Navigation header so content
              doesn't slide underneath it on initial paint. Mobile is
              taller (~96px) because the header has a brand row + a 4-tab
              nav row stacked underneath it. */}
          <div aria-hidden className="h-[96px] md:h-[94px] shrink-0" />
          {/* Reserve 260px on the right (md+) so content never collides
              with the fixed RightDataStream terminal aside (230px wide +
              8px mx-2 = 246px footprint). Without this, FHD-class monitors
              (~1920px and narrower) push body copy and headings under the
              terminal column; only ≥~2200px viewports had enough gutter. */}
          <main className="flex-1 relative z-10 md:pr-[260px]">{children}</main>
          <Footer />
        </div>
        <BootSequence />
        <NodeToast />
        <HudSystem />
        <MobileTerminalDock />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
