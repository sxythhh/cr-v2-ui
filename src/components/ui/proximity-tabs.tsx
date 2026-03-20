"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

interface ProximityTabsProps {
  tabs: { label: string; count?: number }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function ProximityTabs({ tabs, selectedIndex, onSelect, className }: ProximityTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseInside = useRef(false);

  const {
    activeIndex: hoveredIndex,
    itemRects: tabRects,
    handlers,
    registerItem: registerTab,
    measureItems: measureTabs,
  } = useProximityHover(containerRef, { axis: "x" });

  useEffect(() => {
    measureTabs();
  }, [measureTabs]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      isMouseInside.current = true;
      handlers.onMouseMove(e);
    },
    [handlers],
  );

  const handleMouseLeave = useCallback(() => {
    isMouseInside.current = false;
    handlers.onMouseLeave();
  }, [handlers]);

  const selectedRect = tabRects[selectedIndex];
  const hoverRect = hoveredIndex !== null ? tabRects[hoveredIndex] : null;
  const isHoveringSelected = hoveredIndex === selectedIndex;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex h-14 items-stretch", className)}
    >
      {/* Selected underline */}
      {selectedRect && (
        <motion.div
          className="pointer-events-none absolute bottom-0 h-px bg-page-text"
          initial={false}
          animate={{
            left: selectedRect.left,
            width: selectedRect.width,
          }}
          transition={springs.moderate}
        />
      )}

      {/* Hover highlight */}
      <AnimatePresence>
        {hoverRect && !isHoveringSelected && (
          <motion.div
            className="pointer-events-none absolute bottom-0 h-8 rounded-lg bg-foreground/[0.04]"
            initial={{
              left: selectedRect?.left ?? hoverRect.left,
              width: selectedRect?.width ?? hoverRect.width,
              opacity: 0,
            }}
            animate={{
              left: hoverRect.left,
              width: hoverRect.width,
              opacity: 1,
            }}
            exit={
              !isMouseInside.current && selectedRect
                ? {
                    left: selectedRect.left,
                    width: selectedRect.width,
                    opacity: 0,
                    transition: {
                      ...springs.moderate,
                      opacity: { duration: 0.12 },
                    },
                  }
                : { opacity: 0, transition: { duration: 0.12 } }
            }
            transition={{
              ...springs.moderate,
              opacity: { duration: 0.16 },
            }}
            style={{ bottom: 12 }}
          />
        )}
      </AnimatePresence>

      {tabs.map((tab, i) => {
        const isSelected = selectedIndex === i;
        const isHovered = hoveredIndex === i;
        return (
          <button
            key={tab.label}
            data-proximity-index={i}
            ref={(el) => {
              registerTab(i, el);
            }}
            onClick={() => onSelect(i)}
            className={cn(
              "relative z-10 flex cursor-pointer items-center justify-center gap-1.5 px-5 font-inter text-sm tracking-[-0.02em] font-medium transition-colors",
              isSelected || isHovered
                ? "text-page-text"
                : "text-page-text/50",
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="font-normal text-page-text/40">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
