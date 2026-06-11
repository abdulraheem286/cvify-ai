import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";
import { themeVars, DEFAULT_THEME, type Theme } from "./theme";

// Bold: oversized expressive name, primary highlight on the title — designer energy.
export function BoldTemplate({ cv, domId = "cv-document", theme = DEFAULT_THEME }: { cv: CVResult; domId?: string; theme?: Theme }) {
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
        <header className="flex items-end justify-between gap-6">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-6xl font-black uppercase leading-[0.95] tracking-tight text-[var(--secondary)]">{cv.fullName}</h1>
            {cv.jobTitle && (
              <p className="mt-3 inline-block bg-[var(--primary)] px-3 py-1 text-sm font-bold uppercase tracking-widest text-white">{cv.jobTitle}</p>
            )}
          </div>
          {cv.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cv.photo} alt="" className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-[var(--primary)]/30" />
          )}
        </header>

        {contactLine && <p className="mt-4 text-xs font-medium text-zinc-500">{contactLine}</p>}

        {cv.summary && <p className="mt-6 border-l-4 border-[var(--primary)] pl-4 text-sm leading-relaxed text-zinc-700">{cv.summary}</p>}

        {cv.experience?.length > 0 && (
          <Section title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-bold text-zinc-900">{job.role}{job.company && <span className="font-normal text-zinc-600"> · {job.company}</span>}</h3>
                  {job.period && <span className="shrink-0 text-xs font-medium text-zinc-500">{job.period}</span>}
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
                <p className="text-sm"><span className="font-bold text-zinc-900">{ed.degree}</span>{ed.institution && <span className="text-zinc-600"> · {ed.institution}</span>}</p>
                {ed.period && <span className="shrink-0 text-xs text-zinc-500">{ed.period}</span>}
              </div>
            ))}
          </Section>
        )}

        {cv.skills?.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((s, i) => (
                <span key={i} className="bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--primary)]">{s}</span>
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
              <p key={i} className="text-sm text-zinc-700"><span className="font-bold text-zinc-900">{c.name}</span>{c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}{c.year && <span className="text-zinc-400"> ({c.year})</span>}</p>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-black uppercase tracking-tight text-[var(--secondary)]">{title}</h2>
      {children}
    </section>
  );
}
