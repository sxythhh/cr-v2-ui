"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CampaignModel } from "@/types/campaign-flow.types";
import { CardIllustration } from "./CampaignModelIllustrations";

interface CampaignModelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (model: CampaignModel) => void;
}

/* Inline SVG icons matching clipper's cpm-eye and retainer icons */
function CpmEyeIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 17 17" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.08659 3.17048C10.7602 3.17002 13.36 4.82151 15.0402 7.96945C15.2175 8.3015 15.2175 8.70519 15.0402 9.03724C13.36 12.1852 10.7602 13.8366 8.08658 13.8366C5.41299 13.8366 2.81317 12.1851 1.13293 9.03717C0.955691 8.70511 0.955691 8.30143 1.13293 7.96937C2.81318 4.82143 5.413 3.17002 8.08659 3.17048ZM5.66992 8.50333C5.66992 7.16864 6.75189 6.08667 8.08658 6.08667C9.42127 6.08667 10.5033 7.16864 10.5033 8.50333C10.5033 9.83802 9.42127 10.92 8.08658 10.92C6.75189 10.92 5.66992 9.83802 5.66992 8.50333Z" fill="currentColor" />
    </svg>
  );
}

function RetainerIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" fill="none">
      <path d="M5.25 0C5.66421 0 6 0.335786 6 0.75V2H13V0.75C13 0.335786 13.3358 0 13.75 0C14.1642 0 14.5 0.335786 14.5 0.75V2H16.75C17.7165 2 18.5 2.7835 18.5 3.75V7.25C18.5 7.66421 18.1642 8 17.75 8H2V17.25C2 17.3881 2.11193 17.5 2.25 17.5H7.75C8.16421 17.5 8.5 17.8358 8.5 18.25C8.5 18.6642 8.16421 19 7.75 19H2.25C1.2835 19 0.5 18.2165 0.5 17.25V3.75C0.5 2.7835 1.2835 2 2.25 2H4.5V0.75C4.5 0.335786 4.83579 0 5.25 0Z" fill="currentColor" />
      <path d="M13.1397 12.0772C13.6818 11.7413 14.3227 11.5469 15 11.5469C16.6079 11.5469 17.961 12.6466 18.3444 14.1361C18.4541 14.5623 18.8885 14.8189 19.3147 14.7092C19.7409 14.5995 19.9975 14.1651 19.8878 13.7389C19.3276 11.5623 17.3527 9.95312 15 9.95312C13.8847 9.95312 12.8389 10.3156 11.9919 10.9294L11.1257 10.0632C10.791 9.72848 10.2188 9.96551 10.2188 10.4388V12.875C10.2188 13.4618 10.6944 13.9375 11.2812 13.9375H13.7174C14.1907 13.9375 14.4278 13.3653 14.0931 13.0306L13.1397 12.0772Z" fill="currentColor" />
      <path d="M11.6556 15.8639C11.5459 15.4377 11.1115 15.1811 10.6853 15.2908C10.259 15.4005 10.0025 15.8349 10.1122 16.2611C10.6724 18.4377 12.6473 20.0469 15 20.0469C16.1155 20.0469 17.1614 19.6842 18.0081 19.0706L18.8743 19.9368C19.209 20.2715 19.7812 20.0345 19.7812 19.5612V17.125C19.7812 16.5382 19.3056 16.0625 18.7188 16.0625H16.2826C15.8093 16.0625 15.5722 16.6347 15.9069 16.9694L16.8602 17.9227C16.318 18.2588 15.6771 18.4531 15 18.4531C13.3921 18.4531 12.039 17.3534 11.6556 15.8639Z" fill="currentColor" />
    </svg>
  );
}

function PerPostIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M2 2C2 1.44772 2.44772 1 3 1H17C17.5523 1 18 1.44772 18 2C18 2.55228 17.5523 3 17 3H3C2.44772 3 2 2.55228 2 2ZM0 7C0 5.34315 1.34315 4 3 4H17C18.6569 4 20 5.34315 20 7V16C20 17.6569 18.6569 19 17 19H3C1.34315 19 0 17.6569 0 16V7ZM8.56681 8.5987C8.91328 8.43218 9.32452 8.479 9.62469 8.71913L12.1247 10.7191C12.3619 10.9089 12.5 11.1962 12.5 11.5C12.5 11.8038 12.3619 12.0911 12.1247 12.2809L9.62469 14.2809C9.32452 14.521 8.91328 14.5678 8.56681 14.4013C8.22034 14.2348 8 13.8844 8 13.5V9.5C8 9.11559 8.22034 8.76522 8.56681 8.5987Z" fill="currentColor" />
    </svg>
  );
}

type ModelIconProps = { size?: number; className?: string };

const MODELS: {
  id: CampaignModel;
  label: string;
  subtitle: string;
  footer: string;
  icon: React.ComponentType<ModelIconProps>;
  iconColor: string;
  rgb: string;
  gradientRgb: string;
  checkGradient: string;
  checkColor: string;
  checkColorDark: string;
}[] = [
  {
    id: "cpm",
    label: "CPM",
    subtitle: "Paid per 1K views on a video",
    footer: "Best for scale & performance",
    icon: CpmEyeIcon,
    iconColor: "text-[#3B82F6] dark:text-[#60A5FA]",
    rgb: "96, 165, 250",
    gradientRgb: "26, 103, 229",
    checkGradient: "linear-gradient(180deg, #FFFFFF 0%, #ADCCFF 100%)",
    checkColor: "#1A67E5",
    checkColorDark: "#60A5FA",
  },
  {
    id: "retainer",
    label: "Retainer",
    subtitle: "Fixed amount per month",
    footer: "Best for ongoing partnerships",
    icon: RetainerIcon,
    iconColor: "text-[#D97706] dark:text-[#FB923C]",
    rgb: "251, 146, 60",
    gradientRgb: "229, 113, 0",
    checkGradient: "linear-gradient(180deg, #FFFFFF 0%, #FFE1AD 100%)",
    checkColor: "#E57100",
    checkColorDark: "#FB923C",
  },
  {
    id: "per-video",
    label: "Per post",
    subtitle: "Flat fee for each video",
    footer: "Best for one\u2011offs/tests",
    icon: PerPostIcon,
    iconColor: "text-[#16A34A] dark:text-[#34D399]",
    rgb: "52, 211, 153",
    gradientRgb: "0, 178, 89",
    checkGradient: "linear-gradient(180deg, #FFFFFF 0%, #ADFFCB 100%)",
    checkColor: "#00B259",
    checkColorDark: "#34D399",
  },
];

export function CampaignModelModal({
  open,
  onOpenChange,
  onSelect,
}: CampaignModelModalProps) {
  const [selected, setSelected] = useState<CampaignModel | null>(null);
  const [screen, setScreen] = useState<"choose" | "model">("choose");

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
      setSelected(null);
      setScreen("choose");
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) { setSelected(null); setScreen("choose"); }
    onOpenChange(next);
  };

  const handleAiSelect = () => {
    onOpenChange(false);
    setScreen("choose");
    // Navigate to AI campaign creation
    window.location.href = "/create-campaign/ai";
  };

  const selectedModel = MODELS.find((m) => m.id === selected);

  // ── "Choose how to get started" screen ──
  if (screen === "choose") {
    return (
      <DialogPrimitive.Root onOpenChange={handleOpenChange} open={open}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-neutral-100/50 backdrop-blur-md dark:bg-black/60 data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0" />
          <DialogPrimitive.Popup className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] sm:w-[520px] max-w-[520px] focus:outline-none data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0 data-[ending-style]:zoom-out-95 data-[open]:zoom-in-95">
            <DialogPrimitive.Title className="sr-only">New campaign</DialogPrimitive.Title>
            <div className="flex flex-col rounded-[20px] bg-white dark:bg-page-bg overflow-hidden border border-border dark:border-[rgba(224,224,224,0.03)]">
              {/* Header */}
              <div className="relative flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3">
                <span className="text-sm font-medium tracking-[-0.02em] text-page-text">New campaign</span>
                <DialogPrimitive.Close render={<button className="absolute right-4 top-3 flex items-center justify-center text-foreground/50" type="button" />}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.52" strokeLinecap="round" /></svg>
                </DialogPrimitive.Close>
              </div>

              {/* Subtitle */}
              <div className="flex items-center justify-center px-5 pt-4">
                <span className="text-sm font-medium tracking-[-0.02em] text-foreground/70">Choose how you&apos;d like to get started</span>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2 px-5 pb-5 pt-4">
                {/* AI Assistant */}
                <button
                  onClick={handleAiSelect}
                  className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] bg-white p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]"
                  type="button"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.03)]" style={{ background: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.2) 0%, rgba(255,144,37,0) 90.69%), #FFFFFF", border: "1px solid rgba(229,113,0,0.08)" }}>
                    <svg width="20" height="20" viewBox="0 0 12 14" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6 0C6.36819 0 6.66667 0.298477 6.66667 0.666667V1.33333H9.33333C10.4379 1.33333 11.3333 2.22876 11.3333 3.33333V6.66667C11.3333 7.259 11.0758 7.79119 10.6667 8.1574V9.05719L11.8047 10.1953C12.0651 10.4556 12.0651 10.8777 11.8047 11.1381C11.5444 11.3984 11.1223 11.3984 10.8619 11.1381L10.454 10.7302C9.86034 12.6251 8.09073 14 6 14C3.90927 14 2.13966 12.6251 1.54598 10.7302L1.13807 11.1381C0.877722 11.3984 0.455612 11.3984 0.195262 11.1381C-0.0650874 10.8777 -0.0650874 10.4556 0.195262 10.1953L1.33333 9.05719V8.1574C0.924167 7.79119 0.666667 7.259 0.666667 6.66667V3.33333C0.666667 2.22876 1.5621 1.33333 2.66667 1.33333H5.33333V0.666667C5.33333 0.298477 5.63181 0 6 0ZM2.66667 2.66667C2.29848 2.66667 2 2.96514 2 3.33333V6.66667C2 7.03486 2.29848 7.33333 2.66667 7.33333H9.33333C9.70152 7.33333 10 7.03486 10 6.66667V3.33333C10 2.96514 9.70152 2.66667 9.33333 2.66667H2.66667ZM4 4C4.36819 4 4.66667 4.29848 4.66667 4.66667V5.33333C4.66667 5.70152 4.36819 6 4 6C3.63181 6 3.33333 5.70152 3.33333 5.33333V4.66667C3.33333 4.29848 3.63181 4 4 4ZM8 4C8.36819 4 8.66667 4.29848 8.66667 4.66667V5.33333C8.66667 5.70152 8.36819 6 8 6C7.63181 6 7.33333 5.70152 7.33333 5.33333V4.66667C7.33333 4.29848 7.63181 4 8 4Z" fill="#E57100" /></svg>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium tracking-[-0.02em] text-page-text">AI Assistant</span>
                      <span className="rounded-full bg-[rgba(229,113,0,0.08)] px-2 py-1 text-xs font-medium tracking-[-0.02em] text-[#E57100]">Recommended</span>
                    </div>
                    <span className="text-sm leading-[150%] tracking-[-0.02em] text-page-text-muted">Answer a few questions and we&apos;ll build your campaign for you. Takes less than 2 minutes.</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>

                {/* Manual setup */}
                <button
                  onClick={() => setScreen("model")}
                  className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] bg-white p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]"
                  type="button"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 2.5L5.83 4.17M12.5 2.5L14.17 4.17M10 1.67V3.33M3.33 10H1.67M18.33 10H16.67M15.83 15.83L14.17 14.17M4.17 15.83L5.83 14.17M10 16.67V18.33M13.33 10C13.33 11.84 11.84 13.33 10 13.33C8.16 13.33 6.67 11.84 6.67 10C6.67 8.16 8.16 6.67 10 6.67C11.84 6.67 13.33 8.16 13.33 10Z" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Manual setup</span>
                      <span className="rounded-full bg-foreground/[0.06] px-2 py-1 text-xs font-medium tracking-[-0.02em] text-page-text">Advanced</span>
                    </div>
                    <span className="text-sm leading-[150%] tracking-[-0.02em] text-page-text-muted">Full control over every setting. Step-by-step wizard with all configuration options.</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }

  // ── Model selection screen (existing) ──
  return (
    <DialogPrimitive.Root onOpenChange={handleOpenChange} open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-neutral-100/50 backdrop-blur-md dark:bg-black/60 data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0" />
        <DialogPrimitive.Popup className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] sm:w-[800px] max-w-[800px] focus:outline-none data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0 data-[ending-style]:zoom-out-95 data-[open]:zoom-in-95">
          <DialogPrimitive.Title className="sr-only">
            Select campaign model
          </DialogPrimitive.Title>

          <div className="flex flex-col h-[min(750px,calc(100vh-64px))] sm:h-[568px] rounded-[20px] sm:rounded-3xl bg-card-bg dark:bg-page-bg overflow-hidden border border-border dark:border-[rgba(224,224,224,0.03)]">
            {/* Top bar */}
            <div className="relative flex items-center justify-center px-5 sm:px-6 h-10 sm:h-[41px] shrink-0 bg-foreground/[0.03] dark:bg-foreground/[0.03] border-b border-foreground/[0.03]">
              <span className="text-sm font-medium tracking-[-0.02em] text-page-text">
                New campaign
              </span>
              {/* Mobile close button */}
              <DialogPrimitive.Close
                render={
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center sm:hidden"
                    type="button"
                  />
                }
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.52" strokeLinecap="round" />
                </svg>
              </DialogPrimitive.Close>
            </div>

            {/* Content */}
            <div className="flex flex-col px-5 gap-2 flex-1 min-h-0">
              {/* Title section */}
              <div className="flex flex-col items-center gap-1 shrink-0 pt-3 sm:pt-3">
                <h2 className="hidden sm:block text-xl font-semibold text-page-text tracking-[-0.02em]">
                  Campaign Model
                </h2>
                <p className="text-sm sm:text-base font-medium sm:font-normal text-page-text-muted text-center tracking-[-0.02em]">
                  Select a payment model for your campaign.
                </p>
              </div>

              {/* Cards — vertical on mobile, horizontal on desktop */}
              <div className="flex flex-col sm:flex-row gap-2 flex-1 min-h-0">
                {MODELS.map((model) => {
                  const isSelected = selected === model.id;
                  const Icon = model.icon;

                  return (
                    <button
                      className={cn(
                        "relative isolate flex flex-1 flex-col items-start p-4 gap-2 overflow-hidden rounded-3xl text-left outline-none focus:outline-none focus-visible:outline-none cursor-pointer sm:p-6 sm:gap-4",
                        !isSelected && "border border-[rgba(37,37,37,0.06)] dark:border-[rgba(224,224,224,0.03)]",
                      )}
                      style={{
                        background: `radial-gradient(100% 100% at 50% 0%, rgba(${model.gradientRgb}, 0) 30%, rgba(${model.gradientRgb}, 0.12) 100%), var(--card-bg, #FFFFFF)`,
                        border: isSelected ? `1px solid rgba(${model.rgb}, 0.3)` : undefined,
                      }}
                      key={model.id}
                      onClick={() => setSelected((prev) => prev === model.id ? null : model.id)}
                      type="button"
                    >
                      {/* Illustration with gradient mask baked in */}
                      <CardIllustration model={model.id} />

                      {/* Selection circle */}
                      <div className="absolute right-3 top-3 z-[5] flex size-5 items-center justify-center sm:right-4 sm:top-4">
                        {isSelected ? (
                          <>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="dark:hidden">
                              <circle cx="10" cy="10" r="10" fill="white"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM13.5805 7.9749C13.8428 7.6543 13.7955 7.1818 13.4749 6.9195C13.1543 6.6572 12.6818 6.7045 12.4195 7.0251L8.4443 11.8837L7.0303 10.4697C6.73744 10.1768 6.26256 10.1768 5.96967 10.4697C5.67678 10.7626 5.67678 11.2374 5.96967 11.5303L7.96967 13.5303C8.11953 13.6802 8.32574 13.7596 8.53738 13.7491C8.74903 13.7385 8.94631 13.6389 9.08048 13.4749L13.5805 7.9749Z" fill={model.checkColor} />
                              <circle cx="10" cy="10" r="9.5" stroke="#252525" strokeOpacity="0.1"/>
                            </svg>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="hidden dark:block">
                              <circle cx="10" cy="10" r="10" fill="#1C1C1C"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0ZM13.5805 7.9749C13.8428 7.6543 13.7955 7.1818 13.4749 6.9195C13.1543 6.6572 12.6818 6.7045 12.4195 7.0251L8.4443 11.8837L7.0303 10.4697C6.73744 10.1768 6.26256 10.1768 5.96967 10.4697C5.67678 10.7626 5.67678 11.2374 5.96967 11.5303L7.96967 13.5303C8.11953 13.6802 8.32574 13.7596 8.53738 13.7491C8.74903 13.7385 8.94631 13.6389 9.08048 13.4749L13.5805 7.9749Z" fill={model.checkColorDark} />
                              <circle cx="10" cy="10" r="9.5" stroke="#E0E0E0" strokeOpacity="0.1"/>
                            </svg>
                          </>
                        ) : (
                          <>
                            <div className="size-5 rounded-full dark:hidden" style={{ background: "#FFFFFF", border: "1px solid rgba(37,37,37,0.1)" }} />
                            <div className="hidden size-5 rounded-full dark:block" style={{ background: "rgba(224,224,224,0.03)", border: "1px solid rgba(224,224,224,0.2)" }} />
                          </>
                        )}
                      </div>

                      {/* Content — all above gradient (z-4) */}
                      <div className="relative z-[4] flex size-10 shrink-0 items-center justify-center rounded-full sm:size-14" style={{ background: `rgba(${model.rgb}, 0.06)` }}>
                        <div className={cn(model.iconColor, "[&_svg]:size-[17px] sm:[&_svg]:size-6")}><Icon size={24} /></div>
                      </div>
                      <div className="relative z-[4] flex flex-col gap-0.5 flex-1 sm:gap-1">
                        <span className="text-lg font-medium text-page-text tracking-[-0.02em] sm:text-2xl">{model.label}</span>
                        <p className="text-xs leading-[150%] text-foreground/70 tracking-[-0.02em] sm:text-sm">{model.subtitle}</p>
                      </div>
                      <span className="relative z-[4] text-[11px] leading-[150%] text-foreground/50 sm:text-xs">{model.footer}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-end sm:justify-between p-5 shrink-0">
              {/* Left placeholder for centering — hidden on mobile */}
              <div className="hidden sm:block w-[150px] opacity-0 pointer-events-none">
                <div className="rounded-full px-4 h-9 text-sm">Cancel</div>
              </div>

              {/* Center indicator — hidden on mobile */}
              <div className="hidden sm:flex items-center gap-1.5 h-[17px]">
                {selectedModel ? (
                  <>
                    <div className={selectedModel.iconColor}>
                      <selectedModel.icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-page-text tracking-[-0.02em]">
                      {selectedModel.label}
                    </span>
                  </>
                ) : null}
              </div>

              {/* Right buttons */}
              <div className="flex items-center gap-2 sm:w-[150px] justify-end">
                <DialogPrimitive.Close
                  render={
                    <button
                      className="flex items-center justify-center rounded-full h-10 sm:h-9 px-4 text-sm font-medium tracking-[-0.02em] text-page-text bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] active:scale-[0.98]"
                      type="button"
                    />
                  }
                >
                  Cancel
                </DialogPrimitive.Close>
                <button
                  className={cn(
                    "flex items-center justify-center rounded-full h-10 sm:h-9 px-4 text-sm font-medium tracking-[-0.02em] bg-[#252525] dark:bg-white text-white dark:text-[#151515] transition-all active:scale-[0.98]",
                    !selected && "opacity-30 cursor-not-allowed",
                  )}
                  disabled={!selected}
                  onClick={handleContinue}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
