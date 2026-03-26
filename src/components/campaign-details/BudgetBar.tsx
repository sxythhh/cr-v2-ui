"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const SEGMENTS = [
  { label: "Paid out", amount: "$10,873", pct: 60, color: "var(--bar-green)", dotColor: "var(--dot-green)" },
  { label: "Pending", amount: "$377", pct: 5, color: "var(--bar-orange)", dotColor: "var(--dot-orange)" },
  { label: "Clawed back", amount: "$370.40", pct: 2.5, color: "var(--bar-red)", dotColor: "var(--dot-red)" },
  { label: "Remaining", amount: "$3,750", pct: 32.5, color: "var(--bar-remaining)", dotColor: "#999999" },
];

export function BudgetBar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tooltipSeg = hoveredIndex !== null ? SEGMENTS[hoveredIndex] : null;
  const tooltipLeft = hoveredIndex !== null
    ? SEGMENTS.slice(0, hoveredIndex).reduce((s, x) => s + x.pct, 0) + SEGMENTS[hoveredIndex].pct / 2
    : 0;

  return (
    <div className="relative w-full [--bar-green:rgba(0,153,77,0.6)] [--bar-orange:rgba(229,113,0,0.6)] [--bar-red:rgba(255,51,85,0.6)] [--bar-remaining:rgba(37,37,37,0.06)] [--dot-green:#00994D] [--dot-orange:#E57100] [--dot-red:#FF3355] dark:[--bar-green:rgba(52,211,153,0.6)] dark:[--bar-orange:rgba(251,146,60,0.6)] dark:[--bar-red:rgba(251,113,133,0.6)] dark:[--bar-remaining:rgba(224,224,224,0.03)] dark:[--dot-green:#34D399] dark:[--dot-orange:#FB923C] dark:[--dot-red:#FB7185]">
      {/* Floating tooltip */}
      <AnimatePresence>
        {tooltipSeg && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.1 }}
            className="absolute -top-[38px] z-10 pointer-events-none flex justify-center"
            style={{ left: `${tooltipLeft}%`, transform: "translateX(-50%)" }}
          >
            <div className="rounded-lg bg-tooltip-bg px-2.5 py-1.5 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: tooltipSeg.dotColor }} />
                <span className="text-[11px] tracking-[-0.02em] text-tooltip-text-muted whitespace-nowrap">
                  {tooltipSeg.label}
                </span>
                <span className="text-[12px] font-medium tracking-[-0.02em] text-tooltip-text whitespace-nowrap">
                  {tooltipSeg.amount}
                </span>
                <span className="text-[10px] tracking-[-0.02em] text-tooltip-text-muted">
                  {tooltipSeg.pct}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bar */}
      <div className="flex h-10 gap-px overflow-hidden rounded-xl bg-white dark:bg-[rgba(224,224,224,0.03)]">
        {SEGMENTS.map((seg, i) => (
          <motion.div
            key={seg.label}
            className="cursor-pointer h-full"
            style={{
              flexGrow: i === 0 ? 1 : 0,
              flexShrink: 0,
              width: i === 0 ? undefined : `${seg.pct}%`,
              backgroundColor: seg.color,
            }}
            animate={{
              opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.4 : 1,
            }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>
      {/* Legend pills */}
      <div className="mt-3 flex flex-wrap items-center gap-1">
        {SEGMENTS.filter(s => s.label !== "Remaining").map((seg) => (
          <span
            key={seg.label}
            className="inline-flex h-6 items-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
          >
            <span className="flex items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: seg.dotColor }} />
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{seg.label}</span>
            </span>
            <span className="ml-1 font-inter text-xs font-medium tracking-[-0.02em]" style={{ color: seg.dotColor }}>{seg.amount}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
