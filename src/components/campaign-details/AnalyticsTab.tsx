"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const muted = "text-page-text-muted";
const cardClass = "flex flex-col justify-center rounded-2xl border border-border bg-white p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.02)]";

const STATS = [
  {
    value: "95%",
    highlight: "1,936 filled",
    highlightColor: "#00994D",
    label: "Fill rate",
    secondary: "3,000 total",
  },
  {
    value: "36.9%",
    highlight: "2,620 approved",
    highlightColor: "#00994D",
    label: "Approval rate",
    secondary: "14,733 total",
  },
  {
    value: "94%",
    highlight: "142 churned",
    highlightColor: "#FF3355",
    label: "Creator retention",
    secondary: "1,936 total",
  },
];

export default function AnalyticsTab() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://cr.link/flooz-ai-q1");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-5">
      <div className="flex items-center gap-2">
        {/* Stat cards */}
        {STATS.map((s) => (
          <div key={s.label} className={cn(cardClass, "h-16 flex-1 gap-2")}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                {s.value}
              </span>
              <span
                className="text-[12px] font-medium tracking-[-0.02em]"
                style={{ color: s.highlightColor }}
              >
                {s.highlight}
              </span>
            </div>
            <div className="flex items-center justify-between gap-1.5">
              <span className={cn("text-[12px]", muted)}>{s.label}</span>
              <span className={cn("text-[12px] font-medium", muted)}>{s.secondary}</span>
            </div>
          </div>
        ))}

        {/* Tracking link card */}
        <div className={cn("flex h-16 w-[320px] shrink-0 items-center justify-between rounded-2xl border border-border bg-white p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.02)]")}>
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
              Tracking link
            </span>
            <span className={cn("text-[12px]", muted)}>
              https://cr.link/flooz-ai-q1
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-medium tracking-[-0.02em] transition-all",
              copied
                ? "bg-[#00994D] text-white"
                : "bg-[#252525] text-white hover:bg-[#333] dark:bg-[#e5e5e5] dark:text-[#1a1a1a] dark:hover:bg-[#d5d5d5]",
            )}
          >
            <span className="inline-grid">
              <span className="invisible col-start-1 row-start-1">Copy Link</span>
              <span className="col-start-1 row-start-1 text-center">{copied ? "Copied!" : "Copy Link"}</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
              {copied ? (
                <path d="M3.33 8L6.67 11.33 12.67 4.67" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M10.667 3.33333H12.0003C12.7367 3.33333 13.3337 3.93029 13.3337 4.66667V12.6667C13.3337 13.403 12.7367 14 12.0003 14H4.00033C3.26395 14 2.66699 13.403 2.66699 12.6667V4.66667C2.66699 3.93029 3.26395 3.33333 4.00033 3.33333H5.33366M10.667 3.33333V4.66667H5.33366V3.33333M10.667 3.33333C10.667 2.59695 10.07 2 9.33366 2H6.66699C5.93061 2 5.33366 2.59695 5.33366 3.33333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
