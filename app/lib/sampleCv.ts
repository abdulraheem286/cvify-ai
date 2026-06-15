import type { CVResult } from "@/app/types";

// Shared sample CV used in all template previews (gallery, homepage showcase,
// login panel). Intentionally content-rich so every layout — including the
// dense two-column ones — renders tall enough to fill the preview cards.
export const SAMPLE_CV: CVResult = {
  fullName: "Sarah Johnson",
  jobTitle: "Senior Product Designer",
  contact: {
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    location: "London, UK",
    website: "sarahjohnson.design",
    linkedin: "linkedin.com/in/sarahjohnson",
  },
  summary:
    "Product designer with 6+ years crafting intuitive, user-centered digital experiences for fast-growing startups. I lead design-systems work, partner closely with engineering, and ship measurable improvements end to end.",
  experience: [
    {
      role: "Senior Product Designer",
      company: "DesignCo",
      period: "2021 — Present",
      bullets: [
        "Led the redesign of the core product, lifting user activation by 32%.",
        "Built and maintained the company design system used by 12 engineers.",
        "Mentored 3 junior designers and ran weekly design critiques.",
      ],
    },
    {
      role: "Product Designer",
      company: "StartupX",
      period: "2018 — 2021",
      bullets: [
        "Shipped 20+ features from research through high-fidelity design.",
        "Ran usability tests that cut support tickets by 25%.",
        "Owned the mobile app redesign from concept to launch.",
      ],
    },
    {
      role: "UX Designer",
      company: "Agency One",
      period: "2016 — 2018",
      bullets: [
        "Delivered web and product design for 15+ client brands.",
        "Created wireframes, prototypes, and design specs for handoff.",
      ],
    },
  ],
  education: [
    { degree: "BA, Interaction Design", institution: "London College of Communication", period: "2014 — 2018" },
    { degree: "Foundation, Art & Design", institution: "Central Saint Martins", period: "2013 — 2014" },
  ],
  skills: [
    "Figma",
    "Prototyping",
    "Design Systems",
    "UX Research",
    "UI Design",
    "Wireframing",
    "Usability Testing",
    "Accessibility",
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
  ],
  certificates: [
    { name: "Google UX Design Certificate", issuer: "Coursera", year: "2022" },
    { name: "Nielsen Norman UX Certification", issuer: "NN/g", year: "2021" },
  ],
  customSections: [
    {
      heading: "Projects",
      items: [
        {
          title: "Design System Overhaul",
          subtitle: "DesignCo",
          period: "2022",
          description: "Unified 4 product surfaces into one token-based system, cutting design debt and speeding delivery.",
        },
      ],
    },
  ],
};
