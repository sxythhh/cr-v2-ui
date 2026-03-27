import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { GlassTooltip } from "@/components/ui/glass-tooltip";
import { AnalyticsPocPanel } from "./AnalyticsPocPanel";
import {
  ANALYTICS_POC_PLATFORM_LABELS,
  AnalyticsPocPlatformIcon,
  hasAnalyticsPocPlatformIcon,
} from "./AnalyticsPocPlatformIcon";
import {
  AnalyticsPocTable,
  type AnalyticsPocTableColumn,
} from "./AnalyticsPocTable";
import {
  AnalyticsPocToggleGroup,
  AnalyticsPocToggleGroupItem,
} from "./AnalyticsPocToggleGroup";
import TopPostsIcon from "./icons/top-posts.svg";
import type {
  AnalyticsPocTopPostRow,
  AnalyticsPocTopPostsTableProps,
} from "./types";

type SortableKey = "views" | "engagement" | "payout" | "cpm";

const SORTABLE_KEYS: SortableKey[] = ["views", "engagement", "payout", "cpm"];
const METRIC_SUFFIX_MULTIPLIER: Record<string, number> = {
  B: 1_000_000_000,
  K: 1_000,
  M: 1_000_000,
};

function isSortableKey(value: string): value is SortableKey {
  return SORTABLE_KEYS.includes(value as SortableKey);
}

function parseMetricValue(value: string | number): number {
  if (typeof value === "number") return value;

  const normalized = value.replace(/[$,%\s,]/g, "").trim();
  if (!normalized) return 0;

  const metricMatch = normalized.match(/^(-?\d+(?:\.\d+)?)([KMB])?$/i);

  if (metricMatch) {
    const [, numericPart, suffix = ""] = metricMatch;
    const numericValue = Number.parseFloat(numericPart);
    if (Number.isNaN(numericValue)) return 0;

    const multiplier = METRIC_SUFFIX_MULTIPLIER[suffix.toUpperCase()] ?? 1;
    return numericValue * multiplier;
  }

  const fallbackValue = Number.parseFloat(normalized);
  return Number.isNaN(fallbackValue) ? 0 : fallbackValue;
}

function formatViews(value: string | number) {
  if (typeof value === "string") return value;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(value);
}

function formatPercentage(value: string | number) {
  if (typeof value === "string") return value;
  return `${value.toFixed(1)}%`;
}

function formatCurrency(value: string | number) {
  if (typeof value === "string") return value;

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function resolvePlatformLabel(platform: string) {
  const normalizedPlatform = platform.toLowerCase();
  const knownLabel = ANALYTICS_POC_PLATFORM_LABELS[normalizedPlatform];

  if (knownLabel) return knownLabel;
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

function MobilePostCard({
  row,
  index,
}: {
  row: AnalyticsPocTopPostRow;
  index: number;
}) {
  const normalizedPlatform = row.platform.toLowerCase();
  return (
    <div className="flex items-center gap-0 border-b border-foreground/[0.03] px-3">
      <div className="flex w-8 shrink-0 items-center justify-center self-stretch">
        <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[var(--ap-text-secondary)]">
          {index + 1}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 py-3 pr-3">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="truncate font-inter text-sm font-medium leading-none tracking-[-0.02em] text-[var(--ap-text)]">
              {row.post}
            </p>
            <p className="font-inter text-xs leading-none tracking-[-0.02em] text-[var(--ap-text-secondary)]">
              {row.author}
            </p>
          </div>
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground/[0.03] backdrop-blur-xl">
            {hasAnalyticsPocPlatformIcon(normalizedPlatform) ? (
              <AnalyticsPocPlatformIcon
                className="text-foreground/70"
                platform={normalizedPlatform}
                size={14}
                tone="inherit"
              />
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-inter text-xs tracking-[-0.02em] text-[var(--ap-text)]">
            {formatCurrency(row.payout)}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-[var(--ap-text-secondary)]">
              Views · {formatViews(row.views)}
            </span>
            <span className="font-inter text-xs tracking-[-0.02em] text-[var(--ap-text-secondary)]">
              CPM · {formatCurrency(row.cpm)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPocTopPostsTable({
  title,
  headerIcon,
  headerTooltipText,
  mode: initialMode,
  rows,
  pageSize = 10,
  className,
}: AnalyticsPocTopPostsTableProps) {
  const [mode, setMode] = useState<"top" | "bottom">(initialMode);
  const [sortKey, setSortKey] = useState<SortableKey>("views");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(initialMode === "top" ? "desc" : "asc");
  const [page, setPage] = useState(1);

  const columns = useMemo<AnalyticsPocTableColumn<AnalyticsPocTopPostRow>[]>(
    () => [
      {
        header: "#",
        id: "position",
        width: "w-[48px]",
        renderCell: (_row, { absoluteIndex }) => (
          <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[var(--ap-text-secondary)]">
            {absoluteIndex + 1}
          </span>
        ),
      },
      {
        header: "Post",
        id: "post",
        renderCell: (row) => (
          <div className="flex flex-col gap-1">
            <p className="font-inter text-sm font-medium tracking-[-0.02em] text-[var(--ap-text)]">
              {row.post}
            </p>
            <p className="font-inter text-xs font-normal tracking-[-0.02em] text-[var(--ap-text-secondary)]">
              {row.author}
            </p>
          </div>
        ),
      },
      {
        header: "Platform",
        id: "platform",
        renderCell: (row) => {
          const normalizedPlatform = row.platform.toLowerCase();

          return (
            <span className="inline-flex items-center justify-end">
              <span className="flex size-6 items-center justify-center rounded-full bg-foreground/[0.06] backdrop-blur-xl">
                {hasAnalyticsPocPlatformIcon(normalizedPlatform) ? (
                  <AnalyticsPocPlatformIcon
                    className="text-page-text-muted"
                    platform={normalizedPlatform}
                    size={12}
                    tone="inherit"
                  />
                ) : (
                  <span className="size-1.5 rounded-full bg-[var(--ap-text-secondary)]" />
                )}
              </span>
            </span>
          );
        },
        width: "w-[132px]",
      },
      {
        getSortValue: (row) => parseMetricValue(row.payout),
        header: "Earned",
        id: "payout",
        renderCell: (row) => (
          <span className="font-inter text-xs font-normal tracking-[-0.02em] text-[var(--ap-text)]">
            {formatCurrency(row.payout)}
          </span>
        ),
        sortable: true,
        width: "w-[96px]",
      },
      {
        getSortValue: (row) => parseMetricValue(row.views),
        header: "Views",
        id: "views",
        renderCell: (row) => (
          <span className="font-inter text-xs font-normal tracking-[-0.02em] text-[var(--ap-text)]">
            {formatViews(row.views)}
          </span>
        ),
        sortable: true,
        width: "w-[80px]",
      },
      {
        getSortValue: (row) => parseMetricValue(row.engagement),
        header: "Eng. rate",
        id: "engagement",
        renderCell: (row) => (
          <span className="font-inter text-xs font-normal tracking-[-0.02em] text-[var(--ap-text)]">
            {formatPercentage(row.engagement)}
          </span>
        ),
        sortable: true,
        width: "w-[88px]",
      },
      {
        getSortValue: (row) => parseMetricValue(row.cpm),
        header: "CPM",
        id: "cpm",
        renderCell: (row) => (
          <span className="font-inter text-xs font-normal tracking-[-0.02em] text-[var(--ap-text)]">
            {formatCurrency(row.cpm)}
          </span>
        ),
        sortable: true,
        width: "w-[64px]",
      },
    ],
    [],
  );

  return (
    <AnalyticsPocPanel className={className} padding="none">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-0.5">
          <span className="font-inter text-xs font-normal tracking-[-0.02em] text-[var(--ap-text-secondary)]">
            {title}
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-foreground/40">
            <path fillRule="evenodd" clipRule="evenodd" d="M6 0.5C3.0 0.5 0.5 3.0 0.5 6C0.5 9.0 3.0 11.5 6 11.5C9.0 11.5 11.5 9.0 11.5 6C11.5 3.0 9.0 0.5 6 0.5ZM5.5 4C5.5 3.72 5.72 3.5 6 3.5C6.28 3.5 6.5 3.72 6.5 4C6.5 4.28 6.28 4.5 6 4.5C5.72 4.5 5.5 4.28 5.5 4ZM5.5 5.5H6.5V8.5H5.5V5.5Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Mobile: card layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-between border-b border-foreground/[0.03] px-3">
          <div className="flex w-8 shrink-0 items-center justify-center py-3">
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[var(--ap-text-secondary)]">
              #
            </span>
          </div>
          <div className="flex-1 py-3 pr-3">
            <span className="font-inter text-xs font-medium tracking-[-0.02em] text-[var(--ap-text-secondary)]">
              Post
            </span>
          </div>
        </div>
        {rows.slice(0, pageSize).map((row, i) => (
          <MobilePostCard key={row.id} row={row} index={i} />
        ))}
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block">
        <AnalyticsPocTable
          columns={columns}
          emptyMessage="No posts available"
          onPageChange={setPage}
          onSortKeyChange={(nextSortKey) => {
            if (!isSortableKey(nextSortKey)) return;
            if (nextSortKey === sortKey) {
              setSortDirection((d) => (d === "desc" ? "asc" : "desc"));
            } else {
              setSortKey(nextSortKey);
              setSortDirection("desc");
            }
            setPage(1);
          }}
          page={page}
          pageSize={pageSize}
          rowKey={(row) => row.id}
          rows={rows}
          sortDirection={sortDirection}
          sortKey={sortKey}
        />
      </div>
    </AnalyticsPocPanel>
  );
}
