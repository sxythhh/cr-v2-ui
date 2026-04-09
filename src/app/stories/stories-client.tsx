"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

function PlayIcon({ className, color }: { className?: string; color?: string }) {
  return (
    <svg width="14" height="16" viewBox="-1 0 16 18" fill={color || "currentColor"} className={className}>
      <path d="M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z" />
    </svg>
  );
}

function FramerIcon() {
  return (
    <svg width="10" height="15" viewBox="0 0 10 15" fill="none">
      <path d="M0 10H5L10 15H0V10Z" fill="white" />
      <path d="M0 5H10L5 10H0V5Z" fill="white" />
      <path d="M0 0H10V5H5L0 0Z" fill="white" />
    </svg>
  );
}

const STORIES = [
  {
    id: 1,
    title: "Summer Campaign Launch",
    thumbnail: null,
    color: "#FF6207",
    status: "published" as const,
    views: "12.4k",
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Creator Spotlight: March",
    thumbnail: null,
    color: "#2060DF",
    status: "draft" as const,
    views: null,
    date: "5 hours ago",
  },
  {
    id: 3,
    title: "Product Update v2.4",
    thumbnail: null,
    color: "#00994D",
    status: "published" as const,
    views: "8.1k",
    date: "1 week ago",
  },
  {
    id: 4,
    title: "Behind the Scenes",
    thumbnail: null,
    color: "#8B5CF6",
    status: "draft" as const,
    views: null,
    date: "3 days ago",
  },
  {
    id: 5,
    title: "Year in Review 2025",
    thumbnail: null,
    color: "#E57100",
    status: "published" as const,
    views: "24.7k",
    date: "2 weeks ago",
  },
  {
    id: 6,
    title: "New Feature Announcement",
    thumbnail: null,
    color: "#FF3355",
    status: "draft" as const,
    views: null,
    date: "1 hour ago",
  },
];

export function StoriesPageClient() {
  const router = useRouter();
  const [editing, setEditing] = useState<number | null>(null);

  if (editing !== null) {
    const story = STORIES.find((s) => s.id === editing);
    return <StoryEditor story={story!} onExit={() => setEditing(null)} />;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-page-bg px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
          Stories
        </span>
        <button
          type="button"
          onClick={() => setEditing(STORIES[1].id)}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 pl-3 font-inter text-[14px] font-medium tracking-[-0.02em] text-background transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" />
          </svg>
          New story
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none" }}>
        <div className="mx-auto max-w-[1000px]">
          {/* Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STORIES.map((story) => (
              <motion.button
                key={story.id}
                type="button"
                onClick={() => setEditing(story.id)}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-foreground/[0.06] bg-card-bg text-left transition-all hover:border-foreground/[0.12]"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                {/* Preview area */}
                <div
                  className="relative flex h-[180px] items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${story.color}15 0%, ${story.color}05 100%)`,
                  }}
                >
                  <div
                    className="flex size-12 items-center justify-center rounded-2xl opacity-60 transition-opacity group-hover:opacity-80"
                    style={{ backgroundColor: `${story.color}20` }}
                  >
                    <PlayIcon className="ml-0.5" color={story.color} />
                  </div>

                  {/* Status badge */}
                  <div className="absolute right-3 top-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 font-inter text-[11px] font-medium ${
                        story.status === "published"
                          ? "bg-[rgba(0,153,77,0.1)] text-[#00994D] dark:text-[#34D399]"
                          : "bg-foreground/[0.06] text-page-text-muted"
                      }`}
                    >
                      {story.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1.5 p-4">
                  <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">
                    {story.title}
                  </span>
                  <div className="flex items-center gap-2 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">
                    <span>{story.date}</span>
                    {story.views && (
                      <>
                        <span className="text-foreground/20">·</span>
                        <span>{story.views} views</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Story Editor ── */

function StoryEditor({
  story,
  onExit,
}: {
  story: (typeof STORIES)[number];
  onExit: () => void;
}) {
  return (
    <div className="relative flex h-full flex-col bg-[#0A0A0A]">
      {/* Top header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
        <button
          type="button"
          onClick={onExit}
          className="flex cursor-pointer items-center gap-1.5 font-inter text-[13px] font-medium tracking-[-0.02em] text-white/60 transition-colors hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M5 12l6 6"/><path d="M5 12l6-6"/></svg>
          Back
        </button>
        <span className="font-inter text-[13px] font-medium tracking-[-0.02em] text-white">
          {story.title}
        </span>
        <div className="w-[60px]" />
      </div>

      {/* Canvas area */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* Canvas placeholder */}
        <div
          className="flex h-[80%] w-[45%] max-w-[500px] flex-col items-center justify-center rounded-2xl border border-white/[0.06]"
          style={{
            background: `linear-gradient(180deg, ${story.color}12 0%, transparent 60%)`,
          }}
        >
          <div
            className="flex size-16 items-center justify-center rounded-3xl"
            style={{ backgroundColor: `${story.color}20` }}
          >
            <PlayIcon className="ml-0.5 text-white/60" />
          </div>
          <p className="mt-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-white/30">
            Click to add content
          </p>
        </div>
      </div>

      {/* Bottom floating toolbar */}
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
        <div
          className="flex h-[50px] items-center gap-3 px-3"
          style={{
            background: "rgba(34, 34, 34, 0.8)",
            backdropFilter: "blur(5px)",
            borderRadius: 18,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1), 0px 1px 0px rgba(0,0,0,0.05), 0px 0px 0px 1px rgba(255,255,255,0.15)",
          }}
        >
          {/* Open in Framer */}
          <button
            type="button"
            className="flex h-[30px] cursor-pointer items-center gap-2 rounded-lg bg-white/25 px-2 font-inter text-[13px] font-medium text-white transition-colors hover:bg-white/35"
          >
            <FramerIcon />
            Open in Framer
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-white/10" />

          {/* Status text */}
          <div className="flex items-center gap-1.5">
            <span className="font-inter text-[13px] font-medium text-white">Click to edit</span>
            <span className="font-inter text-[13px] font-medium text-white/40">·</span>
            <span className="font-inter text-[13px] font-medium text-white/40">Changes are auto-saved</span>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-white/10" />

          {/* Finish Editing */}
          <button
            type="button"
            onClick={onExit}
            className="flex h-[30px] cursor-pointer items-center gap-2 rounded-lg bg-white px-2 font-inter text-[13px] font-semibold text-[#222] transition-colors hover:bg-white/90 active:scale-[0.98]"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10-10"/></svg>
            Finish Editing
          </button>
        </div>
      </div>
    </div>
  );
}
