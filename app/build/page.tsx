import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Reveal } from "../components/Reveal";

// On-page SEO for the build chooser.
export const metadata: Metadata = {
  title: "Build Your CV — Choose AI or Manual (Free)",
  description:
    "Choose how to build your CV with CVify AI: let AI write it from your notes, or fill in every section yourself. Both are free and end with an instant PDF download.",
  alternates: { canonical: "/build" },
};

export default function BuildChooser() {
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-3xl text-center">
          <Reveal stagger>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              How do you want to build your CV?
            </h1>
            <p className="mt-3 text-zinc-600">
              Both ways are free and end with a clean PDF download.
            </p>
          </Reveal>

          <Reveal stagger delay={0.15} className="mt-12 grid gap-6 sm:grid-cols-2">
            <Link
              href="/build/ai"
              className="group rounded-2xl border border-zinc-200 bg-white p-8 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <IconSparkles />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-zinc-900">Build with AI</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Paste rough notes or an old CV. AI writes the wording and formats
                everything for you in seconds.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Start with AI →
              </span>
            </Link>

            <Link
              href="/build/manual"
              className="group rounded-2xl border border-zinc-200 bg-white p-8 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <IconPen />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-zinc-900">Build manually</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Fill in each section yourself for full control over every word,
                then preview and download.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Start manually →
              </span>
            </Link>
          </Reveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function IconSparkles() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 10.4 8.4a2 2 0 0 1-2 1.4L3 12l5.4 1.6a2 2 0 0 1 1.4 2L12 21l1.6-5.4a2 2 0 0 1 2-1.4L21 12l-5.4-1.6a2 2 0 0 1-1.4-2L12 3Z" />
      <path d="M19 4v3M20.5 5.5h-3" />
    </svg>
  );
}
function IconPen() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
