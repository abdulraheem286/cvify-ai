"use client";

import { useState, type ReactNode } from "react";
import { ScaledPreview } from "./ScaledPreview";
import { TemplatePicker } from "./TemplatePicker";
import { TemplateView } from "@/app/templates/TemplateView";
import {
  FONTS,
  SWATCHES,
  BACKGROUNDS,
  THEME_PRESETS,
  DENSITIES,
  FONT_SCALE_RANGE,
  LINE_HEIGHT_RANGE,
  getDefaultTheme,
  type Theme,
  type TemplateId,
  type Density,
} from "@/app/templates";
import { SAMPLE_CV } from "@/app/lib/sampleCv";
import { useAuth } from "./AuthProvider";
import { createTemplate, updateTemplate } from "@/app/lib/templateStore";
import { IconArrowLeft } from "./icons";

// Neutral palettes for the (optional) body-text and muted-text colours.
const TEXT_COLORS = ["#18181b", "#27272a", "#1c1917", "#0f172a", "#1e293b", "#3f3f46"];
const MUTED_COLORS = ["#52525b", "#71717a", "#78716c", "#64748b", "#6b7280", "#94a3b8"];

export function CustomizeStudio({
  initialLayout,
  initialTheme,
  initialName,
  editId,
  onBack,
  onSaved,
}: {
  initialLayout: TemplateId;
  initialTheme: Theme;
  initialName: string;
  editId?: string;
  onBack: () => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const [layout, setLayout] = useState<TemplateId>(initialLayout);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<Theme>) => setTheme((t) => ({ ...t, ...patch }));

  async function save() {
    if (!user) {
      setError("You need to be signed in to save a template.");
      return;
    }
    const finalName = name.trim() || "My template";
    setError(null);
    setSaving(true);
    try {
      if (editId) await updateTemplate(user.uid, editId, finalName, layout, theme);
      else await createTemplate(user.uid, finalName, layout, theme);
      onSaved();
    } catch (e) {
      console.error("Template save failed:", e);
      setError("Couldn't save this template. Please try again in a moment.");
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 site-px py-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-blue-600"
      >
        <IconArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Controls */}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{editId ? "Edit template" : "Create a template"}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Start from a base layout, then fine-tune the look. Save it to reuse on any CV.
          </p>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Template name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My blue serif"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Section title="Base layout">
            <TemplatePicker value={layout} onChange={setLayout} />
            <button
              type="button"
              onClick={() => setTheme(getDefaultTheme(layout))}
              className="ml-2 text-xs font-medium text-zinc-500 underline-offset-2 hover:text-blue-600 hover:underline"
            >
              Reset to its default look
            </button>
          </Section>

          <Section title="Presets">
            <div className="flex flex-wrap gap-2">
              {THEME_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set(p.theme)}
                  className="flex items-center gap-1.5 rounded-full border border-zinc-200 py-1 pl-1 pr-3 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                >
                  <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ backgroundColor: p.theme.primary }} />
                  {p.name}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Colours">
            <ColorRow label="Accent" value={theme.primary} swatches={SWATCHES} onPick={(c) => set({ primary: c })} />
            <ColorRow label="Headings & name" value={theme.secondary} swatches={SWATCHES} onPick={(c) => set({ secondary: c })} />
            <ColorRow label="Body text" value={theme.text} swatches={TEXT_COLORS} defaultable onPick={(c) => set({ text: c })} onDefault={() => set({ text: undefined })} />
            <ColorRow label="Muted text" value={theme.muted} swatches={MUTED_COLORS} defaultable onPick={(c) => set({ muted: c })} onDefault={() => set({ muted: undefined })} />
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-zinc-500">Background</p>
              <div className="flex flex-wrap gap-2">
                {BACKGROUNDS.map((b) => {
                  const active = theme.bg.toLowerCase() === b.value.toLowerCase();
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
            </div>
          </Section>

          <Section title="Fonts">
            <p className="mb-1.5 text-xs font-medium text-zinc-500">Heading font</p>
            <FontButtons value={theme.fontHeading} onPick={(f) => set({ fontHeading: f })} />
            <p className="mb-1.5 mt-3 text-xs font-medium text-zinc-500">Body font</p>
            <FontButtons value={theme.fontBody} onPick={(f) => set({ fontBody: f })} />
          </Section>

          <Section title="Typography">
            <Slider
              label="Text size"
              min={FONT_SCALE_RANGE.min}
              max={FONT_SCALE_RANGE.max}
              step={FONT_SCALE_RANGE.step}
              value={theme.fontScale ?? FONT_SCALE_RANGE.default}
              display={`${Math.round((theme.fontScale ?? 1) * 100)}%`}
              onChange={(v) => set({ fontScale: v === 1 ? undefined : v })}
            />
            <Slider
              label="Line spacing"
              min={LINE_HEIGHT_RANGE.min}
              max={LINE_HEIGHT_RANGE.max}
              step={LINE_HEIGHT_RANGE.step}
              value={theme.lineHeight ?? LINE_HEIGHT_RANGE.default}
              display={(theme.lineHeight ?? LINE_HEIGHT_RANGE.default).toFixed(2)}
              onChange={(v) => set({ lineHeight: v })}
            />
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-medium text-zinc-500">Heading case</p>
              <Segment
                value={theme.headingCase === "upper" ? "upper" : "as-designed"}
                options={[
                  { id: "as-designed", name: "As designed" },
                  { id: "upper", name: "UPPERCASE" },
                ]}
                onChange={(v) => set({ headingCase: v === "upper" ? "upper" : undefined })}
              />
            </div>
          </Section>

          <Section title="Density">
            <Segment
              value={theme.density ?? "normal"}
              options={DENSITIES}
              onChange={(v) => set({ density: v === "normal" ? undefined : (v as Density) })}
            />
            <p className="mt-2 text-xs text-zinc-400">Controls how much fits on a page.</p>
          </Section>
        </div>

        {/* Preview + save */}
        <div className="lg:sticky lg:top-[84px] lg:self-start">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-4">
            <ScaledPreview maxHeight={620} capClassName="">
              <TemplateView id={layout} cv={SAMPLE_CV} theme={theme} domId="studio-preview" />
            </ScaledPreview>
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all hover:-translate-y-px disabled:opacity-60"
              >
                {saving ? "Saving…" : editId ? "Save changes" : "Save template"}
              </button>
              <button type="button" onClick={onBack} className="text-sm font-medium text-zinc-500 hover:text-zinc-800">
                Cancel
              </button>
            </div>
            {error && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6 border-t border-zinc-100 pt-5 first:border-t-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">{title}</p>
      {children}
    </div>
  );
}

function ColorRow({
  label,
  value,
  swatches,
  onPick,
  defaultable,
  onDefault,
}: {
  label: string;
  value?: string;
  swatches: string[];
  onPick: (c: string) => void;
  defaultable?: boolean;
  onDefault?: () => void;
}) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs font-medium text-zinc-500">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        {defaultable && (
          <button
            type="button"
            onClick={onDefault}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              !value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
            }`}
          >
            Default
          </button>
        )}
        {swatches.map((c) => {
          const active = (value || "").toLowerCase() === c.toLowerCase();
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
        <label
          className="relative h-6 w-6 cursor-pointer overflow-hidden rounded-full ring-1 ring-zinc-300"
          title="Custom colour"
          style={{ background: "conic-gradient(red, orange, yellow, lime, aqua, blue, magenta, red)" }}
        >
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onPick(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>
    </div>
  );
}

function FontButtons({ value, onPick }: { value: string; onPick: (f: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {FONTS.map((f) => {
        const active = value === f.value;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onPick(f.value)}
            style={{ fontFamily: f.value }}
            className={`truncate rounded-lg border px-2.5 py-1.5 text-sm transition ${
              active ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200" : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
            }`}
          >
            {f.name}
          </button>
        );
      })}
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <span className="text-xs font-semibold text-zinc-700">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
    </div>
  );
}

function Segment<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; name: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
            value === o.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {o.name}
        </button>
      ))}
    </div>
  );
}
