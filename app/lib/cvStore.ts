import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { EditorForm } from "@/app/components/CvEditor";
import type { TemplateId, Theme } from "@/app/templates";

// Everything needed to fully restore a CV in the editor.
export type CvData = {
  form: EditorForm;
  template: TemplateId;
  theme: Theme;
  hidden: Record<string, boolean>;
};
export type CvMeta = { id: string; title: string; updatedAt: number };
export type CvRecord = CvMeta & { data: CvData };

function cvsCol(uid: string) {
  if (!db) throw new Error("Database not available.");
  return collection(db, "users", uid, "cvs");
}

export async function listCvs(uid: string): Promise<CvRecord[]> {
  const snap = await getDocs(query(cvsCol(uid), orderBy("updatedAt", "desc")));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title || "Untitled CV",
      updatedAt: data.updatedAt?.toMillis?.() ?? 0,
      data: data.data as CvData,
    };
  });
}

export async function getCv(uid: string, id: string): Promise<CvRecord | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid, "cvs", id));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { id: snap.id, title: d.title || "Untitled CV", updatedAt: d.updatedAt?.toMillis?.() ?? 0, data: d.data as CvData };
}

export async function createCv(uid: string, title: string, data: CvData): Promise<string> {
  const ref = await addDoc(cvsCol(uid), {
    title,
    data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function saveCv(uid: string, id: string, title: string, data: CvData): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "users", uid, "cvs", id), { title, data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function renameCv(uid: string, id: string, title: string): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "users", uid, "cvs", id), { title, updatedAt: serverTimestamp() });
}

export async function deleteCv(uid: string, id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "users", uid, "cvs", id));
}

export async function duplicateCv(uid: string, id: string): Promise<string | null> {
  const cv = await getCv(uid, id);
  if (!cv) return null;
  return createCv(uid, `${cv.title} (copy)`, cv.data);
}
