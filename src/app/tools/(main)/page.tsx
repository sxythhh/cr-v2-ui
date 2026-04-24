"use client";

import Link from "next/link";
import { Icon } from "@/components/scope/icon";
import { Platform } from "@/components/scope/platform";
import { CompAvatar } from "@/components/scope/comp-avatar";
import { Sparkline } from "@/components/scope/sparkline";
import { Velocity } from "@/components/scope/velocity";
import { Thumb } from "@/components/scope/thumb";
import { Tag } from "@/components/scope/tag";
import { Stat } from "@/components/scope/stat";
import { ScopeCard, ScopeCardHeader } from "@/components/scope/scope-card";
import { ScopeLinkButton } from "@/components/scope/scope-button";
import { ProximityList } from "@/components/scope/proximity-list";
import { MOCK_CAMPAIGNS, MOCK_POSTS, MOCK_THEMES, MOCK_WORKSPACE } from "@/lib/scope/mock-data";
import { fmtNum } from "@/lib/scope/utils";

export default function ScopeHomePage() {
  const campaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "new" || c.launched.includes("ago")).slice(0, 3);
  const topPosts = MOCK_POSTS.slice(0, 5);
  const viewsSum = MOCK_POSTS.reduce((sum, p) => sum + p.views, 0);
  const viralCount = MOCK_POSTS.filter((p) => p.views >= 100_000).length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
          Good morning.
        </h1>
        <p className="font-inter text-sm text-page-text-muted">
          Here&apos;s what&apos;s cooking across your {MOCK_WORKSPACE.name} competitors.
        </p>
      </header>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ScopeCard className="p-4">
          <Stat label="Posts (24h)" value={MOCK_POSTS.length} delta="live index" />
        </ScopeCard>
        <ScopeCard className="p-4">
          <Stat label="Views (24h)" value={fmtNum(viewsSum)} delta="across tracked posts" />
        </ScopeCard>
        <ScopeCard className="p-4">
          <Stat label="Viral posts" value={viralCount} delta="crossed 100K today" />
        </ScopeCard>
        <ScopeCard accent className="p-4">
          <Stat
            label="Campaigns active"
            value={MOCK_CAMPAIGNS.length}
            delta={`${campaigns.length} new`}
          />
        </ScopeCard>
      </div>

      {/* Campaign launches */}
      <ScopeCard>
        <ScopeCardHeader
          title={
            <>
              Campaign launches
              {campaigns.length > 0 && <Tag kind="new">{campaigns.length} new</Tag>}
            </>
          }
          icon={<Icon name="radar" size={14} className="text-scope-accent" />}
          actions={
            <ScopeLinkButton variant="ghost" size="sm" href="/tools/radar">
              View all
              <Icon name="arrow-right" size={13} />
            </ScopeLinkButton>
          }
        />
        <ProximityList itemCount={campaigns.length} radius="rounded-none">
          {(register) =>
            campaigns.map((c, i) => (
              <div
                key={c.id}
                ref={(el) => register(i, el)}
                className="relative z-[1] grid grid-cols-[48px_1fr_auto] items-center gap-4 px-4 py-4 border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] first:border-t-0"
              >
                <CompAvatar name={c.host} size="lg" logoUrl={c.host === "Kaito" ? "kaito.ai" : c.host === "SideShift" ? "sideshift.ai" : c.host === "Zealy" ? "zealy.io" : null} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-inter text-sm font-semibold text-page-text">{c.host}</span>
                    <span className="font-inter text-xs text-page-text-subtle">launched</span>
                    <span className="font-inter text-sm font-medium text-scope-accent">{c.name}</span>
                    {c.status === "new" && <Tag kind="new">New</Tag>}
                  </div>
                  <p className="mt-1 line-clamp-2 font-inter text-xs text-page-text-muted">{c.desc}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-inter text-xs text-page-text-subtle">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="clock" size={11} />
                      {c.launched}
                    </span>
                    <span>
                      Pool <span className="text-page-text">${fmtNum(c.pool)}</span>
                    </span>
                    <span>
                      Ends in <span className="text-page-text">{c.endsIn}</span>
                    </span>
                    <span>Source {c.source}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <ScopeLinkButton size="sm" href={`/tools/radar?host=${encodeURIComponent(c.host)}`}>
                    Details
                  </ScopeLinkButton>
                  <ScopeLinkButton
                    variant="primary"
                    size="sm"
                    href={`/tools/competitors?focus=${encodeURIComponent(c.host)}`}
                  >
                    Track
                  </ScopeLinkButton>
                </div>
              </div>
            ))
          }
        </ProximityList>
      </ScopeCard>

      {/* Top posts + Themes */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <ScopeCard>
          <ScopeCardHeader
            title="Top competitor posts (last 24h)"
            icon={<Icon name="flame" size={14} className="text-scope-accent" />}
            actions={
              <ScopeLinkButton variant="ghost" size="sm" href="/tools/feed">
                See {MOCK_POSTS.length} indexed posts
                <Icon name="arrow-right" size={13} />
              </ScopeLinkButton>
            }
          />
          <ProximityList itemCount={topPosts.length} radius="rounded-none">
            {(register) =>
              topPosts.map((p, i) => (
                <Link
                  key={p.id}
                  href="/tools/feed"
                  ref={(el) => register(i, el)}
                  className="relative z-[1] grid grid-cols-[56px_minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] first:border-t-0"
                >
                  <div className="w-14 shrink-0">
                    <Thumb aspect="9/16" label="VIDEO" duration={p.duration} imageUrl={p.thumbnailUrl} seed={String(p.id)} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CompAvatar name={p.competitor} size="sm" logoUrl={p.competitorLogoUrl} />
                      <span className="font-inter text-xs font-medium text-page-text">{p.competitor}</span>
                      <Platform p={p.platform} size="sm" />
                      <span className="font-inter text-xs text-page-text-subtle">· {p.hours}h</span>
                    </div>
                    <p className="mt-1 truncate font-inter text-sm text-page-text">{p.caption}</p>
                    <div className="mt-1 flex items-center gap-3 font-inter text-xs text-page-text-subtle">
                      <span className="inline-flex items-center gap-1">
                        <Icon name="eye" size={11} />
                        {fmtNum(p.views)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Icon name="heart" size={11} />
                        {fmtNum(p.likes)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Icon name="message" size={11} />
                        {fmtNum(p.comments)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Velocity level={p.velocity} />
                    <div className="mt-1 font-inter text-xs text-page-text-subtle">top 2%</div>
                  </div>
                  <Icon name="chevron-right" size={14} className="text-page-text-subtle" />
                </Link>
              ))
            }
          </ProximityList>
        </ScopeCard>

        <ScopeCard>
          <ScopeCardHeader
            title="This week's themes"
            icon={<Icon name="trending" size={14} className="text-scope-accent" />}
          />
          <ProximityList itemCount={MOCK_THEMES.length} radius="rounded-none">
            {(register) =>
              MOCK_THEMES.map((t, i) => (
                <div
                  key={t.rank}
                  ref={(el) => register(i, el)}
                  className="relative z-[1] flex items-center gap-3 px-4 py-3 border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] first:border-t-0"
                >
                  <span className="w-5 font-inter text-xs text-page-text-subtle">#{t.rank}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-inter text-sm font-medium text-page-text">{t.name}</div>
                    <div className="mt-1 flex items-center gap-2 font-inter text-xs text-page-text-subtle">
                      <span>{t.count} posts</span>
                      <span className="text-emerald-600 dark:text-emerald-400">▲ {t.deltaPct}%</span>
                    </div>
                  </div>
                  <Sparkline data={t.trend} w={60} h={24} />
                </div>
              ))
            }
          </ProximityList>
        </ScopeCard>
      </div>
    </div>
  );
}
