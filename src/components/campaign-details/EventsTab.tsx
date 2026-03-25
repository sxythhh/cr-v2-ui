"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { Submissions } from "@/components/sidebar/icons/submissions";
import { Creators } from "@/components/sidebar/icons/creators";
import { Megaphone } from "@/components/sidebar/icons/megaphone";
import { VideoLibraryIcon } from "@/components/sidebar/icons/video-library";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                 */
/* ------------------------------------------------------------------ */

type EventType = "video-ready" | "submission-approved" | "new-joiner" | "requirements-updated";
type FilterType = "all" | "campaign" | "videos";

interface EventItem {
  id: number;
  type: EventType;
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
  highlighted: boolean;
}

const EVENTS: EventItem[] = [
  { id: 1, type: "video-ready", title: "Video ready for review", subtitle: "@xKaizen", time: "just now", unread: true, highlighted: true },
  { id: 2, type: "submission-approved", title: "Submission approved", subtitle: "@xKaizen", time: "32 minutes ago", unread: true, highlighted: true },
  { id: 3, type: "submission-approved", title: "Submission approved", subtitle: "@xKaizen", time: "2 days ago", unread: true, highlighted: true },
  { id: 4, type: "new-joiner", title: "New joiner", subtitle: "@xKaizen", time: "1 hour ago", unread: false, highlighted: false },
  { id: 5, type: "requirements-updated", title: "Campaign requirements updated", subtitle: "Admin", time: "2 days ago", unread: false, highlighted: false },
  { id: 6, type: "video-ready", title: "24 submissions awaiting review", subtitle: "G Fuel Meme Clips", time: "4 days ago", unread: false, highlighted: false },
  { id: 7, type: "submission-approved", title: "Submission approved", subtitle: "@xKaizen", time: "5 days ago", unread: false, highlighted: false },
  { id: 8, type: "new-joiner", title: "New joiner", subtitle: "@xKaizen", time: "5 days ago", unread: false, highlighted: false },
  { id: 9, type: "video-ready", title: "Video ready for review", subtitle: "@xKaizen", time: "6 days ago", unread: false, highlighted: false },
  { id: 10, type: "new-joiner", title: "New joiner", subtitle: "@xKaizen", time: "2 days ago", unread: false, highlighted: false },
];

const EVENT_STYLES: Record<EventType, { icon: React.FC<React.SVGProps<SVGSVGElement> & { "data-hovered"?: boolean }>; color: string; bg: string }> = {
  "video-ready": {
    icon: VideoLibraryIcon as React.FC<React.SVGProps<SVGSVGElement> & { "data-hovered"?: boolean }>,
    color: "text-[#E57100]",
    bg: "bg-[rgba(229,113,0,0.06)] dark:bg-[rgba(229,113,0,0.12)]",
  },
  "submission-approved": {
    icon: Submissions,
    color: "text-[#00994D] dark:text-[#34D399]",
    bg: "bg-[rgba(0,178,89,0.04)] dark:bg-[rgba(0,178,89,0.1)]",
  },
  "new-joiner": {
    icon: Creators,
    color: "text-[#AE4EEE]",
    bg: "bg-[rgba(174,78,238,0.06)] dark:bg-[rgba(174,78,238,0.12)]",
  },
  "requirements-updated": {
    icon: Megaphone,
    color: "text-[#EE4E51]",
    bg: "bg-[rgba(238,78,81,0.06)] dark:bg-[rgba(238,78,81,0.12)]",
  },
};

const FILTERS: { key: FilterType; label: string; count: number }[] = [
  { key: "all", label: "All", count: 25 },
  { key: "campaign", label: "Campaign", count: 4 },
  { key: "videos", label: "Videos", count: 3 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function EventsTab() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Proximity hover for filter sidebar
  const filterRef = useRef<HTMLDivElement>(null);
  const {
    activeIndex: hoverIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
    measureItems,
  } = useProximityHover(filterRef);
  useEffect(() => { measureItems(); }, [measureItems]);
  const hoverRect = hoverIndex !== null ? itemRects[hoverIndex] : null;
  const selectedIndex = FILTERS.findIndex((f) => f.key === activeFilter);

  return (
    <div className="flex gap-4 p-5">
      {/* Left sidebar filters — sticky within scroll container */}
      <div className="w-[186px] shrink-0">
        <div
          ref={filterRef}
          className={cn(
            "sticky top-5 flex w-[186px] flex-col gap-1 rounded-2xl p-1",
            "bg-[rgba(37,37,37,0.04)] dark:bg-[rgba(224,224,224,0.03)]",
          )}
          onMouseEnter={handlers.onMouseEnter}
          onMouseMove={handlers.onMouseMove}
          onMouseLeave={handlers.onMouseLeave}
        >
          {/* Proximity hover highlight */}
          <AnimatePresence>
            {hoverRect && hoverIndex !== selectedIndex && (
              <motion.div
                key={sessionRef.current}
                className="pointer-events-none absolute rounded-xl bg-foreground/[0.04]"
                initial={{ opacity: 0, ...hoverRect }}
                animate={{ opacity: 1, ...hoverRect }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
              />
            )}
          </AnimatePresence>

          {FILTERS.map((f, i) => (
            <button
              key={f.key}
              ref={(el) => registerItem(i, el)}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                "relative z-10 flex h-9 cursor-pointer items-center justify-between rounded-xl px-2.5 transition-colors",
                activeFilter === f.key
                  ? "bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_2px_4px_rgba(0,0,0,0.06)]"
                  : "",
              )}
            >
              <span className={cn(
                "text-[14px] font-medium tracking-[-0.02em] transition-colors",
                activeFilter === f.key || hoverIndex === i
                  ? "text-[rgba(37,37,37,0.9)] dark:text-[rgba(255,255,255,0.8)]"
                  : "text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]",
              )}>
                {f.label}
              </span>
              <span className="inline-flex items-center justify-center rounded-full bg-[rgba(255,51,85,0.1)] px-1 text-[10px] font-semibold tracking-[-0.02em] text-[#FF3355] dark:text-[#FB7185]">
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right event feed */}
      <div className="flex flex-1 justify-center">
      <div
        className={cn(
          "flex w-full max-w-[600px] flex-col rounded-2xl border p-5",
          "border-border bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
          "dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
        )}
      >
        <div className="flex flex-col gap-2">
          {EVENTS.map((event) => {
            const style = EVENT_STYLES[event.type];
            const Icon = style.icon;

            return (
              <div
                key={event.id}
                className={cn(
                  "relative flex gap-3 rounded-2xl border p-4",
                  event.highlighted
                    ? "border-[rgba(251,146,60,0.3)] dark:border-[rgba(251,146,60,0.15)]"
                    : "border-foreground/[0.06] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none",
                )}
              >
                {/* Background overlay for highlighted */}
                {event.highlighted && (
                  <>
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl dark:hidden"
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.12) 0%, rgba(255,144,37,0) 50%), #FFFFFF",
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 hidden rounded-2xl dark:block"
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.12) 0%, rgba(255,144,37,0) 50%), rgba(224,224,224,0.03)",
                      }}
                    />
                  </>
                )}

                {/* Unread dot */}
                {event.unread && (
                  <span className="absolute -right-1 -top-1 flex items-center justify-center">
                    <span className="size-2 rounded-full border-2 border-white bg-[#FB7185] dark:border-[rgba(224,224,224,0.03)]" />
                  </span>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full",
                    style.bg,
                  )}
                >
                  <Icon width={20} height={20} className={style.color} />
                </div>

                {/* Content */}
                <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[14px] font-medium tracking-[-0.02em] text-page-text">
                      {event.title}
                    </span>
                    <span className="ml-2 shrink-0 text-[12px] tracking-[-0.02em] text-page-text-muted">
                      {event.time}
                    </span>
                  </div>
                  <span className="text-[14px] leading-[150%] tracking-[-0.02em] text-page-text-muted">
                    {event.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
