import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme } from "./theme";
import { CustomItems } from "./CustomItems";

type Props = { cv: CVResult; domId?: string; theme?: Theme };

// Aurora: bold primary header with photo, two-tone two-column body.
export function AuroraTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME }: Props) {
  const contactLine = [
    cv.contact?.email,
    cv.contact?.phone,
    cv.contact?.location,
    cv.contact?.website,
    cv.contact?.linkedin,
  ]
    .filter(Boolean)
    .join("   ·   ");

  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] overflow-hidden bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <header className="flex items-center gap-6 bg-[var(--primary)] p-8 text-white sm:p-10">
        {cv.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cv.photo} alt="" className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-white/30" />
        )}
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">{cv.fullName}</h1>
          <p className="mt-1 text-lg text-white/80">{cv.jobTitle}</p>
          {contactLine && <p className="mt-2 text-xs text-white/80">{contactLine}</p>}
        </div>
      </header>

      <div className="grid grid-cols-3">
        <main className="col-span-2 p-7">
          {cv.summary && <p className="text-sm leading-relaxed text-zinc-700">{cv.summary}</p>}

          {cv.experience?.length > 0 && (
            <Section title="Experience">
              {cv.experience.map((job, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-zinc-900">{job.role}</h3>
                    {job.period && <span className="shrink-0 text-xs text-zinc-500">{job.period}</span>}
                  </div>
                  {job.company && <p className="text-sm text-[var(--primary)]">{job.company}</p>}
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

          {cv.certificates && cv.certificates.length > 0 && (
            <Section title="Certificates">
              {cv.certificates.map((c, i) => (
                <p key={i} className="mb-1 text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">{c.name}</span>
                  {c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}
                  {c.year && <span className="text-zinc-400"> ({c.year})</span>}
                </p>
              ))}
            </Section>
          )}

          {cv.customSections?.map((s, ci) =>
            s.heading && s.items?.length ? (
              <Section key={`cs-${ci}`} title={s.heading}>
                <CustomItems items={s.items} />
              </Section>
            ) : null,
          )}
        </main>

        <aside className="col-span-1 bg-[var(--primary)]/10 p-6">
          {cv.skills?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {cv.skills.map((s, i) => (
                  <span key={i} className="rounded bg-white px-2 py-1 text-xs text-zinc-700 ring-1 ring-[var(--primary)]/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cv.languages && cv.languages.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">Languages</h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                {cv.languages.map((l, i) => (
                  <li key={i}>
                    {l.name}
                    {l.level && <span className="text-zinc-500"> — {l.level}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
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
