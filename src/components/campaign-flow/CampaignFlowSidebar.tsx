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
            className="pointer-events-none absolute rounded-xl bg-foreground/[0.04]"
            initial={{ opacity: 0, ...activeRect }}
            animate={{ opacity: 1, ...activeRect }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
          />
        )}
      </AnimatePresence>
      {steps.map((step, i) => {
        const isActive = i === currentIndex;
        const isClickable = i <= currentIndex;
        return (
          <button
            key={step}
            ref={(el) => registerItem(i, el)}
            onClick={() => isClickable && onStepClick(i)}
            disabled={!isClickable}
            className={cn(
              "relative z-10 flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-colors",
              isActive && "bg-[rgba(37,37,37,0.04)] dark:bg-[rgba(255,255,255,0.06)]",
              !isClickable && "cursor-default opacity-100"
            )}
            type="button"
          >
            <span className={cn(
              "flex items-center justify-center w-4 h-4 rounded-full text-xs font-medium tracking-[-0.02em]",
              isActive
                ? "text-page-text"
                : "text-page-text-muted"
            )}>
              {i + 1}
            </span>
            <span className={cn(
              "text-sm font-medium tracking-[-0.02em]",
              isActive
                ? "text-page-text"
                : "text-page-text-subtle"
            )}>
              {stepLabels[step]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
