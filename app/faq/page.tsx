import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { CtaBand } from "../components/CtaBand";
import { FaqSection } from "../components/sections/FaqSection";
import { faqs } from "../lib/faqs";

export const metadata: Metadata = {
  title: "FAQ — CVify AI | Free AI Resume & CV Builder",
  description:
    "Answers to common questions about CVify AI: is it free, ATS compatibility, editing AI content, PDF export, accounts, multiple CVs, customization, and the difference between a CV and a resume.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Answers to questions about building, optimizing, and exporting your resume with CVify AI."
        />
        <FaqSection showHead={false} />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
