import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Parses the raw text of an existing CV into structured fields (faithful
// extraction — it does NOT rewrite or invent anything).
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No Gemini API key found." }, { status: 500 });
  }

  const { text } = (await request.json()) as { text?: string };
  if (!text || !text.trim()) {
    return NextResponse.json({ error: "No CV text provided." }, { status: 400 });
  }

  const prompt = `You are a precise CV/resume parser. Read the raw text of an existing CV and extract it into structured JSON.

RAW CV TEXT:
"""
${text.slice(0, 12000)}
"""

RULES:
- EXTRACT only what is actually written. Do NOT invent, add, or rewrite facts, skills, dates, employers, or achievements.
- Keep the person's own wording for bullet points (only clean up obvious formatting noise like stray symbols).
- If a field is missing from the text, use an empty string "" or an empty array. Never guess.
- Split work history into separate experience entries; make each responsibility or achievement its own bullet.

Return ONLY valid JSON (no markdown) in EXACTLY this shape:
{
  "fullName": "string",
  "jobTitle": "string",
  "contact": { "email": "string", "phone": "string", "location": "string", "website": "string", "linkedin": "string" },
  "summary": "string",
  "experience": [{ "role": "string", "company": "string", "period": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "period": "string" }],
  "skills": ["string"],
  "languages": [{ "name": "string", "level": "string" }],
  "certificates": [{ "name": "string", "issuer": "string", "year": "string" }]
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    const cv = JSON.parse(response.text ?? "{}");
    return NextResponse.json({ cv });
  } catch (err) {
    console.error("CV import parse failed:", err);
    const msg = err instanceof Error ? err.message : "";
    const isRateLimit = /429|quota|rate|RESOURCE_EXHAUSTED/i.test(msg);
    return NextResponse.json(
      {
        error: isRateLimit
          ? "CVify AI is busy right now (free usage limit reached). Please wait a minute and try again."
          : "Couldn't read that CV. Please try again, or paste the text directly.",
      },
      { status: isRateLimit ? 429 : 500 },
    );
  }
}
