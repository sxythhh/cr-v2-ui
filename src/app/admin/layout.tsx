"use client";

import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { setMode } = useTheme();

  // Force dark mode on admin pages, restore on unmount
  useEffect(() => {
    const prev = (localStorage.getItem("theme") as "light" | "dark" | "system") || "light";
    setMode("dark");
    return () => {
      setMode(prev);
    };
  }, [setMode]);

  return <>{children}</>;
}
