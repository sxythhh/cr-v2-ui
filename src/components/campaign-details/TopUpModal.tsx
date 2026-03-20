"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

const TOP_UP_AMOUNTS = [1_000, 5_000, 10_000, 25_000, 50_000] as const;

interface PaymentMethod {
  id: string;
  label: string;
  detail: string;
  selected: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "visa", label: "Visa ending in **3920", detail: "Default", selected: false },
  { id: "ach", label: "ACH Transfer", detail: "1-3 business days", selected: true },
  { id: "wire", label: "Wire Transfer", detail: "Same day", selected: false },
];

export function TopUpModal({
  onClose,
  currentBalance = 14_200,
}: {
  onClose: () => void;
  currentBalance?: number;
}) {
  const [selectedAmount, setSelectedAmount] = useState<number | "other">(5_000);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("ach");

  const depositAmount = selectedAmount === "other" ? (Number.parseInt(customAmount) || 0) : selectedAmount;
  const newBalance = currentBalance + depositAmount;

  const fmt = (n: number) =>
    `$${n.toLocaleString("en-US")}`;

  return (
    <Modal open onClose={onClose} maxWidth="max-w-[520px]" showClose={false}>
      <div className="flex max-h-[90vh] flex-col">
        {/* Header bar */}
        <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-foreground/[0.06] bg-card-bg px-5">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
            Top Up Campaign
          </span>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-3 flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-colors hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="scrollbar-hide flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-5 pb-5">
          {/* Subtitle */}
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
            Easily set up an agreement with a creator.
          </span>

          {/* Balance summary */}
          <div className="flex flex-col rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between border-b border-foreground/[0.03] px-4 py-3">
              <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                Current Balance
              </span>
              <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text">
                {fmt(currentBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-foreground/[0.03] px-4 py-3">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">
                Deposit amount
              </span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[#00994D]">
                +{fmt(depositAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-foreground/50">
                New balance after deposit
              </span>
              <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                {fmt(newBalance)}
              </span>
            </div>
          </div>

          {/* Select amount */}
          <div className="flex flex-col gap-3">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
              Select amount
            </span>
            <div className="flex flex-col gap-2">
              {/* Row 1: $1,000 / $5,000 / $10,000 */}
              <div className="flex items-center gap-2">
                {TOP_UP_AMOUNTS.slice(0, 3).map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={cn(
                      "flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border font-inter text-base font-medium tracking-[-0.02em] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors",
                      selectedAmount === amount
                        ? "border-foreground/16 bg-foreground text-white dark:bg-foreground dark:text-page-bg"
                        : "border-foreground/16 bg-card-bg text-page-text hover:bg-accent",
                    )}
                  >
                    {fmt(amount)}
                  </button>
                ))}
              </div>
              {/* Row 2: $25,000 / $50,000 / Other */}
              <div className="flex items-center gap-2">
                {TOP_UP_AMOUNTS.slice(3).map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedAmount(amount)}
                    className={cn(
                      "flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border font-inter text-base font-medium tracking-[-0.02em] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors",
                      selectedAmount === amount
                        ? "border-foreground/16 bg-foreground text-white dark:bg-foreground dark:text-page-bg"
                        : "border-foreground/16 bg-card-bg text-page-text hover:bg-accent",
                    )}
                  >
                    {fmt(amount)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedAmount("other")}
                  className={cn(
                    "flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg border font-inter text-base font-medium tracking-[-0.02em] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors",
                    selectedAmount === "other"
                      ? "border-foreground/16 bg-foreground text-white dark:bg-foreground dark:text-page-bg"
                      : "border-foreground/16 bg-card-bg text-page-text hover:bg-accent",
                  )}
                >
                  Other
                </button>
              </div>

              {/* Custom amount input */}
              {selectedAmount === "other" && (
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  className="h-10 rounded-lg border border-foreground/16 bg-card-bg px-4 font-inter text-base font-medium tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/30 focus:border-foreground/40"
                />
              )}
            </div>
          </div>

          {/* Payment method */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
              Payment method
            </span>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedPayment(method.id)}
                  className={cn(
                    "flex h-14 cursor-pointer items-center gap-3 rounded-2xl border bg-card-bg px-3 transition-colors",
                    selectedPayment === method.id
                      ? "border-foreground"
                      : "border-foreground/16",
                  )}
                >
                  {/* Radio */}
                  <div
                    className={cn(
                      "relative flex size-4 shrink-0 items-center justify-center rounded-full border",
                      selectedPayment === method.id
                        ? "border-foreground"
                        : "border-foreground/24 shadow-[inset_0_2px_6px_rgba(255,255,255,0.04)]",
                    )}
                  >
                    {selectedPayment === method.id && (
                      <div className="size-2.5 rounded-[3.125px] bg-foreground shadow-[0_0_4px_rgba(255,255,255,0.25)]" />
                    )}
                  </div>
                  {/* Label */}
                  <div className="flex flex-1 items-center gap-1.5">
                    <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                      {method.label}
                    </span>
                  </div>
                  {/* Detail */}
                  <span className="font-inter text-xs tracking-[-0.02em] text-foreground/50">
                    {method.detail}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer — pinned */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-foreground/[0.06] bg-card-bg px-5 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-foreground px-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-foreground/90 dark:text-page-bg"
          >
            Deposit funds
          </button>
        </div>
      </div>
    </Modal>
  );
}
