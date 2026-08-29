import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { Reveal } from "./components/Reveal";
import { ScaledPreview } from "./components/ScaledPreview";
import { SectionHead } from "./components/SectionHead";
import { HeroShell } from "./components/HeroShell";
import { SectionShell } from "./components/SectionShell";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { TemplatesSection } from "./components/sections/TemplatesSection";
import { FaqSection } from "./components/sections/FaqSection";
import { ModernTemplate } from "./templates/ModernTemplate";
import { SidebarTemplate } from "./templates/SidebarTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { IconSparkles, IconText, IconTools, IconDownload } from "./components/icons";
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
        <HeroShell className="pt-14 sm:pt-20">
          <Reveal stagger className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm ring-1 ring-inset ring-blue-200 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
              </span>
              Free AI resume builder
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.01em] text-zinc-900 sm:text-5xl lg:text-6xl">
              Turn Rough Notes Into a <span className="text-blue-600">Job-Ready CV</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              CVify AI turns a few lines about your experience into clear, achievement-focused bullet
              points and a clean, ATS-ready PDF — free, in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/build"
                className="rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Create my CV — it&rsquo;s free
              </Link>
              <Link
                href="/templates"
                className="rounded-full bg-white px-7 py-3.5 text-base font-semibold text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 transition-colors hover:bg-zinc-50"
              >
                Browse templates
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
              <TrustItem>Free forever</TrustItem>
              <TrustItem>No credit card</TrustItem>
              <TrustItem>ATS-ready PDF</TrustItem>
            </div>
          </Reveal>

          {/* Floating CV previews, clipped by the card */}
          <div className="mx-auto mt-14 flex h-[240px] max-w-5xl items-start justify-center gap-5 sm:h-[300px] lg:h-[340px]">
            <div className="hidden w-[27%] translate-y-8 overflow-hidden rounded-t-xl bg-white shadow-2xl shadow-blue-900/15 ring-1 ring-zinc-200/70 lg:block">
              <ScaledPreview maxHeight={420}>
                <ExecutiveTemplate cv={sampleCv} domId="hero-left" />
              </ScaledPreview>
            </div>
            <div className="w-[74%] overflow-hidden rounded-t-xl bg-white shadow-2xl shadow-blue-900/20 ring-1 ring-zinc-200/70 sm:w-[52%] lg:w-[36%]">
              <ScaledPreview maxHeight={480}>
                <ModernTemplate cv={sampleCv} domId="hero-preview" />
              </ScaledPreview>
            </div>
            <div className="hidden w-[27%] translate-y-8 overflow-hidden rounded-t-xl bg-white shadow-2xl shadow-blue-900/15 ring-1 ring-zinc-200/70 lg:block">
              <ScaledPreview maxHeight={420}>
                <MinimalTemplate cv={sampleCv} domId="hero-right" />
              </ScaledPreview>
            </div>
          </div>
        </HeroShell>

        {/* Highlights */}
        <section className="site-px py-3">
          <div className="mx-auto max-w-[1500px] rounded-3xl px-6 py-16 ring-1 ring-inset sm:px-10 sm:py-20 bg-zinc-50/80 ring-zinc-200/70">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-[-0.01em] sm:text-4xl">
                Everything You Need to Apply, <span className="text-blue-600">Completely Free</span>
              </h2>
              <Link
                href="/build"
                className="shrink-0 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Start building →
              </Link>
            </div>
            <Reveal stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon={<IconSparkles />} value="100%" label="Free to use" />
              <Stat icon={<IconText />} value="∞" label="CVs you can make" />
              <Stat icon={<IconTools />} value="AI" label="Writes & improves it" />
              <Stat icon={<IconDownload />} value="ATS" label="Real text PDF" />
            </Reveal>
          </div>
        </section>

        {/* Features */}
        <FeaturesSection />

        {/* Templates showcase — single tabbed preview */}
        <TemplatesSection cv={sampleCv} />

        {/* How it works */}
        <section id="how" className="site-px py-3">
          <div className="mx-auto max-w-[1500px] rounded-3xl px-6 py-16 ring-1 ring-inset sm:px-10 sm:py-20 bg-gradient-to-b from-blue-50/60 to-white ring-blue-100">
            <SectionHead split eyebrow="Process" title="Four Simple Steps" subtitle="From a blank page to a polished resume in minutes." />
            <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Step n={1} title="Add your info" text="Paste rough notes or share a few details about your work history." />
              <Step n={2} title="Generate or type" text="Let AI write a first draft, or fill the editor in yourself." />
              <Step n={3} title="Edit & style" text="Refine the wording and pick a template — see it update live." />
              <Step n={4} title="Download & apply" text="Export a clean PDF and start landing interviews." />
            </Reveal>
          </div>
        </section>

        {/* Feature row 1 — AI draft */}
        <section className="site-px py-3">
          <div className="mx-auto grid items-center gap-12 lg:grid-cols-2 lg:gap-20 max-w-[1500px] rounded-3xl px-6 py-16 ring-1 ring-inset sm:px-10 sm:py-20 bg-zinc-50/80 ring-zinc-200/70">
            <div className="max-w-xl">
              <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">AI draft</span>
              <h2 className="mt-4 text-3xl font-bold leading-[1.15] tracking-[-0.01em] sm:text-4xl">
                A Professional First Draft in <span className="text-blue-600">Seconds</span>
              </h2>
              <p className="mt-4 leading-relaxed text-zinc-600">
                Paste your old CV or jot down rough notes. CVify AI writes a compelling summary and
                turns your experience into clear, achievement-focused bullet points.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Chip>Recruiter-ready wording</Chip>
                <Chip>Only your real facts</Chip>
                <Chip>Editable to the word</Chip>
              </div>
              <Link href="/build/ai" className="mt-8 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                Try the AI builder →
              </Link>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50/60 p-5 ring-1 ring-inset ring-blue-100 sm:p-8">
              <div className="overflow-hidden rounded-xl bg-white shadow-xl shadow-blue-900/10 ring-1 ring-zinc-200/70">
                <ScaledPreview maxHeight={470} capClassName="max-h-[70vh]">
                  <ModernTemplate cv={sampleCv} domId="row-modern" />
                </ScaledPreview>
              </div>
            </div>
          </div>
        </section>

        {/* Feature row 2 — edit & switch */}
        <section className="site-px py-3">
          <div className="mx-auto grid items-center gap-12 lg:grid-cols-2 lg:gap-20 max-w-[1500px] rounded-3xl px-6 py-16 ring-1 ring-inset sm:px-10 sm:py-20 bg-zinc-50/80 ring-zinc-200/70">
            <div className="order-2 rounded-3xl bg-gradient-to-br from-indigo-50 to-sky-50/60 p-5 ring-1 ring-inset ring-indigo-100 sm:p-8 lg:order-1">
              <div className="overflow-hidden rounded-xl bg-white shadow-xl shadow-blue-900/10 ring-1 ring-zinc-200/70">
                <ScaledPreview maxHeight={470} capClassName="max-h-[70vh]">
                  <SidebarTemplate cv={sampleCv} domId="row-sidebar" />
                </ScaledPreview>
              </div>
            </div>
            <div className="order-1 max-w-xl lg:order-2">
              <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">Edit live</span>
              <h2 className="mt-4 text-3xl font-bold leading-[1.15] tracking-[-0.01em] sm:text-4xl">
                Edit Everything, Switch Styles <span className="text-blue-600">Instantly</span>
              </h2>
              <p className="mt-4 leading-relaxed text-zinc-600">
                Fine-tune every section in the editor, then flip between templates and recolor or
                restyle in a click — your content stays exactly where it is.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Chip>Reorder any section</Chip>
                <Chip>Live preview</Chip>
                <Chip>Colors &amp; fonts</Chip>
                <Chip>Custom sections</Chip>
              </div>
              <Link href="/build/manual" className="mt-8 inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                Build it manually →
              </Link>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="site-px py-3">
          <div className="mx-auto max-w-[1500px] rounded-3xl px-6 py-16 ring-1 ring-inset sm:px-10 sm:py-20 bg-gradient-to-b from-blue-50/60 to-white ring-blue-100">
            <SectionHead
              split
              eyebrow="Who it's for"
              title="Built for Every Kind of Job Seeker"
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
        <section id="tips" className="site-px py-3">
          <div className="mx-auto max-w-[1500px] rounded-3xl px-6 py-16 ring-1 ring-inset sm:px-10 sm:py-20 bg-zinc-50/80 ring-zinc-200/70">
            <SectionHead
              split
              eyebrow="Resume tips"
              title="How to Write a Resume That Gets Interviews"
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
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 px-6 py-20 text-center text-white shadow-xl shadow-blue-600/20">
            <div>
              <h2 className="text-3xl font-bold tracking-[-0.01em] sm:text-4xl">Start Building Your Resume Today</h2>
              <p className="mx-auto mt-4 max-w-md text-blue-100">
                Join job seekers who land interviews with CVify AI — free, with a clean PDF in minutes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/build" className="rounded-full bg-white px-7 py-3.5 font-semibold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50">
                  Build my resume →
                </Link>
                <a href="#templates" className="rounded-full px-7 py-3.5 font-semibold text-white ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/10">
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

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-6 ring-1 ring-inset ring-zinc-200/80 transition-colors hover:bg-white hover:ring-blue-200">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
        {icon}
      </div>
      <p className="mt-5 text-4xl font-bold tracking-[-0.01em] text-zinc-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function UseCase({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t-2 border-zinc-200 pt-5 transition-colors hover:border-blue-500">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}

function Tip({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="flex gap-5">
      <span className="text-2xl font-bold tabular-nums text-blue-200">{n}</span>
      <div>
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
      </div>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {n}
        </span>
        <span aria-hidden className="hidden h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent lg:block" />
      </div>
      <h3 className="mt-5 font-semibold text-zinc-900">{title}</h3>
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

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-200">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">✓</span>
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
