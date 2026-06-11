"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { CVResult } from "@/app/types";
import { Reveal } from "./Reveal";
import { Stepper } from "./Stepper";
import {
  IconField,
  FieldTextarea,
  nameError,
  emailError,
  phoneError,
  urlError,
  requiredError,
  sanitizePhone,
} from "./fields";
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
  IconArrowLeft,
  IconPlus,
  IconTrash,
} from "./icons";

export type ExpEntry = { role: string; company: string; period: string; bullets: string };
export type EduEntry = { degree: string; institution: string; period: string };

export type EditorForm = {
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

export const EMPTY_FORM: EditorForm = {
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

// Convert an AI-generated CV into the editor's form shape (so AI can pre-fill it).
export function cvToForm(cv: CVResult): EditorForm {
  return {
    fullName: cv.fullName ?? "",
    jobTitle: cv.jobTitle ?? "",
    email: cv.contact?.email ?? "",
    phone: cv.contact?.phone ?? "",
    location: cv.contact?.location ?? "",
    website: cv.contact?.website ?? "",
    summary: cv.summary ?? "",
    experience: cv.experience?.length
      ? cv.experience.map((e) => ({
          role: e.role ?? "",
          company: e.company ?? "",
          period: e.period ?? "",
          bullets: (e.bullets ?? []).join("\n"),
        }))
      : [{ role: "", company: "", period: "", bullets: "" }],
    education: cv.education?.length
      ? cv.education.map((e) => ({
          degree: e.degree ?? "",
          institution: e.institution ?? "",
          period: e.period ?? "",
        }))
      : [{ degree: "", institution: "", period: "" }],
    skills: (cv.skills ?? []).join(", "),
  };
}

function formToCv(form: EditorForm): CVResult {
  return {
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
}

type StringKey =
  | "fullName"
  | "jobTitle"
  | "email"
  | "phone"
  | "location"
  | "website"
  | "summary"
  | "skills";

function pErr(key: StringKey, v: string): string {
  switch (key) {
    case "fullName":
      return nameError(v, true);
    case "jobTitle":
      return requiredError(v, "Professional title");
    case "email":
      return emailError(v, true);
    case "phone":
      return phoneError(v);
    case "website":
      return urlError(v);
    default:
      return "";
  }
}

export function CvEditor({
  initial,
  steps,
  currentStep,
  title,
  subtitle,
  icon,
  submitLabel,
  onSubmit,
  onBack,
  backLabel,
}: {
  initial: EditorForm;
  steps: string[];
  currentStep: number;
  title: string;
  subtitle: string;
  icon: ReactNode;
  submitLabel: string;
  onSubmit: (cv: CVResult) => void;
  onBack: () => void;
  backLabel: string;
}) {
  const [form, setForm] = useState<EditorForm>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onField = (key: StringKey) => (value: string) => {
    const v = key === "phone" ? sanitizePhone(value) : value;
    setForm((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  const onBlurField = (key: StringKey) => () =>
    setErrors((prev) => ({ ...prev, [key]: pErr(key, form[key]) }));

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
    const keys: StringKey[] = ["fullName", "jobTitle", "email", "phone", "website"];
    const e: Record<string, string> = {};
    keys.forEach((k) => {
      const msg = pErr(k, form[k]);
      if (msg) e[k] = msg;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    onSubmit(formToCv(form));
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-blue-600"
        >
          <IconArrowLeft className="h-4 w-4" /> {backLabel}
        </button>

        <div className="mt-6">
          <Stepper steps={steps} current={currentStep} />
        </div>

        <Reveal stagger>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {icon}
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-sm text-zinc-600">{subtitle}</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <section className="space-y-4">
              <SectionHeader icon={<IconUser className="h-[18px] w-[18px]" />}>Personal details</SectionHeader>
              <IconField label="Full name" icon={<IconUser />} value={form.fullName} onChange={onField("fullName")} onBlur={onBlurField("fullName")} placeholder="John Doe" error={errors.fullName} />
              <IconField label="Professional title" icon={<IconBriefcase />} value={form.jobTitle} onChange={onField("jobTitle")} onBlur={onBlurField("jobTitle")} placeholder="Software Engineer" error={errors.jobTitle} />
              <div className="grid gap-4 sm:grid-cols-2">
                <IconField label="Email" icon={<IconMail />} value={form.email} onChange={onField("email")} onBlur={onBlurField("email")} placeholder="you@example.com" error={errors.email} type="email" inputMode="email" />
                <IconField label="Phone" icon={<IconPhone />} value={form.phone} onChange={onField("phone")} onBlur={onBlurField("phone")} placeholder="+1 (555) 123-4567" error={errors.phone} type="tel" inputMode="tel" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <IconField label="Location" icon={<IconMapPin />} value={form.location} onChange={onField("location")} placeholder="London, UK" />
                <IconField label="Website / portfolio" icon={<IconGlobe />} value={form.website} onChange={onField("website")} onBlur={onBlurField("website")} placeholder="yoursite.com" error={errors.website} inputMode="url" />
              </div>
            </section>

            <section className="space-y-4">
              <SectionHeader icon={<IconText className="h-[18px] w-[18px]" />}>Professional summary</SectionHeader>
              <FieldTextarea
                label="Summary"
                value={form.summary}
                onChange={onField("summary")}
                rows={3}
                placeholder="A short 2–3 sentence summary of who you are and what you do."
              />
            </section>

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

            <section className="space-y-4">
              <SectionHeader icon={<IconTools className="h-[18px] w-[18px]" />}>Skills</SectionHeader>
              <IconField
                label="Skills (separate with commas)"
                icon={<IconTools />}
                value={form.skills}
                onChange={onField("skills")}
                placeholder="JavaScript, React, Figma, Team leadership"
              />
            </section>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              {submitLabel}
            </button>
          </form>
        </Reveal>
      </div>
    </main>
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
