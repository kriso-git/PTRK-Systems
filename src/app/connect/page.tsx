import type { Metadata } from "next";
import { ContactTab } from "@/components/ContactTab";

export const metadata: Metadata = {
  title: "Connect — Talk to Péter",
  description:
    "Van egy projekted? Konzultációra van szükséged? Email, LinkedIn, Budapest. Általában 24 órán belül válaszolok.",
  alternates: { canonical: "/connect" },
};

export default function ConnectPage() {
  return <ContactTab />;
}
