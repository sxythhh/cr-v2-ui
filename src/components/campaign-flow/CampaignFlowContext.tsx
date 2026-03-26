"use client";

import { createContext, useContext, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCampaignFlow } from "@/hooks/use-campaign-flow";
import type {
  CampaignFlowStep, CampaignModel, ConfigurationData, ContactData,
  CreatorDetailsData, DetailsData, IncentivesData, RequirementsData,
} from "@/types/campaign-flow.types";

interface CampaignFlowContextValue {
  step: CampaignFlowStep;
  stepIndex: number;
  steps: CampaignFlowStep[];
  stepLabels: Record<CampaignFlowStep, string>;
  model: CampaignModel;
  isRestoring: boolean;
  canContinue: boolean;
  continueBlockReason: string;
  showErrors: boolean;
  editMode: boolean;
  configuration: ConfigurationData;
  setConfiguration: (data: ConfigurationData) => void;
  details: DetailsData;
  setDetails: (data: DetailsData) => void;
  requirements: RequirementsData;
  setRequirements: (data: RequirementsData) => void;
  incentives: IncentivesData;
  setIncentives: (data: IncentivesData) => void;
  creatorDetails: CreatorDetailsData;
  setCreatorDetails: (data: CreatorDetailsData) => void;
  contact: ContactData;
  setContact: (data: ContactData) => void;
  handleContinue: () => void;
  handleBack: () => void;
  handleStepClick: (index: number) => void;
  handleBackToList: () => void;
  handleSaveDraft: () => void;
  portalContainer: React.RefObject<HTMLDivElement | null>;
}

const CampaignFlowContext = createContext<CampaignFlowContextValue | null>(null);

export function CampaignFlowProvider({
  experienceId, model = "cpm", onClose, editMode, initialData, children,
}: {
  experienceId?: string;
  model?: CampaignModel;
  onClose?: () => void;
  editMode?: boolean;
  initialData?: Omit<import("@/types/campaign-flow.types").CampaignFlowData, "step" | "model" | "updatedAt">;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const flow = useCampaignFlow(experienceId ?? "", model, initialData);
  const portalContainer = useRef<HTMLDivElement>(null);
  const goBack = useCallback(() => router.back(), [router]);

  const value: CampaignFlowContextValue = {
    ...flow,
    editMode: !!editMode,
    handleBack: onClose && flow.stepIndex === 0 ? onClose : flow.handleBack,
    handleBackToList: editMode ? goBack : (onClose ?? flow.handleBackToList),
    portalContainer,
  };

  return (
    <CampaignFlowContext.Provider value={value}>
      {children}
    </CampaignFlowContext.Provider>
  );
}

export function useCampaignFlowContext() {
  const ctx = useContext(CampaignFlowContext);
  if (!ctx) throw new Error("useCampaignFlowContext must be used within CampaignFlowProvider");
  return ctx;
}

export function useCfPortalContainer() {
  const ctx = useContext(CampaignFlowContext);
  return ctx?.portalContainer.current ?? undefined;
}
