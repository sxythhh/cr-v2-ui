"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useFloating, offset, shift, flip, autoUpdate, FloatingPortal } from "@floating-ui/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { useTheme } from "@/components/theme-provider";
import { springs } from "@/lib/springs";

// ── Icons ────────────────────────────────────────────────────────────

function ChatBubbleIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path d="M7 0c2.043 0 3.793.528 5.045 1.571C13.311 2.627 14 4.156 14 6s-.689 3.373-1.955 4.429C10.793 11.472 9.043 12 7 12c-1.08 0-2.295-.1-3.39-.575-.185.104-.442.23-.746.336-.634.22-1.558.375-2.483-.063a.5.5 0 0 1-.242-.876c.459-.605.604-1.075.644-1.375.038-.29-.016-.455-.022-.473l.001.001-.001-.002-.006-.014-.009-.02a6.8 6.8 0 0 1-.4-1.092C.18 7.212 0 6.544 0 6c0-1.844.689-3.373 1.955-4.429C3.207.528 4.957 0 7 0z" fill="currentColor" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 0C3.404 0 1.264 2.036 1.134 4.628L1.015 7.021a.667.667 0 0 1-.07.265L.127 8.921A.667.667 0 0 0 0 9.461C0 10.127.54 10.667 1.206 10.667h1.527a3.334 3.334 0 0 0 6.534 0h1.527c.666 0 1.206-.54 1.206-1.206a.667.667 0 0 0-.127-.54l-.818-1.636a.667.667 0 0 1-.07-.265l-.12-2.392C10.736 2.036 8.596 0 6 0Zm0 12a2 2 0 0 1-1.886-1.333h3.772A2 2 0 0 1 6 12Z" fill="currentColor" />
    </svg>
  );
}

function UserIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6.667 13.333c3.682 0 6.666-2.984 6.666-6.666S10.35 0 6.667 0 0 2.985 0 6.667s2.985 6.666 6.667 6.666zM8.667 5.333a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM6.667 12c-1.492 0-2.84-.613-3.81-1.6.889-1.063 2.213-1.733 3.81-1.733 1.596 0 2.921.67 3.81 1.733-.97.987-2.319 1.6-3.81 1.6z" fill="currentColor" className="text-foreground/50"/></svg>; }
function SunIcon() { return <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-foreground/50"><path d="M7.333 0a.667.667 0 0 1 .667.667v.666a.667.667 0 1 1-1.333 0V.667A.667.667 0 0 1 7.333 0z" fill="currentColor"/><path d="M2.148 2.148a.667.667 0 0 1 .943 0l.471.471a.667.667 0 1 1-.943.943l-.471-.471a.667.667 0 0 1 0-.943z" fill="currentColor"/><path d="M12.519 3.09a.667.667 0 0 0 0-.942.667.667 0 0 0-.943 0l-.471.471a.667.667 0 1 0 .943.943l.471-.471z" fill="currentColor"/><path d="M0 7.333a.667.667 0 0 1 .667-.666h.666a.667.667 0 1 1 0 1.333H.667A.667.667 0 0 1 0 7.333z" fill="currentColor"/><path d="M13.333 6.667a.667.667 0 0 0 0 1.333H14a.667.667 0 1 0 0-1.333h-.667z" fill="currentColor"/><path d="M11.105 11.105a.667.667 0 0 1 .943 0l.471.471a.667.667 0 1 1-.943.943l-.471-.471a.667.667 0 0 1 0-.943z" fill="currentColor"/><path d="M3.562 12.047a.667.667 0 0 0 0-.943.667.667 0 0 0-.943 0l-.471.472a.667.667 0 1 0 .943.942l.471-.471z" fill="currentColor"/><path d="M7.333 12.667a.667.667 0 0 1 .667.666V14a.667.667 0 1 1-1.333 0v-.667a.667.667 0 0 1 .666-.666z" fill="currentColor"/><path d="M3.333 7.333a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" fill="currentColor"/></svg>; }
function MoonIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6.701 1.045a.5.5 0 0 0-.605-.713C2.681.292 0 3.154 0 6.644c0 3.681 2.984 6.665 6.665 6.665 3.49 0 6.353-2.681 6.642-6.095a.5.5 0 0 0-.774-.53 4.33 4.33 0 0 1-2.536.799c-2.209 0-4-1.79-4-4a4.33 4.33 0 0 1 .704-2.438z" fill="currentColor" className="text-foreground/50"/></svg>; }
function MonitorIcon() { return <svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M0 2a2 2 0 0 1 2-2h9.333a2 2 0 0 1 2 2v5.333a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z" fill="currentColor" className="text-foreground/50"/><path d="M2.884 11.964a8.67 8.67 0 0 1 7.566 0 .5.5 0 0 0 .414-.913 9.67 9.67 0 0 0-8.434 0 .5.5 0 0 0 .454.913z" fill="currentColor" className="text-foreground/50"/></svg>; }
function DiscordIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8.8 8.8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032a.06.06 0 0 0 .021.037 13.3 13.3 0 0 0 3.996 2.02.05.05 0 0 0 .056-.019c.308-.42.583-.863.818-1.329a.05.05 0 0 0-.025-.065 8.7 8.7 0 0 1-1.248-.595.05.05 0 0 1-.005-.079c.084-.063.168-.128.248-.194a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007c.08.066.164.131.248.195a.05.05 0 0 1-.004.078c-.398.233-.813.43-1.249.596a.05.05 0 0 0-.025.064c.24.466.514.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.04.04 0 0 0-.02-.019zM5.426 10.317c-.793 0-1.445-.727-1.445-1.62s.64-1.62 1.445-1.62c.813 0 1.454.735 1.445 1.62 0 .893-.64 1.62-1.445 1.62zm5.34 0c-.793 0-1.445-.727-1.445-1.62s.64-1.62 1.445-1.62c.813 0 1.454.735 1.445 1.62 0 .893-.632 1.62-1.445 1.62z" fill="currentColor" className="text-foreground/50"/></svg>; }
function ChangelogIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7 .583a6.417 6.417 0 1 0 0 12.834A6.417 6.417 0 0 0 7 .583zM7.5 4.083a.5.5 0 0 0-1 0v2.541l-1.604 1.604a.5.5 0 0 0 .708.708L7.354 7.186A.5.5 0 0 0 7.5 6.833V4.083z" fill="currentColor" className="text-foreground/50"/></svg>; }
function LogoutIcon() { return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 1.333A.667.667 0 0 0 1.333 2v8c0 .368.299.667.667.667h3.5a.667.667 0 1 1 0 1.333H2A2 2 0 0 1 0 10V2a2 2 0 0 1 2-2h3.5a.667.667 0 1 1 0 1.333H2zM7.862 2.529a.667.667 0 0 1 .943 0l3 3a.667.667 0 0 1 0 .943l-3 3a.667.667 0 1 1-.943-.943l1.862-1.862H3.833a.667.667 0 1 1 0-1.333h5.89L7.863 3.471a.667.667 0 0 1 0-.943z" fill="currentColor"/></svg>; }
function ChevronRight() { return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 1.5 9 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/50"/></svg>; }
function Checkmark() { return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5 4.5 8.5l5-5" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" className="text-dropdown-text"/></svg>; }

// ── Mock data ────────────────────────────────────────────────────────

const MESSAGES = [
  { id: 1, name: "Sound Network", avatar: "https://i.pravatar.cc/32?img=33", message: "Hey, we loved your latest submission!", time: "2m", unread: true },
  { id: 2, name: "Verse Media", avatar: "https://i.pravatar.cc/32?img=5", message: "Your campaign payout has been processed.", time: "1h", unread: true },
  { id: 3, name: "Content Rewards", avatar: "https://i.pravatar.cc/32?img=12", message: "Welcome to the platform!", time: "3h", unread: false },
  { id: 4, name: "GymShark", avatar: "https://i.pravatar.cc/32?img=18", message: "New campaign available in your niche.", time: "1d", unread: false },
];

const NOTIFICATIONS = [
  { id: 1, title: "Campaign Approved", desc: "Your submission to Call of Duty BO7 was approved.", time: "5m", type: "success" as const },
  { id: 2, title: "Payout Sent", desc: "$240.00 sent to your Stripe account.", time: "2h", type: "success" as const },
  { id: 3, title: "New Campaign Match", desc: "92% match score campaign available.", time: "4h", type: "info" as const },
  { id: 4, title: "Submission Rejected", desc: "Fortnite OG video didn't meet standards.", time: "1d", type: "warning" as const },
  { id: 5, title: "Rank Upgrade", desc: "Promoted to Pioneer rank!", time: "2d", type: "success" as const },
];

function NotifDot({ type }: { type: "success" | "info" | "warning" }) {
  const c = type === "success" ? "bg-emerald-500" : type === "warning" ? "bg-amber-500" : "bg-blue-500";
  return <div className={`mt-1.5 size-2 shrink-0 rounded-full ${c}`} />;
}

// ── Profile Dropdown (extended with Discord, Changelog, etc.) ────────

function CreatorProfileDropdown({ onClose }: { onClose: () => void }) {
  const { mode, setMode } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { activeIndex, setActiveIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(containerRef);

  useEffect(() => { measureItems(); }, [measureItems]);
  const reg = useCallback((i: number) => (el: HTMLDivElement | null) => registerItem(i, el), [registerItem]);

  const effectiveRect = themeOpen ? itemRects[1] ?? null : activeIndex !== null ? itemRects[activeIndex] : null;

  const items = [
    { label: "Account", icon: <UserIcon />, onClick: () => { onClose(); router.push("/settings"); } },
    { label: "Theme", icon: mode === "dark" ? <MoonIcon /> : mode === "system" ? <MonitorIcon /> : <SunIcon />, hasSubmenu: true },
    { label: "Discord", icon: <DiscordIcon />, onClick: () => {} },
    { label: "Changelog", icon: <ChangelogIcon />, onClick: () => { onClose(); router.push("/changelog"); } },
  ];

  return (
    <div className="relative">
      <div
        ref={containerRef}
        {...handlers}
        className="relative flex w-[190px] flex-col gap-0.5 select-none rounded-xl border border-foreground/[0.06] bg-dropdown-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
      >
        <AnimatePresence>
          {effectiveRect && (
            <motion.div
              key={sessionRef.current}
              className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
              initial={{ opacity: 0, top: effectiveRect.top, left: effectiveRect.left, width: effectiveRect.width, height: effectiveRect.height }}
              animate={{ opacity: 1, top: effectiveRect.top, left: effectiveRect.left, width: effectiveRect.width, height: effectiveRect.height }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ ...springs.fast, opacity: { duration: 0.12 } }}
            />
          )}
        </AnimatePresence>

        {items.map((item, i) => (
          <div
            key={item.label}
            ref={reg(i)}
            className="relative"
            onPointerEnter={item.hasSubmenu ? () => setThemeOpen(true) : undefined}
            onPointerLeave={item.hasSubmenu ? () => setTimeout(() => setThemeOpen(false), 150) : undefined}
          >
            <button
              type="button"
              onClick={item.onClick}
              className="relative z-10 flex h-8 w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2"
            >
              <span className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm tracking-[-0.02em] text-dropdown-text">{item.label}</span>
              </span>
              {item.hasSubmenu && <ChevronRight />}
            </button>

            {item.hasSubmenu && (
              <AnimatePresence>
                {themeOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-0 right-full pr-2"
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  >
                    <ThemeSubmenu mode={mode} setMode={setMode} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}

        {/* Log out */}
        <div ref={reg(items.length)}>
          <button
            type="button"
            onClick={onClose}
            className="relative z-10 flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2"
          >
            <span className="text-[#FF2525] dark:text-[#FB7185]"><LogoutIcon /></span>
            <span className="text-sm tracking-[-0.02em] text-[#FF2525] dark:text-[#FB7185]">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ThemeSubmenu({ mode, setMode }: { mode: string; setMode: (m: "light" | "dark" | "system") => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(containerRef);
  useEffect(() => { measureItems(); }, [measureItems]);
  const reg = useCallback((i: number) => (el: HTMLDivElement | null) => registerItem(i, el), [registerItem]);

  const items: { label: string; value: "light" | "dark" | "system"; icon: React.ReactNode }[] = [
    { label: "Light", value: "light", icon: <SunIcon /> },
    { label: "Dark", value: "dark", icon: <MoonIcon /> },
    { label: "System", value: "system", icon: <MonitorIcon /> },
  ];

  const checkedIdx = items.findIndex((i) => i.value === mode);
  const hoveringOther = activeIndex !== null && activeIndex !== checkedIdx;
  const activeRect = hoveringOther ? itemRects[activeIndex] : null;
  const checkedRect = checkedIdx >= 0 ? itemRects[checkedIdx] : null;

  return (
    <div ref={containerRef} {...handlers} className="relative flex w-[176px] flex-col gap-0.5 select-none rounded-xl border border-foreground/[0.06] bg-dropdown-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
      <AnimatePresence>
        {checkedRect && (
          <motion.div
            className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
            initial={false}
            animate={{ top: checkedRect.top, left: checkedRect.left, width: checkedRect.width, height: checkedRect.height, opacity: hoveringOther ? 0.5 : 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeRect && (
          <motion.div
            key={sessionRef.current}
            className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
            initial={{ opacity: 0, ...activeRect }}
            animate={{ opacity: 1, ...activeRect }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ ...springs.fast, opacity: { duration: 0.12 } }}
          />
        )}
      </AnimatePresence>
      {items.map((item, idx) => (
        <div key={item.value} ref={reg(idx)}>
          <button type="button" onClick={() => setMode(item.value)} className="relative z-10 flex h-8 w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2">
            <span className="flex items-center gap-2">
              {item.icon}
              <span className="text-sm tracking-[-0.02em] text-dropdown-text">{item.label}</span>
            </span>
            {mode === item.value && <Checkmark />}
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Tier Pill Profile Dropdown ───────────────────────────────────────

function TierPillWithDropdown() {
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating({
    open: show,
    placement: "bottom-end",
    middleware: [offset(6), shift({ padding: 8 }), flip()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (!show) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        const floating = document.querySelector("[data-creator-profile-floating]");
        if (floating && floating.contains(e.target as Node)) return;
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [show]);

  return (
    <div ref={(node) => { containerRef.current = node; refs.setReference(node); }}>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="flex cursor-pointer items-center gap-2 rounded-2xl border border-foreground/[0.06] bg-white py-0 pl-3 pr-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none dark:hover:bg-white/[0.04]"
      >
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium tracking-[-0.02em] text-[#E57100] dark:text-[#FB923C]">Recruit</span>
          <span className="text-sm font-medium tracking-[-0.02em] text-foreground/20">&middot;</span>
          <span className="text-sm font-medium tracking-[-0.02em] text-foreground/40">36%</span>
        </div>
        {/* Avatar with gold rank ring + star badge (from bookmaker-clone) */}
        <svg width="36" height="36" viewBox="6 6 60 60" fill="none" className="shrink-0 overflow-visible">
          {/* Gold ring frame */}
          <path fillRule="evenodd" clipRule="evenodd" d="M45.3 60.13C42.42 61.24 39.28 61.85 36 61.85C21.72 61.85 10.15 50.28 10.15 36C10.15 21.72 21.72 10.15 36 10.15C50.28 10.15 61.85 21.72 61.85 36C61.85 41.54 60.11 46.67 57.14 50.87L59.38 52.5C59.93 52.9 60.16 53.61 59.95 54.26L57.36 62.23C57.15 62.88 56.55 63.32 55.86 63.32H47.49C46.8 63.32 46.2 62.88 45.99 62.23L45.3 60.13ZM44.11 56.46C41.6 57.45 38.86 58 36 58C23.85 58 14 48.15 14 36C14 23.85 23.85 14 36 14C48.15 14 58 23.85 58 36C58 40.69 56.53 45.04 54.03 48.61L52.6 47.57C52.05 47.17 51.3 47.17 50.75 47.57L43.97 52.5C43.42 52.9 43.19 53.61 43.4 54.26L44.11 56.46Z" fill="url(#hg)"/>
          {/* Decorative pattern */}
          <mask id="hm" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="10" y="10" width="52" height="54">
            <path fillRule="evenodd" clipRule="evenodd" d="M45.3 60.13C42.42 61.24 39.28 61.85 36 61.85C21.72 61.85 10.15 50.28 10.15 36C10.15 21.72 21.72 10.15 36 10.15C50.28 10.15 61.85 21.72 61.85 36C61.85 41.54 60.11 46.67 57.14 50.87L59.38 52.5C59.93 52.9 60.16 53.61 59.95 54.26L57.36 62.23C57.15 62.88 56.55 63.32 55.86 63.32H47.49C46.8 63.32 46.2 62.88 45.99 62.23L45.3 60.13ZM44.11 56.46C41.6 57.45 38.86 58 36 58C23.85 58 14 48.15 14 36C14 23.85 23.85 14 36 14C48.15 14 58 23.85 58 36C58 40.69 56.53 45.04 54.03 48.61L52.6 47.57C52.05 47.17 51.3 47.17 50.75 47.57L43.97 52.5C43.42 52.9 43.19 53.61 43.4 54.26L44.11 56.46Z" fill="white"/>
          </mask>
          <g mask="url(#hm)"><g opacity="0.3" style={{mixBlendMode:"multiply"}}><path fillRule="evenodd" clipRule="evenodd" d="M44 7L36 37L9.13 21.44L20.44 10.13L36 37L28 7H44ZM36 37L20.44 63.87L9.13 52.56L36 37ZM36 37L51.56 10.13L62.87 21.44L36 37ZM36 37L66 29V45L36 37ZM36 37L44 67H28L36 37ZM36 37L6 45V29L36 37Z" fill="#FFD640"/></g></g>
          {/* Decorative arcs */}
          <path opacity="0.2" d="M16.57 47.45C20.5 54.1 27.73 58.55 36 58.55C37.34 58.55 38.65 58.43 39.92 58.21" stroke="#F68A2D" strokeWidth="1.1" strokeLinecap="round"/>
          <path opacity="0.3" d="M24.43 55.36C27.81 57.39 31.77 58.55 36 58.55" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
          <path opacity="0.2" d="M15.34 26.94C18.83 19 26.77 13.45 36 13.45C45.23 13.45 53.17 19 56.66 26.94" stroke="#DA731B" strokeWidth="1.1" strokeLinecap="round"/>
          <path opacity="0.4" d="M61.3 36C61.3 22.03 49.97 10.7 36 10.7C22.03 10.7 10.7 22.03 10.7 36" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
          {/* Avatar circle (clip) */}
          <clipPath id="hac"><circle cx="36" cy="36" r="22"/></clipPath>
          <circle cx="36" cy="36" r="22" fill="url(#hav)" clipPath="url(#hac)"/>
          {/* Star badge */}
          <g filter="url(#hs)">
            <path fillRule="evenodd" clipRule="evenodd" d="M51.675 59.032L49.467 59.817C49.088 59.952 48.692 59.664 48.703 59.263L48.768 56.92L47.338 55.062C47.093 54.744 47.245 54.278 47.63 54.165L49.878 53.502L51.203 51.569C51.43 51.237 51.92 51.237 52.147 51.569L53.472 53.502L55.72 54.165C56.106 54.278 56.257 54.744 56.012 55.062L54.582 56.92L54.647 59.263C54.658 59.664 54.262 59.952 53.883 59.817L51.675 59.032Z" fill="url(#hsg)"/>
          </g>
          <path fillRule="evenodd" clipRule="evenodd" d="M51.675 59.032L49.467 59.817C49.088 59.952 48.692 59.664 48.703 59.263L48.768 56.92L47.338 55.062C47.093 54.744 47.245 54.278 47.63 54.165L49.878 53.502L51.203 51.569C51.43 51.237 51.92 51.237 52.147 51.569L53.472 53.502L55.72 54.165C56.106 54.278 56.257 54.744 56.012 55.062L54.582 56.92L54.647 59.263C54.658 59.664 54.262 59.952 53.883 59.817L51.675 59.032Z" stroke="#FFE9D1" strokeWidth="1.1" strokeLinecap="round"/>
          <defs>
            <filter id="hs" x="46.67" y="50.77" width="10.01" height="10.63" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="bg"/><feBlend in="SourceGraphic" in2="bg" result="shape"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feComposite in2="a" operator="arithmetic" k2="-1" k3="1"/><feColorMatrix values="0 0 0 0 0.92 0 0 0 0 0.45 0 0 0 0 0.11 0 0 0 1 0"/><feBlend in2="shape"/>
            </filter>
            <linearGradient id="hg" x1="10.15" y1="10.15" x2="10.15" y2="63.32" gradientUnits="userSpaceOnUse"><stop stopColor="#FDDA9D"/><stop offset="1" stopColor="#EFB35E"/></linearGradient>
            <linearGradient id="hsg" x1="46.58" y1="50.88" x2="46.58" y2="61.07" gradientUnits="userSpaceOnUse"><stop stopColor="#FD9B41"/><stop offset="1" stopColor="#F48224"/></linearGradient>
            <linearGradient id="hav" x1="16" y1="16" x2="56" y2="56" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a855f7"/></linearGradient>
          </defs>
        </svg>
      </button>

      <AnimatePresence>
        {show && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="pointer-events-none z-[200]"
              data-creator-profile-floating
            >
              <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <CreatorProfileDropdown onClose={() => setShow(false)} />
              </motion.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────

export function CreatorHeader({ title, className, leftSlot }: { title: string; className?: string; leftSlot?: React.ReactNode }) {
  return (
    <header className={`sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between bg-page-bg px-4 sm:px-5 ${className ?? ""}`}>
      {leftSlot ?? <h1 className="text-sm font-medium tracking-[-0.02em] text-page-text">{title}</h1>}
      <div className="flex items-center gap-2.5">
        {/* Chat */}
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <button className="relative flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]">
              <ChatBubbleIcon />
              <div className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#E57100]" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-semibold tracking-[-0.02em] text-page-text">Messages</span>
              <span className="text-xs font-medium text-page-text-muted">2 unread</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {MESSAGES.map((m) => (
                <button key={m.id} className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04]">
                  <img src={m.avatar} alt="" className="size-8 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`truncate text-[13px] tracking-[-0.02em] ${m.unread ? "font-semibold text-page-text" : "font-medium text-page-text-muted"}`}>{m.name}</span>
                      <span className="shrink-0 text-[11px] text-page-text-muted">{m.time}</span>
                    </div>
                    <p className={`mt-0.5 truncate text-[12px] tracking-[-0.02em] ${m.unread ? "text-page-text" : "text-page-text-muted"}`}>{m.message}</p>
                  </div>
                  {m.unread && <div className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#E57100]" />}
                </button>
              ))}
            </div>
            <div className="px-4 py-2.5">
              <button className="text-[13px] font-medium tracking-[-0.02em] text-[#E57100] transition-opacity hover:opacity-70">View all messages</button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Notifications */}
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <button className="relative flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]">
              <BellIcon />
              <div className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#E57100]" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[340px] p-0">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-semibold tracking-[-0.02em] text-page-text">Notifications</span>
              <button className="text-xs font-medium text-[#E57100] transition-opacity hover:opacity-70">Mark all read</button>
            </div>
            <div className="max-h-[340px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {NOTIFICATIONS.map((n) => (
                <button key={n.id} className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04]">
                  <NotifDot type={n.type} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold tracking-[-0.02em] text-page-text">{n.title}</span>
                      <span className="shrink-0 text-[11px] text-page-text-muted">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-[12px] tracking-[-0.02em] text-page-text-muted">{n.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-4 py-2.5">
              <button className="text-[13px] font-medium tracking-[-0.02em] text-[#E57100] transition-opacity hover:opacity-70">View all notifications</button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Tier pill + gold ring avatar — entire pill is clickable */}
        <TierPillWithDropdown />
      </div>
    </header>
  );
}
