"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";
import { ScaledPreview } from "@/app/components/ScaledPreview";
import { ModernTemplate } from "@/app/templates/ModernTemplate";
import type { CVResult } from "@/app/types";

function authMessage(code: string): string {
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Wrong email or password.";
  if (code.includes("email-already-in-use")) return "An account with that email already exists. Try signing in.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("invalid-email")) return "That doesn't look like a valid email.";
  if (code.includes("popup-closed")) return "Sign-in was cancelled.";
  return "Something went wrong. Please try again.";
}

// Sample CV shown in the marketing panel.
const sampleCv: CVResult = {
  fullName: "Sarah Johnson",
  jobTitle: "Senior Product Designer",
  contact: { email: "sarah@example.com", phone: "+1 (555) 123-4567", location: "London, UK", website: "sarahjohnson.design" },
  summary:
    "Product designer with 6+ years crafting intuitive, user-centered digital experiences for fast-growing startups.",
  experience: [
    {
      role: "Senior Product Designer",
      company: "DesignCo",
      period: "2021 — Present",
      bullets: [
        "Led the redesign of the core product, lifting user activation by 32%.",
        "Built and maintained the design system used by 12 engineers.",
      ],
    },
    {
      role: "Product Designer",
      company: "StartupX",
      period: "2018 — 2021",
      bullets: ["Shipped 20+ features from research through high-fidelity design."],
    },
  ],
  education: [{ degree: "BA, Interaction Design", institution: "London College of Communication", period: "2014 — 2018" }],
  skills: ["Figma", "Prototyping", "Design Systems", "UX Research", "UI Design"],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
  ],
  certificates: [{ name: "Google UX Design Certificate", issuer: "Coursera", year: "2022" }],
};

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const { user, loading, enabled, signInGoogle, signInEmail, signUpEmail, resetPassword } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [resetSent, setResetSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [loading, user, next, router]);

  async function withBusy(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      router.replace(next);
    } catch (err) {
      const code = err instanceof Error ? err.message : String(err);
      setError(authMessage(code));
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode === "reset") {
      setBusy(true);
      setError(null);
      try {
        await resetPassword(email);
        setResetSent(true);
      } catch (err) {
        setError(authMessage(err instanceof Error ? err.message : String(err)));
      } finally {
        setBusy(false);
      }
      return;
    }
    withBusy(() => (mode === "signin" ? signInEmail(email, password) : signUpEmail(name, email, password)));
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-100 p-4 sm:p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl lg:grid-cols-2">
        {/* LEFT — form */}
        <div className="flex min-h-[620px] flex-col px-6 py-8 sm:px-12">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
            CVify <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">AI</span>
          </Link>

          <div className="my-auto w-full max-w-sm self-center py-10">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              {mode === "signin" ? "Welcome back" : mode === "signup" ? "Get started now" : "Reset your password"}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              {mode === "signin"
                ? "Sign in to access your CVs."
                : mode === "signup"
                  ? "Create an account to save and manage your CVs."
                  : "We'll email you a link to set a new password."}
            </p>

            {!enabled && (
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Accounts aren&apos;t switched on yet — check back shortly.
              </p>
            )}

            {mode === "reset" ? (
              resetSent ? (
                <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  Reset link sent to {email}. Check your inbox (and spam folder).
                </p>
              ) : (
                <form onSubmit={onSubmit} className="mt-6 space-y-3">
                  <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" autoComplete="email" />
                  <button
                    type="submit"
                    disabled={busy || !enabled}
                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
                  >
                    {busy ? "Sending…" : "Send reset link"}
                  </button>
                </form>
              )
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => withBusy(signInGoogle)}
                  disabled={busy || !enabled}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60"
                >
                  <GoogleIcon /> Continue with Google
                </button>

                <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
                  <span className="h-px flex-1 bg-zinc-200" /> or <span className="h-px flex-1 bg-zinc-200" />
                </div>

                <form onSubmit={onSubmit} className="space-y-3">
                  {mode === "signup" && (
                    <Field label="Name" value={name} onChange={setName} placeholder="Your name" autoComplete="name" />
                  )}
                  <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" autoComplete="email" />
                  <Field
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    type="password"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                  {mode === "signin" && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("reset");
                          setError(null);
                          setResetSent(false);
                        }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={busy || !enabled}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
                  >
                    {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                  </button>
                </form>
              </>
            )}

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <p className="mt-6 text-sm text-zinc-500">
              {mode === "reset" ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                  }}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  ← Back to sign in
                </button>
              ) : (
                <>
                  {mode === "signin" ? "New here? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin");
                      setError(null);
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {mode === "signin" ? "Create an account" : "Sign in"}
                  </button>
                </>
              )}
            </p>
          </div>

          <p className="text-xs text-zinc-400">© 2026 CVify AI. All rights reserved.</p>
        </div>

        {/* RIGHT — brand marketing panel */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 p-10 text-white lg:flex lg:flex-col xl:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold leading-tight">Build a CV that gets you hired</h2>
            <p className="mt-3 max-w-sm text-blue-100">
              Turn rough notes into a polished, professional CV in minutes — 18 templates, AI writing, and an instant
              PDF download.
            </p>
          </div>

          {/* CV preview peeking in */}
          <div className="relative z-10 mt-8 flex-1">
            <div className="absolute inset-x-2 top-2 origin-top rotate-2 drop-shadow-2xl">
              <ScaledPreview>
                <ModernTemplate cv={sampleCv} domId="login-preview" />
              </ScaledPreview>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-blue-100">
            <span className="inline-flex items-center gap-1.5">✓ Free forever</span>
            <span className="inline-flex items-center gap-1.5">✓ 18 templates</span>
            <span className="inline-flex items-center gap-1.5">✓ ATS-ready PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
