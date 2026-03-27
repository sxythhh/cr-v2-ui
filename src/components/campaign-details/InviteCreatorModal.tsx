"use client";

import { useState, useRef } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────

interface InviteCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName?: string;
}

interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string; // gradient placeholder
  followers: string;
  trustScore: number;
  platforms: string[];
  invited?: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────

const SUGGESTED_CREATORS: Creator[] = [
  { id: "1", name: "Alex Rivera", handle: "@alexrivera", avatar: "from-violet-400 to-purple-600", followers: "1.2M", trustScore: 94, platforms: ["TikTok", "YouTube"] },
  { id: "2", name: "Maya Chen", handle: "@mayachen", avatar: "from-pink-400 to-rose-600", followers: "890K", trustScore: 91, platforms: ["TikTok", "Instagram"] },
  { id: "3", name: "Jake Morrison", handle: "@jakemorrison", avatar: "from-blue-400 to-indigo-600", followers: "2.1M", trustScore: 88, platforms: ["YouTube", "TikTok"] },
  { id: "4", name: "Priya Sharma", handle: "@priyasharma", avatar: "from-amber-400 to-orange-600", followers: "560K", trustScore: 96, platforms: ["Instagram", "TikTok"] },
  { id: "5", name: "Marcus Johnson", handle: "@marcusj", avatar: "from-emerald-400 to-green-600", followers: "340K", trustScore: 85, platforms: ["TikTok"] },
  { id: "6", name: "Sofia Reyes", handle: "@sofiareyes", avatar: "from-cyan-400 to-teal-600", followers: "1.8M", trustScore: 92, platforms: ["YouTube", "Instagram"] },
];

// ── Platform icon ─────────────────────────────────────────────────

function PlatformDot({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    TikTok: "#000000",
    YouTube: "#FF0000",
    Instagram: "#962FBF",
    "X (Twitter)": "#000000",
  };
  return (
    <span
      className="size-1.5 rounded-full"
      style={{ background: colors[platform] ?? "#999" }}
    />
  );
}

// ── Trust score color ─────────────────────────────────────────────

function trustColor(score: number) {
  if (score >= 90) return "#00994D";
  if (score >= 80) return "#E57100";
  return "#FF3355";
}

// ── Component ─────────────────────────────────────────────────────

export function InviteCreatorModal({
  open,
  onOpenChange,
  campaignName = "Campaign",
}: InviteCreatorModalProps) {
  const [search, setSearch] = useState("");
  const [invited, setInvited] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInvite = (id: string) => {
    setInvited((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredCreators = SUGGESTED_CREATORS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.handle.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSendInvites = () => {
    onOpenChange(false);
    setInvited(new Set());
    setSearch("");
    setMessage("");
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-neutral-100/50 backdrop-blur-md dark:bg-black/60" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 flex-col",
            "overflow-hidden rounded-[20px] border border-border",
            "bg-white dark:bg-page-bg shadow-xl",
            "max-h-[90dvh] tracking-[-0.02em]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-foreground/[0.06] px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="relative flex size-10 items-center justify-center rounded-full border border-foreground/[0.06] bg-white shadow-[0_0_0_2px_#fff] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-none">
                <div className="pointer-events-none absolute inset-0 rounded-full dark:hidden" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(37,37,37,0) 0%, rgba(37,37,37,0.12) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
                <div className="pointer-events-none absolute inset-0 rounded-full hidden dark:block" style={{ padding: "1px", background: "linear-gradient(180deg, rgba(224,224,224,0) 0%, rgba(224,224,224,0.2) 100%)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-page-text">
                  <path d="M9 1.5C6.1 1.5 3.75 3.85 3.75 6.75C3.75 9.65 6.1 12 9 12C11.9 12 14.25 9.65 14.25 6.75C14.25 3.85 11.9 1.5 9 1.5Z" fill="currentColor" fillOpacity="0.7" />
                  <path d="M9 13.5C5.55 13.5 1.5 15.27 1.5 17.25C1.5 17.66 1.84 18 2.25 18H15.75C16.16 18 16.5 17.66 16.5 17.25C16.5 15.27 12.45 13.5 9 13.5Z" fill="currentColor" fillOpacity="0.7" />
                  <circle cx="14" cy="4" r="3.5" fill="white" stroke="white" strokeWidth="1" />
                  <path d="M14 2.5V5.5M12.5 4H15.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-inter text-sm font-medium text-page-text">Invite creators</span>
                <span className="font-inter text-xs text-page-text-muted">{campaignName}</span>
              </div>
            </div>
            <DialogPrimitive.Close className="flex size-8 cursor-pointer items-center justify-center rounded-full text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text">
              <IconX size={16} />
            </DialogPrimitive.Close>
          </div>

          {/* Search */}
          <div className="border-b border-foreground/[0.06] px-4 py-3 sm:px-5">
            <div className="flex h-10 items-center gap-2 rounded-[14px] bg-foreground/[0.04] px-3.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-muted">
                <path d="M14 14L10.5 10.5M12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by name or handle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); inputRef.current?.focus(); }}
                  className="flex size-5 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:text-page-text"
                >
                  <IconX size={10} />
                </button>
              )}
            </div>
          </div>

          {/* Creator list */}
          <div className="scrollbar-hide flex-1 overflow-y-auto" style={{ maxHeight: "calc(90dvh - 280px)" }}>
            {/* Selected count */}
            {invited.size > 0 && (
              <div className="flex items-center justify-between border-b border-foreground/[0.06] px-4 py-2.5 sm:px-5">
                <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
                  {invited.size} creator{invited.size !== 1 ? "s" : ""} selected
                </span>
                <button
                  type="button"
                  onClick={() => setInvited(new Set())}
                  className="cursor-pointer font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Suggested label */}
            <div className="px-4 pt-3 pb-1 sm:px-5">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                {search ? `Results (${filteredCreators.length})` : "Suggested creators"}
              </span>
            </div>

            {/* Creator rows */}
            <div className="flex flex-col">
              {filteredCreators.map((creator) => {
                const isInvited = invited.has(creator.id);
                return (
                  <button
                    key={creator.id}
                    type="button"
                    onClick={() => handleInvite(creator.id)}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-foreground/[0.02] sm:px-5"
                  >
                    {/* Avatar */}
                    <div className={cn("size-10 shrink-0 rounded-full bg-gradient-to-br", creator.avatar)} />

                    {/* Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                          {creator.name}
                        </span>
                        <span className="shrink-0 font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                          {creator.handle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">
                          {creator.followers}
                        </span>
                        <span className="font-inter text-xs tracking-[-0.02em]" style={{ color: trustColor(creator.trustScore) }}>
                          {creator.trustScore}% trust
                        </span>
                        <div className="flex items-center gap-1">
                          {creator.platforms.map((p) => (
                            <PlatformDot key={p} platform={p} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <div className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      isInvited
                        ? "border-[#FF9025] bg-[#FF9025]"
                        : "border-foreground/[0.15] bg-transparent",
                    )}>
                      <AnimatePresence>
                        {isInvited && (
                          <motion.svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}

              {filteredCreators.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-10">
                  <span className="font-inter text-sm text-page-text-muted">No creators found</span>
                  <span className="font-inter text-xs text-page-text-subtle">Try a different search term</span>
                </div>
              )}
            </div>
          </div>

          {/* Custom message */}
          <div className="border-t border-foreground/[0.06] px-4 py-3 sm:px-5">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal note (optional)..."
              rows={2}
              className="w-full resize-none bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 border-t border-foreground/[0.06] px-4 py-4 sm:justify-end sm:px-5">
            <DialogPrimitive.Close className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] sm:flex-none sm:px-5">
              Cancel
            </DialogPrimitive.Close>
            <button
              type="button"
              onClick={handleSendInvites}
              disabled={invited.size === 0}
              className={cn(
                "flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full font-inter text-sm font-medium tracking-[-0.02em] transition-colors sm:flex-none sm:px-5",
                invited.size > 0
                  ? "bg-foreground text-white hover:bg-foreground/90 dark:text-[#111111]"
                  : "bg-foreground/[0.06] text-page-text-muted",
              )}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M12.833 1.167L6.417 7.583M12.833 1.167l-4.25 11.666-2.166-5.25-5.25-2.166 11.666-4.25z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Send {invited.size > 0 ? `${invited.size} invite${invited.size !== 1 ? "s" : ""}` : "invites"}
            </button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
