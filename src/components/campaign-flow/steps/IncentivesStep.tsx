"use client";

import { cn } from "@/lib/utils";
import type { BonusMilestone, CalculationMethod, IncentivesData } from "@/types/campaign-flow.types";

// ── Icons ──────────────────────────────────────────────────────────

function VideoPlaylistIcon() {
  return (
    <svg width="17" height="15" viewBox="0 0 17 15" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.66667 0.833333C1.66667 0.373096 2.03976 0 2.5 0H14.1667C14.6269 0 15 0.373096 15 0.833333C15 1.29357 14.6269 1.66667 14.1667 1.66667H2.5C2.03976 1.66667 1.66667 1.29357 1.66667 0.833333ZM0 5C0 3.61929 1.11929 2.5 2.5 2.5H14.1667C15.5474 2.5 16.6667 3.61929 16.6667 5V12.5C16.6667 13.8807 15.5474 15 14.1667 15H2.5C1.11929 15 0 13.8807 0 12.5V5ZM7.13901 6.33225C7.42773 6.19348 7.77044 6.2325 8.02058 6.43261L10.1039 8.09928C10.3016 8.25742 10.4167 8.49685 10.4167 8.75C10.4167 9.00315 10.3016 9.24258 10.1039 9.40072L8.02058 11.0674C7.77044 11.2675 7.42773 11.3065 7.13901 11.1678C6.85029 11.029 6.66667 10.737 6.66667 10.4167V7.08333C6.66667 6.763 6.85029 6.47101 7.13901 6.33225Z" fill="currentColor" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.5 1.66667C4.27834 1.66667 1.66667 4.27834 1.66667 7.5C1.66667 9.4813 2.65438 11.2331 4.16667 12.2879V10C4.16667 9.53976 4.53976 9.16667 5 9.16667C5.46024 9.16667 5.83333 9.53976 5.83333 10V14.1667C5.83333 14.6269 5.46024 15 5 15H0.833333C0.373096 15 0 14.6269 0 14.1667C0 13.7064 0.373096 13.3333 0.833333 13.3333H2.78577C1.08729 11.959 0 9.85697 0 7.5C0 3.35786 3.35786 0 7.5 0C8.49306 0 9.443 0.193445 10.3127 0.545483C10.7393 0.71817 10.9451 1.204 10.7724 1.63061C10.5998 2.05722 10.1139 2.26307 9.68732 2.09038C9.01295 1.8174 8.27511 1.66667 7.5 1.66667Z" fill="currentColor" />
      <path d="M8.33333 15C8.79357 15 9.16667 14.6269 9.16667 14.1667C9.16667 13.7064 8.79357 13.3333 8.33333 13.3333C7.8731 13.3333 7.5 13.7064 7.5 14.1667C7.5 14.6269 7.8731 15 8.33333 15Z" fill="currentColor" />
      <path d="M15 6.66666C15 6.20642 14.6269 5.83332 14.1667 5.83332C13.7064 5.83332 13.3333 6.20642 13.3333 6.66666C13.3333 7.12689 13.7064 7.49999 14.1667 7.49999C14.6269 7.49999 15 7.12689 15 6.66666Z" fill="currentColor" />
      <path d="M14.1079 9.38995C14.5065 9.62007 14.643 10.1297 14.4129 10.5283C14.1828 10.9269 13.6731 11.0634 13.2746 10.8333C12.876 10.6032 12.7394 10.0935 12.9695 9.69497C13.1996 9.29639 13.7093 9.15983 14.1079 9.38995Z" fill="currentColor" />
      <path d="M11.973 13.5785C12.3716 13.3484 12.5081 12.8387 12.278 12.4401C12.0479 12.0416 11.5382 11.905 11.1397 12.1351C10.7411 12.3652 10.6045 12.8749 10.8347 13.2735C11.0648 13.672 11.5744 13.8086 11.973 13.5785Z" fill="currentColor" />
      <path d="M13.2725 4.16665C12.8739 4.39677 12.3642 4.26021 12.1341 3.86163C11.904 3.46305 12.0405 2.95339 12.4391 2.72328C12.8377 2.49316 13.3474 2.62972 13.5775 3.0283C13.8076 3.42687 13.671 3.93653 13.2725 4.16665Z" fill="currentColor" />
    </svg>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────

function SectionLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
      {description && <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>}
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-foreground/[0.06] bg-card-bg p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]", className)}>
      {children}
    </div>
  );
}

function RadioCard({ selected, onClick, icon, title, description }: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; description: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
        selected ? "border-[rgba(255,144,37,0.3)]" : "border-foreground/[0.06] bg-card-bg hover:bg-foreground/[0.02]",
      )}
      style={selected ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), #FFFFFF" } : undefined}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.25px] border-foreground/[0.06] bg-white shadow-[0px_1.25px_2.5px_rgba(0,0,0,0.03)] dark:bg-white/10">
        <span className={selected ? "text-[#252525] dark:text-white" : "text-page-text-muted"}>{icon}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
        <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>
      </div>
      <div className="flex shrink-0 items-center justify-center">
        {selected ? (
          <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
            <g filter="url(#f_sel_inc)">
              <path fillRule="evenodd" clipRule="evenodd" d="M13 4C7.47715 4 3 8.47715 3 14C3 19.5228 7.47715 24 13 24C18.5228 24 23 19.5228 23 14C23 8.47715 18.5228 4 13 4ZM16.5805 11.9749C16.8428 11.6543 16.7955 11.1818 16.4749 10.9195C16.1543 10.6572 15.6818 10.7045 15.4195 11.0251L11.4443 15.8837L10.0303 14.4697C9.73744 14.1768 9.26256 14.1768 8.96967 14.4697C8.67678 14.7626 8.67678 15.2374 8.96967 15.5303L10.9697 17.5303C11.1195 17.6802 11.3257 17.7596 11.5374 17.7491C11.749 17.7385 11.9463 17.6389 12.0805 17.4749L16.5805 11.9749Z" fill="#FF9025" />
            </g>
            <defs><filter id="f_sel_inc" x="0" y="0" width="26" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="bg" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="ha" /><feOffset dy="-1" /><feGaussianBlur stdDeviation="1.5" /><feComposite in2="ha" operator="out" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" /><feBlend in2="bg" result="e1" /><feBlend in="SourceGraphic" in2="e1" result="shape" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="ha2" /><feOffset dy="0.5" /><feGaussianBlur stdDeviation="1" /><feComposite in2="ha2" operator="arithmetic" k2="-1" k3="1" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" /><feBlend in2="shape" /></filter></defs>
          </svg>
        ) : (
          <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
            <g filter="url(#f_unsel_inc)">
              <circle cx="13" cy="14" r="10" fill="white" /><circle cx="13" cy="14" r="9.5" stroke="#252525" strokeOpacity="0.1" />
            </g>
            <defs><filter id="f_unsel_inc" x="0" y="0" width="26" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="bg" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="ha" /><feOffset dy="-1" /><feGaussianBlur stdDeviation="1.5" /><feComposite in2="ha" operator="out" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" /><feBlend in2="bg" result="e1" /><feBlend in="SourceGraphic" in2="e1" result="shape" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="ha2" /><feOffset dy="0.5" /><feGaussianBlur stdDeviation="1" /><feComposite in2="ha2" operator="arithmetic" k2="-1" k3="1" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" /><feBlend in2="shape" /></filter></defs>
          </svg>
        )}
      </div>
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────

export function IncentivesStep({ data, onChange }: { data: IncentivesData; onChange: (data: IncentivesData) => void }) {
  const update = (partial: Partial<IncentivesData>) => onChange({ ...data, ...partial });
  const addMilestone = () => update({ milestones: [...data.milestones, { name: "", amount: "", views: "" }] });
  const removeMilestone = (i: number) => update({ milestones: data.milestones.filter((_, idx) => idx !== i) });
  const updateMilestone = (i: number, partial: Partial<BonusMilestone>) => {
    const next = [...data.milestones];
    next[i] = { ...next[i], ...partial };
    update({ milestones: next });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Calculation method */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Calculation method" description="Choose how bonuses are calculated across a creator's videos." />
        <Card className="flex flex-col gap-2 p-5">
          <RadioCard
            selected={data.calculationMethod === "per-post"}
            onClick={() => update({ calculationMethod: "per-post" })}
            icon={<VideoPlaylistIcon />}
            title="Per video"
            description="Bonuses calculated per video based on its individual view count."
          />
          <RadioCard
            selected={data.calculationMethod === "per-cycle"}
            onClick={() => update({ calculationMethod: "per-cycle" })}
            icon={<RefreshIcon />}
            title="Per cycle"
            description="Bonuses based on total views across all videos per payment cycle."
          />
        </Card>
      </div>

      {/* 2. Bonus milestones */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Bonus milestones" description="Reward creators for reaching view milestones." />
        {data.milestones.map((m, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-[20px] border border-foreground/[0.06] bg-card-bg p-6">
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Milestone name</span>
              <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input
                  type="text"
                  value={m.name}
                  onChange={(e) => updateMilestone(i, { name: e.target.value })}
                  placeholder="e.g. 50K Views Bonus"
                  className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Bonus</span>
              <div className="flex items-center gap-3">
                <div className="flex h-10 flex-1 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text">$</span>
                  <input
                    type="text"
                    value={m.amount}
                    onChange={(e) => updateMilestone(i, { amount: e.target.value })}
                    placeholder="50"
                    className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                  />
                </div>
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">per</span>
                <div className="flex h-10 flex-1 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <input
                    type="text"
                    value={m.views}
                    onChange={(e) => updateMilestone(i, { views: e.target.value })}
                    placeholder="50,000"
                    className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Add milestone */}
        <div className="rounded-[20px] border border-foreground/[0.06] bg-card-bg p-6">
          <button
            type="button"
            onClick={addMilestone}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-foreground/[0.12] p-4"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9H15M9 3V15" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Add milestone</span>
          </button>
        </div>
      </div>
    </div>
  );
}
