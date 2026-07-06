"use client";

import { useState } from "react";
import Link from "next/link";
import { THEME_PRESETS, type Theme } from "@/app/templates";
import { IconChevron, IconSparkles } from "./icons";

// Lightweight editor control: one-click colour/font looks. Deep customization
// (typography, density, custom colours, saving templates) lives on /customize.
export function QuickPresets({
  value,
  onChange,
}: {
  value: Theme;
  onChange: (theme: Theme) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
      >
        <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: value.primary }} />
        <span className="hidden sm:inline">Presets</span>
        <IconChevron className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <button aria-hidden tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-30 cursor-default" />
          <div className="absolute right-0 z-40 mt-2 w-[300px] rounded-xl border border-zinc-200 bg-white p-3 shadow-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Quick looks</p>
            <div className="grid grid-cols-2 gap-1.5">
              {THEME_PRESETS.map((p) => {
                const active =
                  value.primary.toLowerCase() === p.theme.primary.toLowerCase() &&
                  value.fontHeading === p.theme.fontHeading;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      // Keep any extended options the CV already has; just swap the look.
                      onChange({ ...value, ...p.theme });
                      setOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition ${
                      active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    <span className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10" style={{ backgroundColor: p.theme.primary }} />
                    <span className="truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
            <Link
              href="/customize"
              className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              <IconSparkles className="h-4 w-4" /> Create a custom template
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
