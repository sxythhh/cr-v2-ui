"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/verified-badge";
import { PageShell } from "@/components/page-shell";

/* ─── Icons ─── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 11.5L14 14M7.333 13a5.667 5.667 0 1 0 0-11.333 5.667 5.667 0 0 0 0 11.333Z" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 0C4.343 0 3 1.343 3 3s1.343 3 3 3 3-1.343 3-3S7.657 0 6 0ZM6 7c-2.761 0-5 1.79-5 4v1h10v-1c0-2.21-2.239-4-5-4Z" fill="currentColor" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M10.5 1.5v7M10.5 5H4.5a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h1l.5 2.5h1L7.5 9M10.5 5c1.105 0 2-.672 2-1.5S11.605 2 10.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 12A6 6 0 1 0 6 0a6 6 0 0 0 0 12ZM4.172 4.172a.5.5 0 0 1 .707 0L6 5.293l1.121-1.121a.5.5 0 0 1 .707.707L6.707 6l1.121 1.121a.5.5 0 0 1-.707.707L6 6.707 4.879 7.828a.5.5 0 0 1-.707-.707L5.293 6 4.172 4.879a.5.5 0 0 1 0-.707Z" fill="currentColor" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.333l1.947 3.947 4.386.64-3.173 3.093.747 4.36L8 11.373l-3.907 2-0.747-4.36L.173 5.92l4.387-.64L8 1.333Z" fill="#FACC15" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M9 6.5v3a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1H5.5M7.5 1.5h3v3M5 7l5.5-5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M5 12l6 6" /><path d="M5 12l6-6" />
    </svg>
  );
}

function ChevronLeftSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Shared styles ─── */
const cardCls = "overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg";
const pillCls = "flex items-center justify-center gap-1 rounded-full bg-white/20 px-[6px] py-[10px] text-xs font-medium tracking-[-0.02em] text-white backdrop-blur-xl";

/* ─── Mock data ─── */
const AGENCIES = [
  { id: "billbord", name: "billbord", logo: "/icons/agency1.avif", cover: "/creator-home/campaign-thumb-1.png", coverGradient: false, badge: "Premium Partner", creators: "503", campaigns: "21", views: "1.5B+", avgCpm: "$0.06", totalPaid: "$91,827", accepting: false },
  { id: "clipfarm", name: "Clip Farm", logo: "/icons/agency2.avif", cover: null, coverGradient: true, badge: "Premium Partner", creators: "8,253", campaigns: "40", views: "1.4B+", avgCpm: "$0.17", totalPaid: "$226,908", accepting: false },
  { id: "paidinclips", name: "Paid In Clips Open V2", logo: "/icons/agency3.avif", cover: "/creator-home/campaign-thumb-3.png", coverGradient: false, badge: "Verified Partner", creators: "367", campaigns: "20", views: "1.2B+", avgCpm: "$0.05", totalPaid: "$58,989", accepting: false },
];

const AGENCY_DETAIL = {
  name: "billbord",
  logo: "/icons/agency1.avif",
  cover: "/creator-home/campaign-thumb-1.png",
  badge: "Premium Partner",
  rating: 5,
  reviewCount: 356,
  about: "billbord has built its reputation as the go-to agency for logo placement campaigns on Content Rewards. With 21 campaigns delivered and $91,827 paid out to creators, they consistently deliver massive reach at an efficient $0.06 CPM. Their team focuses exclusively on logo campaigns, giving them deep expertise in brand visibility and placement optimization that generalist agencies simply cannot match.",
  budget: "$4,000",
  budgetUsed: "$2,972 used",
  creators: "529",
  creatorsStatus: "Approved",
  totalSubmissions: "750",
  startingAt: "$1,500/mo",
  minBudget: "$10,000",
  campaigns: [
    { name: "Harry Styles Podcast x Shania Twain Clipping [7434]", brand: "Sound Network", brandLogo: "/creator-home/brand-logo-1.png", thumb: "/creator-home/campaign-thumb-1.png", time: "2h", platforms: ["tiktok", "instagram"], category: "Personal brand", members: "121.4K", cpm: "$1.50/1k", earned: "$8,677", total: "$37,500", progress: 27 },
    { name: "Call of Duty BO7 Official Clipping Campaign", brand: "Clipping Culture", brandLogo: "/creator-home/brand-logo-2.png", thumb: "/creator-home/campaign-thumb-2.png", time: "2d", platforms: ["tiktok", "instagram"], category: "Gaming", members: "121.4K", cpm: "$1.50/1k", earned: "$8,677", total: "$37,500", progress: 27 },
    { name: "Mumford & Sons | Prizefighter Clipping", brand: "Scene Society", brandLogo: "/creator-home/brand-logo-3.png", thumb: "/creator-home/campaign-thumb-3.png", time: "5d", platforms: ["tiktok", "instagram", "youtube"], category: "Music", members: "121.4K", cpm: "$1.50/1k", earned: "$8,677", total: "$37,500", progress: 27 },
  ],
};

/* ─── Filter button ─── */
function FilterButton({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-full bg-foreground/[0.06] px-3.5 py-3 text-sm tracking-[-0.02em] text-page-text dark:bg-white/[0.06]">
      {label}
      <ChevronDownIcon />
    </button>
  );
}

/* ─── Stat mini card ─── */
function StatMini({ value, label, valueSuffix, valueColor }: { value: string; label: string; valueSuffix?: string; valueColor?: string }) {
  return (
    <div className={cn(cardCls, "flex flex-1 flex-col justify-center gap-2 p-3")}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium tracking-[-0.02em]" style={{ color: valueColor || "var(--page-text)" }}>{value}</span>
        {valueSuffix && <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">{valueSuffix}</span>}
      </div>
      <span className="text-xs tracking-[-0.02em] text-page-text-subtle">{label}</span>
    </div>
  );
}

/* ─── Agency card ─── */
function AgencyCard({ agency, onClick, onBookCall }: { agency: typeof AGENCIES[number]; onClick: () => void; onBookCall: () => void }) {
  return (
    <div className={cn(cardCls, "flex cursor-pointer flex-col transition-shadow hover:shadow-md")} onClick={onClick}>
      {/* Cover */}
      <div className="p-1 pb-0">
        <div
          className="relative h-[136px] w-full rounded-xl bg-cover bg-center"
          style={{
            backgroundImage: agency.coverGradient
              ? "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%), linear-gradient(180deg, #FF9025 0%, #FF5100 100%)"
              : `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%), url(${agency.cover})`,
          }}
        >
          {/* Pills */}
          <div className="absolute left-4 top-4 flex items-center gap-1">
            <div className={pillCls}>
              <PersonIcon />
              <span>{agency.creators}</span>
            </div>
            <div className={pillCls}>
              <MegaphoneIcon />
              <span>{agency.campaigns}</span>
            </div>
          </div>
          <div className="absolute right-4 top-4">
            <div className={cn(pillCls, "gap-1 px-2")}>
              <VerifiedBadge size={12} />
              <span>{agency.badge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logo + name row */}
      <div className="flex items-center gap-3 px-4 py-0">
        <div className="relative -mt-2">
          <img src={agency.logo} alt="" className="size-12 rounded-[10px] border-2 border-white object-cover dark:border-card-bg" />
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-base font-medium tracking-[-0.02em] text-page-text">{agency.name}</span>
            <VerifiedBadge size={12} />
          </div>
          <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">{agency.totalPaid}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4 pt-3">
        <div className={cn(cardCls, "flex items-center justify-center gap-3 p-3")}>
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{agency.views}</span>
            <span className="text-xs tracking-[-0.02em] text-page-text-subtle">Views</span>
          </div>
          <div className="h-[37px] w-px bg-foreground/[0.06] dark:bg-white/[0.06]" />
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{agency.creators}</span>
            <span className="text-xs tracking-[-0.02em] text-page-text-subtle">Creators</span>
          </div>
          <div className="h-[37px] w-px bg-foreground/[0.06] dark:bg-white/[0.06]" />
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{agency.avgCpm}</span>
            <span className="text-xs tracking-[-0.02em] text-page-text-subtle">Avg. CPM</span>
          </div>
        </div>

        {/* Status + CTA */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-1 rounded-full bg-[rgba(255,51,85,0.08)] px-2 py-2">
            <XCircleIcon />
            <span className="text-xs font-medium tracking-[-0.02em] text-[#FF3355]">Not accepting</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onBookCall(); }} className="rounded-full bg-page-text px-3 py-2 text-xs font-medium tracking-[-0.02em] text-white dark:bg-white dark:text-[#151515]">
            Book a call
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Campaign card ─── */
function CampaignCard({ campaign }: { campaign: typeof AGENCY_DETAIL.campaigns[number] }) {
  return (
    <div className={cn(cardCls, "flex w-[320px] shrink-0 flex-col")}>
      {/* Thumbnail */}
      <div className="p-1 pb-0">
        <div
          className="relative h-[184px] w-full rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 29.62%), url(${campaign.thumb})` }}
        >
          <div className="flex items-start justify-end gap-1 p-3">
            {campaign.platforms.map((p) => (
              <div key={p} className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl">
                {p === "tiktok" && <svg width="12" height="12" viewBox="0 0 15 17" fill="none"><path d="M14.528 6.845c-1.483 0-2.856-.472-3.977-1.272v5.821c0 2.912-2.362 5.273-5.276 5.273a5.26 5.26 0 0 1-2.937-.892A5.273 5.273 0 0 1 0 11.394c0-2.912 2.362-5.273 5.276-5.273.242 0 .484.017.724.05v2.916a2.425 2.425 0 0 0-.733-.113 2.413 2.413 0 0 0-2.413 2.413 2.42 2.42 0 0 0 1.327 2.154c.327.165.696.257 1.086.257 1.33 0 2.409-1.075 2.413-2.404V0h2.871v.367c.01.11.025.219.044.328a4.416 4.416 0 0 0 1.822 2.694c.633.395 1.365.604 2.112.603v2.853Z" fill="white" /></svg>}
                {p === "instagram" && <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><path d="M6.333 1.141c1.691 0 1.891.007 2.56.037.4.005.8.079 1.175.218.275.102.524.264.728.474.21.204.372.453.474.728.14.377.213.774.218 1.176.03.675.037.876.037 2.566s-.006 1.891-.037 2.56a3.6 3.6 0 0 1-.218 1.175 2.16 2.16 0 0 1-.474.728 2.16 2.16 0 0 1-.728.474c-.377.14-.774.213-1.176.218-.675.03-.876.037-2.559.037s-1.891-.006-2.56-.037a3.6 3.6 0 0 1-1.175-.218 2.16 2.16 0 0 1-.728-.474 2.16 2.16 0 0 1-.474-.728 3.6 3.6 0 0 1-.218-1.176c-.03-.675-.037-.876-.037-2.559s.007-1.891.037-2.56c.005-.4.079-.8.218-1.175.102-.275.264-.524.474-.728a2.16 2.16 0 0 1 .728-.474c.377-.14.774-.213 1.176-.218.675-.03.876-.037 2.559-.037Z" fill="white" /></svg>}
                {p === "youtube" && <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M15.32 4.06a2.013 2.013 0 0 0-1.415-1.425C12.728 2.28 8 2.28 8 2.28s-4.728 0-5.905.355A2.013 2.013 0 0 0 .68 4.06 21.002 21.002 0 0 0 .325 8c-.019 1.33.1 2.658.355 3.94a2.013 2.013 0 0 0 1.415 1.425c1.177.355 5.905.355 5.905.355s4.728 0 5.905-.355a2.013 2.013 0 0 0 1.415-1.425c.255-1.282.374-2.61.355-3.94a21 21 0 0 0-.355-3.94ZM6.5 10.5v-5l4 2.5-4 2.5Z" fill="white" /></svg>}
              </div>
            ))}
            <div className={cn(pillCls, "h-6 gap-1 px-2")}>
              <span>{campaign.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-3">
        {/* Brand row */}
        <div className="flex items-center gap-1.5">
          <img src={campaign.brandLogo} alt="" className="size-4 rounded-full border border-foreground/[0.06]" />
          <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{campaign.brand}</span>
          <VerifiedBadge size={12} />
          <span className="text-xs font-medium tracking-[-0.02em] text-foreground/20">·</span>
          <span className="text-xs tracking-[-0.02em] text-page-text-subtle">{campaign.time}</span>
        </div>

        {/* Name */}
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.name}</span>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-2">
              <PersonIcon />
              <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{campaign.members}</span>
            </div>
            <div className="flex items-center gap-[1px] rounded-full border border-foreground/[0.06] px-2 py-2">
              <span className="text-xs font-medium tracking-[-0.02em] text-[#1A67E5]">{campaign.cpm}</span>
            </div>
          </div>
          <div className="flex items-center gap-[1px] text-xs">
            <span className="font-medium text-page-text">{campaign.earned}</span>
            <span className="text-page-text-muted">/</span>
            <span className="text-page-text-muted">{campaign.total}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full rounded-full bg-foreground/[0.06]">
          <div className="h-1 rounded-full bg-page-text" style={{ width: `${campaign.progress}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Radio circle ─── */
function RadioCircle({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <div className="relative size-4 shrink-0 rounded-full border border-page-text shadow-[inset_0px_2px_6px_rgba(255,255,255,0.04)]">
        <div className="absolute left-1/2 top-1/2 size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-[3.125px] bg-black shadow-[0px_0px_4px_rgba(255,255,255,0.25)]" />
      </div>
    );
  }
  return <div className="size-4 shrink-0 rounded-full border border-foreground/[0.24] bg-white shadow-[inset_0px_2px_6px_rgba(255,255,255,0.04)] dark:bg-card-bg" />;
}

/* ─── Date/time selection circle ─── */
function SelectCircle({ selected }: { selected: boolean }) {
  if (selected) {
    return (
      <div className="relative size-4 shrink-0">
        <div className="size-4 rounded-full bg-[#FF9025] shadow-[0px_-0.8px_2.4px_rgba(0,0,0,0.06),0px_1.6px_1.6px_#FFFFFF,0px_1.6px_1.6px_#FFFFFF,inset_0px_0.4px_1.6px_rgba(0,0,0,0.12)]" />
        <div className="absolute inset-0 rounded-full border-[0.8px] border-foreground/10" />
      </div>
    );
  }
  return <div className="size-4 shrink-0 rounded-full border-[0.8px] border-foreground/10 bg-white shadow-[0px_-0.8px_2.4px_rgba(0,0,0,0.06),0px_1.6px_1.6px_#FFFFFF,0px_1.6px_1.6px_#FFFFFF,inset_0px_0.4px_1.6px_rgba(0,0,0,0.12)]" />;
}

/* ─── Book a call modal data ─── */
const DATES = [
  { day: "Wed", date: "Apr. 8" },
  { day: "Thu", date: "Apr. 9" },
  { day: "Fri", date: "Apr. 10" },
  { day: "Mon", date: "Apr. 13" },
  { day: "Tue", date: "Apr. 14" },
  { day: "Wed", date: "Apr. 15" },
  { day: "Thu", date: "Apr. 16" },
  { day: "Fri", date: "Apr. 17" },
];

const TIMES = [
  { label: "9:00 AM", disabled: false },
  { label: "10:00 AM", disabled: false },
  { label: "11:00 AM", disabled: false },
  { label: "1:00 PM", disabled: false },
  { label: "2:00 PM", disabled: false },
  { label: "3:00 PM", disabled: false },
  { label: "4:00 PM", disabled: true },
  { label: "5:00 PM", disabled: true },
  { label: "6:00 PM", disabled: false },
];

/* ─── Book a call panel ─── */
function BookCallPanel({ agencyName, agencyLogo, onClose }: { agencyName: string; agencyLogo: string; onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState(1); // Thu Apr 9
  const [selectedTime, setSelectedTime] = useState(2); // 11:00 AM

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="relative flex w-full flex-col bg-white font-inter tracking-[-0.02em] shadow-xl md:w-[520px] dark:bg-card-bg">
        {/* Header */}
        <div className="flex h-10 items-center justify-center border-b border-foreground/[0.06] px-5">
          <span className="text-sm font-medium text-page-text">Book a call</span>
          <button onClick={onClose} className="absolute right-4 top-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.52" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-5 pb-5 pt-[60px] scrollbar-hide" style={{ background: "radial-gradient(50% 53.47% at 50% 0%, rgba(255,70,1,0.12) 0%, rgba(255,70,1,0) 100%)" }}>
          {/* Agency identity */}
          <div className="flex flex-col items-center gap-4">
            <img src={agencyLogo} alt="" className="size-16 rounded-[10px] border-2 border-white object-cover dark:border-card-bg" />
            <span className="text-xl font-medium tracking-[-0.02em] text-page-text">Book a call with {agencyName}</span>
          </div>

          {/* Description */}
          <p className="text-center text-sm font-medium leading-[150%] tracking-[-0.02em] text-page-text-subtle">
            30-minute intro call. We&apos;ll discuss your campaign goals, budget and match you with the right team.
          </p>

          {/* Date picker */}
          <div className="flex w-full flex-col gap-4">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Select a date</span>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {DATES.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(i)}
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-2xl border p-3",
                    selectedDate === i
                      ? "border-[rgba(255,144,37,0.3)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                      : "border-foreground/[0.06] bg-white dark:bg-card-bg"
                  )}
                  style={selectedDate === i ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.12) 0%, rgba(255,144,37,0) 50%), #FFFFFF" } : undefined}
                >
                  <div className="flex flex-1 flex-col gap-2">
                    <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{d.day}</span>
                    <span className="text-xs tracking-[-0.02em] text-page-text-subtle">{d.date}</span>
                  </div>
                  <SelectCircle selected={selectedDate === i} />
                </button>
              ))}
            </div>
          </div>

          {/* Time picker */}
          <div className="flex w-full flex-col gap-4">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Select a time</span>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {TIMES.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => !t.disabled && setSelectedTime(idx)}
                  disabled={t.disabled}
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-2xl border p-3",
                    t.disabled && "opacity-50",
                    selectedTime === idx
                      ? "border-[rgba(255,144,37,0.3)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                      : "border-foreground/[0.06] bg-white dark:bg-card-bg"
                  )}
                  style={selectedTime === idx ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.12) 0%, rgba(255,144,37,0) 50%), #FFFFFF" } : undefined}
                >
                  <span className="flex-1 text-left text-sm font-medium tracking-[-0.02em] text-page-text">{t.label}</span>
                  <SelectCircle selected={selectedTime === idx} />
                </button>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="flex w-full flex-col gap-4">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Get in touch</span>

            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-[-0.02em] text-page-text-subtle">Name</span>
              <input className="rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]" placeholder="Jane" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-[-0.02em] text-page-text-subtle">Email</span>
              <input className="rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]" placeholder="jane@company.com" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs tracking-[-0.02em] text-page-text-subtle">What do you want to discuss (optional)</span>
              <textarea className="h-[66px] resize-none rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]" placeholder="Campaign goals, budget range, timeline..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function AgenciesPage() {
  const [search, setSearch] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const detail = selectedAgency ? AGENCY_DETAIL : null;

  /* ─── Detail view ─── */
  if (detail && selectedAgency) {
    return (
      <div className="flex flex-1 flex-col font-inter tracking-[-0.02em] dark:bg-page-bg">
        {/* Header */}
        <div className="flex h-14 items-center border-b border-foreground/[0.06] px-5">
          <button onClick={() => setSelectedAgency(null)} className="flex items-center gap-2 text-sm font-medium text-page-text transition-opacity hover:opacity-70">
            <ArrowLeftIcon />
            Back to agencies
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-6 px-5 pb-5 md:flex-row md:gap-10">
          {/* Left column */}
          <div className="flex flex-1 flex-col gap-4">
            {/* Stat cards — desktop: 3+2 rows, mobile: 2+1 with carousel dots */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <StatMini value={detail.budget} label="Budget" valueSuffix={detail.budgetUsed} valueColor="#00994D" />
                <StatMini value={detail.creators} label="Creators" valueSuffix={detail.creatorsStatus} valueColor="var(--page-text)" />
                <div className="hidden md:flex md:flex-1"><StatMini value={detail.totalSubmissions} label="Total submissions" /></div>
              </div>
              {/* Mobile: total submissions as separate row */}
              <div className="md:hidden">
                <StatMini value={detail.totalSubmissions} label="Total submissions" />
              </div>
              {/* Dot pagination for mobile carousel */}
              <div className="flex items-center justify-center gap-1 md:hidden">
                <div className="size-1.5 rounded-full bg-page-text" />
                <div className="size-1.5 rounded-full bg-foreground/10" />
                <div className="size-1.5 rounded-full bg-foreground/10" />
              </div>
            </div>

            {/* Stat cards row 2 */}
            <div className="flex gap-2">
              <StatMini value={detail.startingAt} label="Starting at" />
              <StatMini value={detail.minBudget} label="Min. budget" />
            </div>

            {/* About */}
            <div className={cn(cardCls, "flex flex-col gap-2 p-4")}>
              <span className="text-sm font-medium tracking-[-0.02em] text-page-text">About {detail.name}</span>
              <p className="text-sm leading-[150%] tracking-[-0.02em] text-foreground/70">{detail.about}</p>
            </div>

            {/* Active campaigns */}
            <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Active campaigns</span>
                <div className="flex items-center gap-2">
                  <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] opacity-30"><ChevronLeftSmall /></button>
                  <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06]"><ChevronRightSmall /></button>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {detail.campaigns.map((c) => (
                  <CampaignCard key={c.name} campaign={c} />
                ))}
              </div>
            </div>
          </div>

          {/* Right column — profile + contact */}
          <div className="relative w-full md:w-[400px] md:shrink-0">
            <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
              {/* Cover */}
              <div className="-mx-4 -mt-4">
                <div className="p-0">
                  <div
                    className="h-[168px] w-full rounded-t-2xl bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%), url(${detail.cover})` }}
                  >
                    <div className="flex justify-end p-4">
                      <div className={cn(pillCls, "gap-1 px-2")}>
                        <VerifiedBadge size={12} />
                        <span>{AGENCIES[0].badge}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo + name */}
              <div className="flex items-center gap-3 px-4 -mt-2">
                <div className="relative -mt-4">
                  <img src={detail.logo} alt="" className="size-12 rounded-[10px] border-2 border-white object-cover dark:border-card-bg" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-base font-medium tracking-[-0.02em] text-page-text">{detail.name}</span>
                  <VerifiedBadge size={12} />
                </div>
              </div>

              {/* Review + website */}
              <div className={cn("flex items-center gap-3 rounded-[10px] border border-foreground/[0.06] p-3 dark:border-[rgba(224,224,224,0.03)]")}>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} />)}
                  </div>
                  <span className="text-sm leading-[150%] tracking-[-0.02em] text-foreground/70">Reviewed by {detail.reviewCount} users worldwide</span>
                </div>
                <button className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium tracking-[-0.02em] text-page-text dark:bg-white/[0.06]">
                  View website
                  <ExternalLinkIcon />
                </button>
              </div>

              {/* Divider */}
              <div className="border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)]" />

              {/* Contact form */}
              <div className="flex flex-col gap-4">
                <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Get in touch</span>

                <div className="flex flex-col gap-2">
                  <span className="text-xs tracking-[-0.02em] text-page-text-subtle">Name</span>
                  <input className="rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]" placeholder="Jane" />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs tracking-[-0.02em] text-page-text-subtle">Email</span>
                  <input className="rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]" placeholder="jane@company.com" />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs tracking-[-0.02em] text-page-text-subtle">Phone</span>
                  <input className="rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]" placeholder="+1 (555) 123-4567" />
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-1.5">
                  <div className="mt-[1px] size-5 shrink-0 rounded-full border border-foreground/10 bg-white shadow-[0px_-1px_3px_rgba(0,0,0,0.06),0px_2px_2px_#FFFFFF,inset_0px_0.5px_2px_rgba(0,0,0,0.12)] dark:bg-card-bg" />
                  <span className="text-sm leading-[150%] tracking-[-0.02em] text-page-text-subtle">
                    By proceeding, you agree to our Terms and Brand Policy.
                  </span>
                </div>

                <button className="rounded-full bg-page-text py-2.5 text-sm font-medium tracking-[-0.02em] text-white opacity-50 dark:bg-white dark:text-[#151515]">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        {bookingOpen && <BookCallPanel agencyName={detail.name} agencyLogo={detail.logo} onClose={() => setBookingOpen(false)} />}
      </div>
    );
  }

  /* ─── Listing view ─── */
  return (
    <div className="flex flex-1 flex-col font-inter tracking-[-0.02em] dark:bg-page-bg">
      {/* Header — mobile: "Discover an agency" with back arrow, desktop: PageShell */}
      <div className="md:hidden">
        <div className="flex h-14 items-center border-b border-foreground/[0.06] px-5">
          <div className="flex items-center gap-2 text-sm font-medium text-page-text">
            <ArrowLeftIcon />
            Discover an agency
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <PageShell title="Agencies" />
      </div>

      <div className="flex flex-col gap-4 px-5 py-4 md:gap-5 md:p-5">
        {/* Search + filters */}
        <div className="flex flex-col gap-2">
          <div className="flex w-full items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 py-2.5 md:w-[320px] dark:bg-white/[0.04]">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agencies..."
              className="flex-1 bg-transparent text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/70"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <FilterButton label="Content style" />
            <FilterButton label="Niche" />
            <FilterButton label="Payment type" />
            <FilterButton label="Budget" />
          </div>
        </div>

        {/* Agency grid */}
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {AGENCIES.map((agency) => (
              <AgencyCard key={`${row}-${agency.id}`} agency={agency} onClick={() => setSelectedAgency(agency.id)} onBookCall={() => setBookingOpen(true)} />
            ))}
          </div>
        ))}
      </div>

      {bookingOpen && <BookCallPanel agencyName="billbord" agencyLogo="/icons/agency1.avif" onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
