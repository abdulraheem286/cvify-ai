"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/app/components/AppHeader";
import { CvEditor, EMPTY_FORM } from "@/app/components/CvEditor";
import { TemplateGallery } from "@/app/components/TemplateGallery";
import { DEFAULT_TEMPLATE, type TemplateId } from "@/app/templates";
import { useAuth } from "@/app/components/AuthProvider";
import { getCv, type CvRecord } from "@/app/lib/cvStore";
import { useMyTemplates } from "@/app/lib/useMyTemplates";

export default function ManualClient() {
  const router = useRouter();
  const { user, loading: authLoading, enabled } = useAuth();
  const { templates: myTemplates, loading: tplLoading } = useMyTemplates();
  const [step, setStep] = useState<"template" | "edit">("template");
  const [chosen, setChosen] = useState<TemplateId>(DEFAULT_TEMPLATE);
  const [cvParam, setCvParam] = useState<string | null>(null);
  const [tplParam, setTplParam] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<CvRecord | null>(null);
  const [loadingCv, setLoadingCv] = useState(false);

  // Read ?cv=<id> / ?tpl=<id> (client-only, avoids a Suspense boundary).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCvParam(params.get("cv"));
    setTplParam(params.get("tpl"));
  }, []);

  // Starting a fresh CV from a saved template (dashboard → "Use").
  const startTpl = tplParam ? myTemplates.find((t) => t.id === tplParam) : undefined;
  const tplPending = !!tplParam && !startTpl && tplLoading;

  // Load a saved CV when opened from the dashboard.
  useEffect(() => {
    if (!cvParam || !enabled || authLoading || !user) return;
    setLoadingCv(true);
    getCv(user.uid, cvParam)
      .then((cv) => {
        if (cv) setLoaded(cv);
        setLoadingCv(false);
      })
      .catch(() => setLoadingCv(false));
  }, [cvParam, user, authLoading, enabled]);

  const showLoader = (cvParam && (loadingCv || (enabled && authLoading)) && !loaded) || tplPending;

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 print:bg-white">
      <AppHeader />

      {showLoader ? (
        <div className="flex flex-1 items-center justify-center py-32">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
        </div>
      ) : loaded ? (
        <CvEditor
          initial={loaded.data.form}
          initialTemplate={loaded.data.template}
          initialTheme={loaded.data.theme}
          initialHidden={loaded.data.hidden}
          cvId={loaded.id}
          initialTitle={loaded.title}
          onBack={() => router.push("/dashboard")}
          backLabel="Back to dashboard"
        />
      ) : startTpl ? (
        <CvEditor
          initial={EMPTY_FORM}
          initialTemplate={startTpl.layout}
          initialTheme={startTpl.theme}
          onBack={() => router.push("/dashboard")}
          backLabel="Back to dashboard"
        />
      ) : step === "template" ? (
        <TemplateGallery
          onSelect={(id) => {
            setChosen(id);
            setStep("edit");
          }}
          onBack={() => router.push("/build")}
          backLabel="Back to build options"
        />
      ) : (
        <CvEditor
          initial={EMPTY_FORM}
          initialTemplate={chosen}
          onBack={() => setStep("template")}
          backLabel="Back to templates"
        />
      )}
    </div>
  );
}
