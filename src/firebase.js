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

// Firebase config is sourced from environment variables (Create React App requires REACT_APP_ prefix)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
  // Helpful warning during development/build
  // Keys must be provided via .env.local or environment variables
  // See README for setup instructions.
  console.error("Missing Firebase environment variables. Create .env.local with REACT_APP_FIREBASE_* values.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

let signingIn = false;
export async function signInWithGoogle() {
  if (signingIn) return { ok: false, error: new Error("Sign-in already in progress") };
  signingIn = true;
  try {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // Use redirect on mobile (popup blockers)
      await signInWithRedirect(auth, googleProvider);
    } else {
      // Use popup on desktop for better UX and fewer storage issues
      await signInWithPopup(auth, googleProvider);
    }
    return { ok: true };
  } catch (err) {
    console.error("Sign-in error:", err);
    return { ok: false, error: err };
  } finally {
    signingIn = false;
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

