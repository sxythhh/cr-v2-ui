import { CalendarDays, ChevronDown } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { cn } from "@/lib/utils";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type { AnalyticsPocFilterToolbarProps } from "./types";

/** Shared pill button classes matching Figma spec */
export const analyticsPillButtonClass = cn(
  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3.5",
  "border border-foreground/[0.06] dark:border-border",
  "bg-white dark:bg-card-bg",
  "shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]",
  "font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.02em] text-page-text",
  "outline-none focus-visible:outline-none",
  "transition-colors hover:bg-foreground/[0.03] dark:hover:bg-white/[0.05] dark:hover:border-white/[0.10]",
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
        "-mx-4 flex items-center gap-2 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:flex-wrap sm:overflow-x-visible sm:px-0",
        className,
      )}
    >
      {/* Date range */}
      <div className="shrink-0">
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
      </div>

      {/* Platform selector */}
      <div className="shrink-0">
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
      </div>

      {/* Campaign selector */}
      <div className="shrink-0">
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
    </div>
  );
}
