"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CreatorHeader } from "@/components/creator-header";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { CheckCircleIcon, PendingClockIcon, XCircleIcon, WreathIcon, HelpIcon } from "@/components/creator-icons";
import { StatMiniCard, MetricPill, SUBMISSIONS_CHART_DATA, VideoPlayer } from "@/components/submissions";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { TrustScoreModal } from "@/components/trust-score-modal";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

const ACCOUNTS = [
  { platform: "tiktok" as const, handle: "@vladclips" },
  { platform: "instagram" as const, handle: "@vladclips" },
  { platform: "youtube" as const, handle: "@vladclips" },
];

function AccountDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(ACCOUNTS[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", handler, { capture: true });
    return () => window.removeEventListener("click", handler, { capture: true });
  }, [open]);

  return (
    <div className="relative flex-1" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-3 py-2.5 dark:bg-white/[0.04]"
      >
        <PlatformIcon platform={selected.platform} size={16} />
        <span className="flex-1 text-left text-sm text-page-text">{selected.handle}</span>
        <svg width="9" height="5" viewBox="0 0 9 5" fill="none" className={cn("text-foreground/50 transition-transform", open && "rotate-180")}>
          <path fillRule="evenodd" clipRule="evenodd" d="M0.146 0.146c.196-.195.512-.195.707 0L4.5 3.793 8.146.146a.5.5 0 0 1 .708.708L5.207 4.5a1 1 0 0 1-1.414 0L.146.854A.5.5 0 0 1 .146.146Z" fill="currentColor"/>
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-foreground/[0.06] bg-white p-1 shadow-xl dark:border-[rgba(224,224,224,0.03)] dark:bg-[#1C1C1C]">
          {ACCOUNTS.map((acc) => (
            <button
              key={acc.platform}
              onClick={() => { setSelected(acc); setOpen(false); }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                selected.platform === acc.platform
                  ? "bg-foreground/[0.06] font-medium text-page-text dark:bg-white/[0.08]"
                  : "text-foreground/60 hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04]"
              )}
            >
              <PlatformIcon platform={acc.platform} size={16} />
              {acc.handle}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const stats = [
  { value: "194", label: "Approved", color: "#00994D", bg: "rgba(0,153,77,0.08)", bgDark: "rgba(0,153,77,0.08)", icon: (c: string) => <CheckCircleIcon color={c} />, iconColorDark: "#34D399", hasHelp: false },
  { value: "12", label: "Pending", color: "#E57100", bg: "rgba(229,113,0,0.08)", bgDark: "rgba(251,146,60,0.08)", icon: (c: string) => <PendingClockIcon color={c} />, iconColorDark: "#FB923C", hasHelp: false },
  { value: "0", label: "Rejected", color: "#FF3355", bg: "rgba(255,51,85,0.08)", bgDark: "rgba(255,102,128,0.08)", icon: (c: string) => <XCircleIcon color={c} />, iconColorDark: "#FF6680", hasHelp: false },
  { value: "92", label: "Trust score", color: "#00994D", bg: "rgba(0,153,77,0.08)", bgDark: "rgba(0,153,77,0.08)", icon: (c: string) => <WreathIcon color={c} />, iconColorDark: "#34D399", hasHelp: true },
];

const filterTabs = [
  { label: "All", count: 206 },
  { label: "In review", count: 3 },
  { label: "Approved", count: 194 },
  { label: "Rejected", count: 0 },
  { label: "Archived", count: 3 },
];

const clips = [
  {
    title: "Catina - All Platforms",
    brand: "Sound Network",
    date: "Feb 10, 2026",
    status: "Pending" as const,
    statusColor: "#E57100",
    statusColorDark: "#FB923C",
    statusBg: "rgba(229,113,0,0.08)",
    statusBgDark: "rgba(251,146,60,0.08)",
    xp: "50 XP",
    earned: "$0.09",
    received: "$0.00",
    pending: "$1.00",
    pendingColor: "#E57100",
    pendingColorDark: "#FB923C",
    metrics: { views: "1.2M", likes: "48.2K", comments: "3.1K", shares: "1.3K" },
    topCountry: "UK",
    topAge: "18-24",
    hasViewPayout: true,
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    platform: "tiktok" as const,
    videoDuration: "01:15",
  },
  {
    title: "Catina - All Platforms",
    brand: "Sound Network",
    date: "Feb 10, 2026",
    status: "Rejected" as const,
    statusColor: "#FF3355",
    statusColorDark: "#FF6680",
    statusBg: "rgba(255,51,85,0.08)",
    statusBgDark: "rgba(255,102,128,0.08)",
    xp: null,
    earned: "$0.00",
    received: "$0.00",
    pending: "$0.00",
    pendingColor: "#252525",
    pendingColorDark: "#E0E0E0",
    metrics: { views: "1.2M", likes: "48.2K", comments: "3.1K", shares: "1.3K" },
    topCountry: "UK",
    topAge: "18-24",
    hasViewPayout: false,
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    platform: "tiktok" as const,
    videoDuration: "01:15",
  },
];

const timelineEvents = [
  { user: "@vladclips", avatar: "user", time: "Tue 24 Feb 4:37 AM", icon: "tiktok", action: "Posted video" },
  { user: "@vladclips", avatar: "user", time: "Wed 25 Feb 12:37 AM", icon: "upload", action: "Submitted video" },
  { user: "Outpace Studios", avatar: "brand", time: "Wed 25 Feb 1:21 AM", icon: "timestamp", action: "00:08", detail: "You're mentioning the wrong competitor" },
  { user: "Outpace Studios", avatar: "brand", time: "Wed 25 Feb 1:21 AM", icon: "rejected", action: "Rejected video" },
];

const submitCampaigns = [
  { name: "Cantina - All formats", detail: "CPM \u00b7 $2.50/1k views" },
  { name: "Cantina - All formats", detail: "CPM \u00b7 $2.50/1k views" },
  { name: "Cantina - All formats", detail: "Retainer \u00b7 $500/month" },
  { name: "Cantina - All formats", detail: "Per post \u00b7 $100/video" },
];

export default function CreatorSubmissionsPage() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const [viewMode, setViewMode] = useState<"list" | "card">("card");
  const statScrollRef = useRef<HTMLDivElement>(null);
  const [statActiveIndex, setStatActiveIndex] = useState(0);

  const handleStatScroll = useCallback(() => {
    const el = statScrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).offsetWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setStatActiveIndex(Math.min(index, stats.length - 1));
  }, []);
  const [activeFilter, setActiveFilter] = useState(0);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payoutClipIndex, setPayoutClipIndex] = useState(0);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [trustScoreOpen, setTrustScoreOpen] = useState(false);
  const [submitStep, setSubmitStep] = useState<"select" | "pick">("select");
  const [submitTab, setSubmitTab] = useState<"feed" | "link">("feed");
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const feedCarouselRef = useRef<HTMLDivElement>(null);
  // fullscreen clip removed — video plays inline
  const [metricState, setMetricState] = useState<Record<string, boolean>>({
    views: true, likes: true, comments: true, shares: false,
  });
  const toggleMetric = useCallback((key: string) => {
    setMetricState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);
  const visibleMetricKeys = useMemo(
    () => Object.entries(metricState).filter(([, on]) => on).map(([k]) => k),
    [metricState],
  );

  return (
    <div className="flex min-h-screen flex-col font-inter tracking-[-0.02em]">
      <CreatorHeader title="My clips" />

      <div className="mx-auto flex w-full max-w-[756px] flex-col gap-6 px-4 py-4 sm:px-5 md:px-4">
        {/* Stat cards — mobile carousel */}
        <div className="-mx-4 flex flex-col items-center gap-2 sm:-mx-5 md:hidden">
          <div
            ref={statScrollRef}
            onScroll={handleStatScroll}
            className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 scrollbar-hide [scroll-padding-inline:16px] sm:pl-5 sm:[scroll-padding-inline:20px]"
          >
            {stats.map((s, i) => {
              const isClickable = s.label === "Trust score";
              return (
                <div
                  key={s.label}
                  className={cn("w-[calc(50%-4px)] shrink-0 snap-start snap-always", i === stats.length - 1 && "mr-4 sm:mr-5")}
                >
                  <div
                    className={cn(cardCls, "flex h-[61px] items-center gap-3 overflow-hidden pr-3", isClickable && "cursor-pointer")}
                    onClick={isClickable ? () => setTrustScoreOpen(true) : undefined}
                  >
                    <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
                      <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                        <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill={isDark ? s.bgDark : s.bg} />
                      </svg>
                      <div className="relative flex h-full w-full items-center justify-center">
                        {s.icon(isDark ? s.iconColorDark : s.color)}
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                      <span className="text-sm font-medium text-page-text">{s.value}</span>
                      <span className="flex items-center gap-1 text-xs text-page-text-muted">
                        {s.label}
                        {s.hasHelp && <HelpIcon className="shrink-0" />}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            {stats.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const child = statScrollRef.current?.children[i] as HTMLElement | undefined;
                  child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
                }}
                className={cn(
                  "size-1.5 cursor-pointer rounded-full transition-colors",
                  i === statActiveIndex ? "bg-page-text" : "bg-foreground/10 dark:bg-white/10",
                )}
              />
            ))}
          </div>
        </div>

        {/* Stat cards — desktop grid */}
        <div className="hidden grid-cols-4 gap-2 md:grid">
          {stats.map((s) => {
            const isClickable = s.label === "Trust score";
            return (
              <div
                key={s.label}
                className={cn(cardCls, "flex h-[61px] items-center gap-3 overflow-hidden pr-3", isClickable && "cursor-pointer transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]")}
                onClick={isClickable ? () => setTrustScoreOpen(true) : undefined}
              >
                <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
                  <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                    <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill={isDark ? s.bgDark : s.bg} />
                  </svg>
                  <div className="relative flex h-full w-full items-center justify-center">
                    {s.icon(isDark ? s.iconColorDark : s.color)}
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                  <span className="text-sm font-medium text-page-text">{s.value}</span>
                  <span className="flex items-center gap-1 text-xs text-page-text-muted">
                    {s.label}
                    {s.hasHelp && <HelpIcon className="shrink-0" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="flex items-start justify-between gap-4">
          <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:-mx-5 sm:px-5 md:mx-0 md:px-0">
            <Tabs selectedIndex={activeFilter} onSelect={setActiveFilter} className="w-fit">
              {filterTabs.map((t, i) => (
                <TabItem key={t.label} label={t.label} count={t.count} index={i} />
              ))}
            </Tabs>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => setViewMode((v) => (v === "list" ? "card" : "list"))}
              className="flex size-9 items-center justify-center rounded-xl bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
              title={`Switch to ${viewMode === "list" ? "card" : "list"} view`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeOpacity={0.8} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <button onClick={() => setSubmitOpen(true)} className="flex h-9 items-center rounded-full px-4 text-sm font-medium text-white" style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}>
              Submit clip
            </button>
          </div>
        </div>

        {/* Clip cards — list view */}
        {viewMode === "list" && (
          <div className="flex flex-col gap-2">
            {clips.map((clip, idx) => (
              <div key={idx} className={cn("overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]")}>
                {/* Header row */}
                <div className="flex items-center border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)]">
                  <div className="flex flex-1 items-center gap-3 p-3">
                    <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-medium text-page-text">{clip.title}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-page-text-subtle">{clip.brand}</span>
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M5.8.8C6.5.1 7.5.1 8.2.8L8.9 1.5l1-.2c.9-.2 1.8.4 2 1.3l.2 1 .9.5c.8.4 1.1 1.4.7 2.2l-.5.9.5.9c.4.8.1 1.8-.7 2.2l-.9.5-.2 1c-.2.9-1.1 1.5-2 1.3l-1-.2-.7.7c-.7.7-1.7.7-2.4 0l-.7-.7-1 .2c-.9.2-1.8-.4-2-1.3l-.2-1-.9-.5c-.8-.4-1.1-1.4-.7-2.2l.5-.9-.5-.9c-.4-.8-.1-1.8.7-2.2l.9-.5.2-1C2.3 1.7 3.2 1.1 4.1 1.3l1 .2.7-.7Z" fill="url(#vg)"/><path d="M5 7l1.5 1.5 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="vg" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#FDDC87"/><stop offset="1" stopColor="#FCB02B"/></linearGradient></defs></svg>
                        <span className="text-page-text-subtle">&middot;</span>
                        <span className="text-page-text-subtle">{clip.date}</span>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium" style={{ color: isDark ? clip.statusColorDark : clip.statusColor, backgroundColor: isDark ? clip.statusBgDark : clip.statusBg }}>
                        {clip.status}
                      </span>
                      {clip.xp && (
                        <span className="flex items-center gap-1 rounded-full border border-foreground/[0.06] px-2 py-1 text-xs font-medium text-page-text dark:border-[rgba(224,224,224,0.03)]">
                          <svg width="12" height="12" viewBox="0 0 11 10" fill="none"><path d="M5.937.431C5.66-.144 4.84-.144 4.564.431L3.384 2.89.663 3.246C.033 3.328-.23 4.108.24 4.55L2.227 6.425 1.729 9.1c-.119.636.554 1.107 1.11.807L5.25 8.607l2.413 1.3c.555.3 1.228-.17 1.11-.807L8.274 6.425l1.988-1.875c.47-.443.207-1.222-.394-1.305L7.118 2.89 5.937.431Z" fill={isDark ? "#FB923C" : "#E57100"}/></svg>
                          {clip.xp}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-l border-foreground/[0.06] px-3 py-3 dark:border-[rgba(224,224,224,0.03)]">
                    {clip.hasViewPayout && (
                      <button onClick={() => { setPayoutClipIndex(idx); setPayoutOpen(true); }} className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">View payout</button>
                    )}
                    <button onClick={() => setTimelineOpen(true)} className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">View timeline</button>
                  </div>
                </div>

                {/* Content row */}
                <div className="flex flex-col md:flex-row" style={{ height: "auto" }}>
                  {/* Col 1: Video Player */}
                  <div className="h-[200px] w-full shrink-0 overflow-hidden sm:h-[300px] md:h-auto md:w-[220px] lg:w-[260px]">
                    <VideoPlayer
                      src={clip.videoUrl}
                      platform={clip.platform}
                      duration={clip.videoDuration}
                    />
                  </div>

                  {/* Col 2: Stats, Chart, Info */}
                  <div className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
                    <div className="flex gap-2">
                      <StatMiniCard value={clip.earned} label="Total earned" variant="filled" />
                      <StatMiniCard value={clip.received} label="Received" variant="outlined" />
                      <StatMiniCard value={clip.pending} label="Pending" valueColor={isDark ? clip.pendingColorDark : clip.pendingColor} variant="outlined" />
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-2xl border border-foreground/[0.06] bg-card-bg p-3 dark:border-card-inner-border dark:bg-card-inner-bg">
                      <div className="flex flex-wrap items-center gap-2 pb-2">
                        <MetricPill label="Views" value={clip.metrics.views} color="#4D81EE" bg="rgba(77,129,238,0.1)" active={metricState.views} onClick={() => toggleMetric("views")} />
                        <MetricPill label="Likes" value={clip.metrics.likes} color="#DA5597" bg="rgba(218,85,151,0.1)" active={metricState.likes} onClick={() => toggleMetric("likes")} />
                        <MetricPill label="Comments" value={clip.metrics.comments} color="#E9A23B" bg="rgba(233,162,59,0.1)" active={metricState.comments} onClick={() => toggleMetric("comments")} />
                        <MetricPill label="Shares" value={clip.metrics.shares} color="var(--page-text-subtle)" bg="rgba(128,128,128,0.1)" active={metricState.shares} onClick={() => toggleMetric("shares")} />
                      </div>
                      <AnalyticsPocChartPlaceholder variant="line" chartStylePreset="performance-main" lineChart={SUBMISSIONS_CHART_DATA} activeLineDataset="daily" visibleMetricKeys={visibleMetricKeys} heightClassName="h-[172px]" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg px-3 py-3 dark:border-card-inner-border dark:bg-card-inner-bg">
                        <span className="shrink-0 font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">Top country</span>
                        <span className="truncate font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{clip.topCountry}</span>
                      </div>
                      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg px-3 py-3 dark:border-card-inner-border dark:bg-card-inner-bg">
                        <span className="shrink-0 font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">Top age</span>
                        <span className="truncate font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{clip.topAge}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clip cards — card grid view */}
        {viewMode === "card" && (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {clips.map((clip, idx) => (
              <div key={idx} className="flex flex-col overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                {/* Header — 60px */}
                <div className="flex items-center gap-3 p-3">
                  <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="truncate font-medium text-page-text">{clip.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-page-text-subtle">{clip.brand}</span>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M5.8.8C6.5.1 7.5.1 8.2.8L8.9 1.5l1-.2c.9-.2 1.8.4 2 1.3l.2 1 .9.5c.8.4 1.1 1.4.7 2.2l-.5.9.5.9c.4.8.1 1.8-.7 2.2l-.9.5-.2 1c-.2.9-1.1 1.5-2 1.3l-1-.2-.7.7c-.7.7-1.7.7-2.4 0l-.7-.7-1 .2c-.9.2-1.8-.4-2-1.3l-.2-1-.9-.5c-.8-.4-1.1-1.4-.7-2.2l.5-.9-.5-.9c-.4-.8-.1-1.8.7-2.2l.9-.5.2-1C2.3 1.7 3.2 1.1 4.1 1.3l1 .2.7-.7Z" fill="url(#cvg)"/><path d="M5 7l1.5 1.5 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="cvg" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#FDDC87"/><stop offset="1" stopColor="#FCB02B"/></linearGradient></defs></svg>
                      <span className="text-page-text-subtle">&middot;</span>
                      <span className="text-page-text-subtle">{clip.date}</span>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium" style={{ color: isDark ? clip.statusColorDark : clip.statusColor, backgroundColor: isDark ? clip.statusBgDark : clip.statusBg }}>
                    <svg className="size-3 shrink-0" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill={isDark ? clip.statusColorDark : clip.statusColor} /></svg>
                    {clip.status}
                  </span>
                </div>

                {/* Video preview — 280px */}
                <div className="relative h-[280px] w-full overflow-hidden">
                  {/* Blurred thumbnail background */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage: `url(/creator-home/campaign-thumb-${(idx % 3) + 1}.png)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(50px)",
                    }}
                  />
                  <VideoPlayer
                    src={clip.videoUrl}
                    platform={clip.platform}
                    duration={clip.videoDuration}
                    showChat
                  />
                </div>

                {/* Stats bar */}
                <div className="p-3">
                  <div className="flex items-center justify-center gap-3 rounded-2xl border border-foreground/[0.06] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="text-sm font-medium leading-[120%] tracking-[-0.02em]">{clip.earned}</span>
                      <span className="text-xs leading-none tracking-[-0.02em] text-foreground/70">Total earned</span>
                    </div>
                    <div className="h-[37px] w-px bg-foreground/[0.06] dark:bg-[rgba(224,224,224,0.03)]" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="text-sm font-medium leading-[120%] tracking-[-0.02em]">{clip.received}</span>
                      <span className="text-xs leading-none tracking-[-0.02em] text-foreground/70">Received</span>
                    </div>
                    <div className="h-[37px] w-px bg-foreground/[0.06] dark:bg-[rgba(224,224,224,0.03)]" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="text-sm font-medium leading-[120%] tracking-[-0.02em]" style={{ color: isDark ? clip.pendingColorDark : clip.pendingColor }}>{clip.pending}</span>
                      <span className="text-xs leading-none tracking-[-0.02em] text-foreground/70">Pending</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 px-3 pb-3">
                  <button onClick={() => { setPayoutClipIndex(idx); setPayoutOpen(true); }} className="flex flex-1 items-center justify-center rounded-full bg-foreground/[0.06] py-2 text-xs font-medium tracking-[-0.02em] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">View payout</button>
                  <button onClick={() => setTimelineOpen(true)} className="flex flex-1 items-center justify-center rounded-full bg-foreground/[0.06] py-2 text-xs font-medium tracking-[-0.02em] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">View timeline</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline Modal */}
      <Modal open={timelineOpen} onClose={() => setTimelineOpen(false)} size="md">
        <ModalHeader>Timeline</ModalHeader>
        <ModalBody>
            <div className="flex flex-col gap-6 p-5">
              {/* Clip card mini */}
              <div className={cn(cardCls, "flex overflow-hidden")}>
                <div className="w-[72px] shrink-0 p-1 pl-1">
                  <div className="h-[112px] w-[68px] rounded-xl bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg, transparent 68%, rgba(0,0,0,0.4) 100%), url(/creator-home/campaign-thumb-1.png)" }} />
                </div>
                <div className="flex flex-col gap-3 p-3 pl-4 pt-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="size-4 rounded-full border border-foreground/[0.06] bg-gradient-to-br from-blue-400 to-purple-500" />
                      <span className="font-medium text-page-text">Sound Network</span>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M5.8.8C6.5.1 7.5.1 8.2.8L8.9 1.5l1-.2c.9-.2 1.8.4 2 1.3l.2 1 .9.5c.8.4 1.1 1.4.7 2.2l-.5.9.5.9c.4.8.1 1.8-.7 2.2l-.9.5-.2 1c-.2.9-1.1 1.5-2 1.3l-1-.2-.7.7c-.7.7-1.7.7-2.4 0l-.7-.7-1 .2c-.9.2-1.8-.4-2-1.3l-.2-1-.9-.5c-.8-.4-1.1-1.4-.7-2.2l.5-.9-.5-.9c-.4-.8-.1-1.8.7-2.2l.9-.5.2-1C2.3 1.7 3.2 1.1 4.1 1.3l1 .2.7-.7Z" fill="url(#tlv)"/><path d="M5 7l1.5 1.5 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="tlv" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#FDDC87"/><stop offset="1" stopColor="#FCB02B"/></linearGradient></defs></svg>
                      <span className="text-page-text-subtle">Feb 10, 2026</span>
                    </div>
                    <span className="text-sm font-medium text-page-text">Caffeine vs Competitors - Honest Take</span>
                  </div>
                </div>
              </div>

              {/* Timeline events */}
              <div className="relative flex flex-col gap-5 pl-4">
                {/* Vertical line */}
                <div className="absolute bottom-6 left-[23px] top-2 w-px bg-foreground/[0.12] dark:bg-white/[0.12]" />
                {timelineEvents.map((ev, i) => (
                  <div key={i} className="relative flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="relative z-10 size-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                      <div className="flex flex-1 items-center gap-1.5">
                        <span className="text-sm font-medium text-page-text">{ev.user}</span>
                        <span className="ml-auto text-xs text-page-text-subtle">{ev.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 pl-6 text-sm text-page-text-muted">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-foreground/50"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" fill="none"/></svg>
                      <span>{ev.detail ? `${ev.action} ` : ""}{ev.action === "00:08" ? "" : ev.action}</span>
                      {ev.detail && (
                        <>
                          <span className="rounded-full border border-foreground/[0.06] px-1.5 py-0.5 text-xs text-page-text-muted">{ev.action}</span>
                          <span className="text-sm text-page-text-muted">{ev.detail}</span>
                        </>
                      )}
                      {!ev.detail && <span>{ev.action}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment input */}
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                <button className="flex size-10 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text dark:bg-white/[0.06]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.5 2.5v11M4 7.5l4.5-5 4.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45, 8, 8)"/></svg>
                </button>
                <div className="flex flex-1 items-center rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 dark:bg-white/[0.04]">
                  <span className="text-sm text-foreground/40">Leave a comment...</span>
                </div>
              </div>
            </div>
        </ModalBody>
      </Modal>

      {/* Payout Details Modal */}
      <Modal open={payoutOpen} onClose={() => setPayoutOpen(false)} size="md">
        <ModalHeader>Payout details</ModalHeader>
        <ModalBody>
            <div className="flex flex-col items-center gap-6 p-5">
              {/* Minimum payout notice */}
              <div className="flex items-center justify-center gap-1.5 pb-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-foreground/50"><circle cx="6" cy="6" r="5" fill="currentColor"/><path d="M6 4v3M6 8.5h0" stroke="var(--card-bg, white)" strokeWidth="1" strokeLinecap="round"/></svg>
                <span className="text-xs font-medium text-page-text-subtle">Minimum payout threshold $1.00</span>
              </div>

              {/* Clip card mini */}
              <div className={cn(cardCls, "flex w-full overflow-hidden")}>
                <div className="w-[72px] shrink-0 p-1 pl-1">
                  <div className="h-[112px] w-[68px] rounded-xl bg-cover bg-center" style={{ backgroundImage: "linear-gradient(180deg, transparent 68%, rgba(0,0,0,0.4) 100%), url(/creator-home/campaign-thumb-1.png)" }} />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-3 pl-4 pt-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="size-4 rounded-full border border-foreground/[0.06] bg-gradient-to-br from-blue-400 to-purple-500" />
                      <span className="font-medium text-page-text">Sound Network</span>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M5.8.8C6.5.1 7.5.1 8.2.8L8.9 1.5l1-.2c.9-.2 1.8.4 2 1.3l.2 1 .9.5c.8.4 1.1 1.4.7 2.2l-.5.9.5.9c.4.8.1 1.8-.7 2.2l-.9.5-.2 1c-.2.9-1.1 1.5-2 1.3l-1-.2-.7.7c-.7.7-1.7.7-2.4 0l-.7-.7-1 .2c-.9.2-1.8-.4-2-1.3l-.2-1-.9-.5c-.8-.4-1.1-1.4-.7-2.2l.5-.9-.5-.9c-.4-.8-.1-1.8.7-2.2l.9-.5.2-1C2.3 1.7 3.2 1.1 4.1 1.3l1 .2.7-.7Z" fill="url(#pvb)"/><path d="M5 7l1.5 1.5 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="pvb" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#FDDC87"/><stop offset="1" stopColor="#FCB02B"/></linearGradient></defs></svg>
                      <span className="text-page-text-subtle">Feb 10, 2026</span>
                    </div>
                    <span className="text-sm font-medium leading-[120%] text-page-text">Caffeine vs Competitors - Honest Take</span>
                  </div>
                </div>
              </div>

              {/* Earning row */}
              <div className={cn(cardCls, "flex w-full items-center justify-center gap-0 p-3")}>
                <div className="flex flex-1 flex-col gap-2 border-r border-foreground/[0.06] pr-3 dark:border-[rgba(224,224,224,0.03)]">
                  <span className="text-sm font-medium text-page-text">{payoutClipIndex === 0 ? "$0.09" : "$425.00"}</span>
                  <span className="text-xs text-page-text-muted">Total earned</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 border-r border-foreground/[0.06] px-3 dark:border-[rgba(224,224,224,0.03)]">
                  <span className={cn("text-sm font-medium", payoutClipIndex === 0 ? "text-page-text" : "text-[#00994D]")}>{payoutClipIndex === 0 ? "$0.00" : "$425.00"}</span>
                  <span className="text-xs text-page-text-muted">Received</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 pl-3">
                  <span className={cn("text-sm font-medium", payoutClipIndex === 0 ? (isDark ? "text-[#FB923C]" : "text-[#E57100]") : "text-page-text")}>{payoutClipIndex === 0 ? "$1.00" : "$0.00"}</span>
                  <span className="text-xs text-page-text-muted">Pending</span>
                </div>
              </div>

              {/* Timeline divider */}
              <div className="flex w-full items-center gap-3 py-2">
                <div className="flex-1 border-t border-dashed border-foreground/[0.12]" />
                <span className="text-xs font-medium text-page-text-subtle">Timeline</span>
                <div className="flex-1 border-t border-dashed border-foreground/[0.12]" />
              </div>

              {payoutClipIndex === 0 ? (
                <div className="flex w-full flex-col items-center gap-0">
                  {/* Pending payout card */}
                  <div className={cn(cardCls, "flex h-[61px] w-full items-center gap-3 overflow-hidden pr-3")}>
                    <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
                      <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                        <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill={isDark ? "rgba(251,146,60,0.08)" : "rgba(229,113,0,0.08)"} />
                      </svg>
                      <div className="relative flex h-full w-full items-center justify-center">
                        <PendingClockIcon color={isDark ? "#FB923C" : "#E57100"} />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1">
                      <span className="text-sm font-medium text-page-text">$1.00</span>
                    </div>
                    <span className={cn("flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium", isDark ? "bg-[rgba(251,146,60,0.08)] text-[#FB923C]" : "bg-[rgba(229,113,0,0.08)] text-[#E57100]")}>
                      <PendingClockIcon color={isDark ? "#FB923C" : "#E57100"} />
                      Under review
                    </span>
                  </div>

                  {/* Vertical connector */}
                  <div className="h-2 w-px border-l border-foreground/[0.12]" />

                  {/* Next payment notice */}
                  <div className="flex w-full items-center justify-center gap-1.5 py-0.5">
                    <PendingClockIcon color="rgba(37,37,37,0.5)" />
                    <span className="text-xs font-medium text-page-text-subtle">2 days until next payment</span>
                  </div>

                  {/* Vertical connector */}
                  <div className="h-2 w-px border-l border-foreground/[0.12]" />

                  {/* Completed payout card */}
                  <div className={cn(cardCls, "flex h-[61px] w-full items-center gap-3 overflow-hidden pr-3")}>
                    <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
                      <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                        <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill="rgba(0,153,77,0.08)" />
                      </svg>
                      <div className="relative flex h-full w-full items-center justify-center">
                        <CheckCircleIcon color="#00994D" />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1">
                      <span className="text-sm font-medium text-page-text">$425.00 paid out Feb 27, 2026</span>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[rgba(0,153,77,0.08)] px-2 py-1 text-xs font-medium text-[#00994D]">
                      <CheckCircleIcon color="#00994D" />
                      Approved
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center gap-0">
                  {/* Completed payout 1 */}
                  <div className={cn(cardCls, "flex h-[61px] w-full items-center gap-3 overflow-hidden pr-3")}>
                    <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
                      <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                        <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill="rgba(0,153,77,0.08)" />
                      </svg>
                      <div className="relative flex h-full w-full items-center justify-center">
                        <CheckCircleIcon color="#00994D" />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1">
                      <span className="text-sm font-medium text-page-text">$425.00 paid out Feb 27, 2026</span>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[rgba(0,153,77,0.08)] px-2 py-1 text-xs font-medium text-[#00994D]">
                      <CheckCircleIcon color="#00994D" />
                      Approved
                    </span>
                  </div>

                  {/* Vertical connector */}
                  <div className="h-4 w-px border-l border-foreground/[0.12]" />

                  {/* Completed payout 2 */}
                  <div className={cn(cardCls, "flex h-[61px] w-full items-center gap-3 overflow-hidden pr-3")}>
                    <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
                      <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                        <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill="rgba(0,153,77,0.08)" />
                      </svg>
                      <div className="relative flex h-full w-full items-center justify-center">
                        <CheckCircleIcon color="#00994D" />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1">
                      <span className="text-sm font-medium text-page-text">$425.00 paid out Jan 27, 2026</span>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[rgba(0,153,77,0.08)] px-2 py-1 text-xs font-medium text-[#00994D]">
                      <CheckCircleIcon color="#00994D" />
                      Approved
                    </span>
                  </div>
                </div>
              )}
            </div>
        </ModalBody>
      </Modal>

      {/* Submit Clip Modal */}
      <Modal open={submitOpen} onClose={() => { setSubmitOpen(false); setSubmitStep("select"); }} size="md">
        <div className="flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
          <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Submit clip</span>
        </div>
        <div className={cn("overflow-y-auto scrollbar-hide", submitStep === "pick" ? "h-[70vh]" : "max-h-[70vh]")}>
            {submitStep === "select" ? (
              <div className="flex flex-col gap-3 p-5 tracking-[-0.02em]">
                <div className="flex items-center justify-center gap-1.5 pb-1">
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none" className="shrink-0 text-foreground/50"><path fillRule="evenodd" clipRule="evenodd" d="M6.55 0.07c.97-.31 1.95.22 1.95 1.43v.7C9.36 2.42 10 3.2 10 4.13c0 .93-.64 1.72-1.5 1.94v.7c0 1.01-.99 1.74-1.96 1.43l-.72-.23C5.5 8.65 4.81 9.13 4 9.13c-1.1 0-2-1-2-2v-.39l-.96-.3C.42 6.24 0 5.66 0 5.01V3.26C0 2.6.42 2.03 1.04 1.83l1.24-.4.07-.03L6.55.07zM3 7.07v.07c0 .55.45 1 1 1 .36 0 .68-.19.85-.48L3 7.07zM9 4.13c0 .37-.2.69-.5.87V3.27c.3.17.5.5.5.87zM2 2.57v3.12l-.65-.21C1.14 5.42 1 5.23 1 5.01V3.26c0-.22.14-.41.35-.48L2 2.57z" fill="currentColor"/></svg>
                  <span className="text-xs font-medium tracking-[-0.02em] text-page-text-subtle">Select a campaign you want to submit to</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {submitCampaigns.map((c, i) => (
                    <button key={i} onClick={() => setSubmitStep("pick")} className={cn(cardCls, "group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-foreground/[0.02]")}>
                      <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{c.name}</span>
                        <span className="text-xs tracking-[-0.02em] text-page-text-subtle">{c.detail}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50 transition-transform duration-200 ease-out group-hover:translate-x-0.5"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.625 3.125C4.41789 3.125 4.25 3.29289 4.25 3.5C4.25 3.70711 4.07711 3.875 3.875 3.875C3.66789 3.875 3.5 3.70711 3.5 3.5C3.5 2.87868 4.00368 2.375 4.625 2.375H5.15C5.82132 2.375 6.375 2.92868 6.375 3.6C6.375 4.05195 6.12524 4.46458 5.73047 4.67695L5.375 4.86829V5.125C5.375 5.33211 5.20711 5.5 5 5.5C4.79289 5.5 4.625 5.33211 4.625 5.125V4.625C4.625 4.48886 4.69886 4.36263 4.81797 4.29805L5.37523 4.00017C5.54755 3.90714 5.625 3.76005 5.625 3.6C5.625 3.34315 5.40685 3.125 5.15 3.125H4.625ZM5 6.875C5.20711 6.875 5.375 6.70711 5.375 6.5C5.375 6.29289 5.20711 6.125 5 6.125C4.79289 6.125 4.625 6.29289 4.625 6.5C4.625 6.70711 4.79289 6.875 5 6.875Z" fill="currentColor" fillOpacity="0.4"/></svg>
                  <span className="text-xs font-medium tracking-[-0.02em] text-page-text-subtle">Don&apos;t see your campaign? <a href="/creator/discover" className="text-page-text hover:underline">Browse campaigns</a></span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-6 p-5 tracking-[-0.02em]">
                  {/* Campaign hint */}
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" className="shrink-0 text-foreground/50"><path fillRule="evenodd" clipRule="evenodd" d="M6.55 0.07c.97-.31 1.95.22 1.95 1.43v.7C9.36 2.42 10 3.2 10 4.13c0 .93-.64 1.72-1.5 1.94v.7c0 1.01-.99 1.74-1.96 1.43l-.72-.23C5.5 8.65 4.81 9.13 4 9.13c-1.1 0-2-1-2-2v-.39l-.96-.3C.42 6.24 0 5.66 0 5.01V3.26C0 2.6.42 2.03 1.04 1.83l1.24-.4.07-.03L6.55.07zM3 7.07v.07c0 .55.45 1 1 1 .36 0 .68-.19.85-.48L3 7.07zM9 4.13c0 .37-.2.69-.5.87V3.27c.3.17.5.5.5.87zM2 2.57v3.12l-.65-.21C1.14 5.42 1 5.23 1 5.01V3.26c0-.22.14-.41.35-.48L2 2.57z" fill="currentColor"/></svg>
                    <span className="text-xs font-medium text-page-text-subtle">Submit a clip to <span className="text-[#1A67E5]">Cantina - All formats</span> &middot; <button onClick={() => setSubmitStep("select")} className="underline">Change</button></span>
                  </div>

                  {/* Tab switcher */}
                  <div className="flex rounded-xl bg-foreground/[0.06] p-0.5 dark:bg-white/[0.06]">
                    <button onClick={() => setSubmitTab("feed")} className={cn("flex-1 rounded-[10px] px-4 py-2 text-sm font-medium transition-colors", submitTab === "feed" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]" : "text-page-text-muted")}>From feed</button>
                    <button onClick={() => setSubmitTab("link")} className={cn("flex-1 rounded-[10px] px-4 py-2 text-sm font-medium transition-colors", submitTab === "link" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]" : "text-page-text-muted")}>Link</button>
                  </div>

                  {submitTab === "feed" ? (
                    /* From feed - video picker */
                    <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                      <div className="flex items-center gap-2">
                        <AccountDropdown />
                        <div className="flex flex-1 items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-3 py-2.5 dark:bg-white/[0.04]">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          <input type="text" placeholder="Search by caption..." className="flex-1 bg-transparent text-sm text-page-text outline-none placeholder:text-page-text-muted" />
                        </div>
                      </div>
                      {/* Video grid */}
                      <div ref={feedCarouselRef} className="-mr-4 flex gap-2 overflow-x-auto scroll-smooth scrollbar-hide">
                        {[1, 2, 3].map((v) => (
                          <div key={v} onClick={() => setSelectedVideo(selectedVideo === v ? null : v)} className={cn(cardCls, "flex w-[171px] shrink-0 cursor-pointer flex-col gap-3 pb-3 transition-all", selectedVideo === v && "ring-2 ring-page-text ring-offset-2 ring-offset-[var(--card-bg)]")}>
                            <div className="relative h-[280px] w-full overflow-hidden rounded-t-2xl [&>div]:p-0 [&>div>div]:rounded-none">
                              <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                  backgroundImage: `url(/creator-home/campaign-thumb-${v}.png)`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  filter: "blur(50px)",
                                }}
                              />
                              <VideoPlayer
                                src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4"
                                platform="tiktok"
                                duration="01:15"
                                hideSpeed
                              />
                            </div>
                            <div className="flex flex-col gap-1.5 px-2">
                              <span className="text-xs font-medium text-page-text">Cantina review clip</span>
                              <span className="text-xs text-page-text-subtle">2h ago &middot; 12.4K views</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Pagination arrows */}
                      <div className="flex items-center gap-2">
                        <button onClick={() => feedCarouselRef.current?.scrollBy({ left: -180, behavior: "smooth" })} className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/50 transition-opacity hover:bg-foreground/[0.10] dark:bg-white/[0.06]"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                        <button onClick={() => feedCarouselRef.current?.scrollBy({ left: 180, behavior: "smooth" })} className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/50 transition-opacity hover:bg-foreground/[0.10] dark:bg-white/[0.06]"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                      </div>
                    </div>
                  ) : (
                    /* Link tab */
                    <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-page-text-subtle">Video URLs (one per line)</span>
                        <div className="relative rounded-[14px] bg-foreground/[0.04] dark:bg-white/[0.04]">
                          <textarea className="w-full resize-none bg-transparent px-3.5 py-3 text-sm text-page-text-muted outline-none" rows={5} placeholder="https://www.tiktok.com/@username/video..." />
                          <span className="absolute bottom-3.5 right-3.5 text-xs text-page-text-subtle">0/300</span>
                        </div>
                      </div>
                      {/* Status counters */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: <svg width="16" height="16" viewBox="0 0 14 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M3.21 3.64c1.3-1.3 3.41-1.3 4.71 0l.23.23c.54.54.86 1.23.95 1.94a.56.56 0 0 1-1.1.14 1.96 1.96 0 0 0-.57-1.16l-.23-.23a1.99 1.99 0 0 0-2.83 0L2.07 6.81a1.99 1.99 0 0 0 2.83 2.83l.11-.12a.66.66 0 0 1 .94.94l-.11.11a3.33 3.33 0 0 1-4.72-4.71L3.21 3.64Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M7.87.98a3.33 3.33 0 0 1 4.95 4.94l-2.23 2.23a3.33 3.33 0 0 1-4.71 0l-.23-.23a1.96 1.96 0 0 1-.95-1.94.56.56 0 0 1 1.1-.14c.05.43.24.84.57 1.16l.23.23a1.99 1.99 0 0 0 2.83 0l2.23-2.23a1.99 1.99 0 0 0-2.83-2.83L8.7 2.03a.66.66 0 1 1-.94-.94l.11-.11Z" fill="currentColor"/></svg>, count: "0" },
                          { icon: <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6.67 0C2.98 0 0 2.98 0 6.67c0 3.68 2.98 6.67 6.67 6.67 3.68 0 6.67-2.98 6.67-6.67C13.33 2.98 10.35 0 6.67 0Zm2.51 5.42a.67.67 0 0 0-.09-.94.67.67 0 0 0-.94.09L5.62 7.67 4.8 6.86a.67.67 0 0 0-.94.94l1.33 1.33c.13.13.32.2.5.2a.67.67 0 0 0 .49-.25l3-3.66Z" fill="currentColor"/></svg>, count: "0" },
                          { icon: <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0 6.67C0 2.98 2.98 0 6.67 0c3.68 0 6.67 2.98 6.67 6.67 0 3.68-2.98 6.67-6.67 6.67C2.98 13.33 0 10.35 0 6.67Zm5.14-2.47a.67.67 0 0 0-.94.94L5.72 6.67 4.2 8.2a.67.67 0 1 0 .94.94l1.53-1.53 1.53 1.53a.67.67 0 1 0 .94-.94L7.61 6.67l1.53-1.53a.67.67 0 1 0-.94-.94L6.67 5.72 5.14 4.2Z" fill="currentColor"/></svg>, count: "0" },
                          { icon: <PlatformIcon platform="tiktok" size={16} />, count: "0" },
                          { icon: <PlatformIcon platform="youtube" size={16} />, count: "0" },
                          { icon: <PlatformIcon platform="instagram" size={16} />, count: "0" },
                          { icon: <PlatformIcon platform="x" size={16} />, count: "0" },
                        ].map((s, i) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] py-1 pl-1.5 pr-2 text-xs font-medium text-foreground/50 dark:border-[rgba(224,224,224,0.03)]">
                            {s.icon}
                            <span className="text-page-text">{s.count}</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 pt-2">
                        <svg width="12" height="12" viewBox="0 0 10 10" fill="none" className="shrink-0"><path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.625 3.125C4.41789 3.125 4.25 3.29289 4.25 3.5C4.25 3.70711 4.07711 3.875 3.875 3.875C3.66789 3.875 3.5 3.70711 3.5 3.5C3.5 2.87868 4.00368 2.375 4.625 2.375H5.15C5.82132 2.375 6.375 2.92868 6.375 3.6C6.375 4.05195 6.12524 4.46458 5.73047 4.67695L5.375 4.86829V5.125C5.375 5.33211 5.20711 5.5 5 5.5C4.79289 5.5 4.625 5.33211 4.625 5.125V4.625C4.625 4.48886 4.69886 4.36263 4.81797 4.29805L5.37523 4.00017C5.54755 3.90714 5.625 3.76005 5.625 3.6C5.625 3.34315 5.40685 3.125 5.15 3.125H4.625ZM5 6.875C5.20711 6.875 5.375 6.70711 5.375 6.5C5.375 6.29289 5.20711 6.125 5 6.125C4.79289 6.125 4.625 6.29289 4.625 6.5C4.625 6.70711 4.79289 6.875 5 6.875Z" fill="currentColor" fillOpacity="0.4" /></svg>
                        <span className="text-xs font-medium text-page-text-subtle">Paste up to 50 URLs</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
        </div>
        {/* Footer — outside scroll area */}
        {submitStep === "pick" && (
          <div className="flex items-center justify-end gap-2 border-t border-foreground/[0.06] px-5 py-4 dark:border-[rgba(224,224,224,0.03)]">
            <button onClick={() => { setSubmitOpen(false); setSubmitStep("select"); }} className="rounded-full bg-foreground/[0.06] px-4 py-2.5 text-sm font-medium text-page-text dark:bg-white/[0.06]">Cancel</button>
            <button className="rounded-full bg-foreground px-4 py-2.5 text-sm font-medium tracking-[-0.02em] text-white opacity-40 dark:bg-[#E0E0E0] dark:text-[#252525]">Submit for review</button>
          </div>
        )}
      </Modal>

      {/* Fullscreen video modal removed — video plays inline */}

      {/* Trust Score Modal */}
      <TrustScoreModal open={trustScoreOpen} onClose={() => setTrustScoreOpen(false)} />

      {/* Mobile fixed bottom submit bar */}
      <div className="fixed inset-x-0 bottom-[calc(52px+max(8px,env(safe-area-inset-bottom)))] z-40 flex items-center justify-end border-t border-foreground/[0.06] bg-white px-4 py-4 sm:px-5 md:hidden dark:bg-page-bg">
        <button onClick={() => setSubmitOpen(true)} className="flex h-9 items-center rounded-full px-4 text-sm font-medium text-white" style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}>
          Submit clip
        </button>
      </div>
    </div>
  );
}
