import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  BorderStyle,
  type ISectionOptions,
} from "docx";
import type { CVResult } from "@/app/types";

// Only the accent colours are used from the theme; the .docx is a clean,
// single-column, ATS-friendly layout (not a pixel copy of the visual template).
type ThemeLike = { primary?: string; secondary?: string };

// Same lightweight markdown the templates use: **bold**, *italic*, [text](url).
const TOKEN = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)\s]+)\))/g;

// docx wants a 6-hex string with no leading '#'.
function hex(c: string | undefined, fallback: string): string {
  if (!c) return fallback;
  const h = c.replace("#", "").trim();
  return /^[0-9a-fA-F]{6}$/.test(h) ? h.toUpperCase() : fallback;
}

// Parse inline markdown into docx runs (bold / italic / real hyperlinks).
function mdRuns(
  text: string,
  base: { size?: number; color?: string; bold?: boolean } = {},
): (TextRun | ExternalHyperlink)[] {
  const out: (TextRun | ExternalHyperlink)[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  const push = (t: string, extra: { bold?: boolean; italics?: boolean } = {}) => {
    if (t) out.push(new TextRun({ text: t, size: base.size, color: base.color, bold: base.bold, ...extra }));
  };
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) push(text.slice(last, m.index));
    if (m[1]) push(m[2], { bold: true });
    else if (m[3]) push(m[4], { italics: true });
    else if (m[5]) {
      const href = /^https?:\/\//.test(m[7]) ? m[7] : `https://${m[7]}`;
      out.push(
        new ExternalHyperlink({
          link: href,
          children: [new TextRun({ text: m[6], size: base.size, color: "2563EB", underline: {} })],
        }),
      );
    }
    last = TOKEN.lastIndex;
  }
  if (last < text.length) push(text.slice(last));
  return out.length ? out : [new TextRun({ text: "", size: base.size })];
}

// A block of text that may contain \n and "- " bullet lines (summary, descriptions).
function richBlock(text: string): Paragraph[] {
  return text.split("\n").map((line) => {
    const isBullet = /^\s*[-*]\s+/.test(line);
    const content = line.replace(/^\s*[-*]\s+/, "");
    return new Paragraph({
      spacing: { after: 40 },
      bullet: isBullet ? { level: 0 } : undefined,
      children: mdRuns(content, { size: 20 }),
    });
  });
}

// Sizes are half-points (e.g. 22 = 11pt). Twips for spacing (20 = 1pt).
export async function buildCvDocx(cv: CVResult, theme?: ThemeLike): Promise<Buffer> {
  const primary = hex(theme?.primary, "2563EB");
  const secondary = hex(theme?.secondary, "0F172A");
  const gray = "555555";

  const children: Paragraph[] = [];

  const heading = (title: string) =>
    new Paragraph({
      spacing: { before: 260, after: 100 },
      border: { bottom: { color: primary, style: BorderStyle.SINGLE, size: 6, space: 2 } },
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, color: primary, characterSpacing: 20 })],
    });

  // Title line: bold lead + optional muted trailer (e.g. "Role  ·  Company").
  const titleLine = (lead: string, trailer?: string, period?: string) => {
    const runs: TextRun[] = [new TextRun({ text: lead, bold: true, size: 22, color: secondary })];
    if (trailer) runs.push(new TextRun({ text: `  ·  ${trailer}`, size: 22, color: gray }));
    return new Paragraph({ spacing: { before: 100, after: period ? 0 : 40 }, children: runs });
  };
  const periodLine = (period?: string) =>
    period
      ? [new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: period, italics: true, size: 18, color: gray })] })]
      : [];

  // ---- Header ----
  children.push(
    new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: cv.fullName || "Your Name", bold: true, size: 46, color: secondary })] }),
  );
  if (cv.jobTitle) {
    children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: cv.jobTitle, size: 26, color: primary })] }));
  }
  const contactBits = [cv.contact?.email, cv.contact?.phone, cv.contact?.location, cv.contact?.website, cv.contact?.linkedin].filter(Boolean);
  if (contactBits.length) {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        border: { bottom: { color: "DDDDDD", style: BorderStyle.SINGLE, size: 6, space: 8 } },
        children: [new TextRun({ text: contactBits.join("   |   "), size: 18, color: gray })],
      }),
    );
  }

  // ---- Summary ----
  if (cv.summary?.trim()) {
    children.push(heading("Summary"));
    children.push(...richBlock(cv.summary));
  }

  // ---- Experience ----
  if (cv.experience?.length) {
    children.push(heading("Experience"));
    for (const job of cv.experience) {
      children.push(titleLine(job.role || "", job.company || undefined, job.period));
      children.push(...periodLine(job.period));
      for (const b of job.bullets || []) {
        if (!b.trim()) continue;
        children.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 20 }, children: mdRuns(b, { size: 20 }) }));
      }
    }
  }

  // ---- Education ----
  if (cv.education?.length) {
    children.push(heading("Education"));
    for (const ed of cv.education) {
      children.push(titleLine(ed.degree || "", ed.institution || undefined, ed.period));
      children.push(...periodLine(ed.period));
    }
  }

  // ---- Skills ----
  if (cv.skills?.length) {
    children.push(heading("Skills"));
    children.push(new Paragraph({ children: [new TextRun({ text: cv.skills.join("   ·   "), size: 20, color: "1A1A1A" })] }));
  }

  // ---- Languages ----
  if (cv.languages?.length) {
    children.push(heading("Languages"));
    const langs = cv.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).filter(Boolean).join("   ·   ");
    children.push(new Paragraph({ children: [new TextRun({ text: langs, size: 20, color: "1A1A1A" })] }));
  }

  // ---- Certificates ----
  if (cv.certificates?.length) {
    children.push(heading("Certificates"));
    for (const c of cv.certificates) {
      const runs: TextRun[] = [new TextRun({ text: c.name || "", bold: true, size: 20, color: secondary })];
      if (c.issuer) runs.push(new TextRun({ text: ` — ${c.issuer}`, size: 20, color: gray }));
      if (c.year) runs.push(new TextRun({ text: ` (${c.year})`, size: 18, color: gray }));
      children.push(new Paragraph({ spacing: { after: 20 }, children: runs }));
    }
  }

  // ---- Custom sections ----
  for (const s of cv.customSections || []) {
    if (!s.heading || !s.items?.length) continue;
    children.push(heading(s.heading));
    for (const it of s.items) {
      children.push(titleLine(it.title || "", it.subtitle || undefined, it.period));
      children.push(...periodLine(it.period));
      if (it.description?.trim()) children.push(...richBlock(it.description));
    }
  }

  const section: ISectionOptions = {
    properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } }, // 0.5in
    children,
  };

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri" } } } },
    sections: [section],
  });

  return Packer.toBuffer(doc);
}
