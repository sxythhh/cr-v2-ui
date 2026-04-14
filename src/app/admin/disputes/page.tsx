// @ts-nocheck
"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { AuditLogSheet } from "@/components/admin/audit-log-sheet";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { motion, AnimatePresence } from "motion/react";
import { springs } from "@/lib/springs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// ── Types ───────────────────────────────────────────────────────────

type DisputeStatus = "open" | "under_review" | "resolved" | "escalated";
type DisputePriority = "high" | "medium" | "low";
type DisputeType = "rejected_submission" | "missing_payout" | "wrong_amount" | "late_payment" | "content_theft";
type ResolutionOutcome = "side_creator" | "side_brand" | "partial" | "dismiss";

interface Dispute {
  id: string;
  title: string;
  type: DisputeType;
  status: DisputeStatus;
  priority: DisputePriority;
  creator: {
    name: string;
    avatar: string;
    handle: string;
  };
  brand: {
    name: string;
    logo: string;
  };
  campaign: string;
  amount: number;
  filedDate: string;
  timeSince: string;
  description: string;
  evidence: { name: string; type: "screenshot" | "video" | "document" }[];
  submissionId?: string;
  brandResponse?: {
    text: string;
    campaignRules?: string;
    respondedDate: string;
  };
  timeline: { date: string; event: string; note?: string }[];
  resolution?: {
    outcome: ResolutionOutcome;
    compensationAmount?: number;
    note: string;
  };
}

// ── Mock Data ───────────────────────────────────────────────────────

const MOCK_DISPUTES: Dispute[] = [
  {
    id: "dsp-001",
    title: "Rejected submission dispute",
    type: "rejected_submission",
    status: "open",
    priority: "high",
    creator: { name: "Alex Rivera", avatar: "https://i.pravatar.cc/40?u=alex", handle: "@alexrivera" },
    brand: { name: "GYMSHARK", logo: "https://logo.clearbit.com/gymshark.com" },
    campaign: "GYMSHARK Clipping",
    amount: 1250,
    filedDate: "Apr 11, 2026",
    timeSince: "2 days ago",
    description: "My submission was rejected for 'off-brand content' but it followed the exact brief provided. The video hit 45K views and meets all the campaign requirements listed in the brief. I believe this was rejected in error.",
    evidence: [
      { name: "submission_screenshot.png", type: "screenshot" },
      { name: "brief_comparison.png", type: "screenshot" },
      { name: "analytics_proof.mp4", type: "video" },
    ],
    submissionId: "sub-4821",
    brandResponse: {
      text: "The submission did not align with our brand guidelines. The tone was too casual and the product placement was not prominent enough per our requirements.",
      campaignRules: "All content must feature the product within the first 3 seconds. Background music must be from our approved library. Tone should be aspirational and motivational.",
      respondedDate: "Apr 12, 2026",
    },
    timeline: [
      { date: "Apr 11, 2026 09:14", event: "Dispute filed", note: "Creator disputed rejected submission" },
      { date: "Apr 11, 2026 09:20", event: "Brand notified", note: "Automated notification sent to GYMSHARK" },
      { date: "Apr 12, 2026 14:30", event: "Brand responded", note: "GYMSHARK provided their reasoning" },
    ],
  },
  {
    id: "dsp-002",
    title: "Missing payout claim",
    type: "missing_payout",
    status: "under_review",
    priority: "high",
    creator: { name: "Jordan Chen", avatar: "https://i.pravatar.cc/40?u=jordan", handle: "@jordanchen" },
    brand: { name: "Polymarket", logo: "https://logo.clearbit.com/polymarket.com" },
    campaign: "Polymarket Clipping Campaign",
    amount: 3400,
    filedDate: "Apr 9, 2026",
    timeSince: "4 days ago",
    description: "I completed 8 approved submissions for this campaign over the past month but have not received any payment. My payout has been stuck in 'processing' for over 2 weeks with no update.",
    evidence: [
      { name: "payout_status_screenshot.png", type: "screenshot" },
      { name: "approved_submissions.pdf", type: "document" },
    ],
    submissionId: "sub-3917",
    brandResponse: {
      text: "We have processed all payouts on our end. The delay may be related to the platform's processing queue. We can confirm the funds were released on April 1st.",
      respondedDate: "Apr 10, 2026",
    },
    timeline: [
      { date: "Apr 9, 2026 16:42", event: "Dispute filed", note: "Creator reported missing payout" },
      { date: "Apr 9, 2026 16:45", event: "Brand notified" },
      { date: "Apr 10, 2026 10:15", event: "Brand responded" },
      { date: "Apr 10, 2026 11:00", event: "Assigned to reviewer", note: "Assigned to Sarah K. for investigation" },
      { date: "Apr 10, 2026 14:30", event: "Under review", note: "Checking payment gateway logs" },
    ],
  },
  {
    id: "dsp-003",
    title: "Wrong payout amount",
    type: "wrong_amount",
    status: "resolved",
    priority: "medium",
    creator: { name: "Mia Santos", avatar: "https://i.pravatar.cc/40?u=mia", handle: "@miasantos" },
    brand: { name: "NovaPay", logo: "https://logo.clearbit.com/novapay.ua" },
    campaign: "NovaPay Wallet Clipping",
    amount: 800,
    filedDate: "Apr 5, 2026",
    timeSince: "8 days ago",
    description: "I was paid $200 instead of the agreed $1,000 for my video. The campaign rate card clearly states $1,000 per approved video over 10K views. My video got 28K views.",
    evidence: [
      { name: "rate_card_screenshot.png", type: "screenshot" },
      { name: "payment_receipt.png", type: "screenshot" },
    ],
    submissionId: "sub-3655",
    brandResponse: {
      text: "We acknowledge the discrepancy. The $200 payment was an error in our batch processing. We will issue the remaining $800 immediately.",
      campaignRules: "Rate: $1,000 per approved video exceeding 10K views within 7 days of posting.",
      respondedDate: "Apr 6, 2026",
    },
    timeline: [
      { date: "Apr 5, 2026 11:20", event: "Dispute filed", note: "Creator reported wrong payout amount" },
      { date: "Apr 5, 2026 11:25", event: "Brand notified" },
      { date: "Apr 6, 2026 09:00", event: "Brand responded", note: "Acknowledged error" },
      { date: "Apr 6, 2026 10:30", event: "Resolved", note: "Brand agreed to pay remaining $800. Sided with creator." },
    ],
    resolution: {
      outcome: "side_creator",
      compensationAmount: 800,
      note: "Brand acknowledged the payment error. Remaining $800 has been processed.",
    },
  },
  {
    id: "dsp-004",
    title: "Late payment dispute",
    type: "late_payment",
    status: "escalated",
    priority: "high",
    creator: { name: "Tyler Brooks", avatar: "https://i.pravatar.cc/40?u=tyler", handle: "@tylerbrooks" },
    brand: { name: "FanDuel", logo: "https://logo.clearbit.com/fanduel.com" },
    campaign: "FanDuel March Madness Clips",
    amount: 5000,
    filedDate: "Apr 3, 2026",
    timeSince: "10 days ago",
    description: "Payment was due on March 15th per our agreement but it is now April and I still haven't received anything. I've reached out to the brand multiple times with no response. This is affecting my ability to pay my bills.",
    evidence: [
      { name: "contract_terms.pdf", type: "document" },
      { name: "email_thread.png", type: "screenshot" },
      { name: "dm_screenshots.png", type: "screenshot" },
    ],
    timeline: [
      { date: "Apr 3, 2026 08:00", event: "Dispute filed", note: "Creator reported late payment — 19 days overdue" },
      { date: "Apr 3, 2026 08:05", event: "Brand notified" },
      { date: "Apr 5, 2026 08:05", event: "Reminder sent", note: "Second notification to brand" },
      { date: "Apr 8, 2026 09:00", event: "Escalated", note: "No brand response after 5 days — escalated to senior admin" },
    ],
  },
  {
    id: "dsp-005",
    title: "Content theft claim",
    type: "content_theft",
    status: "open",
    priority: "medium",
    creator: { name: "Emma Wilson", avatar: "https://i.pravatar.cc/40?u=emma", handle: "@emmawilson" },
    brand: { name: "Celsius", logo: "https://logo.clearbit.com/celsius.com" },
    campaign: "Celsius Summer Vibes",
    amount: 0,
    filedDate: "Apr 10, 2026",
    timeSince: "3 days ago",
    description: "The brand used my content on their official TikTok account without permission and without crediting me. This was not part of our agreement. They also edited the video and removed my watermark.",
    evidence: [
      { name: "original_video.mp4", type: "video" },
      { name: "brand_repost_screenshot.png", type: "screenshot" },
      { name: "contract_usage_rights.pdf", type: "document" },
    ],
    timeline: [
      { date: "Apr 10, 2026 15:30", event: "Dispute filed", note: "Creator reported unauthorized content usage" },
      { date: "Apr 10, 2026 15:35", event: "Brand notified" },
    ],
  },
  {
    id: "dsp-006",
    title: "Rejected submission dispute",
    type: "rejected_submission",
    status: "under_review",
    priority: "low",
    creator: { name: "Liam Nguyen", avatar: "https://i.pravatar.cc/40?u=liam", handle: "@liamnguyen" },
    brand: { name: "Harry Styles", logo: "https://logo.clearbit.com/hstyles.co.uk" },
    campaign: "Harry Styles Podcast Clipping",
    amount: 450,
    filedDate: "Apr 8, 2026",
    timeSince: "5 days ago",
    description: "My clip was rejected for being 'too short' at 58 seconds. The brief says minimum 45 seconds. I think the reviewer made a mistake.",
    evidence: [
      { name: "video_duration_proof.png", type: "screenshot" },
    ],
    submissionId: "sub-4102",
    brandResponse: {
      text: "Upon review, the minimum duration requirement was updated to 60 seconds on March 28th. The creator's submission was received on April 2nd, after the update.",
      campaignRules: "Updated March 28: Minimum clip duration is 60 seconds. Previous minimum was 45 seconds.",
      respondedDate: "Apr 9, 2026",
    },
    timeline: [
      { date: "Apr 8, 2026 12:10", event: "Dispute filed" },
      { date: "Apr 8, 2026 12:15", event: "Brand notified" },
      { date: "Apr 9, 2026 16:00", event: "Brand responded" },
      { date: "Apr 10, 2026 09:30", event: "Under review", note: "Checking when brief was updated vs. submission date" },
    ],
  },
  {
    id: "dsp-007",
    title: "Missing payout claim",
    type: "missing_payout",
    status: "resolved",
    priority: "medium",
    creator: { name: "Sophia Kim", avatar: "https://i.pravatar.cc/40?u=sophia", handle: "@sophiakim" },
    brand: { name: "Call of Duty", logo: "https://logo.clearbit.com/callofduty.com" },
    campaign: "Call of Duty BO7 Clipping",
    amount: 2100,
    filedDate: "Apr 2, 2026",
    timeSince: "11 days ago",
    description: "Three of my approved submissions were not included in the last payout batch. The brand confirmed they were approved but the payment was never processed.",
    evidence: [
      { name: "approval_emails.png", type: "screenshot" },
      { name: "missing_submissions.pdf", type: "document" },
    ],
    submissionId: "sub-3500",
    brandResponse: {
      text: "We confirm these three submissions were approved but missed the payout batch due to a system error on our end. We apologize for the inconvenience.",
      respondedDate: "Apr 3, 2026",
    },
    timeline: [
      { date: "Apr 2, 2026 10:00", event: "Dispute filed" },
      { date: "Apr 2, 2026 10:05", event: "Brand notified" },
      { date: "Apr 3, 2026 14:20", event: "Brand responded", note: "Confirmed system error" },
      { date: "Apr 4, 2026 09:00", event: "Resolved", note: "Payment re-processed. Sided with creator." },
    ],
    resolution: {
      outcome: "side_creator",
      compensationAmount: 2100,
      note: "Brand confirmed system error. Full payment of $2,100 re-processed to creator.",
    },
  },
  {
    id: "dsp-008",
    title: "Wrong payout amount",
    type: "wrong_amount",
    status: "open",
    priority: "low",
    creator: { name: "Marcus Johnson", avatar: "https://i.pravatar.cc/40?u=marcus", handle: "@marcusjohnson" },
    brand: { name: "Kane Brown", logo: "https://logo.clearbit.com/kanebrown.com" },
    campaign: "Kane Brown Clipping",
    amount: 150,
    filedDate: "Apr 12, 2026",
    timeSince: "1 day ago",
    description: "I was supposed to receive a $50 bonus for hitting 50K views but only got the base rate. The campaign page still shows the bonus tier.",
    evidence: [
      { name: "campaign_bonus_tiers.png", type: "screenshot" },
      { name: "view_count_proof.png", type: "screenshot" },
    ],
    submissionId: "sub-4950",
    timeline: [
      { date: "Apr 12, 2026 20:15", event: "Dispute filed", note: "Creator claims missing bonus payment" },
      { date: "Apr 12, 2026 20:20", event: "Brand notified" },
    ],
  },
  {
    id: "dsp-009",
    title: "Content theft claim",
    type: "content_theft",
    status: "escalated",
    priority: "high",
    creator: { name: "Ava Thompson", avatar: "https://i.pravatar.cc/40?u=ava", handle: "@avathompson" },
    brand: { name: "Diary of a CEO", logo: "https://logo.clearbit.com/stevenBartlett.com" },
    campaign: "Diary of a CEO Clipping",
    amount: 0,
    filedDate: "Apr 6, 2026",
    timeSince: "7 days ago",
    description: "The brand is running paid ads using my clips without any licensing agreement. These are being used across Instagram and TikTok with significant ad spend. I did not consent to paid promotional use of my content.",
    evidence: [
      { name: "ad_library_screenshot.png", type: "screenshot" },
      { name: "original_clip.mp4", type: "video" },
      { name: "instagram_ad_proof.png", type: "screenshot" },
    ],
    brandResponse: {
      text: "Our marketing team used the clips under what they believed was the standard usage rights in the campaign agreement. We are reviewing the terms internally.",
      respondedDate: "Apr 7, 2026",
    },
    timeline: [
      { date: "Apr 6, 2026 11:00", event: "Dispute filed", note: "Creator reported unauthorized ad usage" },
      { date: "Apr 6, 2026 11:05", event: "Brand notified" },
      { date: "Apr 7, 2026 15:40", event: "Brand responded" },
      { date: "Apr 8, 2026 10:00", event: "Escalated", note: "Content theft with paid ad usage — requires legal review" },
    ],
  },
  {
    id: "dsp-010",
    title: "Late payment dispute",
    type: "late_payment",
    status: "resolved",
    priority: "medium",
    creator: { name: "Noah Park", avatar: "https://i.pravatar.cc/40?u=noah", handle: "@noahpark" },
    brand: { name: "Polymarket", logo: "https://logo.clearbit.com/polymarket.com" },
    campaign: "Polymarket Clipping Campaign",
    amount: 1800,
    filedDate: "Apr 1, 2026",
    timeSince: "12 days ago",
    description: "Payment was 10 days late. Campaign terms state payment within 14 days of approval, but it took 24 days.",
    evidence: [
      { name: "approval_date_proof.png", type: "screenshot" },
    ],
    brandResponse: {
      text: "We apologize for the delay. This was due to a change in our payment processing partner. The payment has now been sent.",
      respondedDate: "Apr 2, 2026",
    },
    timeline: [
      { date: "Apr 1, 2026 14:00", event: "Dispute filed" },
      { date: "Apr 1, 2026 14:05", event: "Brand notified" },
      { date: "Apr 2, 2026 11:30", event: "Brand responded", note: "Payment sent" },
      { date: "Apr 3, 2026 09:00", event: "Resolved", note: "Payment confirmed received. Partial resolution — no late fee applied." },
    ],
    resolution: {
      outcome: "partial",
      compensationAmount: 1800,
      note: "Payment received but no late fee penalty applied. Both parties agreed to move forward.",
    },
  },
];

// ── Helpers ─────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<DisputeStatus, { label: string; bg: string; text: string; dot: string }> = {
  open: { label: "Open", bg: "rgba(255,128,3,0.08)", text: "#FF8003", dot: "#FF8003" },
  under_review: { label: "Under Review", bg: "rgba(96,165,250,0.08)", text: "#60A5FA", dot: "#60A5FA" },
  resolved: { label: "Resolved", bg: "rgba(0,178,89,0.08)", text: "#00B259", dot: "#00B259" },
  escalated: { label: "Escalated", bg: "rgba(255,37,37,0.08)", text: "#FF2525", dot: "#FF2525" },
};

const PRIORITY_CONFIG: Record<DisputePriority, { label: string; dot: string }> = {
  high: { label: "High", dot: "#FF2525" },
  medium: { label: "Medium", dot: "#FF8003" },
  low: { label: "Low", dot: "#9CA3AF" },
};

const TYPE_CONFIG: Record<DisputeType, string> = {
  rejected_submission: "Rejected Submission",
  missing_payout: "Missing Payout",
  wrong_amount: "Wrong Amount",
  late_payment: "Late Payment",
  content_theft: "Content Theft",
};

const OUTCOME_CONFIG: Record<ResolutionOutcome, { label: string; color: string }> = {
  side_creator: { label: "Side with Creator", color: "#00B259" },
  side_brand: { label: "Side with Brand", color: "#60A5FA" },
  partial: { label: "Partial Resolution", color: "#FF8003" },
  dismiss: { label: "Dismiss", color: "#9CA3AF" },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

// ── Tabs ─────────────────────────────────────────────────────────────

const TABS = ["All", "Open", "Under Review", "Resolved", "Escalated"];

const TAB_STATUS_MAP: Record<string, DisputeStatus | null> = {
  All: null,
  Open: "open",
  "Under Review": "under_review",
  Resolved: "resolved",
  Escalated: "escalated",
};

// ── Page ─────────────────────────────────────────────────────────────

export default function AdminDisputesPage() {
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [selectedTab, setSelectedTab] = useState(0);
  const [detailDispute, setDetailDispute] = useState<Dispute | null>(null);
  const [auditSheet, setAuditSheet] = useState<{ open: boolean; id: string; title: string }>({ open: false, id: "", title: "" });

  // Resolution form state
  const [resolutionOutcome, setResolutionOutcome] = useState<ResolutionOutcome>("side_creator");
  const [resolutionAmount, setResolutionAmount] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [notifyParties, setNotifyParties] = useState(true);

  // Proximity hover
  const listRef = useRef<HTMLDivElement>(null);
  const { activeIndex, handlers, registerItem } = useProximityHover(listRef);

  // Derived
  const statusFilter = TAB_STATUS_MAP[TABS[selectedTab]];
  const filteredDisputes = statusFilter ? disputes.filter((d) => d.status === statusFilter) : disputes;

  const stats = {
    open: disputes.filter((d) => d.status === "open").length,
    under_review: disputes.filter((d) => d.status === "under_review").length,
    resolved: disputes.filter((d) => d.status === "resolved").length,
    escalated: disputes.filter((d) => d.status === "escalated").length,
  };

  // ── Handlers ────────────────────────────────────────────────────────

  const updateDisputeStatus = useCallback((id: string, status: DisputeStatus) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              timeline: [
                ...d.timeline,
                {
                  date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
                  event: status === "resolved" ? "Resolved" : status === "escalated" ? "Escalated" : status === "under_review" ? "Under review" : "Reopened",
                  note: "Updated by admin",
                },
              ],
            }
          : d
      )
    );
    if (detailDispute?.id === id) {
      setDetailDispute((prev) => prev ? { ...prev, status } : null);
    }
  }, [detailDispute]);

  const handleResolve = useCallback(async (dispute: Dispute) => {
    if (!resolutionNote.trim()) {
      toast("Please add a resolution note");
      return;
    }
    const ok = await confirm({
      title: "Resolve this dispute?",
      message: `This will resolve the dispute "${dispute.title}" with outcome: ${OUTCOME_CONFIG[resolutionOutcome].label}. Both parties will be notified.`,
      confirmLabel: "Resolve",
      destructive: false,
    });
    if (!ok) return;

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === dispute.id
          ? {
              ...d,
              status: "resolved" as DisputeStatus,
              resolution: {
                outcome: resolutionOutcome,
                compensationAmount: resolutionAmount ? parseFloat(resolutionAmount) : undefined,
                note: resolutionNote,
              },
              timeline: [
                ...d.timeline,
                {
                  date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
                  event: "Resolved",
                  note: `${OUTCOME_CONFIG[resolutionOutcome].label}${resolutionAmount ? ` — ${formatCurrency(parseFloat(resolutionAmount))} compensation` : ""}`,
                },
              ],
            }
          : d
      )
    );
    setDetailDispute(null);
    setResolutionOutcome("side_creator");
    setResolutionAmount("");
    setResolutionNote("");
    toast("Dispute resolved successfully");
  }, [resolutionOutcome, resolutionAmount, resolutionNote, confirm, toast]);

  const handleEscalate = useCallback(async (dispute: Dispute) => {
    const ok = await confirm({
      title: "Escalate this dispute?",
      message: `This will escalate "${dispute.title}" to senior administration for review.`,
      confirmLabel: "Escalate",
      destructive: false,
    });
    if (!ok) return;
    updateDisputeStatus(dispute.id, "escalated");
    toast("Dispute escalated to senior admin");
  }, [confirm, updateDisputeStatus, toast]);

  const handleRequestInfo = useCallback((dispute: Dispute) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === dispute.id
          ? {
              ...d,
              timeline: [
                ...d.timeline,
                {
                  date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
                  event: "More info requested",
                  note: "Admin requested additional information from both parties",
                },
              ],
            }
          : d
      )
    );
    toast("Request for more information sent to both parties");
  }, [toast]);

  const handleExport = useCallback(() => {
    toast("CSV export started — download will begin shortly");
  }, [toast]);

  const openDetail = useCallback((dispute: Dispute) => {
    setDetailDispute(dispute);
    setResolutionOutcome(dispute.resolution?.outcome ?? "side_creator");
    setResolutionAmount(dispute.resolution?.compensationAmount?.toString() ?? "");
    setResolutionNote(dispute.resolution?.note ?? "");
    setNotifyParties(true);
  }, []);

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Disputes
          </span>
          <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
            {stats.open} open dispute{stats.open !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] px-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-6 pt-4 sm:px-6">
        {/* ── Stats Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Open", count: stats.open, color: "#FF8003" },
            { label: "Under Review", count: stats.under_review, color: "#60A5FA" },
            { label: "Resolved", count: stats.resolved, color: "#00B259" },
            { label: "Escalated", count: stats.escalated, color: "#FF2525" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
            >
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ background: stat.color }} />
                <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                  {stat.label}
                </span>
              </div>
              <div className="mt-2">
                <span className="font-[family-name:var(--font-inter)] text-xl font-semibold tabular-nums tracking-[-0.02em] text-page-text">
                  {stat.count}
                </span>
                <span className="ml-2 font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted">
                  dispute{stat.count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab Filters ────────────────────────────────────────── */}
        <div className="overflow-x-auto scrollbar-hide md:hidden" style={{ scrollbarWidth: "none" }}>
          <Tabs selectedIndex={selectedTab} onSelect={setSelectedTab} className="w-max">
            {TABS.map((tab, i) => (
              <TabItem key={tab} label={tab} index={i} />
            ))}
          </Tabs>
        </div>
        <div className="hidden md:flex">
          <Tabs selectedIndex={selectedTab} onSelect={setSelectedTab} className="w-fit">
            {TABS.map((tab, i) => (
              <TabItem key={tab} label={tab} index={i} />
            ))}
          </Tabs>
        </div>

        {/* ── Dispute Cards ─────────────────────────────────────── */}
        <div ref={listRef} {...handlers} className="flex flex-col gap-3">
          {filteredDisputes.length === 0 && (
            <div className="flex items-center justify-center rounded-2xl border border-foreground/[0.06] bg-white py-16 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
              <span className="text-sm text-page-text-muted">No disputes found</span>
            </div>
          )}
          {filteredDisputes.map((dispute, index) => {
            const statusCfg = STATUS_CONFIG[dispute.status];
            const priorityCfg = PRIORITY_CONFIG[dispute.priority];

            return (
              <div
                key={dispute.id}
                ref={(el) => registerItem(index, el)}
                onClick={() => openDetail(dispute)}
                className="relative cursor-pointer overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
              >
                {/* Proximity hover indicator */}
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      layoutId="dispute-hover"
                      className="pointer-events-none absolute inset-0 bg-foreground/[0.02]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={springs.fast}
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-[1] p-4">
                  {/* Top row: priority + title + status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-2.5">
                      <div className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: priorityCfg.dot }} title={`${priorityCfg.label} priority`} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                          {dispute.title}
                        </h3>
                        <span className="mt-0.5 inline-block font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                          {TYPE_CONFIG[dispute.type]}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {dispute.amount > 0 && (
                        <span className="font-[family-name:var(--font-inter)] text-sm font-medium tabular-nums tracking-[-0.02em] text-page-text">
                          {formatCurrency(dispute.amount)}
                        </span>
                      )}
                      <span
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                        style={{ background: statusCfg.bg, color: statusCfg.text }}
                      >
                        <span className="size-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Middle row: creator + brand + campaign */}
                  <div className="mt-3 flex items-center gap-4">
                    {/* Creator */}
                    <div className="flex min-w-0 items-center gap-2">
                      <img src={dispute.creator.avatar} alt="" className="size-6 shrink-0 rounded-full object-cover" />
                      <span className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text">
                        {dispute.creator.name}
                      </span>
                    </div>

                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-page-text-muted">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    {/* Brand */}
                    <div className="flex min-w-0 items-center gap-2">
                      <img src={dispute.brand.logo} alt="" className="size-6 shrink-0 rounded-full bg-foreground/[0.04] object-contain p-0.5" />
                      <span className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text">
                        {dispute.brand.name}
                      </span>
                    </div>

                    <span className="hidden shrink-0 font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-subtle sm:inline">
                      {dispute.campaign}
                    </span>
                  </div>

                  {/* Bottom row: date + kebab */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-subtle">
                      Filed {dispute.filedDate} · {dispute.timeSince}
                    </span>

                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-page-text-muted transition-colors hover:bg-foreground/[0.06]">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="5" r="1.5" />
                              <circle cx="12" cy="12" r="1.5" />
                              <circle cx="12" cy="19" r="1.5" />
                            </svg>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[160px]">
                          <DropdownMenuItem onClick={() => openDetail(dispute)}>
                            View details
                          </DropdownMenuItem>
                          {dispute.status === "open" && (
                            <DropdownMenuItem onClick={() => { updateDisputeStatus(dispute.id, "under_review"); toast("Dispute moved to under review"); }}>
                              Start review
                            </DropdownMenuItem>
                          )}
                          {dispute.status !== "escalated" && dispute.status !== "resolved" && (
                            <DropdownMenuItem onClick={() => handleEscalate(dispute)}>
                              Escalate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => setAuditSheet({ open: true, id: dispute.id, title: dispute.title })}>
                            View audit log
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Detail Modal ───────────────────────────────────────────── */}
      <Modal open={!!detailDispute} onClose={() => setDetailDispute(null)} size="lg">
        {detailDispute && (() => {
          const statusCfg = STATUS_CONFIG[detailDispute.status];
          const priorityCfg = PRIORITY_CONFIG[detailDispute.priority];
          return (
            <>
              <ModalHeader>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="size-2.5 shrink-0 rounded-full" style={{ background: priorityCfg.dot }} />
                  <div className="min-w-0">
                    <h2 className="truncate font-[family-name:var(--font-inter)] text-base font-semibold tracking-[-0.02em] text-page-text">
                      {detailDispute.title}
                    </h2>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                        {TYPE_CONFIG[detailDispute.type]}
                      </span>
                      <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-subtle">
                        · {detailDispute.id}
                      </span>
                    </div>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="space-y-5">
                {/* Split view: Creator claim + Brand response */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Left: Creator's claim */}
                  <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-2.5">
                      <img src={detailDispute.creator.avatar} alt="" className="size-8 rounded-full object-cover" />
                      <div>
                        <div className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                          {detailDispute.creator.name}
                        </div>
                        <div className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                          {detailDispute.creator.handle}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="inline-block rounded-full bg-foreground/[0.06] px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em] text-page-text-muted">
                        {TYPE_CONFIG[detailDispute.type]}
                      </span>
                    </div>

                    <p className="mt-3 font-[family-name:var(--font-inter)] text-sm leading-relaxed tracking-[-0.02em] text-page-text">
                      {detailDispute.description}
                    </p>

                    {/* Evidence */}
                    {detailDispute.evidence.length > 0 && (
                      <div className="mt-4">
                        <h4 className="mb-2 font-[family-name:var(--font-inter)] text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                          Evidence
                        </h4>
                        <div className="space-y-1.5">
                          {detailDispute.evidence.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 rounded-lg bg-foreground/[0.03] px-3 py-2 dark:bg-white/[0.03]">
                              {item.type === "screenshot" && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-page-text-muted">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                              )}
                              {item.type === "video" && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-page-text-muted">
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                              )}
                              {item.type === "document" && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-page-text-muted">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                              )}
                              <span className="min-w-0 truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text">
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submission link */}
                    {detailDispute.submissionId && (
                      <div className="mt-3">
                        <span className="font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-muted">
                          Submission:{" "}
                        </span>
                        <span className="font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em] text-[#FF8003]">
                          {detailDispute.submissionId}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Brand's response */}
                  <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-2.5">
                      <img src={detailDispute.brand.logo} alt="" className="size-8 rounded-full bg-foreground/[0.04] object-contain p-1" />
                      <div>
                        <div className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                          {detailDispute.brand.name}
                        </div>
                        <div className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                          Brand
                        </div>
                      </div>
                    </div>

                    {detailDispute.brandResponse ? (
                      <>
                        <p className="mt-3 font-[family-name:var(--font-inter)] text-sm leading-relaxed tracking-[-0.02em] text-page-text">
                          {detailDispute.brandResponse.text}
                        </p>

                        {detailDispute.brandResponse.campaignRules && (
                          <div className="mt-3 rounded-lg border border-foreground/[0.06] bg-foreground/[0.02] p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                            <h5 className="mb-1.5 font-[family-name:var(--font-inter)] text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                              Campaign Rules Excerpt
                            </h5>
                            <p className="font-[family-name:var(--font-inter)] text-xs leading-relaxed tracking-[-0.02em] text-page-text-muted">
                              {detailDispute.brandResponse.campaignRules}
                            </p>
                          </div>
                        )}

                        <div className="mt-3 font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-subtle">
                          Responded {detailDispute.brandResponse.respondedDate}
                        </div>
                      </>
                    ) : (
                      <div className="mt-6 flex flex-col items-center justify-center py-8">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-page-text-subtle">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="mt-2 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text-muted">
                          Awaiting response
                        </span>
                        <span className="mt-0.5 font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-subtle">
                          Brand has been notified
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Status</span>
                    <span
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                      style={{ background: statusCfg.bg, color: statusCfg.text }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Priority</span>
                    <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text">
                      <span className="size-1.5 rounded-full" style={{ background: priorityCfg.dot }} />
                      {priorityCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Campaign</span>
                    <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text">{detailDispute.campaign}</span>
                  </div>
                  {detailDispute.amount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Amount</span>
                      <span className="font-[family-name:var(--font-inter)] text-sm font-medium tabular-nums tracking-[-0.02em] text-page-text">{formatCurrency(detailDispute.amount)}</span>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                    Activity Timeline
                  </h4>
                  <div className="space-y-0">
                    {detailDispute.timeline.map((entry, i) => (
                      <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                        {i < detailDispute.timeline.length - 1 && (
                          <div className="absolute left-[5px] top-[14px] h-[calc(100%-6px)] w-px bg-foreground/[0.06] dark:bg-white/[0.06]" />
                        )}
                        <div className="relative z-[1] mt-[5px] size-[11px] shrink-0 rounded-full border-2 border-foreground/[0.12] bg-white dark:border-white/[0.12] dark:bg-card-bg" />
                        <div className="min-w-0 flex-1">
                          <div className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text">
                            {entry.event}
                          </div>
                          {entry.note && (
                            <div className="mt-0.5 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                              {entry.note}
                            </div>
                          )}
                          <div className="mt-0.5 font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-subtle">
                            {entry.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resolution form (only if not resolved) */}
                {detailDispute.status !== "resolved" && (
                  <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <h4 className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                      Resolution
                    </h4>

                    <div className="space-y-3">
                      {/* Outcome dropdown */}
                      <div>
                        <label className="mb-1 block font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                          Outcome
                        </label>
                        <select
                          value={resolutionOutcome}
                          onChange={(e) => setResolutionOutcome(e.target.value as ResolutionOutcome)}
                          className="h-9 w-full rounded-lg border border-foreground/[0.08] bg-white px-3 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text outline-none focus:border-[#FF8003] dark:border-white/[0.08] dark:bg-card-bg"
                        >
                          {(Object.keys(OUTCOME_CONFIG) as ResolutionOutcome[]).map((key) => (
                            <option key={key} value={key}>
                              {OUTCOME_CONFIG[key].label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Compensation amount */}
                      <div>
                        <label className="mb-1 block font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                          Compensation amount (optional)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-[family-name:var(--font-inter)] text-sm text-page-text-muted">$</span>
                          <input
                            type="number"
                            value={resolutionAmount}
                            onChange={(e) => setResolutionAmount(e.target.value)}
                            placeholder="0.00"
                            className="h-9 w-full rounded-lg border border-foreground/[0.08] bg-white pl-7 pr-3 font-[family-name:var(--font-inter)] text-sm tabular-nums tracking-[-0.02em] text-page-text outline-none focus:border-[#FF8003] dark:border-white/[0.08] dark:bg-card-bg"
                          />
                        </div>
                      </div>

                      {/* Note */}
                      <div>
                        <label className="mb-1 block font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                          Resolution note
                        </label>
                        <textarea
                          value={resolutionNote}
                          onChange={(e) => setResolutionNote(e.target.value)}
                          placeholder="Describe the resolution and reasoning..."
                          rows={3}
                          className="w-full resize-none rounded-lg border border-foreground/[0.08] bg-white px-3 py-2 font-[family-name:var(--font-inter)] text-sm leading-relaxed tracking-[-0.02em] text-page-text outline-none focus:border-[#FF8003] dark:border-white/[0.08] dark:bg-card-bg"
                        />
                      </div>

                      {/* Notify toggle */}
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                          Notify both parties
                        </span>
                        <button
                          type="button"
                          onClick={() => setNotifyParties(!notifyParties)}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                            notifyParties ? "bg-[#FF8003]" : "bg-foreground/[0.12]"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform",
                              notifyParties ? "translate-x-[18px]" : "translate-x-[3px]"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show resolution if already resolved */}
                {detailDispute.status === "resolved" && detailDispute.resolution && (
                  <div className="rounded-xl border border-[rgba(0,178,89,0.2)] bg-[rgba(0,178,89,0.04)] p-4">
                    <h4 className="mb-2 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-[#00B259]">
                      Resolution
                    </h4>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                        style={{
                          background: `${OUTCOME_CONFIG[detailDispute.resolution.outcome].color}14`,
                          color: OUTCOME_CONFIG[detailDispute.resolution.outcome].color,
                        }}
                      >
                        {OUTCOME_CONFIG[detailDispute.resolution.outcome].label}
                      </span>
                      {detailDispute.resolution.compensationAmount && (
                        <span className="font-[family-name:var(--font-inter)] text-sm font-medium tabular-nums tracking-[-0.02em] text-page-text">
                          {formatCurrency(detailDispute.resolution.compensationAmount)}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-[family-name:var(--font-inter)] text-sm leading-relaxed tracking-[-0.02em] text-page-text">
                      {detailDispute.resolution.note}
                    </p>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRequestInfo(detailDispute)}
                    className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                  >
                    Request More Info
                  </button>
                  <button
                    onClick={() => setAuditSheet({ open: true, id: detailDispute.id, title: detailDispute.title })}
                    className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                  >
                    Audit Log
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {detailDispute.status !== "escalated" && detailDispute.status !== "resolved" && (
                    <button
                      onClick={() => handleEscalate(detailDispute)}
                      className="cursor-pointer rounded-full border border-[#FF8003]/30 bg-[#FF8003]/10 px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-[#FF8003] transition-colors hover:bg-[#FF8003]/20"
                    >
                      Escalate
                    </button>
                  )}
                  {detailDispute.status !== "resolved" && (
                    <button
                      onClick={() => handleResolve(detailDispute)}
                      className="cursor-pointer rounded-full px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
                      style={{
                        background: resolutionOutcome === "side_creator" || resolutionOutcome === "partial" ? "#FF8003" : resolutionOutcome === "side_brand" ? "#60A5FA" : "#9CA3AF",
                      }}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </ModalFooter>
            </>
          );
        })()}
      </Modal>

      {/* ── Audit Log Sheet ────────────────────────────────────────── */}
      <AuditLogSheet
        open={auditSheet.open}
        onClose={() => setAuditSheet({ open: false, id: "", title: "" })}
        entityType="dispute"
        entityId={auditSheet.id}
        entityTitle={auditSheet.title}
      />
    </div>
  );
}
