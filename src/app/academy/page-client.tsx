"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { DubNav } from "@/components/lander/dub-nav";
import { useTheme } from "@/components/theme-provider";

// ─── Data ──────────────────────────────────────────────────────────────────────

const SIDEBAR_DATA = [
  {
    section: "Academy",
    groups: [
      {
        title: "Introductions",
        items: [
          "Platform demo",
          "Email sync, People and Company records",
          "Standard Objects",
          "Custom Objects and relationships",
          "Lists",
          "Record pages",
          "Views",
          "AI attributes",
          "Importing into Objects",
          "Importing into Lists",
          "Notes, tasks, and email sending",
          "Call Intelligence",
          "Workflows",
          "Reports",
          "Ask Attio",
          "Apps",
          "Privacy and permissions",
        ],
      },
      { title: "Workflows", items: [] },
      { title: "Sequences", items: [] },
      { title: "Reports", items: [] },
      { title: "Attio for product-led growth", items: [] },
    ],
  },
  {
    section: "Reference",
    groups: [
      {
        title: "Attio 101",
        items: [
          "Getting started",
          "Navigation overview",
          "Quick start guide",
          "Keyboard shortcuts",
        ],
      },
      { title: "Attio AI", items: [] },
      { title: "Managing your data", items: [] },
      { title: "Email & calendar", items: [] },
      { title: "Imports & exports", items: [] },
      { title: "Productivity & collaborating", items: [] },
      { title: "Automations", items: [] },
      { title: "Tools and extensions", items: [] },
      { title: "Account settings", items: [] },
      { title: "Workspace settings & billing", items: [] },
      { title: "Industry guides", items: [] },
      { title: "Support", items: [] },
    ],
  },
  {
    section: "Apps",
    groups: [
      { title: "Automations apps", items: [] },
      { title: "Zapier app", items: [] },
      { title: "Other apps", items: [] },
    ],
  },
];

const LESSONS = [
  { name: "Platform demo", duration: "9:18" },
  { name: "Email sync, People and Company records", duration: "3:56" },
  { name: "Standard Objects", duration: "3:51" },
  { name: "Custom Objects and relationships", duration: "4:06" },
  { name: "Lists", duration: "03:04" },
  { name: "Record pages", duration: "2:04" },
  { name: "Views", duration: "3:23" },
  { name: "AI attributes", duration: "4:55" },
  { name: "Importing into Objects", duration: "7:25" },
  { name: "Importing into Lists", duration: "4:15" },
  { name: "Notes, tasks, and email sending", duration: "3:51" },
  { name: "Call Intelligence", duration: "4:16" },
  { name: "Workflows", duration: "8:59" },
  { name: "Reports", duration: "3:23" },
  { name: "Ask Attio", duration: "4:57" },
  { name: "Apps", duration: "2:10" },
  { name: "Privacy and permissions", duration: "5:40" },
];

const LEARN_ITEMS = [
  {
    bold: "Objects and records",
    text: "Understand what objects and records are in Attio and how they organize your data.",
  },
  {
    bold: "Learn the standard objects",
    text: "Identify the five standard objects — People, Companies, Deals, Workspaces, and Users — and their uses.",
  },
  {
    bold: "Customize objects",
    text: "Learn how to customize objects with attributes and relationships to fit your workflows.",
  },
  {
    bold: "Automate and sync data",
    text: "Explore ways to automate and sync data for a complete, up-to-date customer view.",
  },
];

const RELATED_ARTICLES = [
  {
    title: "Understanding objects",
    description:
      "Learn what objects are and how they form the backbone of your data structure.",
  },
  {
    title: "Define your data model: objects, lists, and views",
    description:
      "An end-to-end guide to designing your workspace's data architecture.",
  },
  {
    title: "Understanding attributes",
    description:
      "Explore the different attribute types available and when to use each one.",
  },
  {
    title: "Create and manage attributes",
    description:
      "Step-by-step instructions for adding, editing, and organizing attributes.",
  },
  {
    title: "Relationship attributes",
    description:
      "Connect records across objects using relationship attributes.",
  },
];

// ─── Icons ─────────────────────────────────────────────────────────────────────

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({
  className,
  expanded,
}: {
  className?: string;
  expanded?: boolean;
}) {
  return (
    <svg
      className={cn(
        "shrink-0 transition-transform duration-200",
        expanded && "rotate-90",
        className,
      )}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M5.25 3.5L8.75 7L5.25 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      {filled ? (
        <path
          d="M4.667 2.333l7 4.667-7 4.667V2.333z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M4.667 2.333l7 4.667-7 4.667V2.333z"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function PlayButtonLarge() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
      <circle cx="34" cy="34" r="34" fill="rgba(255,255,255,0.95)" />
      <path d="M28 22l18 12-18 12V22z" fill="#1C1D1F" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M2.333 10.5V3.5a1.167 1.167 0 0 1 1.167-1.167h7a1.167 1.167 0 0 1 1.167 1.167v7a1.167 1.167 0 0 1-1.167 1.167h-7A1.167 1.167 0 0 1 2.333 10.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5.25 4.667h3.5M5.25 7h2.333"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <circle
        cx="7"
        cy="7"
        r="5.25"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M7 4.083V7l2.333 1.167"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3.333 8.667L6 11.333l6.667-6.666"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M2.917 7h8.166M7.583 3.5L11.083 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M11.083 7H2.917M6.417 3.5L2.917 7l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionIcon() {
  return (
    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06]">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="3" width="10" height="10" rx="2" className="fill-page-text-muted" />
      </svg>
    </div>
  );
}

function ArticleIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded bg-foreground/[0.06]">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="1" width="10" height="10" rx="2" className="fill-page-text-muted" />
      </svg>
    </div>
  );
}

// ─── Sidebar Nav Item with Proximity Hover ─────────────────────────────────────

function SidebarNavItems({
  items,
  activeItem,
  onItemClick,
}: {
  items: string[];
  activeItem: string;
  onItemClick: (item: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, handlers, registerItem, sessionRef } =
    useProximityHover(containerRef);

  return (
    <div ref={containerRef} className="relative py-1" {...handlers}>
      <AnimatePresence>
        {activeIndex !== null && itemRects[activeIndex] && (
          <motion.div
            key="hover-bg"
            layoutId={`help-sidebar-hover-${sessionRef.current}`}
            className="pointer-events-none absolute rounded-[10px] bg-foreground/[0.06]"
            style={{
              top: itemRects[activeIndex].top,
              left: 0,
              width: "100%",
              height: itemRects[activeIndex].height,
            }}
            transition={springs.fast}
          />
        )}
      </AnimatePresence>
      {items.map((item, i) => {
        const isActive = item === activeItem;
        return (
          <div
            key={item}
            ref={(el) => registerItem(i, el)}
            className={cn(
              "relative cursor-pointer rounded-[10px] py-1.5 pl-[11px] pr-2 text-sm font-medium",
              isActive ? "text-page-text" : "text-page-text-muted",
            )}
            onClick={() => onItemClick(item)}
          >
            {isActive && (
              <div className="absolute -left-[23px] top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-foreground" />
            )}
            <span className="relative z-10">{item}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Left Sidebar ──────────────────────────────────────────────────────────────

function LeftSidebar({
  activeItem,
  expandedGroups,
  onItemClick,
  onToggleGroup,
}: {
  activeItem: string;
  expandedGroups: Set<string>;
  onItemClick: (item: string) => void;
  onToggleGroup: (group: string) => void;
}) {
  return (
    <aside className="hidden w-[290px] shrink-0 md:block">
      <div className="sticky top-[68px]">
        {/* Search */}
        <div className="flex h-9 items-center gap-2 rounded-[10px] border border-border bg-card-bg px-2">
          <SearchIcon className="shrink-0 text-page-text-muted" />
          <span className="flex-1 text-sm font-medium text-page-text-muted">
            Search help
          </span>
          <div className="flex items-center gap-1">
            <kbd className="flex h-[22px] min-w-[22px] items-center justify-center rounded-md border border-border bg-card-bg px-1 text-xs font-semibold text-page-text-muted shadow-[0_1px_0_1px] shadow-border" style={{ borderWidth: "1px 1px 2px 1px", borderStyle: "solid", borderColor: undefined }} >
              ⌘
            </kbd>
            <kbd className="flex h-[22px] min-w-[22px] items-center justify-center rounded-md border border-border bg-card-bg px-1 text-xs font-medium text-page-text-muted shadow-[0_1px_0_1px] shadow-border" style={{ borderWidth: "1px 1px 2px 1px", borderStyle: "solid", borderColor: undefined }}>
              K
            </kbd>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 max-h-[calc(100vh-160px)] space-y-6 overflow-y-auto pb-8">
          {SIDEBAR_DATA.map((section) => (
            <div key={section.section}>
              {/* Section header */}
              <div className="flex items-center gap-2.5 px-1">
                <SectionIcon />
                <span className="text-xs font-semibold uppercase tracking-wider text-page-text">
                  {section.section}
                </span>
              </div>

              {/* Groups */}
              <div className="mt-2 space-y-0.5">
                {section.groups.map((group) => {
                  const isExpanded = expandedGroups.has(group.title);
                  const hasItems = group.items.length > 0;

                  return (
                    <div key={group.title}>
                      {/* Group heading */}
                      <button
                        onClick={() => hasItems && onToggleGroup(group.title)}
                        className={cn(
                          "relative flex w-full items-center rounded-[10px] py-1.5 pl-[38px] pr-2 text-sm font-medium transition-colors",
                          isExpanded ? "text-page-text" : "text-page-text-muted",
                          hasItems
                            ? "cursor-pointer hover:text-page-text-subtle"
                            : "cursor-default",
                        )}
                      >
                        {hasItems && (
                          <ChevronIcon
                            expanded={isExpanded}
                            className="absolute left-[10px] top-1/2 -translate-y-1/2 text-page-text-muted"
                          />
                        )}
                        <span>{group.title}</span>
                      </button>

                      {/* Expanded children */}
                      <AnimatePresence initial={false}>
                        {isExpanded && hasItems && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="relative ml-[15.5px] border-l border-border pl-[22.5px]">
                              <SidebarNavItems
                                items={group.items}
                                activeItem={activeItem}
                                onItemClick={onItemClick}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

// ─── Right Sidebar (Lesson List) ───────────────────────────────────────────────

function RightSidebar({ activeLesson, completedLessons, onToggleComplete, onNavigate }: {
  activeLesson: string;
  completedLessons: Set<string>;
  onToggleComplete: (lesson: string) => void;
  onNavigate: (direction: "prev" | "next") => void;
}) {
  const progress = Math.round((completedLessons.size / LESSONS.length) * 100);
  const isCurrentCompleted = completedLessons.has(activeLesson);

  return (
    <div className="hidden w-[348px] shrink-0 lg:block">
      <div className="sticky top-[68px] rounded-xl border border-border">
        {/* Header */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-page-text">
            Introductions
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 text-xs font-medium text-page-text-muted">
              <BookIcon className="text-page-text-muted" />
              17 lessons
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 text-xs font-medium text-page-text-muted">
              <ClockIcon className="text-page-text-muted" />
              Approx. 79 min
            </span>
          </div>
        </div>

        {/* Dashed separator */}
        <div className="border-t border-dashed border-border" />

        {/* Progress */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-page-text">
              Your progress
            </span>
            <span className="text-xs font-medium text-page-text-muted">
              {progress}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-foreground/[0.06]">
            <div
              className="h-1 rounded-full bg-foreground transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Solid separator */}
        <div className="border-t border-border" />

        {/* Lesson list */}
        <div className="max-h-[calc(100vh-380px)] overflow-y-auto scrollbar-hide">
          {LESSONS.map((lesson) => {
            const isActive = lesson.name === activeLesson;
            const isCompleted = completedLessons.has(lesson.name);
            return (
              <div
                key={lesson.name}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 border-t border-border px-4 py-[11px] text-xs font-medium transition-colors first:border-t-0",
                  isActive
                    ? "bg-foreground/[0.03] font-semibold text-page-text"
                    : "text-page-text-muted hover:bg-foreground/[0.03]",
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="shrink-0 text-foreground" />
                ) : (
                  <PlayIcon
                    className={cn(
                      "shrink-0",
                      isActive ? "text-foreground" : "text-page-text-muted",
                    )}
                    filled={isActive}
                  />
                )}
                <span className="min-w-0 flex-1 truncate">{lesson.name}</span>
                <span className="shrink-0 text-page-text-muted">
                  {lesson.duration}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate("prev")} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-page-text-muted transition-colors hover:bg-foreground/[0.06]">
              <ArrowLeftIcon />
            </button>
            <button onClick={() => onNavigate("next")} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-page-text-muted transition-colors hover:bg-foreground/[0.06]">
              <ArrowRightIcon />
            </button>
          </div>
          <button
            onClick={() => onToggleComplete(activeLesson)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              isCurrentCompleted
                ? "border-foreground bg-foreground text-background"
                : "border-border text-foreground hover:bg-foreground/[0.06]",
            )}
          >
            <CheckIcon className={isCurrentCompleted ? "text-background" : "text-foreground"} />
            {isCurrentCompleted ? "Completed" : "Mark complete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function HelpCenterClient() {
  const [activeItem, setActiveItem] = useState("Standard Objects");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(["Introductions", "Attio 101"]),
  );

  const handleNavigate = useCallback((direction: "prev" | "next") => {
    const idx = LESSONS.findIndex((l) => l.name === activeItem);
    const nextIdx = direction === "next"
      ? (idx + 1) % LESSONS.length
      : (idx - 1 + LESSONS.length) % LESSONS.length;
    setActiveItem(LESSONS[nextIdx].name);
  }, [activeItem]);

  const handleToggleComplete = useCallback((lesson: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lesson)) {
        next.delete(lesson);
      } else {
        next.add(lesson);
      }
      return next;
    });
  }, []);

  const handleToggleGroup = useCallback((group: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }, []);

  const { darkMode } = useTheme();

  const handleItemClick = useCallback((item: string) => {
    setActiveItem(item);
  }, []);

  return (
    <div className="help-root min-h-screen bg-page-bg text-page-text">
      <style>{`
        html:has(.help-root), html:has(.help-root) body, .help-root, .help-root * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        html:has(.help-root)::-webkit-scrollbar,
        html:has(.help-root) body::-webkit-scrollbar,
        .help-root::-webkit-scrollbar,
        .help-root *::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
      <DubNav theme={darkMode ? "dark" : "light"} />
      <div className="mx-auto flex max-w-[1440px] gap-[58px] px-4 pb-20 pt-10 sm:px-5">
        {/* Left sidebar */}
        <LeftSidebar
          activeItem={activeItem}
          expandedGroups={expandedGroups}
          onItemClick={handleItemClick}
          onToggleGroup={handleToggleGroup}
        />

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex gap-8">
            {/* Article content */}
            <div className="min-w-0 max-w-[1044px] flex-1">
              {/* Breadcrumb */}
              <nav className="flex items-center text-[14px] font-medium leading-[20px] tracking-[-0.07px]">
                <a href="#" className="rounded px-1.5 text-page-text-muted transition-colors hover:text-page-text-subtle">Help</a>
                <span className="px-0.5 text-[11px] text-border">/</span>
                <a href="#" className="rounded px-1.5 text-page-text-muted transition-colors hover:text-page-text-subtle">Academy</a>
                <span className="px-0.5 text-[11px] text-border">/</span>
                <span className="px-1.5 text-page-text">Introductions</span>
              </nav>

              {/* Video embed area */}
              <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-black">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/HhWUjp5pD0g"
                  title="Standard Objects"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0px_0px_0px_1px_rgba(16,17,19,0.1)]" />
              </div>

              {/* Article header */}
              <div className="mt-12">
                <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.84px] text-page-text sm:text-[52.5px] sm:leading-[60px]">
                  Standard Objects
                </h1>
                <p className="mt-6 max-w-[648px] text-[18px] font-medium leading-[24px] tracking-[-0.18px] text-page-text">
                  In this video, we&apos;ll explore standard objects — what they are, how they work, and how you can tailor them to fit your business.
                </p>
              </div>

              {/* What you will learn */}
              <div className="mt-10 rounded-xl border border-border bg-card-bg p-6">
                <h2 className="text-[20px] font-semibold leading-[26px] tracking-[-0.2px] text-page-text">
                  What you will learn
                </h2>
                <div className="mt-4 space-y-2.5">
                  {LEARN_ITEMS.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                        {i + 1}
                      </span>
                      <p className="text-[16px] font-semibold leading-[26px] tracking-[-0.16px] text-page-text">
                        {item.bold}{" "}
                        <span className="font-normal text-page-text-muted">{item.text}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related articles */}
              <div className="mt-16 border-t border-dashed border-border pt-10">
                <h2 className="text-[28px] font-semibold leading-[38px] tracking-[-0.32px] text-page-text">
                  Related articles
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {RELATED_ARTICLES.map((article) => (
                    <a
                      key={article.title}
                      href="#"
                      className="group flex flex-col rounded-2xl border border-border bg-card-bg p-[22px] transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                    >
                      <div className="flex items-center justify-between">
                        <ArticleIcon />
                        <ArrowRightIcon className="-translate-x-1 text-page-text opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                      </div>
                      <h3 className="mt-3 text-[16px] font-semibold leading-[22px] tracking-[-0.16px] text-page-text">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-[14px] font-medium leading-[20px] tracking-[-0.07px] text-page-text-muted">
                        {article.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <RightSidebar activeLesson={activeItem} completedLessons={completedLessons} onToggleComplete={handleToggleComplete} onNavigate={handleNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
}
