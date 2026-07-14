import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme, type DatePlacement } from "./theme";
import { CustomItems } from "./CustomItems";
import { InlineDate, StackedDate, WorkTag } from "./EntryDate";
import { renderRich, renderInline } from "../lib/richtext";

type Props = { cv: CVResult; domId?: string; theme?: Theme; datePlacement?: DatePlacement };

// Modern: primary header underline, single column, optional photo, chips.
export function ModernTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME, datePlacement = "below" }: Props) {
  const contactLine = [
    cv.contact?.email,
    cv.contact?.phone,
    cv.contact?.location,
    cv.contact?.website,
    cv.contact?.linkedin,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="p-10 sm:p-14">
        <header className="flex items-center gap-5 border-b-2 border-[var(--primary)] pb-5">
          {cv.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cv.photo} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-[var(--primary)]/30" />
          )}
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-[var(--secondary)]">{cv.fullName}</h1>
            <p className="mt-1 text-lg font-medium text-[var(--primary)]">{cv.jobTitle}</p>
            {contactLine && <p className="mt-2 text-sm text-zinc-500">{contactLine}</p>}
          </div>
        </header>

        {cv.summary && <p className="mt-6 text-sm leading-relaxed text-zinc-700">{renderRich(cv.summary)}</p>}

        {cv.experience?.length > 0 && (
          <Section title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4">
                <h3 className="font-semibold text-zinc-900">
                  {job.role}
                  <WorkTag mode={job.workMode} className="text-zinc-500" />
                  {job.company && <span className="font-normal text-zinc-600"> · {job.company}</span>}
                  <InlineDate period={job.period} type={job.employmentType} placement={datePlacement} className="text-zinc-500" />
                </h3>
                <StackedDate period={job.period} type={job.employmentType} placement={datePlacement} className="text-zinc-500" />
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
              <div key={i} className="mb-2">
                <p className="text-sm">
                  <span className="font-semibold text-zinc-900">{ed.degree}</span>
                  {ed.institution && <span className="text-zinc-600"> · {ed.institution}</span>}
                  <InlineDate period={ed.period} placement={datePlacement} className="text-zinc-500" />
                </p>
                <StackedDate period={ed.period} placement={datePlacement} className="text-zinc-500" />
              </div>
            ))}
          </Section>
        )}

        {cv.skills?.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((s, i) => (
                <span key={i} className="rounded-md bg-[var(--primary)]/10 px-2.5 py-1 text-xs font-medium text-[var(--primary)] ring-1 ring-[var(--primary)]/20">
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <Section title="Languages">
            <p className="text-sm text-zinc-700">
              {cv.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).filter(Boolean).join("  ·  ")}
            </p>
          </Section>
        )}

        {cv.certificates && cv.certificates.length > 0 && (
          <Section title="Certificates">
            {cv.certificates.map((c, i) => (
              <p key={i} className="text-sm text-zinc-700">
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
    <section className="mt-6">
      <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--primary)]">{title}</h2>
      {children}
    </section>
  );
}
