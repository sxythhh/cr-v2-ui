"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocPanel } from "./AnalyticsPocPanel";
import { AnalyticsPocToggleGroup, AnalyticsPocToggleGroupItem } from "./AnalyticsPocToggleGroup";

// ── Icons ────────────────────────────────────────────────────────────

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M8 1L9.79 6.21L15 8L9.79 9.79L8 15L6.21 9.79L1 8L6.21 6.21L8 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5.5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3L10.5 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LayoutIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M2.77431 5.36958e-07H9.2257C9.57712 -1.08734e-05 9.88031 -2.07163e-05 10.13 0.0203813C10.3936 0.0419153 10.6557 0.0894593 10.908 0.217989C11.2843 0.409735 11.5903 0.715697 11.782 1.09202C11.9105 1.34427 11.9581 1.60642 11.9796 1.86998C12 2.11969 12 2.42286 12 2.77429L12 6.66667L5.32571e-07 6.66667V2.7743C-1.08154e-05 2.42288 -2.06046e-05 2.11969 0.0203814 1.86998C0.0419154 1.60642 0.0894593 1.34427 0.217989 1.09202C0.409735 0.715697 0.715697 0.409735 1.09202 0.217989C1.34427 0.0894593 1.60642 0.0419153 1.86998 0.0203813C2.11969 -2.07163e-05 2.42288 -1.08733e-05 2.77431 5.36958e-07Z" fill="currentColor" fillOpacity="0.7"/>
      <path d="M5.32571e-07 8V9.2257C-1.08155e-05 9.57712 -2.06046e-05 9.88031 0.0203814 10.13C0.0419154 10.3936 0.0894593 10.6557 0.217989 10.908C0.409735 11.2843 0.715697 11.5903 1.09202 11.782C1.34427 11.9105 1.60642 11.9581 1.86998 11.9796C2.11969 12 2.42286 12 2.77429 12H9.22571C9.57714 12 9.88031 12 10.13 11.9796C10.3936 11.9581 10.6557 11.9105 10.908 11.782C11.2843 11.5903 11.5903 11.2843 11.782 10.908C11.9105 10.6557 11.9581 10.3936 11.9796 10.13C12 9.88031 12 9.57714 12 9.22571L12 8L5.32571e-07 8Z" fill="currentColor" fillOpacity="0.7"/>
    </svg>
  );
}

function ChevronDoubleUpIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M5.33 8L8 5.33L10.67 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.33 11.33L8 8.67L10.67 11.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDoubleDownIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M5.33 5.33L8 8L10.67 5.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.33 8.67L8 11.33L10.67 8.67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4.67 8H11.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4 0C2.61929 0 1.5 1.11929 1.5 2.5V3.5C0.671573 3.5 0 4.17157 0 5V8.5C0 9.32843 0.671573 10 1.5 10H6.5C7.32843 10 8 9.32843 8 8.5V5C8 4.17157 7.32843 3.5 6.5 3.5V2.5C6.5 1.11929 5.38071 0 4 0ZM5.5 3.5V2.5C5.5 1.67157 4.82843 1 4 1C3.17157 1 2.5 1.67157 2.5 2.5V3.5H5.5ZM4 5.5C4.27614 5.5 4.5 5.72386 4.5 6V7.5C4.5 7.77614 4.27614 8 4 8C3.72386 8 3.5 7.77614 3.5 7.5V6C3.5 5.72386 3.72386 5.5 4 5.5Z" fill="#FB923C"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6.41543 1.73708C6.23505 1.54635 6.09457 1.5006 6.00022 1.5006C5.90586 1.5006 5.76538 1.54635 5.585 1.73708C5.40363 1.92886 5.21726 2.23321 5.05024 2.65076C4.75956 3.37746 4.55718 4.37235 4.5105 5.5006L7.48993 5.5006C7.44325 4.37235 7.24087 3.37746 6.95019 2.65076C6.78317 2.23321 6.5968 1.92886 6.41543 1.73708Z" fill="#34D399"/>
      <path d="M7.48993 6.5006L4.5105 6.5006C4.55718 7.62886 4.75956 8.62374 5.05024 9.35044C5.21726 9.76799 5.40363 10.0723 5.585 10.2641C5.76538 10.4549 5.90586 10.5006 6.00022 10.5006C6.09457 10.5006 6.23505 10.4549 6.41543 10.2641C6.5968 10.0723 6.78317 9.76799 6.95019 9.35044C7.24087 8.62374 7.44325 7.62886 7.48993 6.5006Z" fill="#34D399"/>
      <path d="M3.50971 5.5006C3.55682 4.26702 3.77692 3.14148 4.12176 2.27937C4.29589 1.84405 4.50967 1.45613 4.76518 1.1543C2.75744 1.66439 1.23452 3.38933 1.0249 5.5006H3.50971Z" fill="#34D399"/>
      <path d="M1.0249 6.5006H3.50971C3.55682 7.73419 3.77692 8.85972 4.12176 9.72183C4.29589 10.1572 4.50967 10.5451 4.76518 10.8469C2.75744 10.3368 1.23452 8.61188 1.0249 6.5006Z" fill="#34D399"/>
      <path d="M8.49072 6.5006H10.9755C10.7659 8.61188 9.24299 10.3368 7.23525 10.8469C7.49076 10.5451 7.70454 10.1572 7.87867 9.72183C8.22351 8.85973 8.44361 7.73419 8.49072 6.5006Z" fill="#34D399"/>
      <path d="M10.9755 5.5006C10.7659 3.38933 9.24299 1.66439 7.23525 1.1543C7.49076 1.45613 7.70454 1.84405 7.87867 2.27937C8.22351 3.14148 8.44361 4.26702 8.49072 5.5006H10.9755Z" fill="#34D399"/>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────

const STATS = [
  { label: "Discover impressions", value: "18,429", change: "+22.1%", showChange: true },
  { label: "Unique creators", value: "12,108", change: "+18.3%", showChange: false },
  { label: "Campaign clicks", value: "3,216", change: "+14.6%", showChange: true },
  { label: "CTR", value: "17.5%", change: "+1.8%", showChange: true },
  { label: "Conversions", value: "891", change: "+31.2%", showChange: true },
];

const FUNNEL_SEGMENTS = [
  { label: "Impressions", color: "rgba(52, 211, 153, 0.6)", value: "18.4K", pct: "100%", width: "52.8%", dotColor: "#34D399" },
  { label: "Clicks", color: "rgba(96, 165, 250, 0.6)", value: "3.2K", pct: "17.5%", width: "19.6%", dotColor: "#60A5FA" },
  { label: "Applied", color: "rgba(251, 146, 60, 0.6)", value: "891", pct: "27.7%", width: "15.1%", dotColor: "#FB923C" },
  { label: "Joined", color: "rgba(244, 114, 182, 0.6)", value: "287", pct: "32.2%", width: "12.5%", dotColor: "#F472B6" },
];

const INSIGHTS = [
  { text: "FanDuel thumbnail outperforms by 38%", action: "Generate thumbnails" },
  { text: "DraftKings posts peak on Wednesdays at 6pm", action: "Schedule posts" },
  { text: "TikTok Only has highest CTR at 20%", action: "View breakdown" },
];

type CampaignType = "apply" | "open";

interface CampaignRow {
  name: string;
  avatar: string;
  type: CampaignType;
  impressions: string;
  clicks: string;
  ctr: string;
  conversions: string;
  convRate: string;
  trend: { value: string; direction: "up" | "down" | "flat" };
}

const CAMPAIGN_ROWS: CampaignRow[] = [
  { name: "FanDuel", avatar: "/logos/brand1.jpg", type: "apply", impressions: "9,214", clicks: "1,843", ctr: "20.0%", conversions: "512 applied", convRate: "27.8%", trend: { value: "3.2%", direction: "up" } },
  { name: "DraftKings", avatar: "/logos/brand2.jpg", type: "open", impressions: "5,102", clicks: "818", ctr: "16.0%", conversions: "347 joined", convRate: "42.8%", trend: { value: "1.4%", direction: "up" } },
  { name: "TikTok Only", avatar: "/logos/brand3.jpg", type: "open", impressions: "5,102", clicks: "818", ctr: "16.0%", conversions: "347 joined", convRate: "42.8%", trend: { value: "0.9%", direction: "up" } },
  { name: "Q2 Push", avatar: "/logos/brand4.jpg", type: "open", impressions: "5,102", clicks: "818", ctr: "16.0%", conversions: "347 joined", convRate: "42.8%", trend: { value: "0.0%", direction: "flat" } },
  { name: "Holiday Special", avatar: "/logos/brand5.jpg", type: "apply", impressions: "512", clicks: "67", ctr: "13.1%", conversions: "18 applied", convRate: "56.0%", trend: { value: "1.1%", direction: "down" } },
];

const TABLE_COLUMNS = ["Campaign", "Type", "Impressions", "Clicks", "CTR", "Conversions", "Conv. rate", "Trend"];

// ── Components ──────────────────────────────────────────────────────

function TypeBadge({ type }: { type: CampaignType }) {
  if (type === "apply") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(251,146,60,0.08)] py-1.5 pl-1.5 pr-2 text-xs font-medium text-[#FB923C]">
        <LockIcon />
        Apply
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(52,211,153,0.08)] py-1.5 pl-1.5 pr-2 text-xs font-medium text-[#34D399]">
      <GlobeIcon />
      Open
    </span>
  );
}

function TrendCell({ trend }: { trend: CampaignRow["trend"] }) {
  if (trend.direction === "flat") {
    return (
      <div className="flex items-center justify-end gap-0.5">
        <MinusIcon className="size-4 text-page-text-muted" />
        <span className="text-xs tracking-[-0.02em] text-page-text-muted">{trend.value}</span>
      </div>
    );
  }
  if (trend.direction === "down") {
    return (
      <div className="flex items-center justify-end gap-0.5">
        <ChevronDoubleDownIcon className="size-4 text-[#FB7185]" />
        <span className="text-xs tracking-[-0.02em] text-[#FB7185]">{trend.value}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-end gap-0.5">
      <ChevronDoubleUpIcon className="size-4 text-[#34D399]" />
      <span className="text-xs tracking-[-0.02em] text-[#34D399]">{trend.value}</span>
    </div>
  );
}

// ── Mobile Helpers ──────────────────────────────────────────────────

function MobileStatScroll({ stats }: { stats: typeof STATS }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).clientWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, stats.length - 1));
  }, [stats.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scrollbar-hide"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="w-full shrink-0 snap-center rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-card-inner-border dark:bg-card-inner-bg dark:shadow-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium tracking-[-0.02em] text-page-text tabular-nums">{stat.value}</span>
              {stat.showChange && (
                <span className="text-xs font-medium tracking-[-0.02em] text-[#34D399]">{stat.change}</span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-xs tracking-[-0.02em] text-page-text-muted">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
      {stats.length > 1 && (
        <div className="flex items-center justify-center gap-1">
          {stats.map((_, i) => (
            <div
              key={i}
              className={cn(
                "size-1.5 rounded-full transition-colors duration-200",
                i === activeIndex ? "bg-foreground" : "bg-foreground/[0.06]",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileCampaignCard({ row }: { row: CampaignRow }) {
  return (
    <div className="flex items-center gap-0 border-b border-foreground/[0.03] px-1">
      <div className="flex flex-1 flex-col gap-3 py-3 pr-3 pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 overflow-hidden rounded-full border border-foreground/[0.06]">
              <Image
                src={row.avatar}
                alt={row.name}
                width={24}
                height={24}
                className="size-6 object-cover"
              />
            </div>
            <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{row.name}</span>
          </div>
          <TypeBadge type={row.type} />
        </div>
        <div className="flex items-center justify-between gap-2 text-xs tracking-[-0.02em] text-page-text-muted tabular-nums">
          <span>Imp. {row.impressions}</span>
          <span>Clicks {row.clicks}</span>
          <span>CTR {row.ctr}</span>
          <TrendCell trend={row.trend} />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────

function DiscoverToast() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] flex justify-center p-8">
      <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-border bg-card-bg px-3.5 py-2.5 shadow-[0px_4px_12px_rgba(0,0,0,0.12)] dark:shadow-[0px_4px_12px_rgba(0,0,0,0.4)]">
        <svg width="16" height="16" viewBox="0 -960 960 960" className="shrink-0 fill-page-text-muted"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Showing analytics for The Fall-Off x Superbowl</span>
      </div>
    </div>,
    document.body,
  );
}

export function AnalyticsPocDiscoverTab() {
  const [breakdownMode, setBreakdownMode] = useState<"ctr" | "volume">("ctr");
  const [insightIdx, setInsightIdx] = useState(0);
  const insight = INSIGHTS[insightIdx];

  return (
    <div className="relative flex flex-col gap-2 md:gap-3">
      {/* AI Insights Bar */}
      <div className="flex items-center gap-2">
        {/* Main insights card — single-row compact */}
        <div
          className={cn(
            ANALYTICS_POC_CARD_CONTAINER_CLASS,
            ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
            "relative flex h-16 flex-1 items-center justify-between gap-4 p-4",
          )}
          style={ANALYTICS_POC_CARD_SURFACE_STYLE}
        >
          {/* Pink/magenta gradient border */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              opacity: 0.3,
              filter: "blur(6px)",
              transform: "matrix(-1, 0, 0, 1, 0, 0)",
              background: "linear-gradient(95.54deg, rgba(255,63,213,0) 0%, #FF3FD5 25%, rgba(255,63,213,0) 50%, #FF3FD5 75%, rgba(255,63,213,0) 100%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: 1.5,
            }}
          />
          {/* Orange gradient border */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              opacity: 0.3,
              filter: "blur(6px)",
              background: "linear-gradient(95.54deg, rgba(255,144,37,0) 0%, #FF9025 25%, rgba(255,144,37,0) 50%, #FF9025 75%, rgba(255,144,37,0) 100%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: 1.5,
            }}
          />

          {/* Label */}
          <div className="relative z-10 flex shrink-0 items-center gap-1.5">
            <SparkleIcon className="size-4 text-page-text-muted" />
            <span className="text-sm tracking-[-0.02em] text-page-text-muted">AI Insights</span>
          </div>

          {/* Insight text + action */}
          <div className="relative z-10 flex items-center gap-4">
            <span className="text-sm tracking-[-0.02em] text-page-text-muted">{insight.text}</span>
            <button className="shrink-0 rounded-full bg-foreground/[0.03] px-3 py-2 text-xs font-medium text-page-text">
              {insight.action}
            </button>
          </div>

          {/* Navigation */}
          <div className="relative z-10 flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text"
              onClick={() => setInsightIdx((i) => (i - 1 + INSIGHTS.length) % INSIGHTS.length)}
            >
              <ChevronLeftIcon />
            </button>
            <span className="tabular-nums text-sm tracking-[-0.02em] text-page-text">{insightIdx + 1}/{INSIGHTS.length}</span>
            <button
              type="button"
              className="flex size-6 cursor-pointer items-center justify-center rounded-full text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text"
              onClick={() => setInsightIdx((i) => (i + 1) % INSIGHTS.length)}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        {/* Campaign card button */}
        <div
          className={cn(
            ANALYTICS_POC_CARD_CONTAINER_CLASS,
            ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
            "flex h-16 shrink-0 items-center justify-between gap-4 p-4",
          )}
          style={ANALYTICS_POC_CARD_SURFACE_STYLE}
        >
          <div className="flex items-center gap-1.5">
            <LayoutIcon className="text-page-text-muted" />
            <span className="text-sm tracking-[-0.02em] text-page-text-muted">Campaign card</span>
          </div>
          <button className="rounded-full bg-foreground/[0.03] px-3 py-2 text-xs font-medium text-page-text">
            View
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <AnalyticsPocPanel>
        <div className="flex flex-col gap-3">
          {/* Mobile: horizontal scroll stats */}
          <div className="sm:hidden">
            <MobileStatScroll stats={STATS} />
          </div>
          {/* Desktop: grid stats */}
          <div className="hidden gap-2 sm:flex">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-card-inner-border dark:bg-card-inner-bg dark:shadow-none lg:gap-2 lg:p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-[-0.02em] text-page-text tabular-nums lg:text-sm">{stat.value}</span>
                  {stat.showChange && (
                    <span className="text-[10px] font-medium tracking-[-0.02em] text-[#34D399] lg:text-xs">{stat.change}</span>
                  )}
                </div>
                <span className="truncate text-[10px] tracking-[-0.02em] text-page-text-muted lg:text-xs">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Funnel Bar */}
          <div className="flex flex-col gap-4">
            <div className="flex h-10 w-full overflow-hidden rounded-xl">
              {FUNNEL_SEGMENTS.map((seg) => (
                <div
                  key={seg.label}
                  className="h-full border border-white dark:border-white/10"
                  style={{ backgroundColor: seg.color, width: seg.width, flexGrow: seg.label === "Joined" ? 1 : 0 }}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-x-visible">
              {FUNNEL_SEGMENTS.map((seg) => (
                <div
                  key={seg.label}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-card-bg px-2 py-1.5"
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: seg.dotColor }} />
                  <span className="text-xs tracking-[-0.02em] text-page-text">{seg.label}</span>
                  <span className="text-xs font-medium tracking-[-0.02em]" style={{ color: seg.dotColor }}>{seg.value}</span>
                  <span className="text-xs tracking-[-0.02em] text-page-text-muted">·</span>
                  <span className="text-xs tracking-[-0.02em] text-page-text-muted">{seg.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnalyticsPocPanel>

      {/* Pre-campaign Breakdown Table */}
      <div
        className={cn(
          ANALYTICS_POC_CARD_CONTAINER_CLASS,
          ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
          "flex flex-col",
        )}
        style={ANALYTICS_POC_CARD_SURFACE_STYLE}
      >
        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">Pre-campaign breakdown</span>
          <AnalyticsPocToggleGroup value={breakdownMode} onValueChange={(v) => setBreakdownMode(v as "ctr" | "volume")}>
            <AnalyticsPocToggleGroupItem value="ctr">By CTR</AnalyticsPocToggleGroupItem>
            <AnalyticsPocToggleGroupItem value="volume">By Volume</AnalyticsPocToggleGroupItem>
          </AnalyticsPocToggleGroup>
        </div>

        {/* Mobile: card layout */}
        <div className="md:hidden">
          {CAMPAIGN_ROWS.map((row) => (
            <MobileCampaignCard key={row.name} row={row} />
          ))}
        </div>

        {/* Desktop: full table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/[0.06]">
                {TABLE_COLUMNS.map((col, i) => (
                  <th
                    key={col}
                    className={cn(
                      "px-3 py-3 text-xs font-medium tracking-[-0.02em] text-page-text-muted",
                      i === 0 ? "w-[32%] text-left pl-4" : "",
                      i === TABLE_COLUMNS.length - 1 ? "text-right pr-4" : "",
                      i > 0 && i < TABLE_COLUMNS.length - 1 ? "text-left" : "",
                    )}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAMPAIGN_ROWS.map((row) => (
                <tr key={row.name} className="border-b border-foreground/[0.03] last:border-b-0">
                  {/* Campaign name */}
                  <td className="px-3 py-3 pl-4">
                    <div className="flex items-center gap-2">
                      <div className="size-6 overflow-hidden rounded-full border border-foreground/[0.06]">
                        <Image
                          src={row.avatar}
                          alt={row.name}
                          width={24}
                          height={24}
                          className="size-6 object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{row.name}</span>
                    </div>
                  </td>
                  {/* Type */}
                  <td className="px-3 py-3">
                    <TypeBadge type={row.type} />
                  </td>
                  {/* Impressions */}
                  <td className="px-3 py-3 text-xs tracking-[-0.02em] text-page-text tabular-nums">{row.impressions}</td>
                  {/* Clicks */}
                  <td className="px-3 py-3 text-xs tracking-[-0.02em] text-page-text tabular-nums">{row.clicks}</td>
                  {/* CTR */}
                  <td className="px-3 py-3 text-xs tracking-[-0.02em] text-page-text tabular-nums">{row.ctr}</td>
                  {/* Conversions */}
                  <td className="px-3 py-3 text-xs tracking-[-0.02em] text-page-text tabular-nums">{row.conversions}</td>
                  {/* Conv. rate */}
                  <td className="px-3 py-3 text-xs tracking-[-0.02em] text-page-text tabular-nums">{row.convRate}</td>
                  {/* Trend */}
                  <td className="px-3 py-3 pr-4">
                    <TrendCell trend={row.trend} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      <DiscoverToast />
    </div>
  );
}
