import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme } from "./theme";
import { CustomItems } from "./CustomItems";

// Banner: full-width solid primary header with contact inside, single-column body.
export function BannerTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME }: { cv: CVResult; domId?: string; theme?: Theme }) {
  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] overflow-hidden bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <header className="flex items-center justify-between gap-6 bg-[var(--primary)] px-10 py-7 text-white sm:px-12">
        <div className="flex items-center gap-4">
          {cv.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cv.photo} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white/40" />
          )}
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">{cv.fullName}</h1>
            <p className="text-sm font-medium uppercase tracking-widest text-white/85">{cv.jobTitle}</p>
          </div>
        </div>
        <div className="hidden shrink-0 space-y-0.5 text-right text-xs text-white/85 sm:block">
          {cv.contact?.email && <p>{cv.contact.email}</p>}
          {cv.contact?.phone && <p>{cv.contact.phone}</p>}
          {cv.contact?.location && <p>{cv.contact.location}</p>}
          {cv.contact?.website && <p>{cv.contact.website}</p>}
          {cv.contact?.linkedin && <p>{cv.contact.linkedin}</p>}
        </div>
      </header>

      <div className="p-10 sm:p-12">
        {cv.summary && <p className="text-sm leading-relaxed text-zinc-700">{cv.summary}</p>}

        {cv.experience?.length > 0 && (
          <Section title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-zinc-900">{job.role}{job.company && <span className="font-normal text-zinc-600"> · {job.company}</span>}</h3>
                  {job.period && <span className="shrink-0 text-xs text-zinc-500">{job.period}</span>}
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
                <p className="text-sm"><span className="font-semibold text-zinc-900">{ed.degree}</span>{ed.institution && <span className="text-zinc-600"> · {ed.institution}</span>}</p>
                {ed.period && <span className="shrink-0 text-xs text-zinc-500">{ed.period}</span>}
              </div>
            ))}
          </Section>
        )}

        {cv.skills?.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((s, i) => (
                <span key={i} className="rounded bg-[var(--primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--primary)]">{s}</span>
              ))}
            </div>
          </Section>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <Section title="Languages">
            <p className="text-sm text-zinc-700">{cv.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).filter(Boolean).join("   ·   ")}</p>
          </Section>
        )}

        {cv.certificates && cv.certificates.length > 0 && (
          <Section title="Certificates">
            {cv.certificates.map((c, i) => (
              <p key={i} className="text-sm text-zinc-700"><span className="font-medium text-zinc-900">{c.name}</span>{c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}{c.year && <span className="text-zinc-400"> ({c.year})</span>}</p>
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
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 border-b-2 border-[var(--primary)]/30 pb-1 font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--primary)]">{title}</h2>
      {children}
    </section>
  );
}
