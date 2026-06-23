import { primaryTabs } from "@/config/navigation";
import { NavLink } from "@/components/layout/navigation/nav-link";

export function DesktopTabs() {
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {primaryTabs.map((tab) => (
          <li key={tab.href}>
            <NavLink
              href={tab.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
              activeClassName="bg-secondary text-foreground"
              inactiveClassName="text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
