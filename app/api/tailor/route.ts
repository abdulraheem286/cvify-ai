import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import type { CVResult } from "@/app/types";

// Tailors an existing CV to a specific job description: rewrites the summary,
// re-angles each job's bullets toward the role, and flags missing keywords —
// WITHOUT inventing any facts.
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No Gemini API key found." }, { status: 500 });
  }

  const { jd, cv } = (await request.json()) as { jd?: string; cv?: CVResult };
  if (!jd || !jd.trim()) {
    return NextResponse.json({ error: "Paste a job description first." }, { status: 400 });
  }
  if (!cv) {
    return NextResponse.json({ error: "No CV data provided." }, { status: 400 });
  }

  const exp = (cv.experience ?? [])
    .map((e, i) => `[${i}] ${[e.role, e.company].filter(Boolean).join(" at ")}\n${(e.bullets ?? []).map((b) => `- ${b}`).join("\n")}`)
    .join("\n\n");

  const prompt = `You are an expert resume writer tailoring a candidate's CV to a specific job.

JOB DESCRIPTION:
"""
${jd.slice(0, 8000)}
"""

CURRENT CV:
- Target title: ${cv.jobTitle ?? ""}
- Summary: ${cv.summary ?? ""}
- Skills: ${(cv.skills ?? []).join(", ") || "(none listed)"}
- Experience (numbered, keep this exact order and count):
${exp || "(none provided)"}

TASK — tailor the CV to this job, WITHOUT inventing anything:
- Use ONLY the candidate's real experience and skills. Do NOT add fake jobs, employers, metrics, dates, or skills they do not have.
- Rewrite the SUMMARY (2-3 sentences) to foreground the experience most relevant to this job.
- For EACH experience entry, rewrite and reorder its bullets to emphasize what matters for this job, using strong action verbs. Keep roughly the same number of bullets; rephrase what's there — never fabricate new achievements or numbers.
- missingSkills: list skills/keywords the JOB asks for that are NOT already in the candidate's skills or experience (suggestions only — the candidate decides if they truly have them).
- notes: one short sentence of guidance on tailoring for this role.

Return ONLY valid JSON in EXACTLY this shape (experience array MUST be the same length and order as the input):
{
  "summary": "string",
  "experience": [{ "bullets": ["string"] }],
  "missingSkills": ["string"],
  "notes": "string"
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(response.text ?? "{}");
    return NextResponse.json({
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      experience: Array.isArray(parsed.experience)
        ? parsed.experience.map((e: { bullets?: unknown }) => ({
            bullets: Array.isArray(e?.bullets) ? e.bullets.map(String) : [],
          }))
        : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.map(String) : [],
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
    });
  } catch (err) {
    console.error("Tailor failed:", err);
    const msg = err instanceof Error ? err.message : "";
    const isRateLimit = /429|quota|rate|RESOURCE_EXHAUSTED/i.test(msg);
    return NextResponse.json(
      {
        error: isRateLimit
          ? "CVify AI is busy right now (free usage limit reached). Please wait a minute and try again."
          : "Couldn't tailor the CV. Please try again.",
      },
      { status: isRateLimit ? 429 : 500 },
    );
  }
}
