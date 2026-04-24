"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@/components/scope/icon";
import { CompAvatar } from "@/components/scope/comp-avatar";
import { Platform } from "@/components/scope/platform";
import { Tag } from "@/components/scope/tag";
import { ScopeCard } from "@/components/scope/scope-card";
import { ScopeButton } from "@/components/scope/scope-button";
import { ScopeToggle, ScopeToggleRow } from "@/components/scope/scope-toggle";
import {
  MOCK_DETECTED_BRAND,
  MOCK_SUGGESTED_COMPETITORS,
  MOCK_WORKSPACE,
} from "@/lib/scope/mock-data";
import type { AlertDeliveryKey, AlertDeliveryState, AlertRuleKind, PlatformKey } from "@/lib/scope/types";
import { ACTIVE_PLATFORM_KEYS, ACTIVE_PLATFORM_LABELS } from "@/lib/scope/types";
import { cn } from "@/lib/utils";

const STEPS = ["Brand", "Profile", "Competitors", "Platforms", "Alerts", "Indexing"] as const;

type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState(MOCK_WORKSPACE.brandUrl);
  const [detected, setDetected] = useState<typeof MOCK_DETECTED_BRAND | null>(null);
  const [category, setCategory] = useState(MOCK_WORKSPACE.category);
  const [analyzing, setAnalyzing] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(
    new Set(MOCK_SUGGESTED_COMPETITORS.slice(0, 4).map((c) => c.name)),
  );
  const [manualAdd, setManualAdd] = useState("");
  const [platforms, setPlatforms] = useState<Record<PlatformKey, boolean>>({
    ig: true,
    tt: true,
    yt: true,
  });
  const [alertPrefs, setAlertPrefs] = useState<Record<AlertRuleKind, boolean>>({
    campaign: true,
    viral: true,
    digest: false,
  });
  const [delivery, setDelivery] = useState<AlertDeliveryState>({
    email: true,
    slack: false,
    discord: false,
    telegram: false,
  });
  const [indexProgress, setIndexProgress] = useState(0);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setDetected(MOCK_DETECTED_BRAND);
      setAnalyzing(false);
      setStep(1);
    }, 1100);
  };

  const addManual = () => {
    const v = manualAdd.trim();
    if (!v) return;
    setPicked((curr) => new Set(curr).add(v));
    setManualAdd("");
  };

  const togglePick = (name: string) => {
    const next = new Set(picked);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setPicked(next);
  };

  const goNext = () => {
    if (step === 4) {
      // Kick off indexing simulation
      setStep(5);
      let pct = 0;
      const iv = setInterval(() => {
        pct = Math.min(100, pct + 6 + Math.random() * 8);
        setIndexProgress(Math.round(pct));
        if (pct >= 100) clearInterval(iv);
      }, 140);
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-8">
      <Header currentStep={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="w-full"
        >
          {step === 0 && (
            <StepShell title="What brand are we scoping?" subtitle="Paste a URL, handle, or brand name. Scope will pull the basics from there.">
              <div className="flex items-center gap-2">
                <input
                  className="h-11 flex-1 rounded-xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg px-3.5 font-inter text-sm text-page-text placeholder:text-page-text-subtle focus:border-scope-accent/40 focus:outline-none"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="polymarket.com, @polymarket, Polymarket"
                />
                <ScopeButton variant="primary" size="md" onClick={analyze} disabled={analyzing || !brand.trim()}>
                  <Icon name="sparkles" size={14} />
                  {analyzing ? "Analyzing…" : "Analyze brand"}
                </ScopeButton>
              </div>
            </StepShell>
          )}

          {step === 1 && detected && (
            <StepShell title="Does this look right?" subtitle="We'll use this profile to pick smart defaults for the rest of onboarding.">
              <ScopeCard className="flex items-start gap-4 p-5">
                <CompAvatar name={detected.name} size="xl" logoUrl={detected.logoUrl} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-inter text-lg font-semibold text-page-text">
                      {detected.name}
                    </span>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-7 rounded-full border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-scope-accent/5 px-3 font-inter text-xs font-medium text-scope-accent focus:border-scope-accent/40 focus:outline-none"
                    />
                  </div>
                  <p className="mt-1.5 font-inter text-sm text-page-text-muted">
                    {detected.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 font-inter text-xs text-page-text-subtle">
                    <span className="flex items-center gap-1">
                      <Icon name="link" size={12} />
                      {detected.url.replace(/^https?:\/\//, "")}
                    </span>
                    {ACTIVE_PLATFORM_KEYS.map((k) =>
                      detected.socials[k] ? (
                        <span key={k} className="flex items-center gap-1">
                          <Platform p={k} size="sm" />
                          @{detected.socials[k]}
                        </span>
                      ) : null,
                    )}
                  </div>
                </div>
              </ScopeCard>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell
              title="Pick your competitors"
              subtitle={`We suggested ${MOCK_SUGGESTED_COMPETITORS.length} brands based on ${category}. Add more or remove any.`}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {MOCK_SUGGESTED_COMPETITORS.map((c) => {
                  const active = picked.has(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => togglePick(c.name)}
                      className={cn(
                        "relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                        active
                          ? "border-scope-accent/50 bg-scope-accent/5"
                          : "border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg hover:border-foreground/20",
                      )}
                    >
                      <CompAvatar name={c.name} logoUrl={c.logoUrl} />
                      <div className="min-w-0 flex-1">
                        <div className="font-inter text-sm font-semibold text-page-text">{c.name}</div>
                        <p className="mt-0.5 font-inter text-xs text-page-text-muted">
                          {c.rationale}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "grid size-6 place-items-center rounded-full border",
                          active
                            ? "border-scope-accent bg-scope-accent text-white"
                            : "border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg text-page-text-subtle",
                        )}
                      >
                        <Icon name={active ? "check" : "plus"} size={12} />
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  value={manualAdd}
                  onChange={(e) => setManualAdd(e.target.value)}
                  placeholder="Add another — URL, @handle, or name"
                  className="h-10 flex-1 rounded-xl border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg px-3 font-inter text-sm text-page-text placeholder:text-page-text-subtle focus:border-scope-accent/40 focus:outline-none"
                />
                <ScopeButton size="sm" onClick={addManual} disabled={!manualAdd.trim()}>
                  <Icon name="plus" size={13} />
                  Add
                </ScopeButton>
              </div>
              <p className="mt-3 font-inter text-xs text-page-text-subtle">
                {picked.size} selected · Free plan tracks up to 3, Pro up to 25.
              </p>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="Which platforms should we watch?" subtitle="All on by default. You can change this anytime in settings.">
              <div className="flex flex-col gap-3">
                {ACTIVE_PLATFORM_KEYS.map((platform) => (
                  <ScopeToggleRow
                    key={platform}
                    on={platforms[platform]}
                    onToggle={() => setPlatforms((p) => ({ ...p, [platform]: !p[platform] }))}
                  >
                    <div className="flex items-center gap-4">
                      <Platform p={platform} size="lg" />
                      <div className="flex-1">
                        <div className="font-inter text-sm font-medium text-page-text">
                          {ACTIVE_PLATFORM_LABELS[platform]}
                        </div>
                        <div className="font-inter text-xs text-page-text-subtle">
                          {platform === "ig"
                            ? "Reels, carousels, and Story highlights"
                            : platform === "tt"
                              ? "Short-form video feed"
                              : "Shorts + long-form"}
                        </div>
                      </div>
                      <ScopeToggle
                        on={platforms[platform]}
                        onToggle={() => setPlatforms((p) => ({ ...p, [platform]: !p[platform] }))}
                      />
                    </div>
                  </ScopeToggleRow>
                ))}
              </div>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title="How should we alert you?" subtitle="Pick the signals you want to keep close. You can always add more rules later.">
              <div className="flex flex-col gap-3">
                {(
                  [
                    { key: "campaign" as AlertRuleKind, label: "Campaign launches", desc: "New creator, affiliate, or rewards programs detected.", icon: "radar" as const, recommended: true },
                    { key: "viral" as AlertRuleKind, label: "Viral post detected", desc: "A tracked post crosses a velocity threshold.", icon: "flame" as const, recommended: false },
                    { key: "digest" as AlertRuleKind, label: "Daily digest", desc: "Top 5 competitor posts every morning at 9am ET.", icon: "message" as const, recommended: false },
                  ]
                ).map((rule) => (
                  <ScopeToggleRow
                    key={rule.key}
                    on={alertPrefs[rule.key]}
                    onToggle={() => setAlertPrefs((p) => ({ ...p, [rule.key]: !p[rule.key] }))}
                  >
                    <div className="flex items-center gap-4">
                      <div className="grid size-10 place-items-center rounded-xl bg-scope-accent/15 text-scope-accent">
                        <Icon name={rule.icon} size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-inter text-sm font-medium text-page-text">
                            {rule.label}
                          </span>
                          {rule.recommended && <Tag kind="new">Recommended</Tag>}
                        </div>
                        <div className="font-inter text-xs text-page-text-subtle">{rule.desc}</div>
                      </div>
                      <ScopeToggle
                        on={alertPrefs[rule.key]}
                        onToggle={() => setAlertPrefs((p) => ({ ...p, [rule.key]: !p[rule.key] }))}
                      />
                    </div>
                  </ScopeToggleRow>
                ))}
              </div>
              <div className="mt-4">
                <div className="mb-2 font-inter text-xs font-medium text-page-text-subtle">
                  Where should alerts go?
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { key: "email", label: "Email" },
                      { key: "slack", label: "Slack" },
                      { key: "discord", label: "Discord" },
                      { key: "telegram", label: "Telegram" },
                    ] as { key: AlertDeliveryKey; label: string }[]
                  ).map((ch) => (
                    <button
                      key={ch.key}
                      type="button"
                      onClick={() => setDelivery((d) => ({ ...d, [ch.key]: !d[ch.key] }))}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 font-inter text-xs",
                        delivery[ch.key]
                          ? "border-scope-accent/40 bg-scope-accent/10 text-page-text"
                          : "border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)] bg-card-bg text-page-text-muted hover:bg-foreground/[0.04]",
                      )}
                    >
                      {delivery[ch.key] && <Icon name="check" size={11} />}
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
            </StepShell>
          )}

          {step === 5 && (
            <StepShell
              title={`Indexing ${picked.size} competitors…`}
              subtitle="First results land in about 2 minutes. We'll keep crawling in the background."
            >
              <ScopeCard className="p-5">
                <div className="flex items-center justify-between font-inter text-sm">
                  <span className="text-page-text">Scanning across {ACTIVE_PLATFORM_KEYS.length} platforms</span>
                  <span className="text-scope-accent">{indexProgress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/[0.08]">
                  <motion.div
                    className="h-full rounded-full bg-scope-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${indexProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <div className="mt-2 font-inter text-xs text-page-text-subtle">
                  {Math.round(indexProgress * 3.47)} / 347 posts indexed
                </div>
              </ScopeCard>
              <div className="mt-5 flex justify-center">
                <ScopeButton variant="primary" size="md" onClick={() => router.push("/tools")}>
                  <Icon name="arrow-right" size={14} />
                  Open workspace
                </ScopeButton>
              </div>
            </StepShell>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && step < 5 && (
        <div className="flex w-full items-center justify-between">
          <ScopeButton variant="ghost" size="sm" onClick={goBack}>
            Back
          </ScopeButton>
          <ScopeButton
            variant="primary"
            size="md"
            onClick={goNext}
            disabled={step === 2 && picked.size === 0}
          >
            {step === 4 ? "Start indexing" : "Continue"}
            <Icon name="arrow-right" size={13} />
          </ScopeButton>
        </div>
      )}
    </div>
  );
}

function Header({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex items-center gap-2 font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">
        <span className="grid size-7 place-items-center rounded-[7px] bg-scope-accent text-white">
          <Icon name="radar" size={14} />
        </span>
        Scope
      </div>
      <div className="flex w-full max-w-sm items-center gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full",
              i < currentStep && "bg-scope-accent/60",
              i === currentStep && "bg-scope-accent",
              i > currentStep && "bg-foreground/[0.1]",
            )}
          />
        ))}
      </div>
      <div className="font-inter text-xs text-page-text-subtle">
        Step {currentStep + 1} of {STEPS.length} · {STEPS[currentStep]}
      </div>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h1 className="font-inter text-2xl font-semibold tracking-[-0.02em] text-page-text">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 font-inter text-sm text-page-text-muted">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
