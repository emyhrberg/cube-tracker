import { addDoc, auth, collection, db, serverTimestamp } from "./firebase";

// Save a solve
export async function saveSolveTime(timeMs, scramble) {
  if (!auth.currentUser) {
    throw new Error("Must be signed in to save times");
  }
  return addDoc(collection(db, "times"), {
    uid: auth.currentUser.uid,
    displayName: auth.currentUser.displayName || null,
    timeMs,
    scramble,
    createdAt: serverTimestamp()
  });
}
