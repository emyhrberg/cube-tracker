import { useTimes } from "../TimesContext";

function fmt(ms) {
  return (ms / 1000).toFixed(ms < 10000 ? 2 : 1) + " s";
}

export default function Stats() {
  const { entries } = useTimes();
  if (!entries.length) return <p style={{ textAlign: "center" }}>No solves yet.</p>;

  return (
    <div style={{ maxWidth: 520, margin: "24px auto" }}>
      <h2>Solves</h2>
      <ol>
        {entries.map((e, i) => (
          <li key={e.id}>{fmt(e.ms)}</li>
        ))}
      </ol>
    </div>
  );
}
