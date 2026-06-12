"use client";

import { useEffect, useState } from "react";
import { TemplateView } from "@/app/templates/TemplateView";
import { DEFAULT_TEMPLATE, DEFAULT_THEME, type TemplateId, type Theme } from "@/app/templates";
import type { CVResult } from "@/app/types";

type PrintData = { cv: CVResult; template?: TemplateId; theme?: Theme };

declare global {
  interface Window {
    __renderCv?: (d: PrintData) => void;
    __cvReady?: boolean;
  }
}

// Minimal, chrome-free page used ONLY by the server-side PDF renderer.
// The headless browser loads this (so all CSS + fonts are ready), then calls
// window.__renderCv(data) to paint the CV, then prints it to PDF.
export default function PrintPage() {
  const [data, setData] = useState<PrintData | null>(null);

  useEffect(() => {
    window.__renderCv = (d) => setData(d);
    window.__cvReady = true;
  }, []);

  if (!data) return null;

  return (
    <div className="print-page">
      <TemplateView
        id={data.template ?? DEFAULT_TEMPLATE}
        cv={data.cv}
        theme={data.theme ?? DEFAULT_THEME}
        domId="cv-document"
      />
    </div>
  );
}
