// Compact <h1> hero for standalone marketing pages (Features / Templates / FAQ).
// A clean, subtly tinted band so the standalone pages feel on-brand.
export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="bg-zinc-50">
      <div className="mx-auto max-w-[1920px] site-px py-16 text-center">
        <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
          {eyebrow}
        </span>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">{subtitle}</p>
      </div>
    </section>
  );
}
