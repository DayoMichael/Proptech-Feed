import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { NotificationsView } from "@/features/notifications/views/notifications-view";

export const metadata: Metadata = pageMetadata({
  title: "Notifications",
  description: "Your activity and alerts on Expert Listing.",
  path: "/notifications",
  index: false,
});

export default function Page() {
  return <NotificationsView />;
}
