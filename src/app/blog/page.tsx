"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { DubNav } from "@/components/lander/dub-nav";
import { AnnouncementBanner } from "@/components/lander/announcement-banner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { haptic } from "@/lib/haptics";

/* ── Blog post data ────────────────────────────────────────────── */

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  image: string;
  tags: string[];
}

const POSTS: BlogPost[] = [
  {
    id: "0",
    slug: "how-whop-powers-content-rewards",
    title: "How Whop powers Content Rewards",
    date: "Apr 10, 2026",
    image: "/images/blog-hero-2.jpg",
    tags: ["Platform"],
  },
  {
    id: "1",
    slug: "introducing-campaign-analytics-2-0",
    title: "Introducing Campaign Analytics 2.0",
    date: "Apr 07, 2026",
    image: "/images/blog-hero.jpg",
    tags: ["Analytics"],
  },
  {
    id: "2",
    slug: "creator-payouts-now-support-40-plus-countries",
    title: "Creator Payouts Now Support 40+ Countries",
    date: "Apr 01, 2026",
    image: "/images/blog-hero.jpg",
    tags: ["Payouts"],
  },
  {
    id: "3",
    slug: "new-ai-powered-content-matching",
    title: "New: AI-Powered Content Matching",
    date: "Mar 19, 2026",
    image: "/images/blog-hero.jpg",
    tags: ["Product", "Analytics"],
  },
  {
    id: "4",
    slug: "q1-2026-creator-economy-report",
    title: "Q1 2026 Creator Economy Report",
    date: "Mar 19, 2026",
    image: "/images/blog-hero.jpg",
    tags: ["Creator Economy"],
  },
  {
    id: "5",
    slug: "brand-safety-controls-for-enterprise",
    title: "Brand Safety Controls for Enterprise",
    date: "Mar 12, 2026",
    image: "/images/blog-hero.jpg",
    tags: ["Enterprise"],
  },
  {
    id: "6",
    slug: "content-rewards-mobile-app-launch",
    title: "Content Rewards Mobile App Launch",
    date: "Mar 05, 2026",
    image: "/images/blog-hero.jpg",
    tags: ["Mobile"],
  },
];

/* ── Hero slides (full-width carousel) ─────────────────────────── */

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string; // poster/fallback image (always required)
  video?: string; // optional MP4 URL — muted autoplay loop
  wistiaId?: string; // optional Wistia media ID — muted autoplay, no controls
  youtubeId?: string; // optional YouTube video ID — muted autoplay loop, no controls
  tag: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "h1",
    title: "The Future of Creator Marketing",
    subtitle: "How Content Rewards is reshaping brand-creator partnerships",
    image: "/images/blog-hero.jpg",
    tag: "Creator Economy",
  },
  {
    id: "h3",
    title: "Campaign Analytics 2.0 Deep Dive",
    subtitle: "Real-time ROI tracking, attribution models, and performance insights",
    image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=1440&h=600&fit=crop",
    wistiaId: "a32aczyu3a",
    tag: "Analytics",
  },
  {
    id: "h4",
    title: "Content Rewards Platform Demo",
    subtitle: "Watch a full walkthrough of our creator campaign tools",
    image: "/images/blog-hero.jpg",
    wistiaId: "zcm3ntzf8i",
    tag: "Platform",
  },
  {
    id: "h5",
    title: "Global Payouts for Creators",
    subtitle: "Instant payouts in 40+ countries with zero platform fees",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1440&h=600&fit=crop",
    tag: "Payouts",
  },
  {
    id: "h6",
    title: "AI-Powered Content Matching",
    subtitle: "Smart algorithms connect brands with the perfect creators",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1440&h=600&fit=crop",
    tag: "Product",
  },
  {
    id: "h7",
    title: "Content Rewards Mobile App",
    subtitle: "Manage campaigns, track earnings, and submit content on the go",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1440&h=600&fit=crop",
    tag: "Mobile",
  },
  {
    id: "h8",
    title: "Enterprise Brand Safety Controls",
    subtitle: "Advanced moderation, approval workflows, and compliance tools",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1440&h=600&fit=crop",
    tag: "Enterprise",
  },
];

const AUTOPLAY_DURATION = 6000; // ms per slide

/* ── Arrow icon (chevron) ──────────────────────────────────────── */

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === "right" ? "M9.5 4.5L17 12L9.5 19.5" : "M14.5 4.5L7 12L14.5 19.5"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── External link arrow (for header) ──────────────────────────── */

function ExternalArrowIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M6 4H16V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 4L4 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Hero Carousel ─────────────────────────────────────────────── */

/* ── Wistia embed (muted, autoplay, no controls) ─────────────── */

function WistiaEmbed({ mediaId }: { mediaId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mp4Url, setMp4Url] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Fetch direct MP4 URL from Wistia JSON API — bypasses HLS entirely
    fetch(`https://fast.wistia.com/embed/medias/${mediaId}.json`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const assets = data?.media?.assets ?? [];
        // Prefer 1080p, fall back to 720p, then md (540p), then any mp4
        const pick =
          assets.find((a: any) => a.type === "hd_mp4_video" && a.width >= 1920) ??
          assets.find((a: any) => a.type === "hd_mp4_video") ??
          assets.find((a: any) => a.type === "md_mp4_video") ??
          assets.find((a: any) => a.ext === "mp4");
        if (pick?.url) {
          // Wistia returns .bin URLs — replace with .mp4 so browser sets correct MIME type
          setMp4Url(pick.url.replace(/\.bin$/, ".mp4"));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      const v = videoRef.current;
      if (v) { v.pause(); v.src = ""; v.load(); }
    };
  }, [mediaId]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center scale-[1.8] sm:scale-[1.5]" style={{ transformOrigin: "center" }}>
        {mp4Url && (
          <video
            ref={videoRef}
            src={`${mp4Url}#t=1`}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: mp4Url ? 1 : 0 }}
          />
        )}
      </div>
    </div>
  );
}

/* ── YouTube embed (muted, autoplay, no controls, skip 1s) ──── */

function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center scale-[1.8] sm:scale-[1.5]" style={{ transformOrigin: "center" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&start=1&disablekb=1&fs=0&iv_load_policy=3`}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          className="h-full w-full border-0"
          style={{ pointerEvents: "none" }}
        />
      </div>
    </div>
  );
}

/* ── Wistia volume control (expandable slider) ───────────────── */

function WistiaVolumeControl({ heroRef, onUnmute, onMute }: { heroRef: React.RefObject<HTMLDivElement | null>; onUnmute: () => void; onMute?: () => void }) {
  const [volume, setVolume] = useState(0);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const volumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const volumeFillRef = useRef<HTMLDivElement>(null);

  const getVideos = useCallback(() => {
    const container = heroRef.current;
    if (!container) return [];
    const vids: HTMLVideoElement[] = [];
    container.querySelectorAll("video").forEach((v) => vids.push(v));
    return vids;
  }, [heroRef]);

  const applyVolume = useCallback((clientX: number) => {
    const bar = volumeBarRef.current;
    if (!bar) return 0;
    const r = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    if (volumeFillRef.current) volumeFillRef.current.style.width = `${pct * 100}%`;
    for (const v of getVideos()) { v.volume = pct; v.muted = pct === 0; }
    return pct;
  }, [getVideos]);

  const handleVolumeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    applyVolume(e.clientX);
    const onMove = (ev: MouseEvent) => applyVolume(ev.clientX);
    const onUp = (ev: MouseEvent) => {
      setVolume(applyVolume(ev.clientX));
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [applyVolume]);

  const toggleMute = useCallback(() => {
    const vids = getVideos();
    if (volume === 0) {
      for (const v of vids) { v.muted = false; v.volume = 0.75; }
      setVolume(0.75);
      onUnmute();
    } else {
      for (const v of vids) { v.muted = true; }
      setVolume(0);
      onMute?.();
    }
  }, [volume, getVideos, onUnmute, onMute]);

  const openVolume = useCallback(() => {
    if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current);
    setVolumeOpen(true);
  }, []);

  const closeVolumeDelayed = useCallback(() => {
    volumeTimerRef.current = setTimeout(() => setVolumeOpen(false), 300);
  }, []);

  return (
    <div className="absolute right-4 top-4 z-[5]" onMouseEnter={openVolume} onMouseLeave={closeVolumeDelayed}>
      <motion.div
        className="flex h-9 cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-black/50 backdrop-blur-[12px] dark:bg-white/10"
        animate={{ width: volumeOpen ? 130 : volume === 0 ? 135 : 40, paddingLeft: 12, paddingRight: volumeOpen ? 10 : volume === 0 ? 10 : 12 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        onClick={volume === 0 && !volumeOpen ? toggleMute : undefined}
      >
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center justify-center"
          onClick={toggleMute}
        >
          {volume === 0 ? (
            <svg width="16" height="11" viewBox="0 0 13 9" fill="none"><path d="M6 0.751362C6 0.133328 5.29443 -0.219458 4.8 0.151361L2.46667 1.90136C2.38012 1.96627 2.27485 2.00136 2.16667 2.00136H1.5C0.671573 2.00136 0 2.67293 0 3.50136V5.50136C0 6.32979 0.671573 7.00136 1.5 7.00136H2.16667C2.27485 7.00136 2.38012 7.03645 2.46667 7.10136L4.8 8.85136C5.29443 9.22218 6 8.8694 6 8.25136V0.751362Z" fill="white"/><path d="M8.85355 2.85489C8.65829 2.65963 8.34171 2.65963 8.14645 2.85489C7.95118 3.05015 7.95118 3.36674 8.14645 3.562L9.29289 4.70844L8.14645 5.85489C7.95118 6.05015 7.95118 6.36674 8.14645 6.562C8.34171 6.75726 8.65829 6.75726 8.85355 6.562L10 5.41555L11.1464 6.562C11.3417 6.75726 11.6583 6.75726 11.8536 6.562C12.0488 6.36674 12.0488 6.05015 11.8536 5.85489L10.7071 4.70844L11.8536 3.562C12.0488 3.36674 12.0488 3.05015 11.8536 2.85489C11.6583 2.65963 11.3417 2.65963 11.1464 2.85489L10 4.00133L8.85355 2.85489Z" fill="white"/></svg>
          ) : (
            <svg width="14" height="11" viewBox="0 0 11 9" fill="none"><path d="M6 0.751362C6 0.133328 5.29443 -0.219458 4.8 0.151361L2.46667 1.90136C2.38012 1.96627 2.27485 2.00136 2.16667 2.00136H1.5C0.671573 2.00136 0 2.67293 0 3.50136V5.50136C0 6.32979 0.671573 7.00136 1.5 7.00136H2.16667C2.27485 7.00136 2.38012 7.03645 2.46667 7.10136L4.8 8.85136C5.29443 9.22218 6 8.8694 6 8.25136V0.751362Z" fill="white"/><path d="M9.38908 0.612652C9.19381 0.41739 8.87723 0.41739 8.68197 0.612652C8.48671 0.807914 8.48671 1.1245 8.68197 1.31976C9.49686 2.13465 9.99999 3.25896 9.99999 4.50174C9.99999 5.74452 9.49686 6.86883 8.68197 7.68372C8.48671 7.87898 8.48671 8.19556 8.68197 8.39083C8.87723 8.58609 9.19381 8.58609 9.38908 8.39083C10.3838 7.39607 11 6.02038 11 4.50174C11 2.98309 10.3838 1.60741 9.38908 0.612652Z" fill="white"/><path d="M7.7981 2.20347C7.60284 2.00821 7.28626 2.00821 7.091 2.20347C6.89573 2.39873 6.89573 2.71532 7.091 2.91058C7.49871 3.3183 7.75001 3.88011 7.75001 4.50157C7.75001 5.12303 7.49871 5.68484 7.091 6.09256C6.89573 6.28782 6.89573 6.6044 7.091 6.79967C7.28626 6.99493 7.60284 6.99493 7.7981 6.79967C8.38569 6.21208 8.75001 5.39889 8.75001 4.50157C8.75001 3.60424 8.38569 2.79106 7.7981 2.20347Z" fill="white"/></svg>
          )}
        </button>
        {volume === 0 && !volumeOpen && (
          <span className="whitespace-nowrap text-xs font-medium tracking-[-0.02em] text-white" onClick={toggleMute}>Click for sound</span>
        )}
        <AnimatePresence>
          {volumeOpen && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              style={{ transformOrigin: "left" }}
              className="relative flex-1 cursor-pointer"
              ref={volumeBarRef}
              onMouseDown={handleVolumeMouseDown}
            >
              <div className="h-1.5 w-full rounded-full bg-white/20">
                <div ref={volumeFillRef} className="h-full rounded-full bg-white/60" style={{ width: `${volume * 100}%` }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const progressRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setProgress(0);
    progressRef.current = 0;
    lastTimeRef.current = 0;
    setIsPlaying(true);
  }, []);

  const goNext = useCallback(() => {
    haptic("light");
    goTo((activeIndex + 1) % HERO_SLIDES.length);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    haptic("light");
    goTo((activeIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, [activeIndex, goTo]);

  // Autoplay with progress bar
  useEffect(() => {
    if (!isPlaying) return;

    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;
      progressRef.current += delta;
      const pct = Math.min(progressRef.current / AUTOPLAY_DURATION, 1);
      setProgress(pct);

      if (pct >= 1) {
        setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        progressRef.current = 0;
        setProgress(0);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, activeIndex]);

  const slide = HERO_SLIDES[activeIndex];

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(450px, 55vw, 680px)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bottom gradient fade into page bg — dark mode only */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-32 dark:block" style={{ background: "linear-gradient(to bottom, transparent, var(--page-bg))" }} />

      {/* Static poster to prevent flash during transitions */}
      <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />

      {/* Slide media — only active slide gets video embed */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          {/* Poster — always visible, video layers on top */}
          <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Video layer — only one at a time, outside AnimatePresence */}
      <div className="absolute inset-0" key={slide.id}>
        {slide.wistiaId ? (
          <WistiaEmbed mediaId={slide.wistiaId} />
        ) : slide.youtubeId ? (
          <YouTubeEmbed videoId={slide.youtubeId} />
        ) : slide.video ? (
          <video
            key={slide.video}
            src={`${slide.video}#t=1`}
            poster={slide.image}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          ) : null}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Volume control — top right, for video slides */}
      {(slide.wistiaId || slide.youtubeId) && (
        <WistiaVolumeControl
          heroRef={heroRef}
          onUnmute={() => setIsPlaying(false)}
          onMute={() => setIsPlaying(true)}
        />
      )}

      {/* Content overlay — static, no animation */}
      <div className="absolute bottom-20 left-4 right-4 z-[1] sm:bottom-28 sm:left-16 sm:right-16">
        <TagPill label={slide.tag} onDark />
        <h1 className="mt-2 max-w-2xl cursor-pointer text-2xl font-bold leading-tight tracking-[-0.02em] text-white underline-offset-[8px] decoration-white decoration-[4px] hover:underline sm:mt-3 sm:text-5xl" style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}>
          {slide.title}
        </h1>
        <p className="mt-1 max-w-lg text-sm tracking-[-0.02em] text-white/75 sm:mt-2 sm:text-lg">
          {slide.subtitle}
        </p>
      </div>

      {/* Prev / Next arrows — centered on desktop, inline bottom on mobile */}
      {/* Desktop: centered vertically, shown on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-x-8 inset-y-0 z-[1] hidden items-center justify-between sm:flex"
          >
            <button
              type="button"
              onClick={goPrev}
              className="pointer-events-auto relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white shadow-[0_0_16px_rgba(0,0,0,0.125)] transition-colors hover:brightness-125"
            >
              <div className="absolute inset-0 rounded-full bg-[rgba(236,237,238,0.3)] backdrop-blur-[16px]" />
              <span className="relative z-[1]">
                <ChevronIcon direction="left" />
              </span>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="pointer-events-auto relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full text-white shadow-[0_0_16px_rgba(0,0,0,0.125)] transition-colors hover:brightness-125"
            >
              <div className="absolute inset-0 rounded-full bg-[rgba(236,237,238,0.3)] backdrop-blur-[16px]" />
              <span className="relative z-[1]">
                <ChevronIcon direction="right" />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar — arrows (mobile) + pagination + audio toggle */}
      <div className="absolute inset-x-0 bottom-3 z-[3] flex items-center justify-center gap-2 px-4 sm:bottom-4 sm:gap-3">
        {/* Prev arrow — mobile only */}
        <button
          type="button"
          onClick={goPrev}
          className="relative hidden shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 py-1.5 text-white"
        >
          <div className="absolute inset-0 rounded-lg bg-black/50 backdrop-blur-[12px] dark:bg-white/10" />
          <span className="relative z-[1]"><ChevronIcon direction="left" size={12} /></span>
        </button>
        <div className="relative flex items-center gap-3 rounded-xl px-3 py-2">
          {/* Background */}
          <div className="absolute inset-0 rounded-xl bg-black/50 backdrop-blur-[12px] dark:bg-white/10" />

          {/* Dots / progress indicators */}
          <div className="relative z-[1] flex items-center gap-1.5">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { haptic("light"); goTo(i); }}
                className="cursor-pointer"
                aria-label={`Go to slide ${i + 1}`}
              >
                <motion.div
                  className="h-[5px] overflow-hidden rounded-full bg-white/40"
                  animate={{ width: i === activeIndex ? 48 : 12 }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
                >
                  {i === activeIndex && (
                    <div
                      className="h-full rounded-full bg-white/60"
                      style={{ width: `${progress * 100}%` }}
                    />
                  )}
                </motion.div>
              </button>
            ))}
          </div>

          {/* Pause / Play button */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying((p) => !p);
              if (!isPlaying) {
                lastTimeRef.current = performance.now();
              }
            }}
            className="relative z-[1] flex h-5 w-5 cursor-pointer items-center justify-center overflow-hidden rounded"
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            <div className="absolute inset-0 rounded bg-[rgba(236,237,238,0.3)] backdrop-blur-[16px]" />
            <span className="relative z-[1] text-white">
              {isPlaying ? (
                /* Pause icon */
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6.5 2H3.5C3.22386 2 3 2.22386 3 2.5V13.5C3 13.7761 3.22386 14 3.5 14H6.5C6.77614 14 7 13.7761 7 13.5V2.5C7 2.22386 6.77614 2 6.5 2Z" fill="white" />
                  <path d="M12.5 2H9.5C9.22386 2 9 2.22386 9 2.5V13.5C9 13.7761 9.22386 14 9.5 14H12.5C12.7761 14 13 13.7761 13 13.5V2.5C13 2.22386 12.7761 2 12.5 2Z" fill="white" />
                </svg>
              ) : (
                /* Play icon */
                <svg width="10" height="12" viewBox="0 0 15 18" fill="none">
                  <path d="M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z" fill="white" />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* Next arrow — mobile only */}
        <button
          type="button"
          onClick={goNext}
          className="relative hidden shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 py-1.5 text-white"
        >
          <div className="absolute inset-0 rounded-lg bg-black/50 backdrop-blur-[12px] dark:bg-white/10" />
          <span className="relative z-[1]"><ChevronIcon direction="right" size={12} /></span>
        </button>
      </div>
    </div>
  );
}

/* ── Tag pill (skewed italic style) ────────────────────────────── */

function TagPill({ label, onDark = false }: { label: string; onDark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-1 font-inter text-xs font-semibold",
        onDark
          ? "text-white/75"
          : "text-foreground/50 dark:text-white/75",
      )}
      style={{
        background: "rgba(128, 128, 128, 0.1)",
        borderTop: "1px solid rgba(128, 128, 128, 0.08)",
        transform: "skewX(-8deg)",
        fontSize: "12.1px",
        lineHeight: "14px",
      }}
    >
      <span style={{ transform: "skewX(8deg)" }}>{label}</span>
    </span>
  );
}

/* ── News Card ─────────────────────────────────────────────────── */

function NewsCard({ post, onNavigate }: { post: BlogPost; onNavigate: (slug: string) => void }) {
  return (
    <div
      className="group relative shrink-0 select-none p-[6px]"
      onClick={() => onNavigate(post.slug)}
    >
      {/* Hover border — 3px with 3px gap, animates in */}
      <div className="pointer-events-none absolute inset-0 rounded-[18px] border-3 border-transparent transition-all duration-300 group-hover:border-[#FF8003]" />

      <article className="relative flex h-full w-[368px] flex-col overflow-hidden rounded-xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
        {/* Image */}
        <div className="relative h-[207px] w-full overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            draggable={false}
            className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="relative flex flex-1 flex-col justify-between gap-5 p-5">
          {/* Date + Title */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-[10px] font-bold uppercase leading-[14px] text-page-text-muted">
              {post.date}
            </span>
            <h3 className="text-base font-bold leading-5 tracking-[-0.02em] text-page-text line-clamp-2" style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}>
              {post.title}
            </h3>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

/* ── Drag-to-scroll hook (from discover page) ─────────────────── */

function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ dragging: false, wasDragging: false, startX: 0, scrollLeft: 0 });
  const pointerIdRef = useRef<number | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    state.current = { dragging: false, wasDragging: false, startX: e.clientX, scrollLeft: el.scrollLeft };
    pointerIdRef.current = e.pointerId;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (pointerIdRef.current === null) return;
    const el = ref.current;
    if (!el) return;
    const dx = Math.abs(e.clientX - state.current.startX);
    if (!state.current.dragging && dx > 5) {
      state.current.dragging = true;
      state.current.wasDragging = true;
      el.style.cursor = "grabbing";
      el.setPointerCapture(e.pointerId);
    }
    if (!state.current.dragging) return;
    e.preventDefault();
    el.scrollLeft = state.current.scrollLeft - (e.clientX - state.current.startX);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (pointerIdRef.current !== null && ref.current) {
      try { ref.current.releasePointerCapture(e.pointerId); } catch {}
    }
    pointerIdRef.current = null;
    state.current.dragging = false;
    if (ref.current) ref.current.style.cursor = "pointer";
  }, []);

  const onClick = useCallback((e: React.MouseEvent) => {
    if (state.current.wasDragging) {
      e.preventDefault();
      e.stopPropagation();
      state.current.wasDragging = false;
    }
  }, []);

  const wasDragging = useCallback(() => state.current.wasDragging, []);

  return { ref, onPointerDown, onPointerMove, onPointerUp, onClick, wasDragging };
}

/* ── News Carousel (drag-to-scroll, full-bleed) ───────────────── */

function NewsCarousel() {
  const drag = useDragScroll();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleNavigate = useCallback((slug: string) => {
    if (!drag.wasDragging()) {
      router.push(`/blog/${slug}`);
    }
    // reset after check
  }, [drag, router]);

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "right" ? 384 : -384, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  }, [updateScrollState]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Right fade mask */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-16 sm:w-24" style={{ background: "linear-gradient(to right, transparent, var(--page-bg))" }} />

      <div
        ref={(el) => {
          (drag.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
          scrollContainerRef.current = el;
        }}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        onPointerCancel={drag.onPointerUp}
        onClickCapture={drag.onClick}
        onScroll={updateScrollState}
        className="flex cursor-pointer items-stretch gap-4 overflow-x-auto scrollbar-hide"
        style={{ paddingLeft: "max(24px, calc((100% - 1213px) / 2 + 24px))" }}
      >
        {POSTS.map((post) => (
          <NewsCard key={post.id} post={post} onNavigate={handleNavigate} />
        ))}
        <div className="w-px shrink-0" />
      </div>

      {/* Navigation arrows */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-y-0 left-8 right-8 flex items-center justify-between"
          >
            <button
              type="button"
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              className={cn(
                "pointer-events-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground/50 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all hover:text-foreground dark:text-white dark:shadow-[0_0_16px_rgba(0,0,0,0.125)]",
                canScrollLeft
                  ? "border border-foreground/[0.06] bg-white/80 backdrop-blur-[16px] hover:bg-white dark:border-transparent dark:bg-[rgba(236,237,238,0.3)] dark:hover:bg-[rgba(236,237,238,0.4)]"
                  : "opacity-0",
              )}
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              className={cn(
                "pointer-events-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground/50 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all hover:text-foreground dark:text-white dark:shadow-[0_0_16px_rgba(0,0,0,0.125)]",
                canScrollRight
                  ? "border border-foreground/[0.06] bg-white/80 backdrop-blur-[16px] hover:bg-white dark:border-transparent dark:bg-[rgba(236,237,238,0.3)] dark:hover:bg-[rgba(236,237,238,0.4)]"
                  : "opacity-0",
              )}
            >
              <ChevronIcon direction="right" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-page-bg font-inter">
      <AnnouncementBanner />
      <DubNav />

      {/* Hero carousel */}
      <HeroCarousel />

      <div className="py-10">
        {/* Section header — constrained */}
        <div className="mx-auto mb-6 flex max-w-[1213px] items-center gap-1.5 px-6">
          <h2 className="text-xl font-bold capitalize leading-6 tracking-[-0.02em] text-page-text" style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}>
            News
          </h2>
          <span className="text-page-text">
            <ExternalArrowIcon />
          </span>
        </div>

        {/* Carousel — full-bleed, draggable */}
        <NewsCarousel />
      </div>
    </div>
  );
}
