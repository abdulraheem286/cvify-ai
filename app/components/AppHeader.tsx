"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { IconChevron, IconText, IconUser } from "./icons";

// Slim header for the logged-in app (dashboard + builder) — distinct from the
// marketing SiteHeader. Logo → dashboard, plus a compact user menu.
export function AppHeader() {
  const { user, enabled, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur print:hidden">
      <div className="flex w-full items-center justify-between site-px py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900">
          CVify <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">AI</span>
        </Link>

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
              <span className="hidden max-w-[140px] truncate sm:inline">{user.displayName || user.email}</span>
              <IconChevron className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <>
                <button aria-hidden tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-30 cursor-default" />
                <div className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-xl">
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none">
                    <IconText className="h-4 w-4 text-zinc-400" /> Dashboard
                  </Link>
                  <Link href="/dashboard?tab=profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none">
                    <IconUser className="h-4 w-4 text-zinc-400" /> Profile
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setOpen(false);
                      await signOut();
                      router.push("/");
                    }}
                    className="block w-full border-t border-zinc-100 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-blue-600">
            ← Home
          </Link>
        )}
      </div>
    </header>
  );
}
