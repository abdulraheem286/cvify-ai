import type { ReactElement } from "react";
import type { CVResult } from "@/app/types";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { SidebarTemplate } from "./SidebarTemplate";
import { OnyxTemplate } from "./OnyxTemplate";
import { AuroraTemplate } from "./AuroraTemplate";

export type TemplateId = "aurora" | "onyx" | "modern" | "sidebar" | "minimal";

export type TemplateDef = {
  id: TemplateId;
  name: string;
  blurb: string;
  Component: (props: { cv: CVResult; domId?: string }) => ReactElement;
};

export const TEMPLATES: TemplateDef[] = [
  { id: "aurora", name: "Aurora", blurb: "Gradient header, two-tone layout, photo.", Component: AuroraTemplate },
  { id: "onyx", name: "Onyx", blurb: "Bold dark header, premium and striking.", Component: OnyxTemplate },
  { id: "modern", name: "Modern", blurb: "Blue accent header, single column.", Component: ModernTemplate },
  { id: "sidebar", name: "Sidebar", blurb: "Two-column with a colour rail.", Component: SidebarTemplate },
  { id: "minimal", name: "Minimal", blurb: "Centered, monochrome, elegant.", Component: MinimalTemplate },
];

export const DEFAULT_TEMPLATE: TemplateId = "aurora";

export function getTemplateComponent(id: TemplateId) {
  return (TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]).Component;
}
