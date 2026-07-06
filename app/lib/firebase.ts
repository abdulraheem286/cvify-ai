import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";

// Public web config (safe to ship to the browser — these identify the project,
// they are NOT secrets; security is enforced by Firestore rules + authorized
// domains). Env vars override if set.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDi7lhNK85DKHyaViLX3RP0KFTQrmw25hw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cvify-ai-286.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cvify-ai-286",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cvify-ai-286.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1081775926061",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1081775926061:web:e25e4ed4100d8a8d75c1a4",
};

// True once the project config is present. Until then, the app runs normally
// (accounts simply aren't active) instead of crashing.
export const firebaseEnabled = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (firebaseEnabled) {
  app = getApps().length ? getApps()[0] : initializeApp(config);
  authInstance = getAuth(app);
  // ignoreUndefinedProperties lets us store objects with optional fields (e.g. a
  // theme where `text`/`density` are unset) without Firestore throwing on
  // `undefined`. Fall back to getFirestore if Firestore was already initialized.
  try {
    dbInstance = initializeFirestore(app, { ignoreUndefinedProperties: true });
  } catch {
    dbInstance = getFirestore(app);
  }
}

export const auth = authInstance;
export const db = dbInstance;
export const googleProvider = new GoogleAuthProvider();
