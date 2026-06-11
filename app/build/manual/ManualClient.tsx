"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CVResult } from "@/app/types";
import { downloadCvPdf } from "@/app/lib/pdf";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { PreviewStep } from "@/app/components/PreviewStep";
import { CvEditor, EMPTY_FORM, cvToForm, type EditorForm } from "@/app/components/CvEditor";
import { type TemplateId } from "@/app/templates";
import { IconText } from "@/app/components/icons";

const STEPS = ["Edit", "Template"];

export default function ManualClient() {
  const router = useRouter();
  const [result, setResult] = useState<CVResult | null>(null);
  const [editorInitial, setEditorInitial] = useState<EditorForm>(EMPTY_FORM);
  const [template, setTemplate] = useState<TemplateId>("modern");
  const [downloading, setDownloading] = useState(false);
  const [step, setStep] = useState<"edit" | "preview">("edit");

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadCvPdf(result?.fullName?.replace(/\s+/g, "-") || "cv");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 print:bg-white">
      <div className="print:hidden">
        <SiteHeader />
      </div>

      {step === "preview" && result ? (
        <main className="flex-1 print:p-0">
          <PreviewStep
            cv={result}
            steps={STEPS}
            template={template}
            onTemplateChange={setTemplate}
            onBack={() => {
              if (result) setEditorInitial(cvToForm(result));
              setStep("edit");
            }}
            onDownload={handleDownload}
            downloading={downloading}
          />
        </main>
      ) : (
        <CvEditor
          initial={editorInitial}
          steps={STEPS}
          currentStep={0}
          title="Manual CV Builder"
          subtitle="Fill in each section yourself — full control over every word."
          icon={<IconText className="h-6 w-6" />}
          submitLabel="Preview & choose template →"
          onSubmit={(cv) => {
            setResult(cv);
            setStep("preview");
          }}
          onBack={() => router.push("/build")}
          backLabel="Back to build options"
        />
      )}

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}
