"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/scope/icon";
import { CompAvatar } from "@/components/scope/comp-avatar";
import { Platform } from "@/components/scope/platform";
import { ScopeCard, ScopeCardHeader } from "@/components/scope/scope-card";
import { ScopeButton, ScopeLinkButton } from "@/components/scope/scope-button";
import { ProximityList } from "@/components/scope/proximity-list";
import { ACTIVE_PLATFORM_KEYS, ACTIVE_PLATFORM_LABELS } from "@/lib/scope/types";
import type { Competitor } from "@/lib/scope/types";

const SECTIONS = [
  { id: "brand", label: "Brand" },
  { id: "comp", label: "Competitors" },
  { id: "alerts", label: "Alerts" },
  { id: "workspace", label: "Workspace" },
];

export function SettingsClient({
  workspaceName,
  workspaceCategory,
  brandUrl,
  competitors,
  boardCount,
  ruleCount,
}: {
  workspaceName: string;
  workspaceCategory: string | null;
  brandUrl: string | null;
  competitors: Competitor[];
  boardCount: number;
  ruleCount: number;
}) {
  const [name, setName] = useState(workspaceName);
  const [category, setCategory] = useState(workspaceCategory ?? "");
  const [url, setUrl] = useState(brandUrl ?? "");
  const [status, setStatus] = useState<string | null>(null);

  const save = () => {
    setStatus("Workspace details updated.");
    setTimeout(() => setStatus(null), 1800);
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
          Settings
        </h1>
      </header>

      {status && (
        <ScopeCard className="p-3">
          <div className="font-inter text-xs text-page-text">{status}</div>
        </ScopeCard>
      )}

      <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
        <nav className="self-start">
          <ProximityList itemCount={SECTIONS.length} className="flex flex-col" radius="rounded-lg">
            {(register) =>
              SECTIONS.map((section, i) => (
                <a
                  key={section.id}
                  ref={(el) => register(i, el)}
                  href={`#${section.id}`}
                  className="relative z-[1] rounded-lg px-3 py-2 font-inter text-sm text-page-text-muted hover:text-page-text"
                >
                  {section.label}
                </a>
              ))
            }
          </ProximityList>
        </nav>

        <div className="flex flex-col gap-5">
          <ScopeCard id="brand">
            <ScopeCardHeader
              title="Brand workspace"
              actions={
                <ScopeButton variant="primary" size="sm" onClick={save} disabled={!name.trim()}>
                  <Icon name="check" size={13} />
                  Save
                </ScopeButton>
              }
            />
            <div className="grid gap-4 p-4 sm:grid-cols-[180px_minmax(0,1fr)]">
              <span className="font-inter text-sm text-page-text-subtle">Brand name</span>
              <input
                className="h-9 rounded-xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-page-bg px-3 font-inter text-sm text-page-text focus:border-scope-accent/40 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="font-inter text-sm text-page-text-subtle">Category</span>
              <input
                className="h-9 rounded-xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-page-bg px-3 font-inter text-sm text-page-text focus:border-scope-accent/40 focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Detected from your website"
              />
              <span className="font-inter text-sm text-page-text-subtle">Primary URL</span>
              <input
                className="h-9 rounded-xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-page-bg px-3 font-inter text-sm text-page-text focus:border-scope-accent/40 focus:outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-site.com"
              />
              <span className="font-inter text-sm text-page-text-subtle">Watched platforms</span>
              <div className="flex flex-wrap gap-1.5">
                {ACTIVE_PLATFORM_KEYS.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1.5 rounded-full border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-foreground/[0.04] px-2.5 py-1 font-inter text-xs text-page-text"
                  >
                    <Platform p={platform} size="sm" />
                    {ACTIVE_PLATFORM_LABELS[platform]}
                  </span>
                ))}
              </div>
            </div>
          </ScopeCard>

          <ScopeCard id="comp">
            <ScopeCardHeader
              title={`Tracked competitors · ${competitors.length}`}
              actions={
                <ScopeLinkButton size="sm" href="/tools/onboarding">
                  <Icon name="plus" size={13} />
                  Add competitors
                </ScopeLinkButton>
              }
            />
            <ProximityList itemCount={competitors.length} radius="rounded-none">
              {(register) =>
                competitors.map((c, i) => (
                  <div
                    key={c.id}
                    ref={(el) => register(i, el)}
                    className="relative z-[1] flex items-center gap-3 border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-4 py-3 first:border-t-0"
                  >
                    <CompAvatar name={c.name} logoUrl={c.logoUrl} />
                    <div className="min-w-0 flex-1">
                      <div className="font-inter text-sm font-medium text-page-text">{c.name}</div>
                      <div className="font-inter text-xs text-page-text-subtle">{c.cat}</div>
                    </div>
                    <Link
                      href={`/tools/competitors/${c.slug}`}
                      className="inline-flex size-8 items-center justify-center rounded-full bg-foreground/[0.03] text-page-text hover:bg-foreground/[0.06]"
                      aria-label={`Open ${c.name}`}
                    >
                      <Icon name="chevron-right" size={13} />
                    </Link>
                  </div>
                ))
              }
            </ProximityList>
          </ScopeCard>

          <ScopeCard id="alerts">
            <ScopeCardHeader title="Alerts & delivery" />
            <div className="p-4">
              <p className="max-w-xl font-inter text-sm text-page-text-muted">
                {ruleCount > 0
                  ? `${ruleCount} alert rules active. Delivery currently includes Email + Slack.`
                  : "No alert rules are active yet. Set them up from the Alerts page to control launches, viral pings, and daily digests."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ScopeLinkButton variant="primary" size="sm" href="/tools/alerts">
                  <Icon name="bell" size={13} />
                  Manage alert rules
                </ScopeLinkButton>
                <ScopeLinkButton size="sm" href="/tools/alerts">
                  <Icon name="slack" size={13} />
                  Delivery settings
                </ScopeLinkButton>
              </div>
            </div>
          </ScopeCard>

          <ScopeCard id="workspace">
            <ScopeCardHeader title="Workspace overview" />
            <div className="flex flex-wrap items-start justify-between gap-4 p-4">
              <div className="max-w-xl">
                <div className="font-inter text-base font-semibold text-page-text">
                  Internal workspace
                </div>
                <p className="mt-1 font-inter text-sm text-page-text-muted">
                  Multi-brand competitor intelligence workspace with {competitors.length} tracked
                  competitors and {boardCount} swipe boards.
                </p>
              </div>
              <ScopeLinkButton size="sm" href="/tools/swipe">
                <Icon name="bookmark" size={13} />
                Open swipe file
              </ScopeLinkButton>
            </div>
          </ScopeCard>
        </div>
      </div>
    </div>
  );
}
