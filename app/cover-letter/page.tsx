import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { CoverLetterClient } from "./CoverLetterClient";

export const metadata: Metadata = {
  title: "Free Cover Letter Generator — CVify AI",
  description:
    "Write a tailored, professional cover letter in seconds. Paste the job and your experience — or start from a saved CV — and CVify AI drafts it. Free, editable, and download as PDF.",
  alternates: { canonical: "/cover-letter" },
};

export default function CoverLetterPage() {
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Cover Letter"
          title="Free cover letter generator"
          subtitle="Paste the job and a little about you — or start from a saved CV — and CVify AI writes a tailored cover letter you can edit and download."
        />
        <CoverLetterClient />
      </main>
      <SiteFooter />
    </div>
  );
}
