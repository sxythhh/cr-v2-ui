"use client";

import { cn } from "@/lib/utils";

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X",
  youtube: "YouTube",
};

function PlatformIcon({ platform, size = 16 }: { platform: string; size?: number }) {
  const s = size;
  const cls = "text-page-text-subtle";
  switch (platform) {
    case "tiktok":
      return (<svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9a6.33 6.33 0 00-.82-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.28 8.28 0 004.81 1.54V6.82a4.84 4.84 0 01-1.05-.13z" /></svg>);
    case "instagram":
      return (<svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>);
    case "youtube":
      return (<svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>);
    case "x":
      return (<svg className={cls} width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>);
    default: return null;
  }
}

export function PlatformButton({ platform, selected, onClick }: { platform: string; selected: boolean; onClick: () => void }) {
  const label = PLATFORM_LABELS[platform];
  if (!label) return null;
  return (
    <button
      className={cn(
        "flex items-center justify-center gap-1.5 h-9 px-3 pl-2.5 text-sm font-medium tracking-[-0.02em] rounded-full border transition-all active:scale-[0.98]",
        selected
          ? "bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),#FFFFFF] dark:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),#1a1a1a] border-[rgba(255,144,37,0.3)] shadow-[0px_1px_2px_rgba(0,0,0,0.03)] text-page-text"
          : "bg-card-bg border-border shadow-[0px_1px_2px_rgba(0,0,0,0.03)] text-page-text-subtle"
      )}
      onClick={onClick}
      type="button"
    >
      <PlatformIcon platform={platform} size={16} />
      <span>{label}</span>
    </button>
  );
}

export { PlatformIcon };
