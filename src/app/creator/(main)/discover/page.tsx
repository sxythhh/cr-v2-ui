"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { type Platform, type Campaign, formatCreators, BANNER_CAMPAIGNS, FEATURED_CAMPAIGNS, GRID_CAMPAIGNS } from "./_shared";
import { VerifiedBadge } from "./_shared-components";

const cardCls = "overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

/* ── Glassmorphism pill (white bg + backdrop blur, for on-image overlays) ── */
function GlassPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}

/* ── Platform pills on image ── */
function ImagePlatformPills({ platforms, category }: { platforms: Platform[]; category?: string }) {
  return (
    <div className="flex items-center gap-1">
      {platforms.map((p) => (
        <GlassPill key={p} className="size-6">
          <PlatformIcon platform={p} size={12} className="invert dark:invert-0" />
        </GlassPill>
      ))}
      {category && (
        <GlassPill className="h-6 gap-1 py-2.5 pl-1.5 pr-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5.015 0C3.566 0 2.39 1.175 2.39 2.625S3.566 5.25 5.015 5.25 7.64 4.075 7.64 2.625 6.465 0 5.015 0Z" fill="white"/><path d="M5.016 5.833c-2.775 0-4.715 2.054-4.956 4.612L0 11.083h10.032l-.06-.638c-.24-2.558-2.18-4.612-4.956-4.612Z" fill="white"/></svg>
          <span className="text-xs font-medium tracking-[-0.02em] text-white">{category}</span>
        </GlassPill>
      )}
    </div>
  );
}

/* ── Users icon (creators count) ── */
function UsersIconSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 15 12" fill="currentColor">
      <path d="M1.807 2.667C1.807 1.194 3 0 4.473 0c1.473 0 2.667 1.194 2.667 2.667 0 1.473-1.194 2.666-2.667 2.666S1.807 4.14 1.807 2.667Z"/>
      <path d="M7.807 2.667C7.807 1.194 9 0 10.473 0c1.473 0 2.667 1.194 2.667 2.667 0 1.473-1.194 2.666-2.667 2.666S7.807 4.14 7.807 2.667Z"/>
      <path d="M4.473 6c1.914 0 3.73 1.32 4.405 3.742.353 1.267-.727 2.258-1.836 2.258H1.904C.795 12-.285 11.009.068 9.742.744 7.32 2.56 6 4.473 6Z"/>
      <path d="M10.163 9.384c-.325-1.166-.884-2.152-1.603-2.916A4.6 4.6 0 0 1 10.474 6c1.913 0 3.729 1.32 4.405 3.742.353 1.267-.727 2.258-1.836 2.258H9.694c.512-.697.746-1.624.469-2.616Z"/>
    </svg>
  );
}

/* ── Eye icon (CPM) ── */
function EyeIconSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 1.333C4.364 1.333 1.227 3.63 0 7.333c1.227 3.703 4.364 6 8 6s6.773-2.297 8-6c-1.227-3.703-4.364-6-8-6Zm0 9.667a3.667 3.667 0 1 0 0-7.333 3.667 3.667 0 0 0 0 7.333Zm0-1.833a1.833 1.833 0 1 0 0-3.667 1.833 1.833 0 0 0 0 3.667Z" fill="#1A67E5"/>
    </svg>
  );
}

/* ── Campaign Card ── */
function CampaignCard({ campaign, onClick }: { campaign: Campaign; onClick?: () => void }) {
  const progress = Math.max(4, Math.min(100, campaign.progressPercentage));
  return (
    <div className={cn(cardCls, "group/card flex w-[320px] shrink-0 cursor-pointer flex-col transition-shadow hover:shadow-lg")} onClick={onClick}>
      {/* Image area with overlaid pills */}
      <div className="relative p-1 pb-0">
        <div className="relative h-[184px] w-full overflow-hidden rounded-xl bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 29.62%), url(${campaign.thumbnail})` }}>
          <div className="absolute inset-x-0 top-0 flex justify-end p-3">
            <ImagePlatformPills platforms={campaign.platforms} category={campaign.category} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-3">
        {/* Brand row */}
        <div className="flex items-center gap-1.5">
          <img src={campaign.avatar} alt={campaign.brand} className="size-4 shrink-0 rounded-full border border-foreground/[0.06]" />
          <span className="text-xs font-medium text-page-text">{campaign.brand}</span>
          {campaign.isVerified && <VerifiedBadge size={12} />}
          <span className="text-xs font-medium text-foreground/20">·</span>
          <span className="text-xs text-page-text-subtle">{campaign.fundedAgo}</span>
        </div>

        {/* Title */}
        <span className="line-clamp-1 text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.title}</span>

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1">
              <UsersIconSmall />
              <span className="text-xs font-medium text-page-text">{formatCreators(campaign.creators)}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1">
              <EyeIconSmall />
              <span className="text-xs font-medium text-[#1A67E5]">{campaign.pricePerView}/1k</span>
            </div>
          </div>
          <div className="flex items-center gap-[1px] text-xs">
            <span className="font-medium text-page-text">{campaign.budgetSpent}</span>
            <span className="text-foreground/70">/</span>
            <span className="text-foreground/70">{campaign.budgetTotal}</span>
          </div>
        </div>

        {/* Hover: description + join button */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 lg:group-hover/card:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="line-clamp-2 pb-2 text-xs leading-[150%] text-foreground/60">{campaign.description}</p>
            <button className="flex h-9 w-full items-center justify-center rounded-full text-sm font-medium text-white" style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}>
              Join Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-foreground/[0.06]">
        <div className="h-full rounded-full bg-page-text" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

/* ── Hero Banner ── */
function HeroBanner({ campaigns, onJoin }: { campaigns: Campaign[]; onJoin: (c: Campaign) => void }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive((i) => (i + 1) % campaigns.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [campaigns.length]);

  const go = (dir: -1 | 1) => {
    setActive((i) => (i + dir + campaigns.length) % campaigns.length);
    clearInterval(timerRef.current);
  };

  const c = campaigns[active];

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
      {/* Background images — stacked for parallax feel */}
      {campaigns.map((camp, i) => (
        <div key={camp.id} className={cn("absolute inset-0 bg-cover bg-center transition-opacity duration-700", i === active ? "opacity-100" : "opacity-0")} style={{ backgroundImage: `url(${camp.bannerImage || camp.thumbnail})` }} />
      ))}

      {/* Dark overlays */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(37,37,37,0.2), rgba(37,37,37,0.2)), linear-gradient(180deg, rgba(37,37,37,0.9) 0%, rgba(37,37,37,0) 29.62%), linear-gradient(0deg, rgba(37,37,37,0.9) 17.19%, rgba(37,37,37,0) 68.75%)" }} />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        {/* Top bar: nav arrows + platform pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => go(-1)} className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => go(1)} className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-end gap-1">
            <ImagePlatformPills platforms={c.platforms} category={c.category} />
          </div>
        </div>

        {/* Bottom: info + CTA */}
        <div className="flex items-end justify-between gap-20">
          <div className="flex flex-col gap-3">
            {/* Brand row */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <img src={c.avatar} alt={c.brand} className="size-4 rounded-full border border-foreground/[0.06]" />
                <span className="text-xs font-medium text-white">{c.brand}</span>
                {c.isVerified && <VerifiedBadge size={12} />}
                <span className="text-xs font-medium text-white/20">·</span>
                <span className="text-xs text-white/50">{c.fundedAgo}</span>
                <span className="text-xs font-medium text-white/20">·</span>
                <span className="text-xs text-white/50">Application required</span>
              </div>
              {/* Title */}
              <h2 className="max-w-[400px] text-xl font-medium leading-[135%] tracking-[-0.02em] text-white">{c.description ? `Clip for ${c.brand} and earn ${c.pricePerView} per 1k views.` : c.title}</h2>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                <GlassPill className="h-6 gap-1 py-2.5 pl-1.5 pr-2">
                  <EyeIconSmall />
                  <span className="text-xs font-medium text-white">{c.pricePerView}/1k</span>
                </GlassPill>
                <GlassPill className="h-6 gap-1 py-2.5 pl-1.5 pr-2">
                  <svg width="12" height="12" viewBox="0 0 15 12" fill="white"><path d="M1.807 2.667C1.807 1.194 3 0 4.473 0c1.473 0 2.667 1.194 2.667 2.667 0 1.473-1.194 2.666-2.667 2.666S1.807 4.14 1.807 2.667Z"/><path d="M7.807 2.667C7.807 1.194 9 0 10.473 0c1.473 0 2.667 1.194 2.667 2.667 0 1.473-1.194 2.666-2.667 2.666S7.807 4.14 7.807 2.667Z"/><path d="M4.473 6c1.914 0 3.73 1.32 4.405 3.742.353 1.267-.727 2.258-1.836 2.258H1.904C.795 12-.285 11.009.068 9.742.744 7.32 2.56 6 4.473 6Z"/><path d="M10.163 9.384c-.325-1.166-.884-2.152-1.603-2.916A4.6 4.6 0 0 1 10.474 6c1.913 0 3.729 1.32 4.405 3.742.353 1.267-.727 2.258-1.836 2.258H9.694c.512-.697.746-1.624.469-2.616Z"/></svg>
                  <span className="text-xs font-medium text-white">{formatCreators(c.creators)}</span>
                </GlassPill>
              </div>
              <div className="flex items-center gap-[1px] text-xs">
                <span className="font-medium text-white">{c.budgetSpent}</span>
                <span className="text-white/50">/</span>
                <span className="text-white/50">{c.budgetTotal}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => onJoin(c)}
            className="shrink-0 rounded-full px-5 py-2.5 text-sm font-medium text-white"
            style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}
          >
            Join campaign
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function CreatorDiscoverPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-page-bg font-inter tracking-[-0.02em]">
      <div className="mx-auto flex w-full max-w-[756px] flex-col gap-6 px-4 py-4 sm:px-5 md:px-4">
        {/* Hero */}
        <HeroBanner campaigns={BANNER_CAMPAIGNS} onJoin={() => {}} />

        {/* Verified campaigns */}
        <div className="-mx-4 flex flex-col gap-4 sm:-mx-5 md:mx-0">
          <div className="flex items-center justify-between px-4 sm:px-5 md:px-0">
            <h3 className="text-base font-medium tracking-[-0.02em] text-page-text">Verified campaigns</h3>
            <button className="text-sm font-medium tracking-[-0.02em] text-page-text-muted">See all</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 pl-4 scrollbar-hide sm:pl-5 md:pl-0">
            {[...FEATURED_CAMPAIGNS, ...GRID_CAMPAIGNS].slice(0, 5).map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </div>

        {/* Trending campaigns */}
        <div className="-mx-4 flex flex-col gap-4 sm:-mx-5 md:mx-0">
          <div className="flex items-center justify-between px-4 sm:px-5 md:px-0">
            <h3 className="text-base font-medium tracking-[-0.02em] text-page-text">Trending campaigns</h3>
            <button className="text-sm font-medium tracking-[-0.02em] text-page-text-muted">See all</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 pl-4 scrollbar-hide sm:pl-5 md:pl-0">
            {GRID_CAMPAIGNS.slice(0, 6).map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
