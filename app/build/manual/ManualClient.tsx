"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { CvEditor, EMPTY_FORM } from "@/app/components/CvEditor";
import { TemplateGallery } from "@/app/components/TemplateGallery";
import { DEFAULT_TEMPLATE, type TemplateId } from "@/app/templates";

export default function ManualClient() {
  const router = useRouter();
  const [step, setStep] = useState<"template" | "edit">("template");
  const [chosen, setChosen] = useState<TemplateId>(DEFAULT_TEMPLATE);

  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 print:bg-white">
      <div className="print:hidden">
        <SiteHeader />
      </div>

      {step === "template" ? (
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

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}
