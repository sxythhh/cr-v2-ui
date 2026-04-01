"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { Modal } from "@/components/ui/modal";
import { type Platform, type Campaign, PILL_MASK, formatCreators, BANNER_CAMPAIGNS, FEATURED_CAMPAIGNS, GRID_CAMPAIGNS } from "./_shared";
import { VerifiedBadge, PlatformPills, CpmPill, PersonIcon } from "./_shared-components";


const ALL_CATEGORIES = ["All", "Gaming", "Music", "Entertainment", "Sports", "Lifestyle", "Technology"];
const SORT_OPTIONS = ["Featured", "Newest", "Highest Budget", "Highest CPM"];

// ── Campaign Card ────────────────────────────────────────────────────

function CampaignCard({ campaign, description, beforeStats, afterPlatformPills, className }: {
  campaign: Campaign;
  description?: React.ReactNode;
  beforeStats?: React.ReactNode;
  afterPlatformPills?: React.ReactNode;
  className?: string;
}) {
  const clamped = 4 + (Math.max(0, Math.min(100, campaign.progressPercentage)) / 100) * 96;
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-white will-change-[transform,contents] discover-card-border dark:bg-[#1C1C1C]", className)}>
      {/* Thumbnail */}
      <div className="relative aspect-video w-full">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${campaign.thumbnail})` }} />
        <div className="pointer-events-none absolute inset-0 verified-card-image-fade" />
      </div>
      {/* Body */}
      <div className="relative flex w-full flex-col gap-2 bg-white px-4 pb-4 pt-3 dark:bg-[#1C1C1C]">
        {/* Brand row */}
        <div className="flex w-full items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <div className="relative size-5 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.4)]">
              <img src={campaign.avatar} alt={campaign.brand} className="size-full object-cover" />
            </div>
            <div className="flex min-w-0 items-center gap-1">
              <span className="truncate text-xs font-medium leading-[1.2] text-page-text">{campaign.brand}</span>
              {campaign.isVerified && <VerifiedBadge />}
              <span className="text-xs font-medium leading-[1.2] text-foreground/40">·</span>
              <span className="shrink-0 text-xs font-medium leading-[1.2] text-foreground/40">{campaign.fundedAgo}</span>
            </div>
          </div>
          <div className="ml-auto flex shrink-0 items-center pl-2">
            <PlatformPills platforms={campaign.platforms} />
            {afterPlatformPills}
          </div>
        </div>
        {/* Title + expand area */}
        <div className="flex w-full flex-col gap-1.5">
          <h3 className="line-clamp-1 text-sm font-semibold leading-5 tracking-[-0.18px] text-page-text">{campaign.title}</h3>
          {description}
          {beforeStats}
          {/* Stats row */}
          <div className="flex w-full items-center justify-between">
            <div className="whitespace-nowrap text-xs font-semibold leading-[14px]">
              <span className="text-page-text">{campaign.budgetSpent}</span>
              <span className="text-foreground/40">/{campaign.budgetTotal}</span>
            </div>
            <div className="flex items-center -space-x-1">
              <div className="relative z-[1] flex h-6 items-center gap-[2px] rounded-full px-2 py-[3px] verified-pill-glass">
                <span className="pointer-events-none absolute inset-0 rounded-full verified-pill-border" style={PILL_MASK} />
                <PersonIcon />
                <span className="text-xs font-semibold leading-[1.2] text-page-text">{formatCreators(campaign.creators)}</span>
              </div>
              <CpmPill cpm={campaign.pricePerView} />
            </div>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="relative h-1 w-full">
        <div className="absolute inset-0 verified-progress-track" />
        <div className="absolute inset-y-0 left-0 verified-progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

// ── Verified Card (hover expand) ─────────────────────────────────────

function VerifiedCard({ campaign, onClick, style }: { campaign: Campaign; onClick: () => void; style?: React.CSSProperties }) {
  return (
    <div className="group/card relative cursor-pointer text-left focus-visible:outline-none lg:hover:z-30" onClick={onClick} style={style}>
      <CampaignCard
        campaign={campaign}
        className="w-full lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[320px] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:transition-shadow lg:duration-200 lg:group-hover/card:shadow-xl"
        afterPlatformPills={
          <div className="ml-1 max-w-0 overflow-hidden opacity-0 transition-[max-width,opacity] duration-200 lg:group-hover/card:max-w-[160px] lg:group-hover/card:opacity-100 verified-expand-ease" style={{ "--expand-stagger": "20ms" } as React.CSSProperties}>
            <div className="relative flex h-6 items-center gap-1 whitespace-nowrap rounded-full px-2 py-[3px] text-page-text verified-pill-glass">
              <span className="pointer-events-none absolute inset-0 rounded-full verified-pill-border" style={PILL_MASK} />
              <span className="text-xs font-semibold leading-[1.2]">{campaign.category}</span>
            </div>
          </div>
        }
        description={
          <div className="grid grid-rows-[0fr] lg:group-hover/card:grid-rows-[1fr] verified-expand" style={{ "--expand-stagger": "40ms" } as React.CSSProperties}>
            <div className="overflow-hidden">
              <p className="line-clamp-2 pb-1 text-xs leading-[150%] text-foreground/60">{campaign.description}</p>
            </div>
          </div>
        }
        beforeStats={
          <div className="grid grid-rows-[0fr] lg:group-hover/card:grid-rows-[1fr] verified-expand" style={{ "--expand-stagger": "60ms" } as React.CSSProperties}>
            <div className="overflow-hidden">
              <button className="mb-1 flex h-9 w-full items-center justify-center rounded-full text-sm font-semibold join-campaign-btn transition-[transform,filter] duration-150 hover:brightness-110 active:scale-[0.96]">
                Join Campaign
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
}

// ── Hero Banner ──────────────────────────────────────────────────────

function HeroBanner({ campaigns, onSlideClick }: { campaigns: Campaign[]; onSlideClick: (c: Campaign) => void }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (paused || campaigns.length <= 1) return;
    timerRef.current = setInterval(() => setActive((i) => (i + 1) % campaigns.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [paused, campaigns.length]);

  const go = (dir: -1 | 1) => {
    setActive((i) => (i + dir + campaigns.length) % campaigns.length);
    clearInterval(timerRef.current);
  };

  return (
    <div
      className="group/banner relative h-[50svh] min-h-[340px] overflow-hidden sm:h-[clamp(28vh,42vw,70vh)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {campaigns.map((c, i) => {
        const isActive = i === active;
        return (
          <div key={c.id} className={cn("absolute inset-0 transition-opacity duration-700 ease-out", isActive ? "z-10 opacity-100" : "z-0 opacity-0")}>
            {/* Desktop */}
            <div className="hidden size-full sm:block">
              <div className="absolute inset-0">
                <div className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${c.bannerImage || c.thumbnail})` }} />
                <div className="pointer-events-none absolute inset-0 hero-banner-vignette" />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] hero-banner-bottom-fade" />
              <div className="pointer-events-none absolute inset-x-0 bottom-[72px] z-[15] px-12">
                <div className="flex max-w-[770px] flex-col items-start gap-4">
                  {/* Info */}
                  <div className="flex max-w-[400px] flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <div className="relative size-6 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.4)]">
                        <img src={c.avatar} alt={c.brand} className="size-full object-cover" />
                      </div>
                      <span className="text-sm font-medium leading-[1.2] tracking-[-0.09px] text-white">{c.brand}</span>
                      {c.isVerified && <VerifiedBadge />}
                    </div>
                    <h2 className="text-[clamp(18px,3.125vw,32px)] font-semibold leading-[1.2] tracking-[clamp(-0.69px,-0.06vw,-0.26px)] text-white">{c.title}</h2>
                    <div className="flex items-center gap-1 text-sm leading-5 tracking-[0.01em] text-white/72">
                      <span>{c.category}</span>
                      <span className="text-white/70">·</span>
                      <span className="font-semibold text-white">{c.pricePerView}</span>
                      <span className="font-semibold text-white/40">/1K views</span>
                      <span className="text-white/70">·</span>
                      <span className="text-white/70">{c.budgetTotal}</span>
                    </div>
                  </div>
                  {/* Button */}
                  <div className="pointer-events-auto">
                    <button onClick={() => onSlideClick(c)} className="relative flex h-12 items-center justify-center rounded-[40px] px-8 text-base font-semibold text-white transition-[transform,filter] duration-150 hover:brightness-110 active:scale-[0.96] hero-join-btn dark:text-black">
                      <span className="pointer-events-none absolute inset-0 rounded-[40px] verified-pill-border" style={PILL_MASK} />
                      Join Campaign
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile */}
            <div className="flex h-full flex-col sm:hidden">
              <div className="relative h-[56%] shrink-0 overflow-hidden">
                <div className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${c.bannerImage || c.thumbnail})` }} />
                <div className="pointer-events-none absolute inset-0 hero-banner-vignette" />
              </div>
              <div className="relative flex-1 bg-white dark:bg-[#151515]">
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-3 pb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <div className="relative size-5 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1)]">
                        <img src={c.avatar} alt={c.brand} className="size-full object-cover" />
                      </div>
                      <span className="text-xs font-medium leading-[1.2] text-page-text">{c.brand}</span>
                      {c.isVerified && <VerifiedBadge />}
                    </div>
                    <h2 className="line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.26px] text-page-text">{c.title}</h2>
                    <div className="flex items-center gap-1 text-sm leading-5 text-foreground/60">
                      <span>{c.category}</span>
                      <span>·</span>
                      <span className="font-semibold text-page-text">{c.pricePerView}</span>
                      <span className="font-semibold text-foreground/40">/1K views</span>
                      <span>·</span>
                      <span>{c.budgetTotal}</span>
                    </div>
                  </div>
                  <button onClick={() => onSlideClick(c)} className="relative flex h-12 items-center justify-center rounded-[40px] px-8 text-base font-semibold text-white hero-join-btn dark:text-black">
                    <span className="pointer-events-none absolute inset-0 rounded-[40px] verified-pill-border" style={PILL_MASK} />
                    Join Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Nav arrows */}
      <button onClick={() => go(-1)} className="absolute left-3 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white/80 backdrop-blur-sm transition-transform active:scale-[0.92] dark:border-white/15 dark:bg-black/50 sm:left-6 sm:size-10">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button onClick={() => go(1)} className="absolute right-3 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white/80 backdrop-blur-sm transition-transform active:scale-[0.92] dark:border-white/15 dark:bg-black/50 sm:right-6 sm:size-10">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
        {campaigns.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className={cn("size-2 rounded-full transition-all", i === active ? "w-5 bg-white" : "bg-white/40")} />
        ))}
      </div>
    </div>
  );
}

// ── Filter Bar ───────────────────────────────────────────────────────

function FilterBar({ search, onSearch, category, onCategory, sort, onSort, platforms, onTogglePlatform }: {
  search: string; onSearch: (v: string) => void;
  category: string; onCategory: (v: string) => void;
  sort: string; onSort: (v: string) => void;
  platforms: Platform[]; onTogglePlatform: (p: Platform) => void;
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const allPlatforms: Platform[] = ["youtube", "tiktok", "instagram", "x"];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
      {/* Search */}
      <div className="flex h-9 min-w-[120px] flex-1 items-center gap-2 rounded-full bg-foreground/[0.04] px-3 sm:min-w-[160px] dark:bg-white/[0.04]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-foreground/40"><path d="M13 13l-3.5-3.5M10 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search campaigns..." className="w-full bg-transparent text-sm text-page-text outline-none placeholder:text-foreground/40" />
      </div>
      {/* Sort */}
      <div className="relative">
        <button onClick={() => setSortOpen(!sortOpen)} className="flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-page-text discover-filter-pill">
          {sort}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={cn("transition-transform", sortOpen && "rotate-180")}><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {sortOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 w-[200px] sm:left-auto sm:right-0 rounded-2xl border border-foreground/[0.06] bg-white p-1 shadow-xl dark:border-white/[0.1] dark:bg-[#1C1C1C]">
            {SORT_OPTIONS.map((s) => (
              <button key={s} onClick={() => { onSort(s); setSortOpen(false); }} className={cn("flex w-full items-center rounded-xl px-3 py-2.5 text-sm", sort === s ? "bg-foreground/[0.04] font-medium text-page-text" : "text-foreground/60 hover:bg-foreground/[0.02]")}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Category */}
      <div className="relative">
        <button onClick={() => setCatOpen(!catOpen)} className={cn("flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium", category === "All" ? "text-foreground/60 discover-filter-pill-muted" : "text-page-text discover-filter-pill")}>
          {category === "All" ? "Category" : category}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={cn("transition-transform", catOpen && "rotate-180")}><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {catOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 w-[200px] sm:left-auto sm:right-0 rounded-2xl border border-foreground/[0.06] bg-white p-1 shadow-xl dark:border-white/[0.1] dark:bg-[#1C1C1C]">
            {ALL_CATEGORIES.map((c) => (
              <button key={c} onClick={() => { onCategory(c); setCatOpen(false); }} className={cn("flex w-full items-center rounded-xl px-3 py-2.5 text-sm", category === c ? "bg-foreground/[0.04] font-medium text-page-text" : "text-foreground/60 hover:bg-foreground/[0.02]")}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Platform toggles */}
      {allPlatforms.map((p) => (
        <button key={p} onClick={() => onTogglePlatform(p)} className={cn("flex size-9 shrink-0 items-center justify-center rounded-full transition-[transform,background] duration-150 active:scale-[0.95]", platforms.includes(p) ? "text-page-text discover-filter-pill" : "text-foreground/30 discover-filter-pill-muted")}>
          <PlatformIcon platform={p} size={16} />
        </button>
      ))}
    </div>
  );
}

// ── Featured Row ─────────────────────────────────────────────────────

function FeaturedRow({ campaigns, onCardClick }: { campaigns: Campaign[]; onCardClick: (c: Campaign) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold tracking-tight text-page-text md:text-xl">Featured</h3>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {campaigns.map((c) => (
          <div key={c.id} className="w-[260px] shrink-0 cursor-pointer sm:w-[320px]" onClick={() => onCardClick(c)}>
            <CampaignCard campaign={c} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Campaign Grid ────────────────────────────────────────────────────

function CampaignGridSection({ campaigns, onCardClick }: { campaigns: Campaign[]; onCardClick: (c: Campaign) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold tracking-tight text-page-text md:text-xl">All campaigns</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-3">
        {campaigns.map((c, i) => (
          <div key={c.id} className="card-enter-anim relative" style={{ "--enter-d": `${Math.min(i * 25, 200)}ms` } as React.CSSProperties}>
            {/* Invisible spacer */}
            <div className="invisible hidden sm:block"><div className="aspect-video w-full" /><div className="h-[120px]" /></div>
            <div className="sm:absolute sm:inset-0">
              <VerifiedCard campaign={c} onClick={() => onCardClick(c)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Campaign Detail Modal ────────────────────────────────────────────

function CampaignDetailModal({ campaign, open, onClose }: { campaign: Campaign | null; open: boolean; onClose: () => void }) {
  if (!campaign) return null;
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[800px]" showClose={false}>
      <div className="flex max-h-[85vh] flex-col overflow-hidden md:max-h-[704px]">
        <button onClick={onClose} className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-xl transition-colors hover:bg-black/30">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M10 5a.833.833 0 0 1 .833-.833h2.5A2.5 2.5 0 0 1 15.833 6.667v2.5a.833.833 0 1 1-1.666 0v-2.5a.833.833 0 0 0-.834-.834h-2.5A.833.833 0 0 1 10 5ZM5 10a.833.833 0 0 1 .833.833v2.5c0 .46.373.834.834.834h2.5a.833.833 0 1 1 0 1.666h-2.5a2.5 2.5 0 0 1-2.5-2.5v-2.5A.833.833 0 0 1 5 10Z" fill="white"/></svg>
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          {/* Hero */}
          <div className="relative aspect-video w-full overflow-hidden">
            <div className="size-full bg-cover bg-center" style={{ backgroundImage: `url(${campaign.thumbnail})` }} />
          </div>
          {/* Content */}
          <div className="flex flex-col gap-4 px-5 pb-5 pt-5 sm:px-8">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="relative size-6 shrink-0 overflow-hidden rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1)]">
                <img src={campaign.avatar} alt={campaign.brand} className="size-full object-cover" />
              </div>
              <span className="text-sm font-medium tracking-[-0.09px] text-page-text">{campaign.brand}</span>
              {campaign.isVerified && <VerifiedBadge />}
            </div>
            {/* Title */}
            <h2 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.6px] text-page-text sm:text-[32px]">{campaign.title}</h2>
            {/* Budget + pills */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="text-base font-semibold leading-[1.2] tracking-[-0.18px]">
                  <span className="text-page-text">{campaign.budgetSpent}</span>
                  <span className="text-foreground/40">/{campaign.budgetTotal}</span>
                </div>
                <div className="h-1 w-20 overflow-hidden rounded-full bg-foreground/10 dark:bg-white/20">
                  <div className="h-full rounded-full bg-page-text dark:bg-white" style={{ width: `${campaign.progressPercentage}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 -space-x-1">
                <div className="relative z-[1] flex h-6 items-center gap-[2px] rounded-full px-2 py-[3px] verified-pill-glass">
                  <span className="pointer-events-none absolute inset-0 rounded-full verified-pill-border" style={PILL_MASK} />
                  <PersonIcon />
                  <span className="text-xs font-semibold leading-[1.2] text-page-text">{formatCreators(campaign.creators)}</span>
                </div>
                <CpmPill cpm={campaign.pricePerView} />
                <PlatformPills platforms={campaign.platforms} />
              </div>
            </div>
            {/* Description */}
            <p className="text-base leading-[1.4] tracking-[-0.18px] text-foreground/56 dark:text-white/88">{campaign.description}</p>
            {/* Join button */}
            <button className="relative flex h-12 w-fit items-center justify-center rounded-[40px] px-8 text-base font-semibold text-white transition-[transform,filter] duration-150 hover:brightness-110 active:scale-[0.96] hero-join-btn dark:text-black">
              <span className="pointer-events-none absolute inset-0 rounded-[40px] verified-pill-border" style={PILL_MASK} />
              Join Campaign
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function CreatorDiscoverPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [activePlatforms, setActivePlatforms] = useState<Platform[]>([]);
  const router = useRouter();
  const [detailCampaign, setDetailCampaign] = useState<Campaign | null>(null);

  const openCampaign = useCallback((c: Campaign) => {
    openCampaign(c);
    window.history.pushState(null, "", `/creator/discover/${c.id}`);
  }, []);

  const closeCampaign = useCallback(() => {
    setDetailCampaign(null);
    window.history.pushState(null, "", "/creator/discover");
  }, []);

  const togglePlatform = useCallback((p: Platform) => {
    setActivePlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  }, []);

  // Filter campaigns
  const filterCampaigns = useCallback((campaigns: Campaign[]) => {
    return campaigns.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "All" && c.category !== category) return false;
      if (activePlatforms.length > 0 && !activePlatforms.some((p) => c.platforms.includes(p))) return false;
      return true;
    });
  }, [search, category, activePlatforms]);

  const hasFilters = search || category !== "All" || activePlatforms.length > 0;
  const filteredFeatured = filterCampaigns(FEATURED_CAMPAIGNS);
  const filteredGrid = filterCampaigns(GRID_CAMPAIGNS);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-page-bg">
      {/* Hero banner */}
      <HeroBanner campaigns={BANNER_CAMPAIGNS} onSlideClick={(c) => openCampaign(c)} />

      {/* Divider */}
      <div className="mx-3 h-px bg-foreground/[0.06] sm:mx-12" />

      {/* Filter bar (sticky) */}
      <div className="sticky top-0 z-40 bg-page-bg px-3 sm:px-12">
        <FilterBar
          search={search} onSearch={setSearch}
          category={category} onCategory={setCategory}
          sort={sort} onSort={setSort}
          platforms={activePlatforms} onTogglePlatform={togglePlatform}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-8 px-3 pb-8 pt-4 sm:px-12">
        {/* Featured row (hide when filtering) */}
        {!hasFilters && filteredFeatured.length > 0 && (
          <FeaturedRow campaigns={filteredFeatured} onCardClick={(c) => openCampaign(c)} />
        )}

        {/* Grid */}
        {filteredGrid.length > 0 ? (
          <CampaignGridSection campaigns={filteredGrid} onCardClick={(c) => openCampaign(c)} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20">
            <span className="text-base text-foreground/50">No campaigns match your filters</span>
            <button onClick={() => { setSearch(""); setCategory("All"); setActivePlatforms([]); }} className="text-sm font-medium text-page-text underline">Clear filters</button>
          </div>
        )}
      </div>

      {/* Campaign detail modal */}
      <CampaignDetailModal campaign={detailCampaign} open={!!detailCampaign} onClose={closeCampaign} />
    </div>
  );
}
