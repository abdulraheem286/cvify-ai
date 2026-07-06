import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  BorderStyle,
  ShadingType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  type ISectionOptions,
  type IBorderOptions,
} from "docx";
import type { CVResult } from "@/app/types";

// Generated in the BROWSER (Packer.toBlob) — no serverless function, so it can't
// interfere with the PDF function and always has its deps.
//
// Word can't reproduce a template's exact CSS design, but this mirrors it as
// closely as the format allows: colored header band, 1- vs 2-column side-rail
// layout, the template's accent colours, and mapped heading/body fonts.

type ThemeLike = { primary?: string; secondary?: string; fontHeading?: string; fontBody?: string };

// Which templates render as a 2-column (side-rail) layout, and which have a
// solid colored header band. Kept here so Word roughly follows the same shape.
const TWO_COL = new Set(["sidebar", "profile", "aurora", "gradient", "executive"]);
const HEADER_BAND = new Set(["banner", "onyx", "bold", "aurora", "gradient", "cards", "sidebar"]);

// Map the template's CSS font var to a Word-installed font that looks similar,
// so the .docx renders consistently even without the web font installed.
function wordFont(cssVar: string | undefined, fallback: string): string {
  const map: Record<string, string> = {
    "var(--font-inter)": "Calibri",
    "var(--font-geist-sans)": "Calibri",
    "var(--font-poppins)": "Calibri",
    "var(--font-roboto)": "Arial",
    "var(--font-lora)": "Georgia",
    "var(--font-source-serif)": "Georgia",
    "var(--font-playfair)": "Georgia",
  };
  return (cssVar && map[cssVar]) || fallback;
}

const TOKEN = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[([^\]]+)\]\(([^)\s]+)\))/g;

function hex(c: string | undefined, fallback: string): string {
  if (!c) return fallback;
  const h = c.replace("#", "").trim();
  return /^[0-9a-fA-F]{6}$/.test(h) ? h.toUpperCase() : fallback;
}

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

const NO_BORDER: IBorderOptions = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const CELL_NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

export async function buildCvDocx(cv: CVResult, theme?: ThemeLike, template?: string): Promise<Blob> {
  const primary = hex(theme?.primary, "2563EB");
  const secondary = hex(theme?.secondary, "0F172A");
  const gray = "555555";
  const headFont = wordFont(theme?.fontHeading, "Calibri");
  const bodyFont = wordFont(theme?.fontBody, "Calibri");

  const twoCol = template ? TWO_COL.has(template) : false;
  const band = template ? HEADER_BAND.has(template) : false;
  const bandColor = template === "onyx" ? secondary : primary;

  // ---- shared pieces ----
  const heading = (title: string) =>
    new Paragraph({
      spacing: { before: 240, after: 90 },
      border: { bottom: { color: primary, style: BorderStyle.SINGLE, size: 6, space: 2 } },
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, color: primary, font: headFont, characterSpacing: 20 })],
    });

  const titleLine = (lead: string, trailer?: string) => {
    const runs: TextRun[] = [new TextRun({ text: lead, bold: true, size: 22, color: secondary })];
    if (trailer) runs.push(new TextRun({ text: `  ·  ${trailer}`, size: 22, color: gray }));
    return new Paragraph({ spacing: { before: 100, after: 0 }, children: runs });
  };
  const periodLine = (period?: string) =>
    period
      ? [new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: period, italics: true, size: 18, color: gray })] })]
      : [];

  const contactBits = [cv.contact?.email, cv.contact?.phone, cv.contact?.location, cv.contact?.website, cv.contact?.linkedin].filter(Boolean);

  // ---- section builders (return Paragraph[]) ----
  const summarySection = (): Paragraph[] =>
    cv.summary?.trim() ? [heading("Summary"), ...richBlock(cv.summary)] : [];

  const experienceSection = (): Paragraph[] => {
    if (!cv.experience?.length) return [];
    const out: Paragraph[] = [heading("Experience")];
    for (const job of cv.experience) {
      out.push(titleLine(job.role || "", job.company || undefined));
      out.push(...periodLine(job.period));
      for (const b of job.bullets || []) {
        if (!b.trim()) continue;
        out.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 20 }, children: mdRuns(b, { size: 20 }) }));
      }
    }
    return out;
  };

  const educationSection = (): Paragraph[] => {
    if (!cv.education?.length) return [];
    const out: Paragraph[] = [heading("Education")];
    for (const ed of cv.education) {
      out.push(titleLine(ed.degree || "", ed.institution || undefined));
      out.push(...periodLine(ed.period));
    }
    return out;
  };

  const customSectionsBlocks = (): Paragraph[] => {
    const out: Paragraph[] = [];
    for (const s of cv.customSections || []) {
      if (!s.heading || !s.items?.length) continue;
      out.push(heading(s.heading));
      for (const it of s.items) {
        out.push(titleLine(it.title || "", it.subtitle || undefined));
        out.push(...periodLine(it.period));
        if (it.description?.trim()) out.push(...richBlock(it.description));
      }
    }
    return out;
  };

  // Skills/languages/certs render as vertical lists in a rail, inline otherwise.
  const skillsSection = (rail: boolean): Paragraph[] => {
    if (!cv.skills?.length) return [];
    if (rail) {
      return [
        heading("Skills"),
        ...cv.skills.map((s) => new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: s, size: 20, color: "1A1A1A" })] })),
      ];
    }
    return [heading("Skills"), new Paragraph({ children: [new TextRun({ text: cv.skills.join("   ·   "), size: 20, color: "1A1A1A" })] })];
  };

  const languagesSection = (rail: boolean): Paragraph[] => {
    if (!cv.languages?.length) return [];
    const items = cv.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).filter(Boolean);
    if (rail) {
      return [heading("Languages"), ...items.map((t) => new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: t, size: 20, color: "1A1A1A" })] }))];
    }
    return [heading("Languages"), new Paragraph({ children: [new TextRun({ text: items.join("   ·   "), size: 20, color: "1A1A1A" })] })];
  };

  const certsSection = (): Paragraph[] => {
    if (!cv.certificates?.length) return [];
    const out: Paragraph[] = [heading("Certificates")];
    for (const c of cv.certificates) {
      const runs: TextRun[] = [new TextRun({ text: c.name || "", bold: true, size: 20, color: secondary })];
      if (c.issuer) runs.push(new TextRun({ text: ` — ${c.issuer}`, size: 20, color: gray }));
      if (c.year) runs.push(new TextRun({ text: ` (${c.year})`, size: 18, color: gray }));
      out.push(new Paragraph({ spacing: { after: 20 }, children: runs }));
    }
    return out;
  };

  const contactSection = (): Paragraph[] => {
    if (!contactBits.length) return [];
    return [
      heading("Contact"),
      ...contactBits.map((c) => new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: String(c), size: 18, color: "1A1A1A" })] })),
    ];
  };

  // ---- header (band or plain) ----
  const children: (Paragraph | Table)[] = [];

  if (band) {
    const bandChildren: Paragraph[] = [
      new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: cv.fullName || "Your Name", bold: true, size: 46, color: "FFFFFF", font: headFont })] }),
    ];
    if (cv.jobTitle)
      bandChildren.push(new Paragraph({ spacing: { after: contactBits.length && !twoCol ? 60 : 0 }, children: [new TextRun({ text: cv.jobTitle, size: 26, color: "FFFFFF" })] }));
    if (contactBits.length && !twoCol)
      bandChildren.push(new Paragraph({ children: [new TextRun({ text: contactBits.join("   |   "), size: 18, color: "FFFFFF" })] }));
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { type: ShadingType.CLEAR, color: "auto", fill: bandColor },
                margins: { top: 200, bottom: 200, left: 240, right: 240 },
                borders: CELL_NO_BORDERS,
                children: bandChildren,
              }),
            ],
          }),
        ],
      }),
    );
  } else {
    children.push(new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: cv.fullName || "Your Name", bold: true, size: 46, color: secondary, font: headFont })] }));
    if (cv.jobTitle) children.push(new Paragraph({ spacing: { after: contactBits.length && !twoCol ? 60 : 0 }, children: [new TextRun({ text: cv.jobTitle, size: 26, color: primary })] }));
    if (contactBits.length && !twoCol)
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          border: { bottom: { color: "DDDDDD", style: BorderStyle.SINGLE, size: 6, space: 8 } },
          children: [new TextRun({ text: contactBits.join("   |   "), size: 18, color: gray })],
        }),
      );
  }

  // ---- body ----
  if (twoCol) {
    const rail: Paragraph[] = [...contactSection(), ...skillsSection(true), ...languagesSection(true), ...certsSection()];
    const main: Paragraph[] = [...summarySection(), ...experienceSection(), ...educationSection(), ...customSectionsBlocks()];
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [3300, 7100],
        borders: { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 32, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.TOP,
                margins: { top: 120, right: 240, bottom: 120, left: 0 },
                borders: CELL_NO_BORDERS,
                children: rail.length ? rail : [new Paragraph({ children: [new TextRun({ text: "" })] })],
              }),
              new TableCell({
                width: { size: 68, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.TOP,
                margins: { top: 120, right: 0, bottom: 120, left: 240 },
                borders: CELL_NO_BORDERS,
                children: main.length ? main : [new Paragraph({ children: [new TextRun({ text: "" })] })],
              }),
            ],
          }),
        ],
      }),
    );
  } else {
    children.push(
      ...summarySection(),
      ...experienceSection(),
      ...educationSection(),
      ...skillsSection(false),
      ...languagesSection(false),
      ...certsSection(),
      ...customSectionsBlocks(),
    );
  }

  const section: ISectionOptions = {
    properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
    children,
  };

  const doc = new Document({
    styles: { default: { document: { run: { font: bodyFont } } } },
    sections: [section],
  });

  return Packer.toBlob(doc);
}
