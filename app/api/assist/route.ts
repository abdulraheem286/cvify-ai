import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Server-only route for small, scoped AI edits inside the editor:
//  - "summary": write a professional summary from the user's real details
//  - "bullets": rewrite/strengthen the bullet points of one job
//  - "skills":  suggest relevant skills for the role/background
// The secret key stays on the server — never shipped to the browser.

type ExpItem = { role?: string; company?: string; bullets?: string[] };

type AssistBody =
  | { task: "summary"; name?: string; title?: string; summary?: string; experience?: ExpItem[]; skills?: string[] }
  | { task: "bullets"; role?: string; company?: string; bullets?: string }
  | { task: "skills"; title?: string; experience?: ExpItem[]; skills?: string[] };

function buildPrompt(body: AssistBody): string {
  if (body.task === "summary") {
    const exp = (body.experience ?? [])
      .map((e) => `- ${[e.role, e.company].filter(Boolean).join(" at ")}: ${(e.bullets ?? []).join("; ")}`)
      .join("\n");
    return `You are an expert CV writer. Write a punchy 2-3 sentence professional summary in the first person implied voice (no "I", just statements), for this person.

Name: ${body.name ?? ""}
Target job title: ${body.title ?? ""}
Current summary (may be empty, improve if present): ${body.summary ?? ""}
Experience:
${exp || "(none provided)"}
Known skills: ${(body.skills ?? []).join(", ") || "(none)"}

RULES:
- Use ONLY facts above. Do NOT invent employers, numbers, or seniority.
- If little info is given, keep it short and role-focused.
- No headings, no quotes, no markdown. Plain text only.

Return ONLY JSON: { "text": "the summary" }`;
  }

  if (body.task === "bullets") {
    return `You are an expert CV writer. Rewrite these resume bullet points to be stronger and achievement-focused.

Role: ${body.role ?? ""}
Company: ${body.company ?? ""}
Current bullets (one per line):
${body.bullets ?? ""}

RULES:
- Keep roughly the same number of bullets (do not pad).
- Start each with a strong action verb. Be concise.
- Do NOT fabricate metrics, achievements, technologies, or facts not implied by the input.
- No bullet symbols, no markdown — just the text of each bullet.

Return ONLY JSON: { "bullets": ["bullet one", "bullet two"] }`;
  }

  // skills
  const exp = (body.experience ?? [])
    .map((e) => `- ${[e.role, e.company].filter(Boolean).join(" at ")}: ${(e.bullets ?? []).join("; ")}`)
    .join("\n");
  return `You are an expert CV writer. Suggest relevant, realistic skills for this person's CV.

Target job title: ${body.title ?? ""}
Experience:
${exp || "(none provided)"}
Already listed skills (do NOT repeat these): ${(body.skills ?? []).join(", ") || "(none)"}

RULES:
- Suggest up to 8 concise skills commonly expected for this role/field.
- Prefer skills implied by the experience; keep them realistic, not buzzwords.
- Single words or short phrases only.

Return ONLY JSON: { "skills": ["Skill A", "Skill B"] }`;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No Gemini API key found." }, { status: 500 });
  }

  const body = (await request.json()) as AssistBody;
  if (!body || !("task" in body)) {
    return NextResponse.json({ error: "Missing task." }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(body),
      config: { responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(response.text ?? "{}");

    if (body.task === "bullets") {
      const bullets = Array.isArray(parsed.bullets) ? parsed.bullets.map(String) : [];
      return NextResponse.json({ bullets });
    }
    if (body.task === "skills") {
      const skills = Array.isArray(parsed.skills) ? parsed.skills.map(String) : [];
      return NextResponse.json({ skills });
    }
    return NextResponse.json({ text: typeof parsed.text === "string" ? parsed.text : "" });
  } catch (err) {
    console.error("AI assist failed:", err);
    const msg = err instanceof Error ? err.message : "";
    const isRateLimit = /429|quota|rate|RESOURCE_EXHAUSTED/i.test(msg);
    return NextResponse.json(
      {
        error: isRateLimit
          ? "CVify AI is busy right now (free usage limit reached). Please wait a minute and try again."
          : "The AI couldn't help with that. Please try again.",
      },
      { status: isRateLimit ? 429 : 500 },
    );
  }
}
