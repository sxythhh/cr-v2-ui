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

function SectionLabel({ title, description }: { title: string; description: string }) {
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
        background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), #FFFFFF",
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
          <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
            <g filter="url(#filter0_dddi_sel)">
              <path fillRule="evenodd" clipRule="evenodd" d="M13 4C7.47715 4 3 8.47715 3 14C3 19.5228 7.47715 24 13 24C18.5228 24 23 19.5228 23 14C23 8.47715 18.5228 4 13 4ZM16.5805 11.9749C16.8428 11.6543 16.7955 11.1818 16.4749 10.9195C16.1543 10.6572 15.6818 10.7045 15.4195 11.0251L11.4443 15.8837L10.0303 14.4697C9.73744 14.1768 9.26256 14.1768 8.96967 14.4697C8.67678 14.7626 8.67678 15.2374 8.96967 15.5303L10.9697 17.5303C11.1195 17.6802 11.3257 17.7596 11.5374 17.7491C11.749 17.7385 11.9463 17.6389 12.0805 17.4749L16.5805 11.9749Z" fill="#FF9025" />
            </g>
            <defs>
              <filter id="filter0_dddi_sel" x="0" y="0" width="26" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="2" /><feGaussianBlur stdDeviation="1" /><feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="-1" /><feGaussianBlur stdDeviation="1.5" /><feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                <feBlend mode="normal" in2="effect1" result="effect2" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect2" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="0.5" /><feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend mode="normal" in2="shape" result="effect3" />
              </filter>
            </defs>
          </svg>
        ) : (
          <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
            <g filter="url(#filter0_dddi_unsel)">
              <circle cx="13" cy="14" r="10" fill="white" />
              <circle cx="13" cy="14" r="9.5" stroke="#252525" strokeOpacity="0.1" />
            </g>
            <defs>
              <filter id="filter0_dddi_unsel" x="0" y="0" width="26" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="2" /><feGaussianBlur stdDeviation="1" /><feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="-1" /><feGaussianBlur stdDeviation="1.5" /><feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                <feBlend mode="normal" in2="effect1" result="effect2" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect2" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="0.5" /><feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend mode="normal" in2="shape" result="effect3" />
              </filter>
            </defs>
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
        on ? "bg-foreground" : "bg-foreground/[0.12]",
      )}
    >
      <div
        className={cn(
          "size-4 rounded-full bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.12)] transition-transform",
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

  const update = (partial: Partial<ConfigurationData>) => onChange({ ...data, ...partial });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Select template */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Select template" description="Start from a pre-built campaign structure or build from scratch." />
        <Card>
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Select template</span>
            <div className="flex h-10 items-center justify-between rounded-[14px] bg-foreground/[0.04] px-3.5">
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text">Start from scratch</span>
              <ChevronDownIcon />
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

      {/* 4. Pricing */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Pricing" description="Set your CPM rate and total campaign budget." />
        <Card>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Rate per 1,000 views</span>
              <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                <span className="font-inter text-sm tracking-[-0.02em] text-page-text">$</span>
                <input
                  type="text"
                  value={data.rewardPer1000Views}
                  onChange={(e) => update({ rewardPer1000Views: e.target.value })}
                  placeholder="2"
                  className="w-full bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Total budget</span>
              <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                <span className="font-inter text-sm tracking-[-0.02em] text-page-text">$</span>
                <input
                  type="text"
                  value={data.budget}
                  onChange={(e) => update({ budget: e.target.value })}
                  placeholder="5,000"
                  className="w-full bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 5. Creator earnings cap */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Creator earnings cap" description="Set a maximum amount a single creator can earn, or allow unlimited earnings." />
        <div
          onClick={() => setNoEarningsCap((v) => !v)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors",
            noEarningsCap
              ? "border-[rgba(255,144,37,0.3)] shadow-[0px_1px_2px_rgba(0,0,0,0.03)]"
              : "border-foreground/[0.06] bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
          )}
          style={noEarningsCap ? {
            background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), #FFFFFF",
          } : undefined}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">No limit</span>
            <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">Creators can earn unlimited from this campaign.</span>
          </div>
          <ToggleSwitch on={noEarningsCap} onToggle={() => setNoEarningsCap((v) => !v)} />
        </div>
      </div>
    </div>
  );
}
