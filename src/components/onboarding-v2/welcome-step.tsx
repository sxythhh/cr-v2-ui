"use client";

import { motion } from "motion/react";
import { CentralIcon } from "@central-icons-react/all";
import { StarsLogo } from "@/components/sidebar/icons/stars-logo";

const ci = { join: "round" as const, fill: "filled" as const, stroke: "2" as const, radius: "2" as const };

const HIGHLIGHTS = [
  { label: "Redesigned dashboard", icon: <CentralIcon name="IconApps" size={16} color="currentColor" {...ci} /> },
  { label: "AI-powered tools", icon: <svg viewBox="0 0 24 24" fill="none" className="size-4"><path fillRule="evenodd" clipRule="evenodd" d="M12 1C12.5523 1 13 1.44772 13 2V3H17C18.6569 3 20 4.34315 20 6V11C20 11.8885 19.6138 12.6868 19 13.2361V14.5858L20.7071 16.2929C21.0976 16.6834 21.0976 17.3166 20.7071 17.7071C20.3166 18.0976 19.6834 18.0976 19.2929 17.7071L18.681 17.0952C17.7905 19.9377 15.1361 22 12 22C8.8639 22 6.20948 19.9377 5.31897 17.0952L4.70711 17.7071C4.31658 18.0976 3.68342 18.0976 3.29289 17.7071C2.90237 17.3166 2.90237 16.6834 3.29289 16.2929L5 14.5858V13.2361C4.38625 12.6868 4 11.8885 4 11V6C4 4.34315 5.34315 3 7 3H11V2C11 1.44772 11.4477 1 12 1ZM7 5C6.44772 5 6 5.44772 6 6V11C6 11.5523 6.44772 12 7 12H17C17.5523 12 18 11.5523 18 11V6C18 5.44772 17.5523 5 17 5H7ZM9 7C9.55228 7 10 7.44772 10 8V9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9V8C8 7.44772 8.44772 7 9 7ZM15 7C15.5523 7 16 7.44772 16 8V9C16 9.55228 15.5523 10 15 10C14.4477 10 14 9.55228 14 9V8C14 7.44772 14.4477 7 15 7Z" fill="currentColor"/></svg> },
  { label: "Faster payouts", icon: <CentralIcon name="IconCreditCard1" size={16} color="currentColor" {...ci} /> },
  { label: "Better collaboration", icon: <CentralIcon name="IconPeople" size={16} color="currentColor" {...ci} /> },
];

interface WelcomeStepProps {
  variant: "brand" | "creator";
}

export function WelcomeStep({ variant }: WelcomeStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-8 px-6 py-8">
      {/* Animated logo orb */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex size-20 items-center justify-center"
      >
        <StarsLogo className="size-16 text-[#F97316]" />
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-page-text">
          Welcome to v2
        </h1>
        <p className="max-w-[360px] text-[14px] leading-[22px] text-page-text-muted">
          {variant === "creator"
            ? "We've rebuilt Content Rewards from the ground up. Let's get your account set up on the new platform."
            : "We've rebuilt Content Rewards from the ground up. Complete a few steps to finish your migration."}
        </p>
      </motion.div>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {HIGHLIGHTS.map((h, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card-bg px-3.5 py-3"
          >
            <span className="shrink-0 text-[#FF6207]">{h.icon}</span>
            <span className="text-[13px] font-medium text-page-text">{h.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Subtle nudge */}
      <p className="text-[12px] font-medium text-page-text-subtle">
        This takes about 2–3 minutes to complete.
      </p>
    </div>
  );
}
