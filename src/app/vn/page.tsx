"use client";
// @ts-nocheck

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Video, Users, TrendingUp, RefreshCw, ChevronDown, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { StatCard } from '@/components/vn/charts/stat-card';
import { LineChart } from '@/components/vn/charts/line-chart';
import { Leaderboard } from '@/components/vn/features/leaderboard';
import { VideoGrid } from '@/components/vn/features/video-grid';
import { DateRangePicker } from '@/components/vn/ui/date-range-picker';

interface DateRange {
  start: Date;
  end: Date;
}

// For dropdown mode (single metric)
const chartMetricOptions = [
  { key: 'views', label: 'Views', color: '#F78711' },
  { key: 'videosPosted', label: 'Videos Posted', color: '#22c55e' },
  { key: 'avgEngagement', label: 'Avg Engagement %', color: '#8b5cf6', format: 'percent' as const },
];

// For multi-line mode (all metrics overlapping) - default view
const chartLines = [
  { dataKey: 'views', name: 'Views', color: '#F78711' },
  { dataKey: 'likes', name: 'Likes', color: '#ec4899' },
  { dataKey: 'comments', name: 'Comments', color: '#22d3ee' },
];

const dateRangeOptions = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'All time' },
];

type VideoViewMode = 'recent' | 'top';

// ── Mock Data ──────────────────────────────────────────────────────────
const mockStats = {
  totalViews: 12_450_000,
  totalVideos: 342,
  totalCreators: 18,
  avgEngagementRate: 4.7,
  viewsChange: 12.3,
  videosChange: 8.1,
  creatorsChange: 2,
  engagementChange: -0.4,
};

const mockDailyStats = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    views: Math.floor(Math.random() * 80000) + 20000,
    likes: Math.floor(Math.random() * 4000) + 1000,
    comments: Math.floor(Math.random() * 500) + 50,
  };
});

const mockLeaderboard = [
  { creator: { id: '1', name: 'Emma Johnson', avatar_url: null, total_views: 3_200_000, engagement_rate: 5.4 }, rank: 1, viewsThisPeriod: 3_200_000, videosThisPeriod: 89 },
  { creator: { id: '2', name: 'Liam Chen', avatar_url: null, total_views: 2_800_000, engagement_rate: 5.1 }, rank: 2, viewsThisPeriod: 2_800_000, videosThisPeriod: 72 },
  { creator: { id: '3', name: 'Sophia Martinez', avatar_url: null, total_views: 2_100_000, engagement_rate: 4.8 }, rank: 3, viewsThisPeriod: 2_100_000, videosThisPeriod: 54 },
  { creator: { id: '4', name: 'Noah Kim', avatar_url: null, total_views: 1_900_000, engagement_rate: 5.2 }, rank: 4, viewsThisPeriod: 1_900_000, videosThisPeriod: 48 },
  { creator: { id: '5', name: 'Ava Patel', avatar_url: null, total_views: 1_600_000, engagement_rate: 4.6 }, rank: 5, viewsThisPeriod: 1_600_000, videosThisPeriod: 41 },
];

const mockRecentVideos = [
  { id: 'v1', title: 'Morning Skincare Routine 🌸', platform: 'tiktok', views: 245_000, likes: 12400, comments: 890, thumbnail_url: null, published_at: '2026-04-08', creator_name: 'Emma Johnson' },
  { id: 'v2', title: 'Best Coffee Shops in LA', platform: 'instagram', views: 182_000, likes: 9200, comments: 430, thumbnail_url: null, published_at: '2026-04-07', creator_name: 'Liam Chen' },
  { id: 'v3', title: 'Gym Transformation Week 12', platform: 'tiktok', views: 320_000, likes: 18900, comments: 1200, thumbnail_url: null, published_at: '2026-04-06', creator_name: 'Sophia Martinez' },
  { id: 'v4', title: 'What I Eat in a Day', platform: 'tiktok', views: 156_000, likes: 7800, comments: 560, thumbnail_url: null, published_at: '2026-04-05', creator_name: 'Noah Kim' },
  { id: 'v5', title: 'Apartment Tour 2026', platform: 'instagram', views: 98_000, likes: 5400, comments: 340, thumbnail_url: null, published_at: '2026-04-04', creator_name: 'Ava Patel' },
  { id: 'v6', title: 'Viral Dance Challenge', platform: 'tiktok', views: 520_000, likes: 34000, comments: 2100, thumbnail_url: null, published_at: '2026-04-03', creator_name: 'Emma Johnson' },
  { id: 'v7', title: 'Healthy Meal Prep Ideas', platform: 'tiktok', views: 134_000, likes: 6700, comments: 410, thumbnail_url: null, published_at: '2026-04-02', creator_name: 'Liam Chen' },
  { id: 'v8', title: 'Summer Fashion Haul', platform: 'instagram', views: 76_000, likes: 4200, comments: 280, thumbnail_url: null, published_at: '2026-04-01', creator_name: 'Sophia Martinez' },
];

const mockTopVideos = [
  { id: 'v6', title: 'Viral Dance Challenge', platform: 'tiktok', views: 520_000, likes: 34000, comments: 2100, thumbnail_url: null, published_at: '2026-04-03', creator_name: 'Emma Johnson' },
  { id: 'v3', title: 'Gym Transformation Week 12', platform: 'tiktok', views: 320_000, likes: 18900, comments: 1200, thumbnail_url: null, published_at: '2026-04-06', creator_name: 'Sophia Martinez' },
  { id: 'v1', title: 'Morning Skincare Routine 🌸', platform: 'tiktok', views: 245_000, likes: 12400, comments: 890, thumbnail_url: null, published_at: '2026-04-08', creator_name: 'Emma Johnson' },
  { id: 'v2', title: 'Best Coffee Shops in LA', platform: 'instagram', views: 182_000, likes: 9200, comments: 430, thumbnail_url: null, published_at: '2026-04-07', creator_name: 'Liam Chen' },
  { id: 'v4', title: 'What I Eat in a Day', platform: 'tiktok', views: 156_000, likes: 7800, comments: 560, thumbnail_url: null, published_at: '2026-04-05', creator_name: 'Noah Kim' },
  { id: 'v7', title: 'Healthy Meal Prep Ideas', platform: 'tiktok', views: 134_000, likes: 6700, comments: 410, thumbnail_url: null, published_at: '2026-04-02', creator_name: 'Liam Chen' },
  { id: 'v5', title: 'Apartment Tour 2026', platform: 'instagram', views: 98_000, likes: 5400, comments: 340, thumbnail_url: null, published_at: '2026-04-04', creator_name: 'Ava Patel' },
  { id: 'v8', title: 'Summer Fashion Haul', platform: 'instagram', views: 76_000, likes: 4200, comments: 280, thumbnail_url: null, published_at: '2026-04-01', creator_name: 'Sophia Martinez' },
];
// ── End Mock Data ──────────────────────────────────────────────────────

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<number | DateRange>(365); // Default to "All time"

  // Use mock data instead of hooks
  const stats = mockStats;
  const dailyStats = mockDailyStats;
  const leaderboard = mockLeaderboard;
  const leaderboardLoading = false;
  const recentVideos = mockRecentVideos;
  const recentLoading = false;
  const topVideos = mockTopVideos;
  const topLoading = false;

  // Key for animations when date changes
  const dateRangeKey = useMemo(() => {
    if (typeof dateRange === 'number') return `days-${dateRange}`;
    return `custom-${dateRange.start.getTime()}-${dateRange.end.getTime()}`;
  }, [dateRange]);

  const [videoViewMode, setVideoViewMode] = useState<VideoViewMode>('recent');
  const [videoDropdownOpen, setVideoDropdownOpen] = useState(false);
  const [showRescrapeTooltip, setShowRescrapeTooltip] = useState(false);
  const [rescrapeResult, setRescrapeResult] = useState<{ success: boolean; message: string } | null>(null);

  // Mock rescrape state
  const rescraping = false;
  const timeSinceLastRescrape = '2 hours ago';
  const [autoRescrapeEnabled, setAutoRescrapeEnabled] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRescrapeResult(null);
    // No-op: mock refresh
    console.log('Rescrape triggered (mock)');
    setRescrapeResult({
      success: true,
      message: 'Updated 12 videos',
    });
    setTimeout(() => setRescrapeResult(null), 3000);
  }, []);

  const currentVideos = videoViewMode === 'recent' ? recentVideos : topVideos;
  const videosLoading = videoViewMode === 'recent' ? recentLoading : topLoading;

  return (
    <PageContainer>
      {/* Header with Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-400 mt-1 hidden sm:block">Overview of your UGC creator performance</p>
        </div>
        <div className="relative z-20 flex items-center gap-3">
          {/* Date Range Selector */}
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            options={dateRangeOptions}
          />

          {/* Auto-rescrape toggle */}
          <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRescrapeEnabled}
              onChange={(e) => setAutoRescrapeEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
            />
            <span className="hidden sm:inline">Auto-refresh daily</span>
          </label>

          {/* Refresh button with tooltip */}
          <div
            className="relative"
            onMouseEnter={() => setShowRescrapeTooltip(true)}
            onMouseLeave={() => setShowRescrapeTooltip(false)}
          >
            <button
              onClick={handleRefresh}
              disabled={rescraping}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
              title="Refresh video data"
            >
              <RefreshCw className={`w-5 h-5 ${rescraping ? 'animate-spin' : ''}`} />
            </button>

            {/* Tooltip */}
            {showRescrapeTooltip && !rescraping && (
              <div className="absolute right-0 top-full mt-2 p-3 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50 min-w-[180px]">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last refresh: {timeSinceLastRescrape}</span>
                </div>
              </div>
            )}
          </div>

          {/* Result feedback */}
          {rescrapeResult && (
            <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded ${
              rescrapeResult.success
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}>
              {rescrapeResult.success ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span>{rescrapeResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid - with transition animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`stats-${dateRangeKey}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
        >
          <StatCard
            title="Total Views"
            value={stats?.totalViews || 0}
            change={stats?.viewsChange}
            icon={<Eye className="w-5 h-5" />}
          />
          <StatCard
            title="Total Videos"
            value={stats?.totalVideos || 0}
            change={stats?.videosChange}
            icon={<Video className="w-5 h-5" />}
          />
          <StatCard
            title="Active Creators"
            value={stats?.totalCreators || 0}
            change={stats?.creatorsChange}
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            title="Avg. Engagement"
            value={stats?.avgEngagementRate || 0}
            change={stats?.engagementChange}
            icon={<TrendingUp className="w-5 h-5" />}
            format="percent"
          />
        </motion.div>
      </AnimatePresence>

      {/* Charts and Leaderboard - with transition animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`charts-${dateRangeKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="lg:col-span-2">
            <LineChart
              title="Performance"
              data={dailyStats}
              lines={chartLines}
              height={320}
            />
          </div>
          <div>
            <Leaderboard
              entries={leaderboard}
              loading={leaderboardLoading}
              showPeriodStats={false}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Videos Section with Dropdown */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <button
              onClick={() => setVideoDropdownOpen(!videoDropdownOpen)}
              className="flex items-center gap-2 text-xl font-semibold text-zinc-100 hover:text-orange-400 transition-colors"
            >
              {videoViewMode === 'recent' ? 'Recent Videos' : 'Top Videos'}
              <ChevronDown className={`w-5 h-5 transition-transform ${videoDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {videoDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setVideoDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1">
                  <button
                    onClick={() => {
                      setVideoViewMode('recent');
                      setVideoDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-700 transition-colors ${
                      videoViewMode === 'recent'
                        ? 'text-orange-400 bg-zinc-700/50'
                        : 'text-zinc-300'
                    }`}
                  >
                    Recent Videos
                  </button>
                  <button
                    onClick={() => {
                      setVideoViewMode('top');
                      setVideoDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-700 transition-colors ${
                      videoViewMode === 'top'
                        ? 'text-orange-400 bg-zinc-700/50'
                        : 'text-zinc-300'
                    }`}
                  >
                    Top Videos
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`videos-${dateRangeKey}-${videoViewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <VideoGrid videos={currentVideos} loading={videosLoading} />
          </motion.div>
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
