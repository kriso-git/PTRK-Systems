import type { Metadata } from "next";
import { ProcessTab } from "@/components/ProcessTab";

export const metadata: Metadata = {
  title: "Method — Hogyan dolgozom",
  description:
    "6 lépéses design engineering folyamat — kutatás, IA, design, frontend, tesztelés, launch. Stratégiai, felhasználó-centrikus, technikailag kifogástalan.",
  alternates: { canonical: "/method" },
};

export default function MethodPage() {
  return <ProcessTab />;
}
