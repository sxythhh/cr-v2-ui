"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CampaignModel, ConfigurationData, Platform } from "@/types/campaign-flow.types";
import { CpmPerVideoConfiguration, RetainerConfiguration } from "./configuration-parts";

// ── Icons ──────────────────────────────────────────────────────────

function PublicUsersIcon() {
  return (
    <svg width="19" height="15" viewBox="0 0 19 15" fill="none">
      <path d="M2.2583 3.33333C2.2583 1.49238 3.75068 0 5.59163 0C7.43258 0 8.92497 1.49238 8.92497 3.33333C8.92497 5.17428 7.43258 6.66667 5.59163 6.66667C3.75068 6.66667 2.2583 5.17428 2.2583 3.33333Z" fill="currentColor" />
      <path d="M9.7583 3.33333C9.7583 1.49238 11.2507 0 13.0916 0C14.9326 0 16.425 1.49238 16.425 3.33333C16.425 5.17428 14.9326 6.66667 13.0916 6.66667C11.2507 6.66667 9.7583 5.17428 9.7583 3.33333Z" fill="currentColor" />
      <path d="M5.59142 7.5C7.98373 7.5 10.253 9.15054 11.0976 12.1779C11.5392 13.7609 10.1891 15 8.80313 15H2.37971C0.99374 15 -0.356352 13.7609 0.0852618 12.1779C0.92985 9.15054 3.1991 7.5 5.59142 7.5Z" fill="currentColor" />
      <path d="M12.7036 11.7301C12.2971 10.273 11.5982 9.04047 10.6999 8.08508C11.4461 7.69884 12.2617 7.5 13.092 7.5C15.4843 7.5 17.7536 9.15054 18.5982 12.1779C19.0398 13.7609 17.6897 15 16.3037 15H12.1172C12.7573 14.1291 13.0495 12.9701 12.7036 11.7301Z" fill="currentColor" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="12" height="17" viewBox="0 0 12 17" fill="none">
      <path d="M7.5 0C5.19881 0 3.33333 1.86548 3.33333 4.16667V10.8333C3.33333 12.214 4.45262 13.3333 5.83333 13.3333C7.21405 13.3333 8.33333 12.214 8.33333 10.8333V4.16667C8.33333 3.70643 7.96024 3.33333 7.5 3.33333C7.03976 3.33333 6.66667 3.70643 6.66667 4.16667V10.8333C6.66667 11.2936 6.29357 11.6667 5.83333 11.6667C5.3731 11.6667 5 11.2936 5 10.8333V4.16667C5 2.78595 6.11929 1.66667 7.5 1.66667C8.88071 1.66667 10 2.78595 10 4.16667V10.8333C10 13.1345 8.13452 15 5.83333 15C3.53215 15 1.66667 13.1345 1.66667 10.8333V7.5C1.66667 7.03976 1.29357 6.66667 0.833333 6.66667C0.373096 6.66667 0 7.03976 0 7.5V10.8333C0 14.055 2.61167 16.6667 5.83333 16.6667C9.05499 16.6667 11.6667 14.055 11.6667 10.8333V4.16667C11.6667 1.86548 9.80119 0 7.5 0Z" fill="currentColor" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.66667 0C4.36548 0 2.5 1.86548 2.5 4.16667V5.83333C1.11929 5.83333 0 6.95262 0 8.33333V14.1667C0 15.5474 1.11929 16.6667 2.5 16.6667H10.8333C12.214 16.6667 13.3333 15.5474 13.3333 14.1667V8.33333C13.3333 6.95262 12.214 5.83333 10.8333 5.83333V4.16667C10.8333 1.86548 8.96785 0 6.66667 0ZM9.16667 5.83333V4.16667C9.16667 2.78595 8.04738 1.66667 6.66667 1.66667C5.28595 1.66667 4.16667 2.78595 4.16667 4.16667V5.83333H9.16667ZM6.66667 9.16667C7.1269 9.16667 7.5 9.53976 7.5 10V12.5C7.5 12.9602 7.1269 13.3333 6.66667 13.3333C6.20643 13.3333 5.83333 12.9602 5.83333 12.5V10C5.83333 9.53976 6.20643 9.16667 6.66667 9.16667Z" fill="currentColor" />
    </svg>
  );
}

function WhiteLabelIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M0.593744 8.43343C-0.197916 7.64177 -0.197914 6.35823 0.593746 5.56657L5.56657 0.593744C6.35823 -0.197916 7.64177 -0.197914 8.43343 0.593746L13.4063 5.56657C14.1979 6.35823 14.1979 7.64177 13.4063 8.43343L8.43343 13.4063C7.64177 14.1979 6.35823 14.1979 5.56657 13.4063L0.593744 8.43343Z" fill="currentColor" />
    </svg>
  );
}

function CoBrandedIcon() {
  return (
    <svg width="19" height="14" viewBox="0 0 19 14" fill="none">
      <path d="M10.4719 0.336706C11.2591 -0.186135 12.3316 -0.0998597 13.0256 0.594057L17.9984 5.56687C18.79 6.35847 18.7899 7.64171 17.9984 8.43336L13.0256 13.4062C12.3314 14.1004 11.2592 14.1859 10.4719 13.6625L15.7021 8.43336C16.4935 7.64176 16.4935 6.35848 15.7021 5.56687L10.4719 0.336706Z" fill="currentColor" />
      <path d="M0.593733 8.43353C-0.197912 7.64189 -0.197911 6.35838 0.593735 5.56673L5.56647 0.594C6.35811 -0.197645 7.64162 -0.197643 8.43327 0.594002L13.406 5.56673C14.1976 6.35838 14.1976 7.64189 13.406 8.43353L8.43327 13.4063C7.64162 14.1979 6.35811 14.1979 5.56647 13.4063L0.593733 8.43353Z" fill="currentColor" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Section helpers ────────────────────────────────────────────────

function SectionLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
      <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>
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

function RadioCard({
  selected,
  onClick,
  icon,
  title,
  description,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
        selected
          ? "border-[rgba(255,144,37,0.3)]"
          : "border-foreground/[0.06] bg-card-bg hover:bg-foreground/[0.02]",
      )}
      style={selected ? {
        background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--card-bg)",
      } : undefined}
    >
      {/* Icon */}
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.25px] border-foreground/[0.06] bg-white shadow-[0px_1.25px_2.5px_rgba(0,0,0,0.03)] dark:bg-white/10">
        <span className={selected ? "text-[#252525] dark:text-white" : "text-page-text-muted"}>{icon}</span>
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
          {badge}
        </div>
        <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>
      </div>

      {/* Radio */}
      <div className="flex shrink-0 items-center justify-center">
        {selected ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.5805 9.9749C15.8428 9.6543 15.7955 9.18183 15.4749 8.91953C15.1543 8.65723 14.6818 8.70461 14.4195 9.02513L10.4443 13.8837L9.03033 12.4697C8.73744 12.1768 8.26256 12.1768 7.96967 12.4697C7.67678 12.7626 7.67678 13.2374 7.96967 13.5303L9.96967 15.5303C10.1195 15.6802 10.3257 15.7596 10.5374 15.7491C10.749 15.7385 10.9463 15.6389 11.0805 15.4749L15.5805 9.9749Z" fill="#FF9025" />
            <circle cx="12" cy="12" r="9.5" stroke="#FF9025" strokeOpacity="0.15" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="var(--card-bg)" />
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.1" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ── Toggle switch ──────────────────────────────────────────────────

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
        on ? "bg-[#252525] dark:bg-white" : "bg-foreground/[0.12]",
      )}
    >
      <div
        className={cn(
          "size-4 rounded-full bg-white dark:bg-[#111111] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] transition-transform",
          on ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────

export function ConfigurationStep({ data, onChange, model = "cpm" }: { data: ConfigurationData; onChange: (data: ConfigurationData) => void; model?: CampaignModel }) {
  const [accessType, setAccessType] = useState<"open" | "application" | "private">(
    data.requireApplication ? "application" : "open"
  );
  const [branding, setBranding] = useState<"white-label" | "co-branded">("white-label");
  const [noEarningsCap, setNoEarningsCap] = useState(false);
  const [template, setTemplate] = useState("scratch");

  const update = (partial: Partial<ConfigurationData>) => onChange({ ...data, ...partial });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Select template */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Select template" description="Start from a pre-built campaign structure or build from scratch." />
        <Card>
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Select template</span>
            <div className="relative">
              <select value={template} onChange={(e) => setTemplate(e.target.value)} className="flex h-10 w-full cursor-pointer appearance-none items-center rounded-[14px] bg-foreground/[0.04] px-3.5 pr-8 font-inter text-sm tracking-[-0.02em] text-page-text outline-none">
                <option value="scratch">Start from scratch</option>
                <option value="ugc">UGC Campaign</option>
                <option value="ambassador">Brand Ambassador</option>
                <option value="product-review">Product Review</option>
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"><ChevronDownIcon /></div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Access type */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Access type" description="Choose how creators can join." />
        <Card className="flex flex-col gap-2 p-5">
          <RadioCard
            selected={accessType === "open"}
            onClick={() => { setAccessType("open"); update({ requireApplication: false }); }}
            icon={<PublicUsersIcon />}
            title="Open to public"
            description="Anyone can join the retainer program."
          />
          <RadioCard
            selected={accessType === "application"}
            onClick={() => { setAccessType("application"); update({ requireApplication: true }); }}
            icon={<PaperclipIcon />}
            title="Application only"
            description="Creators must apply and be approved."
          />
          <RadioCard
            selected={accessType === "private"}
            onClick={() => { setAccessType("private"); update({ requireApplication: true }); }}
            icon={<LockIcon />}
            title="Private/invite only"
            description="Hidden from discover. Only invited clippers can see and submit."
          />
        </Card>
      </div>

      {/* 3. Agency branding */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Agency branding" description="Choose how your agency appears to creators on this campaign." />
        <Card className="flex flex-col gap-2 p-5">
          <RadioCard
            selected={branding === "white-label"}
            onClick={() => setBranding("white-label")}
            icon={<WhiteLabelIcon />}
            title="White label"
            description="Run as the brand. Creators only see the brand name."
            badge={
              <span className="inline-flex items-center rounded-full bg-[rgba(0,153,77,0.08)] px-1.5 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-[#00994D]">
                Recommended
              </span>
            }
          />
          <RadioCard
            selected={branding === "co-branded"}
            onClick={() => setBranding("co-branded")}
            icon={<CoBrandedIcon />}
            title="Co-branded"
            description="Show your agency alongside the brand."
          />
        </Card>
      </div>

      {/* 4. Pricing — model-specific */}
      {model === "cpm" ? (
        <div className="flex flex-col gap-2">
          <SectionLabel title="Pricing" description="Set your CPM rate and total campaign budget." />
          <Card>
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Rate per 1,000 views</span>
                <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text">$</span>
                  <input type="text" inputMode="numeric" value={data.rewardPer1000Views} onChange={(e) => update({ rewardPer1000Views: e.target.value.replace(/[^\d.,]/g, "") })} placeholder="2" className="w-full bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Total budget</span>
                <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text">$</span>
                  <input type="text" inputMode="numeric" value={data.budget} onChange={(e) => update({ budget: e.target.value.replace(/[^\d.,]/g, "") })} placeholder="5,000" className="w-full bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : model === "per-video" ? (
        <div className="flex flex-col gap-2">
          <SectionLabel title="Flat rate pricing" description="Set a fixed payout per delivered video and the maximum number of posts per creator." />
          <Card>
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Rate per post</span>
                <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text">$</span>
                  <input type="text" inputMode="numeric" value={data.rewardPer1000Views} onChange={(e) => update({ rewardPer1000Views: e.target.value.replace(/[^\d.,]/g, "") })} placeholder="0" className="w-full bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Max posts per creator</span>
                <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <input type="text" inputMode="numeric" value={data.maxPayout} onChange={(e) => update({ maxPayout: e.target.value.replace(/[^\d]/g, "") })} placeholder="0" className="w-full bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Retainer: Rate and contract length */
        <div className="flex flex-col gap-2">
          <SectionLabel title="Rate and contract length" />
          <Card>
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Rate</span>
                <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text">$</span>
                  <input type="text" inputMode="numeric" value={data.rewardPer1000Views} onChange={(e) => update({ rewardPer1000Views: e.target.value.replace(/[^\d.,]/g, "") })} placeholder="0" className="w-full bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Contract length</span>
                <div className="relative">
                  <select value={data.contractLength} onChange={(e) => update({ contractLength: e.target.value })} className="flex h-10 w-full cursor-pointer appearance-none items-center rounded-[14px] bg-foreground/[0.04] px-3.5 pr-8 font-inter text-sm tracking-[-0.02em] text-page-text outline-none">
                    <option value="1">1 month</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                  <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"><ChevronDownIcon /></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Retainer/per-video: Payout frequency */}
      {model !== "cpm" && (
        <div className="flex flex-col gap-2">
          <SectionLabel title="Payout frequency" description="How often creators receive their earnings." />
          <Card>
            <div className="flex items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5">
              {(["monthly", "weekly"] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => update({ payoutFrequency: freq })}
                  className={cn(
                    "flex h-8 flex-1 items-center justify-center rounded-[10px] font-inter text-sm font-medium tracking-[-0.02em] transition-all capitalize",
                    data.payoutFrequency === freq
                      ? "bg-white text-page-text shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-white/10"
                      : "text-page-text-subtle",
                  )}
                >
                  {freq}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Retainer/per-video: Creator spots */}
      {model !== "cpm" && (
        <div className="flex flex-col gap-2">
          <SectionLabel title="Creator spots" description="Set how many creators can join this campaign." />
          <Card className="flex flex-col gap-4 p-5">
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Total spots</span>
                <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <input type="text" defaultValue="60" className="w-full bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Already filled (if any)</span>
                <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <input type="text" defaultValue="0" className="w-full bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none" />
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-between rounded-2xl border px-4 py-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] border-[rgba(255,144,37,0.3)]"
              style={{ background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--card-bg)" }}
            >
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Show available spots to creators</span>
              <ToggleSwitch on={true} onToggle={() => {}} />
            </div>
          </Card>
        </div>
      )}

      {/* Retainer/per-video: Posts amount */}
      {model !== "cpm" && (
        <div className="flex flex-col gap-2">
          <SectionLabel title="Posts amount" description="Set a minimum number of posts per creator." />
          <Card className="flex flex-col gap-4 p-5">
            {/* Toggle */}
            <div
              onClick={() => update({ expectedPostsEnabled: !data.expectedPostsEnabled })}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
                data.expectedPostsEnabled ? "border-[rgba(255,144,37,0.3)]" : "border-foreground/[0.06] bg-card-bg",
              )}
              style={data.expectedPostsEnabled ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--card-bg)" } : undefined}
            >
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Expected amount of posts</span>
              <ToggleSwitch on={data.expectedPostsEnabled} onToggle={() => update({ expectedPostsEnabled: !data.expectedPostsEnabled })} />
            </div>

            {/* Slider — shown when enabled */}
            {data.expectedPostsEnabled && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">Amount of posts per creator</span>
                  <div className="flex h-8 items-center gap-0.5 rounded-[10px] bg-foreground/[0.04] px-3.5">
                    <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{data.expectedPostsPerMonth}</span>
                    <span className="font-inter text-xs tracking-[-0.02em] text-page-text">/mo</span>
                  </div>
                </div>
                {/* Progress bar with handle */}
                <div className="relative h-4 flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={parseInt(data.expectedPostsPerMonth) || 20}
                    onChange={(e) => update({ expectedPostsPerMonth: e.target.value })}
                    className="absolute inset-0 z-10 w-full cursor-pointer appearance-none bg-transparent opacity-0"
                  />
                  {/* Track bg */}
                  <div className="absolute left-0 right-0 h-1 rounded-full bg-foreground/[0.06]" />
                  {/* Track fill */}
                  <div className="absolute left-0 h-1 rounded-full bg-foreground" style={{ width: `${((parseInt(data.expectedPostsPerMonth) || 20) / 50) * 100}%` }} />
                  {/* Handle */}
                  <div
                    className="absolute size-3.5 rounded-full border-2 border-white bg-foreground shadow-sm"
                    style={{ left: `calc(${((parseInt(data.expectedPostsPerMonth) || 20) / 50) * 100}% - 7px)` }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 5. Creator earnings cap */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Creator earnings cap" description="Set a maximum amount a single creator can earn, or allow unlimited earnings." />
        <div
          className={cn(
            "flex w-full flex-col gap-3 rounded-2xl border p-4 transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
            noEarningsCap ? "border-[rgba(255,144,37,0.3)]" : "border-foreground/[0.06] bg-card-bg",
          )}
          style={noEarningsCap ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--card-bg)" } : undefined}
        >
          <div className="flex cursor-pointer items-center gap-3" onClick={() => setNoEarningsCap((v) => !v)}>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Add limit</span>
              <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">Cap the maximum a single creator can earn from this campaign.</span>
            </div>
            <ToggleSwitch on={noEarningsCap} onToggle={() => setNoEarningsCap((v) => !v)} />
          </div>
          {noEarningsCap && (() => {
            const val = parseInt(data.maxPayout.replace(/[^\d]/g, "")) || 0;
            const hasError = data.maxPayout.length > 0 && val < 50;
            return (
              <div className="flex flex-col gap-1.5">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Maximum earnings per creator</span>
                <div className={cn(
                  "flex h-10 items-center gap-1.5 rounded-[14px] px-3.5 transition-colors",
                  hasError ? "bg-[rgba(255,37,37,0.04)] ring-1 ring-[#FF2525]/30" : "bg-foreground/[0.04]",
                )}>
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text">$</span>
                  <input
                    type="text"
                    value={data.maxPayout}
                    onChange={(e) => update({ maxPayout: e.target.value })}
                    placeholder="500"
                    className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {hasError && (
                  <span className="font-inter text-xs tracking-[-0.02em] text-[#FF2525]">
                    Minimum cap is $50
                  </span>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
