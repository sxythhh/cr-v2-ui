"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Whether the resolved appearance is dark (accounts for system preference) */
  darkMode: boolean;
  /** Legacy toggle for backwards compat */
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  setMode: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === "system") return getSystemDark();
  return mode === "dark";
}

function applyTheme(isDark: boolean) {
  // Disable all transitions during theme switch to prevent flash
  const style = document.createElement("style");
  style.textContent = "*, *::before, *::after { transition: none !important; }";
  document.head.appendChild(style);

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Re-enable transitions after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.head.removeChild(style);
    });
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [darkMode, setDarkMode] = useState(false);

  // Initialise from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode | null;
    const initial: ThemeMode = stored === "dark" || stored === "system" ? stored : "light";
    setModeState(initial);
    const isDark = resolveIsDark(initial);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  // Sync when external code (e.g. nav bar toggle) changes theme
  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem("theme") as ThemeMode | null;
      const next: ThemeMode = stored === "dark" || stored === "system" ? stored : "light";
      setModeState(next);
      setDarkMode(resolveIsDark(next));
    };
    window.addEventListener("theme-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("theme-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Listen for system preference changes when in system mode
  useEffect(() => {
    if (mode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
      applyTheme(e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    localStorage.setItem("theme", next);
    const isDark = resolveIsDark(next);
    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setMode(darkMode ? "light" : "dark");
  }, [darkMode, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
