"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getLikes, addLike } from "../../lib/blogSocial";
import { firebaseEnabled } from "../../lib/firebase";

// Shared like state so the top (inline) and bottom (block) buttons stay in sync.
// Anonymous — one like per browser (localStorage), count stored in Firestore.
type LikeCtx = { count: number | null; liked: boolean; like: () => void; enabled: boolean };
const Ctx = createContext<LikeCtx | null>(null);

export function LikeProvider({ slug, children }: { slug: string; children: ReactNode }) {
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

  return <Ctx.Provider value={{ count, liked, like, enabled: firebaseEnabled }}>{children}</Ctx.Provider>;
}

function useLike(): LikeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLike must be used inside <LikeProvider>");
  return c;
}

// variant "inline" = compact pill (used at the top), "block" = centered prompt (bottom).
export function LikeButton({ variant = "block" }: { variant?: "inline" | "block" }) {
  const { count, liked, like, enabled } = useLike();
  if (!enabled) return null;

  const suffix = count !== null && count > 0 ? <span className="tabular-nums font-normal text-zinc-400">· {count}</span> : null;

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={like}
        disabled={liked}
        aria-pressed={liked}
        aria-label="Like this post"
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
          liked ? "border-blue-200 bg-blue-50 text-blue-600" : "border-zinc-300 text-zinc-600 hover:border-blue-300 hover:text-blue-600"
        }`}
      >
        <span aria-hidden className="text-base leading-none">{liked ? "♥" : "♡"}</span>
        {liked ? "Liked" : "Like"}
        {suffix}
      </button>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-3 border-t border-zinc-200 pt-8 text-center">
      <p className="text-sm text-zinc-500">Found this helpful?</p>
      <button
        type="button"
        onClick={like}
        disabled={liked}
        aria-pressed={liked}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
          liked ? "border-blue-200 bg-blue-50 text-blue-600" : "border-zinc-300 text-zinc-700 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600"
        }`}
      >
        <span aria-hidden className="text-base leading-none">{liked ? "♥" : "♡"}</span>
        {liked ? "Liked" : "Like this post"}
        {suffix}
      </button>
    </div>
  );
}
