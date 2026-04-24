import { SwipeClient } from "./swipe-client";
import { MOCK_BRIEF, MOCK_SWIPE_BOARDS, MOCK_WORKSPACE } from "@/lib/scope/mock-data";

export default function SwipePage() {
  return (
    <SwipeClient
      boards={MOCK_SWIPE_BOARDS}
      workspaceName={MOCK_WORKSPACE.name}
      sampleBrief={MOCK_BRIEF}
    />
  );
}
