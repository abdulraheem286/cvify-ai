import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { CvDocument } from "./components/CvDocument";
import type { CVResult } from "./types";

// On-page SEO for the home page.
export const metadata: Metadata = {
  title: "CVify AI — Free AI Resume & CV Builder | Build a Pro CV in Minutes",
  description:
    "CVify AI is a free AI resume builder. Turn rough notes into a polished, professional CV in minutes, pick a beautiful template, and download a clean PDF instantly. No sign-up needed to start.",
  alternates: { canonical: "/" },
};

const faqs = [
  {
    q: "Is CVify AI free?",
    a: "Yes. CVify AI is free to use. You can create a CV, generate professional content with AI, and download a PDF without paying or entering a credit card.",
  },
  {
    q: "How does the AI resume builder work?",
    a: "You paste your rough notes or an old CV, and CVify AI rewrites them into clear, professional wording — a strong summary, achievement-focused bullet points, and a clean structure — in about ten seconds.",
  },
  {
    q: "Can I write my CV myself instead of using AI?",
    a: "Yes. Alongside the AI builder, CVify AI lets you fill in every section yourself, so you keep full control over the wording while still getting a beautifully formatted result.",
  },
  {
    q: "Will my CV work with applicant tracking systems (ATS)?",
    a: "CVify AI uses clean, single-column formatting and standard section headings, which read clearly both in most applicant tracking systems and for human recruiters.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is needed to build and download a CV. A free account is optional and simply lets you save your CVs and edit them again later.",
  },
  {
    q: "What file format do I get?",
    a: "You download your finished CV as a standard PDF — the format employers and job boards expect — ready to send or upload anywhere.",
  },
];

const sampleCv: CVResult = {
  fullName: "Sarah Johnson",
  jobTitle: "Senior Product Designer",
  contact: { email: "sarah@example.com", phone: "+1 (555) 123-4567" },
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
    {
      degree: "BA, Interaction Design",
      institution: "London College of Communication",
      period: "2014 — 2018",
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-8rem] h-[26rem] w-[40rem] -translate-x-1/2 rounded-full bg-blue-200/40 blur-[120px]"
          />
          <div className="relative mx-auto max-w-3xl px-6 pt-20 text-center sm:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Free • AI-powered • No sign-up to start
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-6xl">
              Build a professional CV in minutes — with{" "}
              <span className="text-blue-600">AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-600">
              CVify AI turns your rough notes into a polished, recruiter-ready
              resume. Pick a clean template and download a PDF instantly.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/build"
                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
              >
                Create my CV free →
              </Link>
              <a
                href="#how"
                className="w-full rounded-lg border border-zinc-300 bg-white px-6 py-3 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 sm:w-auto"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Product preview — the real CV template */}
          <div className="relative mx-auto mt-16 max-w-3xl px-6">
            <div className="max-h-[620px] overflow-hidden rounded-2xl">
              <CvDocument cv={sampleCv} />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent" />
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid max-w-4xl gap-6 px-6 py-8 text-center text-sm font-medium text-zinc-600 sm:grid-cols-3">
            <div>Written by AI in ~10 seconds</div>
            <div>Clean, recruiter-ready templates</div>
            <div>Instant PDF download</div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to land the interview
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600">
            CVify AI handles the hard parts — strong wording, clean structure,
            and professional design — so you can apply with confidence.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<IconSparkles />}
              title="AI writing"
              text="Describe yourself in plain words and get strong, achievement-focused bullet points and a polished summary."
            />
            <Feature
              icon={<IconSplit />}
              title="Two ways to build"
              text="Let AI write it for you, or fill in every section yourself for full control — your choice."
            />
            <Feature
              icon={<IconLayout />}
              title="Beautiful templates"
              text="Clean, modern designs that look great to recruiters and read clearly in applicant tracking systems."
            />
            <Feature
              icon={<IconDownload />}
              title="Instant PDF"
              text="Download a print-ready PDF in one click, formatted exactly the way employers expect."
            />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              How to make a CV with CVify AI
            </h2>
            <div className="mt-16 grid gap-10 sm:grid-cols-3">
              <Step n={1} title="Add your details" text="Paste your old CV or jot down your jobs, skills, and education. Rough notes are fine." />
              <Step n={2} title="AI polishes it" text="CVify AI rewrites your input into clear, professional wording and a clean, organised layout." />
              <Step n={3} title="Download your PDF" text="Preview your finished CV in a beautiful template and download a print-ready PDF instantly." />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
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
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl bg-blue-600 px-6 py-16 text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build your CV?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-blue-100">
              It is free, takes a few minutes, and you can download your PDF right away.
            </p>
            <Link
              href="/build"
              className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              Create my CV free →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
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
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
        {n}
      </div>
      <h3 className="mt-5 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}

/* --- Simple inline line icons (no dependency) --- */
function IconSparkles() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
    </svg>
  );
}
function IconSplit() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="7" height="16" rx="1.5" />
      <rect x="14" y="4" width="7" height="16" rx="1.5" />
    </svg>
  );
}
function IconLayout() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}
