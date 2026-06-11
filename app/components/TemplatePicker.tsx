"use client";

import { useState, type CSSProperties } from "react";
import {
  CATEGORIES,
  templatesByCategory,
  getTemplate,
  type TemplateId,
  type Category,
  type LayoutId,
} from "@/app/templates";
import { IconChevron } from "./icons";

export function TemplatePicker({
  value,
  onChange,
}: {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}) {
  const current = getTemplate(value);
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<Category>(current.category);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2.5 text-sm"
      >
        <span className="font-medium text-zinc-700">
          Template: <span className="text-blue-600">{current.name}</span>
        </span>
        <IconChevron className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-3">
          <div className="flex gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  cat === c ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {templatesByCategory(cat).map((t) => {
              const active = t.id === value;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChange(t.id)}
                  className={`rounded-lg border p-1.5 text-left transition ${
                    active ? "border-blue-500 ring-2 ring-blue-200" : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <Thumb layout={t.layout} accent={t.accent} />
                  <span className="mt-1 block truncate text-[11px] font-medium text-zinc-600">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Thumb({ layout, accent }: { layout: LayoutId; accent: string }) {
  const style = { "--accent": accent } as CSSProperties;
  if (layout === "sidebar") {
    return (
      <div style={style} className="flex h-14 overflow-hidden rounded bg-zinc-50">
        <div className="w-1/3 bg-[var(--accent)] p-1">
          <div className="h-1.5 w-3/4 rounded bg-white/90" />
          <div className="mt-1 h-1 w-1/2 rounded bg-white/60" />
        </div>
        <div className="flex-1 space-y-1 p-1">
          <div className="h-1 w-full rounded bg-zinc-200" />
          <div className="h-1 w-5/6 rounded bg-zinc-200" />
        </div>
      </div>
    );
  }
  if (layout === "minimal") {
    return (
      <div style={style} className="h-14 rounded bg-zinc-50 p-1.5">
        <div className="mx-auto h-1.5 w-1/2 rounded bg-zinc-800" />
        <div className="mx-auto mt-0.5 h-1 w-1/4 rounded bg-[var(--accent)]" />
        <div className="my-1 h-px w-full bg-[var(--accent)]/40" />
        <div className="space-y-1">
          <div className="mx-auto h-1 w-5/6 rounded bg-zinc-200" />
          <div className="mx-auto h-1 w-2/3 rounded bg-zinc-200" />
        </div>
      </div>
    );
  }
  if (layout === "classic") {
    return (
      <div style={style} className="h-14 rounded bg-zinc-50 p-1.5">
        <div className="mx-auto h-1.5 w-1/2 rounded bg-zinc-800" />
        <div className="mx-auto mt-0.5 h-1 w-1/4 rounded bg-[var(--accent)]" />
        <div className="mt-1 border-b border-[var(--accent)]/50 pb-1" />
        <div className="mt-1 space-y-1">
          <div className="h-1 w-full rounded bg-zinc-200" />
          <div className="h-1 w-4/6 rounded bg-zinc-200" />
        </div>
      </div>
    );
  }
  if (layout === "aurora") {
    return (
      <div style={style} className="h-14 overflow-hidden rounded bg-zinc-50">
        <div className="bg-[var(--accent)] px-1.5 py-1">
          <div className="h-1.5 w-2/3 rounded bg-white/90" />
          <div className="mt-0.5 h-1 w-1/3 rounded bg-white/60" />
        </div>
        <div className="flex gap-1 p-1">
          <div className="flex-1 space-y-1">
            <div className="h-1 w-full rounded bg-zinc-200" />
            <div className="h-1 w-5/6 rounded bg-zinc-200" />
          </div>
          <div className="w-1/3 rounded bg-[var(--accent)]/20" />
        </div>
      </div>
    );
  }
  if (layout === "onyx") {
    return (
      <div style={style} className="h-14 overflow-hidden rounded bg-zinc-50">
        <div className="bg-zinc-900 px-1.5 py-1">
          <div className="h-1.5 w-2/3 rounded bg-white/90" />
          <div className="mt-0.5 h-1 w-1/3 rounded bg-[var(--accent)]" />
        </div>
        <div className="space-y-1 p-1.5">
          <div className="h-1 w-full rounded bg-zinc-200" />
          <div className="h-1 w-4/6 rounded bg-zinc-200" />
        </div>
      </div>
    );
  }
  // modern
  return (
    <div style={style} className="h-14 rounded bg-zinc-50 p-1.5">
      <div className="h-1.5 w-2/3 rounded bg-[var(--accent)]" />
      <div className="mt-0.5 h-1 w-1/3 rounded bg-zinc-300" />
      <div className="mt-1 space-y-1">
        <div className="h-1 w-full rounded bg-zinc-200" />
        <div className="h-1 w-4/6 rounded bg-zinc-200" />
      </div>
    </div>
  );
}
