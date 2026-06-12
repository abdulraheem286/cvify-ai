// Client helper for the /api/assist route (in-editor AI edits).

async function postAssist(body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch("/api/assist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data?.error as string) ?? "Something went wrong.");
  return data;
}

type ExpItem = { role?: string; company?: string; bullets?: string[] };

export async function aiSummary(input: {
  name?: string;
  title?: string;
  summary?: string;
  experience?: ExpItem[];
  skills?: string[];
}): Promise<string> {
  const data = await postAssist({ task: "summary", ...input });
  return (data.text as string) ?? "";
}

export async function aiBullets(input: { role?: string; company?: string; bullets?: string }): Promise<string[]> {
  const data = await postAssist({ task: "bullets", ...input });
  return (data.bullets as string[]) ?? [];
}

export async function aiSkills(input: { title?: string; experience?: ExpItem[]; skills?: string[] }): Promise<string[]> {
  const data = await postAssist({ task: "skills", ...input });
  return (data.skills as string[]) ?? [];
}
