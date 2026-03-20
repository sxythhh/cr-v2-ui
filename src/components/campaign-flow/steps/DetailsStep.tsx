"use client";

import { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { DateRangeInputs } from "@/components/ui/date-picker";
import type { DetailsData } from "@/types/campaign-flow.types";
import { CategoryIcon } from "../CategoryIcon";
import { CampaignFlowSelect } from "../CampaignFlowSelect";
import { ThumbnailUpload } from "../ThumbnailUpload";
import { SectionCard, SectionHeading, Field, INPUT_CLASS } from "./shared";

const TYPE_OPTIONS = [
  { label: "UGC", value: "ugc" },
  { label: "Clipping", value: "clipping" },
  { label: "Review", value: "review" },
];

const CATEGORY_OPTIONS = ["Music", "Gaming", "Entertainment", "Sports", "Education", "Lifestyle", "Technology"].map((cat) => ({
  icon: <CategoryIcon category={cat} />,
  label: cat,
  value: cat.toLowerCase(),
}));

export function DetailsStep({ data, onChange }: { data: DetailsData; onChange: (data: DetailsData) => void }) {
  const update = (partial: Partial<DetailsData>) => onChange({ ...data, ...partial });

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
    <div className="flex flex-col gap-2">
      <SectionCard>
        <SectionHeading title="Details" description="Basic information about your campaign" />
        <Field label="Campaign Name">
          <input className={INPUT_CLASS} onChange={(e) => update({ name: e.target.value })} placeholder="Your campaign name" value={data.name} />
        </Field>
      </SectionCard>

      <SectionCard>
        <div className="flex gap-3">
          <Field label="Type" className="flex-1 min-w-0"><CampaignFlowSelect onValueChange={(v) => update({ type: v })} options={TYPE_OPTIONS} placeholder="Select type" value={data.type} /></Field>
          <Field label="Category" className="flex-1 min-w-0"><CampaignFlowSelect onValueChange={(v) => update({ category: v })} options={CATEGORY_OPTIONS} placeholder="Select category" value={data.category} /></Field>
        </div>
      </SectionCard>

      <SectionCard>
        <Field label="Description">
          <textarea className={`${INPUT_CLASS} min-h-[100px] py-3 resize-none`} onChange={(e) => update({ description: e.target.value })} placeholder="Describe your campaign..." value={data.description} />
        </Field>
      </SectionCard>

      <SectionCard>
        <Field label="Thumbnail">
          <ThumbnailUpload
            fileName={data.thumbnailName}
            thumbnailPreview={data.thumbnailPreview}
            onCropComplete={handleCropComplete}
            onDelete={handleThumbnailDelete}
          />
        </Field>
      </SectionCard>

      <SectionCard>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Ongoing campaign</span>
            <span className="text-sm font-normal tracking-[-0.02em] text-page-text-muted">No end date — runs until paused.</span>
          </div>
          <Switch checked={data.ongoing} onCheckedChange={(v) => update({ ongoing: v })} />
        </div>
        {!data.ongoing && (
          <DateRangeInputs
            startDate={data.startDate}
            endDate={data.endDate}
            onChangeStart={(v) => update({ startDate: v })}
            onChangeEnd={(v) => update({ endDate: v })}
          />
        )}
      </SectionCard>
    </div>
  );
}
