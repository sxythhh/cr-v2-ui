"use client";
// @ts-nocheck

import { useState, useRef, use } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  BarChart3,
  Users,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Calendar,
  TrendingUp,
  ChevronDown,
  RefreshCw,
  MapPin,
} from 'lucide-react';

// ── Inline Types ───────────────────────────────────────────────────
interface UTMLink {
  id: string;
  name: string;
  base_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string;
  utm_term?: string;
  full_url: string;
  creator_id?: string;
}

const UTM_SOURCE_LABELS: Record<string, string> = {
  ig: 'Instagram',
  tw: 'Twitter',
  tt: 'TikTok',
  yt: 'YouTube',
  fb: 'Facebook',
};

const UTM_MEDIUM_LABELS: Record<string, string> = {
  o: 'Organic',
  p: 'Paid',
  r: 'Referral',
  e: 'Email',
};

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_DAILY = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toISOString().split('T')[0],
    pageviews: Math.floor(Math.random() * 200 + 20),
    visitors: Math.floor(Math.random() * 100 + 10),
  };
});

const MOCK_LINK: UTMLink = {
  id: 'mock-1',
  name: 'Daniel IG Bio',
  base_url: 'https://www.contentrewards.cc/',
  utm_source: 'ig',
  utm_medium: 'o',
  utm_campaign: 'sm',
  full_url: 'https://www.contentrewards.cc/?utm_source=ig&utm_medium=o&utm_campaign=sm',
};

const MOCK_STATS = {
  totalPageviews: 4821,
  uniqueVisitors: 2103,
  dailyData: MOCK_DAILY,
  deviceBreakdown: [
    { device: 'Desktop', count: 2456 },
    { device: 'Mobile', count: 1987 },
    { device: 'Tablet', count: 378 },
  ],
  browserBreakdown: [
    { browser: 'Chrome', count: 2890 },
    { browser: 'Safari', count: 1234 },
    { browser: 'Firefox', count: 456 },
    { browser: 'Edge', count: 241 },
  ],
  countryBreakdown: [
    { country: 'United States', countryCode: 'US', count: 2100 },
    { country: 'United Kingdom', countryCode: 'GB', count: 876 },
    { country: 'Germany', countryCode: 'DE', count: 543 },
    { country: 'Canada', countryCode: 'CA', count: 432 },
  ],
  cityBreakdown: [
    { city: 'New York', country: 'US', count: 654 },
    { city: 'London', country: 'GB', count: 432 },
    { city: 'Los Angeles', country: 'US', count: 321 },
    { city: 'Berlin', country: 'DE', count: 234 },
  ],
};

// Date range options
const DATE_RANGE_OPTIONS = [
  { label: '10 Minutes', value: '10m', days: 0.007 },
  { label: '1 Hour', value: '1h', days: 0.042 },
  { label: '6 Hours', value: '6h', days: 0.25 },
  { label: '12 Hours', value: '12h', days: 0.5 },
  { label: 'Today', value: '1d', days: 1 },
  { label: '7 Days', value: '7d', days: 7 },
  { label: '30 Days', value: '30d', days: 30 },
  { label: '90 Days', value: '90d', days: 90 },
];

export default function UTMLinkAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const link = MOCK_LINK;
  const stats = MOCK_STATS;
  const loading = false;
  const posthogConfigured = true;
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedRange, setSelectedRange] = useState('30d');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function copyUrl() {
    if (!link) return;
    navigator.clipboard.writeText(link.full_url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  function getDeviceIcon(device: string) {
    const d = device?.toLowerCase() || '';
    if (d.includes('mobile') || d.includes('phone')) return Smartphone;
    if (d.includes('tablet')) return Tablet;
    return Monitor;
  }

  function getCountryFlag(countryCode: string): string {
    if (!countryCode || countryCode.length !== 2) return '';
    const code = countryCode.toUpperCase();
    return String.fromCodePoint(
      ...[...code].map(c => 0x1f1e6 + c.charCodeAt(0) - 65)
    );
  }

  function getSelectedLabel() {
    return DATE_RANGE_OPTIONS.find(o => o.value === selectedRange)?.label || '30 Days';
  }

  const avgDailyVisitors = stats.dailyData.length
    ? Math.round(stats.dailyData.reduce((sum, d) => sum + d.visitors, 0) / stats.dailyData.length)
    : 0;

  const viewsToday = stats.dailyData.length
    ? stats.dailyData[stats.dailyData.length - 1].pageviews
    : 0;

  const calculateTrend = () => {
    if (stats.dailyData.length < 14) return null;
    const recent = stats.dailyData.slice(-7).reduce((sum, d) => sum + d.pageviews, 0);
    const previous = stats.dailyData.slice(-14, -7).reduce((sum, d) => sum + d.pageviews, 0);
    if (previous === 0) return recent > 0 ? 100 : 0;
    return Math.round(((recent - previous) / previous) * 100);
  };

  const trend = calculateTrend();
  const chartData = stats.dailyData || [];
  const maxPageviews = Math.max(...chartData.map(d => d.pageviews), 1);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <Link
              href="/vn/utm-links"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-zinc-100 truncate">
                {link?.name || 'Link Analytics'}
              </h1>
              <p className="text-zinc-400 mt-1 hidden sm:block">
                Detailed analytics powered by PostHog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-100 hover:bg-zinc-700 transition-colors"
              >
                <Calendar className="w-4 h-4 text-zinc-400" />
                {getSelectedLabel()}
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  {DATE_RANGE_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedRange(option.value);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        selectedRange === option.value
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Link Info Card */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                  {UTM_SOURCE_LABELS[link.utm_source] || link.utm_source}
                </span>
                <span className="text-zinc-500">/</span>
                <span className="text-zinc-300">
                  {UTM_MEDIUM_LABELS[link.utm_medium] || link.utm_medium}
                </span>
                <span className="text-zinc-500">/</span>
                <span className="text-zinc-300">{link.utm_campaign}</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="text-sm text-orange-400 bg-zinc-800 px-3 py-1.5 rounded-lg truncate max-w-2xl">
                  {link.full_url}
                </code>
                <button
                  onClick={copyUrl}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors flex-shrink-0"
                >
                  {copiedUrl ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
                <a
                  href={link.full_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: 'Total Pageviews', value: stats.totalPageviews.toLocaleString(), color: 'purple', icon: Eye, delay: 0.1 },
            { label: 'Views Today', value: viewsToday.toLocaleString(), color: 'pink', icon: Eye, delay: 0.15 },
            { label: 'Unique Visitors', value: stats.uniqueVisitors.toLocaleString(), color: 'blue', icon: Users, delay: 0.2 },
            { label: 'Avg Daily Visitors', value: avgDailyVisitors.toLocaleString(), color: 'emerald', icon: Calendar, delay: 0.25 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${item.color}-400`} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-zinc-100">{item.value}</p>
                  <p className="text-xs sm:text-sm text-zinc-500">{item.label}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-zinc-100">
                  {trend !== null ? (
                    <span className={trend >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {trend >= 0 ? '+' : ''}{trend}%
                    </span>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p className="text-xs sm:text-sm text-zinc-500">7-Day Trend</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pageviews Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 overflow-hidden"
        >
          <h3 className="text-sm font-semibold text-zinc-300 mb-6">Pageviews Over Time</h3>
          <div className="h-56 pb-2">
            <div className="flex items-end gap-0.5 h-full px-1">
              {chartData.map((day, i) => {
                const height = (day.pageviews / maxPageviews) * 100;
                return (
                  <div
                    key={i}
                    className="flex-1 min-w-0 bg-purple-500/40 hover:bg-purple-500 rounded-t transition-colors cursor-pointer group relative"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 pointer-events-none">
                      <div className="bg-zinc-700 text-zinc-100 text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                        <p className="font-semibold">{day.date}</p>
                        <p>{day.pageviews} pageviews</p>
                        <p>{day.visitors} visitors</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-500">
            <span>{chartData[0]?.date}</span>
            <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
            <span>{chartData[chartData.length - 1]?.date}</span>
          </div>
        </motion.div>

        {/* Device & Browser Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
          >
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Device Breakdown</h3>
            <div className="space-y-3">
              {stats.deviceBreakdown.map((item, i) => {
                const total = stats.deviceBreakdown.reduce((sum, d) => sum + d.count, 0);
                const percent = total > 0 ? (item.count / total) * 100 : 0;
                const DeviceIcon = getDeviceIcon(item.device);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <DeviceIcon className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300 capitalize">{item.device || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">{item.count.toLocaleString()}</span>
                        <span className="text-zinc-100 font-medium w-12 text-right">{percent.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
          >
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Browser Breakdown</h3>
            <div className="space-y-3">
              {stats.browserBreakdown.map((item, i) => {
                const total = stats.browserBreakdown.reduce((sum, b) => sum + b.count, 0);
                const percent = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">{item.browser || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">{item.count.toLocaleString()}</span>
                        <span className="text-zinc-100 font-medium w-12 text-right">{percent.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Geographic Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
          >
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Country Breakdown</h3>
            <div className="space-y-3">
              {stats.countryBreakdown.map((item, i) => {
                const total = stats.countryBreakdown.reduce((sum, c) => sum + c.count, 0);
                const percent = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">
                          {getCountryFlag(item.countryCode) || '🌍'}
                        </span>
                        <span className="text-zinc-300">{item.country || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">{item.count.toLocaleString()}</span>
                        <span className="text-zinc-100 font-medium w-12 text-right">{percent.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
          >
            <h3 className="text-sm font-semibold text-zinc-300 mb-4">Top Cities</h3>
            <div className="space-y-3">
              {stats.cityBreakdown.map((item, i) => {
                const total = stats.cityBreakdown.reduce((sum, c) => sum + c.count, 0);
                const percent = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">{item.city || 'Unknown'}</span>
                        <span className="text-zinc-600 text-xs">{item.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">{item.count.toLocaleString()}</span>
                        <span className="text-zinc-100 font-medium w-12 text-right">{percent.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Daily Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
        >
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Daily Breakdown</h3>
          <div className="grid grid-cols-7 gap-2">
            {[...stats.dailyData].reverse().slice(0, 28).map((day, i) => {
              const maxPv = Math.max(...stats.dailyData.map(d => d.pageviews), 1);
              const intensity = Math.min((day.pageviews / maxPv) * 100, 100);
              return (
                <div key={i} className="relative group">
                  <div
                    className="aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                    style={{
                      backgroundColor: intensity > 0
                        ? `rgba(168, 85, 247, ${0.1 + (intensity / 100) * 0.7})`
                        : 'rgb(39, 39, 42)'
                    }}
                  >
                    <span className="text-xs font-medium text-zinc-300">
                      {new Date(day.date).getDate()}
                    </span>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-zinc-700 text-zinc-100 text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                      <p className="font-semibold">{day.date}</p>
                      <p>{day.pageviews.toLocaleString()} pageviews</p>
                      <p>{day.visitors.toLocaleString()} visitors</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
            <span className="text-xs text-zinc-500">Less</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor: intensity > 0
                      ? `rgba(168, 85, 247, ${0.1 + intensity * 0.7})`
                      : 'rgb(39, 39, 42)'
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">More</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-zinc-800">
            {[...stats.dailyData].reverse().slice(0, 4).map((day, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-zinc-500 mb-1">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-lg font-bold text-zinc-100">{day.pageviews.toLocaleString()}</p>
                <p className="text-xs text-zinc-500">{day.visitors} visitors</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
