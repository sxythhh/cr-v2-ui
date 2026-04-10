"use client";
// @ts-nocheck

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import {
  DollarSign,
  Eye,
  TrendingUp,
  Users,
  ChevronRight,
  Loader2,
  Calculator,
  Instagram,
  Calendar,
  ChevronDown,
} from 'lucide-react';

// ── Inline Types ───────────────────────────────────────────────────
interface Creator {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'inactive';
  avatar_url?: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  total_views: number;
  total_videos: number;
  engagement_rate: number;
  cpm_rate: number;
  retainer_amount: number;
  contract_start_date?: string;
  cpm_cap?: number;
}

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_CREATORS: Creator[] = [
  { id: 'c1', name: 'Daniel Martinez', status: 'active', instagram_handle: 'danielm', tiktok_handle: 'danielm_tt', total_views: 2450000, total_videos: 34, engagement_rate: 4.2, cpm_rate: 3.5, retainer_amount: 2000, contract_start_date: '2025-01-15' },
  { id: 'c2', name: 'Sarah Chen', status: 'active', instagram_handle: 'sarahchen', total_views: 1870000, total_videos: 28, engagement_rate: 5.1, cpm_rate: 4.0, retainer_amount: 2500, contract_start_date: '2025-02-01' },
  { id: 'c3', name: 'Alex Rivera', status: 'active', tiktok_handle: 'alexrivera', total_views: 3210000, total_videos: 45, engagement_rate: 3.8, cpm_rate: 3.0, retainer_amount: 1800, contract_start_date: '2024-11-01' },
  { id: 'c4', name: 'Emma Wilson', status: 'active', instagram_handle: 'emmaw', tiktok_handle: 'emmaw_tt', total_views: 980000, total_videos: 18, engagement_rate: 6.3, cpm_rate: 5.0, retainer_amount: 3000, contract_start_date: '2025-03-15' },
  { id: 'c5', name: 'Jordan Lee', status: 'active', instagram_handle: 'jordanlee', total_views: 4560000, total_videos: 52, engagement_rate: 3.2, cpm_rate: 2.5, retainer_amount: 1500, contract_start_date: '2024-09-01' },
];

// ── Helpers ────────────────────────────────────────────────────────
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

// Generate month options
function getMonthOptions() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const options: { value: string; label: string; start: Date; end: Date }[] = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0);
    options.push({
      value: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
      label: `${months[monthIndex]} ${year}`,
      start,
      end,
    });
  }
  return options;
}

type DateRangeValue = 'all' | 'custom' | string;

// Calculate ROI metrics for a creator
function calculateROI(creator: Creator) {
  const totalViews = creator.total_views || 0;
  const totalVideos = creator.total_videos || 0;
  const engagementRate = creator.engagement_rate || 0;

  // Approximate: retainer * number of billing cycles + CPM
  const cycles = totalVideos > 0 ? Math.ceil(totalVideos / 3) : 1;
  const totalRetainers = creator.retainer_amount * cycles;
  const cpmEarnings = Math.round((totalViews / 1000) * creator.cpm_rate * 100) / 100;
  const totalCost = Math.round((totalRetainers + cpmEarnings) * 100) / 100;
  const costPerView = totalViews > 0 ? Math.round((totalCost / totalViews) * 10000) / 10000 : 0;
  const viewsPerDollar = totalCost > 0 ? Math.round(totalViews / totalCost) : totalViews > 0 ? Infinity : 0;

  return {
    totalRetainers,
    cpmRate: creator.cpm_rate || 0,
    cpmEarnings,
    totalCost,
    costPerView,
    viewsPerDollar,
    totalViews,
    totalVideos,
    engagementRate,
  };
}

// Month Picker Dropdown
function MonthPicker({
  value,
  onChange,
  options,
}: {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  options: ReturnType<typeof getMonthOptions>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayLabel = () => {
    if (value === 'all') return 'All Time';
    if (value === 'custom') return 'Custom Range';
    const option = options.find(o => o.value === value);
    return option?.label || 'Select Month';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 hover:bg-zinc-700 transition-colors"
      >
        <Calendar className="w-4 h-4 text-zinc-400" />
        {getDisplayLabel()}
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              <button
                onClick={() => { onChange('all'); setIsOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  value === 'all' ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                All Time
              </button>
              <div className="border-t border-zinc-700 my-1" />
              {options.map(option => (
                <button
                  key={option.value}
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    value === option.value ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// CPV Stat Card
function CPVStatCard({ value, icon }: { value: number; icon: React.ReactNode }) {
  const getColorClasses = () => {
    if (value <= 0.005) {
      return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-400', valueText: 'text-emerald-400', indicator: 'Excellent' };
    } else if (value >= 0.010) {
      return { bg: 'bg-red-500/10', border: 'border-red-500/30', iconBg: 'bg-red-500/20', iconText: 'text-red-400', valueText: 'text-red-400', indicator: 'Above Average' };
    } else {
      const ratio = (value - 0.005) / (0.010 - 0.005);
      if (ratio < 0.5) {
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', iconBg: 'bg-yellow-500/20', iconText: 'text-yellow-400', valueText: 'text-yellow-400', indicator: 'Good' };
      } else {
        return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', iconBg: 'bg-orange-500/20', iconText: 'text-orange-400', valueText: 'text-orange-400', indicator: 'Average' };
      }
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`relative overflow-hidden rounded-xl border p-6 transition-all duration-700 ease-out ${colors.bg} ${colors.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">Avg CPV</p>
          <p className={`mt-2 text-3xl font-bold ${colors.valueText}`}>${value.toFixed(4)}</p>
          <p className={`mt-1 text-xs font-medium ${colors.iconText}`}>{colors.indicator}</p>
        </div>
        <div className={`rounded-lg p-2 ${colors.iconBg}`}>
          <div className={colors.iconText}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

// Creator ROI Card
function CreatorROICard({ creator, rank }: { creator: Creator; rank: number }) {
  const roi = calculateROI(creator);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
    >
      <Link href={`/vn/roi/${creator.id}`}>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:bg-zinc-800/30 transition-colors cursor-pointer group">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                rank === 2 ? 'bg-zinc-400/20 text-zinc-300' :
                rank === 3 ? 'bg-orange-700/20 text-orange-500' :
                'bg-zinc-800 text-zinc-500'
              }`}>
                {rank}
              </div>

              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-300">
                {creator.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-zinc-100 truncate group-hover:text-orange-400 transition-colors">
                    {creator.name}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    creator.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    creator.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-zinc-500/20 text-zinc-400'
                  }`}>
                    {creator.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                  {creator.instagram_handle && (
                    <span className="flex items-center gap-1">
                      <Instagram className="w-3.5 h-3.5" />
                      @{creator.instagram_handle}
                    </span>
                  )}
                  {creator.tiktok_handle && (
                    <span className="flex items-center gap-1">
                      <TikTokIcon className="w-3.5 h-3.5" />
                      @{creator.tiktok_handle}
                    </span>
                  )}
                </div>
              </div>

              <div className="hidden md:flex items-center gap-5 text-sm ml-auto">
                <div className="text-right min-w-[70px]">
                  <p className="text-zinc-500 text-xs">Views</p>
                  <p className="font-semibold text-sm text-zinc-100">{formatNumber(roi.totalViews)}</p>
                </div>
                <div className="text-right min-w-[50px]">
                  <p className="text-zinc-500 text-xs">Videos</p>
                  <p className="font-semibold text-sm text-zinc-100">{roi.totalVideos}</p>
                </div>
                <div className="text-right min-w-[70px]">
                  <p className="text-zinc-500 text-xs">Engagement</p>
                  <p className="font-semibold text-sm text-zinc-100">{roi.engagementRate}%</p>
                </div>
                <div className="text-right min-w-[75px]">
                  <p className="text-zinc-500 text-xs">CPV</p>
                  <p className="font-semibold text-sm text-emerald-400">${roi.costPerView.toFixed(4)}</p>
                </div>
                <div className="text-right min-w-[70px]">
                  <p className="text-zinc-500 text-xs">Total Cost</p>
                  <p className="font-semibold text-sm text-orange-400">${roi.totalCost.toLocaleString()}</p>
                </div>
              </div>

              <div className="text-zinc-500 group-hover:text-orange-400 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>

            <div className="md:hidden grid grid-cols-4 gap-3 mt-4 pt-3 border-t border-zinc-800">
              <div className="text-center">
                <p className="text-xs text-zinc-500">Views</p>
                <p className="font-semibold text-zinc-100 text-sm">{formatNumber(roi.totalViews)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500">Engagement</p>
                <p className="font-semibold text-zinc-100 text-sm">{roi.engagementRate}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500">CPV</p>
                <p className="font-semibold text-emerald-400 text-sm">${roi.costPerView.toFixed(4)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500">Cost</p>
                <p className="font-semibold text-orange-400 text-sm">${roi.totalCost}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ROIPage() {
  const creators = MOCK_CREATORS;
  const loading = false;
  const [selectedMonth, setSelectedMonth] = useState<DateRangeValue>('all');
  const [sortBy, setSortBy] = useState<'viewsPerDollar' | 'totalCost' | 'views'>('viewsPerDollar');

  const monthOptions = useMemo(() => getMonthOptions(), []);

  const activeCreators = creators.filter(c => c.status === 'active');

  const summaryStats = useMemo(() => {
    const creatorsWithROI = activeCreators.map(c => ({ creator: c, roi: calculateROI(c) }));
    const totalSpend = creatorsWithROI.reduce((sum, { roi }) => sum + roi.totalCost, 0);
    const totalViews = creatorsWithROI.reduce((sum, { roi }) => sum + roi.totalViews, 0);
    const totalCPMEarnings = creatorsWithROI.reduce((sum, { roi }) => sum + roi.cpmEarnings, 0);
    const avgCostPerView = totalViews > 0 ? totalSpend / totalViews : 0;

    return {
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalViews,
      avgCostPerView: Math.round(avgCostPerView * 10000) / 10000,
      totalCPMEarnings: Math.round(totalCPMEarnings * 100) / 100,
      creatorCount: activeCreators.length,
    };
  }, [activeCreators]);

  const sortedCreators = useMemo(() => {
    return [...activeCreators].sort((a, b) => {
      const roiA = calculateROI(a);
      const roiB = calculateROI(b);
      switch (sortBy) {
        case 'viewsPerDollar':
          const aVPD = roiA.viewsPerDollar === Infinity ? Number.MAX_VALUE : roiA.viewsPerDollar;
          const bVPD = roiB.viewsPerDollar === Infinity ? Number.MAX_VALUE : roiB.viewsPerDollar;
          return bVPD - aVPD;
        case 'totalCost':
          return roiB.totalCost - roiA.totalCost;
        case 'views':
          return roiB.totalViews - roiA.totalViews;
        default:
          return 0;
      }
    });
  }, [activeCreators, sortBy]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">ROI Analytics</h1>
          <p className="text-zinc-400 mt-1">Track creator performance and cost efficiency</p>
        </div>
        <MonthPicker
          value={selectedMonth}
          onChange={setSelectedMonth}
          options={monthOptions}
        />
      </div>

      {/* Summary Stats */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMonth}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8"
        >
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">Total Spend</p>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-zinc-100">${summaryStats.totalSpend.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">Total Views</p>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-zinc-100">{formatNumber(summaryStats.totalViews)}</p>
          </div>
          <CPVStatCard
            value={summaryStats.avgCostPerView}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">Total CPM Earnings</p>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-zinc-100">${summaryStats.totalCPMEarnings.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">Active Creators</p>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold text-zinc-100">{summaryStats.creatorCount}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Sort Controls */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-zinc-400">Sort by:</span>
        <div className="flex gap-2">
          {[
            { value: 'viewsPerDollar', label: 'Best ROI' },
            { value: 'totalCost', label: 'Highest Spend' },
            { value: 'views', label: 'Most Views' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value as typeof sortBy)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === option.value
                  ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Creator Leaderboard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`creators-${selectedMonth}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, delay: 0.1 }}
          className="space-y-4"
        >
          {sortedCreators.map((creator, index) => (
            <CreatorROICard
              key={creator.id}
              creator={creator}
              rank={index + 1}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
