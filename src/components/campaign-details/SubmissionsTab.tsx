"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/campaign-flow/PlatformButton";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

const SUBMISSIONS = [
  { date: "2h ago", handle: "@clipstermafia", initials: "CM", color: "bg-violet-500", video: "Day in the life vlog #47", platform: "tiktok", views: "1.2M", amount: "$1,200.00", status: "approved" as const },
  { date: "2h ago", handle: "@editqueen", initials: "EQ", color: "bg-pink-500", video: "Get ready with me — spring edit", platform: "tiktok", views: "890K", amount: "$890.00", status: "pending" as const },
  { date: "6h ago", handle: "@viralcuts", initials: "VC", color: "bg-blue-500", video: "POV: You finally tried it", platform: "tiktok", views: "2.1M", amount: "$2,100.00", status: "approved" as const },
  { date: "6h ago", handle: "@contentking", initials: "CK", color: "bg-emerald-500", video: "Honest review — no sponsorship", platform: "tiktok", views: "640K", amount: "$640.00", status: "pending" as const },
  { date: "1d ago", handle: "@clipstermafia", initials: "CM", color: "bg-violet-500", video: "Unboxing haul February edition", platform: "tiktok", views: "430K", amount: "$430.00", status: "approved" as const },
  { date: "1d ago", handle: "@editqueen", initials: "EQ", color: "bg-pink-500", video: "Morning routine — real talk", platform: "tiktok", views: "310K", amount: "$310.00", status: "approved" as const },
  { date: "2d ago", handle: "@viralcuts", initials: "VC", color: "bg-blue-500", video: "This product changed everything", platform: "tiktok", views: "1.8M", amount: "$1,800.00", status: "approved" as const },
  { date: "Feb 18", handle: "@contentking", initials: "CK", color: "bg-emerald-500", video: "Side-by-side comparison review", platform: "tiktok", views: "520K", amount: "$520.00", status: "approved" as const },
];

const FILTER_TABS = [
  { label: "All", value: "all", count: 98 },
  { label: "Pending", value: "pending", count: 8 },
  { label: "Approved", value: "approved", count: 5 },
  { label: "Rejected", value: "rejected", count: 5 },
  { label: "Flagged", value: "flagged", count: 3 },
];

function StatCard({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex-1 flex flex-col gap-3 bg-white dark:bg-card-bg border border-border shadow-[0px_1px_2px_rgba(0,0,0,0.03)] rounded-2xl p-4">
      <span className="text-[12px] tracking-[-0.02em] text-page-text-muted">{label}</span>
      <span className={cn("text-[24px] font-medium tracking-[-0.02em]", valueColor || "text-page-text")}>{value}</span>
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

function StatusPill({ status }: { status: "approved" | "pending" }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium tracking-[-0.02em] bg-[rgba(0,153,77,0.08)] text-[#00994D] dark:text-[#34D399]">
        <CheckCircleIcon />
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium tracking-[-0.02em] bg-[rgba(229,113,0,0.08)] text-[#E57100]">
      <ClockIcon />
      Pending
    </span>
  );
}

export default function SubmissionsTab() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Table proximity hover
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { activeIndex: tableActiveIndex, itemRects: tableItemRects, sessionRef: tableSessionRef, handlers: tableHandlers, registerItem: tableRegisterItem, measureItems: tableMeasureItems } = useProximityHover(tableContainerRef);
  useEffect(() => { tableMeasureItems(); }, [tableMeasureItems]);
  const tableActiveRect = tableActiveIndex !== null ? tableItemRects[tableActiveIndex] : null;

  // Filter tabs proximity hover (horizontal)
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const { activeIndex: filterActiveIndex, itemRects: filterItemRects, sessionRef: filterSessionRef, handlers: filterHandlers, registerItem: filterRegisterItem, measureItems: filterMeasureItems } = useProximityHover(filterContainerRef, { axis: "x" });
  useEffect(() => { filterMeasureItems(); }, [filterMeasureItems]);
  const filterActiveRect = filterActiveIndex !== null ? filterItemRects[filterActiveIndex] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Top stats row */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatCard label="Total submissions" value="98" />
        <StatCard label="Pending review" value="9" />
        <StatCard label="Approved" value="89" valueColor="text-[#00994D] dark:text-[#34D399]" />
        <StatCard label="Total views" value="2.4M" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div
          ref={filterContainerRef}
          className="relative inline-flex items-center p-0.5 gap-0.5 bg-accent rounded-xl dark:bg-card-bg"
          onMouseEnter={filterHandlers.onMouseEnter}
          onMouseMove={filterHandlers.onMouseMove}
          onMouseLeave={filterHandlers.onMouseLeave}
        >
          <AnimatePresence>
            {filterActiveRect && (
              <motion.div
                key={filterSessionRef.current}
                className="pointer-events-none absolute rounded-[10px] bg-accent dark:bg-[#1f1f1f]"
                initial={{ opacity: 0, ...filterActiveRect }}
                animate={{ opacity: 1, ...filterActiveRect }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
              />
            )}
          </AnimatePresence>
          {FILTER_TABS.map((tab, i) => {
            const isActive = tab.value === activeFilter;
            return (
              <button
                key={tab.value}
                ref={(el) => filterRegisterItem(i, el)}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  "relative z-10 flex items-center justify-center gap-1.5 h-8 px-4 text-sm font-medium tracking-[-0.02em] rounded-[10px] transition-all",
                  isActive
                    ? "bg-white dark:bg-[#222222] shadow-[0px_2px_4px_rgba(0,0,0,0.06)] text-page-text"
                    : "text-page-text-subtle"
                )}
                type="button"
              >
                {tab.label}
                <span className={cn(
                  "text-[11px] tabular-nums",
                  isActive
                    ? "text-page-text-muted"
                    : "text-[rgba(37,37,37,0.4)] dark:text-[rgba(255,255,255,0.35)]"
                )}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(255,255,255,0.06)] text-[13px] font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)] hover:bg-[rgba(37,37,37,0.10)] dark:hover:bg-[rgba(255,255,255,0.10)] transition-colors"
        >
          Open in Submissions Hub
        </button>
      </div>

      {/* Submissions table */}
      <div className="relative overflow-hidden bg-white dark:bg-card-bg border border-border shadow-[0px_1px_2px_rgba(0,0,0,0.03)] rounded-2xl">
        <div className="p-5 pb-0">
          <span className="text-[13px] font-medium tracking-[-0.02em] text-page-text-muted">Submissions</span>
        </div>
        {/* Header row */}
        <div className="overflow-x-auto">
        <div className="grid min-w-[750px] grid-cols-[80px_1fr_1fr_96px_96px_96px_128px] px-5 py-3 border-b border-border">
          <span className="text-[12px] font-medium tracking-[-0.02em] text-page-text-muted">Date</span>
          <span className="text-[12px] font-medium tracking-[-0.02em] text-page-text-muted">Creator</span>
          <span className="text-[12px] font-medium tracking-[-0.02em] text-page-text-muted">Video</span>
          <span className="text-[12px] font-medium tracking-[-0.02em] text-page-text-muted text-right">Platform</span>
          <span className="text-[12px] font-medium tracking-[-0.02em] text-page-text-muted text-right">Views</span>
          <span className="text-[12px] font-medium tracking-[-0.02em] text-page-text-muted text-right">Amount</span>
          <span className="text-[12px] font-medium tracking-[-0.02em] text-page-text-muted text-right">Status</span>
        </div>
        {/* Body with proximity hover */}
        <div
          ref={tableContainerRef}
          className="relative"
          onMouseEnter={tableHandlers.onMouseEnter}
          onMouseMove={tableHandlers.onMouseMove}
          onMouseLeave={tableHandlers.onMouseLeave}
        >
          <AnimatePresence>
            {tableActiveRect && (
              <motion.div
                key={tableSessionRef.current}
                className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
                initial={{ opacity: 0, ...tableActiveRect }}
                animate={{ opacity: 1, ...tableActiveRect }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
              />
            )}
          </AnimatePresence>
          {SUBMISSIONS.map((sub, i) => (
            <div
              key={i}
              ref={(el) => tableRegisterItem(i, el)}
              className="relative z-10 grid min-w-[750px] grid-cols-[80px_1fr_1fr_96px_96px_96px_128px] items-center px-5 h-14 border-b border-border last:border-b-0"
            >
              <span className="text-[13px] tracking-[-0.02em] text-page-text-muted whitespace-nowrap">{sub.date}</span>
              <div className="flex items-center gap-2 min-w-0">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0", sub.color)}>{sub.initials}</div>
                <span className="text-[13px] tracking-[-0.02em] text-page-text truncate">{sub.handle}</span>
              </div>
              <span className="text-[13px] tracking-[-0.02em] text-page-text truncate min-w-0">{sub.video}</span>
              <div className="flex items-center justify-end">
                <div className="w-6 h-6 rounded-full bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
                  <PlatformIcon platform={sub.platform} size={14} />
                </div>
              </div>
              <span className="text-[13px] tracking-[-0.02em] text-page-text text-right whitespace-nowrap">{sub.views}</span>
              <span className="text-[13px] tracking-[-0.02em] text-page-text text-right whitespace-nowrap">{sub.amount}</span>
              <div className="flex justify-end">
                <StatusPill status={sub.status} />
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
