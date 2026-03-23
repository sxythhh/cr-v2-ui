"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";

/* ── Types ── */

type ChangeCategory = "new" | "fixed" | "improved";

interface ChangeItem { category: ChangeCategory; text: string }

interface Entry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  changes: ChangeItem[];
}

/* ── Data ── */

const ENTRIES: Entry[] = [
  {
    id: "2-5-0", version: "2.5.0", date: "March 2026", title: "Stories Editor",
    description: "Full canvas editor with Framer integration, auto-save, and the play icon from the help page.",
    changes: [
      { category: "new", text: "Stories page with grid view and editor" },
      { category: "new", text: "Floating bottom toolbar with blur backdrop" },
      { category: "improved", text: "Play icon reused across help and stories" },
    ],
  },
  {
    id: "2-4-0", version: "2.4.0", date: "March 2026", title: "Help Center Redesign",
    description: "Category-based help center with AI chat support, replacing the old docs sidebar.",
    changes: [
      { category: "new", text: "Category cards with academy link" },
      { category: "new", text: "Redesigned AI chat widget with orange mascot" },
      { category: "improved", text: "Shimmer text gradient on thinking indicator" },
      { category: "fixed", text: "Help page scrolling and height issues" },
    ],
  },
  {
    id: "2-3-0", version: "2.3.0", date: "February 2026", title: "Dark Mode Overhaul",
    description: "Complete dark mode color system aligned to Figma spec across every component.",
    changes: [
      { category: "new", text: "Page bg #161616, card bg #1C1C1C, sidebar #111111" },
      { category: "improved", text: "All hardcoded dark colors replaced with tokens" },
      { category: "improved", text: "Visible borders on headers and footers" },
      { category: "fixed", text: "Modal transparency and button visibility" },
    ],
  },
  {
    id: "2-2-0", version: "2.2.0", date: "January 2026", title: "Verified Agencies",
    description: "Agency partner program with milestone rewards, verified badges, and inbound leads.",
    changes: [
      { category: "new", text: "Verified agency page with partner program" },
      { category: "new", text: "Milestone rewards table with hover previews" },
      { category: "improved", text: "Fluid shared tooltip on trusted-by avatars" },
    ],
  },
  {
    id: "2-1-0", version: "2.1.0", date: "December 2025", title: "Campaign Details",
    description: "Full campaign detail view with tabs, events feed, finance tracking, and boost flow.",
    changes: [
      { category: "new", text: "Campaign details with proximity hover tabs" },
      { category: "new", text: "Events tab with category filters" },
      { category: "new", text: "Boost campaign and end campaign modals" },
      { category: "improved", text: "Footer action buttons for edit, top up, boost" },
    ],
  },
  {
    id: "2-0-0", version: "2.0.0", date: "November 2025", title: "Platform Redesign",
    description: "Complete visual overhaul with new design system, sidebar navigation, and dark mode.",
    changes: [
      { category: "new", text: "Proximity hover sidebar with animated icons" },
      { category: "new", text: "Business onboarding typeform with 7 steps" },
      { category: "improved", text: "Mobile responsiveness across all pages" },
      { category: "improved", text: "WCAG 2.1 AA accessibility" },
    ],
  },
  {
    id: "1-5-0", version: "1.5.0", date: "October 2025", title: "Campaign Automation",
    description: "Automated workflows for approvals, payments, and content review.",
    changes: [
      { category: "new", text: "Automated content approval workflows" },
      { category: "new", text: "Scheduled payment processing" },
      { category: "fixed", text: "Duplicate notification bug" },
    ],
  },
  {
    id: "1-0-0", version: "1.0.0", date: "August 2025", title: "Initial Launch",
    description: "Content Rewards platform launch with campaigns, creators, and payouts.",
    changes: [
      { category: "new", text: "Campaign creation and management" },
      { category: "new", text: "Creator discovery and applications" },
      { category: "new", text: "Payout processing with multiple methods" },
    ],
  },
];

const BADGE_STYLE: Record<ChangeCategory, { label: string; color: string; bg: string }> = {
  new:      { label: "New",      color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  fixed:    { label: "Fixed",    color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  improved: { label: "Improved", color: "#ff6207", bg: "rgba(255,98,7,0.12)" },
};

/* ── Single entry section (full viewport height) ── */

function EntrySection({ entry, index, total }: { entry: Entry; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Title transforms: scale and opacity based on scroll position
  // 0 = entering from bottom, 0.5 = centered, 1 = exiting top
  const titleY = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [60, 10, 0, -10, -60]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 1, 1, 1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [0.85, 0.98, 1, 0.98, 0.85]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [0, 1, 1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [40, 8, 0, -8, -40]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100vh] items-center justify-center px-6"
      id={`v${entry.version}`}
    >
      <div className="w-full max-w-[640px]">
        {/* Version + date */}
        <motion.div
          className="mb-4 flex items-center gap-3"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <span className="rounded-md bg-[rgba(255,98,7,0.1)] px-2.5 py-1 font-inter text-[12px] font-semibold tracking-[-0.02em] text-[#ff6207] dark:bg-[rgba(255,98,7,0.15)]">
            v{entry.version}
          </span>
          <span className="font-inter text-[13px] tracking-[-0.02em] text-page-text-muted">
            {entry.date}
          </span>
        </motion.div>

        {/* Large title */}
        <motion.h2
          className="mb-4 font-inter text-[40px] font-bold leading-[1.1] tracking-[-0.04em] text-page-text sm:text-[52px]"
          style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
        >
          {entry.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="mb-8 max-w-[500px] font-inter text-[16px] leading-[1.6] tracking-[-0.02em] text-page-text-muted"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {entry.description}
        </motion.p>

        {/* Changes */}
        <motion.div
          className="space-y-2.5"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {entry.changes.map((change, i) => {
            const badge = BADGE_STYLE[change.category];
            return (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-inter text-[10px] font-semibold uppercase leading-[14px] tracking-[0.4px]"
                  style={{ backgroundColor: badge.bg, color: badge.color }}
                >
                  {badge.label}
                </span>
                <span className="font-inter text-[14px] leading-[22px] tracking-[-0.02em] text-page-text-subtle">
                  {change.text}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── TOC sidebar ── */

function TOCSidebar({ entries, activeId }: { entries: Entry[]; activeId: string }) {
  return (
    <div className="fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 xl:flex xl:flex-col xl:gap-1">
      {entries.map((entry) => {
        const isActive = activeId === entry.id;
        return (
          <a
            key={entry.id}
            href={`#v${entry.version}`}
            className="group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-foreground/[0.04]"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(`v${entry.version}`)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div
              className="h-1.5 w-1.5 shrink-0 rounded-full transition-all"
              style={{
                backgroundColor: isActive ? "#ff6207" : "var(--color-page-text-muted)",
                transform: isActive ? "scale(1.5)" : "scale(1)",
                boxShadow: isActive ? "0 0 0 3px rgba(255,98,7,0.2)" : "none",
              }}
            />
            <span
              className="font-inter text-[11px] font-medium tracking-[-0.02em] transition-colors"
              style={{ color: isActive ? "var(--color-page-text)" : "var(--color-page-text-muted)" }}
            >
              {entry.version}
            </span>
          </a>
        );
      })}
    </div>
  );
}

/* ── Scroll progress line ── */

function ScrollLine() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-[2px] origin-left bg-[#ff6207]"
      style={{ scaleX: scrollYProgress, width: "100%" }}
    />
  );
}

/* ── Main ── */

export default function ChangelogPageClient() {
  const [activeId, setActiveId] = useState(ENTRIES[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track which section is in the center of the viewport
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let closest = ENTRIES[0].id;
      let closestDist = Infinity;

      for (const entry of ENTRIES) {
        const el = document.getElementById(`v${entry.version}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const entryMid = rect.top + rect.height / 2;
        const dist = Math.abs(entryMid - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = entry.id;
        }
      }
      setActiveId(closest);
    };

    // Find the scrollable parent
    let scrollTarget: HTMLElement | Window = window;
    let el: HTMLElement | null = containerRef.current;
    while (el) {
      const style = getComputedStyle(el);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        scrollTarget = el;
        break;
      }
      el = el.parentElement;
    }

    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scrollTarget.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative bg-page-bg">
      <ScrollLine />

      {/* Header */}
      <div className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-page-bg/80 px-5 backdrop-blur-md">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Changelog
        </span>
      </div>

      {/* TOC */}
      <TOCSidebar entries={ENTRIES} activeId={activeId} />

      {/* Hero section */}
      <section className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <motion.h1
            className="font-inter text-[48px] font-bold tracking-[-0.05em] text-page-text sm:text-[64px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            What's new
          </motion.h1>
          <motion.p
            className="mt-3 font-inter text-[16px] tracking-[-0.02em] text-page-text-muted"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Scroll to explore updates
          </motion.p>
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="h-8 w-[1px] bg-page-text-muted"
              animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Entries */}
      {ENTRIES.map((entry, i) => (
        <EntrySection key={entry.id} entry={entry} index={i} total={ENTRIES.length} />
      ))}

      {/* Bottom spacer */}
      <div className="h-[30vh]" />
    </div>
  );
}
