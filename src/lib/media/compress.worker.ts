
interface CompressRequest {
  id: number;
  blob: Blob;
  maxDimension: number;
  quality: number;
}

interface CompressResponse {
  id: number;
  blob?: Blob;
  width?: number;
  height?: number;
  error?: string;
}

interface WorkerScope {
  onmessage: ((event: MessageEvent<CompressRequest>) => void) | null;
  postMessage(message: CompressResponse): void;
}

const ctx = self as unknown as WorkerScope;

ctx.onmessage = async (event) => {
  const { id, blob, maxDimension, quality } = event.data;
  try {
    const bitmap = await createImageBitmap(blob, {
      imageOrientation: "from-image",
    });
    const scale = Math.min(
      1,
      maxDimension / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("OffscreenCanvas 2d context unavailable");
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const out = await canvas.convertToBlob({ type: "image/webp", quality });
    ctx.postMessage({ id, blob: out, width, height });
  } catch (err) {
    ctx.postMessage({ id, error: String(err) });
  }
};
