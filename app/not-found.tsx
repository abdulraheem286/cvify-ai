import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white text-zinc-900">
      <SiteHeader />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(64,83,238,0.14),transparent)] blur-2xl"
        />
        <div className="relative">
          <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
            Error 404
          </span>
          <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl">Page not found</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-zinc-600">
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Back to home →
            </Link>
            <Link
              href="/build"
              className="rounded-xl border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Build a CV
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
