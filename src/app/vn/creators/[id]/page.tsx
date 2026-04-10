"use client";
// @ts-nocheck

import { use, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Instagram,
  Eye,
  Video,
  TrendingUp,
  Mail,
  Calendar,
  Download,
  DollarSign,
  Sparkles,
  Loader2,
  Play,
  ExternalLink,
  CalendarDays,
  Calculator,
  X,
  RefreshCw,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Button } from '@/components/vn/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/vn/ui/card';
import { Avatar } from '@/components/vn/ui/avatar';
import { Badge } from '@/components/vn/ui/badge';
import { Skeleton } from '@/components/vn/ui/skeleton';
import { CreatorForm } from '@/components/vn/features/creator-form';
import { formatNumber, formatDate } from '@/lib/vn-utils';

// ── Types ──────────────────────────────────────────────────────────────
interface VideoType {
  id: string;
  title: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  thumbnail_url: string | null;
  direct_video_url: string | null;
  published_at: string | null;
  creator_id: string;
}

interface ContractVariation {
  id: string;
  effective_date: string;
  retainer_amount: number;
  cpm_rate: number;
  cpm_cap: number | null;
  notes: string | null;
}

// ── Mock Data ──────────────────────────────────────────────────────────
const mockCreator = {
  id: 'c1',
  name: 'Emma Johnson',
  email: 'emma@example.com',
  status: 'active',
  tiktok_handle: 'emmaj',
  instagram_handle: 'emma.johnson',
  avatar_url: null,
  total_views: 3_200_000,
  total_videos: 89,
  cpm_rate: 5.0,
  retainer_amount: 500,
  cpm_cap: null,
  contract_start_date: '2025-06-01',
  engagement_rate: 5.2,
  notes: 'Top performer, consistent posting schedule.',
  created_at: '2025-06-01T00:00:00Z',
};

const mockVideos: VideoType[] = [
  { id: 'v1', title: 'Morning Skincare Routine 🌸', platform: 'tiktok', views: 245_000, likes: 12400, comments: 890, thumbnail_url: null, direct_video_url: null, published_at: '2026-04-08T12:00:00Z', creator_id: 'c1' },
  { id: 'v2', title: 'What I Actually Eat in a Day', platform: 'tiktok', views: 189_000, likes: 9800, comments: 720, thumbnail_url: null, direct_video_url: null, published_at: '2026-04-05T15:00:00Z', creator_id: 'c1' },
  { id: 'v3', title: 'Get Ready With Me - Date Night', platform: 'instagram', views: 156_000, likes: 8200, comments: 540, thumbnail_url: null, direct_video_url: null, published_at: '2026-04-02T10:00:00Z', creator_id: 'c1' },
  { id: 'v4', title: 'Best Drugstore Dupes 2026', platform: 'tiktok', views: 320_000, likes: 18900, comments: 1200, thumbnail_url: null, direct_video_url: null, published_at: '2026-03-28T14:00:00Z', creator_id: 'c1' },
  { id: 'v5', title: 'My Apartment Tour', platform: 'instagram', views: 98_000, likes: 5400, comments: 340, thumbnail_url: null, direct_video_url: null, published_at: '2026-03-22T09:00:00Z', creator_id: 'c1' },
  { id: 'v6', title: 'Viral Dance Challenge', platform: 'tiktok', views: 520_000, likes: 34000, comments: 2100, thumbnail_url: null, direct_video_url: null, published_at: '2026-03-15T11:00:00Z', creator_id: 'c1' },
  { id: 'v7', title: 'Healthy Meal Prep Ideas', platform: 'tiktok', views: 134_000, likes: 6700, comments: 410, thumbnail_url: null, direct_video_url: null, published_at: '2026-03-10T16:00:00Z', creator_id: 'c1' },
  { id: 'v8', title: 'Summer Fashion Haul', platform: 'instagram', views: 76_000, likes: 4200, comments: 280, thumbnail_url: null, direct_video_url: null, published_at: '2026-03-05T13:00:00Z', creator_id: 'c1' },
  { id: 'v9', title: 'Night Routine for Clear Skin', platform: 'tiktok', views: 198_000, likes: 11200, comments: 780, thumbnail_url: null, direct_video_url: null, published_at: '2026-02-28T18:00:00Z', creator_id: 'c1' },
  { id: 'v10', title: 'Top 5 Protein Snacks', platform: 'tiktok', views: 145_000, likes: 7800, comments: 520, thumbnail_url: null, direct_video_url: null, published_at: '2026-02-20T10:00:00Z', creator_id: 'c1' },
];

const mockVariations: ContractVariation[] = [
  { id: 'cv1', effective_date: '2025-12-01', retainer_amount: 600, cpm_rate: 5.5, cpm_cap: null, notes: 'Performance bonus increase' },
];
// ── End Mock Data ──────────────────────────────────────────────────────

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

// Orange highlighted stat card component
function OrangeStatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-orange-300">{title}</p>
        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-orange-100">{value}</p>
    </div>
  );
}

// Regular stat card component
function StatCardSimple({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-zinc-400">{title}</p>
        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
    </div>
  );
}

// CPV stat card with dynamic color based on performance
function CPVStatCard({ value, icon }: { value: number; icon: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getColorClasses = () => {
    if (value <= 0.005) {
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        iconBg: 'bg-emerald-500/20',
        iconText: 'text-emerald-400',
        labelText: 'text-emerald-300',
        valueText: 'text-emerald-400',
      };
    } else if (value >= 0.010) {
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        iconBg: 'bg-red-500/20',
        iconText: 'text-red-400',
        labelText: 'text-red-300',
        valueText: 'text-red-400',
      };
    } else {
      const position = (value - 0.005) / 0.005;
      if (position < 0.5) {
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          iconBg: 'bg-yellow-500/20',
          iconText: 'text-yellow-400',
          labelText: 'text-yellow-300',
          valueText: 'text-yellow-400',
        };
      } else {
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          iconBg: 'bg-orange-500/20',
          iconText: 'text-orange-400',
          labelText: 'text-orange-300',
          valueText: 'text-orange-400',
        };
      }
    }
  };

  const colors = getColorClasses();

  return (
    <div
      className={`rounded-xl p-4 transition-all duration-700 ease-out ${
        isLoaded
          ? `${colors.bg} border ${colors.border}`
          : 'bg-zinc-900 border border-zinc-800'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm transition-colors duration-700 ${isLoaded ? colors.labelText : 'text-zinc-400'}`}>
          CPV
        </p>
        <div className={`p-2 rounded-lg transition-colors duration-700 ${
          isLoaded ? `${colors.iconBg} ${colors.iconText}` : 'bg-zinc-800 text-zinc-400'
        }`}>
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold transition-colors duration-700 ${
        isLoaded ? colors.valueText : 'text-zinc-100'
      }`}>
        ${value.toFixed(4)}
      </p>
      <p className={`text-xs mt-1 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {value <= 0.005 ? (
          <span className="text-emerald-400">● Excellent</span>
        ) : value >= 0.010 ? (
          <span className="text-red-400">● Above avg</span>
        ) : value < 0.0075 ? (
          <span className="text-yellow-400">● Good</span>
        ) : (
          <span className="text-orange-400">● Average</span>
        )}
      </p>
    </div>
  );
}

// Calculate CPM earnings for a video (with optional cap)
function calculateVideoCPM(views: number, cpmRate: number, cpmCap?: number | null) {
  const rawCpm = (views / 1000) * cpmRate;
  const cappedCpm = cpmCap && cpmCap > 0 ? Math.min(rawCpm, cpmCap) : rawCpm;
  return Math.round(cappedCpm * 100) / 100;
}

// Calculate engagement rate
function calculateEngagement(views: number, likes: number, comments: number) {
  if (views === 0) return 0;
  return Math.round(((likes + comments) / views) * 10000) / 100;
}

// Truncate title helper
function truncateTitle(title: string, maxLength: number = 45) {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
}

// Video ROI row component
function VideoROIRow({
  video,
  cpmRate,
  cpmCap,
  retainerPerVideo,
  isPreContract,
  index
}: {
  video: VideoType;
  cpmRate: number;
  cpmCap?: number | null;
  retainerPerVideo: number;
  isPreContract: boolean;
  index: number;
}) {
  const cpmEarnings = calculateVideoCPM(video.views, cpmRate, cpmCap);
  const engagement = calculateEngagement(video.views, video.likes, video.comments);
  const totalCost = Math.round((cpmEarnings + retainerPerVideo) * 100) / 100;
  const [thumbnailError, setThumbnailError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const showThumbnail = video.thumbnail_url && !thumbnailError;
  const showVideo = !showThumbnail && video.direct_video_url && !videoError;
  const showFallback = !showThumbnail && !showVideo;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group">
        {/* 9:16 Portrait Thumbnail */}
        <div className="relative w-14 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
          {showThumbnail && (
            <img
              src={video.thumbnail_url!}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={() => setThumbnailError(true)}
            />
          )}
          {showVideo && (
            <video
              src={video.direct_video_url!}
              className="w-full h-full object-cover"
              muted
              playsInline
              onError={() => setVideoError(true)}
            />
          )}
          {showFallback && (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-5 h-5 text-zinc-600" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0 max-w-[280px]">
          <h4 className="font-medium text-zinc-100 group-hover:text-orange-400 transition-colors" title={video.title}>
            {truncateTitle(video.title)}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
            {video.platform === 'instagram' ? (
              <Instagram className="w-3.5 h-3.5" />
            ) : (
              <TikTokIcon className="w-3.5 h-3.5" />
            )}
            <span>
              {video.published_at
                ? new Date(video.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Unknown date'}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm ml-auto">
          <div className="text-right min-w-[80px]">
            <p className="text-zinc-500 text-xs mb-1">Views</p>
            <p className="font-semibold text-base text-zinc-100">{formatNumber(video.views)}</p>
          </div>
          <div className="text-right min-w-[80px]">
            <p className="text-zinc-500 text-xs mb-1">Engagement</p>
            <p className="font-semibold text-base text-zinc-100">{engagement}%</p>
          </div>
          <div className="text-right min-w-[100px]">
            <p className="text-zinc-500 text-xs mb-1">CPM Earnings</p>
            <p className={`font-semibold text-base ${isPreContract ? 'text-zinc-500' : 'text-emerald-400'}`}>
              {isPreContract ? '$0.00' : `$${cpmEarnings.toLocaleString()}`}
            </p>
          </div>
          <div className="text-right min-w-[95px]">
            <p className="text-zinc-500 text-xs mb-1">Retainer/Vid</p>
            <p className={`font-semibold text-base ${isPreContract ? 'text-zinc-500' : 'text-orange-400'}`}>
              {isPreContract ? '$0.00' : `$${retainerPerVideo.toFixed(2)}`}
            </p>
          </div>
          <div className="text-right min-w-[90px]">
            <p className="text-zinc-500 text-xs mb-1">Total Cost</p>
            <p className={`font-semibold text-base ${isPreContract ? 'text-zinc-500' : 'text-purple-400'}`}>
              {isPreContract ? '$0.00' : `$${totalCost.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Contract Info Modal
function ContractInfoModal({
  isOpen,
  onClose,
  contractStartDate,
  baseRetainer,
  baseCpmRate,
  variations,
}: {
  isOpen: boolean;
  onClose: () => void;
  contractStartDate: string | null;
  baseRetainer: number;
  baseCpmRate: number;
  variations: ContractVariation[];
}) {
  if (!isOpen) return null;

  const sortedVariations = [...variations].sort((a, b) =>
    new Date(a.effective_date).getTime() - new Date(b.effective_date).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-100">Contract Terms History</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-orange-300">Initial Contract</span>
              <span className="text-xs text-zinc-500 ml-auto">
                {contractStartDate
                  ? new Date(contractStartDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Not set'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Monthly Retainer</p>
                <p className="font-semibold text-zinc-100">${baseRetainer.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">CPM Rate</p>
                <p className="font-semibold text-zinc-100">${baseCpmRate}/1k views</p>
              </div>
            </div>
          </div>

          {sortedVariations.length > 0 ? (
            sortedVariations.map((variation, index) => (
              <div key={variation.id} className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-sm font-medium text-purple-300">Variation #{index + 1}</span>
                  <span className="text-xs text-zinc-500 ml-auto">
                    {new Date(variation.effective_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Monthly Retainer</p>
                    <p className="font-semibold text-zinc-100">${variation.retainer_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">CPM Rate</p>
                    <p className="font-semibold text-zinc-100">${variation.cpm_rate}/1k views</p>
                  </div>
                </div>
                {variation.notes && (
                  <p className="text-xs text-zinc-400 mt-2 italic">{variation.notes}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500 text-center py-4">No contract variations.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Simulation Modal
function SimulationModal({
  isOpen,
  onClose,
  defaultRetainer,
  defaultCpm,
  defaultViews,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultRetainer: number;
  defaultCpm: number;
  defaultViews: number;
}) {
  const [retainer, setRetainer] = useState(defaultRetainer);
  const [cpmRate, setCpmRate] = useState(defaultCpm);
  const [views, setViews] = useState(defaultViews);

  const cpmEarnings = Math.round(((views / 1000) * cpmRate) * 100) / 100;
  const totalCost = retainer + cpmEarnings;
  const viewsPerDollar = totalCost > 0 ? Math.round(views / totalCost) : 0;
  const costPerView = views > 0 ? Math.round((totalCost / views) * 10000) / 10000 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-100">Cost Simulator</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <p className="text-sm text-zinc-400 mb-6">
          Enter retainer, CPM rate, and expected views to calculate costs.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Monthly Retainer</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={retainer}
                onChange={(e) => setRetainer(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">CPM Rate (per 1,000 views)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={cpmRate}
                onChange={(e) => setCpmRate(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Expected Views</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={views}
              onChange={(e) => setViews(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
            <div className="flex gap-2 mt-2">
              {[10000, 50000, 100000, 500000, 1000000].map((v) => (
                <button
                  key={v}
                  onClick={() => setViews(v)}
                  className={`px-2 py-1 text-xs rounded ${views === v ? 'bg-orange-500/30 text-orange-300' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                >
                  {formatNumber(v)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Calculated Costs</h3>

          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">Retainer</span>
            <span className="font-semibold text-orange-400">${retainer.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-400">CPM Earnings</span>
            <span className="font-semibold text-emerald-400">${cpmEarnings.toLocaleString()}</span>
          </div>

          <div className="border-t border-zinc-700 pt-3 flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-300">Total Cost</span>
            <span className="font-bold text-lg text-purple-400">${totalCost.toLocaleString()}</span>
          </div>

          <div className="border-t border-zinc-700 pt-3 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">Cost per View</p>
              <p className="font-semibold text-zinc-100">${costPerView.toFixed(4)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">Views per $</p>
              <p className="font-semibold text-zinc-100">{formatNumber(viewsPerDollar)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface CreatorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CreatorDetailPage({ params }: CreatorDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  // Use mock data instead of hooks
  const creator = mockCreator;
  const loading = false;
  const refetch = () => console.log('refetch (mock)');
  const videos = mockVideos;
  const videosLoading = false;
  const refetchVideos = () => console.log('refetchVideos (mock)');
  const variations = mockVariations;

  const [showImportModal, setShowImportModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContractInfo, setShowContractInfo] = useState(false);

  // Sort videos by date
  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [videos]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    let totalRetainers = 0;
    let totalCPM = 0;
    let postContractVideoCount = 0;

    const cpmRate = variations.length > 0 ? variations[0].cpm_rate : (creator.cpm_rate || 0);
    const retainer = variations.length > 0 ? variations[0].retainer_amount : (creator.retainer_amount || 0);
    const videosInCycle = sortedVideos.length || 1;
    const retainerPerVideo = retainer / videosInCycle;

    for (const video of sortedVideos) {
      totalCPM += calculateVideoCPM(video.views, cpmRate, creator.cpm_cap);
      totalRetainers += retainerPerVideo;
      postContractVideoCount++;
    }

    const totalCost = Math.round((totalRetainers + totalCPM) * 100) / 100;

    return {
      totalCPM: Math.round(totalCPM * 100) / 100,
      totalCost,
      totalRetainers: Math.round(totalRetainers * 100) / 100,
      postContractVideoCount,
    };
  }, [sortedVideos, creator, variations]);

  // ROI metrics
  const roiMetrics = useMemo(() => {
    const currentVariation = variations.length > 0 ? variations[0] : null;
    const retainer = currentVariation ? currentVariation.retainer_amount : (creator.retainer_amount || 0);
    const cpmRate = currentVariation ? currentVariation.cpm_rate : (creator.cpm_rate || 0);
    const totalViews = creator.total_views || 0;

    return {
      retainer,
      cpmRate,
      cpmEarnings: totalStats.totalCPM,
      totalCost: totalStats.totalCost,
      cpv: totalViews > 0 ? Math.round((totalStats.totalCost / totalViews) * 10000) / 10000 : 0,
    };
  }, [creator, totalStats, variations]);

  // Cycle day
  const cycleDay = useMemo(() => {
    if (!creator?.contract_start_date) return null;
    const date = new Date(creator.contract_start_date);
    return date.getDate();
  }, [creator?.contract_start_date]);

  // Cycle info
  const cycleInfo = useMemo(() => {
    if (!creator?.contract_start_date) return { completeCycles: 0 };
    const startDate = new Date(creator.contract_start_date);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return { completeCycles: Math.floor(daysDiff / 30) };
  }, [creator?.contract_start_date]);

  const analyzeCreator = async () => {
    // Mock AI analysis
    setAnalyzing(true);
    console.log('Analyze creator (mock)');
    setTimeout(() => {
      setAnalysis(
        'Emma is a strong performer with consistent engagement rates above 5%. Her CPV of $0.0058 is well below the $0.01 threshold, indicating excellent ROI. Recommendation: Consider increasing retainer to incentivize more frequent posting, as her per-video metrics suggest untapped potential with higher volume.'
      );
      setAnalyzing(false);
    }, 1500);
  };

  const isLoading = loading || videosLoading;

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-start gap-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!creator) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-zinc-400 mb-4">Creator not found</p>
          <Link href="/vn/creators">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4" />
              Back to Creators
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const cpmRate = variations.length > 0 ? variations[0].cpm_rate : (creator.cpm_rate || 0);
  const retainerPerVideo = sortedVideos.length > 0
    ? (roiMetrics.retainer / sortedVideos.length)
    : roiMetrics.retainer;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/vn/creators"
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <Avatar src={creator.avatar_url} name={creator.name} size="lg" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-100">{creator.name}</h1>
              <Badge variant={creator.status}>{creator.status}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
              {creator.instagram_handle && (
                <a
                  href={`https://instagram.com/${creator.instagram_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-pink-400 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @{creator.instagram_handle}
                </a>
              )}
              {creator.tiktok_handle && (
                <a
                  href={`https://tiktok.com/@${creator.tiktok_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <TikTokIcon className="w-4 h-4" />
                  @{creator.tiktok_handle}
                </a>
              )}
              {creator.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {creator.email}
                </span>
              )}
              {creator.contract_start_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Contract: {new Date(creator.contract_start_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {cycleDay && (
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-blue-400">{cycleDay}{cycleDay === 1 ? 'st' : cycleDay === 2 ? 'nd' : cycleDay === 3 ? 'rd' : 'th'}</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Billing cycle day
              </div>
            </div>
          )}
          <div className="relative group">
            <button
              onClick={() => setShowContractInfo(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors"
            >
              <FileText className="w-4 h-4 text-purple-400" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Contract history
            </div>
          </div>
          {cycleInfo.completeCycles > 0 && (
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-400">{cycleInfo.completeCycles}</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Complete cycles
              </div>
            </div>
          )}
          <Button variant="secondary" onClick={() => setShowEditModal(true)}>
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="secondary" onClick={() => setShowSimulation(true)}>
            <Calculator className="w-4 h-4" />
            Simulate
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <OrangeStatCard
          title="Monthly Retainer"
          value={`$${roiMetrics?.retainer || 0}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <OrangeStatCard
          title="CPM Rate"
          value={`$${roiMetrics?.cpmRate || 0}/1k`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCardSimple
          title="CPM Earnings"
          value={`$${roiMetrics?.cpmEarnings || 0}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <CPVStatCard
          value={roiMetrics?.cpv || 0}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCardSimple
          title="Total Views"
          value={formatNumber(creator.total_views)}
          icon={<Eye className="w-5 h-5" />}
        />
        <StatCardSimple
          title="Total Videos"
          value={creator.total_videos}
          icon={<Video className="w-5 h-5" />}
        />
      </div>

      {/* AI Analysis Section */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">ROI Analysis</h2>
          {!analysis && (
            <Button onClick={analyzeCreator} disabled={analyzing} variant="secondary">
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze with AI
                </>
              )}
            </Button>
          )}
        </div>
        {analysis ? (
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-zinc-300">AI Assessment</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">{analysis}</p>
          </div>
        ) : (
          <p className="text-zinc-500 text-sm">Click "Analyze with AI" to get an assessment of this creator's ROI performance.</p>
        )}
      </Card>

      {/* Notes */}
      {creator.notes && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-300">{creator.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Videos with ROI Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">
            Videos ({sortedVideos.length})
            {totalStats.postContractVideoCount !== sortedVideos.length && (
              <span className="text-sm font-normal text-zinc-500 ml-2">
                ({totalStats.postContractVideoCount} in contract)
              </span>
            )}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span>Total Retainers: <span className="font-semibold text-orange-400">${totalStats.totalRetainers.toLocaleString()}</span></span>
              <span>Total CPM: <span className="font-semibold text-emerald-400">${totalStats.totalCPM.toLocaleString()}</span></span>
              <span>Total Cost: <span className="font-semibold text-purple-400">${totalStats.totalCost.toLocaleString()}</span></span>
            </div>
            <Button onClick={() => console.log('Import video (mock)')}>
              <Download className="w-4 h-4" />
              Import Video
            </Button>
          </div>
        </div>

        {sortedVideos.length === 0 ? (
          <Card className="p-8 text-center">
            <Video className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No videos found for this creator</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedVideos.map((video, index) => (
              <VideoROIRow
                key={video.id}
                video={video}
                cpmRate={cpmRate}
                cpmCap={creator.cpm_cap}
                retainerPerVideo={retainerPerVideo}
                isPreContract={false}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSimulation && (
          <SimulationModal
            isOpen={showSimulation}
            onClose={() => setShowSimulation(false)}
            defaultRetainer={roiMetrics?.retainer || 0}
            defaultCpm={roiMetrics?.cpmRate || 0}
            defaultViews={creator.total_views}
          />
        )}
        {showContractInfo && (
          <ContractInfoModal
            isOpen={showContractInfo}
            onClose={() => setShowContractInfo(false)}
            contractStartDate={creator.contract_start_date}
            baseRetainer={creator.retainer_amount || 0}
            baseCpmRate={creator.cpm_rate || 0}
            variations={variations}
          />
        )}
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowEditModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl mx-4 relative"
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute -top-2 -right-2 z-10 p-2 bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
              <CreatorForm
                creator={creator}
                onSuccess={() => {
                  setShowEditModal(false);
                  refetch();
                }}
                onDelete={() => {
                  router.push('/vn/creators');
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
