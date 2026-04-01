"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DotMenuIcon } from "./icons";

export function DotMenuPopover({ aiSummaryHidden, onToggleAiSummary }: { aiSummaryHidden: boolean; onToggleAiSummary: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        className="flex cursor-pointer items-center justify-center rounded-md p-1 hover:bg-foreground/[0.04]"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        type="button"
      >
        <DotMenuIcon />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: "spring", duration: 0.2, bounce: 0 }}
            className="absolute right-0 top-full z-50 mt-1 w-[256px] rounded-xl border border-foreground/[0.06] bg-card-bg p-1 shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
          >
            <button className="flex w-full cursor-pointer items-center rounded-lg px-[10px] py-2 font-inter text-sm tracking-[-0.02em] text-page-text hover:bg-foreground/[0.04]" onClick={() => setOpen(false)} type="button">
              View profile
            </button>
            <button className="flex w-full cursor-pointer items-center rounded-lg px-[10px] py-2 font-inter text-sm tracking-[-0.02em] text-page-text hover:bg-foreground/[0.04]" onClick={() => { onToggleAiSummary(); setOpen(false); }} type="button">
              {aiSummaryHidden ? "Show AI summary" : "Hide AI summary"}
            </button>
            <button className="flex w-full cursor-pointer items-center rounded-lg px-[10px] py-2 font-inter text-sm tracking-[-0.02em] text-page-text hover:bg-foreground/[0.04]" onClick={() => setOpen(false)} type="button">
              Flag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
