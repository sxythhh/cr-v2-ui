export type CampaignModel = "cpm" | "retainer" | "per-video";

export type Platform = "tiktok" | "instagram" | "youtube" | "x";

export type CampaignFlowStep =
  | "configuration"
  | "details"
  | "requirements"
  | "incentives"
  | "creator-details"
  | "contact"
  | "preview";

export type PayoutFrequency = "monthly" | "weekly";

export type ConfigurationData = {
  requireApplication: boolean;
  selectedPlatforms: Platform[];
  perPlatform: boolean;
  rewardPer1000Views: string;
  platformRewards: Record<string, string>;
  budget: string;
  maxPayout: string;
  contractLength: string;
  payoutFrequency: PayoutFrequency;
  expectedPostsEnabled: boolean;
  expectedPostsPerMonth: string;
};

export type DetailsData = {
  name: string;
  description: string;
  type: string;
  category: string;
  ongoing: boolean;
  startDate: string;
  endDate: string;
  thumbnailFile: File | null;
  thumbnailName: string;
  thumbnailPreview: string | null;
};

export type RequirementsPresets = {
  faceOnCamera: boolean;
  brandLogo: boolean;
  noReposted: boolean;
  specificSound: boolean;
  soundUrl: string;
  videoLength: boolean;
  videoLengthMin: string;
  videoLengthMax: string;
  linkInBio: boolean;
  linkInBioUrl: string;
  specificText: boolean;
  specificTextValue: string;
  quickSubmission: boolean;
  quickSubmissionHours: string;
};

export type RequirementsData = {
  customRequirements: string[];
  videoExamples: string[];
  presets: RequirementsPresets;
};

export type BonusMilestone = {
  name: string;
  amount: string;
  views: string;
};

export type CalculationMethod = "per-post" | "per-cycle";

export type IncentivesData = {
  milestones: BonusMilestone[];
  calculationMethod: CalculationMethod;
};

export type CreatorDetailsData = {
  creatorType: string;
  description: string;
  inviteHandles: string[];
};

export type ChatPlatform = "whatsapp" | "imessage" | "slack";

export type ContactData = {
  email: string;
  phone: string;
  chatPlatform: ChatPlatform | "";
  agreedToTerms: boolean;
};

export type CampaignFlowData = {
  step: CampaignFlowStep;
  model: CampaignModel;
  configuration: ConfigurationData;
  details: DetailsData;
  requirements: RequirementsData;
  incentives: IncentivesData;
  creatorDetails: CreatorDetailsData;
  contact: ContactData;
  updatedAt: number;
};
