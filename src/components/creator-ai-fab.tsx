"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { useSideNav } from "@/components/sidebar/sidebar-context";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { GamepadIcon } from "@/components/sidebar/icons/gamepad";
import { AiPopupAnimated } from "@/components/ai-popup-animations";
import { useMentionPopover } from "@/hooks/use-mention-popover";
import { MentionPopover } from "@/components/mention-popover";
import { BorderBeam } from "@/components/ui/border-beam";


const SUGGESTIONS = [
  "Find campaigns that fit my style",
  "How can I earn more?",
  "Breakdown my content",
  "Write me a pitch for applications",
];

const THINKING_STEPS = [
  "Reviewing your content portfolio...",
  "Scanning available campaigns...",
  "Matching niche and audience fit...",
  "Preparing personalized insights...",
];

const AI_RESPONSE_TEXT =
  "Based on your portfolio and content style, here are the best campaigns for you right now. I found 3 campaigns with 87%+ match scores across Gaming and Tech niches. Your estimated combined earning potential is around $2,400/month.";

const AI_TASKS = [
  {
    title: "Analyzed content portfolio",
    items: [
      "Scanned 206 submissions across 4 campaigns",
      "Identified top-performing niches: Gaming, Tech",
      "Avg. engagement rate: 4.2% (above platform average)",
    ],
  },
  {
    title: "Matched campaign criteria",
    items: [
      "Filtered 47 active campaigns by niche fit",
      "Cross-referenced audience demographics",
      "Ranked by estimated CPM and approval rate",
    ],
  },
  {
    title: "Generated recommendations",
    items: [
      "Selected top 3 campaigns with 87%+ match score",
      "Estimated combined earning potential: $2,400/mo",
    ],
  },
];

const AI_CAMPAIGNS = [
  { title: "Call of Duty BO7 Official Clipping Campaign", brand: "Sound Network", avatar: "https://i.pravatar.cc/40?img=33", verified: true, ago: "5d", match: 92, platforms: ["tiktok", "instagram"] as const, category: "Gaming", creators: "121.4K", cpm: "$1.50/1k", cpmColor: "#1A67E5", spent: "$8,677", total: "$37,500", progress: 23, thumb: "/creator-home/campaign-thumb-1.png" },
  { title: "Call of Duty BO7 Official Clipping Campaign", brand: "Sound Network", avatar: "https://i.pravatar.cc/40?img=33", verified: true, ago: "5d", match: 92, platforms: ["tiktok", "instagram"] as const, category: "Gaming", creators: "121.4K", cpm: "$1.50/1k", cpmColor: "#1A67E5", spent: "$8,677", total: "$37,500", progress: 23, thumb: "/creator-home/campaign-thumb-2.png" },
  { title: "Fortnite OG Season Highlights", brand: "Verse Media", avatar: "https://i.pravatar.cc/40?img=5", verified: true, ago: "3d", match: 87, platforms: ["tiktok", "youtube"] as const, category: "Gaming", creators: "89", cpm: "$2.50/1k", cpmColor: "#1A67E5", spent: "$4,200", total: "$15,000", progress: 28, thumb: "/creator-home/campaign-thumb-3.png" },
];

/* ─── Icons ─── */

function SpinnerIcon({ className }: { className?: string }) {
  return <svg className={cn("animate-spin", className)} width="14" height="14" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 1.334a.667.667 0 0 1 .667.666v2a.667.667 0 1 1-1.334 0v-2A.667.667 0 0 1 8 1.334Zm4.714 1.952a.667.667 0 0 1 0 .943L11.3 5.643a.667.667 0 1 1-.943-.943l1.414-1.414a.667.667 0 0 1 .943 0ZM3.286 3.286a.667.667 0 0 1 .943 0L5.643 4.7a.667.667 0 1 1-.943.943L3.286 4.23a.667.667 0 0 1 0-.943ZM1.334 8a.667.667 0 0 1 .666-.667h2a.667.667 0 1 1 0 1.334h-2A.667.667 0 0 1 1.334 8Zm10 0a.667.667 0 0 1 .666-.667h2a.667.667 0 1 1 0 1.334h-2A.667.667 0 0 1 11.334 8ZM5.643 10.357a.667.667 0 0 1 0 .943l-1.414 1.414a.667.667 0 1 1-.943-.943L4.7 10.357a.667.667 0 0 1 .943 0Zm4.714 0a.667.667 0 0 1 .943 0l1.414 1.414a.667.667 0 1 1-.943.943L10.357 11.3a.667.667 0 0 1 0-.943ZM8 11.334a.667.667 0 0 1 .667.666v2a.667.667 0 1 1-1.334 0v-2A.667.667 0 0 1 8 11.334Z" fill="currentColor" fillOpacity="0.5"/></svg>;
}

function RobotIconSmall() {
  return (
    <span className="-ml-px inline-flex size-4 shrink-0 items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 1c.552 0 1 .448 1 1v1h4c1.657 0 3 1.343 3 3v5c0 .889-.386 1.687-1 2.236v1.35l1.707 1.707a1 1 0 0 1-1.414 1.414l-.319-.319C17.79 19.938 15.136 22 12 22s-5.791-2.062-6.974-4.612l-.319.319a1 1 0 0 1-1.414-1.414L5 14.586v-1.35A2.99 2.99 0 0 1 4 11V6c0-1.657 1.343-3 3-3h4V2c0-.552.448-1 1-1ZM7 5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm2 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z" fill="#E57100"/></svg>
    </span>
  );
}

/* ─── Streaming text hook ─── */
function useStreamingText(text: string, active: boolean, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(iv);
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, active, speed]);

  return { displayed, done };
}

/* ─── Collapsible reasoning block ─── */
function ReasoningBlock({
  isStreaming,
  thinkingStep,
  duration,
}: {
  isStreaming: boolean;
  thinkingStep: number;
  duration: number;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [hasAutoClosed, setHasAutoClosed] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      setIsOpen(true);
      setHasAutoClosed(false);
    }
  }, [isStreaming]);

  useEffect(() => {
    if (!isStreaming && isOpen && !hasAutoClosed) {
      const t = setTimeout(() => { setIsOpen(false); setHasAutoClosed(true); }, 1200);
      return () => clearTimeout(t);
    }
  }, [isStreaming, isOpen, hasAutoClosed]);

  const label = isStreaming
    ? "Thinking..."
    : duration > 0 ? `Thought for ${duration}s` : "Thought for a few seconds";

  return (
    <div className="rounded-xl border border-foreground/[0.06] bg-white/80 dark:bg-white/[0.03]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <RobotIconSmall />
        {isStreaming ? (
          <span
            className="flex-1 text-sm font-medium tracking-[-0.02em]"
            style={{
              background: "linear-gradient(90deg, #E57100 0%, #E57100 40%, #F59E0B 50%, #E57100 60%, #E57100 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer-text 1.5s ease-in-out infinite",
            }}
          >
            {label}
          </span>
        ) : (
          <span className="flex-1 text-sm font-medium tracking-[-0.02em] text-page-text-muted">
            {label}
          </span>
        )}
        <svg className={cn("size-3 shrink-0 text-foreground/30 transition-transform duration-200", isOpen && "rotate-180")} viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1.5 border-t border-foreground/[0.04] px-3 pb-3 pt-2 dark:border-white/[0.04]">
            {THINKING_STEPS.map((step, i) => {
              const done = i < thinkingStep;
              const active = i === thinkingStep && isStreaming;
              const visible = i <= thinkingStep;
              return (
                <div key={step} className={cn("flex items-center gap-2 transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}>
                  {done ? (
                    <svg className="size-4 shrink-0" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="#E57100" />
                      <path d="M4.5 7l2 2 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : active ? (
                    <SpinnerIcon className="size-4 shrink-0 text-[#E57100]" />
                  ) : (
                    <div className="size-4 shrink-0 rounded-full border border-foreground/[0.08] dark:border-white/[0.08]" />
                  )}
                  <span className={cn("text-sm tracking-[-0.02em]", done ? "text-page-text-muted" : active ? "text-page-text" : "text-foreground/20")}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Task block ─── */
function TaskBlock({ task, defaultOpen = false }: { task: typeof AI_TASKS[number]; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left">
        <svg className="size-4 shrink-0" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="7" fill="#E57100" />
          <path d="M4.5 7l2 2 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="flex-1 text-sm font-medium tracking-[-0.02em] text-page-text">{task.title}</span>
        <svg className={cn("size-3 shrink-0 text-foreground/30 transition-transform duration-200", isOpen && "rotate-180")} viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 border-t border-foreground/[0.04] px-3 pb-2.5 pt-2 dark:border-white/[0.04]">
            {task.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-[6px] size-1 shrink-0 rounded-full bg-foreground/20 dark:bg-white/20" />
                <span className="text-sm leading-[160%] tracking-[-0.02em] text-page-text-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
function SidebarSuggestionIcon({ type }: { type: number }) {
  const cls = "text-page-text-muted";
  if (type === 0) return <svg className={cls} width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6.75 8.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM11.25 8.25a2.25 2.25 0 1 0 0-4.5M2.25 14.25c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5M14.25 9.75a4.5 4.5 0 0 1 2.786 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
  if (type === 1) return <svg className={cls} width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2.25v13.5M2.25 9h13.5M5.25 5.25l7.5 7.5M12.75 5.25l-7.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
  if (type === 2) return <svg className={cls} width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.25 13.5V9h3v4.5M7.5 13.5V4.5h3v9M12.75 13.5V6.75h3v6.75M2.25 15.75h13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <svg className={cls} width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.75" stroke="currentColor" strokeWidth="1.3"/><path d="M9 5.25v3.75l2.625 1.312" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

/* ─── Sidebar header icon row with proximity hover + tooltips ─── */
function SidebarIconRow({ buttons }: { buttons: { onClick: () => void; label: string; icon: React.ReactNode }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, handlers, registerItem, sessionRef } = useProximityHover(containerRef, { axis: "x" });
  const id = useRef(`sir-${Math.random().toString(36).slice(2, 8)}`).current;

  return (
    <div ref={containerRef} className="relative flex items-center" {...handlers}>
      <AnimatePresence>
        {activeIndex !== null && itemRects[activeIndex] && (
          <motion.div
            key="hover"
            layoutId={`${id}-${sessionRef.current}`}
            className="pointer-events-none absolute rounded-lg bg-foreground/[0.06] dark:bg-white/[0.08]"
            style={{ top: itemRects[activeIndex].top, left: itemRects[activeIndex].left, width: itemRects[activeIndex].width, height: itemRects[activeIndex].height }}
            transition={springs.fast}
          />
        )}
      </AnimatePresence>
      {buttons.map((btn, i) => (
        <button
          key={i}
          ref={(el) => registerItem(i, el)}
          onClick={btn.onClick}
          className="group relative flex size-8 items-center justify-center rounded-lg text-page-text-muted"
        >
          {btn.icon}
          <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-tooltip-bg px-2.5 py-1 text-xs font-medium text-tooltip-text opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {btn.label}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ─── Chat history dropdown ─── */
const CHAT_HISTORY = [
  { id: "1", title: "Find campaigns that fit my style", time: "2 hours ago" },
  { id: "2", title: "How can I earn more?", time: "Yesterday" },
  { id: "3", title: "Write me a pitch for applications", time: "3 days ago" },
  { id: "4", title: "Breakdown my content analytics", time: "Last week" },
  { id: "5", title: "Help me optimize my profile", time: "Last week" },
];

function ChatHistoryDropdown({ open, onClose, onNewChat, onSelectChat }: {
  open: boolean; onClose: () => void; onNewChat: () => void; onSelectChat: (title: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    activeIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
  } = useProximityHover(listRef);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="absolute left-0 top-full z-50 mt-1 w-[260px] overflow-hidden rounded-xl border border-border bg-card-bg p-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
      <div
        ref={listRef}
        {...handlers}
        className="relative max-h-[200px] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Proximity hover indicator */}
        <AnimatePresence>
          {activeIndex !== null && itemRects[activeIndex] && (
            <motion.div
              key={`chat-hover-${sessionRef.current}`}
              layoutId={`chat-hover-${sessionRef.current}`}
              className="pointer-events-none absolute left-0 top-0 z-0 rounded-lg bg-foreground/[0.05] dark:bg-white/[0.05]"
              initial={false}
              style={{
                x: itemRects[activeIndex].left,
                width: itemRects[activeIndex].width,
                height: itemRects[activeIndex].height,
              }}
              animate={{ y: itemRects[activeIndex].top }}
              transition={springs.fast}
            />
          )}
        </AnimatePresence>
        {CHAT_HISTORY.map((chat, i) => (
          <button
            key={chat.id}
            ref={(el) => registerItem(i, el)}
            onClick={() => { onSelectChat(chat.title); onClose(); }}
            className="relative z-10 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ minWidth: 16, minHeight: 16 }} className="shrink-0 text-page-text-muted">
              <path d="M3 3.5C3 2.67 3.67 2 4.5 2h7c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5H7l-2.5 2.5V11H4.5C3.67 11 3 10.33 3 9.5v-6z" fill="currentColor"/>
              <path d="M5.5 5.5h5M5.5 7.5h3" stroke="var(--card-bg)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="truncate text-[13px] tracking-[-0.02em] text-page-text">{chat.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const SIDEBAR_SUGGESTIONS = [
  { type: 0, label: "Build your target audience" },
  { type: 1, label: "Create signal-based sequence" },
  { type: 2, label: "Analyze sequence performance" },
  { type: 3, label: "Score accounts for fit" },
];

export function CreatorAiFab() {
  const pathname = usePathname();
  const { aiSidebarOpen, setAiSidebarOpen, setCollapsed } = useSideNav();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"floating" | "sidebar">("sidebar");
  const [view, setView] = useState<"welcome" | "thinking" | "response" | "stopped">("welcome");
  const [cardIndex, setCardIndex] = useState(0);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const [fromMinimize, setFromMinimize] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [thinkingStep, setThinkingStep] = useState(0);
  const [thinkingDuration, setThinkingDuration] = useState(0);
  const thinkingStartRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const floatingInputRef = useRef<HTMLInputElement>(null);
  const sidebarTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: string; preview?: string }[]>([]);

  const mention = useMentionPopover({
    inputRef: mode === "sidebar" ? sidebarTextareaRef : floatingInputRef,
    message,
    setMessage,
  });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((f) => {
      const size = f.size < 1024 ? `${f.size} B` : f.size < 1024 * 1024 ? `${(f.size / 1024).toFixed(1)} KB` : `${(f.size / (1024 * 1024)).toFixed(1)} MB`;
      const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
      return { name: f.name, size, type: f.type, preview };
    });
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  }, []);

  const removeFile = useCallback((index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const { displayed: streamedText, done: textDone } = useStreamingText(
    AI_RESPONSE_TEXT,
    view === "response",
    18,
  );

  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    setView("thinking");
    setThinkingStep(0);
    setThinkingDuration(0);
    thinkingStartRef.current = Date.now();
    setMessage("");
    setAttachedFiles([]);
  }, [message]);

  const handleStop = useCallback(() => {
    setView("stopped");
  }, []);

  const handleRetry = useCallback(() => {
    setView("thinking");
    setThinkingStep(0);
    setThinkingDuration(0);
    thinkingStartRef.current = Date.now();
  }, []);

  const isGenerating = view === "thinking" || (view === "response" && !textDone);

  useEffect(() => {
    if (view !== "thinking") return;
    if (thinkingStep >= THINKING_STEPS.length) {
      const t = setTimeout(() => {
        setThinkingDuration(Math.ceil((Date.now() - thinkingStartRef.current) / 1000));
        setView("response");
        setCardIndex(0);
      }, 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setThinkingStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [view, thinkingStep]);

  // Auto-scroll as content streams in
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [streamedText, view]);

  const handleClose = () => {
    if (mode === "sidebar") {
      setAiSidebarOpen(false);
      setCollapsed(false);
      setView("welcome");
      setMessage("");
      setThinkingStep(0);
      setThinkingDuration(0);
    } else {
      setOpen(false);
      setView("welcome");
      setMessage("");
      setThinkingStep(0);
      setThinkingDuration(0);
    }
  };

  const handleNewChat = () => {
    setView("welcome");
    setMessage("");
    setThinkingStep(0);
    setThinkingDuration(0);
  };

  const handleMinimize = () => {
    setAiSidebarOpen(false);
    setCollapsed(false);
    setMode("floating");
    setFromMinimize(true);
    setOpen(true);
  };

  const handleExpand = () => {
    setOpen(false);
    setMode("sidebar");
    setAiSidebarOpen(true);
    setCollapsed(true);
  };

  const handleFabClick = () => {
    setFromMinimize(false);
    if (mode === "sidebar") {
      setAiSidebarOpen(true);
      setCollapsed(true);
    } else {
      setOpen(!open);
    }
  };

  const triggerSend = (text: string) => {
    setMessage(text);
    setView("thinking");
    setThinkingStep(0);
    setThinkingDuration(0);
    thinkingStartRef.current = Date.now();
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const hiddenPaths = ["/admin", "/newsletter", "/lander", "/product-lander", "/sitemap", "/kitchen-sink", "/forms-demo", "/onboarding"];
  if (!pathname || hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  const portalTarget = mounted ? document.body : null;

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt,.csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ═══ FLOATING POPOVER — portaled to body to escape will-change-transform ═══ */}
      {portalTarget && createPortal(
        <div className="hidden md:block">
          <AiPopupAnimated open={open && mode === "floating"} skipEntry={fromMinimize}>
            <div className="fixed bottom-[72px] right-6 z-[9999] w-[440px] max-w-[calc(100vw-32px)]">
          <BorderBeam colorVariant="sunset" theme="auto" borderRadius={16} strength={0.35} duration={4}>
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-foreground/[0.06] bg-[#FBFBFB] shadow-[0_2px_6px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] dark:border-white/[0.06] dark:bg-[#161616] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.2)]">
          {/* Header */}
          <div className="relative flex items-center justify-center border-b border-foreground/[0.06] bg-white px-5 py-3 dark:border-white/[0.06] dark:bg-card-bg">
            <span className="text-sm font-medium tracking-[-0.02em] text-[#E57100]">AI Assistant</span>
            <div className="absolute right-3 top-2 flex items-center gap-1">
              {/* Expand to sidebar */}
              <button onClick={handleExpand} className="flex size-7 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/[0.06] hover:text-foreground/60" title="Expand to sidebar">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M17.6 1.66c.44 0 .81.153 1.11.46.3.307.45.673.45 1.1v13.56c0 .427-.15.793-.45 1.1-.3.307-.67.46-1.11.46H2.4c-.44 0-.81-.153-1.11-.46-.3-.307-.45-.673-.45-1.1V3.22c0-.427.15-.793.45-1.1.3-.307.67-.46 1.11-.46h15.2zM2.94 3c-.213 0-.397.073-.55.22-.153.147-.23.327-.23.54v12.48c0 .213.077.393.23.54.153.147.337.22.55.22h14.12c.213 0 .397-.073.55-.22.153-.147.23-.327.23-.54V3.76c0-.213-.077-.393-.23-.54A.726.726 0 0 0 17.06 3H2.94zm12.66 7.16c.24 0 .44.08.6.24.16.16.24.353.24.58v3.8c0 .227-.08.42-.24.58-.16.16-.36.24-.6.24h-5.44c-.227 0-.423-.08-.59-.24a.788.788 0 0 1-.25-.58v-3.8c0-.227.083-.42.25-.58.167-.16.363-.24.59-.24h5.44z" fill="currentColor"/></svg>
              </button>
              {/* Close */}
              <button onClick={handleClose} className="flex size-7 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/[0.06] hover:text-foreground/60">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M.762.762l9.333 9.333M10.095.762L.762 10.095" stroke="currentColor" strokeWidth="1.524" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col justify-between gap-4 px-5 pb-5">
            {view === "welcome" ? (
              <div className="flex flex-col items-center gap-6 pb-6 pt-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_0.9px_rgba(37,37,37,0.06),0_0_3px_1.8px_#fff] dark:bg-card-bg dark:shadow-[inset_0_0_0_0.9px_rgba(255,255,255,0.06),0_0_3px_1.8px_#1C1C1C]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 1c.552 0 1 .448 1 1v1h4c1.657 0 3 1.343 3 3v5c0 .889-.386 1.687-1 2.236v1.35l1.707 1.707a1 1 0 0 1-1.414 1.414l-.319-.319C17.79 19.938 15.136 22 12 22s-5.791-2.062-6.974-4.612l-.319.319a1 1 0 0 1-1.414-1.414L5 14.586v-1.35A2.99 2.99 0 0 1 4 11V6c0-1.657 1.343-3 3-3h4V2c0-.552.448-1 1-1ZM7 5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm2 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z" fill="#E57100"/></svg>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 px-5">
                    <span className="text-sm font-medium tracking-[-0.02em] text-page-text">What can I help with?</span>
                    <p className="text-center text-sm leading-[150%] tracking-[-0.02em] text-foreground/70">
                      I can find campaigns, draft pitches, break down your analytics, or help with basically anything on the platform.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => triggerSend(s)} className="flex h-6 items-center rounded-full border border-foreground/[0.06] bg-white px-2.5 text-xs font-medium tracking-[-0.02em] text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)] dark:hover:bg-white/[0.04]">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : view === "thinking" ? (
              /* ── Thinking: reasoning block live ── */
              <div ref={scrollRef} className="flex flex-col gap-3 overflow-y-auto pt-4 scrollbar-hide" style={{ maxHeight: 420 }}>
                <div className="flex justify-end">
                  <div className="max-w-[280px] rounded-xl border border-foreground/[0.06] bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                    <span className="text-sm leading-[140%] tracking-[-0.02em] text-page-text">{message}</span>
                  </div>
                </div>
                <ReasoningBlock isStreaming duration={0} thinkingStep={thinkingStep} />
              </div>
            ) : (
              /* ── Response: reasoning collapsed + tasks + streamed text + campaigns ── */
              <div ref={scrollRef} className="-mx-5 flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden pt-4 scrollbar-hide" style={{ maxHeight: 420 }}>
                {/* User message */}
                <div className="flex justify-end px-5">
                  <div className="max-w-[280px] rounded-xl border border-foreground/[0.06] bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                    <span className="text-sm leading-[140%] tracking-[-0.02em] text-page-text">{message}</span>
                  </div>
                </div>

                {/* Reasoning (auto-collapses) */}
                <div className="px-5">
                  <ReasoningBlock isStreaming={false} duration={thinkingDuration} thinkingStep={THINKING_STEPS.length} />
                </div>

                {/* Task blocks */}
                <div className="flex flex-col gap-1.5 px-5">
                  <span className="text-sm font-medium tracking-[-0.02em] text-page-text-muted">Here&apos;s what I did</span>
                  {AI_TASKS.map((task, i) => (
                    <TaskBlock key={i} task={task} defaultOpen={i === 0} />
                  ))}
                </div>

                {/* Streamed response text */}
                <div className="flex items-start gap-1.5 px-5">
                  <RobotIconSmall />
                  <span className="relative -top-[2px] text-sm leading-[160%] tracking-[-0.02em] text-page-text">
                    {streamedText}
                    {!textDone && <span className="ml-0.5 inline-block h-[14px] w-[2px] animate-pulse bg-[#E57100]" />}
                  </span>
                </div>

                {/* Campaign cards — only show after text is done */}
                {textDone && (
                  <div className="flex flex-col gap-3">
                    <div
                      ref={carouselRef}
                      className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scrollbar-hide [scroll-padding-inline:20px]"
                    >
                      {AI_CAMPAIGNS.map((c, i) => (
                        <div key={i} className={cn(
                          "flex w-[304px] shrink-0 snap-start snap-always flex-col gap-2",
                          i === 0 && "ml-5",
                          i === AI_CAMPAIGNS.length - 1 && "mr-5",
                        )}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M8.665.664a8 8 0 0 1 5.29 2c1.462 1.288 2.403 3.065 2.647 4.997.244 1.933-.225 3.888-1.32 5.5a8.003 8.003 0 0 1-4.627 3.251 8.003 8.003 0 0 1-5.622-.62 8.003 8.003 0 0 1-3.806-4.183 8.003 8.003 0 0 1-.089-5.655A8.003 8.003 0 0 1 4.811 1.654" stroke="#00994D" strokeWidth="1.33" strokeLinecap="round"/></svg>
                              <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{c.match}% match</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {c.platforms.map((p) => (
                                <span key={p} className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.06] bg-white dark:border-white/[0.06] dark:bg-card-bg">
                                  <PlatformIcon platform={p} size={12} />
                                </span>
                              ))}
                              <span className="flex h-6 items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 dark:border-white/[0.06] dark:bg-card-bg">
                                <GamepadIcon className="size-3" />
                                <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{c.category}</span>
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                            <div className="h-[150px] w-full bg-cover bg-center" style={{ backgroundImage: `url(${c.thumb})` }} />
                            <div className="flex flex-col gap-3 px-4 pb-4 pt-3">
                              <div className="flex items-center gap-1.5">
                                <img src={c.avatar} alt={c.brand} className="size-4 rounded-full border border-foreground/[0.06] dark:border-white/[0.06]" />
                                <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{c.brand}</span>
                                {c.verified && <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="url(#vbm)"/><path d="M4.5 7.2L6 8.7L9.5 5.3" stroke="#252525" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="vbm" x1="7" y1="0" x2="7" y2="14"><stop stopColor="#FDDC87"/><stop offset="1" stopColor="#FCB02B"/></linearGradient></defs></svg>}
                                <span className="text-xs text-foreground/20">·</span>
                                <span className="text-xs text-foreground/50">{c.ago}</span>
                              </div>
                              <span className="line-clamp-1 text-sm font-medium tracking-[-0.02em] text-page-text">{c.title}</span>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <span className="flex h-6 items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 dark:border-white/[0.06] dark:bg-card-bg">
                                      <svg width="10" height="10" viewBox="0 0 11 12" fill="none"><path d="M5.015 0C3.566 0 2.39 1.175 2.39 2.625S3.566 5.25 5.015 5.25 7.64 4.075 7.64 2.625 6.465 0 5.015 0Z" fill="currentColor"/><path d="M5.016 5.833c-2.775 0-4.715 2.054-4.956 4.612L0 11.083h10.032l-.06-.638c-.24-2.558-2.18-4.612-4.956-4.612Z" fill="currentColor"/></svg>
                                      <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{c.creators}</span>
                                    </span>
                                    <span className="flex h-6 items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 dark:border-white/[0.06] dark:bg-card-bg">
                                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 1.333C4.364 1.333 1.227 3.63 0 7.333c1.227 3.703 4.364 6 8 6s6.773-2.297 8-6c-1.227-3.703-4.364-6-8-6Zm0 9.667a3.667 3.667 0 1 0 0-7.333 3.667 3.667 0 0 0 0 7.333Zm0-1.833a1.833 1.833 0 1 0 0-3.667 1.833 1.833 0 0 0 0 3.667Z" fill={c.cpmColor}/></svg>
                                      <span className="text-xs font-medium tracking-[-0.02em]" style={{ color: c.cpmColor }}>{c.cpm}</span>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-[1px] text-xs">
                                    <span className="font-medium text-page-text">{c.spent}</span>
                                    <span className="text-foreground/70">/</span>
                                    <span className="text-foreground/70">{c.total}</span>
                                  </div>
                                </div>
                                <div className="h-1 w-full rounded-full bg-foreground/[0.06] dark:bg-white/[0.06]">
                                  <div className="h-full rounded-full bg-page-text" style={{ width: `${c.progress}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-end gap-3 pr-5">
                      <button onClick={() => { if (cardIndex <= 0) return; const next = cardIndex - 1; setCardIndex(next); (carouselRef.current?.children[next] as HTMLElement)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" }); }} className={cn("flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/50 dark:bg-white/[0.06]", cardIndex === 0 && "opacity-30 pointer-events-none")}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <span className="min-w-[28px] text-center text-sm font-medium tracking-[-0.02em] text-page-text">{cardIndex + 1}/{AI_CAMPAIGNS.length}</span>
                      <button onClick={() => { if (cardIndex >= AI_CAMPAIGNS.length - 1) return; const next = cardIndex + 1; setCardIndex(next); (carouselRef.current?.children[next] as HTMLElement)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" }); }} className={cn("flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/50 dark:bg-white/[0.06]", cardIndex === AI_CAMPAIGNS.length - 1 && "opacity-30 pointer-events-none")}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {view === "stopped" && (
              <div className="flex flex-col gap-3 pt-4">
                <button className="flex items-center gap-1 text-[13px] font-medium text-page-text-muted">
                  Analysis
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-muted">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M8 5v3M8 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[14px] text-page-text-muted">Stopped.</span>
                  <button onClick={handleRetry} className="text-[14px] text-page-text-muted underline transition-colors hover:text-page-text">Retry</button>
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="relative">
              <MentionPopover
                open={mention.isOpen}
                query={mention.query}
                activeTab={mention.activeTab}
                onTabChange={mention.setActiveTab}
                creators={mention.filteredCreators}
                campaigns={mention.filteredCampaigns}
                highlightIndex={mention.highlightIndex}
                onHighlightChange={mention.setHighlightIndex}
                onSelect={mention.selectItem}
                onClose={mention.close}
                mode="floating"
              />
            {/* Attached files preview */}
            {attachedFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachedFiles.map((f, i) => (
                  <div key={i} className="group flex items-center gap-2 rounded-lg border border-border bg-foreground/[0.03] px-2 py-1.5 dark:bg-white/[0.03]">
                    {f.preview ? (
                      <img src={f.preview} alt="" className="size-6 rounded object-cover" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-page-text-muted"><path d="M4 1h5.5L13 4.5V13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.2"/><path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    )}
                    <span className="max-w-[100px] truncate text-[11px] font-medium text-page-text">{f.name}</span>
                    <span className="text-[10px] text-page-text-subtle">{f.size}</span>
                    <button onClick={() => removeFile(i)} className="flex size-4 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-foreground/[0.06]">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-page-text-muted"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.10] hover:text-page-text dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
              >
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M.75 4.75v4.667c0 1.84 1.492 3.333 3.333 3.333s3.417-1.493 3.417-3.333V2.417A1.667 1.667 0 0 0 5.75.75c-.92 0-1.667.746-1.667 1.667V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <input
                ref={floatingInputRef}
                value={message}
                onChange={(e) => { setMessage(e.target.value); requestAnimationFrame(() => mention.detectTrigger()); }}
                onKeyDown={(e) => { if (mention.handleKeyDown(e)) return; if (e.key === "Enter") handleSend(); }}
                placeholder="Leave a comment..."
                className="flex-1 rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]"
              />
              {isGenerating ? (
                <button
                  onClick={handleStop}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06]"
                >
                  <div className="size-3.5 rounded-[2px] bg-page-text" />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-30"
                  style={{ background: "#FF8707" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M0.290678 0.429374C0.430093 0.261721 0.612869 0.135571 0.81907 0.0646817C1.02527 -0.0062072 1.24698 -0.0191124 1.46001 0.027374C3.25268 0.398707 6.10201 1.60404 8.47468 2.84471C9.66801 3.46871 10.77 4.11804 11.5827 4.69671C11.9867 4.98404 12.3393 5.26937 12.598 5.53804C12.7273 5.67137 12.8493 5.81804 12.9413 5.97204C13.03 6.12004 13.124 6.32804 13.124 6.57337C13.124 6.81871 13.03 7.02671 12.9413 7.17404C12.8487 7.32871 12.728 7.47404 12.598 7.60871C12.3393 7.87737 11.9867 8.16204 11.5827 8.45004C10.77 9.02871 9.66801 9.67737 8.47468 10.302C6.10201 11.5427 3.25268 12.748 1.46001 13.1194C1.24682 13.1659 1.02493 13.153 0.818598 13.082C0.612261 13.0109 0.429408 12.8846 0.290011 12.7167C0.158593 12.5562 0.0680974 12.3661 0.0262945 12.1629C-0.0155085 11.9597 -0.00736995 11.7494 0.0500114 11.55L1.24668 7.24004H7.12401C7.30082 7.24004 7.47039 7.1698 7.59542 7.04478C7.72044 6.91975 7.79068 6.75019 7.79068 6.57337C7.79068 6.39656 7.72044 6.22699 7.59542 6.10197C7.47039 5.97695 7.30082 5.90671 7.12401 5.90671H1.24668L0.0506782 1.59671C-0.00670317 1.39734 -0.0148419 1.18702 0.0269611 0.983809C0.068764 0.7806 0.15926 0.590573 0.290678 0.430041V0.429374Z" fill="white"/></svg>
                </button>
              )}
            </div>
            </div>
          </div>
        </div>
          </BorderBeam>
        </div>
          </AiPopupAnimated>
        </div>,
        portalTarget
      )}

      {/* ═══ SIDEBAR MODE — always rendered as grid column, width controlled by grid ═══ */}
      {mode === "sidebar" && (
        <div className={cn(
          "hidden h-full flex-col overflow-hidden bg-page-bg transition-[border,opacity] duration-300 md:flex",
          aiSidebarOpen ? "border-l border-border opacity-100" : "opacity-0"
        )}>
          {/* Sidebar header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-2">
            {/* Left: "New chat" with chevron dropdown */}
            <div className="relative flex items-center">
              <button
                onClick={() => setChatHistoryOpen((v) => !v)}
                className="flex h-8 items-center gap-1.5 rounded-full bg-foreground/[0.04] px-3 text-page-text-muted transition-colors hover:bg-foreground/[0.08] hover:text-page-text dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
              >
                <span className="text-[14px] font-medium">New chat</span>
                <svg width="9" height="6" viewBox="0 0 9 6" fill="none" className={cn("transition-transform", chatHistoryOpen && "rotate-180")}>
                  <path d="M8.01 0L4.446 3.564L0.882 0L0 0.882L4.446 5.328L8.892 0.882L8.01 0Z" fill="currentColor"/>
                </svg>
              </button>
              <ChatHistoryDropdown
                open={chatHistoryOpen}
                onClose={() => setChatHistoryOpen(false)}
                onNewChat={handleNewChat}
                onSelectChat={(title) => triggerSend(title)}
              />
            </div>
            {/* Right: + new, minimize, close — with proximity hover + tooltips */}
            <SidebarIconRow buttons={[
              { onClick: handleNewChat, label: "New chat", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { onClick: handleMinimize, label: "Floating mode", icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M17.6 1.66c.44 0 .81.153 1.11.46.3.307.45.673.45 1.1v13.56c0 .427-.15.793-.45 1.1-.3.307-.67.46-1.11.46H2.4c-.44 0-.81-.153-1.11-.46-.3-.307-.45-.673-.45-1.1V3.22c0-.427.15-.793.45-1.1.3-.307.67-.46 1.11-.46h15.2zM2.94 3c-.213 0-.397.073-.55.22-.153.147-.23.327-.23.54v12.48c0 .213.077.393.23.54.153.147.337.22.55.22h14.12c.213 0 .397-.073.55-.22.153-.147.23-.327.23-.54V3.76c0-.213-.077-.393-.23-.54A.726.726 0 0 0 17.06 3H2.94zm12.66 7.16c.24 0 .44.08.6.24.16.16.24.353.24.58v3.8c0 .227-.08.42-.24.58-.16.16-.36.24-.6.24h-5.44c-.227 0-.423-.08-.59-.24a.788.788 0 0 1-.25-.58v-3.8c0-.227.083-.42.25-.58.167-.16.363-.24.59-.24h5.44z" fill="currentColor"/></svg> },
              { onClick: handleClose, label: "Close", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
            ]} />
          </div>

          {/* Sidebar body */}
          <div className="relative flex min-h-0 flex-1 flex-col px-4 pb-4">
            {/* AI gradient glow — only on welcome view */}
            {aiSidebarOpen && view === "welcome" && (
              <>
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[250px]"
                  style={{ background: "radial-gradient(ellipse 70% 80% at 30% 0%, rgba(255,63,213,0.08) 0%, transparent 70%)" }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[250px]"
                  style={{ background: "radial-gradient(ellipse 70% 80% at 70% 0%, rgba(255,144,37,0.10) 0%, transparent 70%)" }}
                />
              </>
            )}

            {view === "welcome" ? (
              <div className="relative z-[1] flex flex-1 flex-col gap-4 pt-6">
                {/* Welcome text */}
                <div className="flex flex-col gap-3 p-2">
                  <div className="flex size-[30px] items-center justify-center text-page-text-muted">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 1c.552 0 1 .448 1 1v1h4c1.657 0 3 1.343 3 3v5c0 .889-.386 1.687-1 2.236v1.35l1.707 1.707a1 1 0 0 1-1.414 1.414l-.319-.319C17.79 19.938 15.136 22 12 22s-5.791-2.062-6.974-4.612l-.319.319a1 1 0 0 1-1.414-1.414L5 14.586v-1.35A2.99 2.99 0 0 1 4 11V6c0-1.657 1.343-3 3-3h4V2c0-.552.448-1 1-1ZM7 5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm2 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z" fill="currentColor"/></svg>
                  </div>
                  <p className="text-[20px] leading-[30px] tracking-[-0.02em] text-page-text">
                    I&apos;m your <span className="font-medium text-[#E57100]">AI Assistant</span>, here to help you get things done
                  </p>
                </div>

                {/* Suggestion items */}
                <div className="flex flex-col gap-0.5">
                  {SIDEBAR_SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => triggerSend(s.label)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-foreground/[0.06] dark:hover:bg-white/[0.06]"
                    >
                      <SidebarSuggestionIcon type={s.type} />
                      <span className="text-[14px] tracking-[-0.02em] text-page-text">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : view === "thinking" ? (
              <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-page-bg to-transparent" />
                <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto pt-4 scrollbar-hide">
                  <div className="flex justify-end">
                    <div className="max-w-[280px] rounded-xl border border-foreground/[0.06] bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                      <span className="text-sm leading-[140%] tracking-[-0.02em] text-page-text">{message}</span>
                    </div>
                  </div>
                  <ReasoningBlock isStreaming duration={0} thinkingStep={thinkingStep} />
                </div>
              </div>
            ) : (
              <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-page-bg to-transparent" />
                <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden pt-4 scrollbar-hide">
                  <div className="flex justify-end">
                    <div className="max-w-[280px] rounded-xl border border-foreground/[0.06] bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                      <span className="text-sm leading-[140%] tracking-[-0.02em] text-page-text">{message}</span>
                    </div>
                  </div>
                  <ReasoningBlock isStreaming={false} duration={thinkingDuration} thinkingStep={THINKING_STEPS.length} />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium tracking-[-0.02em] text-page-text-muted">Here&apos;s what I did</span>
                    {AI_TASKS.map((task, i) => <TaskBlock key={i} task={task} defaultOpen={i === 0} />)}
                  </div>
                  <div className="flex items-start gap-1.5">
                    <RobotIconSmall />
                    <span className="relative -top-[2px] text-sm leading-[160%] tracking-[-0.02em] text-page-text">
                      {AI_RESPONSE_TEXT}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {view === "stopped" && (
              <div className="flex flex-1 flex-col gap-3 pt-4">
                <button className="flex items-center gap-1 text-[13px] font-medium text-page-text-muted">
                  Analysis
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-muted">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M8 5v3M8 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[14px] text-page-text-muted">Stopped.</span>
                  <button onClick={handleRetry} className="text-[14px] text-page-text-muted underline transition-colors hover:text-page-text">Retry</button>
                </div>
              </div>
            )}

            {/* Sidebar input form */}
            <div className="relative mt-4">
              <MentionPopover
                open={mention.isOpen}
                query={mention.query}
                activeTab={mention.activeTab}
                onTabChange={mention.setActiveTab}
                creators={mention.filteredCreators}
                campaigns={mention.filteredCampaigns}
                highlightIndex={mention.highlightIndex}
                onHighlightChange={mention.setHighlightIndex}
                onSelect={mention.selectItem}
                onClose={mention.close}
                mode="sidebar"
              />
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card-bg p-3 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] dark:shadow-[0px_4px_12px_rgba(0,0,0,0.2)]">
              <textarea
                ref={sidebarTextareaRef}
                value={message}
                onChange={(e) => { setMessage(e.target.value); requestAnimationFrame(() => mention.detectTrigger()); }}
                onKeyDown={(e) => { if (mention.handleKeyDown(e)) return; if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="What can I help you do?"
                rows={2}
                className="w-full resize-none bg-transparent text-[14px] leading-[22px] tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                style={{ scrollbarWidth: "none" }}
              />
              {/* Attached files */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((f, i) => (
                    <div key={i} className="group flex items-center gap-2 rounded-lg border border-border bg-foreground/[0.03] px-2 py-1.5 dark:bg-white/[0.03]">
                      {f.preview ? (
                        <img src={f.preview} alt="" className="size-6 rounded object-cover" />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-page-text-muted"><path d="M4 1h5.5L13 4.5V13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.2"/><path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      )}
                      <span className="max-w-[100px] truncate text-[11px] font-medium text-page-text">{f.name}</span>
                      <span className="text-[10px] text-page-text-subtle">{f.size}</span>
                      <button onClick={() => removeFile(i)} className="flex size-4 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 hover:bg-foreground/[0.06]">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="text-page-text-muted"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                {/* Model selector */}
                <div className="flex h-7 items-center">
                  {/* Attach button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.10] hover:text-page-text dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 7.5l-5.318 5.318a3.375 3.375 0 0 1-4.773-4.773l5.318-5.318a2.25 2.25 0 0 1 3.182 3.182L6.59 11.227a1.125 1.125 0 0 1-1.59-1.591l4.772-4.773" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  {/* Divider */}
                  <div className="mx-1.5 h-4 w-px bg-border" />
                  {/* Model dropdown */}
                  <button className="flex h-7 items-center gap-1.5 rounded-lg border border-border bg-card-bg px-2 transition-colors hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12 1c.552 0 1 .448 1 1v1h4c1.657 0 3 1.343 3 3v5c0 .889-.386 1.687-1 2.236v1.35l1.707 1.707a1 1 0 0 1-1.414 1.414l-.319-.319C17.79 19.938 15.136 22 12 22s-5.791-2.062-6.974-4.612l-.319.319a1 1 0 0 1-1.414-1.414L5 14.586v-1.35A2.99 2.99 0 0 1 4 11V6c0-1.657 1.343-3 3-3h4V2c0-.552.448-1 1-1ZM7 5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm2 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z" fill="#E57100"/></svg>
                    <span className="font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text-muted">CR Brain</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted"/></svg>
                  </button>
                </div>
                {/* Send / Stop button */}
                {isGenerating ? (
                  <button
                    onClick={handleStop}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06]"
                  >
                    <div className="size-3 rounded-[2px] bg-page-text" />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-30"
                    style={{ background: "#FF8707" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M0.290678 0.429374C0.430093 0.261721 0.612869 0.135571 0.81907 0.0646817C1.02527 -0.0062072 1.24698 -0.0191124 1.46001 0.027374C3.25268 0.398707 6.10201 1.60404 8.47468 2.84471C9.66801 3.46871 10.77 4.11804 11.5827 4.69671C11.9867 4.98404 12.3393 5.26937 12.598 5.53804C12.7273 5.67137 12.8493 5.81804 12.9413 5.97204C13.03 6.12004 13.124 6.32804 13.124 6.57337C13.124 6.81871 13.03 7.02671 12.9413 7.17404C12.8487 7.32871 12.728 7.47404 12.598 7.60871C12.3393 7.87737 11.9867 8.16204 11.5827 8.45004C10.77 9.02871 9.66801 9.67737 8.47468 10.302C6.10201 11.5427 3.25268 12.748 1.46001 13.1194C1.24682 13.1659 1.02493 13.153 0.818598 13.082C0.612261 13.0109 0.429408 12.8846 0.290011 12.7167C0.158593 12.5562 0.0680974 12.3661 0.0262945 12.1629C-0.0155085 11.9597 -0.00736995 11.7494 0.0500114 11.55L1.24668 7.24004H7.12401C7.30082 7.24004 7.47039 7.1698 7.59542 7.04478C7.72044 6.91975 7.79068 6.75019 7.79068 6.57337C7.79068 6.39656 7.72044 6.22699 7.59542 6.10197C7.47039 5.97695 7.30082 5.90671 7.12401 5.90671H1.24668L0.0506782 1.59671C-0.00670317 1.39734 -0.0148419 1.18702 0.0269611 0.983809C0.068764 0.7806 0.15926 0.590573 0.290678 0.430041V0.429374Z" fill="white"/></svg>
                  </button>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* FAB — portaled to body, hidden when AI sidebar is open */}
      {portalTarget && !aiSidebarOpen && createPortal(
        <button
          onClick={handleFabClick}
          className="fixed bottom-4 right-4 z-[9998] hidden size-12 items-center justify-center rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_1px_rgba(229,113,0,0.06)] transition-transform hover:scale-105 active:scale-95 md:flex dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_0_1px_rgba(229,113,0,0.15)]"
          style={{ background: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.2) 0%, rgba(255,144,37,0) 90.69%), var(--card-bg, #FFFFFF)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 1c.552 0 1 .448 1 1 0 .552.448 1 1 1h3c1.657 0 3 1.343 3 3v5c0 .637-.198 1.227-.537 1.713-.254.365-.463.778-.463 1.224 0 .415.165.814.459 1.108l1.248 1.248a1 1 0 0 1-1.414 1.414c-.279-.278-.758-.162-.922.196C17.269 20.32 14.83 22 12 22s-5.269-1.68-6.372-4.097c-.163-.358-.643-.474-.921-.196a1 1 0 0 1-1.414-1.414l1.248-1.248A1.063 1.063 0 0 0 5 13.937c0-.446-.209-.859-.463-1.224A2.989 2.989 0 0 1 4 11V6c0-1.657 1.343-3 3-3h3c.552 0 1-.448 1-1 0-.552.448-1 1-1ZM7 5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm2 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z" fill="#FF6207"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 1c.552 0 1 .448 1 1 0 .552.448 1 1 1h3c1.657 0 3 1.343 3 3v5c0 .637-.198 1.227-.537 1.713-.254.365-.463.778-.463 1.224 0 .415.165.814.459 1.108l1.248 1.248a1 1 0 0 1-1.414 1.414c-.279-.278-.758-.162-.922.196C17.269 20.32 14.83 22 12 22s-5.269-1.68-6.372-4.097c-.163-.358-.643-.474-.921-.196a1 1 0 0 1-1.414-1.414l1.248-1.248A1.063 1.063 0 0 0 5 13.937c0-.446-.209-.859-.463-1.224A2.989 2.989 0 0 1 4 11V6c0-1.657 1.343-3 3-3h3c.552 0 1-.448 1-1 0-.552.448-1 1-1ZM7 5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm2 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z" fill="url(#fab_grad)"/>
            <defs><radialGradient id="fab_grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 1.263) rotate(180) scale(9 13.51)"><stop stopColor="#F59E0B"/><stop offset="1" stopColor="#F59E0B" stopOpacity="0"/></radialGradient></defs>
          </svg>
        </button>,
        portalTarget
      )}
    </>
  );
}
