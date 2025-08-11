import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
    addDoc,
    auth,
    collection,
    db,
    deleteDoc,
    doc,
    onAuthStateChanged,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "./firebase";

const TimesCtx = createContext(null);

export function TimesProvider({ children }) {
  const [entries, setEntries] = useState([]); // {id (timestamp), ms, scramble, comment?, docId?}
  const unsubRef = useRef(null);

  // Subscribe to Firestore solves when signed in
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      // cleanup previous
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
      if (!u) {
        setEntries([]);
        return;
      }
    const q = query(collection(db, `users/${u.uid}/solves`), orderBy("createdAt", "desc"));
      const unsubSolves = onSnapshot(q, (snap) => {
        const arr = snap.docs.map((d) => {
          const data = d.data() || {};
          const createdAtMs = data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now();
          const ms = typeof data.timeMs === "number" ? data.timeMs : data.ms;
      return { id: createdAtMs, ms, scramble: data.scramble || "", comment: data.comment || "", docId: d.id };
        });
        setEntries(arr);
      });
      unsubRef.current = unsubSolves;
    });
    return () => {
      if (unsubRef.current) unsubRef.current();
      unsubAuth();
    };
  }, []);

  const addEntry = async (ms, scramble) => {
    const u = auth.currentUser;
    if (!u) {
      // Local-only when signed out
      setEntries((e) => [{ id: Date.now(), ms, scramble, comment: "" }, ...e]);
      return { ok: true, local: true };
    }
    try {
      await addDoc(collection(db, `users/${u.uid}/solves`), {
        timeMs: ms,
        scramble,
        createdAt: serverTimestamp(),
      });
      // onSnapshot will refresh entries; no local mutation needed
      return { ok: true };
    } catch (err) {
      console.error("Failed to save solve to Firestore:", err);
      // Fallback to local insert if write fails
      setEntries((e) => [{ id: Date.now(), ms, scramble, comment: "" }, ...e]);
      return { ok: false, error: err };
    }
  };

  const deleteEntry = async (idOrDocId) => {
    setEntries((prev) => {
      const entry = prev.find((e) => e.id === idOrDocId || e.docId === idOrDocId);
      // Firestore delete if possible
      const u = auth.currentUser;
      if (entry?.docId && u) {
        deleteDoc(doc(db, `users/${u.uid}/solves/${entry.docId}`)).catch((e) =>
          console.error("Failed to delete solve:", e)
        );
      }
      return prev.filter((e) => e.id !== idOrDocId && e.docId !== idOrDocId);
    });
  };

  const updateEntry = async (idOrDocId, updates) => {
    const u = auth.currentUser;
    // Update Firestore if possible
    if (u) {
      const entry = entries.find((e) => e.id === idOrDocId || e.docId === idOrDocId);
      if (entry?.docId) {
        try {
          // lazy import to avoid pulling heavy update in top import; but we can use set from doc
          await import("firebase/firestore").then(async (m) => {
            const { updateDoc } = m;
            await updateDoc(doc(db, `users/${u.uid}/solves/${entry.docId}`), updates);
          });
          return { ok: true };
        } catch (err) {
          console.error("Failed to update solve:", err);
          // continue to local update
        }
      }
    }
    // Local update
    setEntries((prev) => prev.map((e) => (e.id === idOrDocId || e.docId === idOrDocId ? { ...e, ...updates } : e)));
    return { ok: true, local: true };
  };

  return (
  <TimesCtx.Provider value={{ entries, addEntry, deleteEntry, updateEntry }}>
      {children}
    </TimesCtx.Provider>
  );
}

export function useTimes() {
  const ctx = useContext(TimesCtx);
  if (!ctx) throw new Error("Wrap your app with <TimesProvider>");
  return ctx;
}
