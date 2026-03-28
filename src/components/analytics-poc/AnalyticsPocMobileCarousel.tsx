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
  onDotClick,
}: {
  total: number;
  active: number;
  onDotClick?: (i: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onDotClick?.(i)}
          className={cn(
            "size-1.5 cursor-pointer rounded-full transition-colors duration-200",
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
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        ref={scrollRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide [scroll-padding-inline:16px]"
        style={{ gap }}
      >
        {items.map((child, i) => (
          <div key={i} className={cn(
            "w-[calc(100vw-56px)] max-w-80 shrink-0",
            i === 0 ? "snap-start ml-4 sm:ml-5" : "snap-start",
            i === items.length - 1 && "mr-4 sm:mr-5",
          )}>
            {child}
          </div>
        ))}
      </div>
      {showDots && <DotIndicator total={items.length} active={activeIndex} onDotClick={(i) => {
        const child = scrollRef.current?.children[i] as HTMLElement | undefined;
        child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }} />}
    </div>
  );
}
