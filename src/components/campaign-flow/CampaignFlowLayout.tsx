"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCampaignFlowContext } from "./CampaignFlowContext";
import { CampaignFlowSidebar } from "./CampaignFlowSidebar";

export function CampaignFlowLayout({ children }: { children: React.ReactNode }) {
  const {
    steps, stepLabels, stepIndex, canContinue, isRestoring, editMode,
    handleContinue, handleBack, handleStepClick,
    handleBackToList, handleSaveDraft, portalContainer,
  } = useCampaignFlowContext();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;
  const isPreview = steps[stepIndex] === "preview";

  if (isRestoring) return <div className="h-full bg-white dark:bg-[#111111]" />;

  return (
    <div className={cn("flex h-full flex-col bg-white dark:bg-[#111111] transition-opacity duration-250", mounted ? "opacity-100" : "opacity-0")}>
      {/* Top bar */}
      <div className="flex items-center justify-between h-14 px-5 border-b border-border">
        <button
          className="flex items-center gap-2 py-3 text-sm font-medium tracking-[-0.02em] text-page-text transition-opacity hover:opacity-70"
          onClick={handleBackToList}
          type="button"
        >
          <IconArrowLeft size={16} strokeWidth={1.5} className="text-page-text" />
          <span>{editMode ? "Back to campaign" : "Back to model selection"}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center justify-center h-9 px-4 text-sm font-medium tracking-[-0.02em] text-page-text bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(255,255,255,0.06)] rounded-full transition-colors hover:bg-[rgba(37,37,37,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] active:scale-[0.98]"
            type="button"
          >
            Save as draft
          </button>
          <button
            disabled={!canContinue}
            onClick={handleContinue}
            className={cn(
              "flex items-center justify-center h-9 px-4 text-sm font-medium tracking-[-0.02em] bg-[#252525] dark:bg-white text-white dark:text-[#151515] rounded-full transition-all active:scale-[0.98]",
              !canContinue && "opacity-30 cursor-not-allowed"
            )}
            type="button"
          >
            {isLastStep ? (editMode ? "Save changes" : "Top up and publish") : "Continue"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        <div className="hidden md:flex w-[210px] shrink-0 flex-col p-3">
          <CampaignFlowSidebar currentIndex={stepIndex} onStepClick={handleStepClick} stepLabels={stepLabels} steps={steps} />
        </div>

        <div className="relative flex-1 flex flex-col items-center min-h-0 overflow-y-auto scrollbar-hide">
          <div className={isPreview ? "w-full h-full px-6 pb-2" : "w-full max-w-[600px] px-5 py-6"}>
            {children}
          </div>
        </div>
      </div>
      <div ref={portalContainer} />
    </div>
  );
}
