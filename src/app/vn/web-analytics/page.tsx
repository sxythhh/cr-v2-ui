"use client";
// @ts-nocheck

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Eye,
  Clock,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  FileText,
  ArrowUpRight,
} from 'lucide-react';

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_TIME_SERIES = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toISOString().split('T')[0],
    visitors: Math.floor(Math.random() * 400 + 100),
    pageviews: Math.floor(Math.random() * 800 + 200),
    sessions: Math.floor(Math.random() * 500 + 150),
  };
});

const MOCK_DATA = {
  configured: true,
  days: 30,
  summary: {
    visitors: 8432,
    pageviews: 24891,
    sessions: 11205,
    avgSessionDuration: 142,
    bounceRate: 38,
    visitorsChange: 12,
    pageviewsChange: 8,
    sessionsChange: 15,
    durationChange: -3,
    bounceRateChange: -5,
  },
  timeSeries: MOCK_TIME_SERIES,
  topPages: [
    { path: '/', views: 8234, visitors: 4102 },
    { path: '/about', views: 3421, visitors: 1890 },
    { path: '/pricing', views: 2987, visitors: 1654 },
    { path: '/blog', views: 2543, visitors: 1321 },
    { path: '/contact', views: 1876, visitors: 987 },
    { path: '/docs', views: 1432, visitors: 765 },
  ],
  topSources: [
    { source: 'google', visitors: 3210, sessions: 4102 },
    { source: 'twitter.com', visitors: 1890, sessions: 2341 },
    { source: 'direct', visitors: 1654, sessions: 1987 },
    { source: 'instagram.com', visitors: 987, sessions: 1102 },
    { source: 'linkedin.com', visitors: 654, sessions: 821 },
  ],
  devices: [
    { device: 'Desktop', visitors: 5102, percentage: 61 },
    { device: 'Mobile', visitors: 2876, percentage: 34 },
    { device: 'Tablet', visitors: 454, percentage: 5 },
  ],
  countries: [
    { country: 'United States', visitors: 3890, percentage: 46 },
    { country: 'United Kingdom', visitors: 1234, percentage: 15 },
    { country: 'Germany', visitors: 876, percentage: 10 },
    { country: 'Canada', visitors: 654, percentage: 8 },
    { country: 'France', visitors: 543, percentage: 6 },
    { country: 'Australia', visitors: 432, percentage: 5 },
  ],
  browsers: [
    { device: 'Chrome', visitors: 4567, percentage: 54 },
    { device: 'Safari', visitors: 1890, percentage: 22 },
    { device: 'Firefox', visitors: 987, percentage: 12 },
    { device: 'Edge', visitors: 654, percentage: 8 },
    { device: 'Other', visitors: 334, percentage: 4 },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────
const DATE_RANGES = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function ChangeIndicator({ value }: { value: number }) {
  if (value === 0) return <span className="text-zinc-500 text-sm">-</span>;
  const isPositive = value > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  return (
    <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
      <Icon className="w-3 h-3" />
      {isPositive ? '+' : ''}{value}%
    </span>
  );
}

function getDeviceIcon(device: string) {
  const d = device?.toLowerCase() || '';
  if (d.includes('mobile') || d.includes('phone')) return Smartphone;
  if (d.includes('tablet')) return Tablet;
  return Monitor;
}

export default function WebAnalyticsPage() {
  const data = MOCK_DATA;
  const loading = false;
  const [selectedDays, setSelectedDays] = useState(7);
  const [chartMode, setChartMode] = useState<'visitors' | 'pageviews' | 'sessions'>('visitors');

  const chartData = data.timeSeries || [];
  const maxChartValue = Math.max(
    ...chartData.map(d => chartMode === 'visitors' ? d.visitors : chartMode === 'pageviews' ? d.pageviews : d.sessions),
    1
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Web Analytics</h1>
            <p className="text-zinc-400 mt-1 hidden sm:block">
              Website performance data from PostHog
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
              {DATE_RANGES.map(range => (
                <button
                  key={range.days}
                  onClick={() => setSelectedDays(range.days)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedDays === range.days
                      ? 'bg-orange-500 text-white'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <ChangeIndicator value={data.summary?.visitorsChange || 0} />
            </div>
            <p className="text-2xl font-bold text-zinc-100">
              {formatNumber(data.summary?.visitors || 0)}
            </p>
            <p className="text-sm text-zinc-500">Visitors</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <ChangeIndicator value={data.summary?.pageviewsChange || 0} />
            </div>
            <p className="text-2xl font-bold text-zinc-100">
              {formatNumber(data.summary?.pageviews || 0)}
            </p>
            <p className="text-sm text-zinc-500">Page Views</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-emerald-400" />
              </div>
              <ChangeIndicator value={data.summary?.sessionsChange || 0} />
            </div>
            <p className="text-2xl font-bold text-zinc-100">
              {formatNumber(data.summary?.sessions || 0)}
            </p>
            <p className="text-sm text-zinc-500">Sessions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <ChangeIndicator value={data.summary?.durationChange || 0} />
            </div>
            <p className="text-2xl font-bold text-zinc-100">
              {formatDuration(data.summary?.avgSessionDuration || 0)}
            </p>
            <p className="text-sm text-zinc-500">Session Duration</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-pink-400" />
              </div>
              <ChangeIndicator value={data.summary?.bounceRateChange || 0} />
            </div>
            <p className="text-2xl font-bold text-zinc-100">
              {data.summary?.bounceRate || 0}%
            </p>
            <p className="text-sm text-zinc-500">Bounce Rate</p>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-sm font-semibold text-zinc-300">Traffic Over Time</h3>
            <div className="flex gap-1 bg-zinc-800 rounded-lg p-1 self-start sm:self-auto">
              {(['visitors', 'pageviews', 'sessions'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                    chartMode === mode
                      ? 'bg-zinc-700 text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mode === 'pageviews' ? 'Views' : mode}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <div className="flex items-end gap-1 h-full">
              {chartData.map((day, i) => {
                const value = chartMode === 'visitors' ? day.visitors : chartMode === 'pageviews' ? day.pageviews : day.sessions;
                const height = (value / maxChartValue) * 100;
                return (
                  <div
                    key={i}
                    tabIndex={0}
                    className="flex-1 bg-blue-500/40 hover:bg-blue-500 focus:bg-blue-500 rounded-t transition-colors cursor-pointer group relative outline-none"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block group-focus:block z-10">
                      <div className="bg-zinc-700 text-zinc-100 text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                        <p className="font-semibold">{day.date}</p>
                        <p>{day.visitors.toLocaleString()} visitors</p>
                        <p>{day.pageviews.toLocaleString()} views</p>
                        <p>{day.sessions.toLocaleString()} sessions</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-xs text-zinc-500">
              <span>{chartData[0]?.date}</span>
              <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
              <span>{chartData[chartData.length - 1]?.date}</span>
            </div>
          </div>
        </motion.div>

        {/* Grid: Pages, Sources, Devices, Countries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-300">Top Pages</h3>
            </div>
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-zinc-900">
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                    <th className="px-5 py-2 font-medium">Page</th>
                    <th className="px-5 py-2 font-medium text-right">Views</th>
                    <th className="px-5 py-2 font-medium text-right">Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.map((page, i) => (
                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="px-5 py-2.5 text-sm text-zinc-300 truncate max-w-xs">
                        {page.path || '/'}
                      </td>
                      <td className="px-5 py-2.5 text-sm text-zinc-100 text-right font-medium">
                        {page.views.toLocaleString()}
                      </td>
                      <td className="px-5 py-2.5 text-sm text-zinc-400 text-right">
                        {page.visitors.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Top Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-300">Top Sources</h3>
            </div>
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-zinc-900">
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                    <th className="px-5 py-2 font-medium">Source</th>
                    <th className="px-5 py-2 font-medium text-right">Visitors</th>
                    <th className="px-5 py-2 font-medium text-right">Sessions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topSources.map((source, i) => (
                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="px-5 py-2.5 text-sm text-zinc-300 truncate max-w-xs">
                        {source.source}
                      </td>
                      <td className="px-5 py-2.5 text-sm text-zinc-100 text-right font-medium">
                        {source.visitors.toLocaleString()}
                      </td>
                      <td className="px-5 py-2.5 text-sm text-zinc-400 text-right">
                        {source.sessions.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Devices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-300">Devices</h3>
            </div>
            <div className="space-y-3">
              {data.devices.map((device, i) => {
                const DeviceIcon = getDeviceIcon(device.device);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <DeviceIcon className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300 capitalize">{device.device}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500">{device.visitors.toLocaleString()}</span>
                        <span className="text-zinc-100 font-medium w-10 text-right">{device.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Countries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-zinc-400" />
              <h3 className="text-sm font-semibold text-zinc-300">Countries</h3>
            </div>
            <div className="space-y-3">
              {data.countries.slice(0, 6).map((country, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{country.country}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500">{country.visitors.toLocaleString()}</span>
                      <span className="text-zinc-100 font-medium w-10 text-right">{country.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Browsers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-300">Browsers</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {data.browsers.slice(0, 5).map((browser, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-zinc-100">{browser.percentage}%</p>
                <p className="text-sm text-zinc-400 truncate">{browser.device}</p>
                <p className="text-xs text-zinc-500">{browser.visitors.toLocaleString()} visitors</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
