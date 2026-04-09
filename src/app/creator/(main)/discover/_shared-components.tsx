"use client";

import { PlatformIcon } from "@/components/icons/PlatformIcon";
import type { Platform } from "./_shared";
import { PILL_MASK } from "./_shared";

export { VerifiedBadge } from "@/components/verified-badge";

export function PlatformPills({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="flex items-center">
      {platforms.map((p, i) => (
        <div key={p} className="relative flex size-6 items-center justify-center rounded-full verified-pill-glass text-page-text" style={{ marginLeft: i > 0 ? -4 : 0, zIndex: platforms.length - i }}>
          <span className="pointer-events-none absolute inset-0 rounded-full verified-pill-border" style={PILL_MASK} />
          <PlatformIcon platform={p} size={14} className="relative z-[1] dark:invert" />
        </div>
      ))}
    </div>
  );
}

export function CpmPill({ cpm }: { cpm: string }) {
  return (
    <div className="relative flex h-6 items-center justify-center rounded-full px-2 py-[3px] verified-pill-blue">
      <span className="pointer-events-none absolute inset-0 rounded-full verified-pill-border" style={PILL_MASK} />
      <span className="text-xs font-semibold leading-[1.2]">
        <span className="text-[#1A67E5] dark:text-[#60A5FA]">{cpm}</span>
        <span className="text-[#1A67E5]/70 dark:text-[#60A5FA]/70">/1K</span>
      </span>
    </div>
  );
}

export function PersonIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 11 12" fill="none" className="shrink-0">
      <path d="M5.015 0C3.566 0 2.39 1.175 2.39 2.625S3.566 5.25 5.015 5.25 7.64 4.075 7.64 2.625 6.465 0 5.015 0Z" fill="currentColor" />
      <path d="M5.016 5.833c-2.775 0-4.715 2.054-4.956 4.612L0 11.083h10.032l-.06-.638c-.24-2.558-2.18-4.612-4.956-4.612Z" fill="currentColor" />
    </svg>
  );
}
