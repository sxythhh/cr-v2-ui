"use client";

import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { CreatorHeader } from "@/components/creator-header";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { CheckCircleIcon, PendingClockIcon, XCircleIcon, WreathIcon, HelpIcon } from "@/components/creator-icons";
import { StatMiniCard, MetricPill, SUBMISSIONS_CHART_DATA, VideoPlayer } from "@/components/submissions";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg";

const stats = [
  { value: "194", label: "Approved", color: "#00994D", bg: "rgba(0,153,77,0.08)", icon: <CheckCircleIcon color="#00994D" />, hasHelp: false },
  { value: "12", label: "Pending", color: "#E57100", bg: "rgba(229,113,0,0.08)", icon: <PendingClockIcon color="#E57100" />, hasHelp: false },
  { value: "0", label: "Rejected", color: "#FF3355", bg: "rgba(255,51,85,0.08)", icon: <XCircleIcon color="#FF3355" />, hasHelp: false },
  { value: "92", label: "Trust score", color: "#00994D", bg: "rgba(0,153,77,0.08)", icon: <WreathIcon color="#00994D" />, hasHelp: true },
];

const filterTabs = [
  { label: "All", count: 206 },
  { label: "In review", count: 3 },
  { label: "Approved", count: 194 },
  { label: "Rejected", count: 0 },
  { label: "Flagged", count: 0 },
];

const clips = [
  {
    title: "Catina - All Platforms",
    brand: "Sound Network",
    date: "Feb 10, 2026",
    status: "Pending" as const,
    statusColor: "#E57100",
    statusBg: "rgba(229,113,0,0.08)",
    xp: "50 XP",
    earned: "$0.09",
    received: "$0.00",
    pending: "$1.00",
    pendingColor: "#E57100",
    metrics: { views: "1.2M", likes: "48.2K", comments: "3.1K", shares: "1.3K" },
    topCountry: "UK",
    topAge: "18-24",
    hasViewPayout: true,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    platform: "tiktok" as const,
    videoDuration: "01:15",
  },
  {
    title: "Catina - All Platforms",
    brand: "Sound Network",
    date: "Feb 10, 2026",
    status: "Rejected" as const,
    statusColor: "#FF3355",
    statusBg: "rgba(255,51,85,0.08)",
    xp: null,
    earned: "$0.00",
    received: "$0.00",
    pending: "$0.00",
    pendingColor: "#252525",
    metrics: { views: "1.2M", likes: "48.2K", comments: "3.1K", shares: "1.3K" },
    topCountry: "UK",
    topAge: "18-24",
    hasViewPayout: false,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
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
  const [activeFilter, setActiveFilter] = useState(0);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitStep, setSubmitStep] = useState<"select" | "pick">("select");
  const [submitTab, setSubmitTab] = useState<"feed" | "link">("feed");
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
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={cn(cardCls, "flex h-[56px] items-center gap-2 overflow-hidden pr-3 sm:h-[61px] sm:gap-3")}>
              <div className="relative h-[56px] w-[50px] shrink-0 overflow-hidden sm:h-[61px] sm:w-[60px]">
                <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                  <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill={s.bg} />
                </svg>
                <div className="relative flex h-full w-full items-center justify-center">
                  {s.icon}
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                <span className="text-sm font-medium text-page-text">{s.value}</span>
                <span className="flex items-center gap-1 text-xs text-page-text-muted">
                  {s.label}
                  {s.hasHelp && <HelpIcon className="shrink-0" />}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar + actions */}
        <div className="flex items-start justify-between gap-4">
          <Tabs selectedIndex={activeFilter} onSelect={setActiveFilter} className="w-fit">
            {filterTabs.map((t, i) => (
              <TabItem key={t.label} label={t.label} count={t.count} index={i} />
            ))}
          </Tabs>
          <div className="flex items-center gap-2">
            <button className="flex size-9 items-center justify-center rounded-xl bg-foreground/[0.06]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="#252525" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <button onClick={() => setSubmitOpen(true)} className="flex h-9 items-center rounded-full px-4 text-sm font-medium text-white" style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}>
              Submit clip
            </button>
          </div>
        </div>

        {/* Clip cards */}
        <div className="flex flex-col gap-2">
          {clips.map((clip, idx) => (
            <div key={idx} className={cn("overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg")}>
              {/* Header row */}
              <div className="flex items-center border-b border-foreground/[0.06]">
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
                    <span className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium" style={{ color: clip.statusColor, backgroundColor: clip.statusBg }}>
                      {clip.status}
                    </span>
                    {clip.xp && (
                      <span className="flex items-center gap-1 rounded-full border border-foreground/[0.06] px-2 py-1 text-xs font-medium text-page-text">
                        <svg width="12" height="12" viewBox="0 0 11 10" fill="none"><path d="M5.937.431C5.66-.144 4.84-.144 4.564.431L3.384 2.89.663 3.246C.033 3.328-.23 4.108.24 4.55L2.227 6.425 1.729 9.1c-.119.636.554 1.107 1.11.807L5.25 8.607l2.413 1.3c.555.3 1.228-.17 1.11-.807L8.274 6.425l1.988-1.875c.47-.443.207-1.222-.394-1.305L7.118 2.89 5.937.431Z" fill="#E57100"/></svg>
                        {clip.xp}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 border-l border-foreground/[0.06] px-3 py-3">
                  {clip.hasViewPayout && (
                    <button onClick={() => setPayoutOpen(true)} className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium text-page-text">View payout</button>
                  )}
                  <button onClick={() => setTimelineOpen(true)} className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium text-page-text">View timeline</button>
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

                {/* Col 2: Stats, Chart, Info — matches brand page structure */}
                <div className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
                  {/* Stat cards */}
                  <div className="flex gap-2">
                    <StatMiniCard value={clip.earned} label="Total earned" variant="filled" />
                    <StatMiniCard value={clip.received} label="Received" variant="outlined" />
                    <StatMiniCard value={clip.pending} label="Pending" valueColor={clip.pendingColor} variant="outlined" />
                  </div>

                  {/* Performance chart card */}
                  <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-2xl border border-foreground/[0.06] bg-card-bg p-3 dark:border-card-inner-border dark:bg-card-inner-bg">
                    {/* Metric pills */}
                    <div className="flex flex-wrap items-center gap-2 pb-2">
                      <MetricPill label="Views" value={clip.metrics.views} color="#4D81EE" bg="rgba(77,129,238,0.1)" active={metricState.views} onClick={() => toggleMetric("views")} />
                      <MetricPill label="Likes" value={clip.metrics.likes} color="#DA5597" bg="rgba(218,85,151,0.1)" active={metricState.likes} onClick={() => toggleMetric("likes")} />
                      <MetricPill label="Comments" value={clip.metrics.comments} color="#E9A23B" bg="rgba(233,162,59,0.1)" active={metricState.comments} onClick={() => toggleMetric("comments")} />
                      <MetricPill label="Shares" value={clip.metrics.shares} color="var(--page-text-subtle)" bg="rgba(128,128,128,0.1)" active={metricState.shares} onClick={() => toggleMetric("shares")} />
                    </div>

                    {/* Chart */}
                    <AnalyticsPocChartPlaceholder
                      variant="line"
                      chartStylePreset="performance-main"
                      lineChart={SUBMISSIONS_CHART_DATA}
                      activeLineDataset="daily"
                      visibleMetricKeys={visibleMetricKeys}
                      heightClassName="h-[172px]"
                    />
                  </div>

                  {/* Bottom info row */}
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
                <div className="absolute bottom-6 left-[23px] top-2 w-px bg-foreground/[0.12]" />
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
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="rgba(37,37,37,0.5)" strokeWidth="1" fill="none"/></svg>
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
                <button className="flex size-10 items-center justify-center rounded-full bg-foreground/[0.06]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.5 2.5v11M4 7.5l4.5-5 4.5 5" stroke="#252525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45, 8, 8)"/></svg>
                </button>
                <div className="flex flex-1 items-center rounded-[14px] bg-foreground/[0.04] px-3.5 py-3">
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
                      <span className="text-page-text-subtle">Feb 10, 2026</span>
                    </div>
                    <span className="text-sm font-medium text-page-text">Caffeine vs Competitors - Honest Take</span>
                  </div>
                </div>
              </div>

              {/* Earning row */}
              <div className={cn(cardCls, "flex items-center justify-center gap-0 p-3")}>
                <div className="flex flex-1 flex-col gap-2 border-r border-foreground/[0.06] pr-3">
                  <span className="text-sm font-medium text-page-text">$0.09</span>
                  <span className="text-xs text-page-text-muted">Total earned</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 border-r border-foreground/[0.06] px-3">
                  <span className="text-sm font-medium text-page-text">$0.00</span>
                  <span className="text-xs text-page-text-muted">Received</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 pl-3">
                  <span className="text-sm font-medium text-[#E57100]">$1.00</span>
                  <span className="text-xs text-page-text-muted">Pending</span>
                </div>
              </div>

              {/* Status card */}
              <div className={cn(cardCls, "flex items-center gap-3 pr-3")}>
                <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
                  <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                    <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill="rgba(229,113,0,0.08)" />
                  </svg>
                  <div className="relative flex h-full w-full items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#E57100" strokeWidth="2" fill="none"/><path d="M12 7v5l3 3" stroke="#E57100" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-sm font-medium text-page-text">$1.00</span>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-[rgba(229,113,0,0.08)] px-2 py-1 text-xs font-medium text-[#E57100]">Under review</span>
              </div>

              {/* Minimum payout notice */}
              <div className="flex items-center gap-1.5 pt-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" fill="rgba(37,37,37,0.5)"/><path d="M6 4v3M6 8.5h0" stroke="white" strokeWidth="1" strokeLinecap="round"/></svg>
                <span className="text-xs font-medium text-page-text-subtle">Minimum payout threshold $1.00</span>
              </div>
            </div>
        </ModalBody>
      </Modal>

      {/* Submit Clip Modal */}
      <Modal open={submitOpen} onClose={() => { setSubmitOpen(false); setSubmitStep("select"); }} size="md">
        <ModalHeader>Submit clip</ModalHeader>
        <ModalBody>
            {submitStep === "select" ? (
              <div className="flex flex-col gap-6 p-5">
                <div className="flex items-center gap-1.5 pb-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 3l4.5 3.5L1 10V3Z" fill="rgba(37,37,37,0.5)"/><path d="M6.5 3l4.5 3.5L6.5 10V3Z" fill="rgba(37,37,37,0.5)"/></svg>
                  <span className="text-xs font-medium text-page-text-subtle">Select a campaign you want to submit to</span>
                </div>
                <div className="flex flex-col gap-2">
                  {submitCampaigns.map((c, i) => (
                    <button key={i} onClick={() => setSubmitStep("pick")} className={cn(cardCls, "flex items-center gap-3 px-3 py-4 transition-colors hover:bg-foreground/[0.02]")}>
                      <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <span className="text-xs font-medium text-page-text">{c.name}</span>
                        <span className="text-xs text-page-text-subtle">{c.detail}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="rgba(37,37,37,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-.375-6.875a.375.375 0 0 0-.375.375.125.125 0 0 1-.25 0 .625.625 0 0 1 .625-.625h.525a.975.975 0 0 1 .6 1.725l-.355.298v.227a.125.125 0 0 1-.25 0v-.5a.25.25 0 0 1 .068-.182l.558-.472a.725.725 0 0 0-.446-1.096h-.525ZM6 7.875a.375.375 0 1 0 0-.75.375.375 0 0 0 0 .75Z" fill="rgba(37,37,37,0.5)"/></svg>
                  <span className="text-xs font-medium text-page-text-subtle">Don&apos;t see your campaign? Browse campaigns</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-6 p-5">
                  {/* Campaign hint */}
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 3l4.5 3.5L1 10V3Z" fill="rgba(37,37,37,0.5)"/><path d="M6.5 3l4.5 3.5L6.5 10V3Z" fill="rgba(37,37,37,0.5)"/></svg>
                    <span className="text-xs font-medium text-page-text-subtle">Submit a clip to Cantina - All formats &middot; <button onClick={() => setSubmitStep("select")} className="underline">Change</button></span>
                  </div>

                  {/* Tab switcher */}
                  <div className="flex rounded-xl bg-foreground/[0.06] p-0.5">
                    <button onClick={() => setSubmitTab("feed")} className={cn("flex-1 rounded-[10px] px-4 py-2 text-sm font-medium transition-colors", submitTab === "feed" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]" : "text-page-text-muted")}>From feed</button>
                    <button onClick={() => setSubmitTab("link")} className={cn("flex-1 rounded-[10px] px-4 py-2 text-sm font-medium transition-colors", submitTab === "link" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]" : "text-page-text-muted")}>Link</button>
                  </div>

                  {submitTab === "feed" ? (
                    /* From feed - video picker */
                    <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-1 items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-3 py-2.5">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.57 0C8.57 1.66 9.91 3 11.57 3v1.5c-1.1 0-2.12-.36-2.95-1v4.5c0 2.49-2.01 4.5-4.5 4.5s-4.5-2.01-4.5-4.5 2.01-4.5 4.5-4.5c.27 0 .54.03.8.07v1.53c-.25-.07-.52-.1-.8-.1-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V0h1.45Z" fill="black"/></svg>
                          <span className="text-sm text-page-text">@vladclips</span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="rgba(37,37,37,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div className="flex flex-1 items-center gap-1.5 rounded-xl bg-foreground/[0.04] px-3 py-2.5">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="rgba(37,37,37,0.5)" strokeWidth="1.5" fill="none"/><path d="M11 11l3 3" stroke="rgba(37,37,37,0.5)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          <span className="text-sm text-page-text-muted">Search by caption...</span>
                        </div>
                      </div>
                      {/* Video grid */}
                      <div className="flex gap-2 overflow-x-auto">
                        {[1, 2, 3].map((v) => (
                          <div key={v} className={cn(cardCls, "flex w-[140px] shrink-0 flex-col gap-3 p-1 pb-3 sm:w-[179px]")}>
                            <div className="h-[220px] w-full rounded-xl bg-cover bg-center sm:h-[280px]" style={{ backgroundImage: `linear-gradient(180deg, transparent 68%, rgba(0,0,0,0.4) 100%), url(/creator-home/campaign-thumb-${v}.png)` }}>
                              <div className="flex h-full flex-col justify-end p-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-lg">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.57 0C8.57 1.66 9.91 3 11.57 3v1.5c-1.1 0-2.12-.36-2.95-1v4.5c0 2.49-2.01 4.5-4.5 4.5s-4.5-2.01-4.5-4.5 2.01-4.5 4.5-4.5c.27 0 .54.03.8.07v1.53c-.25-.07-.52-.1-.8-.1-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V0h1.45Z" fill="white"/></svg>
                                  </span>
                                </div>
                              </div>
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
                        <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] opacity-30"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="rgba(37,37,37,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                        <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06]"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="rgba(37,37,37,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                      </div>
                    </div>
                  ) : (
                    /* Link tab */
                    <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-page-text-subtle">Video URLs (one per line)</span>
                        <div className="relative rounded-[14px] bg-foreground/[0.04]">
                          <textarea className="w-full resize-none bg-transparent px-3.5 py-3 text-sm text-page-text-muted outline-none" rows={5} placeholder="https://www.tiktok.com/@username/video..." />
                          <span className="absolute bottom-3.5 right-3.5 text-xs text-page-text-subtle">0/300</span>
                        </div>
                      </div>
                      {/* Status counters */}
                      <div className="flex flex-wrap gap-2">
                        {["Links 0", "Valid 0", "Invalid 0", "TikTok 0", "YouTube 0", "Instagram 0", "X 0"].map((s) => (
                          <span key={s} className="flex items-center gap-1 rounded-full border border-foreground/[0.06] px-2 py-1 text-xs font-medium text-page-text">
                            {s.split(" ")[0]} <span className="text-page-text">{s.split(" ")[1]}</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 pt-2">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-.375-6.875a.375.375 0 0 0-.375.375.125.125 0 0 1-.25 0 .625.625 0 0 1 .625-.625h.525a.975.975 0 0 1 .6 1.725l-.355.298v.227a.125.125 0 0 1-.25 0v-.5a.25.25 0 0 1 .068-.182l.558-.472a.725.725 0 0 0-.446-1.096h-.525ZM6 7.875a.375.375 0 1 0 0-.75.375.375 0 0 0 0 .75Z" fill="rgba(37,37,37,0.5)"/></svg>
                        <span className="text-xs font-medium text-page-text-subtle">Paste up to 50 URLs</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Bottom action bar */}
                <div className="flex items-center justify-end gap-2 bg-white px-5 pb-5">
                  <button onClick={() => { setSubmitOpen(false); setSubmitStep("select"); }} className="rounded-full bg-foreground/[0.06] px-4 py-2.5 text-sm font-medium text-page-text">Cancel</button>
                  <button className="rounded-full bg-page-text px-4 py-2.5 text-sm font-medium text-white opacity-40">Submit for review</button>
                </div>
              </>
            )}
        </ModalBody>
      </Modal>

      {/* Fullscreen video modal removed — video plays inline */}
    </div>
  );
}
