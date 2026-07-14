import type { DatePlacement } from "./theme";

// Shared date renderers used by every template, so date placement is consistent
// and controlled from ONE place (each layout's `datePlacement` in index.ts).
// Both variants are ATS-safe — the date stays in normal reading flow next to its
// entry, so PDF/ATS extraction keeps each date with its job/degree.

// Work mode (Remote/Hybrid/On-site) tag — italic, appended right AFTER the job
// title so it reads "against" the role. Only renders when a mode is set.
export function WorkTag({ mode, className = "text-zinc-500" }: { mode?: string; className?: string }) {
  if (!mode) return null;
  return <span className={`font-normal italic ${className}`}> · {mode}</span>;
}

// Inline: a trailing " · {type} · {period}" appended to the END of the role/company
// line. Render this INSIDE the title element (after the company) as one line.
export function InlineDate({
  period,
  type,
  placement,
  className = "text-zinc-500",
}: {
  period?: string;
  type?: string; // employment type, e.g. "Full-time"
  placement: DatePlacement;
  className?: string;
}) {
  if (placement !== "inline") return null;
  const text = [type, period].filter(Boolean).join(" · ");
  if (!text) return null;
  return <span className={`font-normal ${className}`}> · {text}</span>;
}

// Stacked: "{type} · {period}" on its own line directly BELOW the title (default).
// Render this AFTER the title element and BEFORE any bullets/description.
export function StackedDate({
  period,
  type,
  placement,
  className = "text-zinc-500",
}: {
  period?: string;
  type?: string;
  placement: DatePlacement;
  className?: string;
}) {
  if (placement !== "below") return null;
  const text = [type, period].filter(Boolean).join(" · ");
  if (!text) return null;
  return <p className={`mt-0.5 text-xs ${className}`}>{text}</p>;
}
