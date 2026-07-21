"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS: [string, string][] = [
  ["Features", "/features"],
  ["Templates", "/templates"],
  ["FAQ", "/faq"],
];

// Hamburger menu for the marketing header on small screens (the inline nav is
// hidden below `sm`). Renders nothing on desktop.
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="-ml-1 rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <>
          <button aria-hidden tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-30 cursor-default" />
          <div className="absolute inset-x-0 top-full z-40 border-b border-zinc-200 bg-white px-4 py-2 shadow-lg">
            <nav className="flex flex-col">
              {LINKS.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
