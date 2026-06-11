import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://cvifyai.vercel.app/sitemap.xml",
    host: "https://cvifyai.vercel.app",
  };
}
