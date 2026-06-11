import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

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
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            How do you want to build your CV?
          </h1>
          <p className="mt-3 text-zinc-600">
            Both ways are free and end with a clean PDF download.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
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
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function IconSparkles() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
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
