import { forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

/* -------------------------------------------------------------------------------------------------
 * Data-driven Accordion
 * -------------------------------------------------------------------------------------------------
 * Public surface is a single component fed an `items` array — the simplest ergonomics for a
 * dashboard:
 *
 *   <Accordion type="single" defaultOpen="a" items={[{ id: 'a', title, content }]} />
 *
 * Each header is a real <button> wrapped in a heading element (<h3> by default, configurable via
 * `headingLevel`), so it follows the WAI-ARIA accordion pattern. The button gives us Enter/Space
 * activation, focus and the native `disabled` state for free; we wire aria-expanded + aria-controls
 * on top. Each panel is a region labelled by its header. Arrow keys rove focus between enabled
 * headers, Home/End jump to the first/last.
 *
 * ANIMATION (legacy floor: Chrome 49 / Android 5):
 *   - The panel animates a JS-MEASURED max-height (read via scrollHeight on a ref) together with
 *     opacity. max-height + opacity transitions work everywhere on our targets — unlike animating
 *     grid-template-rows (Chrome 107+) or height:auto interpolation (very new), which silently snap
 *     on old phones.
 *   - The chevron rotates with an EXPLICIT transform shorthand: the arbitrary
 *     "transform-[rotate(...)]" utility, which compiles to a plain
 *     `transform: rotate(180deg)`. We deliberately do NOT use Tailwind's rotate
 *     utility: in Tailwind v4 it emits the individual CSS `rotate` property
 *     (Chrome 104+) plus @property-based custom-property transform vars, neither
 *     of which Lightning CSS can polyfill — so the chevron would snap on the
 *     old-engine floor. The `transform` shorthand has been supported since
 *     Chrome 36 / Android 4.4 and downlevels safely.
 *   - The transition DURATION lives in one constant (TRANSITION_MS) that drives BOTH the JS timer
 *     and an inline `transitionDuration` style. Because the inline style wins over any utility
 *     class, a consumer overriding `duration-*` via className can never desync the CSS tween from
 *     the JS-driven cap release / collapse timing.
 * -----------------------------------------------------------------------------------------------*/

/** A single accordion entry in the data-driven `items` array. */
export interface AccordionItem {
  /** Stable, unique identifier — the controlled value and the basis for ARIA ids. */
  id: string
  /** Header content rendered inside the trigger <button>. */
  title: ReactNode
  /** Panel content revealed when the item is open. */
  content: ReactNode
  /** Disables this item's trigger. */
  disabled?: boolean
  /** Hide the built-in chevron for just this row (e.g. to supply a custom indicator in `title`). */
  hideChevron?: boolean
}

/** Heading element the trigger <button> is wrapped in, so it fits the document outline. */
export type AccordionHeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface AccordionBaseProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  /** The rows to render. */
  items: AccordionItem[]
  /** Heading level wrapping every trigger. Defaults to "h3". */
  headingLevel?: AccordionHeadingLevel
  /** Hide the built-in chevron on every row. A per-item `hideChevron` overrides this. */
  hideChevron?: boolean
}

interface AccordionSingleProps extends AccordionBaseProps {
  /** Only one item open at a time. Defaults to "single". */
  type?: 'single'
  /** Allow re-clicking the open item to close it. Defaults to true. */
  collapsible?: boolean
  /** Uncontrolled initial open item (`null` = all closed). */
  defaultOpen?: string | null
  /** Controlled open item (`null` = all closed). */
  open?: string | null
  /** Fires with the next open item whenever it changes. */
  onOpenChange?: (open: string | null) => void
}

interface AccordionMultipleProps extends AccordionBaseProps {
  /** Any number of items open at once. */
  type: 'multiple'
  collapsible?: never
  /** Uncontrolled initial set of open items. */
  defaultOpen?: string[]
  /** Controlled set of open items. */
  open?: string[]
  /** Fires with the next set of open items whenever it changes. */
  onOpenChange?: (open: string[]) => void
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps

/**
 * Relaxed, mode-agnostic view of the discriminated union used internally.
 * Casting props to the *intersection* of both variants collapses `type` to
 * `'single' & 'multiple'` (i.e. `never`); modelling the resolved shape lets us
 * normalise the open value through `toOpenSet` without `any`.
 */
type ResolvedAccordionProps = AccordionBaseProps & {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  defaultOpen?: string | string[] | null
  open?: string | string[] | null
  onOpenChange?: (open: string | string[] | null) => void
}

const containerBase =
  'divide-y divide-neutral-200 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none'

const triggerBase =
  'flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm font-medium text-neutral-900 outline-none transition-[color,background-color,border-color,box-shadow,transform] hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900/30 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800 dark:focus-visible:ring-zinc-100/30'

const panelInnerBase = 'px-4 pb-4 pt-0 text-sm text-muted'

// Single source of truth for the open/close duration. Used by the JS timer that
// releases the open cap / marks the close complete AND injected as an inline
// `transitionDuration` so the CSS tween can never desync from the timer (the
// inline style wins over any `duration-*` utility a consumer adds via className).
const TRANSITION_MS = 200

/** Normalise either public open shape (string | string[] | null) into a list. */
function toOpenSet(
  type: 'single' | 'multiple',
  value: string | string[] | null | undefined,
): string[] {
  if (type === 'multiple') return Array.isArray(value) ? value : []
  return typeof value === 'string' ? [value] : []
}

interface AccordionRowProps {
  item: AccordionItem
  isOpen: boolean
  headingLevel: AccordionHeadingLevel
  hideChevron: boolean
  onToggle: () => void
  onKeyDown: (event: ReactKeyboardEvent<HTMLButtonElement>) => void
}

/**
 * One collapsible row — private to this file (the public surface is the
 * data-driven <Accordion>). The panel stays mounted and animates a measured
 * max-height; `hidden` (bound to open state, not animation completion) removes
 * it from the a11y tree and tab order while closed.
 */
const AccordionRow = forwardRef<HTMLButtonElement, AccordionRowProps>(function AccordionRow(
  { item, isOpen, headingLevel, hideChevron, onToggle, onKeyDown },
  ref,
) {
  const reactId = useId()
  const triggerId = `${reactId}-trigger`
  const panelId = `${reactId}-panel`

  const Heading = headingLevel

  const innerRef = useRef<HTMLDivElement | null>(null)
  // undefined (open + settled, uncapped → no clipping ceiling) | number px
  // (animating) | 0 (collapsed).
  const [maxHeight, setMaxHeight] = useState<number | undefined>(isOpen ? undefined : 0)
  // Skip animating the very first commit so an initially-open item just shows.
  const didMount = useRef(false)

  useEffect(() => {
    const inner = innerRef.current
    if (inner === null) return

    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (isOpen) {
      // Opening: animate 0 -> measured height, then RELEASE the cap to `undefined`
      // (no max-height at all) so the open panel can grow freely with later
      // content reflow (responsive wrapping, async data) — there is no fixed
      // ceiling to clip against. A timer (not transitionend, which is unreliable
      // in jsdom and on flaky old engines) does the release, keeping the state
      // machine deterministic everywhere.
      setMaxHeight(inner.scrollHeight)
      const timer = window.setTimeout(() => setMaxHeight(undefined), TRANSITION_MS)
      return () => window.clearTimeout(timer)
    }

    // Closing: pin the current pixel height (so we transition from a concrete
    // value, not the uncapped/auto height), force a reflow to commit it, then
    // collapse to 0 on the next frame.
    setMaxHeight(inner.scrollHeight)
    void inner.scrollHeight // force reflow
    const raf = window.requestAnimationFrame(() => setMaxHeight(0))
    return () => window.cancelAnimationFrame(raf)
  }, [isOpen])

  return (
    <div>
      <Heading className="m-0">
        <button
          ref={ref}
          type="button"
          id={triggerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          disabled={item.disabled}
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className={triggerBase}
        >
          <span className="min-w-0 flex-1">{item.title}</span>
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
              // Explicit `transform` shorthand (NOT the Tailwind rotate utility,
              // which emits the modern individual `rotate` property + @property vars
              // that Lightning CSS can't polyfill and that snap on the old engines).
              className={twMerge(
                'shrink-0 text-neutral-400 transition-transform duration-200 ease-out',
                isOpen ? 'transform-[rotate(180deg)]' : 'transform-[rotate(0deg)]',
              )}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </button>
      </Heading>

      <div
        role="region"
        id={panelId}
        aria-labelledby={triggerId}
        hidden={!isOpen}
        // Inline duration keeps the CSS tween locked to TRANSITION_MS regardless of
        // any `duration-*` class a consumer adds, so it never desyncs from the timer.
        style={{
          maxHeight: maxHeight === undefined ? undefined : `${maxHeight}px`,
          transitionDuration: `${TRANSITION_MS}ms`,
        }}
        className={twMerge(
          'overflow-hidden transition-[max-height,opacity] ease-out motion-reduce:transition-none',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div ref={innerRef} className={panelInnerBase}>
          {item.content}
        </div>
      </div>
    </div>
  )
})

/**
 * Data-driven, WAI-ARIA accordion. Pass `items={[{ id, title, content }]}` and a
 * `type` of `"single"` (default, with optional `collapsible`) or `"multiple"`.
 *
 * Controlled via `open` + `onOpenChange`, or uncontrolled via `defaultOpen`.
 * Each header is a real <button> inside a heading (`headingLevel`, default "h3").
 * Keyboard: Enter/Space toggle (native button); ArrowUp/ArrowDown rove focus
 * between enabled headers, Home/End jump to first/last. `className` is merged
 * last with `twMerge` so consumer overrides win.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  const {
    items,
    type = 'single',
    collapsible = true,
    headingLevel = 'h3',
    hideChevron = false,
    defaultOpen,
    open,
    onOpenChange,
    className,
    ...rest
  } = props as ResolvedAccordionProps

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState<string[]>(() => toOpenSet(type, defaultOpen))
  const openSet = isControlled ? toOpenSet(type, open) : internalOpen

  // One ref per trigger so arrow-key roving focus can reach its siblings.
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])

  const emit = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalOpen(next)
      if (onOpenChange === undefined) return
      if (type === 'multiple') {
        ;(onOpenChange as (value: string[]) => void)(next)
      } else {
        ;(onOpenChange as (value: string | null) => void)(next[0] ?? null)
      }
    },
    [isControlled, onOpenChange, type],
  )

  const toggle = useCallback(
    (id: string) => {
      const currentlyOpen = openSet.indexOf(id) !== -1
      if (type === 'multiple') {
        emit(currentlyOpen ? openSet.filter((value) => value !== id) : [...openSet, id])
        return
      }
      // single mode
      if (currentlyOpen) {
        emit(collapsible ? [] : openSet)
      } else {
        emit([id])
      }
    },
    [collapsible, emit, openSet, type],
  )

  const focusByOffset = useCallback(
    (fromIndex: number, direction: 1 | -1) => {
      const count = items.length
      for (let step = 1; step <= count; step++) {
        // `+ count` before the modulo keeps the index non-negative for -1 steps.
        const nextIndex = (((fromIndex + direction * step) % count) + count) % count
        if (!items[nextIndex].disabled) {
          triggerRefs.current[nextIndex]?.focus()
          return
        }
      }
    },
    [items],
  )

  const focusAtEdge = useCallback(
    (edge: 'first' | 'last') => {
      const count = items.length
      for (let i = 0; i < count; i++) {
        const index = edge === 'first' ? i : count - 1 - i
        if (!items[index].disabled) {
          triggerRefs.current[index]?.focus()
          return
        }
      }
    },
    [items],
  )

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          focusByOffset(index, 1)
          break
        case 'ArrowUp':
          event.preventDefault()
          focusByOffset(index, -1)
          break
        case 'Home':
          event.preventDefault()
          focusAtEdge('first')
          break
        case 'End':
          event.preventDefault()
          focusAtEdge('last')
          break
        default:
          break
      }
    },
    [focusAtEdge, focusByOffset],
  )

  // Drop refs to rows that no longer exist so a stale entry can't be focused.
  useEffect(() => {
    triggerRefs.current.length = items.length
  }, [items.length])

  return (
    <div ref={ref} className={twMerge(containerBase, className)} {...rest}>
      {items.map((item, index) => (
        <AccordionRow
          key={item.id}
          ref={(node) => {
            triggerRefs.current[index] = node
          }}
          item={item}
          isOpen={openSet.indexOf(item.id) !== -1}
          headingLevel={headingLevel}
          hideChevron={item.hideChevron ?? hideChevron}
          onToggle={() => toggle(item.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        />
      ))}
    </div>
  )
})
