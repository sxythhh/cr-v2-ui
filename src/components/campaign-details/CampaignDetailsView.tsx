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
import AnalyticsTab from "./AnalyticsTab";
import {
  IconArrowLeft,
  IconLock,
  IconScissors,
  IconDots,
} from "@tabler/icons-react";

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
};

const TABS = [
  { key: "details", label: "Details" },
  { key: "finance", label: "Finance" },
  { key: "submissions", label: "Submissions", count: 8 },
  { key: "creators", label: "Creators", count: 12 },
  { key: "analytics", label: "Analytics" },
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
    <div className="flex flex-col bg-white dark:bg-[#161616] md:h-full">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex items-center border-b border-[rgba(37,37,37,0.06)] px-4 dark:border-[rgba(224,224,224,0.03)] sm:px-5">
        {/* Back – hidden on mobile, shown inline on desktop */}
        <button
          onClick={() => router.push("/campaigns")}
          className="mr-4 hidden items-center gap-1.5 text-sm tracking-[-0.02em] text-page-text-muted hover:text-[#252525] dark:hover:text-[#e5e5e5] transition-colors md:flex"
        >
          <IconArrowLeft size={16} />
          <span>Back to campaigns</span>
        </button>

        {/* Tabs – scrollable on mobile, right-aligned on desktop */}
        <HeaderTabs
          selectedIndex={TABS.findIndex((t) => t.key === activeTab)}
          onSelect={(i) => setActiveTab(TABS[i].key)}
        />
      </header>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="md:min-h-0 md:flex-1 md:overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {activeTab === "details" ? (
          <div className="mx-auto max-w-[1200px] px-5 py-5">
            <div className="flex flex-col gap-5">
              {/* Mobile-only back button */}
              <button
                onClick={() => router.push("/campaigns")}
                className="flex items-center gap-1.5 text-sm tracking-[-0.02em] text-page-text-muted hover:text-[#252525] dark:hover:text-[#e5e5e5] transition-colors md:hidden"
              >
                <IconArrowLeft size={16} />
                <span>Back to campaigns</span>
              </button>

              {/* ── Hero row: info + thumbnail ─────────────────── */}
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
                {/* Left: campaign info */}
                <div className="flex flex-1 min-w-0 flex-col gap-6">
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
                      <IconScissors size={12} />
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
                </div>

                {/* Right: thumbnail */}
                <div className="relative w-full shrink-0 lg:w-[400px]">
                  <div className="h-[232px] w-full overflow-hidden rounded-2xl bg-[rgba(37,37,37,0.08)] dark:bg-[rgba(255,255,255,0.08)]">
                    <div className="h-full w-full bg-gradient-to-br from-[rgba(37,37,37,0.06)] to-[rgba(37,37,37,0.12)] dark:from-[rgba(255,255,255,0.04)] dark:to-[rgba(255,255,255,0.08)]" />
                  </div>
                  {/* CPM badge */}
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[rgba(26,103,229,0.4)] px-2.5 py-1.5 text-xs font-medium tracking-[-0.02em] text-[#DBEAFE] backdrop-blur-[8px]">
                    CPM
                  </span>
                </div>
              </div>

              <Divider />

              {/* ── Bottom: requirements + stats ───────────────── */}
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
                {/* Left: requirements */}
                <div className="flex flex-1 min-w-0 flex-col gap-5">
                  {/* Creator requirements */}
                  <div className="flex flex-col gap-3">
                    <h2 className="text-base font-medium tracking-[-0.02em] text-page-text">
                      Creator requirements
                    </h2>
                    <ul className="flex flex-col gap-2">
                      {c.creatorRequirements.map((req, i) => (
                        <BulletItem key={i}>
                          <span className="flex items-center gap-1.5 flex-wrap">
                            {req.text}
                            {req.platforms && (
                              <span className="inline-flex items-center gap-1 ml-1">
                                {req.platforms.map((p) => (
                                  <PlatformCircle key={p} platform={p} />
                                ))}
                              </span>
                            )}
                          </span>
                        </BulletItem>
                      ))}
                    </ul>
                  </div>

                  {/* Content requirements */}
                  <div className="flex flex-col gap-3">
                    <h2 className="text-base font-medium tracking-[-0.02em] text-page-text">
                      Content Requirements
                    </h2>
                    <ul className="flex flex-col gap-2">
                      {c.contentRequirements.map((req, i) => (
                        <BulletItem key={i}>
                          <span className="flex items-center gap-1.5 flex-wrap">
                            {req.text}
                            {req.badge && (
                              <span className="inline-flex items-center rounded-full bg-[rgba(229,113,0,0.1)] px-2 py-0.5 text-xs font-medium text-[#E57100]">
                                {req.badge}
                              </span>
                            )}
                          </span>
                        </BulletItem>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: stats card */}
                <div className="w-full shrink-0 lg:w-[400px]">
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
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(255,255,255,0.06)]">
                      <div
                        className="h-full rounded-full bg-[#E57100] transition-all"
                        style={{ width: `${pct}%` }}
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

                  {/* Stats list */}
                  <div className="flex flex-col">
                    <StatRow label="Active creators" value={String(c.stats.activeCreators)} />
                    <StatRow label="Videos" value={String(c.stats.videos)} />
                    <StatRow label="Duration" value={c.stats.duration} />
                    <StatRow label="Category" value={c.stats.category} />
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
                    <StatRow label="Last edited" value={c.stats.lastEdited} />
                    <StatRow label="Submission deadline" value={c.stats.submissionDeadline} />
                    <StatRow
                      label="Min. engagement rate"
                      value={
                        <span className="text-[#FF3355] dark:text-[#FB7185]">{c.stats.minEngagementRate}</span>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        ) : activeTab === "finance" ? (
          <div className="mx-auto max-w-[1200px] px-5 py-5">
            <FinanceTab />
          </div>
        ) : activeTab === "submissions" ? (
          <div className="mx-auto max-w-[1200px] px-5 py-5">
            <SubmissionsTab />
          </div>
        ) : activeTab === "creators" ? (
          <div className="mx-auto max-w-[1200px] px-5 py-5">
            <CreatorsTab />
          </div>
        ) : activeTab === "events" ? (
          <EventsTab />
        ) : activeTab === "analytics" ? (
          <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-5">
            <AnalyticsTab />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-32">
            <span className="text-sm tracking-[-0.02em] text-page-text-muted">
              Coming soon
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────── */}
      <footer className="fixed inset-x-0 bottom-[calc(60px+max(8px,env(safe-area-inset-bottom)))] z-20 flex items-center justify-between border-t border-[rgba(37,37,37,0.06)] bg-white px-4 py-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-[#161616] md:static md:inset-auto md:bottom-auto sm:px-5 sm:py-3">
        <span className="hidden text-sm tracking-[-0.02em] text-page-text sm:block">
          {c.title}
        </span>
        <div className="flex flex-1 items-center gap-2 sm:flex-none">
          <div ref={dotsRef} className="relative">
            <button
              onClick={() => setDotsOpen((v) => !v)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white text-page-text-muted transition-colors hover:bg-[rgba(37,37,37,0.04)] dark:border-transparent dark:bg-[rgba(255,255,255,0.08)] dark:text-[#E0E0E0] dark:hover:bg-[rgba(255,255,255,0.12)]"
            >
              <IconDots size={16} />
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
