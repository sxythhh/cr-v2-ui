"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { AnalyticsPocDateRangePicker } from "./AnalyticsPocDateRangePicker";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { CreatorDetailsPopup, type CreatorDetailsData } from "@/components/creators/CreatorDetailsPopup";
import { AnalyticsPocChartTooltip } from "./AnalyticsPocChartTooltip";

const CARD = "rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none";
const CARD_SM = "rounded-[10px] border border-foreground/[0.06] bg-card-bg dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

/* ── Filter Bar ───────────────────────────────────────────────────── */

function FilterBar({ dateRange, setDateRange }: { dateRange: string; setDateRange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnalyticsPocDateRangePicker value={dateRange} onValueChange={setDateRange} />
    </div>
  );
}

/* ── Action Card ──────────────────────────────────────────────────── */

function ActionCard({ label, value, valueColor, subtitle, ctaLabel, ctaClassName, badge, onCtaClick }: {
  label: string;
  value: string;
  valueColor?: string;
  subtitle: string;
  ctaLabel: string;
  ctaClassName?: string;
  badge?: string;
  onCtaClick?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
      <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{label}</span>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text" style={valueColor ? { color: valueColor } : undefined}>{value}</span>
          {badge && <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{badge}</span>}
        </div>
        <p className="font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text-muted">{subtitle}</p>
        <button
          type="button"
          onClick={onCtaClick}
          className={cn(
            "flex w-full cursor-pointer items-center justify-center rounded-full px-4 py-2.5 font-inter text-xs font-medium tracking-[-0.02em] transition-colors",
            ctaClassName ?? "bg-foreground/[0.03] text-page-text hover:bg-foreground/[0.06]",
          )}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Funnel Row (colored bar background) ──────────────────────────── */

function FunnelRow({ label, pct, count, barWidth, barColor }: {
  label: string;
  pct: string;
  count: string;
  barWidth: string;
  barColor: string;
}) {
  return (
    <div className="group/funnel relative flex cursor-pointer items-center gap-4 rounded-xl px-4 py-2.5 transition-colors hover:bg-foreground/[0.02]" style={{ isolation: "isolate" }}>
      <div className="absolute inset-y-0 left-0 rounded-xl transition-all duration-200 group-hover/funnel:brightness-110" style={{ width: barWidth, background: barColor }} />
      <span className="relative z-10 flex-1 font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{label}</span>
      <div className="relative z-10 flex items-center gap-1.5">
        <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">{pct}</span>
        <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">·</span>
        <span className="font-inter text-sm tracking-[-0.02em] text-page-text transition-colors group-hover/funnel:text-page-text">{count}</span>
      </div>
    </div>
  );
}

/* ── AI Insight Card ──────────────────────────────────────────────── */

function InsightCard({ text }: { text: string }) {
  return (
    <div className={cn(CARD_SM, "overflow-hidden transition-colors hover:bg-foreground/[0.02]")}>
      <div className="flex items-center gap-1.5 border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-3 py-2.5">
        <svg width="12" height="12" viewBox="0 -960 960 960" className="text-page-text-muted" fill="currentColor"><path d="M480-80q-26 0-47-12.5T400-126q-33 0-56.5-23.5T320-206v-142q-59-39-94.5-103T190-590q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 75-35.5 139T640-348v142q0 33-23.5 56.5T560-126q-12 21-33 33.5T480-80Z"/></svg>
        <span className="flex-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text">Insight</span>
      </div>
      <div className="px-3 py-3">
        <p className="font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text">{text}</p>
      </div>
    </div>
  );
}

/* ── Participation Funnel Card ────────────────────────────────────── */

function ParticipationFunnelCard() {
  return (
    <div className={cn(CARD, "flex flex-col justify-between gap-4 p-4")}>
      <div className="flex flex-col gap-2">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Participation funnel</span>
        <div className="flex flex-col gap-1">
          <FunnelRow label="Total clippers" pct="100%" count="55,284" barWidth="52%" barColor="rgba(229,113,0,0.1)" />
          <FunnelRow label="Active" pct="13.4%" count="7,418" barWidth="16%" barColor="rgba(26,103,229,0.1)" />
          <FunnelRow label="Submitted clips" pct="5.1%" count="2,847" barWidth="10%" barColor="rgba(0,153,77,0.08)" />
          <FunnelRow label="Approved clips" pct="3.5%" count="1,923" barWidth="5%" barColor="rgba(250,204,21,0.1)" />
          <FunnelRow label="Paid out" pct="2.8%" count="1,541" barWidth="3%" barColor="rgba(174,78,238,0.1)" />
        </div>
      </div>
      <InsightCard text="67.5% of submitted clips get approved. Only 5.1% of all clippers actually submitted in the last 30 days — most are dormant." />
    </div>
  );
}

/* ── Submission Trend Card ────────────────────────────────────────── */

function SubmissionTrendCard() {
  const barData = [
    { height: 77, subs: 185 },
    { height: 97, subs: 233 },
    { height: 105, subs: 252 },
    { height: 112, subs: 269 },
    { height: 105, subs: 252 },
    { height: 105, subs: 252 },
    { height: 108, subs: 259 },
    { height: 108, subs: 259 },
    { height: 108, subs: 259 },
    { height: 97, subs: 233 },
    { height: 105, subs: 252 },
    { height: 108, subs: 259 },
  ];
  const weekLabels = ["12w ago", "11w", "10w", "9w", "8w", "7w", "6w", "5w", "4w", "3w", "2w", "This week"];
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);
  const platforms = [
    { platform: "instagram", label: "Instagram", pct: "42%", count: "345", barWidth: "50%", color: "rgba(192,132,252,0.1)", iconColor: "#C084FC" },
    { platform: "tiktok", label: "TikTok", pct: "35%", count: "289", barWidth: "42%", color: "rgba(52,211,153,0.08)", iconColor: "#34D399" },
    { platform: "youtube", label: "YouTube", pct: "15%", count: "123", barWidth: "18%", color: "rgba(251,113,133,0.1)", iconColor: "#FB7185" },
    { platform: "x", label: "X", pct: "8%", count: "61", barWidth: "10%", color: "rgba(96,165,250,0.08)", iconColor: "#60A5FA" },
  ];

  return (
    <div className={cn(CARD, "flex flex-col gap-3 py-4")}>
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Submission trend</span>
        <div className="flex items-center gap-1">
          <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">247 /week</span>
          <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#34D399]">+28%</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="group/chart relative flex items-end gap-2 px-4" style={{ height: 116 }} onMouseLeave={() => setHoveredBarIdx(null)}>
        {barData.map((bar, i) => (
          <div key={i} className="group/bar relative min-w-0 flex-1 cursor-pointer" style={{ height: 116 }} onMouseEnter={() => setHoveredBarIdx(i)}>
            <div
              className="absolute inset-x-0 bottom-0 rounded-lg transition-opacity duration-150 group-hover/chart:opacity-40 group-hover/bar:!opacity-100"
              style={{
                height: bar.height,
                background: "linear-gradient(0deg, rgba(52,211,153,0.3), rgba(52,211,153,0.3)), rgba(224,224,224,0.03)",
                borderWidth: "1px 1px 0 1px",
                borderStyle: "solid",
                borderColor: "rgba(224,224,224,0.03)",
                borderRadius: 8,
              }}
            />
          </div>
        ))}
        {/* Floating tooltip */}
        {(() => {
          const idx = hoveredBarIdx ?? 0;
          const bar = barData[idx];
          const barCount = barData.length || 1;
          const pct = ((idx + 0.5) / barCount) * 100;
          return (
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-50"
              style={{
                opacity: hoveredBarIdx !== null ? 1 : 0,
                transition: "opacity 150ms ease-out",
              }}
            >
              <div
                className="absolute top-1"
                style={{
                  left: `${pct}%`,
                  transform: `translateX(${idx <= 1 ? '0%' : idx >= barCount - 2 ? '-100%' : '-50%'})`,
                  transition: "left 120ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <AnalyticsPocChartTooltip
                  label={weekLabels[idx]}
                  rows={[{ key: "subs", color: "#34D399", label: "Submissions", value: String(bar.subs) }]}
                />
              </div>
            </div>
          );
        })()}
      </div>
      <div className="flex items-center justify-between px-4">
        <span className="font-inter text-[10px] text-page-text-muted">12w ago</span>
        <span className="font-inter text-[10px] text-page-text-muted">This week</span>
      </div>

      {/* Divider */}
      <div className="border-t border-page-border" />

      {/* By platform */}
      <div className="flex flex-col gap-1 px-4">
        <div className="flex items-center gap-1.5 pb-2">
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">By platform</span>
        </div>
        {platforms.map((p) => (
          <div key={p.label} className="group/plat relative flex cursor-pointer items-center gap-4 rounded-xl px-4 py-2.5 transition-colors hover:bg-foreground/[0.02]" style={{ isolation: "isolate" }}>
            <div className="absolute inset-y-0 left-0 rounded-xl transition-all duration-200 group-hover/plat:brightness-110" style={{ width: p.barWidth, background: p.color }} />
            <div className="relative z-10 flex flex-1 items-center gap-2">
              <PlatformIcon platform={p.platform} size={16} style={{ color: p.iconColor }} />
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{p.label}</span>
            </div>
            <div className="relative z-10 flex items-center gap-1.5">
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">{p.pct}</span>
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">·</span>
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text">{p.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Top Creators Card (matches home page podium) ────────────────── */

const TOP_CREATORS = [
  { name: "ClipMaster_Jay", earnings: "$4,280", cpm: "$0.84", rank: 1 },
  { name: "NeonEdits", earnings: "$3,912", cpm: "$0.91", rank: 2 },
  { name: "StacksOnStacks", earnings: "$3,640", cpm: "$0.78", rank: 3 },
];

const RANKED_CREATORS = [
  { rank: 4, name: "xKaizen", subtitle: "Gaming · NCA signed · Last active 2d ago", earned: "$1,654.20", cpm: "$0.84 CPM" },
  { rank: 5, name: "BetBoss", subtitle: "Gaming · NCA signed · Last active 2d ago", earned: "$1,654.20", cpm: "$0.84 CPM" },
  { rank: 6, name: "MemeQueen", subtitle: "Gaming · NCA signed · Last active 2d ago", earned: "$1,654.20", cpm: "$0.84 CPM" },
  { rank: 7, name: "SoloGrinder", subtitle: "Sports · Active · Last active 1d ago", earned: "$1,420.80", cpm: "$0.72 CPM" },
  { rank: 8, name: "VibeCheck", subtitle: "Lifestyle · NCA signed · Last active 3d ago", earned: "$1,310.50", cpm: "$0.91 CPM" },
  { rank: 9, name: "TopFrags", subtitle: "Gaming · Active · Last active 5h ago", earned: "$1,205.00", cpm: "$0.68 CPM" },
  { rank: 10, name: "EditKing", subtitle: "Gaming · NCA signed · Last active 1w ago", earned: "$980.40", cpm: "$0.55 CPM" },
];

function PodiumCard({ rank, name, earnings, height, bgColor, hoverBgColor, badgeColor, badgeContent }: {
  rank: number; name: string; earnings: string; height: string;
  bgColor: string; hoverBgColor: string; badgeColor: string;
  badgeContent: React.ReactNode;
}) {
  return (
    <button type="button" className={cn("hidden cursor-pointer flex-col items-center justify-between rounded-2xl border border-foreground/[0.06] p-4 transition-colors sm:flex", `w-full`)} style={{ height, background: bgColor }} onMouseEnter={(e) => { e.currentTarget.style.background = hoverBgColor; }} onMouseLeave={(e) => { e.currentTarget.style.background = bgColor; }}>
      <div className="flex items-center justify-center rounded-full px-2" style={{ background: badgeColor, minHeight: 24, gap: 8 }}>
        {badgeContent}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className={cn("rounded-full bg-foreground/[0.08]", rank === 1 ? "size-10" : "size-8")} />
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{name}</span>
          <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">{earnings}</span>
        </div>
      </div>
    </button>
  );
}

function MobilePodiumRow({ rank, name, earnings, bgColor, badgeColor, badgeContent }: {
  rank: number; name: string; earnings: string; bgColor: string; badgeColor: string; badgeContent: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-foreground/[0.06] p-4 sm:hidden" style={{ background: bgColor }}>
      <div className="flex items-center justify-center rounded-full px-2" style={{ background: badgeColor, minHeight: 24, gap: 8 }}>
        {badgeContent}
      </div>
      <div className="flex flex-1 items-center gap-2">
        <div className={cn("shrink-0 rounded-full bg-foreground/[0.08]", rank === 1 ? "size-8" : "size-8")} />
        <div className="flex flex-col gap-1.5">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{name}</span>
          <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">{earnings}</span>
        </div>
      </div>
    </div>
  );
}

function TopCreatorsCard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(true);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowTopGradient(el.scrollTop > 4);
    setShowBottomGradient(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  const crownIcon = <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M5.91604 0.22265C5.82331 0.0835506 5.66719 0 5.50002 0C5.33284 0 5.17672 0.0835506 5.08399 0.22265L3.32883 2.85539L0.723624 1.55279C0.552173 1.46706 0.346803 1.4869 0.194933 1.60386C0.043064 1.72083 -0.0285686 1.91432 0.010527 2.10198L1.09468 7.30593C1.2396 8.00151 1.85264 8.5 2.56315 8.5H8.43688C9.14739 8.5 9.76044 8.00151 9.90535 7.30593L10.9895 2.10198C11.0286 1.91432 10.957 1.72083 10.8051 1.60386C10.6532 1.4869 10.4479 1.46706 10.2764 1.55279L7.6712 2.85539L5.91604 0.22265Z" fill="white" /></svg>;

  return (
    <div className={cn(CARD, "flex flex-col gap-2 p-4")}>
      <div className="flex items-center justify-between">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Top creators</span>
        <button type="button" className="group flex cursor-pointer items-center gap-1.5">
          <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors duration-150 group-hover:text-page-text">View all</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text"><path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Desktop podium */}
      <div className="hidden items-end justify-center gap-2 sm:flex">
        <PodiumCard rank={2} name={TOP_CREATORS[1].name} earnings={TOP_CREATORS[1].earnings} height="197px" bgColor="rgba(131,159,185,0.04)" hoverBgColor="rgba(131,159,185,0.08)" badgeColor="#839FB9" badgeContent={<span className="font-inter text-[16px] font-medium text-white">2</span>} />
        <PodiumCard rank={1} name={TOP_CREATORS[0].name} earnings={TOP_CREATORS[0].earnings} height="260px" bgColor="rgba(229,113,0,0.04)" hoverBgColor="rgba(229,113,0,0.08)" badgeColor="#E57100" badgeContent={<>{crownIcon}<span className="font-inter text-[16px] font-medium text-white">1</span></>} />
        <PodiumCard rank={3} name={TOP_CREATORS[2].name} earnings={TOP_CREATORS[2].earnings} height="160px" bgColor="rgba(158,82,0,0.04)" hoverBgColor="rgba(158,82,0,0.08)" badgeColor="#9E5200" badgeContent={<span className="font-inter text-[16px] font-medium text-white">3</span>} />
      </div>

      {/* Mobile podium — horizontal rows */}
      <div className="flex flex-col gap-2 sm:hidden">
        <MobilePodiumRow rank={1} name={TOP_CREATORS[0].name} earnings={TOP_CREATORS[0].earnings} bgColor="linear-gradient(0deg, rgba(229,113,0,0.08), rgba(229,113,0,0.08)), var(--card-bg)" badgeColor="#E57100" badgeContent={<>{crownIcon}<span className="font-inter text-[16px] font-medium text-white">1</span></>} />
        <MobilePodiumRow rank={2} name={TOP_CREATORS[1].name} earnings={TOP_CREATORS[1].earnings} bgColor="rgba(131,159,185,0.04)" badgeColor="#839FB9" badgeContent={<span className="font-inter text-[16px] font-medium text-white">2</span>} />
        <MobilePodiumRow rank={3} name={TOP_CREATORS[2].name} earnings={TOP_CREATORS[2].earnings} bgColor="rgba(158,82,0,0.04)" badgeColor="#9E5200" badgeContent={<span className="font-inter text-[16px] font-medium text-white">3</span>} />
      </div>

      {/* Ranked list with floating Private Tier CTA */}
      <div className="relative flex-1">
        {/* Top scroll gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[32px] transition-opacity duration-200"
          style={{
            opacity: showTopGradient ? 1 : 0,
            background: "linear-gradient(to bottom, var(--card-bg), transparent)",
          }}
        />
        <div ref={scrollRef} onScroll={handleScroll} className="scrollbar-hide flex flex-col overflow-y-auto" style={{ maxHeight: 231 }}>
          {RANKED_CREATORS.map((c) => (
            <div key={c.rank} className="flex items-center">
              <div className="flex w-6 shrink-0 items-center justify-center py-3 pl-1 pr-3">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">{c.rank}</span>
              </div>
              <div className="flex min-w-0 flex-1 items-center border-b border-foreground/[0.03] py-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 pr-3">
                  <div className="size-6 shrink-0 rounded-full bg-foreground/[0.08]" />
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <span className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{c.name}</span>
                    <span className="truncate font-inter text-xs tracking-[-0.02em] text-page-text-muted">{c.subtitle}</span>
                  </div>
                </div>
                <div className="shrink-0 px-3 text-right">
                  <span className="font-inter text-xs tracking-[-0.02em] text-[#34D399]">{c.earned}</span>
                </div>
                <div className="shrink-0 px-3 text-right">
                  <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{c.cpm}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Bottom scroll gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[52px] transition-opacity duration-200"
          style={{
            opacity: showBottomGradient ? 1 : 0,
            background: "linear-gradient(to top, var(--card-bg), transparent)",
          }}
        />
        {/* Private Tier floating CTA — positioned over the list */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-0">
          <div className="flex items-center justify-between gap-2 rounded-[10px] border border-foreground/[0.06] bg-card-bg p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">Private Tier</span>
              <span className="font-inter text-xs leading-[133%] tracking-[-0.02em] text-page-text-muted">Your top 3 creators aren&apos;t in your Private Tier yet.</span>
            </div>
            <button type="button" className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-foreground px-3 py-2 font-inter text-xs font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 dark:text-[#252525]">
              <svg width="12" height="12" viewBox="0 0 14 11" fill="none"><path d="M0.08 1.47C0.05 1.6 0.03 1.74 0.02 1.87C0 2.12 0 2.42 0 2.77V7.89C0 8.24 0 8.55 0.02 8.8C0.04 9.06 0.09 9.32 0.22 9.57C0.41 9.95 0.72 10.26 1.09 10.45C1.34 10.58 1.61 10.62 1.87 10.65C2.12 10.67 2.42 10.67 2.77 10.67H10.56C10.91 10.67 11.21 10.67 11.46 10.65C11.73 10.62 11.99 10.58 12.24 10.45C12.62 10.26 12.92 9.95 13.12 9.57C13.24 9.32 13.29 9.06 13.31 8.8C13.33 8.55 13.33 8.24 13.33 7.89V2.77C13.33 2.42 13.33 2.12 13.31 1.87C13.3 1.74 13.28 1.6 13.25 1.47L7.93 5.83C7.2 6.43 6.14 6.43 5.4 5.83L0.08 1.47Z" fill="currentColor"/><path d="M12.49 0.37C12.41 0.31 12.33 0.26 12.24 0.22C11.99 0.09 11.73 0.04 11.46 0.02C11.21 0 10.91 0 10.56 0H2.77C2.42 0 2.12 0 1.87 0.02C1.61 0.04 1.34 0.09 1.09 0.22C1 0.26 0.92 0.31 0.84 0.37L6.24 4.79C6.49 4.99 6.84 4.99 7.09 4.79L12.49 0.37Z" fill="currentColor"/></svg>
              Invite all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Creator Retention Card ───────────────────────────────────────── */

function CreatorRetentionCard() {
  const retentionLegend = [
    { label: "Today", color: "#34D399", count: "1,769" },
    { label: "1-3d", color: "#60A5FA", count: "3,204" },
    { label: "4-7d", color: "#FB923C", count: "2,321" },
    { label: "1-4w", color: "#F472B6", count: "5,806" },
    { label: "1-3mo", color: "#FACC15", count: "12,160" },
    { label: "3+mo", color: "var(--page-text-muted)", count: "30,024" },
  ];

  const barSegments = [
    { width: "5%", color: "rgba(52,211,153,0.6)" },
    { width: "7%", color: "rgba(96,165,250,0.6)" },
    { width: "8%", color: "rgba(251,146,60,0.6)" },
    { width: "13%", color: "rgba(244,114,182,0.6)" },
    { width: "23%", color: "rgba(250,204,21,0.6)" },
  ];

  const churnTiers = [
    { icon: <svg width="11" height="10" viewBox="0 0 11 10" fill="none" className="text-page-text-muted"><path fillRule="evenodd" clipRule="evenodd" d="M3.41806 0.146447C3.61332-0.0488155 3.9299-0.0488155 4.12516 0.146447L5.02161 1.04289L5.91806 0.146447C6.11332-0.0488155 6.4299-0.0488155 6.62516 0.146447C6.82042 0.341709 6.82042 0.658291 6.62516 0.853553L5.52161 1.95711V4.13433L7.40746 3.04553L7.81139 1.53805C7.88286 1.27131 8.15703 1.11302 8.42376 1.18449C8.6905 1.25596 8.84879 1.53013 8.77732 1.79687L8.44919 3.02143L9.67376 3.34956C9.9405 3.42103 10.0988 3.6952 10.0273 3.96193C9.95584 4.22866 9.68168 4.38695 9.41494 4.31548L7.90746 3.91155L6.02224 4.99999L7.90746 6.08842L9.41494 5.68449C9.68168 5.61302 9.95584 5.77131 10.0273 6.03805C10.0988 6.30478 9.9405 6.57895 9.67376 6.65042L8.44919 6.97854L8.77732 8.20311C8.84879 8.46984 8.6905 8.74401 8.42376 8.81548C8.15703 8.88695 7.88286 8.72866 7.81139 8.46193L7.40746 6.95445L5.52161 5.86565V8.04289L6.62516 9.14645C6.82042 9.34171 6.82042 9.65829 6.62516 9.85355C6.4299 10.0488 6.11332 10.0488 5.91806 9.85355L5.02161 8.95711L4.12516 9.85355C3.9299 10.0488 3.61332 10.0488 3.41806 9.85355C3.22279 9.65829 3.22279 9.34171 3.41806 9.14645L4.52161 8.04289V5.86638L2.63702 6.95445L2.23309 8.46193C2.16162 8.72866 1.88745 8.88695 1.62071 8.81548C1.35398 8.74401 1.19569 8.46984 1.26716 8.20311L1.59528 6.97854L0.370715 6.65042C0.103982 6.57895-0.0543097 6.30478 0.0171612 6.03805C0.088632 5.77131 0.3628 5.61302 0.629534 5.68449L2.13702 6.08842L4.02224 4.99999L2.13702 3.91155L0.629534 4.31548C0.362801 4.38695 0.0886321 4.22866 0.0171612 3.96193C-0.0543097 3.6952 0.103982 3.42103 0.370715 3.34956L1.59528 3.02143L1.26716 1.79687C1.19569 1.53013 1.35398 1.25596 1.62071 1.18449C1.88745 1.11302 2.16162 1.27131 2.23309 1.53805L2.63702 3.04553L4.52161 4.1336V1.95711L3.41806 0.853553C3.22279 0.658291 3.22279 0.341709 3.41806 0.146447Z" fill="currentColor"/></svg>, label: "Cooling off", count: "2,341", countColor: "#FB923C", desc: "Active 1-4 weeks ago, previously submitted" },
    { icon: <svg width="9" height="10" viewBox="0 0 9 10" fill="none" className="text-page-text-muted"><path fillRule="evenodd" clipRule="evenodd" d="M1 1H0.5C0.223858 1 0 0.776142 0 0.5C0 0.223858 0.223858 0 0.5 0H8.5C8.77614 0 9 0.223858 9 0.5C9 0.776142 8.77614 1 8.5 1H8V2.46482C8 2.96635 7.74935 3.43469 7.33205 3.71289L5.40139 5L7.33205 6.28711C7.74935 6.56531 8 7.03365 8 7.53518V9H8.5C8.77614 9 9 9.22386 9 9.5C9 9.77614 8.77614 10 8.5 10H0.5C0.223858 10 0 9.77614 0 9.5C0 9.22386 0.223858 9 0.5 9H1V7.53518C1 7.03365 1.25065 6.56531 1.66795 6.28711L3.59861 5L1.66795 3.71289C1.25065 3.43469 1 2.96635 1 2.46482V1ZM2 1V2.46482C2 2.47661 2.00042 2.48834 2.00124 2.5H6.99876C6.99958 2.48834 7 2.47661 7 2.46482V1H2ZM7 8V7.53518C7 7.36801 6.91645 7.21189 6.77735 7.11916L4.5 5.60093L2.22265 7.11916C2.08355 7.21189 2 7.36801 2 7.53518V8H7Z" fill="currentColor"/></svg>, label: "Lapsed", count: "4,892", countColor: "#FB7185", desc: "Inactive 1-3 months, had previous submissions" },
    { icon: <svg width="8" height="10" viewBox="0 0 8 10" fill="none" className="text-page-text-muted"><path fillRule="evenodd" clipRule="evenodd" d="M4 0C1.79086 0 0 1.78547 0 3.98797V9.00125C0 9.81218 0.91937 10.2839 1.58124 9.81254L2.0827 9.45543C2.22486 9.35419 2.40971 9.33427 2.57028 9.40288L3.60608 9.84546C3.85763 9.95294 4.14237 9.95294 4.39392 9.84546L5.42972 9.40288C5.59029 9.33427 5.77514 9.35419 5.9173 9.45543L6.41876 9.81254C7.08063 10.2839 8 9.81218 8 9.00125V3.98797C8 1.78547 6.20914 0 4 0ZM3.5 4.25C3.5 4.66421 3.16421 5 2.75 5C2.33579 5 2 4.66421 2 4.25C2 3.83579 2.33579 3.5 2.75 3.5C3.16421 3.5 3.5 3.83579 3.5 4.25ZM5.25 5C5.66421 5 6 4.66421 6 4.25C6 3.83579 5.66421 3.5 5.25 3.5C4.83579 3.5 4.5 3.83579 4.5 4.25C4.5 4.66421 4.83579 5 5.25 5Z" fill="currentColor"/></svg>, label: "Ghost", count: "34,951", countColor: "var(--page-text)", desc: "Signed up but never submitted anything" },
  ];

  return (
    <div className={cn(CARD, "flex flex-col gap-3 px-4 py-4")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Creator retention</span>
        <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#FF3355] dark:text-[#FB7185]">76% churned</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-10 w-full overflow-hidden rounded-xl">
        {barSegments.map((seg, i) => (
          <div key={i} className="h-full border border-card-bg" style={{ width: seg.width, background: seg.color }} />
        ))}
        <div className="h-full flex-1 border border-card-bg" style={{ background: "var(--foreground)", opacity: 0.06 }} />
      </div>

      {/* Legend pills */}
      <div className="flex flex-wrap gap-1">
        {retentionLegend.map((item) => (
          <div key={item.label} className="flex items-center gap-1 rounded-full border border-foreground/[0.06] px-2 py-1 dark:border-[rgba(224,224,224,0.03)]">
            <span className="size-2 rounded-full" style={{ background: item.color }} />
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{item.label}</span>
            <span className="font-inter text-xs font-medium tracking-[-0.02em]" style={{ color: item.color }}>{item.count}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)]" />

      {/* Churn risk tiers */}
      <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Churn risk tiers</span>
      <div className="flex flex-col gap-1">
        {churnTiers.map((tier) => (
          <div key={tier.label} className={cn(CARD_SM, "cursor-pointer overflow-hidden transition-colors hover:bg-foreground/[0.02]")}>
            <div className="flex items-center justify-between border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                {tier.icon}
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{tier.label}</span>
              </div>
              <span className="font-inter text-xs font-medium tracking-[-0.02em]" style={{ color: tier.countColor }}>{tier.count}</span>
            </div>
            <div className="px-3 py-3">
              <p className="font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text">{tier.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Re-engagement CTA */}
      <div className={cn(CARD_SM, "flex items-center justify-between gap-3 p-3")}>
        <div className="flex flex-col gap-2">
          <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">Re-engagement bet</span>
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">2,341 &ldquo;Cooling Off&rdquo; creators are your best re-engagement bet</span>
        </div>
        <button type="button" className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-foreground px-3 py-2 font-inter text-xs font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 dark:text-[#252525]">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.33317 0.666016V4.66602M13.9998 7.33268H9.99984M7.33317 9.99935V13.9993M4.6665 7.33268H0.666504M7.33317 11.9993C4.75584 11.9993 2.6665 9.91001 2.6665 7.33268C2.6665 4.75535 4.75584 2.66602 7.33317 2.66602C9.9105 2.66602 11.9998 4.75535 11.9998 7.33268C11.9998 9.91001 9.9105 11.9993 7.33317 11.9993Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round"/></svg>
          Target
        </button>
      </div>
    </div>
  );
}

/* ── Private Tier Table (with proximity hover) ───────────────────── */

const PRIVATE_TIER_CREATORS = Array.from({ length: 10 }, (_, i) => ({
  rank: i + 1,
  name: ["xKaizen", "NeonEdits", "StacksOnStacks", "BetBoss", "MemeQueen", "ClipMaster_Jay", "SoloGrinder", "VibeCheck", "TopFrags", "EditKing"][i],
  subtitle: "Gaming · NCA signed · Last active 2d ago",
  views: "680K",
  cpm: "$0.84",
}));

function buildCreatorDetails(c: typeof PRIVATE_TIER_CREATORS[number]): CreatorDetailsData {
  return {
    name: c.name,
    joinedDate: "Jan 2025",
    lastActive: "2d ago",
    videoCount: 34,
    platforms: ["youtube", "tiktok"],
    category: "Gaming",
    followers: "124K",
    rating: "Rising",
    ratingStars: 3,
    totalEarned: "$4,280",
    engagementScore: 78,
    engagementRate: "6.2%",
    sentiment: "Positive",
    approvedVideos: 28,
    approvalRate: "82%",
    connectedAccounts: [
      { platform: "youtube", handle: `@${c.name}`, followers: "98K" },
      { platform: "tiktok", handle: `@${c.name}`, followers: "26K" },
    ],
    matchScore: 82,
    scoreBreakdown: { niche: 90, audience: 78, pastPerformance: 74 },
    campaigns: [
      { name: "Summer Launch", cpm: c.cpm },
      { name: "Holiday Push", cpm: "$0.92" },
    ],
    performanceData: {
      datasets: {
        daily: Array.from({ length: 30 }, (_, i) => ({
          index: i,
          label: `Day ${i + 1}`,
          views: Math.round(800 + Math.random() * 400),
          engagement: Math.round(60 + Math.random() * 40),
          likes: Math.round(40 + Math.random() * 30),
          comments: Math.round(5 + Math.random() * 10),
          shares: Math.round(2 + Math.random() * 5),
        })),
        cumulative: Array.from({ length: 30 }, (_, i) => ({
          index: i,
          label: `Day ${i + 1}`,
          views: Math.round((i + 1) * 900),
          engagement: Math.round((i + 1) * 70),
          likes: Math.round((i + 1) * 50),
          comments: Math.round((i + 1) * 8),
          shares: Math.round((i + 1) * 3),
        })),
      },
      series: [
        { key: "views" as const, label: "Views", color: "#60A5FA", axis: "left" as const },
        { key: "likes" as const, label: "Likes", color: "#F9A8D4", axis: "right" as const },
        { key: "comments" as const, label: "Comments", color: "#FB923C", axis: "right" as const },
        { key: "shares" as const, label: "Shares", color: "#55B685", axis: "right" as const },
      ],
      xTicks: [{ index: 0, label: "Day 1" }, { index: 14, label: "Day 15" }, { index: 29, label: "Day 30" }],
      yLabels: ["1.2K", "900", "600", "300", "0"],
      rightYLabels: ["80", "60", "40", "20", "0"],
    },
    performanceStats: { views: "32.4K", likes: "1.8K", comments: "420", shares: "180" },
    submissions: [
      { title: "Top 10 Plays This Week", platform: "youtube", earned: "$120.40", views: "14.2K", engRate: "7.1%", cpm: "$0.84" },
      { title: "Insane Clutch Compilation", platform: "tiktok", earned: "$89.20", views: "10.6K", engRate: "5.8%", cpm: "$0.84" },
    ],
  };
}

function PrivateTierTable() {
  const [page, setPage] = useState(1);
  const [selectedCreator, setSelectedCreator] = useState<CreatorDetailsData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(containerRef);

  useEffect(() => { measureItems(); }, [measureItems]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div className={cn(CARD, "flex flex-col")}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Private Tier Creators</span>
        <button type="button" className="flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 py-2 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-foreground/[0.03] dark:hover:bg-foreground/[0.06]">
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M0.080103 1.47237C0.0488083 1.60381 0.0312702 1.73672 0.0203819 1.86998C-1.96435e-05 2.11969-1.03164e-05 2.42284 4.95335e-07 2.77425V7.89236C-1.03164e-05 8.24377-1.96435e-05 8.54698 0.0203819 8.79669C0.0419159 9.06025 0.0894598 9.3224 0.217989 9.57465C0.409736 9.95097 0.715697 10.2569 1.09202 10.4487C1.34427 10.5772 1.60642 10.6248 1.86998 10.6463C2.11967 10.6667 2.42281 10.6667 2.7742 10.6667H10.559C10.9104 10.6667 11.2137 10.6667 11.4634 10.6463C11.7269 10.6248 11.9891 10.5772 12.2413 10.4487C12.6176 10.2569 12.9236 9.95097 13.1153 9.57465C13.2439 9.3224 13.2914 9.06025 13.313 8.79669C13.3334 8.54698 13.3333 8.2438 13.3333 7.89238V2.77429C13.3333 2.42286 13.3334 2.11969 13.313 1.86998C13.3021 1.73672 13.2845 1.60381 13.2532 1.47237L7.93314 5.82517C7.19641 6.42795 6.13692 6.42795 5.40019 5.82517L0.080103 1.47237Z" fill="currentColor"/><path d="M12.4937 0.371039C12.4138 0.314127 12.3295 0.262922 12.2413 0.217989C11.9891 0.0894597 11.7269 0.0419157 11.4634 0.0203817C11.2136-1.99278e-05 10.9105-1.0464e-05 10.5591 5.06251e-07H2.77431C2.42289-1.0464e-05 2.11969-1.99278e-05 1.86998 0.0203817C1.60642 0.0419157 1.34427 0.0894597 1.09202 0.217989C1.00383 0.262922 0.919512 0.314128 0.839618 0.37104L6.24451 4.79322C6.49009 4.99415 6.84325 4.99415 7.08883 4.79322L12.4937 0.371039Z" fill="currentColor"/></svg>
          Invite creator
        </button>
      </div>

      {/* Table */}
      <div className="mx-4 overflow-hidden rounded-xl border border-foreground/[0.06]">
        {/* Header row */}
        <div className="flex items-center border-b border-foreground/[0.06] py-2.5 pl-1">
          <span className="w-12 shrink-0 text-center font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">#</span>
          <span className="min-w-0 flex-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Creator</span>
          <span className="shrink-0 px-3 text-right font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Views</span>
          <span className="shrink-0 px-3 text-right font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">CPM</span>
        </div>

        {/* Rows with proximity hover */}
        <div
          ref={containerRef}
          className="relative flex flex-col"
          onMouseEnter={handlers.onMouseEnter}
          onMouseMove={handlers.onMouseMove}
          onMouseLeave={handlers.onMouseLeave}
        >
          <AnimatePresence>
            {activeRect && (
              <motion.div
                key={sessionRef.current}
                className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
                initial={{ opacity: 0, ...activeRect }}
                animate={{ opacity: 1, ...activeRect }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
              />
            )}
          </AnimatePresence>

          {PRIVATE_TIER_CREATORS.map((c, i) => (
            <div
              key={c.rank}
              ref={(el) => registerItem(i, el)}
              className="relative z-[1] flex cursor-pointer items-center border-b border-foreground/[0.03] py-3 pl-1"
              onClick={() => setSelectedCreator(buildCreatorDetails(c))}
            >
              <span className="w-12 shrink-0 text-center font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">{c.rank}</span>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="size-6 shrink-0 rounded-full bg-foreground/[0.08]" />
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{c.name}</span>
                  <span className="truncate font-inter text-xs tracking-[-0.02em] text-page-text-muted">{c.subtitle}</span>
                </div>
              </div>
              <span className="shrink-0 px-3 text-right font-inter text-xs tracking-[-0.02em] text-page-text">{c.views}</span>
              <span className="shrink-0 px-3 text-right font-inter text-xs tracking-[-0.02em] text-[#34D399]">{c.cpm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 px-4 py-4">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">1-10 of 50</span>
        <div className="flex items-center gap-2">
          <button type="button" className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10]">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-page-text-muted"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {[1, 2, 3, 4, 5].map((p) => (
            <button key={p} type="button" className={cn("cursor-pointer font-inter text-xs tracking-[-0.02em] transition-colors hover:text-page-text", p === page ? "text-page-text" : "text-page-text-muted")} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
          <button type="button" className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10]">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-page-text-muted"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Creator Details Popup */}
      {selectedCreator && (
        <CreatorDetailsPopup
          open={!!selectedCreator}
          onClose={() => setSelectedCreator(null)}
          creator={selectedCreator}
        />
      )}
    </div>
  );
}

/* ── Main Tab ─────────────────────────────────────────────────────── */

export function AnalyticsPocCreatorInsightsTab({ className, onReviewApplicants, onReviewQueue }: { className?: string; onReviewApplicants?: () => void; onReviewQueue?: () => void }) {
  const [dateRange, setDateRange] = useState("last-30-days");

  return (
    <div className={cn("flex flex-col gap-4 p-4 sm:p-5", className)}>
      {/* 1. Filter bar */}
      <FilterBar dateRange={dateRange} setDateRange={setDateRange} />

      {/* 2. Action cards row */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          label="Dormant creators"
          value="42,184"
          valueColor="#FB7185"
          badge="30+ days"
          subtitle="76.3% of your pool hasn't engaged. A targeted push could reactivate them."
          ctaLabel="Launch re-engagement"
          ctaClassName="bg-[rgba(251,113,133,0.08)] text-[#FB7185] hover:bg-[rgba(251,113,133,0.14)]"
        />
        <ActionCard
          label="Applicants to review"
          value="4"
          subtitle="Avg response time: 1.8 days. Faster reviews = higher creator sign-up conversion."
          ctaLabel="Review applicants"
          onCtaClick={onReviewApplicants}
        />
        <ActionCard
          label="Submissions to review"
          value="127"
          badge="30+ days"
          subtitle="67.5% approval rate. Auto-approve timer starts in 4 days for the oldest batch."
          ctaLabel="Review queue"
          onCtaClick={onReviewQueue}
        />
      </div>

      {/* 3. Funnel + Submission trend */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <ParticipationFunnelCard />
        <SubmissionTrendCard />
      </div>

      {/* 4. Top Creators + Retention */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <TopCreatorsCard />
        <CreatorRetentionCard />
      </div>

      {/* 5. Private Tier table */}
      <PrivateTierTable />
    </div>
  );
}
