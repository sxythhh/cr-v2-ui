"use client";

import { cn } from "@/lib/utils";

interface FancyProgressProps {
  /** Progress value 0–100 */
  value: number;
  className?: string;
}

/**
 * Skeuomorphic progress bar.
 * Track: simple light gray rounded pill.
 * Fill: orange gradient with drop shadows + inset highlights.
 */
export function FancyProgress({ value, className }: FancyProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "relative h-3 w-full rounded-full bg-[#F0F0F0] dark:bg-white/[0.08]",
        className,
      )}
    >
      {clamped > 0 && (
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${clamped}%`,
            minWidth: 12,
            background: "linear-gradient(180deg, #FFBB00 0%, #FF5300 100%)",
            boxShadow: [
              "0px 12.8px 4.8px rgba(0, 0, 0, 0.01)",
              "0px 7.2px 4px rgba(0, 0, 0, 0.04)",
              "0px 3.2px 3.2px rgba(0, 0, 0, 0.07)",
              "0px 0.8px 1.6px rgba(0, 0, 0, 0.08)",
              "inset 0px 1.6px 0px rgba(255, 255, 255, 0.4)",
              "inset 0px -1.6px 0px rgba(255, 255, 255, 0.3)",
            ].join(", "),
          }}
        />
      )}
    </div>
  );
}
