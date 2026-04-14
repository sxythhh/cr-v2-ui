// @ts-nocheck
"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/admin/toast";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { motion, AnimatePresence } from "motion/react";
import { springs } from "@/lib/springs";

// ── Types ───────────────────────────────────────────────────────────

type DateRange = "7d" | "30d" | "90d" | "ytd" | "all";
type SortField = "rank" | "campaign" | "views" | "spend" | "cpm" | "creators" | "completion" | "efficiency";
type SortDir = "asc" | "desc";

interface Campaign {
  rank: number;
  name: string;
  thumbnail: string;
  status: "active" | "paused" | "completed" | "draft";
  views: number;
  spend: number;
  cpm: number;
  creators: number;
  completion: number;
  efficiency: number;
}

// ── Mock Data ───────────────────────────────────────────────────────

const REVENUE_DATA: Record<DateRange, { label: string; value: number }[]> = {
  "7d": [
    { label: "Mon", value: 42800 },
    { label: "Tue", value: 38200 },
    { label: "Wed", value: 51400 },
    { label: "Thu", value: 46100 },
    { label: "Fri", value: 59200 },
    { label: "Sat", value: 33800 },
    { label: "Sun", value: 28400 },
  ],
  "30d": [
    { label: "W1", value: 198000 },
    { label: "W2", value: 215000 },
    { label: "W3", value: 243000 },
    { label: "W4", value: 279000 },
    { label: "W5", value: 312892 },
  ],
  "90d": [
    { label: "Jan", value: 812000 },
    { label: "Feb", value: 947000 },
    { label: "Mar", value: 1247892 },
  ],
  ytd: [
    { label: "Jan", value: 812000 },
    { label: "Feb", value: 947000 },
    { label: "Mar", value: 1247892 },
    { label: "Apr", value: 498000 },
  ],
  all: [
    { label: "Q1 '25", value: 1890000 },
    { label: "Q2 '25", value: 2340000 },
    { label: "Q3 '25", value: 2780000 },
    { label: "Q4 '25", value: 3120000 },
    { label: "Q1 '26", value: 3006892 },
  ],
};

const SUBMISSIONS_DATA: Record<DateRange, { label: string; submissions: number; approved: number }[]> = {
  "7d": [
    { label: "Mon", submissions: 210, approved: 168 },
    { label: "Tue", submissions: 185, approved: 152 },
    { label: "Wed", submissions: 247, approved: 198 },
    { label: "Thu", submissions: 198, approved: 167 },
    { label: "Fri", submissions: 232, approved: 201 },
    { label: "Sat", submissions: 145, approved: 118 },
    { label: "Sun", submissions: 120, approved: 96 },
  ],
  "30d": [
    { label: "W1", submissions: 890, approved: 712 },
    { label: "W2", submissions: 1020, approved: 836 },
    { label: "W3", submissions: 1150, approved: 943 },
    { label: "W4", submissions: 1280, approved: 1050 },
    { label: "W5", submissions: 1247, approved: 1022 },
  ],
  "90d": [
    { label: "Jan", submissions: 3200, approved: 2560 },
    { label: "Feb", submissions: 3800, approved: 3120 },
    { label: "Mar", submissions: 4500, approved: 3780 },
  ],
  ytd: [
    { label: "Jan", submissions: 3200, approved: 2560 },
    { label: "Feb", submissions: 3800, approved: 3120 },
    { label: "Mar", submissions: 4500, approved: 3780 },
    { label: "Apr", submissions: 1247, approved: 1022 },
  ],
  all: [
    { label: "Q1 '25", submissions: 8900, approved: 7120 },
    { label: "Q2 '25", submissions: 11200, approved: 9240 },
    { label: "Q3 '25", submissions: 13400, approved: 10990 },
    { label: "Q4 '25", submissions: 15100, approved: 12380 },
    { label: "Q1 '26", submissions: 11500, approved: 9460 },
  ],
};

const MOCK_CAMPAIGNS: Campaign[] = [
  { rank: 1, name: "Harry Styles Podcast Clipping", thumbnail: "https://i.pravatar.cc/32?u=camp1", status: "active", views: 2400000, spend: 48200, cpm: 20.08, creators: 342, completion: 87, efficiency: 94 },
  { rank: 2, name: "Call of Duty BO7 Clipping", thumbnail: "https://i.pravatar.cc/32?u=camp2", status: "active", views: 1800000, spend: 36400, cpm: 20.22, creators: 218, completion: 92, efficiency: 91 },
  { rank: 3, name: "GYMSHARK Clipping", thumbnail: "https://i.pravatar.cc/32?u=camp3", status: "active", views: 1200000, spend: 28100, cpm: 23.42, creators: 156, completion: 78, efficiency: 82 },
  { rank: 4, name: "Polymarket Clipping Campaign", thumbnail: "https://i.pravatar.cc/32?u=camp4", status: "paused", views: 980000, spend: 22800, cpm: 23.27, creators: 134, completion: 65, efficiency: 71 },
  { rank: 5, name: "NovaPay Wallet Clipping", thumbnail: "https://i.pravatar.cc/32?u=camp5", status: "active", views: 750000, spend: 18900, cpm: 25.20, creators: 98, completion: 81, efficiency: 78 },
  { rank: 6, name: "Kane Brown Clipping", thumbnail: "https://i.pravatar.cc/32?u=camp6", status: "completed", views: 620000, spend: 14200, cpm: 22.90, creators: 87, completion: 100, efficiency: 88 },
  { rank: 7, name: "Diary of a CEO Clipping", thumbnail: "https://i.pravatar.cc/32?u=camp7", status: "active", views: 540000, spend: 12800, cpm: 23.70, creators: 72, completion: 74, efficiency: 76 },
  { rank: 8, name: "MrBeast Gaming Clips", thumbnail: "https://i.pravatar.cc/32?u=camp8", status: "draft", views: 0, spend: 0, cpm: 0, creators: 0, completion: 0, efficiency: 0 },
  { rank: 9, name: "Spotify Wrapped Creator", thumbnail: "https://i.pravatar.cc/32?u=camp9", status: "active", views: 420000, spend: 9800, cpm: 23.33, creators: 64, completion: 69, efficiency: 72 },
  { rank: 10, name: "Red Bull Gaming Clips", thumbnail: "https://i.pravatar.cc/32?u=camp10", status: "active", views: 310000, spend: 7400, cpm: 23.87, creators: 45, completion: 58, efficiency: 65 },
];

const CREATOR_GROWTH = [42, 67, 53, 89, 71, 95, 78];

const REFERRAL_SOURCES = [
  { source: "Organic search", count: 342, pct: 38 },
  { source: "Creator referrals", count: 287, pct: 32 },
  { source: "Social media", count: 263, pct: 30 },
];

const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "ytd", label: "YTD" },
  { key: "all", label: "All time" },
];

// ── Helpers ─────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDollar(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

// ── Status pill ─────────────────────────────────────────────────────

const CAMPAIGN_STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: "Active", bg: "rgba(0,178,89,0.08)", text: "#00B259", dot: "#00B259" },
  paused: { label: "Paused", bg: "rgba(255,128,3,0.08)", text: "#FF8003", dot: "#FF8003" },
  completed: { label: "Completed", bg: "rgba(96,165,250,0.08)", text: "#60A5FA", dot: "#60A5FA" },
  draft: { label: "Draft", bg: "rgba(255,255,255,0.06)", text: "var(--page-text-muted)", dot: "#9CA3AF" },
};

// ── KPI config ──────────────────────────────────────────────────────

const KPI_CARDS = [
  { label: "Total Revenue", value: "$1,247,892", change: "+12.4%", positive: true },
  { label: "Active Campaigns", value: "47", change: "+3", positive: true },
  { label: "Active Creators", value: "12,847", change: "+892", positive: true },
  { label: "Submissions Today", value: "1,247", change: "+8.2%", positive: true },
  { label: "GMV", value: "$3.2M", change: "+15.7%", positive: true },
  { label: "Platform Take Rate", value: "18.4%", change: "-0.3%", positive: false },
];

// ── Page ────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredSubBar, setHoveredSubBar] = useState<number | null>(null);

  // Proximity hover for table
  const tableRef = useRef<HTMLDivElement>(null);
  const { activeIndex, handlers, registerItem } = useProximityHover(tableRef);

  // Sort campaigns
  const sortedCampaigns = [...MOCK_CAMPAIGNS].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortField === "campaign") return dir * a.name.localeCompare(b.name);
    return dir * ((a[sortField] as number) - (b[sortField] as number));
  });

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "rank" ? "asc" : "desc");
    }
  }, [sortField]);

  const revenueData = REVENUE_DATA[dateRange];
  const submissionsData = SUBMISSIONS_DATA[dateRange];
  const maxRevenue = Math.max(...revenueData.map((d) => d.value));
  const maxSubmissions = Math.max(...submissionsData.map((d) => d.submissions));

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 inline-block text-[10px] opacity-40">
      {sortField === field ? (sortDir === "asc" ? "\u2191" : "\u2193") : "\u2195"}
    </span>
  );

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
          Analytics
        </span>
        <div className="flex items-center gap-1">
          {DATE_RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setDateRange(r.key)}
              className={cn(
                "flex h-8 cursor-pointer items-center rounded-full px-3 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] transition-colors",
                dateRange === r.key
                  ? "bg-foreground/[0.10] text-page-text"
                  : "text-page-text-muted hover:bg-foreground/[0.06] hover:text-page-text"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-6 pt-4 sm:px-6">
        {/* ── KPI Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {KPI_CARDS.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
            >
              <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                {kpi.label}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-inter)] text-xl font-semibold tabular-nums tracking-[-0.02em] text-page-text">
                  {kpi.value}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-0.5 font-[family-name:var(--font-inter)] text-xs font-medium tabular-nums tracking-[-0.02em]",
                    kpi.positive ? "text-[#00B259]" : "text-[#FF2525]"
                  )}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className={kpi.positive ? "" : "rotate-180"}
                  >
                    <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
                  </svg>
                  {kpi.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Section ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          {/* Revenue Over Time */}
          <div className="rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                Revenue Over Time
              </span>
              <span className="font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted">
                {formatCurrency(revenueData.reduce((s, d) => s + d.value, 0))} total
              </span>
            </div>
            <div className="flex items-end gap-2" style={{ height: 180 }}>
              {revenueData.map((d, i) => {
                const heightPct = maxRevenue > 0 ? (d.value / maxRevenue) * 100 : 0;
                return (
                  <div
                    key={d.label}
                    className="relative flex flex-1 flex-col items-center"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredBar === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={springs.fast}
                          className="absolute -top-8 z-10 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 font-[family-name:var(--font-inter)] text-[11px] font-medium tabular-nums text-background"
                        >
                          {formatDollar(d.value)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex w-full flex-1 items-end justify-center" style={{ height: 150 }}>
                      <motion.div
                        className={cn(
                          "w-full max-w-[48px] rounded-t-md transition-colors",
                          hoveredBar === i ? "bg-[#FF8003]" : "bg-[#FF8003]/60"
                        )}
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={springs.moderate}
                      />
                    </div>
                    <span className="mt-2 font-[family-name:var(--font-inter)] text-[11px] tabular-nums tracking-[-0.02em] text-page-text-muted">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submissions & Approvals */}
          <div className="rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                Submissions & Approvals
              </span>
            </div>
            {/* Legend */}
            <div className="mb-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-[#60A5FA]" />
                <span className="font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-muted">Submissions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-[#00B259]" />
                <span className="font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-muted">Approved</span>
              </div>
            </div>
            <div className="flex items-end gap-2" style={{ height: 150 }}>
              {submissionsData.map((d, i) => {
                const subPct = maxSubmissions > 0 ? (d.submissions / maxSubmissions) * 100 : 0;
                const appPct = maxSubmissions > 0 ? (d.approved / maxSubmissions) * 100 : 0;
                return (
                  <div
                    key={d.label}
                    className="relative flex flex-1 flex-col items-center"
                    onMouseEnter={() => setHoveredSubBar(i)}
                    onMouseLeave={() => setHoveredSubBar(null)}
                  >
                    <AnimatePresence>
                      {hoveredSubBar === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={springs.fast}
                          className="absolute -top-8 z-10 whitespace-nowrap rounded-lg bg-foreground px-2 py-1 font-[family-name:var(--font-inter)] text-[11px] font-medium tabular-nums text-background"
                        >
                          {d.submissions} / {d.approved}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex w-full flex-1 items-end justify-center gap-0.5" style={{ height: 120 }}>
                      <motion.div
                        className={cn(
                          "w-full max-w-[20px] rounded-t-md transition-colors",
                          hoveredSubBar === i ? "bg-[#60A5FA]" : "bg-[#60A5FA]/50"
                        )}
                        initial={{ height: 0 }}
                        animate={{ height: `${subPct}%` }}
                        transition={springs.moderate}
                      />
                      <motion.div
                        className={cn(
                          "w-full max-w-[20px] rounded-t-md transition-colors",
                          hoveredSubBar === i ? "bg-[#00B259]" : "bg-[#00B259]/50"
                        )}
                        initial={{ height: 0 }}
                        animate={{ height: `${appPct}%` }}
                        transition={springs.moderate}
                      />
                    </div>
                    <span className="mt-2 font-[family-name:var(--font-inter)] text-[11px] tabular-nums tracking-[-0.02em] text-page-text-muted">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Campaign Performance Table ─────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
          <div className="border-b border-foreground/[0.06] px-4 py-3">
            <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
              Campaign Performance
            </span>
          </div>

          {/* Table header */}
          <div className="flex items-center border-b border-foreground/[0.06] px-4" style={{ height: 40 }}>
            <button onClick={() => handleSort("rank")} className="w-[44px] shrink-0 cursor-pointer text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">
              #<SortIcon field="rank" />
            </button>
            <button onClick={() => handleSort("campaign")} className="min-w-0 flex-1 cursor-pointer text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">
              Campaign<SortIcon field="campaign" />
            </button>
            <div className="hidden w-[90px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted sm:block">
              Status
            </div>
            <button onClick={() => handleSort("views")} className="hidden w-[80px] shrink-0 cursor-pointer text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted md:block">
              Views<SortIcon field="views" />
            </button>
            <button onClick={() => handleSort("spend")} className="w-[90px] shrink-0 cursor-pointer text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">
              Spend<SortIcon field="spend" />
            </button>
            <button onClick={() => handleSort("cpm")} className="hidden w-[70px] shrink-0 cursor-pointer text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted lg:block">
              CPM<SortIcon field="cpm" />
            </button>
            <button onClick={() => handleSort("creators")} className="hidden w-[70px] shrink-0 cursor-pointer text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted lg:block">
              Creators<SortIcon field="creators" />
            </button>
            <button onClick={() => handleSort("completion")} className="hidden w-[80px] shrink-0 cursor-pointer text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted md:block">
              Compl.<SortIcon field="completion" />
            </button>
            <button onClick={() => handleSort("efficiency")} className="hidden w-[80px] shrink-0 cursor-pointer text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted sm:block">
              Efficiency<SortIcon field="efficiency" />
            </button>
          </div>

          {/* Table body with proximity hover */}
          <div ref={tableRef} {...handlers}>
            {sortedCampaigns.map((campaign, index) => {
              const statusCfg = CAMPAIGN_STATUS[campaign.status];
              const effColor = campaign.efficiency >= 85 ? "#00B259" : campaign.efficiency >= 70 ? "#FF8003" : "#FF2525";

              return (
                <div
                  key={campaign.rank}
                  ref={(el) => registerItem(index, el)}
                  className="relative flex items-center border-b border-foreground/[0.06] px-4 last:border-b-0"
                  style={{ height: 56 }}
                >
                  {/* Proximity hover indicator */}
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        layoutId="campaign-hover"
                        className="pointer-events-none absolute inset-x-0 inset-y-0 bg-foreground/[0.03]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={springs.fast}
                      />
                    )}
                  </AnimatePresence>

                  {/* Rank */}
                  <div className="relative z-[1] w-[44px] shrink-0 font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted">
                    {campaign.rank}
                  </div>

                  {/* Campaign name + thumb */}
                  <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-3">
                    <img src={campaign.thumbnail} alt="" className="size-8 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0 truncate font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                      {campaign.name}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="relative z-[1] hidden w-[90px] shrink-0 justify-center sm:flex">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                      style={{ background: statusCfg.bg, color: statusCfg.text }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Views */}
                  <div className="relative z-[1] hidden w-[80px] shrink-0 text-right font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text md:block">
                    {formatNumber(campaign.views)}
                  </div>

                  {/* Spend */}
                  <div className="relative z-[1] w-[90px] shrink-0 text-right font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text">
                    {formatDollar(campaign.spend)}
                  </div>

                  {/* CPM */}
                  <div className="relative z-[1] hidden w-[70px] shrink-0 text-right font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted lg:block">
                    ${campaign.cpm.toFixed(2)}
                  </div>

                  {/* Creators */}
                  <div className="relative z-[1] hidden w-[70px] shrink-0 text-right font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted lg:block">
                    {campaign.creators}
                  </div>

                  {/* Completion */}
                  <div className="relative z-[1] hidden w-[80px] shrink-0 items-center justify-end gap-2 md:flex">
                    <div className="h-1.5 w-10 overflow-hidden rounded-full bg-foreground/[0.06]">
                      <div
                        className="h-full rounded-full bg-[#60A5FA]"
                        style={{ width: `${campaign.completion}%` }}
                      />
                    </div>
                    <span className="font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted">
                      {campaign.completion}%
                    </span>
                  </div>

                  {/* Efficiency */}
                  <div className="relative z-[1] hidden w-[80px] shrink-0 justify-end sm:flex">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-semibold tabular-nums tracking-[-0.02em]"
                      style={{
                        background: effColor === "#00B259" ? "rgba(0,178,89,0.08)" : effColor === "#FF8003" ? "rgba(255,128,3,0.08)" : "rgba(255,37,37,0.08)",
                        color: effColor,
                      }}
                    >
                      {campaign.efficiency}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Creator Growth + Quick Actions Row ─────────────────── */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Creator Growth Card */}
          <div className="rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                Creator Growth
              </span>
              <span className="font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted">
                This period
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-inter)] text-2xl font-semibold tabular-nums tracking-[-0.02em] text-page-text">
                892
              </span>
              <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                new creators
              </span>
            </div>

            {/* Sparkline */}
            <div className="mt-3 flex items-end gap-1" style={{ height: 40 }}>
              {CREATOR_GROWTH.map((v, i) => {
                const maxG = Math.max(...CREATOR_GROWTH);
                const h = maxG > 0 ? (v / maxG) * 100 : 0;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-[#FF8003]/50"
                    style={{ height: `${h}%`, minHeight: 4 }}
                  />
                );
              })}
            </div>

            {/* Top referral sources */}
            <div className="mt-4 space-y-2">
              <span className="font-[family-name:var(--font-inter)] text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                Top Referral Sources
              </span>
              {REFERRAL_SOURCES.map((ref) => (
                <div key={ref.source} className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text">
                    {ref.source}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-foreground/[0.06]">
                      <div className="h-full rounded-full bg-[#FF8003]/60" style={{ width: `${ref.pct}%` }} />
                    </div>
                    <span className="font-[family-name:var(--font-inter)] text-[11px] tabular-nums tracking-[-0.02em] text-page-text-muted">
                      {ref.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-3 lg:col-span-2 lg:grid-cols-3">
            {/* Export Full Report */}
            <button
              onClick={() => toast("Export started — your full report will download shortly")}
              className="group flex cursor-pointer flex-col items-start gap-3 rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.03] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-foreground/[0.06]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div>
                <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                  Export Full Report
                </span>
                <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                  Download CSV with all analytics data
                </p>
              </div>
            </button>

            {/* View Payout Summary */}
            <a
              href="/admin/payouts"
              className="group flex cursor-pointer flex-col items-start gap-3 rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.03] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-foreground/[0.06]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div>
                <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                  View Payout Summary
                </span>
                <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                  See pending and completed payouts
                </p>
              </div>
            </a>

            {/* Download Creator Data */}
            <button
              onClick={() => toast("Creator data export started — CSV will download shortly")}
              className="group flex cursor-pointer flex-col items-start gap-3 rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.03] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-foreground/[0.06]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                  Download Creator Data
                </span>
                <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                  Export creator profiles and performance
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
