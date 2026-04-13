"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useAnimationControls } from "motion/react";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(true);
  const controls = useAnimationControls();
  const wasHidden = useRef(false);

  const handleScroll = useCallback(() => {
    if (dismissed) return;
    const shouldHide = window.scrollY > 2;
    if (shouldHide !== wasHidden.current) {
      wasHidden.current = shouldHide;
      if (shouldHide) {
        controls.start({ height: 0, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } });
      } else {
        controls.start({ height: 32, opacity: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } });
      }
    }
  }, [dismissed, controls]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleDismiss = useCallback(async () => {
    setDismissed(true);
    await controls.start({ height: 0, opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } });
    setVisible(false);
  }, [controls]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ height: 32, opacity: 1 }}
      animate={controls}
      className="relative w-full overflow-hidden border-b border-foreground/[0.06] bg-white backdrop-blur-[4px] dark:bg-[#0a0a0a]"
      style={{ zIndex: 31 }}
    >
      <div className="flex h-8 items-center justify-center gap-3 px-11 tracking-[-0.02em]">
        {/* Message */}
        <span className="text-xs font-medium leading-4 text-page-text-muted" style={{ fontFeatureSettings: "'calt' off, 'liga' off" }}>
          Latest update: something
        </span>

        {/* Separator */}
        <span className="text-xs font-medium leading-4 text-page-text-muted" style={{ fontFeatureSettings: "'calt' off, 'liga' off" }}>
          —
        </span>

        {/* Learn more link */}
        <a
          href="#"
          className="group/link inline-flex items-center gap-0.5 text-xs font-semibold leading-4 text-page-text transition-colors hover:text-[#FF8003] hover:underline hover:underline-offset-2"
          style={{ fontFeatureSettings: "'calt' off, 'liga' off" }}
        >
          Learn more
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
            <path d="M3.5 3.5H8.5M8.5 3.5V8.5M8.5 3.5L3.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Close button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 text-page-text transition-opacity hover:opacity-60"
          aria-label="Dismiss announcement"
        >
          <svg width="11.5" height="11.5" viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 3L3 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
