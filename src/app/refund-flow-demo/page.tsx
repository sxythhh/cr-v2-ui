"use client";

import { useState } from "react";
import {
  RefundFlowModal,
  type RefundStep,
} from "@/components/refund-flow/refund-flow-modal";
import { cn } from "@/lib/utils";

const STEPS: { key: RefundStep; label: string; description: string }[] = [
  {
    key: "confirm",
    label: "1 — Confirm",
    description: "Review request with campaign stats and top creators",
  },
  {
    key: "reason",
    label: "2 — Reason",
    description: "Pick a refund reason and add an optional note",
  },
  {
    key: "pending",
    label: "3 — Pending",
    description: "Refund request submitted, awaiting decision",
  },
  {
    key: "success",
    label: "4a — Success",
    description: "Refund approved, amount returned to balance",
  },
  {
    key: "denied",
    label: "4b — Denied",
    description: "Refund rejected based on guideline review",
  },
  {
    key: "not-eligible",
    label: "4c — Not eligible",
    description: "Cannot refund — campaign has pending submissions",
  },
];

export default function RefundFlowDemoPage() {
  const [open, setOpen] = useState(false);
  const [initialStep, setInitialStep] = useState<RefundStep>("confirm");

  const launchAt = (step: RefundStep) => {
    setInitialStep(step);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto flex max-w-[720px] flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] uppercase tracking-[0.08em] text-page-text-muted">
            Demo
          </span>
          <h1 className="font-medium text-[24px] leading-[120%] tracking-[-0.02em] text-page-text">
            Refund flow
          </h1>
          <p className="text-[14px] leading-[150%] tracking-[-0.02em] text-page-text-subtle">
            Six modal states for the brand-side refund flow. Click any state
            below to open the modal there — Confirm and Reason naturally
            advance, while Pending / Success / Denied / Not eligible are
            terminal.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {STEPS.map((step) => (
            <button
              key={step.key}
              type="button"
              onClick={() => launchAt(step.key)}
              className={cn(
                "group flex items-center justify-between rounded-2xl border border-border bg-card-bg px-5 py-4 text-left transition-colors",
                "hover:border-foreground/[0.12] hover:bg-foreground/[0.02]",
              )}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium text-[14px] leading-none tracking-[-0.02em] text-page-text">
                  {step.label}
                </span>
                <span className="text-[13px] leading-[140%] tracking-[-0.02em] text-page-text-subtle">
                  {step.description}
                </span>
              </div>
              <span className="rounded-full bg-foreground/[0.06] px-3 py-1.5 font-medium text-[12px] leading-none tracking-[-0.02em] text-page-text group-hover:bg-foreground/[0.10]">
                Open
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-foreground/[0.02] px-5 py-4 text-[13px] leading-[150%] tracking-[-0.02em] text-page-text-subtle">
          <strong className="font-medium text-page-text">Flow:</strong>{" "}
          Confirm → Reason → Pending → (Success / Denied / Not eligible). The
          Confirm and Reason buttons inside the modal advance through the flow;
          the terminal states close on action.
        </div>
      </div>

      <RefundFlowModal
        open={open}
        onClose={() => setOpen(false)}
        initialStep={initialStep}
      />
    </div>
  );
}
