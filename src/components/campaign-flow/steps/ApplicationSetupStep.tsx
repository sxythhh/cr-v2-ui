"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ── Helpers (reused pattern from other steps) ──────────────────────

function SectionLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
      {description && <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>}
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-foreground/[0.06] bg-card-bg p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]", className)}>
      {children}
    </div>
  );
}

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(); }} className={cn("flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors", on ? "bg-[#252525] dark:bg-white" : "bg-foreground/20")}>
      <div className={cn("size-4 rounded-full bg-white dark:bg-[#111111] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] transition-transform", on ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}

function ToggleRow({ title, description, on, onToggle, children }: { title: string; description?: string; on: boolean; onToggle: () => void; children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-4 transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
        on ? "border-[rgba(255,144,37,0.3)]" : "border-foreground/[0.06] bg-card-bg",
      )}
      style={on ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--card-bg)" } : undefined}
    >
      <div className="flex cursor-pointer items-center gap-3" onClick={onToggle}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
          {description && <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>}
        </div>
        <ToggleSwitch on={on} onToggle={onToggle} />
      </div>
      {on && children}
    </div>
  );
}

function ChevronDownIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

// ── Main ───────────────────────────────────────────────────────────

const DEFAULT_QUESTIONS = [
  "Why do you want to join this campaign?",
  "Share a link to your best performing video",
  "What makes you a good fit for this brand?",
];

export function ApplicationSetupStep() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [minFollowers, setMinFollowers] = useState(false);
  const [minFollowersValue, setMinFollowersValue] = useState("");
  const [preferredFollowers, setPreferredFollowers] = useState("");
  const [requirePortfolio, setRequirePortfolio] = useState(false);
  const [autoDeclineNoAccounts, setAutoDeclineNoAccounts] = useState(false);
  const [autoDeclineBelowThreshold, setAutoDeclineBelowThreshold] = useState(false);
  const [autoApproveTrusted, setAutoApproveTrusted] = useState(false);
  const [autoDeclineDeadline, setAutoDeclineDeadline] = useState(false);
  const [maxApplicants, setMaxApplicants] = useState("no-limit");
  const [reviewDeadline, setReviewDeadline] = useState("48h");

  const removeQuestion = (index: number) => setQuestions((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Screening questions */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Screening questions" description="Ask applicants specific questions to evaluate fit." />
        {questions.map((q, i) => (
          <Card key={i}>
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Question {i + 1}</span>
              <div className="flex items-center gap-2">
                <div className="flex h-10 flex-1 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => {
                      const next = [...questions];
                      next[i] = e.target.value;
                      setQuestions(next);
                    }}
                    className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10]"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.333 3.333L12.667 12.667M12.667 3.333L3.333 12.667" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
          </Card>
        ))}
        {/* Add question */}
        <Card>
          <button
            type="button"
            onClick={() => setQuestions((prev) => [...prev, ""])}
            className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-foreground/[0.12] p-4"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9H15M9 3V15" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Add question</span>
          </button>
        </Card>
      </div>

      {/* 2. Applicant requirements */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Applicant requirements" description="Define who's eligible to apply. Creators will see these before submitting their application." />
        <Card className="flex flex-col gap-2 p-5">
          <ToggleRow title="Require minimum followers" on={minFollowers} onToggle={() => setMinFollowers((v) => !v)}>
            <div className="flex gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Min. followers (any platform)</span>
                <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <input type="text" inputMode="numeric" value={minFollowersValue} onChange={(e) => setMinFollowersValue(e.target.value.replace(/[^\d,]/g, ""))} className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none" />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Preferred followers</span>
                <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <input type="text" inputMode="numeric" value={preferredFollowers} onChange={(e) => setPreferredFollowers(e.target.value.replace(/[^\d,]/g, ""))} className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none" />
                </div>
              </div>
            </div>
          </ToggleRow>
          <div
            onClick={() => setRequirePortfolio((v) => !v)}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
              requirePortfolio ? "border-[rgba(255,144,37,0.3)]" : "border-foreground/[0.06] bg-card-bg",
            )}
            style={requirePortfolio ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--card-bg)" } : undefined}
          >
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Require portfolio link</span>
            <ToggleSwitch on={requirePortfolio} onToggle={() => setRequirePortfolio((v) => !v)} />
          </div>
        </Card>
      </div>

      {/* 3. Auto-screening rules */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Auto-screening rules" description="Automatically filter applications based on criteria." />
        <Card className="flex flex-col gap-2 p-5">
          <ToggleRow title="Auto-decline if no connected accounts" description="Reject applicants without verified social accounts." on={autoDeclineNoAccounts} onToggle={() => setAutoDeclineNoAccounts((v) => !v)} />
          <ToggleRow title="Auto-decline if below follower threshold" description="Instantly reject applications below minimum followers." on={autoDeclineBelowThreshold} onToggle={() => setAutoDeclineBelowThreshold((v) => !v)} />
          <ToggleRow title="Auto-approve trusted creators" description="Skip review for creators with 80%+ trust score on the platform." on={autoApproveTrusted} onToggle={() => setAutoApproveTrusted((v) => !v)} />
        </Card>
      </div>

      {/* 4. Application limits */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Application limits" description="Control how many creators can apply and how quickly you'll review them." />
        <Card className="flex flex-col gap-4 p-5">
          <div className="flex gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Max applicants</span>
              <div className="relative">
                <select value={maxApplicants} onChange={(e) => setMaxApplicants(e.target.value)} className="flex h-10 w-full cursor-pointer appearance-none items-center rounded-[14px] bg-foreground/[0.04] px-3.5 pr-8 font-inter text-sm tracking-[-0.02em] text-page-text outline-none">
                  <option value="no-limit">No limit</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                  <option value="500">500</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"><ChevronDownIcon /></div>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Review deadline</span>
              <div className="relative">
                <select value={reviewDeadline} onChange={(e) => setReviewDeadline(e.target.value)} className="flex h-10 w-full cursor-pointer appearance-none items-center rounded-[14px] bg-foreground/[0.04] px-3.5 pr-8 font-inter text-sm tracking-[-0.02em] text-page-text outline-none">
                  <option value="24h">Review within 24 hours</option>
                  <option value="48h">Review within 48 hours</option>
                  <option value="72h">Review within 72 hours</option>
                  <option value="7d">Review within 7 days</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"><ChevronDownIcon /></div>
              </div>
            </div>
          </div>
          <ToggleRow title="Auto-decline after deadline" description="Automatically decline unreviewed applications after the review deadline." on={autoDeclineDeadline} onToggle={() => setAutoDeclineDeadline((v) => !v)} />
        </Card>
      </div>
    </div>
  );
}
