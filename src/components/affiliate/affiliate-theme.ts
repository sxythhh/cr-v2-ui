export type Theme = "dark" | "light";

export const THEME = {
  dark: {
    pageBg: "#111111",
    border: "rgba(37, 37, 37, 0.06)",
    textPrimary: "#E0E0E0",
    textSecondary: "rgba(224, 224, 224, 0.5)",
  },
  light: {
    pageBg: "#F4F3F2",
    border: "#e5e5e5",
    textPrimary: "#0a0a0a",
    textSecondary: "#424242",
  },
} as const;
