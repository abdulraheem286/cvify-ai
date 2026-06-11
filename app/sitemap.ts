import type { MetadataRoute } from "next";

const BASE = "https://cvifyai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/build`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/build/ai`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/build/manual`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
