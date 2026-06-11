import type { CSSProperties } from "react";
import type { CVResult } from "@/app/types";

type Props = { cv: CVResult; domId?: string; accent?: string };

// Sidebar: two columns — accent left rail with photo, contact, skills, languages.
export function SidebarTemplate({ cv, domId = "cv-document", accent = "#2563eb" }: Props) {
  return (
    <div
      id={domId}
      style={{ "--accent": accent } as CSSProperties}
      className="mx-auto flex w-full max-w-[800px] bg-white text-zinc-800 shadow-xl ring-1 ring-zinc-200"
    >
      <aside className="w-[34%] bg-[var(--accent)] p-6 text-white">
        {cv.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cv.photo} alt="" className="mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-white/30" />
        )}
        <h1 className="text-2xl font-bold leading-tight text-white">{cv.fullName}</h1>
        <p className="mt-1 text-sm text-white/80">{cv.jobTitle}</p>

        <div className="mt-6 space-y-1.5 text-xs leading-relaxed text-white/90">
          {cv.contact?.location && <p>{cv.contact.location}</p>}
          {cv.contact?.email && <p className="break-words">{cv.contact.email}</p>}
          {cv.contact?.phone && <p>{cv.contact.phone}</p>}
          {cv.contact?.website && <p className="break-words">{cv.contact.website}</p>}
          {cv.contact?.linkedin && <p className="break-words">{cv.contact.linkedin}</p>}
        </div>

        {cv.skills?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white">Skills</h2>
            <ul className="mt-2 space-y-1 text-xs text-white/90">
              {cv.skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {cv.languages && cv.languages.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white">Languages</h2>
            <ul className="mt-2 space-y-1 text-xs text-white/90">
              {cv.languages.map((l, i) => (
                <li key={i}>
                  {l.name}
                  {l.level && <span className="text-white/60"> — {l.level}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <main className="w-[66%] p-7">
        {cv.summary && <p className="text-sm leading-relaxed text-zinc-700">{cv.summary}</p>}

        {cv.experience?.length > 0 && (
          <Section title="Experience">
            {cv.experience.map((job, i) => (
              <div key={i} className="mb-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-zinc-900">{job.role}</h3>
                  {job.period && <span className="shrink-0 text-xs text-zinc-500">{job.period}</span>}
                </div>
                {job.company && <p className="text-sm text-[var(--accent)]">{job.company}</p>}
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
              <div key={i} className="mb-2">
                <p className="text-sm font-semibold text-zinc-900">{ed.degree}</p>
                <p className="text-sm text-zinc-600">
                  {ed.institution}
                  {ed.period && <span className="text-zinc-400"> · {ed.period}</span>}
                </p>
              </div>
            ))}
          </Section>
        )}

        {cv.certificates && cv.certificates.length > 0 && (
          <Section title="Certificates">
            {cv.certificates.map((c, i) => (
              <p key={i} className="mb-1 text-sm text-zinc-700">
                <span className="font-medium text-zinc-900">{c.name}</span>
                {c.issuer && <span className="text-zinc-600"> — {c.issuer}</span>}
                {c.year && <span className="text-zinc-400"> ({c.year})</span>}
              </p>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--accent)]">{title}</h2>
      {children}
    </section>
  );
}
