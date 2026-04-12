"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { VerifiedBadge } from "@/components/verified-badge";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none";

/* ── Mock data ── */
const APPLICANT = {
  name: "Vlad Shapoval",
  avatar: "https://i.pravatar.cc/56?img=12",
  verified: true,
  verifiedCreator: true,
  trustScore: 92,
  email: "vlad@outpacestudios.com",
  bio: "Content creator specializing in gaming, tech, and lifestyle content. 350K+ followers across platforms.",
  city: "Los Angeles, CA",
};

const APPLICATION = {
  appliedOn: "2 Mar, 2026",
  campaign: "Artistic Journey: From Canvas to Digital",
  motivation: "I've been creating fashion content for 3 years and my audience loves discovering new brands. I specialize in minimalist style and sustainable fashion. My engagement rate consistently outperforms the niche average, which means the brands I promote actually get results.",
};

const ACCOUNTS = [
  { platform: "tiktok" as const, username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
  { platform: "tiktok" as const, username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
  { platform: "tiktok" as const, username: "xKaizen", views: "1.93M", engagement: "4.8%", likes: "465K", comments: "629K" },
];

const SCREENING = [
  { q: "Why do you want to join this campaign?", a: "I want to join this campaign because the type of videos are exactly up my ally." },
  { q: "Share a link to your best performing video", a: "https://www.tiktok.com/@fwogsworld/video/7447157783801203990", type: "link" as const },
  { q: "What makes you a good fit for this brand?", a: "I want to join this campaign because the type of videos are exactly up my ally." },
  { q: "Which of these categories do you like most?", a: "", chips: ["Sports", "Fashion", "Gaming"] },
  { q: "Upload your CV", a: "cv.pdf", type: "file" as const },
];

const PREV_CAMPAIGNS = [
  { brand: "Sound Network", brandLogo: "https://i.pravatar.cc/16?img=33", title: "Harry Styles Podcast x Shania Twain Clipping [7434]", model: "Retainer", modelColor: "#E57100", views: "121k", creators: "31", thumb: "/creator-home/campaign-thumb-1.png" },
  { brand: "Clipping Culture", brandLogo: "https://i.pravatar.cc/16?img=5", title: "Call of Duty BO7 Official Clipping Campaign", model: "CPM", modelColor: "#1A67E5", views: "121k", creators: "31", thumb: "/creator-home/campaign-thumb-2.png" },
  { brand: "Scene Society", brandLogo: "https://i.pravatar.cc/16?img=8", title: "Mumford & Sons | Prizefighter Clipping", model: "CPM", modelColor: "#1A67E5", views: "121k", creators: "31", thumb: "/creator-home/campaign-thumb-3.png" },
];

const STATS = [
  { value: "1.2M", label: "Followers" },
  { value: "$53,879", label: "Earned" },
  { value: "4.2%", label: "Engagement" },
  { value: "142", label: "Videos" },
];

const PLATFORM_DIST = [
  { name: "Instagram", pct: 33, color: "#AE4EEE" },
  { name: "YouTube", pct: 33, color: "#EE4E51" },
  { name: "TikTok", pct: 33, color: "#00994D" },
];

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: `${color}10` }}>
      <span className="text-page-text">{label}</span>
      <span style={{ color }}>{value}</span>
    </span>
  );
}

function AccountCard({ acc }: { acc: typeof ACCOUNTS[0] }) {
  return (
    <div className={cn(cardCls, "flex flex-col gap-2 p-3")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <PlatformIcon platform={acc.platform} size={16} className="text-page-text-subtle" />
          <span className="text-[14px] font-medium text-page-text">{acc.username}</span>
        </div>
        <svg width="14" height="14" viewBox="0 0 13 13" fill="none" className="text-page-text-subtle">
          <path d="M4.08333 2.08333H2.88333C2.1366 2.08333 1.76323 2.08333 1.47801 2.22866C1.22713 2.35649 1.02316 2.56046 0.895325 2.81135C0.75 3.09656 0.75 3.46993 0.75 4.21667V9.28333C0.75 10.0301 0.75 10.4034 0.895325 10.6887C1.02316 10.9395 1.22713 11.1435 1.47801 11.2713C1.76323 11.4167 2.1366 11.4167 2.88333 11.4167H7.95C8.69674 11.4167 9.07011 11.4167 9.35532 11.2713C9.6062 11.1435 9.81018 10.9395 9.93801 10.6887C10.0833 10.4034 10.0833 10.0301 10.0833 9.28333V8.08333M7.41667 0.75H11.4167M11.4167 0.75V4.75M11.4167 0.75L5.41667 6.75" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex flex-wrap gap-1">
        <StatPill label="Views" value={acc.views} color="#1A67E5" />
        <StatPill label="Engagement" value={acc.engagement} color="#AE4EEE" />
        <StatPill label="Likes" value={acc.likes} color="#DA5597" />
        <StatPill label="Comments" value={acc.comments} color="#00994D" />
      </div>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const [tab, setTab] = useState<"application" | "profile">("application");

  return (
    <div className="flex h-full flex-col bg-page-bg font-inter tracking-[-0.02em]">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-foreground/[0.06] px-5">
        <div className="flex flex-1 items-center">
          <Link href="/applications" className="flex items-center gap-2 text-[14px] font-medium text-page-text">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.333 8H2.667M2.667 8L6.667 4M2.667 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to applications
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex h-full items-center">
          <button
            onClick={() => setTab("application")}
            className={cn("flex h-full items-center px-5 text-[14px] font-medium transition-colors", tab === "application" ? "border-b border-page-text text-page-text" : "text-page-text-muted")}
          >
            Application
          </button>
          <button
            onClick={() => setTab("profile")}
            className={cn("flex h-full items-center px-5 text-[14px] font-medium transition-colors", tab === "profile" ? "border-b border-page-text text-page-text" : "text-page-text-muted")}
          >
            Profile
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-4">

          {tab === "application" ? (
            <>
              {/* Top row: Date + Campaign */}
              <div className="grid grid-cols-2 gap-2">
                <div className={cn(cardCls, "flex flex-col gap-2 p-3")}>
                  <span className="text-[14px] font-medium text-page-text">{APPLICATION.appliedOn}</span>
                  <span className="text-[12px] font-normal text-page-text-subtle">Applied on</span>
                </div>
                <div className={cn(cardCls, "min-w-0 overflow-hidden p-3")}>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium text-page-text">{APPLICATION.campaign}</div>
                  <div className="mt-2 text-[12px] font-normal text-page-text-subtle">Applied to</div>
                </div>
              </div>

              {/* Motivation + Accounts row */}
              <div className="grid grid-cols-2 gap-2">
                {/* Motivation */}
                <div className={cn(cardCls, "flex flex-col gap-3 p-4")}>
                  <span className="text-[12px] font-normal text-page-text-subtle">Motivation</span>
                  <p className="text-[14px] leading-[140%] text-page-text">{APPLICATION.motivation}</p>
                </div>

                {/* Applied with accounts */}
                <div className={cn(cardCls, "relative flex flex-col gap-4 py-4")}>
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[12px] font-normal text-page-text-subtle">Applied with</span>
                    <span className="text-[12px] font-medium text-page-text-subtle">{ACCOUNTS.length} accounts</span>
                  </div>
                  <div className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-card-bg to-transparent" />
                    <div className="flex max-h-[280px] flex-col gap-2 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
                      {ACCOUNTS.map((acc, i) => (
                        <AccountCard key={i} acc={acc} />
                      ))}
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card-bg to-transparent" />
                  </div>
                </div>
              </div>

              {/* Screening questions */}
              <div className="flex flex-col gap-4">
                <span className="text-[14px] font-medium text-page-text">Screening questions</span>
                <div className="flex flex-col gap-2">
                  {/* Row pairs */}
                  {Array.from({ length: Math.ceil(SCREENING.length / 2) }).map((_, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-2 gap-2">
                      {SCREENING.slice(rowIdx * 2, rowIdx * 2 + 2).map((s, i) => (
                        <div key={i} className={cn(cardCls, "flex flex-col gap-3 p-4", !s.a && !s.chips && "opacity-0")}>
                          <span className="text-[12px] font-normal text-page-text-subtle">{s.q}</span>
                          {s.type === "link" ? (
                            <div className="flex items-center gap-1.5 rounded-[14px] bg-foreground/[0.06] px-3.5 py-3 dark:bg-white/[0.06]">
                              <PlatformIcon platform="tiktok" size={16} className="shrink-0 text-page-text" />
                              <span className="min-w-0 flex-1 truncate text-[14px] text-page-text">{s.a}</span>
                              <svg width="16" height="16" viewBox="0 0 13 13" fill="none" className="shrink-0 text-page-text-muted"><path d="M4.08333 2.08333H2.88333C2.1366 2.08333 1.76323 2.08333 1.47801 2.22866C1.22713 2.35649 1.02316 2.56046 0.895325 2.81135C0.75 3.09656 0.75 3.46993 0.75 4.21667V9.28333C0.75 10.0301 0.75 10.4034 0.895325 10.6887C1.02316 10.9395 1.22713 11.1435 1.47801 11.2713C1.76323 11.4167 2.1366 11.4167 2.88333 11.4167H7.95C8.69674 11.4167 9.07011 11.4167 9.35532 11.2713C9.6062 11.1435 9.81018 10.9395 9.93801 10.6887C10.0833 10.4034 10.0833 10.0301 10.0833 9.28333V8.08333M7.41667 0.75H11.4167M11.4167 0.75V4.75M11.4167 0.75L5.41667 6.75" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          ) : s.type === "file" ? (
                            <div className="flex items-center gap-1.5 rounded-[14px] bg-foreground/[0.06] px-3.5 py-3 dark:bg-white/[0.06]">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-page-text"><path fillRule="evenodd" clipRule="evenodd" d="M7.99984 1.33398H2.6665V14.6673H13.3332V6.66732H7.99984V1.33398ZM5.33317 8.66732H8.6665V10.0007H5.33317V8.66732ZM5.33317 11.334V12.6673H10.9998V11.334H5.33317Z" fill="currentColor"/><path d="M12.9426 5.33398L9.33317 1.72451V5.33398H12.9426Z" fill="currentColor"/></svg>
                              <span className="min-w-0 flex-1 truncate text-[14px] text-page-text">{s.a}</span>
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-muted"><path d="M8 3v7M5 7l3 3 3-3M3 12v1h10v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                          ) : s.chips ? (
                            <div className="flex flex-wrap gap-2">
                              {s.chips.map((c) => (
                                <span key={c} className="rounded-full border border-foreground/[0.06] bg-card-bg px-3 py-2 text-[12px] font-medium text-page-text">{c}</span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[14px] leading-[140%] text-page-text">{s.a}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Profile tab */}
              <div className="grid grid-cols-2 gap-2">
                {/* Creator info card */}
                <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                  <div className="flex items-center gap-4">
                    <img src={APPLICANT.avatar} alt="" className="size-14 rounded-full border border-foreground/[0.06]" />
                    <div className="flex flex-1 items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[14px] font-medium text-page-text">{APPLICANT.name}</span>
                          <VerifiedBadge />
                        </div>
                        <span className="text-[12px] font-normal text-[#00994D]">Verified creator</span>
                      </div>
                      <span className="flex h-6 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-card-bg px-2 text-[12px] font-medium tracking-[-0.02em] text-[#00994D]">
                        <svg width="11" height="10" viewBox="0 0 11 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M3.07592 0.199107C2.91786 -0.0106215 2.62449 -0.0623267 2.40425 0.0807308C1.82252 0.458605 1.39925 0.936872 1.29173 1.5422C1.24772 1.79001 1.26075 2.03584 1.32006 2.27773C1.20392 2.23811 1.083 2.20401 0.958165 2.17495C0.701788 2.11526 0.443043 2.26458 0.366439 2.51642C0.164998 3.17867 0.150756 3.8161 0.460208 4.34821C0.536611 4.47958 0.628451 4.59714 0.733651 4.70206C0.609275 4.72566 0.483381 4.75695 0.356513 4.79498C0.103027 4.87097 -0.0473504 5.13131 0.0134833 5.38886C0.172676 6.06282 0.481255 6.62059 1.0154 6.92675C1.20052 7.03285 1.39835 7.10048 1.6056 7.1352C1.51473 7.20645 1.42533 7.28541 1.33782 7.37229C1.14518 7.56352 1.1403 7.87351 1.32682 8.07071C1.7561 8.52458 2.24121 8.83639 2.78588 8.89412C3.2106 8.93914 3.60999 8.82355 3.97702 8.59535C3.93262 8.7332 3.81102 8.90209 3.50866 9.05217C3.26132 9.17495 3.16033 9.475 3.28311 9.72234C3.40589 9.96969 3.70593 10.0707 3.95328 9.9479C4.56422 9.64464 4.92653 9.17105 4.99024 8.61887C5.10941 7.58597 4.17961 6.71741 3.20189 6.62728C3.21345 6.56208 3.21217 6.49359 3.19604 6.4253C3.07388 5.90815 2.86377 5.45941 2.53129 5.14027C2.56022 5.09856 2.5832 5.05176 2.59872 5.00076C2.7775 4.41301 2.80883 3.84482 2.5973 3.35245C3.13178 2.98447 3.5167 2.52521 3.61851 1.95203C3.72609 1.34631 3.49287 0.75236 3.07592 0.199107Z" fill="#00994D"/><path fillRule="evenodd" clipRule="evenodd" d="M8.09594 0.0807308C7.8757 -0.0623267 7.58233 -0.0106215 7.42427 0.199107C7.00732 0.75236 6.7741 1.34631 6.88168 1.95203C6.98349 2.52521 7.36841 2.98447 7.90289 3.35245C7.69136 3.84482 7.7227 4.41301 7.90147 5.00076C7.91699 5.05176 7.93998 5.09856 7.9689 5.14027C7.63642 5.45941 7.42631 5.90815 7.30416 6.4253C7.28802 6.49359 7.28674 6.56208 7.2983 6.62728C6.32058 6.71741 5.39078 7.58597 5.50995 8.61887C5.57366 9.17105 5.93597 9.64464 6.54691 9.9479C6.79426 10.0707 7.09431 9.96969 7.21708 9.72234C7.33986 9.475 7.23888 9.17495 6.99153 9.05217C6.68917 8.90209 6.56757 8.7332 6.52317 8.59535C6.8902 8.82355 7.2896 8.93914 7.71431 8.89412C8.25898 8.83639 8.74409 8.52458 9.17337 8.07071C9.35989 7.87351 9.35501 7.56352 9.16238 7.37229C9.07486 7.28541 8.98546 7.20645 8.89459 7.1352C9.10184 7.10048 9.29967 7.03286 9.48479 6.92675C10.0189 6.62059 10.3275 6.06282 10.4867 5.38886C10.5475 5.13131 10.3972 4.87097 10.1437 4.79498C10.0168 4.75695 9.89091 4.72566 9.76654 4.70206C9.87174 4.59714 9.96358 4.47958 10.04 4.34821C10.3494 3.8161 10.3352 3.17867 10.1338 2.51642C10.0571 2.26458 9.7984 2.11526 9.54203 2.17495C9.41719 2.20401 9.29627 2.23811 9.18013 2.27773C9.23944 2.03584 9.25247 1.79001 9.20846 1.5422C9.10094 0.936872 8.67767 0.458605 8.09594 0.0807308Z" fill="#00994D"/></svg>
                        {APPLICANT.trustScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] text-page-text-subtle">Email</span>
                      <span className="text-[14px] text-page-text">{APPLICANT.email}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] text-page-text-subtle">Bio</span>
                      <span className="text-[14px] text-page-text">{APPLICANT.bio}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[12px] text-page-text-subtle">City</span>
                      <span className="text-[14px] text-page-text">{APPLICANT.city}</span>
                    </div>
                  </div>
                </div>

                {/* Previous campaigns */}
                <div className={cn(cardCls, "flex flex-col gap-4 py-4")}>
                  <div className="px-4">
                    <span className="text-[12px] font-normal text-page-text-subtle">Previous campaigns</span>
                  </div>
                  <div className="flex flex-col gap-2 px-4">
                    {PREV_CAMPAIGNS.map((c, i) => (
                      <div key={i} className={cn(cardCls, "flex h-[102px] items-center overflow-hidden")}>
                        <div className="flex h-full shrink-0 items-center py-1 pl-1">
                          <div className="h-[94px] w-[163px] rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${c.thumb})` }} />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 px-4 py-3">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-1.5">
                              <img src={c.brandLogo} alt="" className="size-4 shrink-0 rounded-full border border-foreground/[0.06]" />
                              <span className="text-[12px] font-medium tracking-[-0.02em] text-page-text">{c.brand}</span>
                              <VerifiedBadge />
                            </div>
                            <span className="truncate text-[14px] font-medium tracking-[-0.02em] text-page-text">{c.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-card-bg px-2 text-[12px] font-medium tracking-[-0.02em]" style={{ color: c.modelColor }}>
                              {c.model === "Retainer" ? (
                                <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M2.526 0c.279 0 .505.226.505.505v.505h3.031V.505C6.062.226 6.289 0 6.568 0c.279 0 .505.226.505.505v.505h.505c.837 0 1.516.679 1.516 1.516v1.01c0 .28-.226.506-.505.506H1.01v4.041c0 .28.226.506.506.506h2.02c.28 0 .506.226.506.505 0 .28-.226.506-.505.506H1.516C.678 9.599 0 8.92 0 8.083V2.526C0 1.69.679 1.01 1.516 1.01h.505V.505C2.021.226 2.247 0 2.526 0Z" fill="currentColor"/><path d="M7.073 6.252a1.92 1.92 0 0 0-.48.088l.301.302c.16.16.047.431-.178.431H5.557a.505.505 0 0 1-.505-.505V5.41c0-.225.272-.338.431-.179l.357.357a2.323 2.323 0 0 1 1.233-.346c1.067 0 1.967.716 2.246 1.692a.505.505 0 0 1-.346.625.505.505 0 0 1-.625-.347 1.32 1.32 0 0 0-1.275-.96Z" fill="currentColor"/><path d="M5.798 7.944a.505.505 0 0 0-.971.278 2.323 2.323 0 0 0 2.246 1.692c.449 0 .873-.127 1.233-.346l.357.357c.16.159.431.047.431-.179V8.588a.505.505 0 0 0-.505-.505h-1.158c-.225 0-.338.272-.179.431l.302.302a1.92 1.92 0 0 1-.481.088 1.32 1.32 0 0 1-1.275-.96Z" fill="currentColor"/></svg>
                              ) : (
                                <svg width="12" height="12" viewBox="0 0 11 8" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5.373 0c1.976 0 3.895 1.136 5.178 3.292.26.436.26.98 0 1.417C9.268 6.864 7.349 8 5.373 8 3.397 8 1.478 6.864.195 4.708a1.36 1.36 0 0 1 0-1.417C1.478 1.136 3.397 0 5.373 0Zm-1.75 4a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0Z" fill="currentColor"/></svg>
                              )}
                              {c.model}
                            </span>
                            <span className="flex items-center gap-1 text-[12px] tracking-[-0.02em]"><span className="font-medium text-page-text">{c.views}</span> <span className="font-normal text-foreground/50">views</span></span>
                            <span className="text-[12px] text-foreground/20">&middot;</span>
                            <span className="flex items-center gap-1 text-[12px] tracking-[-0.02em]"><span className="font-medium text-page-text">{c.creators}</span> <span className="font-normal text-foreground/50">creators</span></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats card */}
              <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                <span className="text-[12px] font-normal text-page-text-subtle">Stats</span>
                <div className="grid grid-cols-4 gap-2">
                  {STATS.map((s) => (
                    <div key={s.label} className={cn(cardCls, "flex flex-col gap-2 p-3")}>
                      <span className="text-[14px] font-medium text-page-text">{s.value}</span>
                      <span className="text-[12px] text-page-text-subtle">{s.label}</span>
                    </div>
                  ))}
                </div>
                {/* Platform distribution */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    {PLATFORM_DIST.map((p) => (
                      <div key={p.name} className="h-1 flex-1 rounded-full" style={{ background: p.color }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    {PLATFORM_DIST.map((p) => (
                      <span key={p.name} className="text-[12px] font-medium" style={{ color: p.color }}>{p.name} {p.pct}%</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent content + Accounts */}
              <div className="grid grid-cols-2 gap-2">
                {/* Recent content */}
                <div className={cn(cardCls, "flex flex-col gap-4 py-4")}>
                  <div className="px-4">
                    <span className="text-[12px] font-normal text-page-text-subtle">Recent content</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto px-4" style={{ scrollbarWidth: "none" }}>
                    {[
                      { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=500&fit=crop", views: "1.7M", likes: "147.2K", shares: "781" },
                      { img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=500&fit=crop", views: "1.7M", likes: "147.2K", shares: "781" },
                      { img: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&h=500&fit=crop", views: "1.7M", likes: "147.2K", shares: "781" },
                    ].map((video, i) => (
                      <div key={i} className="relative w-[203px] shrink-0 overflow-hidden rounded-xl border border-foreground/[0.06]" style={{ aspectRatio: "9/16" }}>
                        <img src={video.img} alt="" className="absolute inset-0 size-full object-cover" style={{ filter: "brightness(0.8)" }} />
                        <div className="absolute left-3 top-3 z-10">
                          <PlatformIcon platform="tiktok" size={20} className="text-page-text-muted/50" />
                        </div>
                        <div className="relative z-10 flex size-full items-center justify-center">
                          <div className="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-[12px]">
                            <svg width="14" height="16" viewBox="-1 0 16 18" fill="none"><path d="M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z" fill="rgba(255,255,255,0.88)" /></svg>
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-white px-2 py-2 dark:bg-card-bg">
                          <div className="flex items-center gap-0.5">
                            <svg width="12" height="12" viewBox="0 0 15 11" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.16422 0C9.7987 0 12.3579 1.515 14.0687 4.389C14.415 4.971 14.415 5.696 14.0687 6.278C12.3579 9.152 9.79871 10.667 7.16423 10.667C4.52975 10.667 1.97052 9.152 0.259753 6.278C-0.0866 5.696-0.0866 4.971 0.259753 4.389C1.97051 1.515 4.52975 0 7.16422 0ZM4.83089 5.333C4.83089 4.045 5.87556 3 7.16423 3C8.45289 3 9.49756 4.045 9.49756 5.333C9.49756 6.622 8.45289 7.667 7.16423 7.667C5.87556 7.667 4.83089 6.622 4.83089 5.333Z" fill="currentColor" className="text-foreground/50"/></svg>
                            <span className="font-inter text-[10px] font-medium text-foreground/50">{video.views}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.18641 9.202C9.54627 6.75233 10.5458 3.88357 9.76141 1.92289C9.37783 0.964105 8.57397 0.279608 7.62904 0.0684003C6.76983 -0.123647 5.82263 0.0815623 5.00269 0.774778C4.18275 0.0815623 3.23555 -0.123646 2.37634 0.0684026C1.4314 0.279612 0.627549 0.964111 0.243973 1.9229C-0.540424 3.88358 0.459144 6.75234 4.81903 9.202C4.9331 9.2661 5.07234 9.2661 5.18641 9.202Z" fill="currentColor" className="text-foreground/50"/></svg>
                            <span className="font-inter text-[10px] font-medium text-foreground/50">{video.likes}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M5.375 0.626226C5.375 0.0855389 6.01504 -0.200056 6.41744 0.161074L10.6681 3.9758C10.9449 4.22416 10.9449 4.65775 10.6681 4.90611L6.41744 8.72083C6.01504 9.08196 5.375 8.79637 5.375 8.25568V6.5684C3.50325 6.59343 2.52383 6.80933 1.93452 7.14242C1.33712 7.48007 1.09878 7.95683 0.722373 8.70973L0.71041 8.73366C0.632632 8.88922 0.458107 8.97088 0.288842 8.93092C0.119578 8.89096 0 8.73987 0 8.56595C0 6.43325 0.275979 4.8384 1.18537 3.78911C2.05373 2.78714 3.42159 2.3665 5.375 2.32028V0.626226Z" fill="currentColor" className="text-foreground/50"/></svg>
                            <span className="font-inter text-[10px] font-medium text-foreground/50">{video.shares}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accounts */}
                <div className={cn(cardCls, "relative flex flex-col gap-4 py-4")}>
                  <div className="flex items-center justify-between px-4">
                    <span className="text-[12px] font-normal text-page-text-subtle">Accounts</span>
                    <span className="text-[12px] font-medium text-page-text-subtle">12 accounts</span>
                  </div>
                  <div className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-card-bg to-transparent" />
                    <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
                      {[...ACCOUNTS, ...ACCOUNTS].map((acc, i) => (
                        <AccountCard key={i} acc={acc} />
                      ))}
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card-bg to-transparent" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-foreground/[0.06] bg-page-bg px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] opacity-30">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {/* Creator info */}
          <div className="flex items-center gap-3">
          <img src={APPLICANT.avatar} alt="" className="size-9 rounded-full border border-foreground/[0.06]" />
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] font-medium text-page-text">{APPLICANT.name}</span>
              <VerifiedBadge />
            </div>
            <span className="text-[12px] font-normal text-[#00994D]">Verified creator</span>
          </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-medium text-page-text-subtle">
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M7 0c2.043 0 3.793.528 5.045 1.571C13.311 2.627 14 4.156 14 6s-.689 3.373-1.955 4.429C10.793 11.472 9.043 12 7 12c-1.08 0-2.295-.1-3.39-.575-.185.104-.442.23-.746.336-.634.22-1.558.375-2.483-.063a.5.5 0 0 1-.242-.876c.459-.605.604-1.075.644-1.375.038-.29-.016-.455-.022-.473l.001.001-.001-.002-.006-.014-.009-.02a6.8 6.8 0 0 1-.4-1.092C.18 7.212 0 6.544 0 6c0-1.844.689-3.373 1.955-4.429C3.207.528 4.957 0 7 0z" fill="currentColor" opacity="0.5"/></svg>
            Message
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-[#FF2525]/[0.06] px-3 py-1.5 text-[14px] font-medium text-[#FF3355]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M0 6.667C0 2.985 2.985 0 6.667 0c3.682 0 6.666 2.985 6.666 6.667 0 3.682-2.984 6.666-6.666 6.666C2.985 13.333 0 10.349 0 6.667zm5.138-2.472a.667.667 0 0 0-.943.943l1.529 1.529-1.53 1.528a.667.667 0 1 0 .944.943l1.529-1.528 1.528 1.528a.667.667 0 0 0 .943-.943L7.61 6.667l1.528-1.53a.667.667 0 0 0-.943-.942L6.667 5.724 5.138 4.195z" fill="#FF3355"/></svg>
            Reject
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 py-1.5 text-[14px] font-medium text-page-text">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7 14a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm3.024-8.524a.75.75 0 0 0-1.048-1.076L5.95 7.426 5.024 6.5a.75.75 0 0 0-1.048 1.076l1.45 1.45a.75.75 0 0 0 1.048 0l3.55-3.55z" fill="currentColor"/></svg>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
