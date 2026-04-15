"use client";

import { BorderBeam as BorderBeamBase } from "border-beam";
import type { BorderBeamProps as BorderBeamBaseProps } from "border-beam";
import { useState, useEffect } from "react";

type BorderBeamProps = Omit<BorderBeamBaseProps, "theme"> & {
  theme?: "dark" | "light" | "auto";
};

/**
 * Wrapper around border-beam that detects our `.dark` class theme
 * instead of relying on prefers-color-scheme.
 */
export function BorderBeam({ theme = "auto", ...props }: BorderBeamProps) {
  const [resolved, setResolved] = useState<"dark" | "light">("light");

  useEffect(() => {
    const check = () =>
      setResolved(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  const effectiveTheme = theme === "auto" ? resolved : theme;

  return <BorderBeamBase {...props} theme={effectiveTheme} />;
}
