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
import type { CVResult } from "@/app/types";
import { IconArrowLeft } from "./icons";

const SAMPLE: CVResult = {
  fullName: "Sarah Johnson",
  jobTitle: "Senior Product Designer",
  contact: {
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    location: "London, UK",
    website: "sarahjohnson.design",
  },
  summary:
    "Product designer with 6+ years crafting intuitive, user-centered digital experiences for fast-growing startups.",
  experience: [
    {
      role: "Senior Product Designer",
      company: "DesignCo",
      period: "2021 — Present",
      bullets: [
        "Led the redesign of the core product, lifting activation by 32%.",
        "Built the company design system used by 12 engineers.",
      ],
    },
    {
      role: "Product Designer",
      company: "StartupX",
      period: "2018 — 2021",
      bullets: ["Shipped 20+ features from research through high-fidelity design."],
    },
  ],
  education: [{ degree: "BA, Interaction Design", institution: "London College", period: "2014 — 2018" }],
  skills: ["Figma", "Prototyping", "Design Systems", "UX Research", "UI Design"],
  languages: [{ name: "English", level: "Native" }],
};

export function TemplateGallery({
  onSelect,
  onBack,
  backLabel,
}: {
  onSelect: (id: TemplateId) => void;
  onBack: () => void;
  backLabel: string;
}) {
  const [cat, setCat] = useState<Category>("Professional");
  const templates = templatesByCategory(cat);

  return (
    <main className="mx-auto w-full max-w-[1920px] flex-1 px-6 py-10">
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
      <div className="mt-8 flex flex-wrap justify-center gap-2">
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

      {/* Selectable layout previews */}
      <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-2">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className="group rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
          >
            <ScaledPreview>
              <TemplateView id={t.id} cv={SAMPLE} domId={`gal-${t.id}`} theme={t.defaultTheme} />
            </ScaledPreview>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-zinc-900">{t.name}</span>
              <span className="text-sm font-semibold text-blue-600">Use this →</span>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
