/**
 * Coordinated micro-interaction presets  reusable Tailwind class strings.
 *
 * Pure CSS transforms/transitions (no JS animation library) so they cost
 * almost nothing on slow 3G, and every preset is gated behind `motion-safe:`
 * so it automatically disables under `prefers-reduced-motion`.
 *
 * Catalogue
 * ─────────
 *  press       tappable controls: springy scale-down on press
 *  pressSoft   large/solid buttons: subtle scale + brightness on hover/press
 *  iconPress   icon buttons: scale up on hover, down on press
 *  hoverLift   cards / clickable surfaces: lift + shadow on hover
 *  hoverScale  media / avatars: gentle zoom on hover
 *  rowHover    list rows: background tint on hover
 *  focusRing   inputs / controls: animated focus ring
 *  inputField  text inputs: border + colour transition on focus
 *  tab         tab triggers: colour transition
 *  appear      mount: fade + slide-in
 *  pop         badges / likes: zoom-in pop on appear
 *  spin        loaders: continuous rotation
 */

export const press =
  "transition-transform duration-150 ease-out motion-safe:active:scale-[0.96]";

export const pressSoft =
  "transition-[transform,filter,background-color] duration-150 ease-out motion-safe:hover:brightness-[1.05] motion-safe:active:scale-[0.98]";

export const iconPress =
  "transition-transform duration-150 ease-out motion-safe:hover:scale-110 motion-safe:active:scale-90";

export const hoverLift =
  "transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-black/20";

export const hoverScale =
  "transition-transform duration-300 ease-out motion-safe:hover:scale-[1.02]";

export const rowHover = "transition-colors duration-150 hover:bg-secondary/50";

export const focusRing =
  "outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

export const inputField =
  "outline-none transition-colors duration-150 focus:border-ring";

export const tab = "transition-colors duration-150";

export const appear =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-300";

export const pop =
  "motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-200";

export const spin = "motion-safe:animate-spin";
