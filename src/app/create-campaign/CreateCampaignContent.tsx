"use client";

import { useSearchParams } from "next/navigation";
import { CampaignFlowView } from "@/components/campaign-flow/CampaignFlowView";
import type { CampaignModel, CampaignFlowData } from "@/types/campaign-flow.types";

const VALID_MODELS = new Set<CampaignModel>(["cpm", "retainer", "per-video"]);

/* ── Mock data for edit mode ─────────────────────────────────────────── */
const MOCK_CAMPAIGNS: Record<string, { model: CampaignModel; data: Omit<CampaignFlowData, "step" | "model" | "updatedAt"> }> = {
  "7434": {
    model: "retainer",
    data: {
      configuration: {
        budget: "10000",
        contractLength: "6",
        expectedPostsEnabled: true,
        expectedPostsPerMonth: "8",
        maxPayout: "500",
        payoutFrequency: "monthly",
        perPlatform: false,
        platformRewards: {},
        requireApplication: true,
        rewardPer1000Views: "5",
        selectedPlatforms: ["tiktok", "instagram", "youtube"],
      },
      details: {
        category: "Personal brand",
        description:
          "We're looking for talented creators to produce engaging clipping content from our latest podcast episode featuring Harry Styles and Shania Twain. Clips should highlight memorable moments, funny exchanges, and quotable lines that will resonate with audiences on social media.",
        endDate: "",
        name: "Harry Styles Podcast x Shania Twain Clipping",
        ongoing: true,
        startDate: "2024-06-01",
        thumbnailFile: null,
        thumbnailName: "",
        thumbnailPreview: null,
        type: "Clipping",
      },
      requirements: {
        customRequirements: [
          "1+ years experience creating short-form content",
          "English-speaking",
          "10,000+ followers on primary platform",
        ],
        presets: {
          brandLogo: false,
          faceOnCamera: true,
          linkInBio: false,
          linkInBioUrl: "",
          noReposted: false,
          quickSubmission: false,
          quickSubmissionHours: "",
          soundUrl: "",
          specificSound: true,
          specificText: true,
          specificTextValue: "Brand name",
          videoLength: true,
          videoLengthMax: "",
          videoLengthMin: "17",
        },
        videoExamples: [],
      },
      incentives: {
        calculationMethod: "per-post",
        milestones: [],
      },
      creatorDetails: {
        creatorType: "Clipping",
        description: "Creators who specialize in podcast/interview clipping for short-form social.",
        inviteHandles: [],
      },
      contact: {
        agreedToTerms: true,
        chatPlatform: "slack",
        email: "vlad@outpacestudios.com",
        phone: "",
      },
    },
  },
};

export function CreateCampaignContent() {
  const searchParams = useSearchParams();
  const rawModel = searchParams.get("model");
  const editId = searchParams.get("edit");

  const editCampaign = editId ? MOCK_CAMPAIGNS[editId] : undefined;

  const model: CampaignModel = editCampaign
    ? editCampaign.model
    : rawModel && VALID_MODELS.has(rawModel as CampaignModel)
      ? (rawModel as CampaignModel)
      : "cpm";

  return (
    <CampaignFlowView
      model={model}
      editMode={!!editCampaign}
      initialData={editCampaign?.data}
    />
  );
}
