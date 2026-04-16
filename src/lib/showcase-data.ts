/**
 * Generates realistic analytics mock data from simple config inputs.
 * Used by /showcase to create fake but convincing creator earnings dashboards.
 */

import type {
  AnalyticsPocChartTick,
  AnalyticsPocPageData,
  AnalyticsPocPerformanceLineChartData,
  AnalyticsPocPerformanceLineDataPoint,
  AnalyticsPocStackedBarChartData,
  AnalyticsPocStackedBarDataPoint,
} from "@/components/analytics-poc/types";

/* ------------------------------------------------------------------ */
/*  Config shape (what the /configure form produces)                   */
/* ------------------------------------------------------------------ */

export interface ShowcaseConfig {
  // Hero numbers
  totalViews: number; // e.g. 5_140_000
  totalEarnings: number; // e.g. 4218.50
  effectiveCpm: number; // e.g. 0.84
  totalSubmissions: number; // e.g. 847
  approvalRate: number; // e.g. 80.3  (percent)
  pendingPayout: number; // e.g. 832

  // Growth
  growthPercent: number; // e.g. 18.3

  // Engagement
  engagementRate: number; // e.g. 4.2  (percent)

  // Platform split (should sum to ~100)
  tiktokPct: number;
  instagramPct: number;
  youtubePct: number;
  xPct: number;

  // Date range label
  dateRange: string; // e.g. "Last 30 days"
  campaignName: string; // e.g. "Fall Off Campaign"

  // Optional
  totalPosts?: number;
  creatorName?: string;

  // Creator dashboard specific
  balance: number; // e.g. 2862.15
  earnedThisWeek: number; // e.g. 148.50
  streak: number; // e.g. 4
  trustScore: number; // e.g. 92
  activeCampaigns: number; // e.g. 4
}

export const DEFAULT_CONFIG: ShowcaseConfig = {
  totalViews: 5_140_000,
  totalEarnings: 4218.5,
  effectiveCpm: 0.84,
  totalSubmissions: 847,
  approvalRate: 80.3,
  pendingPayout: 832,
  growthPercent: 18.3,
  engagementRate: 4.2,
  tiktokPct: 45,
  instagramPct: 30,
  youtubePct: 18,
  xPct: 7,
  dateRange: "Last 30 days",
  campaignName: "Fall Off Campaign",
  totalPosts: 240,
  creatorName: "",
  balance: 2862.15,
  earnedThisWeek: 148.50,
  streak: 4,
  trustScore: 92,
  activeCampaigns: 4,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function toFixed(v: number, d = 2) {
  return Number(v.toFixed(d));
}

function fmtCompact(v: number) {
  if (v >= 1_000_000) {
    const s = (v / 1_000_000).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
    return `${s}M`;
  }
  if (v >= 1_000) {
    const s = (v / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${s}K`;
  }
  return String(Math.round(v));
}

function fmtCurrency(v: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(v);
}

function fmtPercent(v: number) {
  return `${v.toFixed(1)}%`;
}

function dateLabels(startIso: string, total: number) {
  const start = new Date(`${startIso}T00:00:00Z`);
  const fmt = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", timeZone: "UTC" });
  return Array.from({ length: total }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    return fmt.format(d);
  });
}

/* ------------------------------------------------------------------ */
/*  Chart data generators                                             */
/* ------------------------------------------------------------------ */

const TOTAL_POINTS = 30;

function buildTicks(): AnalyticsPocChartTick[] {
  return [
    { index: 0, label: "Jan 5" },
    { index: 3, label: "Jan 8" },
    { index: 6, label: "Jan 11" },
    { index: 9, label: "Jan 14" },
    { index: 12, label: "Jan 17" },
    { index: 15, label: "Jan 20" },
    { index: 18, label: "Jan 23" },
    { index: 21, label: "Jan 27" },
    { index: 24, label: "Jan 30" },
    { index: 27, label: "Feb 2" },
    { index: 29, label: "Feb 5" },
  ];
}

function buildDailyPerf(cfg: ShowcaseConfig): AnalyticsPocPerformanceLineDataPoint[] {
  const labels = dateLabels("2026-01-07", TOTAL_POINTS);
  const avgDailyViews = cfg.totalViews / TOTAL_POINTS;

  return labels.map((label, i) => {
    // Organic-looking wave pattern seeded from the config
    const wave = Math.sin((i - 2) / 1.9) * 0.6 + Math.cos(i / 4.2) * 0.4 + (i % 9 === 4 ? 0.5 : 0);
    const views = clamp(Math.round(avgDailyViews * (1 + wave * 0.5)), Math.round(avgDailyViews * 0.3), Math.round(avgDailyViews * 2.2));

    const engagement = toFixed(clamp(
      cfg.engagementRate + Math.sin(i / 2.2) * 1.8 + Math.cos((i + 3) / 5.1) * 0.9,
      0.4, cfg.engagementRate * 2.5,
    ), 2);

    const likes = clamp(Math.round(views * 0.04 * (cfg.engagementRate / 4)), Math.round(views * 0.01), Math.round(views * 0.12));
    const comments = clamp(Math.round(likes * 0.15 + Math.cos((i + 2) / 3.2) * likes * 0.05), Math.round(likes * 0.05), Math.round(likes * 0.4));
    const shares = clamp(Math.round(likes * 0.08 + Math.sin(i / 1.6) * likes * 0.03), Math.round(likes * 0.02), Math.round(likes * 0.2));

    return { index: i, label, views, engagement, likes, comments, shares };
  });
}

function buildCumulativePerf(daily: AnalyticsPocPerformanceLineDataPoint[]): AnalyticsPocPerformanceLineDataPoint[] {
  const running = { views: 0, engagement: 0, likes: 0, comments: 0, shares: 0 };
  const cum = daily.map((p) => {
    running.views += p.views;
    running.engagement += p.engagement;
    running.likes += p.likes;
    running.comments += p.comments;
    running.shares += p.shares;
    return { ...p, ...running };
  });

  // Normalize to nice target values
  const maxes = cum.reduce((a, p) => ({
    views: Math.max(a.views, p.views),
    engagement: Math.max(a.engagement, p.engagement),
    likes: Math.max(a.likes, p.likes),
    comments: Math.max(a.comments, p.comments),
    shares: Math.max(a.shares, p.shares),
  }), { views: 1, engagement: 1, likes: 1, comments: 1, shares: 1 });

  const last = cum[cum.length - 1];
  return cum.map((p) => ({
    ...p,
    views: Math.round((p.views / maxes.views) * (last.views * 0.95 / maxes.views) * maxes.views),
    engagement: toFixed((p.engagement / maxes.engagement) * 7.2, 2),
    likes: Math.round((p.likes / maxes.likes) * maxes.likes * 0.9),
    comments: Math.round((p.comments / maxes.comments) * maxes.comments * 0.9),
    shares: Math.round((p.shares / maxes.shares) * maxes.shares * 0.9),
  }));
}

function buildPerfLineChart(cfg: ShowcaseConfig): AnalyticsPocPerformanceLineChartData {
  const daily = buildDailyPerf(cfg);
  const cumulative = buildCumulativePerf(daily);
  const maxViews = Math.max(...daily.map((p) => p.views));
  const viewsDomain = Math.ceil(maxViews / 10000) * 10000;

  return {
    datasets: { daily, cumulative },
    leftDomain: [0, viewsDomain],
    rightDomain: [0, 8],
    rightYLabels: ["8.0%", "6.0%", "4.0%", "2.0%", "1.0%", "0.0%"],
    series: [
      { axis: "left", color: "#60A5FA", domain: [0, viewsDomain], key: "views", label: "Views", tooltipValueType: "number", yLabels: [fmtCompact(viewsDomain), fmtCompact(viewsDomain * 0.75), fmtCompact(viewsDomain * 0.5), fmtCompact(viewsDomain * 0.25), "0"] },
      { axis: "right", color: "#C084FC", domain: [0, 8], key: "engagement", label: "Engagement", tooltipValueType: "percent", yLabels: ["8%", "6%", "4%", "2%", "0%"] },
      { axis: "left", color: "#F9A8D4", domain: [0, 5000], key: "likes", label: "Likes", tooltipValueType: "number", yLabels: ["5k", "3.75k", "2.5k", "1.25k", "0"] },
      { axis: "left", color: "#FB923C", domain: [0, 1500], key: "comments", label: "Comments", tooltipValueType: "number", yLabels: ["1.5k", "1.1k", "750", "375", "0"] },
      { axis: "left", color: "#34D399", domain: [0, 800], key: "shares", label: "Shares", tooltipValueType: "number", yLabels: ["800", "600", "400", "200", "0"] },
    ],
    xTicks: buildTicks(),
    yLabels: [fmtCompact(viewsDomain), fmtCompact(viewsDomain * 0.75), fmtCompact(viewsDomain * 0.5), fmtCompact(viewsDomain * 0.25), fmtCompact(viewsDomain * 0.1), "0"],
  };
}

function buildStackedChart(cfg: ShowcaseConfig): AnalyticsPocStackedBarChartData {
  const labels = dateLabels("2026-01-07", TOTAL_POINTS);
  const totalPosts = cfg.totalPosts ?? 240;
  const avgDaily = totalPosts / TOTAL_POINTS;

  const points: AnalyticsPocStackedBarDataPoint[] = labels.map((label, i) => {
    const wave = 1 + Math.sin((i - 4) / 2.1) * 0.35 + Math.cos(i / 5.3) * 0.25;
    const dayTotal = Math.round(avgDaily * wave);
    return {
      index: i,
      label,
      tiktok: Math.round(dayTotal * cfg.tiktokPct / 100),
      instagram: Math.round(dayTotal * cfg.instagramPct / 100),
      youtube: Math.round(dayTotal * cfg.youtubePct / 100),
      x: Math.round(dayTotal * cfg.xPct / 100),
    };
  });

  const maxValue = Math.max(...points.map((p) => p.tiktok + p.instagram + p.youtube + p.x));

  return {
    maxValue: Math.ceil(maxValue / 5) * 5,
    points,
    series: [
      { color: "#00994D", key: "tiktok", label: "TikTok" },
      { color: "#AE4EEE", key: "instagram", label: "Instagram" },
      { color: "#FF3355", key: "youtube", label: "YouTube" },
      { color: "#8B8D98", key: "x", label: "X" },
    ],
    xTicks: buildTicks(),
    yLabels: [fmtCompact(maxValue), fmtCompact(maxValue * 0.75), fmtCompact(maxValue * 0.5), fmtCompact(maxValue * 0.25), fmtCompact(maxValue * 0.1), "0"],
  };
}

function buildHeatmapData(seed: number): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  const start = new Date("2025-09-07");
  const end = new Date("2026-03-07").getTime();
  const current = new Date(start);
  while (current.getTime() <= end) {
    const dow = current.getUTCDay();
    const dom = current.getUTCDate();
    const base = Math.sin((dom + seed) * 0.47) * 0.5 + 0.5;
    const weekday = dow >= 1 && dow <= 5 ? 0.3 : 0;
    const value = clamp(Math.round((base * 0.6 + weekday + Math.cos((dom * seed) / 3) * 0.2) * 30), 0, 30);
    data.push({ date: current.toISOString().slice(0, 10), value });
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return data;
}

/* ------------------------------------------------------------------ */
/*  Top posts generator                                               */
/* ------------------------------------------------------------------ */

const POST_TITLES = [
  "This fitness hack changed my life",
  "5 ways to stay focused all day",
  "The easiest meal prep routine",
  "How I doubled my output in 7 days",
  "Tiny habit, massive results",
];
const POST_AUTHORS = ["NeonEdits", "GrowthLab", "ClipFarm", "MetricMinds", "DailyBoost"];
const PLATFORMS = ["tiktok", "instagram", "youtube", "x"] as const;

function buildTopPosts(cfg: ShowcaseConfig, count = 50) {
  return Array.from({ length: count }, (_, i) => {
    const position = i + 1;
    const platform = PLATFORMS[i % PLATFORMS.length];
    const baseViews = cfg.totalViews / 3;
    const views = Math.max(Math.round(cfg.totalViews * 0.02), Math.round(baseViews - i * (baseViews / count)));
    const engRate = clamp(cfg.engagementRate + ((count - i) % 9) * 0.31, 1.2, 8.6);
    const cpm = toFixed(cfg.effectiveCpm + (i % 7) * 0.11, 2);
    const payout = (views / 1000) * cpm;

    return {
      id: `post-${position}`,
      position,
      post: POST_TITLES[i % POST_TITLES.length],
      author: POST_AUTHORS[i % POST_AUTHORS.length],
      postedDaysAgo: 1 + ((i * 3 + 2) % 30),
      platform,
      views: fmtCompact(views),
      engagement: fmtPercent(engRate),
      payout: fmtCurrency(payout),
      cpm: fmtCurrency(cpm),
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Rank list items                                                   */
/* ------------------------------------------------------------------ */

function buildViewsRankItems(cfg: ShowcaseConfig) {
  const platforms = [
    { id: "tiktok", label: "TikTok", pct: cfg.tiktokPct, color: "#00994D", dot: "bg-[#00994D]" },
    { id: "instagram", label: "Instagram", pct: cfg.instagramPct, color: "#AE4EEE", dot: "bg-[#AE4EEE]" },
    { id: "youtube", label: "YouTube", pct: cfg.youtubePct, color: "#FF3355", dot: "bg-[#FF3355]" },
    { id: "x", label: "X", pct: cfg.xPct, color: "#8B8D98", dot: "bg-[#8B8D98]" },
  ].sort((a, b) => b.pct - a.pct);

  return platforms.map((p) => ({
    id: `views-${p.id}`,
    label: p.label,
    platform: p.id as "tiktok" | "instagram" | "youtube" | "x",
    accentColor: p.color,
    dotColorClass: p.dot,
    percentLabel: `${p.pct}%`,
    progress: p.pct,
    valueLabel: fmtCompact(Math.round(cfg.totalViews * p.pct / 100)),
    rightMetrics: [{ text: `${p.pct}%`, tone: "muted" as const }, { text: fmtCompact(Math.round(cfg.totalViews * p.pct / 100)) }],
  }));
}

/* ------------------------------------------------------------------ */
/*  Main builder                                                       */
/* ------------------------------------------------------------------ */

export function buildShowcaseData(cfg: ShowcaseConfig): AnalyticsPocPageData {
  const perfLineChart = buildPerfLineChart(cfg);
  const stackedChart = buildStackedChart(cfg);
  const ticks = buildTicks();
  const totalPosts = cfg.totalPosts ?? 240;
  const approved = Math.round(cfg.totalSubmissions * cfg.approvalRate / 100);

  const avgDailyViews = cfg.totalViews / TOTAL_POINTS;

  return {
    header: {
      title: cfg.campaignName,
      subtitle: cfg.dateRange,
    },
    filters: {
      platforms: [
        { id: "tiktok", label: "TikTok", active: true },
        { id: "instagram", label: "Instagram", active: true },
        { id: "youtube", label: "YouTube", active: true },
        { id: "x", label: "X", active: true },
      ],
      dateLabel: cfg.dateRange,
      campaignLabel: cfg.campaignName,
    },
    kpis: [
      {
        label: "Total Views",
        value: fmtCompact(cfg.totalViews),
        iconName: "views",
        variant: "views",
        tone: "success",
        deltaBadge: { label: `+${cfg.growthPercent}%`, tone: "success" },
      },
      {
        label: "Total Payouts",
        value: fmtCurrency(cfg.totalEarnings),
        iconName: "payouts",
        variant: "payouts",
        meta: `${fmtCurrency(cfg.pendingPayout)} pending`,
        deltaBadge: { label: `+${cfg.growthPercent}%`, tone: "success" },
      },
      {
        label: "Effective CPM",
        value: fmtCurrency(cfg.effectiveCpm),
        iconName: "cpm",
        variant: "cpm-efficient",
        meta: "Efficient",
        metaTone: "success",
        deltaBadge: { label: `+${cfg.growthPercent}%`, tone: "success" },
      },
      {
        label: "Submissions",
        value: String(cfg.totalSubmissions),
        iconName: "submissions",
        variant: "submissions",
        meta: `${approved} approved · ${cfg.approvalRate}%`,
      },
    ],
    insightsCard: {
      title: "AI Insights",
      description: "Smart recommendations based on your analytics",
      contentTitle: "Top Performing Content",
      contentSubtitle: "Your reaction videos are driving 3x more engagement than other formats. Consider creating more reaction-style content.",
      ctaLabel: "View all insights",
      slides: [
        { contentTitle: "Top Performing Content", contentSubtitle: "Your reaction videos are driving 3x more engagement than other formats." },
        { contentTitle: "Best Posting Time", contentSubtitle: "Posts published between 6-8 PM EST get 42% more views on average." },
        { contentTitle: "Platform Growth", contentSubtitle: "TikTok is your fastest growing platform with +24% views this month." },
      ],
    },
    healthCard: {
      title: "Campaign Health",
      score: "87",
      statusText: "Healthy",
      trendLabel: "+5 pts this week",
      ctaLabel: "View details",
      progressPercent: 87,
    },
    performance: {
      tabs: ["Daily Performance", "Cumulative"],
      activeTab: "Daily Performance",
      rangeLabel: cfg.dateRange,
      metrics: [
        { label: "Views", value: fmtCompact(cfg.totalViews), metricKey: "views", enabled: true, accentColor: "#60A5FA" },
        { label: "Engagement", value: fmtPercent(cfg.engagementRate), metricKey: "engagement", enabled: true, accentColor: "#C084FC" },
        { label: "Likes", value: fmtCompact(Math.round(cfg.totalViews * cfg.engagementRate / 100 * 0.6)), metricKey: "likes", enabled: false, accentColor: "#F9A8D4" },
        { label: "Comments", value: fmtCompact(Math.round(cfg.totalViews * cfg.engagementRate / 100 * 0.1)), metricKey: "comments", enabled: false, accentColor: "#FB923C" },
        { label: "Shares", value: fmtCompact(Math.round(cfg.totalViews * cfg.engagementRate / 100 * 0.05)), metricKey: "shares", enabled: false, accentColor: "#34D399" },
      ],
      chart: {
        variant: "line",
        chartStylePreset: "performance-main",
        heightClassName: "h-[300px]",
        lineChart: perfLineChart,
        activeLineDataset: "daily",
      },
    },
    viewsCard: {
      title: "Views by Platform",
      headerIcon: "views",
      infoTooltipText: "Breakdown of views across platforms.",
      items: buildViewsRankItems(cfg),
    },
    postsCard: {
      title: "Posts by Platform",
      headerIcon: "posts",
      infoTooltipText: "Total posts per platform.",
      items: [
        { id: "posts-tiktok", label: "TikTok", platform: "tiktok", accentColor: "#00994D", dotColorClass: "bg-[#00994D]", percentLabel: `${cfg.tiktokPct}%`, progress: cfg.tiktokPct, valueLabel: String(Math.round(totalPosts * cfg.tiktokPct / 100)), rightMetrics: [{ text: `${cfg.tiktokPct}%`, tone: "muted" }, { text: String(Math.round(totalPosts * cfg.tiktokPct / 100)) }] },
        { id: "posts-ig", label: "Instagram", platform: "instagram", accentColor: "#AE4EEE", dotColorClass: "bg-[#AE4EEE]", percentLabel: `${cfg.instagramPct}%`, progress: cfg.instagramPct, valueLabel: String(Math.round(totalPosts * cfg.instagramPct / 100)), rightMetrics: [{ text: `${cfg.instagramPct}%`, tone: "muted" }, { text: String(Math.round(totalPosts * cfg.instagramPct / 100)) }] },
        { id: "posts-yt", label: "YouTube", platform: "youtube", accentColor: "#FF3355", dotColorClass: "bg-[#FF3355]", percentLabel: `${cfg.youtubePct}%`, progress: cfg.youtubePct, valueLabel: String(Math.round(totalPosts * cfg.youtubePct / 100)), rightMetrics: [{ text: `${cfg.youtubePct}%`, tone: "muted" }, { text: String(Math.round(totalPosts * cfg.youtubePct / 100)) }] },
        { id: "posts-x", label: "X", platform: "x", accentColor: "#8B8D98", dotColorClass: "bg-[#8B8D98]", percentLabel: `${cfg.xPct}%`, progress: cfg.xPct, valueLabel: String(Math.round(totalPosts * cfg.xPct / 100)), rightMetrics: [{ text: `${cfg.xPct}%`, tone: "muted" }, { text: String(Math.round(totalPosts * cfg.xPct / 100)) }] },
      ],
    },
    engagementRateCard: {
      title: "Engagement Rate",
      headerIcon: "engagement-rate",
      infoTooltipText: "Average engagement rate per platform.",
      items: [
        { id: "eng-tiktok", label: "TikTok", platform: "tiktok", accentColor: "#00994D", dotColorClass: "bg-[#00994D]", percentLabel: fmtPercent(cfg.engagementRate * 1.2), progress: Math.round(cfg.engagementRate * 1.2 * 10), valueLabel: fmtPercent(cfg.engagementRate * 1.2), rightMetrics: [{ text: fmtPercent(cfg.engagementRate * 1.2) }] },
        { id: "eng-ig", label: "Instagram", platform: "instagram", accentColor: "#AE4EEE", dotColorClass: "bg-[#AE4EEE]", percentLabel: fmtPercent(cfg.engagementRate * 0.9), progress: Math.round(cfg.engagementRate * 0.9 * 10), valueLabel: fmtPercent(cfg.engagementRate * 0.9), rightMetrics: [{ text: fmtPercent(cfg.engagementRate * 0.9) }] },
        { id: "eng-yt", label: "YouTube", platform: "youtube", accentColor: "#FF3355", dotColorClass: "bg-[#FF3355]", percentLabel: fmtPercent(cfg.engagementRate * 0.7), progress: Math.round(cfg.engagementRate * 0.7 * 10), valueLabel: fmtPercent(cfg.engagementRate * 0.7), rightMetrics: [{ text: fmtPercent(cfg.engagementRate * 0.7) }] },
        { id: "eng-x", label: "X", platform: "x", accentColor: "#8B8D98", dotColorClass: "bg-[#8B8D98]", percentLabel: fmtPercent(cfg.engagementRate * 0.5), progress: Math.round(cfg.engagementRate * 0.5 * 10), valueLabel: fmtPercent(cfg.engagementRate * 0.5), rightMetrics: [{ text: fmtPercent(cfg.engagementRate * 0.5) }] },
      ],
    },
    effectiveCpmCard: {
      title: "Effective CPM",
      headerIcon: "effective-cpm",
      infoTooltipText: "Cost per thousand views by platform.",
      items: [
        { id: "cpm-tiktok", label: "TikTok", platform: "tiktok", accentColor: "#00994D", dotColorClass: "bg-[#00994D]", percentLabel: "", progress: 80, valueLabel: fmtCurrency(cfg.effectiveCpm * 0.9), rightMetrics: [{ text: fmtCurrency(cfg.effectiveCpm * 0.9) }] },
        { id: "cpm-ig", label: "Instagram", platform: "instagram", accentColor: "#AE4EEE", dotColorClass: "bg-[#AE4EEE]", percentLabel: "", progress: 65, valueLabel: fmtCurrency(cfg.effectiveCpm * 1.1), rightMetrics: [{ text: fmtCurrency(cfg.effectiveCpm * 1.1) }] },
        { id: "cpm-yt", label: "YouTube", platform: "youtube", accentColor: "#FF3355", dotColorClass: "bg-[#FF3355]", percentLabel: "", progress: 90, valueLabel: fmtCurrency(cfg.effectiveCpm * 1.3), rightMetrics: [{ text: fmtCurrency(cfg.effectiveCpm * 1.3) }] },
        { id: "cpm-x", label: "X", platform: "x", accentColor: "#8B8D98", dotColorClass: "bg-[#8B8D98]", percentLabel: "", progress: 40, valueLabel: fmtCurrency(cfg.effectiveCpm * 0.6), rightMetrics: [{ text: fmtCurrency(cfg.effectiveCpm * 0.6) }] },
      ],
    },
    contentClustersCard: {
      title: "Content Clusters",
      headerIcon: "content-clusters",
      infoTooltipText: "Breakdown of dominant content themes.",
      items: [
        { id: "c-reaction", label: "Reaction Videos", secondaryLabel: "85 videos", accentColor: "#FB923C", dotColorClass: "bg-[#E9A23B]", percentLabel: "84%", progress: 84, valueLabel: "500K", rightMetrics: [{ text: "84%", tone: "muted" }, { text: "500K" }] },
        { id: "c-meme", label: "Meme Edits", secondaryLabel: "45 videos", accentColor: "#60A5FA", dotColorClass: "bg-[#4D81EE]", percentLabel: "56%", progress: 56, valueLabel: "200K", rightMetrics: [{ text: "56%", tone: "muted" }, { text: "200K" }] },
        { id: "c-pov", label: "POV / Skit", secondaryLabel: "38 videos", accentColor: "#22C55E", dotColorClass: "bg-[#22C55E]", percentLabel: "49%", progress: 49, valueLabel: "180K", rightMetrics: [{ text: "49%", tone: "muted" }, { text: "180K" }] },
        { id: "c-transform", label: "Transformation", secondaryLabel: "20 videos", accentColor: "#EAB308", dotColorClass: "bg-[#EAB308]", percentLabel: "41%", progress: 41, valueLabel: "150K", rightMetrics: [{ text: "41%", tone: "muted" }, { text: "150K" }] },
        { id: "c-tutorial", label: "Tutorial Format", secondaryLabel: "30 videos", accentColor: "#A855F7", dotColorClass: "bg-[#A855F7]", percentLabel: "23%", progress: 23, valueLabel: "92K", rightMetrics: [{ text: "23%", tone: "muted" }, { text: "92K" }] },
      ],
    },
    totalPosts: {
      title: "Total Posts",
      trend: `+${Math.round(cfg.growthPercent * 0.6)}%`,
      total: String(totalPosts),
      delta: `+${Math.round(totalPosts * cfg.growthPercent / 100)} from last period`,
      metrics: [
        { label: "TikTok", value: String(Math.round(totalPosts * cfg.tiktokPct / 100)), metricKey: "tiktok", enabled: true, selected: true, accentColor: "#00994D" },
        { label: "Instagram", value: String(Math.round(totalPosts * cfg.instagramPct / 100)), metricKey: "instagram", enabled: true, selected: true, accentColor: "#AE4EEE" },
        { label: "YouTube", value: String(Math.round(totalPosts * cfg.youtubePct / 100)), metricKey: "youtube", enabled: true, selected: true, accentColor: "#FF3355" },
        { label: "X", value: String(Math.round(totalPosts * cfg.xPct / 100)), metricKey: "x", enabled: true, selected: true, accentColor: "#8B8D98" },
      ],
      chart: {
        variant: "stacked",
        heightClassName: "h-[300px]",
        stackedBarChart: stackedChart,
      },
    },
    heatmaps: [
      {
        title: "TikTok",
        subtitle: "Best time to post",
        badge: "Tue 6-8 PM",
        platform: "tiktok",
        tone: "green",
        footerLeft: "Most active: Weekdays 6-8 PM",
        footerRight: "Based on last 90 days",
        heatmapData: buildHeatmapData(1),
        startDate: new Date("2025-09-07"),
        endDate: new Date("2026-03-07"),
      },
      {
        title: "Instagram",
        subtitle: "Best time to post",
        badge: "Wed 12-2 PM",
        platform: "instagram",
        tone: "purple",
        footerLeft: "Most active: Weekdays 12-2 PM",
        footerRight: "Based on last 90 days",
        heatmapData: buildHeatmapData(2),
        startDate: new Date("2025-09-07"),
        endDate: new Date("2026-03-07"),
      },
      {
        title: "YouTube",
        subtitle: "Best time to post",
        badge: "Sat 10 AM-12 PM",
        tone: "red",
        footerLeft: "Most active: Weekends 10 AM-12 PM",
        footerRight: "Based on last 90 days",
        heatmapData: buildHeatmapData(3),
        startDate: new Date("2025-09-07"),
        endDate: new Date("2026-03-07"),
      },
      {
        title: "X",
        subtitle: "Best time to post",
        badge: "Mon 8-10 AM",
        tone: "blue",
        footerLeft: "Most active: Weekdays 8-10 AM",
        footerRight: "Based on last 90 days",
        heatmapData: buildHeatmapData(4),
        startDate: new Date("2025-09-07"),
        endDate: new Date("2026-03-07"),
      },
    ],
    topPosts: {
      title: "Top Posts",
      mode: "top",
      rows: buildTopPosts(cfg),
      pageSize: 10,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  LocalStorage persistence                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "showcase-config";

export function loadShowcaseConfig(): ShowcaseConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveShowcaseConfig(cfg: ShowcaseConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}
