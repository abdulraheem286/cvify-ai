"use client";

import { useEffect, useState } from "react";
import { getLikes, addLike } from "../../lib/blogSocial";
import { firebaseEnabled } from "../../lib/firebase";

// Anonymous "like" button — one like per browser (tracked in localStorage),
// count stored in Firestore.
export function BlogLikes({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let on = true;
    getLikes(slug).then((n) => {
      if (on) setCount(n);
    });
    try {
      if (localStorage.getItem(`cvify-liked:${slug}`)) setLiked(true);
    } catch {
      /* ignore */
    }
    return () => {
      on = false;
    };
  }, [slug]);

  async function like() {
    if (liked || !firebaseEnabled) return;
    setLiked(true);
    setCount((c) => (c ?? 0) + 1);
    try {
      localStorage.setItem(`cvify-liked:${slug}`, "1");
    } catch {
      /* ignore */
    }
    try {
      await addLike(slug);
    } catch {
      /* keep the optimistic count */
    }
  }

  if (!firebaseEnabled) return null;

  return (
    <div className="mt-12 flex flex-col items-center gap-3 border-t border-zinc-200 pt-8 text-center">
      <p className="text-sm text-zinc-500">Found this helpful?</p>
      <button
        type="button"
        onClick={like}
        disabled={liked}
        aria-pressed={liked}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
          liked
            ? "border-blue-200 bg-blue-50 text-blue-600"
            : "border-zinc-300 text-zinc-700 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600"
        }`}
      >
        <span aria-hidden className="text-base leading-none">{liked ? "♥" : "♡"}</span>
        {liked ? "Liked" : "Like this post"}
        {count !== null && count > 0 && <span className="tabular-nums font-normal text-zinc-400">· {count}</span>}
      </button>
    </div>
  );
}
