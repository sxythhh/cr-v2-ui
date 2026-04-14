// @ts-nocheck
"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { AuditLogSheet } from "@/components/admin/audit-log-sheet";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { motion, AnimatePresence } from "motion/react";
import { springs } from "@/lib/springs";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// ── Types ───────────────────────────────────────────────────────────

type CreatorStatus = "active" | "suspended" | "pending";
type Platform = "tiktok" | "instagram" | "youtube";

interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platforms: Platform[];
  status: CreatorStatus;
  campaigns: number;
  totalEarnings: number;
  joinDate: string;
  totalViews: number;
  videosSubmitted: number;
  avgViews: number;
  completionRate: number;
  featured: boolean;
  verified: boolean;
  followers: Record<Platform, number>;
  recentSubmissions: { title: string; campaign: string; date: string; views: number; status: "approved" | "pending" | "rejected" }[];
  payoutHistory: { date: string; amount: number; method: string; status: "completed" | "pending" }[];
}

interface VerificationApplication {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  appliedDate: string;
  platforms: { platform: Platform; followers: number; url: string }[];
  contentSamples: string[];
  bio: string;
  selected?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  handle: string;
  avatar: string;
  totalViews: number;
  totalEarnings: number;
  campaigns: number;
  completionRate: number;
  trend: "up" | "down" | "flat";
}

// ── Mock Data ───────────────────────────────────────────────────────

const MOCK_CREATORS: Creator[] = [
  {
    id: "cr-001", name: "Alex Rivera", handle: "@alexrivera", avatar: "https://i.pravatar.cc/40?u=alex",
    platforms: ["tiktok", "instagram"], status: "active", campaigns: 12, totalEarnings: 24500, joinDate: "Jan 15, 2026",
    totalViews: 4200000, videosSubmitted: 38, avgViews: 110526, completionRate: 92, featured: true, verified: true,
    followers: { tiktok: 245000, instagram: 189000, youtube: 0 },
    recentSubmissions: [
      { title: "GYMSHARK Haul Review", campaign: "GYMSHARK Clipping", date: "Apr 10, 2026", views: 145000, status: "approved" },
      { title: "Podcast Clip #12", campaign: "Harry Styles Podcast", date: "Apr 8, 2026", views: 89000, status: "approved" },
      { title: "Product Unboxing", campaign: "NovaPay Wallet", date: "Apr 5, 2026", views: 210000, status: "pending" },
    ],
    payoutHistory: [
      { date: "Apr 8, 2026", amount: 2450, method: "Stripe", status: "completed" },
      { date: "Mar 25, 2026", amount: 3100, method: "Stripe", status: "completed" },
      { date: "Mar 10, 2026", amount: 1800, method: "PayPal", status: "completed" },
      { date: "Feb 20, 2026", amount: 4200, method: "Stripe", status: "completed" },
      { date: "Feb 5, 2026", amount: 2750, method: "Stripe", status: "completed" },
    ],
  },
  {
    id: "cr-002", name: "Jordan Chen", handle: "@jordanchen", avatar: "https://i.pravatar.cc/40?u=jordan",
    platforms: ["instagram", "youtube"], status: "active", campaigns: 8, totalEarnings: 18200, joinDate: "Feb 3, 2026",
    totalViews: 3100000, videosSubmitted: 24, avgViews: 129167, completionRate: 88, featured: false, verified: true,
    followers: { tiktok: 0, instagram: 320000, youtube: 156000 },
    recentSubmissions: [
      { title: "COD Gameplay Montage", campaign: "Call of Duty BO7", date: "Apr 9, 2026", views: 320000, status: "approved" },
      { title: "Live Stream Highlights", campaign: "Polymarket", date: "Apr 6, 2026", views: 95000, status: "approved" },
    ],
    payoutHistory: [
      { date: "Apr 9, 2026", amount: 8000, method: "PayPal", status: "pending" },
      { date: "Mar 20, 2026", amount: 5200, method: "PayPal", status: "completed" },
      { date: "Mar 1, 2026", amount: 3000, method: "PayPal", status: "completed" },
    ],
  },
  {
    id: "cr-003", name: "Mia Santos", handle: "@miasantos", avatar: "https://i.pravatar.cc/40?u=mia",
    platforms: ["tiktok"], status: "active", campaigns: 15, totalEarnings: 31400, joinDate: "Dec 20, 2025",
    totalViews: 8900000, videosSubmitted: 52, avgViews: 171154, completionRate: 95, featured: true, verified: true,
    followers: { tiktok: 890000, instagram: 0, youtube: 0 },
    recentSubmissions: [
      { title: "Fitness Routine Clip", campaign: "GYMSHARK Clipping", date: "Apr 11, 2026", views: 450000, status: "approved" },
      { title: "Day in My Life", campaign: "NovaPay Wallet", date: "Apr 7, 2026", views: 280000, status: "approved" },
      { title: "Trending Sound Edit", campaign: "Harry Styles Podcast", date: "Apr 3, 2026", views: 620000, status: "approved" },
    ],
    payoutHistory: [
      { date: "Apr 7, 2026", amount: 1250, method: "Stripe", status: "completed" },
      { date: "Mar 28, 2026", amount: 4500, method: "Stripe", status: "completed" },
      { date: "Mar 15, 2026", amount: 6200, method: "Stripe", status: "completed" },
      { date: "Feb 28, 2026", amount: 3900, method: "Stripe", status: "completed" },
      { date: "Feb 10, 2026", amount: 5100, method: "Stripe", status: "completed" },
    ],
  },
  {
    id: "cr-004", name: "Tyler Brooks", handle: "@tylerbrooks", avatar: "https://i.pravatar.cc/40?u=tyler",
    platforms: ["tiktok", "youtube"], status: "suspended", campaigns: 6, totalEarnings: 8900, joinDate: "Mar 1, 2026",
    totalViews: 1200000, videosSubmitted: 14, avgViews: 85714, completionRate: 45, featured: false, verified: true,
    followers: { tiktok: 95000, instagram: 0, youtube: 42000 },
    recentSubmissions: [
      { title: "Crypto Review", campaign: "Polymarket", date: "Apr 2, 2026", views: 56000, status: "rejected" },
    ],
    payoutHistory: [
      { date: "Mar 15, 2026", amount: 475, method: "Crypto", status: "completed" },
      { date: "Mar 1, 2026", amount: 2400, method: "Crypto", status: "completed" },
    ],
  },
  {
    id: "cr-005", name: "Emma Wilson", handle: "@emmawilson", avatar: "https://i.pravatar.cc/40?u=emma",
    platforms: ["instagram"], status: "active", campaigns: 10, totalEarnings: 15600, joinDate: "Jan 28, 2026",
    totalViews: 2800000, videosSubmitted: 30, avgViews: 93333, completionRate: 82, featured: false, verified: true,
    followers: { tiktok: 0, instagram: 410000, youtube: 0 },
    recentSubmissions: [
      { title: "Style Guide Reel", campaign: "GYMSHARK Clipping", date: "Apr 11, 2026", views: 180000, status: "approved" },
      { title: "Morning Routine", campaign: "NovaPay Wallet", date: "Apr 8, 2026", views: 95000, status: "pending" },
    ],
    payoutHistory: [
      { date: "Apr 11, 2026", amount: 3200, method: "Stripe", status: "pending" },
      { date: "Mar 20, 2026", amount: 4100, method: "Stripe", status: "completed" },
      { date: "Mar 5, 2026", amount: 2800, method: "Stripe", status: "completed" },
    ],
  },
  {
    id: "cr-006", name: "Liam Nguyen", handle: "@liamnguyen", avatar: "https://i.pravatar.cc/40?u=liam",
    platforms: ["tiktok", "instagram", "youtube"], status: "active", campaigns: 20, totalEarnings: 42300, joinDate: "Nov 10, 2025",
    totalViews: 12500000, videosSubmitted: 78, avgViews: 160256, completionRate: 96, featured: true, verified: true,
    followers: { tiktok: 1200000, instagram: 560000, youtube: 310000 },
    recentSubmissions: [
      { title: "Kane Brown Concert Vlog", campaign: "Kane Brown Clipping", date: "Apr 12, 2026", views: 890000, status: "approved" },
      { title: "Behind the Scenes", campaign: "Diary of a CEO", date: "Apr 9, 2026", views: 340000, status: "approved" },
      { title: "Weekly Roundup", campaign: "Harry Styles Podcast", date: "Apr 6, 2026", views: 520000, status: "approved" },
    ],
    payoutHistory: [
      { date: "Apr 5, 2026", amount: 5600, method: "PayPal", status: "pending" },
      { date: "Mar 22, 2026", amount: 7800, method: "PayPal", status: "completed" },
      { date: "Mar 8, 2026", amount: 6100, method: "PayPal", status: "completed" },
      { date: "Feb 20, 2026", amount: 5400, method: "PayPal", status: "completed" },
      { date: "Feb 5, 2026", amount: 4900, method: "PayPal", status: "completed" },
    ],
  },
  {
    id: "cr-007", name: "Sophia Kim", handle: "@sophiakim", avatar: "https://i.pravatar.cc/40?u=sophia",
    platforms: ["tiktok"], status: "active", campaigns: 7, totalEarnings: 11200, joinDate: "Feb 15, 2026",
    totalViews: 1900000, videosSubmitted: 20, avgViews: 95000, completionRate: 85, featured: false, verified: true,
    followers: { tiktok: 178000, instagram: 0, youtube: 0 },
    recentSubmissions: [
      { title: "Diary Clip Montage", campaign: "Diary of a CEO", date: "Apr 4, 2026", views: 120000, status: "approved" },
    ],
    payoutHistory: [
      { date: "Apr 4, 2026", amount: 950, method: "Stripe", status: "completed" },
      { date: "Mar 18, 2026", amount: 2800, method: "Stripe", status: "completed" },
    ],
  },
  {
    id: "cr-008", name: "Marcus Johnson", handle: "@marcusjohnson", avatar: "https://i.pravatar.cc/40?u=marcus",
    platforms: ["instagram", "youtube"], status: "pending", campaigns: 0, totalEarnings: 0, joinDate: "Apr 10, 2026",
    totalViews: 0, videosSubmitted: 0, avgViews: 0, completionRate: 0, featured: false, verified: false,
    followers: { tiktok: 0, instagram: 52000, youtube: 28000 },
    recentSubmissions: [],
    payoutHistory: [],
  },
  {
    id: "cr-009", name: "Ava Thompson", handle: "@avathompson", avatar: "https://i.pravatar.cc/40?u=ava",
    platforms: ["tiktok", "instagram"], status: "active", campaigns: 11, totalEarnings: 19800, joinDate: "Jan 5, 2026",
    totalViews: 3600000, videosSubmitted: 34, avgViews: 105882, completionRate: 90, featured: false, verified: true,
    followers: { tiktok: 340000, instagram: 210000, youtube: 0 },
    recentSubmissions: [
      { title: "COD Best Plays", campaign: "Call of Duty BO7", date: "Apr 8, 2026", views: 275000, status: "approved" },
      { title: "Lifestyle Vlog", campaign: "NovaPay Wallet", date: "Apr 5, 2026", views: 190000, status: "approved" },
      { title: "Fan Reactions", campaign: "Harry Styles Podcast", date: "Apr 2, 2026", views: 310000, status: "pending" },
    ],
    payoutHistory: [
      { date: "Apr 8, 2026", amount: 4100, method: "Stripe", status: "pending" },
      { date: "Mar 25, 2026", amount: 3600, method: "Stripe", status: "completed" },
      { date: "Mar 10, 2026", amount: 2900, method: "Stripe", status: "completed" },
    ],
  },
  {
    id: "cr-010", name: "Noah Park", handle: "@noahpark", avatar: "https://i.pravatar.cc/40?u=noah",
    platforms: ["tiktok", "youtube"], status: "active", campaigns: 9, totalEarnings: 14100, joinDate: "Feb 8, 2026",
    totalViews: 2400000, videosSubmitted: 28, avgViews: 85714, completionRate: 78, featured: false, verified: true,
    followers: { tiktok: 165000, instagram: 0, youtube: 88000 },
    recentSubmissions: [
      { title: "Podcast Highlight Reel", campaign: "Harry Styles Podcast", date: "Apr 3, 2026", views: 95000, status: "approved" },
    ],
    payoutHistory: [
      { date: "Apr 3, 2026", amount: 720, method: "PayPal", status: "completed" },
      { date: "Mar 15, 2026", amount: 3400, method: "PayPal", status: "completed" },
    ],
  },
  {
    id: "cr-011", name: "Isabella Martinez", handle: "@isabellamartinez", avatar: "https://i.pravatar.cc/40?u=isabella",
    platforms: ["instagram"], status: "suspended", campaigns: 3, totalEarnings: 2100, joinDate: "Mar 15, 2026",
    totalViews: 450000, videosSubmitted: 8, avgViews: 56250, completionRate: 38, featured: false, verified: true,
    followers: { tiktok: 0, instagram: 78000, youtube: 0 },
    recentSubmissions: [
      { title: "Quick Review", campaign: "Polymarket", date: "Apr 1, 2026", views: 12000, status: "rejected" },
    ],
    payoutHistory: [
      { date: "Mar 20, 2026", amount: 50, method: "Stripe", status: "completed" },
    ],
  },
  {
    id: "cr-012", name: "Ethan Williams", handle: "@ethanwilliams", avatar: "https://i.pravatar.cc/40?u=ethan",
    platforms: ["tiktok", "instagram", "youtube"], status: "active", campaigns: 14, totalEarnings: 28700, joinDate: "Dec 5, 2025",
    totalViews: 6800000, videosSubmitted: 45, avgViews: 151111, completionRate: 91, featured: false, verified: true,
    followers: { tiktok: 520000, instagram: 380000, youtube: 190000 },
    recentSubmissions: [
      { title: "Wallet App Tutorial", campaign: "NovaPay Wallet", date: "Apr 10, 2026", views: 340000, status: "approved" },
      { title: "Market Analysis", campaign: "Polymarket", date: "Apr 7, 2026", views: 180000, status: "approved" },
      { title: "Music Reaction", campaign: "Kane Brown Clipping", date: "Apr 4, 2026", views: 260000, status: "approved" },
    ],
    payoutHistory: [
      { date: "Apr 2, 2026", amount: 1800, method: "Crypto", status: "completed" },
      { date: "Mar 18, 2026", amount: 5600, method: "Crypto", status: "completed" },
      { date: "Mar 2, 2026", amount: 4300, method: "Crypto", status: "completed" },
    ],
  },
  {
    id: "cr-013", name: "Olivia Davis", handle: "@oliviadavis", avatar: "https://i.pravatar.cc/40?u=olivia",
    platforms: ["youtube"], status: "active", campaigns: 5, totalEarnings: 9400, joinDate: "Mar 5, 2026",
    totalViews: 1500000, videosSubmitted: 15, avgViews: 100000, completionRate: 80, featured: false, verified: true,
    followers: { tiktok: 0, instagram: 0, youtube: 245000 },
    recentSubmissions: [
      { title: "CEO Interview Breakdown", campaign: "Diary of a CEO", date: "Apr 6, 2026", views: 200000, status: "approved" },
    ],
    payoutHistory: [
      { date: "Mar 28, 2026", amount: 2800, method: "Stripe", status: "completed" },
      { date: "Mar 12, 2026", amount: 1900, method: "Stripe", status: "completed" },
    ],
  },
  {
    id: "cr-014", name: "Lucas Taylor", handle: "@lucastaylor", avatar: "https://i.pravatar.cc/40?u=lucas",
    platforms: ["tiktok", "instagram"], status: "pending", campaigns: 0, totalEarnings: 0, joinDate: "Apr 12, 2026",
    totalViews: 0, videosSubmitted: 0, avgViews: 0, completionRate: 0, featured: false, verified: false,
    followers: { tiktok: 35000, instagram: 22000, youtube: 0 },
    recentSubmissions: [],
    payoutHistory: [],
  },
  {
    id: "cr-015", name: "Chloe Anderson", handle: "@chloeanderson", avatar: "https://i.pravatar.cc/40?u=chloe",
    platforms: ["tiktok", "youtube"], status: "active", campaigns: 6, totalEarnings: 7800, joinDate: "Mar 10, 2026",
    totalViews: 980000, videosSubmitted: 18, avgViews: 54444, completionRate: 72, featured: false, verified: true,
    followers: { tiktok: 110000, instagram: 0, youtube: 65000 },
    recentSubmissions: [
      { title: "Gaming Highlights", campaign: "Call of Duty BO7", date: "Apr 9, 2026", views: 78000, status: "approved" },
      { title: "Reaction Clip", campaign: "Kane Brown Clipping", date: "Apr 5, 2026", views: 45000, status: "pending" },
    ],
    payoutHistory: [
      { date: "Mar 30, 2026", amount: 1600, method: "Stripe", status: "completed" },
      { date: "Mar 15, 2026", amount: 2200, method: "Stripe", status: "completed" },
    ],
  },
];

const MOCK_APPLICATIONS: VerificationApplication[] = [
  {
    id: "app-001", name: "Marcus Johnson", handle: "@marcusjohnson", avatar: "https://i.pravatar.cc/40?u=marcus",
    appliedDate: "Apr 10, 2026", bio: "Fitness and lifestyle content creator passionate about sharing wellness tips.",
    platforms: [
      { platform: "instagram", followers: 52000, url: "https://instagram.com/marcusjohnson" },
      { platform: "youtube", followers: 28000, url: "https://youtube.com/@marcusjohnson" },
    ],
    contentSamples: ["sample-1.jpg", "sample-2.jpg", "sample-3.jpg"],
  },
  {
    id: "app-002", name: "Lucas Taylor", handle: "@lucastaylor", avatar: "https://i.pravatar.cc/40?u=lucas",
    appliedDate: "Apr 12, 2026", bio: "Gaming and tech reviews with a focus on FPS titles and esports coverage.",
    platforms: [
      { platform: "tiktok", followers: 35000, url: "https://tiktok.com/@lucastaylor" },
      { platform: "instagram", followers: 22000, url: "https://instagram.com/lucastaylor" },
    ],
    contentSamples: ["sample-4.jpg", "sample-5.jpg", "sample-6.jpg"],
  },
  {
    id: "app-003", name: "Zara Mitchell", handle: "@zaramitchell", avatar: "https://i.pravatar.cc/40?u=zara",
    appliedDate: "Apr 11, 2026", bio: "Fashion and beauty creator with a minimalist aesthetic. Previously worked with major brands.",
    platforms: [
      { platform: "tiktok", followers: 120000, url: "https://tiktok.com/@zaramitchell" },
      { platform: "instagram", followers: 95000, url: "https://instagram.com/zaramitchell" },
      { platform: "youtube", followers: 45000, url: "https://youtube.com/@zaramitchell" },
    ],
    contentSamples: ["sample-7.jpg", "sample-8.jpg", "sample-9.jpg"],
  },
  {
    id: "app-004", name: "Derek Hayes", handle: "@derekhayes", avatar: "https://i.pravatar.cc/40?u=derek",
    appliedDate: "Apr 9, 2026", bio: "Sports commentary and athlete interviews. Former college athlete turned content creator.",
    platforms: [
      { platform: "youtube", followers: 68000, url: "https://youtube.com/@derekhayes" },
      { platform: "tiktok", followers: 42000, url: "https://tiktok.com/@derekhayes" },
    ],
    contentSamples: ["sample-10.jpg", "sample-11.jpg", "sample-12.jpg"],
  },
  {
    id: "app-005", name: "Nina Patel", handle: "@ninapatel", avatar: "https://i.pravatar.cc/40?u=nina",
    appliedDate: "Apr 13, 2026", bio: "Cooking and food vlog creator specializing in fusion recipes and street food reviews.",
    platforms: [
      { platform: "instagram", followers: 88000, url: "https://instagram.com/ninapatel" },
      { platform: "tiktok", followers: 156000, url: "https://tiktok.com/@ninapatel" },
    ],
    contentSamples: ["sample-13.jpg", "sample-14.jpg", "sample-15.jpg"],
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, id: "cr-006", name: "Liam Nguyen", handle: "@liamnguyen", avatar: "https://i.pravatar.cc/40?u=liam", totalViews: 12500000, totalEarnings: 42300, campaigns: 20, completionRate: 96, trend: "up" },
  { rank: 2, id: "cr-003", name: "Mia Santos", handle: "@miasantos", avatar: "https://i.pravatar.cc/40?u=mia", totalViews: 8900000, totalEarnings: 31400, campaigns: 15, completionRate: 95, trend: "up" },
  { rank: 3, id: "cr-012", name: "Ethan Williams", handle: "@ethanwilliams", avatar: "https://i.pravatar.cc/40?u=ethan", totalViews: 6800000, totalEarnings: 28700, campaigns: 14, completionRate: 91, trend: "flat" },
  { rank: 4, id: "cr-001", name: "Alex Rivera", handle: "@alexrivera", avatar: "https://i.pravatar.cc/40?u=alex", totalViews: 4200000, totalEarnings: 24500, campaigns: 12, completionRate: 92, trend: "up" },
  { rank: 5, id: "cr-009", name: "Ava Thompson", handle: "@avathompson", avatar: "https://i.pravatar.cc/40?u=ava", totalViews: 3600000, totalEarnings: 19800, campaigns: 11, completionRate: 90, trend: "down" },
  { rank: 6, id: "cr-002", name: "Jordan Chen", handle: "@jordanchen", avatar: "https://i.pravatar.cc/40?u=jordan", totalViews: 3100000, totalEarnings: 18200, campaigns: 8, completionRate: 88, trend: "flat" },
  { rank: 7, id: "cr-005", name: "Emma Wilson", handle: "@emmawilson", avatar: "https://i.pravatar.cc/40?u=emma", totalViews: 2800000, totalEarnings: 15600, campaigns: 10, completionRate: 82, trend: "up" },
  { rank: 8, id: "cr-010", name: "Noah Park", handle: "@noahpark", avatar: "https://i.pravatar.cc/40?u=noah", totalViews: 2400000, totalEarnings: 14100, campaigns: 9, completionRate: 78, trend: "down" },
  { rank: 9, id: "cr-007", name: "Sophia Kim", handle: "@sophiakim", avatar: "https://i.pravatar.cc/40?u=sophia", totalViews: 1900000, totalEarnings: 11200, campaigns: 7, completionRate: 85, trend: "up" },
  { rank: 10, id: "cr-013", name: "Olivia Davis", handle: "@oliviadavis", avatar: "https://i.pravatar.cc/40?u=olivia", totalViews: 1500000, totalEarnings: 9400, campaigns: 5, completionRate: 80, trend: "flat" },
];

// ── Status helpers ──────────────────────────────────────────────────

const CREATOR_STATUS_CONFIG: Record<CreatorStatus, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: "Active", bg: "rgba(0,178,89,0.08)", text: "#00B259", dot: "#00B259" },
  suspended: { label: "Suspended", bg: "rgba(255,37,37,0.08)", text: "#FF2525", dot: "#FF2525" },
  pending: { label: "Pending", bg: "rgba(255,128,3,0.08)", text: "#FF8003", dot: "#FF8003" },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
}

// ── Section Tabs ────────────────────────────────────────────────────

const SECTION_TABS = ["Creator Directory", "Verification Queue", "Performance Leaderboard"];

// ── Page ────────────────────────────────────────────────────────────

export default function AdminCreatorsPage() {
  const { toast } = useToast();
  const { confirm } = useConfirm();

  // Section tab
  const [sectionTab, setSectionTab] = useState(0);

  // Creator Directory state
  const [creators, setCreators] = useState<Creator[]>(MOCK_CREATORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | Platform>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | CreatorStatus>("all");
  const [detailCreator, setDetailCreator] = useState<Creator | null>(null);
  const [auditSheet, setAuditSheet] = useState<{ open: boolean; id: string; title: string }>({ open: false, id: "", title: "" });

  // Verification Queue state
  const [applications, setApplications] = useState<VerificationApplication[]>(MOCK_APPLICATIONS);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());

  // Leaderboard state
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Proximity hover for creator table
  const tableRef = useRef<HTMLDivElement>(null);
  const { activeIndex: tableActiveIndex, handlers: tableHandlers, registerItem: registerTableItem } = useProximityHover(tableRef);

  // Proximity hover for leaderboard table
  const leaderboardRef = useRef<HTMLDivElement>(null);
  const { activeIndex: lbActiveIndex, handlers: lbHandlers, registerItem: registerLbItem } = useProximityHover(leaderboardRef);

  // ── Derived data ──────────────────────────────────────────────────

  const filteredCreators = useMemo(() => {
    let result = creators;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q));
    }
    if (platformFilter !== "all") {
      result = result.filter((c) => c.platforms.includes(platformFilter));
    }
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }
    return result;
  }, [creators, searchQuery, platformFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: creators.length,
    active: creators.filter((c) => c.status === "active").length,
    suspended: creators.filter((c) => c.status === "suspended").length,
    pending: creators.filter((c) => c.status === "pending").length,
  }), [creators]);

  // ── Creator actions ───────────────────────────────────────────────

  const updateCreatorStatus = useCallback((id: string, status: CreatorStatus) => {
    setCreators((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    if (detailCreator?.id === id) {
      setDetailCreator((prev) => prev ? { ...prev, status } : null);
    }
  }, [detailCreator]);

  const toggleVerified = useCallback((id: string) => {
    setCreators((prev) => prev.map((c) => c.id === id ? { ...c, verified: !c.verified } : c));
    if (detailCreator?.id === id) {
      setDetailCreator((prev) => prev ? { ...prev, verified: !prev.verified } : null);
    }
  }, [detailCreator]);

  const toggleFeatured = useCallback((id: string) => {
    setCreators((prev) => prev.map((c) => c.id === id ? { ...c, featured: !c.featured } : c));
    if (detailCreator?.id === id) {
      setDetailCreator((prev) => prev ? { ...prev, featured: !prev.featured } : null);
    }
  }, [detailCreator]);

  const handleSuspend = useCallback(async (creator: Creator) => {
    const ok = await confirm({
      title: "Suspend creator?",
      message: `Suspend ${creator.name} (${creator.handle})? They will be unable to participate in campaigns.`,
      confirmLabel: "Suspend",
      destructive: true,
    });
    if (ok) {
      updateCreatorStatus(creator.id, "suspended");
      toast(`${creator.name} has been suspended`);
    }
  }, [confirm, updateCreatorStatus, toast]);

  const handleBan = useCallback(async (creator: Creator) => {
    const ok = await confirm({
      title: "Ban creator?",
      message: `Permanently ban ${creator.name} (${creator.handle})? This action cannot be undone.`,
      confirmLabel: "Ban",
      destructive: true,
    });
    if (ok) {
      setCreators((prev) => prev.filter((c) => c.id !== creator.id));
      setDetailCreator(null);
      toast(`${creator.name} has been banned`);
    }
  }, [confirm, toast]);

  // ── Verification actions ──────────────────────────────────────────

  const handleApproveApp = useCallback((id: string) => {
    const app = applications.find((a) => a.id === id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setSelectedApps((prev) => { const n = new Set(prev); n.delete(id); return n; });
    if (app) toast(`${app.name} has been approved`);
  }, [applications, toast]);

  const handleRejectApp = useCallback(async (id: string) => {
    const app = applications.find((a) => a.id === id);
    const ok = await confirm({
      title: "Reject application?",
      message: `Reject ${app?.name}'s application? They will be notified.`,
      confirmLabel: "Reject",
      destructive: true,
    });
    if (ok) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
      setSelectedApps((prev) => { const n = new Set(prev); n.delete(id); return n; });
      toast(`${app?.name}'s application rejected`);
    }
  }, [applications, confirm, toast]);

  const handleBulkApprove = useCallback(() => {
    const count = selectedApps.size;
    setApplications((prev) => prev.filter((a) => !selectedApps.has(a.id)));
    setSelectedApps(new Set());
    toast(`${count} application(s) approved`);
  }, [selectedApps, toast]);

  const handleBulkReject = useCallback(async () => {
    const count = selectedApps.size;
    const ok = await confirm({
      title: "Reject selected applications?",
      message: `Reject ${count} application(s)? This cannot be undone.`,
      confirmLabel: "Reject All",
      destructive: true,
    });
    if (ok) {
      setApplications((prev) => prev.filter((a) => !selectedApps.has(a.id)));
      setSelectedApps(new Set());
      toast(`${count} application(s) rejected`);
    }
  }, [selectedApps, confirm, toast]);

  const toggleAppSelect = useCallback((id: string) => {
    setSelectedApps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAllApps = useCallback(() => {
    if (selectedApps.size === applications.length) {
      setSelectedApps(new Set());
    } else {
      setSelectedApps(new Set(applications.map((a) => a.id)));
    }
  }, [selectedApps.size, applications]);

  const handleExport = useCallback(() => {
    toast("CSV export started — download will begin shortly");
  }, [toast]);

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Creators
          </span>
          <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
            {stats.total} total
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
            { label: "Total Creators", value: stats.total, color: "#60A5FA" },
            { label: "Active", value: stats.active, color: "#00B259" },
            { label: "Suspended", value: stats.suspended, color: "#FF2525" },
            { label: "Pending Verification", value: stats.pending, color: "#FF8003" },
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
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section Tabs ───────────────────────────────────────── */}
        <div className="overflow-x-auto scrollbar-hide md:hidden" style={{ scrollbarWidth: "none" }}>
          <Tabs selectedIndex={sectionTab} onSelect={setSectionTab} className="w-max">
            {SECTION_TABS.map((tab, i) => (
              <TabItem key={tab} label={tab} index={i} />
            ))}
          </Tabs>
        </div>
        <div className="hidden md:flex">
          <Tabs selectedIndex={sectionTab} onSelect={setSectionTab} className="w-fit">
            {SECTION_TABS.map((tab, i) => (
              <TabItem key={tab} label={tab} index={i} />
            ))}
          </Tabs>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ── TAB 1: Creator Directory ─────────────────────────────── */}
        {/* ══════════════════════════════════════════════════════════ */}
        {sectionTab === 0 && (
          <>
            {/* Search + filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-page-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-lg border border-foreground/[0.06] bg-white pl-9 pr-3 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text placeholder:text-page-text-muted focus:outline-none focus:ring-1 focus:ring-foreground/[0.12] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
                />
              </div>

              {/* Platform filter */}
              <div className="flex items-center gap-1.5">
                {(["all", "tiktok", "instagram", "youtube"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatformFilter(p)}
                    className={cn(
                      "flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] transition-colors",
                      platformFilter === p
                        ? "bg-foreground/[0.10] text-page-text"
                        : "bg-foreground/[0.04] text-page-text-muted hover:bg-foreground/[0.08]"
                    )}
                  >
                    {p !== "all" && <PlatformIcon platform={p} size={14} />}
                    {p === "all" ? "All" : p === "tiktok" ? "TikTok" : p === "instagram" ? "Instagram" : "YouTube"}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1.5">
                {(["all", "active", "suspended", "pending"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] transition-colors",
                      statusFilter === s
                        ? "bg-foreground/[0.10] text-page-text"
                        : "bg-foreground/[0.04] text-page-text-muted hover:bg-foreground/[0.08]"
                    )}
                  >
                    {s !== "all" && (
                      <span className="size-1.5 rounded-full" style={{ background: CREATOR_STATUS_CONFIG[s].dot }} />
                    )}
                    {s === "all" ? "All" : CREATOR_STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Creator Table */}
            <div className="overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
              {/* Table header */}
              <div className="flex items-center border-b border-foreground/[0.06] px-4" style={{ height: 40 }}>
                <div className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Creator</div>
                <div className="hidden w-[120px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted sm:block">Platforms</div>
                <div className="w-[90px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Status</div>
                <div className="hidden w-[80px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted md:block">Campaigns</div>
                <div className="w-[100px] shrink-0 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Earnings</div>
                <div className="hidden w-[100px] shrink-0 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted lg:block">Joined</div>
                <div className="w-[44px] shrink-0" />
              </div>

              {/* Table body with proximity hover */}
              <div ref={tableRef} {...tableHandlers}>
                {filteredCreators.length === 0 && (
                  <div className="flex items-center justify-center py-16 text-sm text-page-text-muted">
                    No creators found
                  </div>
                )}
                {filteredCreators.map((creator, index) => {
                  const statusCfg = CREATOR_STATUS_CONFIG[creator.status];

                  return (
                    <div
                      key={creator.id}
                      ref={(el) => registerTableItem(index, el)}
                      onClick={() => setDetailCreator(creator)}
                      className="relative flex cursor-pointer items-center border-b border-foreground/[0.06] px-4 last:border-b-0"
                      style={{ height: 56 }}
                    >
                      {/* Proximity hover indicator */}
                      <AnimatePresence>
                        {tableActiveIndex === index && (
                          <motion.div
                            layoutId="creator-hover"
                            className="pointer-events-none absolute inset-x-0 inset-y-0 bg-foreground/[0.03]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={springs.fast}
                          />
                        )}
                      </AnimatePresence>

                      {/* Creator */}
                      <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-3">
                        <img src={creator.avatar} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                              {creator.name}
                            </span>
                            {creator.verified && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#60A5FA" className="shrink-0">
                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            )}
                            {creator.featured && (
                              <span className="inline-flex items-center rounded-full bg-[rgba(255,128,3,0.08)] px-1.5 py-0.5 text-[10px] font-medium text-[#FF8003]">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                            {creator.handle}
                          </div>
                        </div>
                      </div>

                      {/* Platforms */}
                      <div className="relative z-[1] hidden w-[120px] shrink-0 justify-center gap-1.5 sm:flex">
                        {creator.platforms.map((p) => (
                          <div key={p} className="flex size-7 items-center justify-center rounded-full bg-foreground/[0.04]">
                            <PlatformIcon platform={p} size={14} />
                          </div>
                        ))}
                      </div>

                      {/* Status pill */}
                      <div className="relative z-[1] flex w-[90px] shrink-0 justify-center">
                        <span
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                          style={{ background: statusCfg.bg, color: statusCfg.text }}
                        >
                          <span className="size-1.5 rounded-full" style={{ background: statusCfg.dot }} />
                          {statusCfg.label}
                        </span>
                      </div>

                      {/* Campaigns */}
                      <div className="relative z-[1] hidden w-[80px] shrink-0 text-center font-[family-name:var(--font-inter)] text-sm tabular-nums tracking-[-0.02em] text-page-text md:block">
                        {creator.campaigns}
                      </div>

                      {/* Earnings */}
                      <div className="relative z-[1] w-[100px] shrink-0 text-right font-[family-name:var(--font-inter)] text-sm font-medium tabular-nums tracking-[-0.02em] text-page-text">
                        {formatCurrency(creator.totalEarnings)}
                      </div>

                      {/* Join date */}
                      <div className="relative z-[1] hidden w-[100px] shrink-0 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted lg:block">
                        {creator.joinDate}
                      </div>

                      {/* Kebab menu */}
                      <div className="relative z-[1] w-[44px] shrink-0 text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-page-text-muted transition-colors hover:bg-foreground/[0.06]">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="19" r="1.5" />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[160px]">
                            <DropdownMenuItem onClick={() => setDetailCreator(creator)}>
                              View Profile
                            </DropdownMenuItem>
                            {creator.status === "active" && (
                              <DropdownMenuItem
                                onClick={() => handleSuspend(creator)}
                                className="text-[#FF2525] focus:text-[#FF2525]"
                              >
                                Suspend
                              </DropdownMenuItem>
                            )}
                            {creator.status === "suspended" && (
                              <DropdownMenuItem onClick={() => { updateCreatorStatus(creator.id, "active"); toast(`${creator.name} reactivated`); }}>
                                Reactivate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleBan(creator)}
                              className="text-[#FF2525] focus:text-[#FF2525]"
                            >
                              Ban
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast(`Message sent to ${creator.name}`)}>
                              Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ── TAB 2: Verification Queue ────────────────────────────── */}
        {/* ══════════════════════════════════════════════════════════ */}
        {sectionTab === 1 && (
          <>
            {/* Bulk actions */}
            <AnimatePresence>
              {selectedApps.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={springs.fast}
                  className="flex items-center gap-3 rounded-xl border border-foreground/[0.06] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
                >
                  <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                    {selectedApps.size} selected
                  </span>
                  <div className="h-4 w-px bg-foreground/[0.06]" />
                  <button
                    onClick={handleBulkApprove}
                    className="flex h-8 cursor-pointer items-center rounded-full bg-[rgba(0,178,89,0.08)] px-3 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-[#00B259] transition-colors hover:bg-[rgba(0,178,89,0.15)]"
                  >
                    Approve All
                  </button>
                  <button
                    onClick={handleBulkReject}
                    className="flex h-8 cursor-pointer items-center rounded-full bg-[rgba(255,37,37,0.08)] px-3 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[rgba(255,37,37,0.15)]"
                  >
                    Reject All
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-foreground/[0.06] bg-white py-20 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted/40">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="mt-4 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text-muted">
                  Verification queue is empty
                </span>
                <span className="mt-1 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-subtle">
                  All applications have been reviewed
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Select all row */}
                <div className="flex items-center gap-3 px-1">
                  <input
                    type="checkbox"
                    checked={selectedApps.size === applications.length && applications.length > 0}
                    onChange={toggleSelectAllApps}
                    className="size-3.5 cursor-pointer rounded border-foreground/20 accent-[#FF8003]"
                  />
                  <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted">
                    Select all ({applications.length})
                  </span>
                </div>

                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-foreground/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedApps.has(app.id)}
                          onChange={() => toggleAppSelect(app.id)}
                          className="size-3.5 cursor-pointer rounded border-foreground/20 accent-[#FF8003]"
                        />
                      </div>

                      {/* Avatar + info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <img src={app.avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                                {app.name}
                              </span>
                              <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                                {app.handle}
                              </span>
                            </div>
                            <div className="mt-0.5 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-subtle">
                              Applied {app.appliedDate}
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="mt-3 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] text-page-text-muted">
                          {app.bio}
                        </p>

                        {/* Platform links with follower counts */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {app.platforms.map((p) => (
                            <div
                              key={p.platform}
                              className="flex items-center gap-1.5 rounded-full bg-foreground/[0.04] px-2.5 py-1"
                            >
                              <PlatformIcon platform={p.platform} size={14} />
                              <span className="font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text">
                                {formatFollowers(p.followers)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Content samples */}
                        <div className="mt-3 flex items-center gap-2">
                          {app.contentSamples.map((_, i) => (
                            <div
                              key={i}
                              className="flex size-16 items-center justify-center rounded-lg border border-foreground/[0.06] bg-foreground/[0.03] dark:border-[rgba(224,224,224,0.03)]"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted/40">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => handleApproveApp(app.id)}
                            className="flex h-8 cursor-pointer items-center rounded-full bg-[#00B259] px-4 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectApp(app.id)}
                            className="flex h-8 cursor-pointer items-center rounded-full bg-[rgba(255,37,37,0.08)] px-4 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[rgba(255,37,37,0.15)]"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => toast(`Info request sent to ${app.name}`)}
                            className="flex h-8 cursor-pointer items-center rounded-full bg-foreground/[0.06] px-4 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-foreground/[0.10]"
                          >
                            Request More Info
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ── TAB 3: Performance Leaderboard ───────────────────────── */}
        {/* ══════════════════════════════════════════════════════════ */}
        {sectionTab === 2 && (
          <>
            {/* Time range selector */}
            <div className="flex items-center gap-1.5">
              {(["7d", "30d", "90d", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "flex h-8 cursor-pointer items-center rounded-full px-3 font-[family-name:var(--font-inter)] text-xs font-medium tracking-[-0.02em] transition-colors",
                    timeRange === range
                      ? "bg-foreground/[0.10] text-page-text"
                      : "bg-foreground/[0.04] text-page-text-muted hover:bg-foreground/[0.08]"
                  )}
                >
                  {range === "7d" ? "7 days" : range === "30d" ? "30 days" : range === "90d" ? "90 days" : "All time"}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
              {/* Header */}
              <div className="flex items-center border-b border-foreground/[0.06] px-4" style={{ height: 40 }}>
                <div className="w-[48px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">#</div>
                <div className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Creator</div>
                <div className="w-[100px] shrink-0 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Views</div>
                <div className="hidden w-[100px] shrink-0 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted sm:block">Earnings</div>
                <div className="hidden w-[80px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted md:block">Campaigns</div>
                <div className="hidden w-[100px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted lg:block">Completion</div>
                <div className="w-[50px] shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-page-text-muted">Trend</div>
                <div className="w-[44px] shrink-0" />
              </div>

              {/* Body */}
              <div ref={leaderboardRef} {...lbHandlers}>
                {MOCK_LEADERBOARD.map((entry, index) => {
                  const completionColor = entry.completionRate >= 80 ? "#00B259" : entry.completionRate >= 50 ? "#FF8003" : "#FF2525";

                  return (
                    <div
                      key={entry.id}
                      ref={(el) => registerLbItem(index, el)}
                      className="relative flex items-center border-b border-foreground/[0.06] px-4 last:border-b-0"
                      style={{ height: 56 }}
                    >
                      {/* Proximity hover indicator */}
                      <AnimatePresence>
                        {lbActiveIndex === index && (
                          <motion.div
                            layoutId="lb-hover"
                            className="pointer-events-none absolute inset-x-0 inset-y-0 bg-foreground/[0.03]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={springs.fast}
                          />
                        )}
                      </AnimatePresence>

                      {/* Rank */}
                      <div className="relative z-[1] w-[48px] shrink-0 text-center">
                        <span className={cn(
                          "font-[family-name:var(--font-inter)] text-sm font-semibold tabular-nums tracking-[-0.02em]",
                          entry.rank <= 3 ? "text-[#FF8003]" : "text-page-text-muted"
                        )}>
                          {entry.rank}
                        </span>
                      </div>

                      {/* Creator */}
                      <div className="relative z-[1] flex min-w-0 flex-1 items-center gap-3">
                        <img src={entry.avatar} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                        <div className="min-w-0">
                          <div className="truncate font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                            {entry.name}
                          </div>
                          <div className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                            {entry.handle}
                          </div>
                        </div>
                      </div>

                      {/* Views */}
                      <div className="relative z-[1] w-[100px] shrink-0 text-right font-[family-name:var(--font-inter)] text-sm font-medium tabular-nums tracking-[-0.02em] text-page-text">
                        {formatViews(entry.totalViews)}
                      </div>

                      {/* Earnings */}
                      <div className="relative z-[1] hidden w-[100px] shrink-0 text-right font-[family-name:var(--font-inter)] text-sm tabular-nums tracking-[-0.02em] text-page-text sm:block">
                        {formatCurrency(entry.totalEarnings)}
                      </div>

                      {/* Campaigns */}
                      <div className="relative z-[1] hidden w-[80px] shrink-0 text-center font-[family-name:var(--font-inter)] text-sm tabular-nums tracking-[-0.02em] text-page-text md:block">
                        {entry.campaigns}
                      </div>

                      {/* Completion rate */}
                      <div className="relative z-[1] hidden w-[100px] shrink-0 justify-center lg:flex">
                        <span
                          className="font-[family-name:var(--font-inter)] text-sm font-medium tabular-nums tracking-[-0.02em]"
                          style={{ color: completionColor }}
                        >
                          {entry.completionRate}%
                        </span>
                      </div>

                      {/* Trend */}
                      <div className="relative z-[1] flex w-[50px] shrink-0 justify-center">
                        {entry.trend === "up" && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00B259" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        )}
                        {entry.trend === "down" && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF2525" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                        {entry.trend === "flat" && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        )}
                      </div>

                      {/* Quick actions */}
                      <div className="relative z-[1] w-[44px] shrink-0 text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-page-text-muted transition-colors hover:bg-foreground/[0.06]">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="19" r="1.5" />
                              </svg>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[160px]">
                            <DropdownMenuItem onClick={() => {
                              const c = creators.find((c) => c.id === entry.id);
                              if (c) { toggleFeatured(c.id); toast(c.featured ? `${c.name} unfeatured` : `${c.name} featured`); }
                            }}>
                              Feature
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast(`Message sent to ${entry.name}`)}>
                              Message
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast(`${entry.name} flagged for review`)}>
                              Flag
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Creator Profile Modal ──────────────────────────────────── */}
      <Modal open={!!detailCreator} onClose={() => setDetailCreator(null)} size="lg">
        {detailCreator && (
          <>
            <ModalHeader>
              <div className="flex items-center gap-4">
                <img src={detailCreator.avatar} alt="" className="size-14 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-[family-name:var(--font-inter)] text-base font-semibold tracking-[-0.02em] text-page-text">
                      {detailCreator.name}
                    </h2>
                    {detailCreator.verified && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#60A5FA">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em]"
                      style={{ background: CREATOR_STATUS_CONFIG[detailCreator.status].bg, color: CREATOR_STATUS_CONFIG[detailCreator.status].text }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: CREATOR_STATUS_CONFIG[detailCreator.status].dot }} />
                      {CREATOR_STATUS_CONFIG[detailCreator.status].label}
                    </span>
                  </div>
                  <p className="mt-1 font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                    {detailCreator.handle}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {detailCreator.platforms.map((p) => (
                      <div key={p} className="flex items-center gap-1 rounded-full bg-foreground/[0.04] px-2 py-0.5">
                        <PlatformIcon platform={p} size={12} />
                        <span className="font-[family-name:var(--font-inter)] text-[11px] tracking-[-0.02em] text-page-text-muted">
                          {formatFollowers(detailCreator.followers[p])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="space-y-5">
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  { label: "Total Earnings", value: formatCurrency(detailCreator.totalEarnings) },
                  { label: "Campaigns", value: detailCreator.campaigns.toString() },
                  { label: "Videos", value: detailCreator.videosSubmitted.toString() },
                  { label: "Avg Views", value: formatViews(detailCreator.avgViews) },
                  { label: "Completion", value: `${detailCreator.completionRate}%` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <div className="font-[family-name:var(--font-inter)] text-[11px] font-medium tracking-[-0.02em] text-page-text-muted">
                      {stat.label}
                    </div>
                    <div className="mt-1 font-[family-name:var(--font-inter)] text-sm font-semibold tabular-nums tracking-[-0.02em] text-page-text">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent submissions */}
              {detailCreator.recentSubmissions.length > 0 && (
                <div>
                  <h4 className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                    Recent Submissions
                  </h4>
                  <div className="space-y-2">
                    {detailCreator.recentSubmissions.map((sub, i) => {
                      const subStatusColor = sub.status === "approved" ? "#00B259" : sub.status === "pending" ? "#FF8003" : "#FF2525";
                      return (
                        <div key={i} className="flex items-center gap-3 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.04]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-page-text-muted/50">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
                              {sub.title}
                            </div>
                            <div className="truncate font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                              {sub.campaign} &middot; {sub.date}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-[family-name:var(--font-inter)] text-xs tabular-nums tracking-[-0.02em] text-page-text-muted">
                              {formatViews(sub.views)} views
                            </span>
                            <span className="size-1.5 rounded-full" style={{ background: subStatusColor }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Payout history */}
              {detailCreator.payoutHistory.length > 0 && (
                <div>
                  <h4 className="mb-3 font-[family-name:var(--font-inter)] text-xs font-semibold uppercase tracking-[0.05em] text-page-text-muted">
                    Payout History
                  </h4>
                  <div className="space-y-0 rounded-xl border border-foreground/[0.06] dark:border-white/[0.06]">
                    {detailCreator.payoutHistory.map((payout, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-foreground/[0.06] px-4 py-3 last:border-b-0 dark:border-white/[0.06]">
                        <div className="flex items-center gap-3">
                          <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-muted">
                            {payout.date}
                          </span>
                          <span className="font-[family-name:var(--font-inter)] text-xs tracking-[-0.02em] text-page-text-subtle">
                            {payout.method}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tabular-nums tracking-[-0.02em] text-page-text">
                            {formatCurrency(payout.amount)}
                          </span>
                          <span
                            className="size-1.5 rounded-full"
                            style={{ background: payout.status === "completed" ? "#00B259" : "#FF8003" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <button
                onClick={() => setAuditSheet({ open: true, id: detailCreator.id, title: detailCreator.name })}
                className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
              >
                View Audit Log
              </button>
              <div className="flex items-center gap-2">
                {/* Verify / Unverify */}
                <button
                  onClick={() => {
                    toggleVerified(detailCreator.id);
                    toast(detailCreator.verified ? `${detailCreator.name} unverified` : `${detailCreator.name} verified`);
                  }}
                  className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                >
                  {detailCreator.verified ? "Unverify" : "Verify"}
                </button>

                {/* Feature */}
                <button
                  onClick={() => {
                    toggleFeatured(detailCreator.id);
                    toast(detailCreator.featured ? `${detailCreator.name} unfeatured` : `${detailCreator.name} featured`);
                  }}
                  className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                >
                  {detailCreator.featured ? "Unfeature" : "Feature"}
                </button>

                {/* Message */}
                <button
                  onClick={() => toast(`Message sent to ${detailCreator.name}`)}
                  className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
                >
                  Message
                </button>

                {/* Suspend / Reactivate */}
                {detailCreator.status === "active" && (
                  <button
                    onClick={() => handleSuspend(detailCreator)}
                    className="cursor-pointer rounded-full border border-[#FF2525]/30 bg-[#FF2525]/10 px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[#FF2525]/20"
                  >
                    Suspend
                  </button>
                )}
                {detailCreator.status === "suspended" && (
                  <button
                    onClick={() => {
                      updateCreatorStatus(detailCreator.id, "active");
                      toast(`${detailCreator.name} reactivated`);
                    }}
                    className="cursor-pointer rounded-full bg-[#FF8003] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
                  >
                    Reactivate
                  </button>
                )}

                {/* Ban */}
                <button
                  onClick={() => handleBan(detailCreator)}
                  className="cursor-pointer rounded-full border border-[#FF2525]/30 bg-[#FF2525]/10 px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-[#FF2525] transition-colors hover:bg-[#FF2525]/20"
                >
                  Ban
                </button>
              </div>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* ── Audit Log Sheet ────────────────────────────────────────── */}
      <AuditLogSheet
        open={auditSheet.open}
        onClose={() => setAuditSheet({ open: false, id: "", title: "" })}
        entityType="creator"
        entityId={auditSheet.id}
        entityTitle={auditSheet.title}
      />
    </div>
  );
}
