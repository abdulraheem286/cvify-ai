// Shared section heading (eyebrow + title + subtitle), used across the homepage
// sections and the dedicated Features / Templates / FAQ pages.
export function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-zinc-600">{subtitle}</p>
    </div>
  );
}
