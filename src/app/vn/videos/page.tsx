"use client";
// @ts-nocheck

import { useState, useMemo } from 'react';
import { Search, Instagram, Download, RefreshCw, Eye, Heart, MessageCircle, Clock, TrendingUp, Zap, Users, ChevronDown, Check, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Header } from '@/components/vn/layout/header';
import { Button } from '@/components/vn/ui/button';
import { VideoGrid } from '@/components/vn/features/video-grid';
import { ImportVideoModal } from '@/components/vn/features/import-video-modal';

// Types inlined
type Platform = 'instagram' | 'tiktok';
type VideoSortBy = 'views' | 'likes' | 'recent' | 'comments' | 'fastest_growing' | 'outlier';
type TargetAudienceType = 'clippers' | 'ugc_creators' | 'brands' | 'N/A';

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

const sortOptions = [
  { value: 'views', label: 'Views', icon: Eye },
  { value: 'likes', label: 'Likes', icon: Heart },
  { value: 'recent', label: 'Recent', icon: Clock },
  { value: 'comments', label: 'Comments', icon: MessageCircle },
  { value: 'fastest_growing', label: 'Growing', icon: TrendingUp },
  { value: 'outlier', label: 'Outliers', icon: Zap },
];

// Mock video data
const mockVideos = [
  {
    id: '1', title: 'How I Grew My Brand with UGC', platform: 'instagram' as Platform, views: 245000, likes: 12400, comments: 890,
    thumbnail_url: null, video_url: 'https://instagram.com/reel/1', published_at: '2024-03-15T10:00:00Z',
    creator: { id: 'c1', name: 'Sarah Johnson', avatar_url: null },
    script_analysis: { targetAudiences: ['ugc_creators', 'brands'] }, outlier_score: 3.2,
  },
  {
    id: '2', title: 'Top 5 UGC Tips for Beginners', platform: 'tiktok' as Platform, views: 189000, likes: 9800, comments: 720,
    thumbnail_url: null, video_url: 'https://tiktok.com/@user/video/2', published_at: '2024-03-12T14:00:00Z',
    creator: { id: 'c2', name: 'Mike Chen', avatar_url: null },
    script_analysis: { targetAudiences: ['clippers'] }, outlier_score: 2.1,
  },
  {
    id: '3', title: 'Behind the Scenes of a Viral Reel', platform: 'instagram' as Platform, views: 320000, likes: 18200, comments: 1340,
    thumbnail_url: null, video_url: 'https://instagram.com/reel/3', published_at: '2024-03-10T08:30:00Z',
    creator: { id: 'c1', name: 'Sarah Johnson', avatar_url: null },
    script_analysis: { targetAudiences: ['ugc_creators'] }, outlier_score: 5.1,
  },
  {
    id: '4', title: 'Brand Deal Negotiation Masterclass', platform: 'tiktok' as Platform, views: 156000, likes: 7600, comments: 540,
    thumbnail_url: null, video_url: 'https://tiktok.com/@user/video/4', published_at: '2024-03-08T16:00:00Z',
    creator: { id: 'c3', name: 'Emma Wilson', avatar_url: null },
    script_analysis: { targetAudiences: ['brands'] }, outlier_score: 1.8,
  },
  {
    id: '5', title: 'Content Calendar Strategy That Works', platform: 'instagram' as Platform, views: 98000, likes: 5200, comments: 380,
    thumbnail_url: null, video_url: 'https://instagram.com/reel/5', published_at: '2024-03-05T12:00:00Z',
    creator: { id: 'c2', name: 'Mike Chen', avatar_url: null },
    script_analysis: { targetAudiences: ['ugc_creators', 'brands'] }, outlier_score: 0.9,
  },
  {
    id: '6', title: 'Editing Workflow for Short-Form Video', platform: 'tiktok' as Platform, views: 210000, likes: 11000, comments: 820,
    thumbnail_url: null, video_url: 'https://tiktok.com/@user/video/6', published_at: '2024-03-01T09:00:00Z',
    creator: { id: 'c3', name: 'Emma Wilson', avatar_url: null },
    script_analysis: { targetAudiences: ['clippers', 'ugc_creators'] }, outlier_score: 2.8,
  },
];

export default function VideosPage() {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | ''>('');
  const [sortBy, setSortBy] = useState<VideoSortBy>('views');
  const [showImportModal, setShowImportModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);
  const [selectedAudiences, setSelectedAudiences] = useState<Set<TargetAudienceType>>(new Set());
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  // Mock data
  const allVideos = mockVideos;
  const videos = mockVideos;
  const loading = false;

  // Calculate total platform stats from ALL videos (not filtered)
  const instagramCount = allVideos.filter(v => v.platform === 'instagram').length;
  const tiktokCount = allVideos.filter(v => v.platform === 'tiktok').length;

  // Get unique creators
  const creators = [...new Set(allVideos.map(v => v.creator?.name).filter(Boolean))] as string[];

  // Filter videos by selected creators and audiences (client-side filtering on top of hook results)
  const filteredVideos = videos.filter(v => {
    // Platform filter
    if (platformFilter && v.platform !== platformFilter) return false;
    // Search filter
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    // Creator filter
    if (selectedCreators.size > 0 && !selectedCreators.has(v.creator?.name || '')) return false;
    // Audience filter
    if (selectedAudiences.size > 0) {
      const videoAudiences = v.script_analysis?.targetAudiences || [];
      if (!videoAudiences.some(a => selectedAudiences.has(a as TargetAudienceType))) return false;
    }
    return true;
  });

  // Key for animations when filters change
  const filterKey = useMemo(() => {
    return `${platformFilter}-${sortBy}-${search}-${Array.from(selectedCreators).join(',')}-${Array.from(selectedAudiences).join(',')}`;
  }, [platformFilter, sortBy, search, selectedCreators, selectedAudiences]);

  const toggleCreator = (creator: string) => {
    setSelectedCreators(prev => {
      const next = new Set(prev);
      if (next.has(creator)) next.delete(creator);
      else next.add(creator);
      return next;
    });
  };

  const toggleAudience = (audience: TargetAudienceType) => {
    setSelectedAudiences(prev => {
      const next = new Set(prev);
      if (next.has(audience)) next.delete(audience);
      else next.add(audience);
      return next;
    });
  };

  const handleRefreshAll = async () => {
    // No-op
  };

  const handleImportSuccess = () => {
    // No-op
  };

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <Header
          title="Videos"
          description="Browse and manage all UGC videos"
          className="mb-0"
        />
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={handleRefreshAll}
            disabled={refreshing || allVideos.length === 0}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh All'}
          </Button>
          <Button onClick={() => setShowImportModal(true)}>
            <Download className="w-4 h-4" />
            Import Videos
          </Button>
        </div>
      </div>

      {/* Unified Toolbar */}
      <div className="flex flex-col gap-3 mb-6 pb-4 border-b border-zinc-800">
        {/* Mobile: custom dark-themed dropdowns */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Platform dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => { setMobilePlatformOpen(!mobilePlatformOpen); setMobileSortOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200"
            >
              <span>{platformFilter === 'instagram' ? `Instagram (${instagramCount})` : platformFilter === 'tiktok' ? `TikTok (${tiktokCount})` : 'All Platforms'}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${mobilePlatformOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {mobilePlatformOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMobilePlatformOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                  >
                    {[
                      { value: '', label: 'All Platforms' },
                      { value: 'instagram', label: `Instagram (${instagramCount})` },
                      { value: 'tiktok', label: `TikTok (${tiktokCount})` },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setPlatformFilter(opt.value as Platform | ''); setMobilePlatformOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          platformFilter === opt.value ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          {/* Sort dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => { setMobileSortOpen(!mobileSortOpen); setMobilePlatformOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200"
            >
              <span>{sortOptions.find(o => o.value === sortBy)?.label || 'Sort'}</span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${mobileSortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {mobileSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMobileSortOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                  >
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value as VideoSortBy); setMobileSortOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          sortBy === opt.value ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop: button row */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Platform Filters */}
          <button
            onClick={() => setPlatformFilter(platformFilter === 'instagram' ? '' : 'instagram')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              platformFilter === 'instagram'
                ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Instagram className="w-4 h-4" />
            <span>{instagramCount}</span>
          </button>
          <button
            onClick={() => setPlatformFilter(platformFilter === 'tiktok' ? '' : 'tiktok')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              platformFilter === 'tiktok'
                ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <TikTokIcon className="w-4 h-4" />
            <span>{tiktokCount}</span>
          </button>

          <div className="w-px h-8 bg-zinc-700" />

          {/* Sort Options */}
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value as VideoSortBy)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                sortBy === opt.value
                  ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                  : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              <opt.icon className="w-4 h-4" />
              <span>{opt.label}</span>
            </button>
          ))}

          <div className="w-px h-8 bg-zinc-700" />
        </div>

        {/* Dropdowns + Search row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">

        {/* Creator Multi-Select */}
        <div className="relative">
          <button
            onClick={() => setShowCreatorDropdown(!showCreatorDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedCreators.size > 0
                ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{selectedCreators.size > 0 ? `${selectedCreators.size} Creator${selectedCreators.size > 1 ? 's' : ''}` : 'Creators'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showCreatorDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showCreatorDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCreatorDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 py-2 max-h-64 overflow-y-auto"
                >
                  {creators.map(creator => (
                    <button
                      key={creator}
                      onClick={() => toggleCreator(creator)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-zinc-700 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedCreators.has(creator)
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-zinc-600'
                      }`}>
                        {selectedCreators.has(creator) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-zinc-200">{creator}</span>
                    </button>
                  ))}
                  {creators.length === 0 && (
                    <p className="px-4 py-2 text-sm text-zinc-500">No creators found</p>
                  )}
                  {selectedCreators.size > 0 && (
                    <button
                      onClick={() => setSelectedCreators(new Set())}
                      className="w-full px-4 py-2 text-sm text-orange-400 hover:bg-zinc-700 border-t border-zinc-700 mt-1"
                    >
                      Clear All
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Target Audience Filter */}
        <div className="relative">
          <button
            onClick={() => setShowAudienceDropdown(!showAudienceDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedAudiences.size > 0
                ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>{selectedAudiences.size > 0 ? `${selectedAudiences.size} Audience${selectedAudiences.size > 1 ? 's' : ''}` : 'Audience'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAudienceDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showAudienceDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAudienceDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 py-2"
                >
                  {([
                    { value: 'clippers' as TargetAudienceType, label: 'Clippers', color: 'bg-purple-500' },
                    { value: 'ugc_creators' as TargetAudienceType, label: 'UGC Creators', color: 'bg-blue-500' },
                    { value: 'brands' as TargetAudienceType, label: 'Brands', color: 'bg-emerald-500' },
                    { value: 'N/A' as TargetAudienceType, label: 'N/A', color: 'bg-zinc-500' },
                  ]).map(audience => (
                    <button
                      key={audience.value}
                      onClick={() => toggleAudience(audience.value)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-zinc-700 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedAudiences.has(audience.value)
                          ? `${audience.color} border-transparent`
                          : 'border-zinc-600'
                      }`}>
                        {selectedAudiences.has(audience.value) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-zinc-200">{audience.label}</span>
                    </button>
                  ))}
                  {selectedAudiences.size > 0 && (
                    <button
                      onClick={() => setSelectedAudiences(new Set())}
                      className="w-full px-4 py-2 text-sm text-orange-400 hover:bg-zinc-700 border-t border-zinc-700 mt-1"
                    >
                      Clear All
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className="w-full sm:flex-1 sm:max-w-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-zinc-800/80 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
        </div>
        </div>
      </div>

      {/* Videos Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`videos-${filterKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <VideoGrid videos={filteredVideos} loading={loading} />
        </motion.div>
      </AnimatePresence>

      {/* Import Modal */}
      {showImportModal && (
        <ImportVideoModal
          onClose={() => setShowImportModal(false)}
          onSuccess={handleImportSuccess}
        />
      )}
    </PageContainer>
  );
}
