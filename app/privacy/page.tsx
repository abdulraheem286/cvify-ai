import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageHero } from "../components/PageHero";
import { Block, Li } from "../components/LegalSections";

export const metadata: Metadata = {
  title: "Privacy Policy — CVify AI",
  description:
    "How CVify AI collects, uses, and protects your information — including accounts, cookies, advertising (Google AdSense), AI features, and your privacy rights.",
  alternates: { canonical: "/privacy" },
};

const CONTACT_EMAIL = "abdulrahim.majid5@gmail.com";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Privacy"
          title="Privacy Policy"
          subtitle="How we handle your information at CVify AI. Last updated July 2026."
        />

        <section className="mx-auto max-w-3xl site-px pb-20 pt-4">
          <div className="space-y-10 text-[15px] leading-relaxed text-zinc-600">
            <Block title="Who we are">
              <p>
                CVify AI (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is a free online tool that helps you write, design, and
                download a CV or resume. This policy explains what information we collect when you use{" "}
                <Link href="/" className="font-medium text-blue-600 hover:text-blue-700">cvifyai.com</Link>, why, and the
                choices you have. Questions? Email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-blue-600 hover:text-blue-700">us</a>.
              </p>
            </Block>

            <Block title="Information we collect">
              <ul className="space-y-2">
                <Li>
                  <strong className="font-semibold text-zinc-900">Account information.</strong> If you sign in (with
                  Google), we receive your name and email address so we can create your account and save your work.
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">Content you create.</strong> The details you enter into
                  your CV — and any CVs you save — are stored so you can come back and edit them.
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">Technical &amp; usage data.</strong> Like most
                  websites, we (and our providers) automatically receive basic data such as your IP address, browser and
                  device type, and the pages you view, to keep the site secure and working.
                </Li>
                <Li>
                  <strong className="font-semibold text-zinc-900">Cookies &amp; local storage.</strong> We use cookies
                  and your browser&rsquo;s local storage to keep you signed in, remember your draft, and understand how
                  the site is used (see &ldquo;Cookies and advertising&rdquo; below).
                </Li>
              </ul>
            </Block>

            <Block title="Cookies and advertising">
              <p>
                We use cookies and similar technologies to run the site, remember your preferences, and measure usage.
                We may also display advertising to support the free service:
              </p>
              <ul className="mt-3 space-y-2">
                <Li>
                  We use <strong className="font-semibold text-zinc-900">Google AdSense</strong> to serve ads. Third-party
                  vendors, including Google, use cookies to serve ads based on your prior visits to this and other
                  websites.
                </Li>
                <Li>
                  Google&rsquo;s use of advertising cookies enables it and its partners to serve ads to you based on your
                  visits to our site and/or other sites on the internet.
                </Li>
                <Li>
                  You can opt out of personalized advertising by visiting{" "}
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">Google Ads Settings</a>, or opt out of some third-party vendors&rsquo; cookies at{" "}
                  <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">aboutads.info</a>.
                </Li>
                <Li>Most browsers also let you block or delete cookies in their settings.</Li>
              </ul>
            </Block>

            <Block title="How we use your information">
              <ul className="space-y-2">
                <Li>To provide the service — building, saving, and exporting your CVs.</Li>
                <Li>To power the AI writing features you choose to use.</Li>
                <Li>To keep the site secure, prevent abuse, and fix problems.</Li>
                <Li>To understand how the site is used so we can improve it, and to display advertising.</Li>
              </ul>
            </Block>

            <Block title="AI features">
              <p>
                When you use the AI writing tools, the details you provide are sent to our third-party AI provider to
                generate suggestions. We only send what&rsquo;s needed to produce the result, and the output is a
                starting point for you to review and edit.
              </p>
            </Block>

            <Block title="Services we rely on">
              <p>We use trusted providers to run CVify AI. Your data may be processed by:</p>
              <ul className="mt-3 space-y-2">
                <Li><strong className="font-semibold text-zinc-900">Google Firebase</strong> — sign-in and secure storage of your account and CVs.</Li>
                <Li><strong className="font-semibold text-zinc-900">Our hosting provider</strong> — to serve the website.</Li>
                <Li><strong className="font-semibold text-zinc-900">Our AI provider</strong> — to generate AI writing suggestions.</Li>
                <Li><strong className="font-semibold text-zinc-900">Google AdSense</strong> — to display advertising.</Li>
              </ul>
            </Block>

            <Block title="Sharing your information">
              <p>
                <strong className="font-semibold text-zinc-900">We do not sell your personal information.</strong> We
                share data only with the providers above so they can perform their service for us, or where required by
                law.
              </p>
            </Block>

            <Block title="Data retention">
              <p>
                We keep your account and CVs for as long as your account is active. You can ask us to delete your account
                and associated data at any time — just email us.
              </p>
            </Block>

            <Block title="Your rights">
              <p>
                Depending on where you live, you may have the right to access, correct, or delete the personal
                information we hold about you, and to object to certain processing. To exercise any of these rights,
                email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-blue-600 hover:text-blue-700">{CONTACT_EMAIL}</a>{" "}
                and we&rsquo;ll help.
              </p>
            </Block>

            <Block title="Security">
              <p>
                We use reputable providers and reasonable technical measures to protect your data. No method of storage
                or transmission is 100% secure, but we work to keep your information safe.
              </p>
            </Block>

            <Block title="Children">
              <p>
                CVify AI is intended for job seekers and is not directed to children under 16. We do not knowingly
                collect personal information from children.
              </p>
            </Block>

            <Block title="Changes to this policy">
              <p>
                We may update this policy from time to time. When we do, we&rsquo;ll change the &ldquo;last updated&rdquo;
                date at the top of this page.
              </p>
            </Block>

            <Block title="Contact">
              <p>
                Questions about your privacy or this policy?{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-blue-600 hover:text-blue-700">Email us</a>.
                See also our{" "}
                <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-700">Terms of Service</Link>{" "}
                and{" "}
                <Link href="/legal" className="font-medium text-blue-600 hover:text-blue-700">credits</Link>.
              </p>
            </Block>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
