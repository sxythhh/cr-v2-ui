import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import type { PlatformKey } from "@/lib/scope/types";

const ID_MAP: Record<PlatformKey, string> = {
  ig: "instagram",
  tt: "tiktok",
  yt: "youtube",
};

const SIZE_MAP: Record<"sm" | "md" | "lg", number> = {
  sm: 12,
  md: 16,
  lg: 20,
};

export function Platform({
  p,
  size = "md",
  className,
}: {
  p: PlatformKey;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <PlatformIcon
      platform={ID_MAP[p]}
      size={SIZE_MAP[size]}
      className={cn("shrink-0 text-page-text", className)}
    />
  );
}
