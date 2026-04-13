"use client";

import { cn } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none";

const PRIZES = [
  { tier: "$10K GMV", name: "AirPods Pro", img: "/icons/prizes/airpods.png" },
  { tier: "$30K GMV", name: "iPhone 17 Pro Max", img: "/icons/prizes/iphone.png" },
  { tier: "$60K GMV", name: "iPad Pro M4 + Apple Pencil", img: "/icons/prizes/ipad.png" },
  { tier: "$100K GMV", name: "MacBook Pro M4", img: "/icons/prizes/macbook.png" },
  { tier: "$200K GMV", name: "A Week at CR HQ", img: null },
  { tier: "$300K GMV", name: "Rolex Oyster Perpetual 41", img: "/icons/prizes/rolex.png" },
  { tier: "$500K GMV", name: "$20,000 Cash", img: null },
  { tier: "$750K GMV", name: "BMW 330i", img: "/icons/prizes/bmw.png" },
];

const PROGRESS_SEGMENTS = [
  { flex: 1 }, { flex: 2 }, { flex: 3 }, { flex: 4 },
  { flex: 5 }, { flex: 6 }, { flex: 8 }, { flex: 10 },
];

export default function AgencyProgramPage() {
  return (
    <PageShell title="Agency Program">
      <div className="mx-auto flex w-full max-w-[768px] flex-col gap-8 px-4 py-6 sm:px-5">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-inter text-[22px] font-semibold leading-[28px] tracking-[-0.44px] text-page-text">
            Agency Program
          </h1>
          <p className="font-inter text-[14px] font-medium leading-[20px] tracking-[-0.14px] text-page-text-muted">
            Earn rewards as your agency&apos;s campaigns pay out more to creators. Rewards are cumulative.
          </p>
        </div>

        {/* Referral progress + rewards card */}
        <div className={cn(cardCls, "flex flex-col gap-0 overflow-hidden")}>
          {/* Header: trophy + your referrals + points */}
          <div className="flex items-center gap-3 p-4">
            <div className="flex size-[48px] shrink-0 items-center justify-center rounded-2xl bg-foreground/[0.04] dark:bg-white/[0.04]">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M10 6h12v10c0 3.314-2.686 6-6 6s-6-2.686-6-6V6z" fill="url(#trp)" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1"/>
                <path d="M10 10H7a3 3 0 0 0 0 6h3M22 10h3a3 3 0 0 1 0 6h-3" stroke="url(#trp)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M13 22h6v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z" fill="url(#trp)" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1"/>
                <defs><linearGradient id="trp" x1="16" y1="4" x2="16" y2="26" gradientUnits="userSpaceOnUse"><stop stopColor="#E8980E"/><stop offset="1" stopColor="#D97706"/></linearGradient></defs>
              </svg>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-inter text-[14px] font-semibold tracking-[-0.14px] text-page-text">Your progress</span>
                <span className="font-inter text-[12px] font-medium tracking-[-0.12px] text-page-text-muted">$0 / $750K GMV</span>
              </div>
              <div className="flex items-center gap-1">
                {PROGRESS_SEGMENTS.map((seg, i) => (
                  <div key={i} className="h-2 rounded-[3px] bg-foreground/[0.05] dark:bg-white/[0.05]" style={{ flex: seg.flex }} />
                ))}
              </div>
            </div>
          </div>

          <div className="mx-4 h-px bg-border" />

          {/* Rewards section */}
          <div className="flex flex-col gap-3 p-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-inter text-[14px] font-medium tracking-[-0.14px] text-page-text">Rewards</span>
              <span className="font-inter text-[12px] font-medium tracking-[-0.12px] text-page-text-muted">Unlock rewards as your referred brands pay out more to creators. Rewards are cumulative.</span>
            </div>

            <div className="-mx-4 overflow-x-auto px-4" style={{ scrollbarWidth: "none" }}>
              <div className="flex gap-3">
                {PRIZES.map((prize) => (
                  <div key={prize.tier} className="flex w-[160px] shrink-0 flex-col overflow-hidden rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-white/[0.02]">
                    <div className="flex items-center justify-center p-1">
                      <div className="flex h-[100px] w-full items-center justify-center rounded-lg bg-foreground/[0.03] dark:bg-white/[0.03]">
                        {prize.img ? (
                          <img src={prize.img} alt={prize.name} className="max-h-[70px] max-w-[70px] object-contain opacity-70 dark:opacity-50" />
                        ) : (
                          <span className="text-[20px] font-bold text-page-text-muted/30">?</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col px-3 pb-2 pt-1">
                      <span className="font-inter text-[11px] font-medium tracking-[-0.11px] text-page-text-muted">{prize.tier}</span>
                      <span className="font-inter text-[12px] font-medium tracking-[-0.12px] text-page-text">{prize.name}</span>
                    </div>
                    <div className="mx-2.5 h-px bg-border" />
                    <div className="p-2.5">
                      <div className="flex items-center justify-center rounded-md border border-border bg-foreground/[0.03] py-0.5 font-inter text-[11px] font-medium tracking-[-0.11px] text-page-text-muted dark:bg-white/[0.03]">
                        {prize.tier}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
