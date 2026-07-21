import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { CtaBand } from "../../components/CtaBand";
import { getAllSlugs, getPostBySlug, formatDate } from "../../lib/blog";

const BASE = "https://www.cvifyai.com";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found — CVify AI" };
  return {
    title: `${post.title} — CVify AI`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${BASE}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "CVify AI", url: BASE },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/blog/${post.slug}` },
    keywords: post.tags.join(", "),
  };

  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="flex-1">
        {/* Article header */}
        <header className="bg-gradient-to-b from-blue-50/80 via-white to-white">
          <div className="mx-auto max-w-3xl site-px py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl" aria-hidden>
              {post.cover}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">{post.title}</h1>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-500">
              <span>{post.author}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(post.date)}</span>
              <span aria-hidden>·</span>
              <span>{post.readingTime} min read</span>
            </p>
          </div>
        </header>

        {/* Article body */}
        <article className="mx-auto max-w-3xl site-px py-14">
          <div
            className="prose prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:font-medium prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-zinc-900"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <div className="mt-12 border-t border-zinc-200 pt-8">
            <Link href="/blog" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
              ← Back to all articles
            </Link>
          </div>
        </article>

        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
