"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { IconCashBanknoteFilled } from "@tabler/icons-react";
import { Gear } from "@/components/sidebar/icons/gear";

// ── Types ───────────────────────────────────────────────────────────

type NotificationType =
  | "submissions"
  | "applications"
  | "contracts"
  | "budget"
  | "payouts"
  | "clawbacks"
  | "bot-detection"
  | "view-spikes"
  | "messages"
  | "system";

interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
  highlighted: boolean;
  actionable?: boolean;
}

interface Category {
  key: "all" | NotificationType;
  label: string;
  count: number;
}

// ── Data ────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { key: "all", label: "All", count: 25 },
  { key: "payouts", label: "Payouts", count: 4 },
  { key: "clawbacks", label: "Clawbacks", count: 3 },
  { key: "submissions", label: "Submissions", count: 5 },
  { key: "budget", label: "Budget", count: 4 },
  { key: "bot-detection", label: "Bot Detection", count: 2 },
  { key: "view-spikes", label: "View Spikes", count: 1 },
  { key: "applications", label: "Applications", count: 3 },
  { key: "messages", label: "Messages", count: 2 },
  { key: "system", label: "System", count: 1 },
];

const NOTIFICATIONS: NotificationItem[] = [
  { id: 1, type: "submissions", title: "24 submissions", subtitle: "Awaiting review", time: "just now", unread: true, highlighted: true },
  { id: 2, type: "applications", title: "2 applications", subtitle: "From TikTok creators", time: "5 min ago", unread: true, highlighted: true },
  { id: 3, type: "contracts", title: "1 contract pending", subtitle: "Awaiting signature from @ViralVince", time: "12 min ago", unread: true, highlighted: true, actionable: true },
  { id: 4, type: "budget", title: "2 budget warnings", subtitle: "G Fuel critical, Caffeine AI low", time: "32 min ago", unread: true, highlighted: true },
  { id: 5, type: "submissions", title: "8 submissions approved", subtitle: "Ready for payout processing", time: "1 hour ago", unread: false, highlighted: false },
  { id: 6, type: "payouts", title: "$4,200 payout sent", subtitle: "Batch #1042 processed successfully", time: "2 hours ago", unread: false, highlighted: false },
  { id: 7, type: "applications", title: "5 new applications", subtitle: "Harry Styles campaign", time: "3 hours ago", unread: true, highlighted: true },
  { id: 8, type: "budget", title: "Budget threshold reached", subtitle: "Call of Duty at 90% spend", time: "5 hours ago", unread: true, highlighted: false, actionable: true },
  { id: 9, type: "contracts", title: "3 contracts signed", subtitle: "All parties confirmed", time: "1 day ago", unread: false, highlighted: false },
  { id: 10, type: "submissions", title: "12 submissions", subtitle: "Pending quality review", time: "1 day ago", unread: true, highlighted: false },
  { id: 11, type: "payouts", title: "$1,800 payout failed", subtitle: "Invalid bank details for @GamingGrace", time: "2 days ago", unread: true, highlighted: false, actionable: true },
  { id: 12, type: "applications", title: "1 application withdrawn", subtitle: "@ClipKing left Mumford & Sons", time: "3 days ago", unread: false, highlighted: false },
  { id: 13, type: "submissions", title: "6 submissions flagged", subtitle: "Possible duplicate content detected", time: "4 days ago", unread: true, highlighted: false },
  { id: 14, type: "budget", title: "Daily spend spike", subtitle: "Energy Drink campaign +340% vs avg", time: "5 days ago", unread: true, highlighted: false },
  { id: 15, type: "payouts", title: "$12,400 scheduled", subtitle: "March batch ready for approval", time: "5 days ago", unread: false, highlighted: false, actionable: true },
  { id: 16, type: "contracts", title: "2 contracts expiring", subtitle: "Renewal needed by March 20", time: "6 days ago", unread: true, highlighted: false, actionable: true },
];

// ── Icon config per type ────────────────────────────────────────────

const TYPE_STYLES: Record<
  string,
  { bg: string; color: string; icon: React.ReactNode }
> = {
  submissions: {
    bg: "bg-[rgba(229,113,0,0.06)] dark:bg-[rgba(229,113,0,0.12)]",
    color: "text-[#E57100]",
    icon: (
      <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.33333 0.666667C1.33333 0.298477 1.63181 0 2 0H11.3333C11.7015 0 12 0.298477 12 0.666667C12 1.03486 11.7015 1.33333 11.3333 1.33333H2C1.63181 1.33333 1.33333 1.03486 1.33333 0.666667ZM0 4C0 2.89543 0.895431 2 2 2H11.3333C12.4379 2 13.3333 2.89543 13.3333 4V10C13.3333 11.1046 12.4379 12 11.3333 12H2C0.895431 12 0 11.1046 0 10V4ZM5.71121 5.0658C5.94218 4.95478 6.21635 4.986 6.41646 5.14609L8.08313 6.47942C8.24127 6.60594 8.33333 6.79748 8.33333 7C8.33333 7.20252 8.24127 7.39406 8.08313 7.52058L6.41646 8.85391C6.21635 9.014 5.94218 9.04522 5.71121 8.9342C5.48023 8.82319 5.33333 8.5896 5.33333 8.33333V5.66667C5.33333 5.4104 5.48023 5.17681 5.71121 5.0658Z" fill="currentColor"/>
      </svg>
    ),
  },
  applications: {
    bg: "bg-[rgba(174,78,238,0.06)] dark:bg-[rgba(174,78,238,0.12)]",
    color: "text-[#AE4EEE]",
    icon: (
      <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
        <path d="M5.56771 0C3.91085 0 2.56771 1.34315 2.56771 3C2.56771 4.65685 3.91085 6 5.56771 6C7.22456 6 8.56771 4.65685 8.56771 3C8.56771 1.34315 7.22456 0 5.56771 0Z" fill="currentColor"/>
        <path d="M9.56771 8C9.9359 8 10.2344 8.29848 10.2344 8.66667V10H11.5677C11.9359 10 12.2344 10.2985 12.2344 10.6667C12.2344 11.0349 11.9359 11.3333 11.5677 11.3333H10.2344V12.6667C10.2344 13.0349 9.9359 13.3333 9.56771 13.3333C9.19952 13.3333 8.90104 13.0349 8.90104 12.6667V11.3333H7.56771C7.19952 11.3333 6.90104 11.0349 6.90104 10.6667C6.90104 10.2985 7.19952 10 7.56771 10H8.90104V8.66667C8.90104 8.29848 9.19952 8 9.56771 8Z" fill="currentColor"/>
        <path d="M0.0323131 11.131C0.603563 8.5891 2.70226 6.66667 5.56839 6.66667C6.52288 6.66667 7.39226 6.87988 8.14846 7.25817C7.78987 7.61964 7.56836 8.11728 7.56836 8.66667C6.46379 8.66667 5.56836 9.5621 5.56836 10.6667C5.56836 11.7712 6.46379 12.6667 7.56836 12.6667H1.30067C0.543899 12.6667 -0.160871 11.9906 0.0323131 11.131Z" fill="currentColor"/>
      </svg>
    ),
  },
  contracts: {
    bg: "bg-[rgba(0,178,89,0.04)] dark:bg-[rgba(0,178,89,0.10)]",
    color: "text-[#00994D]",
    icon: (
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
        <path d="M2 0C0.895431 0 0 0.89543 0 2V11.3333C0 12.4379 0.895431 13.3333 2 13.3333H7.44714C7.37344 13.1248 7.33333 12.9004 7.33333 12.6667C6.22876 12.6667 5.33333 11.7712 5.33333 10.6667C5.33333 9.5621 6.22876 8.66667 7.33333 8.66667C7.33333 7.5621 8.22876 6.66667 9.33333 6.66667C9.84557 6.66667 10.3128 6.85924 10.6667 7.17593V2C10.6667 0.895431 9.77124 0 8.66667 0H2Z" fill="currentColor"/>
        <path d="M10 8.66667C10 8.29848 9.70152 8 9.33333 8C8.96514 8 8.66667 8.29848 8.66667 8.66667V10H7.33333C6.96514 10 6.66667 10.2985 6.66667 10.6667C6.66667 11.0349 6.96514 11.3333 7.33333 11.3333H8.66667V12.6667C8.66667 13.0349 8.96514 13.3333 9.33333 13.3333C9.70152 13.3333 10 13.0349 10 12.6667V11.3333H11.3333C11.7015 11.3333 12 11.0349 12 10.6667C12 10.2985 11.7015 10 11.3333 10H10V8.66667Z" fill="currentColor"/>
      </svg>
    ),
  },
  budget: {
    bg: "bg-[rgba(238,78,81,0.06)] dark:bg-[rgba(238,78,81,0.12)]",
    color: "text-[#EE4E51]",
    icon: (
      <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.95407 0.992259C5.72583 -0.330751 7.63743 -0.330754 8.40919 0.992257L13.0878 9.01275C13.8656 10.3461 12.9038 12.0205 11.3602 12.0205H2.00301C0.459432 12.0205 -0.502312 10.3461 0.275454 9.01275L4.95407 0.992259ZM6.68229 4.02051C7.05048 4.02051 7.34896 4.31898 7.34896 4.68717V6.68717C7.34896 7.05536 7.05048 7.35384 6.68229 7.35384C6.3141 7.35384 6.01562 7.05536 6.01562 6.68717V4.68717C6.01562 4.31898 6.3141 4.02051 6.68229 4.02051ZM5.84896 8.68717C5.84896 8.22694 6.22205 7.85384 6.68229 7.85384C7.14253 7.85384 7.51562 8.22694 7.51562 8.68717C7.51562 9.14741 7.14253 9.52051 6.68229 9.52051C6.22205 9.52051 5.84896 9.14741 5.84896 8.68717Z" fill="currentColor"/>
      </svg>
    ),
  },
  payouts: {
    bg: "bg-[rgba(32,96,223,0.06)] dark:bg-[rgba(32,96,223,0.12)]",
    color: "text-[#2060DF]",
    icon: <IconCashBanknoteFilled size={16} />,
  },
  clawbacks: {
    bg: "bg-[rgba(238,78,81,0.06)] dark:bg-[rgba(238,78,81,0.12)]",
    color: "text-[#EE4E51]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  "bot-detection": {
    bg: "bg-[rgba(229,113,0,0.06)] dark:bg-[rgba(229,113,0,0.12)]",
    color: "text-[#E57100]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="4" y="5" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6.5" cy="8.5" r="1" fill="currentColor" />
        <circle cx="9.5" cy="8.5" r="1" fill="currentColor" />
        <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  "view-spikes": {
    bg: "bg-[rgba(32,96,223,0.06)] dark:bg-[rgba(32,96,223,0.12)]",
    color: "text-[#2060DF]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 12L5 7L8 9L11 4L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  messages: {
    bg: "bg-[rgba(174,78,238,0.06)] dark:bg-[rgba(174,78,238,0.12)]",
    color: "text-[#AE4EEE]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 4H13V11H9L7 13L5 11H3V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  system: {
    bg: "bg-foreground/[0.04] dark:bg-white/[0.06]",
    color: "text-page-text-muted",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5V8.5L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
};

function getTypeStyle(type: NotificationType) {
  return TYPE_STYLES[type] ?? TYPE_STYLES.system;
}

// ── Icons ───────────────────────────────────────────────────────────

function DoubleCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10.7726 2.97184C10.9717 2.66236 11.3842 2.57303 11.6938 2.77197C12.0033 2.97113 12.0927 3.38356 11.8937 3.6932L5.8937 13.0266C5.77761 13.2068 5.58183 13.3208 5.36766 13.3319C5.15339 13.3429 4.94635 13.2501 4.81232 13.0826L1.47899 8.91588C1.24909 8.62842 1.29585 8.20835 1.58315 7.97835C1.87064 7.74835 2.29064 7.79508 2.52065 8.08255L5.27391 11.5246L10.7726 2.97184Z" fill="currentColor"/>
      <path d="M13.4393 2.97184C13.6384 2.66236 14.0509 2.57303 14.3605 2.77197C14.67 2.97113 14.7594 3.38356 14.5604 3.6932L8.56039 13.0266C8.36113 13.3359 7.94873 13.4254 7.63913 13.2264C7.32979 13.0272 7.24039 12.6148 7.43926 12.3052L13.4393 2.97184Z" fill="currentColor"/>
    </svg>
  );
}


// ── Category Sidebar ────────────────────────────────────────────────

function CategorySidebar({
  activeCategory,
  onSelect,
}: {
  activeCategory: string;
  onSelect: (key: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } =
    useProximityHover(containerRef);

  useEffect(() => {
    measureItems();
  }, [measureItems]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div className="w-[186px] shrink-0">
      <div
        ref={containerRef}
        className="sticky top-5 flex w-[186px] flex-col gap-1 rounded-2xl bg-[rgba(37,37,37,0.04)] p-1 dark:bg-[rgba(255,255,255,0.04)]"
        {...handlers}
      >
        <AnimatePresence>
          {activeRect && (
            <motion.div
              key={sessionRef.current}
              className="pointer-events-none absolute rounded-xl bg-foreground/[0.04] dark:bg-white/[0.04]"
              initial={{ opacity: 0, ...activeRect }}
              animate={{ opacity: 1, ...activeRect }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
            />
          )}
        </AnimatePresence>

        {CATEGORIES.map((cat, i) => {
          const isActive = activeCategory === cat.key;

          return (
            <button
              key={cat.key}
              ref={(el) => registerItem(i, el)}
              onClick={() => onSelect(cat.key)}
              className={cn(
                "relative z-10 flex h-9 cursor-pointer items-center justify-between rounded-xl px-2.5 font-inter text-[14px] font-medium leading-none tracking-[-0.02em] transition-colors",
                isActive
                  ? "bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.1)] dark:shadow-[0px_2px_4px_rgba(0,0,0,0.2)]"
                  : "bg-transparent",
                isActive
                  ? "text-[rgba(37,37,37,0.9)] dark:text-[rgba(255,255,255,0.8)]"
                  : "text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]",
              )}
            >
              <span>{cat.label}</span>
              <span
                className="flex min-w-fit items-center justify-center rounded-full bg-[rgba(255,51,85,0.1)] px-1 font-inter text-[10px] font-semibold leading-none text-[#FF3355]"
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Notification List (card-based, EventsTab style) ─────────────────

function NotificationList({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  return (
    <div>
      <div
        className={cn(
          "flex w-[600px] max-w-full flex-col rounded-2xl border p-5",
          "border-border bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
          "dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]",
        )}
      >
        <div className="flex flex-col gap-2">
          {notifications.map((notif) => {
            const style = getTypeStyle(notif.type);

            return (
              <div
                key={notif.id}
                className={cn(
                  "relative flex cursor-pointer gap-3 rounded-2xl border p-4",
                  notif.highlighted
                    ? "border-[rgba(255,144,37,0.3)] dark:border-[rgba(255,144,37,0.25)]"
                    : "border-border bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]",
                )}
                style={
                  notif.highlighted
                    ? {
                        background:
                          "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.12) 0%, rgba(255,144,37,0) 50%), #FFFFFF",
                      }
                    : undefined
                }
              >
                {/* Dark-mode overlay for highlighted */}
                {notif.highlighted && (
                  <div
                    className="pointer-events-none absolute inset-0 hidden rounded-2xl dark:block"
                    style={{
                      background:
                        "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.08) 0%, rgba(255,144,37,0) 50%), rgba(255,255,255,0.04)",
                    }}
                  />
                )}

                {/* Unread dot */}
                {notif.unread && (
                  <span className="absolute -right-1 -top-1 flex items-center justify-center">
                    <span className="size-3 rounded-full border-2 border-white bg-[#FF3355] dark:border-[#111111]" />
                  </span>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full",
                    style.bg,
                    style.color,
                  )}
                >
                  {style.icon}
                </div>

                {/* Content */}
                <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[14px] font-medium tracking-[-0.02em] text-page-text">
                      {notif.title}
                    </span>
                    <span className="ml-2 shrink-0 text-[12px] tracking-[-0.02em] text-page-text-muted">
                      {notif.time}
                    </span>
                  </div>
                  <span className="text-[14px] leading-[150%] tracking-[-0.02em] text-page-text-muted">
                    {notif.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Preferences Modal ────────────────────────────────────────────────

interface ChannelState {
  whatsapp: boolean;
  imessage: boolean;
  slack: boolean;
  email: boolean;
}

interface NotifEvent {
  name: string;
  description: string;
  channels: { inApp: boolean; whatsapp: boolean; email: boolean; slack: boolean };
}

const DEFAULT_CHANNELS: ChannelState = {
  whatsapp: true,
  imessage: true,
  slack: true,
  email: false,
};

const DEFAULT_EVENTS: NotifEvent[] = [
  { name: "New submission", description: "Video submitted by creator", channels: { inApp: true, whatsapp: true, email: true, slack: true } },
  { name: "Auto-approve countdown", description: "Submissions about to auto-approve", channels: { inApp: true, whatsapp: true, email: true, slack: false } },
  { name: "Payout processed", description: "Weekly payout batch completed", channels: { inApp: true, whatsapp: true, email: false, slack: false } },
  { name: "Validation window closing", description: "Payouts about to finalize", channels: { inApp: true, whatsapp: true, email: true, slack: true } },
  { name: "Budget low / depleted", description: "Campaign budget reaching threshold", channels: { inApp: true, whatsapp: true, email: true, slack: true } },
  { name: "Clawback completed", description: "Payout clawed back from creator", channels: { inApp: true, whatsapp: true, email: false, slack: true } },
  { name: "Clawback completed", description: "Payout clawed back from creator", channels: { inApp: true, whatsapp: true, email: false, slack: true } },
];

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  whatsapp: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M4.98466 1.28608e-06C6.26251 0.00762629 7.48826 0.508751 8.40556 1.39844C9.32281 2.28816 9.86086 3.49786 9.90751 4.7749C9.93176 5.4287 9.8265 6.08105 9.59746 6.69385C9.36841 7.30655 9.02011 7.86775 8.57306 8.3452C8.12586 8.82275 7.58846 9.2073 6.99201 9.4761C6.39551 9.74485 5.75146 9.89295 5.09746 9.9116H4.95586C4.21241 9.9118 3.47813 9.7446 2.80791 9.42285L0.214155 10H0.20683C0.2014 9.99995 0.19565 9.99885 0.190715 9.9966C0.185835 9.9943 0.181555 9.9909 0.17802 9.9868C0.17447 9.98275 0.171765 9.97785 0.170205 9.97265C0.168675 9.9675 0.168035 9.96185 0.16874 9.95655L0.60722 7.334C0.19454 6.5789 -0.0144398 5.7295 0.000775228 4.86915C0.0160202 4.0087 0.254885 3.16681 0.694135 2.42676C1.13335 1.68678 1.75771 1.07395 2.50566 0.648441C3.25368 0.222941 4.09966 -0.000618714 4.96026 1.28608e-06H4.98466ZM3.1873 2.56641C3.14185 2.57185 3.09744 2.58433 3.05546 2.60303C2.99952 2.62798 2.94883 2.66374 2.90703 2.7085C2.78891 2.82963 2.45886 3.12126 2.43974 3.7334C2.42065 4.34525 2.84785 4.9507 2.908 5.03615C2.96782 5.12105 3.72591 6.4437 4.97441 6.98C5.70821 7.2961 6.03001 7.3501 6.23856 7.3501C6.32446 7.3501 6.38951 7.34145 6.45731 7.3374C6.68611 7.3232 7.20211 7.05885 7.31476 6.7715C7.42736 6.484 7.43475 6.2324 7.40506 6.18215C7.3754 6.13185 7.29381 6.0956 7.17121 6.03125C7.04821 5.9667 6.44686 5.6453 6.33381 5.6001C6.29195 5.58065 6.24696 5.56885 6.20096 5.56545C6.17096 5.567 6.14136 5.5759 6.11551 5.5913C6.08976 5.6067 6.06816 5.6282 6.05256 5.6538C5.95205 5.77895 5.72126 6.05095 5.64386 6.1294C5.62696 6.14885 5.60611 6.16435 5.58281 6.1753C5.55945 6.1862 5.53391 6.1924 5.50811 6.19285C5.46061 6.19075 5.41401 6.1783 5.37186 6.15625C5.00746 6.0015 4.67526 5.77945 4.39236 5.50245C4.12811 5.24195 3.90369 4.9439 3.72685 4.6177C3.65852 4.491 3.72702 4.4255 3.78935 4.3662C3.85163 4.3069 3.91846 4.22515 3.98271 4.1543C4.03551 4.09375 4.07966 4.02595 4.11356 3.95313C4.13106 3.91938 4.13955 3.88176 4.13896 3.84375C4.13836 3.80565 4.12831 3.7681 4.10966 3.73487C4.07976 3.67065 3.85867 3.04906 3.75468 2.79932C3.67028 2.58579 3.56968 2.57831 3.48173 2.57178C3.40939 2.56676 3.32636 2.56453 3.24345 2.56202H3.23271L3.1873 2.56641Z" fill="currentColor"/></svg>
  ),
  imessage: (
    <svg width="11" height="10" viewBox="0 0 11 10" fill="none"><path d="M5.44414 0C4.00027 9.56041e-06 2.61554 0.477761 1.59456 1.32816C0.573591 2.17856 9.78184e-06 3.33195 0 4.5346C0.0013158 5.31687 0.245565 6.08554 0.709011 6.76593C1.17246 7.44631 1.83934 8.01527 2.64484 8.4175C2.4303 8.89779 2.10854 9.34817 1.69289 9.75C2.49895 9.6085 3.25561 9.31125 3.90399 8.88137C4.40392 9.00511 4.92261 9.06837 5.44414 9.06921C6.88802 9.0692 8.27275 8.59144 9.29373 7.74104C10.3147 6.89064 10.8883 5.73725 10.8883 4.5346C10.8883 3.33195 10.3147 2.17856 9.29373 1.32816C8.27275 0.477761 6.88802 9.51583e-06 5.44414 0Z" fill="currentColor"/></svg>
  ),
  slack: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3.5918 5.13867C4.15786 5.13887 4.61523 5.5975 4.61523 6.16406V8.72559C4.61509 9.29202 4.15777 9.7498 3.5918 9.75C3.02565 9.75 2.56753 9.29214 2.56738 8.72559V6.16406C2.56738 5.59738 3.02556 5.13867 3.5918 5.13867ZM6.1582 7.7002C6.72444 7.7002 7.18262 8.15891 7.18262 8.72559C7.18247 9.29214 6.72435 9.75 6.1582 9.75C5.59228 9.74974 5.13491 9.29198 5.13477 8.72559V7.7002H6.1582ZM2.05566 6.16406C2.05542 6.73038 1.59809 7.18822 1.03223 7.18848C0.466142 7.18848 0.00805205 6.73054 0.0078125 6.16406C0.0078125 5.59738 0.465994 5.13867 1.03223 5.13867H2.05566V6.16406ZM8.72656 5.13867C9.29259 5.13891 9.75 5.59753 9.75 6.16406C9.74976 6.73039 9.29245 7.18824 8.72656 7.18848H6.1582C5.59234 7.18821 5.135 6.73037 5.13477 6.16406C5.13477 5.59754 5.59219 5.13893 6.1582 5.13867H8.72656ZM3.5918 2.56934C4.15767 2.5696 4.61502 3.02742 4.61523 3.59375C4.61523 4.16027 4.15781 4.61888 3.5918 4.61914H1.02344C0.457406 4.61891 0 4.16028 0 3.59375C0.000213505 3.0274 0.457538 2.56957 1.02344 2.56934H3.5918ZM6.1582 0C6.72435 0 7.18247 0.457857 7.18262 1.02441V3.59375C7.18262 4.16043 6.72444 4.61914 6.1582 4.61914C5.59219 4.61888 5.13477 4.16027 5.13477 3.59375V1.02441C5.13491 0.458019 5.59228 0.000261755 6.1582 0ZM8.71875 2.56934C9.28468 2.56954 9.74197 3.02738 9.74219 3.59375C9.74219 4.1603 9.28481 4.61894 8.71875 4.61914H7.69434V3.59375C7.69455 3.02725 8.15265 2.56934 8.71875 2.56934ZM3.5918 0C4.15772 0.000261755 4.61509 0.458019 4.61523 1.02441V2.0498H3.5918C3.02556 2.0498 2.56738 1.59109 2.56738 1.02441C2.56753 0.457857 3.02565 0 3.5918 0Z" fill="currentColor"/></svg>
  ),
  email: (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M0.0600773 1.10428C0.0366062 1.20286 0.0234526 1.30254 0.0152864 1.40249C-1.47326e-05 1.58976 -7.73728e-06 1.81713 3.71502e-07 2.08069V5.91927C-7.73728e-06 6.18283 -1.47326e-05 6.41024 0.0152864 6.59751C0.0314369 6.79519 0.0670949 6.9918 0.163492 7.18099C0.307302 7.46323 0.536773 7.6927 0.819016 7.83651C1.00821 7.93291 1.20482 7.96856 1.40249 7.98472C1.58975 8.00001 1.81711 8.00001 2.08065 8H7.91926C8.1828 8.00001 8.41025 8.00001 8.59752 7.98472C8.79519 7.96856 8.9918 7.93291 9.18099 7.83651C9.46323 7.6927 9.6927 7.46323 9.83651 7.18099C9.93291 6.9918 9.96857 6.79519 9.98472 6.59751C10 6.41023 10 6.18285 10 5.91928V2.08072C10 1.81715 10 1.58977 9.98472 1.40249C9.97655 1.30254 9.9634 1.20286 9.93993 1.10427L5.94986 4.36888C5.39731 4.82096 4.60269 4.82096 4.05014 4.36888L0.0600773 1.10428Z" fill="currentColor"/><path d="M9.37029 0.278279C9.31037 0.235595 9.24713 0.197191 9.18099 0.163492C8.9918 0.0670948 8.79519 0.0314368 8.59752 0.0152863C8.41024 -1.49459e-05 8.18285 -7.848e-06 7.91929 3.79688e-07H2.08073C1.81717 -7.848e-06 1.58977 -1.49459e-05 1.40249 0.0152863C1.20482 0.0314368 1.00821 0.0670948 0.819016 0.163492C0.752876 0.197192 0.689634 0.235596 0.629713 0.27828L4.68338 3.59492C4.86756 3.74561 5.13244 3.74561 5.31662 3.59492L9.37029 0.278279Z" fill="currentColor"/></svg>
  ),
};

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={cn(
        "relative h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors",
        on
          ? "bg-foreground"
          : "bg-foreground/20"
      )}
    >
      <motion.div
        className="absolute top-0.5 size-4 rounded-full bg-white shadow-sm dark:bg-[#191919]"
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function CheckIcon({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="flex cursor-pointer items-center justify-center">
      {checked ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill="#252525" className="dark:fill-white" />
          <path d="M5 8L7 10L11 6" stroke="white" className="dark:stroke-[#191919]" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="#252525" className="dark:stroke-white/40" strokeWidth="1" />
        </svg>
      )}
    </button>
  );
}

function PreferencesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [channels, setChannels] = useState<ChannelState>({ ...DEFAULT_CHANNELS });
  const [events, setEvents] = useState<NotifEvent[]>(
    DEFAULT_EVENTS.map((e) => ({ ...e, channels: { ...e.channels } }))
  );

  const toggleChannel = (key: keyof ChannelState) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleEventChannel = (eventIdx: number, channel: keyof NotifEvent["channels"]) => {
    setEvents((prev) => {
      const next = prev.map((e) => ({ ...e, channels: { ...e.channels } }));
      next[eventIdx].channels[channel] = !next[eventIdx].channels[channel];
      return next;
    });
  };

  const channelRows: { key: keyof ChannelState; label: string; connected: boolean }[] = [
    { key: "whatsapp", label: "WhatsApp", connected: true },
    { key: "imessage", label: "iMessage", connected: true },
    { key: "slack", label: "Slack", connected: true },
    { key: "email", label: "Email", connected: false },
  ];

  return (
    <Modal open={open} onClose={onClose} size="md" showClose={false}>
      {/* Header */}
      <div className="flex h-10 shrink-0 items-center justify-center border-b border-border">
        <span className="font-inter text-sm font-medium text-page-text">
          Preferences
        </span>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 flex size-6 cursor-pointer items-center justify-center rounded-full text-[rgba(37,37,37,0.5)] transition-colors hover:text-[#252525] dark:text-white/50 dark:hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide px-5 pb-5 pt-4" style={{ maxHeight: "calc(90dvh - 100px)" }}>
        {/* Card 1: Delivery channels */}
        <div className="shrink-0 overflow-hidden rounded-2xl border border-foreground/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          <div className="px-4 pb-2 pt-4">
            <span className="font-inter text-xs font-normal text-page-text-muted">
              Delivery channels
            </span>
          </div>
          {channelRows.map((ch, i) => {
            const isOn = channels[ch.key];
            const isLast = i === channelRows.length - 1;
            return (
              <div
                key={ch.key}
                onClick={() => toggleChannel(ch.key)}
                className={cn(
                  "flex h-[52px] cursor-pointer items-center gap-3 px-4 transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]",
                  !isLast && "border-b border-border"
                )}
              >
                {/* Icon circle */}
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-[#252525] dark:bg-white/[0.06] dark:text-[#e5e5e5]">
                  {CHANNEL_ICONS[ch.key]}
                </div>
                {/* Name + status */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <span
                    className={cn(
                      "font-inter text-sm font-medium tracking-[-0.02em]",
                      ch.connected
                        ? "text-page-text"
                        : "text-[rgba(37,37,37,0.7)] dark:text-white/70"
                    )}
                  >
                    {ch.label}
                  </span>
                  <span
                    className={cn(
                      "font-inter text-xs",
                      ch.connected
                        ? "text-[#00994D]"
                        : "text-page-text-muted"
                    )}
                  >
                    {ch.connected ? "Connected" : "Not connected"}
                  </span>
                </div>
                {/* Toggle */}
                <ToggleSwitch on={isOn} onToggle={() => toggleChannel(ch.key)} />
              </div>
            );
          })}
        </div>

        {/* Card 2: Notification matrix */}
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          {/* Header row */}
          <div className="flex h-10 items-center border-b border-foreground/[0.06] px-4 dark:border-white/[0.06]">
            <span className="flex-1 font-inter text-xs font-medium text-page-text-muted">
              Event
            </span>
            <span className="w-[62px] text-center font-inter text-xs font-medium text-page-text-muted">
              In-App
            </span>
            <span className="w-[81px] text-center font-inter text-xs font-medium text-page-text-muted">
              Whatsapp
            </span>
            <span className="w-[54px] text-center font-inter text-xs font-medium text-page-text-muted">
              Email
            </span>
            <span className="w-[55px] text-center font-inter text-xs font-medium text-page-text-muted">
              Slack
            </span>
          </div>
          {/* Data rows */}
          {events.map((evt, idx) => {
            const isLast = idx === events.length - 1;
            return (
              <div
                key={idx}
                className={cn(
                  "flex h-14 items-center px-4",
                  !isLast && "border-b border-foreground/[0.03] dark:border-white/[0.03]"
                )}
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                    {evt.name}
                  </span>
                  <span className="truncate font-inter text-[11px] text-page-text-muted">
                    {evt.description}
                  </span>
                </div>
                <div className="flex w-[62px] items-center justify-center">
                  <CheckIcon checked={evt.channels.inApp} onToggle={() => toggleEventChannel(idx, "inApp")} />
                </div>
                <div className="flex w-[81px] items-center justify-center">
                  <CheckIcon checked={evt.channels.whatsapp} onToggle={() => toggleEventChannel(idx, "whatsapp")} />
                </div>
                <div className="flex w-[54px] items-center justify-center">
                  <CheckIcon checked={evt.channels.email} onToggle={() => toggleEventChannel(idx, "email")} />
                </div>
                <div className="flex w-[55px] items-center justify-center">
                  <CheckIcon checked={evt.channels.slack} onToggle={() => toggleEventChannel(idx, "slack")} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-5 pb-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-foreground/[0.06] px-4 py-2 font-inter text-sm font-medium text-[#252525] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:text-[#e5e5e5] dark:hover:bg-white/[0.10]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-[#252525] px-4 py-2 font-inter text-sm font-medium text-white transition-colors hover:bg-[#333] dark:bg-white dark:text-[#191919] dark:hover:bg-white/90"
        >
          Save preferences
        </button>
      </div>
    </Modal>
  );
}

// ── Main Page ───────────────────────────────────────────────────────

export default function NotificationsPageClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [prefsOpen, setPrefsOpen] = useState(false);

  const filtered =
    activeCategory === "all"
      ? NOTIFICATIONS
      : NOTIFICATIONS.filter((n) => n.type === activeCategory);

  return (
    <div className="flex h-full flex-col">
      {/* Header bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Notifications
        </span>

        <div className="flex items-center gap-2">
          <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">
            <DoubleCheckIcon />
            <span className="hidden sm:inline">Mark all as read</span>
          </button>
          <button
            data-demo="notification-prefs"
            onClick={() => setPrefsOpen(true)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            <Gear width={16} height={16} />
          </button>
        </div>
      </div>

      {/* Scroll container — own overflow so sticky works inside */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {/* Mobile category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-5 pt-4 md:hidden">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                activeCategory === cat.key
                  ? "bg-foreground/[0.06] text-page-text dark:bg-white/[0.06]"
                  : "text-foreground/60 dark:text-white/60"
              )}
            >
              {cat.label}
              <span className="rounded-full bg-[rgba(255,51,85,0.1)] px-1.5 py-0.5 text-[10px] font-semibold text-[#FF3355]">
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Body — same layout as EventsTab */}
        <div className="flex gap-4 p-5">
          <div className="hidden w-[186px] shrink-0 md:block">
            <CategorySidebar
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>
          <NotificationList notifications={filtered} />
        </div>
      </div>

      {/* Preferences modal */}
      <PreferencesModal open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </div>
  );
}
