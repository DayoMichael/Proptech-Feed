// Client-side entry point for the compression worker.
//
// One lazily-spawned worker is shared across all uploads; requests are matched
// to responses by id over a small pending map. If the platform lacks Workers or
// OffscreenCanvas, we degrade gracefully to the original file so uploads never
// break — the optimisation is additive, never load-bearing.

export interface CompressResult {
  url: string;
  width: number;
  height: number;
  bytesBefore: number;
  bytesAfter: number;
}

const MAX_DIMENSION = 1600;
const QUALITY = 0.72;

interface WorkerResponse {
  id: number;
  blob?: Blob;
  width?: number;
  height?: number;
  error?: string;
}

let worker: Worker | null = null;
let reqSeq = 0;
const pending = new Map<number, (response: WorkerResponse) => void>();

function flushPending(error: string) {
  pending.forEach((resolve, id) => resolve({ id, error }));
  pending.clear();
}

function getWorker(): Worker | null {
  if (typeof window === "undefined") return null;
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") {
    return null;
  }
  if (!worker) {
    try {
      worker = new Worker(new URL("./compress.worker.ts", import.meta.url), {
        type: "module",
      });
      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const resolve = pending.get(event.data.id);
        if (resolve) {
          pending.delete(event.data.id);
          resolve(event.data);
        }
      };
      // If the worker fails to load or crashes, don't leave callers hanging —
      // resolve everything in flight so they fall back to the original file.
      worker.onerror = () => flushPending("worker error");
      worker.onmessageerror = () => flushPending("worker message error");
    } catch {
      worker = null;
    }
  }
  return worker;
}

/** Read intrinsic dimensions without the worker (fallback path). */
function probe(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 16, height: 9 });
    img.src = url;
  });
}

async function passthrough(file: File): Promise<CompressResult> {
  const url = URL.createObjectURL(file);
  const { width, height } = await probe(url);
  return { url, width, height, bytesBefore: file.size, bytesAfter: file.size };
}

/**
 * Downscale + re-encode an image to web-sized WebP on a worker thread.
 * Returns an object URL for the (usually much smaller) result.
 */
export async function compressImage(file: File): Promise<CompressResult> {
  let w: Worker | null = null;
  try {
    w = getWorker();
  } catch {
    w = null;
  }
  if (!w) return passthrough(file);

  const id = ++reqSeq;
  let data: WorkerResponse;
  try {
    data = await new Promise<WorkerResponse>((resolve) => {
      pending.set(id, resolve);
      w!.postMessage({
        id,
        blob: file,
        maxDimension: MAX_DIMENSION,
        quality: QUALITY,
      });
    });
  } catch {
    pending.delete(id);
    return passthrough(file);
  }

  if (data.error || !data.blob || data.width == null || data.height == null) {
    return passthrough(file);
  }

  return {
    url: URL.createObjectURL(data.blob),
    width: data.width,
    height: data.height,
    bytesBefore: file.size,
    bytesAfter: data.blob.size,
  };
}
