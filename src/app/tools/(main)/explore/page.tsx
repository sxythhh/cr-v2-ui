import { ExploreClient } from "./explore-client";
import { MOCK_COMPETITORS, MOCK_POSTS } from "@/lib/scope/mock-data";

export default function ExplorePage() {
  return <ExploreClient posts={MOCK_POSTS} competitors={MOCK_COMPETITORS} />;
}
