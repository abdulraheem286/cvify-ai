import { SectionHead } from "../SectionHead";
import { faqs } from "../../lib/faqs";

// The FAQ section — shared by the homepage and the dedicated /faq page.
// `showHead` is false on the dedicated page, where the page's own <h1> hero
// supplies the heading instead.
export function FaqSection({ showHead = true }: { showHead?: boolean }) {
  return (
    <section id="faq" className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-3xl site-px py-20">
        {showHead && (
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" subtitle="Answers to questions about building, optimizing, and exporting your resume." />
        )}
        <div className={`divide-y divide-zinc-200 border-y border-zinc-200${showHead ? " mt-12" : ""}`}>
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-zinc-900">
                {f.q}
                <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
