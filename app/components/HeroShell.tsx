import type { ReactNode } from "react";

// The site's hero container: an inset rounded card with a soft gradient and
// background illustrations. Used by the homepage hero and every page hero so
// the whole site shares one visual language.
export function HeroShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className="site-px pt-4">
      <div
        className={`relative isolate overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50 via-indigo-50/50 to-white px-6 ring-1 ring-inset ring-blue-100 ${className}`}
      >
        <HeroDecor />
        <div className="relative z-10">{children}</div>
      </div>
    </section>
  );
}

// Shared background illustration layer: colour washes, a dot grid and line art.
export function HeroDecor({ subtle = false }: { subtle?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className={`absolute -left-24 -top-16 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl ${subtle ? "opacity-60" : ""}`} />
      <div className={`absolute -right-20 top-24 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl ${subtle ? "opacity-60" : ""}`} />
      <div className="absolute bottom-0 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl" />

      <svg className="absolute inset-0 h-full w-full text-blue-300/35" aria-hidden>
        <defs>
          <pattern id="heroDots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroDots)" />
      </svg>

      {!subtle && (
        <>
          <svg className="absolute left-6 top-28 h-24 w-24 text-blue-400/40 sm:h-32 sm:w-32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="50" cy="50" r="34" />
            <circle cx="50" cy="50" r="22" strokeDasharray="4 5" />
          </svg>
          <svg className="absolute bottom-44 right-8 hidden h-28 w-28 text-indigo-400/35 lg:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="18" y="18" width="64" height="64" rx="14" />
            <path d="M32 50h36M32 38h36M32 62h22" strokeLinecap="round" />
          </svg>
        </>
      )}
    </div>
  );
}
