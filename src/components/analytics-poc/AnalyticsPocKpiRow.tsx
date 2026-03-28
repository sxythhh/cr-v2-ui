"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { AnalyticsPocKpiRowProps } from "./types";

function DotIndicator({ total, active, onDotClick }: { total: number; active: number; onDotClick?: (i: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 sm:hidden">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onDotClick?.(i)}
          className={cn(
            "size-1.5 cursor-pointer rounded-full transition-colors duration-200",
            i === active ? "bg-foreground" : "bg-foreground/[0.06]",
          )}
        />
      ))}
    </div>
  );
}

export function AnalyticsPocKpiRow({
  children,
  className,
}: AnalyticsPocKpiRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const childArray = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const childWidth = (el.children[0] as HTMLElement).clientWidth;
    if (childWidth === 0) return;
    const index = Math.round(el.scrollLeft / (childWidth + 8));
    setActiveIndex(Math.min(index, childArray.length - 1));
  }, [childArray.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Mobile: horizontal snap scroll */}
      <div className="-mx-4 flex flex-col items-center gap-2 sm:-mx-5 sm:hidden">
        <div
          ref={scrollRef}
          className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 scrollbar-hide sm:pl-5 [scroll-padding-inline:16px]"
        >
          {childArray.map((child, i) => (
            <div key={i} className={cn(
              "w-[calc(100vw-56px)] max-w-80 shrink-0",
              "snap-start snap-always",
              i === childArray.length - 1 && "mr-4 sm:mr-5",
            )}>
              {child}
            </div>
          ))}
        </div>
        <DotIndicator total={childArray.length} active={activeIndex} onDotClick={(i) => {
          const child = scrollRef.current?.children[i] as HTMLElement | undefined;
          child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }} />
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </div>
  );
}
