"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { RequirementsData, RequirementsPresets } from "@/types/campaign-flow.types";

// ── Icons ──────────────────────────────────────────────────────────

function SparkleIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.796 4.204L14 7l-4.204 1.796L8 13l-1.796-4.204L2 7l4.204-1.796L8 1z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function XIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="#252525" strokeOpacity="0.7" strokeLinecap="round" /></svg>;
}
function CheckIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LinkChainIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 8.667a3.333 3.333 0 0 0 4.994.36l2-2a3.334 3.334 0 0 0-4.714-4.714l-1.147 1.14M9.333 7.333a3.333 3.333 0 0 0-4.994-.36l-2 2a3.334 3.334 0 0 0 4.714 4.714l1.14-1.14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function VideoIcon() {
  return <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M0.666992 2.0013C0.666992 1.26492 1.26395 0.667969 2.00033 0.667969H7.33366C8.07004 0.667969 8.66699 1.26492 8.66699 2.0013V8.66797C8.66699 9.40435 8.07004 10.0013 7.33366 10.0013H2.00033C1.26395 10.0013 0.666992 9.40435 0.666992 8.66797V2.0013Z" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinejoin="round" /><path d="M9.03552 3.81704L11.7022 2.48371C12.1455 2.26207 12.667 2.5844 12.667 3.07999V7.58928C12.667 8.08487 12.1455 8.4072 11.7022 8.18556L9.03552 6.85223C8.80966 6.7393 8.66699 6.50846 8.66699 6.25595V4.41332C8.66699 4.16081 8.80966 3.92997 9.03552 3.81704Z" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinejoin="round" /></svg>;
}
function ImageIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0.666992 8.66797L2.86225 6.47271C3.1226 6.21236 3.54471 6.21236 3.80506 6.47271L6.00033 8.66797L6.86225 7.80604C7.1226 7.54569 7.54471 7.54569 7.80506 7.80604L10.667 10.668M2.00033 11.3346H10.0003C10.7367 11.3346 11.3337 10.7377 11.3337 10.0013V2.0013C11.3337 1.26492 10.7367 0.667969 10.0003 0.667969H2.00033C1.26395 0.667969 0.666992 1.26492 0.666992 2.0013V10.0013C0.666992 10.7377 1.26395 11.3346 2.00033 11.3346ZM8.16699 4.0013C8.16699 4.36949 7.86852 4.66797 7.50033 4.66797C7.13214 4.66797 6.83366 4.36949 6.83366 4.0013C6.83366 3.63311 7.13214 3.33464 7.50033 3.33464C7.86852 3.33464 8.16699 3.63311 8.16699 4.0013Z" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" /></svg>;
}
function PaintRollerIcon() {
  return <svg width="12" height="13" viewBox="0 0 12 13" fill="none"><path d="M2.66699 2.66797V3.33464C2.66699 4.07102 3.26395 4.66797 4.00033 4.66797H10.0003C10.7367 4.66797 11.3337 4.07102 11.3337 3.33464V2.0013C11.3337 1.26492 10.7367 0.667969 10.0003 0.667969H4.00033C3.26395 0.667969 2.66699 1.26492 2.66699 2.0013V2.66797ZM2.66699 2.66797H1.33366C0.965469 2.66797 0.666992 2.96645 0.666992 3.33464V5.33464C0.666992 6.07102 1.26395 6.66797 2.00033 6.66797H6.66699V8.33464M8.00033 12.0013V10.0013C8.00033 9.26492 7.40337 8.66797 6.66699 8.66797C5.93061 8.66797 5.33366 9.26492 5.33366 10.0013V12.0013" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

// ── Helpers ─────────────────────────────────────────────────────────

function SectionLabel({ title, description, badge }: { title: string; description?: string; badge?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
        {badge}
      </div>
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

function PresetRow({ label, on, onToggle, children }: { label: string; on: boolean; onToggle: () => void; children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex rounded-2xl border px-4 py-3 transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
        children ? "flex-col gap-3" : "",
        on ? "border-[rgba(255,144,37,0.3)]" : "border-foreground/[0.06] bg-card-bg",
      )}
      style={on ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), #FFFFFF" } : undefined}
    >
      <div className="flex w-full cursor-pointer items-center justify-between gap-4" onClick={onToggle}>
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{label}</span>
        <ToggleSwitch on={on} onToggle={onToggle} />
      </div>
      {on && children}
    </div>
  );
}

function FileCard({ name, size, ext }: { name: string; size: string; ext: string }) {
  return (
    <div className="relative flex w-[calc(50%-4px)] items-center gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
      {/* Thumbnail placeholder */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[5.6px] border border-foreground/[0.06] bg-[#D9D9D9]">
        <span className="rounded-full border border-foreground/[0.06] bg-white px-1 font-inter text-[10px] font-medium tracking-[-0.02em] text-page-text-subtle">{ext}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{name}</span>
        <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{size}</span>
      </div>
      {/* Delete button */}
      <button type="button" className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#F2F2F2]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.14" /></svg>
      </button>
    </div>
  );
}

function UploadArea({ icon, title, subtitle, files }: { icon: React.ReactNode; title: string; subtitle: string; files?: { name: string; size: string; ext: string }[] }) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        {files && files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => <FileCard key={i} {...f} />)}
          </div>
        )}
        <div className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[rgba(37,37,37,0.12)] bg-[rgba(37,37,37,0.02)] p-4 transition-colors hover:bg-[rgba(37,37,37,0.04)] dark:border-[rgba(255,255,255,0.12)] dark:bg-[rgba(255,255,255,0.02)] dark:hover:bg-[rgba(255,255,255,0.04)]">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06]">
            <span className="text-page-text-subtle">{icon}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text group-hover:underline">{title}</span>
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">{subtitle}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Suggestions ────────────────────────────────────────────────────

const AI_SUGGESTIONS = [
  "Show product in first 3 seconds of video",
  "Include brand name or @mention in caption",
  "Minimum 60-second video length",
];

// ── Main ───────────────────────────────────────────────────────────

export function RequirementsStep({ data, onChange, showErrors }: { data: RequirementsData; onChange: (data: RequirementsData) => void; showErrors: boolean }) {
  const update = (partial: Partial<RequirementsData>) => onChange({ ...data, ...partial });
  const updatePreset = (partial: Partial<RequirementsPresets>) => update({ presets: { ...data.presets, ...partial } });
  const p = data.presets;

  const [suggestions, setSuggestions] = useState(AI_SUGGESTIONS);
  const [dos, setDos] = useState("");
  const [donts, setDonts] = useState("");
  const [engagementRate, setEngagementRate] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. AI Suggested requirements */}
      <div className="relative overflow-hidden rounded-2xl border border-foreground/[0.06] bg-card-bg p-4">
        {/* Gradient blur borders */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 blur-[2px]" style={{ background: "linear-gradient(135deg, rgba(255,144,37,0.3) 0%, transparent 50%, rgba(174,78,238,0.2) 100%)" }} />
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 blur-[0.5px]" style={{ background: "linear-gradient(135deg, rgba(255,144,37,0.3) 0%, transparent 50%, rgba(174,78,238,0.2) 100%)", border: "1px solid rgba(255,144,37,0.2)" }} />

        <div className="relative flex flex-col gap-3">
          <div className="flex gap-2">
            <span className="text-page-text-muted"><SparkleIcon /></span>
            <div className="flex flex-col gap-1.5">
              <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Suggested requirements based on your campaign type</span>
              <span className="font-inter text-sm font-normal leading-[140%] tracking-[-0.02em] text-page-text-subtle">These are auto-generated from your campaign type and brand profile. Accept or dismiss each one.</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pl-6">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg px-3 py-2.5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)]">
                <span className="flex-1 font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{s}</span>
                <button type="button" onClick={() => setSuggestions((prev) => prev.filter((_, j) => j !== i))} className="flex size-6 items-center justify-center rounded-full text-page-text-subtle transition-colors hover:bg-foreground/[0.06]">
                  <XIcon />
                </button>
                <button type="button" className="flex size-6 items-center justify-center rounded-full bg-[rgba(0,153,77,0.06)] text-[#00994D]">
                  <CheckIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Dos */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Dos" description="What creators should do." />
        <Card>
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Dos</span>
            <textarea
              value={dos}
              onChange={(e) => setDos(e.target.value)}
              placeholder={'One per line e.g.\n"Show product in first 3 seconds;\nInclude brand @mention in caption;\nNo re-offs."'}
              className="h-[104px] w-full resize-none overflow-hidden rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60"
            />
          </div>
        </Card>
      </div>

      {/* 3. Don'ts */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Donts" description="What creators should avoid." />
        <Card>
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Donts</span>
            <textarea
              value={donts}
              onChange={(e) => setDonts(e.target.value)}
              placeholder={'One per line e.g.\n"No competitor products in frame;\nNo negative language about the brand."'}
              className="h-[104px] w-full resize-none overflow-hidden rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60"
            />
          </div>
        </Card>
      </div>

      {/* 4. Preset requirements */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Preset requirements" description="A set of preset requirements for you to choose from." />
        <Card className="flex flex-col gap-2 p-5">
          <PresetRow label="Require face on camera" on={p.faceOnCamera} onToggle={() => updatePreset({ faceOnCamera: !p.faceOnCamera })} />
          <PresetRow label="Require brand logo or watermark" on={p.brandLogo} onToggle={() => updatePreset({ brandLogo: !p.brandLogo })} />
          <PresetRow label="No reposted/recycled content" on={p.noReposted} onToggle={() => updatePreset({ noReposted: !p.noReposted })} />
          <PresetRow label="Specific soundtrack/music" on={p.specificSound} onToggle={() => updatePreset({ specificSound: !p.specificSound })}>
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Soundtrack URL</span>
              <div className="flex h-10 items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5">
                <span className="text-page-text-muted"><LinkChainIcon /></span>
                <input type="text" value={p.soundUrl} onChange={(e) => updatePreset({ soundUrl: e.target.value })} placeholder="Paste soundtrack URL" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60" />
              </div>
            </div>
          </PresetRow>
          <PresetRow label="Specific video length" on={p.videoLength} onToggle={() => updatePreset({ videoLength: !p.videoLength })}>
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Video length</span>
              <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input type="text" value={p.videoLengthMin} onChange={(e) => updatePreset({ videoLengthMin: e.target.value })} placeholder="Enter desired video length" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60" />
              </div>
            </div>
          </PresetRow>
          <PresetRow label="Require link in bio" on={p.linkInBio} onToggle={() => updatePreset({ linkInBio: !p.linkInBio })} />
          <PresetRow label="Specific text in caption/title" on={p.specificText} onToggle={() => updatePreset({ specificText: !p.specificText })}>
            <div className="flex flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Desired text in caption/title</span>
              <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input type="text" value={p.specificTextValue} onChange={(e) => updatePreset({ specificTextValue: e.target.value })} placeholder="Enter specific text" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted/60" />
              </div>
            </div>
          </PresetRow>
          <PresetRow label="Require quick submission" on={p.quickSubmission} onToggle={() => updatePreset({ quickSubmission: !p.quickSubmission })} />
        </Card>
      </div>

      {/* 5. Reference materials */}
      <div className="flex flex-col gap-4">
        <SectionLabel
          title="Reference materials"
          description="Upload videos, images, and brand assets for creators to reference directly in the app."
          badge={<span className="inline-flex items-center rounded-full bg-[rgba(0,153,77,0.08)] px-1.5 py-1 font-inter text-xs font-medium tracking-[-0.02em] text-[#00994D]">Hosted</span>}
        />
        <div className="flex flex-col gap-2">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Videos</span>
          <UploadArea icon={<VideoIcon />} title="Upload videos" subtitle="MP4, MOV only. Max 500 MB" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Images/Moodboard</span>
          <UploadArea icon={<ImageIcon />} title="Upload images" subtitle="PNG, JPG, ZIP" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Brand assets</span>
          <UploadArea icon={<PaintRollerIcon />} title="Upload assets" subtitle="PDF, ZIP, AI, PSD" />
        </div>
      </div>

      {/* 6. Minimum engagement rate */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Minimum engagement rate" description="Videos below this threshold will be flagged after posting. You can then claw back payouts for underperforming content." />
        <Card>
          <PresetRow label="Minimum engagement rate" on={engagementRate} onToggle={() => setEngagementRate((v) => !v)} />
        </Card>
      </div>
    </div>
  );
}
