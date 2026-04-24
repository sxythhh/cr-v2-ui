import { CompetitorsClient } from "./competitors-client";
import { MOCK_COMPETITORS, MOCK_WORKSPACE } from "@/lib/scope/mock-data";

export default function CompetitorsPage() {
  return <CompetitorsClient competitors={MOCK_COMPETITORS} workspaceName={MOCK_WORKSPACE.name} />;
}
