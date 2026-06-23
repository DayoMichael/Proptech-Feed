import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { ConversationList } from "@/features/messages/views/conversation-list";

export const metadata: Metadata = pageMetadata({
  title: "Messages",
  description: "Your conversations on Expert Listing.",
  path: "/messages",
  index: false,
});

export default function Page() {
  return <ConversationList />;
}
