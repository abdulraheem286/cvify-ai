import Link from "next/link";
import { formatDate } from "../../lib/blogFormat";
import type { PostMeta } from "../../lib/blog";

// A blog post card — used on the /blog index and the "Keep reading" grid.
export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5"
    >
      {/* Thumbnail — real image if provided, else a branded gradient + emoji */}
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image} alt="" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-5xl" aria-hidden>
          {post.cover}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {post.tags[0] && (
          <span className="inline-block w-fit rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-600">
            {post.tags[0]}
          </span>
        )}
        <h2 className="mt-3 text-lg font-semibold leading-snug text-zinc-900 group-hover:text-blue-700">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">{post.description}</p>
        {/* Date + read time pinned to the bottom of the card */}
        <p className="mt-auto flex items-center gap-2 pt-5 text-xs text-zinc-400">
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </p>
      </div>
    </Link>
  );
}
