"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FilterSelect } from "@/components/ui/dub-filter";

// ── Icons ───────────────────────────────────────────────────────────

function ModalCloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.52" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.5 4.5H4.5C3.94772 4.5 3.5 4.94772 3.5 5.5V15.5C3.5 16.0523 3.94772 16.5 4.5 16.5H14.5C15.0523 16.5 15.5 16.0523 15.5 15.5V12.5M11.5 3.5H16.5M16.5 3.5V8.5M16.5 3.5L8.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5C8.83 5 9.5 5.67 9.5 6.5C9.5 7.17 9.01 7.73 8.37 7.93C8.16 8 8 8.17 8 8.39V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

function CheckCircleFilledIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM10.78 6.53C10.85 6.46 10.9 6.38 10.94 6.29C10.97 6.2 10.99 6.1 10.99 6C10.99 5.9 10.97 5.8 10.94 5.71C10.9 5.62 10.85 5.54 10.78 5.47C10.71 5.4 10.63 5.35 10.54 5.31C10.45 5.28 10.35 5.26 10.25 5.26C10.15 5.26 10.05 5.28 9.96 5.31C9.87 5.35 9.79 5.4 9.72 5.47L7 8.19L6.28 7.47C6.14 7.33 5.95 7.26 5.75 7.26C5.55 7.26 5.36 7.33 5.22 7.47C5.08 7.61 5.01 7.8 5.01 8C5.01 8.1 5.03 8.2 5.06 8.29C5.1 8.38 5.15 8.46 5.22 8.53L6.47 9.78C6.54 9.85 6.62 9.9 6.71 9.94C6.8 9.97 6.9 9.99 7 9.99C7.1 9.99 7.2 9.97 7.29 9.94C7.38 9.9 7.46 9.85 7.53 9.78L10.78 6.53Z" fill="currentColor" />
    </svg>
  );
}

function XCircleFilledIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM10.47 6.53C10.73 6.27 10.73 5.85 10.47 5.59C10.21 5.33 9.79 5.33 9.53 5.59L8 7.12L6.47 5.59C6.21 5.33 5.79 5.33 5.53 5.59C5.27 5.85 5.27 6.27 5.53 6.53L7.06 8.06L5.53 9.59C5.27 9.85 5.27 10.27 5.53 10.53C5.79 10.79 6.21 10.79 6.47 10.53L8 9L9.53 10.53C9.79 10.79 10.21 10.79 10.47 10.53C10.73 10.27 10.73 9.85 10.47 9.59L8.94 8.06L10.47 6.53Z" fill="currentColor" />
    </svg>
  );
}

// ── Mock Data ───────────────────────────────────────────────────────

interface SocialAccount {
  platform: "tiktok" | "instagram";
  username: string;
  views: string;
  engagement: string;
  likes: string;
  comments: string;
}

interface Application {
  id: number;
  name: string;
  handle: string;
  date: string;
  avatar: string;
  campaign: string;
  campaignAvatar: string;
  platforms: { type: "tiktok" | "instagram"; count?: number; handle?: string }[];
  earned: string;
  bio: string;
  actionPlatforms: ("tiktok" | "instagram")[];
  appliedDate: string;
  motivation: string;
  socialAccounts: SocialAccount[];
}

const APPLICATIONS: Application[] = [
  {
    id: 1,
    name: "xKaizen",
    handle: "@xkaizen",
    date: "25 Feb '26",
    avatar: "https://i.pravatar.cc/72?img=11",
    campaign: "Artistic Journey: From Canvas to Digital",
    campaignAvatar: "https://i.pravatar.cc/24?img=60",
    platforms: [{ type: "tiktok", count: 3 }],
    earned: "$40,000",
    bio: "Love creating authentic content that resonates with my followers. Fashion is my passion!",
    actionPlatforms: ["tiktok"],
    appliedDate: "2 Mar, 2026",
    motivation: "I've been creating fashion content for 3 years and my audience loves discovering new brands. I specialize in minimalist style and sustainable fashion. My engagement rate consistently outperforms the niche average, which means the brands I promote actually get results.",
    socialAccounts: [
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
    ],
  },
  {
    id: 2,
    name: "xKaizen",
    handle: "@xkaizen",
    date: "25 Feb '26",
    avatar: "https://i.pravatar.cc/72?img=11",
    campaign: "Artistic Journey: From Canvas to Digital",
    campaignAvatar: "https://i.pravatar.cc/24?img=60",
    platforms: [
      { type: "tiktok", count: 3 },
      { type: "instagram", count: 3 },
    ],
    earned: "$40,000",
    bio: "Love creating authentic content that resonates with my followers. Fashion is my passion!",
    actionPlatforms: ["tiktok", "instagram"],
    appliedDate: "28 Feb, 2026",
    motivation: "I've built a premium beauty and skincare community with 4.7M views on my last campaign. My audience is primarily 25-34 women with high purchasing power.",
    socialAccounts: [
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "instagram", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
      { platform: "instagram", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
    ],
  },
  {
    id: 3,
    name: "xKaizen",
    handle: "@xkaizen",
    date: "25 Feb '26",
    avatar: "https://i.pravatar.cc/72?img=11",
    campaign: "Artistic Journey: From Canvas to Digital",
    campaignAvatar: "https://i.pravatar.cc/24?img=60",
    platforms: [{ type: "tiktok", handle: "@creative_marc" }],
    earned: "$40,000",
    bio: "Love creating authentic content that resonates with my followers. Fashion is my passion!",
    actionPlatforms: ["tiktok"],
    appliedDate: "1 Mar, 2026",
    motivation: "Fitness content is my passion and I've built a loyal community of 500K+ followers who trust my product recommendations.",
    socialAccounts: [
      { platform: "tiktok", username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
    ],
  },
];

// ── Social Account Card ─────────────────────────────────────────────

function SocialAccountCard({ account }: { account: SocialAccount }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card-bg p-4 transition-colors hover:bg-foreground/[0.02]">
      {/* Top row: platform + username + link | stat pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <PlatformIcon platform={account.platform} size={16} />
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium leading-5 tracking-[0.01em] text-page-text">
            {account.username}
          </span>
        </div>
        <button className="flex size-5 cursor-pointer items-center justify-center text-page-text-muted transition-opacity hover:opacity-70">
          <ExternalLinkIcon />
        </button>
      </div>

      {/* Stat pills row */}
      <div className="flex flex-wrap items-center gap-1">
        {/* Views */}
        <div className="flex items-center gap-1 rounded-full bg-[rgba(77,129,238,0.1)] px-2.5 py-[5px]">
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            Views
          </span>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#4D81EE]">
            {account.views}
          </span>
        </div>

        {/* Engagement */}
        <div className="flex items-center gap-1 rounded-full bg-[rgba(157,90,239,0.1)] px-2.5 py-[5px]">
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            Engagement
          </span>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#9D5AEF]">
            {account.engagement}
          </span>
        </div>

        {/* Likes */}
        <div className="flex items-center gap-1 rounded-full bg-[rgba(218,85,151,0.1)] px-2.5 py-[5px]">
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            Likes
          </span>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#DA5597]">
            {account.likes}
          </span>
        </div>

        {/* Comments */}
        <div className="flex items-center gap-1 rounded-full bg-[rgba(0,178,89,0.1)] px-2.5 py-[5px]">
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            Comments
          </span>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#00B259]">
            {account.comments}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Application Details Modal ────────────────────────────────────────

type ModalTab = "application" | "recent-content" | "social-accounts";

function ApplicationDetailsModal({
  app,
  onClose,
  onAction,
}: {
  app: Application;
  onClose: () => void;
  onAction?: (action: "approve" | "reject") => void;
}) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const MODAL_TABS: ModalTab[] = ["application", "recent-content", "social-accounts"];
  const activeTab = MODAL_TABS[activeTabIndex];

  const tiktokCount = app.socialAccounts.filter((a) => a.platform === "tiktok").length;
  const instagramCount = app.socialAccounts.filter((a) => a.platform === "instagram").length;

  return (
    <Modal open onClose={onClose} maxWidth="max-w-[800px]" showClose={false}>
      <div
        className="flex flex-col overflow-hidden"
        style={{ height: "min(560px, calc(100dvh - 120px))" }}
      >
        {/* Header */}
        <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-border px-5">
          <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
            Application details
          </span>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 text-page-text-muted transition-opacity hover:opacity-70"
          >
            <ModalCloseIcon />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
          {/* Creator info row */}
          <div className="flex items-center gap-2">
            <img
              src={app.avatar}
              alt={app.name}
              className="size-6 rounded-full object-cover"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
                {app.name}
              </span>
              <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">
                ·
              </span>
              <div className="flex items-center gap-1">
                {app.actionPlatforms.map((p) => (
                  <div
                    key={p}
                    className="flex size-6 items-center justify-center rounded-full bg-accent"
                  >
                    <PlatformIcon platform={p} size={12} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Creator stats */}
          <div className="mt-4 flex gap-2">
            {[
              { value: "1.2M", label: "Followers" },
              { value: "$53,879", label: "Earned" },
              { value: "4.2%", label: "Engagement" },
              { value: "142", label: "Videos" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-foreground/[0.06] bg-card-bg p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{stat.value}</span>
                <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Platform breakdown */}
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex gap-1">
              <div className="h-1 flex-1 rounded-full bg-[#AE4EEE]" />
              <div className="h-1 flex-1 rounded-full bg-[#EE4E51]" />
              <div className="h-1 flex-1 rounded-full bg-[#00994D]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#AE4EEE]">Instagram 33%</span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#EE4E51]">YouTube 33%</span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">TikTok 33%</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <Tabs selectedIndex={activeTabIndex} onSelect={setActiveTabIndex} variant="underline">
              <TabItem label="Application" index={0} />
              <TabItem label="Recent content" index={1} />
              <TabItem label="Social accounts" index={2} />
            </Tabs>
          </div>

          {/* Tab content */}
          {activeTab === "application" && (
            <div className="mt-4 flex flex-col gap-2">
              {/* Stat cards row */}
              <div className="flex gap-2">
                {/* Applied on */}
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-border bg-card-bg p-3">
                  <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    {app.appliedDate}
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Applied on
                  </span>
                </div>

                {/* Applied to */}
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-border bg-card-bg p-3">
                  <span className="truncate font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    {app.campaign}
                  </span>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Applied to
                  </span>
                </div>

                {/* Applied with */}
                <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-border bg-card-bg p-3">
                  <div className="flex items-center gap-1.5">
                    {tiktokCount > 0 && (
                      <div className="flex items-center gap-1">
                        <PlatformIcon platform="tiktok" size={16} className="text-page-text-muted" />
                        <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                          {tiktokCount}
                        </span>
                        <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text-muted">
                          Accounts
                        </span>
                      </div>
                    )}
                    {tiktokCount > 0 && instagramCount > 0 && (
                      <span className="font-inter text-sm leading-[1.2] tracking-[-0.09px] text-page-text-muted">
                        ·
                      </span>
                    )}
                    {instagramCount > 0 && (
                      <div className="flex items-center gap-1">
                        <PlatformIcon platform="instagram" size={16} className="text-page-text-muted" />
                        <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                          {instagramCount}
                        </span>
                        <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text-muted">
                          Accounts
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Applied with
                  </span>
                </div>
              </div>

              {/* Motivation card */}
              <div className="rounded-2xl border border-border bg-card-bg p-4">
                <div className="flex flex-col gap-3">
                  <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                    Motivation
                  </span>
                  <p className="font-inter text-sm leading-none tracking-[-0.02em] text-page-text">
                    {app.motivation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "recent-content" && (
            <div className="mt-4 flex gap-4">
              {[
                { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=500&fit=crop", views: "1.7M", likes: "147.2K", shares: "781" },
                { img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=500&fit=crop", views: "1.7M", likes: "147.2K", shares: "781" },
                { img: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&h=500&fit=crop", views: "1.7M", likes: "147.2K", shares: "781" },
                { img: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=300&h=500&fit=crop", views: "1.7M", likes: "147.2K", shares: "781" },
              ].map((video, i) => (
                <div key={i} className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-foreground/[0.06]" style={{ aspectRatio: "9/16" }}>
                  {/* Video thumbnail */}
                  <img src={video.img} alt="" className="absolute inset-0 size-full object-cover" style={{ filter: "brightness(0.8)" }} />
                  {/* Play button */}
                  <div className="relative z-10 flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                    <svg width="14" height="16" viewBox="-1 0 16 18" fill="none"><path d="M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z" fill="rgba(255,255,255,0.88)" /></svg>
                  </div>
                  {/* TikTok icon */}
                  <div className="absolute left-3 top-3 z-10">
                    <PlatformIcon platform="tiktok" size={20} className="text-page-text-muted/50" />
                  </div>
                  {/* Stats footer */}
                  <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-white px-2 py-2 dark:bg-card-bg">
                    <div className="flex items-center gap-0.5">
                      <svg width="12" height="12" viewBox="0 0 15 11" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.16422 0C9.7987 0 12.3579 1.515 14.0687 4.389C14.415 4.971 14.415 5.696 14.0687 6.278C12.3579 9.152 9.79871 10.667 7.16423 10.667C4.52975 10.667 1.97052 9.152 0.259753 6.278C-0.0866 5.696-0.0866 4.971 0.259753 4.389C1.97051 1.515 4.52975 0 7.16422 0ZM4.83089 5.333C4.83089 4.045 5.87556 3 7.16423 3C8.45289 3 9.49756 4.045 9.49756 5.333C9.49756 6.622 8.45289 7.667 7.16423 7.667C5.87556 7.667 4.83089 6.622 4.83089 5.333Z" fill="currentColor" className="text-foreground/50"/></svg>
                      <span className="font-inter text-[10px] font-medium text-foreground/50">{video.views}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.18641 9.202C9.54627 6.75233 10.5458 3.88357 9.76141 1.92289C9.37783 0.964105 8.57397 0.279608 7.62904 0.0684003C6.76983 -0.123647 5.82263 0.0815623 5.00269 0.774778C4.18275 0.0815623 3.23555 -0.123646 2.37634 0.0684026C1.4314 0.279612 0.627549 0.964111 0.243973 1.9229C-0.540424 3.88358 0.459144 6.75234 4.81903 9.202C4.9331 9.2661 5.07234 9.2661 5.18641 9.202Z" fill="currentColor" className="text-foreground/50"/></svg>
                      <span className="font-inter text-[10px] font-medium text-foreground/50">{video.likes}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M5.375 0.626226C5.375 0.0855389 6.01504 -0.200056 6.41744 0.161074L10.6681 3.9758C10.9449 4.22416 10.9449 4.65775 10.6681 4.90611L6.41744 8.72083C6.01504 9.08196 5.375 8.79637 5.375 8.25568V6.5684C3.50325 6.59343 2.52383 6.80933 1.93452 7.14242C1.33712 7.48007 1.09878 7.95683 0.722373 8.70973L0.71041 8.73366C0.632632 8.88922 0.458107 8.97088 0.288842 8.93092C0.119578 8.89096 0 8.73987 0 8.56595C0 6.43325 0.275979 4.8384 1.18537 3.78911C2.05373 2.78714 3.42159 2.3665 5.375 2.32028V0.626226Z" fill="currentColor" className="text-foreground/50"/></svg>
                      <span className="font-inter text-[10px] font-medium text-foreground/50">{video.shares}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "social-accounts" && (
            <div className="mt-4 flex flex-col gap-2">
              {app.socialAccounts.map((account, i) => (
                <SocialAccountCard key={i} account={account} />
              ))}
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[32px] py-1.5 pl-2.5 pr-3 transition-colors hover:bg-foreground/[0.06]"
          >
            <svg width="16" height="16" viewBox="0 0 21 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M18.091 2.36647C16.2271 0.805067 13.6014 0 10.5 0C7.3986 0 4.77295 0.805067 2.90901 2.36647C1.0291 3.94126 6.5367e-06 6.22327 6.5367e-06 9C6.5367e-06 9.79492 0.264226 10.7934 0.513766 11.5754C0.77093 12.3813 1.04586 13.0568 1.12187 13.2398L1.13379 13.2682L1.14195 13.2874C1.14624 13.2977 1.14764 13.3014 1.14764 13.3014C1.16561 13.3505 1.59394 14.5191 0.151315 16.431C0.0155991 16.6109 -0.0320598 16.8423 0.0215157 17.0611C0.0750931 17.28 0.224229 17.4632 0.427682 17.56C1.76058 18.1944 3.10162 17.9739 4.04319 17.6457C4.52 17.4795 4.91782 17.2781 5.19679 17.1185C5.22083 17.1047 5.24404 17.0912 5.2664 17.0781C6.92959 17.8376 8.80672 18 10.5 18C13.6014 18 16.2271 17.1949 18.091 15.6335C19.9709 14.0587 21 11.7767 21 9C21 6.22327 19.9709 3.94126 18.091 2.36647Z" fill="currentColor" className="text-foreground/50"/></svg>
            <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-foreground/50">
              Message
            </span>
          </button>
          <button
            onClick={() => { onAction?.("approve"); onClose(); }}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[32px] bg-foreground/[0.06] py-1.5 pl-2.5 pr-3 text-page-text transition-colors hover:bg-foreground/[0.1]"
          >
            <CheckCircleFilledIcon />
            <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em]">
              Accept
            </span>
          </button>
          <button
            onClick={() => { onAction?.("reject"); onClose(); }}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[32px] bg-[rgba(251,113,133,0.08)] py-1.5 pl-2.5 pr-3 text-[#FB7185] transition-colors hover:bg-[rgba(251,113,133,0.12)]"
          >
            <XCircleFilledIcon />
            <span className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em]">
              Reject
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Quick Review Modal ─────────────────────────────────────────────

function QuickReviewModal({
  app,
  currentIndex,
  totalCount,
  onClose,
  onAction,
  onSkip,
}: {
  app: Application;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onAction: (action: "accept" | "reject") => void;
  onSkip: () => void;
}) {
  const videos = [
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=500&fit=crop",
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=500&fit=crop",
    "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&h=500&fit=crop",
  ];

  return (
    <Modal open onClose={onClose} size="md" showClose={false}>
      <div className="flex max-h-[90vh] flex-col">
        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-center border-b border-foreground/[0.06] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Quick Review</span>
            <span className="rounded-md bg-foreground/[0.06] px-1.5 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
              {currentIndex + 1}/{totalCount} pending
            </span>
          </div>
          <button type="button" onClick={onClose} className="absolute right-4 top-3 cursor-pointer">
            <ModalCloseIcon />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-4">
          {/* Creator row */}
          <div className="flex items-center justify-between rounded-2xl border border-foreground/[0.06] p-4">
            <div className="flex items-center gap-2">
              <img src={app.avatar} alt={app.name} className="size-9 rounded-full object-cover" />
              <div className="flex flex-col gap-1.5">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{app.name}</span>
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{app.campaign}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Applied</span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">1w ago</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-2">
            {[
              { value: "1.2M", label: "Followers" },
              { value: "$53,879", label: "Earned" },
              { value: "4.2%", label: "Engagement" },
              { value: "142", label: "Videos" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-1 flex-col gap-2 rounded-2xl border border-foreground/[0.06] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{stat.value}</span>
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Platform breakdown bar */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <div className="h-1 flex-1 rounded-full bg-[#AE4EEE]" />
              <div className="h-1 flex-1 rounded-full bg-[#EE4E51]" />
              <div className="h-1 flex-1 rounded-full bg-[#00994D]" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#AE4EEE]">Instagram 33%</span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#EE4E51]">YouTube 33%</span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">TikTok 33%</span>
            </div>
          </div>

          {/* Motivation */}
          <div className="flex flex-col gap-2 rounded-2xl border border-foreground/[0.06] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Motivation</span>
            <p className="font-inter text-sm leading-[140%] tracking-[-0.02em] text-page-text">{app.motivation}</p>
          </div>

          {/* Recent content */}
          <div className="flex flex-col gap-2 rounded-2xl border border-foreground/[0.06] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Recent content</span>
            <div className="flex gap-2">
              {videos.map((src, i) => (
                <div key={i} className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-foreground/[0.06]" style={{ aspectRatio: "9/16" }}>
                  <img src={src} alt="" className="absolute inset-0 size-full object-cover" style={{ filter: "brightness(0.8)" }} />
                  {/* Play button */}
                  <div className="relative z-10 flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                    <svg width="14" height="16" viewBox="-1 0 16 18" fill="none">
                      <path d="M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z" fill="rgba(255,255,255,0.88)" />
                    </svg>
                  </div>
                  {/* Platform icon */}
                  <div className="absolute left-3 top-3 z-10">
                    <PlatformIcon platform="tiktok" size={20} className="text-page-text-muted/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action buttons — sticky footer */}
        <div className="flex shrink-0 items-center justify-center gap-6 border-t border-foreground/[0.06] px-5 py-5">
            {/* Reject */}
            <div className="flex flex-col items-center gap-2">
              <button type="button" onClick={() => onAction("reject")} className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-[rgba(251,113,133,0.08)] transition-colors hover:bg-[rgba(251,113,133,0.14)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.54 12.46a.75.75 0 1 1-1.08 1.08L12 13.08l-2.46 2.46a.75.75 0 0 1-1.08-1.08L10.92 12 8.46 9.54a.75.75 0 0 1 1.08-1.08L12 10.92l2.46-2.46a.75.75 0 0 1 1.08 1.08L13.08 12l2.46 2.46Z" fill="#FF3355"/></svg>
              </button>
              <div className="flex items-center gap-1">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text-subtle">Reject</span>
                <span className="inline-flex size-3 rotate-[-90deg] items-center justify-center font-inter text-xs leading-none tracking-[-0.02em] text-foreground/30">↑</span>
              </div>
            </div>
            {/* Message */}
            <div className="flex flex-col items-center gap-2">
              <button type="button" className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.1]">
                <svg width="21" height="18" viewBox="0 0 21 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M18.091 2.36647C16.2271 0.805067 13.6014 0 10.5 0C7.3986 0 4.77295 0.805067 2.90901 2.36647C1.0291 3.94126 6.5367e-06 6.22327 6.5367e-06 9C6.5367e-06 9.79492 0.264226 10.7934 0.513766 11.5754C0.77093 12.3813 1.04586 13.0568 1.12187 13.2398L1.13379 13.2682L1.14195 13.2874C1.14624 13.2977 1.14764 13.3014 1.14764 13.3014C1.16561 13.3505 1.59394 14.5191 0.151315 16.431C0.0155991 16.6109 -0.0320598 16.8423 0.0215157 17.0611C0.0750931 17.28 0.224229 17.4632 0.427682 17.56C1.76058 18.1944 3.10162 17.9739 4.04319 17.6457C4.52 17.4795 4.91782 17.2781 5.19679 17.1185C5.22083 17.1047 5.24404 17.0912 5.2664 17.0781C6.92959 17.8376 8.80672 18 10.5 18C13.6014 18 16.2271 17.1949 18.091 15.6335C19.9709 14.0587 21 11.7767 21 9C21 6.22327 19.9709 3.94126 18.091 2.36647Z" fill="currentColor" className="text-page-text-subtle"/></svg>
              </button>
              <div className="flex items-center gap-1">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text-subtle">Message</span>
                <span className="inline-flex size-3 items-center justify-center font-inter text-xs leading-none tracking-[-0.02em] text-foreground/30">↑</span>
              </div>
            </div>
            {/* Skip */}
            <div className="flex flex-col items-center gap-2">
              <button type="button" onClick={onSkip} className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.1]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 5v14l11-7L5 5ZM19 5v14h-2V5h2Z" fill="currentColor" className="text-page-text-subtle"/></svg>
              </button>
              <div className="flex items-center gap-1">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text-subtle">Skip</span>
                <span className="inline-flex size-3 items-center justify-center font-inter text-xs leading-none tracking-[-0.02em] text-foreground/30">↓</span>
              </div>
            </div>
            {/* Accept */}
            <div className="flex flex-col items-center gap-2">
              <button type="button" onClick={() => onAction("accept")} className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.1]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.03 8.03-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 1.06-1.06L10.5 13.44l4.47-4.47a.75.75 0 0 1 1.06 1.06Z" fill="currentColor" className="text-page-text"/></svg>
              </button>
              <div className="flex items-center gap-1">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text-subtle">Accept</span>
                <span className="inline-flex size-3 rotate-90 items-center justify-center font-inter text-xs leading-none tracking-[-0.02em] text-foreground/30">↑</span>
              </div>
            </div>
          </div>
      </div>
    </Modal>
  );
}

// ── Segmented Tabs with proximity hover ─────────────────────────────

const FILTER_TABS = [
  { label: "Pending", count: 4 },
  { label: "Accepted", count: 149 },
  { label: "Rejected", count: 27 },
];

function ApplicationSegmentedTabs({ activeFilter, onSelect }: { activeFilter: number; onSelect: (i: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    activeIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
    measureItems,
  } = useProximityHover(containerRef, { axis: "x" });

  useEffect(() => { measureItems(); }, [measureItems]);

  const register = useCallback(
    (index: number) => (el: HTMLDivElement | null) => { registerItem(index, el); },
    [registerItem],
  );

  const hoverRect = activeIndex !== null && activeIndex !== activeFilter ? itemRects[activeIndex] : null;
  const activeRect = itemRects[activeFilter];

  return (
    <div
      ref={containerRef}
      onMouseMove={handlers.onMouseMove}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      className="relative flex w-full items-center gap-0.5 rounded-xl bg-accent p-0.5 dark:bg-[rgba(224,224,224,0.03)] sm:w-auto"
    >
      {/* Active indicator */}
      {activeRect && (
        <motion.div
          className="pointer-events-none absolute rounded-[10px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
          animate={{ left: activeRect.left, width: activeRect.width, top: activeRect.top, height: activeRect.height }}
          transition={{ type: "spring", duration: 0.25, bounce: 0.1 }}
        />
      )}
      {/* Hover indicator */}
      <AnimatePresence>
        {hoverRect && (
          <motion.div
            key={sessionRef.current}
            className="pointer-events-none absolute rounded-[10px] bg-foreground/[0.04]"
            initial={{ opacity: 0, left: hoverRect.left, width: hoverRect.width, top: hoverRect.top, height: hoverRect.height }}
            animate={{ opacity: 1, left: hoverRect.left, width: hoverRect.width, top: hoverRect.top, height: hoverRect.height }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ ...springs.fast, opacity: { duration: 0.12 } }}
          />
        )}
      </AnimatePresence>

      {FILTER_TABS.map((tab, i) => (
        <div key={tab.label} ref={register(i)} className="flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "relative z-10 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] px-4 font-inter text-sm font-medium tracking-[-0.02em] transition-colors sm:w-auto sm:justify-start",
              activeFilter === i ? "text-page-text" : "text-foreground/70",
            )}
          >
            {tab.label}
            <span className="font-normal text-foreground/50">{tab.count}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Application Card ────────────────────────────────────────────────

function ApplicationCard({ app, onClick }: { app: Application; onClick: () => void }) {
  return (
    <div
      className="flex cursor-pointer flex-col rounded-2xl border border-border bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 px-4 pt-4">
        {/* Creator info + info button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={app.avatar}
              alt=""
              className="size-9 shrink-0 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                {app.name}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                  {app.handle}
                </span>
                <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-muted-foreground">
                  ·
                </span>
                <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                  {app.date}
                </span>
              </div>
            </div>
          </div>
          <button
            className="flex size-9 items-center justify-center rounded-[14px] bg-accent text-page-text transition-colors hover:bg-accent"
            onClick={(e) => e.stopPropagation()}
            title="View application details"
          >
            <InfoCircleIcon />
          </button>
        </div>

        {/* Campaign pill with connector */}
        <div className="flex items-center gap-1 pb-2 pl-[25px]">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-border">
            <path d="M0.75 0.75V8.75C0.75 10.9591 2.54086 12.75 4.75 12.75H16.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="inline-flex items-center gap-1 rounded-full bg-accent py-px pl-0.5 pr-1.5">
            <img
              src={app.campaignAvatar}
              alt=""
              className="size-3 rounded-full object-cover"
            />
            <span className="font-[family-name:var(--font-inter)] text-xs leading-[120%] text-page-text-subtle">
              {app.campaign}
            </span>
          </div>
        </div>
      </div>

      {/* Platform stats bar */}
      <div className="border-y border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {app.platforms.map((p, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.09px] text-page-text-subtle">
                    ·
                  </span>
                )}
                <PlatformIcon platform={p.type} className="opacity-50" />
                {p.count !== undefined ? (
                  <div className="flex items-center gap-1">
                    <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.09px] text-page-text">
                      {p.count}
                    </span>
                    <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.09px] text-page-text-subtle">
                      Accounts
                    </span>
                  </div>
                ) : (
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.09px] text-muted-foreground">
                    {p.handle ?? ""}
                  </span>
                )}
              </div>
            ))}
          </div>
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.09px] text-page-text">
            {app.earned}
          </span>
        </div>
      </div>

      {/* Bio */}
      <div className="px-4 pt-3">
        <p className="font-[family-name:var(--font-inter)] text-sm leading-[145%] tracking-[-0.09px] text-page-text-subtle">
          {app.bio}
        </p>
      </div>

      {/* Footer: Accept/Reject + platform icons */}
      <div className="flex items-center justify-between px-4 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[32px] bg-foreground/[0.06] py-1.5 pl-2.5 pr-3 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.1]">
            <CheckCircleFilledIcon />
            Accept
          </button>
          <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[32px] bg-[rgba(251,113,133,0.08)] py-1.5 pl-2.5 pr-3 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-[#FB7185] transition-colors hover:bg-[rgba(251,113,133,0.12)]">
            <XCircleFilledIcon />
            Reject
          </button>
        </div>
        <div className="flex items-center gap-2">
          {app.actionPlatforms.map((p) => (
            <PlatformIcon key={p} platform={p} className="opacity-50" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export function ApplicationsContent({ onQuickReviewRef, onScoresRef }: { onQuickReviewRef?: React.MutableRefObject<(() => void) | null>; onScoresRef?: React.MutableRefObject<(() => void) | null> } = {}) {
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const selectedApp = selectedAppId !== null ? APPLICATIONS.find((a) => a.id === selectedAppId) ?? null : null;
  const [quickReviewOpen, setQuickReviewOpen] = useState(false);
  const [quickReviewIndex, setQuickReviewIndex] = useState(0);
  const pendingApps = APPLICATIONS; // all apps for quick review
  const currentReviewApp = pendingApps[quickReviewIndex] ?? null;

  // Expose quick review opener to parent via ref
  if (onQuickReviewRef) {
    onQuickReviewRef.current = () => { setQuickReviewIndex(0); setQuickReviewOpen(true); };
  }

  const [activeFilter, setActiveFilter] = useState(0);
  const [filterPills, setFilterPills] = useState<string[]>(["Retainer"]);

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-2 px-4 pt-4 sm:gap-4 sm:px-5">
        {/* Understanding + Quick review — mobile only */}
        <div className="flex items-center justify-between sm:hidden">
          <button type="button" onClick={() => onScoresRef?.current?.()} className="flex cursor-pointer items-center gap-1.5 py-2 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text">
            Understanding scores &amp; matches
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" /><path d="M6.5 6.5C6.5 5.67 7.17 5 8 5C8.83 5 9.5 5.67 9.5 6.5C9.5 7.17 9.01 7.73 8.37 7.93C8.16 8 8 8.17 8 8.39V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="8" cy="11" r="0.75" fill="currentColor" /></svg>
          </button>
          <button type="button" onClick={() => { setQuickReviewIndex(0); setQuickReviewOpen(true); }} className="flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.03] px-4 py-2 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.06] dark:bg-[rgba(224,224,224,0.03)]">
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.16422 1.70985e-10C9.7987 -1.85163e-05 12.3579 1.51488 14.0687 4.38875C14.415 4.97056 14.415 5.69604 14.0687 6.27785C12.3579 9.15171 9.79871 10.6666 7.16423 10.6667C4.52975 10.6667 1.97052 9.15178 0.259753 6.27792C-0.0865845 5.69611 -0.0865842 4.97063 0.259753 4.38882C1.97051 1.51495 4.52975 1.8518e-05 7.16422 1.70985e-10ZM4.83089 5.33333C4.83089 4.04467 5.87556 3 7.16423 3C8.45289 3 9.49756 4.04467 9.49756 5.33333C9.49756 6.622 8.45289 7.66667 7.16423 7.66667C5.87556 7.66667 4.83089 6.622 4.83089 5.33333Z" fill="currentColor"/></svg>
            Quick review
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Segmented tabs */}
          <ApplicationSegmentedTabs activeFilter={activeFilter} onSelect={setActiveFilter} />

          {/* Search + Filter */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-card-bg px-3 dark:border-transparent dark:bg-[rgba(224,224,224,0.03)] sm:w-[300px] sm:flex-none">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50">
                <path d="M11.333 11.333L14 14M2 7.333A5.333 5.333 0 1012.667 7.333 5.333 5.333 0 002 7.333z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/70"
              />
            </div>

            {/* Filter button with dropdown */}
            <FilterSelect
              filters={[
                { key: "type", icon: null, label: "Type", singleSelect: true, options: [{ value: "retainer", label: "Retainer" }, { value: "one-off", label: "One-off" }, { value: "affiliate", label: "Affiliate" }] },
                { key: "campaign", icon: null, label: "Campaign", options: [{ value: "caffeine-ai", label: "Caffeine AI" }, { value: "nfl-superbowl", label: "NFL Superbowl UGC" }] },
                { key: "platform", icon: null, label: "Platform", options: [{ value: "tiktok", label: "TikTok" }, { value: "instagram", label: "Instagram" }] },
              ]}
              activeFilters={filterPills.map((p) => ({ key: "type", values: [p.toLowerCase()] }))}
              onSelect={(key, value) => {
                const label = typeof value === "string" ? value.charAt(0).toUpperCase() + value.slice(1) : String(value);
                if (!filterPills.includes(label)) setFilterPills((prev) => [...prev, label]);
              }}
              onRemove={(key, value) => {
                const label = typeof value === "string" ? value.charAt(0).toUpperCase() + value.slice(1) : String(value);
                setFilterPills((prev) => prev.filter((p) => p !== label));
              }}
              searchPlaceholder="Filter..."
            >
              <div className={cn("flex cursor-pointer items-center gap-1 rounded-xl bg-foreground/[0.06] dark:bg-[rgba(224,224,224,0.03)]", filterPills.length > 0 ? "h-9 pl-2.5 pr-2.5" : "size-9 justify-center")}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-page-text" />
                </svg>
                {filterPills.length > 0 && (
                  <div className="flex size-3.5 items-center justify-center rounded-full bg-[#FB7185]">
                    <span className="font-inter text-[10px] font-semibold leading-none tracking-[-0.02em] text-white">{filterPills.length}</span>
                  </div>
                )}
              </div>
            </FilterSelect>
          </div>
        </div>

        {/* Active filter pills */}
        {filterPills.length > 0 && (
          <div className="flex items-center gap-2">
            {filterPills.map((pill) => (
              <div key={pill} className="flex h-6 items-center gap-1 rounded-lg bg-foreground/[0.06] py-2.5 pl-1.5 pr-2">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-foreground/70">
                  <path d="M2.5 0C2.77614 0 3 0.223858 3 0.5V1H6V0.5C6 0.223858 6.22386 0 6.5 0C6.77614 0 7 0.223858 7 0.5V1H7.5C8.32843 1 9 1.67157 9 2.5V3.5C9 3.77614 8.77614 4 8.5 4H1V8C1 8.27614 1.22386 8.5 1.5 8.5H3.5C3.77614 8.5 4 8.72386 4 9C4 9.27614 3.77614 9.5 3.5 9.5H1.5C0.671573 9.5 0 8.82843 0 8V2.5C0 1.67157 0.671573 1 1.5 1H2V0.5C2 0.223858 2.22386 0 2.5 0Z" fill="currentColor"/>
                  <path d="M7 6.1875C6.83363 6.1875 6.67299 6.21831 6.52449 6.27449L6.82322 6.57323C6.98071 6.73072 6.86917 7.00001 6.64645 7.00001H5.5C5.22386 7.00001 5 6.77615 5 6.50001V5.35356C5 5.13083 5.26929 5.01929 5.42678 5.17678L5.78001 5.53001C6.13675 5.31279 6.55634 5.1875 7 5.1875C8.05661 5.1875 8.94651 5.89571 9.22334 6.86234C9.29936 7.12781 9.14579 7.40465 8.88032 7.48068C8.61485 7.5567 8.33801 7.40313 8.26198 7.13766C8.10474 6.58859 7.59856 6.1875 7 6.1875Z" fill="currentColor"/>
                  <path d="M5.73802 7.86234C5.662 7.59687 5.38516 7.4433 5.11969 7.51932C4.85422 7.59535 4.70064 7.87219 4.77667 8.13766C5.0535 9.10429 5.9434 9.8125 7 9.8125C7.44377 9.8125 7.8634 9.68712 8.22 9.46999L8.57323 9.82322C8.73072 9.98071 9.00001 9.86917 9.00001 9.64645V8.5C9.00001 8.22386 8.77615 8 8.50001 8H7.35356C7.13083 8 7.01929 8.26929 7.17678 8.42678L7.47552 8.72551C7.32697 8.78172 7.16634 8.8125 7 8.8125C6.40145 8.8125 5.89527 8.41141 5.73802 7.86234Z" fill="currentColor"/>
                </svg>
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/70">{pill}</span>
                <button
                  type="button"
                  onClick={() => setFilterPills((prev) => prev.filter((p) => p !== pill))}
                  className="cursor-pointer"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.14" strokeLinecap="round" className="text-foreground/30" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-6 pt-4 sm:px-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APPLICATIONS.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onClick={() => setSelectedAppId(app.id)}
            />
          ))}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <ApplicationDetailsModal
          key={selectedApp.id}
          app={selectedApp}
          onClose={() => setSelectedAppId(null)}
        />
      )}

      {/* Quick Review Modal */}
      {quickReviewOpen && currentReviewApp && (
        <QuickReviewModal
          app={currentReviewApp}
          currentIndex={quickReviewIndex}
          totalCount={pendingApps.length}
          onClose={() => setQuickReviewOpen(false)}
          onAction={(action) => {
            // Move to next app after action
            if (quickReviewIndex < pendingApps.length - 1) {
              setQuickReviewIndex(quickReviewIndex + 1);
            } else {
              setQuickReviewOpen(false);
            }
          }}
          onSkip={() => {
            if (quickReviewIndex < pendingApps.length - 1) {
              setQuickReviewIndex(quickReviewIndex + 1);
            }
          }}
        />
      )}
    </>
  );
}

export default function ApplicationsPage() {
  return (
    <div>
      {/* Top nav */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
          Applications
        </span>
      </div>
      <ApplicationsContent />
    </div>
  );
}
