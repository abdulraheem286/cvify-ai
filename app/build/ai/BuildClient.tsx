"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CVResult } from "@/app/types";
import { Reveal } from "@/app/components/Reveal";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { CvEditor, cvToForm, type EditorForm } from "@/app/components/CvEditor";
import { TemplateGallery } from "@/app/components/TemplateGallery";
import { DEFAULT_TEMPLATE, type TemplateId } from "@/app/templates";
import {
  IconField,
  FieldTextarea,
  nameError,
  emailError,
  phoneError,
  urlError,
  sanitizePhone,
} from "@/app/components/fields";
import {
  IconUser,
  IconBriefcase,
  IconMail,
  IconPhone,
  IconMapPin,
  IconGlobe,
  IconSparkles,
  IconArrowLeft,
} from "@/app/components/icons";

type AIForm = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  experience: string;
};

const EMPTY_AI: AIForm = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  experience: "",
};

function aiFieldError(key: keyof AIForm, v: string): string {
  switch (key) {
    case "name":
      return nameError(v, true);
    case "email":
      return emailError(v);
    case "phone":
      return phoneError(v);
    case "website":
      return urlError(v);
    case "experience":
      return v.trim() ? "" : "Add some background so the AI has something to work with.";
    default:
      return "";
  }
}

export default function BuildClient() {
  const router = useRouter();
  const [step, setStep] = useState<"template" | "ai" | "edit">("template");
  const [chosen, setChosen] = useState<TemplateId>(DEFAULT_TEMPLATE);
  const [aiForm, setAiForm] = useState<AIForm>(EMPTY_AI);
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorInitial, setEditorInitial] = useState<EditorForm | null>(null);

  const onAi = (key: keyof AIForm) => (value: string) => {
    const v = key === "phone" ? sanitizePhone(value) : value;
    setAiForm((prev) => ({ ...prev, [key]: v }));
    setAiErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  const onAiBlur = (key: keyof AIForm) => () =>
    setAiErrors((prev) => ({ ...prev, [key]: aiFieldError(key, aiForm[key]) }));

  function validateAi() {
    const e: Record<string, string> = {};
    (Object.keys(aiForm) as (keyof AIForm)[]).forEach((k) => {
      const m = aiFieldError(k, aiForm[k]);
      if (m) e[k] = m;
    });
    setAiErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    if (!validateAi()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setEditorInitial(cvToForm(data.cv as CVResult));
      setStep("edit");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 print:bg-white">
      <div className="print:hidden">
        <SiteHeader />
      </div>

      {step === "template" ? (
        <TemplateGallery
          onSelect={(id) => {
            setChosen(id);
            setStep("ai");
          }}
          onBack={() => router.push("/build")}
          backLabel="Back to build options"
        />
      ) : step === "edit" && editorInitial ? (
        <CvEditor
          initial={editorInitial}
          initialTemplate={chosen}
          onBack={() => setStep("ai")}
          backLabel="Back to AI input"
        />
      ) : (
        <main className="flex flex-1 flex-col items-center px-6 py-10">
          <div className="w-full max-w-2xl">
            <button
              type="button"
              onClick={() => setStep("template")}
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-blue-600"
            >
              <IconArrowLeft className="h-4 w-4" /> Back to templates
            </button>

            <Reveal stagger>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <IconSparkles className="h-6 w-6" />
                </span>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">AI CV Builder</h1>
                  <p className="text-sm text-zinc-600">
                    Paste rough notes — AI writes a first draft you can edit.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleGenerate}
                noValidate
                className="mt-8 space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <IconField label="Full name" icon={<IconUser />} value={aiForm.name} onChange={onAi("name")} onBlur={onAiBlur("name")} placeholder="John Doe" error={aiErrors.name} />
                <IconField label="Professional title" icon={<IconBriefcase />} value={aiForm.title} onChange={onAi("title")} placeholder="Software Engineer" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <IconField label="Email" icon={<IconMail />} value={aiForm.email} onChange={onAi("email")} onBlur={onAiBlur("email")} placeholder="you@example.com" error={aiErrors.email} type="email" inputMode="email" />
                  <IconField label="Phone" icon={<IconPhone />} value={aiForm.phone} onChange={onAi("phone")} onBlur={onAiBlur("phone")} placeholder="+1 (555) 123-4567" error={aiErrors.phone} type="tel" inputMode="tel" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <IconField label="Location" icon={<IconMapPin />} value={aiForm.location} onChange={onAi("location")} placeholder="London, UK" />
                  <IconField label="Website / portfolio" icon={<IconGlobe />} value={aiForm.website} onChange={onAi("website")} placeholder="yoursite.com" />
                </div>

                <FieldTextarea
                  label="Your experience & background"
                  value={aiForm.experience}
                  onChange={onAi("experience")}
                  onBlur={onAiBlur("experience")}
                  rows={6}
                  error={aiErrors.experience}
                  placeholder="Paste your old CV, or jot down your jobs, skills, and education. Rough notes are fine — the AI will polish it."
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Spinner /> Generating your draft…
                    </>
                  ) : (
                    <>
                      <IconSparkles className="h-[18px] w-[18px]" /> Generate draft with AI
                    </>
                  )}
                </button>
              </form>
            </Reveal>

            {error && (
              <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>
        </main>
      )}

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}
