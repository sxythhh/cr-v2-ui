"use client";

import { cn } from "@/lib/utils";

interface WebsiteStepProps {
  url: string;
  onChange: (url: string) => void;
}

export function WebsiteStep({ url, onChange }: WebsiteStepProps) {
  const hasProtocol = /^https?:\/\//.test(url);
  const displayUrl = url && !hasProtocol ? `https://${url}` : url;
  const isValid = url.length > 0 && /^[^\s]+\.[^\s]+$/.test(url.replace(/^https?:\/\//, ""));

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          Website URL
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          Your company or brand website. This helps creators learn about you.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-page-text-muted">Website</label>
          <div className="flex h-11 items-center rounded-xl border border-border bg-card-bg transition-all focus-within:border-[#FF6207] ">
            <span className="flex h-full items-center border-r border-border bg-foreground/[0.02] px-3 text-[13px] font-medium text-page-text-subtle">
              https://
            </span>
            <input
              type="text"
              placeholder="yourcompany.com"
              value={url.replace(/^https?:\/\//, "")}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-transparent px-3 text-[14px] font-medium text-page-text outline-none placeholder:text-page-text-subtle"
            />
          </div>
        </div>

        {/* Live preview */}
        {isValid && (
          <div className="flex items-center gap-2.5 rounded-xl bg-foreground/[0.03] px-3.5 py-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-page-text-subtle">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="truncate text-[13px] font-medium text-page-text-muted">
              {displayUrl}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
