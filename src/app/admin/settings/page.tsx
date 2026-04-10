// @ts-nocheck
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";

// ── Toggle ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative cursor-pointer rounded-full transition-colors"
      style={{
        width: 36, height: 20,
        background: checked ? "#f6850f" : "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="absolute top-[2px] rounded-full bg-white shadow-sm transition-[left]"
        style={{ width: 14, height: 14, left: checked ? 19 : 3 }}
      />
    </button>
  );
}

// ── Setting row ──────────────────────────────────────────────────────

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4" style={{ borderBottom: "1px solid var(--border-color, rgba(255,255,255,0.08))" }}>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-page-text">{label}</div>
        {description && <div className="mt-0.5 text-xs text-page-text-muted">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card-bg p-4 sm:p-5">
      <h3 className="mb-1 text-sm font-semibold text-page-text">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────

const TABS = [
  { name: "General" },
  { name: "Notifications" },
  { name: "Security" },
  { name: "Integrations" },
];

// ── Page ─────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toast } = useToast();
  const { confirm } = useConfirm();

  // General
  const [platformName, setPlatformName] = useState("Content Rewards");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [signupsEnabled, setSignupsEnabled] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");

  // Notifications
  const [emailNewUser, setEmailNewUser] = useState(true);
  const [emailPayout, setEmailPayout] = useState(true);
  const [emailFailedWebhook, setEmailFailedWebhook] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  // Security
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [auditRetention, setAuditRetention] = useState("90");

  return (
    <div>
      {/* Top nav */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
          Settings
        </span>
        <button onClick={() => toast("Settings saved")} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#f6850f] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90">
          Save changes
        </button>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto scrollbar-hide px-4 pt-3 sm:px-6 md:hidden" style={{ scrollbarWidth: "none" }}>
        <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex} className="w-max">
          {TABS.map((tab, i) => (
            <TabItem key={tab.name} label={tab.name} index={i} />
          ))}
        </Tabs>
      </div>
      <div className="hidden px-4 pt-[21px] sm:px-6 md:flex">
        <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex} className="w-fit">
          {TABS.map((tab, i) => (
            <TabItem key={tab.name} label={tab.name} index={i} />
          ))}
        </Tabs>
      </div>

      {/* Content */}
      <div className="space-y-4 px-4 pb-6 pt-4 sm:px-6">
        {/* General */}
        {selectedIndex === 0 && (
          <>
            <SettingSection title="Platform">
              <SettingRow label="Platform name" description="Displayed in emails and public pages">
                <input
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="h-9 w-[200px] rounded-lg border border-border bg-transparent px-3 text-sm text-page-text outline-none focus:border-[#f6850f]"
                />
              </SettingRow>
              <SettingRow label="Default currency" description="Currency for payouts and pricing">
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="h-9 w-[120px] cursor-pointer rounded-lg border border-border bg-transparent px-3 text-sm text-page-text outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </SettingRow>
              <SettingRow label="Maintenance mode" description="Show maintenance page to all non-admin users">
                <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} />
              </SettingRow>
              <SettingRow label="Open signups" description="Allow new creator registrations">
                <Toggle checked={signupsEnabled} onChange={setSignupsEnabled} />
              </SettingRow>
            </SettingSection>

            <SettingSection title="Danger Zone">
              <SettingRow label="Purge cache" description="Clear all cached data. May cause temporary slowdowns.">
                <button onClick={() => confirm({ title: "Purge cache?", message: "This will clear all cached data and may cause temporary slowdowns.", confirmLabel: "Purge", destructive: true }).then((ok) => { if (ok) toast("Cache purged"); })} className="h-9 cursor-pointer rounded-lg border border-[#FF2525]/30 bg-[#FF2525]/10 px-4 text-sm font-medium text-[#FF2525] transition-colors hover:bg-[#FF2525]/20">
                  Purge
                </button>
              </SettingRow>
            </SettingSection>
          </>
        )}

        {/* Notifications */}
        {selectedIndex === 1 && (
          <>
            <SettingSection title="Email Notifications">
              <SettingRow label="New user registration" description="Get notified when a new creator signs up">
                <Toggle checked={emailNewUser} onChange={setEmailNewUser} />
              </SettingRow>
              <SettingRow label="Payout completed" description="Get notified when a payout batch is processed">
                <Toggle checked={emailPayout} onChange={setEmailPayout} />
              </SettingRow>
              <SettingRow label="Failed webhooks" description="Alert when webhook delivery fails 3+ times">
                <Toggle checked={emailFailedWebhook} onChange={setEmailFailedWebhook} />
              </SettingRow>
              <SettingRow label="Daily digest" description="Summary of platform activity at 9am">
                <Toggle checked={dailyDigest} onChange={setDailyDigest} />
              </SettingRow>
            </SettingSection>

            <SettingSection title="Integrations">
              <SettingRow label="Slack alerts" description="Send critical alerts to #admin-alerts channel">
                <Toggle checked={slackAlerts} onChange={setSlackAlerts} />
              </SettingRow>
            </SettingSection>
          </>
        )}

        {/* Security */}
        {selectedIndex === 2 && (
          <>
            <SettingSection title="Authentication">
              <SettingRow label="Two-factor authentication" description="Require 2FA for all admin accounts">
                <Toggle checked={twoFactor} onChange={setTwoFactor} />
              </SettingRow>
              <SettingRow label="Session timeout" description="Minutes of inactivity before auto-logout">
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="h-9 w-[120px] cursor-pointer rounded-lg border border-border bg-transparent px-3 text-sm text-page-text outline-none"
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </SettingRow>
              <SettingRow label="IP whitelist" description="Restrict admin access to specific IP addresses">
                <Toggle checked={ipWhitelist} onChange={setIpWhitelist} />
              </SettingRow>
            </SettingSection>

            <SettingSection title="Audit">
              <SettingRow label="Audit log retention" description="How long to keep audit log entries">
                <select
                  value={auditRetention}
                  onChange={(e) => setAuditRetention(e.target.value)}
                  className="h-9 w-[120px] cursor-pointer rounded-lg border border-border bg-transparent px-3 text-sm text-page-text outline-none"
                >
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="180">180 days</option>
                  <option value="365">1 year</option>
                </select>
              </SettingRow>
            </SettingSection>
          </>
        )}

        {/* Integrations */}
        {selectedIndex === 3 && (
          <SettingSection title="Connected Services">
            {[
              { name: "Stripe", description: "Payment processing", connected: true, icon: "💳" },
              { name: "PayPal", description: "Alternative payouts", connected: true, icon: "🅿️" },
              { name: "Slack", description: "Team notifications", connected: false, icon: "💬" },
              { name: "Notion", description: "Task management sync", connected: true, icon: "📝" },
              { name: "Google Analytics", description: "Traffic and conversion tracking", connected: false, icon: "📊" },
            ].map((svc) => (
              <SettingRow key={svc.name} label={`${svc.icon}  ${svc.name}`} description={svc.description}>
                {svc.connected ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-[#00B259]">
                      <span className="size-1.5 rounded-full bg-[#00B259]" />
                      Connected
                    </span>
                    <button className="h-8 cursor-pointer rounded-lg border border-border bg-transparent px-3 text-xs font-medium text-page-text-muted transition-colors hover:bg-foreground/[0.04]">
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button className="h-8 cursor-pointer rounded-lg bg-foreground/[0.06] px-3 text-xs font-medium text-page-text transition-colors hover:bg-foreground/[0.10]">
                    Connect
                  </button>
                )}
              </SettingRow>
            ))}
          </SettingSection>
        )}
      </div>
    </div>
  );
}
