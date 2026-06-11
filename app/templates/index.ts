import type { ReactElement } from "react";
import type { CVResult } from "@/app/types";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { SidebarTemplate } from "./SidebarTemplate";
import { OnyxTemplate } from "./OnyxTemplate";
import { AuroraTemplate } from "./AuroraTemplate";
import { ClassicTemplate } from "./ClassicTemplate";

export type Category = "Professional" | "Minimal" | "Creative";
export const CATEGORIES: Category[] = ["Professional", "Minimal", "Creative"];

export type LayoutId = "modern" | "sidebar" | "classic" | "minimal" | "aurora" | "onyx";

type LayoutComp = (props: { cv: CVResult; domId?: string; accent?: string }) => ReactElement;

const LAYOUTS: Record<LayoutId, { name: string; Component: LayoutComp; category: Category }> = {
  modern: { name: "Modern", Component: ModernTemplate, category: "Professional" },
  sidebar: { name: "Sidebar", Component: SidebarTemplate, category: "Professional" },
  classic: { name: "Classic", Component: ClassicTemplate, category: "Minimal" },
  minimal: { name: "Minimal", Component: MinimalTemplate, category: "Minimal" },
  aurora: { name: "Aurora", Component: AuroraTemplate, category: "Creative" },
  onyx: { name: "Onyx", Component: OnyxTemplate, category: "Creative" },
};

export const ACCENTS: { id: string; name: string; hex: string }[] = [
  { id: "blue", name: "Blue", hex: "#2563eb" },
  { id: "emerald", name: "Emerald", hex: "#059669" },
  { id: "violet", name: "Violet", hex: "#7c3aed" },
  { id: "rose", name: "Rose", hex: "#e11d48" },
  { id: "amber", name: "Amber", hex: "#d97706" },
];

export type TemplateId = string;

export type TemplateDef = {
  id: TemplateId;
  name: string;
  category: Category;
  layout: LayoutId;
  accent: string;
};

// 6 layouts × 5 accents = 30 templates.
export const TEMPLATES: TemplateDef[] = (Object.keys(LAYOUTS) as LayoutId[]).flatMap((layout) =>
  ACCENTS.map((a) => ({
    id: `${layout}-${a.id}`,
    name: `${LAYOUTS[layout].name} ${a.name}`,
    category: LAYOUTS[layout].category,
    layout,
    accent: a.hex,
  })),
);

export const DEFAULT_TEMPLATE: TemplateId = "aurora-blue";

export function getTemplate(id: TemplateId): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export function getLayoutComponent(layout: LayoutId): LayoutComp {
  return LAYOUTS[layout].Component;
}

export function templatesByCategory(category: Category): TemplateDef[] {
  return TEMPLATES.filter((t) => t.category === category);
}
