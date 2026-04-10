"use client";
// @ts-nocheck

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText,
  Eye,
  Heart,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Loader2,
  ThumbsUp,
  ExternalLink,
  Instagram,
  TrendingUp,
} from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Button } from '@/components/vn/ui/button';
import { formatNumber, calculateEngagementRate } from '@/lib/vn-utils';

// Types inlined
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
  platform: 'instagram' | 'tiktok';
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

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function extractHook(transcript: string): string {
  const match = transcript.match(/^[^.!?]+[.!?]/);
  if (match) return match[0].trim();
  const words = transcript.substring(0, 100).split(' ');
  return words.slice(0, -1).join(' ') + '...';
}

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
  if (bodyText) sections.push({ type: 'body', text: bodyText });
  if (ctaText) sections.push({ type: 'cta', text: ctaText });
  return sections.filter(s => s.text.trim().length > 0);
}

// Mock video data
const mockVideo: Video = {
  id: '1',
  title: 'How I Grew My Brand with UGC',
  platform: 'instagram',
  views: 245000,
  likes: 12400,
  comments: 890,
  duration: 62,
  published_at: '2024-03-15T10:00:00Z',
  thumbnail_url: null,
  direct_video_url: null,
  video_url: 'https://instagram.com/reel/example',
  transcript: 'Here is the thing about UGC that nobody tells you. The brands that win are the ones that let creators be authentic. Stop trying to control every word in the script. Instead, give creators a brief and let them run with it. The results will speak for themselves. Check the link in my bio to learn more about our creator program.',
  script_analysis: {
    hook: { text: 'Here is the thing about UGC that nobody tells you.', type: 'curiosity', effectiveness: 8 },
    structure: { sections: [], pacing: 'medium' },
    patterns: ['Strong curiosity-driven hook', 'Authentic conversational tone', 'Clear actionable advice'],
    targetAudiences: ['ugc_creators', 'brands'],
    suggestions: ['Add specific examples', 'Include data points'],
  },
  outlier_score: 3.2,
  creator: { id: 'c1', name: 'Sarah Johnson', avatar_url: null },
};

export default function ScriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const video = mockVideo;
  const loading = false;
  const [analyzingVideo, setAnalyzingVideo] = useState(false);

  const creatorSlug = decodeURIComponent(params.creator as string);
  const scriptId = params.scriptId as string;

  const analyzeVideo = async () => {
    // No-op
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      </PageContainer>
    );
  }

  if (!video) {
    return (
      <PageContainer>
        <div className="text-center py-32">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg">Script not found</p>
          <Button onClick={() => router.push('/vn/scripts')} className="mt-4">
            Back to Scripts
          </Button>
        </div>
      </PageContainer>
    );
  }

  const analysis = video.script_analysis;
  const PlatformIcon = video.platform === 'instagram' ? Instagram : TikTokIcon;

  return (
    <PageContainer>
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/vn/scripts')}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Scripts
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1.5 rounded-lg">
              {creatorSlug} / {scriptId.toUpperCase()}
            </span>
            {video.video_url && (
              <a
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Open Video
              </a>
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Script Section - Left */}
          <div className="col-span-7 flex flex-col min-h-0">
            <div className="flex items-center gap-3 mb-4">
              <PlatformIcon className="w-5 h-5 text-zinc-400" />
              <h2 className="text-xl font-bold text-zinc-100">{video.title}</h2>
            </div>
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
                {getScriptSections(video.transcript || '', analysis).map((section, index) => (
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
          <div className="col-span-5 flex flex-col gap-4 min-h-0 overflow-y-auto">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-3">
              {video.direct_video_url ? (
                <video
                  src={video.direct_video_url}
                  poster={video.thumbnail_url || undefined}
                  controls
                  playsInline
                  className="w-full aspect-[9/16] max-h-[300px] rounded-xl object-contain bg-black"
                />
              ) : video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
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
                  <p className="text-2xl font-bold text-zinc-100">{formatNumber(video.views)}</p>
                  <p className="text-xs text-zinc-500 mt-1">Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-100">{formatNumber(video.likes)}</p>
                  <p className="text-xs text-zinc-500 mt-1">Likes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-100">{formatNumber(video.comments)}</p>
                  <p className="text-xs text-zinc-500 mt-1">Comments</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">
                    {calculateEngagementRate(video.views, video.likes, video.comments)}%
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
                    <p className="text-xs text-zinc-500 mb-2">Target Audience</p>
                    <div className="flex flex-wrap gap-2">
                      {(analysis.targetAudiences || []).map((audience, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            audience === 'clippers'
                              ? 'bg-purple-500/20 text-purple-300'
                              : audience === 'ugc_creators'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {audience === 'clippers' ? 'Clippers' : audience === 'ugc_creators' ? 'UGC Creators' : 'Brands'}
                        </span>
                      ))}
                      {(!analysis.targetAudiences || analysis.targetAudiences.length === 0) && (
                        <span className="text-sm text-zinc-500">Not analyzed</span>
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
                  <p className="text-sm text-zinc-500 mb-4">This script hasn't been analyzed yet</p>
                  <Button onClick={analyzeVideo} disabled={analyzingVideo} className="w-full">
                    {analyzingVideo ? (
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
