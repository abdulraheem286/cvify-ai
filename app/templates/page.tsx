import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { CtaBand } from "../components/CtaBand";
import { TemplatesSection } from "../components/sections/TemplatesSection";
import { SAMPLE_CV as sampleCv } from "../lib/sampleCv";

export const metadata: Metadata = {
  title: "CV & Resume Templates — CVify AI | 18 Free Templates",
  description:
    "Browse 18 free, professionally designed CV and resume templates — professional, minimal, and creative styles. Switch layouts anytime without losing your content, then recolor and change fonts to make it yours.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Templates"
          title="18 CV & resume templates, free"
          subtitle="Professional, minimal, and creative layouts. Switch styles anytime without losing your content, then recolor and change fonts to make it yours."
        />
        <TemplatesSection cv={sampleCv} showHead={false} />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
