import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";

interface AnalyticsPocChartToggleChipProps {
  label: string;
  value: string;
  metricKey?: string;
  enabled?: boolean;
  onToggle?: (metricKey: string) => void;
  seriesColor: string;
  className?: string;
}

type ChipStyle = CSSProperties & {
  "--ap-chip-active-bg": string;
  "--ap-chip-active-bg-hover": string;
  "--ap-chip-active-border": string;
  "--ap-chip-active-border-hover": string;
  "--ap-chip-indicator-bg": string;
  "--ap-chip-indicator-bg-hover": string;
  "--ap-chip-indicator-border": string;
  "--ap-chip-indicator-border-hover": string;
};

function hexToRgb(color: string): [number, number, number] | null {
  const normalized = color.trim();

  if (normalized.startsWith("#")) {
    const hex = normalized.slice(1);

    if (hex.length === 3) {
      const r = Number.parseInt(hex[0] + hex[0], 16);
      const g = Number.parseInt(hex[1] + hex[1], 16);
      const b = Number.parseInt(hex[2] + hex[2], 16);

      if ([r, g, b].every(Number.isFinite)) {
        return [r, g, b];
      }
    }

    if (hex.length === 6) {
      const r = Number.parseInt(hex.slice(0, 2), 16);
      const g = Number.parseInt(hex.slice(2, 4), 16);
      const b = Number.parseInt(hex.slice(4, 6), 16);

      if ([r, g, b].every(Number.isFinite)) {
        return [r, g, b];
      }
    }

    return null;
  }

  const rgbMatch = normalized.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i,
  );

  if (!rgbMatch) {
    return null;
  }

  const r = Number.parseFloat(rgbMatch[1]);
  const g = Number.parseFloat(rgbMatch[2]);
  const b = Number.parseFloat(rgbMatch[3]);

  if (![r, g, b].every(Number.isFinite)) {
    return null;
  }

  return [r, g, b];
}

function withAlpha(color: string, alpha: number): string {
  const rgb = hexToRgb(color);

  if (!rgb) {
    return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
  }

  const [r, g, b] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildChipStyle(seriesColor: string): ChipStyle {
  return {
    "--ap-chip-active-bg": withAlpha(seriesColor, 0.1),
    "--ap-chip-active-bg-hover": withAlpha(seriesColor, 0.15),
    "--ap-chip-active-border": "transparent",
    "--ap-chip-active-border-hover": "transparent",
    "--ap-chip-indicator-bg": seriesColor,
    "--ap-chip-indicator-bg-hover": seriesColor,
    "--ap-chip-indicator-border": seriesColor,
    "--ap-chip-indicator-border-hover": seriesColor,
  };
}

export function AnalyticsPocChartToggleChip({
  label,
  value,
  metricKey,
  enabled = true,
  onToggle,
  seriesColor,
  className,
}: AnalyticsPocChartToggleChipProps) {
  const canToggle = Boolean(metricKey && onToggle);
  const style = buildChipStyle(seriesColor);

  const indicator = enabled ? (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="size-4 shrink-0" style={{ color: seriesColor }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.66667 0C2.98477 0 0 2.98477 0 6.66667C0 10.3486 2.98477 13.3333 6.66667 13.3333C10.3486 13.3333 13.3333 10.3486 13.3333 6.66667C13.3333 2.98477 10.3486 0 6.66667 0ZM9.18264 5.42218C9.41579 5.13721 9.37379 4.7172 9.08882 4.48405C8.80386 4.2509 8.38385 4.2929 8.15069 4.57786L5.61717 7.67439L4.80474 6.86195C4.54439 6.6016 4.12228 6.6016 3.86193 6.86195C3.60158 7.1223 3.60158 7.54441 3.86193 7.80476L5.19526 9.13809C5.32845 9.27128 5.51176 9.34191 5.69988 9.33253C5.88799 9.32314 6.06337 9.23462 6.18264 9.08885L9.18264 5.42218Z" fill="currentColor"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-4 shrink-0">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" className="text-foreground"/>
    </svg>
  );

  const chipClassName = cn(
    "group/chip inline-flex h-6 min-w-0 items-center justify-center gap-1 rounded-full px-2 py-2 pl-1",
    "text-left",
    "transition-[background,color] duration-150 ease-out",
    enabled
      ? "[background:var(--ap-chip-active-bg)] hover:[background:var(--ap-chip-active-bg-hover)]"
      : "border border-foreground/[0.03] bg-foreground/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
    canToggle
      ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ap-border)]"
      : "cursor-default",
    className,
  );

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-1">
        {indicator}
        <span
          className={cn(
            "truncate font-inter text-xs font-normal leading-[1.3] tracking-[-0.02em]",
            enabled
              ? "text-page-text"
              : "text-page-text-subtle",
          )}
        >
          {label}
        </span>
      </span>

      <span className="shrink-0 font-inter text-xs leading-[1.3] tracking-[-0.02em]">
        {(() => {
          const parts = value.split(" · ");
          if (parts.length < 2) {
            return (
              <span
                className={cn("font-medium", !enabled && "text-page-text-subtle")}
                style={enabled ? { color: seriesColor } : undefined}
              >
                {value}
              </span>
            );
          }
          return (
            <>
              <span
                className={cn("font-medium", !enabled && "text-page-text-subtle")}
                style={enabled ? { color: seriesColor } : undefined}
              >
                {parts[0]}
              </span>
              <span className="font-normal text-[var(--ap-text-secondary)]">
                {" · "}
                {parts.slice(1).join(" · ")}
              </span>
            </>
          );
        })()}
      </span>
    </>
  );

  if (!canToggle) {
    return (
      <article className={chipClassName} style={style}>
        {content}
      </article>
    );
  }

  const handleToggle = () => {
    if (metricKey && onToggle) {
      onToggle(metricKey);
    }
  };

  return (
    <button
      aria-pressed={enabled}
      className={cn(
        chipClassName,
        "active:scale-[0.97]",
      )}
      onClick={handleToggle}
      style={style}
      type="button"
    >
      {content}
    </button>
  );
}
