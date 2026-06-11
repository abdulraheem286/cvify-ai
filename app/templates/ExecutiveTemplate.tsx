import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme } from "./theme";

// Executive: centered name header, then a wide main column + narrow meta rail.
export function ExecutiveTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME }: { cv: CVResult; domId?: string; theme?: Theme }) {
  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="p-10 sm:p-12">
        <header className="flex items-center justify-center gap-5 border-b-2 border-[var(--primary)] pb-5 text-center">
          {cv.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cv.photo} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-[var(--primary)]/30" />
          )}
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold uppercase tracking-wide text-[var(--secondary)]">{cv.fullName}</h1>
            <p className="mt-1 text-base font-medium uppercase tracking-[0.18em] text-[var(--primary)]">{cv.jobTitle}</p>
          </div>
        </header>

        <div className="mt-7 grid grid-cols-3 gap-7">
          <main className="col-span-2">
            {cv.summary && <p className="text-sm leading-relaxed text-zinc-700">{cv.summary}</p>}

            {cv.experience?.length > 0 && (
              <Section title="Experience">
                {cv.experience.map((job, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-semibold text-zinc-900">{job.role}</h3>
                      {job.period && <span className="shrink-0 text-xs text-zinc-500">{job.period}</span>}
                    </div>
                    {job.company && <p className="text-sm font-medium text-[var(--primary)]">{job.company}</p>}
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
                  <div key={i} className="mb-2">
                    <p className="text-sm font-semibold text-zinc-900">{ed.degree}</p>
                    <p className="text-sm text-zinc-600">
                      {ed.institution}
                      {ed.period && <span className="text-zinc-400"> · {ed.period}</span>}
                    </p>
                  </div>
                ))}
              </Section>
            )}
          </main>

          <aside className="col-span-1 border-l border-[var(--primary)]/30 pl-5">
            <MetaBlock title="Contact">
              <div className="space-y-1 text-xs leading-relaxed text-zinc-600">
                {cv.contact?.email && <p className="break-words">{cv.contact.email}</p>}
                {cv.contact?.phone && <p>{cv.contact.phone}</p>}
                {cv.contact?.location && <p>{cv.contact.location}</p>}
                {cv.contact?.website && <p className="break-words">{cv.contact.website}</p>}
                {cv.contact?.linkedin && <p className="break-words">{cv.contact.linkedin}</p>}
              </div>
            </MetaBlock>

            {cv.skills?.length > 0 && (
              <MetaBlock title="Skills">
                <ul className="space-y-1 text-xs text-zinc-700">
                  {cv.skills.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </MetaBlock>
            )}

            {cv.languages && cv.languages.length > 0 && (
              <MetaBlock title="Languages">
                <ul className="space-y-1 text-xs text-zinc-700">
                  {cv.languages.map((l, i) => (
                    <li key={i}>
                      {l.name}
                      {l.level && <span className="text-zinc-400"> — {l.level}</span>}
                    </li>
                  ))}
                </ul>
              </MetaBlock>
            )}

            {cv.certificates && cv.certificates.length > 0 && (
              <MetaBlock title="Certificates">
                <ul className="space-y-1.5 text-xs text-zinc-700">
                  {cv.certificates.map((c, i) => (
                    <li key={i}>
                      <span className="font-medium text-zinc-900">{c.name}</span>
                      {c.issuer && <span className="block text-zinc-500">{c.issuer}{c.year ? ` · ${c.year}` : ""}</span>}
                    </li>
                  ))}
                </ul>
              </MetaBlock>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--primary)]">{title}</h2>
      {children}
    </section>
  );
}

function MetaBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 last:mb-0">
      <h2 className="mb-2 font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--secondary)]">{title}</h2>
      {children}
    </section>
  );
}
