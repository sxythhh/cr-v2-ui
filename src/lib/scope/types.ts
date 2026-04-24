export type PlatformKey = "ig" | "tt" | "yt";

export const ACTIVE_PLATFORM_KEYS: PlatformKey[] = ["ig", "tt", "yt"];

export const ACTIVE_PLATFORM_LABELS: Record<PlatformKey, string> = {
  ig: "Instagram",
  tt: "TikTok",
  yt: "YouTube",
};

export type Aggregate = {
  posts: number;
  views: number;
  eng: number;
  engDelta: number;
  velocity: number;
  bestPlatform: PlatformKey;
  down?: boolean;
};

export type Competitor = {
  id: string;
  slug: string;
  name: string;
  cat: string;
  logoUrl?: string | null;
  platforms: PlatformKey[];
  handles: Partial<Record<PlatformKey, string>>;
  followers: Record<PlatformKey, number>;
  deltas: Record<PlatformKey, number>;
  totalFollowers: number;
  followerDeltaPct: number;
  aggregate: Aggregate;
};

export type Post = {
  id: string;
  competitor: string;
  competitorLogoUrl?: string | null;
  handle?: string | null;
  platform: PlatformKey;
  hours: number;
  views: number;
  likes: number;
  comments: number;
  velocity: number;
  caption: string;
  hook: string;
  format: string;
  duration?: string;
  url?: string | null;
  thumbnailUrl?: string | null;
};

export type Campaign = {
  id: string;
  host: string;
  name: string;
  status: "new" | "active" | "ending";
  launched: string;
  pool: number;
  endsIn: string;
  requirements: string;
  creators: number;
  topEarning: string | null;
  source: string;
  desc: string;
};

export type Theme = {
  rank: number;
  name: string;
  count: number;
  trend: number[];
  deltaPct: number;
};

export type AlertItem = {
  id: string;
  kind: "campaign" | "viral" | "theme";
  title: string;
  ago: string;
  body: string;
  action: string;
};

export type AlertRuleKind = "campaign" | "viral" | "digest";

export type AlertDeliveryKey = "email" | "slack" | "discord" | "telegram";

export type AlertDeliveryState = Record<AlertDeliveryKey, boolean>;

export type AlertRule = {
  id: string;
  type: AlertRuleKind;
  label: string;
  description: string;
  enabled: boolean;
  focusCompetitor: string | null;
  channels: AlertDeliveryState;
};

export type SwipeItem = Post;

export type SwipeBoard = {
  id: string;
  name: string;
  itemCount: number;
  items: SwipeItem[];
};

export type CreativeBrief = {
  title: string;
  angle: string;
  audience: string;
  hook: string;
  structure: string[];
  doThis: string[];
  avoidThis: string[];
  cta: string;
};

export type SuggestedCompetitor = {
  name: string;
  url: string;
  handles: Partial<Record<"instagram" | "tiktok" | "youtube", string>>;
  rationale: string;
  logoUrl?: string | null;
};

export type DetectedBrand = {
  name: string;
  url: string;
  category: string;
  description: string;
  logoUrl?: string | null;
  socials: Partial<Record<PlatformKey, string>>;
};
