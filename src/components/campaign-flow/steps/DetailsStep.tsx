"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { DetailsData } from "@/types/campaign-flow.types";
import { ThumbnailUpload } from "../ThumbnailUpload";
import { RichTextEditor } from "../RichTextEditor";
import { DateRangeInputs } from "@/components/ui/date-picker";

// ── Icons ──────────────────────────────────────────────────────────

function ItalicIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.66659 2.66797L9.66659 2.66797M12.6666 2.66797L9.66659 2.66797M9.66659 2.66797L6.33325 13.3346M6.33325 13.3346H3.33325M6.33325 13.3346L9.33325 13.3346" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function BoldIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.33341 6.0013H0.666748M5.33341 6.0013C6.80617 6.0013 8.00008 4.80739 8.00008 3.33464C8.00008 1.86188 6.80617 0.667969 5.33341 0.667969H2.00008C1.2637 0.667969 0.666748 1.26492 0.666748 2.0013V6.0013M5.33341 6.0013H6.00008C7.47284 6.0013 8.66675 7.19521 8.66675 8.66797C8.66675 10.1407 7.47284 11.3346 6.00008 11.3346H2.00008C1.2637 11.3346 0.666748 10.7377 0.666748 10.0013V6.0013" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="square" strokeLinejoin="round" /></svg>;
}
function UnderlineIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 14.0013H12M4 2.66797V8.0013C4 10.2104 5.79086 12.0013 8 12.0013C10.2091 12.0013 12 10.2104 12 8.0013V2.66797" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" /></svg>;
}
function LinkChainIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.66667 12.665L6.55229 12.7793C5.51089 13.8207 3.82245 13.8207 2.78105 12.7793L2.55229 12.5506C1.51089 11.5092 1.51089 9.82074 2.55229 8.77934L4.78105 6.55058C5.82245 5.50918 7.51089 5.50918 8.55229 6.55058L8.78105 6.77934C9.2168 7.21509 9.47022 7.76411 9.54131 8.33162" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.45874 8.33423C6.52983 8.90174 6.78325 9.45077 7.219 9.88652L7.44776 10.1153C8.48916 11.1567 10.1776 11.1567 11.219 10.1153L13.4478 7.88652C14.4892 6.84512 14.4892 5.15668 13.4478 4.11528L13.219 3.88652C12.1776 2.84512 10.4892 2.84512 9.44776 3.88652L9.33341 4.0009" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function OrderedListIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.00008 11.3333H13.3334M8.00008 4.66667H13.3334M4.00008 6.33333V3L2.66675 3.66667M2.83341 10C2.83341 10 3.26675 9.66667 3.74076 9.66667C4.25217 9.66667 4.66675 10.0812 4.66675 10.5927C4.66675 11.7923 2.66675 12 2.66675 13H4.83341" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function BulletListIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.66675 11.332H13.3334M8.66675 4.66536H13.3334M5.33341 4.66536C5.33341 5.40174 4.73646 5.9987 4.00008 5.9987C3.2637 5.9987 2.66675 5.40174 2.66675 4.66536C2.66675 3.92898 3.2637 3.33203 4.00008 3.33203C4.73646 3.33203 5.33341 3.92898 5.33341 4.66536ZM5.33341 11.332C5.33341 12.0684 4.73646 12.6654 4.00008 12.6654C3.2637 12.6654 2.66675 12.0684 2.66675 11.332C2.66675 10.5957 3.2637 9.9987 4.00008 9.9987C4.73646 9.9987 5.33341 10.5957 5.33341 11.332Z" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" /></svg>;
}
function AlignLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3.33203V12.6654M6 3.9987H14M6 7.9987H14M6 11.9987H10.6667" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function EyeIcon() {
  return <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8.95528 2.13731e-10C12.2484 -2.31454e-05 15.4474 1.8936 17.5859 5.48594C18.0188 6.2132 18.0188 7.12005 17.5859 7.84731C15.4474 11.4396 12.2484 13.3333 8.95529 13.3333C5.66219 13.3334 2.46314 11.4397 0.324692 7.84739C-0.108231 7.12014 -0.10823 6.21328 0.324691 5.48603C2.46314 1.89369 5.66218 2.31475e-05 8.95528 2.13731e-10ZM6.03861 6.66667C6.03861 5.05584 7.34445 3.75 8.95528 3.75C10.5661 3.75 11.8719 5.05584 11.8719 6.66667C11.8719 8.2775 10.5661 9.58333 8.95528 9.58333C7.34445 9.58333 6.03861 8.2775 6.03861 6.66667Z" fill="currentColor" /></svg>;
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
    <div className={cn("rounded-2xl border border-foreground/[0.06] bg-card-bg p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]", className)}>
      {children}
    </div>
  );
}

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(); }} className={cn("flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 backdrop-blur-[6px] transition-colors ", on ? "bg-[#252525] dark:bg-[#E0E0E0]" : "bg-foreground/20 dark:bg-[rgba(224,224,224,0.2)]")}>
      <div className={cn("size-4 rounded-full shadow-[0px_4px_12px_rgba(0,0,0,0.12)] transition-transform", on ? "translate-x-5 bg-white dark:bg-[#252525]" : "translate-x-0 bg-white dark:bg-[#E0E0E0]")} />
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
            <div className="flex flex-col gap-1.5">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Name</span>
              <div className={cn(
                "flex h-10 items-center rounded-[14px] px-3.5 transition-colors",
                data.name.length > 0 && data.name.length < 3 ? "bg-[rgba(255,37,37,0.04)] ring-1 ring-[#FF2525]/30" : "bg-foreground/[0.04]",
              )}>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => update({ name: e.target.value.slice(0, 50) })}
                  placeholder="Your campaign name"
                  className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
                />
                <span className="shrink-0 font-inter text-xs tracking-[-0.02em] text-page-text-muted">{data.name.length}/50</span>
              </div>
              {data.name.length > 0 && data.name.length < 3 && (
                <span className="font-inter text-xs tracking-[-0.02em] text-[#FF2525]">Name must be at least 3 characters</span>
              )}
            </div>

            {/* Description with toolbar */}
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Description</span>
              <RichTextEditor
                content={data.description}
                onChange={(html) => update({ description: html })}
                placeholder="Describe your campaign..."
                maxLength={300}
              />
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
            isPublic ? "border-[rgba(255,144,37,0.3)] dark:border-[rgba(251,146,60,0.15)]" : "border-foreground/[0.06] bg-card-bg hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-[rgba(224,224,224,0.04)]",
          )}
          style={isPublic ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--toggle-card-bg)" } : undefined}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.25px] border-foreground/[0.06] bg-white shadow-[0px_1.25px_2.5px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1.25px_2.5px_rgba(0,0,0,0.03)]">
            <span className={isPublic ? "text-[#252525] dark:text-[#E0E0E0]" : "text-page-text-muted"}><EyeIcon /></span>
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
            <DateRangeInputs
              startDate={data.startDate}
              endDate={data.endDate}
              onChangeStart={(v) => update({ startDate: v })}
              onChangeEnd={(v) => update({ endDate: v })}
              endDisabled={noEndDate}
            />
            <button type="button" onClick={() => setNoEndDate((v) => !v)} className="flex cursor-pointer items-center gap-2">
              <div className={cn("flex size-4 items-center justify-center rounded-full border transition-colors", noEndDate ? "border-[#FF9025] bg-[#FF9025]" : "border-foreground/[0.12] bg-card-bg shadow-[0px_0.46px_0.91px_rgba(0,0,0,0.03)]")}>
                {noEndDate && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.25 5.75L6.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span className="font-inter text-sm tracking-[-0.02em] text-page-text">No end date</span>
            </button>
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
