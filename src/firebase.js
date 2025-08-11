import { initializeApp } from "firebase/app";
import {
    getAuth,
    getRedirectResult,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    signOut
} from "firebase/auth";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbfw-LFcNKTHpAFowX_OmJzF8easupxpA",
  authDomain: "cube-tracker-8cc69.firebaseapp.com",
  projectId: "cube-tracker-8cc69",
  storageBucket: "cube-tracker-8cc69.firebasestorage.app",
  messagingSenderId: "891553768709",
  appId: "1:891553768709:web:f36d9fab8ab7449577c36c",
  measurementId: "G-184FGCZL0R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export async function signInWithGoogle() {
  try {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // Use redirect on mobile (popup blockers)
      await signInWithRedirect(auth, googleProvider);
    } else {
      // Use popup on desktop for better UX and fewer storage issues
      await signInWithPopup(auth, googleProvider);
    }
  } catch (err) {
    console.error("Sign-in error:", err);
  }
}

export function handleRedirectResult() {
  return getRedirectResult(auth)
    .then((result) => {
      if (result?.user) {
        console.log("Signed in after redirect:", result.user);
      }
    })
    .catch((err) => {
      // Ignore "missing or invalid pending credential" errors
      if (err.code !== "auth/no-auth-event") {
        console.error("Redirect result error:", err);
      }
    });
}

export const logOut = () => signOut(auth);

export {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onAuthStateChanged,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
};

