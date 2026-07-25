"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/components/AuthProvider";
import { listCvs, getCv, type CvRecord } from "@/app/lib/cvStore";
import type { EditorForm } from "@/app/components/CvEditor";

function cvToBackground(form: EditorForm): string {
  const parts: string[] = [];
  if (form.summary?.trim()) parts.push(form.summary.trim());
  form.experience.forEach((e) => {
    if (e.role || e.company) {
      const head = [e.role, e.company].filter(Boolean).join(" at ");
      const when = e.period ? ` (${e.period})` : "";
      parts.push(`${head}${when}: ${e.bullets || ""}`.trim());
    }
  });
  if (form.skills?.trim()) parts.push(`Skills: ${form.skills.trim()}`);
  return parts.filter(Boolean).join("\n");
}

function today(): string {
  const d = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors hover:border-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export function CoverLetterClient() {
  const { user, enabled } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [background, setBackground] = useState("");

  const [letter, setLetter] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [cvs, setCvs] = useState<CvRecord[]>([]);

  // Load the user's saved CVs so they can start from one.
  useEffect(() => {
    if (!enabled || !user) return;
    listCvs(user.uid)
      .then(setCvs)
      .catch(() => {});
  }, [enabled, user]);

  async function fillFromCv(id: string) {
    if (!id || !user) return;
    const cv = await getCv(user.uid, id).catch(() => null);
    if (!cv) return;
    const f = cv.data.form;
    setName(`${f.firstName} ${f.lastName}`.trim());
    setEmail(f.email || "");
    setPhone(f.phone || "");
    setLocation(f.location || "");
    if (!jobTitle && f.jobTitle) setJobTitle(f.jobTitle);
    setBackground(cvToBackground(f));
  }

  async function generate() {
    if (!jobTitle.trim() && !background.trim()) {
      setError("Add the job title and a little about your experience first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, jobTitle, company, jobDescription, background }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setLetter(String(data.letter || "").trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "The AI couldn't write the letter. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const contactLine = useMemo(
    () => [email, phone, location].filter(Boolean).join("  ·  "),
    [email, phone, location],
  );

  return (
    <section className="mx-auto max-w-6xl site-px pb-20 pt-6">
      {/* Print styles: when printing, show only the letter paper. */}
      <style dangerouslySetInnerHTML={{ __html: `@media print {
        body * { visibility: hidden !important; }
        #cl-paper, #cl-paper * { visibility: visible !important; }
        #cl-paper { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border: 0 !important; }
        @page { margin: 18mm; }
      }` }} />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ---- Inputs ---- */}
        <div className="space-y-5">
          {enabled && user && cvs.length > 0 && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Start from a saved CV</label>
              <select className={inputCls} defaultValue="" onChange={(e) => fillFromCv(e.target.value)}>
                <option value="">Choose a CV to pull your details…</option>
                {cvs.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" value={name} onChange={setName} placeholder="Jane Doe" />
            <Field label="Email" value={email} onChange={setEmail} placeholder="you@email.com" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone (optional)" value={phone} onChange={setPhone} placeholder="+1 555 000 0000" />
            <Field label="Location (optional)" value={location} onChange={setLocation} placeholder="London, UK" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job title" value={jobTitle} onChange={setJobTitle} placeholder="Product Manager" />
            <Field label="Company" value={company} onChange={setCompany} placeholder="Acme Inc." />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Job description (optional, improves the result)</label>
            <textarea className={inputCls} rows={4} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job posting here…" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">About you — experience &amp; skills</label>
            <textarea className={inputCls} rows={5} value={background} onChange={(e) => setBackground(e.target.value)} placeholder="Paste your CV or a few lines about your experience, skills, and achievements…" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
          >
            {busy ? "Writing your letter…" : letter ? "Regenerate letter" : "Generate cover letter →"}
          </button>

          {letter && (
            <div className="pt-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Edit your letter</label>
              <textarea className={`${inputCls} font-normal`} rows={14} value={letter} onChange={(e) => setLetter(e.target.value)} />
            </div>
          )}
        </div>

        {/* ---- Result / paper preview ---- */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {letter ? (
            <>
              <div className="mb-3 flex flex-wrap gap-2">
                <button type="button" onClick={copy} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-blue-300 hover:text-blue-600">
                  {copied ? "Copied!" : "Copy text"}
                </button>
                <button type="button" onClick={() => window.print()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                  Download PDF
                </button>
              </div>
              <div id="cl-paper" className="rounded-2xl border border-zinc-200 bg-white p-8 text-[13px] leading-relaxed text-zinc-800 shadow-sm sm:p-10">
                {(name || contactLine) && (
                  <div className="mb-6">
                    {name && <p className="text-base font-bold text-zinc-900">{name}</p>}
                    {contactLine && <p className="mt-0.5 text-xs text-zinc-500">{contactLine}</p>}
                  </div>
                )}
                <p className="mb-6 text-xs text-zinc-500">{today()}</p>
                <div className="whitespace-pre-wrap">{letter}</div>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
              <p className="max-w-xs text-sm text-zinc-500">
                Your tailored cover letter will appear here. Fill in the job and a little about you, then click{" "}
                <span className="font-medium text-zinc-700">Generate</span>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Small SEO/help note */}
      <p className="mt-12 max-w-2xl text-sm text-zinc-500">
        CVify AI writes each cover letter from the real details you provide — no fabricated facts. Need a CV to match?{" "}
        <Link href="/build" className="font-medium text-blue-600 hover:text-blue-700">Build your CV free</Link>, or read{" "}
        <Link href="/blog/how-to-write-a-cover-letter" className="font-medium text-blue-600 hover:text-blue-700">how to write a cover letter</Link>.
      </p>
    </section>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <input type="text" className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
