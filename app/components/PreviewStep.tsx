"use client";

import type { CVResult } from "@/app/types";
import { TemplatePicker } from "./TemplatePicker";
import { Stepper } from "./Stepper";
import { getTemplateComponent, type TemplateId } from "@/app/templates";
import { IconDownload, IconArrowLeft } from "./icons";

// Step 2 of the builder: full-width two-pane — sticky controls on the left,
// large live CV preview on the right.
export function PreviewStep({
  cv,
  template,
  onTemplateChange,
  onBack,
  onDownload,
  downloading,
}: {
  cv: CVResult;
  template: TemplateId;
  onTemplateChange: (id: TemplateId) => void;
  onBack: () => void;
  onDownload: () => void;
  downloading: boolean;
}) {
  const Template = getTemplateComponent(template);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 print:p-0">
      <div className="print:hidden">
        <Stepper current={2} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Controls */}
        <aside className="space-y-4 print:hidden lg:sticky lg:top-24 lg:self-start">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-blue-600"
          >
            <IconArrowLeft className="h-4 w-4" /> Back to edit
          </button>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <TemplatePicker value={template} onChange={onTemplateChange} />
          </div>

          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconDownload className="h-[18px] w-[18px]" />
            {downloading ? "Preparing PDF…" : "Download PDF"}
          </button>
        </aside>

        {/* Preview */}
        <div className="flex justify-center">
          <Template cv={cv} />
        </div>
      </div>
    </div>
  );
}
