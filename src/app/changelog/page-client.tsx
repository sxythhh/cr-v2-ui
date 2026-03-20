"use client";

import { cn } from "@/lib/utils";

// ── Data ────────────────────────────────────────────────────────────

interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  isNew?: boolean;
}

const ENTRIES: ChangelogEntry[] = [
  {
    date: "Mar 15, 2026",
    title: "Dark mode support",
    description:
      "Toggle between light, dark, and system themes across all pages.",
    isNew: true,
  },
  {
    date: "Mar 12, 2026",
    title: "Academy launched",
    description:
      "Step-by-step video courses for every feature.",
    isNew: true,
  },
  {
    date: "Mar 10, 2026",
    title: "Help center redesign",
    description:
      "New category-based layout with search.",
  },
  {
    date: "Mar 7, 2026",
    title: "Case studies page",
    description:
      "Testimonials, workflows section, and Attio-style grid.",
  },
  {
    date: "Mar 3, 2026",
    title: "Affiliate landing page",
    description:
      "3D globe, carousel, and how-it-works section.",
  },
  {
    date: "Feb 28, 2026",
    title: "Notification center",
    description:
      "Category filtering with real-time badge counts.",
  },
];

// ── Page ────────────────────────────────────────────────────────────

export default function ChangelogPageClient() {
  return (
    <div className="min-h-full bg-page-bg">
      {/* Header bar */}
      <div className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-page-bg px-4 sm:px-5 dark:border-white/[0.06]">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Changelog
        </span>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-12 sm:px-8">
        {/* Page title */}
        <h1 className="font-inter text-2xl font-semibold tracking-tight text-page-text">
          Changelog
        </h1>
        <p className="mt-1.5 font-inter text-sm tracking-[-0.02em] text-page-text-muted">
          Latest updates and improvements
        </p>

        {/* Timeline */}
        <div className="mt-10 flex flex-col">
          {ENTRIES.map((entry, i) => (
            <div
              key={i}
              className="relative flex gap-4 pb-8 sm:gap-6"
            >
              {/* Timeline line */}
              {i < ENTRIES.length - 1 && (
                <div className="absolute left-[52px] top-8 bottom-0 w-px bg-border sm:left-[64px] dark:bg-white/[0.06]" />
              )}

              {/* Date badge */}
              <div className="flex w-[72px] shrink-0 pt-0.5 sm:w-[84px]">
                <span className="inline-flex rounded-full bg-foreground/[0.06] px-2.5 py-1 font-inter text-[11px] font-medium tracking-[-0.02em] text-page-text-muted dark:bg-white/[0.06]">
                  {entry.date.replace(", 2026", "")}
                </span>
              </div>

              {/* Content */}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-inter text-base font-semibold tracking-[-0.02em] text-page-text">
                    {entry.title}
                  </h3>
                  {entry.isNew && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                      New
                    </span>
                  )}
                </div>
                <p className="font-inter text-sm tracking-[-0.02em] text-page-text-muted">
                  {entry.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
