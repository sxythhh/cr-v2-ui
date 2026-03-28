"use client";

import { Check, Link2 } from "lucide-react";
import { useCallback, useState } from "react";
import type { AffiliateCode } from "@/types/affiliate.types";
import { ClipboardIcon } from "./icons";
import { darkOrb } from "./styles";

interface ReferralLinkBarProps {
  codes: AffiliateCode[];
}

export function ReferralLinkBar({ codes }: ReferralLinkBarProps) {
  const [copied, setCopied] = useState(false);

  const activeCode = codes.find((c) => c.isActive) ?? codes[0];
  const referralUrl = activeCode
    ? `https://contentrewards.cc/r/${activeCode.code}`
    : "";

  const handleCopy = useCallback(() => {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [referralUrl]);

  if (!activeCode) return null;

  return (
    <div
      className="relative self-stretch"
      style={{
        background: [
          "linear-gradient(180deg, var(--af-border-subtle) 0%, transparent 100%)",
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 85%, rgba(255,255,255,0.08) 100%)",
        ].join(", "),
        borderRadius: 17,
        padding: 1,
      }}
    >
      <div className="relative flex min-h-[70px] flex-col items-start gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none sm:flex-row sm:items-center">
        <div style={darkOrb(36)}>
          <Link2 color="#FFFFFF" size={20} />
        </div>

        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text leading-[120%]">
            Your referral link
          </span>
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted truncate leading-[145%]">
            {referralUrl}
          </span>
        </div>

        <button
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.06)] bg-card-bg px-3 py-1.5 transition-[transform,filter] duration-150 ease-out active:scale-[0.96] active:[filter:blur(0.5px)] dark:border-[rgba(224,224,224,0.03)]"
          onClick={handleCopy}
          style={{
            height: 36,
            minWidth: 120,
          }}
          type="button"
        >
          {copied ? (
            <Check color="#00994D" size={16} />
          ) : (
            <ClipboardIcon color="currentColor" size={16} />
          )}
          <span className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text leading-[120%]">
            {copied ? "Copied!" : "Copy Link"}
          </span>
        </button>
      </div>
    </div>
  );
}
