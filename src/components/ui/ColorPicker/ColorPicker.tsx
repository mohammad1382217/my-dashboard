import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ColorPickerProps {
  /** Current colour as `#rrggbb`, or '' for none/transparent. */
  value: string
  /** Fires with the next colour (or '' when cleared). */
  onChange: (value: string) => void
  /** Quick-pick swatches shown under the picker. */
  presets?: string[]
  /** Show a "none / transparent" option. Defaults to false. */
  allowNone?: boolean
  /** Accessible label for the trigger. */
  label?: string
  /** Merged onto the trigger button. */
  className?: string
}

type HSV = { h: number; s: number; v: number }
type Position = { top: number; left?: number; right?: number }

const clamp = (n: number, lo: number, hi: number) => (n < lo ? lo : n > hi ? hi : n)

function hexToRgb(hex: string) {
  const m = /^#?([\da-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const int = parseInt(m[1], 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}
function rgbToHex(r: number, g: number, b: number) {
  const c = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}
function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: max ? d / max : 0, v: max }
}
function hsvToRgb({ h, s, v }: HSV) {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g] = [c, x]
  else if (h < 120) [r, g] = [x, c]
  else if (h < 180) [g, b] = [c, x]
  else if (h < 240) [g, b] = [x, c]
  else if (h < 300) [r, b] = [x, c]
  else [r, b] = [c, x]
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}
const hsvToHex = (hsv: HSV) => {
  const { r, g, b } = hsvToRgb(hsv)
  return rgbToHex(r, g, b)
}
const hexToHsv = (hex: string): HSV | null => {
  const rgb = hexToRgb(hex)
  return rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b) : null
}

const NONE_BG = {
  backgroundColor: '#fff',
  backgroundImage: 'linear-gradient(to top right, transparent calc(50% - 1px), #ef4444, transparent calc(50% + 1px))',
} as const

/**
 * A complete colour picker: a styled trigger swatch that opens a portal popover
 * with a draggable saturation/value square, a hue bar, a hex input and preset
 * swatches (plus an optional "none"). Pointer-driven, keyboard-reachable, RTL-aware
 * positioning, dark-mode aware. Controlled via `value` + `onChange` (#rrggbb / '').
 */
export function ColorPicker({ value, onChange, presets = [], allowNone = false, label, className }: ColorPickerProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(value) ?? { h: 0, s: 0, v: 0 })
  const [hexText, setHexText] = useState(value || '')

  // hsvRef mirrors the live HSV so a pointer drag always merges onto the latest value
  // (it's only ever written inside event handlers, never during render).
  const hsvRef = useRef(hsv)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  function setColor(next: HSV, hex: string) {
    hsvRef.current = next
    setHsv(next)
    setHexText(hex)
  }

  function commit(next: Partial<HSV>) {
    const merged = { ...hsvRef.current, ...next }
    const hex = hsvToHex(merged)
    setColor(merged, hex)
    onChange(hex)
  }

  function computePosition(): Position | null {
    const node = triggerRef.current
    if (!node) return null
    const rect = node.getBoundingClientRect()
    const rtl = getComputedStyle(node).direction === 'rtl'
    return rtl
      ? { top: rect.bottom + 6, right: Math.max(8, window.innerWidth - rect.right) }
      : { top: rect.bottom + 6, left: Math.max(8, rect.left) }
  }

  function toggle() {
    if (open) {
      setOpen(false)
      return
    }
    const seed = hexToHsv(value)
    if (seed) setColor(seed, value)
    else setHexText(value || '')
    setPosition(computePosition())
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) return
      setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    function reposition() {
      setPosition(computePosition())
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open])

  /** Track a pointer drag over `el`, reporting 0–1 fractions. */
  function drag(el: HTMLElement | null, event: ReactPointerEvent, onMove: (fx: number, fy: number) => void) {
    if (!el) return
    const apply = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      onMove(clamp((clientX - rect.left) / rect.width, 0, 1), clamp((clientY - rect.top) / rect.height, 0, 1))
    }
    apply(event.clientX, event.clientY)
    const move = (e: PointerEvent) => apply(e.clientX, e.clientY)
    const up = () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', up)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', up)
  }

  const hueColor = `hsl(${Math.round(hsv.h)}, 100%, 50%)`
  const swatchStyle = value ? { backgroundColor: value } : NONE_BG

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className={twMerge(
          'flex w-full select-none items-center gap-2 rounded-lg border border-black/10 bg-white/60 px-2 py-1.5 text-start outline-none transition-[color,background-color,border-color,box-shadow] hover:border-black/20 focus-visible:ring-2 focus-visible:ring-primary-500/40 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20',
          className,
        )}
      >
        <span className="size-4 shrink-0 rounded border border-black/10 dark:border-white/20" style={swatchStyle} />
        <span className="flex-1 truncate font-mono text-[11px] uppercase text-muted">{value || 'none'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={twMerge('shrink-0 text-zinc-400 transition-transform', open && 'transform-[rotate(180deg)]')}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && position
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-label={label ?? 'Color picker'}
              style={{ top: position.top, left: position.left, right: position.right }}
              className="fixed z-50 w-56 select-none rounded-xl border border-slate-200 bg-white p-3 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/10"
            >
              {/* Saturation / value square */}
              <div
                ref={svRef}
                onPointerDown={(e) => drag(svRef.current, e, (fx, fy) => commit({ s: fx, v: 1 - fy }))}
                className="relative h-36 w-full cursor-crosshair touch-none rounded-lg"
                style={{ backgroundColor: hueColor, backgroundImage: 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)' }}
              >
                <span
                  className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-black/25"
                  style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, backgroundColor: hsvToHex(hsv) }}
                />
              </div>

              {/* Hue bar */}
              <div
                ref={hueRef}
                onPointerDown={(e) => drag(hueRef.current, e, (fx) => commit({ h: fx * 360 }))}
                className="relative mt-3 h-3 w-full cursor-pointer touch-none rounded-full"
                style={{ backgroundImage: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
              >
                <span
                  className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-black/25"
                  style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: hueColor }}
                />
              </div>

              {/* Hex input + none */}
              <div className="mt-3 flex items-center gap-2">
                <span className="size-7 shrink-0 rounded-md border border-black/10 dark:border-white/20" style={swatchStyle} />
                <input
                  id={`${id}-hex`}
                  value={hexText}
                  onChange={(e) => {
                    const text = e.target.value
                    setHexText(text)
                    const next = hexToHsv(text)
                    if (next) {
                      const hex = `#${text.replace(/^#/, '').toLowerCase()}`
                      hsvRef.current = next
                      setHsv(next)
                      onChange(hex)
                    }
                  }}
                  placeholder="#6366f1"
                  spellCheck={false}
                  className="h-8 w-full min-w-0 select-text rounded-md border border-slate-300 bg-white px-2 font-mono text-xs uppercase text-slate-900 outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
                {allowNone ? (
                  <button
                    type="button"
                    title="none"
                    aria-label="none"
                    onClick={() => {
                      setHexText('')
                      onChange('')
                    }}
                    className="size-8 shrink-0 rounded-md border border-black/10 transition-transform hover:scale-105 dark:border-white/15"
                    style={NONE_BG}
                  />
                ) : null}
              </div>

              {/* Presets */}
              {presets.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-200 pt-3 dark:border-zinc-800">
                  {presets.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      title={swatch}
                      onClick={() => {
                        const next = hexToHsv(swatch)
                        if (next) setColor(next, swatch)
                        else setHexText(swatch)
                        onChange(swatch)
                      }}
                      style={{ backgroundColor: swatch }}
                      className={twMerge(
                        'size-5 rounded-md border border-black/10 transition-transform hover:scale-110 dark:border-white/15',
                        value.toLowerCase() === swatch.toLowerCase() && 'ring-2 ring-primary-500 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900',
                      )}
                    />
                  ))}
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
