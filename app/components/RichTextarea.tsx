"use client";

import { useRef, type KeyboardEvent } from "react";

// Textarea with a small formatting toolbar (bold / italic / bullet / link),
// keyboard shortcuts, and auto-grow. Stores lightweight markdown that the CV
// templates render via app/lib/richtext.
export function RichTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  list = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  list?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function restore(start: number, end: number) {
    requestAnimationFrame(() => {
      const ta = ref.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(start, end);
    });
  }

  function wrap(token: string) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end) || "text";
    const next = value.slice(0, start) + token + sel + token + value.slice(end);
    onChange(next);
    restore(start + token.length, start + token.length + sel.length);
  }

  function bulletLine() {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = value.slice(0, lineStart) + "- " + value.slice(lineStart);
    onChange(next);
    restore(start + 2, start + 2);
  }

  function link() {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end) || "link text";
    const ins = `[${sel}](https://)`;
    const next = value.slice(0, start) + ins + value.slice(end);
    onChange(next);
    // place cursor inside the URL parens
    const urlPos = start + ins.length - 1;
    restore(urlPos, urlPos);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.metaKey || e.ctrlKey) {
      const k = e.key.toLowerCase();
      if (k === "b") {
        e.preventDefault();
        wrap("**");
      } else if (k === "i") {
        e.preventDefault();
        wrap("*");
      }
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</label>
      <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-zinc-300 bg-zinc-50 px-1.5 py-1">
        <ToolBtn label="Bold (Ctrl+B)" onClick={() => wrap("**")}>
          <span className="font-bold">B</span>
        </ToolBtn>
        <ToolBtn label="Italic (Ctrl+I)" onClick={() => wrap("*")}>
          <span className="italic">I</span>
        </ToolBtn>
        {list && (
          <ToolBtn label="Bullet point" onClick={bulletLine}>
            <span className="text-base leading-none">•</span>
          </ToolBtn>
        )}
        <ToolBtn label="Insert link" onClick={link}>
          <span className="text-xs">🔗</span>
        </ToolBtn>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-b-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 outline-none [field-sizing:content] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <p className="mt-1 text-xs text-zinc-400">
        Formatting: <span className="font-bold">**bold**</span>, <span className="italic">*italic*</span>
        {list ? ", - bullet" : ""}, [text](url)
      </p>
    </div>
  );
}

function ToolBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded text-sm text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900"
    >
      {children}
    </button>
  );
}
