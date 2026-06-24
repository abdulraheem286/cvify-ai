import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme } from "./theme";
import { CustomItems } from "./CustomItems";
import { renderRich, renderInline } from "../lib/richtext";

type Props = { cv: CVResult; domId?: string; theme?: Theme };

// Classic: traditional, heading-font titles, full-width section rules.
export function ClassicTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME }: Props) {
  const contactLine = [
    cv.contact?.email,
    cv.contact?.phone,
    cv.contact?.location,
    cv.contact?.website,
    cv.contact?.linkedin,
  ]
    .filter(Boolean)
    .join("   |   ");

  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto w-full max-w-[800px] bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <div className="p-10 sm:p-14">
        <header className="border-b border-zinc-300 pb-4 text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-[var(--secondary)]">{cv.fullName}</h1>
          <p className="mt-1 text-base font-medium text-[var(--primary)]">{cv.jobTitle}</p>
          {contactLine && <p className="mt-2 text-xs text-zinc-500">{contactLine}</p>}
        </header>

        {cv.summary && <p className="mt-5 text-sm leading-relaxed text-zinc-700">{renderRich(cv.summary)}</p>}

        {cv.experience?.length > 0 && (
          <Section title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4">
                <h3 className="font-semibold text-zinc-900">
                  {job.role}
                  {job.company && <span className="font-normal italic text-zinc-600"> , {job.company}</span>}
                </h3>
                {job.period && <p className="mt-0.5 text-xs text-zinc-500">{job.period}</p>}
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
                  {ed.institution && <span className="italic text-zinc-600"> , {ed.institution}</span>}
                </p>
                {ed.period && <p className="mt-0.5 text-xs text-zinc-500">{ed.period}</p>}
              </div>
            ))}
          </Section>
        )}

        {cv.skills?.length > 0 && (
          <Section title="Skills">
            <p className="text-sm text-zinc-700">{cv.skills.join("  ·  ")}</p>
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
                {c.issuer && <span className="italic text-zinc-600"> — {c.issuer}</span>}
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
    <section className="mt-6">
      <h2 className="mb-3 border-b border-[var(--primary)]/40 pb-1 font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
