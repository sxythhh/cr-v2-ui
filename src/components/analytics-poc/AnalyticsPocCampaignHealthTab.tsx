"use client";

import type { ReactNode } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CampaignModelModal } from "@/components/campaign-flow/CampaignModelModal";
import type { CampaignModel } from "@/types/campaign-flow.types";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import {
  ANALYTICS_POC_CARD_CONTAINER_CLASS,
  ANALYTICS_POC_CARD_SURFACE_STYLE,
  ANALYTICS_POC_INTERACTIVE_CARD_CLASS,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocChartPlaceholder } from "./AnalyticsPocChartPlaceholder";
import { AnalyticsPocChartToggleChip } from "./AnalyticsPocChartToggleChip";
import { AnalyticsPocDateRangePicker } from "./AnalyticsPocDateRangePicker";
import { AnalyticsPocSelect } from "./AnalyticsPocSelect";
import { AnalyticsPocPlatformSelect, type PlatformOption } from "./AnalyticsPocPlatformSelect";
import {
  AnalyticsPocToggleGroup,
  AnalyticsPocToggleGroupItem,
} from "./AnalyticsPocToggleGroup";
import type {
  AnalyticsPocCampaignHealthTabProps,
  AnalyticsPocChartToggleCardProps,
} from "./types";

/* ── Shared card style ────────────────────────────────────────────── */

const CARD = "rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none";

/* ── Cost-per-action SVG icons ────────────────────────────────────── */

function HeartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6.2447 10.6863C10.5086 8.29635 11.5577 5.45142 10.7556 3.45147C10.3662 2.48044 9.54883 1.78458 8.5848 1.56963C7.73604 1.38039 6.80851 1.57111 6.00021 2.21277C5.1919 1.57111 4.26438 1.38039 3.41562 1.56963C2.45159 1.78458 1.63422 2.48044 1.2448 3.45148C0.442722 5.45143 1.4918 8.29636 5.75577 10.6863C5.90763 10.7714 6.09284 10.7714 6.2447 10.6863Z" fill="currentColor"/>
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1.5C7.53235 1.5 8.84493 1.8958 9.78372 2.67846C10.7334 3.47021 11.25 4.61674 11.25 6C11.25 7.38326 10.7334 8.52979 9.78372 9.32154C8.84493 10.1042 7.53235 10.5 6 10.5C5.19037 10.5 4.27872 10.4252 3.45788 10.0689C3.31832 10.1469 3.12617 10.2417 2.89798 10.3209C2.42237 10.4859 1.72952 10.6024 1.03596 10.2738C0.899876 10.2094 0.80009 10.087 0.764318 9.94074C0.728546 9.79447 0.760599 9.63987 0.851572 9.51988C1.19577 9.06589 1.30424 8.71384 1.33428 8.48869C1.36319 8.27199 1.32271 8.14783 1.31802 8.1344L1.31835 8.1352C1.31835 8.1352 1.31805 8.13445 1.31761 8.13325L1.31802 8.1344C1.31802 8.1344 1.3175 8.13312 1.31705 8.13206L1.31321 8.12303L1.30682 8.10791C1.26853 8.01611 1.13304 7.68455 1.0063 7.28898C0.884671 6.90937 0.750004 6.40824 0.750004 6C0.750004 4.61674 1.26659 3.47021 2.21629 2.67846C3.15508 1.8958 4.46766 1.5 6 1.5Z" fill="currentColor"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M5.91884 2.37283C5.91884 1.60464 6.83794 1.2093 7.39562 1.73762L11.2254 5.3658C11.5897 5.71092 11.5897 6.29109 11.2254 6.63622L7.39562 10.2644C6.83795 10.7927 5.91884 10.3974 5.91884 9.62918V8.25482C4.20986 8.28183 3.25609 8.4512 2.66273 8.72123C2.06448 8.99348 1.79597 9.38335 1.45952 10.0396C1.18054 10.5839 0.414285 10.3313 0.419953 9.78207C0.441261 7.71649 0.769682 6.15877 1.7596 5.13846C2.67468 4.19529 4.05393 3.81345 5.91884 3.75817V2.37283Z" fill="currentColor"/>
    </svg>
  );
}

function EngagementIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6.625 4.125V5.5H8.26923C9.22511 5.5 10 6.27489 10 7.23077V8.11538C10 9.70851 8.70851 11 7.11538 11H6.58324C5.80348 11 5.07646 10.6062 4.65043 9.95314L3.14068 7.63873C3.0524 7.5034 3.03496 7.33377 3.09384 7.18331L3.13706 7.0729C3.37913 6.45442 4.09204 6.16748 4.69507 6.4458L4.875 6.52885V4.125C4.875 3.64175 5.26675 3.25 5.75 3.25C6.23325 3.25 6.625 3.64175 6.625 4.125Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M5.75 2C4.36929 2 3.25 3.11929 3.25 4.5C3.25 4.64252 3.26188 4.78189 3.28459 4.91727C3.33028 5.18961 3.14654 5.44742 2.87421 5.49311C2.60187 5.5388 2.34406 5.35506 2.29837 5.08273C2.26652 4.8929 2.25 4.69819 2.25 4.5C2.25 2.567 3.817 1 5.75 1C7.48474 1 8.92385 2.26156 9.20163 3.91727C9.24732 4.18961 9.06359 4.44742 8.79125 4.49311C8.51891 4.5388 8.2611 4.35506 8.21541 4.08273C8.01711 2.90073 6.98825 2 5.75 2Z" fill="currentColor"/>
    </svg>
  );
}

const COST_ACTION_ICONS: Record<string, ReactNode> = {
  Like: <HeartIcon />,
  Comment: <CommentIcon />,
  Share: <ShareIcon />,
  "Eng.": <EngagementIcon />,
};

/* ── Icons ────────────────────────────────────────────────────────── */

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3V6H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.34 10A6 6 0 1 0 3.64 4.64L2 6" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 5V8L10 9.5" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.67V13.33M2.67 8H13.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7.33" cy="7.33" r="4.67" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.67 10.67L13.33 13.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3.33H14M4 8H12M6 12.67H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Campaign Status Tabs ────────────────────────────────────────── */

const STATUS_TABS = [
  { label: "All", count: 21 },
  { label: "Active", count: 8 },
  { label: "Pending Budget", count: 5 },
  { label: "Ended", count: 5 },
  { label: "Archived", count: 3 },
];

function MobileActionButtons({ onNewCampaign }: { onNewCampaign: () => void }) {
  return (
    <div className="flex items-center gap-2 px-5 sm:hidden">
      <button className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground/[0.03] py-2 text-sm font-medium tracking-[-0.02em] text-page-text">
        <HistoryIcon />
        History
      </button>
      <button type="button" onClick={onNewCampaign} className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground/[0.03] py-2 text-sm font-medium tracking-[-0.02em] text-page-text">
        <PlusIcon />
        New campaign
      </button>
    </div>
  );
}

function MobileStatusTabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <div className="overflow-x-auto scrollbar-hide sm:hidden">
      <div className="flex items-center gap-0.5 rounded-[14px] bg-foreground/[0.03] p-0.5" style={{ width: "max-content" }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onTabChange(tab.label)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium tracking-[-0.02em] whitespace-nowrap",
              activeTab === tab.label
                ? "bg-foreground/[0.03] text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                : "text-page-text-muted",
            )}
          >
            {tab.label}
            <span className="text-sm font-normal text-page-text-muted">{tab.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileSearchBar() {
  return (
    <div className="flex items-center gap-2 sm:hidden">
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-foreground/[0.03] px-3 py-2.5">
        <SearchIcon />
        <span className="text-sm tracking-[-0.02em] text-page-text-muted">Search</span>
      </div>
      <div className="flex size-9 items-center justify-center rounded-xl bg-foreground/[0.03]">
        <FilterIcon />
      </div>
    </div>
  );
}

/* ── Filter Toolbar ───────────────────────────────────────────────── */

function FilterToolbar({ dateRange, setDateRange, platforms, onTogglePlatform, selectedCampaign, setSelectedCampaign }: {
  dateRange: string; setDateRange: (v: string) => void;
  platforms: PlatformOption[]; onTogglePlatform: (id: string) => void;
  selectedCampaign: string; setSelectedCampaign: (v: string) => void;
}) {
  const campaignOptions = [
    { value: "fall-off", label: "The Fall-Off x Superbowl" },
    { value: "creator-sprint-q1", label: "Creator Sprint Q1" },
  ];

  return (
    <div className="hidden flex-wrap items-center gap-2 sm:flex">
      <AnalyticsPocDateRangePicker value={dateRange} onValueChange={setDateRange} />
      <AnalyticsPocPlatformSelect platforms={platforms} onToggle={onTogglePlatform} />
      <AnalyticsPocSelect value={selectedCampaign} onValueChange={setSelectedCampaign} options={campaignOptions} />
    </div>
  );
}

/* ── Stat KPI Card ────────────────────────────────────────────────── */

function StatCard({ value, change, label, sublabel, changeColor = "#34D399", valueColor }: {
  value: string;
  change?: string;
  label: string;
  sublabel?: string;
  changeColor?: string;
  valueColor?: string;
}) {
  return (
    <div className={cn(CARD, "flex flex-1 flex-col justify-center gap-2 p-3")}>
      <div className="flex items-center justify-between">
        <span className={cn("font-inter text-sm font-medium tracking-[-0.02em]", !valueColor && "text-page-text")} style={valueColor ? { color: valueColor } : undefined}>{value}</span>
        {change && (
          <span className="font-inter text-xs font-medium tracking-[-0.02em]" style={{ color: changeColor }}>{change}</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{label}</span>
        {sublabel && (
          <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">{sublabel}</span>
        )}
      </div>
    </div>
  );
}

/* ── Health Ring Gauge ────────────────────────────────────────────── */

function HealthRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 70;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative flex size-[148px] items-center justify-center">
      <svg width="148" height="148" viewBox="0 0 148 148" className="absolute">
        <circle cx="74" cy="74" r={radius} fill="none" stroke={`${color}33`} strokeWidth={strokeWidth} />
        <circle
          cx="74" cy="74" r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 74 74)"
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className="font-inter text-5xl font-medium tracking-[-0.02em] text-page-text">{score}</span>
        <span className="font-inter text-xs font-medium tracking-[-0.02em]" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

/* ── Health Breakdown Row ─────────────────────────────────────────── */

function HealthBreakdownRow({ name, weight, score, scoreColor }: {
  name: string;
  weight: string;
  score: number;
  scoreColor: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-1 items-center gap-2">
        <span className="font-inter text-sm tracking-[-0.02em] text-page-text">{name}</span>
        <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">{weight}</span>
        <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">·</span>
        <span className="font-inter text-sm tracking-[-0.02em]" style={{ color: scoreColor }}>{score}</span>
      </div>
    </div>
  );
}

/* ── Health Score Card ────────────────────────────────────────────── */

function HealthCard() {
  const healthItems = [
    { name: "Fill rate", weight: "20%", score: 68, color: "#FB923C" },
    { name: "Engagement", weight: "25%", score: 82, color: "#34D399" },
    { name: "Approval rate", weight: "20%", score: 80, color: "#34D399" },
    { name: "CPM efficiency", weight: "20%", score: 84, color: "#34D399" },
    { name: "Creator quality", weight: "15%", score: 71, color: "#FB923C" },
  ];

  return (
    <div className={cn(CARD, "flex flex-col gap-4 p-4")}>
      <div className="flex items-center gap-1.5">
        <svg width="14" height="13" viewBox="0 0 14 13" fill="none" className="text-page-text-muted">
          <path fillRule="evenodd" clipRule="evenodd" d="M13.0152 2.56385C14.0611 5.1781 12.7284 9.0031 6.91521 12.2693C6.76311 12.3548 6.57747 12.3548 6.42537 12.2693C0.612192 9.00312 -0.720565 5.17811 0.325298 2.56387C0.836732 1.28548 1.90854 0.372816 3.16845 0.0912035C4.31407 -0.164862 5.577 0.10875 6.67026 1.03304C7.7635 0.10875 9.02643 -0.164863 10.1721 0.0912005C11.432 0.372811 12.5038 1.28547 13.0152 2.56385ZM6.11648 3.77639C6.03336 3.61015 5.86489 3.50374 5.67907 3.5001C5.49324 3.49645 5.32073 3.59619 5.23116 3.75904L4.27364 5.5H3.16927C2.89313 5.5 2.66927 5.72386 2.66927 6C2.66927 6.27614 2.89313 6.5 3.16927 6.5H4.56927C4.75162 6.5 4.9195 6.40073 5.00738 6.24096L5.64818 5.07586L7.22206 8.22361C7.30518 8.38985 7.47365 8.49626 7.65947 8.4999C7.8453 8.50355 8.01781 8.40381 8.10738 8.24096L9.06491 6.5H10.1693C10.4454 6.5 10.6693 6.27614 10.6693 6C10.6693 5.72386 10.4454 5.5 10.1693 5.5H8.76927C8.58693 5.5 8.41904 5.59927 8.33116 5.75904L7.69036 6.92414L6.11648 3.77639Z" fill="currentColor" fillOpacity="0.7"/>
        </svg>
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Health</span>
      </div>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <HealthRing score={76} label="Healthy" color="#34D399" />
        <div className="flex w-full flex-1 flex-col gap-2">
          {healthItems.map((item) => (
            <div key={item.name}>
              <HealthBreakdownRow name={item.name} weight={item.weight} score={item.score} scoreColor={item.color} />
              <div className="mt-2 h-px bg-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Financials Card ──────────────────────────────────────────────── */

function FinancialsCard() {
  const legendItems = [
    { label: "Paid out", color: "#34D399", value: "$3,241.50" },
    { label: "Pending", color: "#FB923C", value: "$832" },
    { label: "Clawed back", color: "#FF3355", value: "$145" },
    { label: "Net spend", color: "var(--page-text-muted)", value: "$3,928.50" },
  ];

  const costActions = [
    { icon: "Like", label: "Like", value: "$0.009" },
    { icon: "Comment", label: "Comment", value: "$0.041" },
    { icon: "Share", label: "Share", value: "$0.026" },
    { icon: "Eng.", label: "Eng.", value: "$0.026" },
  ];

  return (
    <div className={cn(CARD, "flex flex-col items-center gap-3 p-4")}>
      {/* Header */}
      <div className="flex w-full items-center justify-between pb-1">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Financials</span>
        <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">53% of budget used</span>
      </div>

      {/* Budget amount */}
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">$4,218.50</span>
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">of $8,000</span>
        </div>

        {/* Stacked budget bar */}
        <div className="flex h-10 w-full gap-[2px] overflow-hidden rounded-xl bg-foreground/[0.06]">
          <div className="h-full" style={{ width: "53.7%", background: "var(--ap-hover)" }} />
          <div className="h-full flex-1" style={{ background: "rgba(0,153,77,0.6)" }} />
          <div className="h-full w-[5%]" style={{ background: "rgba(229,113,0,0.6)" }} />
          <div className="h-full w-[2.5%]" style={{ background: "rgba(255,51,85,0.6)" }} />
        </div>

        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">$3,781.50 remaining</span>
      </div>

      {/* Legend pills */}
      <div className="flex w-full flex-wrap gap-1">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1 rounded-full border border-foreground/[0.06] px-2 py-1 dark:border-[rgba(224,224,224,0.03)]">
            <span className="size-2 rounded-full" style={{ background: item.color }} />
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{item.label}</span>
            <span className="font-inter text-xs font-medium tracking-[-0.02em]" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)]" />

      {/* Cost per action */}
      <div className="flex w-full items-center justify-between pb-1">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Cost per action</span>
      </div>
      <div className="flex w-full flex-wrap gap-1">
        {costActions.map((action) => (
          <div key={action.label} className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2.5 py-1 dark:border-[rgba(224,224,224,0.03)]">
            <span className="text-page-text">{COST_ACTION_ICONS[action.icon]}</span>
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{action.label}</span>
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">{action.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Traffic Sources Table ────────────────────────────────────────── */

const TRAFFIC_SOURCES = [
  { label: "Direct/Bookmark", color: "#FB923C", bgAlpha: 0.1, views: "4,879", applications: "312", joined: "6.4%", barWidth: "100%" },
  { label: "TikTok bio link", color: "#60A5FA", bgAlpha: 0.1, views: "3,595", applications: "248", joined: "6.9%", barWidth: "91%" },
  { label: "Instagram story", color: "#34D399", bgAlpha: 0.08, views: "2,311", applications: "152", joined: "6.6%", barWidth: "85%" },
  { label: "Google search", color: "#FACC15", bgAlpha: 0.1, views: "1,284", applications: "89", joined: "6.9%", barWidth: "78%" },
  { label: "X (Twitter)", color: "#C084FC", bgAlpha: 0.1, views: "771", applications: "46", joined: "6.2%", barWidth: "54%" },
];

function TrafficSourcesCard() {
  return (
    <div className={cn(CARD, "flex flex-col gap-2 overflow-hidden p-4")}>
      {/* Header */}
      <div className="flex items-center px-4 pb-2">
        <div className="flex flex-1 items-center gap-1.5">
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Traffic sources</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-foreground/40"><path fillRule="evenodd" clipRule="evenodd" d="M6 0.5C3.0 0.5 0.5 3.0 0.5 6C0.5 9.0 3.0 11.5 6 11.5C9.0 11.5 11.5 9.0 11.5 6C11.5 3.0 9.0 0.5 6 0.5ZM5.5 4C5.5 3.72 5.72 3.5 6 3.5C6.28 3.5 6.5 3.72 6.5 4C6.5 4.28 6.28 4.5 6 4.5C5.72 4.5 5.5 4.28 5.5 4ZM5.5 5.5H6.5V8.5H5.5V5.5Z" fill="currentColor"/></svg>
        </div>
        <span className="hidden w-[80px] text-right font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted sm:block">Views</span>
        <span className="text-right font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted sm:w-[80px]">Applications</span>
        <span className="w-[50px] pl-3 text-right font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Joined</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1">
        {TRAFFIC_SOURCES.map((source) => (
          <div key={source.label} className="group relative flex items-center rounded-xl px-4 py-2.5 transition-colors hover:bg-foreground/[0.03]" style={{ isolation: "isolate" }}>
            {/* Background bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-xl transition-opacity duration-150 group-hover:opacity-80"
              style={{ width: source.barWidth, background: `color-mix(in srgb, ${source.color} ${source.bgAlpha * 100}%, transparent)` }}
            />
            {/* Content */}
            <div className="relative z-10 flex flex-1 items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: source.color }} />
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{source.label}</span>
            </div>
            <span className="relative z-10 hidden w-[80px] text-right font-inter text-sm tracking-[-0.02em] text-page-text tabular-nums sm:block">{source.views}</span>
            <span className="relative z-10 text-right font-inter text-sm tracking-[-0.02em] text-page-text tabular-nums sm:w-[80px]">{source.applications}</span>
            <span className="relative z-10 w-[50px] pl-3 text-right font-inter text-sm tracking-[-0.02em] text-[#00994D] tabular-nums">{source.joined}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Chart Section (reusable) ─────────────────────────────────────── */

function ChartSection({
  title,
  chart,
  metrics,
}: {
  title: string;
  chart: AnalyticsPocCampaignHealthTabProps["activityChart"];
  metrics: AnalyticsPocChartToggleCardProps[];
}) {
  const [activeTab, setActiveTab] = useState("Daily");
  const [enabledMetrics, setEnabledMetrics] = useState<Set<string>>(() => {
    return new Set(
      metrics
        .filter((m) => m.enabled !== false)
        .map((m) => m.metricKey ?? m.label),
    );
  });

  const toggleMetric = (key: string) => {
    setEnabledMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const seriesColorByKey = Object.fromEntries(
    (chart.lineChart?.series ?? []).map((s) => [s.key, s.color]),
  ) as Record<string, string>;

  return (
    <div className={cn(CARD, "flex flex-col gap-4 p-4")}>
      <div className="flex flex-col gap-3">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{title}</span>
        <div className="flex flex-wrap items-center gap-2">
          {metrics.map((metric) => {
            const key = metric.metricKey ?? metric.label;
            return (
              <AnalyticsPocChartToggleChip
                enabled={enabledMetrics.has(key)}
                key={key}
                label={metric.label}
                metricKey={metric.metricKey}
                onToggle={toggleMetric}
                seriesColor={metric.metricKey ? (seriesColorByKey[metric.metricKey] ?? metric.accentColor ?? "#4D81EE") : "#4D81EE"}
                value={metric.value ?? ""}
              />
            );
          })}
        </div>
      </div>
      <AnalyticsPocChartPlaceholder
        {...chart}
        activeLineDataset={activeTab === "Cumulative" ? "cumulative" : "daily"}
        visibleMetricKeys={Array.from(enabledMetrics)}
      />
    </div>
  );
}

/* ── Main Tab ─────────────────────────────────────────────────────── */

/* ── Mobile KPI Scroll ────────────────────────────────────────────── */

function MobileKpiScroll({ children }: { children: ReactNode[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).offsetWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, children.length - 1));
  }, [children.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="-mx-4 flex flex-col items-center gap-2 sm:-mx-5 sm:hidden">
      <div ref={scrollRef} className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 scrollbar-hide sm:pl-5 [scroll-padding-inline:16px]">
        {children.map((child, i) => (
          <div key={i} className={cn(
            "w-[calc(100vw-56px)] max-w-80 shrink-0",
            "snap-start snap-always",
            i === children.length - 1 && "mr-4 sm:mr-5",
          )}>
            {child}
          </div>
        ))}
      </div>
      {children.length > 1 && (
        <div className="flex items-center justify-center gap-1">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const child = scrollRef.current?.children[i] as HTMLElement | undefined;
                child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }}
              className={cn(
                "size-1.5 cursor-pointer rounded-full transition-colors",
                i === activeIndex ? "bg-[#252525] dark:bg-[#E0E0E0]" : "bg-[rgba(37,37,37,0.1)] dark:bg-[rgba(224,224,224,0.1)]",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Pre-campaign Breakdown ──────────────────────────────────────── */

const PRE_CAMPAIGN_DATA = [
  { name: "FanDuel", impressions: "9,214", growth: 3.2, status: "apply" as const, count: "512 applied" },
  { name: "DraftKings", impressions: "5,102", growth: 1.4, status: "open" as const, count: "347 joined" },
  { name: "TikTok Only", impressions: "5,102", growth: 0.9, status: "open" as const, count: "347 joined" },
  { name: "Q2 Push", impressions: "5,102", growth: 0, status: "open" as const, count: "347 joined" },
  { name: "Holiday Special", impressions: "512", growth: -1.1, status: "apply" as const, count: "18 applied" },
];

function PreCampaignBreakdown() {
  return (
    <div className={cn(CARD, "flex flex-col overflow-hidden p-0")}>
      {/* Header */}
      <div className="flex items-center border-b border-foreground/[0.06] px-4 py-3">
        <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Pre-campaign breakdown</span>
      </div>

      {/* Rows */}
      {PRE_CAMPAIGN_DATA.map((campaign, i) => (
        <div key={campaign.name} className={cn("flex flex-col gap-2 px-4 py-3", i < PRE_CAMPAIGN_DATA.length - 1 && "border-b border-foreground/[0.03]")}>
          {/* Top row: brand + growth */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 shrink-0 rounded-full bg-foreground/[0.08]" />
              <div className="flex items-center gap-1.5">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.name}</span>
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-subtle">·</span>
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{campaign.impressions} impressions</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {campaign.growth > 0 ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.33 10L8 7.33L10.67 10M5.33 6.67L8 4L10.67 6.67" stroke="#00994D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="font-inter text-xs tracking-[-0.02em] text-[#00994D]">{campaign.growth}%</span>
                </>
              ) : campaign.growth < 0 ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.33 6L8 8.67L10.67 6M5.33 9.33L8 12L10.67 9.33" stroke="#FF3355" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="font-inter text-xs tracking-[-0.02em] text-[#FF3355]">{Math.abs(campaign.growth)}%</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.67 8H11.33" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">0.0%</span>
                </>
              )}
            </div>
          </div>
          {/* Bottom row: status pill + count */}
          <div className="flex items-center justify-between">
            {campaign.status === "apply" ? (
              <div className="flex items-center gap-1 rounded-full bg-[rgba(229,113,0,0.08)] py-1 pl-1.5 pr-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6 0C4.07 0 2.5 1.57 2.5 3.5V4.5C1.67 4.5 1 5.17 1 6V9.5C1 10.33 1.67 11 2.5 11H9.5C10.33 11 11 10.33 11 9.5V6C11 5.17 10.33 4.5 9.5 4.5V3.5C9.5 1.57 7.93 0 6 0ZM8.5 4.5V3.5C8.5 2.12 7.38 1 6 1C4.62 1 3.5 2.12 3.5 3.5V4.5H8.5Z" fill="#E57100" /></svg>
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#E57100]">Apply</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 rounded-full bg-[rgba(0,153,77,0.08)] py-1 pl-1.5 pr-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#00994D" strokeWidth="1" /><path d="M6 1.5C6 1.5 3 3 3 6C3 9 6 10.5 6 10.5M6 1.5C6 1.5 9 3 9 6C9 9 6 10.5 6 10.5M6 1.5V10.5M1.5 6H10.5" stroke="#00994D" strokeWidth="0.8" /></svg>
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#00994D]">Open</span>
              </div>
            )}
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{campaign.count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsPocCampaignHealthTab({
  engagement,
  activityKpis,
  activityChart,
  activityChartMetrics,
  healthScore,
  financials,
  className,
}: AnalyticsPocCampaignHealthTabProps) {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [platforms, setPlatforms] = useState<PlatformOption[]>([
    { id: "youtube", label: "YouTube", active: true },
    { id: "tiktok", label: "TikTok", active: true },
    { id: "instagram", label: "Instagram", active: true },
  ]);
  const handleTogglePlatform = (id: string) => {
    setPlatforms((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };
  const [selectedCampaign, setSelectedCampaign] = useState("fall-off");
  const [statusTab, setStatusTab] = useState("All");

  // Engagement chart metrics from the engagement prop
  const engagementChartMetrics: AnalyticsPocChartToggleCardProps[] = engagement.funnelSteps.map((step, i) => ({
    label: step.label,
    value: step.value,
    metricKey: ["views", "engagement", "likes"][i] ?? step.label.toLowerCase(),
    accentColor: step.color,
    enabled: true,
  }));

  const topKpiCards = [
    <StatCard key="views" value="5.14M" change="+18.3%" label="Total views" changeColor="#00994D" />,
    <StatCard key="payouts" value="$4,218.50" change="+18.3%" label="Total payouts" sublabel="$832 pending" changeColor="#00994D" />,
    <StatCard key="visitors" value="12,108" label="Unique visitors" />,
    <StatCard key="subs" value="847" label="Submissions" sublabel="680 approved · 80.3%" />,
  ];

  const bottomKpiCards = [
    <StatCard key="subs" value="847" label="Total submissions" sublabel="All platforms" />,
    <StatCard key="creators" value="234" label="Unique creators" sublabel="Active in campaign" />,
    <StatCard key="apps2" value="189" change="12 pending review" label="Applications" changeColor="#E57100" />,
    <StatCard key="growth" value="+12.4%" label="7-day growth" sublabel="vs previous 7 days" valueColor="#00994D" />,
  ];

  return (
    <div className={cn("flex flex-col gap-4 pb-8 md:pb-0", className)}>
      {/* 1. Filter toolbar (desktop only) */}
      <FilterToolbar dateRange={dateRange} setDateRange={setDateRange} platforms={platforms} onTogglePlatform={handleTogglePlatform} selectedCampaign={selectedCampaign} setSelectedCampaign={setSelectedCampaign} />

      {/* 2. Top KPI row */}
      <MobileKpiScroll>{topKpiCards}</MobileKpiScroll>
      <div className="hidden gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {topKpiCards}
      </div>

      {/* 3. Health + Financials side by side */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <HealthCard />
        <FinancialsCard />
      </div>

      {/* 4. Campaign engagement chart */}
      <ChartSection
        title="Campaign engagement"
        chart={engagement.chart}
        metrics={engagementChartMetrics}
      />

      {/* 5. Traffic sources */}
      <TrafficSourcesCard />

      {/* Pre-campaign breakdown */}
      <PreCampaignBreakdown />

      {/* 6. Bottom KPI row */}
      <MobileKpiScroll>{bottomKpiCards}</MobileKpiScroll>
      <div className="hidden gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {bottomKpiCards}
      </div>

      {/* 7. Activity over time chart */}
      <ChartSection
        title="Activity over time"
        chart={activityChart}
        metrics={activityChartMetrics}
      />
    </div>
  );
}
