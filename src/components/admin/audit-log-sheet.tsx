// @ts-nocheck
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/admin/ui/sheet";

// ── Types ────────────────────────────────────────────────────────────

interface AuditEntry {
  id: string;
  action: string;
  timestamp: string;
  relativeTime: string;
  user: string;
  avatar: string;
  severity: "info" | "warning" | "critical";
}

interface AuditLogSheetProps {
  open: boolean;
  onClose: () => void;
  entityType: "submission" | "campaign" | "payout" | "user";
  entityId: string;
  entityTitle: string;
}

// ── Mock audit data per entity type ──────────────────────────────────

const MOCK_AUDITS: Record<string, AuditEntry[]> = {
  submission: [
    { id: "a1", action: "Submission approved", timestamp: "Apr 10, 2026 11:42 AM", relativeTime: "2 hours ago", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/24?u=ivelin", severity: "info" },
    { id: "a2", action: "AI review completed — score 92", timestamp: "Apr 10, 2026 11:40 AM", relativeTime: "2 hours ago", user: "System", avatar: "https://i.pravatar.cc/24?u=system", severity: "info" },
    { id: "a3", action: "Submission received", timestamp: "Apr 10, 2026 11:38 AM", relativeTime: "2 hours ago", user: "System", avatar: "https://i.pravatar.cc/24?u=system", severity: "info" },
  ],
  campaign: [
    { id: "a1", action: "Status changed to Paused", timestamp: "Apr 10, 2026 10:15 AM", relativeTime: "4 hours ago", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/24?u=ivelin", severity: "warning" },
    { id: "a2", action: "Budget increased to $25,000", timestamp: "Apr 8, 2026 3:20 PM", relativeTime: "2 days ago", user: "David Chen", avatar: "https://i.pravatar.cc/24?u=david", severity: "info" },
    { id: "a3", action: "CPM rate updated: $6.00 → $8.50", timestamp: "Apr 5, 2026 9:00 AM", relativeTime: "5 days ago", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/24?u=ivelin", severity: "info" },
    { id: "a4", action: "Campaign created", timestamp: "Jan 15, 2026 2:30 PM", relativeTime: "3 months ago", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/24?u=ivelin", severity: "info" },
  ],
  payout: [
    { id: "a1", action: "Payout processed via Stripe", timestamp: "Apr 9, 2026 4:00 PM", relativeTime: "1 day ago", user: "System", avatar: "https://i.pravatar.cc/24?u=system", severity: "info" },
    { id: "a2", action: "Payout approved", timestamp: "Apr 9, 2026 2:15 PM", relativeTime: "1 day ago", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/24?u=ivelin", severity: "info" },
    { id: "a3", action: "Payout created", timestamp: "Apr 9, 2026 10:00 AM", relativeTime: "1 day ago", user: "System", avatar: "https://i.pravatar.cc/24?u=system", severity: "info" },
  ],
  user: [
    { id: "a1", action: "Trust score updated: 48%", timestamp: "Apr 10, 2026 11:00 AM", relativeTime: "3 hours ago", user: "System", avatar: "https://i.pravatar.cc/24?u=system", severity: "info" },
    { id: "a2", action: "Status changed to Blacklisted", timestamp: "Apr 9, 2026 5:30 PM", relativeTime: "1 day ago", user: "Ivelin Ivanov", avatar: "https://i.pravatar.cc/24?u=ivelin", severity: "critical" },
    { id: "a3", action: "3 submissions flagged for review", timestamp: "Apr 9, 2026 3:00 PM", relativeTime: "1 day ago", user: "System", avatar: "https://i.pravatar.cc/24?u=system", severity: "warning" },
    { id: "a4", action: "Account created via TikTok OAuth", timestamp: "Mar 15, 2026 10:00 AM", relativeTime: "26 days ago", user: "System", avatar: "https://i.pravatar.cc/24?u=system", severity: "info" },
  ],
};

const SEVERITY_COLORS = {
  info: "#60A5FA",
  warning: "#E9A23B",
  critical: "#FF2525",
};

const ENTITY_LABELS = {
  submission: "Submission",
  campaign: "Campaign",
  payout: "Payout",
  user: "User",
};

// ── Component ────────────────────────────────────────────────────────

export function AuditLogSheet({ open, onClose, entityType, entityId, entityTitle }: AuditLogSheetProps) {
  const entries = MOCK_AUDITS[entityType] ?? [];

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:w-3/4 sm:max-w-[420px]">
        <SheetHeader>
          <SheetTitle>{ENTITY_LABELS[entityType]} Audit Log</SheetTitle>
          <p className="truncate text-xs text-page-text-muted">{entityTitle}</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "none" }}>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />

            {entries.map((entry, i) => (
              <div key={entry.id} className="relative flex gap-3 pb-6 last:pb-0">
                {/* Dot */}
                <div className="relative z-10 mt-1 shrink-0">
                  <div className="size-[9px] rounded-full" style={{ background: SEVERITY_COLORS[entry.severity], boxShadow: `0 0 0 3px var(--bg)` }} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-page-text">{entry.action}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <img src={entry.avatar} alt="" className="size-4 rounded-full" />
                    <span className="text-xs text-page-text-muted">{entry.user}</span>
                    <span className="text-xs text-page-text-subtle">·</span>
                    <span className="text-xs text-page-text-subtle">{entry.relativeTime}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-page-text-subtle">{entry.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          {entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-sm text-page-text-muted">
              No audit entries
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
