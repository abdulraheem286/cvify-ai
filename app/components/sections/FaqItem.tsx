"use client";

import { useId } from "react";
import type { Faq } from "../../lib/faqs";

// A single FAQ row with a smooth open/close animation. Uses the grid-rows
// 0fr → 1fr technique (works in every browser) instead of a native <details>,
// which can't animate its close. The answer stays in the DOM either way, so
// it remains crawlable for SEO. Open state is controlled by the parent FaqList
// so only one row is open at a time.
export function FaqItem({
  faq,
  open,
  onToggle,
  className = "",
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const panelId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-base font-medium text-zinc-900"
      >
        {faq.q}
        <span className={`shrink-0 text-blue-600 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div
        id={panelId}
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}
