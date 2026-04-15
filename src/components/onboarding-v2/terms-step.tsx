"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

/* ── TOS Content ── */

const TOS_SECTIONS = [
  { heading: "TERMS OF USE / SERVICE AGREEMENT", body: "" },
  { heading: "", body: "Date of last revision: November 5, 2024" },
  { heading: "", body: 'This terms of use or service agreement ("Agreement") is between Content Rewards Technologies, Inc. ("Content Rewards," "Company," "we," "us," "our," or "ourselves") and the person or entity ("you" or "your") that has decided to use our services; any of our websites or apps; or any features, products, graphics, text, images, photos, audio, video, location data, computer code, and all other forms of data and communications (collectively, "Services").' },
  { heading: "", body: "YOU MUST CONSENT TO THIS AGREEMENT TO USE OUR SERVICES. If you do not accept and agree to be bound by all of the terms of this Agreement, including the Privacy Policy, you cannot use Services." },
  { heading: "1. Description of the Services", body: "Content Rewards is a platform that connects brands with content creators for performance-based content distribution. It provides tools to manage campaigns, track submissions, process payouts, and analyze content performance." },
  { heading: "2. Accessing the Services", body: "We reserve the right to change the Services and any material we provide in the Services, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Services is unavailable at any time or for any period." },
  { heading: "3. Log-in Information", body: "If you choose, or are provided with, a username, password, or any other piece of information as part of our security procedures, you must treat such information as confidential, and you must not disclose it to any other person or entity." },
  { heading: "4. Intellectual Property", body: "Content Rewards respects the intellectual property of others and expects those who use the Services to do the same." },
  { heading: "5. Your Use of the Services", body: "By registering and using the Services, you represent and warrant you: (i) have the authority and capacity to enter this Agreement; (ii) are at least 18 years old; and (iii) are not precluded or restricted in any way from using the Services." },
  { heading: "6. Payments", body: "We use third-party payment services (currently, Stripe) to handle payment services. We do not provide refunds for any reason on our Services." },
  { heading: "7. Disclaimers and Liability", body: 'All information and services are provided on an "as is" basis without warranty of any kind, either express or implied. To the maximum extent permitted by law, our liability shall not exceed the total amount paid to us in the prior six months.' },
  { heading: "8. Termination", body: "We reserve an unrestricted right to refuse, terminate, block, or cancel your account at any time, with or without cause." },
  { heading: "9. General Provisions", body: "This Agreement, together with the Privacy Policy, constitutes the entire agreement between us." },
];

const PRIVACY_SECTIONS = [
  { heading: "PRIVACY POLICY", body: "" },
  { heading: "", body: "Date of last revision: December 26, 2024" },
  { heading: "1. Who We Are", body: 'Content Rewards Technologies, Inc. ("Content Rewards") is a platform for connecting brands with content creators for performance-based distribution.' },
  { heading: "2. Information Collection", body: "We collect: name, email address, payment information, company information, IP addresses, browser information, timestamps, and device type." },
  { heading: "3. Protecting Your Information", body: "We make reasonable efforts to keep your information safe. We encrypt data during transit via TLS and at rest if requested." },
  { heading: "4. Contact", body: "If you have any questions, contact us at help@contentrewards.com." },
];

/* ── Toggle ── */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative h-5 w-[50px] shrink-0 cursor-pointer rounded-full transition-colors"
      style={{
        background: checked ? "#FF6207" : "rgba(0,0,0,0.10)",
        boxShadow: checked ? "none" : "inset 0px 6px 12px rgba(0,0,0,0.02), inset 0px 0.75px 0.75px rgba(0,0,0,0.02)",
      }}
    >
      <style>{`
        @media (prefers-color-scheme: dark) {
          .tos-toggle-on { background: #E0E0E0 !important; }
          .tos-toggle-off { background: rgba(255,255,255,0.10) !important; }
        }
        .dark .tos-toggle-on { background: #E0E0E0 !important; }
        .dark .tos-toggle-off { background: rgba(255,255,255,0.10) !important; }
      `}</style>
      <div
        className={checked ? "tos-toggle-on" : "tos-toggle-off"}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "9999px",
          background: checked ? "#FF6207" : "rgba(0,0,0,0.10)",
        }}
      />
      <div
        className="absolute top-[2px] h-4 w-7 rounded-full bg-card-bg transition-[left] duration-200"
        style={{
          left: checked ? 20 : 2,
          boxShadow: "0px 6px 12px -3px rgba(0,0,0,0.06), 0px 3px 6px -1px rgba(0,0,0,0.06), 0px 1px 2px rgba(0,0,0,0.04)",
        }}
      />
    </button>
  );
}

/* ── Component ── */

interface TermsStepProps {
  agreed: boolean;
  onAgreeChange: (agreed: boolean) => void;
  agreedEmails: boolean;
  onAgreedEmailsChange: (agreed: boolean) => void;
}

export function TermsStep({ agreed, onAgreeChange, agreedEmails, onAgreedEmailsChange }: TermsStepProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex w-full flex-1 flex-col">
      {/* Heading */}
      <div className="shrink-0 px-6 pb-4">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          Terms of Service & Privacy Policy
        </h2>
        <p className="mt-1 text-[13px] leading-[20px] text-page-text-muted">
          Please review and accept to continue.
        </p>
      </div>

      {/* Scrollable content */}
      <div className="relative min-h-0 flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-page-bg to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-page-bg to-transparent" />

        <div
          ref={scrollRef}
          className="h-full overflow-y-auto px-6"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col gap-4 py-4">
            {TOS_SECTIONS.map((s, i) => (
              <p key={`tos-${i}`} className={cn(
                "text-[12.4px] leading-[21px] text-page-text-muted",
                s.heading && "font-medium",
              )}>
                {s.heading && <>{s.heading}{s.body ? " " : ""}</>}
                {s.body}
              </p>
            ))}
            <div className="mt-4">
              {PRIVACY_SECTIONS.map((s, i) => (
                <p key={`pp-${i}`} className={cn(
                  "mt-4 text-[12.4px] leading-[21px] text-page-text-muted",
                  s.heading && "font-medium",
                )}>
                  {s.heading && <>{s.heading}{s.body ? " " : ""}</>}
                  {s.body}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consent toggles */}
      <div className="shrink-0 border-t border-border">
        <div className="flex items-center justify-between gap-3 px-6 py-3">
          <span className={cn(
            "text-[12.5px] leading-[21px] transition-colors",
            agreed ? "text-page-text" : "text-page-text-subtle",
          )}>
            I agree to Content Rewards&apos;s Terms of Service and Privacy Policy.
          </span>
          <Toggle checked={agreed} onChange={onAgreeChange} />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-3">
          <span className="text-[12.5px] leading-[21px] text-page-text">
            I want to receive product updates and launch emails.
          </span>
          <Toggle checked={agreedEmails} onChange={onAgreedEmailsChange} />
        </div>
      </div>
    </div>
  );
}
