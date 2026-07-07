"use client";

import { useEffect, useState } from "react";
import { useMyTemplates } from "./useMyTemplates";
import type { MyTemplate } from "./templateStore";

// Reads ?tpl=<savedId> from the URL and resolves it to the user's saved template.
// Build flows use this to start a new CV pre-set to a saved layout + theme.
//   pending  — still reading the param / loading the template list
//   seed     — the resolved template, or undefined when there's no valid ?tpl
export function useSeedTemplate(): { tplId: string | null | undefined; seed: MyTemplate | undefined; pending: boolean } {
  const { templates, loading } = useMyTemplates();
  const [tplId, setTplId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setTplId(new URLSearchParams(window.location.search).get("tpl"));
  }, []);

  const seed = tplId ? templates.find((t) => t.id === tplId) : undefined;
  // Undefined tplId = not read yet. With an id, keep waiting while the list loads
  // and hasn't produced it yet.
  const pending = tplId === undefined || (!!tplId && !seed && loading);

  return { tplId, seed, pending };
}
