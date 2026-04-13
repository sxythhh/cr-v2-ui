"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DubNav } from "@/components/lander/dub-nav";
import { AnnouncementBanner } from "@/components/lander/announcement-banner";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { Creators } from "@/components/sidebar/icons/creators";
import { Megaphone } from "@/components/sidebar/icons/megaphone";
import { GlassFilterPill } from "@/components/ui/glass-filter-pill";
import { ChevronDown } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

/* ─── Gold verified icon with tooltip ─── */
function GoldVerified({ size = 14 }: { size?: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="shrink-0 cursor-default">
            <path d="M12.578 5.20364C12.3511 4.96692 12.1177 4.72363 12.0298 4.50993C11.9476 4.31349 11.9435 3.98883 11.9385 3.67485C11.9303 3.08964 11.9205 2.42634 11.4585 1.96524C10.9982 1.50495 10.3358 1.49509 9.75056 1.48605C9.43576 1.48194 9.1111 1.47701 8.91548 1.39482C8.70177 1.30769 8.45684 1.07262 8.22177 0.84741C7.80834 0.450418 7.33819 0 6.7127 0C6.08804 0 5.61625 0.449596 5.20364 0.84741C4.96692 1.07262 4.72363 1.30769 4.50993 1.39482C4.31431 1.47701 3.98883 1.48194 3.67485 1.48605C3.08964 1.49509 2.42634 1.50495 1.96524 1.96606C1.50495 2.42634 1.49838 3.08964 1.48605 3.67485C1.48194 3.98883 1.47701 4.31349 1.39482 4.50993C1.30769 4.72363 1.07262 4.96692 0.84741 5.20364C0.450418 5.61625 0 6.08639 0 6.7127C0 7.33737 0.449596 7.80834 0.84741 8.22177C1.07262 8.45684 1.30769 8.70177 1.39482 8.91548C1.47701 9.1111 1.48194 9.43576 1.48605 9.75056C1.49509 10.3358 1.50495 10.9982 1.96606 11.4602C2.42634 11.9205 3.08964 11.9287 3.67485 11.9385C3.98883 11.9435 4.31349 11.9476 4.50993 12.0298C4.72363 12.1177 4.96692 12.3511 5.20364 12.578C5.61625 12.9742 6.08639 13.4246 6.7127 13.4246C7.33737 13.4246 7.80834 12.9758 8.22177 12.578C8.45684 12.3511 8.70177 12.1177 8.91548 12.0298C9.1111 11.9476 9.43576 11.9435 9.75056 11.9385C10.3358 11.9303 10.9982 11.9205 11.4602 11.4585C11.9205 10.9982 11.9287 10.3358 11.9385 9.75056C11.9435 9.43576 11.9476 9.1111 12.0298 8.91548C12.1177 8.70177 12.3511 8.45684 12.578 8.22177C12.9742 7.80834 13.4246 7.33819 13.4246 6.7127C13.4246 6.08804 12.9758 5.61625 12.578 5.20364ZM9.44891 5.61296L6.09297 8.96972C6.0485 9.01451 5.99562 9.05005 5.93736 9.0743C5.8791 9.09855 5.81662 9.11104 5.75351 9.11104C5.6904 9.11104 5.62792 9.09855 5.56966 9.0743C5.5114 9.05005 5.45852 9.01451 5.41405 8.96972L3.97568 7.53135C3.92688 7.48776 3.88749 7.43468 3.85992 7.37535C3.83235 7.31602 3.81718 7.25168 3.81533 7.18628C3.81349 7.12088 3.82501 7.05579 3.84919 6.995C3.87338 6.93421 3.90971 6.87899 3.95597 6.83273C4.00224 6.78647 4.05745 6.75013 4.11825 6.72595C4.17904 6.70177 4.24413 6.69024 4.30953 6.69209C4.37493 6.69393 4.43926 6.70911 4.49859 6.73668C4.55793 6.76425 4.61101 6.80364 4.65459 6.85243L5.75351 7.95217L8.77082 4.93487C8.81398 4.88471 8.86703 4.844 8.92665 4.81529C8.98627 4.78658 9.05117 4.77048 9.11729 4.76801C9.18342 4.76553 9.24935 4.77673 9.31094 4.80091C9.37254 4.82508 9.42849 4.86171 9.47528 4.9085C9.52207 4.95529 9.5587 5.01124 9.58287 5.07283C9.60705 5.13443 9.61825 5.20036 9.61577 5.26648C9.6133 5.33261 9.5972 5.39751 9.56849 5.45713C9.53978 5.51675 9.49907 5.5698 9.44891 5.61296Z" fill="url(#paint0_linear_gold_verified)"/>
            <defs>
              <linearGradient id="paint0_linear_gold_verified" x1="6.68544" y1="0" x2="6.73914" y2="13.4246" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF1D6"/>
                <stop offset="1" stopColor="#FCB02B"/>
              </linearGradient>
            </defs>
          </svg>
        </TooltipTrigger>
        <TooltipContent sideOffset={4}>Verified Partner</TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
    <div className={cn(cardCls, "group flex cursor-pointer flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] dark:hover:border-white/[0.06]")} onClick={onClick}>
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
              <Creators width={12} height={12} className="text-white" />
              <span>{agency.creators}</span>
            </div>
            <div className={pillCls}>
              <Megaphone width={12} height={12} className="text-white" />
              <span>{agency.campaigns}</span>
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
            <GoldVerified size={14} />
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
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6 12A6 6 0 1 0 6 0a6 6 0 0 0 0 12ZM4.172 4.172a.5.5 0 0 1 .707 0L6 5.293l1.121-1.121a.5.5 0 0 1 .707.707L6.707 6l1.121 1.121a.5.5 0 0 1-.707.707L6 6.707 4.879 7.828a.5.5 0 0 1-.707-.707L5.293 6 4.172 4.879a.5.5 0 0 1 0-.707Z" fill="#FF3355" />
            </svg>
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
                <PlatformIcon platform={p} size={12} className="invert dark:invert-0" />
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
          <GoldVerified size={14} />
          <span className="text-xs font-medium tracking-[-0.02em] text-foreground/20">·</span>
          <span className="text-xs tracking-[-0.02em] text-page-text-subtle">{campaign.time}</span>
        </div>

        {/* Name */}
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.name}</span>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-2">
              <Creators width={12} height={12} className="text-page-text-muted" />
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
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState(2);
  const [termsAccepted, setTermsAccepted] = useState(false); // 11:00 AM

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
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.52" strokeLinecap="round" />
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
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [specialty, setSpecialty] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");

  const detail = selectedAgency ? AGENCY_DETAIL : null;

  /* ─── Detail view ─── */
  if (detail && selectedAgency) {
    return (
      <div className="min-h-screen bg-page-bg font-inter">
        <AnnouncementBanner />
        <DubNav />
        <div className="mx-auto max-w-[1024px] px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-6 tracking-[-0.02em]">
            {/* Sticky back header */}
            <div className="sticky top-14 z-10 -mx-4 border-b border-foreground/[0.06] bg-page-bg px-4 sm:-mx-6 sm:px-6">
              <div className="flex h-12 items-center">
                <button onClick={() => setSelectedAgency(null)} className="flex cursor-pointer items-center gap-2 text-sm font-medium tracking-[-0.02em] text-page-text transition-opacity hover:opacity-70">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M5 12l6 6" /><path d="M5 12l6-6" />
                  </svg>
                  Back to agencies
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-6 overflow-hidden md:flex-row md:gap-6">
              {/* Left column */}
              <div className="flex min-w-0 flex-1 flex-col gap-4">
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
                      <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] opacity-30">
                        <ChevronDown className="size-3 rotate-90 text-page-text-muted" />
                      </button>
                      <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06]">
                        <ChevronDown className="size-3 -rotate-90 text-page-text-muted" />
                      </button>
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
              <div className="relative w-full md:w-[340px] md:shrink-0">
                <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                  {/* Cover */}
                  <div className="-mx-4 -mt-4">
                    <div className="p-0">
                      <div
                        className="h-[168px] w-full rounded-t-2xl bg-cover bg-center"
                        style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%), url(${detail.cover})` }}
                      >
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
                      <GoldVerified size={14} />
                    </div>
                  </div>

                  {/* Review + website */}
                  <div className={cn("flex items-center gap-3 rounded-[10px] border border-foreground/[0.06] p-3 dark:border-[rgba(224,224,224,0.03)]")}>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1.333l1.947 3.947 4.386.64-3.173 3.093.747 4.36L8 11.373l-3.907 2-0.747-4.36L.173 5.92l4.387-.64L8 1.333Z" fill="#FACC15" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm leading-[150%] tracking-[-0.02em] text-foreground/70">Reviewed by {detail.reviewCount} users worldwide</span>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium tracking-[-0.02em] text-page-text dark:bg-white/[0.06]">
                      View website
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 6.5v3a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1H5.5M7.5 1.5h3v3M5 7l5.5-5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
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
                    <button type="button" onClick={() => setTermsAccepted(!termsAccepted)} className="flex cursor-pointer items-start gap-2 text-left">
                      <div className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                        termsAccepted
                          ? "border-[#FF8003] bg-[#FF8003]"
                          : "border-foreground/15 bg-white shadow-[0px_-1px_3px_rgba(0,0,0,0.06),inset_0px_0.5px_2px_rgba(0,0,0,0.08)] dark:bg-card-bg",
                      )}>
                        {termsAccepted && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm leading-[150%] tracking-[-0.02em] text-page-text-subtle">
                        By proceeding, you agree to our Terms and Brand Policy.
                      </span>
                    </button>

                    <button className="rounded-full bg-page-text py-2.5 text-sm font-medium tracking-[-0.02em] text-white opacity-50 dark:bg-white dark:text-[#151515]">
                      Continue
                    </button>
                  </div>
                </div>
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
    <div className="min-h-screen bg-page-bg font-inter">
      <AnnouncementBanner />
      <DubNav />
      <div className="mx-auto max-w-[1024px] px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 tracking-[-0.02em] md:gap-5">
          {/* Filters */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              <GlassFilterPill label="Specialty" options={["All", "Logo placement", "Clipping", "Talking head", "Reposting"]} value={specialty} onChange={setSpecialty} variant="outline" />
              <GlassFilterPill label="Status" options={["All", "Accepting", "Not accepting"]} value={status} onChange={setStatus} variant="outline" />
              <GlassFilterPill label="Sort by" options={["Featured", "Most campaigns", "Highest views", "Lowest CPM"]} value={sort} onChange={setSort} variant="outline" />
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
      </div>

      {bookingOpen && <BookCallPanel agencyName="billbord" agencyLogo="/icons/agency1.avif" onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
