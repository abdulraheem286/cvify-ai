import type { ReactElement } from "react";
import type { CVResult } from "@/app/types";
import { ModernTemplate } from "./ModernTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { SidebarTemplate } from "./SidebarTemplate";

export type TemplateId = "modern" | "minimal" | "sidebar";

export type TemplateDef = {
  id: TemplateId;
  name: string;
  Component: (props: { cv: CVResult }) => ReactElement;
};

export const TEMPLATES: TemplateDef[] = [
  { id: "modern", name: "Modern", Component: ModernTemplate },
  { id: "minimal", name: "Minimal", Component: MinimalTemplate },
  { id: "sidebar", name: "Sidebar", Component: SidebarTemplate },
];

export function getTemplateComponent(id: TemplateId) {
  return (TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]).Component;
}
