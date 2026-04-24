import { RadarClient } from "./radar-client";
import { MOCK_CAMPAIGNS } from "@/lib/scope/mock-data";

export default function RadarPage() {
  return <RadarClient campaigns={MOCK_CAMPAIGNS} />;
}
