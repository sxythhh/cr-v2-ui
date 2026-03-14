"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { PageShell } from "@/components/page-shell";
import { SettingsCard } from "@/components/settings-shell";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

const TABS = ["Overview", "Campaigns", "Invoices", "Client Onboarding"] as const;

function ReceiptIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 2C0 0.89543 0.895431 0 2 0H8.66667C9.77124 0 10.6667 0.895431 10.6667 2V12.6667C10.6667 12.927 10.5151 13.1636 10.2786 13.2723C10.042 13.3811 9.76381 13.3423 9.56614 13.1728L8.44444 12.2114L7.32275 13.1728C7.07309 13.3868 6.70469 13.3868 6.45503 13.1728L5.33333 12.2114L4.21164 13.1728C3.96198 13.3868 3.59358 13.3868 3.34392 13.1728L2.22222 12.2114L1.10053 13.1728C0.902853 13.3423 0.62463 13.3811 0.388095 13.2723C0.151561 13.1636 0 12.927 0 12.6667V2ZM2.66667 4C2.66667 3.63181 2.96514 3.33333 3.33333 3.33333H7.33333C7.70152 3.33333 8 3.63181 8 4C8 4.36819 7.70152 4.66667 7.33333 4.66667H3.33333C2.96514 4.66667 2.66667 4.36819 2.66667 4ZM2.66667 6.66667C2.66667 6.29848 2.96514 6 3.33333 6H4.66667C5.03486 6 5.33333 6.29848 5.33333 6.66667C5.33333 7.03486 5.03486 7.33333 4.66667 7.33333H3.33333C2.96514 7.33333 2.66667 7.03486 2.66667 6.66667Z" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5.333 5.333L8 2.667l2.667 2.666M8 2.667v6.666M3.333 10v2c0 .737.597 1.333 1.334 1.333h6.666c.737 0 1.334-.596 1.334-1.333v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FinanceHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: typeof TABS[number];
  onTabChange: (tab: typeof TABS[number]) => void;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              "flex h-14 cursor-pointer items-center justify-center px-5 font-inter text-sm font-medium tracking-[-0.02em] transition-colors",
              activeTab === tab
                ? "border-b border-foreground text-foreground"
                : "text-foreground/70 hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {/* Deposit */}
        <button
          type="button"
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-4 font-inter text-sm font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-foreground/[0.10]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.3334 2.66602C9.12424 2.66602 7.33337 4.45688 7.33337 6.66602V8.38987L5.97145 7.02794C5.7111 6.7676 5.28899 6.7676 5.02864 7.02794C4.76829 7.28829 4.76829 7.7104 5.02864 7.97075L7.52864 10.4708C7.78899 10.7311 8.2111 10.7311 8.47145 10.4708L10.9714 7.97075C11.2318 7.7104 11.2318 7.28829 10.9714 7.02794C10.7111 6.7676 10.289 6.7676 10.0286 7.02794L8.66671 8.38987V6.66602C8.66671 5.19326 9.86061 3.99935 11.3334 3.99935H14C14.3682 3.99935 14.6667 3.70087 14.6667 3.33268C14.6667 2.96449 14.3682 2.66602 14 2.66602H11.3334Z" fill="currentColor"/>
            <path d="M2.66671 4.66602C2.66671 4.29783 2.96518 3.99935 3.33337 3.99935H5.33337C5.70156 3.99935 6.00004 3.70087 6.00004 3.33268C6.00004 2.96449 5.70156 2.66602 5.33337 2.66602H3.33337C2.2288 2.66602 1.33337 3.56145 1.33337 4.66602V11.3327C1.33337 12.4373 2.2288 13.3327 3.33337 13.3327H12.6667C13.7713 13.3327 14.6667 12.4373 14.6667 11.3327V5.99935C14.6667 5.63116 14.3682 5.33268 14 5.33268C13.6319 5.33268 13.3334 5.63116 13.3334 5.99935V11.3327C13.3334 11.7009 13.0349 11.9993 12.6667 11.9993H3.33337C2.96518 11.9993 2.66671 11.7009 2.66671 11.3327V4.66602Z" fill="currentColor"/>
          </svg>
          Deposit
        </button>
        {/* Withdraw */}
        <button
          type="button"
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-4 font-inter text-sm font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-foreground/[0.10]"
        >
          <ExportIcon />
          Withdraw
        </button>
        {/* More menu */}
        <FinanceMoreMenu />
      </div>
    </div>
  );
}

function FinanceMoreMenu() {
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors",
          open ? "bg-foreground/[0.12]" : "bg-foreground/[0.12] hover:bg-foreground/[0.16]",
        )}
      >
        <svg width="3" height="14" viewBox="0 0 3 14" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 1.33333C0 0.596954 0.596954 0 1.33333 0C2.06971 0 2.66667 0.596954 2.66667 1.33333C2.66667 2.06971 2.06971 2.66667 1.33333 2.66667C0.596954 2.66667 0 2.06971 0 1.33333ZM0 6.66667C0 5.93029 0.596954 5.33333 1.33333 5.33333C2.06971 5.33333 2.66667 5.93029 2.66667 6.66667C2.66667 7.40305 2.06971 8 1.33333 8C0.596954 8 0 7.40305 0 6.66667ZM0 12C0 11.2636 0.596954 10.6667 1.33333 10.6667C2.06971 10.6667 2.66667 11.2636 2.66667 12C2.66667 12.7364 2.06971 13.3333 1.33333 13.3333C0.596954 13.3333 0 12.7364 0 12Z" fill="currentColor" className="text-foreground" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 flex w-64 flex-col rounded-xl border border-foreground/[0.06] bg-white p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:bg-card-bg">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-foreground/[0.04]"
          >
            <ExportIcon />
            <span className="font-inter text-sm tracking-[-0.02em] text-page-text">Export report</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-foreground/[0.04]"
          >
            <ReceiptIcon />
            <span className="font-inter text-sm tracking-[-0.02em] text-page-text">Download invoice</span>
          </button>
        </div>
      )}
    </div>
  );
}

function InvoiceReceiptIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 2C0 0.89543 0.895431 0 2 0H8.66667C9.77124 0 10.6667 0.895431 10.6667 2V12.6667C10.6667 12.927 10.5151 13.1636 10.2786 13.2723C10.042 13.3811 9.76381 13.3423 9.56614 13.1728L8.44444 12.2114L7.32275 13.1728C7.07309 13.3868 6.70469 13.3868 6.45503 13.1728L5.33333 12.2114L4.21164 13.1728C3.96198 13.3868 3.59358 13.3868 3.34392 13.1728L2.22222 12.2114L1.10053 13.1728C0.902853 13.3423 0.62463 13.3811 0.388095 13.2723C0.151561 13.1636 0 12.927 0 12.6667V2ZM2.66667 4C2.66667 3.63181 2.96514 3.33333 3.33333 3.33333H7.33333C7.70152 3.33333 8 3.63181 8 4C8 4.36819 7.70152 4.66667 7.33333 4.66667H3.33333C2.96514 4.66667 2.66667 4.36819 2.66667 4ZM2.66667 6.66667C2.66667 6.29848 2.96514 6 3.33333 6H4.66667C5.03486 6 5.33333 6.29848 5.33333 6.66667C5.33333 7.03486 5.03486 7.33333 4.66667 7.33333H3.33333C2.96514 7.33333 2.66667 7.03486 2.66667 6.66667Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7.333" cy="7.333" r="4.667" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M10.667 10.667L13.333 13.333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3.333h12M4 8h8M6 12.667h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 8L8 4M8 4H5M8 4v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="#00994D">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 1a5 5 0 100 10A5 5 0 006 1zm2.354 3.854a.5.5 0 00-.708-.708L5.5 6.293 4.354 5.146a.5.5 0 00-.708.708l1.5 1.5a.5.5 0 00.708 0l2.5-2.5z" />
    </svg>
  );
}

const CAMPAIGN_ROWS = [
  {
    name: "Gambling Summer Push",
    client: "BetKing Corp",
    email: "finance@betking.com",
    model: "CPM $2.00",
    monthlyValue: "$20,000",
    collected: "$20,000",
    collectedColor: "text-[#00B259]",
    outstanding: "$0.00",
    outstandingColor: "text-foreground/30",
    status: "Active" as const,
    statusColor: "bg-[rgba(0,178,89,0.1)] text-[#00B259]",
  },
  {
    name: "Crypto Fall Blitz",
    client: "CoinVault",
    email: "billing@coinvault.io",
    model: "25% of budget",
    monthlyValue: "$20,000",
    collected: "$6,000",
    collectedColor: "text-[#00B259]",
    outstanding: "$0.00",
    outstandingColor: "text-foreground/30",
    status: "Active" as const,
    statusColor: "bg-[rgba(0,178,89,0.1)] text-[#00B259]",
  },
  {
    name: "Q1 Brand Awareness",
    client: "HealthPlus",
    email: "accounts@healthplus.co",
    model: "Retainer + 15%",
    monthlyValue: "$20,000",
    collected: "$5,000",
    collectedColor: "text-[#00B259]",
    outstanding: "$0.00",
    outstandingColor: "text-foreground/30",
    status: "Active" as const,
    statusColor: "bg-[rgba(0,178,89,0.1)] text-[#00B259]",
  },
  {
    name: "Summer UGC Sprint",
    client: "FreshFit",
    email: "pay@freshfit.com",
    model: "Retainer $3k/mo",
    monthlyValue: "$3,000",
    collected: "$0.00",
    collectedColor: "text-[#E57100]",
    outstanding: "$15,000",
    outstandingColor: "text-[#FF3355]",
    status: "Pending" as const,
    statusColor: "bg-[rgba(229,113,0,0.1)] text-[#E57100]",
  },
  {
    name: "Gambling Summer Push",
    client: "BetKing Corp",
    email: "finance@betking.com",
    model: "$1,000 Per video",
    monthlyValue: "$20,000",
    collected: "$10,000",
    collectedColor: "text-[#00B259]",
    outstanding: "$0.00",
    outstandingColor: "text-foreground/50",
    status: "Active" as const,
    statusColor: "bg-[rgba(0,178,89,0.1)] text-[#00B259]",
  },
];

function CampaignsTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hover = useProximityHover(containerRef);
  const activeRect = hover.activeIndex !== null ? hover.itemRects[hover.activeIndex] : null;

  useEffect(() => { hover.measureItems(); }, [hover.measureItems]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card-bg">
      {/* Header */}
      <div className="flex border-b border-foreground/[0.06] px-5 py-3">
        <div className="w-[22%] font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Campaign</div>
        <div className="w-[20%] font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Client</div>
        <div className="w-[15%] font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Model</div>
        <div className="w-[13%] text-right font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Monthly Value</div>
        <div className="w-[10%] text-right font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Collected</div>
        <div className="w-[10%] text-right font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Outstanding</div>
        <div className="w-[10%] text-right font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">Status</div>
      </div>

      {/* Rows with proximity hover */}
      <div ref={containerRef} className="relative">
        {activeRect && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 z-0 bg-foreground/[0.04]"
            initial={false}
            animate={{
              top: activeRect.top,
              height: activeRect.height,
              opacity: 1,
            }}
            transition={springs.moderate}
          />
        )}
        {CAMPAIGN_ROWS.map((row, i) => (
          <div
            key={i}
            data-proximity-item
            className="relative z-10 flex items-center border-b border-foreground/[0.06] px-5 py-3.5 last:border-b-0"
          >
            <div className="flex w-[22%] flex-col">
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{row.name}</span>
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">{row.client}</span>
            </div>
            <div className="w-[20%]">
              <span className="font-inter text-sm tracking-[-0.02em] text-foreground/70">{row.email}</span>
            </div>
            <div className="w-[15%]">
              <span className="font-inter text-sm tracking-[-0.02em] text-foreground/70">{row.model}</span>
            </div>
            <div className="w-[13%] text-right">
              <span className="font-inter text-sm tabular-nums tracking-[-0.02em] text-page-text">{row.monthlyValue}</span>
            </div>
            <div className="w-[10%] text-right">
              <span className={cn("font-inter text-sm tabular-nums tracking-[-0.02em]", row.collectedColor)}>{row.collected}</span>
            </div>
            <div className="w-[10%] text-right">
              <span className={cn("font-inter text-sm tabular-nums tracking-[-0.02em]", row.outstandingColor)}>{row.outstanding}</span>
            </div>
            <div className="flex w-[10%] justify-end">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-2 font-inter text-xs font-medium tracking-[-0.02em]", row.statusColor)}>
                {row.status === "Active" && <div className="size-1.5 rounded-full bg-[#00B259]" />}
                {row.status === "Pending" && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4.25" stroke="#E57100" strokeWidth="1.5" />
                    <path d="M5 3v2.5H7" stroke="#E57100" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const INVOICE_FILTERS = ["All", "Pending", "Overdue", "Paid"] as const;

type InvoiceData = {
  id: string;
  campaign: string;
  client: string;
  dueDate: string;
  dueDateColor: string;
  amount: string;
  amountColor: string;
  status: "Overdue" | "Pending" | "Paid";
  statusLabel: string;
  statusColor: string;
  paidDate?: string;
  faded?: boolean;
};

const INVOICES: InvoiceData[] = [
  {
    id: "INV-2026-006",
    campaign: "Spring Influencer Series",
    client: "SocialSphere Media",
    dueDate: "Due 2026-02-15",
    dueDateColor: "text-[#FF3355]",
    amount: "$3,500.00",
    amountColor: "text-[#FF3355]",
    status: "Overdue",
    statusLabel: "Overdue",
    statusColor: "text-[#FF3355]",
  },
  {
    id: "INV-2026-007",
    campaign: "Winter Holiday Push",
    client: "AdTech Nexus",
    dueDate: "Due 2026-03-01",
    dueDateColor: "text-foreground/50",
    amount: "$1,200.00",
    amountColor: "text-page-text",
    status: "Pending",
    statusLabel: "Pending",
    statusColor: "text-foreground/50",
  },
  {
    id: "INV-2026-003",
    campaign: "Cyber Week Campaign",
    client: "Zenith Marketing Group",
    dueDate: "Due 2026-01-01",
    dueDateColor: "text-foreground/50",
    amount: "$3,100.00",
    amountColor: "text-page-text",
    status: "Pending",
    statusLabel: "Pending",
    statusColor: "text-foreground/50",
  },
  {
    id: "INV-2026-005",
    campaign: "Holiday Season Campaign",
    client: "ViralEdge Marketing",
    dueDate: "Due 2026-02-01",
    dueDateColor: "text-foreground/50",
    amount: "$4,800.00",
    amountColor: "text-page-text",
    status: "Pending",
    statusLabel: "Pending",
    statusColor: "text-foreground/50",
  },
  {
    id: "INV-2026-004",
    campaign: "Black Friday Promotion",
    client: "Apex Digital Agency",
    dueDate: "Due 2026-01-15",
    dueDateColor: "text-foreground/50",
    amount: "$2,900.00",
    amountColor: "text-page-text",
    status: "Pending",
    statusLabel: "Pending",
    statusColor: "text-foreground/50",
  },
  {
    id: "INV-2026-008",
    campaign: "Lunar New Year Campaign",
    client: "NovaMedia Group",
    dueDate: "Due 2026-03-15",
    dueDateColor: "text-foreground/50",
    amount: "$2,500.00",
    amountColor: "text-page-text",
    status: "Paid",
    statusLabel: "Paid 2026-03-01",
    statusColor: "text-[#00994D]",
    paidDate: "2026-03-01",
    faded: true,
  },
];

function InvoicesTab() {
  const [filter, setFilter] = useState<typeof INVOICE_FILTERS[number]>("All");
  const gridRef = useRef<HTMLDivElement>(null);
  const gridHover = useProximityHover(gridRef);
  const gridActiveRect = gridHover.activeIndex !== null ? gridHover.itemRects[gridHover.activeIndex] : null;

  const counts = {
    All: INVOICES.length,
    Pending: INVOICES.filter((i) => i.status === "Pending").length,
    Overdue: INVOICES.filter((i) => i.status === "Overdue").length,
    Paid: INVOICES.filter((i) => i.status === "Paid").length,
  };

  const filtered = filter === "All" ? INVOICES : INVOICES.filter((i) => i.status === filter);

  useEffect(() => { gridHover.measureItems(); }, [gridHover.measureItems, filter]);

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar: filter tabs + search + sort */}
      <div className="flex items-center justify-between">
        {/* Segmented filter */}
        <div className="flex items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5">
          {INVOICE_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "flex h-8 cursor-pointer items-center gap-1.5 rounded-[10px] px-4 font-inter text-sm tracking-[-0.02em] transition-all",
                filter === f
                  ? "bg-white font-medium text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-white/10"
                  : "font-medium text-foreground/70 hover:text-foreground",
              )}
            >
              {f}
              <span className="font-normal text-foreground/50">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-[300px] items-center gap-2 rounded-xl border border-foreground/[0.06] bg-white px-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-white/5">
            <SearchIcon />
            <span className="font-inter text-sm tracking-[-0.02em] text-foreground/70">Search</span>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground/[0.06]">
            <FilterIcon />
          </div>
        </div>
      </div>

      {/* Invoice cards grid */}
      <div ref={gridRef} className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {gridActiveRect && (
          <motion.div
            className="pointer-events-none absolute z-0 rounded-2xl bg-foreground/[0.04]"
            initial={false}
            animate={{
              top: gridActiveRect.top,
              left: gridActiveRect.left,
              width: gridActiveRect.width,
              height: gridActiveRect.height,
              opacity: 1,
            }}
            transition={springs.moderate}
          />
        )}
        {filtered.map((inv) => (
          <div
            key={inv.id}
            data-proximity-item
            className={cn(
              "relative z-10 flex flex-col justify-center gap-4 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
              inv.faded && "opacity-70",
            )}
          >
            {/* Top: icon + due date */}
            <div className="flex items-center justify-between">
              <div className="flex size-9 items-center justify-center rounded-full border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-white/5">
                <InvoiceReceiptIcon />
              </div>
              <span className={cn("font-inter text-xs tracking-[-0.02em]", inv.dueDateColor)}>{inv.dueDate}</span>
            </div>

            {/* Invoice ID + campaign · client */}
            <div className="flex flex-col gap-1.5">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">{inv.id}</span>
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                {inv.campaign} · {inv.client}
              </span>
            </div>

            {/* Separator */}
            <div className="h-px bg-foreground/[0.06]" />

            {/* Bottom: amount + status + view button */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <span className={cn("font-inter text-sm font-medium tabular-nums tracking-[-0.02em]", inv.amountColor)}>{inv.amount}</span>
                <div className="flex items-center gap-1.5">
                  {inv.status === "Paid" && <CheckCircleIcon />}
                  <span className={cn("font-inter text-xs font-medium tracking-[-0.02em]", inv.statusColor)}>{inv.statusLabel}</span>
                </div>
              </div>
              {inv.status !== "Paid" && (
                <button
                  type="button"
                  className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-4 pr-3.5 font-inter text-xs font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                >
                  View
                  <ExternalLinkIcon />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserAddIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" />
    </svg>
  );
}

const ONBOARDING_STEPS = [
  {
    number: 1,
    title: "Client intake form",
    description: "Auto-generate a contract with payment terms, deliverables, and policies.",
  },
  {
    number: 2,
    title: "Connect payment via Whop",
    description: "Once connected, all future payments flow through Whop automatically.",
  },
  {
    number: 3,
    title: "Generate contract",
    description: "Auto-generate that includes all relevant info, via Whop.",
  },
  {
    number: 4,
    title: "Create campaign",
    description: "Select specifics and campaign model (CPM, retainer, per post)",
  },
  {
    number: 5,
    title: "First invoice & reporting",
    description: "Schedule recurring invoices based on contract terms.",
  },
];

function ClientOnboardingTab() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsHover = useProximityHover(stepsRef);
  const activeRect = stepsHover.activeIndex !== null ? stepsHover.itemRects[stepsHover.activeIndex] : null;

  useEffect(() => { stepsHover.measureItems(); }, [stepsHover.measureItems]);

  return (
    <div className="flex flex-col items-center py-10">
      {/* Icon */}
      <div className="flex size-14 items-center justify-center rounded-full border border-foreground/[0.06] bg-white text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-white/5">
        <UserAddIcon />
      </div>

      {/* Title + description */}
      <h2 className="mt-5 font-inter text-xl font-medium tracking-[-0.02em] text-page-text">
        New client setup
      </h2>
      <p className="mt-2 max-w-[440px] text-center font-inter text-sm tracking-[-0.02em] text-foreground/50">
        Your agency dashboard lets you run multiple brand campaigns from one place. Add your first brand client to get started.
      </p>

      {/* Steps card */}
      <div className="mt-8 w-full max-w-[720px] overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-card-bg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
        <div ref={stepsRef} className="relative">
          {activeRect && (
            <motion.div
              className="pointer-events-none absolute inset-x-[-8px] z-0 rounded-xl bg-foreground/[0.04]"
              initial={false}
              animate={{
                top: activeRect.top - 4,
                height: activeRect.height + 8,
                opacity: 1,
              }}
              transition={springs.moderate}
            />
          )}
          {ONBOARDING_STEPS.map((step, i) => (
            <div key={step.number}>
              <div
                data-proximity-item
                className="relative z-10 flex items-center gap-3 py-3"
              >
                {/* Number circle */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] bg-gradient-to-b from-white to-[#f8f8f8] font-inter text-sm font-semibold tabular-nums text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:from-white/10 dark:to-white/5">
                  {step.number}
                </div>

                {/* Text */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                    {step.title}
                  </span>
                  <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                    {step.description}
                  </span>
                </div>

                {/* Chevron */}
                <div className="shrink-0">
                  <ChevronRightIcon />
                </div>
              </div>

              {/* Separator */}
              {i < ONBOARDING_STEPS.length - 1 && (
                <div className="ml-[52px] h-px bg-foreground/[0.06]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Campaigns");

  return (
    <PageShell
      title=""
      actions={<FinanceHeader activeTab={activeTab} onTabChange={setActiveTab} />}
      fullWidthActions
    >
      {activeTab === "Overview" && (
        <SettingsCard title="Current plan" description="You are currently on the Free plan.">
          <div className="flex items-center justify-between">
            <div>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-muted-foreground">Free</span>
              <span className="ml-2 text-sm text-muted-foreground">1,240 / 5,000 events used</span>
            </div>
            <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-page-bg transition-colors hover:bg-foreground/90">
              Upgrade
            </button>
          </div>
        </SettingsCard>
      )}

      {activeTab === "Campaigns" && (
        <div className="flex flex-col gap-5">
          {/* Whop Integration Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card-bg p-5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-foreground/[0.06] bg-white dark:bg-white/5">
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" className="dark:brightness-0 dark:invert">
                <path d="M3.49643 0C2.04966 0 1.05645 0.637265 0.298619 1.34917C0.298619 1.34917 -0.0056609 1.63622 8.02324e-05 1.6477L3.16918 4.81681L6.33828 1.6477C5.73547 0.820981 4.60446 0 3.49643 0Z" fill="#FA4616"/>
                <path d="M11.3216 0C9.87482 0 8.8816 0.637265 8.12377 1.34916C8.12377 1.34916 7.8482 1.63048 7.83098 1.6477L3.91553 5.56315L7.07889 8.72651L14.1577 1.6477C13.5549 0.820981 12.4296 0 11.3216 0Z" fill="#FA4616"/>
                <path d="M19.164 0C17.7173 0 16.7241 0.637265 15.9662 1.34917C15.9662 1.34917 15.6792 1.63048 15.6677 1.6477L7.83105 9.48434L8.65778 10.3111C9.93805 11.5913 12.0393 11.5913 13.3253 10.3111L21.9887 1.6477H22.0002C21.4031 0.820981 20.2721 0 19.164 0Z" fill="#FA4616"/>
              </svg>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">Connect your Whop account</span>
              <span className="font-inter text-sm tracking-[-0.02em] text-foreground/50">Sync your billing, payments, and invoicing with Whop for seamless financial management.</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" className="flex h-9 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-foreground/[0.10]">
                Learn more
              </button>
              <button type="button" className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-bg transition-colors hover:bg-foreground/90">
                Connect Whop
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4.083 9.917L9.917 4.083M9.917 4.083H5.25M9.917 4.083v4.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Campaigns Table */}
          <CampaignsTable />
        </div>
      )}

      {activeTab === "Invoices" && (
        <InvoicesTab />
      )}

      {activeTab === "Client Onboarding" && (
        <ClientOnboardingTab />
      )}
    </PageShell>
  );
}
