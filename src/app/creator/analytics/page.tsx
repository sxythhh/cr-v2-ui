"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CreatorHeader } from "@/components/creator-header";
import { MoneybagIcon, EyeIcon, MegaphoneIcon, VideoPlaylistIcon } from "@/components/creator-icons";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";
import { MetricPill } from "@/components/submissions";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg";

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
  { name: "Instagram", icon: "IG", color: "#AE4EEE", bg: "rgba(174,78,238,0.1)", clips: "98 clips", views: "2.8M", barWidth: "80%" },
  { name: "TikTok", icon: "TT", color: "#00994D", bg: "rgba(0,153,77,0.08)", clips: "74 clips", views: "1.9M", barWidth: "47%" },
  { name: "YouTube", icon: "YT", color: "#FF3355", bg: "rgba(255,51,85,0.1)", clips: "38 clips", views: "780K", barWidth: "23%" },
  { name: "X (Twitter)", icon: "X", color: "#000000", bg: "rgba(37,37,37,0.06)", clips: "8 clips", views: "120K", barWidth: "6%" },
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

export default function CreatorAnalyticsPage() {
  const [chartTab, setChartTab] = useState<"views" | "payouts">("views");
  const [metricState, setMetricState] = useState<Record<string, boolean>>({ views: true, engagement: false });
  const toggleMetric = useCallback((key: string) => { setMetricState((prev) => ({ ...prev, [key]: !prev[key] })); }, []);
  const visibleMetricKeys = useMemo(() => Object.entries(metricState).filter(([, on]) => on).map(([k]) => k), [metricState]);

  return (
    <div className="flex min-h-screen flex-col font-inter tracking-[-0.02em]">
      <CreatorHeader title="Insights" />

      <div className="mx-auto flex w-full max-w-[756px] flex-col gap-4 px-4 py-4 sm:px-5 md:px-4">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={cn(cardCls, "flex h-[56px] items-center gap-2 overflow-hidden pr-3 sm:h-[61px] sm:gap-3")}>
              <div className="relative h-[56px] w-[50px] shrink-0 overflow-hidden sm:h-[61px] sm:w-[60px]">
                <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                  <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill={s.bg} />
                </svg>
                <div className="relative flex h-full w-full items-center justify-center">
                  {s.icon}
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{s.value}</span>
                <span className="text-xs tracking-[-0.02em] text-page-text-muted">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart card */}
        <div className={cn(cardCls, "flex flex-col justify-center gap-4 p-4")}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-2xl font-medium tracking-[-0.02em] text-page-text">5.6M</span>
            <div className="flex self-start rounded-[10px] bg-foreground/[0.06] p-0.5 sm:self-auto">
              <button
                onClick={() => { setChartTab("views"); setMetricState({ views: true, engagement: false }); }}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", chartTab === "views" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]" : "text-page-text-muted")}
              >
                Views
              </button>
              <button
                onClick={() => { setChartTab("payouts"); setMetricState({ views: false, engagement: true }); }}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", chartTab === "payouts" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]" : "text-page-text-muted")}
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
        <div className={cn(cardCls, "flex flex-col overflow-x-auto")}>
          {/* Header */}
          <div className="flex min-w-[600px] items-center border-b border-foreground/[0.06] px-1">
            <div className="flex flex-1 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Campaign</span></div>
            <div className="flex w-28 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Type</span></div>
            <div className="flex w-16 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Views</span></div>
            <div className="flex w-16 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Clips</span></div>
            <div className="flex w-20 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Approved</span></div>
            <div className="flex w-24 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Earned</span></div>
            <div className="flex w-20 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Rate</span></div>
          </div>
          {/* Rows */}
          {campaignRows.map((r, i) => (
            <div key={i} className="flex min-w-[600px] items-center border-b border-foreground/[0.03] px-1">
              <div className="flex flex-1 items-center gap-2 p-3">
                <div className="size-6 shrink-0 rounded-full border border-foreground/[0.06] bg-gradient-to-br from-blue-400 to-purple-500" />
                <span className="text-xs font-medium text-page-text">{r.name}</span>
              </div>
              <div className="flex w-28 items-center p-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1 text-xs font-medium" style={{ color: r.typeColor }}>
                  {r.type}
                </span>
              </div>
              <div className="flex w-16 items-center p-3"><span className="text-xs text-page-text">{r.views}</span></div>
              <div className="flex w-16 items-center p-3"><span className="text-xs text-page-text">{r.clips}</span></div>
              <div className="flex w-20 items-center p-3"><span className="text-xs text-page-text">{r.approved}</span></div>
              <div className="flex w-24 items-center p-3"><span className="text-xs" style={{ color: r.earnedColor }}>{r.earned}</span></div>
              <div className="flex w-20 items-center p-3"><span className="text-xs text-page-text">{r.rate}</span></div>
            </div>
          ))}
        </div>

        {/* By platform */}
        <div className={cn(cardCls, "flex flex-col gap-2 p-4")}>
          <span className="pb-2 text-sm font-medium text-page-text">By platform</span>
          <div className="flex flex-col gap-1">
            {platforms.map((p) => (
              <div key={p.name} className="relative flex items-center gap-4 rounded-xl px-4 py-2.5">
                <div className="absolute inset-y-0 left-0 rounded-xl" style={{ width: p.barWidth, background: p.bg }} />
                <div className="relative flex items-center gap-1.5">
                  <div className="flex size-4 items-center justify-center rounded-sm text-[8px] font-bold" style={{ color: p.color }}>{p.icon}</div>
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
