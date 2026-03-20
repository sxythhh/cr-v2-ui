"use client";

import type { CampaignModel, ConfigurationData, Platform } from "@/types/campaign-flow.types";
import { CpmPerVideoConfiguration, RetainerConfiguration } from "./configuration-parts";
import { SectionCard, SectionHeading, SegmentedControl } from "./shared";

function GlobeIcon() {
  return <svg width="16" height="16" viewBox="0 0 17 17" fill="none"><path d="M1.07e-07 7.51H4.15c.07-2.12.46-4.05 1.08-5.51.34-.8.76-1.49 1.26-1.98L6.51 0C2.97.78.27 3.81 1.07e-07 7.51Z" fill="currentColor"/><path d="M0 8.76c.27 3.7 2.97 6.73 6.51 7.51l-.01-.02c-.5-.5-.92-1.18-1.26-1.98-.62-1.46-1.01-3.39-1.08-5.51H0Z" fill="currentColor"/><path d="M10.11 16.28c3.54-.78 6.23-3.81 6.51-7.51h-4.15c-.07 2.12-.46 4.05-1.08 5.51-.34.8-.76 1.49-1.26 1.98l-.02.02Z" fill="currentColor"/><path d="M16.62 7.51c-.27-3.7-2.97-6.73-6.51-7.51l.01.01c.5.5.92 1.19 1.26 1.98.62 1.46 1.01 3.39 1.08 5.52h4.16Z" fill="currentColor"/><path d="M9.25.9C8.9.56 8.59.43 8.31.43c-.28 0-.59.13-.94.47C7.02 1.25 6.68 1.78 6.38 2.49 5.84 3.77 5.47 5.53 5.4 7.51h5.81c-.06-1.98-.43-3.74-.97-5.02-.3-.71-.64-1.24-.99-1.59Z" fill="currentColor"/><path d="M10.24 13.79c.54-1.28.91-3.04.97-5.02H5.4c.07 1.98.43 3.74.98 5.02.3.71.64 1.24.99 1.59.35.34.66.47.94.47.28 0 .59-.13.94-.47.35-.35.69-.87.99-1.59Z" fill="currentColor"/></svg>;
}

function LockIcon() {
  return <svg width="16" height="16" viewBox="0 0 14 17" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6.67 0C4.37 0 2.5 1.87 2.5 4.17v1.46H1.46C.65 5.63 0 6.28 0 7.08V15c0 .81.65 1.46 1.46 1.46h10.42c.8 0 1.46-.65 1.46-1.46V7.08c0-.8-.65-1.46-1.46-1.46h-.96V4.17C10.83 1.87 8.97 0 6.67 0Zm2.92 5.63V4.17c0-1.61-1.31-2.92-2.92-2.92-1.61 0-2.92 1.31-2.92 2.92v1.46h5.84ZM6.67 9.17c.34 0 .62.28.62.62v2.5c0 .35-.28.63-.62.63a.63.63 0 0 1-.63-.63v-2.5c0-.34.28-.62.63-.62Z" fill="currentColor"/></svg>;
}

export function ConfigurationStep({ data, onChange, model = "cpm" }: { data: ConfigurationData; onChange: (data: ConfigurationData) => void; model?: CampaignModel }) {
  const platformRewards = data.platformRewards ?? {};
  const update = (partial: Partial<ConfigurationData>) => onChange({ ...data, ...partial });
  const togglePlatform = (p: Platform) => {
    const current = data.selectedPlatforms;
    const next = current.includes(p) ? current.filter((x) => x !== p) : [...current, p];
    update({ selectedPlatforms: next });
  };
  const updatePlatformReward = (platform: string, value: string) => {
    update({ platformRewards: { ...platformRewards, [platform]: value } });
  };
  const isRetainer = model === "retainer";

  return (
    <div className="flex flex-col gap-2">
      {/* Header card */}
      <SectionCard>
        <SectionHeading title="Configuration" description="Set up the rules, payouts, and requirements for your campaign" />
      </SectionCard>

      {/* Access type card */}
      <SectionCard>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Access type</span>
          <span className="text-sm font-normal tracking-[-0.02em] text-page-text-muted">Choose how creators can join.</span>
        </div>
        <SegmentedControl
          value={data.requireApplication ? "application" : "open"}
          onChange={(v) => update({ requireApplication: v === "application" })}
          options={[
            { label: "Open to public", value: "open", icon: <GlobeIcon /> },
            { label: "Application only", value: "application", icon: <LockIcon /> },
          ]}
        />
      </SectionCard>

      {/* Model-specific configuration cards */}
      {isRetainer ? (
        <RetainerConfiguration data={data} togglePlatform={togglePlatform} update={update} />
      ) : (
        <CpmPerVideoConfiguration data={data} model={model} platformRewards={platformRewards} togglePlatform={togglePlatform} update={update} updatePlatformReward={updatePlatformReward} />
      )}
    </div>
  );
}
