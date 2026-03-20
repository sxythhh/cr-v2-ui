"use client";

import { Switch } from "@/components/ui/switch";
import type { RequirementsData, RequirementsPresets } from "@/types/campaign-flow.types";
import { SectionCard, SectionHeading, Field, INPUT_CLASS } from "./shared";

export function RequirementsStep({ data, onChange, showErrors }: { data: RequirementsData; onChange: (data: RequirementsData) => void; showErrors: boolean }) {
  const update = (partial: Partial<RequirementsData>) => onChange({ ...data, ...partial });
  const updatePreset = (partial: Partial<RequirementsPresets>) => update({ presets: { ...data.presets, ...partial } });
  const p = data.presets;

  return (
    <div className="flex flex-col gap-2">
      <SectionCard>
        <SectionHeading title="Requirements" description="Set content requirements for creators" />
      </SectionCard>

      <SectionCard>
        <ToggleRow label="Face on camera" checked={p.faceOnCamera} onChange={(v) => updatePreset({ faceOnCamera: v })} />
        <ToggleRow label="Brand logo visible" checked={p.brandLogo} onChange={(v) => updatePreset({ brandLogo: v })} />
        <ToggleRow label="No reposted content" checked={p.noReposted} onChange={(v) => updatePreset({ noReposted: v })} />
      </SectionCard>

      <SectionCard>
        <ToggleRow label="Specific sound" checked={p.specificSound} onChange={(v) => updatePreset({ specificSound: v })} />
        {p.specificSound && (
          <Field label="Sound URL">
            <input className={INPUT_CLASS} onChange={(e) => updatePreset({ soundUrl: e.target.value })} placeholder="Paste sound URL" value={p.soundUrl} />
            {showErrors && p.soundUrl.trim() === "" && <span className="text-xs text-red-500">Sound URL is required</span>}
          </Field>
        )}
        <ToggleRow label="Video length" checked={p.videoLength} onChange={(v) => updatePreset({ videoLength: v })} />
        {p.videoLength && (
          <div className="flex gap-3">
            <Field label="Min (seconds)" className="flex-1"><input className={INPUT_CLASS} inputMode="numeric" onChange={(e) => updatePreset({ videoLengthMin: e.target.value })} placeholder="0" value={p.videoLengthMin} /></Field>
            <Field label="Max (seconds)" className="flex-1"><input className={INPUT_CLASS} inputMode="numeric" onChange={(e) => updatePreset({ videoLengthMax: e.target.value })} placeholder="0" value={p.videoLengthMax} /></Field>
          </div>
        )}
      </SectionCard>

      <SectionCard>
        <ToggleRow label="Link in bio" checked={p.linkInBio} onChange={(v) => updatePreset({ linkInBio: v })} />
        {p.linkInBio && (
          <Field label="Link URL">
            <input className={INPUT_CLASS} onChange={(e) => updatePreset({ linkInBioUrl: e.target.value })} placeholder="https://..." value={p.linkInBioUrl} />
            {showErrors && p.linkInBioUrl.trim() === "" && <span className="text-xs text-red-500">Link URL is required</span>}
          </Field>
        )}
        <ToggleRow label="Specific text/hashtag" checked={p.specificText} onChange={(v) => updatePreset({ specificText: v })} />
        {p.specificText && (
          <Field label="Text / Hashtag"><input className={INPUT_CLASS} onChange={(e) => updatePreset({ specificTextValue: e.target.value })} placeholder="#yourbrand" value={p.specificTextValue} /></Field>
        )}
      </SectionCard>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
