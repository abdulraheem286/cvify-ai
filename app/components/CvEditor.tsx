"use client";

import { useState, useEffect, useRef, type ChangeEvent, type ReactNode, type DragEvent } from "react";
import type { CVResult } from "@/app/types";
import { ScaledPreview } from "./ScaledPreview";
import { TemplatePicker } from "./TemplatePicker";
import { CustomizationPanel } from "./CustomizationPanel";
import { DEFAULT_TEMPLATE, getDefaultTheme, type TemplateId, type Theme } from "@/app/templates";
import { TemplateView } from "@/app/templates/TemplateView";
import { downloadCvPdf } from "@/app/lib/pdf";
import { aiSummary, aiBullets, aiSkills } from "@/app/lib/assist";
import { RichTextarea } from "./RichTextarea";
import {
  IconField,
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
  IconSparkles,
  IconTarget,
  IconGrip,
} from "./icons";

export type ExpEntry = { role: string; company: string; period: string; bullets: string };
export type EduEntry = { degree: string; institution: string; period: string };
export type LangEntry = { name: string; level: string };
export type CertEntry = { name: string; issuer: string; year: string };
export type CustomItem = { title: string; subtitle: string; period: string; description: string };
export type CustomSection = { heading: string; items: CustomItem[] };

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
  customSections: CustomSection[];
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
  customSections: [],
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
    customSections: cv.customSections?.length
      ? cv.customSections.map((s) => ({
          heading: s.heading ?? "",
          items: s.items?.length
            ? s.items.map((it) => ({
                title: it.title ?? "",
                subtitle: it.subtitle ?? "",
                period: it.period ?? "",
                description: it.description ?? "",
              }))
            : [{ title: "", subtitle: "", period: "", description: "" }],
        }))
      : [],
  };
}

type SectionKey = "summary" | "experience" | "education" | "skills" | "languages" | "certificates" | "customSections";

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
      bullets: x.bullets.split("\n").map((b) => b.trim().replace(/^[-*]\s+/, "")).filter(Boolean),
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
    customSections: hidden.customSections
      ? []
      : form.customSections
          .map((s) => ({
            heading: s.heading.trim(),
            items: s.items
              .filter((it) => it.title.trim() || it.description.trim() || it.subtitle.trim())
              .map((it) => ({
                title: it.title.trim(),
                subtitle: it.subtitle.trim(),
                period: it.period.trim(),
                description: it.description.trim(),
              })),
          }))
          .filter((s) => s.heading && s.items.length),
  };
}

const DRAFT_KEY = "cvify:draft:v1";

type Draft = {
  form: EditorForm;
  template: TemplateId;
  theme: Theme;
  hidden: Record<SectionKey, boolean>;
  savedAt: number;
};

function formHasContent(f: EditorForm): boolean {
  return Boolean(
    f.firstName || f.lastName || f.jobTitle || f.summary || f.skills ||
      f.experience.some((e) => e.role || e.company || e.bullets) ||
      f.education.some((e) => e.degree || e.institution) ||
      f.customSections.some((s) => s.heading || s.items.some((i) => i.title || i.description)),
  );
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

export function CvEditor({
  initial,
  initialTemplate = DEFAULT_TEMPLATE,
  onBack,
  backLabel,
}: {
  initial: EditorForm;
  initialTemplate?: TemplateId;
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
    customSections: false,
  });
  const [open, setOpen] = useState<Record<string, boolean>>({ personal: true });
  const [template, setTemplate] = useState<TemplateId>(initialTemplate);
  const [theme, setTheme] = useState<Theme>(() => getDefaultTheme(initialTemplate));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [downloading, setDownloading] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null); // which AI action is running
  const [aiError, setAiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null); // a recoverable saved draft
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [tailorOpen, setTailorOpen] = useState(false);
  const [jd, setJd] = useState("");
  const [tailoring, setTailoring] = useState(false);
  const [tailorError, setTailorError] = useState<string | null>(null);
  const [tailorResult, setTailorResult] = useState<{ missingSkills: string[]; notes: string } | null>(null);
  const firstSave = useRef(true);
  const dragRef = useRef<{ kind: string; index: number } | null>(null);

  const exportCv = formToCv(form, hidden); // clean — used for the PDF
  const previewCv = formToCv(form, hidden, true); // with placeholders — preview only

  // Offer to restore a previously saved draft (never auto-clobbers the current one).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as Draft;
        if (d?.form && formHasContent(d.form)) setDraft(d);
      }
    } catch {
      /* ignore unreadable draft */
    }
  }, []);

  // Auto-save the editor state to the browser (debounced). Skips the first mount.
  useEffect(() => {
    if (firstSave.current) {
      firstSave.current = false;
      return;
    }
    setSaving(true);
    const t = setTimeout(() => {
      const payload: Draft = { form, template, theme, hidden, savedAt: Date.now() };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } catch {
        // Storage full (usually a large photo) — retry without the photo.
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...payload, form: { ...form, photo: "" } }));
        } catch {
          /* give up silently */
        }
      }
      setSaving(false);
      setSavedAt(Date.now());
    }, 600);
    return () => clearTimeout(t);
  }, [form, template, theme, hidden]);

  function restoreDraft() {
    if (!draft) return;
    setForm(draft.form);
    if (draft.template) setTemplate(draft.template);
    if (draft.theme) setTheme(draft.theme);
    if (draft.hidden) setHidden(draft.hidden);
    setDraft(null);
  }

  function startFresh() {
    setForm(EMPTY_FORM);
    setDraft(null);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }

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
  function moveItem(key: "experience" | "education" | "languages" | "certificates", i: number, dir: -1 | 1) {
    setForm((prev) => {
      const list = [...(prev[key] as unknown[])];
      const j = i + dir;
      if (j < 0 || j >= list.length) return prev;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...prev, [key]: list };
    });
  }

  // ---- drag-to-reorder (handle-based, native DnD) ----
  function reorder<T>(arr: T[], from: number, to: number): T[] {
    const l = [...arr];
    const [it] = l.splice(from, 1);
    l.splice(to, 0, it);
    return l;
  }
  function gripProps(kind: string, index: number) {
    return {
      draggable: true,
      onDragStart: (e: DragEvent) => {
        dragRef.current = { kind, index };
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      },
      onDragEnd: () => {
        dragRef.current = null;
      },
    };
  }
  function dropProps(kind: string, index: number, onReorder: (from: number, to: number) => void) {
    return {
      onDragOver: (e: DragEvent) => {
        if (dragRef.current?.kind === kind) e.preventDefault();
      },
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        const d = dragRef.current;
        if (d && d.kind === kind && d.index !== index) onReorder(d.index, index);
        dragRef.current = null;
      },
    };
  }

  // ---- custom sections (nested list) ----
  const blankCustomItem = (): CustomItem => ({ title: "", subtitle: "", period: "", description: "" });
  function addCustomSection() {
    setForm((p) => ({ ...p, customSections: [...p.customSections, { heading: "", items: [blankCustomItem()] }] }));
  }
  function removeCustomSection(i: number) {
    setForm((p) => ({ ...p, customSections: p.customSections.filter((_, idx) => idx !== i) }));
  }
  function updateCustomHeading(i: number, value: string) {
    setForm((p) => {
      const cs = [...p.customSections];
      cs[i] = { ...cs[i], heading: value };
      return { ...p, customSections: cs };
    });
  }
  function addCustomItem(i: number) {
    setForm((p) => {
      const cs = [...p.customSections];
      cs[i] = { ...cs[i], items: [...cs[i].items, blankCustomItem()] };
      return { ...p, customSections: cs };
    });
  }
  function removeCustomItem(i: number, j: number) {
    setForm((p) => {
      const cs = [...p.customSections];
      cs[i] = { ...cs[i], items: cs[i].items.filter((_, idx) => idx !== j) };
      return { ...p, customSections: cs };
    });
  }
  function updateCustomItem(i: number, j: number, field: keyof CustomItem, value: string) {
    setForm((p) => {
      const cs = [...p.customSections];
      const items = [...cs[i].items];
      items[j] = { ...items[j], [field]: value };
      cs[i] = { ...cs[i], items };
      return { ...p, customSections: cs };
    });
  }
  function moveCustomSection(i: number, dir: -1 | 1) {
    setForm((p) => {
      const cs = [...p.customSections];
      const j = i + dir;
      if (j < 0 || j >= cs.length) return p;
      [cs[i], cs[j]] = [cs[j], cs[i]];
      return { ...p, customSections: cs };
    });
  }
  function moveCustomItem(i: number, j: number, dir: -1 | 1) {
    setForm((p) => {
      const cs = [...p.customSections];
      const items = [...cs[i].items];
      const k = j + dir;
      if (k < 0 || k >= items.length) return p;
      [items[j], items[k]] = [items[k], items[j]];
      cs[i] = { ...cs[i], items };
      return { ...p, customSections: cs };
    });
  }

  const toggleHide = (k: SectionKey) => setHidden((p) => ({ ...p, [k]: !p[k] }));
  const toggleOpen = (k: string) => setOpen((p) => ({ ...p, [k]: !p[k] }));
  const PANEL_IDS = ["personal", "summary", "experience", "education", "skills", "languages", "certificates", "customSections"];
  const setAllOpen = (v: boolean) => setOpen(Object.fromEntries(PANEL_IDS.map((k) => [k, v])));

  async function handleDownload() {
    setDownloading(true);
    const name = exportCv.fullName.replace(/\s+/g, "-") || "cv";
    try {
      // Server-side print → real selectable / ATS-readable text PDF.
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv: exportCv, template, theme, fileName: name }),
      });
      if (!res.ok) throw new Error("server pdf failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: the original client-side image PDF, so download never fails.
      console.error("Server PDF failed, falling back to image PDF:", err);
      try {
        await downloadCvPdf(name);
      } catch (e2) {
        console.error("Image PDF fallback failed:", e2);
      }
    } finally {
      setDownloading(false);
    }
  }

  // ---- AI assist (in-editor) ----
  async function runAi(key: string, fn: () => Promise<void>) {
    setAiBusy(key);
    setAiError(null);
    try {
      await fn();
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "The AI couldn't help with that.");
    } finally {
      setAiBusy(null);
    }
  }

  const buildExp = () =>
    form.experience
      .filter((x) => x.role || x.company || x.bullets)
      .map((x) => ({
        role: x.role,
        company: x.company,
        bullets: x.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
      }));

  const skillList = () => form.skills.split(",").map((s) => s.trim()).filter(Boolean);

  const handleAiSummary = () =>
    runAi("summary", async () => {
      const text = await aiSummary({
        name: `${form.firstName} ${form.lastName}`.trim(),
        title: form.jobTitle,
        summary: form.summary,
        experience: buildExp(),
        skills: skillList(),
      });
      if (text) setForm((p) => ({ ...p, summary: text }));
    });

  const handleAiBullets = (i: number) =>
    runAi(`bullets-${i}`, async () => {
      const job = form.experience[i];
      const bullets = await aiBullets({ role: job.role, company: job.company, bullets: job.bullets });
      if (bullets.length) updateList("experience", i, "bullets", bullets.join("\n"));
    });

  const handleAiSkills = () =>
    runAi("skills", async () => {
      const existing = skillList();
      const suggested = await aiSkills({ title: form.jobTitle, experience: buildExp(), skills: existing });
      if (suggested.length) {
        const merged = [...existing];
        for (const s of suggested) {
          if (!merged.some((e) => e.toLowerCase() === s.toLowerCase())) merged.push(s);
        }
        setForm((p) => ({ ...p, skills: merged.join(", ") }));
      }
    });

  // ---- Tailor to a job description ----
  async function handleTailor() {
    if (!jd.trim()) {
      setTailorError("Paste a job description first.");
      return;
    }
    setTailoring(true);
    setTailorError(null);
    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd, cv: exportCv }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setForm((prev) => {
        const next = { ...prev };
        if (data.summary) next.summary = data.summary;
        if (Array.isArray(data.experience) && data.experience.length) {
          let k = 0;
          next.experience = prev.experience.map((x) => {
            const nonEmpty = x.role || x.company || x.bullets;
            if (nonEmpty) {
              const t = data.experience[k];
              k += 1;
              if (t && Array.isArray(t.bullets) && t.bullets.length) {
                return { ...x, bullets: t.bullets.join("\n") };
              }
            }
            return x;
          });
        }
        return next;
      });
      setTailorResult({ missingSkills: data.missingSkills ?? [], notes: data.notes ?? "" });
    } catch (err) {
      setTailorError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setTailoring(false);
    }
  }

  function addSkill(skill: string) {
    setForm((prev) => {
      const existing = prev.skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (existing.some((e) => e.toLowerCase() === skill.toLowerCase())) return prev;
      return { ...prev, skills: [...existing, skill].join(", ") };
    });
    setTailorResult((r) => (r ? { ...r, missingSkills: r.missingSkills.filter((s) => s !== skill) } : r));
  }

  return (
    <main className="mx-auto w-full max-w-[1920px] flex-1 px-4 py-8 sm:px-6 print:p-0">
      {/* Off-screen full-size render for crisp PDF export */}
      <div aria-hidden className="pointer-events-none fixed left-[-9999px] top-0 print:static print:left-0">
        <TemplateView id={template} cv={exportCv} domId="cv-document" theme={theme} />
      </div>

      {/* Toolbar */}
      <div className="-mx-4 mb-6 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3 print:hidden sm:-mx-6 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-blue-600"
        >
          <IconArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">{backLabel}</span>
        </button>
        <div className="flex items-center gap-2">
          {savedAt && (
            <button type="button" onClick={startFresh} className="hidden text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-700 sm:inline">
              Start fresh
            </button>
          )}
          {(saving || savedAt) && (
            <span className="hidden text-xs text-zinc-400 md:inline">{saving ? "Saving…" : "Saved ✓"}</span>
          )}
          <button
            type="button"
            onClick={() => setTailorOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <IconTarget className="h-[18px] w-[18px] text-blue-600" />
            <span className="hidden lg:inline">Tailor to job</span>
          </button>
          <TemplatePicker value={template} onChange={setTemplate} />
          <CustomizationPanel value={theme} onChange={setTheme} />
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {downloading ? (
              <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <IconDownload className="h-[18px] w-[18px]" />
            )}
            <span className="hidden sm:inline">{downloading ? "Preparing…" : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {draft && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 print:hidden">
          <p className="text-sm text-blue-900">
            You have an unsaved draft from {timeAgo(draft.savedAt)}. Restore it?
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={restoreDraft} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
              Restore
            </button>
            <button type="button" onClick={() => setDraft(null)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Mobile Edit / Preview toggle */}
      <div className="mb-5 flex rounded-xl border border-zinc-200 bg-white p-1 lg:hidden print:hidden">
        <button
          type="button"
          onClick={() => setMobileView("edit")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mobileView === "edit" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-600"}`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mobileView === "preview" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-600"}`}
        >
          Preview
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,640px)]">
        {/* EDITOR */}
        <div className={`print:hidden ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
          <h1 className="text-2xl font-bold tracking-tight">Build your CV</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Fill in the sections below — your preview updates live. Use the eye icon to hide a
            section from the CV. Look for the <span className="font-medium text-blue-600">AI buttons</span> to
            write or improve content.
          </p>

          {aiError && (
            <div className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <span>{aiError}</span>
              <button type="button" onClick={() => setAiError(null)} className="shrink-0 font-medium hover:underline">
                Dismiss
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Sections</p>
            <div className="flex items-center gap-2 text-xs">
              <button type="button" onClick={() => setAllOpen(true)} className="font-medium text-zinc-500 transition-colors hover:text-blue-600">
                Expand all
              </button>
              <span className="text-zinc-300">·</span>
              <button type="button" onClick={() => setAllOpen(false)} className="font-medium text-zinc-500 transition-colors hover:text-blue-600">
                Collapse all
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3">
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
              <div className="mb-2 flex justify-end">
                <AiButton onClick={handleAiSummary} busy={aiBusy === "summary"}>
                  {form.summary.trim() ? "Improve with AI" : "Write with AI"}
                </AiButton>
              </div>
              <RichTextarea label="Professional summary" value={form.summary} onChange={set("summary")} rows={3} placeholder="A short 2–3 sentence summary of who you are and what you do." />
            </Panel>

            <Panel id="experience" title="Experience" icon={<IconBriefcase className="h-[18px] w-[18px]" />} open={!!open.experience} onToggleOpen={() => toggleOpen("experience")} hideable hidden={hidden.experience} onToggleHide={() => toggleHide("experience")}>
              {form.experience.map((exp, i) => (
                <div key={i} {...dropProps("experience", i, (f, t) => setForm((p) => ({ ...p, experience: reorder(p.experience, f, t) })))} className="mb-3 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                  {form.experience.length > 1 && (
                    <div className="flex items-center justify-between">
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-white px-1.5 text-xs font-semibold text-zinc-500 ring-1 ring-inset ring-zinc-200">
                        {i + 1}
                      </span>
                      <div className="flex items-center">
                        <MoveBtns onUp={() => moveItem("experience", i, -1)} onDown={() => moveItem("experience", i, 1)} isFirst={i === 0} isLast={i === form.experience.length - 1} />
                        <DragHandle bind={gripProps("experience", i)} />
                      </div>
                    </div>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <PlainInput label="Role" value={exp.role} onChange={(v) => updateList("experience", i, "role", v)} placeholder="Frontend Developer" />
                    <PlainInput label="Company" value={exp.company} onChange={(v) => updateList("experience", i, "company", v)} placeholder="TechCorp" />
                  </div>
                  <PlainInput label="Period" value={exp.period} onChange={(v) => updateList("experience", i, "period", v)} placeholder="2022 – Present" />
                  <RichTextarea label="Bullet points" value={exp.bullets} onChange={(v) => updateList("experience", i, "bullets", v)} rows={3} placeholder={"Built the new dashboard\nImproved page speed by 40%"} list={false} bulletList />
                  <div className="flex items-center justify-between">
                    <AiButton onClick={() => handleAiBullets(i)} busy={aiBusy === `bullets-${i}`} disabled={!exp.bullets.trim()}>
                      Improve bullets
                    </AiButton>
                    {form.experience.length > 1 && (
                      <RemoveBtn onClick={() => removeItem("experience", i)}>Remove job</RemoveBtn>
                    )}
                  </div>
                </div>
              ))}
              <AddBtn onClick={() => addItem("experience", { role: "", company: "", period: "", bullets: "" })}>Add job</AddBtn>
            </Panel>

            <Panel id="education" title="Education" icon={<IconGraduation className="h-[18px] w-[18px]" />} open={!!open.education} onToggleOpen={() => toggleOpen("education")} hideable hidden={hidden.education} onToggleHide={() => toggleHide("education")}>
              {form.education.map((ed, i) => (
                <div key={i} {...dropProps("education", i, (f, t) => setForm((p) => ({ ...p, education: reorder(p.education, f, t) })))} className="mb-3 space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                  {form.education.length > 1 && (
                    <div className="flex items-center justify-between">
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-white px-1.5 text-xs font-semibold text-zinc-500 ring-1 ring-inset ring-zinc-200">
                        {i + 1}
                      </span>
                      <div className="flex items-center">
                        <MoveBtns onUp={() => moveItem("education", i, -1)} onDown={() => moveItem("education", i, 1)} isFirst={i === 0} isLast={i === form.education.length - 1} />
                        <DragHandle bind={gripProps("education", i)} />
                      </div>
                    </div>
                  )}
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
              <div className="mt-2">
                <AiButton onClick={handleAiSkills} busy={aiBusy === "skills"}>Suggest skills</AiButton>
              </div>
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

            <Panel id="customSections" title="Custom Sections" icon={<IconText className="h-[18px] w-[18px]" />} open={!!open.customSections} onToggleOpen={() => toggleOpen("customSections")} hideable hidden={hidden.customSections} onToggleHide={() => toggleHide("customSections")}>
              <p className="mb-3 text-xs text-zinc-500">
                Add your own sections — name them anything (Projects, Awards, Volunteering, Publications…).
              </p>
              {form.customSections.map((s, i) => (
                <div key={i} {...dropProps("section", i, (f, t) => setForm((p) => ({ ...p, customSections: reorder(p.customSections, f, t) })))} className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                  <PlainInput label="Section name" value={s.heading} onChange={(v) => updateCustomHeading(i, v)} placeholder="Projects, Awards, Volunteering…" />
                  <div className="mt-3 space-y-3">
                    {s.items.map((it, j) => (
                      <div key={j} {...dropProps(`item-${i}`, j, (f, t) => setForm((p) => { const cs = [...p.customSections]; cs[i] = { ...cs[i], items: reorder(cs[i].items, f, t) }; return { ...p, customSections: cs }; }))} className="space-y-2 rounded-lg border border-zinc-200 bg-white p-3">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <PlainInput label="Title" value={it.title} onChange={(v) => updateCustomItem(i, j, "title", v)} placeholder="Project / award name" />
                          <PlainInput label="Subtitle (optional)" value={it.subtitle} onChange={(v) => updateCustomItem(i, j, "subtitle", v)} placeholder="Role / issuer" />
                        </div>
                        <PlainInput label="Date (optional)" value={it.period} onChange={(v) => updateCustomItem(i, j, "period", v)} placeholder="2023" />
                        <RichTextarea label="Description (optional)" value={it.description} onChange={(v) => updateCustomItem(i, j, "description", v)} rows={2} placeholder="One or two lines about it." />
                        {s.items.length > 1 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MoveBtns onUp={() => moveCustomItem(i, j, -1)} onDown={() => moveCustomItem(i, j, 1)} isFirst={j === 0} isLast={j === s.items.length - 1} />
                              <DragHandle bind={gripProps(`item-${i}`, j)} />
                            </div>
                            <RemoveBtn onClick={() => removeCustomItem(i, j)}>Remove item</RemoveBtn>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <AddBtn onClick={() => addCustomItem(i)}>Add item</AddBtn>
                    <div className="flex items-center gap-2">
                      {form.customSections.length > 1 && (
                        <>
                          <MoveBtns onUp={() => moveCustomSection(i, -1)} onDown={() => moveCustomSection(i, 1)} isFirst={i === 0} isLast={i === form.customSections.length - 1} />
                          <DragHandle bind={gripProps("section", i)} />
                        </>
                      )}
                      <RemoveBtn onClick={() => removeCustomSection(i)}>Remove section</RemoveBtn>
                    </div>
                  </div>
                </div>
              ))}
              <AddBtn onClick={addCustomSection}>Add a section</AddBtn>
            </Panel>
          </div>
        </div>

        {/* LIVE PREVIEW */}
        <div className={`print:hidden ${mobileView === "edit" ? "hidden lg:block" : ""}`}>
          <div className="lg:sticky lg:top-6">
            <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live preview
            </p>
            <div className="rounded-2xl bg-zinc-100 p-4 ring-1 ring-zinc-200">
              <ScaledPreview maxHeight={800}>
                <TemplateView id={template} cv={previewCv} domId="live-cv" theme={theme} />
              </ScaledPreview>
            </div>
          </div>
        </div>
      </div>

      {tailorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
          <button aria-hidden tabIndex={-1} onClick={() => setTailorOpen(false)} className="absolute inset-0 cursor-default bg-black/40" />
          <div className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <IconTarget className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Tailor to a job</h2>
                <p className="text-sm text-zinc-500">Paste a job description — AI re-angles your summary and bullets to match it.</p>
              </div>
            </div>

            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={8}
              placeholder="Paste the full job description here…"
              className="mt-4 w-full resize-y rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleTailor}
              disabled={tailoring}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {tailoring ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Tailoring…
                </>
              ) : (
                <>
                  <IconTarget className="h-[18px] w-[18px]" /> Tailor my CV
                </>
              )}
            </button>
            <p className="mt-2 text-center text-xs text-zinc-400">
              Uses only your real experience — nothing is invented. Review the changes after.
            </p>

            {tailorError && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{tailorError}</p>
            )}

            {tailorResult && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-800">✓ Summary and bullet points tailored to this job.</p>
                {tailorResult.notes && <p className="mt-1 text-sm text-emerald-700">{tailorResult.notes}</p>}
                {tailorResult.missingSkills.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Skills this job asks for that you haven&apos;t listed
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tailorResult.missingSkills.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => addSkill(s)}
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-white px-2.5 py-1 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-emerald-600">Tap to add — only include skills you genuinely have.</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setTailorOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
              >
                {tailorResult ? "Done" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
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
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <button type="button" onClick={onToggleOpen} className="flex flex-1 items-center gap-3 text-left">
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${open ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}>
            {icon}
          </span>
          <span className="font-medium text-zinc-900">{title}</span>
          {hideable && hidden && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              Hidden
            </span>
          )}
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
          <button type="button" onClick={onToggleOpen} title={open ? "Collapse" : "Expand"} aria-label={open ? "Collapse" : "Expand"} className="rounded p-1.5 text-zinc-400 transition-colors hover:text-zinc-700">
            <IconChevron className={`h-[18px] w-[18px] transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      {open && <div className="border-t border-zinc-100 px-4 py-4">{children}</div>}
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

function DragHandle({ bind }: { bind: { draggable: boolean; onDragStart: (e: DragEvent) => void; onDragEnd: () => void } }) {
  return (
    <span
      {...bind}
      title="Drag to reorder"
      aria-label="Drag to reorder"
      className="flex cursor-grab items-center justify-center rounded p-1 text-zinc-400 transition-colors hover:text-zinc-700 active:cursor-grabbing"
    >
      <IconGrip className="h-4 w-4" />
    </span>
  );
}

function MoveBtns({ onUp, onDown, isFirst, isLast }: { onUp: () => void; onDown: () => void; isFirst: boolean; isLast: boolean }) {
  return (
    <div className="flex items-center">
      <button type="button" onClick={onUp} disabled={isFirst} title="Move up" className="rounded p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30">
        <IconChevron className="h-4 w-4 rotate-180" />
      </button>
      <button type="button" onClick={onDown} disabled={isLast} title="Move down" className="rounded p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30">
        <IconChevron className="h-4 w-4" />
      </button>
    </div>
  );
}

function AiButton({
  onClick,
  busy,
  disabled,
  children,
}: {
  onClick: () => void;
  busy: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || disabled}
      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {busy ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
      ) : (
        <IconSparkles className="h-3.5 w-3.5" />
      )}
      {busy ? "Working…" : children}
    </button>
  );
}
