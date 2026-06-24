import { ChevronDown } from "lucide-react";

import { primaryTabs } from "@/config/navigation";
import { NavLink } from "@/components/layout/navigation/nav-link";

export function DesktopTabs() {
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-6">
        {primaryTabs.map((tab) => (
          <li key={tab.href}>
            <NavLink
              href={tab.href}
              className="flex items-center gap-1 border-b-2 border-transparent pb-1 text-sm font-medium transition-colors"
              activeClassName="border-foreground text-foreground"
              inactiveClassName="text-muted-foreground hover:text-foreground"
            >
              {tab.label}
              {tab.hasMenu && (
                <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
