"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  IconSearchFilled,
  IconLifebuoyFilled,
  IconBellFilled,
  IconRefresh,
  IconBookFilled,
  IconDownloadFilled,
  IconCreditCardFilled,
} from "@tabler/icons-react";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

// ── Icons ───────────────────────────────────────────────────────────

function ChatBubbleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5C21 16.19 16.97 20 12 20C11.14 20 10.31 19.88 9.52 19.67L5.5 21L6.83 17.73C5.1 16.27 4 14.02 4 11.5C4 6.81 8.03 3 13 3C16.62 3 19.73 5.09 21 8"
        stroke="#594FEE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M9 11.5H9.01M13 11.5H13.01M17 11.5H17.01" stroke="#594FEE" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9.5Z"
        stroke={active ? "#594FEE" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessagesNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5C21 16.19 16.97 20 12 20C11.14 20 10.31 19.88 9.52 19.67L5.5 21L6.83 17.73C5.1 16.27 4 14.02 4 11.5C4 6.81 8.03 3 13 3"
        stroke={active ? "#594FEE" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Menu items ──────────────────────────────────────────────────────

const ICON_PROPS = { size: 18, className: "text-foreground/50" } as const;

const MENU_ITEMS = [
  { icon: <IconSearchFilled {...ICON_PROPS} />, label: "Search" },
  { icon: <IconLifebuoyFilled {...ICON_PROPS} />, label: "Help Center" },
  { icon: <IconBellFilled {...ICON_PROPS} />, label: "Notifications" },
  { icon: <IconRefresh {...ICON_PROPS} stroke={1.5} />, label: "Updates" },
  { icon: <IconBookFilled {...ICON_PROPS} />, label: "Knowledge Base" },
  { icon: <IconDownloadFilled {...ICON_PROPS} />, label: "Downloads" },
  { icon: <IconCreditCardFilled {...ICON_PROPS} />, label: "Billing & Plans" },
];

// ── Quick Link Row ──────────────────────────────────────────────────

function QuickLinkRow({
  icon, label, index, isLast,
  registerItem, activeIndex,
}: {
  icon: React.ReactNode;
  label: string;
  index: number;
  isLast: boolean;
  registerItem: (index: number, el: HTMLElement | null) => void;
  activeIndex: number | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerItem(index, ref.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  const hideBorder = activeIndex !== null && (index === activeIndex || index === activeIndex - 1);

  return (
    <div ref={ref} className="relative z-10 px-2">
      <button
        type="button"
        className={`flex w-full cursor-pointer items-center gap-3 py-2 transition-[border-color] duration-75 ${
          !isLast ? (hideBorder ? "border-b border-transparent" : "border-b border-foreground/[0.06]") : ""
        }`}
      >
        <span className="flex size-[18px] shrink-0 items-center justify-center">
          {icon}
        </span>
        <span className="flex-1 text-left font-inter text-sm leading-[1.6] text-foreground">
          {label}
        </span>
        <span className="text-foreground/30">
          <ChevronRightSmall />
        </span>
      </button>
    </div>
  );
}

// ── Chat Widget ─────────────────────────────────────────────────────

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "messages">("home");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const listRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(listRef);
  useEffect(() => { if (open) setTimeout(measureItems, 50); }, [open, measureItems]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-0 right-0 z-[60] flex flex-col items-end gap-3 p-5">
      <AnimatePresence>
        {open && (
          <motion.div
            className="flex w-[400px] flex-col overflow-hidden rounded-[20px] bg-card-bg shadow-[0_0_10px_rgba(0,0,0,0.02),0_0_20px_rgba(0,0,0,0.04),0_0_60px_rgba(0,0,0,0.08)] dark:shadow-[0_0_10px_rgba(0,0,0,0.1),0_0_20px_rgba(0,0,0,0.15),0_0_60px_rgba(0,0,0,0.25)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            {/* Hero — fixed height */}
            <div
              className="relative overflow-hidden px-6 pb-5 pt-5"
              style={{ background: "linear-gradient(180deg, #3800BC 0%, var(--color-card-bg) 100%)" }}
            >
              {/* Decorative blobs */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-8 -top-6 size-28 rounded-full bg-[#4A2BE4] opacity-30 blur-2xl" />
                <div className="absolute -right-4 top-2 size-20 rounded-full bg-[#FE8CFE] opacity-25 blur-2xl" />
                <div className="absolute bottom-4 left-12 size-24 rounded-full bg-[#F59E09] opacity-20 blur-2xl" />
                <div className="absolute -bottom-8 right-8 size-20 rounded-full bg-[#65A30D] opacity-20 blur-2xl" />
                <div className="absolute left-1/3 top-1/4 size-16 rounded-full bg-[#EF4444] opacity-20 blur-2xl" />
              </div>

              {/* User info */}
              <div className="relative z-10 flex items-center gap-3">
                <span className="flex-1 font-inter text-lg font-semibold text-white">
                  Username
                </span>
                <div className="flex items-center">
                  {[31, 32, 33].map((img, i) => (
                    <div
                      key={img}
                      className="flex size-8 items-center justify-center rounded-full border border-[#4A2BE4] bg-[#3800BC]"
                      style={{ marginLeft: i > 0 ? -10 : 0, zIndex: 3 - i }}
                    >
                      <img src={`https://i.pravatar.cc/32?img=${img}`} alt="" className="size-full rounded-full object-cover" />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-6 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Greeting */}
              <div className="relative z-10 mt-8">
                <p className="font-inter text-[32px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#EBECFF]">
                  How can we
                </p>
                <p className="font-inter text-[32px] font-semibold leading-[1.3] tracking-[-0.5px] text-white">
                  help you?
                </p>
              </div>
            </div>

            {/* Quick links card */}
            <div className="relative -mt-1 px-5 pb-4">
              <div className="flex flex-col rounded-xl bg-card-bg px-3 pb-1 pt-3 shadow-[0_0.3px_0.8px_rgba(0,0,0,0.08),0_1.1px_3px_rgba(0,0,0,0.08),0_5px_13px_-2.5px_rgba(0,0,0,0.08)] dark:shadow-[0_0.3px_0.8px_rgba(0,0,0,0.2),0_1.1px_3px_rgba(0,0,0,0.2),0_5px_13px_-2.5px_rgba(0,0,0,0.2)] dark:ring-1 dark:ring-white/[0.06]">
                <span className="pb-1 font-inter text-sm font-semibold leading-[1.6] text-page-text-muted">
                  Quick links
                </span>
                <div
                  className="relative"
                  ref={listRef}
                  onMouseEnter={handlers.onMouseEnter}
                  onMouseMove={handlers.onMouseMove}
                  onMouseLeave={handlers.onMouseLeave}
                >
                  <AnimatePresence>
                    {activeRect && (
                      <motion.div
                        key={sessionRef.current}
                        className="pointer-events-none absolute z-0 rounded-lg bg-foreground/[0.06]"
                        initial={{ opacity: 0, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                        animate={{ opacity: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                      />
                    )}
                  </AnimatePresence>
                  {MENU_ITEMS.map((item, i) => (
                    <QuickLinkRow
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      index={i}
                      isLast={i === MENU_ITEMS.length - 1}
                      registerItem={registerItem}
                      activeIndex={activeIndex}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom nav */}
            <div className="flex shrink-0 items-stretch border-t border-foreground/[0.06] bg-card-bg">
              <button
                type="button"
                onClick={() => setActiveTab("home")}
                className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 py-3 text-page-text-muted"
              >
                <HomeNavIcon active={activeTab === "home"} />
                <span className="font-inter text-xs font-medium" style={{ color: activeTab === "home" ? "#594FEE" : undefined }}>
                  Home
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("messages")}
                className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 py-3 text-page-text-muted"
              >
                <MessagesNavIcon active={activeTab === "messages"} />
                <span className="font-inter text-xs font-medium" style={{ color: activeTab === "messages" ? "#594FEE" : undefined }}>
                  Messages
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex size-14 cursor-pointer items-center justify-center rounded-full border border-border bg-card-bg shadow-[0_0.3px_1px_rgba(0,0,0,0.02),0_1.1px_4px_rgba(0,0,0,0.08)] transition-transform hover:scale-105 dark:shadow-[0_0.3px_1px_rgba(0,0,0,0.1),0_1.1px_4px_rgba(0,0,0,0.2)]"
      >
        {open ? <CloseIcon className="text-foreground/40" /> : <ChatBubbleIcon />}
      </button>
    </div>,
    document.body,
  );
}
