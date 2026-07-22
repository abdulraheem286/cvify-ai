import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { CtaBand } from "../components/CtaBand";
import { BlogListing } from "../components/blog/BlogListing";
import { getAllPosts } from "../lib/blog";

export const metadata: Metadata = {
  title: "Blog — CVify AI | CV and Resume Tips, Guides and Examples",
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
          eyebrow="Blogs"
          title="CV and resume tips, guides and examples"
          subtitle="Practical, up-to-date advice to help you write a stronger CV and land more interviews."
        />
        <section className="mx-auto max-w-[1920px] site-px pb-20 pt-10">
          {posts.length === 0 ? (
            <p className="text-center text-zinc-500">New articles are on the way — check back soon.</p>
          ) : (
            <BlogListing posts={posts} />
          )}
        </section>
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
