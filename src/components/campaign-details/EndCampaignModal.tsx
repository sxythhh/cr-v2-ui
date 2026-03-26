"use client";

import { useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface EndCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: {
    title: string;
    type: string;
    views: string;
    creators: number;
    thumbnail?: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Shared                                                             */
/* ------------------------------------------------------------------ */

const muted = "text-page-text-muted";
const cardBorder = "border border-[rgba(37,37,37,0.06)] dark:border-[rgba(224,224,224,0.03)]";
const cardShadow = "shadow-[0px_1px_2px_rgba(0,0,0,0.03)]";

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 rounded-full",
            i === current ? "w-4 bg-[#252525] dark:bg-[#e5e5e5]" : "w-2 bg-[rgba(37,37,37,0.24)] dark:bg-[rgba(255,255,255,0.24)]",
          )}
        />
      ))}
    </div>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl bg-[rgba(37,37,37,0.06)] p-0.5 dark:bg-card-bg">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "flex h-8 flex-1 cursor-pointer items-center justify-center rounded-[10px] text-[14px] font-medium tracking-[-0.02em] transition-colors",
            value === opt
              ? "bg-white text-[#252525] shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[#222222] dark:text-page-text"
              : "text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.5)]",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Confirm                                                   */
/* ------------------------------------------------------------------ */

function ConfirmStep({
  campaign,
  onCancel,
  onConfirm,
}: {
  campaign: EndCampaignModalProps["campaign"];
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-5 px-4 py-5 sm:px-5">
        <span className="text-[14px] font-medium text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]">
          Are you sure you wish to end this campaign?
        </span>
        <div className={cn("flex items-center gap-2 rounded-2xl bg-white p-3", cardBorder, cardShadow, "dark:bg-foreground/[0.03]")}>
          <div className="h-10 w-[68px] shrink-0 overflow-hidden rounded-[10px] bg-[rgba(37,37,37,0.08)] dark:bg-[rgba(255,255,255,0.08)]">
            {campaign.thumbnail && <img src={campaign.thumbnail} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] font-medium text-page-text">{campaign.title}</span>
            <span className={cn("text-[12px]", muted)}>
              {campaign.type} · {campaign.views} views · {campaign.creators} creators
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-foreground/[0.06] px-4 py-4 sm:justify-center sm:px-5">
        <button onClick={onCancel} className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-[rgba(37,37,37,0.06)] px-4 text-[14px] font-medium text-[#252525] transition-colors hover:bg-[rgba(37,37,37,0.10)] sm:flex-none dark:bg-foreground/[0.03] dark:text-page-text dark:hover:bg-foreground/[0.06]">
          No, take me back
        </button>
        <button onClick={(e) => { e.stopPropagation(); onConfirm(); }} className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-[rgba(251,113,133,0.08)] px-4 text-[14px] font-medium text-[#FB7185] transition-colors hover:bg-[rgba(251,113,133,0.12)] sm:flex-none">
          Yes, end campaign
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Campaign Completed                                        */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: "4.2M", label: "Total views", change: "+23%" },
  { value: "$8,120", label: "Total payouts", change: "98% of budget" },
  { value: "47", label: "Creators", change: "+12 vs avg" },
  { value: "$0.59", label: "Effective CPM", change: "Below $1.00 target" },
];

const TOP_CREATORS = [
  { name: "JadenMalcolm", views: "1.2M views" },
  { name: "CryptoReels", views: "890K views" },
  { name: "NightFocus", views: "742K views" },
];

function CompletedStep({
  campaign,
  onCancel,
  onContinue,
}: {
  campaign: EndCampaignModalProps["campaign"];
  onCancel: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div
        className="flex flex-col items-center gap-6 px-4 pb-5 pt-[60px] sm:px-5"
        style={{ background: "radial-gradient(50% 53.47% at 50% 0%, rgba(251,146,60,0.24) 0%, rgba(251,146,60,0) 100%)" }}
      >
        {/* Check icon + title */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg, #F59E0B 0%, #F97316 100%)", boxShadow: "0px 0px 0px 2px var(--page-bg, #FFFFFF), inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 1px 0px rgba(255,255,255,0.36)" }}>
            <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white" />
            </svg>
          </div>
          <span className="campaign-completed-text text-[20px] font-medium tracking-[-0.02em] text-[#FB923C]">Campaign Completed</span>
        </div>

        {/* Campaign name */}
        <span className={cn("text-[14px] font-medium", muted)}>{campaign.title}</span>

        {/* Step dots */}
        <StepDots current={0} total={3} />

        {/* Stats row */}
        <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className={cn("flex h-[84px] flex-col justify-between rounded-2xl bg-white p-3", cardBorder, "dark:bg-foreground/[0.03]")}>
              <span className="text-[14px] font-medium tracking-[-0.02em] text-page-text">{s.value}</span>
              <div className="flex flex-col gap-2">
                <span className={cn("text-[12px]", muted)}>{s.label}</span>
                <span className="text-[10px] tracking-[-0.02em] text-[#00994D] dark:text-[#34D399]">{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Top creators */}
        <div className="flex w-full flex-col gap-2">
          <span className={cn("text-[12px]", muted)}>Top performing creators</span>
          <div className={cn("flex flex-col rounded-2xl bg-white", cardBorder, cardShadow, "dark:bg-foreground/[0.03]")}>
            {TOP_CREATORS.map((c, i) => (
              <div key={c.name} className={cn("flex h-10 items-center justify-between px-1", i < TOP_CREATORS.length - 1 && "border-b border-[rgba(37,37,37,0.03)] dark:border-[rgba(255,255,255,0.03)]")}>
                <div className="flex items-center gap-2 px-3">
                  <div className="size-3 rounded-full bg-[rgba(37,37,37,0.12)] dark:bg-[rgba(255,255,255,0.12)]" />
                  <span className={cn("text-[12px] font-medium leading-[1.2]", muted)}>{c.name}</span>
                </div>
                <span className="px-3 text-[12px] font-medium tracking-[-0.02em] text-page-text">{c.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-page-border px-4 py-4 sm:px-5">
        <button onClick={onCancel} className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-[rgba(37,37,37,0.06)] px-4 text-[14px] font-medium text-[#252525] transition-colors hover:bg-[rgba(37,37,37,0.10)] dark:bg-foreground/[0.03] dark:text-page-text dark:hover:bg-foreground/[0.06]">
          Cancel
        </button>
        <button onClick={onContinue} className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#252525] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#333] dark:bg-foreground dark:text-page-bg dark:hover:bg-foreground/80">
          Continue
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Feedback Survey                                           */
/* ------------------------------------------------------------------ */

function FeedbackStep({
  campaign,
  onBack,
  onSubmit,
}: {
  campaign: EndCampaignModalProps["campaign"];
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [rating, setRating] = useState<string | null>(null);
  const [runAgain, setRunAgain] = useState("Yes, definitely");
  const [nps, setNps] = useState(0);

  return (
    <>
      <div
        className="flex flex-col items-center gap-6 overflow-y-auto px-4 pb-5 pt-[60px] sm:px-5"
        style={{ background: "radial-gradient(50% 53.47% at 50% 0%, rgba(0,153,77,0.24) 0%, rgba(0,153,77,0) 100%)", scrollbarWidth: "none" }}
      >
        {/* Check icon + title */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg, #F59E0B 0%, #F97316 100%)", boxShadow: "0px 0px 0px 2px var(--page-bg, #FFFFFF), inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 1px 0px rgba(255,255,255,0.36)" }}>
            <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white" />
            </svg>
          </div>
          <span className="campaign-completed-text text-[20px] font-medium tracking-[-0.02em] text-[#FB923C]">Campaign Completed</span>
        </div>

        <span className={cn("text-[14px] font-medium", muted)}>{campaign.title}</span>
        <StepDots current={1} total={3} />

        {/* How did this campaign go? */}
        <div className="flex w-full flex-col items-center gap-4">
          <span className={cn("text-[12px]", muted)}>How did this campaign go?</span>
          <div className="flex w-full gap-2">
            {[
              { label: "Poor", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10ZM6.46306 12.4645C8.41568 10.5118 11.5815 10.5118 13.5341 12.4645C13.9247 12.855 13.9247 13.4882 13.5341 13.8787C13.1436 14.2692 12.5104 14.2692 12.1199 13.8787C10.9483 12.7071 9.04885 12.7071 7.87727 13.8787C7.48675 14.2692 6.85358 14.2692 6.46306 13.8787C6.07253 13.4882 6.07253 12.855 6.46306 12.4645ZM7.25 6.25C6.55964 6.25 6 6.80964 6 7.5C6 8.19036 6.55964 8.75 7.25 8.75C7.94036 8.75 8.5 8.19036 8.5 7.5C8.5 6.80964 7.94036 6.25 7.25 6.25ZM11.5 7.5C11.5 6.80964 12.0596 6.25 12.75 6.25C13.4404 6.25 14 6.80964 14 7.5C14 8.19036 13.4404 8.75 12.75 8.75C12.0596 8.75 11.5 8.19036 11.5 7.5Z" fill="currentColor"/></svg> },
              { label: "Okay", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM4.57428 7.76285C4.9731 7.39726 5.58827 7.4162 5.96402 7.79986L5.96918 7.80417C5.98463 7.81682 6.0193 7.84303 6.0726 7.8721C6.17556 7.92826 6.35606 8 6.625 8C6.89394 8 7.07444 7.92826 7.1774 7.8721C7.2307 7.84303 7.26537 7.81682 7.28082 7.80417L7.28598 7.79986C7.66173 7.4162 8.2769 7.39726 8.67572 7.76285C9.08284 8.13604 9.11035 8.76861 8.73715 9.17572L8 8.5C8.73715 9.17572 8.73749 9.17536 8.73715 9.17572L8.73581 9.17718L8.73442 9.17869L8.73149 9.18185L8.72502 9.18875L8.70964 9.20473C8.69829 9.21633 8.68475 9.2298 8.66899 9.24484C8.63751 9.27489 8.59697 9.31144 8.5473 9.35208C8.44818 9.43318 8.31096 9.53197 8.1351 9.6279C7.77972 9.82174 7.27272 10 6.625 10C5.97728 10 5.47028 9.82174 5.1149 9.6279C4.93904 9.53197 4.80182 9.43318 4.7027 9.35208C4.65303 9.31144 4.61249 9.27489 4.58101 9.24484C4.56525 9.2298 4.55171 9.21633 4.54036 9.20473L4.52498 9.18875L4.51851 9.18185L4.51558 9.17869L4.51419 9.17718C4.51385 9.17682 4.51285 9.17572 5.25 8.5L4.51285 9.17572C4.13965 8.76861 4.16716 8.13604 4.57428 7.76285ZM12.714 7.79986C12.3383 7.4162 11.7231 7.39726 11.3243 7.76285C10.9172 8.13604 10.8897 8.76861 11.2628 9.17572L12 8.5C11.2628 9.17572 11.2625 9.17536 11.2628 9.17572L11.2642 9.17718L11.2656 9.17869L11.2685 9.18185L11.275 9.18875L11.2904 9.20473C11.3017 9.21633 11.3153 9.2298 11.331 9.24484C11.3625 9.27489 11.403 9.31144 11.4527 9.35208C11.5518 9.43318 11.689 9.53197 11.8649 9.6279C12.2203 9.82174 12.7273 10 13.375 10C14.0227 10 14.5297 9.82174 14.8851 9.6279C15.061 9.53197 15.1982 9.43318 15.2973 9.35208C15.347 9.31144 15.3875 9.27489 15.419 9.24484C15.4347 9.2298 15.4483 9.21633 15.4596 9.20473L15.475 9.18875L15.4815 9.18185L15.4844 9.17869L15.4858 9.17718C15.4861 9.17682 15.4872 9.17572 14.75 8.5L15.4872 9.17572C15.8603 8.76861 15.8328 8.13604 15.4257 7.76285C15.0269 7.39726 14.4117 7.4162 14.036 7.79986L14.0308 7.80417C14.0154 7.81682 13.9807 7.84303 13.9274 7.8721C13.8244 7.92826 13.6439 8 13.375 8C13.1061 8 12.9256 7.92826 12.8226 7.8721C12.7693 7.84303 12.7346 7.81682 12.7192 7.80417L12.714 7.79986ZM8.4334 12.5988C7.93568 12.3594 7.33816 12.5689 7.0988 13.0666C6.85944 13.5643 7.06888 14.1618 7.5666 14.4012C8.3665 14.7859 9.16786 15 10 15C10.8321 15 11.6335 14.7859 12.4334 14.4012C12.9311 14.1618 13.1406 13.5643 12.9012 13.0666C12.6618 12.5689 12.0643 12.3594 11.5666 12.5988C10.9803 12.8808 10.4747 13 10 13C9.52527 13 9.01975 12.8808 8.4334 12.5988Z" fill="currentColor"/></svg> },
              { label: "Great", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM8.96546 6.29915C9.52775 7.1802 9.25 8.62349 7.35225 10.1294C7.28437 10.1833 7.19388 10.1993 7.11168 10.1719C4.8133 9.40581 4.05866 8.14455 4.28569 7.12432C4.39592 6.62897 4.73978 6.22729 5.19611 6.04148C5.59788 5.87789 6.07025 5.88807 6.52176 6.12294C6.8657 5.74781 7.3061 5.57668 7.73959 5.593C8.23195 5.61153 8.69246 5.87138 8.96546 6.29915ZM12.8905 10.1719C15.1889 9.40588 15.9435 8.14462 15.7165 7.12439C15.6062 6.62905 15.2624 6.22737 14.806 6.04156C14.4043 5.87796 13.9319 5.88815 13.4804 6.12302C13.1365 5.74789 12.6961 5.57676 12.2626 5.59308C11.7702 5.61161 11.3097 5.87145 11.0367 6.29923C10.4744 7.18028 10.7522 8.62358 12.6499 10.1295C12.7178 10.1834 12.8083 10.1993 12.8905 10.1719ZM13.4483 12.053C13.7436 12.0267 14.0027 12.2591 13.9621 12.5527C13.693 14.5003 12.0216 16 10 16C7.97838 16 6.30705 14.5003 6.03787 12.5527C5.99729 12.2591 6.25642 12.0267 6.55166 12.053C8.86088 12.2588 11.1391 12.2588 13.4483 12.053Z" fill="currentColor"/></svg> },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setRating(opt.label)}
                className={cn(
                  "flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-2xl border bg-white py-3 transition-colors dark:bg-foreground/[0.03]",
                  rating === opt.label
                    ? "border-[#252525] dark:border-[#e5e5e5]"
                    : "border-border",
                )}
              >
                <span className="text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]">{opt.icon}</span>
                <span className="text-[14px] font-medium tracking-[-0.02em] text-page-text">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* What worked well? */}
        <div className="flex w-full flex-col gap-2">
          <span className={cn("text-[12px]", muted)}>What worked well?</span>
          <textarea
            placeholder="e.g. Great creator quality, fast turnaround"
            className="h-[58px] w-full resize-none rounded-[14px] bg-[rgba(37,37,37,0.04)] px-3.5 py-3 text-[14px] leading-[1.2] tracking-[-0.02em] text-[#252525] outline-none placeholder:text-[rgba(37,37,37,0.5)] dark:bg-[rgba(255,255,255,0.04)] dark:text-[#E0E0E0] dark:placeholder:text-[rgba(255,255,255,0.45)]"
          />
        </div>

        {/* What could be improved? */}
        <div className="flex w-full flex-col gap-2">
          <span className={cn("text-[12px]", muted)}>What could be improved?</span>
          <textarea
            placeholder="e.g. Great creator quality, fast turnaround"
            className="h-[58px] w-full resize-none rounded-[14px] bg-[rgba(37,37,37,0.04)] px-3.5 py-3 text-[14px] leading-[1.2] tracking-[-0.02em] text-[#252525] outline-none placeholder:text-[rgba(37,37,37,0.5)] dark:bg-[rgba(255,255,255,0.04)] dark:text-[#E0E0E0] dark:placeholder:text-[rgba(255,255,255,0.45)]"
          />
        </div>

        {/* Would you run another campaign? */}
        <div className="flex w-full flex-col gap-2">
          <span className={cn("text-[12px]", muted)}>Would you run another campaign?</span>
          <div className={cn("rounded-2xl bg-white p-5", cardBorder, cardShadow, "dark:bg-foreground/[0.03]")}>
            <SegmentedControl options={["Yes, definitely", "Maybe", "No"]} value={runAgain} onChange={setRunAgain} />
          </div>
        </div>

        {/* NPS */}
        <div className="flex w-full flex-col gap-2">
          <span className={cn("text-[12px]", muted)}>How likely are you to recommend Content Rewards?</span>
          <div className={cn("flex flex-col gap-2 rounded-2xl bg-white p-4 sm:p-5", cardBorder, cardShadow, "dark:bg-foreground/[0.03]")}>
            <div className="flex flex-wrap items-center gap-0.5 rounded-xl bg-[rgba(37,37,37,0.06)] p-0.5 dark:bg-card-bg">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setNps(i)}
                  className={cn(
                    "flex h-8 min-w-[28px] flex-1 cursor-pointer items-center justify-center rounded-[10px] text-[13px] font-medium tracking-[-0.02em] transition-colors sm:text-[14px]",
                    nps === i
                      ? "bg-white text-[#252525] shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[#222222] dark:text-page-text"
                      : "text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.5)]",
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex justify-between px-1">
              <span className="text-[10px] tracking-[-0.02em] text-page-text-muted">Not likely</span>
              <span className="text-[10px] tracking-[-0.02em] text-page-text-muted">Extremely likely</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-page-border px-4 pb-5 pt-4 sm:px-5">
        <button onClick={onBack} className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-[rgba(37,37,37,0.06)] px-4 text-[14px] font-medium text-[#252525] transition-colors hover:bg-[rgba(37,37,37,0.10)] dark:bg-foreground/[0.03] dark:text-page-text dark:hover:bg-foreground/[0.06]">
          Back
        </button>
        <button onClick={onSubmit} className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#252525] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#333] dark:bg-foreground dark:text-page-bg dark:hover:bg-foreground/80">
          Continue
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4 — Next Steps                                                */
/* ------------------------------------------------------------------ */

const NEXT_ACTIONS = [
  {
    title: "Top Up & Relaunch",
    description: "Add more budget and keep momentum",
    bg: "rgba(52,211,153,0.08)",
    color: "#34D399",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.8333 10.7277L8.33333 12.8527V14.3288L10.4287 13.0716C10.6798 12.921 10.8333 12.6497 10.8333 12.357V10.7277ZM6.66667 12.8125L3.82149 9.96731H2.30516C1.00967 9.96731 0.20948 8.55402 0.876004 7.44315L2.13325 5.34773C2.58506 4.59472 3.39883 4.13397 4.27698 4.13397H7.34556C9.44936 1.90884 11.834 0.274712 14.9285 0.00607794C15.9028 -0.0784934 16.7125 0.731202 16.6279 1.70544C16.3593 4.80002 14.7251 7.18462 12.5 9.28841V12.357C12.5 13.2351 12.0393 14.0489 11.2862 14.5007L9.19083 15.758C8.07995 16.4245 6.66667 15.6243 6.66667 14.3288V12.8125ZM5.9063 5.80064H4.27698C3.98427 5.80064 3.71301 5.95422 3.56241 6.20523L2.30516 8.30064H3.7813L5.9063 5.80064ZM0 14.134C0 12.7533 1.11929 11.634 2.5 11.634C3.88071 11.634 5 12.7533 5 14.134C5 15.5147 3.88071 16.634 2.5 16.634H0.833333C0.373096 16.634 0 16.2609 0 15.8006V14.134Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "Create similar campaign",
    description: "Launch a new campaign pre-filled with these settings",
    bg: "rgba(96,165,250,0.08)",
    color: "#60A5FA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3.96249 4.29938C3.87488 4.12417 3.62485 4.12417 3.53724 4.29938L2.9929 5.38805C2.9699 5.43406 2.9326 5.47136 2.88659 5.49437L1.79791 6.03871C1.6227 6.12631 1.6227 6.37635 1.79791 6.46395L2.88659 7.00829C2.9326 7.03129 2.9699 7.0686 2.9929 7.1146L3.53724 8.20328C3.62485 8.37849 3.87488 8.37849 3.96249 8.20328L4.50682 7.1146C4.52983 7.0686 4.56713 7.03129 4.61314 7.00829L5.70181 6.46395C5.87702 6.37635 5.87702 6.12631 5.70181 6.0387L4.61314 5.49437C4.56713 5.47136 4.52983 5.43406 4.50682 5.38806L3.96249 4.29938Z" fill="currentColor"/>
        <path d="M7.72023 1.80418C7.62942 1.62257 7.37025 1.62257 7.27945 1.80418L6.87949 2.60409C6.85565 2.65178 6.81698 2.69044 6.76929 2.71429L5.96938 3.11424C5.78777 3.20505 5.78777 3.46422 5.96938 3.55503L6.76929 3.95498C6.81698 3.97883 6.85565 4.01749 6.87949 4.06518L7.27945 4.86509C7.37025 5.04671 7.62942 5.04671 7.72023 4.86509L8.12019 4.06518C8.14403 4.01749 8.1827 3.97883 8.23038 3.95498L9.03029 3.55503C9.21191 3.46422 9.21191 3.20505 9.03029 3.11424L8.23038 2.71429C8.1827 2.69044 8.14403 2.65178 8.12019 2.60409L7.72023 1.80418Z" fill="currentColor"/>
        <path d="M15.6291 12.6327C15.5415 12.4575 15.2915 12.4575 15.2039 12.6327L14.6596 13.7214C14.6365 13.7674 14.5992 13.8047 14.5532 13.8277L13.4646 14.372C13.2894 14.4596 13.2894 14.7097 13.4646 14.7973L14.5532 15.3416C14.5992 15.3646 14.6365 15.4019 14.6596 15.4479L15.2039 16.5366C15.2915 16.7118 15.5415 16.7118 15.6291 16.5366L16.1735 15.4479C16.1965 15.4019 16.2338 15.3646 16.2798 15.3416L17.3684 14.7973C17.5436 14.7097 17.5436 14.4596 17.3684 14.372L16.2798 13.8277C16.2338 13.8047 16.1965 13.7674 16.1735 13.7214L15.6291 12.6327Z" fill="currentColor"/>
        <path d="M15.5178 3.50567C14.5415 2.52936 12.9585 2.52936 11.9822 3.50567L3.23223 12.2557C2.76339 12.7245 2.5 13.3604 2.5 14.0234V16.6664C2.5 17.1267 2.8731 17.4997 3.33333 17.4997H5.97631C6.63935 17.4997 7.27524 17.2364 7.74408 16.7675L16.4941 8.01752C17.4704 7.0412 17.4704 5.45829 16.4941 4.48198L15.5178 3.50567Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "Talk to account manager",
    description: "Personalized recommendations for your next campaign",
    bg: "rgba(192,132,252,0.1)",
    color: "#C084FC",
    icon: (
      <svg width="18" height="15" viewBox="0 0 18 15" fill="none">
        <path d="M8.75001 0C11.3039 0 13.4916 0.659673 15.0562 1.96409C16.639 3.28368 17.5 5.19456 17.5 7.5C17.5 9.80544 16.639 11.7163 15.0562 13.0359C13.4916 14.3403 11.3039 15 8.75001 15C7.40061 15 5.8812 14.8754 4.51313 14.2815C4.28054 14.4115 3.96028 14.5695 3.57997 14.7014C2.78729 14.9764 1.63253 15.1706 0.476601 14.623C0.249793 14.5156 0.0834838 14.3117 0.0238632 14.0679C-0.0357573 13.8241 0.0176643 13.5665 0.169287 13.3665C0.74295 12.6098 0.92373 12.0231 0.973794 11.6478C1.02198 11.2866 0.954523 11.0797 0.946704 11.0573L0.947251 11.0587C0.947251 11.0587 0.946757 11.0574 0.946023 11.0554L0.946704 11.0573C0.946704 11.0573 0.945826 11.0552 0.945079 11.0534L0.938683 11.0384L0.928034 11.0132C0.864214 10.8602 0.6384 10.3076 0.427163 9.64829C0.224451 9.01561 7.05314e-06 8.18041 7.05314e-06 7.5C7.05314e-06 5.19456 0.860976 3.28368 2.44382 1.96409C4.00846 0.659673 6.1961 0 8.75001 0Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: "View full campaign report",
    description: "Detailed analytics, creator breakdown, exportable data",
    bg: "rgba(251,113,133,0.08)",
    color: "#FB7185",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18.097 11.9773C18.2514 11.3432 18.3332 10.6808 18.3332 9.99922C18.3332 5.6781 15.0443 2.12514 10.8332 1.70703V9.4099L18.097 11.9773Z" fill="currentColor"/>
        <path d="M17.5416 13.5487L9.72214 10.7849C9.38914 10.6672 9.1665 10.3524 9.1665 9.99922V1.70703C4.9554 2.12513 1.6665 5.6781 1.6665 9.99922C1.6665 14.6016 5.39746 18.3326 9.99984 18.3326C13.3328 18.3326 16.2087 16.3759 17.5416 13.5487Z" fill="currentColor"/>
      </svg>
    ),
  },
];

function NextStepsStep({
  campaign,
  onBack,
  onClose,
}: {
  campaign: EndCampaignModalProps["campaign"];
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="flex flex-col items-center gap-6 overflow-y-auto px-4 pb-5 pt-[60px] sm:px-5"
        style={{ background: "radial-gradient(50% 53.47% at 50% 0%, rgba(0,153,77,0.24) 0%, rgba(0,153,77,0) 100%)", scrollbarWidth: "none" }}
      >
        {/* Check icon + title */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg, #F59E0B 0%, #F97316 100%)", boxShadow: "0px 0px 0px 2px var(--page-bg, #FFFFFF), inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 1px 0px rgba(255,255,255,0.36)" }}>
            <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white" />
            </svg>
          </div>
          <span className="campaign-completed-text text-[20px] font-medium tracking-[-0.02em] text-[#FB923C]">Campaign Completed</span>
        </div>

        <span className={cn("text-[14px] font-medium", muted)}>{campaign.title}</span>
        <StepDots current={2} total={3} />

        <span className={cn("text-[12px]", muted)}>Feedback saved. What would you like to do next?</span>

        {/* Action cards */}
        <div className="flex w-full flex-col gap-2">
          {NEXT_ACTIONS.map((action) => (
            <button
              key={action.title}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 text-left transition-colors hover:bg-[rgba(37,37,37,0.02)]",
                cardBorder,
                cardShadow,
                "dark:bg-foreground/[0.03] dark:hover:bg-[rgba(255,255,255,0.04)]",
              )}
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: action.bg, color: action.color }}
              >
                {action.icon}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-medium text-page-text">{action.title}</span>
                <span className={cn("text-[12px] leading-[150%]", muted)}>{action.description}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-muted">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-page-border px-4 pb-5 pt-4 sm:px-5">
        <button onClick={onBack} className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-[rgba(37,37,37,0.06)] px-4 text-[14px] font-medium text-[#252525] transition-colors hover:bg-[rgba(37,37,37,0.10)] dark:bg-foreground/[0.03] dark:text-page-text dark:hover:bg-foreground/[0.06]">
          Back
        </button>
        <button onClick={onClose} className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#252525] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#333] dark:bg-foreground dark:text-page-bg dark:hover:bg-foreground/80">
          Submit &amp; close
        </button>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Modal                                                         */
/* ------------------------------------------------------------------ */

export function EndCampaignModal({ open, onOpenChange, campaign }: EndCampaignModalProps) {
  const [step, setStep] = useState(0);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      // Delay reset so closing animation completes
      setTimeout(() => setStep(0), 200);
    }
  };

  const close = () => handleOpenChange(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-neutral-100/50 backdrop-blur-md dark:bg-black/60" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 flex-col",
            "rounded-[20px] border border-border",
            "bg-white shadow-xl",
            "max-h-[90dvh] tracking-[-0.02em]",
            "end-campaign-modal",
          )}
        >
          {/* Header */}
          <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-page-border">
            <span className="text-[14px] font-medium text-page-text">End Campaign</span>
            <DialogPrimitive.Close className="absolute right-3 top-1/2 -translate-y-1/2 flex size-7 cursor-pointer items-center justify-center rounded-full text-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.06)] hover:text-[#252525] dark:text-[rgba(255,255,255,0.45)] dark:hover:bg-[rgba(255,255,255,0.06)] dark:hover:text-[#e5e5e5]">
              <IconX size={14} stroke={2} />
            </DialogPrimitive.Close>
          </div>

          {/* Steps */}
          {step === 0 && (
            <ConfirmStep
              campaign={campaign}
              onCancel={close}
              onConfirm={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <CompletedStep
              campaign={campaign}
              onCancel={close}
              onContinue={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <FeedbackStep
              campaign={campaign}
              onBack={() => setStep(1)}
              onSubmit={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <NextStepsStep
              campaign={campaign}
              onBack={() => setStep(2)}
              onClose={close}
            />
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
