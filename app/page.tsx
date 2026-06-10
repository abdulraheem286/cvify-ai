"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CvDocument } from "./components/CvDocument";
import type { CVResult } from "./types";

type CVForm = {
  name: string;
  title: string;
  email: string;
  phone: string;
  experience: string;
};

const EMPTY: CVForm = {
  name: "",
  title: "",
  email: "",
  phone: "",
  experience: "",
};

export default function Home() {
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

  // Turn the on-screen CV into a downloadable PDF file (one click).
  async function handleDownload() {
    const el = document.getElementById("cv-document");
    if (!el) return;
    setDownloading(true);
    try {
      // Load the PDF tools only when needed (keeps the app fast).
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      // 1) Take a high-res picture of the CV.
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");

      // 2) Put that picture into an A4 PDF, adding pages if the CV is long.
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 3) Download it.
      pdf.save(`${result?.fullName?.replace(/\s+/g, "-") || "cv"}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      setError("Could not create the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-zinc-950 px-6 py-16 text-white print:bg-white print:p-0">
      <div className="w-full max-w-2xl print:hidden">
        <h1 className="text-4xl font-bold tracking-tight">
          CVify <span className="text-emerald-400">AI</span>
        </h1>
        <p className="mt-2 text-zinc-400">Tell us about yourself — AI does the rest.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Field label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
          <Field label="Professional title" name="title" value={form.title} onChange={handleChange} placeholder="Software Engineer" />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Your experience &amp; background
            </label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              rows={6}
              placeholder="Paste your old CV, or jot down your jobs, skills, and education. Rough notes are fine — the AI will polish it."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
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
          <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
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
      <label className="mb-1.5 block text-sm font-medium text-zinc-300">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
      />
    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-900/30 border-t-zinc-900" />
  );
}
