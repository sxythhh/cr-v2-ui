"use client";
// @ts-nocheck

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Instagram, Eye, Heart, MessageCircle, Share2, Play, TrendingUp } from 'lucide-react';
import { Video } from '@/types/virality-nexus';
import { Card } from '@/components/vn/ui/card';
import { Badge } from '@/components/vn/ui/badge';
import { Avatar } from '@/components/vn/ui/avatar';
import { formatNumber, formatRelativeTime, formatDuration } from '@/lib/vn-utils';

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

interface VideoCardProps {
  video: Video;
  index?: number;
}

export function VideoCard({ video, index = 0 }: VideoCardProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const PlatformIcon = video.platform === 'instagram' ? Instagram : TikTokIcon;

  // Use direct video URL for thumbnail (shows first frame), fall back to thumbnail_url
  const videoSrc = video.direct_video_url;
  const thumbnailSrc = video.thumbnail_url;
  const hasVideo = videoSrc && !videoError;
  const hasThumbnail = thumbnailSrc && !imageError && !hasVideo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/videos/${video.id}`}>
        <Card className="overflow-hidden group" hover>
          {/* Thumbnail - Use video first frame, fall back to thumbnail image */}
          <div className="relative aspect-[9/16] bg-zinc-800 overflow-hidden">
            {hasVideo ? (
              <video
                ref={videoRef}
                src={videoSrc}
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onLoadedData={() => setVideoLoaded(true)}
                onError={() => setVideoError(true)}
              />
            ) : hasThumbnail ? (
              <img
                src={thumbnailSrc}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-800 via-zinc-850 to-zinc-900">
                <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center">
                  <Play className="w-8 h-8 text-zinc-500 ml-1" />
                </div>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Platform badge */}
            <div className="absolute top-3 left-3">
              <Badge variant={video.platform}>
                <PlatformIcon className="w-3 h-3 mr-1" />
                {video.platform === 'instagram' ? 'Instagram' : 'TikTok'}
              </Badge>
            </div>

            {/* Outlier Score Badge */}
            {video.outlier_score !== undefined && (
              <div className="absolute top-3 right-3">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                  video.outlier_score >= 5
                    ? 'bg-orange-500/90 text-white'
                    : video.outlier_score >= 2
                    ? 'bg-amber-500/90 text-white'
                    : video.outlier_score >= 1
                    ? 'bg-zinc-700/90 text-zinc-200'
                    : 'bg-red-500/80 text-white'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {video.outlier_score}x
                </div>
              </div>
            )}

            {/* Duration */}
            {video.duration && (
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-xs font-medium text-white">
                {formatDuration(video.duration)}
              </div>
            )}

            {/* Play button on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-medium text-zinc-100 truncate group-hover:text-orange-400 transition-colors">
              {video.title}
            </h3>

            {video.creator && (
              <div className="flex items-center gap-2 mt-2">
                <Avatar src={video.creator.avatar_url} name={video.creator.name} size="sm" />
                <span className="text-sm text-zinc-400 truncate">{video.creator.name}</span>
              </div>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {formatNumber(video.views)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {formatNumber(video.likes)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {formatNumber(video.comments)}
              </span>
            </div>

            {video.published_at && (
              <p className="mt-2 text-xs text-zinc-500">
                {formatRelativeTime(video.published_at)}
              </p>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
