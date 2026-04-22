"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";
import { Modal } from "@/components/ui/modal";
import { RulesModal } from "@/components/submissions/rules-modal";
import {
  type Submission, type SubmissionStatus, type QualityResult, type CheckItem, type MobileSubTab,
  MOBILE_SUB_TABS,
  FilterIcon, PendingClockIcon, CheckCircleIcon, XCircleIcon, SparkleIcon, DotMenuIcon,
  PauseIcon, VolumeIcon, VolumeMutedIcon, CaptionIcon, ExpandIcon, ShrinkIcon,
  SubmissionTikTokIcon as TikTokIcon, CloseIcon, PaperclipAttachIcon, EmptyCircleIcon,
  FileTextIcon, VideoClipIcon, SubmissionChatBubbleIcon as ChatBubbleIcon, ChevronDownIcon,
  StatMiniCard, MetricPill, CheckRow, CheckSection, AIReviewPanel, DotMenuPopover,
  MobileSubmissionTabBar,
  SUBMISSIONS_CHART_POINTS, SUBMISSIONS_CHART_DATA,
  VideoPlayer,
} from "@/components/submissions";

// ── Mock Data ───────────────────────────────────────────────────────

const SUBMISSIONS: Submission[] = [
  {
    id: "1",
    creator: "xKaizen",
    avatar: "https://i.pravatar.cc/36?u=xkaizen",
    platform: "tiktok",
    platforms: ["tiktok", "instagram"],
    campaign: "Caffeine AI",
    date: "25 Feb '26",
    timeLeft: "1d left",
    status: "pending",
    aiScore: 23,
    aiResult: "fail",
    checksPassed: 1,
    checksTotal: 13,
    payout: "$690",
    engRate: "4.3%",
    botScore: 12,
    botScoreColor: "#FF2525",
    views: "1,2M",
    viewsNum: "1.2M",
    likes: "48,2K",
    likesNum: "48.2K",
    comments: "3,1K",
    commentsNum: "3.1K",
    shares: "1,3K",
    sharesNum: "1.3K",
    topCountry: "United Kingdom",
    countryCode: "gb",
    topAge: "18-24",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    videoDuration: "01:15",
    videoCurrentTime: "00:21",
    overviewText: "Failed 12 of 13 checks. No brand mentions, stock audio, and below-minimum video quality — not eligible for payout.",
    contentChecks: [
      { name: "Audio Match", detail: "Stock audio detected", score: 5, passed: false },
      { name: "Video Match", detail: "No content match", score: 8, passed: false },
      { name: "Talking Points", detail: "No script followed", score: 10, passed: false },
      { name: "Brand Mentions", detail: "No mention", score: 8, passed: false },
      { name: "Title & Tags", detail: "Generic spam file", score: 12, passed: false },
      { name: "Sentiment", detail: "Spam-like tone", score: 22, passed: false },
      { name: "Language", detail: "English, broken", score: 60, passed: true },
    ],
    visualChecks: [
      { name: "Audio Match", detail: "Stock audio detected", score: 5, passed: false },
      { name: "Video Match", detail: "No content match", score: 8, passed: false },
      { name: "Talking Points", detail: "No script followed", score: 10, passed: false },
      { name: "Brand Mentions", detail: "No mention", score: 8, passed: false },
      { name: "Title & Tags", detail: "Generic spam file", score: 12, passed: false },
      { name: "Sentiment", detail: "Spam-like tone", score: 22, passed: false },
      { name: "Language", detail: "English, broken", score: 60, passed: true },
    ],
    appliedDate: "2 Mar, 2026",
    motivation: "I've been creating tech content for 2 years and my audience loves discovering new tools. I specialize in productivity hacks and AI reviews. My engagement rate consistently outperforms the niche average.",
    tiktokAccounts: 3,
    instagramAccounts: 3,
  },
  {
    id: "2",
    creator: "Cryptoclipz",
    avatar: "https://i.pravatar.cc/36?u=cryptoclipz",
    platform: "instagram",
    platforms: ["tiktok", "instagram"],
    campaign: "Caffeine AI",
    date: "26 Feb '26",
    timeLeft: "2d left",
    status: "pending",
    aiScore: 92,
    aiResult: "pass",
    checksPassed: 13,
    checksTotal: 13,
    payout: "$275",
    engRate: "3.8%",
    botScore: 89,
    botScoreColor: "#00B259",
    views: "1,1M",
    viewsNum: "1.1M",
    likes: "56,9K",
    likesNum: "56.9K",
    comments: "1,4K",
    commentsNum: "1.4K",
    shares: "3,8K",
    sharesNum: "3.8K",
    topCountry: "United Kingdom",
    countryCode: "gb",
    topAge: "18-24",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    videoDuration: "01:15",
    videoCurrentTime: "00:21",
    overviewText: "Passed all 13 checks. Content matches the brief, brand mentioned 4 times, and video meets all quality requirements. Eligible for payout.",
    contentChecks: [
      { name: "Audio Match", detail: "Stock audio detected", score: 5, passed: false },
      { name: "Video Match", detail: "No content match", score: 8, passed: false },
      { name: "Talking Points", detail: "No script followed", score: 10, passed: false },
      { name: "Brand Mentions", detail: "No mention", score: 8, passed: false },
      { name: "Title & Tags", detail: "Generic spam file", score: 12, passed: false },
      { name: "Sentiment", detail: "Spam-like tone", score: 22, passed: false },
      { name: "Language", detail: "English, broken", score: 60, passed: true },
    ],
    visualChecks: [
      { name: "Audio Match", detail: "Stock audio detected", score: 5, passed: false },
      { name: "Video Match", detail: "No content match", score: 8, passed: false },
      { name: "Talking Points", detail: "No script followed", score: 10, passed: false },
      { name: "Brand Mentions", detail: "No mention", score: 8, passed: false },
      { name: "Title & Tags", detail: "Generic spam file", score: 12, passed: false },
      { name: "Sentiment", detail: "Spam-like tone", score: 22, passed: false },
      { name: "Language", detail: "English, broken", score: 60, passed: true },
    ],
    appliedDate: "28 Feb, 2026",
    motivation: "I've been creating fashion content for 3 years and my audience loves discovering new brands. I specialize in minimalist style and sustainable fashion. My engagement rate consistently outperforms the niche average, which means the brands I promote actually get results.",
    tiktokAccounts: 2,
    instagramAccounts: 4,
  },
  {
    id: "3",
    creator: "ViralVee",
    avatar: "https://i.pravatar.cc/36?u=viralvee",
    platform: "tiktok",
    platforms: ["tiktok"],
    campaign: "FitTrack Pro",
    date: "27 Feb '26",
    timeLeft: "3d left",
    status: "pending",
    aiScore: 78,
    aiResult: "pass",
    checksPassed: 10,
    checksTotal: 13,
    payout: "$425",
    engRate: "5.1%",
    botScore: 72,
    botScoreColor: "#E9A23B",
    views: "890K",
    viewsNum: "890K",
    likes: "34,1K",
    likesNum: "34.1K",
    comments: "2,8K",
    commentsNum: "2.8K",
    shares: "5,2K",
    sharesNum: "5.2K",
    topCountry: "United States",
    countryCode: "us",
    topAge: "25-34",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    videoDuration: "00:58",
    videoCurrentTime: "00:34",
    overviewText: "Passed 10 of 13 checks. Good brand integration and authentic delivery. Minor issues with hashtag placement and end-screen CTA missing.",
    contentChecks: [
      { name: "Audio Match", detail: "Original audio", score: 95, passed: true },
      { name: "Video Match", detail: "Content aligned", score: 88, passed: true },
      { name: "Talking Points", detail: "3/4 covered", score: 75, passed: true },
      { name: "Brand Mentions", detail: "Mentioned 3x", score: 82, passed: true },
      { name: "Title & Tags", detail: "Missing 2 tags", score: 45, passed: false },
      { name: "Sentiment", detail: "Positive tone", score: 90, passed: true },
      { name: "Language", detail: "English, fluent", score: 95, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "1080p verified", score: 92, passed: true },
      { name: "Lighting", detail: "Good natural light", score: 85, passed: true },
      { name: "Framing", detail: "Well composed", score: 88, passed: true },
      { name: "Brand Logo", detail: "Visible at 0:12", score: 78, passed: true },
      { name: "End Screen", detail: "CTA missing", score: 20, passed: false },
      { name: "Watermark", detail: "None detected", score: 100, passed: true },
    ],
    appliedDate: "1 Mar, 2026",
    motivation: "Fitness content is my passion and I've built a loyal community of 500K+ followers who trust my product recommendations. I only promote products I genuinely use and believe in.",
    tiktokAccounts: 1,
    instagramAccounts: 0,
  },
  {
    id: "4",
    creator: "TechTalksDaily",
    avatar: "https://i.pravatar.cc/36?u=techtalksdaily",
    platform: "instagram",
    platforms: ["instagram"],
    campaign: "NovaPay Wallet",
    date: "28 Feb '26",
    timeLeft: "5d left",
    status: "pending",
    aiScore: 45,
    aiResult: "fail",
    checksPassed: 5,
    checksTotal: 13,
    payout: "$1,200",
    engRate: "2.1%",
    botScore: 34,
    botScoreColor: "#FF2525",
    views: "2,4M",
    viewsNum: "2.4M",
    likes: "18,3K",
    likesNum: "18.3K",
    comments: "890",
    commentsNum: "890",
    shares: "2,1K",
    sharesNum: "2.1K",
    topCountry: "India",
    countryCode: "in",
    topAge: "18-24",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    videoDuration: "01:32",
    videoCurrentTime: "00:45",
    overviewText: "Failed 8 of 13 checks. High view count but low engagement ratio suggests inorganic traffic. Brand messaging was off-brief and product shown incorrectly.",
    contentChecks: [
      { name: "Audio Match", detail: "Background music too loud", score: 30, passed: false },
      { name: "Video Match", detail: "Off-brief content", score: 25, passed: false },
      { name: "Talking Points", detail: "1/4 covered", score: 20, passed: false },
      { name: "Brand Mentions", detail: "Wrong product name", score: 15, passed: false },
      { name: "Title & Tags", detail: "Correct tags used", score: 80, passed: true },
      { name: "Sentiment", detail: "Neutral tone", score: 55, passed: true },
      { name: "Language", detail: "English, clear", score: 88, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "720p only", score: 40, passed: false },
      { name: "Lighting", detail: "Too dark", score: 25, passed: false },
      { name: "Framing", detail: "Product cut off", score: 30, passed: false },
      { name: "Brand Logo", detail: "Not visible", score: 10, passed: false },
      { name: "End Screen", detail: "CTA present", score: 75, passed: true },
      { name: "Watermark", detail: "None detected", score: 100, passed: true },
    ],
    appliedDate: "3 Mar, 2026",
    motivation: "As a tech reviewer with 2M+ followers, I bring detailed and honest product analysis that drives real conversions. My audience skews 18-34 and is highly engaged with fintech content.",
    tiktokAccounts: 0,
    instagramAccounts: 2,
  },
  {
    id: "5",
    creator: "NightOwlEdits",
    avatar: "https://i.pravatar.cc/36?u=nightowledits",
    platform: "tiktok",
    platforms: ["tiktok", "instagram"],
    campaign: "Caffeine AI",
    date: "1 Mar '26",
    timeLeft: "6d left",
    status: "pending",
    aiScore: 88,
    aiResult: "pass",
    checksPassed: 12,
    checksTotal: 13,
    payout: "$550",
    engRate: "6.7%",
    botScore: 94,
    botScoreColor: "#00B259",
    views: "3,1M",
    viewsNum: "3.1M",
    likes: "124K",
    likesNum: "124K",
    comments: "8,9K",
    commentsNum: "8.9K",
    shares: "12,4K",
    sharesNum: "12.4K",
    topCountry: "Germany",
    countryCode: "de",
    topAge: "25-34",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    videoDuration: "01:05",
    videoCurrentTime: "00:52",
    overviewText: "Passed 12 of 13 checks. Exceptional engagement metrics and authentic storytelling. Only minor issue: one talking point slightly paraphrased.",
    contentChecks: [
      { name: "Audio Match", detail: "Original voiceover", score: 98, passed: true },
      { name: "Video Match", detail: "Perfect match", score: 95, passed: true },
      { name: "Talking Points", detail: "3/4 exact match", score: 72, passed: true },
      { name: "Brand Mentions", detail: "Mentioned 5x", score: 96, passed: true },
      { name: "Title & Tags", detail: "All tags present", score: 100, passed: true },
      { name: "Sentiment", detail: "Very positive", score: 97, passed: true },
      { name: "Language", detail: "English, native", score: 99, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "4K verified", score: 100, passed: true },
      { name: "Lighting", detail: "Studio quality", score: 95, passed: true },
      { name: "Framing", detail: "Professional", score: 92, passed: true },
      { name: "Brand Logo", detail: "Clear at 0:08", score: 90, passed: true },
      { name: "End Screen", detail: "Strong CTA", score: 88, passed: true },
      { name: "Watermark", detail: "Subtle branding", score: 45, passed: false },
    ],
    appliedDate: "4 Mar, 2026",
    motivation: "Creative storytelling is what sets my content apart. I've collaborated with 20+ brands and consistently deliver content that exceeds KPIs. My editing style is cinematic and attention-grabbing.",
    tiktokAccounts: 3,
    instagramAccounts: 2,
  },
  {
    id: "6",
    creator: "FitnessWithMaya",
    avatar: "https://i.pravatar.cc/36?u=fitnesswithmaya",
    platform: "instagram",
    platforms: ["instagram", "tiktok"],
    campaign: "FitTrack Pro",
    date: "2 Mar '26",
    timeLeft: "7d left",
    status: "pending",
    aiScore: 61,
    aiResult: "pass",
    checksPassed: 8,
    checksTotal: 13,
    payout: "$380",
    engRate: "4.9%",
    botScore: 67,
    botScoreColor: "#E9A23B",
    views: "456K",
    viewsNum: "456K",
    likes: "22,1K",
    likesNum: "22.1K",
    comments: "1,9K",
    commentsNum: "1.9K",
    shares: "3,4K",
    sharesNum: "3.4K",
    topCountry: "Brazil",
    countryCode: "br",
    topAge: "18-24",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    videoDuration: "01:48",
    videoCurrentTime: "01:12",
    overviewText: "Passed 8 of 13 checks. Good product demonstration and genuine enthusiasm. Audio quality needs improvement and some brand guidelines not followed.",
    contentChecks: [
      { name: "Audio Match", detail: "Echo detected", score: 35, passed: false },
      { name: "Video Match", detail: "Mostly aligned", score: 70, passed: true },
      { name: "Talking Points", detail: "2/4 covered", score: 50, passed: false },
      { name: "Brand Mentions", detail: "Mentioned 2x", score: 65, passed: true },
      { name: "Title & Tags", detail: "Partial tags", score: 55, passed: true },
      { name: "Sentiment", detail: "Enthusiastic", score: 92, passed: true },
      { name: "Language", detail: "English, accented", score: 78, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "1080p verified", score: 90, passed: true },
      { name: "Lighting", detail: "Mixed lighting", score: 50, passed: false },
      { name: "Framing", detail: "Shaky at times", score: 42, passed: false },
      { name: "Brand Logo", detail: "Brief appearance", score: 60, passed: true },
      { name: "End Screen", detail: "No CTA", score: 15, passed: false },
      { name: "Watermark", detail: "None detected", score: 100, passed: true },
    ],
    appliedDate: "5 Mar, 2026",
    motivation: "I'm a certified personal trainer who creates authentic fitness content. My followers trust my recommendations because I only promote products I've personally tested and believe in.",
    tiktokAccounts: 1,
    instagramAccounts: 3,
  },
  {
    id: "7",
    creator: "CodeWithSam",
    avatar: "https://i.pravatar.cc/36?u=codewithsam",
    platform: "tiktok",
    platforms: ["tiktok"],
    campaign: "NovaPay Wallet",
    date: "3 Mar '26",
    timeLeft: "8d left",
    status: "pending",
    aiScore: 15,
    aiResult: "fail",
    checksPassed: 2,
    checksTotal: 13,
    payout: "$0",
    engRate: "0.4%",
    botScore: 8,
    botScoreColor: "#FF2525",
    views: "12K",
    viewsNum: "12K",
    likes: "89",
    likesNum: "89",
    comments: "12",
    commentsNum: "12",
    shares: "3",
    sharesNum: "3",
    topCountry: "Nigeria",
    countryCode: "ng",
    topAge: "13-17",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    videoDuration: "00:32",
    videoCurrentTime: "00:08",
    overviewText: "Failed 11 of 13 checks. Content appears to be entirely unrelated to the campaign. Suspected re-upload of existing content with no modifications.",
    contentChecks: [
      { name: "Audio Match", detail: "Unrelated audio", score: 3, passed: false },
      { name: "Video Match", detail: "No relation", score: 2, passed: false },
      { name: "Talking Points", detail: "None followed", score: 0, passed: false },
      { name: "Brand Mentions", detail: "Zero mentions", score: 0, passed: false },
      { name: "Title & Tags", detail: "Wrong category", score: 8, passed: false },
      { name: "Sentiment", detail: "Irrelevant", score: 10, passed: false },
      { name: "Language", detail: "English, basic", score: 55, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "480p only", score: 15, passed: false },
      { name: "Lighting", detail: "Very poor", score: 10, passed: false },
      { name: "Framing", detail: "Random footage", score: 5, passed: false },
      { name: "Brand Logo", detail: "Not present", score: 0, passed: false },
      { name: "End Screen", detail: "None", score: 0, passed: false },
      { name: "Watermark", detail: "None detected", score: 100, passed: true },
    ],
    appliedDate: "6 Mar, 2026",
    motivation: "Looking to expand my content portfolio into brand partnerships. I have experience with coding tutorials and tech reviews.",
    tiktokAccounts: 1,
    instagramAccounts: 0,
  },
  {
    id: "8",
    creator: "SkincareSophie",
    avatar: "https://i.pravatar.cc/36?u=skincaresophie",
    platform: "instagram",
    platforms: ["instagram", "tiktok"],
    campaign: "Caffeine AI",
    date: "4 Mar '26",
    timeLeft: "9d left",
    status: "pending",
    aiScore: 95,
    aiResult: "pass",
    checksPassed: 13,
    checksTotal: 13,
    payout: "$820",
    engRate: "7.2%",
    botScore: 97,
    botScoreColor: "#00B259",
    views: "4,7M",
    viewsNum: "4.7M",
    likes: "210K",
    likesNum: "210K",
    comments: "15,2K",
    commentsNum: "15.2K",
    shares: "18,9K",
    sharesNum: "18.9K",
    topCountry: "Canada",
    countryCode: "ca",
    topAge: "25-34",
    videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    videoDuration: "02:10",
    videoCurrentTime: "01:35",
    overviewText: "Perfect score — passed all 13 checks. Outstanding production quality, seamless brand integration, and exceptional audience engagement. Top performer this week.",
    contentChecks: [
      { name: "Audio Match", detail: "Crystal clear", score: 99, passed: true },
      { name: "Video Match", detail: "Exact brief match", score: 98, passed: true },
      { name: "Talking Points", detail: "4/4 covered", score: 100, passed: true },
      { name: "Brand Mentions", detail: "Mentioned 6x", score: 100, passed: true },
      { name: "Title & Tags", detail: "All optimized", score: 95, passed: true },
      { name: "Sentiment", detail: "Highly positive", score: 98, passed: true },
      { name: "Language", detail: "English, eloquent", score: 99, passed: true },
    ],
    visualChecks: [
      { name: "Resolution", detail: "4K HDR", score: 100, passed: true },
      { name: "Lighting", detail: "Professional", score: 98, passed: true },
      { name: "Framing", detail: "Cinematic", score: 96, passed: true },
      { name: "Brand Logo", detail: "Prominent", score: 94, passed: true },
      { name: "End Screen", detail: "Perfect CTA", score: 92, passed: true },
      { name: "Watermark", detail: "Clean", score: 100, passed: true },
    ],
    appliedDate: "7 Mar, 2026",
    motivation: "I've built a premium beauty and skincare community with 4.7M views on my last campaign. My audience is primarily 25-34 women with high purchasing power. Every brand I work with sees measurable ROI.",
    tiktokAccounts: 2,
    instagramAccounts: 3,
  },
];

const TABS = [
  { name: "All", count: 21 },
  { name: "Pending", count: 8 },
  { name: "Approved", count: 5 },
  { name: "Rejected", count: 5 },
  { name: "Flagged", count: 3 },
];

const SUBMISSION_FILTERS: Filter[] = [
  {
    key: "platform",
    icon: null,
    label: "Platform",
    singleSelect: true,
    options: [
      { value: "tiktok", label: "TikTok" },
      { value: "instagram", label: "Instagram" },
    ],
  },
  {
    key: "status",
    icon: null,
    label: "Status",
    singleSelect: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "accepted", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ],
  },
];

// ── Fullscreen Comment Input ────────────────────────────────────────

function SubmissionCard({ submission, onAction }: { submission: Submission; onAction?: (action: "approve" | "reject") => void }) {
  const isPass = submission.aiResult === "pass";
  const scoreColor = isPass ? "#00B259" : "#FF2525";
  const [aiSummaryHidden, setAiSummaryHidden] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileSubTab>("Overview");
  const [metricState, setMetricState] = useState<Record<string, boolean>>({
    views: true,
    likes: true,
    comments: true,
    shares: false,
  });
  const toggleMetric = useCallback((key: string) => {
    setMetricState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);
  const visibleMetricKeys = useMemo(
    () => Object.entries(metricState).filter(([, on]) => on).map(([k]) => k),
    [metricState],
  );

  return (
    <div className="overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
      {/* ───── MOBILE LAYOUT ───── */}
      <div className="md:hidden">
        {/* Creator header */}
        <div className="flex items-center gap-3 border-b border-foreground/[0.03] p-3">
          <img
            src={submission.avatar}
            alt={submission.creator}
            className="size-9 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
              {submission.creator}
            </span>
            <div className="mt-1.5 flex items-center gap-1">
              <PlatformIcon platform={submission.platform} size={12} className="opacity-50" />
              <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">·</span>
              <span className="truncate font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                {submission.campaign}
              </span>
              <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">·</span>
              <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                {submission.date}
              </span>
              <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">·</span>
              <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                {submission.timeLeft}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[rgba(251,146,60,0.08)] p-2">
            <PendingClockIcon size={16} />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <DotMenuPopover aiSummaryHidden={aiSummaryHidden} onToggleAiSummary={() => setAiSummaryHidden((v) => !v)} />
          </div>
        </div>

        {/* AI Quality bar */}
        <div className="flex flex-col gap-2 border-b border-foreground/[0.03] p-3">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-1.5">
              <SparkleIcon color={scoreColor} />
              <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em]" style={{ color: scoreColor }}>
                {submission.aiScore}/100
              </span>
            </div>
            <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text">
              AI Quality
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em]" style={{ color: scoreColor }}>
              {isPass ? "Pass" : "Fail"}
            </span>
            <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
              {submission.checksPassed}/{submission.checksTotal} passed
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <MobileSubmissionTabBar activeTab={mobileTab} onTabChange={setMobileTab} />

        {/* Tab content */}
        {mobileTab === "Overview" && (
          <div className="flex">
            {/* Video preview — height matches stat cards */}
            <div className="shrink-0 overflow-hidden p-3 pr-0" style={{ width: 210 }}>
              <div className="h-full overflow-hidden rounded-xl">
                <VideoPlayer
                  src={submission.videoUrl}
                  platform={submission.platform}
                  duration={submission.videoDuration}
                />
              </div>
            </div>
            {/* Stats sidebar — drives the row height */}
            <div className="flex flex-1 flex-col gap-2 p-3">
              <StatMiniCard value={submission.payout} label="Payout" variant="filled" />
              <StatMiniCard value={submission.engRate} label="Eng. rate" variant="outlined" />
              <StatMiniCard
                value={`${submission.botScore}/100`}
                label="Bot score"
                valueColor={submission.botScoreColor}
                variant="outlined"
              />
              <div className="flex flex-col justify-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg p-3 dark:border-card-inner-border dark:bg-card-inner-bg">
                <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">Top country</span>
                <div className="flex items-center gap-1.5">
                  <img
                    src={`https://hatscripts.github.io/circle-flags/flags/${submission.countryCode}.svg`}
                    alt={submission.topCountry}
                    className="size-3 shrink-0 rounded-full"
                  />
                  <span className="font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    {submission.topCountry}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg p-3 dark:border-card-inner-border dark:bg-card-inner-bg">
                <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">Top age</span>
                <span className="font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                  {submission.topAge}
                </span>
              </div>
            </div>
          </div>
        )}

        {mobileTab === "Stats" && (
          <div className="flex flex-col gap-2 overflow-y-auto p-3" style={{ height: 328 }}>
            <div className="flex gap-2">
              <StatMiniCard value={submission.payout} label="Payout" variant="filled" />
              <StatMiniCard value={submission.engRate} label="Eng. rate" variant="outlined" />
              <StatMiniCard
                value={`${submission.botScore}/100`}
                label="Bot score"
                valueColor={submission.botScoreColor}
                variant="outlined"
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-2xl border border-foreground/[0.06] bg-card-bg p-3 dark:border-card-inner-border dark:bg-card-inner-bg">
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <MetricPill label="Views" value={submission.views} color="#4D81EE" bg="rgba(77,129,238,0.1)" active={metricState.views} onClick={() => toggleMetric("views")} />
                <MetricPill label="Likes" value={submission.likes} color="#DA5597" bg="rgba(218,85,151,0.1)" active={metricState.likes} onClick={() => toggleMetric("likes")} />
                <MetricPill label="Comments" value={submission.comments} color="#E9A23B" bg="rgba(233,162,59,0.1)" active={metricState.comments} onClick={() => toggleMetric("comments")} />
                <MetricPill label="Shares" value={submission.shares} color="var(--page-text-subtle)" bg="rgba(128,128,128,0.1)" active={metricState.shares} onClick={() => toggleMetric("shares")} />
              </div>
              <AnalyticsPocChartPlaceholder
                variant="line"
                chartStylePreset="performance-main"
                lineChart={SUBMISSIONS_CHART_DATA}
                activeLineDataset="daily"
                visibleMetricKeys={visibleMetricKeys}
                heightClassName="h-[172px]"
              />
            </div>
          </div>
        )}

        {mobileTab === "AI Quality" && !aiSummaryHidden && (
          <div className="flex flex-col" style={{ height: 328 }}>
            <div className="min-h-0 flex-1 overflow-y-auto p-3 [&>div]:!w-full [&>div]:!border-l-0 [&>div]:!flex-col [&>div>div:last-child]:!hidden">
              <AIReviewPanel submission={submission} scoreColor={scoreColor} onAction={onAction} />
            </div>
          </div>
        )}

        {/* Action buttons — always visible as footer */}
        <div className="flex items-center gap-2 border-t border-foreground/[0.03] p-3">
          <button
            onClick={() => onAction?.("reject")}
            className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(251,113,133,0.08)] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM5.64645 5.64645C5.84171 5.45118 6.15829 5.45118 6.35355 5.64645L8 7.29289L9.64645 5.64645C9.84171 5.45118 10.1583 5.45118 10.3536 5.64645C10.5488 5.84171 10.5488 6.15829 10.3536 6.35355L8.70711 8L10.3536 9.64645C10.5488 9.84171 10.5488 10.1583 10.3536 10.3536C10.1583 10.5488 9.84171 10.5488 9.64645 10.3536L8 8.70711L6.35355 10.3536C6.15829 10.5488 5.84171 10.5488 5.64645 10.3536C5.45118 10.1583 5.45118 9.84171 5.64645 9.64645L7.29289 8L5.64645 6.35355C5.45118 6.15829 5.45118 5.84171 5.64645 5.64645Z" fill="#FB7185"/></svg>
            <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FB7185]">
              Reject
            </span>
          </button>
          <button
            onClick={() => onAction?.("approve")}
            className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(52,211,153,0.08)] transition-colors hover:bg-[rgba(52,211,153,0.14)] dark:bg-[rgba(52,211,153,0.12)] dark:hover:bg-[rgba(52,211,153,0.18)]"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#34D399"/><path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#34D399]">
              Approve
            </span>
          </button>
        </div>
      </div>

      {/* ───── DESKTOP LAYOUT ───── */}
      <div className="hidden md:block">
        {/* Header row */}
        <div className="flex items-center border-b border-foreground/[0.06]">
          {/* Creator info */}
          <div className="flex flex-1 items-center gap-3 px-3 py-3">
            <img
              src={submission.avatar}
              alt={submission.creator}
              className="size-9 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1.5">
              <span className="font-inter text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
                {submission.creator}
              </span>
              <div className="flex items-center gap-1">
                <PlatformIcon platform={submission.platform} size={12} className="opacity-50" />
                <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">·</span>
                <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                  {submission.campaign}
                </span>
                <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">·</span>
                <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                  {submission.date}
                </span>
                <span className="font-inter text-xs leading-[1.2] tracking-[-0.02em] text-foreground/20">·</span>
                <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                  {submission.timeLeft}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <div className="ml-auto flex items-center gap-1 rounded-full bg-[rgba(251,146,60,0.08)] py-2 pr-2 pl-1.5">
              <PendingClockIcon />
              <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FB923C]">
                Pending
              </span>
            </div>

            {/* Dot menu */}
            <div onClick={(e) => e.stopPropagation()}>
              <DotMenuPopover aiSummaryHidden={aiSummaryHidden} onToggleAiSummary={() => setAiSummaryHidden((v) => !v)} />
            </div>
          </div>

          {/* AI Quality section (only when AI panel is visible; when hidden, actions move to card footer) */}
          {!aiSummaryHidden && (
            <div className="flex w-[280px] shrink-0 flex-col gap-2 border-l border-foreground/[0.06] px-3 py-3 lg:w-[360px]">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-1.5">
                  <SparkleIcon color={scoreColor} />
                  <span
                    className="font-inter text-sm font-medium leading-none tracking-[-0.02em]"
                    style={{ color: scoreColor }}
                  >
                    {submission.aiScore}/100
                  </span>
                </div>
                <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text">
                  AI Quality
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-1">
                  <span
                    className="font-inter text-sm font-medium leading-none tracking-[-0.02em]"
                    style={{ color: scoreColor }}
                  >
                    {isPass ? "Pass" : "Fail"}
                  </span>
                </div>
                <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                  {submission.checksPassed}/{submission.checksTotal} passed
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Body: 3-column layout */}
        <div className="flex" style={{ height: 380 }}>
          {/* Col 1: Video Player */}
          <div className="w-[200px] shrink-0 overflow-hidden lg:w-[260px]">
            <VideoPlayer
              src={submission.videoUrl}
              platform={submission.platform}
              duration={submission.videoDuration}
            />
          </div>

          {/* Col 2: Stats, Chart, Info */}
          <div className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
            {/* Stat cards */}
            <div className="flex gap-2">
              <StatMiniCard value={submission.payout} label="Payout" variant="filled" />
              <StatMiniCard value={submission.engRate} label="Eng. rate" variant="outlined" />
              <StatMiniCard
                value={`${submission.botScore}/100`}
                label="Bot score"
                valueColor={submission.botScoreColor}
                variant="outlined"
              />
            </div>

            {/* Performance chart card */}
            <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-2xl border border-foreground/[0.06] bg-card-bg p-3 dark:border-card-inner-border dark:bg-card-inner-bg">
              {/* Metric pills */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <MetricPill label="Views" value={submission.views} color="#4D81EE" bg="rgba(77,129,238,0.1)" active={metricState.views} onClick={() => toggleMetric("views")} />
                <MetricPill label="Likes" value={submission.likes} color="#DA5597" bg="rgba(218,85,151,0.1)" active={metricState.likes} onClick={() => toggleMetric("likes")} />
                <MetricPill label="Comments" value={submission.comments} color="#E9A23B" bg="rgba(233,162,59,0.1)" active={metricState.comments} onClick={() => toggleMetric("comments")} />
                <MetricPill label="Shares" value={submission.shares} color="var(--page-text-subtle)" bg="rgba(128,128,128,0.1)" active={metricState.shares} onClick={() => toggleMetric("shares")} />
              </div>

              {/* Chart */}
              <AnalyticsPocChartPlaceholder
                variant="line"
                chartStylePreset="performance-main"
                lineChart={SUBMISSIONS_CHART_DATA}
                activeLineDataset="daily"
                visibleMetricKeys={visibleMetricKeys}
                heightClassName="h-[172px]"
              />
            </div>

            {/* Bottom info row + inline actions when AI panel is hidden */}
            <div className="-mx-3 flex items-stretch gap-2 border-t border-foreground/[0.06] px-3 pt-3 dark:border-card-inner-border">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg px-3 py-3 dark:border-card-inner-border dark:bg-card-inner-bg">
                <span className="shrink-0 font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                  Top country
                </span>
                <div className="flex min-w-0 items-center gap-1.5">
                  <img
                    src={`https://hatscripts.github.io/circle-flags/flags/${submission.countryCode}.svg`}
                    alt={submission.topCountry}
                    className="size-4 shrink-0 rounded-full"
                  />
                  <span className="truncate font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                    {submission.topCountry}
                  </span>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg px-3 py-3 dark:border-card-inner-border dark:bg-card-inner-bg">
                <span className="shrink-0 font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
                  Top age
                </span>
                <span className="truncate font-inter text-xs font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                  {submission.topAge}
                </span>
              </div>
              {aiSummaryHidden && (
                <>
                  <div className="-my-3 w-px self-stretch bg-foreground/[0.08] dark:bg-[rgba(224,224,224,0.08)]" />
                  <div className="flex w-[256px] shrink-0 items-center gap-2 lg:w-[336px]">
                    <button
                      onClick={() => onAction?.("reject")}
                      className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(251,113,133,0.08)] transition-colors hover:bg-[rgba(251,113,133,0.12)] dark:bg-[rgba(251,113,133,0.12)] dark:hover:bg-[rgba(251,113,133,0.18)]"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM5.64645 5.64645C5.84171 5.45118 6.15829 5.45118 6.35355 5.64645L8 7.29289L9.64645 5.64645C9.84171 5.45118 10.1583 5.45118 10.3536 5.64645C10.5488 5.84171 10.5488 6.15829 10.3536 6.35355L8.70711 8L10.3536 9.64645C10.5488 9.84171 10.5488 10.1583 10.3536 10.3536C10.1583 10.5488 9.84171 10.5488 9.64645 10.3536L8 8.70711L6.35355 10.3536C6.15829 10.5488 5.84171 10.5488 5.64645 10.3536C5.45118 10.1583 5.45118 9.84171 5.64645 9.64645L7.29289 8L5.64645 6.35355C5.45118 6.15829 5.45118 5.84171 5.64645 5.64645Z" fill="#FB7185"/></svg>
                      <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FB7185]">Reject</span>
                    </button>
                    <button
                      onClick={() => onAction?.("approve")}
                      className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[rgba(52,211,153,0.08)] transition-colors hover:bg-[rgba(52,211,153,0.14)] dark:bg-[rgba(52,211,153,0.12)] dark:hover:bg-[rgba(52,211,153,0.18)]"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#34D399"/><path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#34D399]">Approve</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Col 3: AI Review Panel */}
          {!aiSummaryHidden && (
            <AIReviewPanel submission={submission} scoreColor={scoreColor} onAction={onAction} />
          )}
        </div>
      </div>

    </div>
  );
}

// ── Scroll Variants ──────────────────────────────────────────────────

type ScrollVariant = "snap" | "carousel" | "fade-in" | "blur-in" | "slide-up" | "stagger" | "spring-pop";

const VARIANT_LABELS: Record<ScrollVariant, string> = {
  snap: "Scroll Snap",
  carousel: "Carousel",
  "fade-in": "Fade In",
  "blur-in": "Blur Dissolve",
  "slide-up": "Slide Up",
  stagger: "Stagger Cascade",
  "spring-pop": "Spring Pop",
};

// ─ Variant A: CSS scroll-snap ─
function ScrollSnapList({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtTop(el.scrollTop < 4);
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 4);
  }, []);

  return (
    <div className="relative mt-2">
      {/* Top gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 transition-opacity duration-200"
        style={{
          background: "linear-gradient(180deg, var(--page-bg) 0%, transparent 100%)",
          opacity: atTop ? 0 : 1,
        }}
      />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex flex-col gap-2"
        style={{ scrollSnapType: "y mandatory", overflowY: "auto", maxHeight: "calc(100dvh - 180px)" }}
      >
        {children}
      </div>
      {/* Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 transition-opacity duration-200"
        style={{
          background: "linear-gradient(0deg, var(--page-bg) 0%, transparent 100%)",
          opacity: atBottom ? 0 : 1,
        }}
      />
    </div>
  );
}

function ScrollSnapItem({ children }: { children: ReactNode }) {
  return (
    <div style={{ scrollSnapAlign: "start" }}>
      {children}
    </div>
  );
}

// ─ Variant B: Framer Motion carousel ─
const carouselVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 600 : -600, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -600 : 600, opacity: 0 }),
};

function CarouselList({ items }: { items: typeof SUBMISSIONS }) {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = useCallback(
    (newDir: number) => {
      setPage(([prev]) => {
        const next = prev + newDir;
        if (next < 0 || next >= items.length) return [prev, 0];
        return [next, newDir];
      });
    },
    [items.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") paginate(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") paginate(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [paginate]);

  return (
    <div className="mt-2">
      {/* Carousel viewport */}
      <div className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={carouselVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SubmissionCard submission={items[page]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="flex size-8 items-center justify-center rounded-full bg-accent text-page-text disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > page ? 1 : -1])}
              className={cn(
                "size-2 rounded-full transition-all",
                i === page ? "scale-125 bg-foreground" : "bg-foreground/20",
              )}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          disabled={page === items.length - 1}
          className="flex size-8 items-center justify-center rounded-full bg-accent text-page-text disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const EXIT_ANIM = { opacity: 0, transition: { duration: 0.12 } };

// ─ Variant C: InView fade-in ─
function FadeInItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─ Variant D: Blur dissolve ─
function BlurInItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─ Variant E: Dramatic slide up ─
function SlideUpItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─ Variant F: Stagger cascade (index-based delay) ─
function StaggerItem({ children, index }: { children: ReactNode; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// ─ Variant G: Spring pop ─
function SpringPopItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={EXIT_ANIM}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      {children}
    </motion.div>
  );
}


// ── Scores & Matches Modal ──────────────────────────────────────────

const SCORE_CARDS = [
  {
    title: "AI Quality Score",
    description:
      "Measures how well a submission meets the campaign\u2019s content, visual, and audio requirements. Scored 0\u2013100. Calculated by: AI content analysis.",
  },
  {
    title: "Bot Score",
    description:
      "Detects artificial engagement on a submission. Higher means more suspicious activity. Calculated by: Engagement pattern analysis.",
  },
  {
    title: "Match Score",
    description:
      "How well a creator\u2019s profile and audience align with a campaign. Higher is a stronger fit. Calculated by: Profile + audience data.",
  },
  {
    title: "Engagement Score",
    description:
      "Measures the real quality of engagement a video receives, beyond just view counts. Scored 0\u2013100. Calculated by: Comment quality, save rate, share-to-like ratio, watch time, replay rate, follower-to-viewer ratio",
  },
] as const;

function LightBulbIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H15M12 3C8.68629 3 6 5.68629 6 9C6 11.2208 7.20832 13.1599 9 14.1973V16C9 16.5523 9.44772 17 10 17H14C14.5523 17 15 16.5523 15 16V14.1973C16.7917 13.1599 18 11.2208 18 9C18 5.68629 15.3137 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScoresModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} showClose={false}>
      <div className="relative flex max-h-[90vh] flex-col">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/30 transition-colors hover:bg-foreground/[0.10]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4.667 4.667L11.333 11.333M11.333 4.667L4.667 11.333" stroke="currentColor" strokeWidth="1.52381" strokeLinecap="round" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="scrollbar-hide flex flex-col items-center gap-4 overflow-y-auto p-5">
          {/* Icon + Title + Description */}
          <div className="flex flex-col items-center gap-4">
            {/* Icon circle */}
            <div className="relative flex size-14 items-center justify-center rounded-full bg-foreground/[0.03] shadow-[0_0_0_2px_#fff] dark:shadow-none">
              <LightBulbIcon />
              <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
              <div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.2) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-2">
              <h2 className="font-inter text-lg font-medium leading-[1.2] tracking-[-0.02em] text-page-text">
                Understanding Scores and Matches
              </h2>
              <p className="max-w-[300px] text-center font-inter text-sm font-normal leading-[1.5] tracking-[-0.02em] text-foreground/70">
                These metrics help you make faster, more informed decisions.
              </p>
            </div>
          </div>

          {/* Score cards */}
          <div className="flex w-full flex-col gap-2">
            {SCORE_CARDS.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-2 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]"
              >
                <span className="font-inter text-sm font-medium leading-[1] tracking-[-0.02em] text-page-text">
                  {card.title}
                </span>
                <p className="font-inter text-sm font-normal leading-[1.5] tracking-[-0.02em] text-foreground/50">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer — pinned */}
        <div className="shrink-0 border-t border-foreground/[0.06] px-5 py-4 dark:border-[rgba(224,224,224,0.03)]">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 py-2.5 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
          >
            Got it
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function SubmissionsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollVariant, setScrollVariant] = useState<ScrollVariant>("spring-pop");
  const [actions, setActions] = useState<Record<string, "approve" | "reject">>({});
  const [scoresOpen, setScoresOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const handleAction = useCallback((id: string, action: "approve" | "reject") => {
    setActions((prev) => ({ ...prev, [id]: action }));
  }, []);

  const visibleSubmissions = SUBMISSIONS.filter((s) => !actions[s.id]);
  const pageRef = useRef<HTMLDivElement>(null);


  return (
    <div ref={pageRef}>
      {/* Top nav */}
      <div className="flex h-[55px] items-center justify-between border-b border-border px-4 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.02em] text-page-text">
            Submissions
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScoresOpen(true)}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium tracking-[-0.02em] text-foreground/50 transition-colors hover:bg-foreground/[0.04] sm:pl-3 sm:pr-4"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.5 6.5C6.5 5.67 7.17 5 8 5C8.83 5 9.5 5.67 9.5 6.5C9.5 7.17 9.01 7.73 8.37 7.93C8.16 8 8 8.17 8 8.39V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="currentColor" />
            </svg>
            <span className="hidden sm:inline">Understanding scores &amp; matches</span>
          </button>

          <button onClick={() => setRulesOpen(true)} className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-4 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none" className="shrink-0">
              <path d="M7.37884 1.00184C7.37884 0.0124272 6.09561 -0.37609 5.54679 0.447142L0.169631 8.51288C-0.273405 9.17744 0.202986 10.0676 1.00168 10.0676H4.71217V13.8C4.71217 14.7894 5.9954 15.1779 6.54423 14.3547L11.9214 6.28895C12.3644 5.6244 11.888 4.73425 11.0893 4.73425H7.37884V1.00184Z" fill="currentColor" />
            </svg>
            Rules
          </button>

          <button className="flex h-9 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-4 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d="M8 2.667V10M8 2.667L5.333 5.333M8 2.667L10.667 5.333M2.667 10.667V12C2.667 12.736 3.264 13.333 4 13.333H12C12.736 13.333 13.333 12.736 13.333 12V10.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      {/* Tabs — mobile: own row, desktop: inline with search */}
      <div className="overflow-x-auto scrollbar-hide px-4 pt-3 sm:px-6 md:hidden">
        <Tabs data-demo="submissions-filters" selectedIndex={selectedIndex} onSelect={setSelectedIndex} className="w-max">
          {TABS.map((tab, i) => (
            <TabItem key={tab.name} label={tab.name} count={tab.count} index={i} />
          ))}
        </Tabs>
      </div>
      <div className="hidden px-4 pt-[21px] sm:px-6 md:flex md:items-center md:justify-between md:gap-2">
        <Tabs data-demo="submissions-filters" selectedIndex={selectedIndex} onSelect={setSelectedIndex} className="w-fit">
          {TABS.map((tab, i) => (
            <TabItem key={tab.name} label={tab.name} count={tab.count} index={i} />
          ))}
        </Tabs>

        {/* Search + Filter */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 dark:bg-[rgba(224,224,224,0.03)] md:w-[300px] md:flex-none">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-foreground/50">
                <path d="M11.333 11.333L14 14M2 7.333A5.333 5.333 0 1012.667 7.333 5.333 5.333 0 002 7.333z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/70"
              />
            </div>

            <FilterSelect
              filters={SUBMISSION_FILTERS}
              activeFilters={[]}
              onSelect={() => {}}
              onRemove={() => {}}
              searchPlaceholder="Filter..."
            >
              <button className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">
                <FilterIcon />
              </button>
            </FilterSelect>
          </div>
      </div>

      <div className="px-4 pb-6 sm:px-6">
        {/* Submission cards — rendered per active variant */}
        {scrollVariant === "snap" && (
          <ScrollSnapList>
            {visibleSubmissions.map((sub) => (
              <ScrollSnapItem key={sub.id}>
                <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
              </ScrollSnapItem>
            ))}
          </ScrollSnapList>
        )}

        {scrollVariant === "carousel" && <CarouselList items={visibleSubmissions} />}

        {scrollVariant === "fade-in" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub) => (
                <FadeInItem key={sub.id}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </FadeInItem>
              ))}
            </AnimatePresence>
          </div>
        )}

        {scrollVariant === "blur-in" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub) => (
                <BlurInItem key={sub.id}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </BlurInItem>
              ))}
            </AnimatePresence>
          </div>
        )}

        {scrollVariant === "slide-up" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub) => (
                <SlideUpItem key={sub.id}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </SlideUpItem>
              ))}
            </AnimatePresence>
          </div>
        )}

        {scrollVariant === "stagger" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub, i) => (
                <StaggerItem key={sub.id} index={i}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </StaggerItem>
              ))}
            </AnimatePresence>
          </div>
        )}

        {scrollVariant === "spring-pop" && (
          <div className="mt-2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {visibleSubmissions.map((sub) => (
                <SpringPopItem key={sub.id}>
                  <SubmissionCard submission={sub} onAction={(a) => handleAction(sub.id, a)} />
                </SpringPopItem>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ScoresModal open={scoresOpen} onClose={() => setScoresOpen(false)} />
      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
