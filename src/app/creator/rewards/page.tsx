"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { CreatorHeader } from "@/components/creator-header";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { PendingClockIcon, CheckCircleIcon } from "@/components/creator-icons";
import { Modal } from "@/components/ui/modal";

const cardCls =
  "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

/* ─── Inline SVG icons (matched from creator dashboard) ─── */
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 11 10" fill="none">
      <path d="M5.93698 0.431091C5.66086 -0.143696 4.84062 -0.143698 4.56449 0.431091L3.3835 2.8895L0.663268 3.24567C0.0326199 3.32825 -0.229974 4.10751 0.239584 4.55027L2.22744 6.42466L1.72856 9.1008C1.61012 9.73617 2.28277 10.2072 2.8385 9.9076L5.25074 8.60713L7.66298 9.9076C8.2187 10.2072 8.89136 9.73617 8.77292 9.1008L8.27404 6.42466L10.2619 4.55027C10.7315 4.10751 10.4689 3.32825 9.83821 3.24567L7.11798 2.8895L5.93698 0.431091Z" fill="#E57100" />
    </svg>
  );
}

function MedalIcon({ className, color = "#ED1285" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 11 15" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 5.33333C0 2.38781 2.38781 0 5.33333 0C8.27885 0 10.6667 2.38781 10.6667 5.33333C10.6667 7.01759 9.88595 8.5195 8.66667 9.49691V13.3569C8.66667 14.2241 7.75397 14.7882 6.97825 14.4004L5.33333 13.5779L3.68842 14.4004C2.9127 14.7882 2 14.2241 2 13.3569V9.49691C0.780717 8.5195 0 7.01759 0 5.33333ZM3.33333 10.279V13.0872L4.81158 12.3481C5.14003 12.1838 5.52663 12.1838 5.85508 12.3481L7.33333 13.0872V10.279C6.71571 10.529 6.0406 10.6667 5.33333 10.6667C4.62607 10.6667 3.95095 10.529 3.33333 10.279Z" fill={color} />
    </svg>
  );
}

function FlameIcon({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 14" fill="none">
      <path d="M5.67611 0.138713C5.5005 0.00331132 5.26905 -0.0359068 5.05863 0.0340828C4.84822 0.104072 4.68637 0.274107 4.62685 0.487722C4.26845 1.77389 3.53348 2.48193 2.58887 3.39192C2.4616 3.51453 2.33052 3.64081 2.19605 3.77265L2.19557 3.77313C1.77569 4.18564 1.34233 4.65292 0.986337 5.18247C-0.0701753 6.75508 -0.329838 8.53638 0.461284 10.3273L0.46159 10.328C1.78028 13.304 4.73215 14.1613 7.19798 13.4069C9.67343 12.6496 11.7033 10.2654 11.2767 6.82935C11.1448 5.75907 10.7831 4.65249 9.88891 3.78082C9.74845 3.64389 9.55482 3.57578 9.35957 3.5946C9.16432 3.61343 8.98727 3.71729 8.87556 3.87852C8.78211 4.0134 8.56938 4.27339 8.31433 4.57399C8.27022 4.03903 8.15887 3.52437 7.96975 3.02749C7.55486 1.93747 6.79037 0.997821 5.67611 0.138713Z" fill={color} />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 11 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.33333 0C3.49238 0 2 1.49238 2 3.33333V4.66667C0.895431 4.66667 0 5.5621 0 6.66667V11.3333C0 12.4379 0.895431 13.3333 2 13.3333H8.66667C9.77124 13.3333 10.6667 12.4379 10.6667 11.3333V6.66667C10.6667 5.5621 9.77124 4.66667 8.66667 4.66667V3.33333C8.66667 1.49238 7.17428 0 5.33333 0ZM7.33333 4.66667V3.33333C7.33333 2.22876 6.4379 1.33333 5.33333 1.33333C4.22876 1.33333 3.33333 2.22876 3.33333 3.33333V4.66667H7.33333ZM5.33333 7.33333C5.70152 7.33333 6 7.63181 6 8V10C6 10.3682 5.70152 10.6667 5.33333 10.6667C4.96514 10.6667 4.66667 10.3682 4.66667 10V8C4.66667 7.63181 4.96514 7.33333 5.33333 7.33333Z" fill="currentColor" fillOpacity={0.2} />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M2.66659 2.66667C2.66659 2.29848 2.96506 2 3.33325 2H12.6666C13.0348 2 13.3333 2.29848 13.3333 2.66667C13.3333 3.03486 13.0348 3.33333 12.6666 3.33333H3.33325C2.96506 3.33333 2.66659 3.03486 2.66659 2.66667ZM1.33325 6C1.33325 4.89543 2.22868 4 3.33325 4H12.6666C13.7712 4 14.6666 4.89543 14.6666 6V12C14.6666 13.1046 13.7712 14 12.6666 14H3.33325C2.22868 14 1.33325 13.1046 1.33325 12V6ZM7.04446 7.0658C7.27544 6.95478 7.5496 6.986 7.74972 7.14609L9.41638 8.47942C9.57453 8.60594 9.66659 8.79748 9.66659 9C9.66659 9.20252 9.57453 9.39406 9.41638 9.52058L7.74972 10.8539C7.5496 11.014 7.27544 11.0452 7.04446 10.9342C6.81348 10.8232 6.66659 10.5896 6.66659 10.3333V7.66667C6.66659 7.4104 6.81348 7.17681 7.04446 7.0658Z" fill="currentColor" fillOpacity={0.5} />
    </svg>
  );
}

/* ─── Decorative particles for the tier hero ─── */
function TierParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Gradient glow */}
      <div
        className="absolute bottom-[60%] left-1/2 h-[764px] w-full -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,139,26,0.04) 83.1%, rgba(255,139,26,0) 100%)",
        }}
      />
      {/* Scattered orange dots – 3 size layers */}
      {[
        { x: "46%", y: "12px", s: 3 },
        { x: "52%", y: "28px", s: 2.6 },
        { x: "38%", y: "44px", s: 2 },
        { x: "60%", y: "60px", s: 2.6 },
        { x: "44%", y: "70px", s: 2 },
        { x: "55%", y: "5px", s: 2 },
        { x: "35%", y: "20px", s: 1.6 },
        { x: "62%", y: "88px", s: 1.6 },
        { x: "40%", y: "95px", s: 2.6 },
        { x: "58%", y: "40px", s: 1.6 },
      ].map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.x,
            top: d.y,
            width: d.s,
            height: d.s,
            background: "linear-gradient(180deg, #FF8B1A 0%, #E57100 100%)",
            opacity: i > 6 ? 0.3 : 0.6,
            filter: i > 6 ? "blur(0.5px)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Tier badge (orange star with unicorn — from dashboard) ─── */
function TierBadge() {
  return (
    <div className="relative size-16">
      <svg width="68" height="68" viewBox="0 0 43 43" fill="none" className="absolute -left-[12px] -top-[12px]">
        <defs>
          <linearGradient id="tierStarGrad" x1="21.5" y1="-1.15" x2="21.5" y2="46.1" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8B1A" /><stop offset="1" stopColor="#E57100" />
          </linearGradient>
        </defs>
        <path d="M18.56 1.95C19.59.87 20.1.33 20.69.13 21.22-.04 21.78-.04 22.31.13c.6.2 1.11.74 2.13 1.82l6.26 6.6c.19.2.29.31.39.4.1.08.2.15.3.22.12.07.25.13.5.25l8.22 3.92c1.34.64 2.01.96 2.39 1.46.33.44.5.98.5 1.54-.01.63-.36 1.28-1.07 2.59l-4.34 8c-.13.25-.2.37-.25.5-.05.11-.09.23-.12.35-.03.14-.05.28-.08.55l-1.19 9.03c-.19 1.47-.29 2.21-.66 2.72-.32.45-.78.78-1.3.95-.6.19-1.33.05-2.79-.22l-8.95-1.66c-.28-.05-.41-.08-.55-.09-.12-.01-.25-.01-.37 0-.14.01-.28.04-.55.09l-8.95 1.66c-1.46.27-2.19.41-2.79.22-.53-.17-.99-.5-1.31-.95-.36-.51-.46-1.25-.66-2.72L5.87 28.33c-.04-.28-.05-.42-.09-.55-.03-.12-.07-.24-.12-.35-.05-.13-.12-.25-.25-.5l-4.34-8C.36 17.62.01 16.97 0 16.34c-.01-.55.17-1.09.5-1.54.37-.5 1.04-.82 2.39-1.46l8.22-3.92c.25-.12.38-.18.5-.25.1-.07.21-.14.3-.22.1-.09.2-.19.4-.4l6.26-6.6Z" fill="url(#tierStarGrad)" stroke="currentColor" strokeOpacity="0.06" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-[42px] items-center justify-center rounded-full border border-foreground/[0.06]">
          <svg width="22" height="20" viewBox="0 0 21 18" fill="none">
            <path d="M13.49.11c.32-.16.7-.14 1 .05.31.19.49.52.49.88v1.88l.01.02 4.32-2.48c.41-.24.86.27.57.65l-3.41 4.45 1.46 2.55c.32.57.5 1.21.5 1.86v.63c0 1.73-1.4 3.12-3.12 3.12-.48 0-.96-.11-1.4-.33l-1.75-.88c.14.76.24 1.68.24 2.76 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-1.41-.2-2.5-.4-3.23-.09-.34-.18-.6-.25-.78-.59-.37-1.07-.89-1.38-1.51-.39-.81-.5-1.73-.28-2.6l.19-.74c.14-.55.7-.89 1.25-.75.55.14.89.7.75 1.25l-.19.74c-.1.39-.05.81.13 1.18.17.33.43.6.76.76l3.91 1.96c.15.07.31.11.47.11.58 0 1.06-.47 1.06-1.06v-.63c0-.29-.08-.58-.22-.84l-3.09-5.4c-.09-.16-.14-.33-.14-.51v-.48l-1.09.54c-.19.09-.4.13-.61.1-2.59-.37-4.61.71-6.04 2.52-1.45 1.84-2.25 4.41-2.25 6.79 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-2.79.92-5.82 2.7-8.07C5.3 2.38 7.9.91 11.19 1.26l2.3-1.15Z" fill="currentColor" fillOpacity="0.8" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Tier names ─── */
const TIERS = ["Recruit", "Operator", "Contender", "Challenger", "Elite", "Legend"];
const CURRENT_TIER_INDEX = 0;

/* ─── Avatar pin marker (for current tier on progress bar) ─── */
function AvatarPinMarker() {
  return (
    <div className="flex flex-col items-center" style={{ width: 48, height: 80 }}>
      {/* Pin shape with avatar — exact Figma SVG 48×54 */}
      <div className="relative" style={{ width: 48, height: 54 }}>
        <svg width="48" height="54" viewBox="0 0 48 54" fill="none" className="absolute inset-0">
          <g filter="url(#pin_shadow)">
            <path d="M24 3C35.05 3 44 11.95 44 22.99C44 31.82 38.27 39.31 30.32 41.95c-.53.18-.8.27-.99.38-.18.11-.3.21-.45.36-.15.16-.27.37-.51.79l-1.61 2.75c-.91 1.56-1.36 2.34-1.95 2.6-.52.23-1.11.23-1.62 0-.59-.26-1.04-1.04-1.95-2.6l-1.61-2.75c-.24-.42-.37-.63-.51-.79-.15-.15-.27-.25-.45-.36-.19-.11-.47-.2-.99-.38C9.73 39.31 4 31.82 4 22.99 4 11.95 12.95 3 24 3Z" fill="var(--card-bg)" stroke="#E57100" strokeWidth="1.33"/>
          </g>
          <defs>
            <filter id="pin_shadow" x="0" y="0" width="48" height="54" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="bg"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/><feOffset dy="1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="a" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend in2="bg" result="ds"/><feBlend in="SourceGraphic" in2="ds" result="shape"/></filter>
          </defs>
        </svg>
        {/* Avatar circle — 32×32, centered in pin circular area */}
        <div
          className="absolute overflow-hidden bg-[#D9D9D9] dark:bg-[#555]"
          style={{ width: 32, height: 32, left: 8, top: 7, borderRadius: 16, boxShadow: "0px 1px 2px rgba(0,0,0,0.03)" }}
        />
      </div>
      {/* Vertical connector — simple 2px orange stroke */}
      <div className="relative z-10 -mt-[2px]" style={{ width: 2, height: 22 }}>
        <svg width="2" height="22" viewBox="0 0 2 22" fill="none">
          <path d="M1 1V21" stroke="#E57100" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

/* ─── Progress milestone node (lock icon + connector) ─── */
function MilestoneNode() {
  return (
    <div className="flex w-8 flex-col items-center gap-2">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
        <LockIcon className="size-4" />
      </div>
      {/* Vertical connector: outer matches card bg + orange inner */}
      <div className="relative z-10" style={{ width: 6, height: 12 }}>
        <svg className="absolute left-0 -top-[2px]" width="6" height="16" viewBox="0 0 6 16" fill="none">
          <path d="M3 2V14" stroke="var(--card-bg)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="absolute left-0 -top-[2px]" width="6" height="16" viewBox="0 0 6 16" fill="none">
          <path d="M3 2V14" stroke="#E57100" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Sparkle circles on the filled bar edge ─── */
function BarSparkles() {
  return (
    <svg className="absolute right-0 top-1/2 -translate-y-1/2" width="39" height="12" viewBox="0 0 39 12" fill="none" style={{ filter: "blur(0.5px)" }}>
      <circle cx="2.665" cy="4.165" r="0.665" fill="white" />
      <circle cx="17.665" cy="11.165" r="0.665" fill="white" />
      <circle cx="8.665" cy="6.165" r="0.665" fill="white" />
      <circle cx="1.665" cy="1.165" r="0.665" fill="white" />
      <circle cx="24.665" cy="9.165" r="0.665" fill="white" />
      <circle cx="19.665" cy="8.165" r="0.665" fill="white" />
      <circle cx="37.665" cy="6.165" r="0.665" fill="white" />
      <circle cx="21.665" cy="4.165" r="0.665" fill="white" />
      <circle cx="13.665" cy="2.165" r="0.665" fill="white" />
      <circle cx="27.665" cy="6.165" r="0.665" fill="white" />
      <circle cx="11.665" cy="9.165" r="0.665" fill="white" />
    </svg>
  );
}

/* ─── XP progress bar (hatched candy-bar) ─── */
function XpProgressBar({ progress }: { progress: number }) {
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-[5px] bg-[rgba(229,113,0,0.08)] dark:bg-[rgba(229,113,0,0.15)]">
      {/* Diagonal stripe pattern in unfilled area */}
      <svg className="absolute inset-0 size-full" preserveAspectRatio="none">
        <defs>
          <pattern id="diagonalStripes" patternUnits="userSpaceOnUse" width="5.06" height="12" patternTransform="rotate(45)">
            <rect width="2" height="12" fill="#E57100" fillOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonalStripes)" />
      </svg>
      {/* Filled portion with sparkle circles */}
      <div
        className="relative z-[1] h-full rounded-[5px]"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, #FFFFFF 100%), radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207",
        }}
      >
        <BarSparkles />
      </div>
    </div>
  );
}

/* ─── Quest item ─── */
function QuestItem({
  icon,
  title,
  description,
  xp,
  titleColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  xp: string;
  titleColor?: string;
}) {
  return (
    <div className={cn(cardCls, "group flex cursor-pointer items-center gap-3 py-3 pl-3 pr-4")}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] bg-white shadow-[0_0_0_1.8px_white] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0_0_0_1.8px_var(--card-bg)]">
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm font-medium leading-none tracking-[-0.02em] text-page-text" style={titleColor ? { color: titleColor } : {}}>
          {title}
        </span>
        <span className="truncate text-xs leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>
      </div>
      <div className="flex shrink-0 items-center gap-1 rounded-full border border-foreground/[0.06] bg-white py-1 pl-1.5 pr-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
        <StarIcon className="size-3" />
        <span className="text-xs font-medium leading-none tracking-[-0.02em] text-page-text">{xp}</span>
      </div>
      <ChevronRightIcon className="size-4 shrink-0 text-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5" />
    </div>
  );
}

/* ─── Streak day ─── */
function StreakDay({
  date,
  active,
  current,
  future,
  reward,
}: {
  date: number;
  active?: boolean;
  current?: boolean;
  future?: boolean;
  reward?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "flex size-[52px] flex-col items-center justify-center gap-1.5 rounded-full",
          current
            ? "border border-[#E57100] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-card-bg"
            : future
              ? "border border-dashed border-foreground/[0.12] bg-white dark:bg-card-bg"
              : "border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-card-bg"
        )}
      >
        <span
          className={cn(
            "text-base font-medium leading-none tracking-[-0.02em]",
            active ? "text-[#E57100]" : future ? "text-page-text-muted" : "text-page-text-muted"
          )}
        >
          {date}
        </span>
      </div>
      {active && !future ? (
        <div className="flex h-4 items-center justify-center">
          <FlameIcon className="size-4" color={active ? "#E57100" : undefined} />
        </div>
      ) : (
        <div className="h-4" />
      )}
      {reward && (
        <div className="flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-1.5 py-1 shadow-[0_0_0_2px_white,0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_0_0_2px_var(--card-bg),0_1px_2px_rgba(0,0,0,0.15)]">
          <StarIcon className="size-3" />
          <span className="text-xs font-medium leading-none tracking-[-0.02em]">{reward}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Badges segmented bar ─── */
function BadgesBar({ filled, total }: { filled: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full"
          style={{ background: i < filled ? "#ED1285" : "rgba(237,18,133,0.1)" }}
        />
      ))}
    </div>
  );
}

/* ─── Close icon (X) ─── */
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4.66667 4.66667L11.3333 11.3333M11.3333 4.66667L4.66667 11.3333" stroke="currentColor" strokeOpacity={0.5} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Check circle for perks (green = unlocked, grey = locked) ─── */
function PerkCheckIcon({ unlocked }: { unlocked: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.667 0C2.985 0 0 2.985 0 6.667c0 3.682 2.985 6.666 6.667 6.666 3.682 0 6.666-2.984 6.666-6.666C13.333 2.985 10.349 0 6.667 0Zm2.515 5.422a.667.667 0 0 0-1.032-.938L5.617 7.674l-.812-.812a.667.667 0 0 0-.943.943l1.333 1.333a.667.667 0 0 0 .987-.05l3-3.666Z" fill={unlocked ? "#00994D" : "currentColor"} fillOpacity={unlocked ? 1 : 0.2} />
    </svg>
  );
}

/* ─── Tier data for perks drawer ─── */
const TIER_PERKS = [
  { name: "Recruit", unlocked: true, perks: ["8% platform fee", "48h review", ""] },
  { name: "Operator", unlocked: false, perks: ["7% platform fee", "48h review", "2% CPM bonus"] },
  { name: "Contender", unlocked: false, perks: ["5% platform fee", "24h review", "5% CPM bonus"] },
  { name: "Challenger", unlocked: false, perks: ["5% platform fee", "12h review", "10% CPM bonus"] },
  { name: "Elite", unlocked: false, perks: ["3% platform fee", "8h review", "15% CPM bonus"] },
  { name: "Legend", unlocked: false, perks: ["0% platform fee", "Instant review", "20% CPM bonus"] },
];

/* ─── Perks drawer ─── */
export function PerksDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[520px]">
      <div className="flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Perks</span>
      </div>

      <div className="flex flex-col items-center gap-4 p-5">

              {/* Description */}
              <p className="text-center text-sm leading-[150%] tracking-[-0.02em] text-page-text-muted">
                Your current level is <span className="font-medium text-[#E57100]">Recruit</span>. Move up by <span className="font-bold text-page-text">submitting clips daily</span>, getting them <span className="font-medium text-[#00994D]">approved</span> and <span className="font-medium text-[#8B5CF6]">going viral</span>.
              </p>

              {/* Tiers card */}
              <div className={cn(cardCls, "flex w-full flex-col gap-4 p-4")}>
                {TIER_PERKS.map((tier, idx) => (
                  <div key={tier.name}>
                    {idx > 0 && <div className="mb-4 h-px w-full bg-foreground/[0.06]" />}
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      {tier.unlocked ? (
                        <div className="relative flex size-10 items-center justify-center">
                          <svg width="42" height="42" viewBox="0 0 43 43" fill="none" className="absolute -left-[1px] -top-[1px]">
                            <defs>
                              <linearGradient id={`perkStar${idx}`} x1="21.5" y1="-1.15" x2="21.5" y2="46.1" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FF8B1A" /><stop offset="1" stopColor="#E57100" />
                              </linearGradient>
                            </defs>
                            <path d="M18.56 1.95C19.59.87 20.1.33 20.69.13 21.22-.04 21.78-.04 22.31.13c.6.2 1.11.74 2.13 1.82l6.26 6.6c.19.2.29.31.39.4.1.08.2.15.3.22.12.07.25.13.5.25l8.22 3.92c1.34.64 2.01.96 2.39 1.46.33.44.5.98.5 1.54-.01.63-.36 1.28-1.07 2.59l-4.34 8c-.13.25-.2.37-.25.5-.05.11-.09.23-.12.35-.03.14-.05.28-.08.55l-1.19 9.03c-.19 1.47-.29 2.21-.66 2.72-.32.45-.78.78-1.3.95-.6.19-1.33.05-2.79-.22l-8.95-1.66c-.28-.05-.41-.08-.55-.09-.12-.01-.25-.01-.37 0-.14.01-.28.04-.55.09l-8.95 1.66c-1.46.27-2.19.41-2.79.22-.53-.17-.99-.5-1.31-.95-.36-.51-.46-1.25-.66-2.72L5.87 28.33c-.04-.28-.05-.42-.09-.55-.03-.12-.07-.24-.12-.35-.05-.13-.12-.25-.25-.5l-4.34-8C.36 17.62.01 16.97 0 16.34c-.01-.55.17-1.09.5-1.54.37-.5 1.04-.82 2.39-1.46l8.22-3.92c.25-.12.38-.18.5-.25.1-.07.21-.14.3-.22.1-.09.2-.19.4-.4l6.26-6.6Z" fill={`url(#perkStar${idx})`} stroke="currentColor" strokeOpacity="0.06" />
                          </svg>
                          <div className="relative flex size-[36px] items-center justify-center rounded-full">
                            <svg width="18" height="16" viewBox="0 0 21 18" fill="none">
                              <path d="M13.49.11c.32-.16.7-.14 1 .05.31.19.49.52.49.88v1.88l.01.02 4.32-2.48c.41-.24.86.27.57.65l-3.41 4.45 1.46 2.55c.32.57.5 1.21.5 1.86v.63c0 1.73-1.4 3.12-3.12 3.12-.48 0-.96-.11-1.4-.33l-1.75-.88c.14.76.24 1.68.24 2.76 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-1.41-.2-2.5-.4-3.23-.09-.34-.18-.6-.25-.78-.59-.37-1.07-.89-1.38-1.51-.39-.81-.5-1.73-.28-2.6l.19-.74c.14-.55.7-.89 1.25-.75.55.14.89.7.75 1.25l-.19.74c-.1.39-.05.81.13 1.18.17.33.43.6.76.76l3.91 1.96c.15.07.31.11.47.11.58 0 1.06-.47 1.06-1.06v-.63c0-.29-.08-.58-.22-.84l-3.09-5.4c-.09-.16-.14-.33-.14-.51v-.48l-1.09.54c-.19.09-.4.13-.61.1-2.59-.37-4.61.71-6.04 2.52-1.45 1.84-2.25 4.41-2.25 6.79 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-2.79.92-5.82 2.7-8.07C5.3 2.38 7.9.91 11.19 1.26l2.3-1.15Z" fill="currentColor" fillOpacity="0.8" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full border border-dashed border-foreground/[0.12] bg-white dark:bg-card-bg">
                          <LockIcon className="size-5" />
                        </div>
                      )}

                      {/* Name + perks row */}
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <span className={cn("text-sm font-medium leading-none tracking-[-0.02em]", !tier.unlocked && "text-foreground/40")}>
                          {tier.name}
                        </span>
                        <div className="flex items-start gap-3">
                          {tier.perks.map((perk, pi) => (
                            <div key={pi} className={cn("flex items-center gap-1 pr-2", !perk && "opacity-0")}>
                              <PerkCheckIcon unlocked={tier.unlocked} />
                              <span className={cn("text-xs font-medium leading-[120%] tracking-[-0.02em]", tier.unlocked ? "text-page-text-muted" : "text-foreground/40")}>
                                {perk || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

        {/* Footer */}
        <div className="sticky bottom-0 w-full bg-card-bg px-0 pt-4 dark:bg-page-bg">
          <button onClick={onClose} className="flex h-10 w-full items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]">
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Badge detail modal ─── */
function BadgeDetailDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const platforms = [
    { id: "tiktok", name: "TikTok", handle: "@vladclips", status: "submitted" as const },
    { id: "instagram", name: "Instagram", handle: "@vladclips", status: "submitted" as const },
    { id: "youtube", name: "Youtube", handle: "@vladclips", status: "pending" as const },
  ];
  const completedCount = platforms.filter((p) => p.status === "submitted").length;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[520px]">
      {/* Header */}
      <div className="flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Badge details</span>
      </div>

      {/* Body */}
      <div className="relative flex flex-col items-center gap-4 overflow-hidden p-5">
        {/* Pink gradient glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[642px] w-[636px] -translate-x-1/2 -translate-y-[55%]" style={{ background: "linear-gradient(180deg, rgba(237,18,133,0.04) 83.18%, rgba(237,18,133,0) 100%)" }} />

        {/* Decorative particle circles */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[145px] w-[171px] -translate-x-1/2">
          {/* Large ring — opacity 0.3 blur 2px */}
          <svg className="absolute left-[59.5px] top-[-20px] opacity-30" style={{ filter: "blur(2px)" }} width="100" height="145" viewBox="0 0 100 145" fill="none">
            {[[46.1,83.12],[39.61,1.3],[88.96,142.21],[97.4,118.83],[67.53,29.22],[31.17,41.56],[0,53.25],[21.43,67.53],[0.65,15.58],[30.52,0],[74.03,26.62]].map(([x,y],i) => <circle key={i} cx={x+1.3} cy={y+1.3} r={1.3} fill="#ED1285"/>)}
          </svg>
          {/* Medium right — opacity 0.3 blur 0.5px */}
          <svg className="absolute left-[96px] top-[-17.9px] opacity-30" style={{ filter: "blur(0.5px)" }} width="75" height="109" viewBox="0 0 75 109" fill="none">
            {[[34.58,62.34],[29.71,0.97],[66.72,106.66],[73.05,89.12],[50.65,21.92],[23.38,31.17],[0,39.94],[16.07,50.65],[0.49,11.69],[22.89,0],[55.52,19.97]].map(([x,y],i) => <circle key={i} cx={x+0.975} cy={y+0.975} r={0.975} fill="#ED1285"/>)}
          </svg>
          {/* Medium left (rotated 180) — opacity 0.3 blur 0.5px */}
          <svg className="absolute left-0 top-[-17.9px] opacity-30" style={{ filter: "blur(0.5px)", transform: "rotate(180deg)" }} width="75" height="109" viewBox="0 0 75 109" fill="none">
            {[[38.47,44.32],[43.34,105.68],[6.33,0],[0,17.53],[22.4,84.74],[49.68,75.49],[73.05,66.72],[56.98,56.01],[72.56,94.97],[50.16,106.66],[17.53,86.69]].map(([x,y],i) => <circle key={i} cx={x+0.975} cy={y+0.975} r={0.975} fill="#ED1285"/>)}
          </svg>
        </div>

        {/* Badge avatar */}
        <div className="relative z-10 size-20 overflow-hidden rounded-full border border-foreground/[0.06] bg-gray-200 shadow-[0_0_0_1.8px_white] dark:border-[rgba(224,224,224,0.06)] dark:shadow-[0_0_0_1.8px_var(--page-bg)]" />

        {/* Badge info */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <span className="text-5xl font-medium leading-none tracking-[-0.02em] text-[#ED1285]">Platform Master</span>
          <span className="text-sm leading-none tracking-[-0.02em] text-page-text-muted">Submit content on 3 platforms</span>
        </div>

        {/* Progress card */}
        <div className={cn(cardCls, "relative z-10 flex w-full flex-col gap-2.5 p-3")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-full px-2 py-1.5" style={{ background: "rgba(229,113,0,0.08)" }}>
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill="#E57100"/></svg>
              <span className="text-xs font-medium leading-none tracking-[-0.02em] text-[#E57100]">In progress</span>
            </div>
            <span className="text-sm font-medium leading-none tracking-[-0.02em] text-page-text">{completedCount}/{platforms.length}</span>
          </div>
          <div className="flex gap-1">
            {platforms.map((p, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: p.status === "submitted"
                  ? "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), linear-gradient(0deg, #FF6207, #FF6207), #E57100"
                  : "rgba(229,113,0,0.1)"
                }}
              />
            ))}
          </div>
        </div>

        {/* Platforms card */}
        <div className={cn(cardCls, "relative z-10 flex w-full flex-col gap-4 p-4")}>
          <span className="text-sm font-medium leading-none tracking-[-0.02em] text-page-text">Platforms</span>
          <div className="flex flex-col gap-2">
            {platforms.map((p) => (
              <div key={p.id} className={cn(cardCls, "flex items-center gap-3 p-4")}>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] bg-white dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                  {p.id === "tiktok" && (
                    <svg width="15" height="17" viewBox="0 0 15 17" fill="none"><path d="M14.5284 6.84452C13.0454 6.84452 11.6723 6.3733 10.5511 5.57248V11.3939C10.5511 14.306 8.18915 16.6667 5.27564 16.6667C4.18856 16.6667 3.17816 16.3381 2.33882 15.7748C0.928533 14.8284 0 13.2192 0 11.3938C0 8.4819 2.36196 6.12119 5.27572 6.12125C5.51786 6.12113 5.7597 6.13757 5.99958 6.17034V6.81669L5.99944 9.08666C5.76856 9.01344 5.52243 8.97369 5.26706 8.97369C3.9342 8.97369 2.85391 10.0536 2.85391 11.3856C2.85391 12.3273 3.39391 13.1428 4.18135 13.5401C4.50785 13.7047 4.87659 13.7974 5.26708 13.7974C6.59719 13.7974 7.67563 12.7219 7.68022 11.3938V0H10.551V0.366908C10.5611 0.476599 10.5757 0.585873 10.5948 0.694432C10.794 1.83031 11.4735 2.80079 12.4167 3.38904C13.0501 3.78419 13.7819 3.99309 14.5284 3.99196L14.5284 6.84452Z" fill="currentColor"/></svg>
                  )}
                  {p.id === "instagram" && (
                    <PlatformIcon platform="instagram" size={16} />
                  )}
                  {p.id === "youtube" && (
                    <svg width="18" height="15" viewBox="0 0 18 15" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M15.5869 0.423134C16.3403 0.656358 16.9324 1.34104 17.1341 2.2123C17.4985 3.78988 17.5 7.08333 17.5 7.08333C17.5 7.08333 17.5 10.3768 17.1341 11.9544C16.9324 12.8257 16.3403 13.5103 15.5869 13.7435C14.2227 14.1667 8.74997 14.1667 8.74997 14.1667C8.74997 14.1667 3.27728 14.1667 1.91307 13.7435C1.15966 13.5103 0.567583 12.8257 0.365904 11.9544C0 10.3768 0 7.08333 0 7.08333C0 7.08333 0 3.78988 0.365904 2.2123C0.567583 1.34104 1.15966 0.656358 1.91307 0.423134C3.27728 0 8.74997 0 8.74997 0C8.74997 0 14.2227 0 15.5869 0.423134ZM11.6778 7.08359L6.91488 9.83326V4.33388L11.6778 7.08359Z" fill="#FF3355"/></svg>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-sm font-medium leading-none tracking-[-0.02em] text-page-text">{p.name}</span>
                  <span className="text-xs leading-none tracking-[-0.02em] text-page-text-muted">{p.handle}</span>
                </div>
                {p.status === "submitted" ? (
                  <span className="text-xs font-medium leading-none tracking-[-0.02em] text-[#00994D]">Submitted</span>
                ) : (
                  <button className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium leading-none tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">Submit</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
/* ─── Badge tier data ─── */
const BADGE_TIERS = [
  {
    name: "Recruit", fee: "8% platform fee", earned: 3, total: 5, unlocked: true,
    badges: [
      { name: "First Step", desc: "Submit your first clip", earned: true },
      { name: "On the Board", desc: "Get your first submission approved", earned: true },
      { name: "Money In", desc: "Earn your first dollar", earned: true },
      { name: "Connected", desc: "Link a social media account", earned: false },
      { name: "3-Day Run", desc: "3-day submission streak", earned: false },
    ],
  },
  {
    name: "Operator", fee: "7% platform fee", earned: 0, total: 5, unlocked: false,
    badges: [
      { name: "Grinder", desc: "Submit 5 total clips", earned: false },
      { name: "Double Down", desc: "Submit to 2 different campaigns", earned: false },
      { name: "Double Digits", desc: "Earn $10+", earned: false },
      { name: "Sharpshooter", desc: "50%+ approval rate (10+ subs)", earned: false },
      { name: "Week Strong", desc: "7-day submission streak", earned: false },
    ],
  },
  {
    name: "Contender", fee: "5% platform fee", earned: 0, total: 5, unlocked: false,
    badges: [
      { name: "Half Century", desc: "Earn $50+", earned: false },
      { name: "Triple Digits", desc: "Earn $100+", earned: false },
      { name: "Multi-Platform", desc: "Content on 2+ platforms", earned: false },
      { name: "Perfectionist", desc: "75%+ approval rate (20+ subs)", earned: false },
      { name: "Viral Hit", desc: "10K+ views on a single submission", earned: false },
    ],
  },
  {
    name: "Challenger", fee: "4% platform fee", earned: 0, total: 5, unlocked: false,
    badges: [
      { name: "Half K", desc: "Earn $500+", earned: false },
      { name: "Two Week Warrior", desc: "14-day submission streak", earned: false },
      { name: "Platform Master", desc: "Content on 3+ platforms", earned: false },
      { name: "Content Machine", desc: "50 approved submissions", earned: false },
      { name: "Brand Explorer", desc: "Approved in 4+ campaigns", earned: false },
    ],
  },
  {
    name: "Elite", fee: "3% platform fee", earned: 0, total: 5, unlocked: false,
    badges: [
      { name: "Comma Club", desc: "Earn $1,000+", earned: false },
      { name: "Quarter Five", desc: "Earn $2,500+", earned: false },
      { name: "Going Viral", desc: "100K+ views on a single submission", earned: false },
      { name: "Monthly Grinder", desc: "30-day submission streak", earned: false },
      { name: "Campaign Veteran", desc: "Approved in 7+ campaigns", earned: false },
    ],
  },
  {
    name: "Legend", fee: "0% platform fee", earned: 0, total: 5, unlocked: false,
    badges: [
      { name: "Five Stack", desc: "Earn $5,000+", earned: false },
      { name: "Ten K Club", desc: "Earn $10,000+", earned: false },
      { name: "Centurion", desc: "100 approved submissions", earned: false },
      { name: "The Thousand", desc: "1,000 approved submissions", earned: false },
      { name: "Relentless", desc: "60-day submission streak", earned: false },
    ],
  },
];

const totalBadgesEarned = BADGE_TIERS.reduce((s, t) => s + t.earned, 0);
const totalBadges = BADGE_TIERS.reduce((s, t) => s + t.total, 0);

export default function CreatorRewardsPage() {
  const [rewardsTab, setRewardsTab] = useState<"progress" | "badges">("progress");
  const [perksOpen, setPerksOpen] = useState(false);
  const [badgeDetailOpen, setBadgeDetailOpen] = useState(false);

  const questContainerRef = useRef<HTMLDivElement>(null);
  const questHover = useProximityHover(questContainerRef);
  const questActiveRect = questHover.activeIndex !== null ? questHover.itemRects[questHover.activeIndex] : null;

  useEffect(() => { questHover.measureItems(); }, [questHover.measureItems]);

  return (
    <div className="flex min-h-screen flex-col font-inter tracking-[-0.02em]">
      <CreatorHeader title="Rewards" />

      <div className="mx-auto flex w-full max-w-[756px] flex-col gap-4 px-4 py-4 sm:px-5 md:px-4">
        {rewardsTab === "badges" ? (
          <>
            <button onClick={() => setRewardsTab("progress")} className="flex items-center gap-1.5 self-start text-sm font-medium text-page-text-muted transition-colors hover:text-page-text">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </button>
            <BadgesTab onBadgeClick={() => setBadgeDetailOpen(true)} />
          </>
        ) : (
        <>
        {/* ── TIER CARD ── */}
        <div className={cn(cardCls, "relative isolate flex flex-col items-center gap-4 overflow-hidden p-4")}>
          <TierParticles />

          {/* Header row */}
          <div className="relative z-10 flex w-full items-center gap-4">
            <div className="flex flex-1 items-center gap-1.5">
              <span className="text-sm font-medium leading-none">Your tier</span>
            </div>
            <button onClick={() => setPerksOpen(true)} className="cursor-pointer text-xs font-medium leading-none text-page-text-muted transition-colors hover:text-page-text">View perks</button>
          </div>

          {/* Badge + tier name + fee */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <TierBadge />
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl font-medium leading-none">Recruit</span>
              <span className="text-sm font-medium leading-none">8% platform fee</span>
            </div>
            {/* XP + badges pills */}
            <div className="flex items-start gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white px-2.5 py-2 dark:bg-card-bg">
                <StarIcon className="size-4" />
                <span className="text-sm font-medium leading-none">320<span className="text-page-text-muted">/500</span> XP</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white px-2.5 py-2 dark:bg-card-bg">
                <MedalIcon className="size-4" />
                <span className="text-sm font-medium leading-none">16/30 badges</span>
              </div>
            </div>
          </div>

          {/* Tier progress track */}
          <div className="relative z-10 flex w-full flex-col gap-2">
            {/* Progress bar area with milestones */}
            <div className="relative h-[82px] w-full">
              {/* The XP bar sits at the bottom */}
              <div className="absolute bottom-0 left-0 right-0">
                <XpProgressBar progress={14} />
              </div>
              {/* Avatar pin — absolutely positioned at progress % along the bar, aligned to bottom like milestones */}
              <div className="pointer-events-none absolute inset-x-3 top-0 bottom-0 z-20">
                <div className="absolute" style={{ left: "14%", bottom: -8, transform: "translateX(calc(-50% - 8px))" }}>
                  <AvatarPinMarker />
                </div>
              </div>
              {/* Milestone markers — spacer + 5 lock nodes */}
              <div className="absolute inset-x-0 top-0 bottom-0 flex items-end justify-between px-3">
                {/* Spacer for the first position (Recruit — current tier) */}
                <div style={{ width: 48, height: 80 }} />
                {[1, 2, 3, 4, 5].map((i) => (
                  <MilestoneNode key={i} />
                ))}
              </div>
            </div>
            {/* Tier labels — each in a w-8 cell matching milestone node width */}
            <div className="flex items-start justify-between px-3">
              {TIERS.map((name, i) => (
                <div
                  key={name}
                  className={cn("flex justify-center", i === CURRENT_TIER_INDEX ? "w-10" : "w-8")}
                >
                  <span
                    className={cn(
                      "whitespace-nowrap text-center text-xs tracking-[-0.02em]",
                      i === CURRENT_TIER_INDEX
                        ? "font-medium text-sm leading-none"
                        : "font-normal text-page-text-subtle leading-none"
                    )}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NEXT TIER CARD ── */}
        <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
          {/* Next tier row */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border border-dashed border-foreground/[0.12] bg-white dark:bg-card-bg">
              <LockIcon className="size-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="text-sm font-normal leading-none text-page-text-muted">Next: <span className="text-page-text">Operator</span></span>
              <span className="text-xs font-medium leading-none text-page-text-muted">7% platform fee</span>
            </div>
            <button className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium leading-none transition-colors hover:bg-foreground/[0.10]">
              Complete tasks
            </button>
          </div>

          <div className="h-px w-full bg-foreground/[0.06]" />

          {/* XP + Badges progress side by side */}
          <div className="flex items-center gap-3">
            {/* XP progress */}
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 py-1 dark:bg-card-bg">
                  <StarIcon className="size-3" />
                  <span className="text-xs font-medium leading-none">320<span className="text-page-text-muted">/500</span> XP</span>
                </div>
                <ChevronRightIcon className="size-3" />
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(229,113,0,0.08)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "82%",
                    background:
                      "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), linear-gradient(0deg, #FF6207, #FF6207), #E57100",
                  }}
                />
              </div>
            </div>

            <div className="h-10 w-px bg-foreground/[0.06]" />

            {/* Badges progress */}
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 py-1 dark:bg-card-bg">
                  <MedalIcon className="size-3" />
                  <span className="text-xs font-medium leading-none">3/5 badges</span>
                </div>
                <ChevronRightIcon className="size-3" />
              </div>
              <BadgesBar filled={3} total={5} />
            </div>
          </div>
        </div>

        {/* ── QUESTS CARD ── */}
        <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex flex-1 items-center gap-1.5">
              <span className="text-sm font-medium leading-none tracking-[-0.02em] text-page-text">Your quests</span>
            </div>
            <button onClick={() => setRewardsTab("badges")} className="cursor-pointer text-xs font-medium leading-none tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text">View all</button>
          </div>
          {/* Quest rows — individual cards inside the wrapper */}
          <div className="flex flex-col gap-2">
            <QuestItem
              icon={<VideoIcon className="size-4" />}
              title="Submit a new clip"
              description="Keep the momentum going. Your campaigns are waiting for content."
              xp="50 XP"
            />
            <QuestItem
              icon={<FlameIcon className="size-4" color="#E57100" />}
              title="7-day streak"
              description="Keep submitting daily. 1 day left!"
              xp="500 XP"
            />
            <QuestItem
              icon={<MedalIcon className="size-4" color="rgba(37,37,37,0.5)" />}
              title="Brand Explorer"
              titleColor="#ED1285"
              description="Join 2 more campaigns to complete."
              xp="100 XP"
            />
            <div onClick={() => setBadgeDetailOpen(true)}>
              <QuestItem
                icon={<MedalIcon className="size-4" color="rgba(37,37,37,0.5)" />}
                title="Platform Master"
                titleColor="#ED1285"
                description="Submit content on 2 more platforms."
                xp="100 XP"
              />
            </div>
          </div>
        </div>

        {/* ── STREAK CARD ── */}
        <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex flex-1 items-center gap-1.5">
              <span className="text-sm font-medium leading-none">Your streak</span>
            </div>
            <span className="cursor-pointer text-xs font-medium leading-none text-page-text-muted transition-colors hover:text-page-text">View rewards</span>
          </div>

          {/* Big streak number + next reward */}
          <div className="flex flex-col items-start gap-2 pb-1">
            <span className="text-5xl font-medium leading-none">4<span className="text-page-text-muted">d</span></span>
            <div className="flex items-center gap-1 text-xs leading-none tracking-[-0.02em]">
              <span className="text-page-text-muted">Next reward</span>
              <div className="flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 py-1 dark:bg-card-bg">
                <StarIcon className="size-3" />
                <span className="font-medium">100 XP</span>
              </div>
              <span className="text-page-text-muted">in 3 days.</span>
            </div>
          </div>

          {/* Calendar card */}
          <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
            {/* Week navigation */}
            <div className="flex items-center justify-between">
              <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06]">
                <ChevronLeftIcon className="size-3" />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium leading-none">March 23 - 29</span>
                <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-[#E57100]" />
                  <span className="text-sm font-medium leading-none text-[#E57100]">Current</span>
                </div>
              </div>
              <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06]">
                <ChevronRightIcon className="size-3" />
              </button>
            </div>

            <div className="h-px w-full bg-foreground/[0.06]" />

            {/* Day labels */}
            <div className="flex items-center justify-between">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="flex w-[69px] items-center justify-center">
                  <span className="text-xs font-medium leading-none text-page-text-subtle">{d}</span>
                </div>
              ))}
            </div>

            {/* Day circles */}
            <div className="flex items-start justify-between">
              <StreakDay date={23} active={false} />
              <StreakDay date={24} active />
              <StreakDay date={25} active reward="50 XP" />
              <StreakDay date={26} active />
              <StreakDay date={27} current active />
              <StreakDay date={28} future />
              <StreakDay date={29} future reward="100 XP" />
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {/* Drawers */}
      <PerksDrawer open={perksOpen} onClose={() => setPerksOpen(false)} />
      <BadgeDetailDrawer open={badgeDetailOpen} onClose={() => setBadgeDetailOpen(false)} />
    </div>
  );
}

/* ─── Badges Tab ─── */
function BadgesTab({ onBadgeClick }: { onBadgeClick?: () => void }) {
  return (
    <div className={cn(cardCls, "flex flex-col items-center gap-4 p-4")}>
      {BADGE_TIERS.map((tier) => (
        <BadgeTierSection key={tier.name} tier={tier} onBadgeClick={onBadgeClick} />
      ))}
    </div>
  );
}

/* ─── Badge Tier Section ─── */
function BadgeTierSection({ tier, onBadgeClick }: { tier: typeof BADGE_TIERS[number]; onBadgeClick?: () => void }) {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Tier header */}
      <div className="flex items-center gap-3">
        {/* Tier icon */}
        {tier.unlocked ? (
          <div className="relative size-10">
            <svg width="42" height="42" viewBox="0 0 43 43" fill="none" className="absolute -left-[1px] -top-[1px]">
              <defs>
                <linearGradient id={`tsg-${tier.name}`} x1="21.5" y1="0" x2="21.5" y2="43" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF8B1A" /><stop offset="1" stopColor="#E57100" />
                </linearGradient>
              </defs>
              <path d="M18.56 1.95C19.59.87 20.1.33 20.69.13 21.22-.04 21.78-.04 22.31.13c.6.2 1.11.74 2.13 1.82l6.26 6.6c.19.2.29.31.39.4.1.08.2.15.3.22.12.07.25.13.5.25l8.22 3.92c1.34.64 2.01.96 2.39 1.46.33.44.5.98.5 1.54-.01.63-.36 1.28-1.07 2.59l-4.34 8c-.13.25-.2.37-.25.5-.05.11-.09.23-.12.35-.03.14-.05.28-.08.55l-1.19 9.03c-.19 1.47-.29 2.21-.66 2.72-.32.45-.78.78-1.3.95-.6.19-1.33.05-2.79-.22l-8.95-1.66c-.28-.05-.41-.08-.55-.09-.12-.01-.25-.01-.37 0-.14.01-.28.04-.55.09l-8.95 1.66c-1.46.27-2.19.41-2.79.22-.53-.17-.99-.5-1.31-.95-.36-.51-.46-1.25-.66-2.72L5.87 28.33c-.04-.28-.05-.42-.09-.55-.03-.12-.07-.24-.12-.35-.05-.13-.12-.25-.25-.5l-4.34-8C.36 17.62.01 16.97 0 16.34c-.01-.55.17-1.09.5-1.54.37-.5 1.04-.82 2.39-1.46l8.22-3.92c.25-.12.38-.18.5-.25.1-.07.21-.14.3-.22.1-.09.2-.19.4-.4l6.26-6.6Z" fill={`url(#tsg-${tier.name})`} stroke="currentColor" strokeOpacity="0.06" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="18" height="16" viewBox="0 0 21 18" fill="none">
                <path d="M13.49.11c.32-.16.7-.14 1 .05.31.19.49.52.49.88v1.88l.01.02 4.32-2.48c.41-.24.86.27.57.65l-3.41 4.45 1.46 2.55c.32.57.5 1.21.5 1.86v.63c0 1.73-1.4 3.12-3.12 3.12-.48 0-.96-.11-1.4-.33l-1.75-.88c.14.76.24 1.68.24 2.76 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-1.41-.2-2.5-.4-3.23-.09-.34-.18-.6-.25-.78-.59-.37-1.07-.89-1.38-1.51-.39-.81-.5-1.73-.28-2.6l.19-.74c.14-.55.7-.89 1.25-.75.55.14.89.7.75 1.25l-.19.74c-.1.39-.05.81.13 1.18.17.33.43.6.76.76l3.91 1.96c.15.07.31.11.47.11.58 0 1.06-.47 1.06-1.06v-.63c0-.29-.08-.58-.22-.84l-3.09-5.4c-.09-.16-.14-.33-.14-.51v-.48l-1.09.54c-.19.09-.4.13-.61.1-2.59-.37-4.61.71-6.04 2.52-1.45 1.84-2.25 4.41-2.25 6.79 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-2.79.92-5.82 2.7-8.07C5.3 2.38 7.9.91 11.19 1.26l2.3-1.15Z" fill="currentColor" fillOpacity="0.8" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full border border-dashed border-foreground/[0.12] bg-white dark:border-[rgba(224,224,224,0.08)] dark:bg-[rgba(224,224,224,0.03)]">
            <LockIcon className="size-5" />
          </div>
        )}
        {/* Name + fee */}
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{tier.name}</span>
          <span className="text-xs font-medium tracking-[-0.02em] text-page-text-subtle">{tier.fee}</span>
        </div>
        {/* Badge count pill */}
        <div className="flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 py-1.5 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
          <MedalIcon className="size-3" color="#ED1285" />
          <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{tier.earned}/{tier.total} badges</span>
        </div>
      </div>

      {/* Badge grid */}
      <div className={cn(cardCls, "flex items-center gap-4 p-4")}>
        {tier.badges.map((badge) => (
          <div key={badge.name} onClick={onBadgeClick} className="flex flex-1 cursor-pointer flex-col items-center gap-4 transition-opacity hover:opacity-80">
            {/* Badge circle */}
            {badge.earned ? (
              <div className="size-20 rounded-full border border-foreground/[0.06] bg-gray-200 shadow-[0_0_0_1.8px_#fff] dark:border-[rgba(224,224,224,0.06)] dark:bg-[rgba(224,224,224,0.06)] dark:shadow-[0_0_0_1.8px_var(--card-bg)]" />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full border border-dashed border-foreground/[0.12] bg-white dark:border-[rgba(224,224,224,0.08)] dark:bg-[rgba(224,224,224,0.03)]">
                <LockIcon className="size-9" />
              </div>
            )}
            {/* Label */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-center text-sm font-medium tracking-[-0.02em] text-page-text">{badge.name}</span>
              <span className="text-center text-xs font-medium leading-[120%] tracking-[-0.02em] text-page-text-subtle">{badge.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
