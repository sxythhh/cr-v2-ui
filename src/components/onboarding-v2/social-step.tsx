"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { PlatformIcon, PLATFORM_LABELS } from "@/components/icons/PlatformIcon";

interface SocialAccount {
  platform: string;
  connected: boolean;
  handle?: string;
}

interface SocialStepProps {
  accounts: SocialAccount[];
  onConnect: (platform: string) => void;
}

const PLATFORMS = [
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "x", label: "X" },
];

export function SocialStep({ accounts, onConnect }: SocialStepProps) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (platformId: string) => {
    setConnecting(platformId);
    setTimeout(() => {
      onConnect(platformId);
      setConnecting(null);
    }, 1500);
  };

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          Connect your socials
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          Link your accounts so brands can discover you and verify your content.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {PLATFORMS.map((p, i) => {
          const account = accounts.find((a) => a.platform === p.id);
          const isConnected = account?.connected ?? false;
          const isConnecting = connecting === p.id;

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card-bg px-4 py-3.5 transition-all sm:gap-3.5"
            >
              <PlatformIcon platform={p.id} size={20} className="shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-[14px] font-medium text-page-text">{p.label}</span>
                {isConnected && account?.handle && (
                  <span className="text-[12px] font-medium text-page-text-subtle">@{account.handle}</span>
                )}
              </div>

              {isConnected ? (
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#00B259" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[12px] font-medium text-[#00B259]">Connected</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleConnect(p.id)}
                  disabled={isConnecting}
                  className="flex h-9 cursor-pointer items-center rounded-lg bg-foreground/[0.06] px-3 text-[12px] font-semibold text-page-text transition-colors hover:bg-foreground/[0.10] disabled:opacity-50"
                >
                  {isConnecting ? (
                    <motion.div
                      className="size-3.5 rounded-full border-2 border-current border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    "Connect"
                  )}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-[12px] font-medium text-page-text-subtle">
        Connect at least one account to continue. You can add more later.
      </p>
    </div>
  );
}
