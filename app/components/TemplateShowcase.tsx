"use client";

import { useState } from "react";
import { ScaledPreview } from "./ScaledPreview";
import { TEMPLATES, getTemplateComponent, DEFAULT_TEMPLATE, type TemplateId } from "@/app/templates";
import type { CVResult } from "@/app/types";

export function TemplateShowcase({ cv }: { cv: CVResult }) {
  const [active, setActive] = useState<TemplateId>(DEFAULT_TEMPLATE);
  const current = TEMPLATES.find((t) => t.id === active) ?? TEMPLATES[0];
  const Template = getTemplateComponent(active);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap justify-center gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === t.id
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-zinc-500">{current.blurb}</p>

      <div className="mx-auto mt-8 max-w-[620px]">
        <ScaledPreview>
          <Template cv={cv} domId="show-preview" />
        </ScaledPreview>
      </div>
    </div>
  );
}
