import type { ReactNode } from "react";

// Shared section + bullet used by the Privacy, Terms, and Legal pages.
export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-zinc-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function Li({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden />
      <span>{children}</span>
    </li>
  );
}
