// @ts-nocheck
"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ProximityTabs } from "@/components/ui/proximity-tabs";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";
import { CentralIcon } from "@central-icons-react/all";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { AuditLogSheet } from "@/components/admin/audit-log-sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ClockCircleIcon } from "@/components/admin/status-icons";
import {
  type Submission,
  FilterIcon, CheckCircleIcon, XCircleIcon, SparkleIcon,
  StatMiniCard, MetricPill, DotMenuPopover,
  SUBMISSIONS_CHART_DATA,
  VideoPlayer,
} from "@/components/submissions";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { springs } from "@/lib/springs";

const ciProps = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

// ── Tabs ──────────────────────────────────────────────────────────────

const SA_TABS = [
  { name: "Submissions", count: 31 },
  { name: "Payouts", count: 33 },
  { name: "User Reports", count: 9 },
  { name: "Payment Management" },
];

// ── Mock submissions (reuse same shape) ──────────────────────────────

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sa1", creator: "xKaizen", avatar: "https://i.pravatar.cc/36?u=xkaizen", platform: "tiktok", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", date: "25 Feb '26", timeLeft: "1d left", status: "pending", aiScore: 23, aiResult: "fail", checksPassed: 1, checksTotal: 13, payout: "$690", engRate: "4.3%", botScore: 12, botScoreColor: "#FF2525", views: "1,2M", viewsNum: "1.2M", likes: "48,2K", likesNum: "48.2K", comments: "3,1K", commentsNum: "3.1K", shares: "1,3K", sharesNum: "1.3K", topCountry: "United Kingdom", countryCode: "gb", topAge: "18-24",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", videoDuration: "01:15", videoCurrentTime: "00:21",
    overviewText: "Failed 12 of 13 checks. No brand mentions, stock audio, and below-minimum video quality — not eligible for payout.",
    contentChecks: [
      { name: "Audio Match", detail: "Stock audio detected", score: 5, passed: false },
      { name: "Video Match", detail: "No content match", score: 8, passed: false },
      { name: "Talking Points", detail: "No script followed", score: 10, passed: false },
      { name: "Brand Mentions", detail: "No mention", score: 8, passed: false },
      { name: "Title & Tags", detail: "Generic spam file", score: 12, passed: false },
      { name: "Sentiment", detail: "Spam-like tone", score: 22, passed: false },
      { name: "Language", detail: "English, broken", score: 60, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "480p only", score: 15, passed: false },
      { name: "Lighting", detail: "Very dark", score: 20, passed: false },
      { name: "Framing", detail: "Off-center", score: 25, passed: false },
      { name: "Brand Logo", detail: "Not shown", score: 0, passed: false },
      { name: "End Screen", detail: "None", score: 0, passed: false },
      { name: "Watermark", detail: "None", score: 100, passed: true },
    ],
    appliedDate: "2 Mar, 2026", motivation: "Tech content creator for 2 years.", tiktokAccounts: 3, instagramAccounts: 3,
  },
  {
    id: "sa2", creator: "Cryptoclipz", avatar: "https://i.pravatar.cc/36?u=cryptoclipz", platform: "instagram", platforms: ["tiktok", "instagram"], campaign: "Caffeine AI", date: "26 Feb '26", timeLeft: "2d left", status: "pending", aiScore: 92, aiResult: "pass", checksPassed: 13, checksTotal: 13, payout: "$275", engRate: "3.8%", botScore: 89, botScoreColor: "#00B259", views: "1,1M", viewsNum: "1.1M", likes: "56,9K", likesNum: "56.9K", comments: "1,4K", commentsNum: "1.4K", shares: "3,8K", sharesNum: "3.8K", topCountry: "United Kingdom", countryCode: "gb", topAge: "18-24",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", videoDuration: "01:15", videoCurrentTime: "00:21",
    overviewText: "Passed all 13 checks. Eligible for payout.",
    contentChecks: [
      { name: "Audio Match", detail: "Original audio", score: 95, passed: true },
      { name: "Video Match", detail: "Perfect match", score: 98, passed: true },
      { name: "Talking Points", detail: "All covered", score: 92, passed: true },
      { name: "Brand Mentions", detail: "4 mentions", score: 96, passed: true },
      { name: "Title & Tags", detail: "All present", score: 100, passed: true },
      { name: "Sentiment", detail: "Very positive", score: 97, passed: true },
      { name: "Language", detail: "English, native", score: 99, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "1080p", score: 100, passed: true },
      { name: "Lighting", detail: "Excellent", score: 95, passed: true },
      { name: "Framing", detail: "Well composed", score: 90, passed: true },
      { name: "Brand Logo", detail: "Visible", score: 88, passed: true },
      { name: "End Screen", detail: "CTA present", score: 85, passed: true },
      { name: "Watermark", detail: "None", score: 100, passed: true },
    ],
    appliedDate: "28 Feb, 2026", motivation: "Fashion content for 3 years.", tiktokAccounts: 2, instagramAccounts: 4,
  },
  {
    id: "sa3", creator: "ViralVee", avatar: "https://i.pravatar.cc/36?u=viralvee", platform: "tiktok", platforms: ["tiktok"], campaign: "FitTrack Pro", date: "27 Feb '26", timeLeft: "3d left", status: "pending", aiScore: 78, aiResult: "pass", checksPassed: 10, checksTotal: 13, payout: "$425", engRate: "5.1%", botScore: 72, botScoreColor: "#E9A23B", views: "890K", viewsNum: "890K", likes: "34,1K", likesNum: "34.1K", comments: "2,8K", commentsNum: "2.8K", shares: "5,2K", sharesNum: "5.2K", topCountry: "United States", countryCode: "us", topAge: "25-34",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4", videoDuration: "00:58", videoCurrentTime: "00:34",
    overviewText: "Passed 10 of 13 checks. Good brand integration.",
    contentChecks: [
      { name: "Audio Match", detail: "Original audio", score: 95, passed: true },
      { name: "Video Match", detail: "Content aligned", score: 88, passed: true },
      { name: "Talking Points", detail: "3/4 covered", score: 75, passed: true },
      { name: "Brand Mentions", detail: "Mentioned 3x", score: 82, passed: true },
      { name: "Title & Tags", detail: "Missing 2 tags", score: 45, passed: false },
      { name: "Sentiment", detail: "Positive tone", score: 90, passed: true },
      { name: "Language", detail: "English, fluent", score: 95, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "1080p verified", score: 92, passed: true },
      { name: "Lighting", detail: "Good", score: 85, passed: true },
      { name: "Framing", detail: "Well composed", score: 88, passed: true },
      { name: "Brand Logo", detail: "Visible at 0:12", score: 78, passed: true },
      { name: "End Screen", detail: "CTA missing", score: 20, passed: false },
      { name: "Watermark", detail: "None detected", score: 100, passed: true },
    ],
    appliedDate: "1 Mar, 2026", motivation: "Fitness content is my passion.", tiktokAccounts: 1, instagramAccounts: 0,
  },
];

// ── Filters ──────────────────────────────────────────────────────────

const SA_FILTERS: Filter[] = [
  { key: "platform", icon: null, label: "Platform", singleSelect: true, options: [{ value: "tiktok", label: "TikTok" }, { value: "instagram", label: "Instagram" }] },
  { key: "status", icon: null, label: "Status", singleSelect: true, options: [{ value: "pending", label: "Pending" }, { value: "accepted", label: "Approved" }, { value: "rejected", label: "Rejected" }] },
  { key: "campaign", icon: null, label: "Campaign", singleSelect: true, options: [{ value: "caffeine-ai", label: "Caffeine AI" }, { value: "fittrack", label: "FitTrack Pro" }] },
];

// ── Submission Card (replicates brand submissions card) ──────────────

function SASubmissionCard({ submission, onAction, onAuditLog }: { submission: Submission; onAction?: (action: "approve" | "reject") => void; onAuditLog?: () => void }) {
  const isPass = submission.aiResult === "pass";
  const scoreColor = isPass ? "#00B259" : "#FF2525";
  const [metricState, setMetricState] = useState<Record<string, boolean>>({ views: true, likes: true, comments: true, shares: false });
  const toggleMetric = useCallback((key: string) => { setMetricState((prev) => ({ ...prev, [key]: !prev[key] })); }, []);
  const visibleMetricKeys = useMemo(() => Object.entries(metricState).filter(([, v]) => v).map(([k]) => k), [metricState]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card-bg">
      {/* ── Mobile layout ── */}
      <div className="md:hidden">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <img src={submission.avatar} alt="" className="size-9 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-page-text">{submission.creator}</span>
              <PlatformIcon platform={submission.platform} className="size-3.5 shrink-0 text-page-text-subtle" />
            </div>
            <div className="flex items-center gap-1 text-xs text-page-text-muted">
              <span>{submission.campaign}</span>
              <span>·</span>
              <span>{submission.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 items-center gap-1 rounded-full px-2" style={{ background: `${scoreColor}18` }}>
              <SparkleIcon size={12} color={scoreColor} />
              <span className="text-xs font-semibold tabular-nums" style={{ color: scoreColor }}>{submission.aiScore}</span>
            </div>
            <DotMenuPopover
              onViewContent={() => {}}
              onViewCreator={() => {}}
              onFlag={() => {}}
            />
          </div>
        </div>

        {/* Mobile content */}
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            <StatMiniCard label="Payout" value={submission.payout} variant="filled" />
            <StatMiniCard label="Eng. Rate" value={submission.engRate} variant="outlined" />
            <StatMiniCard label="Bot Score" value={`${submission.botScore}%`} variant="outlined" valueColor={submission.botScoreColor} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <MetricPill label="Views" value={submission.viewsNum} active={metricState.views} onClick={() => toggleMetric("views")} />
            <MetricPill label="Likes" value={submission.likesNum} active={metricState.likes} onClick={() => toggleMetric("likes")} />
            <MetricPill label="Comments" value={submission.commentsNum} active={metricState.comments} onClick={() => toggleMetric("comments")} />
            <MetricPill label="Shares" value={submission.sharesNum} active={metricState.shares} onClick={() => toggleMetric("shares")} />
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-2 border-t border-border px-4 py-3">
          <button onClick={() => onAction?.("reject")} className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground/[0.06] text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10]">
            <XCircleIcon size={14} /> Reject
          </button>
          <button onClick={() => onAction?.("approve")} className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#00B259] text-sm font-medium text-white transition-colors hover:bg-[#00A050]">
            <CheckCircleIcon size={14} color="#fff" /> Approve
          </button>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden md:block">
        {/* Header row */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-3">
          <img src={submission.avatar} alt="" className="size-9 rounded-full" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-page-text">{submission.creator}</span>
              {submission.platforms.map((p) => (
                <PlatformIcon key={p} platform={p} className="size-3.5 text-page-text-subtle" />
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-page-text-muted">
              <span>{submission.campaign}</span>
              <span>·</span>
              <span>{submission.date}</span>
              <span>·</span>
              <span className="text-amber-400">{submission.timeLeft}</span>
            </div>
          </div>

          {/* AI quality */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 items-center gap-1 rounded-full px-2.5" style={{ background: `${scoreColor}18` }}>
                <SparkleIcon size={12} color={scoreColor} />
                <span className="text-xs font-semibold tabular-nums" style={{ color: scoreColor }}>{submission.aiScore}%</span>
              </div>
              <span className="text-xs text-page-text-muted">{submission.checksPassed}/{submission.checksTotal} checks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => onAction?.("reject")} className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10]">
                <XCircleIcon size={14} /> Reject
              </button>
              <button onClick={() => onAction?.("approve")} className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[#00B259] px-3 text-sm font-medium text-white transition-colors hover:bg-[#00A050]">
                <CheckCircleIcon size={14} color="#fff" /> Approve
              </button>
              {onAuditLog && (
                <button onClick={onAuditLog} className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 text-xs font-medium text-page-text-muted transition-colors hover:bg-foreground/[0.10]">
                  <CentralIcon name="IconClock" size={12} color="currentColor" {...ciProps} /> Audit
                </button>
              )}
              <DotMenuPopover onViewContent={() => {}} onViewCreator={() => {}} onFlag={() => {}} />
            </div>
          </div>
        </div>

        {/* Body: 3-column */}
        <div className="flex h-[380px]">
          {/* Col 1: Video */}
          <div className="w-[200px] shrink-0 overflow-hidden border-r border-border lg:w-[260px]">
            <VideoPlayer src={submission.videoUrl} platform={submission.platform as "tiktok" | "instagram"} duration={submission.videoDuration} />
          </div>

          {/* Col 2: Stats + Chart */}
          <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto border-r border-border p-4" style={{ scrollbarWidth: "none" }}>
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2">
              <StatMiniCard label="Payout" value={submission.payout} variant="filled" />
              <StatMiniCard label="Eng. Rate" value={submission.engRate} variant="outlined" />
              <StatMiniCard label="Bot Score" value={`${submission.botScore}%`} variant="outlined" valueColor={submission.botScoreColor} />
            </div>

            {/* Metric pills */}
            <div className="flex flex-wrap gap-1.5">
              <MetricPill label="Views" value={submission.viewsNum} active={metricState.views} onClick={() => toggleMetric("views")} />
              <MetricPill label="Likes" value={submission.likesNum} active={metricState.likes} onClick={() => toggleMetric("likes")} />
              <MetricPill label="Comments" value={submission.commentsNum} active={metricState.comments} onClick={() => toggleMetric("comments")} />
              <MetricPill label="Shares" value={submission.sharesNum} active={metricState.shares} onClick={() => toggleMetric("shares")} />
            </div>

            {/* Chart */}
            <div className="flex-1" style={{ minHeight: 120 }}>
              <AnalyticsPocChartPlaceholder variant="line" chartStylePreset="performance-main" lineChart={SUBMISSIONS_CHART_DATA} activeLineDataset="daily" visibleMetricKeys={visibleMetricKeys} heightClassName="h-full" />
            </div>

            {/* Country + Age */}
            <div className="flex items-center gap-4 text-xs text-page-text-muted">
              <span>Top country: <span className="font-medium text-page-text">{submission.topCountry}</span></span>
              <span>Top age: <span className="font-medium text-page-text">{submission.topAge}</span></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Payout row ───────────────────────────────────────────────────────

const MOCK_PAYOUTS = [
  { id: "p1", creator: "xKaizen", avatar: "https://i.pravatar.cc/36?u=xkaizen", amount: "$690.00", campaign: "Caffeine AI", date: "25 Feb '26", status: "Pending", method: "PayPal" },
  { id: "p2", creator: "Cryptoclipz", avatar: "https://i.pravatar.cc/36?u=cryptoclipz", amount: "$275.00", campaign: "Caffeine AI", date: "26 Feb '26", status: "Completed", method: "Stripe" },
  { id: "p3", creator: "ViralVee", avatar: "https://i.pravatar.cc/36?u=viralvee", amount: "$425.00", campaign: "FitTrack Pro", date: "27 Feb '26", status: "Completed", method: "PayPal" },
  { id: "p4", creator: "TechTalksDaily", avatar: "https://i.pravatar.cc/36?u=techtalksdaily", amount: "$1,200.00", campaign: "NovaPay Wallet", date: "28 Feb '26", status: "Failed", method: "Wire" },
  { id: "p5", creator: "NightOwlEdits", avatar: "https://i.pravatar.cc/36?u=nightowledits", amount: "$550.00", campaign: "Caffeine AI", date: "1 Mar '26", status: "Pending", method: "Stripe" },
];

const MOCK_PAYMENTS = [
  { id: "pm1", description: "Stripe monthly payout", amount: "$4,230.00", date: "1 Mar '26", status: "Processed", type: "Payout" },
  { id: "pm2", description: "PayPal batch transfer", amount: "$1,965.00", date: "28 Feb '26", status: "Processed", type: "Payout" },
  { id: "pm3", description: "Wire transfer — NovaPay", amount: "$1,200.00", date: "27 Feb '26", status: "Failed", type: "Payout" },
  { id: "pm4", description: "Platform fee collection", amount: "$892.50", date: "1 Mar '26", status: "Completed", type: "Fee" },
  { id: "pm5", description: "Refund — Campaign #412", amount: "-$275.00", date: "25 Feb '26", status: "Refunded", type: "Refund" },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Pending: { bg: "rgba(233,162,59,0.15)", text: "#E9A23B" },
    Completed: { bg: "rgba(0,178,89,0.15)", text: "#00B259" },
    Processed: { bg: "rgba(0,178,89,0.15)", text: "#00B259" },
    Failed: { bg: "rgba(255,37,37,0.15)", text: "#FF2525" },
    Refunded: { bg: "rgba(96,165,250,0.15)", text: "#60A5FA" },
  };
  const icons: Record<string, React.ReactNode> = {
    Pending: <ClockCircleIcon size={12} color="#E9A23B" />,
    Completed: <CheckCircleIcon size={12} color="#00B259" />,
    Processed: <CheckCircleIcon size={12} color="#00B259" />,
    Failed: <XCircleIcon size={12} color="#FF2525" />,
    Refunded: <ClockCircleIcon size={12} color="#60A5FA" />,
  };
  const c = colors[status] ?? colors.Pending;
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: c.bg, color: c.text }}>
      {icons[status]}{status}
    </span>
  );
}

// ── Analytics placeholder ────────────────────────────────────────────

const TIME_RANGES = ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "Last 90 Days", "Custom Range"];

const STAT_ROWS = [
  [
    { label: "Total Deposits", value: "91" },
    { label: "Total Deposit Amount", value: "$235,867" },
    { label: "Avg Deposit", value: "$2,592" },
    { label: "Total Payouts", value: "27.6K" },
    { label: "Total Payout Amount", value: "$250,589" },
  ],
  [
    { label: "Avg Payout", value: "$9" },
    { label: "Total Submissions", value: "112.2K" },
    { label: "Total Views", value: "879.3M" },
    { label: "Total Users", value: "33.0K" },
    { label: "Active Campaigns", value: "188" },
  ],
  [
    { label: "Active Experiences", value: "1.0K" },
  ],
];

const TOP_CAMPAIGNS = [
  { rank: 1, name: "Post Higgsfield AI Seatdance 2.0 Clips — Showcase the World's Most Po...", sub: "Content Rewards", count: 5393 },
  { rank: 2, name: "GYMSHARK Clipping", sub: "", count: 4560 },
  { rank: 3, name: "The Diary of a CEO [Official Clipping]", sub: "Finality", count: 3261 },
  { rank: 4, name: "Call of Duty BO7 Gameplay Clipping Campaign [VIRAL GAMEPLAY CONT...", sub: "", count: 2922 },
  { rank: 5, name: "Polymarket Clipping Campaign", sub: "Polymarket Official Clipping", count: 2520 },
  { rank: 6, name: "Kane Brown Clipping", sub: "Some Society", count: 2381 },
  { rank: 7, name: "Polymarket UGC Reposting Campaign", sub: "Polymarket Official Clipping", count: 2376 },
];

const TOP_CREATORS = [
  { rank: 1, name: "SKY", count: 310 },
  { rank: 2, name: "Ileana Navarro", count: 248 },
  { rank: 3, name: "Escanor", count: 202 },
  { rank: 4, name: "Salman Ansari", count: 189 },
  { rank: 5, name: "ZEDD ENTERTAINMENTS", count: 185 },
  { rank: 6, name: "the_exo", count: 179 },
  { rank: 7, name: "Venu", count: 178 },
];

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = { 1: "#f6850f", 2: "#9CA3AF", 3: "#B45309" };
  const bg = colors[rank];
  return bg ? (
    <span className="flex size-6 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ background: bg }}>{rank}</span>
  ) : (
    <span className="flex size-6 items-center justify-center text-xs text-page-text-subtle">{rank}</span>
  );
}

function CountPill({ value }: { value: number }) {
  return (
    <span className="rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums" style={{ background: "rgba(246,133,15,0.15)", color: "#f6850f" }}>
      {value.toLocaleString()}
    </span>
  );
}

function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  return (
    <div className="space-y-4">
      {/* Time range pills */}
      <div className="flex flex-wrap gap-2">
        {TIME_RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setTimeRange(r)}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: timeRange === r ? "rgba(255,255,255,0.10)" : "transparent",
              color: timeRange === r ? "#fff" : "rgba(255,255,255,0.5)",
              border: `1px solid ${timeRange === r ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Stat cards grid */}
      {STAT_ROWS.map((row, ri) => (
        <div key={ri} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {row.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card-bg px-4 py-3">
              <div className="text-[11px] font-medium text-page-text-muted">{s.label}</div>
              <div className="mt-1 text-xl font-semibold text-page-text tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
      ))}

      {/* Charts: 2-column */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[
          { icon: "🪙", title: "Payout Amount" },
          { icon: "💳", title: "Payout Count" },
          { icon: "📋", title: "Submission Count" },
          { icon: "👁", title: "Total Views" },
        ].map((chart) => (
          <div key={chart.title} className="rounded-xl border border-border bg-card-bg p-4">
            <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-page-text">
              <span>{chart.icon}</span> {chart.title}
            </div>
            <div className="h-[180px]">
              <AnalyticsPocChartPlaceholder variant="line" chartStylePreset="performance-main" lineChart={SUBMISSIONS_CHART_DATA} activeLineDataset="daily" visibleMetricKeys={["views"]} heightClassName="h-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboards: 2-column */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Top Campaigns */}
        <div className="rounded-xl border border-border bg-card-bg p-4">
          <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-page-text">
            <span>💎</span> Top Campaigns by Submissions
          </div>
          <div className="space-y-0">
            {TOP_CAMPAIGNS.map((c) => (
              <div key={c.rank} className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-foreground/[0.03]">
                <RankBadge rank={c.rank} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-page-text">{c.name}</div>
                  {c.sub && <div className="truncate text-[11px] text-page-text-subtle">{c.sub}</div>}
                </div>
                <CountPill value={c.count} />
              </div>
            ))}
          </div>
        </div>

        {/* Top Creators */}
        <div className="rounded-xl border border-border bg-card-bg p-4">
          <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-page-text">
            <span>👥</span> Top Creators by Submissions
          </div>
          <div className="space-y-0">
            {TOP_CREATORS.map((c) => (
              <div key={c.rank} className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-foreground/[0.03]">
                <RankBadge rank={c.rank} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-page-text">{c.name}</span>
                <CountPill value={c.count} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Spring animation wrapper ─────────────────────────────────────────

// ── User Reports ─────────────────────────────────────────────────────

type UserReport = {
  id: string;
  reportedUser: string;
  reportedHandle: string;
  reportedAvatar: string;
  reportedStatus?: "Blacklisted";
  reporter: string;
  agency: string;
  reason: string;
  reasonColor: string;
  status: string;
  date: string;
};

const USER_REPORTS: UserReport[] = [
  { id: "r1", reportedUser: "It's Ellen", reportedHandle: "@ellen", reportedAvatar: "https://i.pravatar.cc/36?u=ellen", reporter: "@speaky", agency: "Speaky: Content Rewards", reason: "Other", reasonColor: "rgba(255,255,255,0.12)", status: "Pending", date: "Apr 9, 2026" },
  { id: "r2", reportedUser: "Adam Mutch", reportedHandle: "@adammutch1", reportedAvatar: "https://i.pravatar.cc/36?u=adammutch", reporter: "@maximefcs", agency: "Thumblab Clipping Program", reason: "Fake Engagement", reasonColor: "rgba(246,133,15,0.15)", status: "Pending", date: "Apr 7, 2026" },
  { id: "r3", reportedUser: "Soraya Love", reportedHandle: "@lovasarah", reportedAvatar: "https://i.pravatar.cc/36?u=soraya", reporter: "@maximefcs", agency: "Thumblab Clipping Program", reason: "Fake Engagement", reasonColor: "rgba(246,133,15,0.15)", status: "Pending", date: "Apr 7, 2026" },
  { id: "r4", reportedUser: "warmleaflet", reportedHandle: "@mark4321", reportedAvatar: "https://i.pravatar.cc/36?u=warmleaf", reporter: "@maximefcs", agency: "Thumblab Clipping Program", reason: "Fake Engagement", reasonColor: "rgba(246,133,15,0.15)", status: "Pending", date: "Apr 7, 2026" },
  { id: "r5", reportedUser: "abir", reportedHandle: "@abirsa054", reportedAvatar: "https://i.pravatar.cc/36?u=abir", reporter: "@morgan-", agency: "Clipping Culture", reason: "Fake Engagement", reasonColor: "rgba(246,133,15,0.15)", status: "Pending", date: "Apr 4, 2026" },
  { id: "r6", reportedUser: "Roger", reportedHandle: "@roger557", reportedAvatar: "https://i.pravatar.cc/36?u=roger", reporter: "@cxptur", agency: "Kyro Clips", reason: "Fake Engagement", reasonColor: "rgba(246,133,15,0.15)", status: "Pending", date: "Apr 4, 2026" },
  { id: "r7", reportedUser: "Popoola Habeeb", reportedHandle: "@ola891", reportedAvatar: "https://i.pravatar.cc/36?u=popoola", reporter: "@story-engine", agency: "PLAX.Inc", reason: "Suspicious Activity", reasonColor: "rgba(255,37,37,0.15)", status: "Pending", date: "Apr 4, 2026" },
  { id: "r8", reportedUser: "kushagra jangid", reportedHandle: "@jangidkushagra", reportedAvatar: "https://i.pravatar.cc/36?u=kushagra", reporter: "@story-engine", agency: "PLAX.Inc", reason: "Suspicious Activity", reasonColor: "rgba(255,37,37,0.15)", status: "Pending", date: "Apr 4, 2026" },
  { id: "r9", reportedUser: "Billy elis", reportedHandle: "@elsh0909", reportedAvatar: "https://i.pravatar.cc/36?u=billy", reportedStatus: "Blacklisted", reporter: "@story-engine", agency: "PLAX.Inc", reason: "Suspicious Activity", reasonColor: "rgba(255,37,37,0.15)", status: "Pending", date: "Apr 4, 2026" },
];

const REPORT_COLUMNS: AdminColumn[] = [
  { key: "reportedUser", label: "Reported User", width: "minmax(140px, 2fr)" },
  { key: "reporter", label: "Reporter", width: "120px", hideMobile: true },
  { key: "agency", label: "Agency", width: "minmax(120px, 1fr)", hideMobile: true },
  { key: "reason", label: "Reason", sortable: true, width: "150px" },
  { key: "status", label: "Status", sortable: true, width: "100px", hideMobile: true },
  { key: "date", label: "Date", sortable: true, width: "100px" },
  { key: "actions", label: "Actions", width: "60px" },
];

function ReportCell({ row, colKey }: { row: UserReport; colKey: string }) {
  switch (colKey) {
    case "reportedUser":
      return (
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={row.reportedAvatar} alt="" className="size-8 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium text-page-text">{row.reportedUser}</span>
              {row.reportedStatus && (
                <span className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: "rgba(255,37,37,0.15)", color: "#FF2525" }}>{row.reportedStatus}</span>
              )}
            </div>
            <div className="truncate text-xs text-page-text-subtle">{row.reportedHandle}</div>
          </div>
        </div>
      );
    case "reporter":
      return <span className="text-sm text-page-text-muted">{row.reporter}</span>;
    case "agency":
      return <span className="truncate text-sm text-page-text-muted">{row.agency}</span>;
    case "reason":
      return (
        <span className="inline-flex rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: row.reasonColor, color: row.reason === "Other" ? "var(--muted-fg)" : row.reason === "Suspicious Activity" ? "#FF2525" : "#f6850f" }}>
          {row.reason}
        </span>
      );
    case "status":
      return <span className="text-sm text-page-text-muted">{row.status}</span>;
    case "date":
      return <span className="text-xs tabular-nums text-page-text-muted">{row.date}</span>;
    case "actions":
      return (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center rounded-md transition-colors hover:bg-foreground/[0.04] cursor-pointer" style={{ width: 24, height: 24, background: "none", border: "none" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-page-text-subtle"><circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" /></svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px] rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-[10px]">
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium">View submission</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium">View reporter</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium">Dismiss report</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-[#FF2525]">Ban user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    default:
      return null;
  }
}

// ── Payouts Table ────────────────────────────────────────────────────

const PAYOUT_COLUMNS: AdminColumn[] = [
  { key: "creator", label: "Creator", width: "minmax(120px, 2fr)" },
  { key: "amount", label: "Amount", sortable: true, width: "100px" },
  { key: "campaign", label: "Campaign", width: "minmax(100px, 1fr)", hideMobile: true },
  { key: "date", label: "Date", sortable: true, width: "100px", hideMobile: true },
  { key: "method", label: "Method", width: "90px", hideMobile: true },
  { key: "status", label: "Status", sortable: true, width: "90px" },
];

function PayoutCell({ row, colKey }: { row: typeof MOCK_PAYOUTS[number]; colKey: string }) {
  switch (colKey) {
    case "creator":
      return (
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={row.avatar} alt="" className="size-7 rounded-full shrink-0" />
          <span className="truncate text-sm font-medium text-page-text">{row.creator}</span>
        </div>
      );
    case "amount": return <span className="text-sm font-semibold text-page-text">{row.amount}</span>;
    case "campaign": return <span className="truncate text-sm text-page-text-muted">{row.campaign}</span>;
    case "date": return <span className="text-sm text-page-text-muted">{row.date}</span>;
    case "method": return <span className="text-sm text-page-text-muted">{row.method}</span>;
    case "status": return <StatusBadge status={row.status} />;
    default: return null;
  }
}

// ── Flagged Submissions Table ─────────────────────────────────────────

type FlaggedSubmission = { id: string; creator: string; avatar: string; campaign: string; reason: string; reasonColor: string; flaggedBy: string; flaggedAvatar: string; date: string; status: string };

const FLAGGED_SUBMISSIONS: FlaggedSubmission[] = [
  { id: "f1", creator: "xKaizen", avatar: "https://i.pravatar.cc/32?u=xkaizen", campaign: "Caffeine AI", reason: "Bot traffic", reasonColor: "rgba(255,37,37,0.15)", flaggedBy: "Ivelin Ivanov", flaggedAvatar: "https://i.pravatar.cc/24?u=ivelin", date: "Apr 10, 2026", status: "Pending Review" },
  { id: "f2", creator: "messy", avatar: "https://i.pravatar.cc/32?u=messy", campaign: "GYMSHARK", reason: "Bot traffic", reasonColor: "rgba(255,37,37,0.15)", flaggedBy: "System", flaggedAvatar: "https://i.pravatar.cc/24?u=system", date: "Apr 9, 2026", status: "Pending Review" },
  { id: "f3", creator: "TechTalksDaily", avatar: "https://i.pravatar.cc/32?u=techtalksdaily", campaign: "NovaPay Wallet", reason: "Content violation", reasonColor: "rgba(246,133,15,0.15)", flaggedBy: "David Chen", flaggedAvatar: "https://i.pravatar.cc/24?u=david", date: "Apr 8, 2026", status: "Clawed Back" },
  { id: "f4", creator: "abir", avatar: "https://i.pravatar.cc/32?u=abir", campaign: "Clipping Culture", reason: "Copyright", reasonColor: "rgba(96,165,250,0.15)", flaggedBy: "Ivelin Ivanov", flaggedAvatar: "https://i.pravatar.cc/24?u=ivelin", date: "Apr 7, 2026", status: "Resolved" },
  { id: "f5", creator: "Roger", avatar: "https://i.pravatar.cc/32?u=roger", campaign: "Kyro Clips", reason: "Bot traffic", reasonColor: "rgba(255,37,37,0.15)", flaggedBy: "System", flaggedAvatar: "https://i.pravatar.cc/24?u=system", date: "Apr 6, 2026", status: "Pending Review" },
  { id: "f6", creator: "Billy elis", avatar: "https://i.pravatar.cc/32?u=billy", campaign: "PLAX.Inc", reason: "Content violation", reasonColor: "rgba(246,133,15,0.15)", flaggedBy: "Ivelin Ivanov", flaggedAvatar: "https://i.pravatar.cc/24?u=ivelin", date: "Apr 5, 2026", status: "Pending Review" },
];

const FLAGGED_COLUMNS: AdminColumn[] = [
  { key: "creator", label: "Submission", width: "minmax(140px, 2fr)" },
  { key: "reason", label: "Reason", width: "120px" },
  { key: "flaggedBy", label: "Flagged By", width: "130px", hideMobile: true },
  { key: "date", label: "Date", sortable: true, width: "100px" },
  { key: "status", label: "Status", width: "120px" },
];

function FlaggedCell({ row, colKey }: { row: FlaggedSubmission; colKey: string }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    "Pending Review": { bg: "rgba(233,162,59,0.15)", text: "#E9A23B" },
    "Resolved": { bg: "rgba(0,178,89,0.15)", text: "#00B259" },
    "Clawed Back": { bg: "rgba(255,37,37,0.15)", text: "#FF2525" },
  };
  switch (colKey) {
    case "creator":
      return (
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={row.avatar} alt="" className="size-7 rounded-full shrink-0" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-page-text">{row.creator}</div>
            <div className="truncate text-xs text-page-text-subtle">{row.campaign}</div>
          </div>
        </div>
      );
    case "reason": {
      const reasonText = row.reason === "Bot traffic" ? "#FF2525" : row.reason === "Copyright" ? "#60A5FA" : "#f6850f";
      return <span className="whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: row.reasonColor, color: reasonText }}>{row.reason}</span>;
    }
    case "flaggedBy":
      return (
        <div className="flex items-center gap-1.5">
          <img src={row.flaggedAvatar} alt="" className="size-4 rounded-full" />
          <span className="text-xs text-page-text-muted">{row.flaggedBy}</span>
        </div>
      );
    case "date": return <span className="text-xs text-page-text-muted">{row.date}</span>;
    case "status": {
      const c = statusColors[row.status] ?? statusColors["Pending Review"];
      const icon = row.status === "Pending Review" ? <ClockCircleIcon size={12} color={c.text} /> : row.status === "Resolved" ? <CheckCircleIcon size={12} color={c.text} /> : <XCircleIcon size={12} color={c.text} />;
      return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: c.bg, color: c.text }}>{icon}{row.status}</span>;
    }
    default: return null;
  }
}

function FlaggedSubmissionsTable() {
  return <AdminTable columns={FLAGGED_COLUMNS} data={FLAGGED_SUBMISSIONS} rowKey={(r) => r.id} renderCell={(row, colKey) => <FlaggedCell row={row} colKey={colKey} />} />;
}

// ── Clawback History Table ────────────────────────────────────────────

type ClawbackEntry = { id: string; creator: string; avatar: string; amount: string; reason: string; campaign: string; date: string; status: string };

const CLAWBACK_ENTRIES: ClawbackEntry[] = [
  { id: "cb1", creator: "TechTalksDaily", avatar: "https://i.pravatar.cc/32?u=techtalksdaily", amount: "-$1,200.00", reason: "Bot/fake views", campaign: "NovaPay Wallet", date: "Apr 8, 2026", status: "Processed" },
  { id: "cb2", creator: "messy", avatar: "https://i.pravatar.cc/32?u=messy", amount: "-$690.00", reason: "Content violation", campaign: "GYMSHARK", date: "Apr 7, 2026", status: "Pending" },
  { id: "cb3", creator: "abir", avatar: "https://i.pravatar.cc/32?u=abir", amount: "-$425.00", reason: "Deleted video", campaign: "Clipping Culture", date: "Apr 5, 2026", status: "Processed" },
  { id: "cb4", creator: "Billy elis", avatar: "https://i.pravatar.cc/32?u=billy", amount: "-$830.00", reason: "Bot/fake views", campaign: "PLAX.Inc", date: "Apr 4, 2026", status: "Disputed" },
  { id: "cb5", creator: "Roger", avatar: "https://i.pravatar.cc/32?u=roger", amount: "-$275.00", reason: "Below threshold", campaign: "Kyro Clips", date: "Apr 3, 2026", status: "Processed" },
];

const CLAWBACK_COLUMNS: AdminColumn[] = [
  { key: "creator", label: "Creator", width: "minmax(120px, 1.5fr)" },
  { key: "amount", label: "Amount", sortable: true, width: "100px" },
  { key: "reason", label: "Reason", width: "130px", hideMobile: true },
  { key: "campaign", label: "Campaign", width: "minmax(100px, 1fr)", hideMobile: true },
  { key: "date", label: "Date", sortable: true, width: "100px" },
  { key: "status", label: "Status", width: "90px" },
];

function ClawbackCell({ row, colKey }: { row: ClawbackEntry; colKey: string }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    Processed: { bg: "rgba(0,178,89,0.15)", text: "#00B259" },
    Pending: { bg: "rgba(233,162,59,0.15)", text: "#E9A23B" },
    Disputed: { bg: "rgba(96,165,250,0.15)", text: "#60A5FA" },
  };
  switch (colKey) {
    case "creator":
      return (
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={row.avatar} alt="" className="size-7 rounded-full shrink-0" />
          <span className="truncate text-sm font-medium text-page-text">{row.creator}</span>
        </div>
      );
    case "amount": return <span className="text-sm font-semibold text-[#FF2525]">{row.amount}</span>;
    case "reason": return <span className="text-xs text-page-text-muted">{row.reason}</span>;
    case "campaign": return <span className="truncate text-xs text-page-text-muted">{row.campaign}</span>;
    case "date": return <span className="text-xs text-page-text-muted">{row.date}</span>;
    case "status": {
      const c = statusColors[row.status] ?? statusColors.Pending;
      const icon = row.status === "Processed" ? <CheckCircleIcon size={12} color={c.text} /> : row.status === "Pending" ? <ClockCircleIcon size={12} color={c.text} /> : <XCircleIcon size={12} color={c.text} />;
      return <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: c.bg, color: c.text }}>{icon}{row.status}</span>;
    }
    default: return null;
  }
}

function ClawbackHistoryTable() {
  return <AdminTable columns={CLAWBACK_COLUMNS} data={CLAWBACK_ENTRIES} rowKey={(r) => r.id} renderCell={(row, colKey) => <ClawbackCell row={row} colKey={colKey} />} />;
}

// ── Payouts Table ────────────────────────────────────────────────────

function PayoutsTab() {
  return <AdminTable columns={PAYOUT_COLUMNS} data={MOCK_PAYOUTS} rowKey={(r) => r.id} renderCell={(row, colKey) => <PayoutCell row={row} colKey={colKey} />} />;
}

// ── Payment Management Table ─────────────────────────────────────────

const PAYMENT_COLUMNS: AdminColumn[] = [
  { key: "description", label: "Description", width: "minmax(140px, 2fr)" },
  { key: "amount", label: "Amount", sortable: true, width: "100px" },
  { key: "date", label: "Date", sortable: true, width: "100px", hideMobile: true },
  { key: "type", label: "Type", sortable: true, width: "90px" },
  { key: "status", label: "Status", sortable: true, width: "90px" },
];

function PaymentCell({ row, colKey }: { row: typeof MOCK_PAYMENTS[number]; colKey: string }) {
  const typeColors: Record<string, { bg: string; text: string }> = {
    Payout: { bg: "rgba(96,165,250,0.15)", text: "#60A5FA" },
    Fee: { bg: "rgba(246,133,15,0.15)", text: "#f6850f" },
    Refund: { bg: "rgba(255,37,37,0.15)", text: "#FF2525" },
  };
  switch (colKey) {
    case "description": return <span className="truncate text-sm font-medium text-page-text">{row.description}</span>;
    case "amount": return <span className="text-sm font-semibold text-page-text">{row.amount}</span>;
    case "date": return <span className="text-sm text-page-text-muted">{row.date}</span>;
    case "type": {
      const c = typeColors[row.type] ?? typeColors.Payout;
      return <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: c.bg, color: c.text }}>{row.type}</span>;
    }
    case "status": return <StatusBadge status={row.status} />;
    default: return null;
  }
}

function PaymentMgmtTab() {
  return <AdminTable columns={PAYMENT_COLUMNS} data={MOCK_PAYMENTS} rowKey={(r) => r.id} renderCell={(row, colKey) => <PaymentCell row={row} colKey={colKey} />} />;
}

// ── User Reports Table ───────────────────────────────────────────────

function UserReportsTab() {
  return (
    <AdminTable
      columns={REPORT_COLUMNS}
      data={USER_REPORTS}
      rowKey={(r) => r.id}
      renderCell={(row, colKey) => <ReportCell row={row} colKey={colKey} />}
    />
  );
}

// ── Spring animation wrapper ─────────────────────────────────────────

function SpringPopItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.8 }}
    >
      {children}
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function SuperAdminPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [actions, setActions] = useState<Record<string, "approve" | "reject">>({});
  const [auditTarget, setAuditTarget] = useState<{ type: "submission"; id: string; title: string } | null>(null);
  const handleAction = useCallback((id: string, action: "approve" | "reject") => {
    setActions((prev) => ({ ...prev, [id]: action }));
  }, []);
  const visibleSubmissions = MOCK_SUBMISSIONS.filter((s) => !actions[s.id]);

  return (
    <div>
      {/* Header with ProximityTabs */}
      <div className="flex items-center justify-between border-b border-border pr-4 sm:pr-5">
        <div className="min-w-0 flex-1 overflow-x-auto scrollbar-hide">
          <ProximityTabs
            tabs={SA_TABS.map((t) => ({ label: t.name, count: t.count }))}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex h-9 items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 dark:bg-[rgba(224,224,224,0.03)] md:w-[260px]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50">
              <path d="M11.333 11.333L14 14M2 7.333A5.333 5.333 0 1012.667 7.333 5.333 5.333 0 002 7.333z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/70" />
          </div>
          <FilterSelect filters={SA_FILTERS} activeFilters={[]} onSelect={() => {}} onRemove={() => {}} searchPlaceholder="Filter...">
            <button className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
              <FilterIcon />
            </button>
          </FilterSelect>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 sm:px-6">
        {/* Submissions tab */}
        {selectedIndex === 0 && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub) => (
                <SpringPopItem key={sub.id}>
                  <SASubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} onAuditLog={() => setAuditTarget({ type: "submission", id: sub.id, title: `${sub.creator} — ${sub.campaign}` })} />
                </SpringPopItem>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Payouts tab */}
        {selectedIndex === 1 && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card-bg p-4">
                <div className="text-xs text-page-text-muted">Total Pending</div>
                <div className="mt-1 text-xl font-semibold text-[#E9A23B]">$1,240.00</div>
              </div>
              <div className="rounded-xl border border-border bg-card-bg p-4">
                <div className="text-xs text-page-text-muted">Total Paid</div>
                <div className="mt-1 text-xl font-semibold text-[#00B259]">$5,505.00</div>
              </div>
              <div className="rounded-xl border border-border bg-card-bg p-4">
                <div className="text-xs text-page-text-muted">Failed</div>
                <div className="mt-1 text-xl font-semibold text-[#FF2525]">$1,200.00</div>
              </div>
              <div className="rounded-xl border border-border bg-card-bg p-4">
                <div className="text-xs text-page-text-muted">Avg Payout</div>
                <div className="mt-1 text-xl font-semibold text-page-text">$548.00</div>
              </div>
            </div>
            <div className="-mx-4 sm:-mx-6"><PayoutsTab /></div>
          </div>
        )}

        {/* User Reports tab */}
        {selectedIndex === 2 && (
          <div className="-mx-4 mt-4 sm:-mx-6">
            <UserReportsTab />
          </div>
        )}

        {/* Payment Management tab */}
        {selectedIndex === 3 && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card-bg p-4">
                <div className="text-xs text-page-text-muted">Processed</div>
                <div className="mt-1 text-xl font-semibold text-[#00B259]">$6,195.00</div>
              </div>
              <div className="rounded-xl border border-border bg-card-bg p-4">
                <div className="text-xs text-page-text-muted">Failed</div>
                <div className="mt-1 text-xl font-semibold text-[#FF2525]">$1,200.00</div>
              </div>
              <div className="rounded-xl border border-border bg-card-bg p-4">
                <div className="text-xs text-page-text-muted">Refunded</div>
                <div className="mt-1 text-xl font-semibold text-[#60A5FA]">-$275.00</div>
              </div>
            </div>
            <div className="-mx-4 sm:-mx-6"><PaymentMgmtTab /></div>
          </div>
        )}
      </div>

      {/* Audit Log Sheet */}
      {auditTarget && (
        <AuditLogSheet
          open={!!auditTarget}
          onClose={() => setAuditTarget(null)}
          entityType={auditTarget.type}
          entityId={auditTarget.id}
          entityTitle={auditTarget.title}
        />
      )}
    </div>
  );
}
