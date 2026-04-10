"use client";
// @ts-nocheck

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  DollarSign,
  Eye,
  TrendingUp,
  Video,
  Instagram,
  Sparkles,
  Loader2,
  Play,
  ExternalLink,
  Calendar,
  CalendarDays,
  Calculator,
  X,
  RefreshCw,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
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

interface VideoType {
  id: string;
  creator_id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  platform: 'instagram' | 'tiktok';
  published_at: string | null;
  thumbnail_url?: string;
  direct_video_url?: string;
}

interface ContractVariation {
  id: string;
  creator_id: string;
  effective_date: string;
  retainer_amount: number;
  cpm_rate: number;
  cpm_cap?: number;
  notes?: string;
}

interface BillingCycle {
  cycleNumber: number;
  startDate: Date;
  endDate: Date;
  retainer: number;
  cpmRate: number;
  videoIds: string[];
  isPaused?: boolean;
}

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_CREATORS: Record<string, Creator> = {
  c1: { id: 'c1', name: 'Daniel Martinez', status: 'active', instagram_handle: 'danielm', tiktok_handle: 'danielm_tt', total_views: 2450000, total_videos: 34, engagement_rate: 4.2, cpm_rate: 3.5, retainer_amount: 2000, contract_start_date: '2025-01-15' },
  c2: { id: 'c2', name: 'Sarah Chen', status: 'active', instagram_handle: 'sarahchen', total_views: 1870000, total_videos: 28, engagement_rate: 5.1, cpm_rate: 4.0, retainer_amount: 2500, contract_start_date: '2025-02-01' },
  c3: { id: 'c3', name: 'Alex Rivera', status: 'active', tiktok_handle: 'alexrivera', total_views: 3210000, total_videos: 45, engagement_rate: 3.8, cpm_rate: 3.0, retainer_amount: 1800, contract_start_date: '2024-11-01' },
  c4: { id: 'c4', name: 'Emma Wilson', status: 'active', instagram_handle: 'emmaw', tiktok_handle: 'emmaw_tt', total_views: 980000, total_videos: 18, engagement_rate: 6.3, cpm_rate: 5.0, retainer_amount: 3000, contract_start_date: '2025-03-15' },
  c5: { id: 'c5', name: 'Jordan Lee', status: 'active', instagram_handle: 'jordanlee', total_views: 4560000, total_videos: 52, engagement_rate: 3.2, cpm_rate: 2.5, retainer_amount: 1500, contract_start_date: '2024-09-01' },
};

function generateMockVideos(creatorId: string, count: number): VideoType[] {
  const titles = [
    'How I Grew My Following to 100K', 'Day in My Life as a Creator', 'Viral Trend Challenge',
    'Behind the Scenes of a Photoshoot', 'My Morning Routine', 'Reacting to Comments',
    'Collab with @brand', 'Testing Viral Products', 'Get Ready With Me', 'What I Eat in a Day',
    'Travel Vlog: Tokyo', 'Workout Routine', 'Style Tips for Summer', 'My Skincare Routine',
    'Studio Tour', 'Q&A Session', 'Trying New Recipes', 'Productivity Tips',
  ];
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i * 5 + Math.floor(Math.random() * 3)));
    return {
      id: `v-${creatorId}-${i}`,
      creator_id: creatorId,
      title: titles[i % titles.length],
      views: Math.floor(Math.random() * 300000 + 10000),
      likes: Math.floor(Math.random() * 15000 + 500),
      comments: Math.floor(Math.random() * 2000 + 50),
      platform: Math.random() > 0.5 ? 'instagram' : 'tiktok',
      published_at: d.toISOString(),
      thumbnail_url: undefined,
    };
  });
}

const MOCK_VARIATIONS: ContractVariation[] = [
  { id: 'v1', creator_id: 'c1', effective_date: '2025-06-01', retainer_amount: 2500, cpm_rate: 4.0, notes: 'Raised after Q1 review' },
];

// ── Helpers ────────────────────────────────────────────────────────
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function OrangeStatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-orange-300">{title}</p>
        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-orange-100">{value}</p>
    </div>
  );
}

function StatCardSimple({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-zinc-400">{title}</p>
        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
    </div>
  );
}

function CPVStatCard({ value, icon }: { value: number; icon: React.ReactNode }) {
  const getColorClasses = () => {
    if (value <= 0.005) {
      return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-400', labelText: 'text-emerald-300', valueText: 'text-emerald-400' };
    } else if (value >= 0.010) {
      return { bg: 'bg-red-500/10', border: 'border-red-500/30', iconBg: 'bg-red-500/20', iconText: 'text-red-400', labelText: 'text-red-300', valueText: 'text-red-400' };
    } else {
      const position = (value - 0.005) / 0.005;
      if (position < 0.5) {
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', iconBg: 'bg-yellow-500/20', iconText: 'text-yellow-400', labelText: 'text-yellow-300', valueText: 'text-yellow-400' };
      } else {
        return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', iconBg: 'bg-orange-500/20', iconText: 'text-orange-400', labelText: 'text-orange-300', valueText: 'text-orange-400' };
      }
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`rounded-xl p-4 ${colors.bg} border ${colors.border}`}>
      <div className="flex items-center justify-between mb-2">
        <p className={`text-sm ${colors.labelText}`}>CPV</p>
        <div className={`p-2 rounded-lg ${colors.iconBg} ${colors.iconText}`}>{icon}</div>
      </div>
      <p className={`text-2xl font-bold ${colors.valueText}`}>${value.toFixed(4)}</p>
      <p className="text-xs mt-1">
        {value <= 0.005 ? (
          <span className="text-emerald-400">Excellent</span>
        ) : value >= 0.010 ? (
          <span className="text-red-400">Above avg</span>
        ) : value < 0.0075 ? (
          <span className="text-yellow-400">Good</span>
        ) : (
          <span className="text-orange-400">Average</span>
        )}
      </p>
    </div>
  );
}

function calculateVideoCPM(views: number, cpmRate: number, cpmCap?: number | null) {
  const rawCpm = (views / 1000) * cpmRate;
  const cappedCpm = cpmCap && cpmCap > 0 ? Math.min(rawCpm, cpmCap) : rawCpm;
  return Math.round(cappedCpm * 100) / 100;
}

function calculateEngagement(views: number, likes: number, comments: number) {
  if (views === 0) return 0;
  return Math.round(((likes + comments) / views) * 10000) / 100;
}

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

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group">
        {/* Thumbnail placeholder */}
        <div className="relative w-14 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-5 h-5 text-zinc-600" />
          </div>
        </div>

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
                  ? new Date(contractStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
                    {new Date(variation.effective_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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

export default function CreatorROIPage() {
  const params = useParams();
  const router = useRouter();
  const creatorId = params.creatorId as string;

  const creator = MOCK_CREATORS[creatorId] || MOCK_CREATORS['c1'];
  const videos = useMemo(() => generateMockVideos(creator.id, creator.total_videos), [creator.id, creator.total_videos]);
  const variations = MOCK_VARIATIONS.filter(v => v.creator_id === creator.id);
  const loading = false;

  const [showSimulation, setShowSimulation] = useState(false);
  const [showContractInfo, setShowContractInfo] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [videos]);

  // Simplified contract terms per video
  const videoContractTerms = useMemo(() => {
    const terms = new Map<string, {
      retainer: number;
      cpmRate: number;
      cpmCap: number | null;
      isPreContract: boolean;
      retainerPerVideo: number;
      cycleNumber: number | null;
    }>();

    const contractStart = creator.contract_start_date ? new Date(creator.contract_start_date) : null;
    const videosPerCycle = 3; // approximate

    sortedVideos.forEach((video, i) => {
      const isPreContract = contractStart && video.published_at
        ? new Date(video.published_at) < contractStart
        : true;

      const cycleNumber = isPreContract ? null : Math.floor(i / videosPerCycle) + 1;
      const retainerPerVideo = isPreContract ? 0 : Math.round((creator.retainer_amount / videosPerCycle) * 100) / 100;

      terms.set(video.id, {
        retainer: isPreContract ? 0 : creator.retainer_amount,
        cpmRate: isPreContract ? 0 : creator.cpm_rate,
        cpmCap: creator.cpm_cap || null,
        isPreContract,
        retainerPerVideo,
        cycleNumber,
      });
    });

    return terms;
  }, [sortedVideos, creator]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    let totalCPM = 0;
    let totalRetainers = 0;
    let postContractVideoCount = 0;

    for (const video of sortedVideos) {
      const term = videoContractTerms.get(video.id);
      if (term && !term.isPreContract) {
        totalCPM += calculateVideoCPM(video.views, term.cpmRate, term.cpmCap);
        totalRetainers += term.retainerPerVideo;
        postContractVideoCount++;
      }
    }

    const totalCost = Math.round((totalRetainers + totalCPM) * 100) / 100;

    return {
      totalCPM: Math.round(totalCPM * 100) / 100,
      totalCost,
      totalRetainers: Math.round(totalRetainers * 100) / 100,
      postContractVideoCount,
    };
  }, [sortedVideos, videoContractTerms]);

  const roiMetrics = useMemo(() => {
    const retainer = creator.retainer_amount || 0;
    const cpmRate = creator.cpm_rate || 0;
    const totalViews = creator.total_views || 0;

    return {
      retainer,
      cpmRate,
      cpmEarnings: totalStats.totalCPM,
      totalCost: totalStats.totalCost,
      cpv: totalViews > 0 ? Math.round((totalStats.totalCost / totalViews) * 10000) / 10000 : 0,
    };
  }, [creator, totalStats]);

  const cycleDay = useMemo(() => {
    if (!creator.contract_start_date) return null;
    const date = new Date(creator.contract_start_date);
    return date.getDate();
  }, [creator.contract_start_date]);

  if (!creator) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <p className="text-zinc-400">Creator not found</p>
          <button onClick={() => router.push('/vn/roi')} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg">
            Back to ROI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-lg font-bold text-zinc-300">
            {creator.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-100">{creator.name}</h1>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                creator.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                creator.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                'bg-zinc-500/20 text-zinc-400'
              }`}>
                {creator.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
              {creator.instagram_handle && (
                <span className="flex items-center gap-1">
                  <Instagram className="w-4 h-4" />
                  @{creator.instagram_handle}
                </span>
              )}
              {creator.tiktok_handle && (
                <span className="flex items-center gap-1">
                  <TikTokIcon className="w-4 h-4" />
                  @{creator.tiktok_handle}
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
        <div className="flex items-center gap-3">
          {cycleDay && (
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-blue-400">{cycleDay}{cycleDay === 1 ? 'st' : cycleDay === 2 ? 'nd' : cycleDay === 3 ? 'rd' : 'th'}</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowContractInfo(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors"
          >
            <FileText className="w-4 h-4 text-purple-400" />
          </button>
          <button
            onClick={() => setShowSimulation(true)}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors text-sm"
          >
            <Calculator className="w-4 h-4" />
            Simulate
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <OrangeStatCard title="Monthly Retainer" value={`$${roiMetrics.retainer}`} icon={<DollarSign className="w-5 h-5" />} />
        <OrangeStatCard title="CPM Rate" value={`$${roiMetrics.cpmRate}/1k`} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCardSimple title="CPM Earnings" value={`$${roiMetrics.cpmEarnings}`} icon={<TrendingUp className="w-5 h-5" />} />
        <CPVStatCard value={roiMetrics.cpv} icon={<DollarSign className="w-5 h-5" />} />
        <StatCardSimple title="Total Views" value={formatNumber(creator.total_views)} icon={<Eye className="w-5 h-5" />} />
        <StatCardSimple title="Total Videos" value={creator.total_videos} icon={<Video className="w-5 h-5" />} />
      </div>

      {/* AI Analysis Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">ROI Analysis</h2>
          {!analysis && (
            <button
              onClick={() => setAnalysis('This creator shows strong ROI metrics with a CPV of $' + roiMetrics.cpv.toFixed(4) + '. Their engagement rate of ' + creator.engagement_rate + '% is above average for their niche. The current retainer-to-views ratio suggests good value, and their consistent posting schedule indicates reliability. Consider maintaining current terms for the next renewal cycle.')}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Analyze with AI
            </button>
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
          <p className="text-zinc-500 text-sm">Click &quot;Analyze with AI&quot; to get an assessment of this creator&apos;s ROI performance.</p>
        )}
      </div>

      {/* Videos with CPM Earnings */}
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
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>Total Retainers: <span className="font-semibold text-orange-400">${totalStats.totalRetainers.toLocaleString()}</span></span>
            <span>Total CPM: <span className="font-semibold text-emerald-400">${totalStats.totalCPM.toLocaleString()}</span></span>
            <span>Total Cost: <span className="font-semibold text-purple-400">${totalStats.totalCost.toLocaleString()}</span></span>
          </div>
        </div>

        {sortedVideos.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <Video className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No videos found for this creator</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedVideos.map((video, index) => {
              const terms = videoContractTerms.get(video.id);
              return (
                <VideoROIRow
                  key={video.id}
                  video={video}
                  cpmRate={terms?.cpmRate || 0}
                  cpmCap={terms?.cpmCap}
                  retainerPerVideo={terms?.retainerPerVideo || 0}
                  isPreContract={terms?.isPreContract || false}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSimulation && (
          <SimulationModal
            isOpen={showSimulation}
            onClose={() => setShowSimulation(false)}
            defaultRetainer={roiMetrics.retainer}
            defaultCpm={roiMetrics.cpmRate}
            defaultViews={creator.total_views}
          />
        )}
        {showContractInfo && (
          <ContractInfoModal
            isOpen={showContractInfo}
            onClose={() => setShowContractInfo(false)}
            contractStartDate={creator.contract_start_date || null}
            baseRetainer={creator.retainer_amount || 0}
            baseCpmRate={creator.cpm_rate || 0}
            variations={variations}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
