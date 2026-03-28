"use client";

import { useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconX, IconBolt } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ── Data ─────────────────────────────────────────────────────────────

const DURATIONS = [
  { id: "3", label: "3 days", price: 49 },
  { id: "7", label: "7 days", price: 99, popular: true },
  { id: "14", label: "14 days", price: 179 },
] as const;

const BOOST_STATS = [
  { value: "5-8x", description: "More creator impressions" },
  { value: "#1", description: "Position on Discover page" },
  { value: "3-4x", description: "More applications" },
  { value: "Featured", description: "Badge on campaign card" },
];

// ── Component ────────────────────────────────────────────────────────

interface BoostCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string;
}

export function BoostCampaignModal({
  open,
  onOpenChange,
  campaignName,
}: BoostCampaignModalProps) {
  const [selectedDuration, setSelectedDuration] = useState("7");
  const [success, setSuccess] = useState(false);

  const selected = DURATIONS.find((d) => d.id === selectedDuration)!;
  const durationLabel = `${selected.id}-day boost`;

  const handleOpenChange = (next: boolean) => {
    if (!next) setSuccess(false);
    onOpenChange(next);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 bg-neutral-100/50 backdrop-blur-md dark:bg-black/60"
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 flex-col",
            "rounded-[20px] border border-border",
            "bg-white dark:bg-page-bg shadow-xl",
            "max-h-[90dvh] tracking-[-0.02em]",
          )}
        >
        {!success && (
        <>
          {/* ── Top bar ─────────────────────────────────────────── */}
          <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-border">
            <span className="text-[14px] font-medium text-page-text">
              Boost Campaign
            </span>
            <DialogPrimitive.Close
              className="absolute right-3 top-1/2 -translate-y-1/2 flex size-7 cursor-pointer items-center justify-center rounded-full text-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.06)] hover:text-[#252525] dark:text-[rgba(255,255,255,0.45)] dark:hover:bg-[rgba(255,255,255,0.06)] dark:hover:text-[#e5e5e5]"
            >
              <IconX size={14} stroke={2} />
            </DialogPrimitive.Close>
          </div>

          {/* ── Subtitle ────────────────────────────────────────── */}
          <p className="px-4 pt-4 text-center text-[13px] text-[rgba(37,37,37,0.7)] sm:px-5 dark:text-[rgba(255,255,255,0.6)]">
            Show your campaign at the top of the Discover page
          </p>

          {/* ── Scrollable content ──────────────────────────────── */}
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-hide px-4 pb-5 pt-4 sm:px-5">
            {/* Select boost duration */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] text-page-text-muted">
                Select boost duration
              </span>
              <div className="flex flex-col gap-2 sm:flex-row">
                {DURATIONS.map((d) => {
                  const isSelected = selectedDuration === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDuration(d.id)}
                      className={cn(
                        "flex flex-1 cursor-pointer items-start justify-between rounded-2xl border p-3 transition-colors",
                        isSelected
                          ? "border-[rgba(139,92,246,0.3)] bg-[radial-gradient(50%_50%_at_50%_100%,rgba(139,92,246,0.12)_0%,rgba(139,92,246,0)_50%),#FFFFFF] dark:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(139,92,246,0.12)_0%,rgba(139,92,246,0)_50%),#1a1a1a]"
                          : "border-[rgba(37,37,37,0.06)] bg-white hover:border-[rgba(37,37,37,0.12)] dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg dark:hover:border-[rgba(255,255,255,0.12)]",
                      )}
                    >
                      {/* Left: label + price */}
                      <div className="flex flex-col gap-2">
                        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                          {d.label}
                        </span>
                        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                          ${d.price}
                        </span>
                      </div>

                      {/* Right: radio + popular */}
                      <div className="flex flex-col items-end gap-2">
                        <div
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full",
                            isSelected
                              ? "bg-[#8B5CF6] shadow-[0_-0.8px_2.4px_rgba(0,0,0,0.06),0_1.6px_1.6px_#fff,inset_0_0.4px_1.6px_rgba(0,0,0,0.12)]"
                              : "border-[0.8px] border-[rgba(37,37,37,0.1)] bg-white shadow-[0_-0.8px_2.4px_rgba(0,0,0,0.06),0_1.6px_1.6px_#fff,inset_0_0.4px_1.6px_rgba(0,0,0,0.12)]",
                          )}
                        >
                          {isSelected && (
                            <div className="size-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        {"popular" in d && d.popular && (
                          <span className="font-inter text-[10px] tracking-[-0.02em] text-[#8B5CF6]">
                            Popular
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* What boosting does */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] text-page-text-muted">
                What boosting does
              </span>
              <div className="grid grid-cols-2 gap-2">
                {BOOST_STATS.map((stat) => (
                  <div
                    key={stat.value}
                    className="rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg"
                  >
                    <div className="text-[14px] font-medium text-page-text">
                      {stat.value}
                    </div>
                    <div className="text-[12px] text-page-text-muted">
                      {stat.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projected results */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-page-text-muted">
                  Projected results
                </span>
                <span className="text-[12px] text-page-text">
                  {durationLabel}
                </span>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg">
                  <div className="text-[14px] font-medium">
                    <span className="text-[#252525]/40 line-through dark:text-[#E0E0E0]/40">
                      120
                    </span>{" "}
                    <span className="text-[#8B5CF6]">780</span>
                  </div>
                  <div className="text-[12px] text-page-text-muted">
                    Daily views
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg">
                  <div className="text-[14px] font-medium text-[#8B5CF6]">
                    12-18
                  </div>
                  <div className="text-[12px] text-page-text-muted">
                    Est. new applications
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg">
                  <div className="text-[14px] font-medium text-[#8B5CF6]">
                    6-10
                  </div>
                  <div className="text-[12px] text-page-text-muted">
                    Est. new creators
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg">
                  <div className="text-[14px] font-medium text-[#8B5CF6]">
                    15-25
                  </div>
                  <div className="text-[12px] text-page-text-muted">
                    Est. new submissions
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-3 dark:border-[rgba(255,255,255,0.06)] dark:bg-card-bg">
                  <div className="text-[14px] font-medium text-[#8B5CF6]">
                    ~$6.13
                  </div>
                  <div className="text-[12px] text-page-text-muted">
                    Effective cost/creator
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[12px] leading-relaxed text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]">
                Projections based on average Discover page performance for
                similar campaigns. Actual results may vary.
              </p>
            </div>
          </div>

          {/* ── Footer ──────────────────────────────────────────── */}
          <div className="flex items-center gap-2 border-t border-foreground/[0.06] px-4 py-4 sm:justify-end sm:px-5">
            <DialogPrimitive.Close
              className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-[rgba(37,37,37,0.06)] px-4 text-[14px] font-medium text-[#252525] transition-colors hover:bg-[rgba(37,37,37,0.10)] sm:flex-none dark:bg-[rgba(255,255,255,0.06)] dark:text-[#E0E0E0] dark:hover:bg-[rgba(255,255,255,0.10)]"
            >
              Cancel
            </DialogPrimitive.Close>
            <button
              type="button"
              onClick={() => setSuccess(true)}
              className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#8B5CF6] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#7C3AED] sm:flex-none"
            >
              <BoltIcon />
              Boost for ${selected.price}
            </button>
          </div>
        </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/*  SUCCESS STATE                                            */}
        {/* ══════════════════════════════════════════════════════════ */}
        {success && (
        <>
          {/* Top bar (same) */}
          <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-border">
            <span className="text-[14px] font-medium text-page-text">
              Boost Campaign
            </span>
            <DialogPrimitive.Close
              className="absolute right-3 top-1/2 -translate-y-1/2 flex size-7 cursor-pointer items-center justify-center rounded-full text-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.06)] hover:text-[#252525] dark:text-[rgba(255,255,255,0.45)] dark:hover:bg-[rgba(255,255,255,0.06)] dark:hover:text-[#e5e5e5]"
            >
              <IconX size={14} stroke={2} />
            </DialogPrimitive.Close>
          </div>

          {/* Success content */}
          <div
            className="flex flex-col items-center px-4 pb-5 pt-[60px] gap-4 sm:px-5"
            style={{
              background: "radial-gradient(50% 53.47% at 50% 0%, rgba(139, 92, 246, 0.24) 0%, rgba(139, 92, 246, 0) 100%)",
            }}
          >
            {/* Icon + title */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-4">
                <div
                  className="relative flex size-14 items-center justify-center rounded-full bg-[#8B5CF6]"
                  style={{
                    border: "1px solid rgba(37,37,37,0.1)",
                    boxShadow: "0px 0px 0px 2px var(--page-bg, #FFFFFF), inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 1px 0px rgba(255,255,255,0.36)",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.2) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white" />
                  </svg>
                </div>
                <span className="text-xl font-medium text-[#8B5CF6]">
                  Boost successful
                </span>
              </div>

              {/* View receipt link */}
              <button className="flex items-center gap-1 text-sm font-medium text-page-text-muted">
                View receipt
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Receipt card */}
            <div className="w-full rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none">
              <div className="flex items-center justify-between border-b border-[rgba(37,37,37,0.03)] dark:border-[rgba(255,255,255,0.03)] px-4 py-3">
                <span className="text-xs font-medium text-page-text-muted">Paid amount</span>
                <span className="text-xs font-medium text-page-text">${selected.price}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-medium text-page-text-muted">Boost duration</span>
                <span className="text-xs font-medium text-page-text">{selected.label}</span>
              </div>
            </div>

            {/* Email notice */}
            <div className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M1.41311 4.14034C1.38182 4.27178 1.36428 4.40469 1.35339 4.53795C1.33299 4.78765 1.333 5.09081 1.33301 5.44222V10.5603C1.333 10.9117 1.33299 11.215 1.35339 11.4647C1.37492 11.7282 1.42247 11.9904 1.551 12.2426C1.74274 12.6189 2.04871 12.9249 2.42503 13.1166C2.67728 13.2452 2.93943 13.2927 3.20299 13.3143C3.45268 13.3347 3.75582 13.3346 4.1072 13.3346H11.892C12.2434 13.3346 12.5467 13.3347 12.7964 13.3143C13.0599 13.2927 13.3221 13.2452 13.5743 13.1166C13.9506 12.9249 14.2566 12.6189 14.4484 12.2426C14.5769 11.9904 14.6244 11.7282 14.646 11.4647C14.6664 11.2149 14.6664 10.9118 14.6663 10.5603V5.44226C14.6664 5.09083 14.6664 4.78766 14.646 4.53795C14.6351 4.40468 14.6175 4.27178 14.5862 4.14033L9.26615 8.49314C8.52942 9.09592 7.46993 9.09592 6.7332 8.49314L1.41311 4.14034Z" fill="currentColor" fillOpacity="0.5"/>
                <path d="M13.8267 3.03901C13.7468 2.9821 13.6625 2.93089 13.5743 2.88596C13.3221 2.75743 13.0599 2.70988 12.7964 2.68835C12.5467 2.66795 12.2435 2.66796 11.8921 2.66797H4.10731C3.7559 2.66796 3.4527 2.66795 3.20299 2.68835C2.93943 2.70988 2.67728 2.75743 2.42503 2.88596C2.33684 2.93089 2.25252 2.9821 2.17263 3.03901L7.57752 7.46119C7.82309 7.66212 8.17626 7.66212 8.42183 7.46119L13.8267 3.03901Z" fill="currentColor" fillOpacity="0.5"/>
              </svg>
              <span className="text-xs font-medium text-page-text-muted">
                Receipt sent to vlad@outpacestudios.com
              </span>
            </div>
          </div>

          {/* Close button */}
          <div className="px-4 pb-5 sm:px-5">
            <DialogPrimitive.Close
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-[#252525] dark:bg-[#e5e5e5] text-sm font-medium text-white dark:text-[#111111] transition-colors hover:bg-[#333] dark:hover:bg-[#d5d5d5]"
            >
              Close
            </DialogPrimitive.Close>
          </div>
        </>
        )}

        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function BoltIcon() {
  return (
    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" className="shrink-0">
      <path d="M7.37884 1.00184C7.37884 0.0124272 6.09561 -0.37609 5.54679 0.447142L0.169631 8.51288C-0.273405 9.17744 0.202986 10.0676 1.00168 10.0676H4.71217V13.8C4.71217 14.7894 5.9954 15.1779 6.54423 14.3547L11.9214 6.28895C12.3644 5.6244 11.888 4.73425 11.0893 4.73425H7.37884V1.00184Z" fill="white" />
    </svg>
  );
}
