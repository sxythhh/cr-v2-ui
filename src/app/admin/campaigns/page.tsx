// @ts-nocheck
"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";
import { FilterIcon } from "@/components/submissions";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { AuditLogSheet } from "@/components/admin/audit-log-sheet";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { ScissorsIcon } from "@/components/sidebar/icons/scissors";
import { MusicNoteIcon } from "@/components/sidebar/icons/music-note";
import { GamepadIcon } from "@/components/sidebar/icons/gamepad";
import { PersonIcon } from "@/components/sidebar/icons/person";
import { UsersIcon } from "@/components/sidebar/icons/users";
import { VideoLibraryIcon } from "@/components/sidebar/icons/video-library";
import { CentralIcon } from "@central-icons-react/all";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ci = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

// ── Types (matching brand campaigns page) ────────────────────────────

type CampaignStatus = "active" | "paused" | "completed" | "suspended" | "archived";

interface Campaign {
  id: number;
  title: string;
  thumbnail: string;
  status: CampaignStatus;
  type: string;
  typeIcon: "scissors" | "music" | "swords";
  platforms: ("tiktok" | "instagram")[];
  category: string;
  categoryIcon: "user" | "swords" | "music";
  creators: string;
  videos: number;
  cpmRate: string;
  cpmUnit: string;
  joinedDate: string;
  progress?: number;
  earned?: string;
  pending?: string;
  videosSubmitted?: string;
  views?: string;
  brandName?: string;
  brandAvatar?: string;
  description?: string;
}

// ── Mock Data ────────────────────────────────────────────────────────

const CAMPAIGNS: Campaign[] = [
  { id: 1, title: "Harry Styles Podcast x Shania Twain Clipping [7434]", thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", status: "active", type: "Clipping", typeIcon: "scissors", platforms: ["tiktok", "instagram"], category: "Personal brand", categoryIcon: "user", creators: "121K", videos: 31, cpmRate: "$0.50", cpmUnit: "1K", joinedDate: "Tue 3 Mar, 2026", progress: 45, description: "Music podcast clipping campaign" },
  { id: 2, title: "Call of Duty BO7 Official Clipping Campaign", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop", status: "active", type: "Clipping", typeIcon: "scissors", platforms: ["tiktok", "instagram"], category: "Gaming", categoryIcon: "swords", creators: "89K", videos: 4560, cpmRate: "$4.50", cpmUnit: "1K", joinedDate: "Mon 1 Sep, 2025", progress: 78, description: "High-volume gaming content clipping" },
  { id: 3, title: "GYMSHARK Clipping", thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop", status: "active", type: "Clipping", typeIcon: "scissors", platforms: ["tiktok", "instagram"], category: "Personal brand", categoryIcon: "user", creators: "67K", videos: 2520, cpmRate: "$5.50", cpmUnit: "1K", joinedDate: "Fri 5 Dec, 2025", progress: 60, description: "Fitness content clipping program" },
  { id: 4, title: "NovaPay Wallet Clipping", thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop", status: "paused", type: "Clipping", typeIcon: "scissors", platforms: ["tiktok", "instagram"], category: "Personal brand", categoryIcon: "user", creators: "156K", videos: 1024, cpmRate: "$6.00", cpmUnit: "1K", joinedDate: "Thu 20 Nov, 2025", earned: "$38,500", pending: "$0", videosSubmitted: "1,024", views: "45.8M", description: "Fintech awareness — paused for budget review" },
  { id: 5, title: "Kane Brown Clipping", thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop", status: "completed", type: "Clipping", typeIcon: "music", platforms: ["tiktok"], category: "Music", categoryIcon: "music", creators: "34K", videos: 2381, cpmRate: "$7.00", cpmUnit: "1K", joinedDate: "Fri 10 Oct, 2025", brandName: "Some Society", brandAvatar: "https://i.pravatar.cc/32?u=kanebrown", earned: "$20,000", pending: "$0", videosSubmitted: "2,381", views: "18.9M", description: "Music promotion — completed" },
  { id: 6, title: "Diary of a CEO Clipping", thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop", status: "suspended", type: "Clipping", typeIcon: "scissors", platforms: ["tiktok"], category: "Personal brand", categoryIcon: "user", creators: "42K", videos: 3261, cpmRate: "$6.50", cpmUnit: "1K", joinedDate: "Fri 15 Aug, 2025", earned: "$18,500", pending: "$0", videosSubmitted: "3,261", views: "28.5M", description: "Podcast clipping — suspended for copyright" },
  { id: 7, title: "Polymarket Clipping Campaign", thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop", status: "active", type: "Clipping", typeIcon: "scissors", platforms: ["tiktok", "instagram"], category: "Personal brand", categoryIcon: "user", creators: "67K", videos: 2520, cpmRate: "$5.50", cpmUnit: "1K", joinedDate: "Thu 5 Dec, 2025", progress: 60, description: "Prediction market awareness" },
];

// ── Helpers ──────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: "scissors" | "music" | "swords" }) {
  switch (type) {
    case "scissors": return <ScissorsIcon className="size-3 text-page-text" />;
    case "music": return <MusicNoteIcon className="size-3 text-page-text" />;
    case "swords": return <GamepadIcon className="size-3 text-page-text" />;
  }
}

function CategoryIcon({ type }: { type: "user" | "swords" | "music" }) {
  switch (type) {
    case "user": return <PersonIcon className="size-3 text-page-text" />;
    case "swords": return <GamepadIcon className="size-3 text-page-text" />;
    case "music": return <MusicNoteIcon className="size-3 text-page-text" />;
  }
}

const STATUS_COLORS: Record<CampaignStatus, { bg: string; text: string; dot: string }> = {
  active: { bg: "rgba(52,211,153,0.08)", text: "#34D399", dot: "#34D399" },
  paused: { bg: "rgba(255,255,255,0.06)", text: "var(--page-text-muted)", dot: "#9CA3AF" },
  completed: { bg: "rgba(96,165,250,0.08)", text: "#60A5FA", dot: "#60A5FA" },
  archived: { bg: "rgba(255,255,255,0.04)", text: "var(--page-text-subtle)", dot: "#6B7280" },
  suspended: { bg: "rgba(255,37,37,0.08)", text: "#FF2525", dot: "#FF2525" },
};

// ── Filters + Tabs ───────────────────────────────────────────────────

const CAMPAIGN_FILTERS: Filter[] = [
  { key: "type", icon: null, label: "Type", singleSelect: true, options: [{ value: "Clipping", label: "Clipping" }, { value: "UGC", label: "UGC" }] },
];

const TAB_FILTERS: (CampaignStatus | null)[] = [null, "active", "paused", "completed", "suspended"];

// ── Active Campaign Card (exact copy from brand page) ────────────────

function ActiveCampaignCard({ campaign, onClick }: { campaign: Campaign; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group relative flex flex-col md:h-[185px] md:flex-row cursor-pointer items-stretch md:items-center gap-0 md:gap-4 rounded-[20px] border border-[rgba(37,37,37,0.06)] bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),#FFFFFF] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-foreground/[0.03] dark:bg-foreground/[0.03] before:pointer-events-none before:absolute before:inset-0 before:rounded-[20px] before:bg-foreground/0 before:transition-colors before:duration-200 hover:before:bg-foreground/[0.03]">
      <div className="flex min-w-0 flex-1 flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-4 md:self-stretch md:pr-4">
        {/* Thumbnail */}
        <div className="relative shrink-0 md:self-stretch p-1">
          <img src={campaign.thumbnail} alt="" className="h-[160px] md:h-full w-full md:w-[240px] lg:w-[307px] rounded-[18px] object-cover" />
          <div className="absolute left-4 top-4 z-[1] flex items-center justify-center gap-[1px] rounded-full bg-blue-500/40 px-2.5 py-2 backdrop-blur-[8px]">
            <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#DBEAFE]">{campaign.cpmRate}/{campaign.cpmUnit}</span>
          </div>
        </div>
        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 self-stretch px-4 py-3 md:px-0 md:py-4">
          <div className="flex items-start gap-1">
            <div className="flex items-center gap-1.5 rounded-full bg-[rgba(52,211,153,0.08)] px-2 py-1.5">
              <div className="size-1.5 rounded-full bg-[#34D399]" />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#34D399]">Active</span>
            </div>
          </div>
          <h3 className="truncate font-inter text-base leading-normal font-semibold tracking-[-0.02em] text-page-text md:text-sm lg:text-base">{campaign.title}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <TypeIcon type={campaign.typeIcon} />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{campaign.type}</span>
            </div>
            <span className="font-inter text-xs text-foreground/20">·</span>
            <div className="flex items-center gap-1">
              {campaign.platforms.map((p) => (
                <div key={p} className="flex size-6 items-center justify-center rounded-full bg-foreground/[0.06] backdrop-blur-[12px] dark:border dark:border-foreground/[0.03] dark:bg-foreground/[0.03]">
                  <PlatformIcon platform={p} size={12} />
                </div>
              ))}
              <div className="flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-2 pr-2.5 backdrop-blur-[12px] dark:border dark:border-foreground/[0.03] dark:bg-foreground/[0.03]">
                <CategoryIcon type={campaign.categoryIcon} />
                <span className="whitespace-nowrap font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{campaign.category}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#34D399]">{campaign.progress}%</span>
            <div className="relative h-1 w-full rounded-full bg-foreground/[0.06]">
              <div className="absolute inset-y-0 left-0 rounded-full bg-[#34D399]" style={{ width: `${campaign.progress}%` }} />
            </div>
          </div>
        </div>
      </div>
      {/* Right stats */}
      <div className="flex min-w-0 flex-col items-start gap-3 self-stretch px-4 pb-4 md:items-end md:p-4 md:pl-0">
        <div className="flex flex-1 flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap items-start gap-1">
            <div className="flex h-6 items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 dark:border-foreground/[0.03] dark:bg-foreground/[0.03]">
              <UsersIcon className="size-3 text-page-text" />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{campaign.creators}</span>
            </div>
            <div className="flex h-6 items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2.5 dark:border-foreground/[0.03] dark:bg-foreground/[0.03]">
              <VideoLibraryIcon className="size-3 text-page-text" />
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{campaign.videos}</span>
            </div>
            <div className="flex h-6 items-center gap-[1px] rounded-full bg-blue-500/[0.12] px-2.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-blue-500">{campaign.cpmRate}</span>
              <span className="font-inter text-xs tracking-[-0.02em] text-blue-500/70">/</span>
              <span className="font-inter text-xs tracking-[-0.02em] text-blue-500/70">{campaign.cpmUnit}</span>
            </div>
          </div>
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text/50">Joined on {campaign.joinedDate}</span>
        </div>
      </div>
    </div>
  );
}

// ── Detail Campaign Card (paused/completed/suspended) ────────────────

function DetailCampaignCard({ campaign, onClick }: { campaign: Campaign; onClick: () => void }) {
  const isPaused = campaign.status === "paused";
  const isCompleted = campaign.status === "completed" || campaign.status === "archived";
  const isSuspended = campaign.status === "suspended";

  return (
    <div onClick={onClick} className={`group relative flex flex-col md:h-[189px] md:flex-row cursor-pointer items-stretch md:items-center gap-0 md:gap-4 rounded-[20px] border border-[rgba(37,37,37,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.03)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[20px] before:bg-foreground/0 before:transition-colors before:duration-200 hover:before:bg-foreground/[0.03] dark:border-foreground/[0.06] ${isCompleted ? "bg-white opacity-70 dark:bg-card-bg" : isSuspended ? "bg-white dark:bg-card-bg" : "bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),#FFFFFF] dark:bg-[linear-gradient(86.46deg,rgba(255,255,255,0)_87.34%,rgba(0,178,110,0.07)_100%),var(--card-bg)]"}`}>
      <div className="flex min-w-0 flex-1 flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-4 md:self-stretch md:pr-4">
        <div className="relative shrink-0 md:self-stretch p-1">
          <img src={campaign.thumbnail} alt="" className="h-[160px] md:h-full w-full md:w-[240px] lg:w-[307px] rounded-[18px] object-cover" />
          <div className="absolute left-4 top-4 z-[1] flex items-center justify-center gap-[1px] rounded-full bg-blue-500/40 px-2.5 py-2 backdrop-blur-[8px]">
            <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#DBEAFE]">{campaign.cpmRate}/{campaign.cpmUnit}</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col self-stretch px-4 py-3 md:px-0 md:py-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              {isPaused && <div className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2 py-1.5"><div className="size-1.5 rounded-full bg-page-text/70" /><span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text/70">Paused</span></div>}
              {isCompleted && <div className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2 py-1.5"><div className="size-1.5 rounded-full bg-page-text/50" /><span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text/50">Completed</span></div>}
              {isSuspended && <div className="flex items-center gap-1.5 rounded-full bg-[rgba(255,37,37,0.08)] px-2 py-1.5"><div className="size-1.5 rounded-full bg-[#FF2525]" /><span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#FF2525]">Suspended</span></div>}
            </div>
            <h3 className="truncate font-inter text-sm font-medium leading-normal tracking-[-0.02em] text-page-text">{campaign.title}</h3>
          </div>
          <div className="mt-auto flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <div className="flex h-6 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-2 pr-2.5">
                  <UsersIcon className="size-3 text-page-text" />
                  <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{campaign.creators}</span>
                </div>
                <div className="flex h-6 items-center gap-[1px] rounded-full bg-blue-500/[0.12] px-2.5">
                  <span className="font-inter text-xs font-medium tracking-[-0.02em] text-blue-500">{campaign.cpmRate}</span>
                  <span className="font-inter text-xs tracking-[-0.02em] text-blue-500/70">/</span>
                  <span className="font-inter text-xs tracking-[-0.02em] text-blue-500/70">{campaign.cpmUnit}</span>
                </div>
              </div>
              <span className="font-inter text-xs text-foreground/20">·</span>
              <div className="flex items-center gap-1">
                {campaign.platforms.map((p) => (
                  <div key={p} className="flex size-6 items-center justify-center rounded-full bg-foreground/[0.06] backdrop-blur-[12px]">
                    <PlatformIcon platform={p} size={12} />
                  </div>
                ))}
              </div>
            </div>
            {(campaign.earned || campaign.views) && (
              <div className="flex gap-2">
                {[
                  { value: campaign.earned, label: "Earned" },
                  { value: campaign.pending, label: "Pending", highlight: campaign.pending && campaign.pending !== "$0" },
                  { value: campaign.videosSubmitted, label: "Videos" },
                  { value: campaign.views, label: "Views" },
                ].filter((s) => s.value).map((stat) => (
                  <div key={stat.label} className={cn("flex min-w-0 flex-1 flex-col justify-center gap-1 overflow-hidden rounded-xl border border-[rgba(37,37,37,0.06)] px-2.5 py-2 dark:border-foreground/[0.03] dark:bg-foreground/[0.03]", stat.highlight ? "bg-[rgba(255,144,37,0.1)]" : "bg-white dark:bg-transparent")}>
                    <span className={cn("truncate font-inter text-sm font-medium tracking-[-0.02em]", stat.highlight ? "text-[#FF9025]" : "text-page-text")}>{stat.value}</span>
                    <span className="truncate font-inter text-[11px] tracking-[-0.02em] text-page-text/50">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:flex self-stretch py-4"><div className="w-px bg-[rgba(37,37,37,0.06)] dark:bg-foreground/[0.06]" /></div>
      <div className="flex min-w-0 flex-col items-start justify-end gap-3 self-stretch px-4 pb-4 md:items-end md:p-4 md:pl-0">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text/50">Joined on {campaign.joinedDate}</span>
      </div>
    </div>
  );
}

// ── Campaign Detail Modal ────────────────────────────────────────────

function CampaignDetailModal({ campaign, open, onClose, onStatusChange }: {
  campaign: Campaign; open: boolean; onClose: () => void;
  onStatusChange: (id: number, status: CampaignStatus) => void;
}) {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <>
      <Modal open={open} onClose={onClose} size="lg">
        <ModalHeader>
          <div className="flex items-center gap-3">
            <img src={campaign.thumbnail} alt="" className="size-12 rounded-xl object-cover" />
            <div>
              <h2 className="font-inter text-base font-semibold tracking-[-0.02em] text-page-text">{campaign.title}</h2>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs tracking-[-0.02em] text-page-text-muted">
                {campaign.type} · {campaign.platforms.join(", ")} · {campaign.category}
              </div>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-5">
          {campaign.description && <p className="text-sm leading-relaxed tracking-[-0.02em] text-page-text-muted">{campaign.description}</p>}

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-page-text-muted">Status</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center gap-1.5" style={{ background: "none", border: "none" }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize" style={{ background: STATUS_COLORS[campaign.status].bg, color: STATUS_COLORS[campaign.status].text }}>
                    <span className="size-1.5 rounded-full" style={{ background: STATUS_COLORS[campaign.status].dot }} />
                    {campaign.status}
                  </span>
                  <CentralIcon name="IconChevronBottom" size={10} color="var(--page-text-muted)" {...ci} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px] rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-[10px]">
                {(["active", "paused", "completed", "archived"] as CampaignStatus[]).map((s) => (
                  <DropdownMenuItem key={s} onClick={() => { onStatusChange(campaign.id, s); toast(`Status → ${s}`); }} className="cursor-pointer gap-2 rounded-lg px-3 py-1.5 text-sm font-medium capitalize">
                    <span className="size-2 rounded-full" style={{ background: STATUS_COLORS[s].dot }} />
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Creators", value: campaign.creators },
              { label: "Videos", value: campaign.videos },
              { label: "CPM", value: `${campaign.cpmRate}/${campaign.cpmUnit}` },
              { label: "Views", value: campaign.views ?? "—" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-foreground/[0.02] p-3">
                <div className="text-[11px] text-page-text-muted">{s.label}</div>
                <div className="mt-0.5 text-sm font-semibold tracking-[-0.02em] text-page-text">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="space-y-2">
            {[
              { label: "Platforms", value: campaign.platforms.join(", ") },
              { label: "Joined", value: campaign.joinedDate },
              { label: "Type", value: campaign.type },
              { label: "Category", value: campaign.category },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <span className="text-page-text-muted">{r.label}</span>
                <span className="tracking-[-0.02em] text-page-text">{r.value}</span>
              </div>
            ))}
          </div>
        </ModalBody>

        <ModalFooter>
          <button onClick={() => setAuditOpen(true)} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-4 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6.25" /><path d="M8 5v3.5l2.5 1.5" /></svg>
            Audit Log
          </button>
          <button onClick={() => toast("Campaign flagged")} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#E9A23B]/10 px-4 text-sm font-medium tracking-[-0.02em] text-[#E9A23B] transition-colors hover:bg-[#E9A23B]/20">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 10V3.5c0-.3.2-.5.4-.6C5.5 1.8 7.5 3.8 10.5 3.2c.5-.1 1 .3 1 .8v6c0 .3-.2.5-.4.6C8.5 11.8 6.2 9.5 2.5 10zM2.5 10v4" /></svg>
            Flag
          </button>
          {campaign.status !== "suspended" && (
            <button onClick={async () => {
              const ok = await confirm({ title: "Suspend campaign?", message: "Creators will no longer be able to submit.", destructive: true, confirmLabel: "Suspend" });
              if (ok) { onStatusChange(campaign.id, "suspended"); toast("Campaign suspended"); onClose(); }
            }} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#FF2525]/10 px-4 text-sm font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[#FF2525]/20">
              Suspend
            </button>
          )}
        </ModalFooter>
      </Modal>

      <AuditLogSheet open={auditOpen} onClose={() => setAuditOpen(false)} entityType="campaign" entityId={String(campaign.id)} entityTitle={campaign.title} />
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function AdminCampaignsPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const statusFilter = TAB_FILTERS[tabIndex];
  const filtered = statusFilter ? campaigns.filter((c) => c.status === statusFilter) : campaigns;
  const selected = campaigns.find((c) => c.id === selectedId);

  const handleStatusChange = useCallback((id: number, status: CampaignStatus) => {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
  }, []);

  const tabCounts = TAB_FILTERS.map((f) => f === null ? campaigns.length : campaigns.filter((c) => c.status === f).length);

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--bg)" }}>
      {/* Tabs + search */}
      <div className="overflow-x-auto scrollbar-hide px-4 pt-3 pb-3 sm:px-6 md:hidden">
        <Tabs selectedIndex={tabIndex} onSelect={setTabIndex} className="w-max">
          {["All", "Active", "Paused", "Completed", "Suspended"].map((label, i) => (
            <TabItem key={label} label={label} count={tabCounts[i]} index={i} />
          ))}
        </Tabs>
      </div>
      <div className="hidden px-4 pt-[21px] pb-3 sm:px-6 md:flex md:items-center md:justify-between md:gap-2">
        <Tabs selectedIndex={tabIndex} onSelect={setTabIndex} className="w-fit">
          {["All", "Active", "Paused", "Completed", "Suspended"].map((label, i) => (
            <TabItem key={label} label={label} count={tabCounts[i]} index={i} />
          ))}
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 dark:bg-[rgba(224,224,224,0.03)] md:w-[300px] md:flex-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50">
              <path d="M11.333 11.333L14 14M2 7.333A5.333 5.333 0 1012.667 7.333 5.333 5.333 0 002 7.333z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/70" />
          </div>
          <FilterSelect filters={CAMPAIGN_FILTERS} activeFilters={[]} onSelect={() => {}} onRemove={() => {}} searchPlaceholder="Filter...">
            <button className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
              <FilterIcon />
            </button>
          </FilterSelect>
        </div>
      </div>

      {/* Campaign cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-5" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-sm text-page-text-muted">No campaigns match your filters</div>
          ) : (
            filtered.map((c) =>
              c.status === "active" ? (
                <ActiveCampaignCard key={c.id} campaign={c} onClick={() => setSelectedId(c.id)} />
              ) : (
                <DetailCampaignCard key={c.id} campaign={c} onClick={() => setSelectedId(c.id)} />
              )
            )
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <CampaignDetailModal
          campaign={selected}
          open={!!selectedId}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
