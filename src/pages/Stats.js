import { useState } from "react";
import { useTimes } from "../TimesContext";

function fmtTime(ms) {
  return (ms / 1000).toFixed(ms < 10000 ? 2 : 1) + " s";
}

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

const FILTERS = ["Today", "Week", "Month", "Year", "All"];

export default function Stats() {
  const { entries, deleteEntry } = useTimes();
  const [filter, setFilter] = useState("All");

  if (!entries.length) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem", color: "#fff" }}>
        <p>No solves yet.</p>
      </div>
    );
  }

  const now = new Date();
  const filtered = entries.filter((e) => {
    const date = new Date(e.id);
    switch (filter) {
      case "Today":
        return date.toDateString() === now.toDateString();
      case "Week": {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return date >= oneWeekAgo;
      }
      case "Month": {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return date >= oneMonthAgo;
      }
      case "Year": {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return date >= oneYearAgo;
      }
      default:
        return true;
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "80vh",
        paddingTop: "2rem",
      }}
    >
      {/* Filter Tabs */}
      <div style={{ marginBottom: "1rem" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: f === filter ? "#f97316" : "transparent",
              color: f === filter ? "#fff" : "#f97316",
              border: "1px solid #f97316",
              borderRadius: "6px",
              padding: "4px 10px",
              marginRight: "6px",
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <table
        style={{
          borderCollapse: "collapse",
          minWidth: "80%",
          maxWidth: "1000px",
          fontFamily: "sans-serif",
          fontSize: "14px",
          color: "#fff",
        }}
      >
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
          {filtered.map((e, idx) => (
            <tr key={e.id} style={{ borderBottom: "1px solid #444" }}>
              <td style={tdStyle}>{filtered.length - idx}</td>
              <td style={tdStyle}>{fmtTime(e.ms)}</td>
              <td style={tdStyle}>{fmtDate(e.id)}</td>
              <td
                style={{
                  ...tdStyle,
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  maxWidth: "250px",
                }}
              >
                {e.scramble}
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => deleteEntry(e.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#f87171", // light red
                    fontSize: "16px",
                  }}
                  title="Delete solve"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "8px 12px",
  borderBottom: "2px solid #d97706",
  color: "#fff",
};

const tdStyle = {
  padding: "6px 12px",
};
