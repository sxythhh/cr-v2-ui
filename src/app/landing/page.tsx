"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Instagram,
  Youtube,
  Camera,
  Play,
  BadgeCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Pin,
  MousePointer2,
  Check,
  MessageCircle,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────────── */

const BRAND = "#E8980E";
const BRAND_DARK = "#D1960A";
const ACCENT = "#F97316";

function Display({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      style={{ fontFamily: "var(--font-sf-rounded)" }}
      className={cn(
        "font-light tracking-[-0.05em] leading-[1.1] text-[#191919]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Hero / Services
──────────────────────────────────────────────────────────────────── */

function IconPill({
  children,
  rotate = 0,
  className,
}: {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl border border-black/5 bg-[#F0F0F0] shadow-[0_0_15px_rgba(0,0,0,0.07)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

function HeroSection() {
  return (
    <section className="relative rounded-[40px] bg-white pt-10 pb-4">
      <div className="mx-auto flex max-w-[1060px] flex-col items-center px-4 sm:px-6">
        <Display
          as="h1"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[clamp(24px,4.5vw,33px)]"
        >
          <span>Find opportunities,</span>
          <span className="inline-flex items-center gap-1.5 px-1">
            <IconPill>
              <Instagram className="size-4 text-[#262626]" />
            </IconPill>
            <IconPill rotate={5}>
              <Camera className="size-[18px] text-[#262626]" />
            </IconPill>
            <IconPill>
              <Youtube className="size-[18px] text-[#FF0000]" />
            </IconPill>
          </span>
          <span>make content,</span>
          <span>and start earning on Virality.</span>
        </Display>

        <div className="mt-10 flex flex-col items-center gap-2.5">
          <div className="relative h-[34px] w-[3px] overflow-hidden rounded-full bg-[#F0F0F0]">
            <div className="absolute inset-x-0 top-0.5 h-[14px] rounded-full bg-[#E8980E]" />
          </div>
          <span
            style={{ fontFamily: "var(--font-sf-rounded)" }}
            className="text-[14px] font-light tracking-[-0.05em] text-black/90"
          >
            Scroll
          </span>
        </div>

        <div className="relative mt-6 flex aspect-[500/281] w-full max-w-[620px] items-center justify-center overflow-hidden rounded-xl bg-[#121111]">
          <button
            type="button"
            aria-label="Play video"
            className="group relative flex size-[60px] cursor-pointer items-center justify-center rounded-full bg-[#E8980E] transition-transform active:scale-95"
          >
            <span className="absolute inset-0 rounded-full ring-[3px] ring-[#141414]" />
            <Play className="size-6 translate-x-[2px] fill-white text-white" />
          </button>
        </div>
      </div>

      <Display
        as="h2"
        className="mt-14 text-center text-[30px] tracking-[-0.02em] text-black"
      >
        What&apos;s Included
      </Display>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Timeline
──────────────────────────────────────────────────────────────────── */

function TimelineRail({ fillPct = 0 }: { fillPct?: number }) {
  return (
    <div className="flex w-[60px] shrink-0 flex-col items-center sm:w-[100px]">
      <div className="flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#FAFAFA]">
        <div className="size-2.5 rounded-full bg-[#E8980E]" />
      </div>
      <div className="relative mt-1 w-[3px] flex-1 bg-[#E8E8E8]">
        <div
          className="absolute inset-x-0 top-0 bg-[#FF8000]"
          style={{ height: `${fillPct}%` }}
        />
      </div>
    </div>
  );
}

function StepHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      <div className="flex size-[18px] items-center justify-center text-black">
        {icon}
      </div>
      <h3 className="font-inter text-[14px] font-semibold tracking-[-0.03em] text-black">
        {title}
      </h3>
    </div>
  );
}

function StepDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto max-w-[400px] text-center font-inter text-[14px] font-medium leading-[21px] tracking-[-0.03em] text-[#616161]">
      {children}
    </p>
  );
}

function VerifiedProfile() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex size-[60px] items-center justify-center rounded-[14px] bg-white p-[3px] shadow-[6px_10px_16px_-1.75px_rgba(0,0,0,0.16),1.37px_2.29px_3.74px_-1.17px_rgba(0,0,0,0.1),0.36px_0.6px_0.98px_-0.58px_rgba(0,0,0,0.09)]">
        <div className="size-full rounded-[13px] bg-gradient-to-br from-[#f0c987] to-[#b56b3f]" />
        <span className="absolute -bottom-0 -right-0 block size-2 rounded-full bg-[#16BF5E] ring-[3px] ring-white" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-inter text-[20px] font-bold tracking-[-0.04em] text-[#0F1419]">
            Daniel Bitton
          </span>
          <BadgeCheck className="size-[17px] fill-[#E8980E] text-white" />
        </div>
        <span className="font-inter text-[13px] font-medium tracking-[-0.04em] text-[#555]">
          CEO — Content Rewards
        </span>
      </div>
    </div>
  );
}

function CheckRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg py-2.5 pr-5">
      <span className="flex size-5 items-center justify-center text-[#E8980E]">
        <Check className="size-4" strokeWidth={3} />
      </span>
      <span
        style={{ fontFamily: "var(--font-sf-rounded)" }}
        className="text-[16px] font-light tracking-[-0.03em] text-black"
      >
        {label}
      </span>
    </div>
  );
}

function StackedImages() {
  return (
    <div className="relative size-[135px]">
      <div
        className="absolute -left-1 -top-1 size-[115px] rounded-[16px] bg-white p-[3px] shadow-[6px_10px_16px_-1.75px_rgba(0,0,0,0.16)]"
        style={{ transform: "rotate(-4.16deg)" }}
      >
        <div className="size-full rounded-[13px] bg-gradient-to-br from-[#8f7b5a] to-[#3f3222]" />
      </div>
      <div
        className="absolute left-[72px] top-[16px] size-[115px] rounded-[16px] bg-white p-[3px] shadow-[6px_10px_16px_-1.75px_rgba(0,0,0,0.16)]"
        style={{ transform: "rotate(4.16deg)" }}
      >
        <div className="size-full rounded-[13px] bg-gradient-to-br from-[#5c7e88] to-[#1c2a31]" />
      </div>
    </div>
  );
}

function SwipeFileCard() {
  return (
    <div
      className="relative w-[265px] rounded-[25px] bg-white px-4 pb-4 pt-[52px] shadow-[13px_21px_35px_-1.75px_rgba(0,0,0,0.16),5px_8px_13.6px_-1.4px_rgba(0,0,0,0.12),2.3px_3.7px_6.1px_-1px_rgba(0,0,0,0.1)]"
      style={{ transform: "rotate(3deg)" }}
    >
      <div className="mb-1.5 pl-2.5 font-mono text-[15px] font-semibold uppercase tracking-[0.3px] text-[#555]">
        2023/08/09
      </div>
      <div className="relative h-[212px] w-[233px] overflow-hidden rounded-[16px] bg-gradient-to-br from-[#c3a676] via-[#8b6b3a] to-[#32240e]">
        <div className="absolute inset-0 bg-black/10" />
        <span className="absolute left-[108px] top-[3px] inline-flex size-12 -rotate-12 items-center justify-center rounded-[10px] bg-white shadow-lg">
          <Pin className="size-5 fill-[#E8980E] text-[#E8980E]" />
        </span>
      </div>
    </div>
  );
}

function Step1() {
  return (
    <div className="flex flex-col gap-5">
      <VerifiedProfile />

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-2.5">
        <div className="flex flex-1 flex-col py-1.5">
          <CheckRow label="Introduction to Faceless Content" />
          <CheckRow label="Monetization Model" />
          <CheckRow label="Your Personal Swipe File" />
        </div>

        <div className="flex items-start gap-3 sm:gap-6">
          <StackedImages />
          <SwipeFileCard />
        </div>
      </div>

      <div className="pt-2">
        <StepHeader
          title="Step 1: Join & Get Verified"
          icon={
            <svg viewBox="0 0 18 18" className="size-[18px]" fill="none">
              <circle cx="9" cy="9" r="7.4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="9" cy="9" r="2.97" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          }
        />
        <StepDescription>
          Sign up, connect your social accounts, and complete verification.
          Apply to campaigns from brands looking for creators like you.
        </StepDescription>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-2xl">
        {/* Radial lines */}
        <svg
          className="absolute inset-0 size-full opacity-[0.18]"
          viewBox="0 0 1200 360"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="fade" cx="50%" cy="50%" r="50%">
              <stop offset="40%" stopColor="#000" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <mask id="m">
              <rect width="1200" height="360" fill="url(#fade)" />
            </mask>
          </defs>
          <g mask="url(#m)" stroke="#000" strokeWidth="0.5" fill="none">
            {Array.from({ length: 24 }).map((_, i) => (
              <ellipse
                key={i}
                cx="600"
                cy="180"
                rx={60 + i * 40}
                ry={30 + i * 18}
              />
            ))}
          </g>
        </svg>

        {/* Floating icon */}
        <div className="relative flex size-[120px] items-center justify-center rounded-[20px] bg-gradient-to-br from-white/25 to-white/10 p-6 shadow-[0_88px_35px_rgba(0,0,0,0.02),0_49px_30px_rgba(0,0,0,0.05),0_22px_22px_rgba(0,0,0,0.14),0_5px_12px_rgba(0,0,0,0.16)] backdrop-blur">
          <div className="flex size-[72px] items-center justify-center rounded-[10px] bg-gradient-to-b from-black/[0.02] to-black/10">
            <div className="flex size-14 items-end justify-center rounded-[10px] bg-gradient-to-b from-black/10 to-black/[0.02]">
              <Users className="size-[50px]" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <StepHeader
          title="Step 2: Match With Brands"
          icon={<Users className="size-[18px]" strokeWidth={1.5} />}
        />
        <StepDescription>
          Get matched with brands running active campaigns in your niche.
          Accept the ones that fit — everything else stays hidden.
        </StepDescription>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative h-[263px] w-full">
        {[
          { left: "calc(50% - 340px)", rotate: -2, grad: "from-[#9aa4ae] to-[#3f4c56]" },
          { left: "calc(50% - 175px)", rotate: 2, grad: "from-[#86b3c2] to-[#2d4a54]" },
          { left: "calc(50% - 10px)", rotate: -2, grad: "from-[#d4a77f] to-[#5e3a20]" },
          { left: "calc(50% + 156px)", rotate: 2, grad: "from-[#3d4149] to-[#1b1c20]" },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute top-0 h-[248px] w-[184px] rounded-[10px] border-[5px] border-white shadow-[0_6px_12px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.12)]"
            style={{ left: p.left, transform: `rotate(${p.rotate}deg)` }}
          >
            <div className={cn("size-full rounded-[5px] bg-gradient-to-br", p.grad)} />
          </div>
        ))}
      </div>

      <div className="relative flex min-h-[180px] w-full items-center justify-center overflow-hidden rounded-[15px] bg-white">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(79% 50% at 50% 50%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="relative flex items-center gap-4 px-10 py-6">
          <MousePointer2
            className="size-8 -rotate-[8deg] fill-[#252525] text-[#252525]"
          />
          <div className="flex flex-col gap-2">
            <div className="rounded-[14px] rounded-tl-none border border-dashed border-[#D9D9D9] bg-white px-4 py-2.5">
              <span className="font-inter text-[13px] font-bold tracking-[-0.03em] text-[#171717]">
                New Campaign!
              </span>
            </div>
            <div
              className="w-fit rounded-[14px] rounded-tr-none bg-[#E8980E] px-4 py-2 shadow-[inset_0_0_3px_rgba(255,255,255,0.25)]"
              style={{ transform: "rotate(-14deg)" }}
            >
              <span className="font-inter text-[13px] font-bold tracking-[-0.04em] text-white">
                Submitting Videos…
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <StepHeader
          title="Step 3: Create Content"
          icon={
            <svg viewBox="0 0 18 18" fill="none" className="size-[18px]">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 9h4M9 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <StepDescription>
          Follow campaign blueprints, submit your content, and watch your
          balance grow. Payouts hit weekly. No chasing invoices.
        </StepDescription>
      </div>
    </div>
  );
}

function PayoutRow() {
  return (
    <div className="flex h-[29px] items-center gap-2 rounded-lg bg-white px-1 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
      <div className="h-[21px] w-4 rounded-[5px] bg-gradient-to-b from-[#FF7700] to-[#E8980E] opacity-90" />
      <div className="flex flex-1 flex-col gap-1 pr-1">
        <div className="h-[3px] w-5 rounded-full bg-[#292929]/10" />
        <div className="h-[3px] w-[184px] max-w-full rounded-full bg-[#292929]/10" />
        <div className="h-[3px] w-9 rounded-full bg-[#292929]/10" />
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <StepHeader
          title="Step 4: Track Results & Payouts"
          icon={<BarChart3 className="size-[18px]" strokeWidth={1.5} />}
        />
        <StepDescription>
          Monitor your views, submissions, and payouts in one dashboard. See
          what you&apos;ve earned, monitor growth, and request payouts in
          PayPal, Crypto, or Bank Transfer.
        </StepDescription>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-[0_1px_18px_rgba(0,0,0,0.03)]">
        <p className="mb-2 font-inter text-[10px] font-medium tracking-[-0.03em] text-[#292929] opacity-30">
          120+ matches
        </p>
        <div className="grid grid-cols-2 gap-2">
          <PayoutRow />
          <PayoutRow />
          <PayoutRow />
          <PayoutRow />
        </div>
      </div>
    </div>
  );
}

function TimelineSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <Display
        as="h2"
        className="text-center text-[clamp(26px,4vw,33px)] tracking-[-0.04em]"
      >
        Get Started
      </Display>

      <div className="mt-10 flex flex-col gap-10">
        <TimelineRow fillPct={70}>
          <Step1 />
        </TimelineRow>
        <TimelineRow fillPct={80}>
          <Step2 />
        </TimelineRow>
        <TimelineRow fillPct={80}>
          <Step3 />
        </TimelineRow>
        <TimelineRow fillPct={100} isLast>
          <Step4 />
        </TimelineRow>
      </div>
    </section>
  );
}

function TimelineRow({
  children,
  fillPct,
  isLast,
}: {
  children: React.ReactNode;
  fillPct: number;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-stretch gap-3 sm:gap-5">
      {!isLast ? <TimelineRail fillPct={fillPct} /> : (
        <div className="flex w-[60px] shrink-0 sm:w-[100px]">
          <div className="mx-auto flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#FAFAFA]">
            <div className="size-2.5 rounded-full bg-[#E8980E]" />
          </div>
        </div>
      )}
      <div className="min-w-0 flex-1 pb-6">{children}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Favourite Brands CTA
──────────────────────────────────────────────────────────────────── */

const ORBIT_TILES = [
  { top: "6%", left: "25%", size: 60, grad: "from-[#ff6a00] to-[#ee0979]" },
  { top: "18%", right: "22%", size: 65, grad: "from-[#00c6ff] to-[#0072ff]" },
  { top: "46%", left: "-4%", size: 50, grad: "from-[#43e97b] to-[#38f9d7]" },
  { top: "50%", right: "-4%", size: 60, grad: "from-[#fa709a] to-[#fee140]" },
  { bottom: "14%", left: "14%", size: 73, grad: "from-[#a18cd1] to-[#fbc2eb]" },
  { bottom: "10%", right: "18%", size: 73, grad: "from-[#f6d365] to-[#fda085]" },
];

function BrandsCTA() {
  return (
    <section className="relative mx-auto mt-12 flex w-full max-w-[1160px] flex-col items-center gap-8 px-4 py-16 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="relative aspect-square w-[min(600px,90%)]">
          <div className="absolute inset-0 rounded-full border border-dashed border-[#F2F2F2]" />
          <div className="absolute inset-10 rounded-full border border-dashed border-[#F2F2F2]" />
          {ORBIT_TILES.map((t, i) => (
            <div
              key={i}
              className={cn(
                "absolute rounded-3xl border border-black/5 bg-gradient-to-br shadow-[0_41px_41px_-3.75px_rgba(0,0,0,0.01),0_20.75px_20.75px_-3.21px_rgba(0,0,0,0.01),0_11.33px_11.33px_-2.68px_rgba(0,0,0,0.01),0_6.51px_6.51px_-2.14px_rgba(0,0,0,0.01),0_3.73px_3.73px_-1.61px_rgba(0,0,0,0.01),0_1.97px_1.97px_-1.07px_rgba(0,0,0,0.01),0_0.8px_0.8px_-0.54px_rgba(0,0,0,0.01)]",
                t.grad,
              )}
              style={{
                top: t.top,
                left: t.left,
                right: t.right,
                bottom: t.bottom,
                width: t.size,
                height: t.size,
                transform: "rotate(-16deg)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <Display as="h2" className="text-[clamp(26px,3.5vw,32px)] leading-[1.15]">
          <span style={{ color: BRAND_DARK }}>Work for your</span>
          <br />
          <span>Favourite Brands.</span>
        </Display>
        <p className="max-w-[400px] font-inter text-[16px] font-light tracking-[-0.01em] text-[#787878]">
          Join live opportunities from trusted brands and start collaborating
          right away.
        </p>
      </div>

      <button
        type="button"
        className="relative z-10 flex h-[65px] w-[250px] cursor-pointer items-center justify-center rounded-[20px] border-[3px] border-white bg-gradient-to-b from-[#F5F5F5] to-white px-8 shadow-[22px_20px_53px_-0.75px_rgba(17,17,18,0.07),10px_9px_24px_-0.63px_rgba(17,17,18,0.04),5px_4.5px_12px_-0.5px_rgba(17,17,18,0.02)] transition-transform active:scale-[0.98]"
      >
        <span className="font-inter text-[18px] font-semibold tracking-[-0.02em] text-black/70">
          Explore Campaigns
        </span>
      </button>

      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className="flex -space-x-2">
          {[
            "from-[#ffb199] to-[#ff0844]",
            "from-[#a1c4fd] to-[#c2e9fb]",
            "from-[#d4fc79] to-[#96e6a1]",
            "from-[#fbc2eb] to-[#a6c1ee]",
            "from-[#fddb92] to-[#d1fdff]",
          ].map((g, i) => (
            <div
              key={i}
              className={cn(
                "size-8 rounded-full border-2 border-[#F2F0ED] bg-gradient-to-br",
                g,
              )}
            />
          ))}
        </div>
        <p className="font-inter text-[15px] tracking-[-0.01em] text-black/55">
          Trusted by 500k+ Creators
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Testimonials
──────────────────────────────────────────────────────────────────── */

interface Testimonial {
  name: string;
  quote: string;
  revenue: string;
  grad: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "AJ",
    quote:
      "The easiest money I've made in five years, just from posting short videos online.",
    revenue: "$21,000 in first month",
    grad: "from-[#4a4236] via-[#3a2f22] to-[#1a1410]",
  },
  {
    name: "Emyl",
    quote:
      "I started broke with zero in the bank, and Content Rewards gave me the blueprint.",
    revenue: "$16,000 earned in less than 3 months",
    grad: "from-[#4f5862] via-[#2f3640] to-[#14181d]",
  },
  {
    name: "Marcus",
    quote:
      "At 18, I went from zero to nearly $10K a month in just two months — life changing.",
    revenue: "Zero → $10K/month in 2 months",
    grad: "from-[#5a4a3a] via-[#3d2e1e] to-[#181108]",
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="relative aspect-[465/542] w-[min(465px,85vw)] shrink-0 overflow-hidden rounded-[32px] border border-white/20 shadow-[0_0_0_6px_rgba(38,38,38,0.07)]">
      <div className={cn("absolute inset-0 bg-gradient-to-br", t.grad)} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(250,117,22,0.37)]/50 to-[rgba(207,93,12,0.63)] opacity-60" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-8 py-8 text-white">
        <h4 className="font-inter text-[27px] font-bold leading-[1] tracking-[-0.02em]">
          {t.name}
        </h4>
        <p className="max-w-[370px] font-inter text-[23px] font-semibold leading-[1.32] tracking-[-0.015em]">
          &ldquo;{t.quote}&rdquo;
        </p>
        <div>
          <p className="font-inter text-[19px] font-medium tracking-[-0.03em]">
            Revenue Generated:
          </p>
          <p className="font-inter text-[22px] font-bold tracking-[-0.03em] text-[#F97316]">
            {t.revenue}
          </p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsCarousel() {
  const [index, setIndex] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const next = Math.max(0, Math.min(TESTIMONIALS.length - 1, index + dir));
    setIndex(next);
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[next] as HTMLElement | undefined;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - 40, behavior: "smooth" });
    }
  };

  return (
    <section className="relative mx-auto mt-16 max-w-[1200px] px-4 py-12 sm:px-6">
      <div
        ref={trackRef}
        className="flex gap-[min(4vw,59px)] overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="w-4 shrink-0" />
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
        <div className="w-4 shrink-0" />
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className="flex size-[60px] cursor-pointer items-center justify-center rounded-full bg-[#474747]/55 text-white transition-transform hover:bg-[#474747]/80 active:scale-95"
        >
          <ChevronLeft className="size-7" strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Next"
          className="flex size-[60px] cursor-pointer items-center justify-center rounded-full bg-[#474747]/55 text-white transition-transform hover:bg-[#474747]/80 active:scale-95"
        >
          <ChevronRight className="size-7" strokeWidth={3} />
        </button>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   FAQ (chat style)
──────────────────────────────────────────────────────────────────── */

interface FAQItem {
  q: string;
  a: string;
}

const FAQ: FAQItem[] = [
  {
    q: "What is Content Rewards and who is it for?",
    a: "Content Rewards is a creator platform built for anyone shipping short-form content. If you post, clip, or edit videos, you'll fit right in.",
  },
  {
    q: "How is this different from other creator programs?",
    a: "We don't run auctions or sponcon. You get paid per result — views, clicks, submissions — on campaigns that match your niche.",
  },
  {
    q: "What can I actually do on the platform?",
    a: "Apply to live brand campaigns, submit videos, track your balance in real time, and request payouts in PayPal, crypto, or bank transfer.",
  },
];

function ChatYou({ text }: { text: string }) {
  return (
    <div className="flex justify-end gap-2">
      <div className="flex max-w-[calc(100%-40px)] items-center rounded-[34px] rounded-br-none bg-[#E8980E] px-3 py-1.5 pl-2.5">
        <span
          style={{ fontFamily: "var(--font-sf-rounded)" }}
          className="text-[14px] font-light leading-[20px] tracking-[-0.05em] text-white"
        >
          {text}
        </span>
      </div>
      <div className="flex size-6 items-center justify-center rounded-full bg-white">
        <span className="font-inter text-[8px] font-semibold text-black">YOU</span>
      </div>
    </div>
  );
}

function ChatReply({ text }: { text: string }) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E8980E] to-[#FF7700]">
        <MessageCircle className="size-3.5 text-white" fill="currentColor" />
      </div>
      <div className="flex flex-1 items-center rounded-[34px] rounded-bl-none border-[3px] border-white bg-gradient-to-b from-[#F5F5F5] to-white px-5 py-3 shadow-[22px_20px_53px_-0.75px_rgba(17,17,18,0.07),5px_4.5px_12px_-0.5px_rgba(17,17,18,0.02)]">
        <span
          style={{ fontFamily: "var(--font-sf-rounded)" }}
          className="text-[15px] font-light leading-[1.2] tracking-[-0.05em] text-[#303030]"
        >
          {text}
        </span>
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <section className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-4 py-20 sm:px-10">
      {FAQ.map((f, i) => (
        <div key={i} className="flex flex-col gap-5 p-1.5">
          <ChatYou text={f.q} />
          <ChatReply text={f.a} />
        </div>
      ))}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Community + Footer
──────────────────────────────────────────────────────────────────── */

function CommunityCard({
  title,
  subtitle,
  icon,
  rotate,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  rotate: number;
}) {
  return (
    <div
      className="flex w-[313px] flex-col gap-4 rounded-3xl border-[3px] border-white bg-gradient-to-b from-[#F5F5F5] to-white px-7 py-6 shadow-[22px_20px_53px_-0.75px_rgba(17,17,18,0.07),10px_9px_24px_-0.63px_rgba(17,17,18,0.04),5px_4.5px_12px_-0.5px_rgba(17,17,18,0.02)]"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="mx-auto flex size-[75px] items-center justify-center rounded-3xl border border-white bg-gradient-to-br from-[#141414] to-[#2a2a2a]">
        {icon}
      </div>
      <div className="flex flex-col items-center gap-1">
        <Display as="h3" className="text-[20px] tracking-[-0.04em]">
          {title}
        </Display>
        <p className="font-inter text-[16px] font-medium tracking-[-0.02em] text-black/65">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function CommunitySection() {
  return (
    <section className="relative flex flex-col items-center gap-10 bg-gradient-to-b from-white via-white to-[#E8980E] px-6 py-16">
      <Display as="h2" className="text-center text-[clamp(28px,4vw,36px)] font-semibold tracking-[-0.06em] text-[#252525]">
        Still have Questions?
      </Display>

      <div className="relative flex h-[220px] w-full max-w-[640px] items-center justify-center">
        <div className="absolute left-[8%] top-1/2 -translate-y-1/2">
          <CommunityCard
            title="Twitter"
            subtitle="Follow us on X"
            rotate={1}
            icon={
              <svg viewBox="0 0 24 24" className="size-10 text-white" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
              </svg>
            }
          />
        </div>
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2">
          <CommunityCard
            title="Discord"
            subtitle="Join us on Discord"
            rotate={-1}
            icon={
              <svg viewBox="0 0 24 24" className="size-10 text-white" fill="currentColor">
                <path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.73 19.73 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.027 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.673-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            }
          />
        </div>
      </div>

      <p
        style={{ fontFamily: "var(--font-sf-rounded)" }}
        className="mt-16 text-[16px] font-light tracking-[-0.05em] text-white"
      >
        Content Rewards © 2026
      </p>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Sticky Unlock CTA
──────────────────────────────────────────────────────────────────── */

function StickyUnlock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <button
        type="button"
        className="pointer-events-auto flex h-[73px] w-full max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-[20px] bg-black/70 p-1.5 shadow-[0_5px_20px_rgba(0,0,0,0.25)]"
      >
        <span className="relative flex size-full flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[16px] bg-gradient-to-b from-[#E8980E] to-[#E8C02E] px-9 py-2 shadow-[inset_0_2px_2px_rgba(255,255,255,0.25)]">
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-5 h-20 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
              backgroundSize: "8px 8px",
            }}
          />
          <span className="relative flex items-center gap-2.5">
            <ArrowRight className="size-5 text-white" />
            <span
              style={{ fontFamily: "var(--font-sf-rounded)" }}
              className="text-[18px] font-light tracking-[-0.03em] text-white"
            >
              Unlock Access
            </span>
          </span>
          <span className="relative font-inter text-[14px] font-semibold tracking-[-0.03em] text-white">
            And Access Bonus Creator Training
          </span>
        </span>
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="relative w-full overflow-x-hidden bg-white text-[#191919]">
      <div className="mx-auto w-full max-w-[1200px]">
        <HeroSection />
      </div>
      <TimelineSection />
      <BrandsCTA />
      <TestimonialsCarousel />
      <FAQSection />
      <CommunitySection />
      <StickyUnlock />
    </main>
  );
}
