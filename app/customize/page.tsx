"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/app/components/AppHeader";
import { RequireAuth } from "@/app/components/RequireAuth";
import { CustomizeStudio } from "@/app/components/CustomizeStudio";
import { useMyTemplates } from "@/app/lib/useMyTemplates";
import { DEFAULT_TEMPLATE, getDefaultTheme, getTemplate, type TemplateId, type Theme } from "@/app/templates";

type Seed = { layout: TemplateId; theme: Theme; from?: string };

function Spinner() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
    </div>
  );
}

function Customize() {
  const router = useRouter();
  const { templates, loading } = useMyTemplates();
  const [ready, setReady] = useState(false);
  const [params, setParams] = useState<{ base: string | null; tpl: string | null }>({ base: null, tpl: null });
  const [seed, setSeed] = useState<Seed | null>(null);

  // Read query params + the seed handed over from the editor (sessionStorage).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("seed") === "1") {
      try {
        const raw = sessionStorage.getItem("cvify:customizeSeed");
        if (raw) setSeed(JSON.parse(raw) as Seed);
      } catch {
        /* ignore */
      }
    }
    setParams({ base: p.get("base"), tpl: p.get("tpl") });
    setReady(true);
  }, []);

  const editTpl = params.tpl ? templates.find((t) => t.id === params.tpl) : undefined;
  const editPending = !!params.tpl && !editTpl && loading;

  // Cancel returns to wherever the user came from (editor seed carries it);
  // default to the dashboard's Templates tab.
  const returnUrl = seed?.from || "/dashboard?tab=templates";
  const goHome = () => router.push(returnUrl);
  // After saving, jump straight into the CV editor using the saved template —
  // no separate "pick a template" step.
  const goToEditor = (savedId: string) => router.push(`/build/manual?tpl=${savedId}`);

  if (!ready || editPending) {
    return (
      <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
        <AppHeader />
        <Spinner />
      </div>
    );
  }

  let initialLayout: TemplateId;
  let initialTheme: Theme;
  let initialName: string;
  let editId: string | undefined;

  if (editTpl) {
    initialLayout = editTpl.layout;
    initialTheme = editTpl.theme;
    initialName = editTpl.name;
    editId = editTpl.id;
  } else if (seed) {
    initialLayout = getTemplate(seed.layout).id === seed.layout ? seed.layout : DEFAULT_TEMPLATE;
    initialTheme = seed.theme;
    initialName = `${getTemplate(initialLayout).name} custom`;
  } else {
    const valid = params.base && getTemplate(params.base).id === params.base;
    initialLayout = (valid ? params.base : DEFAULT_TEMPLATE) as TemplateId;
    initialTheme = getDefaultTheme(initialLayout);
    initialName = `${getTemplate(initialLayout).name} custom`;
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
      <AppHeader />
      <CustomizeStudio
        initialLayout={initialLayout}
        initialTheme={initialTheme}
        initialName={initialName}
        editId={editId}
        onBack={goHome}
        onSaved={goToEditor}
      />
    </div>
  );
}

export default function CustomizePage() {
  return (
    <RequireAuth>
      <Customize />
    </RequireAuth>
  );
}
