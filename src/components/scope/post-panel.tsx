"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CompAvatar } from "./comp-avatar";
import { Platform } from "./platform";
import { Velocity } from "./velocity";
import { Thumb } from "./thumb";
import { Stat } from "./stat";
import { Icon } from "./icon";
import { ScopeButton } from "./scope-button";
import { ScopeCard, ScopeCardHeader } from "./scope-card";
import type { Post } from "@/lib/scope/types";
import { fmtNum } from "@/lib/scope/utils";

export function PostPanel({
  post,
  open,
  onClose,
  relatedPosts = [],
}: {
  post: Post | null;
  open: boolean;
  onClose: () => void;
  relatedPosts?: Post[];
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && post && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[540px] flex-col border-l border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-page-bg shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            role="dialog"
          >
            <header className="flex shrink-0 items-center gap-3 border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-4 py-3">
              <CompAvatar name={post.competitor} logoUrl={post.competitorLogoUrl} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-inter text-sm font-semibold text-page-text">
                  {post.competitor}
                </div>
                <div className="flex items-center gap-1.5 font-inter text-xs text-page-text-subtle">
                  <Platform p={post.platform} size="sm" />
                  <span>· {post.hours}h ago</span>
                  {post.handle && <span>· @{post.handle}</span>}
                </div>
              </div>
              {post.url && (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-foreground/[0.03] text-page-text hover:bg-foreground/[0.06]"
                  aria-label="Open original"
                >
                  <Icon name="arrow-up-right" size={14} />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-8 items-center justify-center rounded-full bg-foreground/[0.03] text-page-text hover:bg-foreground/[0.06]"
                aria-label="Close panel"
              >
                <Icon name="x" size={14} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="grid grid-cols-[180px_1fr] gap-4">
                <Thumb aspect="9/16" label={post.duration || "VIDEO"} duration={post.duration} imageUrl={post.thumbnailUrl} seed={String(post.id)} />
                <div>
                  <p className="font-inter text-sm leading-relaxed text-page-text">{post.caption}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Stat label="Views" value={fmtNum(post.views)} />
                    <Stat label="Likes" value={fmtNum(post.likes)} />
                    <Stat label="Comments" value={fmtNum(post.comments)} />
                  </div>
                  <div className="mt-3 flex items-center gap-2 font-inter text-xs text-page-text-subtle">
                    <span>Velocity</span>
                    <Velocity level={post.velocity} />
                    <span className="text-scope-accent">top 2%</span>
                  </div>
                </div>
              </div>

              <ScopeCard className="mt-5">
                <ScopeCardHeader
                  title="Engagement curve · first 48h"
                  icon={<Icon name="trending" size={13} className="text-scope-accent" />}
                />
                <div className="px-4 py-4">
                  <svg width="100%" viewBox="0 0 400 120" className="block">
                    {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
                      <line
                        key={i}
                        x1={20}
                        x2={380}
                        y1={10 + 100 * f}
                        y2={10 + 100 * f}
                        stroke="currentColor"
                        className="text-border"
                        strokeDasharray="2 3"
                      />
                    ))}
                    <path
                      d="M20 110 L60 98 L100 85 L140 60 L180 40 L220 28 L260 22 L300 20 L340 19 L380 19"
                      stroke="var(--color-scope-accent)"
                      strokeWidth="1.6"
                      fill="none"
                    />
                    <path
                      d="M20 110 L60 98 L100 85 L140 60 L180 40 L220 28 L260 22 L300 20 L340 19 L380 19 L380 110 Z"
                      fill="var(--color-scope-accent)"
                      opacity="0.15"
                    />
                    <circle cx="140" cy="60" r="3" fill="var(--color-scope-accent)" />
                    <text x="148" y="56" fill="var(--color-scope-accent)" fontSize="10">
                      velocity spike · 6h
                    </text>
                  </svg>
                </div>
              </ScopeCard>

              <ScopeCard className="mt-4">
                <ScopeCardHeader
                  title="Hook analysis"
                  icon={<Icon name="sparkles" size={13} className="text-scope-accent" />}
                />
                <div className="px-4 py-4 font-inter text-sm">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                    <span className="text-page-text-subtle">Pattern</span>
                    <span className="font-medium text-page-text">{post.hook}</span>
                    <span className="text-page-text-subtle">Opens with</span>
                    <span className="text-page-text">Question + personal claim + implicit proof</span>
                    <span className="text-page-text-subtle">Length</span>
                    <span className="text-page-text">{post.duration || "n/a"}</span>
                    <span className="text-page-text-subtle">Performs</span>
                    <span className="text-page-text">
                      <span className="text-scope-accent">+48%</span> vs {post.competitor}&apos;s average post
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-foreground/[0.04] p-3">
                    <div className="font-inter text-[11px] uppercase tracking-[0.04em] text-page-text-subtle">
                      Auto transcript · 0:00–0:08
                    </div>
                    <div className="mt-1 font-inter text-sm italic text-page-text">
                      &ldquo;If you&apos;d have told me six months ago I could turn a hundred bucks into ten grand predicting the election, I&apos;d have laughed — but here&apos;s the exact account structure I used…&rdquo;
                    </div>
                  </div>
                </div>
              </ScopeCard>

              {relatedPosts.length > 0 && (
                <ScopeCard className="mt-4">
                  <ScopeCardHeader title="Similar posts · your competitors" />
                  <div className="grid grid-cols-3 gap-3 px-4 py-4">
                    {relatedPosts.slice(0, 3).map((sp) => (
                      <div key={sp.id}>
                        <Thumb aspect="9/16" label="POST" duration={sp.duration} imageUrl={sp.thumbnailUrl} seed={String(sp.id)} />
                        <div className="mt-1.5 font-inter text-xs text-page-text-subtle">
                          {sp.competitor} · {fmtNum(sp.views)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScopeCard>
              )}
            </div>

            <footer className="flex shrink-0 items-center gap-2 border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-4 py-3">
              <ScopeButton variant="default" size="sm" className="flex-1">
                <Icon name="bookmark" size={13} />
                Save
              </ScopeButton>
              <ScopeButton variant="primary" size="sm" className="flex-1">
                <Icon name="sparkles" size={13} />
                Generate brief
              </ScopeButton>
              <ScopeButton variant="icon" size="sm" aria-label="Copy">
                <Icon name="copy" size={13} />
              </ScopeButton>
              <ScopeButton variant="icon" size="sm" aria-label="Download">
                <Icon name="download" size={13} />
              </ScopeButton>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
