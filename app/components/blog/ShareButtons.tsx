"use client";

import { useState } from "react";

// Share bar shown under the article. Social links are plain anchors; "Copy link"
// uses the clipboard API.
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2.5 border-t border-zinc-200 pt-6">
      <span className="mr-1 text-sm font-semibold text-zinc-700">Share:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:border-blue-200 hover:text-blue-600"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:border-blue-200 hover:text-blue-600"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
