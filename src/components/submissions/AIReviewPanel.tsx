"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SubmissionChatBubbleIcon as ChatBubbleIcon, ChevronDownIcon, FileTextIcon, VideoClipIcon } from "./icons";
import { CheckSection } from "./CheckSection";
import type { Submission } from "./types";

export function AIReviewPanel({ submission, scoreColor, onAction }: { submission: Submission; scoreColor: string; onAction?: (action: "approve" | "reject") => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [canScroll, setCanScroll] = useState(false);

  const checkScrollable = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrolled(el.scrollTop > 4);
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 8);
    setCanScroll(el.scrollHeight > el.clientHeight + 8);
  }, []);

  const handleScroll = checkScrollable;

  useEffect(() => {
    checkScrollable();
  }, [overviewOpen, checkScrollable]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => checkScrollable());
    for (const child of el.children) ro.observe(child);
    return () => ro.disconnect();
  }, [checkScrollable]);

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-l border-foreground/[0.06] lg:w-[360px]" style={{ minHeight: 0 }}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide relative min-h-0 flex-1 overflow-y-auto"
      >
        <div
          className="pointer-events-none sticky inset-x-0 top-0 z-10 h-[40px] transition-opacity duration-200"
          style={{
            background: "linear-gradient(180deg, var(--card-bg) 60%, transparent 100%)",
            opacity: canScroll && scrolled ? 1 : 0,
          }}
        />

        <div className="flex flex-col gap-2 px-3 pb-3 pt-2" style={{ marginTop: scrolled ? 0 : -40 }}>
          <div className="overflow-hidden rounded-[10px] border border-foreground/[0.06] bg-card-bg dark:border-card-inner-border dark:bg-card-inner-bg">
            <button
              onClick={() => setOverviewOpen((o) => !o)}
              className="flex w-full cursor-pointer items-center gap-1.5 px-3 py-2.5 transition-colors hover:bg-foreground/[0.04]"
            >
              <ChatBubbleIcon />
              <span className="flex-1 text-left font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
                Overview
              </span>
              <div className={cn("transition-transform", overviewOpen && "rotate-180")}>
                <ChevronDownIcon />
              </div>
            </button>
            {overviewOpen && (
              <div className="border-t border-foreground/[0.06] px-3 py-3">
                <p className="font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text">
                  {submission.overviewText}
                </p>
              </div>
            )}
          </div>

          <CheckSection
            icon={<FileTextIcon />}
            title="Content"
            passed={submission.contentChecks.filter((c) => c.passed).length}
            total={submission.contentChecks.length}
            checks={submission.contentChecks}
          />

          <CheckSection
            icon={<VideoClipIcon />}
            title="Visual"
            passed={submission.visualChecks.filter((c) => c.passed).length}
            total={submission.visualChecks.length}
            checks={submission.visualChecks}
          />
        </div>

        <div
          className="pointer-events-none sticky inset-x-0 bottom-0 z-10 -mt-[40px] h-[40px] transition-opacity duration-200"
          style={{
            background: "linear-gradient(0deg, var(--card-bg) 60%, transparent 100%)",
            opacity: canScroll && !atBottom ? 1 : 0,
          }}
        />
      </div>

      <div className="flex gap-2 p-3">
        <button
          onClick={() => onAction?.("reject")}
          className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(251,113,133,0.08)] transition-colors hover:bg-[rgba(251,113,133,0.12)] dark:bg-[rgba(251,113,133,0.12)] dark:hover:bg-[rgba(251,113,133,0.18)]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM5.64645 5.64645C5.84171 5.45118 6.15829 5.45118 6.35355 5.64645L8 7.29289L9.64645 5.64645C9.84171 5.45118 10.1583 5.45118 10.3536 5.64645C10.5488 5.84171 10.5488 6.15829 10.3536 6.35355L8.70711 8L10.3536 9.64645C10.5488 9.84171 10.5488 10.1583 10.3536 10.3536C10.1583 10.5488 9.84171 10.5488 9.64645 10.3536L8 8.70711L6.35355 10.3536C6.15829 10.5488 5.84171 10.5488 5.64645 10.3536C5.45118 10.1583 5.45118 9.84171 5.64645 9.64645L7.29289 8L5.64645 6.35355C5.45118 6.15829 5.45118 5.84171 5.64645 5.64645Z" fill="#FB7185"/></svg>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FB7185]">Reject</span>
        </button>
        <button
          onClick={() => onAction?.("approve")}
          className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.1]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" className="fill-foreground"/><path d="M5 8L7 10L11 6" className="stroke-white dark:stroke-black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">Approve</span>
        </button>
      </div>
    </div>
  );
}
