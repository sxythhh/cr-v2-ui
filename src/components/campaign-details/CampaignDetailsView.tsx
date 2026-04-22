"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { PlatformIcon } from "@/components/campaign-flow/PlatformButton";
import { BoostCampaignModal } from "./BoostCampaignModal";
import { EndCampaignModal } from "./EndCampaignModal";
import { TopUpModal } from "./TopUpModal";
import { CampaignSettingsModal } from "./CampaignSettingsModal";
import FinanceTab from "./FinanceTab";
import SubmissionsTab from "./SubmissionsTab";
import CreatorsTab from "./CreatorsTab";
import EventsTab from "./EventsTab";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const CAMPAIGN = {
  id: "7434",
  title: "Harry Styles Podcast x Shania Twain Clipping",
  type: "Clipping",
  category: "Personal brand",
  platforms: ["tiktok", "instagram", "youtube"] as string[],
  description:
    "We're looking for talented creators to produce engaging clipping content from our latest podcast episode featuring Harry Styles and Shania Twain. Clips should highlight memorable moments, funny exchanges, and quotable lines that will resonate with audiences on social media. Creators should focus on short-form vertical content optimised for TikTok and Instagram Reels, while also delivering longer highlight compilations for YouTube Shorts. Authenticity and storytelling are key — we want clips that feel organic, not overly produced.",
  tags: [
    { label: "Retainer", color: "orange" as const },
    { label: "Private / Invite only", color: "white" as const, locked: true },
  ],
  budget: {
    monthly: 500,
    spent: 8120,
    total: 10000,
  },
  stats: {
    activeCreators: 6,
    videos: 48,
    duration: "6 months",
    category: "Personal brand",
    platforms: ["tiktok", "instagram", "youtube"] as string[],
    lastEdited: "2 days ago",
    submissionDeadline: "25th of each month",
    minEngagementRate: "1.0%",
    cpm: "$1.50",
    perPost: "$100",
    postsPerMonth: "20/mo",
  },
  creatorRequirements: [
    { text: "Platforms", platforms: ["tiktok", "instagram"] },
    { text: "1+ years experience creating short-form content" },
    { text: "English-speaking" },
    { text: "10,000+ followers on primary platform" },
  ],
  contentRequirements: [
    { text: "Show face in video" },
    { text: "Use product in first 5 seconds" },
    { text: "Use specific sound/music" },
    { text: "Mention brand name", badge: "17 seconds" },
    { text: "Specific video length" },
    { text: "Include clear call-to-action" },
    { text: "Mention brand at least 4 times" },
    { text: "Link to brand" },
  ],
  bonuses: [
    { title: "50K Views Bonus", description: "Receive an extra bonus if you hit 50K views!", amount: "$50", threshold: "50.000 views" },
    { title: "100K Views Bonus", description: "Receive an extra bonus if you hit 100K views!", amount: "$125", threshold: "100.000 views" },
  ],
  sounds: {
    platforms: ["TikTok", "Youtube"] as const,
    items: [
      { title: "Glue · BICEP", url: "https://sound.library.com/track" },
      { title: "Too Tense · oskar med k", url: "https://sound.library.com/track" },
    ],
  },
  referenceMaterials: {
    tabs: ["Images", "Videos", "Assets"] as const,
    items: [
      { name: "moodboard_spring.jpg", size: "12.4 MB", kind: "image" as const },
      { name: "product-shots-v2.zip", size: "12.4 MB", kind: "zip" as const },
    ],
  },
  platformPayouts: [
    { platform: "instagram" as const, label: "Instagram", subtitle: "$1.50 per 1k views", min: "$1.50 min", max: "$350 max" },
  ],
};

const TABS = [
  { key: "details", label: "Details" },
  { key: "finance", label: "Finance" },
  { key: "submissions", label: "Submissions", count: 8 },
  { key: "creators", label: "Creators", count: 12 },
  { key: "events", label: "Events", count: 8 },
];

/* ------------------------------------------------------------------ */
/*  Tiny helpers                                                       */
/* ------------------------------------------------------------------ */

function PlatformCircle({ platform, size = 22 }: { platform: string; size?: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border",
        "border-[rgba(37,37,37,0.06)] dark:border-[rgba(224,224,224,0.03)]",
        "bg-white dark:bg-card-bg"
      )}
      style={{ width: size, height: size }}
    >
      <PlatformIcon platform={platform} size={size - 8} />
    </span>
  );
}

function Dot() {
  return (
    <span className="mx-1.5 inline-block h-[3px] w-[3px] rounded-full bg-[rgba(37,37,37,0.25)] dark:bg-[rgba(255,255,255,0.25)]" />
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]">
      <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[rgba(37,37,37,0.25)] dark:bg-[rgba(255,255,255,0.25)]" />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

function GiftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">
      <path d="M6 4.66667C6 3.19391 7.19391 2 8.66667 2C10.007 2 11.2051 2.60849 12 3.56429C12.7949 2.60849 13.993 2 15.3333 2C16.8061 2 18 3.19391 18 4.66667C18 5.52576 17.75 6.32647 17.3188 7H19C20.1046 7 21 7.89543 21 9C21 10.1046 20.1046 11 19 11H13V7H13.6667C14.9553 7 16 5.95533 16 4.66667C16 4.29848 15.7015 4 15.3333 4C14.0447 4 13 5.04467 13 6.33333V7H11V6.33333C11 5.04467 9.95533 4 8.66667 4C8.29848 4 8 4.29848 8 4.66667C8 5.95533 9.04467 7 10.3333 7H11V11H5C3.89543 11 3 10.1046 3 9C3 7.89543 3.89543 7 5 7H6.68121C6.25 6.32647 6 5.52576 6 4.66667Z" fill="currentColor"/>
      <path d="M13 13H20V18C20 19.6569 18.6569 21 17 21H13V13Z" fill="currentColor"/>
      <path d="M11 13H4V18C4 19.6569 5.34315 21 7 21H11V13Z" fill="currentColor"/>
    </svg>
  );
}

function ZipThumbnail() {
  return (
    <div className="relative size-9 shrink-0">
      {/* Base file with folded corner */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[5.625px] border border-[rgba(37,37,37,0.06)] bg-white dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg"
        style={{ clipPath: "polygon(0 0, 70% 0, 100% 30%, 100% 100%, 0 100%)" }}
      />
      {/* Folded corner triangle */}
      <div
        className="absolute right-0 top-0 h-[30%] w-[30%]"
        style={{
          background: "linear-gradient(185.51deg, #FFFFFF 79.88%, #F2F2F2 95.6%)",
          boxShadow: "inset 0.28px 0.28px 0.28px rgba(37,37,37,0.12)",
          clipPath: "polygon(0 0, 100% 100%, 100% 0)",
        }}
      />
      {/* Teeth rows (two columns) */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex w-2.5">
            <div className={cn("h-[3px] w-[5px] rounded-l-full bg-[#D9D9D9] dark:bg-[rgba(255,255,255,0.25)]", i % 2 === 0 ? "" : "translate-x-[5px]")} />
            <div className={cn("h-[3px] w-[5px] rounded-r-full bg-[#D9D9D9] dark:bg-[rgba(255,255,255,0.25)]", i % 2 === 0 ? "translate-x-0" : "-translate-x-[5px]")} />
          </div>
        ))}
      </div>
      {/* ZIP pill label */}
      <span className="absolute left-1/2 top-1/2 inline-flex h-4 -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-1 font-inter text-[10px] font-medium leading-none tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg dark:text-page-text-muted">
        ZIP
      </span>
    </div>
  );
}

function RequirementsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg dark:shadow-none">
      <h3 className="font-inter text-[14px] font-medium leading-[120%] tracking-[-0.02em] text-page-text">{title}</h3>
      <div className="flex items-stretch gap-1">
        <div className="w-[2px] shrink-0 self-stretch rounded-full bg-[rgba(37,37,37,0.12)] dark:bg-[rgba(255,255,255,0.12)]" />
        <ul className="flex flex-1 flex-col gap-1 py-0.5">{children}</ul>
      </div>
    </div>
  );
}

function RequirementRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5">
      <span className="flex size-4 shrink-0 items-center justify-center">
        <span className="size-1 rounded-full bg-[#252525] dark:bg-white" />
      </span>
      <span className="min-w-0 flex-1 font-inter text-[14px] font-normal leading-[150%] tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]">
        {children}
      </span>
    </li>
  );
}

function SoundRequirementsCard({ platforms, items }: { platforms: string[]; items: { title: string; url: string }[] }) {
  const [active, setActive] = useState(platforms[0] ?? "");
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg dark:shadow-none">
      <div className="flex flex-col gap-1">
        <h3 className="font-inter text-[14px] font-medium leading-[120%] tracking-[-0.02em] text-page-text">Sound requirements</h3>
        <p className="font-inter text-[14px] font-normal leading-[120%] tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">
          Creator MUST use one of these sounds in their video and is therefore NOT allowed to use a sound of their own.
        </p>
      </div>
      <div className="inline-flex shrink-0 items-center gap-0.5 self-start rounded-[10px] bg-[rgba(37,37,37,0.06)] p-0.5 dark:bg-[rgba(224,224,224,0.06)]">
        {platforms.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setActive(p)}
            className={cn(
              "flex h-7 cursor-pointer items-center rounded-lg px-3 font-inter text-[12px] font-medium leading-[120%] tracking-[-0.02em] transition-all",
              active === p
                ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg"
                : "text-[rgba(37,37,37,0.7)] dark:text-page-text-muted",
            )}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-stretch gap-2">
        {items.map((s, i) => (
          <div key={i} className="flex min-w-0 flex-1 basis-[240px] items-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg dark:shadow-none">
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-[rgba(37,37,37,0.06)] bg-gradient-to-br from-[rgba(37,37,37,0.08)] to-[rgba(37,37,37,0.12)] dark:border-[rgba(224,224,224,0.06)] dark:from-[rgba(255,255,255,0.04)] dark:to-[rgba(255,255,255,0.08)]">
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                  <svg width="8" height="10" viewBox="-1 0 16 18" fill="none">
                    <path d="M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z" fill="white" />
                  </svg>
                </span>
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="truncate font-inter text-[14px] font-normal leading-none tracking-[-0.02em] text-page-text">{s.title}</span>
              <span className="truncate font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-page-text-muted">{s.url}</span>
            </div>
            <a href={s.url} target="_blank" rel="noreferrer" className="flex size-4 shrink-0 items-center justify-center text-page-text-muted transition-colors hover:text-page-text">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9.33 2.67H13.33V6.67M13.33 2.67L7.33 8.67M12 9.33v3.34c0 .37-.3.66-.67.66H3.33A.67.67 0 012.67 12.67V4.67c0-.37.3-.67.66-.67h3.34" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferenceMaterialsCard({ tabs, items }: { tabs: string[]; items: { name: string; size: string; kind: "image" | "zip" }[] }) {
  const [active, setActive] = useState(tabs[0] ?? "");
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg dark:shadow-none">
      <h3 className="font-inter text-[14px] font-medium leading-[120%] tracking-[-0.02em] text-page-text">Reference materials</h3>
      <div className="inline-flex shrink-0 items-center gap-0.5 self-start rounded-[10px] bg-[rgba(37,37,37,0.06)] p-0.5 dark:bg-[rgba(224,224,224,0.06)]">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(t)}
            className={cn(
              "flex h-7 cursor-pointer items-center rounded-lg px-3 font-inter text-[12px] font-medium leading-[120%] tracking-[-0.02em] transition-all",
              active === t
                ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg"
                : "text-[rgba(37,37,37,0.7)] dark:text-page-text-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-stretch gap-2">
        {items.map((f, i) => (
          <div key={i} className="flex min-w-0 flex-1 basis-[240px] items-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg dark:shadow-none">
            {f.kind === "zip" ? (
              <ZipThumbnail />
            ) : (
              <div className="size-9 shrink-0 overflow-hidden rounded-lg border border-[rgba(37,37,37,0.06)] bg-[#D9D9D9] dark:border-[rgba(224,224,224,0.06)] dark:bg-[rgba(255,255,255,0.08)]" />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="truncate font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">{f.name}</span>
              <span className="truncate font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-page-text-muted">{f.size}</span>
            </div>
            <button type="button" className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-page-text-muted transition-colors hover:text-page-text" aria-label="Download">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V10M8 10L4.67 6.67M8 10l3.33-3.33M3.33 13.33h9.34" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(255,255,255,0.06)]" />;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function CampaignDetailsView({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [boostOpen, setBoostOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [dotsOpen, setDotsOpen] = useState(false);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotsOpen) return;
    const handler = (e: MouseEvent) => {
      if (dotsRef.current && !dotsRef.current.contains(e.target as Node)) {
        setDotsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dotsOpen]);
  const c = CAMPAIGN;
  const pct = Math.round((c.budget.spent / c.budget.total) * 100);

  return (
    <div className="flex min-w-0 flex-col bg-white dark:bg-[#161616] md:h-full">
      {/* ── Mobile back header ───────────────────────────────── */}
      <div className="flex h-14 items-center border-b border-[rgba(37,37,37,0.06)] px-5 dark:border-[rgba(224,224,224,0.03)] md:hidden">
        <button
          onClick={() => router.push("/campaigns")}
          className="flex cursor-pointer items-center gap-2 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:text-page-text-muted"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M5 12l6 6"/><path d="M5 12l6-6"/></svg>
          <span>Back to campaigns</span>
        </button>
      </div>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center border-b border-[rgba(37,37,37,0.06)] bg-white px-4 dark:border-[rgba(224,224,224,0.03)] dark:bg-[#161616] sm:px-5">
        {/* Back – hidden on mobile, shown inline on desktop */}
        <button
          onClick={() => router.push("/campaigns")}
          className="mr-4 hidden items-center gap-1.5 text-sm tracking-[-0.02em] text-page-text-muted hover:text-[#252525] dark:hover:text-[#e5e5e5] transition-colors md:flex"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M5 12l6 6"/><path d="M5 12l6-6"/></svg>
          <span>Back to campaigns</span>
        </button>

        {/* Tabs – scrollable, with directional fade gradients */}
        <ScrollFadeTabs bgLight="#ffffff" bgDark="#161616">
          <HeaderTabs
            selectedIndex={TABS.findIndex((t) => t.key === activeTab)}
            onSelect={(i) => setActiveTab(TABS[i].key)}
          />
        </ScrollFadeTabs>
      </header>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="md:min-h-0 md:flex-1 md:overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {activeTab === "details" ? (
          <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-5">
            <div className="flex flex-col gap-5">


              {/* ── Two-column layout: content + sidebar ────────── */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-10">
                {/* Left column: all campaign content */}
                <div className="flex flex-1 min-w-0 flex-col gap-4">
                  {/* Tags */}
                  <div className="flex items-end gap-1">
                    {c.tags.map((tag) =>
                      tag.color === "orange" ? (
                        <span
                          key={tag.label}
                          className="z-[1] inline-flex h-8 items-center gap-2 rounded-full border border-[rgba(37,37,37,0.06)] bg-white py-2.5 pl-2.5 pr-3.5 backdrop-blur-xl dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
                        >
                          <svg width="16" height="16" viewBox="0 0 13 14" fill="none"><path d="M3.33333 0C3.70152 0 4 0.298477 4 0.666667V1.33333H8V0.666667C8 0.298477 8.29848 0 8.66667 0C9.03486 0 9.33333 0.298477 9.33333 0.666667V1.33333H10C11.1046 1.33333 12 2.22876 12 3.33333V4.66667C12 5.03486 11.7015 5.33333 11.3333 5.33333H1.33333V10.6667C1.33333 11.0349 1.63181 11.3333 2 11.3333H4.66667C5.03486 11.3333 5.33333 11.6318 5.33333 12C5.33333 12.3682 5.03486 12.6667 4.66667 12.6667H2C0.89543 12.6667 0 11.7712 0 10.6667V3.33333C0 2.22876 0.895431 1.33333 2 1.33333H2.66667V0.666667C2.66667 0.298477 2.96514 0 3.33333 0Z" fill="#E57100"/><path d="M9.33334 8.25C9.11151 8.25 8.89732 8.29107 8.69932 8.36599L9.09763 8.76431C9.30762 8.97429 9.1589 9.33334 8.86193 9.33334H7.33333C6.96514 9.33334 6.66667 9.03486 6.66667 8.66667V7.13808C6.66667 6.84111 7.02571 6.69239 7.2357 6.90238L7.70668 7.37335C8.18233 7.08371 8.74179 6.91667 9.33334 6.91667C10.7421 6.91667 11.9287 7.86095 12.2978 9.14979C12.3991 9.50375 12.1944 9.87287 11.8404 9.97424C11.4865 10.0756 11.1173 9.87084 11.016 9.51688C10.8063 8.78478 10.1314 8.25 9.33334 8.25Z" fill="#E57100"/><path d="M7.6507 10.4831C7.54933 10.1292 7.18021 9.9244 6.82625 10.0258C6.47229 10.1271 6.26752 10.4963 6.36889 10.8502C6.738 12.139 7.92453 13.0833 9.33334 13.0833C9.92502 13.0833 10.4845 12.9162 10.96 12.6267L11.431 13.0976C11.641 13.3076 12 13.1589 12 12.8619V11.3333C12 10.9651 11.7015 10.6667 11.3333 10.6667H9.80475C9.50778 10.6667 9.35905 11.0257 9.56904 11.2357L9.96736 11.634C9.7693 11.709 9.55512 11.75 9.33334 11.75C8.53526 11.75 7.86036 11.2152 7.6507 10.4831Z" fill="#E57100"/></svg>
                          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-[#E57100]">{tag.label}</span>
                        </span>
                      ) : (
                        <span key={tag.label} className="inline-flex h-8 items-center gap-2 rounded-full border border-[rgba(37,37,37,0.06)] bg-white py-2.5 pl-2.5 pr-3.5 backdrop-blur-xl dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
                          <span className="inline-flex items-center gap-2 font-inter text-sm font-medium tracking-[-0.02em] text-[#252525] dark:text-[#E0E0E0]">
                            {tag.locked && (
                              <svg width="16" height="16" viewBox="0 0 8 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M4 0C2.61929 0 1.5 1.11929 1.5 2.5V3.5C0.671573 3.5 0 4.17157 0 5V8.5C0 9.32843 0.671573 10 1.5 10H6.5C7.32843 10 8 9.32843 8 8.5V5C8 4.17157 7.32843 3.5 6.5 3.5V2.5C6.5 1.11929 5.38071 0 4 0ZM5.5 3.5V2.5C5.5 1.67157 4.82843 1 4 1C3.17157 1 2.5 1.67157 2.5 2.5V3.5H5.5ZM4 5.5C4.27614 5.5 4.5 5.72386 4.5 6V7.5C4.5 7.77614 4.27614 8 4 8C3.72386 8 3.5 7.77614 3.5 7.5V6C3.5 5.72386 3.72386 5.5 4 5.5Z" fill="currentColor" /></svg>
                            )}
                            {tag.label}
                          </span>
                        </span>
                      ),
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-xl font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    {c.title} [{c.id}]
                  </h1>

                  {/* Meta row */}
                  <div className="flex items-center gap-1.5 text-[12px] font-medium tracking-[-0.02em] text-page-text">
                    <span className="flex h-6 items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88"/><path d="M14.47 14.48L20 20"/><path d="M8.12 8.12L12 12"/></svg>
                      {c.type}
                    </span>
                    <span className="text-[rgba(37,37,37,0.2)] dark:text-[rgba(255,255,255,0.2)]">·</span>
                    <span className="flex items-center gap-1">
                      {/* TikTok */}
                      <span className="inline-flex size-6 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white backdrop-blur-[12px] dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg">
                        <svg width="12" height="12" viewBox="0 0 9 10" fill="none"><path d="M8.71705 4.10671C7.82723 4.10671 7.00339 3.82398 6.33063 3.34349V6.83632C6.33063 8.58357 4.91349 10 3.16538 10C2.51313 10 1.9069 9.80288 1.40329 9.4649C0.55712 8.89703 0 7.9315 0 6.83629C0 5.08914 1.41718 3.67271 3.16543 3.67275C3.31072 3.67268 3.45582 3.68255 3.59975 3.70221V4.09002L3.59967 5.452C3.46114 5.40806 3.31346 5.38422 3.16023 5.38422C2.36052 5.38422 1.71235 6.03217 1.71235 6.83135C1.71235 7.39641 2.03634 7.88571 2.50881 8.12405C2.70471 8.22282 2.92596 8.27845 3.16025 8.27845C3.95832 8.27845 4.60538 7.63314 4.60813 6.83629V0H6.33061V0.220145C6.33669 0.285959 6.34545 0.351524 6.35685 0.416659C6.4764 1.09819 6.88411 1.68047 7.45002 2.03343C7.83003 2.27052 8.26916 2.39585 8.71706 2.39517L8.71705 4.10671Z" fill="currentColor" /></svg>
                      </span>
                      {/* Instagram */}
                      <span className="inline-flex size-6 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white backdrop-blur-[12px] dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg">
                        <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M4.75 0.855864C6.01825 0.855864 6.16852 0.860614 6.66943 0.8835C6.97056 0.887137 7.26883 0.942495 7.55121 1.04716C7.75756 1.12331 7.94422 1.24475 8.09746 1.40255C8.25525 1.55578 8.37669 1.74244 8.45284 1.9488C8.55751 2.23117 8.61286 2.52944 8.6165 2.83057C8.63939 3.33148 8.64414 3.48175 8.64414 4.75C8.64414 6.01825 8.63939 6.16852 8.6165 6.66943C8.61286 6.97056 8.55751 7.26883 8.45284 7.55121C8.37382 7.7561 8.25276 7.94219 8.09747 8.09747C7.94219 8.25276 7.7561 8.37382 7.55121 8.45284C7.26883 8.55751 6.97056 8.61286 6.66943 8.6165C6.16852 8.63939 6.01825 8.64414 4.75 8.64414C3.48175 8.64414 3.33148 8.63939 2.83057 8.6165C2.52929 8.61291 2.23088 8.55756 1.94836 8.45284C1.74216 8.37663 1.55566 8.2552 1.40255 8.09746C1.24475 7.94422 1.12331 7.75756 1.04716 7.55121C0.942495 7.26883 0.887137 6.97056 0.8835 6.66943C0.860614 6.16852 0.855864 6.01825 0.855864 4.75C0.855864 3.48175 0.860614 3.33148 0.8835 2.83057C0.887137 2.52944 0.942495 2.23117 1.04716 1.9488C1.12331 1.74244 1.24475 1.55578 1.40255 1.40255C1.55578 1.24475 1.74244 1.12331 1.9488 1.04716C2.23117 0.942495 2.52944 0.887137 2.83057 0.8835C3.33148 0.860614 3.48175 0.855864 4.75 0.855864ZM4.75 0C3.46016 0 3.29823 0.00561363 2.7917 0.0285C2.39768 0.0363607 2.00783 0.110971 1.63875 0.249159C1.32165 0.368548 1.03443 0.555706 0.797136 0.797568C0.555482 1.03478 0.368477 1.32185 0.249159 1.63875C0.111118 2.00786 0.0366543 2.3977 0.0289318 2.7917C0.00518183 3.29823 0 3.46016 0 4.75C0 6.03984 0.00561363 6.20177 0.0285 6.7083C0.0363607 7.10232 0.110971 7.49217 0.249159 7.86125C0.368548 8.17835 0.555706 8.46557 0.797568 8.70286C1.03478 8.94452 1.32185 9.13152 1.63875 9.25084C2.00786 9.38888 2.3977 9.46335 2.7917 9.47107C3.29823 9.49482 3.46016 9.5 4.75 9.5C6.03984 9.5 6.20177 9.49439 6.7083 9.4715C7.10232 9.46364 7.49217 9.38903 7.86125 9.25084C8.1769 9.1288 8.46356 8.94215 8.70285 8.70285C8.94215 8.46356 9.1288 8.1769 9.25084 7.86125C9.38888 7.49214 9.46335 7.1023 9.47107 6.7083C9.49482 6.20177 9.5 6.03984 9.5 4.75C9.5 3.46016 9.49439 3.29823 9.4715 2.7917C9.46364 2.39768 9.38903 2.00783 9.25084 1.63875C9.13145 1.32165 8.9443 1.03443 8.70243 0.797136C8.46522 0.555482 8.17816 0.368477 7.86125 0.249159C7.49214 0.111118 7.1023 0.0366543 6.7083 0.0289318C6.20177 0.00518183 6.03984 0 4.75 0ZM4.75 2.31066C4.26754 2.31066 3.79592 2.45372 3.39478 2.72176C2.99363 2.9898 2.68097 3.37077 2.49634 3.81651C2.31172 4.26224 2.26341 4.75271 2.35753 5.22589C2.45165 5.69908 2.68398 6.13373 3.02513 6.47488C3.36627 6.81602 3.80092 7.04835 4.27411 7.14247C4.74729 7.23659 5.23776 7.18829 5.6835 7.00366C6.12923 6.81903 6.5102 6.50637 6.77824 6.10523C7.04628 5.70408 7.18934 5.23246 7.18934 4.75C7.18934 4.10305 6.93234 3.48259 6.47488 3.02513C6.01741 2.56766 5.39695 2.31066 4.75 2.31066ZM4.75 6.33348C4.43682 6.33348 4.13067 6.24061 3.87027 6.06661C3.60987 5.89262 3.40691 5.64531 3.28706 5.35597C3.16721 5.06663 3.13585 4.74824 3.19695 4.44108C3.25805 4.13392 3.40886 3.85177 3.63031 3.63031C3.85177 3.40886 4.13392 3.25805 4.44108 3.19695C4.74824 3.13585 5.06663 3.16721 5.35597 3.28706C5.64531 3.40691 5.89262 3.60987 6.06661 3.87027C6.24061 4.13067 6.33348 4.43682 6.33348 4.75C6.33348 5.16996 6.16665 5.57273 5.86969 5.86969C5.57273 6.16665 5.16996 6.33348 4.75 6.33348ZM7.28564 1.64436C7.1729 1.64436 7.0627 1.67779 6.96896 1.74043C6.87523 1.80306 6.80217 1.89208 6.75903 1.99623C6.71588 2.10039 6.7046 2.215 6.72659 2.32557C6.74858 2.43613 6.80287 2.5377 6.88259 2.61741C6.9623 2.69713 7.06387 2.75142 7.17444 2.77341C7.28501 2.79541 7.39961 2.78412 7.50377 2.74098C7.60792 2.69783 7.69694 2.62478 7.75957 2.53104C7.82221 2.4373 7.85564 2.3271 7.85564 2.21436C7.85564 2.06319 7.79558 1.91821 7.68869 1.81131C7.58179 1.70442 7.43681 1.64436 7.28564 1.64436Z" fill="currentColor" /></svg>
                      </span>
                    </span>
                    <span className="flex h-6 items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white pl-2 pr-2.5 backdrop-blur-[12px] dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg">
                      <svg width="12" height="12" viewBox="0 0 9 10" fill="none"><path d="M4.05664 0C2.814 0 1.80664 1.00736 1.80664 2.25C1.80664 3.49264 2.814 4.5 4.05664 4.5C5.29928 4.5 6.30664 3.49264 6.30664 2.25C6.30664 1.00736 5.29928 0 4.05664 0Z" fill="currentColor" /><path d="M4.05738 5C2.14143 5 0.675071 6.14811 0.0796651 7.75801C-0.0905503 8.21824 0.0259876 8.6719 0.296567 8.99437C0.560253 9.30862 0.967304 9.5 1.4058 9.5H6.70896C7.14746 9.5 7.55451 9.30862 7.8182 8.99437C8.08878 8.6719 8.20531 8.21824 8.0351 7.75801C7.43969 6.14811 5.97333 5 4.05738 5Z" fill="currentColor" /></svg>
                      {c.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-[150%] tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]">
                    {c.description}
                  </p>

                  <Divider />
                  {/* Creator requirements */}
                  <RequirementsCard title="Creator requirements">
                    {c.creatorRequirements.map((req, i) => (
                      <RequirementRow key={i}>
                        <span className="flex flex-wrap items-center gap-1.5">
                          {req.text}
                          {req.platforms && (
                            <span className="ml-1 inline-flex items-center gap-1">
                              {req.platforms.map((p) => (
                                <PlatformCircle key={p} platform={p} />
                              ))}
                            </span>
                          )}
                        </span>
                      </RequirementRow>
                    ))}
                  </RequirementsCard>

                  {/* Content requirements */}
                  <RequirementsCard title="Content requirements">
                    {c.contentRequirements.map((req, i) => (
                      <RequirementRow key={i}>
                        <span className="flex flex-wrap items-center gap-2">
                          {req.text}
                          {req.badge && (
                            <span className="inline-flex h-6 items-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 font-inter text-[12px] font-medium leading-none tracking-[-0.02em] text-page-text dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg">
                              {req.badge}
                            </span>
                          )}
                        </span>
                      </RequirementRow>
                    ))}
                  </RequirementsCard>

                  {/* Bonuses */}
                  <div className="flex flex-col gap-2">
                    {c.bonuses.map((b, i) => (
                      <div key={i} className="flex flex-col gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg dark:shadow-none">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg">
                            <GiftIcon />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">{b.title}</span>
                            <span className="font-inter text-[14px] font-normal leading-[150%] tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">{b.description}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg">
                              <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">{b.amount}</span>
                              <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text-muted">per</span>
                            </span>
                            <span className="inline-flex h-8 items-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg">
                              <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">{b.threshold}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sound requirements */}
                  <SoundRequirementsCard
                    platforms={c.sounds.platforms as unknown as string[]}
                    items={c.sounds.items}
                  />

                  {/* Per-platform payouts */}
                  {c.platformPayouts.map((p, i) => (
                    <div key={i} className="flex flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg dark:shadow-none">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg">
                          <PlatformIcon platform={p.platform} size={20} className="opacity-50" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">{p.label}</span>
                          <span className="font-inter text-[14px] font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{p.subtitle}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="inline-flex h-8 items-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg">
                            <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">{p.min}</span>
                          </span>
                          <span className="inline-flex h-8 items-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg">
                            <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">{p.max}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Reference materials */}
                  <ReferenceMaterialsCard
                    tabs={c.referenceMaterials.tabs as unknown as string[]}
                    items={c.referenceMaterials.items}
                  />
                </div>

                {/* Right column: sidebar */}
                <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[400px]">
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="h-[210px] w-full bg-gradient-to-br from-[rgba(37,37,37,0.06)] to-[rgba(37,37,37,0.12)] dark:from-[rgba(255,255,255,0.04)] dark:to-[rgba(255,255,255,0.08)]" />
                    <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[rgba(26,103,229,0.4)] px-2.5 py-1.5 text-xs font-medium tracking-[-0.02em] text-[#DBEAFE] backdrop-blur-[8px]">
                      CPM
                    </span>
                  </div>

                  {/* Budget + stats card */}
                <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none">
                  {/* Budget section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between">
                      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                        ${c.budget.monthly.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/mo
                      </span>
                      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                        ${c.budget.spent.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} spent
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full border border-border bg-foreground/[0.05]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, minWidth: pct > 0 ? 8 : 0, background: "linear-gradient(180deg, #FFBB00 0%, #FF5300 100%)", boxShadow: "inset 0px 1px 0px rgba(255,255,255,0.35), inset 0px -1px 0px rgba(255,255,255,0.15)" }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                        of ${c.budget.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} total budget
                      </span>
                      <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Warning card */}
                  <div className="flex flex-col gap-3 rounded-xl bg-[rgba(229,113,0,0.08)] px-4 py-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(229,113,0,0.08)]">
                      <svg width="20" height="20" viewBox="0 0 17 16" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.19259 1.24032C7.15729 -0.413439 9.54679 -0.413443 10.5115 1.24032L16.3598 11.2659C17.332 12.9326 16.1298 15.0256 14.2003 15.0256H2.50377C0.57429 15.0256 -0.62789 12.9326 0.344318 11.2659L6.19259 1.24032ZM8.35287 5.02563C8.8131 5.02563 9.1862 5.39873 9.1862 5.85897V8.35897C9.1862 8.8192 8.8131 9.1923 8.35287 9.1923C7.89263 9.1923 7.51953 8.8192 7.51953 8.35897V5.85897C7.51953 5.39873 7.89263 5.02563 8.35287 5.02563ZM7.3112 10.859C7.3112 10.2837 7.77757 9.8173 8.35287 9.8173C8.92816 9.8173 9.39453 10.2837 9.39453 10.859C9.39453 11.4343 8.92816 11.9006 8.35287 11.9006C7.77757 11.9006 7.3112 11.4343 7.3112 10.859Z" fill="#E57100"/>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">
                        Running low
                      </span>
                      <p className="font-inter text-sm leading-[150%] tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">
                        At current pace, budget runs out in ~4 days. Top up to keep creators submitting.
                      </p>
                    </div>
                    <button onClick={() => setTopUpOpen(true)} className="flex h-9 w-full cursor-pointer items-center justify-center rounded-full bg-[#E57100] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#cc6400]">
                      Top up $2,000 from balance
                    </button>
                  </div>

                  {/* Stats list — fields vary by campaign model (Retainer / CPM / Per post) */}
                  {(() => {
                    const model = (c.tags.find((t) => /retainer|cpm|per\s*post/i.test(t.label))?.label ?? "Retainer") as "Retainer" | "CPM" | "Per post";
                    const platformsRow = (
                      <StatRow
                        label="Platforms"
                        value={
                          <span className="flex items-center gap-1">
                            {c.stats.platforms.map((p) => (
                              <PlatformCircle key={p} platform={p} />
                            ))}
                          </span>
                        }
                      />
                    );
                    return (
                      <div className="flex flex-col">
                        {model === "Retainer" && (
                          <>
                            <StatRow label="Active creators" value={String(c.stats.activeCreators)} />
                            <StatRow label="Videos" value={String(c.stats.videos)} />
                            <StatRow label="Duration" value={c.stats.duration} />
                            <StatRow label="Category" value={c.stats.category} />
                            {platformsRow}
                            <StatRow label="Last edited" value={c.stats.lastEdited} />
                            <StatRow label="Submission deadline" value={c.stats.submissionDeadline} />
                            <StatRow
                              label="Min. engagement rate"
                              value={<span className="text-[#FF3355] dark:text-[#FB7185]">{c.stats.minEngagementRate}</span>}
                            />
                          </>
                        )}
                        {model === "CPM" && (
                          <>
                            <StatRow label="CPM" value={c.stats.cpm} />
                            <StatRow label="Videos" value={String(c.stats.videos)} />
                            <StatRow label="Category" value={c.stats.category} />
                            {platformsRow}
                            <StatRow label="Last edited" value={c.stats.lastEdited} />
                          </>
                        )}
                        {model === "Per post" && (
                          <>
                            <StatRow label="Per post" value={c.stats.perPost} />
                            <StatRow label="Posts" value={c.stats.postsPerMonth} />
                            <StatRow label="Videos" value={String(c.stats.videos)} />
                            <StatRow label="Category" value={c.stats.category} />
                            {platformsRow}
                            <StatRow label="Last edited" value={c.stats.lastEdited} />
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
              </div>
            </div>
          </div>
        ) : activeTab === "finance" ? (
          <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-5">
            <FinanceTab />
          </div>
        ) : activeTab === "submissions" ? (
          <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-5">
            <SubmissionsTab />
          </div>
        ) : activeTab === "creators" ? (
          <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-5">
            <CreatorsTab />
          </div>
        ) : activeTab === "events" ? (
          <EventsTab />
        ) : (
          <div className="flex flex-1 items-center justify-center py-32">
            <span className="text-sm tracking-[-0.02em] text-page-text-muted">
              Coming soon
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────── */}
      <footer className="fixed inset-x-0 bottom-[calc(52px+env(safe-area-inset-bottom))] z-20 flex items-center justify-between border-t border-[rgba(37,37,37,0.06)] bg-white px-4 py-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-[#161616] md:static md:inset-auto md:bottom-auto sm:px-5 sm:py-3">
        <span className="hidden text-sm tracking-[-0.02em] text-page-text sm:block">
          {c.title}
        </span>
        <div className="flex flex-1 items-center gap-2 sm:flex-none">
          <div ref={dotsRef} className="relative">
            <button
              onClick={() => setDotsOpen((v) => !v)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white text-page-text-muted transition-colors hover:bg-[rgba(37,37,37,0.04)] dark:border-transparent dark:bg-[rgba(255,255,255,0.08)] dark:text-[#E0E0E0] dark:hover:bg-[rgba(255,255,255,0.12)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
            </button>
            <AnimatePresence>
              {dotsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-0 z-50 mb-2 flex w-44 flex-col rounded-xl border border-[rgba(37,37,37,0.06)] bg-white p-1 shadow-[0px_4px_12px_rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg"
                >
                  <DotsMenuItems
                    onClose={() => setDotsOpen(false)}
                    onSettings={() => setSettingsOpen(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="hidden cursor-pointer rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-3.5 py-1.5 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-[rgba(37,37,37,0.04)] dark:border-transparent dark:bg-[rgba(255,255,255,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)] sm:block">
            Edit
          </button>
          <button onClick={() => setTopUpOpen(true)} className="hidden cursor-pointer rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-3.5 py-1.5 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-[rgba(37,37,37,0.04)] dark:border-transparent dark:bg-[rgba(255,255,255,0.08)] dark:hover:bg-[rgba(255,255,255,0.12)] sm:block">
            Top up
          </button>
          <button onClick={() => setEndOpen(true)} className="flex h-9 flex-1 cursor-pointer items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 dark:text-[#252525] sm:flex-none">
            End &amp; review
          </button>
          <button onClick={() => setBoostOpen(true)} className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#8B5CF6] px-4 text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#7c3aed] sm:flex-none">
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" className="shrink-0"><path d="M7.37884 1.00184C7.37884 0.0124272 6.09561 -0.37609 5.54679 0.447142L0.169631 8.51288C-0.273405 9.17744 0.202986 10.0676 1.00168 10.0676H4.71217V13.8C4.71217 14.7894 5.9954 15.1779 6.54423 14.3547L11.9214 6.28895C12.3644 5.6244 11.888 4.73425 11.0893 4.73425H7.37884V1.00184Z" fill="white"/></svg>
            Boost
          </button>
        </div>
      </footer>

      <BoostCampaignModal open={boostOpen} onOpenChange={setBoostOpen} campaignName={c.title} />
      <EndCampaignModal
        open={endOpen}
        onOpenChange={setEndOpen}
        campaign={{
          title: c.title,
          type: c.type,
          views: "121k",
          creators: c.stats.activeCreators,
        }}
      />
      <CampaignSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      {topUpOpen && <TopUpModal onClose={() => setTopUpOpen(false)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HeaderTabs – proximity hover                                       */
/* ------------------------------------------------------------------ */

function ScrollFadeTabs({ children, bgLight = "#FBFBFB", bgDark = "#161616" }: { children: React.ReactNode; bgLight?: string; bgDark?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", checkScroll); ro.disconnect(); };
  }, [checkScroll]);
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const bg = isDark ? bgDark : bgLight;
  return (
    <div className="relative min-w-0 flex-1">
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">{children}</div>
      <div className={cn("pointer-events-none absolute inset-y-0 left-0 z-10 w-8 transition-opacity duration-200", canScrollLeft ? "opacity-100" : "opacity-0")} style={{ background: `linear-gradient(to right, ${bg}, transparent)` }} />
      <div className={cn("pointer-events-none absolute inset-y-0 right-0 z-10 w-8 transition-opacity duration-200", canScrollRight ? "opacity-100" : "opacity-0")} style={{ background: `linear-gradient(to left, ${bg}, transparent)` }} />
    </div>
  );
}

function HeaderTabs({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (i: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseInside = useRef(false);

  const {
    activeIndex: hoveredIndex,
    itemRects: tabRects,
    handlers,
    registerItem: registerTab,
    measureItems: measureTabs,
  } = useProximityHover(containerRef, { axis: "x" });

  useEffect(() => {
    measureTabs();
  }, [measureTabs]);

  // Auto-scroll selected tab into view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const tab = container.querySelector(`[data-proximity-index="${selectedIndex}"]`) as HTMLElement | null;
    if (tab) {
      tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedIndex]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      isMouseInside.current = true;
      handlers.onMouseMove(e);
    },
    [handlers],
  );

  const handleMouseLeave = useCallback(() => {
    isMouseInside.current = false;
    handlers.onMouseLeave();
  }, [handlers]);

  const selectedRect = tabRects[selectedIndex];
  const hoverRect = hoveredIndex !== null ? tabRects[hoveredIndex] : null;
  const isHoveringSelected = hoveredIndex === selectedIndex;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-1 h-14 items-stretch overflow-x-auto scrollbar-hide whitespace-nowrap md:justify-end"
    >
      {/* Selected underline */}
      {selectedRect && (
        <motion.div
          className="pointer-events-none absolute bottom-0 h-px bg-page-text"
          initial={false}
          animate={{
            left: selectedRect.left,
            width: selectedRect.width,
          }}
          transition={springs.moderate}
        />
      )}

      {/* Hover highlight */}
      <AnimatePresence>
        {hoverRect && !isHoveringSelected && (
          <motion.div
            className="pointer-events-none absolute bottom-0 h-8 rounded-lg bg-foreground/[0.04]"
            initial={{
              left: selectedRect?.left ?? hoverRect.left,
              width: selectedRect?.width ?? hoverRect.width,
              opacity: 0,
            }}
            animate={{
              left: hoverRect.left,
              width: hoverRect.width,
              opacity: 1,
            }}
            exit={
              !isMouseInside.current && selectedRect
                ? {
                    left: selectedRect.left,
                    width: selectedRect.width,
                    opacity: 0,
                    transition: {
                      ...springs.moderate,
                      opacity: { duration: 0.12 },
                    },
                  }
                : { opacity: 0, transition: { duration: 0.12 } }
            }
            transition={{
              ...springs.moderate,
              opacity: { duration: 0.16 },
            }}
            style={{ bottom: 12 }}
          />
        )}
      </AnimatePresence>

      {TABS.map((tab, i) => {
        const isSelected = selectedIndex === i;
        const isHovered = hoveredIndex === i;
        return (
          <button
            key={tab.key}
            data-proximity-index={i}
            ref={(el) => {
              registerTab(i, el);
            }}
            onClick={() => onSelect(i)}
            className={cn(
              "relative z-10 flex cursor-pointer items-center justify-center gap-1.5 px-3 font-inter text-sm tracking-[-0.02em] font-medium transition-colors",
              isSelected || isHovered
                ? "text-page-text"
                : "text-page-text/50",
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="font-normal text-page-text/40">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StatRow                                                            */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  DotsMenuItems – proximity-hover menu                               */
/* ------------------------------------------------------------------ */

const DOTS_ITEMS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="1.8 1.8 20.4 20.4" fill="none">
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill="currentColor" />
      </svg>
    ),
    label: "Settings",
    key: "settings",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" />
      </svg>
    ),
    label: "Pause",
    key: "pause",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z" fill="currentColor" />
      </svg>
    ),
    label: "Archive",
    key: "archive",
  },
];

function DotsMenuItems({ onClose, onSettings }: { onClose: () => void; onSettings: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(menuRef);

  useEffect(() => { measureItems(); }, [measureItems]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div
      ref={menuRef}
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
      {DOTS_ITEMS.map((item, i) => (
        <button
          key={item.key}
          ref={(el) => registerItem(i, el)}
          onClick={() => {
            onClose();
            if (item.key === "settings") onSettings();
          }}
          className="relative z-10 flex h-8 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-[14px] leading-[1.2] tracking-[-0.02em] text-page-text"
        >
          <span className="text-page-text-muted">
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StatRow                                                            */
/* ------------------------------------------------------------------ */

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between py-2.5">
        <span className="text-sm tracking-[-0.02em] text-page-text-muted">
          {label}
        </span>
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">
          {value}
        </span>
      </div>
      <div className="h-px w-full bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(255,255,255,0.06)] last:hidden" />
    </>
  );
}
