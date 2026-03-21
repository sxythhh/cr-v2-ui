"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { useCampaignFlowContext } from "./CampaignFlowContext";
import { CampaignFlowSidebar } from "./CampaignFlowSidebar";

// ── Leave confirmation modal ───────────────────────────────────────

function LeaveModal({ open, onSave, onKeepEditing, onDiscard, onClose }: { open: boolean; onSave: () => void; onKeepEditing: () => void; onDiscard: () => void; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="sm" showClose={true}>
      {/* Header */}
      <div className="flex flex-col items-center gap-4 px-5 pt-5">
        {/* Icon */}
        <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-[0_0_0_2px_#fff] dark:bg-white/10 dark:shadow-[0_0_0_2px_rgba(255,255,255,0.1)]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M8.25 17H3C1.89543 17 1 16.1046 1 15L1 3C1 1.89543 1.89543 1 3 1L8.25 1M17 8.99999L5.75 8.99999M17 8.99999L12.5 13.5M17 8.99999L12.5 4.5" stroke="#252525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-[rgba(255,37,37,0.06)] font-inter text-sm font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[rgba(255,37,37,0.10)] active:scale-[0.98]"
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
    steps, stepLabels, stepIndex, canContinue, isRestoring, editMode,
    handleContinue, handleBack, handleStepClick,
    handleBackToList, handleSaveDraft, portalContainer,
  } = useCampaignFlowContext();

  const [mounted, setMounted] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const isLastStep = stepIndex === steps.length - 1;

  if (isRestoring) return <div className="h-full bg-white dark:bg-[#111111]" />;

  return (
    <div className={cn("flex h-full flex-col bg-white dark:bg-[#111111] transition-opacity duration-250", mounted ? "opacity-100" : "opacity-0")}>
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
      <div className="flex shrink-0 items-center border-t border-foreground/[0.06] pr-5 py-4">
        <div className="flex-1" />
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
      <Modal open={showTopUpModal} onClose={() => setShowTopUpModal(false)} size="sm" showClose={true}>
        <div className="flex flex-col items-center gap-4 px-5 pt-5">
          <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-[0_0_0_2px_#fff] dark:bg-white/10 dark:shadow-[0_0_0_2px_rgba(255,255,255,0.1)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="#252525" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="font-inter text-lg font-medium tracking-[-0.02em] text-page-text">Top up and publish</span>
            <span className="max-w-[300px] text-center font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-subtle">
              Add funds to your campaign balance to make it live. Creators will start seeing your campaign immediately.
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 px-5 pb-5 pt-4">
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Deposit amount</span>
            <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text">$</span>
              <input type="text" placeholder="5,000" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setShowTopUpModal(false); handleBackToList(); }}
            className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-foreground font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 active:scale-[0.98] dark:text-[#111111]"
          >
            Deposit and publish
          </button>
          <button
            type="button"
            onClick={() => setShowTopUpModal(false)}
            className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <div ref={portalContainer} />
    </div>
  );
}
