import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { CtaBand } from "../components/CtaBand";
import { AuthorAvatar } from "../components/blog/AuthorAvatar";
import { getAuthor } from "../lib/authors";

export const metadata: Metadata = {
  title: "About CVify AI — Free AI Resume & CV Builder",
  description:
    "CVify AI is a free AI resume and CV builder that helps job seekers turn rough notes into a polished, ATS-ready CV. Learn what we do and who's behind it.",
  alternates: { canonical: "/about" },
};

const CAPABILITIES = [
  "Turn short notes into a full first draft with AI — or build it yourself.",
  "Choose from professional templates and customize colors, fonts, and layout.",
  "Rewrite duties into achievement-focused bullet points, and tailor your CV to a specific job.",
  "Download a clean, text-based PDF that applicant tracking systems can read.",
  "Save your CVs to a free account and pick up editing on any device.",
  "Add custom sections — projects, awards, volunteering — and reorder everything.",
];

export default function AboutPage() {
  const founder = getAuthor("Abdul Rahim");

  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="About"
          title="About CVify AI"
          subtitle="A free tool that helps anyone write a professional, interview-ready CV — no cost, no design skills needed."
        />

        <section className="mx-auto max-w-3xl site-px pb-16 pt-10">
          <div className="space-y-14">
            {/* Intro */}
            <div className="space-y-4 text-[15px] leading-relaxed text-zinc-600">
              <p>
                Writing a good CV is hard, and most polished resume tools hide the useful parts behind a paywall. CVify AI
                exists to fix that: it turns rough notes about your experience into a clean, professional CV in minutes —
                with AI that helps you word things well — and lets you download a real, ATS-ready PDF for free.
              </p>
              <p>
                &ldquo;ATS&rdquo; stands for applicant tracking system — the software many employers use to read
                applications. A big part of what we do is making sure your CV is structured so both that software and a
                human recruiter can read it clearly.
              </p>
            </div>

            {/* What you can do */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">What you can do with CVify AI</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {CAPABILITIES.map((t) => (
                  <div key={t} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
                      ✓
                    </span>
                    <span className="text-sm leading-relaxed text-zinc-600">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Founder */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Who&rsquo;s behind it</h2>
              <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:flex-row sm:items-start">
                <AuthorAvatar author={founder} size={72} />
                <div>
                  <p className="font-semibold text-zinc-900">
                    {founder.name}
                    {founder.role && <span className="font-normal text-zinc-500"> · {founder.role}</span>}
                  </p>
                  {founder.bio && <p className="mt-2 text-sm leading-relaxed text-zinc-600">{founder.bio}</p>}
                  {(founder.linkedin || founder.email) && (
                    <div className="mt-4 flex gap-4 text-sm font-medium">
                      {founder.linkedin && (
                        <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          LinkedIn
                        </a>
                      )}
                      {founder.email && (
                        <a href={`mailto:${founder.email}`} className="text-blue-600 hover:text-blue-700">
                          Email
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Why free */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Why it&rsquo;s free</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">
                A CV shouldn&rsquo;t be a paywall between you and your next job. CVify AI is free to use; we keep it
                running through advertising and by building tools people genuinely find useful. You can read how we handle
                your data in our{" "}
                <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-700">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
