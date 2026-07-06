import type { Metadata } from "next";
import WizardClient from "./WizardClient";
import { RequireAuth } from "@/app/components/RequireAuth";

// On-page SEO for the guided builder.
export const metadata: Metadata = {
  title: "Guided CV Builder — Make a CV Step by Step (Free)",
  description:
    "New to CVs? The free CVify AI guided builder walks you through it one step at a time — the basics, experience, education, skills and a summary — then pick a template and download a clean PDF.",
  alternates: { canonical: "/build/wizard" },
  openGraph: {
    title: "Guided CV Builder — Make a CV Step by Step",
    description: "A friendly, step-by-step way to build your CV. Free, with an instant PDF download.",
    url: "https://www.cvifyai.com/build/wizard",
    type: "website",
  },
};

export default function Page() {
  return (
    <RequireAuth>
      <WizardClient />
    </RequireAuth>
  );
}
