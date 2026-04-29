"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

export type RefundStep =
  | "confirm"
  | "reason"
  | "pending"
  | "success"
  | "denied"
  | "not-eligible";

interface RefundFlowModalProps {
  open: boolean;
  onClose: () => void;
  initialStep?: RefundStep;
  campaignName?: string;
  refundAmount?: string;
}

// ── Icons ────────────────────────────────────────────────────────────

function RefundIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <path
        d="M22.7748 14C22.7748 9.16751 18.8573 5.25 14.0248 5.25C11.1984 5.25 9.26837 6.37313 7.34233 8.45833H10.2081C10.6913 8.45833 11.0831 8.85008 11.0831 9.33333C11.0831 9.81658 10.6913 10.2083 10.2081 10.2083H6.12476C5.31934 10.2083 4.66643 9.55541 4.66643 8.75V4.66667C4.66643 4.18342 5.05818 3.79167 5.54143 3.79167C6.02467 3.79167 6.41643 4.18342 6.41643 4.66667V6.8924C8.47249 4.78842 10.7602 3.5 14.0248 3.5C19.8238 3.5 24.5248 8.20101 24.5248 14C24.5248 19.799 19.8238 24.5 14.0248 24.5C9.45169 24.5 5.56353 21.5769 4.12252 17.4999C3.96148 17.0443 4.20029 16.5444 4.65591 16.3833C5.11154 16.2223 5.61145 16.4611 5.77249 16.9167C6.9741 20.3164 10.2164 22.75 14.0248 22.75C18.8573 22.75 22.7748 18.8325 22.7748 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HourglassIcon({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.83333 4.08203H4.375C3.89175 4.08203 3.5 3.69028 3.5 3.20703C3.5 2.72378 3.89175 2.33203 4.375 2.33203H23.625C24.1082 2.33203 24.5 2.72378 24.5 3.20703C24.5 3.69028 24.1082 4.08203 23.625 4.08203H22.1667V8.69355C22.1667 9.38973 21.8119 10.0379 21.2256 10.4132L15.6232 13.9987L21.2256 17.5842C21.8119 17.9595 22.1667 18.6077 22.1667 19.3038V23.9154H23.625C24.1082 23.9154 24.5 24.3071 24.5 24.7904C24.5 25.2736 24.1082 25.6654 23.625 25.6654H4.375C3.89175 25.6654 3.5 25.2736 3.5 24.7904C3.5 24.3071 3.89175 23.9154 4.375 23.9154H5.83333V19.3038C5.83333 18.6077 6.18807 17.9595 6.77443 17.5842L12.3768 13.9987L6.77443 10.4132C6.18807 10.0379 5.83333 9.38973 5.83333 8.69355V4.08203ZM7.58333 8.16536H20.4167V4.08203H7.58333V8.16536ZM20.4167 19.3038V20.9987H7.58333V19.3038C7.58333 19.2044 7.63401 19.1118 7.71778 19.0582L14 15.0376L20.2822 19.0582C20.366 19.1118 20.4167 19.2044 20.4167 19.3038Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckSmall({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M13.3333 4.66667L6 12L2.66667 8.66667"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckCircle({ filled }: { filled: boolean }) {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center">
      {filled ? (
        <div className="flex size-5 items-center justify-center rounded-full bg-[#E57100] shadow-[inset_0_0.5px_2px_rgba(0,0,0,0.12)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M9.5 3.5L4.75 8.25L2.5 6"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div className="size-5 rounded-full border border-foreground/10 bg-card-bg shadow-[inset_0_0.5px_2px_rgba(0,0,0,0.12)]" />
      )}
    </div>
  );
}

// ── Shared chrome ────────────────────────────────────────────────────

function Header({ title }: { title: string }) {
  return (
    <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-border px-5">
      <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-page-text">
        {title}
      </span>
    </div>
  );
}

function FooterBar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 border-t border-border bg-card-bg px-5 py-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PillButton({
  variant = "ghost",
  onClick,
  children,
  className,
}: {
  variant?: "ghost" | "danger" | "primary";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4 font-medium text-[14px] leading-none tracking-[-0.02em] outline-none transition-colors",
        variant === "ghost" &&
          "bg-foreground/[0.06] text-page-text hover:bg-foreground/[0.10]",
        variant === "danger" &&
          "bg-[#FF3355]/[0.06] text-[#FF3355] hover:bg-[#FF3355]/[0.10]",
        variant === "primary" &&
          "bg-[#252525] text-white hover:bg-[#3a3a3a] dark:bg-white dark:text-[#252525] dark:hover:bg-[#e5e5e5]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function GradientIconCircle({
  tone,
  children,
}: {
  tone: "orange" | "green" | "red" | "gray";
  children: React.ReactNode;
}) {
  const gradients: Record<typeof tone, string> = {
    orange: "linear-gradient(180deg, #F59E0B 0%, #F97316 271.34%)",
    green: "linear-gradient(180deg, #00994D 0%, rgba(0,153,77,0) 271.34%)",
    red: "linear-gradient(180deg, #FF3355 0%, #F97316 271.34%)",
    gray: "linear-gradient(180deg, rgba(37,37,37,0.5) 0%, #252525 271.34%)",
  } as const;
  return (
    <div
      className="flex size-14 shrink-0 items-center justify-center rounded-full text-white"
      style={{
        background: gradients[tone],
        border: "1px solid rgba(37,37,37,0.1)",
        boxShadow:
          "0px 0px 0px 2px var(--color-card-bg, #fff), inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 1px 0px rgba(255,255,255,0.36)",
      }}
    >
      {children}
    </div>
  );
}

// ── Step: Confirm ────────────────────────────────────────────────────

function ConfirmStep({
  campaignName,
  onCancel,
  onContinue,
}: {
  campaignName: string;
  onCancel: () => void;
  onContinue: () => void;
}) {
  const stats = [
    { label: "Total views", value: "4.2M", note: "+23%" },
    { label: "Total payouts", value: "$8,120", note: "98% of budget" },
    { label: "Creators", value: "47", note: "+12 vs avg" },
    { label: "Effective CPM", value: "$0.59", note: "Below $1.00 target" },
  ];
  const creators = [
    { name: "JadenMalcolm", views: "1.2M views" },
    { name: "CryptoReels", views: "890K views" },
    { name: "NightFocus", views: "742K views" },
  ];

  return (
    <>
      <div
        className="flex flex-col items-center gap-6 px-5 pt-8"
        style={{
          background:
            "radial-gradient(50% 53.47% at 50% 0%, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <GradientIconCircle tone="orange">
            <RefundIcon className="text-white" />
          </GradientIconCircle>
          <span
            className="bg-clip-text font-medium text-[20px] leading-[120%] tracking-[-0.02em] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #F59E0B 0%, #F97316 271.34%)",
            }}
          >
            Review your refund request
          </span>
          <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-page-text-muted">
            {campaignName}
          </span>
        </div>

        <div className="grid w-full grid-cols-4 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex h-[84px] flex-col justify-between rounded-2xl border border-foreground/[0.06] bg-card-bg p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
            >
              <div className="flex flex-col gap-2">
                <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-page-text">
                  {s.value}
                </span>
                <span className="text-[12px] leading-none tracking-[-0.02em] text-page-text-muted">
                  {s.label}
                </span>
              </div>
              <span className="text-[10px] leading-none tracking-[-0.02em] text-[#00994D]">
                {s.note}
              </span>
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-2 pb-5">
          <span className="text-[12px] leading-none tracking-[-0.02em] text-page-text-muted">
            Top performing creators
          </span>
          <div className="flex flex-col rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
            {creators.map((c, i) => (
              <div
                key={c.name}
                className={cn(
                  "flex h-10 items-center justify-between px-4",
                  i < creators.length - 1 &&
                    "border-b border-foreground/[0.03]",
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="size-3 shrink-0 rounded-full bg-foreground/10" />
                  <span className="font-medium text-[12px] leading-[120%] tracking-[-0.02em] text-page-text-muted">
                    {c.name}
                  </span>
                </div>
                <span className="font-medium text-[12px] leading-[120%] tracking-[-0.02em] text-page-text">
                  {c.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterBar>
        <PillButton onClick={onCancel}>No, take me back</PillButton>
        <PillButton variant="danger" onClick={onContinue}>
          Yes, refund campaign
        </PillButton>
      </FooterBar>
    </>
  );
}

// ── Step: Reason ─────────────────────────────────────────────────────

const REASONS = [
  { key: "performance", label: "I'm not satisfied with the campaign performance" },
  { key: "changed-mind", label: "I changed my mind about running this campaign" },
  { key: "setup", label: "There's an issue with the campaign setup" },
  { key: "no-longer-need", label: "I no longer need this campaign" },
  { key: "other", label: "Other" },
] as const;

type ReasonKey = (typeof REASONS)[number]["key"];

function ReasonStep({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [reason, setReason] = useState<ReasonKey>("performance");
  const [otherText, setOtherText] = useState("");
  const [note, setNote] = useState("");

  return (
    <>
      <div
        className="flex flex-col items-center gap-6 px-5 pt-8 pb-5"
        style={{
          background:
            "radial-gradient(50% 53.47% at 50% 0%, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0) 100%)",
        }}
      >
        <GradientIconCircle tone="orange">
          <RefundIcon className="text-white" />
        </GradientIconCircle>

        <div className="flex flex-col items-center gap-2">
          <span className="font-medium text-[20px] leading-[120%] tracking-[-0.02em] text-page-text">
            Reason for refund
          </span>
          <p className="max-w-[300px] text-center font-medium text-[14px] leading-[150%] tracking-[-0.02em] text-page-text-subtle">
            Help us understand why you&rsquo;re refunding this campaign.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2">
          {REASONS.map((r) => {
            const isSelected = reason === r.key;
            const isOther = r.key === "other";
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setReason(r.key)}
                className={cn(
                  "group relative flex w-full flex-col items-stretch gap-2 rounded-2xl border bg-card-bg px-4 py-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
                  isSelected
                    ? "border-[#E57100]/30"
                    : "border-foreground/[0.06] hover:border-foreground/[0.12]",
                )}
                style={
                  isSelected
                    ? {
                        background:
                          "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.12) 0%, rgba(255,144,37,0) 50%), var(--color-card-bg, #fff)",
                      }
                    : undefined
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-page-text">
                    {r.label}
                  </span>
                  <CheckCircle filled={isSelected} />
                </div>
                {isOther && isSelected && (
                  <textarea
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="E.g., this appears to be promotional content disguised as a normal submission..."
                    className="min-h-[60px] w-full resize-none rounded-xl bg-foreground/[0.04] p-4 text-[12px] leading-[120%] tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/40"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-2">
          <span className="text-[12px] leading-none tracking-[-0.02em] text-page-text-muted">
            Add an additional note (optional)
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="E.g., contains information not meant to be shared..."
            className="min-h-[74px] w-full resize-none rounded-xl bg-foreground/[0.04] p-4 text-[12px] leading-[120%] tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/40"
          />
        </div>
      </div>

      <FooterBar>
        <PillButton onClick={onBack}>Back</PillButton>
        <PillButton variant="primary" onClick={onSubmit}>
          Submit
        </PillButton>
      </FooterBar>
    </>
  );
}

// ── Step: Pending ────────────────────────────────────────────────────

function PendingStep({
  campaignName,
  onClose,
}: {
  campaignName: string;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="flex flex-col items-center gap-10 px-5 pt-8 pb-4"
        style={{
          background:
            "radial-gradient(50% 53.47% at 50% 0%, rgba(37,37,37,0.06) 0%, rgba(37,37,37,0) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <GradientIconCircle tone="gray">
            <HourglassIcon className="text-white" />
          </GradientIconCircle>
          <span className="font-medium text-[20px] leading-[120%] tracking-[-0.02em] text-page-text-subtle">
            Refund request pending...
          </span>
          <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-page-text-muted">
            {campaignName}
          </span>
        </div>
      </div>

      <FooterBar className="justify-end">
        <PillButton variant="primary" onClick={onClose}>
          Close
        </PillButton>
      </FooterBar>
    </>
  );
}

// ── Step: Success ────────────────────────────────────────────────────

function SuccessStep({
  campaignName,
  refundAmount,
  onClose,
  onViewBalance,
}: {
  campaignName: string;
  refundAmount: string;
  onClose: () => void;
  onViewBalance: () => void;
}) {
  return (
    <>
      <div
        className="flex flex-col items-center gap-6 px-5 pt-8 pb-4"
        style={{
          background:
            "radial-gradient(50% 53.47% at 50% 0%, rgba(0,153,77,0.12) 0%, rgba(0,153,77,0) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex h-[45px] items-center justify-center rounded-full px-4"
            style={{
              background:
                "linear-gradient(180deg, #00994D 0%, rgba(0,153,77,0) 271.34%)",
              border: "1px solid rgba(37,37,37,0.1)",
              boxShadow:
                "0px 0px 0px 2px var(--color-card-bg, #fff), inset 0px 0.5px 2px rgba(0,0,0,0.12), inset 0px 1px 0px rgba(255,255,255,0.36)",
            }}
          >
            <span className="font-medium text-[24px] leading-[120%] tracking-[-0.02em] text-white">
              {refundAmount}
            </span>
          </div>
          <span
            className="bg-clip-text text-center font-medium text-[20px] leading-[120%] tracking-[-0.02em] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #00994D 0%, rgba(0,153,77,0.5) 271.34%)",
            }}
          >
            Has been refunded to your balance
          </span>
          <div className="flex items-center gap-1 text-[#00994D]">
            <CheckSmall className="text-[#00994D]" />
            <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-page-text-muted">
              {campaignName}
            </span>
          </div>
        </div>
      </div>

      <FooterBar className="justify-end">
        <div className="flex items-center gap-2">
          <PillButton onClick={onClose}>Close</PillButton>
          <PillButton variant="primary" onClick={onViewBalance}>
            View balance
          </PillButton>
        </div>
      </FooterBar>
    </>
  );
}

// ── Step: Denied ─────────────────────────────────────────────────────

function DeniedStep({
  campaignName,
  onCancel,
  onGoToSubmissions,
}: {
  campaignName: string;
  onCancel: () => void;
  onGoToSubmissions: () => void;
}) {
  return (
    <>
      <div
        className="flex flex-col items-center gap-10 px-5 pt-8 pb-4"
        style={{
          background:
            "radial-gradient(50% 53.47% at 50% 0%, rgba(255,51,85,0.12) 0%, rgba(255,51,85,0) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <GradientIconCircle tone="red">
            <RefundIcon className="text-white" />
          </GradientIconCircle>
          <span
            className="bg-clip-text font-medium text-[20px] leading-[120%] tracking-[-0.02em] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #FF3355 0%, #F97316 271.34%)",
            }}
          >
            Refund denied
          </span>
          <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-page-text-muted">
            {campaignName}
          </span>
        </div>
        <p className="max-w-[284px] text-center font-medium text-[14px] leading-[120%] tracking-[-0.02em] text-page-text-muted">
          Creator submissions that met our guidelines have been rejected without
          solid ground. Please read more on our guidelines here
        </p>
      </div>

      <FooterBar className="justify-end">
        <div className="flex items-center gap-2">
          <PillButton onClick={onCancel}>Cancel</PillButton>
          <PillButton variant="primary" onClick={onGoToSubmissions}>
            Go to Submissions
          </PillButton>
        </div>
      </FooterBar>
    </>
  );
}

// ── Step: Not eligible ───────────────────────────────────────────────

function NotEligibleStep({
  campaignName,
  pendingCount = 4,
  onCancel,
  onGoToSubmissions,
}: {
  campaignName: string;
  pendingCount?: number;
  onCancel: () => void;
  onGoToSubmissions: () => void;
}) {
  return (
    <>
      <div
        className="flex flex-col items-center gap-10 px-5 pt-[60px] pb-4"
        style={{
          background:
            "radial-gradient(50% 53.47% at 50% 0%, rgba(255,51,85,0.12) 0%, rgba(255,51,85,0) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <GradientIconCircle tone="red">
            <RefundIcon className="text-white" />
          </GradientIconCircle>
          <span
            className="bg-clip-text font-medium text-[20px] leading-[120%] tracking-[-0.02em] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(180deg, #FF3355 0%, #F97316 271.34%)",
            }}
          >
            Not eligible for refund
          </span>
          <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-page-text-muted">
            {campaignName}
          </span>
        </div>
        <div className="flex items-center gap-1 font-medium text-[14px] leading-none tracking-[-0.02em]">
          <span className="text-page-text-muted">This campaign has</span>
          <span className="text-page-text">{pendingCount}</span>
          <span className="text-page-text-muted">pending submissions</span>
        </div>
      </div>

      <FooterBar className="justify-end">
        <div className="flex items-center gap-2">
          <PillButton onClick={onCancel}>Cancel</PillButton>
          <PillButton variant="primary" onClick={onGoToSubmissions}>
            Go to Submissions
          </PillButton>
        </div>
      </FooterBar>
    </>
  );
}

// ── Public component ─────────────────────────────────────────────────

export function RefundFlowModal({
  open,
  onClose,
  initialStep = "confirm",
  campaignName = "Call of Duty BO7 Clipping",
  refundAmount = "+$1,405",
}: RefundFlowModalProps) {
  const [step, setStep] = useState<RefundStep>(initialStep);

  useEffect(() => {
    if (open) setStep(initialStep);
  }, [open, initialStep]);

  return (
    <Modal open={open} onClose={onClose} size="md" className="border-0 p-0">
      <Header title="Request refund" />
      {step === "confirm" && (
        <ConfirmStep
          campaignName={campaignName}
          onCancel={onClose}
          onContinue={() => setStep("reason")}
        />
      )}
      {step === "reason" && (
        <ReasonStep
          onBack={() => setStep("confirm")}
          onSubmit={() => setStep("pending")}
        />
      )}
      {step === "pending" && (
        <PendingStep campaignName={campaignName} onClose={onClose} />
      )}
      {step === "success" && (
        <SuccessStep
          campaignName={campaignName}
          refundAmount={refundAmount}
          onClose={onClose}
          onViewBalance={onClose}
        />
      )}
      {step === "denied" && (
        <DeniedStep
          campaignName={campaignName}
          onCancel={onClose}
          onGoToSubmissions={onClose}
        />
      )}
      {step === "not-eligible" && (
        <NotEligibleStep
          campaignName={campaignName}
          onCancel={onClose}
          onGoToSubmissions={onClose}
        />
      )}
    </Modal>
  );
}
