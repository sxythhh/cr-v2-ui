"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CentralIcon } from "@central-icons-react/all";
import { StarsLogo } from "@/components/sidebar/icons/stars-logo";

/* ── Countdown logic ── */

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, targetMs - now);
  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);
  const done = remaining === 0;

  return { minutes, seconds, done, progress: done ? 1 : 1 - remaining / (30 * 60_000) };
}

/* ── Digit card ── */

function DigitCard({ value }: { value: string }) {
  return (
    <div className="relative flex h-11 w-9 items-center justify-center overflow-hidden rounded-lg bg-foreground/[0.04]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0, filter: "blur(2px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -10, opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-[20px] font-semibold leading-none tracking-[-0.02em] text-page-text"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ── V2 feature teasers ── */

const ci = { join: "round" as const, fill: "filled" as const, stroke: "2" as const, radius: "2" as const };

const TEASERS = [
  { icon: <CentralIcon name="IconLightning" size={14} color="currentColor" {...ci} />, text: "AI-powered campaigns" },
  { icon: <CentralIcon name="IconApps" size={14} color="currentColor" {...ci} />, text: "New analytics" },
  { icon: <CentralIcon name="IconPeople" size={14} color="currentColor" {...ci} />, text: "Better collaboration" },
  { icon: <CentralIcon name="IconCircleCheck" size={14} color="currentColor" {...ci} />, text: "Faster payouts" },
];

/* ── Page ── */

export default function MaintenancePage() {
  const targetMs = useMemo(() => Date.now() + 30 * 60 * 1_000, []);
  const { minutes, seconds, done, progress } = useCountdown(targetMs);

  const m1 = String(minutes).padStart(2, "0")[0];
  const m2 = String(minutes).padStart(2, "0")[1];
  const s1 = String(seconds).padStart(2, "0")[0];
  const s2 = String(seconds).padStart(2, "0")[1];

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center overflow-hidden bg-page-bg font-inter tracking-[-0.02em]">
      {/* Background watermark — centered in viewport */}
      <StarsLogo className="pointer-events-none absolute left-1/2 top-1/2 size-[240px] -translate-x-1/2 -translate-y-1/2 text-foreground/[0.025] sm:size-[420px]" />

      {/* Main content — vertically centered, sits inside the star hollow */}
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center px-6"
        >
          {/* Logo + wordmark */}
          <div className="flex items-center gap-2">
            <StarsLogo className="size-6 text-[#F97316]" />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-page-text">Content Rewards</span>
          </div>

          <div className="h-6" />

          {/* Headline */}
          <h1 className="text-center text-[28px] font-semibold leading-[34px] tracking-[-0.02em] text-page-text">
            Upgrading to v2
          </h1>
          <p className="mt-2 max-w-[240px] text-center text-[13px] leading-[20px] text-page-text-muted sm:max-w-[280px]">
            We&apos;re migrating your account to the new platform. Hang tight.
          </p>

          <div className="h-16" />

          {/* Countdown */}
          {!done ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1">
                <DigitCard value={m1} />
                <DigitCard value={m2} />
                <span className="mx-0.5 text-[18px] font-semibold text-page-text-subtle">:</span>
                <DigitCard value={s1} />
                <DigitCard value={s2} />
              </div>

              {/* Progress bar */}
              <div className="h-[3px] w-[168px] overflow-hidden rounded-full bg-foreground/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-[#FF6207]"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                <span className="relative flex size-[5px]">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#FF6207] opacity-50" />
                  <span className="relative inline-flex size-[5px] rounded-full bg-[#FF6207]" />
                </span>
                <span className="text-[11px] font-medium text-page-text-subtle">Migration in progress</span>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-2.5"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-[#00B259]/10">
                <CentralIcon name="IconCircleCheck" size={22} color="#00B259" {...ci} />
              </div>
              <span className="text-[14px] font-semibold text-[#00B259]">Migration complete</span>
              <span className="text-[12px] font-medium text-page-text-muted">Redirecting you to setup...</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom section — below the watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="relative z-10 flex shrink-0 flex-col items-center gap-3 px-6 pb-10"
      >
        <span className="text-[12px] font-semibold text-page-text-muted">
          What&apos;s new in v2
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:flex-nowrap">
          {TEASERS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.06, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="group flex cursor-default items-center gap-1.5 rounded-full bg-foreground/[0.04] px-2.5 py-1.5 transition-colors"
            >
              <span className="shrink-0 text-[#FF6207]">{t.icon}</span>
              <span className="whitespace-nowrap text-[11px] font-medium text-page-text-muted transition-colors group-hover:text-page-text">{t.text}</span>
            </motion.div>
          ))}
        </div>

        <p className="mt-2 text-[11px] font-medium text-page-text-subtle">
          {done ? "Redirecting..." : "We'll redirect you automatically when it's ready."}
        </p>
      </motion.div>
    </div>
  );
}
