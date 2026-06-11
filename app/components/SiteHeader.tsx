import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
          CVify <span className="text-blue-600">AI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 sm:flex">
          <a href="/#features" className="transition-colors hover:text-zinc-900">Features</a>
          <a href="/#templates" className="transition-colors hover:text-zinc-900">Templates</a>
          <a href="/#how" className="transition-colors hover:text-zinc-900">How it works</a>
          <a href="/#faq" className="transition-colors hover:text-zinc-900">FAQ</a>
        </nav>
        <Link
          href="/build"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Create my CV
        </Link>
      </div>
    </header>
  );
}
