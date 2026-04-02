"use client";

import { useEffect, useState } from "react";

// ── Mock campaign data pool ─────────────────────────────────────────
const BRANDS = [
  { name: "Sound Network", logo: "/logos/brand1.png" },
  { name: "Polymarket", logo: "/logos/brand2.png" },
  { name: "Virality", logo: "/logos/brand3.png" },
  { name: "NordVPN", logo: "/logos/brand4.png" },
  { name: "Clash Royale", logo: "/logos/brand5.png" },
  { name: "Surfshark", logo: "/logos/brand6.png" },
  { name: "HelloFresh", logo: "/logos/brand7.jpeg" },
  { name: "Gymshark", logo: "/logos/brand8.jpg" },
  { name: "Google", logo: "/logos/google.png" },
  { name: "Content Rewards", logo: "/icons/cr-favicon.png" },
];

const BANNERS = [
  "/creator-home/campaign-thumb-1.png",
  "/creator-home/campaign-thumb-2.png",
  "/creator-home/campaign-thumb-3.png",
  "/campaign-flow/cpm-illustration-dark.png",
  "/campaign-flow/retainer-card-bg.png",
  "/campaign-flow/per-video-card-dark.png",
];

const TITLES = [
  'Post Sabrina Carpenter & Maria Becerra — "QUE GANAS DE COMERTE"',
  "Polymarket [Logo Clipping]",
  "Summer Launch — Promote New Collection",
  "Create a 60s Review of Our App",
  "Holiday Gift Guide Collaboration",
  "Unboxing & First Impressions Video",
  "Day In My Life ft. Our Product",
  "Gaming Stream Overlay Sponsorship",
  "Recipe Video with Our Ingredients",
  "Fitness Challenge — 30 Day Transformation",
];

const CATEGORIES = [
  "NO TALENT",
  "TRADING",
  "GAMING",
  "LIFESTYLE",
  "FITNESS",
  "COOKING",
  "TECH",
  "BEAUTY",
  "MUSIC",
  "FINANCE",
];

type Platform = "tiktok" | "instagram" | "youtube";

interface PlatformRate {
  platform: Platform;
  rate: string;
}

function randomCampaign() {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const banner = BANNERS[Math.floor(Math.random() * BANNERS.length)];
  const title = TITLES[Math.floor(Math.random() * TITLES.length)];
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const budgets = [1000, 2000, 5000, 10000, 15000, 25000, 50000];
  const budget = budgets[Math.floor(Math.random() * budgets.length)];

  const maxPayouts = [50, 100, 150, 200, 300, 500];
  const maxPayout = maxPayouts[Math.floor(Math.random() * maxPayouts.length)];

  const rates = ["$0.25/1K", "$0.50/1K", "$1/1K", "$1.50/1K", "$2/1K", "$3/1K"];

  const allPlatforms: Platform[] = ["tiktok", "instagram", "youtube"];
  // Minimum 2 platforms
  const count = Math.floor(Math.random() * 2) + 2; // 2 or 3
  const shuffled = [...allPlatforms].sort(() => Math.random() - 0.5);
  const platforms: PlatformRate[] = shuffled.slice(0, count).map((p) => ({
    platform: p,
    rate: rates[Math.floor(Math.random() * rates.length)],
  }));

  return { brand, banner, title, category, budget, maxPayout, platforms };
}

// ── Verified badge SVG ──────────────────────────────────────────────
function VerifiedBadge({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path
        d="M11.2432 4.65144C11.0405 4.43985 10.8318 4.22237 10.7532 4.03135C10.6797 3.85575 10.6761 3.56554 10.6716 3.28488C10.6643 2.76177 10.6555 2.16886 10.2426 1.75669C9.83114 1.34525 9.23896 1.33644 8.71585 1.32835C8.43446 1.32468 8.14425 1.32027 7.96939 1.2468C7.77836 1.16892 7.55942 0.958795 7.34929 0.757485C6.97973 0.40262 6.55948 0 6.00037 0C5.44199 0 5.02027 0.401886 4.65144 0.757485C4.43985 0.958795 4.22237 1.16892 4.03135 1.2468C3.85649 1.32027 3.56554 1.32468 3.28488 1.32835C2.76177 1.33644 2.16886 1.34525 1.75669 1.75742C1.34525 2.16886 1.33937 2.76177 1.32835 3.28488C1.32468 3.56554 1.32027 3.85575 1.2468 4.03135C1.16892 4.22237 0.958795 4.43985 0.757485 4.65144C0.40262 5.02027 0 5.44052 0 6.00037C0 6.55875 0.401886 6.97973 0.757485 7.34929C0.958795 7.55942 1.16892 7.77836 1.2468 7.96939C1.32027 8.14425 1.32468 8.43446 1.32835 8.71585C1.33644 9.23896 1.34525 9.83114 1.75742 10.244C2.16886 10.6555 2.76177 10.6628 3.28488 10.6716C3.56554 10.6761 3.85575 10.6797 4.03135 10.7532C4.22237 10.8318 4.43985 11.0405 4.65144 11.2432C5.02027 11.5974 5.44052 12 6.00037 12C6.55875 12 6.97973 11.5988 7.34929 11.2432C7.55942 11.0405 7.77836 10.8318 7.96939 10.7532C8.14425 10.6797 8.43446 10.6761 8.71585 10.6716C9.23896 10.6643 9.83114 10.6555 10.244 10.2426C10.6555 9.83114 10.6628 9.23896 10.6716 8.71585C10.6761 8.43446 10.6797 8.14425 10.7532 7.96939C10.8318 7.77836 11.0405 7.55942 11.2432 7.34929C11.5974 6.97973 12 6.55948 12 6.00037C12 5.44199 11.5988 5.02027 11.2432 4.65144ZM8.44621 5.01733L5.4464 8.01788C5.40665 8.05791 5.35938 8.08968 5.3073 8.11136C5.25522 8.13304 5.19937 8.1442 5.14296 8.1442C5.08655 8.1442 5.0307 8.13304 4.97862 8.11136C4.92655 8.08968 4.87927 8.05791 4.83953 8.01788L3.55379 6.73214C3.51017 6.69318 3.47496 6.64573 3.45031 6.59269C3.42567 6.53966 3.41211 6.48215 3.41046 6.42369C3.40881 6.36523 3.41911 6.30705 3.44073 6.25271C3.46234 6.19837 3.49482 6.14901 3.53618 6.10766C3.57753 6.0663 3.62689 6.03382 3.68123 6.01221C3.73557 5.99059 3.79375 5.98029 3.85221 5.98194C3.91067 5.98359 3.96818 5.99715 4.02121 6.02179C4.07425 6.04644 4.1217 6.08165 4.16066 6.12527L5.14296 7.10831L7.84008 4.41119C7.87866 4.36636 7.92608 4.32997 7.97937 4.3043C8.03266 4.27864 8.09068 4.26425 8.14979 4.26204C8.2089 4.25982 8.26783 4.26984 8.32289 4.29144C8.37795 4.31305 8.42796 4.3458 8.46978 4.38762C8.51161 4.42945 8.54435 4.47946 8.56596 4.53452C8.58757 4.58958 8.59758 4.64851 8.59537 4.70762C8.59316 4.76673 8.57877 4.82474 8.5531 4.87803C8.52744 4.93132 8.49105 4.97875 8.44621 5.01733Z"
        fill="url(#vb)"
      />
      <defs>
        <linearGradient id="vb" x1="5.976" y1="0" x2="6.024" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDDC87" />
          <stop offset="1" stopColor="#FCB02B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Platform icons (inline, white on dark) ──────────────────────────
function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M19.08 8.16C17.75 8.16 16.51 7.74 15.5 7.02V12.25C15.5 14.88 13.37 17 10.75 17C9.77 17 8.86 16.7 8.1 16.2C6.84 15.35 6 13.9 6 12.25C6 9.63 8.13 7.51 10.75 7.51C10.97 7.51 11.19 7.52 11.4 7.55V10.18C11.19 10.11 10.97 10.08 10.74 10.08C9.54 10.08 8.57 11.05 8.57 12.25C8.57 13.09 9.06 13.83 9.76 14.19C10.06 14.33 10.39 14.42 10.74 14.42C11.94 14.42 12.91 13.45 12.91 12.25V2H15.5V2.33C15.51 2.43 15.52 2.53 15.54 2.62C15.72 3.65 16.33 4.52 17.18 5.05C17.75 5.41 18.41 5.59 19.08 5.59V8.16Z"
        fill="white"
      />
    </svg>
  );
}

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="white" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.5" stroke="white" strokeWidth="1.6" />
      <circle cx="16.5" cy="7.5" r="1" fill="white" />
    </svg>
  );
}

function YouTubeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.786} viewBox="0 0 28 22" fill="none">
      <path d="M27.2912 3.69C27.1734 3.22918 26.9478 2.80298 26.6328 2.44654C26.318 2.0901 25.9228 1.81366 25.48 1.64C21.195 -0.0149953 14.375 4.75492e-06 14 4.75492e-06C13.625 4.75492e-06 6.805 -0.0149953 2.52 1.64C2.0772 1.81366 1.68204 2.0901 1.36712 2.44654C1.0522 2.80298 0.82654 3.22918 0.70876 3.69C0.385 4.9375 0 7.2175 0 11C0 14.7825 0.385 17.0626 0.70876 18.31C0.82636 18.771 1.05194 19.1976 1.36688 19.5542C1.6818 19.9108 2.07706 20.1874 2.52 20.3612C6.625 21.945 13.05 22 13.9175 22H14.0825C14.95 22 21.3788 21.945 25.48 20.3612C25.923 20.1874 26.3182 19.9108 26.6332 19.5542C26.948 19.1976 27.1736 18.771 27.2912 18.31C27.615 17.06 28 14.7825 28 11C28 7.2175 27.615 4.9375 27.2912 3.69ZM18.0738 11.815L13.0737 15.315C12.9242 15.4198 12.7488 15.4816 12.5666 15.4938C12.3844 15.506 12.2023 15.468 12.0401 15.384C11.878 15.3 11.7419 15.1732 11.6467 15.0174C11.5515 14.8615 11.5007 14.6826 11.5 14.5V7.5C11.5001 7.31708 11.5503 7.13766 11.6452 6.98128C11.7402 6.82492 11.8762 6.6976 12.0385 6.61316C12.2008 6.52874 12.3831 6.49044 12.5656 6.50244C12.7482 6.51444 12.9239 6.5763 13.0737 6.68126L18.0738 10.1813C18.2052 10.2735 18.3126 10.396 18.3868 10.5386C18.4608 10.6811 18.4996 10.8394 18.4996 11C18.4996 11.1606 18.4608 11.3189 18.3868 11.4614C18.3126 11.604 18.2052 11.7265 18.0738 11.8188V11.815Z" fill="white" />
    </svg>
  );
}

// ── Eye icon (from creator-icons.tsx) ───────────────────────────────
function EyeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.73} viewBox="0 0 22 16" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 0C5.818 0 1.636 2.909 0 8c1.636 5.09 5.818 8 11 8s9.364-2.91 11-8c-1.636-5.091-5.818-8-11-8Zm0 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        fill="white"
      />
    </svg>
  );
}

const PLATFORM_ICON: Record<Platform, typeof TikTokIcon> = {
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
};

// ── Color extraction from image ─────────────────────────────────────
function extractColors(img: HTMLImageElement): [string, string] {
  const canvas = document.createElement("canvas");
  const sz = 64;
  canvas.width = sz;
  canvas.height = sz;
  const ctx = canvas.getContext("2d");
  if (!ctx) return ["#1a1a2e", "#16213e"];

  ctx.drawImage(img, 0, 0, sz, sz);
  const data = ctx.getImageData(0, 0, sz, sz).data;

  let r1 = 0, g1 = 0, b1 = 0, c1 = 0;
  let r2 = 0, g2 = 0, b2 = 0, c2 = 0;

  for (let y = 0; y < sz; y++) {
    for (let x = 0; x < sz; x++) {
      const i = (y * sz + x) * 4;
      if (data[i + 3] < 128) continue;
      if (y < sz / 2) {
        r1 += data[i]; g1 += data[i + 1]; b1 += data[i + 2]; c1++;
      } else {
        r2 += data[i]; g2 += data[i + 1]; b2 += data[i + 2]; c2++;
      }
    }
  }

  const toRgb = (r: number, g: number, b: number, c: number, brightness: number) => {
    if (c === 0) return "rgb(20,20,40)";
    return `rgb(${Math.round((r / c) * brightness)},${Math.round((g / c) * brightness)},${Math.round((b / c) * brightness)})`;
  };

  return [toRgb(r1, g1, b1, c1, 0.55), toRgb(r2, g2, b2, c2, 0.35)];
}

// ── Shared text style ───────────────────────────────────────────────
const T = { letterSpacing: "-0.02em" } as const;
const LABEL: React.CSSProperties = { color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" };

// ── Main page ───────────────────────────────────────────────────────
export default function DiscordPage() {
  const [campaign] = useState(randomCampaign);
  const [colors, setColors] = useState<[string, string]>(["#0a0a0a", "#0a0a0a"]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = campaign.banner;
    img.onload = () => setColors(extractColors(img));
  }, [campaign.banner]);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background: `linear-gradient(145deg, ${colors[0]} 0%, #0a0a0a 35%, #0a0a0a 65%, ${colors[1]} 100%)`,
      }}
    >
      <div
        className="relative w-[420px] overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(145deg, ${colors[0]} 0%, #0a0a0a 40%, #0a0a0a 70%, ${colors[1]} 100%)`,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Banner */}
        <div className="relative mx-4 mt-4">
          <img
            src={campaign.banner}
            alt=""
            className="h-[200px] w-full rounded-xl object-cover"
          />
        </div>

        {/* Brand logo with verified badge at bottom-right */}
        <div className="relative z-10 -mt-10 flex justify-center">
          <div className="relative">
            <div
              className="flex size-[72px] items-center justify-center overflow-hidden rounded-[18px]"
              style={{
                background: "#fff",
                border: "3px solid #1a1a1a",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              <img
                src={campaign.brand.logo}
                alt={campaign.brand.name}
                className="size-full object-contain p-2"
              />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5">
              <VerifiedBadge size={22} />
            </div>
          </div>
        </div>

        {/* Brand name */}
        <p className="mt-2.5 text-center text-[11px] font-medium uppercase" style={LABEL}>
          {campaign.brand.name}
        </p>

        {/* Campaign title */}
        <h1
          className="mt-1 px-6 text-center text-xl font-bold leading-tight"
          style={{ color: "#fff", ...T }}
        >
          {campaign.title}
        </h1>

        {/* Budget */}
        <div className="mt-4 text-center">
          <p className="text-[11px] font-medium uppercase" style={LABEL}>Budget</p>
          <p className="mt-0.5 text-3xl font-bold" style={{ color: "#fff", ...T }}>
            ${campaign.budget.toLocaleString()}
          </p>
        </div>

        {/* Category + Max Payout */}
        <div className="mx-6 mt-5 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase leading-none" style={LABEL}>Category</p>
            <p className="mt-0.5 text-[15px] font-bold leading-none" style={{ color: "#fff", ...T }}>
              {campaign.category}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase leading-none" style={LABEL}>Max Payout</p>
            <p className="mt-0.5 text-[15px] font-bold leading-none" style={{ color: "#fff", ...T }}>
              {campaign.maxPayout}$
            </p>
          </div>
        </div>

        {/* Earnings */}
        <div className="mx-6 mt-5 pb-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase" style={LABEL}>Earnings</p>
            <p className="text-[11px] font-medium uppercase" style={LABEL}>Per 1000 Views</p>
          </div>

          <div className="mt-3 space-y-3">
            {campaign.platforms.map((p) => {
              const Icon = PLATFORM_ICON[p.platform];
              return (
                <div key={p.platform} className="flex items-center justify-between">
                  <Icon size={p.platform === "youtube" ? 20 : 24} />
                  <div className="flex items-center gap-1.5">
                    <EyeIcon size={14} />
                    <span className="text-[15px] font-bold" style={{ color: "#fff", ...T }}>
                      {p.rate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
