import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { CtaBand } from "../components/CtaBand";
import { getAllPosts, formatDate, type PostMeta } from "../lib/blog";

export const metadata: Metadata = {
  title: "Blog — CVify AI | CV & Resume Tips, Guides & Examples",
  description:
    "Practical CV and resume advice from CVify AI: how to write a CV, CV vs resume, beating applicant tracking systems (ATS), formatting, and real examples to help you land more interviews.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Blog"
          title="CV & resume tips, guides & examples"
          subtitle="Practical, up-to-date advice to help you write a stronger CV and land more interviews."
        />
        <section className="mx-auto max-w-[1920px] site-px py-20">
          {posts.length === 0 ? (
            <p className="text-center text-zinc-500">New articles are on the way — check back soon.</p>
          ) : (
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          )}
        </section>
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}

function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition-colors group-hover:bg-blue-100" aria-hidden>
        {post.cover}
      </div>
      {post.tags[0] && (
        <span className="mt-4 inline-block w-fit rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
          {post.tags[0]}
        </span>
      )}
      <h2 className="mt-3 text-lg font-semibold leading-snug text-zinc-900 group-hover:text-blue-700">{post.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">{post.description}</p>
      <p className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
        <span>{formatDate(post.date)}</span>
        <span aria-hidden>·</span>
        <span>{post.readingTime} min read</span>
      </p>
    </Link>
  );
}
