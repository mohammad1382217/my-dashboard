import { useEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, DragEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export interface CompressorLabels {
  drop: string
  hint: string
  browse: string
  quality: string
  maxWidth: string
  original: string
  keep: string
  download: string
  downloadAll: string
  clear: string
  saved: string
  images: string
  working: string
}

const DEFAULT_LABELS: CompressorLabels = {
  drop: 'Drop images here',
  hint: 'PNG, JPG, GIF — compressed to WebP, in your browser',
  browse: 'Choose files',
  quality: 'Quality',
  maxWidth: 'Max width',
  original: 'Total saved',
  keep: 'original',
  download: 'Download',
  downloadAll: 'Download all',
  clear: 'Clear',
  saved: 'saved',
  images: 'images',
  working: 'Compressing…',
}

export interface ImageCompressorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** UI strings (defaults to English). */
  labels?: Partial<CompressorLabels>
  /** Initial WebP quality, 0–1. Defaults to 0.8. */
  defaultQuality?: number
}

interface CompressedImage {
  id: string
  /** Output filename (.webp). */
  name: string
  /** The source file (kept so we can re-encode when settings change). */
  file: File
  originalSize: number
  size: number
  url: string
  width: number
  height: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** Re-encode a file to WebP via a canvas, optionally downscaling to `maxWidth`. */
async function encodeWebP(file: File, quality: number, maxWidth: number): Promise<{ blob: Blob; width: number; height: number }> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    let width = img.naturalWidth
    let height = img.naturalHeight
    if (maxWidth > 0 && width > maxWidth) {
      height = Math.round((height * maxWidth) / width)
      width = maxWidth
    }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')
    ctx.drawImage(img, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
    if (!blob) throw new Error('WebP encoding failed')
    return { blob, width, height }
  } finally {
    URL.revokeObjectURL(url)
  }
}

function triggerDownload(url: string, filename: string) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

/**
 * A dependency-free, client-side image → WebP compressor (à la TinyPNG). Drop or
 * pick many images at once; each is re-encoded to WebP on a canvas with an
 * adjustable quality and optional max-width. Nothing is uploaded — it all runs
 * in the browser. Shows the per-file and total size saved, with per-file and
 * bulk downloads.
 */
export function ImageCompressor({ labels, defaultQuality = 0.8, className, ...props }: ImageCompressorProps) {
  const t = { ...DEFAULT_LABELS, ...labels }
  const [files, setFiles] = useState<File[]>([])
  const [quality, setQuality] = useState(defaultQuality)
  const [maxWidth, setMaxWidth] = useState(0)
  const [items, setItems] = useState<CompressedImage[]>([])
  const [busy, setBusy] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const genRef = useRef(0)
  const itemsRef = useRef<CompressedImage[]>([])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // Revoke any outstanding object URLs when the tool unmounts.
  useEffect(() => () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url)), [])

  // (Re)encode every file whenever the set of files or the settings change.
  useEffect(() => {
    const gen = ++genRef.current
    const timer = setTimeout(async () => {
      if (files.length === 0) {
        setItems((prev) => {
          prev.forEach((p) => URL.revokeObjectURL(p.url))
          return []
        })
        return
      }
      setBusy(true)
      const results: CompressedImage[] = []
      for (const file of files) {
        try {
          const { blob, width, height } = await encodeWebP(file, quality, maxWidth)
          if (gen !== genRef.current) {
            results.forEach((r) => URL.revokeObjectURL(r.url))
            return
          }
          results.push({
            id: `${file.name}-${file.size}-${results.length}`,
            name: file.name.replace(/\.[^.]+$/, '') + '.webp',
            file,
            originalSize: file.size,
            size: blob.size,
            url: URL.createObjectURL(blob),
            width,
            height,
          })
        } catch {
          /* skip files the browser can't decode */
        }
      }
      if (gen !== genRef.current) {
        results.forEach((r) => URL.revokeObjectURL(r.url))
        return
      }
      setItems((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url))
        return results
      })
      setBusy(false)
    }, files.length === 0 ? 0 : 250)
    return () => clearTimeout(timer)
  }, [files, quality, maxWidth])

  function addFiles(list: FileList | null) {
    if (!list) return
    const incoming = Array.from(list).filter((f) => f.type.startsWith('image/'))
    if (incoming.length) setFiles((prev) => [...prev, ...incoming])
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragOver(false)
    addFiles(event.dataTransfer.files)
  }

  const totalOriginal = items.reduce((sum, i) => sum + i.originalSize, 0)
  const totalCompressed = items.reduce((sum, i) => sum + i.size, 0)
  const totalSaved = totalOriginal - totalCompressed
  const savedPercent = totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0

  return (
    <div className={twMerge('flex flex-col gap-4', className)} {...props}>
      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={twMerge(
          'flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
          dragOver ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-300 bg-slate-50/60 dark:border-zinc-700 dark:bg-white/5',
        )}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-indigo-500">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m17 8-5-5-5 5" />
          <path d="M12 3v12" />
        </svg>
        <p className="text-sm font-medium text-slate-800 dark:text-zinc-100">{t.drop}</p>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{t.hint}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          {t.browse}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>

      {/* Settings */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 sm:grid-cols-2 dark:border-white/10 dark:bg-zinc-900/50">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center justify-between text-slate-700 dark:text-zinc-200">
            <span className="font-medium">{t.quality}</span>
            <span className="font-mono text-xs text-slate-400">{Math.round(quality * 100)}%</span>
          </span>
          <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="accent-indigo-600" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700 dark:text-zinc-200">{t.maxWidth}</span>
          <input
            type="number"
            min={0}
            step={100}
            value={maxWidth || ''}
            placeholder={t.keep}
            onChange={(e) => setMaxWidth(Math.max(0, Number(e.target.value) || 0))}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
      </div>

      {/* Summary */}
      {items.length > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {items.length} {t.images}
            </span>
            <span className="text-emerald-600/70 dark:text-emerald-400/70">·</span>
            <span className="text-emerald-700 dark:text-emerald-300">
              {t.original}: <span className="font-semibold">{formatBytes(totalSaved)}</span> ({savedPercent}% {t.saved})
            </span>
            {busy ? <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">· {t.working}</span> : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => items.forEach((item, i) => setTimeout(() => triggerDownload(item.url, item.name), i * 150))}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
            >
              {t.downloadAll}
            </button>
            <button
              type="button"
              onClick={() => setFiles([])}
              className="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
            >
              {t.clear}
            </button>
          </div>
        </div>
      ) : null}

      {/* Results */}
      {items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const pct = item.originalSize > 0 ? Math.round(((item.originalSize - item.size) / item.originalSize) * 100) : 0
            return (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900/60">
                <img src={item.url} alt={item.name} className="size-14 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-white/10" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-slate-800 dark:text-zinc-100">{item.name}</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">
                    {item.width}×{item.height} · {formatBytes(item.originalSize)} → <span className="font-medium text-slate-700 dark:text-zinc-200">{formatBytes(item.size)}</span>
                  </span>
                  <span className={twMerge('mt-0.5 inline-flex w-fit rounded-full px-1.5 py-0.5 text-[10px] font-semibold', pct >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300')}>
                    {pct >= 0 ? `−${pct}%` : `+${-pct}%`}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => triggerDownload(item.url, item.name)}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
                  >
                    {t.download}
                  </button>
                  <button
                    type="button"
                    aria-label="remove"
                    onClick={() => setFiles((prev) => prev.filter((f) => f !== item.file))}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 dark:border-white/10 dark:hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
