"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";

const trustPerks = [
  { title: "10% CPM bonus", desc: "Applied to all active campaigns automatically" },
  { title: "Priority review queue", desc: "Your clips are reviewed in 12h, vs 48h standard." },
  { title: "Featured in Discovery", desc: "Brands see you first when browsing creators." },
];

const scoreHistory = [
  { month: "Oct", height: 32, opacity: 0.2 },
  { month: "Nov", height: 72, opacity: 0.4 },
  { month: "Dec", height: 56, opacity: 0.3 },
  { month: "Jan", height: 80, opacity: 0.6 },
  { month: "Feb", height: 96, opacity: 0.8 },
  { month: "Mar", height: 116, opacity: 1 },
];

export function TrustScoreModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[520px]">
      {/* Header */}
      <div className="flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Trust score</span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center gap-6 px-5 pb-5 pt-6">
        {/* Score ring */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex size-[74px] items-center justify-center">
            <svg width="74" height="74" viewBox="0 0 74 74" className="absolute inset-0">
              <circle cx="37" cy="37" r="35" fill="none" stroke="rgba(0,153,77,0.2)" strokeWidth="4" className="dark:hidden" />
              <circle cx="37" cy="37" r="35" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="4" className="hidden dark:block" />
              <circle
                cx="37"
                cy="37"
                r="35"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${0.92 * 2 * Math.PI * 35} ${2 * Math.PI * 35}`}
                transform="rotate(-90 37 37)"
                className="stroke-[#00994D] dark:stroke-[#34D399]"
              />
            </svg>
            <span className="text-[28px] font-medium tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">92</span>
          </div>
          {/* "Excellent" label */}
          <span className="text-sm font-medium tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">Excellent</span>
        </div>

        {/* Your perks card */}
        <div className="w-full rounded-2xl border border-border bg-white py-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
          <div className="px-4 pb-4">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Your perks</span>
          </div>
          <div className="flex flex-col gap-3 px-4">
            {trustPerks.map((perk, i) => (
              <div key={perk.title}>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] bg-white shadow-[0_0_0_1.8px_#fff] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.33 8L6.67 11.33 12.67 5.33" stroke="#00994D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-[#34D399]" />
                    </svg>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{perk.title}</span>
                    <span className="text-xs leading-[150%] tracking-[-0.02em] text-foreground/50">{perk.desc}</span>
                  </div>
                </div>
                {i < trustPerks.length - 1 && (
                  <div className="mt-3 pl-12"><div className="h-px w-full bg-foreground/[0.06] dark:bg-[rgba(224,224,224,0.03)]" /></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Score history card */}
        <div className="w-full rounded-2xl border border-border bg-white py-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
          <div className="flex items-center justify-between px-4 pb-4">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Score history</span>
            <span className="text-xs font-medium tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">+30 points in the last 6 months</span>
          </div>
          <div className="flex items-end gap-10 px-4">
            <div className="flex flex-1 items-end gap-10">
              {scoreHistory.map((bar) => (
                <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-2xl border-x border-t border-white dark:border-[rgba(224,224,224,0.03)]"
                    style={{
                      height: bar.height,
                      background: isDark
                        ? (bar.opacity === 1 ? "#34D399" : `rgba(52,211,153,${bar.opacity})`)
                        : (bar.opacity === 1 ? "#00994D" : `rgba(0,153,77,${bar.opacity})`),
                    }}
                  />
                  <span className="text-[10px] leading-[120%] text-foreground/40">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={onClose}
          className="flex h-10 w-full items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]"
        >
          Got it
        </button>
      </div>
    </Modal>
  );
}
