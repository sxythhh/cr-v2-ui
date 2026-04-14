// @ts-nocheck
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";
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

type ModerationStatus = "pending" | "flagged" | "approved" | "rejected";
type Platform = "tiktok" | "instagram";
type FlagType = "low_quality" | "possible_repost" | "copyright_risk" | "inappropriate" | "off_topic";

interface Submission {
  id: string;
  creator: {
    name: string;
    avatar: string;
    handle: string;
  };
  campaign: string;
  platform: Platform;
  status: ModerationStatus;
  submittedAt: string;
  submittedAgo: string;
  thumbnail: string;
  duration: string;
  views: number | null;
  hashtags: string[];
  flags: FlagType[];
  autoDetection: {
    qualityScore: number;
    repostProbability: number;
    copyrightFlags: string[];
  };
  previousSubmissions: { id: string; campaign: string; status: ModerationStatus; date: string }[];
  rejectReason?: string;
}

// ── Flag config ─────────────────────────────────────────────────────

const FLAG_CONFIG: Record<FlagType, { label: string; bg: string; text: string }> = {
  low_quality: { label: "Low quality", bg: "rgba(255,37,37,0.08)", text: "#FF2525" },
  possible_repost: { label: "Possible repost", bg: "rgba(255,128,3,0.08)", text: "#FF8003" },
  copyright_risk: { label: "Copyright risk", bg: "rgba(255,37,37,0.08)", text: "#FF2525" },
  inappropriate: { label: "Inappropriate", bg: "rgba(255,37,37,0.08)", text: "#FF2525" },
  off_topic: { label: "Off-topic", bg: "rgba(255,128,3,0.08)", text: "#FF8003" },
};

const STATUS_CONFIG: Record<ModerationStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: "Pending Review", bg: "rgba(255,128,3,0.08)", text: "#FF8003", dot: "#FF8003" },
  flagged: { label: "Flagged", bg: "rgba(255,37,37,0.08)", text: "#FF2525", dot: "#FF2525" },
  approved: { label: "Approved", bg: "rgba(0,178,89,0.08)", text: "#00B259", dot: "#00B259" },
  rejected: { label: "Rejected", bg: "rgba(255,37,37,0.08)", text: "#FF2525", dot: "#FF2525" },
};

const REJECT_REASONS = [
  "Low quality",
  "Off-topic",
  "Copyright violation",
  "Inappropriate content",
  "Duplicate/repost",
  "Does not meet guidelines",
  "Other",
];

// ── Mock Data ───────────────────────────────────────────────────────

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sub-001",
    creator: { name: "Alex Rivera", avatar: "https://i.pravatar.cc/40?u=alex", handle: "@alexrivera" },
    campaign: "Harry Styles Podcast Clipping",
    platform: "tiktok",
    status: "pending",
    submittedAt: "Apr 13, 2026 10:32",
    submittedAgo: "2 hours ago",
    thumbnail: "https://picsum.photos/seed/sub1/640/360",
    duration: "0:47",
    views: null,
    hashtags: ["#harrystyles", "#podcast", "#clip"],
    flags: [],
    autoDetection: { qualityScore: 92, repostProbability: 5, copyrightFlags: [] },
    previousSubmissions: [
      { id: "prev-1", campaign: "Kane Brown Clipping", status: "approved", date: "Apr 8, 2026" },
      { id: "prev-2", campaign: "GYMSHARK Clipping", status: "approved", date: "Apr 3, 2026" },
    ],
  },
  {
    id: "sub-002",
    creator: { name: "Jordan Chen", avatar: "https://i.pravatar.cc/40?u=jordan", handle: "@jordanchen" },
    campaign: "Call of Duty BO7 Clipping",
    platform: "instagram",
    status: "flagged",
    submittedAt: "Apr 13, 2026 09:15",
    submittedAgo: "3 hours ago",
    thumbnail: "https://picsum.photos/seed/sub2/640/360",
    duration: "1:12",
    views: null,
    hashtags: ["#cod", "#bo7", "#gaming"],
    flags: ["possible_repost", "low_quality"],
    autoDetection: { qualityScore: 41, repostProbability: 78, copyrightFlags: [] },
    previousSubmissions: [
      { id: "prev-3", campaign: "Call of Duty BO7 Clipping", status: "rejected", date: "Apr 10, 2026" },
      { id: "prev-4", campaign: "Polymarket Clipping Campaign", status: "approved", date: "Apr 5, 2026" },
    ],
  },
  {
    id: "sub-003",
    creator: { name: "Mia Santos", avatar: "https://i.pravatar.cc/40?u=mia", handle: "@miasantos" },
    campaign: "GYMSHARK Clipping",
    platform: "tiktok",
    status: "pending",
    submittedAt: "Apr 13, 2026 08:44",
    submittedAgo: "4 hours ago",
    thumbnail: "https://picsum.photos/seed/sub3/640/360",
    duration: "0:33",
    views: null,
    hashtags: ["#gymshark", "#fitness", "#workout"],
    flags: [],
    autoDetection: { qualityScore: 87, repostProbability: 2, copyrightFlags: [] },
    previousSubmissions: [
      { id: "prev-5", campaign: "GYMSHARK Clipping", status: "approved", date: "Apr 7, 2026" },
    ],
  },
  {
    id: "sub-004",
    creator: { name: "Tyler Brooks", avatar: "https://i.pravatar.cc/40?u=tyler", handle: "@tylerbrooks" },
    campaign: "Polymarket Clipping Campaign",
    platform: "tiktok",
    status: "flagged",
    submittedAt: "Apr 13, 2026 07:20",
    submittedAgo: "5 hours ago",
    thumbnail: "https://picsum.photos/seed/sub4/640/360",
    duration: "0:58",
    views: null,
    hashtags: ["#polymarket", "#prediction", "#crypto"],
    flags: ["copyright_risk"],
    autoDetection: { qualityScore: 73, repostProbability: 12, copyrightFlags: ["Background music match: 94% — 'Blinding Lights' by The Weeknd"] },
    previousSubmissions: [
      { id: "prev-6", campaign: "NovaPay Wallet Clipping", status: "approved", date: "Apr 6, 2026" },
      { id: "prev-7", campaign: "Polymarket Clipping Campaign", status: "approved", date: "Apr 1, 2026" },
      { id: "prev-8", campaign: "Kane Brown Clipping", status: "rejected", date: "Mar 28, 2026" },
    ],
  },
  {
    id: "sub-005",
    creator: { name: "Emma Wilson", avatar: "https://i.pravatar.cc/40?u=emma", handle: "@emmawilson" },
    campaign: "NovaPay Wallet Clipping",
    platform: "instagram",
    status: "approved",
    submittedAt: "Apr 12, 2026 18:30",
    submittedAgo: "18 hours ago",
    thumbnail: "https://picsum.photos/seed/sub5/640/360",
    duration: "0:41",
    views: 12400,
    hashtags: ["#novapay", "#fintech", "#wallet"],
    flags: [],
    autoDetection: { qualityScore: 95, repostProbability: 1, copyrightFlags: [] },
    previousSubmissions: [
      { id: "prev-9", campaign: "NovaPay Wallet Clipping", status: "approved", date: "Apr 9, 2026" },
    ],
  },
  {
    id: "sub-006",
    creator: { name: "Liam Nguyen", avatar: "https://i.pravatar.cc/40?u=liam", handle: "@liamnguyen" },
    campaign: "Kane Brown Clipping",
    platform: "tiktok",
    status: "rejected",
    submittedAt: "Apr 12, 2026 16:05",
    submittedAgo: "20 hours ago",
    thumbnail: "https://picsum.photos/seed/sub6/640/360",
    duration: "1:30",
    views: null,
    hashtags: ["#kanebrown", "#country", "#music"],
    flags: ["low_quality", "off_topic"],
    autoDetection: { qualityScore: 28, repostProbability: 8, copyrightFlags: [] },
    previousSubmissions: [],
    rejectReason: "Low quality",
  },
  {
    id: "sub-007",
    creator: { name: "Sophia Kim", avatar: "https://i.pravatar.cc/40?u=sophia", handle: "@sophiakim" },
    campaign: "Diary of a CEO Clipping",
    platform: "tiktok",
    status: "pending",
    submittedAt: "Apr 13, 2026 11:00",
    submittedAgo: "1 hour ago",
    thumbnail: "https://picsum.photos/seed/sub7/640/360",
    duration: "0:55",
    views: null,
    hashtags: ["#diaryofaceo", "#stevenbartlett", "#podcast"],
    flags: [],
    autoDetection: { qualityScore: 89, repostProbability: 3, copyrightFlags: [] },
    previousSubmissions: [
      { id: "prev-10", campaign: "Diary of a CEO Clipping", status: "approved", date: "Apr 4, 2026" },
      { id: "prev-11", campaign: "Harry Styles Podcast Clipping", status: "approved", date: "Mar 30, 2026" },
    ],
  },
  {
    id: "sub-008",
    creator: { name: "Marcus Johnson", avatar: "https://i.pravatar.cc/40?u=marcus", handle: "@marcusjohnson" },
    campaign: "GYMSHARK Clipping",
    platform: "instagram",
    status: "pending",
    submittedAt: "Apr 13, 2026 10:50",
    submittedAgo: "2 hours ago",
    thumbnail: "https://picsum.photos/seed/sub8/640/360",
    duration: "0:38",
    views: null,
    hashtags: ["#gymshark", "#gains", "#gym"],
    flags: ["possible_repost"],
    autoDetection: { qualityScore: 65, repostProbability: 62, copyrightFlags: [] },
    previousSubmissions: [
      { id: "prev-12", campaign: "GYMSHARK Clipping", status: "rejected", date: "Apr 11, 2026" },
    ],
  },
  {
    id: "sub-009",
    creator: { name: "Ava Thompson", avatar: "https://i.pravatar.cc/40?u=ava", handle: "@avathompson" },
    campaign: "Call of Duty BO7 Clipping",
    platform: "tiktok",
    status: "approved",
    submittedAt: "Apr 12, 2026 14:22",
    submittedAgo: "22 hours ago",
    thumbnail: "https://picsum.photos/seed/sub9/640/360",
    duration: "0:45",
    views: 8700,
    hashtags: ["#cod", "#gaming", "#bo7clips"],
    flags: [],
    autoDetection: { qualityScore: 91, repostProbability: 4, copyrightFlags: [] },
    previousSubmissions: [
      { id: "prev-13", campaign: "Call of Duty BO7 Clipping", status: "approved", date: "Apr 8, 2026" },
    ],
  },
  {
    id: "sub-010",
    creator: { name: "Noah Park", avatar: "https://i.pravatar.cc/40?u=noah", handle: "@noahpark" },
    campaign: "Harry Styles Podcast Clipping",
    platform: "tiktok",
    status: "rejected",
    submittedAt: "Apr 12, 2026 11:10",
    submittedAgo: "1 day ago",
    thumbnail: "https://picsum.photos/seed/sub10/640/360",
    duration: "2:05",
    views: null,
    hashtags: ["#harrystyles", "#podcast"],
    flags: ["inappropriate"],
    autoDetection: { qualityScore: 55, repostProbability: 15, copyrightFlags: [] },
    previousSubmissions: [
      { id: "prev-14", campaign: "Harry Styles Podcast Clipping", status: "approved", date: "Apr 3, 2026" },
    ],
    rejectReason: "Inappropriate content",
  },
  {
    id: "sub-011",
    creator: { name: "Isabella Martinez", avatar: "https://i.pravatar.cc/40?u=isabella", handle: "@isabellamartinez" },
    campaign: "Polymarket Clipping Campaign",
    platform: "instagram",
    status: "pending",
    submittedAt: "Apr 13, 2026 11:45",
    submittedAgo: "45 min ago",
    thumbnail: "https://picsum.photos/seed/sub11/640/360",
    duration: "0:29",
    views: null,
    hashtags: ["#polymarket", "#bets", "#predictions"],
    flags: [],
    autoDetection: { qualityScore: 82, repostProbability: 7, copyrightFlags: [] },
    previousSubmissions: [
      { id: "prev-15", campaign: "NovaPay Wallet Clipping", status: "approved", date: "Apr 9, 2026" },
      { id: "prev-16", campaign: "Polymarket Clipping Campaign", status: "approved", date: "Apr 4, 2026" },
    ],
  },
  {
    id: "sub-012",
    creator: { name: "Ethan Williams", avatar: "https://i.pravatar.cc/40?u=ethan", handle: "@ethanwilliams" },
    campaign: "NovaPay Wallet Clipping",
    platform: "tiktok",
    status: "flagged",
    submittedAt: "Apr 13, 2026 06:30",
    submittedAgo: "6 hours ago",
    thumbnail: "https://picsum.photos/seed/sub12/640/360",
    duration: "1:18",
    views: null,
    hashtags: ["#novapay", "#wallet", "#crypto"],
    flags: ["low_quality", "possible_repost", "copyright_risk"],
    autoDetection: { qualityScore: 34, repostProbability: 85, copyrightFlags: ["Audio fingerprint match: 88% — existing NovaPay ad"] },
    previousSubmissions: [
      { id: "prev-17", campaign: "NovaPay Wallet Clipping", status: "rejected", date: "Apr 2, 2026" },
      { id: "prev-18", campaign: "Kane Brown Clipping", status: "rejected", date: "Mar 28, 2026" },
      { id: "prev-19", campaign: "GYMSHARK Clipping", status: "approved", date: "Mar 20, 2026" },
    ],
  },
];

// ── Platform icons ──────────────────────────────────────────────────

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.3 0 .59.04.86.12V9.01a6.27 6.27 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.4a8.16 8.16 0 0 0 4.78 1.53V7.49a4.85 4.85 0 0 1-1.02-.8Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.5)" />
      <path d="M16 12l12 8-12 8V12z" fill="white" />
    </svg>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────

const TABS = ["All", "Pending Review", "Flagged", "Approved", "Rejected"];

const TAB_STATUS_MAP: Record<string, ModerationStatus | null> = {
  All: null,
  "Pending Review": "pending",
  Flagged: "flagged",
  Approved: "approved",
  Rejected: "rejected",
};

// ── Page ─────────────────────────────────────────────────────────────

export default function AdminModerationPage() {
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [selectedTab, setSelectedTab] = useState(0);
  const [detailSubmission, setDetailSubmission] = useState<Submission | null>(null);
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [rejectOtherText, setRejectOtherText] = useState<string>("");

  // Proximity hover for the card grid
  const gridRef = useRef<HTMLDivElement>(null);
  const { activeIndex, handlers, registerItem } = useProximityHover(gridRef);

  // Derived
  const statusFilter = TAB_STATUS_MAP[TABS[selectedTab]];
  const filteredSubmissions = statusFilter ? submissions.filter((s) => s.status === statusFilter) : submissions;

  const queueCount = submissions.filter((s) => s.status === "pending" || s.status === "flagged").length;
  const reviewedToday = submissions.filter((s) => s.status === "approved" || s.status === "rejected").length;
  const totalReviewed = submissions.filter((s) => s.status === "approved" || s.status === "rejected").length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const approvalRate = totalReviewed > 0 ? Math.round((approvedCount / totalReviewed) * 100) : 0;

  // ── Handlers ────────────────────────────────────────────────────────

  const approveSubmission = useCallback((id: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" as ModerationStatus } : s)));
    if (detailSubmission?.id === id) setDetailSubmission((prev) => prev ? { ...prev, status: "approved" } : null);
    toast("Submission approved");
  }, [detailSubmission, toast]);

  const rejectSubmission = useCallback((id: string, reason: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "rejected" as ModerationStatus, rejectReason: reason } : s)));
    if (detailSubmission?.id === id) setDetailSubmission((prev) => prev ? { ...prev, status: "rejected", rejectReason: reason } : null);
    toast("Submission rejected");
  }, [detailSubmission, toast]);

  const flagForSeniorReview = useCallback((id: string) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "flagged" as ModerationStatus } : s)));
    if (detailSubmission?.id === id) setDetailSubmission((prev) => prev ? { ...prev, status: "flagged" } : null);
    toast("Flagged for senior review");
  }, [detailSubmission, toast]);

  const skipSubmission = useCallback(() => {
    if (!detailSubmission) return;
    const currentIndex = filteredSubmissions.findIndex((s) => s.id === detailSubmission.id);
    const nextIndex = currentIndex + 1;
    if (nextIndex < filteredSubmissions.length) {
      setDetailSubmission(filteredSubmissions[nextIndex]);
      toast("Skipped to next");
    } else {
      setDetailSubmission(null);
      toast("No more submissions");
    }
  }, [detailSubmission, filteredSubmissions, toast]);

  const handleRejectWithReason = useCallback((id: string) => {
    setRejectModalId(id);
    setRejectReason("");
    setRejectOtherText("");
  }, []);

  const submitRejectReason = useCallback(() => {
    if (!rejectModalId) return;
    const reason = rejectReason === "Other" ? rejectOtherText : rejectReason;
    if (!reason) {
      toast("Please select a reason");
      return;
    }
    rejectSubmission(rejectModalId, reason);
    setRejectModalId(null);
    setRejectReason("");
    setRejectOtherText("");
  }, [rejectModalId, rejectReason, rejectOtherText, rejectSubmission, toast]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (rejectModalId) return; // Don't handle shortcuts when reject modal is open
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (detailSubmission) {
        if (e.key === "a" || e.key === "A") {
          e.preventDefault();
          approveSubmission(detailSubmission.id);
        } else if (e.key === "r" || e.key === "R") {
          e.preventDefault();
          handleRejectWithReason(detailSubmission.id);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          skipSubmission();
        } else if (e.key === " ") {
          e.preventDefault();
          // Space toggles the modal
          setDetailSubmission(null);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detailSubmission, rejectModalId, approveSubmission, handleRejectWithReason, skipSubmission]);

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Content Moderation
          </span>
          <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
            {queueCount} item{queueCount !== 1 ? "s" : ""} in queue
          </span>
          {queueCount > 0 && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
              style={{ background: queueCount > 8 ? "rgba(255,37,37,0.08)" : queueCount > 4 ? "rgba(255,128,3,0.08)" : "rgba(0,178,89,0.08)", color: queueCount > 8 ? "#FF2525" : queueCount > 4 ? "#FF8003" : "#00B259" }}
            >
              <span className="size-1.5 rounded-full" style={{ background: queueCount > 8 ? "#FF2525" : queueCount > 4 ? "#FF8003" : "#00B259" }} />
              {queueCount > 8 ? "High" : queueCount > 4 ? "Medium" : "Low"}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-6 pt-4 sm:px-6">
        {/* ── Stats Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Queue Depth", value: String(queueCount), sub: "submissions", color: "#FF8003" },
            { label: "Reviewed Today", value: String(reviewedToday), sub: "submissions", color: "#60A5FA" },
            { label: "Approval Rate", value: `${approvalRate}%`, sub: `${approvedCount} of ${totalReviewed}`, color: "#00B259" },
            { label: "Avg Review Time", value: "3.2m", sub: "per submission", color: "#A78BFA" },
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
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-inter)] text-xl font-semibold tabular-nums tracking-[-0.02em] text-page-text">
                  {stat.value}
                </span>
                <span className="font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted">
                  {stat.sub}
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

        {/* ── Submission Review Feed ─────────────────────────────── */}
        <div ref={gridRef} {...handlers} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredSubmissions.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-16 text-sm text-page-text-muted">
              No submissions found
            </div>
          )}
          {filteredSubmissions.map((submission, index) => {
            const statusCfg = STATUS_CONFIG[submission.status];

            return (
              <div
                key={submission.id}
                ref={(el) => registerItem(index, el)}
                className="relative overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
              >
                {/* Proximity hover indicator */}
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      layoutId="moderation-hover"
                      className="pointer-events-none absolute inset-0 z-0 bg-foreground/[0.03]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={springs.fast}
                    />
                  )}
                </AnimatePresence>

                {/* Thumbnail */}
                <div
                  className="relative aspect-video w-full cursor-pointer overflow-hidden bg-foreground/[0.04]"
                  onClick={() => setDetailSubmission(submission)}
                >
                  <img
                    src={submission.thumbnail}
                    alt=""
                    className="size-full object-cover"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity hover:opacity-80">
                    <PlayIcon />
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tabular-nums text-white">
                    {submission.duration}
                  </div>
                  {/* Platform icon */}
                  <div className="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white">
                    {submission.platform === "tiktok" ? <TikTokIcon /> : <InstagramIcon />}
                  </div>
                  {/* Status badge */}
                  <div className="absolute right-2 top-2">
                    <span
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em] backdrop-blur-sm"
                      style={{ background: statusCfg.bg, color: statusCfg.text }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="relative z-[1] p-4">
                  {/* Creator row */}
                  <div className="flex items-center gap-3">
                    <img src={submission.creator.avatar} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                        {submission.creator.name}
                      </div>
                      <div className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                        {submission.creator.handle}
                      </div>
                    </div>
                  </div>

                  {/* Campaign + time */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                      {submission.campaign}
                    </span>
                    <span className="shrink-0 font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-subtle">
                      {submission.submittedAgo}
                    </span>
                  </div>

                  {/* Auto-detected flags */}
                  {submission.flags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {submission.flags.map((flag) => {
                        const flagCfg = FLAG_CONFIG[flag];
                        return (
                          <span
                            key={flag}
                            className="inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                            style={{ background: flagCfg.bg, color: flagCfg.text }}
                          >
                            {flagCfg.label}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Reject reason if rejected */}
                  {submission.status === "rejected" && submission.rejectReason && (
                    <div className="mt-3 rounded-lg bg-[rgba(255,37,37,0.04)] px-3 py-2 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-[#FF2525]">
                      Rejected: {submission.rejectReason}
                    </div>
                  )}

                  {/* Quick action buttons */}
                  {(submission.status === "pending" || submission.status === "flagged") && (
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => approveSubmission(submission.id)}
                        className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(0,178,89,0.08)] font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-[#00B259] transition-colors hover:bg-[rgba(0,178,89,0.15)]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Approve
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(255,37,37,0.08)] font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[rgba(255,37,37,0.15)]">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Reject
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[200px]">
                          {REJECT_REASONS.filter((r) => r !== "Other").map((reason) => (
                            <DropdownMenuItem
                              key={reason}
                              onClick={() => {
                                if (reason === "Other") {
                                  handleRejectWithReason(submission.id);
                                } else {
                                  rejectSubmission(submission.id, reason);
                                }
                              }}
                            >
                              {reason}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuItem onClick={() => handleRejectWithReason(submission.id)}>
                            Other...
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <button
                        onClick={() => setDetailSubmission(submission)}
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.10]"
                        title="Skip"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="13 17 18 12 13 7" />
                          <polyline points="6 17 11 12 6 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Keyboard Shortcuts Hint ──────────────────────────────── */}
        <div className="flex items-center justify-center gap-4 rounded-xl border border-foreground/[0.06] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
          {[
            { key: "A", label: "Approve" },
            { key: "R", label: "Reject" },
            { key: "\u2192", label: "Skip" },
            { key: "Space", label: "Preview" },
          ].map((shortcut, i) => (
            <div key={shortcut.key} className="flex items-center gap-2">
              {i > 0 && <span className="text-page-text-subtle">\u00b7</span>}
              <kbd className="inline-flex size-6 items-center justify-center rounded-md border border-foreground/[0.08] bg-foreground/[0.03] font-[family-name:var(--font-inter)] text-[11px] font-medium text-page-text-muted dark:border-white/[0.08] dark:bg-white/[0.03]">
                {shortcut.key}
              </kbd>
              <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                {shortcut.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Submission Detail Modal ──────────────────────────────────── */}
      <Modal open={!!detailSubmission} onClose={() => setDetailSubmission(null)} size="lg">
        {detailSubmission && (
          <>
            <ModalHeader>
              <div className="flex items-center gap-3">
                <img src={detailSubmission.creator.avatar} alt="" className="size-10 rounded-full object-cover" />
                <div>
                  <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold tracking-[-0.02em] text-page-text">
                    {detailSubmission.creator.name}
                  </h2>
                  <p className="mt-0.5 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                    {detailSubmission.creator.handle} &middot; {detailSubmission.campaign}
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="space-y-5">
              {/* Video preview area */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-foreground/[0.04]">
                <img
                  src={detailSubmission.thumbnail}
                  alt=""
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayIcon />
                </div>
                {/* Duration */}
                <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tabular-nums text-white">
                  {detailSubmission.duration}
                </div>
              </div>

              {/* Submission metadata */}
              <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <h4 className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                  Submission Info
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Platform</span>
                    <span className="flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text">
                      {detailSubmission.platform === "tiktok" ? <TikTokIcon /> : <InstagramIcon />}
                      {detailSubmission.platform === "tiktok" ? "TikTok" : "Instagram"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Duration</span>
                    <span className="font-[family-name:var(--font-inter)] text-sm tabular-nums tracking-[-0.02em] text-page-text">{detailSubmission.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Views</span>
                    <span className="font-[family-name:var(--font-inter)] text-sm tabular-nums tracking-[-0.02em] text-page-text">
                      {detailSubmission.views ? detailSubmission.views.toLocaleString() : "Not posted yet"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Submitted</span>
                    <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text">{detailSubmission.submittedAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Status</span>
                    <span
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                      style={{ background: STATUS_CONFIG[detailSubmission.status].bg, color: STATUS_CONFIG[detailSubmission.status].text }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: STATUS_CONFIG[detailSubmission.status].dot }} />
                      {STATUS_CONFIG[detailSubmission.status].label}
                    </span>
                  </div>
                  {detailSubmission.hashtags.length > 0 && (
                    <div className="flex items-start justify-between">
                      <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Hashtags</span>
                      <div className="flex flex-wrap justify-end gap-1">
                        {detailSubmission.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-foreground/[0.06] px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-detection results */}
              <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
                <h4 className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                  Auto-Detection Results
                </h4>
                <div className="space-y-3">
                  {/* Quality score */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Quality Score</span>
                      <span
                        className="font-[family-name:var(--font-inter)] text-sm font-semibold tabular-nums tracking-[-0.02em]"
                        style={{ color: detailSubmission.autoDetection.qualityScore >= 70 ? "#00B259" : detailSubmission.autoDetection.qualityScore >= 50 ? "#FF8003" : "#FF2525" }}
                      >
                        {detailSubmission.autoDetection.qualityScore}/100
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${detailSubmission.autoDetection.qualityScore}%`,
                          background: detailSubmission.autoDetection.qualityScore >= 70 ? "#00B259" : detailSubmission.autoDetection.qualityScore >= 50 ? "#FF8003" : "#FF2525",
                        }}
                      />
                    </div>
                  </div>

                  {/* Repost probability */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Repost Probability</span>
                      <span
                        className="font-[family-name:var(--font-inter)] text-sm font-semibold tabular-nums tracking-[-0.02em]"
                        style={{ color: detailSubmission.autoDetection.repostProbability <= 20 ? "#00B259" : detailSubmission.autoDetection.repostProbability <= 50 ? "#FF8003" : "#FF2525" }}
                      >
                        {detailSubmission.autoDetection.repostProbability}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${detailSubmission.autoDetection.repostProbability}%`,
                          background: detailSubmission.autoDetection.repostProbability <= 20 ? "#00B259" : detailSubmission.autoDetection.repostProbability <= 50 ? "#FF8003" : "#FF2525",
                        }}
                      />
                    </div>
                  </div>

                  {/* Copyright flags */}
                  {detailSubmission.autoDetection.copyrightFlags.length > 0 && (
                    <div>
                      <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Copyright Flags</span>
                      <div className="mt-1.5 space-y-1">
                        {detailSubmission.autoDetection.copyrightFlags.map((flag, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-[rgba(255,37,37,0.04)] px-3 py-2 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-[#FF2525]"
                          >
                            {flag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {detailSubmission.autoDetection.copyrightFlags.length === 0 && (
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">Copyright Flags</span>
                      <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-[#00B259]">None detected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-detected flags */}
              {detailSubmission.flags.length > 0 && (
                <div>
                  <h4 className="mb-2 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                    Auto-Detected Flags
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {detailSubmission.flags.map((flag) => {
                      const flagCfg = FLAG_CONFIG[flag];
                      return (
                        <span
                          key={flag}
                          className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em]"
                          style={{ background: flagCfg.bg, color: flagCfg.text }}
                        >
                          {flagCfg.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Previous submissions by this creator */}
              {detailSubmission.previousSubmissions.length > 0 && (
                <div>
                  <h4 className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                    Previous Submissions
                  </h4>
                  <div className="space-y-2">
                    {detailSubmission.previousSubmissions.slice(0, 3).map((prev) => {
                      const prevStatusCfg = STATUS_CONFIG[prev.status];
                      return (
                        <div
                          key={prev.id}
                          className="flex items-center justify-between rounded-lg border border-foreground/[0.04] bg-foreground/[0.02] px-3 py-2 dark:border-white/[0.04] dark:bg-white/[0.02]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text">
                              {prev.campaign}
                            </div>
                            <div className="mt-0.5 font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-subtle">
                              {prev.date}
                            </div>
                          </div>
                          <span
                            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                            style={{ background: prevStatusCfg.bg, color: prevStatusCfg.text }}
                          >
                            <span className="size-1.5 rounded-full" style={{ background: prevStatusCfg.dot }} />
                            {prevStatusCfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reject reason display */}
              {detailSubmission.status === "rejected" && detailSubmission.rejectReason && (
                <div className="rounded-xl border border-[#FF2525]/20 bg-[rgba(255,37,37,0.04)] p-4">
                  <h4 className="mb-1 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-[#FF2525]">
                    Rejection Reason
                  </h4>
                  <p className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text">
                    {detailSubmission.rejectReason}
                  </p>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <button
                onClick={() => flagForSeniorReview(detailSubmission.id)}
                className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
              >
                Flag for Senior Review
              </button>
              <div className="flex items-center gap-2">
                {(detailSubmission.status === "pending" || detailSubmission.status === "flagged") && (
                  <>
                    <button
                      onClick={() => handleRejectWithReason(detailSubmission.id)}
                      className="cursor-pointer rounded-full border border-[#FF2525]/30 bg-[#FF2525]/10 px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[#FF2525]/20"
                    >
                      Reject
                    </button>
                    <button
                      onClick={skipSubmission}
                      className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => approveSubmission(detailSubmission.id)}
                      className="cursor-pointer rounded-full bg-[#00B259] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
                    >
                      Approve
                    </button>
                  </>
                )}
                {detailSubmission.status === "approved" && (
                  <span className="flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-[#00B259]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Approved
                  </span>
                )}
                {detailSubmission.status === "rejected" && (
                  <span className="flex items-center gap-1.5 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-[#FF2525]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Rejected
                  </span>
                )}
              </div>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* ── Reject Reason Modal ──────────────────────────────────────── */}
      <Modal open={!!rejectModalId} onClose={() => setRejectModalId(null)} size="sm">
        <ModalHeader>
          <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold tracking-[-0.02em] text-page-text">
            Reject Submission
          </h2>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
            Select a reason for rejection
          </p>
        </ModalHeader>
        <ModalBody className="space-y-2">
          {REJECT_REASONS.map((reason) => (
            <label
              key={reason}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                rejectReason === reason
                  ? "border-[#FF2525]/30 bg-[rgba(255,37,37,0.04)]"
                  : "border-foreground/[0.06] bg-transparent hover:bg-foreground/[0.03] dark:border-white/[0.06]"
              )}
            >
              <input
                type="radio"
                name="reject-reason"
                value={reason}
                checked={rejectReason === reason}
                onChange={() => setRejectReason(reason)}
                className="size-4 accent-[#FF2525]"
              />
              <span className="font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text">
                {reason}
              </span>
            </label>
          ))}

          {/* Other text input */}
          <AnimatePresence>
            {rejectReason === "Other" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={springs.fast}
              >
                <textarea
                  value={rejectOtherText}
                  onChange={(e) => setRejectOtherText(e.target.value)}
                  placeholder="Describe the reason for rejection..."
                  className="mt-2 w-full resize-none rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-4 py-3 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-subtle focus:border-[#FF2525]/30 dark:border-white/[0.06] dark:bg-white/[0.02]"
                  rows={3}
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBody>
        <ModalFooter>
          <button
            onClick={() => setRejectModalId(null)}
            className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            Cancel
          </button>
          <button
            onClick={submitRejectReason}
            disabled={!rejectReason || (rejectReason === "Other" && !rejectOtherText.trim())}
            className="cursor-pointer rounded-full bg-[#FF2525] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject Submission
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
