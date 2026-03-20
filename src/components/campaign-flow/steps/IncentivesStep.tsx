"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import type { BonusMilestone, IncentivesData } from "@/types/campaign-flow.types";
import { SectionCard, SectionHeading, Field, INPUT_CLASS } from "./shared";

export function IncentivesStep({ data, onChange }: { data: IncentivesData; onChange: (data: IncentivesData) => void }) {
  const update = (partial: Partial<IncentivesData>) => onChange({ ...data, ...partial });
  const addMilestone = () => update({ milestones: [...data.milestones, { name: "", amount: "", views: "" }] });
  const removeMilestone = (i: number) => update({ milestones: data.milestones.filter((_, idx) => idx !== i) });
  const updateMilestone = (i: number, partial: Partial<BonusMilestone>) => {
    const next = [...data.milestones];
    next[i] = { ...next[i], ...partial };
    update({ milestones: next });
  };

  return (
    <div className="flex flex-col gap-2">
      <SectionCard>
        <SectionHeading title="Incentives (optional)" description="Add bonus milestones to reward top-performing creators." />
      </SectionCard>

      {data.milestones.map((m, i) => (
        <SectionCard key={i}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium tracking-[-0.02em] text-page-text">Milestone {i + 1}</span>
            <button className="text-page-text-muted hover:text-[#252525] dark:hover:text-[#e5e5e5]" onClick={() => removeMilestone(i)} type="button"><IconTrash size={16} /></button>
          </div>
          <Field label="Name"><input className={INPUT_CLASS} onChange={(e) => updateMilestone(i, { name: e.target.value })} placeholder="e.g. Top performer" value={m.name} /></Field>
          <div className="flex gap-3">
            <Field label="Bonus amount" className="flex-1"><CurrencyInput onChange={(v) => updateMilestone(i, { amount: v })} placeholder="0" value={m.amount} /></Field>
            <Field label="Views threshold" className="flex-1"><input className={INPUT_CLASS} inputMode="numeric" onChange={(e) => updateMilestone(i, { views: e.target.value })} placeholder="0" value={m.views} /></Field>
          </div>
        </SectionCard>
      ))}

      <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium tracking-[-0.02em] text-page-text-muted hover:text-[#252525] dark:hover:text-[#e5e5e5] transition-colors" onClick={addMilestone} type="button">
        <IconPlus size={16} /> Add milestone
      </button>
    </div>
  );
}
