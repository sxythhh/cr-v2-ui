"use client";

import type { CreatorDetailsData } from "@/types/campaign-flow.types";
import { CampaignFlowSelect } from "../CampaignFlowSelect";
import { SectionCard, SectionHeading, Field, INPUT_CLASS } from "./shared";

const CREATOR_TYPE_OPTIONS = [
  { label: "UGC Creators", value: "ugc" },
  { label: "Clippers", value: "clippers" },
  { label: "Influencers", value: "influencers" },
  { label: "Any", value: "any" },
];

export function CreatorDetailsStep({ data, onChange }: { data: CreatorDetailsData; onChange: (data: CreatorDetailsData) => void }) {
  const update = (partial: Partial<CreatorDetailsData>) => onChange({ ...data, ...partial });
  return (
    <div className="flex flex-col gap-2">
      <SectionCard>
        <SectionHeading title="Creator Details" description="Define the type of creators you're looking for" />
        <Field label="Creator type"><CampaignFlowSelect onValueChange={(v) => update({ creatorType: v })} options={CREATOR_TYPE_OPTIONS} placeholder="Select type" value={data.creatorType} /></Field>
      </SectionCard>

      <SectionCard>
        <Field label="Description for creators">
          <textarea className={`${INPUT_CLASS} min-h-[100px] py-3 resize-none`} onChange={(e) => update({ description: e.target.value })} placeholder="Describe what you're looking for in creators..." value={data.description} />
        </Field>
      </SectionCard>
    </div>
  );
}
