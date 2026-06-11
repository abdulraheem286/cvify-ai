"use client";

import { useState } from "react";
import {
  FONTS,
  SWATCHES,
  BACKGROUNDS,
  THEME_PRESETS,
  type Theme,
} from "@/app/templates";
import { IconChevron } from "./icons";

// Editor toolbar dropdown: change colours, background, and fonts of any layout.
export function CustomizationPanel({
  value,
  onChange,
}: {
  value: Theme;
  onChange: (theme: Theme) => void;
}) {
  const [open, setOpen] = useState(false);
  const set = (patch: Partial<Theme>) => onChange({ ...value, ...patch });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      >
        <span
          className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
          style={{ backgroundColor: value.primary }}
        />
        <span className="hidden sm:inline">Customize</span>
        <IconChevron className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div className="absolute right-0 z-40 mt-2 max-h-[70vh] w-[320px] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-xl">
            {/* Presets */}
            <Group label="Presets">
              <div className="flex flex-wrap gap-2">
                {THEME_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onChange(p.theme)}
                    title={p.name}
                    className="flex items-center gap-1 rounded-full border border-zinc-200 py-1 pl-1 pr-2.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                  >
                    <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: p.theme.primary }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </Group>

            <Group label="Primary colour">
              <Swatches value={value.primary} onPick={(c) => set({ primary: c })} />
            </Group>

            <Group label="Secondary colour">
              <Swatches value={value.secondary} onPick={(c) => set({ secondary: c })} />
            </Group>

            <Group label="Background">
              <div className="flex flex-wrap gap-2">
                {BACKGROUNDS.map((b) => {
                  const active = value.bg.toLowerCase() === b.value.toLowerCase();
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => set({ bg: b.value })}
                      title={b.name}
                      aria-label={b.name}
                      className={`h-7 w-7 rounded-full ring-1 ring-inset ring-zinc-300 transition ${
                        active ? "outline outline-2 outline-offset-2 outline-blue-500" : "hover:ring-zinc-400"
                      }`}
                      style={{ backgroundColor: b.value }}
                    />
                  );
                })}
              </div>
            </Group>

            <Group label="Heading font">
              <FontButtons value={value.fontHeading} onPick={(f) => set({ fontHeading: f })} />
            </Group>

            <Group label="Body font">
              <FontButtons value={value.fontBody} onPick={(f) => set({ fontBody: f })} />
            </Group>
          </div>
        </>
      )}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
      {children}
    </div>
  );
}

function Swatches({ value, onPick }: { value: string; onPick: (c: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {SWATCHES.map((c) => {
        const active = value.toLowerCase() === c.toLowerCase();
        return (
          <button
            key={c}
            type="button"
            onClick={() => onPick(c)}
            aria-label={c}
            className={`h-6 w-6 rounded-full ring-1 ring-black/10 transition ${
              active ? "outline outline-2 outline-offset-2 outline-blue-500" : "hover:scale-110"
            }`}
            style={{ backgroundColor: c }}
          />
        );
      })}
      {/* Custom colour picker */}
      <label
        className="relative h-6 w-6 cursor-pointer overflow-hidden rounded-full ring-1 ring-zinc-300"
        title="Custom colour"
        style={{ background: "conic-gradient(red, orange, yellow, lime, aqua, blue, magenta, red)" }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onPick(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}

function FontButtons({ value, onPick }: { value: string; onPick: (f: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {FONTS.map((f) => {
        const active = value === f.value;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onPick(f.value)}
            style={{ fontFamily: f.value }}
            className={`truncate rounded-lg border px-2.5 py-1.5 text-sm transition ${
              active
                ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
            }`}
          >
            {f.name}
          </button>
        );
      })}
    </div>
  );
}
