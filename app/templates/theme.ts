// The theme = user customization applied ON TOP of any layout.
// A layout never hard-codes colours or fonts; it reads these CSS variables:
//   --primary, --secondary, --bg, --font-body, --font-heading
// This file has NO component imports, so layouts can import it freely.

export type Theme = {
  primary: string; // main accent colour
  secondary: string; // secondary accent / strong text colour
  bg: string; // document surface background
  fontBody: string; // CSS font-family value, e.g. "var(--font-inter)"
  fontHeading: string; // CSS font-family value
};

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
