import type { ReactNode } from "react";
import { HeroDecor } from "./HeroShell";

// Content sections share the hero's shape — an inset rounded card with a ring —
// so the page reads as one system. `tone` picks how much brand colour it carries.
export function SectionShell({
  id,
  children,
  tone = "plain",
  className = "",
}: {
  id?: string;
  children: ReactNode;
  tone?: "plain" | "tint" | "decor";
  className?: string;
}) {
  const skin =
    tone === "decor"
      ? "bg-gradient-to-b from-blue-50 via-indigo-50/40 to-white ring-blue-100"
      : tone === "tint"
        ? "bg-gradient-to-b from-blue-50/60 to-white ring-blue-100"
        : "bg-zinc-50/80 ring-zinc-200/70";

  return (
    <section id={id} className="site-px py-3">
      <div className={`relative isolate overflow-hidden rounded-3xl px-6 py-16 ring-1 ring-inset sm:px-10 sm:py-20 ${skin} ${className}`}>
        {tone === "decor" && <HeroDecor subtle />}
        <div className="relative z-10 mx-auto max-w-[1500px]">{children}</div>
      </div>
    </section>
  );
}
