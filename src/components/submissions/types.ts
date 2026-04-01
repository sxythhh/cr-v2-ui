export type SubmissionStatus = "pending" | "accepted" | "rejected";
export type QualityResult = "pass" | "fail";

export interface CheckItem {
  name: string;
  detail: string;
  score: number;
  passed: boolean;
}

export interface Submission {
  id: string;
  creator: string;
  avatar: string;
  platform: "tiktok" | "instagram";
  platforms: ("tiktok" | "instagram")[];
  campaign: string;
  date: string;
  timeLeft: string;
  status: SubmissionStatus;
  aiScore: number;
  aiResult: QualityResult;
  checksPassed: number;
  checksTotal: number;
  payout: string;
  engRate: string;
  botScore: number;
  botScoreColor: string;
  views: string;
  viewsNum: string;
  likes: string;
  likesNum: string;
  comments: string;
  commentsNum: string;
  shares: string;
  sharesNum: string;
  topCountry: string;
  countryCode: string;
  topAge: string;
  videoUrl: string;
  videoDuration: string;
  videoCurrentTime: string;
  overviewText: string;
  contentChecks: CheckItem[];
  visualChecks: CheckItem[];
  appliedDate: string;
  motivation: string;
  tiktokAccounts: number;
  instagramAccounts: number;
}

export const MOBILE_SUB_TABS = ["Overview", "Stats", "AI Quality"] as const;
export type MobileSubTab = (typeof MOBILE_SUB_TABS)[number];
