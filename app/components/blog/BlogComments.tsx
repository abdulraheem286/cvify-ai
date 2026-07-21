"use client";

import { useEffect, useState, type FormEvent } from "react";
import { listComments, addComment, deleteComment, type BlogComment } from "../../lib/blogSocial";
import { firebaseEnabled } from "../../lib/firebase";

function initialsOf(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
}

function timeAgo(ms: number | null): string {
  if (!ms) return "just now";
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} month${mo > 1 ? "s" : ""} ago`;
  return `${Math.floor(mo / 12)} year${mo >= 24 ? "s" : ""} ago`;
}

// Which comment ids this browser created — so we can offer "Delete" on them.
function loadMine(slug: string): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(`cvify-my-comments:${slug}`) || "[]"));
  } catch {
    return new Set();
  }
}
function saveMine(slug: string, ids: Set<string>) {
  try {
    localStorage.setItem(`cvify-my-comments:${slug}`, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

// Anonymous comments (name + text), stored in Firestore. Comment text is
// rendered as plain React text, so it is escaped — no HTML injection.
export function BlogComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [mine, setMine] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let on = true;
    setMine(loadMine(slug));
    listComments(slug).then((c) => {
      if (on) {
        setComments(c);
        setLoaded(true);
      }
    });
    return () => {
      on = false;
    };
  }, [slug]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const t = text.trim();
    if (!n || !t) {
      setError("Please add your name and a comment.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const id = await addComment(slug, n, t);
      setMine((prev) => {
        const s = new Set(prev);
        s.add(id);
        saveMine(slug, s);
        return s;
      });
      setComments((cur) => [{ id, name: n, text: t, createdAt: Date.now() }, ...cur]);
      setText("");
    } catch {
      setError("Couldn't post your comment. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const prev = comments;
    setComments((cur) => cur.filter((c) => c.id !== id));
    setMine((cur) => {
      const s = new Set(cur);
      s.delete(id);
      saveMine(slug, s);
      return s;
    });
    try {
      await deleteComment(slug, id);
    } catch {
      setComments(prev); // restore on failure
    }
  }

  if (!firebaseEnabled) return null;

  const inputCls =
    "w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 outline-none transition-colors hover:border-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <section className="mx-auto mt-16 max-w-3xl border-t border-zinc-200 pt-10">
      <h2 className="text-xl font-bold tracking-tight text-zinc-900">
        Comments
        {loaded && comments.length > 0 && <span className="font-normal text-zinc-400"> ({comments.length})</span>}
      </h2>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Your name" className={inputCls} />
        <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} rows={4} placeholder="Share your thoughts…" className={inputCls} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {busy ? "Posting…" : "Post comment"}
        </button>
      </form>

      <div className="mt-10 space-y-6">
        {loaded && comments.length === 0 && (
          <p className="text-sm text-zinc-500">No comments yet. Be the first to share your thoughts.</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white" aria-hidden>
              {initialsOf(c.name)}
            </span>
            <div className="min-w-0">
              <p className="text-sm">
                <span className="font-semibold text-zinc-900">{c.name}</span>
                <span className="text-zinc-400"> · {timeAgo(c.createdAt)}</span>
                {mine.has(c.id) && (
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="ml-3 text-xs font-medium text-zinc-400 transition-colors hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
