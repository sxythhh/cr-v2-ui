"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useCampaignFlowContext } from "./CampaignFlowContext";
import { CampaignFlowSidebar } from "./CampaignFlowSidebar";

// ── Campaign Top Up Modal (with success state) ───────────────────

const QUICK_AMOUNTS = ["$1,000", "$5,000", "$10,000", "$25,000", "$50,000"];

function CampaignTopUpModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const currentBalance = 14200;
  const newBalance = currentBalance + numericAmount;

  const handleClose = () => {
    onClose();
    setTimeout(() => { setAmount(""); setSuccess(false); }, 200);
  };

  return (
    <Modal open={open} onClose={handleClose} size="sm" showClose={false}>
      {!success ? (
        <div className="flex max-h-[90vh] flex-col">
          {/* Header */}
          <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-page-border px-5">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Top up campaign</span>
            <button type="button" onClick={handleClose} className="absolute right-4 top-3 flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" /></svg>
            </button>
          </div>

          {/* Content */}
          <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <span className="text-center font-inter text-sm font-medium tracking-[-0.02em] text-page-text-subtle">
              Easily set up an agreement with a creator.
            </span>

            {/* Amount card */}
            <div className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-subtle">
                Current balance: ${currentBalance.toLocaleString()}
              </span>
              <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.03] px-3.5">
                <svg width="8" height="13" viewBox="0 0 8 13" fill="currentColor" className="text-page-text">
                  <path d="M3.40554 12.7273V0H4.22088V12.7273H3.40554ZM5.95597 3.94744C5.90294 3.4768 5.68419 3.11222 5.29972 2.85369C4.91525 2.59186 4.43134 2.46094 3.84801 2.46094C3.4304 2.46094 3.06913 2.52723 2.7642 2.6598C2.45928 2.78906 2.2223 2.96804 2.05327 3.19673C1.88755 3.42211 1.80469 3.67898 1.80469 3.96733C1.80469 4.20928 1.86103 4.41809 1.97372 4.59375C2.08973 4.76941 2.24053 4.9169 2.42614 5.03622C2.61506 5.15223 2.81723 5.25 3.03267 5.32955C3.24811 5.40578 3.45526 5.46875 3.65412 5.51847L4.64844 5.77699C4.97325 5.85653 5.30634 5.96425 5.64773 6.10014C5.98911 6.23603 6.30563 6.41501 6.5973 6.63707C6.88897 6.85914 7.12429 7.13423 7.30327 7.46236C7.48556 7.79048 7.5767 8.18324 7.5767 8.64063C7.5767 9.21733 7.42756 9.7294 7.12926 10.1768C6.83428 10.6243 6.40507 10.9773 5.84162 11.2358C5.28149 11.4943 4.60369 11.6236 3.80824 11.6236C3.04593 11.6236 2.38636 11.5026 1.82955 11.2607C1.27273 11.0187 0.836884 10.6757 0.522017 10.2315C0.20715 9.78409 0.0331439 9.25379 0 8.64063H1.54119C1.57102 9.00852 1.69034 9.31511 1.89915 9.56037C2.11127 9.80232 2.38139 9.98295 2.70952 10.1023C3.04096 10.2183 3.40388 10.2763 3.7983 10.2763C4.23248 10.2763 4.61861 10.2083 4.95668 10.0724C5.29806 9.93324 5.56652 9.741 5.76207 9.49574C5.95762 9.24716 6.0554 8.95715 6.0554 8.62571C6.0554 8.3241 5.96922 8.07718 5.79688 7.88494C5.62784 7.69271 5.39749 7.53362 5.10582 7.40767C4.81747 7.28172 4.491 7.17069 4.12642 7.07457L2.9233 6.74645C2.10795 6.52438 1.46165 6.19792 0.984375 5.76705C0.510417 5.33617 0.273438 4.7661 0.273438 4.05682C0.273438 3.47017 0.432528 2.9581 0.75071 2.5206C1.06889 2.0831 1.49976 1.74337 2.04332 1.50142C2.58688 1.25616 3.20005 1.13352 3.88281 1.13352C4.57221 1.13352 5.1804 1.2545 5.70739 1.49645C6.23769 1.7384 6.6553 2.0715 6.96023 2.49574C7.26515 2.91667 7.42424 3.40057 7.4375 3.94744H5.95597Z" />
                </svg>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text placeholder:text-foreground/40 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={cn(
                      "flex h-8 cursor-pointer items-center justify-center rounded-full border px-3 font-inter text-xs font-medium tracking-[-0.02em] transition-colors",
                      amount === val
                        ? "border-foreground bg-foreground/[0.04] text-page-text"
                        : "border-foreground/[0.08] bg-foreground/[0.03] text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="overflow-hidden rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between border-b border-foreground/[0.03] px-4 py-3">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Deposit amount</span>
                <span className="font-inter text-xs font-medium tabular-nums tracking-[-0.02em] text-[#34D399]">+${numericAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">New balance after deposit</span>
                <span className="font-inter text-xs font-medium tabular-nums tracking-[-0.02em] text-page-text">${newBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center gap-2 border-t border-page-border px-5 py-3">
            <button type="button" onClick={handleClose} className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.03] font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.06]">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => numericAmount > 0 && setSuccess(true)}
              className={cn(
                "flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-foreground font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors dark:text-page-bg",
                !numericAmount && "opacity-60 cursor-not-allowed",
              )}
              disabled={!numericAmount}
            >
              Deposit funds
            </button>
          </div>
        </div>
      ) : (
        <div className="flex max-h-[90vh] flex-col">
          {/* Header */}
          <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-page-border px-5">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Top up campaign</span>
            <button type="button" onClick={handleClose} className="absolute right-4 top-3 flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" /></svg>
            </button>
          </div>

          {/* Success content */}
          <div className="scrollbar-hide flex flex-1 flex-col items-center gap-4 overflow-y-auto px-5 pb-5 pt-10" style={{ background: "radial-gradient(50% 53.47% at 50% 0%, rgba(0,153,77,0.12) 0%, rgba(0,153,77,0) 100%)" }}>
            {/* Success icon */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex size-14 items-center justify-center rounded-full bg-[#34D399]" style={{ boxShadow: "0px 0px 0px 2px var(--page-bg, #FFFFFF), inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 1px 0px rgba(255,255,255,0.36)", border: "1px solid rgba(224,224,224,0.06)" }}>
                <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11.67" fill="white" fillOpacity="0" /><path d="M9 14L12.5 17.5L19 10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span className="font-inter text-xl font-medium tracking-[-0.02em] text-[#34D399]">Top up successful</span>
            </div>

            {/* View receipt link */}
            <button type="button" className="flex items-center gap-1 font-inter text-sm font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text">
              View receipt
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            {/* Summary card */}
            <div className="w-full overflow-hidden rounded-2xl border border-foreground/[0.03] bg-foreground/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between border-b border-foreground/[0.03] px-4 py-3">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">Deposit amount</span>
                <span className="font-inter text-xs font-medium tabular-nums tracking-[-0.02em] text-[#34D399]">+${numericAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">New balance after deposit</span>
                <span className="font-inter text-xs font-medium tabular-nums tracking-[-0.02em] text-page-text">${newBalance.toLocaleString()}</span>
              </div>
            </div>

            {/* Receipt email */}
            <div className="flex items-center gap-1.5">
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M0.080103 1.47237C0.0488083 1.60381 0.0312702 1.73672 0.0203819 1.86998C-1.96435e-05 2.11969-1.03164e-05 2.42284 4.95335e-07 2.77425V7.89236C-1.03164e-05 8.24377-1.96435e-05 8.54698 0.0203819 8.79669C0.0419159 9.06025 0.0894598 9.3224 0.217989 9.57465C0.409736 9.95097 0.715697 10.2569 1.09202 10.4487C1.34427 10.5772 1.60642 10.6248 1.86998 10.6463C2.11967 10.6667 2.42281 10.6667 2.7742 10.6667H10.559C10.9104 10.6667 11.2137 10.6667 11.4634 10.6463C11.7269 10.6248 11.9891 10.5772 12.2413 10.4487C12.6176 10.2569 12.9236 9.95097 13.1153 9.57465C13.2439 9.3224 13.2914 9.06025 13.313 8.79669C13.3334 8.54698 13.3333 8.2438 13.3333 7.89238V2.77429C13.3333 2.42286 13.3334 2.11969 13.313 1.86998C13.3021 1.73672 13.2845 1.60381 13.2532 1.47237L7.93314 5.82517C7.19641 6.42795 6.13692 6.42795 5.40019 5.82517L0.080103 1.47237Z" fill="currentColor" fillOpacity="0.5"/><path d="M12.4937 0.371039C12.4138 0.314127 12.3295 0.262922 12.2413 0.217989C11.9891 0.0894597 11.7269 0.0419157 11.4634 0.0203817C11.2136-1.99278e-05 10.9105-1.0464e-05 10.5591 5.06251e-07H2.77431C2.42289-1.0464e-05 2.11969-1.99278e-05 1.86998 0.0203817C1.60642 0.0419157 1.34427 0.0894597 1.09202 0.217989C1.00383 0.262922 0.919512 0.314128 0.839618 0.37104L6.24451 4.79322C6.49009 4.99415 6.84325 4.99415 7.08883 4.79322L12.4937 0.371039Z" fill="currentColor" fillOpacity="0.5"/></svg>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted">receipt sent to vlad@outpacestudios.com</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center border-t border-page-border px-5 py-3">
            <button
              type="button"
              onClick={() => { handleClose(); onSuccess(); }}
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-foreground font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 dark:text-page-bg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── Leave confirmation modal ───────────────────────────────────────

function LeaveModal({ open, onSave, onKeepEditing, onDiscard, onClose }: { open: boolean; onSave: () => void; onKeepEditing: () => void; onDiscard: () => void; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="sm" showClose={true}>
      {/* Header */}
      <div className="flex flex-col items-center gap-4 px-5 pt-5">
        {/* Icon */}
        <div className="relative flex size-14 items-center justify-center rounded-full bg-foreground/[0.03]"><div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
          <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
            <path d="M8.25 17H3C1.89543 17 1 16.1046 1 15L1 3C1 1.89543 1.89543 1 3 1L8.25 1M17 8.99999L5.75 8.99999M17 8.99999L12.5 13.5M17 8.99999L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-page-text" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-inter text-lg font-medium tracking-[-0.02em] text-page-text">Leave campaign setup?</span>
          <span className="max-w-[300px] text-center font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-subtle">
            You&apos;ve made a lot of progress. Save as a draft to come back and finish later.
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full flex-col gap-2 px-5 pb-5 pt-4">
        <button
          type="button"
          onClick={onSave}
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-foreground font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 active:scale-[0.98] dark:text-[#111111]"
        >
          Save as draft
        </button>
        <button
          type="button"
          onClick={onKeepEditing}
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] active:scale-[0.98]"
        >
          Keep editing
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-[rgba(251,113,133,0.08)] font-inter text-sm font-medium tracking-[-0.02em] text-[#FB7185] transition-colors hover:bg-[rgba(251,113,133,0.12)] active:scale-[0.98]"
        >
          Discard and leave
        </button>
      </div>
    </Modal>
  );
}

// ── Main layout ────────────────────────────────────────────────────

export function CampaignFlowLayout({ children }: { children: React.ReactNode }) {
  const {
    steps, stepLabels, stepIndex, canContinue, continueBlockReason, isRestoring, editMode,
    handleContinue, handleBack, handleStepClick,
    handleBackToList, handleSaveDraft, portalContainer,
  } = useCampaignFlowContext();

  const [mounted, setMounted] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const isLastStep = stepIndex === steps.length - 1;

  if (isRestoring) return <div className="h-full bg-white dark:bg-[#161616]" />;

  return (
    <div className={cn("flex h-full flex-col bg-white dark:bg-[#161616] transition-opacity duration-250", mounted ? "opacity-100" : "opacity-0")}>
      {/* Top bar */}
      <div className="flex items-center h-14 px-5 border-b border-border">
        <button
          className="flex items-center gap-2 py-3 text-sm font-medium tracking-[-0.02em] text-page-text transition-opacity hover:opacity-70"
          onClick={() => setShowLeaveModal(true)}
          type="button"
        >
          <IconArrowLeft size={16} strokeWidth={1.5} className="text-page-text" />
          <span>{editMode ? "Back to campaign" : "Back to model selection"}</span>
        </button>
      </div>

      {/* Mobile step nav */}
      <div className="flex md:hidden pl-5 pr-0 py-1">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide rounded-l-xl bg-[rgba(37,37,37,0.04)] p-0.5 pr-5 dark:bg-[rgba(224,224,224,0.03)]">
          {steps.map((step, i) => {
            const isActive = i === stepIndex;
            const isCompleted = i < stepIndex;
            const isClickable = i <= stepIndex;
            return (
              <button
                key={step}
                type="button"
                ref={(el) => {
                  if (isActive && el) {
                    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                  }
                }}
                onClick={() => isClickable && handleStepClick(i)}
                disabled={!isClickable}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[10px] px-3 py-2 font-inter text-sm font-medium tracking-[-0.02em] outline-none ring-0 transition-colors focus:outline-none focus-visible:outline-none",
                  isActive
                    ? "border border-[rgba(37,37,37,0.06)] bg-white text-page-text shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]"
                    : isCompleted
                      ? "text-page-text-muted"
                      : "text-page-text-subtle",
                  !isClickable && "cursor-default",
                )}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM11.3536 6.35355C11.5488 6.15829 11.5488 5.84171 11.3536 5.64645C11.1583 5.45118 10.8417 5.45118 10.6464 5.64645L7 9.29289L5.35355 7.64645C5.15829 7.45118 4.84171 7.45118 4.64645 7.64645C4.45118 7.84171 4.45118 8.15829 4.64645 8.35355L6.64645 10.3536C6.84171 10.5488 7.15829 10.5488 7.35355 10.3536L11.3536 6.35355Z" fill="#34D399"/>
                  </svg>
                ) : (
                  <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] font-medium", isActive ? "bg-foreground/[0.06] text-page-text" : "text-page-text-subtle")}>
                    {i + 1}
                  </span>
                )}
                {stepLabels[step]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        <div className="hidden md:flex w-[210px] shrink-0 flex-col p-3">
          <CampaignFlowSidebar currentIndex={stepIndex} onStepClick={handleStepClick} stepLabels={stepLabels} steps={steps} />
        </div>

        <div className="relative flex-1 flex flex-col items-center min-h-0 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          <div className="w-full max-w-[600px] px-5 py-6">
            {children}
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="flex shrink-0 items-center justify-between border-t border-foreground/[0.06] px-5 py-4">
        {/* Block reason hint — left side */}
        <div className="min-w-0 flex-1">
          {!canContinue && !isLastStep && continueBlockReason && (
            <span className="flex items-center gap-1.5 font-inter text-xs tracking-[-0.02em] text-[#E57100]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path fillRule="evenodd" clipRule="evenodd" d="M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0ZM7 3.5C7.34518 3.5 7.625 3.77982 7.625 4.125V7.875C7.625 8.22018 7.34518 8.5 7 8.5C6.65482 8.5 6.375 8.22018 6.375 7.875V4.125C6.375 3.77982 6.65482 3.5 7 3.5ZM7 9.625C6.65482 9.625 6.375 9.90482 6.375 10.25C6.375 10.5952 6.65482 10.875 7 10.875C7.34518 10.875 7.625 10.5952 7.625 10.25C7.625 9.90482 7.34518 9.625 7 9.625Z" fill="#E57100"/>
              </svg>
              {continueBlockReason}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="flex h-9 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] active:scale-[0.98]"
            type="button"
          >
            Save as draft
          </button>
          <button
            disabled={!canContinue && !isLastStep}
            onClick={isLastStep && !editMode ? () => setShowTopUpModal(true) : handleContinue}
            className={cn(
              "flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-all active:scale-[0.98] dark:text-[#111111]",
              !canContinue && !isLastStep && "opacity-30 cursor-not-allowed"
            )}
            type="button"
          >
            {isLastStep ? (editMode ? "Save changes" : "Top up and publish") : "Continue"}
          </button>
        </div>
      </div>

      {/* Leave confirmation modal */}
      <LeaveModal
        open={showLeaveModal}
        onSave={() => { handleSaveDraft(); setShowLeaveModal(false); }}
        onKeepEditing={() => setShowLeaveModal(false)}
        onDiscard={() => { setShowLeaveModal(false); handleBackToList(); }}
        onClose={() => setShowLeaveModal(false)}
      />

      {/* Top up and publish modal */}
      <CampaignTopUpModal
        open={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSuccess={() => { setShowTopUpModal(false); handleBackToList(); }}
      />

      <div ref={portalContainer} />
    </div>
  );
}
