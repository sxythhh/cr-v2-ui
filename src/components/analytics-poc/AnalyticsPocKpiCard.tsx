import { cn } from "@/lib/utils";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";
import type {
  AnalyticsPocKpiCardProps,
  AnalyticsPocKpiDeltaTone,
} from "./types";

const DELTA_COLOR: Record<AnalyticsPocKpiDeltaTone, string> = {
  danger: "text-[#FB7185]",
  neutral: "text-[var(--ap-text-secondary)]",
  success: "text-[#34D399]",
};

export function AnalyticsPocKpiCard({
  label,
  value,
  deltaBadge,
  meta,
  metaTone,
  onClick,
  className,
}: AnalyticsPocKpiCardProps) {
  return (
    <article
      className={cn(
        ANALYTICS_POC_CARD_CONTAINER_CLASS,
        ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
        "flex flex-col justify-center gap-2 p-3",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={ANALYTICS_POC_CARD_SURFACE_STYLE}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Row 1: value + delta */}
      <div className="flex items-center justify-between gap-3">
        <p className="flex-1 font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ap-text)]">
          {value}
        </p>
        {deltaBadge && (
          <span
            className={cn(
              "shrink-0 font-inter text-[12px] font-medium leading-none tracking-[-0.02em]",
              DELTA_COLOR[deltaBadge.tone ?? "success"],
            )}
          >
            {deltaBadge.label}
          </span>
        )}
        {!deltaBadge && meta && (
          <span className={cn(
            "shrink-0 font-inter text-[12px] font-normal leading-none tracking-[-0.02em]",
            metaTone === "success" ? "text-[#34D399]" : "text-[var(--ap-text-secondary)]",
          )}>
            {meta}
          </span>
        )}
      </div>

      {/* Row 2: label + meta */}
      <div className="flex items-center justify-between gap-1.5">
        <p className="font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-[var(--ap-text-secondary)]">
          {label}
        </p>
        {deltaBadge && meta && (
          <span className={cn(
            "shrink-0 font-inter text-[12px] font-normal leading-none tracking-[-0.02em]",
            metaTone === "success" ? "font-medium text-[#34D399]" : "text-page-text-subtle",
          )}>
            {meta}
          </span>
        )}
      </div>
    </article>
  );
}
