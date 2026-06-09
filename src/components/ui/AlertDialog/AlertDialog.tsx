import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AlertDialogProps {
  /** Whether the dialog is shown (controlled). */
  open: boolean
  /** Fires with the next open state (Escape, Cancel, or after Confirm). */
  onOpenChange: (open: boolean) => void
  /** Required heading and accessible name. */
  title: ReactNode
  /** Explanatory body / accessible description. */
  description?: ReactNode
  /** Extra body content between the description and the actions. */
  children?: ReactNode
  /** Cancel button text. Defaults to "Cancel". */
  cancelText?: ReactNode
  /** Confirm button text. Defaults to "Continue". */
  confirmText?: ReactNode
  /** Called when the confirm action is chosen (the dialog then closes). */
  onConfirm?: () => void
  /** Called when cancelled / dismissed. */
  onCancel?: () => void
  /** Style the confirm button as destructive (red) and use the warning icon. */
  destructive?: boolean
  /** Override the header icon. Defaults to a warning/question glyph; pass null to hide. */
  icon?: ReactNode
  /** Merged onto the panel. */
  className?: string
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
}

const panelBase =
  'relative z-10 flex w-full max-w-md flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-xl outline-none transition-all duration-200 ease-out motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'

const cancelBtn =
  'inline-flex h-10 w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500/30 sm:w-auto dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'

const confirmBtnBase = 'inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium text-white outline-none transition-colors focus-visible:ring-2 sm:w-auto'
const confirmDefault = 'bg-slate-900 hover:bg-slate-800 focus-visible:ring-slate-900/30 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white'
const confirmDestructive = 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-600/30'

// Default header glyphs (inline SVG — AlertDialog is a base component).
const warningGlyph = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)
const questionGlyph = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </svg>
)

/**
 * A modal confirmation (`role="alertdialog"`) that interrupts the user for a
 * decision. Unlike Dialog, it is deliberately distinct: a coloured icon badge
 * leads the message, it has NO close (X) button and does NOT dismiss on overlay
 * click — a Cancel or Confirm choice is required (Escape still cancels). Focus
 * lands on the safe Cancel button and is trapped; `destructive` flags dangerous
 * confirms in red. Actions stack full-width on small screens.
 */
export const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(function AlertDialog(
  { open, onOpenChange, title, description, children, cancelText = 'Cancel', confirmText = 'Continue', onConfirm, onCancel, destructive = false, icon, className },
  ref,
) {
  const baseId = useId()
  const titleId = `${baseId}-title`
  const descId = `${baseId}-desc`

  const panelRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => panelRef.current as HTMLDivElement, [])

  const [visible, setVisible] = useState(false)

  // Focus the (safe) Cancel button on open; restore focus to the opener on close.
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    cancelRef.current?.focus()
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

  function cancel() {
    onCancel?.()
    onOpenChange(false)
  }

  function confirm() {
    onConfirm?.()
    onOpenChange(false)
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      cancel()
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

  const showIcon = icon !== null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={handleKeyDown}>
      <div aria-hidden="true" className={twMerge('absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ease-out motion-reduce:transition-none', visible ? 'opacity-100' : 'opacity-0')} />

      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={twMerge(panelBase, visible ? 'opacity-100 transform-[scale(1)]' : 'opacity-0 transform-[scale(0.97)]', className)}
      >
        <div className="flex gap-4">
          {showIcon ? (
            <span
              aria-hidden="true"
              className={twMerge(
                'flex size-10 shrink-0 items-center justify-center rounded-full',
                destructive ? 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
              )}
            >
              {icon ?? (destructive ? warningGlyph : questionGlyph)}
            </span>
          ) : null}

          <div className="flex min-w-0 flex-col gap-1.5 pt-1">
            <h2 id={titleId} className="text-base font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="text-sm text-slate-500 dark:text-zinc-400">
                {description}
              </p>
            ) : null}
            {children}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" onClick={cancel} className={cancelBtn}>
            {cancelText}
          </button>
          <button type="button" onClick={confirm} className={twMerge(confirmBtnBase, destructive ? confirmDestructive : confirmDefault)}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
})
