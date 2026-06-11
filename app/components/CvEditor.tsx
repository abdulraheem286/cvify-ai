"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import type { CVResult } from "@/app/types";
import { ScaledPreview } from "./ScaledPreview";
import { TemplatePicker } from "./TemplatePicker";
import { DEFAULT_TEMPLATE, type TemplateId } from "@/app/templates";
import { TemplateView } from "@/app/templates/TemplateView";
import { downloadCvPdf } from "@/app/lib/pdf";
import {
  IconField,
  FieldTextarea,
  nameError,
  emailError,
  phoneError,
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
  IconEye,
  IconEyeOff,
  IconChevron,
  IconDownload,
  IconAward,
  IconLanguages,
} from "./icons";

export type ExpEntry = { role: string; company: string; period: string; bullets: string };
export type EduEntry = { degree: string; institution: string; period: string };
export type LangEntry = { name: string; level: string };
export type CertEntry = { name: string; issuer: string; year: string };

export type EditorForm = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  photo: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  experience: ExpEntry[];
  education: EduEntry[];
  skills: string;
  languages: LangEntry[];
  certificates: CertEntry[];
};

export const EMPTY_FORM: EditorForm = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  photo: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  summary: "",
  experience: [{ role: "", company: "", period: "", bullets: "" }],
  education: [{ degree: "", institution: "", period: "" }],
  skills: "",
  languages: [{ name: "", level: "" }],
  certificates: [{ name: "", issuer: "", year: "" }],
};

export function cvToForm(cv: CVResult): EditorForm {
  const parts = (cv.fullName ?? "").trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
    jobTitle: cv.jobTitle ?? "",
    photo: cv.photo ?? "",
    email: cv.contact?.email ?? "",
    phone: cv.contact?.phone ?? "",
    location: cv.contact?.location ?? "",
    website: cv.contact?.website ?? "",
    linkedin: cv.contact?.linkedin ?? "",
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
      ? cv.education.map((e) => ({ degree: e.degree ?? "", institution: e.institution ?? "", period: e.period ?? "" }))
      : [{ degree: "", institution: "", period: "" }],
    skills: (cv.skills ?? []).join(", "),
    languages: cv.languages?.length
      ? cv.languages.map((l) => ({ name: l.name ?? "", level: l.level ?? "" }))
      : [{ name: "", level: "" }],
    certificates: cv.certificates?.length
      ? cv.certificates.map((c) => ({ name: c.name ?? "", issuer: c.issuer ?? "", year: c.year ?? "" }))
      : [{ name: "", issuer: "", year: "" }],
  };
}

type SectionKey = "summary" | "experience" | "education" | "skills" | "languages" | "certificates";

// Sample content shown in the PREVIEW only (never in the downloaded PDF),
// so an empty form still looks like a real CV.
const PH = {
  summary:
    "Write a short, punchy summary of who you are and what you do best. The AI can draft this for you, or write it yourself.",
  experience: [
    {
      role: "Job Title",
      company: "Company Name",
      period: "2022 — Present",
      bullets: ["A key achievement or responsibility.", "Another accomplishment with measurable impact."],
    },
    {
      role: "Previous Role",
      company: "Earlier Company",
      period: "2019 — 2022",
      bullets: ["Something you delivered or improved."],
    },
  ],
  education: [{ degree: "Your Degree", institution: "University / School", period: "2015 — 2019" }],
  skills: ["Skill one", "Skill two", "Skill three", "Skill four"],
  languages: [{ name: "English", level: "Native" }],
  certificates: [{ name: "Certificate name", issuer: "Issuer", year: "2023" }],
};

// ph = true fills empty (non-hidden) fields with placeholders for the preview.
function formToCv(form: EditorForm, hidden: Record<SectionKey, boolean>, ph = false): CVResult {
  const fullName = `${form.firstName} ${form.lastName}`.trim();
  const exp = form.experience
    .filter((x) => x.role || x.company || x.bullets)
    .map((x) => ({
      role: x.role,
      company: x.company,
      period: x.period,
      bullets: x.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
    }));
  const edu = form.education.filter((x) => x.degree || x.institution);
  const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
  const langs = form.languages.filter((l) => l.name.trim());
  const certs = form.certificates.filter((c) => c.name.trim());

  return {
    fullName: fullName || (ph ? "Your Name" : ""),
    jobTitle: form.jobTitle || (ph ? "Your Job Title" : ""),
    photo: form.photo || undefined,
    contact: {
      email: form.email || (ph ? "you@email.com" : ""),
      phone: form.phone || (ph ? "+1 (555) 000-0000" : ""),
      location: form.location || (ph ? "City, Country" : ""),
      website: form.website || (ph ? "yourwebsite.com" : ""),
      linkedin: form.linkedin || undefined,
    },
    summary: hidden.summary ? "" : form.summary || (ph ? PH.summary : ""),
    experience: hidden.experience ? [] : exp.length ? exp : ph ? PH.experience : [],
    education: hidden.education ? [] : edu.length ? edu : ph ? PH.education : [],
    skills: hidden.skills ? [] : skills.length ? skills : ph ? PH.skills : [],
    languages: hidden.languages ? [] : langs.length ? langs : ph ? PH.languages : [],
    certificates: hidden.certificates ? [] : certs.length ? certs : ph ? PH.certificates : [],
  };
}

export function CvEditor({
  initial,
  onBack,
  backLabel,
}: {
  initial: EditorForm;
  onBack: () => void;
  backLabel: string;
}) {
  const [form, setForm] = useState<EditorForm>(initial);
  const [hidden, setHidden] = useState<Record<SectionKey, boolean>>({
    summary: false,
    experience: false,
    education: false,
    skills: false,
    languages: true, // off by default — opt in
    certificates: true,
  });
  const [open, setOpen] = useState<Record<string, boolean>>({ personal: true });
  const [template, setTemplate] = useState<TemplateId>(DEFAULT_TEMPLATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [downloading, setDownloading] = useState(false);

  const exportCv = formToCv(form, hidden); // clean — used for the PDF
  const previewCv = formToCv(form, hidden, true); // with placeholders — preview only

  const set = (key: keyof EditorForm) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const setValidated = (key: "firstName" | "email" | "phone") => (v: string) => {
    setForm((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  function blur(key: "firstName" | "email" | "phone") {
    return () =>
      setErrors((prev) => {
        const msg =
          key === "firstName"
            ? nameError(form.firstName, false)
            : key === "email"
              ? emailError(form.email)
              : phoneError(form.phone);
        return { ...prev, [key]: msg };
      });
  }

  function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  // generic helpers for repeatable lists
  function updateList<K extends "experience" | "education" | "languages" | "certificates">(
    key: K,
    i: number,
    field: string,
    value: string,
  ) {
    setForm((prev) => {
      const list = [...(prev[key] as Record<string, string>[])];
      list[i] = { ...list[i], [field]: value };
      return { ...prev, [key]: list };
    });
  }
  function addItem(key: "experience" | "education" | "languages" | "certificates", blank: Record<string, string>) {
    setForm((prev) => ({ ...prev, [key]: [...(prev[key] as Record<string, string>[]), blank] }));
  }
  function removeItem(key: "experience" | "education" | "languages" | "certificates", i: number) {
    setForm((prev) => ({ ...prev, [key]: (prev[key] as unknown[]).filter((_, idx) => idx !== i) }));
  }

  const toggleHide = (k: SectionKey) => setHidden((p) => ({ ...p, [k]: !p[k] }));
  const toggleOpen = (k: string) => setOpen((p) => ({ ...p, [k]: !p[k] }));

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadCvPdf(exportCv.fullName.replace(/\s+/g, "-") || "cv");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 print:p-0">
      {/* Off-screen full-size render for crisp PDF export */}
      <div aria-hidden className="pointer-events-none fixed left-[-9999px] top-0 print:static print:left-0">
        <TemplateView id={template} cv={exportCv} domId="cv-document" />
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-blue-600 print:hidden"
      >
        <IconArrowLeft className="h-4 w-4" /> {backLabel}
      </button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
        {/* EDITOR */}
        <div className="print:hidden">
          <h1 className="text-2xl font-bold tracking-tight">Build your CV</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Fill in the sections below — your preview updates live. Use the eye icon to hide a
            section from the CV.
          </p>

          <div className="mt-6 space-y-3">
            <Panel id="personal" title="Personal Details" icon={<IconUser className="h-[18px] w-[18px]" />} open={!!open.personal} onToggleOpen={() => toggleOpen("personal")}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Profile photo (optional)</label>
                  <div className="flex items-center gap-4">
                    {form.photo ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.photo} alt="" className="h-16 w-16 rounded-full object-cover ring-1 ring-zinc-200" />
                        <button type="button" onClick={() => set("photo")("")} className="text-sm font-medium text-red-600 hover:text-red-700">Remove</button>
                      </>
                    ) : (
                      <label className="cursor-pointer rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-500 transition-colors hover:border-blue-400 hover:text-blue-600">
                        <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
                        Upload photo
                      </label>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconField label="First name" icon={<IconUser />} value={form.firstName} onChange={setValidated("firstName")} onBlur={blur("firstName")} placeholder="John" error={errors.firstName} />
                  <IconField label="Last name" icon={<IconUser />} value={form.lastName} onChange={set("lastName")} placeholder="Doe" />
                </div>
                <IconField label="Job title" icon={<IconBriefcase />} value={form.jobTitle} onChange={set("jobTitle")} placeholder="Software Engineer" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconField label="Email" icon={<IconMail />} value={form.email} onChange={setValidated("email")} onBlur={blur("email")} placeholder="you@example.com" error={errors.email} type="email" inputMode="email" />
                  <IconField label="Phone" icon={<IconPhone />} value={form.phone} onChange={setValidated("phone")} onBlur={blur("phone")} placeholder="+1 (555) 123-4567" error={errors.phone} type="tel" inputMode="tel" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconField label="Location" icon={<IconMapPin />} value={form.location} onChange={set("location")} placeholder="London, UK" />
                  <IconField label="Website" icon={<IconGlobe />} value={form.website} onChange={set("website")} placeholder="yoursite.com" />
                </div>
                <IconField label="LinkedIn (optional)" icon={<IconGlobe />} value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/you" />
              </div>
            </Panel>

            <Panel id="summary" title="Summary" icon={<IconText className="h-[18px] w-[18px]" />} open={!!open.summary} onToggleOpen={() => toggleOpen("summary")} hideable hidden={hidden.summary} onToggleHide={() => toggleHide("summary")}>
              <FieldTextarea label="Professional summary" value={form.summary} onChange={set("summary")} rows={3} placeholder="A short 2–3 sentence summary of who you are and what you do." />
            </Panel>

            <Panel id="experience" title="Experience" icon={<IconBriefcase className="h-[18px] w-[18px]" />} open={!!open.experience} onToggleOpen={() => toggleOpen("experience")} hideable hidden={hidden.experience} onToggleHide={() => toggleHide("experience")}>
              {form.experience.map((exp, i) => (
                <div key={i} className="mb-3 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PlainInput label="Role" value={exp.role} onChange={(v) => updateList("experience", i, "role", v)} placeholder="Frontend Developer" />
                    <PlainInput label="Company" value={exp.company} onChange={(v) => updateList("experience", i, "company", v)} placeholder="TechCorp" />
                  </div>
                  <PlainInput label="Period" value={exp.period} onChange={(v) => updateList("experience", i, "period", v)} placeholder="2022 – Present" />
                  <FieldTextarea label="Bullet points (one per line)" value={exp.bullets} onChange={(v) => updateList("experience", i, "bullets", v)} rows={3} placeholder={"Built the new dashboard\nImproved page speed by 40%"} />
                  {form.experience.length > 1 && (
                    <RemoveBtn onClick={() => removeItem("experience", i)}>Remove job</RemoveBtn>
                  )}
                </div>
              ))}
              <AddBtn onClick={() => addItem("experience", { role: "", company: "", period: "", bullets: "" })}>Add job</AddBtn>
            </Panel>

            <Panel id="education" title="Education" icon={<IconGraduation className="h-[18px] w-[18px]" />} open={!!open.education} onToggleOpen={() => toggleOpen("education")} hideable hidden={hidden.education} onToggleHide={() => toggleHide("education")}>
              {form.education.map((ed, i) => (
                <div key={i} className="mb-3 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                  <PlainInput label="Degree" value={ed.degree} onChange={(v) => updateList("education", i, "degree", v)} placeholder="BS Computer Science" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PlainInput label="Institution" value={ed.institution} onChange={(v) => updateList("education", i, "institution", v)} placeholder="State University" />
                    <PlainInput label="Period" value={ed.period} onChange={(v) => updateList("education", i, "period", v)} placeholder="2014 – 2018" />
                  </div>
                  {form.education.length > 1 && <RemoveBtn onClick={() => removeItem("education", i)}>Remove entry</RemoveBtn>}
                </div>
              ))}
              <AddBtn onClick={() => addItem("education", { degree: "", institution: "", period: "" })}>Add education</AddBtn>
            </Panel>

            <Panel id="skills" title="Skills" icon={<IconTools className="h-[18px] w-[18px]" />} open={!!open.skills} onToggleOpen={() => toggleOpen("skills")} hideable hidden={hidden.skills} onToggleHide={() => toggleHide("skills")}>
              <PlainInput label="Skills (separate with commas)" value={form.skills} onChange={set("skills")} placeholder="JavaScript, React, Figma, Team leadership" />
            </Panel>

            <Panel id="languages" title="Languages" icon={<IconLanguages className="h-[18px] w-[18px]" />} open={!!open.languages} onToggleOpen={() => toggleOpen("languages")} hideable hidden={hidden.languages} onToggleHide={() => toggleHide("languages")}>
              {form.languages.map((l, i) => (
                <div key={i} className="mb-3 grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <PlainInput label="Language" value={l.name} onChange={(v) => updateList("languages", i, "name", v)} placeholder="English" />
                  <PlainInput label="Level" value={l.level} onChange={(v) => updateList("languages", i, "level", v)} placeholder="Native" />
                  {form.languages.length > 1 && <RemoveBtn onClick={() => removeItem("languages", i)}>Remove</RemoveBtn>}
                </div>
              ))}
              <AddBtn onClick={() => addItem("languages", { name: "", level: "" })}>Add language</AddBtn>
            </Panel>

            <Panel id="certificates" title="Certificates" icon={<IconAward className="h-[18px] w-[18px]" />} open={!!open.certificates} onToggleOpen={() => toggleOpen("certificates")} hideable hidden={hidden.certificates} onToggleHide={() => toggleHide("certificates")}>
              {form.certificates.map((c, i) => (
                <div key={i} className="mb-3 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                  <PlainInput label="Name" value={c.name} onChange={(v) => updateList("certificates", i, "name", v)} placeholder="Google UX Design Certificate" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PlainInput label="Issuer" value={c.issuer} onChange={(v) => updateList("certificates", i, "issuer", v)} placeholder="Coursera" />
                    <PlainInput label="Year" value={c.year} onChange={(v) => updateList("certificates", i, "year", v)} placeholder="2022" />
                  </div>
                  {form.certificates.length > 1 && <RemoveBtn onClick={() => removeItem("certificates", i)}>Remove</RemoveBtn>}
                </div>
              ))}
              <AddBtn onClick={() => addItem("certificates", { name: "", issuer: "", year: "" })}>Add certificate</AddBtn>
            </Panel>
          </div>
        </div>

        {/* LIVE PREVIEW */}
        <div className="print:hidden">
          <div className="lg:sticky lg:top-20">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              <IconDownload className="h-[18px] w-[18px]" />
              {downloading ? "Preparing PDF…" : "Download PDF"}
            </button>

            <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <TemplatePicker value={template} onChange={setTemplate} />
            </div>

            <div className="mt-4">
              <ScaledPreview>
                <TemplateView id={template} cv={previewCv} domId="live-cv" />
              </ScaledPreview>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Panel({
  title,
  icon,
  open,
  onToggleOpen,
  hideable,
  hidden,
  onToggleHide,
  children,
}: {
  id: string;
  title: string;
  icon: ReactNode;
  open: boolean;
  onToggleOpen: () => void;
  hideable?: boolean;
  hidden?: boolean;
  onToggleHide?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <button type="button" onClick={onToggleOpen} className="flex flex-1 items-center gap-3 text-left">
          <span className="text-blue-600">{icon}</span>
          <span className="font-medium text-zinc-900">{title}</span>
        </button>
        <div className="flex items-center gap-1">
          {hideable && (
            <button
              type="button"
              onClick={onToggleHide}
              title={hidden ? "Show on CV" : "Hide from CV"}
              className="rounded p-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
            >
              {hidden ? <IconEyeOff className="h-[18px] w-[18px]" /> : <IconEye className="h-[18px] w-[18px]" />}
            </button>
          )}
          <button type="button" onClick={onToggleOpen} className="rounded p-1.5 text-zinc-400">
            <IconChevron className={`h-[18px] w-[18px] transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <div className={`border-t border-zinc-100 px-4 py-4 ${hidden ? "opacity-50" : ""}`}>{children}</div>
      )}
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

function AddBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
      <IconPlus className="h-4 w-4" /> {children}
    </button>
  );
}

function RemoveBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700">
      <IconTrash className="h-4 w-4" /> {children}
    </button>
  );
}
