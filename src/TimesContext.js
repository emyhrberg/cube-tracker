import { createContext, useContext, useState } from "react";

const TimesCtx = createContext(null);

export function TimesProvider({ children }) {
  const [entries, setEntries] = useState([]); // {id, ms, scramble}

  const addEntry = (ms, scramble) =>
    setEntries((e) => [{ id: Date.now(), ms, scramble }, ...e]);

  const deleteEntry = (id) =>
    setEntries((e) => e.filter((entry) => entry.id !== id));

  return (
    <TimesCtx.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </TimesCtx.Provider>
  );
}

export function useTimes() {
  const ctx = useContext(TimesCtx);
  if (!ctx) throw new Error("Wrap your app with <TimesProvider>");
  return ctx;
}
