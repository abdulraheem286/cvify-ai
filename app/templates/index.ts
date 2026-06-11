import type { ReactElement } from "react";
import type { CVResult } from "@/app/types";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { SidebarTemplate } from "./SidebarTemplate";
import { OnyxTemplate } from "./OnyxTemplate";
import { AuroraTemplate } from "./AuroraTemplate";
import { ClassicTemplate } from "./ClassicTemplate";
import { DEFAULT_THEME, type Theme } from "./theme";

// Re-export the theme model so consumers can import everything from "@/app/templates".
export * from "./theme";

export type Category = "Professional" | "Minimal" | "Creative";
export const CATEGORIES: Category[] = ["Professional", "Minimal", "Creative"];

// A "template" is now purely a LAYOUT (structure). Colour/font/background are the
// Theme, applied on top — they are NOT separate templates.
export type LayoutId = string;
export type TemplateId = string;

export type LayoutComp = (props: { cv: CVResult; domId?: string; theme?: Theme }) => ReactElement;

type LayoutDef = {
  id: LayoutId;
  name: string;
  category: Category;
  Component: LayoutComp;
  // The look this layout ships with (used for gallery previews + as the editor's starting theme).
  defaultTheme: Theme;
};

function theme(partial: Partial<Theme>): Theme {
  return { ...DEFAULT_THEME, ...partial };
}

const LAYOUT_LIST: LayoutDef[] = [
  {
    id: "modern",
    name: "Modern",
    category: "Professional",
    Component: ModernTemplate,
    defaultTheme: theme({ primary: "#2563eb", secondary: "#0f172a" }),
  },
  {
    id: "sidebar",
    name: "Sidebar",
    category: "Professional",
    Component: SidebarTemplate,
    defaultTheme: theme({ primary: "#4f46e5", secondary: "#1e1b4b" }),
  },
  {
    id: "classic",
    name: "Classic",
    category: "Minimal",
    Component: ClassicTemplate,
    defaultTheme: theme({
      primary: "#1c1917",
      secondary: "#44403c",
      bg: "#fdfbf6",
      fontBody: "var(--font-source-serif)",
      fontHeading: "var(--font-lora)",
    }),
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Minimal",
    Component: MinimalTemplate,
    defaultTheme: theme({ primary: "#334155", secondary: "#0f172a" }),
  },
  {
    id: "aurora",
    name: "Aurora",
    category: "Creative",
    Component: AuroraTemplate,
    defaultTheme: theme({ primary: "#7c3aed", secondary: "#3b0764", fontHeading: "var(--font-poppins)" }),
  },
  {
    id: "onyx",
    name: "Onyx",
    category: "Creative",
    Component: OnyxTemplate,
    defaultTheme: theme({ primary: "#2563eb", secondary: "#0f172a" }),
  },
];

const LAYOUTS: Record<LayoutId, LayoutDef> = Object.fromEntries(
  LAYOUT_LIST.map((l) => [l.id, l]),
);

export type TemplateDef = {
  id: TemplateId;
  name: string;
  category: Category;
  defaultTheme: Theme;
};

export const TEMPLATES: TemplateDef[] = LAYOUT_LIST.map((l) => ({
  id: l.id,
  name: l.name,
  category: l.category,
  defaultTheme: l.defaultTheme,
}));

export const DEFAULT_TEMPLATE: TemplateId = "modern";

export function getTemplate(id: TemplateId): TemplateDef {
  const l = LAYOUTS[id] ?? LAYOUT_LIST[0];
  return { id: l.id, name: l.name, category: l.category, defaultTheme: l.defaultTheme };
}

export function getLayoutComponent(id: LayoutId): LayoutComp {
  return (LAYOUTS[id] ?? LAYOUT_LIST[0]).Component;
}

export function getDefaultTheme(id: TemplateId): Theme {
  return (LAYOUTS[id] ?? LAYOUT_LIST[0]).defaultTheme;
}

export function templatesByCategory(category: Category): TemplateDef[] {
  return TEMPLATES.filter((t) => t.category === category);
}
