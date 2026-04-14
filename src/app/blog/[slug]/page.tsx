"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { DubNav } from "@/components/lander/dub-nav";
import { AnnouncementBanner } from "@/components/lander/announcement-banner";
import { PreviewCard } from "@base-ui/react/preview-card";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

/* ── Types ────────────────────────────────────────────────────── */

interface BlogPostDetail {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  heroImage: string;
  intro: string;
  sections: Section[];
}

type Section =
  | { type: "text"; content: string }
  | { type: "heading"; level: 2 | 3; content: string }
  | { type: "bullets"; items: string[] }
  | { type: "gallery"; images: { src: string; alt: string }[] }
  | { type: "separator" };

/* ── Mock Data ────────────────────────────────────────────────── */

const BLOG_POSTS: BlogPostDetail[] = [
  {
    slug: "chase-greatness-in-fortnite-arenas",
    title: "Fortnite Battle Royale Chapter Seven: Pacific Break - v39.00 Update Notes",
    date: "Nov 29, 2025",
    tags: ["Battle Royale", "Reload"],
    heroImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1440&h=708&fit=crop",
    intro: "Chapter Seven: Pacific Break kicks off a new era for Fortnite Battle Royale, where some of the greatest stories are told \u2014 the Golden Coast.",
    sections: [
      { type: "heading", level: 2, content: "New Battle Royale Map - Golden Coast" },
      {
        type: "text",
        content: "On the Island, explore a sun-soaked paradise on foot, by car, or through the air in new <a href=\"https://example.com\">hot air balloons</a>. These locations are your next backdrop. Check out the <a href=\"https://example.com\">full patch notes</a> for more details:",
      },
      {
        type: "bullets",
        items: [
          "<strong>Battlewood Boulevard</strong>",
          "<strong>Sandy Strip</strong>",
          "<strong>Wonkeeland</strong>",
          "<strong>Humble Hills</strong>",
          "<strong>Bumpy Bay</strong>",
          "<strong>Classified Canyon</strong>",
          "<strong>And more to explore!</strong>",
        ],
      },
      {
        type: "gallery",
        images: [
          { src: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1261&h=709&fit=crop", alt: "Battlewood Boulevard" },
          { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1261&h=709&fit=crop", alt: "Sandy Strip" },
          { src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1261&h=709&fit=crop", alt: "Wonkeeland" },
          { src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1261&h=709&fit=crop", alt: "Humble Hills" },
        ],
      },
      { type: "heading", level: 2, content: "New Battle Pass" },
      {
        type: "text",
        content: "Purchase the <a href=\"https://example.com\">Battle Pass</a> and seek revenge as The Bride, rep the future as <strong>Marty McFly</strong>, and unlock Fortnite originals like <a href=\"https://example.com\">Miles Cross</a> and Cat Holloway...plus a new version of Dark Voyager!",
      },
      {
        type: "text",
        content: "In addition to their other unlockable Styles, the Battle Pass includes special Styles for three of the Outfits: Cat Holloway, Carter Wu, and Dark Voyager (Reality Redacted). You can only unlock these additional Styles by completing Quests in Blitz Royale, Reload, and Battle Royale respectively.",
      },
      {
        type: "gallery",
        images: [
          { src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1261&h=709&fit=crop", alt: "Battle Pass rewards" },
          { src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1261&h=709&fit=crop", alt: "Battle Pass skins" },
        ],
      },
      { type: "heading", level: 2, content: "New Loot Pool" },
      { type: "heading", level: 3, content: "Weapons & Mobility" },
      {
        type: "text",
        content: "New weapons are more responsive with layered recoil and smoother ADS transitions. Read the <a href=\"https://example.com\">weapon balance overview</a> for detailed stats. Reload progress is now saved when your magazine is empty. Start a reload, and if you swap weapons or get interrupted, pick up right where you left off!",
      },
      {
        type: "bullets",
        items: [
          "<strong>Iron Pump Shotgun</strong>",
          "<strong>Twin Hammer Shotguns</strong> \u2014 dual-wield shotguns that alternate fire for devastating close-range damage",
          "<strong>Deadeye Assault Rifle</strong> \u2014 semi-auto precision rifle with enhanced first-shot accuracy",
          "<strong>Holo Rush SMG</strong> \u2014 high fire rate with holographic sight for improved hip-fire accuracy",
          "<strong>Vengeful Sniper Rifle</strong>",
          "<strong>Arc-Lightning Gun</strong>",
          "<strong>Forsaken Vow Blade</strong> \u2014 melee weapon that gains damage with consecutive hits",
        ],
      },
      {
        type: "gallery",
        images: [
          { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1261&h=709&fit=crop", alt: "Iron Pump Shotgun" },
          { src: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=1261&h=709&fit=crop", alt: "Twin Hammer Shotguns" },
          { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1261&h=709&fit=crop", alt: "Deadeye Assault Rifle" },
          { src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1261&h=709&fit=crop", alt: "Holo Rush SMG" },
          { src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1261&h=709&fit=crop", alt: "Vengeful Sniper Rifle" },
          { src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1261&h=709&fit=crop", alt: "Arc-Lightning Gun" },
          { src: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1261&h=709&fit=crop", alt: "Forsaken Vow Blade" },
        ],
      },
      {
        type: "text",
        content: "<strong>Wingsuits</strong> \u2014 deploy a wingsuit after jumping from height to glide across the map. Perfect for rotating between zones or escaping the storm.",
      },
      {
        type: "gallery",
        images: [
          { src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1261&h=709&fit=crop", alt: "Wingsuit gameplay" },
        ],
      },
      { type: "separator" },
      {
        type: "text",
        content: "Once the Battle Bus is back in commission on December 4, Reload will come back online with the new Surf City map, Blitz Royale will light back up with the new <strong>Starfall Island</strong>, and Ranked will return. Fortnite OG will return on December 11 with Season 7 and Delulu will return on December 12!",
      },
      {
        type: "gallery",
        images: [
          { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1261&h=709&fit=crop", alt: "Surf City" },
          { src: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=1261&h=709&fit=crop", alt: "Starfall Island" },
        ],
      },
      {
        type: "text",
        content: "\u2060Keep the party going with new developer made islands and updates, inspired by Pacific Break and brought to you for Chapter Seven in partnership with Epic. Find them in the Inspired by Chapter Seven row in Discover.",
      },
      { type: "text", content: "Catch you on the Golden Coast! Follow us on <a href=\"https://example.com\">Twitter</a> and <a href=\"https://example.com\">Discord</a> for the latest updates." },
    ],
  },
  {
    slug: "star-wars-tools-now-live-for-fortnite-developers",
    title: "STAR WARS\u2122 Tools Now Live for Fortnite Developers \u2014 Create Your Galaxy Today",
    date: "Apr 01, 2026",
    tags: ["UEFN and Creative"],
    heroImage: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=1440&h=708&fit=crop",
    intro: "The Force is strong with Fortnite creators. An all-new suite of STAR WARS\u2122 themed assets, prefabs, and gameplay devices are now available in UEFN.",
    sections: [
      { type: "heading", level: 2, content: "What's Included in the Toolkit" },
      { type: "text", content: "The toolkit includes over <strong>200 new assets</strong> spanning environments, characters, vehicles, and audio. From the deserts of Tatooine to the corridors of a Star Destroyer, creators can now build authentic Star Wars experiences." },
      { type: "bullets", items: ["Over 200 prefabs including iconic locations", "Lightsaber and blaster gameplay devices", "Ambient soundscapes and music loops", "Character costumes and NPC behaviors", "Full integration with Verse scripting"] },
      { type: "gallery", images: [{ src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1261&h=709&fit=crop", alt: "UEFN tools" }, { src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1261&h=709&fit=crop", alt: "Star Wars assets" }] },
      { type: "separator" },
      { type: "heading", level: 2, content: "Building Your First Star Wars Island" },
      { type: "text", content: "Getting started is straightforward. Open UEFN, navigate to the new <a href=\"#\">Star Wars Content Pack</a> in the content browser, and drag assets directly onto your island." },
    ],
  },
  {
    slug: "fortnite-returns-to-google-play-worldwide",
    title: "Fortnite Returns to Google Play Worldwide",
    date: "Mar 19, 2026",
    tags: ["Battle Royale", "Fortnite Festival"],
    heroImage: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1440&h=708&fit=crop",
    intro: "After years of absence, Fortnite is officially back on Google Play. Android users worldwide can download Fortnite directly from the Google Play Store.",
    sections: [
      { type: "heading", level: 2, content: "Why This Matters" },
      { type: "text", content: "The return to <a href=\"https://example.com\">Google Play</a> removes a significant barrier for mobile players. With <strong>one-tap installation</strong>, millions of new players can access Fortnite instantly. See our <a href=\"https://example.com\">mobile optimization guide</a> for the best experience." },
      { type: "heading", level: 3, content: "Mobile Performance Improvements" },
      { type: "bullets", items: ["60 FPS support on flagship Android devices", "Reduced app size from 8GB to 4.2GB", "Improved touch controls with customizable HUD", "Cross-progression and cross-play with all platforms", "Battery optimization mode"] },
      { type: "gallery", images: [{ src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1261&h=709&fit=crop", alt: "Mobile gaming" }] },
      { type: "separator" },
      { type: "heading", level: 2, content: "Download Now" },
      { type: "text", content: "Head to the <a href=\"https://example.com\">Google Play Store</a> and search for Fortnite. New players who download before April 15 receive the exclusive <a href=\"https://example.com\">Neon Byte outfit</a> and 1,000 V-Bucks." },
    ],
  },
];

/* ── Helpers ─────────────────────────────────────────────────── */

function estimateReadTime(post: BlogPostDetail): number {
  let words = post.intro.split(/\s+/).length;
  for (const s of post.sections) {
    if (s.type === "text") words += s.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    if (s.type === "heading") words += s.content.split(/\s+/).length;
    if (s.type === "bullets") {
      for (const item of s.items) words += item.replace(/<[^>]*>/g, "").split(/\s+/).length;
    }
  }
  return Math.max(1, Math.ceil(words / 200));
}

/* ── Chevron icon ─────────────────────────────────────────────── */

function ChevronIcon({ direction, size = 20 }: { direction: "left" | "right"; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
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

/* ── Image Gallery (carousel with thumbnails) ─────────────────── */

function ImageGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goPrev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const goNext = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  if (images.length === 1) {
    return (
      <div className="flex flex-col gap-2">
        <div className="overflow-hidden rounded-xl">
          <img src={images[0].src} alt={images[0].alt} loading="lazy" className="aspect-video w-full object-cover" />
        </div>
        {images[0].alt && (
          <p className="text-center font-inter text-sm tracking-[-0.02em] text-page-text-muted">{images[0].alt}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active].src}
            alt={images[active].alt}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="aspect-video w-full object-cover"
          />
        </AnimatePresence>

        {/* Prev / Next */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-between px-6"
            >
              <button
                type="button"
                onClick={goPrev}
                className={cn(
                  "pointer-events-auto relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-md",
                  active === 0 ? "opacity-0" : "",
                )}
              >
                <div className="absolute inset-0 rounded-md bg-[rgba(236,237,238,0.1)] backdrop-blur-[16px]" />
                <span className="relative z-[1] text-white/35">
                  <ChevronIcon direction="left" />
                </span>
              </button>
              <button
                type="button"
                onClick={goNext}
                className="pointer-events-auto relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-md"
              >
                <div className="absolute inset-0 rounded-md bg-white/80 dark:bg-[rgba(236,237,238,0.3)] dark:backdrop-blur-[16px]" />
                <span className="relative z-[1] text-black dark:text-white">
                  <ChevronIcon direction="right" />
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Caption */}
      {images[active].alt && (
        <p className="text-center font-inter text-sm tracking-[-0.02em] text-page-text-muted">{images[active].alt}</p>
      )}

      {/* Thumbnail strip */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative h-[54px] w-24 cursor-pointer overflow-hidden rounded-lg transition-all duration-200",
              i === active
                ? "border-[3px] border-[#FF8003] opacity-100"
                : "border-[3px] border-transparent opacity-65 hover:opacity-100",
            )}
          >
            <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full rounded-[5px] object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Tag pill ─────────────────────────────────────────────────── */

function TagPill({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded px-2 py-1 font-inter text-xs font-semibold text-foreground/50 dark:text-white/75"
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

/* ── Drag-to-scroll hook ──────────────────────────────────────── */

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
    const dx = e.clientX - state.current.startX;
    if (!state.current.dragging && Math.abs(dx) > 4) {
      state.current.dragging = true;
      state.current.wasDragging = true;
      el.setPointerCapture(pointerIdRef.current);
    }
    if (state.current.dragging) {
      el.scrollLeft = state.current.scrollLeft - dx;
    }
  }, []);

  const onPointerUp = useCallback(() => {
    state.current.dragging = false;
    pointerIdRef.current = null;
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

/* ── "More Like This" card (vertical, NewsCard-style) ─────────── */

function MoreLikeThisCard({ post, onClick }: { post: BlogPostDetail; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative block w-[368px] shrink-0 cursor-pointer select-none p-[6px]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[18px] border-3 border-transparent transition-all duration-300 group-hover:border-[#FF8003]" />
      <article className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden">
          <img
            src={post.heroImage}
            alt={post.title}
            draggable={false}
            loading="lazy"
            className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-3 p-5">
          <div className="flex flex-col gap-3">
            <span className="font-inter text-[10px] font-bold uppercase leading-[14px] tracking-[-0.02em] text-page-text-muted">
              {post.date}
            </span>
            <h3
              className="line-clamp-2 text-base font-bold leading-5 text-page-text"
              style={{ fontFamily: "var(--font-fm-universe), sans-serif" }}
            >
              {post.title}
            </h3>
          </div>
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

/* ── Reading Progress Bar ─────────────────────────────────────── */

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px]">
      <div
        className="h-full transition-[width] duration-75 ease-linear"
        style={{ width: `${progress}%`, backgroundColor: "#FF8003" }}
      />
    </div>
  );
}

/* ── Share buttons ────────────────────────────────────────────── */

function ShareButtons() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleShareX = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://x.com/intent/tweet?url=${url}`, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-foreground/[0.06] px-3 py-1.5 font-inter text-xs tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-foreground/[0.06]"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={handleShareX}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-foreground/[0.06] px-3 py-1.5 font-inter text-xs tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-foreground/[0.06]"
      >
        Share on X
      </button>
    </div>
  );
}

/* ── Ask AI floating widget ───────────────────────────────────── */

function AskAiWidget() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        ref={btnRef}
        type="button"
        onMouseMove={handleMouseMove}
        className="group relative flex cursor-pointer items-center overflow-hidden rounded-[20px]"
        style={{ padding: "1.5px" }}
      >
        {/* Outer border — default subtle */}
        <div className="absolute inset-0 rounded-[20px] bg-white/[0.08]" />
        {/* Outer border — hover orange glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(100px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,128,3,0.7), rgba(255,128,3,0.25) 50%, transparent 70%)`,
          }}
        />

        {/* Inner pill */}
        <div className="relative flex items-center rounded-[18.5px] bg-[#1C1C1C] px-4 py-3">
          {/* Inner border */}
          <div className="pointer-events-none absolute inset-0 rounded-[18.5px] border-[1.5px] border-white/[0.06]" />

          {/* Platform icons */}
          <div className="flex items-center gap-[1.5px]">
            <div className="flex h-[19px] w-[19px] items-center justify-center overflow-hidden rounded-[4px]">
              <img src="/images/ask-ai/icon-1.png" alt="" className="h-[19px] w-[19px] object-cover" draggable={false} />
            </div>
            <div className="flex h-[16px] w-[16px] items-center justify-center overflow-hidden rounded-[4px]">
              <img src="/images/ask-ai/icon-2.png" alt="" className="h-[16px] w-[16px] object-cover" draggable={false} />
            </div>
            <div className="flex h-[19px] w-[19px] items-center justify-center overflow-hidden rounded-[4px]">
              <img src="/images/ask-ai/icon-3.png" alt="" className="h-[19px] w-[19px] object-cover" draggable={false} />
            </div>
          </div>

          {/* Text */}
          <span className="ml-2 text-xs font-semibold leading-[21px] tracking-[-0.4px] text-white">
            Ask AI
          </span>
        </div>
      </button>
    </div>
  );
}

/* ── Preview Card Link ───────────────────────────────────────── */

function PreviewLink({ href, children }: { href: string; children: React.ReactNode }) {
  const domain = (() => { try { return new URL(href).hostname; } catch { return href; } })();

  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        href={href}
        className="inline text-[#FF8003] underline decoration-[#FF8003]/30 underline-offset-2 transition-colors hover:decoration-[#FF8003]"
      >
        {children}
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={10}>
          <PreviewCard.Popup className="z-50 w-[300px] origin-[var(--transform-origin)] overflow-hidden rounded-xl border border-foreground/[0.06] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-white/[0.06] dark:bg-[#1C1C1C] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
            <PreviewCard.Arrow className="data-[side=bottom]:top-[-10px] data-[side=top]:bottom-[-10px]">
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                <path d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z" className="fill-white dark:fill-[#1C1C1C]" />
                <path d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z" className="fill-foreground/[0.06] dark:fill-white/[0.06]" />
                <path d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z" className="fill-white dark:fill-[#1C1C1C]" />
              </svg>
            </PreviewCard.Arrow>
            <div className="p-4">
              {/* URL bar */}
              <div className="flex items-center gap-2 rounded-lg bg-foreground/[0.04] px-3 py-2 dark:bg-white/[0.04]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-page-text-muted dark:text-white/40">
                  <path d="M5.83 8.17a3.001 3.001 0 010-4.24l1.41-1.41a3 3 0 114.24 4.24l-.7.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M8.17 5.83a3.001 3.001 0 010 4.24l-1.41 1.41a3 3 0 11-4.24-4.24l.7-.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className="truncate text-xs text-page-text-muted dark:text-white/40">{domain}</span>
              </div>
              {/* Title */}
              <p className="mt-3 text-sm font-semibold leading-5 tracking-[-0.02em] text-page-text dark:text-white">{children}</p>
              {/* Hint */}
              <p className="mt-1.5 text-[11px] text-page-text-muted dark:text-white/40">Click to open link</p>
            </div>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
}

/* ── Rich text (with PreviewCard links) ─────────────────────── */

function RichText({ html }: { html: string }) {
  // Parse HTML to extract links and render them as PreviewCard
  const parts = useMemo(() => {
    const result: { type: "text" | "link"; content: string; href?: string }[] = [];
    const regex = /<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: "text", content: html.slice(lastIndex, match.index) });
      }
      result.push({ type: "link", content: match[2], href: match[1] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < html.length) {
      result.push({ type: "text", content: html.slice(lastIndex) });
    }
    return result;
  }, [html]);

  return (
    <p className="font-inter text-base font-normal leading-7 tracking-[-0.02em] text-page-text-muted [&_strong]:font-semibold [&_strong]:text-page-text-subtle">
      {parts.map((part, i) =>
        part.type === "link" ? (
          <PreviewLink key={i} href={part.href!}>
            <span dangerouslySetInnerHTML={{ __html: part.content }} />
          </PreviewLink>
        ) : (
          <span key={i} dangerouslySetInnerHTML={{ __html: part.content }} />
        )
      )}
    </p>
  );
}

/* ── Floating Table of Contents ─────────────────────────────── */

function FloatingTOC({ sections, activeSection, onNavigate }: {
  sections: { id: string; label: string }[];
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <div className="fixed right-6 top-24 z-50 hidden w-[180px] rounded-lg bg-white/70 p-[10px] backdrop-blur-[4.5px] dark:bg-[#1C1C1C]/80 lg:block">
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 3H11.5M2.5 7H7.5M2.5 11H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-page-text dark:text-white/70" />
        </svg>
        <span className="font-inter text-sm font-medium tracking-[-0.42px] text-page-text dark:text-white">On this page</span>
      </div>
      <div className="mt-4 flex flex-col gap-2 pl-2.5">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            className={cn(
              "cursor-pointer text-left font-inter text-xs tracking-[-0.6px] transition-colors",
              activeSection === s.id
                ? "font-bold text-[#FFA600]"
                : "font-medium text-page-text/70 hover:text-page-text dark:text-white/50 dark:hover:text-white/80",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── useScrollSpy hook ──────────────────────────────────────── */

function useScrollSpy(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "");
  const refs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    function handleScroll() {
      let current = sectionIds[0] ?? "";
      for (const id of sectionIds) {
        const el = refs.current.get(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) current = id;
        }
      }
      setActive(current);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) refs.current.set(id, el);
    else refs.current.delete(id);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setActive(id);
    const el = refs.current.get(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { active, registerRef, scrollTo };
}

/* ── Page ─────────────────────────────────────────────────────── */

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const activePost = BLOG_POSTS.find((p) => p.slug === params.slug) ?? BLOG_POSTS[0];
  const morePosts = BLOG_POSTS.filter((p) => p.slug !== activePost.slug);
  const readTime = estimateReadTime(activePost);

  // Extract TOC entries from h2 headings
  const tocSections = useMemo(() => {
    return activePost.sections
      .filter((s): s is { type: "heading"; level: 2 | 3; content: string } => s.type === "heading" && (s as any).level === 2)
      .map((s) => ({ id: slugify(s.content), label: s.content }));
  }, [activePost]);

  const tocIds = useMemo(() => tocSections.map((s) => s.id), [tocSections]);
  const { active: activeSection, registerRef, scrollTo } = useScrollSpy(tocIds);

  const drag = useDragScroll();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback(
    (slug: string) => {
      if (!drag.wasDragging()) {
        router.push(`/blog/${slug}`);
      }
    },
    [drag, router],
  );

  return (
    <div className="min-h-screen bg-page-bg font-inter">
      {/* Reading progress bar */}
      <ReadingProgressBar />

      <AnnouncementBanner />
      <DubNav />

      {/* Floating TOC */}
      {tocSections.length > 0 && (
        <FloatingTOC sections={tocSections} activeSection={activeSection} onNavigate={scrollTo} />
      )}

      {/* ── Hero (Epic Games masked image + overlaid content) ──── */}
      <div className="relative w-full bg-page-bg" style={{ height: "clamp(520px, 52vw, 720px)" }}>
        {/* Desktop: image pushed right with dual gradient mask */}
        <div
          className="absolute inset-y-0 left-[10%] right-0 hidden sm:block"
          style={{
            maskImage: "linear-gradient(270deg, #000 0%, #000 50%, transparent 85%), linear-gradient(180deg, #000 0%, #000 40%, transparent 80%)",
            maskComposite: "intersect",
            WebkitMaskImage: "linear-gradient(270deg, #000 0%, #000 50%, transparent 85%), linear-gradient(180deg, #000 0%, #000 40%, transparent 80%)",
            WebkitMaskComposite: "destination-in",
          }}
        >
          <img src={activePost.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        {/* Mobile: full-width with vertical fade */}
        <div
          className="absolute inset-0 sm:hidden"
          style={{
            maskImage: "linear-gradient(180deg, #000 0%, #000 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 40%, transparent 100%)",
          }}
        >
          <img src={activePost.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>

        {/* ── Content overlaid in the hero ── */}
        <div className="relative z-[1] mx-auto flex h-full max-w-[1261px] flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-14">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            {/* Left: title + meta */}
            <div className="flex max-w-[600px] flex-col gap-4">
              {/* Back */}
              <Link
                href="/blog"
                className="inline-flex w-fit items-center gap-1 font-inter text-sm tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Blog
              </Link>

              {/* Date */}
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="font-inter text-[10px] font-bold uppercase leading-[14px] tracking-[-0.02em] text-page-text-muted"
              >
                {activePost.date}
              </motion.span>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-2xl font-bold leading-8 text-page-text sm:text-[32px] sm:leading-[1.15]"
                style={{ fontFamily: "var(--font-fm-universe), sans-serif" }}
              >
                {activePost.title}
              </motion.h1>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                className="flex flex-wrap items-center gap-2"
              >
                {activePost.tags.map((tag) => (
                  <TagPill key={tag} label={tag} />
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Article (narrow text column) ──────────────────────── */}
      <div className="relative z-[1]">
        <div className="mx-auto flex max-w-[1261px] flex-col items-center gap-12 px-4 py-12 sm:px-6">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-[912px]"
          >
            <p className="font-inter text-base font-normal leading-7 tracking-[-0.02em] text-page-text-muted">
              {activePost.intro}
            </p>
          </motion.div>

          {/* Content sections */}
          {activePost.sections.map((section, i) => {
            switch (section.type) {
              case "heading":
                if (section.level === 2) {
                  const hId = slugify(section.content);
                  return (
                    <h2 key={i} id={hId} ref={(el) => registerRef(hId, el)} className="w-full max-w-[912px] scroll-mt-24 text-2xl font-bold leading-8 text-page-text" style={{ fontFamily: "var(--font-fm-universe), sans-serif" }}>
                      {section.content}
                    </h2>
                  );
                }
                return (
                  <h3 key={i} className="w-full max-w-[912px] text-base font-bold leading-5 tracking-[-0.02em] text-page-text">
                    {section.content}
                  </h3>
                );

              case "text":
                return <div key={i} className="w-full max-w-[912px]"><RichText html={section.content} /></div>;

              case "bullets":
                return (
                  <ul key={i} className="flex w-full max-w-[912px] flex-col gap-4 pl-4">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 font-inter text-base font-normal leading-7 tracking-[-0.02em] text-page-text-muted [&_strong]:font-semibold [&_strong]:text-page-text-subtle">
                        <span className="mt-2.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-page-text-muted" />
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                );

              case "gallery":
                return (
                  <div key={i} className="w-full">
                    <ImageGallery images={section.images} />
                  </div>
                );

              case "separator":
                return <hr key={i} className="w-full max-w-[912px] border-t border-foreground/[0.06]" />;

              default:
                return null;
            }
          })}
        </div>
      </div>

      {/* ── More Like This (horizontal draggable row) ─────────── */}
      <section className="mx-auto mt-12 max-w-[1261px] px-4 pb-24 sm:px-6">
        <h2
          className="mb-6 text-xl font-bold leading-6 text-page-text"
          style={{ fontFamily: "var(--font-fm-universe), sans-serif" }}
        >
          More Like This
        </h2>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {activePost.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>

        {/* Horizontal draggable row */}
        <div
          ref={(el) => {
            (drag.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
            (scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          onPointerDown={drag.onPointerDown}
          onPointerMove={drag.onPointerMove}
          onPointerUp={drag.onPointerUp}
          onClick={drag.onClick}
          className="flex gap-5 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {morePosts.map((p) => (
            <MoreLikeThisCard
              key={p.slug}
              post={p}
              onClick={() => handleNavigate(p.slug)}
            />
          ))}
        </div>
      </section>

      {/* ── Ask AI floating widget ────────────────────────────── */}
      <AskAiWidget />
    </div>
  );
}
