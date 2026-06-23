import { StoriesRail } from "@/features/stories/components/stories-rail";
import { FeedComposer } from "@/features/feed/components/feed-composer";
import { FeedFilterBar } from "@/features/filters/components/feed-filter-bar";
import { FeedList } from "@/features/feed/components/feed-list";

export function FeedView() {
  return (
    <div className="space-y-4">
      <StoriesRail />
      <FeedComposer />
      <FeedFilterBar />
      <FeedList />
    </div>
  );
}
