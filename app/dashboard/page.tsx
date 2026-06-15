"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AppHeader } from "@/app/components/AppHeader";
import { RequireAuth } from "@/app/components/RequireAuth";
import { useAuth } from "@/app/components/AuthProvider";
import { ScaledPreview } from "@/app/components/ScaledPreview";
import { TemplateView } from "@/app/templates/TemplateView";
import { ConfirmDialog, PromptDialog } from "@/app/components/Dialog";
import { listCvs, deleteCv, duplicateCv, renameCv, type CvRecord } from "@/app/lib/cvStore";
import type { EditorForm } from "@/app/components/CvEditor";
import type { CVResult } from "@/app/types";
import { IconPlus, IconTrash, IconText, IconTools, IconUser, IconHistory } from "@/app/components/icons";

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

// Light form → CVResult (clean, no placeholders) for the card thumbnails.
function cvFromData(form: EditorForm, hidden: Record<string, boolean>): CVResult {
  const list = (arr: string) => arr.split(",").map((s) => s.trim()).filter(Boolean);
  return {
    fullName: `${form.firstName} ${form.lastName}`.trim(),
    jobTitle: form.jobTitle,
    photo: form.photo || undefined,
    contact: {
      email: form.email,
      phone: form.phone,
      location: form.location,
      website: form.website,
      linkedin: form.linkedin || undefined,
    },
    summary: hidden.summary ? "" : form.summary,
    experience: hidden.experience
      ? []
      : form.experience
          .filter((x) => x.role || x.company || x.bullets)
          .map((x) => ({
            role: x.role,
            company: x.company,
            period: x.period,
            bullets: x.bullets.split("\n").map((b) => b.trim().replace(/^[-*]\s+/, "")).filter(Boolean),
          })),
    education: hidden.education ? [] : form.education.filter((x) => x.degree || x.institution),
    skills: hidden.skills ? [] : list(form.skills),
    languages: hidden.languages ? [] : form.languages.filter((l) => l.name.trim()),
    certificates: hidden.certificates ? [] : form.certificates.filter((c) => c.name.trim()),
    customSections: hidden.customSections
      ? []
      : form.customSections
          .map((s) => ({ heading: s.heading, items: s.items.filter((i) => i.title || i.description) }))
          .filter((s) => s.heading && s.items.length),
  };
}

type Tab = "cvs" | "templates" | "profile";

function Dashboard() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("cvs");
  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 text-zinc-900">
      <AppHeader />
      <div className="flex w-full flex-1 flex-col gap-8 px-6 py-8 lg:flex-row lg:px-8">
        {/* Sidebar */}
        <aside className="shrink-0 lg:w-64">
          <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
            <p className="px-3 pb-2 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Menu</p>
            <nav className="flex gap-1.5 overflow-x-auto lg:flex-col">
              <NavItem icon={<IconText className="h-[18px] w-[18px]" />} active={tab === "cvs"} onClick={() => setTab("cvs")}>
                My CVs
              </NavItem>
              <NavItem icon={<IconTools className="h-[18px] w-[18px]" />} active={tab === "templates"} onClick={() => setTab("templates")}>
                My Templates
              </NavItem>
              <NavItem icon={<IconUser className="h-[18px] w-[18px]" />} active={tab === "profile"} onClick={() => setTab("profile")}>
                Profile
              </NavItem>
            </nav>

            {/* Account — pinned to the bottom on desktop */}
            <div className="mt-auto hidden pt-6 lg:block">
              <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-800">{user?.displayName || "Account"}</p>
                  <p className="truncate text-xs text-zinc-500">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOut()}
                className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">
          {tab === "cvs" ? <CvsView /> : tab === "templates" ? <TemplatesView /> : <ProfileView />}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, active, onClick, children }: { icon: ReactNode; active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function CvsView() {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<CvRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<CvRecord | null>(null);
  const [deleting, setDeleting] = useState<CvRecord | null>(null);

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

  const list = cvs ?? [];
  const count = list.length;
  const templatesUsed = new Set(list.map((c) => c.data.template)).size;
  const mostRecent = list.length ? list.reduce((a, b) => (a.updatedAt > b.updatedAt ? a : b)) : null;
  const lastUpdated = mostRecent ? ago(mostRecent.updatedAt) : "—";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = (user?.displayName || "there").trim().split(" ")[0];

  return (
    <div>
      {/* Greeting banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-lg shadow-blue-600/20 sm:p-8">
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-32 h-52 w-52 rounded-full bg-indigo-300/20 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-100">Welcome back 👋</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{greeting}, {firstName}!</h1>
            <p className="mt-1 text-sm text-blue-100">Here&apos;s an overview of your CVs.</p>
          </div>
          <Link
            href="/build"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-blue-700 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <IconPlus className="h-4 w-4" /> New CV
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard tint="blue" icon={<IconText className="h-5 w-5" />} value={String(count)} label="Total CVs" sub="In your account" />
        <StatCard tint="emerald" icon={<IconTools className="h-5 w-5" />} value={String(templatesUsed)} label="Templates used" sub="Different layouts" />
        <StatCard tint="amber" icon={<IconHistory className="h-5 w-5" />} value={lastUpdated} label="Last updated" sub={mostRecent?.title} />
      </div>

      {error && <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mt-10 flex items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight">Your CVs</h2>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">{count}</span>
      </div>

      <div className="mt-5">{cvs === null ? (
        <div className="flex items-center justify-center py-24">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
        </div>
      ) : cvs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
            <IconPlus className="h-6 w-6" />
          </div>
          <p className="mt-4 font-semibold text-zinc-900">No CVs yet</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-zinc-600">Create your first CV — AI draft, manual, or import an existing one.</p>
          <Link href="/build" className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
            Create your first CV →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
          {cvs.map((cv) => (
            <div key={cv.id} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
              <Link href={`/build/manual?cv=${cv.id}`} className="block bg-zinc-100 p-3">
                <ScaledPreview maxHeight={230}>
                  <TemplateView id={cv.data.template} cv={cvFromData(cv.data.form, cv.data.hidden)} theme={cv.data.theme} domId={`dash-${cv.id}`} />
                </ScaledPreview>
              </Link>
              <div className="p-4">
                <Link href={`/build/manual?cv=${cv.id}`} className="block">
                  <p className="truncate font-semibold text-zinc-900">{cv.title}</p>
                  {cv.data.form.jobTitle && <p className="truncate text-sm text-blue-600">{cv.data.form.jobTitle}</p>}
                  <p className="mt-0.5 text-xs text-zinc-500">Updated {ago(cv.updatedAt)}</p>
                </Link>
                <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                  <Link href={`/build/manual?cv=${cv.id}`} className="font-semibold text-blue-600 hover:text-blue-700">
                    Open →
                  </Link>
                  <div className="flex items-center gap-2.5">
                    <button type="button" onClick={() => setRenaming(cv)} className="font-medium text-zinc-500 hover:text-zinc-800">Rename</button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!user) return;
                        await duplicateCv(user.uid, cv.id);
                        refresh();
                      }}
                      className="font-medium text-zinc-500 hover:text-zinc-800"
                    >
                      Duplicate
                    </button>
                    <button type="button" onClick={() => setDeleting(cv)} className="text-zinc-400 hover:text-red-600" title="Delete">
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}</div>

      <PromptDialog
        open={!!renaming}
        title="Rename CV"
        label="CV name"
        defaultValue={renaming?.title ?? ""}
        confirmLabel="Save"
        onConfirm={async (name) => {
          if (user && renaming) await renameCv(user.uid, renaming.id, name);
          setRenaming(null);
          refresh();
        }}
        onClose={() => setRenaming(null)}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Delete this CV?"
        message={`"${deleting?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        danger
        onConfirm={async () => {
          if (user && deleting) await deleteCv(user.uid, deleting.id);
          setDeleting(null);
          refresh();
        }}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

const STAT_TINTS: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

function StatCard({ tint, icon, value, label, sub }: { tint: keyof typeof STAT_TINTS; icon: ReactNode; value: string; label: string; sub?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${STAT_TINTS[tint]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="truncate text-2xl font-bold leading-tight text-zinc-900">{value}</p>
        <p className="truncate text-sm font-medium text-zinc-600">{label}</p>
        {sub && <p className="truncate text-xs text-zinc-400">{sub}</p>}
      </div>
    </div>
  );
}

function TemplatesView() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">My Templates</h1>
      <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20">
          <IconTools className="h-6 w-6" />
        </div>
        <p className="mt-4 font-semibold text-zinc-900">Coming soon</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-600">
          Save your favorite color/font combinations and create your own reusable templates.
        </p>
      </div>
    </div>
  );
}

function ProfileView() {
  const { user, updateName, signOut } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(user?.displayName || "");
  }, [user]);

  const created = user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "";

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            {(user?.displayName || user?.email || "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-zinc-900">{user?.displayName || "Your name"}</p>
            <p className="truncate text-sm text-zinc-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Display name</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
              className="w-full max-w-sm rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
            <input value={user?.email || ""} disabled className="w-full max-w-sm rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-500" />
          </div>
          {created && <p className="text-xs text-zinc-400">Member since {created}</p>}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={saving || name.trim() === (user?.displayName || "")}
              onClick={async () => {
                setSaving(true);
                try {
                  await updateName(name.trim());
                  setSaved(true);
                } finally {
                  setSaving(false);
                }
              }}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saved && <span className="text-sm text-emerald-600">Saved ✓</span>}
          </div>
        </div>
      </div>

      <button type="button" onClick={() => signOut()} className="mt-6 text-sm font-medium text-zinc-500 hover:text-red-600">
        Sign out
      </button>
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
