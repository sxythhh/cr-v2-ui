"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { VerifiedAgencyDrawer } from "./VerifiedAgencyDrawer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { motion, AnimatePresence } from "motion/react";
import { FloatingPortal } from "@floating-ui/react";
import { springs } from "@/lib/springs";

import {
  ChevronDown,
  ChevronUp,
  Globe,
  Linkedin,
  Mail,
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
    <img src="/icons/verified-check.svg" alt="Verified" width={size} height={size} />
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
        <img src="/icons/agency1.avif" alt="" width={48} height={48} style={{ borderRadius: 12, objectFit: "cover" }} />
        <img src="/icons/agency2.avif" alt="" width={48} height={48} style={{ borderRadius: 12, objectFit: "cover" }} />
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
        <img src="/icons/agency3.avif" alt="" width={48} height={48} style={{ borderRadius: 12, objectFit: "cover" }} />
        <img src="/icons/agency4.avif" alt="" width={48} height={48} style={{ borderRadius: 12, objectFit: "cover" }} />
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
                  fontWeight: 400,
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
        border: `1px solid ${C.border}`,
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
          height: 72,
          backgroundColor: "var(--card-bg)",
          borderRadius: "8px 0 0 0",
        }}
      />

      {/* Traffic light dots */}
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          display: "flex",
          gap: 4,
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: 3, background: "#FF5E57" }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: "#FFB700" }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: "#00CC1A" }} />
      </div>

      {/* URL bar */}
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 28,
          right: 6,
          height: 28,
          backgroundColor: C.surface,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          gap: 6,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3.5 6.5L5 8L8.5 4.5" stroke="#00B259" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="6" r="5" stroke="#00B259" strokeWidth="1" />
        </svg>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            lineHeight: "14px",
            color: C.textMuted,
            fontFamily: "var(--font-inter), Inter, sans-serif",
          }}
        >
          contentrewards.com/agencies/your-agency
        </span>
      </div>

      {/* Placeholder content lines */}
      <div style={{ position: "absolute", left: 26, bottom: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ width: 140, height: 6, backgroundColor: C.border, borderRadius: 3 }} />
        <div style={{ width: 100, height: 6, backgroundColor: C.border, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function BrandedProfileCard() {
  return (
    <div
      style={{
        width: "100%",
        height: 120,
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      {/* Browser chrome */}
      <div style={{ position: "absolute", left: 10, top: 8, display: "flex", gap: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: 3, background: "#FF5E57" }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: "#FFB700" }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: "#00CC1A" }} />
      </div>

      {/* URL bar */}
      <div style={{ position: "absolute", left: 6, top: 22, right: 6, height: 22, backgroundColor: "var(--card-bg)", borderRadius: 4, display: "flex", alignItems: "center", padding: "0 6px", gap: 4 }}>
        <span style={{ fontSize: 8, fontWeight: 500, color: C.textMuted }}>contentrewards.com/agency/your-agency</span>
      </div>

      {/* Profile preview */}
      <div style={{ position: "absolute", left: 10, top: 50, right: 10, bottom: 6, backgroundColor: "var(--card-bg)", borderRadius: 6, padding: "8px 10px", display: "flex", gap: 8, alignItems: "center" }}>
        {/* Avatar */}
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>A</span>
        </div>
        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.textPrimary }}>Agency Name</span>
            <VerifiedBadge size={10} />
          </div>
        </div>
        {/* Stats */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: "#00B259" }}>12 campaigns</span>
          <span style={{ fontSize: 8, fontWeight: 500, color: C.textMuted }}>47 creators</span>
        </div>
      </div>
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
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dark badge widget - rotated 6deg */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 28,
          display: "flex",
          alignItems: "center",
          padding: "4px 10px 4px 4px",
          gap: 8,
          background: "linear-gradient(0deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08)), #0A0A0A",
          borderRadius: 12,
          transform: "rotate(6deg)",
        }}
      >
        {/* Favicon */}
        <img src="/icons/cr-favicon.png" alt="" width={38} height={38} style={{ borderRadius: 8, flexShrink: 0 }} />

        {/* Text area */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: "14px", color: "#8A8A8A", fontFamily: "var(--font-inter), Inter, sans-serif", whiteSpace: "nowrap" }}>
            Agency Name
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <VerifiedBadge size={12} />
            <span style={{ fontSize: 10, fontWeight: 500, lineHeight: "12px", color: "#FFFFFF", fontFamily: "var(--font-inter), Inter, sans-serif", whiteSpace: "nowrap" }}>
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
          width: 120,
          height: 48,
          backgroundColor: C.border,
          borderRadius: "10px 0 0 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LockIcon width={18} height={18} style={{ color: C.textMuted }} />
      </div>

      {/* Cursor hand icon */}
      <CursorHandIcon
        width={22}
        height={22}
        style={{
          position: "absolute",
          left: 155,
          top: 30,
        }}
      />
    </div>
  );
}

function RevenueChartCard() {
  const days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  return (
    <div
      style={{
        width: "100%",
        height: 120,
        padding: "10px 12px",
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 600, lineHeight: "14px", color: C.textPrimary, letterSpacing: "-0.04em" }}>
          Total Revenue
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, lineHeight: "14px", color: C.textPrimary, letterSpacing: "-0.04em" }}>
          $142,592
        </span>
      </div>
      {/* Chart area with fill */}
      <div style={{ position: "relative", flex: 1, marginTop: 4, marginBottom: 2 }}>
        <svg width="100%" height="100%" viewBox="0 0 390 44" fill="none" style={{ overflow: "visible" }}>
          {/* Fill area */}
          <path d="M-2 42L23 16L29 18L65 30L129 32L142 38L149 26L184 18L189 26L195 16L232 26L241 24L276 0L286 24L322 26L343 20L363 24L381 7L404 42L404 44L-2 44Z" fill="url(#revFill)" />
          {/* Stroke line */}
          <path d="M-2 42L23 16L29 18L65 30L129 32L142 38L149 26L184 18L189 26L195 16L232 26L241 24L276 0L286 24L322 26L343 20L363 24L381 7L404 42" stroke="#FA8837" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FA8837" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FA8837" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Day labels */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {days.map((d) => (
          <span key={d} style={{ fontSize: 9, fontWeight: 500, color: C.textMuted, letterSpacing: "0.3px", fontFamily: "var(--font-inter), Inter, sans-serif" }}>{d}</span>
        ))}
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


const CR_TOOLS = ["Sideshift", "Aff Network", "Discord", "Other"];

function AgencyApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [agencyLink, setAgencyLink] = useState("");
  const [usingCR, setUsingCR] = useState("");
  const [altTool, setAltTool] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValid = fullName && agencyName && agencyLink && usingCR && email && phone && (usingCR === "Yes" || altTool);

  return (
    <>
    {/* Success - full page */}
    {submitted && (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F2F2F2] dark:bg-[#161616]">
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="absolute right-8 top-8 flex size-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#CAD0D9] bg-white transition-colors hover:bg-[#F5F5F5] dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M5.5 5.5L12.5 12.5M12.5 5.5L5.5 12.5" stroke="#383E47" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex flex-col items-center gap-2.5">
          <svg width="213" height="120" viewBox="0 0 213 120" fill="none" className="mb-4">
            <path d="M158.342 3.0876L148.457 4.84691C147.399 5.03327 146.422 5.54765 145.662 6.30803L103.356 48.6134L85.3382 30.0214C84.1231 28.769 82.3638 28.195 80.6417 28.5007L70.809 30.2451C69.7504 30.4314 68.7739 30.9458 68.0135 31.7062L52.5375 47.1896C50.4875 49.2396 50.4875 52.5719 52.5375 54.6294L74.9389 77.0308L93.3669 95.4588C94.582 96.6739 96.3115 97.2181 98.0037 96.9199L107.889 95.1606C108.947 94.9742 109.924 94.4598 110.684 93.6995L177.687 26.6966C179.737 24.6466 179.737 21.3143 177.687 19.2568L162.971 4.54126C161.756 3.32615 160.027 2.78195 158.335 3.08014L158.342 3.0876Z" stroke="#EB6821" strokeWidth="2" strokeLinejoin="round" />
            <path d="M69.5417 30.8862L95.3126 56.6571L103.356 48.606" stroke="#EB6821" strokeWidth="2" strokeLinejoin="round" />
            <path d="M144.856 7.11308L146.839 5.13013L167.206 25.5038L95.8567 96.8528" stroke="#EB6821" strokeLinejoin="round" />
            <path d="M179.774 23.2673L167.206 25.5037" stroke="#EB6821" strokeLinejoin="round" />
          </svg>
          <h2 className="font-inter text-[29.6px] font-semibold leading-[38px] tracking-[-0.32px] text-[#232529] dark:text-white">
            Application received!
          </h2>
          <p className="max-w-[350px] text-center font-inter text-[16px] font-medium leading-[22px] tracking-[-0.16px] text-[#505967] dark:text-page-text-muted">
            We have received your application. If you fit the program you will be messaged shortly.
          </p>
        </div>
      </div>
    )}

    {/* Form */}
    <div className="flex w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-border bg-card-bg dark:border-[rgba(37,37,37,0.06)] dark:bg-card-bg">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-border p-4 dark:border-[rgba(37,37,37,0.06)]">
        <div className="flex flex-col gap-1">
          <span className="font-inter text-[14px] font-medium leading-[24px] tracking-[-0.02em] text-page-text">
            Apply for the Agency Partner Program
          </span>
          <div className="flex items-center gap-1.5 text-page-text-muted">
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill="currentColor"/>
            </svg>
            <span className="font-inter text-[12px] font-light tracking-[-0.02em]">
              2 minute application
            </span>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-3 p-4">
        <FormTextInput label="Full name" placeholder="Jane Diaz" value={fullName} onChange={setFullName} />
        <FormTextInput label="Agency name" placeholder="Your agency name" value={agencyName} onChange={setAgencyName} />
        <FormTextInput label="Website" placeholder="https://youragency.com" value={agencyLink} onChange={setAgencyLink} />
        <FormSelectInput label="Using CR?" placeholder="Are you currently using Content Rewards?" options={["Yes", "No"]} value={usingCR} onChange={setUsingCR} />
        {usingCR === "No" && (
          <FormSelectInput label="Current tool" placeholder="What are you currently using?" options={CR_TOOLS} value={altTool} onChange={setAltTool} />
        )}
        <FormTextInput label="Email" placeholder="jane@agency.com" type="email" value={email} onChange={setEmail} />
        <FormTextInput label="WhatsApp phone" placeholder="+1 (555) 123-4567" type="tel" value={phone} onChange={setPhone} />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        {/* Submit button */}
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
    question: "Who qualifies for the Agency Partner Program?",
    answer:
      "Any agency running campaigns on Content Rewards or ready to start. There's no minimum size requirement. If you're delivering real results for brands, you qualify.",
  },
  {
    question: "How do milestone rewards work?",
    answer:
      "Rewards are based on your total creator payouts (GMV) across all campaigns. As your agency's campaigns pay out more to creators, you automatically unlock the next tier. Rewards are cumulative, you keep everything you've earned.",
  },
  {
    question: "What is the private deal-flow?",
    answer:
      "We match you with at least 2 qualified brand deals per month. These are brands already on Content Rewards that are ready to spend and need an agency to manage their campaigns.",
  },
  {
    question: "How long does it take to get accepted?",
    answer:
      "Most applications are reviewed within 48 hours. If you fit the program, a member of our team will reach out via WhatsApp to get you onboarded.",
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
            letterSpacing: "-0.04em",
            color: C.textPrimary,
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


// ── Trusted-by avatars with shared fluid tooltip ─────────────────────────────
const AGENCIES = [
  { id: "agency1", name: "Virality" },
  { id: "agency2", name: "Outpace Studios" },
  { id: "agency3", name: "ClipFactory" },
  { id: "agency4", name: "Nova Media" },
];

function TrustedByAvatars() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    let closest = -1;
    let closestDist = Infinity;
    for (let i = 0; i < AGENCIES.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - cx);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }
    if (closest >= 0) setActiveIndex(closest);
  }, []);

  const tooltipPos = (() => {
    if (activeIndex === null) return null;
    const el = itemRefs.current[activeIndex];
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.bottom };
  })();

  const activeLabel = activeIndex !== null ? AGENCIES[activeIndex]?.name : null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{ display: "flex" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {AGENCIES.map((a, i) => (
          <div
            key={a.id}
            ref={(el) => { itemRefs.current[i] = el; }}
            style={{ marginLeft: i > 0 ? -6 : 0, position: "relative", zIndex: 4 - i }}
          >
            <img
              src={`/icons/${a.id}.avif`}
              alt={a.name}
              width={26}
              height={26}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--card-bg)",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
      <span className="font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text-muted">
        Trusted by 200+ agencies
      </span>

      <FloatingPortal>
        <AnimatePresence>
          {activeLabel && tooltipPos && (
            <motion.div
              className="pointer-events-none fixed z-[9999]"
              style={{ top: tooltipPos.y }}
              initial={{ opacity: 0, y: 0, left: tooltipPos.x }}
              animate={{ opacity: 1, y: 4, left: tooltipPos.x }}
              exit={{ opacity: 0, y: 0, transition: { duration: 0.08 } }}
              transition={{
                left: springs.fast,
                opacity: { duration: 0.12 },
                y: { duration: 0.12 },
              }}
            >
              <div
                className="whitespace-nowrap rounded-lg bg-tooltip-bg px-2.5 py-1 text-xs font-medium text-tooltip-text shadow-lg"
                style={{ transform: "translateX(-50%)" }}
              >
                {activeLabel}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export function VerifiedAgencyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 16,
        fontFamily: "var(--font-inter-sans), sans-serif",
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
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <AgencyDirectoryIcon width={20} height={20} style={{ color: C.textMuted }} />
              <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", color: C.textMuted }}>
                Agency Directory
              </span>
            </div>

            {/* Heading */}
            <div style={{ marginTop: 16, maxWidth: 600 }}>
              <h1 className="font-inter text-[30px] font-bold leading-[1.3] tracking-[-1.5px]">
                <span className="text-[#000000] dark:text-white">Expand your </span>
                <span className="text-[#FF6207]">reach</span>
                <span className="text-[#000000] dark:text-white"> and get </span>
                <span className="text-[#FF6207]">inbound leads</span>
                <br />
                <span className="font-medium text-[#616161] dark:text-page-text-muted">
                  for your agency.
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div style={{ marginTop: 8, maxWidth: 540 }}>
              <p className="font-inter text-[15px] font-medium leading-[22px] tracking-[-0.45px] text-[#616161] dark:text-page-text-muted" style={{ margin: 0 }}>
                For agencies running campaigns on Content Rewards or ready to start. Whether you&apos;re managing clipping campaigns, UGC campaigns, or both. If you&apos;re delivering real results, this program is built for you. No minimum size requirement.
              </p>
            </div>

            {/* Apply Now button */}
            <div style={{ marginTop: 32 }}>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-6 font-inter text-[14px] font-medium tracking-[-0.02em] text-white transition-all hover:bg-foreground/90 active:scale-[0.98] dark:text-[#111111]"
              >
                Apply Now
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M3.5 1.5L7 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Trusted by */}
            <div style={{ marginTop: 24 }}>
              <TrustedByAvatars />
            </div>
          </div>

          {/* Right column - spacer (illustration removed) */}
          <div style={{ flex: "1 1 200px", minWidth: 0 }} />
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
              illustration={<BrandedProfileCard />}
              title="Verified Branded Profile"
              description="Set up your Content Rewards agency profile in under 15 minutes and start receiving inbound leads."
            />
            <FeatureCard
              illustration={<BadgeCard />}
              title="Agency Badge"
              description='Get your "Content Rewards Verified Agency" badge to embed on your website.'
            />
            <FeatureCard
              illustration={<RevenueChartCard />}
              title="Manage Your Revenue"
              description="Track earnings, payouts, and campaign performance across all your clients in one dashboard."
            />
          </div>
        </div>

        {/* ── Pricing section ── */}
        <div style={{ marginTop: 16, padding: "0 28px", display: "none" }}>
          <div className="flex flex-col gap-1.5 rounded-2xl bg-[#F0F0F0] p-1.5 dark:bg-white/[0.06]">
            {/* Top row */}
            <div className="flex gap-1.5" style={{ height: 269 }}>
              {/* Left - Illustration card */}
              <div className="relative flex flex-col justify-end rounded-xl bg-white shadow-[0px_0.6px_0.6px_-0.9px_rgba(0,0,0,0.07),0px_1.8px_1.8px_-1.9px_rgba(0,0,0,0.07),0px_4.8px_4.8px_-2.8px_rgba(0,0,0,0.06),0px_15px_15px_-3.8px_rgba(0,0,0,0.03)] dark:bg-white/[0.05]" style={{ flex: "0 0 37.6%" }}>
                {/* Tilted card overlay - floats above everything */}
                <div
                  className="pointer-events-none absolute z-30 flex flex-col justify-between rounded-3xl bg-black p-6"
                  style={{
                    width: 339,
                    height: 190,
                    left: -20,
                    top: -28,
                    transform: "matrix(1, 0.05, -0.05, 1, 0, 0)",
                    boxShadow: "0px 1px 1px -0.75px rgba(0,0,0,0.33), 0px 2px 2px -1.5px rgba(0,0,0,0.32), 0px 4.4px 4.4px -2.25px rgba(0,0,0,0.3), 0px 10px 10px -3px rgba(0,0,0,0.25), 0px 25px 25px -3.75px rgba(0,0,0,0.11), 0px 0px 0px 1px #828282, inset 0px 2px 4px rgba(255,255,255,0.4)",
                  }}
                >
                  {/* CTA pill */}
                  <div className="relative z-10 mx-auto inline-flex w-fit items-center gap-1 rounded-3xl bg-[rgba(41,119,255,0.36)] px-3 py-[9px] backdrop-blur-sm">
                    <div className="flex h-3.5 w-3.5 items-center justify-center bg-[#2977FF]">
                      <svg width="9" height="9" viewBox="0 0 14 14" fill="none">
                        <path d="M8 1L5 7h3l-1 6 4-8H8l1-4z" fill="white" />
                      </svg>
                    </div>
                    <span className="font-inter text-[11.3px] font-semibold leading-3 text-[#2977FF]">
                      Start Your Free Trial
                    </span>
                  </div>

                  {/* Text */}
                  <div className="relative z-10 mx-auto mt-auto">
                    <p className="m-0 font-inter text-[18.1px] font-medium leading-[23px] tracking-[-0.57px] text-[#B8B8B8]">
                      Private platform built{" "}
                    </p>
                    <p className="m-0 font-inter text-[17.8px] font-medium leading-[23px] tracking-[-0.57px] text-white">
                      away from the noise.
                    </p>
                  </div>
                </div>

                {/* Illustration content area - bottom of card, overflow visible so pills aren't clipped */}
                <div className="relative z-0 flex items-end justify-end pr-[10px] pt-[10px]" style={{ height: 193 }}>
                  {/* Floating pills - aligned right, stacked */}
                  <div className="flex w-[328px] flex-col items-end gap-4 py-[9px]">
                    {[
                      { width: 266, progress: 0 },
                      { width: 285, progress: 62 },
                      { width: 328, progress: 0 },
                    ].map((pill, i) => (
                      <div
                        key={i}
                        className="flex items-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[#F5F5F5] shadow-[0px_1px_3px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[linear-gradient(94deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_48%,rgba(255,255,255,0.06)_100%)]"
                        style={{
                          width: pill.width,
                          height: 47.83,
                          padding: "6.4px 20.7px 6.4px 6.4px",
                          gap: 7.15,
                        }}
                      >
                        <div className="h-[35px] w-[35px] shrink-0 rounded-full bg-[#E0E0E0] dark:bg-white/10" />
                        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#E8E8E8] dark:bg-white/[0.07]">
                          {pill.progress > 0 && (
                            <div
                              className="absolute inset-y-0 left-0 rounded-full bg-[#D4D4D4] dark:bg-gradient-to-b dark:from-[#363636] dark:to-[#252426]"
                              style={{ width: `${pill.progress}%` }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right - Design Subscription card */}
              <div className="flex flex-1 flex-col justify-end gap-8 rounded-xl bg-white shadow-[0px_0.6px_0.6px_-0.9px_rgba(0,0,0,0.07),0px_1.8px_1.8px_-1.9px_rgba(0,0,0,0.07),0px_4.8px_4.8px_-2.8px_rgba(0,0,0,0.06),0px_15px_15px_-3.8px_rgba(0,0,0,0.03)] dark:bg-white/[0.05]" style={{ padding: "25px 32px", isolation: "isolate" }}>
                {/* Info */}
                <div className="flex flex-col gap-4">
                  {/* Rating badge */}
                  <div className="flex w-fit items-center gap-2 rounded-md bg-[rgba(145,145,145,0.1)] px-2 py-1">
                    <span className="font-inter text-[13px] font-medium leading-4 tracking-[-0.39px] text-[#171717] opacity-60 dark:text-white">
                      4.8+
                    </span>
                    {/* 5 stars - Trustpilot style */}
                    <svg width="96" height="17" viewBox="0 0 96 17" fill="none">
                      {[0, 20, 40, 60, 80].map((x) => (
                        <g key={x}>
                          <rect x={x} y={0.5} width="16" height="16" rx="1" fill="#0099FF" />
                          <path
                            d={`M${x + 8} 3.5l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z`}
                            fill="white"
                            fillOpacity="0.8"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* Heading */}
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-inter text-[21.1px] font-bold leading-[26px] tracking-[-0.66px] text-[#292929] dark:text-white">
                      For Founders &<br />Business Owners
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="m-0 max-w-[379px] font-inter text-[14px] font-medium leading-[22px] tracking-[-0.4px] text-black dark:text-page-text-muted">
                    Gain access to the exact roadmap for scalable, organic customer acquisition. Ideal for any business looking to grow.
                  </p>
                </div>

                {/* CTA Button */}
                <div>
                  <button
                    type="button"
                    className="inline-flex h-[46px] cursor-pointer items-center justify-center gap-2.5 rounded-[10px] border-2 border-white/20 bg-[#2060DF] px-[18px] font-inter text-[16px] font-bold leading-[26px] tracking-[-0.8px] text-white shadow-[0px_0px_0px_1px_rgba(33,101,237,0.12)] transition-all hover:bg-[#1a52c4] active:scale-[0.98]"
                  >
                    Get Started For Free
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                      <path d="M10 6.25L16.25 12.5L10 18.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom - Single Project / Your Private Network */}
            <div className="relative flex flex-col items-center overflow-hidden rounded-xl bg-[#0A0A0A] border border-black shadow-[0px_1px_1px_-0.8px_rgba(0,0,0,0.33),0px_2px_2px_-1.5px_rgba(0,0,0,0.32),0px_4.4px_4.4px_-2.3px_rgba(0,0,0,0.3),0px_10px_10px_-3px_rgba(0,0,0,0.25),0px_25px_25px_-3.8px_rgba(0,0,0,0.11),0px_0px_0px_1px_#828282,inset_0px_2px_4px_rgba(255,255,255,0.4)]" style={{ padding: "0 32px 20px" }}>
              {/* Content header */}
              <div className="flex flex-col items-center gap-0 pb-0 pt-[19px]" style={{ padding: "19px 0 0" }}>
                {/* Heading */}
                <div className="flex flex-col items-center gap-2 py-2">
                  <h2 className="font-inter text-[31.1px] font-bold leading-[46px] tracking-[-1px] text-white">
                    Your Private Network
                  </h2>
                </div>

                {/* Subtitle */}
                <div className="flex flex-col items-center pb-[10px]">
                  <div className="flex items-center justify-center">
                    <span className="font-inter text-[17px] font-medium leading-[29px] tracking-[-0.68px] text-[#8A8A8A]">
                      In marketing, the only constant is{" "}
                    </span>
                    <span className="relative inline-block">
                      <span
                        className="absolute bottom-[3px] left-0 right-0 h-[10px] rounded-[1px]"
                        style={{ background: "linear-gradient(95.56deg, rgba(88,101,242,0.8) 50%, rgba(88,101,242,0) 50%)" }}
                      />
                      <span className="relative font-inter text-[17px] font-medium leading-[29px] tracking-[-0.68px] text-white">
                        change.
                      </span>
                    </span>
                  </div>
                  <span className="font-inter text-[17px] font-medium leading-[29px] tracking-[-0.68px] text-[#8A8A8A]">
                    Stay on top of the game by joining the Virality Network
                  </span>
                </div>
              </div>

              {/* Feature cards */}
              <div className="flex w-full flex-wrap justify-center gap-5" style={{ padding: "0 50px" }}>
                {/* Connect with Founders */}
                <div className="flex min-w-[300px] flex-1 flex-col items-center rounded-[20px] bg-[#0D0D0D]" style={{ height: 316 }}>
                  {/* Illustration */}
                  <div className="relative flex flex-1 items-center justify-center" style={{ width: 294 }}>
                    {/* Top-left card */}
                    <div className="absolute left-0 top-0 flex items-center gap-2 rounded-xl bg-[#121212] px-4 py-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-[#061D42]">
                        <span className="text-[10px] font-bold text-white">C</span>
                      </div>
                      <span className="font-['Instrument_Sans'] text-[16px] font-bold leading-5 tracking-[-0.64px] text-white">
                        Cluely
                      </span>
                    </div>
                    {/* Center card */}
                    <div className="flex items-center gap-2 rounded-xl bg-[#121212] px-6 py-2.5">
                      <div className="h-8 w-8 overflow-hidden rounded-full bg-white/10" />
                      <span className="font-['Instrument_Sans'] text-[16px] font-bold leading-5 tracking-[-0.64px] text-white">
                        Your Brand
                      </span>
                    </div>
                    {/* Bottom-right card */}
                    <div className="absolute bottom-0 right-[-1.56px] flex items-center gap-2 rounded-xl bg-[#121212] px-4 py-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-[#3D4043]">
                        <span className="text-[10px] font-bold text-white">W</span>
                      </div>
                      <span className="font-['Instrument_Sans'] text-[16px] font-bold leading-5 tracking-[-0.64px] text-white">
                        Whop
                      </span>
                      {/* Whop verified icon */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M0.74 3.64C0.74 15.27 15.26 15.27 15.26 3.64" fill="url(#whop_outer)" />
                        <path d="M1.43 3.91C1.43 14.01 14.57 14.01 14.57 3.91" fill="url(#whop_inner)" />
                        <path d="M4.36 6.08L6.14 10.69L8 6.08L9.86 10.69L11.64 6.08" fill="#D18800" />
                        <defs>
                          <linearGradient id="whop_outer" x1="2" y1="1" x2="14" y2="15" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F4E72A" /><stop offset="0.57" stopColor="#CD8105" /><stop offset="1" stopColor="#F4E72A" />
                          </linearGradient>
                          <linearGradient id="whop_inner" x1="2" y1="2" x2="14" y2="14" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F9E87F" /><stop offset="0.5" stopColor="#E2B719" /><stop offset="1" stopColor="#E2B719" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  {/* Text */}
                  <div className="flex flex-col items-center gap-1.5 p-[30px]" style={{ height: 134.8 }}>
                    <h4 className="font-inter text-[20px] font-bold leading-6 tracking-[-0.8px] text-white">
                      Connect with Founders
                    </h4>
                    <p className="max-w-[317px] text-center font-inter text-[14px] font-medium leading-[22px] tracking-[-0.56px] text-[#D5DBE6] opacity-60">
                      Stay ahead with authentic conversations and value from top consumer brand founders.
                    </p>
                  </div>
                </div>

                {/* Exclusive Training */}
                <div className="flex min-w-[300px] flex-1 flex-col items-center rounded-[20px] bg-[#0D0D0D]" style={{ height: 315 }}>
                  {/* Illustration */}
                  <div className="flex flex-1 flex-col justify-center gap-2" style={{ width: 312 }}>
                    {/* Row 1 - Virality */}
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-[10px] bg-white/10" />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-inter text-[18px] font-bold leading-[22px] tracking-[-0.72px] text-white">
                            Virality
                          </span>
                          <div className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-[#0D86FF]">
                            <svg width="8" height="8" viewBox="0 0 14 14" fill="white">
                              <path d="M5.5 10l-3-3 1-1 2 2 5-5 1 1-6 6z" />
                            </svg>
                          </div>
                        </div>
                        <span className="font-inter text-[14px] font-medium leading-[17px] text-[#B5B5B5]">
                          Training & Resources
                        </span>
                      </div>
                    </div>
                    {/* Row 2 - App icons */}
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-[50px] w-[50px] rounded-[10px] bg-white/[0.08]" />
                      ))}
                    </div>
                    {/* More button */}
                    <div className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#121212]" style={{ height: 40 }}>
                      <svg width="14" height="13" viewBox="0 0 14 13" fill="none" className="rotate-180">
                        <path d="M9 2L5 6.5L9 11" stroke="#B5B5B5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="font-inter text-[15px] font-semibold leading-[18px] tracking-[-0.3px] text-[#B5B5B5]">
                        More
                      </span>
                    </div>
                  </div>
                  {/* Text */}
                  <div className="flex flex-col items-center gap-1.5 p-[30px]" style={{ height: 134.8 }}>
                    <h4 className="font-inter text-[20px] font-bold leading-6 tracking-[-0.8px] text-white">
                      Exclusive Training
                    </h4>
                    <p className="max-w-[317px] text-center font-inter text-[14px] font-medium leading-[22px] tracking-[-0.56px] text-[#D5DBE6] opacity-60">
                      Gain access to the exact resources & training to grow your business with organic content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Partner Program section ── */}
        <div style={{ marginTop: 64, padding: "0 28px" }}>
          <div className="mx-auto flex max-w-[1000px] flex-col gap-16">
            {/* Section header */}
            <div className="flex flex-col items-center gap-4">
              <span className="font-inter text-sm font-semibold tracking-[-0.42px] text-[#FF6207]">
                Agency Partner Program
              </span>
              <h2 className="max-w-[600px] text-center font-inter text-[32px] font-bold leading-[38px] tracking-[-1.6px] text-black dark:text-white">
                A real partnership, not an affiliate deal.
              </h2>
              <p className="max-w-[480px] text-center font-inter text-[15px] font-medium leading-[22px] tracking-[-0.45px] text-[#707070] dark:text-page-text-muted">
                If you&apos;re running campaigns for brands on Content Rewards, this program gives you free mentoring, resources, milestone rewards, and direct access to the team.
              </p>
            </div>

            {/* What you get */}
            <div className="flex flex-col gap-6">
              <h3 className="font-inter text-[20px] font-medium leading-[24px] tracking-[-1px] text-black dark:text-white">
                What you get (free)
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Verified Agency Status", desc: "Your agency gets a verified badge on the platform. Brands and creators see it, signaling you're recognized by CR directly." },
                  { title: "CR x Agency Hoodies", desc: "Custom merch for your team. You're part of the family now." },
                  { title: "Private Deal-Flow", desc: "We send you at least 2 qualified brand deals per month, matched to your agency. Ready-to-spend brands that need campaigns run." },
                  { title: "Full X Growth Guide", desc: "The exact playbook for building your agency's presence on X. Tactics, frameworks, and strategy from people actually doing it." },
                  { title: "Unlimited Consulting", desc: "Virality is the #1 clipping agency on CR. As a partner, you get unlimited access to their team for campaign strategy, scaling, and more." },
                  { title: "Super Bowl Rings", desc: "Every partner agency receives 20 custom rings. Give them to your top clippers or employees. If you're winning, show it." },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg p-5"
                  >
                    <span className="font-inter text-[14px] font-medium leading-[20px] tracking-[-0.04em] text-page-text">
                      {item.title}
                    </span>
                    <p className="font-inter text-[13px] font-normal leading-[20px] tracking-[-0.02em] text-page-text-muted" style={{ margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Rewards */}
            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-inter text-[20px] font-medium leading-[24px] tracking-[-1px] text-black dark:text-white">
                    Milestone Rewards
                  </h3>
                  <p className="font-inter text-[14px] font-normal leading-[20px] text-page-text-muted" style={{ margin: 0 }}>
                    As your agency grows, you unlock rewards based on total creator payouts (GMV).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-5 font-inter text-[13px] font-medium tracking-[-0.02em] text-white transition-all hover:bg-foreground/90 active:scale-[0.98] dark:text-[#111111]"
                >
                  Apply Now
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-foreground/[0.06]">
                {[
                  { threshold: "$10K", reward: "AirPods Pro", img: "/icons/prizes/airpods.png" },
                  { threshold: "$30K", reward: "iPhone 17 Pro Max", img: "/icons/prizes/iphone.png" },
                  { threshold: "$60K", reward: "iPad Pro M4 + Apple Pencil", img: "/icons/prizes/ipad.png" },
                  { threshold: "$100K", reward: "MacBook Pro M4", img: "/icons/prizes/macbook.png" },
                  { threshold: "$200K", reward: "A Week at CR HQ", img: null },
                  { threshold: "$300K", reward: "Rolex Oyster Perpetual 41", img: "/icons/prizes/rolex.png" },
                  { threshold: "$500K", reward: "$20,000 Cash", img: null },
                  { threshold: "$750K", reward: "BMW 330i", img: "/icons/prizes/bmw.png" },
                ].map((row, i, arr) => (
                  <div
                    key={row.threshold}
                    className={cn(
                      "flex items-center justify-between px-5 py-3.5",
                      i < arr.length - 1 && "border-b border-foreground/[0.06]",
                      i % 2 === 0 ? "bg-card-bg" : "bg-foreground/[0.02]",
                    )}
                  >
                    <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text-muted">
                      <span className="text-[#FF6207] tabular-nums">{row.threshold}</span> in Creator Payouts
                    </span>
                    {row.img ? (
                      <HoverCard openDelay={100} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <span className="cursor-pointer font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text underline decoration-foreground/20 underline-offset-2 transition-colors hover:text-page-text/80">
                            {row.reward}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-[220px] overflow-hidden rounded-xl border-foreground/[0.06] p-0" side="top" align="end">
                          <div className="flex items-center justify-center bg-foreground/[0.02] p-4">
                            <img src={row.img} alt={row.reward} className="max-h-[140px] max-w-full object-contain" />
                          </div>
                          <div className="border-t border-foreground/[0.06] px-3 py-2">
                            <span className="font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text">{row.reward}</span>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">
                        {row.reward}
                      </span>
                    )}
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* CTA section removed */}

        {/* Drawer with application form + FAQ */}
        <VerifiedAgencyDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <div className="flex flex-col gap-10 px-5 pt-8 pb-12 sm:px-8">
            {/* Application form */}
            <div className="flex justify-center">
              <AgencyApplicationForm />
            </div>

            {/* FAQ */}
            <div className="mx-auto w-full max-w-[540px]">
              <h2 className="font-inter text-[16px] font-medium leading-[24px] text-page-text">
                FAQ
              </h2>
              <p className="mt-1 font-inter text-[14px] font-normal leading-[20px] text-page-text-muted">
                Common questions about the partner program.
              </p>
              <div className="mt-4">
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
        </VerifiedAgencyDrawer>
      </div>
    </div>
  );
}
