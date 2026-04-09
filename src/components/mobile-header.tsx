"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { StarsLogo } from "@/components/sidebar/icons/stars-logo";
import { useSideNav } from "@/components/sidebar/sidebar-context";
import { useTheme } from "@/components/theme-provider";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { cn } from "@/lib/utils";

export function MobileHeader() {
  const { setSearchOpen } = useSideNav();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close on outside tap
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-page-border bg-page-bg px-5 md:hidden">
      <StarsLogo className="h-7 w-auto" />

      <div className="flex flex-1 items-center justify-end gap-1">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full text-page-text active:bg-foreground/[0.06]"
          onClick={() => setSearchOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6-6"/></svg>
        </button>

        <button
          type="button"
          className="relative flex size-11 items-center justify-center rounded-full text-page-text active:bg-foreground/[0.06]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/></svg>
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500" />
        </button>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            className="flex size-11 items-center justify-center"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
              alt=""
              className="size-8 rounded-full object-cover"
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="absolute right-0 top-full z-50 mt-1.5"
              >
                <MobileProfileMenu onClose={() => setProfileOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// ── Mobile Profile Menu ──────────────────────────────────────

function MobileProfileMenu({ onClose }: { onClose: () => void }) {
  const { mode, setMode } = useTheme();
  const router = useRouter();
  const [themeOpen, setThemeOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    activeIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
    measureItems,
  } = useProximityHover(containerRef);

  useEffect(() => {
    measureItems();
  }, [measureItems, themeOpen]);

  const register = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      registerItem(index, el);
    },
    [registerItem],
  );

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handlers.onMouseMove}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      className="relative flex w-[200px] flex-col gap-0.5 select-none rounded-xl border border-foreground/[0.06] bg-dropdown-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
    >
      {/* Sliding highlight */}
      <AnimatePresence>
        {activeRect && (
          <motion.div
            key={sessionRef.current}
            className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
            initial={{
              opacity: 0,
              top: activeRect.top,
              left: activeRect.left,
              width: activeRect.width,
              height: activeRect.height,
            }}
            animate={{
              opacity: 1,
              top: activeRect.top,
              left: activeRect.left,
              width: activeRect.width,
              height: activeRect.height,
            }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{
              ...springs.fast,
              opacity: { duration: 0.12 },
            }}
          />
        )}
      </AnimatePresence>

      {/* Account */}
      <div ref={register(0)}>
        <button
          type="button"
          onClick={() => {
            onClose();
            router.push("/account/settings");
          }}
          className="relative z-10 flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2"
        >
          <UserCircleIcon />
          <span className="font-inter text-sm font-normal tracking-[-0.02em] text-dropdown-text">
            Account
          </span>
        </button>
      </div>

      {/* Theme */}
      <div ref={register(1)}>
        <button
          type="button"
          onClick={() => setThemeOpen((v) => !v)}
          className="relative z-10 flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2"
        >
          <span className="flex items-center gap-2">
            <CurrentThemeIcon mode={mode} />
            <span className="font-inter text-sm font-normal tracking-[-0.02em] text-dropdown-text">
              Theme
            </span>
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={cn("text-foreground/50 transition-transform duration-150", themeOpen && "rotate-90")}
          >
            <path
              d="M4.5 1.5 9 6l-4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Theme options (inline expand) */}
      <AnimatePresence>
        {themeOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5 pl-5">
              {(
                [
                  { label: "Light", value: "light", icon: <BrightnessIcon /> },
                  { label: "Dark", value: "dark", icon: <MoonIcon /> },
                  { label: "System", value: "system", icon: <MonitorIcon /> },
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMode(item.value)}
                  className="relative z-10 flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 active:bg-foreground/[0.04]"
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-inter text-sm font-normal tracking-[-0.02em] text-dropdown-text">
                      {item.label}
                    </span>
                  </span>
                  {mode === item.value && <CheckmarkIcon />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log out */}
      <div ref={register(2)}>
        <button
          type="button"
          onClick={onClose}
          className="relative z-10 flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2"
        >
          <span className="text-[#FF3355] dark:text-[#FB7185]"><LogoutIcon /></span>
          <span className="font-inter text-sm font-normal tracking-[-0.02em] text-[#FF3355] dark:text-[#FB7185]">
            Log out
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────

function CurrentThemeIcon({ mode }: { mode: "light" | "dark" | "system" }) {
  if (mode === "dark") return <MoonIcon />;
  if (mode === "system") return <MonitorIcon />;
  return <BrightnessIcon />;
}

function UserCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.66667 13.3333C10.3486 13.3333 13.3333 10.3486 13.3333 6.66667C13.3333 2.98477 10.3486 0 6.66667 0C2.98477 0 0 2.98477 0 6.66667C0 10.3486 2.98477 13.3333 6.66667 13.3333ZM8.66667 5.33333C8.66667 6.4379 7.77124 7.33333 6.66667 7.33333C5.5621 7.33333 4.66667 6.4379 4.66667 5.33333C4.66667 4.22876 5.5621 3.33333 6.66667 3.33333C7.77124 3.33333 8.66667 4.22876 8.66667 5.33333ZM6.6668 12C5.17454 12 3.82542 11.3871 2.85742 10.3994C3.74524 9.33665 5.06994 8.66667 6.6668 8.66667C8.26366 8.66667 9.58836 9.33665 10.4762 10.3994C9.50818 11.3871 8.15906 12 6.6668 12Z" fill="currentColor" className="text-foreground/50" />
    </svg>
  );
}

function BrightnessIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-foreground/50">
      <path d="M7.33335 0C7.70154 0 8.00002 0.298477 8.00002 0.666667V1.33333C8.00002 1.70152 7.70154 2 7.33335 2C6.96516 2 6.66668 1.70152 6.66668 1.33333V0.666667C6.66668 0.298477 6.96516 0 7.33335 0Z" fill="currentColor" />
      <path d="M2.1479 2.14788C2.40825 1.88753 2.83036 1.88753 3.09071 2.14788L3.56211 2.61929C3.82246 2.87964 3.82246 3.30175 3.56211 3.5621C3.30176 3.82245 2.87965 3.82245 2.6193 3.5621L2.1479 3.09069C1.88755 2.83034 1.88755 2.40823 2.1479 2.14788Z" fill="currentColor" />
      <path d="M12.5188 3.09071C12.7792 2.83036 12.7792 2.40825 12.5188 2.1479C12.2585 1.88755 11.8364 1.88755 11.576 2.1479L11.1046 2.6193C10.8443 2.87965 10.8442 3.30176 11.1046 3.56211C11.3649 3.82246 11.7871 3.82246 12.0474 3.56211L12.5188 3.09071Z" fill="currentColor" />
      <path d="M0 7.33335C0 6.96516 0.298477 6.66668 0.666667 6.66668H1.33333C1.70152 6.66668 2 6.96516 2 7.33335C2 7.70154 1.70152 8.00002 1.33333 8.00002H0.666667C0.298477 8.00002 0 7.70154 0 7.33335Z" fill="currentColor" />
      <path d="M13.3333 6.66668C12.9651 6.66668 12.6667 6.96516 12.6667 7.33335C12.6667 7.70154 12.9651 8.00002 13.3333 8.00002H14C14.3682 8.00002 14.6667 7.70154 14.6667 7.33335C14.6667 6.96516 14.3682 6.66668 14 6.66668H13.3333Z" fill="currentColor" />
      <path d="M11.1046 11.1046C11.3649 10.8442 11.787 10.8442 12.0474 11.1046L12.5188 11.576C12.7791 11.8363 12.7791 12.2584 12.5188 12.5188C12.2584 12.7791 11.8363 12.7791 11.576 12.5188L11.1046 12.0474C10.8442 11.787 10.8442 11.3649 11.1046 11.1046Z" fill="currentColor" />
      <path d="M3.56213 12.0474C3.82248 11.787 3.82248 11.3649 3.56213 11.1046C3.30178 10.8442 2.87967 10.8442 2.61932 11.1046L2.14791 11.576C1.88756 11.8363 1.88756 12.2584 2.14791 12.5188C2.40826 12.7791 2.83037 12.7791 3.09072 12.5188L3.56213 12.0474Z" fill="currentColor" />
      <path d="M7.33335 12.6667C7.70154 12.6667 8.00002 12.9651 8.00002 13.3333V14C8.00002 14.3682 7.70154 14.6667 7.33335 14.6667C6.96516 14.6667 6.66668 14.3682 6.66668 14V13.3333C6.66668 12.9651 6.96516 12.6667 7.33335 12.6667Z" fill="currentColor" />
      <path d="M3.33333 7.33333C3.33333 5.12419 5.12419 3.33333 7.33333 3.33333C9.54247 3.33333 11.3333 5.12419 11.3333 7.33333C11.3333 9.54247 9.54247 11.3333 7.33333 11.3333C5.12419 11.3333 3.33333 9.54247 3.33333 7.33333Z" fill="currentColor" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M6.70111 1.04499C6.84744 0.832667 6.8582 0.554998 6.72874 0.331987C6.59929 0.108976 6.35283 -0.0193817 6.09589 0.00238948C2.68093 0.291747 0 3.15433 0 6.64378C0 10.325 2.98421 13.3092 6.66542 13.3092C10.1549 13.3092 13.0176 10.6281 13.3068 7.21309C13.3286 6.95615 13.2002 6.70969 12.9772 6.58025C12.7542 6.4508 12.4765 6.46157 12.2642 6.60791C11.6201 7.05183 10.8401 7.31169 9.9974 7.31169C7.78826 7.31169 5.9974 5.52083 5.9974 3.31169C5.9974 2.46903 6.25722 1.68906 6.70111 1.04499Z" fill="currentColor" className="text-foreground/50" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path d="M0 2C0 0.895431 0.89543 0 2 0H11.3333C12.4379 0 13.3333 0.895431 13.3333 2V7.33333C13.3333 8.4379 12.4379 9.33333 11.3333 9.33333H2C0.89543 9.33333 0 8.4379 0 7.33333V2Z" fill="currentColor" className="text-foreground/50" />
      <path d="M2.88369 11.9637C4.07239 11.5549 5.34406 11.3333 6.66685 11.3333C7.98964 11.3333 9.26131 11.5549 10.45 11.9637C10.7982 12.0835 11.1775 11.8983 11.2973 11.5502C11.417 11.202 11.2319 10.8227 10.8837 10.7029C9.55771 10.2468 8.1396 10 6.66685 10C5.1941 10 3.77599 10.2468 2.45 10.7029C2.10183 10.8227 1.91667 11.202 2.03643 11.5502C2.15619 11.8983 2.53553 12.0835 2.88369 11.9637Z" fill="currentColor" className="text-foreground/50" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M2 1.33333C1.63181 1.33333 1.33333 1.63181 1.33333 2L1.33333 10C1.33333 10.3682 1.63181 10.6667 2 10.6667H5.5C5.86819 10.6667 6.16667 10.9651 6.16667 11.3333C6.16667 11.7015 5.86819 12 5.5 12H2C0.895431 12 -7.94729e-08 11.1046 0 10L3.57628e-07 2C3.97364e-07 0.89543 0.895431 -7.94729e-08 2 0L5.5 1.58946e-07C5.86819 1.58946e-07 6.16667 0.298477 6.16667 0.666667C6.16667 1.03486 5.86819 1.33333 5.5 1.33333L2 1.33333ZM7.86193 2.5286C8.12228 2.26825 8.54439 2.26825 8.80474 2.5286L11.8047 5.52859C12.0651 5.78894 12.0651 6.21105 11.8047 6.4714L8.80474 9.47141C8.54439 9.73175 8.12228 9.73176 7.86193 9.47141C7.60158 9.21106 7.60158 8.78895 7.86193 8.5286L9.72386 6.66666H3.83333C3.46514 6.66666 3.16667 6.36818 3.16667 5.99999C3.16667 5.6318 3.46514 5.33333 3.83333 5.33333L9.72386 5.33333L7.86193 3.47141C7.60158 3.21106 7.60158 2.78895 7.86193 2.5286Z" fill="currentColor" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M2.5 6.5 4.5 8.5l5-5"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-dropdown-text"
      />
    </svg>
  );
}
