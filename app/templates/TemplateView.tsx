import type { CVResult } from "@/app/types";
import { getTemplate, getLayoutComponent, type TemplateId } from "./index";

// Renders a template id by resolving its layout + accent.
export function TemplateView({ id, cv, domId }: { id: TemplateId; cv: CVResult; domId?: string }) {
  const t = getTemplate(id);
  const Layout = getLayoutComponent(t.layout);
  return <Layout cv={cv} domId={domId} accent={t.accent} />;
}
