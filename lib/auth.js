"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithCustomToken, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, DB } from "./firebaseConfig";

export function useUser() {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let unsubDoc = null;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }

      if (!firebaseUser) {
        setUser(null);
        setHydrated(true);
        return;
      }

      unsubDoc = onSnapshot(
        doc(DB, "users", firebaseUser.uid),
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUser({
              uid: firebaseUser.uid,
              name: data.name,
              phone: data.phone,
              purchasedGrades: data.purchasedGrades || [],
              progress: data.progress || {},
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              name: "Utilisateur",
              phone: "",
              purchasedGrades: [],
              progress: {},
            });
          }
          setHydrated(true);
        },
        (err) => {
          console.error("User doc listener error:", err);
          setHydrated(true);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  return { user, hydrated };
}

export async function completeLogin(customToken) {
  await signInWithCustomToken(auth, customToken);
}

export async function logoutUser() {
  await signOut(auth);
}