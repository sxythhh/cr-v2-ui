"use client";

import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

const cardCls =
  "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 1.333A3.333 3.333 0 0 0 4.667 4.667V6A2 2 0 0 0 2.667 8v4.667a2 2 0 0 0 2 2h6.666a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2V4.667A3.333 3.333 0 0 0 8 1.333ZM10 6V4.667a2 2 0 1 0-4 0V6h4Zm-2 2.667a.667.667 0 0 1 .667.666v2a.667.667 0 1 1-1.334 0v-2A.667.667 0 0 1 8 8.667Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

function PerkCheckIcon({ unlocked }: { unlocked: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.667 0C2.985 0 0 2.985 0 6.667c0 3.682 2.985 6.666 6.667 6.666 3.682 0 6.666-2.984 6.666-6.666C13.333 2.985 10.349 0 6.667 0Zm2.515 5.422a.667.667 0 0 0-1.032-.938L5.617 7.674l-.812-.812a.667.667 0 0 0-.943.943l1.333 1.333a.667.667 0 0 0 .987-.05l3-3.666Z" fill={unlocked ? "#00994D" : "currentColor"} fillOpacity={unlocked ? 1 : 0.2} />
    </svg>
  );
}

const TIER_PERKS = [
  { name: "Recruit", unlocked: true, perks: ["8% platform fee", "48h review", ""] },
  { name: "Operator", unlocked: false, perks: ["7% platform fee", "48h review", "2% CPM bonus"] },
  { name: "Contender", unlocked: false, perks: ["5% platform fee", "24h review", "5% CPM bonus"] },
  { name: "Challenger", unlocked: false, perks: ["5% platform fee", "12h review", "10% CPM bonus"] },
  { name: "Elite", unlocked: false, perks: ["3% platform fee", "8h review", "15% CPM bonus"] },
  { name: "Legend", unlocked: false, perks: ["0% platform fee", "Instant review", "20% CPM bonus"] },
];

export function PerksDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[520px]">
      <div className="flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.03)]">
        <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Perks</span>
      </div>

      <div className="flex flex-col items-center gap-4 p-5">

              {/* Description */}
              <p className="text-center text-sm leading-[150%] tracking-[-0.02em] text-page-text-muted">
                Your current level is <span className="font-medium text-[#E57100]">Recruit</span>. Move up by <span className="font-bold text-page-text">submitting clips daily</span>, getting them <span className="font-medium text-[#00994D]">approved</span> and <span className="font-medium text-[#8B5CF6]">going viral</span>.
              </p>

              {/* Tiers card */}
              <div className={cn(cardCls, "flex w-full flex-col gap-4 p-4")}>
                {TIER_PERKS.map((tier, idx) => (
                  <div key={tier.name}>
                    {idx > 0 && <div className="mb-4 h-px w-full bg-foreground/[0.06]" />}
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      {tier.unlocked ? (
                        <div className="relative flex size-10 items-center justify-center">
                          <svg width="42" height="42" viewBox="0 0 43 43" fill="none" className="absolute -left-[1px] -top-[1px]">
                            <defs>
                              <linearGradient id={`perkStar${idx}`} x1="21.5" y1="-1.15" x2="21.5" y2="46.1" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FF8B1A" /><stop offset="1" stopColor="#E57100" />
                              </linearGradient>
                            </defs>
                            <path d="M18.56 1.95C19.59.87 20.1.33 20.69.13 21.22-.04 21.78-.04 22.31.13c.6.2 1.11.74 2.13 1.82l6.26 6.6c.19.2.29.31.39.4.1.08.2.15.3.22.12.07.25.13.5.25l8.22 3.92c1.34.64 2.01.96 2.39 1.46.33.44.5.98.5 1.54-.01.63-.36 1.28-1.07 2.59l-4.34 8c-.13.25-.2.37-.25.5-.05.11-.09.23-.12.35-.03.14-.05.28-.08.55l-1.19 9.03c-.19 1.47-.29 2.21-.66 2.72-.32.45-.78.78-1.3.95-.6.19-1.33.05-2.79-.22l-8.95-1.66c-.28-.05-.41-.08-.55-.09-.12-.01-.25-.01-.37 0-.14.01-.28.04-.55.09l-8.95 1.66c-1.46.27-2.19.41-2.79.22-.53-.17-.99-.5-1.31-.95-.36-.51-.46-1.25-.66-2.72L5.87 28.33c-.04-.28-.05-.42-.09-.55-.03-.12-.07-.24-.12-.35-.05-.13-.12-.25-.25-.5l-4.34-8C.36 17.62.01 16.97 0 16.34c-.01-.55.17-1.09.5-1.54.37-.5 1.04-.82 2.39-1.46l8.22-3.92c.25-.12.38-.18.5-.25.1-.07.21-.14.3-.22.1-.09.2-.19.4-.4l6.26-6.6Z" fill={`url(#perkStar${idx})`} stroke="currentColor" strokeOpacity="0.06" />
                          </svg>
                          <div className="relative flex size-[36px] items-center justify-center rounded-full">
                            <svg width="18" height="16" viewBox="0 0 21 18" fill="none">
                              <path d="M13.49.11c.32-.16.7-.14 1 .05.31.19.49.52.49.88v1.88l.01.02 4.32-2.48c.41-.24.86.27.57.65l-3.41 4.45 1.46 2.55c.32.57.5 1.21.5 1.86v.63c0 1.73-1.4 3.12-3.12 3.12-.48 0-.96-.11-1.4-.33l-1.75-.88c.14.76.24 1.68.24 2.76 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-1.41-.2-2.5-.4-3.23-.09-.34-.18-.6-.25-.78-.59-.37-1.07-.89-1.38-1.51-.39-.81-.5-1.73-.28-2.6l.19-.74c.14-.55.7-.89 1.25-.75.55.14.89.7.75 1.25l-.19.74c-.1.39-.05.81.13 1.18.17.33.43.6.76.76l3.91 1.96c.15.07.31.11.47.11.58 0 1.06-.47 1.06-1.06v-.63c0-.29-.08-.58-.22-.84l-3.09-5.4c-.09-.16-.14-.33-.14-.51v-.48l-1.09.54c-.19.09-.4.13-.61.1-2.59-.37-4.61.71-6.04 2.52-1.45 1.84-2.25 4.41-2.25 6.79 0 .57-.46 1.03-1.03 1.03-.57 0-1.04-.46-1.04-1.03 0-2.79.92-5.82 2.7-8.07C5.3 2.38 7.9.91 11.19 1.26l2.3-1.15Z" fill="currentColor" fillOpacity="0.8" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full border border-dashed border-foreground/[0.12] bg-white dark:bg-card-bg">
                          <LockIcon className="size-5" />
                        </div>
                      )}

                      {/* Name + perks row */}
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <span className={cn("text-sm font-medium leading-none tracking-[-0.02em]", !tier.unlocked && "text-foreground/40")}>
                          {tier.name}
                        </span>
                        <div className="flex items-start gap-3">
                          {tier.perks.map((perk, pi) => (
                            <div key={pi} className={cn("flex items-center gap-1 pr-2", !perk && "opacity-0")}>
                              <PerkCheckIcon unlocked={tier.unlocked} />
                              <span className={cn("text-xs font-medium leading-[120%] tracking-[-0.02em]", tier.unlocked ? "text-page-text-muted" : "text-foreground/40")}>
                                {perk || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

        {/* Footer */}
        <div className="sticky bottom-0 w-full bg-card-bg px-0 pt-4 dark:bg-page-bg">
          <button onClick={onClose} className="flex h-10 w-full items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]">
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
}
