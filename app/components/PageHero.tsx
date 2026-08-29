import { HeroShell } from "./HeroShell";

// Hero for the standalone pages — same shell as the homepage hero so every
// page opens with the site's one visual language.
export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <HeroShell className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-sm ring-1 ring-inset ring-blue-200 backdrop-blur">
          {eyebrow}
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-[1.1] tracking-[-0.01em] text-zinc-900 sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">{subtitle}</p>
      </div>
    </HeroShell>
  );
}
