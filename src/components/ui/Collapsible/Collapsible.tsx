import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface CollapsibleProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Trigger content (the always-visible header). */
  trigger: ReactNode
  /** Controlled open state. */
  open?: boolean
  /** Uncontrolled initial open state. Defaults to false. */
  defaultOpen?: boolean
  /** Fires with the next open state when toggled. */
  onOpenChange?: (open: boolean) => void
  /** Disable the trigger. */
  disabled?: boolean
  /** Hide the built-in chevron. */
  hideChevron?: boolean
  /** Revealed content. */
  children?: ReactNode
}

const TRANSITION_MS = 200

const triggerBase =
  'flex w-full items-center justify-between gap-3 rounded-md px-1 py-2 text-start text-sm font-medium text-slate-900 outline-none transition-colors hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-100 dark:hover:text-zinc-300'

/**
 * A single show/hide region — like one accordion row on its own. Controlled via
 * `open` + `onOpenChange` or uncontrolled via `defaultOpen`. The panel animates a
 * JS-measured max-height + opacity (legacy-safe, unlike grid-rows/height:auto)
 * and is `hidden` from the a11y tree and tab order while closed.
 */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { trigger, open, defaultOpen = false, onOpenChange, disabled, hideChevron = false, children, className, ...props },
  ref,
) {
  const id = useId()
  const triggerId = `${id}-trigger`
  const panelId = `${id}-panel`

  const isControlled = open !== undefined
  const [internal, setInternal] = useState(defaultOpen)
  const isOpen = isControlled ? open : internal

  const innerRef = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState<number | undefined>(isOpen ? undefined : 0)
  const didMount = useRef(false)

  useEffect(() => {
    const inner = innerRef.current
    if (inner === null) return
    if (!didMount.current) {
      didMount.current = true
      return
    }
    if (isOpen) {
      setMaxHeight(inner.scrollHeight)
      const timer = window.setTimeout(() => setMaxHeight(undefined), TRANSITION_MS)
      return () => window.clearTimeout(timer)
    }
    setMaxHeight(inner.scrollHeight)
    void inner.scrollHeight
    const raf = window.requestAnimationFrame(() => setMaxHeight(0))
    return () => window.cancelAnimationFrame(raf)
  }, [isOpen])

  function toggle() {
    const next = !isOpen
    if (!isControlled) setInternal(next)
    onOpenChange?.(next)
  }

  return (
    <div ref={ref} className={twMerge('w-full', className)} {...props}>
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        disabled={disabled}
        onClick={toggle}
        className={triggerBase}
      >
        <span className="min-w-0 flex-1">{trigger}</span>
        {hideChevron ? null : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={twMerge('shrink-0 text-slate-400 transition-transform duration-200 ease-out', isOpen ? 'transform-[rotate(180deg)]' : 'transform-[rotate(0deg)]')}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </button>

      <div
        role="region"
        id={panelId}
        aria-labelledby={triggerId}
        hidden={!isOpen}
        style={{ maxHeight: maxHeight === undefined ? undefined : `${maxHeight}px`, transitionDuration: `${TRANSITION_MS}ms` }}
        className={twMerge('overflow-hidden transition-[max-height,opacity] ease-out motion-reduce:transition-none', isOpen ? 'opacity-100' : 'opacity-0')}
      >
        <div ref={innerRef} className="px-1 py-2 text-sm text-slate-600 dark:text-zinc-400">
          {children}
        </div>
      </div>
    </div>
  )
})
