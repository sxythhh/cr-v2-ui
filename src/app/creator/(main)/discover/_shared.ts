// Shared data and types for discover pages
// Re-export from the main page module

export type Platform = "youtube" | "tiktok" | "instagram" | "x";

export interface Campaign {
  id: string;
  title: string;
  brand: string;
  avatar: string;
  isVerified: boolean;
  thumbnail: string;
  budgetSpent: string;
  budgetTotal: string;
  pricePerView: string;
  progressPercentage: number;
  creators: number;
  platforms: Platform[];
  category: string;
  fundedAgo: string;
  description: string;
  bannerImage?: string;
}

export const PILL_MASK = {
  padding: 1,
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude" as const,
  WebkitMaskComposite: "xor" as const,
} as const;

export function formatCreators(n: number) {
  return n >= 1000 ? `${Math.round(n / 1000)}K` : String(n);
}

export const BANNER_CAMPAIGNS: Campaign[] = [
  {
    id: "b1", title: "Call of Duty BO7 Official Clipping Campaign", brand: "Clipping Culture", avatar: "https://i.pravatar.cc/40?img=60",
    isVerified: true, thumbnail: "/creator-home/campaign-thumb-1.png", bannerImage: "/creator-home/campaign-thumb-1.png",
    budgetSpent: "$8,677", budgetTotal: "$37,500", pricePerView: "$1.50", progressPercentage: 61, creators: 342,
    platforms: ["tiktok", "instagram"], category: "Gaming", fundedAgo: "5d", description: "We're launching a campaign to promote the new Call of Duty Warzone mode. Create engaging clips that showcase the best moments.",
  },
  {
    id: "b2", title: "Harry Styles Podcast x Shania Twain Clipping", brand: "Sound Network", avatar: "https://i.pravatar.cc/40?img=33",
    isVerified: true, thumbnail: "/creator-home/campaign-thumb-2.png", bannerImage: "/creator-home/campaign-thumb-2.png",
    budgetSpent: "$12,400", budgetTotal: "$25,000", pricePerView: "$3.50", progressPercentage: 50, creators: 128,
    platforms: ["tiktok", "youtube"], category: "Music", fundedAgo: "2d", description: "Create engaging clips from the latest Harry Styles podcast episode featuring Shania Twain.",
  },
  {
    id: "b3", title: "Mumford & Sons | Prizefighter Clipping", brand: "Scene Society", avatar: "https://i.pravatar.cc/40?img=15",
    isVerified: true, thumbnail: "/creator-home/campaign-thumb-3.png", bannerImage: "/creator-home/campaign-thumb-3.png",
    budgetSpent: "$1,240", budgetTotal: "$8,000", pricePerView: "$2.00", progressPercentage: 16, creators: 54,
    platforms: ["tiktok"], category: "Music", fundedAgo: "1d", description: "Clip the best moments from the Mumford & Sons Prizefighter music video and live performances.",
  },
];

export const FEATURED_CAMPAIGNS: Campaign[] = [
  { id: "f1", title: "Fortnite OG Season Highlights", brand: "Verse Media", avatar: "https://i.pravatar.cc/40?img=5", isVerified: true, thumbnail: "/creator-home/campaign-thumb-1.png", budgetSpent: "$4,200", budgetTotal: "$15,000", pricePerView: "$2.50", progressPercentage: 28, creators: 89, platforms: ["tiktok", "youtube"], category: "Gaming", fundedAgo: "3d", description: "Create highlight reels from the OG Fortnite season." },
  { id: "f2", title: "Taylor Swift | TTPD Recap Clips", brand: "Clipstream", avatar: "https://i.pravatar.cc/40?img=12", isVerified: true, thumbnail: "/creator-home/campaign-thumb-2.png", budgetSpent: "$7,500", budgetTotal: "$20,000", pricePerView: "$1.80", progressPercentage: 38, creators: 203, platforms: ["tiktok", "instagram"], category: "Music", fundedAgo: "6d", description: "Recap the Tortured Poets Department era with creative short clips." },
  { id: "f3", title: "NBA Playoffs Best Moments", brand: "Hoop Culture", avatar: "https://i.pravatar.cc/40?img=22", isVerified: false, thumbnail: "/creator-home/campaign-thumb-3.png", budgetSpent: "$3,100", budgetTotal: "$10,000", pricePerView: "$3.00", progressPercentage: 31, creators: 67, platforms: ["youtube", "tiktok"], category: "Sports", fundedAgo: "4d", description: "Clip the most exciting NBA playoff moments for social media." },
  { id: "f4", title: "Caffeine AI Launch Campaign", brand: "Caffeine", avatar: "https://i.pravatar.cc/40?img=18", isVerified: true, thumbnail: "/creator-home/campaign-thumb-1.png", budgetSpent: "$2,800", budgetTotal: "$12,000", pricePerView: "$4.00", progressPercentage: 23, creators: 45, platforms: ["tiktok", "instagram", "youtube"], category: "Technology", fundedAgo: "1d", description: "Showcase the new Caffeine AI product in creative short-form content." },
  { id: "f5", title: "G Fuel Summer Push", brand: "G Fuel", avatar: "https://i.pravatar.cc/40?img=30", isVerified: true, thumbnail: "/creator-home/campaign-thumb-2.png", budgetSpent: "$9,800", budgetTotal: "$30,000", pricePerView: "$1.20", progressPercentage: 33, creators: 412, platforms: ["tiktok", "youtube", "instagram"], category: "Lifestyle", fundedAgo: "7d", description: "Summer energy drink campaign. Create fun, energetic content." },
];

export const GRID_CAMPAIGNS: Campaign[] = [
  { id: "g1", title: "Apex Legends Season 21 Clips", brand: "Respawn Clips", avatar: "https://i.pravatar.cc/40?img=1", isVerified: true, thumbnail: "/creator-home/campaign-thumb-3.png", budgetSpent: "$5,600", budgetTotal: "$18,000", pricePerView: "$2.00", progressPercentage: 31, creators: 156, platforms: ["tiktok", "youtube"], category: "Gaming", fundedAgo: "2d", description: "Create viral Apex Legends clips showcasing the new season content." },
  { id: "g2", title: "Kendrick Lamar GNX Tour Clips", brand: "Sound Network", avatar: "https://i.pravatar.cc/40?img=33", isVerified: true, thumbnail: "/creator-home/campaign-thumb-1.png", budgetSpent: "$11,200", budgetTotal: "$40,000", pricePerView: "$3.50", progressPercentage: 28, creators: 278, platforms: ["tiktok", "instagram"], category: "Music", fundedAgo: "5d", description: "Clip the best moments from Kendrick Lamar's GNX tour." },
  { id: "g3", title: "Champions League Semi-Finals", brand: "Hoop Culture", avatar: "https://i.pravatar.cc/40?img=22", isVerified: false, thumbnail: "/creator-home/campaign-thumb-2.png", budgetSpent: "$2,400", budgetTotal: "$8,000", pricePerView: "$1.50", progressPercentage: 30, creators: 92, platforms: ["youtube", "tiktok"], category: "Sports", fundedAgo: "3d", description: "Create exciting clips from the Champions League semi-final matches." },
  { id: "g4", title: "Notion AI Productivity Hacks", brand: "Notion", avatar: "https://i.pravatar.cc/40?img=45", isVerified: true, thumbnail: "/creator-home/campaign-thumb-3.png", budgetSpent: "$6,300", budgetTotal: "$22,000", pricePerView: "$2.80", progressPercentage: 29, creators: 134, platforms: ["tiktok", "youtube", "instagram"], category: "Technology", fundedAgo: "4d", description: "Show creative Notion AI workflows and productivity tips." },
  { id: "g5", title: "Summer Fitness Challenge", brand: "FitClips", avatar: "https://i.pravatar.cc/40?img=8", isVerified: false, thumbnail: "/creator-home/campaign-thumb-1.png", budgetSpent: "$1,800", budgetTotal: "$6,000", pricePerView: "$1.00", progressPercentage: 30, creators: 67, platforms: ["tiktok", "instagram"], category: "Lifestyle", fundedAgo: "6d", description: "Create workout and fitness transformation content." },
  { id: "g6", title: "Valorant Champions Tour Highlights", brand: "Riot Clips", avatar: "https://i.pravatar.cc/40?img=50", isVerified: true, thumbnail: "/creator-home/campaign-thumb-2.png", budgetSpent: "$8,900", budgetTotal: "$28,000", pricePerView: "$2.20", progressPercentage: 32, creators: 245, platforms: ["tiktok", "youtube"], category: "Gaming", fundedAgo: "1d", description: "Clip the most exciting plays from the Valorant Champions Tour." },
  { id: "g7", title: "Billie Eilish Hit Me Hard Clips", brand: "Clipstream", avatar: "https://i.pravatar.cc/40?img=12", isVerified: true, thumbnail: "/creator-home/campaign-thumb-3.png", budgetSpent: "$4,700", budgetTotal: "$16,000", pricePerView: "$2.50", progressPercentage: 29, creators: 187, platforms: ["tiktok", "instagram"], category: "Music", fundedAgo: "3d", description: "Create aesthetic clips from Billie Eilish's Hit Me Hard And Soft era." },
  { id: "g8", title: "Discord Activities Promo", brand: "Discord", avatar: "https://i.pravatar.cc/40?img=55", isVerified: true, thumbnail: "/creator-home/campaign-thumb-1.png", budgetSpent: "$3,200", budgetTotal: "$10,000", pricePerView: "$3.00", progressPercentage: 32, creators: 78, platforms: ["tiktok", "youtube"], category: "Technology", fundedAgo: "2d", description: "Showcase Discord's new Activities feature in fun group content." },
  { id: "g9", title: "Premier League Highlights", brand: "SportClip", avatar: "https://i.pravatar.cc/40?img=42", isVerified: false, thumbnail: "/creator-home/campaign-thumb-2.png", budgetSpent: "$7,100", budgetTotal: "$25,000", pricePerView: "$1.80", progressPercentage: 28, creators: 312, platforms: ["youtube", "tiktok", "instagram"], category: "Sports", fundedAgo: "5d", description: "Create viral Premier League goal and skill compilations." },
];

export const ALL_CAMPAIGNS: Campaign[] = [...BANNER_CAMPAIGNS, ...FEATURED_CAMPAIGNS, ...GRID_CAMPAIGNS];
