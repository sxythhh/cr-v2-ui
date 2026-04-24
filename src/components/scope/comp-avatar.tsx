"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZE_CLASSES: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "size-5 text-[10px]",
  md: "size-7 text-xs",
  lg: "size-9 text-sm",
  xl: "size-14 text-lg",
};

const BRAND_COLORS: Record<string, { bg: string; fg: string }> = {
  Polymarket: { bg: "linear-gradient(135deg,#2563EB,#1D4ED8)", fg: "#fff" },
  Kalshi: { bg: "linear-gradient(135deg,#00A67E,#007A5C)", fg: "#fff" },
  Manifold: { bg: "linear-gradient(135deg,#F59E0B,#D97706)", fg: "#fff" },
  Drift: { bg: "linear-gradient(135deg,#7C3AED,#5B21B6)", fg: "#fff" },
  Kaito: { bg: "linear-gradient(135deg,#06B6D4,#0E7490)", fg: "#fff" },
  PredictIt: { bg: "linear-gradient(135deg,#DC2626,#991B1B)", fg: "#fff" },
  "Zeta Markets": { bg: "linear-gradient(135deg,#EC4899,#BE185D)", fg: "#fff" },
  Limitless: { bg: "linear-gradient(135deg,#10B981,#059669)", fg: "#fff" },
  "Myriad Markets": { bg: "linear-gradient(135deg,#8B5CF6,#6D28D9)", fg: "#fff" },
  SideShift: { bg: "linear-gradient(135deg,#0EA5E9,#0369A1)", fg: "#fff" },
  Zealy: { bg: "linear-gradient(135deg,#22D3EE,#0891B2)", fg: "#fff" },
  Layer3: { bg: "linear-gradient(135deg,#64748B,#334155)", fg: "#fff" },
  Galxe: { bg: "linear-gradient(135deg,#F472B6,#BE185D)", fg: "#fff" },
};

function hashedStyle(name: string) {
  const seed = Array.from(name).reduce((sum, ch, idx) => sum + ch.charCodeAt(0) * (idx + 1), 0);
  const hueA = seed % 360;
  const hueB = (seed * 1.7 + 48) % 360;
  return {
    bg: `linear-gradient(135deg, hsl(${hueA} 68% 54%), hsl(${hueB} 72% 38%))`,
    fg: "#fff",
  };
}

function isDirectImage(value: string) {
  return /(?:\.png|\.jpe?g|\.webp|\.gif|\.svg|\.ico)(?:[?#].*)?$/i.test(value);
}

export function CompAvatar({
  name,
  size = "md",
  logoUrl,
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  logoUrl?: string | null;
  className?: string;
}) {
  const color = BRAND_COLORS[name] ?? hashedStyle(name);
  const mediaUrl = logoUrl
    ? isDirectImage(logoUrl)
      ? logoUrl
      : `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(logoUrl)}`
    : null;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] font-semibold tracking-[-0.02em]",
        SIZE_CLASSES[size],
        className,
      )}
      style={mediaUrl ? undefined : { background: color.bg, color: color.fg }}
    >
      {mediaUrl ? (
        <Image
          src={mediaUrl}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
          unoptimized
        />
      ) : (
        <span>{name[0]}</span>
      )}
    </span>
  );
}
