"use client";

import { useState } from "react";
import { ScaledPreview } from "./ScaledPreview";
import { TemplateView } from "@/app/templates/TemplateView";
import {
  CATEGORIES,
  templatesByCategory,
  type Category,
  type TemplateId,
} from "@/app/templates";
import { SAMPLE_CV as SAMPLE } from "@/app/lib/sampleCv";
import { useMyTemplates } from "@/app/lib/useMyTemplates";
import type { MyTemplate } from "@/app/lib/templateStore";
import { IconArrowLeft } from "./icons";

type Tab = Category | "Mine";

export function TemplateGallery({
  onSelect,
  onSelectTemplate,
  onBack,
  backLabel,
}: {
  onSelect: (id: TemplateId) => void;
  // Applies a saved template's layout + theme at once. Falls back to onSelect
  // with just the layout when not provided.
  onSelectTemplate?: (t: MyTemplate) => void;
  onBack: () => void;
  backLabel: string;
}) {
  const { templates: myTemplates } = useMyTemplates();
  const [cat, setCat] = useState<Tab>("Professional");
  const tabs: Tab[] = myTemplates.length ? [...CATEGORIES, "Mine"] : CATEGORIES;
  const templates = cat === "Mine" ? [] : templatesByCategory(cat);

  return (
    <main className="mx-auto w-full max-w-[1920px] flex-1 site-px py-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-blue-600"
      >
        <IconArrowLeft className="h-4 w-4" /> {backLabel}
      </button>

      <div className="mt-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose a layout</h1>
        <p className="mt-2 text-zinc-600">
          Pick a structure to start with. You can recolour it and change fonts anytime while editing.
        </p>
      </div>

      {/* Category tabs */}
      <div className="mt-8 flex flex-wrap justify-center gap-2.5">
        {tabs.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-6 py-3 text-base font-semibold transition-colors ${
              cat === c ? "bg-blue-600 text-white shadow-sm" : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {c === "Mine" ? "My Templates" : c}
          </button>
        ))}
      </div>

      {/* Selectable previews */}
      <div className="mx-auto mt-10 grid max-w-screen-2xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cat === "Mine"
          ? myTemplates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => (onSelectTemplate ? onSelectTemplate(t) : onSelect(t.layout))}
                className="group rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                <ScaledPreview maxHeight={420} fixed>
                  <TemplateView id={t.layout} cv={SAMPLE} domId={`gal-mine-${t.id}`} theme={t.theme} />
                </ScaledPreview>
                <div className="mt-3 flex items-center justify-between">
                  <span className="truncate text-lg font-semibold text-zinc-900">{t.name}</span>
                  <span className="shrink-0 text-base font-semibold text-blue-600">Use this →</span>
                </div>
              </button>
            ))
          : templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelect(t.id)}
                className="group rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                <ScaledPreview maxHeight={420} fixed>
                  <TemplateView id={t.id} cv={SAMPLE} domId={`gal-${t.id}`} theme={t.defaultTheme} />
                </ScaledPreview>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-semibold text-zinc-900">{t.name}</span>
                  <span className="text-base font-semibold text-blue-600">Use this →</span>
                </div>
              </button>
            ))}
      </div>
    </main>
  );
}
