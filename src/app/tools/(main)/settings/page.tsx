import { SettingsClient } from "./settings-client";
import {
  MOCK_ALERT_RULES,
  MOCK_COMPETITORS,
  MOCK_SWIPE_BOARDS,
  MOCK_WORKSPACE,
} from "@/lib/scope/mock-data";

export default function SettingsPage() {
  return (
    <SettingsClient
      workspaceName={MOCK_WORKSPACE.name}
      workspaceCategory={MOCK_WORKSPACE.category}
      brandUrl={MOCK_WORKSPACE.brandUrl}
      competitors={MOCK_COMPETITORS}
      boardCount={MOCK_SWIPE_BOARDS.length}
      ruleCount={MOCK_ALERT_RULES.filter((r) => r.enabled).length}
    />
  );
}
