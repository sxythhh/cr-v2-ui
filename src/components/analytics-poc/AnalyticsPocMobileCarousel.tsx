"use client";

import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnalyticsPocMobileCarouselProps {
  children: ReactNode[];
  className?: string;
  showDots?: boolean;
  /** Gap between items in px */
  gap?: number;
}

function DotIndicator({
  total,
  active,
}: {
  total: number;
  active: number;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "size-1.5 rounded-full transition-colors duration-200",
            i === active
              ? "bg-foreground"
              : "bg-foreground/[0.10]",
          )}
        />
      ))}
    </div>
  );
}

export function AnalyticsPocMobileCarousel({
  children,
  className,
  showDots = true,
  gap = 8,
}: AnalyticsPocMobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = children.filter(Boolean);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const childWidth = el.children[0]?.clientWidth ?? 0;
    if (childWidth === 0) return;
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(Math.min(index, items.length - 1));
  }, [gap, items.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className={cn("-mx-4 flex flex-col items-center gap-2 sm:-mx-5", className)}>
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto px-4 scrollbar-hide sm:px-5"
        style={{ gap }}
      >
        {items.map((child, i) => (
          <div key={i} className="w-80 shrink-0 snap-start">
            {child}
          </div>
        ))}
      </div>
      {showDots && <DotIndicator total={items.length} active={activeIndex} />}
    </div>
  );
}
