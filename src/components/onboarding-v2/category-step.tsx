"use client";

import { cn } from "@/lib/utils";

interface CategoryStepProps {
  selected: Set<string>;
  onToggle: (category: string) => void;
  variant: "brand" | "creator";
}

/* ── Niche icons (from creator for-you page) ── */

const NICHE_ICONS: Record<string, React.ReactNode> = {
  Entertainment: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6.908.507a.5.5 0 0 1 .578.41l.001.006v.003c.02.123.032.247.04.372.012.21.014.506-.04.801-.065.346-.225.657-.352.865a3.5 3.5 0 0 1-.18.26l-.002.002a.5.5 0 0 1-.77-.643 2.5 2.5 0 0 0 .172-.245c.1-.163.19-.353.221-.526.034-.185.036-.391.026-.561a3.9 3.9 0 0 0-.027-.264.5.5 0 0 1 .41-.578Z" fill="currentColor"/><path d="M9.541 1.281a.5.5 0 0 1 .302.641l-.226.626a.5.5 0 0 1-.866-.34l.225-.626a.5.5 0 0 1 .565-.301Z" fill="currentColor"/><path d="M10.947 3.532a.5.5 0 0 1-.224.672l-.501.25a.5.5 0 0 1-.673-.223.5.5 0 0 1 .224-.672l.501-.25a.5.5 0 0 1 .673.223Z" fill="currentColor"/><path d="M8.599 3.402a.5.5 0 0 1 0 .708l-.501.501a.5.5 0 0 1-.708-.708l.501-.501a.5.5 0 0 1 .708 0Z" fill="currentColor"/><path d="M8.495 5.488a.5.5 0 0 1 .522.48l.001.001.002.002a3 3 0 0 0 .278.027c.159.02.316.049.44.089.148.048.305.136.489.216a4 4 0 0 0 .749.275.5.5 0 0 1-.69.84 5 5 0 0 1-.222-.127c-.138-.074-.293-.148-.417-.188-.149-.048-.305-.076-.43-.093a3 3 0 0 0-.19-.02.5.5 0 0 1-.48-.521Z" fill="currentColor"/><path d="M2.96 4.243c.397-1.007 1.696-1.277 2.461-.512l2.849 2.849c.765.765.495 2.064-.512 2.461l-4.7 1.851c-1.223.482-2.431-.726-1.95-1.949l1.852-4.7Z" fill="currentColor"/></svg>,
  Gaming: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.524 1.5c-.492 0-.953.242-1.233.646L4.101 5.309l2.59 2.59 3.163-2.19c.405-.28.646-.741.646-1.233V2a.5.5 0 0 0-.5-.5H7.524Z" fill="currentColor"/><path d="M2.853 5.146a.5.5 0 0 0-.77.077l-.117.175a1.5 1.5 0 0 0 .028 1.704l.603.844-1.097 1.097a1 1 0 0 0 0 1.414l.043.043a1 1 0 0 0 1.414 0l1.097-1.097.844.603a1.5 1.5 0 0 0 1.704.027l.175-.117a.5.5 0 0 0 .077-.77l-4-4Z" fill="currentColor"/></svg>,
  Tech: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5.5 1.05A4 4 0 0 0 5 1c-1.054 0-1.955.652-2.323 1.574C1.712 2.827 1 3.705 1 4.75c0 .462.14.893.379 1.25A2.25 2.25 0 0 0 1 7.25c0 .856.478 1.6 1.18 1.98A2.751 2.751 0 0 0 4.75 11c.26 0 .511-.036.75-.104V8.501 8.5A1.5 1.5 0 0 0 4 7.5a.5.5 0 0 1 0-1c.364 0 .706.097 1 .268V3.5v-.001V1.05Z" fill="currentColor"/><path d="M6.5 10.896c.239.068.49.104.75.104a2.751 2.751 0 0 0 2.57-1.77c.702-.38 1.18-1.124 1.18-1.98 0-.462-.14-.893-.379-1.25.24-.358.379-.788.379-1.25 0-.995-.712-1.873-1.677-2.126A2.751 2.751 0 0 0 7 1c-.171 0-.338.017-.5.05V3.502A1.5 1.5 0 0 1 8 4.5a.5.5 0 0 1 0 1 2.24 2.24 0 0 1-1-.268v5.664Z" fill="currentColor"/></svg>,
  Lifestyle: <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.248 9.186c4.264-2.39 5.313-5.235 4.511-7.235-.39-.97-1.207-1.666-2.171-1.881-.849-.19-1.776 0-2.585.642-.808-.641-1.735-.831-2.584-.642C1.455.285.638.98.248 1.951c-.802 2-1.246 4.845 4.511 7.235a.5.5 0 0 0 .49 0Z" fill="currentColor"/></svg>,
  Sports: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5.581 1.288C3.534 1.92 1.92 3.534 1.288 5.58l5.131 5.131C8.466 10.08 10.08 8.466 10.712 6.42L5.581 1.288Zm1.648 4.19a.5.5 0 1 0-.707-.707l-1.75 1.75a.5.5 0 0 0 .707.708l1.75-1.75Z" fill="currentColor"/><path d="M1 7.5c0-.254.015-.504.043-.75L5.25 10.957c-.246.029-.496.043-.75.043H2a1 1 0 0 1-1-1V7.5Z" fill="currentColor"/><path d="M10.957 5.25c.029-.246.043-.496.043-.75V2a1 1 0 0 0-1-1H7.5c-.254 0-.504.015-.75.043l4.207 4.207Z" fill="currentColor"/></svg>,
  Beauty: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.589 2.011c.632-.065 1.212.171 1.694.497.484.327.912.771 1.261 1.2.351.433.638.869.836 1.195.1.163.177.301.23.398.174.315.147.493.015.767a8.3 8.3 0 0 1-.245.464c-.218.38-.549.887-1.004 1.396C9.467 8.943 8.029 10 6 10s-3.467-1.057-4.376-2.073a8.2 8.2 0 0 1-1.005-1.396 8.3 8.3 0 0 1-.245-.464c-.127-.264-.159-.434-.004-.742.046-.092.114-.223.201-.379.173-.311.425-.728.74-1.148.312-.418.697-.855 1.14-1.192.443-.335.98-.598 1.582-.598.508 0 1.076.192 1.477.354.19.078.357.155.483.217.098-.053.223-.116.362-.18.333-.154.807-.365 1.237-.41ZM6 5.125c-1.213 0-2.79.269-4.091.547a20 20 0 0 0-.409.09c.15.058.306.119.467.178C3.257 6.423 4.8 6.875 6 6.875s2.743-.452 4.033-.935c.161-.06.317-.12.467-.179a20 20 0 0 0-.409-.089C8.79 5.393 7.213 5.125 6 5.125Z" fill="currentColor"/></svg>,
  Music: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.855 2.365a.5.5 0 0 1 .644.479v3.391a2.16 2.16 0 0 0-1-.236c-1.016 0-2 .702-2 1.75s.984 1.75 2 1.75 2-.702 2-1.75V2.844a1.5 1.5 0 0 0-1.931-1.437l-3 .9A1.5 1.5 0 0 0 4.5 3.744v3.992a2.16 2.16 0 0 0-1-.237c-1.015 0-2 .702-2 1.75s.985 1.75 2 1.75 2-.702 2-1.75V3.744a.5.5 0 0 1 .356-.479l3-.9Z" fill="currentColor"/></svg>,
  Health: <svg width="11" height="10" viewBox="0 0 11 10" fill="none"><path d="M3.19 4.406 4 1.64l2.28 7.791a.5.5 0 0 0 .94 0l1.049-3.586A.5.5 0 0 1 8.749 5.485H10.5a.5.5 0 0 0 0-1H9.249a1.5 1.5 0 0 0-1.44 1.079L7 8.33 4.72.54a.5.5 0 0 0-.94 0L2.231 4.125A.5.5 0 0 1 1.751 4.485H.5a.5.5 0 0 0 0 1h1.251a1.5 1.5 0 0 0 1.44-1.079Z" fill="currentColor"/></svg>,
  News: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 5.5V4.5h1.5v1H4Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M1 3c0-.828.672-1.5 1.5-1.5H7c.828 0 1.5.672 1.5 1.5v2.5h1c.828 0 1.5.672 1.5 1.5v1.75c0 .966-.784 1.75-1.75 1.75H2.75C1.784 10.5 1 9.716 1 8.75V3Zm8.25 6.5a.75.75 0 0 0 .75-.75V7a.5.5 0 0 0-.5-.5h-1v2.25c0 .414.336.75.75.75ZM3 8a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H3.5A.5.5 0 0 1 3 8Zm.5-4.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5H6a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5H3.5Z" fill="currentColor"/></svg>,
  Crypto: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6.625 7.25a.375.375 0 0 0 0-.75H5.5v.75h1.125Z" fill="currentColor"/><path d="M5.5 4.75h1.125a.375.375 0 0 1 0 .75H5.5v-.75Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M1 6a5 5 0 1 1 10 0A5 5 0 0 1 1 6Zm3.25-2.25a.5.5 0 0 0 0 1h.25v2.5h-.25a.5.5 0 0 0 0 1H5.5v.25a.5.5 0 0 0 1 0v-.25h.125A1.375 1.375 0 0 0 7.68 6a1.37 1.37 0 0 0-.315-.875c.196-.238.315-.538.315-.875A1.375 1.375 0 0 0 6.625 3.75H6.5v-.25a.5.5 0 0 0-1 0v.25H4.25Z" fill="currentColor"/></svg>,
};

const CATEGORIES = [
  "Entertainment", "Gaming", "Tech", "Lifestyle", "Sports",
  "Beauty", "Music", "Health", "News", "Crypto",
];

export function CategoryStep({ selected, onToggle, variant }: CategoryStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          {variant === "creator" ? "Select your niches" : "Select your category"}
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          {variant === "creator"
            ? "We'll match campaigns to these. Pick up to 5."
            : "This helps us match you with the right creators."}
          {selected.size > 0 && (
            <span className="text-page-text-subtle"> · {selected.size} selected</span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const isSelected = selected.has(cat);
          const icon = NICHE_ICONS[cat];
          return (
            <button
              key={cat}
              onClick={() => onToggle(cat)}
              className={cn(
                "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-medium tracking-[-0.02em] transition-colors",
                isSelected
                  ? "border-[rgba(255,144,37,0.3)] bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),#FFFFFF] text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),var(--card-bg)]"
                  : "border-foreground/[0.06] bg-white text-page-text-muted hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]",
              )}
            >
              {icon && <span className="shrink-0">{icon}</span>}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
