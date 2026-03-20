import { DollarSign, Users, BarChart3, Zap } from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type AffiliateVariant = "brand" | "creator";

export interface AffiliateContent {
  headline: [string, string];
  ctaButtonText: string;
  features: { icon: LucideIcon; title: string; desc: string }[];
  steps: { num: string; title: string; desc: string }[];
  ctaHeading: string;
  ctaDescription: string;
}

export const AFFILIATE_CONTENT: Record<AffiliateVariant, AffiliateContent> = {
  brand: {
    headline: ["Refer Brands.", "Get Commission."],
    ctaButtonText: "Start earning with Content Rewards instantly",
    features: [
      { icon: DollarSign, title: "Recurring Commissions", desc: "Earn a percentage on every referred user's subscription, month after month." },
      { icon: Users, title: "Simple Referrals", desc: "Share your unique link. When someone signs up, you get credited automatically." },
      { icon: BarChart3, title: "Real-Time Dashboard", desc: "Track clicks, signups, and earnings with a live analytics dashboard." },
      { icon: Zap, title: "Instant Payouts", desc: "Request payouts anytime. No minimums, no waiting periods." },
    ],
    steps: [
      { num: "01", title: "Sign Up", desc: "Create your free affiliate account in seconds." },
      { num: "02", title: "Share Your Link", desc: "Get a unique referral link to share with your audience." },
      { num: "03", title: "Earn Commission", desc: "Get paid for every user who signs up through your link." },
    ],
    ctaHeading: "Ready to start earning?",
    ctaDescription: "Join the affiliate program and start earning commissions today.",
  },
  creator: {
    headline: ["Invite Creators.", "Get Rewarded."],
    ctaButtonText: "Start referring creators and earn instantly",
    features: [
      { icon: DollarSign, title: "Recurring Commissions", desc: "Earn a cut every time a creator you referred gets paid on a campaign." },
      { icon: Users, title: "Simple Referrals", desc: "Share your link with fellow creators. Signups are tracked automatically." },
      { icon: BarChart3, title: "Real-Time Dashboard", desc: "See who signed up, who's active, and how much you've earned in real time." },
      { icon: Zap, title: "Instant Payouts", desc: "Cash out whenever you want. No minimums, no waiting periods." },
    ],
    steps: [
      { num: "01", title: "Sign Up", desc: "Create your free affiliate account in seconds." },
      { num: "02", title: "Share Your Link", desc: "Send your referral link to creators in your network." },
      { num: "03", title: "Earn Rewards", desc: "Get paid every time a referred creator earns on the platform." },
    ],
    ctaHeading: "Ready to start earning?",
    ctaDescription: "Join the affiliate program and start earning commissions today.",
  },
};
