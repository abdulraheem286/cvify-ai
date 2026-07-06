// The theme = user customization applied ON TOP of any layout.
// A layout never hard-codes colours or fonts; it reads these CSS variables:
//   --primary, --secondary, --bg, --font-body, --font-heading
// This file has NO component imports, so layouts can import it freely.

export type Density = "compact" | "normal" | "roomy";
export type HeadingCase = "as-designed" | "upper";

export type Theme = {
  primary: string; // main accent colour
  secondary: string; // secondary accent / strong text colour (name, headings)
  bg: string; // document surface background
  fontBody: string; // CSS font-family value, e.g. "var(--font-inter)"
  fontHeading: string; // CSS font-family value

  // --- Extended options (all OPTIONAL) ---
  // Every field below is optional so any theme saved before these existed still
  // renders byte-identically: buildCvCss() only emits a rule when a field is set.
  text?: string; // main body-text colour (overrides the darker zinc greys)
  muted?: string; // secondary / meta text colour (overrides the lighter greys)
  fontScale?: number; // multiplier on all text sizes, e.g. 0.9–1.15 (1 = default)
  lineHeight?: number; // unitless line-height applied to body text (e.g. 1.3–1.75)
  headingCase?: HeadingCase; // "upper" forces UPPERCASE headings
  density?: Density; // overall compactness (maps to a document zoom)
};

// Where an entry's date sits. Both are ATS-safe (parse cleanly); "right-aligned"
// is intentionally NOT an option because it breaks PDF/ATS reading order.
export type DatePlacement = "below" | "inline";
export const DEFAULT_DATE_PLACEMENT: DatePlacement = "below";

export const DEFAULT_THEME: Theme = {
  primary: "#2563eb",
  secondary: "#0f172a",
  bg: "#ffffff",
  fontBody: "var(--font-inter)",
  fontHeading: "var(--font-inter)",
};

// Turn a theme into the inline style object every layout root spreads.
export function themeVars(theme: Theme): Record<string, string> {
  return {
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--bg": theme.bg,
    "--font-body": theme.fontBody,
    "--font-heading": theme.fontHeading,
  };
}

// Density → document zoom. Compact fits more on a page; roomy breathes more.
const DENSITY_ZOOM: Record<Density, number> = { compact: 0.93, normal: 1, roomy: 1.08 };

// Base rem sizes for the Tailwind text utilities the templates actually use.
// Scaling these (scoped to one CV) changes text size everywhere without touching
// any template — the id selector out-specifies Tailwind's own `.text-*` rules.
const TEXT_SIZES: [string, number][] = [
  ["text-xs", 0.75],
  ["text-sm", 0.875],
  ["text-base", 1],
  ["text-lg", 1.125],
  ["text-xl", 1.25],
  ["text-2xl", 1.5],
  ["text-3xl", 1.875],
  ["text-4xl", 2.25],
  ["text-5xl", 3],
];

// Build a scoped stylesheet that applies a theme's EXTENDED options to one CV
// (identified by its DOM id). Returns "" when nothing extended is set, so the
// common case injects no markup at all.
export function buildCvCss(domId: string, t: Theme): string {
  const sel = `#${domId}`;
  const rules: string[] = [];

  // Density → zoom the whole document.
  const zoom = t.density ? DENSITY_ZOOM[t.density] : 1;
  if (zoom !== 1) rules.push(`${sel}{zoom:${zoom}}`);

  // Typography: font scale and/or custom line-height on the text utilities.
  const scale = t.fontScale && t.fontScale > 0 ? t.fontScale : 1;
  const lh = t.lineHeight;
  if (scale !== 1 || lh) {
    for (const [cls, rem] of TEXT_SIZES) {
      const decl: string[] = [];
      if (scale !== 1) decl.push(`font-size:${(rem * scale).toFixed(4)}rem`);
      if (lh) decl.push(`line-height:${lh}`);
      rules.push(`${sel} .${cls}{${decl.join(";")}}`);
    }
    // Neutralise fixed leading utilities so a custom line-height wins.
    if (lh) rules.push(`${sel} .leading-tight,${sel} .leading-snug,${sel} .leading-relaxed{line-height:${lh}}`);
  }

  // Heading case.
  if (t.headingCase === "upper") rules.push(`${sel} h1,${sel} h2,${sel} h3{text-transform:uppercase}`);

  // Colour depth: remap the grey text scale to custom colours.
  if (t.text) rules.push(`${sel} .text-zinc-900,${sel} .text-zinc-800,${sel} .text-zinc-700{color:${t.text}}`);
  if (t.muted) rules.push(`${sel} .text-zinc-600,${sel} .text-zinc-500,${sel} .text-zinc-400{color:${t.muted}}`);

  return rules.join("");
}

// Slider/segment option metadata used by the customization studio.
export const FONT_SCALE_RANGE = { min: 0.9, max: 1.15, step: 0.05, default: 1 };
export const LINE_HEIGHT_RANGE = { min: 1.3, max: 1.8, step: 0.05, default: 1.5 };
export const DENSITIES: { id: Density; name: string }[] = [
  { id: "compact", name: "Compact" },
  { id: "normal", name: "Normal" },
  { id: "roomy", name: "Roomy" },
];

// Fonts loaded in app/layout.tsx via next/font, exposed as CSS variables.
export type FontOption = { id: string; name: string; value: string; kind: "Sans" | "Serif" };

export const FONTS: FontOption[] = [
  { id: "inter", name: "Inter", value: "var(--font-inter)", kind: "Sans" },
  { id: "geist", name: "Geist", value: "var(--font-geist-sans)", kind: "Sans" },
  { id: "poppins", name: "Poppins", value: "var(--font-poppins)", kind: "Sans" },
  { id: "roboto", name: "Roboto", value: "var(--font-roboto)", kind: "Sans" },
  { id: "lora", name: "Lora", value: "var(--font-lora)", kind: "Serif" },
  { id: "source-serif", name: "Source Serif", value: "var(--font-source-serif)", kind: "Serif" },
];

// Colour swatches for the primary / secondary pickers (custom hex also allowed).
export const SWATCHES: string[] = [
  "#2563eb", // blue
  "#0ea5e9", // sky
  "#0d9488", // teal
  "#059669", // emerald
  "#65a30d", // lime
  "#d97706", // amber
  "#ea580c", // orange
  "#dc2626", // red
  "#e11d48", // rose
  "#db2777", // pink
  "#7c3aed", // violet
  "#4f46e5", // indigo
  "#0f172a", // slate-900
  "#334155", // slate-700
  "#52525b", // zinc-600
  "#1c1917", // stone-900
];

// Light, print-safe document backgrounds.
export const BACKGROUNDS: { id: string; name: string; value: string }[] = [
  { id: "white", name: "White", value: "#ffffff" },
  { id: "cream", name: "Cream", value: "#fdfbf6" },
  { id: "gray", name: "Light gray", value: "#f8fafc" },
  { id: "sand", name: "Sand", value: "#faf6f0" },
  { id: "mint", name: "Mint", value: "#f4faf6" },
  { id: "blush", name: "Blush", value: "#fdf6f7" },
];

// One-click presets that set colours + fonts together.
export const THEME_PRESETS: { id: string; name: string; theme: Theme }[] = [
  { id: "classic-blue", name: "Classic Blue", theme: { primary: "#2563eb", secondary: "#0f172a", bg: "#ffffff", fontBody: "var(--font-inter)", fontHeading: "var(--font-inter)" } },
  { id: "emerald", name: "Emerald", theme: { primary: "#059669", secondary: "#064e3b", bg: "#f4faf6", fontBody: "var(--font-inter)", fontHeading: "var(--font-poppins)" } },
  { id: "editorial", name: "Editorial", theme: { primary: "#1c1917", secondary: "#44403c", bg: "#fdfbf6", fontBody: "var(--font-source-serif)", fontHeading: "var(--font-lora)" } },
  { id: "violet", name: "Violet", theme: { primary: "#7c3aed", secondary: "#3b0764", bg: "#ffffff", fontBody: "var(--font-inter)", fontHeading: "var(--font-poppins)" } },
  { id: "ruby", name: "Ruby", theme: { primary: "#e11d48", secondary: "#1c1917", bg: "#fdf6f7", fontBody: "var(--font-inter)", fontHeading: "var(--font-inter)" } },
  { id: "graphite", name: "Graphite", theme: { primary: "#334155", secondary: "#0f172a", bg: "#f8fafc", fontBody: "var(--font-roboto)", fontHeading: "var(--font-roboto)" } },
  { id: "amber", name: "Amber", theme: { primary: "#d97706", secondary: "#1c1917", bg: "#faf6f0", fontBody: "var(--font-inter)", fontHeading: "var(--font-poppins)" } },
  { id: "teal-serif", name: "Teal Serif", theme: { primary: "#0d9488", secondary: "#134e4a", bg: "#ffffff", fontBody: "var(--font-lora)", fontHeading: "var(--font-lora)" } },
];
