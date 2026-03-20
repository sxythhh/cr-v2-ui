"use client";

import type { ConfigurationData, DetailsData } from "@/types/campaign-flow.types";
import { SectionCard } from "./shared";

export function PreviewStep({ configuration, details }: { configuration: ConfigurationData; details: DetailsData }) {
  return (
    <div className="flex flex-col gap-2">
      <SectionCard>
        <h2 className="text-base font-medium tracking-[-0.02em] text-page-text">Preview</h2>
      </SectionCard>

      <SectionCard>
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-page-text">{details.name || "Untitled Campaign"}</h3>
        {details.description && <p className="text-sm tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.6)]">{details.description}</p>}
        <div className="flex flex-col gap-2 text-sm tracking-[-0.02em]">
          <div className="flex justify-between"><span className="text-page-text-muted">Platforms</span><span className="font-medium text-page-text">{configuration.selectedPlatforms.join(", ") || "None"}</span></div>
          <div className="flex justify-between"><span className="text-page-text-muted">Budget</span><span className="font-medium text-page-text">{configuration.budget ? `$${configuration.budget}` : "--"}</span></div>
          <div className="flex justify-between"><span className="text-page-text-muted">Rate</span><span className="font-medium text-page-text">{configuration.rewardPer1000Views ? `$${configuration.rewardPer1000Views}` : "--"}</span></div>
        </div>
      </SectionCard>
    </div>
  );
}
