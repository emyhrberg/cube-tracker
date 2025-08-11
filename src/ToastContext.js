import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]); // {id, message, type}
  const idRef = useRef(1);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((message, type = "info", timeout = 3500) => {
    const id = idRef.current++;
    setToasts((t) => [...t, { id, message, type }]);
    if (timeout > 0) {
      setTimeout(() => remove(id), timeout);
    }
    return id;
  }, [remove]);

  const value = useMemo(() => ({ push, remove, toasts }), [push, remove, toasts]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
    </ToastCtx.Provider>
  );
}

export function useToasts() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("Wrap your app with <ToastProvider>");
  return ctx;
}

export function ToastViewport() {
  const { toasts, remove } = useToasts();
  return (
    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 2000, display: "grid", gap: 8 }} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} role="status" style={{
          minWidth: 260,
          maxWidth: 360,
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.1)",
          background: t.type === "error" ? "#7f1d1d" : t.type === "success" ? "#064e3b" : "#1f2937",
          color: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{ opacity: 0.9 }}>{t.message}</span>
          <button onClick={() => remove(t.id)} style={{ marginLeft: "auto", background: "transparent", border: 0, color: "#fff", cursor: "pointer" }}>×</button>
        </div>
      ))}
    </div>
  );
}
