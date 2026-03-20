"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const SEGMENTS = [
  { label: "Paid out", amount: "$10,873", pct: 60, color: "#00994D", dotColor: "#00994D" },
  { label: "Pending", amount: "$377", pct: 5, color: "#E57100", dotColor: "#E57100" },
  { label: "Clawed back", amount: "$370.40", pct: 2.5, color: "#FF3355", dotColor: "#FF3355" },
  { label: "Remaining", amount: "$3,750", pct: 32.5, color: "var(--budget-remaining)", dotColor: "#999999" },
];

export function BudgetBar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tooltipSeg = hoveredIndex !== null ? SEGMENTS[hoveredIndex] : null;
  const tooltipLeft = hoveredIndex !== null
    ? SEGMENTS.slice(0, hoveredIndex).reduce((s, x) => s + x.pct, 0) + SEGMENTS[hoveredIndex].pct / 2
    : 0;

  return (
    <div className="relative w-full">
      {/* CSS var for remaining segment color */}
      <style>{`:root { --budget-remaining: rgba(37,37,37,0.1); } .dark { --budget-remaining: rgba(255,255,255,0.12); }`}</style>

      {/* Floating tooltip */}
      <AnimatePresence>
        {tooltipSeg && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.1 }}
            className="absolute -top-[38px] z-10 pointer-events-none"
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
      <div className="flex h-10 overflow-hidden rounded-xl">
        {SEGMENTS.map((seg, i) => (
          <motion.div
            key={seg.label}
            className="cursor-pointer h-full"
            style={{
              width: `${seg.pct}%`,
              backgroundColor: seg.color,
              borderRight: i < SEGMENTS.length - 1 ? "1px solid var(--budget-bar-divider)" : undefined,
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
      <style>{`:root { --budget-bar-divider: #FFFFFF; } .dark { --budget-bar-divider: #1a1a1a; }`}</style>

      {/* Label below */}
      <div className="mt-2 h-5">
        <AnimatePresence mode="wait">
          {hoveredIndex !== null ? (
            <motion.div
              key={hoveredIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-1.5 text-[12px] tracking-[-0.02em]"
            >
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: SEGMENTS[hoveredIndex].dotColor }} />
              <span className="text-page-text-muted">{SEGMENTS[hoveredIndex].label}</span>
              <span className="font-medium text-page-text">{SEGMENTS[hoveredIndex].amount}</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[12px] tracking-[-0.02em] text-page-text-muted"
            >
              $3,750 remaining
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
