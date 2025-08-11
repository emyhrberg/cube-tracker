import { useMemo, useState } from "react";
import { useSettings } from "../SettingsContext";
import { useTimes } from "../TimesContext";

function fmtTime(ms, showMs) {
  const sec = ms / 1000;
  const text = showMs ? sec.toFixed(ms < 10000 ? 2 : 1) : sec.toFixed(0);
  return text + " s";
}

const FILTER_LABELS = {
  "10m": "10 minutes",
  "30m": "30 minutes",
  "1h": "Hour",
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
};

function formatDate(ts, mode) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  if (mode === "iso-date") return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  if (mode === "iso-datetime")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  if (mode === "locale-date") return d.toLocaleDateString();
  if (mode === "locale-datetime") return d.toLocaleString();
  return d.toLocaleString();
}

export default function Stats() {
  const { entries, deleteEntry } = useTimes();
  const { dateFormat, showMilliseconds } = useSettings();

  const [localFilter, setLocalFilter] = useState("today");
  const [localSort, setLocalSort] = useState("date");

  const filtered = useMemo(() => {
    const now = Date.now();
    const from = (() => {
      switch (localFilter) {
        case "10m":
          return now - 10 * 60 * 1000;
        case "30m":
          return now - 30 * 60 * 1000;
        case "1h":
          return now - 60 * 60 * 1000;
        case "today": {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }
        case "week":
          return now - 7 * 24 * 60 * 60 * 1000;
        case "month":
          return now - 30 * 24 * 60 * 60 * 1000;
        case "year":
          return now - 365 * 24 * 60 * 60 * 1000;
        default:
          return 0;
      }
    })();
    return entries.filter((e) => e.id >= from);
  }, [entries, localFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (localSort === "fastest") arr.sort((a, b) => a.ms - b.ms);
    else arr.sort((a, b) => b.id - a.id);
    return arr;
  }, [filtered, localSort]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "80vh", paddingTop: "2rem" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <label style={{ color: "#fff" }}>
          Filter time:
          <select
            value={localFilter}
            onChange={(e) => setLocalFilter(e.target.value)}
            style={{ marginLeft: 8, background: "#fff", color: "#111", borderRadius: 6, padding: "4px 6px", border: "1px solid #cbd5e1" }}
          >
            {Object.entries(FILTER_LABELS).map(([v, label]) => (
              <option key={v} value={v}>{label}</option>
            ))}
          </select>
        </label>
        <label style={{ color: "#fff" }}>
          Sort by:
          <select
            value={localSort}
            onChange={(e) => setLocalSort(e.target.value)}
            style={{ marginLeft: 8, background: "#fff", color: "#111", borderRadius: 6, padding: "4px 6px", border: "1px solid #cbd5e1" }}
          >
            <option value="date">Date</option>
            <option value="fastest">Speed</option>
          </select>
        </label>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "1rem", color: "#fff" }}>No solves in this range.</div>
      ) : (
        <table style={{ borderCollapse: "collapse", minWidth: "80%", maxWidth: 1000, fontFamily: "sans-serif", fontSize: 14, color: "#fff" }}>
          <thead>
            <tr style={{ background: "#f97316" }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Scramble</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e, idx) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #444" }}>
                <td style={tdStyle}>{sorted.length - idx}</td>
                <td style={tdStyle}>{fmtTime(e.ms, showMilliseconds)}</td>
                <td style={tdStyle}>{formatDate(e.id, dateFormat)}</td>
                <td style={{ ...tdStyle, fontFamily: "monospace", whiteSpace: "pre-wrap", maxWidth: 250 }}>{e.scramble}</td>
                <td style={tdStyle}>
                  <button onClick={() => deleteEntry(e.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#f87171", fontSize: 16 }} title="Delete solve">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = { textAlign: "left", padding: "8px 12px", borderBottom: "2px solid #d97706", color: "#fff" };
const tdStyle = { padding: "6px 12px" };
