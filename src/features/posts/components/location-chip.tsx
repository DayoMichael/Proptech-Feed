import { MapPin } from "lucide-react";

export function LocationChip({ location }: { location: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <MapPin className="size-3.5 shrink-0" aria-hidden />
      {location}
    </span>
  );
}
