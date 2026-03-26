"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/campaign-flow/PlatformButton";
import { IconExternalLink } from "@tabler/icons-react";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

// ── Types ────────────────────────────────────────────────────────────

type CreatorStatus = "active" | "started" | "viewers" | "inactive" | "banned";

type FooterVariant = "period-ending" | "requested-change" | "completed";

interface CreatorCard {
  id: string;
  name: string;
  handle: string;
  platforms: string[];
  status: CreatorStatus;
  contractSince: string;
  submissions: number;
  hasPendingReview: boolean;
  footer: FooterVariant;
}

// ── Mock Data ────────────────────────────────────────────────────────

const CREATORS: CreatorCard[] = [
  { id: "1", name: "Kaizen", handle: "@xkaizen", platforms: ["tiktok", "instagram"], status: "active", contractSince: "01/01/2026", submissions: 12, hasPendingReview: true, footer: "period-ending" },
  { id: "2", name: "Clipster Mafia", handle: "@clipstermafia", platforms: ["tiktok", "instagram"], status: "active", contractSince: "02/15/2026", submissions: 8, hasPendingReview: false, footer: "completed" },
  { id: "3", name: "Edit Queen", handle: "@editqueen", platforms: ["tiktok", "instagram"], status: "started", contractSince: "01/10/2026", submissions: 5, hasPendingReview: true, footer: "requested-change" },
  { id: "4", name: "Viral Cuts", handle: "@viralcuts", platforms: ["tiktok", "instagram"], status: "viewers", contractSince: "03/01/2026", submissions: 3, hasPendingReview: false, footer: "period-ending" },
  { id: "5", name: "Content King", handle: "@contentking", platforms: ["tiktok", "instagram"], status: "active", contractSince: "12/20/2025", submissions: 18, hasPendingReview: true, footer: "completed" },
  { id: "6", name: "Reel Master", handle: "@reelmaster", platforms: ["tiktok", "instagram"], status: "started", contractSince: "01/05/2026", submissions: 7, hasPendingReview: false, footer: "requested-change" },
  { id: "7", name: "Trendsetter", handle: "@trendsettr", platforms: ["tiktok", "instagram"], status: "viewers", contractSince: "02/01/2026", submissions: 2, hasPendingReview: false, footer: "period-ending" },
  { id: "8", name: "Clip God", handle: "@clipgod", platforms: ["tiktok", "instagram"], status: "inactive", contractSince: "11/15/2025", submissions: 15, hasPendingReview: false, footer: "completed" },
  { id: "9", name: "Media Flow", handle: "@mediaflow", platforms: ["tiktok", "instagram"], status: "active", contractSince: "01/20/2026", submissions: 10, hasPendingReview: true, footer: "requested-change" },
  { id: "10", name: "Buzz Maker", handle: "@buzzmaker", platforms: ["tiktok", "instagram"], status: "viewers", contractSince: "02/10/2026", submissions: 4, hasPendingReview: false, footer: "period-ending" },
  { id: "11", name: "Frame Forge", handle: "@frameforge", platforms: ["tiktok", "instagram"], status: "banned", contractSince: "12/01/2025", submissions: 6, hasPendingReview: false, footer: "completed" },
  { id: "12", name: "Cut Craft", handle: "@cutcraft", platforms: ["tiktok", "instagram"], status: "inactive", contractSince: "01/15/2026", submissions: 9, hasPendingReview: true, footer: "requested-change" },
];

const STATUS_TABS: { label: string; value: CreatorStatus | "all"; count: number }[] = [
  { label: "All", value: "all", count: 47 },
  { label: "Active", value: "active", count: 12 },
  { label: "Started", value: "started", count: 8 },
  { label: "Viewers", value: "viewers", count: 15 },
  { label: "Inactive", value: "inactive", count: 12 },
  { label: "Banned", value: "banned", count: 7 },
];

// ── Component ────────────────────────────────────────────────────────

export default function CreatorsTab() {
  const [filter, setFilter] = useState<CreatorStatus | "all">("active");
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Filter tabs proximity hover (horizontal)
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const { activeIndex: filterActiveIndex, itemRects: filterItemRects, sessionRef: filterSessionRef, handlers: filterHandlers, registerItem: filterRegisterItem, measureItems: filterMeasureItems } = useProximityHover(filterContainerRef, { axis: "x" });
  useEffect(() => { filterMeasureItems(); }, [filterMeasureItems]);
  const filterActiveRect = filterActiveIndex !== null ? filterItemRects[filterActiveIndex] : null;

  const filtered =
    filter === "all"
      ? CREATORS
      : CREATORS.filter((c) => c.status === filter);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  };

  const exitBulkMode = () => {
    setBulkMode(false);
    setSelected(new Set());
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Participation Breakdown Card ─────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none [--part-green:rgba(0,153,77,0.6)] [--part-orange:rgba(229,113,0,0.6)] [--part-red:rgba(255,51,85,0.6)] [--part-remaining:rgba(37,37,37,0.06)] dark:[--part-green:rgba(52,211,153,0.6)] dark:[--part-orange:rgba(251,146,60,0.6)] dark:[--part-red:rgba(251,113,133,0.6)] dark:[--part-remaining:rgba(224,224,224,0.03)] [--part-dot-green:#00994D] [--part-dot-orange:#E57100] [--part-dot-red:#FF3355] dark:[--part-dot-green:#34D399] dark:[--part-dot-orange:#FB923C] dark:[--part-dot-red:#FB7185]">
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
          Creator participation breakdown
        </span>

        {/* Stacked bar */}
        <div className="flex h-10 gap-px overflow-hidden rounded-xl bg-white dark:bg-[rgba(224,224,224,0.03)]">
          <div
            className="flex items-center justify-center font-inter text-xs font-medium tracking-[-0.02em] text-white"
            style={{ width: "25%", backgroundColor: "var(--part-green)" }}
          >
            25%
          </div>
          <div
            className="flex items-center justify-center font-inter text-xs font-medium tracking-[-0.02em] text-white"
            style={{ width: "18%", backgroundColor: "var(--part-orange)" }}
          >
            18%
          </div>
          <div
            className="flex flex-1 items-center justify-center font-inter text-xs font-medium tracking-[-0.02em] text-white"
            style={{ backgroundColor: "var(--part-red)" }}
          >
            32%
          </div>
          <div
            className="flex items-center justify-center font-inter text-xs font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-white/50"
            style={{ width: "25%", backgroundColor: "var(--part-remaining)" }}
          >
            25%
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2">
          <LegendBadge color="var(--part-dot-green)" label="Active" count={12} />
          <LegendBadge color="var(--part-dot-orange)" label="Started" count={8} />
          <LegendBadge color="var(--part-dot-red)" label="Viewers" count={15} />
          <LegendBadge color="rgba(37,37,37,0.5)" label="Inactive" count={12} muted />
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Segmented control */}
        <div
          ref={filterContainerRef}
          className="relative flex items-center gap-0.5 rounded-xl bg-accent p-0.5 dark:bg-card-bg overflow-x-auto scrollbar-hide whitespace-nowrap sm:inline-flex"
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
          {STATUS_TABS.map((tab, i) => (
            <button
              key={tab.value}
              ref={(el) => filterRegisterItem(i, el)}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={cn(
                "relative z-10 flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-[13px] font-medium tracking-[-0.02em] transition-all",
                filter === tab.value
                  ? "bg-white text-[#252525] shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[#222222] dark:text-page-text"
                  : "text-page-text-muted"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "text-[12px]",
                  filter === tab.value
                    ? "text-page-text-muted"
                    : "text-[rgba(37,37,37,0.35)] dark:text-[rgba(255,255,255,0.3)]"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bulk nudge toggle */}
        <div className="flex w-full items-center gap-2 sm:w-auto">
          {bulkMode && (
            <button
              type="button"
              onClick={toggleAll}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.5)] transition-colors hover:text-[#252525] dark:text-[rgba(255,255,255,0.45)] dark:hover:text-[#e5e5e5]"
            >
              {selected.size === filtered.length ? "Deselect all" : "Select all"}
            </button>
          )}
          <button
            type="button"
            onClick={() => bulkMode ? exitBulkMode() : setBulkMode(true)}
            className={cn(
              "flex h-9 w-full cursor-pointer items-center justify-center rounded-full px-4 font-inter text-sm font-medium tracking-[-0.02em] transition-colors sm:h-8 sm:w-auto sm:px-3 sm:text-[13px]",
              bulkMode
                ? "bg-[#252525] text-white dark:bg-[#e5e5e5] dark:text-[#1a1a1a]"
                : "bg-[rgba(37,37,37,0.06)] text-[#252525] hover:bg-[rgba(37,37,37,0.10)] dark:bg-[rgba(255,255,255,0.06)] dark:text-page-text dark:hover:bg-[rgba(255,255,255,0.10)]",
            )}
          >
            {bulkMode ? "Cancel" : "Bulk nudge"}
          </button>
        </div>
      </div>

      {/* ── Creator Cards Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((creator) => (
          <CreatorCardItem
            key={creator.id}
            creator={creator}
            bulkMode={bulkMode}
            isSelected={selected.has(creator.id)}
            onToggle={() => toggleSelect(creator.id)}
          />
        ))}
      </div>

      {/* ── Floating bulk action bar ───────────────────────────── */}
      <AnimatePresence>
        {bulkMode && selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 py-2 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg"
          >
            <span className="flex h-7 items-center rounded-full bg-[rgba(37,37,37,0.06)] px-3 text-[13px] font-medium tracking-[-0.02em] text-[#252525] dark:bg-[rgba(255,255,255,0.06)] dark:text-[#E0E0E0]">
              {selected.size} selected
            </span>
            <button
              type="button"
              onClick={exitBulkMode}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[#252525] px-4 text-[13px] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#333] dark:bg-[#e5e5e5] dark:text-[#1a1a1a] dark:hover:bg-[#d5d5d5]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4v2h16V4zm-2 8l-4-4v3H4v2h10v3l4-4zm2 6H4v2h16v-2z" /></svg>
              Send nudge
            </button>
            <button
              type="button"
              onClick={exitBulkMode}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.06)] dark:text-[rgba(255,255,255,0.45)] dark:hover:bg-[rgba(255,255,255,0.06)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Legend Badge ──────────────────────────────────────────────────────

function LegendBadge({
  color,
  label,
  count,
  muted,
}: {
  color: string;
  label: string;
  count: number;
  muted?: boolean;
}) {
  return (
    <div className="flex h-6 items-center gap-1 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[12px] tracking-[-0.02em] text-page-text-muted">
        {label}
      </span>
      <span
        className={cn(
          "text-[12px] font-medium tracking-[-0.02em]",
          muted
            ? "text-page-text-muted"
            : ""
        )}
        style={!muted ? { color } : undefined}
      >
        {count}
      </span>
    </div>
  );
}

// ── Creator Card ─────────────────────────────────────────────────────

function CreatorCardItem({
  creator,
  bulkMode = false,
  isSelected = false,
  onToggle,
}: {
  creator: CreatorCard;
  bulkMode?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
}) {
  const footerText = (() => {
    switch (creator.footer) {
      case "period-ending":
        return { label: "Period ending soon", color: "#FF3355" };
      case "requested-change":
        return { label: "Requested a change", color: undefined };
      case "completed":
        return { label: "Completed", color: "#00994D" };
    }
  })();

  const actionLabel =
    creator.footer === "completed" ? "Renew contract" : "View contract";

  return (
    <div
      onClick={bulkMode ? onToggle : undefined}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors dark:bg-card-bg",
        bulkMode && "cursor-pointer",
        isSelected
          ? "border-[#252525] dark:border-[#e5e5e5]"
          : "border-border",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Checkbox / Avatar */}
          {bulkMode ? (
            <div className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
              isSelected
                ? "border-[#252525] bg-[#252525] dark:border-[#e5e5e5] dark:bg-[#e5e5e5]"
                : "border-[rgba(37,37,37,0.24)] bg-white dark:border-[rgba(255,255,255,0.24)] dark:bg-transparent",
            )}>
              {isSelected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" className="dark:fill-[#1a1a1a]" />
                </svg>
              )}
            </div>
          ) : null}
          <div className="h-9 w-9 shrink-0 rounded-full bg-[rgba(37,37,37,0.08)] dark:bg-[rgba(255,255,255,0.08)]" />
          {/* Name / handle */}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[14px] font-medium tracking-[-0.02em] text-page-text">
              {creator.name}
            </span>
            <div className="flex items-center gap-1 text-[12px] tracking-[-0.02em] text-page-text-muted">
              <span>{creator.handle}</span>
              <span className="text-[rgba(37,37,37,0.25)] dark:text-[rgba(255,255,255,0.2)]">
                &middot;
              </span>
              <div className="flex items-center gap-0.5">
                {creator.platforms.map((p) => (
                  <PlatformIcon key={p} platform={p} size={16} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Review videos button */}
        <button
          type="button"
          className={cn(
            "flex h-7 items-center gap-1 rounded-full px-2.5 text-[12px] font-medium tracking-[-0.02em] transition-opacity",
            creator.hasPendingReview
              ? "bg-[#252525] text-white dark:bg-[#e5e5e5] dark:text-[#1a1a1a]"
              : "pointer-events-none opacity-0"
          )}
        >
          Review videos
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] tracking-[-0.02em] text-page-text-muted">
            Contract since
          </span>
          <span className="text-[13px] font-medium tracking-[-0.02em] text-page-text">
            {creator.contractSince}
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[12px] tracking-[-0.02em] text-page-text-muted">
            Submissions
          </span>
          <span className="text-[13px] font-medium tracking-[-0.02em] text-page-text">
            {creator.submissions}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(255,255,255,0.06)]" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-[13px] font-medium tracking-[-0.02em]",
            !footerText.color && "text-page-text"
          )}
          style={footerText.color ? { color: footerText.color } : undefined}
        >
          {footerText.label}
        </span>

        <button
          type="button"
          className="flex h-7 items-center gap-1 rounded-full bg-[rgba(37,37,37,0.06)] px-2.5 text-[12px] font-medium tracking-[-0.02em] text-[rgba(37,37,37,0.7)] transition-colors hover:bg-[rgba(37,37,37,0.10)] dark:bg-[rgba(255,255,255,0.06)] dark:text-[rgba(255,255,255,0.6)] dark:hover:bg-[rgba(255,255,255,0.10)]"
        >
          <span>{actionLabel}</span>
          <IconExternalLink size={14} stroke={1.5} />
        </button>
      </div>
    </div>
  );
}
