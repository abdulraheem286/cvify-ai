import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader } from "../components/AppHeader";
import { AppFooter } from "../components/AppFooter";
import { Reveal } from "../components/Reveal";
import { RequireAuth } from "../components/RequireAuth";

// On-page SEO for the build chooser.
export const metadata: Metadata = {
  title: "Build Your CV — AI, Manual, or Import (Free)",
  description:
    "Choose how to build your CV with CVify AI: let AI write it from your notes, fill in every section yourself, or import an existing CV (PDF or paste). All free, with an instant PDF download.",
  alternates: { canonical: "/build" },
};

export default async function BuildChooser({ searchParams }: { searchParams: Promise<{ tpl?: string }> }) {
  const { tpl } = await searchParams;
  // Carry a chosen saved template into whichever build method the user picks.
  const q = tpl ? `?tpl=${encodeURIComponent(tpl)}` : "";
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <AppHeader />

      <main className="flex flex-1 flex-col items-center justify-center site-px py-20">
        <div className="w-full max-w-6xl text-center">
          <RequireAuth>
          <Reveal stagger>
            <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Get started
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              How do you want to build your CV?
            </h1>
            <p className="mt-3 text-zinc-600">
              All three are free and end with a clean PDF download.
            </p>
          </Reveal>

          <Reveal stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={`/build/ai${q}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5"
            >
              <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Popular
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
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
              href={`/build/wizard${q}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5"
            >
              <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Easiest
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
                <IconSteps />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-zinc-900">Guided wizard</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                New to CVs? We walk you through it one step at a time, then you pick a
                template.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Start step by step →
              </span>
            </Link>

            <Link
              href={`/build/manual${q}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-7 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
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

            <Link
              href={`/build/import${q}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-7 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
                <IconUpload />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-zinc-900">Import existing CV</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Upload a PDF or paste your current CV. AI reads it into the editor so you can restyle
                and improve it.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                Import my CV →
              </span>
            </Link>
          </Reveal>
          </RequireAuth>
        </div>
      </main>
      <AppFooter />
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
function IconUpload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15V4M8 8l4-4 4 4M5 20h14" />
    </svg>
  );
}
function IconSteps() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h6M4 12h6M4 18h6" />
      <path d="M15 5l2 2 3-3" />
      <path d="M15 11l2 2 3-3" />
      <path d="M15 17l2 2 3-3" />
    </svg>
  );
}
