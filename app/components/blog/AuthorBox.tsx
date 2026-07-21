import type { Author } from "../../lib/authors";
import { AuthorAvatar } from "./AuthorAvatar";

// The "About the author" box shown after the article body.
export function AuthorBox({ author }: { author: Author }) {
  return (
    <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:flex-row sm:items-start">
      <AuthorAvatar author={author} size={64} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Written by</p>
        <p className="mt-0.5 font-semibold text-zinc-900">
          {author.name}
          {author.role && <span className="font-normal text-zinc-500"> · {author.role}</span>}
        </p>
        {author.bio && <p className="mt-2 text-sm leading-relaxed text-zinc-600">{author.bio}</p>}
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
    </div>
  );
}
