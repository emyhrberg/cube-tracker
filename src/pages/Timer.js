import { useEffect, useRef, useState } from "react";
import { useTimes } from "../TimesContext";

function fmt(ms) {
  return (ms / 1000).toFixed(ms < 10000 ? 2 : 1); // 2dp under 10s, else 1dp
}

export default function Timer() {
  const { addEntry } = useTimes();
  const [armed, setArmed] = useState(false);      // holding space
  const [timing, setTiming] = useState(false);    // actively timing
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  // Update loop while timing
  useEffect(() => {
    if (!timing) return;
    const tick = () => {
      setElapsed(Date.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [timing]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code !== "Space" || e.repeat) return;
      e.preventDefault();
      if (timing) {
        // stop & save
        setTiming(false);
        const final = Date.now() - startRef.current;
        setElapsed(final);
        addEntry(final);
      } else {
        // arm
        setArmed(true);
      }
    };

    const onKeyUp = (e) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (armed && !timing) {
        // start on release
        setArmed(false);
        startRef.current = Date.now();
        setElapsed(0);
        setTiming(true);
      } else {
        setArmed(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [armed, timing, addEntry]);

  const bg = armed ? "#16a34a22" : timing ? "#0ea5e922" : "transparent";

  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <div
        style={{
          margin: "0 auto",
          maxWidth: 480,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "3rem 1rem",
          background: bg,
          userSelect: "none",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 500 }}>
          {fmt(elapsed)}<span style={{ fontSize: 24 }}> s</span>
        </div>
        <div style={{ opacity: 0.6, marginTop: 8 }}>
          {timing ? "Press Space to stop" : armed ? "Release Space to start" : "Hold Space to begin"}
        </div>
      </div>
    </div>
  );
}
