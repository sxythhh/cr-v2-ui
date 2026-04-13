// @ts-nocheck
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/components/theme-provider";

// ── Case Study Data ──────────────────────────────────────────────────

const CASE_STUDIES: Record<string, {
  title: string;
  subtitle: string;
  logo: string;
  heroImage: string;
  challenge: string[];
  solution: string[];
  results: { bold: string; text: string }[];
  resultsExtra: string[];
  agency: string;
}> = {
  polymarket: {
    title: "Polymarket × Virality Case Study",
    subtitle: "77M+ organic views in 30 days at $0.20 CPM",
    logo: "https://i.pravatar.cc/38?u=polymarket",
    heroImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&h=300&fit=crop",
    challenge: [
      "Polymarket is the world's largest prediction market. Users trade on real-world outcomes using USDC, everything from elections to sports to geopolitics. After securing CFTC approval and landing an exclusive partnership with Dow Jones in early 2026, the platform needed to break out of crypto-native circles and reach mainstream consumers.",
      "Our goal was to flood short-form video platforms with content that felt native to the feed. Sheer volume, velocity, and cultural relevance across hundreds of creator pages, without having to build an internal content team from scratch.",
    ],
    solution: [
      "Virality architected a dual-campaign strategy and ran it through Content Rewards, the marketplace platform connecting brands with over 50,000 creators for performance-based content distribution.",
      "**UGC Reposting Campaign.** Creators reposted Polymarket-branded short-form content across TikTok, Instagram Reels, and YouTube Shorts. Over 430 creators participated, generating 2,520 approved videos. The CPM averaged $0.18, with total views exceeding 52M in the first 3 weeks.",
      "**Celebrity Clipping Campaign.** High-profile podcast and interview clips were re-edited with Polymarket overlays and distributed by niche creators. This arm drove 25M+ views at a $0.22 CPM, targeting sports betting, political commentary, and crypto-native audiences.",
      "Content Rewards handled creator onboarding, submission tracking, payout processing, and trust scoring. Virality managed campaign architecture, quality control, and the approval workflow that filtered out 634 video submissions to maintain a 68% approval rate.",
    ],
    results: [
      { bold: "77,131,852", text: " total organic views across all platforms in 30 days." },
      { bold: "$0.20", text: " blended CPM across both campaign arms." },
      { bold: "2,520", text: " approved videos from 430+ creators." },
      { bold: "68%", text: " approval rate after quality filtering 634 submissions." },
      { bold: "3 platforms", text: " — YouTube Shorts (65%), Instagram Reels (20%), TikTok (15%)." },
    ],
    resultsExtra: [
      "YouTube Shorts carried 65% of the volume. Instagram Reels contributed 20%. TikTok made up the remaining 15%.",
      "The campaign created the perception that Polymarket was everywhere. Every feed, every niche, from sports to politics to memes. That's what ghost content does at scale.",
    ],
    agency: "Virality is a content distribution (clipping) agency that connects brands with networks of creators. Brands only pay for views delivered.",
  },
  gymshark: {
    title: "GYMSHARK × Content Rewards Case Study",
    subtitle: "124M views across 4,560 creator videos in 6 months",
    logo: "https://i.pravatar.cc/38?u=gymshark",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&h=300&fit=crop",
    challenge: [
      "GYMSHARK wanted to scale their short-form content presence without growing their internal team. The fitness brand needed authentic creator-made content that felt native to gym culture — not polished ads.",
      "The goal was a continuous pipeline of clipping content across TikTok and Instagram, with volume high enough to dominate the fitness feed ecosystem.",
    ],
    solution: [
      "Content Rewards powered an always-on clipping campaign. 89 creators joined organically through the marketplace, producing content at a $4.50 CPM.",
      "**Fitness Clipping Program.** Creators clipped GYMSHARK workout tutorials, athlete interviews, and motivational content. The rolling campaign structure meant new content dropped daily across hundreds of pages.",
      "**Quality at Scale.** With 4,560 total submissions, Content Rewards' AI review caught low-quality clips early. The 72% approval rate kept content standards high while maintaining volume.",
      "Payouts were processed weekly via Stripe, keeping creator motivation high and churn low.",
    ],
    results: [
      { bold: "124,000,000", text: " total organic views." },
      { bold: "$4.50", text: " CPM across all content." },
      { bold: "4,560", text: " approved videos from 89 creators." },
      { bold: "72%", text: " approval rate." },
      { bold: "$62,000", text: " total creator payouts." },
    ],
    resultsExtra: [
      "TikTok drove 70% of views. Instagram Reels contributed 30%. The always-on model meant GYMSHARK had fresh content every single day.",
      "Creator retention was 84% month-over-month — one of the highest in the platform's history.",
    ],
    agency: "Content Rewards is a marketplace connecting brands with 50,000+ creators for performance-based content distribution. Brands only pay for views delivered.",
  },
  novapay: {
    title: "NovaPay × Virality Case Study",
    subtitle: "45.8M views driving fintech adoption at $0.15 CPM",
    logo: "https://i.pravatar.cc/38?u=novapay",
    heroImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=700&h=300&fit=crop",
    challenge: [
      "NovaPay needed to break through the noise in the crowded fintech space. Traditional advertising wasn't reaching Gen Z and millennial audiences who live on short-form video.",
      "The challenge was making a digital wallet feel exciting — not just functional. They needed content that showed real people using the product in real scenarios.",
    ],
    solution: [
      "Virality designed a clipping-first strategy using Content Rewards to recruit 156 creators across finance, lifestyle, and tech niches.",
      "**Wallet Demo Clips.** Creators filmed themselves using NovaPay for everyday transactions — splitting bills, paying rent, sending money abroad. These felt organic rather than scripted.",
      "**Crypto Integration Content.** A second campaign arm focused on NovaPay's USDC features, targeting crypto-native audiences with tutorials and reaction clips.",
      "The dual approach hit both mainstream and crypto audiences simultaneously, with Content Rewards managing the full creator lifecycle.",
    ],
    results: [
      { bold: "45,800,000", text: " total organic views across all platforms." },
      { bold: "$0.15", text: " blended CPM — below target." },
      { bold: "1,024", text: " approved videos from 156 creators." },
      { bold: "App installs up 340%", text: " during the campaign period." },
      { bold: "$38,500", text: " total spend." },
    ],
    resultsExtra: [
      "The campaign drove a measurable 340% increase in app installs during the active period, confirmed by NovaPay's attribution model.",
      "NovaPay's CMO called it 'the most cost-effective acquisition channel we've ever used.'",
    ],
    agency: "Virality is a content distribution agency specializing in fintech and crypto brands. They've managed over $2M in creator payouts through Content Rewards.",
  },
};

const SECTIONS = [
  { id: "challenge", label: "Challenge" },
  { id: "solution", label: "Solution" },
  { id: "results", label: "Results" },
  { id: "about", label: "About the Agency" },
];

// ── Parallax Banner ─────────────────────────────────────────────────

function ParallaxBanner({ heroImage, logo, title, subtitle }: { heroImage: string; logo: string; title: string; subtitle: string }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = bannerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform({ rotateX: -y * 8, rotateY: x * 8, scale: 1.02 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  return (
    <div
      ref={bannerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[648px] cursor-default overflow-hidden rounded-[10px]"
      style={{
        border: "2px solid #222222",
        transform: `perspective(800px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        transition: "transform 0.15s ease-out",
      }}
    >
      <img src={heroImage} alt="" className="h-[298px] w-full object-cover" />
      <div className="absolute inset-0 rounded-[8px]" style={{ background: "rgba(5, 5, 5, 0.51)" }} />
      <div className="absolute inset-0 flex flex-col items-start justify-center gap-[10px] p-[26px]">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="size-[38px] rounded-[5px]" />
          <div>
            <h1 className="font-inter text-[22px] font-bold leading-[24px] text-white" style={{ letterSpacing: "-1.1px" }}>
              {title}
            </h1>
            <p className="mt-0.5 font-inter text-xs font-semibold leading-[18px] text-white/50" style={{ letterSpacing: "-0.48px" }}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function CaseStudyPage() {
  const { slug } = useParams();
  const study = CASE_STUDIES[slug as string];
  const [activeSection, setActiveSection] = useState("challenge");
  const { setMode } = useTheme();
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Force light mode
  useEffect(() => {
    const prev = (localStorage.getItem("theme") as "light" | "dark" | "system") || "dark";
    setMode("light");
    return () => { setMode(prev); };
  }, [setMode]);

  // Scroll spy — find the last section whose top has scrolled past the threshold
  useEffect(() => {
    const handleScroll = () => {
      const ids = ["challenge", "solution", "results", "about"];
      let active = ids[0];
      for (const id of ids) {
        const el = sectionRefs.current.get(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) active = id;
        }
      }
      setActiveSection(active);
    };

    // Attach to all possible scroll containers
    const boundEls: EventTarget[] = [window];
    const timer = setTimeout(() => {
      let el: HTMLElement | null = sectionRefs.current.get("challenge") ?? null;
      while (el) {
        const style = getComputedStyle(el);
        if (el.scrollHeight > el.clientHeight && (style.overflowY === "auto" || style.overflowY === "scroll")) {
          boundEls.push(el);
        }
        el = el.parentElement;
      }
      boundEls.forEach((e) => e.addEventListener("scroll", handleScroll, { passive: true }));
      handleScroll();
    }, 100);

    return () => {
      clearTimeout(timer);
      boundEls.forEach((e) => e.removeEventListener("scroll", handleScroll));
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = sectionRefs.current.get(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!study) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#EBECED]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Case study not found</h1>
          <Link href="/case-studies" className="mt-4 inline-block text-sm text-[#FFA600] underline">Back to case studies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-[#EBECED] pb-24 pt-[30px]" style={{ gap: 28 }}>
      {/* Parallax hero banner — centered */}
      <div className="flex w-full justify-center px-4">
        <ParallaxBanner heroImage={study.heroImage} logo={study.logo} title={study.title} subtitle={study.subtitle} />
      </div>

      {/* Content card — centered */}
      <div className="flex w-full justify-center px-4">
        <div className="w-full max-w-[800px] overflow-hidden rounded-[10px] bg-white" style={{ boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}>
          <div className="rounded-[10px] bg-[#EBECED] p-6 sm:p-11">
            <div className="space-y-0">
              {/* Challenge */}
              <div
                id="challenge"
                ref={(el) => { if (el) sectionRefs.current.set("challenge", el); }}
                className="scroll-mt-[80px]"
              >
                <h2 className="font-inter text-[28px] font-semibold leading-[28px] text-black" style={{ letterSpacing: "-1.4px" }}>
                  Challenge
                </h2>
                {study.challenge.map((p, i) => (
                  <p key={i} className="mt-5 font-inter text-sm leading-[20px] text-black" style={{ letterSpacing: "-0.14px" }}>{p}</p>
                ))}
              </div>

              {/* Solution */}
              <div
                id="solution"
                ref={(el) => { if (el) sectionRefs.current.set("solution", el); }}
                className="scroll-mt-[80px]"
              >
                <h2 className="mt-10 font-inter text-[28px] font-semibold leading-[28px] text-black" style={{ letterSpacing: "-1.4px" }}>
                  Solution
                </h2>
                {study.solution.map((p, i) => {
                  const boldMatch = p.match(/^\*\*(.*?)\*\*(.*)/);
                  return (
                    <p key={i} className="mt-5 font-inter text-sm leading-[20px] text-black" style={{ letterSpacing: "-0.14px" }}>
                      {boldMatch ? (
                        <><strong className="font-bold">{boldMatch[1]}</strong>{boldMatch[2]}</>
                      ) : (
                        p.includes("Content Rewards") ? (
                          <>
                            {p.split("Content Rewards")[0]}
                            <a href="/" className="text-[#FFA600] underline">Content Rewards</a>
                            {p.split("Content Rewards")[1]}
                          </>
                        ) : p
                      )}
                    </p>
                  );
                })}
              </div>

              {/* Results */}
              <div
                id="results"
                ref={(el) => { if (el) sectionRefs.current.set("results", el); }}
                className="scroll-mt-[80px]"
              >
                <h2 className="mt-10 font-inter text-[28px] font-semibold leading-[28px] text-black" style={{ letterSpacing: "-1.4px" }}>
                  Results
                </h2>
                <div className="mt-5">
                  {study.results.map((r, i) => (
                    <p key={i} className="mt-1 font-inter text-sm leading-[20px] text-black" style={{ letterSpacing: "-0.14px" }}>
                      <strong className="font-bold">{r.bold}</strong>{r.text}
                    </p>
                  ))}
                </div>
                {study.resultsExtra.map((p, i) => (
                  <p key={i} className="mt-5 font-inter text-sm leading-[20px] text-black" style={{ letterSpacing: "-0.14px" }}>{p}</p>
                ))}
              </div>

              {/* About */}
              <div
                id="about"
                ref={(el) => { if (el) sectionRefs.current.set("about", el); }}
                className="scroll-mt-[80px]"
              >
                <h2 className="mt-10 font-inter text-[28px] font-semibold leading-[28px] text-black" style={{ letterSpacing: "-1.4px" }}>
                  About the Agency
                </h2>
                <p className="mt-5 font-inter text-sm leading-[20px] text-black" style={{ letterSpacing: "-0.14px" }}>
                  <a href="/" className="font-bold text-[#FFA600]">Virality</a> {study.agency.replace(/^Virality /, "")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      <Link href="/case-studies" className="font-inter text-sm font-medium text-[#78797D] underline transition-colors hover:text-black" style={{ letterSpacing: "-0.3px" }}>
        ← Back to all case studies
      </Link>

      {/* Fixed floating TOC — top right */}
      <div
        className="fixed right-6 top-24 z-50 hidden rounded-lg p-[10px] lg:block"
        style={{ background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(4.5px)", WebkitBackdropFilter: "blur(4.5px)", border: "1px solid #FFFFFF", borderRadius: 8, width: 180 }}
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 3H11.5M2.5 7H7.5M2.5 11H11.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-inter text-sm font-medium text-black" style={{ letterSpacing: "-0.42px" }}>On this page</span>
        </div>
        <div className="mt-4 flex flex-col gap-2 pl-2.5">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className="text-left font-inter text-xs font-medium transition-colors"
              style={{ letterSpacing: "-0.6px", color: activeSection === s.id ? "#FFA600" : "#1A1A1A", fontWeight: activeSection === s.id ? 700 : 500 }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed floating CTA — bottom left */}
      <div
        className="fixed bottom-6 left-6 z-50 flex max-w-[400px] items-center gap-4 rounded-xl bg-[#F7F7F7] p-4"
        style={{ boxShadow: "0px 0.6px 1.8px -0.67px rgba(0,0,0,0.1), 0px 2.3px 6.9px -1.33px rgba(0,0,0,0.11), 0px 10px 30px -2px rgba(0,0,0,0.15)" }}
      >
        <div className="flex size-[35px] shrink-0 items-center justify-center rounded-[10px] bg-[#1A1A1A]">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M9 1L2 5.5V14.5L9 19L16 14.5V5.5L9 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 10V19M9 10L2 5.5M9 10L16 5.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-inter text-sm font-bold text-black" style={{ letterSpacing: "-0.4px" }}>Ready to join Content Rewards?</p>
          <p className="font-inter text-xs font-medium text-[#78797D]" style={{ letterSpacing: "-0.3px" }}>Grow your brand organically with short-form creators.</p>
        </div>
        <button className="shrink-0 cursor-pointer rounded-2xl px-4 py-2 font-inter text-[15px] font-light text-white transition-opacity hover:opacity-90" style={{ background: "#FFA600", border: "1px solid rgba(255,255,255,0.34)", boxShadow: "inset 0px 6px 10px rgba(255,255,255,0.5)", letterSpacing: "-0.6px" }}>
          Launch
        </button>
      </div>
    </div>
  );
}
