/**
 * Lightweight web haptics using the Vibration API.
 * Falls back to a no-op on unsupported browsers (iOS Safari, desktop).
 */

const canVibrate =
  typeof navigator !== "undefined" && "vibrate" in navigator;

export type HapticStyle = "light" | "medium" | "heavy";

const PATTERNS: Record<HapticStyle, number | number[]> = {
  light: 8,
  medium: 15,
  heavy: 25,
};

export function haptic(style: HapticStyle = "light") {
  if (!canVibrate) return;
  navigator.vibrate(PATTERNS[style]);
}
