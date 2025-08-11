import { randomScrambleForEvent } from "cubing/scramble";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTimes } from "../TimesContext";
import { useSettings } from "../SettingsContext";

function fmt(ms) {
  return (ms / 1000).toFixed(ms < 10000 ? 2 : 1);
}

export default function Timer() {
  const { addEntry } = useTimes();
  const { scrambleLength, scrambleFontSize } = useSettings();

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
    const onKeyUp = (e) => {
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
          addEntry(Math.round(final), scramble);
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
  }, [armed, timing, scramble, addEntry, newScramble]);

  const bg = armed ? "#16a34a22" : timing ? "#0ea5e922" : "transparent";

  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
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
        <div style={{ fontSize: 64, fontWeight: 600, color: "#fff" }}>
          {fmt(elapsed)}
          <span style={{ fontSize: 24, opacity: 0.6 }}> s</span>
        </div>
        <div style={{ opacity: 0.7, marginTop: 8, color: "#d0d0d0" }}>
          {timing ? "Press Space to stop" : armed ? "Release Space to start" : "Hold Space to begin"}
        </div>
      </div>
    </div>
  );
}
