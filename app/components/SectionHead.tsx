import type { ReactNode } from "react";

// Shared section heading. Default is centred; `split` puts the title on the
// left and the supporting text on the right — a calmer, more editorial layout
// used across the homepage sections.
export function SectionHead({
  eyebrow,
  title,
  subtitle,
  split = false,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  split?: boolean;
}) {
  const chip = (
    <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
      {eyebrow}
    </span>
  );

  if (split) {
    return (
      <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-20">
        <div>
          {chip}
          <h2 className="mt-4 max-w-xl text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">{title}</h2>
        </div>
        <p className="max-w-lg text-zinc-600 lg:justify-self-end lg:pb-2">{subtitle}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      {chip}
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-zinc-600">{subtitle}</p>
    </div>
  );
}
