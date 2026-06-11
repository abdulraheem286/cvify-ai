"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { CvDocument } from "@/app/components/CvDocument";
import type { CVResult } from "@/app/types";
import { downloadCvPdf } from "@/app/lib/pdf";
import { Reveal } from "@/app/components/Reveal";
import { SiteHeader } from "@/app/components/SiteHeader";
import { IconField, FieldTextarea, emailError } from "@/app/components/fields";
import {
  IconUser,
  IconBriefcase,
  IconMail,
  IconPhone,
  IconMapPin,
  IconGlobe,
  IconText,
  IconGraduation,
  IconTools,
  IconDownload,
  IconArrowLeft,
  IconPlus,
  IconTrash,
} from "@/app/components/icons";

type ExpEntry = { role: string; company: string; period: string; bullets: string };
type EduEntry = { degree: string; institution: string; period: string };

type ManualForm = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
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
  location: "",
  website: "",
  summary: "",
  experience: [{ role: "", company: "", period: "", bullets: "" }],
  education: [{ degree: "", institution: "", period: "" }],
  skills: "",
};

export default function ManualClient() {
  const [form, setForm] = useState<ManualForm>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CVResult | null>(null);
  const [downloading, setDownloading] = useState(false);

  const set = (key: keyof ManualForm) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

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

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Your name is required.";
    if (!form.jobTitle.trim()) e.jobTitle = "A professional title is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else {
      const m = emailError(form.email);
      if (m) e.email = m;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePreview(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const cv: CVResult = {
      fullName: form.fullName,
      jobTitle: form.jobTitle,
      contact: {
        email: form.email,
        phone: form.phone,
        location: form.location,
        website: form.website,
      },
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
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 print:bg-white">
      <div className="print:hidden">
        <SiteHeader />
      </div>

      <main className="flex flex-1 flex-col items-center px-6 py-12 print:p-0">
        <div className="w-full max-w-2xl print:hidden">
          <Link
            href="/build"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-blue-600"
          >
            <IconArrowLeft className="h-4 w-4" /> Back to build options
          </Link>

          <Reveal stagger>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <IconText className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Manual CV Builder</h1>
                <p className="text-sm text-zinc-600">
                  Fill in each section yourself — full control over every word.
                </p>
              </div>
            </div>

            <form
              onSubmit={handlePreview}
              className="mt-8 space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
            >
              {/* Personal */}
              <section className="space-y-4">
                <SectionHeader icon={<IconUser className="h-[18px] w-[18px]" />}>Personal details</SectionHeader>
                <IconField label="Full name" icon={<IconUser />} value={form.fullName} onChange={set("fullName")} placeholder="John Doe" error={errors.fullName} />
                <IconField label="Professional title" icon={<IconBriefcase />} value={form.jobTitle} onChange={set("jobTitle")} placeholder="Software Engineer" error={errors.jobTitle} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconField label="Email" icon={<IconMail />} value={form.email} onChange={set("email")} placeholder="you@example.com" error={errors.email} type="email" />
                  <IconField label="Phone" icon={<IconPhone />} value={form.phone} onChange={set("phone")} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconField label="Location" icon={<IconMapPin />} value={form.location} onChange={set("location")} placeholder="London, UK" />
                  <IconField label="Website / portfolio" icon={<IconGlobe />} value={form.website} onChange={set("website")} placeholder="yoursite.com" />
                </div>
              </section>

              {/* Summary */}
              <section className="space-y-4">
                <SectionHeader icon={<IconText className="h-[18px] w-[18px]" />}>Professional summary</SectionHeader>
                <FieldTextarea
                  label="Summary"
                  value={form.summary}
                  onChange={set("summary")}
                  rows={3}
                  placeholder="A short 2–3 sentence summary of who you are and what you do."
                />
              </section>

              {/* Experience */}
              <section className="space-y-4">
                <SectionHeader icon={<IconBriefcase className="h-[18px] w-[18px]" />}>Experience</SectionHeader>
                {form.experience.map((exp, i) => (
                  <div key={i} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <PlainInput label="Role" value={exp.role} onChange={(v) => updateExp(i, "role", v)} placeholder="Frontend Developer" />
                      <PlainInput label="Company" value={exp.company} onChange={(v) => updateExp(i, "company", v)} placeholder="TechCorp" />
                    </div>
                    <PlainInput label="Period" value={exp.period} onChange={(v) => updateExp(i, "period", v)} placeholder="2022 – Present" />
                    <FieldTextarea
                      label="Bullet points (one per line)"
                      value={exp.bullets}
                      onChange={(v) => updateExp(i, "bullets", v)}
                      rows={3}
                      placeholder={"Built and shipped the new dashboard\nImproved page speed by 40%"}
                    />
                    {form.experience.length > 1 && (
                      <button type="button" onClick={() => removeExp(i)} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700">
                        <IconTrash className="h-4 w-4" /> Remove this job
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addExp} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  <IconPlus className="h-4 w-4" /> Add another job
                </button>
              </section>

              {/* Education */}
              <section className="space-y-4">
                <SectionHeader icon={<IconGraduation className="h-[18px] w-[18px]" />}>Education</SectionHeader>
                {form.education.map((ed, i) => (
                  <div key={i} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <PlainInput label="Degree" value={ed.degree} onChange={(v) => updateEdu(i, "degree", v)} placeholder="BS Computer Science" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <PlainInput label="Institution" value={ed.institution} onChange={(v) => updateEdu(i, "institution", v)} placeholder="State University" />
                      <PlainInput label="Period" value={ed.period} onChange={(v) => updateEdu(i, "period", v)} placeholder="2014 – 2018" />
                    </div>
                    {form.education.length > 1 && (
                      <button type="button" onClick={() => removeEdu(i)} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700">
                        <IconTrash className="h-4 w-4" /> Remove this entry
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addEdu} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  <IconPlus className="h-4 w-4" /> Add more education
                </button>
              </section>

              {/* Skills */}
              <section className="space-y-4">
                <SectionHeader icon={<IconTools className="h-[18px] w-[18px]" />}>Skills</SectionHeader>
                <IconField
                  label="Skills (separate with commas)"
                  icon={<IconTools />}
                  value={form.skills}
                  onChange={set("skills")}
                  placeholder="JavaScript, React, Figma, Team leadership"
                />
              </section>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Preview my CV →
              </button>
            </form>
          </Reveal>
        </div>

        {result && (
          <div className="mt-12 w-full max-w-[820px] print:mt-0">
            <div className="mb-4 flex justify-end print:hidden">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <IconDownload className="h-[18px] w-[18px]" />
                {downloading ? "Preparing PDF…" : "Download PDF"}
              </button>
            </div>
            <CvDocument cv={result} />
          </div>
        )}
      </main>
    </div>
  );
}

function SectionHeader({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-blue-600">
      {icon}
      <h2 className="text-sm font-semibold uppercase tracking-wide">{children}</h2>
    </div>
  );
}

function PlainInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
