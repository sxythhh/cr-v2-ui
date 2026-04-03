"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { GamepadIcon } from "@/components/sidebar/icons/gamepad";
import { AiPopupAnimated } from "@/components/ai-popup-animations";


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
export function CreatorAiFab() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"welcome" | "thinking" | "response">("welcome");
  const [cardIndex, setCardIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [thinkingStep, setThinkingStep] = useState(0);
  const [thinkingDuration, setThinkingDuration] = useState(0);
  const thinkingStartRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
  }, [message]);

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
    setOpen(false);
    setView("welcome");
    setMessage("");
    setThinkingStep(0);
    setThinkingDuration(0);
  };

  if (!pathname?.startsWith("/creator")) return null;

  return (
    <>
      <AiPopupAnimated open={open}>
        <div className="fixed bottom-[132px] right-6 z-[9999] w-[440px] max-w-[calc(100vw-32px)] md:bottom-[72px]">
          {/* Pink gradient border rect */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 blur-[0.5px]" style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)", border: "1px solid #FF3FD5" }} />
          {/* Orange gradient border rect */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 blur-[0.5px]" style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)", border: "1px solid #FF9025" }} />
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-foreground/[0.06] bg-[#FBFBFB] shadow-[0_2px_6px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] dark:border-white/[0.06] dark:bg-[#161616] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.2)]">
          {/* Header */}
          <div className="relative flex items-center justify-center border-b border-foreground/[0.06] bg-white px-5 py-3 dark:border-white/[0.06] dark:bg-card-bg">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">AI Assistant</span>
            <button onClick={handleClose} className="absolute right-4 top-3 flex size-4 items-center justify-center text-foreground/50">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M.762.762l9.333 9.333M10.095.762L.762 10.095" stroke="currentColor" strokeWidth="1.524" strokeLinecap="round"/></svg>
            </button>
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
                    <button key={s} onClick={() => { setMessage(s); setView("thinking"); setThinkingStep(0); setThinkingDuration(0); thinkingStartRef.current = Date.now(); }} className="flex h-6 items-center rounded-full border border-foreground/[0.06] bg-white px-2.5 text-xs font-medium tracking-[-0.02em] text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-white/[0.06] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)] dark:hover:bg-white/[0.04]">
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
                  <span className="text-sm leading-[160%] tracking-[-0.02em] text-page-text">
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

            {/* Input bar */}
            <div className="flex items-center gap-2">
              <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text dark:bg-white/[0.06]">
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M.75 4.75v4.667c0 1.84 1.492 3.333 3.333 3.333s3.417-1.493 3.417-3.333V2.417A1.667 1.667 0 0 0 5.75.75c-.92 0-1.667.746-1.667 1.667V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Leave a comment..."
                className="flex-1 rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]"
              />
            </div>
          </div>
        </div>
        </div>
      </AiPopupAnimated>

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-[9998] flex size-12 items-center justify-center rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_1px_rgba(229,113,0,0.06)] transition-transform hover:scale-105 active:scale-95 dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_0_1px_rgba(229,113,0,0.15)] md:bottom-4"
        style={{ background: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.2) 0%, rgba(255,144,37,0) 90.69%), var(--card-bg, #FFFFFF)" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 1c.552 0 1 .448 1 1 0 .552.448 1 1 1h3c1.657 0 3 1.343 3 3v5c0 .637-.198 1.227-.537 1.713-.254.365-.463.778-.463 1.224 0 .415.165.814.459 1.108l1.248 1.248a1 1 0 0 1-1.414 1.414c-.279-.278-.758-.162-.922.196C17.269 20.32 14.83 22 12 22s-5.269-1.68-6.372-4.097c-.163-.358-.643-.474-.921-.196a1 1 0 0 1-1.414-1.414l1.248-1.248A1.063 1.063 0 0 0 5 13.937c0-.446-.209-.859-.463-1.224A2.989 2.989 0 0 1 4 11V6c0-1.657 1.343-3 3-3h3c.552 0 1-.448 1-1 0-.552.448-1 1-1ZM7 5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm2 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z" fill="#FF6207"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 1c.552 0 1 .448 1 1 0 .552.448 1 1 1h3c1.657 0 3 1.343 3 3v5c0 .637-.198 1.227-.537 1.713-.254.365-.463.778-.463 1.224 0 .415.165.814.459 1.108l1.248 1.248a1 1 0 0 1-1.414 1.414c-.279-.278-.758-.162-.922.196C17.269 20.32 14.83 22 12 22s-5.269-1.68-6.372-4.097c-.163-.358-.643-.474-.921-.196a1 1 0 0 1-1.414-1.414l1.248-1.248A1.063 1.063 0 0 0 5 13.937c0-.446-.209-.859-.463-1.224A2.989 2.989 0 0 1 4 11V6c0-1.657 1.343-3 3-3h3c.552 0 1-.448 1-1 0-.552.448-1 1-1ZM7 5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7Zm2 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm6 0a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Z" fill="url(#fab_grad)"/>
          <defs><radialGradient id="fab_grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 1.263) rotate(180) scale(9 13.51)"><stop stopColor="#F59E0B"/><stop offset="1" stopColor="#F59E0B" stopOpacity="0"/></radialGradient></defs>
        </svg>
      </button>
    </>
  );
}
