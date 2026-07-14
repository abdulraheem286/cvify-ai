import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme, type DatePlacement } from "./theme";
import { CustomItems } from "./CustomItems";
import { InlineDate, StackedDate, WorkTag } from "./EntryDate";
import { renderRich, renderInline } from "../lib/richtext";

// Gutter: section titles sit in a narrow left column, content on the right. Editorial / minimal.
export function GutterTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME, datePlacement = "below" }: { cv: CVResult; domId?: string; theme?: Theme; datePlacement?: DatePlacement }) {
  const contactLine = [cv.contact?.email, cv.contact?.phone, cv.contact?.location, cv.contact?.website, cv.contact?.linkedin]
    .filter(Boolean)
    .join("   ·   ");

  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="p-10 sm:p-14">
        <header className="grid grid-cols-[150px_1fr] gap-x-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">{cv.jobTitle}</div>
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-[var(--secondary)]">{cv.fullName}</h1>
            {contactLine && <p className="mt-2 text-xs text-zinc-500">{contactLine}</p>}
          </div>
        </header>

        <hr className="my-7 border-zinc-200" />

        {cv.summary && (
          <Row label="Profile">
            <p className="text-sm leading-relaxed text-zinc-700">{renderRich(cv.summary)}</p>
          </Row>
        )}

        {cv.experience?.length > 0 && (
          <Row label="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <h3 className="font-semibold text-zinc-900">{job.role}<WorkTag mode={job.workMode} className="text-zinc-500" />{job.company && <span className="font-normal text-zinc-600"> · {job.company}</span>}<InlineDate period={job.period} type={job.employmentType} placement={datePlacement} className="text-zinc-500" /></h3>
                <StackedDate period={job.period} type={job.employmentType} placement={datePlacement} className="text-zinc-500" />
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                  {job.bullets?.map((b, j) => <li key={j}>{renderInline(b)}</li>)}
                </ul>
              </div>
            ))}
          </Row>
        )}

        {cv.education?.length > 0 && (
          <Row label="Education">
            {cv.education.map((ed, i) => (
              <div key={i} className="mb-2 last:mb-0">
                <p className="text-sm">
                  <span className="font-semibold text-zinc-900">{ed.degree}</span>
                  {ed.institution && <span className="text-zinc-600"> · {ed.institution}</span>}
                  <InlineDate period={ed.period} placement={datePlacement} className="text-zinc-500" />
                </p>
                <StackedDate period={ed.period} placement={datePlacement} className="text-zinc-500" />
              </div>
            ))}
          </Row>
        )}

        {cv.skills?.length > 0 && (
          <Row label="Skills">
            <p className="text-sm text-zinc-700">{cv.skills.join("   ·   ")}</p>
          </Row>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <Row label="Languages">
            <p className="text-sm text-zinc-700">
              {cv.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).filter(Boolean).join("   ·   ")}
            </p>
          </Row>
        )}

        {cv.certificates && cv.certificates.length > 0 && (
          <Row label="Certificates">
            {cv.certificates.map((c, i) => (
              <p key={i} className="mb-1 last:mb-0 text-sm text-zinc-700">
                <span className="font-medium text-zinc-900">{c.name}</span>
                {c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}
                {c.year && <span className="text-zinc-400"> ({c.year})</span>}
              </p>
            ))}
          </Row>
        )}

        {cv.customSections?.map((s, ci) =>
          s.heading && s.items?.length ? (
            <Row key={`cs-${ci}`} label={s.heading}>
              <CustomItems items={s.items} datePlacement={datePlacement} />
            </Row>
          ) : null,
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 grid grid-cols-[150px_1fr] gap-x-6 last:mb-0">
      <h2 className="pt-0.5 font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">{label}</h2>
      <div>{children}</div>
    </section>
  );
}
