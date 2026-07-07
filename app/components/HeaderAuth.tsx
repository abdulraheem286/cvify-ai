"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { IconChevron } from "./icons";

export function HeaderAuth() {
  const { user, enabled, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {enabled && user ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{initial}</span>
            <span className="hidden max-w-[120px] truncate sm:inline">{user.displayName || user.email}</span>
            <IconChevron className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <>
              <button aria-hidden tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-30 cursor-default" />
              <div className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-xl">
                <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    setOpen(false);
                    await signOut();
                    router.push("/");
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      ) : enabled ? (
        <Link href="/login" className="text-sm font-semibold text-zinc-700 transition-colors hover:text-blue-600">
          Sign in
        </Link>
      ) : null}
      <Link
        href={enabled && user ? "/dashboard" : "/build"}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
      >
        {enabled && user ? "My CVs" : "Create my CV"}
      </Link>
    </div>
  );
}
