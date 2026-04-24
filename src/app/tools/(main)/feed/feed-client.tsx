"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/scope/icon";
import { CompAvatar } from "@/components/scope/comp-avatar";
import { Platform } from "@/components/scope/platform";
import { Velocity } from "@/components/scope/velocity";
import { Thumb } from "@/components/scope/thumb";
import { Tag } from "@/components/scope/tag";
import { ScopeCard } from "@/components/scope/scope-card";
import { ScopeChip } from "@/components/scope/scope-chip";
import { PostPanel } from "@/components/scope/post-panel";
import { ProximityList } from "@/components/scope/proximity-list";
import { ACTIVE_PLATFORM_KEYS, ACTIVE_PLATFORM_LABELS, type PlatformKey } from "@/lib/scope/types";
import type { Competitor, Post } from "@/lib/scope/types";
import { fmtNum } from "@/lib/scope/utils";
import { cn } from "@/lib/utils";

type Layout = "grid" | "list" | "table";

export function FeedClient({
  posts,
  competitors,
  workspaceName,
}: {
  posts: Post[];
  competitors: Competitor[];
  workspaceName: string;
}) {
  const [layout, setLayout] = useState<Layout>("grid");
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>("all");
  const [platforms, setPlatforms] = useState<Set<PlatformKey>>(new Set(ACTIVE_PLATFORM_KEYS));
  const [openPost, setOpenPost] = useState<Post | null>(null);

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          (selectedCompetitor === "all" || p.competitor === selectedCompetitor) &&
          platforms.has(p.platform),
      ),
    [posts, selectedCompetitor, platforms],
  );

  const related = useMemo(() => {
    if (!openPost) return [];
    return posts.filter((p) => p.id !== openPost.id && p.competitor === openPost.competitor);
  }, [openPost, posts]);

  const togglePlatform = (platform: PlatformKey) => {
    const next = new Set(platforms);
    if (next.has(platform)) next.delete(platform);
    else next.add(platform);
    if (next.size === 0) next.add(platform);
    setPlatforms(next);
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
            Competitor feed
          </h1>
          <p className="mt-1 font-inter text-sm text-page-text-muted">
            {posts.length} indexed posts across {competitors.length} competitors in {workspaceName}.
          </p>
        </div>
        <div className="inline-flex overflow-hidden rounded-full border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg">
          {(["grid", "list", "table"] as Layout[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setLayout(value)}
              aria-label={`${value} view`}
              className={cn(
                "inline-flex size-8 items-center justify-center text-page-text-muted transition-colors hover:bg-foreground/[0.04]",
                layout === value && "bg-foreground/[0.03] text-page-text",
              )}
            >
              <Icon name={value} size={14} />
            </button>
          ))}
        </div>
      </header>

      {/* Filter chip row */}
      <div className="flex flex-wrap items-center gap-2">
        <ScopeChip active={selectedCompetitor === "all"} onClick={() => setSelectedCompetitor("all")}>
          All competitors
        </ScopeChip>
        {competitors.map((c) => (
          <ScopeChip
            key={c.id}
            active={selectedCompetitor === c.name}
            onClick={() => setSelectedCompetitor(c.name)}
          >
            <CompAvatar name={c.name} size="sm" logoUrl={c.logoUrl} />
            {c.name}
          </ScopeChip>
        ))}
        <span className="mx-1 h-5 w-px bg-border" />
        {ACTIVE_PLATFORM_KEYS.map((platform) => (
          <ScopeChip
            key={platform}
            active={platforms.has(platform)}
            onClick={() => togglePlatform(platform)}
          >
            <Platform p={platform} size="sm" />
            {ACTIVE_PLATFORM_LABELS[platform]}
          </ScopeChip>
        ))}
      </div>

      {/* Body */}
      {filtered.length === 0 && (
        <ScopeCard className="p-6 text-center">
          <div className="font-inter text-sm font-medium text-page-text">No posts match those filters.</div>
          <div className="mt-1 font-inter text-xs text-page-text-muted">
            Try loosening the platform or competitor selection.
          </div>
        </ScopeCard>
      )}

      {filtered.length > 0 && layout === "grid" && (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {filtered.map((post) => (
            <FeedCard key={post.id} post={post} onClick={() => setOpenPost(post)} />
          ))}
        </div>
      )}

      {filtered.length > 0 && layout === "list" && (
        <ProximityList itemCount={filtered.length} className="flex flex-col gap-2" radius="rounded-2xl">
          {(register) =>
            filtered.map((post, i) => (
              <button
                key={post.id}
                ref={(el) => register(i, el)}
                type="button"
                onClick={() => setOpenPost(post)}
                className="relative z-[1] flex items-center gap-3 rounded-2xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg p-3 text-left"
              >
                <div className="w-14 shrink-0">
                  <Thumb aspect="9/16" label="" duration={post.duration} imageUrl={post.thumbnailUrl} seed={String(post.id)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <CompAvatar name={post.competitor} size="sm" logoUrl={post.competitorLogoUrl} />
                    <span className="font-inter text-xs font-medium text-page-text">{post.competitor}</span>
                    <Platform p={post.platform} size="sm" />
                    <span className="font-inter text-xs text-page-text-subtle">
                      · {post.hours}h ago · {post.format}
                    </span>
                  </div>
                  <p className="mt-1 truncate font-inter text-sm text-page-text">{post.caption}</p>
                  <div className="mt-1 flex items-center gap-3 font-inter text-xs text-page-text-subtle">
                    <span>Hook <span className="text-page-text-muted">{post.hook}</span></span>
                    {post.handle && <span>@{post.handle}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="font-inter text-sm text-page-text">{fmtNum(post.views)}</span>
                  <span className="font-inter text-sm text-page-text-muted">{fmtNum(post.likes)}</span>
                  <Velocity level={post.velocity} />
                </div>
              </button>
            ))
          }
        </ProximityList>
      )}

      {filtered.length > 0 && layout === "table" && (
        <ScopeCard>
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Column template: thumb | caption | competitor | platform | format | views | likes | eng | velocity | age */}
              <div className="grid grid-cols-[48px_minmax(240px,1fr)_160px_80px_110px_80px_80px_80px_100px_60px] items-center gap-3 border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-4 py-2.5 font-inter text-xs text-page-text-subtle">
                <span />
                <span>Caption</span>
                <span>Competitor</span>
                <span>Platform</span>
                <span>Format</span>
                <span className="text-right">Views</span>
                <span className="text-right">Likes</span>
                <span className="text-right">Eng.</span>
                <span>Velocity</span>
                <span className="text-right">Age</span>
              </div>
              <ProximityList itemCount={filtered.length} radius="rounded-none">
                {(register) =>
                  filtered.map((post, i) => (
                    <button
                      key={post.id}
                      ref={(el) => register(i, el)}
                      type="button"
                      onClick={() => setOpenPost(post)}
                      className="relative z-[1] grid w-full grid-cols-[48px_minmax(240px,1fr)_160px_80px_110px_80px_80px_80px_100px_60px] items-center gap-3 border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-4 py-3 text-left font-inter text-sm first:border-t-0"
                    >
                      <div className="h-10 w-8">
                        <Thumb aspect="9/16" label="" imageUrl={post.thumbnailUrl} seed={String(post.id)} />
                      </div>
                      <span className="truncate text-page-text">{post.caption}</span>
                      <div className="flex items-center gap-1.5 truncate">
                        <CompAvatar name={post.competitor} size="sm" logoUrl={post.competitorLogoUrl} />
                        <span className="truncate text-page-text">{post.competitor}</span>
                      </div>
                      <Platform p={post.platform} size="sm" />
                      <span className="truncate text-page-text-muted">{post.format}</span>
                      <span className="text-right text-page-text">{fmtNum(post.views)}</span>
                      <span className="text-right text-page-text-muted">{fmtNum(post.likes)}</span>
                      <span className="text-right text-page-text">
                        {post.views > 0
                          ? (((post.likes + post.comments) / post.views) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </span>
                      <Velocity level={post.velocity} />
                      <span className="text-right text-page-text-subtle">{post.hours}h</span>
                    </button>
                  ))
                }
              </ProximityList>
            </div>
          </div>
        </ScopeCard>
      )}

      <PostPanel
        post={openPost}
        open={Boolean(openPost)}
        onClose={() => setOpenPost(null)}
        relatedPosts={related}
      />
    </div>
  );
}

function FeedCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg text-left transition-all hover:border-foreground/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
    >
      <div className="relative">
        <Thumb aspect="9/16" label="VIDEO" duration={post.duration} imageUrl={post.thumbnailUrl} seed={String(post.id)} />
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 font-inter text-xs text-white">
          <span className="inline-flex items-center gap-1">
            <Icon name="eye" size={12} />
            {fmtNum(post.views)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="heart" size={12} />
            {fmtNum(post.likes)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="message" size={12} />
            {fmtNum(post.comments)}
          </span>
        </div>
        <div className="absolute inset-x-0 top-0 flex items-center gap-2 px-2.5 py-2">
          <Platform p={post.platform} size="sm" />
          <div className="flex-1" />
          {post.velocity >= 4 && <Tag kind="hot">high velocity</Tag>}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-1.5">
          <CompAvatar name={post.competitor} size="sm" logoUrl={post.competitorLogoUrl} />
          <span className="font-inter text-xs font-medium text-page-text">{post.competitor}</span>
          <span className="font-inter text-xs text-page-text-subtle">· {post.hours}h</span>
          <div className="flex-1" />
          <Velocity level={post.velocity} />
        </div>
        <p className="line-clamp-2 font-inter text-sm text-page-text">{post.caption}</p>
      </div>
    </button>
  );
}
