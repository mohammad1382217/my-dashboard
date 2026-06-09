import { forwardRef, useId, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
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
  /** Accessible label for the carousel region. */
  label?: string
  /** Merged onto the root element. */
  className?: string
}

const arrowButton =
  'absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white disabled:pointer-events-none disabled:opacity-0 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-900'

function Chevron({ point }: { point: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={point === 'right' ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
    </svg>
  )
}

/**
 * Horizontal carousel driven by an `items` array. Shows one slide at a time with
 * prev/next buttons, clickable dots and arrow-key navigation. The slide track is
 * LTR for predictable mechanics (prev = left, next = right), while each slide's
 * own content still follows the page direction. Controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`); `loop` wraps at the ends.
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { items, value, defaultValue = 0, onValueChange, loop = false, label, className },
  ref,
) {
  const baseId = useId()
  const isControlled = value !== undefined
  const count = items.length
  const [internal, setInternal] = useState(defaultValue)
  const index = Math.min(count - 1, Math.max(0, isControlled ? (value ?? 0) : internal))

  function go(target: number) {
    const next = loop ? (target + count) % count : Math.max(0, Math.min(count - 1, target))
    if (next === index) return
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1)
    }
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
      <div dir="ltr" className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800">
        <div
          className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              role="group"
              id={`${baseId}-slide-${i}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={i !== index}
              className="w-full shrink-0"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        disabled={!loop && index === 0}
        aria-label="Previous slide"
        className={twMerge(arrowButton, 'left-2')}
      >
        <Chevron point="left" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        disabled={!loop && index === count - 1}
        aria-label="Next slide"
        className={twMerge(arrowButton, 'right-2')}
      >
        <Chevron point="right" />
      </button>

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
              i === index ? 'w-5 bg-indigo-600 dark:bg-indigo-400' : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-zinc-700 dark:hover:bg-zinc-600',
            )}
          />
        ))}
      </div>
    </div>
  )
})
