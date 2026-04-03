"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

const RULES = [
  {
    title: "Auto-approve trusted creators",
    desc: "Bot score < 20% and 3+ approved submissions",
    stat: "34 approved this week",
    defaultOn: true,
  },
  {
    title: "Auto-reject high bot score",
    desc: "Bot score > 80% automatically rejected",
    stat: "7 rejected this week",
    defaultOn: true,
  },
  {
    title: "Flag short videos",
    desc: "Videos under 15 seconds flagged for review",
    stat: "12 flagged this week",
    defaultOn: true,
  },
  {
    title: "Require hashtags",
    desc: "Must contain required campaign hashtags",
    defaultOn: false,
  },
  {
    title: "Min engagement rate",
    desc: "Reject if engagement below 1% on 10K+ views",
    defaultOn: false,
  },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 backdrop-blur-[6px] transition-colors",
        on ? "bg-[#252525] dark:bg-white" : "bg-foreground/20 dark:bg-white/20"
      )}
    >
      <div
        className={cn(
          "size-4 rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-transform dark:bg-[#252525]",
          on ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export function RulesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [rules, setRules] = useState(() =>
    RULES.map((r) => ({ ...r, on: r.defaultOn }))
  );

  const toggleRule = (idx: number) => {
    setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, on: !r.on } : r)));
  };

  const activeCount = rules.filter((r) => r.on).length;

  return (
    <Modal open={open} onClose={onClose} size="md" showClose={false}>
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-6 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4.667 4.667l6.666 6.666M11.333 4.667l-6.666 6.666" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.52" strokeLinecap="round" />
        </svg>
      </button>

      {/* Body */}
      <div className="flex flex-col items-center gap-4 overflow-y-auto p-5 scrollbar-hide">
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-14 items-center justify-center rounded-full bg-foreground/[0.03] shadow-[0_0_0_2px_#fff] dark:shadow-none">
            <svg width="24" height="24" viewBox="-1 -1 15 17" fill="none">
              <path d="M7.37884 1.00184C7.37884 0.0124272 6.09561 -0.37609 5.54679 0.447142L0.169631 8.51288C-0.273405 9.17744 0.202986 10.0676 1.00168 10.0676H4.71217V13.8C4.71217 14.7894 5.9954 15.1779 6.54423 14.3547L11.9214 6.28895C12.3644 5.6244 11.888 4.73425 11.0893 4.73425H7.37884V1.00184Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            <div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.2) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-medium tracking-[-0.02em] text-page-text">Automation rules</span>
            <span className="text-sm font-medium tracking-[-0.02em] text-foreground/70">
              {activeCount} rules active — automating 46% of reviews
            </span>
          </div>
        </div>

        {/* Rules list */}
        <div className="flex w-full flex-col gap-2">
          {rules.map((rule, idx) => {
            const isActive = rule.on;
            return (
              <div
                key={idx}
                onClick={() => toggleRule(idx)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-2xl border px-4 py-3 transition-all",
                  isActive
                    ? "border-[rgba(229,113,0,0.3)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(251,146,60,0.3)] dark:bg-card-bg"
                    : "border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg"
                )}
                style={
                  isActive
                    ? { backgroundImage: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.12) 0%, rgba(255,144,37,0) 50%)" }
                    : undefined
                }
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{rule.title}</span>
                    {rule.stat && isActive && (
                      <span className="text-xs font-medium tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">{rule.stat}</span>
                    )}
                  </div>
                  <span className="text-xs tracking-[-0.02em] text-foreground/50">{rule.desc}</span>
                </div>
                <Toggle on={isActive} onToggle={() => toggleRule(idx)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer — stacked on mobile, row on desktop */}
      <div className="flex shrink-0 flex-col gap-2 px-5 pb-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground/[0.06] py-2.5 pl-3.5 pr-4 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] sm:w-auto dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.333v9.334M3.333 8h9.334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add rule
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-foreground/[0.06] px-4 py-2.5 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] sm:flex-none dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-page-text px-4 py-2.5 text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-page-text/90 sm:flex-none dark:bg-white dark:text-[#252525] dark:hover:bg-white/90"
          >
            Save changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
