import { useCallback, useEffect, useRef } from "react";
import { useSettings } from "../SettingsContext";

export default function SettingsModal({ onClose }) {
  const {
    scrambleLength,
    setScrambleLength,
    scrambleFontSize,
    setScrambleFontSize,
  timerFontSize,
  setTimerFontSize,
    dateFormat,
    setDateFormat,
  showMilliseconds,
  setShowMilliseconds,
  } = useSettings();

  const initialRef = useRef({
    scrambleLength,
    scrambleFontSize,
    timerFontSize,
    dateFormat,
    showMilliseconds,
  });

  const apply = useCallback((next) => {
    if ("scrambleLength" in next) setScrambleLength(Number(next.scrambleLength));
    if ("scrambleFontSize" in next) setScrambleFontSize(Number(next.scrambleFontSize));
    if ("timerFontSize" in next) setTimerFontSize(Number(next.timerFontSize));
    if ("dateFormat" in next) setDateFormat(next.dateFormat);
    if ("showMilliseconds" in next) setShowMilliseconds(Boolean(next.showMilliseconds));
  }, [setScrambleLength, setScrambleFontSize, setTimerFontSize, setDateFormat, setShowMilliseconds]);

  const discardAndClose = useCallback(() => {
    apply(initialRef.current);
    onClose?.();
  }, [apply, onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") discardAndClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [discardAndClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) discardAndClose();
  };

  const reset = () => {
    const defaults = {
      scrambleLength: 25,
      scrambleFontSize: 18,
      timerFontSize: 64,
      dateFormat: "iso-date",
      showMilliseconds: true,
    };
    initialRef.current = defaults; // reset baseline
    apply(defaults);
  };

  const saveAndClose = useCallback(() => {
    initialRef.current = { scrambleLength, scrambleFontSize, timerFontSize, dateFormat, showMilliseconds };
    onClose?.();
  }, [scrambleLength, scrambleFontSize, timerFontSize, dateFormat, showMilliseconds, onClose]);

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
        padding: 16
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        style={{
          width: "min(680px, 100%)",
          maxHeight: "min(80vh, 800px)",
          background: "rgba(17, 24, 39, 0.88)",
          color: "#fff",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          display: "flex",
          overflow: "visible",
          backdropFilter: "blur(8px)",
          flexDirection: "column",
          position: "relative",
          zIndex: 1001
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Settings</h2>
        </div>

  <div style={{ padding: 16, display: "grid", gap: 12, overflowY: "auto" }}>
          <Row label="Date format:">
      <select value={dateFormat} onChange={(e) => apply({ dateFormat: e.target.value })} style={selectStyle}>
              <option value="iso-date">YYYY-MM-DD</option>
              <option value="iso-datetime">YYYY-MM-DD HH:mm:ss</option>
              <option value="locale-date">Locale date</option>
              <option value="locale-datetime">Locale date & time</option>
            </select>
          </Row>

          <Row label="Scramble length:">
      <input type="number" value={scrambleLength} min={10} max={40} onChange={(e) => apply({ scrambleLength: e.target.value })} style={inputStyle} />
          </Row>

          <Row label="Scramble font size:">
      <input type="number" value={scrambleFontSize} min={10} max={40} onChange={(e) => apply({ scrambleFontSize: e.target.value })} style={inputStyle} />
          </Row>

          <Row label="Timer size:">
            <input type="number" value={timerFontSize} min={24} max={160} onChange={(e) => apply({ timerFontSize: e.target.value })} style={inputStyle} />
          </Row>

          <Row label="Show milliseconds:">
            <select value={showMilliseconds ? "yes" : "no"} onChange={(e) => apply({ showMilliseconds: e.target.value === "yes" })} style={selectStyle}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Row>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: 12, borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)" }}>
          <button onClick={reset} style={btnGhost}>Reset</button>
          <div style={{ flex: 1 }} />
          <button onClick={discardAndClose} style={btnSecondary}>Discard</button>
          <button onClick={saveAndClose} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: 12 }}>
      <div style={{ color: "#cbd5e1" }}>{label}</div>
      <div style={{ justifySelf: "end", width: "100%", maxWidth: 260 }}>{children}</div>
    </div>
  );
}

const inputStyle = {
  background: "#ffffff",
  color: "#111111",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "8px 10px",
  width: "100%",
};

const selectStyle = {
  background: "#ffffff",
  color: "#111111",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "8px 10px",
  width: "100%",
  appearance: "auto",
};

const baseBtn = {
  borderRadius: 8,
  padding: "10px 14px",
  fontWeight: 600,
  border: "1px solid transparent",
  cursor: "pointer",
};

const btnPrimary = { ...baseBtn, background: "linear-gradient(180deg,#22c55e,#16a34a)", color: "#051b0c", borderColor: "rgba(0,0,0,0.2)" };
const btnSecondary = { ...baseBtn, background: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.2)" };
const btnGhost = { ...baseBtn, background: "transparent", color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.2)" };
