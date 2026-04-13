// @ts-nocheck
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";
import { FilterIcon } from "@/components/submissions";

// ── Icons ────────────────────────────────────────────────────────────

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1.333L2.667 4v4c0 3.467 2.267 6.707 5.333 7.333 3.067-.626 5.333-3.866 5.333-7.333V4L8 1.333z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="5" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 14c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────

const TABS = [
  { name: "All", count: 156 },
  { name: "Auth", count: 42 },
  { name: "Users", count: 38 },
  { name: "Payments", count: 33 },
  { name: "Settings", count: 21 },
  { name: "System", count: 22 },
];

const AUDIT_FILTERS: Filter[] = [
  { key: "action", icon: null, label: "Action", singleSelect: true, options: [{ value: "create", label: "Create" }, { value: "update", label: "Update" }, { value: "delete", label: "Delete" }, { value: "login", label: "Login" }] },
  { key: "user", icon: null, label: "User", singleSelect: true, options: [{ value: "ivelin", label: "Ivelin Ivanov" }, { value: "system", label: "System" }, { value: "david", label: "David Chen" }] },
  { key: "severity", icon: null, label: "Severity", singleSelect: true, options: [{ value: "info", label: "Info" }, { value: "warning", label: "Warning" }, { value: "critical", label: "Critical" }] },
];

// ── Mock data ────────────────────────────────────────────────────────

type AuditEntry = {
  id: string;
  action: string;
  description: string;
  user: string;
  avatar: string;
  timestamp: string;
  relativeTime: string;
  category: "auth" | "users" | "payments" | "settings" | "system";
  severity: "info" | "warning" | "critical";
  ip?: string;
  details?: string;
};

const AUDIT_LOG: AuditEntry[] = [
  { id: "a1", action: "Login", description: "Successful login from new device", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/36?u=ivelin", timestamp: "2026-04-10 11:42:15", relativeTime: "2 minutes ago", category: "auth", severity: "info", ip: "192.168.1.105", details: "Chrome 124.0 on macOS" },
  { id: "a2", action: "User banned", description: "Banned user for TOS violation", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/36?u=ivelin", timestamp: "2026-04-10 11:38:00", relativeTime: "6 minutes ago", category: "users", severity: "critical", details: "User: @spambot923 — Reason: automated spam submissions" },
  { id: "a3", action: "Payout processed", description: "Batch payout of $4,230.00 via Stripe", user: "System", avatar: "https://i.pravatar.cc/36?u=system", timestamp: "2026-04-10 11:30:00", relativeTime: "14 minutes ago", category: "payments", severity: "info", details: "12 creators, avg $352.50" },
  { id: "a4", action: "Campaign updated", description: "Updated payout rules for Caffeine AI campaign", user: "David Chen", avatar: "https://i.pravatar.cc/36?u=david", timestamp: "2026-04-10 11:15:00", relativeTime: "29 minutes ago", category: "settings", severity: "warning", details: "Min payout changed: $200 → $150" },
  { id: "a5", action: "API key rotated", description: "Stripe API key was rotated", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/36?u=ivelin", timestamp: "2026-04-10 10:55:00", relativeTime: "49 minutes ago", category: "system", severity: "warning", ip: "192.168.1.105" },
  { id: "a6", action: "Failed login", description: "3 failed login attempts", user: "Unknown", avatar: "https://i.pravatar.cc/36?u=unknown", timestamp: "2026-04-10 10:40:00", relativeTime: "1 hour ago", category: "auth", severity: "critical", ip: "203.45.67.89", details: "IP geo: Lagos, Nigeria — Rate limited" },
  { id: "a7", action: "User created", description: "New creator account registered", user: "System", avatar: "https://i.pravatar.cc/36?u=system", timestamp: "2026-04-10 10:22:00", relativeTime: "1 hour ago", category: "users", severity: "info", details: "User: @nightowledits — via TikTok OAuth" },
  { id: "a8", action: "Refund issued", description: "Refund of $275.00 for campaign #412", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/36?u=ivelin", timestamp: "2026-04-10 09:50:00", relativeTime: "2 hours ago", category: "payments", severity: "warning", details: "Creator: Cryptoclipz — Reason: duplicate submission" },
  { id: "a9", action: "Webhook failed", description: "Stripe webhook delivery failed 3x", user: "System", avatar: "https://i.pravatar.cc/36?u=system", timestamp: "2026-04-10 09:30:00", relativeTime: "2 hours ago", category: "system", severity: "critical", details: "Endpoint: /api/webhooks/stripe — HTTP 503" },
  { id: "a10", action: "Permissions changed", description: "David Chen granted admin access", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/36?u=ivelin", timestamp: "2026-04-10 09:10:00", relativeTime: "2 hours ago", category: "settings", severity: "warning", details: "Role: Editor → Admin" },
  { id: "a11", action: "Campaign created", description: "New campaign: FitTrack Pro Launch", user: "David Chen", avatar: "https://i.pravatar.cc/36?u=david", timestamp: "2026-04-10 08:45:00", relativeTime: "3 hours ago", category: "settings", severity: "info", details: "Budget: $15,000 — Duration: 30 days" },
  { id: "a12", action: "Login", description: "Successful login", user: "David Chen", avatar: "https://i.pravatar.cc/36?u=david", timestamp: "2026-04-10 08:30:00", relativeTime: "3 hours ago", category: "auth", severity: "info", ip: "10.0.0.42" },
];

// ── Severity badge ───────────────────────────────────────────────────

function SeverityDot({ severity }: { severity: AuditEntry["severity"] }) {
  const colors = { info: "#60A5FA", warning: "#E9A23B", critical: "#FF2525" };
  return <span className="size-2 shrink-0 rounded-full" style={{ background: colors[severity] }} />;
}

function CategoryIcon({ category }: { category: AuditEntry["category"] }) {
  const cls = "size-4 text-page-text-subtle";
  switch (category) {
    case "auth": return <ShieldIcon className={cls} />;
    case "users": return <UserIcon className={cls} />;
    case "payments": return <CreditCardIcon className={cls} />;
    case "settings": return <GearIcon className={cls} />;
    case "system": return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={cls}>
        <rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 14h6M8 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
    default: return null;
  }
}

// ── Page ─────────────────────────────────────────────────────────────

export default function AuditHistoryPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const tabCategories = [null, "auth", "users", "payments", "settings", "system"];
  const filtered = (selectedIndex === 0
    ? AUDIT_LOG
    : AUDIT_LOG.filter((e) => e.category === tabCategories[selectedIndex])
  ).filter((e) => !searchQuery || e.action.toLowerCase().includes(searchQuery.toLowerCase()) || e.description.toLowerCase().includes(searchQuery.toLowerCase()) || e.user.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedEntries = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      {/* Top nav */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
          Audit History
        </span>
        <button className="flex h-9 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-4 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M8 2.667V10M8 2.667L5.333 5.333M8 2.667L10.667 5.333M2.667 10.667V12C2.667 12.736 3.264 13.333 4 13.333H12C12.736 13.333 13.333 12.736 13.333 12V10.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Export
        </button>
      </div>

      {/* Tabs — mobile: own row, desktop: inline with search */}
      <div className="overflow-x-auto scrollbar-hide px-4 pt-3 sm:px-6 md:hidden" style={{ scrollbarWidth: "none" }}>
        <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex} className="w-max">
          {TABS.map((tab, i) => (
            <TabItem key={tab.name} label={tab.name} count={tab.count} index={i} />
          ))}
        </Tabs>
      </div>
      <div className="hidden px-4 pt-[21px] sm:px-6 md:flex md:items-center md:justify-between md:gap-2">
        <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex} className="w-fit">
          {TABS.map((tab, i) => (
            <TabItem key={tab.name} label={tab.name} count={tab.count} index={i} />
          ))}
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 dark:bg-[rgba(224,224,224,0.03)] md:w-[300px] md:flex-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50">
              <path d="M11.333 11.333L14 14M2 7.333A5.333 5.333 0 1012.667 7.333 5.333 5.333 0 002 7.333z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }} placeholder="Search audit log..." className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/70" />
          </div>
          <FilterSelect filters={AUDIT_FILTERS} activeFilters={[]} onSelect={() => {}} onRemove={() => {}} searchPlaceholder="Filter...">
            <button className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
              <FilterIcon />
            </button>
          </FilterSelect>
        </div>
      </div>

      {/* Audit log entries */}
      <div className="px-4 pb-6 sm:px-6">
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card-bg">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <span className="text-sm text-page-text-muted">No audit entries match your search</span>
              <button onClick={() => { setSearchQuery(""); setSelectedIndex(0); }} className="text-sm font-medium text-[#f6850f] cursor-pointer bg-transparent border-none">Clear filters</button>
            </div>
          )}
          {pagedEntries.map((entry, i) => {
            const isExpanded = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className={cn(
                  "border-b border-border last:border-b-0 transition-colors",
                  isExpanded ? "bg-foreground/[0.02]" : "hover:bg-foreground/[0.02]"
                )}
              >
                {/* Main row */}
                <div
                  className="flex cursor-pointer items-start gap-3 px-4 py-3 md:items-center md:px-5"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  <div className="mt-0.5 md:mt-0">
                    <CategoryIcon category={entry.category} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-page-text">{entry.action}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-page-text-muted">{entry.description}</p>
                  </div>
                  <div className="hidden items-center gap-3 md:flex">
                    <div className="flex items-center gap-1.5">
                      <img src={entry.avatar} alt="" className="size-5 rounded-full" />
                      <span className="text-xs text-page-text-muted">{entry.user}</span>
                    </div>
                    {entry.ip && <span className="rounded-full bg-foreground/[0.04] px-2 py-0.5 text-[10px] font-mono text-page-text-subtle">{entry.ip}</span>}
                  </div>
                  <span className="shrink-0 text-xs text-page-text-subtle">{entry.relativeTime}</span>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={cn("shrink-0 text-page-text-subtle transition-transform", isExpanded && "rotate-180")}
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border px-4 py-3 md:px-5 md:pl-12">
                    <div className="space-y-2 text-xs text-page-text-muted">
                      <div className="flex items-center gap-2 md:hidden">
                        <img src={entry.avatar} alt="" className="size-5 rounded-full" />
                        <span>{entry.user}</span>
                        {entry.ip && <span className="rounded-full bg-foreground/[0.04] px-2 py-0.5 font-mono text-page-text-subtle">{entry.ip}</span>}
                      </div>
                      <div><span className="text-page-text-subtle">Timestamp:</span> <span className="font-mono text-page-text">{entry.timestamp}</span></div>
                      <div><span className="text-page-text-subtle">Category:</span> <span className="capitalize text-page-text">{entry.category}</span></div>
                      <div><span className="text-page-text-subtle">Severity:</span> <span className={cn("capitalize font-medium", entry.severity === "critical" ? "text-[#FF2525]" : entry.severity === "warning" ? "text-[#E9A23B]" : "text-[#60A5FA]")}>{entry.severity}</span></div>
                      {entry.details && <div><span className="text-page-text-subtle">Details:</span> <span className="text-page-text">{entry.details}</span></div>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-page-text-muted">
              Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button disabled={page === 0} onClick={() => setPage(0)} className="flex size-7 items-center justify-center rounded-md border border-border text-page-text-muted disabled:opacity-30 cursor-pointer disabled:cursor-default">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 9L4 6l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 9L1 6l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className="flex size-7 items-center justify-center rounded-md border border-border text-page-text-muted disabled:opacity-30 cursor-pointer disabled:cursor-default">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 9L4 6l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} className="flex size-7 items-center justify-center rounded-md border border-border text-page-text-muted disabled:opacity-30 cursor-pointer disabled:cursor-default">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)} className="flex size-7 items-center justify-center rounded-md border border-border text-page-text-muted disabled:opacity-30 cursor-pointer disabled:cursor-default">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
