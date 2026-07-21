import type { Author } from "../../lib/authors";
import { AuthorAvatar } from "./AuthorAvatar";

// Compact author card for the sticky post sidebar.
export function SidebarAuthor({ author }: { author: Author }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <AuthorAvatar author={author} size={52} />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">Written by</p>
          <p className="font-semibold text-zinc-900">{author.name}</p>
          {author.role && <p className="text-xs text-zinc-500">{author.role}</p>}
        </div>
      </div>
      {author.bio && <p className="mt-4 text-sm leading-relaxed text-zinc-600">{author.bio}</p>}
      {(author.linkedin || author.email) && (
        <div className="mt-3 flex gap-4 text-sm font-medium">
          {author.linkedin && (
            <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 transition-colors hover:text-blue-700">
              LinkedIn
            </a>
          )}
          {author.email && (
            <a href={`mailto:${author.email}`} className="text-blue-600 transition-colors hover:text-blue-700">
              Email
            </a>
          )}
        </div>
      )}
    </div>
  );
}
