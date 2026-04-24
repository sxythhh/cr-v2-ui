"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const GRADIENT_ON =
  "radial-gradient(50% 50% at 50% 100%, rgba(251, 146, 60, 0.12) 0%, rgba(251, 146, 60, 0) 50%), var(--toggle-card-bg)";

/**
 * Pill toggle matching src/components/campaign-flow/steps/RequirementsStep.tsx.
 * 40px wide, 20px tall, black thumb (dark mode: white) on light bg when on.
 */
export function ScopeToggle({
  on,
  onToggle,
  disabled,
}: {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-checked={on}
      role="switch"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onToggle();
      }}
      className={cn(
        "flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 backdrop-blur-[6px] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        on
          ? "bg-[#252525] dark:bg-[#E0E0E0]"
          : "bg-foreground/20 dark:bg-[rgba(224,224,224,0.2)]",
      )}
    >
      <div
        className={cn(
          "size-4 rounded-full shadow-[0px_4px_12px_rgba(0,0,0,0.12)] transition-transform",
          on
            ? "translate-x-5 bg-white dark:bg-[#252525]"
            : "translate-x-0 bg-white dark:bg-[#E0E0E0]",
        )}
      />
    </button>
  );
}

/**
 * Container card that applies the orange radial gradient and accent border
 * when `on` — matching campaign-flow's PresetRow. Pair with ScopeToggle.
 */
export function ScopeToggleRow({
  on,
  onToggle,
  children,
  className,
}: {
  on: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex cursor-pointer flex-col gap-3 rounded-2xl border px-4 py-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors",
        on
          ? "border-[rgba(255,144,37,0.3)] dark:border-[rgba(251,146,60,0.15)]"
          : "border-foreground/[0.06] bg-card-bg hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-[rgba(224,224,224,0.04)]",
        className,
      )}
      style={on ? { background: GRADIENT_ON } : undefined}
    >
      {children}
    </div>
  );
}
