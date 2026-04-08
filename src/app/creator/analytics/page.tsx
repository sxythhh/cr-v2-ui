"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { CreatorHeader } from "@/components/creator-header";
import { MoneybagIcon, EyeIcon, MegaphoneIcon, VideoPlaylistIcon } from "@/components/creator-icons";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";
import { MetricPill } from "@/components/submissions";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  CPM: <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5.37 0C7.35 0 9.27 1.14 10.55 3.29c.26.44.26.98 0 1.42C9.27 6.86 7.35 8 5.37 8 3.4 8 1.48 6.86.19 4.71a1.5 1.5 0 0 1 0-1.42C1.48 1.14 3.4 0 5.37 0Zm-1.75 4a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Z" fill="currentColor"/></svg>,
  "Per video": <svg width="10" height="9" viewBox="0 0 10 9" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1 .5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 1 .5ZM0 3c0-.83.67-1.5 1.5-1.5h7C9.33 1.5 10 2.17 10 3v4.5c0 .83-.67 1.5-1.5 1.5h-7C.67 9 0 8.33 0 7.5V3Zm4.28.8a.5.5 0 0 1 .53.06l1.25 1a.5.5 0 0 1 0 .78l-1.25 1A.5.5 0 0 1 4 6.25v-2a.5.5 0 0 1 .28-.45Z" fill="currentColor"/></svg>,
  Retainer: <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 0a.5.5 0 0 1 .5.5V1h3V.5a.5.5 0 0 1 1 0V1h.5C8.33 1 9 1.67 9 2.5v1a.5.5 0 0 1-.5.5H1v4c0 .28.22.5.5.5h2a.5.5 0 0 1 0 1h-2C.67 9.5 0 8.83 0 8V2.5C0 1.67.67 1 1.5 1H2V.5a.5.5 0 0 1 .5-.5Z" fill="currentColor"/><path d="M7 6.19a1.81 1.81 0 0 0-.48.09l.3.3a.25.25 0 0 1-.18.42H5.5a.5.5 0 0 1-.5-.5v-1.15a.25.25 0 0 1 .43-.18l.35.35A2.31 2.31 0 0 1 7 5.19a2.32 2.32 0 0 1 2.22 1.67.5.5 0 0 1-.97.26A1.32 1.32 0 0 0 7 6.19Z" fill="currentColor"/><path d="M5.74 7.86a.5.5 0 0 0-.96.26A2.32 2.32 0 0 0 7 9.81c.44 0 .86-.13 1.22-.34l.35.35a.25.25 0 0 0 .43-.18V8.5a.5.5 0 0 0-.5-.5h-1.15a.25.25 0 0 0-.18.43l.3.3A1.81 1.81 0 0 1 7 8.81c-.6 0-1.1-.4-1.26-.95Z" fill="currentColor"/></svg>,
};

const stats = [
  { value: "$3,528.00", label: "Payouts", color: "#00994D", bg: "rgba(0,153,77,0.08)", icon: <MoneybagIcon color="#00994D" /> },
  { value: "5.6M", label: "Views", color: "#1A67E5", bg: "rgba(26,103,229,0.08)", icon: <EyeIcon color="#1A67E5" /> },
  { value: "4", label: "Campaigns", color: "#E57100", bg: "rgba(229,113,0,0.08)", icon: <MegaphoneIcon color="#E57100" /> },
  { value: "206", label: "Submissions", color: "#FF3355", bg: "rgba(255,51,85,0.08)", icon: <VideoPlaylistIcon color="#FF3355" /> },
];

const campaignRows = [
  { name: "Flooz Clipping", type: "CPM", typeColor: "#1A67E5", views: "2.1M", clips: "89", approved: "84", earned: "$2,682.88", earnedColor: "#00994D", rate: "$1.36/1k" },
  { name: "Flooz Clipping", type: "CPM", typeColor: "#1A67E5", views: "2.1M", clips: "89", approved: "84", earned: "$987.40", earnedColor: "#00994D", rate: "$0.55/1k" },
  { name: "Flooz Clipping", type: "CPM", typeColor: "#1A67E5", views: "2.1M", clips: "89", approved: "84", earned: "$534.22", earnedColor: "#00994D", rate: "$0.60/1k" },
  { name: "Discord - Community", type: "Per video", typeColor: "#00994D", views: "31K", clips: "3", approved: "2", earned: "$75", earnedColor: "#00994D", rate: "$25/vid" },
  { name: "Netflix - Reaction Clips", type: "Retainer", typeColor: "#E57100", views: "2.1M", clips: "3", approved: "2", earned: "$2,250", earnedColor: "#00994D", rate: "$750/mo" },
];

const platforms = [
  { name: "Instagram", platformId: "instagram", bg: "rgba(174,78,238,0.1)", clips: "98 clips", views: "2.8M", barWidth: "80%" },
  { name: "TikTok", platformId: "tiktok", bg: "rgba(0,153,77,0.08)", clips: "74 clips", views: "1.9M", barWidth: "47%" },
  { name: "YouTube", platformId: "youtube", bg: "rgba(255,51,85,0.1)", clips: "38 clips", views: "780K", barWidth: "23%" },
  { name: "X (Twitter)", platformId: "x", bg: "rgba(224,224,224,0.06)", clips: "8 clips", views: "120K", barWidth: "6%" },
];

const INSIGHTS_CHART_POINTS = [
  { index: 0, label: "Jan 5", views: 84000, engagement: 120, likes: 0, comments: 0, shares: 0 },
  { index: 1, label: "Jan 8", views: 120000, engagement: 240, likes: 0, comments: 0, shares: 0 },
  { index: 2, label: "Jan 11", views: 280000, engagement: 480, likes: 0, comments: 0, shares: 0 },
  { index: 3, label: "Jan 14", views: 520000, engagement: 820, likes: 0, comments: 0, shares: 0 },
  { index: 4, label: "Jan 17", views: 740000, engagement: 1080, likes: 0, comments: 0, shares: 0 },
  { index: 5, label: "Jan 20", views: 860000, engagement: 1240, likes: 0, comments: 0, shares: 0 },
  { index: 6, label: "Jan 23", views: 920000, engagement: 1360, likes: 0, comments: 0, shares: 0 },
  { index: 7, label: "Jan 26", views: 880000, engagement: 1300, likes: 0, comments: 0, shares: 0 },
  { index: 8, label: "Jan 30", views: 820000, engagement: 1220, likes: 0, comments: 0, shares: 0 },
  { index: 9, label: "Feb 2", views: 780000, engagement: 1180, likes: 0, comments: 0, shares: 0 },
  { index: 10, label: "Feb 5", views: 720000, engagement: 1100, likes: 0, comments: 0, shares: 0 },
];

const INSIGHTS_CHART_DATA: AnalyticsPocPerformanceLineChartData = {
  datasets: { daily: INSIGHTS_CHART_POINTS, cumulative: INSIGHTS_CHART_POINTS },
  leftDomain: [0, 1000000],
  rightDomain: [0, 2000],
  rightYLabels: ["$2k", "$1.5k", "$1k", "$500", "$0"],
  series: [
    { axis: "left", color: "#1A67E5", domain: [0, 1000000], key: "views", label: "Views", tooltipValueType: "number", yLabels: ["1M", "750k", "500k", "250k", "0"] },
    { axis: "right", color: "#00994D", domain: [0, 2000], key: "engagement", label: "Payouts", tooltipValueType: "currency", yLabels: ["$2k", "$1.5k", "$1k", "$500", "$0"] },
  ],
  xTicks: [
    { index: 0, label: "Jan 5" }, { index: 2, label: "Jan 11" }, { index: 4, label: "Jan 17" },
    { index: 6, label: "Jan 23" }, { index: 8, label: "Jan 30" }, { index: 10, label: "Feb 5" },
  ],
  yLabels: ["1M", "750k", "500k", "250k", "0"],
};

function StatCard({ s }: { s: typeof stats[number] }) {
  return (
    <div className={cn(cardCls, "flex h-[61px] items-center gap-3 overflow-hidden pr-3")}>
      <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
        <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
          <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill={s.bg} />
        </svg>
        <div className="relative flex h-full w-full items-center justify-center">
          {s.icon}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{s.value}</span>
        <span className="text-xs tracking-[-0.02em] text-page-text-muted">{s.label}</span>
      </div>
    </div>
  );
}

function StatCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).offsetWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, stats.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="-mx-4 flex flex-col items-center gap-2 sm:-mx-5 md:hidden">
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 scrollbar-hide [scroll-padding-inline:16px] sm:pl-5 sm:[scroll-padding-inline:20px]"
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "w-[calc(50%-4px)] shrink-0 snap-start snap-always",
              i === stats.length - 1 && "mr-4 sm:mr-5",
            )}
          >
            <StatCard s={s} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {stats.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              const child = scrollRef.current?.children[i] as HTMLElement | undefined;
              child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
            }}
            className={cn(
              "size-1.5 cursor-pointer rounded-full transition-colors",
              i === activeIndex ? "bg-page-text" : "bg-foreground/10 dark:bg-white/10",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function CreatorAnalyticsPage() {
  const [chartTab, setChartTab] = useState<"views" | "payouts">("views");
  const [metricState, setMetricState] = useState<Record<string, boolean>>({ views: true, engagement: false });
  const toggleMetric = useCallback((key: string) => { setMetricState((prev) => ({ ...prev, [key]: !prev[key] })); }, []);
  const visibleMetricKeys = useMemo(() => Object.entries(metricState).filter(([, on]) => on).map(([k]) => k), [metricState]);

  const campaignTableRef = useRef<HTMLDivElement>(null);
  const campaignHover = useProximityHover(campaignTableRef);
  const campaignActiveRect = campaignHover.activeIndex !== null ? campaignHover.itemRects[campaignHover.activeIndex] : null;
  useEffect(() => { campaignHover.measureItems(); }, [campaignHover.measureItems]);

  return (
    <div className="flex min-h-screen flex-col font-inter tracking-[-0.02em]">
      <CreatorHeader title="Insights" />

      <div className="mx-auto flex w-full max-w-[756px] flex-col gap-4 px-4 py-4 sm:px-5 md:px-4">
        {/* Stat cards — mobile carousel */}
        <StatCarousel />

        {/* Stat cards — desktop grid */}
        <div className="hidden grid-cols-4 gap-2 md:grid">
          {stats.map((s) => (
            <StatCard key={s.label} s={s} />
          ))}
        </div>

        {/* Chart card */}
        <div className={cn(cardCls, "flex flex-col justify-center gap-4 p-4")}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-2xl font-medium tracking-[-0.02em] text-page-text">5.6M</span>
            <div className="flex self-start rounded-[10px] bg-foreground/[0.06] p-0.5 dark:bg-white/[0.06] sm:self-auto">
              <button
                onClick={() => { setChartTab("views"); setMetricState({ views: true, engagement: false }); }}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", chartTab === "views" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]" : "text-page-text-muted")}
              >
                Views
              </button>
              <button
                onClick={() => { setChartTab("payouts"); setMetricState({ views: false, engagement: true }); }}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", chartTab === "payouts" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]" : "text-page-text-muted")}
              >
                Payouts
              </button>
            </div>
          </div>
          <AnalyticsPocChartPlaceholder
            variant="line"
            chartStylePreset="performance-main"
            lineChart={INSIGHTS_CHART_DATA}
            activeLineDataset="daily"
            visibleMetricKeys={visibleMetricKeys}
            heightClassName="h-[220px]"
          />
        </div>

        {/* Campaign table */}
        <div className={cn(cardCls, "flex flex-col")}>
          {/* Header — desktop full columns */}
          <div className="hidden border-b border-foreground/[0.06] px-1 md:flex dark:border-[rgba(224,224,224,0.03)]">
            <div className="flex flex-1 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Campaign</span></div>
            <div className="flex w-28 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Type</span></div>
            <div className="flex w-16 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Views</span></div>
            <div className="flex w-16 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Clips</span></div>
            <div className="flex w-20 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Approved</span></div>
            <div className="flex w-24 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Earned</span></div>
            <div className="flex w-20 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Rate</span></div>
          </div>
          {/* Header — mobile 2 columns */}
          <div className="flex items-center border-b border-foreground/[0.06] px-1 md:hidden dark:border-[rgba(224,224,224,0.03)]">
            <div className="flex flex-1 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Campaign</span></div>
            <div className="flex w-20 items-center justify-end p-3"><span className="text-xs font-medium text-page-text-subtle">Rate &amp; earned</span></div>
          </div>
          {/* Rows */}
          <div
            ref={campaignTableRef}
            className="relative flex flex-col overflow-hidden"
            onMouseEnter={campaignHover.handlers.onMouseEnter}
            onMouseMove={campaignHover.handlers.onMouseMove}
            onMouseLeave={campaignHover.handlers.onMouseLeave}
          >
            <AnimatePresence>
              {campaignActiveRect && (
                <motion.div
                  key={campaignHover.sessionRef.current}
                  className="pointer-events-none absolute z-0 bg-foreground/[0.04]"
                  initial={{ opacity: 0, ...campaignActiveRect }}
                  animate={{ opacity: 1, ...campaignActiveRect }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {campaignRows.map((r, i) => (
              <div
                key={i}
                ref={(el) => campaignHover.registerItem(i, el)}
                className="relative z-[1] flex cursor-pointer items-center border-b border-foreground/[0.03] px-1 dark:border-[rgba(224,224,224,0.01)]"
              >
                {/* Campaign info — always visible */}
                <div className="flex flex-1 items-center gap-2 p-3">
                  <div className="size-9 shrink-0 rounded-full border border-foreground/[0.06] bg-gradient-to-br from-blue-400 to-purple-500 dark:border-[rgba(224,224,224,0.03)]" />
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-xs font-medium text-page-text">{r.name}</span>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1 text-xs font-medium dark:border-[rgba(224,224,224,0.03)]" style={{ color: r.typeColor }}>
                      {TYPE_ICONS[r.type]}
                      {r.type}
                    </span>
                  </div>
                </div>
                {/* Desktop-only columns */}
                <div className="hidden w-16 items-center p-3 md:flex"><span className="text-xs text-page-text">{r.views}</span></div>
                <div className="hidden w-16 items-center p-3 md:flex"><span className="text-xs text-page-text">{r.clips}</span></div>
                <div className="hidden w-20 items-center p-3 md:flex"><span className="text-xs text-page-text">{r.approved}</span></div>
                <div className="hidden w-24 items-center p-3 md:flex"><span className="text-xs text-[#00994D] dark:text-[#34D399]">{r.earned}</span></div>
                <div className="hidden w-20 items-center p-3 md:flex"><span className="text-xs text-page-text">{r.rate}</span></div>
                {/* Mobile: rate + earned */}
                <div className="flex w-20 flex-col items-end gap-2 p-3 md:hidden">
                  <span className="text-xs text-page-text">{r.rate}</span>
                  <span className="text-xs text-[#00994D]">{r.earned}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By platform */}
        <div className={cn(cardCls, "flex flex-col gap-2 p-4")}>
          <span className="pb-2 text-sm font-medium text-page-text">By platform</span>
          <div className="flex flex-col gap-1">
            {platforms.map((p) => (
              <div key={p.name} className="relative flex items-center gap-4 rounded-xl px-4 py-2.5">
                <div className="absolute inset-y-0 left-0 rounded-xl" style={{ width: p.barWidth, background: p.bg }} />
                <div className="relative flex items-center gap-1.5">
                  <PlatformIcon platform={p.platformId} size={16} className="shrink-0" />
                  <span className="text-sm font-medium text-page-text">{p.name}</span>
                </div>
                <div className="relative flex items-center gap-1.5 text-sm">
                  <span className="text-page-text-subtle">{p.clips}</span>
                  <span className="text-page-text-subtle">&middot;</span>
                  <span className="text-page-text">{p.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
