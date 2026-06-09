import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface BottomSheetProps {
  /** Whether the sheet is shown (controlled). */
  open: boolean
  /** Fires with the next open state (Escape, overlay click, close button). */
  onOpenChange: (open: boolean) => void
  /** Title rendered as the heading + accessible name. */
  title?: ReactNode
  /** Description below the title. */
  description?: ReactNode
  /** Body content. */
  children?: ReactNode
  /** Optional footer row (usually actions). */
  footer?: ReactNode
  /** Close when the overlay is clicked. Defaults to true. */
  closeOnOverlayClick?: boolean
  /** Close on the Escape key. Defaults to true. */
  closeOnEscape?: boolean
  /** Accessible label for the close button. Defaults to "Close". */
  closeLabel?: string
  /** Merged onto the sheet panel. */
  className?: string
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

const panelBase =
  'relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col gap-3 overflow-y-auto rounded-t-2xl border-x border-t border-slate-200 bg-white p-5 pt-3 text-slate-700 shadow-xl outline-none transition-transform duration-300 ease-out motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'

/**
 * Bottom sheet: an accessible modal that slides up from the bottom edge in a
 * portal. Controlled via `open` + `onOpenChange`. Closes on Escape and overlay
 * click (opt-out-able), traps Tab focus, restores focus to the opener, locks
 * body scroll, and wires aria-modal / labelledby / describedby. Animates with a
 * transform (legacy-safe; respects reduced-motion).
 */
export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(function BottomSheet(
  { open, onOpenChange, title, description, children, footer, closeOnOverlayClick = true, closeOnEscape = true, closeLabel = 'Close', className },
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
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center" onKeyDown={handleKeyDown}>
      <div
        aria-hidden="true"
        onClick={() => closeOnOverlayClick && onOpenChange(false)}
        className={twMerge(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none',
          visible ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={twMerge(panelBase, visible ? 'transform-[translateY(0px)]' : 'transform-[translateY(100%)]', className)}
      >
        <div aria-hidden="true" className="mx-auto h-1.5 w-10 shrink-0 rounded-full bg-slate-300 dark:bg-zinc-700" />

        {title ? (
          <h2 id={titleId} className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p id={descId} className="text-sm text-slate-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}

        {children}

        {footer ? <div className="mt-2 flex flex-wrap justify-end gap-2">{footer}</div> : null}

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label={closeLabel}
          className="absolute end-4 top-3 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  )
})
