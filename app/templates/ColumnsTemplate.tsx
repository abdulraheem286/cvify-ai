import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme, type DatePlacement } from "./theme";
import { CustomItems } from "./CustomItems";
import { InlineDate, StackedDate } from "./EntryDate";
import { renderRich, renderInline } from "../lib/richtext";

// Columns: top header, then balanced two-column body (experience | everything else).
export function ColumnsTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME, datePlacement = "below" }: { cv: CVResult; domId?: string; theme?: Theme; datePlacement?: DatePlacement }) {
  const contactLine = [cv.contact?.email, cv.contact?.phone, cv.contact?.location, cv.contact?.website, cv.contact?.linkedin]
    .filter(Boolean)
    .join("   ·   ");

  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="p-10 sm:p-12">
        <header className="flex items-center gap-5">
          {cv.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cv.photo} alt="" className="h-[72px] w-[72px] shrink-0 rounded-full object-cover ring-2 ring-[var(--primary)]/30" />
          )}
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-[var(--secondary)]">{cv.fullName}</h1>
            <p className="mt-1 text-lg font-medium text-[var(--primary)]">{cv.jobTitle}</p>
            {contactLine && <p className="mt-1.5 text-xs text-zinc-500">{contactLine}</p>}
          </div>
        </header>

        {cv.summary && <p className="mt-6 border-t border-zinc-200 pt-5 text-sm leading-relaxed text-zinc-700">{renderRich(cv.summary)}</p>}

        <div className="mt-6 grid grid-cols-2 gap-8">
          <div>
            {cv.experience?.length > 0 && (
              <Section title="Experience">
                {cv.experience.map((job, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <h3 className="font-semibold text-zinc-900">{job.role}{!job.company && <InlineDate period={job.period} placement={datePlacement} className="text-zinc-500" />}</h3>
                    {job.company && <p className="text-xs text-zinc-500">{job.company}<InlineDate period={job.period} placement={datePlacement} className="text-zinc-500" /></p>}
                    <StackedDate period={job.period} placement={datePlacement} className="text-zinc-500" />
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm text-zinc-700">
                      {job.bullets?.map((b, j) => <li key={j}>{renderInline(b)}</li>)}
                    </ul>
                  </div>
                ))}
              </Section>
            )}
          </div>

          <div>
            {cv.education?.length > 0 && (
              <Section title="Education">
                {cv.education.map((ed, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    <p className="text-sm font-semibold text-zinc-900">{ed.degree}{!ed.institution && <InlineDate period={ed.period} placement={datePlacement} className="text-zinc-500" />}</p>
                    {ed.institution && <p className="text-xs text-zinc-500">{ed.institution}<InlineDate period={ed.period} placement={datePlacement} className="text-zinc-500" /></p>}
                    <StackedDate period={ed.period} placement={datePlacement} className="text-zinc-500" />
                  </div>
                ))}
              </Section>
            )}

            {cv.skills?.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {cv.skills.map((s, i) => (
                    <span key={i} className="rounded bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">{s}</span>
                  ))}
                </div>
              </Section>
            )}

            {cv.languages && cv.languages.length > 0 && (
              <Section title="Languages">
                <ul className="space-y-0.5 text-sm text-zinc-700">
                  {cv.languages.map((l, i) => <li key={i}>{l.name}{l.level && <span className="text-zinc-500"> — {l.level}</span>}</li>)}
                </ul>
              </Section>
            )}

            {cv.certificates && cv.certificates.length > 0 && (
              <Section title="Certificates">
                {cv.certificates.map((c, i) => (
                  <p key={i} className="mb-1 last:mb-0 text-sm text-zinc-700"><span className="font-medium text-zinc-900">{c.name}</span>{c.issuer && <span className="block text-xs text-zinc-500">{c.issuer}{c.year ? ` · ${c.year}` : ""}</span>}</p>
                ))}
              </Section>
            )}
          </div>
        </div>

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
    <section className="mt-5 first:mt-0">
      <h2 className="mb-2.5 font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--primary)]">{title}</h2>
      {children}
    </section>
  );
}
