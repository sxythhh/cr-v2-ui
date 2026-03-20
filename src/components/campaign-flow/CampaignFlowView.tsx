"use client";

import type { CampaignModel } from "@/types/campaign-flow.types";
import { CampaignFlowProvider, useCampaignFlowContext } from "./CampaignFlowContext";
import { CampaignFlowLayout } from "./CampaignFlowLayout";
import { ConfigurationStep } from "./steps/ConfigurationStep";
import { ContactStep } from "./steps/ContactStep";
import { CreatorDetailsStep } from "./steps/CreatorDetailsStep";
import { DetailsStep } from "./steps/DetailsStep";
import { IncentivesStep } from "./steps/IncentivesStep";
import { PreviewStep } from "./steps/PreviewStep";
import { RequirementsStep } from "./steps/RequirementsStep";

interface CampaignFlowViewProps {
  experienceId?: string;
  model?: CampaignModel;
  onClose?: () => void;
  editMode?: boolean;
  initialData?: Omit<import("@/types/campaign-flow.types").CampaignFlowData, "step" | "model" | "updatedAt">;
}

export function CampaignFlowView({ experienceId, model = "cpm", onClose, editMode, initialData }: CampaignFlowViewProps) {
  return (
    <CampaignFlowProvider experienceId={experienceId} model={model} onClose={onClose} editMode={editMode} initialData={initialData}>
      <CampaignFlowLayout>
        <StepContent />
      </CampaignFlowLayout>
    </CampaignFlowProvider>
  );
}

function StepContent() {
  const {
    step, stepLabels, model, configuration, setConfiguration,
    details, setDetails, requirements, setRequirements,
    incentives, setIncentives, creatorDetails, setCreatorDetails,
    contact, setContact, showErrors,
  } = useCampaignFlowContext();

  switch (step) {
    case "configuration":
      return <ConfigurationStep data={configuration} model={model} onChange={setConfiguration} />;
    case "details":
      return <DetailsStep data={details} onChange={setDetails} />;
    case "requirements":
      return <RequirementsStep data={requirements} onChange={setRequirements} showErrors={showErrors} />;
    case "incentives":
      return <IncentivesStep data={incentives} onChange={setIncentives} />;
    case "creator-details":
      return <CreatorDetailsStep data={creatorDetails} onChange={setCreatorDetails} />;
    case "contact":
      return <ContactStep data={contact} onChange={setContact} />;
    case "preview":
      return <PreviewStep configuration={configuration} details={details} />;
    default:
      return (
        <div className="flex items-center justify-center py-20">
          <p className="text-[var(--cf-text-muted)] text-sm">{stepLabels[step]} — coming soon</p>
        </div>
      );
  }
}
