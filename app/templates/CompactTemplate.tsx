import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme, type DatePlacement } from "./theme";
import { CustomItems } from "./CustomItems";
import { InlineDate, StackedDate, WorkTag } from "./EntryDate";
import { renderRich, renderInline } from "../lib/richtext";

// Compact: dense single column with inline section labels — fits a lot on one page.
export function CompactTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME, datePlacement = "below" }: { cv: CVResult; domId?: string; theme?: Theme; datePlacement?: DatePlacement }) {
  const contactLine = [cv.contact?.email, cv.contact?.phone, cv.contact?.location, cv.contact?.website, cv.contact?.linkedin]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="px-10 py-8 sm:px-12">
        <header className="flex items-baseline justify-between gap-4 border-b border-zinc-300 pb-3">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-[var(--secondary)]">
            {cv.fullName}
            <span className="ml-2 text-base font-medium text-[var(--primary)]">{cv.jobTitle}</span>
          </h1>
        </header>
        {contactLine && <p className="mt-2 text-xs text-zinc-500">{contactLine}</p>}

        {cv.summary && <p className="mt-3 text-[13px] leading-snug text-zinc-700">{renderRich(cv.summary)}</p>}

        {cv.experience?.length > 0 && (
          <Section title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-2.5 last:mb-0">
                <h3 className="text-[13px] font-semibold text-zinc-900">{job.role}<WorkTag mode={job.workMode} className="text-zinc-500" />{job.company && <span className="font-normal text-zinc-600"> · {job.company}</span>}<InlineDate period={job.period} type={job.employmentType} placement={datePlacement} className="text-zinc-500" /></h3>
                <StackedDate period={job.period} type={job.employmentType} placement={datePlacement} className="text-zinc-500" />
                <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[13px] leading-snug text-zinc-700">
                  {job.bullets?.map((b, j) => <li key={j}>{renderInline(b)}</li>)}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {cv.education?.length > 0 && (
          <Section title="Education">
            {cv.education.map((ed, i) => (
              <div key={i} className="text-[13px]">
                <p><span className="font-semibold text-zinc-900">{ed.degree}</span>{ed.institution && <span className="text-zinc-600"> · {ed.institution}</span>}<InlineDate period={ed.period} placement={datePlacement} className="text-zinc-500" /></p>
                <StackedDate period={ed.period} placement={datePlacement} className="text-zinc-500" />
              </div>
            ))}
          </Section>
        )}

        {cv.skills?.length > 0 && (
          <Section title="Skills">
            <p className="text-[13px] text-zinc-700">{cv.skills.join("  ·  ")}</p>
          </Section>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <Section title="Languages">
            <p className="text-[13px] text-zinc-700">{cv.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).filter(Boolean).join("  ·  ")}</p>
          </Section>
        )}

        {cv.certificates && cv.certificates.length > 0 && (
          <Section title="Certificates">
            {cv.certificates.map((c, i) => (
              <p key={i} className="text-[13px] text-zinc-700"><span className="font-medium text-zinc-900">{c.name}</span>{c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}{c.year && <span className="text-zinc-400"> ({c.year})</span>}</p>
            ))}
          </Section>
        )}

        {cv.customSections?.map((s, ci) =>
          s.heading && s.items?.length ? (
            <Section key={`cs-${ci}`} title={s.heading}>
              <CustomItems items={s.items} datePlacement={datePlacement} />
            </Section>
          ) : null,
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-3.5">
      <h2 className="mb-1.5 font-[family-name:var(--font-heading)] text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--primary)]">{title}</h2>
      {children}
    </section>
  );
}
