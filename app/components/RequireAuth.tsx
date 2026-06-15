"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

// Gates a page behind sign-in. If Firebase isn't configured yet, it stays open
// (so the live site is never locked before accounts go live).
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, enabled } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (enabled && !loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [enabled, loading, user, pathname, router]);

  if (!enabled) return <>{children}</>;
  if (loading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center py-32">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
      </div>
    );
  }
  return <>{children}</>;
}
