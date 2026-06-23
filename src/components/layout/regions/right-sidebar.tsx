import {
  HotRequestsIcon,
  TopCommunitiesIcon,
  TrendingLocationsIcon,
} from "@/components/widget-icons";

const TRENDING = [
  { name: "Lekki Phase 1, Lagos", posts: "1.2k posts today" },
  { name: "Abuja Rentals", posts: "860 posts today" },
  { name: "Ikoyi, Lagos", posts: "540 posts today" },
];

const HOT_REQUESTS = [
  { tag: "Buy", title: "3-bed in Lekki Phase 1", meta: "₦80M · 12 responses" },
  { tag: "Rent", title: "2-bed serviced in Ikeja", meta: "₦4.5M/yr · 7 responses" },
];

const COMMUNITIES = [
  { name: "Lekki Landlords", members: "12.4k members" },
  { name: "Abuja Developers", members: "5.6k members" },
  { name: "House Hunting Lagos", members: "9.1k members" },
];

function WidgetCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function RightSidebar() {
  return (
    <aside
      aria-label="Discover"
      className="hidden w-80 shrink-0 xl:block"
    >
      <div className="sticky top-18 space-y-4">
        <WidgetCard title="Trending Locations" icon={<TrendingLocationsIcon />}>
          <ul className="space-y-3">
            {TRENDING.map((item) => (
              <li key={item.name}>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.posts}</p>
              </li>
            ))}
          </ul>
        </WidgetCard>

        <WidgetCard title="Hot Requests" icon={<HotRequestsIcon />}>
          <ul className="space-y-3">
            {HOT_REQUESTS.map((item) => (
              <li key={item.title} className="space-y-1">
                <span className="inline-block rounded-full bg-chip-sale px-2 py-0.5 text-xs font-medium text-chip-sale-foreground">
                  {item.tag}
                </span>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.meta}</p>
              </li>
            ))}
          </ul>
        </WidgetCard>

        <WidgetCard title="Top Communities" icon={<TopCommunitiesIcon />}>
          <ul className="space-y-3">
            {COMMUNITIES.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.members}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Join
                </button>
              </li>
            ))}
          </ul>
        </WidgetCard>
      </div>
    </aside>
  );
}
