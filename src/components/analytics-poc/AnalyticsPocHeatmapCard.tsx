"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import Heatmap, { type HeatmapData } from "@/components/blocks/heatmap";
import {
  ANALYTICS_POC_CARD_HEADING_ICON_COLOR_CLASS,
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocBestTimePill } from "./AnalyticsPocBestTimePill";
import { AnalyticsPocPanel } from "./AnalyticsPocPanel";
import {
  AnalyticsPocPlatformIcon,
  getAnalyticsPocPlatformBrandColor,
  hasAnalyticsPocPlatformIcon,
} from "./AnalyticsPocPlatformIcon";
import type { AnalyticsPocHeatmapCardProps } from "./types";

const HEATMAP_TONE_COLOR: Record<AnalyticsPocHeatmapCardProps["tone"], string> =
  {
    blue: "#60A5FA",
    green: "#34D399",
    purple: "#C084FC",
    red: "#FB7185",
  };


export function AnalyticsPocHeatmapCard({
  title,
  subtitle,
  badge,
  platform,
  tone,
  footerLeft,
  footerRight,
  heatmapData,
  startDate,
  endDate,
  className,
}: AnalyticsPocHeatmapCardProps) {
  const toneColor =
    (platform ? getAnalyticsPocPlatformBrandColor(platform) : undefined) ??
    HEATMAP_TONE_COLOR[tone];
  const showPlatformIcon = platform
    ? hasAnalyticsPocPlatformIcon(platform)
    : false;

  const colorScale = useMemo(
    () => [
      `color-mix(in srgb, ${toneColor} 8%, transparent)`,
      `color-mix(in srgb, ${toneColor} 20%, transparent)`,
      `color-mix(in srgb, ${toneColor} 30%, transparent)`,
      `color-mix(in srgb, ${toneColor} 40%, transparent)`,
      `color-mix(in srgb, ${toneColor} 60%, transparent)`,
      toneColor,
    ],
    [toneColor],
  );

  // Parse "Best 6 PM EST" into prefix + value
  const badgeParts = badge.trim().split(/\s+/);
  const badgePrefix = badgeParts[0] || "";
  const badgeValue = badgeParts.slice(1).join(" ") || badge;

  return (
    <AnalyticsPocPanel className={cn(className)}>
      <div className="flex flex-col gap-3 pb-2">
        {/* Platform label row */}
        <div className="flex items-center gap-1.5">
          {platform && showPlatformIcon && (
            <AnalyticsPocPlatformIcon
              className="text-foreground/50"
              platform={platform}
              size={16}
              tone="inherit"
            />
          )}
          <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">{title}</span>
        </div>
        {/* Best time + subtitle */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">{badgePrefix}</span>
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{badgeValue}</span>
          </div>
          {subtitle && (
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">{subtitle}</span>
          )}
        </div>
      </div>

      <Heatmap
        data={heatmapData}
        startDate={startDate}
        endDate={endDate}
        colorScale={colorScale}
        colorMode="interpolate"
        legend={{ left: footerLeft, right: footerRight }}
      />
    </AnalyticsPocPanel>
  );
}
