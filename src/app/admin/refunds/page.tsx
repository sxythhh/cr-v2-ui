// @ts-nocheck
"use client";

import { useState, useCallback } from "react";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";
import { FilterIcon } from "@/components/submissions";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { ClockCircleIcon, CheckCircleIcon } from "@/components/admin/status-icons";
import { CentralIcon } from "@central-icons-react/all";

const ci = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

// ── Types ────────────────────────────────────────────────────────────

type RefundStatus = "Pending" | "Completed";

interface Refund {
  id: string;
  campaign: string;
  campaignSub: string;
  campaignThumb: string;
  creator: string;
  creatorAvatar: string;
  amount: number;
  status: RefundStatus;
  date: string;
  fundedWith: string;
}

// ── Mock Data ────────────────────────────────────────────────────────

const REFUNDS: Refund[] = [
  { id: "r1", campaign: "Wedding Inviter | UGC Campaign", campaignSub: "Wedding Inviter", campaignThumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=48&h=48&fit=crop", creator: "Lucas Holm", creatorAvatar: "https://i.pravatar.cc/32?u=lucas", amount: 900.00, status: "Pending", date: "Apr 11", fundedWith: "Mastercard ...4162" },
  { id: "r2", campaign: "$NOT — UGC & Clipping", campaignSub: "Broke UGC & Clipping", campaignThumb: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=48&h=48&fit=crop", creator: "UGC CAMPAIGNS", creatorAvatar: "https://i.pravatar.cc/32?u=ugc", amount: 28.64, status: "Pending", date: "Apr 11", fundedWith: "Visa ...5601" },
  { id: "r3", campaign: "Formula E — Coding the Chaos — Epi...", campaignSub: "BE Studio", campaignThumb: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=48&h=48&fit=crop", creator: "BE Studio", creatorAvatar: "https://i.pravatar.cc/32?u=bestudio", amount: 2237.12, status: "Pending", date: "Apr 11", fundedWith: "Mastercard ...7524" },
  { id: "r4", campaign: "Black Sabbath \"Heaven & Hell\" Cli...", campaignSub: "Avalanche", campaignThumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=48&h=48&fit=crop", creator: "Alice Macedo", creatorAvatar: "https://i.pravatar.cc/32?u=alice", amount: 475.00, status: "Pending", date: "Apr 9", fundedWith: "Amex ...2005" },
  { id: "r5", campaign: "Ice Nine Kills (Scream Movies) Clip...", campaignSub: "Avalanche", campaignThumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=48&h=48&fit=crop", creator: "Alice Macedo", creatorAvatar: "https://i.pravatar.cc/32?u=alice2", amount: 1759.40, status: "Pending", date: "Apr 9", fundedWith: "Amex ...2005" },
  { id: "r6", campaign: "2hollis Live Show Clipping V2", campaignSub: "Avalanche", campaignThumb: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=48&h=48&fit=crop", creator: "Alice Macedo", creatorAvatar: "https://i.pravatar.cc/32?u=alice3", amount: 405.84, status: "Pending", date: "Apr 9", fundedWith: "Amex ...2005" },
  { id: "r7", campaign: "2hollis Live Show Clipping V1", campaignSub: "Avalanche", campaignThumb: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=48&h=48&fit=crop", creator: "Alice Macedo", creatorAvatar: "https://i.pravatar.cc/32?u=alice4", amount: 241.97, status: "Pending", date: "Apr 9", fundedWith: "Amex ...2005" },
  { id: "r8", campaign: "Chet Faker Mahogany Sessions Cli...", campaignSub: "Avalanche", campaignThumb: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=48&h=48&fit=crop", creator: "Alice Macedo", creatorAvatar: "https://i.pravatar.cc/32?u=alice5", amount: 263.57, status: "Pending", date: "Apr 9", fundedWith: "Amex ...2005" },
  { id: "r9", campaign: "Zing Coach Split Screen", campaignSub: "Virality", campaignThumb: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=48&h=48&fit=crop", creator: "Ahmed Ali", creatorAvatar: "https://i.pravatar.cc/32?u=ahmed", amount: 2649.52, status: "Pending", date: "Apr 9", fundedWith: "Platform Balance" },
  { id: "r10", campaign: "$300/1M views — Lucky X ytcliplu L...", campaignSub: "Lucky X ytcliplu — Logo Campaign", campaignThumb: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=48&h=48&fit=crop", creator: "Bence", creatorAvatar: "https://i.pravatar.cc/32?u=bence", amount: 884.62, status: "Pending", date: "Apr 9", fundedWith: "Crypto" },
  { id: "r11", campaign: "Post Viral Clips of Gameplay", campaignSub: "Asylum Seekers", campaignThumb: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=48&h=48&fit=crop", creator: "Asylum Seekers", creatorAvatar: "https://i.pravatar.cc/32?u=asylum", amount: 450.00, status: "Pending", date: "Apr 9", fundedWith: "Crypto" },
  { id: "r12", campaign: "Minute Reads — Clipping", campaignSub: "Minute Reads", campaignThumb: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=48&h=48&fit=crop", creator: "sappyengine", creatorAvatar: "https://i.pravatar.cc/32?u=sappy", amount: 511.93, status: "Pending", date: "Apr 7", fundedWith: "Visa ...2522" },
  { id: "r13", campaign: "Viral Fire Football Clips", campaignSub: "The Fireball Guy", campaignThumb: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=48&h=48&fit=crop", creator: "The Fireball Guy", creatorAvatar: "https://i.pravatar.cc/32?u=fireball", amount: 450.00, status: "Pending", date: "Apr 5", fundedWith: "Coinflow" },
  { id: "r14", campaign: "GYMSHARK Clipping — Q2", campaignSub: "GYMSHARK", campaignThumb: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=48&h=48&fit=crop", creator: "Jake Wilson", creatorAvatar: "https://i.pravatar.cc/32?u=jake", amount: 1200.00, status: "Completed", date: "Apr 3", fundedWith: "Stripe" },
  { id: "r15", campaign: "NovaPay Wallet Clipping", campaignSub: "NovaPay", campaignThumb: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=48&h=48&fit=crop", creator: "Sarah Chen", creatorAvatar: "https://i.pravatar.cc/32?u=sarah", amount: 675.00, status: "Completed", date: "Apr 2", fundedWith: "Mastercard ...8901" },
  { id: "r16", campaign: "Polymarket Clipping", campaignSub: "Polymarket", campaignThumb: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=48&h=48&fit=crop", creator: "David Kim", creatorAvatar: "https://i.pravatar.cc/32?u=davidk", amount: 350.00, status: "Completed", date: "Apr 1", fundedWith: "Platform Balance" },
];

// ── Tabs ──────────────────────────────────────────────────────────────

const pendingCount = REFUNDS.filter((r) => r.status === "Pending").length;
const completedCount = REFUNDS.filter((r) => r.status === "Completed").length;

// ── Columns ──────────────────────────────────────────────────────────

const REFUND_FILTERS: Filter[] = [
  { key: "status", icon: null, label: "Status", singleSelect: true, options: [{ value: "Pending", label: "Pending" }, { value: "Completed", label: "Completed" }] },
  { key: "fundedWith", icon: null, label: "Funded With", singleSelect: true, options: [{ value: "Mastercard", label: "Mastercard" }, { value: "Visa", label: "Visa" }, { value: "Amex", label: "Amex" }, { value: "Crypto", label: "Crypto" }, { value: "Platform Balance", label: "Platform Balance" }] },
];

const COLUMNS: AdminColumn[] = [
  { key: "campaign", label: "Campaign", width: "minmax(160px, 2fr)" },
  { key: "creator", label: "Creator", width: "minmax(100px, 1.2fr)" },
  { key: "amount", label: "Amount", sortable: true, width: "90px" },
  { key: "status", label: "Status", width: "100px" },
  { key: "date", label: "Date", sortable: true, width: "70px", hideMobile: true },
  { key: "fundedWith", label: "Funded With", width: "150px", hideMobile: true },
  { key: "action", label: "", width: "80px" },
];

// ── Page ──────────────────────────────────────────────────────────────

export default function RefundsPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [refunds, setRefunds] = useState(REFUNDS);
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const tabs = [
    { label: "All", count: refunds.length },
    { label: "Pending", count: refunds.filter((r) => r.status === "Pending").length },
    { label: "Completed", count: refunds.filter((r) => r.status === "Completed").length },
  ];

  const statusFilter = [null, "Pending", "Completed"][tabIndex];
  const filtered = statusFilter ? refunds.filter((r) => r.status === statusFilter) : refunds;

  const processRefund = useCallback(async (id: string) => {
    const refund = refunds.find((r) => r.id === id);
    if (!refund) return;
    const ok = await confirm({
      title: "Process refund?",
      message: `Process $${refund.amount.toFixed(2)} refund for "${refund.campaign}" to ${refund.creator}?`,
      confirmLabel: "Process",
    });
    if (ok) {
      setRefunds((prev) => prev.map((r) => r.id === id ? { ...r, status: "Completed" as RefundStatus } : r));
      toast(`Refund of $${refund.amount.toFixed(2)} processed`);
    }
  }, [refunds, confirm, toast]);

  const renderCell = useCallback((row: Refund, colKey: string) => {
    switch (colKey) {
      case "campaign":
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={row.campaignThumb} alt="" className="size-9 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium tracking-[-0.02em] text-page-text">{row.campaign}</div>
              <div className="truncate text-xs tracking-[-0.02em] text-page-text-subtle">{row.campaignSub}</div>
            </div>
          </div>
        );
      case "creator":
        return (
          <div className="flex items-center gap-2 min-w-0">
            <img src={row.creatorAvatar} alt="" className="size-6 shrink-0 rounded-full" />
            <span className="truncate text-sm tracking-[-0.02em] text-page-text">{row.creator}</span>
          </div>
        );
      case "amount":
        return <span className="text-sm font-medium tracking-[-0.02em] text-page-text">${row.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>;
      case "status":
        return row.status === "Pending" ? (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: "rgba(233,162,59,0.15)", color: "#E9A23B" }}>
            <ClockCircleIcon size={12} color="#E9A23B" /> Pending
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: "rgba(0,178,89,0.15)", color: "#00B259" }}>
            <CheckCircleIcon size={12} color="#00B259" /> Completed
          </span>
        );
      case "date":
        return <span className="text-xs tracking-[-0.02em] text-page-text-muted">{row.date}</span>;
      case "fundedWith":
        return (
          <div className="flex items-center gap-1.5 text-xs text-page-text-muted">
            <CentralIcon name="IconCreditCard1" size={13} color="var(--muted-fg)" {...ci} />
            <span className="tracking-[-0.02em]">{row.fundedWith}</span>
          </div>
        );
      case "action":
        return row.status === "Pending" ? (
          <button
            onClick={(e) => { e.stopPropagation(); processRefund(row.id); }}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold tracking-[-0.02em] transition-opacity hover:opacity-90"
            style={{ background: "#60A5FA", border: "none", borderTop: "2px solid #93C5FD", color: "#fff" }}
          >
            Process
          </button>
        ) : null;
      default:
        return null;
    }
  }, [processRefund]);

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--bg)" }}>
      {/* Tabs — mobile: own row, desktop: inline with search */}
      <div className="overflow-x-auto scrollbar-hide px-4 pt-3 pb-3 sm:px-6 md:hidden">
        <Tabs selectedIndex={tabIndex} onSelect={setTabIndex} className="w-max">
          {tabs.map((tab, i) => (
            <TabItem key={tab.label} label={tab.label} count={tab.count} index={i} />
          ))}
        </Tabs>
      </div>
      <div className="hidden px-4 pt-[21px] pb-3 sm:px-6 md:flex md:items-center md:justify-between md:gap-2">
        <Tabs selectedIndex={tabIndex} onSelect={setTabIndex} className="w-fit">
          {tabs.map((tab, i) => (
            <TabItem key={tab.label} label={tab.label} count={tab.count} index={i} />
          ))}
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 dark:bg-[rgba(224,224,224,0.03)] md:w-[300px] md:flex-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50">
              <path d="M11.333 11.333L14 14M2 7.333A5.333 5.333 0 1012.667 7.333 5.333 5.333 0 002 7.333z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/70" />
          </div>
          <FilterSelect filters={REFUND_FILTERS} activeFilters={[]} onSelect={() => {}} onRemove={() => {}} searchPlaceholder="Filter...">
            <button className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
              <FilterIcon />
            </button>
          </FilterSelect>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={COLUMNS}
        data={filtered}
        rowKey={(r) => r.id}
        renderCell={renderCell}
        emptyTitle="No refunds to show"
        pageSize={15}
      />
    </div>
  );
}
