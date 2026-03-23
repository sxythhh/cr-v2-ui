export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  gradient: string;
  icon: string;
  featured?: boolean;
  content: ArticleSection[];
}

export interface ArticleSection {
  id: string;
  heading: string;
  body: string;
}

export const CATEGORIES = [
  "All",
  "Growth",
  "Strategy",
  "Creator Economy",
  "Case Studies",
  "Product",
] as const;

export const ARTICLES: Article[] = [
  {
    slug: "creator-marketing-playbook-2026",
    title: "The Creator Marketing Playbook for 2026",
    description:
      "A comprehensive guide to building and scaling creator-led campaigns that drive real results.",
    category: "Strategy",
    readTime: "12 min",
    date: "Mar 2026",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    icon: "🎯",
    featured: true,
    content: [
      {
        id: "why-creator-marketing",
        heading: "Why Creator Marketing Is Eating the World",
        body: "Traditional advertising is losing its grip. In 2026, 72% of consumers trust creator recommendations over brand ads. The shift isn't slowing down — it's accelerating. Brands that build authentic creator relationships are seeing 3-5x higher engagement rates and 40% lower customer acquisition costs compared to paid media alone.",
      },
      {
        id: "finding-creators",
        heading: "Finding the Right Creators",
        body: "The biggest mistake brands make is chasing follower counts. The sweet spot is creators with 10K-100K followers who have genuine community engagement. Look for creators whose audience demographics match your target customer. Use tools like Content Rewards to filter by niche, engagement rate, and audience geography.",
      },
      {
        id: "campaign-structure",
        heading: "Structuring Your Campaign",
        body: "Every successful campaign has three phases: seeding (5-10 creators testing your product), amplification (scaling to 50+ creators with proven messaging), and optimization (doubling down on top performers). Budget allocation should follow a 20/50/30 split across these phases.",
      },
      {
        id: "measuring-roi",
        heading: "Measuring ROI Beyond Views",
        body: "Views are vanity metrics. Track effective CPM, cost per acquisition, and creator retention rate. The best campaigns see a 30-day trailing ROAS of 4x+. Use UTM parameters and unique discount codes to attribute revenue directly to creator content.",
      },
      {
        id: "scaling",
        heading: "Scaling What Works",
        body: "Once you've identified your top 20% of creators, build long-term partnerships. Offer tiered commission structures, early product access, and co-creation opportunities. Brands that retain creators for 6+ months see 2x higher content performance vs. one-off campaigns.",
      },
    ],
  },
  {
    slug: "ugc-vs-influencer-marketing",
    title: "UGC vs Influencer Marketing: What Actually Works",
    description:
      "Breaking down the real differences, costs, and results of UGC and influencer campaigns.",
    category: "Strategy",
    readTime: "8 min",
    date: "Mar 2026",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    icon: "⚡",
    content: [
      {
        id: "the-difference",
        heading: "The Real Difference",
        body: "UGC (User-Generated Content) is content created by everyday users or micro-creators that feels authentic and relatable. Influencer marketing leverages established personalities with built-in audiences. The distinction matters because each serves a different purpose in your marketing funnel.",
      },
      {
        id: "cost-comparison",
        heading: "Cost Comparison",
        body: "UGC campaigns typically cost $50-500 per piece of content, while influencer partnerships range from $500-50,000+ depending on reach. However, UGC content can be repurposed across paid ads, landing pages, and email — extending its value far beyond the initial creation cost.",
      },
      {
        id: "when-to-use",
        heading: "When to Use Each",
        body: "Use UGC for social proof, ad creative, and product pages. Use influencer marketing for awareness, launches, and reaching new audiences. The most effective brands use both — UGC for conversion and influencers for top-of-funnel reach.",
      },
    ],
  },
  {
    slug: "how-caffeine-ai-scaled-creator-program",
    title: "How Caffeine AI Scaled to 500 Creators in 90 Days",
    description:
      "A deep dive into how Caffeine AI used Content Rewards to build a creator army that drove 2M+ views.",
    category: "Case Studies",
    readTime: "6 min",
    date: "Feb 2026",
    gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    icon: "📈",
    featured: true,
    content: [
      {
        id: "the-challenge",
        heading: "The Challenge",
        body: "Caffeine AI launched with a $10K monthly marketing budget and zero brand awareness. They needed to generate authentic content at scale without the overhead of a traditional agency. Their target: reach Gen Z productivity enthusiasts on TikTok and Instagram.",
      },
      {
        id: "the-approach",
        heading: "The Approach",
        body: "Using Content Rewards, Caffeine AI launched an open campaign with a $15 CPM rate. They set clear content guidelines but gave creators freedom in execution. Within the first week, 47 creators applied. By month two, they had 200+ active creators producing content weekly.",
      },
      {
        id: "the-results",
        heading: "The Results",
        body: "In 90 days: 500 active creators, 2.1M total views, $0.84 effective CPM, and a 4.2% average engagement rate. Their best-performing creator generated 680K views from a single TikTok. The total spend was $28,500 — less than what a single influencer partnership would have cost.",
      },
    ],
  },
  {
    slug: "optimizing-creator-payouts",
    title: "Optimizing Creator Payouts for Maximum Retention",
    description:
      "Why your payout structure is the #1 factor in creator retention — and how to get it right.",
    category: "Growth",
    readTime: "7 min",
    date: "Feb 2026",
    gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
    icon: "💰",
    content: [
      {
        id: "retention-problem",
        heading: "The Retention Problem",
        body: "80% of creator programs lose half their creators within 60 days. The #1 reason? Unclear or unfair payout structures. Creators talk — and a reputation for slow or confusing payments spreads fast in creator communities.",
      },
      {
        id: "payout-models",
        heading: "Payout Models That Work",
        body: "The most successful programs use a hybrid model: base pay per submission + performance bonuses based on views or engagement. This gives creators a guaranteed floor while incentivizing quality. Net-30 payment terms are standard, but net-14 or instant payouts are a major competitive advantage.",
      },
      {
        id: "transparency",
        heading: "Radical Transparency",
        body: "Show creators exactly how their earnings are calculated. Real-time dashboards, clear CPM rates, and proactive communication about payment timelines build trust. Platforms like Content Rewards automate this — creators see their earnings update in real-time as views accumulate.",
      },
    ],
  },
  {
    slug: "tiktok-content-strategy-brands",
    title: "TikTok Content Strategy for Brands in 2026",
    description:
      "The algorithm has changed. Here's what's working now for brand content on TikTok.",
    category: "Growth",
    readTime: "10 min",
    date: "Jan 2026",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    icon: "🎵",
    content: [
      {
        id: "algorithm-update",
        heading: "The 2026 Algorithm Shift",
        body: "TikTok's algorithm now heavily weights watch time and saves over likes and shares. Content that educates or tells a story in the first 3 seconds performs 2.5x better than trend-chasing content. The era of low-effort trend hopping is over.",
      },
      {
        id: "content-formats",
        heading: "Formats That Convert",
        body: "POV/skit format drives the highest engagement for brand content. Reaction videos and 'day in my life' integrations outperform traditional product reviews. The key is making the brand integration feel like a natural part of the story, not the point of the video.",
      },
      {
        id: "posting-cadence",
        heading: "Optimal Posting Strategy",
        body: "For brand accounts: 3-5 posts per week. For creator campaigns: encourage daily posting during campaign windows. The best posting times vary by niche, but 6-9 PM EST consistently performs well across categories. Use Content Rewards' analytics to find your audience's peak activity hours.",
      },
    ],
  },
  {
    slug: "building-creator-community",
    title: "Building a Creator Community That Lasts",
    description:
      "How to turn one-off creator relationships into a thriving, self-sustaining community.",
    category: "Creator Economy",
    readTime: "9 min",
    date: "Jan 2026",
    gradient: "from-cyan-500/20 via-teal-500/10 to-transparent",
    icon: "🤝",
    content: [
      {
        id: "beyond-transactions",
        heading: "Beyond Transactional Relationships",
        body: "The brands winning in 2026 treat creators as partners, not vendors. This means giving creators a voice in product development, featuring them in brand storytelling, and creating exclusive spaces where creators can connect with each other.",
      },
      {
        id: "community-structure",
        heading: "Community Structure",
        body: "Start with a private Discord or Slack channel for your top creators. Host monthly virtual meetups. Create tiered levels (Bronze, Silver, Gold) with escalating perks. The goal is to make creators feel like insiders, not interchangeable content machines.",
      },
      {
        id: "long-term-value",
        heading: "The Long-Term Value",
        body: "Brands with active creator communities see 60% higher creator retention, 3x more organic content creation, and significantly lower recruitment costs. Your best creators become your best recruiters — they bring in friends and colleagues who share the same passion for your brand.",
      },
    ],
  },
  {
    slug: "content-rewards-product-update-march",
    title: "What's New: AI Quality Scoring & Campaign Health",
    description:
      "A look at our latest features — AI-powered content scoring, campaign health dashboards, and more.",
    category: "Product",
    readTime: "4 min",
    date: "Mar 2026",
    gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    icon: "✨",
    content: [
      {
        id: "ai-quality",
        heading: "AI Quality Scoring",
        body: "Every submission now receives an AI quality score from 0-100, analyzing content against your campaign guidelines, brand safety, and engagement potential. This helps brands prioritize reviews and gives creators actionable feedback on how to improve their content.",
      },
      {
        id: "campaign-health",
        heading: "Campaign Health Dashboard",
        body: "The new Campaign Health tab gives you a single score (0-100) measuring fill rate, engagement, approval rate, CPM efficiency, and creator quality. It's your at-a-glance indicator of whether a campaign is on track or needs attention.",
      },
      {
        id: "discover-page",
        heading: "Enhanced Discover Page Analytics",
        body: "Track impressions, clicks, applications, and join rates for your campaigns on the Discover page. See which campaigns are attracting the most creator interest and optimize your campaign cards for maximum conversion.",
      },
    ],
  },
];
