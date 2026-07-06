"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import {
  listTemplates,
  createTemplate,
  renameTemplate,
  deleteTemplate,
  readCache,
  writeCache,
  type MyTemplate,
} from "./templateStore";
import type { TemplateId, Theme } from "@/app/templates";

// Loads the signed-in user's saved templates (instant from the localStorage
// cache, then reconciled with Firestore) and exposes save/rename/remove.
export function useMyTemplates() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [templates, setTemplates] = useState<MyTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!uid) {
      setTemplates([]);
      setLoading(false);
      return;
    }
    setTemplates(readCache(uid)); // paint instantly from cache
    try {
      setTemplates(await listTemplates(uid));
    } catch {
      /* offline / rules — keep the cached list */
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (name: string, layout: TemplateId, theme: Theme) => {
      if (!uid) return;
      await createTemplate(uid, name, layout, theme);
      await refresh();
    },
    [uid, refresh],
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      if (!uid) return;
      setTemplates((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, name } : t));
        writeCache(uid, next);
        return next;
      });
      try {
        await renameTemplate(uid, id, name);
      } finally {
        refresh();
      }
    },
    [uid, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!uid) return;
      setTemplates((prev) => {
        const next = prev.filter((t) => t.id !== id);
        writeCache(uid, next);
        return next;
      });
      try {
        await deleteTemplate(uid, id);
      } finally {
        refresh();
      }
    },
    [uid, refresh],
  );

  return { templates, loading, save, rename, remove };
}
