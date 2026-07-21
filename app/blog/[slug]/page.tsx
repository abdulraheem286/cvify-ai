import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { CtaBand } from "../../components/CtaBand";
import { PostCard } from "../../components/blog/PostCard";
import { AuthorAvatar } from "../../components/blog/AuthorAvatar";
import { AuthorBox } from "../../components/blog/AuthorBox";
import { ShareButtons } from "../../components/blog/ShareButtons";
import { BlogLikes } from "../../components/blog/BlogLikes";
import { BlogComments } from "../../components/blog/BlogComments";
import { getAllPosts, getAllSlugs, getPostBySlug, formatDate } from "../../lib/blog";
import { getAuthor } from "../../lib/authors";

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
      images: post.image ? [{ url: `${BASE}${post.image}` }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const related = getAllPosts().filter((p) => p.slug !== slug).slice(0, 3);
  const url = `${BASE}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image ? `${BASE}${post.image}` : undefined,
    author: { "@type": "Person", name: author.name },
    publisher: { "@type": "Organization", name: "CVify AI", url: BASE },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", "),
  };

  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="flex-1">
        {/* Article header */}
        <header className="bg-gradient-to-b from-blue-50/80 via-white to-white">
          <div className="mx-auto max-w-3xl site-px pb-8 pt-14 text-center">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">{post.title}</h1>
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-zinc-500">
              <AuthorAvatar author={author} size={36} />
              <span className="font-medium text-zinc-700">{author.name}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(post.date)}</span>
              <span aria-hidden>·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </header>

        {/* Hero image */}
        {post.image && (
          <div className="mx-auto max-w-4xl site-px">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="aspect-[16/9] w-full rounded-2xl border border-zinc-200 object-cover shadow-sm" />
          </div>
        )}

        {/* Article body */}
        <article className="mx-auto max-w-3xl site-px py-12">
          <div
            className="prose prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:font-medium prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-zinc-900 prose-img:rounded-xl prose-img:border prose-img:border-zinc-200"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <ShareButtons url={url} title={post.title} />
          <BlogLikes slug={post.slug} />
          <AuthorBox author={author} />

          <div className="mt-10">
            <Link href="/blog" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
              ← Back to all articles
            </Link>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="border-t border-zinc-200 bg-zinc-50">
            <div className="mx-auto max-w-6xl site-px py-16">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Keep reading</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Comments */}
        <div className="site-px pb-6">
          <BlogComments slug={post.slug} />
        </div>

        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
