"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { CreatorHeader } from "@/components/creator-header";
import { MoneybagIcon, EyeIcon, MegaphoneIcon, VideoPlaylistIcon } from "@/components/creator-icons";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { loadShowcaseConfig, type ShowcaseConfig } from "@/lib/showcase-data";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  CPM: <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5.37 0C7.35 0 9.27 1.14 10.55 3.29c.26.44.26.98 0 1.42C9.27 6.86 7.35 8 5.37 8 3.4 8 1.48 6.86.19 4.71a1.5 1.5 0 0 1 0-1.42C1.48 1.14 3.4 0 5.37 0Zm-1.75 4a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Z" fill="currentColor"/></svg>,
  "Per video": <svg width="10" height="9" viewBox="0 0 10 9" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1 .5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 1 .5ZM0 3c0-.83.67-1.5 1.5-1.5h7C9.33 1.5 10 2.17 10 3v4.5c0 .83-.67 1.5-1.5 1.5h-7C.67 9 0 8.33 0 7.5V3Zm4.28.8a.5.5 0 0 1 .53.06l1.25 1a.5.5 0 0 1 0 .78l-1.25 1A.5.5 0 0 1 4 6.25v-2a.5.5 0 0 1 .28-.45Z" fill="currentColor"/></svg>,
  Retainer: <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 0a.5.5 0 0 1 .5.5V1h3V.5a.5.5 0 0 1 1 0V1h.5C8.33 1 9 1.67 9 2.5v1a.5.5 0 0 1-.5.5H1v4c0 .28.22.5.5.5h2a.5.5 0 0 1 0 1h-2C.67 9.5 0 8.83 0 8V2.5C0 1.67.67 1 1.5 1H2V.5a.5.5 0 0 1 .5-.5Z" fill="currentColor"/><path d="M7 6.19a1.81 1.81 0 0 0-.48.09l.3.3a.25.25 0 0 1-.18.42H5.5a.5.5 0 0 1-.5-.5v-1.15a.25.25 0 0 1 .43-.18l.35.35A2.31 2.31 0 0 1 7 5.19a2.32 2.32 0 0 1 2.22 1.67.5.5 0 0 1-.97.26A1.32 1.32 0 0 0 7 6.19Z" fill="currentColor"/><path d="M5.74 7.86a.5.5 0 0 0-.96.26A2.32 2.32 0 0 0 7 9.81c.44 0 .86-.13 1.22-.34l.35.35a.25.25 0 0 0 .43-.18V8.5a.5.5 0 0 0-.5-.5h-1.15a.25.25 0 0 0-.18.43l.3.3A1.81 1.81 0 0 1 7 8.81c-.6 0-1.1-.4-1.26-.95Z" fill="currentColor"/></svg>,
};

function fmtCurrency(v: number) {
  return new Intl.NumberFormat("en-US", { currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2, style: "currency" }).format(v);
}

function fmtCompact(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(Math.round(v));
}

function buildChartData(cfg: ShowcaseConfig): AnalyticsPocPerformanceLineChartData {
  const avgViews = cfg.totalViews / 11;
  const avgPayouts = cfg.totalEarnings / 11;
  const points = Array.from({ length: 11 }, (_, i) => {
    const wave = 1 + Math.sin((i - 2) / 1.9) * 0.3 + Math.cos(i / 4.2) * 0.2;
    return {
      index: i,
      label: ["Jan 5", "Jan 8", "Jan 11", "Jan 14", "Jan 17", "Jan 20", "Jan 23", "Jan 26", "Jan 30", "Feb 2", "Feb 5"][i],
      views: Math.round(avgViews * wave),
      engagement: Math.round(avgPayouts * wave),
      likes: 0,
      comments: 0,
      shares: 0,
    };
  });
  const maxViews = Math.max(...points.map((p) => p.views));
  const maxPayouts = Math.max(...points.map((p) => p.engagement));
  const viewsDomain = Math.ceil(maxViews / 100000) * 100000;
  const payoutsDomain = Math.ceil(maxPayouts / 100) * 100;

  return {
    datasets: { daily: points, cumulative: points },
    leftDomain: [0, viewsDomain],
    rightDomain: [0, payoutsDomain],
    rightYLabels: [`$${fmtCompact(payoutsDomain)}`, `$${fmtCompact(payoutsDomain * 0.75)}`, `$${fmtCompact(payoutsDomain * 0.5)}`, `$${fmtCompact(payoutsDomain * 0.25)}`, "$0"],
    series: [
      { axis: "left", color: "#1A67E5", domain: [0, viewsDomain], key: "views", label: "Views", tooltipValueType: "number", yLabels: [fmtCompact(viewsDomain), fmtCompact(viewsDomain * 0.75), fmtCompact(viewsDomain * 0.5), fmtCompact(viewsDomain * 0.25), "0"] },
      { axis: "right", color: "#00994D", domain: [0, payoutsDomain], key: "engagement", label: "Payouts", tooltipValueType: "currency", yLabels: [`$${fmtCompact(payoutsDomain)}`, `$${fmtCompact(payoutsDomain * 0.75)}`, `$${fmtCompact(payoutsDomain * 0.5)}`, `$${fmtCompact(payoutsDomain * 0.25)}`, "$0"] },
    ],
    xTicks: [
      { index: 0, label: "Jan 5" }, { index: 2, label: "Jan 11" }, { index: 4, label: "Jan 17" },
      { index: 6, label: "Jan 23" }, { index: 8, label: "Jan 30" }, { index: 10, label: "Feb 5" },
    ],
    yLabels: [fmtCompact(viewsDomain), fmtCompact(viewsDomain * 0.75), fmtCompact(viewsDomain * 0.5), fmtCompact(viewsDomain * 0.25), "0"],
  };
}

function StatCard({ s }: { s: { value: string; label: string; color: string; bg: string; icon: React.ReactNode } }) {
  return (
    <div className={cn(cardCls, "flex h-[61px] items-center gap-3 overflow-hidden pr-3")}>
      <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
        <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
          <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill={s.bg} />
        </svg>
        <div className="relative flex h-full w-full items-center justify-center">{s.icon}</div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{s.value}</span>
        <span className="text-xs tracking-[-0.02em] text-page-text-muted">{s.label}</span>
      </div>
    </div>
  );
}

export default function ShowcaseInsightsPage() {
  const [cfg, setCfg] = useState<ShowcaseConfig | null>(null);
  useEffect(() => { setCfg(loadShowcaseConfig()); }, []);

  const [chartTab, setChartTab] = useState<"views" | "payouts">("views");
  const [metricState, setMetricState] = useState<Record<string, boolean>>({ views: true, engagement: false });
  const toggleMetric = useCallback((key: string) => { setMetricState((prev) => ({ ...prev, [key]: !prev[key] })); }, []);
  const visibleMetricKeys = useMemo(() => Object.entries(metricState).filter(([, on]) => on).map(([k]) => k), [metricState]);

  const campaignTableRef = useRef<HTMLDivElement>(null);
  const campaignHover = useProximityHover(campaignTableRef);
  const campaignActiveRect = campaignHover.activeIndex !== null ? campaignHover.itemRects[campaignHover.activeIndex] : null;
  useEffect(() => { campaignHover.measureItems(); }, [campaignHover.measureItems]);

  if (!cfg) return null;

  const chartData = buildChartData(cfg);

  const stats = [
    { value: fmtCurrency(cfg.totalEarnings), label: "Payouts", color: "#00994D", bg: "rgba(0,153,77,0.08)", icon: <MoneybagIcon color="#00994D" /> },
    { value: fmtCompact(cfg.totalViews), label: "Views", color: "#1A67E5", bg: "rgba(26,103,229,0.08)", icon: <EyeIcon color="#1A67E5" /> },
    { value: String(cfg.activeCampaigns), label: "Campaigns", color: "#E57100", bg: "rgba(229,113,0,0.08)", icon: <MegaphoneIcon color="#E57100" /> },
    { value: String(cfg.totalSubmissions), label: "Submissions", color: "#FF3355", bg: "rgba(255,51,85,0.08)", icon: <VideoPlaylistIcon color="#FF3355" /> },
  ];

  const campaignRows = [
    { name: "Flooz Clipping", type: "CPM", typeColor: "#1A67E5", views: fmtCompact(cfg.totalViews * 0.4), clips: String(Math.round(cfg.totalSubmissions * 0.4)), approved: String(Math.round(cfg.totalSubmissions * 0.4 * cfg.approvalRate / 100)), earned: fmtCurrency(cfg.totalEarnings * 0.45), earnedColor: "#00994D", rate: `$${cfg.effectiveCpm.toFixed(2)}/1k` },
    { name: "Flooz Clipping", type: "CPM", typeColor: "#1A67E5", views: fmtCompact(cfg.totalViews * 0.25), clips: String(Math.round(cfg.totalSubmissions * 0.25)), approved: String(Math.round(cfg.totalSubmissions * 0.25 * cfg.approvalRate / 100)), earned: fmtCurrency(cfg.totalEarnings * 0.2), earnedColor: "#00994D", rate: `$${(cfg.effectiveCpm * 0.7).toFixed(2)}/1k` },
    { name: "Flooz Clipping", type: "CPM", typeColor: "#1A67E5", views: fmtCompact(cfg.totalViews * 0.15), clips: String(Math.round(cfg.totalSubmissions * 0.15)), approved: String(Math.round(cfg.totalSubmissions * 0.15 * cfg.approvalRate / 100)), earned: fmtCurrency(cfg.totalEarnings * 0.12), earnedColor: "#00994D", rate: `$${(cfg.effectiveCpm * 0.8).toFixed(2)}/1k` },
    { name: "Discord - Community", type: "Per video", typeColor: "#00994D", views: "31K", clips: "3", approved: "2", earned: "$75", earnedColor: "#00994D", rate: "$25/vid" },
    { name: "Netflix - Reaction Clips", type: "Retainer", typeColor: "#E57100", views: fmtCompact(cfg.totalViews * 0.1), clips: "3", approved: "2", earned: fmtCurrency(cfg.totalEarnings * 0.15), earnedColor: "#00994D", rate: "$750/mo" },
  ];

  const platforms = [
    { name: "Instagram", platformId: "instagram", bg: "rgba(174,78,238,0.1)", clips: `${Math.round(cfg.totalSubmissions * cfg.instagramPct / 100)} clips`, views: fmtCompact(cfg.totalViews * cfg.instagramPct / 100), barWidth: `${cfg.instagramPct}%` },
    { name: "TikTok", platformId: "tiktok", bg: "rgba(0,153,77,0.08)", clips: `${Math.round(cfg.totalSubmissions * cfg.tiktokPct / 100)} clips`, views: fmtCompact(cfg.totalViews * cfg.tiktokPct / 100), barWidth: `${cfg.tiktokPct}%` },
    { name: "YouTube", platformId: "youtube", bg: "rgba(255,51,85,0.1)", clips: `${Math.round(cfg.totalSubmissions * cfg.youtubePct / 100)} clips`, views: fmtCompact(cfg.totalViews * cfg.youtubePct / 100), barWidth: `${cfg.youtubePct}%` },
    { name: "X (Twitter)", platformId: "x", bg: "rgba(224,224,224,0.06)", clips: `${Math.round(cfg.totalSubmissions * cfg.xPct / 100)} clips`, views: fmtCompact(cfg.totalViews * cfg.xPct / 100), barWidth: `${cfg.xPct}%` },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <CreatorHeader title="Insights" />

      <div className="mx-auto flex w-full max-w-[756px] flex-col gap-4 px-4 py-4 sm:px-5 md:px-4">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {stats.map((s) => <StatCard key={s.label} s={s} />)}
        </div>

        {/* Chart card */}
        <div className={cn(cardCls, "flex flex-col justify-center gap-4 p-4")}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-2xl font-medium tracking-[-0.02em] text-page-text">{fmtCompact(cfg.totalViews)}</span>
            <div className="flex self-start rounded-[10px] bg-foreground/[0.06] p-0.5 dark:bg-white/[0.06] sm:self-auto">
              <button
                onClick={() => { setChartTab("views"); setMetricState({ views: true, engagement: false }); }}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", chartTab === "views" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg" : "text-page-text-muted")}
              >Views</button>
              <button
                onClick={() => { setChartTab("payouts"); setMetricState({ views: false, engagement: true }); }}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", chartTab === "payouts" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg" : "text-page-text-muted")}
              >Payouts</button>
            </div>
          </div>
          <AnalyticsPocChartPlaceholder
            variant="line"
            chartStylePreset="performance-main"
            lineChart={chartData}
            activeLineDataset="daily"
            visibleMetricKeys={visibleMetricKeys}
            heightClassName="h-[220px]"
          />
        </div>

        {/* Campaign table */}
        <div className={cn(cardCls, "flex flex-col")}>
          <div className="hidden border-b border-foreground/[0.06] px-1 md:flex dark:border-[rgba(224,224,224,0.03)]">
            <div className="flex flex-1 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Campaign</span></div>
            <div className="flex w-28 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Type</span></div>
            <div className="flex w-16 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Views</span></div>
            <div className="flex w-16 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Clips</span></div>
            <div className="flex w-20 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Approved</span></div>
            <div className="flex w-24 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Earned</span></div>
            <div className="flex w-20 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Rate</span></div>
          </div>
          <div className="flex items-center border-b border-foreground/[0.06] px-1 md:hidden dark:border-[rgba(224,224,224,0.03)]">
            <div className="flex flex-1 items-center p-3"><span className="text-xs font-medium text-page-text-subtle">Campaign</span></div>
            <div className="flex w-20 items-center justify-end p-3"><span className="text-xs font-medium text-page-text-subtle">Rate &amp; earned</span></div>
          </div>
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
                  className="pointer-events-none absolute z-0 rounded-xl bg-foreground/[0.04]"
                  initial={{ opacity: 0, ...campaignActiveRect }}
                  animate={{ opacity: 1, ...campaignActiveRect }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {campaignRows.map((r, i) => (
              <div key={i} ref={(el) => campaignHover.registerItem(i, el)} className={cn("relative z-[1] flex cursor-pointer items-center px-1", i < campaignRows.length - 1 && "border-b border-foreground/[0.03] dark:border-[rgba(224,224,224,0.01)]")}>
                <div className="flex flex-1 items-center gap-2 p-3">
                  <div className="size-9 shrink-0 rounded-full border border-foreground/[0.06] bg-gradient-to-br from-blue-400 to-purple-500 dark:border-[rgba(224,224,224,0.03)]" />
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-xs font-medium text-page-text">{r.name}</span>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1 text-xs font-medium dark:border-[rgba(224,224,224,0.03)]" style={{ color: r.typeColor }}>{TYPE_ICONS[r.type]}{r.type}</span>
                  </div>
                </div>
                <div className="hidden w-16 items-center p-3 md:flex"><span className="text-xs text-page-text">{r.views}</span></div>
                <div className="hidden w-16 items-center p-3 md:flex"><span className="text-xs text-page-text">{r.clips}</span></div>
                <div className="hidden w-20 items-center p-3 md:flex"><span className="text-xs text-page-text">{r.approved}</span></div>
                <div className="hidden w-24 items-center p-3 md:flex"><span className="text-xs text-[#00994D] dark:text-[#34D399]">{r.earned}</span></div>
                <div className="hidden w-20 items-center p-3 md:flex"><span className="text-xs text-page-text">{r.rate}</span></div>
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
