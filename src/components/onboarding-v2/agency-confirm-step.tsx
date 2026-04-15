"use client";

import { motion } from "motion/react";
import { CentralIcon } from "@central-icons-react/all";

interface AgencyConfirmStepProps {
  agencyName: string;
  agencyLogo?: string;
}

export function AgencyConfirmStep({ agencyName, agencyLogo }: AgencyConfirmStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          Confirm your agency
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          We&apos;ve identified your agency from your existing account.
        </p>
      </div>

      {/* Agency card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4 rounded-2xl border border-[#FF6207]/30 bg-[#FF6207]/[0.03] p-5"
      >
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-foreground/[0.06]">
          {agencyLogo ? (
            <img src={agencyLogo} alt={agencyName} className="size-full object-cover" />
          ) : (
            <CentralIcon name="IconPeople" size={22} color="var(--page-text-muted)" join="round" fill="filled" stroke="2" radius="2" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[16px] font-semibold text-page-text">{agencyName}</span>
          <span className="text-[12px] font-medium text-page-text-subtle">Migrating from v1</span>
        </div>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00B259]/10">
          <CentralIcon name="IconCircleCheck" size={16} color="#00B259" join="round" fill="filled" stroke="2" radius="2" />
        </div>
      </motion.div>

      {/* FAQ callouts */}
      <div className="flex flex-col gap-2">
        <InfoCallout text="All active campaigns, creator relationships, and payout history migrate automatically." />
        <InfoCallout text="Existing team members will receive an email to verify their accounts. Permissions carry over." />
      </div>
    </div>
  );
}

function InfoCallout({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-foreground/[0.03] px-3.5 py-3">
      <span className="mt-0.5 shrink-0">
        <CentralIcon name="IconCircleCheck" size={13} color="var(--page-text-subtle)" join="round" fill="filled" stroke="2" radius="2" />
      </span>
      <span className="text-[12px] font-medium leading-[18px] text-page-text-subtle">{text}</span>
    </div>
  );
}
