import { createContext, useContext, useEffect, useState } from "react";

const SettingsCtx = createContext(null);

export function SettingsProvider({ children }) {
  const [scrambleLength, setScrambleLength] = useState(25);
  const [scrambleFontSize, setScrambleFontSize] = useState(18);
  const [dateFormat, setDateFormat] = useState("locale");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.scrambleLength) setScrambleLength(parsed.scrambleLength);
      if (parsed.scrambleFontSize) setScrambleFontSize(parsed.scrambleFontSize);
      if (parsed.dateFormat) setDateFormat(parsed.dateFormat);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({ scrambleLength, scrambleFontSize, dateFormat })
    );
  }, [scrambleLength, scrambleFontSize, dateFormat]);

  return (
    <SettingsCtx.Provider
      value={{
        scrambleLength,
        setScrambleLength,
        scrambleFontSize,
        setScrambleFontSize,
        dateFormat,
        setDateFormat,
      }}
    >
      {children}
    </SettingsCtx.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsCtx);
}
