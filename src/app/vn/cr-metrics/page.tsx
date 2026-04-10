"use client";
// @ts-nocheck

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  TrendingUp,
  FileText,
  Activity,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Heart,
  Repeat2,
  MessageCircle,
  Eye,
  Bookmark,
  ArrowUpDown,
  X,
  Target,
} from 'lucide-react';

// ── Inline Types ───────────────────────────────────────────────────
type SocialPlatform = 'twitter' | 'instagram';
type TweetSortBy = 'recent' | 'likes' | 'retweets' | 'views' | 'replies';
type PostSortBy = 'recent' | 'likes' | 'comments' | 'views';

interface CRSocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  display_name: string;
  avatar_url?: string;
  profile_url: string;
}

interface CRSocialMetric {
  id: string;
  account_id: string;
  date: string;
  followers: number;
  following: number;
  posts_count: number;
  total_views: number;
  total_likes: number;
  total_retweets?: number;
  total_comments?: number;
  total_bookmarks?: number;
}

interface CRTweet {
  id: string;
  text: string;
  url: string;
  views: number;
  likes: number;
  retweets: number;
  replies: number;
  bookmarks: number;
  posted_at: string | null;
}

interface CRPost {
  id: string;
  caption: string;
  url: string;
  views: number;
  likes: number;
  comments: number;
  type: string;
  posted_at: string | null;
}

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_ACCOUNTS: CRSocialAccount[] = [
  { id: 'a1', platform: 'twitter', username: 'ContentRewards', display_name: 'Content Rewards', avatar_url: undefined, profile_url: 'https://x.com/ContentRewards' },
  { id: 'a2', platform: 'instagram', username: 'contentrewards', display_name: 'Content Rewards', avatar_url: undefined, profile_url: 'https://instagram.com/contentrewards' },
];

const MOCK_METRICS: CRSocialMetric[] = [
  ...Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return [
      { id: `m-tw-${i}`, account_id: 'a1', date: d.toISOString().split('T')[0], followers: 45200 + i * 50, following: 320, posts_count: 1240 + i * 3, total_views: 2340000 + i * 45000, total_likes: 89000 + i * 1200, total_retweets: 12400 + i * 200, total_comments: 5600 + i * 100, total_bookmarks: 3200 + i * 80 },
      { id: `m-ig-${i}`, account_id: 'a2', date: d.toISOString().split('T')[0], followers: 32100 + i * 30, following: 180, posts_count: 456 + i * 2, total_views: 1890000 + i * 32000, total_likes: 67000 + i * 900, total_retweets: 0, total_comments: 4300 + i * 70, total_bookmarks: 0 },
    ];
  }).flat(),
];

const MOCK_TWEETS: CRTweet[] = [
  { id: 't1', text: 'Excited to announce our new creator partnership program! Apply now at contentrewards.cc', url: 'https://x.com/ContentRewards/status/1', views: 45200, likes: 1230, retweets: 342, replies: 89, bookmarks: 156, posted_at: '2026-04-08T14:30:00Z' },
  { id: 't2', text: 'Our creators earned $2.5M in rewards last month. The future of content monetization is here.', url: 'https://x.com/ContentRewards/status/2', views: 87600, likes: 3450, retweets: 876, replies: 234, bookmarks: 432, posted_at: '2026-04-06T10:15:00Z' },
  { id: 't3', text: 'Thread: How to maximize your CPM rates as a creator (1/8)', url: 'https://x.com/ContentRewards/status/3', views: 123400, likes: 5670, retweets: 1234, replies: 456, bookmarks: 789, posted_at: '2026-04-03T16:00:00Z' },
  { id: 't4', text: 'New feature: Real-time analytics dashboard for all creators. Check it out!', url: 'https://x.com/ContentRewards/status/4', views: 34500, likes: 890, retweets: 234, replies: 67, bookmarks: 123, posted_at: '2026-04-01T09:00:00Z' },
  { id: 't5', text: 'Congratulations to our top creator @danielm for hitting 1M views this week!', url: 'https://x.com/ContentRewards/status/5', views: 56700, likes: 2340, retweets: 567, replies: 123, bookmarks: 234, posted_at: '2026-03-28T12:00:00Z' },
];

const MOCK_POSTS: CRPost[] = [
  { id: 'p1', caption: 'Behind the scenes of our creator meetup in LA. Amazing energy!', url: 'https://instagram.com/p/1', views: 23400, likes: 3456, comments: 234, type: 'carousel', posted_at: '2026-04-07T18:00:00Z' },
  { id: 'p2', caption: 'Tips for growing your audience organically. Save this for later!', url: 'https://instagram.com/p/2', views: 45600, likes: 5670, comments: 456, type: 'reel', posted_at: '2026-04-05T14:00:00Z' },
  { id: 'p3', caption: 'Welcome to Content Rewards. Here\'s how it works.', url: 'https://instagram.com/p/3', views: 12300, likes: 1890, comments: 123, type: 'post', posted_at: '2026-04-02T11:00:00Z' },
];

const MOCK_SUMMARY = {
  totalFollowers: 77300,
  totalViews: 4230000,
};

const MOCK_CONTENT_ENGAGEMENT = {
  totalViews: 4230000,
  totalLikes: 156000,
  totalRetweets: 12400,
  totalComments: 9900,
  contentCount: 8,
};

// ── Helper Functions ───────────────────────────────────────────────
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const dateRangeOptions = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'All Time' },
];

const platformOptions: { value: SocialPlatform | 'all'; label: string }[] = [
  { value: 'all', label: 'All Platforms' },
  { value: 'twitter', label: 'X (Twitter)' },
  { value: 'instagram', label: 'Instagram' },
];

const tweetSortOptions: { value: TweetSortBy; label: string; icon: React.ReactNode }[] = [
  { value: 'recent', label: 'Most Recent', icon: <Clock className="w-4 h-4" /> },
  { value: 'likes', label: 'Most Likes', icon: <Heart className="w-4 h-4" /> },
  { value: 'retweets', label: 'Most Retweets', icon: <Repeat2 className="w-4 h-4" /> },
  { value: 'views', label: 'Most Views', icon: <Eye className="w-4 h-4" /> },
  { value: 'replies', label: 'Most Replies', icon: <MessageCircle className="w-4 h-4" /> },
];

const postSortOptions: { value: PostSortBy; label: string; icon: React.ReactNode }[] = [
  { value: 'recent', label: 'Most Recent', icon: <Clock className="w-4 h-4" /> },
  { value: 'likes', label: 'Most Likes', icon: <Heart className="w-4 h-4" /> },
  { value: 'comments', label: 'Most Comments', icon: <MessageCircle className="w-4 h-4" /> },
  { value: 'views', label: 'Most Views', icon: <Eye className="w-4 h-4" /> },
];

function formatExact(num: number): string {
  return num.toLocaleString();
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getProgressGradient(current: number, threshold: number): string {
  const progress = Math.min(current / threshold, 1);
  if (progress >= 1) return 'bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30';
  if (progress >= 0.75) return 'bg-gradient-to-br from-lime-500/20 via-lime-600/10 to-transparent border-lime-500/30';
  if (progress >= 0.5) return 'bg-gradient-to-br from-yellow-500/20 via-yellow-600/10 to-transparent border-yellow-500/30';
  if (progress >= 0.25) return 'bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30';
  return 'bg-gradient-to-br from-red-500/20 via-red-600/10 to-transparent border-red-500/30';
}

function getProgressColor(current: number, threshold: number): string {
  const progress = Math.min(current / threshold, 1);
  if (progress >= 1) return 'text-emerald-400';
  if (progress >= 0.75) return 'text-lime-400';
  if (progress >= 0.5) return 'text-yellow-400';
  if (progress >= 0.25) return 'text-orange-400';
  return 'text-red-400';
}

function formatGoal(value: number): string {
  if (value >= 1000000) {
    const millions = value / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return value.toString();
}

function parseGoalInput(input: string): number | null {
  const cleaned = input.trim().toUpperCase();
  if (!cleaned) return null;
  const mMatch = cleaned.match(/^([\d.]+)\s*M$/);
  if (mMatch) { const value = parseFloat(mMatch[1]) * 1000000; return isNaN(value) ? null : Math.round(value); }
  const kMatch = cleaned.match(/^([\d.]+)\s*K$/);
  if (kMatch) { const value = parseFloat(kMatch[1]) * 1000; return isNaN(value) ? null : Math.round(value); }
  const value = parseInt(cleaned.replace(/,/g, ''), 10);
  return isNaN(value) ? null : value;
}

// ── Account Card ───────────────────────────────────────────────────
function AccountCard({ account, latestMetric }: { account: CRSocialAccount; latestMetric?: CRSocialMetric }) {
  const PlatformIcon = account.platform === 'twitter' ? TwitterIcon : InstagramIcon;
  return (
    <div className="rounded-xl bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent border border-orange-500/20 p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-zinc-800 overflow-hidden">
          <PlatformIcon className="w-6 h-6 text-zinc-400" />
        </div>
        <div className="flex-shrink-0 min-w-0">
          <div className="flex items-center gap-1.5">
            <PlatformIcon className="w-4 h-4 text-orange-400" />
            <h3 className="text-base font-semibold text-zinc-100 truncate">{account.display_name || account.username}</h3>
          </div>
          <a href={account.profile_url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-orange-400 transition-colors inline-flex items-center gap-1">
            @{account.username}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        {latestMetric && (
          <div className="flex items-center gap-6 ml-auto">
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-100">{formatExact(latestMetric.followers)}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-100">{formatExact(latestMetric.following)}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Following</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-100">{formatExact(latestMetric.posts_count)}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{account.platform === 'twitter' ? 'Tweets' : 'Posts'}</p>
            </div>
            {latestMetric.total_views > 0 && (
              <>
                <div className="w-px h-8 bg-zinc-700" />
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-100">{formatExact(latestMetric.total_views)}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center justify-center gap-1"><Eye className="w-3 h-3" /> Views</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-100">{formatExact(latestMetric.total_likes || 0)}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center justify-center gap-1"><Heart className="w-3 h-3 text-red-400/60" /> Likes</p>
                </div>
              </>
            )}
          </div>
        )}
        {!latestMetric && <p className="text-sm text-zinc-500 ml-auto">No metrics yet</p>}
      </div>
    </div>
  );
}

// ── Content Card ───────────────────────────────────────────────────
function ContentCard({ type, tweet, post, index = 0 }: { type: 'tweet' | 'post'; tweet?: CRTweet; post?: CRPost; index?: number }) {
  const isTweet = type === 'tweet' && tweet;
  const isPost = type === 'post' && post;
  const url = isTweet ? tweet.url : isPost ? post.url : '#';
  const text = isTweet ? tweet.text : isPost ? post.caption : '';
  const views = isTweet ? tweet.views : isPost ? post.views : 0;
  const likes = isTweet ? tweet.likes : isPost ? post.likes : 0;
  const comments = isTweet ? tweet.replies : isPost ? post.comments : 0;
  const bookmarks = isTweet ? tweet.bookmarks : 0;
  const retweets = isTweet ? tweet.retweets : 0;
  const postedAt = isTweet ? tweet.posted_at : isPost ? post.posted_at : null;
  const postType = isPost ? post.type : null;
  const PlatformIcon = isTweet ? TwitterIcon : InstagramIcon;
  const platformName = isTweet ? 'X' : 'IG';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}>
      <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden group h-full flex flex-col hover:border-orange-500/50 hover:bg-zinc-800/50 transition-all duration-200">
          <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-zinc-700/50">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isTweet ? 'bg-zinc-700' : 'bg-gradient-to-br from-purple-600 to-pink-500'}`}>
                <PlatformIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-medium text-zinc-400">{platformName}</span>
              {postType && postType !== 'post' && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-orange-500/20 text-orange-400 uppercase">{postType}</span>
              )}
            </div>
            {views > 0 && (
              <div className="flex items-center gap-1 text-zinc-300">
                <Eye className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{formatExact(views)}</span>
              </div>
            )}
          </div>
          <div className="p-3 flex-1 flex flex-col">
            <p className="text-sm text-zinc-300 line-clamp-3 group-hover:text-orange-100 transition-colors mb-3 flex-1">{text || 'No caption'}</p>
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1" title="Likes"><Heart className="w-3 h-3 text-red-400" /><span className="font-semibold text-zinc-100">{formatExact(likes)}</span></span>
                {isTweet ? (
                  <>
                    <span className="flex items-center gap-1" title="Retweets"><Repeat2 className="w-3 h-3 text-emerald-400" /><span className="font-semibold text-zinc-100">{formatExact(retweets)}</span></span>
                    <span className="flex items-center gap-1" title="Replies"><MessageCircle className="w-3 h-3 text-blue-400" /><span className="font-semibold text-zinc-100">{formatExact(comments)}</span></span>
                    {bookmarks > 0 && (<span className="flex items-center gap-1" title="Bookmarks"><Bookmark className="w-3 h-3 text-yellow-400" /><span className="font-semibold text-zinc-100">{formatExact(bookmarks)}</span></span>)}
                  </>
                ) : (
                  <span className="flex items-center gap-1" title="Comments"><MessageCircle className="w-3 h-3 text-blue-400" /><span className="font-semibold text-zinc-100">{formatExact(comments)}</span></span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 whitespace-nowrap">{formatRelativeTime(postedAt)}</span>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function CRMetricsPage() {
  const [days, setDays] = useState(30);
  const [platform, setPlatform] = useState<SocialPlatform | 'all'>('all');
  const [tweetSort, setTweetSort] = useState<TweetSortBy>('recent');
  const [postSort, setPostSort] = useState<PostSortBy>('recent');
  const [daysDropdownOpen, setDaysDropdownOpen] = useState(false);
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [tweetSortDropdownOpen, setTweetSortDropdownOpen] = useState(false);
  const [postSortDropdownOpen, setPostSortDropdownOpen] = useState(false);
  const [contentTab, setContentTab] = useState<'all' | 'tweets' | 'posts'>('all');
  const [accountsExpanded, setAccountsExpanded] = useState(true);

  const [viewsThreshold, setViewsThreshold] = useState(2500000);
  const [viewsGoalModalOpen, setViewsGoalModalOpen] = useState(false);
  const [viewsGoalInput, setViewsGoalInput] = useState('');
  const [contentItemsThreshold, setContentItemsThreshold] = useState(50);
  const [contentGoalModalOpen, setContentGoalModalOpen] = useState(false);
  const [contentGoalInput, setContentGoalInput] = useState('');

  const accounts = MOCK_ACCOUNTS;
  const metrics = MOCK_METRICS;
  const tweets = MOCK_TWEETS;
  const posts = MOCK_POSTS;
  const summary = MOCK_SUMMARY;
  const contentEngagement = MOCK_CONTENT_ENGAGEMENT;
  const loading = false;

  const latestMetricsByAccount = useMemo(() => {
    const map = new Map<string, CRSocialMetric>();
    metrics.forEach((m) => {
      const existing = map.get(m.account_id);
      if (!existing || m.date > existing.date) {
        map.set(m.account_id, m);
      }
    });
    return map;
  }, [metrics]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">CR Metrics</h1>
          <p className="text-zinc-400 mt-1 hidden sm:block">Track Content Rewards official social media performance</p>
        </div>
        <div className="relative flex flex-wrap items-center gap-3">
          {/* Platform Filter */}
          <div className="relative">
            <button
              onClick={() => setPlatformDropdownOpen(!platformDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-colors"
            >
              {platformOptions.find((o) => o.value === platform)?.label}
              <ChevronDown className={`w-4 h-4 transition-transform ${platformDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {platformDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPlatformDropdownOpen(false)} />
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1">
                  {platformOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setPlatform(option.value); setPlatformDropdownOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors ${platform === option.value ? 'text-orange-400 bg-zinc-700/50' : 'text-zinc-300'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <button
              onClick={() => setDaysDropdownOpen(!daysDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-colors"
            >
              {dateRangeOptions.find((o) => o.value === days)?.label}
              <ChevronDown className={`w-4 h-4 transition-transform ${daysDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {daysDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDaysDropdownOpen(false)} />
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-32 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1">
                  {dateRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setDays(option.value); setDaysDropdownOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors ${days === option.value ? 'text-orange-400 bg-zinc-700/50' : 'text-zinc-300'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Refresh */}
          <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors" title="Refresh social metrics">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`stats-${days}-${platform}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {/* Total Followers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">Total Followers</p>
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400"><Users className="w-5 h-5" /></div>
              </div>
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <p className="text-3xl font-bold text-zinc-100">{formatExact(summary.totalFollowers)}</p>
                <p className="text-xs text-zinc-600 mt-1 invisible">placeholder</p>
              </div>
            </div>
          </motion.div>

          {/* Total Views with Goal */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
            <div className={`rounded-xl border p-6 h-full flex flex-col transition-all duration-500 ${getProgressGradient(contentEngagement.totalViews, viewsThreshold)}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">Total Views</p>
                <button
                  onClick={() => { setViewsGoalInput(formatGoal(viewsThreshold)); setViewsGoalModalOpen(true); }}
                  className="p-2 rounded-lg bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                  title={`Set views goal (current: ${formatGoal(viewsThreshold)})`}
                >
                  <Target className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <p className={`text-3xl font-bold ${getProgressColor(contentEngagement.totalViews, viewsThreshold)}`}>
                  {formatExact(contentEngagement.totalViews)}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {contentEngagement.totalViews >= viewsThreshold
                    ? 'Goal reached!'
                    : `Goal: ${formatGoal(viewsThreshold)} (${Math.round((contentEngagement.totalViews / viewsThreshold) * 100)}%)`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Total Likes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">Total Likes</p>
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400"><Heart className="w-5 h-5" /></div>
              </div>
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <p className="text-3xl font-bold text-zinc-100">{formatExact(contentEngagement.totalLikes)}</p>
                <p className="text-xs text-zinc-600 mt-1 invisible">placeholder</p>
              </div>
            </div>
          </motion.div>

          {/* Retweets */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">Retweets</p>
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400"><Repeat2 className="w-5 h-5" /></div>
              </div>
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <p className="text-3xl font-bold text-zinc-100">{formatExact(contentEngagement.totalRetweets)}</p>
                <p className="text-xs text-zinc-600 mt-1 invisible">placeholder</p>
              </div>
            </div>
          </motion.div>

          {/* Comments */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">Comments</p>
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400"><MessageCircle className="w-5 h-5" /></div>
              </div>
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <p className="text-3xl font-bold text-zinc-100">{formatExact(contentEngagement.totalComments)}</p>
                <p className="text-xs text-zinc-600 mt-1 invisible">placeholder</p>
              </div>
            </div>
          </motion.div>

          {/* Content Items with Goal */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
            <div className={`rounded-xl border p-6 h-full flex flex-col transition-all duration-500 ${getProgressGradient(contentEngagement.contentCount, contentItemsThreshold)}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-400">Content Items</p>
                <button
                  onClick={() => { setContentGoalInput(contentItemsThreshold.toString()); setContentGoalModalOpen(true); }}
                  className="p-2 rounded-lg bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                  title={`Set content goal (current: ${contentItemsThreshold})`}
                >
                  <Target className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 flex-1 flex flex-col justify-between">
                <p className={`text-3xl font-bold ${getProgressColor(contentEngagement.contentCount, contentItemsThreshold)}`}>
                  {formatExact(contentEngagement.contentCount)}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {contentEngagement.contentCount >= contentItemsThreshold
                    ? 'Goal reached!'
                    : `Goal: ${contentItemsThreshold} (${Math.round((contentEngagement.contentCount / contentItemsThreshold) * 100)}%)`}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Views Goal Modal */}
      <AnimatePresence>
        {viewsGoalModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={() => setViewsGoalModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm">
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><Target className="w-5 h-5 text-orange-400" /><h3 className="text-lg font-semibold text-zinc-100">Set Views Goal</h3></div>
                  <button onClick={() => setViewsGoalModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-100 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <p className="text-sm text-zinc-400 mb-4">Enter your views goal. When reached, the card will turn green.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">Goal (e.g., 2.5M, 500K, or 1000000)</label>
                    <input type="text" value={viewsGoalInput} onChange={(e) => setViewsGoalInput(e.target.value)} placeholder="2.5M" autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') { const parsed = parseGoalInput(viewsGoalInput); if (parsed && parsed > 0) { setViewsThreshold(parsed); setViewsGoalModalOpen(false); } } }}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-lg font-medium placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setViewsGoalModalOpen(false)} className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors">Cancel</button>
                    <button onClick={() => { const parsed = parseGoalInput(viewsGoalInput); if (parsed && parsed > 0) { setViewsThreshold(parsed); setViewsGoalModalOpen(false); } }} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">Save Goal</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content Items Goal Modal */}
      <AnimatePresence>
        {contentGoalModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={() => setContentGoalModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm">
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><Target className="w-5 h-5 text-orange-400" /><h3 className="text-lg font-semibold text-zinc-100">Set Content Goal</h3></div>
                  <button onClick={() => setContentGoalModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-100 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <p className="text-sm text-zinc-400 mb-4">Enter your content items goal. When reached, the card will turn green.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">Goal (number of content items)</label>
                    <input type="number" value={contentGoalInput} onChange={(e) => setContentGoalInput(e.target.value)} placeholder="50" autoFocus min="1"
                      onKeyDown={(e) => { if (e.key === 'Enter') { const parsed = parseInt(contentGoalInput, 10); if (parsed && parsed > 0) { setContentItemsThreshold(parsed); setContentGoalModalOpen(false); } } }}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-lg font-medium placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setContentGoalModalOpen(false)} className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors">Cancel</button>
                    <button onClick={() => { const parsed = parseInt(contentGoalInput, 10); if (parsed && parsed > 0) { setContentItemsThreshold(parsed); setContentGoalModalOpen(false); } }} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">Save Goal</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Account Cards - Collapsible */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl mb-8 overflow-hidden">
        <button
          onClick={() => setAccountsExpanded(!accountsExpanded)}
          className="w-full p-4 flex items-center justify-between border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors"
        >
          <div className="text-left">
            <h2 className="text-lg font-semibold text-zinc-100">Tracked Accounts</h2>
            <p className="text-xs text-zinc-500 mt-1">{accounts.length} accounts being tracked</p>
          </div>
          {accountsExpanded ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
        </button>
        <AnimatePresence>
          {accountsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-3">
                {accounts.map((account) => (
                  <AccountCard key={account.id} account={account} latestMetric={latestMetricsByAccount.get(account.id)} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Content Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <h2 className="text-xl font-semibold text-zinc-100">Recent Content</h2>
            <div className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-lg p-1">
              <button onClick={() => setContentTab('all')} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${contentTab === 'all' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
                All ({tweets.length + posts.length})
              </button>
              <button onClick={() => setContentTab('tweets')} className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${contentTab === 'tweets' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
                <TwitterIcon className="w-3.5 h-3.5" /> Tweets ({tweets.length})
              </button>
              <button onClick={() => setContentTab('posts')} className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${contentTab === 'posts' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
                <InstagramIcon className="w-3.5 h-3.5" /> Posts ({posts.length})
              </button>
            </div>
          </div>

          {(tweets.length > 0 || posts.length > 0) && (
            <div className="relative">
              {(contentTab === 'all' || contentTab === 'tweets') && (
                <button
                  onClick={() => setTweetSortDropdownOpen(!tweetSortDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" /> Sort
                  <ChevronDown className={`w-4 h-4 transition-transform ${tweetSortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              )}
              {contentTab === 'posts' && (
                <button
                  onClick={() => setPostSortDropdownOpen(!postSortDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" /> Sort
                  <ChevronDown className={`w-4 h-4 transition-transform ${postSortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              )}
              {tweetSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setTweetSortDropdownOpen(false)} />
                  <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1">
                    {tweetSortOptions.map((option) => (
                      <button key={option.value} onClick={() => { setTweetSort(option.value); setTweetSortDropdownOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors flex items-center gap-2 ${tweetSort === option.value ? 'text-orange-400 bg-zinc-700/50' : 'text-zinc-300'}`}
                      >
                        {option.icon} {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {postSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPostSortDropdownOpen(false)} />
                  <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1">
                    {postSortOptions.map((option) => (
                      <button key={option.value} onClick={() => { setPostSort(option.value); setPostSortDropdownOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors flex items-center gap-2 ${postSort === option.value ? 'text-orange-400 bg-zinc-700/50' : 'text-zinc-300'}`}
                      >
                        {option.icon} {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {(contentTab === 'all' || contentTab === 'tweets') && tweets.slice(0, contentTab === 'all' ? 12 : undefined).map((tweet, idx) => (
            <ContentCard key={`tweet-${tweet.id}`} type="tweet" tweet={tweet} index={idx} />
          ))}
          {(contentTab === 'all' || contentTab === 'posts') && posts.slice(0, contentTab === 'all' ? 12 : undefined).map((post, idx) => (
            <ContentCard key={`post-${post.id}`} type="post" post={post} index={idx + (contentTab === 'all' ? tweets.length : 0)} />
          ))}
        </div>
      </div>
    </div>
  );
}
