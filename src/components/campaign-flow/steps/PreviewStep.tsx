"use client";

import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { CategoryIcon } from "@/components/campaign-flow/CategoryIcon";
import type { ConfigurationData, DetailsData } from "@/types/campaign-flow.types";

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]", className)}>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center rounded-[14px] border border-foreground/[0.06] px-3 py-3 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
      <span className="flex-1 font-inter text-sm tracking-[-0.02em] text-page-text-muted">{label}</span>
      <span className="font-inter text-sm font-medium leading-[120%] tracking-[-0.02em] text-page-text">{value}</span>
    </div>
  );
}

function MobileStatusBar() {
  return (
    <div className="flex h-[54px] w-full items-center justify-between px-8">
      {/* Time */}
      <span className="text-[17px] font-semibold leading-[22px] text-black dark:text-white" style={{ fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}>
        9:41
      </span>
      {/* Right icons */}
      <div className="flex items-center gap-[7px]">
        {/* Cellular */}
        <svg width="19" height="13" viewBox="0 0 19 13" fill="none" className="text-black dark:text-white">
          <rect x="0.5" y="4.5" width="3" height="8" rx="1" fill="currentColor" />
          <rect x="5" y="3" width="3" height="10" rx="1" fill="currentColor" />
          <rect x="9.5" y="1" width="3" height="12" rx="1" fill="currentColor" />
          <rect x="14" y="0" width="3" height="13" rx="1" fill="currentColor" />
        </svg>
        {/* Wifi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" className="text-black dark:text-white">
          <path d="M8.5 3.5C10.57 3.5 12.45 4.32 13.83 5.67L15.25 4.25C13.49 2.53 11.11 1.5 8.5 1.5C5.89 1.5 3.51 2.53 1.75 4.25L3.17 5.67C4.55 4.32 6.43 3.5 8.5 3.5ZM8.5 7C9.61 7 10.62 7.44 11.37 8.16L12.79 6.74C11.66 5.65 10.16 5 8.5 5C6.84 5 5.34 5.65 4.21 6.74L5.63 8.16C6.38 7.44 7.39 7 8.5 7ZM8.5 10.5C7.95 10.5 7.45 10.72 7.08 11.08L8.5 12.5L9.92 11.08C9.55 10.72 9.05 10.5 8.5 10.5Z" fill="currentColor" />
        </svg>
        {/* Battery */}
        <svg width="28" height="13" viewBox="0 0 28 13" fill="none" className="text-black dark:text-white">
          <rect x="0.5" y="0.5" width="24" height="12" rx="3.8" stroke="currentColor" opacity="0.35" />
          <rect x="2" y="2" width="21" height="9" rx="2.5" fill="currentColor" />
          <path d="M26 4.5V8.5" stroke="currentColor" strokeWidth="1.33" opacity="0.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function MobileNavBar() {
  return (
    <div className="flex h-[56px] w-full items-center justify-between px-5">
      {/* Back arrow */}
      <div className="flex items-center gap-2">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none" className="text-black dark:text-white">
          <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[17px] font-normal text-black dark:text-white" style={{ fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}>Discover</span>
      </div>
      {/* Search icon */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-black dark:text-white">
        <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 13L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
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
      {/* Campaign card preview */}
      <div className="flex flex-col">
        <div className="flex flex-col gap-1 self-start mb-3 shrink-0">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Preview</span>
          <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">This is how creators will see your campaign on the Discover page.</span>
        </div>
        {/* Card preview — direct, no phone frame */}
        <div className="hidden sm:block">
          <Card className="flex flex-col overflow-hidden rounded-[20px]">
              {/* Thumbnail */}
              <div className="relative min-h-0 flex-1 overflow-hidden p-1">
                <div
                  className="h-full min-h-[120px] rounded-2xl"
                  style={{ background: details.thumbnailPreview ? `url(${details.thumbnailPreview}) center/cover, #1a1a1a` : "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%), #2a2a2a" }}
                >
                  <div className="flex items-start justify-between p-3">
                    <div className="flex items-center rounded-full bg-[#00B259] px-2.5 py-2 backdrop-blur-[12px]">
                      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-white">92% match</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {platforms.map((p) => (
                        <div key={p} className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                          <PlatformIcon platform={p} size={16} className="text-white [&_path]:fill-white" />
                        </div>
                      ))}
                      <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-2 backdrop-blur-[12px] text-white [&_svg]:text-white [&_path]:fill-white [&_path]:stroke-white">
                        <CategoryIcon category={category} />
                        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-white capitalize">{category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex shrink-0 flex-col gap-3 px-5 py-3 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-foreground/10" />
                    <div className="flex items-center gap-1.5">
                      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{brandName}</span>
                      <img src="/icons/CRCheckmark.svg" alt="Verified" width={14} height={14} />
                      <span className="font-inter text-sm tracking-[-0.02em] text-foreground/20">·</span>
                      <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">5d</span>
                    </div>
                  </div>
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">
                    {configuration.requireApplication ? "Application required" : "Open to all"}
                  </span>
                </div>

                <span className="font-inter text-base font-medium tracking-[-0.02em] text-page-text">{campaignName}</span>

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

                <div className="h-1 w-full rounded-full bg-foreground/[0.06]">
                  <div className="h-1 w-[58%] rounded-full" style={{ background: "radial-gradient(31.76% 50.52% at 64.86% 100.52%, #FF3FD5 0%, rgba(255, 63, 213, 0) 100%), radial-gradient(31.58% 54.43% at 32.86% 102.32%, #FF9025 0%, rgba(255, 144, 37, 0) 100%), var(--foreground)" }} />
                </div>
              </div>
            </Card>
        </div>

        {/* Mobile card */}
        <Card className="flex sm:hidden flex-col overflow-hidden rounded-[20px]">
          {/* Thumbnail */}
          <div className="relative overflow-hidden p-1">
            <div
              className="h-[192px] rounded-2xl"
              style={{ background: details.thumbnailPreview ? `url(${details.thumbnailPreview}) center/cover, #1a1a1a` : "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%), #2a2a2a" }}
            >
              <div className="flex items-start justify-between p-3">
                <div className="flex items-center rounded-full bg-[#00B259] px-2.5 py-2 backdrop-blur-[12px]">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-white">92% match</span>
                </div>
                <div className="flex items-center gap-1">
                  {platforms.map((p) => (
                    <div key={p} className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                      <PlatformIcon platform={p} size={16} className="text-white [&_path]:fill-white" />
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-2 backdrop-blur-[12px] text-white [&_svg]:text-white [&_path]:fill-white [&_path]:stroke-white">
                    <CategoryIcon category={category} />
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-white capitalize">{category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="flex flex-col gap-3 px-5 py-3 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-foreground/10" />
                <div className="flex items-center gap-1.5">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{brandName}</span>
                  <img src="/icons/CRCheckmark.svg" alt="Verified" width={14} height={14} />
                  <span className="font-inter text-sm tracking-[-0.02em] text-foreground/20">·</span>
                  <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">5d</span>
                </div>
              </div>
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">
                {configuration.requireApplication ? "Application required" : "Open to all"}
              </span>
            </div>
            <span className="font-inter text-base font-medium tracking-[-0.02em] text-page-text">{campaignName}</span>
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
            <div className="h-1 w-full rounded-full bg-foreground/[0.06]">
              <div className="h-1 w-[58%] rounded-full" style={{ background: "radial-gradient(31.76% 50.52% at 64.86% 100.52%, #FF3FD5 0%, rgba(255, 63, 213, 0) 100%), radial-gradient(31.58% 54.43% at 32.86% 102.32%, #FF9025 0%, rgba(255, 144, 37, 0) 100%), var(--foreground)" }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Campaign summary */}
      <div className="flex flex-col">
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
    </div>
  );
}
