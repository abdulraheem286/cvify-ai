import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { CtaBand } from "../../components/CtaBand";
import { AuthorAvatar } from "../../components/blog/AuthorAvatar";
import { SidebarAuthor } from "../../components/blog/SidebarAuthor";
import { RecentPosts } from "../../components/blog/RecentPosts";
import { ShareButtons } from "../../components/blog/ShareButtons";
import { LikeProvider, LikeButton } from "../../components/blog/BlogLikes";
import { BlogComments } from "../../components/blog/BlogComments";
import { PostFaqSection } from "../../components/blog/PostFaq";
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
  const recent = getAllPosts().filter((p) => p.slug !== slug).slice(0, 3);
  const url = `${BASE}/blog/${post.slug}`;

  const graph: Record<string, unknown>[] = [
    {
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
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="flex-1">
        <LikeProvider slug={post.slug}>
          {/* Article header */}
          <header className="bg-gradient-to-b from-blue-50/80 via-white to-white">
            <div className="mx-auto max-w-3xl site-px pb-6 pt-8">
              <Link href="/blog" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
                ← Back to all articles
              </Link>
              <div className="mt-5 text-center">
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
                <div className="mt-5 flex items-center justify-center gap-3 text-sm text-zinc-500">
                  <AuthorAvatar author={author} size={36} />
                  <span className="font-medium text-zinc-700">{author.name}</span>
                  <span aria-hidden>·</span>
                  <span>{formatDate(post.date)}</span>
                  <span aria-hidden>·</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <div className="mt-5 flex justify-center">
                  <LikeButton variant="inline" />
                </div>
              </div>
            </div>
          </header>

          {/* Hero image */}
          {post.image && (
            <div className="mx-auto max-w-4xl site-px pt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={post.title} className="aspect-[16/9] w-full rounded-2xl border border-zinc-200 object-cover shadow-sm" />
            </div>
          )}

          {/* Two-column body: article + sticky sidebar */}
          <div className="mx-auto max-w-6xl site-px py-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
              {/* LEFT — article, share, likes, comments */}
              <div className="min-w-0">
                <div
                  className="prose prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:font-medium prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-zinc-900 prose-img:rounded-xl prose-img:border prose-img:border-zinc-200"
                  dangerouslySetInnerHTML={{ __html: post.html }}
                />

                <PostFaqSection faqs={post.faqs} />

                <ShareButtons url={url} title={post.title} />
                <LikeButton variant="block" />

                <div className="mt-10">
                  <Link href="/blog" className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
                    ← Back to all articles
                  </Link>
                </div>

                <BlogComments slug={post.slug} />
              </div>

              {/* RIGHT — sticky sidebar: author info + recent posts */}
              <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
                <SidebarAuthor author={author} />
                <RecentPosts posts={recent} />
              </aside>
            </div>
          </div>
        </LikeProvider>

        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
