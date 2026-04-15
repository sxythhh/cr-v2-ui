"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { OtpInput } from "./otp-input";

interface PhoneStepProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  verified: boolean;
  onVerified: () => void;
  onNext?: () => void;
}

export function PhoneStep({ phone, onPhoneChange, verified, onVerified, onNext }: PhoneStepProps) {
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);

  const isValidPhone = phone.replace(/\D/g, "").length >= 7;

  const handleSendCode = () => {
    if (!isValidPhone) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setCodeSent(true);
    }, 1200);
  };

  const handleOtpComplete = (_code: string) => {
    setTimeout(() => {
      onVerified();
      onNext?.();
    }, 600);
  };

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          Verify your phone number
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          {codeSent
            ? `We sent a 6-digit code to ${phone}`
            : "We'll use this for account recovery and important notifications."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!codeSent ? (
          <motion.div
            key="phone-input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -16 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-page-text-muted">Phone number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-border bg-card-bg px-4 text-[14px] font-medium text-page-text outline-none transition-colors placeholder:text-page-text-subtle focus:border-[#FF6207] "
              />
            </div>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={!isValidPhone || sending}
              className="flex h-11 cursor-pointer items-center justify-center rounded-xl bg-foreground/[0.06] px-5 font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] disabled:cursor-default disabled:opacity-30"
            >
              {sending ? (
                <motion.div
                  className="size-4 rounded-full border-2 border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Send verification code"
              )}
            </button>
          </motion.div>
        ) : !verified ? (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            <OtpInput onComplete={handleOtpComplete} />

            <button
              type="button"
              onClick={() => setCodeSent(false)}
              className="text-left text-[13px] font-medium text-page-text-subtle transition-colors hover:text-page-text-muted"
            >
              Didn&apos;t receive it? Change number or resend
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
