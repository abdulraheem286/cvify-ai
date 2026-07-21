import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { CtaBand } from "../components/CtaBand";
import { FeaturesSection } from "../components/sections/FeaturesSection";

export const metadata: Metadata = {
  title: "Features — CVify AI | Free AI Resume & CV Builder",
  description:
    "See what CVify AI does: an AI that writes and improves your CV, 18 distinct templates, full color and font customization, custom sections, auto-save, and an ATS-ready text PDF — all free.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Features"
          title="Everything you need to land the interview"
          subtitle="CVify AI handles the hard parts — strong wording, clean structure, and professional design."
        />
        <FeaturesSection showHead={false} />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
