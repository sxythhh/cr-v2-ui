// @ts-nocheck
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { CentralIcon } from "@central-icons-react/all";
import { StatusIcon, CheckCircleIcon, type StatusIconType } from "@/components/admin/status-icons";
import { Filters, createFilter, type Filter, type FilterFieldConfig } from "@/components/admin/filters";
import { useToast } from "@/components/admin/toast";
import { EmptyState } from "@/components/admin/empty-state";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { AuditLogSheet } from "@/components/admin/audit-log-sheet";
import { AdminTable, type AdminColumn } from "@/components/admin/admin-table";
import { springs } from "@/lib/springs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const ciProps = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const USERS = [
  { name: "Brad", handle: "@bradussy", avatar: "https://i.pravatar.cc/40?u=brad", status: "Active", submissions: 2046, earned: 112056, trustScore: 0 },
  { name: "JCENTERPRISES", handle: "@jcenterprisesmedia", avatar: "https://i.pravatar.cc/40?u=jcent", status: "Active", submissions: 1178, earned: 54372, trustScore: 0 },
  { name: "messy", handle: "@limpdriving", avatar: "https://i.pravatar.cc/40?u=messy", status: "Blacklisted", submissions: 4, earned: 49249, trustScore: 48 },
  { name: "Steve", handle: "@stramedia", avatar: "https://i.pravatar.cc/40?u=steve", status: "Active", submissions: 702, earned: 44044, trustScore: 31 },
  { name: "Mazzik", handle: "@kgcteam", avatar: "https://i.pravatar.cc/40?u=mazzik", status: "Active", submissions: 457, earned: 40512, trustScore: 51 },
  { name: "Rich $", handle: "@imanobody", avatar: "https://i.pravatar.cc/40?u=rich", status: "Active", submissions: 1899, earned: 38085, trustScore: 4 },
  { name: "Devin", handle: "@heyydevin", avatar: "https://i.pravatar.cc/40?u=devin", status: "Blacklisted", submissions: 108, earned: 36825, trustScore: 0 },
  { name: "xKaizen", handle: "@xkaizen", avatar: "https://i.pravatar.cc/40?u=xkaizen", status: "Active", submissions: 3201, earned: 28900, trustScore: 72 },
  { name: "NightOwlEdits", handle: "@nightowledits", avatar: "https://i.pravatar.cc/40?u=nightowledits", status: "Active", submissions: 1540, earned: 22100, trustScore: 88 },
  { name: "ViralVee", handle: "@viralvee", avatar: "https://i.pravatar.cc/40?u=viralvee", status: "Active", submissions: 890, earned: 19500, trustScore: 65 },
  { name: "Cryptoclipz", handle: "@cryptoclipz", avatar: "https://i.pravatar.cc/40?u=cryptoclipz", status: "Active", submissions: 620, earned: 15200, trustScore: 92 },
  { name: "TechTalksDaily", handle: "@techtalksdaily", avatar: "https://i.pravatar.cc/40?u=techtalksdaily", status: "Blacklisted", submissions: 45, earned: 8900, trustScore: 12 },
];

/* ------------------------------------------------------------------ */
/*  Avatar with gradient placeholder                                   */
/* ------------------------------------------------------------------ */

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
];

function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="shrink-0 flex items-center justify-center rounded-full text-[10px] font-semibold text-white select-none"
      style={{
        width: 24,
        height: 24,
        background: GRADIENTS[index % GRADIENTS.length],
        border: "1px solid var(--border-color)",
      }}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Columns definition                                                 */
/* ------------------------------------------------------------------ */

type Column = AdminColumn;

const DEFAULT_COLUMNS: AdminColumn[] = [
  { key: "user", label: "User", sortable: true, width: "minmax(160px, 2fr)" },
  { key: "status", label: "Status", width: "100px" },
  { key: "submissions", label: "Submissions", sortable: true, width: "120px" },
  { key: "earned", label: "Earned", sortable: true, width: "120px" },
  { key: "trustScore", label: "Trust Score", sortable: true, width: "140px" },
];

/* ── Drag grip SVG ── */
function GripIcon() {
  return (
    <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
      <path d="M1.5 12C2.32843 12 3 12.6716 3 13.5C3 14.3284 2.32843 15 1.5 15C0.67157 15 0 14.3284 0 13.5C0 12.6716 0.67157 12 1.5 12ZM7.5 12C8.3284 12 9 12.6716 9 13.5C9 14.3284 8.3284 15 7.5 15C6.6716 15 6 14.3284 6 13.5C6 12.6716 6.6716 12 7.5 12ZM1.5 6C2.32843 6 3 6.67157 3 7.5C3 8.3284 2.32843 9 1.5 9C0.67157 9 0 8.3284 0 7.5C0 6.67157 0.67157 6 1.5 6ZM7.5 6C8.3284 6 9 6.67157 9 7.5C9 8.3284 8.3284 9 7.5 9C6.6716 9 6 8.3284 6 7.5C6 6.67157 6.6716 6 7.5 6ZM1.5 0C2.32843 0 3 0.67157 3 1.5C3 2.32843 2.32843 3 1.5 3C0.67157 3 0 2.32843 0 1.5C0 0.67157 0.67157 0 1.5 0ZM7.5 0C8.3284 0 9 0.67157 9 1.5C9 2.32843 8.3284 3 7.5 3C6.6716 3 6 2.32843 6 1.5C6 0.67157 6.6716 0 7.5 0Z" fill="var(--fg)" />
    </svg>
  );
}

/* ── Visibility checkmark SVG ── */
function ColCheckIcon() {
  return (
    <svg width="10" height="9" viewBox="0 0 10 9" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.07353 0.135741C9.45885 0.387426 9.56719 0.903819 9.31551 1.28914L4.5989 8.51015C4.4656 8.71422 4.24964 8.84971 4.0079 8.88091C3.76615 8.91212 3.52286 8.83592 3.34212 8.67239L0.274244 5.89667C-0.0670378 5.5879 -0.0933855 5.06092 0.215394 4.71964C0.524175 4.37835 1.05115 4.35201 1.39244 4.66079L3.73696 6.78203L7.92013 0.377714C8.17182 -0.00760774 8.68821 -0.115943 9.07353 0.135741Z" fill="var(--fg)" />
    </svg>
  );
}

/* ── Column Manager Dropdown with drag reorder ── */
function ColumnManager({
  columns,
  visibleKeys,
  onReorder,
  onToggleVisibility,
}: {
  columns: Column[];
  visibleKeys: Set<string>;
  onReorder: (cols: Column[]) => void;
  onToggleVisibility: (key: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 rounded-lg px-3 cursor-pointer"
          style={{
            height: 32,
            background: "var(--card-bg)",
            color: "var(--fg)",
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0px 1px 2px rgba(0,0,0,0.05), inset 0px 0px 0px 1px var(--border-color)",
          }}
        >
          <CentralIcon name="IconLayoutColumn" size={16} color="currentColor" {...ciProps} />
          Edit
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-[10px]">
        <div className="px-3 py-1.5 text-xs font-medium text-page-text-muted">Columns</div>
        {columns.map((col) => {
          const visible = visibleKeys.has(col.key);
          return (
            <DropdownMenuItem
              key={col.key}
              onClick={(e) => { e.preventDefault(); onToggleVisibility(col.key); }}
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer justify-between rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              {col.label}
              {visible && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0"><path d="M3 7L5.5 9.5L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------------------------------------------ */
/*  Status filter dropdown                                             */
/* ------------------------------------------------------------------ */

type StatusVariant = "green" | "red" | "yellow" | "blue" | "neutral";

interface StatusOption {
  label: string;
  variant: StatusVariant;
  icon: StatusIconType;
}

const STATUS_OPTIONS: StatusOption[] = [
  { label: "Succeeded", variant: "green", icon: "check" },
  { label: "Pending", variant: "neutral", icon: "clock" },
  { label: "Failed", variant: "red", icon: "x" },
  { label: "Past due", variant: "red", icon: "warning" },
  { label: "Canceled", variant: "red", icon: "x" },
  { label: "Price too low", variant: "red", icon: "x" },
  { label: "Uncollectible", variant: "neutral", icon: "x" },
  { label: "Refunded", variant: "neutral", icon: "refresh" },
  { label: "Auto refunded", variant: "neutral", icon: "refresh" },
  { label: "Partially refunded", variant: "neutral", icon: "refresh" },
  { label: "Dispute warning", variant: "yellow", icon: "warning" },
  { label: "Dispute needs response", variant: "yellow", icon: "warning" },
  { label: "Inquiry needs response", variant: "yellow", icon: "warning" },
  { label: "Resolution needs response", variant: "yellow", icon: "warning" },
  { label: "Dispute under review", variant: "blue", icon: "eye" },
  { label: "Inquiry under review", variant: "blue", icon: "eye" },
  { label: "Resolution under review", variant: "blue", icon: "eye" },
  { label: "Dispute won", variant: "green", icon: "check" },
  { label: "Inquiry closed", variant: "green", icon: "check" },
  { label: "Resolution won", variant: "green", icon: "check" },
  { label: "Dispute lost", variant: "red", icon: "x" },
  { label: "Dispute closed", variant: "red", icon: "x" },
  { label: "Resolution lost", variant: "red", icon: "x" },
  { label: "Drafted", variant: "neutral", icon: "clock" },
  { label: "Incomplete", variant: "neutral", icon: "x" },
  { label: "Unresolved", variant: "neutral", icon: "circle" },
];

const VARIANT_STYLES: Record<StatusVariant, { bg: string; color: string }> = {
  green:   { bg: "rgba(34, 255, 153, 0.118)",  color: "rgba(70, 254, 165, 0.83)" },
  red:     { bg: "rgba(255, 23, 63, 0.176)",   color: "#FF9592" },
  yellow:  { bg: "rgba(250, 130, 0, 0.133)",   color: "#FFCA16" },
  blue:    { bg: "rgba(0, 190, 253, 0.157)",   color: "rgba(82, 225, 254, 0.898)" },
  neutral: { bg: "var(--accent)",  color: "var(--muted-fg)" },
};

function StatusFilterDropdown({
  selected,
  onToggle,
}: {
  selected: Set<string>;
  onToggle: (label: string) => void;
}) {
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
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full px-3 cursor-pointer"
        style={{
          height: 30,
          border: selected.size > 0 ? "1px solid var(--border-color)" : "1px dashed var(--border-color)",
          background: selected.size > 0 ? "var(--accent)" : "transparent",
          color: "var(--muted-fg)",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {selected.size > 0 ? (
          <CheckCircleIcon size={14} color="var(--muted-fg)" />
        ) : (
          <CentralIcon name="IconPlusMedium" size={14} color="currentColor" {...ciProps} className="rotate-45" />
        )}
        Status
        {selected.size > 0 && (
          <span
            className="ml-0.5 flex items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{
              width: 18,
              height: 18,
              background: "#f6850f",
            }}
          >
            {selected.size}
          </span>
        )}
        <CentralIcon
          name="IconChevronBottom"
          size={12}
          color="var(--muted-fg)"
          {...ciProps}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-50 flex flex-col overflow-hidden"
          style={{
            width: 240,
            maxHeight: 360,
            borderRadius: 10,
            background: "var(--dropdown-bg)",
            border: "1px solid var(--dropdown-border)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "var(--dropdown-shadow)",
            padding: 0,
          }}
        >
          <div
            className="overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {STATUS_OPTIONS.map((opt) => {
              const checked = selected.has(opt.label);
              const vs = VARIANT_STYLES[opt.variant];
              return (
                <button
                  key={opt.label}
                  onClick={() => onToggle(opt.label)}
                  className="flex w-full items-center gap-2.5 px-3.5 transition-colors hover:bg-[var(--dropdown-item-hover)]"
                  style={{ height: 32 }}
                >
                  {/* Checkbox */}
                  <div
                    className="relative shrink-0"
                    style={{ width: 16, height: 16 }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: checked ? "var(--dropdown-checkbox-checked)" : "var(--dropdown-checkbox-bg)",
                        borderRadius: 4,
                      }}
                    />
                    {!checked && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(255, 255, 255, 0.01)",
                          boxShadow: "inset 0px 0px 0px 1px var(--dropdown-checkbox-border)",
                          borderRadius: 4,
                        }}
                      />
                    )}
                    {checked && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute inset-0">
                        <path d="M4 8.5L6.5 11L12 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Status badge */}
                  <div
                    className="flex items-center gap-1.5 rounded-[6px] px-2"
                    style={{
                      height: 20,
                      background: vs.bg,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: vs.color,
                        letterSpacing: "0.008px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {opt.label}
                    </span>
                    <StatusIcon type={opt.icon} size={12} color={vs.color} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

const FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    icon: <CentralIcon name="IconCircleCheck" size={14} color="var(--muted-fg)" {...ciProps} />,
    options: [
      { value: "Active", label: "Active" },
      { value: "Blacklisted", label: "Blacklisted" },
    ],
  },
  {
    key: "submissions",
    label: "Submissions",
    type: "select",
    icon: <CentralIcon name="IconArrowInbox" size={14} color="var(--muted-fg)" {...ciProps} />,
    options: [
      { value: "1000+", label: "1,000+" },
      { value: "500+", label: "500+" },
      { value: "100+", label: "100+" },
      { value: "<100", label: "Under 100" },
    ],
  },
  {
    key: "earned",
    label: "Earned",
    type: "select",
    icon: <CentralIcon name="IconFlag1" size={14} color="var(--muted-fg)" {...ciProps} />,
    options: [
      { value: "50000+", label: "$50,000+" },
      { value: "20000+", label: "$20,000+" },
      { value: "10000+", label: "$10,000+" },
      { value: "<10000", label: "Under $10,000" },
    ],
  },
  {
    key: "trustScore",
    label: "Trust Score",
    type: "select",
    icon: <CentralIcon name="IconStar" size={14} color="var(--muted-fg)" {...ciProps} />,
    options: [
      { value: "high", label: "High (70%+)" },
      { value: "medium", label: "Medium (30–70%)" },
      { value: "low", label: "Low (under 30%)" },
    ],
  },
];

/* ── Cell renderer ── */
function CellContent({ colKey, user, index, onEmail, onMessage }: { colKey: string; user: typeof USERS[number]; index: number; onEmail?: (e: React.MouseEvent) => void; onMessage?: (e: React.MouseEvent) => void }) {
  switch (colKey) {
    case "user":
      return (
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={user.avatar} alt="" className="size-8 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium" style={{ color: "var(--fg)" }}>{user.name}</div>
            <div className="truncate text-xs" style={{ color: "var(--muted-fg)" }}>{user.handle}</div>
          </div>
        </div>
      );
    case "status":
      return (
        <div>
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
            style={{
              background: user.status === "Active" ? "rgba(0,178,89,0.15)" : "rgba(255,37,37,0.15)",
              color: user.status === "Active" ? "#00B259" : "#FF2525",
            }}
          >
            {user.status}
          </span>
        </div>
      );
    case "submissions":
      return <span style={{ fontSize: 14, fontWeight: 400, color: "var(--fg)" }}>{user.submissions.toLocaleString()}</span>;
    case "earned":
      return <span style={{ fontSize: 14, fontWeight: 400, color: "var(--fg)" }}>${user.earned.toLocaleString()}</span>;
    case "trustScore":
      return <span style={{ fontSize: 14, fontWeight: 400, color: "var(--fg)" }}>{user.trustScore}%</span>;
    default:
      return null;
  }
}

function UserRow({ user, index, gridTemplate, visibleColumns, page, pageSize, registerHover, onRowClick, onAuditLog }: {
  user: typeof USERS[number]; index: number; gridTemplate: string; visibleColumns: Column[]; page: number; pageSize: number;
  registerHover: (index: number, element: HTMLElement | null) => void; onRowClick: () => void; onAuditLog: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerHover(index, ref.current);
    return () => registerHover(index, null);
  }, [index, registerHover]);

  return (
    <div
      ref={ref}
      data-proximity-index={index}
      onClick={onRowClick}
      className="relative z-[1] flex items-center px-4 cursor-pointer"
      style={{ height: 56, boxShadow: "inset 0px -1px 0px var(--border-color)" }}
    >
      <div className="grid min-w-0 flex-1 items-center" style={{ gridTemplateColumns: gridTemplate }}>
        {visibleColumns.map((col) => (
          <CellContent key={col.key} colKey={col.key} user={user} index={page * pageSize + index} />
      ))}
      </div>
      <button onClick={(e) => { e.stopPropagation(); onAuditLog(); }} className="hidden shrink-0 cursor-pointer items-center gap-1 rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[11px] font-medium text-page-text-muted transition-colors hover:bg-foreground/[0.10] md:flex" title="View audit log">
        <CentralIcon name="IconClock" size={10} color="currentColor" {...ciProps} /> Audit
      </button>
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filter[]>([]);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [auditTarget, setAuditTarget] = useState<{ id: string; name: string } | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set(DEFAULT_COLUMNS.map((c) => c.key)));

  // On mobile, default to fewer columns
  const hasSetMobileDefaults = useRef(false);
  useEffect(() => {
    if (hasSetMobileDefaults.current) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      setVisibleKeys(new Set(["user", "status", "earned"]));
      hasSetMobileDefaults.current = true;
    }
  }, []);

  const toggleVisibility = (key: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredUsers = USERS.filter(user => {
    return filters.every(filter => {
      const field = FILTER_FIELDS.find(f => f.key === filter.field);
      if (!field) return true;
      if (filter.field === "status") {
        if (Array.isArray(filter.value)) return filter.value.length === 0 || filter.value.includes(user.status);
        return !filter.value || user.status === filter.value;
      }
      if (filter.field === "submissions") {
        const v = filter.value as string;
        if (v === "1000+") return user.submissions >= 1000;
        if (v === "500+") return user.submissions >= 500;
        if (v === "100+") return user.submissions >= 100;
        if (v === "<100") return user.submissions < 100;
      }
      if (filter.field === "earned") {
        const v = filter.value as string;
        if (v === "50000+") return user.earned >= 50000;
        if (v === "20000+") return user.earned >= 20000;
        if (v === "10000+") return user.earned >= 10000;
        if (v === "<10000") return user.earned < 10000;
      }
      if (filter.field === "trustScore") {
        const v = filter.value as string;
        if (v === "high") return user.trustScore >= 70;
        if (v === "medium") return user.trustScore >= 30 && user.trustScore < 70;
        if (v === "low") return user.trustScore < 30;
      }
      return true;
    });
  });

  const visibleColumns = columns.filter((c) => visibleKeys.has(c.key));

  const handleExport = () => {
    const headers = visibleColumns.map(c => c.label).join(",");
    const rows = filteredUsers.map(user => visibleColumns.map(c => {
      switch(c.key) {
        case "user": return user.name;
        case "status": return user.status;
        case "submissions": return user.submissions;
        case "earned": return user.earned;
        case "trustScore": return user.trustScore;
        default: return "";
      }
    }).join(",")).join("\n");
    const csv = headers + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "users.csv"; a.click();
    URL.revokeObjectURL(url);
    toast("Exported to CSV");
  };

  const renderUserCell = useCallback((user: typeof USERS[number], colKey: string, index: number) => {
    switch (colKey) {
      case "user":
        return (
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={user.avatar} alt="" className="size-8 rounded-full object-cover shrink-0" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium" style={{ color: "var(--fg)" }}>{user.name}</div>
              <div className="truncate text-xs" style={{ color: "var(--muted-fg)" }}>{user.handle}</div>
            </div>
          </div>
        );
      case "status":
        return (
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
            style={{
              background: user.status === "Active" ? "rgba(0,178,89,0.15)" : "rgba(255,37,37,0.15)",
              color: user.status === "Active" ? "#00B259" : "#FF2525",
            }}
          >
            {user.status}
          </span>
        );
      case "submissions":
        return <span style={{ fontSize: 14, fontWeight: 400, color: "var(--fg)" }}>{user.submissions.toLocaleString()}</span>;
      case "earned":
        return <span style={{ fontSize: 14, fontWeight: 400, color: "var(--fg)" }}>${user.earned.toLocaleString()}</span>;
      case "trustScore":
        return <span style={{ fontSize: 14, fontWeight: 400, color: "var(--fg)" }}>{user.trustScore}%</span>;
      default:
        return null;
    }
  }, []);

  return (
    <div
      className="flex flex-col h-full font-[var(--font-sans)]"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      {/* ---- Filter Bar ---- */}
      <div
        className="flex flex-wrap sm:flex-nowrap items-center justify-between shrink-0 px-4 gap-2 sm:gap-3 py-2 sm:py-0"
        style={{
          minHeight: 48,
          borderTop: "1px solid var(--border-color)",
        }}
      >
        {/* Left: filters */}
        <Filters filters={filters} fields={FILTER_FIELDS} onChange={(f) => { setFilters(f); setPage(0); }} />

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg px-3 cursor-pointer"
            style={{
              height: 32,
              background: "var(--card-bg)",
              color: "var(--fg)",
              fontSize: 14,
              fontWeight: 500,
              boxShadow: "0px 1px 2px rgba(0,0,0,0.05), inset 0px 0px 0px 1px var(--border-color)",
            }}
          >
            <CentralIcon name="IconCloudDownload" size={16} color="currentColor" {...ciProps} />
            Export
          </button>
          <ColumnManager
            columns={columns}
            visibleKeys={visibleKeys}
            onReorder={setColumns}
            onToggleVisibility={toggleVisibility}
          />
        </div>
      </div>

      {/* ---- Data Table (AdminTable) ---- */}
      <AdminTable
        columns={visibleColumns}
        data={filteredUsers}
        rowKey={(user) => user.handle}
        renderCell={renderUserCell}
        onRowClick={(user) => router.push(`/admin/users/${user.name.toLowerCase().replace(/\s+/g, "")}`)}
        emptyTitle="No users match your filters"
        emptyAction={{ label: "Clear filters", onClick: () => setFilters([]) }}
      />
      {/* Audit Log Sheet */}
      {auditTarget && (
        <AuditLogSheet
          open={!!auditTarget}
          onClose={() => setAuditTarget(null)}
          entityType="user"
          entityId={auditTarget.id}
          entityTitle={auditTarget.name}
        />
      )}
    </div>
  );
}
