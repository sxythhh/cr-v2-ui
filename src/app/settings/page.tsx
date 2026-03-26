"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProximityTabs } from "@/components/ui/proximity-tabs";
import { Modal } from "@/components/ui/modal";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { Rating } from "@/components/reui/rating";
import { UserDropdown } from "@/components/sidebar/user-dropdown";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { IconUpload, IconPhoto } from "@tabler/icons-react";

// ── Settings Tabs ────────────────────────────────────────────────────────────

const SETTINGS_TABS = [
  "Profile",
  "Brands",
  "Team",
  "Permissions",
  "Notifications",
  "Agency Profile",
  "Client Onboarding",
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number];

// ── Icons ────────────────────────────────────────────────────────────────────

function ExportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.667 10v2.667A1.333 1.333 0 004 14h8a1.333 1.333 0 001.333-1.333V10M5.333 5.333L8 2.667l2.667 2.666M8 2.667v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Shared input styles ──────────────────────────────────────────────────────

const inputClass = cn(
  "flex h-10 w-full items-center rounded-[14px] bg-foreground/[0.04] px-3.5",
  "font-inter text-[14px] leading-[1.2] tracking-[-0.02em] text-page-text",
  "outline-none",
);

const labelClass = "font-inter text-[12px] leading-[1] tracking-[-0.02em] text-page-text-muted";

const cardClass = cn(
  "flex flex-col gap-4 rounded-2xl border border-foreground/[0.06] bg-white p-4",
  "shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
  "dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
);

// ── Select-like input with chevron ───────────────────────────────────────────

function SelectInput({ value, label, options, onChange }: { value: string; label?: string; options?: string[]; onChange?: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      {label && <span className={labelClass}>{label}</span>}
      <div className="relative">
        <div className={cn(inputClass, "cursor-pointer justify-between")} onClick={() => options && setOpen(!open)}>
          <span>{value}</span>
          <ChevronDown className={cn("size-3 text-page-text-muted transition-transform", open && "rotate-180")} />
        </div>
        {open && options && (
          <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-xl border border-foreground/[0.06] bg-white py-1 shadow-lg dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange?.(opt); setOpen(false); }}
                className={cn("flex w-full cursor-pointer items-center px-3 py-2 font-inter text-xs tracking-[-0.02em] transition-colors hover:bg-foreground/[0.04]", value === opt ? "font-medium text-page-text" : "text-foreground/70")}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Connected Account Row ────────────────────────────────────────────────────

function WhopIcon() {
  return (
    <svg width="18" height="10" viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.10793 0C1.82192 0 0.939065 0.566458 0.265439 1.19926C0.265439 1.19926 -0.00503191 1.45442 7.13177e-05 1.46463L2.81705 4.28161L5.63403 1.46463C5.09819 0.729761 4.09286 0 3.10793 0Z" fill="#FA4616"/>
      <path d="M10.0634 0C8.77737 0 7.89451 0.566458 7.22089 1.19926C7.22089 1.19926 6.97593 1.44932 6.96062 1.46463L3.48022 4.94502L6.2921 7.7569L12.5844 1.46463C12.0485 0.729761 11.0483 0 10.0634 0Z" fill="#FA4616"/>
      <path d="M17.0343 0C15.7483 0 14.8655 0.566458 14.1918 1.19926C14.1918 1.19926 13.9367 1.44932 13.9265 1.46463L6.96057 8.43053L7.69544 9.16539C8.83346 10.3034 10.7012 10.3034 11.8444 9.16539L19.5451 1.46463H19.5553C19.0246 0.729761 18.0193 0 17.0343 0Z" fill="#FA4616"/>
    </svg>
  );
}

function ConnectedAccount({ name, detail, icon }: { name: string; detail: string; icon: React.ReactNode }) {
  return (
    <div className={cn(cardClass, "gap-2 p-4")}>
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white dark:border-card-inner-border dark:bg-card-inner-bg">
          <div className="flex size-5 items-center justify-center">{icon}</div>
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">{name}</span>
          </div>
          <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">{detail}</span>
        </div>
        <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-[#34D399]">Connected</span>
      </div>
    </div>
  );
}

// ── Tab Content Components ───────────────────────────────────────────────────

const ROLE_OPTIONS = ["Designer", "Developer", "Manager", "Marketing", "Content Creator", "Admin"];
const TIMEZONE_OPTIONS = ["EST (UTC-5)", "CST (UTC-6)", "MST (UTC-7)", "PST (UTC-8)", "GMT (UTC+0)", "CET (UTC+1)", "IST (UTC+5:30)", "JST (UTC+9)"];

function ProfileTab() {
  const [dirty, setDirty] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [role, setRole] = useState("Designer");
  const [timezone, setTimezone] = useState("EST (UTC-5)");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    setDirty(true);
  }, []);

  return (
    <div className="flex justify-center px-5 py-5">
      <div className="flex w-full max-w-[520px] flex-col gap-2">
        {/* Profile card */}
        <div className={cardClass}>
          {/* Avatar + change photo */}
          <div className="flex items-center gap-4">
            <div className="size-14 overflow-hidden rounded-full bg-[rgba(37,37,37,0.08)] dark:bg-foreground/[0.08]">
              {avatarUrl && <img src={avatarUrl} alt="Avatar" className="size-full object-cover" />}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">
              Change photo
            </button>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {/* Row 1: Full name + Email */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 flex-col gap-2">
                <span className={labelClass}>Full name</span>
                <input
                  className={inputClass}
                  defaultValue="Vlad Shapoval"
                  onChange={() => setDirty(true)}
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className={labelClass}>Email</span>
                <input
                  className={inputClass}
                  defaultValue="vlad@outpacestudios.com"
                  onChange={() => setDirty(true)}
                />
              </div>
            </div>

            {/* Row 2: Company + Role */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 flex-col gap-2">
                <span className={labelClass}>Company</span>
                <div className={cn(inputClass, "cursor-pointer gap-1.5")}>
                  <div className="size-4 rounded border border-[rgba(37,37,37,0.06)] bg-gradient-to-b from-[#F59E0B] to-[#F97316] dark:border-white/[0.06]" />
                  <span className="flex-1">Outpace Studios</span>
                  <ChevronDown className="size-3 text-page-text-muted" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <SelectInput label="Role" value={role} options={ROLE_OPTIONS} onChange={(v) => { setRole(v); setDirty(true); }} />
              </div>
            </div>

            {/* Row 3: Timezone */}
            <div className="flex">
              <div className="flex flex-1 flex-col gap-2">
                <SelectInput label="Timezone" value={timezone} options={TIMEZONE_OPTIONS} onChange={(v) => { setTimezone(v); setDirty(true); }} />
              </div>
              <div className="flex-1" />
            </div>
          </div>

          {/* Save button — right aligned */}
          <div className="flex justify-end">
            <button
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-white dark:text-page-bg",
                "",
                !dirty && "cursor-default opacity-30",
                dirty && "cursor-pointer opacity-100",
              )}
              disabled={!dirty}
            >
              Save changes
            </button>
          </div>
        </div>

        {/* Connected accounts card */}
        <div className="flex flex-col gap-2">
          <div className={cardClass}>
            {/* Header */}
            <span className={labelClass}>Connected accounts</span>

            {/* Account rows */}
            <div className="flex flex-col gap-2">
              <ConnectedAccount name="Google" detail="vlad@outpacestudios.com" icon={<img src="/logos/google.png" alt="Google" className="size-5" />} />
              <ConnectedAccount name="Slack" detail="#contentrewards-comms" icon={<img src="/logos/slack.png" alt="Slack" className="size-5" />} />
              <ConnectedAccount name="Whop" detail="Content Rewards community" icon={<WhopIcon />} />

              {/* Connect another — dashed */}
              <button className="flex h-14 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-foreground/[0.12] bg-white transition-colors hover:bg-foreground/[0.02] dark:bg-transparent">
                <div className="flex size-6 items-center justify-center rounded-full bg-foreground/[0.06]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2.667v10.666M2.667 8h10.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-subtle" />
                  </svg>
                </div>
                <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">
                  Connect another account
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
        on
          ? "bg-foreground"
          : "bg-foreground/[0.12]",
      )}
    >
      <div
        className={cn(
          "size-4 rounded-full bg-white transition-transform dark:bg-page-bg",
          on ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

// ── Notification Row ─────────────────────────────────────────────────────────

function NotificationRow({
  title,
  description,
  on,
  onToggle,
}: {
  title: string;
  description: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={cn(cardClass, "cursor-pointer gap-2 p-4 transition-colors hover:bg-foreground/[0.02]")} onClick={onToggle}>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="font-inter text-[14px] font-medium leading-[1] tracking-[-0.02em] text-page-text">
            {title}
          </span>
          <span className="font-inter text-[12px] leading-[1] tracking-[-0.02em] text-page-text-muted">
            {description}
          </span>
        </div>
        <Toggle on={on} onToggle={onToggle} />
      </div>
    </div>
  );
}

// ── Notification Section ─────────────────────────────────────────────────────

function NotificationSection({
  label,
  items,
  toggles,
  onToggle,
}: {
  label: string;
  items: { key: string; title: string; description: string }[];
  toggles: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className={cardClass}>
      <span className={labelClass}>{label}</span>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <NotificationRow
            key={item.key}
            title={item.title}
            description={item.description}
            on={toggles[item.key] ?? true}
            onToggle={() => onToggle(item.key)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Notifications Tab ────────────────────────────────────────────────────────

const NOTIFICATION_SECTIONS = [
  {
    label: "Campaigns & submissions",
    items: [
      { key: "new_submissions", title: "New submissions", description: "Content submitted for review, including auto-approve countdowns" },
      { key: "budget_alerts", title: "Budget alerts", description: "Budget running low, exhausted, or topped up by a brand" },
      { key: "campaign_updates", title: "Campaign updates", description: "Milestones reached, campaigns ending soon, or completed" },
      { key: "content_viral", title: "Content going viral", description: "A submission surpassed 500K views or spiked 50%+ in 4 hours" },
    ],
  },
  {
    label: "Creators",
    items: [
      { key: "new_applications", title: "New applications", description: "Creators applied to join your campaigns" },
      { key: "fraud_alerts", title: "Fraud and bot alerts", description: "Suspicious view spikes, high bot scores, or creator bans" },
      { key: "messages", title: "Messages", description: "Direct messages from creators or brand clients" },
    ],
  },
  {
    label: "Payouts",
    items: [
      { key: "payouts_processed", title: "Payouts processed", description: "Weekly creator payouts sent, including validation window reminders" },
      { key: "clawbacks", title: "Clawbacks", description: "Funds returned to campaign budget after a clawback" },
    ],
  },
  {
    label: "Reports & System",
    items: [
      { key: "weekly_digest", title: "Weekly performance digest", description: "Views, spend, CPM, and top creators across all campaigns" },
      { key: "security_alerts", title: "Security alerts", description: "New logins, integration failures, or permission changes" },
      { key: "product_updates", title: "Product updates", description: "New features, improvements, and platform announcements" },
    ],
  },
] as const;

const EMAIL_FREQUENCIES = ["Instant", "Daily", "Weekly", "Off"] as const;
type EmailFrequency = (typeof EMAIL_FREQUENCIES)[number];

function NotificationsTab() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const section of NOTIFICATION_SECTIONS) {
      for (const item of section.items) {
        initial[item.key] = true;
      }
    }
    return initial;
  });
  const [emailFrequency, setEmailFrequency] = useState<EmailFrequency>("Instant");
  const freqContainerRef = useRef<HTMLDivElement>(null);
  const freqIsMouseInside = useRef(false);
  const {
    activeIndex: freqHoveredIndex,
    itemRects: freqRects,
    handlers: freqHandlers,
    registerItem: freqRegister,
    measureItems: freqMeasure,
  } = useProximityHover(freqContainerRef, { axis: "x" });
  useEffect(() => { freqMeasure(); }, [freqMeasure]);

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex justify-center px-5 py-5">
      <div className="flex w-full max-w-[520px] flex-col gap-4">
        {/* Title */}
        <span className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-[#1E1E1E] dark:text-white">
          Notification Preferences
        </span>

        {/* Sections */}
        <div className="flex flex-col gap-2">
          {NOTIFICATION_SECTIONS.map((section) => (
            <NotificationSection
              key={section.label}
              label={section.label}
              items={section.items as unknown as { key: string; title: string; description: string }[]}
              toggles={toggles}
              onToggle={handleToggle}
            />
          ))}

          {/* Email digest section */}
          <div className={cardClass}>
            <span className={labelClass}>Email digest</span>
            <div className="flex flex-col gap-2">
              <div className={cn(cardClass, "gap-4 p-4")}>
                <div className="flex flex-col gap-1.5">
                  <span className="font-inter text-[14px] font-medium leading-[1] tracking-[-0.02em] text-page-text">
                    Email summary frequency
                  </span>
                  <span className="font-inter text-[12px] leading-[1] tracking-[-0.02em] text-page-text-muted">
                    How often should we bundle your notifications into a digest?
                  </span>
                </div>

                {/* Segmented control with proximity hover */}
                <div
                  ref={freqContainerRef}
                  onMouseMove={(e) => { freqIsMouseInside.current = true; freqHandlers.onMouseMove(e); }}
                  onMouseLeave={() => { freqIsMouseInside.current = false; freqHandlers.onMouseLeave(); }}
                  className="relative flex items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5"
                >
                  {/* Selected pill */}
                  {(() => {
                    const selectedIdx = EMAIL_FREQUENCIES.indexOf(emailFrequency);
                    const selectedRect = freqRects[selectedIdx];
                    if (!selectedRect) return null;
                    return (
                      <motion.div
                        className="pointer-events-none absolute z-0 rounded-[10px] bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[#222222] dark:shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                        initial={false}
                        animate={{ left: selectedRect.left, width: selectedRect.width, top: selectedRect.top, height: selectedRect.height }}
                        transition={springs.moderate}
                      />
                    );
                  })()}

                  {/* Hover highlight */}
                  <AnimatePresence>
                    {(() => {
                      const selectedIdx = EMAIL_FREQUENCIES.indexOf(emailFrequency);
                      const hoverRect = freqHoveredIndex !== null ? freqRects[freqHoveredIndex] : null;
                      if (!hoverRect || freqHoveredIndex === selectedIdx) return null;
                      return (
                        <motion.div
                          className="pointer-events-none absolute z-0 rounded-[10px] bg-foreground/[0.04]"
                          initial={{ ...hoverRect, opacity: 0 }}
                          animate={{ left: hoverRect.left, width: hoverRect.width, top: hoverRect.top, height: hoverRect.height, opacity: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                          transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                        />
                      );
                    })()}
                  </AnimatePresence>

                  {EMAIL_FREQUENCIES.map((freq, i) => {
                    const selectedIdx = EMAIL_FREQUENCIES.indexOf(emailFrequency);
                    return (
                      <button
                        key={freq}
                        data-proximity-index={i}
                        ref={(el) => freqRegister(i, el)}
                        onClick={() => setEmailFrequency(freq)}
                        className={cn(
                          "relative z-10 flex h-8 flex-1 cursor-pointer items-center justify-center rounded-[10px] font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] transition-colors",
                          i === selectedIdx
                            ? "text-page-text dark:text-white"
                            : freqHoveredIndex === i
                              ? "text-page-text"
                              : "text-page-text-subtle",
                        )}
                      >
                        {freq}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Brands Tab ──────────────────────────────────────────────────────────────

const BRANDS_DATA = [
  {
    name: "Cantina",
    description: "AI productivity tool - TikTok, YouTube, Instagram",
    logo: "/logos/brand1.png",
    campaigns: [
      { name: "TikTok Clips", logo: "/logos/brand1.png", creators: 18 },
      { name: "YouTube Shorts", logo: "/logos/brand2.png", creators: 18 },
      { name: "Product Reviews", logo: "/logos/brand3.png", creators: 18 },
    ],
    stats: { totalSpend: "$208.91", avgCpm: "$208.91", totalCreators: 47 },
  },
  {
    name: "Cantina",
    description: "AI productivity tool - TikTok, YouTube, Instagram",
    logo: "/logos/brand4.png",
    campaigns: [
      { name: "TikTok Clips", logo: "/logos/brand4.png", creators: 18 },
      { name: "YouTube Shorts", logo: "/logos/brand5.png", creators: 18 },
      { name: "Product Reviews", logo: "/logos/brand6.png", creators: 18 },
    ],
    stats: { totalSpend: "$208.91", avgCpm: "$208.91", totalCreators: 47 },
  },
  {
    name: "Cantina",
    description: "AI productivity tool - TikTok, YouTube, Instagram",
    logo: "/logos/brand7.jpeg",
    campaigns: [
      { name: "TikTok Clips", logo: "/logos/brand7.jpeg", creators: 18 },
      { name: "YouTube Shorts", logo: "/logos/brand10.png", creators: 18 },
      { name: "Product Reviews", logo: "/logos/brand10.png", creators: 18 },
    ],
    stats: { totalSpend: "$208.91", avgCpm: "$208.91", totalCreators: 47 },
  },
];

function BrandCard({ brand, onEdit, onRemove }: { brand: (typeof BRANDS_DATA)[number]; onEdit: () => void; onRemove: () => void }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-foreground/[0.06] p-4 dark:border-[rgba(224,224,224,0.03)]">
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)]">
          <img src={brand.logo} alt={brand.name} className="size-[27.5px] object-contain" />
        </div>
        <div className="hidden min-w-0 flex-1 flex-col gap-2 sm:flex">
          <span className="font-inter text-[16px] font-medium leading-[1] tracking-[-0.02em] text-page-text">{brand.name}</span>
          <span className="font-inter text-[12px] leading-[1] tracking-[-0.02em] text-page-text-muted">{brand.description}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onEdit} className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
            Edit
          </button>
          <button type="button" onClick={onRemove} className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-[rgba(251,113,133,0.08)] px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-[#FB7185] transition-colors hover:bg-[rgba(251,113,133,0.12)]">
            Remove
          </button>
        </div>
      </div>

      {/* Brand name — mobile only */}
      <div className="flex flex-col gap-2 px-4 pt-3 sm:hidden">
        <span className="font-inter text-[16px] font-medium leading-[1] tracking-[-0.02em] text-page-text">{brand.name}</span>
        <span className="font-inter text-[12px] leading-[1] tracking-[-0.02em] text-page-text-muted">{brand.description}</span>
      </div>

      {/* Campaigns & creators */}
      <div className="flex flex-col gap-4 p-4">
        <span className="font-inter text-[12px] leading-[1] tracking-[-0.02em] text-page-text-muted">Campaigns & creators</span>
        <div className="flex flex-col gap-2">
          {brand.campaigns.map((campaign, i) => (
            <a
              key={i}
              href={`/campaigns/${encodeURIComponent(campaign.name.toLowerCase().replace(/\s+/g, "-"))}`}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-foreground/[0.06] bg-white px-4 py-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]"
            >
              <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                <img src={campaign.logo} alt={campaign.name} className="size-[15px] object-contain" />
              </div>
              <span className="min-w-0 flex-1 truncate font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">{campaign.name}</span>
              <span className="shrink-0 font-inter text-[12px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{campaign.creators} creators</span>
            </a>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col justify-between gap-1.5 rounded-xl border border-foreground/[0.06] bg-white p-3 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
            <span className="font-inter text-[12px] leading-[1] tracking-[-0.02em] text-page-text-muted">Total spend</span>
            <span className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{brand.stats.totalSpend}</span>
          </div>
          <div className="flex flex-col justify-between gap-1.5 rounded-xl border border-foreground/[0.06] bg-white p-3 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
            <span className="font-inter text-[12px] leading-[1] tracking-[-0.02em] text-page-text-muted">Avg CPM</span>
            <span className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{brand.stats.avgCpm}</span>
          </div>
          <div className="col-span-2 flex items-center justify-between rounded-xl border border-foreground/[0.06] bg-white p-3 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
            <span className="font-inter text-[12px] leading-[1] tracking-[-0.02em] text-page-text-muted">Total creators</span>
            <span className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{brand.stats.totalCreators}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandsTab() {
  const [editBrandIndex, setEditBrandIndex] = useState<number | null>(null);
  const [removeBrandIndex, setRemoveBrandIndex] = useState<number | null>(null);
  const editBrand = editBrandIndex !== null ? BRANDS_DATA[editBrandIndex] : null;
  const removeBrand = removeBrandIndex !== null ? BRANDS_DATA[removeBrandIndex] : null;

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-5 sm:px-5">
      {/* Header row */}
      <div className="flex w-full max-w-[1028px] items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-inter text-base font-medium leading-[1.2] tracking-[-0.02em] text-page-text">My Brands</span>
          <span className="font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text-muted">
            Manage the brands your agency works with. Details stay private until a campaign goes live.
          </span>
        </div>
        <button className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 pl-3 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:opacity-90 dark:bg-[#E0E0E0] dark:text-[#252525]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2.667v10.666M2.667 8h10.666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Brand
        </button>
      </div>

      {/* Brand cards */}
      <div className="flex w-full max-w-[1028px] flex-col gap-2">
        {BRANDS_DATA.map((brand, i) => (
          <BrandCard key={i} brand={brand} onEdit={() => setEditBrandIndex(i)} onRemove={() => setRemoveBrandIndex(i)} />
        ))}
      </div>

      {/* Edit Brand Modal */}
      <Modal open={editBrandIndex !== null} onClose={() => setEditBrandIndex(null)}>
        <div className="flex flex-col gap-5 p-5">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Edit Brand</span>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">Brand name</span>
              <input className="h-[38px] rounded-xl border border-foreground/[0.06] bg-card-bg px-3 font-inter text-xs tracking-[-0.02em] text-page-text outline-none dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]" defaultValue={editBrand?.name ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">Description</span>
              <input className="h-[38px] rounded-xl border border-foreground/[0.06] bg-card-bg px-3 font-inter text-xs tracking-[-0.02em] text-page-text outline-none dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]" defaultValue={editBrand?.description ?? ""} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setEditBrandIndex(null)} className="flex h-10 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">Cancel</button>
            <button type="button" onClick={() => setEditBrandIndex(null)} className="flex h-10 cursor-pointer items-center rounded-full bg-foreground px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 dark:bg-white dark:text-[#111111] dark:hover:bg-white/90">Save</button>
          </div>
        </div>
      </Modal>

      {/* Remove Brand Confirmation */}
      <Modal open={removeBrandIndex !== null} onClose={() => setRemoveBrandIndex(null)} size="sm">
        <div className="flex flex-col gap-5 p-5">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Remove Brand</span>
          <p className="font-inter text-xs leading-[1.5] tracking-[-0.02em] text-foreground/70">
            Are you sure you want to remove <strong className="text-page-text">{removeBrand?.name}</strong>? This will unlink all associated campaigns and creators.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={() => setRemoveBrandIndex(null)} className="flex h-10 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">Cancel</button>
            <button type="button" onClick={() => setRemoveBrandIndex(null)} className="flex h-10 cursor-pointer items-center rounded-full bg-[#FB7185] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#FB7185]/90">Remove</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Team Tab ────────────────────────────────────────────────────────────────

function ThreeDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="4" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

const TEAM_MEMBERS = [
  { name: "Friso Hakkers", email: "friso@outpacestudios.com", role: "Owner", status: "active" as const, lastSeen: "Just now", isYou: true },
  { name: "Friso Hakkers", email: "friso@outpacestudios.com", role: "Admin", status: "active" as const, lastSeen: "2 hours ago", isYou: false },
  { name: "Friso Hakkers", email: "friso@outpacestudios.com", role: "Manager", status: "active" as const, lastSeen: "2 hours ago", isYou: false },
  { name: "Friso Hakkers", email: "friso@outpacestudios.com", role: "Developer", status: "active" as const, lastSeen: "2 hours ago", isYou: false },
  { name: "vlad@outpacestudios.com", email: "Invited 3 days ago", role: "Viewer", status: "pending" as const, lastSeen: "", isYou: false },
];

const BANNED_MEMBERS = [
  { name: "Derek Kim", email: "derek@outpacestudios.com", role: "Owner", lastSeen: "Feb 28, 2026" },
];

function SettingsClockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill="#FB923C" />
    </svg>
  );
}

function SettingsBannedIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM3.15 3.85711L3.85711 3.15L5 4.29289L6.14289 3.15L6.85 3.85711L5.70711 5L6.85 6.14289L6.14289 6.85L5 5.70711L3.85711 6.85L3.15 6.14289L4.29289 5L3.15 3.85711Z" fill="#FB7185" />
    </svg>
  );
}

function StatusBadge({ status }: { status: "active" | "pending" | "banned" }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center rounded-full bg-[rgba(0,153,77,0.08)] px-2 py-1 font-inter text-[12px] font-medium tracking-[-0.02em] text-[#34D399]">
        Active
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(229,113,0,0.08)] py-1 pl-1.5 pr-2 font-inter text-[12px] font-medium tracking-[-0.02em] text-[#E57100] dark:text-[#FB923C]">
        <SettingsClockIcon />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(251,113,133,0.08)] py-1 pl-1.5 pr-2 font-inter text-[12px] font-medium tracking-[-0.02em] text-[#FB7185]">
      <SettingsBannedIcon />
      Banned
    </span>
  );
}

function MemberTable({
  columns,
  children,
  containerRef,
  handlers,
  activeRect,
  sessionRef,
}: {
  columns: { label: string; width: string; hidden?: boolean }[];
  children: React.ReactNode;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  handlers?: { onMouseMove: (e: React.MouseEvent) => void; onMouseEnter: () => void; onMouseLeave: () => void };
  activeRect?: { top: number; left: number; width: number; height: number } | null;
  sessionRef?: React.RefObject<number>;
}) {
  return (
    <div className="overflow-visible rounded-2xl border border-foreground/[0.06] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header row */}
      <div className="hidden items-center border-b border-foreground/[0.06] px-1 dark:border-[rgba(224,224,224,0.03)] md:grid" style={{ gridTemplateColumns: "1fr 96px 104px 104px 96px" }}>
        {columns.map((col) => (
          <div key={col.label} className={cn("px-3 py-3", col.hidden && "opacity-0")}>
            <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text-muted">{col.label}</span>
          </div>
        ))}
      </div>
      {/* Mobile header */}
      <div className="flex items-center border-b border-foreground/[0.06] px-1 dark:border-[rgba(224,224,224,0.03)] md:hidden">
        <div className="flex-1 px-3 py-3">
          <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text-muted">Member</span>
        </div>
      </div>
      <div ref={containerRef} {...handlers} className="relative overflow-visible">
        <AnimatePresence>
          {activeRect && sessionRef && (
            <motion.div
              key={sessionRef.current}
              className="pointer-events-none absolute rounded-lg bg-foreground/[0.025]"
              initial={{ opacity: 0, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
              animate={{ opacity: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
            />
          )}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
}

// ── Three Dots Dropdown ─────────────────────────────────────────────────────

const DROPDOWN_ITEMS = [
  { label: "Edit role", action: "edit-role" },
  { label: "Resend invite", action: "resend" },
  { label: "Ban member", action: "ban", danger: true },
  { label: "Remove member", action: "remove", danger: true },
];

function MemberDropdown({ onAction }: { onAction: (action: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(menuRef);

  useEffect(() => {
    if (open) measureItems();
  }, [open, measureItems]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10]"
      >
        <ThreeDotsIcon />
      </button>
      {open && (
        <div
          ref={menuRef}
          onMouseMove={(e) => { e.stopPropagation(); handlers.onMouseMove(e); }}
          onMouseEnter={() => { handlers.onMouseEnter(); }}
          onMouseLeave={() => { handlers.onMouseLeave(); }}
          className="absolute bottom-full right-0 z-50 mb-1 flex w-[180px] flex-col rounded-xl border border-foreground/[0.06] bg-white p-1 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] dark:bg-card-bg"
        >
          <AnimatePresence>
            {activeRect && (
              <motion.div
                key={sessionRef.current}
                className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
                initial={{ opacity: 0, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                animate={{ opacity: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
              />
            )}
          </AnimatePresence>
          {DROPDOWN_ITEMS.map((item, i) => (
            <DropdownItem key={item.action} item={item} index={i} registerItem={registerItem} onAction={(a) => { onAction(a); setOpen(false); }} />
          ))}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ item, index, registerItem, onAction }: { item: { label: string; action: string; danger?: boolean }; index: number; registerItem: (i: number, el: HTMLElement | null) => void; onAction: (a: string) => void }) {
  const itemRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    registerItem(index, itemRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  return (
    <button
      ref={itemRef}
      onClick={() => onAction(item.action)}
      className={cn(
        "relative z-10 flex h-8 w-full cursor-pointer items-center rounded-lg px-2.5 font-inter text-[13px] font-medium tracking-[-0.02em]",
        item.danger ? "text-[#FB7185]" : "text-page-text",
      )}
    >
      {item.label}
    </button>
  );
}

// ── Invite Team Member Modal ──────────────────────────────────────────────

const INVITE_ROLES = [
  { id: "admin", name: "Admin", description: "Full access to all campaigns, settings, and team management" },
  { id: "manager", name: "Manager", description: "Manage campaigns, review submissions, message creators" },
  { id: "brand-client", name: "Brand client", description: "View-only access to analytics and notifications for specific brands" },
  { id: "viewer", name: "Viewer", description: "Read-only access to dashboards and reports" },
] as const;

const BRAND_PERMISSIONS = [
  { allowed: true, text: "View high-level campaign analytics" },
  { allowed: true, text: "See notifications and campaign status" },
  { allowed: true, text: "Access messages for their brand" },
  { allowed: false, text: "Cannot edit campaigns or settings" },
  { allowed: false, text: "Cannot view individual creator details or CPM rates" },
];

function InviteTeamMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("brand-client");
  const [brand, setBrand] = useState("Cantina");

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[520px]" showClose={false}>
      <div className="flex max-h-[90vh] flex-col">
        {/* Header */}
        <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-page-border px-5 dark:border-[rgba(224,224,224,0.03)]">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Invite Team Member</span>
          <button type="button" onClick={onClose} className="absolute right-4 top-3 flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-5 pt-5">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Add someone to your organization</span>
        </div>

        {/* Scrollable content */}
        <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-4">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="flex h-10 w-full items-center rounded-[14px] bg-foreground/[0.03] px-3.5 font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-subtle"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Role</span>
            <div className="flex flex-col gap-2 rounded-2xl border border-foreground/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
              <div className="flex flex-col gap-2">
                {INVITE_ROLES.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                        isSelected
                          ? "border-[rgba(251,146,60,0.3)] bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),#FFFFFF] dark:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),rgba(224,224,224,0.03)]"
                          : "border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-[rgba(224,224,224,0.05)]",
                      )}
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{role.name}</span>
                        <span className="font-inter text-sm leading-[150%] tracking-[-0.02em] text-page-text-muted">{role.description}</span>
                      </div>
                      {/* Radio */}
                      <div className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
                        isSelected
                          ? "bg-[#FB923C]"
                          : "border border-[rgba(37,37,37,0.1)] bg-white dark:border-foreground/20 dark:bg-foreground/[0.03]",
                      )} >
                        {isSelected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Assign to Brand (only for brand-client) */}
          {selectedRole === "brand-client" && (
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Assign to Brand</span>
              <div className="flex h-10 w-full items-center justify-between rounded-[14px] bg-foreground/[0.03] px-3.5">
                <span className="font-inter text-sm tracking-[-0.02em] text-page-text">{brand}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-page-text-muted"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          )}

          {/* Brand client permissions */}
          {selectedRole === "brand-client" && (
            <div className="flex flex-col overflow-hidden rounded-[10px] border border-foreground/[0.03] bg-foreground/[0.03]">
              <div className="border-b border-foreground/[0.03] px-3 py-2.5">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">Brand client permissions</span>
              </div>
              <div className="flex flex-col gap-3 px-3 py-3">
                {BRAND_PERMISSIONS.map((perm) => (
                  <div key={perm.text} className="flex items-center gap-1.5">
                    {perm.allowed ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" fill="#34D399" /><path d="M4 6L5.5 7.5L8 4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" fill="#FB7185" /><path d="M4.5 4.5L7.5 7.5M7.5 4.5L4.5 7.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    )}
                    <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{perm.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 px-5 pb-5 pt-4">
          <button type="button" onClick={onClose} className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.03] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.06]">
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors dark:text-page-bg",
              !email && "opacity-50 cursor-not-allowed",
            )}
            disabled={!email}
          >
            Send invite
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Create Custom Role Modal ─────────────────────────────────────────────

const ROLE_PERMISSIONS = [
  ["View campaigns", "Edit campaigns"],
  ["Create campaigns", "Delete campaigns"],
  ["View submissions", "Review submissions"],
  ["Manage creators", "View analytics"],
  ["Export data", "Manage billing"],
  ["Invite members", "Manage settings"],
];

function CreateCustomRoleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<Set<string>>(new Set());

  const togglePermission = (perm: string) => {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) next.delete(perm);
      else next.add(perm);
      return next;
    });
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[520px]" showClose={false}>
      <div className="flex max-h-[90vh] flex-col">
        {/* Header */}
        <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-page-border px-5 dark:border-[rgba(224,224,224,0.03)]">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Create custom role</span>
          <button type="button" onClick={onClose} className="absolute right-4 top-3 flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-5">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Name of role</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Campaign Manager"
              className="flex h-10 w-full items-center rounded-[14px] bg-foreground/[0.03] px-3.5 font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-subtle"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this role"
              rows={2}
              className="scrollbar-hide flex w-full resize-none items-center rounded-[14px] bg-foreground/[0.03] px-3.5 py-3 font-inter text-sm leading-[1.2] tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-subtle"
            />
          </div>

          {/* Permissions */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Permissions</span>
            <div className="flex flex-col gap-2 rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-5 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
              <div className="flex flex-col gap-2">
                {ROLE_PERMISSIONS.map((row, ri) => (
                  <div key={ri} className="flex flex-col gap-2 sm:flex-row">
                    {row.map((perm) => {
                      const isChecked = permissions.has(perm);
                      return (
                        <button
                          key={perm}
                          type="button"
                          onClick={() => togglePermission(perm)}
                          className={cn(
                            "flex flex-1 items-center gap-2 rounded-[14px] border px-2 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.05]",
                            isChecked
                              ? "border-[#FB923C] bg-white dark:border-[#FB923C] dark:bg-[rgba(224,224,224,0.03)]"
                              : "border-foreground/[0.06] bg-white dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]",
                          )}
                        >
                          {/* Checkbox */}
                          <div className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
                            isChecked
                              ? "bg-[#FB923C]"
                              : "border border-[rgba(37,37,37,0.1)] bg-white dark:border-foreground/20 dark:bg-foreground/[0.03]",
                          )} >
                            {isChecked && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            )}
                          </div>
                          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{perm}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center gap-2 px-5 pb-4 pt-5 sm:justify-end sm:pb-5">
          <button type="button" onClick={onClose} className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.03] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.06] dark:bg-[rgba(224,224,224,0.03)] sm:flex-none">
            Cancel
          </button>
          <button type="button" onClick={onClose} className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-foreground px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:opacity-90 dark:bg-[#E0E0E0] dark:text-[#252525] sm:flex-none">
            Create role
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Confirmation Modal ──────────────────────────────────────────────────────

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  danger,
  icon,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" showClose={false}>
      <div className="flex flex-col items-center gap-4 px-5 pt-5">
        {/* Icon circle */}
        {icon && (
          <div className="relative flex size-14 items-center justify-center rounded-full bg-foreground/[0.03]"><div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            {icon}
          </div>
        )}

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-inter text-lg font-medium tracking-[-0.02em] text-page-text">{title}</span>
          <span className="max-w-[300px] text-center font-inter text-sm leading-[1.5] tracking-[-0.02em] text-page-text-muted">{description}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full items-center justify-end gap-2 px-5 pb-5 pt-4">
        <button
          onClick={onClose}
          className="inline-flex h-9 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
        >
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center rounded-full px-4 font-inter text-[14px] font-medium tracking-[-0.02em] transition-colors",
            danger
              ? "bg-[rgba(251,113,133,0.08)] text-[#FB7185] hover:bg-[rgba(251,113,133,0.12)]"
              : "bg-foreground text-white hover:opacity-90 dark:text-page-bg",
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

function TeamMemberRow({ member, index, registerItem, onRevoke, onBan, onRemove }: {
  member: (typeof TEAM_MEMBERS)[number];
  index: number;
  registerItem: (i: number, el: HTMLElement | null) => void;
  onRevoke: (name: string) => void;
  onBan: (name: string) => void;
  onRemove: (name: string) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerItem(index, rowRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  return (
    <div
      ref={rowRef}
      className="relative z-10 border-b border-foreground/[0.03] px-1 last:border-b-0"
    >
      {/* Desktop: grid row */}
      <div className="hidden items-center md:grid" style={{ gridTemplateColumns: "1fr 96px 104px 104px 96px" }}>
        <div className={cn("flex min-w-0 items-center gap-2 px-3 py-3", member.status === "pending" && "opacity-60")}>
          <div className="size-8 shrink-0 rounded-full bg-foreground/[0.12]" />
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">{member.name}</span>
            <span className="truncate font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">{member.email}</span>
          </div>
        </div>
        <div className="px-3 py-3">
          <span className="font-inter text-[12px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text-muted">{member.role}</span>
        </div>
        <div className="px-3 py-3">
          <StatusBadge status={member.status} />
        </div>
        {member.status === "pending" ? (
          <div className="col-span-2 flex items-center justify-end gap-2 px-3 py-3">
            <button onClick={() => onRevoke(member.name)} className="inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
              Revoke
            </button>
            <button className="inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
              Resend
            </button>
          </div>
        ) : (
          <>
            <div className="px-3 py-3">
              <span className="whitespace-nowrap font-inter text-[12px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text-muted">{member.lastSeen}</span>
            </div>
            <div className="flex items-center justify-end px-3 py-3">
              {member.isYou ? (
                <span className="font-inter text-[12px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">You</span>
              ) : (
                <MemberDropdown onAction={(action) => {
                  if (action === "ban") onBan(member.name);
                  if (action === "remove") onRemove(member.name);
                }} />
            )}
          </div>
        </>
      )}
      </div>
      {/* Mobile: simple row */}
      <div className="flex items-center md:hidden">
        <div className={cn("flex min-w-0 flex-1 items-center gap-2 px-3 py-3", member.status === "pending" && "opacity-60")}>
          <div className="size-8 shrink-0 rounded-full bg-foreground/[0.12]" />
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">{member.name}</span>
            <span className="truncate font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">{member.email}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 px-3 py-3">
          {member.status === "pending" ? (
            <>
              <button onClick={() => onRevoke(member.name)} className="inline-flex h-[30px] cursor-pointer items-center rounded-full bg-foreground/[0.06] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text dark:bg-[rgba(224,224,224,0.03)]">Revoke</button>
              <button className="inline-flex h-[30px] cursor-pointer items-center rounded-full bg-foreground/[0.06] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text dark:bg-[rgba(224,224,224,0.03)]">Resend</button>
            </>
          ) : member.isYou ? (
            <span className="font-inter text-[12px] font-medium text-page-text">You</span>
          ) : (
            <MemberDropdown onAction={(action) => { if (action === "ban") onBan(member.name); if (action === "remove") onRemove(member.name); }} />
          )}
        </div>
      </div>
    </div>
  );
}

function BannedMemberRow({ member, index, registerItem, onUnban }: {
  member: (typeof BANNED_MEMBERS)[number];
  index: number;
  registerItem: (i: number, el: HTMLElement | null) => void;
  onUnban: (name: string) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerItem(index, rowRef.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  return (
    <div ref={rowRef} className="relative z-10 border-b border-foreground/[0.03] px-1 last:border-b-0">
      {/* Desktop */}
      <div className="hidden items-center md:grid" style={{ gridTemplateColumns: "1fr 96px 104px 104px 96px" }}>
        <div className="flex min-w-0 items-center gap-2 px-3 py-3">
          <div className="size-8 shrink-0 rounded-full bg-foreground/[0.12]" />
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate font-inter text-[12px] font-medium tracking-[-0.02em] text-[#FB7185]">{member.name}</span>
            <span className="truncate font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">{member.email}</span>
          </div>
        </div>
        <div className="px-3 py-3"><span className="font-inter text-[12px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text-muted">{member.role}</span></div>
        <div className="px-3 py-3"><StatusBadge status="banned" /></div>
        <div className="px-3 py-3"><span className="whitespace-nowrap font-inter text-[12px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text-muted">{member.lastSeen}</span></div>
        <div className="flex items-center justify-end px-3 py-3">
          <button onClick={() => onUnban(member.name)} className="inline-flex h-[30px] cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">Unban</button>
        </div>
      </div>
      {/* Mobile */}
      <div className="flex items-center md:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-3">
          <div className="size-8 shrink-0 rounded-full bg-foreground/[0.12]" />
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate font-inter text-[12px] font-medium tracking-[-0.02em] text-[#FB7185]">{member.name}</span>
            <span className="truncate font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">{member.email}</span>
          </div>
        </div>
        <div className="shrink-0 px-3 py-3">
          <button onClick={() => onUnban(member.name)} className="inline-flex h-[30px] cursor-pointer items-center rounded-full bg-foreground/[0.06] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text dark:bg-[rgba(224,224,224,0.03)]">Unban</button>
        </div>
      </div>
    </div>
  );
}

function TeamTab() {
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [unbanTarget, setUnbanTarget] = useState<string | null>(null);
  const [banTarget, setBanTarget] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const activeTableRef = useRef<HTMLDivElement>(null);
  const activeHover = useProximityHover(activeTableRef);
  const activeRect = activeHover.activeIndex !== null ? activeHover.itemRects[activeHover.activeIndex] : null;

  const bannedTableRef = useRef<HTMLDivElement>(null);
  const bannedHover = useProximityHover(bannedTableRef);
  const bannedRect = bannedHover.activeIndex !== null ? bannedHover.itemRects[bannedHover.activeIndex] : null;

  useEffect(() => { activeHover.measureItems(); }, [activeHover.measureItems]);
  useEffect(() => { bannedHover.measureItems(); }, [bannedHover.measureItems]);

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-5 sm:px-5">
      {/* Revoke invite modal */}
      <ConfirmModal
        open={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => setRevokeTarget(null)}
        title="Revoke invitation"
        description={`Are you sure you want to revoke the invitation for ${revokeTarget}? They will no longer be able to join your organization.`}
        confirmLabel="Revoke"
        danger
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 7L9 4C9 2.89543 9.89543 2 11 2H13C14.1046 2 15 2.89543 15 4V7M3 7H21M5 7V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-page-text" />
          </svg>
        }
      />

      {/* Unban modal */}
      <ConfirmModal
        open={!!unbanTarget}
        onClose={() => setUnbanTarget(null)}
        onConfirm={() => setUnbanTarget(null)}
        title="Unban member"
        description={`Are you sure you want to unban ${unbanTarget}? They will regain access to your organization.`}
        confirmLabel="Unban"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" className="text-page-text" />
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-page-text" />
          </svg>
        }
      />

      {/* Ban modal */}
      <ConfirmModal
        open={!!banTarget}
        onClose={() => setBanTarget(null)}
        onConfirm={() => setBanTarget(null)}
        title="Ban member"
        description={`Are you sure you want to ban ${banTarget}? They will lose all access to your organization immediately.`}
        confirmLabel="Ban member"
        danger
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" className="text-page-text" />
            <path d="M5.63 5.63L18.37 18.37" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-page-text" />
          </svg>
        }
      />

      {/* Remove modal */}
      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => setRemoveTarget(null)}
        title="Remove member"
        description={`Are you sure you want to remove ${removeTarget}? This action cannot be undone.`}
        confirmLabel="Remove"
        danger
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 21V19C16 16.7909 14.2091 15 12 15H5C2.79086 15 1 16.7909 1 19V21M12.5 3.5C12.5 5.433 10.933 7 9 7C7.067 7 5.5 5.433 5.5 3.5C5.5 1.567 7.067 0 9 0C10.933 0 12.5 1.567 12.5 3.5ZM20 8L20 14M17 11H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-page-text" />
          </svg>
        }
      />

      {/* Invite Team Member modal */}
      <InviteTeamMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} />

      {/* Create Custom Role modal */}
      {/* Header row */}
      <div className="flex w-full max-w-[1028px] items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-inter text-base font-medium leading-[1.2] tracking-[-0.02em] text-page-text">Team Members</span>
          <span className="font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text-muted">
            Manage who has access to your organization.
          </span>
        </div>
        <button onClick={() => setInviteOpen(true)} className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 pl-3 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:opacity-90 dark:bg-[#E0E0E0] dark:text-[#252525]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.667v10.666M2.667 8h10.666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="hidden sm:inline">Invite member</span>
          <span className="sm:hidden">Invite</span>
        </button>
      </div>

      {/* Active members table */}
      <div className="w-full max-w-[1028px]">
      <MemberTable
        columns={[
          { label: "Member", width: "240px" },
          { label: "Role", width: "96px" },
          { label: "Status", width: "104px" },
          { label: "Last seen", width: "104px" },
          { label: "Actions", width: "96px", hidden: true },
        ]}
        containerRef={activeTableRef}
        handlers={activeHover.handlers}
        activeRect={activeRect}
        sessionRef={activeHover.sessionRef}
      >
        {TEAM_MEMBERS.map((member, i) => (
          <TeamMemberRow
            key={i}
            member={member}
            index={i}
            registerItem={activeHover.registerItem}
            onRevoke={setRevokeTarget}
            onBan={setBanTarget}
            onRemove={setRemoveTarget}
          />
        ))}
      </MemberTable>
      </div>

      {/* Banned members */}
      <div className="flex w-full max-w-[1028px] flex-col gap-3">
        <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">Banned members</span>
        <MemberTable
          columns={[
            { label: "Member", width: "240px" },
            { label: "Role", width: "96px" },
            { label: "Status", width: "104px" },
            { label: "Last seen", width: "104px" },
            { label: "Actions", width: "96px", hidden: true },
          ]}
          containerRef={bannedTableRef}
          handlers={bannedHover.handlers}
          activeRect={bannedRect}
          sessionRef={bannedHover.sessionRef}
        >
          {BANNED_MEMBERS.map((member, i) => (
            <BannedMemberRow key={i} member={member} index={i} registerItem={bannedHover.registerItem} onUnban={setUnbanTarget} />
          ))}
        </MemberTable>
      </div>
    </div>
  );
}

// ── Permissions Tab ──────────────────────────────────────────────────────────

function PermissionsTab() {
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-5 sm:px-5">
      <CreateCustomRoleModal open={roleModalOpen} onClose={() => setRoleModalOpen(false)} />

      {/* Header row */}
      <div className="flex w-full max-w-[1028px] items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-inter text-base font-medium leading-[1.2] tracking-[-0.02em] text-page-text">Role permissions</span>
          <span className="font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text-muted">
            Manage who has access to your organization.
          </span>
        </div>
        <button onClick={() => setRoleModalOpen(true)} className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 pl-3 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:opacity-90 dark:bg-[#E0E0E0] dark:text-[#252525]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.667v10.666M2.667 8h10.666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Custom role
        </button>
      </div>

      {/* Placeholder roles list */}
      <div className="flex w-full max-w-[1028px] flex-col gap-2">
        {["Admin", "Manager", "Brand Client", "Viewer"].map((role) => (
          <div key={role} className={cn(cardClass, "flex-row items-center justify-between gap-4 p-4")}>
            <div className="flex flex-col gap-1">
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{role}</span>
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                {role === "Admin" ? "Full access to all campaigns, settings, and team management" :
                 role === "Manager" ? "Manage campaigns, review submissions, message creators" :
                 role === "Brand Client" ? "View-only access to analytics and notifications for specific brands" :
                 "Read-only access to dashboards and reports"}
              </span>
            </div>
            <button className="shrink-0 rounded-full bg-foreground/[0.06] px-3 py-1.5 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Agency Profile Tab ────────────────────────────────────────────────────────

const AGENCY_ACCORDION_SECTIONS = [
  "Branding",
  "Content",
  "Video",
  "Platforms & Services",
  "Team Members",
  "Case Studies",
  "Testimonials",
  "Brand Partnerships",
  "Campaign Showcase",
  "Budget & Booking",
  "CTA & Links",
] as const;

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("shrink-0 text-page-text-muted transition-transform duration-200", open && "rotate-180")}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Color Picker Popover ─────────────────────────────────────────────────────

const PRESET_COLORS = [
  "#E5484D", "#FF6B2C", "#F5A623", "#F7CE46", "#46A758", "#30A46C",
  "#0091FF", "#3E63DD", "#6E56CF", "#8E4EC6", "#D6409F", "#E93D82",
  "#1C2024", "#60646C", "#8B8D98", "#B9BBC6", "#FFFFFF", "#FF9025",
];

function ColorPickerPopover({
  color,
  onChange,
  label,
}: {
  color: string;
  onChange: (color: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const openPicker = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left + rect.width / 2 });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      <button
        onClick={openPicker}
        className="size-12 cursor-pointer rounded-[6.4px] transition-shadow hover:ring-2 hover:ring-foreground/[0.12]"
        style={{ backgroundColor: color }}
      />
      <span className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted">{label}</span>
      <span className="font-inter text-[11px] font-medium tracking-[-0.02em] text-page-text">{color}</span>

      {open && (
        <div
          ref={popoverRef}
          className="fixed z-[100] w-[240px] -translate-x-1/2 rounded-xl border border-foreground/[0.06] bg-white p-3 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] dark:bg-card-bg"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="flex flex-col gap-3">
            {/* react-colorful picker */}
            <HexColorPicker color={color} onChange={onChange} style={{ width: "100%", height: 160 }} />
            {/* Hex input */}
            <HexColorInput
              color={color}
              onChange={onChange}
              prefixed
              className="h-8 w-full rounded-lg border border-foreground/[0.06] bg-foreground/[0.04] px-2.5 font-inter text-[13px] text-page-text outline-none"
            />
            {/* Preset color grid */}
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange(c)}
                  className={cn(
                    "size-7 cursor-pointer rounded-md border transition-transform hover:scale-110",
                    color === c ? "border-foreground ring-1 ring-foreground/20" : "border-foreground/[0.06]",
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AgencyProfileTab() {
  const [previewMode, setPreviewMode] = useState<"Mobile" | "Desktop">("Mobile");
  const [openSection, setOpenSection] = useState<string>("Branding");
  const [primaryColor, setPrimaryColor] = useState("#E5484D");
  const [secondaryColor, setSecondaryColor] = useState("#E5484D");
  const [logoFile, setLogoFile] = useState<{ name: string; url: string } | null>(null);
  const [bannerFile, setBannerFile] = useState<{ name: string; url: string } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: { name: string; url: string } | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter({ name: file.name, url: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="flex justify-center px-5 py-5">
      <div className="flex w-full max-w-[1028px] items-start gap-4 lg:flex-row">
        {/* ── Left column: Live Preview ── */}
        <div className={cn(cardClass, "hidden flex-1 gap-4 lg:flex")}>
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className={labelClass}>Live Preview</span>
            {/* Mobile / Desktop segmented toggle */}
            <div className="flex items-center rounded-xl bg-foreground/[0.06] p-0.5">
              {(["Mobile", "Desktop"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={cn(
                    "flex h-7 cursor-pointer items-center justify-center rounded-[10px] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] transition-colors",
                    previewMode === mode
                      ? "bg-white text-page-text shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[#222222] dark:shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:text-white"
                      : "text-page-text-subtle hover:text-page-text",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Phone mockup frame */}
          <div className="flex items-start justify-center">
            <div
              className="relative flex shrink-0 flex-col overflow-hidden rounded-[40px] border border-foreground/[0.16] bg-foreground/[0.02]"
              style={{ width: 393, height: 852 }}
            >
              {/* iOS Status bar */}
              <div className="flex h-[54px] w-full items-center justify-between px-8">
                <span className="text-[17px] font-semibold leading-[22px] text-page-text" style={{ fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}>
                  9:41
                </span>
                <div className="flex items-center gap-[7px]">
                  {/* Signal bars */}
                  <svg width="20" height="13" viewBox="0 0 20 13" fill="none" className="text-page-text">
                    <path fillRule="evenodd" clipRule="evenodd" d="M19.2 1.14623C19.2 0.513183 18.7224 0 18.1333 0H17.0667C16.4776 0 16 0.513183 16 1.14623V11.0802C16 11.7132 16.4776 12.2264 17.0667 12.2264H18.1333C18.7224 12.2264 19.2 11.7132 19.2 11.0802V1.14623ZM11.7659 2.44528H12.8326C13.4217 2.44528 13.8992 2.97078 13.8992 3.61902V11.0527C13.8992 11.7009 13.4217 12.2264 12.8326 12.2264H11.7659C11.1768 12.2264 10.6992 11.7009 10.6992 11.0527V3.61902C10.6992 2.97078 11.1768 2.44528 11.7659 2.44528ZM7.43411 5.09433H6.36745C5.77834 5.09433 5.30078 5.62652 5.30078 6.28301V11.0377C5.30078 11.6942 5.77834 12.2264 6.36745 12.2264H7.43411C8.02322 12.2264 8.50078 11.6942 8.50078 11.0377V6.28301C8.50078 5.62652 8.02322 5.09433 7.43411 5.09433ZM2.13333 7.53962H1.06667C0.477563 7.53962 0 8.06421 0 8.71132V11.0547C0 11.7018 0.477563 12.2264 1.06667 12.2264H2.13333C2.72244 12.2264 3.2 11.7018 3.2 11.0547V8.71132C3.2 8.06421 2.72244 7.53962 2.13333 7.53962Z" fill="currentColor"/>
                  </svg>
                  {/* WiFi */}
                  <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="text-page-text">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.5713 2.46628C11.0584 2.46639 13.4504 3.38847 15.2529 5.04195C15.3887 5.1696 15.6056 5.16799 15.7393 5.03834L17.0368 3.77487C17.1045 3.70911 17.1422 3.62004 17.1417 3.52735C17.1411 3.43467 17.1023 3.34603 17.0338 3.28104C12.3028 -1.09368 4.83907 -1.09368 0.108056 3.28104C0.039524 3.34598 0.000639766 3.4346 7.82398e-06 3.52728C-0.000624118 3.61996 0.0370483 3.70906 0.104689 3.77487L1.40255 5.03834C1.53615 5.16819 1.75327 5.1698 1.88893 5.04195C3.69167 3.38836 6.08395 2.46628 8.5713 2.46628ZM8.56795 6.68656C9.92527 6.68647 11.2341 7.19821 12.2403 8.12234C12.3763 8.2535 12.5907 8.25065 12.7234 8.11593L14.0106 6.79663C14.0784 6.72742 14.1161 6.63355 14.1151 6.536C14.1141 6.43844 14.0746 6.34536 14.0054 6.27757C10.9416 3.38672 6.19688 3.38672 3.13305 6.27757C3.06384 6.34536 3.02435 6.43849 3.02345 6.53607C3.02254 6.63366 3.06028 6.72752 3.12822 6.79663L4.41513 8.11593C4.54778 8.25065 4.76215 8.2535 4.89823 8.12234C5.90368 7.19882 7.21152 6.68713 8.56795 6.68656ZM11.0924 9.48011C11.0943 9.58546 11.0572 9.68703 10.9899 9.76084L8.81327 12.2156C8.74946 12.2877 8.66247 12.3283 8.5717 12.3283C8.48093 12.3283 8.39394 12.2877 8.33013 12.2156L6.1531 9.76084C6.08585 9.68697 6.04886 9.58537 6.05085 9.48002C6.05284 9.37467 6.09365 9.27491 6.16364 9.20429C7.55374 7.8904 9.58966 7.8904 10.9798 9.20429C11.0497 9.27497 11.0904 9.37476 11.0924 9.48011Z" fill="currentColor"/>
                  </svg>
                  {/* Battery */}
                  <svg width="28" height="13" viewBox="0 0 28 13" fill="none" className="text-page-text">
                    <rect opacity="0.35" x="0.5" y="0.5" width="24" height="12" rx="3.8" stroke="currentColor"/>
                    <path opacity="0.4" d="M26 4.78125V8.85672C26.8047 8.51155 27.328 7.70859 27.328 6.81899C27.328 5.92938 26.8047 5.12642 26 4.78125Z" fill="currentColor"/>
                    <rect x="2" y="2" width="21" height="9" rx="2.5" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              {/* Nav */}
              <div className="flex items-center justify-between px-5 pb-3">
                <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">Applications</span>
                <span className="inline-flex h-9 items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">Browse Campaigns</span>
              </div>

              {/* Content — clipped to show ~1.5 cards */}
              <div className="relative flex flex-1 flex-col gap-4 overflow-hidden px-5">
                {/* Filter tabs */}
                <div className="flex items-center gap-0.5 rounded-[14px] bg-foreground/[0.04] p-0.5">
                  <div className="flex h-9 items-center gap-1.5 rounded-xl bg-white px-3 shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[#222222] dark:shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
                    <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">All</span>
                    <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">8</span>
                  </div>
                  <div className="flex h-9 items-center gap-1.5 rounded-xl px-3">
                    <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text/70">Rejected</span>
                    <div className="flex size-3.5 items-center justify-center rounded-full bg-[#FF3355]">
                      <span className="font-inter text-[10px] font-semibold text-white">1</span>
                    </div>
                  </div>
                  <div className="flex h-9 items-center gap-1.5 rounded-xl px-3">
                    <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text/70">Pending</span>
                    <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">2</span>
                  </div>
                  <div className="flex h-9 items-center gap-1.5 rounded-xl px-3">
                    <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text/70">Accepted</span>
                    <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">5</span>
                  </div>
                </div>

                {/* Campaign cards */}
                {[
                  { brand: "Polymarket Official", campaign: "PolyMarket UGC Reposting Campaign", desc: "Post Clips from the provided google drive of UGC content and get paid $0.5 per 1k views", creators: "121.4K", rate: "$1.50", category: "Gaming", status: "rejected" as const, date: "on Wed 4 Mar, 2026", applied: "Applied on 2 Mar, 2026" },
                  { brand: "Scene Society", campaign: "Mumford & Sons | Prizefighter Clipping", desc: "Clip content from the approved folder of assets or create your own using the approved formats listed below.", creators: "725", rate: "$1", category: "Music", status: "accepted" as const, date: "on Jan. 10, 2026", applied: "Applied on Tue 3 Mar, 2026" },
                  { brand: "Clipping Culture", campaign: "Mumford & Sons | Prizefighter Clipping", desc: "Clip content from the approved folder of assets or create your own using the approved formats listed below.", creators: "3K", rate: "$1.50", category: "Gaming", status: "pending" as const, date: "Est. wait: 2-3 days", applied: "Applied on Wed 4 Mar, 2026" },
                ].map((card, i) => {
                  const gradientColor = card.status === "rejected" ? "rgba(255,37,37,0.07)" : card.status === "accepted" ? "rgba(0,178,110,0.07)" : "rgba(255,144,37,0.07)";
                  const statusColor = card.status === "rejected" ? "#FF3355" : card.status === "accepted" ? "#00B259" : "#FF9025";
                  const statusBg = card.status === "rejected" ? "rgba(255,51,85,0.1)" : card.status === "accepted" ? "rgba(0,178,89,0.1)" : "rgba(255,144,37,0.1)";
                  const statusLabel = card.status === "rejected" ? "Rejected" : card.status === "accepted" ? "Accepted" : "Pending";

                  return (
                    <div
                      key={i}
                      className="flex flex-col overflow-hidden rounded-xl border border-foreground/[0.06] shadow-[0px_1px_2px_rgba(0,0,0,0.03)]"
                      style={{ background: `linear-gradient(207.66deg, rgba(255,255,255,0) 75.84%, ${gradientColor} 100.02%), var(--card-bg, #fff)` }}
                    >
                      {/* Cover image placeholder */}
                      <div className="mx-[2.5px] mt-[2.5px]">
                        <div className="h-[140px] rounded-[10px] bg-foreground/[0.08]" />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-3 p-3">
                        {/* Brand row */}
                        <div className="flex items-center gap-1">
                          <div className="size-[15px] shrink-0 rounded-full bg-foreground/[0.12]" />
                          <span className="font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text">{card.brand}</span>
                          <img src="/icons/verified-check.svg" alt="Verified" width={12} height={12} />
                          <span className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted">&middot;</span>
                          <span className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted">{card.applied}</span>
                        </div>

                        {/* Title + desc */}
                        <div className="flex flex-col gap-1">
                          <span className="font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text">{card.campaign}</span>
                          <span className="line-clamp-2 font-inter text-[11px] leading-[150%] tracking-[-0.02em] text-page-text/70">{card.desc}</span>
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-1">
                          <span className="inline-flex h-6 items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2.5 font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text dark:bg-card-bg">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M11 14v-1.5a2.5 2.5 0 00-2.5-2.5h-4A2.5 2.5 0 002 12.5V14M6.5 7.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM14 14v-1.5a2.5 2.5 0 00-2-2.45M10 2.13a2.5 2.5 0 010 4.74" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            {card.creators}
                          </span>
                          <span className="inline-flex h-6 items-center gap-0.5 rounded-full bg-[rgba(59,130,246,0.1)] px-2.5 font-inter text-[13px] font-medium tracking-[-0.02em] text-[#3B82F6]">
                            {card.rate}<span className="text-[#3B82F6]/70">/1K</span>
                          </span>
                          <span className="font-inter text-[12px] text-page-text/20">&middot;</span>
                          <div className="flex items-center gap-1">
                            <div className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.06] bg-white dark:bg-card-bg">
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M8.39 1.44c.08-.38.61-.37.68.01l.88 4.75a.38.38 0 00.37.3h4.2c.39 0 .55.51.23.73l-3.41 2.38a.37.37 0 00-.14.42l1.3 4.05c.12.38-.31.7-.63.46L8.41 12a.38.38 0 00-.44 0l-3.48 2.53c-.32.23-.75-.08-.63-.46l1.3-4.05a.37.37 0 00-.14-.42L1.61 7.23c-.32-.22-.16-.73.23-.73h4.2a.38.38 0 00.37-.3l.88-4.75z" fill="currentColor" className="text-page-text" /></svg>
                            </div>
                            <div className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.06] bg-white dark:bg-card-bg">
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.2" className="text-page-text" /><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" className="text-page-text" /><circle cx="12" cy="4" r="1" fill="currentColor" className="text-page-text" /></svg>
                            </div>
                            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-foreground/[0.06] bg-white px-2 font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text dark:bg-card-bg">
                              {card.category}
                            </span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-foreground/[0.06]" />

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-inter text-[11px] font-medium tracking-[-0.02em]" style={{ background: statusBg, color: statusColor }}>
                              {card.status === "rejected" && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke={statusColor} strokeWidth="1" /><path d="M4 4l4 4M8 4l-4 4" stroke={statusColor} strokeWidth="1" strokeLinecap="round" /></svg>}
                              {card.status === "accepted" && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke={statusColor} strokeWidth="1" /><path d="M4 6l1.5 1.5L8 5" stroke={statusColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                              {card.status === "pending" && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke={statusColor} strokeWidth="1" /><path d="M6 3v3l2 1" stroke={statusColor} strokeWidth="1" strokeLinecap="round" /></svg>}
                              {statusLabel}
                            </span>
                            <span className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted">{card.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-8 items-center rounded-full bg-foreground/[0.06] px-3 font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text">
                              {card.status === "rejected" ? "Browse similar" : card.status === "accepted" ? "View campaign" : "Withdraw"}
                            </span>
                            <span className={cn("inline-flex h-8 items-center rounded-full px-3 font-inter text-[13px] font-medium tracking-[-0.02em]", card.status === "pending" ? "bg-foreground/[0.06] text-page-text" : "bg-foreground text-white dark:text-page-bg")}>
                              {card.status === "rejected" ? "Reapply" : card.status === "accepted" ? "Submit" : "View details"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Fade out gradient */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#1c1c1e] dark:via-[#1c1c1e]/80" />
              </div>

              {/* Bottom tab bar */}
              <div className="flex shrink-0 h-[83px] flex-col items-center border-t border-foreground/[0.15] bg-white px-4 pt-2.5 dark:bg-card-bg">
                <div className="flex w-full items-start justify-around">
                  <div className="flex flex-col items-center text-foreground/30">
                    <svg width="20" height="21" viewBox="0 0 12 13" fill="none"><path d="M7.13306 0.351916C6.45055 -0.117306 5.54945 -0.117305 4.86694 0.351916L0.866942 3.10192C0.324233 3.47503 0 4.09141 0 4.75V10.0486C0 11.1532 0.895431 12.0486 2 12.0486H3.66667C4.03486 12.0486 4.33333 11.7501 4.33333 11.382V9.04863C4.33333 8.12815 5.07953 7.38196 6 7.38196C6.92047 7.38196 7.66667 8.12815 7.66667 9.04863V11.382C7.66667 11.7501 7.96514 12.0486 8.33333 12.0486H10C11.1046 12.0486 12 11.1532 12 10.0486V4.75C12 4.09141 11.6758 3.47503 11.1331 3.10192L7.13306 0.351916Z" fill="currentColor" /></svg>
                  </div>
                  <div className="flex flex-col items-center text-page-text">
                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 1C2 0.447715 2.44772 0 3 0H17C17.5523 0 18 0.447715 18 1C18 1.55228 17.5523 2 17 2H3C2.44772 2 2 1.55228 2 1ZM0 6C0 4.34315 1.34315 3 3 3H17C18.6569 3 20 4.34315 20 6V15C20 16.6569 18.6569 18 17 18H3C1.34315 18 0 16.6569 0 15V6ZM8.56681 7.5987C8.91328 7.43218 9.32452 7.479 9.62469 7.71913L12.1247 9.71913C12.3619 9.9089 12.5 10.1962 12.5 10.5C12.5 10.8038 12.3619 11.0911 12.1247 11.2809L9.62469 13.2809C9.32452 13.521 8.91328 13.5678 8.56681 13.4013C8.22034 13.2348 8 12.8844 8 12.5V8.5C8 8.11559 8.22034 7.76522 8.56681 7.5987Z" fill="currentColor" /></svg>
                  </div>
                  <div className="flex flex-col items-center text-foreground/30">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10.9578 0.712652C10.8309 0.289668 10.4416 0 10 0C9.55839 0 9.16907 0.289668 9.04217 0.712652C8.32283 3.11046 7.39036 4.82042 6.10539 6.10539C4.82042 7.39036 3.11046 8.32283 0.712652 9.04217C0.289668 9.16907 0 9.55839 0 10C0 10.4416 0.289668 10.8309 0.712652 10.9578C3.11046 11.6772 4.82042 12.6096 6.10539 13.8946C7.39036 15.1796 8.32283 16.8895 9.04217 19.2873C9.16907 19.7103 9.55839 20 10 20C10.4416 20 10.8309 19.7103 10.9578 19.2873C11.6772 16.8895 12.6096 15.1796 13.8946 13.8946C15.1796 12.6096 16.8895 11.6772 19.2873 10.9578C19.7103 10.8309 20 10.4416 20 10C20 9.55839 19.7103 9.16907 19.2873 9.04217C16.8895 8.32283 15.1796 7.39036 13.8946 6.10539C12.6096 4.82042 11.6772 3.11046 10.9578 0.712652Z" fill="currentColor" /></svg>
                  </div>
                  <div className="relative flex flex-col items-center text-foreground/30">
                    <svg width="21" height="18" viewBox="0 0 21 18" fill="none"><path d="M10.5 0C13.5647 0 16.1899 0.791608 18.0674 2.35691C19.9668 3.94042 21 6.23347 21 9C21 11.7665 19.9668 14.0596 18.0674 15.6431C16.1899 17.2084 13.5647 18 10.5 18C8.88073 18 7.05744 17.8505 5.41575 17.1378C5.13664 17.2938 4.75233 17.4834 4.29596 17.6417C3.34475 17.9717 1.95903 18.2047 0.571921 17.5477C0.299752 17.4187 0.100181 17.174 0.0286359 16.8815C-0.0429088 16.5889 0.0211972 16.2797 0.203145 16.0398C0.891539 15.1318 1.10848 14.4277 1.16855 13.9774C1.22638 13.544 1.14543 13.2957 1.13604 13.2688L1.1367 13.2704C1.1367 13.2704 1.13611 13.2689 1.13523 13.2665L1.13604 13.2688C1.13604 13.2688 1.13499 13.2662 1.1341 13.2641L1.12642 13.2461L1.11364 13.2158C1.03706 13.0322 0.76608 12.3691 0.512595 11.578C0.269341 10.8187 8.46376e-06 9.81649 8.46376e-06 9C8.46376e-06 6.23347 1.03317 3.94042 2.93258 2.35691C4.81015 0.791608 7.43532 0 10.5 0Z" fill="currentColor" /></svg>
                    <div className="absolute -right-1.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-[#FF3355]">
                      <span className="font-inter text-[9px] font-semibold text-white">2</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-foreground/30">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M13.1444 8.21619C13.2679 7.70895 13.3333 7.17899 13.3333 6.63375C13.3333 3.17685 10.7022 0.334483 7.33333 5.10075e-09V6.1623L13.1444 8.21619Z" fill="currentColor" /><path d="M12.7001 9.47332L6.44451 7.26231C6.17811 7.16815 6 6.9163 6 6.63375V0C2.63112 0.334483 0 3.17685 0 6.63375C0 10.3156 2.98477 13.3004 6.66667 13.3004C9.333 13.3004 11.6337 11.7351 12.7001 9.47332Z" fill="currentColor" /></svg>
                  </div>
                </div>
                {/* Home Bar */}
                <div className="mt-auto mb-2 h-[5px] w-[140px] rounded-[100px] bg-black dark:bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column: Edit Profile ── */}
        <div className={cn(cardClass, "flex-1 gap-4")}>
          <span className={labelClass}>Edit profile</span>

          {/* Accordion container */}
          <div className="overflow-hidden rounded-2xl border border-foreground/[0.06]">
            {AGENCY_ACCORDION_SECTIONS.map((section, idx) => {
              const isOpen = openSection === section;
              const isLast = idx === AGENCY_ACCORDION_SECTIONS.length - 1;

              return (
                <div key={section} className={cn(!isLast && "border-b border-foreground/[0.06]")}>
                  {/* Section header row */}
                  <button
                    onClick={() => toggleSection(section)}
                    className="flex h-11 w-full cursor-pointer items-center justify-between px-4 transition-colors hover:bg-foreground/[0.02]"
                  >
                    <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">
                      {section}
                    </span>
                    <ChevronIcon open={isOpen} />
                  </button>

                  {/* Expanded content — only Branding */}
                  {isOpen && section === "Branding" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      {/* Agency name */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Agency name</span>
                        <input
                          className={inputClass}
                          defaultValue="Virality"
                        />
                      </div>

                      {/* Logo */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className={labelClass}>Logo</span>
                          <span className="font-inter text-[10px] tracking-[-0.02em] text-page-text-muted">Upload PNG or JPEG</span>
                        </div>
                        <input ref={logoInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleFileUpload(e, setLogoFile)} />
                        {logoFile ? (
                          <div className="flex items-center gap-3">
                            <div className="size-[60px] shrink-0 overflow-hidden rounded-full border border-foreground/[0.06]">
                              <img src={logoFile.url} alt="Logo" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                              <span className="truncate font-inter text-[14px] tracking-[-0.02em] text-page-text">{logoFile.name}</span>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setLogoFile(null)} className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-[rgba(251,113,133,0.08)] px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-[#FB7185] transition-colors hover:bg-[rgba(251,113,133,0.12)]">
                                  Delete
                                </button>
                                <button onClick={() => logoInputRef.current?.click()} className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">
                                  Change
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => logoInputRef.current?.click()}
                            className="flex items-center gap-3 rounded-[14px] border border-dashed border-foreground/[0.16] px-4 py-4 transition-colors hover:border-foreground/[0.24] hover:bg-foreground/[0.02]"
                          >
                            <div className="flex size-[60px] shrink-0 items-center justify-center rounded-full bg-foreground/[0.04]">
                              <IconUpload size={20} className="text-page-text-muted" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">Upload logo</span>
                              <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">PNG or JPEG, recommended 200x200px</span>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Banner */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className={labelClass}>Banner</span>
                          <span className="font-inter text-[10px] tracking-[-0.02em] text-page-text-muted">Upload PNG or JPEG</span>
                        </div>
                        <input ref={bannerInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleFileUpload(e, setBannerFile)} />
                        {bannerFile ? (
                          <div className="relative">
                            <div className="overflow-hidden rounded-[14px]" style={{ height: 231 }}>
                              <img src={bannerFile.url} alt="Banner" className="h-full w-full object-cover" />
                            </div>
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                              <button onClick={() => setBannerFile(null)} className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-[rgba(251,113,133,0.08)] px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-[#FB7185] backdrop-blur-sm transition-colors hover:bg-[rgba(251,113,133,0.12)]">
                                Delete
                              </button>
                              <button onClick={() => bannerInputRef.current?.click()} className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text backdrop-blur-sm transition-colors hover:bg-foreground/[0.10]">
                                Change
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => bannerInputRef.current?.click()}
                            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-foreground/[0.16] bg-foreground/[0.02] transition-colors hover:border-foreground/[0.24] hover:bg-foreground/[0.04]"
                            style={{ height: 231 }}
                          >
                            <IconPhoto size={28} className="text-page-text-muted" />
                            <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">Upload banner image</span>
                            <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">PNG or JPEG, recommended 1200x400px</span>
                          </button>
                        )}
                      </div>

                      {/* Brand Colors */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Brand Colors</span>
                        <div className="flex items-start gap-8">
                          <ColorPickerPopover color={primaryColor} onChange={setPrimaryColor} label="Primary" />
                          <ColorPickerPopover color={secondaryColor} onChange={setSecondaryColor} label="Secondary" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Content section ── */}
                  {isOpen && section === "Content" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      {/* Tagline */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Tagline</span>
                        <input className={inputClass} defaultValue="Clipping & UGC campaigns for top brands" />
                      </div>
                      {/* About / Pitch */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>About / Pitch</span>
                        <textarea
                          className="w-full resize-none rounded-[14px] bg-foreground/[0.04] px-3.5 py-2.5 font-inter text-[14px] leading-[1.5] tracking-[-0.02em] text-page-text outline-none"
                          style={{ height: 75, scrollbarWidth: "none" }}
                          defaultValue="Virality runs clipping and UGC campaigns for top brands on Whop. 5,781 creators, 590M+ views, 37 campaigns managed since September 2025."
                        />
                      </div>
                      {/* Niches */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Niches</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {["Gaming", "Personal Brand"].map((niche) => (
                            <span key={niche} className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#252525] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text dark:border-white/[0.25]">
                              {niche}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            </span>
                          ))}
                          <span className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-foreground/[0.06] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.03]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            Add
                          </span>
                        </div>
                      </div>
                      {/* Languages */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Languages</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {["English", "Spanish"].map((lang) => (
                            <span key={lang} className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#252525] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text dark:border-white/[0.25]">
                              {lang}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            </span>
                          ))}
                          <span className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-foreground/[0.06] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.03]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            Add
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Video section ── */}
                  {isOpen && section === "Video" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      {/* Video Title */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Video Title</span>
                        <input className={inputClass} placeholder="Video Title" />
                      </div>
                      {/* Intro Video */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className={labelClass}>Intro Video</span>
                          <span className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted">Upload PNG or JPEG</span>
                        </div>
                        <div
                          className="flex flex-col items-center justify-center gap-1 rounded-[14px] border border-dashed border-foreground/[0.16] cursor-pointer transition-colors hover:bg-foreground/[0.04] hover:border-foreground/[0.24]"
                          style={{ height: 231 }}
                        >
                          <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">Upload intro video</span>
                          <span className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted">MP4, max 90 seconds</span>
                        </div>
                      </div>
                      {/* Autoplay toggle */}
                      <div className="flex items-center justify-between">
                        <span className={labelClass}>Autoplay on page load</span>
                        <button className="flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full bg-[#252525] p-0.5 transition-colors dark:bg-white/[0.80]">
                          <div className="ml-auto size-4 rounded-full bg-white transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Platforms & Services section ── */}
                  {isOpen && section === "Platforms & Services" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      {/* Platforms */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Platforms you operate on</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            { name: "TikTok", selected: true },
                            { name: "YouTube", selected: false },
                            { name: "Instagram", selected: true },
                            { name: "X / Twitter", selected: false },
                            { name: "Facebook", selected: false },
                            { name: "Twitch", selected: false },
                          ].map(({ name, selected }) => (
                            <span
                              key={name}
                              className={cn(
                                "inline-flex h-7 cursor-pointer items-center rounded-full px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text",
                                selected ? "border border-[#252525] dark:border-white/[0.25]" : "border border-foreground/[0.06]",
                              )}
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Services */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Services offered</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {["Creator Sourcing", "Content QA", "Campaign Management", "UGC Production", "Performance Optimization"].map((svc) => (
                            <span key={svc} className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#252525] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text dark:border-white/[0.25]">
                              {svc}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            </span>
                          ))}
                        </div>
                        {/* Add service input */}
                        <div className={cn(inputClass, "gap-2")}>
                          <input className="min-w-0 flex-1 bg-transparent outline-none font-inter text-[14px] tracking-[-0.02em] text-page-text placeholder:text-page-text-muted" placeholder="Add a service..." />
                          <span className="inline-flex h-6 shrink-0 cursor-pointer items-center rounded-full border border-foreground/[0.06] px-2.5 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.04]">Add</span>
                        </div>
                      </div>
                      {/* Languages */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Languages</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {["English", "Spanish"].map((lang) => (
                            <span key={lang} className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#252525] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text dark:border-white/[0.25]">
                              {lang}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            </span>
                          ))}
                          <span className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-foreground/[0.06] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.03]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            Add
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Team Members section ── */}
                  {isOpen && section === "Team Members" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      {/* Member cards */}
                      {[
                        { name: "Theo Patel", role: "CEO & Founder" },
                        { name: "Maria Santos", role: "Head of Creator Relations" },
                        { name: "Jordan Lee", role: "Campaign Strategist" },
                      ].map((member) => (
                        <div
                          key={member.name}
                          className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] p-4"
                          style={{ maxWidth: 442 }}
                        >
                          <div className="size-9 shrink-0 rounded-full bg-foreground/[0.12]" />
                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">{member.name}</span>
                            <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">{member.role}</span>
                          </div>
                          <button className="shrink-0 cursor-pointer text-page-text-muted hover:text-page-text">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </button>
                        </div>
                      ))}
                      {/* Add member pill */}
                      <button className="inline-flex h-8 w-fit cursor-pointer items-center gap-1.5 rounded-full border border-foreground/[0.06] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.03]">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                        Add Team Member
                      </button>
                      {/* Add form card */}
                      <div className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] p-4" style={{ maxWidth: 442 }}>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Name</span>
                          <input className={inputClass} placeholder="Name" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Role</span>
                          <input className={inputClass} placeholder="Role" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Photo</span>
                          <div
                            className="flex flex-col items-center justify-center gap-1 rounded-[14px] border border-dashed border-foreground/[0.16] cursor-pointer transition-colors hover:bg-foreground/[0.04] hover:border-foreground/[0.24]"
                            style={{ height: 88 }}
                          >
                            <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">Upload photo</span>
                            <span className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted">PNG or JPEG</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text hover:bg-foreground/[0.10]">
                            Cancel
                          </button>
                          <button className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground px-4 font-inter text-[12px] font-medium tracking-[-0.02em] text-white hover:opacity-90 dark:text-page-bg">
                            Add Member
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Case Studies section ── */}
                  {isOpen && section === "Case Studies" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      {/* Case study cards */}
                      {[
                        { name: "Cantina Launch Campaign", stats: "12M views in 30 days, 23 creators, $0.42 CPM achieved" },
                        { name: "Flooz Clipping Esports Push", stats: "45M views, 112 creators, 94% brand safety score" },
                      ].map((cs) => (
                        <div key={cs.name} className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] p-4" style={{ maxWidth: 442 }}>
                          <div className="size-9 shrink-0 rounded-full bg-foreground/[0.12]" />
                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">{cs.name}</span>
                            <span className="font-inter text-[12px] leading-[1.4] tracking-[-0.02em] text-page-text-muted">{cs.stats}</span>
                          </div>
                          <button className="shrink-0 cursor-pointer text-page-text-muted hover:text-page-text">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </button>
                        </div>
                      ))}
                      {/* Add case study pill */}
                      <button className="inline-flex h-8 w-fit cursor-pointer items-center gap-1.5 rounded-full border border-foreground/[0.06] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.03]">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                        Add Case Study
                      </button>
                      {/* Add form card */}
                      <div className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] p-4" style={{ maxWidth: 442 }}>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Campaign / project name</span>
                          <input className={inputClass} placeholder="Campaign / project name" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Video URL</span>
                          <div className={cn(inputClass, "gap-2")}>
                            <input className="min-w-0 flex-1 bg-transparent outline-none font-inter text-[14px] tracking-[-0.02em] text-page-text placeholder:text-page-text-muted" placeholder="https://" />
                            <span className="inline-flex h-6 shrink-0 cursor-pointer items-center rounded-full border border-foreground/[0.06] px-2.5 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.04]">Add</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Key results</span>
                          <input className={inputClass} placeholder="Key results" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Description</span>
                          <textarea
                            className="w-full resize-none rounded-[14px] bg-foreground/[0.04] px-3.5 py-2.5 font-inter text-[14px] leading-[1.5] tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                            style={{ height: 75 }}
                            placeholder="Description"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text hover:bg-foreground/[0.10]">
                            Cancel
                          </button>
                          <button className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground px-4 font-inter text-[12px] font-medium tracking-[-0.02em] text-white hover:opacity-90 dark:text-page-bg">
                            Add Case Study
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Testimonials section ── */}
                  {isOpen && section === "Testimonials" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      {/* Testimonial cards */}
                      {[
                        { name: "Jake Morrison", company: "OpenAI", quote: "Virality helped us scale from 0 to 45M views in 60 days. Best agency we've worked with." },
                        { name: "Sarah Chen", company: "Flooz", quote: "Incredible team — campaign management was flawless and creator quality was top notch." },
                      ].map((t) => (
                        <div
                          key={t.name}
                          className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] p-4"
                          style={{ minHeight: 86, maxWidth: 442 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-9 shrink-0 rounded-full bg-foreground/[0.12]" />
                            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                              <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">{t.name}</span>
                              <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">{t.company}</span>
                            </div>
                            <button className="shrink-0 cursor-pointer text-page-text-muted hover:text-page-text">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </button>
                          </div>
                          <p className="font-inter text-[12px] leading-[1.5] tracking-[-0.02em] text-page-text">{t.quote}</p>
                          <Rating rating={5} size="sm" starClassName="text-[#FFC131] fill-[#FFC131]" />
                        </div>
                      ))}
                      {/* Add testimonial pill */}
                      <button className="inline-flex h-8 w-fit cursor-pointer items-center gap-1.5 rounded-full border border-foreground/[0.06] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.03]">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                        Add Testimonial
                      </button>
                      {/* Add form card */}
                      <div className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] p-4" style={{ maxWidth: 442 }}>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Name</span>
                          <input className={inputClass} placeholder="Name" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Role</span>
                          <input className={inputClass} placeholder="Role (e.g. Gaming Creator, 2M subs)" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Rating</span>
                          <Rating rating={0} size="sm" editable starClassName="text-foreground/20 fill-foreground/10 hover:text-[#FFC131] hover:fill-[#FFC131] [&.filled]:text-[#FFC131] [&.filled]:fill-[#FFC131]" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Quote</span>
                          <textarea
                            className="w-full resize-none rounded-[14px] bg-foreground/[0.04] px-3.5 py-2.5 font-inter text-[14px] leading-[1.5] tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                            style={{ height: 92 }}
                            placeholder="Quote"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text hover:bg-foreground/[0.10]">
                            Cancel
                          </button>
                          <button className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground px-4 font-inter text-[12px] font-medium tracking-[-0.02em] text-white hover:opacity-90 dark:text-page-bg">
                            Add Testimonial
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Brand Partnerships section ── */}
                  {isOpen && section === "Brand Partnerships" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      {/* Brand pills */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Brands</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {["Cantina", "Flooz", "Flip.gg"].map((brand) => (
                            <span key={brand} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#252525] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text dark:border-white/[0.25]">
                              <div className="size-4 shrink-0 rounded bg-foreground/[0.12]" />
                              {brand}
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            </span>
                          ))}
                          <button className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-foreground/[0.06] px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.03]">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                            Add Brand
                          </button>
                        </div>
                      </div>
                      {/* Add brand form card */}
                      <div className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] p-4" style={{ maxWidth: 442 }}>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Name</span>
                          <input className={inputClass} placeholder="Brand name" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={labelClass}>Logo</span>
                          <div
                            className="flex flex-col items-center justify-center gap-1 rounded-[14px] border border-dashed border-foreground/[0.16] cursor-pointer transition-colors hover:bg-foreground/[0.04] hover:border-foreground/[0.24]"
                            style={{ height: 88 }}
                          >
                            <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">Upload logo</span>
                            <span className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted">PNG or JPEG</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text hover:bg-foreground/[0.10]">
                            Cancel
                          </button>
                          <button className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground px-4 font-inter text-[12px] font-medium tracking-[-0.02em] text-white hover:opacity-90 dark:text-page-bg">
                            Add Brand
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Campaign Showcase section ── */}
                  {isOpen && section === "Campaign Showcase" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      <span className={labelClass}>Select campaigns to feature on your public profile:</span>
                      <div className="flex flex-col gap-2">
                        {["Cantina Launch", "Flooz March Campaign", "Flip.gg Draft Weekend", "Atricent Q1", "Holiday Special 2025"].map((campaign) => (
                          <label key={campaign} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-foreground/[0.04]">
                            <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-foreground/[0.12]" />
                            <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">{campaign}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Budget & Booking section ── */}
                  {isOpen && section === "Budget & Booking" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      {/* Minimum campaign budget */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Minimum campaign budget</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            { label: "$1,000", selected: false },
                            { label: "$5,000", selected: false },
                            { label: "$10,000", selected: true },
                            { label: "$25,000", selected: false },
                            { label: "$50,000", selected: false },
                          ].map(({ label, selected }) => (
                            <button
                              key={label}
                              className={cn(
                                "inline-flex h-8 cursor-pointer items-center rounded-full px-3 font-inter text-[12px] tracking-[-0.02em] text-page-text",
                                selected ? "border border-[#252525] dark:border-white/[0.25]" : "border border-foreground/[0.06] hover:bg-foreground/[0.03]",
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Booking link */}
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Booking / Calendly link</span>
                        <input className={inputClass} defaultValue="https://calendly.com/viral-agency/30min" />
                      </div>
                      {/* Response time */}
                      <SelectInput label="Response time" value="Less than 48hrs" />
                    </div>
                  )}

                  {/* ── CTA & Links section ── */}
                  {isOpen && section === "CTA & Links" && (
                    <div className="flex flex-col gap-4 border-t border-foreground/[0.06] px-4 pb-4 pt-4">
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Primary CTA Text</span>
                        <input className={inputClass} defaultValue="Join as Creator" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={labelClass}>Secondary CTA Text</span>
                        <input className={inputClass} defaultValue="Apply to Work With Us" />
                      </div>
                      <div className="flex flex-col gap-2"><span className={labelClass}>YouTube URL</span><input className={inputClass} defaultValue="https://youtube.com/@youragency" /></div>
                      <div className="flex flex-col gap-2"><span className={labelClass}>TikTok URL</span><input className={inputClass} defaultValue="https://tiktok.com/@youragency" /></div>
                      <div className="flex flex-col gap-2"><span className={labelClass}>X / Twitter URL</span><input className={inputClass} defaultValue="https://x.com/youragency" /></div>
                      <div className="flex flex-col gap-2"><span className={labelClass}>Instagram URL</span><input className={inputClass} defaultValue="https://instagram.com/youragency" /></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Client Onboarding Tab ───────────────────────────────────────────────────

// ── Client Onboarding Steps ─────────────────────────────────────────────────

const CLIENT_ONBOARDING_STEPS = [
  { title: "Client intake form", desc: "Auto-generate a contract with payment terms, deliverables, and policies." },
  { title: "Connect payment via Whop", desc: "Once connected, all future payments flow through Whop automatically." },
  { title: "Generate contract", desc: "Auto-generate that includes all relevant info, via Whop." },
  { title: "Create campaign", desc: "Select specifics and campaign model (CPM, retainer, per post)" },
  { title: "First invoice & reporting", desc: "Schedule recurring invoices based on contract terms." },
];

function OnboardingStepRow({ step, index, registerItem }: { step: typeof CLIENT_ONBOARDING_STEPS[number]; index: number; registerItem: (i: number, el: HTMLElement | null) => void }) {
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => { registerItem(index, rowRef.current); return () => registerItem(index, null); }, [index, registerItem]);
  return (
    <div ref={rowRef} className="relative z-10">
      {index > 0 && <div className="pl-[52px]"><div className="h-px w-full bg-foreground/[0.06]" /></div>}
      <div className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3">
        {/* Step number */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] bg-foreground/[0.02] shadow-[0_0_0_2px_#FFFFFF] dark:shadow-[0_0_0_2px_var(--page-outer-bg)]">
          <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">{index + 1}</span>
        </div>
        {/* Text */}
        <div className="flex flex-1 flex-col gap-1">
          <span className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-page-text">{step.title}</span>
          <span className="font-inter text-[14px] leading-[150%] tracking-[-0.02em] text-page-text/70">{step.desc}</span>
        </div>
        {/* Chevron */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-muted transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-page-text">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function ClientOnboardingTab() {
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const stepsHover = useProximityHover(stepsContainerRef);
  const stepsActiveRect = stepsHover.activeIndex !== null ? stepsHover.itemRects[stepsHover.activeIndex] : null;
  useEffect(() => { stepsHover.measureItems(); }, [stepsHover.measureItems]);

  return (
    <div className="relative flex flex-1 flex-col items-center">
      {/* Background gradients */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full"
        style={{
          background: [
            "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255, 63, 213, 0.24) 0%, rgba(255, 63, 213, 0) 100%)",
            "radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255, 144, 37, 0.24) 0%, rgba(255, 144, 37, 0) 100%)",
          ].join(", "),
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-[720px] flex-1 flex-col items-center justify-center px-5 py-8">
        {/* Header section */}
        <div className="flex w-full flex-col items-center gap-4 pb-6">
          {/* User-add icon */}
          <div className="relative flex size-14 items-center justify-center rounded-full bg-foreground/[0.03]"><div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} /><div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            <svg width="19" height="20" viewBox="0 0 19 20" fill="none">
              <path d="M8.35156 0C5.86628 0 3.85156 2.01472 3.85156 4.5C3.85156 6.98528 5.86628 9 8.35156 9C10.8368 9 12.8516 6.98528 12.8516 4.5C12.8516 2.01472 10.8368 0 8.35156 0Z" fill="currentColor" fillOpacity="0.7" />
              <path d="M14.3516 12C14.9038 12 15.3516 12.4477 15.3516 13V15H17.3516C17.9038 15 18.3516 15.4477 18.3516 16C18.3516 16.5523 17.9038 17 17.3516 17H15.3516V19C15.3516 19.5523 14.9038 20 14.3516 20C13.7993 20 13.3516 19.5523 13.3516 19V17H11.3516C10.7993 17 10.3516 16.5523 10.3516 16C10.3516 15.4477 10.7993 15 11.3516 15H13.3516V13C13.3516 12.4477 13.7993 12 14.3516 12Z" fill="currentColor" fillOpacity="0.7" />
              <path d="M0.0484696 16.6964C0.905344 12.8837 4.05339 10 8.35258 10C9.78432 10 11.0884 10.3198 12.2227 10.8873C11.6848 11.4295 11.3525 12.1759 11.3525 13C9.69568 13 8.35254 14.3431 8.35254 16C8.35254 17.6569 9.69568 19 11.3525 19H1.951C0.815849 19 -0.241306 17.9858 0.0484696 16.6964Z" fill="currentColor" fillOpacity="0.7" />
            </svg>
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-1.5 px-5">
            <h1 className="font-inter text-[20px] font-medium tracking-[-0.02em] text-page-text">New client setup</h1>
            <p className="max-w-[457px] text-center font-inter text-[16px] leading-[150%] tracking-[-0.02em] text-page-text/70">
              Your agency dashboard lets you run multiple brand campaigns from one place. Add your first brand client to get started.
            </p>
          </div>
        </div>

        {/* Steps card */}
        <div className="flex w-full flex-col rounded-[20px] border border-foreground/[0.06] bg-white p-6 dark:bg-page-bg">
          <div ref={stepsContainerRef} {...stepsHover.handlers} className="relative">
            <AnimatePresence>
              {stepsActiveRect && (
                <motion.div
                  key={stepsHover.sessionRef.current}
                  className="pointer-events-none absolute rounded-lg bg-foreground/[0.025]"
                  initial={{ opacity: 0, top: stepsActiveRect.top, left: stepsActiveRect.left, width: stepsActiveRect.width, height: stepsActiveRect.height }}
                  animate={{ opacity: 1, top: stepsActiveRect.top, left: stepsActiveRect.left, width: stepsActiveRect.width, height: stepsActiveRect.height }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {CLIENT_ONBOARDING_STEPS.map((step, i) => (
              <OnboardingStepRow key={step.title} step={step} index={i} registerItem={stepsHover.registerItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-32">
      <p className="font-inter text-[14px] tracking-[-0.02em] text-page-text-muted">
        {name} settings coming soon.
      </p>
    </div>
  );
}

// ── Main Settings Page ───────────────────────────────────────────────────────

function getTabFromHash(): SettingsTab {
  if (typeof window === "undefined") return "Profile";
  const hash = window.location.hash.slice(1).replace(/-/g, " ");
  const match = SETTINGS_TABS.find((t) => t.toLowerCase() === hash.toLowerCase());
  return match ?? "Profile";
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>(getTabFromHash);
  const [copied, setCopied] = useState(false);

  const handleTabChange = useCallback((tab: SettingsTab) => {
    setActiveTab(tab);
    window.location.hash = tab.toLowerCase().replace(/\s+/g, "-");
  }, []);

  return (
    <div className="flex flex-1 flex-col dark:bg-page-bg">
      {/* Tab header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-page-bg pr-4 sm:pr-5">
        <ProximityTabs
          tabs={SETTINGS_TABS.map((t) => ({ label: t }))}
          selectedIndex={SETTINGS_TABS.indexOf(activeTab)}
          onSelect={(i) => handleTabChange(SETTINGS_TABS[i])}
        />

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Preview button — Agency Profile only */}
          {activeTab === "Agency Profile" && (
            <button className="hidden h-9 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] sm:inline-flex">
              Preview
            </button>
          )}

          {/* Copy Link button — Agency Profile only */}
          {activeTab === "Agency Profile" && <button
            onClick={() => {
              navigator.clipboard.writeText("https://app.contentrewards.com/agency/virality");
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={cn(
              "hidden h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 font-inter text-[14px] font-medium tracking-[-0.02em] transition-colors sm:inline-flex",
              copied
                ? "bg-[#00994D] text-white"
                : "bg-foreground/[0.06] text-page-text hover:bg-foreground/[0.10]",
            )}
          >
            <span className="inline-grid">
              <span className="invisible col-start-1 row-start-1">Copy Link</span>
              <span className="col-start-1 row-start-1 text-center">{copied ? "Copied!" : "Copy Link"}</span>
            </span>
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.333 1.75H11.083C11.404 1.75 11.667 2.013 11.667 2.333V11.667C11.667 11.987 11.404 12.25 11.083 12.25H2.917C2.596 12.25 2.333 11.987 2.333 11.667V2.333C2.333 2.013 2.596 1.75 2.917 1.75H4.667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><rect x="4.667" y="0.583" width="4.667" height="2.333" rx="0.583" stroke="currentColor" strokeWidth="1.2" /></svg>
            )}
          </button>}

          {/* User avatar pill */}
          <UserDropdown variant="header" />
        </div>
      </header>

      {/* Tab content */}
      {activeTab === "Profile" && <ProfileTab />}
      {activeTab === "Notifications" && <NotificationsTab />}
      {activeTab === "Brands" && <BrandsTab />}
      {activeTab === "Team" && <TeamTab />}
      {activeTab === "Permissions" && <PermissionsTab />}
      {activeTab === "Agency Profile" && <AgencyProfileTab />}
      {activeTab === "Client Onboarding" && <ClientOnboardingTab />}
      {activeTab !== "Profile" && activeTab !== "Notifications" && activeTab !== "Brands" && activeTab !== "Team" && activeTab !== "Permissions" && activeTab !== "Agency Profile" && activeTab !== "Client Onboarding" && <PlaceholderTab name={activeTab} />}
    </div>
  );
}
