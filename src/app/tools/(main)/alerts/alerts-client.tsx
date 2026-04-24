"use client";

import { useMemo, useState } from "react";
import { Icon, type IconName } from "@/components/scope/icon";
import { Tag } from "@/components/scope/tag";
import { ScopeCard } from "@/components/scope/scope-card";
import { ScopeButton } from "@/components/scope/scope-button";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { ScopeToggle } from "@/components/scope/scope-toggle";
import { ProximityList } from "@/components/scope/proximity-list";
import type {
  AlertDeliveryKey,
  AlertDeliveryState,
  AlertItem,
  AlertRule,
  AlertRuleKind,
} from "@/lib/scope/types";
import { cn } from "@/lib/utils";

type Tab = "inbox" | "rules" | "delivery";

const TAB_ORDER: Tab[] = ["inbox", "rules", "delivery"];

const KIND_ICON: Record<AlertItem["kind"], IconName> = {
  campaign: "radar",
  viral: "flame",
  theme: "trending",
};

const RULE_ICON: Record<AlertRuleKind, IconName> = {
  campaign: "radar",
  viral: "flame",
  digest: "message",
};

function aggregateDelivery(rules: AlertRule[]): AlertDeliveryState {
  if (rules.length === 0) return { email: false, slack: false, discord: false, telegram: false };
  return rules.reduce<AlertDeliveryState>(
    (carry, rule) => ({
      email: carry.email || rule.channels.email,
      slack: carry.slack || rule.channels.slack,
      discord: carry.discord || rule.channels.discord,
      telegram: carry.telegram || rule.channels.telegram,
    }),
    { email: false, slack: false, discord: false, telegram: false },
  );
}

export function AlertsClient({
  alerts: initialAlerts,
  rules: initialRules,
}: {
  alerts: AlertItem[];
  rules: AlertRule[];
}) {
  const [tab, setTab] = useState<Tab>("inbox");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [rules, setRules] = useState(initialRules);
  const delivery = useMemo(() => aggregateDelivery(rules), [rules]);

  const markAllRead = () => setAlerts([]);

  const toggleRule = (id: string) => {
    setRules((curr) => curr.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const toggleDelivery = (channel: AlertDeliveryKey) => {
    if (rules.length === 0) return;
    const next = !delivery[channel];
    setRules((curr) => curr.map((r) => ({ ...r, channels: { ...r.channels, [channel]: next } })));
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
            Alerts
          </h1>
          <p className="mt-1 font-inter text-sm text-page-text-muted">
            Inbox for competitor spikes, campaign launches, and notable format wins.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <ScopeButton size="sm" onClick={markAllRead}>
            Mark all read
          </ScopeButton>
          <ScopeButton variant="primary" size="sm" onClick={() => setTab("rules")}>
            <Icon name="plus" size={13} />
            New rule
          </ScopeButton>
        </div>
      </header>

      <Tabs
        variant="contained"
        selectedIndex={TAB_ORDER.indexOf(tab)}
        onSelect={(idx) => setTab(TAB_ORDER[idx] ?? "inbox")}
      >
        <TabItem index={0} label={`Inbox${alerts.length ? ` · ${alerts.length}` : ""}`} />
        <TabItem index={1} label={`Rules · ${rules.length}`} />
        <TabItem index={2} label="Delivery" />
      </Tabs>

      {tab === "inbox" && <InboxPanel alerts={alerts} />}
      {tab === "rules" && <RulesPanel rules={rules} onToggle={toggleRule} />}
      {tab === "delivery" && (
        <DeliveryPanel delivery={delivery} onToggle={toggleDelivery} hasRules={rules.length > 0} />
      )}
    </div>
  );
}

function InboxPanel({ alerts }: { alerts: AlertItem[] }) {
  if (alerts.length === 0) {
    return (
      <ScopeCard className="p-6">
        <div className="font-inter text-sm font-medium text-page-text">No alerts right now.</div>
        <div className="mt-1 font-inter text-xs text-page-text-muted">
          Once competitor posts and campaigns start moving, spikes and launches will appear here.
        </div>
      </ScopeCard>
    );
  }

  return (
    <ScopeCard>
      <ProximityList itemCount={alerts.length} radius="rounded-none">
        {(register) =>
          alerts.map((a, i) => (
            <div
              key={a.id}
              ref={(el) => register(i, el)}
              className="relative z-[1] grid grid-cols-[32px_minmax(0,1fr)_auto_auto] items-center gap-3 border-t border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] px-4 py-4 first:border-t-0"
            >
              <div className="grid size-8 place-items-center rounded-full bg-scope-accent/15 text-scope-accent">
                <Icon name={KIND_ICON[a.kind]} size={14} />
              </div>
              <div className="min-w-0">
                <div className="font-inter text-sm font-medium text-page-text">{a.title}</div>
                <div className="mt-0.5 font-inter text-xs text-page-text-muted">{a.body}</div>
              </div>
              <span className="font-inter text-xs text-page-text-subtle">{a.ago}</span>
              <ScopeButton size="sm">
                {a.action}
                <Icon name="arrow-right" size={12} />
              </ScopeButton>
            </div>
          ))
        }
      </ProximityList>
    </ScopeCard>
  );
}

function RulesPanel({
  rules,
  onToggle,
}: {
  rules: AlertRule[];
  onToggle: (id: string) => void;
}) {
  const channelSummary = (c: AlertDeliveryState) =>
    (["email", "slack", "discord", "telegram"] as AlertDeliveryKey[])
      .filter((k) => c[k])
      .map((k) => k[0].toUpperCase() + k.slice(1))
      .join(" · ") || "No delivery channels";

  return (
    <div className="flex flex-col gap-3">
      {rules.map((rule) => (
        <ScopeCard key={rule.id} className="flex items-center gap-4 p-4">
          <div
            className={cn(
              "grid size-10 place-items-center rounded-xl",
              rule.enabled
                ? "bg-scope-accent/15 text-scope-accent"
                : "bg-foreground/[0.03] text-page-text-subtle",
            )}
          >
            <Icon name={RULE_ICON[rule.type]} size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-inter text-sm font-semibold text-page-text">{rule.label}</span>
              {rule.focusCompetitor && <Tag kind="info">{rule.focusCompetitor}</Tag>}
            </div>
            <p className="mt-1 font-inter text-xs text-page-text-muted">{rule.description}</p>
            <p className="mt-1.5 font-inter text-xs text-page-text-subtle">
              {channelSummary(rule.channels)}
            </p>
          </div>
          <ScopeButton size="sm" onClick={() => onToggle(rule.id)}>
            {rule.enabled ? "Pause" : "Resume"}
          </ScopeButton>
        </ScopeCard>
      ))}
    </div>
  );
}

function DeliveryPanel({
  delivery,
  onToggle,
  hasRules,
}: {
  delivery: AlertDeliveryState;
  onToggle: (channel: AlertDeliveryKey) => void;
  hasRules: boolean;
}) {
  const channels: { key: AlertDeliveryKey; name: string; detail: string; icon: IconName }[] = [
    { key: "email", name: "Email", detail: "Inbox summaries and launch pings", icon: "at" },
    { key: "slack", name: "Slack", detail: "Shared channel updates for the team", icon: "slack" },
    { key: "discord", name: "Discord", detail: "Fast alerts inside your server", icon: "discord" },
    { key: "telegram", name: "Telegram", detail: "Quick mobile-friendly alerts", icon: "telegram" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {channels.map((channel) => {
        const active = delivery[channel.key];
        return (
          <div
            key={channel.key}
            onClick={() => hasRules && onToggle(channel.key)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors",
              active
                ? "border-[rgba(255,144,37,0.3)] dark:border-[rgba(251,146,60,0.15)]"
                : "border-foreground/[0.06] bg-card-bg hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-[rgba(224,224,224,0.04)]",
              !hasRules && "cursor-not-allowed opacity-60",
            )}
            style={
              active
                ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(251, 146, 60, 0.12) 0%, rgba(251, 146, 60, 0) 50%), var(--toggle-card-bg)" }
                : undefined
            }
          >
            <div
              className={cn(
                "grid size-10 place-items-center rounded-xl",
                active ? "bg-scope-accent/15 text-scope-accent" : "bg-foreground/[0.03] text-page-text-muted",
              )}
            >
              <Icon name={channel.icon} size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-inter text-sm font-medium text-page-text">{channel.name}</div>
              <div className="font-inter text-xs text-page-text-subtle">{channel.detail}</div>
            </div>
            <ScopeToggle
              on={active}
              onToggle={() => onToggle(channel.key)}
              disabled={!hasRules}
            />
          </div>
        );
      })}
      {!hasRules && (
        <ScopeCard className="p-4 sm:col-span-2">
          <p className="font-inter text-sm text-page-text-muted">
            Create at least one alert rule first, then choose where those alerts should show up.
          </p>
        </ScopeCard>
      )}
    </div>
  );
}
