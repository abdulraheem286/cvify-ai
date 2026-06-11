import type { CVResult } from "@/app/types";

// Minimal: centered, monochrome, elegant. No colour.
export function MinimalTemplate({ cv }: { cv: CVResult }) {
  return (
    <div
      id="cv-document"
      className="mx-auto w-full max-w-[800px] bg-white text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="p-10 sm:p-14">
        <header className="text-center">
          <h1 className="text-3xl font-semibold uppercase tracking-[0.18em] text-zinc-900">
            {cv.fullName}
          </h1>
          <p className="mt-1.5 text-sm uppercase tracking-[0.2em] text-zinc-500">{cv.jobTitle}</p>
          <p className="mt-3 text-xs text-zinc-500">
            {[cv.contact?.email, cv.contact?.phone, cv.contact?.location, cv.contact?.website]
              .filter(Boolean)
              .join("   •   ")}
          </p>
        </header>

        <hr className="my-6 border-zinc-300" />

        {cv.summary && (
          <p className="mx-auto max-w-prose text-center text-sm leading-relaxed text-zinc-700">
            {cv.summary}
          </p>
        )}

        {cv.experience?.length > 0 && (
          <Section title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-zinc-900">
                    {job.role}
                    {job.company && <span className="font-normal text-zinc-600"> — {job.company}</span>}
                  </h3>
                  {job.period && <span className="shrink-0 text-xs text-zinc-400">{job.period}</span>}
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                  {job.bullets?.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {cv.education?.length > 0 && (
          <Section title="Education">
            {cv.education.map((ed, i) => (
              <div key={i} className="mb-2 flex items-baseline justify-between gap-4">
                <p className="text-sm">
                  <span className="font-semibold text-zinc-900">{ed.degree}</span>
                  {ed.institution && <span className="text-zinc-600"> — {ed.institution}</span>}
                </p>
                {ed.period && <span className="shrink-0 text-xs text-zinc-400">{ed.period}</span>}
              </div>
            ))}
          </Section>
        )}

        {cv.skills?.length > 0 && (
          <Section title="Skills">
            <p className="text-center text-sm text-zinc-700">{cv.skills.join("  ·  ")}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-900">
        {title}
      </h2>
      {children}
    </section>
  );
}
