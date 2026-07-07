"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScaledPreview } from "./ScaledPreview";
import { TemplatePicker } from "./TemplatePicker";
import { TemplateView } from "@/app/templates/TemplateView";
import { ConfirmDialog } from "./Dialog";
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
import { IconArrowLeft, IconX, IconExpand, IconUndo, IconRedo } from "./icons";

// Neutral palettes for the (optional) body-text and muted-text colours.
const TEXT_COLORS = ["#18181b", "#27272a", "#1c1917", "#0f172a", "#1e293b", "#3f3f46"];
const MUTED_COLORS = ["#52525b", "#71717a", "#78716c", "#64748b", "#6b7280", "#94a3b8"];

type Design = { layout: TemplateId; theme: Theme };

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
  const history = useHistory<Design>({ layout: initialLayout, theme: initialTheme });
  const { layout, theme } = history.present;
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const setTheme = (t: Theme, key?: string) => history.set({ layout, theme: t }, key);
  const setLayout = (l: TemplateId) => history.set({ layout: l, theme });
  const set = (patch: Partial<Theme>, key?: string) => setTheme({ ...theme, ...patch }, key);

  // Escape closes the enlarged preview.
  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreviewOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewOpen]);

  // Undo / redo shortcuts (ignored while typing in the name field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const key = e.key.toLowerCase();
      if (key === "z" && !e.shiftKey) {
        e.preventDefault();
        history.undo();
      } else if ((key === "z" && e.shiftKey) || key === "y") {
        e.preventDefault();
        history.redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [history]);

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
    <main className="mx-auto w-full max-w-[1400px] flex-1 site-px py-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-blue-600"
      >
        <IconArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Action bar (name + undo/redo + save) — pinned below the app header */}
      <div className="sticky top-[68px] z-30 mt-3">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-3 shadow-sm backdrop-blur">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Template name"
            className="min-w-[12rem] flex-1 rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex items-center gap-1">
            <IconBtn label="Undo" onClick={history.undo} disabled={!history.canUndo}>
              <IconUndo className="h-[18px] w-[18px]" />
            </IconBtn>
            <IconBtn label="Redo" onClick={history.redo} disabled={!history.canRedo}>
              <IconRedo className="h-[18px] w-[18px]" />
            </IconBtn>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all hover:-translate-y-px disabled:opacity-60"
          >
            {saving ? "Saving…" : editId ? "Save changes" : "Save template"}
          </button>
          <button type="button" onClick={onBack} className="px-1 text-sm font-medium text-zinc-500 hover:text-zinc-800">
            Cancel
          </button>
        </div>
        {error && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Controls */}
        <div className="min-w-0 space-y-4">
          <Card title="Base layout">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <TemplatePicker value={layout} onChange={setLayout} />
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="text-xs font-medium text-zinc-500 underline-offset-2 hover:text-blue-600 hover:underline"
              >
                Reset to its default look
              </button>
            </div>
          </Card>

          <Card title="Presets">
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
          </Card>

          <Card title="Colours">
            <ColorRow label="Accent" value={theme.primary} swatches={SWATCHES} onPick={(c) => set({ primary: c })} />
            <ColorRow label="Headings & name" value={theme.secondary} swatches={SWATCHES} onPick={(c) => set({ secondary: c })} />
            <ColorRow label="Body text" value={theme.text} swatches={TEXT_COLORS} defaultable onPick={(c) => set({ text: c })} onDefault={() => set({ text: undefined })} />
            <ColorRow label="Muted text" value={theme.muted} swatches={MUTED_COLORS} defaultable onPick={(c) => set({ muted: c })} onDefault={() => set({ muted: undefined })} />
            <div className="mt-1">
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
          </Card>

          <Card title="Fonts">
            <p className="mb-1.5 text-xs font-medium text-zinc-500">Heading font</p>
            <FontButtons value={theme.fontHeading} onPick={(f) => set({ fontHeading: f })} />
            <p className="mb-1.5 mt-3 text-xs font-medium text-zinc-500">Body font</p>
            <FontButtons value={theme.fontBody} onPick={(f) => set({ fontBody: f })} />
          </Card>

          <Card title="Typography">
            <Slider
              label="Text size"
              min={FONT_SCALE_RANGE.min}
              max={FONT_SCALE_RANGE.max}
              step={FONT_SCALE_RANGE.step}
              value={theme.fontScale ?? FONT_SCALE_RANGE.default}
              display={`${Math.round((theme.fontScale ?? 1) * 100)}%`}
              onChange={(v) => set({ fontScale: v === 1 ? undefined : v }, "fontScale")}
            />
            <Slider
              label="Line spacing"
              min={LINE_HEIGHT_RANGE.min}
              max={LINE_HEIGHT_RANGE.max}
              step={LINE_HEIGHT_RANGE.step}
              value={theme.lineHeight ?? LINE_HEIGHT_RANGE.default}
              display={(theme.lineHeight ?? LINE_HEIGHT_RANGE.default).toFixed(2)}
              onChange={(v) => set({ lineHeight: v }, "lineHeight")}
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
          </Card>

          <Card title="Density">
            <Segment
              value={theme.density ?? "normal"}
              options={DENSITIES}
              onChange={(v) => set({ density: v === "normal" ? undefined : (v as Density) })}
            />
            <p className="mt-2 text-xs text-zinc-400">Controls how much fits on a page.</p>
          </Card>
        </div>

        {/* Preview — click to expand */}
        <div className="lg:sticky lg:top-[92px] lg:self-start">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="group relative block w-full rounded-2xl border border-zinc-200 bg-zinc-100 p-4 text-left"
          >
            <ScaledPreview maxHeight={640}>
              <TemplateView id={layout} cv={SAMPLE_CV} theme={theme} domId="studio-preview" />
            </ScaledPreview>
            <span className="pointer-events-none absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              <IconExpand className="h-4 w-4" /> Click to expand
            </span>
          </button>
        </div>
      </div>

      {/* Enlarged preview modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative w-full max-w-[840px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute -top-2 right-0 -translate-y-full rounded-lg bg-white/90 p-2 text-zinc-700 shadow-sm transition-colors hover:bg-white"
              aria-label="Close preview"
            >
              <IconX className="h-5 w-5" />
            </button>
            <div className="overflow-hidden rounded-xl shadow-2xl">
              <TemplateView id={layout} cv={SAMPLE_CV} theme={theme} domId="studio-preview-modal" />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Reset to default look?"
        message="This discards your colour, font, typography and density changes and restores this layout's original look."
        confirmLabel="Reset"
        danger
        onConfirm={() => {
          history.set({ layout, theme: getDefaultTheme(layout) });
          setConfirmReset(false);
        }}
        onClose={() => setConfirmReset(false)}
      />
    </main>
  );
}

// A small history stack for undo/redo over the design (layout + theme).
// Passing a coalesceKey merges consecutive changes to the same control (e.g. a
// slider drag) into ONE undo step instead of one per pixel.
function useHistory<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);
  const lastKey = useRef<string | null>(null);

  const set = (next: T, coalesceKey?: string) => {
    if (coalesceKey && coalesceKey === lastKey.current) {
      // Same control as the previous change — update in place, no new step.
      setPresent(next);
      setFuture([]);
      return;
    }
    lastKey.current = coalesceKey ?? null;
    setPast((p) => [...p, present]);
    setPresent(next);
    setFuture([]);
  };
  const undo = () => {
    if (!past.length) return;
    lastKey.current = null;
    setFuture((f) => [present, ...f]);
    setPresent(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
  };
  const redo = () => {
    if (!future.length) return;
    lastKey.current = null;
    setPast((p) => [...p, present]);
    setPresent(future[0]);
    setFuture((f) => f.slice(1));
  };

  return { present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="rounded-lg border border-zinc-300 bg-white p-2 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
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
