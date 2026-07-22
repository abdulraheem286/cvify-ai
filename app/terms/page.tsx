import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { Block, Li } from "../components/LegalSections";

export const metadata: Metadata = {
  title: "Terms of Service — CVify AI",
  description:
    "The terms for using CVify AI, the free AI resume and CV builder — your content and rights, acceptable use, disclaimers, and limitations.",
  alternates: { canonical: "/terms" },
};

const CONTACT_EMAIL = "abdulrahim.majid5@gmail.com";

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Terms"
          title="Terms of Service"
          subtitle="The agreement for using CVify AI. Last updated July 2026."
        />

        <section className="mx-auto max-w-3xl site-px pb-20 pt-10">
          <div className="space-y-10 text-[15px] leading-relaxed text-zinc-600">
            <Block title="Acceptance">
              <p>
                By using CVify AI (&ldquo;the service&rdquo;) at{" "}
                <Link href="/" className="font-medium text-blue-600 hover:text-blue-700">cvifyai.com</Link>, you agree to
                these terms. If you don&rsquo;t agree, please don&rsquo;t use the service.
              </p>
            </Block>

            <Block title="The service">
              <p>
                CVify AI is a free tool that helps you write, design, and download a CV or resume, including optional
                AI-assisted writing. We may change, add, or remove features over time.
              </p>
            </Block>

            <Block title="Your account">
              <p>
                Some features require an account (via Google sign-in). You&rsquo;re responsible for the activity under
                your account and for keeping your sign-in secure.
              </p>
            </Block>

            <Block title="Your content">
              <ul className="space-y-2">
                <Li>
                  <strong className="font-semibold text-zinc-900">You own your content.</strong> Everything you write and
                  export stays yours. We don&rsquo;t claim ownership of your CV.
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">You give us permission to run the service.</strong> You
                  grant us a limited licence to store and process your content only as needed to provide CVify AI to you
                  (for example, saving your CV and generating AI suggestions).
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">You&rsquo;re responsible for it.</strong> You confirm
                  the information you enter is accurate and that you have the right to use it.
                </Li>
              </ul>
            </Block>

            <Block title="Acceptable use">
              <p>Please don&rsquo;t use CVify AI to:</p>
              <ul className="mt-3 space-y-2">
                <Li>break the law or infringe anyone&rsquo;s rights;</Li>
                <Li>upload content you don&rsquo;t have the right to use, or anyone else&rsquo;s personal data without permission;</Li>
                <Li>abuse, overload, scrape, or attempt to disrupt the service or its AI features.</Li>
              </ul>
            </Block>

            <Block title="AI-generated suggestions">
              <p>
                The AI features produce suggestions to help you write faster. They&rsquo;re a starting point, not
                verified fact — please review and edit everything before you use it. You&rsquo;re responsible for the
                final content of your CV.
              </p>
            </Block>

            <Block title="No employment guarantee">
              <p>
                CVify AI helps you present your experience clearly, but we cannot and do not guarantee interviews, job
                offers, or any specific outcome. Hiring decisions rest with employers.
              </p>
            </Block>

            <Block title="Our intellectual property">
              <p>
                The CVify AI name, website, templates, designs, and software are ours (or our licensors&rsquo;) and are
                protected by law. You may use them to create your own CV, but not copy, resell, or redistribute them.
              </p>
            </Block>

            <Block title="Disclaimers">
              <p>
                The service is provided <strong className="font-semibold text-zinc-900">&ldquo;as is&rdquo;</strong> and
                <strong className="font-semibold text-zinc-900"> &ldquo;as available,&rdquo;</strong> without warranties
                of any kind. We don&rsquo;t promise the service will always be available, error-free, or fit for a
                particular purpose.
              </p>
            </Block>

            <Block title="Limitation of liability">
              <p>
                To the fullest extent allowed by law, CVify AI is not liable for any indirect, incidental, or
                consequential losses arising from your use of the service. Since the service is free, our total liability
                to you is limited accordingly.
              </p>
            </Block>

            <Block title="Termination">
              <p>
                You can stop using CVify AI at any time. We may suspend or end access if these terms are misused. You can
                ask us to delete your account and data whenever you like.
              </p>
            </Block>

            <Block title="Changes to these terms">
              <p>
                We may update these terms from time to time. When we do, we&rsquo;ll update the &ldquo;last updated&rdquo;
                date above. Continuing to use the service means you accept the updated terms.
              </p>
            </Block>

            <Block title="Contact">
              <p>
                Questions about these terms?{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-blue-600 hover:text-blue-700">Email us</a>.
                See also our{" "}
                <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-700">Privacy Policy</Link>.
              </p>
            </Block>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
