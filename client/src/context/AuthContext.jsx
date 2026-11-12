import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signOut, sendEmailVerification, sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let requestId = 0;
    const unsubscribe = onAuthStateChanged(auth, async (current) => {
      const currentRequestId = ++requestId;
      setUser(current);
      setLoading(false);

      if (!current) {
        setIsAdmin(false);
        setProfileLoading(false);
        setProfileError("");
        return;
      }

      setIsAdmin(false);
      setProfileError("");
      setProfileLoading(true);
      try {
        // Ask the server who this is — admin rights are decided server-side only.
        const res = await apiRequest("/users/me");
        if (currentRequestId !== requestId || auth.currentUser?.uid !== current.uid) return;
        setIsAdmin(Boolean(res.isAdmin));
      } catch (error) {
        if (currentRequestId !== requestId || auth.currentUser?.uid !== current.uid) return;
        setIsAdmin(false);
        setProfileError(error.message);
      } finally {
        if (currentRequestId === requestId && auth.currentUser?.uid === current.uid) {
          setProfileLoading(false);
        }
      }
    });

    return () => {
      requestId++;
      unsubscribe();
    };
  }, []);

  const register = useCallback(async (email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(credential.user);
    return credential.user;
  }, []);

  const value = useMemo(() => ({
    user, loading, isAdmin, profileLoading, profileError, register,
    login: async (email, password) => (await signInWithEmailAndPassword(auth, email, password)).user,
    loginWithGoogle: async () => (await signInWithPopup(auth, googleProvider)).user,
    logout: () => signOut(auth),
    resetPassword: (email) => sendPasswordResetEmail(auth, email)
  }), [user, loading, isAdmin, profileLoading, profileError, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
