import type { MetadataRoute } from "next";

const BASE = "https://ptrksystems.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/method`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/connect`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];
}
