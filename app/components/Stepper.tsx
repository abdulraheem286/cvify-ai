import { Fragment } from "react";

// Generic step indicator. `current` is the 0-based index of the active step.
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mx-auto mb-8 flex max-w-xl items-center">
      {steps.map((label, i) => (
        <Fragment key={label}>
          {i > 0 && (
            <div
              className={`mx-2 h-0.5 flex-1 rounded sm:mx-3 ${
                i <= current ? "bg-blue-600" : "bg-zinc-200"
              }`}
            />
          )}
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i === current || i < current ? "bg-blue-600 text-white" : "bg-zinc-200 text-zinc-500"
              }`}
            >
              {i < current ? "✓" : i + 1}
            </span>
            <span
              className={`hidden text-sm font-medium sm:inline ${
                i === current ? "text-zinc-900" : "text-zinc-500"
              }`}
            >
              {label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
