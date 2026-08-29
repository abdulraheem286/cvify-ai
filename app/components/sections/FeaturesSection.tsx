import type { ReactNode } from "react";
import { SectionHead } from "../SectionHead";
import { Reveal } from "../Reveal";
import {
  IconSparkles,
  IconText,
  IconGlobe,
  IconTools,
  IconDownload,
  IconHistory,
} from "../icons";

const features: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <IconSparkles />, title: "AI that writes & improves", text: "Generate a summary, rewrite bullet points into achievements, and suggest skills — right inside the editor." },
  { icon: <IconGlobe />, title: "Distinct templates", text: "Genuinely different layouts across professional, minimal, and creative styles." },
  { icon: <IconTools />, title: "Full customization", text: "Set colors, fonts, text size, spacing, and density in a dedicated studio — or pick a one-click preset — and save your look as a reusable template." },
  { icon: <IconText />, title: "Custom sections", text: "Add your own sections — Projects, Awards, Volunteering, Publications — and reorder everything." },
  { icon: <IconDownload />, title: "ATS-ready text PDF", text: "Download a real, selectable text PDF that applicant tracking systems can actually read." },
  { icon: <IconHistory />, title: "Never lose your work", text: "The editor auto-saves as you type. Close the tab and come back — pick up right where you left off." },
];

// The Features section — shared by the homepage and the dedicated /features page.
// `showHead` is false on the dedicated page, where the page's own <h1> hero
// supplies the heading instead.
export function FeaturesSection({ showHead = true }: { showHead?: boolean }) {
  return (
    <section id="features" className="bg-zinc-50">
      <div className={`mx-auto max-w-[1920px] site-px pb-20 ${showHead ? "pt-20" : "pt-10"}`}>
        {showHead && (
          <SectionHead
            split
            eyebrow="Features"
            title="The Parts That Get Your CV Read"
            subtitle="Strong wording, a clean single-column structure, and an export both software and recruiters can actually read — CVify AI handles the hard parts."
          />
        )}
        <Reveal stagger className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3${showHead ? " mt-14" : ""}`}>
          {features.map((f) => (
            <Feature key={f.title} icon={f.icon} title={f.title} text={f.text} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="group rounded-2xl bg-white p-7 ring-1 ring-inset ring-zinc-200/80 transition-all hover:ring-blue-200">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mt-5 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
    </div>
  );
}
