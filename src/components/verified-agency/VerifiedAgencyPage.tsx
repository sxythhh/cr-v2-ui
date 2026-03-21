"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Linkedin,
  Mail,
  MessageCircle,
  Search,
} from "lucide-react";
import AgencyDirectoryIcon from "@/assets/icons/agency-directory.svg";
import LockIcon from "@/assets/icons/lock-closed.svg";
import CursorHandIcon from "@/assets/icons/cursor-hand.svg";

// ── Color tokens (CSS variable references for dark mode support) ─────────────
const C = {
  bg: "var(--card-bg)",
  textPrimary: "var(--page-text)",
  textSecondary: "var(--page-text-subtle)",
  textMuted: "var(--page-text-muted)",
  surface: "var(--page-bg)",
  border: "var(--page-border)",
  blue: "#1F69FF",
};

// ── Agency logo placeholder ──────────────────────────────────────────────────
function AgencyLogo({
  name,
  bg,
  size = 72,
  radius = 16,
  fontSize = 20,
}: {
  name: string;
  bg: string;
  size?: number;
  radius?: number;
  fontSize?: number;
}) {
  const initials = name
    .split(/[\s+&]+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight: 600,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "-0.5px",
        }}
      >
        {initials}
      </span>
    </div>
  );
}

// ── Verified badge SVG ───────────────────────────────────────────────────────
function VerifiedBadge({ size = 16 }: { size?: number }) {
  return (
    <img src="/icons/verified-check.svg" alt="Verified" width={size} height={size} className="dark:invert" />
  );
}

// ── Agency card illustration (hero right side) ───────────────────────────────
function AgencyCardIllustration() {
  return (
    <div
      style={{
        width: "100%",
        height: 328,
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating agency logos - left */}
      <div
        style={{
          position: "absolute",
          left: -12,
          bottom: 121,
          display: "flex",
          gap: 12,
        }}
      >
        <AgencyLogo name="Ogilvy" bg="#B8A898" />
        <AgencyLogo name="Huge" bg="#1a1a2e" />
      </div>

      {/* Floating agency logos - right */}
      <div
        style={{
          position: "absolute",
          right: -12,
          bottom: 121,
          display: "flex",
          gap: 12,
        }}
      >
        <AgencyLogo name="Wieden Kennedy" bg="#0f4c3a" />
        <AgencyLogo name="Droga5" bg="#2d1b4e" />
      </div>

      {/* Center card */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 2,
          transform: "translateX(-50%)",
          width: 280,
          background: "var(--card-bg)",
          borderRadius: "18px 18px 0 0",
          boxShadow:
            "0px 48px 48px -32px rgba(47,53,71,0.08), 0px 40px 40px -24px rgba(47,53,71,0.08), 0px 24px 24px -12px rgba(47,53,71,0.08), 0px 12px 12px -8px rgba(47,53,71,0.08), 0px 4px 4px -3px rgba(47,53,71,0.08)",
          padding: "6px 6px 4px",
        }}
      >
        {/* Card header */}
        <div
          style={{
            backgroundColor: C.surface,
            borderRadius: 12,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 19,
          }}
        >
          {/* Agency info row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <AgencyLogo name="Soar" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" size={52} radius={6} fontSize={18} />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  fontSize: 13.2,
                  fontWeight: 100,
                  letterSpacing: "-0.066px",
                  color: "#C0C7D1",
                }}
              >
                agency
              </span>
            </div>
          </div>

          {/* Name + verified */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontSize: 15.8,
                fontWeight: 600,
                letterSpacing: "-0.087px",
                lineHeight: "22px",
                color: C.textSecondary,
              }}
            >
              Soar with Us
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 4,
              }}
            >
              <VerifiedBadge />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: C.textSecondary,
                }}
              >
                Verified Agency
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ padding: "6px 0 0" }}>
          {/* Visit Website - full width */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 34,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              margin: "0 6px",
            }}
          >
            <Globe
              size={19}
              color={C.textSecondary}
              strokeWidth={1.5}
              style={{ opacity: 0.68 }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "20px",
                color: C.textPrimary,
              }}
            >
              Visit Website
            </span>
          </div>

          {/* Contact + LinkedIn row */}
          <div
            style={{
              display: "flex",
              gap: 8,
              margin: "10px 6px 6px",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                height: 34,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
              }}
            >
              <Mail
                size={19}
                color={C.textSecondary}
                strokeWidth={1.5}
                style={{ opacity: 0.68 }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: C.textSecondary,
                }}
              >
                Contact
              </span>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                height: 34,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
              }}
            >
              <Linkedin
                size={19}
                color={C.textSecondary}
                strokeWidth={1.5}
                style={{ opacity: 0.68 }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: C.textSecondary,
                }}
              >
                LinkedIn
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feature card illustrations ───────────────────────────────────────────────
function BrowserCard() {
  return (
    <div
      style={{
        width: "100%",
        height: 120,
        backgroundColor: C.surface,
        border: `1px solid ${C.surface}`,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* White inset card */}
      <div
        style={{
          position: "absolute",
          right: 1,
          bottom: 1,
          width: "calc(100% - 20px)",
          height: 80,
          backgroundColor: "var(--card-bg)",
          borderRadius: "8px 0 0 0",
          boxShadow:
            "0px 48px 48px -32px rgba(47,53,71,0.08), 0px 24px 24px -12px rgba(47,53,71,0.08), 0px 4px 4px -3px rgba(47,53,71,0.08)",
        }}
      />

      {/* Traffic light dots */}
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          display: "flex",
          gap: 3,
        }}
      >
        <div
          style={{ width: 4, height: 4, borderRadius: 2, background: "#FF5E57" }}
        />
        <div
          style={{ width: 4, height: 4, borderRadius: 2, background: "#FFB700" }}
        />
        <div
          style={{ width: 4, height: 4, borderRadius: 2, background: "#00CC1A" }}
        />
      </div>

      {/* URL bar */}
      <div
        style={{
          position: "absolute",
          left: 4,
          top: 30,
          right: 4,
          height: 32,
          backgroundColor: C.surface,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          padding: "6px 0 6px 6px",
          gap: 6,
        }}
      >
        <Search size={20} color="#A4ACB9" strokeWidth={1.33} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "16px",
            color: C.textMuted,
          }}
        >
          https://foreplay.co/agencies/your-agency
        </span>
      </div>

      {/* Verified badge floating */}
      <svg
        width={42}
        height={42}
        viewBox="0 0 16 16"
        fill="none"
        style={{
          position: "absolute",
          right: 80,
          top: 15,
          transform: "rotate(15deg)",
        }}
      >
        <path
          d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"
          fill={C.blue}
        />
        <path
          d="M6.5 10.8L4 8.3l1-1 1.5 1.5L10 5.3l1 1-4.5 4.5z"
          fill="#fff"
        />
      </svg>
    </div>
  );
}

function BadgeCard() {
  return (
    <div
      style={{
        width: "100%",
        height: 120,
        backgroundColor: C.surface,
        border: `1px solid ${C.surface}`,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dark badge widget - rotated 6deg */}
      <div
        style={{
          position: "absolute",
          left: 16.65,
          top: 22.09,
          display: "flex",
          alignItems: "center",
          padding: "2.71px 7.22px 2.71px 2.71px",
          gap: 8.12,
          width: 168.06,
          height: 51.45,
          background:
            "linear-gradient(0deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08)), #060710",
          borderRadius: 12,
          transform: "rotate(6deg)",
        }}
      >
        {/* Logo container */}
        <div
          style={{
            width: 46.02,
            height: 46.03,
            borderRadius: 9,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AgencyLogo name="Foreplay" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" size={32} radius={6} fontSize={13} />
        </div>

        {/* Text area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "2.71px 4.51px 2.71px 0",
            gap: 2.62,
            minWidth: 103.99,
          }}
        >
          <span
            style={{
              fontSize: 13.2,
              fontWeight: 100,
              letterSpacing: "-0.066px",
              lineHeight: "13.54px",
              color: "#C0C7D1",
            }}
          >
            foreplay
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3.61,
              marginTop: 0.9,
            }}
          >
            <VerifiedBadge size={14.44} />
            <span
              style={{
                fontSize: 10.8,
                fontWeight: 300,
                lineHeight: "14px",
                color: "#FFFFFF",
              }}
            >
              Verified Agency
            </span>
          </div>
        </div>
      </div>

      {/* Gray lock button */}
      <div
        style={{
          position: "absolute",
          left: 201,
          top: "50%",
          transform: "translateY(-50%)",
          width: 140,
          height: 52,
          backgroundColor: C.border,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LockIcon width={20} height={20} style={{ color: C.textMuted }} />
      </div>

      {/* Cursor hand icon */}
      <CursorHandIcon
        width={24}
        height={24}
        style={{
          position: "absolute",
          left: 159,
          top: 28,
        }}
      />
    </div>
  );
}

function NewsletterCard() {
  return (
    <div
      style={{
        width: "100%",
        height: 120,
        backgroundColor: C.surface,
        border: `1px solid ${C.surface}`,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* White content area */}
      <div
        style={{
          position: "absolute",
          left: 17,
          top: 17,
          right: 0,
          bottom: 0,
          backgroundColor: "var(--card-bg)",
          boxShadow:
            "0px 48px 48px -32px rgba(47,53,71,0.08), 0px 24px 24px -12px rgba(47,53,71,0.08), 0px 4px 4px -3px rgba(47,53,71,0.08)",
        }}
      />
      {/* Badge pill */}
      <div
        style={{
          position: "absolute",
          left: 23,
          top: 25,
          backgroundColor: C.surface,
          borderRadius: 24,
          padding: "4px 6px",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "16px",
            color: C.textSecondary,
          }}
        >
          300K+ People
        </span>
      </div>
      {/* Placeholder lines */}
      <div
        style={{
          position: "absolute",
          left: 23,
          top: 58,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 180,
            height: 8,
            backgroundColor: C.border,
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: 140,
            height: 8,
            backgroundColor: C.border,
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: 160,
            height: 8,
            backgroundColor: C.border,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}

// ── Application Form ──────────────────────────────────────────────────────────

const inputClass = cn(
  "flex h-10 w-full items-center rounded-[14px] bg-foreground/[0.04] px-3.5",
  "font-inter text-[14px] leading-[1.2] tracking-[-0.02em] text-page-text",
  "placeholder:text-page-text-muted outline-none",
  "focus:ring-1 focus:ring-foreground/20",
);

const formLabelClass =
  "font-inter text-[13px] font-medium leading-[24px] tracking-[-0.02em] text-page-text";

const JOB_LEVELS = ["Individual Contributor", "Manager", "Director", "VP", "C-Level / Executive"];
const JOB_FUNCTIONS = ["Marketing", "Growth", "Product", "Engineering", "Design", "Operations", "Sales", "Other"];
const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Netherlands", "South Africa", "Brazil", "India", "Japan", "Other",
];

function FormSelectInput({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-0">
      <div className="flex w-[160px] shrink-0 items-center pt-2">
        <span className={formLabelClass}>{label}</span>
      </div>
      <div className="relative flex-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            inputClass,
            "cursor-pointer appearance-none pr-10",
            !value && "text-page-text-muted",
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-page-text" />
      </div>
    </div>
  );
}

function FormTextInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-0">
      <div className="flex w-[160px] shrink-0 items-center pt-2">
        <span className={formLabelClass}>{label}</span>
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputClass, "flex-1")}
      />
    </div>
  );
}

function DocumentsIcon() {
  return (
    <svg width="34" height="40" viewBox="0 0 34 40" fill="none">
      <path d="M0 4C0 1.79 1.79 0 4 0H22L34 12V30C34 32.21 32.21 34 30 34H4C1.79 34 0 32.21 0 30V4Z" fill="#80E9FF" />
      <path d="M8 6C8 3.79 9.79 2 12 2H26L34 10V36C34 38.21 32.21 40 30 40H12C9.79 40 8 38.21 8 36V6Z" fill="#7A73FF" />
      <path d="M8 6C8 3.79 9.79 2 12 2H26L34 10V36C34 38.21 32.21 40 30 40H12C9.79 40 8 38.21 8 36V6Z" fill="#0048E5" fillOpacity="0.6" />
    </svg>
  );
}

function AgencyApplicationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [jobFunction, setJobFunction] = useState("");
  const [country, setCountry] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = firstName && lastName && email && website && jobLevel && jobFunction && country;

  return (
    <>
    {/* Success dialog */}
    {submitted && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative flex w-full max-w-[576px] flex-col items-start rounded-[20px] bg-[#F2F2F2] p-8 dark:bg-[#1e1e1e]">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="absolute right-8 top-8 flex size-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#CAD0D9] bg-white transition-colors hover:bg-[#F5F5F5] dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5.5 5.5L12.5 12.5M12.5 5.5L5.5 12.5" stroke="#383E47" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
          </button>

          {/* Content */}
          <div className="flex w-full flex-col items-center px-12 py-24 gap-2.5">
            {/* Checkmark illustration */}
            <svg width="213" height="120" viewBox="0 0 213 120" fill="none" className="mb-4">
              <path d="M158.342 3.0876L148.457 4.84691C147.399 5.03327 146.422 5.54765 145.662 6.30803L103.356 48.6134L85.3382 30.0214C84.1231 28.769 82.3638 28.195 80.6417 28.5007L70.809 30.2451C69.7504 30.4314 68.7739 30.9458 68.0135 31.7062L52.5375 47.1896C50.4875 49.2396 50.4875 52.5719 52.5375 54.6294L74.9389 77.0308L93.3669 95.4588C94.582 96.6739 96.3115 97.2181 98.0037 96.9199L107.889 95.1606C108.947 94.9742 109.924 94.4598 110.684 93.6995L177.687 26.6966C179.737 24.6466 179.737 21.3143 177.687 19.2568L162.971 4.54126C161.756 3.32615 160.027 2.78195 158.335 3.08014L158.342 3.0876Z" stroke="#EB6821" strokeWidth="2" strokeLinejoin="round" />
              <path d="M69.5417 30.8862L95.3126 56.6571L103.356 48.606" stroke="#EB6821" strokeWidth="2" strokeLinejoin="round" />
              <path d="M144.856 7.11308L146.839 5.13013L167.206 25.5038L95.8567 96.8528" stroke="#EB6821" strokeLinejoin="round" />
              <path d="M179.774 23.2673L167.206 25.5037" stroke="#EB6821" strokeLinejoin="round" />
            </svg>

            {/* Heading */}
            <h2 className="font-[family-name:var(--font-geist-sans)] text-[29.6px] font-semibold leading-[38px] tracking-[-0.32px] text-[#232529] dark:text-white">
              We&apos;ll be in touch soon!
            </h2>

            {/* Description */}
            <p className="max-w-[350px] text-center font-inter text-[16px] font-medium leading-[22px] tracking-[-0.16px] text-[#505967] dark:text-page-text-muted">
              Our team will be in touch soon. If you have any questions, please email us at{" "}
              <a href="mailto:support@contentrewards.com" className="text-[#EB6821] hover:underline">
                support@contentrewards.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Form */}
    <div className="flex w-full max-w-[540px] flex-col overflow-hidden rounded-2xl border border-border bg-card-bg shadow-[0px_30px_60px_-12px_rgba(50,50,93,0.25),0px_18px_36px_-18px_rgba(0,0,0,0.3)] dark:border-[#2a2a2a] dark:bg-[#191919]">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-border p-4 dark:border-[#2a2a2a]">
        <DocumentsIcon />
        <div className="flex flex-col gap-1">
          <span className="font-inter text-[14px] font-medium leading-[24px] tracking-[-0.02em] text-page-text">
            Apply for Verified Agency status
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" className="text-page-text-muted" />
                <path d="M6.5 3.5V6.5L8.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-page-text-muted" />
              </svg>
              <span className="font-inter text-[12px] font-light tracking-[-0.02em] text-page-text-muted">
                5 minute application
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
                <path d="M1 1h9v11H1V1z" stroke="currentColor" strokeWidth="1.2" className="text-page-text-muted" />
                <path d="M3.5 4h4M3.5 6.5h4M3.5 9h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-page-text-muted" />
              </svg>
              <span className="font-inter text-[12px] font-light tracking-[-0.02em] text-page-text-muted">
                7 fields
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3 p-4">
        <FormTextInput label="First name" placeholder="Jane" value={firstName} onChange={setFirstName} />
        <FormTextInput label="Last name" placeholder="Diaz" value={lastName} onChange={setLastName} />
        <FormTextInput label="Work email" placeholder="jane@example.com" type="email" value={email} onChange={setEmail} />
        <FormTextInput label="Company website" placeholder="example.com" value={website} onChange={setWebsite} />
        <FormSelectInput label="Job level" placeholder="Select a job level" options={JOB_LEVELS} value={jobLevel} onChange={setJobLevel} />
        <FormSelectInput label="Job function" placeholder="Select a job function" options={JOB_FUNCTIONS} value={jobFunction} onChange={setJobFunction} />
        <FormSelectInput label="Country / Region" placeholder="Select a country" options={COUNTRIES} value={country} onChange={setCountry} />

        {/* Email consent checkbox */}
        <div className="flex items-start gap-0">
          <div className="w-[160px] shrink-0" />
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 size-[13px] shrink-0 cursor-pointer rounded-[2.5px] border border-page-text-muted accent-[#635BFF]"
            />
            <span className="font-inter text-[12px] font-light leading-[20px] tracking-[-0.02em] text-page-text-subtle">
              Get emails about product updates, industry news, and events. You can{" "}
              <button type="button" className="font-medium text-[#635BFF] hover:underline">
                unsubscribe
              </button>{" "}
              at any time.
            </span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        {/* Submit button — right aligned */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => isValid && setSubmitted(true)}
            disabled={!isValid}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-2 rounded-full px-5 font-inter text-[14px] font-medium tracking-[-0.02em] text-white transition-all",
              isValid
                ? "cursor-pointer bg-foreground hover:bg-foreground/90"
                : "cursor-not-allowed bg-foreground/40",
            )}
          >
            Submit application
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M3.5 1.5L7 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Privacy footer */}
        <div className="flex items-start gap-0">
          <div className="w-[160px] shrink-0" />
          <span className="font-inter text-[10px] font-light leading-[16px] tracking-[-0.02em] text-page-text-muted">
            Content Rewards will handle your data pursuant to its{" "}
            <button type="button" className="font-medium text-[#635BFF] hover:underline">
              Privacy Policy
            </button>
          </span>
        </div>
      </div>
    </div>
    </>
  );
}

// ── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    question: "Is searching for an agency free?",
    answer:
      "Yes, feel free to browse the agency directory here. When you find one you like submit the contact form and we will connect you.",
  },
  {
    question: "How can I list my agency?",
    answer:
      "Access to the agency directory is included on the Agency Plan. If you're on another plan you can reach out directly to see if you qualify.",
  },
  {
    question: 'What are "Verified Agencies"?',
    answer:
      "Verified agencies are vetted by our team to ensure they meet our quality standards. Often they have been given a referral by Foreplay already and successfully serviced the referral.",
  },
  {
    question: "What are the benefits of being listed?",
    answer:
      "Foreplay is used by over 20,000 marketers from DTC brands to B2B GTM teams. Being listed in the directory gives you exposure to these marketers along with being featured in our newsletter of over 300,000 marketers.",
  },
];

// ── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: C.textSecondary,
            textAlign: "left",
          }}
        >
          {question}
        </span>
        {isOpen ? (
          <ChevronUp size={20} color={C.textSecondary} strokeWidth={1.5} />
        ) : (
          <ChevronDown size={20} color={C.textSecondary} strokeWidth={1.5} />
        )}
      </button>
      {isOpen && (
        <div style={{ paddingBottom: 20, paddingRight: 80 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 400,
              lineHeight: "20px",
              color: C.textMuted,
              margin: 0,
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  illustration,
  title,
  description,
}: {
  illustration: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column" }}>
      {illustration}
      <div style={{ marginTop: 20 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "20px",
            color: C.textSecondary,
            margin: 0,
          }}
        >
          {title}
        </p>
      </div>
      <div style={{ marginTop: 4 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "20px",
            color: C.textMuted,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function VerifiedAgencyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 16,
        fontFamily: "var(--font-geist-sans), sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1104 }}>
        {/* ── Hero section ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0,
          }}
        >
          {/* Left column */}
          <div
            style={{
              flex: "1 1 480px",
              minWidth: 320,
              padding: 28,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <AgencyDirectoryIcon width={20} height={20} style={{ color: C.textMuted }} />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  color: C.textMuted,
                }}
              >
                Agency Directory
              </span>
            </div>

            {/* Heading */}
            <div style={{ marginTop: 12, maxWidth: 420 }}>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  lineHeight: "36px",
                  color: C.textPrimary,
                  margin: 0,
                }}
              >
                Expand your reach and get inbound leads for your agency.
              </h1>
            </div>

            {/* Subtitle */}
            <div style={{ marginTop: 0, maxWidth: 440 }}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: "24px",
                  color: C.textPrimary,
                  margin: 0,
                }}
              >
                Set up your agency profile and get matched with business owners
                and executives looking to hire expert help for their marketing
                projects.
              </p>
            </div>

            {/* Upgrade notice */}
            <div style={{ marginTop: 56 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: 6,
                  backgroundColor: C.surface,
                  borderRadius: 6,
                }}
              >
                <LockIcon width={20} height={20} style={{ color: C.textSecondary }} />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "20px",
                    color: C.textSecondary,
                  }}
                >
                  You need to upgrade your plan to Agency.
                </span>
              </div>
            </div>
          </div>

          {/* Right column - illustration */}
          <div
            style={{
              flex: "1 1 480px",
              minWidth: 320,
            }}
          >
            <AgencyCardIllustration />
          </div>
        </div>

        {/* ── Features section ── */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 44,
              padding: 28,
            }}
          >
            <FeatureCard
              illustration={<BrowserCard />}
              title="Verified Branded Profile"
              description="Set up your page in under 15 minutes to drive website traffic from over 500k monthly visitors."
            />
            <FeatureCard
              illustration={<BadgeCard />}
              title="Agency Badge"
              description='Get your "Foreplay Agency" badge to embed on your website.'
            />
            <FeatureCard
              illustration={<NewsletterCard />}
              title="Newsletter Features"
              description="Submit case studies and agency wins to be featured in the Foreplay newsletter (300k subs)"
            />
          </div>
        </div>

        {/* ── Application Form section ── */}
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              padding: "0 28px",
            }}
          >
            {/* Left column */}
            <div style={{ width: 280, flexShrink: 0 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "24px",
                  color: C.textSecondary,
                  margin: 0,
                }}
              >
                Apply Now
              </h2>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: C.textMuted,
                  margin: "4px 0 0",
                }}
              >
                Fill out the form to apply for Verified Agency status and unlock premium features.
              </p>
            </div>

            {/* Right column - form */}
            <div style={{ flex: 1, minWidth: 320 }}>
              <AgencyApplicationForm />
            </div>
          </div>
        </div>

        {/* ── End / CTA section ── */}
        <div className="flex justify-center overflow-hidden py-20 sm:py-32">
          <div className="relative flex w-full max-w-[1400px] items-center pr-0 sm:pr-8">
            {/* Left — Text column */}
            <div className="relative z-10 flex w-full max-w-[420px] shrink-0 flex-col justify-center gap-12 px-7">
              {/* Header / Description */}
              <div className="flex flex-col gap-4">
                {/* Eyebrow */}
                <span className="font-inter text-sm font-semibold tracking-[-0.42px] text-[#353535] dark:text-page-text">
                  How it works
                </span>

                {/* Heading */}
                <div className="flex flex-col gap-6">
                  <h2 className="font-inter text-[30px] font-bold leading-[1.3] tracking-[-1.5px]">
                    <span className="text-[#000000] dark:text-white">Stop </span>
                    <span className="text-[#FF6207]">burning adspend</span>
                    <br />
                    <span className="text-[#000000] dark:text-white">on rising CPMs.</span>
                    <br />
                    <span className="font-medium text-[#616161] dark:text-page-text-muted">
                      Generate sustainable, organic growth.
                    </span>
                  </h2>

                  {/* Body */}
                  <p className="font-inter text-[15px] font-medium leading-[22px] tracking-[-0.45px] text-[#616161] dark:text-page-text-muted">
                    Content Rewards is a marketing tool that connects your business with content creators and allows you to run organic content campaigns.
                  </p>
                </div>
              </div>

              {/* Campaign types */}
              <div className="flex flex-col gap-6">
                <span className="font-inter text-sm font-semibold tracking-[-0.42px] text-[#353535] dark:text-page-text">
                  Types of Campaigns
                </span>

                <div className="flex flex-col gap-5">
                  {/* UGC */}
                  <div className="flex items-start gap-[61px]">
                    <div className="flex shrink-0 items-center gap-1.5">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="2" y="3.5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-[#000] dark:text-white" />
                        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" className="text-[#000] dark:text-white" />
                      </svg>
                      <span className="font-inter text-sm font-semibold tracking-[-0.42px] text-[#000] dark:text-white">
                        User-Generated Content
                      </span>
                    </div>
                    <p className="max-w-[200px] flex-1 font-inter text-[15px] font-medium leading-[22px] tracking-[-0.45px] text-[#616161] dark:text-page-text-muted">
                      Creators produce original content featuring your brand based on guidelines you provide
                    </p>
                  </div>

                  {/* Clipping */}
                  <div className="flex items-start gap-[165px]">
                    <div className="flex shrink-0 items-center gap-1.5">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="5" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" className="text-[#000] dark:text-white" />
                        <path d="M7 11.5L13 5M13 5H9.5M13 5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#000] dark:text-white" />
                      </svg>
                      <span className="font-inter text-sm font-semibold tracking-[-0.42px] text-[#000] dark:text-white">
                        Clipping
                      </span>
                    </div>
                    <p className="max-w-[200px] flex-1 font-inter text-[15px] font-medium leading-[22px] tracking-[-0.45px] text-[#616161] dark:text-page-text-muted">
                      Creators turn your existing long-form content into clips
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Demo video / screenshot */}
            <div className="absolute left-[500px] right-[-220px] top-1/2 z-[1] hidden -translate-y-1/2 items-center justify-center px-8 lg:flex">
              <div className="flex w-full max-w-[936px] flex-col items-start">
                <div className="relative flex w-full items-center justify-center rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-[0px_20px_40px_rgba(0,0,0,0.08)] dark:border-white/[0.08] dark:bg-[#1a1a1a]">
                  {/* Placeholder for demo screenshot */}
                  <div className="flex aspect-[920/613] w-full items-center justify-center rounded-lg bg-[rgba(136,136,136,0.08)]">
                    <span className="font-inter text-sm text-page-text-muted">Demo screenshot</span>
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E5E7EB] bg-white/50 p-1.5 backdrop-blur-[5px] dark:border-white/[0.08]">
                    <div className="flex size-14 items-center justify-center rounded-full bg-[#CFB671] shadow-[inset_-0.73px_0.73px_0.73px_-1.46px_rgba(255,255,255,0.35)]">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M19 15L33 24L19 33V15Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ section ── */}
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              padding: "0 28px",
            }}
          >
            {/* Left column */}
            <div style={{ width: 280, flexShrink: 0 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "24px",
                  color: C.textSecondary,
                  margin: 0,
                }}
              >
                FAQ
              </h2>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: C.textMuted,
                  margin: "4px 0 0",
                }}
              >
                Questions about the agency directory.
              </p>

              {/* Contact Support button */}
              <div style={{ marginTop: 20 }}>
                <button
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    boxShadow:
                      "0px 1px 2px rgba(4,26,75,0.13), 0px 0px 0px 1px rgba(0,56,108,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = C.surface;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <MessageCircle
                    size={20}
                    color={C.textMuted}
                    strokeWidth={1.5}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: "20px",
                      color: C.textSecondary,
                    }}
                  >
                    Contact Support
                  </span>
                </button>
              </div>
            </div>

            {/* Right column - FAQ accordion */}
            <div style={{ flex: 1, minWidth: 320 }}>
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
