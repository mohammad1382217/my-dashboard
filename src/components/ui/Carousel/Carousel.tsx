import { forwardRef, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface CarouselProps {
  /** The slides. */
  items: ReactNode[]
  /** Controlled active index. Pair with `onValueChange`. */
  value?: number
  /** Uncontrolled initial index. */
  defaultValue?: number
  /** Fires with the next active index. */
  onValueChange?: (index: number) => void
  /** Wrap around at the ends. Defaults to false. */
  loop?: boolean
  /** Enable pointer/touch drag-to-swipe. Defaults to true. */
  draggable?: boolean
  /** Accessible label for the carousel region. */
  label?: string
  /** Merged onto the root element. */
  className?: string
}

const arrowButton =
  'absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm outline-none backdrop-blur transition-[color,background-color,border-color,box-shadow,transform] hover:bg-white focus-visible:ring-2 focus-visible:ring-primary-500/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-0 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-900'

function Chevron({ point, className }: { point: 'left' | 'right'; className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={point === 'right' ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
    </svg>
  )
}

interface DragState {
  pointerId: number
  startX: number
  rtl: boolean
  width: number
  /** Latest drag offset in the track's own (LTR) coordinate space. */
  delta: number
}

/**
 * Horizontal carousel driven by an `items` array. Shows one slide at a time with
 * prev/next buttons, clickable dots, arrow-key navigation and pointer/touch
 * drag-to-swipe.
 *
 * RTL: the slide track stays LTR internally (so `translateX(-index*100%)` always
 * lands on a real slide — never an empty/black gap), and the whole viewport is
 * mirrored with `scaleX(-1)` under `[dir=rtl]` while each slide's content is
 * flipped back. The net effect: slide 0 sits on the right, movement reverses, and
 * the controls/dots/drag all mirror — without the flex-reorder math that can
 * reveal a blank track. Controlled (`value` + `onValueChange`) or uncontrolled.
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { items, value, defaultValue = 0, onValueChange, loop = false, draggable = true, label, className },
  ref,
) {
  const baseId = useId()
  const isControlled = value !== undefined
  const count = items.length
  const [internal, setInternal] = useState(defaultValue)
  const index = Math.min(count - 1, Math.max(0, isControlled ? (value ?? 0) : internal))

  const viewportRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<DragState | null>(null)
  // Live drag offset (px, track-local space); 0 when settled. `dragging` disables the
  // snap transition so the track tracks the finger 1:1.
  const [dragOffset, setDragOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  function go(target: number) {
    const next = loop ? (target + count) % count : Math.max(0, Math.min(count - 1, target))
    if (next === index) return
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    // Mirror arrow keys under RTL: the "forward" key follows the reading direction
    // (Left advances in RTL, Right advances in LTR).
    const rtl = typeof window !== 'undefined' && window.getComputedStyle(event.currentTarget).direction === 'rtl'
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight'
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === forward) {
      event.preventDefault()
      go(index + 1)
    } else if (event.key === backward) {
      event.preventDefault()
      go(index - 1)
    }
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggable || count < 2) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const el = viewportRef.current
    if (!el) return
    const rtl = window.getComputedStyle(el).direction === 'rtl'
    dragState.current = { pointerId: event.pointerId, startX: event.clientX, rtl, width: el.clientWidth, delta: 0 }
    try {
      el.setPointerCapture(event.pointerId)
    } catch {
      /* pointer capture is a nicety; dragging still works without it */
    }
    setDragging(true)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const state = dragState.current
    if (!state || event.pointerId !== state.pointerId) return
    const screenDelta = event.clientX - state.startX
    // Map the screen movement into the track's LTR space (the RTL viewport is mirrored).
    let local = state.rtl ? -screenDelta : screenDelta
    // Rubber-band against a hard edge when not looping.
    if (!loop && ((index === 0 && local > 0) || (index === count - 1 && local < 0))) local *= 0.35
    state.delta = local
    setDragOffset(local)
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const state = dragState.current
    if (!state || event.pointerId !== state.pointerId) return
    const { delta, width } = state
    dragState.current = null
    setDragging(false)
    setDragOffset(0)
    const threshold = Math.max(40, width * 0.2)
    if (delta <= -threshold) go(index + 1)
    else if (delta >= threshold) go(index - 1)
  }

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={twMerge('relative outline-none', className)}
    >
      {/* Viewport is mirrored under RTL; the inner track is forced LTR so the
          transform mechanics stay predictable (and never reveal a blank gap). */}
      <div
        ref={viewportRef}
        onPointerDown={draggable ? onPointerDown : undefined}
        onPointerMove={draggable ? onPointerMove : undefined}
        onPointerUp={draggable ? endDrag : undefined}
        onPointerCancel={draggable ? endDrag : undefined}
        onDragStart={(e) => e.preventDefault()}
        className={twMerge(
          'overflow-hidden rounded-xl border border-slate-200 rtl:transform-[scaleX(-1)] dark:border-zinc-800',
          draggable && count > 1 && 'touch-pan-y select-none',
          draggable && (dragging ? 'cursor-grabbing' : 'cursor-grab'),
        )}
      >
        <div
          dir="ltr"
          className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{
            transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`,
            transition: dragging ? 'none' : undefined,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              role="group"
              id={`${baseId}-slide-${i}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={i !== index}
              // Flip each slide back so its content reads normally inside the mirrored viewport.
              className="w-full shrink-0 rtl:transform-[scaleX(-1)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Logical positioning + RTL-flipped chevrons: "previous" sits at the start
          (right in RTL) and "next" at the end (left in RTL), so the controls mirror
          with the page direction. */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        disabled={!loop && index === 0}
        aria-label="Previous slide"
        className={twMerge(arrowButton, 'start-2')}
      >
        <Chevron point="left" className="rtl:transform-[scaleX(-1)]" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        disabled={!loop && index === count - 1}
        aria-label="Next slide"
        className={twMerge(arrowButton, 'end-2')}
      >
        <Chevron point="right" className="rtl:transform-[scaleX(-1)]" />
      </button>

      {/* Dots follow the page direction so they mirror the slide order (in RTL, dot 0 = rightmost). */}
      <div className="mt-3 flex justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            className={twMerge(
              'h-2 rounded-full transition-all',
              i === index ? 'w-5 bg-primary-600 dark:bg-primary-400' : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-zinc-700 dark:hover:bg-zinc-600',
            )}
          />
        ))}
      </div>
    </div>
  )
})
