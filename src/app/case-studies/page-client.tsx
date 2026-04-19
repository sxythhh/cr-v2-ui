"use client";

import Link from "next/link";
import { DubNav } from "@/components/lander/dub-nav";
import { Caveat } from "next/font/google";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { VerifiedBadge } from "@/components/verified-badge";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
});

// ── Icons ────────────────────────────────────────────────────────────────────

function WorkflowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 4.5C2 3.11929 3.11929 2 4.5 2H6.5C7.88071 2 9 3.11929 9 4.5V6.5C9 7.88071 7.88071 9 6.5 9H4.5C3.11929 9 2 7.88071 2 6.5V4.5Z"
        fill="#4D4D4D"
      />
      <path
        d="M7 9.5C7 8.11929 8.11929 7 9.5 7H11.5C12.8807 7 14 8.11929 14 9.5V11.5C14 12.8807 12.8807 14 11.5 14H9.5C8.11929 14 7 12.8807 7 11.5V9.5Z"
        fill="#4D4D4D"
      />
      <path
        d="M9 5.5H12M12 5.5L10.5 4M12 5.5L10.5 7"
        stroke="#4D4D4D"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10.5H4M4 10.5L5.5 9M4 10.5L5.5 12"
        stroke="#4D4D4D"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.33334 8H12.6667M12.6667 8L8.66668 4M12.6667 8L8.66668 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OrangeIconBadge() {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF7A00]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 1.75V12.25M3.5 5.25L7 1.75L10.5 5.25"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SmartRepliesIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={active ? "opacity-100" : "opacity-0"}
    >
      <path
        d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V9C14 10.1046 13.1046 11 12 11H5L2 14V4Z"
        stroke={active ? "#FF7A00" : "#4D4D4D"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FollowUpsIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={active ? "opacity-100" : "opacity-0"}
    >
      <path
        d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C6.93913 14 5.92172 13.7372 5 13.2679L2 14L2.73214 11C2.26276 10.0783 2 9.06087 2 8Z"
        stroke={active ? "#FF7A00" : "#4D4D4D"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InsightsIcon({ active }: { active?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={active ? "opacity-100" : "opacity-0"}
    >
      <path
        d="M2 13L6 5L10 9L14 2"
        stroke={active ? "#FF7A00" : "#4D4D4D"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ text }: { text: string }) {
  return (
    <div className="flex w-[160px] flex-col gap-2 rounded-xl bg-white p-4 shadow-[0px_1px_1px_rgba(0,0,0,0.15),0px_3px_3px_rgba(0,0,0,0.05)] dark:bg-card-bg dark:shadow-[0px_1px_1px_rgba(0,0,0,0.4),0px_3px_3px_rgba(0,0,0,0.2)]">
      <OrangeIconBadge />
      <p className="font-inter text-[15.1px] leading-[1.4] text-[#4D4D4D] dark:text-[rgba(255,255,255,0.6)]">
        {text}
      </p>
    </div>
  );
}

// ── Testimonial Card ─────────────────────────────────────────────────────────

const TESTIMONIAL_SLIDES = [
  {
    label: "Founders & Operators",
    title: "Ametrix saves us hours every single day",
    quote: "Our inbox runs itself — drafts, follow-ups, and insights come without any manual effort.",
    name: "Dev Singh",
    handle: "@devopsingh",
    avatar: "https://i.pravatar.cc/96?img=12",
  },
  {
    label: "Growth Teams",
    title: "We scaled outreach 10x without hiring",
    quote: "The automated sequences and smart replies let our three-person team do what used to take thirty.",
    name: "Sarah Chen",
    handle: "@sarahgrowth",
    avatar: "https://i.pravatar.cc/96?img=5",
  },
  {
    label: "Creator Managers",
    title: "Finally, creator comms that don't break",
    quote: "Managing 200+ creators went from chaos to calm. The follow-up automation alone is worth it.",
    name: "Marcus Webb",
    handle: "@marcuswebb",
    avatar: "https://i.pravatar.cc/96?img=8",
  },
];

function TestimonialCard() {
  const [index, setIndex] = useState(0);
  const [shifting, setShifting] = useState(false);
  const slide = TESTIMONIAL_SLIDES[index];

  const goNext = useCallback(() => {
    setShifting(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIAL_SLIDES.length);
      setShifting(false);
    }, 250);
  }, []);

  return (
    <div
      className="relative w-[338px] shrink-0 cursor-pointer select-none overflow-hidden rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.2),0px_8px_32px_rgba(0,0,0,0.15)] transition-transform active:scale-[0.98]"
      onClick={goNext}
    >
      {/* Dark gradient background top section */}
      <div className="relative flex flex-col items-start gap-3 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-6 pb-5 pt-6">
        {/* Abstract decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-xl" />
        <div className="pointer-events-none absolute -left-4 bottom-0 h-24 w-24 rounded-full bg-gradient-to-tr from-blue-500/15 to-transparent blur-lg" />

        <div style={{ transition: "opacity 0.25s, filter 0.25s", opacity: shifting ? 0 : 1, filter: shifting ? "blur(4px)" : "blur(0)" }}>
          <span
            className={`${caveat.className} relative text-[20px] tracking-[-1.2px] text-white`}
          >
            {slide.label}
          </span>
          <h3 className="relative mt-2 font-inter text-[20.3px] font-semibold leading-[26px] text-white">
            {slide.title}
          </h3>
        </div>

        {/* Carousel indicators */}
        <div className="relative mt-1 flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5">
          {TESTIMONIAL_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (i !== index) {
                  setShifting(true);
                  setTimeout(() => { setIndex(i); setShifting(false); }, 250);
                }
              }}
              className={`cursor-pointer rounded-full transition-all duration-300 ${i === index ? "h-1.5 w-5 bg-white" : "h-1.5 w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom section - user info */}
      <div className="flex flex-col gap-3 bg-gradient-to-b from-[#0f3460] to-[#0a1628] px-6 pb-6 pt-5">
        <div style={{ transition: "opacity 0.25s, filter 0.25s", opacity: shifting ? 0 : 1, filter: shifting ? "blur(4px)" : "blur(0)" }}>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.avatar}
              alt={slide.name}
              className="h-12 w-12 rounded-[13px] shadow-[0px_2px_8px_rgba(0,0,0,0.4)]"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-inter text-[14.9px] font-medium text-white">
                  {slide.name}
                </span>
                <VerifiedBadge />
              </div>
              <span className="font-inter text-[13.2px] text-[#E0E0E0]">
                {slide.handle}
              </span>
            </div>
          </div>
          <p className="mt-3 font-inter text-[13.9px] leading-[1.5] text-[#E0E0E0]">
            &ldquo;{slide.quote}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Decorative Grid Lines (Figma-exact) ─────────────────────────────────────

function SmallLine({ direction, side }: {
  direction: "horizontal" | "vertical";
  side: "start" | "end";
}) {
  const { darkMode: dk } = useTheme();
  const lineColor = dk ? "rgba(255,255,255,0.04)" : "#E0E0E0";
  const isH = direction === "horizontal";
  const fadeDir = isH
    ? (side === "start" ? "to right" : "to left")
    : (side === "start" ? "to bottom" : "to top");
  const size = isH ? 90 : 120;

  return (
    <div
      className="absolute"
      style={{
        ...(isH ? { width: size, height: 1 } : { width: 1, height: size }),
        ...(isH && side === "start" ? { left: -size, top: 0 } : {}),
        ...(isH && side === "end" ? { right: -size, top: 0 } : {}),
        ...(!isH && side === "start" ? { top: -size, left: 0 } : {}),
        ...(!isH && side === "end" ? { bottom: -size, left: 0 } : {}),
        background: lineColor,
        maskImage: `linear-gradient(${fadeDir}, transparent 0%, black 100%)`,
        WebkitMaskImage: `linear-gradient(${fadeDir}, transparent 0%, black 100%)`,
      }}
    />
  );
}

function CornerDot({ position }: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const pos = {
    "top-left": { top: -4, left: -4 },
    "top-right": { top: -4, right: -4 },
    "bottom-left": { bottom: -4, left: -4 },
    "bottom-right": { bottom: -4, right: -4 },
  }[position];

  return (
    <div className="absolute" style={{ ...pos, width: 9, height: 9 }}>
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[#E0E0E0] dark:bg-white/[0.04]" />
      <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-[#E0E0E0] dark:bg-white/[0.04]" />
    </div>
  );
}

function DecorativeGrid() {
  const { darkMode: dk } = useTheme();
  const lc = dk ? "rgba(255,255,255,0.04)" : "#E0E0E0";
  return (
    <div className="pointer-events-none absolute inset-0 z-10" style={{ overflow: "visible" }}>
      {/* Border lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-[#E0E0E0] dark:bg-white/[0.04] shadow-[0_1px_0_#FFFFFF] dark:shadow-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#E0E0E0] dark:bg-white/[0.04] shadow-[0_1px_0_#FFFFFF] dark:shadow-none" />
      <div className="absolute inset-y-0 left-0 w-px bg-[#E0E0E0] dark:bg-white/[0.04] shadow-[1px_0_0_#FFFFFF] dark:shadow-none" />
      <div className="absolute inset-y-0 right-0 w-px bg-[#E0E0E0] dark:bg-white/[0.04] shadow-[1px_0_0_#FFFFFF] dark:shadow-none" />

      {/* Corner dots (crosshairs) */}
      <CornerDot position="top-left" />
      <CornerDot position="top-right" />
      <CornerDot position="bottom-left" />
      <CornerDot position="bottom-right" />

      {/* Left side gradient extensions */}
      <div className="absolute left-0 top-0" style={{ overflow: "visible" }}>
        <SmallLine direction="horizontal" side="start" />
        <SmallLine direction="vertical" side="start" />
      </div>
      <div className="absolute left-0 bottom-0" style={{ overflow: "visible" }}>
        {/* Bottom-left horizontal fade */}
        <div className="absolute" style={{
          width: 90, height: 1, left: -90, bottom: 0,
          background: lc,
          maskImage: "linear-gradient(to right, transparent 0%, black 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 100%)",
        }} />
        {/* Bottom-left vertical fade */}
        <div className="absolute" style={{
          width: 1, height: 120, left: 0, bottom: -120,
          background: lc,
          maskImage: "linear-gradient(to top, transparent 0%, black 50%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 50%)",
        }} />
      </div>

      {/* Right side gradient extensions */}
      <div className="absolute right-0 top-0" style={{ overflow: "visible" }}>
        {/* Top-right horizontal fade */}
        <div className="absolute" style={{
          width: 90, height: 1, right: -90, top: 0,
          background: lc,
          maskImage: "linear-gradient(to left, transparent 0%, black 100%)",
          WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 100%)",
        }} />
        {/* Top-right vertical fade */}
        <div className="absolute" style={{
          width: 1, height: 120, right: 0, top: -120,
          background: lc,
          maskImage: "linear-gradient(to bottom, transparent 0%, black 50%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 50%)",
        }} />
      </div>
      <div className="absolute right-0 bottom-0" style={{ overflow: "visible" }}>
        {/* Bottom-right horizontal fade */}
        <div className="absolute" style={{
          width: 90, height: 1, right: -90, bottom: 0,
          background: lc,
          maskImage: "linear-gradient(to left, transparent 0%, black 100%)",
          WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 100%)",
        }} />
        {/* Bottom-right vertical fade */}
        <div className="absolute" style={{
          width: 1, height: 120, right: 0, bottom: -120,
          background: lc,
          maskImage: "linear-gradient(to top, transparent 0%, black 50%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 50%)",
        }} />
      </div>
    </div>
  );
}

// ── Tab Bar ──────────────────────────────────────────────────────────────────

const tabs = [
  { label: "Smart Replies", icon: SmartRepliesIcon },
  { label: "Auto Follow-ups", icon: FollowUpsIcon },
  { label: "Conversation Insights", icon: InsightsIcon },
];

function TabBar() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mt-5 flex w-full items-stretch gap-0">
      {tabs.map((tab, i) => {
        const isActive = activeTab === i;
        const Icon = tab.icon;
        return (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className="group flex flex-1 flex-col items-center gap-0"
          >
            {/* Top indicator bar */}
            <div
              className={`h-[3px] w-full rounded-full ${
                isActive ? "bg-[#FF7A00]" : "bg-[#E0E0E0] dark:bg-white/[0.04]"
              }`}
            />
            {/* Label row */}
            <div className="flex items-center gap-1.5 px-3 py-3">
              <Icon active={isActive} />
              <span
                className={`font-inter text-[13.9px] font-medium ${
                  isActive ? "text-[#FF7A00]" : "text-[#4D4D4D] dark:text-[rgba(255,255,255,0.6)]"
                }`}
              >
                {tab.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Slot Machine Logo Grid ────────────────────────────────────────────────────

const TILE = 121;
const GAP_T = 8;
const STEP = TILE + GAP_T; // px per slot shift

// Brand images per testimonial — the "focused" center tile uses an actual image
const BRAND_IMAGES = [
  "/logos/brand1.png",
  "/logos/brand2.png",
  "/logos/brand3.png",
  "/logos/brand4.png",
  "/logos/brand5.png",
  "/logos/brand6.png",
  "/logos/brand7.jpeg",
  "/logos/brand10.png",
];

function Tile({ src, isFocused }: { src?: string; isFocused?: boolean }) {
  const base = "relative shrink-0 overflow-hidden rounded-lg";
  if (!src) {
    // Placeholder tile
    return (
      <div
        className={`${base} border border-[#E8E8E8] shadow-[0px_1px_2px_rgba(0,0,0,0.05),inset_0px_2px_0px_#FFFFFF]`}
        style={{ width: TILE, height: TILE, background: "linear-gradient(180deg, #F3F3F3 0%, #FAFAFA 100%)" }}
      />
    );
  }
  return (
    <div
      className={`${base} ${isFocused ? "shadow-[0px_1px_1px_rgba(0,0,0,0.18),0px_2px_4px_rgba(0,0,0,0.12),0px_8px_16px_rgba(0,0,0,0.1),inset_0px_0.5px_0px_#E3E3E3,inset_0px_1px_0px_#FFFFFF,inset_0px_-1px_0px_rgba(0,0,0,0.12)]" : "border border-[#E8E8E8] shadow-[0px_1px_2px_rgba(0,0,0,0.05),inset_0px_2px_0px_#FFFFFF]"}`}
      style={{ width: TILE, height: TILE, background: isFocused ? "#FFFFFF" : "linear-gradient(180deg, #F3F3F3 0%, #FAFAFA 100%)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full rounded-lg object-cover" />
    </div>
  );
}

// Middle column: empty, image per testimonial (2 rows each)
// Side columns: all placeholder tiles
// Each arrow click shifts by 2 rows = one "gear" notch
const DOUBLE_STEP = 2 * STEP;

function SlotColumn({ tiles, offsetPx, animate, reverse }: {
  tiles: (string | null)[];
  offsetPx: number;
  animate: boolean;
  reverse?: boolean;
}) {
  // Side columns move opposite: negate the offset
  const y = reverse ? offsetPx : -offsetPx;
  return (
    <div
      className="flex flex-col"
      style={{
        gap: GAP_T,
        transition: animate ? "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)" : "none",
        transform: `translateY(${y}px)`,
      }}
    >
      {tiles.map((src, i) => (
        <Tile key={i} src={src ?? undefined} />
      ))}
    </div>
  );
}

// ── Testimonial Ticker ───────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote: "Way too much value for free to be honest.",
    author: "James Traf",
    brand: "/logos/brand1.png",
  },
  {
    quote: "Big effort - high quality. Best Framer content out there.",
    author: "Jan Dittrich",
    brand: "/logos/brand2.png",
  },
  {
    quote: "I'm building a new website and it's absolutely ridiculous how valuable your content has been.",
    author: "Michael Riddering",
    brand: "/logos/brand3.png",
  },
  {
    quote: "The automation saved our team at least 10 hours a week. Absolutely game-changing.",
    author: "Sarah Chen",
    brand: "/logos/brand4.png",
  },
  {
    quote: "We went from manual outreach to fully automated pipelines in under a day.",
    author: "Alex Rivera",
    brand: "/logos/brand5.png",
  },
  {
    quote: "Our conversion rate doubled after switching. The insights alone are worth it.",
    author: "Priya Patel",
    brand: "/logos/brand6.png",
  },
  {
    quote: "Finally a tool that actually delivers on its promises. Incredible experience.",
    author: "Marcus Webb",
    brand: "/logos/brand7.jpeg",
  },
  {
    quote: "The onboarding was seamless and we saw results within the first week.",
    author: "Elena Kowalski",
    brand: "/logos/brand10.png",
  },
];

// Center column: [empty, image] per testimonial — one gap between each image
// Sequence: empty, image, empty, image, empty, image...
// Duplicated for seamless wrapping
function buildCenterColumn(): (string | null)[] {
  const rows: (string | null)[] = [];
  TESTIMONIALS.forEach((t) => {
    rows.push(null);    // empty above
    rows.push(t.brand); // image
  });
  // Duplicate for seamless wrap
  TESTIMONIALS.forEach((t) => {
    rows.push(null);
    rows.push(t.brand);
  });
  return rows;
}

// Side columns: all placeholders, same total length as center
function buildSideColumn(centerLen: number): (string | null)[] {
  return Array.from({ length: centerLen }, () => null);
}

function TestimonialTicker() {
  const { darkMode: dk } = useTheme();
  const gridBg = dk ? "#0a0a0a" : "#F0F0F0";
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const len = TESTIMONIALS.length;

  const [isShifting, setIsShifting] = useState(false);

  const goNext = useCallback(() => {
    setIsTransitioning(true);
    setIsShifting(true);
    setScrollIndex((prev) => prev + 1);
    setTimeout(() => setIsShifting(false), 300);
  }, []);

  const goPrev = useCallback(() => {
    setIsTransitioning(true);
    setIsShifting(true);
    setScrollIndex((prev) => prev - 1);
    setTimeout(() => setIsShifting(false), 300);
  }, []);

  // When the scroll index goes past the original set, snap back seamlessly
  useEffect(() => {
    if (scrollIndex >= len) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setScrollIndex(scrollIndex - len);
      }, 520); // after transition completes
      return () => clearTimeout(timer);
    }
    if (scrollIndex < 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setScrollIndex(scrollIndex + len);
      }, 520);
      return () => clearTimeout(timer);
    }
  }, [scrollIndex, len]);

  // Re-enable transitions after a snap reset
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => setIsTransitioning(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const activeIndex = ((scrollIndex % len) + len) % len;
  const t = TESTIMONIALS[activeIndex];
  const centerTiles = buildCenterColumn();
  const sideTiles = buildSideColumn(centerTiles.length);

  // Position so empty row is above the focused logo.
  // The image is at row 1. We want row 0 (empty) at the top of the viewport
  // and the image below it. Row 0 top = 0, image at row 1 top = STEP.
  // No initial offset needed — just start from 0 so the empty is at top and image below.
  const initialOffset = 0;
  const offsetPx = initialOffset + scrollIndex * DOUBLE_STEP;

  return (
    <div className="w-full overflow-hidden">
      <div className="flex h-[379px] items-center gap-2.5">
        {/* Left: Slot machine logo grid — 3 visible rows */}
        <div
          className="relative flex h-[379px] w-[380px] shrink-0 items-center justify-center gap-2 overflow-hidden"
        >
          {/* Edge fades matching #F0F0F0 — no top fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16" style={{ background: `linear-gradient(to right, ${gridBg}, transparent)` }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16" style={{ background: `linear-gradient(to left, ${gridBg}, transparent)` }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16" style={{ background: `linear-gradient(to top, ${gridBg}, transparent)` }} />
          <SlotColumn tiles={sideTiles} offsetPx={offsetPx} animate={isTransitioning} reverse />
          <SlotColumn tiles={centerTiles} offsetPx={offsetPx} animate={isTransitioning} />
          <SlotColumn tiles={sideTiles} offsetPx={offsetPx} animate={isTransitioning} reverse />
        </div>

        {/* Right: Testimonial quote area */}
        <div className="flex flex-1 flex-col justify-center gap-2.5 px-4 py-10">
          {/* Quote icon with inner drop shadow */}
          <div className="relative h-12 w-12">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <defs>
                <filter id="quote-inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feComponentTransfer in="SourceAlpha">
                    <feFuncA type="table" tableValues="1 0" />
                  </feComponentTransfer>
                  <feGaussianBlur stdDeviation="1.5" />
                  <feOffset dx="0" dy="1.5" result="offsetblur" />
                  <feFlood floodColor="rgba(0,0,0,0.2)" result="color" />
                  <feComposite in2="offsetblur" operator="in" />
                  <feComposite in2="SourceAlpha" operator="in" />
                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode />
                  </feMerge>
                </filter>
              </defs>
              <path d="M20 14H10C8.9 14 8 14.9 8 16V26C8 27.1 8.9 28 10 28H16L12 34H16L20 28V16C20 14.9 19.1 14 18 14H20ZM38 14H28C26.9 14 26 14.9 26 16V26C26 27.1 26.9 28 28 28H34L30 34H34L38 28V16C38 14.9 37.1 14 36 14H38Z" fill="#E8E8E8" filter="url(#quote-inner-shadow)" />
            </svg>
          </div>

          {/* Quote + author — subtle blur transition */}
          <div className="flex flex-col gap-3">
            <div style={{ transition: "filter 0.35s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.35s cubic-bezier(0.33, 1, 0.68, 1)", filter: isShifting ? "blur(3px)" : "blur(0px)", opacity: isShifting ? 0.5 : 1 }}>
              <p className="max-w-[390px] font-inter text-[22px] font-medium leading-[29px] tracking-[-0.44px] text-[#4A4A4A] dark:text-[#E0E0E0]">
                {t.quote}
              </p>
            </div>
            <div style={{ transition: "filter 0.35s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.35s cubic-bezier(0.33, 1, 0.68, 1)", filter: isShifting ? "blur(2px)" : "blur(0px)", opacity: isShifting ? 0.5 : 1 }}>
              <p className="font-inter text-sm font-medium text-[#ADACB1]">
                {t.author}
              </p>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="mt-1 flex items-center gap-1.5">
            <button
              onClick={goPrev}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(74,74,74,0.15)] transition-colors hover:bg-[#E8E8E8]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2.5L4.5 6L7.5 9.5" stroke="#4A4A4A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(74,74,74,0.15)] transition-colors hover:bg-[#E8E8E8]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#4A4A4A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}



interface TeamBlock {
  name: string;
  quote: string;
  accentColor: string;
}

const TEAM_BLOCKS: TeamBlock[] = [
  {
    name: "Gusto",
    accentColor: "#00A36F",
    quote: "Navattic helped us cut onboarding time by 40%. Our customers get to value faster than ever before.",
  },
  {
    name: "VTS",
    accentColor: "#1976D2",
    quote: "Product tours replaced 80% of our live demos. The sales team can now focus on closing, not presenting.",
  },
  {
    name: "Mixpanel",
    accentColor: "#7856FF",
    quote: "We saw a 3x increase in activation rates after embedding interactive demos into our signup flow.",
  },
  {
    name: "Vitally",
    accentColor: "#00B259",
    quote: "Interactive product demos reduced our support ticket volume by 35% in the first quarter alone.",
  },
  {
    name: "Qualio",
    accentColor: "#3D4CF2",
    quote: "Since deploying our demo, about 25% of all closed deals interact with our product tour at some point. It\u2019s unquestionable that it\u2019s working for our top-of-funnel audience.",
  },
  {
    name: "Fivetran",
    accentColor: "#00A1E0",
    quote: "Our interactive demos generate 2x more qualified pipeline than any other content type on our site.",
  },
  {
    name: "Dropbox",
    accentColor: "#0061FF",
    quote: "Navattic demos became our highest-converting asset. Trial starts from demo pages are up 60%.",
  },
  {
    name: "Front",
    accentColor: "#A857F1",
    quote: "We replaced static screenshots with interactive tours and saw engagement time double across the board.",
  },
  {
    name: "Datadog",
    accentColor: "#632CA6",
    quote: "Product-led growth needs product-led marketing. Navattic bridges that gap better than anything we\u2019ve tried.",
  },
];

const TEAMS_CYCLE_MS = 5000;

function TeamsLogoSection() {
  const [focusedIdx, setFocusedIdx] = useState(4);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  // Animate progress bar 0→100 over TEAMS_CYCLE_MS, then advance
  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const pct = Math.min(elapsed / TEAMS_CYCLE_MS, 1);
      setProgress(pct);

      if (pct < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Advance to next block
        setFocusedIdx((prev) => (prev + 1) % TEAM_BLOCKS.length);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [focusedIdx]);

  const handleClick = (idx: number) => {
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    setFocusedIdx(idx);
  };

  // Positions: swap focused block into slot 4 (center)
  const positions = (() => {
    const arr = TEAM_BLOCKS.map((_, i) => i);
    if (focusedIdx !== 4) {
      arr[4] = focusedIdx;
      arr[focusedIdx] = 4;
    }
    return { left: [arr[0], arr[1], arr[2], arr[3]], center: arr[4], right: [arr[5], arr[6], arr[7], arr[8]] };
  })();

  const centerBlock = TEAM_BLOCKS[positions.center];

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mx-auto max-w-[1358px] px-4 py-6 sm:px-16">
        <h2 className="font-inter text-[23.8px] font-medium leading-[30px] tracking-[-0.32px] text-[#0A0A0A]">
          Meet the teams building with Navattic.
        </h2>
      </div>

      {/* 3-column grid */}
      <div className="mx-auto flex max-w-[1358px] flex-col border-t border-[#E5E7EB] bg-[#E5E7EB] lg:flex-row lg:gap-px">
        {/* Left quadrant */}
        <div className="flex-1">
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-px bg-[#E5E7EB]">
            {positions.left.map((idx) => (
              <button
                key={idx}
                onClick={() => handleClick(idx)}
                className="flex h-[178px] cursor-pointer items-center justify-center bg-white px-4 transition-colors duration-200 hover:bg-[#F9FAFB]"
              >
                <span className="font-inter text-[14px] font-semibold tracking-[-0.2px] text-[#9CA3AF]">
                  {TEAM_BLOCKS[idx].name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Center — focused block */}
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-white p-10" style={{ minHeight: 356 }}>
          {/* Background gradient */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{ background: "linear-gradient(308.15deg, #F6F8F9 0%, #F6F8F9 0.18%, rgba(246, 248, 249, 0) 0.18%, rgba(246, 248, 249, 0) 0.7%)" }}
          />
          {/* Progress bar */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-[#E5E7EB]" />
          <div
            className="absolute left-0 top-0 h-[2px]"
            style={{
              width: `${progress * 100}%`,
              background: centerBlock.accentColor,
              transition: progress === 0 ? "none" : undefined,
            }}
          />

          {/* Quote */}
          <p className="font-inter text-[20px] font-medium leading-[25px] tracking-[-0.32px] text-[#384252]">
            &ldquo;{centerBlock.quote}&rdquo;
          </p>

          {/* Brand name */}
          <div className="mt-auto pt-12">
            <span className="font-inter text-[14px] font-semibold tracking-[-0.2px] text-[#9CA3AF]">
              {centerBlock.name}
            </span>
          </div>

          {/* Bottom gradient */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
            style={{
              background: `linear-gradient(0deg, ${centerBlock.accentColor} 0%, transparent 100%)`,
              opacity: 0.05,
            }}
          />
        </div>

        {/* Right quadrant */}
        <div className="flex-1">
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-px bg-[#E5E7EB]">
            {positions.right.map((idx) => (
              <button
                key={idx}
                onClick={() => handleClick(idx)}
                className="flex h-[178px] cursor-pointer items-center justify-center bg-white px-4 transition-colors duration-200 hover:bg-[#F9FAFB]"
              >
                <span className="font-inter text-[14px] font-semibold tracking-[-0.2px] text-[#9CA3AF]">
                  {TEAM_BLOCKS[idx].name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Case Study Grid (Attio-style) ───────────────────────────────────────────

interface CaseStudy {
  logo: string;
  logoWidth: number;
  logoHeight: number;
  category: string;
  headline: string;
  image: string;
  href?: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    logo: "/logos/brand1.png",
    logoWidth: 124,
    logoHeight: 27,
    category: "Prediction Markets / Clipping",
    headline: "77M+ organic views in 30 days. How Polymarket flooded every feed at $0.20 CPM.",
    image: "/logos/brand2.png",
    href: "/case-studies/polymarket",
  },
  {
    logo: "/logos/brand3.png",
    logoWidth: 126,
    logoHeight: 32,
    category: "Fitness / Clipping",
    headline: "124M views across 4,560 creator videos. How GYMSHARK scaled content without scaling their team.",
    image: "/logos/brand4.png",
    href: "/case-studies/gymshark",
  },
  {
    logo: "/logos/brand5.png",
    logoWidth: 111,
    logoHeight: 32,
    category: "Fintech / UGC + Clipping",
    headline: "45.8M views driving fintech adoption. How NovaPay reached Gen Z at $0.15 CPM.",
    image: "/logos/brand6.png",
    href: "/case-studies/novapay",
  },
  {
    logo: "/logos/brand7.jpeg",
    logoWidth: 143,
    logoHeight: 36,
    category: "SaaS / $20M [Series A]",
    headline: "Cloud infrastructure magic. How Railway turned usage data into revenue with Attio.",
    image: "/logos/brand10.png",
  },
  {
    logo: "/logos/brand1.png",
    logoWidth: 112,
    logoHeight: 36,
    category: "Venture Capital",
    headline: "From fragmented to unified. How USV turned siloed data into a source of truth with Attio.",
    image: "/logos/brand2.png",
  },
  {
    logo: "/logos/brand3.png",
    logoWidth: 143,
    logoHeight: 36,
    category: "SaaS / $95.6m [Series B]",
    headline: "Complete GTM visibility. Why Snackpass switched from Salesforce to Attio.",
    image: "/logos/brand4.png",
  },
  {
    logo: "/logos/brand5.png",
    logoWidth: 133,
    logoHeight: 32,
    category: "Creator Economy / $7.1m [Seed]",
    headline: "25% revenue boost. How Passionfroot built a creator-first CRM which scales.",
    image: "/logos/brand6.png",
  },
];

function CaseStudyArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.25 3.5L7 7L2.25 10.5M7.75 3.5L12.5 7L7.75 10.5"
        stroke="#1C1D1F"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashedDividerV() {
  const { darkMode: dk } = useTheme();
  return (
    <div
      className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
      style={{ borderLeft: `1px dashed ${dk ? "rgba(255,255,255,0.06)" : "#E4E7EC"}` }}
    />
  );
}

function CaseStudyCard({
  study,
  reversed = false,
}: {
  study: CaseStudy;
  reversed?: boolean;
}) {
  const { darkMode: dk } = useTheme();
  const dashedColor = dk ? "rgba(255,255,255,0.06)" : "#E4E7EC";
  const textSide = (
    <div className="flex flex-1 flex-col items-start px-8 py-10 sm:px-14 sm:py-16">
      {/* Logo */}
      <div className="mb-12 flex h-8 items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={study.logo}
          alt=""
          style={{ width: study.logoWidth, height: study.logoHeight }}
          className="object-contain"
        />
      </div>

      {/* Category */}
      <p className="mb-4 font-inter text-[11.6px] font-medium uppercase leading-[14px] tracking-[0.72px] text-[#8F99A8] dark:text-[rgba(255,255,255,0.35)]">
        {study.category}
      </p>

      {/* Headline */}
      <h3 className="mb-5 max-w-[448px] font-inter text-[24px] font-semibold leading-[32px] tracking-[-0.32px] text-[#1C1D1F] dark:text-[#E0E0E0] sm:text-[29px] sm:leading-[38px]">
        {study.headline}
      </h3>

      {/* Read case study link */}
      <a
        href={study.href ?? "#"}
        className="group flex items-center gap-1.5 font-inter text-[16px] font-medium leading-[22px] tracking-[-0.16px] text-[#1C1D1F] dark:text-[#E0E0E0] transition-opacity hover:opacity-70"
      >
        Read case study
        <CaseStudyArrow />
      </a>
    </div>
  );

  const imageSide = (
    <div className="relative flex flex-1 items-center justify-center px-0 py-10 sm:py-16">
      {/* Dashed horizontal lines (decorative) */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-16"
        style={{ height: 1, borderTop: `1px dashed ${dashedColor}` }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0 bottom-16"
        style={{ height: 1, borderTop: `1px dashed ${dashedColor}` }}
      />

      {/* Screenshot card */}
      <div className="relative mx-4 w-full max-w-[560px] overflow-hidden rounded-xl border border-[#D3D8DF] bg-white p-2 shadow-[0px_6px_20px_-2px_rgba(28,40,64,0.08),0px_2px_6px_rgba(28,40,64,0.06)] dark:border-white/[0.06] dark:bg-card-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={study.image}
          alt=""
          className="aspect-[16/9] w-full rounded-lg bg-[#F5F5F5] object-cover dark:bg-white/[0.03]"
        />
      </div>
    </div>
  );

  const card = (
    <div className={`relative flex min-h-[460px] flex-col bg-white dark:bg-[#161616] lg:flex-row ${study.href ? "cursor-pointer transition-shadow hover:shadow-lg" : ""}`}>
      {/* Center dashed divider */}
      <div className="pointer-events-none hidden lg:block">
        <DashedDividerV />
      </div>
      {reversed ? (
        <>
          {imageSide}
          {textSide}
        </>
      ) : (
        <>
          {textSide}
          {imageSide}
        </>
      )}
    </div>
  );

  return study.href ? <Link href={study.href}>{card}</Link> : card;
}

function CaseStudyPairRow({ left, right }: { left: CaseStudy; right: CaseStudy }) {
  return (
    <div className="relative flex flex-col bg-[#E4E7EC] dark:bg-white/[0.06] lg:flex-row lg:gap-px lg:px-px">
      {/* Left card */}
      <div className="relative flex-1 bg-white dark:bg-[#161616]">
        <div className="flex h-full flex-col px-8 py-10 sm:px-14 sm:py-16">
          {/* Logo */}
          <div className="mb-12 flex h-8 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={left.logo}
              alt=""
              style={{ width: left.logoWidth, height: left.logoHeight }}
              className="object-contain"
            />
          </div>

          {/* Category */}
          <p className="mb-4 font-inter text-[11.6px] font-medium uppercase leading-[14px] tracking-[0.72px] text-[#8F99A8] dark:text-[rgba(255,255,255,0.35)]">
            {left.category}
          </p>

          {/* Headline */}
          <h3 className="mb-5 max-w-[448px] font-inter text-[24px] font-semibold leading-[32px] tracking-[-0.32px] text-[#1C1D1F] dark:text-[#E0E0E0] sm:text-[29px] sm:leading-[38px]">
            {left.headline}
          </h3>

          {/* Read case study link */}
          <a
            href={left.href ?? "#"}
            className="group flex items-center gap-1.5 font-inter text-[16px] font-medium leading-[22px] tracking-[-0.16px] text-[#1C1D1F] dark:text-[#E0E0E0] transition-opacity hover:opacity-70"
          >
            Read case study
            <CaseStudyArrow />
          </a>
        </div>
      </div>

      {/* Right card */}
      <div className="relative flex-1 bg-white dark:bg-[#161616]">
        <div className="flex h-full flex-col px-8 py-10 sm:px-14 sm:py-16">
          {/* Logo */}
          <div className="mb-12 flex h-8 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={right.logo}
              alt=""
              style={{ width: right.logoWidth, height: right.logoHeight }}
              className="object-contain"
            />
          </div>

          {/* Category */}
          <p className="mb-4 font-inter text-[11.6px] font-medium uppercase leading-[14px] tracking-[0.72px] text-[#8F99A8] dark:text-[rgba(255,255,255,0.35)]">
            {right.category}
          </p>

          {/* Headline */}
          <h3 className="mb-5 max-w-[448px] font-inter text-[24px] font-semibold leading-[32px] tracking-[-0.32px] text-[#1C1D1F] dark:text-[#E0E0E0] sm:text-[29px] sm:leading-[38px]">
            {right.headline}
          </h3>

          {/* Read case study link */}
          <a
            href={right.href ?? "#"}
            className="group flex items-center gap-1.5 font-inter text-[16px] font-medium leading-[22px] tracking-[-0.16px] text-[#1C1D1F] dark:text-[#E0E0E0] transition-opacity hover:opacity-70"
          >
            Read case study
            <CaseStudyArrow />
          </a>
        </div>
      </div>
    </div>
  );
}

function CaseStudyGrid() {
  return (
    <section className="w-full px-4 sm:px-6">
      <div className="mx-auto max-w-[1390px]">
        <div className="flex flex-col">
          {/* Row 1: Full-width — Granola (text left, image right) */}
          <div className="border-y border-[#E4E7EC] dark:border-white/[0.06]">
            <CaseStudyCard study={CASE_STUDIES[0]} />
          </div>

          {/* Row 2: Two-up — Modal + Flatfile */}
          <div className="border-b border-[#E4E7EC] dark:border-white/[0.06]">
            <CaseStudyPairRow left={CASE_STUDIES[1]} right={CASE_STUDIES[2]} />
          </div>

          {/* Row 3: Full-width — Railway (image left, text right) */}
          <div className="border-b border-[#E4E7EC] dark:border-white/[0.06]">
            <CaseStudyCard study={CASE_STUDIES[3]} reversed />
          </div>

          {/* Row 4: Two-up — USV + Snackpass */}
          <div className="border-b border-[#E4E7EC] dark:border-white/[0.06]">
            <CaseStudyPairRow left={CASE_STUDIES[4]} right={CASE_STUDIES[5]} />
          </div>

          {/* Row 5: Full-width — Passionfroot (text left, image right) */}
          <div className="border-b border-[#E4E7EC] dark:border-white/[0.06]">
            <CaseStudyCard study={CASE_STUDIES[6]} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Typewriter Section ───────────────────────────────────────────────────────

type TextSegment = { text: string; highlight?: boolean };

const TYPEWRITER_LINES: TextSegment[][] = [
  [
    { text: "We view our clients as " },
    { text: "true partners.", highlight: true },
  ],
  [
    { text: "This means working hand-in-hand, while tackling diverse" },
  ],
  [
    { text: "marketing challenges.", highlight: true },
    { text: " We bring our" },
  ],
  [
    { text: "ideas and solutions to life seamlessly." },
  ],
  [
    { text: "We are looking to ", highlight: false },
    { text: "grow your business.", highlight: true },
  ],
];

// Pre-process lines into "tokens": plain words, spaces, and highlight-group spans
type Token =
  | { type: "space" }
  | { type: "word"; text: string; wordIndex: number }
  | { type: "highlight-group"; words: { text: string; wordIndex: number }[] };

function buildTokens(lines: TextSegment[][]): { lines: Token[][]; totalWords: number } {
  const result: Token[][] = [];
  let wordIndex = 0;

  for (const line of lines) {
    const lineTokens: Token[] = [];
    let highlightBuffer: { text: string; wordIndex: number }[] = [];

    const flushHighlight = () => {
      if (highlightBuffer.length > 0) {
        lineTokens.push({ type: "highlight-group", words: highlightBuffer });
        highlightBuffer = [];
      }
    };

    for (const seg of line) {
      const parts = seg.text.split(/(\s+)/).filter(Boolean);
      for (const part of parts) {
        const isSpace = /^\s+$/.test(part);
        if (isSpace) {
          if (highlightBuffer.length > 0 && seg.highlight) {
            // Space inside a highlighted run — keep it in the group
            highlightBuffer.push({ text: part, wordIndex: -1 });
          } else {
            flushHighlight();
            lineTokens.push({ type: "space" });
          }
        } else if (seg.highlight) {
          highlightBuffer.push({ text: part, wordIndex });
          wordIndex++;
        } else {
          flushHighlight();
          lineTokens.push({ type: "word", text: part, wordIndex });
          wordIndex++;
        }
      }
    }
    flushHighlight();
    result.push(lineTokens);
  }

  return { lines: result, totalWords: wordIndex };
}

function TypewriterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!section) { ticking = false; return; }
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const raw = 1 - rect.top / (vh * 0.55);
        setProgress(Math.max(0, Math.min(1, raw)));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { lines: tokenLines, totalWords } = buildTokens(TYPEWRITER_LINES);

  // Smooth ease-out cubic — no overshoot, gentle deceleration
  const ease = (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(1 - t, 3);
  };

  const SPREAD = 0.14; // wider window = softer cascade

  const wordEase = (idx: number) => {
    const start = (idx / totalWords) * (1 - SPREAD);
    const end = start + SPREAD;
    const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
    return ease(t);
  };

  // Button reveal
  const btnT = ease(Math.max(0, Math.min(1, (progress - 0.82) / 0.18)));

  return (
    <section
      ref={sectionRef}
      className="flex w-full flex-col items-center justify-center bg-white px-8 py-[140px] dark:bg-white"
    >
      <div className="flex max-w-[800px] flex-col items-center gap-8">
        <div className="text-center font-inter text-[32px] font-medium leading-[56px] tracking-[-2.2px] text-[#1A1A1A] sm:text-[40px]">
          {tokenLines.map((tokens, li) => (
            <div key={li}>
              {tokens.map((token, ti) => {
                if (token.type === "space") {
                  return <span key={ti}>{" "}</span>;
                }

                if (token.type === "word") {
                  const e = wordEase(token.wordIndex);
                  return (
                    <span
                      key={ti}
                      className="inline-block"
                      style={{
                        opacity: 0.08 + e * 0.62,
                        color: "rgba(255,255,255,0.7)",
                        transform: `translateY(${(1 - e) * 6}px)`,
                        filter: `blur(${(1 - e) * 2}px)`,
                      }}
                    >
                      {token.text}
                    </span>
                  );
                }

                // highlight-group: single pill behind all words
                const groupWords = token.words.filter((w) => w.wordIndex >= 0);
                const firstE = wordEase(groupWords[0].wordIndex);
                const lastE = wordEase(groupWords[groupWords.length - 1].wordIndex);
                const groupE = (firstE + lastE) / 2;
                // Pill wipe: based on earliest word in group
                const pillE = ease(Math.max(0, Math.min(1,
                  (progress - (groupWords[0].wordIndex / totalWords) * (1 - SPREAD)) / (SPREAD * 1.8)
                )));

                return (
                  <span
                    key={ti}
                    className="relative inline-block"
                    style={{
                      transform: `translateY(${(1 - groupE) * 6}px)`,
                      filter: `blur(${(1 - groupE) * 2}px)`,
                    }}
                  >
                    {/* Single continuous pill */}
                    <span
                      className="absolute -inset-x-[5px] -inset-y-[2px] rounded-[5px] bg-[#2622F5]"
                      style={{
                        opacity: pillE,
                        clipPath: `inset(0 ${(1 - pillE) * 100}% 0 0)`,
                      }}
                    />
                    {/* Words */}
                    {token.words.map((w, wi) => {
                      if (w.wordIndex < 0) {
                        // Space inside highlight group
                        return <span key={wi} className="relative z-10">{" "}</span>;
                      }
                      const e = wordEase(w.wordIndex);
                      return (
                        <span
                          key={wi}
                          className="relative z-10 text-white"
                          style={{ opacity: 0.1 + e * 0.9 }}
                        >
                          {w.text}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        <a
          href="#"
          className="mt-4 inline-flex items-center justify-center rounded-[10px] bg-[#1A1A1A] px-[18px] py-[10px] font-inter text-[16px] font-semibold leading-[26px] tracking-[-0.64px] text-white"
          style={{
            opacity: btnT,
            transform: `translateY(${(1 - btnT) * 8}px)`,
          }}
        >
          Start Application
        </a>
      </div>
    </section>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export function CaseStudiesPageClient() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-dvh font-inter ${darkMode ? "bg-[#0a0a0a] text-[#e5e5e5]" : "bg-white text-[#1A1A1A]"}`}>
      <DubNav transparent theme={darkMode ? "dark" : "light"} />

      {/* Grid Carousel Testimonial in gray container */}
      <section className="w-full px-4 py-[80px] sm:px-6">
        <div className="relative mx-auto max-w-[1140px] overflow-visible bg-[#F0F0F0] dark:bg-[#0a0a0a]">
          <DecorativeGrid />
          <div className="relative z-0 overflow-hidden">
            <TestimonialTicker />
          </div>
        </div>
      </section>

      {/* Founders & Operators Testimonial */}
      <section className="w-full px-4 pb-[100px] sm:px-6">
        <div className="mx-auto flex max-w-[1140px] justify-center">
          <TestimonialCard />
        </div>
      </section>

      {/* Typewriter Partners Section */}
      <TypewriterSection />

      {/* Teams Logo Grid */}
      <TeamsLogoSection />
    </div>
  );
}
