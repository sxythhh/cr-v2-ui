"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { AnalyticsPocMediumCardsRowProps } from "./types";

function DotIndicator({ total, active }: { total: number; active: number }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 md:hidden">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "size-1.5 rounded-full transition-colors duration-200",
            i === active ? "bg-foreground" : "bg-foreground/[0.06]",
          )}
        />
      ))}
    </div>
  );
}

export function AnalyticsPocMediumCardsRow({
  left,
  right,
  className,
}: AnalyticsPocMediumCardsRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).clientWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Mobile: horizontal snap scroll */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto scrollbar-hide md:hidden"
      >
        <div className="w-full shrink-0 snap-center">{left}</div>
        <div className="w-full shrink-0 snap-center">{right}</div>
      </div>
      <DotIndicator total={2} active={activeIndex} />

      {/* Desktop: grid layout */}
      <div className="hidden gap-2 md:grid md:grid-cols-2">
        {left}
        {right}
      </div>
    </div>
  );
}
