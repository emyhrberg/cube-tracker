import { createContext, useContext, useState } from "react";

const TimesCtx = createContext(null);

export function TimesProvider({ children }) {
  const [entries, setEntries] = useState([]); // {id, ms}

  const addEntry = (ms) => setEntries((e) => [{ id: Date.now(), ms }, ...e]);

  return (
    <TimesCtx.Provider value={{ entries, addEntry }}>
      {children}
    </TimesCtx.Provider>
  );
}

export function useTimes() {
  const ctx = useContext(TimesCtx);
  if (!ctx) throw new Error("Wrap your app with <TimesProvider>");
  return ctx;
}
