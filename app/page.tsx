import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { Reveal } from "./components/Reveal";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { SidebarTemplate } from "./templates/SidebarTemplate";
import {
  IconSparkles,
  IconText,
  IconGlobe,
  IconTools,
  IconGraduation,
  IconDownload,
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
    q: "Can I make more than one CV?",
    a: "Yes. Create as many CVs as you like and tailor each one to a specific job, industry, or template.",
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
        url: "https://cvifyai.vercel.app",
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
        <section className="border-b border-zinc-200 bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <Reveal stagger>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Free AI resume builder
              </p>
              <h1 className="mt-3 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                Build your resume in minutes with <span className="text-blue-600">AI</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-zinc-600">
                CVify AI turns simple notes into a professional resume. Edit every detail, choose a
                clean template, and land more interviews.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/build" className="rounded-lg bg-blue-600 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                  Create my CV free →
                </Link>
                <a href="#templates" className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-center text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                  Browse templates
                </a>
              </div>
            </Reveal>

            <div className="flex justify-center lg:justify-end">
              <ScaledPreview scale={0.5} height={520}>
                <ModernTemplate cv={sampleCv} domId="hero-preview" />
              </ScaledPreview>
            </div>
          </div>
        </section>

        {/* Honest highlights */}
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto grid max-w-5xl gap-4 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value="100%" label="Free to use" />
            <Stat value="~10s" label="AI writes your draft" />
            <Stat value="3" label="Clean templates" />
            <Stat value="1-click" label="PDF download" />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-zinc-50">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionHead
              eyebrow="Features"
              title="Everything you need to land the interview"
              subtitle="CVify AI handles the hard parts — strong wording, clean structure, and professional design."
            />
            <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Feature icon={<IconSparkles />} title="AI writing" text="Describe yourself in plain words and get a strong summary and achievement-focused bullet points." />
              <Feature icon={<IconText />} title="Full editor" text="Every field is editable. Tweak the AI's draft or write it all yourself — your choice, your words." />
              <Feature icon={<IconTools />} title="ATS-friendly" text="Clean, single-column formatting with standard headings that reads clearly in tracking systems." />
              <Feature icon={<IconGraduation />} title="For any field" text="Students, career-changers, and senior pros — the editor adapts to your experience." />
              <Feature icon={<IconGlobe />} title="Works anywhere" text="Runs in your browser on any device. Add location, website, and contact details with ease." />
              <Feature icon={<IconDownload />} title="Instant PDF" text="Download a print-ready PDF in one click, formatted exactly the way employers expect." />
            </Reveal>
          </div>
        </section>

        {/* Templates showcase */}
        <section id="templates" className="border-y border-zinc-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionHead
              eyebrow="Templates"
              title="Choose from modern, minimal, and clean designs"
              subtitle="Switch between styles anytime without losing your content. Every template exports to a crisp PDF."
            />
            <Reveal stagger className="mt-14 grid gap-8 lg:grid-cols-3">
              <TemplateCard name="Modern" blurb="Bold accent header, single column.">
                <ModernTemplate cv={sampleCv} domId="tpl-modern" />
              </TemplateCard>
              <TemplateCard name="Minimal" blurb="Centered, monochrome, elegant.">
                <MinimalTemplate cv={sampleCv} domId="tpl-minimal" />
              </TemplateCard>
              <TemplateCard name="Sidebar" blurb="Two-column with a colour rail.">
                <SidebarTemplate cv={sampleCv} domId="tpl-sidebar" />
              </TemplateCard>
            </Reveal>
            <div className="mt-12 text-center">
              <Link href="/build" className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                Start with a template →
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="bg-blue-50">
          <div className="mx-auto max-w-6xl px-6 py-20">
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
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
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
            <div className="flex justify-center">
              <ScaledPreview scale={0.5} height={460}>
                <ModernTemplate cv={sampleCv} domId="row-modern" />
              </ScaledPreview>
            </div>
          </div>
        </section>

        {/* Feature row 2 — edit & switch */}
        <section className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
            <div className="order-2 flex justify-center lg:order-1">
              <ScaledPreview scale={0.5} height={460}>
                <SidebarTemplate cv={sampleCv} domId="row-sidebar" />
              </ScaledPreview>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Edit live</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Edit everything, switch styles instantly
              </h2>
              <p className="mt-4 text-zinc-600">
                Fine-tune every section in the editor, then flip between templates and watch your CV
                update in real time — your content stays exactly where it is.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-700">
                <Check>Add or remove jobs and education</Check>
                <Check>Live preview of the finished CV</Check>
                <Check>Three templates, one click to switch</Check>
              </ul>
              <Link href="/build/manual" className="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                Build it manually →
              </Link>
            </div>
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
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-3xl bg-blue-600 px-6 py-16 text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start building your resume today</h2>
            <p className="mx-auto mt-4 max-w-md text-blue-100">
              Join job seekers who land interviews with CVify AI — free, with a clean PDF in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/build" className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                Build my resume →
              </Link>
              <a href="#templates" className="rounded-lg border border-blue-400 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500">
                Browse templates
              </a>
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
    <div className="rounded-xl border border-zinc-200 bg-white p-5 text-center">
      <p className="text-3xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
        {n}
      </div>
      <h3 className="mt-4 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
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

// Renders a full template scaled down into a fixed-size, clipped card.
function ScaledPreview({ scale, height, children }: { scale: number; height: number; children: ReactNode }) {
  return (
    <div
      className="relative max-w-full overflow-hidden rounded-xl shadow-md ring-1 ring-zinc-200"
      style={{ width: 800 * scale, height }}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{ transform: `scale(${scale})`, width: 800 }}
      >
        {children}
      </div>
    </div>
  );
}

function TemplateCard({ name, blurb, children }: { name: string; blurb: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mx-auto">
        <ScaledPreview scale={0.46} height={460}>
          {children}
        </ScaledPreview>
      </div>
      <div className="mt-4 px-1">
        <h3 className="font-semibold text-zinc-900">{name}</h3>
        <p className="text-sm text-zinc-600">{blurb}</p>
      </div>
    </div>
  );
}
