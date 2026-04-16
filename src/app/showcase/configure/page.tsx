"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  type ShowcaseConfig,
  DEFAULT_CONFIG,
  loadShowcaseConfig,
  saveShowcaseConfig,
} from "@/lib/showcase-data";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Reusable field component                                          */
/* ------------------------------------------------------------------ */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-inter text-xs font-medium tracking-[-0.02em] text-page-text">
        {label}
      </span>
      {hint && (
        <span className="font-inter text-[11px] tracking-[-0.01em] text-page-text-muted">
          {hint}
        </span>
      )}
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  step,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] px-3 py-2 focus-within:border-foreground/[0.16] focus-within:ring-1 focus-within:ring-foreground/[0.08]">
      {prefix && (
        <span className="font-inter text-xs text-page-text-muted">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        min={min}
        max={max}
        className="w-full min-w-0 bg-transparent font-inter text-sm tabular-nums text-page-text outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      {suffix && (
        <span className="font-inter text-xs text-page-text-muted">
          {suffix}
        </span>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] px-3 py-2 font-inter text-sm text-page-text outline-none placeholder:text-page-text-subtle focus:border-foreground/[0.16] focus:ring-1 focus:ring-foreground/[0.08]"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                   */
/* ------------------------------------------------------------------ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-inter text-xs font-semibold uppercase tracking-[0.06em] text-page-text-muted">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ShowcaseConfigurePage() {
  const router = useRouter();
  const [cfg, setCfg] = useState<ShowcaseConfig>(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setCfg(loadShowcaseConfig());
    setLoaded(true);
  }, []);

  const update = <K extends keyof ShowcaseConfig>(
    key: K,
    value: ShowcaseConfig[K],
  ) => {
    setCfg((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveShowcaseConfig(cfg);
    router.push("/showcase");
  };

  const handleReset = () => {
    setCfg(DEFAULT_CONFIG);
    saveShowcaseConfig(DEFAULT_CONFIG);
  };

  if (!loaded) return null;

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="font-inter text-lg font-semibold tracking-[-0.02em] text-page-text">
          Configure Analytics
        </h1>
        <p className="mt-1 font-inter text-sm tracking-[-0.01em] text-page-text-muted">
          Set the numbers below and hit &ldquo;Generate Dashboard&rdquo; to create a
          realistic analytics view for marketing screenshots.
        </p>
      </div>

      {/* Hero Numbers */}
      <Section title="Hero Numbers">
        <Field label="Total Views" hint="e.g. 5140000 for 5.14M">
          <NumberInput
            value={cfg.totalViews}
            onChange={(v) => update("totalViews", v)}
            min={0}
            step={10000}
          />
        </Field>
        <Field label="Total Earnings" hint="USD amount paid out">
          <NumberInput
            value={cfg.totalEarnings}
            onChange={(v) => update("totalEarnings", v)}
            prefix="$"
            min={0}
            step={100}
          />
        </Field>
        <Field label="Effective CPM" hint="Cost per thousand views">
          <NumberInput
            value={cfg.effectiveCpm}
            onChange={(v) => update("effectiveCpm", v)}
            prefix="$"
            min={0}
            step={0.01}
          />
        </Field>
        <Field label="Pending Payout">
          <NumberInput
            value={cfg.pendingPayout}
            onChange={(v) => update("pendingPayout", v)}
            prefix="$"
            min={0}
            step={50}
          />
        </Field>
        <Field label="Total Submissions">
          <NumberInput
            value={cfg.totalSubmissions}
            onChange={(v) => update("totalSubmissions", v)}
            min={0}
            step={10}
          />
        </Field>
        <Field label="Approval Rate" hint="Percent of submissions approved">
          <NumberInput
            value={cfg.approvalRate}
            onChange={(v) => update("approvalRate", v)}
            suffix="%"
            min={0}
            max={100}
            step={0.1}
          />
        </Field>
      </Section>

      {/* Growth & Engagement */}
      <Section title="Growth & Engagement">
        <Field label="Growth %" hint="Shown on KPI badges">
          <NumberInput
            value={cfg.growthPercent}
            onChange={(v) => update("growthPercent", v)}
            suffix="%"
            step={0.1}
          />
        </Field>
        <Field label="Engagement Rate" hint="Average across platforms">
          <NumberInput
            value={cfg.engagementRate}
            onChange={(v) => update("engagementRate", v)}
            suffix="%"
            min={0}
            max={100}
            step={0.1}
          />
        </Field>
        <Field label="Total Posts">
          <NumberInput
            value={cfg.totalPosts ?? 240}
            onChange={(v) => update("totalPosts", v)}
            min={0}
            step={10}
          />
        </Field>
      </Section>

      {/* Platform Split */}
      <Section title="Platform Split">
        <Field label="TikTok">
          <NumberInput
            value={cfg.tiktokPct}
            onChange={(v) => update("tiktokPct", v)}
            suffix="%"
            min={0}
            max={100}
          />
        </Field>
        <Field label="Instagram">
          <NumberInput
            value={cfg.instagramPct}
            onChange={(v) => update("instagramPct", v)}
            suffix="%"
            min={0}
            max={100}
          />
        </Field>
        <Field label="YouTube">
          <NumberInput
            value={cfg.youtubePct}
            onChange={(v) => update("youtubePct", v)}
            suffix="%"
            min={0}
            max={100}
          />
        </Field>
        <Field label="X (Twitter)">
          <NumberInput
            value={cfg.xPct}
            onChange={(v) => update("xPct", v)}
            suffix="%"
            min={0}
            max={100}
          />
        </Field>
      </Section>

      {/* Creator Dashboard */}
      <Section title="Creator Dashboard">
        <Field label="Balance" hint="Current withdrawable balance">
          <NumberInput
            value={cfg.balance}
            onChange={(v) => update("balance", v)}
            prefix="$"
            min={0}
            step={100}
          />
        </Field>
        <Field label="Earned This Week">
          <NumberInput
            value={cfg.earnedThisWeek}
            onChange={(v) => update("earnedThisWeek", v)}
            prefix="$"
            min={0}
            step={10}
          />
        </Field>
        <Field label="Streak" hint="Days in a row">
          <NumberInput
            value={cfg.streak}
            onChange={(v) => update("streak", v)}
            suffix="days"
            min={0}
            max={365}
          />
        </Field>
        <Field label="Trust Score" hint="0-100">
          <NumberInput
            value={cfg.trustScore}
            onChange={(v) => update("trustScore", v)}
            min={0}
            max={100}
          />
        </Field>
        <Field label="Active Campaigns">
          <NumberInput
            value={cfg.activeCampaigns}
            onChange={(v) => update("activeCampaigns", v)}
            min={0}
            step={1}
          />
        </Field>
      </Section>

      {/* Labels */}
      <Section title="Labels">
        <Field label="Campaign Name">
          <TextInput
            value={cfg.campaignName}
            onChange={(v) => update("campaignName", v)}
            placeholder="Fall Off Campaign"
          />
        </Field>
        <Field label="Date Range Label">
          <TextInput
            value={cfg.dateRange}
            onChange={(v) => update("dateRange", v)}
            placeholder="Last 30 days"
          />
        </Field>
        <Field label="Creator Name" hint="Optional — shown in header">
          <TextInput
            value={cfg.creatorName ?? ""}
            onChange={(v) => update("creatorName", v)}
            placeholder="@yourhandle"
          />
        </Field>
      </Section>

      {/* Platform split total indicator */}
      {(() => {
        const total =
          cfg.tiktokPct + cfg.instagramPct + cfg.youtubePct + cfg.xPct;
        const isOk = total >= 95 && total <= 105;
        return (
          <div
            className={cn(
              "rounded-lg border px-4 py-2 font-inter text-xs",
              isOk
                ? "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400"
                : "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
            )}
          >
            Platform split total: {total}%{" "}
            {isOk ? "(looks good)" : "(should be ~100%)"}
          </div>
        );
      })()}

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-foreground/[0.06] pt-5">
        <button
          onClick={handleSave}
          className="rounded-full bg-foreground px-5 py-2 font-inter text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Generate Dashboard
        </button>
        <button
          onClick={handleReset}
          className="rounded-full bg-foreground/[0.06] px-5 py-2 font-inter text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.1]"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
