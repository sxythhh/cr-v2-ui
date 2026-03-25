"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import type { CampaignFlowStep } from "@/types/campaign-flow.types";

interface CampaignFlowSidebarProps {
  steps: CampaignFlowStep[];
  stepLabels: Record<CampaignFlowStep, string>;
  currentIndex: number;
  onStepClick: (index: number) => void;
}

export function CampaignFlowSidebar({ steps, stepLabels, currentIndex, onStepClick }: CampaignFlowSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(containerRef);

  useEffect(() => { measureItems(); }, [measureItems, steps.length]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col p-1 gap-1 w-[186px] bg-card-bg border border-border shadow-[0px_1px_2px_rgba(0,0,0,0.03)] rounded-2xl"
      onMouseEnter={handlers.onMouseEnter}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={handlers.onMouseLeave}
    >
      <AnimatePresence>
        {activeRect && (
          <motion.div
            key={sessionRef.current}
            className="pointer-events-none absolute rounded-xl bg-foreground/[0.025] dark:bg-foreground/[0.03]"
            initial={{ opacity: 0, ...activeRect }}
            animate={{ opacity: 1, ...activeRect }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
          />
        )}
      </AnimatePresence>
      {steps.map((step, i) => {
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;
        const isClickable = i <= currentIndex;
        return (
          <button
            key={step}
            ref={(el) => registerItem(i, el)}
            onClick={() => isClickable && onStepClick(i)}
            disabled={!isClickable}
            className={cn(
              "relative z-10 flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-colors",
              isActive && "bg-foreground/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-[#222222] dark:shadow-[0_2px_4px_rgba(0,0,0,0.06)]",
              !isClickable && "cursor-default opacity-100"
            )}
            type="button"
          >
            {isCompleted ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="size-4 shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.66667 0C2.98477 0 0 2.98477 0 6.66667C0 10.3486 2.98477 13.3333 6.66667 13.3333C10.3486 13.3333 13.3333 10.3486 13.3333 6.66667C13.3333 2.98477 10.3486 0 6.66667 0ZM9.05365 5.31662C9.22851 5.1029 9.19701 4.78789 8.98329 4.61302C8.76956 4.43816 8.45455 4.46966 8.27969 4.68338L5.62955 7.92244L4.68689 6.97978C4.49162 6.78452 4.17504 6.78452 3.97978 6.97978C3.78452 7.17504 3.78452 7.49162 3.97978 7.68689L5.31311 9.02022C5.413 9.12011 5.55048 9.17308 5.69157 9.16605C5.83266 9.15901 5.96419 9.09262 6.05365 8.98329L9.05365 5.31662Z" fill="#34D399" />
              </svg>
            ) : (
              <span className={cn(
                "flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium tracking-[-0.02em]",
                isActive ? "text-page-text" : "text-page-text-muted"
              )}>
                {i + 1}
              </span>
            )}
            <span className={cn(
              "text-sm font-medium tracking-[-0.02em]",
              isCompleted ? "text-page-text-muted" : isActive ? "text-page-text" : "text-page-text-subtle"
            )}>
              {stepLabels[step]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
