import { buildCvCss, type Theme } from "./theme";

// Injects a scoped <style> that applies a theme's EXTENDED options (font scale,
// line-height, heading case, density, custom text colours) to the single CV
// identified by domId. Emits nothing when no extended option is set, so default
// templates stay untouched. Rendered as a sibling of the CV root by TemplateView.
export function CvStyle({ domId, theme }: { domId: string; theme: Theme }) {
  const css = buildCvCss(domId, theme);
  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
