import type { CVResult } from "@/app/types";
import { getLayoutComponent, getDefaultTheme, getDatePlacement, type TemplateId } from "./index";
import type { Theme } from "./theme";

// Renders a layout (template) with a theme applied on top.
// If no theme is passed, the layout's own default theme is used.
export function TemplateView({
  id,
  cv,
  domId,
  theme,
}: {
  id: TemplateId;
  cv: CVResult;
  domId?: string;
  theme?: Theme;
}) {
  const Layout = getLayoutComponent(id);
  return <Layout cv={cv} domId={domId} theme={theme ?? getDefaultTheme(id)} datePlacement={getDatePlacement(id)} />;
}
