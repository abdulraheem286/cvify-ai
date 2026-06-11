import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme } from "./theme";

// Cards: each section is a soft rounded card — a modern dashboard feel.
export function CardsTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME }: { cv: CVResult; domId?: string; theme?: Theme }) {
  const contactLine = [cv.contact?.email, cv.contact?.phone, cv.contact?.location, cv.contact?.website, cv.contact?.linkedin]
    .filter(Boolean)
    .join("   ·   ");

  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="space-y-4 p-8 sm:p-10">
        {/* Header card */}
        <div className="flex items-center gap-5 rounded-2xl bg-[var(--primary)] p-6 text-white">
          {cv.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cv.photo} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover ring-2 ring-white/30" />
          )}
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">{cv.fullName}</h1>
            <p className="mt-0.5 text-base text-white/85">{cv.jobTitle}</p>
            {contactLine && <p className="mt-2 text-xs text-white/75">{contactLine}</p>}
          </div>
        </div>

        {cv.summary && (
          <Card title="Profile">
            <p className="text-sm leading-relaxed text-zinc-700">{cv.summary}</p>
          </Card>
        )}

        {cv.experience?.length > 0 && (
          <Card title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4 last:mb-0">
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
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {cv.education?.length > 0 && (
            <Card title="Education">
              {cv.education.map((ed, i) => (
                <div key={i} className="mb-2 last:mb-0">
                  <p className="text-sm font-semibold text-zinc-900">{ed.degree}</p>
                  <p className="text-sm text-zinc-600">{ed.institution}{ed.period && <span className="text-zinc-400"> · {ed.period}</span>}</p>
                </div>
              ))}
            </Card>
          )}

          {cv.skills?.length > 0 && (
            <Card title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((s, i) => (
                  <span key={i} className="rounded-md bg-[var(--primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--primary)]">{s}</span>
                ))}
              </div>
            </Card>
          )}

          {cv.languages && cv.languages.length > 0 && (
            <Card title="Languages">
              <ul className="space-y-1 text-sm text-zinc-700">
                {cv.languages.map((l, i) => (
                  <li key={i}>{l.name}{l.level && <span className="text-zinc-500"> — {l.level}</span>}</li>
                ))}
              </ul>
            </Card>
          )}

          {cv.certificates && cv.certificates.length > 0 && (
            <Card title="Certificates">
              {cv.certificates.map((c, i) => (
                <p key={i} className="mb-1 last:mb-0 text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">{c.name}</span>
                  {c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}
                  {c.year && <span className="text-zinc-400"> ({c.year})</span>}
                </p>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200">
      <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--primary)]">{title}</h2>
      {children}
    </section>
  );
}
