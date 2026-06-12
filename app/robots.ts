import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // PRE-LAUNCH: block all crawling. On launch day restore:
  //   rules: { userAgent: "*", allow: "/" },
  //   sitemap: "https://www.cvifyai.com/sitemap.xml",
  //   host: "https://www.cvifyai.com",
  // and set robots: { index: true, follow: true } in app/layout.tsx.
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
