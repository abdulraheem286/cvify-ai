"use client";

import { useRouter } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { CvEditor, EMPTY_FORM } from "@/app/components/CvEditor";

export default function ManualClient() {
  const router = useRouter();
  return (
    <div className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 print:bg-white">
      <div className="print:hidden">
        <SiteHeader />
      </div>
      <CvEditor
        initial={EMPTY_FORM}
        onBack={() => router.push("/build")}
        backLabel="Back to build options"
      />
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}
