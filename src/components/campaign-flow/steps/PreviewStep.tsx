"use client";

import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { CategoryIcon } from "@/components/campaign-flow/CategoryIcon";
import type { ConfigurationData, DetailsData } from "@/types/campaign-flow.types";

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]", className)}>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center rounded-[14px] border border-foreground/[0.06] px-3 py-3">
      <span className="flex-1 font-inter text-sm tracking-[-0.02em] text-page-text-muted">{label}</span>
      <span className="font-inter text-sm font-medium leading-[120%] tracking-[-0.02em] text-page-text">{value}</span>
    </div>
  );
}

export function PreviewStep({ configuration, details }: { configuration: ConfigurationData; details: DetailsData }) {
  const campaignName = details.name || "Call of Duty BO7 Official Clipping Campaign";
  const brandName = "Clipping Culture";
  const platforms = configuration.selectedPlatforms.length > 0 ? configuration.selectedPlatforms : ["tiktok", "instagram"];
  const category = details.category || "gaming";

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Preview card */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Preview</span>
          <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">This is how creators will see your campaign on the Discover page.</span>
        </div>
        <Card className="overflow-hidden rounded-[20px]">
          {/* Thumbnail */}
          <div className="relative overflow-hidden p-1">
            <div
              className="h-[280px] rounded-2xl"
              style={{ background: details.thumbnailPreview ? `url(${details.thumbnailPreview}) center/cover, #1a1a1a` : "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%), #2a2a2a" }}
            >
              <div className="flex items-start justify-between p-3">
                {/* Match badge */}
                <div className="flex items-center rounded-full bg-[#00B259] px-2.5 py-2 backdrop-blur-[12px]">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-white">92% match</span>
                </div>
                {/* Platform + category badges */}
                <div className="flex items-center gap-1">
                  {platforms.map((p) => (
                    <div key={p} className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                      <PlatformIcon platform={p} size={16} className="text-white [&_path]:fill-white" />
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-2 backdrop-blur-[12px]">
                    <CategoryIcon category={category} />
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-white capitalize">{category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 px-5 py-3 pb-5">
            {/* Brand row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-foreground/10" />
                <div className="flex items-center gap-1.5">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{brandName}</span>
                  <img src="/icons/verified-check.svg" alt="Verified" width={14} height={14} className="dark:invert" />
                  <span className="font-inter text-sm tracking-[-0.02em] text-foreground/20">·</span>
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">5d</span>
                </div>
              </div>
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">
                {configuration.requireApplication ? "Application required" : "Open to all"}
              </span>
            </div>

            {/* Title */}
            <span className="font-inter text-base font-medium tracking-[-0.02em] text-page-text">{campaignName}</span>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-card-bg px-2.5 py-2">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">121,4K</span>
                </div>
                <div className="flex items-center gap-[1px] rounded-full bg-[rgba(59,130,246,0.1)] px-2.5 py-2">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-[#3B82F6]">${configuration.rewardPer1000Views || "1.50"}</span>
                  <span className="font-inter text-sm tracking-[-0.02em] text-[rgba(59,130,246,0.7)]">/1K</span>
                </div>
              </div>
              <div className="flex items-center gap-[1px]">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">$8,677</span>
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text-subtle">/</span>
                <span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">${configuration.budget || "37,500"}</span>
              </div>
            </div>

            {/* Budget bar */}
            <div className="h-1 w-full rounded-full bg-foreground/[0.06]">
              <div className="h-1 w-[58%] rounded-full" style={{ background: "radial-gradient(31.76% 50.52% at 64.86% 100.52%, #FF3FD5 0%, rgba(255, 63, 213, 0) 100%), radial-gradient(31.58% 54.43% at 32.86% 102.32%, #FF9025 0%, rgba(255, 144, 37, 0) 100%), #252525" }} />
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Campaign summary */}
      <div className="flex flex-col gap-2">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Campaign summary</span>
        <Card className="p-5">
          <div className="flex flex-col gap-2">
            <SummaryRow label="Payment model" value="CPM" />
            <SummaryRow label="Rate" value={`$${configuration.rewardPer1000Views || "2.50"} CPM`} />
            <SummaryRow label="Platforms" value={platforms.map(p => p === "tiktok" ? "TikTok" : p === "instagram" ? "Instagram" : p === "youtube" ? "YouTube" : "X").join(", ")} />
            <SummaryRow label="Access" value={configuration.requireApplication ? "Application only" : "Open to public"} />
            <SummaryRow label="Contract" value={`${configuration.contractLength || "3"} months`} />
            <SummaryRow label="Posts" value={`${configuration.expectedPostsPerMonth || "20"}/mo`} />
            <SummaryRow label="Spots" value="13 remaining (47/60)" />
            <SummaryRow label="Bonuses" value="2 milestones" />
            <SummaryRow label="Invited" value="3 invited creators" />
          </div>
        </Card>
      </div>
    </div>
  );
}
