"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";

import { ALL_CAMPAIGNS, type Campaign, formatCreators, PILL_MASK } from "../_shared";
import { VerifiedBadge, PlatformPills, CpmPill, PersonIcon } from "../_shared-components";

const PAGE_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function CampaignPage() {
  const params = useParams();
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const campaign = ALL_CAMPAIGNS.find((c) => c.id === params.id);

  const handleBack = useCallback(() => {
    if (exiting) return;
    setExiting(true);
  }, [exiting]);

  if (!campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page-bg">
        <div className="flex flex-col items-center gap-4">
          <span className="text-lg font-medium text-page-text">Campaign not found</span>
          <button onClick={() => router.push("/creator/discover")} className="text-sm font-medium text-foreground/60 underline">Back to Discover</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-page-bg"
      animate={{ opacity: exiting ? 0 : 1, y: exiting ? -6 : 0 }}
      initial={{ opacity: 0, y: 6 }}
      onAnimationComplete={() => {
        if (!exiting) return;
        router.back();
      }}
      transition={{ duration: exiting ? 0.2 : 0.3, ease: PAGE_EASE }}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-50 flex h-14 items-center border-b border-foreground/[0.06] bg-page-bg/80 backdrop-blur-md dark:border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-[1200px] items-center px-4 sm:px-6">
          <button onClick={handleBack} className="flex h-9 items-center gap-2 rounded-full bg-foreground/[0.04] pl-2.5 pr-3 transition-opacity hover:opacity-80 active:scale-[0.97] dark:bg-white/[0.06]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-sm tracking-[-0.09px] text-page-text">Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
        {/* Hero section */}
        <div className="flex flex-col gap-8 pt-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: campaign info */}
          <div className="flex flex-col gap-6 lg:w-[520px] lg:shrink-0">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="relative size-8 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.4)]">
                <img src={campaign.avatar} alt={campaign.brand} className="size-full object-cover" />
              </div>
              <span className="text-base font-medium tracking-[-0.09px] text-page-text">{campaign.brand}</span>
              {campaign.isVerified && <VerifiedBadge size={16} />}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold leading-[1.15] tracking-[-0.4px] text-page-text sm:text-[32px] sm:tracking-[-0.6px] lg:text-[40px]">{campaign.title}</h1>

            {/* Meta row */}
            <div className="flex items-center gap-1 text-sm leading-5 text-foreground/60">
              <span>{campaign.category}</span>
              <span className="text-foreground/30">·</span>
              <span className="font-semibold text-page-text">{campaign.pricePerView}</span>
              <span className="font-semibold text-foreground/40">/1K views</span>
              <span className="text-foreground/30">·</span>
              <span>{campaign.budgetTotal} budget</span>
              <span className="text-foreground/30">·</span>
              <span>{campaign.fundedAgo} ago</span>
            </div>

            {/* Budget + pills */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="text-lg font-semibold leading-[1.2] tracking-[-0.18px]">
                  <span className="text-page-text">{campaign.budgetSpent}</span>
                  <span className="text-foreground/40"> / {campaign.budgetTotal}</span>
                </div>
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-foreground/[0.06] dark:bg-white/10">
                  <div className="h-full rounded-full bg-page-text dark:bg-white" style={{ width: `${campaign.progressPercentage}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex h-7 items-center gap-1 rounded-full px-2.5 py-1 verified-pill-glass">
                  <span className="pointer-events-none absolute inset-0 rounded-full verified-pill-border" style={PILL_MASK} />
                  <PersonIcon />
                  <span className="text-xs font-semibold text-page-text">{formatCreators(campaign.creators)} creators</span>
                </div>
                <CpmPill cpm={campaign.pricePerView} />
                <PlatformPills platforms={campaign.platforms} />
              </div>
            </div>

            {/* Join button */}
            <button className="relative flex h-12 w-fit items-center justify-center rounded-[40px] px-8 text-base font-semibold text-white transition-[transform,filter] duration-150 hover:brightness-110 active:scale-[0.96] hero-join-btn dark:text-black">
              <span className="pointer-events-none absolute inset-0 rounded-[40px] verified-pill-border" style={PILL_MASK} />
              Join Campaign
            </button>
          </div>

          {/* Right: thumbnail */}
          <div className="hidden min-w-0 flex-1 lg:block lg:max-w-[540px]">
            <div className="aspect-[280/152] overflow-hidden rounded-2xl">
              <div className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${campaign.thumbnail})` }} />
            </div>
          </div>
        </div>

        {/* Mobile thumbnail */}
        <div className="my-6 lg:hidden">
          <div className="aspect-[280/152] overflow-hidden rounded-2xl">
            <div className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${campaign.thumbnail})` }} />
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 w-full max-w-[760px]">
          <h2 className="mb-4 text-lg font-semibold text-page-text">About this campaign</h2>
          <p className="text-base leading-[1.5] tracking-[-0.18px] text-foreground/56 dark:text-white/88">
            {campaign.description} This campaign is looking for creators who can produce engaging, high-quality content that resonates with the target audience. Ideal candidates have experience in {campaign.category.toLowerCase()} content and a strong presence on {campaign.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")}.
          </p>
        </div>

        {/* Requirements */}
        <div className="mt-8 w-full max-w-[760px]">
          <div className="rounded-2xl border border-foreground/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-[#1C1C1C]">
            <h3 className="mb-4 text-base font-semibold text-page-text">Creator requirements</h3>
            <div className="flex gap-1">
              <div className="w-0.5 shrink-0 rounded-full bg-foreground/[0.12]" />
              <div className="flex flex-col gap-2 pl-3">
                <div className="flex items-start gap-2">
                  <div className="mt-2 size-1 shrink-0 rounded-full bg-page-text" />
                  <span className="text-sm leading-[150%] text-page-text">Must have at least 1,000 followers on one of the supported platforms</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-2 size-1 shrink-0 rounded-full bg-page-text" />
                  <span className="text-sm leading-[150%] text-page-text">Content must be original and not violate any copyright guidelines</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-2 size-1 shrink-0 rounded-full bg-page-text" />
                  <span className="text-sm leading-[150%] text-page-text">Submissions must be in English or have English captions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform rates */}
        <div className="mt-6 w-full max-w-[760px]">
          <h3 className="mb-4 text-base font-semibold text-page-text">Platform rates</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {campaign.platforms.map((p) => (
              <div key={p} className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-[#1C1C1C]">
                <div className="flex size-10 items-center justify-center rounded-full border border-foreground/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <PlatformIcon platform={p} size={20} className="text-foreground/50" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-page-text capitalize">{p}</span>
                  <span className="text-sm text-foreground/50">{campaign.pricePerView} per 1K views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
