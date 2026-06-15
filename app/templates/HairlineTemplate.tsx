import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme } from "./theme";
import { CustomItems } from "./CustomItems";
import { renderRich, renderInline } from "../lib/richtext";

// Hairline: airy single column, full-width hairline rules between sections.
export function HairlineTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME }: { cv: CVResult; domId?: string; theme?: Theme }) {
  const contactLine = [cv.contact?.email, cv.contact?.phone, cv.contact?.location, cv.contact?.website, cv.contact?.linkedin]
    .filter(Boolean)
    .join("   ·   ");

  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="p-12 sm:p-16">
        <header>
          <h1 className="font-[family-name:var(--font-heading)] text-5xl font-light tracking-tight text-[var(--secondary)]">{cv.fullName}</h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--primary)]" />
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--primary)]">{cv.jobTitle}</p>
          </div>
          {contactLine && <p className="mt-3 text-xs text-zinc-500">{contactLine}</p>}
        </header>

        {cv.summary && <p className="mt-8 text-sm leading-relaxed text-zinc-700">{renderRich(cv.summary)}</p>}

        {cv.experience?.length > 0 && (
          <Section title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-zinc-900">{job.role}{job.company && <span className="font-normal text-zinc-600"> — {job.company}</span>}</h3>
                  {job.period && <span className="shrink-0 text-xs text-zinc-400">{job.period}</span>}
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                  {job.bullets?.map((b, j) => <li key={j}>{renderInline(b)}</li>)}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {cv.education?.length > 0 && (
          <Section title="Education">
            {cv.education.map((ed, i) => (
              <div key={i} className="mb-2 last:mb-0 flex items-baseline justify-between gap-3">
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
            <p className="text-sm text-zinc-700">{cv.skills.join("   ·   ")}</p>
          </Section>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <Section title="Languages">
            <p className="text-sm text-zinc-700">
              {cv.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).filter(Boolean).join("   ·   ")}
            </p>
          </Section>
        )}

        {cv.certificates && cv.certificates.length > 0 && (
          <Section title="Certificates">
            {cv.certificates.map((c, i) => (
              <p key={i} className="mb-1 last:mb-0 text-sm text-zinc-700">
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
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7 border-t border-zinc-200 pt-6">
      <h2 className="mb-3 font-[family-name:var(--font-heading)] text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">{title}</h2>
      {children}
    </section>
  );
}
