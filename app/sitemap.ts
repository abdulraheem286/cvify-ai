import type { MetadataRoute } from "next";
import { getAllPosts } from "./lib/blog";

const BASE = "https://www.cvifyai.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/features`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/templates`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/build`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/build/ai`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/build/wizard`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/build/manual`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/build/import`, changeFrequency: "monthly", priority: 0.8 },
    ...posts,
  ];
}
