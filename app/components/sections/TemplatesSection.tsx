import Link from "next/link";
import type { CVResult } from "../../types";
import { SectionHead } from "../SectionHead";
import { TemplateShowcase } from "../TemplateShowcase";

// The Templates showcase section — shared by the homepage and the /templates page.
// `showHead` is false on the dedicated page, where the page's own <h1> hero
// supplies the heading instead.
export function TemplatesSection({ cv, showHead = true }: { cv: CVResult; showHead?: boolean }) {
  return (
    <section id="templates" className="border-y border-zinc-200 bg-gradient-to-b from-white to-zinc-50">
      <div className="mx-auto max-w-[1920px] site-px py-20">
        {showHead && (
          <SectionHead
            eyebrow="Templates"
            title="18 templates across professional, minimal & creative"
            subtitle="Switch styles anytime without losing your content, then recolor and change fonts to make it yours."
          />
        )}
        <TemplateShowcase cv={cv} />
        <div className="mt-12 text-center">
          <Link href="/build" className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700">
            Start with a template →
          </Link>
        </div>
      </div>
    </section>
  );
}
