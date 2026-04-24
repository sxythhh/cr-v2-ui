"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/scope/icon";
import { CompAvatar } from "@/components/scope/comp-avatar";
import { Platform } from "@/components/scope/platform";
import { Sparkline } from "@/components/scope/sparkline";
import { Stat } from "@/components/scope/stat";
import { Velocity } from "@/components/scope/velocity";
import { ScopeCard } from "@/components/scope/scope-card";
import { ScopeChip } from "@/components/scope/scope-chip";
import { ScopeLinkButton } from "@/components/scope/scope-button";
import { ProximityList } from "@/components/scope/proximity-list";
import { LineChart, ChartLegend, type ChartDataPoint, type ChartSeries } from "@/components/ui/chart";
import { ACTIVE_PLATFORM_KEYS, ACTIVE_PLATFORM_LABELS, type PlatformKey } from "@/lib/scope/types";
import type { Competitor } from "@/lib/scope/types";
import { fmtNum } from "@/lib/scope/utils";
import { cn } from "@/lib/utils";

type View = "table" | "grid" | "chart";
type PlatformFilter = "all" | PlatformKey;

export function CompetitorsClient({
  competitors,
  workspaceName,
}: {
  competitors: Competitor[];
  workspaceName: string;
}) {
  const [view, setView] = useState<View>("table");
  const [platform, setPlatform] = useState<PlatformFilter>("all");

  const filtered = useMemo(
    () =>
      competitors.filter((c) =>
        platform === "all" ? true : c.platforms.includes(platform),
      ),
    [competitors, platform],
  );

  const totalPosts = filtered.reduce((s, c) => s + c.aggregate.posts, 0);
  const totalViews = filtered.reduce((s, c) => s + c.aggregate.views, 0);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
            Competitors
          </h1>
          <p className="mt-1 font-inter text-sm text-page-text-muted">
            Tracking{" "}
            <span className="font-medium text-page-text">{filtered.length} competitors</span> ·{" "}
            {totalPosts} posts indexed · {fmtNum(totalViews)} views this week in {workspaceName}.
          </p>
        </div>
        <ScopeLinkButton variant="primary" size="sm" href="/tools/onboarding">
          <Icon name="plus" size={13} />
          Add competitor
        </ScopeLinkButton>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", ...ACTIVE_PLATFORM_KEYS] as PlatformFilter[]).map((value) => (
          <ScopeChip key={value} active={platform === value} onClick={() => setPlatform(value)}>
            {value === "all" ? (
              "All platforms"
            ) : (
              <>
                <Platform p={value} size="sm" />
                {ACTIVE_PLATFORM_LABELS[value]}
              </>
            )}
          </ScopeChip>
        ))}
        <div className="flex-1" />
        <div className="inline-flex overflow-hidden rounded-full border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg">
          {(["table", "grid", "chart"] as View[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setView(value)}
              aria-label={`${value} view`}
              className={cn(
                "inline-flex size-8 items-center justify-center text-page-text-muted transition-colors hover:bg-foreground/[0.04]",
                view === value && "bg-foreground/[0.03] text-page-text",
              )}
            >
              <Icon name={value === "chart" ? "trending" : value} size={14} />
            </button>
          ))}
        </div>
      </div>

      {view === "table" && <CompetitorTable competitors={filtered} />}
      {view === "grid" && <CompetitorGrid competitors={filtered} />}
      {view === "chart" && <CompetitorChart competitors={filtered} />}
    </div>
  );
}

function CompetitorTable({ competitors }: { competitors: Competitor[] }) {
  return (
    <ScopeCard>
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[minmax(220px,1.4fr)_80px_100px_100px_100px_120px_110px_120px_40px] items-center gap-3 border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-4 py-2.5 font-inter text-xs text-page-text-subtle">
            <span>Competitor</span>
            <span className="text-right">Posts 7d</span>
            <span className="text-right">Views 7d</span>
            <span className="text-right">Engagement</span>
            <span>Velocity</span>
            <span className="text-right">Followers</span>
            <span className="text-right">Follower Δ</span>
            <span>Best platform</span>
            <span />
          </div>
          <ProximityList itemCount={competitors.length} radius="rounded-none">
            {(register) =>
              competitors.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/tools/competitors/${c.slug}`}
                  ref={(el) => register(i, el)}
                  className="relative z-[1] grid grid-cols-[minmax(220px,1.4fr)_80px_100px_100px_100px_120px_110px_120px_40px] items-center gap-3 border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-4 py-3 font-inter text-sm first:border-t-0"
                >
                  <div className="flex items-center gap-3">
                    <CompAvatar name={c.name} logoUrl={c.logoUrl} />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-page-text">{c.name}</div>
                      <div className="truncate text-xs text-page-text-subtle">{c.cat}</div>
                    </div>
                  </div>
                  <span className="text-right text-page-text">{c.aggregate.posts}</span>
                  <span className="text-right text-page-text">{fmtNum(c.aggregate.views)}</span>
                  <span className="text-right text-page-text">
                    {c.aggregate.eng.toFixed(1)}%
                  </span>
                  <Velocity level={c.aggregate.velocity} down={c.aggregate.down} />
                  <span className="text-right text-page-text">{fmtNum(c.totalFollowers)}</span>
                  <span
                    className={cn(
                      "text-right",
                      c.followerDeltaPct >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500",
                    )}
                  >
                    {c.followerDeltaPct >= 0 ? "+" : ""}
                    {c.followerDeltaPct.toFixed(1)}%
                  </span>
                  <Platform p={c.aggregate.bestPlatform} size="sm" />
                  <Icon name="chevron-right" size={14} className="text-page-text-subtle" />
                </Link>
              ))
            }
          </ProximityList>
        </div>
      </div>
    </ScopeCard>
  );
}

function CompetitorGrid({ competitors }: { competitors: Competitor[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {competitors.map((c) => {
        const trend = Array.from({ length: 12 }, (_, index) =>
          Math.max(
            4,
            Math.round(
              c.aggregate.posts * 4 +
                c.aggregate.views / Math.max(1, c.aggregate.posts || 1) / 2000 +
                (index + 2) * ((c.name.length % 5) + 2),
            ),
          ),
        );

        return (
          <Link
            key={c.id}
            href={`/tools/competitors/${c.slug}`}
            className="flex flex-col gap-4 rounded-2xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg p-4 transition-colors hover:border-foreground/20 hover:bg-foreground/[0.02]"
          >
            <div className="flex items-center gap-3">
              <CompAvatar name={c.name} size="lg" logoUrl={c.logoUrl} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-inter text-sm font-semibold text-page-text">
                  {c.name}
                </div>
                <div className="truncate font-inter text-xs text-page-text-subtle">{c.cat}</div>
              </div>
              <Velocity level={c.aggregate.velocity} down={c.aggregate.down} />
            </div>
            <Sparkline
              data={trend}
              w={300}
              h={44}
              color={c.aggregate.down ? "#ef4444" : "var(--color-scope-accent)"}
            />
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Posts" value={c.aggregate.posts} />
              <Stat label="Views" value={fmtNum(c.aggregate.views)} />
              <Stat
                label="Engagement"
                value={`${c.aggregate.eng.toFixed(1)}%`}
                delta={`${c.followerDeltaPct >= 0 ? "+" : ""}${c.followerDeltaPct.toFixed(1)}%`}
                deltaDir={c.followerDeltaPct >= 0 ? "up" : "down"}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.platforms.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-foreground/[0.04] px-2 py-1 font-inter text-xs text-page-text-muted"
                >
                  <Platform p={p} size="sm" />@{c.handles[p] || c.name.toLowerCase()}
                </span>
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

const CHART_COLORS = ["#F28218", "#3B82F6", "#10B981", "#EC4899", "#06B6D4", "#F59E0B"];

const CHART_LABELS = ["30d ago", "", "", "", "", "", "", "", "", "", "", "", "", "", "15d", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Today"];

function CompetitorChart({ competitors }: { competitors: Competitor[] }) {
  const top = competitors.slice(0, 6);

  const series: ChartSeries[] = useMemo(
    () => top.map((c, idx) => ({ key: c.slug, label: c.name, color: CHART_COLORS[idx % CHART_COLORS.length] })),
    [top],
  );

  const data: ChartDataPoint[] = useMemo(() => {
    return Array.from({ length: 30 }, (_, index) => {
      const row: ChartDataPoint = { label: CHART_LABELS[index] ?? "" };
      for (const c of top) {
        const base = c.aggregate.views / Math.max(1, c.aggregate.posts || 1);
        const value = Math.max(1000, Math.round(base * (0.55 + ((index + c.name.length) % 7) / 10)));
        row[c.slug] = value;
      }
      return row;
    });
  }, [top]);

  const [visibleKeys, setVisibleKeys] = useState<string[]>(() => top.map((c) => c.slug));

  const toggleKey = (key: string) => {
    setVisibleKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <ScopeCard className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-inter text-sm font-semibold text-page-text">Momentum snapshot</span>
        <ChartLegend series={series} visibleKeys={visibleKeys} onToggle={toggleKey} />
      </div>
      <LineChart
        data={data}
        series={series}
        visibleKeys={visibleKeys}
        formatValue={(v) => fmtNum(Number(v))}
      />
    </ScopeCard>
  );
}
