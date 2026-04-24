import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Stat({
  label,
  value,
  delta,
  deltaDir = "up",
  className,
}: {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  deltaDir?: "up" | "down";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="font-inter text-xs text-page-text-subtle">{label}</span>
      <span className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
        {value}
      </span>
      {delta !== undefined && delta !== null && delta !== "" && (
        <span
          className={cn(
            "font-inter text-xs",
            deltaDir === "down" ? "text-red-500" : "text-emerald-600 dark:text-emerald-400",
          )}
        >
          {deltaDir === "down" ? "↓ " : "↑ "}
          {delta}
        </span>
      )}
    </div>
  );
}
