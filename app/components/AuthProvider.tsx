"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider, firebaseEnabled } from "@/app/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  enabled: boolean;
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function signInGoogle() {
    if (!auth) throw new Error("Accounts aren't available yet.");
    await signInWithPopup(auth, googleProvider);
  }
  async function signInEmail(email: string, password: string) {
    if (!auth) throw new Error("Accounts aren't available yet.");
    await signInWithEmailAndPassword(auth, email, password);
  }
  async function signUpEmail(name: string, email: string, password: string) {
    if (!auth) throw new Error("Accounts aren't available yet.");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    setUser({ ...cred.user });
  }
  async function signOut() {
    if (!auth) return;
    await fbSignOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, enabled: firebaseEnabled, signInGoogle, signInEmail, signUpEmail, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
