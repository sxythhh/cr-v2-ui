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
function CpmEyeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 11" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.08659 1.77048e-10C9.76018 1.97499e-05 12.36 1.65151 14.0402 4.79945C14.2175 5.1315 14.2175 5.53519 14.0402 5.86724C12.36 9.01519 9.76017 10.6666 7.08658 10.6666C4.41299 10.6666 1.81317 9.01511 0.132928 5.86717C-0.0443094 5.53511 -0.0443093 5.13143 0.132928 4.79937C1.81318 1.65143 4.413 -1.97879e-05 7.08659 1.77048e-10ZM4.66992 5.33333C4.66992 3.99864 5.75189 2.91667 7.08658 2.91667C8.42127 2.91667 9.50325 3.99864 9.50325 5.33333C9.50325 6.66802 8.42127 7.75 7.08658 7.75C5.75189 7.75 4.66992 6.66802 4.66992 5.33333Z" fill="currentColor" />
    </svg>
  );
}

function RetainerIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 21" fill="none">
      <path d="M4.75 0C5.16421 0 5.5 0.335786 5.5 0.75V2H12.5V0.75C12.5 0.335786 12.8358 0 13.25 0C13.6642 0 14 0.335786 14 0.75V2H16.25C17.2165 2 18 2.7835 18 3.75V7.25C18 7.66421 17.6642 8 17.25 8H1.5V17.25C1.5 17.3881 1.61193 17.5 1.75 17.5H7.25C7.66421 17.5 8 17.8358 8 18.25C8 18.6642 7.66421 19 7.25 19H1.75C0.783502 19 0 18.2165 0 17.25V3.75C0 2.7835 0.783502 2 1.75 2H4V0.75C4 0.335786 4.33579 0 4.75 0Z" fill="currentColor" />
      <path d="M12.6397 12.0772C13.1818 11.7413 13.8227 11.5469 14.5 11.5469C16.1079 11.5469 17.461 12.6466 17.8444 14.1361C17.9541 14.5623 18.3885 14.8189 18.8147 14.7092C19.2409 14.5995 19.4975 14.1651 19.3878 13.7389C18.8276 11.5623 16.8527 9.95312 14.5 9.95312C13.3847 9.95312 12.3389 10.3156 11.4919 10.9294L10.6257 10.0632C10.291 9.72848 9.71875 9.96551 9.71875 10.4388V12.875C9.71875 13.4618 10.1944 13.9375 10.7812 13.9375H13.2174C13.6907 13.9375 13.9278 13.3653 13.5931 13.0306L12.6397 12.0772Z" fill="currentColor" />
      <path d="M11.1556 15.8639C11.0459 15.4377 10.6115 15.1811 10.1853 15.2908C9.75904 15.4005 9.50246 15.8349 9.61216 16.2611C10.1724 18.4377 12.1473 20.0469 14.5 20.0469C15.6155 20.0469 16.6614 19.6842 17.5081 19.0706L18.3743 19.9368C18.709 20.2715 19.2812 20.0345 19.2812 19.5612V17.125C19.2812 16.5382 18.8056 16.0625 18.2188 16.0625H15.7826C15.3093 16.0625 15.0722 16.6347 15.4069 16.9694L16.3602 17.9227C15.818 18.2588 15.1771 18.4531 14.5 18.4531C12.8921 18.4531 11.539 17.3534 11.1556 15.8639Z" fill="currentColor" />
    </svg>
  );
}

function PerPostIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 18" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M2 1C2 0.447715 2.44772 0 3 0H17C17.5523 0 18 0.447715 18 1C18 1.55228 17.5523 2 17 2H3C2.44772 2 2 1.55228 2 1ZM0 6C0 4.34315 1.34315 3 3 3H17C18.6569 3 20 4.34315 20 6V15C20 16.6569 18.6569 18 17 18H3C1.34315 18 0 16.6569 0 15V6ZM8.56681 7.5987C8.91328 7.43218 9.32452 7.479 9.62469 7.71913L12.1247 9.71913C12.3619 9.9089 12.5 10.1962 12.5 10.5C12.5 10.8038 12.3619 11.0911 12.1247 11.2809L9.62469 13.2809C9.32452 13.521 8.91328 13.5678 8.56681 13.4013C8.22034 13.2348 8 12.8844 8 12.5V8.5C8 8.11559 8.22034 7.76522 8.56681 7.5987Z" fill="currentColor" />
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
  checkGradient: string;
}[] = [
  {
    id: "cpm",
    label: "CPM",
    subtitle: "Paid per 1k views per video",
    footer: "Best for scale & performance",
    icon: CpmEyeIcon,
    iconColor: "text-[#3B82F6] dark:text-[#ADCCFF]",
    rgb: "59, 130, 246",
    checkGradient: "linear-gradient(180deg, #FFFFFF 0%, #ADCCFF 100%)",
  },
  {
    id: "retainer",
    label: "Retainer",
    subtitle: "Fixed amount per month",
    footer: "Best for ongoing partnerships",
    icon: RetainerIcon,
    iconColor: "text-[#D97706] dark:text-[#FFE1AD]",
    rgb: "252, 176, 43",
    checkGradient: "linear-gradient(180deg, #FFFFFF 0%, #FFE1AD 100%)",
  },
  {
    id: "per-video",
    label: "Per post",
    subtitle: "Flat fee for each video",
    footer: "Best for one\u2011offs/tests",
    icon: PerPostIcon,
    iconColor: "text-[#16A34A] dark:text-[#ADFFCB]",
    rgb: "34, 197, 94",
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

          <div className="flex flex-col h-[min(750px,calc(100vh-64px))] sm:h-[608px] rounded-[20px] sm:rounded-3xl bg-card-bg dark:bg-page-bg overflow-hidden border border-border">
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
                        "relative isolate flex flex-1 flex-col items-start p-6 gap-4 rounded-[20px] sm:rounded-2xl text-left transition-all duration-200 bg-foreground/[0.03] dark:bg-foreground/[0.03] overflow-hidden",
                        isSelected
                          ? "border border-[rgba(96,165,250,0.3)]"
                          : "border border-foreground/[0.03]",
                      )}
                      key={model.id}
                      onClick={() => setSelected((prev) => prev === model.id ? null : model.id)}
                      type="button"
                    >
                      {/* Decorative illustration */}
                      <CardIllustration model={model.id} />

                      {/* Selection circle */}
                      <div
                        className="absolute top-4 right-4 flex items-center justify-center size-6 sm:size-5 rounded-full transition-all z-10"
                        style={{
                          background: isSelected
                            ? model.checkGradient
                            : "transparent",
                          border: isSelected
                            ? "none"
                            : "1px solid rgba(224,224,224,0.2)",
                          boxShadow: isSelected
                            ? "none"
                            : "0px -1px 3px rgba(0,0,0,0.06), inset 0px 0.5px 2px rgba(0,0,0,0.12)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {isSelected && (
                          <IconCheck
                            className="text-[#252525]"
                            size={14}
                            strokeWidth={2.5}
                          />
                        )}
                      </div>

                      {/* Icon circle */}
                      <div
                        className="z-[1] flex items-center justify-center size-10 rounded-full"
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
