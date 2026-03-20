import { CalendarDays, ChevronDown } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { cn } from "@/lib/utils";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type { AnalyticsPocFilterToolbarProps } from "./types";

/** Shared pill button classes matching Figma spec */
export const analyticsPillButtonClass = cn(
  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3.5",
  "border border-foreground/[0.06] dark:border-white/[0.08]",
  "bg-white dark:bg-white/[0.06]",
  "shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]",
  "font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.02em] text-page-text",
  "outline-none focus-visible:ring-2 focus-visible:ring-foreground/[0.12] dark:focus-visible:ring-white/[0.15] focus-visible:ring-offset-0",
  "transition-colors hover:bg-foreground/[0.03] dark:hover:bg-white/[0.08]",
);

export function AnalyticsPocFilterToolbar({
  platforms,
  dateLabel,
  campaignLabel,
  dateSlot,
  platformSlot,
  campaignSlot,
  className,
}: AnalyticsPocFilterToolbarProps) {
  const activePlatforms = platforms.filter((p) => p.active);
  const platformLabel = activePlatforms.map((p) => p.label).join(", ") || "All platforms";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        className,
      )}
    >
      {/* Date range */}
      {dateSlot ?? (
        <button
          className={cn(ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS, analyticsPillButtonClass)}
          type="button"
        >
          <CalendarDays className="size-4 text-page-text" />
          {dateLabel}
          <ChevronDown className="size-4 text-page-text-muted" />
        </button>
      )}

      {/* Platform selector */}
      {platformSlot ?? (
        <button
          className={cn(ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS, analyticsPillButtonClass)}
          type="button"
        >
          {activePlatforms.map((p) => (
            <span key={p.id} className="flex shrink-0 items-center justify-center text-page-text">
              <PlatformIcon platform={p.id.toLowerCase()} size={16} />
            </span>
          ))}
          <span className="truncate">{platformLabel}</span>
          <ChevronDown className="size-4 shrink-0 text-page-text-muted" />
        </button>
      )}

      {/* Campaign selector */}
      {campaignSlot ?? (
        <button
          className={cn(ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS, analyticsPillButtonClass)}
          type="button"
        >
          {campaignLabel}
          <ChevronDown className="size-4 text-page-text-muted" />
        </button>
      )}
    </div>
  );
}
