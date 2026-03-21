"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CreatorDetailsData } from "@/types/campaign-flow.types";

// ── Icons (reused from DetailsStep) ────────────────────────────────
function BoldIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2.667h5.333a2.667 2.667 0 0 1 0 5.333H4V2.667ZM4 8h6a2.667 2.667 0 0 1 0 5.333H4V8Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ItalicIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.667 2.667H6.667M9.333 13.333H5.333M10 2.667L6 13.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function UnderlineIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2.667v4a4 4 0 0 0 8 0v-4M3.333 13.333h9.334" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function LinkChainIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 8.667a3.333 3.333 0 0 0 4.994.36l2-2a3.334 3.334 0 0 0-4.714-4.714l-1.147 1.14M9.333 7.333a3.333 3.333 0 0 0-4.994-.36l-2 2a3.334 3.334 0 0 0 4.714 4.714l1.14-1.14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function OrderedListIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 3h6.666M6.667 8h6.666M6.667 13h6.666M2.667 3h.667v2M2.667 7.333h1.666L2.667 9.333h2M2.667 12.333v1.334h1.666v-1.334h-1.666v-1h1.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function BulletListIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 3.333h6.666M6.667 8h6.666M6.667 12.667h6.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /><circle cx="3.333" cy="3.333" r="0.667" fill="currentColor" /><circle cx="3.333" cy="8" r="0.667" fill="currentColor" /><circle cx="3.333" cy="12.667" r="0.667" fill="currentColor" /></svg>; }
function AlignLeftIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.667 3.333h10.666M2.667 6.667h6.666M2.667 10h10.666M2.667 13.333h6.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ChevronDownIcon() { return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

function SectionLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
      {description && <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>}
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-foreground/[0.06] bg-card-bg p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]", className)}>{children}</div>;
}

const TOOLBAR = [
  { icon: BoldIcon, active: true }, { icon: ItalicIcon, active: false }, { icon: UnderlineIcon, active: false },
  { icon: LinkChainIcon, active: false }, { icon: OrderedListIcon, active: false }, { icon: BulletListIcon, active: false }, { icon: AlignLeftIcon, active: false },
];

const REGIONS = [
  { name: "USA", count: "5,806", color: "#00994D", pct: 47 },
  { name: "United Kingdom", count: "3,204", color: "#1A67E5", pct: 27 },
  { name: "Canada", count: "2,321", color: "#E57100", pct: 17 },
  { name: "Others", count: "1,283", color: "#ED1285", pct: 9 },
];

const DEFAULT_INVITED: string[] = [];

export function CreatorDetailsStep({ data, onChange }: { data: CreatorDetailsData; onChange: (data: CreatorDetailsData) => void }) {
  const update = (partial: Partial<CreatorDetailsData>) => onChange({ ...data, ...partial });
  const [inviteInput, setInviteInput] = useState("");
  const [invited, setInvited] = useState(DEFAULT_INVITED);

  const addInvite = () => {
    if (!inviteInput.trim()) return;
    setInvited((prev) => [...prev, inviteInput.trim()]);
    setInviteInput("");
  };

  const removeInvite = (i: number) => setInvited((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Creator pool */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Your creator pool" description="An estimate of eligible creators based on the requirements you've set so far." />
        <Card>
          <div className="flex flex-col gap-4">
            {/* Stats row */}
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-foreground/[0.06] p-3">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">15,812</span>
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Total clippers</span>
              </div>
              <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-foreground/[0.06] p-3">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">7,418</span>
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Active (30d)</span>
              </div>
            </div>

            {/* Regions */}
            <div className="flex flex-col gap-3">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Regions breakdown</span>
              {/* Bar */}
              <div className="flex h-10 overflow-hidden rounded-xl">
                {REGIONS.map((r) => (
                  <div key={r.name} className="border border-white" style={{ width: `${r.pct}%`, background: `${r.color}99` }} />
                ))}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-1">
                {REGIONS.map((r) => (
                  <div key={r.name} className="flex items-center gap-1 rounded-full border border-foreground/[0.06] px-2 py-1">
                    <div className="size-2 rounded-full" style={{ background: r.color }} />
                    <span className="font-inter text-xs tracking-[-0.02em] text-page-text">{r.name}</span>
                    <span className="font-inter text-xs font-medium tracking-[-0.02em]" style={{ color: r.color }}>{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Creator details */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Creator details" description="Describe the type of creator you're looking for and any additional notes for applicants." />
        <Card>
          <div className="flex flex-col gap-4">
            {/* Creator type */}
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Creator type</span>
              <div className="flex h-10 items-center justify-between rounded-[14px] bg-foreground/[0.04] px-3.5">
                <span className="font-inter text-sm tracking-[-0.02em] text-page-text">{data.creatorType || "Content Creator"}</span>
                <ChevronDownIcon />
              </div>
            </div>

            {/* Description with toolbar */}
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Description</span>
              <div className="overflow-hidden rounded-[14px] border border-foreground/[0.06]">
                <div className="flex items-center gap-1 border-b border-foreground/[0.06] p-1">
                  {TOOLBAR.map((btn, i) => (
                    <button key={i} type="button" className={cn("flex size-8 items-center justify-center rounded-[10px] transition-colors", btn.active ? "bg-foreground/[0.06] text-page-text" : "text-page-text-subtle hover:bg-foreground/[0.04]")}>
                      <btn.icon />
                    </button>
                  ))}
                </div>
                <div className="relative bg-foreground/[0.04]">
                  <textarea
                    value={data.description}
                    onChange={(e) => update({ description: e.target.value.slice(0, 300) })}
                    placeholder="Describe your ideal creator..."
                    className="h-[104px] w-full resize-none bg-transparent px-3.5 py-3 font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                  />
                  <span className="absolute bottom-3 right-3.5 font-inter text-xs tracking-[-0.02em] text-page-text-muted">{data.description.length}/300</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Invite creators */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Invite creators" description="Invite specific creators directly by their handle." />
        <div className="flex flex-col gap-4 rounded-[20px] border border-foreground/[0.06] bg-card-bg p-6">
          {/* Input */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Creator&apos;s username</span>
            <div className="flex items-center gap-2">
              <div className="flex h-10 flex-1 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input
                  type="text"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addInvite()}
                  placeholder="@creatorhandle"
                  className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60"
                />
              </div>
              <button type="button" onClick={addInvite} className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.667 8H13.333M8 2.667V13.333" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33" strokeLinecap="round" /></svg>
              </button>
            </div>
          </div>

          {/* Invited pills */}
          {invited.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {invited.map((handle, i) => (
                <div
                  key={i}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-[rgba(255,144,37,0.3)] px-2.5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]"
                  style={{ background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), #FFFFFF" }}
                >
                  <div className="size-4 rounded-full bg-foreground/10" />
                  <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{handle}</span>
                  <button type="button" onClick={() => removeInvite(i)} className="flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
