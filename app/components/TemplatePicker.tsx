"use client";

import { TEMPLATES, type TemplateId } from "@/app/templates";

export function TemplatePicker({
  value,
  onChange,
}: {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-zinc-700">Choose a template</p>
      <div className="grid grid-cols-3 gap-3">
        {TEMPLATES.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-pressed={active}
              className={`rounded-lg border bg-white p-2 text-center transition ${
                active
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <Thumb id={t.id} />
              <span className="mt-2 block text-xs font-medium text-zinc-700">{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Tiny abstract previews of each layout (no real content — reliable + fast).
function Thumb({ id }: { id: TemplateId }) {
  if (id === "minimal") {
    return (
      <div className="h-20 rounded bg-zinc-50 p-2">
        <div className="mx-auto h-1.5 w-1/2 rounded bg-zinc-800" />
        <div className="mx-auto mt-1 h-1 w-1/4 rounded bg-zinc-300" />
        <div className="my-1.5 h-px w-full bg-zinc-300" />
        <div className="space-y-1">
          <div className="mx-auto h-1 w-5/6 rounded bg-zinc-200" />
          <div className="mx-auto h-1 w-3/4 rounded bg-zinc-200" />
          <div className="mx-auto h-1 w-2/3 rounded bg-zinc-200" />
        </div>
      </div>
    );
  }
  if (id === "sidebar") {
    return (
      <div className="flex h-20 overflow-hidden rounded bg-zinc-50">
        <div className="w-1/3 bg-blue-600 p-1.5">
          <div className="h-1.5 w-3/4 rounded bg-white/90" />
          <div className="mt-1 h-1 w-1/2 rounded bg-white/60" />
          <div className="mt-2 space-y-1">
            <div className="h-1 w-full rounded bg-white/40" />
            <div className="h-1 w-2/3 rounded bg-white/40" />
          </div>
        </div>
        <div className="flex-1 space-y-1 p-1.5">
          <div className="h-1 w-full rounded bg-zinc-200" />
          <div className="h-1 w-5/6 rounded bg-zinc-200" />
          <div className="h-1 w-4/6 rounded bg-zinc-200" />
        </div>
      </div>
    );
  }
  // modern
  return (
    <div className="h-20 rounded bg-zinc-50 p-2">
      <div className="h-1.5 w-2/3 rounded bg-blue-600" />
      <div className="mt-1 h-1 w-1/3 rounded bg-zinc-300" />
      <div className="mt-2 space-y-1">
        <div className="h-1 w-full rounded bg-zinc-200" />
        <div className="h-1 w-5/6 rounded bg-zinc-200" />
        <div className="h-1 w-4/6 rounded bg-zinc-200" />
      </div>
    </div>
  );
}
