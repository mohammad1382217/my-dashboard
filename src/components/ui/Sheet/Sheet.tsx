import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type SheetSide = 'start' | 'end' | 'top' | 'bottom'

export interface SheetProps {
  /** Whether the sheet is shown (controlled). */
  open: boolean
  /** Fires with the next open state (Escape, overlay click, close button). */
  onOpenChange: (open: boolean) => void
  /** Edge the sheet slides in from. `start`/`end` are RTL-aware. Defaults to "end". */
  side?: SheetSide
  /** Heading + accessible name. */
  title?: ReactNode
  /** Description under the title. */
  description?: ReactNode
  /** Body content. */
  children?: ReactNode
  /** Optional footer row. */
  footer?: ReactNode
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  /** Merged onto the sheet panel. */
  className?: string
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
}

const sideClasses: Record<SheetSide, string> = {
  start: 'inset-y-0 start-0 h-full w-80 max-w-[calc(100%-3rem)] border-e',
  end: 'inset-y-0 end-0 h-full w-80 max-w-[calc(100%-3rem)] border-s',
  top: 'inset-x-0 top-0 w-full max-h-[calc(100%-3rem)] border-b',
  bottom: 'inset-x-0 bottom-0 w-full max-h-[calc(100%-3rem)] border-t',
}

// Off-screen resting transform per side (legacy-safe shorthand; start/end flip in RTL).
const closedTransform: Record<SheetSide, string> = {
  start: 'transform-[translateX(-100%)] rtl:transform-[translateX(100%)]',
  end: 'transform-[translateX(100%)] rtl:transform-[translateX(-100%)]',
  top: 'transform-[translateY(-100%)]',
  bottom: 'transform-[translateY(100%)]',
}

const panelBase =
  'fixed z-10 flex flex-col gap-3 overflow-y-auto border-slate-200 bg-white p-6 text-slate-700 shadow-xl outline-none transition-transform duration-300 ease-out motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'

/**
 * A panel that slides in from a screen edge — a drawer for navigation, filters
 * or details. Same accessibility contract as the modal Dialog (portal, focus
 * trap, scroll lock, Escape + overlay close, focus restore), but anchored to a
 * `side`. `start`/`end` are RTL-aware; `top`/`bottom` give you sheets.
 */
export const Sheet = forwardRef<HTMLDivElement, SheetProps>(function Sheet(
  {
    open,
    onOpenChange,
    side = 'end',
    title,
    description,
    children,
    footer,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    closeLabel = 'Close',
    className,
  },
  ref,
) {
  const baseId = useId()
  const titleId = `${baseId}-title`
  const descId = `${baseId}-desc`

  const panelRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => panelRef.current as HTMLDivElement, [])

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    return () => previouslyFocused?.focus?.()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setVisible(false)
      return
    }
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [open])

  if (!open) return null

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      if (closeOnEscape) onOpenChange(false)
      return
    }
    if (event.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return
    const focusable = getFocusable(panel)
    if (focusable.length === 0) {
      event.preventDefault()
      panel.focus()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const rounded =
    side === 'start' ? 'rounded-e-2xl' : side === 'end' ? 'rounded-s-2xl' : side === 'top' ? 'rounded-b-2xl' : 'rounded-t-2xl'

  return createPortal(
    <div className="fixed inset-0 z-50" onKeyDown={handleKeyDown}>
      <div
        aria-hidden="true"
        onClick={() => closeOnOverlayClick && onOpenChange(false)}
        className={twMerge('absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out motion-reduce:transition-none', visible ? 'opacity-100' : 'opacity-0')}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={twMerge(panelBase, sideClasses[side], rounded, visible ? 'transform-[translate(0px,0px)]' : closedTransform[side], className)}
      >
        {title ? (
          <h2 id={titleId} className="text-lg font-semibold text-fg">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p id={descId} className="text-sm text-muted">
            {description}
          </p>
        ) : null}

        <div className="min-h-0 flex-1">{children}</div>

        {footer ? <div className="flex flex-wrap justify-end gap-2">{footer}</div> : null}

        {showCloseButton ? (
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={closeLabel}
            className="absolute end-4 top-4 rounded-md p-1 text-slate-400 outline-none transition-[color,background-color,border-color,box-shadow,transform] hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-primary-500/40 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  )
})
