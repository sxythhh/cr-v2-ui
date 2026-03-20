"use client";

import { DubNav } from "@/components/lander/dub-nav";
import { useEffect, useRef, useState } from "react";

// ── Icons ────────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.75 3.01L20.25 12L6.75 20.99V3.01Z"
        fill="#1A1A1A"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmartRepliesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 3L13 3M3 8H10M3 13H7" stroke="#7C2D12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FollowUpsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.5 2L5.5 5L2.5 8" stroke="#7C2D12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="5" r="2" stroke="#7C2D12" strokeWidth="1.5" />
    </svg>
  );
}

function PrioritySortingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="3" width="4" height="4" rx="1" stroke="#7C2D12" strokeWidth="1.5" />
      <rect x="9" y="3" width="4" height="4" rx="1" stroke="#7C2D12" strokeWidth="1.5" />
      <rect x="3" y="9" width="4" height="4" rx="1" stroke="#7C2D12" strokeWidth="1.5" />
      <line x1="11" y1="10" x2="11" y2="12" stroke="#7C2D12" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="11" x2="12" y2="11" stroke="#7C2D12" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L8.55 4.65L12 5.15L9.5 7.6L10.1 11.05L7 9.4L3.9 11.05L4.5 7.6L2 5.15L5.45 4.65L7 1.5Z" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HalfStarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <defs><clipPath id="half"><rect x="0" y="0" width="7" height="14" /></clipPath></defs>
      <path d="M7 1.5L8.55 4.65L12 5.15L9.5 7.6L10.1 11.05L7 9.4L3.9 11.05L4.5 7.6L2 5.15L5.45 4.65L7 1.5Z" fill="#1A1A1A" clipPath="url(#half)" />
      <path d="M7 1.5L8.55 4.65L12 5.15L9.5 7.6L10.1 11.05L7 9.4L3.9 11.05L4.5 7.6L2 5.15L5.45 4.65L7 1.5Z" stroke="#1A1A1A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ── Etched line style ────────────────────────────────────────────────────────

/** All #E0E0E0 borders get a 1px white shadow below for the embossed look */
const etchedLine = "bg-[#E0E0E0] shadow-[0px_1px_0px_#FFFFFF]";

// ── Orange Badge ─────────────────────────────────────────────────────────────

function OrangeBadge({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
      style={{ background: "linear-gradient(180deg, rgba(250,145,59,0.8) 0%, rgba(246,143,58,0.2) 100%)" }}
    >
      <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-[#FF7A00]">
        {children}
      </div>
    </div>
  );
}

// ── Logo Marquee ─────────────────────────────────────────────────────────────

const LOGOS_ROW_1 = ["Stripe", "Linear", "Vercel", "Notion", "Figma"];
const LOGOS_ROW_2 = ["Slack", "GitHub", "Discord", "Framer", "Raycast", "Arc"];

function LogoMarquee({ logos, reverse }: { logos: string[]; reverse?: boolean }) {
  const doubled = [...logos, ...logos, ...logos, ...logos];
  return (
    <div className="relative h-[38px] w-full overflow-hidden">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[90px] bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[90px] bg-gradient-to-l from-white to-transparent" />
      <div
        className="flex items-center gap-10"
        style={{
          animation: `${reverse ? "marquee-reverse" : "marquee"} 30s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((name, i) => (
          <div key={i} className="flex h-[38px] w-[114px] shrink-0 items-center justify-center">
            <span className="font-inter text-[15px] font-semibold tracking-[-0.2px] text-[#B0B0B0]">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const target = 461;
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            setCount(Math.round((1 - Math.pow(1 - t, 3)) * target));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="font-inter text-[29.5px] font-semibold leading-[45px] tracking-[-0.6px] text-[#1A1A1A]">
      {count}+ Brands
    </div>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <SmartRepliesIcon />,
    title: "Smart Replies",
    description: "Creates accurate, context-aware email drafts instantly.",
  },
  {
    icon: <FollowUpsIcon />,
    title: "Auto Follow-ups",
    description: "Sends timely reminders so conversations stay active.",
  },
  {
    icon: <PrioritySortingIcon />,
    title: "Priority Sorting",
    description: "Highlights important messages and hides inbox noise.",
  },
];

// ── Core Features Section ────────────────────────────────────────────────────

const TABS = [
  "Smart Replies",
  "Auto Follow-ups",
  "Conversation Insights",
  "Lead Intelligence",
  "Priority Sorting",
];

interface TabContent {
  title: string;
  description: string;
  stat1: string;
  stat1Label: string;
  stat2: string;
  stat2Label: string;
}

const TAB_CONTENT: TabContent[] = [
  {
    title: "AI Email Drafts",
    description: "Spend 5 seconds reviewing instead of 10 minutes researching.",
    stat1: "100%",
    stat1Label: "Faster email drafting",
    stat2: "10X",
    stat2Label: "Productivity increase",
  },
  {
    title: "Smart Follow-ups",
    description: "Never let a conversation go cold with automated, timely reminders.",
    stat1: "85%",
    stat1Label: "Reply rate increase",
    stat2: "3X",
    stat2Label: "More meetings booked",
  },
  {
    title: "Deep Insights",
    description: "Understand conversation patterns and optimize your outreach strategy.",
    stat1: "50%",
    stat1Label: "Better response rates",
    stat2: "2X",
    stat2Label: "Deal velocity",
  },
  {
    title: "Lead Scoring",
    description: "Automatically prioritize leads based on engagement and intent signals.",
    stat1: "40%",
    stat1Label: "More qualified leads",
    stat2: "5X",
    stat2Label: "Faster qualification",
  },
  {
    title: "Inbox Priority",
    description: "Focus on what matters most with intelligent message sorting.",
    stat1: "90%",
    stat1Label: "Less inbox noise",
    stat2: "4X",
    stat2Label: "Faster triage",
  },
];

const BOTTOM_FEATURES = [
  {
    icon: <SmartRepliesIcon />,
    title: "Free Trial",
    description: "Start automating replies instantly.",
  },
  {
    icon: <PrioritySortingIcon />,
    title: "Takes 30 seconds",
    description: "Set up your agent in few moments.",
  },
  {
    icon: <FollowUpsIcon />,
    title: "30-day Guarantee",
    description: "Try full features with peace of mind.",
  },
];

function CoreFeaturesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const content = TAB_CONTENT[activeTab];

  return (
    <section className="mx-auto w-full max-w-[946px] px-4 py-[100px] sm:px-6">
      <div className="flex flex-col items-center gap-[60px]">
        {/* Header */}
        <div className="flex flex-col items-center gap-[17px]">
          {/* Pill badge */}
          <div className="flex items-center gap-2 rounded-full bg-white px-2.5 pr-3 shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_3px_3px_rgba(0,0,0,0.05)]">
            <div className="flex h-[29px] w-[29px] items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="#262626" strokeWidth="1.25" />
              </svg>
            </div>
            <span className="font-inter text-[12.9px] leading-[21px] tracking-[-0.28px] text-[#4D4D4D]">
              Core Features
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-center font-inter text-[15.7px] leading-[26px] tracking-[-0.17px] text-[#4D4D4D]">
            Explore how each agent automates a specific part of your inbox workflow.
          </p>
        </div>

        {/* Tab bar + content */}
        <div className="flex w-full flex-col items-center gap-5">
          {/* Tabs */}
          <div className="w-full overflow-x-auto">
            <div className="mx-auto flex w-fit items-center rounded-full bg-[#EAEAEA] p-1">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`relative whitespace-nowrap rounded-full px-4 py-[11px] font-inter text-[13.9px] leading-[22px] tracking-[-0.3px] transition-all ${
                    activeTab === i
                      ? "bg-white text-[#1A1A1A] shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_3px_3px_rgba(0,0,0,0.05)]"
                      : "text-[#4D4D4D] hover:text-[#1A1A1A]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content card */}
          <div className="w-full rounded-[20px] bg-white p-5 shadow-[0px_14px_30px_rgba(209,209,209,0.1),0px_55px_55px_rgba(209,209,209,0.09),0px_1px_1px_rgba(0,0,0,0.15),0px_3px_3px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col lg:flex-row">
              {/* Left: text content */}
              <div className="flex flex-1 flex-col">
                <div className="flex flex-col gap-[30px] p-[30px] pb-5">
                  {/* Icon + title + description */}
                  <div className="flex max-w-[300px] flex-col gap-3">
                    <OrangeBadge><SmartRepliesIcon /></OrangeBadge>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-inter text-[27.9px] font-semibold leading-[45px] tracking-[-0.6px] text-[#1A1A1A]">
                        {content.title}
                      </h3>
                      <p className="font-inter text-[14.8px] leading-[24px] tracking-[-0.16px] text-[#4D4D4D]">
                        {content.description}
                      </p>
                    </div>
                  </div>

                  {/* Book a Demo button */}
                  <a
                    href="#"
                    className="flex w-fit items-center gap-1 rounded-full bg-[#F5F5F5] py-[13px] pl-[18px] pr-[13px] font-inter text-[13.9px] leading-[22px] tracking-[-0.3px] text-[#1A1A1A] transition-colors hover:bg-[#EBEBEB]"
                  >
                    Book a Demo
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="-rotate-90">
                      <path d="M9.17 8.25L11 13.75L12.83 8.25" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>

                {/* Stats row */}
                <div className="relative flex">
                  <div className={`absolute inset-x-0 top-0 h-px ${etchedLine}`} />
                  <div className="flex flex-1 flex-col gap-4 p-[30px] pb-6">
                    <span className="font-inter text-[28.7px] font-semibold leading-[45px] tracking-[-0.6px] text-[#1A1A1A]">
                      {content.stat1}
                    </span>
                    <span className="font-inter text-[14.6px] leading-[24px] tracking-[-0.16px] text-[#4D4D4D]">
                      {content.stat1Label}
                    </span>
                  </div>
                  <div className={`w-px ${etchedLine}`} />
                  <div className="flex flex-1 flex-col gap-4 p-[30px] pb-6">
                    <span className="font-inter text-[26.8px] font-semibold leading-[45px] tracking-[-0.6px] text-[#1A1A1A]">
                      {content.stat2}
                    </span>
                    <span className="font-inter text-[14.8px] leading-[24px] tracking-[-0.16px] text-[#4D4D4D]">
                      {content.stat2Label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: screenshot placeholder */}
              <div className="flex max-w-[395px] flex-1 items-center p-2.5 pr-2.5 pl-0">
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-[#FAFAFA] to-[#F0F0F0]" style={{ minHeight: 400 }}>
                  {/* Grid pattern to suggest UI */}
                  <div className="h-full w-full rounded-xl opacity-[0.06]" style={{
                    backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                    backgroundSize: "60px 40px",
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom features row */}
          <div className="relative w-full">
            <div className={`absolute inset-x-0 bottom-0 h-px ${etchedLine}`} />
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {BOTTOM_FEATURES.map((f, i) => (
                <div key={i} className="relative flex gap-2.5 p-[30px]">
                  {i < 2 && (
                    <div className={`absolute right-0 top-0 bottom-0 hidden w-px lg:block ${etchedLine}`} />
                  )}
                  <OrangeBadge>{f.icon}</OrangeBadge>
                  <div className="flex flex-col">
                    <h4 className="font-inter text-[16.7px] font-semibold leading-[27px] tracking-[-0.36px] text-[#1A1A1A]">
                      {f.title}
                    </h4>
                    <p className="font-inter text-[15px] leading-[24px] tracking-[-0.16px] text-[#4D4D4D]">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export function ProductLanderClient() {
  return (
    <div className="min-h-dvh bg-white font-inter">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Nav */}
      <DubNav transparent theme="light" />

      <div className="mx-auto w-full max-w-[1140px] px-4 sm:px-6">
        {/* ── Hero: Dashboard Preview ── */}
        <section className="relative" style={{ aspectRatio: "1140 / 598" }}>
          {/* Outer container with gradient mask */}
          <div className="absolute inset-0 overflow-hidden rounded-[4px]">
            {/* Background */}
            <div className="absolute inset-0 bg-[#F5F5F5]" />

            {/* Top-to-bottom black gradient mask (subtle) */}
            <div
              className="absolute inset-0 z-[1]"
              style={{ background: "linear-gradient(0deg, rgba(0,0,0,0) 0%, #000 100%)", opacity: 0.03 }}
            />

            {/* Dashboard frame */}
            <div className="absolute inset-[15px] z-[2]">
              {/* Blur layer behind dashboard */}
              <div className="absolute inset-0 rounded-[24px] bg-white" style={{ filter: "blur(5px)" }} />

              {/* Dashboard image placeholder */}
              <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-[#E8E8E8] bg-white">
                {/* Window chrome */}
                <div className="flex h-[48px] items-center gap-2 border-b border-[#F0F0F0] px-5">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#28C840]" />
                  <div className="ml-4 h-[26px] w-[240px] rounded-md bg-[#F5F5F5]" />
                </div>

                {/* Dashboard content */}
                <div className="flex h-[calc(100%-48px)]">
                  {/* Sidebar */}
                  <div className="hidden w-[200px] border-r border-[#F0F0F0] p-4 sm:block">
                    <div className="mb-6 h-4 w-[100px] rounded bg-[#EBEBEB]" />
                    <div className="flex flex-col gap-3">
                      <div className="h-3 w-[140px] rounded bg-[#F0F0F0]" />
                      <div className="h-3 w-[120px] rounded bg-[#F5F5F5]" />
                      <div className="h-3 w-[130px] rounded bg-[#F5F5F5]" />
                      <div className="h-3 w-[100px] rounded bg-[#F5F5F5]" />
                    </div>
                  </div>

                  {/* Main area */}
                  <div className="flex-1 p-6">
                    <div className="mb-6 h-5 w-[200px] rounded bg-[#EBEBEB]" />
                    <div className="grid grid-cols-3 gap-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] p-4">
                          <div className="mb-2 h-3 w-[60px] rounded bg-[#E8E8E8]" />
                          <div className="h-7 w-[80px] rounded bg-[#EBEBEB]" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 h-[120px] rounded-xl border border-[#F0F0F0] bg-[#FAFAFA]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Play button — dead center */}
            <div className="absolute inset-0 z-[3] flex items-center justify-center">
              <button
                className="flex h-[80px] w-[80px] items-center justify-center rounded-full backdrop-blur-[6px]"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 44%, rgba(0,0,0,0) 100%)" }}
              >
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white shadow-[0px_3px_3px_rgba(0,0,0,0.05),0px_1px_1px_rgba(0,0,0,0.15)]">
                  <PlayIcon />
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* ── Social Proof Strip ── */}
        <section className="relative">
          <div className={`absolute inset-x-0 top-0 h-px ${etchedLine}`} />
          <div className={`absolute inset-x-0 bottom-0 h-px ${etchedLine}`} />

          <div className="flex flex-col lg:flex-row">
            {/* Left: Trusted by + counter + rating */}
            <div className="relative flex flex-col gap-5 p-[30px] lg:w-[376px]">
              <div className={`absolute right-0 top-0 bottom-0 hidden w-px lg:block ${etchedLine}`} />

              <div className="flex flex-col">
                <span className="font-inter text-[14.8px] leading-[24px] tracking-[-0.16px] text-[#4D4D4D]">
                  Trusted by
                </span>
                <AnimatedCounter />
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-[5px]">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <HalfStarIcon />
                </div>
                <span className="font-inter text-[13.8px] leading-[22px] tracking-[-0.3px] text-[#1A1A1A]">
                  4.9 Average user rating
                </span>
              </div>
            </div>

            {/* Right: Logo marquees */}
            <div className="flex flex-1 flex-col justify-center gap-5 py-7">
              <LogoMarquee logos={LOGOS_ROW_1} />
              <div className={`mx-auto h-px w-full ${etchedLine}`} />
              <LogoMarquee logos={LOGOS_ROW_2} reverse />
            </div>
          </div>
        </section>

        {/* ── Features Row ── */}
        <section className="relative">
          <div className={`absolute inset-x-0 bottom-0 h-px ${etchedLine}`} />

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="relative flex gap-2.5 p-[30px]">
                {i < 2 && (
                  <div className={`absolute right-0 top-0 bottom-0 hidden w-px lg:block ${etchedLine}`} />
                )}
                <OrangeBadge>{f.icon}</OrangeBadge>
                <div className="flex flex-col">
                  <h3 className="font-inter text-[16.7px] font-semibold leading-[27px] tracking-[-0.36px] text-[#1A1A1A]">
                    {f.title}
                  </h3>
                  <p className="font-inter text-[15px] leading-[24px] tracking-[-0.16px] text-[#4D4D4D]">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Core Features Section ── */}
      <CoreFeaturesSection />
    </div>
  );
}
