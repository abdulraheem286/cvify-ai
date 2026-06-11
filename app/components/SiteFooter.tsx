import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-zinc-500 sm:flex-row">
        <div>
          <span className="font-bold text-zinc-800">
            CVify <span className="text-blue-600">AI</span>
          </span>{" "}
          — Free AI resume &amp; CV builder.
        </div>
        <nav className="flex gap-6">
          <a href="/#features" className="transition-colors hover:text-zinc-800">Features</a>
          <a href="/#faq" className="transition-colors hover:text-zinc-800">FAQ</a>
          <Link href="/build" className="transition-colors hover:text-zinc-800">Build a CV</Link>
        </nav>
        <div>© 2026 CVify AI</div>
      </div>
    </footer>
  );
}
