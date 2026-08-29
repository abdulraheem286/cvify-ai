import { SectionHead } from "../SectionHead";
import { FaqList } from "./FaqList";

// The FAQ section — shared by the homepage and the dedicated /faq page.
// `showHead` is false on the dedicated page, where the page's own <h1> hero
// supplies the heading instead. `columns` is 2 on the /faq page (a wider,
// two-column grid) and stays 1 on the homepage.
export function FaqSection({ showHead = true, columns = 1 }: { showHead?: boolean; columns?: 1 | 2 }) {
  return (
    <section id="faq" className="site-px py-3">
      <div className={`mx-auto rounded-3xl px-6 py-16 ring-1 ring-inset sm:px-10 sm:py-20 bg-zinc-50/80 ring-zinc-200/70 ${columns === 2 ? "max-w-6xl" : "max-w-3xl"}`}>
        {showHead && (
          <SectionHead eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Answers to questions about building, optimizing, and exporting your resume." />
        )}
        <FaqList columns={columns} topGap={showHead} />
      </div>
    </section>
  );
}
