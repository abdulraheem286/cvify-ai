import { NextResponse } from "next/server";

// Server-side, dialog-free PDF: a headless Chromium renders the CV on the
// /print page and prints it with real, selectable (ATS-readable) text.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json();
  const origin = new URL(request.url).origin;
  const fileName = String(body.fileName || "cv").replace(/[^a-zA-Z0-9-_]/g, "") || "cv";

  let browser;
  try {
    // Imported inside the handler so init/load errors are catchable and reported.
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 820, height: 1160 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(`${origin}/print`, { waitUntil: "networkidle0", timeout: 30000 });
    await page.waitForFunction(() => window.__cvReady === true, { timeout: 15000 });
    await page.evaluate(
      (d) => window.__renderCv?.(d),
      { cv: body.cv, template: body.template, theme: body.theme },
    );
    await page.waitForSelector("#cv-document", { timeout: 15000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      scale: 0.99,
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Server PDF failed:", err);
    return NextResponse.json(
      { error: "PDF generation failed.", detail: String((err as Error)?.stack || err).slice(0, 1200) },
      { status: 500 },
    );
  } finally {
    if (browser) await browser.close();
  }
}
