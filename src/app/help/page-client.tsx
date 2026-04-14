"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";
import { AnimatePresence, motion } from "motion/react";
import { CentralIcon } from "@central-icons-react/all";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none";

/* ── Data ───────────────────────────────────────────────────────── */

const ACADEMY_VIDEOS = [
  { title: "Welcome to Content Rewards", duration: "1:32", thumb: "/creator-home/campaign-thumb-1.png" },
  { title: "Getting Started as a Brand Manager", duration: "6:32", thumb: "/creator-home/campaign-thumb-2.png" },
];

const HELP_ARTICLES = [
  { title: "How do campaigns work?", desc: "Learn about CPM, retainer, and per-video campaign types.", answer: "Content Rewards supports three campaign models: CPM (cost per mille) where creators earn based on views, retainer campaigns with fixed monthly payouts, and per-video campaigns where each approved submission earns a set amount. Brands set budgets, and creators apply or get invited to participate." },
  { title: "Managing creator payouts", desc: "Set up Stripe, process payouts, and handle disputes.", answer: "Payouts are processed through Stripe Connect. Creators link their accounts during onboarding. Payouts are triggered automatically when submissions are approved, or manually by the brand manager. Disputes can be filed within 14 days of a payout decision." },
  { title: "Submission review workflow", desc: "Approve, reject, and manage content submissions.", answer: "When a creator submits content, it enters a review queue. Brand managers can approve, request revisions, or reject submissions. Approved content triggers a payout. You can set auto-approve timers and quality thresholds in campaign settings." },
  { title: "Understanding analytics", desc: "Track views, engagement, and ROI across campaigns.", answer: "The analytics dashboard shows real-time views, engagement rates, click-through rates, and estimated ROI. You can filter by campaign, creator, platform, and date range. Export reports as CSV for your team." },
  { title: "Trust score & quality", desc: "How creator trust scores work and affect approvals.", answer: "Each creator has a trust score from 0\u2013100 based on submission quality, on-time delivery, engagement rates, and community feedback. Higher scores unlock priority access to campaigns and faster auto-approvals." },
];

const DISCOVER_LINKS = [
  { title: "Register for one of the daily webinars!", desc: "Learn tips to optimize your workflow", href: "/events" },
];

const DISCOVER_ARTICLES = [
  { title: "What's new in Content Rewards?", thumb: "/creator-home/campaign-thumb-3.png", href: "/changelog" },
  { title: "View all help topics", thumb: "/creator-home/campaign-thumb-1.png", href: "/support" },
];

const STILL_NEED_HELP = [
  { label: "Knowledge base", href: "/support", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3a1.5 1.5 0 011.5-1.5h7A1.5 1.5 0 0112 3v8a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 012 11V3z" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 5h5M4.5 7.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: "Get started guide", href: "/academy", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { label: "Submit a ticket", href: "/support", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4.5l5 3.5 5-3.5M2 4.5v5.5a1.5 1.5 0 001.5 1.5h7A1.5 1.5 0 0012 10V4.5a1.5 1.5 0 00-1.5-1.5h-7A1.5 1.5 0 002 4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { label: "Contact us", href: "/contact", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 4l5.5 4 5.5-4M1.5 4v6a1 1 0 001 1h9a1 1 0 001-1V4a1 1 0 00-1-1h-9a1 1 0 00-1 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

/* ── Accordion ──────────────────────────────────────────────────── */

function Accordion({ title, count, defaultOpen = false, children }: {
  title: string; count?: number; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center gap-2 border-b border-border px-4 py-3"
      >
        <span className="text-[14px] font-medium text-page-text">{title}</span>
        {count !== undefined && (
          <div className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] text-[12px] text-page-text-muted dark:bg-white/[0.06]">
            {count}
          </div>
        )}
        <div className="flex-1" />
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-page-text-muted transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── FAQ Accordion Item ─────────────────────────────────────────── */

function FaqItem({ article }: { article: typeof HELP_ARTICLES[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left"
      >
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-[13px] font-medium text-page-text">{article.title}</span>
          <span className="text-[12px] text-page-text-muted">{article.desc}</span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="mt-0.5 shrink-0 text-page-text-muted transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-[12px] leading-[18px] text-page-text-muted">{article.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Play Button ────────────────────────────────────────────────── */

function PlayButton() {
  return (
    <div className="flex size-8 items-center justify-center rounded-full bg-[#FF8003] shadow-[0_2px_8px_rgba(255,128,3,0.4)]">
      <CentralIcon name="IconPlay" size={14} color="white" join="round" fill="filled" stroke="2" radius="2" />
    </div>
  );
}

/* ── Intercom Button ─────────────────────────────────────────────── */

const INTERCOM_APP_ID = "hxlovrdw";

function IntercomButton() {
  const [loaded, setLoaded] = useState(false);

  const loadAndShow = () => {
    const w = window as any;

    // Already booted — just show
    if (w.Intercom) {
      w.Intercom("show");
      return;
    }

    // Boot Intercom
    w.intercomSettings = { app_id: INTERCOM_APP_ID, hide_default_launcher: true };

    const ic = (...args: any[]) => { ic.c(args); };
    ic.q = [] as any[];
    ic.c = (args: any) => { ic.q.push(args); };
    w.Intercom = ic;

    const script = document.createElement("script");
    script.src = `https://widget.intercom.io/widget/${INTERCOM_APP_ID}`;
    script.async = true;
    script.onload = () => {
      w.Intercom("boot", { app_id: INTERCOM_APP_ID, hide_default_launcher: true });
      // Wait for Intercom to initialize then show
      setTimeout(() => { w.Intercom("show"); }, 300);
      setLoaded(true);
    };
    document.head.appendChild(script);
  };

  return (
    <button
      type="button"
      onClick={loadAndShow}
      className="fixed bottom-20 right-5 z-50 flex h-[55px] w-[55px] cursor-pointer items-center justify-center rounded-full bg-[#FF8003] shadow-[0_4px_16px_rgba(255,128,3,0.4)] transition-transform active:scale-95 md:bottom-5"
      aria-label="Chat with support"
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <g clipPath="url(#clip_intercom)">
          <path d="M22.7477 0.617554H4.47456C2.00333 0.617554 0 2.62088 0 5.09211V17.7714C0 20.2427 2.00333 22.246 4.47456 22.246H22.7477C25.2189 22.246 27.2222 20.2427 27.2222 17.7714V5.09211C27.2222 2.62088 25.2189 0.617554 22.7477 0.617554Z" fill="white"/>
          <path d="M14.0124 27.0029C13.9384 27.0893 13.8465 27.1587 13.7432 27.2062C13.6398 27.2538 13.5273 27.2784 13.4135 27.2784C13.2998 27.2784 13.1873 27.2538 13.0839 27.2062C12.9806 27.1587 12.8887 27.0893 12.8147 27.0029L8.78576 22.3012C8.6879 22.1868 8.62485 22.0467 8.60405 21.8976C8.58326 21.7485 8.60559 21.5965 8.66841 21.4596C8.73123 21.3228 8.83191 21.2068 8.95856 21.1253C9.08521 21.0439 9.23252 21.0004 9.3831 21H17.4432C18.1168 21 18.48 21.7902 18.0421 22.3012L14.0117 27.0029H14.0124Z" fill="white"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M11.7585 18.0195C10.0516 17.7155 8.43604 17.028 7.03347 16.0089C6.55047 15.6543 6.53802 14.9659 6.95335 14.5343C7.36869 14.1034 8.0578 14.0909 8.55247 14.4277C9.63076 15.1578 10.8501 15.6538 12.1318 15.8837C13.9907 16.2081 16.2882 15.9856 18.7756 14.3251C19.2734 13.9929 19.9531 14.0653 20.3257 14.5351C20.6982 15.0033 20.6212 15.6901 20.1281 16.0284C17.1119 18.0957 14.1921 18.4449 11.7592 18.0195H11.7585ZM10.9286 6.22217C11.5275 6.22217 12.0128 6.7075 12.0128 7.30639V10.1974C12.0128 10.4849 11.8986 10.7607 11.6952 10.9641C11.4919 11.1674 11.2161 11.2816 10.9286 11.2816C10.641 11.2816 10.3652 11.1674 10.1619 10.9641C9.95858 10.7607 9.84435 10.4849 9.84435 10.1974V7.30639C9.84435 6.7075 10.3297 6.22217 10.9286 6.22217ZM16.17 6.22217C16.7689 6.22217 17.2535 6.7075 17.2535 7.30639V10.1974C17.2535 10.4849 17.1392 10.7607 16.9359 10.9641C16.7326 11.1674 16.4568 11.2816 16.1692 11.2816C15.8817 11.2816 15.6059 11.1674 15.4026 10.9641C15.1993 10.7607 15.085 10.4849 15.085 10.1974V7.30639C15.085 6.7075 15.5704 6.22217 16.1692 6.22217H16.17Z" fill="#FF8003"/>
        </g>
        <defs>
          <clipPath id="clip_intercom"><rect width="27.2222" height="28" fill="white"/></clipPath>
        </defs>
      </svg>
    </button>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

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
            {/* Academy videos accordion */}
            <Accordion title="CR Academy videos" count={ACADEMY_VIDEOS.length} defaultOpen>
              <div className="flex flex-col gap-3 p-4">
                <p className="text-[12px] font-normal leading-[18px] text-page-text-muted">
                  These videos are related to getting started. To see more, go to <Link href="/academy" className="text-[#FF8003] underline decoration-[#FF8003]/30 underline-offset-2 hover:decoration-[#FF8003]">CR Academy</Link>.
                </p>
                <div className="flex gap-3">
                  {ACADEMY_VIDEOS.map((video) => (
                    <div key={video.title} className="flex flex-1 flex-col gap-1 rounded-lg">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-foreground/[0.04] dark:bg-white/[0.04]">
                        <img src={video.thumb} alt="" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayButton />
                        </div>
                        <div className="absolute bottom-1 right-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
                          {video.duration}
                        </div>
                      </div>
                      <span className="text-[12px] font-medium leading-[18px] text-page-text">{video.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Accordion>

            {/* Help center articles accordion */}
            <Accordion title="Help center articles" count={HELP_ARTICLES.length}>
              <div className="flex flex-col">
                {HELP_ARTICLES.map((article) => (
                  <FaqItem key={article.title} article={article} />
                ))}
              </div>
            </Accordion>
          </div>
        </div>

        {/* Discover more */}
        <div className="flex flex-col gap-4">
          <span className="text-[14px] font-medium text-page-text">Discover more</span>

          <div className="flex flex-col gap-3">
            {/* Webinar link card */}
            {DISCOVER_LINKS.map((link) => (
              <Link key={link.title} href={link.href} className={cn(cardCls, "flex items-center gap-4 p-3 transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]")}>
                <span className="shrink-0 text-page-text-muted">
                  <CentralIcon name="IconCalendar1" size={20} color="currentColor" join="round" fill="outlined" stroke="2" radius="2" />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[12px] font-medium text-page-text">{link.title}</span>
                  <span className="text-[12px] text-page-text-muted">{link.desc}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-muted"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            ))}

            {/* Article cards */}
            <div className="flex gap-3">
              {DISCOVER_ARTICLES.map((article) => (
                <Link key={article.title} href={article.href} className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border transition-colors hover:border-foreground/[0.12]">
                  <div className="h-[90px] w-full overflow-hidden bg-foreground/[0.04] dark:bg-white/[0.04]">
                    <img src={article.thumb} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="px-3 py-2.5">
                    <span className="text-[12px] font-medium leading-[18px] text-page-text">{article.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Still need help? */}
        <div className="flex flex-col gap-4">
          <span className="text-[14px] font-medium text-page-text">Still need help?</span>
          <div className="flex flex-col gap-3">
            {STILL_NEED_HELP.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 text-[13px] font-medium text-[#FF8003] decoration-[#FF8003]/30 underline-offset-2 transition-colors hover:underline hover:decoration-[#FF8003]"
              >
                <span className="flex size-4 shrink-0 items-center justify-center text-[#FF8003]">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Intercom widget — loads script on first click, then opens messenger */}
      <IntercomButton />
    </PageShell>
  );
}
