"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/scope/icon";
import { CompAvatar } from "@/components/scope/comp-avatar";
import { Platform } from "@/components/scope/platform";
import { Thumb } from "@/components/scope/thumb";
import { ScopeCard } from "@/components/scope/scope-card";
import { ScopeButton } from "@/components/scope/scope-button";
import { PostPanel } from "@/components/scope/post-panel";
import { ProximityList } from "@/components/scope/proximity-list";
import type { Competitor, Post } from "@/lib/scope/types";
import { fmtNum } from "@/lib/scope/utils";

type Facet = { name: string; count: number };

export function ExploreClient({
  posts,
  competitors,
}: {
  posts: Post[];
  competitors: Competitor[];
}) {
  const [query, setQuery] = useState("");
  const [openPost, setOpenPost] = useState<Post | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) =>
      [post.caption, post.competitor, post.hook, post.format, post.handle ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [posts, query]);

  const related = useMemo(() => {
    if (!openPost) return [];
    return posts.filter((p) => p.id !== openPost.id && p.competitor === openPost.competitor);
  }, [openPost, posts]);

  const formats = useMemo(() => topCounts(posts.map((p) => p.format)), [posts]);
  const hooks = useMemo(() => topCounts(posts.map((p) => p.hook)), [posts]);
  const competitorFacets = useMemo(
    () =>
      competitors.slice(0, 5).map((c) => ({
        name: c.name,
        count: posts.filter((p) => p.competitor === c.name).length,
      })),
    [competitors, posts],
  );

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
          Explore
        </h1>
        <p className="mt-1 font-inter text-sm text-page-text-muted">
          Search and filter across every indexed post in your workspace.
        </p>
      </header>

      <ScopeCard className="flex items-center gap-3 p-3">
        <Icon name="sparkles" size={16} className="shrink-0 text-scope-accent" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search captions, hooks, formats, competitors, or handles"
          className="h-9 min-w-0 flex-1 bg-transparent font-inter text-sm text-page-text placeholder:text-page-text-subtle focus:outline-none"
        />
        <ScopeButton variant="primary" size="sm">
          <Icon name="search" size={13} />
          Search
        </ScopeButton>
      </ScopeCard>

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <ScopeCard className="self-start p-3">
          <div className="font-inter text-xs font-medium text-page-text-subtle">Facets</div>
          <FacetBlock label="Formats" options={formats} onPick={setQuery} />
          <FacetBlock label="Hooks" options={hooks} onPick={setQuery} />
          <FacetBlock label="Competitors" options={competitorFacets} onPick={setQuery} />
        </ScopeCard>

        <div>
          <div className="mb-3 font-inter text-xs text-page-text-subtle">
            {filtered.length} results · sorted by recency
          </div>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
            {filtered.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => setOpenPost(post)}
                className="flex flex-col gap-2 rounded-2xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg p-3 text-left transition-colors hover:border-foreground/20 hover:bg-foreground/[0.02]"
              >
                <Thumb aspect="9/16" label="POST" duration={post.duration} imageUrl={post.thumbnailUrl} seed={String(post.id)} />
                <div className="flex items-center gap-1.5">
                  <Platform p={post.platform} size="sm" />
                  <CompAvatar name={post.competitor} size="sm" logoUrl={post.competitorLogoUrl} />
                  <span className="font-inter text-xs font-medium text-page-text">
                    {post.competitor}
                  </span>
                </div>
                <p className="line-clamp-2 font-inter text-xs text-page-text">{post.caption}</p>
                <div className="font-inter text-xs text-page-text-subtle">
                  {fmtNum(post.views)} views · {post.hook}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <ScopeCard className="col-span-full p-6 text-center">
                <div className="font-inter text-sm text-page-text-muted">
                  No results for &ldquo;{query}&rdquo;. Try a broader search.
                </div>
              </ScopeCard>
            )}
          </div>
        </div>
      </div>

      <PostPanel
        post={openPost}
        open={Boolean(openPost)}
        onClose={() => setOpenPost(null)}
        relatedPosts={related}
      />
    </div>
  );
}

function FacetBlock({
  label,
  options,
  onPick,
}: {
  label: string;
  options: Facet[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="mt-3">
      <div className="mb-1.5 font-inter text-xs font-medium text-page-text">{label}</div>
      {options.length === 0 ? (
        <div className="font-inter text-xs text-page-text-subtle">No data yet</div>
      ) : (
        <ProximityList itemCount={options.length} className="flex flex-col" radius="rounded-lg">
          {(register) =>
            options.map((option, i) => (
              <button
                key={option.name}
                ref={(el) => register(i, el)}
                type="button"
                onClick={() => onPick(option.name)}
                className="relative z-[1] flex items-center gap-2 rounded-lg px-2 py-1.5 font-inter text-xs"
              >
                <span className="flex-1 truncate text-left text-page-text">{option.name}</span>
                <span className="text-page-text-subtle">{option.count}</span>
              </button>
            ))
          }
        </ProximityList>
      )}
    </div>
  );
}

function topCounts(values: string[]): Facet[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}
