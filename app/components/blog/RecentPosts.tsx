import Link from "next/link";
import { formatDate, type PostMeta } from "../../lib/blog";

// Compact list of recent articles for the sticky post sidebar.
export function RecentPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Recent articles</h3>
      <ul className="mt-4 space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group flex gap-3">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xl" aria-hidden>
                  {p.cover}
                </span>
              )}
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-medium text-zinc-900 transition-colors group-hover:text-blue-700">{p.title}</p>
                <p className="mt-1 text-xs text-zinc-400">{formatDate(p.date)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
