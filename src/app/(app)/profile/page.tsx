import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { ProfileView } from "@/features/profile/views/profile-view";

export const metadata: Metadata = pageMetadata({
  title: "Your profile",
  description: "Your profile, posts and saved listings on Expert Listing.",
  path: "/profile",
  index: false,
});

export default function Page() {
  return <ProfileView />;
}
