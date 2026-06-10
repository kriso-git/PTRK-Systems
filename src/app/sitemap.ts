import type { MetadataRoute } from "next";

const BASE = "https://ptrksystems.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/method`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/connect`, changeFrequency: "yearly", priority: 0.8 },
  ];
}
