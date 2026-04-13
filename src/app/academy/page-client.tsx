"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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
  onSearchOpen,
}: {
  activeItem: string;
  expandedGroups: Set<string>;
  onItemClick: (item: string) => void;
  onToggleGroup: (group: string) => void;
  onSearchOpen?: () => void;
}) {
  return (
    <aside className="hidden w-[290px] shrink-0 md:block">
      <div className="sticky top-[68px]">
        {/* Search — opens command palette */}
        <button onClick={() => onSearchOpen?.()} className="flex h-9 w-full items-center gap-2 rounded-[10px] border border-border bg-card-bg px-2 transition-colors hover:border-foreground/20">
          <SearchIcon className="shrink-0 text-page-text-muted" />
          <span className="flex-1 text-left text-sm font-medium text-page-text-muted">
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
        </button>

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
          <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full border border-border bg-foreground/[0.05]">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                minWidth: progress > 0 ? 8 : 0,
                background: "linear-gradient(180deg, #FFBB00 0%, #FF5300 100%)",
                boxShadow: "inset 0px 1px 0px rgba(255,255,255,0.35), inset 0px -1px 0px rgba(255,255,255,0.15)",
              }}
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

// ─── Search Command Palette Data ──────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "🔌", label: "Integrations" },
  { icon: "📄", label: "Policies" },
  { icon: "🔧", label: "Tests" },
  { icon: "🔍", label: "Access Reviews" },
  { icon: "✅", label: "Trust Report" },
  { icon: "📊", label: "Reports" },
  { icon: "⚙️", label: "Settings" },
  { icon: "👥", label: "People" },
  { icon: "🏢", label: "Companies" },
  { icon: "💼", label: "Deals" },
  { icon: "📋", label: "Lists" },
  { icon: "🔄", label: "Workflows" },
  { icon: "📧", label: "Email & Calendar" },
  { icon: "📱", label: "Apps" },
  { icon: "🎓", label: "Academy" },
  { icon: "📖", label: "Documentation" },
  { icon: "🔑", label: "API Reference" },
  { icon: "💬", label: "Community" },
  { icon: "🎧", label: "Support" },
  { icon: "📝", label: "Changelog" },
  { icon: "🏠", label: "Home" },
  { icon: "🔔", label: "Notifications" },
  { icon: "👤", label: "Profile" },
  { icon: "🔒", label: "Security" },
  { icon: "💳", label: "Billing" },
  { icon: "🌐", label: "Domains" },
  { icon: "📤", label: "Imports & Exports" },
  { icon: "🏷️", label: "Tags" },
  { icon: "📂", label: "Templates" },
];

const HELP_ARTICLES = [
  { title: "Getting started with Content Rewards", desc: "A step-by-step guide to setting up your workspace, inviting your team, and connecting your first data source." },
  { title: "Understanding objects and records", desc: "Learn what objects and records are and how they organize your data in the platform." },
  { title: "Creating and managing campaigns", desc: "How to create, configure, and manage campaigns from start to finish." },
  { title: "Setting up creator payouts", desc: "Configure payout methods, schedules, and automate creator payments with Stripe." },
  { title: "Workflow automations guide", desc: "Build powerful automations to streamline your team's processes and save time." },
  { title: "Email sync and calendar integration", desc: "Connect your email and calendar to automatically log communications." },
  { title: "Custom attributes and relationships", desc: "Define custom fields and connect records across different objects." },
  { title: "Building reports and dashboards", desc: "Create visual reports to track metrics and share insights with your team." },
  { title: "Using AI features", desc: "Leverage AI-powered attributes, enrichment, and smart suggestions." },
  { title: "Privacy, permissions, and roles", desc: "Manage access controls, user roles, and data visibility settings." },
  { title: "Importing data from CSV", desc: "Bulk import contacts, companies, and deals from spreadsheet files." },
  { title: "API authentication and setup", desc: "Get started with the REST API using OAuth2 or API key authentication." },
  { title: "Keyboard shortcuts reference", desc: "Speed up your workflow with the full list of available keyboard shortcuts." },
  { title: "Managing your subscription", desc: "Upgrade, downgrade, or cancel your plan. View invoices and billing history." },
];

// ─── Search Command Palette ──────────────────────────────────────────────────

function SearchCommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "navigation" | "help">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const q = query.toLowerCase().trim();

  const filteredNav = NAV_ITEMS.filter((n) => n.label.toLowerCase().includes(q));
  const filteredHelp = HELP_ARTICLES.filter(
    (a) => a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q),
  );

  const showNav = activeTab === "all" || activeTab === "navigation";
  const showHelp = activeTab === "all" || activeTab === "help";
  const navToShow = showNav ? (activeTab === "all" ? filteredNav.slice(0, 5) : filteredNav) : [];
  const helpToShow = showHelp ? (activeTab === "all" ? filteredHelp.slice(0, 4) : filteredHelp) : [];
  const totalItems = navToShow.length + helpToShow.length;

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveTab("all");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      // Also lock the sidebar scroll container
      const scrollEls = document.querySelectorAll<HTMLElement>('[class*="overflow-y-auto"], [class*="overflow-auto"]');
      scrollEls.forEach((el) => { el.dataset.prevOverflow = el.style.overflow; el.style.overflow = "hidden"; });
      return () => {
        document.body.style.overflow = "";
        scrollEls.forEach((el) => { el.style.overflow = el.dataset.prevOverflow || ""; delete el.dataset.prevOverflow; });
      };
    }
  }, [open]);

  useEffect(() => { setSelectedIndex(0); }, [query, activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIndex}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  let idx = 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9999] bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-[15%] z-[10000] w-[calc(100%-32px)] max-w-[640px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card-bg shadow-[0_16px_70px_rgba(0,0,0,0.15)]">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <SearchIcon className="shrink-0 text-page-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Try searching for a topic to find help articles"
            className="flex-1 bg-transparent text-[15px] font-medium tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
          />
          {query && (
            <button onClick={() => setQuery("")} className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-foreground/[0.08] text-page-text-muted hover:bg-foreground/[0.12]">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border px-4 py-2">
          {(["all", "navigation", "help"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full px-3 py-1 text-[13px] font-medium tracking-[-0.02em] transition-colors",
                activeTab === tab
                  ? "bg-foreground text-background"
                  : "text-page-text-muted hover:bg-foreground/[0.06] hover:text-page-text",
              )}
            >
              {tab === "all" ? "All" : tab === "navigation" ? "Navigation" : "Help Center"}
            </button>
          ))}
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {totalItems === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-page-text-muted">
              <SearchIcon className="h-6 w-6" />
              <span className="text-sm font-medium">No results found</span>
            </div>
          )}

          {/* Navigation section */}
          {navToShow.length > 0 && (
            <div className="px-2 pt-2">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-[12px] font-semibold tracking-[-0.02em] text-page-text-muted">Navigation</span>
                {activeTab === "all" && filteredNav.length > 5 && (
                  <button onClick={() => setActiveTab("navigation")} className="text-[12px] font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text">
                    See more ({filteredNav.length}) →
                  </button>
                )}
              </div>
              {navToShow.map((item) => {
                const thisIdx = idx++;
                return (
                  <div
                    key={item.label}
                    data-idx={thisIdx}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors",
                      selectedIndex === thisIdx ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.04]",
                    )}
                    onMouseEnter={() => setSelectedIndex(thisIdx)}
                    onClick={onClose}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-[13px]">
                      {item.icon}
                    </span>
                    <span className="text-[14px] font-medium tracking-[-0.02em] text-page-text">{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Help center section */}
          {helpToShow.length > 0 && (
            <div className="px-2 pb-2 pt-1">
              {navToShow.length > 0 && <div className="mx-2 my-1 border-t border-border" />}
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-[12px] font-semibold tracking-[-0.02em] text-page-text-muted">Browse help center</span>
                {activeTab === "all" && filteredHelp.length > 4 && (
                  <button onClick={() => setActiveTab("help")} className="text-[12px] font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text">
                    See more ({filteredHelp.length}) →
                  </button>
                )}
              </div>
              {helpToShow.map((article) => {
                const thisIdx = idx++;
                return (
                  <div
                    key={article.title}
                    data-idx={thisIdx}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                      selectedIndex === thisIdx ? "bg-foreground/[0.06]" : "hover:bg-foreground/[0.04]",
                    )}
                    onMouseEnter={() => setSelectedIndex(thisIdx)}
                    onClick={onClose}
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06]">
                      <BookIcon className="text-page-text-muted" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[14px] font-medium tracking-[-0.02em] text-page-text">{article.title}</span>
                      <p className="mt-0.5 truncate text-[12px] font-medium tracking-[-0.02em] text-page-text-muted">
                        {article.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-4 py-2">
          <span className="text-[11px] font-medium text-page-text-muted">↑↓ Navigate</span>
          <span className="text-[11px] font-medium text-page-text-muted">↵ Open</span>
          <span className="text-[11px] font-medium text-page-text-muted">esc Close</span>
          <div className="ml-1 flex items-center gap-1">
            <kbd className="flex h-[20px] min-w-[20px] items-center justify-center rounded-md border border-border bg-card-bg px-1 text-[10px] font-semibold text-page-text-muted" style={{ borderWidth: "1px 1px 2px 1px" }}>⌘</kbd>
            <kbd className="flex h-[20px] min-w-[20px] items-center justify-center rounded-md border border-border bg-card-bg px-1 text-[10px] font-medium text-page-text-muted" style={{ borderWidth: "1px 1px 2px 1px" }}>K</kbd>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function HelpCenterClient() {
  const [activeItem, setActiveItem] = useState("Standard Objects");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(["Introductions", "Attio 101"]),
  );
  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
      <SearchCommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
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
          onSearchOpen={() => setSearchOpen(true)}
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
