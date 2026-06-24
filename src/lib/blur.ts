const toBase64 = (str: string): string =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function blurDataUrl(seed: string): string {
  const base = hash(seed) % 360;
  const c1 = `hsl(${base} 18% 24%)`;
  const c2 = `hsl(${(base + 40) % 360} 16% 14%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="8" height="6" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}
