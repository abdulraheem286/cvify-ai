import type { CVResult } from "@/app/types";
import { renderRich, renderInline } from "../lib/richtext";

type Item = { title: string; subtitle: string; period: string; description: string };

// Renders the items of a user-defined custom section. Each template wraps this
// in its OWN <Section title={heading}> so the heading matches that template's style.
export function CustomItems({ items, center = false }: { items: Item[]; center?: boolean }) {
  return (
    <>
      {items.map((it, j) => (
        <div key={j} className={`mb-3 last:mb-0 ${center ? "text-center" : ""}`}>
          <div className={`flex items-baseline gap-3 ${center ? "justify-center" : "justify-between"}`}>
            <h3 className="font-semibold text-zinc-900">
              {renderInline(it.title)}
              {it.subtitle && <span className="font-normal text-zinc-600"> · {renderInline(it.subtitle)}</span>}
            </h3>
            {!center && it.period && <span className="shrink-0 text-xs text-zinc-500">{it.period}</span>}
          </div>
          {center && it.period && <p className="text-xs text-zinc-500">{it.period}</p>}
          {it.description && <p className="mt-0.5 text-sm leading-relaxed text-zinc-700">{renderRich(it.description)}</p>}
        </div>
      ))}
    </>
  );
}

// Convenience: does the CV have any non-empty custom section?
export function hasCustom(cv: CVResult): boolean {
  return !!cv.customSections?.some((s) => s.heading && s.items?.length);
}
