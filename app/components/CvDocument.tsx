import type { CVResult } from "../types";

// A clean, print-ready CV template. White "paper" so it exports nicely to PDF.
// The id lets the PDF export grab exactly this element.
export function CvDocument({ cv }: { cv: CVResult }) {
  return (
    <div
      id="cv-document"
      className="mx-auto w-full max-w-[800px] bg-white text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="p-10 sm:p-14">
        {/* Header */}
        <header className="border-b-2 border-blue-600 pb-5">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            {cv.fullName}
          </h1>
          <p className="mt-1 text-lg font-medium text-blue-600">{cv.jobTitle}</p>
          <p className="mt-2 text-sm text-zinc-500">
            {[cv.contact?.email, cv.contact?.phone].filter(Boolean).join("  ·  ")}
          </p>
        </header>

        {/* Summary */}
        {cv.summary && (
          <p className="mt-6 text-sm leading-relaxed text-zinc-700">{cv.summary}</p>
        )}

        {/* Experience */}
        {cv.experience?.length > 0 && (
          <Section title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-zinc-900">
                    {job.role}
                    {job.company && (
                      <span className="font-normal text-zinc-600"> · {job.company}</span>
                    )}
                  </h3>
                  {job.period && (
                    <span className="shrink-0 text-xs text-zinc-500">{job.period}</span>
                  )}
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                  {job.bullets?.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {cv.education?.length > 0 && (
          <Section title="Education">
            {cv.education.map((ed, i) => (
              <div key={i} className="mb-2 flex items-baseline justify-between gap-4">
                <p className="text-sm">
                  <span className="font-semibold text-zinc-900">{ed.degree}</span>
                  {ed.institution && (
                    <span className="text-zinc-600"> · {ed.institution}</span>
                  )}
                </p>
                {ed.period && (
                  <span className="shrink-0 text-xs text-zinc-500">{ed.period}</span>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {cv.skills?.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((s, i) => (
                <span
                  key={i}
                  className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
        {title}
      </h2>
      {children}
    </section>
  );
}
