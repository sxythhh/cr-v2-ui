"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none";

const ACADEMY_VIDEOS = [
  { title: "Welcome to Content Rewards", duration: "1:32", thumb: "/creator-home/campaign-thumb-1.png" },
  { title: "Getting Started as a Brand Manager", duration: "6:32", thumb: "/creator-home/campaign-thumb-2.png" },
];

const HELP_ARTICLES = [
  { title: "How do campaigns work?", desc: "Learn about CPM, retainer, and per-video campaign types." },
  { title: "Managing creator payouts", desc: "Set up Stripe, process payouts, and handle disputes." },
  { title: "Submission review workflow", desc: "Approve, reject, and manage content submissions." },
  { title: "Understanding analytics", desc: "Track views, engagement, and ROI across campaigns." },
  { title: "Trust score & quality", desc: "How creator trust scores work and affect approvals." },
];

const DISCOVER_LINKS = [
  { title: "Register for one of the daily webinars!", desc: "Learn tips to optimize your workflow", icon: "calendar" },
];

const DISCOVER_ARTICLES = [
  { title: "What's new in Content Rewards?", thumb: "/creator-home/campaign-thumb-3.png" },
  { title: "View all help topics", thumb: "/creator-home/campaign-thumb-1.png" },
];

const STILL_NEED_HELP = [
  { label: "Knowledge base", href: "/support", icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 2.5A1 1 0 0 1 2.5 1.5h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7z" stroke="currentColor" strokeWidth="1.1"/><path d="M3.5 4h5M3.5 6h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
  { label: "Get started guide", href: "/academy", icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
  { label: "Submit a ticket", href: "#", icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5l4.5 3 4.5-3M1.5 3.5v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

export default function HelpPageClient() {
  return (
    <PageShell title="Help">
      <div className="mx-auto flex w-full max-w-[520px] flex-col gap-6 px-4 py-5 font-inter tracking-[-0.02em] sm:px-5">

        {/* Promo banner — AI onboarding */}
        <div className="relative overflow-hidden rounded-xl p-5" style={{ background: "#655A4E" }}>
          <div className="relative z-10 flex flex-col gap-1">
            <span className="text-[12px] font-normal uppercase tracking-[0.02em] text-white/70">Limited time offer</span>
            <span className="text-[16px] font-bold leading-[20px] text-white/90">CR AI onboarding agent</span>
            <span className="text-[12px] font-medium leading-[16px] text-white/70">Jump in instantly with the CR AI onboarding agent.</span>
          </div>
        </div>

        {/* Recommended resources */}
        <div className="flex flex-col gap-4">
          <span className="text-[14px] font-medium text-page-text">Recommended resources</span>

          <div className={cn(cardCls, "flex flex-col overflow-hidden")}>
            {/* Academy videos tab */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="text-[14px] font-medium text-page-text">CR Academy videos</span>
              <div className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] text-[12px] text-page-text-muted dark:bg-white/[0.06]">
                {ACADEMY_VIDEOS.length}
              </div>
              <div className="flex-1" />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-page-text-muted"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>

            {/* Videos */}
            <div className="flex flex-col gap-3 p-4">
              <p className="text-[12px] font-normal leading-[18px] text-page-text-muted">
                These videos are related to getting started. To see more, go to <Link href="/academy" className="text-[#E57100] underline">CR Academy</Link>.
              </p>
              <div className="flex gap-3">
                {ACADEMY_VIDEOS.map((video) => (
                  <div key={video.title} className="flex flex-1 flex-col gap-1 rounded-lg">
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-foreground/[0.04] dark:bg-white/[0.04]">
                      <img src={video.thumb} alt="" className="h-full w-full object-cover" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-[26px] items-center justify-center rounded-full bg-[#E57100]">
                          <svg width="7" height="8" viewBox="0 0 7 8" fill="none"><path d="M6.5 4L0.5 7.5V0.5L6.5 4Z" fill="white"/></svg>
                        </div>
                      </div>
                      {/* Duration */}
                      <div className="absolute bottom-1 right-1 rounded-full bg-page-text/80 px-1.5 py-0.5 text-[11px] font-medium text-white dark:bg-white/80 dark:text-page-text">
                        {video.duration}
                      </div>
                    </div>
                    <span className="text-[12px] font-medium leading-[18px] text-page-text">{video.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help center articles tab */}
            <div className="flex items-center gap-2 border-t border-border px-4 py-3">
              <span className="text-[14px] font-medium text-page-text">Help center articles</span>
              <div className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] text-[12px] text-page-text-muted dark:bg-white/[0.06]">
                {HELP_ARTICLES.length}
              </div>
              <div className="flex-1" />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-page-text-muted"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>

        {/* Discover more */}
        <div className="flex flex-col gap-4">
          <span className="text-[14px] font-medium text-page-text">Discover more</span>

          <div className="flex flex-col gap-3">
            {/* Webinar link card */}
            {DISCOVER_LINKS.map((link) => (
              <a key={link.title} href="#" className={cn(cardCls, "flex items-center gap-4 p-3 transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]")}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-page-text-muted"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2 7h16M6 3v3M14 3v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[12px] font-medium text-page-text">{link.title}</span>
                  <span className="text-[12px] text-page-text-muted">{link.desc}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-muted"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            ))}

            {/* Article cards */}
            <div className="flex gap-3">
              {DISCOVER_ARTICLES.map((article) => (
                <a key={article.title} href="#" className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border transition-colors hover:border-foreground/[0.12]">
                  <div className="h-[90px] w-full overflow-hidden bg-foreground/[0.04] dark:bg-white/[0.04]">
                    <img src={article.thumb} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="px-3 py-2.5">
                    <span className="text-[12px] font-medium leading-[18px] text-page-text">{article.title}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Still need help? */}
        <div className="flex flex-col gap-4">
          <span className="text-[14px] font-medium text-page-text">Still need help?</span>
          <div className="flex flex-col gap-2.5">
            {STILL_NEED_HELP.map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center gap-1.5 text-[12px] text-[#7BA4D4] transition-colors hover:text-[#9BBDE6] dark:text-[#7BA4D4] dark:hover:text-[#9BBDE6]">
                <span className="flex size-3 items-center justify-center">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
