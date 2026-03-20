import type { CampaignFlowData } from "@/types/campaign-flow.types";

const STORAGE_KEY = "campaign_flow_draft";

function getKey(experienceId: string) {
  return `${STORAGE_KEY}_${experienceId}`;
}

export function saveCampaignFlowDraft(
  experienceId: string,
  data: Omit<CampaignFlowData, "updatedAt">,
) {
  if (typeof window === "undefined") return;
  const payload = { ...data, updatedAt: Date.now() };
  localStorage.setItem(getKey(experienceId), JSON.stringify(payload));
}

export function loadCampaignFlowDraft(
  experienceId: string,
): CampaignFlowData | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(getKey(experienceId));
  if (!stored) return null;
  try {
    return JSON.parse(stored) as CampaignFlowData;
  } catch {
    return null;
  }
}

export function clearCampaignFlowDraft(experienceId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getKey(experienceId));
}
