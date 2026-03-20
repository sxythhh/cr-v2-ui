"use client";

import { Switch } from "@/components/ui/switch";
import type { ContactData } from "@/types/campaign-flow.types";
import { CampaignFlowSelect } from "../CampaignFlowSelect";
import { SectionCard, SectionHeading, Field, INPUT_CLASS } from "./shared";

const CHAT_OPTIONS = [
  { label: "WhatsApp", value: "whatsapp" },
  { label: "iMessage", value: "imessage" },
  { label: "Slack", value: "slack" },
];

export function ContactStep({ data, onChange }: { data: ContactData; onChange: (data: ContactData) => void }) {
  const update = (partial: Partial<ContactData>) => onChange({ ...data, ...partial });
  return (
    <div className="flex flex-col gap-2">
      <SectionCard>
        <SectionHeading title="Contact Information" description="How should we reach you about this campaign?" />
        <Field label="Email"><input className={INPUT_CLASS} onChange={(e) => update({ email: e.target.value })} placeholder="your@email.com" type="email" value={data.email} /></Field>
        <Field label="Phone"><input className={INPUT_CLASS} onChange={(e) => update({ phone: e.target.value })} placeholder="+1 (555) 000-0000" type="tel" value={data.phone} /></Field>
        <Field label="Preferred chat platform"><CampaignFlowSelect onValueChange={(v) => update({ chatPlatform: v as ContactData["chatPlatform"] })} options={CHAT_OPTIONS} placeholder="Select platform" value={data.chatPlatform} /></Field>
      </SectionCard>

      <SectionCard>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium tracking-[-0.02em] text-page-text">I agree to the terms and conditions</span>
          <Switch checked={data.agreedToTerms} onCheckedChange={(v) => update({ agreedToTerms: v })} />
        </div>
      </SectionCard>
    </div>
  );
}
