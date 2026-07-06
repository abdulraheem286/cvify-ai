import type { CVResult } from "@/app/types";
import { getLayoutComponent, getDefaultTheme, getDatePlacement, type TemplateId } from "./index";
import type { Theme } from "./theme";
import { CvStyle } from "./CvStyle";

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
  const eff = theme ?? getDefaultTheme(id);
  // Use one consistent id for both the scoped stylesheet and the CV root so the
  // extended-theme rules target the right element.
  const effId = domId ?? "cv-document";
  return (
    <>
      <CvStyle domId={effId} theme={eff} />
      <Layout cv={cv} domId={effId} theme={eff} datePlacement={getDatePlacement(id)} />
    </>
  );
}
