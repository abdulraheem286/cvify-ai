import Link from "next/link";

// Slim footer for the logged-in app pages (dashboard, build chooser, customize) —
// a lightweight counterpart to the full marketing SiteFooter. `mt-auto` pins it
// to the bottom when the page content is short.
export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white print:hidden">
      <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-2 site-px py-5 text-sm text-zinc-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} CVify{" "}
          <span className="font-semibold text-zinc-700">AI</span>
        </p>
        <nav className="flex items-center gap-5">
          <Link href="/" className="transition-colors hover:text-blue-600">Home</Link>
          <Link href="/#templates" className="transition-colors hover:text-blue-600">Templates</Link>
          <Link href="/#faq" className="transition-colors hover:text-blue-600">FAQ</Link>
        </nav>
      </div>
    </footer>
  );
}
