"use client";
// @ts-nocheck

import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  Check,
  X,
  ExternalLink,
  Mail,
  Calendar,
  Link2,
  MousePointerClick,
  UserCheck,
  Copy,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Input } from '@/components/vn/ui/input';
import { Avatar } from '@/components/vn/ui/avatar';
import { Skeleton } from '@/components/vn/ui/skeleton';
import { Button } from '@/components/vn/ui/button';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  referralCode: string | null;
  totalReferrals: number;
  referralClicks: number;
  accountType: string | null;
  onboardingCompleted: boolean | null;
  createdAt: string;
  referredById: string | null;
  whopUserId: string | null;
}

interface SignupChartData {
  date: string;
  signups: number;
  cumulative: number;
}

interface AccountTypeData {
  name: string;
  value: number;
  color: string;
}

interface TopReferrer {
  id: string;
  name: string | null;
  email: string | null;
  referralCode: string | null;
  totalReferrals: number;
  referralClicks: number;
}

interface ReferralChartData {
  date: string;
  referrals: number;
  cumulative: number;
}

interface Stats {
  totalUsers: number;
  totalCreators: number;
  completedOnboarding: number;
  totalReferrals: number;
  totalClicks: number;
  referredUsers: number;
  conversionRate: string;
  signupsByDay: Record<string, number>;
  signupsChartData: SignupChartData[];
  referralsChartData: ReferralChartData[];
  accountTypeBreakdown: AccountTypeData[];
  topReferrers: TopReferrer[];
}

type TimeframeOption = 'today' | '7days' | '30days' | 'lifetime';

interface ReferralUser {
  id: string;
  status: string;
  profile?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

const TIMEFRAME_OPTIONS: { value: TimeframeOption; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: '7 days' },
  { value: '30days', label: '30 days' },
  { value: 'lifetime', label: 'All time' },
];

// --- MOCK DATA ---
const MOCK_USERS: User[] = [
  { id: 'u1', email: 'alice@example.com', name: 'Alice Johnson', username: 'alicej', avatarUrl: null, referralCode: 'ALICE10', totalReferrals: 12, referralClicks: 45, accountType: 'creator', onboardingCompleted: true, createdAt: '2026-03-15T10:00:00Z', referredById: null, whopUserId: 'whop_1' },
  { id: 'u2', email: 'bob@example.com', name: 'Bob Smith', username: 'bobs', avatarUrl: null, referralCode: 'BOB20', totalReferrals: 8, referralClicks: 30, accountType: 'creator', onboardingCompleted: true, createdAt: '2026-03-18T14:30:00Z', referredById: 'u1', whopUserId: 'whop_2' },
  { id: 'u3', email: 'carol@example.com', name: 'Carol Davis', username: 'carold', avatarUrl: null, referralCode: 'CAROL5', totalReferrals: 5, referralClicks: 20, accountType: 'brand', onboardingCompleted: true, createdAt: '2026-03-20T09:15:00Z', referredById: null, whopUserId: null },
  { id: 'u4', email: 'dave@example.com', name: 'Dave Wilson', username: 'davew', avatarUrl: null, referralCode: null, totalReferrals: 0, referralClicks: 0, accountType: 'creator', onboardingCompleted: false, createdAt: '2026-03-25T16:00:00Z', referredById: 'u1', whopUserId: null },
  { id: 'u5', email: 'eve@example.com', name: 'Eve Martinez', username: 'evem', avatarUrl: null, referralCode: 'EVE15', totalReferrals: 3, referralClicks: 10, accountType: 'creator', onboardingCompleted: true, createdAt: '2026-03-28T11:45:00Z', referredById: 'u2', whopUserId: 'whop_5' },
  { id: 'u6', email: 'frank@example.com', name: 'Frank Lee', username: 'frankl', avatarUrl: null, referralCode: null, totalReferrals: 0, referralClicks: 0, accountType: 'brand', onboardingCompleted: false, createdAt: '2026-04-01T08:00:00Z', referredById: null, whopUserId: null },
  { id: 'u7', email: 'grace@example.com', name: 'Grace Kim', username: 'gracek', avatarUrl: null, referralCode: 'GRACE7', totalReferrals: 7, referralClicks: 25, accountType: 'creator', onboardingCompleted: true, createdAt: '2026-04-02T13:20:00Z', referredById: 'u1', whopUserId: 'whop_7' },
  { id: 'u8', email: 'henry@example.com', name: 'Henry Brown', username: 'henryb', avatarUrl: null, referralCode: null, totalReferrals: 0, referralClicks: 0, accountType: 'creator', onboardingCompleted: true, createdAt: '2026-04-03T10:00:00Z', referredById: 'u5', whopUserId: 'whop_8' },
];

const MOCK_STATS: Stats = {
  totalUsers: 847,
  totalCreators: 612,
  completedOnboarding: 534,
  totalReferrals: 156,
  totalClicks: 892,
  referredUsers: 134,
  conversionRate: '17.5',
  signupsByDay: {},
  signupsChartData: [
    { date: '2026-03-11', signups: 5, cumulative: 780 },
    { date: '2026-03-12', signups: 8, cumulative: 788 },
    { date: '2026-03-13', signups: 3, cumulative: 791 },
    { date: '2026-03-14', signups: 12, cumulative: 803 },
    { date: '2026-03-15', signups: 6, cumulative: 809 },
    { date: '2026-03-16', signups: 4, cumulative: 813 },
    { date: '2026-03-17', signups: 9, cumulative: 822 },
    { date: '2026-03-18', signups: 7, cumulative: 829 },
    { date: '2026-03-19', signups: 2, cumulative: 831 },
    { date: '2026-03-20', signups: 5, cumulative: 836 },
    { date: '2026-03-21', signups: 3, cumulative: 839 },
    { date: '2026-03-22', signups: 1, cumulative: 840 },
    { date: '2026-03-23', signups: 4, cumulative: 844 },
    { date: '2026-03-24', signups: 3, cumulative: 847 },
  ],
  referralsChartData: [
    { date: '2026-03-11', referrals: 3, cumulative: 120 },
    { date: '2026-03-12', referrals: 5, cumulative: 125 },
    { date: '2026-03-13', referrals: 2, cumulative: 127 },
    { date: '2026-03-14', referrals: 8, cumulative: 135 },
    { date: '2026-03-15', referrals: 4, cumulative: 139 },
    { date: '2026-03-16', referrals: 1, cumulative: 140 },
    { date: '2026-03-17', referrals: 6, cumulative: 146 },
    { date: '2026-03-18', referrals: 3, cumulative: 149 },
    { date: '2026-03-19', referrals: 2, cumulative: 151 },
    { date: '2026-03-20', referrals: 1, cumulative: 152 },
    { date: '2026-03-21', referrals: 2, cumulative: 154 },
    { date: '2026-03-22', referrals: 0, cumulative: 154 },
    { date: '2026-03-23', referrals: 1, cumulative: 155 },
    { date: '2026-03-24', referrals: 1, cumulative: 156 },
  ],
  accountTypeBreakdown: [
    { name: 'Creator', value: 612, color: '#f97316' },
    { name: 'Brand', value: 185, color: '#3b82f6' },
    { name: 'Other', value: 50, color: '#71717a' },
  ],
  topReferrers: [
    { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', referralCode: 'ALICE10', totalReferrals: 12, referralClicks: 45 },
    { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', referralCode: 'BOB20', totalReferrals: 8, referralClicks: 30 },
    { id: 'u7', name: 'Grace Kim', email: 'grace@example.com', referralCode: 'GRACE7', totalReferrals: 7, referralClicks: 25 },
    { id: 'u3', name: 'Carol Davis', email: 'carol@example.com', referralCode: 'CAROL5', totalReferrals: 5, referralClicks: 20 },
    { id: 'u5', name: 'Eve Martinez', email: 'eve@example.com', referralCode: 'EVE15', totalReferrals: 3, referralClicks: 10 },
  ],
};

const MOCK_REFERRALS: ReferralUser[] = [
  { id: 'r1', status: 'completed', profile: { full_name: 'Bob Smith', username: 'bobs', avatar_url: undefined } },
  { id: 'r2', status: 'completed', profile: { full_name: 'Dave Wilson', username: 'davew', avatar_url: undefined } },
  { id: 'r3', status: 'pending', profile: { full_name: 'Grace Kim', username: 'gracek', avatar_url: undefined } },
];

// Minimal metric display - numbers as first-class citizens
function Metric({ label, value, subValue }: { label: string; value: string | number; subValue?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-semibold text-zinc-100 tabular-nums tracking-tight">{value}</p>
      {subValue && <p className="text-xs text-zinc-500">{subValue}</p>}
    </div>
  );
}

// User detail sheet component
function UserSheet({
  user,
  onClose,
  timeframe,
}: {
  user: User;
  onClose: () => void;
  timeframe: TimeframeOption;
}) {
  const [copied, setCopied] = useState(false);
  const loading = false;
  const referrals = MOCK_REFERRALS;
  const referralLink = user.referralCode ? `https://app.example.com/ref/${user.referralCode}` : null;

  const displayChartData = [
    { date: '03/18', referrals: 2 },
    { date: '03/19', referrals: 1 },
    { date: '03/20', referrals: 3 },
    { date: '03/21', referrals: 0 },
    { date: '03/22', referrals: 2 },
    { date: '03/23', referrals: 1 },
    { date: '03/24', referrals: 1 },
  ];

  const copyReferralCode = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-zinc-800/50">
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatarUrl || undefined}
              name={user.name || user.email || 'User'}
              size="lg"
            />
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                {user.name || 'No name'}
              </h2>
              <p className="text-sm text-zinc-500">{user.email || 'No email'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/50 p-4">
              <div className="flex items-center gap-2 text-zinc-500 mb-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Account Type</span>
              </div>
              <p className="text-sm font-medium text-zinc-200 capitalize">{user.accountType || 'Unknown'}</p>
            </div>
            <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/50 p-4">
              <div className="flex items-center gap-2 text-zinc-500 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Status</span>
              </div>
              <p className={cn(
                'text-sm font-medium',
                user.onboardingCompleted ? 'text-emerald-400' : 'text-amber-400'
              )}>
                {user.onboardingCompleted ? 'Onboarded' : 'Pending'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Details</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/30">
                <span className="text-sm text-zinc-500">User ID</span>
                <code className="text-xs text-zinc-400 font-mono">{user.id.slice(0, 8)}...</code>
              </div>
              {user.username && (
                <div className="flex items-center justify-between py-2 border-b border-zinc-800/30">
                  <span className="text-sm text-zinc-500">Username</span>
                  <span className="text-sm text-zinc-300">@{user.username}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/30">
                <span className="text-sm text-zinc-500">Joined</span>
                <span className="text-sm text-zinc-300">{formatFullDate(user.createdAt)}</span>
              </div>
              {user.referredById && (
                <div className="flex items-center justify-between py-2 border-b border-zinc-800/30">
                  <span className="text-sm text-zinc-500">Referred By</span>
                  <code className="text-xs text-orange-400 font-mono">{user.referredById.slice(0, 8)}...</code>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/30">
                <span className="text-sm text-zinc-500">Whop Connected</span>
                <span className={cn(
                  'text-sm font-medium',
                  user.whopUserId ? 'text-emerald-400' : 'text-zinc-600'
                )}>
                  {user.whopUserId ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Referral Section */}
          {user.referralCode && (
            <div className="space-y-4">
              <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Referral Program</p>

              {/* Referral Code */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Referral Code</p>
                  <code className="text-sm text-orange-400 font-mono font-medium">{user.referralCode}</code>
                </div>
                <button
                  onClick={copyReferralCode}
                  className="p-2 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Referral Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/50 p-3 text-center">
                  <p className="text-xl font-semibold text-zinc-100 tabular-nums">
                    {user.referralClicks || 0}
                  </p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mt-1">Clicks</p>
                </div>
                <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/50 p-3 text-center">
                  <p className="text-xl font-semibold text-zinc-100 tabular-nums">
                    {user.totalReferrals || 0}
                  </p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mt-1">Referrals</p>
                </div>
                <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/50 p-3 text-center">
                  <p className="text-xl font-semibold text-zinc-100 tabular-nums">
                    {user.referralClicks > 0 ? Math.round((user.totalReferrals / user.referralClicks) * 100) : 0}%
                  </p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mt-1">Conv.</p>
                </div>
              </div>

              {/* Referral Chart */}
              {!loading && displayChartData.length > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-3">Activity</p>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={displayChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="sheetGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#27272a" strokeDasharray="none" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#52525b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: '#52525b' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '6px',
                            fontSize: '11px',
                          }}
                        />
                        <Area type="monotone" dataKey="referrals" stroke="#f97316" strokeWidth={1.5} fill="url(#sheetGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Referred Users List */}
              {!loading && referrals.length > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-3">
                    Referred Users ({referrals.length})
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {referrals.map((referral: ReferralUser) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-zinc-800/30"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={referral.profile?.avatar_url || undefined}
                            name={referral.profile?.full_name || referral.profile?.username || 'User'}
                            size="sm"
                          />
                          <span className="text-sm text-zinc-300">
                            {referral.profile?.full_name || referral.profile?.username || 'Unknown'}
                          </span>
                        </div>
                        <span className={cn(
                          'text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded',
                          referral.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-800'
                        )}>
                          {referral.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/30">
          <div className="flex gap-2">
            {user.email && (
              <a
                href={`mailto:${user.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            )}
            {referralLink && (
              <a
                href={referralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Referral Link
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Inline component for viewing individual creator referrals - uses local data
function CreatorReferralsView({
  userId,
  users,
  onClose,
}: {
  userId: string;
  users: User[];
  onClose: () => void;
}) {
  // Find user in local data by email, id, or referral code
  const user = useMemo(() => {
    const query = userId.toLowerCase();
    return users.find(u =>
      u.email?.toLowerCase() === query ||
      u.id.toLowerCase() === query ||
      u.referralCode?.toLowerCase() === query
    );
  }, [userId, users]);

  if (!user) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
        <p className="text-sm text-zinc-400">User not found</p>
        <p className="text-xs text-zinc-600 mt-1">No user matches &quot;{userId}&quot;</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Avatar
              src={user.avatarUrl || undefined}
              name={user.name || user.email || 'User'}
              size="md"
            />
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">{user.name || user.email || 'Unknown'}</h3>
              {user.email && <p className="text-xs text-zinc-500">{user.email}</p>}
            </div>
            {user.referralCode && (
              <code className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded font-mono">
                {user.referralCode}
              </code>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Row - using local User table data */}
      <div className="grid grid-cols-3 gap-8 py-4 border-y border-zinc-800/50">
        <Metric label="Clicks" value={user.referralClicks || 0} />
        <Metric label="Referrals" value={user.totalReferrals || 0} />
        <Metric
          label="Conversion"
          value={`${user.referralClicks > 0 ? Math.round((user.totalReferrals / user.referralClicks) * 100) : 0}%`}
        />
      </div>

      {/* User Details */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Details</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-zinc-800/30">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Account Type</p>
            <p className="text-sm text-zinc-200 capitalize">{user.accountType || 'Unknown'}</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/30">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Status</p>
            <p className={cn('text-sm', user.onboardingCompleted ? 'text-emerald-400' : 'text-amber-400')}>
              {user.onboardingCompleted ? 'Onboarded' : 'Pending'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/30">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Joined</p>
            <p className="text-sm text-zinc-200">
              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-800/30">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">User ID</p>
            <code className="text-xs text-zinc-400 font-mono">{user.id.slice(0, 12)}...</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupsPage() {
  // Use mock data instead of fetching
  const users = MOCK_USERS;
  const stats = MOCK_STATS;
  const loading = false;
  const error: string | null = null;
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Selected user for sheet
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Referrals state
  const [timeframe, setTimeframe] = useState<TimeframeOption>('7days');
  const [showTimeframeMenu, setShowTimeframeMenu] = useState(false);
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');
  const [searchedUserId, setSearchedUserId] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'signups' | 'referrals'>('signups');

  // Filter signups chart data based on timeframe
  const filteredSignupsChartData = useMemo(() => {
    const now = new Date();

    if (timeframe === 'today') {
      return [
        { date: '08:00', signups: 1, cumulative: 1 },
        { date: '09:00', signups: 2, cumulative: 3 },
        { date: '10:00', signups: 0, cumulative: 3 },
        { date: '11:00', signups: 1, cumulative: 4 },
        { date: '12:00', signups: 3, cumulative: 7 },
      ];
    }

    if (!stats?.signupsChartData) return [];

    switch (timeframe) {
      case '7days':
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return stats.signupsChartData.filter(d => new Date(d.date) >= sevenDaysAgo);
      case '30days':
        return stats.signupsChartData;
      case 'lifetime':
        return stats.signupsChartData;
      default:
        return stats.signupsChartData;
    }
  }, [stats?.signupsChartData, timeframe, users]);

  // Filter referral chart data based on timeframe
  const filteredReferralsChartData = useMemo(() => {
    if (!stats?.referralsChartData) return [];

    const now = new Date();

    if (timeframe === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      const todayData = stats.referralsChartData.find(d => d.date === todayStr);
      return todayData ? [todayData] : [{ date: todayStr, referrals: 0, cumulative: 0 }];
    }

    switch (timeframe) {
      case '7days':
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return stats.referralsChartData.filter(d => new Date(d.date) >= sevenDaysAgo);
      case '30days':
      case 'lifetime':
        return stats.referralsChartData;
      default:
        return stats.referralsChartData;
    }
  }, [stats?.referralsChartData, timeframe]);

  // Filter users by search
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.name?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.referralCode?.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCreatorSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (creatorSearchQuery.trim()) {
      setSearchedUserId(creatorSearchQuery.trim());
    }
  };

  if (error) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* User Detail Sheet */}
      {selectedUser && (
        <UserSheet
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          timeframe={timeframe}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Users & Referrals</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Growth metrics and user activity</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTimeframeMenu(!showTimeframeMenu)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-colors whitespace-nowrap"
            >
              {TIMEFRAME_OPTIONS.find(o => o.value === timeframe)?.label}
              <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-500 transition-transform", showTimeframeMenu && "rotate-180")} />
            </button>
            {showTimeframeMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTimeframeMenu(false)} />
                <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl z-20 min-w-[120px] py-1 overflow-hidden">
                  {TIMEFRAME_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTimeframe(option.value);
                        setShowTimeframeMenu(false);
                      }}
                      className={cn(
                        'w-full px-3 py-1.5 text-left text-sm hover:bg-zinc-800 transition-colors',
                        timeframe === option.value ? 'text-zinc-100' : 'text-zinc-400'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-zinc-800/50 mb-6">
        <button
          onClick={() => setActiveTab('signups')}
          className={cn(
            'pb-3 text-sm font-medium transition-colors relative',
            activeTab === 'signups'
              ? 'text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-300'
          )}
        >
          Signups
          {activeTab === 'signups' && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-100" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={cn(
            'pb-3 text-sm font-medium transition-colors relative',
            activeTab === 'referrals'
              ? 'text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-300'
          )}
        >
          Referrals
          {activeTab === 'referrals' && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-100" />
          )}
        </button>
      </div>

      {activeTab === 'signups' ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Metric label="Total Users" value={stats?.totalUsers || 0} />
            <Metric label="Creators" value={stats?.totalCreators || 0} />
            <Metric label="Onboarded" value={stats?.completedOnboarding || 0} />
            <Metric label="Referrals" value={stats?.totalReferrals || 0} />
            <Metric label="Link Clicks" value={stats?.totalClicks || 0} />
            <Metric
              label="Conversion"
              value={`${stats?.conversionRate || 0}%`}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Signups Chart */}
            <div className="lg:col-span-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Signups {timeframe === 'today' ? 'Today' : timeframe === '7days' ? '(7 days)' : timeframe === '30days' ? '(30 days)' : '(All time)'}
                </p>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredSignupsChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#27272a" strokeDasharray="none" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#52525b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => {
                        if (timeframe === 'today') return value;
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid #27272a',
                        borderRadius: '6px',
                        fontSize: '12px',
                        padding: '8px 12px',
                      }}
                      labelFormatter={(value) => {
                        if (timeframe === 'today') return `Today at ${value}`;
                        return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="signups"
                      stroke="#f97316"
                      strokeWidth={1.5}
                      fill="url(#signupGradient)"
                      name="Signups"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Account Types */}
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-5">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Account Types</p>
              {stats?.accountTypeBreakdown && stats.accountTypeBreakdown.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.accountTypeBreakdown} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#71717a' }}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '6px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-sm text-zinc-600">
                  No data
                </div>
              )}
            </div>
          </div>

          {/* Top Referrers (compact) */}
          {stats?.topReferrers && stats.topReferrers.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Top Referrers</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {stats.topReferrers.slice(0, 5).map((referrer, index) => (
                  <button
                    key={referrer.id}
                    onClick={() => {
                      setActiveTab('referrals');
                      setCreatorSearchQuery(referrer.email || referrer.id);
                      setSearchedUserId(referrer.email || referrer.id);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors min-w-fit"
                  >
                    <span className="text-xs font-medium text-zinc-500 tabular-nums w-4">{index + 1}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-zinc-200 truncate max-w-[120px]">
                        {referrer.name || referrer.email?.split('@')[0] || 'Unknown'}
                      </p>
                      <p className="text-xs text-zinc-500 tabular-nums">{referrer.totalReferrals} referrals</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="rounded-lg border border-zinc-800/50 overflow-hidden">
            {/* Search */}
            <div className="px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/30">
              <div className="max-w-sm">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  icon={<Search className="w-4 h-4" />}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </div>

            {/* Table */}
            {filteredUsers.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No users found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                        <th className="text-left px-4 py-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">User</th>
                        <th className="text-left px-4 py-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                        <th className="text-left px-4 py-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Code</th>
                        <th className="text-right px-4 py-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Referrals</th>
                        <th className="text-center px-4 py-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                        <th className="text-right px-4 py-3 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/30">
                      {paginatedUsers.map((user) => (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={user.avatarUrl || undefined}
                                name={user.name || user.email || 'User'}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-zinc-200 truncate">
                                  {user.name || 'No name'}
                                </p>
                                <p className="text-xs text-zinc-600 truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-zinc-400 capitalize">
                              {user.accountType || '\u2014'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {user.referralCode ? (
                              <code className="text-xs text-zinc-400 font-mono">
                                {user.referralCode}
                              </code>
                            ) : (
                              <span className="text-xs text-zinc-700">\u2014</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm tabular-nums text-zinc-300">
                              {user.totalReferrals || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {user.onboardingCompleted ? (
                              <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-zinc-700 block mx-auto" />
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-xs text-zinc-500 tabular-nums">
                              {formatDate(user.createdAt)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800/50 bg-zinc-900/30">
                  <p className="text-xs text-zinc-500 tabular-nums">
                    {(currentPage - 1) * itemsPerPage + 1}\u2013{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        /* Referrals Tab */
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <Metric label="Total Clicks" value={stats?.totalClicks ?? 0} />
            <Metric label="Total Referrals" value={stats?.totalReferrals ?? 0} />
            <Metric label="Referred Users" value={stats?.referredUsers ?? 0} />
            <Metric label="Conversion" value={`${stats?.conversionRate ?? 0}%`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Top Referrers Bar Chart */}
            <div className="lg:col-span-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-5">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
                Referrals by Creator
              </p>
              {!stats?.topReferrers || stats.topReferrers.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-sm text-zinc-600">
                  No referral data yet
                </div>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.topReferrers.slice(0, 8).map(r => ({
                        name: r.name || r.email?.split('@')[0] || 'Unknown',
                        referrals: r.totalReferrals,
                        clicks: r.referralClicks,
                      }))}
                      layout="vertical"
                      margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#27272a" strokeDasharray="none" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#a1a1aa' }}
                        axisLine={false}
                        tickLine={false}
                        width={80}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#18181b',
                          border: '1px solid #27272a',
                          borderRadius: '6px',
                          fontSize: '12px',
                          padding: '8px 12px',
                        }}
                        formatter={(value) => [value ?? 0, 'Referrals']}
                      />
                      <Bar dataKey="referrals" fill="#f97316" radius={[0, 4, 4, 0]} name="Referrals" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top Referrers List */}
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-5">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Top Referrers</p>
              {!stats?.topReferrers || stats.topReferrers.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-600">No referrers yet</div>
              ) : (
                <div className="space-y-1">
                  {stats.topReferrers.slice(0, 6).map((referrer, index) => (
                    <button
                      key={referrer.id}
                      onClick={() => {
                        setCreatorSearchQuery(referrer.email || referrer.id);
                        setSearchedUserId(referrer.email || referrer.id);
                      }}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-zinc-800/50 transition-colors text-left"
                    >
                      <span className="text-xs font-medium text-zinc-600 tabular-nums w-4">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-200 truncate">
                          {referrer.name || referrer.email || 'Unknown'}
                        </p>
                        <p className="text-xs text-zinc-600 font-mono">{referrer.referralCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-zinc-300 tabular-nums">{referrer.totalReferrals}</p>
                        <p className="text-[10px] text-zinc-600">{referrer.referralClicks} clicks</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Creator Lookup */}
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Creator Lookup</p>
              {searchedUserId && (
                <button
                  onClick={() => {
                    setCreatorSearchQuery('');
                    setSearchedUserId(null);
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {!searchedUserId && (
              <form onSubmit={handleCreatorSearch} className="flex gap-2 max-w-md">
                <Input
                  type="text"
                  placeholder="Email, user ID, or referral code..."
                  value={creatorSearchQuery}
                  onChange={(e) => setCreatorSearchQuery(e.target.value)}
                  className="bg-zinc-900 border-zinc-800"
                />
                <Button type="submit" variant="secondary" size="md">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            )}

            {searchedUserId && (
              <CreatorReferralsView
                userId={searchedUserId}
                users={users}
                onClose={() => {
                  setCreatorSearchQuery('');
                  setSearchedUserId(null);
                }}
              />
            )}
          </div>
        </>
      )}
    </PageContainer>
  );
}
