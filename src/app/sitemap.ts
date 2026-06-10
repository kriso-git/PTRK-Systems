import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";

const BASE = "https://ptrksystems.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/work`, changeFrequency: "monthly", priority: 0.9 },
    ...PROJECTS.map((p) => ({
      url: `${BASE}/work/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${BASE}/method`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/lab`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/connect`, changeFrequency: "yearly", priority: 0.8 },
  ];
}
