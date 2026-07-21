import { SectionHead } from "../SectionHead";
import { faqs, type Faq } from "../../lib/faqs";

// The FAQ section — shared by the homepage and the dedicated /faq page.
// `showHead` is false on the dedicated page, where the page's own <h1> hero
// supplies the heading instead. `columns` is 2 on the /faq page (a wider,
// two-column grid) and stays 1 on the homepage.
export function FaqSection({ showHead = true, columns = 1 }: { showHead?: boolean; columns?: 1 | 2 }) {
  const two = columns === 2;
  const topGap = showHead ? " mt-12" : "";
  return (
    <section id="faq" className="border-t border-zinc-200 bg-white">
      <div className={`mx-auto site-px py-20 ${two ? "max-w-6xl" : "max-w-3xl"}`}>
        {showHead && (
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" subtitle="Answers to questions about building, optimizing, and exporting your resume." />
        )}
        {two ? (
          <div className={`grid items-start gap-4 sm:grid-cols-2${topGap}`}>
            {faqs.map((f) => (
              <FaqItem key={f.q} faq={f} className="rounded-xl border border-zinc-200 p-5" />
            ))}
          </div>
        ) : (
          <div className={`divide-y divide-zinc-200 border-y border-zinc-200${topGap}`}>
            {faqs.map((f) => (
              <FaqItem key={f.q} faq={f} className="py-5" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FaqItem({ faq, className }: { faq: Faq; className: string }) {
  return (
    <details className={`group ${className}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-zinc-900">
        {faq.q}
        <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{faq.a}</p>
    </details>
  );
}
