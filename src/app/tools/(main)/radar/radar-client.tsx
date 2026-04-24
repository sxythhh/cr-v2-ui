"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/scope/icon";
import { CompAvatar } from "@/components/scope/comp-avatar";
import { Stat } from "@/components/scope/stat";
import { Tag } from "@/components/scope/tag";
import { ScopeCard } from "@/components/scope/scope-card";
import { ScopeChip } from "@/components/scope/scope-chip";
import { ScopeButton, ScopeLinkButton } from "@/components/scope/scope-button";
import { ProximityList } from "@/components/scope/proximity-list";
import type { Campaign } from "@/lib/scope/types";
import { fmtNum } from "@/lib/scope/utils";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | Campaign["status"];

const HOST_LOGOS: Record<string, string> = {
  Kaito: "kaito.ai",
  SideShift: "sideshift.ai",
  Zealy: "zealy.io",
  Layer3: "layer3.xyz",
  Galxe: "galxe.com",
};

export function RadarClient({ campaigns }: { campaigns: Campaign[] }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const filtered = useMemo(
    () => (status === "all" ? campaigns : campaigns.filter((c) => c.status === status)),
    [campaigns, status],
  );

  const counts = {
    all: campaigns.length,
    new: campaigns.filter((c) => c.status === "new").length,
    active: campaigns.filter((c) => c.status === "active").length,
    ending: campaigns.filter((c) => c.status === "ending").length,
  };

  const totalPool = campaigns.reduce((s, c) => s + c.pool, 0);
  const totalCreators = campaigns.reduce((s, c) => s + c.creators, 0);

  const triggerScan = () => {
    setScanning(true);
    setScanMessage("Queueing competitor polls and campaign scan…");
    setTimeout(() => {
      setScanning(false);
      setScanMessage(`Queued ${campaigns.length} campaigns across 18 sources.`);
    }, 1400);
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
            Campaign Radar
          </h1>
          <p className="mt-1 font-inter text-sm text-page-text-muted">
            Content Rewards programs your competitors are running right now.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <ScopeLinkButton size="sm" href="/tools/alerts?tab=rules">
            <Icon name="bell" size={13} />
            Alert rules
          </ScopeLinkButton>
          <ScopeButton variant="primary" size="sm" onClick={triggerScan} disabled={scanning}>
            <Icon name="radar" size={13} />
            {scanning ? "Scanning…" : "Scan now"}
          </ScopeButton>
        </div>
      </header>

      {scanMessage && (
        <ScopeCard className="p-3">
          <div className="font-inter text-xs font-medium text-page-text">
            {scanning ? "Starting scan" : "Scan complete"}
          </div>
          <div className="mt-1 font-inter text-xs text-page-text-muted">{scanMessage}</div>
        </ScopeCard>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ScopeCard className="p-4">
          <Stat label="Active campaigns" value={counts.all} delta={`${counts.new} new today`} />
        </ScopeCard>
        <ScopeCard className="p-4">
          <Stat label="Total pool" value={`$${fmtNum(totalPool)}`} />
        </ScopeCard>
        <ScopeCard className="p-4">
          <Stat label="Creators participating" value={fmtNum(totalCreators)} />
        </ScopeCard>
        <ScopeCard className="p-4">
          <Stat label="Ending this week" value={counts.ending} />
        </ScopeCard>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["all", `All (${counts.all})`],
            ["new", `New (${counts.new})`],
            ["active", `Active (${counts.active})`],
            ["ending", `Ending soon (${counts.ending})`],
          ] as [StatusFilter, string][]
        ).map(([k, v]) => (
          <ScopeChip key={k} active={status === k} onClick={() => setStatus(k)}>
            {v}
          </ScopeChip>
        ))}
      </div>

      <ProximityList itemCount={filtered.length} className="flex flex-col gap-3" radius="rounded-2xl">
        {(register) =>
          filtered.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => register(i, el)}
              className={cn(
                "relative z-[1] grid items-center gap-4 rounded-2xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg p-4",
                "grid-cols-[56px_minmax(0,1fr)_120px]",
                c.status === "ending" && "opacity-80",
              )}
            >
              <CompAvatar name={c.host} size="lg" logoUrl={HOST_LOGOS[c.host] ?? null} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {c.status === "new" && <Tag kind="new">New · {c.launched}</Tag>}
                  {c.status === "active" && <Tag kind="success">Live</Tag>}
                  {c.status === "ending" && <Tag kind="hot">Ends {c.endsIn}</Tag>}
                  <span className="font-inter text-base font-semibold text-page-text">{c.host}</span>
                  <span className="text-page-text-subtle">·</span>
                  <span className="font-inter text-base font-medium text-scope-accent">{c.name}</span>
                  <div className="flex-1" />
                  <span className="font-inter text-xs text-page-text-subtle">{c.source}</span>
                </div>
                <p className="mt-1.5 font-inter text-sm text-page-text-muted">{c.desc}</p>
                <div className="mt-3 grid gap-3 font-inter text-xs sm:grid-cols-[auto_auto_auto_auto_1fr]">
                  <MetricCell label="Pool" value={`$${fmtNum(c.pool)}`} />
                  <MetricCell label="Ends in" value={c.endsIn} />
                  <MetricCell label="Creators" value={c.creators || "—"} />
                  <MetricCell label="Top earning" value={c.topEarning || "—"} />
                  <div>
                    <div className="text-page-text-subtle">Requirements</div>
                    <div className="truncate text-page-text-muted">{c.requirements}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-1.5">
                <Link
                  href={`/tools/radar?host=${encodeURIComponent(c.host)}`}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-foreground/[0.03] px-3 font-inter text-xs font-medium text-page-text hover:bg-foreground/[0.06]"
                >
                  Details
                </Link>
                <Link
                  href={`/tools/explore?q=${encodeURIComponent(c.host)}`}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-foreground/[0.03] px-3 font-inter text-xs font-medium text-page-text hover:bg-foreground/[0.06]"
                >
                  Similar
                </Link>
                <Link
                  href={`/tools/competitors?focus=${encodeURIComponent(c.host)}`}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-scope-accent px-3 font-inter text-xs font-medium text-white hover:bg-scope-accent/90"
                >
                  Track
                </Link>
              </div>
            </div>
          ))
        }
      </ProximityList>

      {filtered.length === 0 && (
        <ScopeCard className="p-6 text-center">
          <div className="font-inter text-sm font-medium text-page-text">
            No campaigns in this status.
          </div>
          <div className="mt-1 font-inter text-xs text-page-text-muted">
            Try another filter or scan for new programs.
          </div>
        </ScopeCard>
      )}
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-page-text-subtle">{label}</div>
      <div className="font-medium text-page-text">{value}</div>
    </div>
  );
}
