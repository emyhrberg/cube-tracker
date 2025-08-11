import { useEffect, useState } from "react";
import { auth, logOut, onAuthStateChanged, signInWithGoogle } from "../firebase"; // modular API usage
import { useToasts } from "../ToastContext";

function GoogleButton({ onClick, variant = "light" }) {
  const isDark = variant === "dark";
  return (
    <button
      onClick={onClick}
      aria-label="Sign in with Google"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 24,
        border: isDark ? "1px solid #2f2f2f" : "1px solid #dadce0",
        background: isDark ? "#202124" : "#fff",
        color: isDark ? "#fff" : "#3c4043",
        fontWeight: 500,
        fontSize: 15,
        cursor: "pointer",
        boxShadow: isDark ? "none" : "0 1px 2px rgba(60,64,67,.3)",
      }}
      onMouseDown={(e) => e.preventDefault()} // prevent focus jiggle
    >
      {/* Google "G" SVG per brand guidelines */}
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path fill="#EA4335" d="M9 3.48a5.52 5.52 0 0 1 3.89 1.52l2.6-2.6A9 9 0 1 0 9 18c4.86 0 8.7-3.43 8.7-8.2 0-.55-.05-1.09-.15-1.6H9v3.12h5.6A4.78 4.78 0 0 1 9 14.26 5.26 5.26 0 1 1 9 3.48z"/>
      </svg>
      <span>Sign in with Google</span>
    </button>
  );
}

export default function LogIn() {
  const [user, setUser] = useState(null);
  const { push } = useToasts();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
      {!user ? (
        <div style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: 16 }}>Log in</h1>
          <GoogleButton
            onClick={async () => {
              const res = await signInWithGoogle();
              if (!res?.ok && res?.error) {
                const msg = res.error?.code === "auth/unauthorized-domain"
                  ? "This domain isn't authorized for Google sign-in. See README for setup."
                  : res.error.message || "Sign-in failed.";
                push(msg, "error");
              }
            }}
            variant="light"
          />
          {/* use variant="dark" if your page background is black */}
          <p style={{ marginTop: 12, opacity: 0.7, fontSize: 12 }}>
            By continuing you agree to the Terms & Privacy Policy.
          </p>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <img
            src={user.photoURL || ""}
            alt=""
            width="64"
            height="64"
            style={{ borderRadius: "50%", display: "block", margin: "0 auto 10px" }}
          />
          <h2 style={{ margin: 0 }}>{user.displayName || user.email}</h2>
          <p style={{ opacity: 0.7 }}>{user.email}</p>
          <button
            onClick={logOut}
            style={{
              marginTop: 12,
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #f97316",
              background: "transparent",
              color: "#f97316",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
