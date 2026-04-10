"use client";
// @ts-nocheck

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Video, TrendingUp, Instagram, BarChart3 } from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Header } from '@/components/vn/layout/header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/vn/ui/card';
import { DateRangePicker } from '@/components/vn/ui/date-range-picker';
import { StatCard } from '@/components/vn/charts/stat-card';
import { LineChart } from '@/components/vn/charts/line-chart';
import { Leaderboard } from '@/components/vn/features/leaderboard';
import { formatNumber } from '@/lib/vn-utils';

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

interface DateRange {
  start: Date;
  end: Date;
}

const dateRangeOptions = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'All time' },
];

// Mock data
const mockStats = {
  totalViews: 2450000,
  viewsChange: 12.5,
  totalVideos: 87,
  videosChange: 8.2,
  avgEngagementRate: 4.7,
  engagementChange: -1.3,
  totalCreators: 12,
  creatorsChange: 2.0,
};

const mockDailyStats = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
  views: Math.floor(Math.random() * 50000) + 30000,
  likes: Math.floor(Math.random() * 5000) + 2000,
  comments: Math.floor(Math.random() * 500) + 100,
}));

const mockLeaderboard = [
  { creator: { id: '1', name: 'Sarah Johnson', avatar_url: null, total_views: 890000, engagement_rate: 5.4 }, rank: 1, viewsThisPeriod: 890000, videosThisPeriod: 15 },
  { creator: { id: '2', name: 'Mike Chen', avatar_url: null, total_views: 720000, engagement_rate: 5.6 }, rank: 2, viewsThisPeriod: 720000, videosThisPeriod: 12 },
  { creator: { id: '3', name: 'Emma Wilson', avatar_url: null, total_views: 560000, engagement_rate: 5.5 }, rank: 3, viewsThisPeriod: 560000, videosThisPeriod: 10 },
  { creator: { id: '4', name: 'Alex Rivera', avatar_url: null, total_views: 430000, engagement_rate: 5.4 }, rank: 4, viewsThisPeriod: 430000, videosThisPeriod: 8 },
  { creator: { id: '5', name: 'Jordan Lee', avatar_url: null, total_views: 310000, engagement_rate: 5.5 }, rank: 5, viewsThisPeriod: 310000, videosThisPeriod: 7 },
];

const mockPlatformStats = [
  { platform: 'instagram', totalViews: 1400000, totalVideos: 52, avgEngagement: 4.9 },
  { platform: 'tiktok', totalViews: 1050000, totalVideos: 35, avgEngagement: 4.4 },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<number | DateRange>(30);

  // Calculate date range param for hooks
  const dateRangeForHooks = useMemo(() => {
    if (typeof dateRange === 'number') {
      return { days: dateRange };
    }
    return { customRange: dateRange };
  }, [dateRange]);

  // Get display days for chart title
  const displayDays = typeof dateRange === 'number' ? dateRange : 'Custom';

  // Key for animations when date changes
  const dateRangeKey = useMemo(() => {
    if (typeof dateRange === 'number') return `days-${dateRange}`;
    return `custom-${dateRange.start.getTime()}-${dateRange.end.getTime()}`;
  }, [dateRange]);

  const stats = mockStats;
  const dailyStats = mockDailyStats;
  const leaderboard = mockLeaderboard;
  const leaderboardLoading = false;
  const platformStats = mockPlatformStats;

  const instagramStats = platformStats.find(p => p.platform === 'instagram');
  const tiktokStats = platformStats.find(p => p.platform === 'tiktok');

  return (
    <PageContainer>
      <Header
        title="Analytics"
        description="Deep dive into your performance metrics"
        action={
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            options={dateRangeOptions}
          />
        }
      />

      {/* Overview Stats */}
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
            title="Avg. Engagement"
            value={stats?.avgEngagementRate || 0}
            change={stats?.engagementChange}
            icon={<TrendingUp className="w-5 h-5" />}
            format="percent"
          />
          <StatCard
            title="Active Creators"
            value={stats?.totalCreators || 0}
            change={stats?.creatorsChange}
            icon={<BarChart3 className="w-5 h-5" />}
          />
        </motion.div>
      </AnimatePresence>

      {/* Performance Chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`chart-${dateRangeKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          className="mb-8"
        >
          <LineChart
            title={typeof dateRange === 'number' ? `Performance (Last ${dateRange} Days)` : 'Performance (Custom Range)'}
            data={dailyStats}
            height={400}
            showLegend
            lines={[
              { dataKey: 'views', color: '#F78711', name: 'Views' },
              { dataKey: 'likes', color: '#ec4899', name: 'Likes' },
              { dataKey: 'comments', color: '#06b6d4', name: 'Comments' },
            ]}
          />
        </motion.div>
      </AnimatePresence>

      {/* Platform Comparison */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`platforms-${dateRangeKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.15 }}
        >
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">Platform Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                    <Instagram className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Instagram</h3>
                    <p className="text-sm text-zinc-400">Reels Performance</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Views</p>
                    <p className="text-2xl font-bold text-zinc-100">
                      {formatNumber(instagramStats?.totalViews || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Videos</p>
                    <p className="text-2xl font-bold text-zinc-100">
                      {instagramStats?.totalVideos || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Engagement</p>
                    <p className="text-2xl font-bold text-pink-400">
                      {instagramStats?.avgEngagement || 0}%
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20">
                    <TikTokIcon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">TikTok</h3>
                    <p className="text-sm text-zinc-400">Video Performance</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Views</p>
                    <p className="text-2xl font-bold text-zinc-100">
                      {formatNumber(tiktokStats?.totalViews || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Videos</p>
                    <p className="text-2xl font-bold text-zinc-100">
                      {tiktokStats?.totalVideos || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Engagement</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {tiktokStats?.avgEngagement || 0}%
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Full Leaderboard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`leaderboard-${dateRangeKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.2 }}
        >
          <Leaderboard
            entries={leaderboard as any}
            loading={leaderboardLoading}
            title="Creator Leaderboard"
            showPeriodStats
          />
        </motion.div>
      </AnimatePresence>
    </PageContainer>
  );
}
