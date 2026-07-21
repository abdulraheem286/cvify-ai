import { getAllPosts } from "../lib/blog";

// /llms.txt — a plain-text map of the site for AI answer engines (GEO).
// Statically generated at build time.
export const dynamic = "force-static";

const BASE = "https://www.cvifyai.com";

export function GET() {
  const posts = getAllPosts();
  const lines = [
    "# CVify AI",
    "",
    "> CVify AI is a free, AI-powered resume and CV builder. It turns rough notes into a polished, professional CV in minutes — with AI that writes and improves the wording, professional templates, full color and font customization, custom sections, tailoring to a job, and an ATS-ready (applicant tracking system) text PDF download. Free to use, with CVs saved to a free account.",
    "",
    "## Key pages",
    `- [CVify AI — Free AI Resume & CV Builder](${BASE}/): Build a professional CV in minutes with AI.`,
    `- [Features](${BASE}/features): AI writing, templates, customization, custom sections, ATS-ready PDF.`,
    `- [Templates](${BASE}/templates): Free, professionally designed CV & resume templates.`,
    `- [Build a CV](${BASE}/build): Start with AI, a guided wizard, manual entry, or import an existing CV.`,
    `- [FAQ](${BASE}/faq): Answers about building, ATS, exporting, and accounts.`,
    "",
    "## Blog — CV & resume guides",
    ...posts.map((p) => `- [${p.title}](${BASE}/blog/${p.slug}): ${p.description}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
