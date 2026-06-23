import { Flame, MapPin, Users } from "lucide-react";

const GOLD = "text-[#FFD666]";

export function TrendingLocationsIcon() {
  return <MapPin className={`size-4 shrink-0 ${GOLD}`} aria-hidden />;
}

export function HotRequestsIcon() {
  return <Flame className={`size-4 shrink-0 ${GOLD}`} aria-hidden />;
}

export function TopCommunitiesIcon() {
  return <Users className={`size-4 shrink-0 ${GOLD}`} aria-hidden />;
}
