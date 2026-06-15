"use client";

import { useState } from "react";
import { ScaledPreview } from "./ScaledPreview";
import { TemplateView } from "@/app/templates/TemplateView";
import {
  CATEGORIES,
  TEMPLATES,
  templatesByCategory,
  type Category,
} from "@/app/templates";
import type { CVResult } from "@/app/types";

export function TemplateShowcase({ cv }: { cv: CVResult }) {
  const [cat, setCat] = useState<Category>("Creative");
  const templates = templatesByCategory(cat);

  return (
    <div className="mt-12">
      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              cat === c ? "bg-blue-600 text-white shadow-sm" : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Previews — the category's layouts, each in its own default look */}
      <div className="mx-auto mt-8 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.id}>
            <ScaledPreview maxHeight={360} fixed>
              <TemplateView id={t.id} cv={cv} domId={`show-${t.id}`} theme={t.defaultTheme} />
            </ScaledPreview>
            <p className="mt-3 text-center text-sm font-medium text-zinc-700">{t.name}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {TEMPLATES.length} distinct layouts across 3 categories — recolour, restyle and change fonts to make any of them yours.
      </p>
    </div>
  );
}
