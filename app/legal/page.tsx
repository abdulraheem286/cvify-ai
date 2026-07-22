import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Legal & Credits — CVify AI",
  description:
    "Plain-language terms of use, privacy summary, image credits, and disclaimers for CVify AI — the free AI resume and CV builder.",
  alternates: { canonical: "/legal" },
};

const CONTACT_EMAIL = "hello@cvifyai.com";

export default function LegalPage() {
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Legal"
          title="Legal & credits"
          subtitle="Plain-language terms, privacy, and credits for CVify AI. Last updated July 2026."
        />

        <section className="mx-auto max-w-3xl site-px pb-20 pt-4">
          <div className="space-y-10 text-[15px] leading-relaxed text-zinc-600">
            <Block title="Image & photography credits">
              <p>
                Photographs used across CVify AI — including on the{" "}
                <Link href="/blog" className="font-medium text-blue-600 hover:text-blue-700">
                  blog
                </Link>{" "}
                — are sourced from{" "}
                <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                  Freepik
                </a>
                . We&rsquo;re grateful to the photographers and creators whose work helps illustrate our guides. The CV
                templates, layout, and interface are our own.
              </p>
            </Block>

            <Block title="Using CVify AI">
              <p>CVify AI is a free tool that helps you write, design, and download a CV or resume.</p>
              <ul className="mt-3 space-y-2">
                <Li>
                  <strong className="font-semibold text-zinc-900">Your content is yours.</strong> You keep full
                  ownership of everything you write and export. We don&rsquo;t claim any rights to your CV.
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">Provided &ldquo;as is.&rdquo;</strong> We work hard to
                  keep the service running and useful, but we can&rsquo;t guarantee it will always be available,
                  error-free, or fit for a specific purpose.
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">Fair use.</strong> Please use CVify AI for lawful,
                  genuine purposes. Don&rsquo;t upload content you don&rsquo;t have the right to use, and don&rsquo;t
                  abuse the AI features.
                </Li>
              </ul>
            </Block>

            <Block title="Your privacy">
              <ul className="space-y-2">
                <Li>
                  <strong className="font-semibold text-zinc-900">Accounts.</strong> Signing in with Google stores your
                  email so we can save your CVs to your account and let you edit them on any device.
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">Your CVs.</strong> They&rsquo;re saved to your account
                  so you can come back to them. Your working draft also auto-saves in your own browser as you type.
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">AI features.</strong> When you use the AI writing
                  tools, the details you provide are sent to our AI provider to generate suggestions — only what&rsquo;s
                  needed to produce the result.
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">We don&rsquo;t sell your data.</strong> We use it to
                  run the product — accounts, saving, and the AI features — and nothing more.
                </Li>
              </ul>
            </Block>

            <Block title="No employment guarantee">
              <p>
                CVify AI helps you present your experience clearly and professionally, but it cannot and does not
                guarantee interviews, job offers, or any specific outcome. Hiring decisions always rest with employers.
              </p>
            </Block>

            <Block title="Blog comments">
              <p>
                Comments on the blog are public and can be posted anonymously. Please keep them respectful and on-topic.
                We may remove comments that are spam, abusive, or otherwise inappropriate.
              </p>
            </Block>

            <Block title="Contact">
              <p>
                Questions about these terms, your data, or the credits above? Email us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-blue-600 hover:text-blue-700">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </Block>

            <p className="border-t border-zinc-200 pt-6 text-sm text-zinc-400">
              This page is a plain-language summary intended to be clear and honest, not exhaustive legal advice. For a
              specific legal question, please consult a qualified professional.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-zinc-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Li({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden />
      <span>{children}</span>
    </li>
  );
}
