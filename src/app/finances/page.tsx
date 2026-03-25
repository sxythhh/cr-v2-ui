"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { PageShell } from "@/components/page-shell";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { ProximityTabs } from "@/components/ui/proximity-tabs";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import { AnalyticsPocSelect } from "@/components/analytics-poc/AnalyticsPocSelect";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const TABS = ["Overview", "Campaigns", "Invoices"] as const;

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
  const actionBtnClass = "flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-foreground/[0.03] dark:hover:bg-foreground/[0.06]";

  return (
    <div className="flex w-full items-center justify-between">
      <ProximityTabs
        tabs={TABS.map((t) => ({ label: t }))}
        selectedIndex={TABS.indexOf(activeTab)}
        onSelect={(i) => onTabChange(TABS[i])}
      />
      <div className="flex items-center gap-2">
        {/* Deposit */}
        <button type="button" className={actionBtnClass}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.3334 2.66602C9.12424 2.66602 7.33337 4.45688 7.33337 6.66602V8.38987L5.97145 7.02794C5.7111 6.7676 5.28899 6.7676 5.02864 7.02794C4.76829 7.28829 4.76829 7.7104 5.02864 7.97075L7.52864 10.4708C7.78899 10.7311 8.2111 10.7311 8.47145 10.4708L10.9714 7.97075C11.2318 7.7104 11.2318 7.28829 10.9714 7.02794C10.7111 6.7676 10.289 6.7676 10.0286 7.02794L8.66671 8.38987V6.66602C8.66671 5.19326 9.86061 3.99935 11.3334 3.99935H14C14.3682 3.99935 14.6667 3.70087 14.6667 3.33268C14.6667 2.96449 14.3682 2.66602 14 2.66602H11.3334Z" fill="currentColor"/>
            <path d="M2.66671 4.66602C2.66671 4.29783 2.96518 3.99935 3.33337 3.99935H5.33337C5.70156 3.99935 6.00004 3.70087 6.00004 3.33268C6.00004 2.96449 5.70156 2.66602 5.33337 2.66602H3.33337C2.2288 2.66602 1.33337 3.56145 1.33337 4.66602V11.3327C1.33337 12.4373 2.2288 13.3327 3.33337 13.3327H12.6667C13.7713 13.3327 14.6667 12.4373 14.6667 11.3327V5.99935C14.6667 5.63116 14.3682 5.33268 14 5.33268C13.6319 5.33268 13.3334 5.63116 13.3334 5.99935V11.3327C13.3334 11.7009 13.0349 11.9993 12.6667 11.9993H3.33337C2.96518 11.9993 2.66671 11.7009 2.66671 11.3327V4.66602Z" fill="currentColor"/>
          </svg>
          Deposit
        </button>
        {/* Withdraw */}
        <button type="button" className={actionBtnClass}>
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-foreground/[0.03] dark:hover:bg-foreground/[0.06]"
        >
          <svg width="3" height="14" viewBox="0 0 3 14" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 1.33333C0 0.596954 0.596954 0 1.33333 0C2.06971 0 2.66667 0.596954 2.66667 1.33333C2.66667 2.06971 2.06971 2.66667 1.33333 2.66667C0.596954 2.66667 0 2.06971 0 1.33333ZM0 6.66667C0 5.93029 0.596954 5.33333 1.33333 5.33333C2.06971 5.33333 2.66667 5.93029 2.66667 6.66667C2.66667 7.40305 2.06971 8 1.33333 8C0.596954 8 0 7.40305 0 6.66667ZM0 12C0 11.2636 0.596954 10.6667 1.33333 10.6667C2.06971 10.6667 2.66667 11.2636 2.66667 12C2.66667 12.7364 2.06971 13.3333 1.33333 13.3333C0.596954 13.3333 0 12.7364 0 12Z" fill="currentColor" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
        <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg px-2.5 py-2">
          <ExportIcon />
          <span className="font-inter text-sm tracking-[-0.02em] text-page-text">Export report</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg px-2.5 py-2">
          <ReceiptIcon />
          <span className="font-inter text-sm tracking-[-0.02em] text-page-text">Download invoice</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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

/** Correct status icons matching payouts page */
function StatusCheckIcon({ color = "#34D399" }: { color?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0ZM6.88698 4.06663C7.06184 3.85291 7.03034 3.5379 6.81662 3.36304C6.6029 3.18817 6.28789 3.21967 6.11302 3.4334L4.21288 5.75579L3.60355 5.14646C3.40829 4.9512 3.09171 4.9512 2.89645 5.14646C2.70118 5.34172 2.70118 5.65831 2.89645 5.85357L3.89645 6.85357C3.99634 6.95346 4.13382 7.00643 4.27491 6.9994C4.416 6.99236 4.54752 6.92597 4.63698 6.81663L6.88698 4.06663Z" fill={color} />
    </svg>
  );
}
function StatusClockIcon({ color = "#FB923C" }: { color?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill={color} />
    </svg>
  );
}
function StatusDotIcon({ color = "#34D399" }: { color?: string }) {
  return <div className="size-1.5 rounded-full" style={{ background: color }} />;
}
function StatusIcon({ status, color }: { status: string; color: string }) {
  switch (status) {
    case "Withdrawn": case "Paid": return <StatusCheckIcon color={color} />;
    case "Pending": return <StatusClockIcon color={color} />;
    case "Active": return <StatusDotIcon color={color} />;
    default: return <StatusDotIcon color={color} />;
  }
}

const TIMEFRAME_OPTIONS = ["Last 7 days", "Last 14 days", "Last month", "Last 3 months", "Last 6 months", "Last year", "All time"] as const;

const CAMPAIGN_ROWS = [
  {
    name: "Gambling Summer Push",
    client: "BetKing Corp",
    email: "finance@betking.com",
    model: "CPM $2.00",
    monthlyValue: "$20,000",
    collected: "$20,000",
    collectedColor: "text-[#34D399]",
    outstanding: "$0.00",
    outstandingColor: "text-foreground/30",
    status: "Active" as const,
    statusColor: "bg-[rgba(52,211,153,0.08)] text-[#34D399]",
  },
  {
    name: "Crypto Fall Blitz",
    client: "CoinVault",
    email: "billing@coinvault.io",
    model: "25% of budget",
    monthlyValue: "$20,000",
    collected: "$6,000",
    collectedColor: "text-[#34D399]",
    outstanding: "$0.00",
    outstandingColor: "text-foreground/30",
    status: "Active" as const,
    statusColor: "bg-[rgba(52,211,153,0.08)] text-[#34D399]",
  },
  {
    name: "Q1 Brand Awareness",
    client: "HealthPlus",
    email: "accounts@healthplus.co",
    model: "Retainer + 15%",
    monthlyValue: "$20,000",
    collected: "$5,000",
    collectedColor: "text-[#34D399]",
    outstanding: "$0.00",
    outstandingColor: "text-foreground/30",
    status: "Active" as const,
    statusColor: "bg-[rgba(52,211,153,0.08)] text-[#34D399]",
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
    outstandingColor: "text-[#FB7185]",
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
    collectedColor: "text-[#34D399]",
    outstanding: "$0.00",
    outstandingColor: "text-foreground/50",
    status: "Active" as const,
    statusColor: "bg-[rgba(52,211,153,0.08)] text-[#34D399]",
  },
];

function CampaignsTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hover = useProximityHover(containerRef);
  const activeRect = hover.activeIndex !== null ? hover.itemRects[hover.activeIndex] : null;

  useEffect(() => { hover.measureItems(); }, [hover.measureItems]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card-bg dark:border-foreground/[0.03] dark:bg-foreground/[0.03]">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
      {/* Header */}
      <div className="flex border-b border-foreground/[0.06] dark:border-foreground/[0.03] px-5 py-3">
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
            <div className="flex min-w-0 w-[22%] flex-col">
              <span className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{row.name}</span>
              <span className="truncate font-inter text-xs tracking-[-0.02em] text-foreground/50">{row.client}</span>
            </div>
            <div className="min-w-0 w-[20%]">
              <span className="truncate block font-inter text-sm tracking-[-0.02em] text-foreground/70">{row.email}</span>
            </div>
            <div className="min-w-0 w-[15%]">
              <span className="truncate block font-inter text-sm tracking-[-0.02em] text-foreground/70">{row.model}</span>
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
                {row.status === "Active" && <div className="size-1.5 rounded-full bg-[#34D399]" />}
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
    dueDateColor: "text-[#FB7185]",
    amount: "$3,500.00",
    amountColor: "text-[#FB7185]",
    status: "Overdue",
    statusLabel: "Overdue",
    statusColor: "text-[#FB7185]",
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
    statusColor: "text-[#34D399]",
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
                  ? "bg-card-bg font-medium text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
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
          <div className="flex h-9 w-[300px] items-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg px-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
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
              <div className="flex size-9 items-center justify-center rounded-full border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
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
                  {inv.status === "Paid" && <StatusCheckIcon color="#34D399" />}
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


// ── Whop Integration Card (shared) ───────────────────────────────────

const whopButtonClass =
  "flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.03] px-4 pl-3 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.06]";

function WhopIntegrationCard() {
  return (
    <div className={cn(cardBase, "gap-3 p-4")}>
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-foreground/[0.03] bg-white dark:bg-white">
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <path d="M3.49643 0C2.04966 0 1.05645 0.637265 0.298619 1.34917C0.298619 1.34917 -0.0056609 1.63622 8.02324e-05 1.6477L3.16918 4.81681L6.33828 1.6477C5.73547 0.820981 4.60446 0 3.49643 0Z" fill="#FA4616"/>
            <path d="M11.3216 0C9.87482 0 8.8816 0.637265 8.12377 1.34916C8.12377 1.34916 7.8482 1.63048 7.83098 1.6477L3.91553 5.56315L7.07889 8.72651L14.1577 1.6477C13.5549 0.820981 12.4296 0 11.3216 0Z" fill="#FA4616"/>
            <path d="M19.164 0C17.7173 0 16.7241 0.637265 15.9662 1.34917C15.9662 1.34917 15.6792 1.63048 15.6677 1.6477L7.83105 9.48434L8.65778 10.3111C9.93805 11.5913 12.0393 11.5913 13.3253 10.3111L21.9887 1.6477H22.0002C21.4031 0.820981 20.2721 0 19.164 0Z" fill="#FA4616"/>
          </svg>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Connect your Whop account</span>
          <span className="max-w-[400px] font-inter text-xs leading-[150%] tracking-[-0.02em] text-page-text-subtle">
            Handle all billing: payments, auto-invoicing, contracts, and instant payouts across 241+ territories. Free to connect, 2.7% + 30c/transaction.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className={whopButtonClass}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 8V8.005M6 6.5C6 5.68041 7 5.96594 7 5C7 4.44772 6.55228 4 6 4C5.62986 4 5.30669 4.2011 5.13378 4.5M10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6Z" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Learn more
        </button>
        <button type="button" className={whopButtonClass}>
          <svg width="20" height="10" viewBox="0 0 22 12" fill="none">
            <path d="M3.49643 0C2.04966 0 1.05645 0.637265 0.298619 1.34917C0.298619 1.34917 -0.0056609 1.63622 8.02324e-05 1.6477L3.16918 4.81681L6.33828 1.6477C5.73547 0.820981 4.60446 0 3.49643 0Z" fill="currentColor"/>
            <path d="M11.3216 0C9.87482 0 8.8816 0.637265 8.12377 1.34916C8.12377 1.34916 7.8482 1.63048 7.83098 1.6477L3.91553 5.56315L7.07889 8.72651L14.1577 1.6477C13.5549 0.820981 12.4296 0 11.3216 0Z" fill="currentColor"/>
            <path d="M19.164 0C17.7173 0 16.7241 0.637265 15.9662 1.34917C15.9662 1.34917 15.6792 1.63048 15.6677 1.6477L7.83105 9.48434L8.65778 10.3111C9.93805 11.5913 12.0393 11.5913 13.3253 10.3111L21.9887 1.6477H22.0002C21.4031 0.820981 20.2721 0 19.164 0Z" fill="currentColor"/>
          </svg>
          Connect Whop
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M7.33464 0.667969L11.3346 4.66796L7.33464 8.66797M10.668 4.66796H0.667969" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Finance Overview ──────────────────────────────────────────────────

const cardBase =
  "flex flex-col justify-center rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]";
const muted = "text-page-text-muted";

const OVERVIEW_STATS = [
  { label: "Balance", value: "$50,000", change: "+18.3%", changeColor: "#34D399" },
  { label: "Net profit", value: "$38.2K", valueColor: "#34D399", change: "+18.3%", changeColor: "#34D399" },
  { label: "Avg campaign ROI", value: "5.4x", secondary: "2.1x industry avg" },
  { label: "Paid out", value: "$3.32k", secondary: "Across all campaigns" },
];

const WITHDRAWAL_ROWS = [
  { amount: "$20,000", status: "Withdrawn", statusBg: "rgba(52,211,153,0.08)", statusColor: "#34D399", sentTo: "Chase Bank", initiated: "Fri 13 Mar 2026, 1:21pm", arrival: "Tomorrow" },
  { amount: "$20,000", status: "Withdrawn", statusBg: "rgba(52,211,153,0.08)", statusColor: "#34D399", sentTo: "Chase Bank", initiated: "Fri 13 Mar 2026, 1:21pm", arrival: "Tomorrow" },
  { amount: "$20,000", status: "Withdrawn", statusBg: "rgba(52,211,153,0.08)", statusColor: "#34D399", sentTo: "Chase Bank", initiated: "Fri 13 Mar 2026, 1:21pm", arrival: "Tomorrow" },
  { amount: "$20,000", status: "Withdrawn", statusBg: "rgba(52,211,153,0.08)", statusColor: "#34D399", sentTo: "Chase Bank", initiated: "Fri 13 Mar 2026, 1:21pm", arrival: "Tomorrow" },
];

const BOTTOM_STATS = [
  { value: "$36,950", label: "Total collected", change: "+18.3%", secondary: "Of $51,859 billed" },
  { value: "$15,000", label: "Payment pending", change: "+18.3%", secondary: "Outstanding" },
  { value: "4", label: "Active campaigns", change: "+18.3%", secondary: "2 payment models" },
];

const BAR_MONTHS = ["Apr '25","May '25","Jun '25","Jul '25","Aug '25","Sep '25","Oct '25","Nov '25","Dec '25","Jan '26","Feb '26","Mar '26"];
const BAR_HEIGHTS = [108,142,156,88,168,168,204,192,171,142,168,192];
const PROFIT_HEIGHTS = [77,97,105,112,105,105,108,108,108,97,105,108];
const BAR_REVENUE = ["$18.9K","$24.8K","$27.3K","$15.4K","$29.4K","$29.4K","$35.7K","$33.6K","$29.9K","$24.8K","$29.4K","$33.6K"];
const BAR_PROFIT = ["$13.5K","$17.0K","$18.4K","$19.6K","$18.4K","$18.4K","$18.9K","$18.9K","$18.9K","$17.0K","$18.4K","$18.9K"];

const REVENUE_CHART_DATA: AnalyticsPocPerformanceLineChartData = {
  datasets: {
    daily: [
      { index: 0, label: "Jan 5", views: 12000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 1, label: "Jan 8", views: 18000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 2, label: "Jan 11", views: 32000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 3, label: "Jan 14", views: 28000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 4, label: "Jan 17", views: 38000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 5, label: "Jan 20", views: 35000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 6, label: "Jan 23", views: 42000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 7, label: "Jan 27", views: 39000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 8, label: "Jan 30", views: 45000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 9, label: "Feb 2", views: 41000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 10, label: "Feb 5", views: 47800, engagement: 0, likes: 0, comments: 0, shares: 0 },
    ],
    cumulative: [
      { index: 0, label: "Jan 5", views: 12000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 1, label: "Jan 8", views: 30000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 2, label: "Jan 11", views: 62000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 3, label: "Jan 14", views: 90000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 4, label: "Jan 17", views: 128000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 5, label: "Jan 20", views: 163000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 6, label: "Jan 23", views: 205000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 7, label: "Jan 27", views: 244000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 8, label: "Jan 30", views: 289000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 9, label: "Feb 2", views: 330000, engagement: 0, likes: 0, comments: 0, shares: 0 },
      { index: 10, label: "Feb 5", views: 377800, engagement: 0, likes: 0, comments: 0, shares: 0 },
    ],
  },
  series: [
    { key: "views", label: "Revenue", color: "#E9A23B", axis: "left", tooltipValueType: "currency" },
  ],
  xTicks: [
    { label: "Jan 5", index: 0 }, { label: "Jan 8", index: 1 }, { label: "Jan 11", index: 2 },
    { label: "Jan 14", index: 3 }, { label: "Jan 17", index: 4 }, { label: "Jan 20", index: 5 },
    { label: "Jan 23", index: 6 }, { label: "Jan 27", index: 7 }, { label: "Jan 30", index: 8 },
    { label: "Feb 2", index: 9 }, { label: "Feb 5", index: 10 },
  ],
  yLabels: ["$0", "$10K", "$20K", "$30K", "$40K", "$50K"],
  rightYLabels: [],
  leftDomain: [0, 50000],
};

const CAMPAIGN_REVENUE = [
  { name: "FanDuel - All Formats", amount: "$5,000", pct: "42%", barWidth: "55%", type: "CPM · 12 creators", typeColor: "#0162FF" },
  { name: "FanDuel - All Formats", amount: "$5,000", pct: "25%", barWidth: "36%", type: "Retainer · 4 creators", typeColor: "#FB923C" },
  { name: "G Fuel Meme Clips", amount: "$5,000", pct: "33%", barWidth: "24%", type: "CPM · 12 creators", typeColor: "#0162FF" },
  { name: "G Fuel Meme Clips", amount: "$5,000", pct: "33%", barWidth: "15%", type: "CPM · 12 creators", typeColor: "#0162FF" },
];

const RECENT_TX = [
  { date: "Feb 18", desc: "CPM payout - 171.9K views", campaign: "Gambling Summer Push", amount: "$139.75", status: "Pending", statusBg: "rgba(229,113,0,0.08)", statusColor: "#E57100" },
  { date: "Feb 18", desc: "CPM payout - 171.9K views", campaign: "Gambling Summer Push", amount: "$139.75", status: "Paid", statusBg: "rgba(52,211,153,0.08)", statusColor: "#34D399" },
  { date: "Feb 18", desc: "CPM payout - 171.9K views", campaign: "Gambling Summer Push", amount: "$139.75", status: "Pending", statusBg: "rgba(229,113,0,0.08)", statusColor: "#E57100" },
  { date: "Feb 18", desc: "CPM payout - 171.9K views", campaign: "Gambling Summer Push", amount: "$139.75", status: "Paid", statusBg: "rgba(52,211,153,0.08)", statusColor: "#34D399" },
  { date: "Feb 18", desc: "CPM payout - 171.9K views", campaign: "Gambling Summer Push", amount: "$139.75", status: "Pending", statusBg: "rgba(229,113,0,0.08)", statusColor: "#E57100" },
];

const CLIENT_HEALTH = [
  { name: "BetKing Corp", subtitle: "Always on time · 4 invoices paid", rating: "Excellent", ratingColor: "#34D399" },
  { name: "BetKing Corp", subtitle: "Always on time · 4 invoices paid", rating: "Good", ratingColor: "#34D399" },
  { name: "BetKing Corp", subtitle: "Always on time · 4 invoices paid", rating: "Good", ratingColor: "#34D399" },
  { name: "BetKing Corp", subtitle: "$15,000 overdue · 0/5 invoices paid", rating: "At Risk", ratingColor: "#FB7185", subtitleColor: "rgba(251,113,133,0.6)" },
  { name: "BetKing Corp", subtitle: "Always on time · 4 invoices paid", rating: "Good", ratingColor: "#34D399" },
];

const UPCOMING_PAYOUTS = [
  { date: "Mar 10, 2026", amount: "$8,450.00", desc: "Creator payouts for Gambling Summer Push", tags: ["32 creators"] },
  { date: "Mar 10, 2026", amount: "$8,450.00", desc: "Creator payouts for Gambling Summer Push", tags: ["15 creators"] },
  { date: "Mar 10, 2026", amount: "$8,450.00", desc: "Creator payouts for Gambling Summer Push", tags: ["47 creators", "Recurring"] },
];

function StatCardContent({ s }: { s: typeof OVERVIEW_STATS[number] }) {
  return (
    <>
      <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>{s.label}</span>
      <div className="flex items-baseline justify-between gap-3">
        <span className={cn("font-inter text-[24px] font-medium leading-none tracking-[-0.02em]", s.valueColor ? "" : "text-page-text")} style={s.valueColor ? { color: s.valueColor } : undefined}>
          {s.value}
        </span>
        {s.change && (
          <span className="font-inter text-[12px] font-medium leading-none tracking-[-0.02em]" style={{ color: s.changeColor }}>
            {s.change}
          </span>
        )}
        {s.secondary && (
          <span className={cn("font-inter text-[12px] font-medium leading-none tracking-[-0.02em]", muted)}>
            {s.secondary}
          </span>
        )}
      </div>
    </>
  );
}

function FinanceOverview() {
  const [chartToggle, setChartToggle] = useState<"GMV" | "Total revenue">("GMV");
  const [activityTab, setActivityTab] = useState<"Withdrawals" | "Deposits" | "Deductions">("Withdrawals");
  const [timeframe, setTimeframe] = useState<typeof TIMEFRAME_OPTIONS[number]>("Last month");
  const activityRef = useRef<HTMLDivElement>(null);
  const activityHover = useProximityHover(activityRef);
  const activityRect = activityHover.activeIndex !== null ? activityHover.itemRects[activityHover.activeIndex] : null;

  const txRef = useRef<HTMLDivElement>(null);
  const txHover = useProximityHover(txRef);
  const txRect = txHover.activeIndex !== null ? txHover.itemRects[txHover.activeIndex] : null;

  const healthRef = useRef<HTMLDivElement>(null);
  const healthHover = useProximityHover(healthRef);
  const healthRect = healthHover.activeIndex !== null ? healthHover.itemRects[healthHover.activeIndex] : null;

  useEffect(() => { activityHover.measureItems(); }, [activityHover.measureItems, activityTab]);
  useEffect(() => { txHover.measureItems(); }, [txHover.measureItems]);
  useEffect(() => { healthHover.measureItems(); }, [healthHover.measureItems]);

  return (
    <div className="flex flex-col gap-2">
      {/* Whop Integration Card */}
      <WhopIntegrationCard />

      {/* 4 Stat Cards — grid on desktop */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {OVERVIEW_STATS.map((s) => (
          <div key={s.label} className={cn(cardBase, "h-20 flex-1 gap-3")}>
            <StatCardContent s={s} />
          </div>
        ))}
      </div>

      {/* Revenue Chart Card */}
      <div className={cn(cardBase, "gap-4 p-4")}>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            {/* GMV / Total revenue toggle */}
            <div className="flex items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5">
              {(["GMV", "Total revenue"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setChartToggle(t)}
                  className={cn(
                    "flex h-8 cursor-pointer items-center rounded-[10px] px-4 font-inter text-[14px] font-medium leading-[120%] tracking-[-0.02em] transition-all",
                    chartToggle === t
                      ? "bg-card-bg text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                      : "text-page-text-subtle",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="font-inter text-[48px] font-medium leading-none tracking-[-0.02em] text-page-text">
              $47.8K
            </span>
          </div>
          {/* Date picker dropdown */}
          <AnalyticsPocSelect
            value={timeframe}
            onValueChange={(v) => setTimeframe(v as typeof timeframe)}
            options={TIMEFRAME_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
          />
        </div>

        {/* Chart */}
        <AnalyticsPocChartPlaceholder
          variant="line"
          chartStylePreset="performance-main"
          lineChart={REVENUE_CHART_DATA}
          activeLineDataset="daily"
          visibleMetricKeys={["views"]}
          heightClassName="h-[200px]"
        />
      </div>

      {/* 3 Bottom Stat Cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {BOTTOM_STATS.map((s) => (
          <div key={s.label} className={cn(cardBase, "h-[61px] flex-1 gap-2 p-3")}>
            <div className="flex items-center justify-between">
              <span className="font-inter text-[14px] font-medium leading-[120%] tracking-[-0.02em] text-page-text">{s.value}</span>
              <span className="font-inter text-[12px] font-medium leading-none tracking-[-0.02em] text-[#34D399]">{s.change}</span>
            </div>
            <div className="flex items-center justify-between gap-1.5">
              <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>{s.label}</span>
              <span className={cn("font-inter text-[12px] font-medium leading-none tracking-[-0.02em]", muted)}>{s.secondary}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity (Withdrawals) Table */}
      <div className={cn(cardBase, "p-0")}>
        <div className="flex items-center justify-between px-4 py-4">
          <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>Recent activity</span>
          <div className="flex items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5">
            {(["Withdrawals", "Deposits", "Deductions"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActivityTab(t)}
                className={cn(
                  "flex h-7 cursor-pointer items-center rounded-[10px] px-3 font-inter text-[12px] font-medium tracking-[-0.02em] transition-all",
                  activityTab === t
                    ? "bg-card-bg text-page-text shadow-[0px_1px_2px_rgba(0,0,0,0.06)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
                    : "text-page-text-subtle hover:text-page-text",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {/* Table header */}
        <div className="overflow-x-auto scrollbar-hide">
        <div className="flex min-w-[700px] border-b border-border dark:border-foreground/[0.03] px-1">
          <div className="flex w-[128px] items-center px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Amount</span></div>
          <div className="flex w-[96px] items-center py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Status</span></div>
          <div className="flex w-[128px] items-center px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Sent to</span></div>
          <div className="flex w-[128px] items-center px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Initiated at</span></div>
          <div className="flex w-[128px] items-center px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Estimated arrival</span></div>
          <div className="flex flex-1 items-center justify-end py-3 pr-5">
            <span className={cn("font-inter text-[12px] font-medium leading-[120%] tracking-[-0.02em]", muted)}>Receipt</span>
          </div>
        </div>
        {/* Table rows */}
        <div ref={activityRef} className="relative min-w-[700px]">
          {activityRect && (
            <motion.div className="pointer-events-none absolute inset-x-0 z-0 bg-foreground/[0.04]" initial={false} animate={{ top: activityRect.top, height: activityRect.height, opacity: 1 }} transition={springs.moderate} />
          )}
          {WITHDRAWAL_ROWS.map((row, i) => (
            <div key={i} data-proximity-item className="relative z-10 flex items-center border-b border-foreground/[0.03] px-1 last:border-b-0">
              <div className="flex w-[128px] items-center px-3 py-3">
                <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">{row.amount}</span>
              </div>
              <div className="flex w-[96px] items-center py-3">
                <span className="inline-flex items-center gap-1 rounded-full py-2 pl-1.5 pr-2" style={{ background: row.statusBg }}>
                  <StatusIcon status={row.status} color={row.statusColor} />
                  <span className="font-inter text-[12px] font-medium tracking-[-0.02em]" style={{ color: row.statusColor }}>{row.status}</span>
                </span>
              </div>
              <div className="flex w-[128px] items-center px-3 py-3">
                <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">{row.sentTo}</span>
              </div>
              <div className="flex w-[128px] items-center px-3 py-3">
                <span className={cn("font-inter text-[12px] font-medium leading-[120%] tracking-[-0.02em]", muted)}>{row.initiated}</span>
              </div>
              <div className="flex w-[128px] items-center px-3 py-3">
                <span className={cn("font-inter text-[12px] font-medium leading-[120%] tracking-[-0.02em]", muted)}>{row.arrival}</span>
              </div>
              <div className="flex flex-1 items-center justify-end py-3 pr-5">
                <span className="flex items-center gap-1.5">
                  <span className={cn("font-inter text-[12px] font-medium leading-[120%] tracking-[-0.02em]", muted)}>Download</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-page-text-muted opacity-60"><path d="M6 8l4-0M10 6l0 4" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round"/></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Campaign row from Figma spec */}
      <div className={cn(cardBase, "p-0")}>
        {/* Table header */}
        <div className="flex border-b border-border dark:border-foreground/[0.03] px-1">
          <div className="flex w-[240px] items-center px-5 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Campaign</span></div>
          <div className="flex w-[200px] items-center py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Client email</span></div>
          <div className="flex w-[128px] items-center px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Model</span></div>
          <div className="flex w-[128px] items-center px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Monthly Value</span></div>
          <div className="flex w-[128px] items-center px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Collected</span></div>
          <div className="flex w-[128px] items-center px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Outstanding</span></div>
          <div className="flex flex-1 items-center justify-end py-3 pr-5"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Status</span></div>
        </div>
        {/* Campaign row */}
        <div className="flex items-center border-b border-foreground/[0.03] px-1">
          <div className="flex w-[240px] flex-col justify-center gap-1.5 px-5 py-3">
            <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">Gambling Summer Push</span>
            <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>BetKing Corp</span>
          </div>
          <div className="flex w-[200px] items-center py-3">
            <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text">partnerships@betking.com</span>
          </div>
          <div className="flex w-[128px] items-center px-3 py-3">
            <span className={cn("font-inter text-[12px] font-medium leading-[120%] tracking-[-0.02em]", muted)}>$1,000 Per video</span>
          </div>
          <div className="flex w-[128px] items-center px-3 py-3">
            <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">$20,000</span>
          </div>
          <div className="flex w-[128px] items-center px-3 py-3">
            <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-[#34D399]">$10,000</span>
          </div>
          <div className="flex w-[128px] items-center px-3 py-3">
            <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text">$0.00</span>
          </div>
          <div className="flex flex-1 items-center justify-end py-3 pr-5">
            <span className="inline-flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-2" style={{ background: "rgba(0,153,77,0.08)" }}>
              <StatusIcon status="Active" color="#34D399" />
              <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-[#34D399]">Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Two-column: Revenue bar chart + Revenue by campaign */}
      <div className="flex items-stretch gap-2">
        {/* Revenue/Profit bar chart */}
        <div className={cn(cardBase, "flex-1 gap-4 p-4")}>
          <div className="flex flex-col gap-2">
            <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>Avg revenue/profit by month</span>
            <div className="flex items-center gap-2">
              <div className="flex h-6 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white px-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-transparent">
                <div className="size-2 rounded-full bg-[#ED1285]" />
                <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text">Revenue</span>
                <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-[#ED1285]">$35.4K</span>
              </div>
              <div className="flex h-6 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white px-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-transparent">
                <div className="size-2 rounded-full bg-[#00994D]" />
                <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text">Net profit</span>
                <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-[#00994D]">$23.3K</span>
              </div>
            </div>
          </div>
          {/* Bar chart */}
          <div className="flex gap-4">
            {/* Y-axis */}
            <div className="flex h-[212px] flex-col justify-between">
              {["100k","75k","50k","25k","10k","0"].map((l) => (
                <span key={l} className={cn("font-inter text-[10px] leading-[120%] text-right", muted)}>{l}</span>
              ))}
            </div>
            {/* Bars */}
            <div className="flex flex-1 items-end justify-between gap-6">
              {BAR_MONTHS.map((m, i) => (
                <div key={m} className="group/bar relative flex flex-col items-center gap-2">
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute -top-[68px] left-1/2 z-20 hidden -translate-x-1/2 flex-col gap-1 rounded-xl border border-foreground/[0.06] bg-white px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group-hover/bar:flex dark:border-[rgba(224,224,224,0.06)] dark:bg-[#232323]">
                    <span className="whitespace-nowrap text-center font-inter text-[10px] font-medium tracking-[-0.02em] text-page-text-muted">{m}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="size-1.5 rounded-full bg-[#ED1285]" />
                      <span className="whitespace-nowrap font-inter text-[11px] font-medium tracking-[-0.02em] text-[#ED1285]">{BAR_REVENUE[i]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-1.5 rounded-full bg-[#00994D]" />
                      <span className="whitespace-nowrap font-inter text-[11px] font-medium tracking-[-0.02em] text-[#00994D]">{BAR_PROFIT[i]}</span>
                    </div>
                  </div>
                  <div className="relative w-7 cursor-pointer transition-opacity group-hover/bar:opacity-100" style={{ height: BAR_HEIGHTS[i] }}>
                    <div className="absolute inset-x-0 top-0 rounded-lg border border-white transition-[background] group-hover/bar:!bg-[rgba(237,18,133,0.5)] dark:border-[var(--card-bg,#1C1C1C)]" style={{ height: BAR_HEIGHTS[i], background: "rgba(237,18,133,0.3)" }} />
                    <div className="absolute inset-x-0 bottom-0 rounded-lg border border-white transition-[background] group-hover/bar:!bg-[rgba(0,153,77,0.5)] dark:border-[var(--card-bg,#1C1C1C)]" style={{ height: PROFIT_HEIGHTS[i], background: "rgba(0,153,77,0.3)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between pl-9">
            {BAR_MONTHS.map((m) => (
              <span key={m} className={cn("font-inter text-[10px] leading-[120%] text-center", muted)}>{m}</span>
            ))}
          </div>
        </div>

        {/* Revenue by campaign */}
        <div className={cn(cardBase, "relative flex w-[400px] shrink-0 flex-col gap-4 p-4")}>
          <div className="flex items-center justify-between">
            <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>Revenue by campaign</span>
            <div className="flex items-center gap-1">
              <span className={cn("font-inter text-[12px] tracking-[-0.02em]", muted)}>$836.50 fees</span>
              <svg width="12" height="12" viewBox="0 0 12 12" className="text-page-text-muted opacity-60"><circle cx="6" cy="6" r="5" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/><path d="M6 5.5V8.5M6 3.5h.005" stroke="var(--card-bg, white)" strokeWidth="1" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div className="scrollbar-hide flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {CAMPAIGN_REVENUE.map((c, i) => (
              <div key={i} className={cn(cardBase, "gap-2 p-3")}>
                <div className="flex items-start justify-between">
                  <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">{c.name}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">{c.amount}</span>
                    <span className={cn("font-inter text-[10px] font-medium tracking-[-0.02em]", muted)}>{c.pct}</span>
                  </div>
                </div>
                <div className="h-1 w-full rounded-full bg-foreground/[0.06]">
                  <div className="h-full rounded-full bg-foreground" style={{ width: c.barWidth }} />
                </div>
                <span className="font-inter text-[12px] tracking-[-0.02em]" style={{ color: c.typeColor }}>{c.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column: Recent transactions + Client payment health */}
      <div className="flex gap-2">
        {/* Recent transactions */}
        <div className={cn(cardBase, "relative flex-1 overflow-hidden p-0")}>
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-card-bg via-card-bg to-transparent" />
          <div className="relative z-10 px-4 py-4">
            <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>Recent transactions</span>
          </div>
          {/* Table header */}
          <div className="relative z-10 flex border-b border-border dark:border-foreground/[0.03] px-1">
            <div className="flex w-20 items-center px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Date</span></div>
            <div className="flex flex-1 items-center py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Client</span></div>
            <div className="flex flex-1 items-center py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Campaign</span></div>
            <div className="flex w-24 items-center justify-end px-3 py-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Amount</span></div>
            <div className="flex w-[128px] items-center justify-end py-3 pr-3"><span className={cn("font-inter text-[12px] font-medium tracking-[-0.02em]", muted)}>Status</span></div>
          </div>
          <div ref={txRef} className="relative z-10">
            {txRect && (
              <motion.div className="pointer-events-none absolute inset-x-0 z-0 bg-foreground/[0.04]" initial={false} animate={{ top: txRect.top, height: txRect.height, opacity: 1 }} transition={springs.moderate} />
            )}
            {RECENT_TX.map((tx, i) => (
              <div key={i} data-proximity-item className="relative z-10 flex items-center border-b border-foreground/[0.03] px-1 last:border-b-0">
                <div className="flex w-20 items-center px-3 py-3.5">
                  <span className={cn("font-inter text-[12px] font-medium leading-[120%] tracking-[-0.02em]", muted)}>{tx.date}</span>
                </div>
                <div className="flex flex-1 items-center py-3.5">
                  <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text">{tx.desc}</span>
                </div>
                <div className="flex flex-1 items-center py-3.5">
                  <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text">{tx.campaign}</span>
                </div>
                <div className="flex w-24 items-center justify-end px-3 py-3.5">
                  <span className="font-inter text-[12px] tracking-[-0.02em] text-page-text">{tx.amount}</span>
                </div>
                <div className="flex w-[128px] items-center justify-end py-3.5 pr-3">
                  <span className="inline-flex items-center gap-1 rounded-full py-2 pl-1.5 pr-2" style={{ background: tx.statusBg }}>
                    {tx.status === "Paid" ? (
                      <StatusIcon status={tx.status} color={tx.statusColor} />
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill={tx.statusColor}><path fillRule="evenodd" clipRule="evenodd" d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 3a.5.5 0 01.5.5V6h.5a.5.5 0 010 1h-1a.5.5 0 01-.5-.5v-2A.5.5 0 016 4z"/></svg>
                    )}
                    <span className="font-inter text-[12px] font-medium tracking-[-0.02em]" style={{ color: tx.statusColor }}>{tx.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client payment health */}
        <div className={cn(cardBase, "relative w-[400px] shrink-0 gap-4 overflow-hidden p-4")}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-card-bg via-card-bg to-transparent" />
          <div className="relative z-10 flex items-center justify-between">
            <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>Client payment health</span>
          </div>
          <div ref={healthRef} className="relative z-10 flex flex-col gap-2">
            {healthRect && (
              <motion.div className="pointer-events-none absolute z-0 rounded-2xl bg-foreground/[0.04]" initial={false} animate={{ top: healthRect.top, left: healthRect.left, width: healthRect.width, height: healthRect.height, opacity: 1 }} transition={springs.moderate} />
            )}
            {CLIENT_HEALTH.map((c, i) => (
              <div key={i} data-proximity-item className={cn(cardBase, "relative z-10 flex-row items-center gap-3 p-3")}>
                <div className="size-6 shrink-0 rounded-full bg-gradient-to-br from-pink-300 to-purple-400" />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text">{c.name}</span>
                  <span className={cn("font-inter text-[12px] tracking-[-0.02em]", c.subtitleColor ? "" : "text-page-text-muted")} style={c.subtitleColor ? { color: c.subtitleColor } : undefined}>{c.subtitle}</span>
                </div>
                <span className="shrink-0 font-inter text-[12px] font-medium tracking-[-0.02em]" style={{ color: c.ratingColor }}>{c.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Payouts */}
      <div className={cn(cardBase, "gap-4 p-4")}>
        <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>Client payment health</span>
        <div className="flex gap-4">
          {UPCOMING_PAYOUTS.map((p, i) => (
            <div key={i} className={cn(cardBase, "flex-1 flex-row items-start justify-between gap-2 p-4")}>
              <div className="flex flex-1 flex-col gap-3">
                <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>{p.date}</span>
                <span className="font-inter text-[16px] font-medium leading-[120%] tracking-[-0.02em] text-page-text">{p.amount}</span>
                <div className="flex flex-col gap-2">
                  <span className={cn("font-inter text-[12px] leading-none tracking-[-0.02em]", muted)}>{p.desc}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {p.tags.map((tag) => (
                  <span key={tag} className="flex h-6 items-center gap-1 rounded-full bg-foreground/[0.04] px-2 font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text-muted">
                    {tag === "Recurring" && (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M2.02142 7C2.66199 7.61793 3.54474 8 4.5 8C6.433 8 8 6.433 8 4.5C8 4.22386 8.22386 4 8.5 4C8.77614 4 9 4.22386 9 4.5C9 6.98528 6.98528 9 4.5 9C3.36176 9 2.30391 8.57686 1.49994 7.8779V8.5C1.49994 8.77614 1.27608 9 0.999939 9C0.723796 9 0.499939 8.77614 0.499939 8.5V6.875C0.499939 6.39175 0.89169 6 1.37494 6H2.87494C3.15108 6 3.37494 6.22386 3.37494 6.5C3.37494 6.77614 3.15108 7 2.87494 7H2.02142Z" fill="currentColor" fillOpacity="0.7" /><path d="M1 4.5C1 4.77614 0.776142 5 0.5 5C0.223858 5 0 4.77614 0 4.5C0 2.01472 2.01472 0 4.5 0C5.64098 0 6.70118 0.425178 7.50586 1.12715V0.5C7.50586 0.223858 7.72972 0 8.00586 0C8.282 0 8.50586 0.223858 8.50586 0.5V2.125C8.50586 2.60825 8.11411 3 7.63086 3H6.00586C5.72972 3 5.50586 2.77614 5.50586 2.5C5.50586 2.22386 5.72972 2 6.00586 2H6.97858C6.33801 1.38207 5.45526 1 4.5 1C2.567 1 1 2.567 1 4.5Z" fill="currentColor" fillOpacity="0.7" /></svg>
                    )}
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinanceEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-20">
      <div className="flex size-14 items-center justify-center rounded-full border border-foreground/[0.06] bg-white shadow-[0_0_0_2px_#fff] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-[0_0_0_2px_#191919]">
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" className="text-foreground/70">
          <path d="M11.5634 11.5799C11.6 11.2593 11.4292 10.9316 11.1078 10.9024C11.102 10.9019 11.0961 10.9014 11.0903 10.9009L6.19669 10.5131C5.65686 10.4704 5.11351 10.5323 4.5996 10.6952L0.697834 11.932C0.28233 12.0637 0 12.4494 0 12.8852V18.0199C0 18.5721 0.447715 19.0199 1 19.0199H1.83831L1.85056 19.0237C1.95989 19.0574 2.11685 19.1047 2.31199 19.1604C2.70161 19.2716 3.24688 19.4174 3.87145 19.5561C5.09069 19.8267 6.72522 20.0966 8.0994 19.9661C9.56966 19.8264 11.3876 19.1358 12.958 18.4236C14.5608 17.6966 16.0337 16.8864 16.8515 16.4189C17.5815 16.0016 18 15.2562 18 14.472C18 12.9261 16.557 12.5558 15 13L12.5 13.75C11.5 15 10.9507 15.3157 9.37508 15.6528L8.11706 15.922C7.73686 16.0033 7.36136 15.7659 7.27184 15.3875C7.17955 14.9975 7.42596 14.6078 7.81793 14.5239L9.04581 14.2612C10.4015 13.9711 11.4132 12.8936 11.5634 11.5799Z" fill="currentColor"/>
          <path d="M15 5.5C15 7.433 13.433 9 11.5 9C9.567 9 8 7.433 8 5.5C8 3.567 9.567 2 11.5 2C13.433 2 15 3.567 15 5.5Z" fill="currentColor"/>
          <path d="M6.20355 6.98762C6.07093 6.51447 6 6.01551 6 5.5C6 3.48869 7.07963 1.72953 8.69097 0.770439C8.09124 0.288427 7.3293 0 6.5 0C4.567 0 3 1.567 3 3.5C3 5.33315 4.4093 6.83714 6.20355 6.98762Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <h2 className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">
          No withdrawals yet
        </h2>
        <p className="max-w-[411px] text-center font-inter text-base leading-[150%] tracking-[-0.02em] text-foreground/70">
          When you withdraw money from Content Rewards, it will be displayed here.
        </p>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Overview");
  const [hasData] = useState(true);

  return (
    <PageShell
      title=""
      actions={<FinanceHeader activeTab={activeTab} onTabChange={setActiveTab} />}
      fullWidthActions
    >
      {!hasData ? (
        <FinanceEmptyState />
      ) : (
        <>
          {activeTab === "Overview" && <FinanceOverview />}

          {activeTab === "Campaigns" && (
            <div className="flex flex-col gap-5">
              {/* Whop Integration Card */}
              <WhopIntegrationCard />

              {/* Campaigns Table */}
              <CampaignsTable />
            </div>
          )}

          {activeTab === "Invoices" && (
            <InvoicesTab />
          )}
        </>
      )}
    </PageShell>
  );
}
