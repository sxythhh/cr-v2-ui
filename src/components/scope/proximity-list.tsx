"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { cn } from "@/lib/utils";

type ProximityListProps = {
  itemCount: number;
  children: (registerItem: (index: number, el: HTMLElement | null) => void) => ReactNode;
  className?: string;
  radius?: string;
  overlayClassName?: string;
};

/**
 * Proximity-hover container. Pass a render function that receives `registerItem(index, el)`
 * and attaches it to each row's ref. An accent overlay follows the cursor over the rows.
 */
export function ProximityList({
  itemCount,
  children,
  className,
  radius = "rounded-xl",
  overlayClassName,
}: ProximityListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hover = useProximityHover(ref);
  const activeRect = hover.activeIndex !== null ? hover.itemRects[hover.activeIndex] : null;

  useEffect(() => {
    hover.measureItems();
  }, [hover.measureItems, itemCount]);

  return (
    <div
      ref={ref}
      onMouseMove={hover.handlers.onMouseMove}
      onMouseEnter={hover.handlers.onMouseEnter}
      onMouseLeave={hover.handlers.onMouseLeave}
      className={cn("relative", className)}
    >
      {activeRect && (
        <motion.div
          className={cn("pointer-events-none absolute z-0 bg-foreground/[0.04]", radius, overlayClassName)}
          initial={false}
          animate={{
            top: activeRect.top,
            left: activeRect.left,
            width: activeRect.width,
            height: activeRect.height,
            opacity: 1,
          }}
          transition={springs.moderate}
        />
      )}
      {children(hover.registerItem)}
    </div>
  );
}
