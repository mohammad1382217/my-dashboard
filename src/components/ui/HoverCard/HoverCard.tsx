import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface HoverCardProps {
  /** The element users hover/focus to open the card. */
  trigger: ReactNode
  /** Rich floating content. */
  children: ReactNode
  /** Delay before opening, ms. Defaults to 300. */
  openDelay?: number
  /** Delay before closing, ms — lets the pointer travel to the card. Defaults to 150. */
  closeDelay?: number
  /** Horizontal alignment relative to the trigger. Defaults to "center". */
  align?: 'start' | 'center' | 'end'
  /** Merged onto the floating panel. */
  contentClassName?: string
}

type Position = { top: number; left: number }

/**
 * A hover/focus-triggered card for previewing rich content (a profile, a link
 * preview). Opens after `openDelay`, and a `closeDelay` lets the pointer cross
 * the gap into the card without it closing. Portal-rendered and pointer-driven,
 * so it's supplementary — keep essential info elsewhere too.
 */
export function HoverCard({ trigger, children, openDelay = 300, closeDelay = 150, align = 'center', contentClassName }: HoverCardProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const timer = useRef<number | undefined>(undefined)

  function computePosition(): Position | null {
    const node = triggerRef.current
    if (!node) return null
    const rect = node.getBoundingClientRect()
    const top = rect.bottom + 8
    if (align === 'start') return { top, left: rect.left }
    if (align === 'end') return { top, left: rect.right }
    return { top, left: rect.left + rect.width / 2 }
  }

  function scheduleOpen() {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setPosition(computePosition())
      setOpen(true)
    }, openDelay)
  }

  function scheduleClose() {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(false), closeDelay)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const translate = align === 'center' ? 'transform-[translateX(-50%)]' : align === 'end' ? 'transform-[translateX(-100%)] rtl:transform-[translateX(0)]' : 'rtl:transform-[translateX(-100%)]'

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        aria-describedby={open ? `${id}-content` : undefined}
        onMouseEnter={scheduleOpen}
        onMouseLeave={scheduleClose}
        onFocus={scheduleOpen}
        onBlur={scheduleClose}
      >
        {trigger}
      </span>

      {open && position
        ? createPortal(
            <div
              id={`${id}-content`}
              role="dialog"
              onMouseEnter={() => window.clearTimeout(timer.current)}
              onMouseLeave={scheduleClose}
              style={{ top: position.top, left: position.left }}
              className={twMerge(
                'fixed z-50 w-64 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300',
                translate,
                contentClassName,
              )}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
