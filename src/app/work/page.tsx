import type { Metadata } from "next";
import { PortfolioTab } from "@/components/PortfolioTab";

export const metadata: Metadata = {
  title: "Work — Selected Projects",
  description:
    "Válogatott design engineering projektek 2024–2026 között: F3XYKEE Terminal, MolekulaX, Donna Pizza. Stack, role, metrika, élő linkek.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return <PortfolioTab />;
}
