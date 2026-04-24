"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/scope/icon";
import { CompAvatar } from "@/components/scope/comp-avatar";
import { Platform } from "@/components/scope/platform";
import { Tag } from "@/components/scope/tag";
import { Thumb } from "@/components/scope/thumb";
import { Stat } from "@/components/scope/stat";
import { ScopeCard, ScopeCardHeader } from "@/components/scope/scope-card";
import { ScopeButton, ScopeLinkButton } from "@/components/scope/scope-button";
import { ProximityList } from "@/components/scope/proximity-list";
import type { CreativeBrief, SwipeBoard } from "@/lib/scope/types";
import { fmtNum } from "@/lib/scope/utils";
import { cn } from "@/lib/utils";

export function SwipeClient({
  boards: initialBoards,
  workspaceName,
  sampleBrief,
}: {
  boards: SwipeBoard[];
  workspaceName: string;
  sampleBrief: CreativeBrief;
}) {
  const [boards, setBoards] = useState(initialBoards);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(
    initialBoards[0]?.id ?? null,
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [brief, setBrief] = useState<CreativeBrief | null>(null);

  const selectedBoard = boards.find((b) => b.id === selectedBoardId) ?? boards[0] ?? null;
  const totalSaved = boards.reduce((s, b) => s + b.itemCount, 0);

  const createBoard = () => {
    if (!boardName.trim()) return;
    const id = `b_${Date.now().toString(36)}`;
    const next: SwipeBoard = { id, name: boardName.trim(), itemCount: 0, items: [] };
    setBoards([...boards, next]);
    setSelectedBoardId(id);
    setBoardName("");
    setComposerOpen(false);
  };

  const generateBrief = () => {
    setBrief(sampleBrief);
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
            Swipe file
          </h1>
          <p className="mt-1 font-inter text-sm text-page-text-muted">
            Save standout competitor posts into boards and turn them into creative briefs for{" "}
            {workspaceName}.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <ScopeButton size="sm" onClick={() => setComposerOpen((o) => !o)}>
            <Icon name="plus" size={13} />
            New board
          </ScopeButton>
          <ScopeButton variant="primary" size="sm" onClick={generateBrief}>
            <Icon name="sparkles" size={13} />
            Generate brief
          </ScopeButton>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ScopeCard className="p-4">
          <Stat label="Boards" value={boards.length} />
        </ScopeCard>
        <ScopeCard className="p-4">
          <Stat label="Saved posts" value={totalSaved} />
        </ScopeCard>
        <ScopeCard className="p-4">
          <Stat label="Current board" value={selectedBoard?.name ?? "None yet"} />
        </ScopeCard>
        <ScopeCard className="p-4">
          <Stat
            label="Brief source"
            value={brief ? "Kaito · TikTok" : "Ready when you are"}
          />
        </ScopeCard>
      </div>

      {brief && <BriefCard brief={brief} onClose={() => setBrief(null)} />}

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ScopeCard className="self-start">
          <ScopeCardHeader title="Boards" />
          <div className="flex flex-col gap-1.5 p-3">
            {composerOpen && (
              <div className="flex flex-col gap-2 rounded-xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-foreground/[0.03] p-3">
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="Examples, Hooks, UGC angles…"
                  className="h-9 rounded-lg border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-page-bg px-3 font-inter text-sm text-page-text placeholder:text-page-text-subtle focus:border-scope-accent/40 focus:outline-none"
                />
                <ScopeButton variant="primary" size="sm" onClick={createBoard} disabled={!boardName.trim()}>
                  <Icon name="plus" size={13} />
                  Create board
                </ScopeButton>
              </div>
            )}
            {boards.length === 0 && (
              <p className="px-1 font-inter text-xs text-page-text-subtle">
                No boards yet. Create one above, then save competitor posts into it from Feed, Home, or Explore.
              </p>
            )}
            <ProximityList itemCount={boards.length} className="flex flex-col" radius="rounded-xl">
              {(register) =>
                boards.map((board, i) => {
                  const active = board.id === selectedBoard?.id;
                  return (
                    <button
                      key={board.id}
                      ref={(el) => register(i, el)}
                      type="button"
                      onClick={() => setSelectedBoardId(board.id)}
                      className={cn(
                        "relative z-[1] flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors",
                        active
                          ? "bg-scope-accent/10 ring-1 ring-inset ring-scope-accent/30"
                          : "hover:bg-foreground/[0.04]",
                      )}
                    >
                      <span className="font-inter text-sm font-medium text-page-text">{board.name}</span>
                      <span className="font-inter text-xs text-page-text-subtle">
                        {board.itemCount} saved posts
                      </span>
                    </button>
                  );
                })
              }
            </ProximityList>
          </div>
        </ScopeCard>

        <ScopeCard>
          <ScopeCardHeader
            title={
              selectedBoard ? `${selectedBoard.name} · ${selectedBoard.itemCount} saved` : "Saved posts"
            }
          />
          <div className="p-4">
            {!selectedBoard ? (
              <p className="font-inter text-sm text-page-text-muted">
                Create a board, then save strong competitor posts from the dashboard.
              </p>
            ) : selectedBoard.items.length === 0 ? (
              <div>
                <p className="font-inter text-sm text-page-text-muted">
                  This board exists, but nothing has been saved into it yet.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ScopeLinkButton variant="primary" size="sm" href="/tools/feed">
                    <Icon name="feed" size={13} />
                    Browse feed
                  </ScopeLinkButton>
                  <ScopeLinkButton size="sm" href="/tools/explore">
                    <Icon name="search" size={13} />
                    Search
                  </ScopeLinkButton>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                {selectedBoard.items.map((post) => (
                  <div key={post.id} className="flex flex-col gap-2 rounded-2xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg p-3">
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
                    <div className="flex items-center gap-1.5">
                      <ScopeButton size="xs" onClick={generateBrief}>
                        <Icon name="sparkles" size={12} />
                        Brief
                      </ScopeButton>
                      {post.url ? (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-7 items-center gap-1.5 rounded-full bg-foreground/[0.03] px-2.5 font-inter text-[11px] font-medium text-page-text hover:bg-foreground/[0.06]"
                        >
                          <Icon name="arrow-up-right" size={12} />
                          Open
                        </a>
                      ) : (
                        <Link
                          href="/tools/feed"
                          className="inline-flex h-7 items-center gap-1.5 rounded-full bg-foreground/[0.03] px-2.5 font-inter text-[11px] font-medium text-page-text hover:bg-foreground/[0.06]"
                        >
                          <Icon name="arrow-right" size={12} />
                          Feed
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScopeCard>
      </div>
    </div>
  );
}

function BriefCard({ brief, onClose }: { brief: CreativeBrief; onClose: () => void }) {
  return (
    <ScopeCard accent className="p-5">
      <div className="flex items-center gap-2">
        <Icon name="sparkles" size={14} className="text-scope-accent" />
        <span className="font-inter text-sm font-semibold text-page-text">Creative brief</span>
        <Tag kind="info">Kaito · TikTok</Tag>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-7 items-center justify-center rounded-full bg-foreground/[0.03] text-page-text-muted hover:bg-foreground/[0.06]"
          aria-label="Dismiss brief"
        >
          <Icon name="x" size={12} />
        </button>
      </div>
      <div className="mt-4 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-inter text-lg font-semibold tracking-[-0.02em] text-page-text">
            {brief.title}
          </h2>
          <p className="mt-2 font-inter text-sm leading-relaxed text-page-text-muted">
            {brief.angle}
          </p>
          <div className="mt-4 grid grid-cols-[96px_1fr] gap-x-4 gap-y-2 font-inter text-sm">
            <span className="text-page-text-subtle">Audience</span>
            <span className="text-page-text">{brief.audience}</span>
            <span className="text-page-text-subtle">Hook</span>
            <span className="text-page-text">{brief.hook}</span>
            <span className="text-page-text-subtle">CTA</span>
            <span className="text-page-text">{brief.cta}</span>
          </div>
        </div>
        <ScopeCard className="p-4">
          <div className="font-inter text-xs font-medium text-page-text">Structure</div>
          <ol className="mt-2 flex flex-col gap-2 font-inter text-sm">
            {brief.structure.map((step, i) => (
              <li key={step} className="flex gap-2 text-page-text">
                <span className="text-page-text-subtle">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </ScopeCard>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="font-inter text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Do this
          </div>
          <ul className="mt-2 flex flex-col gap-1.5 font-inter text-sm text-page-text">
            {brief.doThis.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3">
          <div className="font-inter text-xs font-semibold text-red-600 dark:text-red-400">
            Avoid this
          </div>
          <ul className="mt-2 flex flex-col gap-1.5 font-inter text-sm text-page-text">
            {brief.avoidThis.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </ScopeCard>
  );
}
