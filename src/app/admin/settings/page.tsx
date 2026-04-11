// @ts-nocheck
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";

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
  { name: "PIN Management" },
];

// ── PIN types ────────────────────────────────────────────────────────

interface PinEntry {
  id: string;
  code: string;
  description: string;
  status: "Active" | "Inactive";
  usageCount: number;
  lastUsed: string;
}

const INITIAL_PINS: PinEntry[] = [
  { id: "p1", code: "1356", description: "Default admin PIN — Change this immediately", status: "Active", usageCount: 7, lastUsed: "13/03/2026, 18:24:54" },
];

// ── Page ─────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [pins, setPins] = useState<PinEntry[]>(INITIAL_PINS);
  const [newPinOpen, setNewPinOpen] = useState(false);
  const [newPinCode, setNewPinCode] = useState("");
  const [newPinDesc, setNewPinDesc] = useState("");

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

        {/* PIN Management */}
        {selectedIndex === 4 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-inter text-base font-semibold tracking-[-0.02em] text-page-text">PIN Management</h2>
              <button
                onClick={() => setNewPinOpen(true)}
                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#3B82F6] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
              >
                Create New PIN
              </button>
            </div>

            {/* PIN Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card-bg">
              {/* Header */}
              <div className="flex items-center border-b border-border px-4" style={{ height: 40 }}>
                <div className="w-[90px] shrink-0 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">PIN Code</div>
                <div className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Description</div>
                <div className="w-[80px] shrink-0 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Status</div>
                <div className="hidden w-[100px] shrink-0 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted sm:block">Usage Count</div>
                <div className="hidden w-[160px] shrink-0 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted md:block">Last Used</div>
                <div className="w-[90px] shrink-0 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Actions</div>
              </div>
              {/* Rows */}
              {pins.map((pin) => (
                <div key={pin.id} className="flex items-center border-b border-border px-4 last:border-b-0 transition-colors hover:bg-foreground/[0.02]" style={{ height: 52 }}>
                  <div className="w-[90px] shrink-0 font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{pin.code}</div>
                  <div className="min-w-0 flex-1 truncate font-inter text-sm tracking-[-0.02em] text-page-text-muted">{pin.description}</div>
                  <div className="w-[80px] shrink-0">
                    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${pin.status === "Active" ? "bg-[rgba(0,178,89,0.15)] text-[#00B259]" : "bg-foreground/[0.06] text-page-text-muted"}`}>
                      {pin.status}
                    </span>
                  </div>
                  <div className="hidden w-[100px] shrink-0 font-inter text-sm tracking-[-0.02em] text-page-text-muted sm:block">{pin.usageCount}</div>
                  <div className="hidden w-[160px] shrink-0 font-inter text-xs tracking-[-0.02em] text-page-text-muted md:block">{pin.lastUsed}</div>
                  <div className="w-[90px] shrink-0 text-right">
                    {pin.status === "Active" ? (
                      <button
                        onClick={async () => {
                          const ok = await confirm({ title: "Deactivate PIN?", message: `Deactivate PIN ${pin.code}? It will no longer be usable.`, destructive: true, confirmLabel: "Deactivate" });
                          if (ok) { setPins((prev) => prev.map((p) => p.id === pin.id ? { ...p, status: "Inactive" } : p)); toast("PIN deactivated"); }
                        }}
                        className="cursor-pointer font-inter text-xs font-medium tracking-[-0.02em] text-[#FF2525] transition-opacity hover:opacity-70"
                        style={{ background: "none", border: "none" }}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => { setPins((prev) => prev.map((p) => p.id === pin.id ? { ...p, status: "Active" } : p)); toast("PIN activated"); }}
                        className="cursor-pointer font-inter text-xs font-medium tracking-[-0.02em] text-[#00B259] transition-opacity hover:opacity-70"
                        style={{ background: "none", border: "none" }}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {pins.length === 0 && (
                <div className="flex items-center justify-center py-12 text-sm text-page-text-muted">No PINs created</div>
              )}
            </div>

            {/* Create New PIN Modal */}
            {newPinOpen && (
              <Modal open={newPinOpen} onClose={() => setNewPinOpen(false)} size="sm">
                <ModalHeader>
                  <span className="font-inter text-base font-semibold tracking-[-0.02em] text-page-text">Create New PIN</span>
                </ModalHeader>
                <ModalBody className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-page-text-muted">PIN Code</label>
                    <input
                      value={newPinCode}
                      onChange={(e) => setNewPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 4-6 digit PIN"
                      className="h-10 w-full rounded-xl border border-border bg-foreground/[0.03] px-3.5 font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/30 focus:border-[#3B82F6]/40 focus:ring-1 focus:ring-[#3B82F6]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-page-text-muted">Description</label>
                    <input
                      value={newPinDesc}
                      onChange={(e) => setNewPinDesc(e.target.value)}
                      placeholder="What is this PIN for?"
                      className="h-10 w-full rounded-xl border border-border bg-foreground/[0.03] px-3.5 font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/30 focus:border-[#3B82F6]/40 focus:ring-1 focus:ring-[#3B82F6]/20"
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button onClick={() => setNewPinOpen(false)} className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newPinCode.length >= 4) {
                        setPins((prev) => [...prev, { id: `p${Date.now()}`, code: newPinCode, description: newPinDesc || "New PIN", status: "Active", usageCount: 0, lastUsed: "Never" }]);
                        setNewPinCode(""); setNewPinDesc(""); setNewPinOpen(false);
                        toast("PIN created");
                      }
                    }}
                    disabled={newPinCode.length < 4}
                    className="cursor-pointer rounded-full bg-[#3B82F6] px-4 py-2 font-inter text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    Create PIN
                  </button>
                </ModalFooter>
              </Modal>
            )}
          </>
        )}
      </div>
    </div>
  );
}
