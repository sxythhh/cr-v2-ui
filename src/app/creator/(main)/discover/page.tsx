"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { type Campaign, formatCreators, BANNER_CAMPAIGNS, FEATURED_CAMPAIGNS, GRID_CAMPAIGNS } from "./_shared";
import { VerifiedBadge } from "./_shared-components";

const cardCls = "overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

/* ── Glassmorphism pill ── */
function GlassPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}

/* ── Category icons ── */
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Gaming: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.524 1.5c-.492 0-.953.242-1.233.646L4.101 5.309l2.59 2.59 3.163-2.19c.405-.28.646-.741.646-1.233V2a.5.5 0 0 0-.5-.5H7.524Z" fill="currentColor"/><path d="M2.853 5.146a.5.5 0 0 0-.77.077l-.117.175a1.5 1.5 0 0 0 .028 1.704l.603.844-1.097 1.097a1 1 0 0 0 0 1.414l.043.043a1 1 0 0 0 1.414 0l1.097-1.097.844.603a1.5 1.5 0 0 0 1.704.027l.175-.117a.5.5 0 0 0 .077-.77l-4-4Z" fill="currentColor"/></svg>,
  Music: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.855 2.365a.5.5 0 0 1 .644.479v3.391a2.16 2.16 0 0 0-1-.236c-1.016 0-2 .702-2 1.75s.984 1.75 2 1.75 2-.702 2-1.75V2.844a1.5 1.5 0 0 0-1.931-1.437l-3 .9A1.5 1.5 0 0 0 4.5 3.744v3.992a2.16 2.16 0 0 0-1-.237c-1.015 0-2 .702-2 1.75s.985 1.75 2 1.75 2-.702 2-1.75V3.744a.5.5 0 0 1 .356-.479l3-.9Z" fill="currentColor"/></svg>,
  Entertainment: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6.908.507a.5.5 0 0 1 .578.41l.001.006v.003c.02.123.032.247.04.372.012.21.014.506-.04.801-.065.346-.225.657-.352.865a3.5 3.5 0 0 1-.18.26l-.002.002a.5.5 0 0 1-.77-.643 2.5 2.5 0 0 0 .172-.245c.1-.163.19-.353.221-.526.034-.185.036-.391.026-.561a3.9 3.9 0 0 0-.027-.264.5.5 0 0 1 .41-.578Z" fill="currentColor"/><path d="M9.541 1.281a.5.5 0 0 1 .302.641l-.226.626a.5.5 0 0 1-.866-.34l.225-.626a.5.5 0 0 1 .565-.301Z" fill="currentColor"/><path d="M10.947 3.532a.5.5 0 0 1-.224.672l-.501.25a.5.5 0 0 1-.673-.223.5.5 0 0 1 .224-.672l.501-.25a.5.5 0 0 1 .673.223Z" fill="currentColor"/><path d="M8.599 3.402a.5.5 0 0 1 0 .708l-.501.501a.5.5 0 0 1-.708-.708l.501-.501a.5.5 0 0 1 .708 0Z" fill="currentColor"/><path d="M8.495 5.488a.5.5 0 0 1 .522.48l.001.001.002.002a3 3 0 0 0 .278.027c.159.02.316.049.44.089.148.048.305.136.489.216a4 4 0 0 0 .749.275.5.5 0 0 1-.69.84 5 5 0 0 1-.222-.127c-.138-.074-.293-.148-.417-.188-.149-.048-.305-.076-.43-.093a3 3 0 0 0-.19-.02.5.5 0 0 1-.48-.521Z" fill="currentColor"/><path d="M2.96 4.243c.397-1.007 1.696-1.277 2.461-.512l2.849 2.849c.765.765.495 2.064-.512 2.461l-4.7 1.851c-1.223.482-2.431-.726-1.95-1.949l1.852-4.7Z" fill="currentColor"/></svg>,
  Sports: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5.581 1.288C3.534 1.92 1.92 3.534 1.288 5.58l5.131 5.131C8.466 10.08 10.08 8.466 10.712 6.42L5.581 1.288Zm1.648 4.19a.5.5 0 1 0-.707-.707l-1.75 1.75a.5.5 0 0 0 .707.708l1.75-1.75Z" fill="currentColor"/><path d="M1 7.5c0-.254.015-.504.043-.75L5.25 10.957c-.246.029-.496.043-.75.043H2a1 1 0 0 1-1-1V7.5Z" fill="currentColor"/><path d="M10.957 5.25c.029-.246.043-.496.043-.75V2a1 1 0 0 0-1-1H7.5c-.254 0-.504.015-.75.043l4.207 4.207Z" fill="currentColor"/></svg>,
  Lifestyle: <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M5.248 9.186c4.264-2.39 5.313-5.235 4.511-7.235-.39-.97-1.207-1.666-2.171-1.881-.849-.19-1.776 0-2.585.642-.808-.641-1.735-.831-2.584-.642C1.455.285.638.98.248 1.951c-.802 2-1.246 4.845 4.511 7.235a.5.5 0 0 0 .49 0Z" fill="currentColor"/></svg>,
  Technology: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5.5 1.05A4 4 0 0 0 5 1c-1.054 0-1.955.652-2.323 1.574C1.712 2.827 1 3.705 1 4.75c0 .462.14.893.379 1.25A2.25 2.25 0 0 0 1 7.25c0 .856.478 1.6 1.18 1.98A2.751 2.751 0 0 0 4.75 11c.26 0 .511-.036.75-.104V8.501 8.5A1.5 1.5 0 0 0 4 7.5a.5.5 0 0 1 0-1c.364 0 .706.097 1 .268V3.5v-.001V1.05Z" fill="currentColor"/><path d="M6.5 10.896c.239.068.49.104.75.104a2.751 2.751 0 0 0 2.57-1.77c.702-.38 1.18-1.124 1.18-1.98 0-.462-.14-.893-.379-1.25.24-.358.379-.788.379-1.25 0-.995-.712-1.873-1.677-2.126A2.751 2.751 0 0 0 7 1c-.171 0-.338.017-.5.05V3.502A1.5 1.5 0 0 1 8 4.5a.5.5 0 0 1 0 1 2.24 2.24 0 0 1-1-.268v5.664Z" fill="currentColor"/></svg>,
};

/* ── Platform pills on image ── */
function ImagePlatformPills({ platforms, category }: { platforms: string[]; category?: string }) {
  return (
    <div className="flex items-center gap-1">
      {platforms.map((p) => (
        <GlassPill key={p} className="size-6">
          <PlatformIcon platform={p} size={12} className="invert dark:invert-0" />
        </GlassPill>
      ))}
      {category && (
        <GlassPill className="h-6 gap-1 py-2.5 pl-1.5 pr-2 text-white">
          {CATEGORY_ICONS[category] || <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5.015 0C3.566 0 2.39 1.175 2.39 2.625S3.566 5.25 5.015 5.25 7.64 4.075 7.64 2.625 6.465 0 5.015 0Z" fill="currentColor"/><path d="M5.016 5.833c-2.775 0-4.715 2.054-4.956 4.612L0 11.083h10.032l-.06-.638c-.24-2.558-2.18-4.612-4.956-4.612Z" fill="currentColor"/></svg>}
          <span className="text-xs font-medium tracking-[-0.02em] text-white">{category}</span>
        </GlassPill>
      )}
    </div>
  );
}

/* ── Campaign Card ── */
function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.max(4, Math.min(100, campaign.progressPercentage));
  return (
    <div className={cn(cardCls, "flex w-[320px] shrink-0 cursor-pointer flex-col")}>
      {/* Image */}
      <div className="relative p-1 pb-0">
        <div className="relative h-[184px] w-full overflow-hidden rounded-xl bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 29.62%), url(${campaign.thumbnail})` }}>
          <div className="absolute inset-x-0 top-0 flex justify-end p-3">
            <ImagePlatformPills platforms={campaign.platforms} category={campaign.category} />
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-3">
        <div className="flex items-center gap-1.5">
          <img src={campaign.avatar} alt={campaign.brand} className="size-4 shrink-0 rounded-full border border-foreground/[0.06]" />
          <span className="text-xs font-medium text-page-text">{campaign.brand}</span>
          {campaign.isVerified && <VerifiedBadge size={12} />}
          <span className="text-xs font-medium text-foreground/20">·</span>
          <span className="text-xs text-page-text-subtle">{campaign.fundedAgo}</span>
        </div>
        <span className="line-clamp-1 text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.title}</span>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1">
              <svg width="12" height="12" viewBox="0 0 15 12" fill="currentColor"><path d="M1.807 2.667C1.807 1.194 3 0 4.473 0c1.473 0 2.667 1.194 2.667 2.667 0 1.473-1.194 2.666-2.667 2.666S1.807 4.14 1.807 2.667Z"/><path d="M7.807 2.667C7.807 1.194 9 0 10.473 0c1.473 0 2.667 1.194 2.667 2.667 0 1.473-1.194 2.666-2.667 2.666S7.807 4.14 7.807 2.667Z"/><path d="M4.473 6c1.914 0 3.73 1.32 4.405 3.742.353 1.267-.727 2.258-1.836 2.258H1.904C.795 12-.285 11.009.068 9.742.744 7.32 2.56 6 4.473 6Z"/><path d="M10.163 9.384c-.325-1.166-.884-2.152-1.603-2.916A4.6 4.6 0 0 1 10.474 6c1.913 0 3.729 1.32 4.405 3.742.353 1.267-.727 2.258-1.836 2.258H9.694c.512-.697.746-1.624.469-2.616Z"/></svg>
              <span className="text-xs font-medium text-page-text">{formatCreators(campaign.creators)}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1 text-[#1A67E5] dark:text-[#60A5FA]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 1.333C4.364 1.333 1.227 3.63 0 7.333c1.227 3.703 4.364 6 8 6s6.773-2.297 8-6c-1.227-3.703-4.364-6-8-6Zm0 9.667a3.667 3.667 0 1 0 0-7.333 3.667 3.667 0 0 0 0 7.333Zm0-1.833a1.833 1.833 0 1 0 0-3.667 1.833 1.833 0 0 0 0 3.667Z" fill="currentColor"/></svg>
              <span className="text-xs font-medium">{campaign.pricePerView}/1k</span>
            </div>
          </div>
          <div className="flex items-center gap-[1px] text-xs">
            <span className="font-medium text-page-text">{campaign.budgetSpent}</span>
            <span className="text-foreground/70">/</span>
            <span className="text-foreground/70">{campaign.budgetTotal}</span>
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

/* ── Campaign List Card (row mode) ── */
function CampaignListCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.max(4, Math.min(100, campaign.progressPercentage));
  return (
    <div className={cn(cardCls, "flex h-[118px] w-full items-center")}>
      {/* Thumbnail */}
      <div className="relative h-full w-[195px] shrink-0 p-1 pl-1">
        <div className="relative h-[110px] w-full overflow-hidden rounded-xl bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 29.62%), url(${campaign.thumbnail})` }}>
          <div className="absolute inset-x-0 top-0 flex justify-between p-3">
            <ImagePlatformPills platforms={campaign.platforms} category={campaign.category} />
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="flex min-w-0 flex-1 items-center gap-4 px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Brand + title */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <img src={campaign.avatar} alt={campaign.brand} className="size-4 shrink-0 rounded-full border border-foreground/[0.06]" />
              <span className="text-xs font-medium text-page-text">{campaign.brand}</span>
              {campaign.isVerified && <VerifiedBadge size={12} />}
              <span className="text-xs font-medium text-foreground/20">·</span>
              <span className="text-xs text-page-text-subtle">{campaign.fundedAgo}</span>
            </div>
            <span className="line-clamp-1 text-sm font-medium tracking-[-0.02em] text-page-text">{campaign.title}</span>
          </div>
          {/* Stats + progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1">
                <svg width="12" height="12" viewBox="0 0 15 12" fill="currentColor"><path d="M1.807 2.667C1.807 1.194 3 0 4.473 0c1.473 0 2.667 1.194 2.667 2.667 0 1.473-1.194 2.666-2.667 2.666S1.807 4.14 1.807 2.667Z"/><path d="M7.807 2.667C7.807 1.194 9 0 10.473 0c1.473 0 2.667 1.194 2.667 2.667 0 1.473-1.194 2.666-2.667 2.666S7.807 4.14 7.807 2.667Z"/><path d="M4.473 6c1.914 0 3.73 1.32 4.405 3.742.353 1.267-.727 2.258-1.836 2.258H1.904C.795 12-.285 11.009.068 9.742.744 7.32 2.56 6 4.473 6Z"/><path d="M10.163 9.384c-.325-1.166-.884-2.152-1.603-2.916A4.6 4.6 0 0 1 10.474 6c1.913 0 3.729 1.32 4.405 3.742.353 1.267-.727 2.258-1.836 2.258H9.694c.512-.697.746-1.624.469-2.616Z"/></svg>
                <span className="text-xs font-medium text-page-text">{formatCreators(campaign.creators)}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-foreground/[0.06] px-2 py-1">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 1.333C4.364 1.333 1.227 3.63 0 7.333c1.227 3.703 4.364 6 8 6s6.773-2.297 8-6c-1.227-3.703-4.364-6-8-6Zm0 9.667a3.667 3.667 0 1 0 0-7.333 3.667 3.667 0 0 0 0 7.333Zm0-1.833a1.833 1.833 0 1 0 0-3.667 1.833 1.833 0 0 0 0 3.667Z" fill="#1A67E5"/></svg>
                <span className="text-xs font-medium text-[#1A67E5]">{campaign.pricePerView}/1k</span>
              </div>
            </div>
            <div className="flex items-center gap-[1px] text-xs">
              <span className="font-medium text-page-text">{campaign.budgetSpent}</span>
              <span className="text-foreground/70">/</span>
              <span className="text-foreground/70">{campaign.budgetTotal}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1 w-full rounded-full bg-foreground/[0.06]">
            <div className="h-full rounded-full bg-page-text" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {/* View details button */}
        <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
          <button className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium text-page-text transition-colors hover:bg-foreground/[0.10]">
            View details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Hero Banner ── */
function HeroBanner({ campaigns }: { campaigns: Campaign[] }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive((i) => (i + 1) % campaigns.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [campaigns.length]);

  const go = (dir: -1 | 1) => {
    setActive((i) => (i + dir + campaigns.length) % campaigns.length);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive((i) => (i + 1) % campaigns.length), 5000);
  };

  const c = campaigns[active];
  const prev = (active - 1 + campaigns.length) % campaigns.length;
  const next = (active + 1) % campaigns.length;

  return (
    <div className="relative h-[240px] w-full md:h-[320px]">
      {/* Behind-left card (peeking) — desktop only */}
      <div
        className="absolute left-[-16px] top-[16px] hidden h-[288px] w-[90%] overflow-hidden rounded-2xl bg-cover bg-center opacity-30 transition-all duration-500 md:block"
        style={{ backgroundImage: `url(${campaigns[prev].bannerImage || campaigns[prev].thumbnail})` }}
      />
      {/* Behind-right card (peeking) — desktop only */}
      <div
        className="absolute right-[-16px] top-[16px] hidden h-[288px] w-[90%] overflow-hidden rounded-2xl bg-cover bg-center opacity-30 transition-all duration-500 md:block"
        style={{ backgroundImage: `url(${campaigns[next].bannerImage || campaigns[next].thumbnail})` }}
      />

      {/* Active card (front) */}
      <div className="absolute inset-0 z-10 overflow-hidden rounded-none shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-500 md:rounded-2xl">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${c.bannerImage || c.thumbnail})` }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(37,37,37,0.2), rgba(37,37,37,0.2)), linear-gradient(180deg, rgba(37,37,37,0.9) 0%, rgba(37,37,37,0) 29.62%), linear-gradient(0deg, rgba(37,37,37,0.9) 17.19%, rgba(37,37,37,0) 68.75%)" }} />
        <div className="relative z-10 flex h-full flex-col justify-between p-5">
          {/* Top bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button onClick={() => go(-1)} className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              <button onClick={() => go(1)} className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            </div>
            <div className="flex flex-1 items-center justify-end gap-1">
              <ImagePlatformPills platforms={c.platforms} category={c.category} />
            </div>
          </div>
          {/* Bottom info */}
          <div className="flex items-end justify-between gap-10 sm:gap-20">
            <div className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <img src={c.avatar} alt={c.brand} className="size-4 rounded-full border border-foreground/[0.06]" />
                  <span className="text-xs font-medium text-white">{c.brand}</span>
                  {c.isVerified && <VerifiedBadge size={12} />}
                  <span className="text-xs text-white/20">·</span>
                  <span className="text-xs text-white/50">{c.fundedAgo}</span>
                  <span className="hidden text-xs text-white/20 sm:inline">·</span>
                  <span className="hidden text-xs text-white/50 sm:inline">Application required</span>
                </div>
                <h2 className="max-w-[400px] text-lg font-medium leading-[135%] tracking-[-0.02em] text-white sm:text-xl">Clip for {c.brand} and earn {c.pricePerView} per 1k views.</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <GlassPill className="h-6 gap-1 py-2.5 pl-1.5 pr-2">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 1.333C4.364 1.333 1.227 3.63 0 7.333c1.227 3.703 4.364 6 8 6s6.773-2.297 8-6c-1.227-3.703-4.364-6-8-6Zm0 9.667a3.667 3.667 0 1 0 0-7.333 3.667 3.667 0 0 0 0 7.333Zm0-1.833a1.833 1.833 0 1 0 0-3.667 1.833 1.833 0 0 0 0 3.667Z" fill="white"/></svg>
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
            <button className="shrink-0 rounded-full px-5 py-2.5 text-sm font-medium text-white" style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}>
              Join campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Drag-to-scroll hook ── */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ dragging: false, startX: 0, scrollLeft: 0 });

  const pointerIdRef = useRef<number | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") return; // let touch scroll natively
    const el = ref.current;
    if (!el) return;
    state.current = { dragging: false, startX: e.clientX, scrollLeft: el.scrollLeft };
    pointerIdRef.current = e.pointerId;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (pointerIdRef.current === null) return;
    const el = ref.current;
    if (!el) return;
    const dx = Math.abs(e.clientX - state.current.startX);
    if (!state.current.dragging && dx > 5) {
      state.current.dragging = true;
      el.style.cursor = "grabbing";
      el.setPointerCapture(e.pointerId);
    }
    if (!state.current.dragging) return;
    e.preventDefault();
    el.scrollLeft = state.current.scrollLeft - (e.clientX - state.current.startX);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (pointerIdRef.current !== null && ref.current) {
      try { ref.current.releasePointerCapture(e.pointerId); } catch {}
    }
    pointerIdRef.current = null;
    state.current.dragging = false;
    if (ref.current) ref.current.style.cursor = "";
  }, []);

  return { ref, onPointerDown, onPointerMove, onPointerUp };
}

/* ── Scrollable campaign row ── */
function CampaignRow({ title, campaigns }: { title: string; campaigns: Campaign[] }) {
  const drag = useDragScroll();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex w-full max-w-[756px] items-center justify-between px-4 sm:px-5 md:px-4">
        <h3 className="text-base font-medium tracking-[-0.02em] text-page-text">{title}</h3>
        <button onClick={() => setExpanded(!expanded)} className="text-sm font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text">
          {expanded ? "Show less" : "See all"}
        </button>
      </div>

      {expanded ? (
        <div className="mx-auto grid w-full max-w-[756px] grid-cols-1 gap-2 px-4 sm:grid-cols-2 sm:px-5 md:px-4 lg:grid-cols-3">
          {campaigns.map((c) => (
            <div key={c.id} className="w-full *:!w-full *:!shrink">
              <CampaignCard campaign={c} />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={drag.ref}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onPointerCancel={drag.onPointerUp}
          className="flex cursor-default gap-2 overflow-x-auto pb-2 scrollbar-hide"
          style={{ paddingLeft: "max(16px, calc((100% - 756px) / 2 + 16px))" }}
        >
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
          <div className="w-px shrink-0" />
        </div>
      )}
    </div>
  );
}

/* ── Sort/Filter dropdown ── */
const SORT_OPTIONS = ["Featured", "Newest", "Budget (highest to lowest)", "CPM (highest to lowest)", "Paid out (highest to lowest)", "Creators (highest to lowest)"];
const FILTER_SECTIONS: Record<string, string[]> = {
  Content: ["All", "Slideshows", "Reposting", "Talking head", "Watermark"],
  Category: ["All", "Gaming", "Music", "Entertainment", "Sports", "Lifestyle", "Technology"],
  Type: ["All", "CPM", "Per video", "Retainer"],
  Budget: ["All", "Under $5K", "$5K–$20K", "$20K–$50K", "$50K+"],
};
const FILTER_KEYS = Object.keys(FILTER_SECTIONS);

function FilterBar({ search, onSearch, viewMode, onViewMode }: {
  search: string; onSearch: (v: string) => void;
  viewMode: "list" | "grid"; onViewMode: (v: "list" | "grid") => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sort, setSort] = useState("Featured");
  const [subMenu, setSubMenu] = useState<string | null>(null);
  const [filterSelections, setFilterSelections] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) { setDropdownOpen(false); setSubMenu(null); }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [dropdownOpen]);

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {/* Search */}
      <div className="flex h-9 w-full items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 md:w-[300px] md:flex-none dark:bg-white/[0.04]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50"><path d="M14 14l-3.5-3.5M10.5 6a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search campaigns..." className="w-full bg-transparent text-sm text-page-text outline-none placeholder:text-foreground/70 dark:placeholder:text-white/40" />
      </div>

      <div className="flex items-center gap-2">
        {/* View toggle — desktop only */}
        <div className="hidden items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5 md:flex dark:bg-white/[0.06]">
          <button onClick={() => onViewMode("list")} className={cn("flex size-8 items-center justify-center rounded-[10px] transition-all", viewMode === "list" ? "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg" : "")}>
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none"><path d="M2 0C.895 0 0 .895 0 2s.895 2 2 2 2-.895 2-2-.895-2-2-2Z" fill="currentColor" fillOpacity={viewMode === "list" ? 1 : 0.4}/><path d="M6.667 1.333C6.298 1.333 6 1.632 6 2s.298.667.667.667h4.666C11.702 2.667 12 2.368 12 2s-.298-.667-.667-.667H6.667Z" fill="currentColor" fillOpacity={viewMode === "list" ? 1 : 0.4}/><path d="M2 6.667C.895 6.667 0 7.562 0 8.667S.895 10.667 2 10.667s2-.895 2-2-.895-2-2-2Z" fill="currentColor" fillOpacity={viewMode === "list" ? 1 : 0.4}/><path d="M6.667 8C6.298 8 6 8.298 6 8.667s.298.666.667.666h4.666c.368 0 .667-.298.667-.666S11.702 8 11.333 8H6.667Z" fill="currentColor" fillOpacity={viewMode === "list" ? 1 : 0.4}/></svg>
          </button>
          <button onClick={() => onViewMode("grid")} className={cn("flex size-8 items-center justify-center rounded-[10px] transition-all", viewMode === "grid" ? "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg" : "")}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect width="5" height="5" rx="1" fill="currentColor" fillOpacity={viewMode === "grid" ? 1 : 0.4}/><rect x="7" width="5" height="5" rx="1" fill="currentColor" fillOpacity={viewMode === "grid" ? 1 : 0.4}/><rect y="7" width="5" height="5" rx="1" fill="currentColor" fillOpacity={viewMode === "grid" ? 1 : 0.4}/><rect x="7" y="7" width="5" height="5" rx="1" fill="currentColor" fillOpacity={viewMode === "grid" ? 1 : 0.4}/></svg>
          </button>
        </div>

        {/* Filter/sort button */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => { setDropdownOpen(!dropdownOpen); setSubMenu(null); }} className="flex size-9 items-center justify-center rounded-xl bg-foreground/[0.06] dark:bg-white/[0.06]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 flex w-64 flex-col rounded-xl border border-foreground/[0.06] bg-white p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:border-white/[0.06] dark:bg-[#1C1C1C]">
              {subMenu ? (
                <>
                  {/* Sub-menu header (mobile: click back) */}
                  <button onClick={() => setSubMenu(null)} className="flex items-center gap-2 px-2.5 pb-1 pt-2 text-sm text-page-text-subtle md:hidden">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {subMenu}
                  </button>
                  <span className="hidden px-2.5 pb-1 pt-2 text-sm text-page-text-subtle md:block">{subMenu}</span>
                  {FILTER_SECTIONS[subMenu]?.map((opt) => {
                    const selected = (filterSelections[subMenu] || "All") === opt;
                    return (
                      <button key={opt} onClick={() => { setFilterSelections((p) => ({ ...p, [subMenu]: opt })); setSubMenu(null); }} className="flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-sm text-page-text transition-colors hover:bg-foreground/[0.04]">
                        <span className="flex-1 text-left">{opt}</span>
                        {selected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                    );
                  })}
                </>
              ) : (
                <>
                  <span className="px-2.5 pb-1 pt-2 text-sm text-page-text-subtle">Sort by</span>
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt} onClick={() => setSort(opt)} className="flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-sm text-page-text transition-colors hover:bg-foreground/[0.04]">
                      <span className="flex-1 text-left">{opt}</span>
                      {sort === opt && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                  ))}
                  <div className="mx-2.5 my-1 border-t border-foreground/[0.06]" />
                  <span className="px-2.5 pb-1 pt-2 text-sm text-page-text-subtle">Filter by</span>
                  {FILTER_KEYS.map((key) => (
                    <div key={key} className="group/filter relative">
                      <button
                        onClick={() => setSubMenu(key)}
                        className={cn("flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-sm text-page-text transition-colors hover:bg-foreground/[0.04]", filterSelections[key] && filterSelections[key] !== "All" && "bg-foreground/[0.06]")}
                      >
                        <span className="flex-1 text-left">{key}</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      {/* Desktop: hover submenu */}
                      <div className="pointer-events-none absolute bottom-0 right-full z-50 mr-2 hidden opacity-0 transition-opacity group-hover/filter:pointer-events-auto group-hover/filter:opacity-100 lg:block">
                        <div className="flex w-64 flex-col rounded-xl border border-foreground/[0.06] bg-white p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:border-white/[0.06] dark:bg-[#1C1C1C]">
                          <span className="px-2.5 pb-1 pt-2 text-sm text-page-text-subtle">{key}</span>
                          {FILTER_SECTIONS[key]?.map((opt) => {
                            const selected = (filterSelections[key] || "All") === opt;
                            return (
                              <button key={opt} onClick={() => setFilterSelections((p) => ({ ...p, [key]: opt }))} className="flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-sm text-page-text transition-colors hover:bg-foreground/[0.04]">
                                <span className="flex-1 text-left">{opt}</span>
                                {selected && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function CreatorDiscoverPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-page-bg font-inter tracking-[-0.02em]">
      <div className="flex flex-col gap-6 md:py-4">
        {/* Hero — full-bleed on mobile, contained on desktop */}
        <div className="md:mx-auto md:w-full md:max-w-[756px] md:px-4">
          <HeroBanner campaigns={BANNER_CAMPAIGNS} />
        </div>

        {/* Filter bar */}
        <div className="mx-auto w-full max-w-[756px] px-4 sm:px-5 md:px-4">
          <FilterBar search={search} onSearch={setSearch} viewMode={viewMode} onViewMode={setViewMode} />
        </div>

        {viewMode === "grid" ? (
          <>
            <CampaignRow title="Verified campaigns" campaigns={[...FEATURED_CAMPAIGNS, ...GRID_CAMPAIGNS].slice(0, 5)} />
            <CampaignRow title="Trending campaigns" campaigns={GRID_CAMPAIGNS.slice(0, 6)} />
          </>
        ) : (
          <div className="mx-auto flex w-full max-w-[756px] flex-col gap-2 px-4 sm:px-5 md:px-4">
            {[...FEATURED_CAMPAIGNS, ...GRID_CAMPAIGNS].map((c) => (
              <CampaignListCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
