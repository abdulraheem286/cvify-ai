import type { ReactNode } from "react";

// A labelled text input with a leading icon and optional inline error.
export function IconField({
  label,
  icon,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  type = "text",
  inputMode,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  type?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
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
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:ring-1 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
              : "border-zinc-300 hover:border-zinc-400 focus:border-blue-500 focus:ring-blue-500"
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
  onBlur,
  placeholder,
  error,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
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
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:ring-1 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-zinc-300 hover:border-zinc-400 focus:border-blue-500 focus:ring-blue-500"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

/* ---------------- Validators ---------------- */

export function requiredError(v: string, label = "This field"): string {
  return v.trim() ? "" : `${label} is required.`;
}

export function nameError(v: string, required = true): string {
  if (!v.trim()) return required ? "Your name is required." : "";
  if (/\d/.test(v)) return "Name should not contain numbers.";
  return "";
}

export function emailError(email: string, required = false): string {
  if (!email.trim()) return required ? "Email is required." : "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? ""
    : "Enter a valid email address.";
}

export function phoneError(phone: string, required = false): string {
  if (!phone.trim()) return required ? "Phone number is required." : "";
  if (!/^[0-9+\-()\s]+$/.test(phone.trim()))
    return "Phone can only contain numbers and + - ( ).";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return "Enter a valid phone number.";
  return "";
}

export function urlError(url: string): string {
  if (!url.trim()) return "";
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(url.trim())
    ? ""
    : "Enter a valid website (e.g. yoursite.com).";
}

// Strip anything that isn't a valid phone character (blocks letters as you type).
export function sanitizePhone(v: string): string {
  return v.replace(/[^0-9+\-()\s]/g, "");
}
