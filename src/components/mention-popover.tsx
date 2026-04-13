"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import type { MentionCreator, MentionCampaign, MentionItem } from "@/hooks/use-mention-popover";

interface MentionPopoverProps {
  open: boolean;
  query: string;
  activeTab: "creators" | "campaigns";
  onTabChange: (tab: "creators" | "campaigns") => void;
  creators: MentionCreator[];
  campaigns: MentionCampaign[];
  highlightIndex: number;
  onHighlightChange: (i: number) => void;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
  mode: "floating" | "sidebar";
}

function CreatorRow({ creator, index, registerItem, onSelect }: {
  creator: MentionCreator;
  index: number;
  registerItem: (i: number, el: HTMLElement | null) => void;
  onSelect: () => void;
}) {
  return (
    <button
      ref={(el) => registerItem(index, el)}
      onClick={onSelect}
      className="relative z-10 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left"
    >
      <img
        src={creator.avatar}
        alt=""
        className="size-7 shrink-0 rounded-full border border-foreground/[0.06] object-cover"
      />
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-page-text">
        {creator.name}
        <span className="ml-1.5 text-[12px] font-normal text-page-text-muted hover:underline">{creator.username}</span>
      </span>
      <PlatformIcon platform={creator.platform} size={14} className="shrink-0 text-page-text-muted" />
      <span className="shrink-0 text-[12px] font-medium text-page-text-muted">{creator.followers}</span>
    </button>
  );
}

function CampaignRow({ campaign, index, registerItem, onSelect }: {
  campaign: MentionCampaign;
  index: number;
  registerItem: (i: number, el: HTMLElement | null) => void;
  onSelect: () => void;
}) {
  const statusColor = campaign.status === "active" ? "text-emerald-500" : campaign.status === "paused" ? "text-amber-500" : "text-page-text-subtle";
  return (
    <button
      ref={(el) => registerItem(index, el)}
      onClick={onSelect}
      className="relative z-10 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left"
    >
      {/* Megaphone icon (from sidebar) */}
      <svg width="14" height="13" viewBox="0 0 14 13" fill="none" className="shrink-0 text-page-text-muted">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.72682 0.0956162C10.0167 -0.314893 11.3333 0.647774 11.3333 2.00143V2.92856C12.4835 3.22459 13.3333 4.26866 13.3333 5.51122C13.3333 6.75377 12.4835 7.79784 11.3333 8.09387V9.02099C11.3333 10.3747 10.0167 11.3373 8.72682 10.9268L7.75954 10.619C7.33923 11.5381 6.41174 12.1779 5.33333 12.1779C3.86057 12.1779 2.66667 10.984 2.66667 9.51122V8.99194L1.39209 8.58529C0.562899 8.32074 0 7.55029 0 6.67992V4.34251C0 3.47213 0.5629 2.70169 1.3921 2.43713L3.05054 1.90801C3.08151 1.89339 3.11379 1.88109 3.14715 1.87132L8.72682 0.0956162ZM4 9.42252V9.51122C4 10.2476 4.59695 10.8445 5.33333 10.8445C5.81334 10.8445 6.23523 10.5906 6.47014 10.2086L4 9.42252ZM12 5.51122C12 6.00474 11.7319 6.43563 11.3333 6.66617V4.35626C11.7319 4.5868 12 5.01769 12 5.51122ZM2.66813 3.42957V7.59286L1.79737 7.31504C1.52097 7.22686 1.33333 6.97004 1.33333 6.67992V4.34251C1.33333 4.05238 1.52097 3.79557 1.79737 3.70738L2.66813 3.42957Z" fill="currentColor"/>
      </svg>
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-page-text">{campaign.title}</span>
      <span className={cn("shrink-0 text-[11px] font-medium capitalize", statusColor)}>{campaign.status}</span>
      <span className="shrink-0 text-[12px] font-medium text-page-text-muted">{campaign.budget}</span>
    </button>
  );
}

export function MentionPopover({
  open,
  query,
  activeTab,
  onTabChange,
  creators,
  campaigns,
  highlightIndex,
  onHighlightChange,
  onSelect,
  onClose,
  mode,
}: MentionPopoverProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const {
    activeIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
  } = useProximityHover(listRef);

  const currentItems = activeTab === "creators" ? creators : campaigns;
  const displayIndex = activeIndex ?? highlightIndex;
  const maxH = mode === "floating" ? "max-h-[240px]" : "max-h-[280px]";

  const tabs = [
    { key: "creators" as const, label: "Creators", count: creators.length },
    { key: "campaigns" as const, label: "Campaigns", count: campaigns.length },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-full left-0 right-0 z-50 mb-2 font-inter tracking-[-0.02em]"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card-bg shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            {/* Tabs + keyboard hints in one row */}
            <div className="flex items-center px-1.5 py-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { onTabChange(tab.key); onHighlightChange(0); }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-foreground/[0.06] text-page-text dark:bg-white/[0.06]"
                      : "text-page-text-muted hover:text-page-text"
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    "flex size-[18px] items-center justify-center rounded-full text-[11px]",
                    activeTab === tab.key ? "bg-foreground/[0.08] dark:bg-white/[0.08]" : "bg-foreground/[0.04] dark:bg-white/[0.04]"
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}

              {/* Keyboard hints + query on the right */}
              <div className="ml-auto flex items-center gap-2 pr-1.5">
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded bg-foreground/[0.05] px-1 py-0.5 text-[10px] font-medium text-page-text-subtle dark:bg-white/[0.05]">Tab</kbd>
                  <kbd className="rounded bg-foreground/[0.05] px-1 py-0.5 text-[10px] font-medium text-page-text-subtle dark:bg-white/[0.05]">↑↓</kbd>
                  <kbd className="rounded bg-foreground/[0.05] px-1 py-0.5 text-[10px] font-medium text-page-text-subtle dark:bg-white/[0.05]">↵</kbd>
                </div>
                {query && (
                  <span className="text-[11px] font-medium text-page-text-subtle">@{query}</span>
                )}
              </div>
            </div>

            {/* List with proximity hover */}
            <div
              ref={listRef}
              {...handlers}
              className={cn("relative overflow-y-auto p-1.5", maxH)}
              style={{ scrollbarWidth: "none" }}
            >
              {/* Proximity hover indicator */}
              <AnimatePresence>
                {displayIndex !== null && itemRects[displayIndex] && (
                  <motion.div
                    key={`mention-hover-${sessionRef.current}`}
                    layoutId={`mention-hover-${sessionRef.current}`}
                    className="pointer-events-none absolute left-0 top-0 z-0 rounded-lg bg-foreground/[0.05] dark:bg-white/[0.05]"
                    initial={false}
                    style={{
                      x: itemRects[displayIndex].left,
                      width: itemRects[displayIndex].width,
                      height: itemRects[displayIndex].height,
                    }}
                    animate={{
                      y: itemRects[displayIndex].top,
                    }}
                    transition={springs.fast}
                  />
                )}
              </AnimatePresence>

              {currentItems.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <span className="text-[13px] font-medium text-page-text-subtle">No results for &ldquo;{query}&rdquo;</span>
                </div>
              ) : (
                activeTab === "creators" ? (
                  creators.map((c, i) => (
                    <CreatorRow
                      key={c.id}
                      creator={c}
                      index={i}
                      registerItem={registerItem}
                      onSelect={() => onSelect({ type: "creator", data: c })}
                    />
                  ))
                ) : (
                  campaigns.map((c, i) => (
                    <CampaignRow
                      key={c.id}
                      campaign={c}
                      index={i}
                      registerItem={registerItem}
                      onSelect={() => onSelect({ type: "campaign", data: c })}
                    />
                  ))
                )
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
