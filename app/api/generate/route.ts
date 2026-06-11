import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// IMPORTANT: This file runs ONLY on the server (Vercel/your machine),
// never in the user's browser. That's why the secret API key is safe here.

type CVForm = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  experience: string;
};

// POST = the browser sends us the form data, we send back the AI's CV.
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "No Gemini API key found. Add GEMINI_API_KEY to .env.local." },
      { status: 500 },
    );
  }

  const form = (await request.json()) as CVForm;

  // --- THE PROMPT: our instructions to the AI. This is the real skill. ---
  const prompt = `You are an expert CV writer. Turn the user's rough information into a polished, professional CV.

USER'S INFORMATION:
- Name: ${form.name}
- Desired job title: ${form.title}
- Email: ${form.email}
- Phone: ${form.phone}
- Location: ${form.location}
- Website / portfolio: ${form.website}
- Background (rough notes or pasted old CV):
${form.experience}

INSTRUCTIONS:
- Improve weak wording and use strong action verbs.
- CRITICAL — DO NOT invent anything. Only include skills, jobs, employers, degrees, and dates that the user explicitly mentioned or that are strongly implied. Never add skills the user did not state. Do not exaggerate seniority, team sizes, or numbers.
- If a date or period is unknown, use an empty string "". If there is no education info, return an empty list. Never guess dates.
- Write a punchy 2-3 sentence professional summary using ONLY facts from the input.
- Turn the user's real experience into concise, achievement-focused bullet points (rephrase what they said; don't fabricate new achievements).

Return ONLY valid JSON (no markdown, no comments) in EXACTLY this shape:
{
  "fullName": "string",
  "jobTitle": "string",
  "contact": { "email": "string", "phone": "string", "location": "string", "website": "string" },
  "summary": "string",
  "experience": [
    { "role": "string", "company": "string", "period": "string", "bullets": ["string"] }
  ],
  "education": [
    { "degree": "string", "institution": "string", "period": "string" }
  ],
  "skills": ["string"]
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      // This forces the AI to reply with pure JSON, so we can read it reliably.
      config: { responseMimeType: "application/json" },
    });

    const text = response.text ?? "";
    const cv = JSON.parse(text); // turn the AI's JSON text into a real object
    return NextResponse.json({ cv });
  } catch (err) {
    console.error("AI generation failed:", err);
    return NextResponse.json(
      { error: "The AI failed to generate. Please try again." },
      { status: 500 },
    );
  }
}
