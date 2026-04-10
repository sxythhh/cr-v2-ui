// Types ported from virality-nexus — UI-only (no Supabase)

// Creator types
export type CreatorStatus = 'active' | 'paused' | 'inactive';

export interface Creator {
  id: string;
  name: string;
  email: string | null;
  phone_number: string | null;
  referral_code: string | null;
  avatar_url: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  status: CreatorStatus;
  total_views: number;
  total_videos: number;
  engagement_rate: number;
  avg_views_instagram: number;
  avg_views_tiktok: number;
  notes: string | null;
  retainer_amount: number;
  cpm_rate: number;
  cpm_cap: number | null;
  contract_start_date: string | null;
  archived_at: string | null;
  benched_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCreatorInput {
  name: string;
  email?: string;
  phone_number?: string;
  referral_code?: string;
  avatar_url?: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  status?: CreatorStatus;
  avg_views_instagram?: number;
  avg_views_tiktok?: number;
  notes?: string;
  retainer_amount?: number;
  cpm_rate?: number;
  cpm_cap?: number | null;
  contract_start_date?: string;
}

export interface UpdateCreatorInput extends Partial<CreateCreatorInput> {
  id: string;
}

export interface ContractVariation {
  id: string;
  creator_id: string;
  effective_date: string;
  retainer_amount: number;
  cpm_rate: number;
  cpm_cap: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PausedCycle {
  id: string;
  creator_id: string;
  cycle_start_date: string;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PausePeriod {
  id: string;
  creator_id: string;
  start_date: string;
  end_date: string | null;
  reason: string | null;
  created_at: string;
  updated_at: string;
}

// Video types
export type Platform = 'instagram' | 'tiktok';
export type VideoSortBy = 'recent' | 'views' | 'likes' | 'comments' | 'fastest_growing' | 'outlier';
export type TranscriptStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type TargetAudienceType = 'clippers' | 'ugc_creators' | 'brands' | 'N/A';

export interface ScriptAnalysis {
  hook: {
    text: string;
    type: string;
    effectiveness: number;
  };
  structure: {
    sections: Array<{
      name: string;
      startTime?: string;
      content: string;
    }>;
    pacing: string;
  };
  patterns: string[];
  callToAction?: string;
  targetAudiences: TargetAudienceType[];
  suggestions: string[];
}

export interface Video {
  id: string;
  creator_id: string;
  title: string;
  platform: Platform;
  video_url: string | null;
  direct_video_url: string | null;
  thumbnail_url: string | null;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  transcript?: string | null;
  transcript_status?: TranscriptStatus;
  script_analysis?: ScriptAnalysis | null;
  creator?: Creator;
  outlier_score?: number;
  views_per_hour?: number;
  hours_since_posted?: number;
}

export interface VideoMetric {
  id: string;
  video_id: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  created_at: string;
}

// Analytics types
export interface DailyStats {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  videosPosted: number;
  avgEngagement: number;
}

export interface OverviewStats {
  totalViews: number;
  totalVideos: number;
  totalCreators: number;
  avgEngagementRate: number;
  viewsChange: number;
  videosChange: number;
  creatorsChange: number;
  engagementChange: number;
}

export interface LeaderboardEntry {
  creator: Creator;
  rank: number;
  viewsThisPeriod: number;
  videosThisPeriod: number;
}

export interface PlatformStats {
  platform: Platform;
  totalViews: number;
  totalVideos: number;
  avgEngagement: number;
}

export interface CreatorFilters {
  status?: CreatorStatus;
  search?: string;
}

export interface VideoFilters {
  platform?: Platform;
  creatorId?: string;
  search?: string;
  sortBy?: VideoSortBy;
  dateRange?: { start: string; end: string };
}

// CR Metrics types
export type SocialPlatform = 'twitter' | 'instagram';

export interface CRSocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  profile_url: string;
  display_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CRSocialMetric {
  id: string;
  account_id: string;
  date: string;
  followers: number;
  following: number;
  posts_count: number;
  likes_received: number;
  engagement_rate: number;
  avg_likes: number;
  avg_comments: number;
  total_likes: number;
  total_comments: number;
  total_retweets?: number;
  total_views?: number;
  total_bookmarks?: number;
  tweets_scraped?: number;
  created_at: string;
}

export interface CRMetricsSummary {
  totalFollowers: number;
  followerGrowth: number;
  followerGrowthPercent: number;
  totalPosts: number;
  avgEngagement: number;
  totalViews: number;
}

export interface CRTweet {
  id: string;
  account_id: string;
  tweet_id: string;
  text: string;
  url: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  bookmarks: number;
  quotes: number;
  posted_at: string | null;
  scraped_at: string;
  created_at: string;
  updated_at: string;
  media_url: string | null;
  media_type: 'image' | 'video' | 'gif' | null;
}

export type TweetSortBy = 'recent' | 'likes' | 'retweets' | 'views' | 'replies';

export interface CRPost {
  id: string;
  account_id: string;
  post_id: string;
  type: 'post' | 'reel' | 'video' | 'carousel';
  caption: string;
  url: string;
  thumbnail_url: string | null;
  likes: number;
  comments: number;
  views: number;
  posted_at: string | null;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export type PostSortBy = 'recent' | 'likes' | 'comments' | 'views';

// UTM Tracking types
export type UTMSource = 'ig' | 'yt' | 'tw' | 'tt' | 'fb' | 'li' | 'em';
export type UTMMedium = 'o' | 'p' | 'u' | 'e' | 'r';

export const UTM_SOURCE_LABELS: Record<UTMSource, string> = {
  ig: 'Instagram', yt: 'YouTube', tw: 'Twitter', tt: 'TikTok', fb: 'Facebook', li: 'LinkedIn', em: 'Email',
};

export const UTM_MEDIUM_LABELS: Record<UTMMedium, string> = {
  o: 'Organic', p: 'Paid', u: 'UGC Creator', e: 'Email', r: 'Referral',
};

export interface UTMLink {
  id: string;
  name: string;
  base_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string | null;
  utm_term: string | null;
  full_url: string;
  creator_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  creator?: Creator;
  total_clicks?: number;
}

export interface UTMEvent {
  id: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  utm_link_id: string | null;
  event_type: 'page_view' | 'signup' | 'conversion';
  page_url: string | null;
  referrer: string | null;
  session_id: string | null;
  user_agent: string | null;
  ip_country: string | null;
  ip_city: string | null;
  converted_to_signup: boolean;
  signup_user_id: string | null;
  created_at: string;
}

export interface UTMDailyStats {
  id: string;
  date: string;
  utm_link_id: string;
  clicks: number;
  unique_visitors: number;
  signups: number;
  conversion_rate: number;
}

// Content Calendar types
export type ScheduledPostPlatform = 'twitter' | 'instagram';
export type ScheduledPostContentType = 'tweet' | 'post' | 'reel' | 'story';
export type ScheduledPostStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface ScheduledPostMediaItem {
  url: string;
  type: 'image' | 'video' | 'gif' | 'link';
  filename?: string;
  notes?: string;
}

export interface ScheduledPost {
  id: string;
  title: string;
  description: string | null;
  content: string;
  platform: ScheduledPostPlatform;
  account_id: string | null;
  content_type: ScheduledPostContentType;
  scheduled_at: string;
  status: ScheduledPostStatus;
  published_at: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | 'gif' | null;
  media_items: ScheduledPostMediaItem[] | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  account?: CRSocialAccount;
}

// Payment Tracking types
export interface PaymentItem {
  id: string;
  editor_name: string;
  description: string;
  links: string[] | null;
  amount: number | null;
  date_of_completion: string | null;
  date_payment_sent: string | null;
  is_paid: boolean;
  paid_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentFilters {
  month?: number;
  year?: number;
  is_paid?: boolean | 'all';
  editor_name?: string;
}

// UTM Terms
export type UTMTermType = 'source' | 'medium' | 'campaign';

export interface UTMTerm {
  id: string;
  term_type: UTMTermType;
  code: string;
  label: string;
  created_at: string;
}

// Contract E-Signing types
export type ContractStatus = 'draft' | 'in-progress' | 'completed' | 'expired' | 'declined' | 'revoked';

export type ContractEventType =
  | 'created' | 'sent' | 'viewed' | 'signed' | 'completed'
  | 'declined' | 'revoked' | 'expired' | 'resent' | 'updated';

export interface ContractSigner {
  name: string;
  email: string;
  role?: string;
  status?: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
  signed_at?: string;
  order?: number;
}

export interface Contract {
  id: string;
  opensign_document_id: string | null;
  opensign_template_id: string | null;
  title: string;
  description: string | null;
  status: ContractStatus;
  creator_id: string | null;
  folder_id: string | null;
  file_url: string | null;
  signed_document_url: string | null;
  opensign_edit_url: string | null;
  signers: ContractSigner[];
  sent_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  creator?: Creator;
  folder?: ContractFolder;
  events?: ContractEvent[];
}

export interface ContractFolder {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  parent_folder_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractEvent {
  id: string;
  contract_id: string;
  event_type: ContractEventType;
  actor_email: string | null;
  actor_name: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ContractContact {
  id: string;
  opensign_contact_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  creator_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractTemplate {
  id: string;
  opensign_template_id: string;
  title: string;
  description: string | null;
  opensign_edit_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractFilters {
  status?: ContractStatus | 'all';
  creator_id?: string;
  folder_id?: string;
  search?: string;
  tags?: string[];
}
