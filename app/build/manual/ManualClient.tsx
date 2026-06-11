"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CvDocument } from "@/app/components/CvDocument";
import type { CVResult } from "@/app/types";
import { downloadCvPdf } from "@/app/lib/pdf";

type ExpEntry = { role: string; company: string; period: string; bullets: string };
type EduEntry = { degree: string; institution: string; period: string };

type ManualForm = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  summary: string;
  experience: ExpEntry[];
  education: EduEntry[];
  skills: string;
};

const EMPTY: ManualForm = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  summary: "",
  experience: [{ role: "", company: "", period: "", bullets: "" }],
  education: [{ degree: "", institution: "", period: "" }],
  skills: "",
};

export default function ManualClient() {
  const [form, setForm] = useState<ManualForm>(EMPTY);
  const [result, setResult] = useState<CVResult | null>(null);
  const [downloading, setDownloading] = useState(false);

  // --- experience helpers ---
  function updateExp(i: number, key: keyof ExpEntry, value: string) {
    setForm((prev) => {
      const experience = [...prev.experience];
      experience[i] = { ...experience[i], [key]: value };
      return { ...prev, experience };
    });
  }
  function addExp() {
    setForm((prev) => ({
      ...prev,
      experience: [...prev.experience, { role: "", company: "", period: "", bullets: "" }],
    }));
  }
  function removeExp(i: number) {
    setForm((prev) => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));
  }

  // --- education helpers ---
  function updateEdu(i: number, key: keyof EduEntry, value: string) {
    setForm((prev) => {
      const education = [...prev.education];
      education[i] = { ...education[i], [key]: value };
      return { ...prev, education };
    });
  }
  function addEdu() {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", period: "" }],
    }));
  }
  function removeEdu(i: number) {
    setForm((prev) => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));
  }

  // Turn the form into the shared CV shape and show the preview.
  function handlePreview(e: FormEvent) {
    e.preventDefault();
    const cv: CVResult = {
      fullName: form.fullName,
      jobTitle: form.jobTitle,
      contact: { email: form.email, phone: form.phone },
      summary: form.summary,
      experience: form.experience
        .filter((x) => x.role || x.company || x.bullets)
        .map((x) => ({
          role: x.role,
          company: x.company,
          period: x.period,
          bullets: x.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
        })),
      education: form.education.filter((x) => x.degree || x.institution),
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    setResult(cv);
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadCvPdf(result?.fullName?.replace(/\s+/g, "-") || "cv");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-950 px-6 py-12 text-white print:bg-white print:p-0">
      <div className="w-full max-w-2xl print:hidden">
        <Link href="/build" className="text-sm text-zinc-500 transition-colors hover:text-emerald-400">
          ← Back to build options
        </Link>

        <h1 className="mt-6 text-4xl font-bold tracking-tight">Manual CV Builder</h1>
        <p className="mt-2 text-zinc-400">Fill in each section yourself — full control over every word.</p>

        <form onSubmit={handlePreview} className="mt-10 space-y-8">
          {/* Personal info */}
          <section className="space-y-4">
            <SectionTitle>Personal details</SectionTitle>
            <Input label="Full name" value={form.fullName} onChange={(v) => setForm((p) => ({ ...p, fullName: v }))} placeholder="John Doe" />
            <Input label="Professional title" value={form.jobTitle} onChange={(v) => setForm((p) => ({ ...p, jobTitle: v }))} placeholder="Software Engineer" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} placeholder="you@example.com" />
              <Input label="Phone" value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} placeholder="+1 (555) 123-4567" />
            </div>
          </section>

          {/* Summary */}
          <section className="space-y-4">
            <SectionTitle>Professional summary</SectionTitle>
            <Textarea
              value={form.summary}
              onChange={(v) => setForm((p) => ({ ...p, summary: v }))}
              rows={3}
              placeholder="A short 2–3 sentence summary of who you are and what you do."
            />
          </section>

          {/* Experience */}
          <section className="space-y-4">
            <SectionTitle>Experience</SectionTitle>
            {form.experience.map((exp, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Role" value={exp.role} onChange={(v) => updateExp(i, "role", v)} placeholder="Frontend Developer" />
                  <Input label="Company" value={exp.company} onChange={(v) => updateExp(i, "company", v)} placeholder="TechCorp" />
                </div>
                <Input label="Period" value={exp.period} onChange={(v) => updateExp(i, "period", v)} placeholder="2022 – Present" />
                <Textarea
                  label="Bullet points (one per line)"
                  value={exp.bullets}
                  onChange={(v) => updateExp(i, "bullets", v)}
                  rows={3}
                  placeholder={"Built and shipped the new dashboard\nImproved page speed by 40%"}
                />
                {form.experience.length > 1 && (
                  <button type="button" onClick={() => removeExp(i)} className="text-xs text-red-400 hover:text-red-300">
                    Remove this job
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addExp} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
              + Add another job
            </button>
          </section>

          {/* Education */}
          <section className="space-y-4">
            <SectionTitle>Education</SectionTitle>
            {form.education.map((ed, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <Input label="Degree" value={ed.degree} onChange={(v) => updateEdu(i, "degree", v)} placeholder="BS Computer Science" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Institution" value={ed.institution} onChange={(v) => updateEdu(i, "institution", v)} placeholder="State University" />
                  <Input label="Period" value={ed.period} onChange={(v) => updateEdu(i, "period", v)} placeholder="2014 – 2018" />
                </div>
                {form.education.length > 1 && (
                  <button type="button" onClick={() => removeEdu(i)} className="text-xs text-red-400 hover:text-red-300">
                    Remove this entry
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addEdu} className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
              + Add more education
            </button>
          </section>

          {/* Skills */}
          <section className="space-y-4">
            <SectionTitle>Skills</SectionTitle>
            <Input
              label="Skills (separate with commas)"
              value={form.skills}
              onChange={(v) => setForm((p) => ({ ...p, skills: v }))}
              placeholder="JavaScript, React, Figma, Team leadership"
            />
          </section>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Preview my CV →
          </button>
        </form>
      </div>

      {result && (
        <div className="mt-12 w-full max-w-[820px] print:mt-0">
          <div className="mb-4 flex justify-end print:hidden">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading ? "Preparing PDF…" : "Download PDF ⬇"}
            </button>
          </div>
          <CvDocument cv={result} />
        </div>
      )}
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">{children}</h2>;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-zinc-300">{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
      />
    </div>
  );
}
