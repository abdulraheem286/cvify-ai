import type { Metadata } from "next";
import Link from "next/link";

// On-page SEO for the build chooser.
export const metadata: Metadata = {
  title: "Build Your CV — Choose AI or Manual (Free)",
  description:
    "Choose how to build your CV with CVify AI: let AI write it from your notes, or fill in every section yourself. Both are free and end with an instant PDF download.",
  alternates: { canonical: "/build" },
};

export default function BuildChooser() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-20 text-white">
      <div className="w-full max-w-3xl text-center">
        <Link href="/" className="text-sm text-zinc-500 transition-colors hover:text-emerald-400">
          ← CVify AI home
        </Link>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          How do you want to build your CV?
        </h1>
        <p className="mt-3 text-zinc-400">Both ways are free and end with a clean PDF download.</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <Link
            href="/build/ai"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-left transition-colors hover:border-emerald-500/60"
          >
            <div className="text-3xl">🤖</div>
            <h2 className="mt-4 text-xl font-semibold">Build with AI</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Paste rough notes or an old CV. AI writes the wording and formats
              everything for you in seconds.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-emerald-400">
              Start with AI →
            </span>
          </Link>

          <Link
            href="/build/manual"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-left transition-colors hover:border-emerald-500/60"
          >
            <div className="text-3xl">✍️</div>
            <h2 className="mt-4 text-xl font-semibold">Build manually</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Fill in each section yourself for full control over every word,
              then preview and download.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-emerald-400">
              Start manually →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
