"use client";

import { Children, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconTrash, IconX } from "@tabler/icons-react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

// ── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
        on
          ? "bg-[#252525] dark:bg-white"
          : "bg-[rgba(37,37,37,0.12)] dark:bg-white/[0.12]",
      )}
    >
      <div
        className={cn(
          "size-4 rounded-full bg-white transition-transform dark:bg-[#111111]",
          on ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

// ── SegmentedControl ────────────────────────────────────────────────────────

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const segRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(segRef, { axis: "x" });

  useEffect(() => { measureItems(); }, [measureItems, options.length]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;
  const isHoveringSelected = activeIndex !== null && options[activeIndex] === value;

  return (
    <div
      ref={segRef}
      className="relative flex gap-1 rounded-[10px] bg-[rgba(37,37,37,0.04)] p-0.5 dark:bg-[rgba(255,255,255,0.04)]"
      onMouseEnter={handlers.onMouseEnter}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={handlers.onMouseLeave}
    >
      <AnimatePresence>
        {activeRect && !isHoveringSelected && (
          <motion.div
            key={sessionRef.current}
            className="pointer-events-none absolute rounded-lg bg-foreground/[0.06]"
            initial={{ opacity: 0, ...activeRect }}
            animate={{ opacity: 1, ...activeRect }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
          />
        )}
      </AnimatePresence>
      {options.map((opt, i) => (
        <button
          key={opt}
          ref={(el) => registerItem(i, el)}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "relative z-10 h-7 cursor-pointer rounded-lg px-3 text-[12px] font-medium tracking-[-0.02em] transition-colors",
            value === opt
              ? "bg-white text-[#252525] shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.10)] dark:text-[#e5e5e5]"
              : "text-[rgba(37,37,37,0.7)] dark:text-[rgba(255,255,255,0.5)]",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── InputField ──────────────────────────────────────────────────────────────

function InputField({
  value,
  onChange,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  suffix: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-16 rounded-[10px] bg-[rgba(37,37,37,0.04)] px-3 text-[12px] text-[#252525] outline-none dark:bg-[rgba(255,255,255,0.04)] dark:text-[#e5e5e5]"
      />
      <span className="text-[12px] text-page-text-muted">
        {suffix}
      </span>
    </div>
  );
}

// ── SettingRow ───────────────────────────────────────────────────────────────

function SettingRow({
  title,
  description,
  children,
  extra,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.02)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-[14px] font-medium tracking-[-0.02em] text-page-text">
            {title}
          </span>
          <span className="text-[12px] tracking-[-0.02em] text-page-text-muted">
            {description}
          </span>
          {extra}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}

// ── SectionCard ─────────────────────────────────────────────────────────────

function SectionCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] tracking-[-0.02em] text-page-text-muted">
        {label}
      </span>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

// ── Application Form Section ────────────────────────────────────────────────

interface FormField {
  id: string;
  title: string;
  type: string;
  required: boolean;
}

const DEFAULT_FIELDS: FormField[] = [
  {
    id: "1",
    title: "Why are you interested in this campaign?",
    type: "Text area",
    required: true,
  },
  {
    id: "2",
    title: "I agree to the Terms of Service",
    type: "Checkbox",
    required: true,
  },
  {
    id: "3",
    title: "Content format preference",
    type: "Select: Short-form / Long-form / Both",
    required: false,
  },
];

function ApplicationFormSection() {
  const [fields, setFields] = useState<FormField[]>(DEFAULT_FIELDS);
  const [newTitle, setNewTitle] = useState("");

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const addField = () => {
    if (!newTitle.trim()) return;
    setFields((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: newTitle.trim(),
        type: "Text area",
        required: false,
      },
    ]);
    setNewTitle("");
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] tracking-[-0.02em] text-page-text-muted">
        Application Form
      </span>

      <div className="rounded-2xl border border-border bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]">
        {/* Existing fields */}
        <div className="flex flex-col gap-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card-bg p-4 transition-colors hover:bg-foreground/[0.02]"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="truncate text-[14px] font-medium tracking-[-0.02em] text-page-text">
                  {field.title}
                </span>
                <span className="text-[12px] tracking-[-0.02em] text-page-text-muted">
                  {field.type}
                </span>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  field.required
                    ? "bg-[rgba(0,153,77,0.08)] text-[#00994D]"
                    : "bg-[rgba(229,113,0,0.08)] text-[#E57100]",
                )}
              >
                {field.required ? "Required" : "Optional"}
              </span>
              <button
                type="button"
                onClick={() => removeField(field.id)}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.10] hover:text-page-text"
              >
                <IconTrash size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Add field area */}
        <div className="mt-4 flex flex-col gap-2">
          <span className="text-[12px] tracking-[-0.02em] text-page-text-muted">
            Add field
          </span>
          <div className="rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-5 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.02)]">
            {/* Dropdowns row */}
            <div className="flex gap-2">
              <div className="flex h-8 flex-1 cursor-pointer items-center justify-between rounded-[10px] bg-[rgba(37,37,37,0.04)] px-3 dark:bg-[rgba(255,255,255,0.04)]">
                <span className="text-[12px] text-page-text-muted">
                  Label
                </span>
                <ChevronDown className="size-3 text-page-text-muted" />
              </div>
              <div className="flex h-8 flex-1 cursor-pointer items-center justify-between rounded-[10px] bg-[rgba(37,37,37,0.04)] px-3 dark:bg-[rgba(255,255,255,0.04)]">
                <span className="text-[12px] text-page-text-muted">
                  Input
                </span>
                <ChevronDown className="size-3 text-page-text-muted" />
              </div>
            </div>

            {/* Title input */}
            <div className="mt-2 flex flex-col gap-1">
              <input
                type="text"
                value={newTitle}
                onChange={(e) =>
                  setNewTitle(e.target.value.slice(0, 50))
                }
                placeholder="Title of your question/requirement"
                className="h-8 w-full rounded-[10px] bg-[rgba(37,37,37,0.04)] px-3 text-[12px] text-[#252525] placeholder:text-[rgba(37,37,37,0.35)] outline-none dark:bg-[rgba(255,255,255,0.04)] dark:text-[#e5e5e5] dark:placeholder:text-[rgba(255,255,255,0.3)]"
              />
              <span className="self-end text-[11px] text-[rgba(37,37,37,0.4)] dark:text-[rgba(255,255,255,0.35)]">
                {newTitle.length}/50
              </span>
            </div>

            {/* Add field button */}
            <button
              type="button"
              onClick={addField}
              className="mt-2 flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-[#252525] px-3 text-[12px] font-medium text-white transition-colors hover:bg-[#333] dark:bg-[#e5e5e5] dark:text-[#111111] dark:hover:bg-[#d5d5d5]"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2v12M2 8h12" />
              </svg>
              Add field
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

interface CampaignSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignSettingsModal({
  open,
  onOpenChange,
}: CampaignSettingsModalProps) {
  // General
  const [campaignStatus, setCampaignStatus] = useState("Active");
  const [listingVisibility, setListingVisibility] = useState("Public");
  const [applicationType, setApplicationType] = useState("Application only");

  // Budget & Payments
  const [autoPay, setAutoPay] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState("At 75%");
  const [autoTopUp, setAutoTopUp] = useState(false);
  const [refundWindow, setRefundWindow] = useState("7 days");

  // Submission Rules
  const [autoApprove, setAutoApprove] = useState(true);
  const [autoReject, setAutoReject] = useState(false);
  const [maxSubmissions, setMaxSubmissions] = useState("Unlimited");
  const [minEngagement, setMinEngagement] = useState("1.0");

  // Visibility & Leaderboard
  const [showTopPerformers, setShowTopPerformers] = useState(true);
  const [allowHideVideos, setAllowHideVideos] = useState(true);
  const [leaderboardMetric, setLeaderboardMetric] = useState("Total views");

  // Notifications
  const [newSubmissionAlert, setNewSubmissionAlert] = useState(true);
  const [newApplicationAlert, setNewApplicationAlert] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // Campaign Messaging
  const [announcementsChannel, setAnnouncementsChannel] = useState(true);
  const [creatorDMs, setCreatorDMs] = useState(true);

  // Contract Terms
  const [paymentAmount, setPaymentAmount] = useState("500");
  const [paymentPeriod, setPaymentPeriod] = useState("Monthly");
  const [commitmentLength, setCommitmentLength] = useState("3 months");
  const [requireReapproval, setRequireReapproval] = useState(true);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-neutral-100/50 backdrop-blur-md dark:bg-neutral-900/50" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex w-[752px] -translate-x-1/2 -translate-y-1/2 flex-col",
            "rounded-[20px] border border-border",
            "bg-white dark:bg-[#1a1a1a] shadow-xl",
            "max-h-[90dvh] tracking-[-0.02em]",
          )}
        >
          {/* ── Header ──────────────────────────────────────────── */}
          <div className="relative flex h-10 shrink-0 items-center justify-center border-b border-border">
            <span className="text-[14px] font-medium text-page-text">
              Campaign settings
            </span>
            <DialogPrimitive.Close className="absolute right-3 top-1/2 -translate-y-1/2 flex size-7 cursor-pointer items-center justify-center rounded-full text-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.06)] hover:text-[#252525] dark:text-[rgba(255,255,255,0.45)] dark:hover:bg-[rgba(255,255,255,0.06)] dark:hover:text-[#e5e5e5]">
              <IconX size={14} stroke={2} />
            </DialogPrimitive.Close>
          </div>

          {/* ── Body ────────────────────────────────────────────── */}
          <div
            className="flex flex-col gap-4 overflow-y-auto px-5 pb-5 pt-4"
            style={{ scrollbarWidth: "none" }}
          >
            {/* 1. General */}
            <SectionCard label="General">
              <SettingRow
                title="Campaign status"
                description="Toggle campaign active/paused"
              >
                <SegmentedControl
                  options={["Active", "Paused"]}
                  value={campaignStatus}
                  onChange={setCampaignStatus}
                />
              </SettingRow>
              <SettingRow
                title="Listing visibility"
                description="Show on Discover page for creators"
              >
                <SegmentedControl
                  options={["Public", "Unlisted", "Invite only"]}
                  value={listingVisibility}
                  onChange={setListingVisibility}
                />
              </SettingRow>
              <SettingRow
                title="Application type"
                description="Open join or require approval"
              >
                <SegmentedControl
                  options={["Application only", "Open to join"]}
                  value={applicationType}
                  onChange={setApplicationType}
                />
              </SettingRow>
            </SectionCard>

            {/* 2. Budget & Payments */}
            <SectionCard label="Budget & Payments">
              <SettingRow
                title="Auto-pay on Approval"
                description="Automatically pay creators when submission is approved"
              >
                <Toggle on={autoPay} onToggle={() => setAutoPay(!autoPay)} />
              </SettingRow>
              <SettingRow
                title="Budget alerts"
                description="Notify when budget reaches threshold"
              >
                <SegmentedControl
                  options={["At 90%", "At 75%", "At 50%", "Off"]}
                  value={budgetAlerts}
                  onChange={setBudgetAlerts}
                />
              </SettingRow>
              <SettingRow
                title="Auto top up"
                description="Automatically add funds when budget runs low"
              >
                <Toggle
                  on={autoTopUp}
                  onToggle={() => setAutoTopUp(!autoTopUp)}
                />
              </SettingRow>
              <SettingRow
                title="Refund Window"
                description="Days after payout to allow clawback"
              >
                <SegmentedControl
                  options={["30 days", "14 days", "7 days", "None"]}
                  value={refundWindow}
                  onChange={setRefundWindow}
                />
              </SettingRow>
            </SectionCard>

            {/* 3. Submission Rules */}
            <SectionCard label="Submission Rules">
              <SettingRow
                title="Auto-approve (Trust Score >= 80)"
                description="Skip manual review for trusted creators"
              >
                <Toggle
                  on={autoApprove}
                  onToggle={() => setAutoApprove(!autoApprove)}
                />
              </SettingRow>
              <SettingRow
                title="Auto-reject (Bot Score >= 60%)"
                description="Reject submissions flagged as bot content"
              >
                <Toggle
                  on={autoReject}
                  onToggle={() => setAutoReject(!autoReject)}
                />
              </SettingRow>
              <SettingRow
                title="Max Submissions per Creator"
                description="Limit how many videos each creator can submit"
              >
                <SegmentedControl
                  options={["Unlimited", "1/day", "3/week", "5/month"]}
                  value={maxSubmissions}
                  onChange={setMaxSubmissions}
                />
              </SettingRow>
              <SettingRow
                title="Min. Engagement Rate"
                description="Minimum engagement for accepted videos"
              >
                <InputField
                  value={minEngagement}
                  onChange={setMinEngagement}
                  suffix="%"
                />
              </SettingRow>
            </SectionCard>

            {/* 4. Visibility & Leaderboard */}
            <SectionCard label="Visibility & Leaderboard">
              <SettingRow
                title="Show Top Performers"
                description="Display a public leaderboard of top creators in this campaign"
              >
                <Toggle
                  on={showTopPerformers}
                  onToggle={() => setShowTopPerformers(!showTopPerformers)}
                />
              </SettingRow>
              <SettingRow
                title="Allow Creators to Hide Videos"
                description="Let creators toggle their submissions on/off from the leaderboard"
              >
                <Toggle
                  on={allowHideVideos}
                  onToggle={() => setAllowHideVideos(!allowHideVideos)}
                />
              </SettingRow>
              <SettingRow
                title="Leaderboard Metric"
                description="Primary metric used to rank top performers"
              >
                <SegmentedControl
                  options={["Total views", "Eng. rate", "Earnings", "Total subs"]}
                  value={leaderboardMetric}
                  onChange={setLeaderboardMetric}
                />
              </SettingRow>
            </SectionCard>

            {/* 5. Notifications */}
            <SectionCard label="Notifications">
              <SettingRow
                title="New Submission Alert"
                description="Get notified for every new submission"
              >
                <Toggle
                  on={newSubmissionAlert}
                  onToggle={() => setNewSubmissionAlert(!newSubmissionAlert)}
                />
              </SettingRow>
              <SettingRow
                title="New Application Alert"
                description="Notify when creators apply to join"
              >
                <Toggle
                  on={newApplicationAlert}
                  onToggle={() =>
                    setNewApplicationAlert(!newApplicationAlert)
                  }
                />
              </SettingRow>
              <SettingRow
                title="Weekly Summary Email"
                description="Receive weekly performance digest"
              >
                <Toggle
                  on={weeklySummary}
                  onToggle={() => setWeeklySummary(!weeklySummary)}
                />
              </SettingRow>
            </SectionCard>

            {/* 6. Campaign Messaging */}
            <SectionCard label="Campaign Messaging">
              <SettingRow
                title="Campaign Announcements Channel"
                description="Broadcast updates to all campaign creators"
                extra={
                  <button
                    type="button"
                    className="mt-1 inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full bg-[rgba(37,37,37,0.06)] px-2.5 text-[11px] font-medium text-[#252525] transition-colors hover:bg-[rgba(37,37,37,0.10)] dark:bg-[rgba(255,255,255,0.06)] dark:text-[#e5e5e5] dark:hover:bg-[rgba(255,255,255,0.10)]"
                  >
                    Manage
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </button>
                }
              >
                <Toggle
                  on={announcementsChannel}
                  onToggle={() =>
                    setAnnouncementsChannel(!announcementsChannel)
                  }
                />
              </SettingRow>
              <SettingRow
                title="Creator DMs"
                description="Allow creators to message you directly"
              >
                <Toggle
                  on={creatorDMs}
                  onToggle={() => setCreatorDMs(!creatorDMs)}
                />
              </SettingRow>
            </SectionCard>

            {/* 7. Contract Terms */}
            <SectionCard label="Contract Terms">
              <SettingRow
                title="Payment Amount"
                description="Fixed payment per period"
              >
                <InputField
                  value={paymentAmount}
                  onChange={setPaymentAmount}
                  suffix="$"
                />
              </SettingRow>
              <SettingRow
                title="Payment Period"
                description="How often creators are paid"
              >
                <SegmentedControl
                  options={["Monthly", "Bi-weekly", "Weekly"]}
                  value={paymentPeriod}
                  onChange={setPaymentPeriod}
                />
              </SettingRow>
              <SettingRow
                title="Commitment Length"
                description="Minimum contract duration"
              >
                <SegmentedControl
                  options={["1 month", "3 months", "6 months", "12 months"]}
                  value={commitmentLength}
                  onChange={setCommitmentLength}
                />
              </SettingRow>
              <SettingRow
                title="Require contract re-approval on changes"
                description="Creators must re-accept if terms change"
              >
                <Toggle
                  on={requireReapproval}
                  onToggle={() => setRequireReapproval(!requireReapproval)}
                />
              </SettingRow>
            </SectionCard>

            {/* 8. Application Form */}
            <ApplicationFormSection />
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
