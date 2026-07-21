import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

// Blog likes + comments, stored in Firestore and read/written from the browser.
// Likes: a single count on blogPosts/{slug}. Comments: blogPosts/{slug}/comments.
// These are anonymous (no login) — see firestore.rules for the access rules.

export type BlogComment = { id: string; name: string; text: string; createdAt: number | null };

export async function getLikes(slug: string): Promise<number> {
  if (!db) return 0;
  try {
    const snap = await getDoc(doc(db, "blogPosts", slug));
    return snap.exists() ? Number(snap.data().likes ?? 0) : 0;
  } catch {
    return 0;
  }
}

export async function addLike(slug: string): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "blogPosts", slug), { likes: increment(1) }, { merge: true });
}

export async function listComments(slug: string): Promise<BlogComment[]> {
  if (!db) return [];
  try {
    const col = collection(db, "blogPosts", slug, "comments");
    const snap = await getDocs(query(col, orderBy("createdAt", "desc"), limit(300)));
    return snap.docs.map((d) => {
      const data = d.data();
      return { id: d.id, name: String(data.name ?? ""), text: String(data.text ?? ""), createdAt: data.createdAt?.toMillis?.() ?? null };
    });
  } catch {
    return [];
  }
}

export async function addComment(slug: string, name: string, text: string): Promise<string> {
  if (!db) throw new Error("Comments are unavailable right now.");
  const ref = await addDoc(collection(db, "blogPosts", slug, "comments"), {
    name: name.trim().slice(0, 60),
    text: text.trim().slice(0, 2000),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteComment(slug: string, id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "blogPosts", slug, "comments", id));
}
