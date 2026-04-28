"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/springs";

// ── Types ────────────────────────────────────────────────────────────

type ActionVariant = "default" | "danger";

export interface SelectionToolbarAction {
  id: string;
  label: string;
  /** Optional leading icon (16x16 recommended) */
  icon?: ReactNode;
  /** "default" for neutral, "danger" for destructive (red text) */
  variant?: ActionVariant;
  onClick: () => void;
}

interface SelectionToolbarProps {
  /** Number of selected items — bar is hidden when 0 */
  count: number;
  /** Called when the close (X) button is clicked */
  onClear: () => void;
  /** Action buttons rendered to the right of the count */
  actions?: SelectionToolbarAction[];
  /** Override the default "Selected" label */
  countLabel?: string;
  className?: string;
}

// ── Variant styles ───────────────────────────────────────────────────

const variantClasses: Record<ActionVariant, string> = {
  default:
    "bg-[rgba(224,224,224,0.08)] text-[#E0E0E0] hover:bg-[rgba(224,224,224,0.14)]",
  danger:
    "bg-[rgba(255,37,37,0.16)] text-[#FB7185] hover:bg-[rgba(255,37,37,0.22)]",
};

// ── SelectionToolbar ─────────────────────────────────────────────────

export function SelectionToolbar({
  count,
  onClear,
  actions = [],
  countLabel = "Selected",
  className,
}: SelectionToolbarProps) {
  const open = count > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="toolbar"
          aria-label={`${count} ${countLabel.toLowerCase()}`}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={springs.moderate}
          className={cn(
            "fixed bottom-10 left-1/2 z-40 flex h-[37px] -translate-x-1/2 items-center gap-0.5 rounded-xl bg-[#111111] py-0.5 pl-2.5 pr-0.5 shadow-[0_8px_24px_rgba(0,0,0,0.24)]",
            className,
          )}
        >
          {/* Count + close */}
          <div className="flex h-[33px] items-center gap-2 pr-2">
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear selection"
              className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-[rgba(224,224,224,0.3)] transition-colors hover:text-[rgba(224,224,224,0.6)]"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M1.5 1.5 9.5 9.5M9.5 1.5 1.5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.524"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="flex items-center gap-1.5">
              <span className="flex size-4 items-center justify-center rounded-full bg-[rgba(224,224,224,0.2)] font-inter text-[12px] font-semibold leading-none tracking-[-0.02em] text-white tabular-nums">
                {count}
              </span>
              <span className="font-inter text-sm font-medium leading-[120%] tracking-[-0.02em] text-[rgba(224,224,224,0.7)]">
                {countLabel}
              </span>
            </div>
          </div>

          {/* Actions */}
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={cn(
                "flex h-[33px] cursor-pointer items-center gap-1.5 rounded-[10px] px-4 font-inter text-sm font-medium leading-[120%] tracking-[-0.02em] shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-colors",
                variantClasses[action.variant ?? "default"],
                action.icon ? "pl-3.5" : "",
              )}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
