import type { Metadata } from "next";
import BuildClient from "./BuildClient";

// On-page SEO for the AI builder.
export const metadata: Metadata = {
  title: "AI CV Builder — Create Your Resume in Minutes (Free)",
  description:
    "Turn rough notes into a polished, professional CV with the free CVify AI builder. AI writes the wording and formats everything, then download a clean PDF — no sign-up required.",
  alternates: { canonical: "/build/ai" },
  openGraph: {
    title: "AI CV Builder — Create Your Resume in Minutes",
    description:
      "Turn rough notes into a polished, professional CV with AI. Free, with instant PDF download.",
    url: "https://www.cvifyai.com/build/ai",
    type: "website",
  },
};

export default function Page() {
  return <BuildClient />;
}
