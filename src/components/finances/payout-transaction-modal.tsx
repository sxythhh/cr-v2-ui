"use client";

import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

/* ── Icons ── */

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="5.33" y="5.33" width="7.33" height="7.33" rx="1.33" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.33 10.67V4.67c0-.74.6-1.34 1.34-1.34h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M9.33 2.67H13.33V6.67M13.33 2.67L7.33 8.67M12 9.33v3.34c0 .37-.3.66-.67.66H3.33A.67.67 0 012.67 12.67V4.67c0-.37.3-.67.66-.67h3.34" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M14.5 1.5L7.5 8.5M14.5 1.5L9.5 14.5L7.5 8.5L1.5 6.5L14.5 1.5Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Data types ── */

export interface PayoutTransactionData {
  amount: string;
  status: string;
  statusColor?: string;
  type: string;
  refNumber: string;
  client: { name: string; avatar?: string; badge?: "gold" | "silver" };
  campaign: { name: string; avatar?: string };
  creatorAvatars?: string[];
  creatorCount?: number;
  description: string;
  balanceBefore: string;
  transaction: string;
  balanceAfter: string;
  creators: number;
  approvedSubmissions: number;
  breakdown: { label: string; amount: string }[];
  total: string;
  batchId: string;
  initiatedBy: string;
  scheduledDate: string;
  expectedCompletion: string;
  footerNote?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: PayoutTransactionData;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  primaryActionIcon?: React.ReactNode;
}

const RED = "#FF3355";
const GREEN = "#00994D";
const ORANGE = "#E57100";

/* ── Reusable field card ── */

function FieldCard({
  value,
  label,
  valueColor,
  rightIcon,
}: {
  value: React.ReactNode;
  label: React.ReactNode;
  valueColor?: string;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 rounded-2xl border border-foreground/[0.06] bg-card-bg p-3 dark:border-[rgba(224,224,224,0.06)]">
      <span
        className="truncate font-inter text-[14px] font-medium leading-[120%] tracking-[-0.02em]"
        style={{ color: valueColor }}
      >
        {value}
      </span>
      <div className="flex items-center justify-between gap-1.5">
        <span className="min-w-0 truncate font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-page-text-muted">
          {label}
        </span>
        {rightIcon}
      </div>
    </div>
  );
}

function DetailCard({
  label,
  labelRight,
  rightIcon,
  children,
}: {
  label: React.ReactNode;
  labelRight?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)]">
      <div className="flex items-center justify-between gap-1.5">
        <span className="min-w-0 truncate font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-page-text-muted">
          {label}
        </span>
        {labelRight && (
          <span className="shrink-0 font-inter text-[12px] font-medium leading-none tracking-[-0.02em] text-page-text-muted">
            {labelRight}
          </span>
        )}
        {rightIcon}
      </div>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

function LabelWithHint({ label, hint }: { label: string; hint: string }) {
  return (
    <span className="flex items-center justify-between gap-1.5">
      <span className="truncate">{label}</span>
      <span className="shrink-0 font-medium text-page-text-muted">{hint}</span>
    </span>
  );
}

function Avatar({ src, size, ringed }: { src?: string; size: number; ringed?: boolean }) {
  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-full bg-foreground/[0.08]",
        ringed && "ring-2 ring-white dark:ring-card-bg",
      )}
      style={{ width: size, height: size }}
    >
      {src && <img src={src} alt="" className="size-full object-cover" />}
    </div>
  );
}

function GoldBadge() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <defs>
        <linearGradient id="gold-badge-grad" x1="6" y1="0" x2="6" y2="12">
          <stop offset="0" stopColor="#FDDC87" />
          <stop offset="1" stopColor="#FCB02B" />
        </linearGradient>
      </defs>
      <path
        d="M6 0l1.85 2.5 3.1.55-2.17 2.4.47 3.1L6 7.3 2.75 8.55l.47-3.1L1.05 3.05l3.1-.55L6 0z"
        fill="url(#gold-badge-grad)"
      />
      <path d="M5.4 5.7l-1-1 0.5-.5 0.5.5L7.1 3.7l0.6.6-2.3 1.4z" fill="#252525" />
    </svg>
  );
}

/* ── Modal ── */

export function PayoutTransactionModal({
  open,
  onClose,
  data,
  onPrimaryAction,
  primaryActionLabel = "Send Contract",
  primaryActionIcon = <SendIcon className="text-white dark:text-[#111]" />,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[768px]" showClose={false}>
      {/* Header */}
      <div className="relative flex items-center justify-center border-b border-foreground/[0.06] px-5 py-3 dark:border-[rgba(224,224,224,0.06)]">
        <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">
          Payout transaction
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.33 3.33l9.33 9.33M12.67 3.33l-9.33 9.33" stroke="currentColor" strokeWidth="1.52" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex flex-col gap-4 overflow-y-auto py-4 scrollbar-hide">
        {/* Summary row */}
        <div className="flex flex-wrap gap-2 px-5 sm:flex-nowrap">
          <FieldCard value={data.amount} label="Amount" valueColor={RED} />
          <FieldCard value={data.status} label="Status" valueColor={data.statusColor ?? ORANGE} />
          <FieldCard value={data.type} label="Type" />
          <FieldCard
            value={<span className="truncate">{data.refNumber}</span>}
            label="Ref. number"
            rightIcon={
              <button type="button" className="flex cursor-pointer items-center justify-center rounded text-page-text-muted transition-colors hover:text-page-text">
                <CopyIcon />
              </button>
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="px-5">
            <span className="font-inter text-[14px] font-medium leading-[120%] tracking-[-0.02em] text-page-text">Transaction details</span>
          </div>

          <div className="flex flex-wrap gap-2 px-5 sm:flex-nowrap">
            <DetailCard label="Client">
              <div className="flex items-center gap-1.5">
                <Avatar src={data.client.avatar} size={36} />
                <div className="flex items-center gap-1">
                  <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">{data.client.name}</span>
                  {data.client.badge === "gold" && <GoldBadge />}
                </div>
              </div>
            </DetailCard>

            <DetailCard
              label="Campaign"
              rightIcon={
                <button type="button" className="flex cursor-pointer items-center justify-center rounded text-page-text-muted transition-colors hover:text-page-text">
                  <ExternalLinkIcon />
                </button>
              }
            >
              <div className="flex items-center gap-1.5">
                <Avatar src={data.campaign.avatar} size={36} />
                <span className="truncate font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text">{data.campaign.name}</span>
              </div>
            </DetailCard>
          </div>

          <div className="flex flex-wrap gap-2 px-5 sm:flex-nowrap">
            <DetailCard
              label="Creator attribution"
              labelRight={`Multiple (${data.creatorCount ?? data.creatorAvatars?.length ?? 0})`}
            >
              <div className="flex items-center">
                {(data.creatorAvatars ?? []).map((a, i) => (
                  <div key={i} className="-mr-2 last:mr-0">
                    <Avatar src={a} size={36} ringed />
                  </div>
                ))}
              </div>
            </DetailCard>

            <div className="flex min-w-0 flex-1 flex-col items-start gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 dark:border-[rgba(224,224,224,0.06)]">
              <span className="font-inter text-[12px] leading-none tracking-[-0.02em] text-page-text-muted">Description</span>
              <p className="line-clamp-2 font-inter text-[14px] font-normal leading-[140%] tracking-[-0.02em] text-page-text">{data.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-5 sm:flex-nowrap">
            <FieldCard value={data.balanceBefore} label={<LabelWithHint label="Balance" hint="Before" />} />
            <FieldCard value={data.transaction} label="Transaction" valueColor={RED} />
            <FieldCard value={data.balanceAfter} label={<LabelWithHint label="Balance" hint="After" />} valueColor={GREEN} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="px-5">
            <span className="font-inter text-[14px] font-medium leading-[120%] tracking-[-0.02em] text-page-text">Payout breakdown</span>
          </div>

          <div className="flex flex-wrap gap-2 px-5 sm:flex-nowrap">
            <FieldCard value={String(data.creators)} label="Creators" />
            <FieldCard
              value={String(data.approvedSubmissions)}
              label="Approved submissions"
              rightIcon={
                <button type="button" className="flex cursor-pointer items-center justify-center rounded text-page-text-muted transition-colors hover:text-page-text">
                  <ExternalLinkIcon />
                </button>
              }
            />
          </div>

          <div className="px-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)]">
              {data.breakdown.map((row, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-inter text-[12px] font-normal leading-none tracking-[-0.02em] text-page-text-muted">{row.label}</span>
                    <span className="font-inter text-[12px] font-medium leading-none tracking-[-0.02em] text-[#FF3355]">{row.amount}</span>
                  </div>
                  <div className="mt-3 h-px w-full bg-foreground/[0.06] dark:bg-[rgba(224,224,224,0.06)]" />
                </div>
              ))}
              <div className="flex items-center justify-between gap-2">
                <span className="font-inter text-[12px] font-medium leading-none tracking-[-0.02em] text-page-text">Total</span>
                <span className="font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-[#FF3355]">{data.total}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-5 sm:flex-nowrap">
            <FieldCard
              value={<span className="truncate">{data.batchId}</span>}
              label="Payment batch ID"
              rightIcon={
                <button type="button" className="flex cursor-pointer items-center justify-center rounded text-page-text-muted transition-colors hover:text-page-text">
                  <CopyIcon />
                </button>
              }
            />
            <FieldCard value={data.initiatedBy} label="Initiated by" />
            <FieldCard value={data.scheduledDate} label="Scheduled payout date" />
            <FieldCard value={data.expectedCompletion} label="Expected completion" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/[0.06] bg-card-bg px-5 py-4 dark:border-[rgba(224,224,224,0.06)]">
        <p className="max-w-[240px] font-inter text-[10px] font-normal leading-[140%] tracking-[-0.02em] text-[rgba(37,37,37,0.7)] dark:text-page-text-muted">
          {data.footerNote ??
            "The creator will receive this contract for review. They can accept, request changes, or decline."}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.06)] dark:hover:bg-[rgba(224,224,224,0.12)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPrimaryAction ?? onClose}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#252525] px-4 font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-white transition-colors hover:bg-[#171717] dark:bg-white dark:text-[#111] dark:hover:bg-white/90"
          >
            {primaryActionIcon}
            <span>{primaryActionLabel}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

