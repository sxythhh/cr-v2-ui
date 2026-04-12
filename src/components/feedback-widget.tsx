"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

const CATEGORIES = [
  {
    label: "Issue",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 16V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M5 13a11 11 0 0 1 22 0v6a11 11 0 0 1-22 0v-6z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="16" cy="22" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "Idea",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4a9 9 0 0 0-5 16.5V24h10v-3.5A9 9 0 0 0 16 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 28h8M13 24v4M19 24v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Other",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="8" cy="16" r="2" fill="currentColor"/>
        <circle cx="16" cy="16" r="2" fill="currentColor"/>
        <circle cx="24" cy="16" r="2" fill="currentColor"/>
      </svg>
    ),
  },
];

export function FeedbackWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSelected(null);
      setFeedbackText("");
      setSubmitted(false);
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    setSelected(null);
    setFeedbackText("");
    setSubmitted(false);
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 left-5 z-[9999] w-[288px] font-inter tracking-[-0.02em]"
        >
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card-bg p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-medium tracking-[-0.576px] text-page-text">
                {submitted ? "Thanks!" : selected ? `Report ${selected.toLowerCase()}` : "What's on your mind?"}
              </span>
              <button onClick={handleClose} className="flex size-5 items-center justify-center text-page-text-muted transition-colors hover:text-page-text">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" fill="#00994D"/>
                  <path d="M11 16l3.5 3.5L21 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] font-medium text-page-text">Your feedback has been sent</span>
              </div>
            ) : selected ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us more..."
                  rows={4}
                  autoFocus
                  className="w-full resize-none rounded-xl bg-foreground/[0.04] px-3 py-2.5 text-[14px] text-page-text outline-none placeholder:text-page-text-muted dark:bg-white/[0.04]"
                />
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelected(null)} className="text-[13px] font-medium text-page-text-muted transition-colors hover:text-page-text">
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!feedbackText.trim()}
                    className="flex h-8 items-center rounded-full px-4 text-[13px] font-medium text-white transition-opacity disabled:opacity-40 hover:opacity-90"
                    style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setSelected(cat.label)}
                    className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-foreground/[0.02] px-4 py-4 text-page-text transition-colors hover:bg-foreground/[0.05] dark:bg-white/[0.02] dark:hover:bg-white/[0.05]"
                  >
                    <span className="text-page-text">{cat.icon}</span>
                    <span className="text-[14px] font-medium text-page-text">{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
