"use client";

import { motion } from "motion/react";
import { CentralIcon } from "@central-icons-react/all";
import { StarsLogo } from "@/components/sidebar/icons/stars-logo";

const ci = { join: "round" as const, fill: "filled" as const, stroke: "2" as const, radius: "2" as const } as const;

interface WelcomeStepProps {
  variant: "brand" | "creator";
  onContinue?: () => void;
  onSkip?: () => void;
}

interface Highlight {
  title: string;
  description: string;
  color: string; // icon color
  iconRgb: string; // rgb triplet for the bottom radial tint, e.g. "174,78,238"
  icon: React.ReactNode;
}

const HIGHLIGHTS: Highlight[] = [
  {
    title: "Redesigned dashboard",
    description: "Faster, built around how you manage.",
    color: "#AE4EEE",
    iconRgb: "174,78,238",
    icon: <CentralIcon name="IconDashboardFast" size={20} color="currentColor" {...ci} />,
  },
  {
    title: "AI-powered tools",
    description: "Submissions scored instantly.",
    color: "#E57100",
    iconRgb: "229,113,0",
    icon: <CentralIcon name="IconCuteRobot" size={20} color="currentColor" {...ci} />,
  },
  {
    title: "Faster payouts",
    description: "Pay creators quicker with less work.",
    color: "#00994D",
    iconRgb: "0,153,77",
    icon: <CentralIcon name="IconMoneybag" size={20} color="currentColor" {...ci} />,
  },
  {
    title: "Better collaboration",
    description: "Cleaner creator communication.",
    color: "#1A67E5",
    iconRgb: "26,103,229",
    icon: <CentralIcon name="IconGroup2" size={20} color="currentColor" {...ci} />,
  },
];

export function WelcomeStep({ variant, onContinue, onSkip }: WelcomeStepProps) {
  const subtitle =
    variant === "creator"
      ? "Complete a few quick steps to set up your creator account."
      : "Complete a few steps to finish your migration.";

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center bg-page-bg font-inter tracking-[-0.02em]">
      {/* Content */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-5 pt-5">
        <div className="flex w-full max-w-[1068px] flex-1 flex-col items-center">
          {/* Welcome banner card */}
          <div className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-[20px]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-full max-w-[600px] flex-col items-center"
            >
              {/* App logo */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
              >
                <StarsLogo className="size-16 text-[#FF6207]" />
              </motion.div>

              {/* Title + subtitle */}
              <div className="mt-8 flex flex-col items-center gap-3.5 px-5 text-center">
                <h1 className="font-inter text-[24px] font-medium leading-none tracking-[-0.02em] text-[#252525] dark:text-page-text">
                  V2 is here. Let&apos;s get you set up.
                </h1>
                <p className="font-inter text-[16px] font-normal leading-[150%] tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-page-text-muted">
                  {subtitle}
                </p>
              </div>

              {/* 2x2 feature grid */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {HIGHLIGHTS.map((h) => (
                  <div
                    key={h.title}
                    className="flex flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-5 dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg"
                  >
                    <div
                      className="relative flex size-10 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white shadow-[0_0_0_2px_#FFFFFF] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg dark:shadow-[0_0_0_2px_var(--card-bg)]"
                      style={{
                        background: `radial-gradient(50% 50% at 50% 100%, rgba(${h.iconRgb},0.12) 0%, rgba(${h.iconRgb},0) 50%), var(--card-bg, #FFFFFF)`,
                        color: h.color,
                      }}
                    >
                      {h.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-inter text-[16px] font-medium leading-[120%] tracking-[-0.02em] text-[#252525] dark:text-page-text">
                        {h.title}
                      </span>
                      <span className="font-inter text-[14px] font-normal leading-[150%] tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-page-text-muted">
                        {h.description}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full border-t border-[rgba(37,37,37,0.06)] px-5 py-4 dark:border-[rgba(224,224,224,0.06)]">
        <div className="mx-auto flex w-full max-w-[600px] items-center justify-between gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="flex h-9 cursor-pointer items-center rounded-full px-3 font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-[rgba(37,37,37,0.5)] transition-colors hover:bg-foreground/[0.04] hover:text-page-text dark:text-page-text-muted"
          >
            Skip all
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted sm:inline">
              This will take about 2-3 minutes
            </span>
            <button
              type="button"
              onClick={onContinue}
              className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full px-5 font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_1px_2px_rgba(229,113,0,0.32)] transition-[filter,opacity] hover:brightness-[1.06]"
              style={{
                background:
                  "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207",
              }}
            >
              <span>Continue</span>
              <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-white/50">⏎</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
