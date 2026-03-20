"use client";

import { formatCurrency as formatCurrencyBase } from "@/lib/formatting";
import type { CampaignModel } from "@/types/campaign-flow.types";
import { SectionCard } from "./steps/shared";

function formatValue(val: string) {
  const num = Number.parseFloat(val);
  if (Number.isNaN(num) || num === 0) return "--";
  return formatCurrencyBase(num);
}

const MODEL_SUMMARY_LABELS: Record<CampaignModel, { title: string; rateLabel: string }> = {
  cpm: { rateLabel: "Rate per 1,000 views", title: "CPM Summary" },
  "per-video": { rateLabel: "Fee per post", title: "Per Post Summary" },
  retainer: { rateLabel: "Monthly retainer", title: "Retainer Summary" },
};

export function CpmSummary({ rate, budget, accessType, model = "cpm" }: { rate: string; budget: string; accessType: string; model?: CampaignModel }) {
  const labels = MODEL_SUMMARY_LABELS[model];
  return (
    <SectionCard>
      <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{labels.title}</span>
      <div className="flex flex-col gap-2 text-sm tracking-[-0.02em]">
        <div className="flex justify-between"><span className="text-page-text-muted">{labels.rateLabel}</span><span className="font-medium text-page-text">{formatValue(rate)}</span></div>
        <div className="flex justify-between"><span className="text-page-text-muted">Total Budget</span><span className="font-medium text-page-text">{formatValue(budget)}</span></div>
        <div className="flex justify-between"><span className="text-page-text-muted">Access Type</span><span className="font-medium text-page-text">{accessType === "application" ? "Application Only" : "Open to Public"}</span></div>
      </div>
    </SectionCard>
  );
}
