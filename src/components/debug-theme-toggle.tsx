"use client";

import { useTheme } from "@/components/theme-provider";

export function DebugThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 z-[9999] flex size-10 items-center justify-center rounded-full border border-foreground/[0.06] bg-white text-sm shadow-lg transition-colors hover:bg-gray-50 dark:border-white/[0.06] dark:bg-[#1C1C1C] dark:hover:bg-[#252525]"
      title={`Switch to ${darkMode ? "light" : "dark"} mode`}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
