import { FeedClient } from "./feed-client";
import { MOCK_COMPETITORS, MOCK_POSTS, MOCK_WORKSPACE } from "@/lib/scope/mock-data";

export default function FeedPage() {
  return (
    <FeedClient
      posts={MOCK_POSTS}
      competitors={MOCK_COMPETITORS}
      workspaceName={MOCK_WORKSPACE.name}
    />
  );
}
