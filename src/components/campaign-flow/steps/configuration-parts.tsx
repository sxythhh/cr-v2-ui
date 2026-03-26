"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Switch } from "@/components/ui/switch";
import type { CampaignModel, ConfigurationData, Platform } from "@/types/campaign-flow.types";
import { CpmSummary } from "../CpmSummary";
import { PlatformButton, PlatformIcon } from "../PlatformButton";
import { SectionCard, SectionHeading, SegmentedControl, Field, INPUT_CLASS } from "./shared";

const PLATFORMS: Platform[] = ["tiktok", "instagram", "youtube", "x"];

const MODEL_LABELS: Record<CampaignModel, { rateLabel: string; toggleLabel: string; budgetHint: string }> = {
  cpm: { budgetHint: "Clear oversight on the minimum amount of views you\u2019ll receive", rateLabel: "Rate per 1,000 views", toggleLabel: "Set the same rate for each platform" },
  "per-video": { budgetHint: "Total budget allocated for all posts in this campaign", rateLabel: "Fee per post", toggleLabel: "Set the same fee for each platform" },
  retainer: { budgetHint: "Total budget allocated across all retainer contracts", rateLabel: "Monthly retainer amount", toggleLabel: "Set the same rate for each platform" },
};

const CONTRACT_LENGTHS = [
  { label: "3 months", value: "3" },
  { label: "6 months", value: "6" },
  { label: "12 months", value: "12" },
];

export function RetainerConfiguration({ data, update, togglePlatform }: { data: ConfigurationData; update: (partial: Partial<ConfigurationData>) => void; togglePlatform: (p: Platform) => void }) {
  const postsPerMonth = data.expectedPostsPerMonth ?? "20";
  const postsValue = Number.parseInt(postsPerMonth, 10) || 1;

  return (
    <>
      {/* Rate and contract length */}
      <SectionCard>
        <SectionHeading title="Rate and contract length" />
        <div className="flex gap-3">
          <Field label="Rate" className="flex-1">
            <CurrencyInput onChange={(v) => update({ rewardPer1000Views: v })} placeholder="0" value={data.rewardPer1000Views} />
          </Field>
          <Field label="Contract length" className="flex-1">
            <div className="relative">
              <select className={`${INPUT_CLASS} appearance-none pr-8 cursor-pointer`} onChange={(e) => update({ contractLength: e.target.value })} value={data.contractLength}>
                {CONTRACT_LENGTHS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-page-text-muted" size={12} />
            </div>
          </Field>
        </div>
      </SectionCard>

      {/* Payout frequency */}
      <SectionCard>
        <SectionHeading title="Payout frequency" description="How often creators receive their earnings." />
        <SegmentedControl
          value={data.payoutFrequency}
          onChange={(v) => update({ payoutFrequency: v as "monthly" | "weekly" })}
          options={[
            { label: "Monthly", value: "monthly" },
            { label: "Weekly", value: "weekly" },
          ]}
        />
      </SectionCard>

      {/* Posts amount */}
      <SectionCard>
        <SectionHeading title="Posts amount" description="Set a minimum number of posts per creator" />
        <div className="flex items-center justify-between bg-card-bg border border-border shadow-[0px_1px_2px_rgba(0,0,0,0.03)] rounded-[14px] px-4 py-3 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
          <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Expected amount of posts</span>
          <Switch checked={data.expectedPostsEnabled} onCheckedChange={(v) => update({ expectedPostsEnabled: v })} />
        </div>
      </SectionCard>

      {/* Platform selection */}
      <SectionCard>
        <SectionHeading title="Select platforms" description="Choose which platforms this campaign accepts content from." />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-normal tracking-[-0.02em] text-page-text-muted">Select platforms</span>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (<PlatformButton key={p} onClick={() => togglePlatform(p)} platform={p} selected={data.selectedPlatforms.includes(p)} />))}
          </div>
        </div>
      </SectionCard>
    </>
  );
}

export function CpmPerVideoConfiguration({ data, model, platformRewards, update, updatePlatformReward, togglePlatform }: { data: ConfigurationData; model: CampaignModel; platformRewards: Record<string, string>; update: (partial: Partial<ConfigurationData>) => void; updatePlatformReward: (platform: string, value: string) => void; togglePlatform: (p: Platform) => void }) {
  const labels = MODEL_LABELS[model];
  return (
    <>
      {/* Rate and contract */}
      <SectionCard>
        <SectionHeading title="Rate and contract length" />
        <div className="flex gap-3">
          <Field label={labels.rateLabel} className="flex-1">
            {data.perPlatform ? (
              <CurrencyInput onChange={(v) => update({ rewardPer1000Views: v })} placeholder="0" value={data.rewardPer1000Views} />
            ) : (
              <PlatformRateInputs onRewardChange={updatePlatformReward} platforms={data.selectedPlatforms} rewards={platformRewards} />
            )}
          </Field>
          <Field label="Total budget" className="flex-1">
            <CurrencyInput onChange={(v) => update({ budget: v })} placeholder="0" value={data.budget} />
          </Field>
        </div>
        {/* Projected views — only for CPM */}
        {model === "cpm" && <ProjectedViewsBar rate={data.rewardPer1000Views} budget={data.budget} />}
        <div className="flex items-center gap-2">
          <Switch checked={data.perPlatform} onCheckedChange={(v) => update({ perPlatform: v })} />
          <span className="text-xs tracking-[-0.02em] text-page-text-muted">{labels.toggleLabel}</span>
        </div>
      </SectionCard>

      {/* Platform selection */}
      <SectionCard>
        <SectionHeading title="Select platforms" description="Choose which platforms this campaign accepts content from." />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-normal tracking-[-0.02em] text-page-text-muted">Select platforms</span>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (<PlatformButton key={p} onClick={() => togglePlatform(p)} platform={p} selected={data.selectedPlatforms.includes(p)} />))}
          </div>
        </div>
      </SectionCard>
    </>
  );
}

function formatCompactViews(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return num.toFixed(0);
}

export function ProjectedViewsBar({ rate, budget }: { rate: string; budget: string }) {
  const rateNum = Number.parseFloat(rate) || 0;
  const budgetNum = Number.parseFloat(budget) || 0;
  const projectedViews = rateNum > 0 ? (budgetNum / rateNum) * 1000 : 0;
  const display = projectedViews > 0 ? formatCompactViews(projectedViews) : "--";

  return (
    <div className="relative mt-4 h-10">
      {/* Pink/magenta blurred rectangle */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[14px]"
        style={{
          opacity: 0.3,
          filter: "blur(2px)",
          background: "linear-gradient(95.54deg, rgba(255,63,213,0) 0%, #FF3FD5 25%, rgba(255,63,213,0) 50%, #FF3FD5 75%, rgba(255,63,213,0) 100%)",
        }}
      />
      {/* Orange blurred rectangle */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[14px]"
        style={{
          opacity: 0.3,
          filter: "blur(0.5px)",
          transform: "matrix(-1, 0, 0, 1, 0, 0)",
          background: "linear-gradient(95.54deg, rgba(255,144,37,0) 0%, #FF9025 25%, rgba(255,144,37,0) 50%, #FF9025 75%, rgba(255,144,37,0) 100%)",
        }}
      />
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-between gap-1.5 rounded-[14px] border border-[rgba(37,37,37,0.06)] bg-white px-3 dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
        <span className="font-inter text-sm tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">Projected views</span>
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">{display}</span>
      </div>
    </div>
  );
}

function PlatformRateInputs({ platforms, rewards, onRewardChange }: { platforms: Platform[]; rewards: Record<string, string>; onRewardChange: (platform: string, value: string) => void }) {
  if (platforms.length === 0) return <span className="text-xs tracking-[-0.02em] text-page-text-muted">Select platforms first</span>;
  return (
    <div className="flex flex-col gap-2">
      {platforms.map((p) => (
        <div className="flex items-center gap-1.5 h-10 px-3.5 bg-[rgba(37,37,37,0.04)] dark:bg-[rgba(255,255,255,0.06)] rounded-[14px]" key={p}>
          <PlatformIcon platform={p} size={14} />
          <span className="text-sm text-page-text">$</span>
          <input className="flex-1 min-w-0 bg-transparent text-sm tracking-[-0.02em] text-page-text placeholder:text-[rgba(37,37,37,0.4)] dark:placeholder:text-[rgba(255,255,255,0.4)] outline-none" inputMode="decimal" onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d*$/.test(v)) onRewardChange(p, v); }} placeholder="0" type="text" value={rewards[p] ?? ""} />
        </div>
      ))}
    </div>
  );
}
