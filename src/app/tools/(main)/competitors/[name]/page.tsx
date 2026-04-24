import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/scope/icon";
import { CompAvatar } from "@/components/scope/comp-avatar";
import { Platform } from "@/components/scope/platform";
import { Thumb } from "@/components/scope/thumb";
import { Tag } from "@/components/scope/tag";
import { Velocity } from "@/components/scope/velocity";
import { ScopeCard, ScopeCardHeader } from "@/components/scope/scope-card";
import { ScopeLinkButton } from "@/components/scope/scope-button";
import { MOCK_COMPETITORS, MOCK_POSTS } from "@/lib/scope/mock-data";
import { ACTIVE_PLATFORM_LABELS } from "@/lib/scope/types";
import { fmtNum } from "@/lib/scope/utils";
import { cn } from "@/lib/utils";

const FORMAT_BREAKDOWN = [
  { name: "Talking head", share: 48, avgViews: 180_000, winner: false },
  { name: "Screen record", share: 22, avgViews: 95_000, winner: false },
  { name: "Meme / text", share: 18, avgViews: 340_000, winner: true },
  { name: "Carousel", share: 12, avgViews: 28_000, winner: false },
];

const HOOK_PATTERNS = [
  { rank: 1, name: "\"I turned $X into $Y\"", used: 8, avgViews: 640_000 },
  { rank: 2, name: "Question openers (\"What if…\")", used: 6, avgViews: 280_000 },
  { rank: 3, name: "Screenshot reveal", used: 5, avgViews: 410_000 },
  { rank: 4, name: "Cautionary tale", used: 3, avgViews: 310_000 },
];

// 7×24 heatmap with deterministic intensity 0..5
function heatmap(seed: string) {
  const s = Array.from(seed).reduce((sum, ch, i) => sum + ch.charCodeAt(0) * (i + 1), 0);
  const cells: number[][] = [];
  for (let day = 0; day < 7; day++) {
    const row: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const base = ((s + day * 31 + hour * 7) * 9301 + 49297) % 233280;
      const n = base / 233280;
      let val = Math.floor(n * 5);
      // bias toward morning/afternoon/evening peaks
      if (hour === 9 || hour === 14 || hour === 20) val = Math.min(5, val + 2);
      if (day === 4) val = Math.min(5, val + 1); // Thursday peak
      row.push(val);
    }
    cells.push(row);
  }
  return cells;
}

export default async function CompetitorProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const slug = decodeURIComponent(name);
  const competitor = MOCK_COMPETITORS.find(
    (c) => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase(),
  );
  if (!competitor) notFound();

  const posts = MOCK_POSTS.filter((p) => p.competitor === competitor.name);
  const topPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 6);
  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments, 0);
  const totalShares = Math.round(totalLikes * 0.12);

  const heat = heatmap(competitor.slug);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/tools/competitors"
        className="inline-flex w-fit items-center gap-1 font-inter text-xs text-page-text-muted transition-colors hover:text-page-text"
      >
        <Icon name="chevron-right" size={12} className="rotate-180" />
        All competitors
      </Link>

      {/* Hero */}
      <div className="flex flex-wrap items-start gap-5">
        <CompAvatar name={competitor.name} size="xl" logoUrl={competitor.logoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-inter text-[26px] font-semibold tracking-[-0.02em] text-page-text">
              {competitor.name}
            </h1>
            <Tag kind="info">{competitor.cat}</Tag>
            <Velocity level={competitor.aggregate.velocity} down={competitor.aggregate.down} />
          </div>
          <p className="mt-1.5 font-inter text-sm text-page-text-muted">
            {posts.length} indexed posts · Tracked since Apr 12 · Last synced 6 min ago
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {competitor.platforms.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 rounded-2xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg px-3 py-2.5"
              >
                <Platform p={p} size="lg" />
                <div>
                  <div className="font-inter text-xs font-medium text-page-text">
                    {ACTIVE_PLATFORM_LABELS[p]}
                  </div>
                  <div className="font-inter text-xs text-page-text-subtle">
                    @{competitor.handles[p] || competitor.name.toLowerCase()}
                  </div>
                  <div
                    className={cn(
                      "font-inter text-xs",
                      competitor.deltas[p] >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500",
                    )}
                  >
                    {fmtNum(competitor.followers[p])} · {competitor.deltas[p] >= 0 ? "+" : ""}
                    {competitor.deltas[p].toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1.5">
            <ScopeLinkButton size="sm" href={`/tools/alerts?tab=rules&focus=${encodeURIComponent(competitor.name)}`}>
              <Icon name="bell" size={13} />
              Alerts
            </ScopeLinkButton>
            <ScopeLinkButton
              size="sm"
              variant="icon"
              href={`/tools/feed?competitor=${encodeURIComponent(competitor.name)}`}
              aria-label="Open in feed"
            >
              <Icon name="dots" size={13} />
            </ScopeLinkButton>
          </div>
          <div className="font-inter text-xs text-page-text-subtle">
            {fmtNum(competitor.totalFollowers)} total followers
          </div>
        </div>
      </div>

      {/* At a glance */}
      <ScopeCard>
        <ScopeCardHeader title="At a glance (7d)" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 sm:grid-cols-5">
          <MiniStat label="Posts" value={competitor.aggregate.posts} />
          <MiniStat label="Views" value={fmtNum(totalViews)} />
          <MiniStat label="Likes" value={fmtNum(totalLikes)} />
          <MiniStat label="Comments" value={fmtNum(totalComments)} />
          <MiniStat label="Shares" value={fmtNum(totalShares)} />
        </div>
        <div className="border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-4 py-3 font-inter text-sm text-page-text-muted">
          Engagement rate{" "}
          <span className="font-medium text-page-text">{competitor.aggregate.eng.toFixed(1)}%</span>
          <span
            className={cn(
              "ml-2",
              competitor.aggregate.engDelta >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-500",
            )}
          >
            {competitor.aggregate.engDelta >= 0 ? "▲" : "▼"}{" "}
            {competitor.aggregate.engDelta >= 0 ? "+" : ""}
            {competitor.aggregate.engDelta.toFixed(1)}pt vs prior 7d
          </span>
          <span className="ml-3">
            Best platform this week{" "}
            <span className="font-medium text-page-text">
              {ACTIVE_PLATFORM_LABELS[competitor.aggregate.bestPlatform]}
            </span>
          </span>
        </div>
      </ScopeCard>

      {/* Views over time */}
      <ScopeCard>
        <ScopeCardHeader
          title="Views over time"
          icon={<Icon name="trending" size={13} className="text-scope-accent" />}
        />
        <div className="px-4 py-4">
          <ViewsChart slug={competitor.slug} />
        </div>
      </ScopeCard>

      {/* Top posts + Format breakdown */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ScopeCard>
          <ScopeCardHeader title="Top posts this month" />
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
            {topPosts.map((p) => (
              <div key={p.id} className="flex flex-col gap-2">
                <Thumb aspect="9/16" label="VIDEO" duration={p.duration} imageUrl={p.thumbnailUrl} seed={String(p.id)}>
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 font-inter text-xs text-white">
                    <span>{fmtNum(p.views)}</span>
                    <span className="text-white/70">·</span>
                    <span>{fmtNum(p.likes)}</span>
                  </div>
                </Thumb>
                <div className="flex items-center gap-1.5">
                  <Platform p={p.platform} size="sm" />
                  <Velocity level={p.velocity} />
                  <span className="ml-auto font-inter text-xs text-page-text-subtle">
                    {p.hours}h
                  </span>
                </div>
                <p className="line-clamp-2 font-inter text-xs text-page-text">{p.caption}</p>
              </div>
            ))}
            {topPosts.length === 0 && (
              <div className="col-span-full font-inter text-sm text-page-text-subtle">
                No posts indexed yet.
              </div>
            )}
          </div>
        </ScopeCard>

        <ScopeCard>
          <ScopeCardHeader title="Format breakdown" />
          <div className="flex flex-col gap-3.5 p-4">
            {FORMAT_BREAKDOWN.map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-inter text-sm">
                  <span className="flex items-center gap-2 text-page-text">
                    {f.name}
                    {f.winner && <Tag kind="success">winner</Tag>}
                  </span>
                  <span className="text-page-text-subtle">
                    {f.share}% · avg {fmtNum(f.avgViews)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                  <div
                    className={cn("h-full rounded-full", f.winner ? "bg-emerald-500" : "bg-scope-accent")}
                    style={{ width: `${f.share * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScopeCard>
      </div>

      {/* Cadence + Hooks */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ScopeCard>
          <ScopeCardHeader title="Posting cadence" />
          <div className="p-4">
            <p className="mb-3 font-inter text-sm text-page-text-muted">
              Avg <span className="font-medium text-page-text">3.3 posts/day</span> · Peak hours
              9am, 2pm, 8pm ET · Most active <span className="font-medium text-page-text">Thursday</span>
            </p>
            <div className="flex flex-col gap-0.5">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dIdx) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-8 font-inter text-[11px] text-page-text-subtle">{day}</span>
                  <div className="grid flex-1 gap-0.5 [grid-template-columns:repeat(24,minmax(0,1fr))]">
                    {heat[dIdx].map((v, hIdx) => (
                      <span
                        key={hIdx}
                        className="aspect-square rounded-sm"
                        style={{
                          backgroundColor:
                            v === 0
                              ? "var(--color-foreground, #000)" // overridden by opacity below
                              : "var(--color-scope-accent)",
                          opacity: v === 0 ? 0.05 : 0.15 + v * 0.17,
                        }}
                        title={`${day} ${hIdx}:00 — intensity ${v}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-1 ml-10 flex justify-between font-inter text-[10px] text-page-text-subtle">
                <span>0</span>
                <span>6</span>
                <span>12</span>
                <span>18</span>
                <span>23</span>
              </div>
            </div>
          </div>
        </ScopeCard>

        <ScopeCard>
          <ScopeCardHeader title="Hook patterns" icon={<Icon name="sparkles" size={13} className="text-scope-accent" />} />
          <div className="flex flex-col">
            {HOOK_PATTERNS.map((h, i) => (
              <div
                key={h.rank}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  i < HOOK_PATTERNS.length - 1 && "border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)]",
                )}
              >
                <span className="w-5 font-inter text-xs text-page-text-subtle">#{h.rank}</span>
                <span className="flex-1 font-inter text-sm text-page-text">{h.name}</span>
                <span className="font-inter text-xs text-page-text-subtle">
                  used {h.used}× · avg {fmtNum(h.avgViews)}
                </span>
              </div>
            ))}
          </div>
        </ScopeCard>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="font-inter text-xs text-page-text-subtle">{label}</div>
      <div className="mt-0.5 font-inter text-xl font-semibold text-page-text">{value}</div>
    </div>
  );
}

function ViewsChart({ slug }: { slug: string }) {
  const seed = Array.from(slug).reduce((s, ch, i) => s + ch.charCodeAt(0) * (i + 1), 0);
  const data = Array.from({ length: 30 }, (_, i) => {
    const n = ((seed + i * 17) * 9301 + 49297) % 233280;
    return 50 + (n % 80) + (i === 12 ? 60 : 0);
  });
  const width = 940;
  const height = 200;
  const pad = 30;
  const maxY = Math.max(...data);
  const points = data.map(
    (v, i) =>
      [
        pad + ((width - pad * 2) * i) / (data.length - 1),
        height - pad - (v / maxY) * (height - pad * 2),
      ] as const,
  );
  const path = points
    .map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`)
    .join(" ");
  const fillPath = `${path} L${width - pad} ${height - pad} L${pad} ${height - pad} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block">
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line
          key={i}
          x1={pad}
          x2={width - pad}
          y1={pad + (height - pad * 2) * f}
          y2={pad + (height - pad * 2) * f}
          stroke="currentColor"
          className="text-border"
          strokeDasharray="2 4"
        />
      ))}
      <path d={fillPath} fill="var(--color-scope-accent)" opacity="0.14" />
      <path d={path} stroke="var(--color-scope-accent)" strokeWidth="1.8" fill="none" />
      <circle cx={points[12][0]} cy={points[12][1]} r="4" fill="var(--color-scope-accent)" />
      <text x={points[12][0] + 8} y={points[12][1] - 6} fill="var(--color-scope-accent)" fontSize="11">
        ▲ Apr 3 — viral spike
      </text>
    </svg>
  );
}
