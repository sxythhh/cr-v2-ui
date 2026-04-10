"use client";
// @ts-nocheck

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import {
  Search,
  Download,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  Filter,
  RotateCcw,
  Check,
  GripVertical,
  X,
  Users,
  Plus,
  Loader2,
  Pencil,
  MoreHorizontal,
  Archive,
  Clock,
  Undo2,
} from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Input } from '@/components/vn/ui/input';
import { Button } from '@/components/vn/ui/button';
import { Select } from '@/components/vn/ui/select';
import { Skeleton } from '@/components/vn/ui/skeleton';
import { Avatar } from '@/components/vn/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/vn/ui/table';
import { Instagram as IconBrandInstagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreatorForm } from '@/components/vn/features/creator-form';

// ── Types ──────────────────────────────────────────────────────────────
type CreatorStatus = 'active' | 'inactive' | 'pending' | 'paused';

interface Creator {
  id: string;
  name: string;
  email: string | null;
  status: CreatorStatus | null;
  tiktok_handle: string | null;
  instagram_handle: string | null;
  avatar_url: string | null;
  total_views: number;
  total_videos: number;
  cpm_rate: number | null;
  retainer_amount: number | null;
  avg_views_tiktok: number | null;
  avg_views_instagram: number | null;
  created_at: string | null;
  archived_at: string | null;
  benched_until: string | null;
  notes: string | null;
}

// ── Mock Data ──────────────────────────────────────────────────────────
const mockCreators: Creator[] = [
  { id: 'c1', name: 'Emma Johnson', email: 'emma@example.com', status: 'active', tiktok_handle: 'emmaj', instagram_handle: 'emma.johnson', avatar_url: null, total_views: 3_200_000, total_videos: 89, cpm_rate: 5.0, retainer_amount: 500, avg_views_tiktok: 45000, avg_views_instagram: 32000, created_at: '2025-06-01T00:00:00Z', archived_at: null, benched_until: null, notes: null },
  { id: 'c2', name: 'Liam Chen', email: 'liam@example.com', status: 'active', tiktok_handle: 'liamchen', instagram_handle: null, avatar_url: null, total_views: 2_800_000, total_videos: 72, cpm_rate: 4.5, retainer_amount: 400, avg_views_tiktok: 38000, avg_views_instagram: null, created_at: '2025-07-15T00:00:00Z', archived_at: null, benched_until: null, notes: null },
  { id: 'c3', name: 'Sophia Martinez', email: 'sophia@example.com', status: 'active', tiktok_handle: 'sophiam', instagram_handle: 'sophia.m', avatar_url: null, total_views: 2_100_000, total_videos: 54, cpm_rate: 6.0, retainer_amount: 600, avg_views_tiktok: 52000, avg_views_instagram: 28000, created_at: '2025-05-20T00:00:00Z', archived_at: null, benched_until: null, notes: null },
  { id: 'c4', name: 'Noah Kim', email: 'noah@example.com', status: 'active', tiktok_handle: 'noahk', instagram_handle: null, avatar_url: null, total_views: 1_900_000, total_videos: 48, cpm_rate: 4.0, retainer_amount: 350, avg_views_tiktok: 42000, avg_views_instagram: null, created_at: '2025-08-10T00:00:00Z', archived_at: null, benched_until: null, notes: null },
  { id: 'c5', name: 'Ava Patel', email: 'ava@example.com', status: 'active', tiktok_handle: null, instagram_handle: 'ava.patel', avatar_url: null, total_views: 1_600_000, total_videos: 41, cpm_rate: 5.5, retainer_amount: 450, avg_views_tiktok: null, avg_views_instagram: 40000, created_at: '2025-09-01T00:00:00Z', archived_at: null, benched_until: null, notes: null },
  { id: 'c6', name: 'Oliver Davis', email: 'oliver@example.com', status: 'inactive', tiktok_handle: 'oliverd', instagram_handle: 'oliver.d', avatar_url: null, total_views: 980_000, total_videos: 31, cpm_rate: 3.5, retainer_amount: 300, avg_views_tiktok: 28000, avg_views_instagram: 18000, created_at: '2025-04-15T00:00:00Z', archived_at: null, benched_until: null, notes: null },
  { id: 'c7', name: 'Mia Wilson', email: 'mia@example.com', status: 'pending', tiktok_handle: 'miaw', instagram_handle: null, avatar_url: null, total_views: 450_000, total_videos: 15, cpm_rate: 4.0, retainer_amount: 250, avg_views_tiktok: 30000, avg_views_instagram: null, created_at: '2026-01-10T00:00:00Z', archived_at: null, benched_until: null, notes: null },
  { id: 'c8', name: 'Lucas Brown', email: 'lucas@example.com', status: 'paused', tiktok_handle: 'lucasb', instagram_handle: 'lucas.brown', avatar_url: null, total_views: 1_200_000, total_videos: 36, cpm_rate: 4.5, retainer_amount: 400, avg_views_tiktok: 35000, avg_views_instagram: 22000, created_at: '2025-07-01T00:00:00Z', archived_at: null, benched_until: null, notes: null },
];

const mockROIStats: Record<string, { totalCost: number; cpmEarnings: number; totalRetainers: number; cpv: number }> = {
  c1: { totalCost: 18500, cpmEarnings: 16000, totalRetainers: 2500, cpv: 0.0058 },
  c2: { totalCost: 14600, cpmEarnings: 12600, totalRetainers: 2000, cpv: 0.0052 },
  c3: { totalCost: 15600, cpmEarnings: 12600, totalRetainers: 3000, cpv: 0.0074 },
  c4: { totalCost: 9350, cpmEarnings: 7600, totalRetainers: 1750, cpv: 0.0049 },
  c5: { totalCost: 10550, cpmEarnings: 8800, totalRetainers: 1750, cpv: 0.0066 },
  c6: { totalCost: 4930, cpmEarnings: 3430, totalRetainers: 1500, cpv: 0.0050 },
  c7: { totalCost: 2050, cpmEarnings: 1800, totalRetainers: 250, cpv: 0.0046 },
  c8: { totalCost: 7000, cpmEarnings: 5400, totalRetainers: 1600, cpv: 0.0058 },
};
// ── End Mock Data ──────────────────────────────────────────────────────

// Column configuration
const ALL_COLUMNS = [
  { id: 'creator', label: 'Creator', required: true },
  { id: 'status', label: 'Status', required: false },
  { id: 'socials', label: 'Socials', required: false },
  { id: 'views', label: 'Views', required: false },
  { id: 'videos', label: 'Videos', required: false },
  { id: 'cpm', label: 'CPM Rate', required: false },
  { id: 'retainer', label: 'Retainer', required: false },
  { id: 'totalCost', label: 'Total Cost', required: false },
  { id: 'cpv', label: 'CPV', required: false },
  { id: 'joined', label: 'Joined', required: false },
  { id: 'email', label: 'Email', required: false },
  { id: 'actions', label: 'Actions', required: false },
] as const;

type ColumnId = (typeof ALL_COLUMNS)[number]['id'];

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

const formatCurrency = (num: number | null | undefined) => {
  if (num === null || num === undefined) return '—';
  return `$${num.toFixed(2)}`;
};

const getStatusLabel = (status: string | null | undefined): string => {
  if (!status) return 'Unknown';
  switch (status.toLowerCase()) {
    case 'active': return 'Active';
    case 'inactive': return 'Inactive';
    case 'pending': return 'Pending';
    case 'paused': return 'Paused';
    default: return status;
  }
};

const getStatusColor = (status: string | null | undefined): string => {
  if (!status) return 'bg-zinc-500/20 text-zinc-400';
  switch (status.toLowerCase()) {
    case 'active': return 'bg-emerald-500/20 text-emerald-400';
    case 'inactive': return 'bg-zinc-500/20 text-zinc-400';
    case 'pending': return 'bg-amber-500/20 text-amber-400';
    case 'paused': return 'bg-rose-500/20 text-rose-400';
    default: return 'bg-zinc-500/20 text-zinc-400';
  }
};

// Platform logo paths
const platformLogos: Record<string, string> = {
  tiktok: '/assets/social/tiktok-logo-white.png',
  instagram: '/assets/social/instagram-logo-white.png',
  youtube: '/assets/social/youtube-logo-white.png',
  twitter: '/assets/social/x-logo-light.png',
  x: '/assets/social/x-logo-light.png',
};

// Platform icon component
const PlatformIcon = ({ platform, className = '' }: { platform: string; className?: string }) => {
  if (platform.toLowerCase() === 'instagram') {
    return <IconBrandInstagram className={cn('w-5 h-5 text-white', className)} stroke={2} />;
  }
  const logo = platformLogos[platform.toLowerCase()];
  if (!logo) return <span className="text-base">🔗</span>;
  return (
    <img
      src={logo}
      alt={platform}
      className={cn('w-5 h-5 object-contain', className)}
    />
  );
};

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'paused', label: 'Paused' },
];

export default function CreatorsPage() {
  const router = useRouter();

  // Use mock data instead of hooks
  const creators = mockCreators;
  const loading = false;
  const refetch = () => console.log('refetch (mock)');
  const creatorROIStats = mockROIStats;
  const videosLoading = false;

  // Actions dropdown state
  const [actionsDropdownId, setActionsDropdownId] = useState<string | null>(null);

  // Add creator sheet state
  const [showAddCreator, setShowAddCreator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCreator, setNewCreator] = useState({
    name: '',
    email: '',
    status: 'active' as CreatorStatus,
    tiktok_handle: '',
    instagram_handle: '',
    avg_views_tiktok: '',
    avg_views_instagram: '',
    cpm_rate: '',
    notes: '',
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [showBenched, setShowBenched] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Pending filter state (for apply button)
  const [pendingPlatformFilter, setPendingPlatformFilter] = useState('all');
  const [pendingStatusFilter, setPendingStatusFilter] = useState('all');
  const [pendingShowArchived, setPendingShowArchived] = useState(false);
  const [pendingShowBenched, setPendingShowBenched] = useState(false);

  // Column configuration state
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnId>>(
    new Set(['creator', 'status', 'socials', 'views', 'videos', 'totalCost', 'cpv', 'joined', 'actions'])
  );

  // Edit modal state
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);

  const [columnOrder, setColumnOrder] = useState<ColumnId[]>(ALL_COLUMNS.map((c) => c.id));
  const [showColumnEditor, setShowColumnEditor] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<'views' | 'videos' | 'cpm' | 'retainer' | 'totalCost' | 'cpv' | 'joined' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Get ordered visible columns
  const orderedVisibleColumns = useMemo(() => {
    return columnOrder.filter((id) => visibleColumns.has(id));
  }, [columnOrder, visibleColumns]);

  const toggleColumnVisibility = useCallback((columnId: ColumnId) => {
    const column = ALL_COLUMNS.find((c) => c.id === columnId);
    if (column?.required) return;
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      return next;
    });
  }, []);

  const handleSort = (column: 'views' | 'videos' | 'cpm' | 'retainer' | 'totalCost' | 'cpv' | 'joined') => {
    if (sortBy === column) {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else {
        setSortBy(null);
        setSortOrder('desc');
      }
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Filter and sort creators
  const filteredCreators = useMemo(() => {
    let result = [...creators];

    // Filter out archived creators unless showArchived is true
    if (!showArchived) {
      result = result.filter((c) => !c.archived_at);
    }

    // Filter out benched creators unless showBenched is true
    if (!showBenched) {
      result = result.filter((c) => {
        if (!c.benched_until) return true;
        return new Date(c.benched_until) <= new Date();
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query) ||
          c.tiktok_handle?.toLowerCase().includes(query) ||
          c.instagram_handle?.toLowerCase().includes(query)
      );
    }

    // Platform filter
    if (platformFilter !== 'all') {
      result = result.filter((c) => {
        if (platformFilter === 'tiktok') return !!c.tiktok_handle;
        if (platformFilter === 'instagram') return !!c.instagram_handle;
        return true;
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sorting
    if (sortBy) {
      result.sort((a, b) => {
        let aVal: number;
        let bVal: number;

        switch (sortBy) {
          case 'views':
            aVal = a.total_views;
            bVal = b.total_views;
            break;
          case 'videos':
            aVal = a.total_videos;
            bVal = b.total_videos;
            break;
          case 'cpm':
            aVal = a.cpm_rate || 0;
            bVal = b.cpm_rate || 0;
            break;
          case 'retainer':
            aVal = a.retainer_amount || 0;
            bVal = b.retainer_amount || 0;
            break;
          case 'totalCost':
            aVal = creatorROIStats[a.id]?.totalCost || 0;
            bVal = creatorROIStats[b.id]?.totalCost || 0;
            break;
          case 'cpv':
            aVal = creatorROIStats[a.id]?.cpv || 0;
            bVal = creatorROIStats[b.id]?.cpv || 0;
            break;
          case 'joined':
            aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
            bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
            break;
          default:
            return 0;
        }

        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    return result;
  }, [creators, searchQuery, platformFilter, statusFilter, showArchived, showBenched, sortBy, sortOrder, creatorROIStats]);

  // Pagination
  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);
  const paginatedCreators = filteredCreators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Active filter count
  const activeFilterCount = [
    platformFilter !== 'all',
    statusFilter !== 'all',
    showArchived,
    showBenched,
  ].filter(Boolean).length;

  const hasPendingChanges =
    pendingPlatformFilter !== platformFilter ||
    pendingStatusFilter !== statusFilter ||
    pendingShowArchived !== showArchived ||
    pendingShowBenched !== showBenched;

  const applyFilters = () => {
    setPlatformFilter(pendingPlatformFilter);
    setStatusFilter(pendingStatusFilter);
    setShowArchived(pendingShowArchived);
    setShowBenched(pendingShowBenched);
    setFiltersExpanded(false);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setPendingPlatformFilter('all');
    setPendingStatusFilter('all');
    setPendingShowArchived(false);
    setPendingShowBenched(false);
    setPlatformFilter('all');
    setStatusFilter('all');
    setShowArchived(false);
    setShowBenched(false);
    setCurrentPage(1);
  };

  // Helper to check if a creator is currently benched
  const isBenched = (creator: Creator) => {
    if (!creator.benched_until) return false;
    return new Date(creator.benched_until) > new Date();
  };

  // Helper to check if a creator is archived
  const isArchived = (creator: Creator) => !!creator.archived_at;

  // Handle archive action (no-op mock)
  const handleArchive = async (creator: Creator, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionsDropdownId(null);
    console.log('Archive/unarchive (mock)', creator.id);
  };

  // Handle bench action (no-op mock)
  const handleBench = async (creator: Creator, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionsDropdownId(null);
    console.log('Bench/unbench (mock)', creator.id);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'TikTok', 'Instagram', 'Total Views', 'Total Videos', 'CPM Rate', 'Retainer', 'Total Cost', 'CPV', 'Joined'];
    const rows = filteredCreators.map((c) => {
      const stats = creatorROIStats[c.id];
      return [
        c.name || '',
        c.email || '',
        c.status || '',
        c.tiktok_handle || '',
        c.instagram_handle || '',
        c.total_views.toString(),
        c.total_videos.toString(),
        c.cpm_rate?.toString() || '',
        c.retainer_amount?.toString() || '',
        stats?.totalCost?.toString() || '0',
        stats?.cpv?.toFixed(4) || '0',
        c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : '',
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creators-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAddCreatorForm = () => {
    setNewCreator({
      name: '',
      email: '',
      status: 'active',
      tiktok_handle: '',
      instagram_handle: '',
      avg_views_tiktok: '',
      avg_views_instagram: '',
      cpm_rate: '',
      notes: '',
    });
  };

  const handleCreateCreator = async () => {
    if (!newCreator.name.trim()) return;
    setIsSubmitting(true);
    try {
      // No-op mock
      console.log('Create creator (mock)', newCreator);
      resetAddCreatorForm();
      setShowAddCreator(false);
    } catch (err) {
      console.error('Failed to create creator:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (creator: Creator) => {
    router.push(`/vn/creators/${creator.id}`);
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-400" />
          Creators
        </h1>
        <p className="text-zinc-400 mt-1">
          Manage and view all creators in the platform
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl mb-6">
        <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-md">
            <Input
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className={cn(
              'h-9 px-3 gap-1.5 text-sm rounded-lg inline-flex items-center transition-colors',
              activeFilterCount > 0
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-[10px] text-white flex items-center justify-center font-medium">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                'h-3 w-3 ml-0.5 transition-transform duration-200',
                filtersExpanded ? 'rotate-180' : ''
              )}
            />
          </button>

          {/* Export */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-1.5"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          {/* Column Editor Toggle */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowColumnEditor(!showColumnEditor)}
              className="h-9 gap-1.5"
            >
              <Settings className="h-4 w-4" />
              Columns
            </Button>

            {/* Column Editor Dropdown */}
            <AnimatePresence>
              {showColumnEditor && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowColumnEditor(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-[240px] bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-200">Edit Columns</span>
                        <button
                          onClick={() => setShowColumnEditor(false)}
                          className="p-1 rounded hover:bg-zinc-800 transition-colors"
                        >
                          <X className="w-4 h-4 text-zinc-500" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Drag to reorder, toggle to show/hide</p>
                    </div>
                    <div className="p-2 max-h-[300px] overflow-y-auto">
                      <Reorder.Group
                        axis="y"
                        values={columnOrder}
                        onReorder={setColumnOrder}
                        className="space-y-1"
                      >
                        {columnOrder.map((colId) => {
                          const col = ALL_COLUMNS.find((c) => c.id === colId);
                          if (!col) return null;
                          const isVisible = visibleColumns.has(colId);
                          return (
                            <Reorder.Item
                              key={colId}
                              value={colId}
                              className={cn(
                                'flex items-center gap-2 px-2 py-2 rounded-lg cursor-grab active:cursor-grabbing select-none transition-colors',
                                isVisible ? 'bg-zinc-800/50' : 'bg-transparent'
                              )}
                            >
                              <GripVertical className="w-4 h-4 text-zinc-600" />
                              <button
                                onClick={() => toggleColumnVisibility(colId)}
                                disabled={col.required}
                                className={cn(
                                  'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                                  col.required
                                    ? 'border-zinc-700 bg-zinc-800 cursor-not-allowed'
                                    : isVisible
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-zinc-600 hover:border-zinc-500'
                                )}
                              >
                                {(isVisible || col.required) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </button>
                              <span
                                className={cn(
                                  'text-sm flex-1',
                                  col.required ? 'text-zinc-500' : 'text-zinc-300'
                                )}
                              >
                                {col.label}
                              </span>
                            </Reorder.Item>
                          );
                        })}
                      </Reorder.Group>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Add Creator Button */}
          <Button
            size="sm"
            onClick={() => setShowAddCreator(true)}
            className="h-9 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Creator
          </Button>
        </div>

        {/* Expanded Filters Panel */}
        <AnimatePresence>
          {filtersExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-zinc-800"
            >
              <div className="px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Platform Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500">Platform</label>
                    <Select
                      value={pendingPlatformFilter}
                      onChange={(e) => setPendingPlatformFilter(e.target.value)}
                      options={[
                        { value: 'all', label: 'All platforms' },
                        { value: 'tiktok', label: 'TikTok' },
                        { value: 'instagram', label: 'Instagram' },
                      ]}
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500">Status</label>
                    <Select
                      value={pendingStatusFilter}
                      onChange={(e) => setPendingStatusFilter(e.target.value)}
                      options={[
                        { value: 'all', label: 'All statuses' },
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'paused', label: 'Paused' },
                      ]}
                    />
                  </div>

                  {/* Show Archived Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500">Show Archived</label>
                    <button
                      onClick={() => setPendingShowArchived(!pendingShowArchived)}
                      className={cn(
                        'w-full h-9 px-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-between',
                        pendingShowArchived
                          ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Archive className="w-4 h-4" />
                        Archived
                      </span>
                      {pendingShowArchived && <Check className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Show Benched Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-500">Show Benched</label>
                    <button
                      onClick={() => setPendingShowBenched(!pendingShowBenched)}
                      className={cn(
                        'w-full h-9 px-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-between',
                        pendingShowBenched
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Benched
                      </span>
                      {pendingShowBenched && <Check className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-800">
                  <button
                    onClick={resetAllFilters}
                    disabled={activeFilterCount === 0 && !hasPendingChanges}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset filters
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFiltersExpanded(false)}
                      className="h-8 px-3 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <Button
                      size="sm"
                      onClick={applyFilters}
                      disabled={!hasPendingChanges}
                      className="h-8 px-3 text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        {loading || videosLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 mb-1">No creators found</h3>
            <p className="text-sm text-zinc-500 max-w-sm mb-4">
              {searchQuery || platformFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by adding your first creator.'}
            </p>
            {!searchQuery && platformFilter === 'all' && statusFilter === 'all' && (
              <Button onClick={() => setShowAddCreator(true)} className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Creator
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-zinc-800">
                    {orderedVisibleColumns.map((colId) => {
                      const sortableColumns = ['views', 'videos', 'cpm', 'retainer', 'totalCost', 'cpv', 'joined'];
                      if (sortableColumns.includes(colId)) {
                        return (
                          <TableHead
                            key={colId}
                            className="text-xs text-zinc-500 font-medium text-right cursor-pointer select-none group"
                            onClick={() => handleSort(colId as 'views' | 'videos' | 'cpm' | 'retainer' | 'totalCost' | 'cpv' | 'joined')}
                          >
                            <div className="flex items-center justify-end gap-1">
                              {ALL_COLUMNS.find((c) => c.id === colId)?.label}
                              <span
                                className={cn(
                                  'transition-opacity',
                                  sortBy === colId
                                    ? 'opacity-100'
                                    : 'opacity-0 group-hover:opacity-50'
                                )}
                              >
                                {sortBy === colId && sortOrder === 'asc' ? (
                                  <ChevronUp className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                )}
                              </span>
                            </div>
                          </TableHead>
                        );
                      }
                      return (
                        <TableHead
                          key={colId}
                          className="text-xs text-zinc-500 font-medium"
                        >
                          {ALL_COLUMNS.find((c) => c.id === colId)?.label}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCreators.map((creator) => (
                    <TableRow
                      key={creator.id}
                      className="cursor-pointer hover:bg-zinc-800/50 transition-colors"
                      onClick={() => handleRowClick(creator)}
                    >
                      {orderedVisibleColumns.map((colId) => {
                        if (colId === 'creator') {
                          return (
                            <TableCell key={colId} className="py-3">
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src={creator.avatar_url || undefined}
                                  name={creator.name || 'Creator'}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-zinc-200 truncate">
                                    {creator.name || 'Unnamed Creator'}
                                  </p>
                                  {creator.tiktok_handle && (
                                    <p className="text-xs text-zinc-500 truncate">
                                      @{creator.tiktok_handle}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          );
                        }
                        if (colId === 'status') {
                          return (
                            <TableCell key={colId} className="py-3">
                              <span
                                className={cn(
                                  'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium',
                                  getStatusColor(creator.status)
                                )}
                              >
                                {getStatusLabel(creator.status)}
                              </span>
                            </TableCell>
                          );
                        }
                        if (colId === 'socials') {
                          return (
                            <TableCell key={colId} className="py-3">
                              <div className="flex items-center gap-1.5">
                                {creator.tiktok_handle && (
                                  <span
                                    title={`@${creator.tiktok_handle} • ${formatNumber(creator.avg_views_tiktok || 0)} avg views`}
                                  >
                                    <PlatformIcon platform="tiktok" />
                                  </span>
                                )}
                                {creator.instagram_handle && (
                                  <span
                                    title={`@${creator.instagram_handle} • ${formatNumber(creator.avg_views_instagram || 0)} avg views`}
                                  >
                                    <PlatformIcon platform="instagram" />
                                  </span>
                                )}
                                {!creator.tiktok_handle && !creator.instagram_handle && (
                                  <span className="text-xs text-zinc-600">—</span>
                                )}
                              </div>
                            </TableCell>
                          );
                        }
                        if (colId === 'views') {
                          return (
                            <TableCell key={colId} className="py-3 text-right">
                              <span className="text-sm font-medium text-zinc-200">
                                {formatNumber(creator.total_views)}
                              </span>
                            </TableCell>
                          );
                        }
                        if (colId === 'videos') {
                          return (
                            <TableCell key={colId} className="py-3 text-right">
                              <span className="text-sm font-medium text-zinc-200">
                                {creator.total_videos}
                              </span>
                            </TableCell>
                          );
                        }
                        if (colId === 'cpm') {
                          return (
                            <TableCell key={colId} className="py-3 text-right">
                              <span className="text-sm font-medium text-zinc-200">
                                {formatCurrency(creator.cpm_rate)}
                              </span>
                            </TableCell>
                          );
                        }
                        if (colId === 'retainer') {
                          return (
                            <TableCell key={colId} className="py-3 text-right">
                              <span className="text-sm font-medium text-orange-400">
                                {formatCurrency(creator.retainer_amount)}
                              </span>
                            </TableCell>
                          );
                        }
                        if (colId === 'totalCost') {
                          const stats = creatorROIStats[creator.id];
                          return (
                            <TableCell key={colId} className="py-3 text-right">
                              <span className="text-sm font-medium text-purple-400">
                                ${stats?.totalCost?.toLocaleString() || '0'}
                              </span>
                            </TableCell>
                          );
                        }
                        if (colId === 'cpv') {
                          const stats = creatorROIStats[creator.id];
                          const cpvValue = stats?.cpv || 0;
                          const cpvColor = cpvValue <= 0.005 ? 'text-emerald-400' :
                            cpvValue >= 0.010 ? 'text-red-400' :
                            cpvValue < 0.0075 ? 'text-yellow-400' : 'text-orange-400';
                          return (
                            <TableCell key={colId} className="py-3 text-right">
                              <span className={cn('text-sm font-medium', cpvColor)}>
                                ${cpvValue.toFixed(4)}
                              </span>
                            </TableCell>
                          );
                        }
                        if (colId === 'joined') {
                          return (
                            <TableCell key={colId} className="py-3 text-right">
                              <span className="text-xs text-zinc-500">
                                {creator.created_at
                                  ? new Date(creator.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                  : '—'}
                              </span>
                            </TableCell>
                          );
                        }
                        if (colId === 'email') {
                          return (
                            <TableCell key={colId} className="py-3">
                              <span className="text-xs text-zinc-500 truncate max-w-[150px] block">
                                {creator.email || '—'}
                              </span>
                            </TableCell>
                          );
                        }
                        if (colId === 'actions') {
                          const creatorIsArchived = isArchived(creator);
                          const creatorIsBenched = isBenched(creator);
                          return (
                            <TableCell key={colId} className="py-3">
                              <div className="flex items-center gap-1">
                                {/* Edit button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCreator(creator);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                                  title="Edit creator"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                {/* More actions dropdown */}
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActionsDropdownId(actionsDropdownId === creator.id ? null : creator.id);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                                    title="More actions"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>

                                  {/* Dropdown menu */}
                                  <AnimatePresence>
                                    {actionsDropdownId === creator.id && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-40"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActionsDropdownId(null);
                                          }}
                                        />
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                          transition={{ duration: 0.1 }}
                                          className="absolute right-0 top-full mt-1 w-44 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden"
                                        >
                                          {/* Bench option */}
                                          <button
                                            onClick={(e) => handleBench(creator, e)}
                                            className={cn(
                                              'w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors',
                                              creatorIsBenched
                                                ? 'text-amber-400 hover:bg-amber-500/10'
                                                : 'text-zinc-300 hover:bg-zinc-800'
                                            )}
                                          >
                                            {creatorIsBenched ? (
                                              <>
                                                <Undo2 className="w-4 h-4" />
                                                Unbench
                                              </>
                                            ) : (
                                              <>
                                                <Clock className="w-4 h-4" />
                                                Bench (3 months)
                                              </>
                                            )}
                                          </button>

                                          {/* Archive option */}
                                          <button
                                            onClick={(e) => handleArchive(creator, e)}
                                            className={cn(
                                              'w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors',
                                              creatorIsArchived
                                                ? 'text-orange-400 hover:bg-orange-500/10'
                                                : 'text-zinc-300 hover:bg-zinc-800'
                                            )}
                                          >
                                            {creatorIsArchived ? (
                                              <>
                                                <Undo2 className="w-4 h-4" />
                                                Unarchive
                                              </>
                                            ) : (
                                              <>
                                                <Archive className="w-4 h-4" />
                                                Archive
                                              </>
                                            )}
                                          </button>
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {/* Status indicators */}
                                {(creatorIsArchived || creatorIsBenched) && (
                                  <div className="flex items-center gap-1 ml-1">
                                    {creatorIsBenched && (
                                      <span
                                        className="p-1 rounded bg-amber-500/20 text-amber-400"
                                        title={`Benched until ${new Date(creator.benched_until!).toLocaleDateString()}`}
                                      >
                                        <Clock className="w-3 h-3" />
                                      </span>
                                    )}
                                    {creatorIsArchived && (
                                      <span
                                        className="p-1 rounded bg-orange-500/20 text-orange-400"
                                        title={`Archived on ${new Date(creator.archived_at!).toLocaleDateString()}`}
                                      >
                                        <Archive className="w-3 h-3" />
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          );
                        }
                        return null;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredCreators.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
                <div className="text-xs text-zinc-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredCreators.length)} of{' '}
                  {filteredCreators.length} creators
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-zinc-500">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Creator Modal */}
      <AnimatePresence>
        {editingCreator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingCreator(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl mx-4 relative"
            >
              <button
                onClick={() => setEditingCreator(null)}
                className="absolute -top-2 -right-2 z-10 p-2 bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
              <CreatorForm
                creator={editingCreator}
                onSuccess={() => {
                  setEditingCreator(null);
                  refetch();
                }}
                onDelete={() => {
                  setEditingCreator(null);
                  refetch();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Creator Sheet */}
      <AnimatePresence>
        {showAddCreator && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => {
                if (!isSubmitting) {
                  setShowAddCreator(false);
                  resetAddCreatorForm();
                }
              }}
            />
            {/* Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-100">Add Creator</h2>
                  <p className="text-sm text-zinc-500">Add a new creator to the database</p>
                </div>
                <button
                  onClick={() => {
                    if (!isSubmitting) {
                      setShowAddCreator(false);
                      resetAddCreatorForm();
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-1.5 block">
                      Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      placeholder="e.g. John Doe"
                      value={newCreator.name}
                      onChange={(e) => setNewCreator({ ...newCreator, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-1.5 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={newCreator.email}
                      onChange={(e) => setNewCreator({ ...newCreator, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300 mb-1.5 block">
                      Status
                    </label>
                    <Select
                      value={newCreator.status}
                      onChange={(e) => setNewCreator({ ...newCreator, status: e.target.value as CreatorStatus })}
                      options={statusOptions}
                    />
                  </div>
                </div>

                {/* Social Accounts */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">Social Accounts</h3>
                  <div className="space-y-4">
                    {/* TikTok */}
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform="tiktok" className="w-5 h-5" />
                        <span className="text-sm font-medium text-zinc-300">TikTok</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">Handle</label>
                          <Input
                            placeholder="@username"
                            value={newCreator.tiktok_handle}
                            onChange={(e) => setNewCreator({ ...newCreator, tiktok_handle: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">Avg Views</label>
                          <Input
                            type="number"
                            placeholder="e.g. 50000"
                            value={newCreator.avg_views_tiktok}
                            onChange={(e) => setNewCreator({ ...newCreator, avg_views_tiktok: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Instagram */}
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform="instagram" className="w-5 h-5" />
                        <span className="text-sm font-medium text-zinc-300">Instagram</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">Handle</label>
                          <Input
                            placeholder="@username"
                            value={newCreator.instagram_handle}
                            onChange={(e) => setNewCreator({ ...newCreator, instagram_handle: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">Avg Views</label>
                          <Input
                            type="number"
                            placeholder="e.g. 50000"
                            value={newCreator.avg_views_instagram}
                            onChange={(e) => setNewCreator({ ...newCreator, avg_views_instagram: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">Financial</h3>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">CPM Rate ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 5.00"
                      value={newCreator.cpm_rate}
                      onChange={(e) => setNewCreator({ ...newCreator, cpm_rate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-1.5 block">
                    Notes
                  </label>
                  <textarea
                    placeholder="Any additional notes..."
                    value={newCreator.notes}
                    onChange={(e) => setNewCreator({ ...newCreator, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowAddCreator(false);
                      resetAddCreatorForm();
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateCreator}
                    disabled={!newCreator.name.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Creator
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
