/**
 * Off-main-thread WebP encoder for <ImageCompressor>. Decodes each file with
 * `createImageBitmap`, draws it (optionally downscaled) onto an `OffscreenCanvas`
 * and re-encodes to WebP — so a big batch never freezes the UI. The component
 * falls back to main-thread encoding where OffscreenCanvas/Worker aren't available.
 */
interface EncodeRequest {
  id: number
  file: File
  quality: number
  maxWidth: number
}

// `self` is the worker global; cast to a minimal shape so we don't need the
// webworker TS lib (which conflicts with the DOM lib used app-wide).
const ctx = self as unknown as { postMessage(message: unknown): void }

self.onmessage = async (event: MessageEvent) => {
  const { id, file, quality, maxWidth } = event.data as EncodeRequest
  try {
    const bitmap = await createImageBitmap(file)
    let width = bitmap.width
    let height = bitmap.height
    if (maxWidth > 0 && width > maxWidth) {
      height = Math.round((height * maxWidth) / width)
      width = maxWidth
    }
    const canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas 2D context unavailable')
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()
    const blob = await canvas.convertToBlob({ type: 'image/webp', quality })
    ctx.postMessage({ id, blob, width, height })
  } catch (error) {
    ctx.postMessage({ id, error: error instanceof Error ? error.message : String(error) })
  }
}
