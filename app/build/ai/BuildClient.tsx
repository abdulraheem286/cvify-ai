"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { CvDocument } from "@/app/components/CvDocument";
import type { CVResult } from "@/app/types";
import { downloadCvPdf } from "@/app/lib/pdf";
import { Reveal } from "@/app/components/Reveal";

type CVForm = {
  name: string;
  title: string;
  email: string;
  phone: string;
  experience: string;
};

const EMPTY: CVForm = { name: "", title: "", email: "", phone: "", experience: "" };

export default function BuildClient() {
  const [form, setForm] = useState<CVForm>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CVResult | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof CVForm]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
    <main className="flex flex-1 flex-col items-center bg-white px-6 py-12 text-zinc-900 print:p-0">
      <Reveal stagger className="w-full max-w-2xl print:hidden">
        <Link href="/build" className="text-sm text-zinc-500 transition-colors hover:text-blue-600">
          ← Back to build options
        </Link>

        <h1 className="mt-6 text-4xl font-bold tracking-tight">AI CV Builder</h1>
        <p className="mt-2 text-zinc-600">Tell us about yourself — AI does the rest.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Field label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
          <Field label="Professional title" name="title" value={form.title} onChange={handleChange} placeholder="Software Engineer" />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Your experience &amp; background
            </label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              rows={6}
              placeholder="Paste your old CV, or jot down your jobs, skills, and education. Rough notes are fine — the AI will polish it."
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Generating your CV…
              </span>
            ) : (
              "Generate my CV with AI ✨"
            )}
          </button>
        </form>

        {error && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </Reveal>

      {result && (
        <div className="mt-12 w-full max-w-[820px] print:mt-0">
          <div className="mb-4 flex justify-end print:hidden">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}
