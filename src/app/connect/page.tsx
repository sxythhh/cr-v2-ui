"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CentralIcon } from "@central-icons-react/all";
import { cn } from "@/lib/utils";

const ci = { join: "round" as const, fill: "filled" as const, stroke: "2" as const, radius: "2" as const } as const;

type Org = { id: string; name: string; campaignCount: number; brandColor: string; initials: string };

const ORGS: Org[] = [
  { id: "elevenlabs", name: "ElevenLabs", campaignCount: 8, brandColor: "#0E0E0E", initials: "EL" },
  { id: "f1", name: "Formula 1 Racing", campaignCount: 3, brandColor: "#E10600", initials: "F1" },
  { id: "netflix", name: "Netflix Studios", campaignCount: 12, brandColor: "#E50914", initials: "NS" },
  { id: "stellar", name: "Stellar Media Group", campaignCount: 5, brandColor: "#7B5BFF", initials: "SM" },
];

/* ──────────────────────────────────────────────────────────────────────
   Vertical flow diagram — Dashboard → Organization → Creator app
   ─────────────────────────────────────────────────────────────────── */

function FlowDiagram() {
  return (
    <div className="flex flex-col gap-0">
      <FlowNode
        title="Brand dashboard"
        description="Lives elsewhere in your Whop. You manage campaigns there."
        color="#1A67E5"
        iconRgb="26,103,229"
        icon={<CentralIcon name="IconDashboardFast" size={20} color="currentColor" {...ci} />}
      />
      <FlowArrow />
      <FlowNode
        title="Organization"
        description="Owns campaigns, budgets, and creator approvals."
        color="#FF6207"
        iconRgb="255,98,7"
        icon={<CentralIcon name="IconBuildings" size={20} color="currentColor" {...ci} />}
        highlighted
      />
      <FlowArrow />
      <FlowNode
        title="Creator app"
        description="What creators see — campaigns from the linked org."
        color="#AE4EEE"
        iconRgb="174,78,238"
        icon={<CentralIcon name="IconPeople" size={20} color="currentColor" {...ci} />}
        marker
      />
    </div>
  );
}

function FlowNode({
  title,
  description,
  color,
  iconRgb,
  icon,
  highlighted,
  marker,
}: {
  title: string;
  description: string;
  color: string;
  iconRgb: string;
  icon: React.ReactNode;
  highlighted?: boolean;
  marker?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-xl border p-3.5",
        highlighted
          ? "border-[#FF6207]/30 bg-[#FF6207]/[0.04]"
          : "border-[rgba(37,37,37,0.08)] bg-white dark:border-[rgba(224,224,224,0.08)] dark:bg-card-bg",
      )}
    >
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(37,37,37,0.06)] dark:border-[rgba(224,224,224,0.06)]"
        style={{
          background: `radial-gradient(60% 60% at 50% 100%, rgba(${iconRgb},0.16) 0%, rgba(${iconRgb},0) 60%), var(--card-bg, #FFFFFF)`,
          color,
        }}
      >
        {icon}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.02em] text-[#252525] dark:text-page-text">
            {title}
          </span>
          {marker && (
            <span className="flex items-center gap-1 rounded-full bg-[#252525] px-1.5 py-0.5 font-inter text-[9px] font-medium uppercase tracking-[0.06em] leading-none text-white dark:bg-white dark:text-[#252525]">
              <span className="size-1 rounded-full bg-[#FF6207]" />
              You are here
            </span>
          )}
        </div>
        <span className="font-inter text-[12px] font-normal leading-[150%] tracking-[-0.02em] text-[rgba(37,37,37,0.6)] dark:text-page-text-muted">
          {description}
        </span>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex h-6 items-center justify-center">
      <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden>
        <path
          d="M7 2V16M7 16L2 11M7 16L12 11"
          stroke="rgba(37,37,37,0.25)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Faux Whop sidebar preview — used inside the Loom modal placeholder
   ─────────────────────────────────────────────────────────────────── */

function WhopSidebarMock() {
  return (
    <div className="flex h-full w-full items-stretch font-inter">
      <div className="flex w-[34%] flex-col gap-1.5 border-r border-white/5 bg-white/[0.03] p-3">
        <div className="mb-1 flex items-center gap-1.5">
          <div className="size-3 rounded-sm bg-white/15" />
          <div className="h-1.5 flex-1 rounded-full bg-white/10" />
        </div>
        {["Home", "Chat", "Content Rewards", "Tools"].map((label) => (
          <div key={label} className="flex items-center gap-1.5 rounded-md px-1 py-1">
            <div className="size-2.5 rounded-sm bg-white/10" />
            <div className="h-1.5 flex-1 rounded-full bg-white/8" />
          </div>
        ))}
        <div className="my-1 h-px bg-white/5" />
        <div className="flex items-center gap-1.5 rounded-md bg-white/[0.06] px-1 py-1 ring-1 ring-[#FF6207]/40">
          <div className="size-2.5 rounded-sm bg-[#FF6207]" />
          <div className="h-1.5 flex-1 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-2 w-1/2 rounded-full bg-white/15" />
        <div className="h-1.5 w-1/3 rounded-full bg-white/8" />
        <div className="mt-2 grid flex-1 grid-cols-2 gap-2">
          <div className="rounded-md bg-white/[0.04] p-2">
            <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
            <div className="mt-1 h-1.5 w-2/3 rounded-full bg-white/6" />
            <div className="mt-2 h-6 rounded bg-white/[0.04]" />
          </div>
          <div className="rounded-md bg-white/[0.04] p-2">
            <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
            <div className="mt-1 h-1.5 w-2/3 rounded-full bg-white/6" />
            <div className="mt-2 h-6 rounded bg-white/[0.04]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Page
   ─────────────────────────────────────────────────────────────────── */

export default function ConnectExperiencePage() {
  const router = useRouter();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [orgPickerOpen, setOrgPickerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLoom, setShowLoom] = useState(false);

  const selectedOrg = selectedOrgId ? ORGS.find((o) => o.id === selectedOrgId) ?? null : null;
  const canSave = !!selectedOrgId && !saved;

  const handleSave = useCallback(() => {
    if (!canSave) return;
    setSaved(true);
  }, [canSave]);

  const handleViewAsCreator = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="relative min-h-dvh w-full bg-page-bg font-inter tracking-[-0.02em]">
      {/* Decorative background — warm radial top */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-[480px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(255,98,7,0.10) 0%, rgba(255,98,7,0) 60%), radial-gradient(ellipse 60% 40% at 90% 0%, rgba(174,78,238,0.06) 0%, rgba(174,78,238,0) 60%)",
        }}
      />

      <div className="relative z-10 flex min-h-dvh flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex h-14 w-full shrink-0 items-center justify-between border-b border-[rgba(37,37,37,0.06)] bg-page-bg/70 px-5 backdrop-blur-md dark:border-[rgba(224,224,224,0.06)]">
          <button
            type="button"
            onClick={handleViewAsCreator}
            className="group flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[rgba(37,37,37,0.08)] bg-white pl-2 pr-3 font-inter text-[12px] font-medium tracking-[-0.02em] text-[#252525] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.04] dark:border-[rgba(224,224,224,0.08)] dark:bg-card-bg dark:text-page-text"
          >
            <CentralIcon
              name="IconEyeOpen"
              size={14}
              color="currentColor"
              {...ci}
              className="text-[rgba(37,37,37,0.55)] dark:text-page-text-muted"
            />
            <span>View as creator</span>
          </button>

          <div className="flex items-baseline gap-2">
            <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">
              Content Rewards
            </span>
            <span className="hidden font-inter text-[12px] font-normal tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted sm:inline">
              · Creator app
            </span>
          </div>
        </div>

        {/* Page body */}
        <div className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col gap-10 px-5 pb-12 pt-12">
          {/* Hero */}
          <div className="flex flex-col items-center text-center">
            <h1 className="max-w-[680px] font-inter text-[28px] font-medium leading-[1.1] tracking-[-0.025em] text-[#252525] dark:text-page-text sm:text-[34px]">
              Connect this experience to an organization
            </h1>
            <p className="mt-3 max-w-[540px] font-inter text-[15px] font-normal leading-[150%] tracking-[-0.02em] text-[rgba(37,37,37,0.6)] dark:text-page-text-muted">
              You&apos;re in the creator app — what creators in this Whop will see. Pick the organization whose campaigns should appear here.
            </p>
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1.05fr)]">
            {/* Left: how it fits */}
            <section className="flex flex-col gap-5 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg sm:p-6">
              <header className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-inter text-[15px] font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">
                    How it fits together
                  </span>
                  <span className="font-inter text-[12.5px] font-normal tracking-[-0.02em] text-[rgba(37,37,37,0.55)] dark:text-page-text-muted">
                    Three pieces. One flow.
                  </span>
                </div>
              </header>

              <FlowDiagram />

              {/* Loom link */}
              <button
                type="button"
                onClick={() => setShowLoom(true)}
                className="group flex items-center gap-3 rounded-xl border border-[rgba(37,37,37,0.06)] bg-foreground/[0.02] p-3 text-left transition-colors hover:bg-foreground/[0.04] dark:border-[rgba(224,224,224,0.06)]"
              >
                <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#141414]">
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(60% 60% at 30% 100%, rgba(255,98,7,0.5) 0%, rgba(255,98,7,0) 60%)",
                    }}
                  />
                  <svg width="9" height="11" viewBox="0 0 14 16" fill="none" className="relative" aria-hidden>
                    <path d="M13 7.13397C13.6667 7.51887 13.6667 8.48113 13 8.86603L2.5 14.9282C1.83333 15.3131 1 14.8319 1 14.0622L1 1.93782C1 1.16812 1.83333 0.686867 2.5 1.07177L13 7.13397Z" fill="#FFFFFF" />
                  </svg>
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-inter text-[13px] font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">
                    Watch the 2-minute walkthrough
                  </span>
                  <span className="font-inter text-[11.5px] font-normal tracking-[-0.02em] text-[rgba(37,37,37,0.55)] dark:text-page-text-muted">
                    Where the dashboard lives, and how it all connects.
                  </span>
                </div>
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="text-[rgba(37,37,37,0.4)] transition-transform group-hover:translate-x-0.5 dark:text-page-text-muted" aria-hidden>
                  <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </section>

            {/* Right: connect form */}
            <section className="flex flex-col gap-5 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg sm:p-6">
              <header className="flex flex-col">
                <span className="font-inter text-[15px] font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">
                  Connect this experience
                </span>
                <span className="font-inter text-[12.5px] font-normal tracking-[-0.02em] text-[rgba(37,37,37,0.55)] dark:text-page-text-muted">
                  Pick an organization. Change it later from settings.
                </span>
              </header>

              {/* Org picker */}
              <div className="flex flex-col gap-2">
                <label className="font-inter text-[12px] font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">
                  Organization
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOrgPickerOpen((v) => !v)}
                    className={cn(
                      "flex h-12 w-full cursor-pointer items-center gap-3 rounded-xl border bg-white px-3 text-left transition-colors dark:bg-card-bg",
                      orgPickerOpen
                        ? "border-[#FF6207]/40 ring-2 ring-[#FF6207]/10"
                        : "border-[rgba(37,37,37,0.08)] hover:border-[rgba(37,37,37,0.16)] dark:border-[rgba(224,224,224,0.08)] dark:hover:border-[rgba(224,224,224,0.16)]",
                    )}
                  >
                    {selectedOrg ? (
                      <>
                        <span
                          className="flex size-7 shrink-0 items-center justify-center rounded-lg font-inter text-[10px] font-semibold leading-none text-white"
                          style={{ backgroundColor: selectedOrg.brandColor }}
                        >
                          {selectedOrg.initials}
                        </span>
                        <div className="flex min-w-0 flex-1 items-baseline gap-2">
                          <span className="truncate font-inter text-[14px] font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">
                            {selectedOrg.name}
                          </span>
                          <span className="font-inter text-[12px] font-normal tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">
                            {selectedOrg.campaignCount} campaigns
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-dashed border-[rgba(37,37,37,0.18)] text-[rgba(37,37,37,0.4)] dark:border-[rgba(224,224,224,0.18)] dark:text-page-text-muted">
                          <CentralIcon name="IconBuildings" size={14} color="currentColor" {...ci} />
                        </span>
                        <span className="flex-1 font-inter text-[14px] font-normal tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">
                          Choose an organization…
                        </span>
                      </>
                    )}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className={cn(
                        "shrink-0 text-[rgba(37,37,37,0.4)] transition-transform dark:text-page-text-muted",
                        orgPickerOpen && "rotate-180",
                      )}
                      aria-hidden
                    >
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {orgPickerOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[rgba(37,37,37,0.08)] bg-white p-1 shadow-[0_12px_32px_rgba(0,0,0,0.10)] dark:border-[rgba(224,224,224,0.08)] dark:bg-card-bg"
                      >
                        {ORGS.map((org) => {
                          const isSelected = selectedOrgId === org.id;
                          return (
                            <button
                              key={org.id}
                              type="button"
                              onClick={() => {
                                setSelectedOrgId(org.id);
                                setSaved(false);
                                setOrgPickerOpen(false);
                              }}
                              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-foreground/[0.04]"
                            >
                              <span
                                className="flex size-7 shrink-0 items-center justify-center rounded-lg font-inter text-[10px] font-semibold leading-none text-white"
                                style={{ backgroundColor: org.brandColor }}
                              >
                                {org.initials}
                              </span>
                              <div className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate font-inter text-[13px] font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">
                                  {org.name}
                                </span>
                                <span className="font-inter text-[11px] font-normal tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-page-text-muted">
                                  {org.campaignCount} active campaigns
                                </span>
                              </div>
                              {isSelected && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-[#FF6207]" aria-hidden>
                                  <path d="M2 7.2L5.5 10.7L12 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                          );
                        })}

                        <div className="my-1 h-px bg-[rgba(37,37,37,0.06)] dark:bg-[rgba(224,224,224,0.06)]" />

                        <button
                          type="button"
                          onClick={() => setOrgPickerOpen(false)}
                          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-foreground/[0.04]"
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-dashed border-[rgba(37,37,37,0.18)] text-[rgba(37,37,37,0.5)] dark:border-[rgba(224,224,224,0.18)] dark:text-page-text-muted">
                            <CentralIcon name="IconPlusMedium" size={14} color="currentColor" {...ci} />
                          </span>
                          <span className="flex-1 font-inter text-[13px] font-medium tracking-[-0.02em] text-[#252525] dark:text-page-text">
                            Create a new organization
                          </span>
                          <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="text-[rgba(37,37,37,0.4)] dark:text-page-text-muted" aria-hidden>
                            <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Terminology helper */}
                <div className="flex items-start gap-2 pt-1">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="mt-0.5 shrink-0 text-[rgba(37,37,37,0.4)] dark:text-page-text-muted"
                    aria-hidden
                  >
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 7.5V11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <circle cx="8" cy="5" r="0.85" fill="currentColor" />
                  </svg>
                  <p className="font-inter text-[11.5px] font-normal leading-[150%] tracking-[-0.02em] text-[rgba(37,37,37,0.55)] dark:text-page-text-muted">
                    <span className="font-medium text-[#252525] dark:text-page-text">An experience</span> is the app visible to creators in this Whop. <span className="font-medium text-[#252525] dark:text-page-text">An organization</span> owns the campaigns. Connecting them tells the app whose campaigns to show.
                  </p>
                </div>
              </div>

              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 rounded-xl border border-[#00994D]/20 bg-[#00994D]/[0.06] px-3.5 py-2.5 font-inter text-[12.5px] font-medium tracking-[-0.02em] text-[#00994D]"
                >
                  <span className="flex size-4 items-center justify-center rounded-full bg-[#00994D]/20">
                    <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M2 7.2L5.5 10.7L12 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Connected — creators will see {selectedOrg?.name} campaigns.
                </motion.div>
              )}

              {/* Footer row */}
              <div className="mt-auto flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="flex h-10 min-w-[120px] cursor-pointer items-center justify-center rounded-full px-5 font-inter text-[14px] font-medium leading-none tracking-[-0.02em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_1px_2px_rgba(229,113,0,0.32)] transition-[filter,opacity] hover:brightness-[1.06] active:scale-[0.97] disabled:cursor-default disabled:opacity-30"
                  style={{
                    background:
                      "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207",
                  }}
                >
                  {saved ? "Saved" : "Connect"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Loom modal */}
      <AnimatePresence>
        {showLoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
            onClick={() => setShowLoom(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[900px] overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowLoom(false)}
                className="absolute right-3 top-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div className="relative flex aspect-video">
                <div
                  className="absolute inset-0"
                  style={{
                    maskImage:
                      "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(180deg, black 0%, black 60%, transparent 100%)",
                  }}
                >
                  <WhopSidebarMock />
                </div>
                <div className="relative flex flex-1 items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
                        <path d="M13 7.13397C13.6667 7.51887 13.6667 8.48113 13 8.86603L2.5 14.9282C1.83333 15.3131 1 14.8319 1 14.0622L1 1.93782C1 1.16812 1.83333 0.686867 2.5 1.07177L13 7.13397Z" fill="#FF6207" />
                      </svg>
                    </div>
                    <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-white/80">
                      Loom embed goes here
                    </span>
                    <span className="max-w-[280px] font-inter text-[12px] font-normal leading-[150%] tracking-[-0.02em] text-white/40">
                      A 2-minute walkthrough of experiences, organizations, and the dashboard.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
