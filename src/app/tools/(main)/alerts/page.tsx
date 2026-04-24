import { AlertsClient } from "./alerts-client";
import { MOCK_ALERTS, MOCK_ALERT_RULES } from "@/lib/scope/mock-data";

export default function AlertsPage() {
  return <AlertsClient alerts={MOCK_ALERTS} rules={MOCK_ALERT_RULES} />;
}
