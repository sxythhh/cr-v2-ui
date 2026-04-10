"use client";
// @ts-nocheck

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Search,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Zap,
  Instagram,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronDown,
  ThumbsUp,
  Users,
  Send,
  X,
  Play,
  Check,
  Bot,
  ExternalLink,
  TrendingUp,
  LayoutGrid,
  Calendar,
  ArrowLeftRight,
  Filter,
  Plus,
  Minus,
  MoreHorizontal,
  Pencil,
  Trash2,
  MessageSquarePlus,
} from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Button } from '@/components/vn/ui/button';
import { Badge } from '@/components/vn/ui/badge';
import { DateRangePicker } from '@/components/vn/ui/date-range-picker';
import { formatNumber, calculateEngagementRate, formatDuration } from '@/lib/vn-utils';

// Types inlined
type Platform = 'instagram' | 'tiktok';
type TargetAudienceType = 'clippers' | 'ugc_creators' | 'brands' | 'N/A';

interface ScriptAnalysis {
  hook?: { text: string; type: string; effectiveness: number };
  structure?: { sections: any[]; pacing: string };
  patterns?: string[];
  targetAudiences?: string[];
  suggestions?: string[];
}

interface Video {
  id: string;
  title: string;
  platform: Platform;
  views: number;
  likes: number;
  comments: number;
  duration?: number;
  published_at?: string;
  thumbnail_url?: string | null;
  direct_video_url?: string | null;
  video_url?: string | null;
  transcript?: string | null;
  script_analysis?: ScriptAnalysis | null;
  outlier_score?: number;
  creator?: { id: string; name: string; avatar_url?: string | null };
}

interface CanvasChatMessage {
  role: 'user' | 'assistant';
  content: string;
  structured?: StructuredAnalysis | null;
}

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

// Content Rewards Stars Icon
function ContentRewardsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 109 124" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M65.1226 15.8641C77.5899 17.5405 78.9666 16.8389 78.1634 17.5119C77.1922 18.326 65.5774 28.5862 65.528 28.7682C65.4185 29.172 69.2837 45.3272 68.9024 45.4615C68.8563 45.4778 63.2534 42.2251 62.7639 41.9409C54.4306 37.1028 54.327 36.7918 53.6153 37.2064C48.901 39.9526 41.3267 44.2425 40.2553 44.8493C39.4903 45.2827 39.0445 45.7469 39.1641 45.0545C39.9392 40.5651 42.806 28.9859 42.4582 28.6441C41.5719 27.7734 30.5269 18.0514 30.2029 17.7434C30.1709 17.713 29.369 16.9509 30.4146 17.2346C30.8203 17.3446 30.8042 17.0156 35.6368 16.632C39.9771 16.2876 41.4424 15.9525 44.7873 15.7483C46.9908 15.6138 47.1083 15.301 47.1773 15.1171C47.4577 14.3699 53.8669 0.152067 53.9787 0.0216145C54.0923 -0.11071 54.108 0.0898656 58.1473 8.91239C61.0847 15.3283 61.0597 15.4412 61.3563 15.4737C63.2441 15.6811 63.2139 15.7208 65.1226 15.8641Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M98.8132 40.825C102.461 40.4662 107.52 39.9009 107.827 39.8908C108.827 39.8578 107.444 40.2961 100.728 50.0995C100.394 50.5875 100.723 50.6456 105.389 61.0179C105.56 61.398 106.203 62.1995 105.077 61.8562C94.4511 58.6185 94.5378 58.3595 93.6006 58.1269C93.1801 58.0225 83.9779 66.7611 83.7248 66.6232C83.4331 66.4641 83.7993 53.9162 83.5206 53.7543C78.0843 50.5994 78.0237 50.7322 72.5706 47.5814C71.9276 47.21 74.752 46.682 77.7608 45.6224C82.7177 43.8768 84.7371 43.7577 84.892 43.0369C85.652 39.498 85.5912 39.5112 86.3724 35.9876C87.4607 31.0789 87.374 30.8863 87.6427 30.9283C87.9097 30.9701 94.1509 39.7069 94.7033 40.4801C95.5283 41.6349 95.8256 41.0839 98.8132 40.825Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M20.4328 31.0051C20.7057 31.1119 20.7172 31.1754 20.7221 31.2029C21.4575 35.2713 22.7465 40.4008 23.2695 43.1826C23.3632 43.6804 35.5164 47.1685 35.6373 47.3554C35.8005 47.6076 26.2399 52.6751 24.6032 53.8322C24.3199 54.0325 24.5979 66.5716 24.4727 66.6652C24.2945 66.7985 15.5143 58.772 14.8385 58.2015C14.6235 58.0199 4.12679 61.5089 2.53144 62.0856C2.0565 62.2572 2.76761 61.0281 2.90689 60.7165C7.12214 51.2829 7.29294 51.3602 7.54697 50.4999C7.66099 50.1142 -0.00130702 40.1732 1.67236e-07 40.003C0.00232406 39.7209 11.8466 41.2274 12.6974 41.2405C13.1889 41.248 18.3889 33.5856 20.4328 31.0051Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M5.51488 81.0708C4.90529 79.8454 6.12868 80.7584 10.3627 82.0698C10.7837 82.2001 14.1012 83.2278 15.5968 83.7851C16.1382 83.987 16.1843 83.7699 21.203 79.2589C23.031 77.6157 24.5692 76.0607 24.561 76.5865C24.5475 77.4586 24.3958 87.2295 24.5273 87.4904C24.8217 88.0738 34.1278 92.8032 34.0823 93.1522C34.0238 93.6015 23.6293 96.1878 23.4126 97.0207C22.1477 101.883 22.6342 101.972 21.3147 106.833C21.1743 107.6 21.0354 107.55 20.9895 107.511C20.7032 107.267 15.2598 99.6985 14.7679 99.0145C14.4146 98.5235 14.2698 98.4307 7.16934 99.2947C4.09004 99.6695 2.93507 100.013 3.47712 99.2764C3.97646 98.5977 9.68829 90.8339 9.71792 90.7914C9.93826 90.4755 8.12983 87.1423 5.51488 81.0708Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M102.895 99.2776C96.1925 98.7536 93.7088 98.1044 93.3354 98.6322C92.8522 99.3152 87.9515 106.243 87.1932 107.097C87.0726 107.232 86.937 107.126 86.5448 105.363C84.754 97.3158 85.0573 97.2324 84.6994 96.6112C84.4596 96.1954 75.2583 93.4998 74.4287 93.2568C73.4597 92.973 74.5923 92.757 78.9329 90.2752C83.519 87.6531 83.5862 87.6679 83.6552 87.3733C83.658 87.3618 83.6413 78.2072 83.6295 77.0136C83.6215 76.1985 84.0379 76.8267 84.6426 77.3806C85.2112 77.9013 90.6488 82.8809 91.8654 83.7633C92.392 84.1453 102.073 80.489 102.422 80.6792C102.666 80.8118 98.1708 90.1711 98.1548 90.555C98.1357 91.0183 103.748 98.3384 104.255 99C104.879 99.8135 103.279 99.3258 102.895 99.2776Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M61.7802 114.837C59.7299 115.132 57.7834 114.953 57.4905 115.63C57.231 116.23 54.284 123.047 54.0813 123.062C53.7791 123.083 50.8301 115.319 50.319 115.256C42.2381 114.273 41.3831 114.613 41.8975 114.174C42.4197 113.727 48.2827 108.714 48.2544 108.405C48.1943 107.75 46.4101 100.351 46.6843 100.208C46.8182 100.138 53.8367 104.612 54.3399 104.311C54.9118 103.969 61.517 100.018 61.5928 100.212C61.6093 100.255 60.467 106.031 60.0923 107.41C59.6638 108.986 60.2619 108.901 61.4779 110.005C66.0568 114.163 66.6579 114.418 66.1414 114.446C63.9418 114.569 63.9666 114.606 61.7802 114.837Z"/>
    </svg>
  );
}

type SortOption = 'views' | 'likes' | 'recent' | 'outlier' | 'engagement';
type GridCols = 2 | 4 | 6;
type ViewMode = 'list' | 'detail' | 'canvas' | 'compare';

interface DateRange {
  start: Date;
  end: Date;
}

const dateRangeOptions = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'All time' },
];

/**
 * Get first complete sentence as hook
 */
function extractHook(transcript: string): string {
  const match = transcript.match(/^[^.!?]+[.!?]/);
  if (match) {
    return match[0].trim();
  }
  const words = transcript.substring(0, 100).split(' ');
  return words.slice(0, -1).join(' ') + '...';
}

/**
 * Extract CTA - look for link/bio/click/subscribe patterns at end
 */
function extractCTA(transcript: string): string | null {
  const sentences = transcript.split(/(?<=[.!?])\s+/);
  if (sentences.length === 0) return null;

  const lastTwo = sentences.slice(-2).join(' ');
  const lastTwoLower = lastTwo.toLowerCase();

  if (lastTwoLower.includes('link') || lastTwoLower.includes('bio') ||
      lastTwoLower.includes('click') || lastTwoLower.includes('subscribe') ||
      lastTwoLower.includes('follow') || lastTwoLower.includes('comment') ||
      lastTwoLower.includes('check out') || lastTwoLower.includes('sign up')) {
    const ctaMatch = transcript.match(/[^.!?]*(?:link|bio|click|subscribe|follow|comment|check out|sign up)[^.!?]*[.!?]?\s*$/i);
    if (ctaMatch) return ctaMatch[0].trim();
    return sentences[sentences.length - 1].trim();
  }

  return null;
}

/**
 * Split transcript into sections
 */
function getScriptSections(transcript: string, analysis: ScriptAnalysis | null | undefined) {
  if (!transcript) return [];

  const sections: Array<{ type: 'hook' | 'body' | 'cta'; text: string }> = [];

  const hookText = extractHook(transcript);
  const ctaText = extractCTA(transcript);

  sections.push({ type: 'hook', text: hookText });

  const bodyStart = transcript.indexOf(hookText) + hookText.length;
  let bodyEnd = ctaText ? transcript.lastIndexOf(ctaText.substring(0, Math.min(20, ctaText.length))) : transcript.length;

  if (bodyEnd <= bodyStart) bodyEnd = transcript.length;

  const bodyText = transcript.substring(bodyStart, bodyEnd).trim();
  if (bodyText) {
    sections.push({ type: 'body', text: bodyText });
  }

  if (ctaText) {
    sections.push({ type: 'cta', text: ctaText });
  }

  return sections.filter(s => s.text.trim().length > 0);
}

interface StructuredAnalysis {
  summary?: string;
  sections?: Array<{
    title: string;
    type: 'insight' | 'comparison' | 'breakdown' | 'list';
    content?: string;
    items?: string[];
    scripts?: Array<{
      title: string;
      creator: string;
      scriptId: string;
      quote?: string;
      metric?: string;
    }>;
  }>;
  keyTakeaways?: string[];
}

// Helper to generate script URL
function getScriptUrl(video: Video, allVideos: Video[]): string {
  const creatorName = video.creator?.name || 'unknown';
  const creatorSlug = creatorName.toLowerCase().replace(/\s+/g, '-');

  // Get all videos for this creator sorted by published_at ascending
  const creatorVideos = allVideos
    .filter(v => v.creator?.name === creatorName)
    .sort((a, b) => new Date(a.published_at || 0).getTime() - new Date(b.published_at || 0).getTime());

  const scriptIndex = creatorVideos.findIndex(v => v.id === video.id);
  const scriptNum = scriptIndex >= 0 ? scriptIndex + 1 : 1;

  return `/vn/scripts/${creatorSlug}/s${scriptNum}`;
}

// Helper to calculate script number for a video
function getScriptNumber(video: Video, allVideos: Video[]): number {
  const creatorName = video.creator?.name || 'unknown';
  const creatorVideos = allVideos
    .filter(v => v.creator?.name === creatorName)
    .sort((a, b) => new Date(a.published_at || 0).getTime() - new Date(b.published_at || 0).getTime());

  const scriptIndex = creatorVideos.findIndex(v => v.id === video.id);
  return scriptIndex >= 0 ? scriptIndex + 1 : 1;
}

// Script Card Thumbnail component - tries thumbnail first, falls back to video
function ScriptThumbnail({ video, size = 'md' }: { video: Video; size?: 'sm' | 'md' | 'lg' }) {
  const [thumbnailError, setThumbnailError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Try thumbnail first (more reliable for cross-origin), fall back to video
  const showThumbnail = video.thumbnail_url && !thumbnailError;
  const showVideo = !showThumbnail && video.direct_video_url && !videoError;
  const showFallback = !showThumbnail && !showVideo;

  const sizeClasses = {
    sm: 'w-16 h-20',
    md: 'w-28 h-36',
    lg: 'w-32 h-40',
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800`}>
      {showThumbnail && (
        <img
          src={video.thumbnail_url!}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setThumbnailError(true)}
        />
      )}
      {showVideo && (
        <video
          src={video.direct_video_url!}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          onError={() => setVideoError(true)}
        />
      )}
      {showFallback && (
        <div className="w-full h-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-zinc-600" />
        </div>
      )}

      {/* Play overlay on hover */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="w-8 h-8 text-white" />
      </div>

      {/* Outlier Badge */}
      {video.outlier_score !== undefined && video.outlier_score >= 1 && (
        <div className="absolute top-2 right-2">
          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            video.outlier_score >= 5
              ? 'bg-orange-500 text-white'
              : video.outlier_score >= 2
              ? 'bg-amber-500 text-black'
              : 'bg-zinc-600 text-white'
          }`}>
            <TrendingUp className="w-2.5 h-2.5" />
            {video.outlier_score}x
          </div>
        </div>
      )}

      {/* Duration */}
      {video.duration && (
        <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-medium text-white">
          {formatDuration(video.duration)}
        </div>
      )}
    </div>
  );
}

// Compact script card for Canvas selection
function CompactScriptCard({
  video,
  selected,
  onToggle,
  scriptNum
}: {
  video: Video;
  selected: boolean;
  onToggle: () => void;
  scriptNum: number;
}) {
  const [thumbnailError, setThumbnailError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const engagement = calculateEngagementRate(video.views, video.likes, video.comments);

  // Try thumbnail first, fall back to video element if thumbnail fails or doesn't exist
  const showThumbnail = video.thumbnail_url && !thumbnailError;
  const showVideo = !showThumbnail && video.direct_video_url && !videoError;
  const showFallback = !showThumbnail && !showVideo;

  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all w-full ${
        selected
          ? 'bg-orange-500/20 ring-1 ring-orange-500/50'
          : 'bg-zinc-800/50 hover:bg-zinc-800'
      }`}
    >
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        selected ? 'bg-orange-500 border-orange-500' : 'border-zinc-600'
      }`}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>

      <div className="w-10 h-12 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0">
        {showThumbnail && (
          <img
            src={video.thumbnail_url!}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setThumbnailError(true)}
          />
        )}
        {showVideo && (
          <video
            src={video.direct_video_url!}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            onError={() => setVideoError(true)}
          />
        )}
        {showFallback && (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <FileText className="w-4 h-4 text-zinc-500" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 bg-zinc-700 px-1.5 py-0.5 rounded">S{scriptNum}</span>
          <p className="text-sm font-medium text-zinc-200 truncate">{video.title}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
          <span>{formatNumber(video.views)} views</span>
          <span>{engagement}% eng</span>
          {video.creator?.name && <span>{video.creator.name}</span>}
        </div>
      </div>
    </button>
  );
}

// Mock videos data
const mockVideos: Video[] = [
  {
    id: '1', title: 'How I Grew My Brand with UGC', platform: 'instagram', views: 245000, likes: 12400, comments: 890,
    duration: 62, published_at: '2024-03-15T10:00:00Z', thumbnail_url: null, direct_video_url: null,
    video_url: 'https://instagram.com/reel/1', outlier_score: 3.2,
    transcript: 'Here is the thing about UGC that nobody tells you. The brands that win are the ones that let creators be authentic. Stop trying to control every word in the script. Instead, give creators a brief and let them run with it. The results will speak for themselves. Check the link in my bio to learn more about our creator program.',
    script_analysis: {
      hook: { text: 'Here is the thing about UGC that nobody tells you.', type: 'curiosity', effectiveness: 8 },
      structure: { sections: [], pacing: 'medium' }, patterns: ['Strong curiosity-driven hook', 'Authentic conversational tone'],
      targetAudiences: ['ugc_creators', 'brands'], suggestions: [],
    },
    creator: { id: 'c1', name: 'Sarah Johnson', avatar_url: null },
  },
  {
    id: '2', title: 'Top 5 UGC Tips for Beginners', platform: 'tiktok', views: 189000, likes: 9800, comments: 720,
    duration: 45, published_at: '2024-03-12T14:00:00Z', thumbnail_url: null, direct_video_url: null,
    video_url: 'https://tiktok.com/@user/video/2', outlier_score: 2.1,
    transcript: 'Want to know the secret to making money with UGC? Here are my top 5 tips that helped me land brand deals. First, always focus on authentic content. Second, build a portfolio. Third, pitch directly to brands. Fourth, negotiate your rates. Fifth, always deliver on time. Follow me for more UGC tips!',
    script_analysis: {
      hook: { text: 'Want to know the secret to making money with UGC?', type: 'question', effectiveness: 7 },
      structure: { sections: [], pacing: 'fast' }, patterns: ['Listicle format', 'Direct question hook'],
      targetAudiences: ['clippers'], suggestions: [],
    },
    creator: { id: 'c2', name: 'Mike Chen', avatar_url: null },
  },
  {
    id: '3', title: 'Behind the Scenes of a Viral Reel', platform: 'instagram', views: 320000, likes: 18200, comments: 1340,
    duration: 90, published_at: '2024-03-10T08:30:00Z', thumbnail_url: null, direct_video_url: null,
    video_url: 'https://instagram.com/reel/3', outlier_score: 5.1,
    transcript: 'Everyone asks me how this reel went viral. Let me show you exactly what happened behind the scenes. The truth is, I spent 3 hours on a 30-second video. Every frame was planned. The lighting took 45 minutes alone. But the secret sauce was the hook - I tested 12 different openings before finding the one that worked. Subscribe to my channel for more behind-the-scenes content.',
    script_analysis: {
      hook: { text: 'Everyone asks me how this reel went viral.', type: 'social-proof', effectiveness: 9 },
      structure: { sections: [], pacing: 'medium' }, patterns: ['Behind-the-scenes format', 'Strong social proof hook', 'Specific numbers'],
      targetAudiences: ['ugc_creators'], suggestions: [],
    },
    creator: { id: 'c1', name: 'Sarah Johnson', avatar_url: null },
  },
  {
    id: '4', title: 'Brand Deal Negotiation Masterclass', platform: 'tiktok', views: 156000, likes: 7600, comments: 540,
    duration: 58, published_at: '2024-03-08T16:00:00Z', thumbnail_url: null, direct_video_url: null,
    video_url: 'https://tiktok.com/@user/video/4', outlier_score: 1.8,
    transcript: 'Stop accepting lowball offers from brands. Here is how I negotiate deals that actually pay well. Step one: know your worth. Step two: always counter-offer. Step three: add value beyond just the video. This approach tripled my average deal size in just 6 months.',
    script_analysis: {
      hook: { text: 'Stop accepting lowball offers from brands.', type: 'command', effectiveness: 7 },
      structure: { sections: [], pacing: 'medium' }, patterns: ['Step-by-step format', 'Strong command hook'],
      targetAudiences: ['brands'], suggestions: [],
    },
    creator: { id: 'c3', name: 'Emma Wilson', avatar_url: null },
  },
  {
    id: '5', title: 'Content Calendar Strategy That Works', platform: 'instagram', views: 98000, likes: 5200, comments: 380,
    duration: 42, published_at: '2024-03-05T12:00:00Z', thumbnail_url: null, direct_video_url: null,
    video_url: 'https://instagram.com/reel/5', outlier_score: 0.9,
    transcript: 'I used to post randomly and get nowhere. Then I created a content calendar and everything changed. Here is my exact system. Monday: educational content. Wednesday: behind-the-scenes. Friday: trending audio. This simple framework grew my account by 50K followers. Check out my free template in the link in bio.',
    script_analysis: {
      hook: { text: 'I used to post randomly and get nowhere.', type: 'transformation', effectiveness: 6 },
      structure: { sections: [], pacing: 'medium' }, patterns: ['Transformation hook', 'Framework format'],
      targetAudiences: ['ugc_creators', 'brands'], suggestions: [],
    },
    creator: { id: 'c2', name: 'Mike Chen', avatar_url: null },
  },
  {
    id: '6', title: 'Editing Workflow for Short-Form Video', platform: 'tiktok', views: 210000, likes: 11000, comments: 820,
    duration: 75, published_at: '2024-03-01T09:00:00Z', thumbnail_url: null, direct_video_url: null,
    video_url: 'https://tiktok.com/@user/video/6', outlier_score: 2.8,
    transcript: 'My editing workflow saves me 10 hours a week. And I am going to share it with you right now. I use CapCut for rough cuts, then Premiere for color grading, and finally After Effects for any motion graphics. The key is batching. I edit all my weekly content in one session. Comment below if you want the full tutorial.',
    script_analysis: {
      hook: { text: 'My editing workflow saves me 10 hours a week.', type: 'result', effectiveness: 8 },
      structure: { sections: [], pacing: 'fast' }, patterns: ['Result-first hook', 'Tool-specific advice'],
      targetAudiences: ['clippers', 'ugc_creators'], suggestions: [],
    },
    creator: { id: 'c3', name: 'Emma Wilson', avatar_url: null },
  },
];

export default function ScriptsPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('views');
  const [platformFilter, setPlatformFilter] = useState<Platform | ''>('');
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);
  const [selectedAudiences, setSelectedAudiences] = useState<Set<TargetAudienceType>>(new Set());
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false);
  const [gridCols, setGridCols] = useState<GridCols>(2);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [canvasMobileSidebarOpen, setCanvasMobileSidebarOpen] = useState(false);

  // Canvas state - mock chats
  const [chats, setChats] = useState<Array<{ id: string; name: string }>>([]);
  const [currentChat, setCurrentChat] = useState<{ id: string; name: string } | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<CanvasChatMessage[]>([]);
  const chatsLoading = false;
  const createChat = async (name?: string) => {
    const newChat = { id: Date.now().toString(), name: name || 'New Chat' };
    setChats(prev => [...prev, newChat]);
    setCurrentChat(newChat);
    setCurrentChatId(newChat.id);
    setChatMessages([]);
    return newChat;
  };
  const renameChat = async (id: string, name: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    if (currentChat?.id === id) setCurrentChat(prev => prev ? { ...prev, name } : null);
  };
  const deleteChat = async (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) { setCurrentChatId(null); setCurrentChat(null); setChatMessages([]); }
  };
  const addMessage = async (role: 'user' | 'assistant', content: string, structured?: StructuredAnalysis | null) => {
    setChatMessages(prev => [...prev, { role, content, structured }]);
  };
  const switchChat = (id: string) => {
    const chat = chats.find(c => c.id === id);
    if (chat) { setCurrentChat(chat); setCurrentChatId(chat.id); setChatMessages([]); }
  };

  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [canvasSelectedScripts, setCanvasSelectedScripts] = useState<Set<string>>(new Set());
  const [canvasCreatorFilter, setCanvasCreatorFilter] = useState<string>('');
  const [canvasSortBy, setCanvasSortBy] = useState<SortOption>('views');
  const [canvasDateFilter, setCanvasDateFilter] = useState<number | DateRange>(365);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [editingChatName, setEditingChatName] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  // Compare state
  const [compareCreatorA, setCompareCreatorA] = useState<string>('');
  const [compareCreatorB, setCompareCreatorB] = useState<string>('');
  const [compareResult, setCompareResult] = useState<string>('');
  const [compareLoading, setCompareLoading] = useState(false);

  // Analysis trigger state
  const [analyzingVideo, setAnalyzingVideo] = useState<string | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const creators = [...new Set(videos.map(v => v.creator?.name).filter(Boolean))] as string[];

  const toggleAudience = (audience: TargetAudienceType) => {
    setSelectedAudiences(prev => {
      const next = new Set(prev);
      if (next.has(audience)) next.delete(audience);
      else next.add(audience);
      return next;
    });
  };

  // Filter and sort videos
  const filteredVideos = videos
    .filter(v => {
      if (platformFilter && v.platform !== platformFilter) return false;
      if (selectedCreators.size > 0 && !selectedCreators.has(v.creator?.name || '')) return false;
      if (selectedAudiences.size > 0) {
        const videoAudiences = v.script_analysis?.targetAudiences || [];
        if (!videoAudiences.some(a => selectedAudiences.has(a as TargetAudienceType))) return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return v.title.toLowerCase().includes(query) ||
          v.creator?.name?.toLowerCase().includes(query) ||
          v.transcript?.toLowerCase().includes(query);
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'views': return (b.views || 0) - (a.views || 0);
        case 'likes': return (b.likes || 0) - (a.likes || 0);
        case 'recent': return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
        case 'outlier': return (b.outlier_score || 0) - (a.outlier_score || 0);
        case 'engagement': {
          const engA = calculateEngagementRate(a.views, a.likes, a.comments);
          const engB = calculateEngagementRate(b.views, b.likes, b.comments);
          return engB - engA;
        }
        default: return 0;
      }
    });

  // Canvas filtered videos
  const canvasFilteredVideos = videos
    .filter(v => {
      if (canvasCreatorFilter && v.creator?.name !== canvasCreatorFilter) return false;
      // Date filter logic
      const videoDate = new Date(v.published_at || 0);
      if (typeof canvasDateFilter === 'number') {
        if (canvasDateFilter < 365) {
          const now = new Date();
          const cutoff = new Date(now.getTime() - canvasDateFilter * 24 * 60 * 60 * 1000);
          if (videoDate < cutoff) return false;
        }
      } else {
        // Custom date range
        if (videoDate < canvasDateFilter.start || videoDate > canvasDateFilter.end) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (canvasSortBy) {
        case 'views': return (b.views || 0) - (a.views || 0);
        case 'likes': return (b.likes || 0) - (a.likes || 0);
        case 'recent': return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
        case 'outlier': return (b.outlier_score || 0) - (a.outlier_score || 0);
        case 'engagement': {
          const engA = calculateEngagementRate(a.views, a.likes, a.comments);
          const engB = calculateEngagementRate(b.views, b.likes, b.comments);
          return engB - engA;
        }
        default: return 0;
      }
    });

  const instagramCount = videos.filter(v => v.platform === 'instagram').length;
  const tiktokCount = videos.filter(v => v.platform === 'tiktok').length;
  const analysis = selectedVideo?.script_analysis;

  const toggleCreator = (creator: string) => {
    setSelectedCreators(prev => {
      const next = new Set(prev);
      if (next.has(creator)) next.delete(creator);
      else next.add(creator);
      return next;
    });
  };

  const toggleCanvasScript = (id: string) => {
    setCanvasSelectedScripts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllCanvasScripts = () => {
    setCanvasSelectedScripts(new Set(canvasFilteredVideos.map(v => v.id)));
  };

  const clearCanvasSelection = () => {
    setCanvasSelectedScripts(new Set());
  };

  // Trigger analysis for a video (no-op)
  const analyzeVideo = async (videoId: string) => {
    // No-op
  };

  // Analyze audience (no-op)
  const [analyzingAudience, setAnalyzingAudience] = useState<string | null>(null);
  const analyzeAudience = async (videoId: string) => {
    // No-op
  };

  const sendCanvasMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatLoading(true);

    // Create a new chat if none exists
    let chatId = currentChatId;
    if (!chatId) {
      const newChat = await createChat('New Chat');
      if (!newChat) {
        setChatLoading(false);
        return;
      }
      chatId = newChat.id;
    }

    // Add user message
    await addMessage('user', userMessage);

    // Mock assistant response
    setTimeout(async () => {
      await addMessage(
        'assistant',
        'Based on my analysis of the selected scripts, I can see several common patterns. The most successful hooks use curiosity-driven openings or direct question formats. The average engagement rate across these scripts is strong, with behind-the-scenes content performing best.',
        {
          summary: 'Analysis of selected scripts reveals strong patterns in hook styles and content formats.',
          sections: [
            {
              title: 'Hook Patterns',
              type: 'insight',
              content: 'Curiosity-driven hooks ("Here is the thing...") and question hooks ("Want to know...") dominate the top-performing scripts.',
              items: ['Curiosity hooks average 8/10 effectiveness', 'Question hooks average 7/10 effectiveness', 'Command hooks work well for authority content'],
            },
          ],
          keyTakeaways: ['Use curiosity-driven hooks for highest engagement', 'Behind-the-scenes content consistently outperforms', 'Include specific numbers and data points'],
        }
      );
      setChatLoading(false);
    }, 1500);
  };

  const runComparison = async () => {
    if (!compareCreatorA || !compareCreatorB) return;
    setCompareLoading(true);
    setCompareResult('');

    // Mock comparison result
    setTimeout(() => {
      setCompareResult(`Comparing ${compareCreatorA} and ${compareCreatorB}:\n\n1. Hook Styles: ${compareCreatorA} tends to use curiosity-driven hooks while ${compareCreatorB} prefers direct question formats.\n\n2. Content Length: ${compareCreatorA} creates longer, more detailed scripts while ${compareCreatorB} keeps things concise and punchy.\n\n3. CTA Patterns: Both creators use link-in-bio CTAs, but ${compareCreatorA} integrates them more naturally into the narrative.\n\n4. Key Takeaway: ${compareCreatorA} excels at storytelling while ${compareCreatorB} excels at actionable listicle content. They could learn from each other's strengths.`);
      setCompareLoading(false);
    }, 2000);
  };

  const gridColsClass = {
    2: 'grid-cols-1 lg:grid-cols-2',
    4: 'grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-3 lg:grid-cols-6',
  };

  // CANVAS VIEW
  if (viewMode === 'canvas') {
    return (
      <PageContainer>
        <div className="h-[calc(100vh-2rem)] flex flex-col">
          {/* Canvas Header */}
          <div className="flex items-center justify-between gap-2 mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center gap-1 md:gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span className="hidden sm:inline">Back to Scripts</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className="w-px h-6 bg-zinc-700 hidden sm:block" />
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center p-1 md:p-1.5">
                  <ContentRewardsIcon className="w-full h-full text-white" />
                </div>
                <div className="hidden sm:block">
                  <h2 className="text-lg font-semibold text-zinc-100">Canvas</h2>
                  <p className="text-xs text-zinc-500">AI Script Analysis</p>
                </div>
              </div>

              {/* Chat Management - Discrete Dropdown */}
              <div className="relative ml-4">
                <button
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 transition-colors"
                >
                  {editingChatName ? (
                    <input
                      type="text"
                      value={newChatName}
                      onChange={(e) => setNewChatName(e.target.value)}
                      onBlur={async () => {
                        if (currentChatId && newChatName.trim()) {
                          await renameChat(currentChatId, newChatName.trim());
                        }
                        setEditingChatName(false);
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter' && currentChatId && newChatName.trim()) {
                          await renameChat(currentChatId, newChatName.trim());
                          setEditingChatName(false);
                        }
                        if (e.key === 'Escape') {
                          setEditingChatName(false);
                        }
                      }}
                      autoFocus
                      className="bg-transparent border-none outline-none text-zinc-200 w-32"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate max-w-[150px]">
                      {currentChat?.name || 'New Chat'}
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showChatMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showChatMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowChatMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 mt-1 w-64 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                      >
                        {/* New Chat */}
                        <button
                          onClick={async () => {
                            await createChat();
                            setShowChatMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
                        >
                          <MessageSquarePlus className="w-4 h-4 text-orange-400" />
                          New Chat
                        </button>

                        {chats.length > 0 && (
                          <>
                            <div className="h-px bg-zinc-700 my-1" />
                            <div className="max-h-48 overflow-y-auto">
                              {chats.map(chat => (
                                <div
                                  key={chat.id}
                                  className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-700 transition-colors group ${
                                    chat.id === currentChatId ? 'bg-zinc-700/50' : ''
                                  }`}
                                >
                                  <button
                                    onClick={() => {
                                      switchChat(chat.id);
                                      setShowChatMenu(false);
                                    }}
                                    className="flex-1 text-left text-zinc-200 truncate"
                                  >
                                    {chat.name}
                                  </button>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNewChatName(chat.name);
                                        setEditingChatName(true);
                                        switchChat(chat.id);
                                        setShowChatMenu(false);
                                      }}
                                      className="p-1 rounded hover:bg-zinc-600"
                                      title="Rename"
                                    >
                                      <Pencil className="w-3 h-3 text-zinc-400" />
                                    </button>
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        await deleteChat(chat.id);
                                      }}
                                      className="p-1 rounded hover:bg-red-500/20"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3 h-3 text-zinc-400 hover:text-red-400" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile: toggle script sidebar */}
            <button
              onClick={() => setCanvasMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
              title="Select scripts"
            >
              <FileText className="w-4 h-4" />
            </button>
            <Button onClick={() => setViewMode('compare')} variant="secondary" className="hidden md:flex">
              <ArrowLeftRight className="w-4 h-4" />
              Compare Creators
            </Button>
          </div>

          {/* Mobile Script Sidebar Drawer */}
          <AnimatePresence>
            {canvasMobileSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-40 md:hidden"
                  onClick={() => setCanvasMobileSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  exit={{ x: -320 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed top-0 left-0 bottom-0 w-80 bg-zinc-900 border-r border-zinc-800 z-50 md:hidden flex flex-col"
                >
                  <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <span className="text-sm font-medium text-zinc-200">Select Scripts</span>
                    <button
                      onClick={() => setCanvasMobileSidebarOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 border-b border-zinc-800 space-y-3">
                    <select
                      value={canvasCreatorFilter}
                      onChange={(e) => setCanvasCreatorFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200"
                    >
                      <option value="">All Creators</option>
                      {creators.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllCanvasScripts}
                        className="flex-1 px-3 py-1.5 text-xs bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-zinc-200"
                      >
                        Select All ({canvasFilteredVideos.length})
                      </button>
                      <button
                        onClick={clearCanvasSelection}
                        className="flex-1 px-3 py-1.5 text-xs bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-zinc-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {canvasFilteredVideos.map(video => (
                      <CompactScriptCard
                        key={video.id}
                        video={video}
                        selected={canvasSelectedScripts.has(video.id)}
                        onToggle={() => toggleCanvasScript(video.id)}
                        scriptNum={getScriptNumber(video, videos)}
                      />
                    ))}
                    {canvasFilteredVideos.length === 0 && (
                      <p className="text-sm text-zinc-500 text-center py-8">No scripts match your filters</p>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 min-h-0">
            {/* Script Selection Panel - Desktop only */}
            <div className="hidden md:flex col-span-4 flex-col min-h-0 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              {/* Filters */}
              <div className="p-4 border-b border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-300">Select Scripts</span>
                  <span className="text-xs text-zinc-500">
                    {canvasSelectedScripts.size > 0
                      ? `${canvasSelectedScripts.size} selected`
                      : `${canvasFilteredVideos.length} available`}
                  </span>
                </div>

                {/* Creator Filter */}
                <select
                  value={canvasCreatorFilter}
                  onChange={(e) => setCanvasCreatorFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200"
                >
                  <option value="">All Creators</option>
                  {creators.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Sort & Date Row */}
                <div className="flex gap-2">
                  <select
                    value={canvasSortBy}
                    onChange={(e) => setCanvasSortBy(e.target.value as SortOption)}
                    className="flex-1 px-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200"
                  >
                    <option value="views">Top Views</option>
                    <option value="likes">Top Likes</option>
                    <option value="engagement">Top Engagement</option>
                    <option value="recent">Most Recent</option>
                    <option value="outlier">Top Outliers</option>
                  </select>
                  <DateRangePicker
                    value={canvasDateFilter}
                    onChange={setCanvasDateFilter}
                    options={dateRangeOptions}
                  />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={selectAllCanvasScripts}
                    className="flex-1 px-3 py-1.5 text-xs bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-zinc-200"
                  >
                    Select All ({canvasFilteredVideos.length})
                  </button>
                  <button
                    onClick={clearCanvasSelection}
                    className="flex-1 px-3 py-1.5 text-xs bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-zinc-200"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>

              {/* Script List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {canvasFilteredVideos.map(video => (
                  <CompactScriptCard
                    key={video.id}
                    video={video}
                    selected={canvasSelectedScripts.has(video.id)}
                    onToggle={() => toggleCanvasScript(video.id)}
                    scriptNum={getScriptNumber(video, videos)}
                  />
                ))}
                {canvasFilteredVideos.length === 0 && (
                  <p className="text-sm text-zinc-500 text-center py-8">No scripts match your filters</p>
                )}
              </div>
            </div>

            {/* Chat Panel */}
            <div className="md:col-span-8 flex flex-col min-h-0 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 text-zinc-600">
                      <ContentRewardsIcon className="w-full h-full" />
                    </div>
                    <p className="text-xl text-zinc-300 mb-2">Ask me about your scripts</p>
                    <p className="text-sm text-zinc-500 mb-6">
                      {canvasSelectedScripts.size > 0
                        ? `Analyzing ${canvasSelectedScripts.size} selected scripts`
                        : `Analyzing ${canvasFilteredVideos.length} scripts from your filters`}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                      {[
                        'What patterns make these scripts successful?',
                        'Compare the hooks across scripts',
                        'What CTAs are most common?',
                        'Identify the strongest hooks',
                        'What storytelling techniques are used?',
                      ].map(q => (
                        <button
                          key={q}
                          onClick={() => setChatInput(q)}
                          className="px-4 py-2 text-sm bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'user' ? (
                      <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-orange-500/20 text-orange-100">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    ) : msg.structured ? (
                      <div className="max-w-[90%] space-y-4">
                        {/* Summary */}
                        {msg.structured.summary && (
                          <div className="bg-zinc-800 rounded-2xl px-5 py-4">
                            <p className="text-sm text-zinc-200 leading-relaxed">{msg.structured.summary}</p>
                          </div>
                        )}

                        {/* Sections */}
                        {msg.structured.sections?.map((section, si) => (
                          <div key={si} className="bg-zinc-800/80 rounded-2xl overflow-hidden">
                            <div className="px-5 py-3 border-b border-zinc-700 bg-zinc-800">
                              <h4 className="font-semibold text-zinc-100">{section.title}</h4>
                            </div>
                            <div className="px-5 py-4 space-y-3">
                              {section.content && (
                                <p className="text-sm text-zinc-300 leading-relaxed">{section.content}</p>
                              )}
                              {section.items && section.items.length > 0 && (
                                <ul className="space-y-2">
                                  {section.items.map((item, ii) => (
                                    <li key={ii} className="text-sm text-zinc-400 flex items-start gap-2">
                                      <span className="text-orange-400 mt-1">•</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {section.scripts && section.scripts.length > 0 && (
                                <div className="space-y-2 pt-2">
                                  {section.scripts.map((script, ssi) => (
                                    <a
                                      key={ssi}
                                      href={`/vn/scripts/${(script.creator || 'unknown').toLowerCase().replace(/\s+/g, '-')}/${script.scriptId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block p-3 bg-zinc-900/50 rounded-xl hover:bg-zinc-900 transition-colors group"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm font-medium text-zinc-200 group-hover:text-orange-400 transition-colors">
                                            {script.title}
                                          </p>
                                          <p className="text-xs text-zinc-500 mt-0.5">
                                            {script.creator} • {script.scriptId.toUpperCase()} {script.metric && `• ${script.metric}`}
                                          </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-orange-400" />
                                      </div>
                                      {script.quote && (
                                        <p className="text-xs text-zinc-400 mt-2 italic border-l-2 border-zinc-700 pl-3">
                                          "{script.quote}"
                                        </p>
                                      )}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Key Takeaways */}
                        {msg.structured.keyTakeaways && msg.structured.keyTakeaways.length > 0 && (
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-5 py-4">
                            <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Key Takeaways
                            </h4>
                            <ul className="space-y-2">
                              {msg.structured.keyTakeaways.map((takeaway, ti) => (
                                <li key={ti} className="text-sm text-zinc-300 flex items-start gap-2">
                                  <span className="text-orange-400 font-bold">{ti + 1}.</span>
                                  {takeaway}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-zinc-800 text-zinc-200">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 rounded-2xl px-5 py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask about your scripts..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendCanvasMessage()}
                    className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                  <Button onClick={sendCanvasMessage} disabled={chatLoading || !chatInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // COMPARE VIEW
  if (viewMode === 'compare') {
    const creatorAVideos = videos.filter(v => v.creator?.name === compareCreatorA);
    const creatorBVideos = videos.filter(v => v.creator?.name === compareCreatorB);

    return (
      <PageContainer>
        <div className="h-[calc(100vh-2rem)] flex flex-col">
          {/* Compare Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Scripts
              </button>
              <div className="w-px h-6 bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-100">Compare Creators</h2>
                  <p className="text-xs text-zinc-500">Analyze script differences</p>
                </div>
              </div>
            </div>

            <Button onClick={() => setViewMode('canvas')} variant="secondary">
              <Sparkles className="w-4 h-4" />
              Canvas
            </Button>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 min-h-0">
            {/* Creator Selection */}
            <div className="md:col-span-4 flex flex-col gap-4">
              {/* Creator A */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Creator A</label>
                <select
                  value={compareCreatorA}
                  onChange={(e) => setCompareCreatorA(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200"
                >
                  <option value="">Select Creator</option>
                  {creators.filter(c => c !== compareCreatorB).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {compareCreatorA && (
                  <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg">
                    <p className="text-xs text-zinc-500 mb-2">{creatorAVideos.length} scripts</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {creatorAVideos.slice(0, 5).map(v => (
                        <p key={v.id} className="text-xs text-zinc-400 truncate">{v.title}</p>
                      ))}
                      {creatorAVideos.length > 5 && (
                        <p className="text-xs text-zinc-600">+{creatorAVideos.length - 5} more</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* VS Badge */}
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-zinc-400">VS</span>
                </div>
              </div>

              {/* Creator B */}
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Creator B</label>
                <select
                  value={compareCreatorB}
                  onChange={(e) => setCompareCreatorB(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200"
                >
                  <option value="">Select Creator</option>
                  {creators.filter(c => c !== compareCreatorA).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {compareCreatorB && (
                  <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg">
                    <p className="text-xs text-zinc-500 mb-2">{creatorBVideos.length} scripts</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {creatorBVideos.slice(0, 5).map(v => (
                        <p key={v.id} className="text-xs text-zinc-400 truncate">{v.title}</p>
                      ))}
                      {creatorBVideos.length > 5 && (
                        <p className="text-xs text-zinc-600">+{creatorBVideos.length - 5} more</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Compare Button */}
              <Button
                onClick={runComparison}
                disabled={!compareCreatorA || !compareCreatorB || compareLoading}
                className="w-full"
              >
                {compareLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Compare Scripts
                  </>
                )}
              </Button>
            </div>

            {/* Comparison Results */}
            <div className="md:col-span-8 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col min-h-0">
              <div className="px-5 py-4 border-b border-zinc-800">
                <h3 className="font-semibold text-zinc-200">Comparison Results</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {compareResult ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{compareResult}</p>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ArrowLeftRight className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400">Select two creators to compare their scripts</p>
                    <p className="text-sm text-zinc-500 mt-1">
                      We'll analyze hooks, storytelling, CTAs, and more
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // DETAIL VIEW
  if (viewMode === 'detail' && selectedVideo) {
    return (
      <PageContainer>
        <div className="h-[calc(100vh-2rem)] flex flex-col">
          {/* Back Button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => { setSelectedVideo(null); setViewMode('list'); }}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Scripts
            </button>
            {selectedVideo.video_url && (
              <a
                href={selectedVideo.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Open Video
              </a>
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 min-h-0">
            {/* Script Section - Left */}
            <div className="md:col-span-7 flex flex-col min-h-0">
              <h2 className="text-xl font-bold text-zinc-100 mb-4">{selectedVideo.title}</h2>
              <div className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col min-h-0">
                <div className="flex items-center gap-4 px-5 py-3 border-b border-zinc-800">
                  <span className="text-base font-semibold text-zinc-200">Script</span>
                  <div className="flex gap-3 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-500/60" /> Hook
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-blue-500/60" /> Body
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-500/60" /> CTA
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {getScriptSections(selectedVideo.transcript || '', analysis).map((section, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl ${
                        section.type === 'hook'
                          ? 'bg-amber-500/15 border-l-4 border-amber-500'
                          : section.type === 'cta'
                          ? 'bg-emerald-500/15 border-l-4 border-emerald-500'
                          : 'bg-blue-500/10 border-l-4 border-blue-500'
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wide mb-2 block ${
                        section.type === 'hook' ? 'text-amber-400' :
                        section.type === 'cta' ? 'text-emerald-400' : 'text-blue-400'
                      }`}>
                        {section.type === 'hook' ? 'Hook' : section.type === 'cta' ? 'Call to Action' : 'Body'}
                      </span>
                      <p className="text-base text-zinc-200 leading-relaxed">{section.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-5 flex flex-col gap-4 min-h-0 overflow-y-auto">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-3">
                {selectedVideo.direct_video_url ? (
                  <video
                    src={selectedVideo.direct_video_url}
                    poster={selectedVideo.thumbnail_url || undefined}
                    controls
                    playsInline
                    className="w-full aspect-[9/16] max-h-[300px] rounded-xl object-contain bg-black"
                  />
                ) : selectedVideo.thumbnail_url ? (
                  <img
                    src={selectedVideo.thumbnail_url}
                    alt={selectedVideo.title}
                    className="w-full aspect-[9/16] max-h-[300px] rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[9/16] max-h-[300px] rounded-xl bg-zinc-800 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-zinc-600" />
                  </div>
                )}
              </div>

              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-zinc-100">{formatNumber(selectedVideo.views)}</p>
                    <p className="text-xs text-zinc-500 mt-1">Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-100">{formatNumber(selectedVideo.likes)}</p>
                    <p className="text-xs text-zinc-500 mt-1">Likes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-100">{formatNumber(selectedVideo.comments)}</p>
                    <p className="text-xs text-zinc-500 mt-1">Comments</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">
                      {calculateEngagementRate(selectedVideo.views, selectedVideo.likes, selectedVideo.comments)}%
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">Engagement</p>
                  </div>
                </div>
              </div>

              {analysis ? (
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                  <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-base font-semibold text-zinc-200">Analysis</span>
                  </div>
                  <div className="p-5 space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-300">Hook Effectiveness</span>
                        <span className="text-sm font-bold text-amber-400">{analysis.hook?.effectiveness || 0}/10</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                          style={{ width: `${(analysis.hook?.effectiveness || 0) * 10}%` }}
                        />
                      </div>
                    </div>
                    {analysis.patterns && analysis.patterns.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4 text-emerald-400" />
                          Strengths
                        </h4>
                        <ul className="space-y-2">
                          {analysis.patterns.slice(0, 3).map((pattern, i) => (
                            <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                              <span className="text-emerald-400 font-bold">+</span>
                              {pattern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="pt-4 border-t border-zinc-800">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-zinc-500">Target Audience</p>
                        {(!analysis.targetAudiences || analysis.targetAudiences.length === 0) && selectedVideo?.transcript && (
                          <button
                            onClick={() => analyzeAudience(selectedVideo.id)}
                            disabled={analyzingAudience === selectedVideo.id}
                            className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 disabled:opacity-50"
                          >
                            {analyzingAudience === selectedVideo.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3" />
                                Analyze
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(analysis.targetAudiences || []).map((audience, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              audience === 'clippers'
                                ? 'bg-purple-500/20 text-purple-300'
                                : audience === 'ugc_creators'
                                ? 'bg-blue-500/20 text-blue-300'
                                : audience === 'brands'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-zinc-500/20 text-zinc-400'
                            }`}
                          >
                            {audience === 'clippers' ? 'Clippers' : audience === 'ugc_creators' ? 'UGC Creators' : audience === 'brands' ? 'Brands' : 'N/A'}
                          </span>
                        ))}
                        {(!analysis.targetAudiences || analysis.targetAudiences.length === 0) && (
                          <span className="text-sm text-zinc-500">
                            {selectedVideo?.transcript ? 'Click "Analyze" to identify' : 'Needs transcript first'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                  <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-zinc-500" />
                    <span className="text-base font-semibold text-zinc-400">Analysis</span>
                  </div>
                  <div className="p-5 text-center">
                    <p className="text-sm text-zinc-500 mb-4">This video hasn't been analyzed yet</p>
                    <Button
                      onClick={() => analyzeVideo(selectedVideo.id)}
                      disabled={analyzingVideo === selectedVideo.id}
                      className="w-full"
                    >
                      {analyzingVideo === selectedVideo.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Analyze Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // LIST VIEW (default)
  return (
    <PageContainer>
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Toolbar */}
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
                <span>{{ views: 'Views', likes: 'Likes', recent: 'Recent', outlier: 'Outliers', engagement: 'Engagement' }[sortBy]}</span>
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
                      {[
                        { value: 'views', label: 'Views' },
                        { value: 'likes', label: 'Likes' },
                        { value: 'recent', label: 'Recent' },
                        { value: 'outlier', label: 'Outliers' },
                        { value: 'engagement', label: 'Engagement' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value as SortOption); setMobileSortOpen(false); }}
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

            {[
              { value: 'views' as SortOption, label: 'Views', icon: Eye },
              { value: 'likes' as SortOption, label: 'Likes', icon: Heart },
              { value: 'recent' as SortOption, label: 'Recent', icon: Clock },
              { value: 'outlier' as SortOption, label: 'Outliers', icon: Zap },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
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

          {/* Controls row */}
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

          {/* Grid Layout Toggle */}
          <div className="flex items-center gap-1 bg-zinc-800/80 rounded-xl p-1">
            {([2, 4, 6] as GridCols[]).map(cols => (
              <button
                key={cols}
                onClick={() => setGridCols(cols)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  gridCols === cols
                    ? 'bg-zinc-700 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cols}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="w-full sm:flex-1 sm:max-w-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search scripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-zinc-800/80 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          {/* Canvas Button */}
          <Button
            onClick={() => setViewMode('canvas')}
            className="ml-auto"
          >
            <ContentRewardsIcon className="w-4 h-4" />
            Canvas
          </Button>
          </div>
        </div>

        {/* Scripts Grid */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg">No transcribed scripts yet</p>
              <p className="text-zinc-500 mt-1">Import videos to get started</p>
            </div>
          ) : (
            <div className={`grid ${gridColsClass[gridCols]} gap-4`}>
              {filteredVideos.map((video) => {
                const PlatformIcon = video.platform === 'instagram' ? Instagram : TikTokIcon;
                const engagement = calculateEngagementRate(video.views, video.likes, video.comments);
                const previewText = video.transcript?.substring(0, gridCols === 2 ? 120 : 80) || '';
                const scriptUrl = getScriptUrl(video, videos);
                const scriptNum = getScriptNumber(video, videos);

                return (
                  <motion.div
                    key={video.id}
                    className={`flex ${gridCols === 2 ? 'flex-row gap-4' : 'flex-col gap-3'} p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group cursor-pointer`}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => router.push(scriptUrl)}
                  >
                    {/* Thumbnail */}
                    <ScriptThumbnail video={video} size={gridCols === 2 ? 'md' : 'sm'} />

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">S{scriptNum}</span>
                        <h3 className={`font-semibold text-zinc-100 ${gridCols === 2 ? 'text-base' : 'text-sm'} line-clamp-1 group-hover:text-orange-400 transition-colors`}>
                          {video.title}
                        </h3>
                      </div>

                      {gridCols === 2 && (
                        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mt-1 flex-1">
                          {previewText}...
                        </p>
                      )}

                      <div className={`flex items-center gap-3 ${gridCols === 2 ? 'mt-3' : 'mt-2'} text-xs`}>
                        <span className="flex items-center gap-1 text-zinc-400">
                          <PlatformIcon className="w-3.5 h-3.5" />
                        </span>
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Eye className="w-3.5 h-3.5" />
                          {formatNumber(video.views)}
                        </span>
                        <span className="text-emerald-400 font-medium">{engagement}%</span>
                        {video.script_analysis && (
                          <Sparkles className="w-3 h-3 text-purple-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
