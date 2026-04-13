"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((dir: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex w-full max-w-[756px] items-center justify-between px-4 sm:px-5 md:px-4">
        <h3 className="text-base font-medium tracking-[-0.02em] text-page-text">{title}</h3>
        <div className="flex items-center gap-3">
          <button onClick={() => setExpanded(!expanded)} className="text-sm font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text">
            {expanded ? "Show less" : "See all"}
          </button>
          {!expanded && (
            <div className="hidden items-center sm:flex">
              <button
                onClick={() => scrollBy("left")}
                className="flex h-[34px] w-[42px] items-center justify-center rounded-l-full border border-r-0 border-foreground/[0.12] text-page-text-muted transition-colors hover:bg-foreground/[0.04] hover:text-page-text dark:border-white/[0.12] dark:hover:bg-white/[0.04]"
                style={{ opacity: 0.6 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                onClick={() => scrollBy("right")}
                className="flex h-[34px] w-[42px] items-center justify-center rounded-r-full border border-foreground/[0.12] text-page-text-muted transition-colors hover:bg-foreground/[0.04] hover:text-page-text dark:border-white/[0.12] dark:hover:bg-white/[0.04]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {expanded ? (
        <div className="mx-auto flex w-full max-w-[1024px] flex-wrap gap-2 px-4 sm:px-5 md:px-4">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      ) : (
        <div
          ref={(el) => { (drag.ref as React.MutableRefObject<HTMLDivElement | null>).current = el; scrollContainerRef.current = el; }}
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
  Type: ["All", "CPM", "Per video", "Retainer"],
  Budget: ["All", "Under $5K", "$5K–$20K", "$20K–$50K", "$50K+"],
};
const FILTER_KEYS = Object.keys(FILTER_SECTIONS);

function FilterBar({ search, onSearch, viewMode, onViewMode, verifiedOnly, onVerifiedToggle, showHelpMePick }: {
  search: string; onSearch: (v: string) => void;
  viewMode: "list" | "grid"; onViewMode: (v: "list" | "grid") => void;
  verifiedOnly?: boolean; onVerifiedToggle?: () => void;
  showHelpMePick?: boolean;
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
    <div className="flex items-center justify-between gap-2 py-1">
      {/* Search + Help me pick */}
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-full items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 md:w-[300px] md:flex-none dark:bg-white/[0.04]">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0"><path d="M11.4167 11.4167L8.78333 8.78333M10.0833 5.41667C10.0833 7.994 7.994 10.0833 5.41667 10.0833C2.83934 10.0833 0.75 7.994 0.75 5.41667C0.75 2.83934 2.83934 0.75 5.41667 0.75C7.994 0.75 10.0833 2.83934 10.0833 5.41667Z" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search campaigns..." className="w-full bg-transparent text-sm text-page-text outline-none placeholder:text-foreground/70 dark:placeholder:text-white/40" />
        </div>
        {showHelpMePick && (
          <Link
            href="/creator/feed"
            className="hidden shrink-0 items-center gap-1.5 text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text sm:flex"
          >
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" className="shrink-0"><path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.625 3.125C4.41789 3.125 4.25 3.29289 4.25 3.5C4.25 3.70711 4.07711 3.875 3.875 3.875C3.66789 3.875 3.5 3.70711 3.5 3.5C3.5 2.87868 4.00368 2.375 4.625 2.375H5.15C5.82132 2.375 6.375 2.92868 6.375 3.6C6.375 4.05195 6.12524 4.46458 5.73047 4.67695L5.375 4.86829V5.125C5.375 5.33211 5.20711 5.5 5 5.5C4.79289 5.5 4.625 5.33211 4.625 5.125V4.625C4.625 4.48886 4.69886 4.36263 4.81797 4.29805L5.37523 4.00017C5.54755 3.90714 5.625 3.76005 5.625 3.6C5.625 3.34315 5.40685 3.125 5.15 3.125H4.625ZM5 6.875C5.20711 6.875 5.375 6.70711 5.375 6.5C5.375 6.29289 5.20711 6.125 5 6.125C4.79289 6.125 4.625 6.29289 4.625 6.5C4.625 6.70711 4.79289 6.875 5 6.875Z" fill="currentColor"/></svg>
            Help me pick
          </Link>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {/* View toggle + verified — desktop only */}
        <div className="hidden items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5 md:flex dark:bg-white/[0.06]">
          {/* Verified toggle */}
          {onVerifiedToggle && (
            <button
              onClick={onVerifiedToggle}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-[10px] px-2.5 text-xs font-medium tracking-[-0.02em] transition-all",
                verifiedOnly
                  ? "bg-white text-[#E57100] shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg"
                  : "text-page-text-muted"
              )}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M5.8.8C6.5.1 7.5.1 8.2.8L8.9 1.5l1-.2c.9-.2 1.8.4 2 1.3l.2 1 .9.5c.8.4 1.1 1.4.7 2.2l-.5.9.5.9c.4.8.1 1.8-.7 2.2l-.9.5-.2 1c-.2.9-1.1 1.5-2 1.3l-1-.2-.7.7c-.7.7-1.7.7-2.4 0l-.7-.7-1 .2c-.9.2-1.8-.4-2-1.3l-.2-1-.9-.5c-.8-.4-1.1-1.4-.7-2.2l.5-.9-.5-.9c-.4-.8-.1-1.8.7-2.2l.9-.5.2-1C2.3 1.7 3.2 1.1 4.1 1.3l1 .2.7-.7Z" fill={verifiedOnly ? "#E57100" : "currentColor"} fillOpacity={verifiedOnly ? 1 : 0.4}/><path d="M5 7l1.5 1.5 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Verified
            </button>
          )}
          <button onClick={() => onViewMode("list")} className={cn("flex size-8 items-center justify-center rounded-[10px] transition-all", viewMode === "list" ? "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg" : "")}>
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
              <rect x="0.25" y="0.25" width="3.5" height="3.5" rx="0.75" fill="currentColor" fillOpacity={viewMode === "list" ? 1 : 0.4}/>
              <path d="M6.667 1.333C6.298 1.333 6 1.632 6 2s.298.667.667.667h4.666C11.702 2.667 12 2.368 12 2s-.298-.667-.667-.667H6.667Z" fill="currentColor" fillOpacity={viewMode === "list" ? 1 : 0.4}/>
              <rect x="0.25" y="6.917" width="3.5" height="3.5" rx="0.75" fill="currentColor" fillOpacity={viewMode === "list" ? 1 : 0.4}/>
              <path d="M6.667 8C6.298 8 6 8.298 6 8.667s.298.666.667.666h4.666c.368 0 .667-.298.667-.666S11.702 8 11.333 8H6.667Z" fill="currentColor" fillOpacity={viewMode === "list" ? 1 : 0.4}/>
            </svg>
          </button>
          <button onClick={() => onViewMode("grid")} className={cn("flex size-8 items-center justify-center rounded-[10px] transition-all", viewMode === "grid" ? "bg-white shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-card-bg" : "")}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ opacity: viewMode === "grid" ? 1 : 0.4 }}>
              <rect x="3" y="3" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="11" y="3" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="3" y="11" width="6" height="6" rx="1.5" fill="currentColor"/>
              <circle cx="14" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M16 16l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Filter/sort button */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => { setDropdownOpen(!dropdownOpen); setSubMenu(null); }} className="relative flex size-9 items-center justify-center rounded-xl bg-foreground/[0.06] dark:bg-white/[0.06]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {Object.values(filterSelections).filter((v) => v && v !== "All").length > 0 && (
              <div className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] text-white" style={{ fontWeight: 800 }}>
                {Object.values(filterSelections).filter((v) => v && v !== "All").length}
              </div>
            )}
          </button>

          {/* Dropdown */}
          <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full z-50 mt-2 flex w-64 flex-col rounded-xl border border-foreground/[0.06] bg-white p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:border-white/[0.06] dark:bg-[#1C1C1C]">
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
                      <div className="pointer-events-none absolute bottom-0 right-full z-50 hidden pr-2 opacity-0 transition-opacity group-hover/filter:pointer-events-auto group-hover/filter:opacity-100 lg:block">
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
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = ["All Categories", "Entertainment", "Gaming", "Technology", "Lifestyle", "Sports", "Music"];

function FloatingCategoryBar({ onShuffle }: { onShuffle: () => void }) {
  const [catOpen, setCatOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState("All Categories");
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!catOpen) return;
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [catOpen]);

  return (
    <div ref={catRef} className="sticky bottom-5 z-40 ml-4 self-start sm:ml-5 md:ml-4">
      {/* Dropdown — opens upward, same width + style as bar */}
      <AnimatePresence>
        {catOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.1 } }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-0 mb-1 flex w-full flex-col rounded-[10px] p-1"
            style={{ background: "var(--tooltip-bg, rgba(6,7,16,0.92))", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCat(cat); setCatOpen(false); }}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors hover:bg-white/[0.08]"
                style={{ color: "var(--tooltip-text, white)", opacity: selectedCat === cat ? 1 : 0.6 }}
              >
                {cat !== "All Categories" && CATEGORY_ICONS[cat] && <span className="flex size-4 items-center justify-center text-white/70">{CATEGORY_ICONS[cat]}</span>}
                <span className="flex-1 text-left">{cat}</span>
                {selectedCat === cat && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bar */}
      <div
        className="flex items-center rounded-[10px] p-1"
        style={{ background: "var(--tooltip-bg, rgba(6,7,16,0.92))", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      >
        {/* Category button — shows selected category's icon */}
        <button onClick={() => setCatOpen((v) => !v)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-white/[0.08]">
          <span className="flex size-4 shrink-0 items-center justify-center opacity-80" style={{ color: "var(--tooltip-text, white)" }}>
            {selectedCat !== "All Categories" && CATEGORY_ICONS[selectedCat] ? CATEGORY_ICONS[selectedCat] : (
              <svg width="14" height="18" viewBox="0 0 16 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M13.617 6.188c-.532-.22-1.234-.408-2.104-.64l-.707-.188c-.87-.232-1.571-.419-2.143-.492-.594-.076-1.121-.041-1.608.238-.487.28-.782.717-1.013 1.268-.222.53-.41 1.228-.643 2.092l-.701 2.602c-.233.865-.421 1.563-.495 2.132-.076.592-.042 1.118.24 1.604.282.485.722.778 1.274 1.008.532.22 1.234.408 2.104.64l.707.188c.87.232 1.572.419 2.143.492.594.076 1.122.041 1.609-.238.487-.28.782-.717 1.013-1.268.222-.53.41-1.228.643-2.093l.701-2.601c.233-.865.421-1.563.495-2.132.077-.592.041-1.118-.24-1.604-.282-.485-.722-.779-1.274-1.008z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M4.283 7.978a.5.5 0 0 0-.45.828c-.647.186-.914.318-1.075.595a1.14 1.14 0 0 0-.096.872c.061.481.225 1.102.469 2.016l.675 2.533c.244.914.41 1.534.597 1.981.179.43.339.605.514.706.176.1.41.151.875.09.483-.063 1.107-.23 2.025-.477l.315-.085a.5.5 0 0 1 .259.966l-.36.097c-.86.232-1.571.424-2.153.5-.611.08-1.181.049-1.712-.256-.531-.305-.844-.78-1.08-1.349-.226-.54-.414-1.248-.643-2.105l-.699-2.624c-.228-.857-.417-1.565-.49-2.146-.077-.611-.042-1.18.266-1.71.457-.788 1.303-1.112 2.321-1.413a.5.5 0 0 1 .378.45z" fill="currentColor"/>
              </svg>
            )}
          </span>
          <span className="font-inter text-[14px] font-medium opacity-80" style={{ color: "var(--tooltip-text, white)" }}>{selectedCat}</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={cn("opacity-80 transition-transform", catOpen && "rotate-180")}>
            <path d="M5.5 7L8 9.5L10.5 7" stroke="var(--tooltip-text, white)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Divider */}
        <div className="mx-0.5 h-[18px] w-px rounded-full" style={{ background: "var(--tooltip-text, white)", opacity: 0.15 }} />

        {/* Shuffle button — orange gradient on hover */}
        <button onClick={onShuffle} className="group/shuffle relative flex items-center gap-1 overflow-hidden rounded-lg px-2.5 py-2 transition-all">
          {/* Orange gradient bg — hidden by default, shown on hover */}
          <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 group-hover/shuffle:opacity-100" style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="relative z-10 opacity-30 transition-opacity group-hover/shuffle:opacity-100">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.861 6.817c.515.2.771.779.572 1.294-.577 1.492-.577 2.786 0 4.278.2.515-.056 1.095-.571 1.294-.516.2-1.095-.056-1.294-.572C.81 11.154.81 9.346 1.567 7.39c.2-.515.779-.771 1.294-.572z" fill="var(--tooltip-text, white)"/>
            <path d="M11.387 8.217l4.88-2.921c1.617-.968 3.685-.393 4.618 1.283l1.031 1.852c2.231 4.008.907 9.133-2.958 11.447-2.599 1.556-5.814 1.49-8.352-.17l-5.571-3.644a.75.75 0 0 1-.265-.982l.111-.756c.187-1.276 1.337-2.153 2.567-1.959l1.339.212-3.381-6.072a1.75 1.75 0 0 1 .825-2.38 1.75 1.75 0 0 1 2.254.856l2.254 4.048z" fill="var(--tooltip-text, white)"/>
          </svg>
          <span className="relative z-10 font-inter text-[14px] font-medium opacity-30 transition-opacity group-hover/shuffle:opacity-100" style={{ color: "var(--tooltip-text, white)" }}>Shuffle</span>
        </button>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function CreatorDiscoverPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [filterFloating, setFilterFloating] = useState(false);

  const shuffledVerified = useMemo(() => {
    const arr = [...FEATURED_CAMPAIGNS, ...GRID_CAMPAIGNS].slice(0, 5);
    if (shuffleKey === 0) return arr;
    return [...arr].sort(() => Math.random() - 0.5);
  }, [shuffleKey]);

  const shuffledTrending = useMemo(() => {
    const arr = GRID_CAMPAIGNS.slice(0, 6);
    if (shuffleKey === 0) return arr;
    return [...arr].sort(() => Math.random() - 0.5);
  }, [shuffleKey]);

  const handleShuffle = useCallback(() => {
    setIsShuffling(true);
    setTimeout(() => {
      setShuffleKey((k) => k + 1);
      setTimeout(() => setIsShuffling(false), 300);
    }, 150);
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (!filterBarRef.current) return;
      const rect = filterBarRef.current.getBoundingClientRect();
      setFilterFloating(rect.bottom < 0);
    };
    // Listen on all scroll containers
    const scrollEls: EventTarget[] = [window];
    let el: HTMLElement | null = filterBarRef.current;
    while (el) {
      if (el.scrollHeight > el.clientHeight) scrollEls.push(el);
      el = el.parentElement;
    }
    scrollEls.forEach((e) => e.addEventListener("scroll", checkScroll, { passive: true }));
    return () => scrollEls.forEach((e) => e.removeEventListener("scroll", checkScroll));
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-page-bg font-inter tracking-[-0.02em]">
      <div className="flex flex-col gap-4 pb-5 md:py-4">
        {/* Hero — full-bleed on mobile, contained on desktop */}
        <div className="md:mx-auto md:w-full md:max-w-[756px] md:px-4">
          <HeroBanner campaigns={BANNER_CAMPAIGNS} />
        </div>

        {/* Filter bar */}
        <div ref={filterBarRef} className="mx-auto w-full max-w-[756px] px-4 sm:px-5 md:px-4">
          <FilterBar search={search} onSearch={setSearch} viewMode={viewMode} onViewMode={setViewMode} />
        </div>

        {/* Floating filter bar — sticky, no layout jump */}
        <div className="sticky top-0 z-30 h-0">
          <div
            className={cn(
              "mx-auto w-full max-w-[900px] px-4 pt-2 transition-all duration-200 ease-out sm:px-5 md:px-4",
              filterFloating ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
            )}
          >
            <div
              className="rounded-[10px] border border-border px-2 dark:border-white/[0.06]"
              style={{ background: "var(--page-bg, rgba(255,255,255,0.92))", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", boxShadow: "0px 8px 24px rgba(0,0,0,0.06), 0px 2px 6px rgba(0,0,0,0.04)" }}
            >
              <FilterBar search={search} onSearch={setSearch} viewMode={viewMode} onViewMode={setViewMode} verifiedOnly={verifiedOnly} onVerifiedToggle={() => setVerifiedOnly((v) => !v)} showHelpMePick />
            </div>
          </div>
        </div>

        <div className={cn("transition-all duration-300", isShuffling ? "scale-[0.98] opacity-40 blur-[2px]" : "scale-100 opacity-100 blur-0")}>
          {viewMode === "grid" ? (
            <>
              <CampaignRow title="Verified campaigns" campaigns={shuffledVerified} />
              <div className="h-4" />
              <CampaignRow title="Trending campaigns" campaigns={shuffledTrending} />
            </>
          ) : (
            <div className="mx-auto flex w-full max-w-[756px] flex-col gap-2 px-4 sm:px-5 md:px-4">
              {[...shuffledVerified, ...shuffledTrending].map((c) => (
                <CampaignListCard key={`${c.id}-${shuffleKey}`} campaign={c} />
              ))}
            </div>
          )}
        </div>

        {/* Floating category + shuffle bar — sticks to bottom of scroll viewport */}
        <FloatingCategoryBar onShuffle={handleShuffle} />
      </div>
    </div>
  );
}
