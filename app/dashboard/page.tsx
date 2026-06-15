"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { RequireAuth } from "@/app/components/RequireAuth";
import { useAuth } from "@/app/components/AuthProvider";
import { listCvs, deleteCv, duplicateCv, renameCv, type CvMeta } from "@/app/lib/cvStore";
import { IconPlus, IconTrash } from "@/app/components/icons";

function ago(ts: number): string {
  if (!ts) return "";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

function Dashboard() {
  const { user, signOut } = useAuth();
  const [cvs, setCvs] = useState<CvMeta[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    if (!user) return;
    try {
      setCvs(await listCvs(user.uid));
    } catch {
      setError("Couldn't load your CVs. Please refresh.");
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function onRename(id: string, current: string) {
    const title = window.prompt("Rename CV", current);
    if (!title || !user) return;
    await renameCv(user.uid, id, title.trim());
    refresh();
  }
  async function onDuplicate(id: string) {
    if (!user) return;
    await duplicateCv(user.uid, id);
    refresh();
  }
  async function onDelete(id: string, title: string) {
    if (!user || !window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    await deleteCv(user.uid, id);
    refresh();
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1920px] flex-1 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your CVs</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Signed in as {user?.displayName || user?.email}.{" "}
              <button type="button" onClick={() => signOut()} className="font-medium text-blue-600 hover:text-blue-700">
                Sign out
              </button>
            </p>
          </div>
          <Link
            href="/build"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <IconPlus className="h-4 w-4" /> New CV
          </Link>
        </div>

        {error && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {cvs === null ? (
          <div className="flex items-center justify-center py-24">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
          </div>
        ) : cvs.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
            <p className="text-zinc-600">You haven&apos;t saved any CVs yet.</p>
            <Link href="/build" className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">
              Create your first CV →
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cvs.map((cv) => (
              <div key={cv.id} className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <Link href={`/build/manual?cv=${cv.id}`} className="flex-1">
                  <p className="font-semibold text-zinc-900">{cv.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">Updated {ago(cv.updatedAt)}</p>
                </Link>
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                  <Link href={`/build/manual?cv=${cv.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Open →
                  </Link>
                  <div className="flex items-center gap-2 text-xs">
                    <button type="button" onClick={() => onRename(cv.id, cv.title)} className="font-medium text-zinc-500 hover:text-zinc-800">Rename</button>
                    <button type="button" onClick={() => onDuplicate(cv.id)} className="font-medium text-zinc-500 hover:text-zinc-800">Duplicate</button>
                    <button type="button" onClick={() => onDelete(cv.id, cv.title)} className="text-zinc-400 hover:text-red-600" title="Delete">
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}
