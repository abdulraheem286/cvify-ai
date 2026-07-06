import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { TemplateId, Theme } from "@/app/templates";

// A "My Template" is a saved LOOK (layout + theme) with no content — the user can
// reuse it to start a new CV or apply it to an existing one. It captures exactly
// what the editor's Template picker + Customize panel produce.
export type MyTemplate = {
  id: string;
  name: string;
  layout: TemplateId; // which layout structure
  theme: Theme; // colours + fonts + background
  updatedAt: number;
};

// A localStorage mirror lets pickers read saved templates synchronously (no async
// flash) while Firestore stays the cross-device source of truth.
const cacheKey = (uid: string) => `cvify:mytemplates:${uid}`;

export function readCache(uid: string | undefined): MyTemplate[] {
  if (!uid || typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(cacheKey(uid));
    return raw ? (JSON.parse(raw) as MyTemplate[]) : [];
  } catch {
    return [];
  }
}

export function writeCache(uid: string, templates: MyTemplate[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(cacheKey(uid), JSON.stringify(templates));
  } catch {
    /* storage full / disabled — non-fatal, Firestore still has it */
  }
}

function col(uid: string) {
  if (!db) throw new Error("Database not available.");
  return collection(db, "users", uid, "templates");
}

export async function listTemplates(uid: string): Promise<MyTemplate[]> {
  if (!db) return readCache(uid);
  const snap = await getDocs(query(col(uid), orderBy("updatedAt", "desc")));
  const templates: MyTemplate[] = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name || "Untitled template",
      layout: data.layout as TemplateId,
      theme: data.theme as Theme,
      updatedAt: data.updatedAt?.toMillis?.() ?? 0,
    };
  });
  writeCache(uid, templates);
  return templates;
}

export async function createTemplate(uid: string, name: string, layout: TemplateId, theme: Theme): Promise<string> {
  if (!db) {
    const id = `local-${Date.now()}`;
    writeCache(uid, [{ id, name, layout, theme, updatedAt: Date.now() }, ...readCache(uid)]);
    return id;
  }
  const ref = await addDoc(col(uid), {
    name,
    layout,
    theme,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function renameTemplate(uid: string, id: string, name: string): Promise<void> {
  writeCache(uid, readCache(uid).map((t) => (t.id === id ? { ...t, name } : t)));
  if (db) await updateDoc(doc(db, "users", uid, "templates", id), { name, updatedAt: serverTimestamp() });
}

export async function deleteTemplate(uid: string, id: string): Promise<void> {
  writeCache(uid, readCache(uid).filter((t) => t.id !== id));
  if (db) await deleteDoc(doc(db, "users", uid, "templates", id));
}
