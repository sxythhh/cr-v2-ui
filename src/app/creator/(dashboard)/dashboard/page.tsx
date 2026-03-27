"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";

// ── Inline Icons ────────────────────────────────────────────────────

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className}>
      <path d="M9 1.5C4.86 1.5 1.5 4.36 1.5 7.88C1.5 9.84 2.58 11.58 4.25 12.7L3.5 15.5L6.72 13.98C7.44 14.16 8.2 14.26 9 14.26C13.14 14.26 16.5 11.4 16.5 7.88C16.5 4.36 13.14 1.5 9 1.5Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className}>
      <path d="M9 1.5C9.534 1.5 10.051 1.577 10.54 1.72C10.193 2.099 9.941 2.567 9.824 3.086C9.558 3.03 9.282 3 9 3C6.879 3 5.13 4.663 5.024 6.781L4.898 9.316C4.877 9.73 4.77 10.137 4.585 10.508L3.839 12H14.161L13.415 10.508C13.229 10.137 13.123 9.73 13.102 9.316L12.976 6.781C12.975 6.768 12.973 6.754 12.972 6.74C13.509 6.701 14.007 6.521 14.429 6.236C14.45 6.391 14.466 6.548 14.474 6.707L14.601 9.241C14.611 9.448 14.664 9.651 14.757 9.837L15.606 11.536C15.701 11.725 15.75 11.933 15.75 12.144C15.75 12.893 15.143 13.5 14.394 13.5H12.674C12.327 15.212 10.814 16.5 9 16.5C7.186 16.5 5.673 15.212 5.325 13.5H3.606C2.904 13.5 2.327 12.966 2.257 12.282L2.25 12.144L2.259 11.986C2.277 11.83 2.323 11.678 2.394 11.536L3.243 9.837C3.336 9.651 3.389 9.448 3.399 9.241L3.526 6.707C3.672 3.79 6.08 1.5 9 1.5ZM6.88 13.5C7.189 14.374 8.021 15 9 15C9.979 15 10.811 14.374 11.12 13.5H6.88Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 0L9.79 6.21L16 8L9.79 9.79L8 16L6.21 9.79L0 8L6.21 6.21L8 0Z" fill="currentColor" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 14.4L6.84 13.36C2.72 9.6 0 7.12 0 4.08C0 1.6 1.936 0 4.08 0C5.296 0 6.464 0.56 8 2.08C9.536 0.56 10.704 0 11.92 0C14.064 0 16 1.6 16 4.08C16 7.12 13.28 9.6 9.16 13.36L8 14.4Z" fill="currentColor" />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M12.5 1H3.5V2H1V5C1 6.1 1.9 7 3 7H3.2C3.6 8.4 4.8 9.5 6.3 9.8V12H4V14H12V12H9.7V9.8C11.2 9.5 12.4 8.4 12.8 7H13C14.1 7 15 6.1 15 5V2H12.5V1ZM3 5V3.5H3.5V5.6C3.2 5.4 3 5.2 3 5ZM13 5C13 5.2 12.8 5.4 12.5 5.6V3.5H13V5Z" fill="currentColor" />
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 26 30" fill="none" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M11.4863 1.26534C12.363 0.013032 14.1221 -0.439661 15.4959 0.504976C16.9234 1.4865 19.392 3.38354 21.5167 6.04663C23.6403 8.70841 25.5 12.2384 25.5 16.4471C25.5 23.9432 19.8717 29.9471 12.75 29.9471C5.62834 29.9471 0 23.9432 0 16.4471C0 13.3941 1.31112 9.49318 3.8663 6.37882C4.9858 5.01433 6.91749 5.09571 8.0461 6.17996L11.4863 1.26534ZM12.75 26.9471C14.9246 26.9471 16.6875 24.9348 16.6875 22.4526C16.6875 19.7889 14.6157 17.8297 13.4778 16.9544C13.0433 16.6203 12.4567 16.6203 12.0222 16.9544C10.8843 17.8297 8.8125 19.7889 8.8125 22.4526C8.8125 24.9348 10.5754 26.9471 12.75 26.9471Z" fill="#FB923C"/>
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightSmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4.5 1.5V3M9.5 1.5V3M1.5 5.5H12.5M2.5 2.25H11.5C12.0523 2.25 12.5 2.69772 12.5 3.25V11.5C12.5 12.0523 12.0523 12.5 11.5 12.5H2.5C1.94772 12.5 1.5 12.0523 1.5 11.5V3.25C1.5 2.69772 1.94772 2.25 2.5 2.25Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="8" fill="#00994D" />
      <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Card wrapper ────────────────────────────────────────────────────

const cardClass =
  "rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none";

// ── Mock data ───────────────────────────────────────────────────────

const campaigns = [
  { name: "Cantina - TikTok Clips", meta: "46 clips · $3.50 CPM · 5.1M views", earned: "$27,910", color: "#FF6B6B" },
  { name: "NovaBrew Coffee", meta: "12 clips · $4.20 CPM · 1.8M views", earned: "$7,560", color: "#4ECDC4" },
  { name: "FitPulse Wearables", meta: "8 clips · $5.00 CPM · 920K views", earned: "$4,600", color: "#45B7D1" },
  { name: "UrbanBite Delivery", meta: "22 clips · $2.80 CPM · 3.2M views", earned: "$8,960", color: "#96CEB4" },
  { name: "SkyTravel Promo", meta: "5 clips · $6.00 CPM · 410K views", earned: "$2,460", color: "#FFEAA7" },
];

const activities = [
  { icon: "thumbup", title: "Clip approved", desc: "Street interview #45 · Cantina", time: "4h ago" },
  { icon: "dollar", title: "Payout received", desc: "+ $42.50 via PayPal", time: "4h ago" },
  { icon: "eye", title: "Viral clip!", desc: "1.2M views on Flooz Clipping", time: "2h ago" },
  { icon: "heart", title: "Trust score updated", desc: "92 (+2 from last week)", time: "4h ago" },
  { icon: "video", title: "Clip submitted", desc: "Street interview #46 · The Ritz", time: "1d ago" },
];

const linkedAccounts = [
  { platform: "TikTok", handle: "@vladclips", followers: "224K followers", connected: true },
  { platform: "Instagram", handle: "@vladclips", followers: "224K followers", connected: true },
  { platform: "YouTube", handle: null, followers: null, connected: false },
  { platform: "X (Twitter)", handle: null, followers: null, connected: false },
];

// ── Earnings chart data ──────────────────────────────────────────────

const EARNINGS_CHART_POINTS = [
  { index: 0, label: "Jan 5", views: 4200, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 1, label: "Jan 8", views: 3800, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 2, label: "Jan 11", views: 5100, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 3, label: "Jan 14", views: 4600, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 4, label: "Jan 17", views: 6200, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 5, label: "Jan 20", views: 5800, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 6, label: "Jan 23", views: 7100, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 7, label: "Jan 27", views: 8200, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 8, label: "Jan 30", views: 9100, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 9, label: "Feb 2", views: 10200, engagement: 0, likes: 0, comments: 0, shares: 0 },
  { index: 10, label: "Feb 5", views: 11289, engagement: 0, likes: 0, comments: 0, shares: 0 },
];

const EARNINGS_CHART_DATA: AnalyticsPocPerformanceLineChartData = {
  datasets: {
    daily: EARNINGS_CHART_POINTS,
    cumulative: EARNINGS_CHART_POINTS,
  },
  leftDomain: [0, 12000],
  rightDomain: [0, 12000],
  yLabels: ["$12k", "$9k", "$6k", "$3k", "$0"],
  rightYLabels: [],
  series: [
    { axis: "left" as const, color: "#00994D", domain: [0, 12000], key: "views" as const, label: "Earnings", tooltipValueType: "currency" as const, yLabels: ["$12k", "$9k", "$6k", "$3k", "$0"] },
  ],
  xTicks: [
    { index: 0, label: "Jan 5" },
    { index: 2, label: "Jan 11" },
    { index: 4, label: "Jan 17" },
    { index: 6, label: "Jan 23" },
    { index: 8, label: "Jan 30" },
    { index: 10, label: "Feb 5" },
  ],
};

const DATE_RANGE_OPTIONS = [
  { value: "last-week", label: "Last week" },
  { value: "last-month", label: "Last month" },
  { value: "last-3-months", label: "Last 3 months" },
  { value: "last-year", label: "Last year" },
];

// ── Activity icon helper ────────────────────────────────────────────

function ActivityIcon({ type }: { type: string }) {
  const iconContent: Record<string, React.ReactNode> = {
    thumbup: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5.55904 0.0118772C5.34084 -0.0410324 5.1252 0.0880534 5.03864 0.295224C4.5 2.23792 3 3.26542 3 4.62287V7.85053C3 8.42375 3.33181 8.98816 3.9178 9.20155C5.24322 9.68419 6.11676 9.7824 7.47978 9.66428C8.5252 9.57368 9.31106 8.77216 9.52885 7.8042L9.95122 5.92697C10.2326 4.67657 9.28167 3.48795 8 3.48795L6.5 3.48792C6.73464 2.08008 7.30751 0.435851 5.55904 0.0118772Z" fill="currentColor"/>
        <path d="M0 4.48792C0 4.0737 0.335787 3.73792 0.75 3.73792H1.75C2.16421 3.73792 2.5 4.0737 2.5 4.48792V8.48792C2.5 8.90213 2.16421 9.23792 1.75 9.23792H0.75C0.335787 9.23792 0 8.90213 0 8.48792V4.48792Z" fill="currentColor"/>
      </svg>
    ),
    dollar: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5ZM5 1.75C5.27614 1.75 5.5 1.97386 5.5 2.25V2.56183C5.90202 2.66355 6.25675 2.88729 6.48795 3.20702C6.64975 3.4308 6.59952 3.74337 6.37575 3.90517C6.15198 4.06698 5.83941 4.01675 5.6776 3.79298C5.56897 3.64274 5.32671 3.5 5 3.5H4.86111C4.41372 3.5 4.25 3.77246 4.25 3.88889V3.92705C4.25 4.02568 4.32456 4.19131 4.57627 4.29199L5.79512 4.77953C6.32859 4.99292 6.75 5.4693 6.75 6.07295C6.75 6.80947 6.1615 7.3072 5.5 7.45453V7.75C5.5 8.02614 5.27614 8.25 5 8.25C4.72386 8.25 4.5 8.02614 4.5 7.75V7.43817C4.09798 7.33645 3.74325 7.11271 3.51205 6.79298C3.35025 6.56921 3.40048 6.25663 3.62425 6.09483C3.84802 5.93302 4.1606 5.98325 4.3224 6.20703C4.43103 6.35726 4.67329 6.5 5 6.5H5.09119C5.56492 6.5 5.75 6.21045 5.75 6.07295C5.75 5.97432 5.67544 5.80869 5.42373 5.70801L4.20488 5.22047C3.67141 5.00708 3.25 4.5307 3.25 3.92705V3.88889C3.25 3.15689 3.84468 2.66952 4.5 2.53666V2.25C4.5 1.97386 4.72386 1.75 5 1.75Z" fill="currentColor"/>
      </svg>
    ),
    eye: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 2C2.90909 2 1.18182 3.36364 0 5C1.18182 6.63636 2.90909 8 5 8C7.09091 8 8.81818 6.63636 10 5C8.81818 3.36364 7.09091 2 5 2ZM5 7C6.10457 7 7 6.10457 7 5C7 3.89543 6.10457 3 5 3C3.89543 3 3 3.89543 3 5C3 6.10457 3.89543 7 5 7Z" fill="currentColor"/>
      </svg>
    ),
    heart: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 8.5L1.5 5C0.5 4 0.5 2.5 1.5 1.5C2.5 0.5 4 0.5 5 1.5C6 0.5 7.5 0.5 8.5 1.5C9.5 2.5 9.5 4 8.5 5L5 8.5Z" fill="currentColor"/>
      </svg>
    ),
    video: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 2.5C0 1.39543 0.895431 0.5 2 0.5H6C7.10457 0.5 8 1.39543 8 2.5V3.38L9.55279 2.60361C9.67698 2.54151 9.82258 2.54391 9.94474 2.60997C10.0669 2.67603 10.1459 2.79705 10.1584 2.93341L10.5 7.06659C10.5125 7.20295 10.4565 7.33602 10.3502 7.42328C10.2438 7.51054 10.1012 7.54076 9.96821 7.5046L8 7V7.5C8 8.60457 7.10457 9.5 6 9.5H2C0.895431 9.5 0 8.60457 0 7.5V2.5Z" fill="currentColor"/>
      </svg>
    ),
  };
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] bg-white backdrop-blur-[16px] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
      <span className="text-page-text-muted">{iconContent[type] || iconContent.thumbup}</span>
    </div>
  );
}

// ── Platform icon helper ────────────────────────────────────────────

function LinkedPlatformIcon({ platform }: { platform: string }) {
  const icons: Record<string, React.ReactNode> = {
    TikTok: (
      <svg width="12" height="12" viewBox="0 0 9 10" fill="none"><path d="M8.71705 4.10671C7.82723 4.10671 7.00339 3.82398 6.33063 3.34349V6.83632C6.33063 8.58357 4.91349 10 3.16538 10C2.51313 10 1.9069 9.80288 1.40329 9.4649C0.55712 8.89703 0 7.9315 0 6.83629C0 5.08914 1.41718 3.67271 3.16543 3.67275C3.31072 3.67268 3.45582 3.68255 3.59975 3.70221V5.452C3.46114 5.40806 3.31346 5.38422 3.16023 5.38422C2.36052 5.38422 1.71235 6.03217 1.71235 6.83135C1.71235 7.39641 2.03634 7.88571 2.50881 8.12405C2.70471 8.22282 2.92596 8.27845 3.16025 8.27845C3.95832 8.27845 4.60538 7.63314 4.60813 6.83629V0H6.33061V0.220145C6.33669 0.285959 6.34545 0.351524 6.35685 0.416659C6.4764 1.09819 6.88411 1.68047 7.45002 2.03343C7.83003 2.27052 8.26916 2.39585 8.71706 2.39517L8.71705 4.10671Z" fill="#000000"/></svg>
    ),
    Instagram: (
      <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M4.75 0.855864C6.01825 0.855864 6.16852 0.860614 6.66943 0.8835C6.97056 0.887137 7.26883 0.942495 7.55121 1.04716C7.75756 1.12331 7.94422 1.24475 8.09746 1.40255C8.25525 1.55578 8.37669 1.74244 8.45284 1.9488C8.55751 2.23117 8.61286 2.52944 8.6165 2.83057C8.63939 3.33148 8.64414 3.48175 8.64414 4.75C8.64414 6.01825 8.63939 6.16852 8.6165 6.66943C8.61286 6.97056 8.55751 7.26883 8.45284 7.55121C8.37382 7.7561 8.25276 7.94219 8.09747 8.09747C7.94219 8.25276 7.7561 8.37382 7.55121 8.45284C7.26883 8.55751 6.97056 8.61286 6.66943 8.6165C6.16852 8.63939 6.01825 8.64414 4.75 8.64414C3.48175 8.64414 3.33148 8.63939 2.83057 8.6165C2.52929 8.61291 2.23088 8.55756 1.94836 8.45284C1.74216 8.37663 1.55566 8.2552 1.40255 8.09746C1.24475 7.94422 1.12331 7.75756 1.04716 7.55121C0.942495 7.26883 0.887137 6.97056 0.8835 6.66943C0.860614 6.16852 0.855864 6.01825 0.855864 4.75C0.855864 3.48175 0.860614 3.33148 0.8835 2.83057C0.887137 2.52944 0.942495 2.23117 1.04716 1.9488C1.12331 1.74244 1.24475 1.55578 1.40255 1.40255C1.55578 1.24475 1.74244 1.12331 1.9488 1.04716C2.23117 0.942495 2.52944 0.887137 2.83057 0.8835C3.33148 0.860614 3.48175 0.855864 4.75 0.855864ZM4.75 0C3.46016 0 3.29823 0.00561363 2.7917 0.0285C2.39768 0.0363607 2.00783 0.110971 1.63875 0.249159C1.32165 0.368548 1.03443 0.555706 0.797136 0.797568C0.555482 1.03478 0.368477 1.32185 0.249159 1.63875C0.111118 2.00786 0.0366543 2.3977 0.0289318 2.7917C0.00518183 3.29823 0 3.46016 0 4.75C0 6.03984 0.00561363 6.20177 0.0285 6.7083C0.0363607 7.10232 0.110971 7.49217 0.249159 7.86125C0.368548 8.17835 0.555706 8.46557 0.797568 8.70286C1.03478 8.94452 1.32185 9.13152 1.63875 9.25084C2.00786 9.38888 2.3977 9.46335 2.7917 9.47107C3.29823 9.49482 3.46016 9.5 4.75 9.5C6.03984 9.5 6.20177 9.49439 6.7083 9.4715C7.10232 9.46364 7.49217 9.38903 7.86125 9.25084C8.1769 9.1288 8.46356 8.94215 8.70285 8.70285C8.94215 8.46356 9.1288 8.1769 9.25084 7.86125C9.38888 7.49214 9.46335 7.1023 9.47107 6.7083C9.49482 6.20177 9.5 6.03984 9.5 4.75C9.5 3.46016 9.49439 3.29823 9.4715 2.7917C9.46364 2.39768 9.38903 2.00783 9.25084 1.63875C9.13145 1.32165 8.9443 1.03443 8.70243 0.797136C8.46522 0.555482 8.17816 0.368477 7.86125 0.249159C7.49214 0.111118 7.1023 0.0366543 6.7083 0.0289318C6.20177 0.00518183 6.03984 0 4.75 0ZM4.75 2.31066C3.40269 2.31066 2.31066 3.40269 2.31066 4.75C2.31066 6.09731 3.40269 7.18934 4.75 7.18934C6.09731 7.18934 7.18934 6.09731 7.18934 4.75C7.18934 3.40269 6.09731 2.31066 4.75 2.31066ZM4.75 6.33348C3.87478 6.33348 3.16652 5.62522 3.16652 4.75C3.16652 3.87478 3.87478 3.16652 4.75 3.16652C5.62522 3.16652 6.33348 3.87478 6.33348 4.75C6.33348 5.62522 5.62522 6.33348 4.75 6.33348Z" fill="#962FBF"/></svg>
    ),
    YouTube: (
      <svg width="12" height="12" viewBox="0 0 12 9" fill="none"><path d="M11.7519 1.40906C11.6155 0.889053 11.211 0.479798 10.6974 0.341535C9.76619 0.09375 6 0.09375 6 0.09375C6 0.09375 2.23381 0.09375 1.30262 0.341535C0.789015 0.479813 0.384525 0.889053 0.248085 1.40906C0.00244141 2.3507 0.00244141 4.3125 0.00244141 4.3125C0.00244141 4.3125 0.00244141 6.2743 0.248085 7.21594C0.384525 7.73594 0.789015 8.12769 1.30262 8.26594C2.23381 8.50312 6 8.50312 6 8.50312C6 8.50312 9.76619 8.50312 10.6974 8.26594C11.211 8.12769 11.6155 7.73594 11.7519 7.21594C11.9976 6.2743 11.9976 4.3125 11.9976 4.3125C11.9976 4.3125 11.9976 2.3507 11.7519 1.40906ZM4.79297 6.21094V2.41406L7.90234 4.3125L4.79297 6.21094Z" fill="#FF0000"/></svg>
    ),
    "X (Twitter)": (
      <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M5.94831 4.23544L9.67493 0H8.7951L5.55942 3.67608L2.97512 0H0L3.90029 5.55962L0 10H0.879893L4.28904 6.11898L7.02488 10H10L5.94831 4.23544ZM4.73396 5.61132L4.3414 5.05626L1.19672 0.65H2.55554L5.08309 4.20841L5.47564 4.76347L8.7951 9.38H7.43628L4.73396 5.61132Z" fill="#000000"/></svg>
    ),
  };
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] bg-white shadow-[0_0_0_1.14px_#fff] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-[0_0_0_1.14px_#1C1C1C]">
      {icons[platform] || <span className="text-xs text-page-text-muted">{platform[0]}</span>}
    </div>
  );
}

// ── Page Component ──────────────────────────────────────────────────

export default function CreatorDashboardPage() {
  const [dateRange, setDateRange] = useState("last-month");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page-bg font-inter tracking-[-0.02em]">
      {/* Header */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-center border-b border-foreground/[0.06] bg-page-bg">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Dashboard</span>
        <div className="absolute right-4 flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10]">
            <ChatIcon />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10]">
            <BellIcon />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1068px] p-5">
        <div className="flex flex-col gap-4">
          {/* ── 1. KPI Cards ──────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {/* Approval Rate */}
            <div className={cn(cardClass, "flex flex-col gap-2 p-3")}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium tabular-nums text-page-text">94%</span>
                <span className="text-xs tabular-nums text-page-text-muted">18/20 clips</span>
              </div>
              <span className="text-xs text-page-text-subtle">Approval rate</span>
            </div>

            {/* Earned */}
            <div className={cn(cardClass, "flex flex-col gap-2 p-3")}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium tabular-nums" style={{ color: "#00994D" }}>$148.50</span>
                <span className="text-xs font-medium tabular-nums" style={{ color: "#00994D" }}>+$32</span>
              </div>
              <span className="text-xs text-page-text-subtle">Earned this week</span>
            </div>

            {/* Views */}
            <div className={cn(cardClass, "flex flex-col gap-2 p-3")}>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium tabular-nums text-page-text">2.96M</span>
                <span className="text-xs font-medium tabular-nums" style={{ color: "#FF3355" }}>-4%</span>
              </div>
              <span className="text-xs text-page-text-subtle">Views</span>
            </div>

            {/* Streak */}
            <div
              className={cn(cardClass, "relative flex flex-col gap-2 overflow-hidden border-0 p-3")}
              style={{ background: "linear-gradient(82.38deg, rgba(255,255,255,0.2) 75%, rgba(253,186,116,0.2) 100%)" }}
            >
              <div className="absolute right-3 top-3 opacity-80">
                <FireIcon />
              </div>
              <span className="text-sm font-medium tabular-nums text-page-text">6 days</span>
              <span className="text-xs text-page-text-subtle">Streak</span>
            </div>
          </div>

          {/* ── 2. AI Insights + Trust Score ──────────────────── */}
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* AI Insights */}
            <div className={cn(cardClass, "relative isolate min-h-[184px] flex-1 overflow-hidden p-4 lg:flex-[1.28]")}>
              {/* Header */}
              <div className="relative z-[1] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <SparkleIcon className="text-page-text-muted" />
                  <span className="text-sm tracking-[-0.02em] text-page-text-muted">AI Insights</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-page-text">
                  <button className="flex size-4 cursor-pointer items-center justify-center">
                    <ChevronLeftIcon />
                  </button>
                  <span className="tabular-nums text-sm tracking-[-0.02em]">1/3</span>
                  <button className="flex size-4 cursor-pointer items-center justify-center">
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
              {/* Body */}
              <div className="relative z-[1] mt-6 flex flex-col gap-3">
                <div className="flex max-w-[320px] flex-col gap-1.5">
                  <h3 className="text-sm font-medium tracking-[-0.02em] text-page-text">3 clips under review</h3>
                  <p className="text-sm leading-[140%] tracking-[-0.02em] text-page-text-muted">
                    3 of the 4 clips you&apos;ve submitted are currently under review. Keep up the great work!
                  </p>
                </div>
                <button className="flex h-9 w-fit cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-3 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">
                  View status
                </button>
              </div>
              {/* Stacked video thumbnails — fanned out */}
              <div className="pointer-events-none absolute right-4 top-[41px] hidden h-[160px] w-[198px] sm:block" style={{ zIndex: 2 }}>
                {/* Back card — slight left tilt */}
                <div
                  className="absolute rounded-xl border border-[rgba(37,37,37,0.1)] bg-gradient-to-br from-[#E8D5F5] to-[#D5C0EA] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(255,255,255,0.1)] dark:from-[#3a2d4a] dark:to-[#2d2340]"
                  style={{ width: 120, height: 190, left: 0, top: 0, transform: "matrix(1, -0.07, 0.07, 1, 0, 0)" }}
                />
                {/* Middle card — slight right tilt */}
                <div
                  className="absolute rounded-xl border border-[rgba(37,37,37,0.1)] bg-gradient-to-br from-[#D5E8F5] to-[#C0D5EA] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(255,255,255,0.1)] dark:from-[#2d3a4a] dark:to-[#233040]"
                  style={{ width: 120, height: 190, left: 18, top: 20, transform: "matrix(0.99, 0.14, -0.14, 0.99, 0, 0)" }}
                />
                {/* Front card — more right tilt */}
                <div
                  className="absolute rounded-xl border border-[rgba(37,37,37,0.1)] bg-gradient-to-br from-[#F5E8D5] to-[#EAD5C0] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(255,255,255,0.1)] dark:from-[#4a3a2d] dark:to-[#403023]"
                  style={{ width: 120, height: 190, left: 30, top: 39, transform: "matrix(0.96, 0.28, -0.28, 0.96, 0, 0)" }}
                />
              </div>
            </div>

            {/* Trust Score */}
            <div className={cn(cardClass, "flex flex-row items-start gap-4 p-4 lg:flex-[1]")}>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <HeartIcon className="text-page-text-muted" />
                  <span className="text-xs font-medium text-page-text-muted">Trust score</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-page-text-muted">
                  Your content quality and engagement authenticity. Higher scores unlock better CPM rates.
                </p>
                <button className="mt-4 w-fit rounded-full bg-foreground/[0.06] px-3 py-1.5 text-xs font-medium text-page-text transition-colors hover:bg-foreground/[0.10]">
                  View breakdown
                </button>
              </div>
              <div className="relative flex h-[148px] w-[148px] shrink-0 items-center justify-center">
                <svg width="148" height="148" viewBox="0 0 148 148" className="absolute inset-0">
                  <circle cx="74" cy="74" r="70" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="4" />
                  <circle
                    cx="74"
                    cy="74"
                    r="70"
                    fill="none"
                    stroke="#00994D"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 70 * 0.92} ${2 * Math.PI * 70 * 0.08}`}
                    strokeLinecap="round"
                    transform="rotate(-90 74 74)"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-semibold tabular-nums tracking-tight text-page-text">92</span>
                  <span className="text-xs font-medium" style={{ color: "#00994D" }}>
                    Excellent
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 3. Rewards + Badges ──────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_280px]">
            {/* Rewards */}
            <div className={cn(cardClass, "p-4")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="text-page-text-muted" />
                  <span className="text-sm font-medium text-page-text-muted">Rewards</span>
                </div>
                <button className="flex items-center gap-0.5 text-xs font-medium text-page-text-muted transition-colors hover:text-page-text">
                  View all <ArrowRightSmallIcon />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white" style={{ backgroundColor: "#1A67E5" }}>
                  4
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "#1A67E5" }}>
                      Challenger <span className="text-xs font-normal text-page-text-subtle">· 53 influence</span>
                    </span>
                    <span className="text-sm font-medium" style={{ color: "#AE4EEE" }}>
                      Elite
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
                    <div className="h-full rounded-full" style={{ width: "76%", backgroundColor: "#1A67E5" }} />
                  </div>
                  <span className="mt-1 block text-xs text-page-text-subtle">17 points to go</span>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white" style={{ backgroundColor: "#AE4EEE" }}>
                  5
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className={cn(cardClass, "flex flex-col items-center overflow-hidden p-4")}>
              <div className="relative flex items-center gap-4">
                {/* Left gradient fade */}
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white dark:from-card-bg" />
                {/* Left side badge */}
                <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full bg-foreground/[0.04] opacity-50">
                  <span className="text-2xl">🏅</span>
                </div>
                {/* Center badge */}
                <div className="flex h-[136px] w-[136px] shrink-0 items-center justify-center rounded-full bg-foreground/[0.06]">
                  <span className="text-5xl">🎖️</span>
                </div>
                {/* Right side badge */}
                <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full bg-foreground/[0.04] opacity-50">
                  <span className="text-2xl">⭐</span>
                </div>
                {/* Right gradient fade */}
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white dark:from-card-bg" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button className="flex h-5 w-5 items-center justify-center rounded hover:bg-foreground/[0.06]">
                  <ChevronLeftIcon />
                </button>
                <span className="text-xs font-medium text-page-text">Two Week Warrior</span>
                <button className="flex h-5 w-5 items-center justify-center rounded hover:bg-foreground/[0.06]">
                  <ChevronRightIcon />
                </button>
              </div>
              <span className="mt-1 text-[11px] text-page-text-muted">14-day submission streak</span>
            </div>
          </div>

          {/* ── 4. Active Campaigns + Earnings ───────────────── */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[400px_1fr]">
            {/* Active Campaigns */}
            <div className={cn(cardClass, "relative overflow-hidden px-0 py-4")}>
              <div className="flex items-center justify-between px-4">
                <span className="text-xs font-medium text-page-text">Active campaigns</span>
                <button className="flex items-center gap-0.5 text-xs font-medium text-page-text-muted transition-colors hover:text-page-text">
                  View all <ArrowRightSmallIcon />
                </button>
              </div>
              <div className="mt-3 flex flex-col gap-2 px-4">
                {campaigns.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] px-4 py-3 dark:border-[rgba(224,224,224,0.03)]">
                    <div
                      className="size-8 shrink-0 rounded-[10px]"
                      style={{ backgroundColor: c.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-page-text">{c.name}</span>
                      <span className="block truncate text-xs text-page-text-subtle">{c.meta}</span>
                    </div>
                    <span className="shrink-0 text-sm font-medium tabular-nums text-page-text">{c.earned}</span>
                  </div>
                ))}
              </div>
              {/* Bottom fade */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-card-bg" />
            </div>

            {/* Earnings Chart */}
            <div className={cn(cardClass, "p-4")}>
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs tracking-[-0.02em] text-page-text-subtle">Earnings</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium tabular-nums tracking-[-0.02em] text-page-text">$11,289.16</span>
                    <span className="text-xs font-medium tabular-nums tracking-[-0.02em]" style={{ color: "#00994D" }}>+18.3%</span>
                  </div>
                </div>
                {/* Date range dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDateDropdownOpen((o) => !o)}
                    className="flex h-9 cursor-pointer items-center gap-2 rounded-full bg-foreground/[0.06] pl-[10px] pr-3 text-sm tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                  >
                    <CalendarIcon />
                    <span>{DATE_RANGE_OPTIONS.find((o) => o.value === dateRange)?.label}</span>
                    <ChevronDownIcon />
                  </button>
                  {dateDropdownOpen && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-foreground/[0.06] bg-white py-1 shadow-lg dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
                      {DATE_RANGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setDateRange(opt.value); setDateDropdownOpen(false); }}
                          className={cn(
                            "flex w-full cursor-pointer items-center px-3 py-2 text-sm tracking-[-0.02em] transition-colors hover:bg-foreground/[0.04]",
                            dateRange === opt.value ? "font-medium text-page-text" : "text-page-text-muted",
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <AnalyticsPocChartPlaceholder
                  variant="line"
                  chartStylePreset="performance-main"
                  lineChart={EARNINGS_CHART_DATA}
                  activeLineDataset="daily"
                  visibleMetricKeys={["earnings"]}
                  heightClassName="h-[200px]"
                />
              </div>
            </div>
          </div>

          {/* ── 5. Linked Accounts + Recent Activity ─────────── */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Linked Accounts */}
            <div className={cn(cardClass, "p-4")}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-page-text">Linked accounts</span>
                <span className="text-xs text-page-text-subtle">2/4 connected</span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {linkedAccounts.map((a) => (
                  <div key={a.platform} className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] p-3 dark:border-[rgba(224,224,224,0.03)]">
                    <LinkedPlatformIcon platform={a.platform} />
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-page-text">{a.platform}</span>
                      {a.connected ? (
                        <span className="block text-xs text-page-text-subtle">
                          {a.handle} · {a.followers}
                        </span>
                      ) : (
                        <span className="block text-xs text-page-text-subtle">Not connected</span>
                      )}
                    </div>
                    {a.connected ? (
                      <CheckCircleIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={cn(cardClass, "p-4")}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-page-text">Recent activity</span>
                <button className="flex items-center gap-0.5 text-xs font-medium text-page-text-muted transition-colors hover:text-page-text">
                  View all <ArrowRightSmallIcon />
                </button>
              </div>
              <div className="mt-3 flex flex-col">
                {activities.map((a) => (
                  <div key={a.title} className="flex items-center gap-3 py-1.5">
                    <ActivityIcon type={a.icon} />
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-page-text">{a.title}</span>
                      <span className="block truncate text-xs text-page-text-subtle">{a.desc}</span>
                    </div>
                    <span className="shrink-0 text-xs text-page-text-subtle">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
