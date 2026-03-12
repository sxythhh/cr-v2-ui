"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";
import { Tabs, TabItem } from "@/components/ui/tabs";

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
            fill="#1A67E5"
            stroke="#EBF2FE"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

// ── Score Circle (large) ─────────────────────────────────────────────

function ScoreCircleLarge({ value, color = "#00994D" }: { value: number; color?: string }) {
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

// ── Category Icon ────────────────────────────────────────────────────

function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, React.ReactNode> = {
    Gaming: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4.1 1.5L1.2 7.1C0.8 7.9 1.4 8.8 2.3 8.8H3.5L4.1 10.5H7.9L8.5 8.8H9.7C10.6 8.8 11.2 7.9 10.8 7.1L7.9 1.5H4.1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] backdrop-blur-[12px]">
      <span className="text-page-text">
        {icons[category] || (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.1 1.5L1.2 7.1C0.8 7.9 1.4 8.8 2.3 8.8H3.5L4.1 10.5H7.9L8.5 8.8H9.7C10.6 8.8 11.2 7.9 10.8 7.1L7.9 1.5H4.1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────

function StatCard({ value, label, suffix }: { value: string; label: string; suffix?: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-foreground/[0.06] bg-card-bg p-3">
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
          : "border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
      )}
      style={active ? { backgroundColor: `${color}15` } : undefined}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke={active ? color : "currentColor"} strokeWidth="1.5" fill={active ? color : "none"} className={active ? "" : "opacity-30"} />
        {active && (
          <path d="M5.5 8L7.2 9.7L10.5 6.3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  maxWidth = 576,
}: {
  label: string;
  percentage: number;
  color: string;
  suffix?: React.ReactNode;
  maxWidth?: number;
}) {
  const barWidth = (percentage / 100) * maxWidth;
  return (
    <div className="relative flex h-10 items-center rounded-xl px-3 py-2.5">
      {/* Background bar */}
      <div
        className="absolute inset-y-0 left-0 rounded-xl"
        style={{
          width: barWidth,
          backgroundColor: color,
          maxWidth: "100%",
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

const INTEREST_ICONS: Record<string, React.ReactNode> = {
  Gaming: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.1 1.5L1.2 7.1C0.8 7.9 1.4 8.8 2.3 8.8H3.5L4.1 10.5H7.9L8.5 8.8H9.7C10.6 8.8 11.2 7.9 10.8 7.1L7.9 1.5H4.1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Tech: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M4.5 0.0501066C4.3383 0.0693498 4.17865 0.100174 4.02217 0.142113C3.42164 0.302942 2.87424 0.610297 2.42893 1.03553C1.94023 1.50353 1.60003 2.09893 1.44213 2.75893L1.24673 3.57253C1.19353 3.79433 1.16693 4.02213 1.16693 4.25063V4.66663C1.16693 4.85103 1.11173 5.03143 1.00813 5.18503L0.49193 5.95143C0.216226 6.36033 0.103427 6.85573 0.175227 7.34093C0.247027 7.82613 0.498029 8.26693 0.878429 8.57783C1.14543 8.79583 1.46343 8.94163 1.80243 9.00143L2.70803 9.16163C3.56459 9.31301 4.43474 9.31301 5.29133 9.16163L6.19693 9.00143C6.53593 8.94163 6.85393 8.79583 7.12093 8.57783C7.50133 8.26693 7.75233 7.82613 7.82413 7.34093C7.89593 6.85573 7.78313 6.36033 7.50743 5.95143L6.99123 5.18503C6.88763 5.03143 6.83243 4.85103 6.83243 4.66663V4.25063C6.83243 4.02213 6.80583 3.79433 6.75263 3.57253L6.55723 2.75893C6.39933 2.09893 6.05913 1.50353 5.57043 1.03553C5.12513 0.610297 4.57773 0.302942 3.97723 0.142113C3.82073 0.100174 3.66103 0.0693498 3.49933 0.0501066V3.52363C3.99173 3.67163 4.36133 4.12463 4.36133 4.66063C4.36133 5.31563 3.83633 5.84763 3.18933 5.84763C2.54233 5.84763 2.01733 5.31563 2.01733 4.66063C2.01733 4.12463 2.38693 3.67163 2.87933 3.52363V0.0501066H3.49933H4.5Z" fill="currentColor"/>
      <path d="M5.5 9.89635C5.7386 9.84755 5.97291 9.78095 6.20099 9.69705L6.85299 9.45705C7.66999 9.15605 8.33299 8.55505 8.71099 7.78005L9.31899 6.53205C9.45099 6.26105 9.54699 5.97405 9.60399 5.67905C9.65599 5.41005 9.59399 5.13205 9.43299 4.91005C9.27199 4.68805 9.02699 4.54005 8.75399 4.50005L8.66399 4.48705C8.64579 4.48436 8.62745 4.48305 8.60909 4.48305V4.48305C8.49209 4.48305 8.38209 4.43905 8.29959 4.35905L7.66699 3.74305V4.25005C7.66699 4.12505 7.65799 4.00005 7.63999 3.87605V4.25005V4.66605C7.66499 4.92805 7.74499 5.18305 7.87399 5.41305L8.34799 6.25805C8.57599 6.66405 8.49699 7.17305 8.15499 7.49005L7.95199 7.67905C7.57649 8.02719 7.12279 8.28162 6.62739 8.42052C5.89479 8.62569 5.11099 8.6272 4.37439 8.42019L4.37393 8.42005C3.87833 8.28105 3.42293 8.02505 3.04793 7.67905L2.84493 7.49005C2.50293 7.17305 2.42393 6.66405 2.65193 6.25805L3.12593 5.41305C3.25493 5.18305 3.33493 4.92805 3.35993 4.66605V4.25005V3.87605C3.34193 4.00005 3.33293 4.12505 3.33293 4.25005V3.74305L2.70033 4.35905C2.61783 4.43905 2.50783 4.48305 2.39083 4.48305V4.48305C2.37247 4.48305 2.35413 4.48436 2.33593 4.48705L2.24593 4.50005C1.97293 4.54005 1.72793 4.68805 1.56693 4.91005C1.40593 5.13205 1.34393 5.41005 1.39593 5.67905C1.45293 5.97405 1.54893 6.26105 1.68093 6.53205L2.28893 7.78005C2.66693 8.55505 3.32993 9.15605 4.14693 9.45705L4.79893 9.69705C5.02703 9.78095 5.26133 9.84755 5.5 9.89635V9.89635Z" fill="currentColor"/>
    </svg>
  ),
  Entertainment: (
    <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
      <path d="M2.28824 0.226178C1.28891 -0.349494 0 0.373506 0 1.52389V8.47611C0 9.62649 1.28891 10.3495 2.28824 9.77382L8.20392 6.29771C9.18878 5.73037 9.18878 4.26963 8.20392 3.70229L2.28824 0.226178Z" fill="currentColor"/>
    </svg>
  ),
  Sports: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.58086 0.287965C2.53441 0.587965 0.930859 2.24297 0.688359 4.30097C0.649359 4.63297 0.644859 5.18397 0.676359 5.51297C0.800859 6.81197 1.48286 7.97697 2.55386 8.73697C3.13636 9.15097 3.67736 9.37897 4.36886 9.49497C4.69586 9.54997 5.32786 9.54897 5.65386 9.49297C7.16086 9.23297 8.39886 8.24597 9.00386 6.82497C9.20286 6.35797 9.32786 5.82597 9.36286 5.32697C9.38386 5.02797 9.36386 4.51397 9.31986 4.24597C9.06086 2.66497 7.92286 1.29197 6.41086 0.671965C5.96686 0.489965 5.57686 0.385965 5.10086 0.316965C4.87286 0.283965 4.79086 0.278965 4.58086 0.287965ZM5.52086 1.20697C5.56986 1.23097 5.64586 1.31497 5.71686 1.42097C5.88486 1.66697 5.96286 1.85597 6.01086 2.12497C6.04486 2.31497 6.04886 2.39697 6.02186 2.57197C5.95486 3.00397 5.76286 3.32997 5.41286 3.58497C5.26486 3.69197 4.95786 3.82297 4.80286 3.84897C4.54286 3.89297 4.35786 3.89397 4.11886 3.85497C3.76686 3.79797 3.42586 3.64297 3.28186 3.47697C3.21786 3.40397 3.18686 3.33297 3.14986 3.18197C3.09986 2.97597 3.08786 2.74297 3.11486 2.52797C3.17886 2.01997 3.37486 1.59997 3.67586 1.34097C3.80986 1.22497 4.05186 1.10397 4.22286 1.06597C4.29786 1.04897 4.37586 1.03497 4.39886 1.03397C4.42086 1.03297 4.59786 1.01597 4.79086 0.995965C5.15786 0.957965 5.22286 0.959965 5.37386 1.00697C5.42486 1.02297 5.49186 1.05097 5.52086 1.20697V1.20697Z" fill="currentColor"/>
      <path d="M0 6.5C0 6.24632 0.0456108 5.99465 0.133975 5.75736L0.60101 5.96548C0.753016 6.45858 1.01123 6.91217 1.35954 7.29717L1.60634 7.56989C2.21134 8.23889 3.03034 8.68389 3.92634 8.83089L4.61834 8.94489C4.87234 8.98689 5.12934 8.98689 5.38334 8.94489L5.56602 8.91483C5.2216 9.17498 4.83046 9.37229 4.41421 9.49564C4.28131 9.49866 4.14739 9.49466 4.01334 9.48389L3.41134 9.43489C2.78134 9.38389 2.18034 9.14489 1.68334 8.74989L1.38434 8.51289C0.521344 7.82689 0 6.78689 0 5.68989V6.5Z" fill="currentColor"/>
      <path d="M9.95719 4.25008C9.82581 3.22174 9.34224 2.27118 8.5872 1.56044L8.51034 1.72089C8.37234 2.01089 8.32034 2.33389 8.35934 2.65289L8.38034 2.82189C8.45634 3.43789 8.72834 4.01189 9.15734 4.46989L9.52934 4.86689C9.65434 5.00089 9.76034 5.15289 9.84334 5.31689L9.98134 5.58889L9.99634 5.38789C10.0363 4.84989 9.98134 4.29889 9.83834 3.77389L9.95719 4.25008Z" fill="currentColor"/>
    </svg>
  ),
  Music: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 10V3.5L9.5 2.5V9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="3" cy="10" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="8" cy="9" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  ),
};

function InterestTag({ icon, label, percentage }: AudienceInterest) {
  return (
    <div className="flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 pl-2 backdrop-blur-[12px]">
      <span className="text-page-text">
        {INTEREST_ICONS[icon] || INTEREST_ICONS[label] || (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        )}
      </span>
      <span className="flex items-center gap-1 text-xs font-medium tracking-[-0.02em]">
        <span className="text-page-text">{label}</span>
        <span className="text-page-text-muted">·</span>
        <span className="text-page-text-muted">{percentage}%</span>
      </span>
    </div>
  );
}

// ── Flag emoji helper ────────────────────────────────────────────────

function CountryFlag({ code }: { code: string }) {
  const flags: Record<string, string> = {
    US: "🇺🇸",
    GB: "🇬🇧",
    CA: "🇨🇦",
    DE: "🇩🇪",
    AU: "🇦🇺",
  };
  return <span className="text-xs">{flags[code] || "🏳️"}</span>;
}

// ── Performance Chart Colors ─────────────────────────────────────────

const METRIC_COLORS: Record<string, string> = {
  views: "#1A67E5",
  likes: "#DA5597",
  comments: "#E57100",
  shares: "#55B685",
};

// ── Overview Tab ─────────────────────────────────────────────────────

function OverviewTab({ creator }: { creator: CreatorDetailsData }) {
  const [chartMode, setChartMode] = useState(0); // 0 = Daily, 1 = Cumulative
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
      <div className="flex items-center gap-2">
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
      <div className="flex items-center gap-2">
        {/* Connected accounts */}
        <div className="flex h-[100px] w-[298px] shrink-0 flex-col justify-between rounded-2xl border border-foreground/[0.06] bg-card-bg p-3">
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
        <div className="flex h-[100px] flex-1 flex-col rounded-2xl border border-foreground/[0.06] bg-card-bg p-3">
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
        <div className="flex h-[100px] flex-1 flex-col justify-between rounded-2xl border border-foreground/[0.06] bg-card-bg p-3">
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
      <div className="flex flex-col gap-4 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Chart header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-[-0.02em] text-page-text-muted">Performance</span>
            {/* Daily / Cumulative toggle */}
            <Tabs selectedIndex={chartMode} onSelect={setChartMode} className="!gap-0.5 !rounded-xl !p-0.5">
              <TabItem label="Daily" index={0} className="!h-8 !px-4 !text-sm" />
              <TabItem label="Cumulative" index={1} className="!h-8 !px-4 !text-sm" />
            </Tabs>
          </div>

          {/* Metric toggles */}
          <div className="flex items-center gap-2">
            <MetricPill
              label="Views"
              value={creator.performanceStats.views}
              color="#1A67E5"
              active={visibleMetrics.includes("views")}
              onClick={() => toggleMetric("views")}
            />
            <MetricPill
              label="Likes"
              value={creator.performanceStats.likes}
              color="#DA5597"
              active={visibleMetrics.includes("likes")}
              onClick={() => toggleMetric("likes")}
            />
            <MetricPill
              label="Comments"
              value={creator.performanceStats.comments}
              color="#E57100"
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
          activeLineDataset={chartMode === 0 ? "daily" : "cumulative"}
          visibleMetricKeys={visibleMetrics}
          heightClassName="h-[220px]"
        />
      </div>

      {/* Submissions table */}
      <div className="flex flex-col rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="px-4 pt-4 pb-2">
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">Submissions</span>
        </div>

        {/* Header */}
        <div className="flex items-center border-b border-foreground/[0.06] px-1">
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
          <div key={i} className="flex items-center px-1">
            <div className="flex w-12 items-center justify-center py-4">
              <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">{i + 1}</span>
            </div>
            <div className={cn("flex flex-1 items-center py-4", i < creator.submissions.length - 1 && "border-b border-foreground/[0.03]")}>
              <span className="truncate text-sm font-medium tracking-[-0.02em] text-page-text">{sub.title}</span>
            </div>
            <div className={cn("flex w-[132px] items-center justify-end py-4 px-3", i < creator.submissions.length - 1 && "border-b border-foreground/[0.03]")}>
              <div className="flex size-6 items-center justify-center rounded-full bg-foreground/[0.06] backdrop-blur-[12px]">
                <PlatformIcon platform={sub.platform} size={12} className="text-foreground/70" />
              </div>
            </div>
            <div className={cn("flex w-[96px] items-center justify-end py-4 px-3", i < creator.submissions.length - 1 && "border-b border-foreground/[0.03]")}>
              <span className="text-xs tracking-[-0.02em] text-page-text">{sub.earned}</span>
            </div>
            <div className={cn("flex w-[80px] items-center justify-end py-4 px-3", i < creator.submissions.length - 1 && "border-b border-foreground/[0.03]")}>
              <span className="text-xs tracking-[-0.02em] text-page-text">{sub.views}</span>
            </div>
            <div className={cn("flex w-[88px] items-center justify-end py-4 px-3", i < creator.submissions.length - 1 && "border-b border-foreground/[0.03]")}>
              <span className="text-xs tracking-[-0.02em] text-page-text">{sub.engRate}</span>
            </div>
            <div className={cn("flex w-[64px] items-center justify-end py-4 px-3", i < creator.submissions.length - 1 && "border-b border-foreground/[0.03]")}>
              <span className="text-xs tracking-[-0.02em] text-page-text">{sub.cpm}</span>
            </div>
          </div>
        ))}
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
      <div className="flex rounded-2xl border border-foreground/[0.06] bg-card-bg p-4">
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
      <div className="flex rounded-2xl border border-foreground/[0.06] bg-card-bg p-4">
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
      <div className="flex rounded-2xl border border-foreground/[0.06] bg-card-bg p-4">
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
      <div className="flex rounded-2xl border border-foreground/[0.06] bg-card-bg p-4">
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
      <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-foreground/[0.06] bg-card-bg px-5">
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
          <div className="flex items-start justify-between">
            {/* Left: avatar + info */}
            <div className="flex flex-col gap-2">
              {/* Row 1: avatar + name + joined */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-6 shrink-0 overflow-hidden rounded-full">
                    <img
                      src={creator.avatar || `https://i.pravatar.cc/48?u=${creator.name}`}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{creator.name}</span>
                    <span className="text-xs font-medium tracking-[-0.02em] text-foreground/20">·</span>
                    <span className="text-xs tracking-[-0.02em] text-page-text-muted">joined {creator.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Row 2: rating + followers + platforms + category */}
              <div className="flex items-center gap-1.5">
                {/* Rating badge */}
                <div className="flex h-6 items-center gap-1.5 rounded-full bg-[#1A67E5]/10 px-2.5 pl-2">
                  <StarRating count={creator.ratingStars} />
                  <span className="text-xs font-medium tracking-[-0.02em] text-[#1A67E5]">{creator.rating}</span>
                </div>

                <span className="text-xs font-medium tracking-[-0.02em] text-foreground/20">·</span>

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
                  <CategoryIcon category={creator.category} />
                  <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{creator.category}</span>
                </div>
              </div>
            </div>

            {/* Right: last active + videos */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs tracking-[-0.02em] text-page-text-muted">Last active {creator.lastActive}</span>
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
