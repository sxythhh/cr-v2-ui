// @ts-nocheck
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { CentralIcon } from "@central-icons-react/all";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CheckCircleIcon, ClockCircleIcon } from "@/components/admin/status-icons";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineIndicator,
  TimelineSeparator,
  TimelineHeader,
  TimelineTitle,
  TimelineDate,
} from "@/components/ui/timeline";

const ciProps = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

/* ── Mock payment data (keyed by slug) ── */
const PAYMENTS: Record<string, {
  name: string;
  handle: string;
  email: string;
  amount: string;
  fees: string;
  net: string;
  status: string;
  date: string;
  shortDate: string;
  address: string[];
  card: { brand: string; last4: string };
  product: string;
  payoutNote: string;
}> = {
  mauveorgandy: {
    name: "AI UGC Studio",
    handle: "@aiugcstudio",
    email: "hello@aiugcstudio.io",
    amount: "$7,688.00",
    fees: "-$307.89",
    net: "$7,380.11",
    status: "Succeeded",
    date: "April 4, 2026 at 10:17 AM",
    shortDate: "Apr 4, 10:17 AM",
    address: ["Nevin Tan", "21 Marina Way", "018978 Singapore"],
    card: { brand: "amex", last4: "1000" },
    product: "Virality Clipping",
    payoutNote: "Withdrawable in 2 days",
  },
};

const DEFAULT_PAYMENT = PAYMENTS.mauveorgandy;

/* ── Date popover (reui pattern) ── */
function TimelineDatePopover({ time }: { time: Date }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const localTz =
    Intl.DateTimeFormat().resolvedOptions().timeZone.split("/").pop()?.replace("_", " ") || "Local";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="cursor-default underline decoration-dashed decoration-1 underline-offset-4 outline-none"
          style={{ fontSize: 12, fontWeight: 400, letterSpacing: "0.008px", color: "var(--muted-fg)" }}
        >
          {formatDistanceToNow(time, { addSuffix: true })}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-[340px] p-0"
        align="start"
        sideOffset={6}
        style={{
          background: "var(--dropdown-bg)",
          border: "1px solid var(--dropdown-border)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "var(--dropdown-shadow)",
          borderRadius: 10,
        }}
      >
        <p
          className="border-b px-2.5 py-1.5 font-medium"
          style={{ fontSize: 13, color: "var(--fg)", borderColor: "var(--border-color)" }}
        >
          {formatDistanceToNow(time, { addSuffix: true })}
        </p>
        <div className="px-2.5 py-2">
          <table className="text-[13px]">
            <tbody>
              <tr>
                <td className="pr-4 pb-1.5">
                  <span
                    className="rounded px-1.5 py-0.5 font-medium"
                    style={{ fontSize: 11, background: "var(--accent)", color: "var(--muted-fg)" }}
                  >
                    UTC
                  </span>
                </td>
                <td className="pr-5 pb-1.5" style={{ color: "var(--fg)" }}>
                  {format(time, "MMM d, yyyy")}
                </td>
                <td className="pb-1.5" style={{ color: "var(--muted-fg)" }}>
                  {format(time, "hh:mm:ss a")}
                </td>
              </tr>
              <tr>
                <td className="pr-4">
                  <span
                    className="rounded px-1.5 py-0.5 font-medium"
                    style={{ fontSize: 11, background: "var(--accent)", color: "var(--muted-fg)" }}
                  >
                    {localTz}
                  </span>
                </td>
                <td className="pr-5" style={{ color: "var(--fg)" }}>
                  {format(now, "MMM d, yyyy")}
                </td>
                <td style={{ color: "var(--muted-fg)" }}>
                  {format(now, "hh:mm:ss a")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ── Tiny copy button ── */
function CopyBtn({ text, onCopy }: { text?: string; onCopy?: () => void }) {
  return (
    <button
      onClick={() => {
        if (text) navigator.clipboard.writeText(text);
        onCopy?.();
      }}
      className="flex h-6 w-6 items-center justify-center rounded-[6px] transition-colors hover:bg-[var(--accent)]"
      title="Copy"
    >
      <CentralIcon name="IconSquareBehindSquare1" size={12} color="var(--muted-fg)" {...ciProps} />
    </button>
  );
}

/* ── Card brand icon (inline Amex) ── */
function AmexIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect width="20" height="20" rx="3" fill="#0193CE" />
      <text x="10" y="13" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">AMEX</text>
    </svg>
  );
}

function UsageCard({ onBilling }: { onBilling?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const usage = 18.08;
  const limit = 20;
  const pct = Math.min((usage / limit) * 100, 100);

  const breakdown = [
    { label: "Requests", value: "$210.84" },
    { label: "Active CPU", value: "$21.95" },
    { label: "Events", value: "$21.20" },
    { label: "Storage Usage", value: "$20.45" },
  ];

  return (
    <div className="relative">
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[13px] pt-[13px] pb-2">
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.079px" }}>
            3 days remaining in cycle
          </span>
          <button
            onClick={onBilling}
            className="flex items-center justify-center rounded-lg px-2.5"
            style={{
              height: 28,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--fg)",
              background: "var(--accent)",
              border: "1px solid var(--border-color)",
            }}
          >
            Billing
          </button>
        </div>

        {/* Usage bar */}
        <div className="px-[13px] pb-3">
          <div
            className="rounded-lg p-3 space-y-2"
            style={{ background: "var(--accent)", border: "1px solid var(--border-color)" }}
          >
            <div className="flex justify-between" style={{ fontSize: 13, fontWeight: 500 }}>
              <span>${usage.toFixed(2)} / ${limit}</span>
              <span style={{ color: "var(--muted-fg)" }}>$200</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(246,133,15,0.2)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, background: "#f6850f" }}
              />
            </div>
          </div>
        </div>

        {/* Collapsible breakdown */}
        <div
          className="overflow-hidden transition-all duration-200"
          style={{ maxHeight: expanded ? 200 : 0, opacity: expanded ? 1 : 0 }}
        >
          <div className="flex flex-col gap-2.5 px-[13px] pb-3 pt-1">
            {breakdown.map((item) => (
              <div key={item.label} className="flex justify-between" style={{ fontSize: 12 }}>
                <span style={{ fontWeight: 500, color: "var(--muted-fg)" }}>{item.label}</span>
                <span style={{ fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center justify-center rounded-full shadow-sm"
          style={{
            width: 24,
            height: 24,
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
        >
          <CentralIcon
            name="IconChevronBottom"
            size={12}
            color="var(--muted-fg)"
            {...ciProps}
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}

/* ── More actions dropdown ── */
function MoreActionsDropdown({ toast: showToast }: { toast: (msg: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center rounded-lg cursor-pointer"
          style={{ width: 32, height: 32, background: "var(--accent)" }}
        >
          <CentralIcon name={"IconSpeedDots" as any} size={16} color="var(--fg)" {...ciProps} className="rotate-90" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px] rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-[10px]">
        <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(window.location.href); showToast("Copied"); }} className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-sm font-medium">
          <CentralIcon name="IconSquareBehindSquare1" size={14} color="var(--muted-fg)" {...ciProps} />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.print()} className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-sm font-medium">
          <CentralIcon name="IconFileText" size={14} color="var(--muted-fg)" {...ciProps} />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function PaymentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const p = PAYMENTS[id as string] ?? DEFAULT_PAYMENT;

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--bg)", color: "var(--fg)", scrollbarWidth: "none" }}>
      {/* ─── Top bar: back + amount + actions ─── */}
      <div className="shrink-0 px-4 sm:px-5 pt-3 pb-4">
        {/* Back */}
        <button
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors hover:bg-[var(--accent)]"
          style={{ marginLeft: -12 }}
        >
          <CentralIcon name="IconChevronLeft" size={12} color="var(--muted-fg)" {...ciProps} />
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.079px", color: "var(--muted-fg)" }}>
            Payments
          </span>
        </button>

        {/* Amount row */}
        <div className="mt-3 flex items-center gap-3">
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.705px" }}>
            {p.amount}
          </span>

          {/* Status badge */}
          <span
            className="flex items-center gap-1.5 rounded-[6px] px-2"
            style={{ height: 20, background: "rgba(34, 255, 153, 0.118)" }}
          >
            <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.008px", color: "rgba(70, 254, 165, 0.83)" }}>
              {p.status}
            </span>
            <CheckCircleIcon size={12} color="rgba(70, 254, 165, 0.83)" />
          </span>
        </div>

        {/* Date + action buttons */}
        <div className="mt-1 flex items-center justify-between">
          <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.079px", color: "var(--muted-fg)" }}>
            {p.date}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                confirm({
                  title: "Process refund?",
                  message: `Refund ${p.amount} to customer?`,
                  confirmLabel: "Refund",
                  destructive: true,
                }).then((ok) => { if (ok) toast("Refund initiated"); });
              }}
              className="flex items-center justify-center rounded-lg px-4"
              style={{
                height: 32,
                background: "var(--accent)",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.079px",
                color: "var(--fg)",
              }}
            >
              Refund
            </button>
            <MoreActionsDropdown toast={toast} />
          </div>
        </div>
      </div>

      {/* ─── Two-column content ─── */}
      <div className="flex flex-col md:flex-row gap-5 px-4 sm:px-5 pb-6">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          {/* Payment breakdown card */}
          <div
            className="overflow-hidden"
            style={{
              border: "1px solid var(--border-color)",
              borderRadius: 12,
            }}
          >
            {/* Customer paid */}
            <div
              className="flex items-center justify-between px-[14px]"
              style={{ height: 42, background: "var(--accent)" }}
            >
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.079px" }}>Customer paid</span>
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.079px" }}>{p.amount}</span>
            </div>

            {/* Fees */}
            <div className="flex items-center justify-between px-[14px]" style={{ height: 32 }}>
              <div className="flex items-center gap-1.5">
                <CentralIcon name="IconChevronRight" size={14} color="var(--muted-fg)" {...ciProps} />
                <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.079px", color: "var(--muted-fg)" }}>
                  Fees
                </span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.079px", color: "var(--muted-fg)" }}>
                {p.fees}
              </span>
            </div>

            {/* Net amount */}
            <div
              className="flex items-center justify-between px-[14px]"
              style={{ height: 42, background: "var(--accent)", borderTop: "1px solid var(--border-color)" }}
            >
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.079px" }}>Net amount</span>
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.079px" }}>{p.net}</span>
            </div>
          </div>

          {/* Activity */}
          <div className="mt-8">
            <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.169px" }}>Activity</span>

            {(() => {
              const now = new Date();
              const activity = [
                {
                  id: 1,
                  title: "Payment completed",
                  description: "Payment of " + p.amount + " was successfully processed and confirmed.",
                  icon: <CheckCircleIcon size={16} color="#34D399" />,
                  time: new Date(now.getTime() - 1000 * 60 * 0),
                },
                {
                  id: 2,
                  title: "Payment attempted",
                  description: "Charge attempt initiated on " + p.card.brand.toUpperCase() + " ending in " + p.card.last4 + ".",
                  icon: <ClockCircleIcon size={16} color="#FB923C" />,
                  time: new Date(now.getTime() - 1000 * 60 * 1),
                },
                {
                  id: 3,
                  title: "Payment initiated",
                  description: "Invoice created and payment flow started for " + p.product + ".",
                  icon: <ClockCircleIcon size={16} color="#FB923C" />,
                  time: new Date(now.getTime() - 1000 * 60 * 2),
                },
              ];

              return (
                <Timeline defaultValue={3} className="mt-5 w-full">
                  {activity.map((item) => (
                    <TimelineItem
                      key={item.id}
                      step={item.id}
                      className="ms-10"
                    >
                      <TimelineHeader>
                        <TimelineSeparator className="-left-7 h-[calc(100%-1.5rem-0.25rem)] translate-y-6.5" style={{ background: "var(--border-color)" }} />
                        <TimelineTitle className="mt-0.5" style={{ fontSize: 13.8, fontWeight: 500, letterSpacing: "-0.079px", color: "var(--fg)" }}>
                          {item.title}
                        </TimelineTitle>
                        <TimelineIndicator
                          className="-left-7 flex size-6 items-center justify-center rounded-full border-none"
                          style={{ background: "var(--accent)" }}
                        >
                          {item.icon}
                        </TimelineIndicator>
                      </TimelineHeader>
                      <TimelineContent style={{ fontSize: 13, color: "var(--muted-fg)", letterSpacing: "-0.079px" }}>
                        {item.description}
                        <TimelineDate className="mt-2 mb-0 block">
                          <TimelineDatePopover time={item.time} />
                        </TimelineDate>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              );
            })()}
          </div>
        </div>

        {/* Right column — info cards */}
        <div className="w-full md:w-[340px] shrink-0 space-y-3">
          {/* User card */}
          <div
            className="rounded-xl p-[13px]"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.079px" }}>User</span>

            {/* Avatar + name */}
            <div className="mt-3 flex items-center gap-2">
              <div
                className="h-4 w-4 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500"
                style={{ border: "1px solid var(--border-color)" }}
              />
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.079px", color: "#88B5FF" }}>
                {p.name}
              </span>
            </div>

            {/* Handle */}
            <div className="mt-2 flex items-center gap-1">
              <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.079px" }}>
                {p.handle}
              </span>
              <CopyBtn text={p.handle} onCopy={() => toast("Copied")} />
            </div>

            {/* Email */}
            <div className="mt-1 flex items-center gap-1">
              <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.079px" }}>
                {p.email}
              </span>
              <CopyBtn text={p.email} onCopy={() => toast("Copied")} />
            </div>

            {/* Address */}
            <div className="mt-4">
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.079px" }}>Address</span>
              <div className="mt-2" style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", letterSpacing: "-0.079px" }}>
                {p.address.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment method card */}
          <div
            className="rounded-xl p-[13px]"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.079px" }}>Payment method</span>

            <div className="mt-3 flex items-center gap-2.5">
              <AmexIcon />
              <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.079px" }}>
                •••• {p.card.last4}
              </span>
            </div>
          </div>

          {/* Product card */}
          <div
            className="rounded-xl p-[13px]"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.079px" }}>Product</span>
            <div className="mt-2" style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.079px" }}>
              {p.product}
            </div>
          </div>

          {/* Payout status card */}
          <div
            className="rounded-xl p-[13px]"
            style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.079px" }}>Payout status</span>
            <div className="mt-2 flex items-center gap-2">
              <ClockCircleIcon size={14} color="var(--muted-fg)" />
              <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: "-0.079px", color: "var(--muted-fg)" }}>
                {p.payoutNote}
              </span>
            </div>
          </div>

          {/* Usage / billing card (collapsible) */}
          <UsageCard onBilling={() => toast("Billing page coming soon", "info")} />
        </div>
      </div>
    </div>
  );
}
