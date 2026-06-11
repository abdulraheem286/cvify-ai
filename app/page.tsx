import type { Metadata } from "next";
import Link from "next/link";

// On-page SEO for the home page.
export const metadata: Metadata = {
  title: "CVify AI — Free AI Resume & CV Builder | Build a Pro CV in Minutes",
  description:
    "CVify AI is a free AI resume builder. Turn rough notes into a polished, professional CV in minutes, pick a beautiful template, and download a clean PDF instantly. No sign-up needed to start.",
  alternates: { canonical: "/" },
};

// FAQ content — reused for the visible section AND the structured data below.
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
    <div className="flex min-h-full flex-col bg-zinc-950 text-white">
      {/* Structured data for Google + AI answer engines (GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            CVify <span className="text-emerald-400">AI</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-zinc-400 sm:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#how" className="transition-colors hover:text-white">How it works</a>
            <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
          </nav>
          <Link
            href="/build"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Create my CV
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-10rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px]"
          />
          <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
            <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Free • AI-powered • No sign-up to start
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Build a professional CV in minutes — free, with{" "}
              <span className="text-emerald-400">AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
              CVify AI turns your rough notes into a polished, recruiter-ready
              resume. Pick a beautiful template and download a clean PDF
              instantly.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/build"
                className="w-full rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 sm:w-auto"
              >
                Create my CV free →
              </Link>
              <a
                href="#how"
                className="w-full rounded-lg border border-zinc-700 px-6 py-3 text-base font-semibold text-zinc-200 transition-colors hover:border-zinc-500 sm:w-auto"
              >
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-zinc-800/80 bg-zinc-900/30">
          <div className="mx-auto grid max-w-4xl gap-6 px-6 py-8 text-center text-sm text-zinc-400 sm:grid-cols-3">
            <div>✨ Written by AI in ~10 seconds</div>
            <div>🎨 Clean, recruiter-ready templates</div>
            <div>📄 Instant PDF download</div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to land the interview
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400">
            CVify AI handles the hard parts — strong wording, clean structure,
            and professional design — so you can apply with confidence.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon="🤖"
              title="AI writing"
              text="Describe yourself in plain words and get strong, achievement-focused bullet points and a polished summary."
            />
            <Feature
              icon="✍️"
              title="Two ways to build"
              text="Let AI write it for you, or fill in every section yourself for full control — your choice."
            />
            <Feature
              icon="🎨"
              title="Beautiful templates"
              text="Clean, modern, single-column designs that look great to recruiters and read clearly in ATS."
            />
            <Feature
              icon="📄"
              title="Instant PDF"
              text="Download a print-ready PDF in one click, named and formatted exactly the way employers expect."
            />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-zinc-800/80 bg-zinc-900/30">
          <div className="mx-auto max-w-5xl px-6 py-24">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              How to make a CV with CVify AI
            </h2>
            <div className="mt-16 grid gap-10 sm:grid-cols-3">
              <Step
                n={1}
                title="Add your details"
                text="Paste your old CV or jot down your jobs, skills, and education. Rough notes are fine."
              />
              <Step
                n={2}
                title="AI polishes it"
                text="CVify AI rewrites your input into clear, professional wording and a clean, organised layout."
              />
              <Step
                n={3}
                title="Download your PDF"
                text="Preview your finished CV in a beautiful template and download a print-ready PDF instantly."
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 divide-y divide-zinc-800 border-y border-zinc-800">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-zinc-100">
                  {f.q}
                  <span className="ml-4 text-emerald-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-zinc-800/80">
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build your CV?
            </h2>
            <p className="mt-4 text-zinc-400">
              It is free, takes a few minutes, and you can download your PDF right away.
            </p>
            <Link
              href="/build"
              className="mt-8 inline-block rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              Create my CV free →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-zinc-500 sm:flex-row">
          <div>
            <span className="font-bold text-zinc-300">
              CVify <span className="text-emerald-400">AI</span>
            </span>{" "}
            — Free AI resume &amp; CV builder.
          </div>
          <nav className="flex gap-6">
            <a href="#features" className="transition-colors hover:text-zinc-300">Features</a>
            <a href="#faq" className="transition-colors hover:text-zinc-300">FAQ</a>
            <Link href="/build" className="transition-colors hover:text-zinc-300">Build a CV</Link>
          </nav>
          <div>© 2026 CVify AI</div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <div className="text-2xl">{icon}</div>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-zinc-950">
        {n}
      </div>
      <h3 className="mt-5 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
    </div>
  );
}
