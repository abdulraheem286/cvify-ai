import type { CVResult } from "@/app/types";
import { renderRich, renderInline } from "../lib/richtext";
import { InlineDate, StackedDate } from "./EntryDate";
import type { DatePlacement } from "./theme";

type Item = { title: string; subtitle: string; period: string; description: string };

// Renders the items of a user-defined custom section. Each template wraps this
// in its OWN <Section title={heading}> so the heading matches that template's style,
// and passes its own datePlacement so custom dates match the rest of the CV.
export function CustomItems({
  items,
  center = false,
  datePlacement = "below",
}: {
  items: Item[];
  center?: boolean;
  datePlacement?: DatePlacement;
}) {
  return (
    <>
      {items.map((it, j) => (
        <div key={j} className={`mb-3 last:mb-0 ${center ? "text-center" : ""}`}>
          <h3 className="font-semibold text-zinc-900">
            {renderInline(it.title)}
            {it.subtitle && <span className="font-normal text-zinc-600"> · {renderInline(it.subtitle)}</span>}
            <InlineDate period={it.period} placement={datePlacement} />
          </h3>
          <StackedDate period={it.period} placement={datePlacement} />
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
