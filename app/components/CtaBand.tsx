import Link from "next/link";

// Reusable closing call-to-action, shared by the standalone marketing pages.
export function CtaBand() {
  return (
    <section className="mx-auto max-w-[1920px] site-px py-20">
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
            <Link href="/templates" className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
              Browse templates
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
