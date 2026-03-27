"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

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

function FireStatIcon() {
  return (
    <svg width="24" height="28" viewBox="0 0 26 30" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.4863 1.26534C12.363 0.013032 14.1221 -0.439661 15.4959 0.504976C16.9234 1.4865 19.392 3.38354 21.5167 6.04663C23.6403 8.70841 25.5 12.2384 25.5 16.4471C25.5 23.9432 19.8717 29.9471 12.75 29.9471C5.62834 29.9471 0 23.9432 0 16.4471C0 13.3941 1.31112 9.49318 3.8663 6.37882C4.9858 5.01433 6.91749 5.09571 8.0461 6.17996L11.4863 1.26534ZM12.75 26.9471C14.9246 26.9471 16.6875 24.9348 16.6875 22.4526C16.6875 19.7889 14.6157 17.8297 13.4778 16.9544C13.0433 16.6203 12.4567 16.6203 12.0222 16.9544C10.8843 17.8297 8.8125 19.7889 8.8125 22.4526C8.8125 24.9348 10.5754 26.9471 12.75 26.9471Z" fill="#E57100" />
    </svg>
  );
}

function DollarStatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11ZM11 4C11.5523 4 12 4.44772 12 5V5.62366C12.804 5.82711 13.5135 6.2746 13.9759 6.91403C14.2995 7.3616 14.1984 7.98673 13.7515 8.31033C13.304 8.63396 12.6788 8.53351 12.3552 8.08596C12.1379 7.78547 11.6534 7.5 11 7.5H10.7222C9.82743 7.5 9.5 8.04493 9.5 8.27778V8.3541C9.5 8.55137 9.64912 8.88263 10.1525 9.08398L12.5902 10.0591C13.6572 10.4858 14.5 11.4386 14.5 12.6459C14.5 14.1189 13.323 15.1144 12 15.409V15.5C12 16.0523 11.5523 16.5 11 16.5C10.4477 16.5 10 16.0523 10 15.5V14.8763C9.19599 14.6729 8.4865 14.2254 8.0241 13.586C7.70048 13.1384 7.80096 12.5133 8.24853 12.1897C8.69603 11.866 9.3212 11.9665 9.64481 12.4141C9.86206 12.7145 10.3466 13 11 13H11.1824C12.1299 13 12.5 12.4209 12.5 12.1459C12.5 11.9486 12.3509 11.6174 11.8475 11.416L9.40976 10.4409C8.34282 10.0142 7.5 9.0614 7.5 7.8541V7.77778C7.5 6.31377 8.68936 5.33903 10 5.07332V5C10 4.44772 10.4477 4 11 4Z" fill="#00994D" />
    </svg>
  );
}

function WreathIcon() {
  return (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.81701 0.299071C5.57991 -0.0159923 5.13933 -0.0936489 4.80879 0.121362C3.64787 0.876533 2.84899 1.8028 2.64711 2.94104C2.53254 3.58705 2.62211 4.23445 2.87293 4.87554C2.49413 4.70401 2.07663 4.56812 1.62797 4.46352C1.24323 4.37383 0.854883 4.59796 0.740067 4.97596C0.338441 6.29821 0.325755 7.51944 0.906896 8.52013C1.15101 8.94049 1.48132 9.28987 1.88255 9.57705C1.44917 9.61344 0.998155 9.70551 0.534488 9.84471C0.1545 9.95879 -0.0709108 10.3491 0.0201697 10.7352C0.33748 12.0805 0.940531 13.1428 1.94488 13.7193C2.51376 14.0458 3.15371 14.1833 3.84333 14.1685C3.44007 14.3961 3.04412 14.696 2.66397 15.0739C2.37552 15.3606 2.3682 15.825 2.64748 16.1207C3.5035 17.0271 4.44251 17.6192 5.47103 17.7283C6.4391 17.8311 7.35108 17.4925 8.18875 16.8415C8.21224 16.9759 8.21675 17.1082 8.20213 17.2351C8.15393 17.6535 7.87953 18.1652 7.0481 18.5785C6.67718 18.7628 6.52596 19.213 6.71034 19.5839C6.89471 19.9548 7.34487 20.106 7.71578 19.9217C8.90433 19.3308 9.57447 18.4294 9.69228 17.4068C9.93223 15.3241 7.93567 13.6366 5.9737 13.6055C5.94689 13.6051 5.92004 13.605 5.89316 13.6051C6.01629 13.4344 6.06685 13.2134 6.01505 12.9938C5.74602 11.8532 5.27158 10.9161 4.5213 10.3059C4.64712 10.2132 4.74491 10.0806 4.79357 9.92041C5.17683 8.65863 5.20591 7.48884 4.70277 6.5149L4.7174 6.50562C5.87832 5.75045 6.6772 4.82419 6.87908 3.68594C7.08104 2.54724 6.64871 1.40422 5.81701 0.299071Z" fill="#AE4EEE" />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.1915 0.121362C15.861 -0.0936489 15.4204 -0.0159923 15.1833 0.299071C14.3516 1.40422 13.9192 2.54724 14.1212 3.68594C14.3231 4.82419 15.122 5.75045 16.2829 6.50562L16.2975 6.5149C15.7944 7.48884 15.8234 8.65863 16.2067 9.92041C16.2554 10.0806 16.3532 10.2132 16.479 10.3059C15.7287 10.9161 15.2543 11.8532 14.9852 12.9938C14.9334 13.2134 14.984 13.4344 15.1071 13.6051C15.0802 13.605 15.0534 13.6051 15.0266 13.6055C13.0646 13.6366 11.068 15.3241 11.308 17.4068C11.4258 18.4294 12.096 19.3308 13.2845 19.9217C13.6554 20.106 14.1056 19.9548 14.2899 19.5839C14.4743 19.213 14.3231 18.7628 13.9522 18.5785C13.1207 18.1652 12.8463 17.6535 12.7981 17.2351C12.7835 17.1082 12.788 16.9759 12.8115 16.8415C13.6492 17.4925 14.5612 17.8311 15.5292 17.7283C16.5578 17.6192 17.4968 17.0271 18.3528 16.1207C18.6321 15.825 18.6248 15.3606 18.3363 15.0739C17.9562 14.696 17.5602 14.3961 17.1569 14.1685C17.8466 14.1833 18.4865 14.0458 19.0554 13.7193C20.0597 13.1428 20.6628 12.0805 20.9801 10.7352C21.0712 10.3491 20.8458 9.95879 20.4658 9.84471C20.0021 9.70551 19.5511 9.61344 19.1177 9.57705C19.519 9.28987 19.8493 8.94049 20.0934 8.52013C20.6745 7.51944 20.6618 6.29821 20.2602 4.97596C20.1454 4.59796 19.757 4.37383 19.3723 4.46352C18.9236 4.56812 18.5062 4.70401 18.1273 4.87554C18.3782 4.23445 18.4677 3.58705 18.3532 2.94104C18.1513 1.8028 17.3524 0.876533 16.1915 0.121362Z" fill="#AE4EEE" />
    </svg>
  );
}

function EyeStatIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M11 0C5.81818 0 1.63636 2.90909 0 8C1.63636 13.0909 5.81818 16 11 16C16.1818 16 20.3636 13.0909 22 8C20.3636 2.90909 16.1818 0 11 0ZM11 13C13.7614 13 16 10.7614 16 8C16 5.23858 13.7614 3 11 3C8.23858 3 6 5.23858 6 8C6 10.7614 8.23858 13 11 13ZM11 10.5C12.3807 10.5 13.5 9.38071 13.5 8C13.5 6.61929 12.3807 5.5 11 5.5C9.61929 5.5 8.5 6.61929 8.5 8C8.5 9.38071 9.61929 10.5 11 10.5Z" fill="#1A67E5" />
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11ZM5.625 4.125C5.41789 4.125 5.25 4.29289 5.25 4.5C5.25 4.70711 5.07711 4.875 4.875 4.875C4.66789 4.875 4.5 4.70711 4.5 4.5C4.5 3.87868 5.00368 3.375 5.625 3.375H6.15C6.82132 3.375 7.375 3.92868 7.375 4.6C7.375 5.05195 7.12524 5.46458 6.73047 5.67695L6.375 5.86829V6.125C6.375 6.33211 6.20711 6.5 6 6.5C5.79289 6.5 5.625 6.33211 5.625 6.125V5.625C5.625 5.48886 5.69886 5.36263 5.81797 5.29805L6.37523 5.00017C6.54755 4.90714 6.625 4.76005 6.625 4.6C6.625 4.34315 6.40685 4.125 6.15 4.125H5.625ZM6 7.875C6.20711 7.875 6.375 7.70711 6.375 7.5C6.375 7.29289 6.20711 7.125 6 7.125C5.79289 7.125 5.625 7.29289 5.625 7.5C5.625 7.70711 5.79289 7.875 6 7.875Z" fill="currentColor" fillOpacity="0.3" />
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

function ArrowUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1 4C1 2.89543 1.89543 2 3 2H9C10.1046 2 11 2.89543 11 4V5.38L13.1056 4.32764C13.2298 4.26559 13.3737 4.26802 13.4959 4.33408C13.618 4.40014 13.6953 4.52116 13.7046 4.65682L14 8.5L13.7046 12.3432C13.6953 12.4788 13.618 12.5999 13.4959 12.6659C13.3737 12.732 13.2298 12.7344 13.1056 12.6724L11 11.62V12C11 13.1046 10.1046 14 9 14H3C1.89543 14 1 13.1046 1 12V4Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 6.5L7.5 12.5C6.11929 13.8807 3.88071 13.8807 2.5 12.5C1.11929 11.1193 1.11929 8.88071 2.5 7.5L8.5 1.5C9.32843 0.671573 10.6716 0.671573 11.5 1.5C12.3284 2.32843 12.3284 3.67157 11.5 4.5L5.5 10.5C5.08579 10.9142 4.41421 10.9142 4 10.5C3.58579 10.0858 3.58579 9.41421 4 9L9.5 3.5" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.8 0.8C6.5 0.1 7.5 0.1 8.2 0.8L8.9 1.5L9.9 1.3C10.8 1.1 11.7 1.7 11.9 2.6L12.1 3.6L13 4.1C13.8 4.5 14.1 5.5 13.7 6.3L13.2 7.2L13.7 8.1C14.1 8.9 13.8 9.9 13 10.3L12.1 10.8L11.9 11.8C11.7 12.7 10.8 13.3 9.9 13.1L8.9 12.9L8.2 13.6C7.5 14.3 6.5 14.3 5.8 13.6L5.1 12.9L4.1 13.1C3.2 13.3 2.3 12.7 2.1 11.8L1.9 10.8L1 10.3C0.2 9.9 -0.1 8.9 0.3 8.1L0.8 7.2L0.3 6.3C-0.1 5.5 0.2 4.5 1 4.1L1.9 3.6L2.1 2.6C2.3 1.7 3.2 1.1 4.1 1.3L5.1 1.5L5.8 0.8Z" fill="url(#gold_gradient)" />
      <path d="M5 7L6.5 8.5L9.5 5.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="gold_gradient" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#F0A500" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RetainerIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 0L6.12 3.45L9.51 3.82L6.97 6.06L7.72 9.38L5 7.71L2.28 9.38L3.03 6.06L0.49 3.82L3.88 3.45L5 0Z" fill="currentColor" />
    </svg>
  );
}

function CpmIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1 8L3.5 4.5L6 6L9 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Card wrapper ────────────────────────────────────────────────────

const cardClass =
  "rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none";

// ── Stat card data ──────────────────────────────────────────────────

const stats = [
  {
    value: "6 days",
    label: "Streak",
    hasHelp: true,
    icon: <FireStatIcon />,
    color: "#E57100",
    bg: "rgba(229,113,0,0.08)",
  },
  {
    value: "$148.50",
    label: "Earned this week",
    hasHelp: false,
    icon: <DollarStatIcon />,
    color: "#00994D",
    bg: "rgba(0,153,77,0.08)",
  },
  {
    value: "94%",
    label: "Trust score",
    hasHelp: true,
    icon: <WreathIcon />,
    color: "#AE4EEE",
    bg: "rgba(174,78,238,0.08)",
  },
  {
    value: "24.5k",
    label: "Views",
    hasHelp: false,
    icon: <EyeStatIcon />,
    color: "#1A67E5",
    bg: "rgba(26,103,229,0.08)",
  },
];

// ── Feed cards data ─────────────────────────────────────────────────

const feedCards = [
  {
    icon: <ArrowUpIcon />,
    badge: null,
    title: "Withdraw your earnings",
    desc: "You have $2,862 available. Withdraw it to your account anytime.",
    button: "Withdraw",
  },
  {
    icon: <VideoIcon />,
    badge: "50 XP",
    title: "Submit a new clip",
    desc: "Keep the momentum going. Your campaigns are waiting for content.",
    button: "Submit clip",
  },
  {
    icon: <PaperclipIcon />,
    badge: null,
    title: "Application expiring soon",
    desc: "Your CoD BO7 application closes in 2 days. Don\u2019t miss it.",
    button: "View application",
  },
];

// ── Campaign data ───────────────────────────────────────────────────

const campaigns = [
  {
    brand: "Sound Network",
    brandColor: "#FF6B6B",
    title: "Harry Styles Podcast x Shania Twain Clipping [7434]",
    model: "Retainer",
    modelColor: "#E57100",
    modelIcon: "retainer" as const,
    paidOut: "$3,561",
    pending: "$210",
    pendingHighlight: true,
    submissions: "7/21",
    thumbGradient: "from-orange-400 to-pink-500",
  },
  {
    brand: "Clipping Culture",
    brandColor: "#4ECDC4",
    title: "Call of Duty BO7 Official Clipping Campaign",
    model: "CPM",
    modelColor: "#1A67E5",
    modelIcon: "cpm" as const,
    paidOut: "$114",
    pending: "$0",
    pendingHighlight: false,
    submissions: "2/10",
    thumbGradient: "from-blue-400 to-indigo-500",
  },
  {
    brand: "Scene Society",
    brandColor: "#96CEB4",
    title: "Mumford & Sons | Prizefighter Clipping",
    model: "CPM",
    modelColor: "#1A67E5",
    modelIcon: "cpm" as const,
    paidOut: "$1,240",
    pending: "$58",
    pendingHighlight: true,
    submissions: "5/8",
    thumbGradient: "from-green-400 to-teal-500",
  },
];

// ── Page Component ──────────────────────────────────────────────────

export default function CreatorForYouPage() {
  const [feedPage, setFeedPage] = useState(0);
  const [trustScoreOpen, setTrustScoreOpen] = useState(false);
  const [streakOpen, setStreakOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col font-inter tracking-[-0.02em]">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between px-4 sm:px-5">
        <h1 className="text-sm font-medium tracking-[-0.02em] text-page-text">
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          {/* Chat button */}
          <button className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">
            <ChatIcon />
          </button>
          {/* Bell button */}
          <button className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">
            <BellIcon />
          </button>
          {/* Recruit pill */}
          <div className={cn(cardClass, "flex h-9 items-center gap-2 rounded-2xl px-3")}>
            <span className="text-xs font-medium text-[#E57100]">Recruit</span>
            <span className="text-xs text-page-text-subtle">&middot;</span>
            <span className="text-xs text-page-text-subtle">36%</span>
            <div className="size-5 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500" />
          </div>
          {/* Avatar */}
          <button className="size-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pb-8 sm:px-5">
        {/* Summary text */}
        <p className="text-base font-medium leading-none tracking-[-0.02em] text-page-text-subtle">
          You&apos;ve got 3 clips under review, $312 payouts pending and your 24.5k views this week are up from last. Not bad, Vlad.
        </p>

        {/* ── Stat cards ───────────────────────────────────────── */}
        {/* Desktop: 4-col grid */}
        <div className="hidden sm:grid sm:grid-cols-4 sm:gap-2">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              stat={stat}
              onClick={
                stat.label === "Trust score"
                  ? () => setTrustScoreOpen(true)
                  : stat.label === "Streak"
                    ? () => setStreakOpen(true)
                    : undefined
              }
            />
          ))}
        </div>
        {/* Mobile: horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-[160px] flex-1">
              <StatCard
                stat={stat}
                onClick={
                  stat.label === "Trust score"
                    ? () => setTrustScoreOpen(true)
                    : stat.label === "Streak"
                      ? () => setStreakOpen(true)
                      : undefined
                }
              />
            </div>
          ))}
        </div>

        {/* ── Feed card ────────────────────────────────────────── */}
        <div className={cn(cardClass, "flex flex-col gap-4 p-4")}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-page-text">Feed</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFeedPage(Math.max(0, feedPage - 1))}
                className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.04] dark:border-[rgba(224,224,224,0.06)] dark:hover:bg-white/[0.04]"
              >
                <ChevronLeftIcon />
              </button>
              <span className="text-xs tabular-nums text-page-text-muted">
                {feedPage + 1}/3
              </span>
              <button
                onClick={() => setFeedPage(Math.min(2, feedPage + 1))}
                className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.04] dark:border-[rgba(224,224,224,0.06)] dark:hover:bg-white/[0.04]"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          {/* Feed cards: row on desktop, stack on mobile */}
          <div className="flex flex-col gap-2 sm:flex-row">
            {feedCards.map((card) => (
              <div
                key={card.title}
                className={cn(
                  cardClass,
                  "flex flex-1 flex-col gap-3 p-3 sm:p-3 sm:px-4 sm:h-[173px]"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text-muted shadow-[0_0_0_1.8px_#fff] dark:border-[rgba(224,224,224,0.06)] dark:shadow-[0_0_0_1.8px_#1C1C1C]">
                    {card.icon}
                  </div>
                  {card.badge && (
                    <span className="rounded-full bg-[rgba(229,113,0,0.08)] px-2 py-0.5 text-[11px] font-medium text-[#E57100]">
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <h3 className="text-sm font-medium text-page-text">
                    {card.title}
                  </h3>
                  <p className="text-xs leading-[150%] text-page-text-subtle">
                    {card.desc}
                  </p>
                </div>
                <button className="self-start rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">
                  {card.button}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Active campaigns card ────────────────────────────── */}
        <div className={cn(cardClass, "flex flex-col gap-4 p-4")}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-page-text">
              Active campaigns
            </h2>
            <button className="text-xs font-medium text-page-text-muted transition-colors hover:text-page-text">
              Browse more &rarr;
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {campaigns.map((campaign) => (
              <CampaignRow key={campaign.title} campaign={campaign} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust Score Modal ──────────────────────────────────── */}
      <TrustScoreModal open={trustScoreOpen} onClose={() => setTrustScoreOpen(false)} />

      {/* ── Streak Modal ──────────────────────────────────────── */}
      <StreakModal open={streakOpen} onClose={() => setStreakOpen(false)} />
    </div>
  );
}

// ── Stat Card component ─────────────────────────────────────────────

function StatCard({
  stat,
  onClick,
}: {
  stat: {
    value: string;
    label: string;
    hasHelp: boolean;
    icon: React.ReactNode;
    color: string;
    bg: string;
  };
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(cardClass, "flex h-[61px] items-center overflow-hidden", onClick && "cursor-pointer transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]")}
      onClick={onClick}
    >
      <div className="flex flex-1 flex-col justify-center gap-0.5 px-3">
        <span className="text-sm font-medium text-page-text">{stat.value}</span>
        <span className="flex items-center gap-0.5 text-xs text-page-text-muted">
          {stat.label}
          {stat.hasHelp && <HelpIcon className="shrink-0" />}
        </span>
      </div>
      <div
        className="flex h-[61px] w-16 items-center justify-center rounded-r-2xl"
        style={{ backgroundColor: stat.bg }}
      >
        {stat.icon}
      </div>
    </div>
  );
}

// ── Campaign Row component ──────────────────────────────────────────

function CampaignRow({
  campaign,
}: {
  campaign: {
    brand: string;
    brandColor: string;
    title: string;
    model: string;
    modelColor: string;
    modelIcon: "retainer" | "cpm";
    paidOut: string;
    pending: string;
    pendingHighlight: boolean;
    submissions: string;
    thumbGradient: string;
  };
}) {
  return (
    <div
      className={cn(
        cardClass,
        "flex flex-col overflow-hidden sm:h-[102px] sm:flex-row"
      )}
    >
      {/* Thumbnail */}
      <div className="p-1 sm:p-1">
        <div
          className={cn(
            "h-[120px] w-full rounded-xl bg-gradient-to-br sm:h-[94px] sm:w-[163px]",
            campaign.thumbGradient
          )}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:px-4 sm:py-3">
        <div className="flex flex-col gap-1">
          {/* Brand row */}
          <div className="flex items-center gap-1.5">
            <div
              className="size-4 rounded-full"
              style={{ backgroundColor: campaign.brandColor }}
            />
            <span className="text-xs font-medium text-page-text">
              {campaign.brand}
            </span>
            <VerifiedBadge />
          </div>
          {/* Title */}
          <h3 className="min-w-0 truncate text-sm font-medium text-page-text">
            {campaign.title}
          </h3>
        </div>

        {/* Stats row */}
        <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0">
          {/* Model pill */}
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{
              color: campaign.modelColor,
              backgroundColor:
                campaign.modelColor === "#E57100"
                  ? "rgba(229,113,0,0.08)"
                  : "rgba(26,103,229,0.08)",
            }}
          >
            {campaign.modelIcon === "retainer" ? <RetainerIcon /> : <CpmIcon />}
            {campaign.model}
          </span>

          {/* Stats text */}
          <span className="text-xs text-page-text-subtle">
            Paid out {campaign.paidOut}
            <span className="mx-1">&middot;</span>
            <span className={campaign.pendingHighlight ? "text-[#E57100]" : ""}>
              Pending {campaign.pending}
            </span>
            <span className="mx-1">&middot;</span>
            Submissions {campaign.submissions}
          </span>

          {/* Submit button - pushed right on desktop */}
          <button className="ml-auto rounded-full bg-foreground/[0.06] px-3 py-1.5 text-xs font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Trust Score Modal ──────────────────────────────────────────────

const trustBreakdown = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L9.5 5.5L14 6.5L10.5 9.5L11.5 14L8 11.5L4.5 14L5.5 9.5L2 6.5L6.5 5.5L8 1Z" fill="currentColor" fillOpacity="0.7" />
      </svg>
    ),
    title: "Content quality",
    desc: "Based on views, engagement, and clip approval rate",
    score: 91,
    color: "#00994D",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M5.5 7.5C6.88071 7.5 8 6.38071 8 5C8 3.61929 6.88071 2.5 5.5 2.5C4.11929 2.5 3 3.61929 3 5C3 6.38071 4.11929 7.5 5.5 7.5ZM10.5 7.5C11.6046 7.5 12.5 6.60457 12.5 5.5C12.5 4.39543 11.6046 3.5 10.5 3.5C9.39543 3.5 8.5 4.39543 8.5 5.5C8.5 6.60457 9.39543 7.5 10.5 7.5ZM1 12C1 9.79086 2.79086 8 5 8H6C7.38071 8 8.59871 8.66068 9.35 9.68C9.72 9.56 10.1 9.5 10.5 9.5H11C12.6569 9.5 14 10.8431 14 12.5V13H1V12Z" fill="currentColor" fillOpacity="0.7" />
      </svg>
    ),
    title: "Engagement authenticity",
    desc: "Real audience interaction vs. bot/fake engagement",
    score: 88,
    color: "#00994D",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M1 4C1 2.89543 1.89543 2 3 2H9C10.1046 2 11 2.89543 11 4V5.38L13.1056 4.32764C13.2298 4.26559 13.3737 4.26802 13.4959 4.33408C13.618 4.40014 13.6953 4.52116 13.7046 4.65682L14 8.5L13.7046 12.3432C13.6953 12.4788 13.618 12.5999 13.4959 12.6659C13.3737 12.732 13.2298 12.7344 13.1056 12.6724L11 11.62V12C11 13.1046 10.1046 14 9 14H3C1.89543 14 1 13.1046 1 12V4Z" fill="currentColor" fillOpacity="0.7" />
      </svg>
    ),
    title: "Delivery Rate",
    desc: "Clips submitted on time and meeting requirements",
    score: 82,
    color: "#00994D",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 13H14M3 11L5 7L8 9L11 4L13 6" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Account Age",
    desc: "Time on platform and consistency of activity",
    score: 78,
    color: "#E57100",
  },
];

const scoreHistory = [
  { month: "Oct", height: 32 },
  { month: "Nov", height: 72 },
  { month: "Dec", height: 56 },
  { month: "Jan", height: 80 },
  { month: "Feb", height: 96 },
  { month: "Mar", height: 116 },
];

function TrustScoreModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="md" showClose={false}>
      {/* Header */}
      <div className="flex items-center justify-center border-b border-foreground/[0.06] px-6 py-3.5 dark:border-white/[0.06]">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Trust score</span>
        <button
          onClick={onClose}
          className="absolute right-4 top-3.5 flex size-7 items-center justify-center rounded-full text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-5 px-5 py-6" style={{ background: "radial-gradient(50% 53.47% at 50% 0%, rgba(0,153,77,0.12) 0%, rgba(0,153,77,0) 100%)" }}>
        {/* Score ring */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-20 items-center justify-center">
            <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
              {/* Track */}
              <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(0,153,77,0.2)" strokeWidth="4" />
              {/* Progress - 92% of full circle */}
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="#00994D"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${0.92 * 2 * Math.PI * 36} ${2 * Math.PI * 36}`}
                transform="rotate(-90 40 40)"
              />
            </svg>
            <span className="text-[28px] font-semibold tracking-[-0.02em] text-page-text">92</span>
          </div>
          <span className="text-[20px] font-medium tracking-[-0.02em] text-[#00994D]">Excellent</span>
          <span className="flex items-center gap-1 text-xs font-medium text-page-text-subtle">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6Z" stroke="currentColor" strokeOpacity="0.5" />
              <path d="M6 3.5V6L8 7.5" stroke="currentColor" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Updated daily based on your activity
          </span>
        </div>

        {/* Breakdown card */}
        <div className="w-full rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          {trustBreakdown.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "flex items-center gap-3 py-3",
                i < trustBreakdown.length - 1 && "border-b border-foreground/[0.06] dark:border-white/[0.06]"
              )}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text-muted shadow-[0_0_0_2px_#fff] dark:border-white/[0.06] dark:shadow-[0_0_0_2px_#1C1C1C]">
                {item.icon}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{item.title}</span>
                <span className="text-xs text-page-text-muted">{item.desc}</span>
              </div>
              <span className="text-[20px] font-medium tabular-nums tracking-[-0.02em]" style={{ color: item.color }}>
                {item.score}
              </span>
            </div>
          ))}
        </div>

        {/* Score history card */}
        <div className="w-full rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          <div className="flex items-baseline gap-1.5 px-4 pt-4 pb-3">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Score history</span>
            <span className="text-sm font-medium text-[#00994D]">+30 points</span>
            <span className="text-xs text-page-text-subtle">in the last 6 months</span>
          </div>
          <div className="flex items-end justify-between gap-2 px-4 pb-2">
            {scoreHistory.map((bar) => (
              <div key={bar.month} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-md border-x border-t border-white dark:border-card-bg"
                  style={{
                    height: bar.height,
                    background: "linear-gradient(0deg, rgba(0,153,77,0.3), rgba(0,153,77,0.3)), var(--color-card-bg, #FFFFFF)",
                  }}
                />
                <span className="text-[10px] font-medium text-page-text-subtle">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={onClose}
          className="flex h-10 w-full items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

// ── Streak Modal ───────────────────────────────────────────────────

function StreakModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // March 2026 calendar data
  // March 2026 starts on Sunday (0-indexed: 0=Sun)
  // We display M T W T F S S
  // March 1 is Sunday → column index 6
  const daysInMonth = 31;
  const firstDayOfWeek = 6; // Sunday = column 6 (Mon-based grid)
  const streakDays = [20, 21, 22, 23, 24, 25, 26]; // Mar 20-26

  // Build calendar grid: 6 rows x 7 cols
  const calendarCells: { day: number; inMonth: boolean; isStreak: boolean }[] = [];

  // Previous month filler
  const prevMonthDays = [23, 24, 25, 26, 27, 28];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push({ day: prevMonthDays[i] ?? 0, inMonth: false, isStreak: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, inMonth: true, isStreak: streakDays.includes(d) });
  }

  // Next month filler
  const remaining = 7 - (calendarCells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      calendarCells.push({ day: i, inMonth: false, isStreak: false });
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="md" showClose={false}>
      {/* Header */}
      <div className="flex items-center justify-center border-b border-foreground/[0.06] px-6 py-3.5 dark:border-white/[0.06]">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Streak</span>
        <button
          onClick={onClose}
          className="absolute right-4 top-3.5 flex size-7 items-center justify-center rounded-full text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div
        className="flex flex-col items-center gap-5 px-5 py-6"
        style={{ background: "radial-gradient(50% 53.47% at 50% 0%, rgba(255,101,0,0.12) 0%, rgba(255,101,0,0) 100%)" }}
      >
        {/* Fire icon circle */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-14 items-center justify-center rounded-full border border-foreground/[0.10] shadow-[0_0_0_2px_#fff,inset_0_1px_2px_rgba(0,0,0,0.06)] dark:border-white/[0.10] dark:shadow-[0_0_0_2px_#1C1C1C,inset_0_1px_2px_rgba(0,0,0,0.2)]"
            style={{ background: "linear-gradient(180deg, #F59E0B 0%, #F97316 271.34%)" }}
          >
            <svg width="24" height="28" viewBox="0 0 26 30" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M11.4863 1.26534C12.363 0.013032 14.1221 -0.439661 15.4959 0.504976C16.9234 1.4865 19.392 3.38354 21.5167 6.04663C23.6403 8.70841 25.5 12.2384 25.5 16.4471C25.5 23.9432 19.8717 29.9471 12.75 29.9471C5.62834 29.9471 0 23.9432 0 16.4471C0 13.3941 1.31112 9.49318 3.8663 6.37882C4.9858 5.01433 6.91749 5.09571 8.0461 6.17996L11.4863 1.26534ZM12.75 26.9471C14.9246 26.9471 16.6875 24.9348 16.6875 22.4526C16.6875 19.7889 14.6157 17.8297 13.4778 16.9544C13.0433 16.6203 12.4567 16.6203 12.0222 16.9544C10.8843 17.8297 8.8125 19.7889 8.8125 22.4526C8.8125 24.9348 10.5754 26.9471 12.75 26.9471Z" fill="white" />
            </svg>
          </div>
          <span className="text-[20px] font-medium tracking-[-0.02em] text-[#E57100]">6 day streak</span>
          <span className="max-w-[240px] text-center text-xs font-medium text-page-text-subtle">
            Your streak is based on how many days in a row you submit a video
          </span>
        </div>

        {/* Calendar card */}
        <div className="w-full rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          {/* Calendar header */}
          <div className="mb-3 flex items-center justify-between">
            <button className="flex size-8 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.04] dark:border-white/[0.06] dark:hover:bg-white/[0.04]">
              <ChevronLeftIcon />
            </button>
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">March 2026</span>
            <button className="flex size-8 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.04] dark:border-white/[0.06] dark:hover:bg-white/[0.04]">
              <ChevronRightIcon />
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 gap-0">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={`${d}-${i}`} className="flex h-9 items-center justify-center text-sm font-medium text-page-text-subtle">
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-0">
            {calendarCells.map((cell, i) => (
              <div
                key={i}
                className="flex h-9 items-center justify-center"
                style={{ opacity: cell.inMonth ? 1 : 0 }}
              >
                {cell.isStreak ? (
                  <svg width="24" height="24" viewBox="0 0 26 30" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.4863 1.26534C12.363 0.013032 14.1221 -0.439661 15.4959 0.504976C16.9234 1.4865 19.392 3.38354 21.5167 6.04663C23.6403 8.70841 25.5 12.2384 25.5 16.4471C25.5 23.9432 19.8717 29.9471 12.75 29.9471C5.62834 29.9471 0 23.9432 0 16.4471C0 13.3941 1.31112 9.49318 3.8663 6.37882C4.9858 5.01433 6.91749 5.09571 8.0461 6.17996L11.4863 1.26534ZM12.75 26.9471C14.9246 26.9471 16.6875 24.9348 16.6875 22.4526C16.6875 19.7889 14.6157 17.8297 13.4778 16.9544C13.0433 16.6203 12.4567 16.6203 12.0222 16.9544C10.8843 17.8297 8.8125 19.7889 8.8125 22.4526C8.8125 24.9348 10.5754 26.9471 12.75 26.9471Z" fill="#E57100" />
                  </svg>
                ) : (
                  <span className="text-sm text-page-text-muted">{cell.day}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={onClose}
          className="flex h-10 w-full items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
