"use client";

import { use } from "react";
import { CampaignDetailsView } from "@/components/campaign-details/CampaignDetailsView";

export default function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CampaignDetailsView campaignId={id} />;
}
