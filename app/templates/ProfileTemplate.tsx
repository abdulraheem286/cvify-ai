import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme } from "./theme";
import { CustomItems } from "./CustomItems";
import { renderRich, renderInline } from "../lib/richtext";

// Profile: content on the left, a primary right rail with photo, contact, skills, languages.
export function ProfileTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME }: { cv: CVResult; domId?: string; theme?: Theme }) {
  return (
    <div
      id={domId}
      style={themeVars(theme) as CSSProperties}
      className="mx-auto flex w-full max-w-[800px] bg-[var(--bg)] font-[family-name:var(--font-body)] text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <main className="w-[64%] p-8 sm:p-9">
        <header>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-[var(--secondary)]">{cv.fullName}</h1>
          <p className="mt-1 text-lg font-medium text-[var(--primary)]">{cv.jobTitle}</p>
        </header>

        {cv.summary && <p className="mt-5 text-sm leading-relaxed text-zinc-700">{renderRich(cv.summary)}</p>}

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
                <p className="text-sm font-semibold text-zinc-900">{ed.degree}</p>
                <p className="text-sm text-zinc-600">{ed.institution}{ed.period && <span className="text-zinc-400"> · {ed.period}</span>}</p>
              </div>
            ))}
          </Section>
        )}

        {cv.certificates && cv.certificates.length > 0 && (
          <Section title="Certificates">
            {cv.certificates.map((c, i) => (
              <p key={i} className="mb-1 text-sm text-zinc-700"><span className="font-medium text-zinc-900">{c.name}</span>{c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}{c.year && <span className="text-zinc-400"> ({c.year})</span>}</p>
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

      <aside className="w-[36%] bg-[var(--primary)] p-6 text-white">
        {cv.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cv.photo} alt="" className="mx-auto mb-5 h-28 w-28 rounded-full object-cover ring-4 ring-white/30" />
        )}

        <RailBlock title="Contact">
          <div className="space-y-1 text-xs leading-relaxed text-white/90">
            {cv.contact?.email && <p className="break-words">{cv.contact.email}</p>}
            {cv.contact?.phone && <p>{cv.contact.phone}</p>}
            {cv.contact?.location && <p>{cv.contact.location}</p>}
            {cv.contact?.website && <p className="break-words">{cv.contact.website}</p>}
            {cv.contact?.linkedin && <p className="break-words">{cv.contact.linkedin}</p>}
          </div>
        </RailBlock>

        {cv.skills?.length > 0 && (
          <RailBlock title="Skills">
            <ul className="space-y-1 text-xs text-white/90">
              {cv.skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </RailBlock>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <RailBlock title="Languages">
            <ul className="space-y-1 text-xs text-white/90">
              {cv.languages.map((l, i) => <li key={i}>{l.name}{l.level && <span className="text-white/60"> — {l.level}</span>}</li>)}
            </ul>
          </RailBlock>
        )}
      </aside>
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

function RailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 last:mb-0">
      <h2 className="mb-2 border-b border-white/30 pb-1 text-xs font-bold uppercase tracking-widest text-white">{title}</h2>
      {children}
    </section>
  );
}
