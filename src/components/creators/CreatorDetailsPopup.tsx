"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { CategoryIcon as DiscoverCategoryIcon } from "@/components/discover/cards/VerifiedCardParts";

// ── Types ────────────────────────────────────────────────────────────

interface ConnectedAccount {
  platform: string;
  handle: string;
  followers: string;
}

interface Campaign {
  name: string;
  cpm: string;
}

interface Submission {
  title: string;
  platform: string;
  earned: string;
  views: string;
  engRate: string;
  cpm: string;
}

interface AgeGroup {
  label: string;
  percentage: number;
  color: string;
}

interface Country {
  code: string;
  label: string;
  percentage: number;
  color: string;
  flag?: string;
}

interface GenderSplit {
  label: string;
  percentage: number;
  color: string;
}

interface AudienceInterest {
  icon: string;
  label: string;
  percentage: number;
}

interface ScoreBreakdown {
  niche: number;
  audience: number;
  pastPerformance: number;
}

export interface CreatorDetailsData {
  name: string;
  avatar?: string;
  joinedDate: string;
  lastActive: string;
  videoCount: number;
  platforms: string[];
  category: string;
  followers: string;
  rating: "Legendary" | "Rising" | "New" | "Top";
  ratingStars: number;
  totalEarned: string;
  engagementScore: number;
  engagementRate: string;
  sentiment: string;
  approvedVideos: number;
  approvalRate: string;
  connectedAccounts: ConnectedAccount[];
  matchScore: number;
  scoreBreakdown: ScoreBreakdown;
  campaigns: Campaign[];
  performanceData: AnalyticsPocPerformanceLineChartData;
  performanceStats: {
    views: string;
    likes: string;
    comments: string;
    shares: string;
  };
  submissions: Submission[];
  demographics?: {
    ageGroups: AgeGroup[];
    countries: Country[];
    genderSplit: GenderSplit[];
    interests: AudienceInterest[];
  };
}

interface CreatorDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  creator: CreatorDetailsData;
}

// ── Star Rating ──────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center -space-x-[5px]">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="13" viewBox="0 0 14 13" fill="none">
          <path
            d="M5.39233 1.60645C5.94085 0.464645 7.56843 0.464649 8.11694 1.60645L9.12085 3.69727L11.4402 4.00195C12.6852 4.16531 13.2188 5.71081 12.281 6.5957L10.5896 8.18945L11.0144 10.4639C11.2518 11.7378 9.90461 12.6576 8.81128 12.0684L6.75464 10.959L4.698 12.0684C3.60468 12.6576 2.25746 11.7378 2.49487 10.4639L2.9187 8.18945L1.22827 6.5957C0.290437 5.71071 0.824738 4.16501 2.07007 4.00195L4.38745 3.69727L5.39233 1.60645Z"
            fill="#60A5FA"
            stroke="#1D242D"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

// ── Score Circle (large) ─────────────────────────────────────────────

function ScoreCircleLarge({ value, color = "#34D399" }: { value: number; color?: string }) {
  const r = 23;
  const circumference = 2 * Math.PI * r;
  const filled = (value / 100) * circumference;
  return (
    <div className="relative flex size-[52px] items-center justify-center">
      <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="2" opacity={0.15} />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>
      <span className="absolute text-xl font-medium tracking-[-0.02em] text-page-text">
        {value}
      </span>
    </div>
  );
}

// ── Platform Badge (small) ───────────────────────────────────────────

function PlatformBadgeSmall({ platform }: { platform: string }) {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] backdrop-blur-[12px]">
      <PlatformIcon platform={platform} size={12} className="text-page-text" />
    </div>
  );
}


// ── Stat Card ────────────────────────────────────────────────────────

function StatCard({ value, label, suffix }: { value: string; label: string; suffix?: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-3">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{value}</span>
        {suffix}
      </div>
      <span className="text-xs tracking-[-0.02em] text-page-text-muted">{label}</span>
    </div>
  );
}

// ── Metric Toggle Pill ───────────────────────────────────────────────

function MetricPill({
  label,
  value,
  color,
  active,
  onClick,
}: {
  label: string;
  value: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-6 items-center gap-1 rounded-full px-2 pr-2 pl-1 transition-colors",
        active
          ? "border border-transparent"
          : "border border-foreground/[0.03] bg-foreground/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
      )}
      style={active ? { backgroundColor: `${color}15` } : undefined}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke={active ? color : "currentColor"} strokeWidth="1.5" fill={active ? color : "none"} className={active ? "" : "opacity-30"} />
        {active && (
          <path d="M5.5 8L7.2 9.7L10.5 6.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white dark:text-[#161616]" />
        )}
      </svg>
      <span className="flex items-center gap-1.5">
        <span className="text-xs tracking-[-0.02em] text-page-text">{label}</span>
        <span className={cn("text-xs font-medium tracking-[-0.02em]", !active && "text-page-text/70")} style={active ? { color } : undefined}>
          {value}
        </span>
      </span>
    </button>
  );
}

// ── Horizontal Bar Row ───────────────────────────────────────────────

function HorizontalBarRow({
  label,
  percentage,
  color,
  suffix,
}: {
  label: string;
  percentage: number;
  color: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="relative flex h-10 items-center rounded-xl px-3 py-2.5">
      {/* Background bar */}
      <div
        className="absolute inset-y-0 left-0 rounded-xl"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center gap-2">
        <span className="text-sm font-medium tracking-[-0.07px] text-page-text">{label}</span>
      </div>
      <div className="relative z-10 flex items-center gap-1.5">
        {suffix}
        <span className="text-sm tracking-[-0.07px] text-page-text">{percentage}%</span>
      </div>
    </div>
  );
}

// ── Interest Tag ─────────────────────────────────────────────────────

function InterestTag({ icon, label, percentage }: AudienceInterest) {
  return (
    <div className="flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 pl-2 backdrop-blur-[12px]">
      <span className="text-page-text">
        <DiscoverCategoryIcon category={icon || label} />
      </span>
      <span className="flex items-center gap-1 text-xs font-medium tracking-[-0.02em]">
        <span className="text-page-text">{label}</span>
        <span className="text-page-text-muted">·</span>
        <span className="text-page-text-muted">{percentage}%</span>
      </span>
    </div>
  );
}

// ── Country Flag (SVG) ───────────────────────────────────────────────

import USFlag from "country-flag-icons/react/3x2/US";
import GBFlag from "country-flag-icons/react/3x2/GB";
import CAFlag from "country-flag-icons/react/3x2/CA";
import DEFlag from "country-flag-icons/react/3x2/DE";
import AUFlag from "country-flag-icons/react/3x2/AU";

const FLAG_COMPONENTS: Record<string, React.ComponentType<React.HTMLAttributes<HTMLElement & SVGElement>>> = {
  US: USFlag,
  GB: GBFlag,
  CA: CAFlag,
  DE: DEFlag,
  AU: AUFlag,
};

function CountryFlag({ code }: { code: string }) {
  const Flag = FLAG_COMPONENTS[code];
  if (!Flag) {
    return <div className="h-3 w-4 rounded-[2px] bg-foreground/20" />;
  }
  return <Flag className="h-3 w-4 rounded-[2px]" />;
}

// ── Performance Chart Colors ─────────────────────────────────────────

const METRIC_COLORS: Record<string, string> = {
  views: "#60A5FA",
  likes: "#F9A8D4",
  comments: "#FB923C",
  shares: "#55B685",
};

// ── Overview Tab ─────────────────────────────────────────────────────

function OverviewTab({ creator }: { creator: CreatorDetailsData }) {
  const [visibleMetrics, setVisibleMetrics] = useState<string[]>(["views", "likes", "comments"]);

  const toggleMetric = (key: string) => {
    setVisibleMetrics((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key],
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Stat cards row */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        <StatCard value={creator.totalEarned} label="Total earned" />
        <StatCard
          value={String(creator.engagementScore)}
          label="Engagement score"
          suffix={
            <span className="text-sm tracking-[-0.02em] text-page-text-muted">
              · {creator.engagementRate}
            </span>
          }
        />
        <StatCard value={creator.sentiment} label="Sentiment" />
        <StatCard value={String(creator.approvedVideos)} label="Approved videos" />
        <StatCard value={creator.approvalRate} label="Approval rate" />
      </div>

      {/* Middle cards row */}
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {/* Connected accounts */}
        <div className="flex min-h-[100px] flex-col justify-between rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-3 md:w-[298px] md:shrink-0">
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">Connected accounts</span>
          <div className="flex flex-col gap-2">
            {creator.connectedAccounts.map((account) => (
              <div key={account.handle} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <PlatformIcon platform={account.platform} size={16} className="text-page-text" />
                  <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{account.handle}</span>
                </div>
                <span className="text-sm tracking-[-0.02em] text-page-text-muted">{account.followers}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Match Score */}
        <div className="flex min-h-[100px] flex-1 flex-col rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-3">
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">Campaigns & CPMs</span>
          <div className="mt-auto flex items-center gap-3">
            <ScoreCircleLarge value={creator.matchScore} />
            <div className="flex flex-1 flex-col gap-2">
              {[
                { label: "Niche", value: creator.scoreBreakdown.niche },
                { label: "Audience", value: creator.scoreBreakdown.audience },
                { label: "Past performance", value: creator.scoreBreakdown.pastPerformance },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs tracking-[-0.02em] text-page-text-muted">{item.label}</span>
                  <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaigns & CPMs */}
        <div className="flex min-h-[100px] flex-1 flex-col justify-between rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-3">
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">Campaigns & CPMs</span>
          <div className="flex flex-col gap-2">
            {creator.campaigns.map((campaign) => (
              <div key={campaign.name} className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.name}</span>
                <span className="text-sm tracking-[-0.02em] text-page-text-muted">{campaign.cpm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance chart */}
      <div className="flex flex-col gap-2 rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Chart header */}
        <div className="flex flex-col gap-2">

          {/* Metric toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <MetricPill
              label="Views"
              value={creator.performanceStats.views}
              color="#60A5FA"
              active={visibleMetrics.includes("views")}
              onClick={() => toggleMetric("views")}
            />
            <MetricPill
              label="Likes"
              value={creator.performanceStats.likes}
              color="#F9A8D4"
              active={visibleMetrics.includes("likes")}
              onClick={() => toggleMetric("likes")}
            />
            <MetricPill
              label="Comments"
              value={creator.performanceStats.comments}
              color="#FB923C"
              active={visibleMetrics.includes("comments")}
              onClick={() => toggleMetric("comments")}
            />
            <MetricPill
              label="Shares"
              value={creator.performanceStats.shares}
              color="#55B685"
              active={!visibleMetrics.includes("shares")}
              onClick={() => toggleMetric("shares")}
            />
          </div>
        </div>

        {/* Line chart */}
        <AnalyticsPocChartPlaceholder
          variant="line"
          chartStylePreset="performance-main"
          lineChart={creator.performanceData}
          activeLineDataset="daily"
          visibleMetricKeys={visibleMetrics}
          heightClassName="h-[260px]"
        />
      </div>

      {/* Submissions table */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="px-4 pt-4 pb-2">
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">Submissions</span>
        </div>

        <div className="overflow-x-auto">
        {/* Header */}
        <div className="flex items-center border-b border-foreground/[0.06] px-1" style={{ minWidth: 600 }}>
          <div className="flex w-12 items-center justify-center py-3">
            <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">#</span>
          </div>
          <div className="flex flex-1 items-center py-3">
            <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">Post</span>
          </div>
          <div className="flex w-[132px] items-center justify-end py-3 px-3">
            <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">Platform</span>
          </div>
          <div className="flex w-[96px] items-center justify-end py-3 px-3">
            <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">Earned</span>
          </div>
          <div className="flex w-[80px] items-center justify-end py-3 px-3">
            <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">Views</span>
          </div>
          <div className="flex w-[88px] items-center justify-end py-3 px-3">
            <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">Eng. rate</span>
          </div>
          <div className="flex w-[64px] items-center justify-end py-3 px-3">
            <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">CPM</span>
          </div>
        </div>

        {/* Rows */}
        {creator.submissions.map((sub, i) => (
          <div key={i} className={cn("group/row flex cursor-pointer items-center px-1 transition-colors hover:bg-foreground/[0.02]", i < creator.submissions.length - 1 && "border-b border-foreground/[0.03]")} style={{ minWidth: 600 }}>
            <div className="flex w-12 items-center justify-center py-4">
              <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">{i + 1}</span>
            </div>
            <div className="flex flex-1 items-center py-4">
              <span className="truncate text-sm font-medium tracking-[-0.02em] text-page-text underline-offset-2 group-hover/row:underline">{sub.title}</span>
            </div>
            <div className="flex w-[132px] items-center justify-end py-4 px-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-foreground/[0.03] backdrop-blur-[12px]">
                <PlatformIcon platform={sub.platform} size={12} className="text-foreground/70" />
              </div>
            </div>
            <div className="flex w-[96px] items-center justify-end py-4 px-3">
              <span className="text-xs tracking-[-0.02em] text-page-text">{sub.earned}</span>
            </div>
            <div className="flex w-[80px] items-center justify-end py-4 px-3">
              <span className="text-xs tracking-[-0.02em] text-page-text">{sub.views}</span>
            </div>
            <div className="flex w-[88px] items-center justify-end py-4 px-3">
              <span className="text-xs tracking-[-0.02em] text-page-text">{sub.engRate}</span>
            </div>
            <div className="flex w-[64px] items-center justify-end py-4 px-3">
              <span className="text-xs tracking-[-0.02em] text-page-text">{sub.cpm}</span>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

// ── Demographics Tab ─────────────────────────────────────────────────

function DemographicsTab({ creator }: { creator: CreatorDetailsData }) {
  const demo = creator.demographics;
  if (!demo) return <div className="py-8 text-center text-sm text-page-text-muted">No demographics data available</div>;

  return (
    <div className="flex flex-col gap-2">
      {/* Age distribution */}
      <div className="flex rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-4">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">Age distribution</span>
          <div className="flex flex-col gap-2">
            {demo.ageGroups.map((group) => (
              <HorizontalBarRow
                key={group.label}
                label={group.label}
                percentage={group.percentage}
                color={group.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Audience demographics (countries) */}
      <div className="flex rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-4">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs tracking-[-0.02em] text-page-text-muted">Audience demographics</span>
            <span className="text-xs tracking-[-0.02em] text-page-text-muted">Limited data</span>
          </div>
          <div className="flex flex-col gap-2">
            {demo.countries.map((country) => (
              <HorizontalBarRow
                key={country.code}
                label={country.label}
                percentage={country.percentage}
                color={country.color}
                suffix={<CountryFlag code={country.code} />}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gender split */}
      <div className="flex rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-4">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">Gender split</span>
          <div className="flex flex-col gap-2">
            {demo.genderSplit.map((gender) => (
              <HorizontalBarRow
                key={gender.label}
                label={gender.label}
                percentage={gender.percentage}
                color={gender.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Audience interests */}
      <div className="flex rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-4">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">Audience interests</span>
          <div className="flex flex-wrap items-center gap-1">
            {demo.interests.map((interest) => (
              <InterestTag key={interest.label} {...interest} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Popup ───────────────────────────────────────────────────────

export function CreatorDetailsPopup({ open, onClose, creator }: CreatorDetailsPopupProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Modal open={open} onClose={onClose} size="xl" showClose={false}>
      {/* Header bar */}
      <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-page-border px-5">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Creator Details</span>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="scrollbar-hide flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-4">
          {/* Creator header */}
          <div className="flex flex-col gap-2">
            {/* Row 1: avatar + name + joined */}
            <div className="flex items-center gap-2">
              <div className="size-6 shrink-0 overflow-hidden rounded-full">
                <img
                  src={creator.avatar || `https://i.pravatar.cc/48?u=${creator.name}`}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{creator.name}</span>
                <span className="text-xs font-medium tracking-[-0.02em] text-foreground/20">·</span>
                <span className="text-xs tracking-[-0.02em] text-page-text-muted">joined {creator.joinedDate}</span>
                <span className="hidden text-xs font-medium tracking-[-0.02em] text-foreground/20 sm:inline">·</span>
                <span className="hidden text-xs tracking-[-0.02em] text-page-text-muted sm:inline">Last active {creator.lastActive}</span>
              </div>
            </div>

            {/* Row 2: followers + platforms + category + videos */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Followers */}
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 pl-2">
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" className="text-page-text">
                  <path d="M1.35498 2C1.35498 0.895431 2.25041 0 3.35498 0C4.45955 0 5.35498 0.895431 5.35498 2C5.35498 3.10457 4.45955 4 3.35498 4C2.25041 4 1.35498 3.10457 1.35498 2Z" fill="currentColor"/>
                  <path d="M5.85498 2C5.85498 0.895431 6.75041 0 7.85498 0C8.95955 0 9.85498 0.895431 9.85498 2C9.85498 3.10457 8.95955 4 7.85498 4C6.75041 4 5.85498 3.10457 5.85498 2Z" fill="currentColor"/>
                  <path d="M3.35485 4.5C4.79024 4.5 6.15179 5.49033 6.65855 7.30677C6.92351 8.25654 6.11346 9 5.28188 9H1.42782C0.596244 9 -0.213811 8.25654 0.0511571 7.30677C0.55791 5.49033 1.91946 4.5 3.35485 4.5Z" fill="currentColor"/>
                  <path d="M7.62216 7.03805C7.37825 6.16378 6.95893 5.42429 6.41992 4.85105C6.86769 4.61931 7.357 4.5 7.85521 4.5C9.2906 4.5 10.6521 5.49033 11.1589 7.30677C11.4239 8.25654 10.6138 9 9.78224 9H7.27034C7.65436 8.47746 7.82973 7.78207 7.62216 7.03805Z" fill="currentColor"/>
                </svg>
                <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{creator.followers}</span>
              </div>

              <span className="text-xs font-medium tracking-[-0.02em] text-foreground/20">·</span>

              {/* Platform icons */}
              <div className="flex items-center gap-1">
                {creator.platforms.map((p) => (
                  <PlatformBadgeSmall key={p} platform={p} />
                ))}
              </div>

              {/* Category */}
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 pl-2 backdrop-blur-[12px]">
                <span className="text-page-text"><DiscoverCategoryIcon category={creator.category} /></span>
                <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{creator.category}</span>
              </div>

              <span className="text-xs tracking-[-0.02em] text-page-text-muted">{creator.videoCount} videos</span>
            </div>
          </div>

          {/* Tab bar */}
          <div className="border-b border-foreground/10">
            <Tabs selectedIndex={activeTab} onSelect={setActiveTab} variant="underline" className="!border-b-0">
              <TabItem label="Overview" index={0} />
              <TabItem label="Demographics" index={1} />
            </Tabs>
          </div>

          {/* Tab content */}
          {activeTab === 0 ? (
            <OverviewTab creator={creator} />
          ) : (
            <DemographicsTab creator={creator} />
          )}
        </div>
      </div>
    </Modal>
  );
}
