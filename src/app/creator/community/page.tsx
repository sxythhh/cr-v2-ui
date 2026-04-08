"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreatorHeader } from "@/components/creator-header";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

/* ── Icons ── */
function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" className={className}>
      <path d="M5.25 0C6.78 0 8.09.4 9.03 1.18 9.98 1.97 10.5 3.12 10.5 4.5s-.52 2.53-1.47 3.32C8.09 8.6 6.78 9 5.25 9c-.81 0-1.72-.07-2.54-.43-.14.08-.33.17-.56.25-.48.17-1.17.28-1.87-.05a.38.38 0 0 1-.14-.7c.34-.45.45-.8.48-1.03.03-.22-.01-.34-.01-.36l.01.01-.01-.01-.01-.01-.01-.02C.52 6.52.38 6.18.26 5.79.13 5.41 0 4.91 0 4.5 0 3.12.52 1.97 1.47 1.18 2.41.4 3.72 0 5.25 0Z" fill="currentColor"/>
    </svg>
  );
}

function HeartIconOutline({ className }: { className?: string }) {
  return (
    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" className={className}>
      <path d="M5.115 1.496c3.08-3.125 8.36 2.68.001 7.365C-3.248 4.174 2.034-1.63 5.115 1.496Z" stroke="#FF3355" strokeWidth="1.22" strokeLinejoin="round"/>
    </svg>
  );
}

function HeartIconFilled({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className}>
      <path d="M5.248 9.186c4.264-2.39 5.313-5.235 4.511-7.235-.39-.97-1.207-1.666-2.171-1.881-.849-.19-1.776 0-2.585.642-.808-.641-1.735-.831-2.584-.642C1.455.285.638.98.248 1.951c-.802 2-1.246 4.845 4.511 7.235a.5.5 0 0 0 .49 0Z" fill="#FF3355"/>
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" className={className}>
      <path d="M4.257.104C4.125.002 3.952-.027 3.794.026 3.636.078 3.515.206 3.47.366 3.2 1.33 2.65 1.86 1.94 2.54c-.1.09-.19.19-.3.28C1.33 3.14 1.01 3.49.74 3.89c-.79 1.18-.98 2.52-.39 3.86C1.34 9.98 3.55 10.62 5.4 10.06c1.86-.57 3.38-2.36 3.06-4.93-.1-.8-.37-1.63-1.04-2.29-.11-.1-.26-.15-.41-.14-.15.01-.27.09-.36.21-.07.1-.23.3-.42.52-.03-.4-.12-.79-.26-1.16-.31-.82-.89-1.52-1.72-2.17Z" fill="#E57100"/>
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground/50">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.52" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M5.8.8C6.5.1 7.5.1 8.2.8L8.9 1.5l1-.2c.9-.2 1.8.4 2 1.3l.2 1 .9.5c.8.4 1.1 1.4.7 2.2l-.5.9.5.9c.4.8.1 1.8-.7 2.2l-.9.5-.2 1c-.2.9-1.1 1.5-2 1.3l-1-.2-.7.7c-.7.7-1.7.7-2.4 0l-.7-.7-1 .2c-.9.2-1.8-.4-2-1.3l-.2-1-.9-.5c-.8-.4-1.1-1.4-.7-2.2l.5-.9-.5-.9c-.4-.8-.1-1.8.7-2.2l.9-.5.2-1C2.3 1.7 3.2 1.1 4.1 1.3l1 .2.7-.7Z" fill="url(#vb)"/>
      <path d="M5 7l1.5 1.5 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs><linearGradient id="vb" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#FDDC87"/><stop offset="1" stopColor="#FCB02B"/></linearGradient></defs>
    </svg>
  );
}

/* ── Data ── */
const discussions = [
  { id: 1, title: "Best practices for sports clipping campaigns", author: "Evan Stanfield", time: "2h ago", replies: 34, hot: true },
  { id: 2, title: "Instagram Reels vs TikTok: Which pays more?", author: "Kamran Malik", time: "8h ago", replies: 21, hot: true },
  { id: 3, title: "How to hit Level 5 fast - my strategy", author: "Saksham Vishwakarma", time: "1d ago", replies: 15, hot: false },
  { id: 4, title: "UGC campaign tips for beginners", author: "Dark Mafia", time: "2d ago", replies: 9, hot: false },
  { id: 5, title: "Getting your first brand deal - what worked for me", author: "DK", time: "3d ago", replies: 27, hot: false },
];

const threadComments = [
  {
    author: "Evan Stanfield", time: "2h ago", verified: true,
    text: "I've been clipping sports content for 6 months now and here are my top tips:\n1. Capture the emotional reaction, not just the play\n2. Use slow-mo on the key moment\n3. Add captions - 80% of viewers watch on mute\n4. Post within 30 min of the event happening",
    likes: 120, isOP: true,
  },
  {
    author: "Kamran Malik", time: "1h ago", verified: true,
    text: "The 30-minute window is huge. I've noticed my clips that go up within an hour get 3-4x more views than ones posted the next day.",
    likes: 3, isOP: false,
  },
  {
    author: "Vlad Shapoval (you)", time: "1h ago", verified: true,
    text: "Great tips! I'd add: always include the crowd reaction audio. That energy is what makes people share.",
    likes: 3, isOP: false,
  },
];

/* ── Page ── */
export default function CommunityPage() {
  const [tab, setTab] = useState<"discussions" | "agencies">("discussions");
  const [activeThread, setActiveThread] = useState<typeof discussions[number] | null>(null);

  return (
    <div className={cn("flex flex-col font-inter tracking-[-0.02em]", activeThread ? "h-[calc(100svh-60px)] overflow-hidden md:h-auto md:min-h-screen md:overflow-visible" : "min-h-screen")}>
      {activeThread ? (
        <div className="flex items-center justify-between border-b border-foreground/[0.06] px-4 py-4 sm:px-5 md:hidden">
          <button onClick={() => setActiveThread(null)} className="flex items-center gap-2 text-sm font-medium text-page-text">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground/50"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
        </div>
      ) : null}
      <CreatorHeader title="Community" className={activeThread ? "hidden md:flex" : ""} />

      {activeThread ? (
        /* ── Thread detail view ── */
        <div className="mx-auto flex w-full max-w-[756px] flex-1 flex-col gap-4 px-4 py-4 sm:px-5 md:px-4">
          {/* Back button — desktop shows text, mobile in header */}
          <button onClick={() => setActiveThread(null)} className="hidden items-center gap-2 self-start text-sm font-medium text-page-text transition-colors hover:text-page-text-muted md:flex">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground/50"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Discussions
          </button>

          <div className={cn(cardCls, "relative flex flex-1 flex-col")}>
            {/* Thread header */}
            <div className="flex items-start gap-3 border-b border-foreground/[0.06] p-4 dark:border-[rgba(224,224,224,0.03)]">
              <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium leading-[120%] text-page-text">{activeThread.title}</span>
                  <div className="flex items-center gap-1 text-xs text-page-text-subtle">
                    <span>{activeThread.author}</span>
                    <span>&middot;</span>
                    <span>{activeThread.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] py-1 pl-1.5 pr-2 dark:border-[rgba(224,224,224,0.03)]">
                    <ChatBubbleIcon className="size-3 text-foreground/50" />
                    <span className="text-xs font-medium text-page-text">{activeThread.replies} replies</span>
                  </span>
                  {activeThread.hot && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] py-1 pl-1.5 pr-2 dark:border-[rgba(224,224,224,0.03)]">
                      <FireIcon className="size-3" />
                      <span className="text-xs font-medium text-page-text">Hot</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Comments — scrollable */}
            <div className="flex flex-1 flex-col overflow-y-auto pb-16">
              {threadComments.map((c, i) => (
                <div key={i} className="flex gap-2 border-b border-foreground/[0.06] px-4 py-4 dark:border-[rgba(224,224,224,0.03)]">
                  <div className="size-6 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-page-text">{c.author}</span>
                        {c.verified && <VerifiedBadge />}
                      </div>
                      <span className="text-[11px] text-page-text-subtle">{c.time}</span>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-[150%] tracking-[-0.02em] text-page-text">{c.text}</p>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 py-2 text-xs font-medium text-page-text dark:bg-white/[0.06]">
                        {c.likes > 5 ? <HeartIconFilled className="size-3" /> : <HeartIconOutline className="size-3" />}
                        {c.likes}
                      </button>
                      <button className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2.5 py-2 text-xs font-medium text-page-text dark:bg-white/[0.06]">
                        <ChatBubbleIcon className="size-3 text-foreground/50" />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input — pinned at bottom */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 rounded-b-2xl bg-white px-4 py-4 dark:bg-[rgba(224,224,224,0.03)]">
              <input className="flex-1 rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]" placeholder="Write a message..." />
              <button className="flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-medium text-white" style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}>
                Post
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Discussion list view ── */
        <div className="mx-auto flex w-full max-w-[756px] flex-col gap-4 px-4 py-4 sm:px-5 md:px-4">
          {/* Tabs */}
          <div className="flex border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)]">
            <button
              onClick={() => setTab("discussions")}
              className={cn("whitespace-nowrap px-5 py-3 text-sm font-medium tracking-[-0.02em] transition-colors", tab === "discussions" ? "border-b border-page-text text-page-text" : "text-page-text-muted hover:text-page-text")}
            >
              Discussions
            </button>
            <button
              onClick={() => setTab("agencies")}
              className={cn("whitespace-nowrap px-5 py-3 text-sm font-medium tracking-[-0.02em] transition-colors", tab === "agencies" ? "border-b border-page-text text-page-text" : "text-page-text-muted hover:text-page-text")}
            >
              Agencies
            </button>
          </div>

          {/* Thread list */}
          <div className="flex flex-col gap-2">
            {discussions.map((d) => (
              <button key={d.id} onClick={() => setActiveThread(d)} className={cn(cardCls, "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]")}>
                <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-sm font-medium text-page-text">{d.title}</span>
                  <div className="flex items-center gap-1 text-xs text-page-text-subtle">
                    <span>{d.author}</span>
                    <span>&middot;</span>
                    <span>{d.time}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] py-1 pl-1.5 pr-2 dark:border-[rgba(224,224,224,0.03)]">
                  <ChatBubbleIcon className="size-3 text-foreground/50" />
                  <span className="text-xs font-medium text-page-text">{d.replies} replies</span>
                </span>
                {d.hot && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] py-1 pl-1.5 pr-2 dark:border-[rgba(224,224,224,0.03)]">
                    <FireIcon className="size-3" />
                    <span className="text-xs font-medium text-page-text">Hot</span>
                  </span>
                )}
                <ChevronRightIcon />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
