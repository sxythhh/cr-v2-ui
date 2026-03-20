import { Suspense } from "react";
import { CreateCampaignContent } from "./CreateCampaignContent";

export default function CreateCampaignPage() {
  return (
    <Suspense>
      <CreateCampaignContent />
    </Suspense>
  );
}
