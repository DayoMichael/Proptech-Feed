import { cn } from "@/lib/utils";

/** Icon-only glyph from the Expert Listing logo, for square/badge contexts. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      role="img"
      aria-hidden
      className={cn("shrink-0", className)}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.40626 0.836728L2.30409 2.9389L14.8466 15.4814L16.9488 13.3793L4.40626 0.836728Z" />
      <path d="M8.93465 6.74747L1.43563 14.2465L3.5378 16.3487L11.0368 8.84964L8.93465 6.74747Z" />
      <path d="M9.48365 6.5745H0V9.54745H9.48365V6.5745Z" />
      <path d="M11.23 8.32079H8.25702V17.8044H11.23V8.32079Z" />
      <path d="M8.83249 3.21218H12.256C13.4042 3.21218 14.5046 2.75633 15.3166 1.94432L15.8416 2.46927C15.0296 3.28128 14.5737 4.38168 14.5737 5.52993V8.9534L17.7739 12.1536V0.0106468H5.63096L8.83249 3.21218Z" />
    </svg>
  );
}
