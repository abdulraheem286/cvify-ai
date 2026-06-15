"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CVResult } from "@/app/types";
import { Reveal } from "@/app/components/Reveal";
import { AppHeader } from "@/app/components/AppHeader";
import { CvEditor, cvToForm, type EditorForm } from "@/app/components/CvEditor";
import { TemplateGallery } from "@/app/components/TemplateGallery";
import { DEFAULT_TEMPLATE, type TemplateId } from "@/app/templates";
import { IconArrowLeft, IconSparkles } from "@/app/components/icons";

// Pull plain text out of an uploaded PDF (client-side) or text file.
async function extractText(file: File): Promise<string> {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return (await file.text()).trim();

  const pdfjs = await import("pdfjs-dist");
  // Worker is loaded from a CDN matching the installed version.
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  let out = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((it) => ("str" in it ? (it as { str: string }).str : "")).join(" ") + "\n";
  }
  return out.trim();
}

export default function ImportClient() {
  const router = useRouter();
  const [step, setStep] = useState<"template" | "import" | "edit">("template");
  const [chosen, setChosen] = useState<TemplateId>(DEFAULT_TEMPLATE);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorInitial, setEditorInitial] = useState<EditorForm | null>(null);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setExtracting(true);
    setFileName(file.name);
    try {
      const t = await extractText(file);
      if (!t) {
        setError("Couldn't find readable text in that file (it may be a scanned image). Try pasting the text instead.");
      } else {
        setText(t);
      }
    } catch {
      setError("Couldn't read that file. Try pasting the text instead.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleImport(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError("Paste your CV text or upload a file first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
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
      <AppHeader />

      {step === "template" ? (
        <TemplateGallery
          onSelect={(id) => {
            setChosen(id);
            setStep("import");
          }}
          onBack={() => router.push("/build")}
          backLabel="Back to build options"
        />
      ) : step === "edit" && editorInitial ? (
        <CvEditor
          initial={editorInitial}
          initialTemplate={chosen}
          onBack={() => setStep("import")}
          backLabel="Back to import"
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
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
                  <IconSparkles className="h-6 w-6" />
                </span>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Import your CV</h1>
                  <p className="text-sm text-zinc-600">
                    Upload a PDF or paste your existing CV — the AI reads it into the editor.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleImport}
                className="mt-8 space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
              >
                {/* Upload */}
                <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-zinc-300 px-6 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40">
                  <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={onFile} className="hidden" />
                  <span className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                    {extracting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />}
                    {extracting ? "Reading file…" : "Upload a PDF or TXT file"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {fileName ? `Loaded: ${fileName}` : "We read the text on your device — your file is not uploaded."}
                  </span>
                </label>

                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
                  <span className="h-px flex-1 bg-zinc-200" /> or paste <span className="h-px flex-1 bg-zinc-200" />
                </div>

                {/* Paste */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Paste your CV text</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    placeholder="Paste the full text of your existing CV here…"
                    className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || extracting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Spinner /> Reading your CV…
                    </>
                  ) : (
                    <>
                      <IconSparkles className="h-[18px] w-[18px]" /> Import into the editor
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-zinc-400">
                  The AI extracts your details as written — nothing is invented. You can edit everything next.
                </p>
              </form>
            </Reveal>

            {error && (
              <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}
          </div>
        </main>
      )}

    </div>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}
