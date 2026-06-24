import {
  Bell,
  Bookmark,
  Home,
  LayoutGrid,
  Mail,
  Rocket,
  Search,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const primaryTabs: NavItem[] = [
  { label: "Feed", href: "/", icon: Home },
  { label: "Rent", href: "/rent", icon: Home },
  { label: "Buy", href: "/buy", icon: Home },
  { label: "Snagging", href: "/snagging", icon: Home },
  { label: "Shortlets", href: "/shortlets", icon: Home },
  { label: "Find Professionals", href: "/professionals", icon: Home },
];

export const sidebarNav: NavItem[] = [
  { label: "Messages", href: "/messages", icon: Mail },
  { label: "My Boosts", href: "/boosts", icon: Rocket },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "Communities", href: "/communities", icon: Users },
];

export const bottomNav: NavItem[] = [
  { label: "Feed", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "List", href: "/list", icon: LayoutGrid },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: User },
];

const PROTECTED_ROUTES = new Set([
  "/search",
  "/messages",
  "/boosts",
  "/saved",
  "/communities",
  "/notifications",
  "/profile",
  "/list",
  "/create",
]);

export const isProtectedRoute = (href: string) => PROTECTED_ROUTES.has(href);
