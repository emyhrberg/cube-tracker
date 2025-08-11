import { useEffect, useRef, useState } from "react";
import { useSettings } from "../SettingsContext";

export default function SettingsModal({ onClose }) {
  const [tab, setTab] = useState("general");
  const {
    scrambleLength,
    setScrambleLength,
    scrambleFontSize,
    setScrambleFontSize,
    dateFormat,
    setDateFormat,
  } = useSettings();

  // Snapshot to support Discard
  const initialRef = useRef({ scrambleLength, scrambleFontSize, dateFormat });

  useEffect(() => {
    // Save snapshot only once when modal mounts
    initialRef.current = { scrambleLength, scrambleFontSize, dateFormat };
    // Close on Esc with discard
    const onKey = (e) => {
      if (e.key === "Escape") {
        discardAndClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next) => {
    // Live update context
    if (typeof next.scrambleLength === "number") setScrambleLength(next.scrambleLength);
    if (typeof next.scrambleFontSize === "number") setScrambleFontSize(next.scrambleFontSize);
    if (typeof next.dateFormat === "string") setDateFormat(next.dateFormat);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) discardAndClose();
  };

  const reset = () => {
    apply({ scrambleLength: 25, scrambleFontSize: 18, dateFormat: "locale" });
  };

  const discardAndClose = () => {
    const snap = initialRef.current;
    apply(snap);
    onClose?.();
  };

  const saveAndClose = () => {
    // Already applied live; simply close.
    onClose?.();
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 16,
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        style={{
          width: "min(680px, 100%)",
          maxHeight: "min(80vh, 800px)",
          background: "rgba(17, 24, 39, 0.88)", // translucent panel
          color: "#fff",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          display: "flex",
          overflow: "hidden",
          backdropFilter: "blur(8px)",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Settings</h2>
        </div>

        <div style={{ display: "flex", minHeight: 260 }}>
          {/* Left tabs */}
          <div style={{ width: 140, borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            <Tab label="General" active={tab === "general"} onClick={() => setTab("general")} />
            <Tab label="Display" active={tab === "display"} onClick={() => setTab("display")} />
          </div>

          {/* Right content */}
          <div style={{ flex: 1, padding: 16, overflow: "auto", display: "grid", gap: 16 }}>
            {tab === "general" && (
              <>
                <h3 style={{ margin: 0, fontSize: 16 }}>General</h3>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>Scramble length</span>
                  <input
                    type="number"
                    value={scrambleLength}
                    min={10}
                    max={40}
                    onChange={(e) => apply({ scrambleLength: Number(e.target.value) })}
                    style={inputStyle}
                  />
                  <span>moves</span>
                </label>
              </>
            )}

            {tab === "display" && (
              <>
                <h3 style={{ margin: 0, fontSize: 16 }}>Display</h3>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>Scramble font size</span>
                  <input
                    type="number"
                    value={scrambleFontSize}
                    min={10}
                    max={40}
                    onChange={(e) => apply({ scrambleFontSize: Number(e.target.value) })}
                    style={inputStyle}
                  />
                  <span>px</span>
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                  <span>Date format</span>
                  <select
                    value={dateFormat}
                    onChange={(e) => apply({ dateFormat: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="locale">Locale</option>
                    <option value="iso">ISO (YYYY-MM-DD)</option>
                    <option value="us">US (MM/DD/YYYY)</option>
                  </select>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            padding: 12,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.15)",
            position: "sticky",
            bottom: 0,
          }}
        >
          <button onClick={reset} style={btnGhost}>Reset</button>
          <div style={{ flex: 1 }} />
          <button onClick={discardAndClose} style={btnSecondary}>Discard</button>
          <button onClick={saveAndClose} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        background: active ? "rgba(255,255,255,0.12)" : "transparent",
        color: "#fff",
        border: "none",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 8,
  padding: "8px 10px",
};

const baseBtn = {
  borderRadius: 8,
  padding: "10px 14px",
  fontWeight: 600,
  border: "1px solid transparent",
  cursor: "pointer",
};

const btnPrimary = {
  ...baseBtn,
  background: "linear-gradient(180deg,#22c55e,#16a34a)",
  color: "#051b0c",
  borderColor: "rgba(0,0,0,0.2)",
};

const btnSecondary = {
  ...baseBtn,
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  borderColor: "rgba(255,255,255,0.2)",
};

const btnGhost = {
  ...baseBtn,
  background: "transparent",
  color: "rgba(255,255,255,0.8)",
  borderColor: "rgba(255,255,255,0.2)",
};
