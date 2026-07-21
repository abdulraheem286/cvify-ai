import Link from "next/link";
import { HeaderAuth } from "./HeaderAuth";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between site-px py-4">
        <div className="flex items-center gap-1.5">
          <MobileNav />
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
            CVify <span className="text-blue-600">AI</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 sm:flex">
          <Link href="/features" className="transition-colors hover:text-zinc-900">Features</Link>
          <Link href="/templates" className="transition-colors hover:text-zinc-900">Templates</Link>
          <Link href="/faq" className="transition-colors hover:text-zinc-900">FAQ</Link>
        </nav>
        <HeaderAuth />
      </div>
    </header>
  );
}
