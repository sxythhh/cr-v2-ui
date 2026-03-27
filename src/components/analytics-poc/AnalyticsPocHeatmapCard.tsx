"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
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
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const platformColor = platform ? getAnalyticsPocPlatformBrandColor(platform) : undefined;
  const toneColor =
    (platform === "x" ? (isDark ? "#FFFFFF" : "#1A67E5") : platformColor) ??
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

  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const headerContent = (
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
  );

  return (
    <>
      <AnalyticsPocPanel
        className={cn("cursor-pointer sm:cursor-default", className)}
        onClick={() => {
          if (window.innerWidth < 640) setExpanded(true);
        }}
      >
        {headerContent}
        <Heatmap
          data={heatmapData}
          startDate={startDate}
          endDate={endDate}
          colorScale={colorScale}
          colorMode="interpolate"
          legend={{ left: footerLeft, right: footerRight }}
        />
      </AnalyticsPocPanel>

      {/* Expanded heatmap modal — mobile only */}
      {mounted && createPortal(
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-end sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setExpanded(false)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

              {/* Sheet */}
              <motion.div
                className="relative w-full overflow-hidden rounded-t-[20px] border-t border-foreground/[0.06] bg-card-bg px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_32px_rgba(0,0,0,0.15)]"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag handle */}
                <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-foreground/[0.15]" />

                {headerContent}

                {/* Full-width heatmap */}
                <div className="-mx-1 overflow-x-auto">
                  <Heatmap
                    data={heatmapData}
                    startDate={startDate}
                    endDate={endDate}
                    colorScale={colorScale}
                    colorMode="interpolate"
                    legend={{ left: footerLeft, right: footerRight }}
                  />
                </div>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
