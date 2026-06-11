"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CvDocument } from "@/app/components/CvDocument";
import type { CVResult } from "@/app/types";
import { downloadCvPdf } from "@/app/lib/pdf";
import { Reveal } from "@/app/components/Reveal";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
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
  IconDownload,
  IconArrowLeft,
} from "@/app/components/icons";

type CVForm = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  experience: string;
};

const EMPTY: CVForm = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  experience: "",
};

// One place that defines each field's validation rule.
function fieldError(key: keyof CVForm, v: string): string {
  switch (key) {
    case "name":
      return nameError(v, true);
    case "email":
      return emailError(v); // optional here, but must be valid if filled
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
  const [form, setForm] = useState<CVForm>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CVResult | null>(null);

  const onField = (key: keyof CVForm) => (value: string) => {
    const v = key === "phone" ? sanitizePhone(value) : value;
    setForm((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev)); // clear while editing
  };

  const onBlurField = (key: keyof CVForm) => () =>
    setErrors((prev) => ({ ...prev, [key]: fieldError(key, form[key]) }));

  function validate() {
    const e: Record<string, string> = {};
    (Object.keys(form) as (keyof CVForm)[]).forEach((k) => {
      const msg = fieldError(k, form[k]);
      if (msg) e[k] = msg;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data.cv as CVResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadCvPdf(result?.fullName?.replace(/\s+/g, "-") || "cv");
    } catch (err) {
      console.error("PDF export failed:", err);
      setError("Could not create the PDF. Please try again.");
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
                <IconSparkles className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AI CV Builder</h1>
                <p className="text-sm text-zinc-600">Tell us about yourself — AI does the rest.</p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <IconField label="Full name" icon={<IconUser />} value={form.name} onChange={onField("name")} onBlur={onBlurField("name")} placeholder="John Doe" error={errors.name} />
              <IconField label="Professional title" icon={<IconBriefcase />} value={form.title} onChange={onField("title")} placeholder="Software Engineer" />

              <div className="grid gap-5 sm:grid-cols-2">
                <IconField label="Email" icon={<IconMail />} value={form.email} onChange={onField("email")} onBlur={onBlurField("email")} placeholder="you@example.com" error={errors.email} type="email" inputMode="email" />
                <IconField label="Phone" icon={<IconPhone />} value={form.phone} onChange={onField("phone")} onBlur={onBlurField("phone")} placeholder="+1 (555) 123-4567" error={errors.phone} type="tel" inputMode="tel" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <IconField label="Location" icon={<IconMapPin />} value={form.location} onChange={onField("location")} placeholder="London, UK" />
                <IconField label="Website / portfolio" icon={<IconGlobe />} value={form.website} onChange={onField("website")} onBlur={onBlurField("website")} placeholder="yoursite.com" error={errors.website} inputMode="url" />
              </div>

              <FieldTextarea
                label="Your experience & background"
                value={form.experience}
                onChange={onField("experience")}
                onBlur={onBlurField("experience")}
                rows={6}
                error={errors.experience}
                placeholder="Paste your old CV, or jot down your jobs, skills, and education. Rough notes are fine — the AI will polish it."
              />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Spinner /> Generating your CV…
                  </>
                ) : (
                  <>
                    <IconSparkles className="h-[18px] w-[18px]" /> Generate my CV with AI
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
