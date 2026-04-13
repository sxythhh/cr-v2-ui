"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { DubNav } from "@/components/lander/dub-nav";
import { AnnouncementBanner } from "@/components/lander/announcement-banner";
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
        content: "On the Island, explore a sun-soaked paradise on foot, by car, or through the air in new hot air balloons. These locations are your next backdrop:",
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
        content: "Purchase the Battle Pass and seek revenge as The Bride, rep the future as <strong>Marty McFly</strong>, and unlock Fortnite originals like Miles Cross and Cat Holloway...plus a new version of Dark Voyager!",
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
        content: "New weapons are more responsive with layered recoil and smoother ADS transitions. Reload progress is now saved when your magazine is empty. Start a reload, and if you swap weapons or get interrupted, pick up right where you left off!",
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
      { type: "text", content: "Catch you on the Golden Coast!" },
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
      { type: "text", content: "The return to Google Play removes a significant barrier for mobile players. With <strong>one-tap installation</strong>, millions of new players can access Fortnite instantly." },
      { type: "heading", level: 3, content: "Mobile Performance Improvements" },
      { type: "bullets", items: ["60 FPS support on flagship Android devices", "Reduced app size from 8GB to 4.2GB", "Improved touch controls with customizable HUD", "Cross-progression and cross-play with all platforms", "Battery optimization mode"] },
      { type: "gallery", images: [{ src: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1261&h=709&fit=crop", alt: "Mobile gaming" }] },
      { type: "separator" },
      { type: "heading", level: 2, content: "Download Now" },
      { type: "text", content: "Head to the Google Play Store and search for Fortnite. New players who download before April 15 receive the exclusive Neon Byte outfit and 1,000 V-Bucks." },
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
              "relative h-[54px] w-24 cursor-pointer overflow-hidden rounded",
              i === active && "ring-2 ring-white/80 ring-offset-2 ring-offset-page-bg",
            )}
          >
            <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
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
      <article className="relative flex w-full flex-col overflow-hidden rounded-xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden">
          <img
            src={post.heroImage}
            alt={post.title}
            draggable={false}
            loading="lazy"
            className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 p-5">
          <span className="font-inter text-[10px] font-bold uppercase leading-[14px] tracking-[-0.02em] text-page-text-muted">
            {post.date}
          </span>
          <h3
            className="text-base font-bold leading-5 tracking-[-0.02em] text-page-text"
            style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}
          >
            {post.title}
          </h3>
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
        className="group relative flex cursor-pointer items-center overflow-hidden rounded-[20px] p-[3px]"
      >
        {/* Animated gradient border that follows cursor */}
        <div className="absolute inset-0 rounded-[20px] bg-[#141414]" />
        <div
          className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,144,37,0.5), rgba(255,63,213,0.3), transparent 70%)`,
          }}
        />
        {/* Dark border default */}
        <div className="pointer-events-none absolute inset-0 rounded-[20px] border-2 border-white/5 group-hover:border-transparent" />

        {/* Inner pill */}
        <div className="relative flex items-center rounded-[17px] bg-[#0A0A0B] px-4 py-3">
          {/* GlowFollowBorderCard inner border */}
          <div className="pointer-events-none absolute inset-0 rounded-[17px] border-2 border-white/5" />

          {/* Platform icons */}
          <div className="flex items-center">
            {/* Icon 1 — base64 */}
            <div className="flex h-[25px] w-[25px] items-center justify-center rounded-[6px]">
              <img
                src="/images/ask-ai/icon-1.png"
                alt=""
                width={22}
                height={22}
                className="rounded-[5px]"
                draggable={false}
              />
            </div>
            {/* Icon 2 — base64 */}
            <div className="-ml-0.5 flex h-[25px] w-[25px] items-center justify-center rounded-[6px]">
              <img
                src="/images/ask-ai/icon-2.png"
                alt=""
                width={22}
                height={22}
                className="rounded-[5px]"
                draggable={false}
              />
            </div>
            {/* Icon 3 — base64 */}
            <div className="-ml-0.5 flex h-[25px] w-[25px] items-center justify-center rounded-[6px]">
              <img
                src="/images/ask-ai/icon-3.png"
                alt=""
                width={15}
                height={22}
                className="rounded-[5px]"
                draggable={false}
              />
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

/* ── Rich text ────────────────────────────────────────────────── */

function RichText({ html }: { html: string }) {
  return (
    <p
      className="font-inter text-base font-normal leading-7 tracking-[-0.02em] text-page-text-muted [&_a]:text-[#FF8003] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_strong]:text-page-text-subtle"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const activePost = BLOG_POSTS.find((p) => p.slug === params.slug) ?? BLOG_POSTS[0];
  const morePosts = BLOG_POSTS.filter((p) => p.slug !== activePost.slug);
  const readTime = estimateReadTime(activePost);

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

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: "clamp(400px, 50vw, 708px)" }}>
        <img src={activePost.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #000000 0%, #000000 50%, rgba(0,0,0,0) 100%)" }} />
        {/* Hero gradient fade into page-bg */}
        <div
          className="absolute inset-x-0 bottom-0 h-[128px]"
          style={{ background: "linear-gradient(180deg, transparent 0%, var(--page-bg) 100%)" }}
        />
      </div>

      {/* ── Article (narrow text column) ──────────────────────── */}
      <div className="relative z-[1]" style={{ marginTop: "-200px" }}>
        <div className="mx-auto flex max-w-[1261px] flex-col items-center gap-12 px-4 py-12 sm:px-6">
          {/* Back to blog breadcrumb */}
          <div className="w-full max-w-[912px]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 font-inter text-sm tracking-[-0.02em] text-white/75 transition-colors hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Blog
            </Link>
          </div>

          {/* Header — 912px with staggered entrance */}
          <header className="flex w-full max-w-[912px] flex-col gap-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
              className="font-inter text-[10px] font-bold uppercase leading-[14px] tracking-[-0.02em] text-white/75"
            >
              {activePost.date}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-2xl font-bold leading-8 tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}
            >
              {activePost.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                {activePost.tags.map((tag) => (
                  <TagPill key={tag} label={tag} />
                ))}
              </div>

              {/* Author display */}
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
                  alt="Epic Games"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex items-center gap-2 font-inter text-sm tracking-[-0.02em]">
                  <span className="font-semibold text-white">Epic Games</span>
                  <span className="text-white/40">-</span>
                  <span className="text-white/60">{activePost.date}</span>
                  <span className="text-white/40">-</span>
                  <span className="text-white/60">{readTime} min read</span>
                </div>
              </div>

              {/* Share buttons */}
              <ShareButtons />
            </motion.div>
          </header>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="w-full max-w-[912px]"
          >
            <p className="font-inter text-base font-normal leading-7 tracking-[-0.02em] text-white/75">
              {activePost.intro}
            </p>
          </motion.div>

          {/* Content sections */}
          {activePost.sections.map((section, i) => {
            switch (section.type) {
              case "heading":
                if (section.level === 2) {
                  return (
                    <h2 key={i} className="w-full max-w-[912px] text-2xl font-bold leading-8 tracking-[-0.02em] text-page-text" style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}>
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
          className="mb-6 text-xl font-bold leading-6 tracking-[-0.02em] text-page-text"
          style={{ fontFamily: "var(--font-abc-oracle), sans-serif" }}
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
