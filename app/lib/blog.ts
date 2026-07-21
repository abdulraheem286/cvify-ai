import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { gfmHeadingId, resetHeadings } from "marked-gfm-heading-id";

// Add GitHub-style id="" slugs to headings so in-article Table-of-Contents
// anchor links (and deep links) work.
marked.use(gfmHeadingId());

// Blog posts live as Markdown files in /content/blog. Each has YAML frontmatter:
//   title, description, date (YYYY-MM-DD), author, tags (list), cover (emoji).
// Pages are statically generated at build time, so these fs reads never run in
// the browser — they bake into static HTML.

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostFaq = { q: string; a: string };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO YYYY-MM-DD
  author: string;
  tags: string[];
  cover: string; // emoji shown on cards / header
  image?: string; // optional thumbnail image path (falls back to the emoji cover)
  faqs: PostFaq[]; // optional FAQ (frontmatter) — rendered + emitted as FAQPage schema
  readingTime: number; // minutes
};

export type Post = PostMeta & { html: string };

function readingTimeOf(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function fileToMeta(fileName: string): PostMeta {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    author: String(data.author ?? "CVify AI Team"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: String(data.cover ?? "📝"),
    image: data.image ? String(data.image) : undefined,
    faqs: Array.isArray(data.faqs)
      ? (data.faqs as { q?: unknown; a?: unknown }[])
          .filter((f) => f && f.q && f.a)
          .map((f) => ({ q: String(f.q), a: String(f.a) }))
      : [],
    readingTime: readingTimeOf(content),
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(fileToMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const meta = fileToMeta(`${slug}.md`);
  const { content } = matter(fs.readFileSync(file, "utf8"));
  resetHeadings(); // keep slug counter clean per post so ids match the TOC
  const html = marked.parse(content, { async: false }) as string;
  return { ...meta, html };
}

export { formatDate } from "./blogFormat";
