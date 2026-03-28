"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import {
  AnalyticsPocToggleGroup,
  AnalyticsPocToggleGroupItem,
} from "@/components/analytics-poc/AnalyticsPocToggleGroup";
import { AnalyticsPocChartToggleChip } from "@/components/analytics-poc/AnalyticsPocChartToggleChip";
import { AnalyticsPocDateRangePicker } from "@/components/analytics-poc/AnalyticsPocDateRangePicker";
import type {
  AnalyticsPocPerformanceLineChartData,
  AnalyticsPocPerformanceLineDataPoint,
} from "@/components/analytics-poc/types";

const muted = "text-page-text-muted";
const cardClass = "flex flex-col justify-center rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(255,255,255,0.02)] dark:shadow-none";

const STATS = [
  {
    value: "95%",
    highlight: "1,936 filled",
    highlightColor: "#00994D",
    label: "Fill rate",
    secondary: "3,000 total",
  },
  {
    value: "36.9%",
    highlight: "2,620 approved",
    highlightColor: "#00994D",
    label: "Approval rate",
    secondary: "14,733 total",
  },
  {
    value: "94%",
    highlight: "142 churned",
    highlightColor: "#FF3355",
    label: "Creator retention",
    secondary: "1,936 total",
  },
];

function AnalyticsStatCard({ s }: { s: typeof STATS[number] }) {
  return (
    <div className={cn(cardClass, "h-16 gap-2")}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{s.value}</span>
        <span className="text-[12px] font-medium tracking-[-0.02em]" style={{ color: s.highlightColor }}>{s.highlight}</span>
      </div>
      <div className="flex items-center justify-between gap-1.5">
        <span className={cn("text-[12px]", muted)}>{s.label}</span>
        <span className={cn("text-[12px] font-medium", muted)}>{s.secondary}</span>
      </div>
    </div>
  );
}

function AnalyticsStatCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).offsetWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, STATS.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* Mobile */}
      <div className="-mx-4 flex flex-col items-center gap-2 sm:-mx-5 md:hidden">
        <div ref={scrollRef} className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 scrollbar-hide sm:pl-5 [scroll-padding-inline:16px]">
          {STATS.map((s, i) => (
            <div key={s.label} className={cn(
              "w-[calc(100vw-56px)] max-w-80 shrink-0",
              "snap-start",
              i === STATS.length - 1 && "mr-4 sm:mr-5",
            )}>
              <AnalyticsStatCard s={s} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {STATS.map((_, i) => (
            <button key={i} type="button" onClick={() => {
              const child = scrollRef.current?.children[i] as HTMLElement | undefined;
              child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }} className={cn("size-1.5 cursor-pointer rounded-full transition-colors", i === activeIndex ? "bg-[#252525] dark:bg-[#E0E0E0]" : "bg-[rgba(37,37,37,0.1)] dark:bg-[rgba(224,224,224,0.1)]")} />
          ))}
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden gap-2 md:grid md:grid-cols-3">
        {STATS.map((s) => <AnalyticsStatCard key={s.label} s={s} />)}
      </div>
    </>
  );
}

export default function AnalyticsTab() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://cr.link/flooz-ai-q1");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-col gap-2">
        {/* Stat cards — swipeable on mobile */}
        <AnalyticsStatCards />

        {/* Tracking link card */}
        <div className={cn("flex h-16 w-full items-center justify-between rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(255,255,255,0.02)] dark:shadow-none lg:w-[320px]")}>
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
              Tracking link
            </span>
            <span className={cn("truncate text-[12px]", muted)}>
              https://cr.link/flooz-ai-q1
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "ml-3 flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-medium tracking-[-0.02em] transition-all",
              copied
                ? "bg-[#00994D] text-white"
                : "bg-[#252525] text-white hover:bg-[#333] dark:bg-[#e5e5e5] dark:text-[#1a1a1a] dark:hover:bg-[#d5d5d5]",
            )}
          >
            <span className="inline-grid">
              <span className="invisible col-start-1 row-start-1">Copy Link</span>
              <span className="col-start-1 row-start-1 text-center">{copied ? "Copied!" : "Copy Link"}</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
              {copied ? (
                <path d="M3.33 8L6.67 11.33 12.67 4.67" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M10.667 3.33333H12.0003C12.7367 3.33333 13.3337 3.93029 13.3337 4.66667V12.6667C13.3337 13.403 12.7367 14 12.0003 14H4.00033C3.26395 14 2.66699 13.403 2.66699 12.6667V4.66667C2.66699 3.93029 3.26395 3.33333 4.00033 3.33333H5.33366M10.667 3.33333V4.66667H5.33366V3.33333M10.667 3.33333C10.667 2.59695 10.07 2 9.33366 2H6.66699C5.93061 2 5.33366 2.59695 5.33366 3.33333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>

        {/* Section 1: Health + Platform Performance */}
        <HealthAndPlatformRow />

        {/* Section 2: Performance chart */}
        <PerformanceChartCard />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 1 — Health + Platform Performance                         */
/* ------------------------------------------------------------------ */

const sectionCard =
  "rounded-2xl border border-foreground/[0.06] bg-white p-4 dark:bg-card-bg";

const HEALTH_BREAKDOWN = [
  { label: "Fill rate", weight: "20%", score: 68, color: "#E57100" },
  { label: "Engagement", weight: "25%", score: 82, color: "#00994D" },
  { label: "Approval rate", weight: "20%", score: 80, color: "#00994D" },
  { label: "CPM efficiency", weight: "20%", score: 84, color: "#00994D" },
  { label: "Creator quality", weight: "15%", score: 71, color: "#E57100" },
];

function HealthGauge() {
  const radius = 66;
  const stroke = 4;
  const center = 74;
  const circumference = 2 * Math.PI * radius;
  const progress = 76 / 100;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg width={148} height={148} viewBox="0 0 148 148" className="shrink-0">
      {/* Background ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-foreground/[0.06]"
        strokeWidth={stroke}
      />
      {/* Progress ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#00994D"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      {/* Score */}
      <text
        x={center}
        y={center - 4}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-page-text font-inter text-[48px] font-semibold tracking-[-0.03em]"
      >
        76
      </text>
      {/* Label */}
      <text
        x={center}
        y={center + 26}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-[#00994D] font-inter text-[13px] font-medium"
      >
        Healthy
      </text>
    </svg>
  );
}

function HealthCard() {
  return (
    <div className={cn(sectionCard, "flex-1")}>
      <span className="text-[12px] text-foreground/50">Health</span>
      <div className="mt-3 flex flex-row gap-6">
        <HealthGauge />
        <div className="flex flex-1 flex-col">
          {HEALTH_BREAKDOWN.map((item, i) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center justify-between py-2",
                i < HEALTH_BREAKDOWN.length - 1 &&
                  "border-b border-foreground/[0.06]",
              )}
            >
              <span className="text-[14px] text-page-text">{item.label}</span>
              <span className="flex items-center gap-1.5 text-[13px] tabular-nums text-page-text-muted">
                {item.weight}
                <span className="text-foreground/20">&middot;</span>
                <span style={{ color: item.color }} className="font-medium">
                  {item.score}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PLATFORM_ROWS = [
  {
    platform: "instagram",
    name: "Instagram",
    pct: 62,
    views: "1.2M views",
    color: "#AE4EEE",
    bgOpacity: 0.1,
  },
  {
    platform: "tiktok",
    name: "TikTok",
    pct: 28,
    views: "480K views",
    color: "#00994D",
    bgOpacity: 0.08,
  },
  {
    platform: "youtube",
    name: "YouTube",
    pct: 15,
    views: "120K views",
    color: "#FF3355",
    bgOpacity: 0.1,
  },
  {
    platform: "facebook",
    name: "Facebook",
    pct: 8,
    views: "80K views",
    color: "#1A67E5",
    bgOpacity: 0.08,
  },
];

/** Inline Facebook icon since PlatformIcon doesn't include it */
function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 8a8 8 0 10-9.25 7.903v-5.59H4.719V8H6.75V6.237c0-2.005 1.194-3.112 3.022-3.112.875 0 1.79.156 1.79.156V5.25h-1.008c-.994 0-1.304.617-1.304 1.25V8h2.219l-.355 2.313H9.25v5.59A8.002 8.002 0 0016 8z"
        fill="#1877F2"
      />
    </svg>
  );
}

function PlatformPerformanceCard() {
  return (
    <div className={cn(sectionCard, "flex-1 !px-0 !py-4")}>
      <span className="px-4 text-[12px] text-foreground/50">
        Performance per platform
      </span>
      <div className="mt-3 flex flex-col gap-2 px-4">
        {PLATFORM_ROWS.map((row) => (
          <div
            key={row.platform}
            className="relative flex h-10 items-center gap-2.5 overflow-hidden rounded-xl px-3"
          >
            {/* Colored background bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-xl"
              style={{
                width: `${row.pct}%`,
                backgroundColor: row.color,
                opacity: row.bgOpacity,
              }}
            />
            {/* Content */}
            <span className="relative shrink-0">
              {row.platform === "facebook" ? (
                <FacebookIcon size={16} />
              ) : (
                <PlatformIcon platform={row.platform} size={16} />
              )}
            </span>
            <span className="relative text-[14px] font-medium text-page-text">
              {row.name}
            </span>
            <span className="relative ml-auto flex items-center gap-1.5 text-[13px] tabular-nums text-page-text-muted">
              {row.pct}%
              <span className="text-foreground/20">&middot;</span>
              {row.views}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthAndPlatformRow() {
  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <HealthCard />
      <PlatformPerformanceCard />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 2 — Performance Chart                                     */
/* ------------------------------------------------------------------ */

const METRIC_PILLS = [
  { key: "views", label: "Clicks", value: "1.2M", color: "#1A67E5" },
  { key: "engagement", label: "Visitors", value: "48.2K", color: "#DA5597" },
  { key: "likes", label: "Conv. rate", value: "4.8%", color: "#AE4EEE" },
  { key: "comments", label: "Conversions", value: "3.1K", color: "#E57100" },
];

function generateMockLineData(): AnalyticsPocPerformanceLineChartData {
  const days = 30;
  const daily: AnalyticsPocPerformanceLineDataPoint[] = [];
  const cumulative: AnalyticsPocPerformanceLineDataPoint[] = [];
  let cumViews = 0;
  let cumEng = 0;
  let cumLikes = 0;
  let cumComments = 0;

  for (let i = 0; i < days; i++) {
    const views = 30000 + Math.round(Math.random() * 20000);
    const engagement = 1200 + Math.round(Math.random() * 800);
    const likes = 800 + Math.round(Math.random() * 600);
    const comments = 60 + Math.round(Math.random() * 80);

    daily.push({
      index: i,
      label: `Mar ${i + 1}`,
      views,
      engagement,
      likes,
      comments,
      shares: 0,
    });

    cumViews += views;
    cumEng += engagement;
    cumLikes += likes;
    cumComments += comments;

    cumulative.push({
      index: i,
      label: `Mar ${i + 1}`,
      views: cumViews,
      engagement: cumEng,
      likes: cumLikes,
      comments: cumComments,
      shares: 0,
    });
  }

  const xTicks = [
    { index: 0, label: "Mar 1" },
    { index: 7, label: "Mar 8" },
    { index: 14, label: "Mar 15" },
    { index: 21, label: "Mar 22" },
    { index: 29, label: "Mar 30" },
  ];

  return {
    datasets: { daily, cumulative },
    series: [
      {
        key: "views",
        label: "Clicks",
        color: "#1A67E5",
        axis: "left" as const,
        domain: [0, 60000] as [number, number],
        tooltipValueType: "number" as const,
        yLabels: ["60K", "45K", "30K", "15K", "0"],
      },
      {
        key: "engagement",
        label: "Visitors",
        color: "#DA5597",
        axis: "left" as const,
        domain: [0, 2500] as [number, number],
        tooltipValueType: "number" as const,
      },
      {
        key: "likes",
        label: "Conv. rate",
        color: "#AE4EEE",
        axis: "right" as const,
        domain: [0, 2000] as [number, number],
        tooltipValueType: "percent" as const,
      },
      {
        key: "comments",
        label: "Conversions",
        color: "#E57100",
        axis: "right" as const,
        domain: [0, 200] as [number, number],
        tooltipValueType: "number" as const,
      },
    ],
    xTicks,
    yLabels: ["0", "15K", "30K", "45K", "60K"],
    rightYLabels: ["0", "500", "1K", "1.5K", "2K"],
  };
}

const MOCK_LINE_CHART = generateMockLineData();

function PerformanceChartCard() {
  const [activeDataset, setActiveDataset] = useState<"daily" | "cumulative">(
    "daily",
  );
  const [visibleMetrics, setVisibleMetrics] = useState<string[]>(
    METRIC_PILLS.map((m) => m.key),
  );

  const toggleMetric = (key: string) => {
    setVisibleMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <div
      className={cn(sectionCard, "[--ap-toggle-bg:rgba(37,37,37,0.04)] [--ap-toggle-thumb:#FFFFFF] dark:[--ap-toggle-bg:rgba(224,224,224,0.06)] dark:[--ap-toggle-thumb:rgba(224,224,224,0.06)]")}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2">
        <AnalyticsPocToggleGroup
          value={activeDataset}
          onValueChange={(v) =>
            setActiveDataset(v as "daily" | "cumulative")
          }
        >
          <AnalyticsPocToggleGroupItem value="daily">
            Daily performance
          </AnalyticsPocToggleGroupItem>
          <AnalyticsPocToggleGroupItem value="cumulative">
            Cumulative
          </AnalyticsPocToggleGroupItem>
        </AnalyticsPocToggleGroup>

        <AnalyticsPocDateRangePicker value="last-30-days" onValueChange={() => {}} />
      </div>

      {/* Metric pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {METRIC_PILLS.map((pill) => (
          <AnalyticsPocChartToggleChip
            key={pill.key}
            label={pill.label}
            value={pill.value}
            metricKey={pill.key}
            seriesColor={pill.color}
            enabled={visibleMetrics.includes(pill.key)}
            onToggle={toggleMetric}
          />
        ))}
      </div>

      {/* Chart */}
      <div className="mt-4">
        <AnalyticsPocChartPlaceholder
          variant="line"
          chartStylePreset="performance-main"
          lineChart={MOCK_LINE_CHART}
          activeLineDataset={activeDataset}
          visibleMetricKeys={visibleMetrics}
          heightClassName="h-[240px]"
        />
      </div>
    </div>
  );
}
