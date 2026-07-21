import type { PostFaq } from "../../lib/blog";

// Renders a post's FAQ (from frontmatter) as plain, crawlable Q&A — optimized
// for answer engines (featured snippets, AI overviews). The matching FAQPage
// JSON-LD is emitted separately on the post page.
export function PostFaqSection({ faqs }: { faqs: PostFaq[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="mt-12 border-t border-zinc-200 pt-8">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Frequently asked questions</h2>
      <div className="mt-6 space-y-6">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold text-zinc-900">{f.q}</h3>
            <p className="mt-2 leading-relaxed text-zinc-600">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
