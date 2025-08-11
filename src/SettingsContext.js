import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SettingsCtx = createContext(null);

export function SettingsProvider({ children }) {
  const [scrambleLength, setScrambleLength] = useState(25);
  const [scrambleFontSize, setScrambleFontSize] = useState(18);
  const [timerFontSize, setTimerFontSize] = useState(64);
  const [dateFormat, setDateFormat] = useState("iso-date");
  const [filterRange, setFilterRange] = useState("today");
  const [sortBy, setSortBy] = useState("date");
  const [showMilliseconds, setShowMilliseconds] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("settings") || "{}");
      if (typeof saved.scrambleLength === "number") setScrambleLength(saved.scrambleLength);
      if (typeof saved.scrambleFontSize === "number") setScrambleFontSize(saved.scrambleFontSize);
  if (typeof saved.timerFontSize === "number") setTimerFontSize(saved.timerFontSize);
      if (typeof saved.dateFormat === "string") setDateFormat(saved.dateFormat);
      if (typeof saved.filterRange === "string") setFilterRange(saved.filterRange);
      if (typeof saved.sortBy === "string") setSortBy(saved.sortBy);
  if (typeof saved.showMilliseconds === "boolean") setShowMilliseconds(saved.showMilliseconds);
    } catch (err) {
      console.warn("Failed to parse settings from localStorage:", err);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "settings",
    JSON.stringify({ scrambleLength, scrambleFontSize, timerFontSize, dateFormat, filterRange, sortBy, showMilliseconds })
      );
    } catch (err) {
      console.warn("Failed to save settings:", err);
    }
  }, [scrambleLength, scrambleFontSize, timerFontSize, dateFormat, filterRange, sortBy, showMilliseconds]);

  const value = useMemo(() => ({
    scrambleLength, setScrambleLength,
    scrambleFontSize, setScrambleFontSize,
    timerFontSize, setTimerFontSize,
    dateFormat, setDateFormat,
    filterRange, setFilterRange,
    sortBy, setSortBy,
    showMilliseconds, setShowMilliseconds,
  }), [scrambleLength, scrambleFontSize, timerFontSize, dateFormat, filterRange, sortBy, showMilliseconds]);

  return (
    <SettingsCtx.Provider value={value}>
      {children}
    </SettingsCtx.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsCtx);
}
