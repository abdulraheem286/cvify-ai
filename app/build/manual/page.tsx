import type { Metadata } from "next";
import ManualClient from "./ManualClient";

// On-page SEO for the manual builder.
export const metadata: Metadata = {
  title: "Manual CV Builder — Create Your Resume Step by Step (Free)",
  description:
    "Build your CV manually with CVify AI. Fill in each section yourself for full control, pick a clean template, and download a professional PDF instantly — free, no sign-up required.",
  alternates: { canonical: "/build/manual" },
  openGraph: {
    title: "Manual CV Builder — Create Your Resume Step by Step",
    description:
      "Fill in every section yourself and download a polished, professional CV. Free, with instant PDF download.",
    url: "https://www.cvifyai.com/build/manual",
    type: "website",
  },
};

export default function Page() {
  return <ManualClient />;
}
