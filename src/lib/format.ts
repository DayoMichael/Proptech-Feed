const UNITS: [limitSeconds: number, divisor: number, suffix: string][] = [
  [60, 1, "s"],
  [3600, 60, "m"],
  [86400, 3600, "h"],
  [604800, 86400, "d"],
  [2629800, 604800, "w"],
  [31557600, 2629800, "mo"],
];

export function relativeTime(iso: string, now: number = Date.now()): string {
  const seconds = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (seconds < 45) return "Just Now";

  for (const [limit, divisor, suffix] of UNITS) {
    if (seconds < limit) return `${Math.floor(seconds / divisor)}${suffix}`;
  }
  return `${Math.floor(seconds / 31557600)}y`;
}

export function compactNumber(value: number): string {
  if (value < 1000) return String(value);
  if (value < 1_000_000) return trim(value / 1000) + "k";
  return trim(value / 1_000_000) + "m";
}

function trim(n: number): string {
  return n.toFixed(1).replace(/\.0$/, "");
}
