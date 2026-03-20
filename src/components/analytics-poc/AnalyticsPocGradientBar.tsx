"use client";

import { cn } from "@/lib/utils";

interface AnalyticsPocGradientBarProps {
  /** 0–100 fill percentage */
  progress: number;
  /** Primary accent color (used as gradient start) */
  color?: string;
  /** Optional gradient end color — defaults to a purple-shifted mix of the primary */
  colorEnd?: string;
  /** Track width class — defaults to w-[100px] */
  widthClassName?: string;
  /** Additional class on the outer wrapper */
  className?: string;
}

export function AnalyticsPocGradientBar({
  progress,
  color = "var(--ap-text-tertiary)",
  colorEnd,
  widthClassName = "w-[100px]",
  className,
}: AnalyticsPocGradientBarProps) {
  const fillPercent = Math.min(Math.max(progress, 0), 100);
  const end = colorEnd ?? `color-mix(in srgb, ${color} 60%, #A78BFA)`;

  return (
    <div
      className={cn(
        "relative h-[6px] overflow-hidden rounded-[4px] bg-[var(--ap-hover)]",
        widthClassName,
        className,
      )}
    >
      <div
        className="h-full rounded-[4px]"
        style={{
          background: `linear-gradient(90deg, ${color} 0%, ${end} 100%)`,
          width: `${fillPercent}%`,
        }}
      />
    </div>
  );
}
