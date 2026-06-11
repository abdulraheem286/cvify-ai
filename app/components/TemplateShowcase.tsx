"use client";

import { useState } from "react";
import { ScaledPreview } from "./ScaledPreview";
import { TemplateView } from "@/app/templates/TemplateView";
import {
  CATEGORIES,
  ACCENTS,
  templatesByCategory,
  getTemplate,
  type Category,
  type LayoutId,
} from "@/app/templates";
import type { CVResult } from "@/app/types";

export function TemplateShowcase({ cv }: { cv: CVResult }) {
  const [cat, setCat] = useState<Category>("Creative");
  const [accentId, setAccentId] = useState("blue");

  const layouts = Array.from(new Set(templatesByCategory(cat).map((t) => t.layout))) as LayoutId[];

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

      {/* Accent colours */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="text-xs font-medium text-zinc-500">Colour:</span>
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAccentId(a.id)}
            aria-label={a.name}
            className={`h-6 w-6 rounded-full ring-2 ring-offset-2 transition ${
              accentId === a.id ? "ring-zinc-400" : "ring-transparent hover:ring-zinc-200"
            }`}
            style={{ backgroundColor: a.hex }}
          />
        ))}
      </div>

      {/* Previews — the category's layouts in the chosen colour */}
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {layouts.map((layout) => {
          const id = `${layout}-${accentId}`;
          return (
            <div key={layout}>
              <ScaledPreview>
                <TemplateView id={id} cv={cv} domId={`show-${layout}`} />
              </ScaledPreview>
              <p className="mt-3 text-center text-sm font-medium text-zinc-700">{getTemplate(id).name}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        30 templates across 3 categories — switch layout and colour anytime.
      </p>
    </div>
  );
}
