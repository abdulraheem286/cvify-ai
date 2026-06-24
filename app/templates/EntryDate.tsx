import type { DatePlacement } from "./theme";

// Shared date renderers used by every template, so date placement is consistent
// and controlled from ONE place (each layout's `datePlacement` in index.ts).
// Both variants are ATS-safe — the date stays in normal reading flow next to its
// entry, so PDF/ATS extraction keeps each date with its job/degree.

// Inline: a trailing " · {period}" appended to the END of the role/company line.
// Render this INSIDE the title element (after the company), so it reads as one line.
export function InlineDate({
  period,
  placement,
  className = "text-zinc-500",
}: {
  period?: string;
  placement: DatePlacement;
  className?: string;
}) {
  if (placement !== "inline" || !period) return null;
  return <span className={`font-normal ${className}`}> · {period}</span>;
}

// Stacked: the date on its own line directly BELOW the title (the default).
// Render this AFTER the title element and BEFORE any bullets/description.
export function StackedDate({
  period,
  placement,
  className = "text-zinc-500",
}: {
  period?: string;
  placement: DatePlacement;
  className?: string;
}) {
  if (placement !== "below" || !period) return null;
  return <p className={`mt-0.5 text-xs ${className}`}>{period}</p>;
}
