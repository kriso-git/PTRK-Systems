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
        <div className="min-h-screen bg-void text-primary flex flex-col">
          <Navigation />
          <main className="pt-20 flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
