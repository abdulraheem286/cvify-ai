import type { ReactNode } from "react";

// A labelled text input with a leading icon and optional inline error.
export function IconField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
              : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// A labelled textarea with optional inline error.
export function FieldTextarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-1 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-zinc-300 focus:border-blue-500 focus:ring-blue-500"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Validates an email only if one is provided. Returns an error string or "".
export function emailError(email: string): string {
  if (!email.trim()) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "" : "Enter a valid email address.";
}
