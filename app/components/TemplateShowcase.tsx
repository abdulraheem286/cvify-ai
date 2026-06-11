"use client";

import { useState } from "react";
import { ScaledPreview } from "./ScaledPreview";
import { ModernTemplate } from "@/app/templates/ModernTemplate";
import { MinimalTemplate } from "@/app/templates/MinimalTemplate";
import { SidebarTemplate } from "@/app/templates/SidebarTemplate";
import type { CVResult } from "@/app/types";

const TABS = [
  { id: "modern", name: "Modern", blurb: "Bold accent header, single column." },
  { id: "minimal", name: "Minimal", blurb: "Centered, monochrome, elegant." },
  { id: "sidebar", name: "Sidebar", blurb: "Two-column with a colour rail." },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TemplateShowcase({ cv }: { cv: CVResult }) {
  const [active, setActive] = useState<TabId>("modern");
  const current = TABS.find((t) => t.id === active) ?? TABS[0];

  return (
    <div className="mt-12">
      <div className="flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
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
        {active === "modern" && (
          <ScaledPreview>
            <ModernTemplate cv={cv} domId="show-modern" />
          </ScaledPreview>
        )}
        {active === "minimal" && (
          <ScaledPreview>
            <MinimalTemplate cv={cv} domId="show-minimal" />
          </ScaledPreview>
        )}
        {active === "sidebar" && (
          <ScaledPreview>
            <SidebarTemplate cv={cv} domId="show-sidebar" />
          </ScaledPreview>
        )}
      </div>
    </div>
  );
}
