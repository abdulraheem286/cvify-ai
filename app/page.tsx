import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { Reveal } from "./components/Reveal";
import { ScaledPreview } from "./components/ScaledPreview";
import { SectionHead } from "./components/SectionHead";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { TemplatesSection } from "./components/sections/TemplatesSection";
import { FaqSection } from "./components/sections/FaqSection";
import { ModernTemplate } from "./templates/ModernTemplate";
import { SidebarTemplate } from "./templates/SidebarTemplate";
import { faqs } from "./lib/faqs";
import { SAMPLE_CV as sampleCv } from "./lib/sampleCv";

export const metadata: Metadata = {
  title: "CVify AI — Free AI Resume & CV Builder | Build a Pro CV in Minutes",
  description:
    "CVify AI is a free AI resume builder. Turn rough notes into a polished, professional CV in minutes, choose from clean templates, edit everything, and download a PDF instantly — all saved to your free account.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "CVify AI",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.cvifyai.com",
        description:
          "Free AI resume builder that turns rough notes into a polished, professional CV with beautiful templates and instant PDF download.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white">
          {/* soft ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.18),transparent)] blur-2xl"
          />
          <div className="relative mx-auto grid max-w-[1920px] items-center gap-10 site-px py-12 lg:grid-cols-2 lg:py-16">
            <Reveal stagger>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
                Free AI resume builder
              </span>
              <h1 className="mt-4 max-w-xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
                Build your resume in minutes with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="mt-4 max-w-md text-base text-zinc-600">
                CVify AI turns simple notes into a professional resume. Edit every detail, choose from
                18 templates, and land more interviews.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/build" className="rounded-xl bg-blue-600 px-6 py-3 text-center text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25">
                  Create my CV free →
                </Link>
                <a href="#templates" className="rounded-xl border border-zinc-300 bg-white px-6 py-3 text-center text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                  Browse templates
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
                <TrustItem>Free forever</TrustItem>
                <TrustItem>18 templates</TrustItem>
                <TrustItem>ATS-ready PDF</TrustItem>
              </div>
            </Reveal>

            <div className="relative w-full">
              {/* glow behind the document */}
              <div
                aria-hidden
                className="absolute inset-x-4 inset-y-8 rounded-[2rem] bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 blur-2xl"
              />
              <div className="relative rotate-1 transition-transform duration-300 hover:rotate-0">
                <ScaledPreview maxHeight={500} capClassName="max-h-[78vh]">
                  <ModernTemplate cv={sampleCv} domId="hero-preview" />
                </ScaledPreview>
              </div>
            </div>
          </div>
        </section>

        {/* Honest highlights */}
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-[1920px] gap-5 site-px py-14 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value="100%" label="Free to use" />
            <Stat value="18" label="Distinct templates" />
            <Stat value="AI" label="Writes & improves it" />
            <Stat value="ATS" label="Real text PDF" />
          </div>
        </section>

        {/* Features */}
        <FeaturesSection />

        {/* Templates showcase — single tabbed preview */}
        <TemplatesSection cv={sampleCv} />

        {/* How it works */}
        <section id="how" className="bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto max-w-[1920px] site-px py-20">
            <SectionHead eyebrow="Process" title="Four simple steps" subtitle="From a blank page to a polished resume in minutes." />
            <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Step n={1} title="Add your info" text="Paste rough notes or share a few details about your work history." />
              <Step n={2} title="Generate or type" text="Let AI write a first draft, or fill the editor in yourself." />
              <Step n={3} title="Edit & style" text="Refine the wording and pick a template — see it update live." />
              <Step n={4} title="Download & apply" text="Export a clean PDF and start landing interviews." />
            </Reveal>
          </div>
        </section>

        {/* Feature row 1 — AI draft */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-[1920px] items-center gap-12 site-px py-20 lg:grid-cols-2">
            <div className="max-w-xl">
              <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">AI draft</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                A professional first draft in seconds
              </h2>
              <p className="mt-4 text-zinc-600">
                Paste your old CV or jot down rough notes. CVify AI writes a compelling summary and
                turns your experience into clear, achievement-focused bullet points.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-700">
                <Check>Strong, recruiter-ready wording</Check>
                <Check>Only uses the facts you provide</Check>
                <Check>Editable down to every word</Check>
              </ul>
              <Link href="/build/ai" className="mt-8 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                Try the AI builder →
              </Link>
            </div>
            <div className="relative w-full">
              <div aria-hidden className="pointer-events-none absolute inset-x-6 inset-y-8 rounded-[2rem] bg-gradient-to-tr from-blue-400/15 to-indigo-400/15 blur-2xl" />
              <div className="relative">
                <ScaledPreview maxHeight={520} capClassName="max-h-[78vh]">
                  <ModernTemplate cv={sampleCv} domId="row-modern" />
                </ScaledPreview>
              </div>
            </div>
          </div>
        </section>

        {/* Feature row 2 — edit & switch */}
        <section className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid max-w-[1920px] items-center gap-12 site-px py-20 lg:grid-cols-2">
            <div className="relative order-2 w-full lg:order-1">
              <div aria-hidden className="pointer-events-none absolute inset-x-6 inset-y-8 rounded-[2rem] bg-gradient-to-tr from-indigo-400/15 to-blue-400/15 blur-2xl" />
              <div className="relative">
                <ScaledPreview maxHeight={520} capClassName="max-h-[78vh]">
                  <SidebarTemplate cv={sampleCv} domId="row-sidebar" />
                </ScaledPreview>
              </div>
            </div>
            <div className="order-1 max-w-xl lg:order-2 lg:justify-self-end">
              <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">Edit live</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Edit everything, switch styles instantly
              </h2>
              <p className="mt-4 text-zinc-600">
                Fine-tune every section in the editor, then flip between 18 templates and recolor or
                restyle in a click — your content stays exactly where it is.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-700">
                <Check>Add, remove, and reorder any section</Check>
                <Check>Live preview of the finished CV</Check>
                <Check>18 templates plus full color and font control</Check>
              </ul>
              <Link href="/build/manual" className="mt-8 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                Build it manually →
              </Link>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-[1920px] site-px py-20">
            <SectionHead
              eyebrow="Who it's for"
              title="Built for every kind of job seeker"
              subtitle="Whatever stage you're at, CVify AI gives you a polished CV tailored to the role."
            />
            <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <UseCase title="Students & graduates" text="Land your first role with a clean CV that highlights projects, education, and skills over years of experience." />
              <UseCase title="Career changers" text="Reframe your background around transferable skills, and let AI sharpen the wording for a new field." />
              <UseCase title="Experienced professionals" text="Turn a long history into a focused, achievement-led resume that fits a page or two." />
              <UseCase title="Freelancers & creatives" text="Show projects, clients, and outcomes with custom sections made for portfolio-style work." />
            </Reveal>
          </div>
        </section>

        {/* Resume writing tips */}
        <section id="tips" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-[1920px] site-px py-20">
            <SectionHead
              eyebrow="Resume tips"
              title="How to write a resume that gets interviews"
              subtitle="Simple, proven principles — and CVify AI helps you apply each one."
            />
            <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Tip n="01" title="Lead with achievements" text="Replace duties with results — 'Grew sign-ups 30%' beats 'responsible for marketing.' The AI rewrites your bullets this way." />
              <Tip n="02" title="Tailor it to each job" text="Mirror the language of the job description and put the most relevant experience first. Make a fresh copy per role in seconds." />
              <Tip n="03" title="Keep it scannable" text="Clear headings, short bullets, consistent dates. Recruiters skim in seconds, so single-column layouts read best." />
              <Tip n="04" title="Quantify everything" text="Numbers stand out: people managed, money saved, percent improved, deadlines hit. Add them wherever you honestly can." />
              <Tip n="05" title="Make it ATS-safe" text="Avoid text trapped in images or complex tables. CVify AI exports a real text PDF that tracking systems can read." />
              <Tip n="06" title="Proofread and trim" text="Cut filler, fix typos, and keep it to one or two pages. A tight resume signals clear thinking." />
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <FaqSection />

        {/* CTA */}
        <section className="mx-auto max-w-[1920px] site-px pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-16 text-center text-white shadow-xl shadow-blue-600/20">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-indigo-300/20 blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start building your resume today</h2>
              <p className="mx-auto mt-4 max-w-md text-blue-100">
                Join job seekers who land interviews with CVify AI — free, with a clean PDF in minutes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/build" className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50">
                  Build my resume →
                </Link>
                <a href="#templates" className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
                  Browse templates
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <p className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">{value}</p>
      <p className="mt-2 text-base font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function UseCase({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}

function Tip({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5">
      <p className="text-sm font-bold text-blue-600">{n}</p>
      <h3 className="mt-2 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-bold text-white shadow-md shadow-blue-600/20">
        {n}
      </div>
      <h3 className="mt-4 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}

function TrustItem({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">✓</span>
      {children}
    </span>
  );
}

function Check({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
        ✓
      </span>
      {children}
    </li>
  );
}
