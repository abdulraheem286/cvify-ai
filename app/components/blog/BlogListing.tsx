"use client";

import { useMemo, useState } from "react";
import type { PostMeta } from "../../lib/blog";
import { PostCard } from "./PostCard";

const PAGE = 9;

type Sort = "recent" | "az";

// Interactive blog index: search, sort (recent / A–Z), and "load more" (9 at a time).
export function BlogListing({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recent");
  const [visible, setVisible] = useState(PAGE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? posts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q)),
        )
      : posts;
    return [...matched].sort((a, b) =>
      sort === "az" ? a.title.localeCompare(b.title) : a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
    );
  }, [posts, query, sort]);

  const shown = filtered.slice(0, visible);

  function onSearch(v: string) {
    setQuery(v);
    setVisible(PAGE);
  }
  function onSort(s: Sort) {
    setSort(s);
    setVisible(PAGE);
  }

  const segBtn = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
    }`;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors hover:border-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="inline-flex items-center gap-1 self-start rounded-lg border border-zinc-200 bg-zinc-50 p-1 sm:self-auto">
          <button type="button" onClick={() => onSort("recent")} className={segBtn(sort === "recent")} aria-pressed={sort === "recent"}>
            Recent
          </button>
          <button type="button" onClick={() => onSort("az")} className={segBtn(sort === "az")} aria-pressed={sort === "az"}>
            A–Z
          </button>
        </div>
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <p className="mt-16 text-center text-zinc-500">No articles match “{query}”.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}

      {/* Load more */}
      {visible < filtered.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE)}
            className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600"
          >
            Load more articles
          </button>
        </div>
      )}
    </div>
  );
}
