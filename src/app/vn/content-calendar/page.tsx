"use client";
// @ts-nocheck

import { useState, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  Plus,
  RefreshCw,
  ChevronDown,
  Calendar,
  Filter,
} from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { CalendarView } from '@/components/vn/features/content-calendar/calendar-view';
import { PostFormModal } from '@/components/vn/features/content-calendar/post-form-modal';

type ScheduledPostPlatform = 'twitter' | 'instagram';
type ScheduledPostStatus = 'draft' | 'scheduled' | 'published' | 'archived';

interface ScheduledPost {
  id: string;
  platform: ScheduledPostPlatform;
  status: ScheduledPostStatus;
  content: string;
  scheduled_at: string;
  published_at?: string;
  account_id?: string;
  created_at: string;
}

interface ScheduledPostFilters {
  platform?: ScheduledPostPlatform | 'all';
  status?: ScheduledPostStatus | 'all';
}

// Twitter/X icon
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Instagram icon
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const platformOptions: { value: ScheduledPostPlatform | 'all'; label: string; icon?: React.ReactNode }[] = [
  { value: 'all', label: 'All Platforms' },
  { value: 'twitter', label: 'Twitter', icon: <TwitterIcon className="w-4 h-4" /> },
  { value: 'instagram', label: 'Instagram', icon: <InstagramIcon className="w-4 h-4" /> },
];

const statusOptions: { value: ScheduledPostStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

// --- MOCK DATA ---
const MOCK_POSTS: ScheduledPost[] = [
  { id: 'p1', platform: 'twitter', status: 'scheduled', content: 'Exciting news! Our creator rewards program just hit 1000 members. Join now and start earning!', scheduled_at: '2026-04-12T14:00:00Z', account_id: 'acc1', created_at: '2026-04-08T10:00:00Z' },
  { id: 'p2', platform: 'instagram', status: 'draft', content: 'Behind the scenes look at our latest campaign shoot with top creators.', scheduled_at: '2026-04-13T10:00:00Z', account_id: 'acc2', created_at: '2026-04-08T11:00:00Z' },
  { id: 'p3', platform: 'twitter', status: 'published', content: 'New feature drop: Real-time analytics dashboard for all creators. Check it out!', scheduled_at: '2026-04-05T16:00:00Z', published_at: '2026-04-05T16:01:00Z', account_id: 'acc1', created_at: '2026-04-03T09:00:00Z' },
  { id: 'p4', platform: 'instagram', status: 'scheduled', content: 'Meet our top creator of the month! Amazing content and incredible engagement.', scheduled_at: '2026-04-15T12:00:00Z', account_id: 'acc2', created_at: '2026-04-09T08:00:00Z' },
  { id: 'p5', platform: 'twitter', status: 'draft', content: 'Tips for maximizing your content rewards earnings this month.', scheduled_at: '2026-04-14T18:00:00Z', account_id: 'acc1', created_at: '2026-04-09T14:00:00Z' },
  { id: 'p6', platform: 'twitter', status: 'archived', content: 'Last month recap: record-breaking payouts to our creator community!', scheduled_at: '2026-03-30T10:00:00Z', published_at: '2026-03-30T10:00:00Z', account_id: 'acc1', created_at: '2026-03-28T10:00:00Z' },
];

const MOCK_ACCOUNTS = [
  { id: 'acc1', name: '@contentrewards', platform: 'twitter' },
  { id: 'acc2', name: '@contentrewardss', platform: 'instagram' },
];

export default function ContentCalendarPage() {
  const [filters, setFilters] = useState<ScheduledPostFilters>({
    platform: 'all',
    status: 'all',
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Mock data - no hooks
  const posts = MOCK_POSTS;
  const loading = false;
  const error: string | null = null;
  const refetch = () => {};
  const createPost = async (_data: any) => {};
  const updatePost = async (_data: any) => {};
  const deletePost = async (_id: string) => {};
  const creating = false;
  const updating = false;
  const deleting = false;
  const accounts = MOCK_ACCOUNTS;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePostClick = (post: ScheduledPost) => {
    setEditingPost(post);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPost(null);
  };

  const handleSave = async (data: any) => {
    handleCloseModal();
  };

  const handleDelete = async () => {
    if (editingPost) {
      handleCloseModal();
    }
  };

  // Stats summary
  const stats = useMemo(() => {
    const total = posts.length;
    const draft = posts.filter((p) => p.status === 'draft').length;
    const scheduled = posts.filter((p) => p.status === 'scheduled').length;
    const published = posts.filter((p) => p.status === 'published').length;
    const twitter = posts.filter((p) => p.platform === 'twitter').length;
    const instagram = posts.filter((p) => p.platform === 'instagram').length;

    return { total, draft, scheduled, published, twitter, instagram };
  }, [posts]);

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-orange-400" />
            Content Calendar
          </h1>
          <p className="text-zinc-400 mt-1 hidden sm:block">
            Plan and schedule posts for @contentrewards and @contentrewardss
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Platform Filter */}
          <div className="relative">
            <button
              onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-colors"
            >
              {platformOptions.find((o) => o.value === filters.platform)?.icon}
              {platformOptions.find((o) => o.value === filters.platform)?.label}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${platformDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {platformDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setPlatformDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1">
                  {platformOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilters((f) => ({ ...f, platform: option.value }));
                        setPlatformDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors flex items-center gap-2 ${
                        filters.platform === option.value
                          ? 'text-orange-400 bg-zinc-700/50'
                          : 'text-zinc-300'
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {statusOptions.find((o) => o.value === filters.status)?.label}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {statusDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setStatusDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-36 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilters((f) => ({ ...f, status: option.value }));
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors ${
                        filters.status === option.value
                          ? 'text-orange-400 bg-zinc-700/50'
                          : 'text-zinc-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={refetch}
            disabled={loading}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            title="Refresh posts"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Create Post */}
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Post
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">{stats.total}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Draft</p>
          <p className="text-2xl font-bold text-zinc-400 mt-1">{stats.draft}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Scheduled</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">{stats.scheduled}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.published}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-blue-400 uppercase tracking-wider flex items-center gap-1">
            <TwitterIcon className="w-3 h-3" /> Twitter
          </p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">{stats.twitter}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-pink-400 uppercase tracking-wider flex items-center gap-1">
            <InstagramIcon className="w-3 h-3" /> Instagram
          </p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">{stats.instagram}</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Calendar View */}
      {!loading && !error && (
        <CalendarView
          posts={posts}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onPostClick={handlePostClick}
        />
      )}

      {/* Create/Edit Modal */}
      <PostFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={editingPost ? handleDelete : undefined}
        post={editingPost}
        accounts={accounts}
        initialDate={selectedDate || undefined}
        saving={creating || updating}
        deleting={deleting}
      />
    </PageContainer>
  );
}
