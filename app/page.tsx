import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { Reveal } from "./components/Reveal";
import { ScaledPreview } from "./components/ScaledPreview";
import { TemplateShowcase } from "./components/TemplateShowcase";
import { ModernTemplate } from "./templates/ModernTemplate";
import { SidebarTemplate } from "./templates/SidebarTemplate";
import {
  IconSparkles,
  IconText,
  IconGlobe,
  IconTools,
  IconGraduation,
  IconDownload,
  IconHistory,
} from "./components/icons";
import type { CVResult } from "./types";

export const metadata: Metadata = {
  title: "CVify AI — Free AI Resume & CV Builder | Build a Pro CV in Minutes",
  description:
    "CVify AI is a free AI resume builder. Turn rough notes into a polished, professional CV in minutes, choose from clean templates, edit everything, and download a PDF instantly. No sign-up needed.",
  alternates: { canonical: "/" },
};

const faqs = [
  {
    q: "Is CVify AI free?",
    a: "Yes. You can create a CV, generate professional content with AI, edit it, and download a PDF without paying or entering a credit card.",
  },
  {
    q: "Can I edit the AI-generated content?",
    a: "Absolutely. The AI gives you a starting point, but every word is yours to change. Add anything you want, rewrite sections, or remove them — you have full control in the editor.",
  },
  {
    q: "Will my CV work with applicant tracking systems (ATS)?",
    a: "CVify AI uses clean, single-column formatting and standard section headings, which read clearly both in most applicant tracking systems and for human recruiters.",
  },
  {
    q: "How do I export my resume?",
    a: "One click. Download your finished CV as a standard PDF — the format employers and job boards expect — ready to send or upload anywhere.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is needed to build and download a CV. You can start straight away.",
  },
  {
    q: "Will I lose my work if I close the tab?",
    a: "No. The editor auto-saves your progress in your browser as you type. When you come back, CVify AI offers to restore your draft so you can continue right where you left off — no account required.",
  },
  {
    q: "Can I make more than one CV?",
    a: "Yes. Create as many CVs as you like and tailor each one to a specific job, industry, or template.",
  },
  {
    q: "Can I change the colors and fonts?",
    a: "Yes. A customization panel lets you set a primary and secondary color, the background, and separate fonts for headings and body text — or pick a ready-made preset. Any look works with any layout.",
  },
  {
    q: "Can I add my own sections like Projects or Awards?",
    a: "Yes. Add custom sections and name them anything — Projects, Awards, Volunteering, Publications — each with its own items. They render in your chosen template's style.",
  },
  {
    q: "Is the PDF readable by applicant tracking systems?",
    a: "Yes. CVify AI generates a real text-based PDF (not an image), so the text is selectable and searchable, and applicant tracking systems can parse it. Clean single-column structure and standard headings help too.",
  },
  {
    q: "What's the difference between a resume and a CV?",
    a: "In the US, a resume is a short one-to-two page summary tailored to a job, while a CV is longer and more detailed. Elsewhere the terms are often used interchangeably. CVify AI works for both — keep it concise for a resume, or add custom sections for a fuller CV.",
  },
  {
    q: "How long should my resume be?",
    a: "For most people, one page is ideal — two if you have many years of relevant experience. Focus on recent, relevant achievements and trim older or unrelated roles.",
  },
];

const sampleCv: CVResult = {
  fullName: "Sarah Johnson",
  jobTitle: "Senior Product Designer",
  contact: {
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    location: "London, UK",
    website: "sarahjohnson.design",
  },
  summary:
    "Product designer with 6+ years crafting intuitive, user-centered digital experiences for fast-growing startups. Passionate about clean design systems and measurable impact.",
  experience: [
    {
      role: "Senior Product Designer",
      company: "DesignCo",
      period: "2021 — Present",
      bullets: [
        "Led the redesign of the core product, lifting user activation by 32%.",
        "Built and maintained the company design system used by 12 engineers.",
      ],
    },
    {
      role: "Product Designer",
      company: "StartupX",
      period: "2018 — 2021",
      bullets: [
        "Shipped 20+ features from research through high-fidelity design.",
        "Ran usability tests that cut support tickets by 25%.",
      ],
    },
  ],
  education: [
    { degree: "BA, Interaction Design", institution: "London College of Communication", period: "2014 — 2018" },
  ],
  skills: ["Figma", "Prototyping", "Design Systems", "UX Research", "UI Design"],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
  ],
  certificates: [{ name: "Google UX Design Certificate", issuer: "Coursera", year: "2022" }],
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
        <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-blue-50/80 via-white to-white">
          {/* soft ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.18),transparent)] blur-2xl"
          />
          <div className="relative mx-auto grid max-w-[1920px] items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <Reveal stagger>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
                Free AI resume builder
              </span>
              <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                Build your resume in minutes with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-zinc-600">
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
                <TrustItem>No sign-up needed</TrustItem>
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
                <ScaledPreview>
                  <ModernTemplate cv={sampleCv} domId="hero-preview" />
                </ScaledPreview>
              </div>
            </div>
          </div>
        </section>

        {/* Honest highlights */}
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-[1920px] gap-4 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value="100%" label="Free to use" />
            <Stat value="18" label="Distinct templates" />
            <Stat value="AI" label="Writes & improves it" />
            <Stat value="ATS" label="Real text PDF" />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-zinc-50">
          <div className="mx-auto max-w-[1920px] px-6 py-20">
            <SectionHead
              eyebrow="Features"
              title="Everything you need to land the interview"
              subtitle="CVify AI handles the hard parts — strong wording, clean structure, and professional design."
            />
            <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Feature icon={<IconSparkles />} title="AI that writes & improves" text="Generate a summary, rewrite bullet points into achievements, and suggest skills — right inside the editor." />
              <Feature icon={<IconGlobe />} title="18 distinct templates" text="Eighteen genuinely different layouts across professional, minimal, and creative styles." />
              <Feature icon={<IconTools />} title="Full customization" text="Set your colors, background, and heading and body fonts — or pick a one-click preset. Any look, any layout." />
              <Feature icon={<IconText />} title="Custom sections" text="Add your own sections — Projects, Awards, Volunteering, Publications — and reorder everything." />
              <Feature icon={<IconDownload />} title="ATS-ready text PDF" text="Download a real, selectable text PDF that applicant tracking systems can actually read." />
              <Feature icon={<IconHistory />} title="Never lose your work" text="The editor auto-saves as you type. Close the tab and come back — pick up right where you left off." />
            </Reveal>
          </div>
        </section>

        {/* Templates showcase — single tabbed preview */}
        <section id="templates" className="border-y border-zinc-200 bg-gradient-to-b from-white to-zinc-50">
          <div className="mx-auto max-w-[1920px] px-6 py-20">
            <SectionHead
              eyebrow="Templates"
              title="18 templates across professional, minimal & creative"
              subtitle="Switch styles anytime without losing your content, then recolor and change fonts to make it yours."
            />
            <TemplateShowcase cv={sampleCv} />
            <div className="mt-12 text-center">
              <Link href="/build" className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700">
                Start with a template →
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto max-w-[1920px] px-6 py-20">
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
          <div className="mx-auto grid max-w-[1920px] items-center gap-12 px-6 py-20 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">AI draft</p>
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
              <Link href="/build/ai" className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                Try the AI builder →
              </Link>
            </div>
            <div className="relative w-full">
              <div aria-hidden className="pointer-events-none absolute inset-x-6 inset-y-8 rounded-[2rem] bg-gradient-to-tr from-blue-400/15 to-indigo-400/15 blur-2xl" />
              <div className="relative">
                <ScaledPreview>
                  <ModernTemplate cv={sampleCv} domId="row-modern" />
                </ScaledPreview>
              </div>
            </div>
          </div>
        </section>

        {/* Feature row 2 — edit & switch */}
        <section className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid max-w-[1920px] items-center gap-12 px-6 py-20 lg:grid-cols-2">
            <div className="relative order-2 w-full lg:order-1">
              <div aria-hidden className="pointer-events-none absolute inset-x-6 inset-y-8 rounded-[2rem] bg-gradient-to-tr from-indigo-400/15 to-blue-400/15 blur-2xl" />
              <div className="relative">
                <ScaledPreview>
                  <SidebarTemplate cv={sampleCv} domId="row-sidebar" />
                </ScaledPreview>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Edit live</p>
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
              <Link href="/build/manual" className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                Build it manually →
              </Link>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-[1920px] px-6 py-20">
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
          <div className="mx-auto max-w-[1920px] px-6 py-20">
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
        <section id="faq" className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <SectionHead eyebrow="FAQ" title="Frequently asked questions" subtitle="Answers to questions about building, optimizing, and exporting your resume." />
            <div className="mt-12 divide-y divide-zinc-200 border-y border-zinc-200">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-zinc-900">
                    {f.q}
                    <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[1920px] px-6 pb-20">
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

function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-zinc-600">{subtitle}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 text-center shadow-sm transition-colors hover:border-blue-200">
      <p className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
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
