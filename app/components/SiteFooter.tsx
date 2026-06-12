import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-gradient-to-b from-zinc-50 to-zinc-100/50">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900">
              CVify <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">AI</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-zinc-500">
              Free AI resume &amp; CV builder. Build a professional CV in minutes and download a
              clean PDF.
            </p>
            <div className="mt-4 flex gap-2">
              <Social label="X" path="M18 2h3l-7 8 8 10h-6l-5-6-5 6H3l8-9L3 2h6l4 5Z" />
              <Social label="LinkedIn" path="M6 9v9M6 5v.01M10 18v-5a2 2 0 0 1 4 0v5M10 18v-9" />
              <Social label="Instagram" path="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm4.5-1.5v.01" />
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              ["AI builder", "/build/ai"],
              ["Manual builder", "/build/manual"],
              ["Import CV", "/build/import"],
              ["Templates", "/#templates"],
            ]}
          />
          <FooterCol
            title="Learn"
            links={[
              ["Features", "/#features"],
              ["How it works", "/#how"],
              ["FAQ", "/#faq"],
            ]}
          />
          <FooterCol title="Get started" links={[["Create my CV", "/build"]]} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-500 sm:flex-row">
          <p>© 2026 CVify AI. All rights reserved.</p>
          <p>Free to use · No sign-up required to start</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-zinc-500 transition-colors hover:text-blue-600">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Social({ label, path }: { label: string; path: string }) {
  return (
    <span
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-sm"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </span>
  );
}
