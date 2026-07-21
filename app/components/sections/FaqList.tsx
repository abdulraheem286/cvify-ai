"use client";

import { useState } from "react";
import { faqs } from "../../lib/faqs";
import { FaqItem } from "./FaqItem";

// Client island holding the accordion state. Only one FAQ is open at a time —
// opening a row closes the previously open one. `columns` picks the layout
// (2 = wide card grid on the /faq page, 1 = stacked list on the homepage).
export function FaqList({ columns = 1, topGap = false }: { columns?: 1 | 2; topGap?: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIdx((cur) => (cur === i ? null : i));
  const gap = topGap ? " mt-12" : "";

  if (columns === 2) {
    return (
      <div className={`grid items-start gap-4 sm:grid-cols-2${gap}`}>
        {faqs.map((f, i) => (
          <FaqItem key={f.q} faq={f} open={openIdx === i} onToggle={() => toggle(i)} className="rounded-xl border border-zinc-200 p-5" />
        ))}
      </div>
    );
  }

  return (
    <div className={`divide-y divide-zinc-200 border-y border-zinc-200${gap}`}>
      {faqs.map((f, i) => (
        <FaqItem key={f.q} faq={f} open={openIdx === i} onToggle={() => toggle(i)} className="py-5" />
      ))}
    </div>
  );
}
