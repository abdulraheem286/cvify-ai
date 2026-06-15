"use client";

import { useEffect, useState, type ReactNode } from "react";

function Overlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button aria-hidden tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-default bg-black/40" />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">{children}</div>
    </div>
  );
}

// Confirmation dialog. For destructive actions (danger), the user must confirm
// TWICE — the button arms on the first click and executes on the second.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!open) setArmed(false);
  }, [open]);
  if (!open) return null;

  return (
    <Overlay onClose={onClose}>
      <h2 className="text-lg font-bold tracking-tight text-zinc-900">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{message}</p>
      {danger && armed && (
        <p className="mt-3 text-sm font-medium text-red-600">This can&apos;t be undone. Click again to confirm.</p>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (danger && !armed) {
              setArmed(true);
              return;
            }
            onConfirm();
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${
            danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {danger && armed ? "Yes, I'm sure" : confirmLabel}
        </button>
      </div>
    </Overlay>
  );
}

// Single text-input dialog (replaces window.prompt).
export function PromptDialog({
  open,
  title,
  label,
  defaultValue = "",
  confirmLabel = "Save",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  label: string;
  defaultValue?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    if (open) setValue(defaultValue);
  }, [open, defaultValue]);
  if (!open) return null;

  return (
    <Overlay onClose={onClose}>
      <h2 className="text-lg font-bold tracking-tight text-zinc-900">{title}</h2>
      <label className="mt-4 mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) onConfirm(value.trim());
        }}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100">
          Cancel
        </button>
        <button
          type="button"
          disabled={!value.trim()}
          onClick={() => onConfirm(value.trim())}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {confirmLabel}
        </button>
      </div>
    </Overlay>
  );
}
