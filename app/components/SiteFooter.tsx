import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-zinc-50">
      <div className="h-1 w-full bg-blue-600" />
      <div className="mx-auto max-w-[1920px] site-px py-14">
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
              <Social label="LinkedIn" href="https://www.linkedin.com/company/cvifyai" path="M6 9v9M6 5v.01M10 18v-5a2 2 0 0 1 4 0v5M10 18v-9" />
              <Social label="Instagram" href="https://instagram.com/cvify_ai" path="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm4.5-1.5v.01" />
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              ["AI builder", "/build/ai"],
              ["Guided wizard", "/build/wizard"],
              ["Manual builder", "/build/manual"],
              ["Import CV", "/build/import"],
              ["Templates", "/templates"],
            ]}
          />
          <FooterCol
            title="Learn"
            links={[
              ["Features", "/features"],
              ["Blogs", "/blog"],
              ["About", "/about"],
              ["FAQ", "/faq"],
            ]}
          />
          <FooterCol title="Get started" links={[["Create my CV", "/build"]]} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} CVify AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-blue-600">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-blue-600">Terms</Link>
            <Link href="/legal" className="transition-colors hover:text-blue-600">Legal &amp; credits</Link>
          </div>
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

function Social({ label, href, path }: { label: string; href: string; path: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-sm"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </a>
  );
}
