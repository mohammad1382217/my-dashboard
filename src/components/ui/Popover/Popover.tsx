import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface PopoverProps {
  /** Trigger button content. */
  trigger: ReactNode
  /** Floating content. */
  children: ReactNode
  /** Horizontal alignment of the panel relative to the trigger. Defaults to "center". */
  align?: 'start' | 'center' | 'end'
  /** Gap between trigger and panel, in px. Defaults to 8. */
  sideOffset?: number
  /** Merged onto the trigger button. */
  className?: string
  /** Merged onto the floating panel. */
  contentClassName?: string
}

type Position = { top: number; left: number }

const triggerClass =
  'inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-[color,background-color,border-color,box-shadow,transform] hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-primary-500/30 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'

/**
 * A click-triggered floating panel rendered in a portal (so it escapes clipped
 * ancestors). Opens on click, closes on outside-click and Escape, restoring
 * focus to the trigger. Positioned under the trigger with `align`; stays
 * anchored on scroll/resize. Put arbitrary content inside.
 */
export const Popover = forwardRef<HTMLButtonElement, PopoverProps>(function Popover(
  { trigger, children, align = 'center', sideOffset = 8, className, contentClassName },
  ref,
) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, [])

  function computePosition(): Position | null {
    const node = triggerRef.current
    if (!node) return null
    const rect = node.getBoundingClientRect()
    const top = rect.bottom + sideOffset
    if (align === 'start') return { top, left: rect.left }
    if (align === 'end') return { top, left: rect.right }
    return { top, left: rect.left + rect.width / 2 }
  }

  function openPopover() {
    setPosition(computePosition())
    setOpen(true)
  }

  function close(focusTrigger = true) {
    setOpen(false)
    if (focusTrigger) triggerRef.current?.focus()
  }

  // Move focus into the panel on open.
  useEffect(() => {
    if (open) contentRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) return
      setOpen(false)
    }
    function reposition() {
      setPosition(computePosition())
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Horizontal anchor: translate the panel so `left` is its start/center/end.
  const translate = align === 'center' ? 'transform-[translateX(-50%)]' : align === 'end' ? 'transform-[translateX(-100%)] rtl:transform-[translateX(0)]' : 'rtl:transform-[translateX(-100%)]'

  function onContentKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? `${id}-content` : undefined}
        onClick={() => (open ? close() : openPopover())}
        className={twMerge(triggerClass, className)}
      >
        {trigger}
      </button>

      {open && position
        ? createPortal(
            <div
              ref={contentRef}
              id={`${id}-content`}
              role="dialog"
              tabIndex={-1}
              onKeyDown={onContentKeyDown}
              style={{ top: position.top, left: position.left }}
              className={twMerge(
                'fixed z-50 w-72 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-lg outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300',
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
})
