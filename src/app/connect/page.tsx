import type { Metadata } from "next";
import { ConnectForm } from "@/components/ConnectForm";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Van egy projekted? Konzultációra van szükséged? Email, LinkedIn, Budapest. Általában 24 órán belül válaszolok.",
  alternates: { canonical: "/connect" },
};

export default function ConnectPage() {
  return <ConnectForm />;
}
