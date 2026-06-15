import type { Metadata } from "next";
import ImportClient from "./ImportClient";
import { RequireAuth } from "@/app/components/RequireAuth";

// On-page SEO for the import flow.
export const metadata: Metadata = {
  title: "Import Your CV — Upload or Paste an Existing Resume (Free)",
  description:
    "Already have a CV? Upload a PDF or paste the text and CVify AI reads it into the editor automatically. Then restyle, recolor, and download a fresh PDF — free, no sign-up required.",
  alternates: { canonical: "/build/import" },
  openGraph: {
    title: "Import Your CV — Upload or Paste an Existing Resume",
    description:
      "Upload a PDF or paste your old CV and CVify AI fills the editor automatically. Restyle and download in minutes.",
    url: "https://www.cvifyai.com/build/import",
    type: "website",
  },
};

export default function Page() {
  return (
    <RequireAuth>
      <ImportClient />
    </RequireAuth>
  );
}
