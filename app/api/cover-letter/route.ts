import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Server-only route that generates a tailored cover letter with Gemini.
// The secret key stays on the server.
type CoverBody = {
  name?: string;
  jobTitle?: string;
  company?: string;
  jobDescription?: string;
  background?: string;
};

function buildPrompt(b: CoverBody): string {
  return `You are an expert career writer. Write a professional, tailored cover letter.

Applicant name: ${b.name || "(not given)"}
Applying for: ${b.jobTitle || "(role not given)"}${b.company ? ` at ${b.company}` : ""}
Job description (may be empty): ${b.jobDescription || "(none provided)"}
Applicant's background — experience, skills, achievements (use ONLY these facts):
${b.background || "(none provided)"}

RULES:
- 3 to 4 short paragraphs. Warm, confident, and specific — never generic, robotic, or full of clichés.
- Open by naming the role and a genuine hook. The middle connects the applicant's REAL experience and skills to what the job needs. Close with a brief call to action.
- Use ONLY facts from the background above. Do NOT invent employers, job titles, numbers, degrees, or achievements.
- If little background is given, keep it concise and role-focused rather than padding with fluff.
- Greet with "Dear Hiring Manager," unless a specific name is clearly implied.
- End with "Sincerely," on its own line, then the applicant's real name on the next line.
- Plain text only, with blank lines between paragraphs (\\n\\n). No markdown, no bullet points, and NO placeholders like [Your Name] or [Company] — use the real values or omit.

Return ONLY JSON: { "letter": "the full cover letter text" }`;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No Gemini API key found." }, { status: 500 });
  }

  const body = (await request.json()) as CoverBody;
  if (!body || (!body.jobTitle && !body.background)) {
    return NextResponse.json({ error: "Please add the job and a little about you." }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(body),
      config: { responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(response.text ?? "{}");
    return NextResponse.json({ letter: typeof parsed.letter === "string" ? parsed.letter : "" });
  } catch (err) {
    console.error("Cover letter generation failed:", err);
    const msg = err instanceof Error ? err.message : "";
    const isRateLimit = /429|quota|rate|RESOURCE_EXHAUSTED/i.test(msg);
    return NextResponse.json(
      {
        error: isRateLimit
          ? "CVify AI is busy right now (free usage limit reached). Please wait a minute and try again."
          : "The AI couldn't write the letter. Please try again.",
      },
      { status: isRateLimit ? 429 : 500 },
    );
  }
}
