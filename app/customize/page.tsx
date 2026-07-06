"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/app/components/AppHeader";
import { RequireAuth } from "@/app/components/RequireAuth";
import { CustomizeStudio } from "@/app/components/CustomizeStudio";
import { useMyTemplates } from "@/app/lib/useMyTemplates";
import { DEFAULT_TEMPLATE, getDefaultTheme, getTemplate, type TemplateId } from "@/app/templates";

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
  const [params, setParams] = useState<{ base: string | null; tpl: string | null } | null>(null);

  // Read ?base=<layoutId> / ?tpl=<savedId> client-side (no Suspense boundary).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setParams({ base: p.get("base"), tpl: p.get("tpl") });
  }, []);

  const editTpl = params?.tpl ? templates.find((t) => t.id === params.tpl) : undefined;
  const editPending = !!params?.tpl && !editTpl && loading;

  const goDone = () => router.push("/dashboard?tab=templates");

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900">
      <AppHeader />
      {!params || editPending ? (
        <Spinner />
      ) : editTpl ? (
        <CustomizeStudio
          initialLayout={editTpl.layout}
          initialTheme={editTpl.theme}
          initialName={editTpl.name}
          editId={editTpl.id}
          onBack={goDone}
          onSaved={goDone}
        />
      ) : (
        (() => {
          const valid = params.base && getTemplate(params.base).id === params.base;
          const base = (valid ? params.base : DEFAULT_TEMPLATE) as TemplateId;
          return (
            <CustomizeStudio
              initialLayout={base}
              initialTheme={getDefaultTheme(base)}
              initialName={`${getTemplate(base).name} custom`}
              onBack={() => router.push("/dashboard?tab=templates")}
              onSaved={goDone}
            />
          );
        })()
      )}
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
