// Shared FAQ content — the single source of truth used by the homepage FAQ
// section, the dedicated /faq page, and the FAQPage JSON-LD structured data.
export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Is CVify AI free?",
    a: "Yes. You can create a CV, generate professional content with AI, edit it, and download a PDF without paying or entering a credit card.",
  },
  {
    q: "Can I edit the AI-generated content?",
    a: "Absolutely. The AI gives you a starting point, but every word is yours to change. Add anything you want, rewrite sections, or remove them — you have full control in the editor.",
  },
  {
    q: "Will my CV work with applicant tracking systems (ATS)?",
    a: "CVify AI uses clean, single-column formatting and standard section headings, which read clearly both in most applicant tracking systems and for human recruiters.",
  },
  {
    q: "How do I export my resume?",
    a: "One click. Download your finished CV as a standard PDF — the format employers and job boards expect — ready to send or upload anywhere.",
  },
  {
    q: "Do I need to create an account?",
    a: "Yes — a free account lets you save your CVs to your dashboard and pick up editing on any device. Signing in with Google takes a couple of seconds.",
  },
  {
    q: "Will I lose my work if I close the tab?",
    a: "No. The editor auto-saves your progress in your browser as you type. When you come back, CVify AI offers to restore your draft so you can continue right where you left off.",
  },
  {
    q: "Can I make more than one CV?",
    a: "Yes. Create as many CVs as you like and tailor each one to a specific job, industry, or template.",
  },
  {
    q: "Can I change the colors and fonts?",
    a: "Yes. A dedicated customization studio lets you set colors (including separate heading, body, and muted text), the background, fonts, text size, line spacing, and density — or pick a ready-made preset. You can save any look as your own reusable template, and every option works with any layout.",
  },
  {
    q: "Can I add my own sections like Projects or Awards?",
    a: "Yes. Add custom sections and name them anything — Projects, Awards, Volunteering, Publications — each with its own items. They render in your chosen template's style.",
  },
  {
    q: "Is the PDF readable by applicant tracking systems?",
    a: "Yes. CVify AI generates a real text-based PDF (not an image), so the text is selectable and searchable, and applicant tracking systems can parse it. Clean single-column structure and standard headings help too.",
  },
  {
    q: "What's the difference between a resume and a CV?",
    a: "In the US, a resume is a short one-to-two page summary tailored to a job, while a CV is longer and more detailed. Elsewhere the terms are often used interchangeably. CVify AI works for both — keep it concise for a resume, or add custom sections for a fuller CV.",
  },
  {
    q: "How long should my resume be?",
    a: "For most people, one page is ideal — two if you have many years of relevant experience. Focus on recent, relevant achievements and trim older or unrelated roles.",
  },
];
