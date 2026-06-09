import { forwardRef, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ResizableProps {
  /** Split direction. "horizontal" = side-by-side, "vertical" = stacked. Defaults to "horizontal". */
  orientation?: 'horizontal' | 'vertical'
  /** First panel. */
  first: ReactNode
  /** Second panel. */
  second: ReactNode
  /** Controlled size of the first panel, in %. */
  size?: number
  /** Uncontrolled initial size of the first panel, in %. Defaults to 50. */
  defaultSize?: number
  /** Fires with the next size (%) while dragging. */
  onSizeChange?: (size: number) => void
  /** Minimum first-panel size, %. Defaults to 10. */
  minSize?: number
  /** Maximum first-panel size, %. Defaults to 90. */
  maxSize?: number
  /** Keyboard step, %. Defaults to 4. */
  step?: number
  /** Accessible label for the drag handle. Defaults to "Resize". */
  handleLabel?: string
  /** Merged onto the container. */
  className?: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Two panels split by a draggable handle. Drag (pointer) or use the arrow keys
 * on the focused handle to resize; the split is RTL-aware in horizontal mode.
 * Controlled via `size` + `onSizeChange` or uncontrolled via `defaultSize`. The
 * handle is a `role="separator"` with `aria-valuenow/min/max`.
 */
export const Resizable = forwardRef<HTMLDivElement, ResizableProps>(function Resizable(
  { orientation = 'horizontal', first, second, size, defaultSize = 50, onSizeChange, minSize = 10, maxSize = 90, step = 4, handleLabel = 'Resize', className },
  ref,
) {
  const isControlled = size !== undefined
  const [internal, setInternal] = useState(defaultSize)
  const current = clamp(isControlled ? size : internal, minSize, maxSize)

  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  function update(next: number) {
    const clamped = clamp(next, minSize, maxSize)
    if (!isControlled) setInternal(clamped)
    onSizeChange?.(clamped)
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    let pct: number
    if (orientation === 'horizontal') {
      const rtl = getComputedStyle(container).direction === 'rtl'
      pct = rtl ? ((rect.right - event.clientX) / rect.width) * 100 : ((event.clientX - rect.left) / rect.width) * 100
    } else {
      pct = ((event.clientY - rect.top) / rect.height) * 100
    }
    update(pct)
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId)
    setDragging(false)
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const dec = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
    const inc = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
    if (event.key === dec) {
      event.preventDefault()
      update(current - step)
    } else if (event.key === inc) {
      event.preventDefault()
      update(current + step)
    } else if (event.key === 'Home') {
      event.preventDefault()
      update(minSize)
    } else if (event.key === 'End') {
      event.preventDefault()
      update(maxSize)
    }
  }

  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      ref={(node) => {
        containerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      className={twMerge('flex overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-800', isHorizontal ? 'flex-row' : 'flex-col', className)}
    >
      <div style={{ flexBasis: `${current}%` }} className="min-h-0 min-w-0 grow-0 shrink-0 overflow-auto">
        {first}
      </div>

      <div
        role="separator"
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(current)}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        aria-label={handleLabel}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        className={twMerge(
          'group relative flex shrink-0 items-center justify-center bg-slate-200 outline-none transition-colors hover:bg-indigo-400 focus-visible:bg-indigo-500 dark:bg-zinc-800 dark:hover:bg-indigo-500',
          isHorizontal ? 'w-1.5 cursor-col-resize' : 'h-1.5 cursor-row-resize',
          dragging ? 'bg-indigo-500 dark:bg-indigo-500' : null,
        )}
      >
        <span className={twMerge('rounded-full bg-white/70 dark:bg-zinc-500', isHorizontal ? 'h-6 w-0.5' : 'h-0.5 w-6')} />
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto">{second}</div>
    </div>
  )
})
