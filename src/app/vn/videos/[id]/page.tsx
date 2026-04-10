"use client";
// @ts-nocheck

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Calendar,
  Instagram,
  Trash2,
  AlertTriangle,
  X,
  TrendingUp,
  RefreshCw,
  Wrench,
} from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Button } from '@/components/vn/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/vn/ui/card';
import { Avatar } from '@/components/vn/ui/avatar';
import { Badge } from '@/components/vn/ui/badge';
import { Skeleton } from '@/components/vn/ui/skeleton';
import { ScriptSection } from '@/components/vn/features/script-section';
import { formatNumber, formatDate, formatDuration, calculateEngagementRate } from '@/lib/vn-utils';

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

// Mock video data
const mockVideo = {
  id: '1',
  title: 'How I Grew My Brand with UGC',
  platform: 'instagram' as const,
  views: 245000,
  likes: 12400,
  comments: 890,
  duration: 62,
  published_at: '2024-03-15T10:00:00Z',
  thumbnail_url: null,
  direct_video_url: null,
  video_url: 'https://instagram.com/reel/example',
  outlier_score: 3.2,
  transcript: 'Here is the thing about UGC that nobody tells you. The brands that win are the ones that let creators be authentic. Stop trying to control every word in the script. Instead, give creators a brief and let them run with it. The results will speak for themselves. Check the link in my bio to learn more about our creator program.',
  script_analysis: {
    hook: { text: 'Here is the thing about UGC that nobody tells you.', type: 'curiosity', effectiveness: 8 },
    structure: { sections: [], pacing: 'medium' },
    patterns: ['Strong curiosity-driven hook', 'Authentic conversational tone', 'Clear actionable advice'],
    targetAudiences: ['ugc_creators', 'brands'],
    suggestions: ['Add specific examples', 'Include data points'],
  },
  creator: {
    id: 'c1',
    name: 'Sarah Johnson',
    avatar_url: null,
    instagram_handle: 'sarahjcreates',
    tiktok_handle: null,
  },
  creator_id: 'c1',
};

interface VideoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VideoDetailPage({ params }: VideoDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const video = mockVideo;
  const loading = false;
  const deleting = false;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [repairError, setRepairError] = useState<string | null>(null);
  const [repairSuccess, setRepairSuccess] = useState(false);

  // Check if video needs repair (Instagram with missing or expired URL)
  const needsRepair = false;

  const handleRepairVideo = async () => {
    // No-op
  };

  const handleDelete = async () => {
    // No-op
  };

  if (loading) {
    return (
      <PageContainer>
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-[9/16] w-full max-w-md rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!video) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-zinc-400 mb-4">Video not found</p>
          <Link href="/vn/videos">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4" />
              Back to Videos
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const PlatformIcon = video.platform === 'instagram' ? Instagram : TikTokIcon;
  const engagementRate = calculateEngagementRate(
    video.views,
    video.likes,
    video.comments
  );

  return (
    <PageContainer>
      {/* Back Button - goes to previous page in history */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Preview - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 flex items-start justify-center"
        >
          <div className="relative w-full max-w-md mx-auto">
            {/* Video Player - prioritize direct video URL for native playback */}
            {video.direct_video_url && video.direct_video_url.includes('supabase.co') ? (
              <div className="rounded-xl overflow-hidden bg-zinc-900">
                <video
                  src={video.direct_video_url}
                  poster={video.thumbnail_url || undefined}
                  controls
                  playsInline
                  className="w-full aspect-[9/16] object-contain bg-black"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : needsRepair ? (
              <div className="rounded-xl overflow-hidden bg-zinc-900 aspect-[9/16] flex flex-col items-center justify-center p-6 text-center">
                <Wrench className="w-12 h-12 text-amber-400 mb-4" />
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Video Needs Repair</h3>
                <p className="text-sm text-zinc-400 mb-6 max-w-xs">
                  The Instagram video link has expired. Click below to fetch a fresh copy and store it permanently.
                </p>
                {repairError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                    {repairError}
                  </div>
                )}
                {repairSuccess && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400">
                    Video repaired! Reloading...
                  </div>
                )}
                <Button
                  onClick={handleRepairVideo}
                  disabled={repairing || repairSuccess}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {repairing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Repairing...
                    </>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" />
                      Repair Video
                    </>
                  )}
                </Button>
              </div>
            ) : video.thumbnail_url ? (
              <div className="rounded-xl overflow-hidden bg-zinc-800">
                <a
                  href={video.video_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-[9/16] group"
                >
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="absolute bottom-4 left-4 right-4 text-center text-sm text-white/80">
                    Click to watch on {video.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                  </p>
                </a>
              </div>
            ) : (
              <div className="aspect-[9/16] rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                <PlatformIcon className="w-16 h-16 text-zinc-600" />
              </div>
            )}

            {/* Platform badge */}
            <div className="absolute top-4 left-4 z-10">
              <Badge variant={video.platform} className="text-sm px-3 py-1">
                <PlatformIcon className="w-4 h-4 mr-1.5" />
                {video.platform === 'instagram' ? 'Instagram' : 'TikTok'}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Video Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Title and Creator */}
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-4">{video.title}</h1>

            {video.creator && (
              <div
                className="flex items-center gap-3 p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
              >
                <Avatar
                  src={video.creator.avatar_url}
                  name={video.creator.name}
                  size="md"
                />
                <div>
                  <p className="font-medium text-zinc-100">{video.creator.name}</p>
                  <p className="text-sm text-zinc-400">View profile</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-400">
                  <Eye className="w-4 h-4" />
                  Views
                </span>
                <span className="font-semibold text-zinc-100">
                  {formatNumber(video.views)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-400">
                  <Heart className="w-4 h-4" />
                  Likes
                </span>
                <span className="font-semibold text-zinc-100">
                  {formatNumber(video.likes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-400">
                  <MessageCircle className="w-4 h-4" />
                  Comments
                </span>
                <span className="font-semibold text-zinc-100">
                  {formatNumber(video.comments)}
                </span>
              </div>
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Engagement Rate</span>
                  <span className="font-semibold text-emerald-400">
                    {engagementRate}%
                  </span>
                </div>
                {video.outlier_score !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-zinc-400">
                      <TrendingUp className="w-4 h-4" />
                      Outlier Score
                    </span>
                    <span className={`font-bold text-lg ${
                      video.outlier_score >= 5
                        ? 'text-orange-400'
                        : video.outlier_score >= 2
                        ? 'text-amber-400'
                        : video.outlier_score >= 1
                        ? 'text-zinc-300'
                        : 'text-red-400'
                    }`}>
                      {video.outlier_score}x
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Meta Info */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {video.duration && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-4 h-4" />
                    Duration
                  </span>
                  <span className="text-zinc-100">
                    {formatDuration(video.duration)}
                  </span>
                </div>
              )}
              {video.published_at && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    Published
                  </span>
                  <span className="text-zinc-100">
                    {formatDate(video.published_at)}
                  </span>
                </div>
              )}
              <div className="pt-4 border-t border-zinc-800">
                {video.video_url ? (
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in {video.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                  </a>
                ) : (
                  <a
                    href={video.platform === 'instagram'
                      ? video.creator?.instagram_handle
                        ? `https://www.instagram.com/${video.creator.instagram_handle}/`
                        : 'https://www.instagram.com/'
                      : video.creator?.tiktok_handle
                        ? `https://www.tiktok.com/@${video.creator.tiktok_handle}`
                        : 'https://www.tiktok.com/'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {video.platform === 'instagram'
                      ? video.creator?.instagram_handle
                        ? 'View Creator on Instagram'
                        : 'Visit Instagram'
                      : video.creator?.tiktok_handle
                        ? 'View Creator on TikTok'
                        : 'Visit TikTok'
                    }
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delete Button */}
          <Button
            variant="danger"
            className="w-full"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete Video
          </Button>
        </motion.div>
      </div>

      {/* Script Section - Full Width Below */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ScriptSection video={video} />
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-500/10">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">Delete Video?</h3>
            </div>

            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete <span className="text-zinc-100 font-medium">"{video.title}"</span>?
              This will permanently remove the video and all its metrics from the database. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Video'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </PageContainer>
  );
}
