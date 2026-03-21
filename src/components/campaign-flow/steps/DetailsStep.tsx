"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { DetailsData } from "@/types/campaign-flow.types";
import { ThumbnailUpload } from "../ThumbnailUpload";

// ── Icons ──────────────────────────────────────────────────────────

function BoldIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2.667h5.333a2.667 2.667 0 0 1 0 5.333H4V2.667ZM4 8h6a2.667 2.667 0 0 1 0 5.333H4V8Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ItalicIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.667 2.667H6.667M9.333 13.333H5.333M10 2.667L6 13.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function UnderlineIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2.667v4a4 4 0 0 0 8 0v-4M3.333 13.333h9.334" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LinkChainIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 8.667a3.333 3.333 0 0 0 4.994.36l2-2a3.334 3.334 0 0 0-4.714-4.714l-1.147 1.14M9.333 7.333a3.333 3.333 0 0 0-4.994-.36l-2 2a3.334 3.334 0 0 0 4.714 4.714l1.14-1.14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function OrderedListIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 3h6.666M6.667 8h6.666M6.667 13h6.666M2.667 3h.667v2M2.667 7.333h1.666L2.667 9.333h2M2.667 12.333v1.334h1.666v-1.334h-1.666v-1h1.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function BulletListIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 3.333h6.666M6.667 8h6.666M6.667 12.667h6.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /><circle cx="3.333" cy="3.333" r="0.667" fill="currentColor" /><circle cx="3.333" cy="8" r="0.667" fill="currentColor" /><circle cx="3.333" cy="12.667" r="0.667" fill="currentColor" /></svg>;
}
function AlignLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.667 3.333h10.666M2.667 6.667h6.666M2.667 10h10.666M2.667 13.333h6.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CalendarIcon() {
  return <svg width="12" height="13" viewBox="0 0 12 13" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M3.33333 0C3.70152 0 4 0.298477 4 0.666667V1.33333H8V0.666667C8 0.298477 8.29848 0 8.66667 0C9.03486 0 9.33333 0.298477 9.33333 0.666667V1.33333H10C11.1046 1.33333 12 2.22876 12 3.33333V10.6667C12 11.7712 11.1046 12.6667 10 12.6667H2C0.895431 12.6667 0 11.7712 0 10.6667V3.33333C0 2.22876 0.895431 1.33333 2 1.33333H2.66667V0.666667C2.66667 0.298477 2.96514 0 3.33333 0ZM1.33333 6V10.6667C1.33333 11.0349 1.63181 11.3333 2 11.3333H10C10.3682 11.3333 10.6667 11.0349 10.6667 10.6667V6H1.33333Z" fill="currentColor" fillOpacity="0.5" /></svg>;
}
function EyeIcon() {
  return <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8.95528 2.13731e-10C12.2484 -2.31454e-05 15.4474 1.8936 17.5859 5.48594C18.0188 6.2132 18.0188 7.12005 17.5859 7.84731C15.4474 11.4396 12.2484 13.3333 8.95529 13.3333C5.66219 13.3334 2.46314 11.4397 0.324692 7.84739C-0.108231 7.12014 -0.10823 6.21328 0.324691 5.48603C2.46314 1.89369 5.66218 2.31475e-05 8.95528 2.13731e-10ZM6.03861 6.66667C6.03861 5.05584 7.34445 3.75 8.95528 3.75C10.5661 3.75 11.8719 5.05584 11.8719 6.66667C11.8719 8.2775 10.5661 9.58333 8.95528 9.58333C7.34445 9.58333 6.03861 8.2775 6.03861 6.66667Z" fill="currentColor" fillOpacity="0.5" /></svg>;
}
function ChevronDownIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

// ── Helpers ─────────────────────────────────────────────────────────

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
    <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(); }} className={cn("flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors", on ? "bg-foreground" : "bg-foreground/20")}>
      <div className={cn("size-4 rounded-full bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.12)] transition-transform", on ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}

// ── Options ─────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { label: "UGC", value: "ugc" },
  { label: "UGC Clipping", value: "clipping" },
  { label: "Review", value: "review" },
];

const CATEGORY_OPTIONS = ["Music", "Gaming", "Entertainment", "Sports", "Education", "Lifestyle", "Technology"].map((cat) => ({
  label: cat,
  value: cat.toLowerCase(),
}));

const TOOLBAR_BUTTONS = [
  { icon: BoldIcon, label: "Bold", active: true },
  { icon: ItalicIcon, label: "Italic", active: false },
  { icon: UnderlineIcon, label: "Underline", active: false },
  { icon: LinkChainIcon, label: "Link", active: false },
  { icon: OrderedListIcon, label: "Numbered list", active: false },
  { icon: BulletListIcon, label: "Bullet list", active: false },
  { icon: AlignLeftIcon, label: "Align", active: false },
];

// ── Main ───────────────────────────────────────────────────────────

export function DetailsStep({ data, onChange }: { data: DetailsData; onChange: (data: DetailsData) => void }) {
  const update = (partial: Partial<DetailsData>) => onChange({ ...data, ...partial });
  const [isPublic, setIsPublic] = useState(false);
  const [noEndDate, setNoEndDate] = useState(false);

  const handleCropComplete = useCallback(
    (preview: string, file: File) => {
      onChange({ ...data, thumbnailPreview: preview, thumbnailFile: file, thumbnailName: file.name });
    },
    [data, onChange],
  );

  const handleThumbnailDelete = useCallback(() => {
    onChange({ ...data, thumbnailPreview: null, thumbnailFile: null, thumbnailName: "" });
  }, [data, onChange]);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Name and description */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Name and description" description="Give your campaign a clear name and explain what it's about." />
        <Card>
          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Name</span>
              <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => update({ name: e.target.value.slice(0, 50) })}
                  placeholder="Your campaign name"
                  className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                />
                <span className="shrink-0 font-inter text-xs tracking-[-0.02em] text-page-text-muted">{data.name.length}/50</span>
              </div>
            </div>

            {/* Description with toolbar */}
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Description</span>
              <div className="overflow-hidden rounded-[14px] border border-foreground/[0.06]">
                {/* Toolbar */}
                <div className="flex items-center gap-1 border-b border-foreground/[0.06] p-1">
                  {TOOLBAR_BUTTONS.map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      className={cn(
                        "flex size-8 items-center justify-center rounded-[10px] transition-colors",
                        btn.active ? "bg-foreground/[0.06] text-page-text" : "text-page-text-subtle hover:bg-foreground/[0.04]",
                      )}
                    >
                      <btn.icon />
                    </button>
                  ))}
                </div>
                {/* Text area */}
                <div className="relative bg-foreground/[0.04]">
                  <textarea
                    value={data.description}
                    onChange={(e) => update({ description: e.target.value.slice(0, 300) })}
                    placeholder="Describe your campaign..."
                    className="h-[104px] w-full resize-none bg-transparent px-3.5 py-3 font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                  />
                  <span className="absolute bottom-3 right-3.5 font-inter text-xs tracking-[-0.02em] text-page-text-muted">{data.description.length}/300</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Type and category */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Type and category" description="Classify your campaign so the right creators can find it." />
        <Card>
          <div className="flex gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Type</span>
              <div className="relative">
                <select
                  value={data.type}
                  onChange={(e) => update({ type: e.target.value })}
                  className="flex h-10 w-full cursor-pointer appearance-none items-center rounded-[14px] bg-foreground/[0.04] px-3.5 pr-8 font-inter text-sm tracking-[-0.02em] text-page-text outline-none"
                >
                  <option value="" disabled>Select type</option>
                  {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"><ChevronDownIcon /></div>
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Category</span>
              <div className="relative">
                <select
                  value={data.category}
                  onChange={(e) => update({ category: e.target.value })}
                  className="flex h-10 w-full cursor-pointer appearance-none items-center rounded-[14px] bg-foreground/[0.04] px-3.5 pr-8 font-inter text-sm tracking-[-0.02em] text-page-text outline-none"
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"><ChevronDownIcon /></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Campaign visibility */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Campaign visibility" />
        <div
          onClick={() => setIsPublic((v) => !v)}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
            isPublic ? "border-[rgba(255,144,37,0.3)]" : "border-foreground/[0.06] bg-card-bg",
          )}
          style={isPublic ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--card-bg)" } : undefined}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.25px] border-foreground/[0.06] bg-white shadow-[0px_1.25px_2.5px_rgba(0,0,0,0.03)] dark:bg-white/10">
            <span className={isPublic ? "text-[#252525] dark:text-white" : "text-page-text-muted"}><EyeIcon /></span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Public campaign</span>
            <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">Your brand name and logo are visible to creators.</span>
          </div>
          <ToggleSwitch on={isPublic} onToggle={() => setIsPublic((v) => !v)} />
        </div>
      </div>

      {/* 4. Campaign duration */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Campaign duration" description="Set when your campaign starts and ends" />
        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Start date</span>
                <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <CalendarIcon />
                  <input
                    type="text"
                    value={data.startDate}
                    onChange={(e) => update({ startDate: e.target.value })}
                    placeholder="26 Jan, 2026"
                    className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                  />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">End date</span>
                <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                  <CalendarIcon />
                  <input
                    type="text"
                    value={data.endDate}
                    onChange={(e) => update({ endDate: e.target.value })}
                    placeholder="31 Jan, 2026"
                    disabled={noEndDate}
                    className={cn("flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted", noEndDate && "opacity-40")}
                  />
                </div>
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2">
              <div className={cn("flex size-4 items-center justify-center rounded-full border transition-colors", noEndDate ? "border-[#FF9025] bg-[#FF9025]" : "border-foreground/[0.12] bg-card-bg shadow-[0px_0.46px_0.91px_rgba(0,0,0,0.03)]")}>
                {noEndDate && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.25 5.75L6.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text">No end date</span>
            </label>
          </div>
        </Card>
      </div>

      {/* 5. Thumbnail */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Thumbnail" description="Ratio 2:3 - shown on the Discovery page. The subject/face should be positioned in the center." />
        <Card>
          <ThumbnailUpload
            fileName={data.thumbnailName}
            thumbnailPreview={data.thumbnailPreview}
            onCropComplete={handleCropComplete}
            onDelete={handleThumbnailDelete}
          />
        </Card>
      </div>
    </div>
  );
}
