"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

/* ── Icons ────────────────────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor">
      <path d="M13.338 9.514c-.024-2.477 2.024-3.667 2.116-3.724-1.152-1.685-2.946-1.915-3.584-1.941-1.526-.155-2.978.898-3.753.898-.775 0-1.972-.875-3.24-.852C3.243 3.919 1.71 4.814.88 6.258c-1.676 2.908-.429 7.215 1.204 9.575.798 1.154 1.751 2.452 3.002 2.406 1.203-.048 1.659-.78 3.113-.78 1.454 0 1.862.78 3.133.756 1.296-.024 2.118-1.176 2.912-2.334.918-1.338 1.296-2.633 1.32-2.7-.029-.013-2.532-.972-2.556-3.856l.33.189ZM11.008 2.63C11.678 1.824 12.13.735 12.01-.356c-.942.038-2.084.627-2.76 1.418-.607.702-1.138 1.824-.996 2.901 1.05.082 2.122-.533 2.754-1.334Z" />
    </svg>
  );
}

function WhopIcon() {
  return (
    <svg width="18" height="10" viewBox="0 0 20 10" fill="none">
      <path d="M3.17762 -0.000976562C1.86403 -0.000976562 0.958502 0.561988 0.273238 1.19861C0.273238 1.19861 -0.00346338 1.45473 3.28554e-05 1.46253L2.87794 4.27344L5.75532 1.46253C5.21042 0.729801 4.18304 -0.000976562 3.17762 -0.000976562Z" fill="currentColor" />
      <path d="M10.2839 -0.000976562C8.9703 -0.000976562 8.06477 0.561987 7.37947 1.19861C7.37947 1.19861 7.12677 1.4479 7.11531 1.46253L3.55811 4.93738L6.43153 7.74389L12.8616 1.46253C12.3167 0.729802 11.2898 -0.000976562 10.2839 -0.000976562Z" fill="currentColor" />
      <path d="M17.4092 -0.000976562C16.0956 -0.000976562 15.1901 0.561987 14.5048 1.19861C14.5048 1.19861 14.2416 1.44984 14.2316 1.46253L7.11572 8.41368L7.86892 9.14933C9.0342 10.2875 10.9416 10.2875 12.1069 9.14933L19.9779 1.46253H19.9869C19.442 0.729802 18.4151 -0.000976562 17.4092 -0.000976562Z" fill="currentColor" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7L13.03 12.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function ContentRewardsLogo() {
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
      <path d="M1.46528 4.70024L2.33182 3.52641L2.63864 4.94587L4.03965 5.39511L2.76436 6.12145L2.76366 7.57274L1.66807 6.60218L0.266706 7.05002L0.865462 5.72365L0 4.5491L1.46528 4.70024Z" fill="currentColor" />
      <path d="M1.11974 10.3214L0.600885 9.17206L1.81544 9.56043L2.76472 8.71897L2.76507 9.97678L3.87061 10.6062L2.6564 10.9956L2.39041 12.2262L1.63965 11.2087L0.369692 11.3396L1.11974 10.3214Z" fill="currentColor" />
      <path d="M5.75495 13.1162L4.77833 13.0147L5.50777 12.3667L5.30393 11.4204L6.15483 11.9038L7.00573 11.4204L6.80188 12.3667L7.53168 13.0147L6.55471 13.1162L6.15483 14L5.75495 13.1162Z" fill="currentColor" />
      <path d="M10.6519 11.188L9.91254 12.1897L9.65045 10.9781L8.45507 10.595L9.54355 9.97502L9.54391 8.73645L10.4786 9.56496L11.6747 9.18254L11.1637 10.3144L11.9023 11.3168L10.6519 11.188Z" fill="currentColor" />
      <path d="M11.441 5.72188L12.0398 7.04826L10.6384 6.60042L9.54321 7.57098L9.5425 6.11968L8.26686 5.39334L9.66787 4.9441L9.9747 3.52465L10.8412 4.69848L12.3065 4.54734L11.441 5.72188Z" fill="currentColor" />
      <path d="M6.95247 1.76758L8.90606 1.97086L7.44681 3.26646L7.85451 5.15965L6.1527 4.19259L4.45125 5.15965L4.85859 3.26646L3.39934 1.97086L5.35294 1.76758L6.1527 0L6.95247 1.76758Z" fill="currentColor" />
    </svg>
  );
}

/* ── Divider ──────────────────────────────────────────────────── */

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-foreground/[0.06]" />
      <span className="text-xs tracking-[-0.02em] text-page-text-muted">or</span>
      <div className="h-px flex-1 bg-foreground/[0.06]" />
    </div>
  );
}

/* ── Input field ──────────────────────────────────────────────── */

function AuthInput({ label, type = "text", placeholder, value, onChange }: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">{label}</label>
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] px-3.5 text-sm tracking-[-0.02em] text-page-text outline-none transition-colors placeholder:text-page-text-muted/50 focus:border-[#FF8003] dark:border-white/[0.06] dark:bg-white/[0.02]"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-page-text-muted transition-colors hover:text-page-text"
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Social button ────────────────────────────────────────────── */

function SocialButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-foreground/[0.08] bg-white text-sm font-medium tracking-[-0.02em] text-page-text transition-all hover:bg-foreground/[0.02] active:scale-[0.98] dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
    >
      {icon}
      {label}
    </button>
  );
}

/* ── Auth Modal ───────────────────────────────────────────────── */

type AuthView = "login" | "signup" | "forgot";

export function AuthModal({ open, onClose, initialView = "login" }: {
  open: boolean;
  onClose: () => void;
  initialView?: AuthView;
}) {
  const [view, setView] = useState<AuthView>(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Sync view when initialView changes
  useEffect(() => { setView(initialView); }, [initialView]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)] dark:border-white/[0.06] dark:bg-[#161616] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-6 p-8"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-1.5 text-page-text-muted">
                  <ContentRewardsLogo />
                  <span className="text-xs tracking-[-0.02em]">Content Rewards</span>
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-page-text" style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}>
                  Welcome back
                </h2>
              </div>

              {/* Social logins */}
              <div className="flex flex-col gap-2.5">
                <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
                <SocialButton icon={<AppleIcon />} label="Continue with Apple" />
                <button
                  type="button"
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.265) 0%, rgba(255,255,255,0.0053) 100%), #110D0C",
                    boxShadow: "inset 0px 1px 0px rgba(255,255,255,0.36)",
                  }}
                >
                  <WhopIcon />
                  Continue with Whop
                </button>
              </div>

              <Divider />

              {/* Email/password */}
              <div className="flex flex-col gap-3">
                <AuthInput label="Email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />
                <AuthInput label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
              </div>

              {/* Forgot password */}
              <button
                type="button"
                onClick={() => { setView("forgot"); setResetSent(false); }}
                className="cursor-pointer self-end text-xs font-medium tracking-[-0.02em] text-[#FF8003] transition-opacity hover:opacity-80"
              >
                Forgot password?
              </button>

              {/* Submit */}
              <button
                type="button"
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-page-text text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90 active:scale-[0.98] dark:bg-white dark:text-[#151515]"
              >
                Sign in
              </button>

              {/* Switch view */}
              <p className="text-center text-sm tracking-[-0.02em] text-page-text-muted">
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => setView("signup")} className="cursor-pointer font-medium text-[#FF8003] underline-offset-2 hover:underline">
                  Sign up
                </button>
              </p>
            </motion.div>
          )}

          {view === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-5 px-8 pb-6 pt-8"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 text-page-text-muted">
                  <ContentRewardsLogo />
                  <span className="text-xs tracking-[-0.02em]">Content Rewards</span>
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-page-text" style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}>
                  Create your account
                </h2>
              </div>

              {/* Social logins */}
              <div className="flex flex-col gap-2">
                <SocialButton icon={<GoogleIcon />} label="Sign up with Google" />
                <SocialButton icon={<AppleIcon />} label="Sign up with Apple" />
                <button
                  type="button"
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.265) 0%, rgba(255,255,255,0.0053) 100%), #110D0C",
                    boxShadow: "inset 0px 1px 0px rgba(255,255,255,0.36)",
                  }}
                >
                  <WhopIcon />
                  Sign up with Whop
                </button>
              </div>

              <Divider />

              {/* Form fields */}
              <div className="flex flex-col gap-3">
                <AuthInput label="Email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />
                <AuthInput label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={setPassword} />
              </div>

              {/* Submit */}
              <button
                type="button"
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "#FF8003",
                  boxShadow: "inset 0px 1px 2px rgba(255,255,255,0.25), inset 0px -1px 1px rgba(0,0,0,0.1)",
                }}
              >
                Create account
              </button>

              {/* Terms + switch */}
              <p className="text-center text-[11px] leading-[16px] tracking-[-0.02em] text-page-text-muted">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-[#FF8003] underline-offset-2 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-[#FF8003] underline-offset-2 hover:underline">Privacy Policy</a>
              </p>

              {/* Switch view */}
              <p className="text-center text-sm tracking-[-0.02em] text-page-text-muted">
                Already have an account?{" "}
                <button type="button" onClick={() => setView("login")} className="cursor-pointer font-medium text-[#FF8003] underline-offset-2 hover:underline">
                  Sign in
                </button>
              </p>
            </motion.div>
          )}

          {view === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-6 p-8"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/[0.04] dark:bg-white/[0.06]">
                  <EmailIcon />
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-page-text" style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}>
                  {resetSent ? "Check your email" : "Reset password"}
                </h2>
                <p className="max-w-[280px] text-center text-sm tracking-[-0.02em] text-page-text-muted">
                  {resetSent
                    ? `We've sent a reset link to ${email}`
                    : "Enter your email and we'll send you a link to reset your password."
                  }
                </p>
              </div>

              {!resetSent && (
                <>
                  <AuthInput label="Email" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />

                  <button
                    type="button"
                    onClick={() => setResetSent(true)}
                    className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-page-text text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90 active:scale-[0.98] dark:bg-white dark:text-[#151515]"
                  >
                    Send reset link
                  </button>
                </>
              )}

              {resetSent && (
                <button
                  type="button"
                  onClick={() => { setResetSent(false); setView("login"); }}
                  className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-page-text text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90 active:scale-[0.98] dark:bg-white dark:text-[#151515]"
                >
                  Back to sign in
                </button>
              )}

              {!resetSent && (
                <p className="text-center text-sm tracking-[-0.02em] text-page-text-muted">
                  Remember your password?{" "}
                  <button type="button" onClick={() => setView("login")} className="cursor-pointer font-medium text-[#FF8003] underline-offset-2 hover:underline">
                    Sign in
                  </button>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
