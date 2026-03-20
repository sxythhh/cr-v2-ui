"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { analyticsPillButtonClass } from "./AnalyticsPocFilterToolbar";

export interface PlatformOption {
  id: string;
  label: string;
  active: boolean;
}

interface AnalyticsPocPlatformSelectProps {
  platforms: PlatformOption[];
  onToggle: (id: string) => void;
  className?: string;
}

export function AnalyticsPocPlatformSelect({
  platforms,
  onToggle,
  className,
}: AnalyticsPocPlatformSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activePlatforms = platforms.filter((p) => p.active);
  const displayLabel =
    activePlatforms.map((p) => p.label).join(", ") || "All platforms";

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        className={cn(
          analyticsPillButtonClass,
          "max-w-[320px]",
          open && "ring-2 ring-foreground/10 dark:ring-white/[0.15]",
        )}
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        {activePlatforms.map((p) => (
          <span
            key={p.id}
            className="flex shrink-0 items-center justify-center text-page-text"
          >
            <PlatformIcon platform={p.id.toLowerCase()} size={16} />
          </span>
        ))}
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-[rgba(37,37,37,0.5)] dark:text-white/50 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[200px] overflow-hidden rounded-2xl border border-border bg-card-bg shadow-lg">
          <div className="flex flex-col">
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-[13px] tracking-[-0.09px] text-page-text outline-none transition-colors hover:bg-foreground/[0.04]"
                onClick={() => onToggle(p.id)}
              >
                <div
                  className={cn(
                    "flex size-4 items-center justify-center rounded border transition-colors",
                    p.active
                      ? "border-foreground bg-foreground text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-foreground/20 dark:border-white/20",
                  )}
                >
                  {p.active && <Check className="size-3" strokeWidth={2.5} />}
                </div>
                <span className="flex items-center justify-center text-page-text">
                  <PlatformIcon platform={p.id.toLowerCase()} size={16} />
                </span>
                <span className="font-inter text-[13px] text-page-text">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
