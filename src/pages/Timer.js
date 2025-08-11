import { randomScrambleForEvent } from "cubing/scramble";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "../SettingsContext";
import { useTimes } from "../TimesContext";
import { useToasts } from "../ToastContext";

function fmt(ms, showMs) {
  const seconds = ms / 1000;
  if (!showMs) return seconds.toFixed(0);
  return seconds.toFixed(ms < 10000 ? 2 : 1);
}

export default function Timer() {
  const { addEntry, entries, updateEntry } = useTimes();
  const { push } = useToasts();
  const { scrambleLength, scrambleFontSize, timerFontSize, showMilliseconds } = useSettings();

  const [armed, setArmed] = useState(false);
  const [timing, setTiming] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [scramble, setScramble] = useState("");
  const startRef = useRef(0);
  const rafRef = useRef(0);

  const newScramble = useCallback(async () => {
    try {
      const scr = await randomScrambleForEvent("333");
      let text = scr.toString();
      if (scrambleLength && Number.isFinite(scrambleLength)) {
        const parts = text.split(/\s+/).filter(Boolean);
        if (parts.length > scrambleLength) text = parts.slice(0, scrambleLength).join(" ");
      }
      setScramble(text);
    } catch (e) {
      console.warn("Failed to get scramble", e);
      setScramble("");
    }
  }, [scrambleLength]);

  useEffect(() => {
    newScramble();
  }, [newScramble]);

  // update loop while timing
  useEffect(() => {
    if (!timing) return;
    const tick = () => {
      setElapsed(performance.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [timing]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!timing) setArmed(true);
      }
    };
  const onKeyUp = async (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!timing && armed) {
          // start
          setArmed(false);
          setTiming(true);
          startRef.current = performance.now();
          setElapsed(0);
        } else if (timing) {
          // stop
          setTiming(false);
          cancelAnimationFrame(rafRef.current);
          const final = performance.now() - startRef.current;
          setElapsed(final);
          const res = await addEntry(Math.round(final), scramble);
          if (!res?.ok) {
            push("Saved locally (offline) — Firestore write failed.", "error");
          }
          newScramble();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [armed, timing, scramble, addEntry, newScramble, push]);

  const bg = armed ? "#16a34a22" : timing ? "#0ea5e922" : "transparent";

  const [selected, setSelected] = useState(null); // selected entry for modal

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16, alignItems: "start", marginTop: 24 }}>
      {/* Left: solves list */}
    <div style={{ border: "1px solid #2c3440", borderRadius: 10, padding: 8, maxHeight: 600, overflowY: "auto" }}>
        <div style={{ fontWeight: 600, color: "#fff", padding: "6px 8px", borderBottom: "1px solid #2c3440" }}>Solves</div>
        {entries.length === 0 ? (
          <div style={{ padding: 10, color: "#999" }}>No solves yet.</div>
        ) : (
      <ul className="solves-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {entries.map((e) => (
              <li key={(e.docId || e.id)}>
                <button
          className="solve-item-btn"
                  onClick={() => setSelected(e)}
                  style={{
                    display: "flex",
                    width: "100%",
                    textAlign: "left",
                    gap: 8,
                    padding: "8px 10px",
                    border: "none",
                    background: "transparent",
                    color: "#ddd",
                    cursor: "pointer",
                    borderBottom: "1px solid #2c3440",
                  }}
                >
                  <span style={{ minWidth: 62, fontWeight: 600, color: "#fff" }}>{fmt(e.ms, showMilliseconds)}s</span>
                  <span style={{ opacity: 0.7 }}>{new Date(e.id).toLocaleString()}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right: main timer UI (scramble on top, timer below) */}
      <div style={{ gridColumn: "2 / 3", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Scramble bar */}
        <div
          onClick={newScramble}
          title="Click to generate a new scramble"
          style={{
            userSelect: "none",
            cursor: "pointer",
            margin: "0 auto 12px",
            maxWidth: 720,
            padding: "12px 16px",
            border: "1px solid #2c3440",
            borderRadius: 10,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: scrambleFontSize,
            lineHeight: 1.4,
            color: "#d0d0d0",
          }}
        >
          {scramble || "Loading..."}
        </div>

        {/* Timer pad */}
        <div
          style={{
            margin: "0 auto",
            maxWidth: 480,
            border: "1px solid #2c3440",
            borderRadius: 12,
            padding: "3rem 1rem",
            background: bg,
            userSelect: "none",
          }}
        >
          <div style={{ fontSize: timerFontSize, fontWeight: 600, color: "#fff" }}>
            {fmt(elapsed, showMilliseconds)}
            <span style={{ fontSize: 24, opacity: 0.6 }}> s</span>
          </div>
          <div style={{ opacity: 0.7, marginTop: 8, color: "#d0d0d0" }}>
            {timing ? "Press Space to stop" : armed ? "Release Space to start" : "Hold Space to begin"}
          </div>
        </div>
      </div>

      {/* Solve detail modal */}
      {selected && (
        <SolveModal
          entry={selected}
          onClose={() => setSelected(null)}
          onSave={async (comment) => {
            const res = await updateEntry(selected.docId || selected.id, { comment });
            if (!res?.ok) {
              push("Saved locally — Firestore update failed.", "error");
            } else if (res.local) {
              push("Comment saved locally (offline).", "error");
            } else {
              push("Comment saved.", "success");
            }
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

function SolveModal({ entry, onClose, onSave }) {
  const [comment, setComment] = useState(entry.comment || "");
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "grid", placeItems: "center", zIndex: 1100, padding: 16 }}
      role="dialog"
      aria-modal
    >
      <div style={{ width: 560, maxWidth: "100%", background: "#111827", color: "#fff", borderRadius: 10, border: "1px solid #2c3440", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        <div style={{ padding: 14, borderBottom: "1px solid #2c3440" }}>
          <h3 style={{ margin: 0 }}>Solve details</h3>
        </div>
        <div style={{ padding: 16, display: "grid", gap: 10 }}>
          <DetailRow label="Time">{fmt(entry.ms)} s</DetailRow>
          <DetailRow label="Date">{new Date(entry.id).toLocaleString()}</DetailRow>
          <DetailRow label="Scramble"><span style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{entry.scramble}</span></DetailRow>
          <div>
            <div style={{ marginBottom: 6, opacity: 0.85 }}>Comment</div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              style={{ width: "100%", background: "#fff", color: "#111", borderRadius: 8, padding: 10, border: "1px solid #cbd5e1" }}
              placeholder="Add thoughts about this solve..."
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: 12, borderTop: "1px solid #2c3440", background: "rgba(0,0,0,0.15)" }}>
          <button onClick={onClose} style={btnSecondary}>Close</button>
          <button onClick={() => onSave(comment)} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8, alignItems: "start" }}>
      <div style={{ opacity: 0.8 }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

const btnPrimary = { background: "#22c55e", color: "#052e16", border: "1px solid #14532d", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600 };
const btnSecondary = { background: "transparent", color: "#fff", border: "1px solid #475569", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600 };
