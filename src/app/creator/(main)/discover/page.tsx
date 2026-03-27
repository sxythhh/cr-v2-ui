"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ── Segmented toggle ──────────────────────────────────────────────

function SegmentedToggle({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5 dark:bg-foreground/[0.03]">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "flex h-8 flex-1 cursor-pointer items-center justify-center rounded-[10px] font-inter text-sm font-medium tracking-[-0.02em] transition-all",
            value === opt
              ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg"
              : "text-foreground/70 hover:text-foreground",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── For You data ──────────────────────────────────────────────────

const FOR_YOU_CAMPAIGNS = [
  {
    id: "1",
    brand: "Clipping Culture",
    brandVerified: true,
    postedAgo: "5d",
    title: "Call of Duty BO7 Official Clipping Campaign",
    description: "We're launching a campaign to promote the new Call of Duty Warzone mode: Black Ops Royale. It is inspired from Call of Duty's first Battle Royale, Blackout.",
    thumbnail: "from-slate-700 to-slate-900",
    matchPct: 92,
    platforms: ["TikTok", "Instagram"],
    category: "Gaming",
    applicationRequired: true,
    followers: "121.4K",
    cpm: "$1.50/1k",
    cpmColor: "#1A67E5",
    budgetUsed: "$8,677",
    budgetTotal: "$37,500",
    budgetPct: 61,
  },
  {
    id: "2",
    brand: "Sound Network",
    brandVerified: true,
    postedAgo: "2d",
    title: "Harry Styles Podcast x Shania Twain Clipping [7434]",
    description: "Create engaging clips from the latest Harry Styles podcast episode featuring Shania Twain. Focus on viral-worthy moments.",
    thumbnail: "from-purple-700 to-pink-900",
    matchPct: 87,
    platforms: ["TikTok", "YouTube"],
    category: "Music",
    applicationRequired: false,
    followers: "121.4K",
    cpm: "$3.50/1k",
    cpmColor: "#1A67E5",
    budgetUsed: "$12,400",
    budgetTotal: "$25,000",
    budgetPct: 50,
  },
  {
    id: "3",
    brand: "Scene Society",
    brandVerified: true,
    postedAgo: "1d",
    title: "Mumford & Sons | Prizefighter Clipping",
    description: "Clip the best moments from the Mumford & Sons Prizefighter music video and live performances. High engagement content preferred.",
    thumbnail: "from-amber-700 to-orange-900",
    matchPct: 79,
    platforms: ["TikTok"],
    category: "Music",
    applicationRequired: true,
    followers: "121.4K",
    cpm: "$2.00/1k",
    cpmColor: "#1A67E5",
    budgetUsed: "$1,240",
    budgetTotal: "$8,000",
    budgetPct: 16,
  },
];

// ── For You card view ─────────────────────────────────────────────

function ForYouView() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exiting, setExiting] = useState<"join" | "skip" | null>(null);

  const campaign = currentIndex < FOR_YOU_CAMPAIGNS.length ? FOR_YOU_CAMPAIGNS[currentIndex] : null;

  const handleAction = useCallback((action: "join" | "skip") => {
    setExiting(action);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setExiting(null);
    }, 250);
  }, []);

  if (!campaign) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
        <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-[0_0_0_2px_#fff] dark:bg-card-bg dark:shadow-none">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-page-text">
            <path d="M12 2L13.79 8.21L20 10L13.79 11.79L12 18L10.21 11.79L4 10L10.21 8.21L12 2Z" fill="currentColor" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-inter text-lg font-medium tracking-[-0.02em] text-page-text">You&apos;re all caught up</h2>
          <p className="max-w-[360px] text-center font-inter text-sm leading-[150%] tracking-[-0.02em] text-foreground/70">
            No more recommendations right now. Check back later or browse all campaigns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 pt-3">
      {/* AI match text */}
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground/70">
          <path d="M8 0L9.79 6.21L16 8L9.79 9.79L8 16L6.21 9.79L0 8L6.21 6.21L8 0Z" fill="currentColor" />
        </svg>
        <span className="font-inter text-sm tracking-[-0.02em] text-foreground/70">
          Your {campaign.category} content and {campaign.followers} followers make you a strong match
        </span>
      </div>

      {/* Campaign card */}
      <div className="flex w-full max-w-[600px] flex-col gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={campaign.id}
            initial={false}
            animate={
              exiting === "join"
                ? { x: 300, opacity: 0, scale: 0.95 }
                : exiting === "skip"
                  ? { x: -300, opacity: 0, scale: 0.95 }
                  : { x: 0, opacity: 1, scale: 1 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none"
          >
            {/* Thumbnail */}
            <div className="relative p-1">
              <div className={cn("h-[280px] w-full rounded-2xl bg-gradient-to-br", campaign.thumbnail)}>
                {/* Overlay pills */}
                <div className="flex items-start justify-between p-3">
                  {/* Match badge */}
                  <div className="flex items-center rounded-full bg-[#00B259] px-2.5 py-2 backdrop-blur-xl">
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-white">{campaign.matchPct}% match</span>
                  </div>
                  {/* Platform pills */}
                  <div className="flex items-center gap-1">
                    {campaign.platforms.map((p) => (
                      <div key={p} className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl">
                        <span className="font-inter text-[10px] font-medium text-white">{p[0]}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-2 backdrop-blur-xl">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.27 2.5L12.5 7.5H3.5L5.73 2.5M10.27 2.5H5.73M10.27 2.5L8 5.5L5.73 2.5M3.5 7.5L1.5 13.5H14.5L12.5 7.5H3.5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-white">{campaign.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 px-5 pb-5 pt-3">
              {/* Brand row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-gradient-to-br from-foreground/[0.1] to-foreground/[0.2] shadow-[0_0_0_1.2px_rgba(255,255,255,0.4)]" />
                  <div className="flex items-center gap-1.5">
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.brand}</span>
                    {campaign.brandVerified && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="url(#vg)" /><path d="M4.5 7.2L6 8.7L9.5 5.3" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><defs><linearGradient id="vg" x1="7" y1="0" x2="7" y2="14"><stop stopColor="#FDDC87" /><stop offset="1" stopColor="#FCB02B" /></linearGradient></defs></svg>
                    )}
                    <span className="font-inter text-sm tracking-[-0.02em] text-foreground/20">·</span>
                    <span className="font-inter text-sm tracking-[-0.02em] text-foreground/50">{campaign.postedAgo}</span>
                  </div>
                </div>
                {campaign.applicationRequired && (
                  <span className="font-inter text-sm tracking-[-0.02em] text-foreground/50">Application required</span>
                )}
              </div>

              {/* Title + desc */}
              <div className="flex flex-col gap-2">
                <h3 className="font-inter text-base font-medium tracking-[-0.02em] text-page-text">{campaign.title}</h3>
                <p className="line-clamp-2 font-inter text-sm leading-[150%] tracking-[-0.02em] text-foreground/70">{campaign.description}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats bar */}
        <div className="overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
            <div className="flex flex-1 items-center gap-1">
              {/* Followers pill */}
              <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1">
                <svg width="12" height="12" viewBox="0 0 15 12" fill="currentColor" className="text-page-text"><path d="M1.80664 2.66667C1.80664 1.19391 3.00055 0 4.47331 0C5.94607 0 7.13997 1.19391 7.13997 2.66667C7.13997 4.13943 5.94607 5.33333 4.47331 5.33333C3.00055 5.33333 1.80664 4.13943 1.80664 2.66667Z" /><path d="M7.80664 2.66667C7.80664 1.19391 9.00055 0 10.4733 0C11.9461 0 13.14 1.19391 13.14 2.66667C13.14 4.13943 11.9461 5.33333 10.4733 5.33333C9.00055 5.33333 7.80664 4.13943 7.80664 2.66667Z" /><path d="M4.47313 6C6.38699 6 8.20239 7.32044 8.87806 9.74236C9.23135 11.0087 8.15128 12 7.0425 12H1.90376C0.794992 12 -0.285082 11.0087 0.0682094 9.74235C0.74388 7.32043 2.55928 6 4.47313 6Z" /><path d="M10.1629 9.38406C9.83767 8.21837 9.27857 7.23238 8.5599 6.46807C9.15691 6.15907 9.80933 6 10.4736 6C12.3875 6 14.2029 7.32044 14.8785 9.74236C15.2318 11.0087 14.1518 12 13.043 12H9.69378C10.2058 11.3033 10.4396 10.3761 10.1629 9.38406Z" /></svg>
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{campaign.followers}</span>
              </div>
              {/* CPM pill */}
              <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5C1.5 2.5 2.5 1.5 4 1.5H8C9.5 1.5 10.5 2.5 10.5 3.5V8.5C10.5 9.5 9.5 10.5 8 10.5H4C2.5 10.5 1.5 9.5 1.5 8.5V3.5Z" stroke={campaign.cpmColor} strokeWidth="1" /><circle cx="6" cy="6" r="1.5" fill={campaign.cpmColor} /></svg>
                <span className="font-inter text-xs font-medium tracking-[-0.02em]" style={{ color: campaign.cpmColor }}>{campaign.cpm}</span>
              </div>
            </div>
            {/* Budget */}
            <div className="flex items-center gap-0.5">
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.budgetUsed}</span>
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-foreground/70">/</span>
              <span className="font-inter text-sm tracking-[-0.02em] text-foreground/70">{campaign.budgetTotal}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 w-full bg-foreground/[0.06]">
            <div className="h-full rounded-full bg-foreground" style={{ width: `${campaign.budgetPct}%` }} />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 pb-3">
        {/* View */}
        <button type="button" className="flex cursor-pointer flex-col items-center gap-2">
          <div className="flex size-14 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground/70"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-foreground/70">View</span>
        </button>
        {/* Join */}
        <button type="button" onClick={() => handleAction("join")} className="flex cursor-pointer flex-col items-center gap-2">
          <div className="flex size-14 items-center justify-center rounded-full bg-foreground text-white transition-opacity hover:opacity-90 dark:text-[#111]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-foreground/70">Join</span>
        </button>
        {/* Skip */}
        <button type="button" onClick={() => handleAction("skip")} className="flex cursor-pointer flex-col items-center gap-2">
          <div className="flex size-14 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground/70"><path d="M5 5L12 12L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 5L20 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-foreground/70">Skip</span>
        </button>
      </div>
    </div>
  );
}

// ── All campaigns view ────────────────────────────────────────────

const MOCK_CAMPAIGNS = [
  { brand: "Sound Network", title: "Harry Styles Podcast x Shania Twain Clipping", model: "Retainer", modelColor: "#E57100", budget: "$5,000", spots: "12/50" },
  { brand: "Clipping Culture", title: "Call of Duty BO7 Official Clipping Campaign", model: "CPM", modelColor: "#1A67E5", budget: "$10,000", spots: "34/100" },
  { brand: "Scene Society", title: "Mumford & Sons | Prizefighter Clipping", model: "CPM", modelColor: "#1A67E5", budget: "$3,200", spots: "8/20" },
  { brand: "Verse Media", title: "Taylor Swift | TTPD Recap Clips", model: "Per video", modelColor: "#AE4EEE", budget: "$7,500", spots: "45/75" },
  { brand: "Clipstream", title: "Fortnite OG Season Highlights", model: "CPM", modelColor: "#1A67E5", budget: "$2,000", spots: "19/30" },
];

function AllCampaignsView() {
  return (
    <div className="flex flex-col gap-2">
      {MOCK_CAMPAIGNS.map((c, i) => (
        <div
          key={i}
          className="flex cursor-pointer items-center gap-4 rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none dark:hover:bg-foreground/[0.02]"
        >
          {/* Thumbnail placeholder */}
          <div className="hidden size-16 shrink-0 rounded-xl bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.12] sm:block" />

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{c.brand}</span>
            <span className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{c.title}</span>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center rounded-full border border-foreground/[0.06] px-2 py-0.5 font-inter text-xs font-medium tracking-[-0.02em]"
                style={{ color: c.modelColor }}
              >
                {c.model}
              </span>
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                Budget {c.budget}
              </span>
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                Spots {c.spots}
              </span>
            </div>
          </div>

          {/* Apply button */}
          <button
            type="button"
            className="shrink-0 rounded-full bg-foreground/[0.06] px-3 py-2 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default function CreatorDiscoverPage() {
  const [tab, setTab] = useState("For you");

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-page-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-center border-b border-foreground/[0.06] bg-page-bg px-4 sm:px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Discover</span>
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-5">
        <div className="mx-auto flex w-full max-w-[756px] flex-1 flex-col gap-4">
          {/* Toggle */}
          <SegmentedToggle
            options={["For you", "All campaigns"]}
            value={tab}
            onChange={setTab}
          />

          {/* Tab content */}
          {tab === "For you" ? (
            <ForYouView />
          ) : (
            <AllCampaignsView />
          )}
        </div>
      </div>
    </div>
  );
}
