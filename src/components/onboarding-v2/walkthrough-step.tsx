"use client";

import { motion } from "motion/react";
import { CentralIcon } from "@central-icons-react/all";

interface WalkthroughStepProps {
  onStartDemo: () => void;
  variant: "brand" | "creator";
}

const ci = { join: "round" as const, fill: "filled" as const, stroke: "2" as const, radius: "2" as const };

const FEATURES = [
  { title: "Navigate your workspace", desc: "Everything you need is in the sidebar — campaigns, creators, submissions, and payouts.", icon: <CentralIcon name="IconApps" size={20} color="currentColor" {...ci} /> },
  { title: "AI assistant", desc: "Ask CR AI anything — find creators, optimize campaigns, draft outreach.", icon: <svg viewBox="0 0 24 24" fill="none" className="size-5"><path fillRule="evenodd" clipRule="evenodd" d="M12 1C12.5523 1 13 1.44772 13 2V3H17C18.6569 3 20 4.34315 20 6V11C20 11.8885 19.6138 12.6868 19 13.2361V14.5858L20.7071 16.2929C21.0976 16.6834 21.0976 17.3166 20.7071 17.7071C20.3166 18.0976 19.6834 18.0976 19.2929 17.7071L18.681 17.0952C17.7905 19.9377 15.1361 22 12 22C8.8639 22 6.20948 19.9377 5.31897 17.0952L4.70711 17.7071C4.31658 18.0976 3.68342 18.0976 3.29289 17.7071C2.90237 17.3166 2.90237 16.6834 3.29289 16.2929L5 14.5858V13.2361C4.38625 12.6868 4 11.8885 4 11V6C4 4.34315 5.34315 3 7 3H11V2C11 1.44772 11.4477 1 12 1ZM7 5C6.44772 5 6 5.44772 6 6V11C6 11.5523 6.44772 12 7 12H17C17.5523 12 18 11.5523 18 11V6C18 5.44772 17.5523 5 17 5H7ZM9 7C9.55228 7 10 7.44772 10 8V9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9V8C8 7.44772 8.44772 7 9 7ZM15 7C15.5523 7 16 7.44772 16 8V9C16 9.55228 15.5523 10 15 10C14.4477 10 14 9.55228 14 9V8C14 7.44772 14.4477 7 15 7Z" fill="currentColor"/></svg> },
  { title: "Real-time analytics", desc: "Track campaign performance, creator engagement, and ROI in real time.", icon: <CentralIcon name="IconLayoutColumn" size={20} color="currentColor" {...ci} /> },
  { title: "Streamlined payouts", desc: "Automated payout processing with full audit trails.", icon: <CentralIcon name="IconCreditCard1" size={20} color="currentColor" {...ci} /> },
];

export function WalkthroughStep({ onStartDemo, variant }: WalkthroughStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-8 px-6 py-8">
      {/* Success indicator */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-[#00B259]/10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#00B259" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          You&apos;re all set!
        </h2>
        <p className="max-w-[340px] text-center text-[13px] leading-[20px] text-page-text-muted">
          {variant === "creator"
            ? "Your account is ready. Take a quick tour to see what's new."
            : "Your workspace is ready. Take a quick tour to see what's new in v2."}
        </p>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col gap-2 rounded-xl border border-border bg-card-bg p-4">
            <span className="text-page-text-muted">{f.icon}</span>
            <span className="text-[13px] font-semibold text-page-text">{f.title}</span>
            <span className="text-[12px] font-medium leading-[17px] text-page-text-subtle">{f.desc}</span>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex w-full flex-col gap-2"
      >
        <button
          type="button"
          onClick={onStartDemo}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full font-inter text-[14px] font-semibold tracking-[-0.02em] text-white transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}
        >
          Start the tour
        </button>

        <button
          type="button"
          className="cursor-pointer py-2 text-[13px] font-medium text-page-text-subtle transition-colors hover:text-page-text"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  );
}
