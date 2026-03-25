"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconCheck } from "@tabler/icons-react";
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
  },
];

export function CampaignModelModal({
  open,
  onOpenChange,
  onSelect,
}: CampaignModelModalProps) {
  const [selected, setSelected] = useState<CampaignModel | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
      setSelected(null);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setSelected(null);
    onOpenChange(next);
  };

  const selectedModel = MODELS.find((m) => m.id === selected);

  return (
    <DialogPrimitive.Root onOpenChange={handleOpenChange} open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-neutral-100/50 backdrop-blur-md dark:bg-black/60 data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0" />
        <DialogPrimitive.Popup className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] sm:w-[800px] max-w-[800px] focus:outline-none data-[open]:animate-in data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[open]:fade-in-0 data-[ending-style]:zoom-out-95 data-[open]:zoom-in-95">
          <DialogPrimitive.Title className="sr-only">
            Select campaign model
          </DialogPrimitive.Title>

          <div className="flex flex-col h-[min(750px,calc(100vh-64px))] sm:h-[608px] rounded-[20px] sm:rounded-3xl bg-card-bg dark:bg-page-bg overflow-hidden border border-border dark:border-[rgba(224,224,224,0.03)]">
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
            <div className="flex flex-col px-5 sm:p-8 gap-4 sm:gap-8 flex-1 min-h-0">
              {/* Title section */}
              <div className="flex flex-col items-center gap-2 shrink-0 py-0 sm:py-0">
                <h2 className="hidden sm:block text-xl font-semibold text-page-text tracking-[-0.02em]">
                  Campaign Model
                </h2>
                <p className="text-sm sm:text-base font-medium sm:font-normal text-page-text-muted text-center tracking-[-0.02em]">
                  Select a payment model for your campaign.
                </p>
              </div>

              {/* Cards — vertical on mobile, horizontal on desktop */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1 min-h-0 pt-2 sm:pt-0">
                {MODELS.map((model) => {
                  const isSelected = selected === model.id;
                  const Icon = model.icon;

                  return (
                    <button
                      className={cn(
                        "relative isolate flex flex-1 flex-col items-start p-6 gap-4 rounded-[20px] sm:rounded-2xl text-left transition-all duration-200 overflow-hidden outline-none focus:outline-none focus-visible:outline-none",
                      )}
                      style={{
                        background: `linear-gradient(0deg, rgba(224,224,224,0.03), rgba(224,224,224,0.03)), radial-gradient(100% 100% at 50% 0%, rgba(${model.gradientRgb}, 0) 30%, rgba(${model.gradientRgb}, 0.12) 100%)`,
                        boxShadow: isSelected ? `inset 0 0 0 1px rgba(${model.rgb}, 0.3)` : "none",
                      }}
                      key={model.id}
                      onClick={() => setSelected((prev) => prev === model.id ? null : model.id)}
                      type="button"
                    >
                      {/* Decorative illustration */}
                      <CardIllustration model={model.id} />

                      {/* Selection circle */}
                      <div
                        className={cn(
                          "absolute top-5 right-5 z-10 flex size-6 items-center justify-center rounded-full transition-all sm:size-5",
                          !isSelected && "border border-[rgba(37,37,37,0.1)] bg-white dark:border-[rgba(224,224,224,0.2)] dark:bg-[#161616]",
                        )}
                        style={isSelected ? { background: model.checkGradient } : undefined}
                      >
                        {isSelected && (
                          <IconCheck
                            className="text-white"
                            size={14}
                            strokeWidth={2.5}
                          />
                        )}
                      </div>

                      {/* Icon circle */}
                      <div
                        className="z-[1] flex size-10 items-center justify-center rounded-full"
                        style={{
                          background: `rgba(${model.rgb}, 0.08)`,
                        }}
                      >
                        <div className={model.iconColor}>
                          <Icon size={17} />
                        </div>
                      </div>

                      {/* Title + subtitle */}
                      <div className="flex flex-col gap-1 flex-1 z-[3]">
                        <span className="text-lg font-medium text-page-text tracking-[-0.02em]">
                          {model.label}
                        </span>
                        <p className="text-sm text-page-text-muted tracking-[-0.02em]">
                          {model.subtitle}
                        </p>
                      </div>

                      {/* Footer */}
                      <span className="text-xs text-page-text-subtle z-[4]">
                        {model.footer}
                      </span>

                      {/* Bottom colored gradient */}
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 z-[0]"
                        style={{
                          background: `linear-gradient(to top, rgba(${model.gradientRgb}, 0.08) 0%, transparent 100%)`,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-end sm:justify-between px-5 sm:px-6 h-20 sm:h-[68px] shrink-0">
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
