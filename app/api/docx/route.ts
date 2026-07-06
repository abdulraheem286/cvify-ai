import { NextResponse } from "next/server";
import { buildCvDocx } from "@/app/lib/docxBuild";

// Builds an editable Word (.docx) from a CVResult — real text, headings and
// bullets, so it opens cleanly in Word/Google Docs and stays ATS-readable.
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.cv) {
      return NextResponse.json({ error: "Missing CV data." }, { status: 400 });
    }
    const fileName = String(body.fileName || "cv").replace(/[^a-zA-Z0-9-_]/g, "") || "cv";
    const buffer = await buildCvDocx(body.cv, body.theme);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}.docx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("DOCX generation failed:", err);
    return NextResponse.json({ error: "Word export failed." }, { status: 500 });
  }
}
