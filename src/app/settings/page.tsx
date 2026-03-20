"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { ProximityTabs } from "@/components/ui/proximity-tabs";

// ── Settings Tabs ────────────────────────────────────────────────────────────

const SETTINGS_TABS = [
  "Profile",
  "Applications",
  "Contracts",
  "Brands",
  "Team",
  "Permissions",
  "Notifications",
  "Agency Profile",
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
  "dark:border-white/[0.06] dark:bg-white/[0.02]",
);

// ── Select-like input with chevron ───────────────────────────────────────────

function SelectInput({ value, label }: { value: string; label?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className={labelClass}>{label}</span>}
      <div className={cn(inputClass, "cursor-pointer justify-between")}>
        <span>{value}</span>
        <ChevronDown className="size-3 text-page-text-muted" />
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
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[rgba(37,37,37,0.06)] bg-white dark:border-white/[0.06] dark:bg-white/[0.04]">
          <div className="flex size-5 items-center justify-center">{icon}</div>
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text">{name}</span>
          </div>
          <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text-muted">{detail}</span>
        </div>
        <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-[#00994D]">Connected</span>
      </div>
    </div>
  );
}

// ── Tab Content Components ───────────────────────────────────────────────────

function ProfileTab() {
  const [dirty, setDirty] = useState(false);

  return (
    <div className="flex justify-center px-5 py-5">
      <div className="flex w-full max-w-[520px] flex-col gap-2">
        {/* Profile card */}
        <div className={cardClass}>
          {/* Avatar + change photo */}
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full bg-[rgba(37,37,37,0.08)] dark:bg-white/[0.08]" />
            <button className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">
              Change photo
            </button>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {/* Row 1: Full name + Email */}
            <div className="flex gap-4">
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
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <span className={labelClass}>Company</span>
                <div className={cn(inputClass, "cursor-pointer gap-1.5")}>
                  <div className="size-4 rounded border border-[rgba(37,37,37,0.06)] bg-gradient-to-b from-[#F59E0B] to-[#F97316] dark:border-white/[0.06]" />
                  <span className="flex-1">Outpace Studios</span>
                  <ChevronDown className="size-3 text-page-text-muted" />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <SelectInput label="Role" value="Designer" />
              </div>
            </div>

            {/* Row 3: Timezone */}
            <div className="flex">
              <div className="flex flex-1 flex-col gap-2">
                <SelectInput label="Timezone" value="EST (UTC-5)" />
              </div>
              <div className="flex-1" />
            </div>
          </div>

          {/* Save button — right aligned */}
          <div className="flex justify-end">
            <button
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 font-inter text-[14px] font-medium tracking-[-0.02em] text-white dark:text-[#111111]",
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
          "size-4 rounded-full bg-white transition-transform dark:bg-[#111111]",
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
    <div className={cn(cardClass, "gap-2 p-4")}>
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

                {/* Segmented control */}
                <div className="flex items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5">
                  {EMAIL_FREQUENCIES.map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setEmailFrequency(freq)}
                      className={cn(
                        "flex h-8 flex-1 cursor-pointer items-center justify-center rounded-[10px] font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] transition-colors",
                        emailFrequency === freq
                          ? "bg-white text-page-text shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-white/[0.10] dark:text-white"
                          : "text-page-text-subtle hover:text-page-text",
                      )}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");

  return (
    <div className="flex flex-1 flex-col dark:bg-[#111111]">
      {/* Tab header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-page-bg px-4 sm:px-5">
        <ProximityTabs
          tabs={SETTINGS_TABS.map((t) => ({ label: t }))}
          selectedIndex={SETTINGS_TABS.indexOf(activeTab)}
          onSelect={(i) => setActiveTab(SETTINGS_TABS[i])}
        />

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Export button */}
          <button className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-4 pl-3 font-inter text-[14px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">
            <ExportIcon />
            Export
          </button>

          {/* User avatar pill */}
          <button className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-foreground/[0.06] py-1 pl-1 pr-2 transition-colors hover:bg-foreground/[0.10]">
            <div className="size-7 rounded-full bg-foreground/[0.12]" />
            <ChevronDown className="size-4 text-page-text" />
          </button>
        </div>
      </header>

      {/* Tab content */}
      {activeTab === "Profile" && <ProfileTab />}
      {activeTab === "Notifications" && <NotificationsTab />}
      {activeTab !== "Profile" && activeTab !== "Notifications" && <PlaceholderTab name={activeTab} />}
    </div>
  );
}
