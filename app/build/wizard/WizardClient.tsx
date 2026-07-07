"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/app/components/AppHeader";
import { CvEditor, EMPTY_FORM, type EditorForm } from "@/app/components/CvEditor";
import { TemplateGallery } from "@/app/components/TemplateGallery";
import { useSeedTemplate } from "@/app/lib/useSeedTemplate";
import { DEFAULT_TEMPLATE, type TemplateId, type Theme } from "@/app/templates";
import { IconField, nameError } from "@/app/components/fields";
import { PeriodField } from "@/app/components/PeriodField";
import { aiSummary } from "@/app/lib/assist";
import {
  IconUser,
  IconBriefcase,
  IconMail,
  IconPhone,
  IconMapPin,
  IconGraduation,
  IconTools,
  IconText,
  IconSparkles,
  IconPlus,
  IconTrash,
  IconArrowLeft,
} from "@/app/components/icons";

type StepId = "personal" | "experience" | "education" | "skills" | "summary";

const STEPS: { id: StepId; title: string; tip: string; icon: React.ReactNode }[] = [
  { id: "personal", title: "The basics", tip: "Just your name and contact info — you can change anything later.", icon: <IconUser className="h-5 w-5" /> },
  { id: "experience", title: "Work experience", tip: "Add your most recent jobs first. Put one thing you did on each line.", icon: <IconBriefcase className="h-5 w-5" /> },
  { id: "education", title: "Education", tip: "Add your degrees, diplomas or courses.", icon: <IconGraduation className="h-5 w-5" /> },
  { id: "skills", title: "Skills", tip: "Separate with commas. List the ones most relevant to the job you want.", icon: <IconTools className="h-5 w-5" /> },
  { id: "summary", title: "A short summary", tip: "2–3 sentences about who you are. Not sure what to write? Let AI draft it.", icon: <IconText className="h-5 w-5" /> },
];

export default function WizardClient() {
  const router = useRouter();
  const { seed } = useSeedTemplate();
  const [form, setForm] = useState<EditorForm>(EMPTY_FORM);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<"wizard" | "template" | "edit">("wizard");
  const [template, setTemplate] = useState<TemplateId>(DEFAULT_TEMPLATE);
  const [seedTheme, setSeedTheme] = useState<Theme | undefined>(undefined);
  const [seeded, setSeeded] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState("");

  // Came in from a saved template (?tpl): use its look and skip the gallery step.
  useEffect(() => {
    if (seed && !seeded) {
      setTemplate(seed.layout);
      setSeedTheme(seed.theme);
      setSeeded(true);
    }
  }, [seed, seeded]);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const optional = step.id !== "personal";

  const set = (key: keyof EditorForm) => (v: string) => setForm((p) => ({ ...p, [key]: v }));

  function next() {
    if (step.id === "personal") {
      const err = nameError(form.firstName, true);
      if (err) {
        setNameErr(err);
        return;
      }
    }
    if (isLast) setPhase(seeded ? "edit" : "template");
    else setStepIndex((i) => i + 1);
  }
  function back() {
    if (stepIndex === 0) router.push("/build");
    else setStepIndex((i) => i - 1);
  }

  // ---- experience list helpers ----
  const addJob = () => setForm((p) => ({ ...p, experience: [...p.experience, { role: "", company: "", period: "", bullets: "" }] }));
  const removeJob = (i: number) => setForm((p) => ({ ...p, experience: p.experience.filter((_, idx) => idx !== i) }));
  const setJob = (i: number, field: "role" | "company" | "period" | "bullets", v: string) =>
    setForm((p) => {
      const list = [...p.experience];
      list[i] = { ...list[i], [field]: v };
      return { ...p, experience: list };
    });

  // ---- education list helpers ----
  const addEdu = () => setForm((p) => ({ ...p, education: [...p.education, { degree: "", institution: "", period: "" }] }));
  const removeEdu = (i: number) => setForm((p) => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }));
  const setEdu = (i: number, field: "degree" | "institution" | "period", v: string) =>
    setForm((p) => {
      const list = [...p.education];
      list[i] = { ...list[i], [field]: v };
      return { ...p, education: list };
    });

  async function writeSummaryWithAi() {
    setAiBusy(true);
    setAiErr("");
    try {
      const exp = form.experience
        .filter((x) => x.role || x.company || x.bullets)
        .map((x) => ({ role: x.role, company: x.company, bullets: x.bullets.split("\n").map((b) => b.trim()).filter(Boolean) }));
      const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const text = await aiSummary({ name: `${form.firstName} ${form.lastName}`.trim(), title: form.jobTitle, summary: form.summary, experience: exp, skills });
      if (text) setForm((p) => ({ ...p, summary: text }));
    } catch (err) {
      setAiErr(err instanceof Error ? err.message : "The AI couldn't help just now.");
    } finally {
      setAiBusy(false);
    }
  }

  // ---- editor / template phases ----
  if (phase === "edit") {
    return (
      <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 print:bg-white">
        <AppHeader />
        <CvEditor
          initial={form}
          initialTemplate={template}
          initialTheme={seedTheme}
          onBack={() => setPhase(seeded ? "wizard" : "template")}
          backLabel={seeded ? "Back to the wizard" : "Back to templates"}
        />
      </div>
    );
  }
  if (phase === "template") {
    return (
      <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 print:bg-white">
        <AppHeader />
        <TemplateGallery
          onSelect={(id) => {
            setTemplate(id);
            setPhase("edit");
          }}
          onBack={() => {
            setPhase("wizard");
            setStepIndex(STEPS.length - 1);
          }}
          backLabel="Back to the wizard"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 site-px py-10">
        {/* progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>
              Step {stepIndex + 1} of {STEPS.length}
            </span>
            <span>{step.title}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all"
              style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* header */}
        <div className="mb-6 flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
            {step.icon}
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{step.title}</h1>
            <p className="mt-1 text-sm text-zinc-600">{step.tip}</p>
          </div>
        </div>

        {/* step body */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          {step.id === "personal" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <IconField
                  label="First name"
                  icon={<IconUser />}
                  value={form.firstName}
                  onChange={(v) => {
                    set("firstName")(v);
                    if (nameErr) setNameErr("");
                  }}
                  placeholder="John"
                  error={nameErr}
                />
                <IconField label="Last name" icon={<IconUser />} value={form.lastName} onChange={set("lastName")} placeholder="Doe" />
              </div>
              <IconField label="Job title" icon={<IconBriefcase />} value={form.jobTitle} onChange={set("jobTitle")} placeholder="Software Engineer" />
              <div className="grid gap-4 sm:grid-cols-2">
                <IconField label="Email" icon={<IconMail />} value={form.email} onChange={set("email")} placeholder="you@example.com" type="email" inputMode="email" />
                <IconField label="Phone" icon={<IconPhone />} value={form.phone} onChange={set("phone")} placeholder="+1 (555) 123-4567" type="tel" inputMode="tel" />
              </div>
              <IconField label="Location" icon={<IconMapPin />} value={form.location} onChange={set("location")} placeholder="London, UK" />
            </div>
          )}

          {step.id === "experience" && (
            <div className="space-y-4">
              {form.experience.map((job, i) => (
                <div key={i} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  {form.experience.length > 1 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-500">Job {i + 1}</span>
                      <button type="button" onClick={() => removeJob(i)} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700">
                        <IconTrash className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label="Role" value={job.role} onChange={(v) => setJob(i, "role", v)} placeholder="Frontend Developer" />
                    <TextField label="Company" value={job.company} onChange={(v) => setJob(i, "company", v)} placeholder="TechCorp" />
                  </div>
                  <PeriodField label="Period" value={job.period} onChange={(v) => setJob(i, "period", v)} />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">What you did (one per line)</label>
                    <textarea
                      value={job.bullets}
                      onChange={(e) => setJob(i, "bullets", e.target.value)}
                      rows={3}
                      placeholder={"Built the new dashboard\nImproved page speed by 40%"}
                      className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 outline-none transition-colors hover:border-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
              <AddButton onClick={addJob}>Add another job</AddButton>
            </div>
          )}

          {step.id === "education" && (
            <div className="space-y-4">
              {form.education.map((ed, i) => (
                <div key={i} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  {form.education.length > 1 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-500">Entry {i + 1}</span>
                      <button type="button" onClick={() => removeEdu(i)} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700">
                        <IconTrash className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  )}
                  <TextField label="Degree / qualification" value={ed.degree} onChange={(v) => setEdu(i, "degree", v)} placeholder="BS Computer Science" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label="Institution" value={ed.institution} onChange={(v) => setEdu(i, "institution", v)} placeholder="State University" />
                    <PeriodField label="Period" value={ed.period} onChange={(v) => setEdu(i, "period", v)} />
                  </div>
                </div>
              ))}
              <AddButton onClick={addEdu}>Add another</AddButton>
            </div>
          )}

          {step.id === "skills" && (
            <TextField
              label="Skills (separate with commas)"
              value={form.skills}
              onChange={set("skills")}
              placeholder="JavaScript, React, Figma, Team leadership"
            />
          )}

          {step.id === "summary" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-700">Professional summary</label>
                <button
                  type="button"
                  onClick={writeSummaryWithAi}
                  disabled={aiBusy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm transition-all hover:-translate-y-px hover:bg-blue-100 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {aiBusy ? (
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
                  ) : (
                    <IconSparkles className="h-3.5 w-3.5" />
                  )}
                  {aiBusy ? "Writing…" : form.summary.trim() ? "Improve with AI" : "Write with AI"}
                </button>
              </div>
              <textarea
                value={form.summary}
                onChange={(e) => set("summary")(e.target.value)}
                rows={4}
                placeholder="A short 2–3 sentence summary of who you are and what you do best."
                className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 outline-none transition-colors hover:border-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {aiErr && <p className="text-sm text-red-600">{aiErr}</p>}
            </div>
          )}
        </div>

        {/* nav */}
        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-blue-600">
            <IconArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center gap-4">
            {optional && (
              <button type="button" onClick={next} className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-700">
                Skip
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all hover:-translate-y-px hover:shadow-md hover:shadow-blue-600/30"
            >
              {isLast ? "Choose a template" : "Continue"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 outline-none transition-colors hover:border-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-300 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-50"
    >
      <IconPlus className="h-4 w-4" /> {children}
    </button>
  );
}
