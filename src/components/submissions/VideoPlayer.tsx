"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import {
  PauseIcon, VolumeIcon, VolumeMutedIcon, CaptionIcon, ExpandIcon,
  ShrinkIcon, SubmissionTikTokIcon as TikTokIcon, CloseIcon,
  PaperclipAttachIcon, ChevronDownIcon,
} from "./icons";

function AttachmentDropdown({ onSelect }: { onSelect: (type: "image" | "pdf") => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", handler, { capture: true });
    return () => window.removeEventListener("click", handler, { capture: true });
  }, [open]);

  const PaperclipSvg = (
    <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
      <path d="M0.75 4.75V9.41667C0.75 11.2576 2.24238 12.75 4.08333 12.75C5.92428 12.75 7.41667 11.2576 7.41667 9.41667V2.41667C7.41667 1.49619 6.67047 0.75 5.75 0.75C4.82953 0.75 4.08333 1.49619 4.08333 2.41667V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-[rgba(37,37,37,0.06)] text-[#252525] dark:bg-[rgba(224,224,224,0.03)] dark:text-[#E0E0E0]"
      >
        {PaperclipSvg}
      </button>
      {/* Dropdown — mobile only */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute bottom-full left-0 mb-2 flex w-[256px] flex-col rounded-[12px] border border-foreground/[0.06] bg-white p-1 shadow-[0_2px_4px_rgba(0,0,0,0.06)] md:hidden dark:border-[rgba(224,224,224,0.03)] dark:bg-[#252525]"
          >
            <button
              type="button"
              onClick={() => { onSelect("image"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-[10px] py-2 transition-colors hover:bg-foreground/[0.04] dark:hover:bg-white/[0.06]"
            >
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2.66667C6.76362 2.66667 6.16667 3.26362 6.16667 4C6.16667 4.73638 6.76362 5.33333 7.5 5.33333C8.23638 5.33333 8.83333 4.73638 8.83333 4C8.83333 3.26362 8.23638 2.66667 7.5 2.66667Z" fill="currentColor" className="text-page-text-muted"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M2 0C0.895431 0 0 0.895431 0 2V10C0 11.1046 0.895431 12 2 12H10C11.1046 12 12 11.1046 12 10V2C12 0.895431 11.1046 0 10 0H2ZM7.80474 6.86193L10.6667 9.72386V2C10.6667 1.63181 10.3682 1.33333 10 1.33333H2C1.63181 1.33333 1.33333 1.63181 1.33333 2V7.05719L2.86193 5.5286C3.12228 5.26825 3.54439 5.26825 3.80474 5.5286L6 7.72386L6.86193 6.86193C7.12228 6.60158 7.54439 6.60158 7.80474 6.86193Z" fill="currentColor" className="text-page-text-muted"/>
              </svg>
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text">Media</span>
            </button>
            <button
              type="button"
              onClick={() => { onSelect("pdf"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-[10px] py-2 transition-colors hover:bg-foreground/[0.04] dark:hover:bg-white/[0.06]"
            >
              <svg width="16" height="16" viewBox="0 0 12 14" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M5 0H1.5C0.671573 0 0 0.671573 0 1.5V12.5C0 13.3284 0.671573 14 1.5 14H10.5C11.3284 14 12 13.3284 12 12.5V7H7.5C6.11929 7 5 5.88071 5 4.5V0ZM3 9.5C3 9.22386 3.22386 9 3.5 9H5.5C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10H3.5C3.22386 10 3 9.77614 3 9.5ZM3.5 11C3.22386 11 3 11.2239 3 11.5C3 11.7761 3.22386 12 3.5 12H9C9.27614 12 9.5 11.7761 9.5 11.5C9.5 11.2239 9.27614 11 9 11H3.5Z" fill="currentColor" className="text-page-text-muted"/>
                <path d="M11.7071 5.5L6.5 0.292893V4.5C6.5 5.05228 6.94772 5.5 7.5 5.5H11.7071Z" fill="currentColor" className="text-page-text-muted"/>
              </svg>
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text">File</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FullscreenCommentInput({ formatTime, currentTime }: { formatTime: (s: number) => string; currentTime: number }) {
  const [comment, setComment] = useState("");

  return (
    <div className="flex items-center gap-2">
      {/* Avatar */}
      <img
        src="https://i.pravatar.cc/36?u=outpace"
        alt="Outpace Studios"
        className="size-6 shrink-0 rounded-md border border-foreground/[0.06] object-cover dark:border-[rgba(224,224,224,0.03)]"
      />

      {/* Input pill */}
      <div className="flex h-10 flex-1 items-center gap-2 rounded-full border border-[rgba(37,37,37,0.06)] bg-white px-1 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
        {/* Attachment button */}
        <AttachmentDropdown onSelect={() => {}} />

        {/* Text input */}
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          className="min-w-0 flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-[rgba(37,37,37,0.4)] dark:placeholder:text-[rgba(224,224,224,0.4)]"
        />

        {/* Send button — only when there's text */}
        {comment.trim() && (
          <button
            type="button"
            onClick={() => setComment("")}
            className="flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground px-3 dark:bg-white"
          >
            <span className="font-inter text-xs font-medium whitespace-nowrap tracking-[-0.02em] text-white dark:text-black">
              {formatTime(currentTime)}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Mobile Timeline Drawer ──────────────────────────────────────────

function MobileTimelineDrawer({
  highlightedComment,
  formatTime,
  currentTime,
  onClose,
  open,
  onOpenChange,
}: {
  highlightedComment: string | null;
  formatTime: (s: number) => string;
  currentTime: number;
  onClose: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const drawerOpen = open;
  const setDrawerOpen = onOpenChange;
  const [drawerHeight, setDrawerHeight] = useState(0.45);
  const [locked, setLocked] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const currentHeight = useRef(0.45);

  // Keep ref in sync
  useEffect(() => { currentHeight.current = drawerHeight; }, [drawerHeight]);

  // Lock when fully expanded
  useEffect(() => { setLocked(drawerHeight >= 0.84); }, [drawerHeight]);

  // Reset on close
  useEffect(() => {
    if (!drawerOpen) { setDrawerHeight(0.45); currentHeight.current = 0.45; setLocked(false); }
  }, [drawerOpen]);

  // Header drag — always works (to collapse from locked state)
  const handleHeaderTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragStartHeight.current = currentHeight.current;
  }, []);

  const handleHeaderTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const delta = dragStartY.current - e.touches[0].clientY;
    const vh = window.innerHeight;
    const newH = Math.max(0.1, Math.min(0.85, dragStartHeight.current + delta / vh));
    currentHeight.current = newH;
    setDrawerHeight(newH);
    if (newH < 0.84) setLocked(false);
  }, []);

  const handleHeaderTouchEnd = useCallback(() => {
    const h = currentHeight.current;
    if (h < 0.2) {
      setDrawerOpen(false);
    } else if (h > 0.65) {
      setDrawerHeight(0.85);
      currentHeight.current = 0.85;
    } else {
      setDrawerHeight(0.45);
      currentHeight.current = 0.45;
    }
  }, [setDrawerOpen]);

  // Body drag — only when NOT locked (expands to full)
  const handleBodyTouchStart = useCallback((e: React.TouchEvent) => {
    if (locked) return; // let inner scroll handle it
    dragStartY.current = e.touches[0].clientY;
    dragStartHeight.current = currentHeight.current;
  }, [locked]);

  const handleBodyTouchMove = useCallback((e: React.TouchEvent) => {
    if (locked) return;
    e.preventDefault();
    const delta = dragStartY.current - e.touches[0].clientY;
    const vh = window.innerHeight;
    const newH = Math.max(0.1, Math.min(0.85, dragStartHeight.current + delta / vh));
    currentHeight.current = newH;
    setDrawerHeight(newH);
  }, [locked]);

  const handleBodyTouchEnd = useCallback(() => {
    if (locked) return;
    const h = currentHeight.current;
    if (h < 0.2) {
      setDrawerOpen(false);
    } else if (h > 0.55) {
      setDrawerHeight(0.85);
      currentHeight.current = 0.85;
    } else {
      setDrawerHeight(0.45);
      currentHeight.current = 0.45;
    }
  }, [locked, setDrawerOpen]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStartY.current = e.clientY;
    dragStartHeight.current = currentHeight.current;
    const onMove = (ev: MouseEvent) => {
      const delta = dragStartY.current - ev.clientY;
      const vh = window.innerHeight;
      const newH = Math.max(0.1, Math.min(0.85, dragStartHeight.current + delta / vh));
      currentHeight.current = newH;
      setDrawerHeight(newH);
    };
    const onUp = () => {
      const h = currentHeight.current;
      if (h < 0.2) {
        setDrawerOpen(false);
      } else if (h > 0.65) {
        setDrawerHeight(0.85);
        currentHeight.current = 0.85;
      } else {
        setDrawerHeight(0.45);
        currentHeight.current = 0.45;
      }
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [setDrawerOpen]);

  return (
    <div className="absolute inset-x-0 bottom-0 z-[5] flex flex-col md:hidden">
      {/* Expanded drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="flex flex-col overflow-hidden rounded-t-[20px] bg-card-bg dark:bg-[#161616]"
            style={{ height: `${drawerHeight * 100}dvh` }}
          >
            {/* Drag handle + header — always draggable to collapse */}
            <div
              className="flex shrink-0 cursor-grab flex-col items-center border-b border-foreground/[0.06] px-4 pb-3 pt-2 active:cursor-grabbing dark:border-[rgba(224,224,224,0.03)]"
              onTouchStart={handleHeaderTouchStart}
              onTouchMove={handleHeaderTouchMove}
              onTouchEnd={handleHeaderTouchEnd}
              onMouseDown={handleMouseDown}
            >
              <div className="mb-2 h-1 w-8 rounded-full bg-foreground/20" />
              <div className="flex w-full items-center justify-between">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Timeline</span>
                <div className="flex items-center gap-1">
                  <button className="flex size-8 cursor-pointer items-center justify-center rounded-xl bg-foreground/[0.06]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-page-text" />
                    </svg>
                  </button>
                  <button
                    className="flex size-8 cursor-pointer items-center justify-center rounded-xl"
                    onClick={() => { setDrawerOpen(false); setDrawerHeight(0.45); }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 4.5L6 7.5L3 4.5" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" className="text-page-text" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline events — scrollable only when locked/expanded */}
            <div
              className={cn("scrollbar-hide flex min-h-0 flex-1 flex-col gap-4 px-4 py-4", locked ? "overflow-y-auto" : "overflow-hidden")}
              onTouchStart={handleBodyTouchStart}
              onTouchMove={handleBodyTouchMove}
              onTouchEnd={handleBodyTouchEnd}
            >
              <TimelineEvent id="event-posted" avatar="https://i.pravatar.cc/36?u=xkaizen" actorType="creator" name="xKaizen" time="Tue 24 Feb 4:37 AM" highlighted={highlightedComment === "event-posted"} actionContent={<div className="flex items-center gap-1 pl-6"><PlatformIcon platform="tiktok" size={12} className="shrink-0 text-page-text-muted" /><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">Posted video</span></div>} connector="straight" />
              <TimelineEvent id="event-submitted" avatar="https://i.pravatar.cc/36?u=xkaizen" actorType="creator" name="xKaizen" time="Wed 25 Feb 12:37 AM" highlighted={highlightedComment === "event-submitted"} actionContent={<div className="flex items-center gap-1 pl-6"><TimelineUploadIcon /><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">Submitted video</span></div>} connector="straight" />
              <TimelineEvent id="comment-00:08" avatar="https://i.pravatar.cc/36?u=outpace" actorType="brand" name="Outpace Studios" time="Wed 25 Feb 1:21 AM" highlighted={highlightedComment === "comment-00:08"} actionContent={<div className="flex items-center gap-1 pl-6"><span className="shrink-0 rounded-full border border-foreground/[0.06] bg-white px-1.5 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-subtle dark:bg-card-bg">00:08</span><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">You&apos;re mentioning the wrong competitor</span></div>} connector="l-shape" />
              <TimelineEvent id="reply-00:08" avatar="https://i.pravatar.cc/36?u=xkaizen" actorType="creator" name="xKaizen" time="Wed 25 Feb 2:56 AM" indent highlighted={highlightedComment === "reply-00:08"} actionContent={<div className="flex items-center gap-1 pl-6"><span className="shrink-0 rounded-full border border-foreground/[0.06] bg-white px-1.5 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-subtle dark:bg-card-bg">00:08</span><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">Fixed!</span></div>} connector="reply-straight" />
              <TimelineEvent id="reply-approve" avatar="https://i.pravatar.cc/36?u=outpace" actorType="brand" name="Outpace Studios" time="Wed 25 Feb 3:18 AM" indent highlighted={highlightedComment === "reply-approve"} actionContent={<><div className="flex flex-col gap-0.5 pl-6"><div className="flex items-center gap-1"><span className="shrink-0 rounded-full border border-foreground/[0.06] bg-white px-1.5 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-subtle dark:bg-card-bg">00:21</span><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">Looking good now sir! approving and</span></div><span className="pl-0 font-inter text-sm leading-[150%] tracking-[-0.02em] text-page-text-subtle">the payout should be otw.</span></div><div className="flex items-center gap-3 pl-6 pt-2"><InlinePdfThumb /><InlinePdfThumb /></div></>} />
              <TimelineEvent id="event-approved" avatar="https://i.pravatar.cc/36?u=outpace" actorType="brand" name="Outpace Studios" time="Wed 25 Feb 3:19 AM" highlighted={highlightedComment === "event-approved"} actionContent={<div className="flex items-center gap-1 pl-6"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0Zm2.83 4.71-3.17 3.17a.5.5 0 0 1-.71 0L3.17 6.1a.5.5 0 0 1 .71-.71l1.42 1.42 2.82-2.82a.5.5 0 0 1 .71.71Z" fill="#00994D" /></svg><span className="font-inter text-sm tracking-[-0.02em] text-[#34D399]">Approved video</span></div>} />
            </div>

            {/* Comment input + actions */}
            <div className="flex shrink-0 flex-col gap-2 border-t border-foreground/[0.06] p-3 dark:border-[rgba(224,224,224,0.03)]">
              <FullscreenCommentInput formatTime={formatTime} currentTime={currentTime} />
              <div className="flex gap-2">
                <button className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[rgba(255,37,37,0.06)] transition-colors hover:bg-[rgba(251,113,133,0.12)]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM5.64645 5.64645C5.84171 5.45118 6.15829 5.45118 6.35355 5.64645L8 7.29289L9.64645 5.64645C9.84171 5.45118 10.1583 5.45118 10.3536 5.64645C10.5488 5.84171 10.5488 6.15829 10.3536 6.35355L8.70711 8L10.3536 9.64645C10.5488 9.84171 10.5488 10.1583 10.3536 10.3536C10.1583 10.5488 9.84171 10.5488 9.64645 10.3536L8 8.70711L6.35355 10.3536C6.15829 10.5488 5.84171 10.5488 5.64645 10.3536C5.45118 10.1583 5.45118 9.84171 5.64645 9.64645L7.29289 8L5.64645 6.35355C5.45118 6.15829 5.45118 5.84171 5.64645 5.64645Z" fill="#FB7185"/></svg><span className="font-inter text-sm font-medium tracking-[-0.02em] text-[#FB7185]">Reject</span></button>
                <button className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground/[0.03] transition-colors hover:bg-foreground/[0.06]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM11.3536 6.35355C11.5488 6.15829 11.5488 5.84171 11.3536 5.64645C11.1583 5.45118 10.8417 5.45118 10.6464 5.64645L7 9.29289L5.35355 7.64645C5.15829 7.45118 4.84171 7.45118 4.64645 7.64645C4.45118 7.84171 4.45118 8.15829 4.64645 8.35355L6.64645 10.3536C6.84171 10.5488 7.15829 10.5488 7.35355 10.3536L11.3536 6.35355Z" fill="currentColor"/></svg><span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Approve</span></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ── Video Player ────────────────────────────────────────────────────

export function VideoPlayer({
  src,
  platform,
  duration,
  showChat,
}: {
  src: string;
  platform: "tiktok" | "instagram";
  duration: string;
  showChat?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const fsBgVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [hoveredSpeed, setHoveredSpeed] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.75);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [highlightedComment, setHighlightedComment] = useState<string | null>(null);

  // Scroll to highlighted comment and auto-clear after 2s
  useEffect(() => {
    if (!highlightedComment) return;
    const el = document.querySelector(`[data-comment-id="${highlightedComment}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    const timer = setTimeout(() => setHighlightedComment(null), 2000);
    return () => clearTimeout(timer);
  }, [highlightedComment]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const volumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  const syncBg = useCallback(() => {
    const bg = bgVideoRef.current;
    const main = videoRef.current;
    if (bg && main) bg.currentTime = main.currentTime;
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    const bg = bgVideoRef.current;
    const fsBg = fsBgVideoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      if (bg) { bg.currentTime = video.currentTime; bg.play(); }
      if (fsBg) { fsBg.currentTime = video.currentTime; fsBg.play(); }
      setIsPlaying(true);
    } else {
      video.pause();
      if (bg) bg.pause();
      if (fsBg) fsBg.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setTotalDuration(video.duration);
    setIsLandscape(video.videoWidth > video.videoHeight);
  }, []);

  const progressRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  const seekTo = useCallback((clientX: number) => {
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !video.duration || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = pct * video.duration;
    syncBg();
  }, [syncBg]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    seekTo(e.clientX);
    const onMouseMove = (ev: MouseEvent) => {
      seekTo(ev.clientX);
      // update hover during drag too
      const bar = progressRef.current;
      if (bar) {
        const rect = bar.getBoundingClientRect();
        setHoverPct(Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)));
      }
    };
    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [seekTo]);

  // Touch handlers for progress bar (mobile scrubbing)
  const handleBarTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    isDragging.current = true;
    seekTo(e.touches[0].clientX);
  }, [seekTo]);

  const handleBarTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    seekTo(e.touches[0].clientX);
    const bar = progressRef.current;
    if (bar) {
      const rect = bar.getBoundingClientRect();
      setHoverPct(Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width)));
    }
  }, [seekTo]);

  const handleBarTouchEnd = useCallback(() => {
    isDragging.current = false;
    setHoverPct(null);
  }, []);

  const handleBarMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPct(pct);

    // Draw thumbnail preview from video
    const video = videoRef.current;
    const canvas = previewCanvasRef.current;
    if (video && canvas && video.duration) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const pw = isLandscape ? 71 : 40;
        const ph = isLandscape ? 40 : 71;
        canvas.width = pw;
        canvas.height = ph;
        const targetTime = pct * video.duration;
        // Only draw if we're near the current time (seeking is async)
        if (Math.abs(video.currentTime - targetTime) < 1) {
          ctx.drawImage(video, 0, 0, pw, ph);
        }
      }
    }
  }, []);

  const handleBarMouseLeave = useCallback(() => {
    if (!isDragging.current) setHoverPct(null);
  }, []);

  const SPEEDS = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0];

  const handleSpeedChange = useCallback((s: number) => {
    setSpeed(s);
    setSpeedOpen(false);
    const video = videoRef.current;
    if (video) video.playbackRate = s;
  }, []);

  const handleVolumeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = volumeBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pct);
    const video = videoRef.current;
    if (video) {
      video.volume = pct;
      video.muted = pct === 0;
    }
  }, []);

  const volumeFillRef = useRef<HTMLDivElement>(null);

  const applyVolume = useCallback((clientX: number) => {
    const bar = volumeBarRef.current;
    if (!bar) return 0;
    const r = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    if (volumeFillRef.current) volumeFillRef.current.style.width = `${pct * 100}%`;
    const video = videoRef.current;
    if (video) { video.volume = pct; video.muted = pct === 0; }
    return pct;
  }, []);

  const handleVolumeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    applyVolume(e.clientX);
    const onMove = (ev: MouseEvent) => applyVolume(ev.clientX);
    const onUp = (ev: MouseEvent) => {
      setVolume(applyVolume(ev.clientX));
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [applyVolume]);

  const openVolume = useCallback(() => {
    if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current);
    setVolumeOpen(true);
  }, []);

  const closeVolumeDelayed = useCallback(() => {
    volumeTimerRef.current = setTimeout(() => setVolumeOpen(false), 300);
  }, []);

  // Close speed menu on outside click
  useEffect(() => {
    if (!speedOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-speed-menu]")) setSpeedOpen(false);
    };
    window.addEventListener("click", handler, { capture: true });
    return () => window.removeEventListener("click", handler, { capture: true });
  }, [speedOpen]);

  // ESC closes fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Sync playback state when videoRef switches between inline/fullscreen elements
  const prevFullscreen = useRef(false);
  const savedTime = useRef(0);
  useEffect(() => {
    if (prevFullscreen.current === isFullscreen) return;
    // Save current time before the ref switches
    savedTime.current = currentTime;
    prevFullscreen.current = isFullscreen;

    const syncVideo = () => {
      const v = videoRef.current;
      if (!v) return;

      const applyState = () => {
        v.currentTime = savedTime.current;
        v.playbackRate = speed;
        v.volume = volume;
        v.muted = volume === 0;
        if (isPlaying) v.play().catch(() => {});

        // Sync fullscreen background blur video
        const fsBg = fsBgVideoRef.current;
        if (fsBg) {
          fsBg.currentTime = savedTime.current;
          fsBg.playbackRate = speed;
          if (isPlaying) fsBg.play().catch(() => {});
        }
      };

      // If video is ready, sync immediately; otherwise wait for it
      if (v.readyState >= 2) {
        applyState();
      } else {
        v.addEventListener("canplay", applyState, { once: true });
      }
    };

    // Wait a frame for React to attach the ref to the new element
    requestAnimationFrame(syncVideo);
  }, [isFullscreen]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
    {/* Custom fullscreen overlay — portalled to body to escape overflow:hidden ancestors */}
    {typeof document !== "undefined" && createPortal(
    <AnimatePresence>
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-black md:flex-row"
        >
          {/* Full-screen blurred background — synced with playback */}
          <video ref={fsBgVideoRef} src={src} className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover" style={{ filter: "blur(50px)" }} muted playsInline loop />
          <div className="pointer-events-none absolute inset-0 z-0 bg-black/40" />

          {/* Video — takes full screen on mobile, left side on desktop */}
          <div className="relative z-[1] flex min-h-0 flex-1 flex-col p-2">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[20px] bg-black">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[120px]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)" }} />
              <video
                ref={isFullscreen ? videoRef : undefined}
                src={src}
                className={cn(
                  isLandscape
                    ? "relative z-[1] h-full w-full rounded-[20px] object-contain"
                    : "h-full object-cover",
                )}
                style={{ aspectRatio: isLandscape ? undefined : "9/16" }}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                playsInline
                loop
              />
              <div className="absolute left-3 top-3 z-[3]"><div className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]"><PlatformIcon platform={platform} size={16} className="text-white [&_path]:fill-white" /></div></div>
              {/* Mobile close button */}
              <button className="absolute right-3 top-3 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-[12px] md:hidden" onClick={() => setIsFullscreen(false)}><CloseIcon size={14} /></button>
              <div className="absolute inset-0 z-[2] cursor-pointer" onClick={togglePlay} />
              <div className="absolute inset-x-0 bottom-0 z-[3] flex flex-col gap-[6px]" onClick={(e) => e.stopPropagation()}>
                {/* Progress bar */}
                <div
                  ref={progressRef}
                  className="group relative flex h-6 cursor-pointer items-center px-3"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleBarMouseMove}
                  onMouseLeave={handleBarMouseLeave}
                  onTouchStart={handleBarTouchStart}
                  onTouchMove={handleBarTouchMove}
                  onTouchEnd={handleBarTouchEnd}
                >
                  {/* Hover preview tooltip */}
                  {hoverPct !== null && (
                    <div
                      className="pointer-events-none absolute bottom-6 flex -translate-x-1/2 flex-col items-center gap-1"
                      style={{ left: `${hoverPct * 100}%` }}
                    >
                      <div className="flex items-center overflow-hidden rounded-lg border-2 border-white/40 backdrop-blur-[12px]">
                        <canvas ref={previewCanvasRef} className="block" width={isLandscape ? 107 : 60} height={isLandscape ? 60 : 107} style={{ width: isLandscape ? 107 : 60, height: isLandscape ? 60 : 107 }} />
                      </div>
                      <div className="flex items-center rounded-full bg-white/20 px-2 py-[3px] backdrop-blur-[12px]">
                        <span className="font-inter text-xs tracking-[-0.02em] text-white">{formatTime(hoverPct * totalDuration)}</span>
                      </div>
                    </div>
                  )}
                  {/* Track + comment markers wrapper */}
                  <div className="relative h-1 w-full">
                    {/* Track bar */}
                    <div className="absolute inset-0 rounded-full bg-white/20">
                      {hoverPct !== null && hoverPct * 100 > progress && (
                        <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${hoverPct * 100}%`, background: "rgba(255,255,255,0.4)" }} />
                      )}
                      <div className="absolute left-0 top-0 h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
                    </div>
                    {/* Thumb */}
                    <div className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${progress}%` }}>
                      <svg width="6" height="12" viewBox="0 0 6 12" fill="none"><rect width="6" height="12" rx="3" fill="white"/></svg>
                    </div>
                    {/* Comment markers */}
                    {totalDuration > 0 && (
                      <>
                        <TimelineCommentMarker
                          timestamp={8}
                          totalDuration={totalDuration}
                          brandAvatar="https://i.pravatar.cc/36?u=outpace"
                          brandName="Outpace Studios"
                          creatorAvatar="https://i.pravatar.cc/36?u=xkaizen"
                          creatorName="xKaizen"
                          commentId="comment-00:08"
                          onClick={(id) => setHighlightedComment(id)}
                        />
                        <TimelineCommentMarker
                          timestamp={21}
                          totalDuration={totalDuration}
                          brandAvatar="https://i.pravatar.cc/36?u=outpace"
                          brandName="Outpace Studios"
                          commentId="reply-approve"
                          onClick={(id) => setHighlightedComment(id)}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-1.5">
                    {/* Play/Pause */}
                    <button onClick={togglePlay} className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                      {isPlaying ? (
                        <svg width="14" height="16" viewBox="0 0 8 9" fill="none">
                          <path d="M0 1.5C0 0.671573 0.671573 0 1.5 0C2.32843 0 3 0.671573 3 1.5V7.5C3 8.32843 2.32843 9 1.5 9C0.671573 9 0 8.32843 0 7.5V1.5Z" fill="white"/>
                          <path d="M5 1.5C5 0.671573 5.67157 0 6.5 0C7.32843 0 8 0.671573 8 1.5V7.5C8 8.32843 7.32843 9 6.5 9C5.67157 9 5 8.32843 5 7.5V1.5Z" fill="white"/>
                        </svg>
                      ) : (
                        <svg width="14" height="16" viewBox="-1 0 16 18" fill="none">
                          <path d="M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z" fill="white" />
                        </svg>
                      )}
                    </button>
                    {/* Volume with expandable slider */}
                    <div className="relative flex items-center" onMouseEnter={openVolume} onMouseLeave={closeVolumeDelayed}>
                      <motion.div
                        className="flex h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-white/20 backdrop-blur-[12px]"
                        animate={{ width: volumeOpen ? 110 : 40, paddingLeft: 12, paddingRight: volumeOpen ? 10 : 12 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      >
                        <button
                          className="flex shrink-0 cursor-pointer items-center justify-center"
                          onClick={() => {
                            const video = videoRef.current;
                            if (!video) return;
                            if (video.muted || volume === 0) { video.muted = false; video.volume = 0.75; setVolume(0.75); }
                            else { video.muted = true; setVolume(0); }
                          }}
                        >
                          {volume === 0 ? (
                            <svg width="16" height="14" viewBox="0 0 11 9" fill="none"><path d="M6 0.751362C6 0.133328 5.29443 -0.219458 4.8 0.151361L2.46667 1.90136C2.38012 1.96627 2.27485 2.00136 2.16667 2.00136H1.5C0.671573 2.00136 0 2.67293 0 3.50136V5.50136C0 6.32979 0.671573 7.00136 1.5 7.00136H2.16667C2.27485 7.00136 2.38012 7.03645 2.46667 7.10136L4.8 8.85136C5.29443 9.22218 6 8.8694 6 8.25136V0.751362Z" fill="white"/><path d="M8.35355 2.85489C8.15829 2.65963 7.84171 2.65963 7.64645 2.85489C7.45118 3.05015 7.45118 3.36674 7.64645 3.562L9.08579 5.00133L7.64645 6.44067C7.45118 6.63593 7.45118 6.95251 7.64645 7.14778C7.84171 7.34304 8.15829 7.34304 8.35355 7.14778L9.79289 5.70844L11.2322 7.14778C11.4275 7.34304 11.7441 7.34304 11.9393 7.14778C12.1346 6.95251 12.1346 6.63593 11.9393 6.44067L10.5 5.00133L11.9393 3.562C12.1346 3.36674 12.1346 3.05015 11.9393 2.85489C11.7441 2.65963 11.4275 2.65963 11.2322 2.85489L9.79289 4.29423L8.35355 2.85489Z" fill="white"/></svg>
                          ) : (
                            <svg width="16" height="14" viewBox="0 0 11 9" fill="none"><path d="M6 0.751362C6 0.133328 5.29443 -0.219458 4.8 0.151361L2.46667 1.90136C2.38012 1.96627 2.27485 2.00136 2.16667 2.00136H1.5C0.671573 2.00136 0 2.67293 0 3.50136V5.50136C0 6.32979 0.671573 7.00136 1.5 7.00136H2.16667C2.27485 7.00136 2.38012 7.03645 2.46667 7.10136L4.8 8.85136C5.29443 9.22218 6 8.8694 6 8.25136V0.751362Z" fill="white"/><path d="M9.38908 0.612652C9.19381 0.41739 8.87723 0.41739 8.68197 0.612652C8.48671 0.807914 8.48671 1.1245 8.68197 1.31976C9.49686 2.13465 9.99999 3.25896 9.99999 4.50174C9.99999 5.74452 9.49686 6.86883 8.68197 7.68372C8.48671 7.87898 8.48671 8.19556 8.68197 8.39083C8.87723 8.58609 9.19381 8.58609 9.38908 8.39083C10.3838 7.39607 11 6.02038 11 4.50174C11 2.98309 10.3838 1.60741 9.38908 0.612652Z" fill="white"/><path d="M7.7981 2.20347C7.60284 2.00821 7.28626 2.00821 7.091 2.20347C6.89573 2.39873 6.89573 2.71532 7.091 2.91058C7.49871 3.3183 7.75001 3.88011 7.75001 4.50157C7.75001 5.12303 7.49871 5.68484 7.091 6.09256C6.89573 6.28782 6.89573 6.6044 7.091 6.79967C7.28626 6.99493 7.60284 6.99493 7.7981 6.79967C8.38569 6.21208 8.75001 5.39889 8.75001 4.50157C8.75001 3.60424 8.38569 2.79106 7.7981 2.20347Z" fill="white"/></svg>
                          )}
                        </button>
                        <AnimatePresence>
                          {volumeOpen && (
                            <motion.div
                              initial={{ opacity: 0, scaleX: 0 }}
                              animate={{ opacity: 1, scaleX: 1 }}
                              exit={{ opacity: 0, scaleX: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 35 }}
                              style={{ transformOrigin: "left" }}
                              className="relative flex-1 cursor-pointer"
                              ref={volumeBarRef}
                              onMouseDown={handleVolumeMouseDown}
                            >
                              <div className="h-1.5 w-full rounded-full bg-white/20">
                                <div ref={volumeFillRef} className="h-full rounded-full bg-white/40" style={{ width: `${volume * 100}%` }} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    {/* Comment / Timeline toggle */}
                    <button
                      className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]"
                      onClick={() => setMobileDrawerOpen((o) => !o)}
                    >
                      <svg width="16" height="16" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M10 1.5C10 0.671573 9.32843 0 8.5 0H1.5C0.671573 0 0 0.671573 0 1.5V6.5C0 7.32843 0.671573 8 1.5 8H2V9C2 9.18014 2.0969 9.34635 2.25365 9.4351C2.41041 9.52385 2.60278 9.52143 2.75725 9.42875L5.13849 8H8.5C9.32843 8 10 7.32843 10 6.5V1.5ZM2.1239 4C2.1239 4.34518 2.40372 4.625 2.7489 4.625C3.09408 4.625 3.3739 4.34518 3.3739 4C3.3739 3.65482 3.09408 3.375 2.7489 3.375C2.40372 3.375 2.1239 3.65482 2.1239 4ZM4.3739 4C4.3739 4.34518 4.65372 4.625 4.9989 4.625C5.34408 4.625 5.6239 4.34518 5.6239 4C5.6239 3.65482 5.34408 3.375 4.9989 3.375C4.65372 3.375 4.3739 3.65482 4.3739 4ZM7.2489 4.625C6.90372 4.625 6.6239 4.34518 6.6239 4C6.6239 3.65482 6.90372 3.375 7.2489 3.375C7.59408 3.375 7.8739 3.65482 7.8739 4C7.8739 4.34518 7.59408 4.625 7.2489 4.625Z" fill="white"/></svg>
                    </button>
                  </div>
                  <div className="flex items-center rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-[12px]">
                    <span className="font-inter text-xs tracking-[-0.02em] text-white">{formatTime(currentTime)} / {duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Speed */}
                    <div className="relative" data-speed-menu>
                      <button onClick={() => setSpeedOpen((o) => !o)} className="flex h-10 cursor-pointer items-center justify-center gap-[1px] rounded-full bg-white/20 px-4 backdrop-blur-[12px]">
                        <span className="font-inter text-sm font-medium tracking-[0.1px] text-white">{speed.toFixed(1)}</span>
                        <span className="font-inter text-sm tracking-[0.1px] text-white/50">x</span>
                      </button>
                    </div>
                    {/* Shrink — inverse of ExpandIcon */}
                    <button className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]" onClick={() => setIsFullscreen(false)}>
                      <svg width="14" height="14" viewBox="0 0 9 9" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.85355 0.146447C9.04882 0.341709 9.04882 0.658291 8.85355 0.853553L6.70711 3H8.5C8.77614 3 9 3.22386 9 3.5C9 3.77614 8.77614 4 8.5 4H5.5C5.22386 4 5 3.77614 5 3.5V0.5C5 0.223858 5.22386 0 5.5 0C5.77614 0 6 0.223858 6 0.5V2.29289L8.14645 0.146447C8.34171 -0.0488155 8.65829 -0.0488155 8.85355 0.146447ZM0.146447 8.85355C-0.0488155 8.65829 -0.0488155 8.34171 0.146447 8.14645L2.29289 6H0.5C0.223858 6 0 5.77614 0 5.5C0 5.22386 0.223858 5 0.5 5H3.5C3.77614 5 4 5.22386 4 5.5V8.5C4 8.77614 3.77614 9 3.5 9C3.22386 9 3 8.77614 3 8.5V6.70711L0.853553 8.85355C0.658291 9.04882 0.341709 9.04882 0.146447 8.85355Z" fill="white"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Speed popup — outside overflow-hidden video container */}
            <AnimatePresence>
              {speedOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute bottom-16 right-4 z-[10] flex w-[128px] flex-col rounded-[12px] bg-[rgba(51,51,51,0.9)] p-1 backdrop-blur-[12px]"
                  onMouseLeave={() => setHoveredSpeed(null)}
                  data-speed-menu
                >
                  <div className="px-[10px] py-2">
                    <span className="font-inter text-xs tracking-[-0.02em] text-white/50">Speed</span>
                  </div>
                  <div className="relative flex flex-col">
                    {hoveredSpeed !== null && hoveredSpeed !== speed && (
                      <motion.div
                        className="pointer-events-none absolute inset-x-0 h-7 rounded-lg bg-white/10"
                        layout
                        transition={{ type: "spring", stiffness: 800, damping: 40 }}
                        style={{ top: SPEEDS.indexOf(hoveredSpeed) * 28 }}
                      />
                    )}
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        onMouseEnter={() => setHoveredSpeed(s)}
                        className={cn(
                          "relative z-[1] flex cursor-pointer items-center gap-3 px-[10px] py-2 text-left",
                          s === speed && "rounded-lg bg-white/20",
                        )}
                      >
                        <div className="flex flex-1 items-center gap-[1px]">
                          <span className="font-inter text-xs font-medium leading-none tracking-[0.1px] text-white">{s.toFixed(1)}</span>
                          <span className="font-inter text-xs font-normal leading-none tracking-[0.1px] text-white/50">x</span>
                        </div>
                        {s === speed && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* ── Desktop: Timeline sidebar ── */}
          <div className="relative z-[1] hidden shrink-0 flex-col justify-end p-2 md:flex md:w-[320px] lg:w-[400px]">
            <div className="flex flex-1 flex-col overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[#161616]">
              <div className="flex items-center justify-between border-b border-foreground/[0.06] px-5 py-4 dark:border-[rgba(224,224,224,0.03)]">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Timeline</span>
                <div className="flex items-center gap-1">
                  <button className="flex size-9 cursor-pointer items-center justify-center rounded-xl bg-foreground/[0.06]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-page-text" />
                    </svg>
                  </button>
                  <button className="flex size-9 cursor-pointer items-center justify-center rounded-xl" onClick={() => setIsFullscreen(false)}><CloseIcon size={16} /></button>
                </div>
              </div>
              <div className="scrollbar-hide flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
                <TimelineEvent id="event-posted" avatar="https://i.pravatar.cc/36?u=xkaizen" actorType="creator" name="xKaizen" time="Tue 24 Feb 4:37 AM" highlighted={highlightedComment === "event-posted"} actionContent={<div className="flex items-center gap-1 pl-6"><PlatformIcon platform="tiktok" size={12} className="shrink-0 text-page-text-muted" /><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">Posted video</span></div>} connector="straight" />
                <TimelineEvent id="event-submitted" avatar="https://i.pravatar.cc/36?u=xkaizen" actorType="creator" name="xKaizen" time="Wed 25 Feb 12:37 AM" highlighted={highlightedComment === "event-submitted"} actionContent={<div className="flex items-center gap-1 pl-6"><TimelineUploadIcon /><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">Submitted video</span></div>} connector="straight" />
                <TimelineEvent id="comment-00:08" avatar="https://i.pravatar.cc/36?u=outpace" actorType="brand" name="Outpace Studios" time="Wed 25 Feb 1:21 AM" highlighted={highlightedComment === "comment-00:08"} actionContent={<div className="flex items-center gap-1 pl-6"><span className="shrink-0 rounded-full border border-foreground/[0.06] bg-white px-1.5 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-subtle dark:bg-card-bg">00:08</span><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">You&apos;re mentioning the wrong competitor</span></div>} connector="l-shape" />
                <TimelineEvent id="reply-00:08" avatar="https://i.pravatar.cc/36?u=xkaizen" actorType="creator" name="xKaizen" time="Wed 25 Feb 2:56 AM" indent highlighted={highlightedComment === "reply-00:08"} actionContent={<div className="flex items-center gap-1 pl-6"><span className="shrink-0 rounded-full border border-foreground/[0.06] bg-white px-1.5 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-subtle dark:bg-card-bg">00:08</span><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">Fixed!</span></div>} connector="reply-straight" />
                <TimelineEvent id="reply-approve" avatar="https://i.pravatar.cc/36?u=outpace" actorType="brand" name="Outpace Studios" time="Wed 25 Feb 3:18 AM" indent highlighted={highlightedComment === "reply-approve"} actionContent={<><div className="flex flex-col gap-0.5 pl-6"><div className="flex items-center gap-1"><span className="shrink-0 rounded-full border border-foreground/[0.06] bg-white px-1.5 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-subtle dark:bg-card-bg">00:21</span><span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle">Looking good now sir! approving and</span></div><span className="pl-0 font-inter text-sm leading-[150%] tracking-[-0.02em] text-page-text-subtle">the payout should be otw.</span></div><div className="flex items-center gap-3 pl-6 pt-2"><InlinePdfThumb /><InlinePdfThumb /></div></>} />
                <TimelineEvent id="event-approved" avatar="https://i.pravatar.cc/36?u=outpace" actorType="brand" name="Outpace Studios" time="Wed 25 Feb 3:19 AM" highlighted={highlightedComment === "event-approved"} actionContent={<div className="flex items-center gap-1 pl-6"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0Zm2.83 4.71-3.17 3.17a.5.5 0 0 1-.71 0L3.17 6.1a.5.5 0 0 1 .71-.71l1.42 1.42 2.82-2.82a.5.5 0 0 1 .71.71Z" fill="#00994D" /></svg><span className="font-inter text-sm tracking-[-0.02em] text-[#34D399]">Approved video</span></div>} />
              </div>
              <div className="flex flex-col gap-2 border-t border-foreground/[0.06] p-4 dark:border-[rgba(224,224,224,0.03)]">
                <FullscreenCommentInput formatTime={formatTime} currentTime={currentTime} />
                <div className="flex gap-2">
                  <button className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[rgba(255,37,37,0.06)] transition-colors hover:bg-[rgba(251,113,133,0.12)]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM5.64645 5.64645C5.84171 5.45118 6.15829 5.45118 6.35355 5.64645L8 7.29289L9.64645 5.64645C9.84171 5.45118 10.1583 5.45118 10.3536 5.64645C10.5488 5.84171 10.5488 6.15829 10.3536 6.35355L8.70711 8L10.3536 9.64645C10.5488 9.84171 10.5488 10.1583 10.3536 10.3536C10.1583 10.5488 9.84171 10.5488 9.64645 10.3536L8 8.70711L6.35355 10.3536C6.15829 10.5488 5.84171 10.5488 5.64645 10.3536C5.45118 10.1583 5.45118 9.84171 5.64645 9.64645L7.29289 8L5.64645 6.35355C5.45118 6.15829 5.45118 5.84171 5.64645 5.64645Z" fill="#FB7185"/></svg><span className="font-inter text-sm font-medium tracking-[-0.02em] text-[#FB7185]">Reject</span></button>
                  <button className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground/[0.03] transition-colors hover:bg-foreground/[0.06]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM11.3536 6.35355C11.5488 6.15829 11.5488 5.84171 11.3536 5.64645C11.1583 5.45118 10.8417 5.45118 10.6464 5.64645L7 9.29289L5.35355 7.64645C5.15829 7.45118 4.84171 7.45118 4.64645 7.64645C4.45118 7.84171 4.45118 8.15829 4.64645 8.35355L6.64645 10.3536C6.84171 10.5488 7.15829 10.5488 7.35355 10.3536L11.3536 6.35355Z" fill="currentColor"/></svg><span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Approve</span></button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile: Timeline drawer (overlays from bottom) ── */}
          <MobileTimelineDrawer
            highlightedComment={highlightedComment}
            formatTime={formatTime}
            currentTime={currentTime}
            onClose={() => setIsFullscreen(false)}
            open={mobileDrawerOpen}
            onOpenChange={setMobileDrawerOpen}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
    )}

    <div className="flex h-full flex-col p-1 pl-1">
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[20px]">
        {/* Blurred background for landscape videos */}
        {isLandscape && (
          <>
            <video
              ref={bgVideoRef}
              src={src}
              className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover"
              style={{ filter: "blur(50px)" }}
              muted
              playsInline
              loop
            />
            <div className="pointer-events-none absolute inset-0 z-0 bg-black/20" />
          </>
        )}
        {/* Gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 68.18%, rgba(0, 0, 0, 0.4) 100%)",
          }}
        />
        <video
          ref={!isFullscreen ? videoRef : undefined}
          src={src}
          className={cn(
            isLandscape
              ? "relative z-[1] w-full object-contain"
              : "h-full w-full object-cover",
          )}
          style={{ aspectRatio: isLandscape ? "16/9" : "9/16" }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          playsInline
          muted
          loop
        />

        {/* Overlay controls — hidden when fullscreen to avoid ref conflicts */}
        {!isFullscreen && <div className="absolute inset-0 z-[2] flex cursor-pointer flex-col justify-between p-2" onClick={togglePlay}>
          {/* Top bar */}
          <div className="relative flex items-center justify-center gap-2">
            {/* Platform icon — absolute left */}
            <div className="absolute left-0 top-0 z-[1] flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
              <PlatformIcon platform={platform} size={12} className="text-white [&_path]:fill-white" />
            </div>
            {/* Duration pill — centered */}
            <div className="flex items-center rounded-full bg-white/20 px-2 py-[3px] backdrop-blur-[12px]">
              <span className="font-inter text-xs tracking-[-0.02em] text-white">{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Progress bar */}
            <div
              ref={progressRef}
              className="group relative flex h-5 cursor-pointer items-center"
              onMouseDown={handleMouseDown}
              onMouseMove={handleBarMouseMove}
              onMouseLeave={handleBarMouseLeave}
              onTouchStart={handleBarTouchStart}
              onTouchMove={handleBarTouchMove}
              onTouchEnd={handleBarTouchEnd}
            >
              {/* Hover preview tooltip */}
              {hoverPct !== null && (
                <div
                  className="pointer-events-none absolute bottom-5 -translate-x-1/2 flex flex-col items-center gap-1"
                  style={{ left: `${hoverPct * 100}%` }}
                >
                  {/* Thumbnail */}
                  <div className="flex items-center rounded-lg border-2 border-white/40 backdrop-blur-[12px] overflow-hidden">
                    <canvas
                      ref={previewCanvasRef}
                      className="block"
                      width={isLandscape ? 71 : 40}
                      height={isLandscape ? 40 : 71}
                      style={{ width: isLandscape ? 71 : 40, height: isLandscape ? 40 : 71 }}
                    />
                  </div>
                  {/* Time pill */}
                  <div className="flex items-center rounded-full bg-white/20 px-2 py-[3px] backdrop-blur-[12px]">
                    <span className="font-inter text-xs tracking-[-0.02em] text-white">
                      {formatTime((hoverPct) * totalDuration)}
                    </span>
                  </div>
                </div>
              )}

              {/* Segmented track */}
              <div className="flex h-1 w-full items-center gap-[2px]">
                {/* Played segment */}
                <div className="relative h-full rounded-full bg-white/[0.08]" style={{ width: `${progress}%` }}>
                  <div className="h-full w-full rounded-full bg-white" style={{ borderRadius: "999px 0 0 999px" }} />
                </div>
                {/* Thumb */}
                <div className="shrink-0">
                  <div className="h-3 w-[6px] rounded-full bg-white" />
                </div>
                {/* Remaining segment */}
                <div className="h-full flex-1 rounded-full bg-white/20" style={{ borderRadius: "1px 10px 10px 1px" }} />
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]"
                >
                  {isPlaying ? <PauseIcon /> : (
                    <svg width="8" height="10" viewBox="-1 0 16 18" fill="none">
                      <path d="M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z" fill="white" />
                    </svg>
                  )}
                </button>

                {/* Volume with expandable slider */}
                <div
                  className="relative flex items-center"
                  onMouseEnter={openVolume}
                  onMouseLeave={closeVolumeDelayed}
                >
                  <motion.div
                    className="flex h-8 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-white/20 backdrop-blur-[12px]"
                    animate={{ width: volumeOpen ? 75 : 32, paddingLeft: 10, paddingRight: volumeOpen ? 8 : 10 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  >
                    <button
                      className="flex shrink-0 cursor-pointer items-center justify-center"
                      onClick={() => {
                        const video = videoRef.current;
                        if (!video) return;
                        if (video.muted || volume === 0) {
                          video.muted = false;
                          const restored = 0.75;
                          video.volume = restored;
                          setVolume(restored);
                        } else {
                          video.muted = true;
                          setVolume(0);
                        }
                      }}
                    >
                      {volume === 0 ? <VolumeMutedIcon /> : <VolumeIcon />}
                    </button>
                    <AnimatePresence>
                      {volumeOpen && (
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          exit={{ opacity: 0, scaleX: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          style={{ transformOrigin: "left" }}
                          className="relative flex-1 cursor-pointer"
                          ref={volumeBarRef}
                          onMouseDown={handleVolumeMouseDown}
                        >
                          <div className="h-1.5 w-full rounded-full bg-white/20">
                            <div
                              ref={volumeFillRef}
                              className="h-full rounded-full bg-white/40"
                              style={{ width: `${volume * 100}%` }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Chat button — only in card view */}
                {showChat && (
                  <button className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M10 1.5C10 .672 9.328 0 8.5 0h-7C.672 0 0 .672 0 1.5v5C0 7.328.672 8 1.5 8H2v1c0 .18.097.346.254.435a.5.5 0 0 0 .503-.006L5.138 8H8.5C9.328 8 10 7.328 10 6.5v-5ZM2.124 4a.625.625 0 1 0 1.25 0 .625.625 0 0 0-1.25 0Zm2.25 0a.625.625 0 1 0 1.25 0 .625.625 0 0 0-1.25 0ZM7.249 4.625a.625.625 0 1 1 0-1.25.625.625 0 0 1 0 1.25Z" fill="white"/></svg>
                  </button>
                )}

              </div>
              <div className="flex items-center gap-1">
                {/* Speed with popup menu — hidden on mobile */}
                <div className="relative hidden sm:block" data-speed-menu>
                  <AnimatePresence>
                    {speedOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute bottom-10 right-0 flex w-[128px] flex-col rounded-[12px] bg-[rgba(51,51,51,0.9)] p-1 backdrop-blur-[12px]"
                        onMouseLeave={() => setHoveredSpeed(null)}
                      >
                        {/* Header */}
                        <div className="px-[10px] py-2">
                          <span className="font-inter text-xs tracking-[-0.02em] text-white/50">Speed</span>
                        </div>
                        {/* Options */}
                        <div className="relative flex flex-col">
                          {/* Fluid hover indicator */}
                          {hoveredSpeed !== null && hoveredSpeed !== speed && (
                            <motion.div
                              className="pointer-events-none absolute inset-x-0 h-7 rounded-lg bg-white/10"
                              layout
                              transition={{ type: "spring", stiffness: 800, damping: 40 }}
                              style={{ top: SPEEDS.indexOf(hoveredSpeed) * 28 }}
                            />
                          )}
                          {SPEEDS.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSpeedChange(s)}
                              onMouseEnter={() => setHoveredSpeed(s)}
                              className={cn(
                                "relative z-[1] flex cursor-pointer items-center gap-3 px-[10px] py-2 text-left",
                                s === speed && "rounded-lg bg-white/20",
                              )}
                            >
                              <div className="flex flex-1 items-center gap-[1px]">
                                <span className="font-inter text-xs font-medium leading-none tracking-[0.1px] text-white">
                                  {s.toFixed(1)}
                                </span>
                                <span className="font-inter text-xs font-normal leading-none tracking-[0.1px] text-white/50">x</span>
                              </div>
                              {s === speed && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => setSpeedOpen((o) => !o)}
                    className="flex h-8 cursor-pointer items-center justify-center gap-[1px] rounded-full bg-white/20 px-3 backdrop-blur-[12px]"
                  >
                    <span className="font-inter text-xs font-medium tracking-[0.1px] text-white">{speed.toFixed(1)}</span>
                    <span className="font-inter text-xs tracking-[0.1px] text-white/50">x</span>
                  </button>
                </div>

                {/* Expand */}
                <button
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]"
                  onClick={() => setIsFullscreen((f) => !f)}
                >
                  {isFullscreen ? <ShrinkIcon size={9} /> : <ExpandIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>}
      </div>
    </div>
    </>
  );
}
function TimelineCommentMarker({
  timestamp,
  totalDuration,
  brandAvatar,
  brandName,
  creatorAvatar,
  creatorName,
  commentId,
  onClick,
}: {
  timestamp: number;
  totalDuration: number;
  brandAvatar: string;
  brandName: string;
  creatorAvatar?: string;
  creatorName?: string;
  commentId: string;
  onClick: (id: string) => void;
}) {
  const pct = (timestamp / totalDuration) * 100;

  return (
    <div
      className="absolute -translate-x-1/2"
      style={{ left: `${pct}%`, bottom: 6 }}
    >
      <button
        type="button"
        className="pointer-events-auto flex cursor-pointer items-center transition-transform hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          onClick(commentId);
        }}
      >
        <img
          src={brandAvatar}
          alt={brandName}
          className={cn("size-6 rounded-lg border-[1.5px] border-white object-cover", creatorAvatar && "mr-[-10px]")}
        />
        {creatorAvatar && (
          <img
            src={creatorAvatar}
            alt={creatorName}
            className="size-6 rounded-full border-[1.5px] border-white object-cover"
          />
        )}
      </button>
    </div>
  );
}

function InlinePdfThumb({ onRemove }: { onRemove?: () => void }) {
  // The Figma subtract boolean cuts from ~(51,64) to (64,51) — a corner triangle.
  // 51/64 ≈ 79.7%
  return (
    <div className="relative size-16 shrink-0">
      {/* Grey card with corner cut via clip-path */}
      <div
        className="size-full rounded-[10px] border border-foreground/[0.06] bg-[#D9D9D9] dark:bg-[#3a3a3a]"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%)" }}
      />
      {/* Fold flap SVG */}
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="absolute bottom-0 right-0">
        <g filter="url(#filter0_di_pdf_fold)">
          <path d="M1.70556 5.60837C1.7568 3.47449 3.47449 1.7568 5.60837 1.70556L14.1405 1.50066C14.366 1.49524 14.4828 1.76782 14.3233 1.92736L1.92736 14.3233C1.76782 14.4828 1.49524 14.366 1.50066 14.1405L1.70556 5.60837Z" fill="url(#paint0_pdf_fold)"/>
        </g>
        <defs>
          <filter id="filter0_di_pdf_fold" x="0" y="0" width="14.8965" height="14.8965" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="-0.5" dy="-0.5"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dx="0.5" dy="0.5"/>
            <feGaussianBlur stdDeviation="0.25"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.145098 0 0 0 0 0.145098 0 0 0 0 0.145098 0 0 0 0.12 0"/>
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow"/>
          </filter>
          <linearGradient id="paint0_pdf_fold" x1="5.79836" y1="5.30031" x2="8.28163" y2="7.98047" gradientUnits="userSpaceOnUse">
            <stop offset="0.65" stopColor="white"/>
            <stop offset="1" stopColor="#F2F2F2"/>
          </linearGradient>
        </defs>
      </svg>
      {/* PDF badge */}
      <div className="absolute bottom-1 left-1 flex h-4 items-center rounded-full border border-foreground/[0.06] bg-white px-1 dark:bg-[#2a2a2a]">
        <span className="font-inter text-[10px] font-medium leading-none tracking-[-0.02em] text-foreground/70">PDF</span>
      </div>
      {/* Remove button */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-1 -top-1 z-10 flex size-5 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] dark:bg-[#444]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeWidth="1.14" strokeLinecap="round" className="text-foreground/30" />
          </svg>
        </button>
      )}
    </div>
  );
}

function TimelineEvent({
  id,
  avatar,
  actorType,
  name,
  time,
  indent,
  highlighted,
  actionContent,
  connector,
}: {
  id: string;
  avatar: string;
  actorType: "creator" | "brand";
  name: string;
  time: string;
  indent?: boolean;
  highlighted?: boolean;
  actionContent: React.ReactNode;
  connector?: "straight" | "l-shape" | "reply-straight";
}) {
  return (
    <div
      className="relative flex flex-col gap-2"
      data-comment-id={id}
    >
      {/* Full-width highlight background */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-x-4 -inset-y-1.5 transition-colors duration-500",
          highlighted ? "bg-foreground/[0.06]" : "bg-transparent",
        )}
      />
      {/* Connector line — absolute, behind content */}
      {connector && (
        <div
          className="absolute"
          style={{ left: indent ? 30 : 8, top: 16 }}
        >
          {connector === "straight" && (
            <div className="h-[46px] w-px bg-foreground/[0.12]" />
          )}
          {connector === "l-shape" && (
            <svg width="22" height="63" viewBox="0 0 22 63" fill="none" className="overflow-visible">
              <path d="M0.5 0V58C0.5 60.2091 2.29086 62 4.5 62H21.5" stroke="currentColor" className="text-foreground/[0.12]" strokeLinecap="round"/>
            </svg>
          )}
          {connector === "reply-straight" && (
            <div className="h-[50px] w-px bg-foreground/[0.12]" />
          )}
        </div>
      )}

      {/* Event content */}
      <div
        className={cn(
          "relative flex flex-col gap-2",
          indent && "pl-[22px]",
        )}
      >
        {/* Name row: avatar + name + time */}
        <div className="flex items-center gap-2">
          <img
            src={avatar}
            alt={name}
            className={cn(
              "size-4 shrink-0 object-cover",
              actorType === "brand"
                ? "rounded border border-foreground/[0.06]"
                : "rounded-full",
            )}
          />
          <div className="flex flex-1 items-center gap-1.5">
            <span className="flex-1 truncate font-inter text-sm font-medium leading-normal tracking-[-0.02em] text-page-text">{name}</span>
            <span className="shrink-0 font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">{time}</span>
          </div>
        </div>

        {/* Action row */}
        {actionContent}
      </div>
    </div>
  );
}

function TimelineUploadIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M8.5625 4.9375V7.5625C8.5625 8.11478 8.11478 8.5625 7.5625 8.5625H1.5625C1.01022 8.5625 0.5625 8.11478 0.5625 7.5625V4.9375M4.56249 0.5625V6.1875M4.56249 0.5625L6.8125 2.8125M4.56249 0.5625L2.3125 2.8125" stroke="currentColor" className="text-foreground/50" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

