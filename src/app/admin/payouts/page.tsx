// @ts-nocheck
"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { AuditLogSheet } from "@/components/admin/audit-log-sheet";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { motion, AnimatePresence } from "motion/react";
import { springs } from "@/lib/springs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// ── Types ───────────────────────────────────────────────────────────

type PayoutStatus = "pending" | "processing" | "completed" | "failed" | "on_hold";
type PayoutMethod = "stripe" | "paypal" | "crypto";

interface Payout {
  id: string;
  creator: {
    name: string;
    avatar: string;
    handle: string;
    platform: string;
  };
  campaign: string;
  amount: number;
  fees: number;
  method: PayoutMethod;
  status: PayoutStatus;
  requestedDate: string;
  completedDate?: string;
  transactionId?: string;
  timeline: { date: string; event: string; note?: string }[];
}

// ── Mock Data ───────────────────────────────────────────────────────

const MOCK_PAYOUTS: Payout[] = [
  {
    id: "pay-001",
    creator: { name: "Alex Rivera", avatar: "https://i.pravatar.cc/40?u=alex", handle: "@alexrivera", platform: "TikTok" },
    campaign: "Harry Styles Podcast Clipping",
    amount: 2450.0,
    fees: 73.5,
    method: "stripe",
    status: "pending",
    requestedDate: "Apr 10, 2026",
    timeline: [
      { date: "Apr 10, 2026 14:32", event: "Payout requested", note: "Creator submitted payout request" },
      { date: "Apr 10, 2026 14:32", event: "Auto-verified", note: "Passed fraud check" },
    ],
  },
  {
    id: "pay-002",
    creator: { name: "Jordan Chen", avatar: "https://i.pravatar.cc/40?u=jordan", handle: "@jordanchen", platform: "Instagram" },
    campaign: "Call of Duty BO7 Clipping",
    amount: 8000.0,
    fees: 240.0,
    method: "paypal",
    status: "processing",
    requestedDate: "Apr 9, 2026",
    timeline: [
      { date: "Apr 9, 2026 09:15", event: "Payout requested" },
      { date: "Apr 9, 2026 10:00", event: "Admin approved", note: "Approved by Sarah K." },
      { date: "Apr 9, 2026 10:05", event: "Processing started", note: "PayPal batch initiated" },
    ],
  },
  {
    id: "pay-003",
    creator: { name: "Mia Santos", avatar: "https://i.pravatar.cc/40?u=mia", handle: "@miasantos", platform: "TikTok" },
    campaign: "GYMSHARK Clipping",
    amount: 1250.0,
    fees: 37.5,
    method: "stripe",
    status: "completed",
    requestedDate: "Apr 7, 2026",
    completedDate: "Apr 8, 2026",
    transactionId: "txn_3PqR7sK2x",
    timeline: [
      { date: "Apr 7, 2026 11:22", event: "Payout requested" },
      { date: "Apr 7, 2026 12:00", event: "Admin approved" },
      { date: "Apr 7, 2026 12:05", event: "Processing started" },
      { date: "Apr 8, 2026 03:14", event: "Payment completed", note: "Stripe transfer confirmed" },
    ],
  },
  {
    id: "pay-004",
    creator: { name: "Tyler Brooks", avatar: "https://i.pravatar.cc/40?u=tyler", handle: "@tylerbrooks", platform: "TikTok" },
    campaign: "Polymarket Clipping Campaign",
    amount: 475.0,
    fees: 14.25,
    method: "crypto",
    status: "failed",
    requestedDate: "Apr 6, 2026",
    timeline: [
      { date: "Apr 6, 2026 16:40", event: "Payout requested" },
      { date: "Apr 6, 2026 17:00", event: "Admin approved" },
      { date: "Apr 6, 2026 17:05", event: "Processing started", note: "USDC transfer initiated" },
      { date: "Apr 6, 2026 17:12", event: "Payment failed", note: "Insufficient gas fees — wallet balance too low" },
    ],
  },
  {
    id: "pay-005",
    creator: { name: "Emma Wilson", avatar: "https://i.pravatar.cc/40?u=emma", handle: "@emmawilson", platform: "Instagram" },
    campaign: "NovaPay Wallet Clipping",
    amount: 3200.0,
    fees: 96.0,
    method: "stripe",
    status: "pending",
    requestedDate: "Apr 11, 2026",
    timeline: [
      { date: "Apr 11, 2026 08:55", event: "Payout requested" },
    ],
  },
  {
    id: "pay-006",
    creator: { name: "Liam Nguyen", avatar: "https://i.pravatar.cc/40?u=liam", handle: "@liamnguyen", platform: "TikTok" },
    campaign: "Kane Brown Clipping",
    amount: 5600.0,
    fees: 168.0,
    method: "paypal",
    status: "on_hold",
    requestedDate: "Apr 5, 2026",
    timeline: [
      { date: "Apr 5, 2026 13:10", event: "Payout requested" },
      { date: "Apr 5, 2026 14:00", event: "Placed on hold", note: "Pending identity verification" },
    ],
  },
  {
    id: "pay-007",
    creator: { name: "Sophia Kim", avatar: "https://i.pravatar.cc/40?u=sophia", handle: "@sophiakim", platform: "TikTok" },
    campaign: "Diary of a CEO Clipping",
    amount: 950.0,
    fees: 28.5,
    method: "stripe",
    status: "completed",
    requestedDate: "Apr 4, 2026",
    completedDate: "Apr 5, 2026",
    transactionId: "txn_8MnQ4vL9w",
    timeline: [
      { date: "Apr 4, 2026 10:00", event: "Payout requested" },
      { date: "Apr 4, 2026 11:30", event: "Admin approved" },
      { date: "Apr 4, 2026 11:35", event: "Processing started" },
      { date: "Apr 5, 2026 02:20", event: "Payment completed" },
    ],
  },
  {
    id: "pay-008",
    creator: { name: "Marcus Johnson", avatar: "https://i.pravatar.cc/40?u=marcus", handle: "@marcusjohnson", platform: "Instagram" },
    campaign: "GYMSHARK Clipping",
    amount: 150.0,
    fees: 4.5,
    method: "crypto",
    status: "pending",
    requestedDate: "Apr 12, 2026",
    timeline: [
      { date: "Apr 12, 2026 19:45", event: "Payout requested" },
    ],
  },
  {
    id: "pay-009",
    creator: { name: "Ava Thompson", avatar: "https://i.pravatar.cc/40?u=ava", handle: "@avathompson", platform: "TikTok" },
    campaign: "Call of Duty BO7 Clipping",
    amount: 4100.0,
    fees: 123.0,
    method: "stripe",
    status: "processing",
    requestedDate: "Apr 8, 2026",
    timeline: [
      { date: "Apr 8, 2026 07:30", event: "Payout requested" },
      { date: "Apr 8, 2026 09:00", event: "Admin approved" },
      { date: "Apr 8, 2026 09:10", event: "Processing started" },
    ],
  },
  {
    id: "pay-010",
    creator: { name: "Noah Park", avatar: "https://i.pravatar.cc/40?u=noah", handle: "@noahpark", platform: "TikTok" },
    campaign: "Harry Styles Podcast Clipping",
    amount: 720.0,
    fees: 21.6,
    method: "paypal",
    status: "completed",
    requestedDate: "Apr 3, 2026",
    completedDate: "Apr 4, 2026",
    transactionId: "txn_6WkP2rN8y",
    timeline: [
      { date: "Apr 3, 2026 15:22", event: "Payout requested" },
      { date: "Apr 3, 2026 16:00", event: "Admin approved" },
      { date: "Apr 3, 2026 16:10", event: "Processing started" },
      { date: "Apr 4, 2026 04:50", event: "Payment completed" },
    ],
  },
  {
    id: "pay-011",
    creator: { name: "Isabella Martinez", avatar: "https://i.pravatar.cc/40?u=isabella", handle: "@isabellamartinez", platform: "Instagram" },
    campaign: "Polymarket Clipping Campaign",
    amount: 50.0,
    fees: 1.5,
    method: "stripe",
    status: "on_hold",
    requestedDate: "Apr 11, 2026",
    timeline: [
      { date: "Apr 11, 2026 22:10", event: "Payout requested" },
      { date: "Apr 12, 2026 08:00", event: "Placed on hold", note: "Amount below minimum threshold — awaiting review" },
    ],
  },
  {
    id: "pay-012",
    creator: { name: "Ethan Williams", avatar: "https://i.pravatar.cc/40?u=ethan", handle: "@ethanwilliams", platform: "TikTok" },
    campaign: "NovaPay Wallet Clipping",
    amount: 1800.0,
    fees: 54.0,
    method: "crypto",
    status: "failed",
    requestedDate: "Apr 2, 2026",
    timeline: [
      { date: "Apr 2, 2026 12:00", event: "Payout requested" },
      { date: "Apr 2, 2026 13:00", event: "Admin approved" },
      { date: "Apr 2, 2026 13:10", event: "Processing started" },
      { date: "Apr 2, 2026 13:18", event: "Payment failed", note: "Invalid wallet address" },
    ],
  },
];

// ── Status helpers ──────────────────────────────────────────────────

const STATUS_CONFIG: Record<PayoutStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "Pending", bg: "rgba(255,128,3,0.08)", text: "#FF8003", dot: "#FF8003" },
  processing: { label: "Processing", bg: "rgba(96,165,250,0.08)", text: "#60A5FA", dot: "#60A5FA" },
  completed: { label: "Completed", bg: "rgba(0,178,89,0.08)", text: "#00B259", dot: "#00B259" },
  failed: { label: "Failed", bg: "rgba(255,37,37,0.08)", text: "#FF2525", dot: "#FF2525" },
  on_hold: { label: "On Hold", bg: "rgba(255,255,255,0.06)", text: "var(--page-text-muted)", dot: "#9CA3AF" },
};

const METHOD_CONFIG: Record<PayoutMethod, { label: string; bg: string; text: string }> = {
  stripe: { label: "Stripe", bg: "rgba(99,91,255,0.08)", text: "#635BFF" },
  paypal: { label: "PayPal", bg: "rgba(0,157,224,0.08)", text: "#009DE0" },
  crypto: { label: "Crypto", bg: "rgba(247,147,26,0.08)", text: "#F7931A" },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

// ── Tabs ─────────────────────────────────────────────────────────────

const TABS = ["All", "Pending", "Processing", "Completed", "Failed", "On Hold"];

const TAB_STATUS_MAP: Record<string, PayoutStatus | null> = {
  All: null,
  Pending: "pending",
  Processing: "processing",
  Completed: "completed",
  Failed: "failed",
  "On Hold": "on_hold",
};

// ── Page ─────────────────────────────────────────────────────────────

export default function AdminPayoutsPage() {
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const [payouts, setPayouts] = useState<Payout[]>(MOCK_PAYOUTS);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailPayout, setDetailPayout] = useState<Payout | null>(null);
  const [auditSheet, setAuditSheet] = useState<{ open: boolean; id: string; title: string }>({ open: false, id: "", title: "" });

  // Proximity hover
  const tableRef = useRef<HTMLDivElement>(null);
  const { activeIndex, handlers, registerItem, itemRects } = useProximityHover(tableRef);

  // Derived
  const statusFilter = TAB_STATUS_MAP[TABS[selectedTab]];
  const filteredPayouts = statusFilter ? payouts.filter((p) => p.status === statusFilter) : payouts;

  const stats = {
    pending: { amount: payouts.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0), count: payouts.filter((p) => p.status === "pending").length },
    processing: { amount: payouts.filter((p) => p.status === "processing").reduce((s, p) => s + p.amount, 0), count: payouts.filter((p) => p.status === "processing").length },
    completed: { amount: payouts.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0), count: payouts.filter((p) => p.status === "completed").length },
    failed: { amount: payouts.filter((p) => p.status === "failed").reduce((s, p) => s + p.amount, 0), count: payouts.filter((p) => p.status === "failed").length },
  };

  // ── Handlers ────────────────────────────────────────────────────────

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredPayouts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPayouts.map((p) => p.id)));
    }
  }, [selectedIds.size, filteredPayouts]);

  const updatePayoutStatus = useCallback((id: string, status: PayoutStatus) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              timeline: [
                ...p.timeline,
                {
                  date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
                  event: status === "completed" ? "Payment completed" : status === "on_hold" ? "Placed on hold" : status === "failed" ? "Payment rejected" : status === "processing" ? "Processing started" : "Status updated",
                  note: "Updated by admin",
                },
              ],
            }
          : p
      )
    );
    if (detailPayout?.id === id) {
      setDetailPayout((prev) => prev ? { ...prev, status } : null);
    }
  }, [detailPayout]);

  const handleBulkAction = useCallback(async (action: "approve" | "hold" | "reject") => {
    if (action === "reject") {
      const ok = await confirm({
        title: "Reject selected payouts?",
        message: `This will reject ${selectedIds.size} payout(s). This action cannot be undone.`,
        confirmLabel: "Reject",
        destructive: true,
      });
      if (!ok) return;
    }

    const statusMap: Record<string, PayoutStatus> = { approve: "processing", hold: "on_hold", reject: "failed" };
    const newStatus = statusMap[action];
    selectedIds.forEach((id) => updatePayoutStatus(id, newStatus));
    toast(`${selectedIds.size} payout(s) ${action === "approve" ? "approved" : action === "hold" ? "put on hold" : "rejected"}`);
    setSelectedIds(new Set());
  }, [selectedIds, confirm, updatePayoutStatus, toast]);

  const handleProcessAll = useCallback(async () => {
    const pendingCount = payouts.filter((p) => p.status === "pending").length;
    if (pendingCount === 0) {
      toast("No pending payouts to process");
      return;
    }
    const ok = await confirm({
      title: "Process all pending payouts?",
      message: `This will begin processing ${pendingCount} pending payout(s) totaling ${formatCurrency(stats.pending.amount)}.`,
      confirmLabel: "Process All",
      destructive: false,
    });
    if (ok) {
      setPayouts((prev) =>
        prev.map((p) =>
          p.status === "pending"
            ? {
                ...p,
                status: "processing" as PayoutStatus,
                timeline: [
                  ...p.timeline,
                  { date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }), event: "Processing started", note: "Bulk process by admin" },
                ],
              }
            : p
        )
      );
      toast(`${pendingCount} payouts are now processing`);
    }
  }, [payouts, stats.pending.amount, confirm, toast]);

  const handleExport = useCallback(() => {
    toast("CSV export started — download will begin shortly");
  }, [toast]);

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Payouts
          </span>
          <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
            {formatCurrency(stats.pending.amount)} pending
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={handleProcessAll}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#FF8003] px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
          >
            Process All Pending
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-6 pt-4 sm:px-6">
        {/* ── Stats Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Pending", amount: stats.pending.amount, count: stats.pending.count, color: "#FF8003" },
            { label: "Processing", amount: stats.processing.amount, count: stats.processing.count, color: "#60A5FA" },
            { label: "Completed this month", amount: stats.completed.amount, count: stats.completed.count, color: "#00B259" },
            { label: "Failed", amount: stats.failed.amount, count: stats.failed.count, color: "#FF2525" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
            >
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ background: stat.color }} />
                <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                  {stat.label}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-inter)] text-xl font-semibold tabular-nums tracking-[-0.02em] text-page-text">
                  {formatCurrency(stat.amount)}
                </span>
                <span className="font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted">
                  {stat.count} payout{stat.count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab Filters ────────────────────────────────────────── */}
        <div className="overflow-x-auto scrollbar-hide md:hidden" style={{ scrollbarWidth: "none" }}>
          <Tabs selectedIndex={selectedTab} onSelect={setSelectedTab} className="w-max">
            {TABS.map((tab, i) => (
              <TabItem key={tab} label={tab} index={i} />
            ))}
          </Tabs>
        </div>
        <div className="hidden md:flex">
          <Tabs selectedIndex={selectedTab} onSelect={setSelectedTab} className="w-fit">
            {TABS.map((tab, i) => (
              <TabItem key={tab} label={tab} index={i} />
            ))}
          </Tabs>
        </div>

        {/* ── Bulk Action Bar ────────────────────────────────────── */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={springs.fast}
              className="flex items-center gap-3 rounded-xl border border-foreground/[0.06] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
            >
              <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                {selectedIds.size} selected
              </span>
              <div className="h-4 w-px bg-foreground/[0.06]" />
              <button
                onClick={() => handleBulkAction("approve")}
                className="flex h-8 cursor-pointer items-center rounded-full bg-[rgba(0,178,89,0.08)] px-3 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-[#00B259] transition-colors hover:bg-[rgba(0,178,89,0.15)]"
              >
                Approve
              </button>
              <button
                onClick={() => handleBulkAction("hold")}
                className="flex h-8 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-3 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-foreground/[0.10]"
              >
                Hold
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                className="flex h-8 cursor-pointer items-center rounded-full bg-[rgba(255,37,37,0.08)] px-3 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[rgba(255,37,37,0.15)]"
              >
                Reject
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Payout Table ───────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
          {/* Table header */}
          <div className="flex items-center border-b border-foreground/[0.06] px-4" style={{ height: 40 }}>
            <div className="w-[36px] shrink-0">
              <input
                type="checkbox"
                checked={selectedIds.size === filteredPayouts.length && filteredPayouts.length > 0}
                onChange={toggleSelectAll}
                className="size-3.5 cursor-pointer rounded border-foreground/20 accent-[#FF8003]"
              />
            </div>
            <div className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Creator</div>
            <div className="hidden w-[180px] shrink-0 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted lg:block">Campaign</div>
            <div className="w-[100px] shrink-0 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Amount</div>
            <div className="hidden w-[90px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted sm:block">Method</div>
            <div className="hidden w-[110px] shrink-0 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted md:block">Requested</div>
            <div className="w-[100px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Status</div>
            <div className="w-[44px] shrink-0" />
          </div>

          {/* Table body with proximity hover */}
          <div ref={tableRef} {...handlers}>
            {filteredPayouts.length === 0 && (
              <div className="flex items-center justify-center py-16 text-sm text-page-text-muted">
                No payouts found
              </div>
            )}
            {filteredPayouts.map((payout, index) => {
              const statusCfg = STATUS_CONFIG[payout.status];
              const methodCfg = METHOD_CONFIG[payout.method];
              const isSelected = selectedIds.has(payout.id);

              return (
                <div
                  key={payout.id}
                  ref={(el) => registerItem(index, el)}
                  onClick={() => setDetailPayout(payout)}
                  className="relative flex cursor-pointer items-center border-b border-foreground/[0.06] px-4 last:border-b-0"
                  style={{ height: 56 }}
                >
                  {/* Proximity hover indicator */}
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        layoutId="payout-hover"
                        className="pointer-events-none absolute inset-x-0 inset-y-0 bg-foreground/[0.03]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={springs.fast}
                      />
                    )}
                  </AnimatePresence>

                  {/* Checkbox */}
                  <div className="relative z-[1] w-[36px] shrink-0" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(payout.id)}
                      className="size-3.5 cursor-pointer rounded border-foreground/20 accent-[#FF8003]"
                    />
                  </div>

                  {/* Creator */}
                  <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-3">
                    <img src={payout.creator.avatar} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="truncate font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                        {payout.creator.name}
                      </div>
                      <div className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                        {payout.creator.handle}
                      </div>
                    </div>
                  </div>

                  {/* Campaign */}
                  <div className="relative z-[1] hidden w-[180px] shrink-0 lg:block">
                    <span className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                      {payout.campaign}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="relative z-[1] w-[100px] shrink-0 text-right font-[family-name:var(--font-inter)] text-sm font-medium tabular-nums tracking-[-0.02em] text-page-text">
                    {formatCurrency(payout.amount)}
                  </div>

                  {/* Method pill */}
                  <div className="relative z-[1] hidden w-[90px] shrink-0 justify-center sm:flex">
                    <span
                      className="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                      style={{ background: methodCfg.bg, color: methodCfg.text }}
                    >
                      {methodCfg.label}
                    </span>
                  </div>

                  {/* Requested date */}
                  <div className="relative z-[1] hidden w-[110px] shrink-0 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted md:block">
                    {payout.requestedDate}
                  </div>

                  {/* Status pill */}
                  <div className="relative z-[1] flex w-[100px] shrink-0 justify-center">
                    <span
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                      style={{ background: statusCfg.bg, color: statusCfg.text }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Kebab menu */}
                  <div className="relative z-[1] w-[44px] shrink-0 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-page-text-muted transition-colors hover:bg-foreground/[0.06]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[160px]">
                        <DropdownMenuItem onClick={() => setDetailPayout(payout)}>
                          View details
                        </DropdownMenuItem>
                        {payout.status === "pending" && (
                          <DropdownMenuItem onClick={() => { updatePayoutStatus(payout.id, "processing"); toast("Payout approved"); }}>
                            Approve
                          </DropdownMenuItem>
                        )}
                        {(payout.status === "pending" || payout.status === "processing") && (
                          <DropdownMenuItem onClick={() => { updatePayoutStatus(payout.id, "on_hold"); toast("Payout placed on hold"); }}>
                            Put on hold
                          </DropdownMenuItem>
                        )}
                        {payout.status !== "completed" && payout.status !== "failed" && (
                          <DropdownMenuItem
                            onClick={async () => {
                              const ok = await confirm({ title: "Reject payout?", message: `Reject ${formatCurrency(payout.amount)} payout to ${payout.creator.name}? This cannot be undone.`, confirmLabel: "Reject", destructive: true });
                              if (ok) { updatePayoutStatus(payout.id, "failed"); toast("Payout rejected"); }
                            }}
                            className="text-[#FF2525] focus:text-[#FF2525]"
                          >
                            Reject
                          </DropdownMenuItem>
                        )}
                        {payout.status === "failed" && (
                          <DropdownMenuItem onClick={() => { updatePayoutStatus(payout.id, "pending"); toast("Payout retried — moved to pending"); }}>
                            Retry
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setAuditSheet({ open: true, id: payout.id, title: `Payout to ${payout.creator.name}` })}>
                          View audit log
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Detail Modal ───────────────────────────────────────────── */}
      <Modal open={!!detailPayout} onClose={() => setDetailPayout(null)} size="md">
        {detailPayout && (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <img src={detailPayout.creator.avatar} alt="" className="size-10 rounded-full object-cover" />
                <div>
                  <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold tracking-[-0.02em] text-page-text">
                    {detailPayout.creator.name}
                  </h2>
                  <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                    {detailPayout.creator.handle} on {detailPayout.creator.platform}
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="space-y-5">
              {/* Amount breakdown */}
              <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Gross amount</span>
                  <span className="font-[family-name:var(--font-inter)] text-sm tabular-nums tracking-[-0.02em] text-page-text">{formatCurrency(detailPayout.amount)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Platform fees (3%)</span>
                  <span className="font-[family-name:var(--font-inter)] text-sm tabular-nums tracking-[-0.02em] text-[#FF2525]">-{formatCurrency(detailPayout.fees)}</span>
                </div>
                <div className="mt-3 border-t border-foreground/[0.06] pt-3 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-semibold tracking-[-0.02em] text-page-text">Net payout</span>
                    <span className="font-[family-name:var(--font-inter)] text-base font-semibold tabular-nums tracking-[-0.02em] text-page-text">{formatCurrency(detailPayout.amount - detailPayout.fees)}</span>
                  </div>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Campaign</span>
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text">{detailPayout.campaign}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Method</span>
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                    style={{ background: METHOD_CONFIG[detailPayout.method].bg, color: METHOD_CONFIG[detailPayout.method].text }}
                  >
                    {METHOD_CONFIG[detailPayout.method].label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Status</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em] transition-opacity hover:opacity-80" style={{ background: STATUS_CONFIG[detailPayout.status].bg, color: STATUS_CONFIG[detailPayout.status].text }}>
                        <span className="size-1.5 rounded-full" style={{ background: STATUS_CONFIG[detailPayout.status].dot }} />
                        {STATUS_CONFIG[detailPayout.status].label}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[140px]">
                      {(["pending", "processing", "completed", "on_hold", "failed"] as PayoutStatus[]).map((s) => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() => {
                            updatePayoutStatus(detailPayout.id, s);
                            setDetailPayout((prev) => prev ? { ...prev, status: s } : null);
                            toast(`Status changed to ${STATUS_CONFIG[s].label}`);
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full" style={{ background: STATUS_CONFIG[s].dot }} />
                            {STATUS_CONFIG[s].label}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Requested</span>
                  <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text">{detailPayout.requestedDate}</span>
                </div>
                {detailPayout.transactionId && (
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Transaction ID</span>
                    <span className="font-[family-name:var(--font-inter)] text-xs font-mono tracking-[-0.02em] text-page-text-muted">{detailPayout.transactionId}</span>
                  </div>
                )}
              </div>

              {/* Transaction timeline */}
              <div>
                <h4 className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                  Transaction History
                </h4>
                <div className="space-y-0">
                  {detailPayout.timeline.map((entry, i) => (
                    <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                      {/* Timeline line */}
                      {i < detailPayout.timeline.length - 1 && (
                        <div className="absolute left-[5px] top-[14px] h-[calc(100%-6px)] w-px bg-foreground/[0.06] dark:bg-white/[0.06]" />
                      )}
                      {/* Dot */}
                      <div className="relative z-[1] mt-[5px] size-[11px] shrink-0 rounded-full border-2 border-foreground/[0.12] bg-white dark:border-white/[0.12] dark:bg-card-bg" />
                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text">
                          {entry.event}
                        </div>
                        {entry.note && (
                          <div className="mt-0.5 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                            {entry.note}
                          </div>
                        )}
                        <div className="mt-0.5 font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-subtle">
                          {entry.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <button
                onClick={() => setAuditSheet({ open: true, id: detailPayout.id, title: `Payout to ${detailPayout.creator.name}` })}
                className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
              >
                View Audit Log
              </button>
              <div className="flex items-center gap-2">
                {detailPayout.status !== "completed" && detailPayout.status !== "failed" && (
                  <>
                    <button
                      onClick={async () => {
                        const ok = await confirm({ title: "Reject payout?", message: `Reject ${formatCurrency(detailPayout.amount)} payout to ${detailPayout.creator.name}?`, confirmLabel: "Reject", destructive: true });
                        if (ok) {
                          updatePayoutStatus(detailPayout.id, "failed");
                          setDetailPayout((prev) => prev ? { ...prev, status: "failed" } : null);
                          toast("Payout rejected");
                        }
                      }}
                      className="cursor-pointer rounded-full border border-[#FF2525]/30 bg-[#FF2525]/10 px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[#FF2525]/20"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        updatePayoutStatus(detailPayout.id, "on_hold");
                        setDetailPayout((prev) => prev ? { ...prev, status: "on_hold" } : null);
                        toast("Payout placed on hold");
                      }}
                      className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                    >
                      Hold
                    </button>
                  </>
                )}
                {(detailPayout.status === "pending" || detailPayout.status === "on_hold") && (
                  <button
                    onClick={() => {
                      updatePayoutStatus(detailPayout.id, "processing");
                      setDetailPayout((prev) => prev ? { ...prev, status: "processing" } : null);
                      toast("Payout approved");
                    }}
                    className="cursor-pointer rounded-full bg-[#FF8003] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
                  >
                    Approve
                  </button>
                )}
                {detailPayout.status === "failed" && (
                  <button
                    onClick={() => {
                      updatePayoutStatus(detailPayout.id, "pending");
                      setDetailPayout((prev) => prev ? { ...prev, status: "pending" } : null);
                      toast("Payout retried — moved to pending");
                    }}
                    className="cursor-pointer rounded-full bg-[#FF8003] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
                  >
                    Retry
                  </button>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* ── Audit Log Sheet ────────────────────────────────────────── */}
      <AuditLogSheet
        open={auditSheet.open}
        onClose={() => setAuditSheet({ open: false, id: "", title: "" })}
        entityType="payout"
        entityId={auditSheet.id}
        entityTitle={auditSheet.title}
      />
    </div>
  );
}
