import { cloneElement, useEffect, useId, useRef, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** Tooltip text/content. */
  content: ReactNode
  /** The trigger element (a single focusable element). */
  children: ReactElement
  /** Which side to show on. Defaults to "top". */
  side?: TooltipSide
  /** Show delay in ms. Defaults to 200. */
  delay?: number
}

const sideClasses: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 mb-2 transform-[translateX(-50%)]',
  bottom: 'top-full left-1/2 mt-2 transform-[translateX(-50%)]',
  left: 'right-full top-1/2 mr-2 transform-[translateY(-50%)]',
  right: 'left-full top-1/2 ml-2 transform-[translateY(-50%)]',
}

/**
 * Tooltip shown on hover/focus of its single child trigger. Opens after `delay`,
 * closes on leave/blur/Escape, and links the trigger to the tooltip via
 * `aria-describedby`. Positioned with `side` relative to the trigger.
 */
export function Tooltip({ content, children, side = 'top', delay = 200 }: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function show() {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), delay)
  }

  function hide() {
    window.clearTimeout(timer.current)
    setOpen(false)
  }

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    'aria-describedby': open ? id : undefined,
  })

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(event) => {
        if (event.key === 'Escape') hide()
      }}
    >
      {trigger}
      {open ? (
        <span
          role="tooltip"
          id={id}
          className={twMerge(
            'pointer-events-none absolute z-50 w-max max-w-xs rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-md dark:bg-zinc-700',
            sideClasses[side],
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  )
}
