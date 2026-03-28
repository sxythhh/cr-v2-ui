"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { BudgetBar } from "./BudgetBar";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

const TRANSACTIONS = [
  { date: "Feb 18", handle: "@clipstermafia", initials: "CM", color: "bg-violet-500", video: "Day in the life vlog #47", views: "1.2M", amount: "$1,200.00", status: "paid" as const },
  { date: "Feb 17", handle: "@editqueen", initials: "EQ", color: "bg-pink-500", video: "Get ready with me — spring edit", views: "890K", amount: "$890.00", status: "paid" as const },
  { date: "Feb 16", handle: "@viralcuts", initials: "VC", color: "bg-blue-500", video: "POV: You finally tried it", views: "2.1M", amount: "$2,100.00", status: "pending" as const },
  { date: "Feb 15", handle: "@contentking", initials: "CK", color: "bg-emerald-500", video: "Honest review — no sponsorship", views: "640K", amount: "$640.00", status: "paid" as const },
  { date: "Feb 14", handle: "@clipstermafia", initials: "CM", color: "bg-violet-500", video: "Unboxing haul February edition", views: "430K", amount: "$430.00", status: "pending" as const },
];

const STAT_CARDS = [
  { label: "Total budget", value: "$15,000" },
  { label: "Spent", value: "$11,250", valueColor: "text-[#FF3355] dark:text-[#FB7185]", secondary: "75%" },
  { label: "Remaining", value: "$3,750", valueColor: "text-[#00994D] dark:text-[#34D399]", secondary: "12 days left" },
  { label: "Daily burn rate", value: "$312", secondary: "+8% vs last week", secondaryColor: "text-[#FF3355] dark:text-[#FB7185]" },
];

function StatCardsRow() {
  return <SwipeableStatCards cards={STAT_CARDS} />;
}

export interface StatCardData {
  label: string;
  value: string;
  valueColor?: string;
  secondary?: string;
  secondaryColor?: string;
}

export function SwipeableStatCards({ cards, columns = 4 }: { cards: StatCardData[]; columns?: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).offsetWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, cards.length - 1));
  }, [cards.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* Mobile: horizontal scroll — bleeds past page padding */}
      <div className="-mx-4 flex flex-col items-center gap-2 sm:-mx-5 md:hidden">
        <div
          ref={scrollRef}
          className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 scrollbar-hide sm:pl-5 [scroll-padding-inline:16px]"
        >
          {cards.map((card, i) => (
            <div key={card.label} className={cn(
              "w-[calc(100vw-56px)] max-w-80 shrink-0",
              "snap-start snap-always",
              i === cards.length - 1 && "mr-4 sm:mr-5",
            )}>
              <StatCard {...card} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const child = scrollRef.current?.children[i] as HTMLElement | undefined;
                child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }}
              className={cn(
                "size-1.5 cursor-pointer rounded-full transition-colors",
                i === activeIndex ? "bg-[#252525] dark:bg-[#E0E0E0]" : "bg-[rgba(37,37,37,0.1)] dark:bg-[rgba(224,224,224,0.1)]",
              )}
            />
          ))}
        </div>
      </div>
      {/* Desktop: grid */}
      <div className={cn("hidden gap-2 md:grid", `md:grid-cols-${columns}`)}>
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </>
  );
}

function StatCard({ label, value, valueColor, secondary, secondaryColor }: { label: string; value: string; valueColor?: string; secondary?: string; secondaryColor?: string }) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none">
      <span className="font-inter text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">{label}</span>
      <div className="flex items-baseline justify-between">
        <span className={cn("font-inter text-xl font-medium tracking-[-0.02em]", valueColor || "text-[#252525] dark:text-page-text")}>{value}</span>
        {secondary && (
          <span className={cn("font-inter text-xs tracking-[-0.02em]", secondaryColor || "text-[rgba(37,37,37,0.5)] dark:text-page-text-muted")}>{secondary}</span>
        )}
      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0ZM6.88698 4.06663C7.06184 3.85291 7.03034 3.5379 6.81662 3.36304C6.6029 3.18817 6.28789 3.21967 6.11302 3.4334L4.21288 5.75579L3.60355 5.14646C3.40829 4.9512 3.09171 4.9512 2.89645 5.14646C2.70118 5.34172 2.70118 5.65831 2.89645 5.85357L3.89645 6.85357C3.99634 6.95346 4.13382 7.00643 4.27491 6.9994C4.416 6.99236 4.54752 6.92597 4.63698 6.81663L6.88698 4.06663Z" fill="currentColor"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill="currentColor"/>
    </svg>
  );
}

function StatusPill({ status }: { status: "paid" | "pending" }) {
  if (status === "paid") {
    return (
      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[rgba(0,153,77,0.08)] py-2 pl-1.5 pr-2 font-inter text-xs font-medium tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">
        <CheckCircleIcon />
        Paid
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[rgba(229,113,0,0.08)] py-2 pl-1.5 pr-2 font-inter text-xs font-medium tracking-[-0.02em] text-[#E57100]">
      <ClockIcon />
      Pending
    </span>
  );
}

export default function FinanceTab() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(tableContainerRef);
  useEffect(() => { measureItems(); }, [measureItems]);
  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Top stats row — swipeable on mobile, grid on desktop */}
      <StatCardsRow />


      {/* Two-column chart area */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Budget utilization */}
        <div className="flex flex-1 flex-col items-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none">
          <div className="flex w-full items-center justify-between pb-1">
            <span className="font-inter text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">Budget utilization</span>
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">75% of budget used</span>
          </div>
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">$11,250</span>
                  <span className="font-inter text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">of $15,000</span>
                </div>

                {/* Stacked bar with interactive tooltip */}
                <BudgetBar />
              </div>

              <span className="font-inter text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted text-right">$3,750 remaining</span>
            </div>

          </div>

          {/* Separator */}
          <div className="w-full border-t border-[rgba(37,37,37,0.06)] dark:border-[rgba(224,224,224,0.03)]" />

          {/* Bottom pills — CPM + Views */}
          <div className="flex w-full flex-wrap items-center gap-1">
            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0 5C0 2.23858 2.23858 0 5 0C7.76142 0 10 2.23858 10 5C10 7.76142 7.76142 10 5 10C2.23858 10 0 7.76142 0 5ZM5 1.75C5.27614 1.75 5.5 1.97386 5.5 2.25V2.56183C5.90202 2.66355 6.25675 2.88729 6.48795 3.20702C6.64975 3.4308 6.59952 3.74337 6.37575 3.90517C6.15198 4.06698 5.8394 4.01675 5.6776 3.79298C5.56897 3.64274 5.32671 3.5 5 3.5H4.86111C4.41372 3.5 4.25 3.77246 4.25 3.88889V3.92705C4.25 4.02568 4.32456 4.19131 4.57627 4.29199L5.79512 4.77953C6.32859 4.99292 6.75 5.4693 6.75 6.07295C6.75 6.80947 6.1615 7.3072 5.5 7.45453V7.75C5.5 8.02614 5.27614 8.25 5 8.25C4.72386 8.25 4.5 8.02614 4.5 7.75V7.43817C4.09798 7.33645 3.74325 7.11271 3.51205 6.79298C3.35025 6.5692 3.40048 6.25663 3.62425 6.09483C3.84802 5.93302 4.1606 5.98325 4.3224 6.20702C4.43103 6.35726 4.67329 6.5 5 6.5H5.09119C5.56492 6.5 5.75 6.21045 5.75 6.07295C5.75 5.97432 5.67544 5.80869 5.42373 5.70801L4.20488 5.22047C3.67141 5.00708 3.25 4.5307 3.25 3.92705V3.88889C3.25 3.15689 3.84468 2.66952 4.5 2.53666V2.25C4.5 1.97386 4.72386 1.75 5 1.75Z" fill="currentColor" className="text-[#252525] dark:text-page-text"/></svg>
              <span className="font-inter text-xs tracking-[-0.02em] text-[#252525] dark:text-page-text">CPM rate</span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">$1.00</span>
            </span>
            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
              <svg width="12" height="12" viewBox="0 0 15 11" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.08659 0C9.76018 0 12.36 1.65151 14.0402 4.79945C14.2175 5.1315 14.2175 5.53519 14.0402 5.86724C12.36 9.01519 9.76017 10.6666 7.08658 10.6666C4.41299 10.6666 1.81317 9.01511 0.132928 5.86717C-0.0443094 5.53511-0.0443093 5.13143 0.132928 4.79937C1.81318 1.65143 4.413 0 7.08659 0ZM4.66992 5.33333C4.66992 3.99864 5.75189 2.91667 7.08658 2.91667C8.42127 2.91667 9.50325 3.99864 9.50325 5.33333C9.50325 6.66802 8.42127 7.75 7.08658 7.75C5.75189 7.75 4.66992 6.66802 4.66992 5.33333Z" fill="currentColor" className="text-[#252525] dark:text-page-text"/></svg>
              <span className="font-inter text-xs tracking-[-0.02em] text-[#252525] dark:text-page-text">Views</span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">7.5M</span>
            </span>
          </div>
        </div>

        {/* Spend summary */}
        <div className="flex flex-1 flex-col rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none">
          <span className="mb-4 font-inter text-xs tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">Spend summary</span>
          <div className="flex flex-col gap-0">
            {[
              { label: "Campaign budget", value: "$10,000", color: "" },
              { label: "Creator payouts", value: "-$7,123", color: "text-[#FF3355] dark:text-[#FB7185]" },
              { label: "Clawbacks recovered", value: "+$377", color: "text-[#00994D] dark:text-[#34D399]" },
              { label: "Platform fee (7%)", value: "-$700", color: "text-[#FF3355] dark:text-[#FB7185]" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-[rgba(37,37,37,0.06)] py-3 dark:border-[rgba(224,224,224,0.03)]">
                <span className="text-[13px] tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]">{item.label}</span>
                <span className={cn("text-[13px] tracking-[-0.02em]", item.color || "text-page-text")}>{item.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3">
              <span className="text-[13px] font-semibold tracking-[-0.02em] text-page-text">Remaining budget</span>
              <span className="text-[14px] font-medium tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">$2,554</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats row */}
      <SwipeableStatCards cards={[
        { label: "Total budget", value: "$15,000" },
        { label: "Remaining", value: "$3,750", valueColor: "text-[#00994D] dark:text-[#34D399]", secondary: "12 days left" },
        { label: "Daily burn rate", value: "$312", secondary: "+8% vs last week", secondaryColor: "text-[#FF3355] dark:text-[#FB7185]" },
      ]} columns={3} />

      {/* Recent transactions table */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none">
        {/* Header row */}
        <div className="overflow-x-auto scrollbar-hide">
        <div className="flex h-9 min-w-[700px] items-center border-b border-[rgba(37,37,37,0.06)] px-1 dark:border-[rgba(224,224,224,0.03)]">
          <span className="flex w-20 items-center px-3 font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">Date</span>
          <span className="flex w-60 items-center pr-3 font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">Creator</span>
          <span className="flex flex-1 items-center pr-3 font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">Video</span>
          <span className="flex w-24 items-center justify-end px-3 font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">Views</span>
          <span className="flex w-24 items-center justify-end px-3 font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">Amount</span>
          <span className="flex w-32 items-center justify-end px-3 font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">Status</span>
        </div>
        {/* Body with proximity hover */}
        <div
          ref={tableContainerRef}
          className="relative"
          onMouseEnter={handlers.onMouseEnter}
          onMouseMove={handlers.onMouseMove}
          onMouseLeave={handlers.onMouseLeave}
        >
          <AnimatePresence>
            {activeRect && (
              <motion.div
                key={sessionRef.current}
                className="pointer-events-none absolute bg-foreground/[0.04]"
                initial={{ opacity: 0, ...activeRect }}
                animate={{ opacity: 1, ...activeRect }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
              />
            )}
          </AnimatePresence>
          {TRANSACTIONS.map((tx, i) => (
            <div
              key={i}
              ref={(el) => registerItem(i, el)}
              className="relative z-10 flex min-w-[700px] items-center px-1"
            >
              <div className={cn("flex h-14 flex-1 items-center", i < TRANSACTIONS.length - 1 && "border-b border-[rgba(37,37,37,0.03)] dark:border-[rgba(224,224,224,0.03)]")}>
                <span className="flex w-20 items-center px-3 font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted whitespace-nowrap">{tx.date}</span>
                <div className="flex w-60 items-center gap-2 pr-3 min-w-0">
                  <div className={cn("size-6 shrink-0 rounded-full flex items-center justify-center text-[9px] font-semibold text-white", tx.color)}>{tx.initials}</div>
                  <span className="font-inter text-xs tracking-[-0.02em] text-[#252525] dark:text-page-text truncate">{tx.handle}</span>
                </div>
                <span className="flex-1 truncate pr-3 font-inter text-xs tracking-[-0.02em] text-[#252525] dark:text-page-text min-w-0">{tx.video}</span>
                <span className="flex w-24 items-center justify-end px-3 font-inter text-xs tracking-[-0.02em] text-[#252525] dark:text-page-text whitespace-nowrap">{tx.views}</span>
                <span className="flex w-24 items-center justify-end px-3 font-inter text-xs tracking-[-0.02em] text-[#252525] dark:text-page-text whitespace-nowrap">{tx.amount}</span>
                <div className="flex w-32 items-center justify-end px-3">
                  <StatusPill status={tx.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
