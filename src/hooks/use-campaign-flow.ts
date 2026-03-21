"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  loadCampaignFlowDraft,
  saveCampaignFlowDraft,
} from "@/lib/campaign-flow-storage";
import type {
  CampaignFlowStep,
  CampaignModel,
  ConfigurationData,
  ContactData,
  CreatorDetailsData,
  DetailsData,
  IncentivesData,
  RequirementsData,
} from "@/types/campaign-flow.types";

function getStepOrder(model: CampaignModel): CampaignFlowStep[] {
  const base: CampaignFlowStep[] = [
    "configuration",
    "platforms",
    "details",
    "requirements",
    "application-setup",
    "incentives",
    "creator-details",
    "contact",
  ];
  if (model === "retainer" || model === "per-video") {
    base.push("contract");
  }
  base.push("preview");
  return base;
}

const STEP_LABELS: Record<CampaignFlowStep, string> = {
  configuration: "Configuration",
  platforms: "Platforms & tracking",
  details: "Details",
  requirements: "Requirements",
  "application-setup": "Application setup",
  incentives: "Incentives (optional)",
  "creator-details": "Creator details",
  contact: "Contact",
  contract: "Contract",
  preview: "Preview",
};

const DEFAULT_CONFIGURATION: ConfigurationData = {
  budget: "",
  contractLength: "3",
  expectedPostsEnabled: false,
  expectedPostsPerMonth: "20",
  maxPayout: "",
  payoutFrequency: "monthly",
  perPlatform: true,
  platformRewards: {},
  requireApplication: false,
  rewardPer1000Views: "",
  selectedPlatforms: [],
};

const DEFAULT_DETAILS: DetailsData = {
  category: "",
  description: "",
  endDate: "",
  name: "",
  ongoing: true,
  startDate: "",
  thumbnailFile: null,
  thumbnailName: "",
  thumbnailPreview: null,
  type: "",
};

const DEFAULT_REQUIREMENTS: RequirementsData = {
  customRequirements: [],
  presets: {
    brandLogo: false,
    faceOnCamera: false,
    linkInBio: false,
    linkInBioUrl: "",
    noReposted: false,
    quickSubmission: false,
    quickSubmissionHours: "",
    soundUrl: "",
    specificSound: false,
    specificText: false,
    specificTextValue: "",
    videoLength: false,
    videoLengthMax: "",
    videoLengthMin: "",
  },
  videoExamples: [],
};

const DEFAULT_INCENTIVES: IncentivesData = {
  calculationMethod: "per-post",
  milestones: [],
};

const DEFAULT_CREATOR_DETAILS: CreatorDetailsData = {
  creatorType: "",
  description: "",
  inviteHandles: [],
};

const DEFAULT_CONTACT: ContactData = {
  agreedToTerms: false,
  chatPlatform: "",
  email: "",
  phone: "",
};

export function useCampaignFlow(
  experienceId: string,
  initialModel: CampaignModel = "cpm",
  initialData?: Omit<import("@/types/campaign-flow.types").CampaignFlowData, "step" | "model" | "updatedAt">,
) {
  const router = useRouter();
  const [model] = useState<CampaignModel>(initialModel);
  const STEP_ORDER = useMemo(() => getStepOrder(model), [model]);
  const [step, setStep] = useState<CampaignFlowStep>("configuration");
  const [isRestoring, setIsRestoring] = useState(true);
  const [configuration, setConfiguration] = useState<ConfigurationData>(initialData?.configuration ?? DEFAULT_CONFIGURATION);
  const [details, setDetails] = useState<DetailsData>(initialData?.details ?? DEFAULT_DETAILS);
  const [requirements, setRequirements] = useState<RequirementsData>(initialData?.requirements ?? DEFAULT_REQUIREMENTS);
  const [incentives, setIncentives] = useState<IncentivesData>(initialData?.incentives ?? DEFAULT_INCENTIVES);
  const [creatorDetails, setCreatorDetails] = useState<CreatorDetailsData>(initialData?.creatorDetails ?? DEFAULT_CREATOR_DETAILS);
  const [contact, setContact] = useState<ContactData>(initialData?.contact ?? DEFAULT_CONTACT);

  useEffect(() => {
    // Skip draft restoration if we have initialData (edit mode)
    if (initialData) {
      setIsRestoring(false);
      return;
    }
    const saved = loadCampaignFlowDraft(experienceId);
    if (saved) {
      const modelMatches = saved.model === initialModel;
      if (modelMatches) {
        const restoredStep = STEP_ORDER.includes(saved.step) ? saved.step : "configuration";
        setStep(restoredStep);
      }
      if (saved.configuration) setConfiguration({ ...DEFAULT_CONFIGURATION, ...saved.configuration });
      if (saved.details) setDetails({ ...DEFAULT_DETAILS, ...saved.details, thumbnailFile: null });
      if (saved.requirements) setRequirements({ ...DEFAULT_REQUIREMENTS, ...saved.requirements, presets: { ...DEFAULT_REQUIREMENTS.presets, ...saved.requirements.presets } });
      if (saved.incentives) setIncentives({ ...DEFAULT_INCENTIVES, ...saved.incentives });
      if (saved.creatorDetails) setCreatorDetails({ ...DEFAULT_CREATOR_DETAILS, ...saved.creatorDetails });
      if (saved.contact) setContact({ ...DEFAULT_CONTACT, ...saved.contact });
    }
    setIsRestoring(false);
  }, [experienceId, initialModel, initialData]);

  useEffect(() => {
    if (isRestoring) return;
    const { thumbnailFile: _, ...detailsWithoutFile } = details;
    saveCampaignFlowDraft(experienceId, {
      configuration, contact, creatorDetails,
      details: { ...detailsWithoutFile, thumbnailFile: null } as DetailsData,
      incentives, model, requirements, step,
    });
  }, [step, model, configuration, details, requirements, incentives, creatorDetails, contact, isRestoring, experienceId]);

  const stepIndex = STEP_ORDER.indexOf(step);
  const [showErrors, setShowErrors] = useState(false);
  useEffect(() => setShowErrors(false), []);

  const handleContinue = () => {
    if (!canContinue) { setShowErrors(true); return; }
    setShowErrors(false);
    if (stepIndex < STEP_ORDER.length - 1) setStep(STEP_ORDER[stepIndex + 1]);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStep(STEP_ORDER[stepIndex - 1]);
    else router.push("/");
  };

  const handleStepClick = (clickedIndex: number) => {
    if (clickedIndex <= stepIndex) setStep(STEP_ORDER[clickedIndex]);
  };

  const handleBackToList = () => { router.push("/"); };
  const handleSaveDraft = () => { router.push("/"); };

  const canContinue = (() => {
    switch (step) {
      case "configuration":
        if (model === "retainer") {
          return configuration.selectedPlatforms.length > 0 && configuration.rewardPer1000Views !== "" && Number.parseFloat(configuration.rewardPer1000Views) > 0;
        }
        return configuration.selectedPlatforms.length > 0 && configuration.rewardPer1000Views !== "" && Number.parseFloat(configuration.rewardPer1000Views) > 0 && configuration.budget !== "" && Number.parseFloat(configuration.budget) > 0;
      case "details":
        return details.name.trim().length > 0;
      case "requirements": {
        const p = requirements.presets;
        if (p.specificSound && p.soundUrl.trim() === "") return false;
        if (p.linkInBio && p.linkInBioUrl.trim() === "") return false;
        return true;
      }
      default:
        return true;
    }
  })();

  return {
    canContinue, configuration, contact, creatorDetails, details,
    handleBack, handleBackToList, handleContinue, handleSaveDraft, handleStepClick,
    incentives, isRestoring, model, requirements,
    setConfiguration, setContact, setCreatorDetails, setDetails, setIncentives, setRequirements,
    showErrors, step, stepIndex, stepLabels: STEP_LABELS, steps: STEP_ORDER,
  };
}
