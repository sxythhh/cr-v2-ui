export type DocSection = {
  id: string;
  heading: string;
  content: string;
};

export type PageTranslation = {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  sections: DocSection[];
};

export type DocCategory = {
  id: string;
  name: string;
  description: string;
  pages: PageTranslation[];
};

export type DocType = "brands" | "creators" | "general";

// Helper to create empty pages (no content, just structure)
function page(id: string, title: string, subtitle: string, sectionHeadings: { id: string; heading: string }[]): PageTranslation {
  return {
    id,
    title,
    subtitle,
    intro: "",
    sections: sectionHeadings.map(s => ({ id: s.id, heading: s.heading, content: "" })),
  };
}

// ── Brand Pages ──

const brandPages: PageTranslation[] = [
  page("getting-started", "Getting Started", "Everything you need to start using Content Rewards as a brand", [
    { id: "creating-account", heading: "Creating Your Account" },
    { id: "first-campaign", heading: "Your First Campaign" },
    { id: "brand-dashboard", heading: "Brand Dashboard Overview" },
    { id: "next-steps", heading: "Next Steps" },
  ]),
  page("workspace-setup", "Workspace Setup", "Configure your workspace for your team", [
    { id: "workspace-overview", heading: "Workspace Overview" },
    { id: "inviting-team", heading: "Inviting Team Members" },
    { id: "roles-permissions", heading: "Roles & Permissions" },
    { id: "workspace-settings", heading: "Workspace Settings" },
    { id: "branding", heading: "Branding & Customization" },
  ]),
  page("creating-campaigns", "Creating Campaigns", "Launch your first campaign and attract creators", [
    { id: "campaign-types", heading: "Campaign Types" },
    { id: "setting-goals", heading: "Setting Goals" },
    { id: "defining-audience", heading: "Defining Your Audience" },
    { id: "budget-setup", heading: "Budget Setup" },
    { id: "content-guidelines", heading: "Content Guidelines" },
    { id: "campaign-brief", heading: "Writing a Campaign Brief" },
    { id: "review-launch", heading: "Review & Launch" },
    { id: "campaign-templates", heading: "Campaign Templates" },
    { id: "advanced-settings", heading: "Advanced Settings" },
  ]),
  page("campaign-management", "Campaign Management", "Monitor and optimize active campaigns", [
    { id: "campaign-dashboard", heading: "Campaign Dashboard" },
    { id: "monitoring-performance", heading: "Monitoring Performance" },
    { id: "adjusting-campaigns", heading: "Adjusting Campaigns" },
  ]),
  page("payment-terms", "Payment Terms", "Understanding payment structures and terms", [
    { id: "payment-models", heading: "Payment Models" },
    { id: "pricing-tiers", heading: "Pricing Tiers" },
    { id: "terms-conditions", heading: "Terms & Conditions" },
  ]),
  page("managing-applications", "Managing Applications", "Review and manage creator applications", [
    { id: "application-inbox", heading: "Application Inbox" },
    { id: "reviewing-profiles", heading: "Reviewing Creator Profiles" },
    { id: "approval-workflow", heading: "Approval Workflow" },
  ]),
  page("reviewing-submissions", "Reviewing Submissions", "Review and approve creator content", [
    { id: "submission-queue", heading: "Submission Queue" },
    { id: "content-review", heading: "Content Review Process" },
    { id: "feedback-revisions", heading: "Feedback & Revisions" },
  ]),
  page("understanding-bot-score", "Understanding Bot Score", "How we detect and prevent fraudulent activity", [
    { id: "what-is-bot-score", heading: "What is Bot Score?" },
    { id: "how-it-works", heading: "How It Works" },
    { id: "interpreting-scores", heading: "Interpreting Scores" },
  ]),
  page("moderation-tools", "Moderation Tools", "Tools for content moderation and quality control", [
    { id: "moderation-dashboard", heading: "Moderation Dashboard" },
    { id: "auto-moderation", heading: "Auto-Moderation Rules" },
    { id: "manual-review", heading: "Manual Review" },
  ]),
  page("payouts-and-billing", "Payouts & Billing", "Manage payments, invoices, and billing", [
    { id: "billing-overview", heading: "Billing Overview" },
    { id: "payment-methods", heading: "Payment Methods" },
    { id: "invoices", heading: "Invoices & Receipts" },
    { id: "refunds", heading: "Refunds & Disputes" },
  ]),
  page("analytics-reporting", "Analytics & Reporting", "Track campaign performance and ROI", [
    { id: "analytics-overview", heading: "Analytics Overview" },
    { id: "key-metrics", heading: "Key Metrics" },
    { id: "custom-reports", heading: "Custom Reports" },
    { id: "exporting-data", heading: "Exporting Data" },
  ]),
  page("troubleshooting", "Troubleshooting", "Common issues and how to resolve them", [
    { id: "common-issues", heading: "Common Issues" },
    { id: "account-issues", heading: "Account Issues" },
    { id: "payment-issues", heading: "Payment Issues" },
  ]),
];

export const brandCategories: DocCategory[] = [
  { id: "start-here", name: "Start Here", description: "Get up and running with Content Rewards", pages: brandPages.filter(p => ["getting-started", "workspace-setup"].includes(p.id)) },
  { id: "campaigns", name: "Campaigns", description: "Create and manage your campaigns", pages: brandPages.filter(p => ["creating-campaigns", "campaign-management", "payment-terms"].includes(p.id)) },
  { id: "submissions", name: "Submissions & Applications", description: "Review creator applications and content", pages: brandPages.filter(p => ["managing-applications", "reviewing-submissions"].includes(p.id)) },
  { id: "moderation", name: "Moderation & Fraud", description: "Bot detection and content moderation", pages: brandPages.filter(p => ["understanding-bot-score", "moderation-tools"].includes(p.id)) },
  { id: "payments", name: "Payments & Billing", description: "Payouts, billing, and refunds", pages: brandPages.filter(p => ["payouts-and-billing"].includes(p.id)) },
  { id: "analytics", name: "Analytics", description: "Track performance and measure ROI", pages: brandPages.filter(p => ["analytics-reporting"].includes(p.id)) },
  { id: "support", name: "Troubleshooting", description: "Common issues and how to resolve them", pages: brandPages.filter(p => ["troubleshooting"].includes(p.id)) },
];

// ── Creator Pages ──

const creatorPages: PageTranslation[] = [
  page("welcome-creators", "Welcome to Content Rewards", "Start your journey as a content creator", [
    { id: "what-is-cr", heading: "What is Content Rewards?" },
    { id: "how-creators-earn", heading: "How Creators Earn" },
    { id: "getting-started", heading: "Getting Started" },
  ]),
  page("setting-up-profile", "Setting Up Your Profile", "Create a profile that stands out to brands", [
    { id: "profile-basics", heading: "Profile Basics" },
    { id: "bio-portfolio", heading: "Bio & Portfolio" },
    { id: "niche-selection", heading: "Niche Selection" },
    { id: "profile-tips", heading: "Profile Tips" },
  ]),
  page("linking-social-accounts", "Linking Social Accounts", "Connect your social media platforms", [
    { id: "supported-platforms", heading: "Supported Platforms" },
    { id: "connecting-accounts", heading: "Connecting Accounts" },
    { id: "verification", heading: "Verification Process" },
    { id: "troubleshooting", heading: "Troubleshooting Connections" },
  ]),
  page("discovering-campaigns", "Discovering Campaigns", "Find the right campaigns for your audience", [
    { id: "campaign-feed", heading: "Campaign Feed" },
    { id: "search-filters", heading: "Search & Filters" },
    { id: "campaign-details", heading: "Understanding Campaign Details" },
    { id: "saved-campaigns", heading: "Saved Campaigns" },
    { id: "recommendations", heading: "Personalized Recommendations" },
  ]),
  page("applying-to-campaigns", "Applying to Campaigns", "Submit strong applications that get accepted", [
    { id: "application-process", heading: "Application Process" },
    { id: "writing-proposals", heading: "Writing Strong Proposals" },
    { id: "application-status", heading: "Application Status" },
    { id: "tips-acceptance", heading: "Tips for Getting Accepted" },
  ]),
  page("submitting-videos", "Submitting Videos", "Upload and submit your content for review", [
    { id: "submission-guidelines", heading: "Submission Guidelines" },
    { id: "uploading-content", heading: "Uploading Content" },
    { id: "review-process", heading: "Review Process" },
    { id: "revisions", heading: "Handling Revisions" },
  ]),
  page("understanding-payouts", "Understanding Payouts", "How you get paid on Content Rewards", [
    { id: "payout-structure", heading: "Payout Structure" },
    { id: "payment-schedule", heading: "Payment Schedule" },
    { id: "minimum-threshold", heading: "Minimum Threshold" },
    { id: "payment-methods", heading: "Payment Methods" },
    { id: "taxes", heading: "Taxes & Reporting" },
  ]),
  page("requesting-payouts", "Requesting Payouts", "Withdraw your earnings", [
    { id: "request-process", heading: "Request Process" },
    { id: "payout-status", heading: "Payout Status" },
    { id: "payout-issues", heading: "Resolving Payout Issues" },
  ]),
  page("trust-score-explained", "Trust Score Explained", "How your trust score affects your opportunities", [
    { id: "what-is-trust-score", heading: "What is Trust Score?" },
    { id: "factors", heading: "Score Factors" },
    { id: "improving-score", heading: "Improving Your Score" },
    { id: "score-impact", heading: "How Score Impacts Opportunities" },
  ]),
  page("creator-faq", "Creator FAQ", "Frequently asked questions for creators", [
    { id: "general", heading: "General Questions" },
    { id: "account", heading: "Account & Profile" },
    { id: "campaigns", heading: "Campaigns & Applications" },
    { id: "payments", heading: "Payments & Payouts" },
    { id: "content", heading: "Content & Submissions" },
    { id: "support", heading: "Support & Help" },
  ]),
];

export const creatorCategories: DocCategory[] = [
  { id: "start-here", name: "Start Here", description: "Get started earning with Content Rewards", pages: creatorPages.filter(p => ["welcome-creators", "setting-up-profile", "linking-social-accounts"].includes(p.id)) },
  { id: "finding-work", name: "Finding Work", description: "Discover campaigns and apply", pages: creatorPages.filter(p => ["discovering-campaigns", "applying-to-campaigns"].includes(p.id)) },
  { id: "creating-content", name: "Creating Content", description: "Submit videos and earn views", pages: creatorPages.filter(p => ["submitting-videos"].includes(p.id)) },
  { id: "getting-paid", name: "Getting Paid", description: "Understand payouts and withdrawals", pages: creatorPages.filter(p => ["understanding-payouts", "requesting-payouts"].includes(p.id)) },
  { id: "trust-reputation", name: "Trust & Reputation", description: "Maintain a strong profile", pages: creatorPages.filter(p => ["trust-score-explained"].includes(p.id)) },
  { id: "support", name: "FAQ & Support", description: "Common questions and help", pages: creatorPages.filter(p => ["creator-faq"].includes(p.id)) },
];

// ── General Pages ──

const generalPages: PageTranslation[] = [
  page("what-is-content-rewards", "What is Content Rewards?", "An overview of the platform", [
    { id: "how-it-works", heading: "How It Works" },
    { id: "why-content-rewards", heading: "Why Content Rewards?" },
  ]),
  page("getting-started", "Getting Started", "Quick start guide for new users", [
    { id: "for-brands", heading: "For Brands" },
    { id: "for-creators", heading: "For Creators" },
  ]),
  page("faq", "FAQ", "Frequently asked questions", [
    { id: "general-questions", heading: "General Questions" },
    { id: "payment-questions", heading: "Payment Questions" },
    { id: "troubleshooting", heading: "Troubleshooting" },
  ]),
];

export function getCategories(docType: DocType): DocCategory[] {
  switch (docType) {
    case "brands": return brandCategories;
    case "creators": return creatorCategories;
    default: return [];
  }
}

export function getAllPages(docType: DocType): PageTranslation[] {
  switch (docType) {
    case "brands": return brandPages;
    case "creators": return creatorPages;
    default: return generalPages;
  }
}

export function findPage(docType: DocType, pageId: string): PageTranslation | undefined {
  return getAllPages(docType).find(p => p.id === pageId);
}

export function findCategoryForPage(docType: DocType, pageId: string): DocCategory | undefined {
  return getCategories(docType).find(cat => cat.pages.some(p => p.id === pageId));
}
