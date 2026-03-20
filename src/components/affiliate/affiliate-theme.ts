export type Theme = "dark" | "light";

export const THEME = {
  dark: {
    pageBg: "#0a0a0a",
    border: "#1a1a1b",
    textPrimary: "#ffffff",
    textSecondary: "#969696",
  },
  light: {
    pageBg: "#F4F3F2",
    border: "#e5e5e5",
    textPrimary: "#0a0a0a",
    textSecondary: "#424242",
  },
} as const;
